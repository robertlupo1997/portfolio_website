---
date: 2026-07-09T20:10:53-04:00
researcher: Claude (Fable 5) — Session A, motion pass execution
git_commit: 972a68d (session base; this work committed as feat/monolith-lupo tip "motion pass — 8 print-shop set-pieces")
branch: feat/monolith-lupo
repository: portfolio_website (DrvFs clone at /mnt/c/Users/Trey/Downloads/portfolio_website — MAIN checkout; the cyberpunk session owns ../portfolio_website-cyber and :8792)
topic: "Motion pass COMPLETE: all eight mandated set-pieces built, verified per
  contract, guide updated honestly. Human gate open at :8791/monolith-lupo/."
tags: [monolith-lupo, motion, animation, set-pieces, complete, human-gate, rlupo-portfolio]
status: complete
last_updated: 2026-07-09
type: handoff
---

# Handoff: monolith-lupo motion pass — BUILT & VERIFIED, awaiting Trey's gate

## Task(s)

1. ✅ **All eight mandated set-pieces** (from 19-28-39 handoff) implemented in
   `rlupo-portfolio/prototypes/monolith-lupo/` — print-shop physics, inside the grid.
2. ✅ **Verified per contract** — passes 7/8/9, PNGs in `prototypes/monolith-lupo-qa/`,
   zero console/page errors on every shot, keyboard a11y computationally asserted.
3. ✅ **Guide updated honestly** — new "The motion pass" section, pass 7/8/9 critique
   history (including the pre-existing print defect found + fixed), expanded honest
   concerns. Stamp now 8 PASSES · 0 CONSOLE ERRORS.
4. ⏳ **Human gate:** Trey reviews at http://localhost:8791/monolith-lupo/ and compares
   against Session B's cyber-lupo (worktree, :8792, separate handoff).

## What was built (all eight, as mandated)

| # | Set-piece | Implementation |
|---|---|---|
| P2 | **Misregistration settle** (signature) | `::before` orange plate copy via `content: attr(data-text)`, 3px off, slides to register on entrance then fades; `.notice__word` got `position:relative; z-index:0` so the z:-1 copy can't slip behind the ground. Reduced/no-JS: registered ink only. |
| P3 | **Benchmark race** | Two lanes under the 3.9×: trail (`scaleX(--f)`) + pen (rAF translateX), `--f: 1` vs `0.2564` shipped in HTML = static truth. Fired with the count-up, same 1400ms/easeOutQuart. |
| P4 | **Forecast split** | Bars 34–43 get `.hrf__bar--fc`; JS builds SVG polyline over bar tops (dashed, clip-path linear sweep 1.15s) + seam element (ACTUAL → \| → FORECAST); `.is-split` lands 1.9s after entrance; bar restyle delays `i·30ms − 150ms` track the sweep. |
| P5 | **Scanline registration** | `.register__list::after` full-height strip, bottom-edge 2px orange line, translateY −101%→0 linear 1.35s; chips retimed `0.43s + i·169ms` to stamp as the line passes. Docket last line types at 24ms/char (rAF, visibility-guarded), caret keeps blinking. |
| P6 | **Date-stamp arrival** | JS splits OPEN TO WORK into letter spans (`initStampTitle`, js-anim only, h2 keeps aria-label), scale 1.25→1 thud, 26ms stagger. CTA `cta-ready` pulse every 7s, `animation:none` on hover/focus so the hover transform wins. |
| P1 | **Plotter rules + live letters** | Rule ink moved to `::before` scaleX draw; `::after` carriage = right-edge 8px block of a full-width strip translateX(−100%)→0 — rides the ink edge by construction, vanishes at end. Hovering a settled title glyph re-scrambles it 350ms (pointer:fine). |
| — | **Crosshair cursor** | `.cursor-reg` white reg-mark, `mix-blend-mode:difference`, exponential-lag rAF (~80ms) that sleeps when settled/hidden, 1.4× over links/buttons, appears in place on first move. Native cursor untouched. pointer:fine + not-reduced only. |
| — | **Proof sheet (P)** | Chose option (a): six live same-document iframes (`./#poster-N`), lazy-loaded on first toggle, scaled via JS-measured `--proof-scale`. role=dialog/aria-modal, focus trap (close btn + 6 labeled tiles), Enter jumps+exits, Esc exits, Ctrl/⌘+P never eaten, ≤768px unavailable. Choice + cost documented in guide. |

