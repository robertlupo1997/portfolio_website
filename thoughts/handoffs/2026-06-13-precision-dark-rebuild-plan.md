# Handoff: Precision Dark Rebuild Plan (2026-06-13)

## Decision made

User chose to rebuild the portfolio toward **Precision Dark** — a Michelini-inspired structural system. This is a full direction change from the Invisible Frame implementation, not an incremental iteration.

Key reference: **francescomichelini.com** (Folio/23)

## What the rebuild covers (8 tasks)

1. **CSS variables + fonts** — Satoshi→Inter+Space Grotesk, blue `#0066FF`→copper `#C87533`, warm-shift text colors, add `--font-display`
2. **Hero** — `justify-content: center` (not `flex-end`), single CTA, Space Grotesk display face, remove ghost "View work" button
3. **Nav** — horizontal row replacing vertical stack, GSAP ScrollTrigger show/hide on scroll direction, simplified Header.tsx (kill `isNavExpanded` state machine)
4. **Project list** — merge FeaturedProjects + AllWork into single `ProjectList.tsx` with `P/01` labels, slash grammar (`//api engineering`, `/26`), unified vertical list. Cursor-follow preview preserved. Data plates become preview images.
5. **Credential strip** — new `CredentialStrip.tsx` horizontal marquee between hero and project list. Content: MIT cert, USF stats, FerroML test count, nspb-api endpoints, KKBOX AUC.
6. **About** — delete decorative SVG arcs, fold timeline into right column below skills, tighten skill category spacing, copper tags
7. **Footer** — kill giant scrambled name, add closing statement, expand functional links, all JetBrains Mono
8. **Polish** — sweep stale variable references, update meta/title, update reduced-motion block, update DESIGN.md

## Files created/modified/deleted

- **Create:** `ProjectList.tsx`, `CredentialStrip.tsx`
- **Rewrite:** `Hero.tsx`, `Header.tsx`, `About.tsx`, `Footer.tsx`, `styles/index.css`, `index.html`
- **Modify:** `App.tsx`, `constants.ts`, `types.ts`, `useScrollAnimations.ts`
- **Delete:** `FeaturedProjects.tsx`, `AllWork.tsx`
- **Keep unchanged:** `LineReveal.tsx`, `TextScramble.tsx`, `Cursor.tsx`, `useLenis.ts`, all data plates in `public/assets/`

## What's preserved from the current build

- React 19 + Vite + TypeScript stack (no framework change)
- GSAP + Lenis + SplitText
- LineReveal component (inherits new fonts via CSS)
- TextScramble component (character scramble on headings)
- Cursor component
- Real data plates (FerroML, KKBOX)
- `prefers-reduced-motion` support
- Cursor-follow preview on project list
- All a11y fixes (aria-label, aria-pressed, skip-link, heading hierarchy)

## What's dropped

- Two-column alternating featured project layout
- Parallax on project images
- Sibling dimming on hover
- Vertical nav stack with auto-collapse
- Decorative SVG arcs in about section
- Giant scrambled name in footer
- "View work" ghost CTA
- Hero divider
- `--accent-blue` / Satoshi / Fontshare dependency

## Plan location

`docs/superpowers/plans/2026-06-13-precision-dark-rebuild.md`

## Execution

Not yet started. User needs to choose: subagent-driven (recommended) or inline execution.
