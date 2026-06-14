# Terminal Carousel Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the portfolio from a vertical-scroll layout into a horizontal project carousel with terminal/hacker aesthetic, Michelini-inspired structure, and Departure Mono typography.

**Architecture:** Replace Hero + CredentialStrip + ProjectList with a full-viewport horizontal Carousel (3 featured projects) + ArchiveList (6 remaining). Add an InfoOverlay for bio/skills/timeline. Restyle everything with olive + red-coral palette and Departure Mono. Carousel uses GSAP for slide transitions with pointer/keyboard/swipe navigation.

**Tech Stack:** React 19, GSAP 3, Lenis (vertical sections only), TypeScript, Departure Mono font, CSS custom properties

**Design Spec:** `docs/superpowers/specs/2026-06-14-terminal-carousel-redesign.md`
**Creative Vision:** `docs/superpowers/specs/2026-06-14-creative-vision.md`

---

## File Map

### New files
| File | Responsibility |
|------|---------------|
| `components/Carousel.tsx` | Full-viewport carousel container: renders 3 CarouselSlides, navigation controls (PREV/NEXT/dots), manages active index |
| `components/CarouselSlide.tsx` | Single slide: terminal panel left + image right, entry animations |
| `components/TerminalPanel.tsx` | Terminal readout: `$ cat` prompt, field labels/values, blinking cursor, `[ VISIT -> ]` button |
| `components/InfoOverlay.tsx` | Full-screen overlay: bio left, skills/timeline right, focus trap, ESC to close |
| `components/ArchiveList.tsx` | Secondary project list: P/04–P/09 rows with focus/dim hover |
| `hooks/useCarousel.ts` | Carousel state + input handling: active index, GSAP transitions, keyboard arrows, pointer swipe with velocity detection |

### Modified files
| File | What changes |
|------|-------------|
| `styles/index.css` | Replace entire color palette + typography variables. Remove hero/folio/credential/about CSS. Add carousel/terminal/overlay/archive CSS. Remove Cascadia Mono import. |
| `App.tsx` | Remove Hero, CredentialStrip, ProjectList imports. Add Carousel, ArchiveList, InfoOverlay. Pass `infoOpen` state to Header. |
| `Header.tsx` | Replace text links with bordered pill buttons `[ PROJECTS ]` `[ INFO ]`. Remove scroll-hide animation. Accept `onInfoClick` prop. Use Departure Mono. |
| `Preloader.tsx` | Restyle as terminal boot sequence with `INITIALIZING...` text, percentage counter, `READY.` with blinking cursor. Use Departure Mono. |
| `Footer.tsx` | Update fonts to Departure Mono. Update colophon. |
| `hooks/useLenis.ts` | No changes needed — Lenis handles vertical sections below carousel. |
| `hooks/useScrollAnimations.ts` | No changes needed — kept for ScrollTrigger cleanup. |

### Removed files
| File | Why |
|------|-----|
| `components/Hero.tsx` | No hero section in redesign |
| `components/CredentialStrip.tsx` | Credentials move to InfoOverlay |
| `components/ProjectList.tsx` | Replaced by Carousel + ArchiveList |
| `components/LineReveal.tsx` | Not used in new design |

### Dependency changes
| Action | Package | Why |
|--------|---------|-----|
| Remove | `@fontsource-variable/cascadia-mono` | Replaced by Departure Mono (self-hosted woff2) |

---

## Task 1: Update CSS — New Palette, Typography, Motion Tokens

**Files:**
- Modify: `styles/index.css:1-67` (variables block and imports)
- Modify: `package.json` (remove cascadia-mono dependency)

This task replaces the design tokens and cleans up the Cascadia Mono dependency. All subsequent tasks depend on these variables.

- [ ] **Step 1: Remove Cascadia Mono import and add new variables**

Replace the top of `styles/index.css` (lines 1–67):

```css
@font-face {
  font-family: 'Departure Mono';
  src: url('/fonts/DepartureMono-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

/* ============================================
   TREY LUPO PORTFOLIO — Terminal Carousel
   Olive + Red-Coral | Departure Mono
   ============================================ */

:root {
  /* --- Palette --- */
  --bg-primary: #474741;
  --bg-elevated: #55554D;
  --bg-surface: #3D3D38;
  --text-primary: #E3E4D5;
  --text-secondary: #A6A77E;
  --text-tertiary: #7A7A6E;
  --accent: #E85D3A;
  --accent-dim: #A6A77E;
  --border-subtle: rgba(227, 228, 213, 0.08);
  --border-default: rgba(227, 228, 213, 0.12);
  --border-emphasis: rgba(227, 228, 213, 0.20);

  /* --- Typography --- */
  --font-departure: 'Departure Mono', monospace;
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  /* --- Type Scale --- */
  --text-display: clamp(2rem, 5vw, 3rem);
  --text-h1: 2.25rem;
  --text-h2: 1.5rem;
  --text-body: 1rem;
  --text-body-sm: 0.875rem;
  --text-label: 0.75rem;
  --text-nav: 0.875rem;

  /* --- Spacing --- */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  --space-3xl: 4rem;
  --space-4xl: 6rem;
  --space-section: 8rem;
  --page-margin: max(1.5rem, calc((100vw - 1200px) / 2));
  --max-width: 1200px;

  /* --- Radii --- */
  --radius-sm: 2px;
  --radius-md: 4px;

  /* --- Motion (Emil Kowalski framework) --- */
  --duration-instant: 100ms;
  --duration-sm: 150ms;
  --duration-md: 200ms;
  --duration-lg: 350ms;
  --duration-reveal: 400ms;
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --stagger: 40ms;

  /* --- Z-index --- */
  --z-cursor: 9999;
  --z-overlay: 500;
  --z-nav: 100;
}
```

- [ ] **Step 2: Remove Cascadia Mono npm dependency**

Run:
```bash
cd rlupo-portfolio && npm uninstall @fontsource-variable/cascadia-mono
```

