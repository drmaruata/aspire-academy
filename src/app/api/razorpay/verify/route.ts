import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { env, isAuthConfigured, isPaymentsConfigured } from "@/lib/env";
import { getCurrentUser } from "@/lib/auth/user";
import { verifyPaymentSignature } from "@/lib/razorpay/signature";
import { getRazorpay } from "@/lib/razorpay/server";
import { upsertEnrollment } from "@/lib/enrollments";

const bodySchema = z.object({
  razorpay_payment_id: z.string().min(4),
  razorpay_order_id: z.string().min(4),
  razorpay_signature: z.string().min(20),
});

/**
 * Client-side success callback from Razorpay's modal.
 *
 * Verifies the HMAC signature, then upserts the enrollment row. The
 * webhook is the source of truth — we mark `status: 'active'` here on a
 * best-effort basis. Subsequent webhook events will keep the row in sync.
 */
export async function POST(req: NextRequest) {
  if (!isAuthConfigured() || !isPaymentsConfigured()) {
    return NextResponse.json(
      { ok: false, message: "Payments are not configured." },
      { status: 503 }
    );
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, message: "You must be signed in." },
      { status: 401 }
    );
  }

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Malformed payload." },
      { status: 400 }
    );
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    parsed.data;

  const valid = verifyPaymentSignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
  });

  if (!valid) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "Signature mismatch — payment will be reconciled via webhook.",
      },
      { status: 400 }
    );
  }

  // Re-fetch the order so we never trust client-supplied amount / course.
  let courseSlug = "unknown";
  let courseName = "Unknown course";
  let amountPaise = 0;
  try {
    const rzp = getRazorpay();
    const order = await rzp.orders.fetch(razorpay_order_id);
    amountPaise = Number(order.amount);
    if (order.notes && typeof order.notes === "object") {
      const notes = order.notes as Record<string, unknown>;
      if (typeof notes.course_slug === "string") courseSlug = notes.course_slug;
      if (typeof notes.course_name === "string") courseName = notes.course_name;
      if (typeof notes.user_id === "string" && notes.user_id !== user.id) {
        // Order doesn't belong to this user — reject.
        return NextResponse.json(
          { ok: false, message: "Order is not associated with this account." },
          { status: 403 }
        );
      }
    }
  } catch (err) {
    console.error("[verify] order fetch failed", err);
    return NextResponse.json(
      { ok: false, message: "Couldn't verify the order with Razorpay." },
      { status: 502 }
    );
  }

  const enrollment = await upsertEnrollment({
    userId: user.id,
    courseSlug,
    courseName,
    amountPaise,
    status: "active",
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
    notes: { source: "client-verify" },
    verifiedAt: new Date().toISOString(),
  });

  if (env.isDev) {
    console.log("[verify] enrollment upserted", enrollment?.id, courseSlug);
  }

  return NextResponse.json({ ok: true, enrollmentId: enrollment?.id });
}
