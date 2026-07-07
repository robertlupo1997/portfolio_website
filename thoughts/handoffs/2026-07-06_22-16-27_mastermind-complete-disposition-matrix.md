---
date: 2026-07-06T22:16:27-04:00
researcher: Claude (Fable 5) — mastermind session for Trey
git_commit: 58ad820083e6968feefd0a8b16dd4c0784b3df6c
branch: main
repository: portfolio_website (hub). Also holds local commits this session: ironclad, ~/experiments/AutoML (mlforge), ~/experiments/ferroml, ~/experiments/gsd-ml, ~/projects/ledge, ~/projects/atlas, ~/experiments/ReadFlow; ledge PUSHED (backup); profile-README draft in session scratch.
topic: "Mastermind session complete — launch READY TO PUSH + disposition matrix: every project FINISHED / PLAN-TO-FINISH / TERMINAL"
tags: [mastermind, disposition-matrix, launch, step-0, finish-state-specs]
status: complete
last_updated: 2026-07-06
type: handoff
---

# Handoff: the whole estate is specced — read the master plan first

> **If you read one file: `docs/superpowers/plans/2026-07-06-mastermind-master-plan.md`** —
> it contains the tracks, the DISPOSITION MATRIX (every project → finished / plan-to-finish /
> terminal, with the path to each in-repo finish-state spec), the recommended execution order,
> and the standing rules. This handoff is the evidence layer under it.
> Predecessor handoff (launch-gate detail): `2026-07-06_20-52-11_launch-gates-complete-ready-to-push.md`.

## Task(s)

1. ✅ Launch gates (B cards / C panel / README / evals 20-21 @95%) — executed, task-reviewed,
   final-reviewed (opus): READY TO PUSH. 18 local commits on main. See predecessor handoff.
