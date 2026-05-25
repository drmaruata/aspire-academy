import { NextResponse, type NextRequest } from "next/server";

import { isAuthConfigured } from "@/lib/env";
import { createServerSupabase } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/auth/user";

/**
 * Email confirmation / OAuth callback.
 *
 * Supabase redirects here with `?code=...` after a user clicks the link in
 * their inbox. We exchange the code for a session (which the server client
 * writes back into the response cookies via the middleware) and then send
 * them to their original destination.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"));

  if (!isAuthConfigured()) {
    return NextResponse.redirect(`${origin}/sign-in`);
  }

  if (code) {
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("[auth:callback] code exchange failed", error);
      return NextResponse.redirect(
        `${origin}/sign-in?error=${encodeURIComponent(error.message)}`
      );
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
