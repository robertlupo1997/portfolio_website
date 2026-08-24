# Project-improvement spec — treylupo.com cards (Workstream B)

**Date:** 2026-07-05 · **Author:** Claude (Fable 5) for Trey · **Status:** APPROVED —
Trey answered all taste questions 2026-07-05 evening (§Decisions at the end);
execution post-Fable (Opus)
**Launch gate served:** (a) "project cards/writeups improved" — one of the three gates
before deploy. Local only; NO pushes until Vercel Step 0.

**Sources:** card copy verbatim from `rlupo-portfolio/constants.ts:18-161`; proof points
from `generated/corpus.ts`, `content/resume.txt`, project READMEs. Every claim below is
citable; nothing invented.

## Principles (apply to every card)

1. **The METRIC field is an outcome number, not a category.** "AutoML FRAMEWORK" and
   "Autonomous ML RESEARCH" are labels, not metrics. If a card has no honest number, that
   is a to-do on the project, not license to pad the field.
2. **The STACK field earns its slot with specifics.** "Python / ML / Statistics" says
   nothing; "Rust / wgpu / ONNX / PyPI" says everything.
3. **No overstated completion.** A spec-stage project says so. Recruiters check.
4. **Every number traceable** to corpus/README/resume — the Ask engine will happily
   answer questions about these cards; card copy and corpus must not contradict.
5. **Fewer, harder proof points beat feature lists** (Strunk: omit needless words).

## MUST-FIX accuracy issues (before any deploy — these are wrong today)

| # | Card | Issue | Fix |
|---|---|---|---|
| 1 | KKBOX (`constants.ts:82`) | Stack says **Streamlit**; actual is React 19 + TypeScript + FastAPI + Docker (Streamlit was the prior version) | Correct the stack line |
| 2 | Revenue Forecast (`constants.ts:53-67`) | "Deployed in production at Franklin Street" conflates the OSS Kaggle-proxy project with the internal production pipeline | Split the claim: OSS project = "production-grade pipeline on a $1B+ revenue proxy (Kaggle Store Sales)"; the Franklin Street outcome ("variance analysis 8+ h → <1 h", resume.txt:16) belongs to the nspb/dashboard story |
| 3 | Ironclad (`constants.ts:103-116`) | "Built for bid analysis at Origin Construction" implies shipped; README is an MVP spec, Phases 1-4 unshipped | Reframe as design-stage: "Statistical estimation engine designed for bid analysis — spec + FerroML core in place" or move out of `active` status |
| 4 | MLForge (`constants.ts:148-161`) | Superseded by GSD-ML per GSD-ML's own README; both shown as active peers | See card decision below (merge/lineage) |

## Card-by-card: what "improved" means

### nspb-api (featured #1)
- **Keep:** the problem line ("Oracle EPM Cloud exposes no public API. I built one.") — best hook on the site.
- **Metric →** outcome: the SDK powers the dashboard that replaced a 132-page monthly
  report and cut variance analysis **8+ hours → under 1 hour** (resume.txt:16-17).
  60+ endpoints demotes to description.
- **Surface:** 114+ tests; $500M+ portfolio decisions informed; v1.0→v2.1 longevity.
- **CTA:** replace cold "case study on request" with a working mailto (or Ask-engine
  starter question: "Tell me about nspb-api").

