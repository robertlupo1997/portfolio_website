# Handoff: Animation Study Complete — Implement Motion Patterns (2026-06-13)

## For the next session (WSL CLI)

You are rebuilding treylupo.com — a personal portfolio for Trey Lupo (FP&A analyst / AI-ML engineer at Franklin Street, Tampa, FL). The primary reference site is **https://www.francescomichelini.com/** (Folio/23 by Francesco Michelini, designed by Unlearn Studio).

The spatial layout already matches Michelini. The animation study is now complete. **Your job is to implement the motion patterns.**

---

## Current state

**Branch:** `redesign/invisible-frame`
**Latest commit:** `0491e23` — spatial proportions overhaul
**Build status:** Clean — `npx tsc --noEmit` and `npm run build` both pass
**Dev server:** `cd rlupo-portfolio && npm run dev` → http://localhost:3000

### What's been done
1. Spatial layout matches Michelini (staggered editorial project list, bottom-anchored hero, display typography, simplified nav, bold footer)
2. **Animation study completed via live Chrome browsing** — full findings in `thoughts/animation-study.md`

### What has NOT been done — your job
Implement the 5 motion patterns documented in the animation study. Read `thoughts/animation-study.md` first — it has every detail from live observation.

---

## The 5 Things to Implement (Priority Order)

### 1. Preloader with Percentage Counter + Text Scramble

**What Michelini does:** Every page load shows a solid background with a percentage counter (0% → 100%) in the bottom-right corner. After hitting 100%, the counter text-scrambles through random characters, then all page content fades in at once.

