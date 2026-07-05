---
date: 2026-05-11T00:30:00-04:00
git_commit: a0b4171 (uncommitted changes on top)
branch: redesign/invisible-frame
status: in-progress
---

# Handoff: Craft V1 Complete — Interactions & Polish Next

## Summary

First craft pass is done. The portfolio has been transformed from "main with a different skin" into a layout/composition system informed by the simonholm.studio and zajno.com extractions. All sections are rendering, responsive works, three selective surprises are functional. The site is structurally complete but needs interaction polish and CSS cleanup.

## What Was Built This Session

### New/Rewritten Components
- **Hero.tsx** — Display-scale name (8rem max), narrative hook, mono status line, two CTAs, GSAP divider reveal (Surprise C)
- **FeaturedProjects.tsx** — 3 entries with varied layouts (image-right/image-full/image-left), giant "01/02/03" numbers at 4.5rem, metric count-up on scroll (Surprise B), CSS entrance animations via IntersectionObserver
- **AllWork.tsx** — 6 secondary projects in list format, filter pills, staggered entrance animation
- **App.tsx** — Rewired to use FeaturedProjects + AllWork instead of ProjectsSection

### Updated Components
- **About.tsx** — No code changes, but CSS updated: grid→flex, lowercase labels, tighter spacing
- **Footer.tsx** — No code changes, CSS updated: tight margins, smaller text sizes
- **Header.tsx** — CSS-only updates: tight margins, smaller font sizes

### CSS Token Overhaul (`styles/index.css`)
- **Typography**: Dropped weight 900 entirely. Display at `clamp(3.2rem, 8vw, 8rem)`, weight 500. Line-heights tightened: 0.85 display, 0.9 headline, 1.5 body.
- **Easing**: From extraction data: `--ease-out: cubic-bezier(0.215, 0.61, 0.355, 1)`, `--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)`
- **Timing**: Atmospheric: `--transition-atmospheric: 1800ms`, `--transition-base: 800ms`, `--transition-micro: 200ms`
- **Spacing**: `--space-section: 160px`, `--space-section-mid: 100px`, `--page-margin: max(0.7rem, calc((100vw - 1280px) / 2))`
- **New styles**: ~400 lines of new CSS for featured projects, all work, hero, section labels
- **Old styles**: ~800 lines of unused scattered/valiente/card CSS still present (needs cleanup)

### Other Updates
- **index.html** — Fontshare URL updated: `satoshi@400,500` (dropped 900)
- **DESIGN.md** — Typography section updated to match new specs (500 weight, tighter line-heights, lowercase labels)

## Current Page Structure

| Section | Height | Status |
|---|---|---|
| Hero | 720px | Complete |
| Featured Projects | 2494px | Complete (3 entries) |
| All Work | 832px | Complete (6 entries) |
| About | 1228px | Functional, needs polish |
| Footer | 542px | Complete |
| **Total** | **5818px** | ~8 viewports of scroll |

## Screenshots Taken

