# Design Vision — treylupo.com Redesign
**Date:** 2026-05-09  
**Author:** Design Consultant Review  
**Status:** Approved for implementation

---

## 1. Audience Definition

The site has three audiences in priority order:

**Primary: Technical hiring managers at AI/ML-adjacent companies.** These are people who have seen hundreds of portfolios. They know what a generic data science bootcamp project looks like, and they will close the tab in 8 seconds if that's what they see. They are looking for signal that says "this person builds real things at production quality." The signal they respond to: GitHub commit history depth, SDK/API design decisions, stack breadth, and evidence of shipping something that others use.

**Secondary: Finance/fintech hiring managers looking for the bridge builder.** FP&A is commoditized at many companies. What is rare is an FP&A analyst who can write TypeScript, build REST APIs against Oracle EPM, and automate the workflows that every FP&A team drowns in manually. This audience doesn't need to understand Rust — they need to understand that Trey built the tool that no vendor provides.

**Tertiary: Open source community and potential collaborators.** These people arrive from GitHub, not cold. They've already seen the code. The site needs to confirm: yes, this person is legit, here's how to reach them, here's everything else they've built.

The design must optimize for the primary audience without losing the secondary. That means: lead with engineering credibility, let the FP&A context explain the *why* behind the engineering.

---

## 2. The Story the Site Must Tell

The narrative arc is a transformation story, and transformation stories have a specific structure: you need the starting point, the catalyst, and the current state — in that order. The current site skips the arc entirely and just asserts a title.

The arc for this site:

> Statistics degree. Became an FP&A analyst. Watched the industry run on Excel macros and vendor software that doesn't expose an API. Decided to build the infrastructure that should already exist. Taught himself TypeScript, built a 60-endpoint SDK for Oracle EPM Cloud from scratch. Then Rust. Then ML pipelines. Now both things are true simultaneously: rigorous financial domain knowledge, and the ability to ship production engineering.

This story is genuinely rare. Most engineers don't understand FP&A. Most FP&A analysts can't build SDKs. The site should make a visitor feel the tension in that combination — then resolve it by showing the work.

The tone should feel like an engineer's workshop, not a student's gallery. Workshops have tools out on the bench, ongoing projects, evidence of real use. Galleries have placards. The current site has placards.

---

## 3. What is Wrong with the Current Site

The design audit covers technical bugs in detail. From a design and content perspective, the three critical failures are:

**The wrong six projects.** Every project on the site is a university assignment or MIT bootcamp exercise. "MIT IDSS" as a metric is not a metric — it's a grade source. The actual work (nspb-api, ferroml, ironclad, hierarchical-revenue-forecast) is completely absent. A hiring manager who filters by "FP&A" sees an empty grid. The FP&A filter button exists, points to zero projects, and makes the gap visible.

**The hero says nothing that creates recall.** "TREY LUPO / FP&A Analyst · Data Scientist" is accurate and invisible. Every third portfolio says "Data Scientist." There is no hook, no tension, no reason to keep scrolling. The first 3 seconds of a portfolio are the entire interview for whether the site gets read.

**The FluidGlass shader is buried in the footer.** This is the most technically distinctive element on the site — a reaction-diffusion fluid simulation that responds to mouse movement, rendered in a WebGL shader pipeline. It's sitting at the bottom of the page as a text decoration, where most users never scroll. Used in the hero, this element would immediately communicate "this person builds things you can't buy off Dribbble." Used in the footer, it's an easter egg for the 20% who scroll all the way down.

---

## 4. Site Architecture

### Stay single-page. Do not add Next.js.

The main portfolio stays a single-page React + Vite application. The reasoning:

- There is no SEO benefit worth pursuing for a portfolio SPA — the audience arrives from LinkedIn, GitHub, or direct referral, not Google search.
- The existing GSAP + Lenis + OGL investment is real, carefully integrated, and produces a cohesive scroll experience. Migrating to Next.js would require re-architecting every animation hook, every ScrollTrigger, and the entire Lenis setup for no functional gain.
- Next.js SSR complexity introduces hydration edge cases that would need to be managed for every OGL/WebGL component.

The subdomain architecture already handles depth:
- `treylupo.com` — landing/portfolio (this repo, stay on Vite)
- `blog.treylupo.com` — Astro + MDX (Astro is correct for a static blog; it ships zero JS by default and is ideal for markdown-heavy technical writing)
- `docs.treylupo.com` — API reference for nspb-api (Docusaurus or VitePress)
- `demos.treylupo.com` — deferred until interactive demos with real users exist; do not stand up an empty subdomain
- `lab.treylupo.com` — deferred until ML experiment notebooks are in a state worth sharing publicly

