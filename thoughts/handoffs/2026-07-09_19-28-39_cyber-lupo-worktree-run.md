---
date: 2026-07-09T19:28:39-04:00
researcher: Claude (Fable 5) — cyberpunk run, worktree edition (supersedes the workspace
  section of 2026-07-09_19-06-49_cyberpunk-run-plan.md; the design intent there still holds)
git_commit: ec5baf0
branch: feat/cyber-lupo (in the ../portfolio_website-cyber worktree)
repository: portfolio_website — WORKTREE at /mnt/c/Users/Trey/Downloads/portfolio_website-cyber
topic: "SESSION B PROMPT: build cyber-lupo — Fable-authored cyberpunk direction, one site,
  Trey's real content — in a parallel git worktree with its own server (:8792), so the
  monolith motion pass can run simultaneously in the main checkout."
tags: [cyberpunk, cyber-lupo, worktree, fable25, rlupo-portfolio]
status: complete
last_updated: 2026-07-09
type: handoff
---

# Handoff: cyber-lupo — cyberpunk run in the worktree

## Task(s)

1. ⏳ **THIS SESSION (worktree, branch feat/cyber-lupo):** author a cyberpunk brief, then
   build ONE greenfield static site with Trey's real resume/portfolio content. Full prompt
   below — it is self-contained.
2. ⏳ Verify, guide, commit on feat/cyber-lupo (in the worktree), handoff. Trey then
   compares cyber-lupo against monolith-lupo and picks a direction.

## Parallel-session ground rules (two Fables, one repo)

- **You own:** `/mnt/c/Users/Trey/Downloads/portfolio_website-cyber` (worktree, branch
  feat/cyber-lupo) and port **:8792**.
- **Session A owns:** the main checkout at `/mnt/c/Users/Trey/Downloads/portfolio_website`
  (branch feat/monolith-lupo) and port :8791. **Touch neither.**
- Same `.git` under the hood — do NOT check out or force-move each other's branches; only
  commit to feat/cyber-lupo. Do not push (Vercel Step 0 gate).
- Shared read-only: `~/projects/fable25` (spec sites :4179, `tools/shot.mjs`).

## THE PASTE-READY PROMPT (Session B — run in the worktree directory)