- [ ] **Step 3: Update body and base styles**

In `index.css`, update the body rule to remove references to old variables. The body font stays `var(--font-sans)`. The `::selection` background stays `var(--accent)`. No other base changes needed — the new variable names match the old ones where they overlap.

- [ ] **Step 4: Verify build**

Run:
```bash
cd rlupo-portfolio && npm run build
```

Expected: Clean build. Any CSS referencing removed variables (`--font-display`, `--font-editorial`, `--font-mono`, `--bg-void`, `--accent-subtle`, etc.) will still compile but render with fallbacks — those get cleaned up when their component CSS is replaced in later tasks.

- [ ] **Step 5: Commit**

```bash
git add styles/index.css package.json package-lock.json
git commit -m "chore: new palette + typography tokens, remove Cascadia Mono"
```

---

## Task 2: Carousel Hook — useCarousel

**Files:**
- Create: `hooks/useCarousel.ts`

This hook manages all carousel state and input. No DOM rendering — pure logic.

- [ ] **Step 1: Create useCarousel hook**

```typescript
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseCarouselOptions {
  totalSlides: number;
  transitionDuration?: number;
}

interface SwipeState {
  startX: number;
  startY: number;
  startTime: number;
  isDragging: boolean;
}

export const useCarousel = ({ totalSlides, transitionDuration = 350 }: UseCarouselOptions) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const swipeRef = useRef<SwipeState>({ startX: 0, startY: 0, startTime: 0, isDragging: false });
  const containerRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    const clamped = Math.max(0, Math.min(totalSlides - 1, index));
    if (clamped === activeIndex) return;
    setIsTransitioning(true);
    setActiveIndex(clamped);
    setTimeout(() => setIsTransitioning(false), transitionDuration);
  }, [activeIndex, isTransitioning, totalSlides, transitionDuration]);

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, prev]);

  // Pointer swipe with velocity detection
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    swipeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startTime: Date.now(),
      isDragging: true,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    const { startX, startTime, isDragging } = swipeRef.current;
    if (!isDragging) return;
    swipeRef.current.isDragging = false;

    const deltaX = e.clientX - startX;
    const elapsed = Date.now() - startTime;
    const velocity = Math.abs(deltaX) / elapsed;
    const SWIPE_THRESHOLD = 50;
    const VELOCITY_THRESHOLD = 0.11;

    if (Math.abs(deltaX) >= SWIPE_THRESHOLD || velocity > VELOCITY_THRESHOLD) {
      if (deltaX < 0) next();
      else prev();
    }
  }, [next, prev]);

  const onPointerCancel = useCallback(() => {
    swipeRef.current.isDragging = false;
  }, []);

  return {
    activeIndex,
    isTransitioning,
    isFirst: activeIndex === 0,
    isLast: activeIndex === totalSlides - 1,
    next,
    prev,
    goTo,
    containerRef,
    swipeHandlers: { onPointerDown, onPointerUp, onPointerCancel },
  };
};
```

- [ ] **Step 2: Verify build**

Run:
```bash
cd rlupo-portfolio && npm run build
```

Expected: Clean build. Hook is created but not imported anywhere yet — no errors.

- [ ] **Step 3: Commit**

```bash
git add hooks/useCarousel.ts
git commit -m "feat: add useCarousel hook — slide state, keyboard, swipe with velocity"
```

---

## Task 3: TerminalPanel Component

**Files:**
- Create: `components/TerminalPanel.tsx`

Renders the left-side terminal readout for a project. Pure presentational — no state management.

- [ ] **Step 1: Create TerminalPanel**

```tsx
import React from 'react';
import { Project } from '../types';
import TextScramble from './TextScramble';

interface TerminalPanelProps {
  project: Project;
  index: number;
  isActive: boolean;
}

const TerminalPanel: React.FC<TerminalPanelProps> = ({ project, index, isActive }) => {
  const url = project.githubUrl || project.liveUrl;

  return (
    <div className="terminal-panel">
      <div className="terminal-header">
        <span className="terminal-index">P/{String(index + 1).padStart(2, '0')}</span>
        <span className="terminal-epoch">{project.epoch}</span>
      </div>

      <div className={`terminal-body ${isActive ? 'terminal-body--active' : ''}`}>
        <div className="terminal-line terminal-prompt">
          $ cat {project.id} --verbose
        </div>

        <div className="terminal-line">
          <span className="terminal-label">TITLE:</span>
          <span className="terminal-value">
            {isActive ? (
              <TextScramble text={project.title} triggerOnView={false} triggerOnHover={false} duration={600} delay={0} />
            ) : project.title}
          </span>
        </div>

        <div className="terminal-line">
          <span className="terminal-label">CLASS:</span>
          <span className="terminal-value">{project.category}</span>
        </div>

        <div className="terminal-line">
          <span className="terminal-label">STATUS:</span>
          <span className="terminal-value">{project.featured ? 'production' : 'active'}</span>
        </div>

        <div className="terminal-line">
          <span className="terminal-label">METRIC:</span>
          <span className="terminal-value">{project.metric} {project.metricLabel}</span>
        </div>

        <div className="terminal-line terminal-description">
          <span className="terminal-caret">&gt; </span>
          {project.description}
        </div>

        <div className="terminal-line">
          <span className="terminal-label">STACK:</span>
          <span className="terminal-value">{project.stack.join(' / ')}</span>
        </div>
      </div>

      <div className="terminal-footer">
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="terminal-visit"
          >
            [ VISIT -&gt; ]
          </a>
        )}
        {isActive && <span className="cursor-blink" />}
      </div>
    </div>
  );
};

export default TerminalPanel;
```

- [ ] **Step 2: Add TerminalPanel CSS to index.css**

Append to `styles/index.css`:

```css
/* ============================================
   TERMINAL PANEL
   ============================================ */

.terminal-panel {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: var(--space-3xl) var(--space-2xl);
  font-family: var(--font-departure);
}

.terminal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2xl);
}

.terminal-index {
  font-size: var(--text-label);
  color: var(--accent);
  letter-spacing: 0.06em;
}

.terminal-epoch {
  font-size: var(--text-label);
  color: var(--accent-dim);
  letter-spacing: 0.06em;
}

.terminal-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.terminal-body--active .terminal-line {
  opacity: 0;
  transform: translateY(4px);
  animation: terminalLineIn var(--duration-sm) var(--ease-out) forwards;
}

.terminal-body--active .terminal-line:nth-child(1) { animation-delay: 0ms; }
.terminal-body--active .terminal-line:nth-child(2) { animation-delay: 40ms; }
.terminal-body--active .terminal-line:nth-child(3) { animation-delay: 80ms; }
.terminal-body--active .terminal-line:nth-child(4) { animation-delay: 120ms; }
.terminal-body--active .terminal-line:nth-child(5) { animation-delay: 160ms; }
.terminal-body--active .terminal-line:nth-child(6) { animation-delay: 200ms; }
.terminal-body--active .terminal-line:nth-child(7) { animation-delay: 240ms; }

@keyframes terminalLineIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.terminal-prompt {
  color: var(--accent-dim);
  margin-bottom: var(--space-md);
}

.terminal-label {
  color: var(--accent-dim);
  margin-right: var(--space-md);
  min-width: 7ch;
  display: inline-block;
}

.terminal-value {
  color: var(--text-primary);
}

.terminal-description {
  font-family: var(--font-sans);
  color: var(--text-primary);
  line-height: 1.6;
  margin: var(--space-md) 0;
  max-width: 45ch;
}

.terminal-caret {
  color: var(--accent-dim);
}

.terminal-footer {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  margin-top: var(--space-2xl);
}

.terminal-visit {
  font-family: var(--font-departure);
  font-size: var(--text-label);
  color: var(--accent);
  border: 1px solid var(--accent);
  padding: 0.5rem 1rem;
  letter-spacing: 0.06em;
  transition: background-color var(--duration-md) var(--ease-out),
              color var(--duration-md) var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .terminal-visit:hover {
    background-color: var(--accent);
    color: var(--bg-primary);
  }
}

.terminal-visit:active {
  transform: scale(0.97);
}

/* Blinking cursor */
.cursor-blink::after {
  content: '_';
  color: var(--accent);
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .terminal-body--active .terminal-line {
    opacity: 1;
    transform: none;
    animation: none;
  }
  .cursor-blink::after {
    animation: none;
  }
}
```

- [ ] **Step 3: Verify build**

Run: `cd rlupo-portfolio && npm run build`
Expected: Clean build.

- [ ] **Step 4: Commit**

```bash
git add components/TerminalPanel.tsx styles/index.css
git commit -m "feat: add TerminalPanel component — terminal readout for project data"
```

---

## Task 4: CarouselSlide Component

**Files:**
- Create: `components/CarouselSlide.tsx`

Single slide: TerminalPanel left, project image right with scanline overlay and clip-path reveal.

- [ ] **Step 1: Create CarouselSlide**

```tsx
import React from 'react';
import { Project } from '../types';
import TerminalPanel from './TerminalPanel';

interface CarouselSlideProps {
  project: Project;
  index: number;
  isActive: boolean;
}

const CarouselSlide: React.FC<CarouselSlideProps> = ({ project, index, isActive }) => {
  return (
    <div className={`carousel-slide ${isActive ? 'carousel-slide--active' : ''}`}>
      <div className="carousel-slide-terminal">
        <TerminalPanel project={project} index={index} isActive={isActive} />
      </div>

      <div className="carousel-slide-image scanlines">
        {project.imageUrl && (
          <img
            src={project.imageUrl}
            alt={`${project.title} project`}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        )}
      </div>
    </div>
  );
};

export default CarouselSlide;
```

- [ ] **Step 2: Add CarouselSlide + scanline CSS to index.css**

Append to `styles/index.css`:

```css
/* ============================================
   CAROUSEL SLIDE
   ============================================ */

.carousel-slide {
  display: grid;
  grid-template-columns: 45% 55%;
  width: 100vw;
  height: 100vh;
  flex-shrink: 0;
  overflow: hidden;
}

.carousel-slide-terminal {
  height: 100%;
  overflow: hidden;
}

.carousel-slide-image {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.carousel-slide-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Clip-path reveal on active */
.carousel-slide-image {
  clip-path: inset(0 100% 0 0);
  transition: clip-path var(--duration-reveal) var(--ease-out);
}

.carousel-slide--active .carousel-slide-image {
  clip-path: inset(0 0 0 0);
}

/* Scanline overlay */
.scanlines {
  position: relative;
}

.scanlines::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.04) 2px,
    rgba(0, 0, 0, 0.04) 4px
  );
  pointer-events: none;
  z-index: 1;
}

@media (max-width: 768px) {
  .carousel-slide {
    grid-template-columns: 1fr;
    grid-template-rows: 50vh 50vh;
  }
}

@media (prefers-reduced-motion: reduce) {
  .carousel-slide-image {
    clip-path: inset(0 0 0 0);
    transition: none;
  }
}
```

- [ ] **Step 3: Verify build**

Run: `cd rlupo-portfolio && npm run build`
Expected: Clean build.

- [ ] **Step 4: Commit**

```bash
git add components/CarouselSlide.tsx styles/index.css
git commit -m "feat: add CarouselSlide — split terminal/image layout with scanlines"
```

---

## Task 5: Carousel Container

**Files:**
- Create: `components/Carousel.tsx`

Assembles slides, renders navigation controls, wires up useCarousel hook.

- [ ] **Step 1: Create Carousel**