The main site is a routing surface, not a content host. Keep it fast and opinionated.

### Section order (top to bottom)

1. **Hero** — full viewport, FluidGlass ambient background, hook copy, CTA
2. **Featured Projects** — 2–3 case studies with real depth
3. **All Work** — compact grid of all remaining projects (academic + production)
4. **About** — transformation narrative, timeline, stack
5. **Footer** — contact, social links, ambient signal

---

## 5. Hero Section

### What it should contain

The hero is a single viewport. It should not scroll — the user should see all of it without moving. It contains four elements:

1. **The FluidGlass shader as ambient background** — not text decoration, not a full-takeover effect. The shader renders behind the text at reduced opacity, slow and ambient. Mouse movement creates subtle distortion in the background. This runs on the first viewport only; when the user scrolls past the hero, the shader loop pauses (this is the inverse of the current behavior, where it runs in the footer).

2. **The hook** — one line, large, above the fold. Not a name, not a title. A statement that creates the "wait, what?" moment. Recommended copy:
   > Finance analyst. Ships SDKs in TypeScript, ML pipelines in Rust.
   
   This is a factual claim. It does not oversell. It creates immediate cognitive friction because it describes a combination that doesn't usually exist in one person.

3. **The name** — smaller than the hook, below it or beside it. "TREY LUPO" in the current display style. The text scramble effect on hover is fine — keep it. Remove the numerals from the scramble character set (they read as leetspeak on a name).

4. **Two CTAs** — primary: "See the Work" (smooth scroll to Featured Projects). Secondary: "GitHub" (external link). No contact button in the hero — contact belongs in the footer and header.

### How it should feel

The visual register is: quiet confidence, not spectacle. The shader effect should be slow enough that a visitor notices it only after a second — not a loading-screen firework. The type should be large but not screaming. The background is dark (keep the current near-black `#0A0A0B`) — warmth from the shader animation, not from a gradient.

One considered addition: a single line of status below the name in `--font-mono`:

```
Currently: Building nspb-api · Open to AI/ML roles in Tampa or remote
```

This line does significant work: it tells a visiting hiring manager the person is actively available, names the flagship project, and anchors geography. Update it when status changes.

### Typography changes for the hero

Keep Inter as the body and display font — it is neutral enough to not fight the shader effect. The current `clamp(4rem, 12vw, 10rem)` scale is appropriate. 

Recommendation: introduce a single-use display treatment for the hook line — Inter at `font-weight: 700`, `letter-spacing: -0.04em`, at approximately `clamp(2.5rem, 6vw, 5rem)`. This is slightly smaller than the name but more emotionally loaded because of the sentence structure. The hook reads first (contrast, weight, sentence meaning), the name confirms identity second.

---

## 6. Featured Projects Section

### Architecture: two-tier

This is the most important structural change. The current site has six equal-weight project cards. The new site has two layers:

**Layer 1: Featured case studies.** Two or three projects that get genuine depth. These are not cards — they are full-width panels or expanded sections. Each featured project contains:

- **Problem in one sentence.** Not "I built X." Instead: "Oracle EPM Cloud exposes no public API. I built one." This is the problem → solution framing that makes a hiring manager read the next line.
- **What was built.** 2–4 sentences, technical but not jargon-dense. Mention the architecture decision that mattered, not a list of technologies.
- **Key metric.** One number that is meaningful. "60 endpoints across the full planning API surface." Not "MIT 100%."
- **Tech stack pills.** TypeScript, REST, Oracle EPM Cloud. Small, readable, not dominant.
- **One visual.** Not a stock photo. An architecture diagram, a screenshot of the API in use, or a snippet of real documentation. This communicates artifact quality, not domain aesthetics.
- **Links.** GitHub (primary) + docs subdomain if applicable (secondary). No "Live Demo" button unless there is actually a live demo.

**The three featured projects:**

1. **nspb-api** — The flagship. An FP&A analyst who builds a 60-endpoint TypeScript SDK for Oracle EPM Cloud is the core claim of the entire site. Lead with it. This is the project that reconciles both audiences: finance people understand the problem, engineers understand the solution.

2. **hierarchical-revenue-forecast** — This demonstrates the data science depth. Multi-LOB forecasting with a hierarchical model is methodologically serious. Show the reconciliation approach, show the accuracy metric against baseline, mention the production deployment context.

3. **ferroml** (or ironclad, depending on which is more complete) — The "why Rust?" moment. An FP&A analyst writing a Rust ML framework is the signal that says "this is not a weekend hobbyist." Explain the choice: Rust for performance in AutoML hyperparameter search, not because Rust is trending. If ferroml has more interesting architecture decisions, use it. If ironclad has a more concrete business result, use that.

