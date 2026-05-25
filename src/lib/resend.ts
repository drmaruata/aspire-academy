import "server-only";

import { Resend } from "resend";
import { env } from "@/lib/env";

let _resend: Resend | null = null;

export function getResend(): Resend {
  if (_resend) return _resend;
  if (!env.resendApiKey) {
    throw new Error(
      "Resend client requested but RESEND_API_KEY is missing. Set it in .env.local."
    );
  }
  _resend = new Resend(env.resendApiKey);
  return _resend;
}
