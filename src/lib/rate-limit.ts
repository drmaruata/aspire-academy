import "server-only";

/**
 * Minimal in-memory sliding-window rate limiter.
 *
 * Survives the process lifetime only — adequate for a single-region marketing
 * site behind Vercel's Fluid Compute. Upgrade to Upstash Ratelimit + Redis
 * when traffic warrants (Phase 4+).
 */

type Entry = { count: number; windowStart: number };

const stores = new Map<string, Map<string, Entry>>();

function getStore(bucket: string) {
  let s = stores.get(bucket);
  if (!s) {
    s = new Map();
    stores.set(bucket, s);
  }
  return s;
}

export type RateLimitOptions = {
  /** Bucket name — segments different actions (e.g. "lead", "newsletter") */
  bucket: string;
  /** Identifier — usually IP or email */
  key: string;
  /** Max allowed hits within `windowMs` */
  limit: number;
  /** Window size in milliseconds */
  windowMs: number;
};

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetInMs: number;
};

export function rateLimit(opts: RateLimitOptions): RateLimitResult {
  const store = getStore(opts.bucket);
  const now = Date.now();
  const existing = store.get(opts.key);

  if (!existing || now - existing.windowStart > opts.windowMs) {
    store.set(opts.key, { count: 1, windowStart: now });
    return { allowed: true, remaining: opts.limit - 1, resetInMs: opts.windowMs };
  }

  if (existing.count >= opts.limit) {
    return {
      allowed: false,
      remaining: 0,
      resetInMs: opts.windowMs - (now - existing.windowStart),
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: opts.limit - existing.count,
    resetInMs: opts.windowMs - (now - existing.windowStart),
  };
}

/** Best-effort opportunistic cleanup so the map doesn't grow forever. */
export function rateLimitGc(maxAgeMs = 30 * 60 * 1000) {
  const now = Date.now();
  for (const store of stores.values()) {
    for (const [k, v] of store) {
      if (now - v.windowStart > maxAgeMs) store.delete(k);
    }
  }
}
