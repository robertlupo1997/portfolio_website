# Design Upgrade — Shader-First Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Pre-flight rule (project memory):** before executing, run each task's test code against the real codebase in a scratch worktree first to catch integration bugs before touching the main branch.

**Goal:** Push treylupo.com to award-tier visual quality — one WebGL/ASCII generative visual per project card, Space Grotesk 400 type system, 4px-grid spacing, sanctioned motion vocabulary, and an outcome-led copy pass — while keeping the dark olive + red-coral terminal identity and leaving all push/deploy/merge decisions to Trey.

**Architecture:** A single React Three Fiber `VizCanvas` (lazy-loaded post-preloader) sits at Carousel level, outside the scrolling track, covering the image column with `position: absolute`. Scene archetype and params are seeded per project via `lib/viz/params.ts`. An `AsciiEffect` post-process shader (ported from `references/webgl-ascii-hero`) adds the ASCII treatment; a new `transitionVelocity` uniform spikes wave + glitch amplitude during slide changes. Static per-project PNG captures (1200×800, committed) serve mobile, reduced-motion, and WebGL fallback. Type, spacing, motion, and copy are swept in separate tasks so each step is independently reviewable.

**Tech Stack:** React 19, Vite 6, TypeScript 5.8, GSAP (existing), `three`, `@react-three/fiber`, `postprocessing`, `@fontsource/space-grotesk` (devDep, woff2 committed), Playwright, vitest (existing 19 tests + 5 e2e).

**Spec:** `docs/superpowers/specs/2026-07-03-design-upgrade-shader-first-design.md`

## Global Constraints

- All app code under `rlupo-portfolio/`; paths below are relative to it unless prefixed with `docs/`.
- **Branch:** `feat/design-upgrade` off `feat/ask-my-work` — created in Task 1 step 1.
- **No push, merge, or deploy.** Trey's explicit gate.
- **Font weight 400 only.** No `font-weight` other than 400 anywhere. Hierarchy from size and color only. Audit: `grep -rn font-weight styles/ components/`.
- **4px spacing scale.** New tokens: `--sp-1: 4px` … `--sp-5: 20px`, `--sp-8: 32px`, `--sp-9: 36px`, `--sp-10: 40px`. All new gaps must snap to a multiple. Existing rem tokens (`--space-xs` etc.) stay; new rules use `--sp-*`.
- **Duration tokens:** update `:root` values — `--duration-sm: 225ms`, `--duration-md: 300ms`. New: `--ease-micro: cubic-bezier(0.4, 0, 0.2, 1)`, `--ease-entrance: cubic-bezier(0, 0, 0.2, 1)`, `--duration-bg-sweep: 400ms`.
  - Rationale: changing token values in `:root` is a design-intent update; sweeping individual component rules happens in Task 8.
- **Perf budget:** initial JS bundle (pre-lazy chunk) grows < 5 KB gzip. Three/fiber/postprocessing chunk lazy-loads post-preloader via `React.lazy` + dynamic import.
- **Dev server:** `npm run dev` (port 3000). Unit tests: `npx vitest run` (19 existing). e2e: `npx playwright test` (5 existing, config reuses port 3000, waits for `.site-content--visible` ~3.1 s). tsc: `npx tsc --noEmit`. Build: `npm run build`. Corpus: `npm run build:corpus`.
- **Z-index contract:** viz canvas ≤ z-index 1 (BELOW carousel content). Header: 100; ask-panel mobile: 110.
- **Palette note:** current `:root` is olive-dark (`--bg-primary: #474741`), not near-black; spec's "near-black" refers to the dark identity feel. The ask-panel's `#0a0a0a` is a task-local override from `feat/ask-my-work` and is unrelated. No palette changes in this upgrade.
- **Reduced-motion:** all existing `prefers-reduced-motion` guards honored; new animations respect them.
- **Commit style:** match `git log --oneline` history (e.g. `feat(viz): …`, `style: …`, `content: …`).
- **No radius > 4px** on new elements; no box-shadows.
- **CSS ordering rule:** new base rule blocks go ABOVE the `@media (max-width: 768px)` section (~line 1043); mobile overrides go INSIDE it.

---

### Task 1: Branch + design tokens + Space Grotesk

**Files:**
- Modify: `styles/index.css` (`@font-face` block + `:root` token additions)
- Add: `public/fonts/SpaceGrotesk-400.woff2`
- No component rule changes — tokens only.

**Interfaces:**
- Produces: `--sp-1` … `--sp-10`, `--ease-micro`, `--ease-entrance`, `--duration-bg-sweep`; updated `--duration-sm: 225ms`, `--duration-md: 300ms`; `--font-sans` pointed at `'Space Grotesk'`; self-hosted woff2 at `/fonts/SpaceGrotesk-400.woff2`.
- Consumes: nothing new.

- [ ] **Step 1: Create branch**

```bash
git checkout feat/ask-my-work
git checkout -b feat/design-upgrade
```

- [ ] **Step 2: Install @fontsource/space-grotesk and copy woff2**

```bash
cd rlupo-portfolio
npm i -D @fontsource/space-grotesk
cp node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-400-normal.woff2 public/fonts/SpaceGrotesk-400.woff2
```

License: Space Grotesk is OFL 1.1 (Florian Karsten). The woff2 file may be committed. The npm package is devDependency only — it is not imported in app code.

- [ ] **Step 3: Add @font-face to styles/index.css** — insert after the existing `@font-face` for Departure Mono, before the `:root` block:

```css
@font-face {
  font-family: 'Space Grotesk';
  src: url('/fonts/SpaceGrotesk-400.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
```

- [ ] **Step 4: Update `:root` — duration values + new tokens**

In the existing `:root` block at line 14:

1. Change `--duration-sm: 150ms` → `--duration-sm: 225ms`
2. Change `--duration-md: 200ms` → `--duration-md: 300ms`
3. Change `--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` → `--font-sans: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
4. After the existing motion token block, add:

```css
  /* --- Design-upgrade easings --- */
  --ease-micro: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-entrance: cubic-bezier(0, 0, 0.2, 1);
  --duration-bg-sweep: 400ms;

  /* --- 4px spacing scale --- */
  --sp-1: 4px;
  --sp-2: 8px;
  --sp-3: 12px;
  --sp-4: 16px;
  --sp-5: 20px;
  --sp-8: 32px;
  --sp-9: 36px;
  --sp-10: 40px;

  /* --- Type rhythm --- */
  --leading-display: 0.95;
  --leading-body: 1.5;
  --letter-spacing-sm: 0.36px;
  --letter-spacing-label: 0.52px;
```

- [ ] **Step 5: Smoke-check font in browser**

```bash
npm run dev
# Open http://localhost:3000, DevTools → Computed → font-family on <body>
# Expected: "Space Grotesk" first in the resolved list
# Departure Mono labels must be unchanged
```

- [ ] **Step 6: Commit**

```bash
git add rlupo-portfolio/styles/index.css rlupo-portfolio/public/fonts/SpaceGrotesk-400.woff2 rlupo-portfolio/package.json rlupo-portfolio/package-lock.json
git commit -m "$(cat <<'EOF'
style: design tokens — Space Grotesk 400, 4px scale, duration/easing update
EOF
)"
```

---

### Task 2: lib/viz/params.ts + VizParams type + constants.ts wiring

**Files:**
- Create: `lib/viz/params.ts`
- Modify: `types.ts` (add `VizParams` interface, add `vizParams?: VizParams` to `Project`)
- Modify: `constants.ts` (add `vizParams` to every project, remove `imageUrl` fields)
- Create: `lib/viz/__tests__/params.test.ts`

**Interfaces:**
- Produces: `VizParams { archetype: 'lattice'|'wavefield'|'particleflow'|'wireframe'; seed: number; density: number; speed: number; tint: string }`; `mulberry32(seed: number): () => number`; `VIZ_PARAMS: Record<string, VizParams>`.
- Consumes: project id strings — no import from `constants.ts` to avoid circular dep (table uses string keys, not `Project` objects).

**Tint derivation:** Only `--accent: #E85D3A` (red-coral) and `--accent-dim: #A6A77E` (muted olive) exist in `:root`. No amber or cyan tokens are defined. The four viz tints extend the warm-dark palette:
- Lattice: `#E85D3A` — the primary `--accent` red-coral.
- Wavefield: `#C8882A` — warm amber derived from the site's red-coral warm family.
- Particleflow: `#5A9090` — desaturated teal/cyan; cool counterpoint.
- Wireframe: `#A6A77E` — directly from `--accent-dim` muted olive.

