# AI-section design spec — make Ask-My-Work native (Workstream C)

**Date:** 2026-07-05 · **Author:** Claude (Fable 5) for Trey · **Status:** ready for
post-Fable execution (Opus) · **Launch gate served:** (c) "AI section redesigned to match
the site vibe." Local only; NO pushes until Vercel Step 0.

**Sources:** live tokens in `rlupo-portfolio/styles/index.css` (palette :24-34, spacing
:82-90, motion :67-80, type :1-15/127-161, z :98-101); AskPanel audit (component
`components/AskPanel.tsx`, CSS block `styles/index.css:1045-1056`, mobile :1164-1167);
approved specs `2026-07-02-ask-my-work-answer-engine-design.md` (panel contract: Invisible
Frame styling) and `2026-07-03-design-upgrade-shader-first-design.md` (system contract).

## ⚠ Repo-hygiene finding (fix alongside, not blocking)

Root `DESIGN.md` is the "Precision Dark" candidate, explicitly marked **NOT ADOPTED**
(copper accent, Inter, JetBrains Mono — none of it shipped). Any agent styling against it
will produce off-brand output. Execution should regenerate `DESIGN.md` from the shipped
system (`/impeccable document`) or move the candidate to an archive path.

## Design intent

The panel IS the site's AI-engineering demo (companion spec: the new Ask-My-Work project
card). Today it reads as a bolted-on chat widget from a different site: pure-black
surfaces, raw-white borders, body-font title, off-scale padding. Native means: the same
olive monochrome instrument-case world as the rest of the site, Departure Mono labels,
the two sanctioned motion tokens, spacing snapped to the 4px scale. No new colors, fonts,
or motion primitives; identity-preservation over invention. The wow lives in the streamed,
cited answers, not the chrome (PRODUCT.md: "the frame disappears").

## Token conformance table (the core of the work)

All in `styles/index.css` unless noted. Current values verified 2026-07-05.

| # | Element (line) | Current | Becomes |
|---|---|---|---|
| 1 | Backdrop `.ask-panel` (1045) | `rgba(0,0,0,0.85)` pure black | olive-tinted dim consistent with overlays: `rgba(61,61,56,0.92)` (from `--bg-surface` #3D3D38) — match InfoOverlay's treatment family |
| 2 | Inner panel bg (1047) | `#0a0a0a` hardcoded | `var(--bg-surface)` (#3D3D38) |
| 3 | Panel border (1047) | `rgba(255,255,255,0.20)` raw white | `var(--border-emphasis)` (olive-tinted 0.20) |
| 4 | Input border (1049) | `rgba(255,255,255,0.30)` | `var(--border-emphasis)`; focus state may step to a 0.30 olive tint if contrast demands (new token `--border-focus` only if AA fails) |
| 5 | Citation border-top (1055) | `rgba(255,255,255,0.15)` | `var(--border-default)` (0.12) |
| 6 | Panel transition (1045) | `opacity 0.3s ease` | `opacity var(--duration-md) var(--ease-entrance)` |
| 7 | Inner padding (1047) | `1.5rem` (24px, off-scale) | `var(--sp-5)` (20px) — tighter fits the terminal register; `--sp-8` (32px) only if it breathes badly at 20 |
| 8 | Bar margin (1048), starters mt (1050), citations mt (1055) | `1rem` literals | `var(--sp-4)` |
| 9 | Answer/status mt (1053-1054) | `1.25rem` literal | `var(--sp-5)` |
| 10 | Starter padding (1051) | `0.35rem 0` (5.6px, off-scale) | `var(--sp-2) 0` (8px) |
| 11 | Desktop z-index (1045) | `60` hardcoded | new token `--z-panel: 60` in the :98-101 block, with a comment that sitting BELOW `--z-nav` is intentional (header stays visible over the dimmed backdrop) |
| 12 | Mobile z-index (1166) | `110` hardcoded | new token `--z-sheet: 110` beside it, comment: must clear `--z-nav` (bac35cf regression) |
| 13 | Title "ASK MY WORK" (AskPanel.tsx:111, css:1048) | `font: inherit` → Space Grotesk | `var(--font-departure)`, 12-14px, `letter-spacing: 0.08em`, `var(--text-secondary)` — matching InfoOverlay/ProjectsOverlay header labels |
| 14 | Reduced-motion inline rule (1056) | duplicate `transition: none` | delete — global block at :1215 already covers it |

## Beyond tokens (same execution pass)

- **Citations as tags:** `.ask-panel__citation` links adopt the site's tag/label
  affordance (Departure Mono 12px, `--text-secondary` → `--accent` on hover with the
  sanctioned `scaleX` sweep origin-left, `--duration-sm var(--ease-micro)`). Numbered
  `[1]`-style markers stay: they're the evidence-over-assertion signal.
- **Starter questions:** style as the terminal-list idiom used elsewhere (mono, tertiary
  → primary on hover, no card boxes). They are commands, not chips.
- **Input:** keep Space Grotesk for user-typed text (prose voice); placeholder in
  `--text-tertiary`. Caret `--accent` (the one accent moment the panel gets; ≤10%
  restrained strategy holds).
- **Answer prose:** Space Grotesk 400, `max-width: 65ch`, line-height per body. No
  entrance animation on streamed text: the stream is the motion. (Motion stays within
  the two sanctioned tokens; nothing new.)
- **Error copy** (`AskPanel.tsx`): "Something went wrong." → match site voice, state the
  fallback: "Engine unreachable. Answering from the local corpus instead." (only when
  localFallback engages; keep honest per the 6657f8e lesson).

## Non-goals

Mounting/routes, focus trap, Esc/Tab handling, SSE/client logic, rate limiting: all stay
untouched (they passed verification 2026-07-03). No layout re-architecture. No new motion
primitives, no glass, no gradients. Desktop-below-header layering stays (deliberate).

## Verification (per the verification-blind-spot lessons)

- Existing gates: unit + e2e + tsc + build.
- Real-browser walkthrough MUST re-test: mobile sheet close button above header
  (regression bac35cf), desktop open/close at dpr 1 AND 1.25, reduced-motion open/close,
  starter click → stream → citation deep-link into a carousel slide.
- Pixel check: panel bg is olive (#3D3D38), not black, in a screenshot against
  `--bg-primary` page behind — the two must read as one site.
- AA contrast: input placeholder (`--text-tertiary` on `--bg-surface`) and citation
  hover states.

## Taste question for Trey (1, non-blocking)

Backdrop treatment: olive-dim per row 1 (recommended, matches overlays), or keep a
darker-than-site backdrop for a "spotlight" feel? Row 1 assumes the former.
