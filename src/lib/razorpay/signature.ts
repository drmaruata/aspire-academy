import "server-only";

import crypto from "node:crypto";
import { env } from "@/lib/env";

/**
 * Verify the signature returned by Razorpay's client-side Checkout. This
 * proves the success payload came from Razorpay and wasn't forged by the
 * client.
 *
 * Docs: https://razorpay.com/docs/payments/server-integration/nodejs/payment-gateway/build-integration/#16-verify-payment-signature
 */
export function verifyPaymentSignature(input: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  if (!env.razorpayKeySecret) return false;
  const expected = crypto
    .createHmac("sha256", env.razorpayKeySecret)
    .update(`${input.orderId}|${input.paymentId}`)
    .digest("hex");
  return timingSafeEquals(expected, input.signature);
}

/**
 * Verify a webhook payload's `X-Razorpay-Signature` against the configured
 * webhook secret.
 *
 * Docs: https://razorpay.com/docs/webhooks/validate-test/
 */
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature || !env.razorpayWebhookSecret) return false;
  const expected = crypto
    .createHmac("sha256", env.razorpayWebhookSecret)
    .update(rawBody)
    .digest("hex");
  return timingSafeEquals(expected, signature);
}

function timingSafeEquals(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}
