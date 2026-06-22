# Hero Slide + Portfolio Polish — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a hero slide with ASCII grid background + PowerGlitch on name, make the carousel loop, fix deploy blockers, add resume link, analytics, and sitemap.

**Architecture:** Hero is carousel slide index 0 with a full-width layout variant. Canvas-based ASCII grid renders behind content. PowerGlitch runs on a stable DOM ref for the name element. Carousel wrapping uses instant-jump GSAP for wrap transitions. All work stays on the `redesign/invisible-frame` branch.

**Tech Stack:** React 19, GSAP, Canvas 2D API, PowerGlitch (~2KB), @vercel/analytics, Vite

**Spec:** `docs/superpowers/specs/2026-06-22-hero-and-polish-design.md`

---

## Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install new dependencies and remove OGL**

```bash
cd rlupo-portfolio && npm install powerglitch @vercel/analytics && npm uninstall ogl
```

- [ ] **Step 2: Verify build still works**

```bash
npm run build
```

Expected: `vite build` succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add powerglitch + vercel analytics, remove ogl"
```

---

## Task 2: Carousel Looping (useCarousel + CarouselSlide)

**Files:**
- Modify: `hooks/useCarousel.ts:21-31,73-77`
- Modify: `components/CarouselSlide.tsx:9-10,68-74`
- Modify: `components/Carousel.tsx:34-38`

- [ ] **Step 1: Modify `useCarousel.ts` — wrapping next/prev, remove isFirst/isLast**

Replace `hooks/useCarousel.ts` lines 21-31 (the `goTo`, `next`, `prev` functions):

```typescript
const goTo = useCallback((index: number) => {
  if (isTransitioning) return;
  const clamped = Math.max(0, Math.min(totalSlides - 1, index));
  if (clamped === activeIndex) return;
  setIsTransitioning(true);
  setActiveIndex(clamped);
  setTimeout(() => setIsTransitioning(false), transitionDuration);
}, [activeIndex, isTransitioning, totalSlides, transitionDuration]);

const next = useCallback(() => {
  if (isTransitioning) return;
  setIsTransitioning(true);
  setActiveIndex(prev => prev === totalSlides - 1 ? 0 : prev + 1);
  setTimeout(() => setIsTransitioning(false), transitionDuration);
}, [isTransitioning, totalSlides, transitionDuration]);

