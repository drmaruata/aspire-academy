/**
 * Sanity-specific env re-exports.
 *
 * Importable from both server and client (uses only NEXT_PUBLIC_* values for
 * the constants needed by the browser-side Studio bundle).
 */

export const projectId = (
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ""
).trim();

export const dataset = (
  process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production"
).trim();

export const apiVersion = (
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-02-01"
).trim();

export const studioBasePath = "/studio";

export const isConfigured = projectId.length > 0;
