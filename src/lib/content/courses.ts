import "server-only";

import { courses as staticCourses, type Course } from "@/lib/data";
import {
  COURSES_QUERY,
  COURSE_BY_SLUG_QUERY,
} from "@/sanity/queries";
import { safeSanityFetch } from "@/sanity/lib/fetch";
import { sanityTag } from "@/sanity/tags";

export type CourseCard = Course;

type SanityCourseRow = {
  _id: string;
  slug: string | null;
  name: string;
  category: string;
  priceCurrent: string;
  priceOriginal: string | null;
  priceINR: number | null;
  duration: string;
  features: string[] | null;
  featured: boolean | null;
};

function toCard(r: SanityCourseRow): CourseCard {
  return {
    slug: r.slug ?? r._id,
    name: r.name,
    category: r.category,
    priceCurrent: r.priceCurrent,
    priceOriginal: r.priceOriginal ?? undefined,
    priceINR: r.priceINR ?? 0,
    duration: r.duration,
    features: r.features ?? [],
    featured: r.featured ?? false,
  };
}

export async function getCourses(): Promise<CourseCard[]> {
  const rows = await safeSanityFetch<SanityCourseRow[]>({
    query: COURSES_QUERY,
    tags: [sanityTag.course],
    fallback: null,
  });

  if (!Array.isArray(rows) || rows.length === 0) {
    return staticCourses;
  }

  return rows.map(toCard);
}

/**
 * Look up a single course by slug. Tries Sanity first, falls back to the
 * static table. Used by the checkout page.
 */
export async function getCourseBySlug(
  slug: string
): Promise<CourseCard | null> {
  const row = await safeSanityFetch<SanityCourseRow | null>({
    query: COURSE_BY_SLUG_QUERY,
    params: { slug },
    tags: [sanityTag.course, `${sanityTag.course}:${slug}`],
    fallback: null,
  });

  if (row && row.name) {
    return toCard(row);
  }

  return staticCourses.find((c) => c.slug === slug) ?? null;
}
