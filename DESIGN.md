---
name: Trey Lupo Portfolio
description: FP&A analyst who builds production tools with AI
colors:
  void: "#0A0A0B"
  surface-deep: "#111113"
  surface-raised: "#18181B"
  text-bright: "#E8E8EE"
  text-mid: "#888899"
  text-quiet: "#555566"
  signal-blue: "#0066FF"
  signal-blue-hover: "#0055DD"
  border-faint: "#ffffff0f"
  border-visible: "#ffffff26"
typography:
  display:
    fontFamily: "Satoshi, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "clamp(3.2rem, 8vw, 8rem)"
    fontWeight: 500
    lineHeight: 0.85
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Satoshi, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "clamp(1.8rem, 4vw, 3rem)"
    fontWeight: 500
    lineHeight: 0.9
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Satoshi, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "0.95rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.02em"
  body:
    fontFamily: "Satoshi, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "JetBrains Mono, 'Fira Code', Consolas, monospace"
    fontSize: "0.7rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.15em"
rounded:
  none: "0"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  2xl: "3rem"
  3xl: "4rem"
  4xl: "6rem"
  section: "clamp(5rem, 12vh, 8rem)"
components:
  button-primary:
    backgroundColor: "{colors.signal-blue}"
    textColor: "{colors.text-bright}"
    rounded: "{rounded.none}"
    padding: "0.75rem 2rem"
  button-primary-hover:
    backgroundColor: "{colors.signal-blue-hover}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.text-mid}"
    rounded: "{rounded.none}"
    padding: "0.75rem 2rem"
  filter-active:
    backgroundColor: "{colors.text-bright}"
    textColor: "{colors.void}"
    rounded: "{rounded.none}"
    padding: "0.4rem 1rem"
---

# Design System: Trey Lupo Portfolio

## 1. Overview: The Invisible Frame

**Creative North Star: "The Invisible Frame"**

The site is a gallery with matte black walls. Navigation, backgrounds, borders, and structural elements are near-invisible. They exist only to organize space, never to decorate it. The projects themselves provide all visual weight, color, and energy. Every design decision runs through one filter: does this element serve the frame or the work? If it serves the frame, make it quieter. If it serves the work, give it room to breathe.

The Invisible Frame rejects ornamentation, identity-driven chrome, and any structural element that calls attention to itself. The portfolio should feel like a physical space where someone has carefully arranged their best work on dark walls, lit by precise, directional attention, with nothing else in the room.

This is a single-font system. Satoshi carries all typographic hierarchy through scale and weight alone. JetBrains Mono is reserved for labels, metadata, and code-adjacent text. No serif. No display typeface. The typography is infrastructure, not identity.

**Key Characteristics:**
- Monochrome infrastructure (near-black backgrounds, cool-tinted grays)
- One accent color (signal blue) used at less than 10% of any surface
- Square corners everywhere, no border radius
- Varied visual weight across project entries (not a uniform grid)
- Large-format project content with minimal padding
- Sparse navigation that stays out of the way

## 2. Colors: The Void Palette

A restrained palette: tinted neutrals plus one accent at less than 10%. The backgrounds are not pure black; they carry a subtle cool tint (chroma ~0.005 toward blue) that prevents the crushing flatness of #000 while staying nearly invisible. The accent is a single engineering blue, used only for interactive elements and links. Projects themselves may introduce their own color, but the infrastructure never does.

### Primary

- **Signal Blue** (`#0066FF` / `oklch(50% 0.24 264)`): Interactive elements only. Links, focus rings, primary CTAs. Never decorative. Its rarity is the point.

### Neutral

- **Void** (`#0A0A0B` / `oklch(6.5% 0.005 280)`): Primary background. The gallery wall. Not pure black; carries a hair of blue-violet to avoid dead-screen flatness.
- **Surface Deep** (`#111113` / `oklch(10% 0.005 280)`): Secondary surfaces. Cards, alternate sections. One step above void.
- **Surface Raised** (`#18181B` / `oklch(13% 0.005 280)`): Hover states on cards, tertiary surfaces. Two steps above void.
- **Text Bright** (`#E8E8EE` / `oklch(93% 0.005 280)`): Primary text. Not pure white; slightly blue-tinted to match the background family.
- **Text Mid** (`#888899` / `oklch(62% 0.015 280)`): Secondary text, descriptions, supporting copy.
- **Text Quiet** (`#555566` / `oklch(42% 0.015 280)`): Muted text, metadata, timestamps, tertiary labels.
- **Border Faint** (`rgba(255,255,255,0.06)`): Default borders. Barely visible. Structural, not decorative.
- **Border Visible** (`rgba(255,255,255,0.15)`): Hover borders. One notch brighter, still quiet.

