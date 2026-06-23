# Activity Log Slide + Animation Polish — Design Spec

## Overview

Two additions to the portfolio: (1) an Activity Log carousel slide showing recent shipping activity, and (2) animation polish for overlays and terminal lines.

## Feature 1: Activity Log Slide

### Position

Last slide in the carousel — after MLForge (index 9), before wrapping back to hero. The Carousel component currently renders HeroSlide at index 0 and maps `CAROUSEL_PROJECTS` for the rest. The activity slide gets the same treatment as HeroSlide — a dedicated component rendered at the final index.

### Component: `ActivitySlide.tsx`

Uses the existing `carousel-slide carousel-slide--no-image` classes (single-column, no image). Terminal-styled content matching the existing `terminal-panel` aesthetic.

**Props:** Same as HeroSlide — `isActive`, `onPrev`, `onNext`, `activeIndex`, `totalSlides`.

**Layout:**

```
[terminal-panel]
  $ log --recent

  2026-06-22 · portfolio     · redesigned · GSAP terminal carousel
  2026-06-20 · FerroML       · v0.3.0     · 6,500 tests · PyPI
  2026-06-18 · nspb-api      · v2.1       · 60+ endpoints shipped
  ...

  $ uptime
  > 365 days shipping · 9 projects · 4 languages

[footer]
  ← PREV   09 / 11   NEXT →
```

Each log entry is a `.terminal-line` with date, project, label, and note — monospaced, left-aligned like `git log --oneline`.

The `$ uptime` summary line at the bottom aggregates stats.

### Data: `ACTIVITY_LOG` in `constants.ts`

```ts
export interface ActivityEntry {
  date: string;      // "2026-06-22"
  project: string;   // "portfolio"
  label: string;     // "redesigned"
  note: string;      // "GSAP terminal carousel"
}
```

Static array of 8-12 entries, manually curated. Most recent first.

### Entrance Animation

Same staggered GSAP reveal as project terminal lines — each `.terminal-line` fades + translates in (y: 6px → 0, opacity: 0 → 1) with 60ms stagger when `isActive` becomes true. Reduced motion guard via `matchMedia`.

### Carousel Integration

- `Carousel.tsx` renders `ActivitySlide` at the last index (after all project slides)
- `totalSlides` increments by 1
- The carousel counter shows the activity slide as part of the total count
- `ProjectsOverlay` does NOT list the activity slide (it's not a project)

## Feature 2: Overlay Exit Animations

### Current Problem

Both `InfoOverlay` and `ProjectsOverlay` use conditional rendering (`if (!isOpen) return null`). They animate in via CSS (opacity + transform), but vanish instantly on close.

### Solution

Change from conditional rendering to persistent rendering with CSS class-based show/hide. The overlay DOM stays mounted; visibility is controlled by an `--active` class.

**Enter:** `opacity: 0, translateY(8px)` → `opacity: 1, translateY(0)` over 300ms ease-out
**Exit:** reverse — `opacity: 1, translateY(0)` → `opacity: 0, translateY(8px)` over 250ms ease-out

After exit animation completes, set `pointer-events: none` and `visibility: hidden` to prevent interaction with the hidden overlay.

Implementation: use GSAP `gsap.to()` triggered by `isOpen` changes in a `useEffect`. On open: animate in, set pointer-events auto. On close: animate out, then set pointer-events none.

The overlays already have focus trap and body scroll lock — those stay tied to `isOpen` prop, not the animation state.

### Accessibility

- `aria-hidden="true"` when closed, `"false"` when open
- Focus trap activates on open, deactivates on close (after exit animation)
- Body scroll lock follows `isOpen`, not animation state

## Feature 3: Terminal Line Exit Animation

### Current Problem

When navigating away from a project slide, the terminal lines disappear instantly (no exit animation).

### Solution

When `isActive` becomes false on a `CarouselSlide`, GSAP animates the terminal lines out: `opacity: 1 → 0, y: 0 → -4px` over 200ms with 30ms stagger. This is faster and subtler than the entrance to avoid slowing down navigation.

Reduced motion guard: skip animation, lines just hide via CSS.

## Global Constraints

- All new components follow existing patterns (Departure Mono font, terminal aesthetic, existing CSS custom properties)
- GSAP for all JS-driven animations, CSS for state transitions
- Reduced motion guards on all new animations
- No new dependencies
- Activity log data is static in constants.ts
- Overlays must remain accessible (focus trap, aria attributes, keyboard navigation)
