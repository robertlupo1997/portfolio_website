// components/viz/__tests__/scenes.test.ts
import { describe, it, expect } from 'vitest';
import { buildSceneSpec } from '../scenes';
import { VIZ_PARAMS } from '../../../lib/viz/params';
import { VizParams } from '../../../types';

const SAMPLE: Record<VizParams['archetype'], VizParams> = {
  lattice:      { archetype: 'lattice',      seed: 11, density: 1.0, speed: 0.6, tint: '#E85D3A' },
  wavefield:    { archetype: 'wavefield',    seed: 31, density: 0.8, speed: 0.5, tint: '#C8882A' },
  particleflow: { archetype: 'particleflow', seed: 61, density: 1.1, speed: 1.2, tint: '#5A9090' },
  wireframe:    { archetype: 'wireframe',    seed: 83, density: 0.7, speed: 0.9, tint: '#A6A77E' },
};

describe('buildSceneSpec archetype routing', () => {
  it('lattice → box geometry', () => {
    expect(buildSceneSpec(SAMPLE.lattice).geometryType).toBe('box');
  });
  it('wavefield → plane geometry', () => {
    expect(buildSceneSpec(SAMPLE.wavefield).geometryType).toBe('plane');
  });
  it('particleflow → sphere geometry', () => {
    expect(buildSceneSpec(SAMPLE.particleflow).geometryType).toBe('sphere');
  });
  it('wireframe → octahedron geometry', () => {
    expect(buildSceneSpec(SAMPLE.wireframe).geometryType).toBe('octahedron');
  });
});

describe('buildSceneSpec determinism and constraints', () => {
  it('same params → identical output (deterministic)', () => {
    expect(buildSceneSpec(SAMPLE.lattice)).toEqual(buildSceneSpec(SAMPLE.lattice));
  });

  it('all archetypes produce positive instanceCount', () => {
    for (const p of Object.values(SAMPLE)) {
      expect(buildSceneSpec(p).instanceCount).toBeGreaterThan(0);
    }
  });

  it('higher density → more instances (lattice)', () => {
    const low  = buildSceneSpec({ ...SAMPLE.lattice, density: 0.5 });
    const high = buildSceneSpec({ ...SAMPLE.lattice, density: 2.0 });
    expect(high.instanceCount).toBeGreaterThan(low.instanceCount);
  });

  it('VIZ_PARAMS table: each project spec has matching archetype and tint', () => {
    for (const [id, params] of Object.entries(VIZ_PARAMS)) {
      const spec = buildSceneSpec(params);
      expect(spec.archetype, id).toBe(params.archetype);
      expect(spec.tint, id).toBe(params.tint);
    }
  });

  it('wavefield: different seeds produce different wave fields (seed-variance guard)', () => {
    const a = buildSceneSpec({ archetype: 'wavefield', seed: 31, density: 0.8, speed: 0.5, tint: '#C8882A' });
    const b = buildSceneSpec({ archetype: 'wavefield', seed: 44, density: 1.0, speed: 0.7, tint: '#5A9090' });
    const differs = a.waveFreq !== b.waveFreq || a.waveAmp !== b.waveAmp || a.wavePhase !== b.wavePhase;
    expect(differs, 'waveFreq/waveAmp/wavePhase must differ between seeds 31 and 44').toBe(true);
  });

  it('wavefield: same seed always produces identical wave fields (determinism)', () => {
    const params = { archetype: 'wavefield' as const, seed: 31, density: 0.8, speed: 0.5, tint: '#C8882A' };
    const a = buildSceneSpec(params);
    const b = buildSceneSpec(params);
    expect(a.waveFreq).toBe(b.waveFreq);
    expect(a.waveAmp).toBe(b.waveAmp);
    expect(a.wavePhase).toBe(b.wavePhase);
  });
});
