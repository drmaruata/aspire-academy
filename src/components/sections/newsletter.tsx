"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import {
  subscribeNewsletter,
  type NewsletterState,
} from "@/lib/actions/newsletter";

const initialState: NewsletterState = {
  ok: false,
  message: "",
};

export function Newsletter() {
  const [state, formAction] = useActionState(
    subscribeNewsletter,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  // Reset the email input on successful subscription
  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  const hint =
    state.message ||
    "📬 Join 1,000+ aspirants already subscribed. No spam, ever.";

  return (
    <section
      id="newsletter"
      className="relative overflow-hidden py-16"
      style={{
        background:
          "linear-gradient(135deg,var(--color-forest) 0%,var(--color-forest-dark) 100%)",
      }}
    >
      <span
        className="absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full bg-gold/[0.08]"
        aria-hidden
      />
      <span
        className="absolute -bottom-16 -left-16 h-[300px] w-[300px] rounded-full bg-white/[0.03]"
        aria-hidden
      />

      <div className="container-page relative z-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="fade-up">
            <span className="label" style={{ color: "var(--color-gold-light)" }}>
              Stay Updated
            </span>
            <h2 className="mt-2 text-white">
              Never Miss an{" "}
              <em className="italic font-serif text-gold-light">Update</em>
            </h2>
            <p className="text-[0.97rem] text-white/65">
              Subscribe for daily current affairs, exam notifications, free
              study materials, and scholarship announcements straight to your
              inbox.
            </p>
          </div>

          <form
            ref={formRef}
            action={formAction}
            className="fade-up d2 flex flex-col gap-4"
            noValidate
          >
            {/* Honeypot — visually hidden, bots fill it; humans never see it */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />
            <input type="hidden" name="source" value="homepage-newsletter" />

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                className="flex-1 rounded-full border-2 border-white/15 bg-white/10 px-5 py-3.5 text-[0.95rem] text-white outline-none backdrop-blur-sm transition-colors placeholder:text-white/45 focus:border-gold-light"
                aria-label="Email address"
                aria-invalid={!state.ok && state.field === "email" ? true : undefined}
                aria-describedby="newsletter-status"
                required
              />
              <SubmitButton />
            </div>

            <p
              id="newsletter-status"
              role="status"
              aria-live="polite"
              className="text-[0.78rem] transition-colors"
              style={{
                color: state.ok
                  ? "var(--color-gold-light)"
                  : state.message
                    ? "#ff9999"
                    : "rgba(255,255,255,0.4)",
              }}
            >
              {hint}
            </p>
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
      className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-[0.95rem] font-semibold text-white shadow-[0_4px_16px_rgba(201,144,28,0.35)] transition-all hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-[0_8px_24px_rgba(201,144,28,0.45)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
    >
      {pending ? (
        <>
          <Spinner className="h-4 w-4" />
          Subscribing…
        </>
      ) : (
        "Subscribe"
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