**Layer 2: All Work grid.** The six academic projects (KKBOX, object detection, Amazon recs, FoodHub, Shinkansen, Life Expectancy) collapse into a compact grid below the featured section. Each card is small: title, one-line description, tech tag, GitHub link. No images. These cards prove breadth and learning trajectory — they are supporting evidence, not the headline.

The section header should distinguish the two layers explicitly:
```
FEATURED WORK      [see all work ↓]
```

### Project card fields to add to the type

The `Project` type needs:
- `description: string` — one sentence, what was built and why it matters
- `stack: string[]` — tech stack for pills
- `featured: boolean` — controls which layer a project appears in
- `diagramUrl?: string` — optional architecture diagram or meaningful screenshot

---

## 7. About Section

### Structure: transformation timeline, not bio paragraph

The current About bio is accurate and forgettable. It reads like a LinkedIn summary. The redesigned section tells the transformation story as a timeline — not a full-width prose paragraph.

**The statement stays.** "I make financial data useful." is a strong opening line — it's both true and ambiguous enough to pull the reader in. Keep it as the section's opening display text.

**The timeline.** A sparse vertical timeline with 4 entries:

```
2024  B.A. Statistics, USF · MIT IDSS Data Science Certificate
      ↓
2025  AI Engineering Intern, Origin Construction
      APM automation · Procore integrations · AI agent pilots
      ↓
2025–NOW  FP&A Analyst, Franklin Street
          Built nspb-api SDK · FerroML in Rust · ML deal prediction · Oracle ETL pipeline
```

This format communicates progression without wall-of-text paragraphs. Each entry is a single line or two. The progression from "statistics degree" → "FP&A job" → "certificates" → "shipped production SDKs" is the story. Let the whitespace between entries do the rhetorical work.

**The stack.** Keep the skill tags but reorganize and expand:

```
Primary languages:    TypeScript · Python · Rust · SQL
Finance domain:       Oracle EPM Cloud · FP&A · Financial Modeling
ML/Data:              Scikit-learn · LightGBM · Pandas · FastAPI
Web:                  React · OGL/WebGL · GSAP
```

Remove: Excel, Power BI, Claude/AI Tools from the skill tags. These are tools, not differentiating skills. A hiring manager who sees "Excel" reads "junior." A hiring manager who sees "Oracle EPM Cloud SDK design" reads "rare." Prioritize the rare.

**No "WHAT I DO" service cards.** The current three service cards (Financial Analytics, Process Automation, ML & Prediction) are consulting pitch copy — they imply Trey is freelancing. He's not; he's looking for an engineering role. Remove these. If there's a freelance offering, add a dedicated section for it only if that's intentional.

---

## 8. Navigation

The current navigation logic is correct in concept (left: links, center: logo, right: CTA) but the auto-collapse behavior is confusing. On desktop, the nav should remain visible throughout the scroll — collapsing it to a hamburger mid-page introduces an unexpected mode change for no payoff.

**Recommended nav:**

- Sticky top bar, full width
- Left: `PROJECTS · ABOUT · BLOG↗ · RESUME↗`  
  (BLOG and RESUME get the external link indicator ↗ since they go to subdomain or PDF)
- Center: `TREY LUPO` — clean wordmark matching the domain
- Right: `GET IN TOUCH` button + theme toggle

Remove the auto-collapse. The hamburger appears only on mobile. The desktop nav is always visible.

Add the blog subdomain link to the nav when it exists — this is where the technical writing lives and it's a meaningful signal for a hiring manager who wants to know how someone thinks.

---

## 9. Visual Language and Color

### Color palette: keep with one change

The current palette (electric blue `#0066FF` + teal `#00D4AA` on near-black `#0A0A0B`) is competent. It is also used by approximately half of all developer portfolios built in 2024. The unused `--accent-orange: #FF6B35` in the CSS is a clue — there was an earlier instinct to break from the blue/teal convention.

**Recommendation:** Shift the secondary accent from teal to amber-gold. Replace `--accent-teal: #00D4AA` with `--accent-amber: #F0A500` (or similar warm amber). Keep electric blue as the primary action color.

Why: amber-gold reads as financial, deliberate, and rare in tech portfolios. It creates an immediate visual personality that the generic blue+teal combination lacks. It also reinforces the "finance + engineering" duality in the color itself — blue for engineering, gold for finance. The connection is subtle but real.

