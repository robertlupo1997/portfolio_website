---
date: 2026-07-09T15:55:25-04:00
researcher: Claude (Fable 5) — post-mortem of the 3-study adoption run + setup for the direct-copy run
git_commit: 1ceb1e46f9b38054afa126ee0b1485497993ff9e
branch: main
repository: portfolio_website (DrvFs clone at /mnt/c/Users/Trey/Downloads/portfolio_website);
  references ~/projects/fable25 (monolith source + PROMPTS.md/BRIEFS.md — the recipe to reuse)
topic: "Trey's verdict on the 3 studies: 'just OK.' Post-mortem of why, and the runbook for the
  next run: DIRECT copy of monolith with Trey's REAL resume/portfolio content, one site, full
  creative energy, ambitious animation. Ready-to-paste prompt included."
tags: [design-adoption, monolith, fable25, post-mortem, direct-copy, rlupo-portfolio]
status: complete
last_updated: 2026-07-09
type: handoff
---

# Handoff: monolith direct-copy run — post-mortem + ready-to-run prompt

## Task(s)

1. ✅ **Previous run complete but verdict "just OK"** — three greenfield studies
   (`rlupo-portfolio/prototypes/fable-monolith/{ledger,broadside,graft}`, live at
   http://localhost:8791/). Kept as reference; do not delete.
2. ✅ **Post-mortem** (this doc, § Learnings) — why the studies came out mid.
3. ⏳ **NEXT RUN (a fresh Fable session executes this):** build ONE site that directly copies
   monolith (http://localhost:4179/monolith/) — same structure, palette, type, scroll-snap
   poster pages — but with **Trey's real resume/portfolio content**, and a per-poster
   animation mandate. The ready-to-paste prompt is in § The Prompt. Greenfield static build
   in `rlupo-portfolio/prototypes/monolith-lupo/`.
4. ⏳ (After Trey approves the result) decide deployment: monolith is static HTML/CSS/JS —
   it can deploy to Vercel as-is (as treylupo.com or a subdomain) with NO React port.
   That decision is Trey's, later.

## Critical References

- `~/projects/fable25/sites/monolith/` — `index.html` (318 lines) `style.css` (1242)
  `main.js` (186): **this time it is the SPEC, not inspiration.** Live: :4179/monolith/.
- `~/projects/fable25/PROMPTS.md` — Layer 1 mission prompt (the "go nuts" energy clause),
  Layer 2a builder prompt (the execution harness — the one to customize), structured-output
  schema. `~/projects/fable25/BRIEFS.md:7-53` — build standard + iteration-pass contract;
  brief #6 (`monolith`, lines ~100-105) is the anatomy the new brief extends.
- `rlupo-portfolio/constants.ts` — **the real content source** (see content map below).
- `thoughts/handoffs/2026-07-06_22-16-27_mastermind-complete-disposition-matrix.md` — which
  projects are portfolio-ready; consult when choosing the 3-4 featured posters.

## Learnings — the post-mortem (what made the 3 studies "just OK")

Nothing Trey did was dumb; the locked plan optimized for the wrong things. Four causes,
all fixable by the next run's prompt:

1. **The carousel contract amputated monolith's soul.** What Trey loves about monolith is
   the *experience*: six full-viewport posters, scroll-snapped, each a completely different
   composition at oversized scale. The adoption run banned scroll-snap ("does not map to
   the React carousel") and mandated exactly 3 slides + 1 overlay. Result: three brutalist
   skins on the same 3-slide wireframe. Portability won; delight lost. → Next run: scroll-
   snap poster pages ARE the structure. Port-to-React worries are explicitly deferred.
2. **Placeholder copy drained the stakes.** Identical fictional filings ("REVENUE
   TELEMETRY") in all three meant nothing real to design around — monolith works because
   its copy IS its concept. → Next run: real projects, real metrics, real roles from
   `constants.ts`; the civic-notice voice becomes the resume voice.
3. **Three-way split diluted depth.** FABLE 25's quality came from one agent pouring
   everything into one site. This run split energy three ways and spent it on
   comparability (same copy, same surfaces). → Next run: ONE site, all passes, all
   upgrades into it.
4. **Motion was under-mandated.** The constitution required correct easing + reduced-motion
   but never demanded ambition; builders inherited monolith's (mostly static) restraint.
   Trey explicitly wants "cool animations and stuff." → Next run: one motion set-piece per
   poster, mandated (list in the prompt).

Also confirmed this run, still true: **orange on concrete = 1.79:1, fails all AA** (orange
text only on ink panels at 4.75:1 — monolith itself obeys this, see its `style.css:477`
comment); Departure Mono isn't on Google Fonts (monolith uses Archivo Black + Inter Tight
anyway — direct copy keeps those); fixed chrome must be AA-audited against EVERY ground it
floats over (the pass-4 lesson); `?slide=`-style deep links aren't needed this time —
scroll pages screenshot natively via the harness's scrollY arg.

## Content map (real data, from `constants.ts` — verified line refs in § Verification)

| Poster | Monolith template | Content |
|---|---|---|
| 01 COVER | MONOLITH cover (scramble h1) | `TREY LUPO` — real roles: FP&A Analyst · Data Scientist · AI/ML Engineer |
| 02 | Urban Renewal notice (dl grid) | `nspb-api` — metric `8h→<1h` VARIANCE ANALYSIS (`constants.ts:21-28`) |
| 03 | Transit Corridor giant numeral | `FerroML` — giant `3.9×` FASTER THAN SKLEARN (KMEANS) (`constants.ts:37-46`) |
| 04 | Noise Ordinance giant metric + bars | `Hierarchical Revenue Forecast` — `0.48` RMSLE, KAGGLE TOP-20% (`constants.ts:73-81`); the waveform becomes a forecast bar chart |
| 05 | Public Works register (row list) | Full project register: Ask My Work, KKBOX Churn, Ironclad, FerroML Plugin, GSD-ML… with statuses (`constants.ts:54-146`) |
| 06 | River Festival (orange block) | Contact / "OPEN TO WORK" — real links (GitHub robertlupo1997, treylupo.com); education + experience (`constants.ts:157-169`) as fine-print marginalia |

Featured-project selection may be adjusted against the disposition matrix. **Rule: never
invent metrics or facts — everything from `constants.ts` or Trey.**

## The Prompt (ready to paste into a fresh Fable session — or dispatch to one builder agent)

Which fable-25-local prompt it is: **PROMPTS.md Layer 2a (builder prompt), customized**,
with Layer 1's "go nuts" clause restored and BRIEFS.md brief #6 extended into the new
brief. Customizations vs. the adoption run: direct copy allowed (scroll-snap back), real
content, ONE site, per-poster animation mandate.

```
You are the builder studio for "monolith-lupo": Trey Lupo's actual resume/portfolio site,
built as a DIRECT copy of the monolith civic-poster annual. You built monolith; now
rebuild it with real content. This will be seen by hiring managers — go nuts and show
what you are capable of, but inside monolith's discipline: chaos gridded underneath.

THE SPEC (copy it, don't reinterpret it):
/home/tlupo/projects/fable25/sites/monolith/ — index.html, style.css, main.js. Keep:
scroll-snap poster pages, side-nav with IntersectionObserver, Archivo Black + Inter Tight,
palette (ink #1c1a17 / concrete #b9b5ad / orange #e8551a), reg marks, hover grid overlay,
CSS concrete texture, cover scramble. Live reference: http://localhost:4179/monolith/.

READ FIRST: /home/tlupo/projects/fable25/BRIEFS.md lines 7-53 — the build standard and
iteration-pass contract are in force verbatim (zero console errors; WCAG AA — orange text
ONLY on ink panels (4.75:1), NEVER on concrete (1.79:1, fails even large); reduced-motion
= dignified static page; responsive 375→1600 recomposed; one h1; guide/index.html with
brief + technique + honest critique history; ≥3 passes with PNGs on disk or it didn't
happen). CONTEXT ECONOMY: vision-Read at most THREE screenshots per pass.

CONTENT (real, non-negotiable): the six-poster map in
thoughts/handoffs/2026-07-09_15-55-25_monolith-direct-copy-next-run.md — Trey's real
projects, metrics, roles, links from rlupo-portfolio/constants.ts. Never invent a fact,
metric, employer, or date. The civic-notice voice IS the resume voice ("PUBLIC NOTICE:
variance analysis reduced 8h→<1h, pursuant to Filing nspb-api…"). Footer credit:
"Designed & built by Claude Fable 5 · 2026".

ANIMATION MANDATE (this is where you get creative — one motion set-piece per poster,
entrance-triggered via IntersectionObserver, custom cubic-bezier, all with a static
reduced-motion fallback, rAF loops pause on document.hidden):
- 01: keep the letter scramble; consider a settle-thud.
- 02: the notice assembles — rules draw in, dl rows stamp in staggered.
- 03: the giant 3.9× counts up from 1.0× as the poster enters.
- 04: the 0.48 RMSLE bars draw in as a forecast chart; the giant metric resolves last.
- 05: register rows print in sequence, status chips stamp last.
- 06: the orange block slides in; links underline on a delayed stagger.
Plus at least one site-wide upgrade of your own invention per critique pass. Anything
else you dream up is welcome if it obeys reduced-motion and the grid.

WORKSPACE: build in
/mnt/c/Users/Trey/Downloads/portfolio_website/rlupo-portfolio/prototypes/monolith-lupo/
(index.html + style.css + main.js + guide/index.html). QA shots in
/mnt/c/Users/Trey/Downloads/portfolio_website/rlupo-portfolio/prototypes/monolith-lupo-qa/
(create it). Serve via a static server on the prototypes/ tree (:8791 pattern — NOT
:8080, Windows HTTP.sys owns it and answers 404). Harness from
/home/tlupo/projects/fable25:
node tools/shot.mjs <url> <abs-out.png> 1440x900 3500 [scrollY] [--reduced]
(scroll page: use docHeight to shoot every poster; also 390x844 mobile).

FINISH: final-desktop.png + final-mobile.png + structured output
{slug, title, tagline, passes[{pass,found,changed,upgrade}], signature_technique,
remaining_concerns, console_errors_final}.
```

## Verification

| Claim | Command run this session | Result |
|---|---|---|
| monolith live (the spec) | `curl -w %{http_code} http://localhost:4179/monolith/` | `200` — restart: `(cd ~/projects/fable25 && python3 -m http.server 4179 --directory sites &)` |
| monolith source sizes | `wc -l ~/projects/fable25/sites/monolith/*` | index 318 · style 1242 · main 186 (read in full this session) |
| PROMPTS.md + BRIEFS.md exist | `ls ~/projects/fable25/{PROMPTS,BRIEFS}.md` | both present (read this session; constitution at BRIEFS.md:7-53) |
| real project data lines | `grep -n "title\|metric" rlupo-portfolio/constants.ts` | nspb-api :21-28 · FerroML :37-46 · Ask My Work :54-61 · Hier. Revenue Forecast :73-81 · KKBOX :89-98 · Ironclad :106-114 · FerroML Plugin :122-130 · GSD-ML :138-146 · education/experience :157-169 |
| disposition matrix exists | `ls thoughts/handoffs/ \| grep -i disposition` | `2026-07-06_22-16-27_mastermind-complete-disposition-matrix.md` |
| 3 studies still served | `curl` root + 3 studies + guides on :8791 | all `200` — restart: `cd /mnt/c/Users/Trey/Downloads/portfolio_website && python3 -m http.server 8791 --directory rlupo-portfolio/prototypes/fable-monolith --bind 127.0.0.1 &` (⚠️ not :8080 — Windows HTTP.sys answers 404 there) |
| orange/concrete + orange/ink ratios | `node -e` WCAG snippet (this session) | 1.79 (fails all AA) / 4.75 (passes small) — encode in any new brief |
| HEAD at write time | `git rev-parse HEAD` | `1ceb1e4…3ff9e` |

## Artifacts

- This handoff; `HANDOFF.md` pointer updated.
- Previous run's studies + post-mortem subjects: `rlupo-portfolio/prototypes/fable-monolith/**`
  (committed at `7da4ae6`; keep as reference).
- The ready-to-run prompt: § The Prompt above (no separate file — this doc is the source).

## Action Items & Next Steps

1. **Next Fable session:** read this handoff whole → confirm :4179 and a study server are up
   (restart rows above) → run § The Prompt (self-execute or dispatch one builder agent) →
   director-verify like the last run (zero-error harness re-runs, computational AA, ≥1
   vision read incl. the fixed side-nav against every poster ground) → present to Trey.
2. **Trey gates:** approve/iterate the result; then decide deployment (static Vercel deploy
   vs. React port) — the static option needs no port at all.
3. Curation calls (which 3 featured projects, exact resume wording) — Trey's, at review.

## Other Notes

- Servers at write time: :8791 (3 studies), :3000 (React dev), :4179 (fable25). All fragile.
- The 3 "just OK" studies still have reusable parts — ledger's stamp/watermark craft,
  broadside's fit-title binary search, graft's texture inversion — the next builder may
  raid them (they're committed) but the spec is monolith itself.
- CLAUDE.md still describes the pre-carousel scroll layout — stale, ignore (3rd handoff
  in a row flagging this; worth fixing someday).
