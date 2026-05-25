import Image from "next/image";
import { faculty } from "@/lib/data";
import { cn } from "@/lib/utils";

const delayClass = ["d1", "d2", "d3", "d1", "d2", "d3"] as const;

export function Faculty() {
  return (
    <section id="faculty" className="section-y bg-white">
      <div className="container-page">
        <div className="section-intro fade-up">
          <span className="label">Meet The Team</span>
          <h2 className="mt-2">
            Our <em className="italic font-serif text-forest">Faculty</em>
          </h2>
          <div className="section-divider" />
          <p>
            Learn from a team of decorated, experienced educators who&apos;ve
            trained MPSC aspirants across Mizoram.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {faculty.map((f, i) => (
            <figure
              key={f.slug}
              className={cn(
                "fade-up overflow-hidden rounded-2xl border border-cream-2 bg-white shadow-[0_1px_2px_rgba(14,36,32,0.06),0_8px_24px_-12px_rgba(14,36,32,0.18)] transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_1px_2px_rgba(14,36,32,0.08),0_18px_36px_-14px_rgba(14,36,32,0.28)]",
                delayClass[i]
              )}
            >
              <Image
                src={f.image}
                alt={`${f.name} — ${f.subject}`}
                width={820}
                height={1024}
                sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                className="block h-auto w-full"
              />
              <figcaption className="sr-only">
                {f.name} — {f.subject}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
