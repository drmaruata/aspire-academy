import "server-only";

import { resources as staticResources, type Resource } from "@/lib/data";
import { RESOURCES_QUERY } from "@/sanity/queries";
import { safeSanityFetch } from "@/sanity/lib/fetch";
import { sanityTag } from "@/sanity/tags";

type SanityResourceRow = {
  _id: string;
  title: string;
  description: string;
  icon: Resource["icon"];
  count: string;
  url: string | null;
};

export async function getResources(): Promise<Resource[]> {
  const rows = await safeSanityFetch<SanityResourceRow[]>({
    query: RESOURCES_QUERY,
    tags: [sanityTag.resource],
    fallback: null,
  });

  if (!Array.isArray(rows) || rows.length === 0) {
    return staticResources;
  }

  return rows.map(
    (r): Resource => ({
      title: r.title,
      description: r.description,
      icon: r.icon,
      count: r.count,
    })
  );
}
