# AI-Assisted Design Workflow Guide
**For treylupo.com — React 19 + Vite + TypeScript**
**Researched: May 2026**

---

## The Core Problem This Guide Solves

You are not a designer, but you have a production-quality engineering project that deserves a portfolio that communicates that quality. The tools exist. The gap is knowing which tool does what, in what order, and what the failure modes look like.

This guide is not abstract. It is written for your specific project: the files already exist, the design audit has already been done, and the skills are already installed.

---

## Tool Map: What Each Tool Is Actually For

There are four tiers. Do not conflate them.

### Tier 1 — Direction Finding (Before Any Code)
**Claude Design** (`claude.ai/design`) — launched April 17, 2026, available to Pro/Max/Team/Enterprise.

Use Claude Design when you do not yet know what direction you want. It is a visual canvas, not a code editor. You describe something in plain language and it generates a rendered interactive prototype: HTML, CSS, JavaScript, animations. You iterate through conversation. Two or three prompts can produce what twenty prompts would take in a general code tool.

Use it for: direction exploration, visual reference generation, trying three aesthetic lanes before committing to one.

Do not use it for: building the actual site. Claude Design does not know your codebase, your components, your CSS variables, your GSAP setup. Output is disposable artifacts.

**The handoff**: when you find a direction you like in Claude Design, you take that as a visual reference — screenshot it, export the HTML, note the specific choices (font pairing, color strategy, spatial density) — and carry those into impeccable's shape brief.

**open-design** (`github.com/nexu-io/open-design`) — local-first, open-source alternative to Claude Design. Ships 19 skills and 71 pre-built brand-grade design systems. Runs entirely inside Claude Code (and Cursor, Codex, Gemini, and others) without needing a `claude.ai` subscription. Generates web, desktop, and mobile prototypes, slides, images, videos, and HyperFrames with sandboxed preview and HTML/PDF/PPTX/MP4 export.

Use open-design when: you want direction-finding without leaving the terminal, you want to browse 71 pre-built design systems for inspiration, or you want Critique Theater (a Design Jury that scores your drafts before they ship). It ships a read-only MCP server that integrates with Claude Code — install via `claude mcp add-json` using the snippet from Settings → MCP server in the open-design app.

The distinction from Claude Design: open-design runs locally, you own the artifacts, and it lives in your Claude Code session. Claude Design is a web canvas at `claude.ai/design`, requires a Pro/Max subscription, and is better suited for rapid visual exploration outside of a coding session.

**huashu-design** (`github.com/alchaincyf/huashu-design`) — Chinese-origin HTML-native design skill for Claude Code. Ships a SKILL.md with 20 encoded design philosophies organized into 5 schools, a 5-dimension review system, and animation pipelines that export to MP4. When your prompt is vague, its Design Direction Advisor selects 3 philosophies from different schools and generates parallel visual demos for you to choose from. Free for personal use (runs on your existing Claude Code quota). Not a build loop like impeccable — it is a direction-finding and prototyping skill, output is HTML artifacts. Useful if you want a structured way to explore design directions without going through the full impeccable gate sequence.

---

### Tier 2 — Design System Extraction (Reference Sites → Your Project)
**design-extract** (`github.com/Manavarya09/design-extract`) — the tool you starred.

This is how you steal the design system from a reference site you admire without copying it. One command extracts colors, typography, spacing, border radii, motion tokens, and voice data from any public URL. Output is a DESIGN.md (8-section markdown document), a design-tokens.json in W3C DTCG format, Tailwind config, shadcn/ui CSS variables, and a MCP server payload.

```bash
npx design-extract@latest extract https://linear.app
```

Five slash commands in Claude Code:
- `/extract` — full extraction with DTCG tokens and DESIGN.md
- `/grade` — CSS health audit against the extracted baseline
- `/battle` — compare two sites' design systems side-by-side
- `/remix` — take extracted tokens and rewrite them for your brand
- `/pack` — bundle tokens for export to Figma variables or Tailwind

**The workflow**: extract the design system from three or four reference sites you admire. Run `/battle` to compare two extracted outputs side by side (note: `/battle` takes the already-extracted output files as references, not raw URLs — run `/extract` on each site first). Run `/remix` to derive your own token set that borrows structure without copying aesthetic. Drop the resulting DESIGN.md into your project root. Impeccable reads it automatically.