```tsx
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { FEATURED_PROJECTS } from '../constants';
import { useCarousel } from '../hooks/useCarousel';
import CarouselSlide from './CarouselSlide';

const Carousel: React.FC = () => {
  const {
    activeIndex,
    isFirst,
    isLast,
    next,
    prev,
    goTo,
    swipeHandlers,
  } = useCarousel({ totalSlides: FEATURED_PROJECTS.length });

  const trackRef = useRef<HTMLDivElement>(null);
  const prevIndex = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    gsap.to(track, {
      x: `-${activeIndex * 100}vw`,
      duration: 0.35,
      ease: 'power3.out',
    });

    prevIndex.current = activeIndex;
  }, [activeIndex]);

  return (
    <section className="carousel" id="projects" {...swipeHandlers}>
      <div className="carousel-track" ref={trackRef}>
        {FEATURED_PROJECTS.map((project, i) => (
          <CarouselSlide
            key={project.id}
            project={project}
            index={i}
            isActive={i === activeIndex}
          />
        ))}
      </div>

      <nav className="carousel-nav" aria-label="Project navigation">
        <button
          className="carousel-btn"
          onClick={prev}
          disabled={isFirst}
          aria-label="Previous project"
        >
          PREV
        </button>

        <div className="carousel-dots">
          {FEATURED_PROJECTS.map((_, i) => (
            <button
              key={i}
              className={`carousel-dot ${i === activeIndex ? 'carousel-dot--active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to project ${i + 1}`}
              aria-current={i === activeIndex ? 'true' : undefined}
            />
          ))}
        </div>

        <button
          className="carousel-btn"
          onClick={next}
          disabled={isLast}
          aria-label="Next project"
        >
          NEXT
        </button>
      </nav>
    </section>
  );
};

export default Carousel;
```

- [ ] **Step 2: Add Carousel CSS to index.css**

Append to `styles/index.css`:

```css
/* ============================================
   CAROUSEL CONTAINER
   ============================================ */

.carousel {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  touch-action: pan-y;
}

.carousel-track {
  display: flex;
  height: 100%;
  will-change: transform;
}

/* --- Navigation --- */
.carousel-nav {
  position: absolute;
  bottom: var(--space-2xl);
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xl);
  z-index: 10;
  padding: 0 var(--page-margin);
}

.carousel-btn {
  font-family: var(--font-departure);
  font-size: var(--text-label);
  color: var(--accent-dim);
  letter-spacing: 0.06em;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-sm) var(--space-md);
  transition: color var(--duration-md) var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .carousel-btn:hover:not(:disabled) {
    color: var(--text-primary);
  }
}

.carousel-btn:disabled {
  opacity: 0.2;
  cursor: default;
  pointer-events: none;
}

.carousel-btn:active:not(:disabled) {
  transform: scale(0.97);
}

.carousel-dots {
  display: flex;
  gap: var(--space-sm);
  align-items: center;
}

.carousel-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid var(--accent-dim);
  background: transparent;
  cursor: pointer;
  padding: 0;
  transition: background-color var(--duration-md) var(--ease-out),
              border-color var(--duration-md) var(--ease-out);
}

.carousel-dot--active {
  background-color: var(--accent);
  border-color: var(--accent);
}
```

- [ ] **Step 3: Verify build**

Run: `cd rlupo-portfolio && npm run build`
Expected: Clean build.

- [ ] **Step 4: Commit**

```bash
git add components/Carousel.tsx styles/index.css
git commit -m "feat: add Carousel container — GSAP transitions, nav controls"
```

---

## Task 6: ArchiveList Component

**Files:**
- Create: `components/ArchiveList.tsx`

Renders the 6 non-featured projects in a simple vertical list.

- [ ] **Step 1: Create ArchiveList**

```tsx
import React from 'react';
import { ALL_PROJECTS, FEATURED_PROJECTS } from '../constants';

const OFFSET = FEATURED_PROJECTS.length;

