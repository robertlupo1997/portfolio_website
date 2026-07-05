# Activity Log + Animation Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an Activity Log carousel slide showing recent shipping activity, and polish overlay/terminal animations with proper enter/exit transitions.

**Architecture:** New `ActivitySlide` component follows the same pattern as `HeroSlide` — rendered at a fixed carousel index with its own props. Overlay exit animations use GSAP with persistent DOM (class-based show/hide instead of conditional rendering). Terminal exit animations are a small addition to existing `CarouselSlide`.

**Tech Stack:** React, GSAP, TypeScript, CSS

## Global Constraints

- Follow existing patterns: Departure Mono font, terminal aesthetic, existing CSS custom properties
- GSAP for all JS-driven animations, CSS for state transitions
- Reduced motion guards (`window.matchMedia('(prefers-reduced-motion: reduce)')`) on all new animations
- No new dependencies
- Activity log data is static in `constants.ts`
- Overlays must remain accessible (focus trap, aria attributes, keyboard navigation)
- All files in `rlupo-portfolio/`

---

### Task 1: Add activity log data and type

**Files:**
- Modify: `rlupo-portfolio/types.ts`
- Modify: `rlupo-portfolio/constants.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `ActivityEntry` type and `ACTIVITY_LOG: ActivityEntry[]` array, `ACTIVITY_SUMMARY` object used by Task 2

- [ ] **Step 1: Add ActivityEntry type to types.ts**

Add after the `Credential` interface:

```ts
export interface ActivityEntry {
  date: string;
  project: string;
  label: string;
  note: string;
}
```

- [ ] **Step 2: Add ACTIVITY_LOG and ACTIVITY_SUMMARY to constants.ts**

Add after `CREDENTIALS` at the end of the file:

```ts
import { Project, ProjectCategory, Credential, ActivityEntry } from './types';
```

(Update the existing import to include `ActivityEntry`.)

```ts
export const ACTIVITY_LOG: ActivityEntry[] = [
  { date: '2026-06', project: 'portfolio', label: 'redesigned', note: 'GSAP terminal carousel' },
  { date: '2026-06', project: 'FerroML', label: 'v0.3.0', note: '6,500 tests · PyPI' },
  { date: '2026-06', project: 'nspb-api', label: 'v2.1', note: '60+ endpoints shipped' },
  { date: '2026-05', project: 'gsd-ml', label: 'released', note: 'autonomous ML research' },
  { date: '2026-05', project: 'FerroML Plugin', label: 'released', note: 'Claude Code integration' },
  { date: '2026-04', project: 'ironclad', label: 'v1.0', note: '95% CI cost estimation' },
  { date: '2026-03', project: 'MLForge', label: 'released', note: 'CSV in · pipeline out' },
  { date: '2025-12', project: 'nspb-api', label: 'v1.0', note: 'Oracle EPM SDK launched' },
  { date: '2025-09', project: 'revenue-forecast', label: 'deployed', note: 'multi-LOB reconciliation' },
  { date: '2024-11', project: 'KKBOX', label: 'published', note: '0.97 AUC · HuggingFace' },
];

export const ACTIVITY_SUMMARY = {
  duration: '2 years shipping',
  projects: `${CAROUSEL_PROJECTS.length} projects`,
  languages: '4 languages',
};
```

- [ ] **Step 3: Verify types compile**

Run: `npx tsc --noEmit`
Expected: clean, no errors

- [ ] **Step 4: Commit**

```bash
git add rlupo-portfolio/types.ts rlupo-portfolio/constants.ts
git commit -m "feat: add activity log data and ActivityEntry type"
```

---

### Task 2: Create ActivitySlide component

**Files:**
- Create: `rlupo-portfolio/components/ActivitySlide.tsx`

**Interfaces:**
- Consumes: `ACTIVITY_LOG` and `ACTIVITY_SUMMARY` from `constants.ts`, `ActivityEntry` from `types.ts`
- Produces: `ActivitySlide` component with props `{ isActive, onPrev, onNext, activeIndex, totalSlides }`

- [ ] **Step 1: Create ActivitySlide.tsx**

```tsx
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ACTIVITY_LOG, ACTIVITY_SUMMARY } from '../constants';

interface ActivitySlideProps {
  isActive: boolean;
  onPrev: () => void;
  onNext: () => void;
  activeIndex: number;
  totalSlides: number;
}