Implementation: this change touches CSS variables only. Every component that uses `var(--accent-teal)` switches to `var(--accent-amber)`. The light theme equivalent would be a darker amber, approximately `#B87800`.

**Implementation note:** Warm amber on near-black `#0A0A0B` is sensitive to exact hue and value. `#F0A500` is the recommended starting point, but prototype this change against the FluidGlass shader and the project card borders before committing. If the amber reads muddy or orange against the dark background, shift toward `#E8B84B` (lighter, more gold). Do not commit a color without visual testing on the actual background.

This is a single recommendation. The rest of the palette stays.

### Typography: add one display weight

The current type system (Inter body + JetBrains Mono for meta) is correct. One addition: Inter at `font-weight: 800` or `font-weight: 900` for the hero hook line only. This creates a visual hierarchy distinction between the hook (what this person does) and the name (who this person is). Currently everything uses 600. At 800, the hook line gains weight that makes it visually prior — the reader processes it before they process the name.

No new font families. Inter is already loaded. Using a heavier weight costs nothing.

---

## 10. FluidGlass Shader: Remove Entirely

**Decision (2026-05-09):** The FluidGlass shader was found on GitHub — it is not Trey's original work. Showcasing borrowed visual effects prominently would be misleading; a technical interviewer asking "how does the shader work?" creates an uncomfortable conversation. Remove it entirely.

**What replaces it:** Nothing. The hero should be typography-driven with the hook copy doing the work. A clean dark background (`#0A0A0B`) with strong type hierarchy is more honest and more distinctive than a borrowed WebGL effect. The site's personality comes from content and color, not animation spectacle.

**Implementation:**
- Delete `components/FluidGlass.tsx` and all files in `shaders/fluidglass/`
- Remove FluidGlass import and usage from `Footer.tsx`
- Remove the `ogl` dependency from `package.json`
- Remove the `webgl` manual chunk from `vite.config.ts`
- The hero background is the base dark color with no canvas overlay

---

## 11. Footer

The footer becomes simple. The FluidGlass effect moves to the hero, so the footer's primary visual role disappears. Replace it with:

