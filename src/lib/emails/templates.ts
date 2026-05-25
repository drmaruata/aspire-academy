import "server-only";

import { site } from "@/lib/site";
import { courseCodeToLabel } from "@/lib/schemas";

/** Inline-styled, mobile-friendly HTML email. Resend renders as-is. */

const baseStyles = {
  page:
    "margin:0;padding:0;background:#F4EDDC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,sans-serif;color:#2A3331;line-height:1.6",
  wrapper:
    "max-width:560px;margin:0 auto;padding:32px 24px;background:#F4EDDC",
  header:
    "background:linear-gradient(135deg,#1A3C34 0%,#0E2420 100%);border-radius:16px 16px 0 0;padding:28px;text-align:center;color:#fff",
  brand:
    "font-family:Georgia,'Playfair Display',serif;font-size:22px;font-weight:700;letter-spacing:0.2px;color:#fff;margin:0",
  tagline:
    "color:#E8B840;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;margin:6px 0 0",
  card:
    "background:#fff;border-radius:0 0 16px 16px;padding:32px 28px;color:#2A3331",
  h1:
    "font-family:Georgia,'Playfair Display',serif;font-size:24px;font-weight:700;color:#0E2420;margin:0 0 12px",
  p: "font-size:15px;color:#5C6663;margin:0 0 16px;line-height:1.65",
  cta:
    "display:inline-block;background:#C9901C;color:#fff;font-size:14px;font-weight:600;text-decoration:none;padding:12px 24px;border-radius:999px;margin-top:16px",
  footer:
    "color:#8A938F;font-size:11px;text-align:center;padding:24px 0;line-height:1.5",
  divider:
    "height:1px;background:#E8DCC0;border:0;margin:24px 0",
  label:
    "color:#8A938F;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;font-weight:700;margin:0 0 4px",
  value:
    "color:#0E2420;font-size:15px;margin:0 0 16px;word-break:break-word",
} as const;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function shell(innerHtml: string, previewText: string) {
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(site.name)}</title>
</head>
<body style="${baseStyles.page}">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all">${escapeHtml(previewText)}</div>
<div style="${baseStyles.wrapper}">
  <div style="${baseStyles.header}">
    <p style="${baseStyles.brand}">${escapeHtml(site.name)}</p>
    <p style="${baseStyles.tagline}">${escapeHtml(site.tagline)}</p>
  </div>
  <div style="${baseStyles.card}">
    ${innerHtml}
  </div>
  <p style="${baseStyles.footer}">
    ${escapeHtml(site.name)} · ${escapeHtml(site.address)}<br>
    ${escapeHtml(site.phoneDisplay)} · <a href="mailto:${site.email}" style="color:#8A938F;text-decoration:underline">${escapeHtml(site.email)}</a>
  </p>