**Alternatives if you prefer a no-install path**:
- `design-extractor.com` — paste any URL, get a DESIGN.md in seconds
- `dembrandt` (`github.com/dembrandt/dembrandt`) — one command, logo + colors + typography + borders
- Chrome extension: "DESIGN.md Style Extractor" (TypeUI) — extracts while browsing, no CLI needed

---

### Tier 3 — The Main Build Loop (impeccable)
**impeccable** (`github.com/pbakaus/impeccable`) — already installed at `~/.claude/skills/impeccable/`

This is your primary design workflow engine. It has 23 commands grouped into five categories. The commands follow a strict gate system — skip a gate and you get generic AI output.

The gates exist because this is the most common failure mode: someone runs `/impeccable` on a blank project and gets a dark SaaS card grid with Inter font and a purple gradient, which is the training-data default. The gates prevent that by forcing specific decisions before any code is written.

#### The Gate Sequence (non-negotiable)

**Gate 1: Context** — run the context loader to see what's in PRODUCT.md and DESIGN.md.
```bash
node .claude/skills/impeccable/scripts/load-context.mjs
```

**Gate 2: Product** — PRODUCT.md must exist and be non-placeholder. If it does not: run `/impeccable teach` first.

**Gate 3: Shape** — for any build command (`craft`), a design brief must be explicitly confirmed by you in a separate message. The agent cannot self-confirm the brief. This is intentional.

**Gate 4: Image** — visual direction probes must be generated or skipped with a stated reason.

**Gate 5: Mutation** — only after all four gates pass does impeccable write any files.

---

#### The Full Command Reference

**Build commands** (run in this order for new features):

| Command | What it does | When to use it |
|---|---|---|
| `/impeccable teach` | Discovery interview → writes PRODUCT.md | Once at project start, again when strategy changes |
| `/impeccable document` | Reads your existing CSS → writes DESIGN.md | After running `teach`, to capture what already exists |
| `/impeccable shape [feature]` | Interview → design brief → your confirmation → done | Before building any new section or feature |
| `/impeccable craft [feature]` | Runs shape internally, then builds | When you want shape + build in one flow |
| `/impeccable extract [target]` | Pulls reusable tokens and components into design system | After building, to codify patterns |

**Evaluate commands** (run after building):

| Command | What it does |
|---|---|
| `/impeccable critique [target]` | UX design review with heuristic scoring (27 deterministic rules + 12 LLM critique passes) |
| `/impeccable audit [target]` | Technical quality checks: accessibility, performance, responsive |

**Refine commands** (run after evaluation):

| Command | What it does | When you need it |
|---|---|---|
| `/impeccable polish [target]` | Final quality pass before shipping | Before any public-facing deploy |
| `/impeccable bolder [target]` | Amplify safe or bland designs | When the first pass is too safe |
| `/impeccable quieter [target]` | Tone down aggressive/overstimulating designs | When it's too loud |
| `/impeccable distill [target]` | Strip to essence, remove complexity | When too much is happening |
| `/impeccable harden [target]` | Production-ready: errors, i18n, edge cases | Before claiming something is done |

**Enhance commands** (targeted improvements):

| Command | What it does |
|---|---|
| `/impeccable animate [target]` | Purposeful animations and motion |
| `/impeccable colorize [target]` | Strategic color to monochromatic UIs |
| `/impeccable typeset [target]` | Improve typography hierarchy and fonts |
| `/impeccable layout [target]` | Fix spacing, rhythm, visual hierarchy |
| `/impeccable delight [target]` | Personality and memorable touches |
| `/impeccable overdrive [target]` | Push past conventional limits |

**Fix commands**:

| Command | What it does |
|---|---|
| `/impeccable clarify [target]` | UX copy, labels, error messages |
| `/impeccable adapt [target]` | Different devices and screen sizes |
| `/impeccable optimize [target]` | UI performance |

**The live command** — this deserves its own section.

---

### Tier 4 — Browser Iteration (impeccable live)

`/impeccable live` is the tool that makes the visual iteration loop actually work at speed.

**What it does**: injects a picker into your running dev server. You click any element in the browser. Optionally add a comment or a stroke. Hit Go. Claude generates three distinct production-quality variants and hot-swaps them via HMR — you see them in seconds. Accept the one you want; it writes back to source. Discard and try again.

**Prerequisites**: a running dev server with HMR. Your Vite setup qualifies.

