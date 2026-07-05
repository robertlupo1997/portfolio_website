# Handoff: Invisible Frame Redesign Session (2026-06-12)

Model: Claude Fable 5 (switched to Opus 4.6 at end of session)
Branch: `redesign/invisible-frame`
Commits this session: `aca29ae`, `5c50302`, `c9b9a79`

---

## What happened

One large session covering five workstreams, all run in parallel via Fable's agent orchestration:

### 1. Skills/agents audit + cleanup

**Problem:** 21 skills existed in THREE locations simultaneously (`~/.claude/skills/`, `~/.agents/skills/`, and project `.agents/skills/`), causing silent shadowing and version drift. The project-scope `impeccable` was a broken template with unrendered `{{placeholders}}`. The `product-tracking-skills` plugin was orphaned (removed from marketplace).

**Actions taken:**
- Uninstalled `product-tracking-skills@claude-plugins-official`
- Deleted all 21 duplicates from `~/.claude/skills/` (kept only `impeccable`, `codebase-to-course`, `first-principles-analyst` there)
- Deleted all 21 duplicates + broken `impeccable` from project `.agents/skills/`
- `~/.agents/skills/` remains the single canonical home for user-scoped skills (managed by `.skill-lock.json`)
- Removed 5 nested stub SKILL.md subdirectories

**What remains:** `~/.claude/skills/` has 3 unique skills. `~/.agents/skills/` has 21 (canonical). Project `.agents/skills/` has ~130 project-only skills (not duplicates).

### 2. WSL home directory project inventory

**Full inventory of ~/projects and ~/experiments:**

| Project | Path | Maturity | Portfolio value |
|---------|------|----------|----------------|
| **FerroML** | `~/experiments/ferroml` | Production v1.0.1, 6,500+ tests, PyPI | Strongest card: Rust+Python AutoML, 3.9x faster than sklearn |
| **Gjald (Ledge)** | `~/projects/ledge` | Solid WIP, 480 tests | MCP server giving Claude GL access — not on site yet |
| **DealForecast** | `~/experiments/FSML/DealForecast` | Solid WIP, real MLflow runs | AUC 0.874, conformal CI 90.5% — work-derived, can't publish |
| **nspb-api** | `~/projects/nspb-api` | Production | GitHub repo is PRIVATE (404 publicly) |
| **nspb-tools** | `~/projects/nspb-tools` | Production plugin | Claude Code plugin for nspb-api |
| **ATLAS** | `~/projects/atlas` | Early WIP, 18 commits | AI trading agent — great architecture doc, no results yet |
| **Ironclad** | `~/projects/ironclad` | Early WIP, 2 commits | Construction cost CV — strong spec, not built yet |
| **mlforge** | `~/experiments/AutoML` | v1.0 milestone | Autonomous ML research framework |
| **gsd-ml** | `~/experiments/gsd-ml` | Published npm+PyPI | Claude Code ML skills — precursor to mlforge |
| **ReadFlow** | `~/experiments/ReadFlow` | MVP, 47 tests | Chrome extension TTS — lower AI signal |
| **Claw-Code** | `~/experiments/Claw-Code` | Experiment | Reverse-eng study — don't feature, but ethics essay is publishable |

**User decision:** Only feature the CURRENT projects in `constants.ts`. Work-derived projects (DealForecast, possibly nspb-api internals) are off-limits. Don't propose adding Gjald/DealForecast cards unless he raises it.

**Key finding:** "hierarchical-revenue-forecast" as a named repo doesn't exist on disk — DealForecast is the actual project.

**Gaps for AI-guru positioning:** No public RAG/eval/fine-tuning artifact, nothing real-time/streaming, no cloud deployment evidence.

### 3. Award-winning portfolio research (Opus agent)

Researched 10 reference sites: Dennis Snellenberg, Aristide Benoist, Niccolò Miranda, Stas Bondar, Joffrey Spitzer, Stefan Vitasović, Jonas Reymondin, Emil Kowalski, Rauno Freiberg, Darkroom Engineering.

**Top 7 patterns ranked by impact/effort for GSAP+Lenis stack:**

1. **Line-mask text reveals** — SplitText lines, overflow:hidden wrapper, yPercent 105→0, expo.out, 0.08s stagger. #1 visible differentiator between template-tier and award-tier.
2. **Cursor-follow image preview** on work list hover — gsap.quickTo with asymmetric x/y lag
3. **Strong parallax** on project images (-0.3x to -0.5x, not timid 5%)
4. **Thumbnail-to-hero FLIP transition** (if/when case-study pages exist)
5. **Curate harder** — 3-6 projects max on index
6. **Activity/shipping log** (darkroom.engineering pattern) — best for engineers
7. **Manifesto-style hero values** (rauno.me) — alternative to job-title hero

