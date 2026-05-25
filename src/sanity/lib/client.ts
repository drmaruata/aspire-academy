import "server-only";

import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, isConfigured, projectId } from "@/sanity/env";

let _client: SanityClient | null = null;

/**
 * Server-side Sanity client.
 *
 * Throws when `NEXT_PUBLIC_SANITY_PROJECT_ID` is missing — callers should
 * guard with `isSanityConfigured()` (or use `safeSanityFetch`) so missing
 * env never crashes the page.
 */
export function getSanityClient(): SanityClient {
  if (_client) return _client;
  if (!isConfigured) {
    throw new Error(
      "Sanity client requested but NEXT_PUBLIC_SANITY_PROJECT_ID is missing."
    );
  }
  _client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: process.env.NODE_ENV === "production",
    perspective: "published",
  });
  return _client;
}
