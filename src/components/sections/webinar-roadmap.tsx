import { CheckCircle2, Calendar, Video, Info } from "lucide-react";
import Link from "next/link";
import { rotatingWords, roadmapPoints } from "@/lib/data";
import { site } from "@/lib/site";

export function WebinarRoadmap() {
  return (
    <section id="strategy" className="section-y bg-forest-dark text-white relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg,rgba(255,255,255,1) 0,rgba(255,255,255,1) 1px,transparent 1px,transparent 18px)",
        }}
      />
      <div
        aria-hidden
        className="absolute -right-32 top-10 h-[400px] w-[400px] rounded-full bg-gold/10 blur-3xl"
      />

      <div className="container-page relative">
        {/* Animated headline */}
        <div className="fade-up text-center">
          <span className="label" style={{ color: "var(--color-gold-light)" }}>
            Webinar Series
          </span>
          <h2 className="mt-3 text-white text-balance">
            Aspire Academy{" "}
            <RotatingText
              words={rotatingWords as unknown as string[]}
              className="font-serif italic text-gold-light"
            />
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-white/70">
            Road-Map to Mizoram Civil Services Exam is a straightforward
            strategy for the MPSC Civil Services Exam — a step-by-step approach
            starting from foundation all the way to final revision.
          </p>
        </div>

        {/* Two columns: bullet roadmap + webinar info card */}
        <div className="mt-12 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="fade-up rounded-[20px] border border-white/10 bg-white/[0.04] p-7 sm:p-9 backdrop-blur">
            <h3 className="mb-1 text-white">What you&apos;ll learn</h3>
            <p className="text-[0.93rem] text-white/60">
              The overabundance of information online confuses fresh MPSC
              aspirants. Our webinar gives you a clear, opinionated roadmap.
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {roadmapPoints.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-[0.93rem] text-white/85 transition-all hover:border-gold/40 hover:bg-white/[0.08]"
                >
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold-light"
                    strokeWidth={2.2}
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="fade-up d2 relative overflow-hidden rounded-[20px] p-7 sm:p-9 text-center text-white"
            style={{
              background:
                "linear-gradient(160deg,var(--color-forest) 0%,var(--color-forest-mid) 100%)",
            }}
          >
            <span
              aria-hidden
              className="absolute -right-10 -top-10 h-[150px] w-[150px] rounded-full bg-gold/20"
            />
            <h3 className="relative z-10 text-white">Free Strategy Webinar</h3>
            <p className="relative z-10 mt-2 text-[0.92rem] text-white/70">
              Join our free monthly session — no registration required.
            </p>

            <div className="relative z-10 mt-7 flex flex-col gap-3">
              <InfoRow Icon={Calendar} text="Every last Saturday of the month" />
              <InfoRow Icon={Video} text="Live on YouTube & Instagram" />
              <InfoRow Icon={Info} text="100% Free — Open to all aspirants" />
            </div>

            <Link
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-7 py-3 text-[0.95rem] font-semibold text-white shadow-[0_4px_16px_rgba(201,144,28,0.35)] transition-all hover:-translate-y-0.5 hover:bg-gold-light"
            >
              Follow for Updates →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoRow({
  Icon,
  text,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  text: string;
}) {
  return (
    <div className="flex items-center justify-center gap-2.5 text-[0.9rem] text-white/85">
      <Icon className="h-4 w-4 flex-shrink-0 text-gold-light" />
      {text}
    </div>
  );
}

/* Pure-CSS rotating text — no JS, prefers-reduced-motion friendly */
function RotatingText({
  words,
  className = "",
}: {
  words: string[];
  className?: string;
}) {
  const duration = words.length * 2.6;
  return (
    <span
      className={`relative inline-block align-baseline overflow-hidden ${className}`}
      style={{
        height: "1.1em",
        verticalAlign: "bottom",
      }}
      aria-label={words.join(", ")}
    >
      <span
        className="block"
        style={{
          animation: `rotate-words ${duration}s steps(${words.length}) infinite`,
        }}
      >
        {words.map((w) => (
          <span
            key={w}
            className="block whitespace-nowrap"
            style={{ height: "1.1em", lineHeight: "1.1em" }}
          >
            {w}
          </span>
        ))}
      </span>

      <style>{`
        @keyframes rotate-words {
          0%, 18% { transform: translateY(0); }
          25%, 43% { transform: translateY(-1.1em); }
          50%, 68% { transform: translateY(-2.2em); }
          75%, 93% { transform: translateY(-3.3em); }
          100% { transform: translateY(-4.4em); }
        }
        @media (prefers-reduced-motion: reduce) {
          [aria-label="${words.join(", ")}"] > span {
            animation: none !important;
          }
        }
      `}</style>
    </span>
  );
}
