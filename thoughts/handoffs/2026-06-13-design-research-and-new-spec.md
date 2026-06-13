# Design Research & New DESIGN.md Spec (2026-06-13)

Source: Claude.ai conversation (Fable 5, then Opus when Fable went down). User uploaded the 10 review screenshots + PRODUCT.md/DESIGN.md + a design research prompt, then iterated into a full DESIGN.md rewrite.

---

## What happened

Two artifacts came out of this session:

1. **A portfolio inspiration research document** — 10 specific reference sites analyzed for dark/industrial/precision aesthetics
2. **A complete DESIGN.md rewrite** — new color system (copper accent), new typography (Space Grotesk + Inter + JetBrains Mono), new motion budget, new component specs

Both represent a potential **direction change** from the current Invisible Frame implementation. The user hasn't committed to switching yet — they asked to "document this" for consideration.

---

## Key design decisions in the new spec (vs current implementation)

| Decision | Current (Invisible Frame) | New spec (Precision Dark) |
|----------|--------------------------|---------------------------|
| **Accent color** | Signal Blue `#0066FF` | Copper `#C87533` |
| **Text primary** | Cool off-white `#E8E8EE` | Warm off-white `#E8E5DF` |
| **Text secondary** | `#888899` (cool) | `#8A8780` (warm) |
| **Display font** | Satoshi 500 | Space Grotesk 600 |
| **Body font** | Satoshi 400 | Inter 400/500 |
| **Mono font** | JetBrains Mono (same) | JetBrains Mono (same) |
| **Display usage** | Satoshi everywhere, scale differentiates | Space Grotesk hero ONLY, Inter for all else |
| **Border radius** | 0px everywhere | 0px default, 4px buttons/inputs, 8px cards |
| **Deepest bg** | `#0A0A0B` | `#050506` (new "void" layer below primary) |
| **Framework** | React 19 + Vite | Recommends Astro (static-first) |
| **Page structure** | Single-page scroll | Multi-page (/, /projects/[slug], /about) |
| **Parallax** | Yes (±5% on featured images) | Forbidden |
| **Scroll behavior** | Lenis smooth scroll | Lenis smooth scroll (same) |
| **Project labels** | `01`, `02`, `03` | `P/01`, `P/02`, `P/03` (path-separator convention) |
| **Hero** | Bottom-aligned name + tagline | Centered name over generative canvas piece |
| **Credential strip** | None | Horizontal auto-scrolling marquee |
| **Nav** | Vertical stack (left) collapsing to hamburger | Fixed top bar, hide on scroll-down, show on scroll-up |

### What the new spec adds that we don't have

- **Copper accent** with a strict "5 elements per page" budget
- **Space Grotesk** as a hero-only display face (currently we use Satoshi for everything)
- **Credential strip** (marquee of certifications/metrics)
- **Multi-page architecture** with project detail pages (`/projects/[slug]`)
- **Character scramble on section headings** (random glyphs resolving over ~0.3s)
- **Generative hero canvas** (particle field, flow field, or ASCII simulation)
- **`bg-void` (`#050506`)** as a new layer behind the hero

### What the new spec removes that we currently have

- **Parallax** on featured project images (forbidden)
- **Sibling dimming** on featured entries (not mentioned)
- **Line-mask SplitText reveals** (replaced with line-by-line translate + opacity, not mask)
- **Cursor-follow preview** on all-work list (not mentioned — may keep)
- **Magnetic CTA** behavior (not mentioned)
- **Single-page architecture** (replaced with multi-page Astro)

---

## Portfolio inspiration research: the 10 reference sites

### Five portfolios

