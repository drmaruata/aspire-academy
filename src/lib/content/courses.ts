import "server-only";

import { courses as staticCourses, type Course } from "@/lib/data";
import { COURSES_QUERY } from "@/sanity/queries";
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
  duration: string;
  features: string[] | null;
  featured: boolean | null;
};

export async function getCourses(): Promise<CourseCard[]> {
  const rows = await safeSanityFetch<SanityCourseRow[]>({
    query: COURSES_QUERY,
    tags: [sanityTag.course],
    fallback: null,
  });

  if (!Array.isArray(rows) || rows.length === 0) {
    return staticCourses;
  }

  return rows.map(
    (r): CourseCard => ({
      slug: r.slug ?? r._id,
      name: r.name,
      category: r.category,
      priceCurrent: r.priceCurrent,
      priceOriginal: r.priceOriginal ?? undefined,
      duration: r.duration,
      features: r.features ?? [],
      featured: r.featured ?? false,
    })
  );
}
