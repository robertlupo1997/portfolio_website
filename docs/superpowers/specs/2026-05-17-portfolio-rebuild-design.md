# Portfolio Website Rebuild — Architecture Design Spec

## Overview

Full rebuild of treylupo.com as a Next.js 15 monorepo with Turborepo, supporting four subdomains (portfolio, blog, docs, demos) from a single repository. Replaces the current React 19 + Vite SPA with a server-rendered, statically generated architecture.

## Goals

- Rebuild the portfolio with proper folder structure and framework conventions
- Support all planned subdomains from a shared codebase
- Maintain the "Invisible Frame" design language from DESIGN.md
- Achieve good SEO and fast page loads via SSG
- Keep the animation quality (GSAP scroll + text scramble) while dropping WebGL complexity

## Non-Goals

- CMS integration (content stays in MDX files)
- User authentication or dynamic server features
- The `lab.treylupo.com` subdomain (deferred to a future milestone)

---

## 1. Monorepo Structure

**Package manager:** pnpm
**Build orchestrator:** Turborepo

```
treylupo/
├── apps/
│   ├── portfolio/          → treylupo.com (Next.js 15, App Router)
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── projects/[slug]/page.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── hero.tsx
│   │   │   ├── project-card.tsx
│   │   │   ├── project-grid.tsx
│   │   │   ├── featured-projects.tsx
│   │   │   ├── all-work.tsx
│   │   │   ├── about.tsx
│   │   │   ├── contact.tsx
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   └── cursor.tsx
│   │   ├── content/
│   │   │   └── projects/       ← .mdx case study files
│   │   ├── lib/
│   │   │   ├── projects.ts
│   │   │   └── animations.ts
│   │   ├── hooks/
│   │   │   ├── use-scroll-animation.ts
│   │   │   └── use-text-scramble.ts
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   ├── blog/               → blog.treylupo.com (Next.js + MDX)
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── content/posts/
│   │   └── package.json
│   │
│   ├── docs/               → docs.treylupo.com (Fumadocs)
│   │   └── package.json
│   │
│   └── demos/              → demos.treylupo.com (Next.js)
│       └── package.json
│
├── packages/
│   ├── ui/                 → shared shadcn/ui + custom components
│   │   ├── src/components/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   └── index.ts
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   ├── design-tokens/      → DESIGN.md as typed TypeScript constants
│   │   ├── tokens.ts
│   │   ├── tailwind-preset.ts
│   │   └── package.json
│   │
│   └── config/             → shared ESLint, TypeScript, Tailwind configs
│       ├── eslint/
│       ├── typescript/
│       └── package.json
│
├── turbo.json
├── package.json
├── pnpm-workspace.yaml
├── CLAUDE.md
├── PRODUCT.md
└── DESIGN.md
```

Each app is a separate Vercel project pointing at the same Git repo with a different root directory. Turborepo handles build orchestration and only rebuilds apps whose dependencies changed.

---

## 2. Page Architecture

### Portfolio App (treylupo.com)

**Homepage (`/`)** — single-page scroll layout:
1. `<Header />` — fixed, backdrop-blur nav
2. `<Hero />` — name with text scramble, tagline
3. `<FeaturedProjects />` — 3-4 hero projects with varied layout and visual weight
4. `<AllWork />` — filterable grid of remaining projects with varied card sizes
5. `<About />` — bio, skills, background
6. `<Contact />` — CTA, email, social links
7. `<Footer />` — links, copyright

**Case Study (`/projects/[slug]`)** — individual project deep-dive:
1. `<Header />` — same nav with back link
2. `<ProjectHero />` — title, category, key metric
3. `<ProjectMeta />` — stack, timeline, role, links
4. `<ProjectBody />` — MDX content: problem → approach → results
5. `<ProjectNav />` — previous/next project links
6. `<Footer />`

### Server vs Client Components

**Server Components (default — no JS shipped):**
- `layout.tsx`, `Header`, `Footer`, `About`
- `ProjectHero`, `ProjectMeta`, `ProjectBody`, `ProjectNav`

**Client Components ("use client" — JS required for interactivity):**
- `Hero` — text scramble animation
- `FeaturedProjects` — GSAP ScrollTrigger
- `AllWork` — filter state + animations
- `Cursor` — mouse tracking
- `Contact` — mailto link + social links (no form needed; converts via email)
- `ScrollReveal` — reusable GSAP scroll wrapper
- `SmoothScroll` — Lenis provider

---

## 3. Data Flow

Project data lives in MDX files with frontmatter. No database, no CMS, no API calls.

```
content/projects/nspb-api.mdx
---
title: "nspb-api"
slug: "nspb-api"
category: "SDK"
stack: ["Python", "Oracle EPM", "REST API"]
metric: "200+ API endpoints"
featured: true
order: 1
github: "https://github.com/..."
demo: "https://docs.treylupo.com"
---

## The Problem
...

## The Approach
...

## The Results
...
```

`lib/projects.ts` reads MDX frontmatter at build time:
- `getAllProjects()` — sorted list for AllWork grid
- `getFeaturedProjects()` — filtered for homepage hero section
- `getProjectBySlug(slug)` — single project for case study page

Adding a project = adding an `.mdx` file and pushing to trigger a rebuild.

---

## 4. Animation & Motion System

Three tools, cleanly separated:

