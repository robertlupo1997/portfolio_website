# Build Workflow Research: How to Build Award-Tier Portfolio Sites (2026-06-13)

Source: Opus research agent scanning Codrops case studies, developer interviews, and tool documentation.

---

## Key findings

### 1. Claude Code vs Claude Design — what actually works

**Claude Design** (claude.ai artifacts/design mode): Good for rapid visual direction exploration — generate 3-4 layout directions in an afternoon. Bad for production code — no codebase awareness, no GSAP/Lenis, output is isolated HTML that needs manual integration.

**Claude Code**: Works in your Git repo, follows your file conventions, produces code that doesn't need an import/export step. This is where implementation happens.

**The workflow that works:**
1. Use Claude Design to explore visual directions (screenshot the results)
2. Bring screenshots + description of what you liked to Claude Code
3. Claude Code implements it in your actual components
4. Screenshot the running site, upload back to Claude Design for critique
5. Iterate steps 3-4

**What does NOT work:** Trying to use artifact code directly in your React project. The style conflicts, missing GSAP context, and integration overhead cost more time than they save.

### 2. How Awwwards-winning developers actually build

From Codrops case studies of Stas Bondar, Francesco Michelini, Federico Pian, Robin Payot, Gianluca Gradogna, Thomas Monavon, Rogier de Boevé:

- **Zero mentioned AI tools** for creative design decisions. Elliott Mangham uses AI for client communication and code he "can do but prefers not to."
- **Robin Payot**: "I had a very vague idea at first, so I began designing and programming at the same time, with lots of back and forth, trial and error, and restarts." This is the realistic solo developer pattern.
- **Federico Pian**: Figma first, took an Awwwards/Obys course, used Savee for inspiration gathering.
- **Stas Bondar**: Over a year of nights and weekends. No design tool mentioned — directly in code.
- **Francesco Michelini**: 8 months for a client project. 4 days for a single preloader. Designed by Unlearn Studio (external designer), developed by him.
- **Common stack**: Nuxt/Astro + GSAP + Lenis + Three.js/OGL. React is less common at this tier but not blocking.
- **Timelines are long**: 3-6 months of sustained part-time work for award-tier polish.

### 3. Best tools for studying reference sites

| Tool | Purpose | Notes |
|------|---------|-------|
| `npx designlang <url>` | Extract full design system (tokens, CSS, Tailwind config, Figma vars) | Already used — best option |
| **SingleFile** (Chrome ext) | Save fully-rendered page as one self-contained HTML | Best for JS-rendered sites like Nuxt |
| **CSS Peeper** (Chrome ext) | Visual breakdown of colors, fonts, spacing | Quick spot-checking |
| **GSAP Sniffer** (Chrome ext) | Detect GSAP version, scrub timelines | Official GreenSock extension |
| **Chrome DevTools Animations panel** | Scrub CSS transitions, edit easing curves | Doesn't capture rAF-based GSAP |
| **Theatre.js** | Visual keyframe editor during development | Used by Rogier de Boevé |
| **Savee** | Inspiration curation | What Federico Pian used |

### 4. The fastest path from "I like this reference" to "my site looks this good"

1. **Collect 20-30 specific UI moments** you want to recreate (not whole sites — specific interactions)
2. **Extract design tokens**: `npx designlang <url>` on your strongest 2-3 references
3. **Prototype motion in After Effects or Claude Design** before coding
4. **Code directly with design tokens as constraints** — the developers who win code directly, not through Figma
5. **Build the hardest interaction first** (your signature moment), not the nav or footer
6. **Iterate on timing relentlessly** — easing curves, stagger values, transition durations. This is what separates award-tier from good-tier and it can't be AI-generated.
7. **Accept the timeline** — 3-6 months of sustained part-time work is realistic

**What does not work:**
- Generating full page layouts in Claude artifacts and porting to React
- Using Figma without design training (produces generic layouts)
- Trying to copy animations from DevTools (GSAP animations aren't captured)

---

## What Michelini's site actually looks like (June 2026)

The prior research was wrong about his current palette. Screenshots confirm:

- **NOT black + lime anymore.** Now: warm cream `#e3e4d5` background, dark olive `#474741` text, olive `#a6a77e` accent, coral/orange-red `F/23` accent on the info page
- **Structure unchanged**: P/01 labeling, `//` slash grammar, PROJECTS / INFO nav, image carousel per project, metadata grid (YEAR · AGENCY · ROLE · AWARDS)
- **Fonts confirmed**: Monorama (display), Neue Haas Grotesk (body), Favorit Mono (labels)
- **Design credit**: Unlearn Studio (he didn't design it himself)
- **His theme appears switchable** — the square icon in the top-right nav toggles between palette modes

---

## Recommendation for Trey

Given your situation (solo, design taste but not design training, React+Vite+GSAP stack):

1. **Install SingleFile and CSS Peeper Chrome extensions** — study Michelini's site interactively in Chrome, not from screenshots
2. **Install GSAP Sniffer** — see what GSAP version and plugins his site uses
3. **Use Claude Code for all implementation** — it has your file system, your GSAP, your design tokens
4. **Use Claude Design only for critique** — upload screenshots of your running site, get spatial/compositional feedback, bring it back here
5. **Your immediate next step**: open your site and his site side by side in Chrome, and identify the 5 specific spatial differences that bother you most. Those become the next iteration's punch list.