const ActivitySlide: React.FC<ActivitySlideProps> = ({
  isActive,
  onPrev,
  onNext,
  activeIndex,
  totalSlides,
}) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isActive || hasAnimated.current || !bodyRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      hasAnimated.current = true;
      return;
    }

    hasAnimated.current = true;
    const lines = bodyRef.current.querySelectorAll('.terminal-line');
    gsap.fromTo(lines,
      { y: 6, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'expo.out', stagger: 0.06, delay: 0.1 }
    );
  }, [isActive]);

  useEffect(() => {
    if (isActive) {
      hasAnimated.current = false;
    }
  }, [isActive]);

  return (
    <div className={`carousel-slide carousel-slide--no-image ${isActive ? 'carousel-slide--active' : ''}`}>
      <div className="carousel-slide-terminal">
        <div className="terminal-panel">
          <div className="terminal-header">
            <span className="terminal-index">LOG</span>
            <span className="terminal-epoch">'24–'26</span>
          </div>

          <div className={`terminal-body ${isActive ? 'terminal-body--active' : ''}`} ref={bodyRef}>
            <div className="terminal-line terminal-prompt">
              $ log --recent
            </div>

            {ACTIVITY_LOG.map((entry, i) => (
              <div key={i} className="terminal-line activity-row">
                <span className="activity-date">{entry.date}</span>
                <span className="activity-project">{entry.project}</span>
                <span className="activity-label">{entry.label}</span>
                <span className="activity-note">{entry.note}</span>
              </div>
            ))}

            <div className="terminal-line terminal-prompt" style={{ marginTop: 'var(--space-lg)' }}>
              $ uptime
            </div>
            <div className="terminal-line">
              <span className="terminal-caret">&gt; </span>
              {ACTIVITY_SUMMARY.duration} · {ACTIVITY_SUMMARY.projects} · {ACTIVITY_SUMMARY.languages}
            </div>
          </div>
        </div>
      </div>

      <div className="carousel-slide-footer">
        <nav className="carousel-nav" aria-label="Project navigation">
          <button className="carousel-btn" onClick={onPrev} aria-label="Previous slide">
            <span aria-hidden="true">&larr;</span> PREV
          </button>
          <span className="carousel-counter">
            {String(activeIndex).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
          </span>
          <button className="carousel-btn" onClick={onNext} aria-label="Next slide">
            NEXT <span aria-hidden="true">&rarr;</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default ActivitySlide;
```

- [ ] **Step 2: Verify types compile**

Run: `npx tsc --noEmit`
Expected: clean

- [ ] **Step 3: Commit**

```bash
git add rlupo-portfolio/components/ActivitySlide.tsx
git commit -m "feat: create ActivitySlide component with staggered terminal animation"
```

---

### Task 3: Integrate ActivitySlide into Carousel and add CSS

**Files:**
- Modify: `rlupo-portfolio/components/Carousel.tsx`
- Modify: `rlupo-portfolio/styles/index.css`

**Interfaces:**
- Consumes: `ActivitySlide` from Task 2, `CAROUSEL_PROJECTS` from constants
- Produces: Activity slide rendered at last carousel index, styled activity rows

- [ ] **Step 1: Add ActivitySlide to Carousel.tsx**

The carousel currently has `totalSlides = CAROUSEL_PROJECTS.length + 1` (hero + projects). Change to `CAROUSEL_PROJECTS.length + 2` (hero + projects + activity). Render `ActivitySlide` after the project map, at the last index.

Update the import:
```tsx
import ActivitySlide from './ActivitySlide';
```

Update `totalSlides` calculation — change both occurrences of `CAROUSEL_PROJECTS.length + 1` to `CAROUSEL_PROJECTS.length + 2`.

Add after the `CAROUSEL_PROJECTS.map(...)` block, before the closing `</div>` of carousel-track:

```tsx
<ActivitySlide
  isActive={activeIndex === CAROUSEL_PROJECTS.length + 1}
  onPrev={prev}
  onNext={next}
  activeIndex={activeIndex}
  totalSlides={CAROUSEL_PROJECTS.length + 2}
/>
```

- [ ] **Step 2: Add activity row CSS styles**

Add before the `/* CURSOR */` section in `styles/index.css`:

```css
/* --- Activity Log --- */
.activity-row {
  display: grid;
  grid-template-columns: 5rem 9rem 7rem 1fr;
  gap: var(--space-sm);
  align-items: baseline;
}

.activity-date {
  color: var(--text-tertiary);
  font-variant-numeric: tabular-nums;
}

.activity-project {
  color: var(--accent);
}

.activity-label {
  color: var(--text-secondary);
}

.activity-note {
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .activity-row {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-xs);
  }

  .activity-date {
    grid-column: 1;
  }

  .activity-project {
    grid-column: 2;
    text-align: right;
  }

  .activity-label,
  .activity-note {
    grid-column: 1 / -1;
  }
}
```

- [ ] **Step 3: Build and verify**

Run: `npx vite build`
Expected: clean build, no errors

- [ ] **Step 4: Commit**

```bash
git add rlupo-portfolio/components/Carousel.tsx rlupo-portfolio/styles/index.css
git commit -m "feat: integrate ActivitySlide as last carousel slide with styled log rows"
```

---

### Task 4: Overlay exit animations

**Files:**
- Modify: `rlupo-portfolio/components/InfoOverlay.tsx`
- Modify: `rlupo-portfolio/components/ProjectsOverlay.tsx`
- Modify: `rlupo-portfolio/styles/index.css`

**Interfaces:**
- Consumes: existing overlay components and their CSS classes
- Produces: overlays with GSAP enter/exit transitions instead of instant mount/unmount

- [ ] **Step 1: Refactor InfoOverlay to persistent DOM with GSAP transitions**

Replace the conditional `if (!isOpen) return null;` pattern. The overlay always renders but starts hidden. Use a `useEffect` watching `isOpen` to drive GSAP enter/exit animations.

Key changes to `InfoOverlay.tsx`:

1. Remove `if (!isOpen) return null;`
2. Add GSAP import: `import gsap from 'gsap';`
3. Add a `useEffect` that animates on `isOpen` changes:

```tsx
useEffect(() => {
  const el = overlayRef.current;
  if (!el) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration = prefersReducedMotion ? 0 : 0.3;

  if (isOpen) {
    el.style.visibility = 'visible';
    el.style.pointerEvents = 'auto';
    gsap.fromTo(el,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration, ease: 'expo.out' }
    );
  } else {
    gsap.to(el, {
      opacity: 0,
      y: 8,
      duration: prefersReducedMotion ? 0 : 0.25,
      ease: 'expo.out',
      onComplete: () => {
        el.style.visibility = 'hidden';
        el.style.pointerEvents = 'none';
      },
    });
  }
}, [isOpen]);
```

4. Add initial hidden state to the overlay div:
```tsx
<div
  ref={overlayRef}
  className="info-overlay"
  style={{ visibility: 'hidden', pointerEvents: 'none' }}
  ...
