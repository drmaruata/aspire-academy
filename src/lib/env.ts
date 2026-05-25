/**
 * Typed access to environment variables.
 *
 * This module never throws — instead, server actions check `isFormsLive()`
 * and downgrade to a stub mode (dev-friendly) when essentials are missing.
 */

const trimOrEmpty = (v: string | undefined) => (v ?? "").trim();

export const env = {
  supabaseUrl: trimOrEmpty(process.env.NEXT_PUBLIC_SUPABASE_URL),
  supabaseServiceRoleKey: trimOrEmpty(process.env.SUPABASE_SERVICE_ROLE_KEY),

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
