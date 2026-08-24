# FABLE MONOLITH ADOPTION — design constitution + three briefs

Three greenfield design studies adopting the **monolith** brutalist aesthetic
(`~/projects/fable25/sites/monolith/`) into a portfolio concept for treylupo.com.
One builder agent per study. Trey cold-reviews the three finished heroes and picks a
direction; a later session ports the winner into React. These studies are the pitch.

Authored by Claude Fable 5 (orchestrator), 2026-07-09. Seeds from the Opus session were
re-art-directed; the range is loud → hybrid → surgical.

---

## The build standard (non-negotiable, every study)

1. **Static + self-contained.** One folder per study:
   `/mnt/c/Users/Trey/Downloads/portfolio_website/rlupo-portfolio/prototypes/fable-monolith/<slug>/`
   containing `index.html`, `style.css`, `main.js`, and `guide/index.html`. Vanilla JS.
   CDN allowed for Google Fonts ONLY. No build step, no framework, no npm installs.
2. **Real copy only.** Use the SHARED COPY block below verbatim where specified — the three
   studies must be content-identical so the review compares design, not words. Fictional
   placeholder projects are intentional (real projects are injected at port). Never
   fabricate real-world facts, companies, dates, or testimonials beyond that block.
   Credit line in every footer: `Designed & built by Claude Fable 5 · study · 2026`.
3. **WCAG AA text contrast** — 4.5:1 normal, 3:1 large (≥24px, or ≥18.66px bold). Verify
   COMPUTATIONALLY with the snippet below; do not eyeball. Each brief lists its audited
   values and its traps.
4. **Motion.** Custom easing (cubic-bezier) on every hero move — never default `ease` or
   `linear`. Every animation honors `prefers-reduced-motion: reduce` with a dignified
   static composition, not a blank page.
5. **Responsive 375 → 1600.** Recompose for mobile; don't shrink the desktop. Zero
   horizontal overflow at 375px.
6. **Accessibility.** Semantic landmarks; exactly one `<h1>` (the name on the hero slide);
   visible focus everywhere; keyboard-reachable interactions; `<button>` not
   `<div onClick>`; decorative layers `aria-hidden="true"`; a working skip-link to
   `#main-content`.
7. **Zero console errors, zero page errors** at every screenshotted viewport and state.
   The harness reports them. Release blocker.
8. **Performance sanity.** No asset > 300 KB. rAF loops stop or resolve on
   `document.hidden`. No canvases needed for any of these briefs — everything is CSS/DOM.
9. **The `/guide` route** — `<slug>/guide/index.html`, written in the study's own visual
   language: the brief you received (summarize it honestly), your signature technique with
   a REAL code excerpt from your own source, and what each critique pass actually found
   and changed. Model: `~/projects/fable25/sites/monolith/guide/index.html` (sections:
   01 The Brief · 02 Signature Technique · 03 The Three Surfaces · 04 Critique History).
10. **Slop is a release blocker (via-negativa).** A study FAILS if it ships any of:
    generic card grid · centered-by-default hero text · gradient-blob background · default
    system sans as display face · symmetrical two-column filler · orange body text ·
    motion with no reduced-motion fallback · glow effects thick enough to read "neon sign".

## The carousel contract (every study — this is what makes them portable)

The real portfolio is a full-screen GSAP **carousel SPA** (slide-to-slide, not scroll).
Your study must keep that concept so it ports:

- Full-viewport slides on a horizontal track (`transform: translateX`), advanced by
  **prev/next `<button>`s**, **ArrowLeft/ArrowRight**, and a **slide counter** (e.g. 01/03).
  `scroll-snap` poster paging is NOT allowed — that's the monolith move that does not map.
- Build exactly **three slides + one overlay** — the three comparable surfaces:
  **(1) hero/name slide · (2) one project poster slide · (3) an outro/contact slide** —
  plus **(4) a full-screen INDEX overlay** opened by a header button, closed by Esc and a
  close button; focus moves into it on open and returns to the trigger on close.
- **Deep links (hard requirement — the harness screenshots via URL):**
  `?slide=1` (0-indexed) opens the carousel on that slide; `?overlay=1` opens the INDEX
  overlay on load. Both must work with zero console errors, including when absent.
- Slide transitions: custom-eased transform. Reduced motion: instant jumps, no track slide.

## SHARED COPY (verbatim across all three studies)

- Header wordmark: `TREY LUPO` (links to slide 0) · header button: `INDEX`
- **Slide 1 — hero.** Eyebrow: `Portfolio Annual · Issue I · 2026`. H1: `TREY LUPO`.
  Role line: `FP&A Analyst · Data Scientist · ML Engineer`.
  Tagline: `Forecasts filed. Pipelines audited. Models on the record.`
- **Slide 2 — project poster.** Ref: `FILING F-2026-011` · Category: `Hierarchical
  Forecasting`. Title: `REVENUE TELEMETRY`. Description: `A reconciled forecast tree for a
  fictional distributor — bottom-up noise, top-down discipline, one source of truth.`
  Stats (tabular): `40 series · 12 models · 8-quarter horizon`. Detail pairs:
  `Stack — Python · statsmodels · DuckDB` / `Status — Filed` / `Year — 2026`.
