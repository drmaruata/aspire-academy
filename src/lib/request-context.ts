import "server-only";

import { headers } from "next/headers";

/**
 * Best-effort client IP extraction for server actions.
 * Works on Vercel (x-forwarded-for / x-real-ip) and most reverse proxies.
 */
export async function getClientIp(): Promise<string | null> {
  const h = await headers();
  const xff = h.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return h.get("x-real-ip") ?? null;
}

export async function getUserAgent(): Promise<string | null> {
  const h = await headers();
  return h.get("user-agent") ?? null;
}
