# Design Upgrade — Shader-First (francescomichelini techniques on Trey's dark identity)

**Date:** 2026-07-03
**Status:** Approved (Trey delegated design authority 2026-07-03: "letting you drive one hundred percent")
**Branch:** continues on `feat/ask-my-work` (or a child branch `feat/design-upgrade` off it)
**Reference assets:** `design-extract-output/francescomichelini-com-*`, `references/webgl-ascii-hero/`

## Goal

Push treylupo.com to the visual quality of francescomichelini.com — images, text, and
animation — while keeping Trey's near-black terminal identity. Kill the AI-art credibility
problem: every project card gets a **generative, code-native visual** rendered by one WebGL
system instead of stock AI images.

## Non-goals

- No palette change: the site stays near-black with its existing red/amber accent family.
- No page restructure: carousel + overlays + Ask panel keep their information architecture.
- No new content sections; the copy pass rewrites existing text only.
- No push, merge, or deploy — Trey's explicit gate.

## Locked decisions

1. **His techniques, Trey's identity** — port type scale, motion vocabulary, and WebGL image
   treatment; keep the dark theme (the reference site itself theme-shifts, and Trey's dark
   matches one variant).
2. **Generative per-project visuals** — procedural scenes seeded per project replace the
   AI-art images (6 of 9 cards were AI-art before Task 10 dropped the worst).
3. **Approach A, shader-first** — the generative visuals and the WebGL treatment are one
   system: a single React Three Fiber canvas with an ASCII post-process shader.
4. **Motion budget: full desktop, calm mobile** — WebGL, pointer glow, and transition-linked
   distortion on ≥768px; static build-time captures of the same scenes below 768px and for
   `prefers-reduced-motion`.
5. **Copy scope: full-but-light pass** — outcome-led rewrites of all project card
   descriptions and an Info-overlay tightening, in the existing terminal voice. No new facts;
   every claim must trace to the verified resume/corpus.

## System 1 — Type and spacing

- **Faces:** display and body move to **self-hosted Space Grotesk 400 only** (OFL licence,
  woff2 committed to `public/fonts/`); labels, metadata, and
  terminal UI keep the existing Departure Mono. No bold anywhere — hierarchy comes from size
  and spacing, exactly as the reference does.
- **Scale (from the extract):** display ~3.5rem with line-height 1.0 or below (compressed,
  intentional); H1-equivalent ~2.7rem with sub-leading; body 0.75–0.85rem snapping to a 24px
  rhythm (2× the 12px base); letter-spacing only on mid/small sizes (0.36–0.52px), never on
  display.
- **Spacing:** 4px base unit; all gaps snap to 4, 8, 12, 16, 20, 32, 36, 40. Declare as CSS
  custom properties in `:root` and sweep existing rules onto them.
- **Flatness:** no shadows, radius ≤4px (buttons only). Separation via spacing and size.

## System 2 — Motion vocabulary

- **Tokens:** `--duration-sm: 225ms`, `--duration-md: 300ms`, one 400ms outlier for
  background sweeps; easings `cubic-bezier(0.4,0,0.2,1)` (micro-interactions) and
  `cubic-bezier(0,0,0.2,1)` (entrances). No springs, no bounce.
- **Entrances:** `clip-path` wipes, softened for a dark background — pair each wipe with a
  simultaneous slight opacity ramp so the reveal doesn't cut harshly out of black.
- **Hover:** `scaleX(0→1)` background sweeps (origin-left, 300–400ms) on nav links and
  buttons.
- **Slide transitions replace scroll:** the carousel is arrow-driven, so "scroll-linked"
  motion maps to **transition progress**. The existing 600ms slide tween writes a
  `transitionVelocity` value each frame; the shader and text staggers read it.
- Existing components (SplitReveal, TextScramble, SlideProgress, Cursor) are retuned to
  these tokens, not replaced.

## System 3 — Generative visual system (the centerpiece)

- **Stack:** `three` + `@react-three/fiber` + `postprocessing`. No drei, no GLTF — scenes
  are procedural primitives only. The whole module lazy-loads (dynamic import) after the
  preloader finishes so LCP and initial bundle are untouched.
- **One canvas:** a single `VizCanvas` mounted behind the carousel's image region. The
  active slide selects the scene; slide transitions crossfade scenes and spike a distortion
  uniform. One WebGL context, one RAF loop shared with GSAP (`fiber`'s `addEffect`, never a
  second `requestAnimationFrame`).
- **ASCII post-process:** port `references/webgl-ascii-hero`'s `AsciiEffectImpl`
  (luminance → glyph-atlas cell shader) with its uniforms: `time`, `mousePos` (radial glow),
  `cellSize`, `contrastAdjust`, plus new `transitionVelocity` (drives wave/glitch amplitude
  during slide changes). CRT/scanline/vignette post-FX stay subtle — flavor, not costume.
