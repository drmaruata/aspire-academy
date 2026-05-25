import { Clock, BookOpen, Play, CheckCheck } from "lucide-react";
import {
  resources as defaultResources,
  type Resource,
} from "@/lib/data";
import { cn } from "@/lib/utils";

const iconMap: Record<Resource["icon"], React.ComponentType<{ className?: string }>> = {
  clock: Clock,
  book: BookOpen,
  play: Play,
  check: CheckCheck,
};

export function Resources({
  resources = defaultResources,
}: {
  resources?: Resource[];
}) {
  return (
    <section id="resources" className="bg-forest-dark py-20">
      <div className="container-page">
        <div className="fade-up mb-12 text-center">
          <span className="label" style={{ color: "var(--color-gold-light)" }}>
            Free Resources
          </span>
          <h2 className="mt-2 text-white">
            Study{" "}
            <em className="italic font-serif text-gold-light">Materials</em>{" "}
            Library
          </h2>
          <p className="mt-3 text-white/60">
            Access our growing library of MPSC notes, current affairs, and topic
            guides — always free for enrolled students.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {resources.map((r, i) => {
            const Icon = iconMap[r.icon];
            return (
              <div
                key={r.title}
                className={cn(
                  "fade-up cursor-pointer rounded-xl border border-white/[0.08] bg-white/[0.06] p-6 transition-all hover:-translate-y-1 hover:border-gold/40 hover:bg-white/10",
                  i === 0 && "d1",
                  i === 1 && "d2",
                  i === 2 && "d3",
                  i === 3 && "d4"
                )}
              >
                <div className="mb-3.5 grid h-[42px] w-[42px] place-items-center rounded-[10px] bg-gold/20">
                  <Icon className="h-5 w-5 text-gold-light" />
                </div>
                <h4 className="mb-1.5 text-[0.95rem] text-white">{r.title}</h4>
                <p className="text-[0.82rem] leading-[1.5] text-white/50">
                  {r.description}
                </p>
                <div className="mt-3 text-[0.75rem] font-semibold tracking-[0.05em] text-gold-light">
                  {r.count}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