const ArchiveList: React.FC = () => {
  return (
    <section className="archive" id="archive">
      <h2 className="archive-header">ARCHIVE /2024–26</h2>

      <div className="archive-list">
        {ALL_PROJECTS.map((project, i) => {
          const url = project.githubUrl || project.liveUrl || '#';
          return (
            <a
              key={project.id}
              href={url}
              target={url !== '#' ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="archive-row"
            >
              <span className="archive-index">P/{String(OFFSET + i + 1).padStart(2, '0')}</span>
              <span className="archive-title">{project.title}</span>
              <span className="archive-category">{project.category}</span>
              <span className="archive-metric">{project.metric}</span>
              <span className="archive-arrow">-&gt;</span>
            </a>
          );
        })}
      </div>
    </section>
  );
};

export default ArchiveList;
```

- [ ] **Step 2: Add ArchiveList CSS to index.css**

Append to `styles/index.css`:

```css
/* ============================================
   ARCHIVE LIST
   ============================================ */

.archive {
  padding: var(--space-section) var(--page-margin);
}

.archive-header {
  font-family: var(--font-departure);
  font-size: var(--text-label);
  font-weight: 400;
  color: var(--accent-dim);
  letter-spacing: 0.1em;
  margin-bottom: var(--space-2xl);
}

.archive-list {
  display: flex;
  flex-direction: column;
}

.archive-row {
  display: grid;
  grid-template-columns: 4rem 1fr auto auto 2rem;
  align-items: center;
  gap: var(--space-lg);
  padding: var(--space-lg) 0;
  border-bottom: 1px solid var(--border-subtle);
  text-decoration: none;
  transition: opacity var(--duration-md) var(--ease-out),
              background-color var(--duration-md) var(--ease-out);
}

.archive-row:first-child {
  border-top: 1px solid var(--border-subtle);
}

/* Focus/dim: siblings dim on parent hover */
.archive-list:hover .archive-row {
  opacity: 0.4;
}

.archive-list:hover .archive-row:hover {
  opacity: 1;
  background-color: var(--bg-elevated);
}

.archive-row:active {
  transform: scale(0.99);
}

.archive-index {
  font-family: var(--font-departure);
  font-size: var(--text-label);
  color: var(--accent);
  letter-spacing: 0.06em;
}

.archive-title {
  font-family: var(--font-departure);
  font-size: var(--text-nav);
  color: var(--text-primary);
}

.archive-category {
  font-family: var(--font-departure);
  font-size: var(--text-label);
  color: var(--accent-dim);
  letter-spacing: 0.04em;
  text-align: right;
}

.archive-metric {
  font-family: var(--font-departure);
  font-size: var(--text-label);
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
  text-align: right;
}

.archive-arrow {
  font-family: var(--font-departure);
  font-size: var(--text-label);
  color: var(--accent-dim);
  transition: transform var(--duration-md) var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .archive-row:hover .archive-arrow {
    transform: translateX(4px);
  }
}

@media (max-width: 768px) {
  .archive-row {
    grid-template-columns: 3rem 1fr;
    gap: var(--space-sm);
  }
  .archive-category,
  .archive-metric {
    grid-column: 2;
    text-align: left;
  }
  .archive-arrow {
    display: none;
  }
}
```

- [ ] **Step 3: Verify build**

Run: `cd rlupo-portfolio && npm run build`
Expected: Clean build.

- [ ] **Step 4: Commit**

```bash
git add components/ArchiveList.tsx styles/index.css
git commit -m "feat: add ArchiveList — secondary project rows with focus/dim"
```

---

## Task 7: InfoOverlay Component

**Files:**
- Create: `components/InfoOverlay.tsx`

Full-screen overlay with bio, skills, and timeline. Includes focus trap and ESC handling.

- [ ] **Step 1: Create InfoOverlay**

```tsx
import React, { useEffect, useRef, useCallback } from 'react';
import { SKILL_GROUPS, TIMELINE } from '../constants';

interface InfoOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoOverlay: React.FC<InfoOverlayProps> = ({ isOpen, onClose }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();

    // Focus trap
    if (e.key === 'Tab' && overlayRef.current) {
      const focusable = overlayRef.current.querySelectorAll<HTMLElement>(
        'button, a[href], [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      returnRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => closeRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
      returnRef.current?.focus();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="info-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="About Trey Lupo"
    >
      <button
        ref={closeRef}
        className="info-close"
        onClick={onClose}
        aria-label="Close info"
      >
        [ CLOSE ]
      </button>

      <div className="info-content">
        <div className="info-bio">
          <h2 className="info-name">TREY LUPO</h2>
          <p className="info-title">AI/ML Systems Engineer</p>

          <p className="info-text">
            Corporate FP&A Analyst at Franklin Street in Tampa. I build Python SDKs
            that replace manual Oracle exports, ML frameworks in Rust that ship with
            statistical rigor, and revenue models that actually reconcile across
            business lines.
          </p>

          <p className="info-text">
            Background: B.A. Statistics from USF, MIT Data Science certificate, and
            an AI engineering internship at Origin Construction. I write code that
            ships to production, not notebooks that sit in repos.
          </p>

          <div className="info-credentials">
            <span>B.A. Statistics · USF</span>
            <span>MIT Data Science Certificate</span>
          </div>
        </div>

        <div className="info-terminal">
          <div className="info-section">
            <p className="info-prompt">$ skills --list</p>
            {SKILL_GROUPS.map((group) => (
              <div key={group.label} className="info-skill-row">
                <span className="info-skill-label">{group.label}</span>
                <span className="info-skill-value">{group.items.join(' / ')}</span>
              </div>
            ))}
          </div>

          <div className="info-section">
            <p className="info-prompt">$ history --career</p>
            {TIMELINE.map((entry) => (
              <div key={entry.year} className="info-timeline-row">
                <span className="info-timeline-year">{entry.year}</span>
                <span className="info-timeline-title">
                  {entry.title}
                  {entry.current && <span className="info-current"> &lt;- CURRENT</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoOverlay;
```

- [ ] **Step 2: Add InfoOverlay CSS to index.css**

Append to `styles/index.css`:

```css
/* ============================================
   INFO OVERLAY
   ============================================ */

.info-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-overlay);
  background-color: rgba(71, 71, 65, 0.98);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  animation: overlayIn var(--duration-md) var(--ease-out);
}

@keyframes overlayIn {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.info-close {
  position: fixed;
  top: var(--space-lg);
  right: var(--page-margin);
  font-family: var(--font-departure);
  font-size: var(--text-label);
  color: var(--accent);
  border: 1px solid var(--accent);
  background: transparent;
  padding: 0.5rem 1rem;
  letter-spacing: 0.06em;
  cursor: pointer;
  z-index: 1;
  transition: background-color var(--duration-md) var(--ease-out),
              color var(--duration-md) var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .info-close:hover {
    background-color: var(--accent);
    color: var(--bg-primary);
  }
}

.info-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4xl);
  padding: calc(64px + var(--space-3xl)) var(--page-margin) var(--space-3xl);
  max-width: var(--max-width);
  margin: 0 auto;
  width: 100%;
}

.info-name {
  font-family: var(--font-departure);
  font-size: var(--text-display);
  font-weight: 400;
  color: var(--accent);
  letter-spacing: 0.04em;
  line-height: 1;
  margin-bottom: var(--space-sm);
}

.info-title {
  font-family: var(--font-departure);
  font-size: var(--text-nav);
  color: var(--text-primary);
  margin-bottom: var(--space-2xl);
}

.info-text {
  font-family: var(--font-sans);
  font-size: var(--text-body);
  color: var(--text-primary);
  line-height: 1.6;
  max-width: 50ch;
  margin-bottom: var(--space-lg);
}

.info-credentials {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  margin-top: var(--space-xl);
  font-family: var(--font-departure);
  font-size: var(--text-label);
  color: var(--accent-dim);
  letter-spacing: 0.04em;
}

.info-terminal {
  display: flex;
  flex-direction: column;
  gap: var(--space-3xl);
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.info-prompt {
  font-family: var(--font-departure);
  font-size: var(--text-label);
  color: var(--accent-dim);
  margin-bottom: var(--space-md);
}

.info-skill-row {
  display: flex;
  gap: var(--space-xl);
  font-family: var(--font-departure);
  font-size: var(--text-label);
  line-height: 1.8;
}

.info-skill-label {
  color: var(--accent-dim);
  min-width: 12ch;
  letter-spacing: 0.04em;
}

.info-skill-value {
  color: var(--text-primary);
}

.info-timeline-row {
  display: flex;
  gap: var(--space-xl);
  font-family: var(--font-departure);
  font-size: var(--text-label);
  line-height: 1.8;
}

.info-timeline-year {
  color: var(--accent-dim);
  min-width: 10ch;
}

.info-timeline-title {
  color: var(--text-primary);
}

.info-current {
  color: var(--accent);
}

@media (max-width: 768px) {
  .info-content {
    grid-template-columns: 1fr;
    gap: var(--space-2xl);
  }
}

@media (prefers-reduced-motion: reduce) {
  .info-overlay {
    animation: none;
  }
}
```

- [ ] **Step 3: Verify build**

Run: `cd rlupo-portfolio && npm run build`
Expected: Clean build.

- [ ] **Step 4: Commit**

```bash
git add components/InfoOverlay.tsx styles/index.css
git commit -m "feat: add InfoOverlay — full-screen bio/skills/timeline with focus trap"
```

---

## Task 8: Restyle Header — Bordered Pill Buttons

**Files:**
- Modify: `components/Header.tsx`
- Modify: `styles/index.css` (header section)

Redesign nav: wordmark left, `[ PROJECTS ]` + `[ INFO ]` pill buttons right. Remove scroll-hide animation.

- [ ] **Step 1: Rewrite Header component**

Replace the entire contents of `components/Header.tsx`:

```tsx
import React, { useState, useEffect } from 'react';
import TextScramble from './TextScramble';

interface HeaderProps {
  onInfoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onInfoClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const handleNavClick = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="header">
        <a href="#projects" className="header-name">
          <TextScramble text="TREY LUPO" triggerOnView={false} triggerOnHover={true} duration={600} />
        </a>

        <nav className="header-nav">
          <a href="#projects" className="header-pill">PROJECTS</a>
          <button className="header-pill" onClick={onInfoClick}>INFO</button>
        </nav>

        <button
          className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </header>

      <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          <a href="#projects" onClick={handleNavClick}>PROJECTS</a>
          <button onClick={() => { handleNavClick(); onInfoClick(); }}>INFO</button>
        </nav>
      </div>
    </>
  );
};

export default Header;
```

- [ ] **Step 2: Replace header CSS in index.css**

Find the `/* ----- HEADER ----- */` section and replace it (from `.header {` through the hamburger media query) with:

```css
/* ----- HEADER ----- */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-nav);
  height: 64px;
  padding: 0 var(--page-margin);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(71, 71, 65, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-subtle);
}

.header-name {
  font-family: var(--font-departure);
  font-size: var(--text-nav);
  font-weight: 400;
  letter-spacing: 0.1em;
  color: var(--text-primary);
}

.header-nav {
  display: flex;
  gap: var(--space-md);
}

.header-pill {
  font-family: var(--font-departure);
  font-size: var(--text-label);
  font-weight: 400;
  letter-spacing: 0.06em;
  color: var(--accent);
  border: 1px solid var(--accent);
  background: transparent;
  padding: 0.4rem 1rem;
  cursor: pointer;
  transition: background-color var(--duration-md) var(--ease-out),
              color var(--duration-md) var(--ease-out);
  text-decoration: none;
}

@media (hover: hover) and (pointer: fine) {
  .header-pill:hover {
    background-color: var(--accent);
    color: var(--bg-primary);
  }
}

.header-pill:active {
  transform: scale(0.97);
}

.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  cursor: pointer;
}

.hamburger-line {
  width: 24px;
  height: 1.5px;
  background-color: var(--text-primary);
  transition: transform var(--duration-md) var(--ease-out), opacity var(--duration-md) var(--ease-out);
}

.hamburger.open .hamburger-line:nth-child(1) {
  transform: translateY(3.75px) rotate(45deg);
}

.hamburger.open .hamburger-line:nth-child(2) {
  transform: translateY(-3.75px) rotate(-45deg);
}

@media (max-width: 768px) {
  .header-nav { display: none; }
  .hamburger { display: flex; }
}
```

- [ ] **Step 3: Verify build**

Run: `cd rlupo-portfolio && npm run build`
Expected: Clean build.

- [ ] **Step 4: Commit**

```bash
git add components/Header.tsx styles/index.css
git commit -m "feat: redesign Header — bordered pill buttons, backdrop blur, no scroll-hide"
```

---

## Task 9: Restyle Preloader — Terminal Boot Sequence

**Files:**
- Modify: `components/Preloader.tsx`

Restyle as terminal boot: `INITIALIZING...` text, percentage counter in Departure Mono, `READY.` with blinking cursor.

- [ ] **Step 1: Rewrite Preloader**

Replace the entire contents of `components/Preloader.tsx`:

```tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';

const BOOT_DURATION = 2400;
const HOLD_DURATION = 400;
const FADE_DURATION = 300;

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [line1] = useState('INITIALIZING...');
  const [counter, setCounter] = useState('0%');
  const [showReady, setShowReady] = useState(false);
  const [phase, setPhase] = useState<'booting' | 'ready' | 'fading' | 'done'>('booting');
  const frameRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  const finishBoot = useCallback(() => {
    setShowReady(true);
    setPhase('ready');
    setTimeout(() => {
      setPhase('fading');
      setTimeout(() => {
        document.documentElement.style.overflow = '';
        setPhase('done');
        onComplete();
      }, FADE_DURATION);
    }, HOLD_DURATION);
  }, [onComplete]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('done');
      onComplete();
      return;
    }

    document.documentElement.style.overflow = 'hidden';
    startRef.current = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / BOOT_DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCounter(`${Math.floor(eased * 100)}%`);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        finishBoot();
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      document.documentElement.style.overflow = '';
    };
  }, [finishBoot, onComplete]);

  if (phase === 'done') return null;

  return (
    <div
      className="preloader"
      style={{ opacity: phase === 'fading' ? 0 : 1 }}
      aria-hidden="true"
    >
      <div className="preloader-terminal">
        <span className="preloader-line">{line1}</span>
        <span className="preloader-line preloader-counter">{counter}</span>
        {showReady && (
          <span className="preloader-line preloader-ready">
            READY.<span className="cursor-blink" />
          </span>
        )}
      </div>
    </div>
  );
};

