import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Check, ShieldCheck } from "lucide-react";

import { AdmissionBanner } from "@/components/layout/admission-banner";
import { TopBar } from "@/components/layout/top-bar";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";

import { env, isAuthConfigured, isPaymentsConfigured, razorpayBrowserKey } from "@/lib/env";
import { getCurrentUser, getProfile } from "@/lib/auth/user";
import { getCourseBySlug } from "@/lib/content/courses";
import { createCourseOrder } from "@/lib/razorpay/orders";
import { formatINR } from "@/lib/format";
import { site } from "@/lib/site";

import { RazorpayCheckout } from "@/components/checkout/razorpay-checkout";
import { CheckoutSetupNotice } from "@/components/checkout/checkout-setup-notice";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  return {
    title: course ? `Enroll · ${course.name}` : "Checkout",
    robots: { index: false, follow: false },
  };
}

export default async function CheckoutPage({ params }: { params: Params }) {
  const { slug } = await params;

  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  // Auth gate. If not signed in, send to /sign-in with a next= param so
  // they bounce right back here after authenticating.
  if (!isAuthConfigured() || !isPaymentsConfigured()) {
    return (
      <CheckoutShell title={course.name}>
        <CheckoutSetupNotice
          authReady={isAuthConfigured()}
          paymentsReady={isPaymentsConfigured()}
          whatsappUrl={site.whatsappUrl}
        />
      </CheckoutShell>
    );
  }

  if (course.priceINR <= 0) {
    return (
      <CheckoutShell title={course.name}>
        <div className="rounded-2xl border-2 border-dashed border-gold/60 bg-white p-8 text-center">
          <h2 className="font-serif text-xl text-charcoal">
            Online checkout isn&apos;t enabled for this course yet
          </h2>
          <p className="mt-3 text-text-light">
            Reach out on WhatsApp and our team will set you up.
          </p>
          <a
            href={site.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-[0.95rem] font-semibold text-white shadow-[0_4px_16px_rgba(26,60,52,0.25)] transition-colors hover:bg-forest-mid"
          >
            Enroll via WhatsApp
          </a>
        </div>
      </CheckoutShell>
    );
  }

  const user = await getCurrentUser();
  if (!user) {
    redirect(`/sign-in?next=${encodeURIComponent(`/courses/${slug}/checkout`)}`);
  }

  const profile = await getProfile(user.id);
  const amountPaise = course.priceINR * 100;
  // Razorpay receipts must be ≤40 chars. Deterministic on (user, course) —
  // they accept the same receipt across retries.
  const receipt = `aam_${user.id.slice(0, 8)}_${slug.slice(0, 20)}`;

  let order;
  try {
    order = await createCourseOrder({
      amountPaise,
      receipt,
      notes: {
        user_id: user.id,
        user_email: user.email ?? "",
        course_slug: course.slug,
        course_name: course.name,
      },
    });
  } catch (err) {
    console.error("[checkout] createCourseOrder failed", err);
    return (
      <CheckoutShell title={course.name}>
        <div className="rounded-2xl bg-red-50 p-6 text-red-800">
          <p className="font-semibold">We couldn&apos;t open the payment gateway.</p>
          <p className="mt-1 text-[0.9rem]">
            Please try again in a minute, or reach out on WhatsApp.
          </p>
        </div>
      </CheckoutShell>
    );
  }

  return (
    <CheckoutShell title={course.name}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr,1fr]">
        <section className="rounded-3xl bg-white p-8 shadow-[0_4px_24px_rgba(14,36,32,0.08)]">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.15em] text-gold">
            {course.category}
          </p>
          <h2 className="mt-2 font-serif text-3xl text-charcoal">
            {course.name}
          </h2>
          <p className="mt-2 text-text-light">{course.duration}</p>

          <ul className="mt-6 space-y-3 border-t border-cream-2 pt-6">
            {course.features.map((feat) => (
              <li
                key={feat}
                className="flex items-start gap-2.5 text-[0.95rem] text-text"
              >
                <Check
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-forest-light"
                  strokeWidth={3}
                />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </section>

        <aside className="rounded-3xl bg-cream p-8 shadow-[0_4px_24px_rgba(14,36,32,0.08)]">
          <h3 className="font-serif text-xl text-charcoal">Order summary</h3>

          <dl className="mt-5 space-y-2 text-[0.95rem]">
            <Row label="Course fee" value={formatINR(course.priceINR)} />
            <Row label="GST" value="Included" />
            <div className="border-t border-cream-2 pt-3" />
            <Row
              label="Total"
              value={formatINR(course.priceINR)}
              emphasize
            />
          </dl>

          <div className="mt-6 rounded-2xl bg-white p-4">
            <p className="text-[0.78rem] text-text-light">Billing to</p>
            <p className="mt-1 text-[0.95rem] font-semibold text-charcoal">
              {profile?.full_name || user.email}
            </p>
            <p className="text-[0.85rem] text-text-light">{user.email}</p>
            {profile?.phone && (
              <p className="text-[0.85rem] text-text-light">{profile.phone}</p>
            )}
          </div>

          <RazorpayCheckout
            orderId={order.id}
            amount={order.amount}
            currency={order.currency}
            keyId={razorpayBrowserKey()}
            courseName={course.name}
            prefill={{
              name: profile?.full_name ?? "",
              email: user.email ?? "",
              contact: profile?.phone ?? "",
            }}
            siteName={site.name}
            successPath={`/dashboard?enrolled=${course.slug}`}
          />

          <p className="mt-4 flex items-center justify-center gap-2 text-[0.78rem] text-text-light">
            <ShieldCheck className="h-3.5 w-3.5" />
            Secured by Razorpay · 100% refund within 7 days
          </p>
          {!env.razorpayWebhookSecret && env.isDev && (
            <p className="mt-2 text-center text-[0.72rem] italic text-text-light">
              Dev note: set RAZORPAY_WEBHOOK_SECRET to enable webhook backup.
            </p>
          )}
        </aside>
      </div>
    </CheckoutShell>
  );
}

function CheckoutShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <AdmissionBanner />
      <TopBar />
      <Navbar />
      <main className="flex-1 bg-cream py-12">
        <div className="container-page max-w-5xl">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href="/#courses"
              className="inline-flex items-center gap-2 text-[0.9rem] font-semibold text-forest hover:text-gold"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to courses
            </Link>
            <p className="text-[0.85rem] text-text-light">
              <span aria-hidden>🛒</span> Enrollment
            </p>
          </div>
          <h1 className="sr-only">Checkout · {title}</h1>
          {children}
        </div>
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}

function Row({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div
      className={
        "flex items-baseline justify-between " +
        (emphasize ? "text-charcoal" : "text-text-light")
      }
    >
      <dt>{label}</dt>
      <dd
        className={
          emphasize
            ? "font-serif text-2xl text-charcoal"
            : "font-semibold text-charcoal"
        }
      >
        {value}
      </dd>
    </div>
  );
}
