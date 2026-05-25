import "server-only";

import Razorpay from "razorpay";
import { env, isPaymentsConfigured } from "@/lib/env";

let _client: Razorpay | null = null;

export function getRazorpay(): Razorpay {
  if (_client) return _client;
  if (!isPaymentsConfigured()) {
    throw new Error(
      "Razorpay client requested but env vars are missing. " +
        "Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local."
    );
  }
  _client = new Razorpay({
    key_id: env.razorpayKeyId,
    key_secret: env.razorpayKeySecret,
  });
  return _client;
}
