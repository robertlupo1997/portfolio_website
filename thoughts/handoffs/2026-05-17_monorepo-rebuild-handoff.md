# Handoff: Portfolio Monorepo Rebuild

**Date:** 2026-05-17
**Session:** Brainstorming + architecture design + Plan 1 written
**Next session location:** `~/projects/treylupo` (new repo, doesn't exist yet)

---

## What Was Done

1. **Researched and installed 22+ design/UI skills** into the portfolio project at `~/projects/portfolio_website/.agents/skills/`. These are Claude Code skills that auto-activate when working on UI/design tasks.

2. **Brainstormed and designed** a full architecture for rebuilding treylupo.com as a Next.js 15 + Turborepo monorepo. Design spec written and approved.

3. **Wrote Plan 1 of 5** (Foundation: monorepo scaffold + design tokens + UI package + portfolio shell). Ready to execute.

## Key Files

- **Design Spec:** `docs/superpowers/specs/2026-05-17-portfolio-rebuild-design.md`
- **Plan 1:** `docs/superpowers/plans/2026-05-17-foundation-monorepo.md`
- **Existing design system:** `DESIGN.md` (void palette, Satoshi typography, spacing, components)
- **Product doc:** `PRODUCT.md` (audience, brand personality, references, anti-references)

## Plans Remaining (to be written when needed)

- Plan 2: Portfolio Homepage — all sections + animations + header/nav
- Plan 3: Case Studies — MDX setup + project pages + data layer
- Plan 4: Blog App — separate Next.js app with MDX
- Plan 5: Docs + Demos + Deployment — remaining apps + Vercel setup

## CRITICAL: Design Skills Were NOT Used

**None of the installed design skills were invoked during the brainstorming or planning session.** The architecture and component designs have NOT been reviewed by:

- `/impeccable` — design audit, anti-pattern detection, polish review
- `/design-taste-frontend` — anti-slop frontend quality enforcement
- `/ui-ux-pro-max` — 161 reasoning rules, 67 UI styles, design system validation
- `/emil-design-eng` — animation decisions, micro-interaction review, UI polish
- `/high-end-visual-design` — premium design standards enforcement
- `/gpt-taste` — GSAP motion engineering, layout variance rules

### What the next session MUST do:

**Before executing Plan 1**, invoke these skills to review the design spec and plan:

1. Run `/impeccable audit` against the design spec — check for anti-patterns in the component designs (especially Button, Badge, Card specs in the plan)
2. Run `/design-taste-frontend` to review the typography scale, spacing system, and layout decisions for generic AI slop
3. Run `/ui-ux-pro-max` to validate the color system, font pairing (Satoshi + JetBrains Mono), and component architecture against its 161 reasoning rules
4. Run `/emil-design-eng` to review the animation system decisions (GSAP + Framer Motion split, motion rules, easing curves, the text scramble as the "selective surprise")

**After executing Plan 1** (once the portfolio shell renders in a browser):

5. Run `/impeccable polish` against the rendered placeholder page
6. Run `/redesign-existing-projects` to audit the initial component output

### Why this matters:

The whole reason we installed these skills was to avoid generic AI-generated design. The plan currently has component code (Button, Badge, Card) that was written without any design skill review. Those components could easily fall into the patterns the skills are designed to catch — generic shadcn defaults, safe color choices, boring hover states.

## Installed Skills (full list)

Located at `~/projects/portfolio_website/.agents/skills/`:

| Skill | Source Repo | Purpose |
|-------|------------|---------|
| `emil-design-eng` | emilkowalski/skill | Animation philosophy, UI polish |
| `design-taste-frontend` | taste-skill | Anti-slop frontend quality |
| `high-end-visual-design` | taste-skill | Premium design standards |
| `minimalist-ui` | taste-skill | Editorial product UI |
| `industrial-brutalist-ui` | taste-skill | Mechanical aesthetic |
| `brandkit` | taste-skill | Brand identity boards |
| `image-to-code` | taste-skill | Design reference → code |
| `imagegen-frontend-web` | taste-skill | Web design image generation |
| `imagegen-frontend-mobile` | taste-skill | Mobile design images |
| `gpt-taste` | taste-skill | GSAP motion + layout engineering |
| `stitch-design-taste` | taste-skill | Design system generation |
| `full-output-enforcement` | taste-skill | Forces complete code output |
| `redesign-existing-projects` | taste-skill | Audit + fix existing UI |
| `extract-design` | design-extract | Extract design systems from URLs |
| `ui-ux-pro-max` | ui-ux-pro-max-skill | Design intelligence (67 styles, 161 rules) |
| `ckm-design` | ui-ux-pro-max-skill | Comprehensive design skill |
| `ckm-brand` | ui-ux-pro-max-skill | Brand voice + identity |
| `ckm-design-system` | ui-ux-pro-max-skill | Token architecture |
| `ckm-ui-styling` | ui-ux-pro-max-skill | shadcn/ui + Tailwind styling |
| `ckm-slides` | ui-ux-pro-max-skill | HTML presentations |
| `ckm-banner-design` | ui-ux-pro-max-skill | Banner/social design |
| `impeccable` | impeccable | 23 design commands, 27 anti-patterns |

## Architecture Decisions (for context)

- **Next.js 15** (App Router) — SSR/SSG, file-based routing
- **Turborepo** monorepo — 4 apps (portfolio, blog, docs, demos), 3 packages (ui, design-tokens, config)
- **pnpm** workspaces
- **Tailwind CSS v4** — styled via design-tokens Tailwind preset
- **shadcn/ui** — shared components in packages/ui
- **GSAP + ScrollTrigger** — scroll-driven animations
- **Framer Motion** — component micro-interactions
- **Lenis** — smooth scroll
- **No OGL/WebGL** — dropped fluid glass shader
- **MDX** — project case studies and blog posts
- **Vercel** — one repo, four projects, four subdomains
