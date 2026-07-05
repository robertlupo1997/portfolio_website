---
date: 2026-05-10T02:30:00-04:00
git_commit: b4f0cf1
branch: redesign/typography-driven
status: ready-for-implementation
---

# Handoff: Shape Brief Confirmed, V1 Craft Rejected, V2 Plan Ready

## Summary

Shape brief was confirmed. First craft attempt built on `redesign/typography-driven` branch produced a text-heavy layout that looks nothing like simonholm.studio. User correctly identified the problem: "varied layout" was implemented as three slightly different column ratios, not genuinely different visual treatments. The result looks like another dark-mode developer portfolio template.

**Decision: Start fresh from `main` branch.** Main had better visual DNA (project images, more visual presence). Carry over strategic docs + content data from redesign branch.

## What to Do Next

### 1. Create new branch off main

```bash
git checkout main
git checkout -b redesign/invisible-frame
```

### 2. Carry over from redesign/typography-driven

Copy these files to the new branch:
- `PRODUCT.md` (strategic context, confirmed)
- `DESIGN.md` (visual spec, updated for Satoshi font)
- `.impeccable/design.json` (sidecar)
- `design-extract-output/` (simonholm.studio extraction data)

From `constants.ts` on redesign branch, carry over:
- `FEATURED_PROJECTS` array (nspb-api, FerroML, Revenue Forecast with problem sentences)
- `ALL_PROJECTS` array (updated project list)
- `TIMELINE` array
- `SKILL_GROUPS` array
- `PERSONAL_INFO`
- `MANIFESTO_LINES` is dropped (user said manifesto "feels like it's trying too hard")

### 3. Run `/impeccable craft` with the confirmed shape brief

The shape brief is confirmed. Do NOT re-run shape. The brief decisions are:
- Full site, production-ready
- Hero: name dominant, hook secondary
- Projects: mixed text + selective imagery
- Timeline merged into About, manifesto dropped
- All three selective surprises (resolving name, counting metrics, scroll reveal)
- Satoshi font (replacing Inter)
- AI-generated project imagery (during craft)
- No light theme, no FluidGlass

### 4. But THIS TIME, learn from simonholm.studio

The extraction data is in `design-extract-output/`. Key lessons:

**What simonholm.studio actually does:**
- Project entries are IMAGE-FORWARD. Large 16:9 photography/video provides visual weight, not text.
- Giant numbered index (`--big-number: 6.4rem`). Numbers are as visually prominent as titles.
- Only 2 font weights (400/500) with extreme scale contrast (8rem display vs 0.67rem body). Hierarchy through SIZE, not weight proliferation.
- Entirely flex-based layout. Zero CSS grids.
- Ultra-minimal text. Short project names, tiny descriptions, huge visuals.
- The "varied rhythm" comes from images at different aspect ratios and scales, not from different text block arrangements.

**What V1 got wrong:**
- Three "varied layouts" were just three different column ratios of text blocks
- No imagery anywhere. Text-on-dark is just another developer portfolio template.
- Metrics displayed as afterthoughts in a right column, not as giant visual anchors
- Description paragraphs too long. simonholm uses 1-2 lines max per project.
- Skills section, timeline, about bio all feel like resume sections, not portfolio design

**What V2 must do differently:**
- Each featured project MUST have a large visual (AI-generated art, screenshot, or code visualization). The visual IS the weight.
- Project numbers should be enormous (4-6rem), visually prominent, not tucked in a corner
- Description text should be SHORT. One sentence max for featured projects.
- Use main branch's existing images (kkbox-churn.jpg, objdetect-matrix.jpg) as references for style, but generate new ones for the current projects
- Layout should be flex-based, not grid-based, to allow more organic composition
- Each project entry should have genuinely different composition, not just different column ratios

## Confirmed Shape Brief (Carry Forward)

### Design Direction
- **North Star**: "The Invisible Frame"
- **Color Strategy**: Restrained. Void palette + Signal Blue <10%.
- **Font**: Satoshi (900/500/400) + JetBrains Mono (labels only, <=0.8rem)
- **Theme**: Dark only. "SRE scanning portfolios at 11pm on tab 14 of 20."
- **Anchors**: simonholm.studio (varied index, giant numbers, imagery-driven), zajno.com (scroll-linked motion, flex-based layout, single-weight type), Pangram Pangram (palette logic), leerob.io (engineer portfolio)

### Reference Extraction Key Takeaways

**simonholm.studio:**
- Giant numbers at 6.4rem. Project indices ARE visual weight.
- PP Neue Montreal, only weights 400/500. Extreme scale contrast (8rem display vs 0.67rem body).
- 6 photographs, 16:9 and 3:2, object-fit cover, square corners. Photography IS the content.
- 68 flex containers, ZERO grids. Entirely flex-based.
- Scroll-linked motion. Ease-out dominant (cubic-bezier 0.215, 0.61, 0.355, 1).
- Max-width 1280px. Page margin 0.7rem.

