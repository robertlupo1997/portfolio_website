# Handoff: Spatial Overhaul Complete — Animation Study Next (2026-06-13)

## For the next session (Windows desktop Claude Code with Chrome)

You are rebuilding treylupo.com — a personal portfolio for Trey Lupo (FP&A analyst / AI-ML engineer at Franklin Street, Tampa, FL). The primary reference site is **https://www.francescomichelini.com/** (Folio/23 by Francesco Michelini, designed by Unlearn Studio).

**Why you're on desktop:** The CLI session couldn't browse the live reference site — WebFetch strips HTML to markdown and loses all animation/interaction behavior. You have Chrome. Your job is to **browse francescomichelini.com live**, observe how it actually moves, then come back and implement those motion patterns in this codebase.

---

## Current state

**Branch:** `redesign/invisible-frame`
**Latest commit:** `0491e23` — spatial proportions overhaul
**Build status:** Clean — `npx tsc --noEmit` and `npm run build` both pass
**Dev server:** `cd rlupo-portfolio && npm run dev` → http://localhost:3000

### What was just completed (this session)

The spatial proportions have been overhauled to match Michelini's layout structure:

1. **Project list** — Transformed from a 5-column data table (16px body titles) to a staggered editorial layout with `clamp(2rem, 5vw, 3.5rem)` uppercase display titles, inline thumbnails, P/01 labels stacked with year, even entries indented. Filter buttons removed — all 9 projects in one editorial list.

2. **Hero** — Shifted from centered with modest type to bottom-anchored, left-aligned with `clamp(3.5rem, 10vw, 7rem)` uppercase name. Added "FOLIO /2026" decorative label positioned top-right.

3. **Typography scale** — Added `--text-display` token. Extreme contrast: 12px mono labels ↔ 56px display titles. About statement and footer CTA use display scale.

4. **Navigation** — Simplified to just "Projects" and "Info" (dropped Contact).

5. **Footer** — Bold "LET'S BUILD SOMETHING." in display type, colophon row (Design + Development · Trey Lupo / Fonts / ©2026).

6. **Cursor preview** — Only shows for projects without inline thumbnails.

### What has NOT been done — your job

**The spatial layout matches Michelini. The motion does not.** The previous session could not study his animations because screenshots are static and WebFetch strips interactive content. You can browse the live site.

---

## What to study on francescomichelini.com

Open https://www.francescomichelini.com/ in Chrome and observe these specific things:

### 1. Page load sequence
- Is there a preloader? (screenshots show "0%" in corner)
- How does content reveal? Does it fade in, slide up, mask reveal?
- What order do elements appear? (logo first? title? image?)
- How long is the full entrance animation?

### 2. Project detail view interactions
- How does the image carousel work? Swipe? Click arrows? Auto-advance?
- How do the carousel pagination dots behave?
- What happens when you click PREV / NEXT?
- Is there a page transition between projects?

### 3. Text animations
- How does the project title animate in? (line mask? character by character? fade?)
- How does the metadata grid (YEAR · AGENCY · ROLE · AWARDS) animate?
- How does the bio text reveal?
- Any stagger patterns?

### 4. Hover states
- What happens when you hover the project title on the /projects list?
- What happens when you hover nav links?
- Is there a custom cursor? What does it look like? How does it change on hover?
- What happens when you hover the [VISIT →] button?

### 5. Scroll behavior
- Is there smooth scrolling (Lenis-like)?
- Are there scroll-triggered animations?
- Does the nav show/hide on scroll?
- Any parallax on images?

### 6. Page transitions
- Navigate from home → /projects → /projects/fanfanfan → /info
- How do pages transition? Fade? Slide? Clip?
- How fast are transitions?
- Do elements persist across transitions (shared element transitions)?

### 7. The /projects list page
- How do entries animate as you scroll down?
- Do the inline thumbnails animate on hover?
- Is there a stagger effect?
- How does the year text behave?

### 8. Theme toggle
- There's a theme/color toggle. Where is it? How does it animate?
- The theme changes colors but structure stays. Note the transition.

### 9. Easing and timing
- Are animations fast and snappy or slow and smooth?
- What easing curves feel dominant? (ease-out-expo? spring? linear?)
- Note any animation durations that feel right