### Named Rules

**The One Signal Rule.** Signal Blue is the only saturated color in the infrastructure. It appears on links, focus indicators, and primary buttons. If a second accent color creeps in, the frame is no longer invisible. Remove it.

**The Zero Warmth Rule.** The infrastructure has no warm tones. No amber, no gold, no orange in the site chrome. Warmth comes exclusively from project content (screenshots, metrics, brand colors). The container stays cool and neutral.

## 3. Typography

**Display Font:** Satoshi (with system fallbacks)
**Label/Mono Font:** JetBrains Mono (with Fira Code, Consolas fallbacks)

**Character:** A single-family system using scale alone to build hierarchy. Satoshi at weight 500 provides emphasis at display sizes; at 400 it recedes into readable body copy. The gap between display (8rem) and body (0.95rem) creates an 8.4:1 ratio, approaching the 12-16:1 proven range from simonholm.studio and zajno.com. JetBrains Mono handles metadata and labels, always at small sizes (0.65-0.7rem), always in quiet colors, always lowercase with wide tracking.

### Hierarchy

- **Display** (500, `clamp(3.2rem, 8vw, 8rem)`, 0.85 line-height): Hero name, about statement. Maximum two per page. Tight negative tracking (-0.04em). Hierarchy through scale, not weight.
- **Headline** (500, `clamp(1.8rem, 4vw, 3rem)`, 0.9 line-height): Project titles. Anchors a section without competing with display.
- **Title** (500, 0.95rem, 1.4 line-height): Card titles, secondary headings.
- **Body** (400, 0.95rem, 1.5 line-height): Descriptions, paragraphs. Capped at 65ch line length.
- **Label** (JetBrains Mono, 400, 0.65-0.7rem, 0.15em tracking, lowercase): Section markers, stack tags, metadata. Always quiet-colored (text-mid or text-quiet).
- **Number** (Mono, 500, 4.5rem, 0.85 line-height): Featured project indices. Low opacity (0.3), structural.

### Named Rules

**The Mono Stays Small Rule.** JetBrains Mono never exceeds 0.8rem. It is metadata typography: section labels, tech stacks, timestamps, status lines. The moment mono text gets large, the site enters the editorial-typographic lane. Keep it small.

## 4. Elevation

This system is flat. No shadows anywhere. Depth is conveyed through tonal layering: void (6.5% lightness) sits behind surface-deep (10%), which sits behind surface-raised (13%). Three stops, each barely distinguishable, creating the illusion of receding planes without any shadow.

The grain overlay (fractal noise at 3% opacity fixed over the viewport) adds a paper-like texture to the flat surfaces, preventing the digital-screen sterility of pure CSS gradients.

### Named Rules

**The No Shadow Rule.** Shadows are forbidden. If an element needs to feel elevated, move it one tonal step lighter. If it still doesn't feel elevated, it doesn't need to be. The system has three elevation levels; that is enough.

## 5. Components

Components are minimal and quiet. Barely-there borders, subtle state changes, square corners everywhere. They recede until interaction reveals them.

### Buttons

- **Shape:** Square corners (0 radius). Always.
- **Primary:** Signal Blue background, Text Bright text, JetBrains Mono 0.8rem/600, 0.06em tracking, padding 0.75rem 2rem. Used sparingly; one per viewport maximum.
- **Hover:** Background darkens one stop (`#0055DD`), translateY(-1px). Subtle lift.
- **Focus:** 2px Signal Blue outline, 2px offset.
- **Outline:** Transparent background, Border Faint, Text Mid. Hover brightens border to Border Visible, text to Text Bright.

### Navigation

