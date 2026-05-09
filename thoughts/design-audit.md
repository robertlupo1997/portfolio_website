# Design Audit — treylupo.com Portfolio
**Date:** 2026-05-09  
**Scope:** Full codebase review — all TSX, CSS, hooks, and constants  
**Auditor:** Claude Code (Sonnet 4.6)

---

## Executive Summary

The site has strong bones: modern animation tooling (GSAP + Lenis), a disciplined dark design system, WebGL interactivity, and solid accessibility fundamentals. The craft is higher than average for a personal portfolio.

The two critical failures are (1) a broken component caused by a Tailwind/custom-CSS mismatch, and (2) severely misaligned content — the portfolio showcases six academic exercises when the user's actual best work is production-grade SDK engineering. No amount of animation polish fixes a first impression where a hiring manager reads "MIT IDSS" where they expected a differentiating metric.

---

## Section 1: Blocking Bugs

These issues will cause observable breakage in production.

### 1.1 DemoModal uses Tailwind, no Tailwind is installed
**File:** `components/DemoModal.tsx`, lines 33–84  
**Issue:** The entire DemoModal component is built with Tailwind utility classes (`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm`, etc.). The project has no Tailwind dependency (`package.json` lists only `vite`, `react`, `gsap`, `lenis`, `ogl`, `lucide-react`). These class names resolve to nothing.  
**Impact:** If a live demo link is ever added to constants.ts and wired up to DemoModal, the modal will render as an unstyled, invisible overlay. The component is dead code today only because no project currently triggers it through the UI — the `ProjectCard` component links directly to GitHub/HuggingFace rather than opening the modal.  
**Fix:** Either delete DemoModal and use direct links (current behavior is fine), or rewrite the modal using the existing custom CSS design system variables.

### 1.2 FluidGlass ignores the light theme
**File:** `components/FluidGlass.tsx`, lines 28–29; `components/Footer.tsx`, line 29  
**Issue:** FluidGlass hardcodes its WebGL background color: `bgColor = [0.039, 0.039, 0.043]` (which is `#0A0A0B`, the dark theme background). When the user switches to light mode via ThemeToggle, the FluidGlass shader continues rendering against a near-black background while the page turns `#FAFAFA`. The WebGL canvas becomes a jarring black rectangle in the footer.  
**Fix:** Read the computed CSS variable `--bg-primary` at render time and convert it to an RGB triple, or pass the current theme as a prop and derive the bgColor accordingly.

### 1.3 Scrolled header hardcodes dark background in CSS
**File:** `styles/index.css`, line 1066  
**Issue:** `.header-valiente.scrolled { background-color: rgba(10, 10, 11, 0.85); }` — this is an absolute dark color, not `var(--bg-primary)`. In light mode, scrolling causes the header to flash dark.  
**Fix:** Change to `rgba(var(--bg-primary-rgb), 0.85)` or use a separate variable like `--bg-scrolled`.

### 1.4 ScrollTrigger cleanup is too aggressive
**File:** `hooks/useScrollAnimations.ts`, lines 61–63  
**Issue:** The cleanup function calls `ScrollTrigger.getAll().forEach((trigger) => trigger.kill())`. This kills all ScrollTrigger instances globally, including those created by `ProjectsSection.tsx` (the parallax effect on each card). When React re-renders cause the hook to re-run, it nukes sibling animation state.  
**Fix:** Store refs to the specific triggers created in this hook and only kill those on cleanup:
```ts
const triggers: ScrollTrigger[] = [];
// pass `triggers.push(st)` via `onRefresh` or collect the returned trigger
return () => triggers.forEach(t => t.kill());
```

---

## Section 2: Dead Code and Unused Fields

### 2.1 Three Project fields are defined but never rendered
**File:** `types.ts` lines 12–13; `constants.ts` lines 21–83  
**Fields:** `cardColor`, `category`, `epoch`

