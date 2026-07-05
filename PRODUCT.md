# Product

## Register

brand

## Users

Three audiences, weighted equally:

1. **Technical hiring managers** at AI/ML-adjacent companies evaluating engineering depth. They scan for evidence of shipped systems, not academic exercises. Context: reviewing candidates on a laptop, skimming fast, comparing against 20 other portfolios.
2. **Finance/fintech hiring managers** who need the rare FP&A + engineering bridge. They're looking for someone who understands the domain AND builds tooling. Context: forwarded a link from a recruiter, skeptical until proven otherwise.
3. **Open source developers** arriving from GitHub. They want to see what else this person builds, whether the code quality extends beyond a single repo. Context: clicked a profile link from a README.

## Product Purpose

Personal portfolio for Trey Lupo, an FP&A analyst who builds production tools with AI. The site exists to convert a visitor into a conversation: a recruiter reaching out, a hiring manager scheduling a call, a developer starring a repo.

Success looks like: a hiring manager spends 90 seconds on the site, understands the narrative ("analyst who ships real software"), clicks through to one project, and opens their email client.

## Brand Personality

**Precise, inventive, grounded.**

- Precise: every element earns its place. No filler, no decoration for its own sake.
- Inventive: shows creative range through selective, surprising choices. Not uniformly creative; the surprise comes from restraint broken deliberately.
- Grounded: real work, real constraints, real outcomes. The portfolio of someone who ships, not someone who dreams.

Emotional target: the visitor should feel "this person is quietly excellent" within 5 seconds.

## References

- **simonholm.studio** — Numbered project index with varied aspect ratios and visual weight per entry. Some full-width, some contained. The list feels alive, not templated.
- **Pangram Pangram type specimen layouts** (Right Serif Mono) — Not the typography; the layout logic and palette. Near-black background, monochrome infrastructure, actual content provides all warmth and color. Nothing decorates the container.
- **leerob.io** — Clean engineer portfolio. Simple typography, good spacing, lets the work speak. Design-aware without trying too hard.
- **zajno.com** — Scroll-linked motion, flex-based layout, single-weight typography with extreme scale contrast. Atmospheric entrance reveals.
- **rauno.me** — Quiet confidence. Two-color restraint, manifesto footer, minimap navigation.

What to extract from these references:
- The frame disappears and the work speaks
- Monochrome infrastructure; project work provides all color and warmth
- Large-format project imagery that bleeds with minimal padding
- Varied visual weight across project entries (not a uniform grid)
- Sparse navigation that stays out of the way

## Anti-references

- **Hero-metric template**: big number + small label + gradient accent. SaaS cliche.
- **Identical card grids**: same-sized cards with icon + heading + text, repeated endlessly.
- **Editorial-typographic lane**: display serif + mono labels + monochromatic restraint. The second-order AI reflex for "not-SaaS" portfolios.
- **SaaS/startup aesthetic**: gradient blobs, "trusted by" logos, pricing-page energy, cream backgrounds with purple accents.
- **Decorative chrome**: the container should be invisible. No ornamental borders, no accent stripes, no background patterns that compete with the work.

## Design Principles

1. **The frame disappears.** The site infrastructure (nav, background, spacing) should be nearly invisible. Monochrome, structural, quiet. The projects themselves provide all visual interest.
2. **Varied rhythm over uniform grids.** Each project entry should have its own visual weight, aspect ratio, and density. A list that breathes, not a template stamped N times.
3. **Evidence over assertion.** Show the work, the metrics, the stack. Don't tell visitors you're good; let the projects prove it. Every claim backs up with something concrete.
4. **Selective surprise.** One bold typographic moment. One unexpected interaction. Not everything animated, not everything clever. Restraint makes the surprise land harder.
5. **Respect the visitor's time.** Scannable in 30 seconds, rewarding in 3 minutes. Clear hierarchy so a fast scanner gets the narrative without scrolling past the fold.

## Accessibility & Inclusion

- WCAG AA compliance (4.5:1 contrast ratio for normal text, 3:1 for large text)
- Keyboard navigable with visible focus indicators
- Reduced motion respected via `prefers-reduced-motion`
- Semantic HTML with proper heading hierarchy
- Skip-to-content link
- Alt text for any project imagery