**Archetype assignments** (resolved ambiguity noted in plan RETURN):
- `ferroml-plugin` → `particleflow` (ML pipeline from natural conversation; "agent/automation" mapping from spec wins over the SDK framing).

- [ ] **Step 1: Write failing tests**

```ts
// lib/viz/__tests__/params.test.ts
import { describe, it, expect } from 'vitest';
import { VIZ_PARAMS, mulberry32 } from '../params';
import { CAROUSEL_PROJECTS } from '../../constants';

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
```

- [ ] **Step 2: Run — expect failure (module not found)**

```bash
cd rlupo-portfolio && npx vitest run lib/viz/__tests__/params.test.ts
# Expected: Cannot find module '../params'
```

- [ ] **Step 3: Add VizParams to types.ts** — append after the `ActivityEntry` interface:

```ts
export interface VizParams {
  archetype: 'lattice' | 'wavefield' | 'particleflow' | 'wireframe';
  seed: number;
  density: number;
  speed: number;
  tint: string;
}
```

And add to the `Project` interface:

```ts
  vizParams?: VizParams;
```

- [ ] **Step 4: Create lib/viz/params.ts**

```ts
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
  'nspb-api':         { archetype: 'lattice',      seed: 11, density: 1.0, speed: 0.6, tint: '#E85D3A' },
  'ferroml':          { archetype: 'lattice',       seed: 22, density: 1.2, speed: 0.8, tint: '#E85D3A' },
  // Wavefield — displaced plane for time-series / forecasting
  'revenue-forecast': { archetype: 'wavefield',    seed: 31, density: 0.8, speed: 0.5, tint: '#C8882A' },
  'kkbox':            { archetype: 'wavefield',    seed: 44, density: 1.0, speed: 0.7, tint: '#C8882A' },
  // Particleflow — streaming particles for ML pipelines and agent tooling
  'ferroml-plugin':   { archetype: 'particleflow', seed: 53, density: 0.9, speed: 1.1, tint: '#5A9090' },
  'gsd-ml':           { archetype: 'particleflow', seed: 61, density: 1.1, speed: 1.2, tint: '#5A9090' },
  'mlforge':          { archetype: 'particleflow', seed: 77, density: 0.8, speed: 1.0, tint: '#5A9090' },
  // Wireframe — structural primitive for vision / construction
  'obj-detect':       { archetype: 'wireframe',   seed: 83, density: 0.7, speed: 0.9, tint: '#A6A77E' },
  'ironclad':         { archetype: 'wireframe',   seed: 99, density: 0.9, speed: 0.7, tint: '#A6A77E' },
};
```

- [ ] **Step 5: Run tests — expect all 7 to pass**

```bash
cd rlupo-portfolio && npx vitest run lib/viz/__tests__/params.test.ts
```

- [ ] **Step 6: Update constants.ts** — add import + `vizParams` to every project + remove `imageUrl` fields

At top of `constants.ts`, after existing imports add:

```ts
import { VIZ_PARAMS } from './lib/viz/params';
```

For each of the 9 projects in `FEATURED_PROJECTS` and `ALL_PROJECTS`:
1. Add `vizParams: VIZ_PARAMS['<id>'],` after the `featured` field.
2. Remove the `imageUrl: '...'` line.

`revenue-forecast` has no `imageUrl`; just add `vizParams`. Example diff:

```ts
  {
    id: "nspb-api",
    // ... all other fields unchanged ...
    featured: true,
    vizParams: VIZ_PARAMS['nspb-api'],
    // imageUrl: "/assets/amazon-network.jpg",  ← REMOVED
  },
```

- [ ] **Step 7: Corpus regen + full test run**

```bash
cd rlupo-portfolio && npm run build:corpus && npx vitest run
```

Expected: ≥ 26 tests pass (7 new params tests + 19 existing). If corpus snapshot expectations reference old text, update them.

- [ ] **Step 8: Commit**

```bash
git add rlupo-portfolio/lib/viz/ rlupo-portfolio/types.ts rlupo-portfolio/constants.ts rlupo-portfolio/generated/corpus.ts
git commit -m "$(cat <<'EOF'
feat(viz): VizParams type + per-project param table, imageUrl removed
EOF
)"
```

---

### Task 3: Vendor deps + AsciiEffect port

**Files:**
- Modify: `package.json` (add `three`, `@react-three/fiber`, `postprocessing`; devDep `@types/three`)
- Create: `components/viz/AsciiEffect.ts`
- Create: `components/viz/__tests__/AsciiEffect.test.ts`

**Interfaces:**
- Produces: `AsciiEffectImpl` class (extends `postprocessing` `Effect`); exported pure helpers `TERMINAL_SYMBOLS: string[]` and `buildGlyphAtlasParams(chars: string[], size: number): { width: number; height: number; count: number }`; `createGlyphTexture(...)` (DOM-dependent, not testable in node); `transitionVelocity` uniform.
- Consumes: `three` (Uniform, Vector2, Vector3, Color, CanvasTexture, etc.); `postprocessing` (Effect, BlendFunction).

**Test boundary:** `createGlyphTexture` calls `document.createElement('canvas').getContext('2d')` which returns `null` in node/jsdom — the function returns `null` and no pixel assertions are possible. Tests cover only the pure surface: `TERMINAL_SYMBOLS` shape and `buildGlyphAtlasParams` math (no GL, no DOM).

- [ ] **Step 1: Write failing tests**

```ts
// components/viz/__tests__/AsciiEffect.test.ts
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
```

- [ ] **Step 2: Run — expect failure**

```bash
cd rlupo-portfolio && npx vitest run components/viz/__tests__/AsciiEffect.test.ts
# Expected: Cannot find module '../AsciiEffect'
```

- [ ] **Step 3: Install dependencies**

```bash
cd rlupo-portfolio && npm i three @react-three/fiber postprocessing && npm i -D @types/three
```

Record the installed versions in a comment at the top of `AsciiEffect.ts` (e.g. `// three@0.169.0 @react-three/fiber@8.17.0 postprocessing@6.36.0`).

- [ ] **Step 4: Create components/viz/AsciiEffect.ts**

Port from `references/webgl-ascii-hero/components/ascii-effect.tsx`. Key Vite/React19 changes: remove `"use client"` and the `forwardRef` React component wrapper; export `AsciiEffectImpl` directly for VizCanvas to instantiate. Add `transitionVelocity` uniform that spikes `waveAmplitude` and `glitchIntensity`.

