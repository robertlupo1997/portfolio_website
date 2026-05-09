# Awards Inspiration Research
## Best Developer/Engineer Portfolio Websites (2024–2026)
### Curated for an FP&A Analyst / AI Builder

---

## Research Methodology

Surveyed Awwwards (Site of the Day, Site of the Year, Honorable Mention), CSS Design Awards (WOTY 2025), FWA (FOTD), and secondary curation sources (Muzli, Colorlib, CreativeDevJobs). Filtered aggressively to developer/engineer portfolios rather than agency or pure designer work. Where possible, fetched live sites directly.

---

## Tier 1: The Structural References

These are the three sites named as starting references. They represent three distinct philosophies.

### brittanychiang.com
**URL:** https://brittanychiang.com  
**Built with:** Gatsby, Next.js + Tailwind CSS  
**Profile:** Frontend engineer at Klaviyo  

**What it is:** The canonical "senior engineer dark portfolio." One page, anchored sections (About, Experience, Projects), floating sidebar with social links, disappearing header. Dark theme with teal/green accents on near-black background.

**Design patterns worth stealing:**
- **Two-column sticky layout:** Left column is the "about" panel (name, title, nav, socials) that stays fixed while right column scrolls. This is the defining pattern of brittany's site. It works because it gives the reader a constant orientation anchor.
- **Experience as timeline:** Each role gets a date range, company name, description block, and skills-tag row. Scannable. No resume PDF needed.
- **"Other projects" collapse:** A grid of smaller/older projects that starts collapsed with a "Show more" toggle. Keeps the primary projects front-and-center.
- **Disappearing/reappearing header:** Header fades in when scrolling up. Uses IntersectionObserver or scroll direction logic.
- **Hover highlight on nav:** As you scroll through sections, the active nav item highlights. Classic scrollspy.

**What it does NOT have:** No page transitions, no GSAP animations, no dramatic entrance sequences. It's "professional calm" not "creative developer bravado."

**Relevance to FP&A/AI builder narrative:** High. The two-column layout is perfect for a professional who wants to convey stability and depth. The experience timeline is essential for someone who has an unusual background (analyst → builder). The skills-tags-per-role pattern is ideal for showing "Oracle EPM Cloud, Python, Claude API" per project.

**Verdict:** Use the structural DNA (sticky two-column, timeline, scrollspy nav) but replace the teal accent with amber, and add scroll-triggered entrance animations to modernize it.

---

### rauno.me
**URL:** https://rauno.me  
**Built with:** Next.js, React  
**Profile:** Staff Design Engineer at Vercel, previously Arc browser  

**What it is:** The "quiet confidence" portfolio. Rauno's portfolio (2025 Awwwards Honorable Mention) uses only two colors — white (#FFFFFF) and bright yellow (#FFFF02) — on a dark background. Features a minimap navigation element, horizontal scroll sections, and a philosophy section with illustrated elements.

**Key design details from the Awwwards entry:**
- Hero reveal animation (video intro)
- Horizontal scroll gallery for work/projects
- Minimap navigation — a small visual map of the page structure visible in the corner, helping users orient themselves
- Contact interface as an interactive component
- OS-inspired aesthetic: dock, interface sounds, horizontal-scrolling project feed (described in earlier iterations)

**Design patterns worth stealing:**
- **Manifesto-style footer:** Stacked imperatives: "Make it fast. Make it beautiful. Make it consistent. Make it carefully. Make it timeless. Make it soulful. Make it." — pure rhythm. A similar structure could work for the analyst narrative: "Built with real constraints. Shipped with Claude. Measured in dollars saved. Used by actual humans."
- **Temporal versioning:** Links to past versions (2023, 2022) signal evolution and transparency. Shows the person grows.
- **Code-first interaction philosophy:** Rauno explicitly jumps straight to code for interaction work, noting "a lot of the details come to life through actual implementation." For a portfolio, this translates to: build the interaction, don't mockup it.
- **Email copy-to-clipboard:** Small, delightful detail. The email address has a copy button instead of a mailto link.
- **Minimal two-color palette:** Forces every element to earn its place. If you only have two colors, nothing is decorative.

