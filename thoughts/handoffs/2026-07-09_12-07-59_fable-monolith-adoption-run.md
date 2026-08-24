---
date: 2026-07-09T12:07:59-04:00
researcher: Claude (Opus 4.8) — context-engineering / orchestration session
git_commit: 8c5bb18a1b7515243a2a38a589d9059aaadfb4b2
branch: main
repository: portfolio_website (DrvFs clone at /mnt/c/Users/Trey/Downloads/portfolio_website);
  references ~/projects/fable25 (= github.com/robertlupo1997/fable-25-local) for the monolith
  source, the method (PROMPTS.md/BRIEFS.md), and the screenshot harness (tools/shot.mjs).
topic: "Autonomous Fable run — adopt the monolith aesthetic into the portfolio. Fable authors its
  own 3 briefs, builds all 3 as greenfield studies, Trey cold-reviews and picks one."
tags: [design-adoption, monolith, fable25, fable-run, brutalist, rlupo-portfolio, autonomous]
status: complete
last_updated: 2026-07-09
type: handoff
---

# Handoff: autonomous Fable run — adopt monolith's design into the portfolio

**READ THIS FIRST, WHOLE, BEFORE ANYTHING ELSE.** You are a fresh **Claude Fable 5** session. This
document is your complete brief and runbook. It was engineered for you by an Opus orchestration
session working with Trey; the decisions below are already made — do not re-litigate them, execute
them. This is modeled exactly on how the FABLE 25 LOCAL collection was built (`~/projects/fable25`);
you built that collection, and you are reusing that method here.

---

## Task(s)

1. ⏳ **YOUR TASK (this session):** Adopt the **monolith** brutalist aesthetic into Trey's portfolio
   (treylupo.com) by producing **three greenfield design studies** — you **author the three briefs
   yourself** (full creative control; seed briefs in §7 are optional inspiration you may override),
   **build all three**, run each through the **three-pass hostile-critique loop**, and deliver **three
   finished hero comps** for Trey to cold-review. **Do not ask Trey anything until all three are done.**
   Then **STOP at the human gate** (§ Action Items #8): Trey picks one; a *later* session ports the
   winner into React. You do NOT pick, and you do NOT touch the React source.
2. ✅ **Done before this handoff (Opus session):** decoded the FABLE 25 method from source; audited the
   real portfolio; verified the token system + AA ratios; resolved the run shape with Trey (see §
   "Decisions already locked"). No portfolio source changed.

---

## Decisions already locked (do not reopen)

- **All three directions**, built in parallel-style isolation. Not one-and-done.
- **Greenfield studies**, NOT React. Standalone `index.html` + `style.css` + `main.js` per variant,
  vanilla JS, served locally — exactly the FABLE 25 build mode. (React porting is a *separate later
  session*; keeping Phase 1 greenfield is what preserves your creative freedom.)
- **You author the three briefs.** The a/b/c seeds in §7 are optional; diverge if your taste says so.
  Span the range loud → hybrid → surgical so the three heroes are genuinely different (not variations).
- **Placeholder content** for these studies (invent civic-poster copy like the original monolith). Real
  projects get injected at port time — do NOT try to use Trey's real project data now.
- **Human gate preserved:** Trey cold-reviews the three heroes and chooses the direction. That brand
  decision is his, not yours — the original method also reviewed between waves.

---

## Critical References (read these)

- **The thing to adopt — monolith source:** `~/projects/fable25/sites/monolith/` — `index.html` (318),
  `style.css` (1242), `main.js` (186). **Live:** http://localhost:4179/monolith/ and its self-doc
  http://localhost:4179/monolith/guide/ (the brief it got, technique w/ code excerpts, its 3-pass
  critique history — study this format; you will reproduce it).
- **The method (your own recipe):** `~/projects/fable25/PROMPTS.md` (mission + builder + finisher prompts,
  the structured-output schema) and `~/projects/fable25/BRIEFS.md` (the **design constitution** at
  lines 7-53: 10-point build standard + iteration-pass contract; then 25 example briefs showing the
  anatomy). Reuse both.