### FerroML (featured #2)
- **Metric →** "3.9× faster than sklearn (KMeans)" — performance beats breadth ("55
  ALGORITHMS" demotes to description).
- **Surface:** 489+ cross-library correctness tests (the rigor story), GPU (wgpu) / SIMD /
  ONNX export, PyPI live link in the card footer (only GitHub today).
- **Cut:** "replaces benchmark theater" phrasing only if Trey wants a softer tone —
  otherwise keep, it's distinctive (taste Q3).

### Hierarchical Revenue Forecast (featured #3)
- **Metric →** "0.48 RMSLE — Kaggle top-20% territory" or "sub-10ms P95 inference";
  current field ("Multi-LOB HIERARCHICAL RECONCILIATION") has zero numbers, weakest
  featured metric.
- **Surface:** 1,782 series (54 stores × 33 families); Go + ONNX Runtime serving; Polars
  80× preprocessing speedup.
- **Fix:** accuracy issue #2 above (Franklin Street wording). Stack adds Go + ONNX.

### KKBOX Churn (all #4)
- **Keep metric:** 0.97 AUC (already the best-formed metric on the site).
- **Fix:** stack error (#1 above).
- **Surface:** 30GB / 970K users scale; calibration story ("log loss 0.41 → 0.11,
  isotonic"); tell the visitor what the live demo IS (React dashboard + SHAP waterfalls
  + ROI calculator).

### Open-Vocab Object Detection (all #5) — **DECISION: REMOVE**
- Trey 2026-07-05: remove the card entirely ("I didn't really do anything" — mostly
  wiring existing models). Execution: drop from `constants.ts`, drop its corpus chunks
  (Ask engine must not tout a project the site no longer shows), remove its viz capture
  from the build list. Repo can stay public on GitHub.
- The freed ALL slot has NO launch replacement. Future candidate: Trey wants to build a
  Plotly-style AI charting/viz tool ("Plotty AI" — name unconfirmed, he'll clarify).
  That is a post-launch PROJECT to brainstorm and build, not card copy; do not gate
  anything on it.

### Ironclad (all #6)
- **Fix:** completion honesty (#3 above).
- **Surface:** the market framing ($273B/yr estimating errors; ±5-10% target vs human
  ±20-30%; Monte Carlo P10/P50/P90) — strongest problem-story on the site once the
  status is honest. Stack → Florence-2 / YOLOE / PaddleOCR / FerroML.

### FerroML Plugin (all #7)
- **Metric →** "55-file skill · 6 workflows · 3 hooks" or drop the metric slot; "Claude
  Code PLUGIN" is not a metric. Stack → "Python / Claude Code plugin API".
- **Surface:** "direct Python API — no MCP server, no subprocess overhead" (the
  differentiator).

### GSD-ML + MLForge (all #8, #9) — card decision
- **Recommended:** ONE card (GSD-ML) with a lineage line ("evolution of MLForge —
  replaces subprocess CLI with native Claude Code execution"); MLForge's swarm mode +
  branch-on-stagnation become bullets of that story. Two near-identical "autonomous ML"
  cards dilute both. (Taste Q2 — this cuts a card, Trey's call.)
- **Surface (whichever survives):** git-based keep/revert experiment loop; LoRA/QLoRA
  fine-tuning support; swarm mode in git worktrees.

### NEW CARD: Ask My Work (the site's own AI engine)
- The strongest deployed-LLM proof on the site is currently invisible as a project. Card:
  problem ("Recruiters skim. Let them interrogate.") + metric ("cited answers, streaming,
  eval-suite-verified") + stack (RAG / SSE / serverless / rate-limited) + CTA = opens the
  panel itself (the card IS the demo). Resume already claims it (resume.txt:29).
- Slot: featured (taste Q1 — something else may need to yield the slide).

## Execution notes (post-Fable, Opus)

- All changes land in `constants.ts` + corpus regeneration; run the existing gates
  (40/40 unit, 11/11 e2e, tsc, build) + Ask-engine evals (card/corpus consistency).
- Order: MUST-FIX table → metric/stack fields → new card → description rewrites.
- NO pushes until Vercel Step 0 (guard: `docs/superpowers/plans/2026-07-04-p1-finish-line.md:156-165`).

## Decisions (Trey, 2026-07-05 evening — all questions closed)

1. **Ask-My-Work: FEATURED**; Revenue Forecast moves to ALL (yields its featured slide).
2. **MLForge merges into one GSD-ML card** with lineage line. NOTE from Trey: the GSD-ML
   project itself "needs more work" — expect a post-launch improvement pass on the
   project (not just the card); don't oversell current state in the copy.
3. **Tone: keep the combative edges** ("benchmark theater" etc.).
4. **Obj-detect: REMOVED** (see its section above). Future backlog: Plotly-style AI viz
   tool, name TBD.
5. **Ironclad: keep the card, reframe as design-stage.** NOTE: Trey's recall of the
   project is low — the rewritten copy must be self-explanatory from the README alone
   ($273B problem, ±5-10% vs human ±20-30%, Monte Carlo P10/P50/P90) and claim nothing
   beyond the spec + FerroML core.
6. **nspb CTA: Ask-engine deep-link** ("Ask me about nspb-api").
7. *(C spec)* **Panel backdrop: olive-tinted dim** matching site overlays.

Resulting card set (8): featured = nspb-api, FerroML, **Ask-My-Work (new)**; ALL =
Revenue Forecast, KKBOX, Ironclad, FerroML Plugin, GSD-ML (absorbing MLForge).
