# Terminal Carousel Redesign — Design Spec

**Date:** 2026-06-14
**Branch:** `redesign/invisible-frame`
**Reference site:** francescomichelini.com (Folio/23 by Francesco Michelini)
**Aesthetic:** Michelini's layout + terminal/hacker skin (Mr. Robot, BBS, scanlines)

---

## 1. Page Structure & Flow

The site is a single-page React app. No hero section — the user lands directly on the project carousel.

### Load sequence

1. **Preloader** — terminal boot sequence. Departure Mono text: `INITIALIZING...`, percentage counter ticking up, then `READY.` with blinking cursor. Fades out (200ms ease-out) to reveal the site.
2. **Site content** — carousel is immediately visible. No scroll-to-reveal, no entrance animation on the first slide.

### Page sections (top to bottom)

| Order | Section | Scroll behavior |
|-------|---------|-----------------|
| 1 | Fixed nav bar | Always visible, z-index above everything |
| 2 | Project carousel (3 featured) | Horizontal navigation (not vertical scroll) |
| 3 | Secondary project list (6 remaining) | Vertical scroll |
| 4 | Footer | Vertical scroll |
| — | Info overlay | Full-screen takeover, triggered from nav |

### Removed from current site

- Hero section (name/descriptor/CTA) — name moves to nav, CTA moves to footer
- CredentialStrip marquee — credentials move to Info overlay

---

## 2. Fixed Navigation Bar

Always visible. Olive-tinted transparent background with `backdrop-filter: blur(12px)`.

### Layout

```
[ TREY LUPO ]                          [ PROJECTS ]  [ INFO ]
   left                                        right
```

- **Left:** Text wordmark "TREY LUPO" in Departure Mono, uppercase, letterspaced. Links to top of page. Text scramble effect on hover. Logo component (`Logo.tsx`) exists as a slot for future custom SVG logotype.
- **Right:** Two bordered pill buttons, Departure Mono, uppercase.
  - `[ PROJECTS ]` — scrolls to carousel / resets to slide 1
  - `[ INFO ]` — opens Info overlay
- **Button style:** 1px border in `--accent` color, transparent fill. On hover: background fills to `--accent` with text inverting to `--bg-primary`. Transition: 200ms ease-out.

### Mobile

Hamburger menu (existing pattern). Opens full-screen overlay with PROJECTS and INFO links.

### Scroll behavior

Nav is always visible — no hide-on-scroll-down behavior. The carousel is the primary content and needs persistent navigation.

---

## 3. Project Carousel

3 featured projects, each filling the full viewport. Horizontal navigation.

### Data source

Featured projects from `constants.ts`: `FEATURED_PROJECTS` array (nspb-api, FerroML, Hierarchical Revenue Forecast).

### Slide layout

Each slide splits into two halves:

#### Left panel — Terminal readout (~45vw)

```
P/01                                              /26

$ cat nspb-api --verbose

TITLE:    nspb-api
CLASS:    //api engineering
STATUS:   production
METRIC:   60+ API ENDPOINTS

> A complete Python SDK for Oracle's Enterprise
  Performance Management Cloud, covering Planning,
  Migration, and Data Management APIs.

STACK:    Python / REST / Oracle EPM / SDK Design

[ VISIT -> ]
```

- **P/XX index:** Top-left, `--accent` color, Departure Mono
- **Epoch (/26):** Top-right of panel, `--accent-dim` color
- **Prompt line:** `$ cat {project.id} --verbose` — decorative, `--accent-dim`
- **Field labels** (TITLE, CLASS, STATUS, METRIC, STACK): `--accent-dim` color, Departure Mono, uppercase
- **Field values:** `--text-primary` color, Departure Mono
- **Description:** Prefixed with `>`, `--text-primary`, Inter font for readability
- **`[ VISIT -> ]` button:** Bottom-left. 1px `--accent` border, Departure Mono. Links to `githubUrl` or `liveUrl`. Arrow uses `->` not `↗` to match terminal aesthetic. Hover: fill `--accent`, invert text.
- **Blinking cursor:** After the last line of content. CSS animation: `opacity` toggling between 1 and 0, `1s step-end infinite`.

#### Right panel — Project image (~55vw)