- **The harness:** `~/projects/fable25/tools/shot.mjs` (Playwright installed there; verified). Usage:
  `node tools/shot.mjs <url> <out.png> [WxH] [waitMs] [scrollY] [--reduced]` → prints JSON
  `{out, docHeight, errors, pageErrors}`. Run it from `~/projects/fable25`.
- **What you're adopting INTO — the real portfolio:** `rlupo-portfolio/App.tsx`,
  `rlupo-portfolio/styles/index.css` (tokens), `rlupo-portfolio/components/`. Live at
  http://localhost:3000. Facts you need are inlined in §Learnings so you need not re-derive them.

---

## Learnings (verified facts — trust these; they were checked against source this session)

### What monolith IS (from its source + guide)
- **Palette** (`style.css:9-13`): `--ink #1c1a17`, `--concrete #b9b5ad`, `--orange #e8551a`. A LIGHT
  theme (concrete ground, ink text). Orange is a warning/display color.
- **Type**: `Archivo Black` (display) + `Inter Tight` (body), via Google Fonts.
- **Signature moves** (verified in source): letter-by-letter **scramble** on the cover title
  (`main.js`, `[data-scramble]`, 85ms stagger / 420ms window); **hover/focus-revealed 12-col grid
  skeleton** (`.poster:hover .grid-overlay`, opacity 0→1, cubic-bezier); **CSS-only concrete texture**
  (layered `repeating-linear-gradient` at 3 angles + a base linear-gradient — no images/canvas);
  **scroll-snap poster pages**; **print-registration crosshairs** in CSS pseudo-elements.
- **Its thesis:** "loud can be rigorous — chaos gridded underneath." Concept: an annual of oversized
  typographic posters for fictional civic events.

### What the portfolio IS (verified against `App.tsx:59-92`, `styles/index.css:22-110`)
- **It is a full-screen GSAP CAROUSEL SPA, NOT a scroll page.** Shell: `Preloader → Cursor → skip-link
  → Header → <main><Carousel/></main> → InfoOverlay → ProjectsOverlay → AskPanel`. `Carousel` renders
  `HeroSlide` (0) → one `CarouselSlide` per project → `ActivitySlide` (last), each with a lazy Three.js
  `VizCanvas` behind it. Navigation is carousel (keyboard/swipe/goTo), not scroll.
  **⚠️ `CLAUDE.md` still describes an OLD scroll layout (Header→Hero→ProjectsSection→About→Footer) — it
  is STALE. Ignore it. Trust the code / this handoff.**
- **Consequence for adoption:** monolith's *scroll-snap poster paging* does NOT map onto a carousel.
  "Adopt monolith" here = adopt its **visual language** (poster-scale Archivo Black type, hard grid,
  hover-revealed grid skeleton, concrete texture, registration marks, orange-as-display-only) onto the
  **carousel concept** (slide-to-slide). Your studies must keep a slide-based structure so they port.
- **Token system** (dark, audited) — `styles/index.css:22-110`:
  `--bg-primary #474741` (dark olive ground), `--text-primary #E3E4D5`, `--accent #F0704C`,
  `--accent-text #FA9E78`, `--ink #262622`. Fonts self-hosted: `Departure Mono` + `Space Grotesk`.
- **The portfolio already has a reduced-motion-aware scramble hook** (`hooks/useTextScramble.ts:37`) —
  your dark/hybrid variants can lean on that idea; it's a cousin of monolith's scramble.

### ⚠️ THE AA TRAP (this bit Trey's audit already; do not repeat it)
Ratios are audited **against the dark olive ground `#474741`** (`styles/index.css:23-27`):
`text-primary 7.27 · text-secondary 4.52 · text-tertiary 4.51 · accent (#F0704C) 3.17 (LARGE/UI ONLY)
· accent-text (#FA9E78) 4.55 (small accent text)`. **Orange as body/UI text is forbidden** — `#F0704C`
is 3.17:1 (large decorative only); `#FA9E78` (4.55:1) is the only orange-family value safe for small
text on the dark ground. **On a LIGHT concrete ground, orange (`#e8551a`/`#F0704C`) ≈ 1.85:1 — fails
catastrophically.** A light-concrete variant MUST re-derive text colors from scratch (ink on concrete
≈ 9:1 is fine); never reuse orange as text. Verify contrast computationally — do not eyeball it.

