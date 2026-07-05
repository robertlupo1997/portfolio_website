---
date: 2026-06-26T15:59:59-04:00
git_commit: 815bbe4
branch: redesign/invisible-frame
status: complete
---

# Handoff: Portfolio Award-Tier Polish complete — next frontier is CONTENT, not motion

> **Read this first if you're resuming cold.** The site's craft (animation, layout, motion) is
> now award-tier and shipped. The portfolio is NOT the end goal — it is the **showcase/destination**
> for Trey's actual work. The real remaining deliverables live mostly OUTSIDE this repo:
> **(1) Trey's real resume PDF, and (2) finishing the actual projects themselves** (so they have
> real screenshots, live demos, and case studies to link to). The site is ready to receive that
> content the moment it exists. Do not add more animation unless asked — the binding constraint now
> is credibility content for a technical hiring-manager audience.

---

## Purpose / North Star (why this project exists)

Trey Lupo is an FP&A analyst / data scientist / AI-ML engineer at Franklin Street (Tampa). This
portfolio (treylupo.com, React 19 + Vite + GSAP, "The Invisible Frame" design direction) exists to
present finished, production-quality work to technical hiring managers. Per CLAUDE.md content
guidelines: *showcase production-quality work, not academic exercises; write for a technical hiring
manager.* Trey said explicitly this session: **"I need to work on my resume itself and these
projects themselves to finish them out, which is the purpose of us building this."** So the website
is a forcing function — the next phase is finishing the underlying assets, then wiring them in.

## Task(s)

**COMPLETE — Award-Tier Polish** (`docs/superpowers/plans/2026-06-24-award-tier-polish.md`, 8 tasks).
Executed via subagent-driven development with a conflict-free wave-parallel harness. All 8 tasks +
5 review/verification-driven fixes shipped, browser-verified (Playwright @ 1440/1024/375 +
reduced-motion, 0 console errors, tsc + vite build clean). User reviewed locally and approved.
Working tree is **clean**. 13 commits since the plan (`f110ee3..815bbe4`).

**OPEN — awaiting Trey, to be handled in the next session:**
1. **Trey's homework (outside repo):** finish resume PDF + finish/screenshot the actual projects.
2. **Merge decision:** branch is ~79 commits ahead of `main`; this session = last 13. Not merged.
3. **Direction:** wire in credibility content (once assets exist) vs. solo craft/cleanup.

## Critical References

- `CLAUDE.md` — project overview, tech stack, content guidelines, skills to use.
- `docs/superpowers/plans/2026-06-24-award-tier-polish.md` — the plan just executed.
- `.superpowers/sdd/progress.md` — SDD ledger (per-task commit ranges, review verdicts, fixes). Gitignored.
- `rlupo-portfolio/constants.ts` — **all** project data, personal info, timeline, skills, activity log. Edit here to update content.
- `rlupo-portfolio/components/InfoOverlay.tsx` — bio, skills, career timeline, contact, resume link.
- Memory (auto-loaded): `project_portfolio_roadmap.md`, `project_award_patterns.md`, `project_design_direction.md`, `feedback_varied_layout.md`.

---

## CONTENT INVENTORY (the heart of this handoff)

### Resume — DEAD LINK to a placeholder ⚠️ HIGHEST PRIORITY
- `rlupo-portfolio/public/resume.pdf` is a **placeholder I generated this session** — a valid 1-page
  PDF that literally says "placeholder, replace with actual resume."
- Linked at `InfoOverlay.tsx:175`: `<a href="/resume.pdf" ...>Resume</a>` (INFO overlay → contact).
- A hiring manager who clicks Resume gets a stub.
- **UPDATE 2026-06-26 — resume research done.** Autonomous filesystem audit found **no current resume
  exists** (only obsolete 2020 resumes from a prior career phase). A positioned **draft v1 (AI/ML
  Engineer)** was synthesized from verified 2026 accomplishment material + the portfolio.
  **The audit + draft live in `thoughts/resume/` which is GITIGNORED (LOCAL ONLY)** — they contain
  personal + employer-confidential data and must NOT be committed/pushed. Read them locally.
  **Next action:** Trey confirms the `[VERIFY]` facts in the draft (phone, grad year, internship dates)
  + approves content → generate styled PDF into `public/resume.pdf` (.gitignore already has `!...resume.pdf`).

### Projects (11 carousel slides = 9 projects + hero + activity log)

CAROUSEL_PROJECTS = FEATURED_PROJECTS (3) + ALL_PROJECTS (6). Data in `constants.ts`.

