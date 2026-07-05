# Final Session Handoff: Precision Dark Rebuild (2026-06-13)

## For the next session

You are rebuilding treylupo.com — a personal portfolio for Trey Lupo (FP&A analyst / AI-ML engineer at Franklin Street, Tampa, FL). The goal is a site so good that no $200M company could imagine one of their employees making it. The primary reference site is **https://www.francescomichelini.com/** (Folio/23 by Francesco Michelini, designed by Unlearn Studio).

---

## Current state

**Branch:** `redesign/invisible-frame`
**Latest commit:** `9c36dbc` — Precision Dark rebuild complete (8 tasks executed via subagent-driven development)
**Build status:** Clean — `npx tsc --noEmit` and `npm run build` both pass
**Dev server:** `cd rlupo-portfolio && npm run dev` → http://localhost:3000

The site currently has:
- Centered hero with Space Grotesk display name, single copper CTA
- Horizontal nav (JetBrains Mono) with GSAP scroll show/hide
- Credential strip marquee (proof tokens: MIT cert, FerroML tests, KKBOX AUC, etc.)
- Unified P/01 project list with slash grammar (`//api engineering`, `/26`)
- Cursor-follow image preview on project hover
- Clean about section (two-column grid, copper skill tags, timeline folded in)
- Footer conclusion block with closing statement
- Copper accent `#C87533`, Inter body, Space Grotesk hero, JetBrains Mono labels
- Real data plates from FerroML and KKBOX model runs (not stock images)

**What's NOT done yet — the next session's job:**
The site has the right structural system (P/01 labels, slash grammar, credential strip) but does NOT yet match Michelini's spatial proportions, typography weight, animation quality, or layout density. The next session needs to study the reference screenshots closely and implement the specific spatial/typographic/animation differences.

---

## The reference: francescomichelini.com

**16 user-captured screenshots** are at `thoughts/reference-screenshots/`. These show:
- 6+ color theme variants (he has a theme toggle — cream/olive, dark/lime, dark/purple, dark/coral, warm olive, deep brown). **The colors don't matter. The structure, typography, spacing, and animation patterns do.**
- Project detail view: each project is a full-viewport experience with image carousel (center), metadata grid (YEAR · AGENCY · ROLE · AWARDS), project title in Monorama display, P/01 label, VISIT CTA, PREV/NEXT navigation
- Projects list view (`/projects`): staggered list with P/01–P/10 labels, project names in large display type, small image thumbnails inline, year on the right
- Info page: name at display scale, award tallies (SOTD 10, Dev Award 9, etc.), social links, colophon (DESIGN / UNLEARN STUDIO, DEVELOPMENT / FRANCESCO MICHELINI, FONTS / MONORAMA / NEUE HAAS GROTESK / FAVORIT MONO)

**His design system** (extracted via `npx designlang`):
- Fonts: Monorama (display), Neue Haas Grotesk (body), Favorit Mono (labels/metadata)
- Font scale: 56px, 48px, 43px, 32px, 26px, 24px, 16px, 13px, 12px
- Border radius: 4px only
- Material: flat (no shadows, no blur, no gradients)
- Slash grammar: `P/01`, `//`, `/23` — the forward slash is a universal delimiter

