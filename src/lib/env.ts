/**
 * Typed access to environment variables.
 *
 * This module never throws — instead, server actions check `isFormsLive()`
 * and downgrade to a stub mode (dev-friendly) when essentials are missing.
 */

const trimOrEmpty = (v: string | undefined) => (v ?? "").trim();

export const env = {
  supabaseUrl: trimOrEmpty(process.env.NEXT_PUBLIC_SUPABASE_URL),
  supabaseAnonKey: trimOrEmpty(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  supabaseServiceRoleKey: trimOrEmpty(process.env.SUPABASE_SERVICE_ROLE_KEY),

  /* ── Razorpay (Phase 4) ── */
  razorpayKeyId: trimOrEmpty(process.env.RAZORPAY_KEY_ID),
  razorpayKeySecret: trimOrEmpty(process.env.RAZORPAY_KEY_SECRET),
  razorpayWebhookSecret: trimOrEmpty(process.env.RAZORPAY_WEBHOOK_SECRET),
  /** Safe to expose in the browser — needed to open Razorpay's checkout modal. */
  razorpayPublicKeyId: trimOrEmpty(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID),

  /** Public site origin — used to build absolute redirect URLs for OAuth / email callbacks. */
  siteUrl:
    trimOrEmpty(process.env.NEXT_PUBLIC_SITE_URL) ||
    "http://localhost:3100",

  resendApiKey: trimOrEmpty(process.env.RESEND_API_KEY),
  emailFrom: trimOrEmpty(process.env.EMAIL_FROM) ||
    "Aspire Academy Mizo <hello@aspireacademymizo.com>",
  emailReplyTo: trimOrEmpty(process.env.EMAIL_REPLY_TO) ||
    "hello@aspireacademymizo.com",
  emailAdminTo: trimOrEmpty(process.env.EMAIL_ADMIN_TO) ||
    "team@aspireacademymizo.com",

  /** Explicit dev escape hatch. `1` / `true` means stub all real I/O. */
  stubForms:
    trimOrEmpty(process.env.AAM_STUB_FORMS).toLowerCase() === "1" ||
    trimOrEmpty(process.env.AAM_STUB_FORMS).toLowerCase() === "true",

  /* ── Sanity (Phase 3) ── */
  sanityProjectId: trimOrEmpty(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID),
  sanityDataset: trimOrEmpty(process.env.NEXT_PUBLIC_SANITY_DATASET) || "production",
  sanityApiVersion:
    trimOrEmpty(process.env.NEXT_PUBLIC_SANITY_API_VERSION) || "2026-02-01",
  sanityReadToken: trimOrEmpty(process.env.SANITY_API_READ_TOKEN),
  sanityRevalidateSecret: trimOrEmpty(process.env.SANITY_REVALIDATE_SECRET),

  isProd: process.env.NODE_ENV === "production",
  isDev: process.env.NODE_ENV !== "production",
} as const;

/**
 * True when a Sanity project ID is configured. When false, the website falls
 * back to static placeholder content from `src/lib/data.ts`.
 */
export function isSanityConfigured(): boolean {
  return env.sanityProjectId.length > 0;
}

export type FormsCapability = "live" | "stub" | "missing";

/**
 * Decide how the form server actions should behave:
 *
 * - `live`   — all envs are set; do real DB writes + email sends
 * - `stub`   — dev-only mode that logs to console and returns success
 * - `missing`— production with missing envs; return user-friendly error
 */
export function formsCapability(): FormsCapability {
  if (env.stubForms) return "stub";

  const hasDb = env.supabaseUrl && env.supabaseServiceRoleKey;
  const hasMail = env.resendApiKey;

  if (hasDb && hasMail) return "live";
  if (env.isDev) return "stub";
  return "missing";
}

/**
 * True when Supabase auth is wired up. Sign-in / sign-up pages and the
 * dashboard need both the URL and the anon key (used by the browser /
 * cookie-based clients to talk to Supabase).
 */
export function isAuthConfigured(): boolean {
  return env.supabaseUrl.length > 0 && env.supabaseAnonKey.length > 0;
}

/**
 * True when Razorpay is fully wired (server SDK + public key for the
 * checkout modal). Webhook secret is checked separately by the webhook
 * route — production deployments should set all four values.
 */
export function isPaymentsConfigured(): boolean {
  return (
    env.razorpayKeyId.length > 0 &&
    env.razorpayKeySecret.length > 0 &&
    (env.razorpayPublicKeyId || env.razorpayKeyId).length > 0
  );
}

/** Public key id used by the browser. Falls back to the server key id. */
export function razorpayBrowserKey(): string {
  return env.razorpayPublicKeyId || env.razorpayKeyId;
}
