import "server-only";

import type { QueryParams } from "next-sanity";
import { getSanityClient } from "@/sanity/lib/client";
import { isConfigured } from "@/sanity/env";

type FetchOptions<Params extends QueryParams> = {
  query: string;
  params?: Params;
  tags?: string[];
  /** Seconds. Ignored when `tags` is set (tags use on-demand revalidation). */
  revalidate?: number;
  /** Returned when Sanity is not configured or the fetch throws. */
  fallback?: unknown;
};

/**
 * `client.fetch` wrapper that:
 *   1. Returns `fallback` when Sanity isn't configured (no crash in dev/CI).
 *   2. Returns `fallback` when the network call fails.
 *   3. Applies tag-based revalidation so our webhook can flush by tag.
 */
export async function safeSanityFetch<Result, Params extends QueryParams = QueryParams>({
  query,
  params,
  tags,
  revalidate,
  fallback,
}: FetchOptions<Params>): Promise<Result> {
  if (!isConfigured) {
    return fallback as Result;
  }

  try {
    const client = getSanityClient();
    return await client.fetch<Result>(query, params ?? {}, {
      next: {
        revalidate: tags?.length ? false : (revalidate ?? 60),
        tags,
      },
    });
  } catch (err) {
    console.error("[sanity:fetch] failed", { tags, err });
    return fallback as Result;
  }
}
