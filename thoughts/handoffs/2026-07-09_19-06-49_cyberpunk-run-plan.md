---
date: 2026-07-09T19:06:49-04:00
researcher: Claude (Fable 5) — plan authored at Trey's direction after the monolith-lupo gate opened
git_commit: 48c32cf (feat/monolith-lupo)
branch: feat/monolith-lupo
repository: portfolio_website (DrvFs clone); references ~/projects/fable25 (PROMPTS.md, BRIEFS.md, shot harness)
topic: "NEXT RUN: what Fable does with the direction 'cyberpunk' — a second standalone candidate
  site alongside monolith-lupo, same recipe (one site, real content, full creative energy),
  Fable authors its own cyberpunk brief then builds. Ready-to-paste prompt included."
tags: [cyberpunk, fable25, design-direction, rlupo-portfolio, cyber-lupo]
status: complete
last_updated: 2026-07-09
type: handoff
---

# Handoff: cyberpunk run — plan + ready-to-paste prompt

## Task(s)

1. ⏳ **NEXT RUN (fresh Fable session):** build ONE greenfield static site,
   `rlupo-portfolio/prototypes/cyber-lupo/`, in a **cyberpunk direction Fable authors
   itself** — Trey's words: "I would like to see what Fable would do with the direction of
   cyberpunk." Same real resume/portfolio content as monolith-lupo. Prompt in § The Prompt.
2. ⏳ Trey then compares candidates: `monolith-lupo` (civic-poster, at the gate per
   `thoughts/handoffs/2026-07-09_16-31-49_monolith-lupo-built-awaiting-gate.md`) vs
   `cyber-lupo`. Deployment decision after.
3. ✅ This doc: derived from the ORIGINAL prompts — Layer 1 mission prompt (the "go nuts"
   energy clause) and Layer 2a builder prompt at `~/projects/fable25/PROMPTS.md`
   (Layer 1: lines 15–35 · Layer 2a: lines 47–81), fused with the direct-copy run's
   post-mortem lessons (one site · real copy · motion mandated · experience first).

## Critical References

- `~/projects/fable25/PROMPTS.md` — the original prompts this plan customizes.
- `~/projects/fable25/BRIEFS.md:7-53` — build standard + iteration-pass contract (in force).
- `thoughts/handoffs/2026-07-09_15-55-25_monolith-direct-copy-next-run.md` — §Content map
  (the six real filings; reuse the DATA, not the civic voice) + §Learnings (post-mortem).
- `rlupo-portfolio/constants.ts` — the only source of facts.
- Raidable local sketches, already served on :8791: `prototypes/hero-crt-glitch.html`,
  `hero-ascii-crt-hybrid.html`, `hero-ascii-grid.html`, `hero-particle-field.html`.

## The Prompt (paste into a fresh Fable session)

```
You are the builder studio for "cyber-lupo": Trey Lupo's resume/portfolio site — a SECOND
standalone candidate alongside the civic-poster monolith-lupo — in a direction of your own
authorship: CYBERPUNK. This will be seen by hiring managers; go nuts and show what you are
capable of. You have total creative freedom inside the constitution.

AUTHOR YOUR BRIEF FIRST (write it into your guide before building): pick a specific
cyberpunk register with a point of view — corpo-dystopia terminal, wet-neon street market,
CRT municipal bureaucracy, ghost-signal broadcast — anything, but NOT generic neon slop.
No Matrix-rain, no unearned glitch. Name your exact palette (then COMPUTE WCAG AA ratios
for every text/ground pair BEFORE building — neon on dark usually passes, neon on neon
never does), 1–2 Google Fonts, a signature technique, and one thing to prove. Every pixel
procedural (GLSL/canvas/SVG/CSS/math) — no image assets. Local sketches you may raid:
http://localhost:8791/hero-crt-glitch.html, hero-ascii-crt-hybrid.html, hero-ascii-grid.html,
hero-particle-field.html.

READ FIRST: /home/tlupo/projects/fable25/BRIEFS.md lines 7-53 — build standard +
iteration-pass contract in force verbatim (zero console errors; WCAG AA computed, not
eyeballed; reduced-motion = dignified static page; responsive 390→1600 recomposed; one h1;
guide/index.html with brief + technique + honest critique history; ≥3 passes with PNGs on
disk). CONTEXT ECONOMY: vision-Read at most THREE screenshots per pass.

CONTENT (real, non-negotiable): the six-filing content map in
thoughts/handoffs/2026-07-09_15-55-25_monolith-direct-copy-next-run.md — reuse the DATA
(TREY LUPO + roles · nspb-api 8h→<1h · FerroML 3.9× · HRF 0.48 RMSLE · 8-project register
· contact/open-to-work + timeline), NOT the civic voice: write the copy in your cyberpunk
register's own voice. Everything from rlupo-portfolio/constants.ts. Never invent a fact,
metric, employer, or date. Make GitHub/PyPI/HuggingFace/LinkedIn links real anchors.
Footer credit: "Designed & built by Claude Fable 5 · 2026".

EXPERIENCE MANDATE: the experience is the product — structure is yours (scroll-snap,
long-scroll, whatever serves the register), but every section gets one entrance-triggered
motion set-piece (custom cubic-bezier or spring math, static reduced-motion fallback, rAF
loops pause on document.hidden), plus at least one site-wide upgrade of your own invention
per critique pass. Lesson from the last two runs: motion ambition and real stakes are what
made monolith-lupo land — bring both, and audit fixed chrome against EVERY ground it
floats over, including partial grounds (block edges crossing a rail).

WORKSPACE: build in
/mnt/c/Users/Trey/Downloads/portfolio_website/rlupo-portfolio/prototypes/cyber-lupo/
(index.html + style.css + main.js + guide/index.html). QA shots in
/mnt/c/Users/Trey/Downloads/portfolio_website/rlupo-portfolio/prototypes/cyber-lupo-qa/
(create it). Server: :8791 serves the prototypes/ tree (NOT :8080 — Windows HTTP.sys owns
it); restart if down:
cd /mnt/c/Users/Trey/Downloads/portfolio_website && python3 -m http.server 8791 --directory rlupo-portfolio/prototypes --bind 127.0.0.1 &
Harness (from /home/tlupo/projects/fable25):
node tools/shot.mjs http://localhost:8791/cyber-lupo/ <abs-out.png> 1440x900 3500 [scrollY] [--reduced]
(use docHeight to shoot every section; also 390x844 mobile).

GIT: work on branch feat/cyber-lupo (branch from feat/monolith-lupo or main). Commit the
finished site + qa + a handoff there. Do NOT push (Vercel Step 0 gate).

FINISH: final-desktop.png + final-mobile.png + structured output
{slug, title, tagline, brief_authored, passes[{pass,found,changed,upgrade}],
signature_technique, remaining_concerns, console_errors_final}.
```

