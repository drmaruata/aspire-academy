"use server";

import { z } from "zod";
import { newsletterSchema } from "@/lib/schemas";
import { env, formsCapability } from "@/lib/env";
import { rateLimit, rateLimitGc } from "@/lib/rate-limit";
import { getClientIp, getUserAgent } from "@/lib/request-context";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getResend } from "@/lib/resend";
import { welcomeSubscriberEmail } from "@/lib/emails/templates";

export type NewsletterState = {
  ok: boolean;
  message: string;
  field?: "email" | "_form";
};

export async function subscribeNewsletter(
  _prev: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
  rateLimitGc();

  const raw = {
    email: String(formData.get("email") ?? ""),
    website: String(formData.get("website") ?? ""),
    source: String(formData.get("source") ?? "homepage-newsletter"),
  };

  // 1. Honeypot — silently succeed so bots can't probe the field name
  if (raw.website) {
    return { ok: true, message: "Thanks! Check your inbox to confirm." };
  }

  // 2. Validate
  const parsed = newsletterSchema.safeParse(raw);
  if (!parsed.success) {
    const err = (parsed.error as z.ZodError).issues[0];
    return {
      ok: false,
      message: err?.message ?? "Please enter a valid email.",
      field: "email",
    };
  }
  const { email, source } = parsed.data;

  // 3. Rate-limit per IP (8 attempts / 10 min) and per email (3 / hr)
  const ip = (await getClientIp()) ?? "unknown";
  const userAgent = await getUserAgent();

  const ipLimit = rateLimit({
    bucket: "newsletter",
    key: ip,
    limit: 8,
    windowMs: 10 * 60_000,
  });
  if (!ipLimit.allowed) {
    return {
      ok: false,
      message: "Too many attempts. Please try again in a few minutes.",
      field: "_form",
    };
  }
  const emailLimit = rateLimit({
    bucket: "newsletter-email",
    key: email,
    limit: 3,
    windowMs: 60 * 60_000,
  });
  if (!emailLimit.allowed) {
    return {
      ok: true,
      message: "You're already subscribed. Welcome back!",
    };
  }

  // 4. Stub / missing-env handling
  const cap = formsCapability();
  if (cap === "missing") {
    return {
      ok: false,
      message:
        "Newsletter signup is temporarily unavailable. Please WhatsApp us to subscribe.",
      field: "_form",
    };
  }
  if (cap === "stub") {
    console.info("[newsletter:stub]", { email, source, ip });
    return {
      ok: true,
      message: "You're subscribed! Check your inbox for a welcome email.",
    };
  }

  // 5. Real subscription — Supabase + Resend
  try {
    const supabase = getSupabaseAdmin();
    const { error: dbErr } = await supabase
      .from("newsletter_subscribers")
      .upsert(
        {
          email,
          source: source ?? "homepage-newsletter",
          ip,
          user_agent: userAgent,
        },
        { onConflict: "email" }
      );

    if (dbErr) {
      console.error("[newsletter] supabase error:", dbErr);
      return {
        ok: false,
        message:
          "Something went wrong saving your subscription. Please try again.",
        field: "_form",
      };
    }

    const resend = getResend();
    const { subject, html } = welcomeSubscriberEmail(email);

    const sendResult = await resend.emails.send({
      from: env.emailFrom,
      to: email,
      replyTo: env.emailReplyTo,
      subject,
      html,
    });

    if (sendResult.error) {
      console.error("[newsletter] resend error:", sendResult.error);
      // DB write already succeeded — return success but log the email failure
    }

    return {
      ok: true,
      message: "You're subscribed! Check your inbox for a welcome email.",
    };
  } catch (e) {
    console.error("[newsletter] unexpected error:", e);
    return {
      ok: false,
      message: "Something went wrong. Please try again in a moment.",
      field: "_form",
    };
  }
}
