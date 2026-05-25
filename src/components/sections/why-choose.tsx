import { CheckCircle2 } from "lucide-react";
import { whyBullets } from "@/lib/data";

const visualStats = [
  { num: "500", em: "+", label: "Students\nTrained" },
  { num: "95", em: "%", label: "Satisfaction\nRate" },
  { num: "5", em: "+", label: "Years of\nExcellence" },
  { num: "80", em: "", label: "Max Batch\nSize" },
];

export function WhyChoose() {
  return (
    <section id="why" className="section-y bg-white">
      <div className="container-page">
        <div className="grid grid-cols-1 items-center gap-12 lg:gap-16 lg:grid-cols-2">
          {/* Visual */}
          <div className="fade-up relative order-2 lg:order-1">
            <div className="absolute -right-3 sm:-right-6 -top-6 z-10 min-w-[120px] sm:min-w-[140px] rounded-xl bg-gold p-4 sm:p-5 text-center text-white shadow-[0_12px_48px_rgba(14,36,32,0.16)]">
              <span className="block font-serif text-[1.85rem] sm:text-[2.2rem] font-black leading-none">
                20+
              </span>
              <span className="mt-1 block text-[0.72rem] sm:text-[0.78rem] leading-tight opacity-90">
                MPSC Selections
              </span>
            </div>

            <div
              className="relative aspect-[4/5] overflow-hidden rounded-[20px]"
              style={{
                background:
                  "linear-gradient(135deg,var(--color-forest) 0%,var(--color-forest-dark) 100%)",
              }}
            >
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg,rgba(255,255,255,0.03) 0px,rgba(255,255,255,0.03) 1px,transparent 1px,transparent 20px)",
                }}
              />
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {visualStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-white/15 bg-white/10 p-4 sm:p-5 text-center backdrop-blur-md"
                    >
                      <span className="block font-serif text-[1.5rem] sm:text-[1.8rem] font-black text-white">
                        {stat.num}
                        {stat.em && (
                          <em className="not-italic text-gold-light">
                            {stat.em}
                          </em>
                        )}
                      </span>
                      <span className="text-[0.72rem] sm:text-[0.78rem] leading-tight text-white/65 whitespace-pre-line">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="fade-up d2 order-1 lg:order-2">
            <span className="label">Why Choose Aspire Academy?</span>
            <h2 className="mt-2">
              Where Mizo Aspirants{" "}
              <em className="italic font-serif text-forest">Thrive</em>
            </h2>
            <div className="section-divider left" />
            <p className="text-text-light">
              We are committed to providing the best guidance and resources to
              help you excel in the Mizoram Civil Services. With a proven track
              record of success, we offer a comprehensive approach tailored to
              every aspirant&apos;s needs.
            </p>

            <ul className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {whyBullets.map((b) => (
                <li
                  key={b}
                  className="flex items-center gap-3 rounded-xl border border-cream-2 bg-cream px-4 py-3.5 text-[0.95rem] font-semibold text-charcoal transition-all hover:border-gold hover:bg-gold-pale"
                >
                  <CheckCircle2
                    className="h-5 w-5 flex-shrink-0 text-forest"
                    strokeWidth={2.2}
                  />
                  {b}
                </li>
              ))}
            </ul>

            <p className="mt-7 text-[0.95rem] text-text-light">
              From <strong className="text-forest-dark">expert faculty</strong>{" "}
              who know the MPSC exam inside out to{" "}
              <strong className="text-forest-dark">small batches</strong> that
              ensure individual attention, every aspect of Aspire Academy is
              built around your success.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
