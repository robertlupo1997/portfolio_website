# Handoff: Ready for Plan 2 — Portfolio Homepage

**Date:** 2026-05-19
**Branch (old repo):** `redesign/invisible-frame` in `~/projects/portfolio_website`
**New repo:** `~/projects/treylupo` (main branch, 2 commits)

---

## Two Repos

There are two repos in play. The old one holds planning docs and design skills. The new one holds the actual code.

| Repo | Path | Purpose |
|---|---|---|
| portfolio_website | `~/projects/portfolio_website` | Planning docs, design specs, installed skills, DESIGN.md, PRODUCT.md source of truth |
| treylupo | `~/projects/treylupo` | The actual monorepo being built. This is the production codebase. |

## What Exists in `~/projects/treylupo`

**2 commits on main. Build passes. Tests pass.**

```
treylupo/
├── apps/portfolio/          → Next.js 15 app shell (renders at localhost:3000)
│   ├── app/layout.tsx       → Root layout with skip-link, font variables, metadata
│   ├── app/page.tsx         → Placeholder page proving token pipeline works
│   ├── app/globals.css      → Tailwind v4 directives, @config, @theme, grain overlay, reduced-motion
│   ├── app/fonts.ts         → Satoshi (local woff2) + JetBrains Mono (Google Fonts)
│   ├── tailwind.config.ts   → Extends design-tokens preset
│   └── postcss.config.mjs   → @tailwindcss/postcss
├── packages/design-tokens/  → @treylupo/design-tokens
│   ├── src/colors.ts        → OKLCH void palette (9 colors + 1 accent)
│   ├── src/typography.ts    → Satoshi scale + JetBrains Mono, weights
│   ├── src/spacing.ts       → xs through section (clamp)
│   ├── src/animation.ts     → Easing curves (out/inOut), durations (fast/default/slow), exit durations
│   ├── src/tailwind-preset.ts → Maps all tokens to Tailwind theme.extend
│   └── tests/tokens.test.ts → 3 tests, all pass
├── packages/ui/             → @treylupo/ui
│   ├── src/button.tsx       → CVA variants (primary/outline/ghost), font-semibold, active:scale, no transition-all
│   ├── src/badge.tsx        → CVA variants (default/active), JetBrains Mono 0.65rem
│   ├── src/card.tsx         → Primitive container ONLY (not for project grids — see note below)
│   └── src/cn.ts            → clsx + tailwind-merge
├── packages/config/         → @treylupo/config (shared tsconfig, eslint)
├── CLAUDE.md, PRODUCT.md, DESIGN.md
├── turbo.json, pnpm-workspace.yaml
└── pnpm-lock.yaml
```

## Known Issue: Tailwind v4 Timing Tokens

Custom timing utilities (`duration-hover`, `ease-out` with custom curve) defined in `@theme` are NOT generating CSS when `@config` is also present. Colors, fonts, and spacing all work fine.

**Recommended fix for Plan 2:** Apply transitions via GSAP/Framer Motion directly (bypass Tailwind for animation properties). This is the natural approach anyway since Plan 2 introduces GSAP.

## What Was Done Before Building

Three design skills were run against the spec and Plan 1 before execution:

1. **`/impeccable audit`** — 12/20 score. Key findings: Button had wrong tracking/weight/transition-all, Card enables identical-grid anti-pattern, hex colors instead of OKLCH, no skip-link. All P1 issues were fixed before execution.

2. **`/design-taste-frontend`** — Validated font pairing (Satoshi + JetBrains Mono approved). Flagged: title/body were same size (fixed to 1.05/0.95), no mobile breakpoint conventions, Card is generic. Set DESIGN_VARIANCE: 8, MOTION_INTENSITY: 6, VISUAL_DENSITY: 4.

3. **`/emil-design-eng`** — GSAP/Framer split is architecturally clean. Missing: button `:active` state (fixed), no hover media query gate, no asymmetric exit timing (added to tokens), spring ban too absolute (allow for drag/gesture only), no GSAP→Framer handoff convention (use `clearProps: true`).

## What Needs to Happen Next

### Immediate: Write and Execute Plan 2

Plan 2 is the homepage: Hero, FeaturedProjects, AllWork, About, Contact, Footer, Header, and all animations.

