import { NextResponse, type NextRequest } from "next/server";

import { env } from "@/lib/env";
import { verifyWebhookSignature } from "@/lib/razorpay/signature";
import { logPaymentEvent, upsertEnrollment } from "@/lib/enrollments";

export const runtime = "nodejs";

/**
 * Razorpay → Next.js server webhook.
 *
 * Configure in Dashboard → Settings → Webhooks:
 *   - URL:      https://<your-site>/api/razorpay/webhook
 *   - Secret:   same value as RAZORPAY_WEBHOOK_SECRET
 *   - Events:   payment.captured, payment.failed, order.paid, refund.created
 *
 * This is the **source of truth** for enrollment status. The /verify route
 * is a best-effort optimistic update from the user's browser — the webhook
 * lands the final state even if the user closes the tab.
 */
export async function POST(req: NextRequest) {
  if (!env.razorpayWebhookSecret) {
    return new NextResponse("RAZORPAY_WEBHOOK_SECRET not configured.", {
      status: 503,
    });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  let event: RazorpayWebhookEvent;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return new NextResponse("Invalid JSON", { status: 400 });
  }

  const eventType = event.event ?? "unknown";
  const payment = event.payload?.payment?.entity;
  const order = event.payload?.order?.entity;

  const orderId = payment?.order_id ?? order?.id ?? null;
  const paymentId = payment?.id ?? null;

  // Always log the event for auditing.
  await logPaymentEvent({
    eventId: event.id ?? null,
    eventType,
    orderId,
    paymentId,
    payload: event,
  });

  // Handle the events we care about.
  if (eventType === "payment.captured" || eventType === "order.paid") {
    await handleSuccess(payment, order);
  } else if (eventType === "payment.failed") {
    await handleFailure(payment, order);
  }
  // refund.* events are recorded but no enrollment status change for now.

  return NextResponse.json({ ok: true });
}

async function handleSuccess(
  payment: RazorpayPaymentEntity | undefined,
  order: RazorpayOrderEntity | undefined
) {
  const orderId = payment?.order_id ?? order?.id;
  if (!orderId) return;

  const notes = (payment?.notes ?? order?.notes ?? {}) as Record<string, unknown>;
  const userId = typeof notes.user_id === "string" ? notes.user_id : null;
  const courseSlug =
    typeof notes.course_slug === "string" ? notes.course_slug : "unknown";
  const courseName =
    typeof notes.course_name === "string" ? notes.course_name : "Unknown course";
  const amountPaise = Number(payment?.amount ?? order?.amount ?? 0);

  if (!userId) {
    console.warn("[webhook] success event without user_id note", { orderId });
    return;
  }

  await upsertEnrollment({
    userId,
    courseSlug,
    courseName,
    amountPaise,
    status: "active",
    orderId,
    paymentId: payment?.id ?? null,
    notes: { source: "webhook" },
    verifiedAt: new Date().toISOString(),
  });
}

async function handleFailure(
  payment: RazorpayPaymentEntity | undefined,
  order: RazorpayOrderEntity | undefined
) {
  const orderId = payment?.order_id ?? order?.id;
  if (!orderId) return;

  const notes = (payment?.notes ?? order?.notes ?? {}) as Record<string, unknown>;
  const userId = typeof notes.user_id === "string" ? notes.user_id : null;
  const courseSlug =
    typeof notes.course_slug === "string" ? notes.course_slug : "unknown";
  const courseName =
    typeof notes.course_name === "string" ? notes.course_name : "Unknown course";
  const amountPaise = Number(payment?.amount ?? order?.amount ?? 0);

  if (!userId) return;

  await upsertEnrollment({
    userId,
    courseSlug,
    courseName,
    amountPaise,
    status: "failed",
    orderId,
    paymentId: payment?.id ?? null,
    notes: { source: "webhook", error: payment?.error_description ?? null },
  });
}

type RazorpayPaymentEntity = {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  status?: string;
  notes?: Record<string, unknown>;
  error_description?: string;
};

type RazorpayOrderEntity = {
  id: string;
  amount: number;
  currency: string;
  status?: string;
  notes?: Record<string, unknown>;
};

type RazorpayWebhookEvent = {
  id?: string;
  event: string;
  payload?: {
    payment?: { entity?: RazorpayPaymentEntity };
    order?: { entity?: RazorpayOrderEntity };
    refund?: { entity?: unknown };
  };
};
