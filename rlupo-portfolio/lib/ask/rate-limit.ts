// lib/ask/rate-limit.ts
export const ASK_RATE_LIMIT = 10;
export const ASK_RATE_WINDOW_MS = 3_600_000;

export function createRateLimiter(
  opts: { limit?: number; windowMs?: number; now?: () => number } = {},
) {
  const { limit = ASK_RATE_LIMIT, windowMs = ASK_RATE_WINDOW_MS, now = Date.now } = opts;
  const hits = new Map<string, number[]>();
  return {
    allow(key: string): boolean {
      const t = now();
      const recent = (hits.get(key) ?? []).filter((h) => t - h < windowMs);
      if (recent.length >= limit) { hits.set(key, recent); return false; }
      recent.push(t);
      hits.set(key, recent);
      return true;
    },
  };
}