>
```

5. Update aria: `aria-hidden={!isOpen}`

- [ ] **Step 2: Refactor ProjectsOverlay with same pattern**

Apply the identical GSAP enter/exit pattern to `ProjectsOverlay.tsx`:

1. Remove `if (!isOpen) return null;`
2. Add `import gsap from 'gsap';`
3. Add the same `useEffect` watching `isOpen` with GSAP fromTo/to
4. Add `style={{ visibility: 'hidden', pointerEvents: 'none' }}` to the overlay div
5. Add `aria-hidden={!isOpen}`

- [ ] **Step 3: Update overlay CSS**

In `styles/index.css`, find the `.info-overlay` and `.projects-overlay` rules. Remove any existing CSS transitions on opacity/transform since GSAP now handles those. The overlays should NOT have `opacity: 0` in their base CSS — GSAP controls opacity.

Ensure base styles include:
```css
.info-overlay, .projects-overlay {
  opacity: 0;
}
```

GSAP will set initial opacity on mount.

- [ ] **Step 4: Build and verify**

Run: `npx vite build`
Expected: clean build

- [ ] **Step 5: Commit**

```bash
git add rlupo-portfolio/components/InfoOverlay.tsx rlupo-portfolio/components/ProjectsOverlay.tsx rlupo-portfolio/styles/index.css
git commit -m "feat: add GSAP enter/exit transitions to overlays"
```

---

### Task 5: Terminal line exit animation

**Files:**
- Modify: `rlupo-portfolio/components/CarouselSlide.tsx`

**Interfaces:**
- Consumes: existing `CarouselSlide` with `isActive` prop
- Produces: terminal lines animate out when slide becomes inactive

- [ ] **Step 1: Add exit animation to CarouselSlide**

Add `import gsap from 'gsap';` and a `useRef` for the terminal body. When `isActive` transitions from true to false, animate terminal lines out.

Add a ref to track previous active state:
```tsx
const wasActive = useRef(false);
const terminalRef = useRef<HTMLDivElement>(null);
```

Add a `useEffect` for exit animation:
```tsx
useEffect(() => {
  if (wasActive.current && !isActive && terminalRef.current) {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const lines = terminalRef.current.querySelectorAll('.terminal-line');
      gsap.to(lines, {
        opacity: 0,
        y: -4,
        duration: 0.2,
        ease: 'expo.out',
        stagger: 0.03,
      });
    }
  }
  wasActive.current = isActive;
}, [isActive]);
```

Add `ref={terminalRef}` to the `.terminal-body` wrapper div inside `TerminalPanel`, OR wrap the `<TerminalPanel>` call in a div with the ref. Since `TerminalPanel` is a separate component, the simplest approach is to add the ref to the `.carousel-slide-terminal` div in `CarouselSlide.tsx`:

```tsx
<div className="carousel-slide-terminal" ref={terminalRef}>
```

- [ ] **Step 2: Build and verify**

Run: `npx vite build`
Expected: clean build

- [ ] **Step 3: Commit**

```bash
git add rlupo-portfolio/components/CarouselSlide.tsx
git commit -m "feat: add terminal line exit animation on slide change"
```