---

## THE CONSTITUTION (non-negotiable container — every variant, every pass)

This is the FABLE 25 build standard, adapted. Full creative freedom lives *inside* these walls.

1. **Static + self-contained.** One folder per variant: `index.html` (+ `style.css`, `main.js`).
   Vanilla JS. CDN allowed for Google Fonts (and Three.js only if a variant truly needs it). No build,
   no framework, no npm installs.
2. **Real copy, no lorem, no placeholders-that-look-broken.** Invent confident civic-poster copy.
   **Never fabricate real-world facts, companies, dates, or testimonials.** (Trey's real projects are
   injected at port, not here.) Credit line in the footer: `Designed & built by Claude Fable 5 · study · 2026`.
3. **WCAG AA text contrast** (4.5:1 normal / 3:1 large ≥24px). Obey the AA TRAP above. Verify computationally.
4. **Custom easing** (cubic-bezier / spring) on hero moves — never default `ease`/`linear`. **Every
   animation honors `prefers-reduced-motion: reduce` with a dignified static composition, not a blank page.**
5. **Responsive 375 → 1600.** Recompose for mobile; don't just shrink desktop. No horizontal overflow at 375px.
6. **Accessibility:** semantic landmarks, exactly one `<h1>`, visible focus, keyboard-reachable
   interactions, `<button>` not `<div onClick>`, decorative canvases `aria-hidden`, a working skip-link.
7. **Zero console errors, zero page errors** at every screenshotted viewport/scroll position. Release blocker.
8. **The three comparable surfaces** — every variant renders the SAME three so heroes are comparable:
   **(1) hero / name slide, (2) one project "poster" slide, (3) one full-screen overlay** (info- or
   projects-style). Keep the carousel concept (slides), not scroll-snap poster pages.
9. **A `/guide/index.html`** per variant, in that variant's own visual language: the brief you authored,
   your signature technique with a real code excerpt, and what each critique pass found and changed.
10. **Slop is a release blocker (via-negativa).** A variant FAILS if it ships any of: generic card grid ·
    centered hero text · gradient-blob background · default system sans as the display face · symmetrical
    two-column filler · orange body text · motion with no reduced-motion fallback.

---

## THE METHOD (how to run — your proven loop)

- **You are the orchestrator.** First, **author three art-directed briefs** (FABLE 25 anatomy:
  `concept · signature · palette · type · prove: · upgrade ideas · persona seed`). Span loud→hybrid→
  surgical. Write them to `rlupo-portfolio/prototypes/fable-monolith/BRIEFS.md`.
