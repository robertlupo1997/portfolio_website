---
date: 2026-07-09T13:08:41-04:00
researcher: Claude (Fable 5) — autonomous monolith-adoption run (orchestrator + 3 builder agents)
git_commit: 8c5bb18a1b7515243a2a38a589d9059aaadfb4b2
branch: main
repository: portfolio_website (DrvFs clone at /mnt/c/Users/Trey/Downloads/portfolio_website);
  references ~/projects/fable25 (monolith source, method, screenshot harness — read-only this session)
topic: "Fable monolith-adoption run COMPLETE — three greenfield studies built, critiqued, verified.
  HUMAN GATE: Trey cold-reviews and picks a direction; a later session ports the winner into React."
tags: [design-adoption, monolith, fable25, fable-run, brutalist, rlupo-portfolio, human-gate]
status: complete
last_updated: 2026-07-09
type: handoff
---

# Handoff: three monolith-adoption studies done — awaiting Trey's pick

## Task(s)

1. ✅ **The Fable run** (per `thoughts/handoffs/2026-07-09_12-07-59_fable-monolith-adoption-run.md`,
   executed this session): authored 3 briefs, built all 3 greenfield studies via parallel builder
   agents, each ran a ≥3-pass hostile-critique loop, director-verified every claim, fixed one
   release blocker. Constitution held: zero console errors, AA verified computationally,
   reduced-motion fallbacks, guides, finals.
2. ⏳ **HUMAN GATE (Trey, now):** cold-review the three studies at `http://localhost:8080/`
   (restart command in Verification) and pick a direction. No winner was picked by the model,
   by design.
3. ⏳ **Port session (later, separate):** port the chosen direction into the React carousel —
   React 19 + TS, `var(--token)`, `constants.ts` data, Lenis + skip-link + per-slide VizCanvas
   preserved, real projects injected then (disposition matrix in `thoughts/` governs curation).

## Critical References

- `rlupo-portfolio/prototypes/fable-monolith/BRIEFS.md` — the design constitution + the three
  briefs as authored (carousel contract, shared copy, AA traps, structured-output schema).
- `thoughts/handoffs/2026-07-09_12-07-59_fable-monolith-adoption-run.md` — the runbook this
  session executed; port constraints for the later session live in its Action Item 9.
- `~/projects/fable25/sites/monolith/` — the adopted source aesthetic (unchanged).

## Recent changes (all new files; no React/portfolio source touched, nothing deleted)

- `rlupo-portfolio/prototypes/fable-monolith/BRIEFS.md` — constitution + 3 briefs.
- `rlupo-portfolio/prototypes/fable-monolith/index.html` — deliberately unstyled cold-review
  entry page (alphabetical links, no framing).
- `rlupo-portfolio/prototypes/fable-monolith/{ledger,broadside,graft}/` — each:
  `index.html`, `style.css`, `main.js`, `guide/index.html`.
- `rlupo-portfolio/prototypes/fable-monolith/qa/{ledger,broadside,graft}/` — pass1–3 (ledger:
  pass4) shots + `final-desktop.png` + `final-mobile.png` each.

## Learnings

- **The one defect all three self-review loops missed** was cross-slide: ledger's
  `position:fixed` carousel controls were colored for the ink slide only — invisible (1.00:1)
  on the concrete slides. Self-critique judged slides one at a time; fixed chrome must be
  audited against EVERY ground it floats over. Fixed at `ledger/style.css:384`
  (`--ink-80` default) + `ledger/main.js:58` (`.carousel-controls--on-ink` toggled when
  `n === 2`). The port session should keep this discipline: the React carousel also has
  fixed chrome (Header, controls).
- **Deep links made a carousel screenshotable:** `?slide=N` / `?overlay=1` — the harness's
  `scrollY` arg is useless for carousels. Same idea will be useful for QA-ing the React port.
- **Departure Mono is NOT on Google Fonts.** Stand-ins used in studies: VT323 (broadside
  display; taste-gated — reads DEC terminal at ~200px, verdict documented in its guide) and
  Space Mono (graft labels). At port time the real self-hosted Departure Mono replaces them;
  broadside's guide flags re-judging the CRT texture at production fidelity.
- **Orange-on-concrete fails even large-text AA (1.79:1).** Ledger's discipline: orange text
  ONLY on ink panels (4.75:1); on concrete, orange is non-text decoration. Verified against
  every usage. This constraint must survive the port if concrete-light wins.