**Key insight:** "The separator isn't WebGL spectacle — it's decision density."

### 4. Subdomain + demo research (Sonnet agent)

**Recommended architecture:**
```
treylupo.com        → React+Vite (Vercel)
api.treylupo.com    → FastAPI on Fly.io (~$2-4/mo, no cold start)
demos.treylupo.com  → TypeScript SPA (Vercel)
docs.treylupo.com   → Astro Starlight + starlight-openapi
blog.treylupo.com   → Astro + MDX
lab.treylupo.com    → Defer
```

**First demo to build:** Financial-document RAG analysis tool (earnings call / 10-K Q&A with cross-encoder reranking, cited sources, precision metrics). RAG is the most-demanded AI skill in 2026; FP&A domain makes it non-commodity.

**Hosting decision:** Render free tier rejected (30-60s cold starts = dealbreaker for portfolio). Fly.io wins ($5/mo credit covers always-on).

**Docs stack:** Astro Starlight (shares toolchain with planned Astro blog).

### 5. Impeccable audit + Emil review + implementation

**IMPECCABLE_PREFLIGHT:** context=pass product=pass command_reference=pass shape=not_required image_gate=skipped:audit mutation=open

**Audit score: ~14-15/20 (Good) → estimated ~17/20 after fixes**

**Fixes applied in commit `aca29ae` (41 files, +1978 -3035 lines):**

| Category | Issue | Fix |
|----------|-------|-----|
| A11y | `--text-muted` at 2.7:1 contrast | Lifted to `#7A7A8C` (4.7:1, WCAG AA) |
| A11y | TextScramble unreadable by screen readers | Added `aria-label` + `aria-hidden` on scrambled span |
| A11y | Fake tablist on filter buttons | Replaced with `role="group"` + `aria-pressed` |
| A11y | Section labels as `<span>` not headings | Changed to `<h2>` |
| A11y | Footer copy-email no live region | Added `aria-live="polite"` |
| A11y | JetBrains Mono never actually loaded | Added Google Fonts preconnect + stylesheet |
| Motion | `elastic.out` easing (2 instances) | Replaced with `expo.out` / `power3.out` |
| Motion | Lenis initializes for reduced-motion users | Added `prefers-reduced-motion` guard |
| Motion | About parallax runs for reduced-motion | Wrapped in motion check |
| Motion | `blur(1px)` on sibling dimming (perf) | Removed, opacity-only |
| Motion | Hover effects fire on touch devices | Gated behind `(hover: hover) and (pointer: fine)` |
| Motion | Hero sequence lands at ~2.1s | Tightened to ~1.5s |
| Motion | Mobile menu 800ms open/close | Cut to 280ms |
| Motion | `transition: all` on hamburger | Specified exact property |
| Emil | No press feedback on buttons | Added `scale(0.97)` on `:active` for all pressables |
| Emil | Entrance animations use `--ease-out` | Upgraded to `--ease-out-expo` (longer deceleration tail) |
| Perf | rAF leak in useCountUp | Added cleanup return |
| Perf | Unused `isPastHero` state in Header | Removed |
| Hygiene | ~115 lines dead legacy CSS | Purged |
| Hygiene | Duplicate CSS link in index.html | Removed |
| Types | `@types/react` never installed | Added `@types/react` + `@types/react-dom` |
| Decorative | SVG circles used accent blue | Changed to `text-secondary` (monochrome chrome rule) |
| Decorative | Timeline "current" year used accent blue | Changed to `text-primary` |

**New components built:**
- `LineReveal.tsx` — GSAP SplitText line-mask reveal (overflow:hidden wrapper, yPercent 105→0, expo.out, 0.08s stagger). Used on featured project titles.
- Parallax on featured project imagery — `gsap.fromTo` with scrub, ±5% translate, 1.08 scale, overflow:hidden container
- Cursor-follow work preview in AllWork — `gsap.quickTo` with asymmetric x/y lag (0.45s / 0.55s), shows project image or metric panel

**NOT fixed (user decisions needed):**
- `#0066FF` CTA button fails AA at ~4.0:1 — needs brand decision (`#0052CC` passes at 5.6:1)
- nspb-api GitHub link is dead (repo private)

### 6. Real data plates (commits `5c50302`, `c9b9a79`)

Replaced all stock imagery with charts generated from real model runs:

| Plate | Source | Hue | Data |
|-------|--------|-----|------|
| `plate-ferroml-comparison.png` | Live FerroML 10-fold CV run | Electric blue `#4D8DFF` | 4 models, fold scores, 95% CI bands |
| `plate-ferroml-intervals.png` | Live FerroML LinearRegression | Electric blue | Prediction intervals with extrapolation gap |
| `plate-kkbox-models.png` | `models/training_metrics.json` | Violet `#A78BFF` | LightGBM 0.970 AUC, temporal split, 1.9M samples |
| `plate-kkbox-calibration.png` | `models/calibration_metrics.json` | Violet | Isotonic calibration before→after dumbbell |

Generator script saved at `rlupo-portfolio/scripts/make_plates.py`. Requires `ferroml`, `scikit-learn`, `matplotlib` in a venv, plus the KKBOX repo cloned to `/tmp/kkbox`.

**Remaining imagery gaps:**
1. nspb-api — still generic stock cubes (featured slot #1)
2. Revenue forecast — still wearing KKBOX's old image
3. Object detection — could use a real detection overlay

---

## Design decisions confirmed this session

- **Direction:** "Invisible Frame, executed harder" — re-confirmed after user had forgotten the original brief
- **References:** simonholm.studio, darkroom.engineering, Dennis Snellenberg
- **nspb-api:** Keep featured, no link for now (repo private)
- **Projects:** Only feature what's currently in `constants.ts` — don't propose adding work-derived projects
- **Rejected directions:** "Engineer-quiet / writing-first" (Emil/leerob), "Motion-forward editorial" (Awwwards-bait), "Single-type terminal" (Jonas Reymondin)

---

## What's next

**Imagery (highest priority):**
1. nspb-api plate — endpoint-coverage or module-structure diagram from the local SDK
2. Revenue forecast plate — hierarchical reconciliation or forecast-with-intervals in a third hue
3. Object detection — real detection overlay screenshot, treated to match

**Design iteration:**
- User considering uploading to Claude Design for iteration feedback
- `/impeccable polish` for final pass after imagery is complete
- CTA contrast decision (`#0066FF` → `#0052CC`?)

**Content:**
- Activity/shipping log section (darkroom.engineering pattern)
- Writing section (essays as portfolio artifacts)

**Infrastructure:**
- Subdomain CNAME setup when ready
- RAG demo (TypeScript + FastAPI on Fly.io) as first `demos.treylupo.com` project

---

## Files modified this session

**New files:**
- `PRODUCT.md`, `DESIGN.md` — design system documentation
- `rlupo-portfolio/components/LineReveal.tsx` — line-mask text reveal
- `rlupo-portfolio/components/AllWork.tsx` — work list with cursor-follow preview
- `rlupo-portfolio/components/Cursor.tsx` — custom cursor (rewrite)
- `rlupo-portfolio/components/FeaturedProjects.tsx` — featured entries with parallax
- `rlupo-portfolio/public/assets/plate-*.png` — 4 data plates
- `rlupo-portfolio/scripts/make_plates.py` — plate generator

**Modified:**
- `CLAUDE.md` — added skills, design workflow, content guidelines
- `rlupo-portfolio/App.tsx` — new component imports
- `rlupo-portfolio/components/About.tsx` — reduced-motion, decorative color fix
- `rlupo-portfolio/components/Footer.tsx` — aria-live
- `rlupo-portfolio/components/Header.tsx` — aria-label, removed unused state
- `rlupo-portfolio/components/Hero.tsx` — elastic→expo easing
- `rlupo-portfolio/components/TextScramble.tsx` — aria-label + aria-hidden
- `rlupo-portfolio/constants.ts` — image URLs updated
- `rlupo-portfolio/hooks/useLenis.ts` — reduced-motion guard
- `rlupo-portfolio/index.html` — JetBrains Mono font, removed duplicate CSS link
- `rlupo-portfolio/package.json` — added @types/react, @types/react-dom
- `rlupo-portfolio/styles/index.css` — contrast fix, press feedback, hover guards, dead CSS purge, new component styles

**Deleted (legacy pre-redesign):**
- `components/CustomCursor.tsx`, `FluidGlass.tsx`, `ProjectCard.tsx`, `ProjectFilter.tsx`, `ProjectsSection.tsx`, `ScrollProgress.tsx`, `SectionPagination.tsx`, `ThemeToggle.tsx`
- All `shaders/fluidglass/*.ts` files (12 files)

---

## Memory files created/updated

- `project_portfolio_roadmap.md` — project inventory, subdomain plan, user decisions
- `project_award_patterns.md` — award-tier animation patterns, confirmed direction
