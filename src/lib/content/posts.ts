import "server-only";

import type { PortableTextBlock } from "next-sanity";

import {
  POST_BY_SLUG_QUERY,
  POST_SLUGS_QUERY,
  POSTS_INDEX_QUERY,
} from "@/sanity/queries";
import { safeSanityFetch } from "@/sanity/lib/fetch";
import { sanityTag } from "@/sanity/tags";

export type SanityImageAsset = {
  _id: string;
  url: string;
  metadata: {
    lqip?: string;
    dimensions?: { width: number; height: number };
  } | null;
};

export type SanityImage = {
  asset: SanityImageAsset | null;
  alt?: string | null;
};

export type PostAuthor = {
  name: string;
  slug?: string | null;
  role?: string | null;
  bio?: string | null;
  image?: SanityImage | null;
};

export type PostCard = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  category?: string | null;
  publishedAt: string;
  featured?: boolean | null;
  mainImage?: SanityImage | null;
  author?: PostAuthor | null;
};

export type PostFull = PostCard & {
  body?: PortableTextBlock[] | null;
};

export async function getPosts(): Promise<PostCard[]> {
  const rows = await safeSanityFetch<PostCard[]>({
    query: POSTS_INDEX_QUERY,
    tags: [sanityTag.post, sanityTag.author],
    fallback: [],
  });
  return Array.isArray(rows) ? rows : [];
}

export async function getPostSlugs(): Promise<string[]> {
  const rows = await safeSanityFetch<string[]>({
    query: POST_SLUGS_QUERY,
    tags: [sanityTag.post],
    fallback: [],
  });
  return Array.isArray(rows) ? rows.filter(Boolean) : [];
}

export async function getPostBySlug(slug: string): Promise<PostFull | null> {
  return await safeSanityFetch<PostFull | null>({
    query: POST_BY_SLUG_QUERY,
    params: { slug },
    tags: [sanityTag.post, `${sanityTag.post}:${slug}`, sanityTag.author],
    fallback: null,
  });
}