| Site | Key design decision |
|------|-------------------|
| **robin-mastromarino.com** | WebGL slider with displacement deformations proportional to scroll/drag velocity — imagery stretches and snaps back based on how hard you fling it. Strict #000/#fff. |
| **lusion.co** | Real-time WebGL cloth simulation as showreel (computed live, not pre-rendered video). Single long-scroll with deliberate scroll-jacking. #000/#fff. |
| **dennissnellenberg.com** | Barba.js full-page transitions tied to Locomotive Scroll inertia — clicking a project glides the whole canvas. Navigation feels like one continuous mechanism. #1C1D20 + #455CE9 blue. |
| **p5aholic.me** (Keita Yamada) | Built-in Light/Dark/**Monospaced** theme switch — "Monospaced" mode re-renders entire site in fixed-width typeface. Portfolio as typographic systems demonstration. |
| **isabelmoranta.com** | Dual typography system — monospace for technical copy, serif (Ogg) for personal voice — over near-black #080808. Each project emerges from darkness like a gallery wall. |

### Three non-portfolio sites

| Site | Technique |
|------|-----------|
| **igloo.inc** | Entire UI rendered in WebGL (not HTML). Text glitches via SDF shaders. Footer is a fluid particle simulation where particles change color based on speed. Awwwards SOTY 2024. |
| **resend.com** | Monospace typefaces as accents (labels, code, metadata) on near-black — engineering precision signal without 3D overhead. |
| **linear.app** | Near-black canvas with subtle gradient-mesh glows. 2025 redesign stripped color toward monochrome. Inter as workhorse. "Instrument" not "SaaS landing page." |

### Two Awwwards 2025-2026 winners

| Site | Signature device |
|------|-----------------|
| **stabondar.com** (SOTD Feb 14 2025) | Rotating 3D cube + physics-based mouse interaction + GSAP+Three.js. #111111 + #EB4330 industrial red-orange. Bayer-matrix ordered dithering shader on project images. |
| **2025.unseen.co** (SOTD Mar 24 2026) | ASCII liquid simulation — fluid sim rendered entirely as ASCII characters — on scroll-driven timeline. #010101 + #E4B504 amber/gold. |

### User's four favorites (from these + prior research)

1. **stabondar.com** — dithering shader, character scramble, physics interactions
2. **2025.unseen.co** — ASCII fluid sim, strict 2-color (black + gold), editorial restraint
3. **francescomichelini.com** — P/01 labeling system, structural restraint, acid green accent `#C4FF58` (NOT "cool graphite" as prior chat claimed)
4. **elliott.mangham.dev** — credential density, single-page proof stacking, GSAP+Vite only (no Three.js/WebGL), won SOTD without 3D pipeline

---

## Corrections to the prior research chat

The Claude Design session flagged two errors from the earlier Fable research:

1. **Francesco Michelini's palette is NOT "cool graphite"** — Awwwards records his accent as `#C4FF58` (acid yellow-green, like a terminal cursor). The prior chat apparently never checked the listing.
2. **"Amber maps to bourbon" is too literal** — treating every theme as a color-coded logo exercise leads to a site that reads as a bourbon brand landing page. The bourbon is texture, not identity. The identity is precision-systems + generative-art.

### Additional insight from Claude Design

> "Elliott's tech simplicity is the real lesson. His site won SOTD with GSAP + Vite. No Three.js. No WebGL. No Barba.js. No physics engine. He proves that award-level dark portfolios don't require a 3D pipeline — they require density of proof and restraint in motion."

This is directly relevant: the current implementation uses GSAP + Vite with no WebGL (the FluidGlass shader was removed). The new spec proposes adding a generative canvas hero, but the site is shippable without it.

---

## Shared patterns across all references

From the research synthesis:

1. **Strict 2-color palette** — near-black + one accent. Mastromarino: #000/#fff. Stas: #111/#EB4330. Unseen: #010101/#E4B504. The moment a third hue appears, the "engineered" feeling dissolves into "template."
2. **One hero "machine"** — a single engineered interaction (slider, simulation, 3D object) rather than effects spread thin. The shared toolchain is GSAP + Three.js/WebGL + Lenis.
3. **Monospace as engineering signal** — JetBrains Mono, Geist Mono, or Berkeley Mono for nav, labels, metadata. Says "this person builds systems" without words.
4. **Motion concentrated, not distributed** — one signature device gets full investment; everything else is quiet or static.

---

## The new DESIGN.md spec

Saved separately at the project root if the user chooses to adopt it. Key specs:

- **Colors:** bg-void `#050506`, bg-primary `#0A0A0B`, accent `#C87533` (copper), accent-dim `#A35E28`, accent-subtle `#2A1D12`
- **Typography:** Space Grotesk 600 (hero only, 72px), Inter 400/500 (all headings + body), JetBrains Mono 400 (nav, labels, tags, metadata)
- **Motion budget:** 5 permitted behaviors only: (1) hero generative piece, (2) line-by-line SplitText reveals, (3) character scramble on h2 headings, (4) nav show/hide, (5) card hover transitions. Everything else forbidden.
- **Layout:** Multi-page Astro. 12-column grid, 24px gutters, 1200px max-width.
- **Components:** P/01 labeling, credential strip marquee, project cards with optional dithered thumbnail on hover

Full DESIGN.md content is in the pasted conversation above and should be saved to `DESIGN.md` only if the user decides to adopt this direction over the current Invisible Frame spec.

---

## Open questions for the user

1. **Direction choice:** The current Invisible Frame (Satoshi, signal blue, single-page, React+Vite) vs the new Precision Dark (Space Grotesk + Inter, copper, multi-page, possibly Astro). These are incompatible — picking one means rebuilding, not iterating.

2. **Typography:** Claude Design was asked for a typography review but Fable went down before delivering it. The new spec proposes Space Grotesk + Inter, but the user should compare this against the current Satoshi in the browser before committing. A quick font-swap test (change the CSS variables + link tags) would take ~2 minutes.

3. **Framework:** The new spec recommends Astro. The current build is React 19 + Vite. Switching frameworks means starting over. The alternative: keep React+Vite and adopt the design tokens (colors, type, components) without changing the architecture.

4. **Copper vs blue:** The accent color is the most visible decision. A side-by-side screenshot with `--accent-blue: #C87533` swapped in would settle this fast.

5. **Border radius:** The current implementation uses 0px everywhere (per DESIGN.md). The new spec introduces 4px on buttons and 8px on cards. This is a philosophical shift — "machine" (0px) vs "precision instrument with slight ergonomic softening" (4px/8px).

---

## Recommended next steps

1. **Don't switch yet.** The current implementation has real momentum (3 commits, working motion, real data plates, passing audit). Document both directions, compare visually, then decide.
2. **Test the typography** — swap Satoshi → Inter + Space Grotesk in the current build (keep everything else). Screenshot. Compare. This is the fastest way to evaluate whether the type change is worth the direction shift.
3. **Test the accent** — swap `#0066FF` → `#C87533` in CSS variables. Screenshot. This takes 30 seconds and answers the biggest aesthetic question.
4. **If both type + accent land better:** adopt the Precision Dark tokens into the existing React+Vite build. No framework change needed.
5. **If neither lands:** stay with Invisible Frame, implement the layout critique fixes, and ship.

---

## Files

- Research + DESIGN.md conversation: pasted into this session from Claude.ai
- Layout critique: `/home/tlupo/projects/portfolio_website/Layout Critique.html`
- Current DESIGN.md: `/home/tlupo/projects/portfolio_website/DESIGN.md`
- Review screenshots: `thoughts/review-screenshots/`
- Review prompt: `thoughts/claude-design-prompt.md`
- Prior handoff: `thoughts/handoffs/2026-06-12-fable-redesign-session.md`
- Layout critique handoff: `thoughts/handoffs/2026-06-13-claude-design-review.md`
