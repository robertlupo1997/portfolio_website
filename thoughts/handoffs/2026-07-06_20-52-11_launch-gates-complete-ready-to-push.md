---
date: 2026-07-06T20:52:11-04:00
researcher: Claude (Fable 5) — mastermind session for Trey
git_commit: fa53025966eb89f5ac5d465b6275701af59acea9
branch: main
repository: portfolio_website (also touched: ledge [pushed], ironclad [local commit], ~/experiments/AutoML=mlforge [local commit], ~/experiments/ferroml [thoughts file], profile-readme scratch clone)
topic: "All three launch gates executed — main READY TO PUSH, blocked only on Trey's Vercel Step 0"
tags: [launch, b-spec-cards, c-spec-panel, evals, mastermind, step-0]
status: complete
last_updated: 2026-07-06
type: handoff
---

# Handoff: launch gates DONE — 15 local commits, READY TO PUSH, waiting on Step 0

> **One-line state:** Every pre-deploy gate for the Jul 11 launch is executed, reviewed, and
> verified locally on `main` (15 commits ahead of origin). NOTHING is pushed — the HARD RULE
> (no push before Trey's Vercel Step 0) held all session. Trey's 3 manual steps are the only
> remaining work for launch.

## Task(s)

1. ✅ **Mastermind master plan** (Trey delegated all project decisions 2026-07-06) —
   `docs/superpowers/plans/2026-07-06-mastermind-master-plan.md` (committed). Tracks 1-6,
   kill list, standing rules.
2. ✅ **Task B — card overhaul** (B spec, launch gate a): commits 2a859e7 + 677b346 + 356e772.
   8-card set (Ask-My-Work featured; obj-detect removed; MLForge→GSD-ML; Ironclad design-stage;
   4 MUST-FIX accuracy items; PyPI/LIVE footer links). Reviewed + re-reviewed Approved.
3. ✅ **Task README** (P1 T2): commit 8e83378, controller-verified.
4. ✅ **Eval gate** (P1 T3): fixture granularity fix 2461757 (additions-only); final score 20/21 (95%).
5. ✅ **Task C — panel conformance** (C spec, launch gate c): commit 2e9ff3f, all 14 token rows
   PASS, quality Approved. Root DESIGN.md (not-adopted candidate) deleted.
6. ✅ **Final whole-branch review** (Opus): READY TO PUSH, 0 Critical/Important. Both awareness
   items acted on in 9a0fb00 ("Agentic" not "Semantic" retrieval — `lib/ask/search.ts` is TF-IDF;
   ironclad activity entry → design-stage).
7. ✅ **P3 FerroML architecture map** (career-spec sequence): report at
   `~/experiments/ferroml/thoughts/2026-07-06-p3-architecture-map.md`. Headline: v1 slice ≈150
   lines additive Rust + PyO3 exposure.
8. ✅ **Preservation**: ledge's 11 stranded TUI commits pushed to private origin.
9. 🚧 **Repo-hygiene drafts (local commits, NOT pushed — need Trey's go):** ironclad@76dc088
   honest banner; mlforge(~/experiments/AutoML)@2666cfa superseded banner; profile README
   rewrite @7cb44e7 in scratch clone `/tmp/claude-1000/-home-tlupo/1bc91426-e629-4a16-9b54-f8d2f246a49a/scratchpad/profile-readme` (scratch is session-temp — if expired, re-derive from hygiene report or redo; content summary in `scratchpad/sdd/hygiene-report.md`).
10. ⏳ **TREY: Vercel Step 0 → push → preview → key → promote → P1 T5 live verification.**
11. ⏳ Post-launch queue: understudy P4 (writeup + card), Ask Terminal plan, P3 FerroML spec,
    GSD-ML improvement pass, eval retrieval hardening (plugin question ranks gsd-ml over
    ferroml-plugin), AA token calibration (--text-placeholder idea; --text-secondary +0.11).

## Critical References

- `docs/superpowers/plans/2026-07-06-mastermind-master-plan.md` — the all-project plan.
- `.superpowers/sdd/progress.md` — full session ledger (gate tables, adjudications, process note).
- `docs/superpowers/plans/2026-07-04-p1-finish-line.md` Tasks 4-5 — Trey's manual steps, verbatim.
- Memory (auto-loaded in ~ sessions): `project_career_masterplan.md`, `feedback_subagents_not_fable.md`.

## Recent changes

15 unpushed commits db20299→fa53025 (7 were pre-session spec/plan docs). This session's 8:
2a859e7 (constants.ts full card rewrite + types.ts ctaAsk + App/Carousel/CarouselSlide/AskPanel
CTA wiring + viz params/captures + corpus + evals), 8e83378 (rlupo-portfolio/README.md),
677b346 (FerroML liveUrl + corpus), 356e772 (CarouselSlide.tsx footer renders liveUrl),
2461757 (evals/questions.json granularity), 2e9ff3f (styles/index.css 14 rows + DESIGN.md rm),
9a0fb00 (constants.ts:57 "Agentic retrieval", constants.ts:199 ironclad activity entry + corpus),
fa53025 (master plan doc).

## Learnings

- **Idle-without-sending is systematic**: every reviewer/mapper subagent this session completed
  work but idled without SendMessage; one poke retrieved it each time. Budget a poke per agent.
- **`liveUrl` was dead data** until 356e772 — `CarouselSlide.tsx` collapsed `githubUrl || liveUrl`.
- **Eval fixtures were chunk-granularity brittle**: corpus has `project-<id>` AND `readme-<id>-N`
  families; punchier card copy shifted retrieval to readme chunks. Fix = accept same-project ids,
  never touch scoring (`scripts/run-evals.mts:20`).
- **Eval suite has boundary noise**: "Can I see Trey's resume?" failed run 2, passed runs 1+3.
  At 90% threshold one flaky question decides — hardening is a post-launch item.
- **"Semantic retrieval" was an overclaim**: `lib/ask/search.ts` is TF-IDF keyword scoring inside
  a Claude tool-loop → "agentic retrieval" is the true term (matches resume.txt:29).
- Trey's standing rule (memory saved): **subagents never on Fable** — always explicit model.
- Process near-miss (ledgered): fix-evals ran concurrently with impl-c-panel in one repo —
  disjoint files, no collision, but don't repeat.

## Verification

| Claim | Command run this session | Result |
|---|---|---|
| HEAD is fa53025, branch main | `git rev-parse HEAD` / `--abbrev-ref` | `fa53025…`, `main` |
| 15 commits unpushed | `git log origin/main..main --oneline \| wc -l` | `15` |
| Unit tests pass at HEAD | `npm test` (after last commit) | `Tests 40 passed (40)` |
| tsc clean at HEAD | `npx tsc --noEmit` | no output, echo tsc-clean |
| Build clean at HEAD | `npm run build` | `✓ built in 2.87s` |
| e2e pass at HEAD | `npm run test:e2e` | `11 passed (33.6s)` |
| Evals ≥90% | `npm run evals` (at 9a0fb00 content, corpus unchanged since) | `20/21 (95%)`, 1 FAIL = plugin question |
| Production still serves OLD deploy | `curl -sL -w %{http_code} https://www.treylupo.com/resume.pdf` | `404` (Step 0 + push will fix) |
| ironclad banner committed locally | `git -C ~/projects/ironclad log --oneline -1` | `76dc088 docs: honest status banner…` |
| mlforge banner committed locally | `git -C ~/experiments/AutoML log --oneline -1` | `2666cfa docs: superseded-by-gsd-ml banner` |
| profile README draft committed in scratch | `git -C <scratch>/profile-readme log --oneline -1` | `7cb44e7 docs: reposition…` |
| ledge in sync with origin | `git -C ~/projects/ledge status -sb` | `## main...origin/main` (no ahead marker) |
| P3 map + ask-my-work.png exist | `ls` both paths | both present |

## Artifacts

Committed here: 8 session commits (above) incl. master plan + this handoff + HANDOFF.md pointer.
Ledger: `.superpowers/sdd/progress.md`. Reports (session-temp scratchpad `…/scratchpad/sdd/`):
task-b/c/evals/readme reports, hygiene-report.md, slide/panel screenshots. FerroML map:
`~/experiments/ferroml/thoughts/2026-07-06-p3-architecture-map.md`. Memory: `project_career_masterplan.md`,
`feedback_subagents_not_fable.md` (+MEMORY.md index lines).

## Action Items & Next Steps

1. **TREY — the launch sequence (P1 plan Task 4, ~10 min):** (0) Vercel → Settings → Git →
   Production Branch off `main`; (1) tell Claude "Step 0 done" → push → review preview URL;
   (2) console.anthropic.com capped key → Vercel env `ANTHROPIC_API_KEY` (optional for launch —
   panel falls back gracefully); (3) promote to production. Then Claude runs P1 Task 5 live checks.
2. **TREY — one-word go/no-go on 4 public pushes:** ironclad banner, mlforge banner, profile
   README, (optional) create private `readflow` repo for backup (ReadFlow has NO remote).
3. Next session: understudy P4 (writeup + card + corpus + resume link) once Step 0 unblocks pushes.
4. Then: Ask Terminal implementation plan; P3 FerroML spec from the map; GSD-ML improvement pass.

## Other Notes

- HARD RULES intact: no portfolio push before Step 0; Ornith token-savings contract; subagents
  never Fable. Dev server: `cd rlupo-portfolio && npm run dev` → :3000.
- Ornith repo remains ahead-15 unpushed (Trey's call, pre-existing — spec/plan/handoff docs).
- `~/projects/treylupo` (dead Next.js rewrite) is on the kill list — Trey to confirm deletion.