- `cardColor` (`'coral' | 'cyan' | 'green' | 'yellow' | 'light-cyan'`) — defined in the type, populated in every project object, but no component reads it and no CSS class uses it.
- `category` (e.g., `"ML/PRODUCTION"`, `"COMPUTER VISION"`, `"DATA ANALYTICS"`) — never rendered in `ProjectCard.tsx`. The user would expect this to appear as a label on the card.
- `epoch` (e.g., `"AUG 2024"`, `"JAN 2025"`) — never rendered.

**Impact:** `epoch` and `category` would be useful signals for a hiring manager. Their absence removes context about when work was done and how to classify it. `cardColor` represents design intent that was abandoned — the scattered layout was probably meant to use per-card accent colors but the implementation stalled.

**Fix:** Either render category and epoch in `ProjectCard.tsx`, or delete the fields from the type and constants to reduce maintenance confusion. The cardColor field should be deleted unless the scattered layout design is revived.

### 2.2 FP&A filter category shows zero results
**File:** `constants.ts`, lines 10–15; `components/ProjectFilter.tsx`  
**Issue:** `PROJECT_CATEGORIES` includes `{ key: 'fpna', label: 'FP&A' }` and the filter renders it with a count badge. There are no projects with `projectCategory: 'fpna'` in the dataset. Clicking "FP&A" shows an empty grid with no empty-state message — just a blank section.  
**Impact:** This is the most embarrassing gap because FP&A is the user's actual job title. A hiring manager in finance clicks it and sees nothing.  
**Fix:** Add the real FP&A work (nspb-api, hierarchical-revenue-forecast, ironclad) to constants.ts, or suppress the filter button when count is zero.

---

## Section 3: Content Misalignment (Most Critical)

### 3.1 All six projects are academic exercises
**File:** `constants.ts`, lines 17–85  
**Current projects:** KKBOX churn (AUG 2024), Object Detection (AUG 2024), Amazon Recs (DEC 2024), FoodHub Analysis (OCT 2024), Shinkansen hackathon (JAN 2025), Life Expectancy (JUL 2024)

Every project is a university coursework exercise or MIT IDSS bootcamp assignment. The metric values are inconsistent and some are misleading:
- `"0.97 AUC"` — a real model metric, but AUC is sensitive to class imbalance and alone means little
- `"MIT 100%"` — a grade, not a project metric; reads as filler
- `"MIT IDSS"` — a credential, not a metric
- `"Regression"` — a task type, not a metric
- `"265-490ms/img"` — an inference latency range, which is actually meaningful

**The user's real work that belongs here:**
- **nspb-api** — 60+ endpoint Oracle EPM Cloud SDK, built solo in TypeScript. This is the actual differentiator: production SDK engineering at an FP&A firm.
- **ferroml** — AutoML pipeline in Rust. Demonstrates systems programming and ML simultaneously.
- **ironclad** — Construction cost estimation AI. Applied ML in a real business domain.
- **hierarchical-revenue-forecast** — Production multi-LOB forecasting. This is precisely what FP&A hiring managers want to see.

**Fix:** Replace or supplement the six academic projects with the four production projects above. The category filter (`fpna`, `ml`) maps directly onto these. Academic projects can remain as secondary cards once the production work is front and center.

### 3.2 About bio undersells the actual work
**File:** `components/About.tsx`, lines 119–128  
**Current bio:**
> "Corporate FP&A Analyst at Franklin Street in Tampa. I build dashboards, automate reports, and use AI tools to make financial analysis faster."

This accurately describes a mid-level analyst. It says nothing about building a 60-endpoint SDK, shipping a Rust ML framework, or engineering AI pipelines. The second paragraph mentions "Python automation tools" at Origin Construction — the actual accomplishment was building nspb-api.

**Fix:** The about statement `"I make financial data useful."` (line 115) is strong. The bio paragraphs should be rewritten to reference the SDK, the multi-language stack (TypeScript, Rust, Python), and the production scope of the work.

