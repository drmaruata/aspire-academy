"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Phone, Mail, MapPin, CheckCircle2, AlertCircle } from "lucide-react";
import { WhatsAppIcon, InstagramIcon } from "@/components/icons";
import { site } from "@/lib/site";
import { submitLead, type LeadState } from "@/lib/actions/lead";
import { cn } from "@/lib/utils";

const initialState: LeadState = { ok: false, message: "" };

export function Contact() {
  const [state, formAction] = useActionState(submitLead, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <section id="contact" className="section-y bg-cream">
      <div className="container-page">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          {/* Info */}
          <div className="fade-up lg:pr-4">
            <span className="label">Get In Touch</span>
            <h2 className="mt-2">
              Talk to{" "}
              <em className="italic font-serif text-forest">Our Team</em>
            </h2>
            <div className="section-divider left" />
            <p className="mb-8 text-[0.97rem] text-text-light">
              Have questions about courses, fees, or the admission process?
              Reach out — we&apos;re here to help you find the right path to
              your MPSC goal.
            </p>

            <div className="mb-8 flex flex-col gap-5">
              <ContactItem
                icon={<Phone className="h-[18px] w-[18px] text-white" />}
                label="Phone / WhatsApp"
              >
                <a href={`tel:${site.phoneTel}`} className="hover:text-forest">
                  {site.phoneDisplay}
                </a>
              </ContactItem>
              <ContactItem
                icon={<Mail className="h-[18px] w-[18px] text-white" />}
                label="Email"
              >
                <a href={`mailto:${site.email}`} className="hover:text-forest">
                  {site.email}
                </a>
              </ContactItem>
              <ContactItem
                icon={<MapPin className="h-[18px] w-[18px] text-white" />}
                label="Location"
              >
                <span>{site.address}</span>
              </ContactItem>
              <ContactItem
                icon={<InstagramIcon className="h-[18px] w-[18px] text-white" />}
                label="Instagram"
              >
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-forest"
                >
                  {site.social.instagramHandle}
                </a>
              </ContactItem>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href={site.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 text-[0.95rem] font-semibold text-white shadow-[0_4px_16px_rgba(201,144,28,0.35)] transition-all hover:-translate-y-0.5 hover:bg-gold-light"
              >
                <WhatsAppIcon className="h-[18px] w-[18px]" />
                WhatsApp Us
              </a>
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-forest px-7 py-3 text-[0.95rem] font-semibold text-white shadow-[0_4px_16px_rgba(26,60,52,0.25)] transition-all hover:-translate-y-0.5 hover:bg-forest-mid"
              >
                <InstagramIcon className="h-[18px] w-[18px]" />
                Follow on Instagram
              </a>
            </div>
          </div>

          {/* Form */}
          <form
            ref={formRef}
            action={formAction}
            noValidate
            className="fade-up d2 rounded-[20px] bg-white p-8 shadow-[0_4px_24px_rgba(14,36,32,0.10)]"
          >
            <h3 className="mb-6 text-[1.3rem]">Send Us a Message</h3>

            {/* Honeypot */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            <div className="mb-1 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field
                label="Your Name"
                error={fieldError(state, "name")}
                htmlFor="lead-name"
              >
                <input
                  id="lead-name"
                  name="name"
                  required
                  type="text"
                  placeholder="Full name"
                  className="input"
                />
              </Field>
              <Field
                label="Phone Number"
                error={fieldError(state, "phone")}
                htmlFor="lead-phone"
              >
                <input
                  id="lead-phone"
                  name="phone"
                  required
                  type="tel"
                  inputMode="tel"
                  placeholder="+91 XXXXX XXXXX"
                  className="input"
                />
              </Field>
            </div>

            <Field
              label="Email Address"
              error={fieldError(state, "email")}
              htmlFor="lead-email"
            >
              <input
                id="lead-email"
                name="email"
                required
                type="email"
                inputMode="email"
                placeholder="you@email.com"
                className="input"
              />
            </Field>

            <Field
              label="Interested Course"
              error={fieldError(state, "course")}
              htmlFor="lead-course"
            >
              <select
                id="lead-course"
                name="course"
                className="input"
                defaultValue=""
              >
                <option value="" disabled>
                  Select a course...
                </option>
                <option>Foundation Course (Prelims + Mains Complete)</option>
                <option>Combined Course (Prelims + Mains)</option>
                <option>Prelims Crash Course</option>
                <option>Free Counselling</option>
              </select>
            </Field>

            <Field
              label="Message"
              error={fieldError(state, "message")}
              htmlFor="lead-message"
            >
              <textarea
                id="lead-message"
                name="message"
                className="input min-h-[120px] resize-y"
                placeholder="Tell us about yourself and your MPSC goals..."
                maxLength={1000}
              />
            </Field>

            <SubmitButton />

            {state.message && (
              <p
                role={state.ok ? "status" : "alert"}
                aria-live="polite"
                className={cn(
                  "mt-4 flex items-start gap-2 rounded-lg px-4 py-3 text-[0.88rem]",
                  state.ok
                    ? "bg-forest/10 text-forest-dark"
                    : "bg-red-50 text-red-700"
                )}
              >
                {state.ok ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                ) : (
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                )}
                <span>{state.message}</span>
              </p>
            )}
          </form>
        </div>
      </div>

    </section>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-7 py-3 text-[0.95rem] font-semibold text-white shadow-[0_4px_16px_rgba(201,144,28,0.35)] transition-all hover:-translate-y-0.5 hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
    >
      {pending ? (
        <>
          <Spinner className="h-4 w-4" />
          Sending…
        </>
      ) : (
        <>Send Message →</>
      )}
    </button>
  );
}

function Spinner({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`${className} animate-spin`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function fieldError(state: LeadState, field: NonNullable<LeadState["field"]>) {
  return !state.ok && state.field === field ? state.message : undefined;
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-4 flex flex-col gap-1.5">
      <span className="text-[0.85rem] font-semibold text-charcoal">{label}</span>
      {children}
      {error && (
        <span
          role="alert"
          className="text-[0.78rem] font-medium text-red-600"
        >
          {error}
        </span>
      )}
    </label>
  );
}

function ContactItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="grid h-[42px] w-[42px] flex-shrink-0 place-items-center rounded-[10px] bg-forest">
        {icon}
      </div>
      <div>
        <strong className="mb-1 block text-[0.9rem] font-semibold">
          {label}
        </strong>
        <div className="text-[0.9rem] text-text-light">{children}</div>
      </div>
    </div>
  );
}
