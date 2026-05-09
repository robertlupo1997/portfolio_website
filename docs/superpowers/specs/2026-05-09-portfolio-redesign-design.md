# Portfolio Redesign — Design Spec
**Date:** 2026-05-09
**Status:** Approved

---

## Overview

Redesign treylupo.com from a generic project-card portfolio into a typography-driven, narrative site that tells the story: "FP&A analyst who builds production tools with AI." Remove FluidGlass (not original work) and TREY.ML logo (domain mismatch). Add award-site animation patterns that serve the hire-me narrative.

## Audience

1. Technical hiring managers at AI/ML-adjacent companies
2. Finance/fintech hiring managers who need the FP&A + engineering bridge
3. Open source community arriving from GitHub

## Tech Stack (unchanged)

- React 19 + Vite + TypeScript
- GSAP + ScrollTrigger (animation)
- Lenis (smooth scroll)
- Deployed on Vercel at treylupo.com

---

## Sections (top to bottom)

### 1. Page Loader
- CSS overlay that sweeps off-screen on load
- Under 1 second total duration
- Hero content starts at `opacity: 0`, fades in after loader exits

### 2. Navigation
- Sticky top bar, always visible on desktop (no auto-collapse)
- Left: `PROJECTS` / `ABOUT` / `BLOG ↗`
- Center: `TREY LUPO` wordmark (Inter 800, `letter-spacing: 0.15em`)
- Right: `GET IN TOUCH` button (amber border, magnetic effect) + theme toggle
- Mobile: hamburger (3 lines) → full-screen overlay with large animated links
- Scrollspy: active section highlighted in nav via IntersectionObserver

### 3. Hero
- Full viewport, dark background (`#0A0A0B`), no shader/canvas
- **Hook line** (Inter 800, `clamp(2rem, 5vw, 3.8rem)`, `letter-spacing: -0.03em`):
  `"FP&A Analyst."` in amber, `"Builds production tools with AI."` in white
  - Scroll-triggered line reveal animation (GSAP SplitText, word-by-word)
- **Name**: `TREY LUPO` below hook (Inter 700, `letter-spacing: 0.2em`, `--text-secondary`)
  - Text scramble on hover (alpha-only charset)
- **Ghost name**: Large `TREY LUPO` at ~8% opacity, rotated vertical on right edge (desktop only)
- **Status line** (JetBrains Mono, 0.8rem, `--text-muted`):
  `Currently: Building nspb-api · Open to AI/ML roles · Tampa / Remote`
  - Pulsing amber dot before text
- **CTAs**: "SEE THE WORK" (blue fill, magnetic effect) + "GITHUB →" (outline)
  - Both use magnetic button effect (GSAP elastic snap-back on leave)

### 4. Featured Work (3 panels)
- Section label: `FEATURED WORK` in mono, amber, with horizontal rule
- Each project is a full-width two-column panel:
  - **Left column**: number (`01`), title, problem sentence (italic), description (2-3 sentences), tech stack pills, link
  - **Right column**: large gradient metric (amber→blue, `clamp(3rem, 6vw, 5rem)`) with label below
  - **Number counter animation**: metric counts up from 0 when scrolled into view
  - **Staggered entrance**: left and right columns animate in with 120ms offset
- Panels separated by `1px solid var(--border)`
- Tech stack pills: amber-bordered for primary language, default border for secondary

**Project data:**

| # | Title | Problem | Metric | Stack | Link |
|---|-------|---------|--------|-------|------|
| 01 | nspb-api | "Oracle EPM Cloud exposes no public API. I built one." | 60+ Endpoints | Python, REST, Oracle EPM, SDK Design | Private repo |
| 02 | FerroML | "AutoML tools skip statistical rigor. FerroML doesn't." | 55 Algorithms | Rust, Python, PyPI, Statistics | GitHub |
| 03 | Hierarchical Revenue Forecast | "Revenue forecasting across business lines that actually reconcile." | Multi-LOB | Python, Go, TypeScript, SHAP | GitHub |

### 5. All Work (compact grid)
- Section label: `ALL WORK`
- Filter tabs: `All` / `Machine Learning` / `Engineering` / `FP&A` (keep existing ARIA tablist/tab pattern)
- Cards in `auto-fill` grid (`minmax(300px, 1fr)`), no images
- Each card: title, metric (amber), one-line description, tech stack tags, GitHub link
- **Staggered entrance**: cards animate in with 80ms stagger
- **Hover effect**: border brightens, background lifts to `--bg-tertiary`
- **Empty state**: "No projects in this category yet." (already implemented)

**Card data:**

| Title | Metric | Category |
|-------|--------|----------|
| KKBOX Churn Prediction | 0.97 AUC | ml |
| Open-Vocab Object Detection | 265-490ms/img | ml |
| Ironclad | 95% CI | ml |
| FerroML Plugin | Claude Code | engineering |
| GSD-ML | Autonomous | engineering |
| MLForge | AutoML | engineering |

### 6. About
- Section label: `ABOUT`
- **Statement**: "I make financial data useful." (Inter 800, `clamp(1.8rem, 4vw, 3rem)`, "financial data" in amber)
- **Timeline**: sparse vertical with left-side line and dots
  - 2024: B.A. Statistics, USF · MIT IDSS Data Science Certificate
  - 2025: AI Engineering Intern, Origin Construction
  - 2025–NOW: FP&A Analyst, Franklin Street (current entry gets amber dot with glow)