```ts
// components/viz/AsciiEffect.ts
// Ported from references/webgl-ascii-hero/components/ascii-effect.tsx
// three@<installed> @react-three/fiber@<installed> postprocessing@<installed>
import {
  CanvasTexture, ClampToEdgeWrapping, LinearFilter,
  Uniform, Vector2, Vector3, WebGLRenderer, WebGLRenderTarget,
} from 'three';
import { Effect, BlendFunction } from 'postprocessing';

export const TERMINAL_SYMBOLS: string[] = [
  '.', ':', '-', '=', '+', '*', '#', '%', '@', '0', 'O', 'N', 'M', 'W', 'B', 'X',
];

export interface GlyphAtlasParams { width: number; height: number; count: number; }

/** Pure helper — atlas dimension math, no DOM. */
export function buildGlyphAtlasParams(chars: string[], size: number): GlyphAtlasParams {
  return { width: size * chars.length, height: size, count: chars.length };
}

/** DOM-dependent. Returns null in Node/jsdom (ctx is null). */
export function createGlyphTexture(
  characters: string[],
  size = 64,
  font = '62px monospace',
): CanvasTexture | null {
  if (characters.length === 0) return null;
  const canvas = document.createElement('canvas');
  canvas.width = size * characters.length;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#fff';
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < characters.length; i++) {
    ctx.fillText(characters[i], i * size + size / 2, size / 2);
  }
  const tex = new CanvasTexture(canvas);
  tex.needsUpdate = true;
  tex.minFilter = LinearFilter;
  tex.magFilter = LinearFilter;
  tex.wrapS = ClampToEdgeWrapping;
  tex.wrapT = ClampToEdgeWrapping;
  return tex;
}

// Fragment shader identical to reference except:
//   • transitionVelocity uniform added: drives effectiveWaveAmp and effectiveGlitch
//   • asciiStyle parameter removed (standard mode only; simplifies uniform surface)
const fragmentShader = `
uniform float cellSize;
uniform bool invert;
uniform bool colorMode;
uniform float time;
uniform vec2 resolution;
uniform vec2 mousePos;
uniform float scanlineIntensity;
uniform float scanlineCount;
uniform float jitterIntensity;
uniform float jitterSpeed;
uniform bool mouseGlowEnabled;
uniform float mouseGlowRadius;
uniform float mouseGlowIntensity;
uniform float vignetteIntensity;
uniform float vignetteRadius;
uniform float curvature;
uniform float aberrationStrength;
uniform float noiseIntensity;
uniform float noiseScale;
uniform float noiseSpeed;
uniform float waveAmplitude;
uniform float waveFrequency;
uniform float waveSpeed;
uniform float glitchIntensity;
uniform float glitchFrequency;
uniform float brightnessAdjust;
uniform float contrastAdjust;
uniform sampler2D glyphAtlas;
uniform float glyphTiles;
uniform bool useGlyphAtlas;
uniform bool volumeShading;
uniform bool useTintColor;
uniform vec3 tintColor;
uniform float transitionVelocity;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}
float noise(vec2 st) {
  vec2 i = floor(st); vec2 f = fract(st);
  float a = random(i); float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0)); float d = random(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
float getChar(float brightness, vec2 p) {
  if (brightness < 0.01) return 0.0;
  vec2 grid = floor(p * 4.0);
  float dotP   = (grid.x == 1.0 && grid.y == 1.0) ? 1.0 : 0.0;
  float block2 = ((grid.x == 1.0 || grid.x == 2.0) && (grid.y == 1.0 || grid.y == 2.0)) ? 1.0 : 0.0;
  float barH   = (grid.y == 1.0 || grid.y == 2.0) ? 1.0 : 0.0;
  float barH2  = (grid.y == 0.0 || grid.y == 3.0) ? 1.0 : (grid.y == 1.0 || grid.y == 2.0) ? 0.5 : 0.0;
  float edge   = (grid.x == 0.0 || grid.x == 2.0 || grid.y == 0.0 || grid.y == 2.0) ? 1.0 : 0.3;
  float t0 = 1.0 - smoothstep(0.0, 0.15, brightness);
  float t1 = smoothstep(0.08, 0.22, brightness) * (1.0 - smoothstep(0.22, 0.35, brightness));
  float t2 = smoothstep(0.20, 0.38, brightness) * (1.0 - smoothstep(0.38, 0.50, brightness));
  float t3 = smoothstep(0.35, 0.52, brightness) * (1.0 - smoothstep(0.52, 0.65, brightness));
  float t4 = smoothstep(0.50, 0.70, brightness) * (1.0 - smoothstep(0.70, 0.82, brightness));
  float t5 = smoothstep(0.68, 1.0, brightness);
  return clamp(dotP*t0*0.5 + block2*t1 + barH*t2 + barH2*t3 + edge*t4 + t5, 0.0, 1.0);
}
void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 workUV = uv;
  float tv = transitionVelocity;
  float effectiveWaveAmp = waveAmplitude + tv * 0.008;
  float effectiveGlitch  = glitchIntensity + tv * 0.12;

  if (curvature > 0.0) {
    vec2 c2 = workUV * 2.0 - 1.0;
    c2 *= 1.0 + curvature * dot(c2, c2);
    workUV = c2 * 0.5 + 0.5;
    if (workUV.x < 0.0 || workUV.x > 1.0 || workUV.y < 0.0 || workUV.y > 1.0) {
      outputColor = vec4(0.0); return;
    }
  }
  if (effectiveWaveAmp > 0.0) {
    workUV.x += sin(workUV.y * waveFrequency + time * waveSpeed) * effectiveWaveAmp;
    workUV.y += cos(workUV.x * waveFrequency + time * waveSpeed) * effectiveWaveAmp;
  }
  vec4 sampledColor;
  if (aberrationStrength > 0.0) {
    float off = aberrationStrength;
    sampledColor = vec4(
      texture(inputBuffer, workUV + vec2(off, 0.0)).r,
      texture(inputBuffer, workUV).g,
      texture(inputBuffer, workUV - vec2(off, 0.0)).b, 1.0);
  } else {
    sampledColor = texture(inputBuffer, workUV);
  }
  sampledColor.rgb = (sampledColor.rgb - 0.5) * contrastAdjust + 0.5 + brightnessAdjust;
  if (noiseIntensity > 0.0)
    sampledColor.rgb += (noise(workUV * noiseScale + time * noiseSpeed) - 0.5) * noiseIntensity;

  vec2 cellCount = resolution / cellSize;
  vec2 cellCoord = floor(uv * cellCount);
  if (jitterIntensity > 0.0) {
    float jt = time * jitterSpeed;
    cellCoord += vec2(
      (random(vec2(cellCoord.y, floor(jt))) - 0.5) * jitterIntensity * 2.0,
      (random(vec2(cellCoord.x, floor(jt + 1000.0))) - 0.5) * jitterIntensity * 2.0
    );
  }
  if (effectiveGlitch > 0.0 && glitchFrequency > 0.0) {
    float gt = floor(time * glitchFrequency);
    if (random(vec2(gt, cellCoord.y)) < effectiveGlitch)
      cellCoord.x += (random(vec2(gt + 1.0, cellCoord.y)) - 0.5) * 20.0;
  }

  vec2 cellUV = (cellCoord + 0.5) / cellCount;
  vec4 cellColor = texture(inputBuffer, cellUV);
  float rawLum = dot(cellColor.rgb, vec3(0.299, 0.587, 0.114));
  cellColor.rgb = (cellColor.rgb - 0.5) * contrastAdjust + 0.5 + brightnessAdjust;
  float brightness = dot(cellColor.rgb, vec3(0.299, 0.587, 0.114));
  if (invert) brightness = 1.0 - brightness;
  float bfg = volumeShading ? clamp((brightness - 0.5) * 1.6 + 0.5, 0.0, 1.0) : brightness;
  float emptyT = volumeShading ? 0.04 : 0.14;
  vec2 localUV = fract(uv * cellCount);
  float charValue;
  if (rawLum < 0.06 || brightness < emptyT) {
    charValue = 0.0;
  } else if (useGlyphAtlas && glyphTiles > 0.0) {
    float tile = clamp(floor(bfg * glyphTiles), 0.0, glyphTiles - 1.0);
    float inset = 0.02;
    vec2 inner = vec2(inset + localUV.x * (1.0 - 2.0 * inset), inset + localUV.y * (1.0 - 2.0 * inset));
    charValue = texture(glyphAtlas, vec2((tile + inner.x) / glyphTiles, inner.y)).r;
  } else {
    charValue = getChar(bfg, localUV);
  }
  vec3 finalColor = colorMode
    ? (useTintColor ? tintColor * charValue : cellColor.rgb * charValue)
    : vec3(brightness * charValue);
  if (mouseGlowEnabled) {
    float dist = length(uv * resolution - mousePos);
    finalColor += exp(-dist / mouseGlowRadius) * mouseGlowIntensity;
  }
  if (scanlineIntensity > 0.0)
    finalColor *= 1.0 - (sin(uv.y * scanlineCount * 3.14159) * 0.5 + 0.5) * scanlineIntensity;
  if (vignetteIntensity > 0.0) {
    vec2 cv = uv * 2.0 - 1.0;
    finalColor *= mix(1.0, 1.0 - dot(cv, cv) / vignetteRadius, vignetteIntensity);
  }
  outputColor = vec4(finalColor, cellColor.a);
}
`;

export interface AsciiEffectOptions {
  cellSize?: number;
  invert?: boolean;
  color?: boolean;
  mousePos?: Vector2;
  resolution?: Vector2;
  postfx?: Record<string, number | boolean>;
  glyphAtlas?: CanvasTexture | null;
  glyphTiles?: number;
  volumeShading?: boolean;
  tintColor?: Vector3 | null;
}

export class AsciiEffectImpl extends Effect {
  private _time = 0;
  private _mousePos: Vector2;
  private _resolution: Vector2;

  constructor(opts: AsciiEffectOptions = {}) {
    const {
      cellSize = 9, invert = true, color = true,
      mousePos = new Vector2(0, 0),
      resolution = new Vector2(1920, 1080),
      postfx = {},
      glyphAtlas = null, glyphTiles = 0,
      volumeShading = false, tintColor = null,
    } = opts;

    super('AsciiEffect', fragmentShader, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map<string, Uniform<unknown>>([
        ['cellSize',           new Uniform(cellSize)],
        ['invert',             new Uniform(invert)],
        ['colorMode',          new Uniform(color)],
        ['time',               new Uniform(0)],
        ['resolution',         new Uniform(resolution)],
        ['mousePos',           new Uniform(mousePos)],
        ['glyphAtlas',         new Uniform(glyphAtlas)],
        ['glyphTiles',         new Uniform(glyphTiles)],
        ['useGlyphAtlas',      new Uniform(!!glyphAtlas)],
        ['volumeShading',      new Uniform(volumeShading)],
        ['useTintColor',       new Uniform(!!tintColor)],
        ['tintColor',          new Uniform(tintColor ?? new Vector3(1, 1, 1))],
        ['transitionVelocity', new Uniform(0)],
        ['scanlineIntensity',  new Uniform(postfx.scanlineIntensity ?? 0.08)],
        ['scanlineCount',      new Uniform(postfx.scanlineCount ?? 200)],
        ['jitterIntensity',    new Uniform(postfx.jitterIntensity ?? 0)],
        ['jitterSpeed',        new Uniform(postfx.jitterSpeed ?? 1)],
        ['mouseGlowEnabled',   new Uniform(postfx.mouseGlowEnabled ?? true)],
        ['mouseGlowRadius',    new Uniform(postfx.mouseGlowRadius ?? 200)],
        ['mouseGlowIntensity', new Uniform(postfx.mouseGlowIntensity ?? 0.8)],
        ['vignetteIntensity',  new Uniform(postfx.vignetteIntensity ?? 0.25)],
        ['vignetteRadius',     new Uniform(postfx.vignetteRadius ?? 0.9)],
        ['curvature',          new Uniform(postfx.curvature ?? 0)],
        ['aberrationStrength', new Uniform(postfx.aberrationStrength ?? 0)],
        ['noiseIntensity',     new Uniform(postfx.noiseIntensity ?? 0)],
        ['noiseScale',         new Uniform(postfx.noiseScale ?? 1)],
        ['noiseSpeed',         new Uniform(postfx.noiseSpeed ?? 1)],
        ['waveAmplitude',      new Uniform(postfx.waveAmplitude ?? 0)],
        ['waveFrequency',      new Uniform(postfx.waveFrequency ?? 10)],
        ['waveSpeed',          new Uniform(postfx.waveSpeed ?? 1)],
        ['glitchIntensity',    new Uniform(postfx.glitchIntensity ?? 0)],
        ['glitchFrequency',    new Uniform(postfx.glitchFrequency ?? 2)],
        ['brightnessAdjust',   new Uniform(postfx.brightnessAdjust ?? 0)],
        ['contrastAdjust',     new Uniform(postfx.contrastAdjust ?? 1.6)],
      ]),
    });

    this._mousePos = mousePos;
    this._resolution = resolution;
  }

  setMousePos(x: number, y: number): void {
    this._mousePos.set(x, y);
    this.uniforms.get('mousePos')!.value = this._mousePos;
  }

  setResolution(w: number, h: number): void {
    this._resolution.set(w, h);
    this.uniforms.get('resolution')!.value = this._resolution;
  }

  setTransitionVelocity(v: number): void {
    this.uniforms.get('transitionVelocity')!.value = v;
  }

  override update(
    _renderer: WebGLRenderer,
    _inputBuffer: WebGLRenderTarget,
    deltaTime = 0,
  ): void {
    const ctx = _renderer.getContext() as WebGLRenderingContext;
    if ((ctx as WebGLRenderingContext).isContextLost?.()) return;
    this._time += deltaTime;
    this.uniforms.get('time')!.value = this._time;
  }
}
```

