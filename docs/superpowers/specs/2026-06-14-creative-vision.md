# Creative Vision — treylupo.com Terminal Carousel Redesign

**Date:** 2026-06-14
**Session context:** Brainstorming session resuming from handoff `thoughts/handoffs/2026-06-13-structural-redesign-handoff.md`
**Design spec:** `docs/superpowers/specs/2026-06-14-terminal-carousel-redesign.md`

---

## The North Star

A portfolio that looks like a recruiter accidentally SSH'd into a machine built by someone who clearly knows what they're doing. The site should feel like opening a terminal on a system where everything just works — clean, precise, deliberate. Not a gimmick terminal (no `ls projects` CLI game), but a real portfolio that borrows the visual language of terminals to signal technical depth.

The reference is Francesco Michelini's francescomichelini.com — an award-winning horizontal carousel portfolio built by Unlearn Studio. We take his **structural architecture** (horizontal project slides, PREV/NEXT navigation, Info overlay, no hero) and skin it with a **terminal/hacker aesthetic** inspired by Mr. Robot title cards, old BBS systems, and 90s coding culture.

## The Vibe

**"Someone who writes Rust for fun built their own portfolio and it looks exactly like you'd expect."**

- Monospace everything (Departure Mono — a pixel font that feels retro without being kitschy)
- Olive/khaki background with red-coral accents (Michelini's palette, not the typical dark-mode black)
- Scanline overlays on images (subtle, ~4% opacity — texture, not distraction)
- Blinking cursors on the active slide
- Project data rendered as terminal stdout (`$ cat nspb-api --verbose`)
- Text scramble effects on hover and transitions

This is not "developer portfolio with a dark theme." This is a system you discovered, and you're browsing its records.

## Why This Direction

### For recruiters
- Clean, navigable, professional — the carousel is intuitive (click, swipe, arrow keys all work)
- Projects are front and center with no fluff — you see what was built, the metric, and the stack immediately
- The terminal aesthetic signals "this person lives in code" without requiring the recruiter to know code

### For developers
- The terminal language is authentic — `$ cat`, `//category`, `P/01` indexing
- Departure Mono is a deliberate font choice, not a default monospace
- The details compound: scanlines, blinking cursor, text scramble, momentum-based swipe — each one says "I care about craft"

### For Trey
- Positions you as "the AI guru for any company" — the site itself demonstrates engineering taste
- The split terminal/image slide layout showcases both the technical story (left) and the visual result (right)
- Departure Mono + olive palette is distinctive — no one else's portfolio looks like this

## Key Design Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| No hero section | Land directly on first project | Michelini's approach — projects ARE the introduction. Your name is in the nav. |
| Horizontal carousel for featured only | 3 slides for featured, vertical list for archive | Full horizontal for 9 projects would be exhausting. Featured get the spotlight, archive is scannable. |
| Terminal readout, not literal terminal | Departure Mono + prompt aesthetic, no fake window chrome | A literal terminal emulator risks gimmick territory. Terminal-inspired typography stays classy. |
| Info as overlay, not section | Full-screen takeover from nav button | Keeps the main page focused on projects. Info is available but not competing for scroll space. |
| Michelini's olive palette, not dark black | `#474741` background, `#E85D3A` accent | The olive is distinctive and warmer than typical dev portfolios. It's what made the reference screenshot feel right. |
| Departure Mono as primary typeface | Pixel monospace for display/labels/nav | Fits the terminal vibe perfectly. Single weight — hierarchy from size and color only, like Michelini's site. |
| Multiple nav inputs (click, keyboard, swipe) | All methods snap to adjacent slide | Recruiter-proof — anyone can navigate regardless of device or preference. |

## Typography Philosophy

Two fonts only. Departure Mono carries the identity; Inter carries the content.

- **Departure Mono** — everything structural: nav, titles, indices, labels, buttons, terminal prompts, section headers. It's the voice of the system.
- **Inter** — everything narrative: bio paragraphs, project descriptions. It's the voice of the person behind the system.

No bold weights (Departure Mono is single-weight). Hierarchy comes from:
1. Size (large = important)
2. Color (accent = attention, dim = context)
3. Letterspacing (wider = label/category)

## Motion Philosophy

Following Emil Kowalski's design engineering framework:

- **Terminal text staggers in at 40ms per line** — feels like stdout printing to screen
- **Images reveal with clip-path** — mechanical, like a shutter opening
- **Slide transitions are crisp, not bouncy** — 350ms ease-out, no spring. Terminals don't bounce.
- **Exit is always faster than enter** — system responds instantly when you dismiss
- **Blinking cursor is the only looping animation** — everything else is triggered by user action
- **Scanlines are static texture, not animated** — the CRT reference without the performance cost

## What This Is NOT

- Not a CLI portfolio where you type commands (overplayed, inaccessible)
- Not a dark-mode-with-green-text generic dev site
- Not a direct clone of Michelini (his is Nuxt multi-page with WebGL; ours is React SPA with terminal chrome)
- Not maximalist — the terminal elements are restrained. The data speaks; the chrome frames it.

## Open Questions for Future Sessions

1. **Logo** — Custom SVG logotype for "LUPO" or "TREY LUPO" is pending. Logo.tsx exists as a geometric attempt but wasn't approved. May revisit or stay with text wordmark.
2. **Project imagery** — Revenue Forecast slide uses a placeholder image. Need to create or source proper visuals for all 3 featured projects.
3. **Sound** — A subtle terminal keystroke sound on slide transitions? Probably not, but worth considering.
4. **Preloader boot text** — The exact terminal boot sequence text needs writing. Could reference actual system output or be completely custom.
5. **Custom cursor** — Current site has an SVG viewfinder cursor. Does it fit the terminal vibe, or should it change to a block cursor / crosshair?