### 3.3 Skills list omits the actual differentiators
**File:** `components/About.tsx`, lines 8–21  
**Current skills:** `['Python', 'SQL', 'Excel', 'Power BI', 'Machine Learning', 'LightGBM', 'Scikit-learn', 'Pandas', 'FastAPI', 'React', 'Claude/AI Tools', 'Financial Modeling']`

Missing: Rust, TypeScript, Oracle EPM Cloud, SDK design, REST API design, OGL/WebGL (which the site itself uses). These are all actual competencies demonstrated by the codebase or by nspb-api. The current list reads as a generic data analyst's resume.

---

## Section 4: Visual Design

### 4.1 Typography — mostly good, one concern
**File:** `styles/index.css`, lines 36–37, 434–439  
The type scale is sensible: Inter for body, JetBrains Mono for meta/labels, 0.85 line-height on the hero name. The `--text-hero: clamp(4rem, 12vw, 10rem)` range is appropriate — not overstated.

**Concern:** The hero role text (`"FP&A Analyst · Data Scientist"`) is set in Inter at `var(--text-xl)` (1.25rem) at `var(--text-secondary)` color (`#888899` dark, `#555566` light). On the dark background this is `#888899` on `#0A0A0B`. Computed contrast ratio is approximately 4.3:1, which passes AA for normal text but is at the lower edge. On light theme, `#555566` on `#FAFAFA` is approximately 5.9:1 — fine.

**Concern:** Section headings ("WORK", "ABOUT") use `TextScramble` which renders in `var(--font-mono)` (line 1224: `.text-scramble { font-family: var(--font-mono); }`). This means the section heading font does not match the body heading font. The hero name uses Inter (no mono class), but "WORK" and "ABOUT" render in JetBrains Mono. This is an intentional design choice but creates inconsistency in heading hierarchy.

### 4.2 Color system — solid with one gap
**File:** `styles/index.css`, lines 7–88  
The color system is disciplined: two accent colors (electric blue `#0066FF`, teal `#00D4AA`), three background steps, three text weights, two border opacities. The light theme overrides are complete.

**Gap:** The `--accent-orange: #FF6B35` variable (line 25) is declared but never used in any CSS rule or component. It appears to be a remnant of an earlier design. Dead variables should be removed to prevent future confusion.

**Good:** The filter button active state uses `color: var(--bg-primary)` (line 1874) rather than hardcoded black, so it works correctly in both themes.

### 4.3 Spacing — consistent
The spacing scale (`--space-xs` through `--space-4xl`) is used consistently. Section padding uses `--space-section: clamp(4rem, 10vh, 8rem)`. No egregious inconsistencies found.

### 4.4 Project card information density is too low
**File:** `components/ProjectCard.tsx`, lines 102–148  
Each card shows: a sequential number, a title, one metric, and one or two links. There is no description, no technology stack, no date, no category label. For production projects like nspb-api (which has a story worth telling), this is insufficient. The metric field is doing all the differentiation work and it is inconsistently populated.

The card image area (`height: 280px` at desktop) takes up more than half the card height. Six of six projects use real photos (travel photography, medical stock imagery, heatmap screenshots). These images convey subject matter aesthetics, not engineering quality. For a dev/engineering portfolio the image should communicate the artifact, not the domain.

---

## Section 5: Interaction Design

### 5.1 GSAP usage — correct but one conflict
**Files:** `hooks/useScrollAnimations.ts`, `components/ProjectsSection.tsx`, `components/About.tsx`  
The GSAP integration is solid. Lenis is properly connected to ScrollTrigger via the `scroll` event (useLenis.ts line 23). The easing choices are modern:
- `power3.out` for fade-ups — appropriate
- `elastic.out(1, 0.5)` for card mouse-leave — appropriate for the magnetic snap-back
- `power2.out` for card mouse-move — appropriate

**Issue already noted in Section 1.4:** The global cleanup in useScrollAnimations kills triggers owned by ProjectsSection. This is the only correctness problem with the animation system.