- [ ] **Step 5: Run tests — expect 4 to pass**

```bash
cd rlupo-portfolio && npx vitest run components/viz/__tests__/AsciiEffect.test.ts
```

- [ ] **Step 6: Full tests + tsc**

```bash
cd rlupo-portfolio && npx vitest run && npx tsc --noEmit
```

Expected: ≥ 30 tests pass, 0 type errors.

- [ ] **Step 7: Commit**

```bash
git add rlupo-portfolio/components/viz/ rlupo-portfolio/package.json rlupo-portfolio/package-lock.json
git commit -m "$(cat <<'EOF'
feat(viz): AsciiEffect port with transitionVelocity uniform; vendor deps
EOF
)"
```

---

### Task 4: components/viz/scenes.ts — archetype builders

**Files:**
- Create: `components/viz/scenes.ts`
- Create: `components/viz/__tests__/scenes.test.ts`

**Interfaces:**
- Produces: `SceneSpec { archetype, seed, density, speed, tint, instanceCount, geometryType: 'box'|'sphere'|'plane'|'octahedron', animationAmplitude, spacing, gridSize?, planeSegments? }`; `buildSceneSpec(params: VizParams): SceneSpec`; individual builders for each archetype (all pure — no Three.js object creation).
- Consumes: `VizParams` from `../../types`; `VIZ_PARAMS` from `../../lib/viz/params` (in tests only).

- [ ] **Step 1: Write failing tests**

```ts
// components/viz/__tests__/scenes.test.ts
import { describe, it, expect } from 'vitest';
import { buildSceneSpec } from '../scenes';
import { VIZ_PARAMS } from '../../lib/viz/params';
import { VizParams } from '../../types';

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
});
```

- [ ] **Step 2: Run — expect failure**

```bash
cd rlupo-portfolio && npx vitest run components/viz/__tests__/scenes.test.ts
```

- [ ] **Step 3: Create components/viz/scenes.ts**

```ts
// components/viz/scenes.ts
import { VizParams } from '../../types';

export type GeometryType = 'box' | 'sphere' | 'plane' | 'octahedron';

export interface SceneSpec {
  archetype: VizParams['archetype'];
  seed: number;
  density: number;
  speed: number;
  tint: string;
  instanceCount: number;
  geometryType: GeometryType;
  animationAmplitude: number;
  spacing: number;
  gridSize?: number;       // lattice: dimension of n×n×n grid
  planeSegments?: number;  // wavefield: subdivision count
}

export function buildLatticeSpec(p: VizParams): SceneSpec {
  const dim = Math.max(2, Math.round(6 * Math.sqrt(p.density)));
  return {
    archetype: 'lattice', seed: p.seed, density: p.density, speed: p.speed, tint: p.tint,
    instanceCount: dim * dim * dim,
    geometryType: 'box',
    animationAmplitude: 0.15 * p.speed,
    spacing: 1.4 / p.density,
    gridSize: dim,
  };
}

export function buildWavefieldSpec(p: VizParams): SceneSpec {
  return {
    archetype: 'wavefield', seed: p.seed, density: p.density, speed: p.speed, tint: p.tint,
    instanceCount: 1,
    geometryType: 'plane',
    animationAmplitude: 0.4 * p.speed,
    spacing: 0,
    planeSegments: Math.max(10, Math.round(40 * p.density)),
  };
}

export function buildParticleflowSpec(p: VizParams): SceneSpec {
  return {
    archetype: 'particleflow', seed: p.seed, density: p.density, speed: p.speed, tint: p.tint,
    instanceCount: Math.max(50, Math.round(800 * p.density)),
    geometryType: 'sphere',
    animationAmplitude: 0.02 * p.speed,
    spacing: 1.0,
  };
}

export function buildWireframeSpec(p: VizParams): SceneSpec {
  return {
    archetype: 'wireframe', seed: p.seed, density: p.density, speed: p.speed, tint: p.tint,
    instanceCount: Math.max(1, Math.round(3 * p.density)),
    geometryType: 'octahedron',
    animationAmplitude: 0.5 * p.speed,
    spacing: 2.5,
  };
}

const BUILDERS: Record<VizParams['archetype'], (p: VizParams) => SceneSpec> = {
  lattice:      buildLatticeSpec,
  wavefield:    buildWavefieldSpec,
  particleflow: buildParticleflowSpec,
  wireframe:    buildWireframeSpec,
};

export function buildSceneSpec(params: VizParams): SceneSpec {
  return BUILDERS[params.archetype](params);
}
```

- [ ] **Step 4: Run tests — expect all 8 to pass**

```bash
cd rlupo-portfolio && npx vitest run components/viz/__tests__/scenes.test.ts
```

- [ ] **Step 5: Full tests + tsc**

```bash
cd rlupo-portfolio && npx vitest run && npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add rlupo-portfolio/components/viz/scenes.ts rlupo-portfolio/components/viz/__tests__/scenes.test.ts
git commit -m "$(cat <<'EOF'
feat(viz): 4 scene archetype builders, pure/seeded/testable
EOF
)"
```

---

### Task 5: components/viz/VizCanvas.tsx

**Files:**
- Create: `components/viz/VizCanvas.tsx`

