---
date: 2026-06-22T21:30:00-04:00
git_commit: 7b2b7b7
branch: redesign/invisible-frame
status: complete
---

# Handoff: Mobile Polish + Activity Log + Animation Polish

## Task(s)

**Completed this session (3 work streams):**

### 1. Mobile & Responsive Polish

- **ASCII grid skipped on mobile (<768px)** — Canvas returns null, no RAF loop, no mouse listeners. Uses reactive `matchMedia` listener + React state so it responds to orientation changes and resize.
- **1024px tablet breakpoint** — `--page-indent` reduced to 3.5rem. Two-column project grid preserved (enough room at ~950px content width).
- **`--page-indent` CSS token** — Replaced hardcoded `7rem` in 3 places (hero-content, carousel-slide-footer, terminal-panel). Breakpoints override the token cleanly.
- **Mobile footer fix** — `flex-direction: column` replaces `flex-wrap: wrap` for predictable stacking.
- **Project images hidden on mobile** — `display: none` on `.carousel-slide-image` at 768px. Grid simplified to `1fr auto` (terminal + footer only).
- **Hero centered vertically on mobile** — `justify-content: center` replaces `flex-end` since ASCII grid is hidden and there's no visual anchor at the top.

### 2. Activity Log Slide

- **New carousel slide at the end** (after all 9 project slides, before wrap to hero). Shows `$ log --recent` with 10 static entries spanning 2024-2026: project name, version/label, and a short note per entry.
- **Summary line:** `$ uptime` → `2 years shipping · 9 projects · 4 languages`
- **Data:** Static `ACTIVITY_LOG` array and `ACTIVITY_SUMMARY` object in `constants.ts`. `ActivityEntry` type in `types.ts`.
- **Terminal-styled layout** — reuses existing `terminal-panel`, `terminal-line`, `terminal-prompt` classes. New `.activity-row` grid (4-column desktop, 2-column mobile).
- **Staggered GSAP entrance** — lines fade + translateY with 60ms stagger, replays on each visit. Single useEffect (collapsed from original fragile two-effect pattern).
- **Carousel integration** — `totalSlides` updated from `length + 1` to `length + 2` in all 3 occurrences (useCarousel hook, HeroSlide props, CarouselSlide props). ActivitySlide renders at `CAROUSEL_PROJECTS.length + 1`.

### 3. Animation Polish

- **Overlay enter/exit transitions** — InfoOverlay and ProjectsOverlay changed from conditional rendering (`if (!isOpen) return null`) to persistent DOM with GSAP. Enter: `opacity 0→1, y 8→0, 0.3s expo.out`. Exit: reverse at 0.25s, then `visibility: hidden` + `pointer-events: none` on complete. Reduced motion guard. `hasOpened` ref prevents spurious exit tween on mount.
- **Accessibility fix** — Removed `aria-hidden` from `role="dialog"` overlays (anti-pattern; `visibility: hidden` already hides from screen readers).
- **Terminal line exit animation** — When leaving a project slide, terminal lines animate out: `opacity 1→0, y 0→-4, 0.2s, 0.03s stagger`. Tracked via `wasActive` ref. Reduced motion guard.

## Critical References

- `docs/superpowers/specs/2026-06-22-activity-log-and-animation-polish-design.md` — design spec
- `docs/superpowers/plans/2026-06-22-activity-log-and-animation-polish.md` — implementation plan (5 tasks)
- `docs/superpowers/plans/2026-06-22-mobile-layout-polish.md` — mobile plan (2 tasks)

## Recent Changes

13 commits from `f71a0c8` to `7b2b7b7`:

**Mobile/responsive:**
- `styles/index.css` — `--page-indent` token, 1024px breakpoint, 768px grid simplification, image hide, hero centering, footer column, activity row mobile styles
- `components/AsciiGrid.tsx` — reactive `matchMedia` + `useState` for mobile detection, skip canvas/effects on mobile

