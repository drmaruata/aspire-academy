import { type NextRequest } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSupabaseSession(request);
}

export const config = {
  /**
   * Run on every page request except static assets, the Studio (which has
   * its own auth) and Razorpay webhook (which authenticates via signature,
   * not cookies). Image / font / favicon paths are excluded for speed.
   */
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|studio|api/razorpay/webhook|api/sanity|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
