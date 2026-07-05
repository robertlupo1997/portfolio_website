# Animation Study: francescomichelini.com (Live Browser Observation)

> Observed live on 2026-06-13 using Chrome browser automation.
> This documents EXACTLY what the site does — not what we think it does from screenshots.

---

## Tech Stack (confirmed)

- **Framework**: Nuxt 3 (Vue, SSR/SPA hybrid)
- **Smooth scroll**: Transform-based (Lenis-style) — `window.scrollY` reads 0 while visually scrolled; scroll is applied via CSS transforms on a wrapper element
- **Animation libraries**: GSAP and related plugins are likely module-scoped (not on `window`) — the site uses complex choreographed animations that exceed CSS-only capability
- **Fonts**: Monorama (display/italic logo), Neue Haas Grotesk (titles/body), Favorit Mono (labels/UI)
- **Design**: Unlearn Studio

---

## 1. Page Load Sequence (PRELOADER)

**This is the site's signature. Every page navigation triggers it.**

### Timeline (observed on homepage reload):

| Time | What's Visible |
|------|---------------|
| 0.0s | Solid dark olive background (#474741 in dark theme). Nothing else. |
| 0.3s | Percentage counter appears in bottom-right corner: "12%" |
| 1.0s | Counter climbing: "74%" — digits animate/count up smoothly |
| 2.5s | Counter hits 100%, then TEXT SCRAMBLE replaces the number: "MCWVTT" (random characters) |
| 3.0s | Scramble text continues resolving — appears to transition toward site content |
| 4.0s | Content begins to appear — all elements reveal roughly simultaneously |
| 5.0s | Full page content visible, preloader gone |

### Key Details:
- **Duration**: 3-5 seconds total (varies by page/assets)
- **Percentage counter**: Bottom-right corner, monospace font, same olive/muted color as background text
- **After 100%**: Counter morphs into random character scramble (TextScramble effect), resolving before content reveal
- **Content reveal**: Everything appears at once (not staggered) — likely an opacity: 0 → 1 on the main content wrapper after preloader finishes
- **Consistent across pages**: Same preloader on /, /projects, /projects/fanfanfan, /info — always starts at the percentage counter
- **Color**: Counter text matches the theme's accent color (olive-green in dark, muted sage in light)

### Implementation Notes for Trey's Site:
- We already have TextScramble component — use it for the preloader counter transition
- The preloader is NOT a separate overlay — content is hidden (opacity: 0 / visibility: hidden) until preloader completes
- Counter should count from 0% to 100% over ~2-3 seconds, then scramble-transition to disappear
- After preloader: fade content in with a single opacity transition (~300ms)

---

## 2. Text Animations

### Text Scramble (confirmed in multiple locations):
- **VISIT button**: When switching carousel slides, "VISIT" scrambles through random characters ("249$#") before resolving to new text. Duration ~500-800ms.
- **Preloader counter**: After hitting 100%, the number text-scrambles into random chars before fading
- **Info page name**: "FRANCESCO MICHELINI" starts as scrambled "FB MK" and resolves character by character

### Text Reveal (on page entrance):
- Bio text, titles, and metadata appear to enter WITHOUT line-mask reveals — they appear all at once when the preloader finishes
- No character-by-character or line-by-line stagger was observed on the homepage text
- The /info page name may use a text reveal, but it was mid-preloader when observed

### Implementation Notes:
- TextScramble on the VISIT button equivalent and any text that changes dynamically
- The entrance animation is preloader-driven, not per-element — keep it simple
- Don't over-animate individual text elements — Michelini's elegance is in restraint

---

## 3. Hover States

### Project List (/projects page):
- **Focus/dim pattern**: Hovering a project row BRIGHTENS it (title, thumbnails, year all increase opacity). ALL OTHER ROWS dim simultaneously.
- Not a color change — purely an opacity shift (~0.4 dim → 1.0 focused)
- The effect is smooth, ~300ms transition
- Thumbnails in the hovered row may scale up slightly

### Navigation Links:
- **PROJECTS / INFO**: Bordered pill buttons with dot indicator (bullet point before text)
- On hover: Background appears to fill or darken within the pill border
- Transition: ~300ms, cubic-bezier(0.4, 0, 0.2, 1)

### VISIT Button:
- Bordered pill with arrow (↗)
- On hover: No dramatic change observed — possibly a subtle border/bg color shift
- TextScramble plays on state change (slide transition), not on hover

### Implementation Notes:
- The focus/dim pattern on the project list is the KEY hover interaction to replicate
- Use CSS opacity transitions with a parent :hover state that dims siblings
- Keep nav hovers subtle — just a background fill within existing border

---

## 4. Custom Cursor

### Structure:
- **SVG-based**: 32x32px viewBox, contains 4 `<path>` elements + 1 `<circle>`
- **Design**: Corner brackets/crosshair with center dot (like a camera viewfinder/target reticle)
- **Not a simple circle** — it's a square viewfinder shape

### Behavior:
- **Mix-blend-mode: difference** — inverts colors wherever it overlaps content. On dark background it appears light, on light content it appears dark.
- **Position**: Fixed, pointer-events-none, z-50, tracks mouse with smooth interpolation
- **Hidden on mobile**: Uses `lg-down:hidden` (Tailwind-like breakpoint class)
- **System cursor**: Likely hidden on desktop via `cursor: none` on body (the extension's hover shows the system cursor, but the site itself hides it)

### Implementation Notes:
- Trey already has a Cursor component — update it to:
  1. Use an SVG viewfinder/bracket shape instead of a circle
  2. Add `mix-blend-mode: difference` for automatic color inversion
  3. Ensure smooth position interpolation (lerp/spring, not raw mousemove)
  4. Hide on mobile breakpoints

---

## 5. Scroll Behavior

### Smooth Scroll:
- **Transform-based** (confirmed): `window.scrollY` reads 0 while visually scrolled — the scroll position is managed via CSS `transform: translateY()` on a content wrapper
- **Feel**: Smooth, inertial, similar to Lenis. Content decelerates after scroll input stops.
- **No parallax** observed on any elements
- **Nav stays fixed** — header with logo + nav links remains pinned at top through scrolling

### Scroll-Triggered Animations:
- **Minimal**: The project list entries appear to be pre-revealed (no visible scroll-trigger stagger when scrolling through them)
- **Thumbnail brightness**: Some thumbnails appeared to brighten/scale slightly as they scrolled into view, but this may be related to lazy-loading image appearance rather than a deliberate scroll animation
- **The site is NOT heavily scroll-animated** — it relies on the preloader entrance + hover interactions rather than scroll-driven choreography

### Implementation Notes:
- We already have Lenis — keep it
- Don't add heavy ScrollTrigger animations to the project list
- The elegance is in what's NOT animated on scroll — content is simply present and responds to hover

---

## 6. Page Transitions

### Observed Pattern:
- **Full preloader on every navigation**: Navigating between pages (home → projects → project detail → info) always triggers the full preloader sequence (percentage counter → text scramble → content reveal)
- **No shared element transitions**: Nothing persists across page changes
- **No slide/clip transitions**: The old page disappears, preloader plays, new page appears
- **Duration**: 3-5 seconds per transition

### Implementation Notes:
- **We are single-page (React SPA)** — we don't have page transitions in the same way
- The preloader only needs to play ONCE on initial load, not on scroll-to-section
- For section transitions within our SPA, use simple fade-in on scroll-into-view if anything

---

## 7. Project List (/projects page)

### Layout (9 projects):
Each row contains:
- **P/0X label**: Left-aligned, monospace, small
- **Decorative vertical bars**: Small colored bars/dashes (vary per entry — some taller, some just dots). Colors include olive, cyan/teal. These appear decorative/random.
- **Project name**: Large uppercase display text, centered-left
- **Inline thumbnails**: 1-4 small images displayed inline next to the title
- **Year**: Right-aligned, monospace

### Row Spacing:
- Generous vertical padding between rows (~120px)
- Rows are NOT indented/staggered in the Michelini version — all left-aligned consistently
- The varying number of thumbnails and decorative bars creates visual rhythm without explicit stagger

### Animations:
- **Entrance**: All rows appear together after preloader (no individual stagger)
- **Hover**: Focus/dim pattern (see Hover States section above)
- **No scroll-triggered entry** for individual rows

---

## 8. Theme Toggle

### Location:
- Top-right nav bar, icon after PROJECTS and INFO buttons
- Small square icon (pen/slash icon)

### Transition:
- **Smooth color crossfade**: All colors shift simultaneously over ~300ms
- Dark → Light: Background #474741 → #B0B0A8 (approx), text/accents shift from coral/red to dark olive
- Logo inverts from filled red to outlined beige
- **Not an instant switch** — smooth, coordinated color transition

### Implementation Notes:
- We are dark-only — NOT implementing theme toggle
- But the smooth color transition technique (CSS custom properties + transition) is worth noting

---

## 9. Easing and Timing

### From Motion Tokens + Live Observation:

| Token | Value | Usage |
|-------|-------|-------|
| duration-sm | 225ms | Fast interactions (hover states, small UI changes) |
| duration-md | 300ms | Standard transitions (color changes, opacity, theme toggle) |
| duration-lg | ~400ms | Observed on some transitions |
| preloader | 3000-5000ms | Full load sequence |
| text-scramble | 500-800ms | Character scramble resolve |

### Easing Curves:

| Name | Value | Feel |
|------|-------|------|
| Standard | `cubic-bezier(0.4, 0, 0.2, 1)` | Material-like ease-in-out — used for most CSS transitions (color, bg, border) |
| Ease-out | `cubic-bezier(0, 0, 0.2, 1)` | Deceleration — starts fast, ends gentle. Used for entrance animations. |

### Feel:
- **Fast and precise**, not slow and floaty
- 225-300ms for most interactions — snappy, not lazy
- The preloader is the only "slow" thing — everything else is quick
- No spring/bounce physics observed — all cubic-bezier curves
- **Restraint is the signature**: Most elements DON'T animate. The few that do are fast and precise.

---

## CSS Transition Pattern (from extracted styles):

```css
/* The dominant transition pattern across the site */
transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
            background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
            border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
            text-decoration-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
            fill 0.3s cubic-bezier(0.4, 0, 0.2, 1),
            stroke 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

---

## Summary: What to Implement (Priority Order)

### 1. Preloader with Percentage Counter + Text Scramble
- 0% → 100% counter in bottom-right
- Counter text-scrambles into random chars
- Content fades in after scramble completes
- Single biggest quality signal — this is what makes the site feel "designed"

### 2. Project List Focus/Dim Hover
- Hovered row: opacity 1.0
- All other rows: opacity ~0.4
- Smooth 300ms transition
- This IS the project list interaction

### 3. Cursor Refinement
- SVG viewfinder/brackets + center dot (not a circle)
- mix-blend-mode: difference
- Smooth position interpolation
- Hide on mobile

### 4. Text Scramble on Dynamic Content
- Already have TextScramble — use it on the preloader and any text that changes state

### 5. Timing/Easing Cleanup
- Replace any existing slow animations with 225-300ms
- Use `cubic-bezier(0.4, 0, 0.2, 1)` as the default easing
- Kill any bounce/spring effects — this aesthetic is precise, not playful

### 6. Don't Over-Animate
- NO scroll-triggered staggers on the project list (entries are just present)
- NO parallax
- NO line-mask text reveals on every element
- The site's power is RESTRAINT — a preloader, hover focus/dim, and snappy timing. That's it.