**Interfaces:**
- Consumes: `SceneSpec` / `buildSceneSpec` from `./scenes`; `AsciiEffectImpl`, `createGlyphTexture`, `TERMINAL_SYMBOLS` from `./AsciiEffect`; `VizParams` from `../../types`; `Canvas`, `useFrame`, `useThree` from `@react-three/fiber`; `EffectComposer` from `@react-three/postprocessing`.
- Produces:
  ```ts
  interface VizCanvasProps {
    params: VizParams | null;     // active project params; null → render nothing
    loaded: boolean;             // preloader gate — module lazy-loads after this is true
    transitionVelocity: number;  // 0→1 bell curve during slide change (from Carousel)
    onFallback: () => void;      // called once on WebGL context loss
  }
  ```
  Exposes `data-testid="viz-canvas"` on the container div.

- [ ] **Step 1: Create components/viz/VizCanvas.tsx**

```tsx
// components/viz/VizCanvas.tsx
import React, {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer } from '@react-three/postprocessing';
import {
  BoxGeometry, Color, InstancedMesh, MeshStandardMaterial,
  Object3D, OctahedronGeometry, PlaneGeometry, SphereGeometry,
  Vector3 as ThreeVector3,
} from 'three';
import { VizParams } from '../../types';
import { buildSceneSpec, SceneSpec } from './scenes';
import { AsciiEffectImpl, createGlyphTexture, TERMINAL_SYMBOLS } from './AsciiEffect';

// ---------------------------------------------------------------------------
// Inner: syncs transitionVelocity ref → AsciiEffectImpl uniform each frame
// ---------------------------------------------------------------------------
function VelocityBridge({
  effectRef,
  velocityRef,
}: {
  effectRef: React.MutableRefObject<AsciiEffectImpl | null>;
  velocityRef: React.MutableRefObject<number>;
}) {
  useFrame(() => {
    effectRef.current?.setTransitionVelocity(velocityRef.current);
  });
  return null;
}

// ---------------------------------------------------------------------------
// Inner: renders the 3-frame deferred EffectComposer + ASCII effect
// ---------------------------------------------------------------------------
function ComposerMount({
  effectRef,
  tint,
}: {
  effectRef: React.MutableRefObject<AsciiEffectImpl | null>;
  tint: string;
}) {
  const { gl } = useThree();
  const [ready, setReady] = useState(false);
  const frameCount = useRef(0);

  useFrame(() => {
    frameCount.current++;
    if (frameCount.current >= 3 && !ready) {
      setTimeout(() => {
        try {
          const ctx = gl.getContext() as WebGLRenderingContext;
          if (!ctx.isContextLost?.()) setReady(true);
        } catch (_) {}
      }, 100);
    }
  });

  const glyphAtlas = useMemo(() => createGlyphTexture(TERMINAL_SYMBOLS), []);
  const tintVec = useMemo(() => {
    const c = new Color(tint);
    return new ThreeVector3(c.r, c.g, c.b);
  }, [tint]);

  const effect = useMemo(
    () =>
      new AsciiEffectImpl({
        cellSize: 9, invert: true, color: true,
        glyphAtlas, glyphTiles: TERMINAL_SYMBOLS.length,
        volumeShading: true,
        tintColor: tintVec,
        postfx: { contrastAdjust: 1.6, scanlineIntensity: 0.06, vignetteIntensity: 0.2 },
      }),
    [tintVec, glyphAtlas],
  );

  useEffect(() => {
    effectRef.current = effect;
    return () => { effectRef.current = null; };
  }, [effect, effectRef]);

  if (!ready) return null;
  return (
    <EffectComposer>
      <primitive object={effect} dispose={null} />
    </EffectComposer>
  );
}

// ---------------------------------------------------------------------------
// Inner: builds and animates the scene geometry from a SceneSpec
// ---------------------------------------------------------------------------
function VizScene({ spec }: { spec: SceneSpec }) {
  const meshRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const initialPositions = useRef<Float32Array | null>(null);

  const geometry = useMemo(() => {
    switch (spec.geometryType) {
      case 'box':         return new BoxGeometry(0.12, 0.12, 0.12);
      case 'sphere':      return new SphereGeometry(0.06, 4, 4);
      case 'plane':       return new PlaneGeometry(8, 8, spec.planeSegments ?? 40, spec.planeSegments ?? 40);
      case 'octahedron':  return new OctahedronGeometry(0.5 + spec.density * 0.2);
    }
  }, [spec.geometryType, spec.planeSegments, spec.density]);

  const material = useMemo(
    () => new MeshStandardMaterial({ color: spec.tint, roughness: 0.2, metalness: 0, wireframe: spec.archetype === 'wireframe' }),
    [spec.tint, spec.archetype],
  );

  // Seed-deterministic initial positions
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh || spec.archetype === 'wavefield') return;
    const rng = (() => {
      let s = spec.seed;
      return () => {
        s = (s + 0x6D2B79F5) | 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    })();
    const buf = new Float32Array(spec.instanceCount * 3);
    const spread = spec.archetype === 'particleflow' ? 5 : spec.spacing * (spec.gridSize ?? 4);
    for (let i = 0; i < spec.instanceCount; i++) {
      buf[i * 3]     = (rng() - 0.5) * spread;
      buf[i * 3 + 1] = (rng() - 0.5) * spread;
      buf[i * 3 + 2] = (rng() - 0.5) * (spread * 0.5);
      dummy.position.set(buf[i * 3], buf[i * 3 + 1], buf[i * 3 + 2]);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    initialPositions.current = buf;
    mesh.instanceMatrix.needsUpdate = true;
  }, [spec, dummy]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    const buf = initialPositions.current;
    if (!mesh || !buf || spec.archetype === 'wavefield') return;
    const t = performance.now() * 0.001 * spec.speed;
    for (let i = 0; i < spec.instanceCount; i++) {
      dummy.position.set(buf[i * 3], buf[i * 3 + 1], buf[i * 3 + 2]);
      dummy.position.y += Math.sin(t + i * 0.31) * spec.animationAmplitude;
      if (spec.archetype === 'wireframe') dummy.rotation.y = t * 0.3 + i * 1.2;
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <color attach="background" args={['#0a0a0a']} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[2, 4, 5]} intensity={3} />
      <instancedMesh ref={meshRef} args={[geometry, material, spec.instanceCount]} />
    </>
  );
}

// ---------------------------------------------------------------------------
// Public VizCanvas — mounts outside .carousel-track, position: absolute
// ---------------------------------------------------------------------------
export interface VizCanvasProps {
  params: VizParams | null;
  loaded: boolean;
  transitionVelocity: number;
  onFallback: () => void;
}

export const VizCanvas: React.FC<VizCanvasProps> = ({
  params, loaded, transitionVelocity, onFallback,
}) => {
  const effectRef = useRef<AsciiEffectImpl | null>(null);
  const velocityRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { velocityRef.current = transitionVelocity; }, [transitionVelocity]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || !effectRef.current) return;
    effectRef.current.setMousePos(e.clientX - rect.left, rect.height - (e.clientY - rect.top));
  }, []);

  const handleResize = useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || !effectRef.current) return;
    effectRef.current.setResolution(rect.width, rect.height);
  }, []);

  useEffect(() => {
    const ro = new ResizeObserver(handleResize);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [handleResize]);

  if (!loaded || !params) return null;

  const spec = buildSceneSpec(params);

  return (
    <div
      ref={containerRef}
      data-testid="viz-canvas"
      onMouseMove={handleMouseMove}
      style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 0 }}
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => {
          const canvas = gl.domElement;
          const onLost = (e: Event) => { e.preventDefault(); onFallback(); };
          canvas.addEventListener('webglcontextlost', onLost);
          // Return cleanup (R3F calls onCreated return value on unmount)
          return () => canvas.removeEventListener('webglcontextlost', onLost);
        }}
      >
        <VizScene spec={spec} />
        <ComposerMount effectRef={effectRef} tint={params.tint} />
        <VelocityBridge effectRef={effectRef} velocityRef={velocityRef} />
      </Canvas>
    </div>
  );
};

export default VizCanvas;
```

- [ ] **Step 2: tsc check**

```bash
cd rlupo-portfolio && npx tsc --noEmit
```

Fix any type errors. Common ones: `EffectComposer` import path may need to be `@react-three/postprocessing`; `primitive` JSX requires `object` prop typed as `object`.

- [ ] **Step 3: Smoke-test — confirm module tree compiles with no console errors**