const prev = useCallback(() => {
  if (isTransitioning) return;
  setIsTransitioning(true);
  setActiveIndex(prev => prev === 0 ? totalSlides - 1 : prev - 1);
  setTimeout(() => setIsTransitioning(false), transitionDuration);
}, [isTransitioning, totalSlides, transitionDuration]);
```

Replace `hooks/useCarousel.ts` lines 73-77 (return object) — remove `isFirst` and `isLast`:

```typescript
return {
  activeIndex,
  isTransitioning,
  next,
  prev,
  goTo,
  containerRef,
  swipeHandlers: { onPointerDown, onPointerUp, onPointerCancel },
};
```

- [ ] **Step 2: Modify `Carousel.tsx` — GSAP wrap transition**

Replace `Carousel.tsx` lines 33-45 (the activeIndex useEffect):

```typescript
useEffect(() => {
  const track = trackRef.current;
  if (!track) return;

  const delta = Math.abs(activeIndex - prevIndex.current);
  const isWrap = delta > 1;

  gsap.to(track, {
    x: `-${activeIndex * 100}vw`,
    duration: isWrap ? 0 : 0.35,
    ease: 'power3.out',
  });

  if (prevIndex.current !== activeIndex && sectionRef.current) {
    sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  prevIndex.current = activeIndex;
}, [activeIndex]);
```

- [ ] **Step 3: Update `CarouselSlide.tsx` — remove isFirst/isLast props, update counter**

Remove `isFirst` and `isLast` from the `CarouselSlideProps` interface (lines 9-10). Remove them from the destructured props (line 20). Remove `disabled={isFirst}` and `disabled={isLast}` from the nav buttons (lines 68, 74).

Update the counter display (line 72):

```typescript
<span className="carousel-counter">
  {String(activeIndex).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
</span>
```

Update the Carousel.tsx usage to stop passing `isFirst`/`isLast` to `CarouselSlide` (line 58-59 — remove those two props).

- [ ] **Step 4: Verify carousel wrapping works**

```bash
npm run dev
```

Open browser, navigate to last slide with arrow keys, press right arrow — should jump instantly to slide 0. Press left on slide 0 — should jump instantly to last slide. Counter shows `00 / 09` through `08 / 09`.

- [ ] **Step 5: Commit**

```bash
git add hooks/useCarousel.ts components/Carousel.tsx components/CarouselSlide.tsx
git commit -m "feat: carousel looping with instant-jump GSAP wrap transitions"
```

---

## Task 3: AsciiGrid Component

**Files:**
- Create: `components/AsciiGrid.tsx`

- [ ] **Step 1: Create `components/AsciiGrid.tsx`**

```tsx
import React, { useRef, useEffect, useCallback } from 'react';

interface AsciiGridProps {
  isActive: boolean;
}

const CHARS = '.·:+*#@%&';
const CELL = 18;
const INFLUENCE_RADIUS = 200;

const BG = '#474741';
const DIM = '#55554D';
const MID = '#7A7A6E';
const BRIGHT = '#A6A77E';
const ACCENT = '#E85D3A';

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

const AsciiGrid: React.FC<AsciiGridProps> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const gridRef = useRef<number[]>([]);
  const dimsRef = useRef({ cols: 0, rows: 0 });

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const cols = Math.ceil(canvas.width / CELL);
    const rows = Math.ceil(canvas.height / CELL);
    dimsRef.current = { cols, rows };
    gridRef.current = new Array(cols * rows).fill(0);
  }, []);

  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [resize]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    if (!isActive) {
      cancelAnimationFrame(frameRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = (time: number) => {
      const { cols, rows } = dimsRef.current;
      const grid = gridRef.current;
      const mouse = mouseRef.current;

      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${CELL - 4}px 'Courier New', monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = x * CELL + CELL / 2;
          const py = y * CELL + CELL / 2;
          const dx = px - mouse.x;
          const dy = py - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const proximity = Math.max(0, 1 - dist / INFLUENCE_RADIUS);
          const eased = proximity * proximity * proximity;
          const idx = x + y * cols;
          grid[idx] = lerp(grid[idx], eased, 0.12);
          const val = grid[idx];
          const wave = Math.sin(time * 0.001 + x * 0.15 + y * 0.1) * 0.5 + 0.5;
          const intensity = Math.min(1, val + wave * 0.15 * 0.3);
          if (intensity < 0.05) continue;
          const charIdx = Math.floor(intensity * (CHARS.length - 1));

          if (val > 0.7) ctx.fillStyle = ACCENT;
          else if (val > 0.3) ctx.fillStyle = BRIGHT;
          else if (intensity > 0.15) ctx.fillStyle = MID;
          else ctx.fillStyle = DIM;

          ctx.globalAlpha = Math.min(1, intensity * 1.5 + 0.1);
          ctx.fillText(CHARS[charIdx], px, py);
        }
      }
      ctx.globalAlpha = 1;
      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      aria-hidden="true"
    />
  );
};

export default React.memo(AsciiGrid);
```

- [ ] **Step 2: Commit**

```bash
git add components/AsciiGrid.tsx
git commit -m "feat: AsciiGrid canvas component with mouse-reactive characters"
```

---

## Task 4: HeroSlide Component

**Files:**
- Create: `components/HeroSlide.tsx`
- Modify: `styles/index.css`

- [ ] **Step 1: Create `components/HeroSlide.tsx`**

```tsx
import React, { useRef, useEffect } from 'react';
import { PowerGlitch } from 'powerglitch';
import AsciiGrid from './AsciiGrid';

interface HeroSlideProps {
  isActive: boolean;
  onPrev: () => void;
  onNext: () => void;
  activeIndex: number;
  totalSlides: number;
}

const GlitchName: React.FC = React.memo(() => {
  const nameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!nameRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const { stopGlitch } = PowerGlitch.glitch(nameRef.current, {
      playMode: 'always',
      createContainers: true,
      hideOverflow: false,
      timing: { duration: 5000, iterations: Infinity },
      glitchTimeSpan: { start: 0.85, end: 0.95 },
      shake: { velocity: 15, amplitudeX: 0.2, amplitudeY: 0.1 },
      slice: {
        count: 6,
        velocity: 15,
        minHeight: 0.02,
        maxHeight: 0.15,
        hueRotate: true,
        cssFilters: '',
      },
      pulse: false,
    });

    return () => stopGlitch();
  }, []);

  return (
    <div ref={nameRef} className="hero-name">
      TREY LUPO
    </div>
  );
});

GlitchName.displayName = 'GlitchName';