---

## What to implement after studying

Priority order:

1. **Text reveal animations** — Match Michelini's title entrance style. We already have LineReveal (GSAP SplitText mask) but timing/easing may differ.

2. **Entry stagger on scroll** — Project list entries should cascade with GSAP ScrollTrigger, not CSS transitions.

3. **Hover interaction quality** — Title color change + thumbnail scale/reveal behavior on the project list.

4. **Page load sequence** — A coordinated entrance animation rather than scattered CSS transitions.

5. **Cursor refinement** — Match his cursor behavior if he has a custom one.

6. **Nav animation** — Refine the scroll show/hide timing.

We are NOT implementing:
- Page transitions (we're single-page, he's multi-page Nuxt)
- Theme toggle (we're dark only)
- Image carousel (we don't have project detail views)

---

## Files that matter

| File | What it does |
|------|-------------|
| `rlupo-portfolio/styles/index.css` | All CSS — tokens in `:root`, component styles below |
| `rlupo-portfolio/components/Hero.tsx` | Bottom-anchored hero, uppercase name, FOLIO /2026 label |
| `rlupo-portfolio/components/Header.tsx` | Minimal nav (Projects, Info), GSAP scroll show/hide |
| `rlupo-portfolio/components/ProjectList.tsx` | Staggered editorial list with display titles, inline thumbs |
| `rlupo-portfolio/components/CredentialStrip.tsx` | Marquee of proof tokens |
| `rlupo-portfolio/components/About.tsx` | Display statement + bio + skills + timeline |
| `rlupo-portfolio/components/Footer.tsx` | Display CTA + colophon |
| `rlupo-portfolio/components/LineReveal.tsx` | GSAP SplitText line-mask reveal |
| `rlupo-portfolio/components/TextScramble.tsx` | Character scramble effect |
| `rlupo-portfolio/components/Cursor.tsx` | Custom cursor with hover states |
| `rlupo-portfolio/constants.ts` | All project data, credentials, skills, timeline |
| `rlupo-portfolio/types.ts` | TypeScript interfaces |
| `rlupo-portfolio/App.tsx` | Root component |

## Reference materials in the repo

| Path | What it is |
|------|-----------|
| `thoughts/reference-screenshots/*.png` | 16 screenshots of francescomichelini.com (static) |
| `design-extract-output/francescomichelini-com-*` | Extracted design tokens (28 files) |
| `design-extract-output/francescomichelini-com-motion-tokens.json` | Extracted motion tokens (durations, easings) |
| `design-extract-output/francescomichelini-com-design-language.md` | Full design language breakdown |
| `DESIGN.md` | Current Precision Dark design spec |
| `PRODUCT.md` | Brand context and principles |

## Local site mirror (NOT useful for animations)

`~/projects/michelini-reference/www.francescomichelini.com/` — 152MB HTML/CSS/JS/fonts/images, but it's a Nuxt SPA that requires JS runtime to render. Can't open as static files. The live site is the only way to see the animations.

---

## Tech stack

- React 19 + Vite + TypeScript
- GSAP (ScrollTrigger, SplitText) + Lenis (smooth scroll)
- Space Grotesk (display) + Inter (body) + JetBrains Mono (labels)
- Dev: `cd rlupo-portfolio && npm run dev` → http://localhost:3000
- Build: `npm run build` (clean, ~253KB JS gzipped to 85KB)

---

## Project content decisions (locked)

- Only feature projects in `constants.ts` — do not add work-derived projects
- nspb-api stays featured with no link (private repo)
- Work-derived projects are off-limits
- Position Trey as "the AI guru for any company"

## Design skills to use

All available in Claude Code — do NOT send the user to Claude Design:
- **`/impeccable animate`** — For animation improvements after studying the reference
- **`/impeccable critique`** — After implementing animations, critique against reference
- **`/impeccable polish`** — Final pass before shipping

---

## What the user wants

"I need to be so advanced that I'm like the AI guru for any company. I want the website to look very clean and look like something that no $200M company could imagine one of their employees making."

He is studying francescomichelini.com for **the lettering, the formation, the animations, the mouse, the links — everything structural.** The spatial layout now matches. The motion quality is the remaining gap.
