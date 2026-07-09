---
date: 2026-07-09T16:31:49-04:00
researcher: Claude (Fable 5) — executed the direct-copy run from the 15-55-25 handoff
git_commit: 95d9ecb134f357a4f9bc4ab518b6009883ef0b84
branch: main
repository: portfolio_website (DrvFs clone at /mnt/c/Users/Trey/Downloads/portfolio_website);
  references ~/projects/fable25 (monolith spec + shot.mjs harness)
topic: "monolith-lupo BUILT — direct copy of monolith with Trey's real resume/portfolio content,
  6 posters, per-poster animation set-pieces, 4 critique passes, computational AA, zero console
  errors. Awaiting Trey's review gate, then deployment decision."
tags: [design-adoption, monolith, monolith-lupo, fable25, direct-copy, rlupo-portfolio, human-gate]
status: complete
last_updated: 2026-07-09
type: handoff
---

# Handoff: monolith-lupo built — human gate open

## Task(s)

1. ✅ **Direct-copy run executed** (per § The Prompt in
   `thoughts/handoffs/2026-07-09_15-55-25_monolith-direct-copy-next-run.md`): ONE greenfield
   static site at `rlupo-portfolio/prototypes/monolith-lupo/` — monolith's exact structure
   (scroll-snap posters, side rail, Archivo Black + Inter Tight, ink/concrete/orange, reg
   marks, hover grid, concrete texture, cover scramble) with Trey's REAL record from
   `rlupo-portfolio/constants.ts`. Six posters: cover / nspb-api / FerroML / HRF / project
   register / open-to-work. All six content-map rows honored; zero invented facts.
2. ✅ **Animation mandate delivered**, one set-piece per poster: cover scramble +
   settle-thud; notice assembles + 8H→<1H stamp slams in + rotating SVG certification seal;
   3.9× counts up from 1.0×; RMSLE counts DOWN 1.00→0.48 after the forecast bars draw;
   register rows print + chips stamp last; orange block slides in + link underlines stagger.
   All reduced-motion-safe (gated on `html.js-anim`, only added when JS runs AND motion
   allowed), rAF counters resolve to final value on `document.hidden`.
3. ✅ **4 critique passes** (3 builder + 1 director), PNGs on disk in
   `rlupo-portfolio/prototypes/monolith-lupo-qa/` (34 files). Zero console/page errors at
   every viewport and scroll position. Full history honestly recorded in
   `monolith-lupo/guide/index.html`.
4. ⏳ **Trey gates:** review at http://localhost:8791/monolith-lupo/ (spec comparison at
   http://localhost:4179/monolith/). Approve / iterate; curation calls (featured projects,
   exact wording) are his at review.
5. ⏳ (After approval) deployment decision: static Vercel deploy as-is vs React port —
   static needs no port. Note [[project-canonical-clone-wsl]]: don't push from this DrvFs
   clone; gated on Vercel Step 0.
6. ⏳ Work is UNCOMMITTED (this session did not commit source; Trey asked for build + gate).
   `prototypes/monolith-lupo/**` + qa dir + this handoff are untracked.

## Critical References

- `rlupo-portfolio/prototypes/monolith-lupo/` — the deliverable: `index.html` (372) ·
  `style.css` (1827) · `main.js` (293) · `guide/index.html` (221).
- `thoughts/handoffs/2026-07-09_15-55-25_monolith-direct-copy-next-run.md` — the brief this
  run executed (content map, post-mortem, prompt).
- `~/projects/fable25/sites/monolith/` — the spec it copies (live :4179/monolith/).

## Learnings

- **Fixed-chrome trap, new variant:** poster 6's orange block bottom edge CROSSES the nav
  rail — links 01–05 sat on orange, 06 below on ink; after the AA-driven "ink on orange"
  recolor, the active 06 was ink-on-ink invisible. No float color survives a rail
  straddling two grounds → the rail becomes a self-grounded ink plate on that poster
  (`style.css` `body[data-rail="plate"]` block). Audit fixed chrome against PARTIAL grounds,
  not just poster backgrounds.
