---
date: 2026-05-09T19:00:00-04:00
git_commit: 324b72b
branch: redesign/typography-driven
status: complete
---

# Handoff: Design Iteration — Use Impeccable Properly

## Task(s)

### Completed
- Full redesign implementation (12 tasks from plan)
- CSS rework round 1: increased hero hook size, metric display size, manifesto size, ghost name scale
- Playwright installed for visual comparison
- Research on design workflows with Claude Code

### Key Finding
The impeccable skill (installed at ~/.claude/skills/impeccable/) has a structured design workflow that should be used instead of manual CSS tweaking. The workflow is:

1. `/impeccable teach` — interview about audience, goals, constraints
2. `/impeccable document` — capture current state
3. `/impeccable shape` — create a design brief (requires explicit user confirmation)
4. `/impeccable craft` — implement the design
5. `/impeccable live` — browser iteration loop with hot-swap (start dev server first)
6. `/impeccable critique` or `/impeccable audit` — evaluate the result
7. `/impeccable polish` — final refinements

The `/impeccable live` command is the key tool: click any element in the browser, annotate it, get 3 production-quality variants hot-swapped via HMR, accept or discard.

### Anti-patterns flagged by impeccable that our build currently uses:
- Big number + small label + gradient accent (the "hero-metric template")
- Identical card grids
- The editorial-typographic aesthetic lane (display serif + mono labels + monochromatic restraint)

## Critical References
- `docs/superpowers/specs/2026-05-09-portfolio-redesign-design.md` — approved design spec
- `thoughts/research/design-workflow-guide.md` — how to use impeccable + design tools
- `thoughts/research/awards-inspiration.md` — reference sites and patterns
- Reference sites the user liked: rauno.me, cydstumpel.nl, federicopian.com, imarketina.com

## Current State
- Dev server runs at localhost:3000 from `cd ~/projects/portfolio_website/rlupo-portfolio && node node_modules/.bin/vite --host 0.0.0.0 --port 3000`
- Playwright installed for screenshots: `npx playwright screenshot --browser chromium --full-page "http://localhost:3000/" screenshot.png`
- CSS rework partially applied (hero larger, metrics larger, manifesto larger)

## Action Items
1. Start fresh session in `~/projects/portfolio_website`
2. Start dev server
3. Run `/impeccable teach` to begin the structured design workflow
4. Use `/impeccable live` for browser-based iteration
5. Compare against reference sites using Playwright screenshots

## Learnings
- design-extract (starred repo) can extract design tokens from reference sites
- open-design has 71 pre-built design systems
- Claude Design (claude.ai/design) exists for direction-finding before building
- The biggest gap isn't CSS values — it's visual tension, rhythm, and avoiding AI-generated patterns
