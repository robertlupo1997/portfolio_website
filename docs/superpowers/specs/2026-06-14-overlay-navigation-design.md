# Overlay Navigation — Design Spec

## Goal

Eliminate vertical scrolling from the main page. The carousel fills the entire viewport. The footer is absorbed into the Info overlay, and a new Projects overlay provides a vertical listing of all projects accessible from the header.

## Architecture

The site becomes a single-viewport carousel with two full-screen overlays:

- **Base view:** Horizontal carousel (100vh, no scroll). Header fixed on top.
- **INFO overlay:** Existing bio/skills/timeline content + footer content (contact links, email, colophon).
- **PROJECTS overlay:** Minimal archive-style table rows for all 9 projects. Clicking a row jumps the carousel to that slide. A separate arrow icon opens the external link.

## Components

### Deleted: `Footer.tsx`

All content moves into InfoOverlay. The `<Footer />` element is removed from App.tsx. The footer CSS can be removed or repurposed inside the overlay.

### Modified: `InfoOverlay.tsx`

Append a contact section below the existing skills/timeline content. Contents:

- "Let's build something." statement
- Email (click-to-copy, existing logic from Footer.tsx)
- GitHub, LinkedIn, HuggingFace links
- Colophon line ("Design + Development · Trey Lupo", fonts, copyright)

Use the existing terminal/monospace aesthetic. The contact section should feel like a natural continuation of the info panel, not a bolted-on footer.

### Created: `ProjectsOverlay.tsx`

Full-screen overlay, same DOM pattern as InfoOverlay:
- `position: fixed; inset: 0` with semi-transparent background
- `[ CLOSE ]` button top-right
- Escape key closes
- Focus trap (same pattern as InfoOverlay)
- Scrollable content area

Content is a minimal table of all 9 projects (using `CAROUSEL_PROJECTS` from constants). Each row contains:

| Element | Content | Style |
|---------|---------|-------|
| Index | `P/01` | `--accent` color, `--text-label` size |
| Title | `nspb-api` | `--text-primary`, `--text-nav` size |
| Category | `//api engineering` | `--accent-dim`, `--text-label` size |
| Metric | `60+` | `--text-primary`, tabular-nums |
| Arrow | `→` | `--accent-dim`, opens external link |

**Row click behavior:**
- Clicking anywhere on the row (except the arrow) closes the overlay and jumps the carousel to that project's slide.
- The `→` arrow is a separate `<a>` element that opens `githubUrl || liveUrl` in a new tab. It stops event propagation so it doesn't also trigger the row click.

**Props needed:** `isOpen`, `onClose`, `onGoToSlide: (index: number) => void`

### Modified: `App.tsx`

- Remove `Footer` import and `<Footer />` from JSX
- Add `projectsOpen` state (boolean, default false)
- Add `<ProjectsOverlay>` to JSX
- Expose a `goToSlide` callback that the ProjectsOverlay can call

State shape:
```
loaded: boolean
infoOpen: boolean
projectsOpen: boolean
```

The `goToSlide` function needs to reach into the Carousel's `useCarousel` hook. Two options:

**Option A (recommended): Lift `goTo` via callback ref.** Carousel calls a registration callback on mount that gives App access to the `goTo` function. App passes it to ProjectsOverlay.

**Option B: Lift activeIndex state to App.** Move `useCarousel` from Carousel into App, pass everything down. More invasive, unnecessary for a single callback.

Go with Option A. Carousel accepts an `onRegisterGoTo` prop, calls it with the `goTo` function on mount. App stores it in a ref.

### Modified: `Carousel.tsx`

- Accept `onRegisterGoTo?: (goTo: (index: number) => void) => void` prop
- Call `onRegisterGoTo(goTo)` inside a useEffect on mount
- Re-add `goTo` to the destructured return from `useCarousel` (it was removed earlier as unused)

### Modified: `Header.tsx`

- PROJECTS button changes from `<a href="#projects">` to `<button onClick={onProjectsClick}>`
- Accept new prop: `onProjectsClick: () => void`
- Mobile nav does the same: the PROJECTS link becomes a button that calls `onProjectsClick`

### No change: `useCarousel.ts`

Already exports `goTo`. No modifications needed.

## CSS

### New styles for ProjectsOverlay

Reuse the overlay pattern from InfoOverlay (`.info-overlay` styles). New class names:

- `.projects-overlay` — same layout as `.info-overlay`
- `.projects-close` — same as `.info-close`
- `.projects-header` — "PROJECTS /2024–26" label at top
- `.projects-list` — flex column container
- `.projects-row` — grid row, same structure as the old `.archive-row`
- `.projects-row` hover/focus states — same dim/highlight pattern as old archive

### Styles to remove

- `.footer`, `.footer-*` CSS blocks — no longer needed in the main page
- `.archive`, `.archive-*` CSS blocks — already dead, can be cleaned up

### Styles to add to InfoOverlay

- `.info-contact` — contact section within the overlay
- Reuse `.footer-email`, `.footer-link` class patterns but scoped inside the overlay

## Accessibility

- Both overlays trap focus (existing pattern in InfoOverlay)
- Both close on Escape
- Both return focus to the trigger element on close
- Project rows are keyboard navigable (Enter to jump to slide, arrow link is a separate tab stop)
- `aria-modal="true"` on both overlays
- Only one overlay open at a time (opening PROJECTS while INFO is open should close INFO first, or just prevent it — simplest is to prevent)

## Data Flow

```
App
├── Header (onInfoClick, onProjectsClick)
├── Carousel (onRegisterGoTo → stores goTo in App ref)
├── InfoOverlay (isOpen, onClose) — now includes contact/footer content
└── ProjectsOverlay (isOpen, onClose, onGoToSlide → calls stored goTo ref)
```

User clicks PROJECTS → `projectsOpen = true` → overlay renders → user clicks row 4 → `onGoToSlide(3)` → App calls `goToRef.current(3)` → carousel animates to slide 4 → `projectsOpen = false` → overlay closes.
