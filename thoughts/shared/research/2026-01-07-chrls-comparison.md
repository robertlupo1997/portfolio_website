# Research: CHRLS Design Comparison Analysis

**Date**: 2026-01-07
**Branch**: master

## Research Question
Compare rlupo-portfolio implementation against chrls-download reference files. Find differences in CSS classes, HTML structure, styling, and any missing features between the current portfolio and the original CHRLS design.

## Summary

The rlupo-portfolio faithfully recreates the core CHRLS visual design including layout structure, color palette, typography hierarchy, and key CSS classes. However, several advanced features are missing: **3D perspective card stacking**, **scroll-based sticky animations**, **custom cursor effects**, **preloader animation**, and **decorative GIF assets**. The implementation uses different fonts (Satoshi/Space Mono vs Neue Montreal/NeueBit) and simplifies certain structural elements.

## Detailed Findings

### CSS Variables Comparison

| Variable | CHRLS Original | rlupo-portfolio | Match |
|----------|---------------|-----------------|-------|
| `--white-smoke` | `#ebebeb` | `#ebebeb` | ✅ |
| `--black` | `#0f0f0f` | `#0f0f0f` | ✅ |
| `--coral` | `#ff6d1b` | `#ff6d1b` | ✅ |
| `--light-cyan` | `#d1ecee` | `#d1ecee` | ✅ |
| `--medium-spring-green` | `#00ffa3` | `#00ffa3` (as spring-green) | ✅ |
| `--yellow` | `#dbff00` | `#dbff00` | ✅ |
| `--cyan` | `#00f0ff` | `#00f0ff` | ✅ |

### Typography Differences

| Element | CHRLS Original | rlupo-portfolio |
|---------|---------------|-----------------|
| Body font | `Neue Montreal, sans-serif` | `'Satoshi', sans-serif` |
| Display font | `NeueBit, sans-serif` | `'Space Mono', monospace` |
| Font files | Local WOFF2 files | Google Fonts + Fontshare CDN |

### Structural Differences by Section

#### Navigation
| Element | CHRLS | rlupo-portfolio | Status |
|---------|-------|-----------------|--------|
| Logo | `<img src="logo.svg">` | Inline `<svg>` | Modified |
| Order | logo → nav_group → barcode | logo → barcode → nav_group | Different |
| Say Hello | Nested in nav_group | Not present | Missing |
| Archive link | Present | Not present | Missing |
| Mobile menu | Not present | Added button + overlay | Added |

#### Hero Section
| Element | CHRLS | rlupo-portfolio | Status |
|---------|-------|-----------------|--------|
| Photo hole | `<img class="home_gif hero">` | `<span>[PHOTO]</span>` | Placeholder |
| Label columns | 3 holder divs | 2 holder divs | Simplified |
| Dashes GIF | `<div class="hero_gif-holder">` with GIF | Not present | Missing |

#### Projects Section
| Element | CHRLS | rlupo-portfolio | Status |
|---------|-------|-----------------|--------|
| Track height | `height: 650vw` | `height: auto` | Simplified |
| Wrapper | `home_project-wrapper` with sticky | Not present | Missing |
| 3D perspective | `perspective: 300vw`, `translate3d()` | None | Missing |
| Card positioning | Absolute with z-index stacking | Grid layout | Different |
| Card modifiers | `._1` through `._6` classes | None | Missing |
| Project images | `<img class="home_project-img">` | `<span>` with category | Placeholder |
| QR codes | `<img class="home_project-qr">` | Not present | Missing |
| Background text | Single `<h2>` | Four repeated `<h2>` | Different |

#### About Section
| Element | CHRLS | rlupo-portfolio | Status |
|---------|-------|-----------------|--------|
| Container | `home_about-container` wrapper | Direct children | Simplified |
| Section height | `height: 180vh` | `min-height: 100vh` | Different |
| Sticky wrapper | `position: sticky` | Not sticky | Missing |
| GIF in intholder | `<img class="home_gif about-para">` | Not present | Missing |
| GIF in awards | `<img class="home_gif about_awards">` | Not present | Missing |

#### Footer Section
| Element | CHRLS | rlupo-portfolio | Status |
|---------|-------|-----------------|--------|
| Wave icon | `<img src="wave.svg">` | `<span>👋</span>` emoji | Modified |
| Social links | 5 (Instagram, Twitter, LinkedIn, Discord, CodeSandbox) | 3 (GitHub, LinkedIn, HuggingFace) | Different |
| Attribution | Not present | Added with CHRLS credit | Added |

