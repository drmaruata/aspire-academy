import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

import { env } from "@/lib/env";
import { ALL_SANITY_TAGS, sanityTag } from "@/sanity/tags";

/**
 * Sanity → Next.js revalidation webhook.
 *
 * Configure in Sanity Studio → Manage → API → Webhooks:
 *   - URL:       https://<your-site>/api/sanity/revalidate
 *   - Trigger:   On create / update / delete
 *   - Filter:    _type in ["course","testimonial","video","resource","post","author"]
 *   - Projection: { "type": _type, "slug": slug.current }
 *   - Secret:    set SANITY_REVALIDATE_SECRET to the same value
 */
type WebhookPayload = {
  type?: string;
  slug?: string;
};

const TYPE_TO_TAG: Record<string, string> = {
  course: sanityTag.course,
  testimonial: sanityTag.testimonial,
  video: sanityTag.video,
  resource: sanityTag.resource,
  post: sanityTag.post,
  author: sanityTag.author,
};

export async function POST(req: NextRequest) {
  if (!env.sanityRevalidateSecret) {
    return new Response(
      "SANITY_REVALIDATE_SECRET not configured on this deployment.",
      { status: 503 }
    );
  }

  try {
    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      env.sanityRevalidateSecret,
      true
    );

    if (!isValidSignature) {
      return new Response("Invalid signature", { status: 401 });
    }
    if (!body?.type) {
      return new Response("Missing `type` in webhook projection", {
        status: 400,
      });
    }

    const tag = TYPE_TO_TAG[body.type];
    if (!tag) {
      return NextResponse.json({
        revalidated: [],
        note: `Unknown _type "${body.type}", nothing revalidated.`,
      });
    }

    const tags = [tag];

    // Refresh the per-slug post tag when a post changes
    if (body.type === "post" && body.slug) {
      tags.push(`${sanityTag.post}:${body.slug}`);
    }
    // Author changes ripple into posts (author is referenced)
    if (body.type === "author") {
      tags.push(sanityTag.post);
    }

    // Next.js 16 requires a cache-life profile as the second argument.
    // "max" purges entries regardless of how long they were meant to live.
    for (const t of tags) revalidateTag(t, "max");

    return NextResponse.json({ revalidated: tags, at: Date.now() });
  } catch (err) {
    console.error("[sanity:webhook] error", err);
    return new Response((err as Error).message, { status: 500 });
  }
}

/** Health-check / convenience: GET shows whether the webhook is wired up. */
export async function GET() {
  return NextResponse.json({
    configured: env.sanityRevalidateSecret.length > 0,
    knownTags: ALL_SANITY_TAGS,
  });
}
