// lib/viz/params.ts
import { VizParams } from '../../types';

export function mulberry32(seed: number): () => number {
  return function () {
    seed |= 0;
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Tints: #E85D3A = --accent (red-coral); #C8882A = warm amber; #5A9090 = desaturated teal;
// #A6A77E = --accent-dim (muted olive). No amber/cyan tokens exist in :root; these extend the palette.
export const VIZ_PARAMS: Record<string, VizParams> = {
  // Lattice — crystalline SDKs / frameworks
  'nspb-api':         { archetype: 'lattice',      seed: 11, density: 1.5, speed: 0.6, tint: '#E85D3A' },
  'ferroml':          { archetype: 'lattice',       seed: 22, density: 1.2, speed: 0.8, tint: '#E85D3A' },
  // Wavefield — displaced plane for time-series / forecasting
  'revenue-forecast': { archetype: 'wavefield',    seed: 31, density: 0.8, speed: 0.5, tint: '#C8882A' },
  'kkbox':            { archetype: 'wavefield',    seed: 44, density: 1.0, speed: 0.7, tint: '#5A9090' },
  // Particleflow — streaming particles for ML pipelines and agent tooling
  'ferroml-plugin':   { archetype: 'particleflow', seed: 53, density: 0.9, speed: 1.1, tint: '#5A9090' },
  'gsd-ml':           { archetype: 'particleflow', seed: 61, density: 1.1, speed: 1.2, tint: '#5A9090' },
  'mlforge':          { archetype: 'particleflow', seed: 77, density: 0.8, speed: 1.0, tint: '#5A9090' },
  // Wireframe — structural primitive for vision / construction
  'obj-detect':       { archetype: 'wireframe',   seed: 83, density: 0.7, speed: 0.9, tint: '#A6A77E' },
  'ironclad':         { archetype: 'wireframe',   seed: 99, density: 0.9, speed: 0.7, tint: '#A6A77E' },
};
