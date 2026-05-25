import "server-only";

import { getRazorpay } from "@/lib/razorpay/server";

export type CreateOrderInput = {
  amountPaise: number;
  receipt: string;
  notes: Record<string, string>;
};

export type CreatedOrder = {
  id: string;
  amount: number;
  currency: string;
  receipt?: string | null;
  status: string;
};

/**
 * Create a Razorpay order for a course enrollment. The order id is the
 * idempotency key we store in `enrollments.razorpay_order_id`.
 */
export async function createCourseOrder(
  input: CreateOrderInput
): Promise<CreatedOrder> {
  const rzp = getRazorpay();
  const order = await rzp.orders.create({
    amount: input.amountPaise,
    currency: "INR",
    receipt: input.receipt,
    notes: input.notes,
    payment_capture: true,
  });

  return {
    id: order.id,
    amount: Number(order.amount),
    currency: order.currency,
    receipt: order.receipt ?? null,
    status: order.status,
  };
}
