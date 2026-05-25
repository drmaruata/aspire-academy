export function AuthSetupNotice() {
  return (
    <div className="rounded-2xl border border-dashed border-gold/50 bg-gold-pale/40 p-5 text-[0.92rem] leading-relaxed text-forest-dark">
      <p className="font-semibold">Authentication isn&apos;t configured yet</p>
      <p className="mt-2 text-text">
        Add{" "}
        <code className="rounded bg-white px-1.5 py-0.5 text-[0.85em]">
          NEXT_PUBLIC_SUPABASE_URL
        </code>{" "}
        and{" "}
        <code className="rounded bg-white px-1.5 py-0.5 text-[0.85em]">
          NEXT_PUBLIC_SUPABASE_ANON_KEY
        </code>{" "}
        to <code>.env.local</code> and apply the auth migration from{" "}
        <code className="font-mono">supabase/README.md</code>.
      </p>
      <p className="mt-3 text-text-light">
        Until then, course enrollments fall back to WhatsApp.
      </p>
    </div>
  );
}