- **Slide 3 — outro/contact.** Heading: `THE RECORD IS OPEN`. Line: `Six filings a year.
  One analyst.` Links (inert `#`): `GitHub` · `LinkedIn` · `treylupo.com`. Footer credit line.
- **Overlay — INDEX.** Heading: `INDEX`. Entries (number · title · category · year):
  `01 REVENUE TELEMETRY · Forecasting · 2026` / `02 FREIGHT AUDIT · Anomaly Detection ·
  2026` / `03 MARGIN ATLAS · Analytics Engineering · 2025` / `04 COLD START · Recommender
  Systems · 2025` / `05 NIGHT SHIFT · Orchestration · 2024`. Entry 01 links to slide 1
  (the project poster) and closes the overlay; others are inert.

You may add small flavor copy in your study's own voice (marginalia, stamps, job-log
lines) but the blocks above appear verbatim.

## Contrast verification snippet (run with `node -e`, adapt colors)

```js
const L=h=>{const c=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(v=>v<=.03928?v/12.92:((v+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const cr=(a,b)=>{const[x,y]=[L(a),L(b)].sort((p,q)=>q-p);return((x+.05)/(y+.05)).toFixed(2)};
console.log(cr('#1c1a17','#b9b5ad'));
```

## The iteration-pass contract (≥3 passes; a pass without PNGs on disk did not happen)

1. **Render.** From `/home/tlupo/projects/fable25` (Playwright lives there):
   `node tools/shot.mjs http://localhost:8080/<slug>/ <QA>/pass1-desktop-hero.png 1440x900 3500`
   where `<QA>` = `/mnt/c/Users/Trey/Downloads/portfolio_website/rlupo-portfolio/prototypes/fable-monolith/qa/<slug>`
   (create it). Shoot per pass: desktop hero, desktop `?slide=1`, desktop `?overlay=1`,
   mobile (390x844) hero, mobile `?slide=1`, plus one `--reduced` shot. Check the JSON for
   `errors` and `pageErrors` — they are release blockers. A static server already serves
   the tree at `http://localhost:8080/<slug>/`; do NOT start servers.
2. **Look at the pixels.** Vision-Read your screenshots and critique like a hostile design
   director, per-dimension: hierarchy · type distinctiveness · palette originality ·
   layout novelty · a11y · brief fidelity. Hunt rhythm breaks, misalignment, widows, dead
   zones, muddy contrast, anything that smells "AI default."
   **CONTEXT ECONOMY (survival rule): vision-Read at most THREE screenshots per pass,
   chosen deliberately. Shoot freely; Read sparingly.** This killed four wave-1 builders.
3. **Fix everything found — then add ONE deliberate complexity upgrade** (texture,
   micro-interaction, marginalia). The upgrade rule stops iteration converging on bland.

Finish with `<QA>/final-desktop.png` (hero, 1440x900) and `<QA>/final-mobile.png`
(hero, 390x844). Final output is structured data (schema at the end), not prose.

---

# THE BRIEFS

## A. `ledger` — THE FISCAL LEDGER (loud · full concrete reskin)

**Persona seed:** a civic-signage screenprinter who has set municipal budget-hearing
notices by hand for thirty years and believes a good poster is a legal document.

**Concept:** the portfolio as a **civic annual of fiscal filings** — one analyst's public
record. Every slide is an oversized public-notice poster: filed, stamped, registered.
FP&A work rendered with the gravity of a municipal ordinance.

**Palette:** raw concrete `#b9b5ad` ground · ink `#1c1a17` · warning orange `#e8551a` ·
cream `#f0ece4`. **AA audit (verified computationally):** ink on concrete **8.50** ✓ · cream on ink
**14.74** ✓ · orange on ink **4.75** ✓ (small text OK on ink panels only) · **orange on
concrete 1.79 — FAILS even large-text AA. On concrete, orange is strictly non-text
decoration** (rules, blocks, reg marks, stamps). Derive muted secondary text from ink at
≥70% flat color (compute it), never orange.

**Type:** Archivo Black (display) + Inter Tight (body), Google Fonts.

**Signature moves (adopt from monolith, verbatim spirit):** letter-by-letter scramble on
`TREY LUPO` (85ms stagger / 420ms settle, rAF, reduced-motion skips to settled); hover/
focus-revealed 12-column grid skeleton per slide; CSS-only concrete texture (3 layered
repeating-linear-gradients + a base gradient); print-registration crosshairs in pseudo-
elements; a vertical `FILED` ink strip; a rotated rubber-stamp block (`RECEIVED · 2026`)
with 2px ink border.

**Layout law:** asymmetric compositions; the project slide reads like the renewal poster
(ref header, giant stacked title with one shifted word, orange divider, `<dl>` detail
grid); the INDEX overlay is a full-screen ink takeover — orange numerals (display-scale),
concrete text, fine-print marginalia column of fictional filing statutes.