- **Monolith itself fails AA in spots** — computational audit caught inherited failures:
  notice header ink@0.65 on concrete = 3.92:1, rail numbers 0.55 = ~2.3–3.5:1, colophon/
  footer at reduced opacity. On orange, ONLY full ink passes (4.75:1) — tint hierarchy is
  impossible there; use size/weight. All raised to passing values in this build.
- **Skip-link at `translateY(-150%)` leaks a 2px sliver** at the top of the viewport
  (padding makes the element taller than 150% clears); -250% fixes it.
- **Mobile at ≤390px:** `--edge-v` collapses to 1.25rem which puts eyebrows exactly on the
  corner reg marks (20px+24px) — poster layouts need `padding-top: 3rem` on mobile.
- Vision budget stretch: montaging 2–3 mobile shots into one PNG (PIL) = one Read.

## Verification

| Claim | Command run this session | Result |
|---|---|---|
| site live, zero errors (after last edit) | `node tools/shot.mjs http://localhost:8791/monolith-lupo/ …final-desktop.png 1440x900 3500` | `{"errors":[],"pageErrors":[]}`, docHeight 5400 (6 posters) |
| guide zero errors (after last edit) | same harness on `…/monolith-lupo/guide/` | `{"errors":[],"pageErrors":[]}`, docHeight 3439 |
| mobile zero errors | harness 390x844, scrollY 0/844/…/4220 | all `{"errors":[],"pageErrors":[]}`, docHeight 5064 |
| reduced-motion static OK | harness `--reduced` desktop 0 + 2700 + 900 | zero errors; entrance CSS gated on `html.js-anim` which JS omits under reduce |
| file sizes | `wc -l prototypes/monolith-lupo/*` | index 372 · style 1827 · main 293 · guide 221 |
| servers up | `curl -w %{http_code}` both | 8791=200 · 4179=200 — restarts in 15-55-25 handoff § Verification |
| QA shots on disk | `ls prototypes/monolith-lupo-qa/ \| wc -l` | 34 PNGs incl. final-desktop/final-mobile |
| AA: orange/concrete 1.79 · orange/ink 4.75 · ink@0.78/concrete 5.37 · ink@0.65/concrete 3.92 (fixed) · ink@0.72/orange 3.29 (fixed) · concrete-dark/ink 4.80 | `node -e` WCAG blend script (this session) | as listed; every failing pair remediated in style.css |
| real-content line refs | `grep -n "title\|metric" rlupo-portfolio/constants.ts` | nspb-api :21/:27 · FerroML :37/:45 · HRF :73/:80 · register :54–146 · timeline :157–169 |
| HEAD at write time | `git rev-parse HEAD` | `95d9ecb…0b84` (branch main) |

## Artifacts

- `rlupo-portfolio/prototypes/monolith-lupo/{index.html, style.css, main.js, guide/index.html}` — NEW, uncommitted
- `rlupo-portfolio/prototypes/monolith-lupo-qa/` — 34 QA PNGs incl. `final-desktop.png`, `final-mobile.png`
- This handoff; `HANDOFF.md` pointer updated
- Memory updated: `monolith-adoption-fable-run` (arc + AA numbers + traps)

## Action Items & Next Steps

1. **Trey reviews** http://localhost:8791/monolith-lupo/ (desktop + phone; try G key, try
   print preview, check `/guide`). Verdict: approve / iterate-with-notes.
2. If approved: commit `prototypes/monolith-lupo/**` (+ qa if wanted) — then the deployment
   decision (static Vercel project vs React port). Static = zero port work.
3. If iterating: the guide's "honest remaining concerns" lists the known soft spots (cover
   title at 14vw vs monolith's 15vw fill; "SSE" as the weakest register metric; marginalia
   at 0.38 opacity is aria-hidden duplication by monolith precedent).

## Other Notes

- Easter eggs shipped: **G** pins the blueprint grid; a print stylesheet turns the annual
  into an ink-on-paper filed resume; stamp straightens 2° on hover.
- Servers at write time: :8791 now serves the whole `rlupo-portfolio/prototypes/` tree
  (studies moved to /fable-monolith/…), :4179 fable25, :3000 React dev. All fragile.
- CLAUDE.md still describes the pre-carousel scroll layout — stale, 4th consecutive handoff
  flagging it; harmless to this static build.