- **Scene archetypes (4, parameterized):**
  1. `lattice` — instanced crystalline grid (SDKs, frameworks: EPM SDK, FerroML, nspb-api)
  2. `wavefield` — displaced plane heightfield (forecasting, time series, churn)
  3. `particleflow` — streaming particle field (ML pipelines, agent/automation projects)
  4. `wireframe` — rotating structural primitive (vision/segmentation, construction)
- **Params per project** (`vizParams` on each entry in `constants.ts`): archetype, seed,
  density, speed, tint. Tints come from the site's existing accent family (red primary;
  amber and desaturated cyan variants) — never the reference's purple. Every project gets a
  visibly distinct scene from params alone.
- **Fallbacks:** WebGL context-loss → swap to the static capture (same image mobile uses).
  A frame-rate guard drops post-FX first, then falls back to static, if FPS sits below ~30.

## System 4 — Mobile and reduced-motion

- `scripts/capture-viz.mts`: Playwright drives a dev-only `/viz-capture` route and writes
  one PNG per project to `public/viz/`. Build-time, committed, deterministic per seed.
- Below 768px and under `prefers-reduced-motion`, `CarouselSlide` renders the PNG in place
  of the canvas — identical identity, zero GPU cost. Light CSS transitions only on mobile.

## System 5 — Copy pass

- Rewrite all project `description` fields outcome-led ("what it does for whom", metric
  first where one exists) in ≤2 sentences, terminal voice, weight-400 humility — no
  superlatives the corpus can't back.
- Tighten Info overlay/About copy the same way. Hero copy stays (it already carries the
  resume-v2 voice).
- Corpus/evals: descriptions feed the Ask corpus, so regenerate `generated/corpus.ts` and
  re-run the eval harness expectations after the rewrite.

## Architecture (new files)

```
components/viz/VizCanvas.tsx      # R3F canvas, scene switching, uniform bridge
components/viz/AsciiEffect.ts     # ported post-process effect (from reference)
components/viz/scenes.ts          # 4 archetype builders (pure, seeded, testable)
lib/viz/params.ts                 # VizParams type + per-project param table + seed PRNG
scripts/capture-viz.mts           # static capture generation
public/viz/*.png                  # committed captures
```

`constants.ts` gains `vizParams` per project and loses `imageUrl` (superseded).
`Carousel.tsx` mounts **one** VizCanvas (single WebGL context) positioned in the slide image
region and publishes transition progress to it; `CarouselSlide.tsx` renders only the capture
`<img>` when the fallback selector says so (mobile/reduced-motion/context-loss). `styles/index.css` gains the token
blocks and retuned component rules.

## Testing and verification

- **Unit:** params table completeness (every project has valid `vizParams`), seed PRNG
  determinism, archetype builder output shape, fallback selector logic (viewport/motion/
  context-loss → canvas vs img). Corpus tests keep passing after the copy pass.
- **e2e additions:** canvas mounts on desktop and swaps scenes on arrow navigation; mobile
  viewport shows `<img>` and no canvas; reduced-motion shows `<img>`; existing 5 e2e stay
  green.
- **Browser verification (protocol from the award-tier ledger):** Playwright at
  1440/1024/375 + reduced-motion; 0 console errors; hero reveal still visible post-preloader;
  FPS sanity on the canvas; Ask panel unaffected.
- **Perf budget:** initial JS bundle (pre-lazy chunk) grows <5KB gzip; three/fiber chunk
  lazy-loads post-preloader; Lighthouse perf on `/` stays within 5 points of current.

## Success criteria

1. All gates green (vitest, tsc, build, e2e) and the browser protocol passes.
2. Every project card shows a distinct generative visual; zero AI-art images remain.
3. Desktop shows pointer-reactive ASCII scenes with transition-linked distortion; mobile
   and reduced-motion show the same scenes as crisp static captures.
4. Type/spacing/motion audit: no bold weights, spacing snapped to the 4px scale, all
   transitions on the two sanctioned easings/durations.
5. Copy: every description outcome-led, ≤2 sentences, factual per the verified corpus.

## Risks

- **GPU/RAF contention with GSAP** → single shared RAF via `addEffect`; measured FPS guard.
- **Bundle bloat** → dynamic import; budget enforced in the final review.
- **Shader port friction (Next→Vite)** → the reference's composer-mount workaround is
  documented; port the effect class before building scenes so risk surfaces in task 1.
- **Capture drift** — captures regenerate only when params change; the capture script is
  deterministic (fixed seed, fixed viewport) so diffs stay reviewable.
