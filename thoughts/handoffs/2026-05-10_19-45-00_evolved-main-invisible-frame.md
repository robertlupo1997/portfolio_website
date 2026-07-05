---
date: 2026-05-10T19:45:00-04:00
git_commit: a0b4171 (uncommitted changes on top)
branch: redesign/invisible-frame
status: in-progress
---

# Handoff: Evolved Main Branch with Invisible Frame Design Tokens

## Summary

Portfolio redesign for treylupo.com. We evolved main's existing components (scattered card layout, project images, parallax, overlapping about section) by swapping design tokens to match the "Invisible Frame" design spec. Previous attempt (V1 on `redesign/typography-driven`) failed because it rewrote everything from scratch and produced a text-heavy, imagery-less layout. This session's approach: targeted edits to main's code instead of full rewrites. The visual DNA from main (images, card layouts, animations) is preserved.

## What Changed from Main

All changes are uncommitted on `redesign/invisible-frame` (branched from main at a0b4171).

### CSS Token Swaps (`rlupo-portfolio/styles/index.css`)
- Font: `Inter` → `Satoshi` (loaded via Fontshare in index.html)
- Colors: `--text-primary: #FAFAFA` → `#E8E8EE`, `--bg-secondary: #141415` → `#111113`, `--bg-tertiary: #1a1a1b` → `#18181B`
- Accent: `--accent-teal` aliased to `--accent-blue` (Signal Blue only, no teal)
- Borders: `--border-subtle: 0.08` → `0.06` opacity
- Radius: ALL radius tokens set to `0` (square corners everywhere)
- Easing: `--ease-bounce` redirected to `--ease-out` (no bounce/elastic)
- Removed: glow effects, light theme variables, `prefers-color-scheme: light` media query
- Max-width: `1400px` → `1280px`
- Base text: `1rem` → `0.95rem`

### Data Model (`rlupo-portfolio/types.ts`, `rlupo-portfolio/constants.ts`)
- `Project` type expanded: added `description`, `problem?`, `metricLabel`, `metricNumeric?`, `stack[]`, `primaryStack[]`, `featured`
- `ProjectCategory` changed: `'analytics'` → `'engineering'`
- Old `PROJECTS[]` replaced with `FEATURED_PROJECTS[]` (3 items: nspb-api, FerroML, Revenue Forecast) + `ALL_PROJECTS[]` (6 items: KKBOX, Obj-Detect, Ironclad, FerroML Plugin, GSD-ML, MLForge)
- Added `TIMELINE[]` (3 entries) and `SKILL_GROUPS[]` (5 groups)
- Removed `MANIFESTO_LINES`
- Featured projects temporarily use main's existing images as placeholders (`amazon-network.jpg`, `objdetect-matrix.jpg`, `kkbox-churn.jpg`)

### Components Changed
- **App.tsx**: Removed CustomCursor, ScrollProgress, SectionPagination imports. Footer moved outside `<main>`.
- **Header.tsx**: Removed ThemeToggle import. Wordmark changed from "TREY.ML" to `<TextScramble text="TREY LUPO">`.
- **ProjectsSection.tsx**: Changed from `PROJECTS` to merged `[...FEATURED_PROJECTS, ...ALL_PROJECTS]`. Filter counts updated for `engineering` category. Mouse-leave easing changed from `elastic.out` to `power3.out`.
- **ProjectCard.tsx**: `githubUrl` link now guarded with `&&` since it's optional in new type.
- **About.tsx**: Inline `SKILLS[]` and `SERVICES[]` arrays replaced with imported `SKILL_GROUPS` and `TIMELINE` from constants. Bio text updated. Decorative SVG circles changed from `--accent-teal` to `--accent-blue`. Skills section now renders grouped skill categories. Services section replaced with timeline entries.
- **Footer.tsx**: FluidGlass import replaced with TextScramble. Footer name display uses `<TextScramble>` instead of `<FluidGlass>`.
- **vite.config.ts**: Removed `'webgl': ['ogl']` manual chunk.
- **index.html**: Added Satoshi font preconnect + stylesheet from Fontshare.

### Components NOT Changed (kept from main as-is)
- `TextScramble.tsx` — working, used for hero name + wordmark + footer
- `useTextScramble.ts` — hook powering TextScramble
- `useLenis.ts` — smooth scroll, working
- `useScrollAnimations.ts` — targets `.about-statement-overlap`, `.about-bio-overlap`, `.skill-tag-overlap` classes (still valid)
- `ProjectFilter.tsx` — filter pills, uses `PROJECT_CATEGORIES` from constants
- `CustomCursor.tsx`, `FluidGlass.tsx`, `ThemeToggle.tsx`, `ScrollProgress.tsx`, `SectionPagination.tsx` — still on disk but not imported. Can be deleted.

## Critical References

