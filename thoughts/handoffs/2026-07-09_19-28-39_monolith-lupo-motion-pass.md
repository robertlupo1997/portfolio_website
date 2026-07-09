---
date: 2026-07-09T19:28:39-04:00
researcher: Claude (Fable 5) — motion-pass plan, Trey-directed ("go fucking nuts")
git_commit: ec5baf0
branch: feat/monolith-lupo
repository: portfolio_website (DrvFs clone at /mnt/c/Users/Trey/Downloads/portfolio_website — MAIN checkout; the cyberpunk session runs in the ../portfolio_website-cyber worktree, not here)
topic: "SESSION A PROMPT: the go-nuts motion pass on monolith-lupo. Eight mandated
  set-pieces (print-shop physics, not web-slop), constraints, verification contract."
tags: [monolith-lupo, motion, animation, set-pieces, rlupo-portfolio]
status: complete
last_updated: 2026-07-09
type: handoff
---

# Handoff: monolith-lupo motion pass — "go fucking nuts, inside the grid"

## Task(s)

1. ⏳ **THIS SESSION (main checkout, branch feat/monolith-lupo):** implement the mandated
   set-piece list below in `rlupo-portfolio/prototypes/monolith-lupo/`. Trey's direction,
   verbatim energy: go nuts — but every effect must feel like print-shop physics
   (stamps, presses, plotters, scanners, misregistration) — never generic web-slop.
2. ⏳ Verify (contract below), update `/guide` critique history honestly, commit on
   feat/monolith-lupo, write the next handoff + pointer.

## The site today (context)

Built and verified: 6 scroll-snap posters, entrance choreography gated on `html.js-anim`
(added only when JS runs AND motion allowed — reduced-motion/no-JS get the full static
page), one IntersectionObserver adds `.is-in` per poster, counters in `main.js`
(count-up 3.9×, countdown 0.48), AA computed for every text pair (orange NEVER as text on
concrete — 1.79:1; only FULL ink passes on orange — 4.75:1). Files: index.html 438 ·
style.css 2151 · main.js 293 · guide 243 lines. Existing set-pieces: cover scramble +
settle-thud, notice stamp + rotating seal, forecast bars, register row printing + chip
stamps, docket ledger + caret, orange block slide + link underline stagger, G-key grid,
print stylesheet.

## The mandated set-pieces (all eight; invent more if they obey the grid)

1. **P2 — misregistration settle (signature candidate).** VARIANCE / ANALYSIS arrive as
   misregistered overprints: an orange offset copy and an ink copy 2–3px apart that slide
   into perfect register as the poster enters (two text-shadow layers or ::before/::after
   copies animating to 0 offset). The registration-marks conceit made literal. Reduced
   motion: perfectly registered, static.
2. **P3 — benchmark race.** Under the giant 3.9×: a thin track where two markers race —
   FERROML vs SKLEARN (labels, ink) — FerroML finishing 3.9× further in the same time.
   Data-true (constants.ts metric), explains the number visually. rAF, same easing family
   as the count-up, fires with it.
3. **P4 — forecast split.** After the bars draw: the last ~10 bars restyle to outlined
   (forecast) vs solid (actual), and a dashed SVG line sweeps across the bar tops
   (stroke-dashoffset draw). Label the seam: fine-print "ACTUAL ⟶ | ⟶ FORECAST".
4. **P5 — scanline registration.** A thin orange scanline sweeps down the register list
   once on entrance; each status chip stamps AS the line passes it (re-time the existing
   chip delays to follow the sweep). The docket's last line types in character-by-character
   (JS typewriter, then the caret keeps blinking).
5. **P6 — date-stamp arrival.** OPEN TO WORK letters arrive as individual stamp strikes
   (per-letter stagger, scale 1.2→1 with the thud bezier, 20–30ms apart). The CTA gets a
   quiet ready-pulse every ~7s (scale 1.0→1.012→1.0; killed by reduced-motion).
6. **P1 — plotter rules + live letters.** The orange rules draw via a small orange
   carriage that travels the line and leaves it behind (a moving 8px block, then gone).
   Hovering any settled title letter re-scrambles just that letter for ~350ms then locks
   (reuse scramble internals; pointer:fine only).
