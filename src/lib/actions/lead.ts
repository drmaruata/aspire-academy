"use server";

import { z } from "zod";
import { courseLabelToCode, leadSchema } from "@/lib/schemas";
import { env, formsCapability } from "@/lib/env";
import { rateLimit, rateLimitGc } from "@/lib/rate-limit";
import { getClientIp, getUserAgent } from "@/lib/request-context";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getResend } from "@/lib/resend";
import {
  leadConfirmationEmail,
  newLeadAdminEmail,
} from "@/lib/emails/templates";

export type LeadState = {
  ok: boolean;
  message: string;
  field?: "name" | "phone" | "email" | "course" | "message" | "_form";
};

export async function submitLead(
  _prev: LeadState,
  formData: FormData
): Promise<LeadState> {
  rateLimitGc();

  // The contact form's <select> stores the human label, not a code,
  // so we map it before validation.
  const rawCourseLabel = String(formData.get("course") ?? "");
  const courseCode = rawCourseLabel
    ? courseLabelToCode[rawCourseLabel] ?? "other"
    : undefined;

  const raw = {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    course: courseCode,
    message: String(formData.get("message") ?? ""),
    website: String(formData.get("website") ?? ""),
  };

  // 1. Honeypot
  if (raw.website) {
    return {
      ok: true,
      message: "Thanks! We'll be in touch within 24 hours.",
    };
  }

  // 2. Validation
  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) {
    const err = (parsed.error as z.ZodError).issues[0];
    const path = err?.path?.[0];
    return {
      ok: false,
      message: err?.message ?? "Please check the form and try again.",
      field:
        path === "name" || path === "phone" || path === "email" ||
        path === "course" || path === "message"
          ? (path as LeadState["field"])
          : "_form",
    };
  }
  const data = parsed.data;

  // 3. Rate-limit: 3 submissions per IP / 10min, 2 per email / hr
  const ip = (await getClientIp()) ?? "unknown";
  const userAgent = await getUserAgent();

  const ipLimit = rateLimit({
    bucket: "lead",
    key: ip,
    limit: 3,
    windowMs: 10 * 60_000,
  });
  if (!ipLimit.allowed) {
    return {
      ok: false,
      message:
        "You've already submitted a few enquiries. Please WhatsApp us directly so we can help faster.",
      field: "_form",
    };
  }

  const emailLimit = rateLimit({
    bucket: "lead-email",
    key: data.email,
    limit: 2,
    windowMs: 60 * 60_000,
  });
  if (!emailLimit.allowed) {
    return {
      ok: true,
      message:
        "We already have your enquiry. Someone will reach out to you shortly!",
    };
  }

  // 4. Stub / missing-env
  const cap = formsCapability();
  if (cap === "missing") {
    return {
      ok: false,
      message:
        "Our message form is temporarily unavailable — please reach us on WhatsApp.",
      field: "_form",
    };
  }
  if (cap === "stub") {
    console.info("[lead:stub]", { ...data, ip });
    return {
      ok: true,
      message:
        "Message sent! Someone from our team will reach out within 24 hours.",
    };
  }

  // 5. Real flow: insert + email admin + confirm to student
  try {
    const supabase = getSupabaseAdmin();
    const { error: dbErr } = await supabase.from("lead_submissions").insert({
      name: data.name,
      phone: data.phone,
      email: data.email,
      course: data.course ?? null,
      message: data.message || null,
      ip,
      user_agent: userAgent,
      status: "new",
    });

    if (dbErr) {
      console.error("[lead] supabase error:", dbErr);
      return {
        ok: false,
        message:
          "Something went wrong saving your message. Please try again or WhatsApp us.",
        field: "_form",
      };
    }

    const resend = getResend();
    const admin = newLeadAdminEmail(data);
    const student = leadConfirmationEmail(data);

    // Fire both emails in parallel — failures here don't reverse the DB write.
    const [adminRes, studentRes] = await Promise.allSettled([
      resend.emails.send({
        from: env.emailFrom,
        to: env.emailAdminTo,
        replyTo: data.email,
        subject: admin.subject,
        html: admin.html,
      }),
      resend.emails.send({
        from: env.emailFrom,
        to: data.email,
        replyTo: env.emailReplyTo,
        subject: student.subject,
        html: student.html,
      }),
    ]);

    if (adminRes.status === "rejected") {
      console.error("[lead] admin email failed:", adminRes.reason);
    }
    if (studentRes.status === "rejected") {
      console.error("[lead] confirmation email failed:", studentRes.reason);
    }

    return {
      ok: true,
      message:
        "Message sent! Someone from our team will reach out within 24 hours.",
    };
  } catch (e) {
    console.error("[lead] unexpected error:", e);
    return {
      ok: false,
      message: "Something went wrong. Please try again or WhatsApp us.",
      field: "_form",
    };
  }
}
