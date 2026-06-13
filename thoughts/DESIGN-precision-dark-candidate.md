---
version: alpha
name: Trey Lupo — Precision Dark
colors:
  bg-void: "#050506"
  bg-primary: "#0A0A0B"
  bg-elevated: "#111113"
  bg-surface: "#18181B"
  text-primary: "#E8E5DF"
  text-secondary: "#8A8780"
  text-tertiary: "#5A5855"
  accent: "#C87533"
  accent-dim: "#A35E28"
  accent-subtle: "#2A1D12"
  border-subtle: "rgba(255,255,255,0.06)"
  border-default: "rgba(255,255,255,0.10)"
  border-emphasis: "rgba(255,255,255,0.16)"
typography:
  hero:
    fontFamily: Space Grotesk
    fontSize: 72px
    fontWeight: 600
    lineHeight: 1.0
    letterSpacing: -0.03em
  h1:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.35
  body:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
  mono-label:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: 0.06em
  mono-nav:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: 0.02em
  mono-body:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.6
rounded:
  none: 0px
  sm: 2px
  md: 4px
  lg: 8px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  4xl: 96px
  5xl: 128px
  gutter: 24px
  margin: 32px
  max-width: 1200px
components:
  nav:
    backgroundColor: "{colors.bg-primary}"
    textColor: "{colors.text-secondary}"
    typography: "{typography.mono-nav}"
  nav-active:
    textColor: "{colors.accent}"
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.bg-primary}"
    rounded: "{rounded.md}"
    padding: 12px 24px
  button-primary-hover:
    backgroundColor: "{colors.accent-dim}"
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.md}"
    padding: 12px 24px
  button-ghost-hover:
    textColor: "{colors.text-primary}"
  card-project:
    backgroundColor: "{colors.bg-elevated}"
    rounded: "{rounded.lg}"
    padding: 24px
  card-project-hover:
    backgroundColor: "{colors.bg-surface}"
  tag:
    backgroundColor: "{colors.accent-subtle}"
    textColor: "{colors.accent}"
    typography: "{typography.mono-label}"
    rounded: "{rounded.sm}"
    padding: 4px 10px
  credential-item:
    backgroundColor: transparent
    textColor: "{colors.text-tertiary}"
    typography: "{typography.mono-label}"
---

# treylupo.com — Precision Dark DESIGN.md (Candidate)

## Status: NOT ADOPTED — saved for comparison against current Invisible Frame spec

See `thoughts/handoffs/2026-06-13-design-research-and-new-spec.md` for the full analysis
of how this differs from the current `DESIGN.md` and the open questions to resolve.

## Overview

The site should feel like opening a well-machined instrument case in a dark room. Not a creative developer's animation showcase. Not a generic template. A precision instrument that proves competence through density of proof, clarity of structure, and one carefully engineered generative moment.

**Identity axis:** AI/ML practitioner who builds precision systems. The work is the proof. The site presents it without theater.

**Aesthetic register:** Dark industrial. Synthesis of: Francesco Michelini's structural restraint + Stas Bondar's post-processing (dithering shader) + Elliott Mangham's credential density + Unseen Studio's 2-color discipline.

## Key differences from current DESIGN.md

- Accent: copper `#C87533` instead of signal blue `#0066FF`
- Display: Space Grotesk 600 (hero only) instead of Satoshi 500 (everywhere)
- Body: Inter 400/500 instead of Satoshi 400
- Text warm-shifted: `#E8E5DF` instead of `#E8E8EE`
- Border radius: 4px buttons, 8px cards instead of 0px everywhere
- Project labels: `P/01` format instead of `01`
- New component: credential strip marquee
- New layer: `bg-void` (#050506) behind hero
- Parallax: forbidden (currently implemented)
- Architecture: recommends multi-page Astro (currently single-page React+Vite)

## Colors

Strict 2-color system. Near-black surfaces + one copper accent. No third color.

The copper accent reads as aged metal, not literal bourbon. It sits between Stas Bondar's industrial red-orange (`#EB4330`) and Unseen's editorial gold (`#E4B504`). It is NOT orange.

- **bg-void (`#050506`):** Deepest black. Hero generative piece and page margin bleed only.
- **bg-primary (`#0A0A0B`):** Main canvas. Matches existing site background.
- **bg-elevated (`#111113`):** Cards, navigation, elevated containers.
- **bg-surface (`#18181B`):** Hover states, active states.
- **text-primary (`#E8E5DF`):** Warm off-white. NOT pure #FFFFFF.
- **text-secondary (`#8A8780`):** Body copy, descriptions.
- **text-tertiary (`#5A5855`):** Dates, copyright, decorative labels.
- **accent (`#C87533`):** Copper. Max 5 elements per page. Active nav, one CTA, inline links on hover, project label prefix, tag backgrounds.
- **accent-dim (`#A35E28`):** Hover/pressed state.
- **accent-subtle (`#2A1D12`):** Tag background fill (~15% opacity copper on black).

## Typography

Three typeface roles. No exceptions.

- **Space Grotesk 600** — Hero headline only. 72px desktop, 40px mobile. Used exactly once per page.
- **Inter 400/500** — All headings below hero, body copy, descriptions. 500 max weight (no 600/700).
- **JetBrains Mono 400** — Nav, project labels (P/01), dates, tags, metadata, tech stacks, credentials, footer.

## Motion budget (strict)

Five permitted behaviors, everything else forbidden:

1. **Hero generative piece** — continuous ambient, cursor-reactive, Canvas-based
2. **Line-by-line text reveals** — SplitText, yPercent 100, opacity 0→1, stagger 0.06s, power2.out
3. **Character scramble on h2 headings** — random glyphs resolving over ~0.3s on scroll-enter
4. **Nav show/hide** — translateY -100% on scroll-down, 0 on scroll-up, 0.3s
5. **Card hover transitions** — bg + border color shift, 200ms ease, CSS only

**Forbidden:** page transitions (Barba.js), scroll-jacking, parallax, 3D transforms, elastic/bounce easing, loading screen animation.

## Layout

Multi-page: `/` (home), `/projects/[slug]` (case studies), `/about`.
12-column grid, 24px gutters, 1200px max-width.
Recommended framework: Astro (static-first, partial hydration).

## Components

- **Nav:** Fixed top, JetBrains Mono 14px, hide on scroll-down/show on scroll-up
- **Hero:** Full viewport, generative canvas + Space Grotesk headline + Inter descriptor
- **Credential strip:** Horizontal marquee, mono-label tokens, bg-elevated band
- **Project card:** bg-elevated, 8px radius, P/01 label system, tags in accent-subtle
- **Project detail:** Full-width header, metadata bar (year · role · stack · metric), Problem → Approach → Outcome body
- **Footer:** 3-column, all JetBrains Mono, no decorative elements
