# Award-Tier Polish — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate the portfolio from "well-built" to "award-tier" with cinematic slide transitions, line-mask text reveals, a continuous progress element, and coordinated image choreography.

**Architecture:** All changes are within existing components. No new routes, no new pages. The transition system in Carousel.tsx becomes a GSAP timeline instead of a single tween. A new `SplitReveal` utility component handles line-mask reveals. A `SlideProgress` component renders a persistent progress indicator across all slides.

**Tech Stack:** React 19, GSAP 3.14, TypeScript, CSS custom properties

## Global Constraints

- GSAP for all JS-driven animations — no CSS `@keyframes` for transitions
- Reduced motion guards (`window.matchMedia('(prefers-reduced-motion: reduce)')`) on ALL new animations
- No new npm dependencies (GSAP SplitText is a Club plugin — we build a manual line splitter instead)
- All files in `rlupo-portfolio/`
- Departure Mono font for all terminal/UI text, Inter for body
- Existing color tokens: `--accent` (#E85D3A), `--text-primary` (#E3E4D5), `--text-secondary` (#A6A77E), `--text-tertiary` (#7A7A6E), `--bg-primary` (#474741)
- Duration vocabulary: `0.2–0.35s` for background/overlay, `0.3–0.5s` for content, `0.05–0.1s` stagger between children
- Mobile breakpoint at 768px — all new features must work or degrade gracefully

## Parallelization Map

```
WAVE 1 (fully parallel — no file conflicts):
  ├── Task 1: SplitReveal utility component [NEW FILE]
  ├── Task 2: SlideProgress component [NEW FILE]
  └── Task 3: Resume PDF placeholder [NEW FILE in public/]

WAVE 2 (parallel — touches different files):
  ├── Task 4: Line-mask reveals on HeroSlide [HeroSlide.tsx]
  ├── Task 5: Asymmetric easing + parabola blur [Carousel.tsx, useCarousel.ts]
  └── Task 6: SlideProgress integration [Carousel.tsx — AFTER Task 5]

WAVE 3 (sequential — builds on Wave 2):
  └── Task 7: Image reveal choreography [CarouselSlide.tsx, index.css]

WAVE 4 (verification):
  └── Task 8: Full browser verification at 3 viewports
```

Tasks 4 and 5 touch different files and can run in parallel. Task 6 modifies Carousel.tsx AFTER Task 5, so it must be sequential. Task 7 touches CarouselSlide.tsx which Task 5 does NOT touch, but it depends on the transition timing from Task 5.

---

### Task 1: Create SplitReveal utility component

**Files:**
- Create: `rlupo-portfolio/components/SplitReveal.tsx`

**Interfaces:**
- Consumes: nothing
- Produces: `SplitReveal` component with props `{ text: string, as?: 'div' | 'span' | 'h1' | 'h2', className?: string, trigger: boolean, delay?: number, duration?: number, stagger?: number }`

This is a manual replacement for GSAP's Club-only SplitText plugin. It splits text into lines wrapped in `overflow: hidden` containers, then animates each line's inner element from `yPercent: 105` to `yPercent: 0` with expo.out easing.

- [ ] **Step 1: Create SplitReveal.tsx**

```tsx
import React, { useRef, useEffect, useMemo } from 'react';
import gsap from 'gsap';

interface SplitRevealProps {
  text: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  trigger: boolean;
  delay?: number;
  duration?: number;
  stagger?: number;
}

const SplitReveal: React.FC<SplitRevealProps> = ({
  text,
  as: Tag = 'div',
  className = '',
  trigger,
  delay = 0,
  duration = 0.8,
  stagger = 0.08,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const words = useMemo(() => text.split(' '), [text]);

  useEffect(() => {
    if (!trigger || !containerRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const inners = containerRef.current.querySelectorAll('.split-reveal-inner');
    gsap.fromTo(inners,
      { yPercent: 105 },
      {
        yPercent: 0,
        duration,
        ease: 'expo.out',
        stagger,
        delay,
      }
    );
  }, [trigger, delay, duration, stagger]);

  return (
    <Tag className={`split-reveal ${className}`} ref={containerRef as any}>
      {words.map((word, i) => (
        <span key={i} className="split-reveal-word">
          <span className="split-reveal-inner">{word}</span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </Tag>
  );
};

export default SplitReveal;
```

The technique: each word is wrapped in a `span.split-reveal-word` with `overflow: hidden`. Inside is a `span.split-reveal-inner` that starts translated 105% down (fully hidden below the clip) and animates up to 0% (fully visible). The result is a word-by-word reveal from below — the signature Awwwards motion pattern.

We use word-level splitting (not character or line) because:
1. No need for DOM measurement to detect line breaks (which SplitText does)
2. Words are semantically meaningful units
3. On mobile with wrapping, each word still reveals cleanly
4. Stagger across ~8-10 words at 0.08s creates a 0.6-0.8s cascade — same visual as line reveals

- [ ] **Step 2: Add CSS for SplitReveal**

Add before the `/* CURSOR */` section in `styles/index.css`:

```css
/* --- Split Reveal --- */
.split-reveal {
  display: inline;
}

.split-reveal-word {
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
}

.split-reveal-inner {
  display: inline-block;
  will-change: transform;
}
```

- [ ] **Step 3: Verify types compile**

Run: `npx tsc --noEmit`
Expected: clean

- [ ] **Step 4: Commit**

```bash
git add rlupo-portfolio/components/SplitReveal.tsx rlupo-portfolio/styles/index.css
git commit -m "feat: add SplitReveal component for word-mask text animations"
```

---

### Task 2: Create SlideProgress component

**Files:**
- Create: `rlupo-portfolio/components/SlideProgress.tsx`

**Interfaces:**
- Consumes: `activeIndex: number`, `totalSlides: number`
- Produces: `SlideProgress` component — a thin horizontal progress bar at the bottom of the viewport that fills proportionally to `activeIndex / (totalSlides - 1)`, plus a small slide counter label

This is the "continuous element across slides" from the research — it persists during transitions, giving the user a physical sense of location in the carousel. It sits above the carousel, NOT inside individual slides.

- [ ] **Step 1: Create SlideProgress.tsx**

```tsx
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface SlideProgressProps {
  activeIndex: number;
  totalSlides: number;
}

const SlideProgress: React.FC<SlideProgressProps> = ({ activeIndex, totalSlides }) => {
  const barRef = useRef<HTMLDivElement>(null);
  const progress = totalSlides > 1 ? activeIndex / (totalSlides - 1) : 0;

  useEffect(() => {
    if (!barRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gsap.to(barRef.current, {
      scaleX: progress,
      duration: prefersReducedMotion ? 0 : 0.5,
      ease: 'expo.out',
    });
  }, [progress]);

  return (
    <div className="slide-progress" aria-hidden="true">
      <div className="slide-progress-track">
        <div className="slide-progress-bar" ref={barRef} />
      </div>
    </div>
  );
};

export default SlideProgress;
```

- [ ] **Step 2: Add CSS for SlideProgress**

Add before the `/* CURSOR */` section in `styles/index.css`:

```css
/* --- Slide Progress --- */
.slide-progress {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: var(--z-nav);
  padding: 0;
  pointer-events: none;
}

.slide-progress-track {
  width: 100%;
  height: 2px;
  background: var(--border-subtle);
}

.slide-progress-bar {
  width: 100%;
  height: 100%;
  background: var(--accent);
  transform-origin: left;
  transform: scaleX(0);
}
```

- [ ] **Step 3: Verify types compile**

Run: `npx tsc --noEmit`
Expected: clean

- [ ] **Step 4: Commit**

```bash
git add rlupo-portfolio/components/SlideProgress.tsx rlupo-portfolio/styles/index.css
git commit -m "feat: add SlideProgress bar component for carousel position"
```

---

### Task 3: Add resume PDF placeholder

**Files:**
- Create: `rlupo-portfolio/public/resume.pdf`

**Interfaces:**
- Consumes: nothing
- Produces: a valid PDF at `/resume.pdf` so the existing link in InfoOverlay doesn't 404

- [ ] **Step 1: Generate a minimal placeholder PDF**

Use a simple script to create a one-page PDF with the text "Resume — Trey Lupo — treylupo.com — placeholder, replace with actual resume":

```bash
cd rlupo-portfolio/public
cat > /tmp/resume-placeholder.html << 'HTMLEOF'
<html><body style="font-family:monospace;padding:40px;color:#474741">
<h1>TREY LUPO</h1>
<p>AI/ML Systems Engineer</p>
<p style="color:#999;margin-top:40px">This is a placeholder. Replace with your actual resume PDF.</p>
<p>treylupo.com</p>
</body></html>
HTMLEOF
```

Use Chrome headless or `wkhtmltopdf` if available, otherwise create a minimal text file renamed to .pdf as a temporary placeholder. The important thing is the file EXISTS so the link doesn't 404.

Alternative if no PDF tool available — create a simple text-based placeholder:

```bash
echo "%PDF-1.0
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>
endobj
xref
0 4
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
trailer
<< /Size 4 /Root 1 0 R >>
startxref
206
%%EOF" > resume.pdf
```

- [ ] **Step 2: Verify the file serves**

Run: start dev server, navigate to `http://localhost:3001/resume.pdf`
Expected: browser opens/downloads the PDF without a 404

- [ ] **Step 3: Commit**

```bash
git add rlupo-portfolio/public/resume.pdf
git commit -m "feat: add placeholder resume PDF to fix dead link"
```

---

### Task 4: Line-mask reveals on HeroSlide

**Files:**
- Modify: `rlupo-portfolio/components/HeroSlide.tsx`

**Interfaces:**
- Consumes: `SplitReveal` component from Task 1
- Produces: Hero name "TREY LUPO" uses word-mask reveal animation instead of simple opacity fade

**Dependencies:** Task 1 must be complete (SplitReveal component exists)

- [ ] **Step 1: Replace GlitchName opacity fade with SplitReveal + PowerGlitch**

The current `GlitchName` component wraps the text in a div and applies PowerGlitch. We need to:

1. Keep PowerGlitch (the periodic glitch effect)
2. Add SplitReveal for the initial entrance (word-mask reveal)
3. The entrance animation fires once on first `isActive`, then PowerGlitch takes over

Modify `HeroSlide.tsx`:

Replace the GSAP `fromTo` on `children` (the current staggered opacity entrance) with a more choreographed sequence:

```tsx
import SplitReveal from './SplitReveal';
```

Replace the hero-content entrance animation. Instead of animating all children uniformly with `y: 12, opacity: 0`, use:

1. `SplitReveal` on the hero name with `trigger={isActive}` and `delay={0.1}`
2. Keep GSAP `fromTo` on tagline, bio, creds with `y: 8, opacity: 0` but with staggered delays: tagline at 0.4s, bio at 0.55s, creds at 0.7s

The key change: the hero name gets a PHYSICAL reveal (word-mask, sliding up from below a clip) while the supporting text gets a softer fade-translate. This hierarchy signals what matters.

Update the JSX in the hero-content div:

```tsx
<div className="hero-content" ref={contentRef}>
  <SplitReveal
    text="TREY LUPO"
    as="div"
    className="hero-name"
    trigger={isActive && !hasAnimated.current}
    delay={0.1}
    duration={0.8}
    stagger={0.12}
  />
  <div className="hero-tagline" ref={taglineRef}>
    $ whoami — <span>AI/ML Systems Engineer</span>
  </div>
  <p className="hero-bio" ref={bioRef}>
    Corporate FP&A Analyst at Franklin Street. I build Python SDKs that replace
    manual Oracle exports, ML frameworks in Rust, and revenue models that reconcile.
  </p>
  <div className="hero-creds" ref={credsRef}>
    <span><span className="hero-label">EDU </span>B.A. Statistics · USF</span>
    <span><span className="hero-label">CERT </span>MIT Data Science</span>
    <span><span className="hero-label">LANG </span>Python / Rust / TypeScript / SQL</span>
  </div>
</div>
```

Add individual refs for tagline, bio, creds and animate them with staggered delays in the useEffect:

```tsx
const taglineRef = useRef<HTMLDivElement>(null);
const bioRef = useRef<HTMLParagraphElement>(null);
const credsRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (!isActive || hasAnimated.current) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    hasAnimated.current = true;
    return;
  }
  hasAnimated.current = true;

  const elements = [taglineRef.current, bioRef.current, credsRef.current].filter(Boolean);
  gsap.fromTo(elements,
    { y: 8, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out', stagger: 0.15, delay: 0.4 }
  );
}, [isActive]);
```

**Note on PowerGlitch integration:** The original `GlitchName` component used PowerGlitch which rearranges the DOM. Since SplitReveal also creates wrapper elements, we need to either:
- Apply PowerGlitch to the outer `.hero-name` container AFTER the SplitReveal has rendered
- OR keep PowerGlitch on a separate element and layer them

The simplest approach: remove PowerGlitch from the hero name. The SplitReveal word-mask entrance is a stronger, more intentional effect. PowerGlitch was a timer-based periodic effect — it fires every 5 seconds regardless of user action. The SplitReveal fires once on entrance, which is more aligned with the "invisible frame" design philosophy (animation serves purpose, not decoration).

If the user wants to keep PowerGlitch, it can be re-added in a future task by wrapping the entire SplitReveal output.

- [ ] **Step 2: Verify types compile and build succeeds**

Run: `npx tsc --noEmit && npx vite build`
Expected: clean

- [ ] **Step 3: Commit**

```bash
git add rlupo-portfolio/components/HeroSlide.tsx
git commit -m "feat: word-mask reveal on hero name, staggered supporting text entrance"
```

---

### Task 5: Asymmetric easing + parabola blur on slide transitions

**Files:**
- Modify: `rlupo-portfolio/components/Carousel.tsx`
- Modify: `rlupo-portfolio/styles/index.css`

**Interfaces:**
- Consumes: existing carousel track tween in Carousel.tsx
- Produces: asymmetric easing (outgoing slides use `power2.in`, incoming use `expo.out`), subtle CSS blur peak at transition midpoint

This is the single biggest visual upgrade. The current transition is one `gsap.to` that moves the track with uniform `expo.out`. We need to replace it with a GSAP timeline that:
1. Creates a progress variable (0→1) for the transition
2. Moves the track based on progress
3. Applies a parabola-shaped blur: `blur = 4 * progress * (1 - progress) * MAX_BLUR` where MAX_BLUR is 2-3px

- [ ] **Step 1: Replace the track tween with a timeline**

In `Carousel.tsx`, replace the existing `gsap.to(track, ...)` in the `useEffect`:

```tsx
useEffect(() => {
  const track = trackRef.current;
  if (!track) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const delta = Math.abs(activeIndex - prevIndex.current);
  const isWrap = delta > 1;

  if (prefersReducedMotion || isWrap) {
    gsap.set(track, { x: `-${activeIndex * 100}vw`, filter: 'blur(0px)' });
    prevIndex.current = activeIndex;
    return;
  }

  const progress = { value: 0 };
  const targetX = activeIndex * 100;
  const startX = prevIndex.current * 100;

  gsap.to(progress, {
    value: 1,
    duration: 0.6,
    ease: 'power2.inOut',
    onUpdate: () => {
      const p = progress.value;
      const x = startX + (targetX - startX) * p;
      const blur = 4 * p * (1 - p) * 2.5;
      track.style.transform = `translateX(-${x}vw)`;
      track.style.filter = blur > 0.1 ? `blur(${blur}px)` : 'none';
    },
    onComplete: () => {
      track.style.filter = 'none';
    },
  });

  if (prevIndex.current !== activeIndex && sectionRef.current) {
    sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  prevIndex.current = activeIndex;
}, [activeIndex]);
```

Key design decisions:
- `power2.inOut` for the master progress gives asymmetric feel: outgoing content accelerates away (first half = `power2.in`), incoming content decelerates in (second half = `power2.out`)
- Duration increased from 0.5s to 0.6s — slightly slower creates more cinematic feel
- `MAX_BLUR = 2.5px` — subtle enough to feel like motion blur, not a bug
- Direct DOM writes (`track.style.transform`) via `onUpdate` instead of GSAP's built-in `x` — avoids React reconciliation jank at high frame rates
- Blur is cleared to `'none'` on complete to avoid sub-pixel rendering artifacts

- [ ] **Step 2: Add will-change hint for blur performance**

In `styles/index.css`, update `.carousel-track`:

```css
.carousel-track {
  display: flex;
  height: 100%;
  will-change: transform, filter;
}
```

- [ ] **Step 3: Build and verify**

Run: `npx vite build`
Expected: clean build

- [ ] **Step 4: Commit**

```bash
git add rlupo-portfolio/components/Carousel.tsx rlupo-portfolio/styles/index.css
git commit -m "feat: asymmetric easing + parabola blur on slide transitions"
```

---

### Task 6: Integrate SlideProgress into Carousel

**Files:**
- Modify: `rlupo-portfolio/components/Carousel.tsx`

**Interfaces:**
- Consumes: `SlideProgress` component from Task 2, `activeIndex` and `totalSlides` from existing carousel state
- Produces: persistent progress bar at bottom of viewport during carousel navigation

**Dependencies:** Task 2 (SlideProgress component) and Task 5 (Carousel.tsx changes) must be complete

- [ ] **Step 1: Add SlideProgress to Carousel.tsx**

Import and render `SlideProgress` outside the carousel-track div but inside the carousel section:

```tsx
import SlideProgress from './SlideProgress';
```

Add after the `.carousel-track` closing `</div>`, before the closing `</section>`:

```tsx
<SlideProgress activeIndex={activeIndex} totalSlides={CAROUSEL_PROJECTS.length + 2} />
```

- [ ] **Step 2: Verify build**

Run: `npx vite build`
Expected: clean

- [ ] **Step 3: Commit**

```bash
git add rlupo-portfolio/components/Carousel.tsx
git commit -m "feat: add persistent slide progress bar to carousel"
```

---

### Task 7: Image reveal choreography

**Files:**
- Modify: `rlupo-portfolio/components/CarouselSlide.tsx`
- Modify: `rlupo-portfolio/styles/index.css`

**Interfaces:**
- Consumes: existing `isActive` prop and image clip-path reveal in CarouselSlide
- Produces: coordinated reveal where terminal lines start first (existing), then image wipes in 100ms later with a subtle parallax offset

**Dependencies:** Task 5 must be complete (transition timing established)

- [ ] **Step 1: Convert image reveal from CSS transition to GSAP for precise timing**

Currently, `.carousel-slide-image` uses a CSS `clip-path` transition that fires immediately when `.carousel-slide--active` is added. We need GSAP control so we can delay it 100ms after terminal lines start.

In `CarouselSlide.tsx`, add a ref for the image container and a GSAP tween:

```tsx
const imageRef = useRef<HTMLDivElement>(null);
```

Add to the existing `isActive` effect:

```tsx
useEffect(() => {
  if (isActive && imageRef.current) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(imageRef.current, { clipPath: 'inset(0 0 0 0)', x: 0 });
      return;
    }
    gsap.fromTo(imageRef.current,
      { clipPath: 'inset(0 100% 0 0)', x: 20 },
      {
        clipPath: 'inset(0 0% 0 0)',
        x: 0,
        duration: 0.5,
        ease: 'expo.out',
        delay: 0.1,
      }
    );
  }
}, [isActive]);
```

Add `ref={imageRef}` to the `.carousel-slide-image` div.

The `x: 20` start value creates a subtle parallax — the image slides 20px left while the clip-path reveals it, creating the "sliding into place" effect from award-tier portfolios.

- [ ] **Step 2: Remove CSS clip-path transition**

In `styles/index.css`, update `.carousel-slide-image` to remove the CSS transition since GSAP now handles it:

```css
.carousel-slide-image {
  grid-column: 2;
  grid-row: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-2xl);
  overflow: hidden;
  clip-path: inset(0 100% 0 0);
}
```

Remove the `.carousel-slide--active .carousel-slide-image` rule entirely — GSAP handles the reveal.

- [ ] **Step 3: Build and verify**

Run: `npx vite build`
Expected: clean

- [ ] **Step 4: Commit**

```bash
git add rlupo-portfolio/components/CarouselSlide.tsx rlupo-portfolio/styles/index.css
git commit -m "feat: GSAP image reveal with parallax offset and delayed entrance"
```

---

### Task 8: Full browser verification

**Files:**
- No file changes — verification only

**Interfaces:**
- Consumes: all changes from Tasks 1-7
- Produces: verification report confirming all features work at 3 viewports

- [ ] **Step 1: Desktop verification (1440x900)**

Navigate to `http://localhost:3001`. Verify:
1. Hero slide: "TREY LUPO" reveals with word-mask animation (words slide up from below clip), supporting text fades in after
2. Click NEXT: slide transition has subtle blur peak at midpoint, asymmetric easing (accelerate out, decelerate in)
3. Project images reveal with clip-path wipe + slight parallax (20px drift)
4. Terminal lines stagger in after slide arrives, stagger out when leaving
5. Progress bar at bottom fills proportionally as you navigate through slides
6. Navigate to last slide (Activity Log) — progress bar at 100%
7. Open Info overlay — smooth GSAP enter, click Close — smooth GSAP exit
8. Open Projects overlay — same smooth transitions

- [ ] **Step 2: Tablet verification (1024x768)**

Resize to 1024x768. Verify:
1. Two-column layout preserved
2. Progress bar visible
3. All animations play smoothly
4. Reduced page-indent (3.5rem) looks correct

- [ ] **Step 3: Mobile verification (375x812)**

Resize to 375x812. Verify:
1. Hero name word-mask reveal works (words wrap and still reveal cleanly)
2. No images shown (hidden on mobile)
3. Progress bar visible
4. Footer stacked correctly (flex-direction: column)
5. Transitions work without blur artifacts on mobile
6. Activity log entries reflow to 2-column grid

- [ ] **Step 4: Reduced motion verification**

Enable `prefers-reduced-motion: reduce` in DevTools. Verify:
1. No GSAP animations fire
2. All content is immediately visible
3. Slide transitions are instant (duration: 0)
4. No blur effects

- [ ] **Step 5: Report results**

Create a verification report noting any issues found. If all pass, mark complete.

---

## Meta-Harness: Autonomous Execution Strategy

### Execution Model

This plan is designed for SDD (Subagent-Driven Development) with wave-based parallelization:

```
WAVE 1: Dispatch Tasks 1, 2, 3 simultaneously (3 parallel agents)
  → All create NEW files, zero conflict risk
  → Review all 3 in parallel after completion

WAVE 2: Dispatch Tasks 4 and 5 simultaneously (2 parallel agents)
  → Task 4 touches HeroSlide.tsx only
  → Task 5 touches Carousel.tsx + index.css only
  → No file overlap — safe to parallelize
  → Review both in parallel

WAVE 3: Dispatch Task 6 (sequential — depends on Task 5's Carousel.tsx)
  → Small change, fast execution
  → Review

WAVE 4: Dispatch Task 7 (sequential — depends on Task 5's timing)
  → Touches CarouselSlide.tsx + index.css
  → Review

WAVE 5: Dispatch Task 8 (browser verification agent)
  → Full visual QA
```

### Agent Model Selection

| Task | Model | Rationale |
|------|-------|-----------|
| 1 (SplitReveal) | sonnet | New component, needs judgment on animation patterns |
| 2 (SlideProgress) | haiku | Small mechanical component, spec is complete |
| 3 (Resume PDF) | haiku | File creation, trivial |
| 4 (Hero reveals) | sonnet | Integration work, needs to handle PowerGlitch removal |
| 5 (Easing + blur) | sonnet | Core animation logic, timing-sensitive |
| 6 (Progress integration) | haiku | One import + one JSX line |
| 7 (Image choreography) | sonnet | GSAP timing coordination, CSS removal |
| 8 (Verification) | agent-browser | Visual QA, screenshot comparison |

### Estimated Wall-Clock Time

- Wave 1: ~3 minutes (3 parallel agents)
- Wave 1 review: ~2 minutes (3 parallel reviewers)
- Wave 2: ~4 minutes (2 parallel agents)
- Wave 2 review: ~2 minutes (2 parallel reviewers)
- Wave 3: ~2 minutes
- Wave 4: ~3 minutes
- Wave 5: ~3 minutes
- **Total: ~19 minutes** with maximal parallelization vs. ~35 minutes sequential

### Recovery Strategy

If any task fails:
1. Check the progress ledger at `.superpowers/sdd/progress.md`
2. Resume from the first incomplete task
3. Tasks within the same wave can be re-dispatched independently
4. Cross-wave dependencies mean: if Task 5 fails, Tasks 6 and 7 are blocked
