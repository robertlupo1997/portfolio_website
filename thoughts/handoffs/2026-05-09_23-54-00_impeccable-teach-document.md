---
date: 2026-05-09T23:54:00-04:00
git_commit: b4f0cf1
branch: redesign/typography-driven
status: complete
---

# Handoff: Impeccable Teach + Document Complete — Ready for Shape

## Task(s)

### Completed
- **Impeccable teach flow**: Full strategic interview (2 rounds) covering register, audience, brand personality, references, anti-references, accessibility
- **PRODUCT.md written**: Brand register, three equal-weight audiences (tech hiring managers, finance/fintech hiring managers, open source devs), personality "precise, inventive, grounded", 5 design principles, WCAG AA
- **DESIGN.md written**: Full Stitch-format spec with YAML frontmatter tokens, 6 sections, named rules. Creative North Star: "The Invisible Frame"
- **`.impeccable/design.json` sidecar written**: Schema v2 with tonal ramps, motion tokens, 6 component snippets, narrative mapping
- **Reference research**: Searched for AI/ML/software engineer portfolios. User rejected prior designer references (rauno.me, cydstumpel.nl, etc.) in favor of engineer portfolios
- **Branch comparison**: Mapped differences between `main` (visual look) and `redesign/typography-driven` (content/copy). User chose "fresh start informed by both" with hybrid hero (big name + narrative hook)

### Planned (next session)
- `/impeccable shape` — Plan the fresh-start redesign using PRODUCT.md + DESIGN.md
- `/impeccable craft` — Implement the approved shape brief
- `/impeccable live` — Browser-based iteration

## Critical References
- `PRODUCT.md` — Strategic context (register, users, personality, principles, anti-references). The source of truth for "why"
- `DESIGN.md` — Visual spec with tokens, named rules, do's/don'ts. The source of truth for "how it looks"
- `.impeccable/design.json` — Sidecar with component snippets, tonal ramps, motion tokens, narrative

## Recent Changes
- `PRODUCT.md` — New file, entire contents written this session
- `DESIGN.md` — New file, entire contents written this session
- `.impeccable/design.json` — New file, entire contents written this session

## Learnings

### Branch situation
- **`main` branch**: Blue + teal palette, FluidGlass WebGL shader, giant TREY/LUPO hero, project cards with `imageUrl`, `ScrollProgress` + `SectionPagination` components, older project list (Amazon Recs, FoodHub, Shinkansen)
- **`redesign/typography-driven` branch** (current): Amber + blue palette, no FluidGlass, narrative hero hook ("FP&A Analyst. Builds production tools with AI."), featured projects with `problem` sentences, `ManifestoFooter`, `Timeline`, updated project list (nspb-api, FerroML, Ironclad, GSD-ML, MLForge)
- **User decision**: Fresh start using BOTH. Keep this branch's content/copy (project data, problem sentences, manifesto, timeline, descriptions). Redesign visuals informed by main's look. Hybrid hero: big name + narrative hook visible without scrolling.

### Key design decisions
- **North Star**: "The Invisible Frame" — gallery with matte black walls, projects provide all visual interest
- **Color strategy**: Restrained — monochrome infrastructure + Signal Blue as sole accent (≤10%). NO amber/warm tones in site chrome (The Zero Warmth Rule). Amber was the most visible "AI made this" pattern
- **Components**: Minimal and quiet — barely-there borders, square corners (0 radius everywhere), subtle hover states
- **Typography**: Single-font system (Inter for hierarchy via weight/scale, JetBrains Mono for metadata only ≤0.8rem)
- **Elevation**: Flat, no shadows. Three tonal levels (void → surface-deep → surface-raised). Grain overlay at 3%

### Violations in current CSS that must be fixed
1. Gradient text on `.fp-metric` (background-clip: text) — absolute ban
2. Hero-metric template in featured projects (big number + small label + gradient accent) — absolute ban
3. Identical card grid `.work-grid` with `repeat(auto-fill, minmax(300px, 1fr))` — absolute ban
4. Bounce easing `--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1)` — motion law violation
5. `#fff` used in `.btn-primary` color — should be tinted neutral

### Reference sites user selected
- **simonholm.studio** — Numbered index, varied aspect ratios per project entry, alive not templated
- **Pangram Pangram Right Serif Mono specimen** (images at `/mnt/c/Users/Trey/Downloads/references/`) — NOT the typography; the layout logic and palette. Near-black background, monochrome infrastructure, content provides all color
- **leerob.io** — Clean engineer portfolio, design-aware without trying too hard
- User explicitly said they need more AI/ML engineer references; the designer references from prior sessions (rauno.me, cydstumpel.nl, federicopian.com, imarketina.com) don't fully resonate

### Tools discussed
- **design-extract** (`npx designlang <url>`) — Extract design tokens from reference sites. User asked about it; recommended parking it for shape phase when we need concrete token values from simonholm.studio
- **Playwright** already installed for screenshots: `npx playwright screenshot --browser chromium --full-page "http://localhost:3000/" screenshot.png`

## Artifacts
- `PRODUCT.md` — Strategic context document (brand register, 3 audiences, 5 principles, anti-references, WCAG AA)
- `DESIGN.md` — Visual design spec (Stitch format, YAML frontmatter, 6 sections, 4 named rules, do's/don'ts)
- `.impeccable/design.json` — Sidecar (schema v2, 7 color ramps, 4 motion tokens, 6 component snippets, narrative)

## Action Items & Next Steps
1. **Start dev server**: `cd ~/projects/portfolio_website/rlupo-portfolio && node node_modules/.bin/vite --host 0.0.0.0 --port 3000`
2. **Run `/impeccable shape`** to plan the fresh-start redesign. Shape needs to address:
   - Hybrid hero layout (big TREY LUPO name + narrative hook visible together)
   - Varied-weight project layout (not uniform grid) per simonholm.studio reference
   - Removal of all amber from infrastructure
   - Restructuring metrics display (no hero-metric template)
   - What to keep from main (visual weight, project images?) vs this branch (content, manifesto, timeline)
3. **Get shape brief approved** by user before any implementation
4. **Run `/impeccable craft`** to implement the approved brief
5. **Run `/impeccable live`** for browser-based iteration
6. Optionally run `npx designlang https://simonholm.studio` during shape to extract layout tokens

## Other Notes
- The impeccable skill is installed at `~/.claude/skills/impeccable/`
- Context loader: `node /home/tlupo/.claude/skills/impeccable/scripts/load-context.mjs` (use absolute path; relative path fails)
- PRODUCT.md and DESIGN.md are both at project root (`/home/tlupo/projects/portfolio_website/`)
- The `.impeccable/` directory was created this session for the sidecar
- User memory: Trey is an FP&A analyst at Franklin Street, data scientist, AI/ML builder. Tampa/Remote. Portfolio at treylupo.com deployed on Vercel
