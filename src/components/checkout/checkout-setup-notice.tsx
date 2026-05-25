import { LogIn, CreditCard } from "lucide-react";

export function CheckoutSetupNotice({
  authReady,
  paymentsReady,
  whatsappUrl,
}: {
  authReady: boolean;
  paymentsReady: boolean;
  whatsappUrl: string;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card
        icon={<LogIn className="h-5 w-5 text-gold" />}
        title="Auth not configured"
        body="Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local and apply the auth migration."
        ok={authReady}
      />
      <Card
        icon={<CreditCard className="h-5 w-5 text-gold" />}
        title="Razorpay not configured"
        body="Add RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET and NEXT_PUBLIC_RAZORPAY_KEY_ID to .env.local."
        ok={paymentsReady}
      />
      <div className="md:col-span-2 rounded-2xl bg-forest p-6 text-white">
        <p className="font-semibold">For now, enroll via WhatsApp</p>
        <p className="mt-2 text-[0.9rem] text-white/80">
          Our team will guide you through enrollment and payment options.
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-[0.92rem] font-semibold text-white shadow-[0_4px_16px_rgba(201,144,28,0.35)] transition-colors hover:bg-gold-light"
        >
          Open WhatsApp
        </a>
      </div>
    </div>
  );
}

function Card({
  icon,
  title,
  body,
  ok,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  ok: boolean;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_4px_24px_rgba(14,36,32,0.08)]">
      <div className="flex items-center gap-3">
        {icon}
        <h3 className="font-serif text-lg text-charcoal">{title}</h3>
        {ok && (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[0.72rem] font-bold uppercase tracking-[0.1em] text-emerald-700">
            Ready
          </span>
        )}
      </div>
      <p className="mt-3 text-[0.9rem] text-text-light">{body}</p>
    </div>
  );
}