```bash
npm run dev
# Open http://localhost:3000, check DevTools console — should be 0 errors
# VizCanvas doesn't render yet (integration Task 6)
```

- [ ] **Step 4: Commit**

```bash
git add rlupo-portfolio/components/viz/VizCanvas.tsx
git commit -m "$(cat <<'EOF'
feat(viz): VizCanvas — R3F canvas, AsciiEffect, velocity bridge, fallback
EOF
)"
```

---

### Task 6: Carousel integration + e2e

**Files:**
- Modify: `components/Carousel.tsx` (mount VizCanvas, publish transitionVelocity, track contextLost)
- Modify: `components/CarouselSlide.tsx` (fallback selector: img on mobile/reduced-motion/contextLost; remove old hasImage guard)
- Modify: `styles/index.css` (add `.viz-canvas-region` rules ABOVE `@media (max-width: 768px)`)
- Create: `e2e/viz-canvas.spec.ts`

**Interfaces:**
- Produces: one `VizCanvas` mounted at Carousel level in `.viz-canvas-region` (absolute, outside `.carousel-track`); `contextLost: boolean` lifted to Carousel; `useFallback: boolean` prop added to `CarouselSlideProps`; CarouselSlide renders `<img src="/viz/${project.id}.png">` when fallback is true.

**Layout:** VizCanvas is inside `<section className="carousel">` but OUTSIDE `.carousel-track`. The section gets `position: relative`. `.viz-canvas-region` is `position: absolute; right: 0; width: 45%; height: 100%; z-index: 0`.

- [ ] **Step 1: Write failing e2e**

```ts
// e2e/viz-canvas.spec.ts
import { test, expect } from '@playwright/test';

test.describe('VizCanvas integration', () => {
  test('canvas visible on desktop after navigation to project slide', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForSelector('.site-content--visible', { timeout: 8000 });
    await page.click('.carousel-btn >> text=NEXT');
    await page.waitForTimeout(800);
    await expect(page.locator('[data-testid="viz-canvas"] canvas')).toBeVisible();
  });

  test('no canvas on 375px — fallback img shown', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForSelector('.site-content--visible', { timeout: 8000 });
    await page.click('.carousel-btn >> text=NEXT');
    await page.waitForTimeout(800);
    await expect(page.locator('[data-testid="viz-canvas"] canvas')).not.toBeVisible();
    await expect(page.locator('.carousel-slide-image img').first()).toBeVisible();
  });

  test('no canvas under prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForSelector('.site-content--visible', { timeout: 8000 });
    await page.click('.carousel-btn >> text=NEXT');
    await page.waitForTimeout(800);
    await expect(page.locator('[data-testid="viz-canvas"] canvas')).not.toBeVisible();
  });

  test('arrows navigate correctly with VizCanvas mounted', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForSelector('.site-content--visible', { timeout: 8000 });
    await page.click('.carousel-btn >> text=NEXT');
    await page.waitForTimeout(800);
    await page.click('.carousel-btn >> text=NEXT');
    await page.waitForTimeout(800);
    await expect(page.locator('.carousel-counter')).toContainText('02');
  });
});
```

- [ ] **Step 2: Run e2e — expect all 4 to fail**

```bash
cd rlupo-portfolio && npx playwright test e2e/viz-canvas.spec.ts
```

- [ ] **Step 3: Add .viz-canvas-region CSS** — in `styles/index.css`, ABOVE the `@media (max-width: 768px)` block (~line 1043):

```css
/* ============================================
   VIZ CANVAS REGION
   ============================================ */

.viz-canvas-region {
  position: absolute;
  top: 0;
  right: 0;
  width: 45%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.viz-canvas-region canvas {
  pointer-events: auto;
}
```

Inside the existing `@media (max-width: 768px)` block, add:

```css
  .viz-canvas-region { display: none; }
```

- [ ] **Step 4: Update Carousel.tsx**

Apply these targeted changes to the existing Carousel.tsx:

```tsx
// 1. Add imports (add after existing imports):
import { useState } from 'react';
import { VizCanvas } from './viz/VizCanvas';

// 2. Inside the Carousel component body, add state:
const [contextLost, setContextLost] = useState(false);
const [transitionVelocity, setTransitionVelocity] = useState(0);

// 3. Derive the active project (slide 0 = hero, 1..N = CAROUSEL_PROJECTS):
const vizProjectIndex = activeIndex - 1;
const activeVizParams =
  vizProjectIndex >= 0 && vizProjectIndex < CAROUSEL_PROJECTS.length
    ? (CAROUSEL_PROJECTS[vizProjectIndex].vizParams ?? null)
    : null;

// 4. In the existing GSAP tween's onUpdate callback (in the useEffect),
//    after the existing blur/transform lines, add:
//      const vel = 4 * p * (1 - p);
//      setTransitionVelocity(vel);
//    And in onComplete, add:
//      setTransitionVelocity(0);

// 5. In the JSX, add style={{ position: 'relative' }} to the <section>, then after
//    </div> (closing .carousel-track) and before <SlideProgress>, add:
//
//    <div className="viz-canvas-region">
//      <VizCanvas
//        params={activeVizParams}
//        loaded={loaded}
//        transitionVelocity={transitionVelocity}
//        onFallback={() => setContextLost(true)}
//      />
//    </div>

// 6. Pass useFallback={contextLost} to every CarouselSlide render.
```

Full updated JSX block for the section:

```tsx
return (
  <section
    className="carousel"
    id="projects"
    ref={sectionRef}
    style={{ position: 'relative' }}
    {...swipeHandlers}
  >
    <div className="carousel-track" ref={trackRef}>
      <HeroSlide
        isActive={activeIndex === 0}
        revealReady={loaded}
        onPrev={prev}
        onNext={next}
        activeIndex={activeIndex}
        totalSlides={CAROUSEL_PROJECTS.length + 2}
      />
      {CAROUSEL_PROJECTS.map((project, i) => (
        <CarouselSlide
          key={project.id}
          project={project}
          index={i}
          isActive={i + 1 === activeIndex}
          onPrev={prev}
          onNext={next}
          activeIndex={activeIndex}
          totalSlides={CAROUSEL_PROJECTS.length + 2}
          useFallback={contextLost}
        />
      ))}
      <ActivitySlide
        isActive={activeIndex === CAROUSEL_PROJECTS.length + 1}
        onPrev={prev}
        onNext={next}
        activeIndex={activeIndex}
        totalSlides={CAROUSEL_PROJECTS.length + 2}
      />
    </div>
    <div className="viz-canvas-region">
      <VizCanvas
        params={activeVizParams}
        loaded={loaded}
        transitionVelocity={transitionVelocity}
        onFallback={() => setContextLost(true)}
      />
    </div>
    <SlideProgress activeIndex={activeIndex} totalSlides={CAROUSEL_PROJECTS.length + 2} />
  </section>
);
```

- [ ] **Step 5: Update CarouselSlide.tsx**

Add `useFallback?: boolean` to `CarouselSlideProps`. Replace the `{hasImage && ...}` block:

```tsx
// Add to interface:
useFallback?: boolean;

// Inside component, add before return:
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
const showFallback = (useFallback ?? false) || prefersReducedMotion || isMobile;

// Replace existing image block (remove hasImage guard — all projects have vizParams):
<div className="carousel-slide-image" ref={imageRef}>
  {showFallback ? (
    <img
      src={`/viz/${project.id}.png`}
      alt={`${project.title} visualization`}
      loading={index === 0 ? 'eager' : 'lazy'}
    />
  ) : (
    // Desktop: VizCanvas renders at Carousel level; this div is a transparent placeholder
    <div aria-hidden="true" style={{ width: '100%', height: '100%' }} />
  )}
</div>
```

Remove the `carousel-slide--no-image` className from the slide's class string — all slides now have the image column.

- [ ] **Step 6: Run all gates**

```bash
cd rlupo-portfolio && npx vitest run && npx tsc --noEmit && npx playwright test
```

Expected: 4 new e2e pass + 5 existing e2e pass, ≥ 30 vitest pass.

- [ ] **Step 7: Commit**

```bash
git add rlupo-portfolio/components/Carousel.tsx rlupo-portfolio/components/CarouselSlide.tsx rlupo-portfolio/styles/index.css rlupo-portfolio/e2e/viz-canvas.spec.ts
git commit -m "$(cat <<'EOF'
feat(viz): Carousel integration — single VizCanvas, fallback selector, e2e
EOF
)"
```

---

### Task 7: scripts/capture-viz.mts + /viz-capture route + PNG captures