export default Preloader;
```

- [ ] **Step 2: Replace preloader CSS in index.css**

Find the `/* PRELOADER */` section and replace it with:

```css
/* ============================================
   PRELOADER
   ============================================ */

.preloader {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background-color: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity var(--duration-md) var(--ease-out);
}

.preloader-terminal {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-sm);
}

.preloader-line {
  font-family: var(--font-departure);
  font-size: 14px;
  color: var(--accent-dim);
  letter-spacing: 0.06em;
}

.preloader-counter {
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.preloader-ready {
  color: var(--accent);
}
```

- [ ] **Step 3: Verify build**

Run: `cd rlupo-portfolio && npm run build`
Expected: Clean build.

- [ ] **Step 4: Commit**

```bash
git add components/Preloader.tsx styles/index.css
git commit -m "feat: restyle Preloader as terminal boot sequence"
```

---

## Task 10: Restyle Footer

**Files:**
- Modify: `components/Footer.tsx`

Update typography to Departure Mono and update the colophon font list.

- [ ] **Step 1: Update Footer component**

Replace the entire contents of `components/Footer.tsx`:

```tsx
import React, { useState } from 'react';
import { PERSONAL_INFO } from '../constants';

const Footer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleEmailClick = async () => {
    try {
      await navigator.clipboard.writeText(PERSONAL_INFO.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${PERSONAL_INFO.email}`;
    }
  };

  return (
    <footer className="footer" id="contact">
      <div className="footer-statement">
        Let's build something.
      </div>

      <div className="footer-grid">
        <div className="footer-col">
          <button
            className="footer-email"
            onClick={handleEmailClick}
            type="button"
            aria-live="polite"
          >
            {copied ? 'copied!' : PERSONAL_INFO.email}
          </button>
        </div>

        <div className="footer-col">
          <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
          <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a>
          <a href={PERSONAL_INFO.huggingface} target="_blank" rel="noopener noreferrer" className="footer-link">HuggingFace</a>
        </div>
      </div>

      <div className="footer-colophon">
        <span className="footer-label">Design + Development · Trey Lupo</span>
        <span className="footer-label">Fonts · Departure Mono · Inter</span>
        <span className="footer-label">&copy;2026 Tampa, FL</span>
      </div>
    </footer>
  );
};

export default Footer;
```

- [ ] **Step 2: Update footer CSS in index.css**

Find the `/* ----- FOOTER ----- */` section and replace `.footer-statement` font-family and the email/link styles:

```css
.footer-statement {
  font-family: var(--font-departure);
  font-size: var(--text-display);
  font-weight: 400;
  line-height: 1.0;
  letter-spacing: 0.02em;
  color: var(--text-primary);
  max-width: 20ch;
  margin-bottom: var(--space-4xl);
}

.footer-email {
  font-family: var(--font-departure);
  font-size: var(--text-nav);
  color: var(--accent);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color var(--duration-sm) var(--ease-out);
}

.footer-email:hover { color: var(--text-primary); }

.footer-link {
  font-family: var(--font-departure);
  font-size: var(--text-label);
  color: var(--accent-dim);
  letter-spacing: 0.06em;
  transition: color var(--duration-sm) var(--ease-out);
}

.footer-link:hover { color: var(--text-primary); }

.footer-label {
  font-family: var(--font-departure);
  font-size: var(--text-label);
  color: var(--text-tertiary);
  letter-spacing: 0.04em;
}
```

- [ ] **Step 3: Verify build**

Run: `cd rlupo-portfolio && npm run build`
Expected: Clean build.

- [ ] **Step 4: Commit**

```bash
git add components/Footer.tsx styles/index.css
git commit -m "feat: restyle Footer with Departure Mono"
```

---

## Task 11: Wire Up App.tsx — Assemble the New Layout

**Files:**
- Modify: `App.tsx`

Remove old components, add new ones, wire up InfoOverlay state.

- [ ] **Step 1: Rewrite App.tsx**

Replace the entire contents of `App.tsx`:

```tsx
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Carousel from './components/Carousel';
import ArchiveList from './components/ArchiveList';
import Footer from './components/Footer';
import InfoOverlay from './components/InfoOverlay';
import Cursor from './components/Cursor';
import Preloader from './components/Preloader';
import { useLenis } from './hooks/useLenis';
import { useScrollAnimations } from './hooks/useScrollAnimations';
import './styles/index.css';

const App: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const onPreloaderComplete = useCallback(() => setLoaded(true), []);

  useLenis(loaded && !infoOpen);
  useScrollAnimations();

  return (
    <>
      <Preloader onComplete={onPreloaderComplete} />
      <Cursor />
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <div className={`site-content ${loaded ? 'site-content--visible' : ''}`}>
        <Header onInfoClick={() => setInfoOpen(true)} />
        <main id="main-content" className="main">
          <Carousel />
          <ArchiveList />
        </main>
        <Footer />
      </div>
      <InfoOverlay isOpen={infoOpen} onClose={() => setInfoOpen(false)} />
    </>
  );
};

export default App;
```

- [ ] **Step 2: Verify build**

Run: `cd rlupo-portfolio && npm run build`
Expected: Clean build. Old component imports are gone. New components are wired.

- [ ] **Step 3: Commit**

```bash
git add App.tsx
git commit -m "feat: wire new layout — Carousel + ArchiveList + InfoOverlay"
```

---

## Task 12: Remove Old Components + Clean Up CSS

**Files:**
- Delete: `components/Hero.tsx`
- Delete: `components/CredentialStrip.tsx`
- Delete: `components/ProjectList.tsx`
- Delete: `components/LineReveal.tsx`
- Modify: `styles/index.css` (remove old component CSS)

- [ ] **Step 1: Delete old component files**

```bash
cd rlupo-portfolio
rm components/Hero.tsx components/CredentialStrip.tsx components/ProjectList.tsx components/LineReveal.tsx
```

- [ ] **Step 2: Remove old CSS sections from index.css**

Remove the following CSS sections from `index.css`:
- Everything under `/* ----- HERO ----- */` (`.hero`, `.hero-content`, `.hero-name`, `.hero-folio-label`, `.hero-descriptor`, `.btn-primary`, `.hero-cta-wrap`)
- Everything under `/* ----- FOLIO ----- */` (`.folio`, `.folio-header`, `.folio-list`, `.folio-entry`, `.folio-*`, `.folio-preview*`, and their responsive rules)
- Everything under `/* ----- CREDENTIAL STRIP ----- */` (`.credential-*`, `@keyframes marquee`, its reduced-motion rule)
- Everything under `/* ----- LINE-MASK REVEALS ----- */` (`.sr-line`)
- Everything under `/* ----- ABOUT ----- */` (`.about`, `.about-*`, `.skill-*`, `.timeline-*`, and their responsive rules)
- Old nav link styles (`.nav-link`, `.nav-link--accent`) since Header now uses `.header-pill`
- Old typography variables no longer used: `--font-display`, `--font-editorial`, `--font-mono`, `--text-hero`, `--text-mono-label`, `--text-mono-nav`
- Old color variables no longer used: `--bg-void`, `--accent-subtle`, `--easing`, `--easing-decel`

Also remove the hero-specific responsive rules under `@media (max-width: 768px)` (`.hero`, `.hero-folio-label`).

- [ ] **Step 3: Verify build**

Run: `cd rlupo-portfolio && npm run build`
Expected: Clean build with no warnings about missing components.

- [ ] **Step 4: Start dev server and smoke test**

Run: `cd rlupo-portfolio && npm run dev`

Verify in browser:
- Preloader shows terminal boot sequence with Departure Mono
- Page loads directly to carousel (no hero)
- Carousel shows 3 slides with terminal panel left, image right
- PREV/NEXT and dots work
- Keyboard arrows work
- Archive list renders below carousel
- [ INFO ] opens overlay, ESC closes it
- Footer shows updated fonts
- Olive background, red-coral accents throughout

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove Hero, CredentialStrip, ProjectList, LineReveal + clean CSS"
```

---

## Task 13: Mobile Responsive Pass

**Files:**
- Modify: `styles/index.css` (responsive rules)

Ensure carousel, archive list, header, and overlay work on mobile.

- [ ] **Step 1: Update mobile responsive rules**

Find the `@media (max-width: 768px)` section at the bottom and replace the hero/cursor rules with carousel-aware rules:

```css
@media (max-width: 768px) {
  :root {
    --space-section: 100px;
  }

  .cursor {
    display: none;
  }

  body.custom-cursor-active,
  body.custom-cursor-active a,
  body.custom-cursor-active button {
    cursor: auto;
  }

  /* Mobile nav overlay text */
  .mobile-nav a,
  .mobile-nav button {
    font-family: var(--font-departure);
    font-size: var(--text-nav);
    color: var(--text-primary);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    background: none;
    border: none;
    cursor: pointer;
  }
}
```

The individual component responsive rules (carousel-slide grid, archive-row grid, info-content grid, footer-grid) are already inline with their component CSS from earlier tasks.

- [ ] **Step 2: Test at mobile viewport**

Open browser DevTools, toggle to a 375px wide viewport. Verify:
- Carousel slides stack vertically (terminal above, image below)
- Archive list wraps category/metric below title
- Info overlay is single column and scrollable
- Hamburger menu works
- Nav pills are hidden, hamburger shows

- [ ] **Step 3: Commit**

```bash
git add styles/index.css
git commit -m "chore: mobile responsive cleanup for carousel layout"
```

---

## Task 14: Reduced Motion + Accessibility Audit

**Files:**
- Modify: `styles/index.css` (reduced motion section)

- [ ] **Step 1: Update reduced motion styles**

Replace the `@media (prefers-reduced-motion: reduce)` block at the end of `index.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  .carousel-slide-image {
    clip-path: inset(0 0 0 0) !important;
  }

  .terminal-body--active .terminal-line {
    opacity: 1 !important;
    transform: none !important;
  }

  .cursor {
    display: none !important;
  }
}
```

- [ ] **Step 2: Verify keyboard navigation**

Using the dev server, test:
- Tab through all interactive elements (nav pills, PREV/NEXT, carousel dots, archive links, footer links)
- All focused elements have visible `outline: 2px solid var(--accent)`
- Info overlay traps focus
- ESC closes overlay and returns focus to INFO button
- Arrow keys navigate carousel slides

- [ ] **Step 3: Commit**

```bash
git add styles/index.css
git commit -m "chore: reduced motion + keyboard accessibility audit"
```

---

## Summary

| Task | What it builds | Depends on |
|------|---------------|------------|
| 1 | CSS tokens (palette, typography, motion) | — |
| 2 | useCarousel hook | — |
| 3 | TerminalPanel component | Task 1 (CSS vars) |
| 4 | CarouselSlide component | Tasks 1, 3 |
| 5 | Carousel container | Tasks 1, 2, 4 |
| 6 | ArchiveList component | Task 1 |
| 7 | InfoOverlay component | Task 1 |
| 8 | Header redesign | Task 1 |
| 9 | Preloader restyle | Task 1 |
| 10 | Footer restyle | Task 1 |
| 11 | App.tsx assembly | Tasks 5, 6, 7, 8, 9, 10 |
| 12 | Remove old components + CSS cleanup | Task 11 |
| 13 | Mobile responsive | Task 12 |
| 14 | Accessibility audit | Task 13 |
