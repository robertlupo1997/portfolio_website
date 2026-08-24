# Mastermind Master Plan — all projects → finished portfolio

**Date:** 2026-07-06 · **Author:** Claude (Fable 5), acting as delegated mastermind per Trey's directive ("be the mastermind, create the plans, do all of it") · **Status:** Active
**Consolidates (does not re-decide):** career-direction spec (Ornith repo, 2026-07-04, APPROVED), P1 finish-line plan (2026-07-04), B project-improvement spec (2026-07-05, APPROVED), C AI-section spec (2026-07-05), Ask Terminal spec (2026-07-05, APPROVED design), understudy OSS handoff (2026-07-06).

## North star (locked 2026-07-04, unchanged)

Applied AI Engineer, FDE-emphasized. Three proofs with hard deadlines:
**P1** treylupo.com + Ask My Work live — **Jul 11** · **P2** understudy OSS + writeup on treylupo.com — **Jul 31** · **P3** FerroML intelligent AutoML v1 — **Aug 29**. Resume v3 Jul 18 (content already done Jul 4). Applications: selective Aug 1, volume Sep 1.

## State verified 2026-07-06 (evidence, not recollection)

- Portfolio repo: main @ db20299, 7 unpushed commits (all docs/specs), working tree has only untracked scratch. **Baseline gates all green:** 40/40 unit, tsc clean, build clean, 11/11 e2e.
- Resume v3 content (NetSuite + month-end app bullets): **already committed** in 771043b — HTML, `content/resume.txt`, `public/resume.pdf` all verified containing it. P1 Task 1 is DONE.
- Live site: www.treylupo.com serves the **old rollback deployment** — `/resume.pdf` 404s, no `/api/ask`. Everything is gated on **Vercel Step 0 (Trey, manual)**.
- `rlupo-portfolio/README.md` is still the AI-Studio scaffold (P1 Task 2 NOT done).
- understudy: published PUBLIC+MIT, fresh-clone verified, local in sync. P4 (portfolio port) not started, Step-0-gated for the push but local work is unblocked.
- ANTHROPIC_API_KEY present in `rlupo-portfolio/.env.local` → evals runnable locally.

## The portfolio project set (locked by Trey 2026-07-05 — B spec)

8 cards: **featured** nspb-api · FerroML · Ask-My-Work (new); **all** Revenue Forecast · KKBOX · Ironclad (design-stage reframe) · FerroML Plugin · GSD-ML (absorbing MLForge). Obj-detect removed. Atlas/trading stays off the site. understudy joins as the P2 writeup/card by Jul 31 (9th card or replacing a weaker slot — decide at P4).

## Tracks, in priority order

### Track 1 — LAUNCH (deadline Jul 11) — critical path
All local, **NO pushes until Step 0**. Gates: unit + tsc + build + e2e + evals ≥90%.
1. ✅ Resume v3 (done, verified).
2. Execute **B spec** — card overhaul in `constants.ts`, obj-detect removal (card + corpus + viz list), MLForge→GSD-ML merge, Ask-My-Work featured card with panel-opening CTA, corpus regen. *(this session)*
3. Execute **C spec** — Ask panel token conformance (14 rows), citations-as-tags, starters as terminal list, z-index tokens, DESIGN.md not-adopted trap fixed. *(this session)*
4. P1 Task 2 — real README replacing the AI-Studio scaffold. *(this session)*
5. P1 Task 3 — corpus regen + full gates + evals with the local key. *(this session)*
6. **TREY (only human step): Vercel Step 0** — dashboard → Settings → Git → change Production Branch off `main` (e.g. `production`), then say "pushed OK". Then: push main → review preview URL → add capped ANTHROPIC_API_KEY env var → promote.
7. P1 Task 5 — live verification (site 200, resume 200, ask answers with citations, rate limit 429).

### Track 2 — P2 close-out (Jul 31, aim Jul 15)
1. understudy `WRITEUP.md` (real measurements: 9B 3/5 @53 tok/s, 35B 5/5 @14 tok/s, 9× token savings) → treylupo.com card + corpus + resume link (Ornith P4 plan exists).
2. Ornith repo: push the 15 unpushed spec/plan commits (private repo — safe backup).
3. Optional: understudy pointed at atlas as first real consumer (from Ornith handoff agenda).