**Setup sequence**:
1. Start your dev server: `cd rlupo-portfolio && npm run dev`
2. In Claude Code: `/impeccable live`
3. Claude runs `live.mjs`, configures the inject, handles the CSP check, then gives you a URL
4. Navigate to that URL in your browser
5. Click any element → annotate if you want → Go
6. Three variants appear; pick one or discard
7. Accepted variant is committed to source automatically

**The variants always preserve your brand identity**: impeccable reads your existing CSS variables, color tokens, and typography before generating. You cannot accidentally get a completely different aesthetic — the three variants are different expressions of the same system.

**When to use live mode**:
- After the first build pass when you want to iterate on specific elements without re-prompting
- When you know "the hero feels off" but cannot articulate exactly what to change
- When you want to compare layout options (stacked vs. side-by-side, dense vs. airy) at full fidelity before committing

---

### The Lightweight Alternative: frontend-design Plugin

The `frontend-design` plugin (already installed) is simpler than impeccable. It does not have the gate system, the PRODUCT.md/DESIGN.md setup, or the live mode. Claude automatically uses it for any frontend work.

It is appropriate when you want a quick component generated without running through the full impeccable flow. It enforces bold aesthetic choices (bans Inter and Roboto by default, bans purple-gradient-on-white, requires a committed aesthetic direction before writing code). Use it for: one-off components, quick prototypes, exploratory first passes.

Use impeccable for anything that needs to be production-quality and on-brand.

---

## The Recommended Workflow for Your Project

Your project has a design audit already done (`thoughts/design-audit.md`). Use that as the input to the workflow below.

### Phase 0: Direction Finding (1–2 hours)

Before touching any code, find three to five reference sites that represent what you want the portfolio to feel like. These are not sites to copy — they are sites whose design language, density, and typographic voice you want to learn from.

Good sources:
- `lapa.ninja` — portfolio gallery
- `siteInspire.net` — curated design gallery
- `fonts.google.com/knowledge` — type specimens as references
- The specific brands impeccable's brand.md describes as non-generic: look at Stripe, Linear, Vercel, and then specifically find portfolios that are NOT those things

For each reference site, run:
```bash
npx design-extract@latest extract [URL]
# or use design-extractor.com if you prefer no-install
```

Then compare them in Claude Code. Note what you are actually responding to: is it the density? The typography? The color commitment? This becomes the input to `/impeccable shape`.

Optionally, use Claude Design (`claude.ai/design`) to generate three visual direction explorations with a description like:

> "Personal portfolio for an FP&A analyst who also writes production SDKs and ML pipelines. Audience: technical hiring managers at finance and fintech firms. The work is serious engineering, not academic exercises. I do not want: dark blue/gold finance clichés, SaaS-cream editorial typography, or anything that looks like a Notion template. Reference sites I like: [paste references]."

Take screenshots of the Claude Design outputs. These become visual anchors for the shape brief.

### Phase 1: Context Setup (30 minutes)

```bash
# In your portfolio project root
/impeccable teach
```

The teach interview will ask about: users, brand personality, product purpose, anti-references, design principles, accessibility. Answer honestly and specifically.

**The connection your audit makes explicit**: the teach interview will surface the content problem. When it asks "who uses this?" and you answer "technical hiring managers at finance firms," it will become obvious that showing six academic exercises from MIT IDSS bootcamp is wrong. The interview forces this clarity. Use the audit findings as input to your answers.

After teach completes:
```bash
/impeccable document
```

This reads your existing CSS (all the custom properties in `styles/index.css`) and generates DESIGN.md. Your design system is already sophisticated — the document command will capture the OKLCH-adjacent values, the accent colors, the spacing scale. The result gives impeccable a machine-readable version of what you already have.

### Phase 2: Shape Each Section (30–45 minutes per section)

For each major section of the portfolio (Hero, Projects, About, Footer), run:

```bash
/impeccable shape [section name]
```

For example: `/impeccable shape hero section`

The shape interview is task-specific. It will ask:
- Purpose of this surface, who specifically uses it, what success looks like
- Color strategy for this surface (Restrained / Committed / Full palette / Drenched)
- A scene sentence: who uses this, where, under what light, in what mood (this forces dark vs. light)
- Two or three named anchor references (specific sites or products, not adjectives)
- Scope: how polished, how broad, interactive or static