- **Persona seeding for diversity:** give each variant a distinct *ordinary* persona (e.g. "civic-signage
  screenprinter", "VT220-era systems typographer", "restraint-first editorial art director") as a
  semantic anchor so the three don't collapse toward the same look.
- **Build in folder isolation** (like FABLE 25): each variant owns
  `rlupo-portfolio/prototypes/fable-monolith/<slug>/` and touches nothing else. Either build the three
  sequentially yourself, or spawn one builder subagent per variant (Task/Agent). If you spawn builders,
  use the **relay pattern** (build → polish+guide → closeout via a `NOTES.md` baton) — long single agents
  died of context overflow in the original. **CONTEXT ECONOMY (hard rule): vision-Read at most THREE
  screenshots per pass.** Shoot freely, Read sparingly. This is what killed 4 of 7 wave-1 builders.
- **Serve the studies locally** for the harness, e.g.:
  `python3 -m http.server 8080 --directory rlupo-portfolio/prototypes/fable-monolith` → each variant is
  at `http://localhost:8080/<slug>/`. (Do NOT disturb :3000 or :4179.)
- **The iteration-pass contract (≥3 passes each):** (1) **render** with `shot.mjs` — desktop 1440x900
  top/mid/bottom (use reported docHeight) + mobile 390x844 top/bottom, plus a `--reduced` shot; (2)
  **look at the pixels** with vision and critique like a hostile design director — rhythm, alignment,
  contrast, widows, dead zones, anything that smells like "AI default"; (3) **fix everything + add ONE
  deliberate complexity upgrade** (texture, micro-interaction, marginalia). *A pass without PNGs on disk
  did not happen.* Use a per-dimension critique (hierarchy · type distinctiveness · palette originality ·
  layout novelty · a11y · brief fidelity) rather than a vague holistic "looks good."
- **Structured output** per variant (as JSON, like the original schema): `{slug, title, tagline,
  passes[{pass, found, changed, upgrade}], signature_technique, remaining_concerns, console_errors_final}`.
- **Finish** each variant with `final-desktop.png` + `final-mobile.png` in its QA folder, and a working `/guide`.

---

## §7 — Optional SEED briefs (inspiration only — override freely)

These were drafted by the Opus session. **You are expected to re-art-direct them with your own taste.**
They exist so the range is anchored, not to constrain you.

- **(a) `concrete` — CONCRETE ANNUAL** [persona: civic-signage screenprinter]. Concrete-light full
  reskin: concrete `#b9b5ad` ground, ink `#1c1a17` text, orange `#e8551a` **display-only**; Archivo
  Black + Inter Tight; hard 12-col grid, grid-overlay reveal, concrete texture, registration marks,
  name scramble. *Prove: a serious analyst's portfolio can be as loud and rigorous as a civic-design
  annual.* (Light ground ⇒ re-audit AA from scratch.)
- **(b) `terminal` — TERMINAL BRUTALISM** [persona: VT220-era systems typographer]. Keep the dark
  terminal identity (Departure Mono + Space Grotesk, olive ground, existing AA-passing tokens); run
  monolith's *structure* through it — poster-scale headings, hard grid, grid-overlay as faint terminal
  rules, concrete-as-scanline, ASCII registration marks. *Prove: brutalist rigor survives a dark palette.*
- **(c) `graft` — THREE GRAFTS** [persona: restraint-first editorial art director]. Keep the current
  design; graft in exactly three moves — grid-overlay reveal, subtle concrete texture, poster-scale on
  one heading per slide. *Prove: targeted borrowing beats a full reskin.* Quietest, most adoptable.

## Optional recipe upgrades (engineering rationale; source IDs UNVERIFIED — use the ideas, not as cited fact)
- Per-run persona seeding (above) — anti-homogenization.
- Via-negativa slop checklist (constitution #10) — concrete, verifiable "no slop."
- Per-dimension analytic critique rubric (method) — beats holistic; prevents halo effects.
- Structured aesthetic critique (content/fidelity, then stylistic features / principles / execution) —
  beats generic "look and react."

---

## Verification

| Claim | Command run this session | Result |
|---|---|---|
| portfolio HEAD / branch (DrvFs clone) | `git rev-parse HEAD` / `--abbrev-ref HEAD` | `8c5bb18…4b2` / `main` |
| portfolio is a carousel SPA (not scroll page) | read `App.tsx:59-92` | main = single `<Carousel>`; overlays layered; NO Hero→…→Footer scroll layout |
| token block + AA ratios | read `styles/index.css:22-110` | verbatim: bg `#474741`; accent `#F0704C` 3.17 (large only); accent-text `#FA9E78` 4.55 (small); comment `:23-27` |
| skip-link present | read `App.tsx:63,70` | `<a href="#main-content" class="skip-link">` + `<main id="main-content">` |
| CLAUDE.md layout is stale | compared `CLAUDE.md` "Header → Hero → ProjectsSection → About → Footer" vs `App.tsx` | STALE — code is a carousel SPA; flag for a doc fix |
| monolith source exists | `ls ~/projects/fable25/sites/monolith/` | `index.html style.css main.js guide/` |
| harness + Playwright | `ls tools/shot.mjs` / `ls node_modules/playwright` | both present |
| method files exist | `ls ~/projects/fable25/{PROMPTS,BRIEFS}.md` | both present |
| portfolio dev server | `curl -w %{http_code} http://localhost:3000` | `200` — restart: `cd rlupo-portfolio && npm run dev` |
| monolith live + guide | `curl … :4179/monolith/` and `…/guide/` | `200` / `200` — restart: `(cd ~/projects/fable25 && python3 -m http.server 4179 --directory sites &)` |
| portfolio tests/build | — | STALE — not re-run this session; no portfolio source changed. Last green 2026-07-08 (40/40, build 7.26s) |

---

## Artifacts

- `thoughts/handoffs/2026-07-09_12-07-59_fable-monolith-adoption-run.md` — this document (durable).
- `HANDOFF.md` (repo root) — pointer updated to this file.
- (Ephemeral, this session's scratchpad, NOT in repo) `fable-run-context-pack.md` — the working pack
  this handoff was distilled from. Everything essential is inlined here; do not depend on that file.
- (Separate repo) `~/projects/fable25` — the monolith source, method, and harness you will read/use.
- **To be created by you (the Fable session):** `rlupo-portfolio/prototypes/fable-monolith/BRIEFS.md`
  and `rlupo-portfolio/prototypes/fable-monolith/<slug>/…` for each of the three variants + their QA shots.

---

## Action Items & Next Steps (your run, in order)

1. Read this handoff fully. Open monolith live (`:4179/monolith/` + `/guide/`) and read its source.
   Re-read your own recipe in `~/projects/fable25/{PROMPTS,BRIEFS}.md`.
2. Author three art-directed briefs (loud → hybrid → surgical), each with a distinct persona seed.
   Write them to `rlupo-portfolio/prototypes/fable-monolith/BRIEFS.md`. Seeds in §7 are optional.
3. Create the three variant folders under `rlupo-portfolio/prototypes/fable-monolith/<slug>/`; start a
   static server on that tree (`:8080`), leaving `:3000` and `:4179` alone.
4. Build each variant greenfield — the three comparable surfaces (hero slide · project poster slide ·
   one overlay), keeping the carousel concept. Obey the CONSTITUTION.
5. Run the ≥3-pass hostile-critique loop per variant (render → vision-critique ≤3 shots/pass → fix + one
   upgrade). Zero console errors. Verify reduced-motion and AA computationally.
6. Write each variant's `/guide` (brief + technique w/ code excerpt + critique history).
7. Produce `final-desktop.png` + `final-mobile.png` per variant and a structured-output summary.
8. **STOP — HUMAN GATE.** Present the three heroes to Trey for cold review. Do NOT pick a winner, do NOT
   touch the React source, do NOT port. Trey chooses the direction.
9. (LATER session, not you) Port the chosen direction into the React carousel per the ADOPTION
   constraints: React 19 + TS components using `var(--token)`, typed props, `constants.ts` as the data
   source, Lenis + skip-link + per-slide VizCanvas preserved, real projects injected then. The
   "which projects are portfolio-ready" curation (there's a prior disposition matrix in `thoughts/`)
   happens at that port, not now.

---

## Other Notes

- **Repo situation:** you're in the Windows-mounted DrvFs clone `/mnt/c/Users/Trey/Downloads/portfolio_website`
  (has all the design work; 23 commits ahead of origin). A WSL-native clone
  `/home/tlupo/projects/portfolio_website` is Trey's intended canonical but is stale at `086607b` and
  can't sync until a pending push (gated on Trey's "Vercel Step 0"). Origin/main is a squash `771043b`.
  **You only need the DrvFs clone + `~/projects/fable25`.** Do not push.
- **Servers are session-fragile** — both had restart commands in the Verification table.
- **fable25 is a separate ext4 repo** (`~/projects/fable25`, pushed at `b5cbc08`) — do not confuse its
  working tree with the portfolio. Its `qa/monolith/` holds monolith's pass-history screenshots.
- **Why greenfield studies, not React:** your magic is a greenfield/vanilla mode; forcing React + the
  existing token system + the load-bearing Three.js carousel would throttle exactly the creative freedom
  Trey is asking for. The port is deliberately a separate, constrained job. Go nuts inside the walls.
