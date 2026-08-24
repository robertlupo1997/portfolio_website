# Audit Findings — Terminal Carousel (2026-06-14)

Audited at `http://localhost:3000` on branch `redesign/invisible-frame`, commit `7a90ee7`.

---

## Critical (broken/unusable)

- **Slide 1 (nspb-api) missing `[ VISIT -> ]` button.** The `TerminalPanel` conditionally renders the VISIT link only when `project.githubUrl || project.liveUrl` exists. The nspb-api entry in `constants.ts` has neither property defined. Slides 2 (FerroML) and 3 (Revenue Forecast) render it correctly. Root cause is missing data, not a component bug.

- **Carousel doesn't scroll-to-top on slide change.** When the page is scrolled down (e.g. archive is visible) and you click a dot indicator or PREV/NEXT, the carousel changes slides but the scroll position stays where it is. This means you can land on a new slide seeing only the STACK line or nothing at all — the terminal readout is above the fold. The carousel section should `scrollIntoView` or lock scroll position when a slide changes.

---

## Major (clearly wrong)

- **Revenue Forecast image (slide 3) clashes with terminal aesthetic.** The pink/cyan fluid abstract art looks like a stock photo placeholder. It completely breaks the terminal/hacker vibe. The nspb-api 3D cubes and FerroML accuracy chart both fit; this one stands out as wrong. Needs a data visualization or terminal-style graphic.

- **FerroML chart image (slide 2) has cropped y-axis labels.** The model names on the left edge of the accuracy chart are cut off — "ression-", "(k=5)-", "forest-", "osting-" instead of "logistic regression", "KNN (k=5)", "random forest", "gradient boosting". The image container clips the left side. Either the image needs padding/repositioning, or the container needs `object-position` adjustment.

- **"TREY LUPO" wordmark is center-aligned, not left-aligned.** The spec says "TREY LUPO wordmark left" but it renders roughly centered in the header's left half. It should be pushed to the far left (with padding) to match the Michelini reference where the name is in the top-left corner.

- **Scanline overlay on images is too subtle or invisible.** The `.scanlines` CSS class is applied to the image containers (confirmed in `CarouselSlide.tsx`), but the effect is not perceptible at normal viewing distance on the nspb-api or FerroML images. On the dark cube image the scanlines blend into the darkness; they need higher opacity or contrast to register as a deliberate terminal CRT effect.

- **No visible clip-path reveal animation on images.** The spec calls for a left-to-right clip-path reveal when entering a slide. On slide transitions the image just appears — no directional wipe was observed. Either the animation isn't implemented, or it fires too fast to notice.

---

## Minor (polish)

- **`/26` indicator meaning is unclear.** Each slide shows `P/01  /26`, `P/02  /26`, `P/03  /26`. The `/26` appears to be the year (2026) but reads ambiguously — could be mistaken for "project 1 of 26." If it's the year, consider `'26` or just removing it. If it's a count, it's wrong (there are 9 projects, not 26).

- **PREV/NEXT and dot indicators overlap the image area.** (Already flagged by user.) The navigation controls sit at the bottom-center of the carousel, directly over the project image. On dark images they're hard to read. The user already plans to move these to the left side.

- **Images are too large/dominant.** (Already flagged by user.) The right-side image fills ~55% width and full viewport height. On the Michelini reference, images are more contained and minimal, giving the layout more breathing room.

- **No line-by-line stagger animation visible on terminal text.** The spec calls for terminal text to stagger in line-by-line when entering a slide. On both initial load and slide transitions, all terminal fields appear simultaneously. Either the stagger isn't implemented or it's too fast (< 50ms per line).

- **Header backdrop blur is hard to verify.** The header has some transparency but the blur effect isn't obviously visible when scrolled down with content behind it. It may be working but the olive background makes it imperceptible.

- **Blinking cursor position inconsistent between slides.** On slide 1, the cursor appears at the very bottom-left of the terminal panel (far below the STACK line, in isolation). On slides 2 and 3, it appears immediately after the `[ VISIT -> ]` button. Slide 1's cursor floats in empty space because there's no VISIT button — fixing the missing VISIT link will likely fix this too.

- **Archive arrow `->` hover shift not verified.** The spec mentions the arrow should shift right on hover. Static screenshots couldn't confirm this, but the archive hover focus/dim effect (siblings dim, hovered row brightens) works correctly.

- **`[ CLOSE ]` button on Info overlay has solid fill background.** The `[ CLOSE ]` button in the Info overlay renders with a solid red-coral filled background, whereas `[ PROJECTS ]` and `[ INFO ]` in the header are border-only (outlined). This inconsistency makes CLOSE look like a different design language. Consider matching the outlined pill style, or making the header pills also fill on their resting state.

- **Info overlay scroll position.** When the Info overlay is opened after scrolling down the page, the overlay content starts at the top (correct), but when closed via ESC, the page returns to a scrolled-down position showing the archive section rather than returning to the carousel.

---

## What's working well

- **Preloader sequence is excellent.** "INITIALIZING..." with a percentage counter ticking up to 100%, then "READY." in red-coral with a blinking cursor. Smooth fadeout to main content. Feels genuinely terminal.

- **Terminal readout aesthetic is strong.** The `$ cat project-name --verbose` command, field labels (TITLE, CLASS, STATUS, METRIC, STACK), and the monospace formatting sell the terminal concept well. Departure Mono's bitmap pixelation is the right choice.

- **Carousel navigation works correctly.** PREV/NEXT buttons, dot indicators, and keyboard arrow keys all function. PREV is disabled on slide 1. Dots update correctly to show the active slide.

- **Info overlay is well-structured.** Two-column layout with bio left, skills/career as terminal output right. The `$ skills --list` and `$ history --career` formatting is on-brand. ESC to dismiss works. `[ CLOSE ]` button works.

- **Archive section focus/dim hover is polished.** Hovering a project row brightens it while dimming siblings — exactly the Michelini-style interaction. All 6 projects (P/04 through P/09) render with correct indices.

- **Footer content is complete and well-formatted.** "Let's build something." heading, click-to-copy email button, GitHub/LinkedIn/HuggingFace links, and colophon with "Departure Mono + Inter" attribution.

- **Color palette is consistent.** Olive background (#474741-range), red-coral accents (#E85D3A-range) on labels, buttons, and interactive elements. No stray colors or old-design leftovers except the Revenue Forecast image.

- **Nav button hover states work.** PROJECTS and INFO fill with red-coral and invert text on hover, matching the spec.

---

## Not tested (could not verify from this session)

- **Mobile layout at 375px.** Browser resize didn't take effect on the Chrome viewport. Needs manual DevTools testing for: vertical stacking, hamburger menu, single-column info overlay, archive reflow.
- **Pointer/swipe navigation with velocity detection.** No touch simulation available.
- **Focus trap inside Info overlay.** Tab key behavior couldn't be reliably tested.
- **Click-to-copy on email.** Needs manual verification.
- **Text scramble on "TREY LUPO" hover.** The effect may fire but static screenshots can't capture the animation.