You will get a structured design brief. **You must explicitly confirm it** before impeccable will build anything. Read it. If something is wrong, say so. The brief is the contract.

### Phase 3: Build with craft (the actual implementation)

After a confirmed shape brief:

```bash
/impeccable craft [section name]
```

craft runs shape internally if you have not already, then builds. With a confirmed brief already in hand, it goes straight to implementation.

What craft does:
1. Loads your PRODUCT.md and DESIGN.md context
2. Loads the relevant reference files (spatial-design.md, typography.md, and any others from the brief)
3. Generates high-fidelity visual comps (if Claude Code has image generation; otherwise states why it skipped)
4. Writes semantic, functional implementation using your React + Vite + TypeScript stack
5. Requires at least one critique-and-fix pass after the first build before it considers the task done

### Phase 4: Iterate with live

After the first build:

```bash
/impeccable live
```

Then navigate to `http://localhost:3000` in your browser. Pick elements that feel wrong. Use the annotation layer to be specific ("this heading is too large," "the spacing here is too tight"). Get three variants. Accept or discard.

This loop is faster than prompting in the chat. Use it for:
- Hero section element refinement
- Project card layout variants (you need to add nspb-api, ferroml, ironclad, hierarchical-revenue-forecast — the layout assumption of 6 cards will need to be rethought)
- About section typography and density

### Phase 5: Evaluate and Polish

After live iteration, run:

```bash
/impeccable audit the portfolio
/impeccable critique the portfolio
```

audit checks: accessibility (WCAG AA), performance (will-change usage, GPU draw calls), responsive behavior. Your audit already identified the FluidGlass 70-draw-call issue and the will-change problem — audit will surface these programmatically.

critique checks: UX heuristics (27 deterministic rules + 12 LLM passes). The absolute bans in impeccable's design laws match several things your audit flagged:
- Side-stripe borders → your audit flagged the cursor-plus state adding visual noise
- Identical card grids → relevant if you end up with too many similar project cards
- Modal as first thought → DemoModal with Mac OS chrome was flagged as a cliché

Then:

```bash
/impeccable polish the portfolio
```

Polish is the pre-ship pass. Run it last, not during iteration.

---

## How to Use Reference Sites Effectively

### The Wrong Way
Pasting a URL and saying "make it look like this." This produces a clone with your content, which is worse than starting fresh because it is recognizably derivative.

### The Right Way

**Step 1: Extract the structure, not the aesthetic.**

