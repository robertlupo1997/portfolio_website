---
date: 2026-07-08
type: prompt
topic: "Next autonomous Fable design pass on treylupo.com"
status: ready
note: >
  Reconstructed 2026-07-08 from the spec in
  thoughts/handoffs/2026-07-08_09-36-54_fable-design-pass-verification-repo-split-and-next-prompt.md
  (the original draft lived only in that session's transcript). Methodology adapted from
  fable-25.netlify.app/guide, scoped for one real professional portfolio instead of 25
  disposable fictional sites. Encodes the lessons from the 2026-07-08 verification session:
  the mobile grid-row bug only a rendered screenshot caught, and the value of an agent that
  bounds its own confidence.
---

# Prompt: Fable design pass N+1

Paste everything below the line into a fresh Fable session, from the repo root of the
**canonical clone** (check `HANDOFF.md` for which clone that is before starting).

---

You have full design ownership of my portfolio site (`rlupo-portfolio/`, React 19 + Vite +
TypeScript + GSAP, deployed at treylupo.com). Your predecessor's pass and its rationale are
in `thoughts/design/2026-07-07-fable-design-pass.md` — read it first; it explains what was
changed and, more importantly, what it explicitly could not verify.

## Hard constraints (non-negotiable)

1. **Content truth.** `constants.ts` is the source of truth for every project fact, metric,
   and claim. You may rewrite copy for punch, but every statement must be derivable from
   facts already in the dataset. Never invent numbers, capabilities, or outcomes. The
   audience is a technical hiring manager who will check.
2. **WCAG AA.** Text contrast ≥ 4.5:1 (small) / 3:1 (large). The current tokens
   (`--accent-text: #FA9E78`, `--ink: #262622` in `styles/index.css`) were audited to pass —
   if you change colors, show the recomputed ratios in your changes doc.
3. **Build and tests stay green.** `npm run build` and `npm run test` (9 files / 40 tests as
   of 2026-07-08) must pass before you call any pass complete. If you change behavior, update
   or add tests.
4. **Accessibility semantics survive.** The page keeps exactly one `<h1>` (the hero name),
   slide titles as `<h2>`, the reduced-motion path in `useTextScramble.ts`, and the
   `aria-live` announcements in `AskPanel.tsx`. Improve these; never regress them.

Everything aesthetic — layout, type scale, motion, color within the AA constraint, what to
cut, what to amplify — is your call. Be opinionated. Do not ask permission for taste.

## Method (adapted from the fable-25 guide)

- **Minimum 3 full passes.** A pass = change → build → screenshot → written self-critique →
  next change. Do not stop at one round of polish.
- **One deliberate complexity upgrade per pass.** Each pass must attempt something a
  template wouldn't — a motion idea, a layout inversion, a typographic move — not just
  tightening what exists.
- **The self-critique loop must use real rendered screenshots.** Before you claim any
  critique pass happened, **verify you can actually capture screenshots** (Playwright against
  the dev server on :3000). If you cannot — no browser in your sandbox, capture fails,
  whatever — say so explicitly and mark every visual claim as unverified instead of
  pretending. Your predecessor's biggest miss (an image painting over the signature title on
  mobile) was invisible in the diff and only appeared in a rendered 390×844 screenshot.
- **Screenshot at minimum:** desktop (1440×900), mobile (390×844), and a short viewport
  (~1280×620). Capture with `reducedMotion: 'reduce'` — the TextScramble caught mid-flight
  looks like garbled text and will send you chasing phantom bugs.
- **Playwright gotchas in this app:** all 8 slides are mounted simultaneously and moved by a
  track transform, so bare `querySelector` locators like `.terminal-index` match every slide
  — you cannot read "the active slide" that way. Rapid synthetic keypresses get dropped by
  the 650ms `isTransitioning` guard; press → wait ~600ms → screenshot → next press is the
  reliable rhythm.

## Known open items you inherit

- Touch-scroll vs. horizontal-swipe on the mobile scrollable text column
  (`.carousel-slide-terminal`, `overflow-y: auto`) has **never** been verified on a real
  device. If you can't test it either, keep it flagged — do not silently drop it.
- `CLAUDE.md`'s tech-stack note still lists "Icons: Lucide React"; the dependency was
  removed 2026-07-08. Fix stale docs you notice.

## Deliverable

Besides the working tree changes: write `thoughts/design/<date>-fable-design-pass.md` in the
style of your predecessor's — what changed and why, per pass; the self-critique that drove
each next pass; recomputed contrast math for any color change; and a closing section that
**bounds your confidence**: exactly what you verified (with the command or screenshot that
proves it) and exactly what you could not. An honest "I couldn't check X" is worth more than
a confident claim — the next session's verification pass will look hardest precisely where
you admit you couldn't see.

Do not push. Commit locally if git works in your sandbox; otherwise leave the diff clean and
reviewable.