- **`PRODUCT.md`** (project root) — Product strategy, users, brand personality, references, anti-references. Register: brand.
- **`DESIGN.md`** (project root) — Complete visual spec: Void Palette, Satoshi typography, square corners, no shadows, signal blue only, named rules (One Signal, Zero Warmth, No Shadow, Mono Stays Small).
- **`.impeccable/design.json`** — Machine-readable sidecar of DESIGN.md with tonal ramps, component CSS, motion tokens.
- **`design-extract-output/simonholm-studio-design-language.md`** — Full extraction from simonholm.studio. Key measurements: `--big-number: 6.4rem`, PP Neue Montreal 400/500 only, 68 flex containers zero grids, page-margin 0.7rem, ease-out cubic-bezier(0.215, 0.61, 0.355, 1).
- **`design-extract-output/zajno-com-design-language.md`** — Full extraction from zajno.com. Single font weight 400, red accent on dark, all-lowercase headings, flex-only, atmospheric entrance reveals up to 1.8s.
- **`thoughts/handoffs/2026-05-10_shape-craft-v2.md`** — Previous handoff with confirmed shape brief, V1 failure analysis, and image generation prompts.

## Confirmed Shape Brief (Do NOT Re-Run Shape)

All decisions confirmed by user in prior session:

- **Scope**: Full site, production-ready
- **Hero**: Name dominant (display scale), narrative hook secondary, status line, CTAs
- **Featured Projects**: 3 entries, genuinely varied layouts. Each with large visual. IMAGE-FORWARD.
- **All Work**: 6 secondary projects. Not identical card grid. Varied sizing.
- **About**: Statement + bio + skills + timeline (merged). No manifesto.
- **Footer**: Minimal links row.
- **Font**: Satoshi (900/500/400) + JetBrains Mono (labels only, <=0.8rem)
- **Theme**: Dark only
- **No**: FluidGlass, light theme, manifesto
- **Selective Surprises** (all three confirmed):
  - A: Hero name resolves via text scramble (slow 1.5s, sequential lock)
  - B: Featured project metrics count up from 0 on scroll
  - C: Horizontal rule expands center-to-edges between hero and projects

## What V1 Got Wrong (Lessons for Next Session)

V1 (`redesign/typography-driven` branch, stash@{0}) rewrote all components from scratch. Result:
- **Text-heavy, no images.** Dark gradient placeholders instead of real visuals. Looked like every other developer portfolio template.
- **"Varied layout" = three different column ratios of text blocks.** Not genuinely different compositions.
- **No visual weight.** Everything was typography-only. simonholm.studio's visual weight comes from PHOTOGRAPHY, not text.

**Fix applied this session:** Evolved main's code instead of rewriting. Main already had images, scattered cards, visual presence. The token swaps (Satoshi, void palette, square corners, signal blue) apply the design spec WITHOUT losing the visual DNA.

## Available Images (`public/assets/`)

These are from main's OLD projects. They're temporarily borrowed for featured projects:
- `amazon-network.jpg` — dark network visualization (used for nspb-api placeholder)
- `objdetect-matrix.jpg` — matrix/grid visualization (used for FerroML placeholder)
- `kkbox-churn.jpg` — colorful abstract (used for Revenue Forecast placeholder)
- `foodhub-heatmap.png` — heatmap visualization
- `life-heartbeat.jpg` — heartbeat visualization
- `shinkansen-shibuya.jpg` — Japan cityscape
- `hero.mp4` / `hero.webm` — video (not currently used)

## Image Generation Plan (From Previous Handoff)

User wants to generate project-specific visuals with Gemini/ChatGPT. Prompts from prior session:

1. **nspb-api**: Abstract topology of connected API endpoints, luminous blue data streams flowing through a dark lattice. Cool-toned. 16:9.
2. **FerroML**: Crystalline metallic structures forming from molten material (ferro = iron). Warm copper/orange against dark. 16:9.
3. **Revenue Forecast**: Layered translucent planes showing hierarchical data reconciliation, cool greens/teals, mathematical precision. 16:9.

## Current Dev Server State

- Port 3000, running from `rlupo-portfolio/` directory
- Build passes cleanly (`npm run build` succeeds)
- Screenshot at `/tmp/portfolio-evolved-full.png` shows working state
- TS diagnostics: pre-existing `@types/react` warnings (React 19 bundles its own types). Don't affect build.

## Action Items for Next Session

### Priority 1: Run `/impeccable craft` with the confirmed brief
- Shape is confirmed. Skip shape. Go straight to craft.
- The impeccable skill will handle visual iteration (build → screenshot → critique → fix).
- Pass this context: "Shape brief confirmed in prior session. Building on evolved main components. Focus on: (1) typography refinement with Satoshi, (2) featured project layout variation, (3) adding selective surprises, (4) responsive polish."