Run design-extract on the reference site. Look at the output:
- What is the spacing scale? (The ratio between steps, not the actual pixel values)
- What is the type scale? (The ratio between heading sizes, not the actual font)
- What is the color strategy? (Restrained/Committed/Full palette — see impeccable's definitions)
- How dense is the layout? (Visual children per section)

**Step 2: Name what you are responding to.**

Before extracting anything, write one sentence about why you like the reference site. "I like Linear's portfolio because the typography is large and committed without feeling decorative, and the density is high without being cluttered." That sentence names axes (typography scale, commitment level, density) that you can carry forward independently of Linear's specific font and color choices.

**Step 3: Use `/battle` to compare two extracted outputs on specific axes.**

After running `/extract` on two reference sites separately, use:

```bash
# In Claude Code, after extracting both sites
/battle
# Then reference the two extracted output files when prompted
```

The output compares their token systems side by side. This makes it concrete when you want "Linear's density but Stripe's type voice."

**Step 4: Feed the axes into impeccable shape as named references.**

In the shape interview, when asked for "two or three named anchor references," say:
- "Linear.app for layout density and type commitment level"
- "The Klim foundry specimen page for typographic confidence"
- **Explicitly NOT**: "any dark-blue/gold finance aesthetic, anything Stripe-adjacent with large display serif on white, any SaaS cream background"

The anti-references are as important as the references.

---

## Bridging the Gap: "I'm Not a Designer" to "This Looks Professional"

The actual gap is not technical skill — it is vocabulary. Designers make design decisions by naming them. When you can name what you want, impeccable can implement it. The workflow above builds that vocabulary incrementally.

### The vocabulary you need before running `/impeccable shape`

**Color strategy** (pick one for each surface):
- **Restrained**: tinted neutrals + one accent that covers ≤10% of the surface. Most portfolio sites. Reads as "clean."
- **Committed**: one saturated color carries 30–60% of the surface. High-contrast headers, color-blocked sections. Reads as "bold."
- **Full palette**: three to four named color roles, each used deliberately. Reads as "designed."
- **Drenched**: the surface IS the color. Campaign pages, hero moments. Reads as "editorial."

Your current site uses Restrained (dark neutrals + blue/teal accents). That is a deliberate choice. The question is whether the hero and about sections should push toward Committed to differentiate.

**Scene sentence** (write one before making any dark/light decision):

Bad: "it's a portfolio, probably dark."
Good: "a technical hiring manager at a fintech firm opens this on a laptop at their office desk at mid-morning, reviewing candidates for a senior analyst or engineer role, trying to quickly assess whether this person's work is production-grade or academic."

That sentence forces: light or neutral background (office, mid-morning, professional context), high information density (quickly assessing), typography that communicates seriousness (not display-decorative).

**The AI slop test** (run this before shipping anything):

If someone could look at the portfolio and say "AI made that" without hesitation, it has failed. The specific failure modes impeccable bans:
- Gradient text (`background-clip: text` + gradient)
- Glassmorphism cards used as a default
- The hero-metric template (big number, small label, supporting stats, gradient accent) — this is what your current metric field is dangerously close to
- Identical card grids (same-sized cards with icon + heading + text repeated endlessly)

Your scattered grid layout explicitly avoids the identical-card-grid failure. Keep it.

**The category-reflex check** (avoid twice):

First order: "portfolio for FP&A analyst → dark blue and gold finance aesthetic." This is the obvious category default. Your current site avoids this.

Second order: "portfolio that avoids finance clichés → editorial-typographic with display serif + mono labels + monochromatic restraint." This is the trap one level deeper — by 2026, every Stripe-adjacent and Notion-adjacent brand has landed here. The impeccable brand.md specifically flags this as a saturated aesthetic lane.

Ask: could someone see this and say "oh, it's that editorial-typography portfolio aesthetic"? If yes, rework.

---

## Specific Commands for Your Project, In Order

Based on the design audit and your current project state:

### Right Now (before any design work)
```bash
# Fix the content misalignment first — no design work fixes wrong content
# Edit constants.ts to add nspb-api, ferroml, ironclad, hierarchical-revenue-forecast
# This is not a design task, it is a prerequisite for design to matter
```

### Setup
```bash
/impeccable teach
# Answer the interview with: technical hiring managers at finance/fintech firms
# Brand register: brand (portfolio = design IS the product)
# Anti-references: dark blue/gold finance, SaaS-cream editorial, Notion-template aesthetics
# Brand personality: specific, earned, technical, not decorative

/impeccable document
# Captures your existing CSS custom property system into DESIGN.md
```

### Extract reference design systems
```bash
npx design-extract@latest extract https://[reference site 1]
npx design-extract@latest extract https://[reference site 2]
# Then in Claude Code:
# /battle [site1] [site2]
```

### Shape and build each section
```bash
/impeccable shape hero section
# Confirm the brief explicitly, then:
/impeccable craft hero section

/impeccable shape projects section
# This is where you address the scattered-grid 6-card constraint
# The shape brief should include: "must accommodate 8-10 projects, not 6"
/impeccable craft projects section

/impeccable shape about section
/impeccable craft about section
```

### Iterate in browser
```bash
# Dev server: cd rlupo-portfolio && npm run dev
/impeccable live
# Navigate to http://localhost:3000
# Pick elements, annotate, get variants, accept
```

### Evaluate and polish
```bash
/impeccable audit the full portfolio
/impeccable critique the full portfolio
/impeccable harden the full portfolio   # production edge cases
/impeccable polish the full portfolio   # pre-ship pass
```

### Targeted refinements (as needed)
```bash
/impeccable bolder [target]    # if the first pass is too safe
/impeccable typeset [target]   # typography specifically
/impeccable animate [target]   # motion polish (you already have GSAP; this will enhance it)
/impeccable colorize [target]  # if sections need more color commitment
```

### Pin commands you use often
```bash
node .claude/skills/impeccable/scripts/pin.mjs pin polish
node .claude/skills/impeccable/scripts/pin.mjs pin audit
# Now /polish and /audit work directly without the impeccable prefix
```

---

## What to Expect at Each Stage

**After teach**: You have PRODUCT.md with your brand, audience, and anti-references locked in. Every subsequent impeccable command reads this. Without it, commands produce generic output.

**After document**: You have DESIGN.md that captures your existing color system, type scale, and spacing tokens. Impeccable now knows your existing design language before proposing anything new.

**After shape**: You have a confirmed design brief. This is the most important artifact — more important than any generated code. If the brief is wrong, the code will be wrong, and you will spend hours iterating toward a direction that was never right.

**After craft (first pass)**: You have working code that implements the brief. It will not be perfect. Impeccable requires at least one critique-and-fix pass before the task is done.

**After live iteration**: You have refined specific elements through visual variant comparison. The decisions are explicit — you picked variant 2, not variant 1 or 3 — which means you have made real design decisions even without designer vocabulary.

**After audit/critique/polish**: You have a portfolio that has passed 27 deterministic anti-pattern rules and a 12-rule LLM critique pass. This is the bar that separates "looks like AI made it" from "looks like a human designer made intentional choices."

---

## Sources

- [7 Claude Code Design Skills That Follow a Real Design Process](https://medium.com/@julian.oczkowski/7-claude-code-design-skills-that-follow-a-real-design-process-b871b8673d05)
- [Best Claude Code Skills to Try in 2026](https://www.firecrawl.dev/blog/best-claude-code-skills)
- [Prompting for frontend aesthetics — Claude Cookbook](https://platform.claude.com/cookbook/coding-prompting-for-frontend-aesthetics)
- [Claude Code Skills — install UI Skills + build a frontend-design workflow](https://dev.to/blamsa0mine/claude-code-skills-install-ui-skills-build-a-frontend-design-workflow-claude-code-cursorvs-4n43)
- [Anthropic frontend-design plugin (official)](https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design)
- [Introducing Claude Design by Anthropic Labs](https://www.anthropic.com/news/claude-design-anthropic-labs)
- [Claude Design — Complete Guide for Non-Designers (2026)](https://www.buildfastwithai.com/blogs/claude-design-anthropic-guide-2026)
- [Claude Design vs Claude Code: Which Should You Use for UI and Prototypes?](https://www.mindstudio.ai/blog/claude-design-vs-claude-code-ui-prototypes)
- [Anthropic launches Claude Design (Fast Company)](https://www.fastcompany.com/91528198/anthropic-claude-design-ai-design-tool)
- [GitHub — pbakaus/impeccable](https://github.com/pbakaus/impeccable)
- [Impeccable: Getting Started](https://impeccable.style/tutorials/getting-started/)
- [Impeccable: Design skills for AI harnesses](https://impeccable.style/)
- [GitHub — nexu-io/open-design](https://github.com/nexu-io/open-design)
- [GitHub — Manavarya09/design-extract](https://github.com/Manavarya09/design-extract)
- [Design-Extract Tool — The Agent Times](https://theagenttimes.com/articles/design-extract-tool-gives-us-direct-access-to-website-design-78915dbd)
- [Design Extractor](https://www.design-extractor.com/)
- [GitHub — dembrandt/dembrandt](https://github.com/dembrandt/dembrandt)
- [How to extract design tokens from any website — MatchKit](https://www.matchkit.io/blog/extract-design-tokens-website)
- [Automate Browser Tasks with Claude Code and the Playwright MCP Server](https://www.mindstudio.ai/blog/automate-browser-tasks-claude-code-playwright)
- [Zero overflow in 10 minutes: responsive testing with Claude Code and Playwright](https://dev.to/ohugonnot/zero-overflow-in-10-minutes-responsive-testing-with-claude-code-and-playwright-59an)
- [Impeccable: A Structured Design Workflow for AI-Generated Websites — Better Stack](https://betterstack.com/community/guides/ai/ai-development/impeccable-ai/)
- [Fixing Visual AI Slop: Front-End Design Standards and Skills for AI Coding Agents](https://trilogyai.substack.com/p/fixing-visual-ai-slop)
- [GitHub — nexu-io/open-design](https://github.com/nexu-io/open-design)
- [GitHub — alchaincyf/huashu-design](https://github.com/alchaincyf/huashu-design)
- [Huashu Design: HTML-Native Design Skill for AI Coding Agents with 20 Design Philosophies](https://pyshine.com/Huashu-Design-HTML-Native-Design-Skill-Claude-Code/)
- [The Claude Design Moment: AI Design Skills Just Got Their Breakout Week](https://www.developersdigest.tech/blog/claude-design-moment-ai-design-skills-exploding)