- The three builder agents each returned structured JSON (schema in BRIEFS.md); ledger's
  includes the honest pass-4 entry. Guides at `/<slug>/guide/` document brief, technique
  with real code excerpt, and critique history.

## Verification

| Claim | Command run this session | Result |
|---|---|---|
| HEAD / branch unchanged all session | `git rev-parse HEAD` / `--abbrev-ref HEAD` | `8c5bb18…4b2` / `main` (no commits made before this handoff) |
| study server up, all 7 routes 200 | `curl -w %{http_code}` root + 3 studies + 3 guides | all `200` — restart: `cd /mnt/c/Users/Trey/Downloads/portfolio_website && python3 -m http.server 8080 --directory rlupo-portfolio/prototypes/fable-monolith --bind 127.0.0.1 &` |
| zero console/page errors, ledger (post-fix) | `node tools/shot.mjs` from `~/projects/fable25` on `/ledger/` + `?slide=1` + `?slide=2` + `?overlay=1` | `errors:[] pageErrors:[]` × 4 |
| zero console/page errors, broadside | same, 6 states incl. guide + `--reduced` | `errors:[] pageErrors:[]` × 6 |
| zero console/page errors, graft | same, 5 states incl. guide + `--reduced` | `errors:[] pageErrors:[]` × 5 |
| ledger control contrast fixed | `node -e` WCAG snippet on shipped colors | ink-80/concrete 5.64 · ink/concrete 8.50 · concrete/ink 8.50 · concrete-dark/ink 4.80 · cream/ink 14.74 — all ≥4.5 |
| ledger fix wired to slides | `grep -n 'on-ink' ledger/main.js` | `58:    controls.classList.toggle('carousel-controls--on-ink', n === 2);` |
| dark-token studies use audited palette | `grep -oE '#[0-9A-Fa-f]{6}' graft/style.css \| sort -u`; accent usages inspected in both | exactly the portfolio tokens; `#F0704C` only non-text / ≥24px / ink-panel text |
| exactly one `<h1>` per study | `grep -c '<h1'` × 3 index.html | `1` / `1` / `1` |
| shared copy identical across studies | `grep` for 6 copy markers × 3 studies | all present in all three (graft outro heading split by `<br>` — present at `graft/index.html:115`) |
| finals on disk | `ls qa/<slug>/` × 3 | `final-desktop.png` + `final-mobile.png` in each (ledger's regenerated post-fix, 13:04) |
| portfolio dev server untouched | `curl -w %{http_code} http://localhost:3000` (start of session) | `200` — restart: `cd rlupo-portfolio && npm run dev` |
| portfolio tests/build | — | STALE — not run; NO portfolio source changed this session (studies are additive files only) |

## Artifacts

- This handoff; `HANDOFF.md` pointer updated.
- `rlupo-portfolio/prototypes/fable-monolith/**` — everything listed under Recent changes.
- Builder structured-output JSONs: in this session's conversation log (key facts mirrored in
  each study's `/guide` critique history, which is the durable copy).

## Action Items & Next Steps

1. **Trey:** open `http://localhost:8080/` (see restart row) and cold-review the three studies
   in any order — arrow keys change slides, INDEX opens the overlay, Esc closes. Read guides
   only after forming an impression. Pick a direction (or a hybrid, or none).
2. **Trey (optional):** the working tree holds all of this uncommitted except this handoff +
   pointer + studies (committed this session, see below). `git push` remains gated on your
   Vercel Step 0 (unchanged from prior handoff).
3. **Port session (after the pick):** follow Action Item 9 of the 12-07-59 handoff — port the
   winner into the React carousel with real project data; re-audit AA on the real grounds;
   swap font stand-ins for Departure Mono; keep the fixed-chrome-vs-every-ground discipline.

## Other Notes

- Servers running at session end: :8080 (studies, this session), :3000 (portfolio dev),
  :4179 (fable25). All session-fragile; restart commands above / in the 12-07-59 handoff.
- `~/projects/fable25` was used read-only (harness + reference). `qa/` shots for these studies
  live in THIS repo, not fable25's.
- CLAUDE.md still describes the old scroll layout — still stale, still ignore it (flagged in
  the previous handoff; not fixed here since no source session touched it).