- Image fills the right half, edge-to-edge vertically
- `object-fit: cover` for consistent framing
- Scanline overlay via `::after` pseudo-element: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)`
- Images that exist: nspb-api (`amazon-network.jpg`), FerroML (`plate-ferroml-comparison.png`), Revenue Forecast (`kkbox-churn.jpg` — this is a placeholder from the KKBOX project and needs replacement with an actual revenue forecast visual before launch)

#### Entry animation (per slide)

- Terminal text: appears line by line, 40ms stagger between lines, each line fades in (opacity 0→1, translateY 4px→0, 150ms ease-out)
- Image: `clip-path: inset(0 100% 0 0)` → `inset(0 0 0 0)`, 400ms ease-out (reveals from left to right)
- Cursor starts blinking only after all lines have appeared

### Navigation

All methods move one slide at a time with snap behavior.

#### Controls (fixed at bottom of viewport during carousel)

```
PREV  ———— • • •  NEXT
```

- `PREV` / `NEXT`: Departure Mono, `--accent-dim`. On hover: `--text-primary`. Disabled state (first/last slide): `opacity: 0.2`, no pointer events.
- Progress dots: filled circle = current, outlined = others. `--accent` for active, `--accent-dim` for inactive.
- Position: bottom of viewport, horizontally centered, with ~3rem padding from bottom edge.

#### Input methods

| Input | Behavior |
|-------|----------|
| Click PREV/NEXT | Animate to adjacent slide |
| Keyboard ← / → | Animate to adjacent slide |
| Trackpad horizontal swipe | Drag with momentum; velocity > 0.11 = navigate, else snap back |
| Touch swipe (mobile) | Same momentum logic as trackpad |

#### Slide transition

- Duration: 350ms
- Easing: `cubic-bezier(0.23, 1, 0.32, 1)` (strong ease-out from Emil's framework)
- Current slide exits toward direction of travel, new slide enters from opposite side
- No bounce, no spring — crisp mechanical movement

---

## 4. Secondary Project List

Below the carousel. Vertical scroll resumes.

### Section header

```
ARCHIVE /2024-26
```

Departure Mono, `--accent-dim`, uppercase, letterspaced. Small label style, left-aligned with page margin.

### Layout

Full-width rows, separated by 1px `--border-subtle` borders. Each row is a clickable link (`<a>` wrapping the row).

```
P/04  KKBOX Churn Prediction        //ml · production     0.97 AUC    ->
P/05  Open-Vocab Object Detection   //computer vision     265-490ms   ->
P/06  Ironclad                      //construction ml     95% CI      ->
P/07  FerroML Plugin                //ai tooling          Claude Code ->
P/08  GSD-ML                        //ai tooling          Autonomous  ->
P/09  MLForge                       //automl              AutoML      ->
```

| Element | Font | Color |
|---------|------|-------|
| P/XX index | Departure Mono | `--accent` |
| Title | Departure Mono | `--text-primary` |
| Category | Departure Mono | `--accent-dim` |
| Metric | Departure Mono | `--text-primary` |
| Arrow (->) | Departure Mono | `--accent-dim` |

### Interactions

- **Hover:** Row background lightens to `--bg-elevated`. Arrow shifts right 4px (200ms ease-out). Sibling rows dim to `opacity: 0.4` (focus/dim pattern from current site, CSS-only via `:hover` on parent).
- **Active:** `transform: scale(0.99)` on the row (subtle press feedback).

### Data source

`ALL_PROJECTS` array from `constants.ts`. Numbering continues from carousel (P/04 through P/09).

---

## 5. Footer

Minimal. Contact-focused.

### Layout

```
Let's build something.

treylupo1197@gmail.com          GitHub  LinkedIn  HuggingFace

Design + Development · Trey Lupo    Fonts · Departure Mono · Inter    (c)2026 Tampa, FL
```

- **Statement:** "Let's build something." — Departure Mono, `--text-primary`, large (clamp 1.5rem–2.5rem).
- **Email:** Click to copy (existing behavior). Departure Mono, `--accent`.
- **Social links:** Departure Mono, `--accent-dim`. Hover: `--text-primary`.
- **Colophon:** Small mono labels, `--text-tertiary`.
- **Top border:** 1px `--border-subtle`.

---

## 6. Info Overlay

Full-screen overlay triggered by `[ INFO ]` nav button.

### Entrance / Exit

- **Enter:** Fade in from `opacity: 0` + `scale(0.98)` → `opacity: 1` + `scale(1)`. Duration: 200ms, ease-out.
- **Exit:** Fade out, 150ms ease-out (exit faster than enter). Triggered by `[ CLOSE ]` button or `ESC` key.
- **Background:** `--bg-primary` at 98% opacity.

### Layout — Desktop (two columns)

#### Left column — Bio

```
TREY LUPO
AI/ML Systems Engineer