| id | title | image (file) | image type | github | live demo? |
|----|-------|--------------|-----------|--------|-----------|
| nspb-api | nspb-api | amazon-network.jpg | **AI art** (repo is PRIVATE) | robertlupo1997/nspb-api | none |
| ferroml | FerroML | plate-ferroml-comparison.png | looks like real figure ✓ | robertlupo1997/ferroml | none |
| revenue-forecast | Hierarchical Revenue Forecast | plate-ferroml-intervals.png | **MISMATCH?** FerroML-named plate on revenue card — verify | robertlupo1997/hierarchical-revenue-forecast | none |
| kkbox | KKBOX Churn Prediction | plate-kkbox-models.png | looks like real figure ✓ | robertlupo1997/kkbox-churn-prediction | **HF Space (live)** |
| obj-detect | Open-Vocab Object Detection | objdetect-matrix.jpg | **AI art** | robertlupo1997/open-vocabulary-object-detection | none |
| ironclad | Ironclad | ironclad-battle.jpg | **AI art** | robertlupo1997/ironclad | none |
| ferroml-plugin | FerroML Plugin | clockwork-globe.jpg | **AI art** | robertlupo1997/ferroml-plugin | none |
| gsd-ml | GSD-ML | lavoisier-lab.jpg | **AI art** | robertlupo1997/gsd-ml | none |
| mlforge | MLForge | forge-farrier.jpg | **AI art** | robertlupo1997/mlforge | none |