- **Fixed top bar.** Backdrop-filter blur (12px) over void background at 80% opacity. Border-bottom: Border Faint. The nav should be the quietest element on the page.
- **Links:** JetBrains Mono 0.75rem, Text Mid. Hover: Text Bright. Active: Signal Blue.
- **Center wordmark:** Inter 800, 0.9rem, 0.15em tracking. Text Bright. Text scramble on hover.
- **CTA:** JetBrains Mono 0.7rem, Signal Blue border, Signal Blue text. Hover: Signal Blue fill, Void text.
- **Mobile:** Hamburger (3 lines) opens full-screen overlay. Links at 1.5rem mono, centered.

### Project Entries (Featured)

- **Two-column grid** (1fr 1fr), separated by Border Faint bottom border.
- **Left:** Number (mono, quiet), title (headline), problem sentence (italic, text-mid), description (body, text-mid), tech pills, link.
- **Right:** Metric display. This is NOT the hero-metric template. The metric should be displayed as a simple, large number in Text Bright (not gradient, not amber), with a quiet label below.
- **Varied visual weight.** Each project entry should feel different in density and emphasis. Not achieved through the current uniform grid; requires layout variation in the fresh implementation.

### Project Entries (All Work)

- **Cards with varied sizes.** NOT an identical auto-fill grid. Some projects get more visual weight based on importance. Achieved through spanning columns or varying row height.
- **Background:** Surface Deep. Hover: Surface Raised with Border Visible.
- **Internal padding:** spacing-lg (1.5rem).
- **No radius.** Square edges, always.

### Filter Pills

- **Default:** JetBrains Mono 0.7rem, transparent background, Border Faint, Text Mid.
- **Active:** Text Bright background, Void text, same border. Inverted.
- **Hover:** Border Visible.

### Tech Stack Pills

- **JetBrains Mono 0.65rem, Border Faint, Text Mid.** No colored variants. The pills are metadata, not identity. No amber pills, no highlighted primary stack.

### Custom Cursor

- **12px circle, Text Bright, mix-blend-mode: difference.** Hover state: 40px ring, transparent fill, 2px border.

## 6. Do's and Don'ts

### Do:

- **Do** keep all infrastructure monochrome. Backgrounds, borders, text, navigation: neutral tones only. Signal Blue is the sole exception, and only for interactive elements.
- **Do** use square corners (0 radius) on everything. Buttons, cards, pills, inputs, toggles. No exceptions.
- **Do** cap body text at 65ch. Longer lines are harder to scan.
- **Do** use exponential ease-out curves for all transitions (`cubic-bezier(0.19, 1, 0.22, 1)`). No bounce, no elastic, no overshoot.
- **Do** vary the visual weight of project entries. Different sizes, different densities, different aspect ratios. The list should feel curated, not stamped.
- **Do** respect `prefers-reduced-motion` by disabling all animation and scroll effects.
- **Do** tint neutrals toward the brand hue (blue-violet, chroma 0.005). Never use pure `#000` or `#fff`.

### Don't:

- **Don't** use gradient text (`background-clip: text` with a gradient). Currently on `.fp-metric`; must be removed. Use a single solid color.
- **Don't** use the hero-metric template (big number + small label + gradient accent). Currently in featured projects; must be restructured. Display metrics simply, without spectacle.
- **Don't** use identical card grids (`repeat(auto-fill, minmax(300px, 1fr))`). Currently on `.work-grid`; must be replaced with varied-weight layout.
- **Don't** use bounce or elastic easing (`cubic-bezier(0.34, 1.56, 0.64, 1)`). Currently defined as `--ease-bounce`; must be removed.
- **Don't** use amber/gold/warm accent colors in the site infrastructure. PRODUCT.md says "monochrome infrastructure; project work provides all color and warmth."
- **Don't** use side-stripe borders (border-left/right > 1px as colored accent).
- **Don't** use glassmorphism or decorative blur effects.
- **Don't** use the editorial-typographic lane (display serif + mono labels + monochromatic restraint). This is the second-order AI reflex for "not-SaaS" portfolios.
- **Don't** use the SaaS/startup aesthetic: gradient blobs, "trusted by" logos, pricing-page energy.
- **Don't** add decorative chrome to the container: ornamental borders, accent stripes, background patterns. The frame is invisible.