Plus: "Press P — proof sheet · G — grid" hint in the cover colophon (desktop only).

## Verification (contract table, all run this session)

| Claim | Command | Result |
|---|---|---|
| zero errors, all posters, both viewports | `node tools/shot.mjs … 1440x900/390x844` × 12 positions | all `"errors":[],"pageErrors":[]` |
| reduced-motion intact | same `--reduced` (desktop 900/1800/2700, mobile 4220, final) | static, complete, zero errors |
| proof mode a11y | Playwright: P→Tab→Enter→Esc + trap boundaries + Ctrl+P guard | 15/15 assertions true (`scratchpad/interact.mjs`, `trap.mjs`) |
| fps sanity | mid-anim shots waitMs 400–2650 | clean frames; misregistration open at 450ms, K mid-strike, chips trailing scanline |
| print files 6 complete pages from scroll 0 | beforeprint dispatch + emulateMedia print, full-page shot | complete, in ink (see Learnings — was broken before this pass) |
| no-JS static truth | Playwright javaScriptEnabled:false | title, race (`--f`), docket line, hidden proof all intact |

QA artifacts: `pass7-*` (settled, mid, cursor, proof, crops montages), `pass8-*`
(mobile ×7, reduced ×4, montages), `pass9-*` (print-full, nojs-p6, montage);
`final-desktop/mobile/reduced/guide` refreshed. Vision reads ≤3 per pass via PIL montage
(`montage.py` in session scratchpad).

## Learnings

1. **The print stylesheet was broken since pass 2 and nobody caught it:** every
   entrance-gated element (`opacity:0` until `.is-in`) printed blank for posters never
   scrolled into view. Fixed: `beforeprint` hook settles all posters + chart split, and
   print CSS sets `transition/animation: none !important` so queued delays land
   instantly. **Trap inside the fix:** the cover's eyebrow/roles/baseline reach
   opacity 1 *by animation* (fade-rise forwards) — animations-off froze them at 0;
   they (and the rule ink) needed explicit settled-state restores in the print block.
   Lesson: on this site, "final state" is reached by three different mechanisms
   (base CSS, transition target, animation-forwards) and print must force all three.
2. **Playwright ESM scripts must import playwright by absolute path**
   (`/home/tlupo/projects/fable25/node_modules/playwright/index.mjs`) — cwd doesn't
   drive ESM resolution.
3. `emulateMedia({media:'print'})` does NOT fire `beforeprint` — dispatch
   `new Event('beforeprint')` manually to test the hook.
4. The scanline strip trick (full-height child, bottom-edge line, translateY −100%→0)
   needs `content: none !important` in print — the js-anim rule outranks a bare
   print selector and the strip freezes mid-sweep as an orange bar otherwise.
5. Misregistration pseudo needs `padding: inherit` (the `--shift` word carries
   padding-left) and an own stacking context (`z-index: 0` on the word) so the z:-1
   copy stays above the poster ground.

## The site now

Files: index 486 · style 2727 · main 630 · guide 363 lines. Serving on :8791
(`python3 -m http.server 8791 --directory rlupo-portfolio/prototypes --bind 127.0.0.1`
from repo root if down). AA law intact — no new orange text on concrete (the transient
overprint is aria-hidden paint behind 9:1 ink; rationale in guide's honest concerns);
crosshair renders the mathematical negative of each ground (cyan on orange — noted in
guide). G grid, arrows, print, no-JS, reduced-motion all re-verified after the pass.

## Action items (next session / Trey)

1. **Trey:** review http://localhost:8791/monolith-lupo/ — scroll all six, hover the
   cover letters, press **P** (the contact sheet is live proofs), print-preview it,
   then compare against cyber-lupo (:8792, Session B).
2. On approval: adoption into the real site per the standing plan (this is still a
   prototype under `rlupo-portfolio/prototypes/`).
3. If the proof sheet's six iframes ever feel heavy on a weak machine, the documented
   fallback is CSS-drawn abstractions (guide, honest concerns).
4. Deploy-time items unchanged: re-point FILE AN INQUIRY mailto → Ask My Work URL;
   confirm canonical/og if not on treylupo.com root.

## Environment

- Branch feat/monolith-lupo, main checkout. Commit protocol honored: site + qa + guide
  + this handoff + HANDOFF.md pointer in one commit. NOT pushed.
- Harness: `node tools/shot.mjs` from `/home/tlupo/projects/fable25`.
- Session B (cyber-lupo) untouched: ../portfolio_website-cyber, :8792.