```
cd /mnt/c/Users/Trey/Downloads/portfolio_website-cyber first — you are in a git WORKTREE
on branch feat/cyber-lupo (verify: git branch --show-current). Read
thoughts/handoffs/2026-07-09_19-28-39_cyber-lupo-worktree-run.md WHOLE, then execute:

You are the builder studio for "cyber-lupo": Trey Lupo's resume/portfolio site — a SECOND
standalone candidate alongside the civic-poster monolith-lupo — in a direction of your own
authorship: CYBERPUNK. This will be seen by hiring managers; go nuts and show what you are
capable of. Total creative freedom inside the constitution.

AUTHOR YOUR BRIEF FIRST (write it into your guide before building): pick a specific
cyberpunk register with a point of view — corpo-dystopia terminal, wet-neon street market,
CRT municipal bureaucracy, ghost-signal broadcast — anything, but NOT generic neon slop.
No Matrix-rain, no unearned glitch. Name your exact palette, then COMPUTE WCAG AA ratios
for every text/ground pair BEFORE building (neon on dark usually passes; neon on neon
never does). 1–2 Google Fonts. A signature technique. One thing to prove. Every pixel
procedural (GLSL/canvas/SVG/CSS/math) — no image assets. Raidable local sketches:
http://localhost:8792/hero-crt-glitch.html, hero-ascii-crt-hybrid.html,
hero-ascii-grid.html, hero-particle-field.html.

READ ALSO: /home/tlupo/projects/fable25/BRIEFS.md lines 7-53 — build standard +
iteration-pass contract in force verbatim (zero console errors; AA computed; reduced-motion
= dignified static page; responsive 390→1600 recomposed; one h1; guide/index.html with
brief + technique + honest critique history; ≥3 passes with PNGs on disk). CONTEXT
ECONOMY: vision-Read at most THREE screenshots per pass (PIL-montage several shots into
one image = one read).

CONTENT (real, non-negotiable): the six-filing content map in
thoughts/handoffs/2026-07-09_15-55-25_monolith-direct-copy-next-run.md — reuse the DATA
(TREY LUPO + three roles · nspb-api 8h→<1h · FerroML 3.9× · HRF 0.48 RMSLE · 8-project
register · contact/open-to-work + timeline), NOT the civic voice: write the copy in your
cyberpunk register's own voice. Everything from rlupo-portfolio/constants.ts (in this
worktree). Never invent a fact, metric, employer, or date. Real anchors for
GitHub/PyPI/HuggingFace/LinkedIn (see what monolith-lupo linked —
rlupo-portfolio/prototypes/monolith-lupo/index.html in this worktree has them all).
Include the deploy-hygiene set (OG/Twitter meta, JSON-LD Person, favicon, og image ≤300KB)
— copy the pattern from monolith-lupo's <head>. Footer credit:
"Designed & built by Claude Fable 5 · 2026".

EXPERIENCE MANDATE: the experience is the product — structure is yours, but every section
gets one entrance-triggered motion set-piece (custom easing, static reduced-motion
fallback, rAF pauses on document.hidden), plus one site-wide upgrade of your own invention
per critique pass. Audit fixed chrome against EVERY ground it floats over, including
partial grounds. Known harness artifact: ~11px regular-weight text can fringe blue in
shot PNGs when its computed color is correct — check computed color before chasing CSS.

WORKSPACE (worktree paths): build in
/mnt/c/Users/Trey/Downloads/portfolio_website-cyber/rlupo-portfolio/prototypes/cyber-lupo/
(index.html + style.css + main.js + guide/index.html). QA in
.../prototypes/cyber-lupo-qa/ (create it). Server for THIS worktree — port :8792, NOT
:8791 (that's the other session's) and NOT :8080 (Windows HTTP.sys):
cd /mnt/c/Users/Trey/Downloads/portfolio_website-cyber && python3 -m http.server 8792 --directory rlupo-portfolio/prototypes --bind 127.0.0.1 &
Harness (from /home/tlupo/projects/fable25):
node tools/shot.mjs http://localhost:8792/cyber-lupo/ <abs-out.png> 1440x900 3500 [scrollY] [--reduced]
(also 390x844 mobile; use docHeight for scrollY).

GIT: commit finished site + qa + guide + a new handoff + HANDOFF.md pointer on
feat/cyber-lupo, in the worktree. Never touch feat/monolith-lupo or main. Do not push.

FINISH: final-desktop.png + final-mobile.png + structured output
{slug, title, tagline, brief_authored, passes[{pass,found,changed,upgrade}],
signature_technique, remaining_concerns, console_errors_final} — then present to Trey.
```

## Verification (state at write time)

| Claim | Command run this session | Result |
|---|---|---|
| worktree exists on feat/cyber-lupo | `git worktree add ../portfolio_website-cyber -b feat/cyber-lupo` (run this session; see session log) | created from ec5baf0+ — verify on arrival: `git branch --show-current` |
| :8792 serves the worktree tree | started this session; verify: `curl -w %{http_code} http://localhost:8792/` | restart command in the prompt above |
| content map + constants | verified in 15-55-25 and 16-31-49 handoffs (same content, same repo history) | line refs: nspb-api :21/:27 · FerroML :37/:45 · HRF :73/:80 · register :54–146 · timeline :157–169 |
| sketches present in worktree | worktree = full checkout of ec5baf0+ | hero-*.html are untracked in main checkout — if missing here, they're at /mnt/c/Users/Trey/Downloads/portfolio_website/rlupo-portfolio/prototypes/ (read-only reference via :8791) |
| monolith-lupo reference (head pattern, links) | committed at 48c32cf/ec5baf0 — present in this worktree | `rlupo-portfolio/prototypes/monolith-lupo/` |

⚠️ One real caveat verified by `git status` convention: the four `hero-*.html` sketches
were never committed — worktrees only carry COMMITTED files. If they're absent in the
worktree, view them on the main checkout's server (:8791) instead; do not copy files out
of the main checkout's working tree.

## Action Items & Next Steps

1. Open a NEW terminal → `cd /mnt/c/Users/Trey/Downloads/portfolio_website-cyber` →
   start Claude → paste the prompt above.
2. Build → verify → commit on feat/cyber-lupo → handoff.
3. Trey compares monolith-lupo (post-motion-pass) vs cyber-lupo → picks → deploy decision.
