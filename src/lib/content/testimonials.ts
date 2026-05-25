import "server-only";

import { testimonials as staticTestimonials, type Testimonial } from "@/lib/data";
import { TESTIMONIALS_QUERY } from "@/sanity/queries";
import { safeSanityFetch } from "@/sanity/lib/fetch";
import { sanityTag } from "@/sanity/tags";

type SanityTestimonialRow = {
  _id: string;
  name: string;
  rank: string;
  text: string;
  initial: string | null;
};

export async function getTestimonials(): Promise<Testimonial[]> {
  const rows = await safeSanityFetch<SanityTestimonialRow[]>({
    query: TESTIMONIALS_QUERY,
    tags: [sanityTag.testimonial],
    fallback: null,
  });

  if (!Array.isArray(rows) || rows.length === 0) {
    return staticTestimonials;
  }

  return rows.map(
    (r): Testimonial => ({
      name: r.name,
      rank: r.rank,
      text: r.text,
      initial: r.initial?.trim() || r.name.charAt(0).toUpperCase(),
    })
  );
}
