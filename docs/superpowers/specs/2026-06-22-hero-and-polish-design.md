# Hero Slide + Portfolio Polish — Design Spec

**Date:** 2026-06-22
**Branch:** `redesign/invisible-frame`
**Status:** Approved

## Overview

Add a hero slide (carousel index 0) with a canvas-based ASCII character grid background and PowerGlitch on the name. Fix deploy blockers, add carousel looping, resume link, Vercel Analytics, and sitemap.

## 1. Hero Slide

### Layout

The hero is carousel slide index 0, not a separate component. It uses a variant class `carousel-slide--hero` that renders full-width (single column) instead of the two-column terminal+image grid used by project slides.

### ASCII Grid Background

A `<canvas>` element behind the content renders a procedural ASCII character grid.

**Characters:** `. · : + * # @ % &` (sparse to dense)

**Behavior:**
- At rest: characters are invisible (blend into background), with a faint ambient sine wave pulse
- On mouse proximity (within ~200px): characters appear in graduated density
  - Outer ring: dim olive (`#55554D`) with sparse chars (`. ·`)
  - Middle ring: bright olive (`#A6A77E`) with medium chars (`: + *`)
  - Inner core: red-coral accent (`#E85D3A`) with dense chars (`# @ %`)
- Characters lerp toward their target intensity at 0.12 rate for smooth trails
- Cell size: 18px grid

**Implementation:** Standalone React component `AsciiGrid` using a `<canvas>` ref and `requestAnimationFrame`. No external dependencies. Based on the working prototype at `prototypes/hero-ascii-grid.html`.

### Content (bottom-left)

Positioned with `justify-content: flex-end` and `padding: 0 0 6rem 7rem` to match the terminal panel position on project slides.

- **Name:** "TREY LUPO" in Departure Mono, `clamp(3rem, 8vw, 6rem)`, color `var(--accent)`
  - PowerGlitch applied: `playMode: 'always'`, `timing.duration: 5000`, `timing.iterations: Infinity`, `glitchTimeSpan: { start: 0.85, end: 0.95 }`, `slice.count: 6`, `shake.amplitudeX: 0.2`, `shake.amplitudeY: 0.1`
  - Effect: brief glitch burst every ~5 seconds, not constant
- **Tagline:** `$ whoami — AI/ML Systems Engineer` in Departure Mono, 0.875rem, olive `var(--text-secondary)`
- **Bio:** Short paragraph in Inter, 1rem, `var(--text-primary)`, max-width 45ch
- **Credentials row:** Flex row of `EDU B.A. Statistics · USF` | `CERT MIT Data Science` | `LANG Python / Rust / TypeScript / SQL` in Departure Mono, 0.75rem, olive

### Footer

Same `carousel-slide-footer` as project slides, containing:
- Carousel nav (PREV/counter/NEXT)
- No VISIT button (hero has no external link)

### Mobile (max-width: 768px)

- ASCII grid still renders but at reduced density (cell size increases)
- Content padding reduces to `var(--space-xl)`
- Credentials row wraps or stacks vertically

## 2. Carousel Looping

Modify `useCarousel.ts`:
- `next()`: if `activeIndex === totalSlides - 1`, wrap to `0`
- `prev()`: if `activeIndex === 0`, wrap to `totalSlides - 1`
- Remove `isFirst` / `isLast` from the hook return
- Both PREV/NEXT buttons are always enabled (remove `disabled` prop)
- Counter: `00 / 10` format (hero is slide 00, projects are 01-09)

Update `CarouselSlide.tsx` to remove `isFirst`/`isLast` props.

### Integration with Carousel

The hero is NOT a `Project` in `CAROUSEL_PROJECTS`. Instead, `Carousel.tsx` renders `HeroSlide` at index 0 and maps `CAROUSEL_PROJECTS` starting at index 1. The `totalSlides` becomes `CAROUSEL_PROJECTS.length + 1`. The `ProjectsOverlay` indices shift by 1 (P/01 maps to carousel index 1, etc.).

## 3. Deploy Blockers

### Remove OGL
- Remove `ogl` from `package.json` dependencies
- No code references exist (already verified)

### Fix Structured Data
- `index.html` JSON-LD `sameAs` URLs must match `constants.ts`:
  - LinkedIn: `https://www.linkedin.com/in/robertlupo1997/`
  - HuggingFace: `https://huggingface.co/spaces/robertlupo1997`
  - GitHub: `https://github.com/robertlupo1997` (already correct)

### Fix Theme Color
- Change `<meta name="theme-color" content="#0A0A0B">` to `content="#474741"`

### Remove Dead Font Loads
- Remove JetBrains Mono and Space Grotesk from the Google Fonts `<link>` tag
- Keep only Inter (wght 400;500)

### Apple Touch Icon
- Generate or add a placeholder `apple-touch-icon.png` to `public/`
- Could convert from existing `favicon.svg`

## 4. Resume PDF Link

Add a `[ RESUME → ]` styled button/link in the INFO overlay contact section, positioned alongside the GitHub/LinkedIn/HuggingFace links.

- Points to `/resume.pdf`
- Same styling as `.info-contact-links a` but with border (matching `.terminal-visit` style)
- File placeholder: user will add `public/resume.pdf` when ready

## 5. Vercel Analytics + Sitemap

### Analytics
- Install `@vercel/analytics`
- Add `import { Analytics } from '@vercel/analytics/react'` in `index.tsx`
- Render `<Analytics />` inside the app root

### Sitemap
- Create `public/sitemap.xml`:
  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://treylupo.com/</loc>
      <priority>1.0</priority>
    </url>
  </urlset>
  ```
- Add `<link rel="sitemap" type="application/xml" href="/sitemap.xml">` to `index.html`

## 6. Dependency Changes

**Add:**
- `powerglitch` — CSS animation glitch effect (~2KB)
- `@vercel/analytics` — Vercel analytics

**Remove:**
- `ogl` — unused WebGL library

## 7. Files Changed

| File | Change |
|------|--------|
| `components/AsciiGrid.tsx` | NEW — canvas ASCII grid component |
| `components/HeroSlide.tsx` | NEW — hero slide content + PowerGlitch integration |
| `components/Carousel.tsx` | Add hero slide at index 0, pass hero-specific props |
| `components/CarouselSlide.tsx` | Remove `isFirst`/`isLast` props |
| `hooks/useCarousel.ts` | Wrapping logic, remove `isFirst`/`isLast` |
| `constants.ts` | Add hero data (or inline in HeroSlide) |
| `styles/index.css` | Hero slide variant styles, ASCII grid positioning |
| `index.html` | Fix meta tags, remove dead fonts, add sitemap link |
| `index.tsx` | Add Vercel Analytics |
| `package.json` | Add powerglitch + @vercel/analytics, remove ogl |
| `public/sitemap.xml` | NEW — sitemap |
| `public/apple-touch-icon.png` | NEW — touch icon |
| `components/InfoOverlay.tsx` | Add resume link |

## 8. Out of Scope

- CRT effects (scanlines, vignette, film grain) — explicitly skipped
- FluidGlass WebGL shader — deleted with OGL
- Project detail/case study pages
- Subdomain architecture (docs, blog, demos, lab, api)
- Contact form
- Making private repos public