**Color note:** The white+yellow-on-dark palette is bold. For an FP&A/AI narrative, amber (#F59E0B) replacing the neon yellow gives the same contrast with more gravitas.

**Verdict:** Steal the manifesto footer, the minimap concept, and the "two colors, prove it" restraint philosophy. The horizontal scroll gallery is visually strong but may hurt mobile UX — use it only if the project count justifies it.

---

### leerob.com
**URL:** https://leerob.com  
**Built with:** Next.js, Tailwind CSS, Vercel  
**Profile:** Developer and writer; previously Vercel VP of DX, currently at Cursor  

**What it is:** The "status signal" portfolio. Zero visual decoration. Single column, left-aligned prose. The entire portfolio is credibility through association: Cursor, Vercel, 15 years, writing on AI and developer experience. No animations. Uses the View Transitions API for page changes.

**What it signals:** "I'm so senior I don't need to prove anything visually. My name next to Vercel and Cursor is the portfolio."

**Design patterns worth stealing (adapted):**
- **Inline contextual links:** Hyperlinks woven into prose sentences (not button CTAs). "I work on [developer tools] at [Cursor]" — the company name is a link. This creates high information density without visual clutter.
- **Curated writing section:** A short list of best articles, not a blog roll. Signals taste and thought leadership.
- **Personal touches as trust signals:** "Massive music fan." "Coding for 15 years." Humanizing details that make you memorable.
- **No images of work:** Credibility is entirely text-based. The writing IS the portfolio.
- **View Transitions API:** Smooth, native browser transitions between pages — no JavaScript animation library needed for page changes.

**Relevance to FP&A/AI builder narrative:** Medium-high. The "status signal through association" only works if the associations are strong enough. For a solo builder, you need to show the work more explicitly than Lee does — but the prose-forward, inline-linking, writing-as-portfolio-item approach translates directly.

**Verdict:** Adopt the prose tone and inline-linking pattern for the about section. Don't copy the no-visuals approach entirely — show the tools you've built. But use his writing-as-credibility model for a blog/notes section.

---

## Tier 2: Award Winners Worth Studying

### Cyd Stumpel — Portfolio 2025
**URL:** From Awwwards SOTD listing  
**Award:** Awwwards Site of the Day 2025  
**Scores:** 7.22 design, 7.74 development  
**Built with:** Modern CSS (View Transitions API, Scroll-Driven Animations)  

**What makes it notable:** Built entirely with CSS-native animation rather than JavaScript libraries. CSS Scroll-Driven Animations + View Transitions replace GSAP for the transitions between home and work detail pages.

**Color palette:** Periwinkle (#8082F8) + cream (#FFF5EE). High contrast minimal palette.

**Patterns worth stealing:**
- **CSS View Transitions for page changes:** Native browser API, no JS overhead. Any element can become a shared element transition by giving it a `view-transition-name`. This is the future-forward approach.
- **CSS Scroll-Driven Animations:** `animation-timeline: scroll()` — animate purely in CSS tied to scroll position. No GSAP needed for simple reveals.
- **Two-color restraint:** Forces visual hierarchy through spacing and weight alone.

**Verdict:** The CSS-native approach is elegant and loads faster than GSAP-heavy alternatives. For a portfolio that needs to impress technical readers, building without JS animation libraries is itself a credibility signal. Use View Transitions API for page navigation, and CSS Scroll-Driven Animations for simple entrance effects.

---

### Federico Pian — Portfolio 2024
**URL:** From Awwwards SOTD listing, September 2024  
**Award:** Awwwards Site of the Day  
**Scores:** 7.42 design, 8.60 development (exceptional dev score)  
**Profile:** Creative developer, co-founder at Overpx Studio  

**What makes it notable:** Earned 8.60 on development — one of the highest dev scores. The animations are sophisticated: project transitions, theme switching, custom loader, interactive 404.

**Patterns worth stealing:**
- **Theme switcher as interaction:** Dark/light toggle as a site feature, not an afterthought. Makes the user feel agency.
- **Project listing with scroll-synchronized reveal:** Projects animate in as the user scrolls through the listing.
- **Custom loader animation:** Instead of a plain loading screen, a short animation introduces the site. Sets tone before first content appears. Should complete in under 1.5s.
- **Interactive 404:** The error page is a feature, not a dead end. Shows attention to craft.

**Verdict:** The 8.60 dev score signals that technical execution is visible. Steal the loader pattern (short, purposeful) and the project transition pattern. Skip the theme switcher complexity for now.

---

### Rauno Freiberg — Portfolio 2025 (Awwwards Honorable Mention)
**URL:** See rauno.me above  
**Award:** Awwwards Honorable Mention, September 2025  
**Scores:** 7.0–9.3 from jury (range indicates bold/polarizing design)  

Already covered under Tier 1. The key additional note: the minimap navigation element is what earned jury praise. It's a functional innovation, not decoration.

---

### Valentina Pastushenko — Minimalistic Portfolio 2025
**Award:** Awwwards Honorable Mention, September 15, 2025  
**Jury quote:** "Nothing here is superfluous, no visual clutter — just calm, smooth design. 1 simple font, 2 font sizes, 3 colours."  
**Score:** Up to 9.70 from individual jurors  

**What it proves:** Extreme restraint can score higher than maximum complexity. The discipline of committing to 1 font / 2 sizes / 3 colors forces every decision to be intentional.

**Pattern worth stealing:**
- **The 1-2-3 constraint rule:** Define your constraints before building. 1 font family (with weights), 2 base sizes (heading + body), 3 colors (background, text, accent). Then hold the line.

**Verdict:** The constraint rule is a mental model, not a design spec to copy. Apply it as a discipline: every new design element must justify itself against the constraint.

---

### Pretty Good Human (Lyuba Nova) — Animated Typography Portfolio
**URL:** prettygoodhuman.com  
**Award:** Awwwards inspiration feature  

**What makes it notable:** Typography IS the design. Animated letterforms, scroll-triggered text interactions, minimal imagery. The type moves to guide the eye.

**Patterns worth stealing:**
- **Menu scroll interaction:** The navigation animates in and out as a scroll gesture, not a click.
- **Typography as visual element:** Large display text set as a background graphic element behind smaller content text.
- **Scroll-triggered text reveal:** Lines of text reveal character-by-character or word-by-word as the user scrolls into the section.

**Verdict:** The animated typography approach works for an FP&A/AI narrative because numbers and words are the medium. A stat like "$2.3M budget consolidated" revealed character-by-character is more impactful than a chart.

---

### Bruno Simon — Portfolio (FWA + Awwwards Site of Month)
**URL:** https://bruno-simon.com  
**Awards:** Awwwards Site of the Month, FWA recognition  
**Built with:** Three.js, Cannon.js physics  

**What it is:** Drive a toy car around a 3D world to explore projects. The most technically impressive developer portfolio ever built.

**Relevance to FP&A/AI builder portfolio:** Low for direct copying. The car-driving mechanic is only compelling when your identity IS creative WebGL development. For an FP&A analyst, it would feel like a costume.

**Pattern worth considering (abstracted):**
- **Navigation as discovery:** Instead of a standard nav menu, the act of exploring reveals content. Could be implemented far more simply as a "choose your path" landing with two clear tracks: "See the tools I've built" vs. "Read how I think."
- **Open-source transparency:** Bruno's portfolio code is publicly available. Publishing your portfolio code (if built well) is itself a credibility signal for a developer audience.

**Verdict:** Don't copy the mechanic. Steal the philosophy: "make navigation itself feel like something."

---

## Tier 3: Patterns Without Specific Site Attribution

These patterns appear across multiple award-winning sites and are worth implementing regardless of which specific site originated them.

---

## Animation Patterns: Worth Implementing vs. Eye Candy

### Worth Implementing

**1. Scroll-Triggered Line Reveal (GSAP SplitText)**
Lines of text are split into individual `<span>` elements, then each line reveals upward from a clip-mask as it enters the viewport. The standard pattern:
- `gsap.set('.line', { yPercent: 100, overflow: 'hidden' })`
- `ScrollTrigger` triggers `yPercent: 0` with `stagger: 0.1`
- Alternative: CSS `clip-path` approach with `animation-timeline: scroll()`

**Why it serves the narrative:** Reveals information in reading order, doesn't bury the lede. Works especially well for the hero statement and the "what I've built" section headers.

**Implementation recommendation:** Use GSAP SplitText for character-level control on 2–3 key headings. Use CSS clip-path reveals for body paragraph entrances. Keep scrub duration under 0.4 seconds — too slow feels sluggish.

---

**2. Number Counter Animation (Scroll-Triggered)**
Stats count up from zero when they scroll into view. Libraries: CounterUp.js (IntersectionObserver), GSAP's `numericSuffix` approach.

Standard GSAP pattern:
```js
gsap.from('.stat-number', {
  textContent: 0,
  duration: 2,
  ease: 'power1.out',
  snap: { textContent: 1 },
  scrollTrigger: { trigger: '.stats-section', start: 'top 80%' }
})
```

**Why it serves the narrative:** An FP&A analyst works with numbers. "$2.3M in budget models automated" or "400+ hours saved annually" counting up to their final value is viscerally satisfying and memorable. The animation draws attention to the metric before the reader has processed it mentally.

**Specific stats to animate:**
- Dollar value of budgets/models built
- Number of API endpoints / integrations
- Hours automated / time saved
- Lines of production code
- Number of users of the tools built

**Verdict: High priority to implement.** This is the most direct translation of the FP&A/AI builder identity into a visual pattern.

---

**3. Staggered Card Entrance**
Project cards or work items animate in with a cascade: each card fades+slides up slightly, with a 80–120ms stagger between items.

**Why it works:** Creates a sense of "things being laid out before you" rather than a static dump of content. Feels like a presentation rather than a webpage.

**Implementation:** Framer Motion's `staggerChildren` in `variants` or GSAP `batch()` for multiple elements. Set the stagger to `0.08s` — enough to be visible, not enough to feel slow.

---

**4. Hover State on Project Rows (No Images)**
For text-based project listings (no screenshots), the hover state becomes the visual interest. Patterns that work:

- **Underline grow:** A line grows from left to right under the project title on hover
- **Background color fill:** The row background transitions from transparent to a very subtle amber/warm tone (e.g., `rgba(245, 158, 11, 0.06)`)
- **Arrow rotate:** A chevron or arrow icon rotates 45° on hover indicating "go deeper"
- **Year/tag slide in:** On hover, the project year or primary tag slides in from the right (was hidden, opacity 0)
- **Text weight shift:** The title increases in font-weight on hover (only works if you're using a variable font)

**Why it serves the narrative:** FP&A tools don't produce screenshots well — they're functional, not visual. Text-based project rows force the copy to carry the weight, which is appropriate for a finance/analytics context.

**Verdict: High priority.** Build project listings as styled table/list rows with these hover states, not cards with thumbnails.

---

**5. Magnetic Cursor / Button Effect**
The button or interactive element moves slightly toward the cursor as the cursor approaches, then snaps back when the cursor leaves. Creates a tactile "pull" sensation.

**Implementation sketch:**
```js
element.addEventListener('mousemove', (e) => {
  const rect = element.getBoundingClientRect()
  const x = e.clientX - rect.left - rect.width / 2
  const y = e.clientY - rect.top - rect.height / 2
  gsap.to(element, { x: x * 0.3, y: y * 0.3, duration: 0.3 })
})
element.addEventListener('mouseleave', () => {
  gsap.to(element, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' })
})
```

**Why it serves the narrative:** It's subtle enough not to be distracting, but it signals interaction craft. Apply it to the primary CTA (contact/email) and the nav links.

**Verdict: Medium priority.** Implement on 2–3 elements maximum. Magnetic effects on too many elements become annoying.

---

**6. Page/Section Loader**
A brief intro animation that plays on first load — typically 0.8–1.5 seconds. Common patterns:
- Name or initials appear and resolve
- A colored overlay sweeps across and off-screen
- The hero text reveals character by character

**Why it serves the narrative:** Sets the tone before the reader has formed an opinion. A clean, confident loader says "this person is deliberate."

**Implementation recommendation:** A simple overlay `div` that slides up (or fades) off the screen using CSS animation. The hero content starts at `opacity: 0` and fades in after the loader exits. No JavaScript required for this approach.

**Verdict: Medium priority.** Implement only if the total load time is fast enough that the loader doesn't feel like it's hiding a slow site.

---

**7. Scroll-Pinned Typography Section**
A section where the user scrolls while the section itself stays pinned, and text within the section changes (or reveals) based on scroll progress. Common use: displaying 3–4 core principles or capabilities one at a time while the user scrolls.

**GSAP pattern:**
```js
ScrollTrigger.create({
  trigger: '.pinned-section',
  start: 'top top',
  end: '+=2000',
  pin: true,
  scrub: 1,
})
```

**Why it could serve the narrative:** Ideal for displaying the "I do X, Y, Z" skills section as a sequence rather than a simultaneous list. Could work as: scroll through "FP&A" → "AI Tooling" → "Production APIs" — one identity beat at a time.

**Verdict: Consider for the skills/identity section.** Don't overuse pinning — if more than one section is pinned, the experience becomes claustrophobic.

---

### Eye Candy: Probably Skip

**WebGL / Three.js interactive environments**
Bruno Simon's car driving, Samsy's cyberpunk cityscape, Jordan Breton's floating island. These are spectacular but they signal "my identity IS creative web development." An FP&A analyst who builds AI tools does not benefit from spending 3 months building a Three.js world. The cost-to-narrative-fit ratio is terrible.

**Verdict: Skip unless WebGL IS the work.**

---

**Horizontal scroll sections**
Rauno uses these; they look great on desktop. Problems: mobile is broken or awkward without significant extra engineering, they break keyboard navigation, they're disorienting to users who are used to vertical scroll. The implementation complexity (GSAP + Locomotive Scroll or Lenis) is high.

**Verdict: Skip for v1.** Reconsider only if the project count is large enough to warrant a gallery format.

---

**Glassmorphism cards**
Frosted glass effect with animated glowing gradient borders. Very 2022–2023. Already looking dated by 2025 standards.

**Verdict: Skip entirely.**

---

**Particle / cursor trail effects**
Animated particles that follow the cursor or float in the background. Distracts from content, increases CPU usage, and signals "I found a tutorial" rather than "I made deliberate decisions."

**Verdict: Skip entirely.**

---

**Glitch effects / distortion transitions**
Futuristic, dark-themed layouts with glitchy transitions and text flicker effects. Excellent for cybersecurity or dark-arts creative dev. Wrong tone for finance/enterprise AI tooling.

**Verdict: Skip entirely.**

---

## Color Palette Recommendations

Based on surveyed award-winning dark portfolios and the target palette (dark + amber + blue):

### Primary Palette (Recommended)
```
Background:    #0A0A0A  (near-black, warmer than pure black)
Surface:       #111111  (slightly lifted surfaces)
Border:        #1F1F1F  (subtle dividers)
Text primary:  #F5F5F5  (off-white, not stark white)
Text muted:    #6B6B6B  (secondary info, dates, tags)
Accent amber:  #F59E0B  (primary accent, hover states, active links)
Accent blue:   #3B82F6  (secondary accent, code references, links)
```

**Why this works:**
- The near-black (#0A0A0A not #000000) prevents the "void" feeling of pure black
- Off-white (#F5F5F5) is easier to read on dark backgrounds for extended sessions
- Amber (#F59E0B) is warm, financial, and distinctive — it reads as "serious money" not "startup green"
- The amber+blue pairing is complementary without being garish

### Reference palette from research (Elegant & High-End from webportfolios.dev):
```
Background: #1C1C1C
Primary:    #BFA181  (Muted Gold)
Secondary:  #D4C5B0  (Warm Beige)
Accent:     #F4F4F4
```
This is the luxury/senior consultant variant. More restrained than amber. Could work for a portfolio targeting PE/hedge fund hiring managers rather than tech hiring managers.

---

## Typography Recommendations

Based on award-winning portfolio analysis:

**The 1-font-family rule (from Valentina Pastushenko's approach):**
Pick one variable font family. Use weight and size to create hierarchy, not multiple typefaces.

**Recommended:** `Inter` (web standard, excellent at small sizes, has variable font axis) or `Geist` (Vercel's font, signals technical credibility, slightly warmer than Inter).

**Scale (minimal, following 2-font-size philosophy):**
- Display/Hero: `clamp(3rem, 8vw, 7rem)` — large, confident
- Section headings: `clamp(1.5rem, 3vw, 2.5rem)`
- Body: `1rem / 1.6` line height
- Labels/Meta: `0.75rem` uppercase, `0.12em` letter spacing

**Kinetic typography use cases (from research):**
- Hero heading: Character-by-character reveal on load (GSAP SplitText or CSS `animation-delay` per `nth-child`)
- Section entry: Word-by-word reveal on scroll (the "reading reveal" pattern)
- Stats: Number counter on scroll-into-view
- Manifesto block (rauno-style): All caps, stacked, heavy weight

---

## Navigation Patterns

**Recommended approach:** Hybrid of brittanychiang.com and leerob.com.

- **Mobile:** Hamburger → full-screen overlay menu with large animated links
- **Desktop:** Two options, pick one:
  - Fixed left sidebar (brittany's pattern) — best for long single-page scroll
  - Minimal top header that disappears on scroll-down, reappears on scroll-up — best for multi-page

**Scrollspy:** Highlight the active section in the nav as the user scrolls. Essential for a single-page layout. Implementation: IntersectionObserver watching section `id` elements.

**Anchor links with smooth scroll:** `scroll-behavior: smooth` in CSS, or Lenis for a momentum-based smooth scroll library. Lenis is the current standard (replaces Locomotive Scroll for most use cases).

---

## Project Display Patterns (No Images)

Since FP&A tools, financial models, and API SDKs don't photograph well, the project display must work without screenshots. Patterns that work:

**Pattern A: Styled Table Row**
```
[Project Name]          [Year]    [Tags: Python, Claude API, Oracle]
Brief one-line description of what it does and what it replaced
→ (arrow appears on hover, links to case study)
```
Hover state: amber background fill on the row, underline on name, arrow rotates to 45°.

**Pattern B: Case Study Card (Text Only)**
Each project gets a numbered card:
```
01
[Project Name]
[What it replaced / what problem it solved]
[Measurable outcome: "$X saved", "N hours automated"]
[Tech stack as tags]
```
Card border illuminates on hover with an amber glow (`box-shadow: 0 0 0 1px rgba(245,158,11,0.4)`).

**Pattern C: The "Work" Index (leerob-inspired)**
A simple prose-linked list: "Built [nspb-api], an SDK that automated Oracle EPM Cloud workflows for FP&A teams. [Read more →]"

**Recommended for first build:** Pattern A (table rows) for the primary projects section. Pattern C for the about/intro section where you mention work in prose context.

---

## Key Sites to Revisit Directly

Sites that were award-winning but couldn't be fully analyzed from fetch (visit these with DevTools open):

| Site | Why |
|------|-----|
| https://prettygoodhuman.com | Typography animation patterns |
| https://finethought.com.au | Minimalist web engineer, subtle interactivity |
| https://obys.agency | Typography + grid + motion standards |
| https://jordan-delcros.com | WebGL + animation storytelling |
| https://clementgrellier.fr | Pixel-perfect front-end, micro-interactions |
| https://v4.brittanychiang.com | The v4 (older) version has the clearest two-column layout |
| https://rauno.me | Minimap nav, manifesto footer, horizontal gallery |

---

## Summary: What to Build

Ranked by narrative fit for "FP&A analyst who builds production tools with AI":

### Build These (High Priority)
1. **Number counter animations on stats** — The #1 pattern that serves the narrative. "$2.3M", "400 hours", "6 API endpoints" counting up is visceral and memorable.
2. **Text-based project rows with hover states** — No screenshots needed. Amber background fill + arrow reveal on hover.
3. **Scroll-triggered line/word reveals** — For section headings and the hero statement. Use CSS clip-path for simplicity, GSAP SplitText for 2-3 key moments.
4. **Staggered entrance animations** — For the project list and skills section. 80ms stagger, fade+slide.
5. **Manifesto-style text block** — Rauno's stacked imperatives adapted for FP&A/AI: "Built for real constraints. Shipped with real data. Measured in dollars saved."
6. **Inline contextual linking** — In the about prose, hyperlink companies, tools, and projects rather than using separate sections.

### Build These (Medium Priority)
7. **Magnetic button effect** — On the contact CTA and primary links. 2–3 elements max.
8. **Simple page loader** — Overlay that sweeps off on load. Under 1 second. Sets tone.
9. **Scrollspy nav highlighting** — Active section indicator in the nav. Pairs with sticky sidebar.
10. **View Transitions API for page navigation** — If building multi-page. CSS-native, no JS library.

### Consider Later (Lower Priority)
11. **Scroll-pinned skills/identity section** — If the skills list needs more than 4-5 items.
12. **Minimap navigation element** — Worth building if the page is long (5+ major sections).
13. **Temporal versioning links** — Archive links to previous portfolio versions (rauno's pattern). Only matters once there's a v2.

### Skip (Poor Narrative Fit)
- Three.js / WebGL interactive environments
- Horizontal scroll sections (mobile cost too high)
- Glitch/distortion effects
- Particle systems and cursor trails
- Glassmorphism
- Theme switcher complexity in v1

---

*Research conducted May 2026. Sources: Awwwards, CSS Design Awards, FWA, Muzli, Colorlib, CreativeDevJobs, webportfolios.dev, GSAP documentation, Tympanus/Codrops, Dribbble, leerob.com, rauno.me, brittanychiang.com direct fetches.*
