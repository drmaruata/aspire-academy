import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

let _admin: SupabaseClient | null = null;

/**
 * Server-only Supabase client using the **service role** key.
 *
 * Bypasses RLS — only call from server actions / route handlers, never
 * from a Client Component. Never expose the key with `NEXT_PUBLIC_`.
 *
 * Used by:
 *   • Phase 2 forms (newsletter / lead inserts)
 *   • Phase 4 Razorpay /verify and /webhook routes (enrollment writes)
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (_admin) return _admin;

  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    throw new Error(
      "Supabase admin client requested but env vars are missing. " +
        "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local."
    );
  }

  _admin = createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-application": "aspire-academy-website" } },
  });

  return _admin;
}