const HeroSlide: React.FC<HeroSlideProps> = ({
  isActive,
  onPrev,
  onNext,
  activeIndex,
  totalSlides,
}) => {
  return (
    <div className={`carousel-slide carousel-slide--hero ${isActive ? 'carousel-slide--active' : ''}`}>
      <AsciiGrid isActive={isActive} />

      <div className="hero-content">
        <GlitchName />
        <div className="hero-tagline">
          $ whoami — <span>AI/ML Systems Engineer</span>
        </div>
        <p className="hero-bio">
          Corporate FP&A Analyst at Franklin Street. I build Python SDKs that replace
          manual Oracle exports, ML frameworks in Rust, and revenue models that reconcile.
        </p>
        <div className="hero-creds">
          <span><span className="hero-label">EDU </span>B.A. Statistics · USF</span>
          <span><span className="hero-label">CERT </span>MIT Data Science</span>
          <span><span className="hero-label">LANG </span>Python / Rust / TypeScript / SQL</span>
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

export default HeroSlide;
```

- [ ] **Step 2: Add hero styles to `styles/index.css`**

Add after the existing `.carousel-slide--no-image` block (around line 357):

```css
/* --- Hero Slide --- */
.carousel-slide--hero {
  grid-template-columns: 1fr;
  grid-template-rows: 1fr auto;
  position: relative;
}

.hero-content {
  position: relative;
  z-index: 1;
  grid-column: 1;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 0 var(--space-lg) 7rem;
  pointer-events: none;
}

.hero-name {
  font-family: var(--font-departure);
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 400;
  letter-spacing: 0.04em;
  color: var(--accent);
  line-height: 1;
  margin-bottom: var(--space-sm);
  pointer-events: auto;
}

.hero-tagline {
  font-family: var(--font-departure);
  font-size: var(--text-nav);
  color: var(--text-secondary);
  letter-spacing: 0.06em;
  margin-bottom: var(--space-lg);
}

.hero-tagline span { color: var(--text-primary); }

.hero-bio {
  font-family: var(--font-sans);
  font-size: var(--text-body);
  color: var(--text-primary);
  line-height: 1.6;
  max-width: 45ch;
  margin-bottom: var(--space-xl);
}

.hero-creds {
  display: flex;
  gap: var(--space-xl);
  font-family: var(--font-departure);
  font-size: var(--text-label);
  color: var(--text-secondary);
  letter-spacing: 0.04em;
}

.hero-label { color: var(--text-tertiary); }

@media (max-width: 768px) {
  .hero-content {
    padding: 0 var(--space-xl) var(--space-lg) var(--space-xl);
  }

  .hero-creds {
    flex-direction: column;
    gap: var(--space-xs);
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add components/HeroSlide.tsx styles/index.css
git commit -m "feat: HeroSlide component with PowerGlitch name + hero CSS"
```

---

## Task 5: Wire Hero into Carousel + Fix ProjectsOverlay

**Files:**
- Modify: `components/Carousel.tsx`
- Modify: `components/ProjectsOverlay.tsx:51-54,87`

- [ ] **Step 1: Modify `Carousel.tsx` to render HeroSlide at index 0**

Add import at top:

```typescript
import HeroSlide from './HeroSlide';
```

Change `totalSlides` in the `useCarousel` call (line 21):

```typescript
const {
  activeIndex,
  next,
  prev,
  goTo,
  swipeHandlers,
} = useCarousel({ totalSlides: CAROUSEL_PROJECTS.length + 1 });
```

(Also remove `isFirst` and `isLast` from the destructured return since they no longer exist.)

Update the carousel track children (lines 49-64) to render HeroSlide first:

```tsx
<div className="carousel-track" ref={trackRef}>
  <HeroSlide
    isActive={activeIndex === 0}
    onPrev={prev}
    onNext={next}
    activeIndex={activeIndex}
    totalSlides={CAROUSEL_PROJECTS.length + 1}
  />
  {CAROUSEL_PROJECTS.map((project, i) => (
    <CarouselSlide
      key={project.id}
      project={project}
      index={i}
      isActive={i + 1 === activeIndex}
      onPrev={prev}
      onNext={next}
      activeIndex={activeIndex}
      totalSlides={CAROUSEL_PROJECTS.length + 1}
    />
  ))}
</div>
```

- [ ] **Step 2: Fix ProjectsOverlay index shift**

In `components/ProjectsOverlay.tsx`, update `handleRowClick` (line 51-54):

```typescript
const handleRowClick = (index: number) => {
  onGoToSlide(index + 1);
  onClose();
};
```

- [ ] **Step 3: Verify hero + projects + overlay all work**

```bash
npm run dev
```

Check: hero renders at slide 0 with ASCII grid, NEXT goes to project slide 1, ProjectsOverlay rows jump to correct slides (P/01 goes to carousel index 1), wrapping works in both directions.

- [ ] **Step 4: Commit**

```bash
git add components/Carousel.tsx components/ProjectsOverlay.tsx
git commit -m "feat: wire hero slide into carousel, fix overlay index offset"
```

---

## Task 6: Deploy Blockers (index.html + touch icon)

**Files:**
- Modify: `index.html:15,42-44,48,63`
- Create: `public/apple-touch-icon.png`

- [ ] **Step 1: Fix `index.html` meta tags and fonts**

Fix theme color (line 15):

```html
<meta name="theme-color" content="#474741" />
```

Fix JSON-LD `sameAs` array (lines 51-54) and `knowsAbout` (line 55):

```html
"sameAs": [
  "https://github.com/robertlupo1997",
  "https://www.linkedin.com/in/robertlupo1997/",
  "https://huggingface.co/spaces/robertlupo1997"
],
"knowsAbout": ["Financial Analysis", "Data Science", "Machine Learning", "Python", "Rust", "TypeScript", "SQL"]
```

Replace the Google Fonts link (line 63):

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap" rel="stylesheet" />
```

Add sitemap link (after the canonical URL link, line 33):

```html
<link rel="sitemap" type="application/xml" href="/sitemap.xml" />
```

- [ ] **Step 2: Generate apple-touch-icon**

```bash
cd rlupo-portfolio && npx sharp-cli -i public/favicon.svg -o public/apple-touch-icon.png resize 180 180 2>/dev/null || convert public/favicon.svg -resize 180x180 public/apple-touch-icon.png 2>/dev/null || echo "Manual step: create 180x180 PNG from favicon.svg"
```

If neither tool works, create a simple placeholder:

```bash
node -e "
const sharp = require('sharp');
sharp('public/favicon.svg').resize(180, 180).png().toFile('public/apple-touch-icon.png').then(() => console.log('done'));
"
```

- [ ] **Step 3: Commit**

```bash
git add index.html public/apple-touch-icon.png
git commit -m "fix: deploy blockers — theme color, structured data, dead fonts, touch icon"
```

---

## Task 7: Sitemap

**Files:**
- Create: `public/sitemap.xml`

- [ ] **Step 1: Create `public/sitemap.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://treylupo.com/</loc>
    <priority>1.0</priority>
  </url>
</urlset>
```

- [ ] **Step 2: Commit**

```bash
git add public/sitemap.xml
git commit -m "feat: add sitemap.xml"
```

---

## Task 8: Resume Link in InfoOverlay

**Files:**
- Modify: `components/InfoOverlay.tsx:140-143`
- Modify: `styles/index.css` (info-contact-links section)

- [ ] **Step 1: Add resume link to InfoOverlay**

In `components/InfoOverlay.tsx`, add a resume link inside the `.info-contact-links` div (after line 143, after the HuggingFace link):

```tsx
<div className="info-contact-links">
  <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer">GitHub</a>
  <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
  <a href={PERSONAL_INFO.huggingface} target="_blank" rel="noopener noreferrer">HuggingFace</a>
  <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="info-resume-link">Resume</a>
</div>
```

- [ ] **Step 2: Add resume link style to `styles/index.css`**

Add after the `.info-contact-links a:hover` rule (around line 725):

```css
.info-resume-link {
  border: 1px solid var(--accent);
  padding: 0.3rem 0.8rem;
  color: var(--accent) !important;
  transition: background-color var(--duration-md) var(--ease-out),
              color var(--duration-md) var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .info-resume-link:hover {
    background-color: var(--accent);
    color: var(--bg-primary) !important;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add components/InfoOverlay.tsx styles/index.css
git commit -m "feat: add resume PDF link in info overlay"
```

---

## Task 9: Vercel Analytics

**Files:**
- Modify: `index.tsx`

- [ ] **Step 1: Add Analytics to `index.tsx`**

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>
);
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add index.tsx
git commit -m "feat: add Vercel Analytics"
```

---

## Task 10: Final Verification

- [ ] **Step 1: Full build check**

```bash
npm run build
```

Expected: Clean build, no errors, no warnings.

- [ ] **Step 2: Dev server smoke test**

```bash
npm run dev
```

Check all of the following:
- Hero slide renders at index 0 with ASCII grid reacting to mouse
- PowerGlitch fires on "TREY LUPO" every ~5 seconds
- NEXT from hero goes to project slide 1
- PREV from slide 1 goes back to hero
- Last project slide NEXT wraps to hero (instant, no pan)
- Hero PREV wraps to last project (instant, no pan)
- ProjectsOverlay rows jump to correct slides
- InfoOverlay shows resume link
- Counter shows `00 / 10` on hero, `01 / 10` on first project
- Mobile layout (resize to 375px): hero content stacks, credentials wrap, hamburger menu works

- [ ] **Step 3: Reduced motion check**

In browser DevTools, enable `prefers-reduced-motion: reduce`. Verify:
- ASCII grid still renders but animations are suppressed (CSS block)
- PowerGlitch does NOT run (JS guard)
- Carousel still navigates

- [ ] **Step 4: Commit any final adjustments, then tag**

```bash
git add -A
git commit -m "chore: final polish and verification"
```