</div>
</body></html>`;
}

/* ─── Subscriber welcome email ─────────────────────────────── */

export function welcomeSubscriberEmail(email: string) {
  const subject = `Welcome to ${site.name} — your MPSC journey starts here`;

  const html = shell(
    `
    <h1 style="${baseStyles.h1}">You're in! 🎉</h1>
    <p style="${baseStyles.p}">
      Hi there — thanks for subscribing to the Aspire Academy Mizo newsletter.
      We're glad to have you with us as you prepare for the Mizoram Civil
      Services Exam.
    </p>
    <p style="${baseStyles.p}">
      Here's what you'll get in your inbox:
    </p>
    <ul style="font-size:15px;color:#5C6663;padding-left:18px;margin:0 0 16px">
      <li>Daily Current Affairs digests</li>
      <li>Mizoram-specific updates relevant to MPSC</li>
      <li>Free study materials and PYQ analysis</li>
      <li>Webinar invitations and admission alerts</li>
    </ul>
    <hr style="${baseStyles.divider}">
    <p style="${baseStyles.p}">
      In the meantime, follow us on Instagram for daily one-line revision tips,
      or drop us a WhatsApp message to discuss your preparation strategy.
    </p>
    <p style="margin:8px 0 0">
      <a href="${site.whatsappUrl}" style="${baseStyles.cta}">Chat on WhatsApp</a>
    </p>
    <p style="font-size:12px;color:#8A938F;margin:24px 0 0">
      You're receiving this because ${escapeHtml(email)} was subscribed at
      <a href="${site.url}" style="color:#C9901C">${site.url.replace(/^https?:\/\//, "")}</a>.
      If this wasn't you, simply ignore this email.
    </p>
    `,
    `Welcome to ${site.name} — daily MPSC content, free study materials & more.`
  );

  return { subject, html };
}

/* ─── New-lead admin notification ──────────────────────────── */

export type LeadEmailData = {
  name: string;
  email: string;
  phone: string;
  course?: keyof typeof courseCodeToLabel;
  message?: string;
};

export function newLeadAdminEmail(data: LeadEmailData) {
  const subject = `New enquiry: ${data.name} — ${
    data.course ? courseCodeToLabel[data.course] : "general"
  }`;

  const html = shell(
    `
    <h1 style="${baseStyles.h1}">New enquiry on aspireacademymizo.com</h1>
    <p style="${baseStyles.p}">
      A prospective student just submitted the contact form. Reply within 24h
      for the best conversion rate.
    </p>
    <hr style="${baseStyles.divider}">

    <p style="${baseStyles.label}">Name</p>
    <p style="${baseStyles.value}">${escapeHtml(data.name)}</p>

    <p style="${baseStyles.label}">Phone</p>
    <p style="${baseStyles.value}">
      <a href="tel:${escapeHtml(data.phone)}" style="color:#1A3C34">${escapeHtml(data.phone)}</a>
      &nbsp;·&nbsp;
      <a href="https://wa.me/${data.phone.replace(/[^\d]/g, "")}" style="color:#1A3C34">WhatsApp</a>
    </p>

    <p style="${baseStyles.label}">Email</p>
    <p style="${baseStyles.value}">
      <a href="mailto:${escapeHtml(data.email)}" style="color:#1A3C34">${escapeHtml(data.email)}</a>
    </p>

    <p style="${baseStyles.label}">Interested course</p>
    <p style="${baseStyles.value}">${
      data.course ? escapeHtml(courseCodeToLabel[data.course]) : "—"
    }</p>

    ${
      data.message
        ? `<p style="${baseStyles.label}">Message</p>
           <p style="${baseStyles.value}; white-space:pre-wrap">${escapeHtml(data.message)}</p>`
        : ""
    }
    `,
    `New enquiry from ${data.name}`
  );

  return { subject, html };
}

/* ─── Lead confirmation (sent to the prospect) ─────────────── */

export function leadConfirmationEmail(data: LeadEmailData) {
  const subject = `Thanks for reaching out, ${data.name.split(" ")[0]} — ${site.name}`;

  const html = shell(
    `
    <h1 style="${baseStyles.h1}">Thanks for getting in touch! 🙏</h1>
    <p style="${baseStyles.p}">
      Hi ${escapeHtml(data.name.split(" ")[0])},
    </p>
    <p style="${baseStyles.p}">
      We've received your message and someone from the Aspire Academy team will
      reach out to you within 24 hours${
        data.course
          ? ` to discuss the <strong>${escapeHtml(courseCodeToLabel[data.course])}</strong>`
          : ""
      } and answer any questions you have about MPSC preparation.
    </p>
    <p style="${baseStyles.p}">
      Need an immediate response? Reach us on WhatsApp:
    </p>
    <p style="margin:8px 0 0">
      <a href="${site.whatsappUrl}" style="${baseStyles.cta}">Chat on WhatsApp</a>
    </p>
    <hr style="${baseStyles.divider}">
    <p style="font-size:13px;color:#8A938F;margin:0">
      In the meantime, follow us
      <a href="${site.social.instagram}" style="color:#C9901C">on Instagram</a>
      for daily MPSC tips and toppers' study strategies.
    </p>
    `,
    `We've received your enquiry — we'll be in touch within 24 hours.`
  );

  return { subject, html };
}
