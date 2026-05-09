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
- `/frontend-design` — For any UI/design work
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
