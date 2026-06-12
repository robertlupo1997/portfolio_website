# Portfolio Website — treylupo.com

## Project Overview
Personal portfolio site for Trey Lupo — FP&A analyst, data scientist, and AI/ML engineer.
Built with React 19 + Vite + TypeScript. Deployed on Vercel at treylupo.com.

## Tech Stack
- **Framework:** React 19 + Vite + TypeScript
- **Animations:** GSAP + Lenis (smooth scroll)
- **WebGL:** OGL (FluidGlass shader effect)
- **Icons:** Lucide React
- **Deployment:** Vercel
- **Domain:** treylupo.com (www.treylupo.com)

## Project Structure
All source lives in `rlupo-portfolio/`:
```
rlupo-portfolio/
├── App.tsx              # Root component
├── constants.ts         # Project data, personal info, categories
├── types.ts             # TypeScript interfaces
├── components/          # React components
├── hooks/               # Custom hooks (Lenis, scroll animations, text scramble)
├── shaders/             # OGL/WebGL shader code (FluidGlass)
├── styles/              # CSS
└── public/              # Static assets (images)
```

## Key Files
- `constants.ts` — All project data, links, categories. Edit here to add/update portfolio items.
- `types.ts` — Project and ProjectCategory type definitions.
- `App.tsx` — Main layout: Header → Hero → ProjectsSection → About → Footer.

## Development
```bash
cd rlupo-portfolio
npm install
npm run dev        # http://localhost:3000
npm run build      # Production build
```

## Design Principles
- Dark theme with accent colors per project card
- GSAP scroll-triggered animations throughout
- Custom cursor, text scramble effects
- Fluid glass WebGL background effect
- Mobile-responsive, accessible (skip-link, semantic HTML)

## Subdomain Architecture (Planned)
```
treylupo.com           → Main portfolio (this repo)
docs.treylupo.com      → API docs (nspb-api SDK documentation)
blog.treylupo.com      → Technical blog (Astro + MDX)
demos.treylupo.com     → Live project demos
lab.treylupo.com       → ML experiments / interactive notebooks
```
Each subdomain = separate Vercel project + CNAME record.

## Skills to Use

### Design Skills (use for all UI/design work)

**Core design workflow:**
- `/impeccable` — Primary design skill with 23 commands: `/impeccable audit` (a11y + perf), `/impeccable critique` (UX review), `/impeccable polish` (pre-ship), `/impeccable animate` (GSAP-ready motion), `/impeccable bolder` (amplify dull designs)
- `/design-taste-frontend` — Anti-slop frontend skill. Prevents generic AI aesthetics, enforces premium layout/typography/motion
- `/high-end-visual-design` — Soft, premium UI with whitespace and spring motion (Notion/Linear tier)
- `/emil-design-eng` — Emil Kowalski's design engineering philosophy. Use when reviewing animations, micro-interactions, invisible polish details

**Design inspiration & research:**
- `npx designlang <url>` — Extract any site's full design system (tokens, Tailwind config, shadcn theme, Figma vars). Run on reference portfolios before building new sections.
  - Example: `npx designlang https://linear.app` → outputs to `./design-extract-output/`
- `/ui-ux-pro-max` — 161 reasoning rules + 67 UI styles + design system generator. Use when deciding on visual direction.
- HTML template reference: `https://github.com/zarazhangrui/beautiful-html-templates` — 34 high-quality HTML slide deck templates (editorial, brutalist, retro, soft styles). Browse for layout/color/typography inspiration before designing new sections.

**Animation & prototyping:**
- `/huashu-design` — HTML prototypes, animations, interactive demos. Use to plan complex GSAP sequences before coding.
- `/image-to-code` — Generate site from image reference, then implement the code to match

**Other available skills:**
- `/minimalist-ui` — Editorial product UI, restrained palette, crisp structure
- `/redesign-existing-projects` — Audit existing UI then fix layout/spacing/hierarchy
- `/full-output-enforcement` — Forces complete code output (no placeholder stubs)
- `/industrial-brutalist-ui` — Hard mechanical aesthetic (use sparingly)

**shadcn/ui (if adding components):**
```bash
cd rlupo-portfolio
npx shadcn@latest init
npx shadcn@latest add button card dialog
```

### Process Skills
- `/superpowers:brainstorming` — Before any new feature or section design
- `/superpowers:writing-plans` — Before multi-step implementation work
- `/superpowers:executing-plans` — When executing a written plan
- `/superpowers:verification-before-completion` — Before claiming any work is done
- `/superpowers:finishing-a-development-branch` — When ready to merge/PR
- `/superpowers:test-driven-development` — For any logic/utility code
- `/superpowers:requesting-code-review` — Before merging major changes

## Content Guidelines
- Showcase production-quality work, not academic exercises
- Priority projects: nspb-api, ferroml, ironclad, hierarchical-revenue-forecast
- Each project card needs: title, category, metric, GitHub link, live demo if available
- Write for a technical hiring manager audience
