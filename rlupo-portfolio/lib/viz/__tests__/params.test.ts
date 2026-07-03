import { describe, it, expect } from 'vitest';
import { VIZ_PARAMS, mulberry32 } from '../params';
import { CAROUSEL_PROJECTS } from '../../../constants';

const PROJECT_IDS = CAROUSEL_PROJECTS.map(p => p.id);

describe('VIZ_PARAMS', () => {
  it('covers every CAROUSEL_PROJECTS id', () => {
    for (const id of PROJECT_IDS) {
      expect(VIZ_PARAMS[id], `missing: ${id}`).toBeDefined();
    }
  });

  it('has valid archetype on every entry', () => {
    const valid = new Set(['lattice', 'wavefield', 'particleflow', 'wireframe']);
    for (const [id, p] of Object.entries(VIZ_PARAMS)) {
      expect(valid.has(p.archetype), `${id} archetype invalid`).toBe(true);
    }
  });

  it('has valid 6-char hex tint on every entry', () => {
    const hexRe = /^#[0-9A-Fa-f]{6}$/;
    for (const [id, p] of Object.entries(VIZ_PARAMS)) {
      expect(hexRe.test(p.tint), `${id} tint: ${p.tint}`).toBe(true);
    }
  });

  it('has positive density and speed', () => {
    for (const [id, p] of Object.entries(VIZ_PARAMS)) {
      expect(p.density, `${id} density`).toBeGreaterThan(0);
      expect(p.speed, `${id} speed`).toBeGreaterThan(0);
    }
  });
});

describe('mulberry32', () => {
  it('same seed → same sequence', () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    expect(a()).toBe(b());
    expect(a()).toBe(b());
    expect(a()).toBe(b());
  });

  it('values are in [0, 1)', () => {
    const rng = mulberry32(99);
    for (let i = 0; i < 100; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('different seeds produce different first values', () => {
    expect(mulberry32(1)()).not.toBe(mulberry32(2)());
  });
});