**GitHub link status (verified live 2026-06-26 via curl):** only **nspb-api → 404** (private/flagship —
dead for visitors). All 8 others → 200, including `hierarchical-revenue-forecast` (note: a 13-day-old
memory claimed that repo didn't exist; it resolves now — trust this live check over the memory).

Notes:
- **No referenced image is missing** — all `imageUrl`s resolve. The issue is *quality*: 6 of 9 are
  AI-generated/decorative metaphors, not real tool screenshots.
- **Unused assets on disk** (candidates for real-screenshot slots, or deletion):
  `plate-kkbox-calibration.png`, `foodhub-heatmap.png`, `life-heartbeat.jpg`, `shinkansen-shibuya.jpg`,
  `kkbox-churn.jpg`, plus `hero.mp4` / `hero.webm` (current hero uses the ASCII grid, not video).
- **Images are hidden on mobile** (`display:none` < 768px) — so screenshots only matter on desktop/tablet.
- **Verify the revenue-forecast image** — `plate-ferroml-intervals.png` on a revenue forecast card is
  probably a leftover; either it's intentionally a shared interval plot or it's wrong.

### Priority projects per CLAUDE.md / roadmap
nspb-api, ferroml, ironclad, hierarchical-revenue-forecast. **nspb-api repo is PRIVATE** — its GitHub
link won't resolve for a logged-out visitor; consider a case study or making select code public.

### Bio / Skills / Timeline / Contact (all real, in good shape — `constants.ts` + `InfoOverlay.tsx`)
- Bio: FP&A Analyst at Franklin Street, Tampa; Python SDKs, Rust ML, reconciling revenue models.
- Timeline: 2024 B.A. Statistics USF + MIT IDSS cert → 2025 AI Eng Intern, Origin Construction → 2025–NOW FP&A Analyst, Franklin Street.
- Skills groups: LANGUAGES (Python/TS/SQL/Rust), FINANCE (Oracle EPM/FP&A/Modeling), ML/DATA, AI TOOLS (Claude Code/Anthropic SDK), WEB (React/GSAP/Vite).
- Contact: email treylupo1197@gmail.com (click-to-copy), GitHub/LinkedIn/HuggingFace links, Resume link (placeholder).
- Activity log: 10 static entries 2024-11 → 2026-06 (`ACTIVITY_LOG`). Could later be GitHub-API-driven.

---

## What shipped this session (13 commits, `f110ee3..815bbe4`)

- `815bbe4` chore: `@playwright/test` devDep (powered verification)
- `5b68570` fix: **gate hero reveal on preloader completion** (it was playing invisibly behind the ~3.1s preloader) + kill carousel transition tween on cleanup
- `9337f9c` fix: reset/kill image reveal tween on slide deactivation
- `711c97d` fix: 650ms nav lock (≥600ms tween) + direct track writes (no stale GSAP cache)
- `05f2822` feat: SlideProgress wired into Carousel
- `ca275a7` feat: GSAP image reveal (clip-path wipe + x:20 parallax, 0.1s delay)
- `09fc1c7` feat: asymmetric `power2.inOut` easing + parabola blur (~2.5px peak)
- `2fcb30e` fix: SplitReveal inter-word spacing (had rendered "TREYLUPO") + snap tween on cleanup
- `df8d183` feat: hero name word-mask reveal + staggered tagline/bio/creds; PowerGlitch removed
- `6c732bd` feat: SlideProgress component
- `6dc8b5c` fix: SplitReveal useLayoutEffect anti-flash + tween cleanup
- `1766ae0` feat: SplitReveal word-mask component
- `9faa5d6` feat: placeholder resume.pdf + `.gitignore !resume.pdf` negation

## Artifacts (code)

New: `rlupo-portfolio/components/SplitReveal.tsx`, `rlupo-portfolio/components/SlideProgress.tsx`,
`rlupo-portfolio/public/resume.pdf` (placeholder).
Modified: `App.tsx:42` (passes `loaded`), `components/Carousel.tsx` (transition timeline + blur,
`loaded`→`revealReady`, tween cleanup, SlideProgress, 650ms lock), `components/HeroSlide.tsx`
(SplitReveal name + staggered text, `revealReady` gate, useLayoutEffect, PowerGlitch removed),
`components/CarouselSlide.tsx:58-75` (GSAP image reveal + deactivation reset), `styles/index.css`
(`.split-reveal*`, `.slide-progress*`, `.carousel-track` will-change, image clip-path direction),
`.gitignore:7`, `package.json` (`@playwright/test`).
Verification scripts (session scratch, NOT in repo): `hero-spotcheck.cjs`, `t8-verify.cjs`,
`hero-timing-probe.cjs`, `prev-wrap-probe.cjs`.

## Learnings (technical, carry forward)

- **Entrance animations behind a preloader are wasted.** Hero `isActive` is true at mount while
  `.site-content` is `opacity:0` for ~3.1s (Preloader = BOOT 2400 + HOLD 400 + FADE 300). Verify
  paint-timing with a **probe** (sample computed transforms over time), not a screenshot — flashes and
  wasted reveals are invisible to static snapshots. Fix pattern: thread `loaded` (App → Carousel
  `loaded` → HeroSlide `revealReady`) and gate entrances on it.
- **`useLayoutEffect` (not `useEffect`) for GSAP entrance "from" states** — sets hidden state before
  paint, no 1-frame flash. Reduced-motion guard still returns early so content stays visible.
- **Word-mask spacing:** a space inside an `overflow:hidden` inline-block word span is trimmed — put
  the inter-word space as a sibling between word spans.
- **Match the nav lock to the visual tween** (650ms ≥ 600ms in `useCarousel`) to prevent overlapping
  transitions at the source.
- **Dev server is port 3000** (vite.config.ts pins it), not 3001 as the plan text said.
- **Carousel nav** is window `keydown` ArrowLeft/ArrowRight (350ms→now 650ms lock); also pointer-swipe.
  Playwright drives it with `keyboard.press('ArrowRight')` + ~850ms waits.

---

## Action Items & Next Steps (priority order)

### A. TREY's HOMEWORK (outside this repo — the real blockers)
1. **Finish the resume** → export `public/resume.pdf` (replaces placeholder; .gitignore already allows it).
2. **Finish the actual projects** so each has something real to show:
   - Real **screenshots** of tools running (replace the 6 AI-art images — see inventory).
   - **Live demos** where feasible (KKBOX already has a HF Space; consider FerroML / nspb-api playgrounds → demos.treylupo.com per subdomain plan).
   - Decide nspb-api visibility (repo is private → dead GitHub link for visitors).

### B. NEXT CLAUDE SESSION — content wiring (once assets exist)
3. Drop in real resume.pdf; swap AI-art `imageUrl`s for real screenshots in `constants.ts`.
4. **Fix the revenue-forecast image** (verify/replace `plate-ferroml-intervals.png`).
5. **Case study pages** for nspb-api + FerroML (problem → approach → architecture → results → learnings) — the roadmap's RAG demo is the priority interactive piece.

### C. NEXT CLAUDE SESSION — solo craft/cleanup (no assets needed; can start anytime)
6. **Cursor-follow image preview** on projects-overlay rows (from `project_award_patterns` memory) — a real differentiator.
7. **Batch the deferred review minors + 1 latent CSS bug** (~15 min):
   - **CSS ordering (latent):** `.split-reveal` / `.slide-progress` blocks sit AFTER the
     `@media (max-width:768px)` block in `index.css` — a future 768px override for those classes would
     silently lose to source order. Relocate both above the 768px breakpoint section.
   - `SplitReveal` `text.split(' ')` → `text.split(/\s+/).filter(Boolean)` for empty/multi-space safety.
   - `SplitReveal` `containerRef` typed `HTMLDivElement` with `as any` cast — tighten.
   - `CarouselSlide` recreates `window.matchMedia(...)` per effect run — memoize.
   - `HeroSlide` `hasAnimated` ref-in-JSX — fine for one-shot; use `useState` if hero ever needs to re-animate.

### D. INTEGRATION (whenever Trey decides)
8. Merge: branch ~79 commits ahead of `main`; this session = last 13. A squash/PR carries all 79
   unless scoped — confirm scope before merging. Trey chose "review locally first," so DO NOT merge
   without an explicit go.

## Other Notes

- Dev server at **http://localhost:3000** (may need restart next session: `cd rlupo-portfolio && npm run dev`).
- Working tree clean; untracked tooling dirs (`.superpowers/`, `.impeccable/`, `references/`,
  `prototypes/`, `design-extract-output/`) are gitignored or intentionally untracked.
- Personal info / links live in `constants.ts` `PERSONAL_INFO` (github robertlupo1997, LinkedIn, HF Space).
- Subdomain plan (CLAUDE.md): docs / blog / demos / lab .treylupo.com, each a separate Vercel project.
- Design guardrails (memory `project_design_direction`): The Invisible Frame, restrained palette, **no amber**.
- All verification green at handoff: hero "TREY LUPO" 96/82/48px; progress 0→0.1→1; blur ~2.46px;
  image hidden on mobile; overlay open/close OK; prev/next/wrap correct; 0 console errors anywhere.