### Missing CSS Features

#### 3D Card Stacking System
```css
/* CHRLS Original - NOT in rlupo-portfolio */
.home_project-content {
  perspective: 300vw;
  transform: perspective(275px);
}
.home_project-card {
  perspective: 353px;
  position: absolute;
  transform: perspective(784px);
}
.home_project-card._1 { transform: translate3d(0%, 0, -25em); }
.home_project-card._2 { transform: translate3d(0%, 0, -20em); }
.home_project-card._3 { transform: translate3d(0%, 0, -15em); }
.home_project-card._4 { transform: translate3d(0%, 0, -10em); }
.home_project-card._5 { transform: translate3d(0%, 0, -5em); }
.home_project-card._6 { transform: translate3d(0%, 0, 0); }
```

#### Scroll-Based Sticky Container
```css
/* CHRLS Original - NOT in rlupo-portfolio */
.home_project-track {
  height: 650vw; /* Creates long scroll area */
}
.home_project-wrapper {
  height: 100vh;
  position: sticky;
  top: 0;
  overflow: hidden;
}
```

#### Custom Cursor Effects
```css
/* CHRLS Original - NOT in rlupo-portfolio */
.project_cursor {
  background-color: var(--medium-spring-green);
  border-radius: 50%;
  width: 6em;
  height: 6em;
}
.cursor_pad {
  mix-blend-mode: difference;
  position: fixed;
  inset: 0%;
}
```

#### Preloader Animation
```css
/* CHRLS Original - NOT in rlupo-portfolio */
.preloader {
  z-index: 100;
  width: 100vw;
  height: 100vh;
  position: fixed;
}
.preloader_bar {
  background-color: var(--black);
  width: 100%;
  height: 100%;
  position: absolute;
}
```

### Missing Assets

| Asset | CHRLS Location | rlupo-portfolio Status |
|-------|----------------|----------------------|
| `logo.svg` | `images/logo.svg` | Uses inline SVG instead |
| `hero-gif.gif` | `images/hero-gif.gif` | Missing |
| `dashes.gif` | `images/dashes.gif` | Missing |
| `reminder.gif` | `images/reminder.gif` | Missing |
| `about-gif.gif` | `images/about-gif.gif` | Missing |
| `awards-gif.gif` | `images/awards-gif.gif` | Missing |
| `qr.svg` | `images/qr.svg` | Missing |
| `wave.svg` | `images/wave.svg` | Uses emoji instead |
| `project-*.jpg` | `images/project-*.jpg` | Using text placeholders |
| `NeueMontreal-*.woff2` | `fonts/` | Using Satoshi CDN |
| `NeueBit-Bold.woff2` | `fonts/` | Using Space Mono CDN |

### CSS Classes Comparison

#### Present in Both (Matching)
- `.nav`, `.nav_logo`, `.nav_group`
- `.barcode`, `.barcode_holder`, `.barcode_avail`, `.barcode_time`
- `.section.hero`, `.hero_title-holder`, `.hero_title`, `.hero_splitter`
- `.hero_label-wrapper`, `.hero_label-col`, `.hero_label-paragraph`
- `.section.project`, `.home_project-track`, `.home_project-bg`
- `.home_project-content`, `.home_project-card`, `.home_project-contentholder`
- `.home_project-descholder`, `.home_project-title`, `.home_project-braille`
- `.section.about`, `.home_about-wrapper`, `.home_about-bg`, `.home_about-col`
- `.home_about-bigtextholder`, `.home_about-intholder`, `.home_about-para`
- `.section.footer`, `.footer_group`, `.footer_title-holder`, `.footer_title`
- `.footer_splitter`, `.footer_email`, `.footer_social`, `.noise`

#### Present in CHRLS Only (Missing)
- `.nav_logo.w--current`, `.nav_hello`
- `.hero_label-mask`, `.hero_label-main`, `.hero_gif-holder`
- `.home_project-wrapper`, `.home_project-hortrack`
- `.home_project-card._1` through `._6`
- `.home_project-img`, `.home_project-qr`
- `.home_project-mobileback`, `.home_view-btn`
- `.home_about-container`
- `.home_gif`, `.home_gif.dashes`, `.home_gif.about-para`
- `.preloader`, `.preloader_num`, `.preloader_bar`
- `.project_cursor`, `.cursor_pad`
- `.grid`, `.grid.js-grid`, `.js-plane`
- `.gallery_content`, `.gallery_text`
- `._404wraper`, `._404_block`, `._404_center`
- `.mobile_archive`, `.archive_span`

