import { videoStats } from "@/lib/data";

export function VideoStats() {
  return (
    <section
      aria-label="Aspire Academy at a glance"
      className="bg-white py-12 sm:py-16"
    >
      <div className="container-page">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {videoStats.map((stat, i) => (
            <article
              key={stat.title}
              className={`fade-up rounded-[20px] border border-cream-2 bg-cream p-7 transition-all hover:-translate-y-1 hover:border-gold hover:shadow-[0_12px_36px_rgba(14,36,32,0.10)] ${
                i === 0 ? "d1" : i === 1 ? "d2" : "d3"
              }`}
            >
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-[3rem] sm:text-[3.4rem] font-black leading-none text-forest">
                  {stat.num}
                </span>
                {stat.suffix && (
                  <span className="font-serif text-[2rem] font-black leading-none text-gold">
                    {stat.suffix}
                  </span>
                )}
              </div>
              <h3 className="mt-4 text-[1.15rem] font-serif font-bold text-forest-dark">
                {stat.title}
              </h3>
              <p className="mt-2 text-[0.93rem] leading-[1.65] text-text-light">
                {stat.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
