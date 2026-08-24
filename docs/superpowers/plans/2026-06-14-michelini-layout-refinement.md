# Michelini-Style Layout Refinement — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the carousel slide layout so the image is a contained rectangle (Michelini-sized, ~50% width × ~35% height), content is pushed lower on the viewport, and the PREV/NEXT navigation sits on the same row as the VISIT button at the bottom of each slide.

**Architecture:** Move the carousel nav from a separate absolute-positioned element into each slide's footer row. Restructure the slide grid from a two-column full-height split into a two-column layout with an explicit bottom row for the shared footer (VISIT + nav). The image changes from a full-height column to a contained, centered rectangle within its grid cell.

**Tech Stack:** React, CSS Grid, GSAP (existing animation unchanged)

**Reference:** [francescomichelini.com](https://www.francescomichelini.com/) — contained landscape image, nav + VISIT + project details all at the bottom.

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `components/Carousel.tsx` | Modify | Remove the `<nav>` element, pass nav handlers as props to each slide |
| `components/CarouselSlide.tsx` | Modify | Accept nav props, render shared footer row with VISIT + nav |
| `components/TerminalPanel.tsx` | Modify | Remove the `.terminal-footer` (VISIT button moves to slide footer) |
| `hooks/useCarousel.ts` | No change | Already exports all needed state/handlers |
| `styles/index.css` | Modify | New slide grid (two rows), contained image sizing, bottom footer row, remove old nav positioning |

---

### Task 1: Move nav from Carousel into CarouselSlide

The nav currently lives in `Carousel.tsx` as a sibling of `.carousel-track`. It needs to move inside each slide so it can share a footer row with the VISIT button. This requires passing nav state down as props.

**Files:**
- Modify: `components/Carousel.tsx`
- Modify: `components/CarouselSlide.tsx`
- Modify: `components/TerminalPanel.tsx`

- [ ] **Step 1: Update CarouselSlide props to accept nav state**

In `components/CarouselSlide.tsx`, add nav props to the interface and render a slide footer:

```tsx
interface CarouselSlideProps {
  project: Project;
  index: number;
  isActive: boolean;
  onPrev: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  activeIndex: number;
  totalSlides: number;
}
```

The slide footer replaces both the old TerminalPanel footer and the old Carousel nav:

```tsx
<div className="carousel-slide-footer">
  {url && (
    <a href={url} target="_blank" rel="noopener noreferrer" className="terminal-visit">
      [ VISIT -&gt; ]
    </a>
  )}

  <nav className="carousel-nav" aria-label="Project navigation">
    <button className="carousel-btn" onClick={onPrev} disabled={isFirst} aria-label="Previous project">
      <span aria-hidden="true">&larr;</span> PREV
    </button>
    <span className="carousel-counter">
      {String(activeIndex + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
    </span>
    <button className="carousel-btn" onClick={onNext} disabled={isLast} aria-label="Next project">
      NEXT <span aria-hidden="true">&rarr;</span>
    </button>
  </nav>
</div>
```

The `url` variable (`project.githubUrl || project.liveUrl`) moves from TerminalPanel into CarouselSlide so the slide footer can render VISIT.

- [ ] **Step 2: Remove footer from TerminalPanel**

In `components/TerminalPanel.tsx`, delete the entire `.terminal-footer` div (lines 61-73). The VISIT button and cursor-blink now live in CarouselSlide's footer. TerminalPanel becomes just the header + body.

- [ ] **Step 3: Remove nav from Carousel and pass props to slides**

In `components/Carousel.tsx`:
1. Delete the entire `<nav className="carousel-nav">` block (lines 51-73)
2. Pass nav state to each CarouselSlide:

```tsx
<CarouselSlide
  key={project.id}
  project={project}
  index={i}
  isActive={i === activeIndex}
  onPrev={prev}
  onNext={next}
  isFirst={isFirst}
  isLast={isLast}
  activeIndex={activeIndex}
  totalSlides={CAROUSEL_PROJECTS.length}
/>
```

- [ ] **Step 4: Verify build**

Run: `npx tsc --noEmit && npm run build`
Expected: Clean build, no errors.

- [ ] **Step 5: Commit**

```bash
git add components/Carousel.tsx components/CarouselSlide.tsx components/TerminalPanel.tsx
git commit -m "refactor: move carousel nav into slide footer, colocate with VISIT button"
```

---

### Task 2: Restructure slide grid — two rows with bottom footer

Change the slide from a single-row two-column grid to a two-row grid where:
- Row 1: terminal info (left) + image (right) — flexible height
- Row 2: shared footer (VISIT + nav) — auto height, spans full width

Content should sit in the lower portion of the viewport, not the top.

**Files:**
- Modify: `styles/index.css`

- [ ] **Step 1: Update `.carousel-slide` grid to two rows**

Replace the current carousel slide CSS:

```css
.carousel-slide {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr auto;
  width: 100vw;
  height: 100vh;
  flex-shrink: 0;
  overflow: hidden;
  padding-top: 64px;
}

.carousel-slide--no-image {
  grid-template-columns: 1fr;
}
```

- [ ] **Step 2: Assign grid areas to slide children**

```css
.carousel-slide-terminal {
  grid-column: 1;
  grid-row: 1;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.carousel-slide-image {
  grid-column: 2;
  grid-row: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-2xl);
  overflow: hidden;
  clip-path: inset(0 100% 0 0);
  transition: clip-path var(--duration-reveal) var(--ease-out);
}

.carousel-slide--active .carousel-slide-image {
  clip-path: inset(0 0 0 0);
}

.carousel-slide-footer {
  grid-column: 1 / -1;
  grid-row: 2;
  display: flex;
  align-items: center;
  gap: var(--space-2xl);
  padding: var(--space-lg) var(--space-2xl) var(--space-2xl) 7rem;
}
```

Key points:
- `.carousel-slide-terminal` uses `align-items: flex-end` to push terminal content to the bottom of its cell
- `.carousel-slide-image` uses `align-items: center` + padding to contain the image
- `.carousel-slide-footer` spans both columns, aligns VISIT and nav horizontally
- Footer padding-left matches terminal panel's left padding (7rem) for alignment

- [ ] **Step 3: Update `.terminal-panel` to remove justify-content: space-between**

The terminal panel no longer needs `justify-content: space-between` since the footer is gone. Change to:

```css
.terminal-panel {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  padding: var(--space-2xl) var(--space-2xl) var(--space-lg) 7rem;
  font-family: var(--font-departure);
}
```

Remove `height: 100%` — the panel no longer fills the full viewport. Remove `justify-content: space-between` — no footer to push down.

- [ ] **Step 4: Remove old carousel-nav absolute positioning**

Delete the old `.carousel-nav` absolute positioning block. Replace with inline flex styling:

```css
.carousel-nav {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
}
```

The nav is no longer absolutely positioned — it flows inline within `.carousel-slide-footer`.

- [ ] **Step 5: Verify layout**

Run: `npx playwright screenshot --wait-for-timeout=5000 --viewport-size="1024,768" http://localhost:3000 /tmp/task2-check.png`
Expected: Terminal content pushed to lower-left, image in center-right area, VISIT + nav on same row at bottom.

- [ ] **Step 6: Commit**

```bash
git add styles/index.css
git commit -m "style: restructure slide grid — two rows, content pushed down, footer row"
```

---

### Task 3: Contained image sizing (Michelini-style)

The image should be a contained landscape rectangle, roughly 60-70% of the cell width and 50-60% of the cell height. Not full-bleed.

**Files:**
- Modify: `styles/index.css`

- [ ] **Step 1: Size the image as a contained rectangle**

```css
.carousel-slide-image-inner {
  position: relative;
  width: 85%;
  max-height: 70%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: var(--radius-md);
}

.carousel-slide-image-inner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
}
```

Key: `aspect-ratio: 16/10` forces a landscape rectangle. `width: 85%` of the cell + `max-height: 70%` keeps it from dominating. The parent's `align-items: center` + `justify-content: center` floats it in the middle of its cell.

- [ ] **Step 2: Verify image sizing**

Run: `npx playwright screenshot --wait-for-timeout=5000 --viewport-size="1440,900" http://localhost:3000 /tmp/task3-check.png`
Expected: Image is a contained rectangle with visible olive background around all sides. Similar proportions to francescomichelini.com.

- [ ] **Step 3: Compare with reference**

Run: `npx playwright screenshot --wait-for-timeout=10000 --viewport-size="1440,900" https://www.francescomichelini.com/ /tmp/michelini-compare.png`
Side-by-side comparison. Adjust `width` / `max-height` / `aspect-ratio` values if needed.

- [ ] **Step 4: Commit**

```bash
git add styles/index.css
git commit -m "style: contained image sizing — Michelini-style landscape rectangle"
```

---

### Task 4: Mobile responsive adjustments

The mobile layout needs updating for the new grid structure.

**Files:**
- Modify: `styles/index.css`

- [ ] **Step 1: Update mobile breakpoint**

```css
@media (max-width: 768px) {
  .carousel-slide {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
    padding-top: 64px;
  }

  .carousel-slide--no-image {
    grid-template-rows: 1fr auto;
  }

  .carousel-slide-terminal {
    align-items: flex-start;
  }

  .carousel-slide-image {
    grid-column: 1;
    padding: var(--space-md);
  }

  .carousel-slide-footer {
    grid-column: 1;
    flex-wrap: wrap;
    padding-left: var(--space-xl);
    gap: var(--space-md);
  }

  .terminal-panel {
    padding-left: var(--space-xl);
  }
}
```

- [ ] **Step 2: Test at 400px**

Run: `npx playwright screenshot --wait-for-timeout=5000 --viewport-size="400,900" http://localhost:3000 /tmp/task4-mobile.png`
Expected: Stacked layout — terminal on top, image below, footer at bottom. Nothing overflows.

- [ ] **Step 3: Commit**

```bash
git add styles/index.css
git commit -m "style: mobile responsive updates for new slide grid"
```

---

### Task 5: Visual polish pass

After the structural changes, verify and tune spacing, alignment, and transitions.

**Files:**
- Modify: `styles/index.css` (minor tweaks only)

- [ ] **Step 1: Check all viewport sizes**

Take screenshots at 1920x1080, 1440x900, 1024x768, 400x900. Look for:
- Terminal content alignment with footer (left edges should align)
- Image proportions feel right
- VISIT + nav spacing feels balanced
- Imageless slides (slide 6+) look clean

- [ ] **Step 2: Verify imageless slides**

Temporarily set `useState(5)` in `useCarousel.ts`, screenshot, revert. The imageless slide should show terminal full-width with footer below. No empty image cell.

- [ ] **Step 3: Test navigation**

Use Playwright to click NEXT several times, verify counter updates and transitions work. The GSAP slide animation should still function since the track/slide structure is unchanged.

- [ ] **Step 4: Adjust spacing as needed**

Tune these values based on visual testing:
- `padding-top` on `.carousel-slide` (controls how far down content sits)
- `padding` on `.carousel-slide-image` (controls breathing room around image)
- `width` / `max-height` on `.carousel-slide-image-inner` (controls image size)
- `gap` on `.carousel-slide-footer` (controls VISIT-to-nav spacing)

- [ ] **Step 5: Final commit**

```bash
git add styles/index.css hooks/useCarousel.ts
git commit -m "style: polish spacing for Michelini-style layout"
```

---

## Summary of Changes

| What | Before | After |
|------|--------|-------|
| Image | Full-height column (100vh × 55%) | Contained rectangle (~85% × 70%, 16:10 aspect) |
| Content position | Fills full viewport height | Pushed to lower portion |
| Nav location | Absolute, vertical, left edge | Inline in slide footer, right of VISIT |
| VISIT + Nav | Different components, different positions | Same footer row, same component |
| Slide grid | `45% / 55%` single row | `1fr / 1fr` two rows (content + footer) |