### 5.2 Parallax cards and magnetism simultaneously
**File:** `components/ProjectsSection.tsx`, lines 66–95  
Each card has two simultaneous GSAP transforms: a scroll-based parallax (`gsap.to(card, { y: ... })` on scrub) and a mouse-based magnetic offset (`gsap.to(card, { x: deltaX, y: deltaY })` on mousemove). These animate the same GSAP `y` property. The mousemove `y` target and the scroll scrub `y` target will conflict — GSAP will take the most recently set value. Result: when the user mouses over a card mid-scroll, the parallax position resets.

**Fix:** Separate these into x/y (magnetism) and a wrapper element `y` (parallax). Use a parent/child separation: the wrapper drives parallax, the card itself drives magnetism only in `x` and a small `y` that is reset to zero on leave.

### 5.3 Custom cursor
**File:** `components/CustomCursor.tsx`  
The cursor implementation is clean: lerp at 0.15, three states (default, hover, card). The `mix-blend-mode: difference` on default state is a classic choice. The `cursor-plus` state (showing a crosshair on project cards) is well-intentioned but the crosshair currently does nothing — there is no action on clicking the card that the custom cursor is hinting at. In the old horizontal-scroll layout this may have meant "open project". Now it just adds visual noise.

**Fix:** If the plus cursor is meant to indicate "view project," wire up click to open GitHub or a details view. Otherwise remove the cursor-plus state.

### 5.4 Text scramble — applied inconsistently
**Files:** `components/Hero.tsx`, `components/Header.tsx`, `components/ProjectsSection.tsx`, `components/About.tsx`  
Scramble is applied to: "TREY" and "LUPO" (hero), nav links on hover (header), "WORK" (projects section heading), "ABOUT" (about heading). It is a distinctive effect that works well for proper nouns and section headers.

**Issue:** The scramble character set includes numerals (`0123456789` in `useTextScramble.ts` line 16) but the hero name "TREY LUPO" contains only alpha characters. The numerals during scramble look wrong — a name scrambling to `7R3Y` reads as leetspeak rather than a cipher effect. The Header's nav uses `ABCDEFGHIJKLMNOPQRSTUVWXYZ` only (Header.tsx line 8), which is the right choice.  
**Fix:** Remove numerals from `DEFAULT_CHARS` in `useTextScramble.ts` line 16, or use an alpha-only set for the hero component.

### 5.5 Desktop nav auto-collapse is confusing
**File:** `components/Header.tsx`, lines 113–120  
When the user scrolls past 50% of viewport height, the left-nav collapses to a 4-line hamburger icon. This is an unusual convention and the 4-line hamburger (lines 177–180) is non-standard — standard hamburger is 3 lines. More importantly, the hamburger animation CSS only targets `:nth-child(1)` through `:nth-child(3)` (CSS lines 943–953), meaning the 4th line won't animate on open.  
**Fix:** Use 3 lines for the hamburger. The auto-collapse behavior is a reasonable editorial choice but the hamburger should follow the standard 3-line convention to be immediately recognizable.

---

## Section 6: UX and Accessibility

### 6.1 Accessibility foundations are strong
The following are implemented correctly and should be preserved:
- **Skip link** (`App.tsx` line 22, CSS lines 1972–1989) — properly hidden until focused
- **`prefers-reduced-motion`** — comprehensive, covers GSAP, Lenis, CSS animations, and parallax (CSS lines 2001–2041)
- **ARIA roles** — `role="tablist"` / `role="tab"` / `aria-selected` on filter buttons (ProjectFilter.tsx); `role="progressbar"` / `aria-valuenow` on scroll progress (ScrollProgress.tsx); `aria-label` on hamburger and theme toggle
- **`aria-hidden="true"`** on FluidGlass (decorative WebGL)
- **Mobile overflow lock** when nav is open (Header.tsx lines 139–147)
- **Focus-visible ring** using `--accent-teal` on all interactive elements