7. **Site-wide — crosshair cursor.** On pointer:fine devices, a fixed reg-mark crosshair
   follows the cursor with `mix-blend-mode: difference` (self-inverting on every ground),
   spring-lagged ~80ms (rAF, pauses on document.hidden), scales up 1.4× over links/CTA.
   Never hide the native cursor entirely on interactive elements' focus path; purely
   additive visual.
8. **Site-wide — PROOF SHEET mode (the big invention).** Pressing **P** toggles an
   imposition view: all six posters as a printer's contact sheet (2×3 grid), click/Enter
   jumps to that poster and exits. Implementation is builder's choice — honest options:
   (a) six same-page iframes scaled ~0.2 (desktop-only, lazy-load on first toggle), or
   (b) CSS-drawn abstractions of each composition (colored blocks + one keyword). Must be
   keyboard-reachable (focusable tiles, Esc exits), aria-labeled, and desktop-only
   (≤768px: not available). Document the choice in the guide.

## Constraints (non-negotiable)

- Transform/opacity-only animation (60fps); rAF loops pause on `document.hidden`; no
  layout thrash (no top/left/width animation).
- Everything gated on `html.js-anim` or reduced-motion-guarded exactly like the existing
  system; the static page must remain complete and dignified.
- AA is settled law — do not introduce orange text on concrete, or tinted ink on orange.
  New chrome must be audited against every ground it floats over, INCLUDING partial
  grounds (the poster-6 block edge lesson).
- Vanilla JS only, no libraries, every pixel procedural. Zero console/page errors at every
  shot. Do not break the print stylesheet or the G-key grid.
- BRIEFS.md contract in force: ≥3 passes with PNGs in `prototypes/monolith-lupo-qa/`
  (pass7+), vision-Read ≤3 shots per pass (montage trick: PIL-stitch several shots into
  one image = one read), guide updated honestly, final-desktop/final-mobile refreshed.
- Playwright/Linux shot artifact to know: ~11px regular-weight ink text on concrete
  fringes BLUE in harness PNGs even when computed color is ink — check computed color
  before chasing CSS (see 19-22-40 handoff §Learnings).

## Verification contract (fill a table like this before finishing)

| Claim | Command | Expected |
|---|---|---|
| zero errors, all posters both viewports | `node tools/shot.mjs http://localhost:8791/monolith-lupo/ … 1440x900/390x844 3500 <scrollY>` | `"errors":[],"pageErrors":[]` |
| reduced-motion intact | same with `--reduced` | static, complete, zero errors |
| proof mode a11y | keyboard-only: P → Tab → Enter → Esc | reachable, exits clean |
| fps sanity | shots mid-animation (waitMs 800–1500) | no half-rendered layout jumps |

## Environment

- Serve: `cd /mnt/c/Users/Trey/Downloads/portfolio_website && python3 -m http.server 8791 --directory rlupo-portfolio/prototypes --bind 127.0.0.1 &` (NOT :8080 — Windows HTTP.sys). Check first: `curl -s -o /dev/null -w "%{http_code}" http://localhost:8791/monolith-lupo/`.
- Harness: `node tools/shot.mjs` from `/home/tlupo/projects/fable25`.
- Branch: feat/monolith-lupo (should already be checked out here — verify with
  `git branch --show-current`; the cyberpunk session owns ../portfolio_website-cyber and
  :8792 — touch NEITHER).
- Commit protocol: commit site + qa + updated guide + a new handoff + HANDOFF.md pointer
  on feat/monolith-lupo. Do not push.

## THE PASTE-READY PROMPT (Session A, this directory)

```
Read thoughts/handoffs/2026-07-09_19-28-39_monolith-lupo-motion-pass.md WHOLE and execute
it: the go-nuts motion pass on monolith-lupo. All eight mandated set-pieces, inside
monolith's discipline — print-shop physics, chaos gridded underneath. Verify per the
contract, update the guide honestly, commit on feat/monolith-lupo, hand off. This is for
hiring managers and Trey fucking loves this site — make it unforgettable without breaking
its restraint.
```