**How to build it:**
- Create a `Preloader` component that renders a full-screen overlay matching the background color
- Counter: animate a number from 0 to 100 over ~2-3 seconds, displayed in monospace in the bottom-right
- After 100%: use the existing `TextScramble` component to scramble the "100%" text through random chars (~500ms)
- After scramble: fade out the preloader overlay (opacity 0, then remove from DOM)
- Content wrapper: start with `opacity: 0`, transition to `opacity: 1` when preloader completes
- Only plays once on initial page load (we're an SPA, not multi-page like Michelini)
- Duration: 3-4 seconds total feels right

**Files to touch:**
- Create `rlupo-portfolio/components/Preloader.tsx`
- Modify `rlupo-portfolio/App.tsx` to wrap content with preloader logic
- Reuse `rlupo-portfolio/components/TextScramble.tsx` for the counter transition

### 2. Project List Focus/Dim Hover

**What Michelini does:** On the /projects list, hovering any project row sets it to full opacity while ALL other rows dim to ~0.4 opacity. Smooth 300ms transition. That is the ENTIRE interaction — no color changes, no underlines, no scale transforms.

**How to build it:**
- On the project list container, add a CSS approach:
  ```css
  .project-list:hover .project-entry {
    opacity: 0.4;
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .project-list:hover .project-entry:hover {
    opacity: 1;
  }
  ```
- This is pure CSS — no JS state needed
- Apply to the project rows in `ProjectList.tsx`
- The thumbnails, title, year, P/0X label — everything in the row — should dim/brighten together

**Files to touch:**
- `rlupo-portfolio/components/ProjectList.tsx`
- `rlupo-portfolio/styles/index.css`

### 3. Cursor Refinement to SVG Viewfinder

**What Michelini does:** The cursor is NOT a circle. It's a 32x32 SVG with 4 corner bracket paths + 1 center dot circle. It uses `mix-blend-mode: difference` so it automatically inverts against any background. Hidden on mobile.

**How to build it:**
- Update the existing `Cursor.tsx` component
- Replace the current cursor shape with an SVG: 4 small L-shaped corner brackets at the corners of a ~24px square, plus a small circle (r=2-3) at center
- Add `mix-blend-mode: difference` to the cursor container
- Keep smooth position interpolation (lerp on requestAnimationFrame, not raw mousemove)
- Add `@media (max-width: 1024px) { display: none; }` or equivalent

**Files to touch:**
- `rlupo-portfolio/components/Cursor.tsx`
- `rlupo-portfolio/styles/index.css` (if cursor styles are there)

### 4. Timing/Easing Overhaul

**What Michelini does:** Everything is fast and precise. 225-300ms transitions. `cubic-bezier(0.4, 0, 0.2, 1)` is the universal easing. No springs, no bounces, no slow fades.

**How to build it:**
- Add CSS custom properties to `:root`:
  ```css
  --duration-sm: 225ms;
  --duration-md: 300ms;
  --easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --easing-decel: cubic-bezier(0, 0, 0.2, 1);
  ```
- Audit all existing transitions/animations and replace with these tokens
- The standard transition pattern across the site:
  ```css
  transition: color var(--duration-md) var(--easing-standard),
              background-color var(--duration-md) var(--easing-standard),
              border-color var(--duration-md) var(--easing-standard),
              opacity var(--duration-md) var(--easing-standard);
  ```
- Kill any bounce/spring/elastic easing in GSAP animations

**Files to touch:**
- `rlupo-portfolio/styles/index.css` (CSS custom properties + transition overhaul)
- Any component using GSAP with spring/bounce easing

### 5. Remove Over-Animation

**What Michelini does NOT do (and neither should we):**
- NO scroll-triggered stagger on project list entries (they're just present)
- NO parallax on any images
- NO line-mask text reveals on body text or metadata
- NO bounce/spring physics
- LineReveal (GSAP SplitText line-mask) should be used SPARINGLY — maybe just the hero name and the "LET'S BUILD SOMETHING" CTA, not on every text element

**How to audit:**
- Check every GSAP ScrollTrigger usage — most should probably be removed or simplified
- Check LineReveal usage — reduce to 1-2 key moments
- The site's power is RESTRAINT. A preloader, a hover pattern, and fast timing. That's the whole motion language.

---

## Files That Matter

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
| `rlupo-portfolio/components/TextScramble.tsx` | Character scramble effect — reuse for preloader |
| `rlupo-portfolio/components/Cursor.tsx` | Custom cursor — needs SVG viewfinder update |
| `rlupo-portfolio/App.tsx` | Root component — add preloader here |

## Reference Materials

| Path | What it is |
|------|-----------|
| `thoughts/animation-study.md` | **READ THIS FIRST** — full live browser observation of all 9 animation categories |
| `design-extract-output/francescomichelini-com-motion-tokens.json` | Extracted easing curves and durations |
| `design-extract-output/francescomichelini-com-design-language.md` | Full design language breakdown |
| `thoughts/reference-screenshots/*.png` | 16 static screenshots (useful for layout, not motion) |

## Tech stack

- React 19 + Vite + TypeScript
- GSAP (ScrollTrigger, SplitText) + Lenis (smooth scroll)
- Space Grotesk (display) + Inter (body) + JetBrains Mono (labels)
- Dev: `cd rlupo-portfolio && npm run dev` → http://localhost:3000
- Build: `npm run build` (clean, ~253KB JS gzipped to 85KB)

## Project content decisions (locked)

- Only feature projects in `constants.ts` — do not add work-derived projects
- nspb-api stays featured with no link (private repo)
- Work-derived projects are off-limits
- Position Trey as "the AI guru for any company"

---

## The Core Insight

Michelini's site feels premium NOT because it animates a lot, but because it animates LITTLE and animates it PERFECTLY. One dramatic preloader. One elegant hover pattern. Fast, precise timing everywhere. That's the entire motion language. The restraint IS the quality signal.

"I need to be so advanced that I'm like the AI guru for any company. I want the website to look very clean and look like something that no $200M company could imagine one of their employees making."

The preloader alone — percentage counter → text scramble → content reveal — will achieve this. It signals "this was built by someone who knows what they're doing" before a single line of content is even visible.
