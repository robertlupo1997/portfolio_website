// lib/ask/__tests__/rate-limit.test.ts
import { describe, it, expect } from 'vitest';
import { createRateLimiter } from '../rate-limit';

describe('createRateLimiter', () => {
  it('allows up to limit hits per window per key, then refuses', () => {
    let t = 0;
    const rl = createRateLimiter({ limit: 3, windowMs: 1000, now: () => t });
    expect(rl.allow('a')).toBe(true);
    expect(rl.allow('a')).toBe(true);
    expect(rl.allow('a')).toBe(true);
    expect(rl.allow('a')).toBe(false);
    expect(rl.allow('b')).toBe(true); // other keys unaffected
    t = 1001; // window expired
    expect(rl.allow('a')).toBe(true);
  });
});
