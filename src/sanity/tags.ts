/**
 * Centralised cache-tag names used by `safeSanityFetch` + the revalidation
 * webhook. Keep in sync with the GROQ filter on the Sanity webhook.
 */
export const sanityTag = {
  course: "sanity:course",
  testimonial: "sanity:testimonial",
  video: "sanity:video",
  resource: "sanity:resource",
  post: "sanity:post",
  author: "sanity:author",
} as const;

export type SanityTag = (typeof sanityTag)[keyof typeof sanityTag];

export const ALL_SANITY_TAGS = Object.values(sanityTag);