### 6.2 Empty state missing for filtered categories
**File:** `components/ProjectsSection.tsx`, line 117  
When a filter returns zero results (the FP&A category today), the grid renders empty with no message. A brief "No projects in this category yet." would be more professional.

### 6.3 Project images have no meaningful alt text
**File:** `components/ProjectCard.tsx`, line 107  
`<img src={project.imageUrl} alt={project.title} loading="lazy" />` — the alt text is the project title (e.g., "KKBOX CHURN PREDICTION"). This is acceptable but the images are stock/decorative; `alt=""` with `role="presentation"` might be more semantically correct, since the card title already labels the content and the image is purely visual context.

### 6.4 No description visible in card, category missing
**File:** `components/ProjectCard.tsx`, lines 102–148  
A screen reader traversing project cards hears: sequential number, title, optional metric, "GitHub" link, optional "Live Demo" link. There is no context about what the project does. For a 60-endpoint Oracle EPM SDK this is particularly harmful — the title "NSPB-API" means nothing without a one-line description.  
**Fix:** Add a `description` field to the `Project` type and render it in the card.

### 6.5 Smooth scroll via `scrollIntoView` conflicts with Lenis
**File:** `components/SectionPagination.tsx`, line 43  
`element.scrollIntoView({ behavior: 'smooth' })` uses native smooth scroll. Lenis overrides `scroll-behavior: auto` and manages scrolling itself. Using native smooth scroll alongside Lenis can cause double-animation. The scroll in Header.tsx line 154 uses `window.scrollTo({ behavior: 'smooth' })` — same issue.  
**Fix:** Replace with `lenis.scrollTo(element)` (Lenis provides this API). The `useLenis` hook returns the lenisRef — expose it via context or pass it down.

---

## Section 7: Performance

### 7.1 FluidGlass runs 70 GPU draw calls per animation frame
**File:** `components/FluidGlass.tsx`, lines 239–285  
The fluid simulation runs 10 iterations per frame (line 239: `const iterations = 10`), each iteration executing 7 render passes (fluidVelocity, velocityToPressure, velocityCorrection, advection×2, reactionDiffusion, plus the final copy). That is 70 draw calls per frame, plus the background and glass shading passes = 72 draw calls at 60fps = 4,320 draw calls per second.

There is no mobile detection to reduce this. The IntersectionObserver gates initialization but does not pause the RAF loop when the footer scrolls out of view — once initialized, the simulation runs continuously even when the user is at the top of the page.

**Fix:**
1. Reduce `iterations` to 4–6 on mobile (detect via `navigator.maxTouchPoints > 0`)
2. Pause the RAF loop when the footer is not visible — the IntersectionObserver already sets `isVisible` but it only gates initialization; add a `paused` flag that stops RAF when `isVisible` is false
3. Consider skipping FluidGlass entirely on low-end devices (GPU memory < 2GB, which is detectable via `renderer.gl.getParameter(renderer.gl.MAX_TEXTURE_SIZE) < 4096`)

### 7.2 Scattered grid layout breaks at 7+ projects
**File:** `styles/index.css`, lines 1272–1297  
The CSS grid positions `.project-card-wrapper-1` through `.project-card-wrapper-6` explicitly. There is no `.project-card-wrapper-7` rule. Adding a seventh project to constants.ts will place it in the default grid flow, misaligning the entire scattered layout. The layout assumes exactly 6 cards.

**Fix:** If the project count will change (which it should), either:
- Use `nth-child` patterns with a repeating sequence instead of per-card classes
- Or document the 6-card constraint prominently in CLAUDE.md so it's not accidentally broken

### 7.3 `will-change: transform` on every card
**File:** `styles/index.css`, line 1336  
`.project-card-wrapper { will-change: transform; }` — this is applied unconditionally to all six wrappers. `will-change` creates a new compositing layer for each element. Six compositing layers for static elements (when not being animated) consumes GPU memory unnecessarily. Apply it dynamically only during animation using JS: `card.style.willChange = 'transform'` on mouseenter, remove on mouseleave.