Corporate FP&A Analyst at Franklin Street in Tampa.
I build Python SDKs that replace manual Oracle exports,
ML frameworks in Rust that ship with statistical rigor,
and revenue models that actually reconcile across
business lines.

B.A. Statistics · USF
MIT Data Science Certificate
```

- Name: Departure Mono, `--accent`, large
- Title: Departure Mono, `--text-primary`
- Bio paragraphs: Inter, `--text-primary`
- Credentials: Departure Mono, `--accent-dim`

#### Right column — Skills & Timeline (terminal-styled)

```
$ skills --list

LANGUAGES     Python / TypeScript / SQL / Rust
FINANCE       Oracle EPM Cloud / FP&A / Financial Modeling
ML / DATA     Scikit-learn / LightGBM / Pandas / FastAPI
AI TOOLS      Claude Code / Anthropic SDK
WEB           React / GSAP / Vite

$ history --career

2024          B.A. Statistics, USF
2025          AI Engineering Intern, Origin Construction
2025-NOW      FP&A Analyst, Franklin Street    <- CURRENT
```

- Prompt lines (`$`): `--accent-dim`
- Labels (LANGUAGES, etc.): `--accent-dim`, uppercase
- Values: `--text-primary`
- `<- CURRENT` marker: `--accent`

### Close button

Top-right: `[ CLOSE ]` bordered pill button, same style as nav buttons. Also closes on `ESC` keypress.

### Mobile

Single column. Bio on top, skills/timeline below. Scrollable within the overlay.

### Accessibility

- Focus trap while open (tab cycles within overlay)
- `aria-modal="true"`, `role="dialog"`
- Return focus to the `[ INFO ]` button on close

---

## 7. Color Palette

Derived from Michelini's site with terminal-appropriate adjustments.

| CSS Variable | Hex | Usage |
|-------------|-----|-------|
| `--bg-primary` | `#474741` | Page background, overlay background |
| `--bg-elevated` | `#55554D` | Hover states, nav background |
| `--bg-surface` | `#3D3D38` | Card backgrounds if needed |
| `--text-primary` | `#E3E4D5` | Body text, terminal output, primary content |
| `--text-secondary` | `#A6A77E` | Same as accent-dim, secondary content |
| `--text-tertiary` | `#7A7A6E` | Colophon, disabled states |
| `--accent` | `#E85D3A` | Project titles, P/XX index, active nav, links, CTA buttons |
| `--accent-dim` | `#A6A77E` | Categories, labels, prompts, metadata |
| `--border-subtle` | `rgba(227, 228, 213, 0.08)` | Row dividers, section separators |
| `--border-default` | `rgba(227, 228, 213, 0.12)` | Button borders, input borders |
| `--border-emphasis` | `rgba(227, 228, 213, 0.20)` | Focused/active borders |

---

## 8. Typography

| CSS Variable | Font | Usage |
|-------------|------|-------|
| `--font-departure` | `'Departure Mono', monospace` | Display, labels, terminal text, nav, project titles, indices, buttons — the primary typeface |
| `--font-sans` | `'Inter', sans-serif` | Bio text, project descriptions, long-form body content |

Departure Mono is a pixel font — it works best at specific sizes. Recommended sizes: 12px, 14px, 16px, 24px, 32px, 48px (multiples or near-multiples of its pixel grid).

Weight: 400 only (Departure Mono is single-weight). Hierarchy comes from size, color, and letterspacing — not weight.

---

## 9. Motion Tokens

All animation decisions follow Emil Kowalski's design engineering framework.

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-instant` | `100ms` | Button press feedback |
| `--duration-sm` | `150ms` | Overlay exit, tooltip |
| `--duration-md` | `200ms` | Nav hover, button hover, overlay enter |
| `--duration-lg` | `350ms` | Carousel slide transition |
| `--duration-reveal` | `400ms` | Image clip-path reveal |
| `--ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | Primary UI easing (strong ease-out) |
| `--ease-in-out` | `cubic-bezier(0.77, 0, 0.175, 1)` | On-screen movement |
| `--stagger` | `40ms` | Terminal text line-by-line appearance |