## Learnings (carried into the prompt)

- Post-mortem of the 3-study run (15-55-25 handoff §Learnings): comparability contracts and
  placeholder copy kill delight; ONE site, real stakes, mandated motion is the recipe that
  produced monolith-lupo.
- monolith-lupo director pass: fixed chrome must be audited against PARTIAL grounds too
  (a block edge crossing the rail made the active nav link invisible) — encoded above.
- AA must be computed for the authored palette BEFORE building — monolith's own CSS
  contained failing opacities; a cyberpunk neon palette is even riskier.

## Verification

| Claim | Command run this session | Result |
|---|---|---|
| PROMPTS.md Layer 1 / 2a line refs | Read `~/projects/fable25/PROMPTS.md` in full | Layer 1 quote lines 15–35; Layer 2a lines 47–81 |
| BRIEFS.md constitution lines | Read lines 1–60 this session | build standard :7-31 · pass contract :33-53 |
| content map + constants refs | `grep -n "title\|metric" rlupo-portfolio/constants.ts` | nspb-api :21/:27 · FerroML :37/:45 · HRF :73/:80 · register :54–146 · timeline :157–169 |
| raidable sketches exist | `ls rlupo-portfolio/prototypes/` | hero-crt-glitch.html · hero-ascii-crt-hybrid.html · hero-ascii-grid.html · hero-particle-field.html |
| :8791 serves prototypes tree | `curl -w %{http_code} localhost:8791/monolith-lupo/` | 200 |
| branch state | `git log --oneline -3` after branch surgery | feat/monolith-lupo = 95d9ecb→d7cf885→48c32cf; main reset to 95d9ecb |
| monolith-lupo (comparison candidate) verified | see 16-31-49 handoff §Verification | 4 passes, 0 errors, AA-audited |

## Artifacts

- This plan; `HANDOFF.md` pointer updated to it (on branch feat/monolith-lupo).
- The prompt above is the run artifact — no separate file.

## Action Items & Next Steps

1. **Fresh Fable session:** confirm :8791 up → run § The Prompt → director-verify
   (zero-error re-runs, computational AA for the authored palette, ≥1 vision read of fixed
   chrome against every ground) → present.
2. **Trey gates:** monolith-lupo verdict (may proceed independently) + cyber-lupo verdict →
   pick a direction → deployment decision.
3. Meanwhile, monolith-lupo AI-engineer-fit upgrades (real anchors on posters, SEO/JSON-LD,
   activity docket, skills schedule) are listed in the session summary and can be a small
   follow-up task on feat/monolith-lupo — Trey prioritizes.

## Other Notes

- Convention ruling (Trey asked): plans for NEW runs get a NEW timestamped handoff; we never
  append completed handoffs — their Verification tables are point-in-time evidence, and the
  resume flow (`HANDOFF.md` pointer + newest-by-listing) only trusts the latest doc.
- Servers at write time: :8791 (prototypes tree), :4179 (fable25), :3000 (React dev). Fragile.
- CLAUDE.md still describes the pre-carousel scroll layout — stale (5th handoff flagging it).