**Activity log:**
- `types.ts` — `ActivityEntry` interface
- `constants.ts` — `ACTIVITY_LOG` (10 entries), `ACTIVITY_SUMMARY`
- `components/ActivitySlide.tsx` — NEW: terminal-styled activity log with GSAP entrance
- `components/Carousel.tsx` — ActivitySlide at last index, totalSlides +1

**Animation polish:**
- `components/InfoOverlay.tsx` — persistent DOM, GSAP enter/exit, removed aria-hidden, hasOpened guard
- `components/ProjectsOverlay.tsx` — same pattern as InfoOverlay
- `components/CarouselSlide.tsx` — terminal line exit animation with wasActive ref
- `styles/index.css` — removed CSS keyframe animations from overlays, added base opacity:0

## Current App Architecture

```
Hero Slide (index 0)
  └── AsciiGrid canvas (desktop only)
  └── GlitchName (PowerGlitch)
  └── Staggered GSAP entrance
  └── [ PROJECTS → ] button

Project Slides (indices 1-9)
  └── TerminalPanel (title, category, status, metric, description, stack)
  └── Project image (desktop only, hidden on mobile)
  └── Entrance + exit animations on terminal lines
  └── [ VISIT -> ] link + carousel nav

Activity Log Slide (index 10)
  └── $ log --recent (10 static entries)
  └── $ uptime summary
  └── Staggered entrance animation

Overlays:
  └── InfoOverlay (bio, skills, timeline, contact, resume link)
  └── ProjectsOverlay (all projects list, click-to-navigate)
  └── Both: GSAP enter/exit transitions

Header: TREY LUPO logo + PROJECTS / INFO buttons
Preloader: terminal boot sequence (INITIALIZING... → 100% → READY.)
Custom cursor (desktop only)
```

Total slides: 11 (1 hero + 9 projects + 1 activity log)

## Learnings

- **`aria-hidden` on `role="dialog"` is an anti-pattern.** Screen readers handle it inconsistently. Use `visibility: hidden` instead — AT already skips hidden content.
- **Two useEffects with the same dependency create fragile ordering.** React runs effects in source order, but that's implicit — collapsing them into one effect eliminates the dependency on order.
- **`matchMedia` + React state is the correct pattern for responsive JS behavior.** A plain `window.innerWidth` check at mount time is stale and non-reactive — won't respond to resize or orientation change.
- **Overlay exit animations require persistent DOM.** Conditional rendering (`return null`) unmounts the node before any exit animation can run. Switch to class/style-based show/hide with GSAP controlling visibility.

## Action Items & Next Steps

### Tier 1 — Credibility (content)
1. **Real project screenshots** — Replace AI-generated art (forge-farrier.jpg, clockwork-globe.jpg, ironclad-battle.jpg, etc.) with actual screenshots of tools running
2. **Case study pages** for nspb-api and FerroML — problem → approach → architecture → results → learnings
3. **Resume PDF** — `public/resume.pdf` placeholder link exists, file does not

### Tier 2 — Craft (motion)
4. **Line-mask text reveals** — SplitText lines with overflow:hidden wrappers, yPercent 105→0, expo.out, 0.08s stagger. #1 Awwwards differentiator.
5. **Cursor-follow image preview** on projects overlay rows — gsap.quickTo with asymmetric x/y lag
6. **Project image parallax** — -0.3x scroll offset on carousel images

### Tier 3 — Differentiation
7. **Blog subdomain** — blog.treylupo.com (Astro + MDX), 2-3 technical posts
8. **Live interactive demos** — embed FerroML or nspb-api playground
9. **Dynamic activity log** — GitHub API at build time instead of static data

### Polish backlog (from prior handoff)
10. **`--accent-dim` / `--text-secondary` token dedup** — both are `#A6A77E`
11. **Overlay backgrounds** — hardcoded `rgba(71, 71, 65, 0.98)` instead of `var(--bg-primary)`
12. **Custom cursor contextual labels** — show project name / "VIEW" on hover

## Other Notes

- Branch is now ~28 commits ahead of main. Consider squash merge or PR when ready to ship.
- `public/resume.pdf` does not exist — link is a placeholder.
- Prototype files and reference repos still exist (safe to delete).
- Dev server was on port 3001.