### Rules

- Never use `ease-in` for UI elements
- Exit animations are always faster than enter animations
- Keyboard-triggered actions have no animation
- All hover effects gated behind `@media (hover: hover) and (pointer: fine)`
- `prefers-reduced-motion: reduce` — keep opacity/color transitions, remove movement

---

## 10. Effects

### Scanlines

CSS pseudo-element overlay on project images and optionally the terminal panel background:

```css
.scanlines::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.04) 2px,
    rgba(0, 0, 0, 0.04) 4px
  );
  pointer-events: none;
}
```

### Blinking cursor

```css
.cursor-blink::after {
  content: '_';
  animation: blink 1s step-end infinite;
}
@keyframes blink {
  50% { opacity: 0; }
}
```

### Text scramble

Existing `TextScramble` component. Used on:
- Nav wordmark hover
- Slide transition (title scrambles briefly during entry)
- `[ VISIT -> ]` button text scrambles periodically (every ~8 seconds)

---

## 11. Mobile Behavior

| Breakpoint | Behavior |
|-----------|----------|
| >= 768px | Desktop: horizontal carousel, two-column slides, two-column info overlay |
| < 768px | Mobile: vertical carousel, stacked slides, single-column info overlay |

### Mobile carousel

- Slides stack vertically (terminal panel above, image below, each ~50vh)
- Swipe up/down to navigate between slides (or use PREV/NEXT buttons)
- Dot indicators rotate to vertical orientation
- Touch swipe uses same momentum detection (velocity > 0.11)

### Mobile secondary list

Unchanged — already single-column friendly. Category and metric wrap below title on narrow screens.

### Mobile nav

Existing hamburger pattern. Full-screen menu overlay with PROJECTS and INFO links.

---

## 12. Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Carousel engine | Custom with GSAP + CSS transforms | We already use GSAP; no need for a carousel library. Hardware-accelerated transforms only. |
| Smooth scroll | Lenis stays for vertical sections | Carousel is custom horizontal; Lenis handles vertical scroll for secondary list + footer |
| State management | React useState for active slide index | Simple — 3 slides, no complex state needed |
| Swipe detection | Pointer events + velocity calculation | No library needed; ~30 lines of code |
| Info overlay | React portal or conditional render | Keeps it outside the main content flow |
| Image loading | Eager for slide 1, lazy for slides 2-3 | First slide must be instant; others load as user navigates |
| Font loading | Self-hosted woff2 with font-display: swap | Already set up for Departure Mono |

---

## 13. File Changes Summary

### New files

| File | Purpose |
|------|---------|
| `components/Carousel.tsx` | Main carousel container + navigation logic |
| `components/CarouselSlide.tsx` | Individual slide layout (terminal panel + image) |
| `components/TerminalPanel.tsx` | Terminal readout for project data |
| `components/InfoOverlay.tsx` | Full-screen info/about overlay |
| `components/ArchiveList.tsx` | Secondary project list (replaces current ProjectList for non-featured) |
| `hooks/useCarousel.ts` | Slide state, keyboard/swipe handlers, transition logic |

### Modified files

| File | Changes |
|------|---------|
| `App.tsx` | Remove Hero, CredentialStrip imports. Add Carousel, ArchiveList, InfoOverlay. Restructure layout. |
| `Header.tsx` | Redesign nav: wordmark left, bordered pill buttons right. Add INFO button handler. Remove scroll-hide behavior. |
| `Preloader.tsx` | Restyle as terminal boot sequence |
| `Footer.tsx` | Update typography to Departure Mono, update colophon font list |
| `styles/index.css` | New palette, typography variables, carousel styles, overlay styles, scanline effects |
| `constants.ts` | No structural changes needed — data model supports this layout |
| `types.ts` | No changes needed |

### Removed

| File | Reason |
|------|--------|
| `components/Hero.tsx` | No hero section in new design |
| `components/CredentialStrip.tsx` | Credentials move to Info overlay |
| `components/ProjectList.tsx` | Replaced by Carousel + ArchiveList |
| `components/LineReveal.tsx` | Not used in new design |
