import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import {
  testimonials as defaultTestimonials,
  type Testimonial,
} from "@/lib/data";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Testimonials({
  testimonials = defaultTestimonials,
}: {
  testimonials?: Testimonial[];
}) {
  return (
    <section id="testimonials" className="section-y bg-cream">
      <div className="container-page">
        <div className="section-intro fade-up">
          <span className="label">Success Stories</span>
          <h2 className="mt-2">
            Our <em className="italic font-serif text-forest">Achievers</em> Speak
          </h2>
          <div className="section-divider" />
        </div>
        <p className="-mt-6 mb-10 text-center text-[0.95rem] text-text-light">
          Real students, real results — from Aspire Academy Mizo to the Mizoram
          Civil Services.
        </p>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <article
              key={t.name}
              className={cn(
                "fade-up flex flex-col rounded-[20px] border border-cream-2 bg-white p-7 shadow-[0_4px_24px_rgba(14,36,32,0.10)] transition-all",
                "hover:-translate-y-1 hover:border-gold hover:shadow-[0_12px_48px_rgba(14,36,32,0.16)]",
                i === 0 && "d1",
                i === 1 && "d2",
                i === 2 && "d3"
              )}
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className="h-4 w-4 fill-gold text-gold"
                  />
                ))}
              </div>

              <p className="relative mb-5 flex-1 text-[0.93rem] italic leading-[1.7] text-text">
                <span
                  className="font-serif text-[3rem] leading-none align-[-0.75rem] mr-1 text-gold-pale"
                  aria-hidden
                >
                  &ldquo;
                </span>
                {t.text}
              </p>

              <div className="flex items-center gap-3.5 border-t border-cream-2 pt-5">
                <div
                  className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full font-serif text-[1.1rem] font-bold text-white"
                  style={{
                    background:
                      "linear-gradient(135deg,var(--color-forest) 0%,var(--color-forest-light) 100%)",
                  }}
                >
                  {t.initial}
                </div>
                <div>
                  <div className="text-[0.92rem] font-semibold text-charcoal">
                    {t.name}
                  </div>
                  <div className="text-[0.8rem] font-semibold text-gold">
                    {t.rank}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href={site.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[0.95rem] font-semibold text-forest transition-all hover:gap-3 hover:text-gold"
          >
            See All Success Stories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
