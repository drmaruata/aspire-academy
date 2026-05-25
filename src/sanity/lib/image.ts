import createImageUrlBuilder, {
  type SanityImageSource,
} from "@sanity/image-url";
import { dataset, isConfigured, projectId } from "@/sanity/env";

const builder = isConfigured
  ? createImageUrlBuilder({ projectId, dataset })
  : null;

/**
 * Returns a Sanity image URL builder or `null` when Sanity isn't configured.
 * Always null-check before chaining (`.width()` etc.).
 */
export function urlFor(source: SanityImageSource) {
  return builder?.image(source) ?? null;
}
