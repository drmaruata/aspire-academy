import "server-only";

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

import { env } from "@/lib/env";

/**
 * Cookie-bound Supabase client for **Server Components, Server Actions
 * and Route Handlers**.
 *
 * Reads + writes the session cookies via Next.js's request/response cookie
 * API so RLS knows who the current user is.
 */
export async function createServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options as CookieOptions);
          }
        } catch {
          // Server Components can't set cookies; safe to ignore — the
          // middleware refreshes the session on the next request.
        }
      },
    },
  });
}