- **Skills grid** (5 groups, `auto-fill` grid):
  - Languages: Python, TypeScript, SQL, Rust
  - Finance: Oracle EPM Cloud, FP&A, Financial Modeling
  - ML/Data: Scikit-learn, LightGBM, Pandas, FastAPI
  - AI Tools: Claude Code, Anthropic SDK
  - Web: React, GSAP, Vite
- Group labels in mono, uppercase, `--text-muted`
- Tags as bordered pills with hover brightening

### 7. Footer
- Horizontal rule separator
- **Manifesto block** (full width, centered, Inter 800, uppercase, stacked):
  ```
  BUILT FOR REAL CONSTRAINTS.
  SHIPPED WITH CLAUDE.
  MEASURED IN DOLLARS SAVED.
  USED BY ACTUAL HUMANS.
  ```
  - Scroll-triggered line-by-line reveal
- **Contact row**: left: "Available for AI/ML roles and FP&A automation consulting." / right: GitHub, LinkedIn, HuggingFace links
- **Bottom row**: email (copy-to-clipboard on click) + copyright

---

## Animation System

All animations use GSAP + ScrollTrigger. Respect `prefers-reduced-motion`.

| Animation | Where | GSAP Pattern |
|-----------|-------|-------------|
| Line reveal | Hero hook, section labels, manifesto | SplitText → `yPercent: 100` → `0` with stagger |
| Number counter | Featured project metrics | `textContent: 0` → final value, `snap: 1`, `duration: 2` |
| Staggered entrance | All Work cards, skill tags | `fromTo` with `opacity: 0, y: 30` → `1, 0`, `stagger: 0.08` |
| Magnetic buttons | "SEE THE WORK", "GET IN TOUCH" | `mousemove` → `gsap.to(el, { x: dx*0.3, y: dy*0.3 })`, elastic snap-back |
| Fade-up | About statement, timeline entries | `from` with `opacity: 0, y: 40`, ScrollTrigger |
| Text scramble | Name hover, section heading hover | Existing `useTextScramble` hook (alpha-only) |
| Custom cursor | Global | Existing implementation minus `cursor-plus` state |
| Loader | Page load | CSS overlay → `translateY(-100%)` transition, 0.8s |

### Reduced motion
When `prefers-reduced-motion: reduce`:
- All GSAP animations set `duration: 0`
- Lenis disabled (native scroll)
- Loader skipped
- Number counters show final value immediately

---

## Color System

```css
--bg-primary: #0A0A0B;
--bg-secondary: #111113;
--bg-tertiary: #18181B;
--text-primary: #E8E8EE;
--text-secondary: #888899;
--text-muted: #555566;
--accent-blue: #0066FF;
--accent-amber: #F0A500;
--accent-amber-dim: rgba(240, 165, 0, 0.12);
--border: rgba(255, 255, 255, 0.06);
--border-hover: rgba(255, 255, 255, 0.12);
```

Light theme overrides: invert backgrounds/text, darken amber to `#B87800`, darken blue to `#0055DD`.

---

## Typography

- **Font family**: Inter (body + display) + JetBrains Mono (meta/labels)
- **Hero hook**: Inter 800, `clamp(2rem, 5vw, 3.8rem)`, `letter-spacing: -0.03em`
- **Hero name**: Inter 700, `letter-spacing: 0.2em`
- **Section labels**: JetBrains Mono 600, `0.7rem`, `letter-spacing: 0.2em`, amber
- **Body**: Inter 400, `0.95rem`, `line-height: 1.7`
- **Metric display**: Inter 900, `clamp(3rem, 6vw, 5rem)`, gradient fill
- **Pills/tags**: JetBrains Mono 500, `0.65rem`

---

## What Gets Deleted

- `components/FluidGlass.tsx` + `shaders/fluidglass/*`
- `components/DemoModal.tsx` (already deleted)
- `components/ScrollProgress.tsx`
- `components/SectionPagination.tsx`
- `ogl` dependency from package.json
- `webgl` manual chunk from vite.config.ts
- TREY.ML references in Header
- Service cards in About
- Stock photo images on project cards
- `--accent-teal` CSS variable (replaced by `--accent-amber`)
- `--accent-orange` CSS variable (already deleted)

## What Gets Added

- `components/PageLoader.tsx`
- `components/ManifestoFooter.tsx`
- `components/FeaturedProject.tsx`
- `components/WorkCard.tsx`
- `components/Timeline.tsx`
- `components/MagneticButton.tsx`
- `hooks/useNumberCounter.ts`
- `hooks/useMagneticEffect.ts`
- `hooks/useLineReveal.ts`
- Updated `constants.ts` with `description`, `stack`, `featured` fields
- Updated `types.ts` with new Project type fields

## What Gets Modified

- `App.tsx` — new section order, remove ScrollProgress/SectionPagination
- `Header.tsx` — TREY LUPO wordmark, remove auto-collapse, add scrollspy
- `Hero.tsx` — new hook copy, line reveal, status line, CTAs
- `ProjectsSection.tsx` — two-tier layout (featured + all work)
- `About.tsx` — timeline, updated skills, remove service cards
- `Footer.tsx` — manifesto block, remove FluidGlass
- `styles/index.css` — amber accent, updated variables, new component styles

---

## Success Criteria

1. A hiring manager who visits for 30 seconds can answer: "What is the most impressive thing this person built?"
2. The FP&A filter shows projects when clicked
3. Every project has a description, a real metric, and a tech stack
4. Number counters animate on scroll-into-view
5. `prefers-reduced-motion` fully respected
6. Build passes (`npm run build`)
7. Lighthouse performance > 90
8. No metric says "MIT IDSS"