**Before writing Plan 2, run:**
1. `/impeccable shape` — Design the homepage layout. The FeaturedProjects section needs varied visual weight per project, NOT a uniform card grid. This is the hardest design problem in the whole site.
2. Decide on project imagery strategy — PRODUCT.md says "large-format project imagery that bleeds with minimal padding" but no images exist yet. Options: screenshots, generated OG images, or text-only with metric emphasis.

**Plan 2 scope should include:**
- Hero with text scramble (the "selective surprise")
- FeaturedProjects — 3-4 projects with varied layout per entry
- AllWork — filterable grid with varied card sizes
- About section
- Contact CTA
- Header (fixed, backdrop-blur, sparse nav)
- Footer
- Lenis smooth scroll
- GSAP ScrollTrigger reveals on all sections
- Framer Motion for component interactions (card hover, filter pills)

### Later Plans (not yet written)
- Plan 3: Case Studies — MDX setup + /projects/[slug] pages
- Plan 4: Blog App — blog.treylupo.com
- Plan 5: Docs + Demos + Deployment — remaining apps + Vercel

## Design Findings to Carry into Plan 2

These are audit findings that couldn't be addressed in Plan 1 (foundation) and need to be built into Plan 2:

| Finding | Source | Action |
|---|---|---|
| Card is a primitive only | All 3 skills | Build project entries with custom CSS Grid layouts, not Card wrappers |
| Hover effects need media query | Emil | Wrap hover animations in `@media (hover: hover) and (pointer: fine)` |
| GSAP→Framer handoff | Emil | Use `clearProps: true` when GSAP scroll animation completes before Framer takes over |
| Springs only for drag/gesture | Emil | No springs on standard UI transitions (buttons, hovers, reveals) |
| Asymmetric exit timing | Emil | Exits at 60% of enter duration — tokens already defined |
| No `transition-all` anywhere | All 3 skills | Always specify exact CSS properties in transitions |
| One surprise only | DESIGN.md | Text scramble on Hero. Everything else is quiet functional motion. |
| No centered hero at DESIGN_VARIANCE 8 | Design-taste | Split-screen or left-aligned hero, not centered text |

## Key Reference Documents

All in `~/projects/portfolio_website`:

| Document | Path | Content |
|---|---|---|
| Design spec | `docs/superpowers/specs/2026-05-17-portfolio-rebuild-design.md` | Full architecture: pages, components, data flow, animation, deployment |
| Plan 1 (executed) | `docs/superpowers/plans/2026-05-17-foundation-monorepo.md` | Foundation plan with all audit fixes incorporated |
| DESIGN.md | `DESIGN.md` (also copied to treylupo) | The Invisible Frame design system: void palette, typography, components, do's/don'ts |
| PRODUCT.md | `PRODUCT.md` (also copied to treylupo) | Brand register, users, references, anti-references, design principles |
| Previous handoff | `thoughts/handoffs/2026-05-17_plan1-complete-handoff.md` | Detailed Plan 1 completion notes |
| Monorepo handoff | `thoughts/handoffs/2026-05-17_monorepo-rebuild-handoff.md` | Original brainstorming session handoff |

## Design Skills Available

22+ skills installed at `~/projects/portfolio_website/.agents/skills/`. The ones most relevant for Plan 2:

- `/impeccable shape` — **Must run first.** Designs the UX/UI before code.
- `/impeccable craft` — Shape then build end-to-end.
- `/design-taste-frontend` — Anti-slop enforcement during implementation.
- `/emil-design-eng` — Animation decisions and micro-interaction review.
- `/gpt-taste` — GSAP ScrollTrigger patterns, layout variance rules.
- `/impeccable animate` — Add purposeful animations and motion.
- `/full-output-enforcement` — Forces complete code output (no stubs).

## Content Data

Project data for the portfolio lives in `~/projects/portfolio_website/rlupo-portfolio/constants.ts`. Priority projects per PRODUCT.md:
- nspb-api (SDK, 200+ endpoints)
- ferroml (ML framework)
- ironclad (security)
- hierarchical-revenue-forecast (finance/ML)

These need to be migrated into MDX frontmatter files in Plan 3, but Plan 2 can use hardcoded data initially.
