# FABLE_CHANGES — design ownership session, 2026-07-07

Scope: `rlupo-portfolio/` working tree only. Nothing committed (per sandbox constraints —
git writes fail on this mount). Review the diff and commit from your machine.

## What changed and why

### 1. Display-scale project titles + the "problem" hook line (the big move)
Every project slide was a wall of 12px mono lines anchored bottom-left — no typographic
hierarchy, nothing for a skimming hiring manager's eye to land on. Now each slide has:

- **`.terminal-title`** — the project name at `clamp(2.1rem, 3.6vw, 3.5rem)` in Departure
  Mono, revealed with the site's existing TextScramble. Because Departure Mono is fixed-width,
  the scramble causes zero layout shift — this is now the signature moment of every slide,
  consistent with the hero name treatment.
- **`.terminal-problem`** — the `problem` field from `constants.ts` was defined but never
  rendered anywhere. It's the best copy in the dataset ("Oracle EPM Cloud exposes no public
  API. I built one." / "Recruiters skim. Let them interrogate."). It now renders as a coral
  hook line under the title. I wrote three missing `problem` lines (kkbox, ferroml-plugin,
  gsd-ml) — all derived strictly from facts already in their descriptions, nothing invented.
- The redundant `TITLE:` terminal line was removed (the big title replaces it).
- Hero name is now the page `<h1>` (there was no h1 at all); slide titles are `<h2>`.

### 2. Motion system coherence
- **Double animation bug:** `.terminal-line` entrances were animated by BOTH a CSS keyframe
  stagger (`terminalLineIn`, hard-coded nth-child delays that broke past 7 children — the
  Activity Log has ~14) AND GSAP in CarouselSlide/ActivitySlide, fighting over opacity
  simultaneously. CSS path deleted; GSAP owns line entrances exclusively now.
- **Invalid ease:** CarouselSlide passed `ease: 'cubic-bezier(0, 0, 0.2, 1)'` to GSAP, which
  silently ignores CSS cubic-bezier strings and fell back to default. Now `expo.out`, the
  site-wide entrance ease.
- **Stuck offset bug:** the slide exit tween left lines at `y:-4`; re-entering a slide never
  reset it. Entrance tween now animates y back to 0.

### 3. Left-edge alignment fix
`.carousel-slide-terminal` added 32px of its own horizontal padding on top of the panel's
`--page-indent`, so project text sat at 144px while the hero name and footer row sat at
112px. Horizontal inset now lives only on `.terminal-panel` — hero, project column, and
footer share one left edge.

