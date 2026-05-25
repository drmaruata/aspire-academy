import Link from "next/link";
import {
  GraduationCap,
  CheckCheck,
  Users,
  ArrowRight,
} from "lucide-react";
import { heroStats } from "@/lib/data";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden bg-forest-dark"
    >
      {/* Layered backgrounds */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 70% 40%, rgba(46,107,90,0.35) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 15% 75%, rgba(201,144,28,0.14) 0%, transparent 60%),
            linear-gradient(160deg, #0E2420 0%, #1A3C34 50%, #0E2420 100%)
          `,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,1) 40px), repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,255,255,1) 40px)",
        }}
      />

      <div className="container-page relative pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-28 lg:pb-32">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          {/* Content */}
          <div className="fade-up text-center lg:text-left">
            <span className="dot-pulse mx-auto lg:mx-0 mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-gold/35 bg-gold/15 px-4 py-1.5 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-gold-light">
              Welcome to Aspire Academy
            </span>

            <h1
              className="text-balance text-white"
              style={{
                fontSize: "clamp(2.1rem, 5vw, 4.2rem)",
                lineHeight: 1.1,
              }}
            >
              Best Coaching Center for{" "}
              <span className="italic text-gold-light">
                Mizoram Civil Services
              </span>
            </h1>

            <p className="mx-auto lg:mx-0 mt-6 max-w-[560px] text-balance text-[1.05rem] sm:text-[1.1rem] text-white/75">
              Your One-Stop Solution for various MPSC Competitive Exams.
            </p>

            <div className="mt-9 flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4">
              <Link
                href="#courses"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-[0.95rem] font-semibold text-white shadow-[0_4px_16px_rgba(201,144,28,0.35)] transition-all hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-[0_8px_24px_rgba(201,144,28,0.45)]"
              >
                <GraduationCap className="h-[18px] w-[18px]" />
                Explore Courses
              </Link>
              <a
                href={site.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/55 bg-transparent px-7 py-3.5 text-[0.95rem] font-semibold text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-white/[0.12]"
              >
                Enroll Now <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <dl className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-6 border-t border-white/10 pt-8">
              {heroStats.map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-serif text-[1.9rem] sm:text-[2.1rem] font-black leading-none text-white">
                    {stat.num}
                    <span className="text-gold-light">{stat.suffix}</span>
                  </dd>
                  <dd className="mt-1 text-[0.78rem] tracking-[0.03em] text-white/55">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Visual — hidden on mobile to keep hero short and fast */}
          <div
            className="fade-up d2 hidden lg:flex flex-col gap-4"
            aria-hidden
          >
            <HeroCard tone="primary">
              <CardIcon className="bg-gold">
                <GraduationCap className="h-[22px] w-[22px] text-white" />
              </CardIcon>
              <h3 className="mb-1.5 text-[1.1rem] text-white">
                Complete MPSC Preparation
              </h3>
              <p className="text-[0.88rem] leading-[1.5] text-white/60">
                From Prelims to Interview — a structured, step-by-step roadmap
                tailored for Mizoram Civil Services aspirants.
              </p>
            </HeroCard>

            <div className="grid grid-cols-2 gap-4">
              <HeroCard>
                <CardIcon className="bg-white/15">
                  <CheckCheck className="h-[22px] w-[22px] text-white" />
                </CardIcon>
                <h3 className="mb-1.5 text-[1.05rem] text-white">Daily Tests</h3>
                <p className="text-[0.85rem] leading-[1.45] text-white/60">
                  Practice exams every day to keep you sharp.
                </p>
              </HeroCard>
              <HeroCard>
                <CardIcon className="bg-white/15">
                  <Users className="h-[22px] w-[22px] text-white" />
                </CardIcon>
                <h3 className="mb-1.5 text-[1.05rem] text-white">
                  Expert Faculty
                </h3>
                <p className="text-[0.85rem] leading-[1.45] text-white/60">
                  Learn from experienced MPSC mentors.
                </p>
              </HeroCard>
            </div>

            <div
              className="rounded-[20px] border border-white/10 p-6 text-center text-white"
              style={{
                background:
                  "linear-gradient(135deg,var(--color-gold) 0%,#E8B840 100%)",
              }}
            >
              <h3 className="mb-1 text-[0.95rem] text-white">
                🎓 Admission Open
              </h3>
              <span className="block font-serif text-[1.6rem] font-black text-white">
                2026 Batch
              </span>
              <p className="text-[0.82rem] text-white/85">
                Few seats remaining — enroll today
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroCard({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone?: "primary";
}) {
  return (
    <div
      className={`rounded-[20px] border border-white/10 p-6 backdrop-blur-md transition-all hover:-translate-y-1 ${
        tone === "primary"
          ? "bg-white/[0.07]"
          : "bg-white/[0.06] hover:bg-white/[0.09]"
      }`}
    >
      {children}
    </div>
  );
}

function CardIcon({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`mb-3.5 grid h-11 w-11 place-items-center rounded-[10px] ${className}`}
    >
      {children}
    </div>
  );
}