**Prove:** a serious analyst's portfolio can be as loud and rigorous as a civic-design annual.

**Upgrade ideas:** stamp tilts 1–2° on hover with a spring-ish cubic-bezier; marginalia
statute column; a barely-visible embossed `LUPO` in the concrete (text-shadow relief).

---

## B. `broadside` — TERMINAL BROADSIDE (hybrid · monolith structure, portfolio skin)

**Persona seed:** a VT220-era systems typographer who prints the nightly batch report as
a poster broadside and pins it in the corridor — convinced monospace can carry a wall.

**Concept:** each slide is a **line-printer broadside at poster scale** — the analyst's
nightly job log elevated to civic-notice grandeur. Monolith's rigor; the portfolio's
dark-olive terminal soul. This is the bridge variant: monolith structure × existing skin.

**Palette (the portfolio's real audited tokens — reuse verbatim):** bg `#474741` ·
elevated `#55554D` · surface `#3D3D38` · text `#E3E4D5` (7.27 ✓) · secondary `#B6B78D`
(4.52 ✓) · tertiary `#B5B5A7` (4.51 ✓) · accent `#F0704C` (**3.17 — large text ≥24px/bold
19px and non-text ONLY**) · accent-text `#FA9E78` (4.55 ✓ small accent text) · ink panel
`#262622`. **Trap: `#F0704C` as body/small text is forbidden.** On ink panels re-verify
computationally before use.

**Type:** VT323 (display — pixel CRT face, poster-scale all-caps; it stands in for the
portfolio's self-hosted Departure Mono at port time) + Space Grotesk (body). **Taste
gate:** in pass 1, judge VT323 at hero scale with your own eyes; if it reads "arcade
game" instead of "DEC terminal," swap display to Martian Mono and say so in the guide.

**Signature moves:** poster-scale mono headlines (name fills the slide width like
monolith's cover); **scanline texture** as this variant's concrete (repeating-linear-
gradient, ≤2% alpha); grid skeleton revealed on hover/focus but drawn as **terminal box
rules**; **ASCII registration marks** (`+` glyphs at slide corners); scramble on the name
(the portfolio already scrambles — same DNA); a blinking block cursor after the tagline
(reduced-motion: solid); data set in tabular numerals.

**Layout law:** hard left rail with job-log marginalia (`RUN 2026-07-09 · 03:14 · OK`
lines, decorative); project slide as a print queue entry blown up to poster size; INDEX
overlay as a full-screen process table — one row per project, orange row numerals at
display scale only.

**Prove:** brutalist rigor survives a dark palette — and a monospace face can carry a poster.

**Upgrade ideas:** form-feed slide transition (brief 1-frame horizontal tear, reduced-
motion exempt); tractor-feed hole strips down slide edges (CSS radial-gradient dots);
an easter-egg `--verbose` line in the footer.

---

## C. `graft` — THREE GRAFTS (surgical · current design + exactly three moves)

**Persona seed:** a restraint-first editorial art director who rejects redesigns on
principle and approves at most three changes per season.

**Concept:** the current portfolio's quiet editorial system, kept — with **exactly three
monolith grafts** and nothing else: **(1)** hover/focus grid-skeleton reveal, **(2)** a
whisper of aggregate texture on the olive ground (layered CSS gradients, ≤1.5% alpha —
poured concrete, but dark), **(3)** poster-scale on **exactly ONE heading per surface**
(the name on hero; the title on the project slide; `INDEX` on the overlay). Everything
else stays at the current site's scale and temperature. If a fourth borrowed move sneaks
in, cut it.

**Palette:** identical to `broadside` — the portfolio's audited tokens, same traps.

**Type:** Space Grotesk (display + body) + Space Mono (eyebrow labels, counters, refs —
stands in for self-hosted Departure Mono at port). Display headings tight-tracked
(`letter-spacing: -0.02em`), poster-scale via `clamp(4rem, 12vw, 13rem)` on the one
heading only.

**Layout law:** recreate the current site's temperament — eyebrow label top-left,
left-aligned hierarchy, slide counter bottom-right in mono, hairline rules from
`rgba(227,228,213,0.12)`, generous whitespace. The poster-scale heading is the only loud
element on any surface; it should feel inevitable, not grafted. Registration marks appear
ONLY while the grid skeleton is revealed (same hover state — the grid brings its
scaffolding with it).

**Prove:** targeted borrowing beats a full reskin.

**Upgrade ideas:** the poster heading settles 8px downward on load with a long custom
ease (600ms, cubic-bezier(0.16,1,0.3,1)); texture deepens ~2× behind the open overlay;
the slide counter ticks with a 2-frame mono flicker on slide change.

---

## Structured output (return EXACTLY this JSON shape as your final message)

```json
{
  "slug": "…",
  "title": "…",
  "tagline": "…",
  "passes": [{ "pass": 1, "found": ["…"], "changed": ["…"], "upgrade": "…" }],
  "signature_technique": "…",
  "remaining_concerns": ["…"],
  "console_errors_final": []
}
```