### 4. Preloader: faster and honest
2.4s boot → 1.4s (a hiring manager's time is the product constraint), and the generic
"INITIALIZING..." became a real boot log: `projects: 8 mounted` (CAROUSEL_PROJECTS.length,
computed not hard-coded), `viz: 4 archetypes compiled`, `ask: corpus indexed` — every line
true. Block height is reserved up front so appearing lines don't re-center mid-boot.

### 5. WCAG AA contrast pass (measured, not eyeballed)
Old palette on `#474741`: accent #E85D3A = **2.70:1** (used for 12px button labels),
text-tertiary #7A7A6E = **2.15:1**, text-secondary #A6A77E = 3.76:1, and hover-filled
buttons put #474741 text on accent = 2.70:1. All failures. New tokens:

| token | value | ratio on bg | role |
|---|---|---|---|
| `--accent` | #F0704C | 3.17 | borders, fills, display-size text only (AA-large/UI ≥3:1) |
| `--accent-text` | #FA9E78 | 4.55 | any accent-colored text ≤14px |
| `--ink` | #262622 | 5.15 on accent fill | text on coral-filled hover states |
| `--text-secondary` / `--accent-dim` | #B6B78D | 4.52 | same hue as before, one step lighter |
| `--text-tertiary` | #B5B5A7 | 4.51 | hue-shifted neutral so hierarchy survives the lift |

All hover states that fill with coral now switch text to `--ink` (5.15–7.4:1). AsciiGrid
canvas constants updated to mirror the tokens. Contrast math is documented in the
`:root` comment in `styles/index.css`.

### 6. Interaction/a11y details
- Arrow keys no longer drive the carousel behind an open Info/Projects/Ask overlay
  (`keyboardEnabled` prop threaded App → Carousel → useCarousel), and never hijack arrows
  from a focused text field.
- Screen-reader slide announcer (`role="status"` aria-live region: "Project 2 of 8: FerroML").
- Ask panel: `role="status"` on searching, `role="alert"` on errors, polite "Answer ready."
  announcement when the stream completes.
- `useTextScramble` now respects `prefers-reduced-motion` (it previously animated regardless).
- Header shows `ASK ^K` on Windows/Linux, `ASK ⌘K` on Mac (App already bound both).
- New `.sr-only` utility.

### 7. Mobile safeguards
The taller title block could exceed the `1fr` grid row on short phones and silently clip the
STACK line (`overflow: hidden`). The text column is now `overflow-y: auto` on mobile
(`touch-action: pan-y` already permits the gesture), fallback image capped 40vh → 32vh,
title drops to `clamp(1.6rem, 7.5vw, 2.1rem)`, panel spacing tightened.

## What each self-review pass caught

- **Pass 1 (implement + code cold-read):** the double `.terminal-line` animation, the invalid
  GSAP ease, the 32px left-edge misalignment, the never-rendered `problem` field, missing h1.
- **Pass 2 cold-read:** exit tween's stuck `y:-4` on revisited slides; preloader lines
  re-centering the block (fixed with reserved min-height); arrow keys reaching the carousel
  through open overlays.
- **Pass 3 cold-read:** mobile clipping risk from the new title (made column scrollable);
  `text-primary on accent fill = 2.29:1` on every hover state (introduced `--ink`);
  `.mobile-nav` hover color; confirmed every remaining raw `var(--accent)` use is a border,
  fill, focus ring, or display-size text.

## Verification (all on the fully-patched tree)

- `tsc --noEmit` — clean
- `vite build` — clean, 4.25s (`terminal-title`, new copy, and new tokens confirmed in dist)
- `vitest run` — 40/40 pass
- e2e (Playwright) NOT run — no browser binaries available in this sandbox

Sandbox note: the Windows↔Linux file sync in this session lagged badly mid-run, and the
mount's `node_modules/.bin/*` shims read as 0 bytes (so `npx tsc`/`npx vite` were silently
no-ops there). Final verification was done by reconstructing the exact working tree from
`git archive HEAD` + the same edits in `/tmp` and invoking the tools directly
(`node node_modules/vite/bin/vite.js build`, etc.). Re-run `npm run build` locally as a
sanity check before pushing — it should match.

## Things I'd want screenshot feedback on

1. The new coral (#F0704C UI / #FA9E78 text) vs the old #E85D3A — measurably necessary for
   AA, but it reads slightly lighter/warmer. If it feels washed out in person, the fix is to
   darken the *background* under small accent text, not to darken the coral.
2. `terminal-title` wrapping on "Hierarchical Revenue Forecast" (2 lines at 18ch max-width) —
   intentional varied rhythm, but check it doesn't crowd short viewports (~700px tall).
3. The WebGL viz tints in `lib/viz/params.ts` still use the old #E85D3A coral. I deliberately
   did NOT retune them: the ASCII shader's luminance thresholds were hand-calibrated per tint
   (see comments in VizCanvas.tsx), and after ASCII quantization the delta vs #F0704C is
   imperceptible. Flagging the mismatch for honesty.
4. Preloader at 1.4s — if it feels rushed, 1.8s is the ceiling I'd go back to.
5. Mobile: verify the scroll-within-slide interaction doesn't fight horizontal swipe on a
   real device.

## Dead code found (NOT deleted — deletion blocked on this mount, and it's your call)

- `rlupo-portfolio/components/About.tsx` — imported nowhere.
- `rlupo-portfolio/components/Logo.tsx` — imported nowhere.
- `rlupo-portfolio/hooks/useScrollAnimations.ts` — still imported by App.tsx but only kills
  ScrollTriggers on unmount; no scroll animations are ever registered. Vestigial.
- `package.json`: `powerglitch` and `lucide-react` have zero imports in source — removable.
- `Layout Critique.html:Zone.Identifier` (repo root) — Windows ADS artifact.
- `.terminal-body--active` no longer has base CSS (class kept in markup; the
  reduced-motion safety rule still targets it intentionally).
