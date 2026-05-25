import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { env, isAuthConfigured } from "@/lib/env";

/**
 * Refreshes the Supabase auth cookies on every request. Without this, the
 * access-token cookie can expire mid-session and the server clients would
 * return `null` users on otherwise-authenticated requests.
 *
 * Call from `middleware.ts` at the project root.
 */
export async function updateSupabaseSession(request: NextRequest) {
  // When auth isn't configured we still return a passthrough response so
  // middleware never blocks the request.
  if (!isAuthConfigured()) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // Touch the user — this triggers token refresh when needed.
  await supabase.auth.getUser();

  return response;
}