### Track 3 — Ask Terminal (post-launch flagship; spec approved)
Needs an implementation plan (superpowers:writing-plans) — write after launch. Never a launch blocker (Trey's decision #1 on the spec).

### Track 4 — P3 FerroML intelligent AutoML v1 (Aug 29)
1. ✅ Architecture mapping DONE 2026-07-06 → `~/experiments/ferroml/thoughts/2026-07-06-p3-architecture-map.md`. Headline: all statistical machinery exists; the v1 slice is ~150 lines of additive Rust (`statistically_best_model()` ~20, `render_benchmark_report()` ~50, `ModelCardGenerator::from_automl_result()` ~80) + PyO3 exposure. P3 is much smaller than budgeted — could land weeks early.
2. Next: architecture design (brainstorm → spec) from the mapping report, then plan, then execution. Any commit to ferroml also refreshes its "is it maintained?" signal (last real commit Apr 30).
3. Backlog surfaced by the map: `clippy::unwrap_used` untriaged in automl/cv/neural/hpo/metrics; `ferroml.model_selection` Python parity gap (no cross_val_score/GridSearchCV); 5 suppressed RustSec advisories to review.

### Track 5 — Public-repo hygiene (credibility patches; small, high ROI)
Prepared this session, **pushed only on Trey's go** (public-facing):
1. **ironclad**: README status banner ("design spec + parsers; Phases 1–4 unimplemented") — same honesty principle Trey approved for the card. Empty `src/` with bold claims is the single biggest credibility risk found in the audit.
2. **ferroml-plugin**: fix/verify the `claude plugin add` install command (marketplace syntax) so a technical reader can actually install it.
3. **Profile README (robertlupo1997)**: FerroML moves from "currently building" → Featured with PyPI badge; add treylupo.com link; reposition "ML and data engineer" → applied AI engineer; mention understudy.
4. **mlforge**: archive banner pointing to gsd-ml (matches the locked MLForge→GSD-ML merge).

### Track 6 — Preservation (no decisions needed)
1. **ledge**: 11 unpushed TUI commits (phases 5b–7) pushed to private origin as backup. *(this session)*
2. **ReadFlow**: commit the applied-but-uncommitted bug fixes its HANDOFF documents. *(this session)*

## Kill / archive list (mastermind calls)

- `~/projects/treylupo` (Next.js monorepo, 2 commits, May): **dead rewrite attempt — archive/delete.** portfolio_website is the living site.
- `~/experiments/FSML` (no git, .7z archive): already self-archived; leave.
- mlforge (repo): archived-with-pointer per Track 5.4; gsd-ml is the successor and gets the post-launch improvement pass Trey noted (B spec decision 2).
- atlas: paused by design (career spec decision 5: trading stays out of the top-3). Revisit post-Sep-1 as understudy's consumer.
- nspb-api/nspb-tools: stable, complete, private. No action except the case-study/Ask-engine story already in the B spec.

## DISPOSITION MATRIX — every project, one verdict (added 2026-07-06 late session, per Trey's "spec every last one" mandate)

Finish-state specs were produced by dedicated planning agents (opus/sonnet), each committed INTO its project's repo. Every project Trey owns now has exactly one disposition.

### FINISHED (evidence exists; no plan needed)
| Project | Evidence / residual |
|---|---|
| portfolio_website | Launch gates executed+reviewed this session; READY TO PUSH pending Step 0 |
| understudy | Published v0.1, fresh-clone verified; residual = P4 portfolio port (below) |
| kkbox-churn | 0.97 AUC, live HF Space, CI, release; optional: refresh stale release tag |
| hierarchical-revenue-forecast | Strong README, CI; optional: add a release tag |
| nspb-api / nspb-tools | Complete, stable, private by design; public story = card + Ask engine |
| claude-toolkit | Living personal toolkit — no done bar applies; keep off portfolio |
| ReadFlow | Works (125/125 sentences verified); 4 tiny finish-for-self tasks — `~/experiments/ReadFlow/docs/2026-07-06-finish-state-disposition.md` |

### PLAN-TO-FINISH (spec committed in-repo; sessions estimated)
| Project | Spec | Bar & size | Scheduling call |
|---|---|---|---|
| FerroML P3 | `~/experiments/ferroml/thoughts/2026-07-06-p3-intelligent-automl-v1-spec.md` | 5 phases; statistically-grounded selection + honest benchmark + model card → PyPI 1.1.0 | Jul-Aug (career P3, due Aug 29) |
| Ask Terminal | `docs/superpowers/plans/2026-07-06-ask-terminal-implementation.md` (cf37e38) | 9 tasks; client-driven loop, $5 caps | Post-launch flagship, Jul |
| gsd-ml | `~/experiments/gsd-ml/docs/2026-07-06-finish-state-spec.md` (63012cf) | 6 phases; **`pip install gsd-ml` currently 404s — public claim broken** | Phase A (PyPI publish) = credibility-urgent, this week |
| ferroml-plugin | `~/experiments/ferroml/ferroml-plugin/docs/2026-07-06-finish-state-spec.md` | 3 phases; **install broken publicly (no marketplace.json, wrong README command)** | Phase 1 = credibility-urgent, this week |
| ledge/Gjald | `~/projects/ledge/docs/2026-07-06-finish-state-spec.md` (6726b1b) | FINISH, 2 sessions; suite 787/788 green (README's "480" stale) | ⚠️ **Phase 1 de-identify FIRST — "Franklin Street"/FS-PARENT named in seed.py + 3 SKILL.md files (synthetic data; reskin to fictional co). HARD GATE before any public exposure.** Then candidate future card (FP&A-meets-AI) |
| ironclad | `~/projects/ironclad/docs/2026-07-06-finish-state-spec.md` (4a11da2) | 5 sessions to a MEASURABLE v1 (no public dataset exists — hand-curate ~5 public-sector bid packages) OR stay design-stage permanently | Trey chooses at review; if build: September, post-P3 |
| atlas | `~/projects/atlas/docs/2026-07-06-finish-state-spec.md` (0b240e9+9687453) | 6 phases + human-only money gate; execution loop has never run one cycle; ~58% understudy-delegable; de-risk checkpoint = one Mode B cycle first | Personal track, not portfolio; run behind everything above via understudy queue |

### TERMINAL (decided; rationale recorded)
mlforge (superseded by gsd-ml; banner committed, push on go) · open-vocab (removed from portfolio by Trey; repo stays public — it's solid) · treylupo monorepo (dead rewrite — DELETE, Trey confirm) · FSML/DealForecast (work-derived, off-limits) · Ornith (private workbench; its public artifact IS understudy) · legacy private repos (visionkit, qwen3-tts-app, NetsuiteDashboard, procore-*, coursework — out of scope, no action).

### Recommended execution order (mastermind call)
1. **NOW:** Trey Step 0 → push → preview → promote (launch, Jul 11).
2. **Wave 1 (this week — fixes publicly-broken claims):** ferroml-plugin Phase 1 + gsd-ml Phase A + the 4 hygiene pushes (on Trey's go).
3. **Wave 2 (Jul):** understudy P4 writeup+card · Ask Terminal build · resume v3 ship (Jul 18) · company list.
4. **Wave 3 (Jul-Aug):** FerroML P3 phases 1-5.
5. **Wave 4 (Sep+):** ironclad go/no-go · ledge 2-session finish · atlas via understudy queue · ReadFlow one short session anytime.

## Standing rules (from the specs — do not violate)

- **No portfolio push until Vercel Step 0** (pushes to main are production events until then).
- Every card claim traceable to corpus/README/resume; card copy and corpus must not contradict (the Ask engine will be interrogated about them).
- "Franklin Street", never "Franklin Street Properties". No invented metrics.
- Ask engine: Haiku 4.5, 10/hr/IP, caps stay.
