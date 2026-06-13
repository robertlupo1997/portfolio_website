# Design Review: treylupo.com Portfolio

## What this is

Personal portfolio for Trey Lupo, an FP&A analyst who builds production AI/ML tools. Built with React 19 + Vite + GSAP + Lenis. The design direction is called "The Invisible Frame" — the site infrastructure disappears so the work speaks.

The 10 attached screenshots show the current live build: hero, three featured project entries, the all-work list with a cursor-follow preview, about section, skills/timeline, footer, and two mobile views.

## What I need from you

### 1. Layout & composition critique

Review the spatial relationships across all sections. Specifically:

- Is the vertical rhythm between sections working, or do some transitions feel abrupt/loose?
- Do the featured project entries have enough visual weight against the void background?
- Is the about section composition (left statement / right body) balanced?
- Does the footer feel like a proper conclusion or does it just stop?
- Mobile: does the hierarchy hold on a 390px viewport?

### 2. Typography recommendation

The current system uses **Satoshi** (sans-serif, 400/500) for all hierarchy through scale alone, with **JetBrains Mono** (monospace) for labels/metadata at small sizes. I want your opinion:

- Is Satoshi the right primary typeface for this personality (precise, inventive, grounded — "quietly excellent")?
- Would a different sans-serif carry more authority at display sizes (8rem hero name)? Consider: Inter, Geist, Instrument Sans, General Sans, Switzer, Outfit, Space Grotesk, or anything else you'd recommend.
- Should the mono stay JetBrains Mono, or would Geist Mono / IBM Plex Mono / Berkeley Mono better match the primary?
- Is the scale ratio right? Currently: display 8rem → headline 3rem → body 0.95rem → label 0.7rem.

### 3. What NOT to change

These are locked decisions — don't suggest alternatives:

- **Color strategy:** Restrained. Tinted neutrals + one accent (signal blue #0066FF) at <10%. No warm tones in chrome. Projects provide color.
- **Motion:** GSAP + Lenis, expo.out easing, line-mask text reveals, no bounce/elastic.
- **Corners:** Square everywhere, zero border radius.
- **Elevation:** Flat, no shadows. Depth through tonal layering only.
- **Register:** This is brand (not product UI).

---

## PRODUCT.md (brand context)

### Users

Three audiences, weighted equally:

1. **Technical hiring managers** at AI/ML-adjacent companies evaluating engineering depth. They scan for evidence of shipped systems, not academic exercises. Context: reviewing candidates on a laptop, skimming fast, comparing against 20 other portfolios.
2. **Finance/fintech hiring managers** who need the rare FP&A + engineering bridge. Context: forwarded a link from a recruiter, skeptical until proven otherwise.
3. **Open source developers** arriving from GitHub. They want to see what else this person builds.

### Brand Personality

**Precise, inventive, grounded.**

- Precise: every element earns its place.
- Inventive: shows creative range through selective, surprising choices. The surprise comes from restraint broken deliberately.
- Grounded: real work, real constraints, real outcomes.

Emotional target: the visitor should feel "this person is quietly excellent" within 5 seconds.

### Design Principles

1. **The frame disappears.** Site infrastructure is nearly invisible. Monochrome, structural, quiet.
2. **Varied rhythm over uniform grids.** Each project entry has its own visual weight.
3. **Evidence over assertion.** Show the work, the metrics, the stack.
4. **Selective surprise.** One bold typographic moment. One unexpected interaction. Restraint makes the surprise land harder.
5. **Respect the visitor's time.** Scannable in 30 seconds, rewarding in 3 minutes.

### Anti-references

- Hero-metric template (big number + small label + gradient accent)
- Identical card grids
- Editorial-typographic lane (display serif + mono labels) — second-order AI reflex for "not-SaaS" portfolios
- SaaS/startup aesthetic (gradient blobs, cream + purple)
- Decorative chrome that competes with the work

### References

- simonholm.studio — varied aspect ratios, numbered project index
- Pangram Pangram type specimens — layout logic, near-black background
- leerob.io — clean engineer portfolio
- zajno.com — scroll-linked motion, extreme scale contrast
- rauno.me — quiet confidence, two-color restraint

---

## DESIGN.md (current tokens)

### Colors — The Void Palette

- Void: #0A0A0B (primary bg, subtle blue-violet tint)
- Surface Deep: #111113 (cards, alternate sections)
- Surface Raised: #18181B (hover states)
- Text Bright: #E8E8EE (primary text, slightly blue-tinted)
- Text Mid: #888899 (secondary text)
- Text Quiet: #7A7A8C (metadata — adjusted for WCAG AA)
- Signal Blue: #0066FF (interactive elements only, <10% of surface)
- Border Faint: rgba(255,255,255,0.06)
- Border Visible: rgba(255,255,255,0.15)

### Typography (current)

- Display: Satoshi 500, clamp(3.2rem, 8vw, 8rem), line-height 0.85, tracking -0.04em
- Headline: Satoshi 500, clamp(1.8rem, 4vw, 3rem), line-height 0.9, tracking -0.03em
- Body: Satoshi 400, 0.95rem, line-height 1.5
- Label: JetBrains Mono 400, 0.65-0.7rem, tracking 0.15em, lowercase
- Number: Mono 500, 4.5rem, opacity 0.3

### Rules

- Body line length capped at 65ch
- Mono never exceeds 0.8rem
- No shadows anywhere
- Square corners on everything
- Expo ease-out on all motion
