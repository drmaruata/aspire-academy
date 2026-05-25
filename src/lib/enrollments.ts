import "server-only";

import { getSupabaseAdmin } from "@/lib/supabase/service";

export type EnrollmentStatus = "pending" | "active" | "failed" | "refunded";

export type EnrollmentRow = {
  id: string;
  user_id: string;
  course_slug: string;
  course_name: string;
  amount_paise: number;
  currency: string;
  status: EnrollmentStatus;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  receipt: string | null;
  notes: Record<string, unknown> | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * Upsert an enrollment row, keyed by `razorpay_order_id`. Safe to call
 * from both the verify route AND the webhook — whoever arrives second is
 * a no-op (or just updates the status).
 */
export async function upsertEnrollment(input: {
  userId: string;
  courseSlug: string;
  courseName: string;
  amountPaise: number;
  currency?: string;
  status: EnrollmentStatus;
  orderId: string;
  paymentId?: string | null;
  signature?: string | null;
  receipt?: string | null;
  notes?: Record<string, unknown> | null;
  verifiedAt?: string | null;
}): Promise<EnrollmentRow | null> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("enrollments")
    .upsert(
      {
        user_id: input.userId,
        course_slug: input.courseSlug,
        course_name: input.courseName,
        amount_paise: input.amountPaise,
        currency: input.currency ?? "INR",
        status: input.status,
        razorpay_order_id: input.orderId,
        razorpay_payment_id: input.paymentId ?? null,
        razorpay_signature: input.signature ?? null,
        receipt: input.receipt ?? null,
        notes: input.notes ?? null,
        verified_at: input.verifiedAt ?? null,
      },
      { onConflict: "razorpay_order_id" }
    )
    .select()
    .maybeSingle();

  if (error) {
    console.error("[enrollments] upsert failed", error);
    return null;
  }
  return data as EnrollmentRow | null;
}

export async function listUserEnrollments(
  userId: string
): Promise<EnrollmentRow[]> {
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("enrollments")
    .select(
      "id, user_id, course_slug, course_name, amount_paise, currency, status, razorpay_order_id, razorpay_payment_id, razorpay_signature, receipt, notes, verified_at, created_at, updated_at"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[enrollments] list failed", error);
    return [];
  }
  return (data ?? []) as EnrollmentRow[];
}

export async function logPaymentEvent(input: {
  eventId?: string | null;
  eventType: string;
  orderId?: string | null;
  paymentId?: string | null;
  payload: unknown;
}): Promise<void> {
  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from("payment_events")
    .upsert(
      {
        event_id: input.eventId ?? null,
        event_type: input.eventType,
        razorpay_order_id: input.orderId ?? null,
        razorpay_payment_id: input.paymentId ?? null,
        payload: input.payload as object,
      },
      { onConflict: "event_id", ignoreDuplicates: true }
    );
  if (error) {
    console.error("[payment_events] insert failed", error);
  }
}