**Extracted design tokens at:** `design-extract-output/francescomichelini-com-*` (28 files including CSS variables, Tailwind config, motion tokens, Figma variables)
**Full site mirror at:** `~/projects/michelini-reference/www.francescomichelini.com/` (152MB — HTML/CSS/JS/fonts/images, but requires JS to render so can't be opened directly as HTML files)
**Also saved to Windows:** `C:\Users\Trey\Downloads\references\` (mirror, tokens, screenshots)

---

## What to focus on next (in priority order)

### 1. Spatial proportions — study and match Michelini's layout

The biggest gap between our site and his is NOT colors or fonts — it's the spatial relationships. Study the screenshots and note:
- His project view takes the full viewport — the image carousel sits center, metadata grid below, title bottom-left
- His nav is minimal: just PROJECTS and INFO top-right, logo top-left
- His "FOLIO /2023" label is positioned far-right as a vertical element
- His project metadata grid has four labeled columns: YEAR · AGENCY · ROLE · AWARDS, each with `■` bullet markers
- His projects list view uses staggered positioning, not a uniform grid

### 2. Typography weight and proportions

His display type (Monorama) is larger and heavier than our Space Grotesk. The project title "FANFANFAN" fills roughly 40% of the viewport width. Our project titles in the folio list are body-sized. The scale contrast between his display and label type is much more dramatic.

### 3. Animation and interaction

Cannot be seen in screenshots — must be studied live at francescomichelini.com:
- Page transitions between projects (Nuxt + GSAP)
- Image carousel behavior
- Text reveal animations
- Hover states on project entries
- The custom cursor behavior
- The theme toggle animation

### 4. Layout structure

His site is multi-page (Nuxt routes: `/`, `/projects`, `/info`, `/projects/[slug]`). Ours is single-page. The single-page approach is fine for now but the project detail view (when you click a project) is what makes his site feel like a complete portfolio vs a list.

---

## Skills to use

All of these are available in Claude Code — do NOT send the user to Claude Design for critique:

- **`/impeccable critique`** — Run against the current site with the reference screenshots as context
- **`/impeccable polish`** — Final pass before shipping
- **`/impeccable animate`** — For animation improvements
- **`/impeccable layout`** — For spacing/rhythm fixes
- **`/impeccable typeset`** — For typography hierarchy fixes
- **`emil-design-eng`** — For animation quality review (easing, timing, interruptibility)
- **`design-taste-frontend`** — For anti-slop enforcement

**Do not suggest the user go to Claude Design (claude.ai) for feedback.** All critique and implementation happens here in Claude Code.

---

## Files that matter

| File | What it does |
|------|-------------|
| `rlupo-portfolio/styles/index.css` | All CSS — design tokens in `:root`, component styles below |
| `rlupo-portfolio/components/Hero.tsx` | Centered hero, Space Grotesk name, magnetic CTA |
| `rlupo-portfolio/components/Header.tsx` | Horizontal nav, GSAP scroll show/hide |
| `rlupo-portfolio/components/ProjectList.tsx` | Unified P/01 folio list with cursor-follow preview |
| `rlupo-portfolio/components/CredentialStrip.tsx` | Horizontal marquee of proof tokens |
| `rlupo-portfolio/components/About.tsx` | Two-column grid, skills + timeline |
| `rlupo-portfolio/components/Footer.tsx` | Conclusion block with closing statement |
| `rlupo-portfolio/components/LineReveal.tsx` | GSAP SplitText line-mask reveal |
| `rlupo-portfolio/components/TextScramble.tsx` | Character scramble effect |
| `rlupo-portfolio/components/Cursor.tsx` | Custom cursor with hover states |
| `rlupo-portfolio/constants.ts` | All project data, credentials, skills, timeline |
| `rlupo-portfolio/types.ts` | TypeScript interfaces |
| `rlupo-portfolio/App.tsx` | Root component |
| `DESIGN.md` | Current design system spec (Precision Dark) |
| `PRODUCT.md` | Brand context, users, principles |

---

## Files that are IRRELEVANT — do not reference

These are from prior abandoned directions and will confuse you:

| File | Why irrelevant |
|------|---------------|
| `thoughts/handoffs/2026-05-09_*` through `2026-05-19_*` | Old Invisible Frame iterations, pre-Precision Dark |
| `docs/superpowers/plans/2026-05-17-foundation-monorepo.md` | Abandoned monorepo plan |
| `docs/superpowers/specs/2026-05-17-portfolio-rebuild-design.md` | Abandoned rebuild spec |
| `thoughts/handoffs/2026-06-12-fable-redesign-session.md` | Fable session — useful for context on project inventory and research, but the design decisions in it were superseded by Precision Dark |
| `thoughts/handoffs/2026-06-13-claude-design-review.md` | Claude Design layout critique — some findings are still valid (hero void, footer dissipation) but the specific CSS recommendations are for the old Invisible Frame code |
| `thoughts/claude-design-prompt.md` | Prompt template for Claude Design — no longer needed |
| `thoughts/review-screenshots/review-*.png` | Screenshots of the OLD Invisible Frame design, not current |
| `Layout Critique.html` | Claude Design HTML output for old design |
| `.impeccable/` | Old impeccable session artifacts |
| `.superpowers/` | Old brainstorm session artifacts |

---

## Files that ARE relevant

| File | Why useful |
|------|-----------|
| `thoughts/reference-screenshots/*.png` | **16 user-captured screenshots of francescomichelini.com** — THE primary reference |
| `design-extract-output/francescomichelini-com-*` | Extracted design tokens from the reference site |
| `thoughts/DESIGN-precision-dark-candidate.md` | The design spec we're building toward (now copied to root `DESIGN.md`) |
| `thoughts/portfolio-inspiration-research.md` | Award-tier portfolio patterns (still valid) |
| `thoughts/handoffs/2026-06-13-build-workflow-research.md` | How award-winning devs actually build (Codrops interviews) |
| `thoughts/handoffs/2026-06-13-precision-dark-rebuild-plan.md` | The 8-task plan that was executed this session |
| `rlupo-portfolio/scripts/make_plates.py` | Generator for the FerroML/KKBOX data plate images |
| `rlupo-portfolio/public/assets/plate-*.png` | Real data plates from model runs |

---

## Project content decisions (locked)

- **Only feature projects currently in `constants.ts`** — do not propose adding work-derived projects (DealForecast, Gjald/Ledge) without the user raising it
- **nspb-api stays featured with no link** — the GitHub repo is private
- **Work-derived projects are off-limits** — user builds them for his employer (Franklin Street)
- **The user wants to be positioned as "the AI guru for any company"** — the site needs to demonstrate that level of capability

---

## Memory files

Check `~/.claude/projects/-home-tlupo-projects-portfolio-website/memory/MEMORY.md` for:
- User profile (role, goals)
- Portfolio design direction (confirmed Precision Dark)
- Design workflow preferences (use impeccable skill, not manual CSS)
- Project roadmap (subdomain plan, RAG demo)
- Award-tier patterns (line-mask reveals, credential density)

---

## Tech stack

- React 19 + Vite + TypeScript
- GSAP (ScrollTrigger, SplitText) + Lenis (smooth scroll)
- Space Grotesk (display, hero only) + Inter (body) + JetBrains Mono (labels/nav/metadata)
- Deployed on Vercel at treylupo.com
- Dev: `cd rlupo-portfolio && npm run dev` → http://localhost:3000
- Build: `npm run build` (clean, ~253KB JS gzipped to 85KB)

---

## What the user wants

In his own words: "I need to be so advanced that I'm like the AI guru for any company. I want the website to look very clean and look like something that no $200M company could imagine one of their employees making. It has to be better than that."

He is studying francescomichelini.com not for the colors but for **the lettering, the formation of the site, the animations, the mouse, the links, everything structural.** Match those proportions and that level of craft. Use the design skills available in Claude Code to critique and iterate. Do the work here.