### Priority 2: Implement selective surprises
- **A (Text Scramble)**: Already working via `TextScramble` component. May need timing refinement (1.5s, sequential character lock per brief).
- **B (Metric Count-Up)**: Not yet implemented. Add `useCountUp` hook or IntersectionObserver in ProjectCard/FeaturedProject to animate `metricNumeric` values from 0 on scroll.
- **C (Divider Reveal)**: Not yet implemented. Add an `<hr>` or `<div>` between hero and projects that scales from `scaleX(0)` center-origin on scroll into view.

### Priority 3: Generate project imagery
- User wants to use Gemini/ChatGPT image generation (external, not in Claude Code).
- Prompts are in the "Image Generation Plan" section above.
- Once generated, place in `public/assets/` and update `imageUrl` in `constants.ts` for FEATURED_PROJECTS.

### Priority 4: Cleanup dead components
- Delete: `FluidGlass.tsx`, `ThemeToggle.tsx`, `CustomCursor.tsx`, `ScrollProgress.tsx`, `SectionPagination.tsx`
- Delete: `shaders/` directory (FluidGlass shader code)
- These are still on disk but not imported anywhere.

### Priority 5: Commit the work
- All changes are currently uncommitted. Commit when satisfied with state.

## Other Notes

- The `redesign/typography-driven` branch still exists with V1 code. Its stash (`stash@{0}`) has uncommitted V1 changes. Can be dropped.
- `PRODUCT.md` and `DESIGN.md` are untracked files at project root (not committed to any branch). They need to be committed with this work.
- The `design-extract-output/` directory is also untracked. Commit or .gitignore.
- `.impeccable/design.json` is untracked. Commit or .gitignore.
- The `@types/react` TS diagnostics are pre-existing on main (React 19 issue). Don't try to fix.

---

## CRITICAL: The Extraction Data Must Drive the Next Build

### What Happened

Session 1 extracted detailed design data from simonholm.studio and zajno.com. Session 2 (this one) evolved main's components by swapping CSS tokens (font, colors, radii) but **did not incorporate any of the extracted layout, composition, or motion patterns**. The current site still looks like main with a different skin. The extraction data — the entire reason we ran those extractions — sits unused.

### What Must Happen Next

Run the **full `/impeccable craft` pipeline** with the extraction data as the concrete visual spec. The user wants a creative partner, not a token swapper. The goal is to synthesize simonholm.studio and zajno.com into a unified vision for this portfolio — not copy either one, but create something original informed by both.

**Do NOT skip `/impeccable shape`.** The previous shape brief was confirmed before we had extraction data. Now we have concrete measurements. Re-run shape to incorporate them into a new brief, then craft from that brief.

### simonholm.studio — What to Extract (Concrete Measurements)

Source: `design-extract-output/simonholm-studio-design-language.md` and related files.

**Layout philosophy:**
- 68 flex containers, ZERO CSS grids. Entirely flex-based layout.
- `--page-margin: 0.7rem` — extremely tight page margins
- `max-width: 1280px`
- Project entries are IMAGE-FORWARD. Large 16:9 photography provides visual weight.

**Typography:**
- PP Neue Montreal, weights 400 and 500 only. No bold. No 900.
- Display text: `--big-text: 10.8rem` with `--big-text-line: 80%` line-height
- Big numbers: `--big-number: 6.4rem` with `--big-number-space: -0.15rem` letter-spacing
- Body copy: `--body-copy: 1rem` with `--body-copy-line: 1.4rem`
- Small descriptors: `--small-discriptor-text: 0.9rem`
- Small text (metadata): `10.716px` (~0.67rem) at weight 500
- Hierarchy through SCALE, not weight. The ratio between 10.8rem display and 0.67rem body = 16:1.

**Spacing:**
- `--section-break: 160px` between major sections
- `--mid-section-break: 100px` between sub-sections
- `--x-small-section-break: 15px` tight grouping
- `--row-margin: 1rem`

**Motion:**
- Primary easing: `cubic-bezier(0.215, 0.61, 0.355, 1)` — ease-out dominant
- Transform transitions: `0.8s` with `1s` delay
- Opacity transitions: `0.6s`
- Border transitions: `0.2s ease-in-out`

**Color:**
- Only 4 colors total: `#ffffff`, `#000000`, `#a3a3a3`, `#1a1a1a`
- Background: `#1a1a1a` (10% lightness), `#212121` for elevated surfaces
- Text: white primary, `#a3a3a3` (64% lightness) secondary
- Border: `#ffffff4d` (white at 30% opacity)

**Visual DNA:**
- Material: flat (zero shadows, zero gradients, zero backdrop-blur)
- Imagery: photography, landscape dominant, square corners, 6 photos total
- Zero border-radius on content (pill shapes only on interactive)

### zajno.com — What to Extract (Concrete Measurements)