All in `/tmp/` (ephemeral, won't persist):
- `ss4-hero.png`, `ss4-projects.png`, `ss4-work.png`, `ss4-about.png`, `ss4-contact.png` — Desktop 1280×720
- `ss5-mobile-hero.png`, `ss5-mobile-projects.png`, `ss5-mobile-work.png`, `ss5-mobile-about.png` — Mobile 375×812

## New Full Extractions (This Session)

Re-ran designlang with `--full` flag to capture interactions, responsive behavior, screenshots, and performance data. Previous extractions only had default (CSS-only) data.

### Files created:
- `design-extract-output/simonholm-studio-full-*` — 25+ files including screenshots, responsive, interactions
- `design-extract-output/zajno-com-full-*` — 25+ files including screenshots, responsive, interactions
- `design-extract-output/motion-replay.webm` — Motion replay (last run was simonholm; zajno was overwritten — re-run both in next session)

### Key finding:
- simonholm: "1 state change captured" by --full
- zajno: "0 state changes captured" even with --full — their mouse/cursor effects are JavaScript/WebGL-driven, invisible to CSS extraction
- **Next session MUST use Playwright to visit zajno.com directly** and observe the cursor/mouse effects in the browser

## Interaction Research (COMPLETED — Results Below)

### Investigation Method
- Launched Playwright agents to visit zajno.com and simonholm.studio directly
- Inspected DOM for cursor elements, canvas/WebGL, hover states, JS libraries
- Extracted actual GLSL shader code, CSS computed styles, JS event handlers
- Parallel web research on premium portfolio animation patterns (2025-2026)
- Full reports at `/tmp/interaction-research-report.md`

### simonholm.studio — DOM Cursor (Adopt This)

**Implementation:** White dot div, `mix-blend-mode: difference`, tracked via `gsap.to(cursor, { x, y, duration: 0.05 })`.

```html
<div class="custom-cursor">
  <div class="cursor-dot"></div>      <!-- 12px white circle -->
  <div class="cursor-dot-case"></div> <!-- hidden, shown in project mode -->
  <div class="close-text">[Close]</div>
</div>
```

**CSS:** `position: fixed; pointer-events: none; z-index: 999; mix-blend-mode: difference`

**Three hover zones:**
1. `cursor-hover-state` (nav/links) — dot scales 1.1 and goes transparent (`rgba(255,255,255,0)`)
2. `cursor-special-frontpage` (hero) — same transparent effect
3. `cursor-case-active` (project expanded) — cursor shows "[Close]" text

**Click:** Pulse scale to 1.5 → back to 1

**Stack:** GSAP 3.10.4 + Lenis (lerp: 0.08) + Barba.js + ScrollTrigger + jQuery + Webflow

### zajno.com — WebGL Shader (Do NOT Replicate)

**No DOM cursor at all.** Their entire interaction system runs through a single `<canvas id="_r">` with a custom WebGL pipeline.

**What the shader does:** Mouse VELOCITY (not position) feeds as `uniform vec2 q` into a GLSL fragment shader that applies:
- Chromatic aberration (RGB channel splitting at different UV offsets)
- Displacement map distortion
- A `PKinetic` particle mesh (42×N grid) that repels from cursor position, damped at 0.94× per frame

**The key insight:** The distortion responds to mouse SPEED, not position. Fast mouse = strong distortion, settling back as you stop.

**Stack:** Entirely proprietary. No GSAP, Three.js, OGL, or PixiJS. Custom `R` global with Lerp/Damp/RafR primitives.

**Verdict:** This requires a full custom WebGL pipeline. Not worth replicating for a portfolio. The aesthetic is achievable with simpler means.

**One pattern worth stealing from zajno (CSS-only):** Project hover reveals a floating preview image via `clip-path: inset(15% 3%) → inset(0)` with `transition: clip-path 800ms var(--o6)`. This is achievable in pure CSS + a JS class toggle.

### Web Research — Premium Interaction Patterns (2025-2026)

**Tier 1: High impact, directly fits our stack**

1. **Sibling dimming on project hover** (~30 min)
   CSS `:has()` selector: `.featured:has(.fp-entry:hover) .fp-entry:not(:hover) { opacity: 0.35; filter: blur(1px); }`

2. **Mix-blend-difference cursor with lerp smoothing** (~1 hr)
   White dot, `mix-blend-mode: difference`, `gsap.quickTo` at factor 0.075 for physical drag. Expands on hover. We already have a cursor component — this is an upgrade.

3. **Blurry text reveal on scroll** (~45 min)
   Section headings animate `filter: blur(16px→0)` line by line on scroll. Codrops traces this to rauno.me. Works with our Lenis + ScrollTrigger.

**Tier 2: Worth the investment**

4. **Magnetic CTA button** (~30 min)
   "Get in touch" button attracts toward cursor within 80-100px radius. Max 15-25px displacement. `gsap.quickTo` with elastic easing. ONE button only.

5. **Card-level mouse tilt** (~1 hr)
   Project cards rotate ±8° on rotateX/rotateY based on mouse offset from card center. Radial gradient follows cursor as specular highlight.

6. **Anti-reflow text scramble upgrade** (~30 min)
   Pre-scramble characters to final width before tween starts. Locks parent height. Eliminates layout jump.

**Explicitly avoid:**
- Cursor trails (outdated)
- Chromatic aberration as generic hover (cliché now)
- Page wipe transitions (too theatrical)
- WebGL per-card (mount one canvas, swap textures if doing distortion)
- Particle systems (2020)

**Reference sites (all verified current):**
- rauno.me — blur reveal, minimap nav
- cydstumpel.nl — CSS View Transitions API
- lusion.co — WebGL cursor-reactive
- elliott.mangham.dev — functional interactivity over flash

## Action Items for Next Session

### Priority 1: Implement interactions
Build these in order. Each is independent and can be verified with a screenshot.

**A. Mix-blend cursor** (~80 lines JS + 20 CSS)
- White 12px dot div, `position: fixed`, `pointer-events: none`, `mix-blend-mode: difference`
- Track mouse via `gsap.quickTo` or `gsap.to(cursor, { duration: 0.05 })`
- Hover over links/buttons: dot scales to 1.8× and goes transparent (hollow ring effect)
- Hover over project cards: dot scales to 2× with subtle border
- Click: pulse scale to 1.5 → back to 1
- Hide on mobile (touch devices)
- Respect `prefers-reduced-motion`

**B. Sibling dimming on featured project hover** (~10 lines CSS)
```css
.featured:has(.fp-entry:hover) .fp-entry:not(:hover) {
  opacity: 0.35;
  filter: blur(1px);
  transition: opacity 150ms ease, filter 150ms ease;
}
```

**C. Blurry text reveal on scroll** (~30 lines JS)
Apply to section headings ("ABOUT" statement, hero hook): `filter: blur(12px) → blur(0)` on ScrollTrigger with per-line stagger. Use short strings only (headings/labels), not paragraphs.

**D. Magnetic "Get in touch" CTA** (~40 lines JS)
`gsap.quickTo` with 0.3 factor, max 20px displacement, elastic easing on leave. Apply to the primary CTA button ONLY.

### Priority 4: CSS cleanup
Remove ~800 lines of dead CSS:
- Old `.projects-scattered` and `.project-card` styles (ProjectsSection no longer used)
- Old `.header-valiente` duplicate styles (already overridden)
- Old `.projects` horizontal scroll styles
- Old `.about-grid`, `.about-visual` styles
- Old `.footer` (non-giant) styles
- Old `.section-pagination`, `.scroll-progress`, `.theme-toggle` styles
- Old `.custom-cursor` styles (unless we're adding a new cursor)
- Old `@keyframes scrollPulse`

### Priority 5: Delete dead component files
- `FluidGlass.tsx` + `shaders/` directory
- `ThemeToggle.tsx`
- `CustomCursor.tsx`
- `ScrollProgress.tsx`
- `SectionPagination.tsx`
- `ProjectsSection.tsx` (replaced by FeaturedProjects + AllWork)
- `ProjectCard.tsx` (no longer imported)
- `ProjectFilter.tsx` (no longer imported)

### Priority 6: Final craft critique loop
Run `/impeccable craft` Step 6 (browser-based iteration):
- Screenshot all sections at desktop + mobile
- Critique against the design brief
- Fix any visual defects
- Check hover states, focus states, reduced motion

### Priority 7: Commit
All changes are uncommitted. Commit when satisfied.

## Is One Session Enough?

Yes. The research is done (no more investigation needed). The remaining work is all implementation:

1. **Implement 4 interactions** (cursor, dimming, blur reveal, magnetic CTA) — ~2.5 hrs
2. **CSS cleanup** (delete ~800 lines of dead code) — 10 min
3. **Dead component deletion** (8 files) — 5 min
4. **Critique loop** (screenshot → fix → screenshot) — 30 min
5. **Commit** — 2 min

Fork candidates for parallelization:
- CSS cleanup + dead file deletion (fork to subagent, independent of interaction work)
- Interactions A+B can be done before C+D (no dependencies)
- The critique loop screenshot script is already written in `/tmp/screenshot*.mjs`

## Build & Dev Server

- `npm run build` passes cleanly
- Dev server on port 3000
- Pre-existing `@types/react` TS diagnostics (React 19 issue, don't fix)
- Pre-existing FluidGlass.tsx OGL type errors (not imported, will be deleted)

## Critical References

- **DESIGN.md** — Updated this session. Typography section now matches code (500 weight, 0.85 line-height, lowercase labels).
- **PRODUCT.md** — Unchanged. Still the source of truth for brand, users, anti-references.
- **Confirmed shape brief** — In conversation history of this session. All design decisions trace back to it.
- **Previous handoff** — `2026-05-10_19-45-00_evolved-main-invisible-frame.md` — Contains image generation prompts, project content plan.
