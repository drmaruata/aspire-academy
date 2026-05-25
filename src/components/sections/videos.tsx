import { Play } from "lucide-react";
import { YouTubeIcon } from "@/components/icons";
import { videos as defaultVideos, type VideoLecture } from "@/lib/data";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Videos({
  videos = defaultVideos,
}: {
  videos?: VideoLecture[];
}) {
  return (
    <section id="videos" className="section-y bg-cream-2">
      <div className="container-page">
        <div className="section-intro fade-up">
          <span className="label">Video Lectures</span>
          <h2 className="mt-2">
            Learn THROUGH{" "}
            <em className="italic font-serif text-forest">Videos</em>
          </h2>
          <div className="section-divider" />
          <p>Watch our expert-led video lectures on YouTube — free for all aspirants.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {videos.map((video, i) => (
            <article
              key={video.title}
              className={cn(
                "fade-up overflow-hidden rounded-[20px] bg-white shadow-[0_4px_24px_rgba(14,36,32,0.10)] transition-all hover:-translate-y-1.5 hover:shadow-[0_12px_48px_rgba(14,36,32,0.16)]",
                i === 0 && "d1",
                i === 1 && "d2",
                i === 2 && "d3"
              )}
            >
              <a href={video.href} target="_blank" rel="noopener noreferrer">
                <div
                  className="group relative flex aspect-video cursor-pointer items-center justify-center overflow-hidden"
                  style={{
                    background:
                      video.thumbStyle ||
                      "linear-gradient(135deg,var(--color-forest) 0%,var(--color-forest-mid) 100%)",
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(30deg,rgba(255,255,255,0.03) 0,rgba(255,255,255,0.03) 1px,transparent 1px,transparent 20px)",
                    }}
                  />

                  <div className="z-10 grid h-[54px] w-[54px] place-items-center rounded-full bg-white shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all group-hover:scale-110 group-hover:bg-gold">
                    <Play className="ml-0.5 h-5 w-5 fill-forest text-forest transition-colors group-hover:fill-white group-hover:text-white" />
                  </div>

                  <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-white">
                    {video.tag}
                  </span>
                  <span className="absolute bottom-2.5 right-3 rounded bg-black/65 px-2 py-0.5 text-[0.72rem] text-white">
                    {video.duration}
                  </span>
                </div>
              </a>

              <div className="p-5">
                <h4 className="mb-1.5 text-[0.97rem] font-semibold leading-[1.4] text-charcoal">
                  {video.title}
                </h4>
                <p className="text-[0.82rem] text-text-light">
                  {video.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href={site.social.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-forest px-7 py-3 text-[0.95rem] font-semibold text-white shadow-[0_4px_16px_rgba(26,60,52,0.25)] transition-all hover:-translate-y-0.5 hover:bg-forest-mid"
          >
            <YouTubeIcon className="h-[18px] w-[18px]" />
            Watch All Videos on YouTube
          </a>
        </div>
      </div>
    </section>
  );
}
