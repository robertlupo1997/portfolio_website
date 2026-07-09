---
date: 2026-07-09T19:22:40-04:00
researcher: Claude (Fable 5) — AI-engineer-fit upgrade pass on monolith-lupo, Trey-directed
git_commit: f954a87 (feat/monolith-lupo, pre-commit of this work)
branch: feat/monolith-lupo
repository: portfolio_website (DrvFs clone)
topic: "All five AI-engineer-fit upgrades built into monolith-lupo: clickable posters,
  Ask My Work stage, activity docket set-piece, skills schedule, deploy hygiene
  (OG/JSON-LD/favicon/og.png). Pass 5+6 verified, zero errors. Gate still open."
tags: [monolith-lupo, ai-engineer-fit, links, seo, rlupo-portfolio]
status: complete
last_updated: 2026-07-09
type: handoff
---

# Handoff: monolith-lupo AI-engineer upgrades — built & verified

## Task(s)

1. ✅ **Clickable posters** — register rows link to repos (↗) with extra PyPI/LIVE DEMO
   links on FerroML/KKBOX; poster 3 links PyPI + GitHub; poster 4 links its source;
   poster 2 gets a "public inspection" link. AA rule everywhere: hover puts orange in
   the UNDERLINE on concrete (orange text = 1.79:1, still banned).
2. ✅ **Ask My Work stage** — poster 6 block: "Recruiters skim. Let them interrogate."
   (its real one-liner from constants.ts) + FILE AN INQUIRY CTA (mailto — no live demo
   URL exists in constants; re-point at deploy). Register metric "SSE" → "RAG · SSE".
3. ✅ **Activity docket** — ACTIVITY_LOG's 10 real releases (2024-11 → 2026-06) print
   chronologically in the register's left column, staggered entrance, blinking caret.
4. ✅ **Skills schedule** — SKILL_GROUPS as third column on poster 6 ("Schedule of
   competencies") — ATS/recruiter keywords now in DOM text.
5. ✅ **Deploy hygiene** — OG/Twitter meta, JSON-LD Person, canonical + theme-color,
   `favicon.svg` (322 B), `og.png` (49 KB, 1200×630 from the cover shot). og:image and
   canonical assume https://treylupo.com/ — adjust if it deploys to a subdomain.
6. ⏳ **Trey's gate unchanged**: review http://localhost:8791/monolith-lupo/ → approve /
   iterate → deployment decision.
7. ⏳ **Cyberpunk run**: plan + prompt ready in
   `thoughts/handoffs/2026-07-09_19-06-49_cyberpunk-run-plan.md` — paste into a fresh
   session; builds on feat/cyber-lupo.

## Learnings

- **Playwright/Linux shot artifact:** ~11px regular-weight ink text on concrete renders
  with blue subpixel fringing in harness PNGs even when computed color is `rgb(28,26,23)`
  (verified via `getComputedStyle` in-page). `-webkit-font-smoothing` is macOS-only — no
  effect here. Mitigation that works: ≥0.78rem + weight 600. Don't chase "blue text" in
  CSS before checking computed color.
- Poster 6 mobile grew past one viewport → `height: auto; min-height: 100dvh` on that
  poster only; scroll-snap tolerates a taller-than-viewport snap child (content currently
  fits 844px exactly anyway).
- `.notice__layout` needed a 5th grid row for the inspection link (was `auto 1fr auto auto`).

## Verification

| Claim | Command run this session | Result |
|---|---|---|
| zero errors after all edits | `node tools/shot.mjs …/monolith-lupo/ …pass6-desktop-3600.png 1440x900 3500 3600` | `{"errors":[],"pageErrors":[]}` docHeight 5400 |
| posters 2–6 re-shot post-upgrade | pass5-desktop-{900,1800,2700,3600,4500}.png + pass5-mobile-p6 | all zero errors; docHeight 5400 / 5064 |
| guide re-shot after pass-5 section | harness on `…/guide/` | zero errors, docHeight 3911 |
| docket text is ink, not blue | in-page `getComputedStyle` via playwright eval | both spans `rgb(28, 26, 23)` → fringing was AA artifact; fixed by 0.78rem/600 (pass6-docket-crop.png) |
| asset budget | `ls -la` favicon.svg + og.png | 322 B · 49 KB (cap 300 KB) |
| file sizes after upgrades | `wc -l` | index 438 · style 2151 · guide 243 |
| servers | `curl` :8791 / :4179 | 200 / 200 (earlier this session) |
| branch topology | `git log --oneline` after surgery | feat/monolith-lupo: 95d9ecb→d7cf885→48c32cf→f954a87 (+this commit); main reset to 95d9ecb |

## Artifacts

- Modified: `prototypes/monolith-lupo/{index.html, style.css, guide/index.html}`
- New: `prototypes/monolith-lupo/{favicon.svg, og.png}`
- QA: `prototypes/monolith-lupo-qa/pass5-*.png`, `pass6-*.png`
- This handoff; `HANDOFF.md` pointer updated.

## Action Items & Next Steps

1. Trey reviews the upgraded site (links, CTA, docket, skills — desktop + phone).
2. Run the cyberpunk prompt (19-06-49 handoff) in a fresh session → feat/cyber-lupo.
3. At deploy: re-point FILE AN INQUIRY at the Ask My Work live URL; confirm canonical/og
   URLs; decide whether the docket needs a maintenance note (it mirrors ACTIVITY_LOG in
   constants.ts by hand — update both together).

## Other Notes

- All new copy remains sourced from constants.ts (PERSONAL_INFO, SKILL_GROUPS,
  ACTIVITY_LOG, project urls). Nothing invented; nspb-api and Ask My Work have no public
  repos so their rows stay unlinked.
- Working branch is feat/monolith-lupo (checked out); main is clean at 95d9ecb.
