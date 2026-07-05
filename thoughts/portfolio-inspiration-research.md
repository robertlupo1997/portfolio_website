# Portfolio Inspiration Research (2026-06-13)

Source: Claude.ai deep research task. Searched for dark, industrial, machine-like portfolio sites
for an AI/ML + generative-art personal brand.

## User's four favorites

1. **stabondar.com** — Bayer-matrix dithering shader, character scramble, physics-based mouse interaction, Matter.js on SplitText characters. PP Supply Mono primary. #111111 + #EB4330.
2. **2025.unseen.co** — ASCII liquid simulation (fluid sim rendered as ASCII chars), scroll-driven timeline, strict 2-color (#010101 + #E4B504 amber/gold).
3. **francescomichelini.com** — P/01 labeling system, structural restraint. Accent is actually `#C4FF58` acid yellow-green (not "cool graphite" as erroneously reported).
4. **elliott.mangham.dev** — Credential density, single-page proof stacking. Won SOTD with GSAP + Vite only — no Three.js, no WebGL, no Barba.js. Proves award-level dark portfolios don't require a 3D pipeline.

## Five portfolios analyzed

| # | Site | Palette | Memorable design decision |
|---|------|---------|---------------------------|
| 1 | robin-mastromarino.com | #000 / #fff | WebGL slider with displacement deformations proportional to scroll/drag velocity — imagery stretches and snaps back based on force |
| 2 | lusion.co | #000 / #fff | Real-time WebGL cloth simulation as showreel (computed live, not pre-rendered) on single long-scroll |
| 3 | dennissnellenberg.com | #1C1D20 / #455CE9 | Barba.js full-page transitions tied to Locomotive Scroll inertia — navigation feels like one continuous mechanism |
| 4 | p5aholic.me | Dark + mono theme | Built-in Light/Dark/Monospaced theme switch — "Monospaced" mode re-renders entire site in fixed-width typeface |
| 5 | isabelmoranta.com | #080808 | Dual typography — monospace for technical copy, serif (Ogg) for personal voice — projects emerge from darkness like gallery walls |

## Three non-portfolio references

| # | Site | Technique |
|---|------|-----------|
| 1 | igloo.inc | Entire UI rendered in WebGL (not HTML). Text glitches via SDF shaders. Footer is fluid particle sim where particles change color based on speed. SOTY 2024. |
| 2 | resend.com | Monospace typefaces as accents on near-black. Engineering precision signal without 3D overhead. |
| 3 | linear.app | Near-black + subtle gradient-mesh glows. 2025 redesign stripped to monochrome. Inter as workhorse. "Instrument" not "SaaS." |

## Two Awwwards 2025-2026 winners

| # | Site | Date | Palette | Signature device |
|---|------|------|---------|------------------|
| 1 | stabondar.com | SOTD Feb 14 2025 | #111111 / #EB4330 | Rotating 3D cube + physics mouse interaction + GSAP+Three.js. Bayer dithering on project images. |
| 2 | 2025.unseen.co | SOTD Mar 24 2026 | #010101 / #E4B504 | ASCII liquid simulation on scroll-driven chronological timeline. |

## Shared patterns

1. **Strict 2-color palette** — near-black + one accent. Third hue = template territory.
2. **One hero "machine"** — single engineered interaction gets full investment; everything else quiet.
3. **Monospace as engineering signal** — JetBrains Mono / Geist Mono / Berkeley Mono for nav, labels, metadata.
4. **Motion concentrated, not distributed** — signature device gets polish; no scattered micro-interactions.
5. **Common toolchain** — GSAP + Three.js/WebGL + Lenis (or Locomotive Scroll).

## Accent color spectrum across references

```
#FFFFFF (Mastromarino, Lusion) ─── pure monochrome
#455CE9 (Snellenberg) ────────── electric blue
#C4FF58 (Michelini) ──────────── acid terminal green
#C87533 (proposed copper) ────── warm metallic
#E4B504 (Unseen) ─────────────── editorial gold
#EB4330 (Stas Bondar) ────────── industrial red-orange
```

User's instinct is warm — 3 of 4 favorites have warm accents. The proposed copper sits between Unseen's gold and Stas's red-orange.

## Excluded sites (with reasons)

- **Jordan Delcros** — light-themed per Awwwards palette (#C7CEDC). Often grouped with dark portfolios but isn't one.
- **Patrick Heng** — light-themed (#ffffff). Technical pedigree but wrong aesthetic register.
- **Bruno Simon** — colorful driving game. Celebrated but not dark/industrial.
- **Chungi Yoo** — deliberately colorful, wrong register.

## Build strategy (from research synthesis)

1. Lock 2-color system first. If you reach for a third hue, you're drifting toward template.
2. Choose ONE hero machine. Given generative-art + precision-systems angle: particle field or shader piece reacting to cursor velocity.
3. Use monospace as engineering tell (already doing this with JetBrains Mono).
4. Stage the build: static dark layout → project cards → credential strip → project detail → GSAP reveals → character scramble → generative hero last (site is shippable without it).
5. Gate hero performance: if <30fps on mobile, show static frame.
