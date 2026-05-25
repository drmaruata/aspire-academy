"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { env, isAuthConfigured } from "@/lib/env";
import { createServerSupabase } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/auth/user";
import { signInSchema, signUpSchema } from "@/lib/schemas";

export type AuthState = {
  ok: boolean;
  message: string;
  field?: "email" | "password" | "fullName" | "phone" | "form";
};

const HONEYPOT_FIELD = "website";

/* ─────────────── Sign up ─────────────── */

export async function signUpAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  if (formData.get(HONEYPOT_FIELD)) {
    // Pretend it worked — spammers shouldn't get error feedback.
    return {
      ok: true,
      message: "Check your inbox to finish signing up.",
    };
  }

  if (!isAuthConfigured()) {
    return {
      ok: false,
      message:
        env.isDev
          ? "Auth is not configured — set NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local."
          : "Sign-up is temporarily unavailable. Please try again later.",
      field: "form",
    };
  }

  const parsed = signUpSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next"),
    website: formData.get(HONEYPOT_FIELD),
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const path = first?.path[0];
    const field =
      path === "fullName" || path === "phone" || path === "email" || path === "password"
        ? (path as AuthState["field"])
        : "form";
    return {
      ok: false,
      message: first?.message ?? "Please fix the errors above.",
      field,
    };
  }

  const { fullName, phone, email, password, next } = parsed.data;
  const supabase = await createServerSupabase();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, phone },
      emailRedirectTo: `${env.siteUrl}/auth/callback?next=${encodeURIComponent(
        safeNextPath(next)
      )}`,
    },
  });

  if (error) {
    return {
      ok: false,
      message: humaniseSupabaseError(error.message),
      field: "form",
    };
  }

  // When email confirmations are enabled, `data.session` is null and the
  // user must click the link in their inbox. Otherwise they get a session
  // immediately.
  if (!data.session) {
    return {
      ok: true,
      message:
        "Almost there — check your inbox and click the confirmation link to finish signing up.",
    };
  }

  revalidatePath("/", "layout");
  redirect(safeNextPath(next));
}

/* ─────────────── Sign in ─────────────── */

export async function signInAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  if (formData.get(HONEYPOT_FIELD)) {
    return { ok: false, message: "Something went wrong.", field: "form" };
  }

  if (!isAuthConfigured()) {
    return {
      ok: false,
      message:
        env.isDev
          ? "Auth is not configured — set NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local."
          : "Sign-in is temporarily unavailable. Please try again later.",
      field: "form",
    };
  }

  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next"),
    website: formData.get(HONEYPOT_FIELD),
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const path = first?.path[0];
    const field =
      path === "email" || path === "password" ? (path as AuthState["field"]) : "form";
    return {
      ok: false,
      message: first?.message ?? "Please check your details.",
      field,
    };
  }

  const { email, password, next } = parsed.data;
  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return {
      ok: false,
      message: humaniseSupabaseError(error.message),
      field: "form",
    };
  }

  revalidatePath("/", "layout");
  redirect(safeNextPath(next));
}

/* ─────────────── Sign out ─────────────── */

export async function signOutAction() {
  if (!isAuthConfigured()) {
    redirect("/");
  }
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

/* ─────────────── Helpers ─────────────── */

function humaniseSupabaseError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login")) return "Email or password is incorrect.";
  if (lower.includes("email not confirmed"))
    return "Please confirm your email before signing in (check your inbox).";
  if (lower.includes("user already registered") || lower.includes("already exists"))
    return "An account already exists for this email — try signing in instead.";
  if (lower.includes("rate limit"))
    return "Too many attempts. Please wait a minute and try again.";
  return message || "Something went wrong. Please try again.";
}
