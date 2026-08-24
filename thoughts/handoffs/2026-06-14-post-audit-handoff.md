# Handoff: Post-Audit Fixes + Design Evolution (2026-06-14)

## For the next session

The terminal carousel redesign is built and has been audited. This handoff covers both the audit fixes and the user's design evolution ideas.

---

## Current state

**Branch:** `redesign/invisible-frame`
**Latest commit:** `7a90ee7` — terminal carousel redesign (all components)
**Build status:** Clean
**Dev server:** `cd rlupo-portfolio && npm run dev` → http://localhost:3000
**Audit findings:** `thoughts/handoffs/2026-06-14-audit-findings.md`

---

## Priority 1: Critical fixes from audit

1. **nspb-api missing VISIT button** — `constants.ts` has no `githubUrl` for nspb-api (it's a private repo). Either add a placeholder URL or add a `liveUrl`. The TerminalPanel only renders `[ VISIT -> ]` when one of these exists.

2. **Carousel doesn't scroll-to-top on slide change** — When scrolled past the carousel (archive visible) and user clicks PREV/NEXT/dots, the slide changes but scroll position stays. The carousel section should `scrollIntoView` on slide change, or the carousel should lock scroll while in viewport.

---

## Priority 2: Major fixes from audit

3. **Revenue Forecast image (slide 3)** — `kkbox-churn.jpg` is a placeholder from another project. Needs a real data visualization or terminal-style graphic.

4. **FerroML chart (slide 2)** — Left edge cropped, cutting model names. Fix with `object-position: center` or adjust image padding.

5. **Scanlines too subtle** — Currently `rgba(0,0,0,0.04)`. Increase to ~`rgba(0,0,0,0.08)` or higher to make the CRT effect visible.

6. **Clip-path reveal animation not visible** — The CSS `clip-path: inset(0 100% 0 0) → inset(0 0 0 0)` transition exists but may not be firing on slide change because the `--active` class may already be set on mount. Debug: ensure the class toggles on/off with slide transitions, not just on initial render.

7. **Terminal text stagger not visible** — Same root cause as clip-path: the `terminal-body--active` class may be set from mount. The stagger animation (`terminalLineIn` with nth-child delays) only plays once on initial class application. May need to force re-mount or re-trigger the animation on slide change.

---

## Priority 3: User's design evolution ideas

The user has these changes in mind for after the audit fixes:

### A. Navigation placement
- Move PREV/NEXT to the **left side of the screen**, not bottom-center overlapping images
- Make them more visible

### B. Image sizing
- Images are too dominant at 55% width + full viewport height
- Shrink them — more minimal, more breathing room, like Michelini's reference
- Consider: smaller contained image with padding, not edge-to-edge

### C. All projects in carousel
- Move ALL 9 projects into the horizontal carousel (not just 3 featured + 6 archive)
- Remove the archive list section entirely
- Every project gets its own full slide

### D. Future layout exploration (NOT for this session)
- Inspiration: [elliott.mangham.dev](https://elliott.mangham.dev/) — has an "about you" section at the top with a horizontal scroll gallery below
- Possible: about section fixed at top, carousel takes remaining viewport below
- This is a significant structural change — brainstorm first, don't implement yet

---

## Minor polish items from audit (fix when convenient)

- `/26` epoch indicator is ambiguous — could mean year 2026 or "project 1 of 26". Consider `'26` or removing.
- `[ CLOSE ]` button on Info overlay has solid fill, should match outlined pill style of header buttons
- Info overlay scroll position: closing returns to archive instead of carousel
- Header backdrop blur hard to perceive against olive background
- Blinking cursor position on slide 1 floats in empty space (fixes when VISIT button is added)

---

## Key files

| File | What it does |
|------|-------------|
| `rlupo-portfolio/App.tsx` | Root: Preloader → Header → Carousel → ArchiveList → Footer + InfoOverlay |
| `rlupo-portfolio/constants.ts` | All project data — edit here to add URLs or change content |
| `rlupo-portfolio/components/Carousel.tsx` | Carousel container + GSAP transitions + nav |
| `rlupo-portfolio/components/CarouselSlide.tsx` | Single slide: terminal panel + image |
| `rlupo-portfolio/components/TerminalPanel.tsx` | Terminal readout for project data |
| `rlupo-portfolio/components/InfoOverlay.tsx` | Full-screen info overlay |
| `rlupo-portfolio/components/ArchiveList.tsx` | Secondary project list (may be removed) |
| `rlupo-portfolio/hooks/useCarousel.ts` | Carousel state, keyboard, swipe |
| `rlupo-portfolio/styles/index.css` | All CSS — palette, components, responsive, a11y |
| `docs/superpowers/specs/2026-06-14-terminal-carousel-redesign.md` | Design spec |
| `docs/superpowers/specs/2026-06-14-creative-vision.md` | Creative vision document |

---

## Reference sites

- **francescomichelini.com** — Original reference for carousel structure + olive/red-coral palette
- **elliott.mangham.dev** — New reference for about-section-on-top + horizontal scroll below layout

---

## Resume instructions

1. Start dev server: `cd rlupo-portfolio && npm run dev`
2. Fix the 2 critical issues first (nspb-api URL, scroll-to-top)
3. Then work through major fixes (scanlines, clip-path, stagger animations)
4. Then tackle user's design changes (nav placement, image sizing, all projects in carousel)
5. Use `/impeccable` or design skills for visual polish decisions