**Files:**
- Create: `scripts/capture-viz.mts`
- Create: `components/VizCaptureRoute.tsx`
- Modify: `App.tsx` (dev-only capture route gate)
- Modify: `package.json` (add `"build:viz"` script)
- Create (committed): `public/viz/nspb-api.png`, `public/viz/ferroml.png`, … (9 files)

**Interfaces:**
- Consumes: `VIZ_PARAMS` from `./lib/viz/params`; dev server at `http://localhost:3000`.
- Produces: 9 PNG captures at `public/viz/<id>.png`, 1200×800, deterministic per seed.

- [ ] **Step 1: Create components/VizCaptureRoute.tsx**

```tsx
// components/VizCaptureRoute.tsx
import React, { Suspense, lazy } from 'react';
import { VIZ_PARAMS } from '../lib/viz/params';

const VizCanvasLazy = lazy(
  () => import('./viz/VizCanvas').then(m => ({ default: m.VizCanvas })),
);

export function VizCaptureRoute({ id }: { id: string }) {
  const params = VIZ_PARAMS[id];
  if (!params) return <div style={{ color: '#E85D3A' }}>Unknown viz id: {id}</div>;
  return (
    <div
      data-testid="viz-capture"
      style={{ width: '1200px', height: '800px', position: 'relative', background: '#0a0a0a' }}
    >
      <Suspense fallback={null}>
        <VizCanvasLazy
          params={params}
          loaded={true}
          transitionVelocity={0}
          onFallback={() => {}}
        />
      </Suspense>
    </div>
  );
}
```

- [ ] **Step 2: Add dev-only capture route to App.tsx**

In `App.tsx`, add the import at top:

```tsx
import { VizCaptureRoute } from './components/VizCaptureRoute';
```

Inside the App component, before the main return statement:

```tsx
if (import.meta.env.DEV) {
  const captureId = new URLSearchParams(window.location.search).get('viz-capture');
  if (captureId) {
    return <VizCaptureRoute id={captureId} />;
  }
}
```

- [ ] **Step 3: Create scripts/capture-viz.mts**

```ts
// scripts/capture-viz.mts
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { join } from 'path';

const PROJECT_IDS = [
  'nspb-api', 'ferroml', 'revenue-forecast',
  'kkbox', 'obj-detect', 'ironclad',
  'ferroml-plugin', 'gsd-ml', 'mlforge',
];
const BASE_URL = 'http://localhost:3000';
const OUT_DIR = join(process.cwd(), 'public', 'viz');

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 800 });

  for (const id of PROJECT_IDS) {
    process.stdout.write(`Capturing ${id} ... `);
    await page.goto(`${BASE_URL}/?viz-capture=${id}`, { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="viz-canvas"] canvas', { timeout: 12000 });
    await page.waitForTimeout(900);  // settle 3-frame composer + animation
    const outPath = join(OUT_DIR, `${id}.png`);
    await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: 1200, height: 800 } });
    console.log(`saved → ${outPath}`);
  }

  await browser.close();
  console.log('All captures complete.');
}

main().catch(e => { console.error(e); process.exit(1); });
```

- [ ] **Step 4: Add build:viz to package.json scripts**

```json
"build:viz": "tsx scripts/capture-viz.mts"
```

- [ ] **Step 5: Generate captures** (requires dev server running)

```bash
# Terminal 1:
cd rlupo-portfolio && npm run dev

# Terminal 2:
cd rlupo-portfolio && npm run build:viz
```

Verify: `ls public/viz/*.png` shows 9 files, each ≥ 10 KB.

- [ ] **Step 6: Commit**

```bash
git add rlupo-portfolio/scripts/capture-viz.mts rlupo-portfolio/components/VizCaptureRoute.tsx rlupo-portfolio/public/viz/ rlupo-portfolio/package.json
git commit -m "$(cat <<'EOF'
feat(viz): capture script, /viz-capture route, 9 committed PNG fallbacks
EOF
)"
```

---

### Task 8: Type / spacing / motion sweep

**Files:**
- Modify: `styles/index.css` (type scale, 4px spacing snap, motion retune, clip-path entrance, hover sweeps)
- Modify: `components/CarouselSlide.tsx` (clip-path entrance uses `--ease-entrance` token; ensure no font-weight bold)
- Modify: relevant components for `font-weight` cleanup

**Interfaces:**
- Produces: CSS audit passing — `grep -rn 'font-weight' styles/ components/` returns only 400 or nothing.
- Consumes: Task 1 tokens (`--sp-*`, `--ease-micro`, `--ease-entrance`, `--duration-sm`, `--duration-md`, `--duration-bg-sweep`).

This is CSS + className edits only. Browser-verify at 1440 and 375 after each sub-step.

- [ ] **Step 1: Update :root type scale**

Change in `:root`:
```css
  --text-display: clamp(3rem, 5vw, 3.5rem);   /* was clamp(2rem, 5vw, 3rem) */
  --text-h1: 2.7rem;                           /* was 2.25rem */
```

After existing type-scale vars, add:
```css
  --leading-display: 0.95;
  --leading-body: 1.5;
  --letter-spacing-sm: 0.36px;
  --letter-spacing-label: 0.52px;
```

Update `body` rule:
```css
body {
  font-size: 0.8125rem;         /* ~13px; snaps to 24px rhythm at 1.5 line-height */
  line-height: var(--leading-body);
  /* other rules unchanged */
}
```

Add display line-height to the hero title selector (check for `.hero-title` or `.hero-tagline`):
```css
.hero-title, [class*="display"] {
  line-height: var(--leading-display);
  letter-spacing: 0;  /* never on display per spec */
}
```

- [ ] **Step 2: No-bold audit and cleanup**

```bash
grep -rn 'font-weight' rlupo-portfolio/styles/ rlupo-portfolio/components/
```

For every match that is NOT `font-weight: 400` and NOT the new `@font-face` declarations: remove the `font-weight` declaration. If a rule existed only to set bold for emphasis, achieve the same via size or color change instead.

- [ ] **Step 3: Snap new/modified spacing to 4px scale**

In `styles/index.css`, for the following rule groups, replace spacing values with `--sp-*` tokens:
- `.carousel-slide-footer`: `gap: var(--sp-4)` (16px)
- `.carousel-nav`: `gap: var(--sp-2)` (8px)
- `.carousel-slide-terminal`: `padding: var(--sp-9) var(--sp-8)` (36px / 32px)
- `.info-content`: `gap: var(--sp-10)` (40px)
- `.terminal-panel` internal gaps: `gap: var(--sp-2)` (8px)

Do not change selectors; only the spacing value tokens change.

- [ ] **Step 4: Retune transitions to sanctioned easings**

In `styles/index.css`, find and replace:
- `ease-out` (plain keyword) → `var(--ease-micro)`
- `cubic-bezier(0.23, 1, 0.32, 1)` (existing `--ease-out`) → `var(--ease-micro)` where used inline
- `150ms` inline → `var(--duration-sm)` (225ms)
- `200ms` inline → `var(--duration-md)` (300ms)
- Entrance transitions (clip-path, opacity reveals) → `var(--ease-entrance)`

Background sweep transitions (hover backgrounds expanding from left) use `var(--duration-bg-sweep) var(--ease-micro)`.

- [ ] **Step 5: Add clip-path+opacity entrance to slide text**

In `CarouselSlide.tsx`, locate the existing GSAP `imageRef` entrance animation (in the `useEffect([isActive])` block). Add a companion text reveal on the `terminalRef`:

```tsx
// In the useEffect([isActive]) that handles imageRef entrance, after the imageRef animation,
// add (respecting the existing prefersReducedMotion check):
if (isActive && terminalRef.current && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const lines = terminalRef.current.querySelectorAll('.terminal-line');
  gsap.fromTo(
    lines,
    { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
    {
      clipPath: 'inset(0 0% 0 0)',
      opacity: 1,
      duration: 0.3,         // --duration-md = 300ms
      ease: 'cubic-bezier(0, 0, 0.2, 1)',  // --ease-entrance
      stagger: 0.04,
      delay: 0.12,
    },
  );
}
```

- [ ] **Step 6: Add scaleX hover sweeps to nav links and buttons**

Add to `styles/index.css` ABOVE the `@media (max-width: 768px)` block:

