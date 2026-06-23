---
date: 2026-06-22T20:29:33-04:00
git_commit: c9558b1
branch: redesign/invisible-frame
status: complete
---

# Handoff: Hero Slide Complete — Mobile Performance Next

## Task(s)

**Completed this session:**

1. **Hero slide (carousel index 0)** — Full-width slide with canvas-based ASCII character grid background (mouse-reactive, graduated density/color), PowerGlitch on "TREY LUPO" name (5s cycle, 750ms burst), staggered entrance animation (GSAP expo.out, 80ms stagger), `[ PROJECTS → ]` button on right side linking to first project slide.

2. **Carousel looping** — `next()` and `prev()` wrap around in both directions. GSAP uses instant jump (`duration: 0`) for wrap transitions to avoid panning across all slides. Easing standardized to `expo.out` at 0.5s duration.

3. **Deploy blockers fixed** — Theme color (#474741), JSON-LD structured data URLs aligned with constants.ts, dead Google Font loads removed (JetBrains Mono, Space Grotesk), apple-touch-icon.png generated from favicon.svg, sitemap.xml added.

4. **Resume PDF link** — `[ Resume ]` bordered pill button in InfoOverlay contact section alongside GitHub/LinkedIn/HuggingFace. Points to `/resume.pdf` (placeholder — user adds file to `public/` when ready).

5. **Vercel Analytics** — `@vercel/analytics` installed, `<Analytics />` rendered in index.tsx.

6. **Bug fixes from adversarial review:**
   - AsciiGrid RAF leak on unmount (running ref flag pattern)
   - `goTo()` stale closure in useCarousel (removed activeIndex from deps)
   - `setTimeout` leak in useCarousel (timer ref, cleared on each call)
   - Reduced motion guards on GSAP, AsciiGrid, and PowerGlitch
   - Image clip-path wipe direction (left-to-right → right-to-left)
   - ProjectsOverlay Space key accessibility (ARIA button compliance)
   - ASCII grid tuning (lerp 0.18, ambient wave 0.08, smoother accent threshold)

**Planned — mobile performance & polish (this handoff):**

Priority items flagged by three parallel review agents (adversarial code, design quality, animation/motion):

### Mobile Performance
- ASCII grid canvas RAF runs at 60fps on all devices including low-end mobile. Need to either reduce cell density on mobile (larger CELL size) or skip the canvas entirely below a viewport/device threshold.
- No tablet breakpoint (1024px) — the `7rem` left padding + two-column `1fr 1fr` grid gets cramped on iPad landscape.
- Mobile carousel footer uses `flex-wrap: wrap` which can break nav to two rows unpredictably.

### Design/Animation Polish (lower priority)
- `7rem` left offset hardcoded in 3 places (hero-content, carousel-slide-footer, terminal-panel) — should be a `--page-indent` CSS token.
- Overlay backgrounds use hardcoded `rgba(71, 71, 65, 0.98)` instead of `var(--bg-primary)`.
- Overlay exit animation missing — overlays animate in (opacity + scale) but vanish instantly on unmount.
- Terminal line exit animation missing — text disappears instantly on slide change.
- `--accent-dim` and `--text-secondary` are identical values (`#A6A77E`) under different token names.

### Award-Tier Gaps (future sessions)
- No scroll-driven animations (carousel bypasses scroll axis)
- Custom cursor doesn't show contextual labels (project name, "VIEW") on hover
- Hero name has no load-triggered animation — glitch fires on timer, not entrance
- No visual bridge between hero → first project slide
- Overlay enter should use `translateY(8px)` instead of `scale(0.98)` (flagged as AI-template pattern)
- Image reveal delay (100ms after terminal lines start) for coordinated choreography

## Critical References

- `docs/superpowers/specs/2026-06-22-hero-and-polish-design.md` — design spec for everything built this session
- `docs/superpowers/plans/2026-06-22-hero-and-polish.md` — implementation plan (10 tasks, all complete)
- `styles/index.css` — all layout/responsive styles, ~1050 lines. Mobile breakpoint at `@media (max-width: 768px)` around line 919+. No 1024px breakpoint exists.

## Recent Changes

15 commits from `db3dce1` to `c9558b1`:

- `components/AsciiGrid.tsx` — NEW: canvas ASCII grid, RAF with running ref guard, reduced motion guard, lerp 0.18, ambient wave 0.08
- `components/HeroSlide.tsx` — NEW: hero content, GlitchName (React.memo + PowerGlitch), GSAP staggered entrance, `[ PROJECTS → ]` button
- `components/Carousel.tsx` — HeroSlide at index 0, totalSlides +1, GSAP expo.out 0.5s, wrap instant-jump, reduced motion guard
- `components/CarouselSlide.tsx` — removed isFirst/isLast props/disabled, zero-based counter
- `components/ProjectsOverlay.tsx` — `onGoToSlide(index + 1)` offset, Space key handler
- `components/InfoOverlay.tsx` — resume PDF link with bordered pill style
- `hooks/useCarousel.ts` — wrapping next/prev bypass goTo clamp, timer ref cleanup, goTo stale closure fix
- `styles/index.css` — hero slide variant, hero-content/name/tagline/bio/creds/projects-btn styles, resume link style, image clip-path fix, mobile hero styles
- `index.html` — theme color, structured data, dead fonts removed, sitemap link
- `index.tsx` — Vercel Analytics
- `package.json` — +powerglitch +@vercel/analytics -ogl
- `public/sitemap.xml` — NEW
- `public/apple-touch-icon.png` — NEW (180x180 from favicon.svg)

## Learnings

- **PowerGlitch + React:** PowerGlitch rearranges the DOM (wraps target in containers, clones N times). Must use a `React.memo` wrapper component with a stable ref to prevent React's reconciler from blowing away PowerGlitch's injected nodes. See `GlitchName` component in `HeroSlide.tsx:14-47`.
- **GSAP wrap detection:** `Math.abs(activeIndex - prevIndex.current) > 1` detects wrap transitions. Uses `duration: 0` for instant jump. This works because normal navigation always changes index by exactly 1.
- **goTo stale closure:** `App.tsx:27-29` caches `goTo` in a ref via `onRegisterGoTo`. If `goTo` has `activeIndex` in its dependency array, the ref holds a stale closure forever. Fixed by removing `activeIndex` from deps and dropping the `clamped === activeIndex` early-return.
- **Canvas RAF cleanup:** The standard `cancelAnimationFrame(frameRef.current)` in useEffect cleanup has a race condition — if a frame is in-flight when cleanup runs, the callback fires after cleanup, calls rAF again, and orphans the loop. Fixed with a `runningRef` boolean checked at the top of the draw callback.
- **Reduced motion requires JS guards for non-CSS animations:** The CSS `prefers-reduced-motion` block only affects CSS animations/transitions. GSAP tweens and Web Animations API (PowerGlitch) need explicit `window.matchMedia` checks.

## Artifacts

All paths relative to `rlupo-portfolio/`:

```
components/AsciiGrid.tsx              — canvas ASCII grid with RAF lifecycle
components/HeroSlide.tsx              — hero content + PowerGlitch + entrance animation + PROJECTS button
components/Carousel.tsx               — hero integration, GSAP expo.out, wrap detection
components/CarouselSlide.tsx          — simplified props, zero-based counter
components/ProjectsOverlay.tsx        — index offset, Space key
components/InfoOverlay.tsx            — resume link
hooks/useCarousel.ts                  — wrapping, timer cleanup, closure fix
styles/index.css                      — hero styles, resume link, clip-path fix
index.html                            — meta fixes, sitemap link
index.tsx                             — Vercel Analytics
package.json                          — dependency changes
public/sitemap.xml                    — sitemap
public/apple-touch-icon.png           — touch icon
docs/superpowers/specs/2026-06-22-hero-and-polish-design.md
docs/superpowers/plans/2026-06-22-hero-and-polish.md
```

## Action Items & Next Steps

1. **ASCII grid mobile performance** — Test on real low-end devices (or Chrome DevTools throttling). Options: increase CELL size on mobile (e.g., 24px), reduce influence radius, or skip canvas entirely below 768px and show a static background.

2. **Add 1024px tablet breakpoint** — The two-column project slide grid and `7rem` left padding need a mid-size breakpoint. Consider `grid-template-columns: 1fr` or reduced padding at 1024px.

3. **Fix mobile footer wrap** — Replace `flex-wrap: wrap` on `.carousel-slide-footer` at 768px with explicit stacking or a more predictable layout.

4. **Extract `--page-indent` token** — Replace hardcoded `7rem` in hero-content, carousel-slide-footer, and terminal-panel with a CSS custom property.

5. **Overlay exit animations** — Add GSAP or CSS exit transitions so overlays don't vanish on unmount. Requires changing from conditional rendering (`if (!isOpen) return null`) to a class-based show/hide with animation.

6. **Award-tier motion polish** — See the "Award-Tier Gaps" list above. Best tackled as a dedicated session.

## Other Notes

- **Prototype files** still exist at `prototypes/hero-ascii-grid.html`, `hero-particle-field.html`, `hero-crt-glitch.html`, `hero-ascii-crt-hybrid.html`. These are standalone HTML files used for design exploration — safe to delete.
- **Reference repos** cloned at `references/webgl-ascii-hero/` and `references/powerglitch/`. Used for studying implementations — safe to delete.
- The branch is 15 commits ahead of `main` (plus the earlier overlay/layout work). Total divergence from main is significant — consider a squash merge or PR when ready to ship.
- `public/resume.pdf` does not exist yet — the link is a placeholder. User will add the file when ready.
- Dev server runs on port 3001 (3000 was occupied).
