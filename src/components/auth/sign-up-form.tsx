"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { signUpAction, type AuthState } from "@/lib/actions/auth";

const initialState: AuthState = { ok: false, message: "" };

export function SignUpForm({ next }: { next: string }) {
  const [state, formAction] = useActionState(signUpAction, initialState);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-4">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <input type="hidden" name="next" value={next} />

      <Field
        label="Full name"
        htmlFor="fullName"
        error={state.field === "fullName" ? state.message : undefined}
      >
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          required
          placeholder="As it appears on official ID"
          className="input"
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="Phone"
          htmlFor="phone"
          error={state.field === "phone" ? state.message : undefined}
        >
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder="+91 XXXXX XXXXX"
            className="input"
          />
        </Field>
        <Field
          label="Email"
          htmlFor="email"
          error={state.field === "email" ? state.message : undefined}
        >
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@email.com"
            className="input"
          />
        </Field>
      </div>

      <Field
        label="Password"
        htmlFor="password"
        error={state.field === "password" ? state.message : undefined}
      >
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          placeholder="At least 8 characters"
          className="input"
        />
      </Field>

      {state.ok && state.message && (
        <p
          role="status"
          className="rounded-lg bg-emerald-50 px-3 py-2 text-[0.85rem] text-emerald-800"
        >
          {state.message}
        </p>
      )}
      {!state.ok && state.message && state.field === "form" && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-3 py-2 text-[0.85rem] text-red-700"
        >
          {state.message}
        </p>
      )}

      <SubmitButton />

      <p className="mt-2 text-center text-[0.78rem] leading-relaxed text-text-light">
        By creating an account you agree to our updates by email — we don&apos;t
        share your information with third parties.
      </p>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-forest px-6 py-3 text-[0.95rem] font-semibold text-white shadow-[0_4px_16px_rgba(26,60,52,0.25)] transition-all hover:bg-forest-mid disabled:opacity-60"
    >
      {pending ? <Spinner /> : null}
      {pending ? "Creating account…" : "Create account"}
    </button>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5" htmlFor={htmlFor}>
      <span className="text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-text-light">
        {label}
      </span>
      {children}
      {error && <span className="text-[0.8rem] text-red-700">{error}</span>}
    </label>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        fill="currentColor"
      />
    </svg>
  );
}