#### Present in rlupo-portfolio Only (Added)
- `.nav_link`, `.nav_mobile-btn`, `.nav_mobile-menu`, `.nav_mobile-link`
- `.home_project-track.view-all`, `.home_project-content.view-all`
- `.footer_attribution`

### Responsive Breakpoints

| Breakpoint | CHRLS | rlupo-portfolio | Match |
|------------|-------|-----------------|-------|
| Tablet | `991px` | `991px` | ✅ |
| Mobile | `767px` | `767px` | ✅ |
| Small Mobile | `479px` | `479px` | ✅ |

### Animation Differences

| Animation | CHRLS | rlupo-portfolio |
|-----------|-------|-----------------|
| Marquee | Not explicitly defined in CSS | `@keyframes marquee-bg` 20s linear |
| Card hover | Not in main CSS | `transform: translateY(-8px)` with shadow |
| Link hover | Background color swap on 404 links | Color transition only |
| Preloader | Bar animation | Not implemented |

## Browser Visual Comparison

### CHRLS.design (Live Site)
- **Header**: Geometric mandala logo, "Say hello" with email, "ARCHIVE" link
- **Hero**: "CHRLS.DSGN" with animated GIF in photo hole, decorative binary patterns
- **Projects**: 3D stacked cards with perspective depth, scroll-based animation
- **About**: "CREATIVELY DRIVEN A DESIGNER" with diagonal stripe patterns, dot grids
- **Footer**: Wave icon SVG, 5 social links, giant brand text
- **Overall**: Cyberpunk/retro-tech aesthetic with awards display

### localhost:3004 (rlupo-portfolio)
- **Header**: Checkerboard 2x2 logo, simplified nav with Work/About/Contact
- **Hero**: "TREY.ML" with [PHOTO] placeholder, clean info box
- **Projects**: Grid layout (no 3D), animated marquee stripes, ticket-style cards
- **About**: "ML ENGINEER & DATA SCIENTIST" with credentials grid
- **Footer**: Wave emoji, 3 social links, CHRLS attribution
- **Overall**: Clean professional aesthetic, ML/data science focused

## Code References

### CHRLS Reference Files
- `chrls-download/index.html` - Main HTML structure
- `chrls-download/css/chrlsfolio.css` - Custom styles (327 lines)
- `chrls-download/css/components.css` - Webflow component library
- `chrls-download/css/normalize.css` - CSS reset

### rlupo-portfolio Implementation
- `rlupo-portfolio/index.html:20-782` - Embedded CSS
- `rlupo-portfolio/App.tsx:1-67` - Main component structure
- `rlupo-portfolio/components/Header.tsx:1-76` - Navigation
- `rlupo-portfolio/components/Hero.tsx:1-70` - Hero section
- `rlupo-portfolio/components/ProjectCard.tsx:1-82` - Project cards
- `rlupo-portfolio/components/About.tsx:1-77` - About section
- `rlupo-portfolio/components/Footer.tsx:1-47` - Footer

## Summary Table

| Category | CHRLS Features | rlupo-portfolio | Completion |
|----------|---------------|-----------------|------------|
| Color palette | 7 variables | 7 variables | 100% |
| Layout structure | 5 sections | 5 sections | 100% |
| CSS classes | ~80 classes | ~60 classes | 75% |
| Typography | 2 custom fonts | 2 CDN fonts | Modified |
| 3D effects | Full perspective system | None | 0% |
| Scroll animations | Sticky + 650vw track | Simple scroll | 0% |
| Custom cursor | Implemented | None | 0% |
| Preloader | Implemented | None | 0% |
| GIF assets | 6 decorative GIFs | 1 (grain.gif) | 17% |
| Responsive | 3 breakpoints | 3 breakpoints | 100% |
| Mobile menu | Not present | Added | Added |

## Open Questions

1. Should 3D card stacking be implemented? (Significant complexity increase)
2. Should scroll-based sticky animation be added? (Requires JavaScript)
3. Are the missing GIF assets available for use? (Copyright consideration)
4. Should custom fonts be purchased/licensed? (NeueMontreal, NeueBit)
5. Is preloader animation desired for the portfolio?