Source: `design-extract-output/zajno-com-design-language.md` and related files.

**Layout philosophy:**
- 49 flex containers, ZERO CSS grids. Same flex-only approach.
- Single-column dominant with dramatic scale shifts

**Typography:**
- Single font weight: 400 only. ONE weight for everything.
- Display: `40px` (2.5rem) at weight 400, line-height 1:1 (40px/40px)
- Body: `20px` (1.25rem) at weight 400, line-height 1:1 (20px/20px)
- Metadata: `10.67px` (~0.67rem) at weight 400
- ALL-LOWERCASE headings — this is a distinctive choice
- Tight line-heights throughout (1:1 ratio = extremely tight)

**Motion:**
- Same cubic-bezier family as simonholm: `--o3: cubic-bezier(.215,.61,.355,1)`
- Also: `--o6: cubic-bezier(.19,1,.22,1)` and `--io6: cubic-bezier(.16,1,.3,1)`
- Durations range from `0.25s` (micro) to `1.8s` (atmospheric reveals)
- Atmospheric entrance: `opacity 1.8s cubic-bezier(0.16, 1, 0.3, 1)` — this is the key signature

**Color:**
- `--color-dark: #1a1a1a` — same dark as simonholm
- `--color-red: #ff3928` — vibrant single accent
- Only 6 colors total. Hyper-restrained.

**Distinctive patterns:**
- `border-radius: 100px` on interactive elements only (pill shapes)
- Zero radius on content/cards
- Fade keyframe animation as base reveal pattern

### Common DNA Across Both Sites

These patterns appear in BOTH extractions and should be treated as proven:

1. **Flex-only layouts** — zero CSS grid anywhere on either site
2. **Flat materials** — no shadows, no gradients, no backdrop-blur
3. **Square corners on content** — pill shapes reserved for buttons/interactive
4. **Extreme typographic scale contrast** — 12-16:1 ratio between display and body
5. **Minimal font weights** — 1-2 weights maximum, hierarchy through size alone
6. **Same easing family** — cubic-bezier(0.215, 0.61, 0.355, 1) as primary
7. **Photography as primary visual weight** — not text, not icons, not illustrations
8. **Tight page margins** — 0.7rem (simonholm)
9. **Very tight line-heights** — 80-86% on display, 1:1 on body (zajno)
10. **Hyper-restrained color** — 4-6 colors total, including black/white

### How to Synthesize for Trey's Portfolio

Take FROM simonholm:
- Giant numbered project index (`6.4rem` numbers)
- Image-forward project entries with photography dominating
- Section breaks at 160px / 100px
- The specific `0.8s transform + 1s delay` entrance pattern

Take FROM zajno:
- Atmospheric 1.8s opacity reveals on scroll
- Tighter line-heights (the 1:1 body ratio feels premium)
- The confidence of single-weight typography (we use Satoshi 400/500, not 900)
- All-lowercase section labels (consider for metadata/categories)

Make it OURS (not either site):
- Signal Blue accent instead of zajno's red (already in DESIGN.md)
- Satoshi instead of PP Neue Montreal or zajno's unnamed sans
- The three selective surprises (text scramble, metric count-up, divider reveal)
- FP&A/engineering content voice — grounded, not studio-creative

### Impeccable Pipeline Instructions

1. **Run `/impeccable shape`** — create a NEW brief that incorporates the extraction measurements above. The old brief was pre-extraction. Present it as a creative partner, not a checklist executor. Show the user specific layout concepts for each section, referencing concrete pixel values from the extractions. Get confirmation.

2. **Run `/impeccable craft`** — build from the confirmed new brief. Start from the current evolved-main codebase (token swaps already done). Transform layouts and components to match the synthesized vision. Use Playwright screenshots at each iteration to verify visual quality.

3. **Key craft constraints:**
   - Switch from CSS Grid to flexbox everywhere (both reference sites use zero grids)
   - Reduce Satoshi to weights 400/500 only (drop 900 — both sites use max 2 weights)
   - Giant project numbers at 4-6rem (inspired by simonholm's 6.4rem)
   - Section breaks at 120-160px (not the cramped current spacing)
   - Entrance reveals at 0.8-1.8s (not the current 0.3-0.5s)
   - Line-heights much tighter on display text (80-86%, currently 0.9-1.1)
   - Each featured project: image covers 55-65% of entry area
   - Ultra-minimal project text — problem sentence only, 1-2 lines max
   - All category/metadata labels lowercase with wide tracking

4. **Image strategy during craft:**
   - Use main's existing images (`kkbox-churn.jpg`, `objdetect-matrix.jpg`, `amazon-network.jpg`, etc.) as real visual content
   - They're good enough for layout validation — dark, technical, varied
   - User will generate project-specific images with Gemini/ChatGPT separately