- Full-width divider
- Two-column layout: left has contact copy ("Available for AI/ML roles and FP&A automation consulting"), right has social links (GitHub, LinkedIn, HuggingFace)
- Email address as a copy-to-clipboard button (keep the current interaction, it's well-implemented)
- Copyright line

This is deliberately minimal. The footer is not a design moment — the hero is.

---

## 12. Blog Section Stub

Add a "Writing" section to the main nav that links to `blog.treylupo.com`, but also include a 2-3 card preview on the main page that shows recent posts. The placeholder state (before any posts exist) should be honest: a single card that says "Coming soon — notes on SDK design, financial modeling, and ML in production." This signals intent and tells the reader where to look when it exists.

The blog itself should be on Astro. Astro generates zero-JS static HTML for markdown content, handles MDX for interactive code examples, and is trivially deployable to Vercel. The main site links to it via subdomain; they do not share a codebase.

First three planned posts to write, in priority order:
1. "Building a REST API for Oracle EPM Cloud (when one doesn't exist)" — tells the nspb-api story with technical depth
2. "Why I wrote an AutoML framework in Rust" — explains ferroml architecture choices
3. "Hierarchical forecasting in production: what academic papers don't tell you" — explains the revenue forecast project with real methodology

These posts, once written, will be the highest-value SEO content on the site. They rank for queries that the primary audience (ML hiring managers, fintech engineering managers) actually types.

---

## 13. Implementation Sequence

Do these in order. Each step delivers visible value independently.

### Phase 1: Content (highest ROI, do first)

1. Add `nspb-api`, `ferroml`, `ironclad`, `hierarchical-revenue-forecast` to `constants.ts`. Add `description`, `stack`, and `featured` fields to the `Project` type. Set `featured: true` on the three selected case studies.
2. Rewrite the About bio. Replace the two flat paragraphs with the timeline structure described in Section 7. Expand the skills list with Rust, TypeScript, Oracle EPM Cloud. Remove Excel, Power BI.
3. Rewrite the hero subtitle. Replace "FP&A Analyst · Data Scientist" with the recommended hook copy. Add the status line in mono.
4. Normalize metrics: every project in constants.ts gets a real technical metric. Remove "MIT IDSS" and "MIT 100%" as metric values.

### Phase 2: Layout

5. Build the two-tier project section: featured case study panels + compact all-work grid below. Remove the scattered grid's hard-coded 6-card positioning from CSS; replace with `nth-child`-based repeating pattern.
6. Add the `description` field and stack pills to ProjectCard.tsx.
7. Add the tech timeline to About.tsx. Remove the service cards.
8. Fix the navigation: remove auto-collapse on desktop, add blog subdomain link.

### Phase 3: Visual

9. Replace `--accent-teal` with `--accent-amber` throughout the CSS. Update light theme equivalent.
10. Move FluidGlass from the footer to the hero background. Adjust shader parameters for ambient background use. Wire up the idle animation. Implement pause-when-scrolled-past-hero.
11. Simplify the footer.
12. Add Inter 800-weight hook line to the hero.

### Phase 4: Bugs (from design audit)

13. Fix the ScrollTrigger global cleanup — kill only owned triggers.
14. Remove numerals from the scramble character set in `useTextScramble.ts`.
15. Fix the 4-line hamburger to 3 lines.
16. Wire up the cursor-plus click action or remove the state.
17. Delete `DemoModal.tsx` — use direct links throughout.
18. Delete `--accent-orange` CSS variable.

### Phase 5: Subdomain setup

19. Deploy blog.treylupo.com (Astro + MDX). Write the first post.
20. Deploy docs.treylupo.com (VitePress or Docusaurus for nspb-api).
21. Update nav to link to live subdomains.

---

## 14. What Not to Change

These elements of the current site are working and should be preserved exactly:

- **Accessibility baseline.** Skip link, focus-visible ring, reduced-motion coverage, ARIA on filter tabs — all correct. Most portfolios skip this entirely. Keep it.
- **Lenis + GSAP integration.** The connection via `gsap.ticker` is correct. The easing choices are modern. `lagSmoothing(0)` is right.
- **The design system (CSS custom properties).** The variable naming convention, the spacing scale, the light/dark theme override pattern — this is well-structured. Build on it.
- **The filter UI.** `role="tablist"` / `role="tab"` with `aria-controls` is the textbook correct implementation. Keep the category filter; populate it with real projects.
- **The dark base theme.** Don't add a gradient background or a "glass morphism" overlay to the main content. The near-black `#0A0A0B` base with controlled accent use is the right call. The only background texture needed is the FluidGlass shader in the hero.
- **~~The TREY.ML logo.~~** REMOVED — replaced with "TREY LUPO" wordmark to match the treylupo.com domain. Using "TREY.ML" when the domain is treylupo.com creates brand confusion.
- **The text scramble.** Keep it on hero name, nav hover, and section headings. It works. Just remove numerals from the character set.

---

## 15. Reference Points (Not Inspiration, But Structural Analogues)

These are not "looks like" references — they are structural examples of the patterns recommended above.

**Brittany Chiang (brittanychiang.com)** — demonstrates the two-tier project structure: 2–3 featured projects with full descriptions, all projects in a compact list. This is the clearest existing example of the pattern recommended in Section 6. Her use of a pinned "featured" section and an "all projects" table solves exactly the same information hierarchy problem.

**Lee Robinson (leerob.io)** — demonstrates the "currently building" status signal in the hero. Short, factual, updated. Every time he switches jobs it tells you something.

**Rauno Freiberg (rauno.me)** — demonstrates quiet confidence as a visual register. No flashy animations, no hero gradient, no project card hover effects. Just typography and whitespace. The portfolio is the argument that good taste is the skill. This is useful as a counterpoint: the recommendation for this site is *not* to go this minimal, because the FluidGlass shader is a genuine differentiator that should be used — but the restraint in Rauno's site is the right emotional baseline to aim for.

The key pattern none of these sites has that this site should: the explicit "bridge between two worlds" framing in the hero. None of these people are bridging FP&A and ML engineering — that combination is uncommon enough that naming it directly, as a tension, is the hook. No reference site does this because no reference site has this problem to solve.

---

## 16. Success Criteria

The redesigned site succeeds if:

1. A technical hiring manager who visits the site for 30 seconds can answer: "What is the most impressive thing this person built, and why is it hard?" Answer: a 60-endpoint TypeScript SDK for Oracle EPM Cloud, from scratch, at a small FP&A firm.

2. A finance hiring manager who visits the site for 30 seconds understands: "This person knows FP&A deeply AND can automate and engineer around the problems the industry pretends are unsolvable." They click to nspb-api docs.

3. The FluidGlass shader is the first thing a visitor sees — not a footer easter egg.

4. The FP&A project filter shows projects when clicked.

5. Every project on the site has a description, a real technical metric, and a stack listed. No project metric says "MIT IDSS."

6. A visitor who reads the About section understands the progression: statistics background → FP&A job → found a gap → built the tool → built more tools → now seeks AI/ML engineering role.

These six criteria are verifiable. Measure against them when implementation is complete.
