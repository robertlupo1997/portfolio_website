import { describe, it, expect } from 'vitest';
import { TERMINAL_SYMBOLS, buildGlyphAtlasParams } from '../AsciiEffect';

describe('TERMINAL_SYMBOLS', () => {
  it('has 16 entries', () => {
    expect(TERMINAL_SYMBOLS).toHaveLength(16);
  });
  it('each entry is a single character', () => {
    for (const s of TERMINAL_SYMBOLS) {
      expect(s).toHaveLength(1);
    }
  });
});

describe('buildGlyphAtlasParams', () => {
  it('computes atlas width as size * count', () => {
    const r = buildGlyphAtlasParams(['A', 'B', 'C'], 64);
    expect(r.width).toBe(192);
    expect(r.height).toBe(64);
    expect(r.count).toBe(3);
  });
  it('handles empty input', () => {
    const r = buildGlyphAtlasParams([], 64);
    expect(r.count).toBe(0);
    expect(r.width).toBe(0);
  });
});
