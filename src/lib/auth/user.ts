import "server-only";

import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { isAuthConfigured } from "@/lib/env";
import { createServerSupabase } from "@/lib/supabase/server";

export type SessionUser = User;

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
};

/**
 * Returns the current authenticated user, or `null` if no session exists
 * (or auth is not configured).
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  if (!isAuthConfigured()) return null;
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return null;
  return data.user;
}

/**
 * Returns the current user OR redirects to /sign-in with a `next=` param.
 * Use from route handlers / RSCs that must be authenticated.
 */
export async function requireUser(nextPath = "/dashboard"): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    const search = new URLSearchParams({ next: nextPath });
    redirect(`/sign-in?${search.toString()}`);
  }
  return user;
}

/** Get the profile row for the current (or specified) user. */
export async function getProfile(userId: string): Promise<Profile | null> {
  if (!isAuthConfigured()) return null;
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, phone")
    .eq("id", userId)
    .maybeSingle();
  if (error) {
    console.error("[auth] getProfile failed", error);
    return null;
  }
  return (data as Profile) ?? null;
}

/** True if the URL path is safe to use as a post-login redirect target. */
export function safeNextPath(next: string | null | undefined): string {
  if (!next) return "/dashboard";
  if (!next.startsWith("/")) return "/dashboard";
  if (next.startsWith("//")) return "/dashboard";
  return next;
}
