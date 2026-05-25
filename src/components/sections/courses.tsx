import Link from "next/link";
import { Check, Clock } from "lucide-react";
import { courses as defaultCourses, type Course } from "@/lib/data";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { isAuthConfigured, isPaymentsConfigured } from "@/lib/env";

export function Courses({ courses = defaultCourses }: { courses?: Course[] }) {
  // Checkout is reachable when payments are wired up AND auth is wired up.
  // Auth is reachable when configured (we'll redirect anon users to /sign-in).
  const checkoutEnabled = isAuthConfigured() && isPaymentsConfigured();

  return (
    <section id="courses" className="section-y bg-cream">
      <div className="container-page">
        <div className="section-intro fade-up">
          <span className="label">Popular Courses</span>
          <h2 className="mt-2">
            Choose the Perfect Course for Your{" "}
            <em className="italic font-serif text-forest">Success</em>
          </h2>
          <div className="section-divider" />
          <p>
            Explore a wide range of courses designed to fit your preparation
            needs — whether you&apos;re starting your journey or refining your
            skills, Aspire Academy Mizo has the perfect program for you.
          </p>
        </div>

        {/* Admission Open badge bar */}
        <div className="fade-up mb-10 flex items-center justify-center gap-4 sm:gap-6">
          <span aria-hidden className="hidden sm:block h-px w-16 bg-gold/50" />
          <span className="rounded-full bg-gold-pale px-5 py-2 text-center font-serif text-[1.05rem] sm:text-[1.2rem] font-bold text-forest-dark">
            Admission Open for{" "}
            <span className="text-gold">MPSC 2026 Batch</span>
          </span>
          <span aria-hidden className="hidden sm:block h-px w-16 bg-gold/50" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {courses.map((course, i) => (
            <div
              key={course.slug}
              className={cn(
                "fade-up flex flex-col overflow-hidden rounded-[20px] border-2 border-transparent bg-white shadow-[0_4px_24px_rgba(14,36,32,0.10)] transition-all duration-300",
                "hover:-translate-y-1.5 hover:border-gold hover:shadow-[0_12px_48px_rgba(14,36,32,0.16)]",
                course.featured && "relative border-forest hover:border-forest",
                i === 0 && "d1",
                i === 1 && "d2",
                i === 2 && "d3"
              )}
            >
              {course.featured && (
                <span className="absolute right-4 top-4 z-10 rounded-full bg-forest px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-white">
                  Most Popular
                </span>
              )}

              <div
                className="px-7 pb-6 pt-8"
                style={{
                  background: course.featured
                    ? "linear-gradient(135deg,var(--color-forest) 0%,var(--color-forest-light) 100%)"
                    : "linear-gradient(135deg,var(--color-forest-dark) 0%,var(--color-forest) 100%)",
                }}
              >
                <div className="mb-2 text-[0.72rem] font-bold uppercase tracking-[0.15em] text-gold-light">
                  {course.category}
                </div>
                <div className="mb-3 font-serif text-[1.4rem] font-bold text-white">
                  {course.name}
                </div>
                <div className="flex items-baseline gap-2.5">
                  <span className="font-serif text-[2rem] font-black text-gold-light">
                    {course.priceCurrent}
                  </span>
                  {course.priceOriginal && (
                    <span className="text-base text-white/45 line-through">
                      {course.priceOriginal}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-1 flex-col p-7">
                <ul className="mb-7 flex flex-col gap-2.5">
                  {course.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-2.5 text-[0.9rem] text-text"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-forest-light"
                        strokeWidth={3}
                      />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <div className="mb-6 flex items-center gap-2 border-t border-cream-2 pt-4 text-[0.82rem] text-text-light">
                  <Clock className="h-[15px] w-[15px]" />
                  {course.duration}
                </div>

                <EnrollButton course={course} checkoutEnabled={checkoutEnabled} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EnrollButton({
  course,
  checkoutEnabled,
}: {
  course: Course;
  checkoutEnabled: boolean;
}) {
  const baseClass = cn(
    "mt-auto inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-[0.95rem] font-semibold text-white transition-all hover:-translate-y-0.5",
    course.featured
      ? "bg-gold shadow-[0_4px_16px_rgba(201,144,28,0.35)] hover:bg-gold-light hover:shadow-[0_8px_24px_rgba(201,144,28,0.45)]"
      : "bg-forest shadow-[0_4px_16px_rgba(26,60,52,0.25)] hover:bg-forest-mid"
  );

  // When checkout + a real price exist, route to the checkout page.
  if (checkoutEnabled && course.priceINR > 0) {
    return (
      <Link href={`/courses/${course.slug}/checkout`} className={baseClass}>
        Enroll Now
      </Link>
    );
  }

  // Fall back to WhatsApp for everything else (no payments configured,
  // or the course is set up as "contact-us-for-pricing").
  return (
    <a
      href={site.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={baseClass}
    >
      Enroll Now
    </a>
  );
}
