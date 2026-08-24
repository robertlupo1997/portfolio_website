# Handoff: Design Evolution — Layout + Navigation Changes (2026-06-14)

## For the next session

Audit fixes are done. Now it's time for the user's design evolution — layout changes to the carousel, navigation, and project structure. These are not bugs; they're intentional design improvements based on the user's feedback after seeing the initial build.

---

## Current state

**Branch:** `redesign/invisible-frame`
**Latest commit:** `bf22e95` — audit fixes (VISIT link, scroll-to-top, scanlines, animation retrigger)
**Build status:** Clean
**Dev server:** `cd rlupo-portfolio && npm run dev` → http://localhost:3000

---

## Design changes to implement (user's words + interpretation)

### 1. Move PREV/NEXT to the left side of the screen

**User said:** "the next and previous buttons should be moved to the left side of the screen, not covering up the pictures"

**What to do:** Move the carousel navigation (PREV/NEXT buttons + dot indicators) from bottom-center to a vertical strip on the left side of the viewport. This keeps them out of the image area. Consider:
- Vertical orientation: PREV on top, dots stacked vertically, NEXT on bottom
- Fixed to the left edge, vertically centered
- Or: integrate into the terminal panel area (left 45%) at the bottom

**Current code:** `Carousel.tsx` renders `<nav className="carousel-nav">` with PREV/NEXT/dots. CSS in `index.css` under `.carousel-nav` positions them `bottom: var(--space-2xl)` centered.

### 2. Shrink images — more minimal

**User said:** "the pictures should be shrunken down so they're not taking up the full page. A little bit more minimal like the website they were designing based off of because they are a little bit too much."

**What to do:** The right-side image currently fills 55% width × 100% viewport height (edge-to-edge). Reduce it:
- Option A: Keep 55% width but add vertical padding so the image doesn't touch top/bottom edges
- Option B: Reduce the image to ~40% width with generous padding/margin, leaving breathing room on all sides
- Option C: Contained image block (like Michelini's) — image is a defined rectangle within the right area, not a full bleed

Reference: Michelini's site has images that are large but contained within padding, not bleeding edge-to-edge.

**Current code:** `.carousel-slide` uses `grid-template-columns: 45% 55%`. `.carousel-slide-image` has `height: 100%` and the img has `object-fit: cover`.

### 3. Make PREV/NEXT more visible

**User said:** "the next and previous should be more visible"

**What to do:** Currently PREV/NEXT use `--accent-dim` (#A6A77E) which blends with the olive background. Options:
- Use `--accent` (#E85D3A) for the text color
- Add a subtle border or background
- Increase font size from `--text-label` (0.75rem) to `--text-nav` (0.875rem)
- Add arrow glyphs: `← PREV` / `NEXT →`

### 4. All 9 projects in the carousel

**User said:** "we should probably move all of the projects into this section, so they're all on the scroll... the horizontal scroll thing"

**What to do:** Instead of 3 featured projects in the carousel + 6 in an archive list below, put ALL 9 projects into the horizontal carousel. Remove the ArchiveList component entirely.

**Implementation:**
- In `Carousel.tsx`, change `FEATURED_PROJECTS` to `[...FEATURED_PROJECTS, ...ALL_PROJECTS]` (or create a combined constant)
- Update `useCarousel` totalSlides to 9
- Remove `<ArchiveList />` from `App.tsx`
- Remove or keep `ArchiveList.tsx` (can delete)
- Dot indicators with 9 dots might be too many — consider replacing dots with a slide counter (`01 / 09`) or a progress bar
- Some projects (Ironclad, FerroML Plugin, GSD-ML, MLForge) have no `imageUrl` — decide how to handle: generate images, show a code/terminal visual, or use a different slide layout for imageless projects

### 5. Future: About section on top (Elliott Mangham style) — DO NOT implement yet

**User said:** "maybe we should copy elliott.mangham.dev in that it has some of the about you section in the top. And I kinda like that. Maybe we could have that and then have this horizontal scroll be the rest of the screen."

**What this means:** Split the page into two zones:
- Top: fixed "about" strip (name, title, skills, links) — always visible
- Bottom: horizontal carousel taking the remaining viewport height

**Reference:** [elliott.mangham.dev](https://elliott.mangham.dev/) — has INTRO, POSITION, RECOGNITION, BRANDS, CONNECT sections across the top, then a horizontal project gallery at the bottom.

**Status:** The user said "let's not do that for now." This is a future brainstorm topic. Note it but don't implement.

---

## Remaining minor polish from audit (fix when convenient)

- `/26` epoch indicator is ambiguous — consider `'26` or removing
- Info overlay: closing returns scroll to archive position instead of carousel
- Header backdrop blur hard to perceive against olive background
- Revenue Forecast still uses `kkbox-churn.jpg` placeholder image

---

## Key files to modify

| File | Changes needed |
|------|---------------|
| `components/Carousel.tsx` | Change data source to all projects, update nav layout |
| `hooks/useCarousel.ts` | totalSlides will be 9 instead of 3 |
| `styles/index.css` | Carousel nav positioning (left side), image sizing, button visibility |
| `App.tsx` | Remove ArchiveList import |
| `constants.ts` | May need a combined `ALL_PROJECTS_COMBINED` array or reorder |
| `components/ArchiveList.tsx` | Can be deleted after all projects move to carousel |
| `components/CarouselSlide.tsx` | May need variant for imageless projects |

---

## Reference sites

- **francescomichelini.com** — carousel structure, olive/red-coral palette, contained images
- **elliott.mangham.dev** — about-on-top + horizontal gallery below (future inspiration)

---

## Resume instructions

1. Start dev server: `cd rlupo-portfolio && npm run dev`
2. Implement changes 1-4 above (nav placement, image sizing, nav visibility, all projects in carousel)
3. Use `/impeccable` or design skills for visual polish decisions on image sizing and nav placement
4. Do NOT implement change 5 (Elliott Mangham layout) — that's a future brainstorm
5. After implementing, run another audit or ask the user for feedback
