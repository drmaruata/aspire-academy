"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Lazy, singleton Supabase client for **Client Components**.
 *
 * Uses the `anon` public key — never call admin endpoints from here.
 * Session is stored in cookies so SSR + CSR see the same auth state.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function createBrowserSupabase(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  if (!url || !anonKey) {
    throw new Error(
      "Supabase browser client requested but NEXT_PUBLIC_SUPABASE_URL / " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY are missing."
    );
  }
  _client = createBrowserClient(url, anonKey);
  return _client;
}