2. ✅ Disposition matrix (Trey's mandate "spec every last one"): 7 planning agents + controller
   wrote finish-state specs INTO each repo (paths + commits in Verification). Matrix committed
   into the master plan.
3. ✅ FerroML P3: architecture map + v1 design spec (controller-authored) committed to ferroml.
4. ✅ Ask Terminal: implementation plan committed (9 tasks).
5. ⏳ **TREY GATE 1 — Vercel Step 0** (Production Branch off `main`), then: push → preview →
   capped key → promote → P1 Task 5 live verification (plan: `docs/superpowers/plans/2026-07-04-p1-finish-line.md` Tasks 4-5).
6. ⏳ **TREY GATE 2 — go/no-go on 4 public pushes:** ironclad banner (76dc088), mlforge banner
   (2666cfa), profile README (7cb44e7 in scratch — content recap in scratch `sdd/hygiene-report.md`;
   if scratch expired, redo from the audit notes in the master plan), optional private readflow backup repo.
7. ⏳ Execution waves (order in master plan): Wave 1 = publicly-broken installs (gsd-ml PyPI,
   ferroml-plugin manifest); Wave 2 = understudy P4 + Ask Terminal + resume ship Jul 18 +
   company list; Wave 3 = FerroML P3; Wave 4 = ironclad go/no-go, ledge 2-session finish
   (⚠️ de-identify FIRST), atlas via understudy, ReadFlow 4 tasks.

## Critical References

- `docs/superpowers/plans/2026-07-06-mastermind-master-plan.md` — THE document.
- `.superpowers/sdd/progress.md` — session ledger (gate tables, reviews, adjudications, incidents).
- Career strategy: `~/experiments/Ornith/docs/superpowers/specs/2026-07-04-career-direction-design.md`.
- Memory (auto-loads in `~` sessions): `project_career_masterplan.md` (matrix pointer + hard gates),
  `feedback_subagents_not_fable.md` (Trey's standing rule: subagents always on explicit non-Fable models).

## Recent changes (since predecessor handoff)

- fa53025 master plan committed → 58ad820 disposition matrix added (portfolio repo, docs-only).
- Finish-state specs committed in 6 other repos + ferroml P3 spec + Ask Terminal plan (this repo).

## Learnings

- gsd-ml README's `pip install gsd-ml` 404s (never published); ferroml-plugin's install command
  is not a real Claude Code command AND the repo lacks `.claude-plugin/marketplace.json` — both
  are live public credibility damage; fix = Wave 1.
- **ledge/Gjald contains employer naming** (Franklin Street / FS-PARENT in `seed.py` + 3 SKILL.md
  files). Data is synthetic → reskin, not incident. HARD GATE before any public exposure.
- atlas execution loop has never completed one cycle; its spec self-corrected its own statistics
  (Sharpe SE, CPCV paths, paper-trading significance limits) — keep that rigor.
- No public dataset pairs construction plans with bids — ironclad's measurable v1 requires
  hand-curated public-sector bid packages (~5).
- Subagent ops: every reviewer/planner idles without sending (one poke retrieves); one planner
  died of context overflow — re-dispatch with an explicit READING BUDGET worked.

## Verification

| Claim | Command run this session | Result |
|---|---|---|
| HEAD 58ad820, main, 18 unpushed | `git rev-parse HEAD` / `git log origin/main..main \| wc -l` | `58ad820…` / `18` |
| Unit tests pass at HEAD | `npm test` | `Tests 40 passed (40)` |
| tsc clean at HEAD | `npx tsc --noEmit` | no output |
| Build clean at HEAD | `npm run build` | `✓ built in 3.07s` |
| e2e pass at HEAD | `npm run test:e2e` | `11 passed (34.9s)` |
| All 10 planning docs exist | `ls <10 paths> \| wc -l` | `10` (ironclad, atlas, ledge, gsd-ml, ferroml-plugin, ReadFlow, ferroml P3 spec, ask-terminal plan, master plan, memory file) |
| Evals ≥90% | `npm run evals` (earlier this session, corpus unchanged since — commits after were docs-only) | `20/21 (95%)` |
| In-repo spec commits exist | reported by planning agents, spot-checked via `git log -1` for ironclad/AutoML/profile clone earlier | ironclad 4a11da2 · atlas 0b240e9+9687453 · ledge 6726b1b · gsd-ml 63012cf · ReadFlow 7befb7e · ask-terminal cf37e38 · ferroml P3 spec committed |
| Production still OLD deploy (pre-push) | `curl -sL -w %{http_code} https://www.treylupo.com/resume.pdf` (earlier this session) | `404` — fixed by Step 0 + push + promote |
| ledge backup pushed | `git -C ~/projects/ledge status -sb` (after push) | `## main...origin/main` in sync |

## Artifacts

Portfolio repo: master plan (+matrix), Ask Terminal plan, handoffs ×2 + HANDOFF.md pointer,
session ledger, 18 unpushed commits. Other repos: finish-state specs listed above (all committed
locally, none pushed except ledge's pre-existing code backup). Memory: 2 files + index updates.
Session scratch (temp, re-derivable): SDD reports, screenshots, profile-README clone.

## Action Items & Next Steps

1. **TREY: Vercel Step 0**, then say "Step 0 done" → next session pushes, verifies preview, runs
   P1 Task 5 live checks after promote.
2. **TREY: go/no-go** on the 4 public pushes (item 6 above).
3. Next Claude session: Wave 1 (gsd-ml PyPI publish, ferroml-plugin manifest fix) — both specs
   are in-repo and session-sized.
4. Then follow the master plan's wave order. Resume any session with `/resume_handoff`.

## Other Notes

- HARD RULES: no portfolio push before Step 0 · ledge de-identify before public · subagents
  never on Fable · no invented metrics; "Franklin Street" never "Franklin Street Properties".
- Dev server: `cd rlupo-portfolio && npm run dev` → :3000. Evals need `.env.local` key (present).
- `~/projects/treylupo` deletion awaits Trey's confirm (kill list).