---

## Section 8: Anti-patterns Checklist

| Pattern | Present? | Notes |
|---|---|---|
| Overstated hero font | No | `clamp(4rem, 12vw, 10rem)` is proportionate |
| Gray-on-color text issues | Minor | Hero role text at ~4.3:1 on dark; passes AA but marginal |
| Excessive card usage | Yes | Service cards in About are unnecessary cards-for-cards'-sake |
| Dated easing (linear, ease-in-out generic) | No | Easing choices are modern throughout |
| Generic AI-generated aesthetic | Partial | SVG overlays on cards (ProjectOverlay) feel procedural |
| Scroll progress bar | Present | Fine, but it's a common portfolio cliche |
| Text scramble on everything | Borderline | Used on 6 elements — at the edge of overuse |
| Custom cursor | Present | Works, but cursor-plus state lacks a wired action |
| Fake Mac OS window chrome in modal | Yes | DemoModal lines 42–46 have the red/yellow/green dots — a heavy cliche |

---

## Section 9: Prioritized Recommendations

### Priority 1 — Content (do first, highest ROI)
1. Add nspb-api, ferroml, ironclad, hierarchical-revenue-forecast to `constants.ts` with proper categories (`fpna`, `ml`). Add a `description` field to the `Project` type.
2. Rewrite the About bio paragraphs to lead with the SDK and production scope.
3. Add Rust, TypeScript, Oracle EPM to the skills list. Remove or deprioritize Excel and Power BI (they read as junior).
4. Normalize the `metric` field: every project should show a technical metric, not a credential.

### Priority 2 — Bugs (do before any demo to stakeholders)
5. Fix the ScrollTrigger global cleanup (Section 1.4) — kill only owned triggers.
6. Fix FluidGlass light theme (Section 1.2) — derive bgColor from CSS custom property.
7. Fix the scrolled header hardcoded background (Section 1.3).
8. Delete or properly implement DemoModal (Section 1.1).

### Priority 3 — Layout / Interaction
9. Replace the hardcoded 6-card grid positioning with an `nth-child`-based repeating pattern so the layout can accommodate the new projects.
10. Add a `description` field to ProjectCard and render category + epoch.
11. Fix the parallax/magnetism `y` property conflict (Section 5.2).
12. Replace `scrollIntoView` / `window.scrollTo` with `lenis.scrollTo()` (Section 6.5).
13. Wire up the cursor-plus click action or remove the state (Section 5.3).

### Priority 4 — Performance / Polish
14. Add mobile detection to reduce FluidGlass simulation iterations.
15. Pause FluidGlass RAF loop when footer is out of view.
16. Move `will-change: transform` to JS-only during active animations.
17. Fix the 4-line hamburger to 3 lines (Section 5.5).
18. Remove numerals from the default scramble character set (Section 5.4).
19. Delete unused CSS variables (`--accent-orange`) and unused type fields (`cardColor`).
20. Add an empty-state message for filtered categories with zero results.

---

## What is Working Well (preserve these)

- **Accessibility baseline** — skip link, focus-visible, reduced-motion, ARIA roles are all implemented correctly. Most portfolios skip all of this.
- **Lenis + GSAP integration** — correctly wired. `gsap.ticker.lagSmoothing(0)` is the right call.
- **Design system discipline** — the CSS custom property system is well-structured. The light/dark theme swap is mostly correct.
- **Scattered grid layout** — the asymmetric positioning with staggered vertical offsets is visually interesting and non-generic. Worth keeping.
- **FluidGlass concept** — a WebGL reaction-diffusion shader on the footer name is a genuinely unusual choice. The execution is technically impressive.
- **Filter UI** — `role="tablist"` / `role="tab"` with `aria-controls` is textbook accessible tab implementation.
- **Lenis duration and easing** — `duration: 1.2` with exponential easing (`1.001 - Math.pow(2, -10 * t)`) is the standard correct config.