**zajno.com:**
- Single font weight (400). Typography hierarchy through SCALE alone.
- Vibrant single accent (red #ff3928) on dark (#1a1a1a) or light (#ebebeb) surfaces.
- All-lowercase headings, tight line-height (1:1 ratio on body/headings).
- 49 flex containers, ZERO grids. Same flex-only philosophy.
- Same cubic-bezier easing family. Scroll-linked motion.
- Longer animation durations (up to 1.8s) for atmospheric entrance reveals.

**Common patterns across both references:**
- Flex-only layouts (no CSS grid)
- Flat (no shadows, no gradients, no backdrop blur)
- Square corners on content (pill shapes only on interactive elements)
- Scroll-linked motion with ease-out curves
- Extreme typographic scale contrast
- Minimal font weights (1-2 only)
- Photography/video as primary visual weight

### Layout Zones
1. **Hero**: Name dominant (display scale), narrative hook secondary, status line, CTAs
2. **Featured Projects**: 3 entries, GENUINELY varied (not column-ratio varied). Each with large visual.
3. **All Work**: 6 secondary projects. Not identical card grid. Varied sizing.
4. **About**: Statement + bio + timeline (merged). No manifesto.
5. **Footer**: Minimal links row.

### Selective Surprises (all three confirmed)
- A: Hero name resolves via text scramble (slow 1.5s, sequential lock)
- B: Featured project metrics count up from 0 on scroll
- C: Horizontal rule expands center-to-edges between hero and projects

### Named Rules (from DESIGN.md)
- The One Signal Rule (signal blue only)
- The Zero Warmth Rule (no amber/gold/warm in infrastructure)
- The No Shadow Rule (tonal elevation only)
- The Mono Stays Small Rule (JetBrains Mono <= 0.8rem)

## Critical References

- `PRODUCT.md` (project root) -- strategic context, confirmed
- `DESIGN.md` (project root) -- visual spec, updated for Satoshi
- `.impeccable/design.json` -- sidecar with tokens
- `design-extract-output/simonholm-studio-design-language.md` -- full extraction
- `design-extract-output/simonholm-studio-visual-dna.json` -- imagery style
- `design-extract-output/simonholm-studio-intent.json` -- section roles
- `design-extract-output/simonholm-studio-variables.css` -- CSS variables
- `design-extract-output/zajno-com-design-language.md` -- full extraction of zajno.com
- `design-extract-output/zajno-com-visual-dna.json` -- zajno visual DNA

## Main Branch State (as of last check)

Components on main:
- Hero: Giant TREY/LUPO text with TextScramble
- About: Overlapping layout with decorative SVG circles, parallax statement
- Projects: Card-based with project images
- FluidGlass: WebGL shader background (DROP THIS -- user said "it is not mine")
- ScrollProgress, SectionPagination (explore whether to keep)

Images on main (`public/assets/`):
- amazon-network.jpg, foodhub-heatmap.png, kkbox-churn.jpg
- life-heartbeat.jpg, objdetect-matrix.jpg, shinkansen-shibuya.jpg
- hero.mp4, hero.webm (video)
- These are for OLD projects. New projects need new imagery.

## Tools Available

- **Playwright**: `npx playwright screenshot --browser chromium --full-page "http://localhost:3000/" screenshot.png`
- **Design Extract**: `npx designlang <url>` for additional reference extraction
- **Impeccable**: `/impeccable craft` with confirmed brief
- **Context Loader**: `node /home/tlupo/.claude/skills/impeccable/scripts/load-context.mjs`
- **AI Image Generation**: User wants to use Gemini or ChatGPT for project imagery. Plan prompts per project.

## Image Generation Plan

For AI-generated project visuals (Awwwards quality, dark/moody, abstract):

1. **nspb-api**: Abstract topology of connected API endpoints, luminous blue data streams flowing through a dark lattice. Cool-toned. 16:9.
2. **FerroML**: Crystalline metallic structures forming from molten material (ferro = iron). Warm copper/orange against dark. 16:9.
3. **Revenue Forecast**: Layered translucent planes showing hierarchical data reconciliation, cool greens/teals, mathematical precision. 16:9.

These should be generated with Gemini/ChatGPT image generation during the craft phase. The layout must accommodate 16:9 imagery prominently.

## V1 Build Artifacts (on redesign/typography-driven)

The V1 build is still on `redesign/typography-driven`. It includes:
- Complete CSS rewrite (styles/index.css)
- All component rewrites (Hero, FeaturedProject, ProjectsSection, About, Footer, Header)
- Deleted: ManifestoFooter, ThemeToggle, Timeline (inlined into About)
- Working dev server, clean TypeScript, clean production build

This work is NOT lost but should be treated as reference only, not a starting point. V2 builds from main.

## TS Diagnostics Note

The `@types/react` warnings in the diagnostics are pre-existing (not caused by this session's changes). They appear because the project uses React 19 which bundles its own types but the strict TS config expects separate type packages. These don't affect the build.
