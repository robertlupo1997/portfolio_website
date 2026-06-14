# Handoff: Structural Redesign Brainstorm — Continue Logo + Carousel Design (2026-06-13)

## For the next session

You are in the middle of brainstorming a major structural redesign of treylupo.com. The reference site is **https://www.francescomichelini.com/** (Folio/23 by Francesco Michelini, designed by Unlearn Studio). The goal is to match Michelini's site structure, not just its motion language.

---

## Current state

**Branch:** `redesign/invisible-frame`
**Latest commit:** `e52be41` — motion language implementation (preloader, focus/dim, SVG cursor, timing tokens)
**Build status:** Clean
**Dev server:** `cd rlupo-portfolio && npm run dev` → http://localhost:3000

### What's been done this session

1. **Motion language fully implemented** — preloader (percentage counter → text scramble → content reveal), project list focus/dim hover (pure CSS), SVG viewfinder cursor with mix-blend-mode: difference, timing token overhaul (225ms/300ms, cubic-bezier(0.4, 0, 0.2, 1)), stripped all over-animation (scroll staggers, LineReveal on project titles, hero entrance animations)

2. **Cascadia Mono added** — installed via `@fontsource-variable/cascadia-mono`, added as `--font-editorial` CSS variable, currently applied to `.hero-name` and `.hero-folio-label`. This is experimental — user is evaluating whether it works as a display face. NOT committed yet.

3. **"Folio" renamed to "Portfolio"** — Hero label now says "Portfolio /2026", project list section label says "Portfolio /2026". NOT committed yet.

4. **Brainstorming started, paused mid-process** — The user wants a structural redesign to match Michelini's architecture. We got through the logo design phase but the user pivoted to working with Claude Design (claude.ai artifacts) to design the logo visually. The brainstorm needs to resume from after the logo is finalized.

### What has NOT been done — remaining brainstorm topics

1. **Logo** — User is designing this in Claude Design right now. It should be a custom logotype built from thick diagonal strokes (like Michelini's — NOT a font, a custom SVG mark). The word "LUPO" rendered as an abstract slash-mark with the full name in small text below + a row of forward slashes as decoration. When the user returns, ask to see what they came up with.

2. **Horizontal carousel architecture** — Michelini's homepage is a horizontal project carousel, not a vertical scroll. This is the biggest structural change. Need to brainstorm:
   - Horizontal scroll/swipe navigation vs. arrow/dot navigation
   - How many projects per view
   - Project card layout (large image + metadata)
   - The "VISIT" button with periodic text scramble
   - Whether to keep any vertical sections (about, footer) or go fully horizontal
   - Mobile behavior (horizontal swipe? or fall back to vertical?)

3. **Project imagery** — The carousel needs strong visuals for each project. Currently projects have optional `imageUrl` in constants.ts but most are text-only. Need to discuss what images to create/use.

4. **Navigation structure** — Michelini has: logo (top-left), PROJECTS + INFO buttons (top-right), theme toggle. Our current nav has: "Trey Lupo" text (left), Projects + Info links (right). Need to redesign with the new logo.

5. **Info/About page** — Michelini's /info is a separate page-like view. In our SPA, this could be a full-screen overlay or a horizontal section. Need to decide.

---

## Reference materials

| Path | What it is |
|------|-----------|
| `thoughts/reference-screenshots/*.png` | 16 screenshots of Michelini's site across themes |
| `thoughts/animation-study.md` | Full live browser observation notes |
| `design-extract-output/francescomichelini-com-*` | Extracted design tokens, motion tokens, design language |
| `.superpowers/brainstorm/128213-1781402399/content/` | Visual companion mockups from this brainstorm session |

## Key design decisions (locked)

- Dark theme only (no theme toggle)
- Single-page app (React SPA, not multi-page like Michelini's Nuxt site)
- Preloader plays once on initial load only
- Project content from `constants.ts` — no work-derived projects
- Position Trey as "the AI guru for any company"

## Key design decisions (open — need brainstorming)

- Logo: pending Claude Design output from user
- Horizontal vs. vertical: user wants horizontal carousel like Michelini
- Typography: Cascadia Mono is installed for evaluation as display/editorial face — user hasn't committed to it yet
- "Portfolio /2026" vs "Folio /2026" vs something else
- How to handle the about/info section in a horizontal layout

## Uncommitted changes

The following are staged but not committed:
- Cascadia Mono font addition (`--font-editorial` variable, applied to hero name + folio label)
- "Folio" → "Portfolio" rename in Hero.tsx and ProjectList.tsx

These are experimental. Commit or revert based on the design direction that emerges from the continued brainstorm.

## Typography reference

**Michelini's site uses:**
- **Favorit** (by Dinamo) — primary workhorse, body/labels/UI
- **Monorama** (by Pangram Pangram) — display/logo, italic treatments
- **Neue Haas Grotesk Text Pro** — titles, certain body text
- All weight 400 — hierarchy from size and color only

**Our site currently uses:**
- **Space Grotesk** — display (`--font-display`)
- **Inter** — body (`--font-sans`)
- **JetBrains Mono** — labels/mono (`--font-mono`)
- **Cascadia Mono Variable** — experimental editorial (`--font-editorial`, uncommitted)

## The prompt written for Claude Design (logo)

> Design a custom logotype/wordmark for "LUPO" (or "TREY LUPO") inspired by the logo in the attached reference screenshots. The reference logo is built from thick diagonal strokes at a consistent italic angle — the letterforms are constructed from heavy parallelogram bars, almost like speed lines or a stencil. It's not a font, it's a custom-drawn mark.
>
> Key characteristics from the reference:
> - Thick, bold strokes (not thin lines)
> - Consistent italic/oblique angle across all letters
> - Letters are somewhat abstracted but still readable
> - Below the mark: the full name in small monospace text + a row of forward slashes as decoration
> - Rendered as a flat single-color mark (works in light or dark on contrasting background)
> - Should feel industrial, mechanical, precise — like it was engineered, not drawn
>
> Context: This is for a personal portfolio site for an AI/ML engineer. Dark background (#0A0A0B), light text (#E8E5DF). The logo sits in the top-left of a fixed nav bar at roughly 200px wide.

The user cropped Michelini's logo from the reference screenshots to feed into Claude Design.

## Resume instructions

1. Ask the user what they came up with in Claude Design for the logo
2. Resume the brainstorm from topic #2 (horizontal carousel architecture)
3. Use the superpowers:brainstorming skill — visual companion recommended for carousel layout mockups
4. After all topics are covered, write the design spec and transition to writing-plans
