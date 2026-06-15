---
date: 2026-06-14T21:27:35-04:00
git_commit: 664d760
branch: redesign/invisible-frame
status: complete
---

# Handoff: Overlay Navigation + Michelini Layout — Complete

## Task(s)

**All completed this session:**

1. **Michelini-style layout refinement** — Restructured carousel slides from a side-by-side full-height grid to a two-row layout (content row + footer row). Images are contained 16:10 landscape rectangles (~85% cell width, max 70% height) centered in the right column. Terminal content pushed to bottom via `align-items: flex-end`. VISIT button and carousel nav (PREV/counter/NEXT) share the same footer row at the bottom of each slide.

2. **Overlay navigation** — Eliminated vertical scrolling entirely. Footer absorbed into INFO overlay as a `$ contact --reach-out` terminal section with click-to-copy email, social links, and colophon. New PROJECTS overlay shows all 9 projects in archive-style minimal table rows — clicking a row jumps the carousel to that slide, the arrow opens the external link. Header PROJECTS and INFO buttons now trigger overlays instead of scrolling.

3. **Audit polish** — Epoch format changed from `/26` to `'26`. Header backdrop darkened (rgba 0.92 opacity, 16px blur). Revenue Forecast placeholder image replaced.

4. **Project images** — All 9 projects now have images. 4 formerly imageless projects received Met Museum CC0 public domain paintings: Ironclad → Monitor vs Merrimac (1862), FerroML Plugin → Celestial Globe with Clockwork (1579), GSD-ML → Lavoisier by David (1788), MLForge → The Farrier by van der Neer (1650s).

**Intentionally skipped:**
- **Elliott Mangham layout** (about section on top, carousel below) — discussed and decided against. The overlay architecture already provides immediate access to bio/info without cluttering the main viewport. Adding an about strip would be redundant with the INFO overlay.

## Critical References

- `docs/superpowers/specs/2026-06-14-overlay-navigation-design.md` — design spec for the overlay system
- `docs/superpowers/plans/2026-06-14-overlay-navigation.md` — implementation plan (5 tasks, all complete)
- `rlupo-portfolio/constants.ts` — all project data, `CAROUSEL_PROJECTS` combined array

## Recent Changes

- `components/Carousel.tsx` — accepts `onRegisterGoTo` prop, exposes `goTo` to parent
- `components/CarouselSlide.tsx` — contains nav (PREV/NEXT/counter) + VISIT in shared footer row
- `components/TerminalPanel.tsx` — header + body only, no footer (VISIT moved to slide)
- `components/ProjectsOverlay.tsx` — new: full-screen overlay with archive rows, jump-to-slide
- `components/InfoOverlay.tsx` — gained contact section (email, links, colophon from old Footer)
- `components/Header.tsx` — PROJECTS/INFO are both buttons triggering overlays, TREY LUPO is a span
- `App.tsx` — manages `infoOpen` + `projectsOpen` state, registers `goTo` from Carousel via ref
- `styles/index.css` — two-row slide grid, contained image sizing, projects overlay styles, info-contact styles, dead footer/archive CSS removed
- `constants.ts` — epoch `'26` format, all 9 projects have `imageUrl`, `CAROUSEL_PROJECTS` array

**Deleted:** `components/Footer.tsx`, `components/ArchiveList.tsx`

## Learnings

- The carousel nav was originally absolute-positioned as a sibling of the track. Moving it INTO each slide (as part of a footer row) was necessary to colocate it with the VISIT button. This required passing 6 extra props (onPrev, onNext, isFirst, isLast, activeIndex, totalSlides) from Carousel → CarouselSlide.
- The `goTo` callback registration pattern (`onRegisterGoTo` prop) avoids lifting all carousel state to App while still letting ProjectsOverlay jump to specific slides.
- Mobile grid needed explicit `grid-row` assignments — on desktop, children have explicit row placement, but switching to single-column on mobile caused overlap when both terminal and image defaulted to grid-row 1.
- The Met Museum Open Access API at `collectionapi.metmuseum.org/public/collection/v1/` is excellent for CC0 images. Use `primaryImage` field for full-res originals, not `primaryImageSmall` which gives ~600px web-large versions.

## Artifacts

All paths relative to `rlupo-portfolio/`:

```
components/Carousel.tsx          — onRegisterGoTo prop, goTo exposed
components/CarouselSlide.tsx     — slide footer with VISIT + nav, no-image variant
components/TerminalPanel.tsx     — header + body only
components/ProjectsOverlay.tsx   — NEW: full-screen project listing overlay
components/InfoOverlay.tsx       — gained contact section
components/Header.tsx            — overlay-driven navigation
App.tsx                          — dual overlay state, goTo registration
hooks/useCarousel.ts             — unchanged, exports goTo
constants.ts                     — CAROUSEL_PROJECTS, epoch '26, all imageUrls
styles/index.css                 — slide grid, overlays, contained images
public/assets/ironclad-battle.jpg    — Met Museum CC0
public/assets/clockwork-globe.jpg    — Met Museum CC0
public/assets/lavoisier-lab.jpg      — Met Museum CC0
public/assets/forge-farrier.jpg      — Met Museum CC0
docs/superpowers/specs/2026-06-14-overlay-navigation-design.md
docs/superpowers/plans/2026-06-14-overlay-navigation.md
docs/superpowers/plans/2026-06-14-michelini-layout-refinement.md
```

## Action Items & Next Steps

1. **Deploy** — Branch is build-clean and ready to deploy. User is considering switching from Vercel to Cloudflare Pages for better subdomain support (docs.treylupo.com, blog.treylupo.com, etc.). Research Cloudflare Pages setup if that's the direction.

2. **PR to main** — 15 commits on `redesign/invisible-frame` ahead of main. Could squash-merge or create a PR for review.

3. **Subdomain architecture** — The CLAUDE.md documents a planned subdomain structure (docs, blog, demos, lab). Cloudflare would handle this via separate Pages projects + CNAME records. Each subdomain = separate repo/project.

4. **Optional polish** — The full-res Met Museum images are 3000-4000px originals (50-90KB as JPEGs). Could optimize them for web (resize to ~1600px, convert to WebP) to improve load times.

## Other Notes

- Dev server: `cd rlupo-portfolio && npm run dev` → http://localhost:3000
- Build: `npm run build` → `dist/` (clean, ~250KB JS + ~17KB CSS)
- The site has no tests — it's a static portfolio. Visual verification via Playwright screenshots was used throughout.
- The `CAROUSEL_PROJECTS` array in constants.ts is `[...FEATURED_PROJECTS, ...ALL_PROJECTS]` — 3 featured + 6 archive = 9 total. Order matters for carousel slide indices.
- `.superpowers/brainstorm/` directory was created for the visual companion — add to `.gitignore` if not already there.
