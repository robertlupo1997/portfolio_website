# Handoff: Audit the Terminal Carousel Redesign (2026-06-14)

## For the auditing session

You are auditing a freshly built terminal carousel redesign of treylupo.com. The implementation was just completed and needs a visual/UX audit before polish work begins. **Do not fix anything** — produce a detailed findings document listing everything that looks off, feels wrong, or doesn't match the spec.

---

## How to view the site

```bash
cd /home/tlupo/projects/portfolio_website/rlupo-portfolio
npm run dev
# Opens at http://localhost:3000
```

**Branch:** `redesign/invisible-frame`
**Latest commit:** `7a90ee7` — terminal carousel redesign

---

## What was built

The site was redesigned from a vertical-scroll portfolio into a horizontal carousel layout inspired by [francescomichelini.com](https://www.francescomichelini.com/). The aesthetic is "terminal/hacker" — Departure Mono pixel font, olive background, red-coral accents, scanline overlays.

### Page structure

1. **Preloader** — terminal boot sequence: "INITIALIZING...", percentage counter, "READY." with blinking cursor
2. **Fixed nav** — "TREY LUPO" wordmark left, `[ PROJECTS ]` `[ INFO ]` bordered pill buttons right, backdrop blur
3. **Carousel** — 3 featured projects (nspb-api, FerroML, Revenue Forecast), each full-viewport:
   - Left 45%: terminal readout panel (`$ cat project-name --verbose`, field labels, description, stack, `[ VISIT -> ]` button)
   - Right 55%: project image with scanline overlay and clip-path reveal animation
4. **Archive list** — 6 remaining projects in P/04–P/09 rows with focus/dim hover
5. **Footer** — "Let's build something." + email (click-to-copy) + social links + colophon
6. **Info overlay** — triggered by `[ INFO ]` button, full-screen: bio left, skills/timeline as terminal output right, `[ CLOSE ]` button, ESC to dismiss

### Navigation methods

- PREV/NEXT buttons at bottom center
- Keyboard left/right arrows
- Pointer swipe with velocity detection
- Dot indicators

### Design spec

Full spec at: `docs/superpowers/specs/2026-06-14-terminal-carousel-redesign.md`
Creative vision at: `docs/superpowers/specs/2026-06-14-creative-vision.md`

---

## What to audit

Open the site in a browser and go through every section. For each finding, note:
- **What you see** (screenshot description or element reference)
- **What's wrong** (misalignment, wrong color, missing element, bad spacing, etc.)
- **Severity** (critical = broken/unusable, major = clearly wrong, minor = polish)

### Specific areas to check

1. **Preloader** — Does the boot sequence play correctly? Does "READY." appear with a blinking cursor? Does it fade out smoothly?

2. **Header/Nav** — Is the backdrop blur working? Do the pill buttons hover correctly (fill accent, invert text)? Does "TREY LUPO" text scramble on hover? Is spacing balanced?

3. **Carousel slides** — For each of the 3 slides:
   - Does the terminal text stagger in line-by-line?
   - Does the image reveal with a clip-path animation (left to right)?
   - Is the split ratio right (terminal ~45%, image ~55%)?
   - Are the scanlines visible on the image?
   - Does the blinking cursor appear on the active slide?
   - Is the `[ VISIT -> ]` button styled and clickable?
   - Does the terminal readout have the right data (title, class, status, metric, description, stack)?

4. **Carousel navigation** — Do PREV/NEXT work? Do dots update? Do keyboard arrows work? Is PREV disabled on slide 1? Is NEXT disabled on slide 3? Is the transition smooth (350ms ease-out)?

5. **Archive list** — Do all 6 projects render? Does focus/dim work (siblings dim on hover)? Does the arrow shift right on hover? Are the P/04–P/09 indices correct?

6. **Info overlay** — Does it open from `[ INFO ]`? Does it animate in (scale 0.98 → 1)? Is the two-column layout correct? Does `[ CLOSE ]` work? Does ESC work? Does focus trap work (tab stays inside)?

7. **Footer** — Does click-to-copy email work? Do social links open in new tabs? Is the colophon correct ("Departure Mono · Inter")?

8. **Color palette** — Is the background olive (#474741), not black? Is accent red-coral (#E85D3A)? Is the palette consistent throughout?

9. **Typography** — Is Departure Mono loading and rendering correctly (should look pixelated/bitmap-like)? Is Inter used for body/description text? No leftover fonts from old design?

10. **Mobile (resize to 375px)** — Does the carousel stack vertically? Does the hamburger menu work? Is the info overlay single-column? Does the archive list reflow?

11. **General feel** — Does it feel like a terminal? Is the olive + red-coral palette working? Anything feel generic or "AI slop"? Any elements that feel out of place with the terminal aesthetic?

---

## Known issues / user feedback already given

The user has already flagged these — don't re-report them, but do note if they're worse than expected:

- **PREV/NEXT buttons** should be moved to the left side of the screen, not covering the images
- **Images are too large** — should be shrunk so they don't dominate; more minimal like the Michelini reference
- **All 9 projects should be in the carousel** (not just 3 featured + 6 archive) — this is a future change, not a bug
- **Possible future layout change** — about section at top (like elliott.mangham.dev), carousel below. Not for this audit.

---

## Output format

Write your findings to: `thoughts/handoffs/2026-06-14-audit-findings.md`

Structure:
```markdown
# Audit Findings — Terminal Carousel (2026-06-14)

## Critical (broken/unusable)
- ...

## Major (clearly wrong)
- ...

## Minor (polish)
- ...

## What's working well
- ...
```

---

## Reference materials

| Path | What it is |
|------|-----------|
| `docs/superpowers/specs/2026-06-14-terminal-carousel-redesign.md` | Full design spec |
| `docs/superpowers/specs/2026-06-14-creative-vision.md` | Creative vision + decision rationale |
| `design-extract-output/francescomichelini-com-*` | Extracted design tokens from reference site |
| `thoughts/reference-screenshots/*.png` | Screenshots of Michelini's reference site |
