---
date: 2026-06-25
git_commit: 5b68570
branch: redesign/invisible-frame
status: complete (awaiting merge decision)
---

# Handoff: Award-Tier Polish — complete & browser-verified

## Task(s)

Executed `docs/superpowers/plans/2026-06-24-award-tier-polish.md` (8 tasks) via subagent-driven
development with a conflict-free wave-parallel harness. All 8 tasks complete, plus 5 fixes
surfaced by review/verification. Fully browser-verified with Playwright. **Branch not merged.**

## What shipped (12 commits, `f110ee3..5b68570`)

| # | Commit | What |
|---|--------|------|
| T3 | `9faa5d6` | Placeholder `public/resume.pdf` (valid PDF) + `.gitignore` negation `!resume.pdf` (root has blanket `*.pdf`) |
| T1 | `1766ae0` + `6dc8b5c` + `2fcb30e` | `SplitReveal` word-mask component; +useLayoutEffect anti-flash, tween cleanup, **inter-word spacing fix** (plan put the space inside the `overflow:hidden` word span → rendered "TREYLUPO"; moved to a sibling space) |
| T2 | `6c732bd` | `SlideProgress` fixed bottom bar (GSAP scaleX = activeIndex/(total-1)) |
| T4 | `df8d183` | HeroSlide: name via SplitReveal, staggered tagline/bio/creds, PowerGlitch removed |
| T5 | `09fc1c7` + `711c97d` | Carousel transition → progress-object GSAP timeline (power2.inOut + parabola blur ~2.5px); +`delta===0` mount guard, 650ms nav lock (≥600ms tween), direct track writes |
| T7 | `ca275a7` + `9337f9c` | CarouselSlide GSAP image reveal (clip-path wipe + x:20 parallax, 0.1s delay); +reset/kill on deactivation |
| T6 | `05f2822` | SlideProgress wired into Carousel |
| Final-review fixes | `5b68570` | **Hero reveal was playing invisibly behind the 3.1s preloader** — gated on `loaded` (App→Carousel `loaded`→HeroSlide `revealReady`) + useLayoutEffect; + Carousel tween `kill()` on cleanup |

## Verification (Playwright, port 3000)

- Hero "TREY LUPO" renders block at 96/82/48px (desktop/tablet/mobile); words reveal to identity transform.
- **Hero reveal now visible**: timing probe showed 0 frames mid-animation before the fix ("REVEAL WASTED"), 17 frames after ("REVEAL IS VISIBLE").
- Progress bar scaleX fills 0 → 0.1 → 1.0 across slides; visible at all viewports.
- Transition blur peaks ~2.46px then clears; image reveals desktop/tablet, `display:none` on mobile.
- Info overlay opens/closes; reduced-motion shows hero with no transforms; **0 console errors** at every viewport.
- `tsc --noEmit` and `vite build` clean throughout.

## Process artifacts

- Ledger: `.superpowers/sdd/progress.md` (per-task commit ranges, review verdicts, fix notes) — gitignored.
- Task briefs / reports / review diffs: `.superpowers/sdd/*.md`, `*.diff` — gitignored.
- Verification scripts: `scratchpad/{hero-spotcheck,t8-verify,hero-timing-probe}.cjs` (session scratch, not in repo).

## Learnings

- **Entrance animations behind a preloader are wasted.** Hero `isActive` is true at mount while `.site-content` is `opacity:0` for ~3.1s; the reveal must be gated on preloader completion (`loaded`) or it plays unseen. Verify with a timing probe, not a static screenshot — a 1-frame flash / wasted reveal is invisible to snapshots.
- **`useLayoutEffect` (not `useEffect`) for GSAP entrance "from" states** — avoids a 1-frame flash before paint. Reduced-motion guard still returns early → content stays visible.
- **Word-mask spacing:** a space inside an `overflow:hidden` inline-block word span is trimmed. Put the inter-word space as a sibling between word spans (font-relative gap).
- **Match the nav lock to the visual tween** (650ms ≥ 600ms) to prevent overlapping transitions at the source — simpler than killing in-flight tweens.

## Action Items / Next Steps

1. **Merge decision (pending user).** Branch is ~79 commits ahead of `main` (this session = 12). Options: squash-merge award-tier work, open a PR, or keep iterating.
2. `rlupo-portfolio/package.json` + lock have an uncommitted `@playwright/test` devDep (pre-existing; used for verification). Decide whether to commit it.
3. Deferred Minors (none affect shipped behavior): `SplitReveal` `text.split` edge cases (`/\s+/.filter(Boolean)`); `containerRef as any`; memoize `matchMedia`; relocate `.split-reveal`/`.slide-progress` CSS blocks above the `@media (max-width:768px)` block; consider `useState` over `hasAnimated` ref if hero ever needs to re-animate.
4. Still open from prior handoff (content, not motion): real project screenshots, case studies, dynamic activity log.