```css
/* --- Hover sweep (scaleX, origin-left) --- */
.header-nav a,
.carousel-btn,
.terminal-visit {
  position: relative;
  overflow: hidden;
}
.header-nav a::after,
.carousel-btn::after,
.terminal-visit::after {
  content: '';
  position: absolute;
  inset: 0;
  background-color: var(--accent);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform var(--duration-bg-sweep) var(--ease-micro);
  z-index: -1;
}
.header-nav a:hover::after,
.carousel-btn:hover:not(:disabled)::after,
.terminal-visit:hover::after {
  transform: scaleX(1);
}
```

Note: verify that existing `:hover` rules for these elements still work with the new background. Text color on hover may need to stay `--text-primary` explicitly if the accent background conflicts.

- [ ] **Step 7: Browser-verify at 1440 and 375**

At 1440:
- Body renders in Space Grotesk (DevTools Computed → font-family on `<body>`)
- Display heading line-height ≤ 1.0
- Hover on PREV/NEXT buttons: scaleX sweep left-to-right
- Nav link hover: same sweep
- Press NEXT to project slide: terminal lines reveal with clip-path wipe + opacity

At 375 (device toolbar):
- Layout intact, no horizontal scroll
- Departure Mono labels unaffected
- No canvas visible; fallback PNG in image region

- [ ] **Step 8: Full gates**

```bash
cd rlupo-portfolio && npx vitest run && npx tsc --noEmit && npx playwright test
```

- [ ] **Step 9: Commit**

```bash
git add rlupo-portfolio/styles/index.css rlupo-portfolio/components/CarouselSlide.tsx
git commit -m "$(cat <<'EOF'
style: type scale, 4px spacing, motion sweep, clip-path entrance, hover sweeps
EOF
)"
```

---

### Task 9: Copy pass + corpus regen

**Files:**
- Modify: `constants.ts` (rewrite `description` for all 9 projects)
- Regenerate: `generated/corpus.ts`

**Interfaces:**
- Produces: updated `FEATURED_PROJECTS` and `ALL_PROJECTS` `description` fields; regenerated corpus.
- Rules: ≤ 2 sentences, outcome-led (metric first where one exists), terminal voice, weight-400 humility, no superlatives the corpus can't back, every claim traces to existing `metric`/`metricLabel`/`stack` fields.

**New descriptions — implement exactly as written:**

```ts
// nspb-api
description: "60-endpoint Python SDK for Oracle EPM Cloud — covers Planning, Migration, and Data Management APIs that Oracle ships with no client library. Private build; case study on request.",

// ferroml
description: "55-algorithm AutoML framework in Rust with Python bindings that replaces benchmark theater with proper statistical hypothesis testing. Ships on PyPI; 6,500+ tests.",

// revenue-forecast
description: "Hierarchical revenue forecasting across multiple business lines with temporal reconciliation, cross-validation, and SHAP attribution. Deployed in production at Franklin Street.",

// kkbox
description: "0.97 AUC subscription churn model — leak-safe temporal feature engineering, isotonic probability calibration, and PSI drift monitoring on the KKBOX Kaggle benchmark.",

// obj-detect
description: "Open-vocabulary detection and segmentation via text prompts — Grounding DINO + SAM 2 at 265–490 ms per image on RTX 3070, no fine-tuning required.",

// ironclad
description: "Construction cost estimation with 95% confidence intervals per line item, built for bid analysis at Origin Construction. Replaces point estimates with statistical ranges.",

// ferroml-plugin
description: "End-to-end machine learning from natural conversation inside Claude Code — invoke FerroML's full pipeline through a first-party plugin without leaving the editor.",

// gsd-ml
description: "Point Claude Code at a dataset and metric; get a validated, tuned ML pipeline — autonomous research that handles feature engineering, model selection, and evaluation.",

// mlforge
description: "CSV in, best-pipeline out — autonomous ML research framework for tabular data that searches preprocessing, feature engineering, and model selection without human steering.",
```

- [ ] **Step 1: Apply rewrites to constants.ts**

Replace each `description:` field with the text above. No other fields change.

- [ ] **Step 2: Regen corpus + full test run**

```bash
cd rlupo-portfolio && npm run build:corpus && npx vitest run
```

If corpus snapshot expectations reference old description text, update those expectations. All other tests stay green.

- [ ] **Step 3: Commit**

```bash
git add rlupo-portfolio/constants.ts rlupo-portfolio/generated/corpus.ts
git commit -m "$(cat <<'EOF'
content: outcome-led description rewrite, corpus regen
EOF
)"
```

---

### Task 10: Final integration verification

**Files:**
- Modify: `.superpowers/sdd/progress.md` (mark design-upgrade complete)

- [ ] **Step 1: Full test suite**

```bash
cd rlupo-portfolio && npx vitest run && npx tsc --noEmit && npm run build && npx playwright test
```

Expected: 0 failures across all four commands. Stop and debug if any fail.

- [ ] **Step 2: Bundle size check**

```bash
cd rlupo-portfolio && npm run build 2>&1 | grep -E '\.(js|css).*kB|gzip'
```

Verify:
- The `index.js` entry chunk growth vs. pre-design-upgrade baseline is < 5 KB gzip.
- `three`, `@react-three/fiber`, `postprocessing` appear as a SEPARATE lazy chunk (confirm their names appear as distinct output files, not folded into the main entry).
- If the three chunk is in the initial bundle: the `VizCanvas` import in Carousel is not lazy. Fix: wrap the import as `const VizCanvas = React.lazy(() => import('./viz/VizCanvas').then(m => ({ default: m.VizCanvas })))` and gate with `<Suspense>`.

- [ ] **Step 3: Browser protocol — 1440px**

```bash
npm run dev
# Open http://localhost:3000 in Chrome
```

Checklist:
- [ ] Preloader completes; `.site-content--visible` appears (≤ 4 s)
- [ ] 0 console errors on load
- [ ] Press NEXT: VizCanvas canvas visible in right column; ASCII effect rendering
- [ ] Press NEXT again: scene changes to a different archetype/tint
- [ ] Move pointer over canvas: glow follows mouse
- [ ] During slide transition: wave amplitude briefly spikes in the ASCII render
- [ ] Hover on PREV/NEXT buttons: scaleX sweep left-to-right, correct text color
- [ ] Body text: DevTools Computed → font-family on `<body>` shows "Space Grotesk"
- [ ] `grep -rn "font-weight" rlupo-portfolio/styles rlupo-portfolio/components` returns 0 matches for bold/600/700
- [ ] Ask panel: opens; prompt works; closes cleanly; unaffected by viz system

- [ ] **Step 4: Browser protocol — 375px**

Switch to 375×812 in DevTools device toolbar:
- [ ] No `<canvas>` visible
- [ ] `.carousel-slide-image img` visible with `/viz/<id>.png` src (no 404)
- [ ] Mobile layout intact; hamburger menu visible; no horizontal scroll
- [ ] PREV/NEXT navigation works

- [ ] **Step 5: Browser protocol — reduced-motion**

DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion: reduce":
- [ ] No `<canvas>` visible
- [ ] Fallback PNG shown
- [ ] Slide transitions instant/no animation (existing guard honored)

- [ ] **Step 6: FPS sanity**

DevTools → Performance → Live FPS gauge with canvas active at 1440:
- [ ] FPS ≥ 30 sustained
- [ ] If FPS < 30 for > 3 s: increase `cellSize` from 9 → 12 in `ComposerMount` and re-capture PNGs (`npm run build:viz`)

- [ ] **Step 7: Update progress.md + final commit**

```bash
# Update .superpowers/sdd/progress.md to reflect design-upgrade tasks complete
git add .superpowers/sdd/progress.md
git commit -m "$(cat <<'EOF'
chore: design-upgrade complete — all gates green, browser protocol passed
EOF
)"
```

---

## Success Criteria Checklist

- [ ] All gates green: `npx vitest run`, `npx tsc --noEmit`, `npm run build`, `npx playwright test`
- [ ] Every project card shows a distinct generative ASCII visual; 0 AI-art images remain
- [ ] Desktop: pointer-reactive ASCII scenes with transition-linked wave/glitch distortion
- [ ] Mobile (375px): static PNG captures, no canvas, no GPU cost
- [ ] `prefers-reduced-motion`: static PNG captures, light/no transitions
- [ ] 0 `font-weight` values other than 400 in rendered output
- [ ] All new/modified spacing rules use `--sp-*` tokens (4px multiples)
- [ ] All transitions use `--ease-micro` or `--ease-entrance`
- [ ] Every project description outcome-led, ≤ 2 sentences, factually grounded
- [ ] Initial JS bundle growth < 5 KB gzip; three/fiber chunk is lazy
- [ ] 0 console errors in browser protocol at all three viewports + reduced-motion
