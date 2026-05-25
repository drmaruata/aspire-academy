import { defineQuery } from "next-sanity";

/* ─── Courses ─────────────────────────────────────────────── */

export const COURSES_QUERY = defineQuery(/* groq */ `
  *[_type == "course" && !(_id in path("drafts.**"))] | order(featured desc, order asc, _createdAt asc) {
    _id,
    "slug": slug.current,
    name,
    category,
    priceCurrent,
    priceOriginal,
    priceINR,
    duration,
    features,
    featured
  }
`);

export const COURSE_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "course" && slug.current == $slug][0] {
    _id,
    "slug": slug.current,
    name,
    category,
    priceCurrent,
    priceOriginal,
    priceINR,
    duration,
    features,
    featured
  }
`);

/* ─── Testimonials ────────────────────────────────────────── */

export const TESTIMONIALS_QUERY = defineQuery(/* groq */ `
  *[_type == "testimonial" && featured == true && !(_id in path("drafts.**"))] | order(order asc, _createdAt desc) {
    _id,
    name,
    rank,
    text,
    initial
  }
`);

/* ─── Videos ──────────────────────────────────────────────── */

export const VIDEOS_QUERY = defineQuery(/* groq */ `
  *[_type == "video" && featured == true && !(_id in path("drafts.**"))] | order(order asc, _createdAt desc) {
    _id,
    title,
    description,
    tag,
    duration,
    "href": url,
    thumbStyle
  }
`);

/* ─── Resources ───────────────────────────────────────────── */

export const RESOURCES_QUERY = defineQuery(/* groq */ `
  *[_type == "resource" && !(_id in path("drafts.**"))] | order(order asc, _createdAt asc) {
    _id,
    title,
    description,
    icon,
    count,
    "url": url
  }
`);

/* ─── Blog ────────────────────────────────────────────────── */

export const POSTS_INDEX_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))]
  | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    category,
    publishedAt,
    featured,
    mainImage {
      "asset": asset->{
        _id,
        url,
        metadata { lqip, dimensions }
      },
      alt
    },
    author->{ name, "slug": slug.current, role }
  }
`);

export const POST_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))][].slug.current
`);

export const POST_BY_SLUG_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    category,
    publishedAt,
    body,
    mainImage {
      "asset": asset->{
        _id,
        url,
        metadata { lqip, dimensions }
      },
      alt
    },
    author->{
      name,
      "slug": slug.current,
      role,
      bio,
      image {
        "asset": asset->{ _id, url, metadata { lqip } },
        alt
      }
    }
  }
`);
