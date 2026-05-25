import Link from "next/link";
import { CheckCircle2, Clock, XCircle, ArrowRight, BookOpen } from "lucide-react";

import { getProfile, requireUser } from "@/lib/auth/user";
import {
  listUserEnrollments,
  type EnrollmentRow,
} from "@/lib/enrollments";
import { isAuthConfigured, isPaymentsConfigured } from "@/lib/env";
import { formatINR } from "@/lib/format";
import { site } from "@/lib/site";

type SearchParams = Promise<{ enrolled?: string }>;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { enrolled } = await searchParams;
  const user = await requireUser("/dashboard");
  const profile = await getProfile(user.id);
  const enrollments = isPaymentsConfigured()
    ? await listUserEnrollments(user.id)
    : [];

  return (
    <div className="container-page max-w-5xl">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.15em] text-gold">
            Your dashboard
          </p>
          <h1 className="mt-2 font-serif text-3xl text-charcoal md:text-4xl">
            {greeting(profile?.full_name ?? user.email ?? "Aspirant")}
          </h1>
          <p className="mt-2 text-text-light">
            {profile?.full_name && <span className="mr-2">{profile.full_name}</span>}
            <span className="text-[0.9rem]">{user.email}</span>
          </p>
        </div>
        <form action="/sign-out" method="post">
          <button
            type="submit"
            className="rounded-full border-2 border-cream-2 px-4 py-2 text-[0.85rem] font-semibold text-charcoal transition-colors hover:border-forest hover:text-forest"
          >
            Sign out
          </button>
        </form>
      </header>

      {enrolled && (
        <div className="mb-8 rounded-2xl bg-emerald-50 px-5 py-4 text-[0.95rem] text-emerald-800">
          🎉 Enrollment confirmed for{" "}
          <strong className="font-semibold">{enrolled}</strong>. Our team will
          email you the next steps within 24 hours.
        </div>
      )}

      <section>
        <h2 className="mb-4 font-serif text-xl text-charcoal">Your courses</h2>
        {!isAuthConfigured() || !isPaymentsConfigured() ? (
          <ConfigNotice
            authReady={isAuthConfigured()}
            paymentsReady={isPaymentsConfigured()}
          />
        ) : enrollments.length === 0 ? (
          <EmptyState whatsappUrl={site.whatsappUrl} />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {enrollments.map((e) => (
              <EnrollmentCard key={e.id} e={e} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function greeting(name: string) {
  const hour = new Date().getHours();
  const period =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return `${period}, ${name.split(/[\s@]/)[0]}`;
}

function EnrollmentCard({ e }: { e: EnrollmentRow }) {
  const statusIcon =
    e.status === "active" ? (
      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
    ) : e.status === "failed" || e.status === "refunded" ? (
      <XCircle className="h-5 w-5 text-red-600" />
    ) : (
      <Clock className="h-5 w-5 text-gold" />
    );

  return (
    <article className="flex flex-col rounded-2xl bg-white p-6 shadow-[0_4px_24px_rgba(14,36,32,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.1em] text-gold">
            {e.course_slug}
          </p>
          <h3 className="mt-1 font-serif text-[1.15rem] text-charcoal">
            {e.course_name}
          </h3>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1 text-[0.78rem] font-semibold capitalize text-charcoal">
          {statusIcon}
          {e.status}
        </span>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-[0.85rem]">
        <div>
          <dt className="text-text-light">Amount</dt>
          <dd className="font-semibold text-charcoal">
            {formatINR(e.amount_paise / 100)}
          </dd>
        </div>
        <div>
          <dt className="text-text-light">Enrolled on</dt>
          <dd className="font-semibold text-charcoal">
            {new Date(e.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </dd>
        </div>
        {e.razorpay_payment_id && (
          <div className="col-span-2">
            <dt className="text-text-light">Payment id</dt>
            <dd className="font-mono text-[0.8rem] text-charcoal">
              {e.razorpay_payment_id}
            </dd>
          </div>
        )}
      </dl>
    </article>
  );
}

function EmptyState({ whatsappUrl }: { whatsappUrl: string }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-cream-2 bg-white p-10 text-center">
      <BookOpen className="mx-auto h-8 w-8 text-forest" />
      <h3 className="mt-3 font-serif text-xl text-charcoal">
        No enrollments yet
      </h3>
      <p className="mt-2 text-[0.92rem] text-text-light">
        Browse our MPSC programs and enroll in seconds — or chat with our team
        on WhatsApp.
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/#courses"
          className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-[0.9rem] font-semibold text-white transition-colors hover:bg-forest-mid"
        >
          Browse courses
          <ArrowRight className="h-4 w-4" />
        </Link>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border-2 border-cream-2 px-5 py-2.5 text-[0.9rem] font-semibold text-charcoal hover:border-forest hover:text-forest"
        >
          WhatsApp us
        </a>
      </div>
    </div>
  );
}

function ConfigNotice({
  authReady,
  paymentsReady,
}: {
  authReady: boolean;
  paymentsReady: boolean;
}) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-gold/50 bg-gold-pale/40 p-6 text-[0.92rem] text-forest-dark">
      <p className="font-semibold">Phase 4 isn&apos;t fully wired up yet</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-text">
        {!authReady && (
          <li>
            Set <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> + apply migration 0002.
          </li>
        )}
        {!paymentsReady && (
          <li>
            Set <code>RAZORPAY_KEY_ID</code> / <code>RAZORPAY_KEY_SECRET</code> /{" "}
            <code>NEXT_PUBLIC_RAZORPAY_KEY_ID</code>.
          </li>
        )}
      </ul>
    </div>
  );
}
