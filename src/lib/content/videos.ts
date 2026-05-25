import "server-only";

import { videos as staticVideos, type VideoLecture } from "@/lib/data";
import { VIDEOS_QUERY } from "@/sanity/queries";
import { safeSanityFetch } from "@/sanity/lib/fetch";
import { sanityTag } from "@/sanity/tags";

type SanityVideoRow = {
  _id: string;
  title: string;
  description: string;
  tag: string;
  duration: string;
  href: string;
  thumbStyle: string | null;
};

export async function getVideos(): Promise<VideoLecture[]> {
  const rows = await safeSanityFetch<SanityVideoRow[]>({
    query: VIDEOS_QUERY,
    tags: [sanityTag.video],
    fallback: null,
  });

  if (!Array.isArray(rows) || rows.length === 0) {
    return staticVideos;
  }

  return rows.map(
    (r): VideoLecture => ({
      title: r.title,
      description: r.description,
      tag: r.tag,
      duration: r.duration,
      href: r.href,
      thumbStyle: r.thumbStyle ?? undefined,
    })
  );
}