### GSAP + ScrollTrigger — scroll-driven animations
- Section reveal on scroll
- Featured project parallax
- Text fade-up on enter
- Staggered list reveals
- Pinned scroll sequences
- Progress-linked opacity

### Framer Motion — component micro-interactions
- Page transitions
- Card hover scale/lift
- Filter pill layout shifts
- Modal/overlay enter/exit
- Button press feedback
- Navigation menu open/close

### Lenis — smooth scroll foundation
- Smooth scroll behavior synced with GSAP ticker
- Anchor link scrolling
- Scroll velocity for effects
- Lock scroll for modals
- Touch/trackpad normalization

### Motion Rules

**Do:**
- Exponential ease-out: `cubic-bezier(0.19, 1, 0.22, 1)`
- Animate only `transform` and `opacity` (GPU-composited)
- Stagger children by 50-80ms
- Duration 0.4-0.8s for reveals, 0.15-0.25s for hovers
- Respect `prefers-reduced-motion` — disable all animations

**Don't:**
- No bounce or elastic easing
- No spring physics
- No animating on every scroll pixel
- No decorative-only animation
- No delay > 200ms

### Implementation Pattern

`<ScrollReveal>` is a reusable Client Component wrapper that registers GSAP ScrollTrigger on its children. Server Components can be wrapped by it without becoming client components themselves.

GSAP and Framer Motion never animate the same element. GSAP owns scroll-driven motion; Framer owns component state transitions.

### Selective Surprise

The text scramble on the Hero name is the one signature interaction. It fires once on load, reveals the name character-by-character with randomized glyphs, then settles. Everything else is quiet, functional motion.

### Dropped: OGL/WebGL

The fluid glass shader effect from the current build is dropped. It adds significant bundle weight and maintenance complexity without proportional impact. GSAP scroll animations + the text scramble achieve the same impression of technical craft.

---

## 5. Styling & Design Tokens

### Token Architecture

`packages/design-tokens/tokens.ts` exports typed constants for every value from DESIGN.md:
- Colors (void palette: void, surface-deep, surface-raised, text-bright, text-mid, text-quiet, signal-blue, border-faint, border-visible)
- Typography (Satoshi display/headline/title/body, JetBrains Mono labels)
- Spacing scale (xs through 4xl + section)
- Animation curves and durations
- Border radius (0 everywhere)

`packages/design-tokens/tailwind-preset.ts` transforms those constants into a Tailwind preset that every app imports.

### CSS Strategy

- **Tailwind utility classes** for 95% of styling
- **globals.css** for Tailwind directives, font-face declarations, CSS custom properties, grain overlay, selection color
- **shadcn/ui overrides** via the Tailwind preset (void palette, square corners)
- No CSS Modules, no styled-components, no CSS-in-JS

### Shared UI Package

`packages/ui/` contains shadcn/ui components (button, card, badge, etc.) installed once and imported by all apps. App-specific components (cursor, project cards, hero) live in the app that owns them.

---

## 6. Deployment

### Vercel Setup

| Vercel Project | Domain | Root Directory |
|---|---|---|
| treylupo-portfolio | treylupo.com | apps/portfolio |
| treylupo-blog | blog.treylupo.com | apps/blog |
| treylupo-docs | docs.treylupo.com | apps/docs |
| treylupo-demos | demos.treylupo.com | apps/demos |

### DNS

- `treylupo.com` → A record to Vercel
- `www`, `blog`, `docs`, `demos` → CNAME to `cname.vercel-dns.com`

### Build Strategy

- SSG (static generation) for portfolio and blog
- Auto-deploy on git push to main
- Preview URLs on every pull request
- Turborepo remote caching for fast CI builds

---

## 7. Dependencies

### Portfolio App

| Package | Purpose |
|---|---|
| next | Framework (App Router, SSG, routing) |
| react, react-dom | UI library |
| tailwindcss | Utility-first CSS |
| @radix-ui/* | Accessible component primitives (via shadcn/ui) |
| gsap | Scroll-triggered animations |
| framer-motion | Component micro-interactions |
| lenis | Smooth scroll |
| lucide-react | Icons |
| next-mdx-remote | MDX rendering for case studies |
| gray-matter | MDX frontmatter parsing |

### Dropped from Current Build

| Package | Reason |
|---|---|
| ogl | WebGL shader complexity not worth the impact |
| vite | Replaced by Next.js |
| ffmpeg-static | Build artifact, not needed |
| sharp | Next.js handles image optimization natively |

---

## 8. Build Order

The implementation should proceed in this order:

1. **Scaffold monorepo** — Turborepo + pnpm workspace + shared configs
2. **Design tokens package** — tokens.ts + tailwind-preset.ts from DESIGN.md
3. **UI package** — shadcn/ui init + base components
4. **Portfolio app shell** — Next.js 15 + App Router + layout + globals.css + fonts
5. **Homepage sections** — Hero → FeaturedProjects → AllWork → About → Contact → Footer
6. **Animations** — Lenis + GSAP ScrollTrigger + Framer Motion + text scramble
7. **Case study pages** — MDX setup + /projects/[slug] + sample content
8. **Header + navigation** — fixed nav, mobile menu, scroll spy
9. **Blog app** — Next.js + MDX content collections
10. **Docs app** — Fumadocs setup for nspb-api
11. **Demos app** — shell for future interactive demos
12. **Deployment** — Vercel projects + DNS + preview URLs
