import Link from "next/link";
import {
  Library,
  Lightbulb,
  BookOpen,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { miniCourseCards, type MiniCourseCard } from "@/lib/data";
import { cn } from "@/lib/utils";

const iconMap: Record<MiniCourseCard["icon"], LucideIcon> = {
  library: Library,
  lightbulb: Lightbulb,
  book: BookOpen,
};

export function OurCoursesMini() {
  return (
    <section
      id="our-courses"
      aria-labelledby="our-courses-heading"
      className="relative bg-white py-14 sm:py-16"
    >
      <div className="container-page">
        <div className="section-intro fade-up !mb-10">
          <span className="label">Our Courses</span>
          <h2 id="our-courses-heading" className="mt-2 text-[1.6rem] sm:text-[2rem]">
            Everything You Need to{" "}
            <em className="italic font-serif text-forest">Crack MPSC</em>
          </h2>
          <div className="section-divider" />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {miniCourseCards.map((card, i) => {
            const Icon = iconMap[card.icon];
            return (
              <Link
                key={card.title}
                href={card.href}
                className={cn(
                  "group fade-up flex flex-col items-start gap-4 rounded-[20px] border border-cream-2 bg-cream p-7 transition-all",
                  "hover:-translate-y-1 hover:border-gold hover:bg-gold-pale hover:shadow-[0_12px_36px_rgba(14,36,32,0.12)]",
                  i === 0 && "d1",
                  i === 1 && "d2",
                  i === 2 && "d3"
                )}
              >
                <span className="grid h-[60px] w-[60px] place-items-center rounded-[14px] bg-forest shadow-[0_4px_16px_rgba(26,60,52,0.25)] transition-colors group-hover:bg-gold">
                  <Icon className="h-7 w-7 text-white" strokeWidth={1.8} />
                </span>
                <h3 className="text-[1.25rem] font-serif font-bold text-forest-dark">
                  {card.title}
                </h3>
                <p className="text-[0.93rem] text-text-light leading-[1.65]">
                  {card.description}
                </p>
                <span className="mt-auto inline-flex items-center gap-1.5 text-[0.85rem] font-semibold text-forest transition-all group-hover:gap-3 group-hover:text-gold">
                  Explore <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
