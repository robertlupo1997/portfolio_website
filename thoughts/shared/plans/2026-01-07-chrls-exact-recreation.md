# CHRLS.design Exact Recreation Implementation Plan

## Overview

This plan transforms the rlupo-portfolio to exactly match chrls.design, implementing all missing features: 3D perspective card stacking, scroll-based sticky animations, custom cursor effects, preloader animation, and all decorative assets. The implementation preserves the ML/Data Science content while achieving visual parity with CHRLS.

## Current State Analysis

The portfolio has the core CHRLS layout and color palette but is missing:
- 3D card stacking with `translate3d()` depth layering
- Scroll-based sticky container (650vw track height)
- `home_project-wrapper` and `home_about-container` structural divs
- Navigation "Say hello" section
- Preloader animation
- Custom cursor effects
- Decorative GIF assets (hero, dashes, about, awards, reminder)
- QR codes on project cards
- Wave SVG icon in footer

### Key File References:
- `rlupo-portfolio/index.html:20-782` - Embedded CSS
- `rlupo-portfolio/App.tsx` - Main component (needs wrapper restructure)
- `rlupo-portfolio/components/Header.tsx` - Navigation (needs Say Hello)
- `rlupo-portfolio/components/About.tsx` - About section (needs container wrapper)
- `rlupo-portfolio/components/ProjectCard.tsx` - Cards (needs 3D classes)
- `chrls-download/css/chrlsfolio.css` - Reference CSS

## Desired End State

A portfolio that:
1. Downloads and uses actual CHRLS assets where possible
2. Has 3D stacked cards that reveal on scroll (like CHRLS)
3. Has preloader animation on page load
4. Has custom green cursor with mix-blend-mode
5. Has all structural wrapper divs matching CHRLS HTML
6. Has "Say hello" email section in navigation
7. Has decorative GIFs in hero, about, and reminder sections
8. Has QR codes on project cards
9. Maintains responsive behavior at 991px, 767px, 479px breakpoints

### Verification Criteria:
- [ ] All CHRLS assets downloaded and integrated
- [ ] 3D card perspective visible when scrolling projects section
- [ ] Preloader shows on page load then fades
- [ ] Custom cursor follows mouse on desktop
- [ ] Navigation has "Say hello" with email link
- [ ] Hero has animated GIF in photo hole
- [ ] About section has decorative GIFs
- [ ] Project cards have QR codes
- [ ] Scroll-based sticky animation works in projects section

## What We're NOT Doing

- Archive/gallery page (separate feature)
- 404 page styling
- Mobile archive message screen
- Changing fonts (keeping Satoshi/Space Mono)
- Changing content (keeping ML/Data Science focus)

---

## Phase 1: Download All CHRLS Assets

### Overview
Scrape and download all image assets from the live chrls.design website to ensure we have authentic materials.

### Changes Required:

#### 1. Create Asset Download Script
**File**: `rlupo-portfolio/scripts/download-chrls-assets.sh` (temporary)

```bash
#!/bin/bash
# Download CHRLS assets to rlupo-portfolio/assets/

cd "C:/Users/Trey/Downloads/Website/rlupo-portfolio/assets"

# GIF assets
curl -o hero-gif.gif "https://chrls.design/images/hero-gif.gif" 2>/dev/null || echo "hero-gif.gif not found"
curl -o dashes.gif "https://chrls.design/images/dashes.gif" 2>/dev/null || echo "dashes.gif not found"
curl -o about-gif.gif "https://chrls.design/images/about-gif.gif" 2>/dev/null || echo "about-gif.gif not found"
curl -o awards-gif.gif "https://chrls.design/images/awards-gif.gif" 2>/dev/null || echo "awards-gif.gif not found"
curl -o reminder.gif "https://chrls.design/images/reminder.gif" 2>/dev/null || echo "reminder.gif not found"

# SVG assets
curl -o qr.svg "https://chrls.design/images/qr.svg" 2>/dev/null || echo "qr.svg not found"
curl -o wave.svg "https://chrls.design/images/wave.svg" 2>/dev/null || echo "wave.svg not found"
curl -o logo.svg "https://chrls.design/images/logo.svg" 2>/dev/null || echo "logo.svg not found"

# List downloaded files
echo "Downloaded assets:"
ls -la
```

#### 2. Alternative: Use Browser to Capture Assets
If curl fails, use Chrome MCP tools to:
1. Navigate to chrls.design
2. Open DevTools Network tab
3. Capture all image/gif requests
4. Download each asset manually

#### 3. Fallback: Create CSS Pattern Placeholders
If assets cannot be downloaded, create animated CSS patterns:

```css
/* Fallback animated patterns */
.gif-placeholder {
  background: repeating-linear-gradient(
    90deg,
    var(--black) 0px,
    var(--black) 2px,
    transparent 2px,
    transparent 4px
  );
  animation: scan-lines 0.5s linear infinite;
}

@keyframes scan-lines {
  0% { background-position: 0 0; }
  100% { background-position: 4px 0; }
}
```

### Success Criteria:

#### Automated Verification:
- [x] Assets folder contains: hero-gif.gif, dashes.gif, about-gif.gif, awards-gif.gif, reminder.gif
- [x] Assets folder contains: qr.svg, wave.svg
- [x] All files are non-zero size

#### Manual Verification:
- [ ] GIFs animate when opened in browser
- [ ] SVGs render correctly

**Implementation Note**: If direct download fails, use browser automation or source free alternatives from LottieFiles/Pixabay. Pause for confirmation before Phase 2.

---

## Phase 2: Add Structural Wrapper Divs

### Overview
Add missing HTML wrapper elements to match CHRLS structure exactly.

### Changes Required:

#### 1. Update App.tsx - Add Project Wrapper
**File**: `rlupo-portfolio/App.tsx`
**Changes**: Add `home_project-wrapper` inside track

```tsx
{/* Projects Section */}
<section className="section project">
  <div className="home_project-track" id="track">
    <div className="home_project-wrapper">
      {/* Background marquee - top */}
      <div className="home_project-bg first">
        <div className="home_project-bgtxtholder outline">
          <h2 className="home_project-bgtext outline">PRODUCTION MODELS •</h2>
        </div>
      </div>

      {/* Project content */}
      <div className="home_project-content">
        {PROJECTS.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            cardNumber={PROJECTS.length - index} // For _1 through _6 classes
          />
        ))}
      </div>

      {/* Background marquee - bottom */}
      <div className="home_project-bg last">
        <div className="home_project-bgtxtholder outline">
          <h2 className="home_project-bgtext outline">PRODUCTION MODELS •</h2>
        </div>
      </div>
    </div>
  </div>

  {/* Reminder section */}
  <div className="home_project-reminder">
    <img src="./assets/reminder.gif" alt="" className="home_project-remindericon" />
    <span className="home_project-remindertext">MORE PROJECTS IN TRAINING</span>
    <img src="./assets/reminder.gif" alt="" className="home_project-remindericon" />
  </div>
</section>
```

#### 2. Update About.tsx - Add Container Wrapper
**File**: `rlupo-portfolio/components/About.tsx`
**Changes**: Add `home_about-container` wrapper around columns

```tsx
<section id="about" className="section about">
  <div className="home_about-wrapper">
    <div className="home_about-bg"></div>

    <div className="home_about-container">
      {/* Left column */}
      <div className="home_about-col">
        <div className="home_about-titleholder">
          <div className="home_about-bigtextholder">
            ML ENGINEER & DATA SCIENTIST. PRODUCTION FOCUSED.
          </div>
        </div>
        <div className="home_about-intholder">
          <h2>ABOUT</h2>
          <p className="home_about-para">
            Robert "Trey" Lupo builds production ML systems with calibrated outputs...
          </p>
          <img src="./assets/about-gif.gif" alt="" className="home_gif about-para" />
        </div>
      </div>

      {/* Right column - Orange box */}
      <div className="home_about-col about-box">
        {/* ... existing awards content ... */}
        <img src="./assets/awards-gif.gif" alt="" className="home_gif about_awards" />
      </div>
    </div>
  </div>
</section>
```

#### 3. Add CSS for New Wrappers
**File**: `rlupo-portfolio/index.html`
**Changes**: Add wrapper CSS classes

```css
/* Project wrapper for sticky scroll */
.home_project-wrapper {
  height: 100vh;
  position: sticky;
  top: 0;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* About container grid */
.home_about-container {
  grid-column-gap: 1em;
  grid-template-rows: auto;
  grid-template-columns: minmax(0, 1fr) 26.25em;
  grid-auto-columns: 1fr;
  grid-auto-flow: row dense;
  place-items: stretch center;
  width: 100%;
  height: 26em;
  padding: 1em;
  display: grid;
  position: relative;
}

/* GIF styling */
.home_gif {
  mix-blend-mode: darken;
  margin-top: auto;
}

.home_gif.about-para {
  width: 20.5em;
}

.home_gif.about_awards {
  width: 8.875em;
}
```

### Success Criteria:

#### Automated Verification:
- [ ] No TypeScript errors
- [ ] Build completes successfully

#### Manual Verification:
- [ ] DOM inspector shows `home_project-wrapper` inside `home_project-track`
- [ ] DOM inspector shows `home_about-container` inside `home_about-wrapper`
- [ ] GIF images render in about section (or placeholders if assets unavailable)

**Implementation Note**: Pause for manual confirmation before Phase 3.

---

## Phase 3: Implement 3D Card Stacking

### Overview
Transform the grid layout into CHRLS's signature 3D stacked card effect with perspective depth.

### Changes Required:

#### 1. Update ProjectCard.tsx - Add Card Number Class
**File**: `rlupo-portfolio/components/ProjectCard.tsx`
**Changes**: Accept cardNumber prop and apply `_N` class

```tsx
interface ProjectCardProps {
  project: Project;
  index: number;
  cardNumber?: number; // 1-6 for stacking classes
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, cardNumber }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const colorClass = colorClassMap[project.cardColor] || 'orange';
  const stackClass = cardNumber ? `_${cardNumber}` : '';

  return (
    <>
      <a
        href={project.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`home_project-card ${stackClass}`}
        onClick={(e) => {
          if (project.liveUrl) {
            e.preventDefault();
            setIsModalOpen(true);
          }
        }}
      >
        {/* Top: Image/Preview area */}
        <div className="home_project-contentholder">
          <img
            src={`./assets/project-${index + 1}.jpg`}
            alt={project.title}
            className="home_project-img"
            onError={(e) => {
              // Fallback to category text if image missing
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="home_project-category">{project.category}</span>
        </div>

        {/* Bottom: Ticket info with color */}
        <div className={`home_project-contentholder btm ${colorClass}`}>
          <div className="home_project-descholder">
            <h4 className="home_project-title">{project.title}</h4>
            <div className="home_project-group flex">
              <div>
                <h6>EPOCH:</h6>
                <h5>{project.epoch}</h5>
              </div>
              <img src="./assets/qr.svg" alt="" className="home_project-qr" />
            </div>
          </div>
          <div className="home_project-descholder right-wing">
            <img src="./assets/braille.svg" alt="" className="home_project-braille" />
          </div>
        </div>
      </a>
      {/* Modal unchanged */}
    </>
  );
};
```

#### 2. Add 3D CSS Classes
**File**: `rlupo-portfolio/index.html`
**Changes**: Add perspective and translate3d classes

```css
/* Update project track for scroll height */
.home_project-track {
  width: 100%;
  height: 650vw; /* Creates long scroll area */
  padding-top: 2em;
  padding-bottom: 2em;
  position: relative;
}

/* Remove view-all override for 3D mode */
.home_project-track.view-all {
  height: auto;
}

/* Project content with perspective */
.home_project-content {
  perspective: 300vw;
  flex: none;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100%;
  display: flex;
  transform: perspective(275px);
}

/* Base card styling for 3D */
.home_project-card {
  perspective: 353px;
  flex-direction: column;
  flex: none;
  width: 30em;
  height: 50em;
  text-decoration: none;
  display: flex;
  position: absolute;
  transform: perspective(784px);
}

/* 3D stacking classes */
.home_project-card._1 {
  z-index: 1;
  transform-style: preserve-3d;
  transform: translate3d(0%, 0, -25em);
}

.home_project-card._2 {
  z-index: 2;
  transform-style: preserve-3d;
  transform: translate3d(0%, 0, -20em);
}

.home_project-card._3 {
  z-index: 3;
  transform-style: preserve-3d;
  transform: translate3d(0%, 0, -15em);
}

.home_project-card._4 {
  z-index: 4;
  transform-style: preserve-3d;
  transform: translate3d(0%, 0, -10em);
}

.home_project-card._5 {
  z-index: 5;
  transform-style: preserve-3d;
  transform: translate3d(0%, 0, -5em);
}

.home_project-card._6 {
  z-index: 6;
  transform-style: preserve-3d;
  transform: translate3d(0%, 0, 0);
}

/* Content holder with perspective */
.home_project-contentholder {
  z-index: 0;
  perspective: 50em;
  border: 0.35em solid var(--black);
  border-bottom-style: dotted;
  border-radius: 0.625em 0.625em 0 0;
  justify-content: center;
  align-items: center;
  height: 80%;
  display: flex;
  overflow: hidden;
}

/* Project image with 3D transform */
.home_project-img {
  object-fit: cover;
  transform-style: preserve-3d;
  flex: none;
  width: 180%;
  max-width: none;
  height: 130%;
  display: block;
  transform: translate3d(0, 0, -5em);
}

/* QR code styling */
.home_project-qr {
  width: 40px;
  height: 40px;
}

/* Category text overlay */
.home_project-category {
  position: absolute;
  font-size: 14px;
  opacity: 0.3;
  text-transform: uppercase;
}
```

#### 3. Update App.tsx - Remove view-all class for 3D mode
**File**: `rlupo-portfolio/App.tsx`
**Changes**: Remove `view-all` class from track and content

```tsx
<div className="home_project-track" id="track">
  {/* Remove view-all class */}
  <div className="home_project-wrapper">
    {/* ... */}
    <div className="home_project-content">
      {/* Cards now use absolute positioning */}
    </div>
  </div>
</div>
```

### Success Criteria:

#### Automated Verification:
- [ ] No TypeScript errors
- [ ] Build completes

#### Manual Verification:
- [ ] Cards appear stacked in 3D perspective (front card larger, back cards smaller)
- [ ] Scrolling through section changes which card is "in front"
- [ ] Cards have proper z-index layering (card 6 in front, card 1 in back)

**Implementation Note**: This is the most complex visual change. Pause for thorough testing before Phase 4.

---

## Phase 4: Add Navigation "Say Hello" Section

### Overview
Add the CHRLS-style "Say hello" email section to the navigation.

### Changes Required:

#### 1. Update Header.tsx
**File**: `rlupo-portfolio/components/Header.tsx`
**Changes**: Add nav_hello div inside nav_group, reorder elements

```tsx
const Header: React.FC = () => {
  // ... existing state and effects ...

  return (
    <nav className="nav">
      {/* Logo */}
      <a href="#" className="nav_logo">
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
          <rect x="4" y="4" width="18" height="18" fill="#0f0f0f" />
          <rect x="28" y="4" width="18" height="18" fill="#ff6d1b" />
          <rect x="4" y="28" width="18" height="18" fill="#ff6d1b" />
          <rect x="28" y="28" width="18" height="18" fill="#0f0f0f" />
        </svg>
      </a>

      {/* Nav group with Say Hello - CHRLS order */}
      <div className="nav_group">
        <div className="nav_hello">
          <span>Say hello</span>
          <a href="mailto:treylupo1197@gmail.com">treylupo1197@gmail.com</a>
        </div>
        <a href="#work" className="nav_link">WORK</a>
      </div>

      {/* Center barcode with time */}
      <div className="barcode_holder">
        <h2 className="barcode_avail">{currentTime}</h2>
        <img src="./assets/barcode.svg" alt="" className="barcode center" />
        <h2 className="barcode_time">EST</h2>
      </div>

      {/* Mobile menu button */}
      <button
        className="nav_mobile-btn"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div className="nav_mobile-menu">
          {/* ... mobile menu content ... */}
        </div>
      )}
    </nav>
  );
};
```

#### 2. Add CSS for nav_hello
**File**: `rlupo-portfolio/index.html`
**Changes**: Add nav_hello styling

```css
/* Say Hello section in nav */
.nav_hello {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25em;
}

.nav_hello span {
  font-size: 12px;
  opacity: 0.7;
  font-family: 'Space Mono', monospace;
}

.nav_hello a {
  font-size: 14px;
  font-family: 'Space Mono', monospace;
  text-decoration: underline;
  color: var(--black);
}

.nav_hello a:hover {
  color: var(--coral);
}
```

### Success Criteria:

#### Automated Verification:
- [ ] No TypeScript errors

#### Manual Verification:
- [ ] "Say hello" label visible in nav
- [ ] Email link visible and clickable
- [ ] Email link opens mailto: dialog

**Implementation Note**: Pause for confirmation before Phase 5.

---

## Phase 5: Implement Preloader Animation

### Overview
Add a loading animation that displays on page load then fades out.

### Changes Required:

#### 1. Create Preloader Component
**File**: `rlupo-portfolio/components/Preloader.tsx` (new file)

```tsx
import React, { useState, useEffect } from 'react';

const Preloader: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 300);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="preloader">
      <div className="preloader_bar" style={{ transform: `scaleX(${progress / 100})` }} />
      <div className="preloader_num">
        <span className="preloader_span">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

export default Preloader;
```

#### 2. Add Preloader to App.tsx
**File**: `rlupo-portfolio/App.tsx`
**Changes**: Import and render Preloader

```tsx
import Preloader from './components/Preloader';

const App: React.FC = () => {
  return (
    <>
      <Preloader />
      <div className="noise"></div>
      <Header />
      <main className="main">
        {/* ... rest of content ... */}
      </main>
    </>
  );
};
```

#### 3. Add Preloader CSS
**File**: `rlupo-portfolio/index.html`
**Changes**: Add preloader styles

```css
/* Preloader */
.preloader {
  z-index: 100;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  display: flex;
  position: fixed;
  inset: 0%;
  overflow: hidden;
  background-color: var(--white-smoke);
}

.preloader_num {
  color: var(--black);
  font-family: 'Space Mono', monospace;
  font-size: 32px;
  font-weight: 700;
  position: absolute;
  bottom: 2em;
  right: 2em;
  overflow: hidden;
}

.preloader_bar {
  background-color: var(--black);
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  transform-origin: left;
  transition: transform 0.1s ease-out;
}

.preloader_span {
  display: inline-block;
}
```

### Success Criteria:

#### Automated Verification:
- [ ] No TypeScript errors
- [ ] Build completes

#### Manual Verification:
- [ ] Preloader appears on page load
- [ ] Progress number counts up
- [ ] Bar fills from left to right
- [ ] Preloader fades out when complete
- [ ] Main content visible after preloader

**Implementation Note**: Pause for confirmation before Phase 6.

---

## Phase 6: Implement Custom Cursor

### Overview
Add a custom green circle cursor that follows the mouse with mix-blend-mode effect.

### Changes Required:

#### 1. Create Cursor Component
**File**: `rlupo-portfolio/components/CustomCursor.tsx` (new file)

```tsx
import React, { useState, useEffect } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  // Hide on touch devices
  if ('ontouchstart' in window) return null;

  return (
    <>
      <div className="cursor_pad" />
      <div
        className="project_cursor"
        style={{
          transform: `translate(${position.x - 48}px, ${position.y - 48}px)`,
          opacity: isVisible ? 1 : 0,
        }}
      />
    </>
  );
};

export default CustomCursor;
```

#### 2. Add Cursor to App.tsx
**File**: `rlupo-portfolio/App.tsx`
**Changes**: Import and render CustomCursor

```tsx
import CustomCursor from './components/CustomCursor';

const App: React.FC = () => {
  return (
    <>
      <CustomCursor />
      <Preloader />
      {/* ... rest of content ... */}
    </>
  );
};
```

#### 3. Add Cursor CSS
**File**: `rlupo-portfolio/index.html`
**Changes**: Add cursor styles

```css
/* Custom cursor */
.project_cursor {
  z-index: 99998;
  background-color: var(--spring-green);
  border-radius: 50%;
  width: 6em;
  height: 6em;
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  mix-blend-mode: difference;
}

.cursor_pad {
  mix-blend-mode: difference;
  width: 100vw;
  height: 100vh;
  position: fixed;
  inset: 0%;
  pointer-events: none;
  z-index: 99997;
}

/* Hide default cursor */
body {
  cursor: none;
}

/* Restore cursor on interactive elements */
a, button, input, textarea, select {
  cursor: pointer;
}
```

### Success Criteria:

#### Automated Verification:
- [ ] No TypeScript errors
- [ ] Build completes

#### Manual Verification:
- [ ] Green circle follows mouse cursor
- [ ] Mix-blend-mode creates color inversion effect
- [ ] Cursor hidden on touch devices
- [ ] Default cursor still works on links/buttons

**Implementation Note**: Pause for confirmation before Phase 7.

---

## Phase 7: Update Hero Section with GIFs

### Overview
Add the hero GIF in the photo hole and dashes GIF decoration.

### Changes Required:

#### 1. Update Hero.tsx
**File**: `rlupo-portfolio/components/Hero.tsx`
**Changes**: Add GIF images

```tsx
<div className="hero_label-wrapper">
  {/* Column 1: Photo hole with GIF */}
  <div className="hero_label-col hole">
    <img src="./assets/hero-gif.gif" alt="" className="home_gif hero" />
  </div>

  {/* Column 2: Main info */}
  <div className="hero_label-col">
    <div className="hero_label-holder top">
      <p className="hero_label-paragraph">
        HYBRID MODEL: FP&A × MACHINE LEARNING...
      </p>
      <div className="hero_label-copy">TREY©2025</div>
    </div>
    <div className="hero_label-holder">
      <div className="hero_label-title">
        <h2>MACHINE LEARNING ENGINEER</h2>
      </div>
      <div className="hero_label-based">
        <h2>MADE IN USA.</h2>
      </div>
    </div>
    {/* Add dashes GIF */}
    <div className="hero_gif-holder">
      <img src="./assets/dashes.gif" alt="" className="home_gif dashes" />
    </div>
  </div>

  {/* Column 3: Barcode and time */}
  <div className="hero_label-col last">
    {/* ... existing content ... */}
  </div>
</div>
```

#### 2. Add Hero GIF CSS
**File**: `rlupo-portfolio/index.html`
**Changes**: Add hero GIF styles

```css
/* Hero GIF in photo hole */
.home_gif.hero {
  padding-bottom: 1em;
  padding-left: 1em;
  padding-right: 1em;
  mix-blend-mode: darken;
}

/* Dashes GIF holder */
.hero_gif-holder {
  justify-content: flex-end;
  align-items: flex-end;
  height: 1em;
  display: flex;
}

.home_gif.dashes {
  height: 100%;
  margin-right: 1em;
  padding: 0;
  display: block;
  mix-blend-mode: darken;
}
```

### Success Criteria:

#### Automated Verification:
- [ ] No TypeScript errors

#### Manual Verification:
- [ ] Hero GIF animates in photo hole area
- [ ] Dashes GIF visible in middle column
- [ ] GIFs have proper mix-blend-mode effect

**Implementation Note**: Pause for confirmation before Phase 8.

---

## Phase 8: Update Footer with Wave SVG

### Overview
Replace the wave emoji with the proper wave SVG icon.

### Changes Required:

#### 1. Update Footer.tsx
**File**: `rlupo-portfolio/components/Footer.tsx`
**Changes**: Replace emoji with SVG

```tsx
<div className="footer_hello-holder">
  <h2 className="footer_hello">Say hello</h2>
  <img src="./assets/wave.svg" alt="" className="footer_helloicon" />
</div>
```

#### 2. Add/Verify Footer Icon CSS
**File**: `rlupo-portfolio/index.html`
**Changes**: Ensure footer icon styles exist

```css
.footer_helloicon {
  width: 1.875vw;
  margin-left: 0.5em;
}
```

### Success Criteria:

#### Automated Verification:
- [ ] No TypeScript errors

#### Manual Verification:
- [ ] Wave SVG visible next to "Say hello"
- [ ] Proper sizing and alignment

---

## Phase 9: Final Polish and Responsive Testing

### Overview
Ensure all new features work across responsive breakpoints.

### Changes Required:

#### 1. Add Responsive CSS for New Elements
**File**: `rlupo-portfolio/index.html`
**Changes**: Update media queries

```css
/* Tablet (991px) */
@media screen and (max-width: 991px) {
  .home_project-track {
    height: auto; /* Disable scroll effect on tablet */
  }

  .home_project-content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2em;
    padding: 2em;
    perspective: none;
    transform: none;
  }

  .home_project-card {
    position: relative;
    transform: none !important;
    width: 100%;
    height: auto;
  }

  .home_about-container {
    grid-template-columns: 1fr;
  }

  .nav_hello {
    display: none;
  }

  .project_cursor,
  .cursor_pad {
    display: none;
  }
}

/* Mobile (767px) */
@media screen and (max-width: 767px) {
  .home_project-content {
    grid-template-columns: 1fr;
  }

  .hero_gif-holder {
    display: none;
  }
}

/* Small Mobile (479px) */
@media screen and (max-width: 479px) {
  .preloader_num {
    font-size: 24px;
    bottom: 1em;
    right: 1em;
  }
}
```

### Success Criteria:

#### Automated Verification:
- [ ] `npm run build` passes
- [ ] No TypeScript errors
- [ ] No console errors in browser

#### Manual Verification:
- [ ] Desktop (1440px+): All features visible, 3D cards work
- [ ] Tablet (991px): Grid layout, no 3D effects, no custom cursor
- [ ] Mobile (767px): Single column, simplified layout
- [ ] Small Mobile (479px): All content accessible

---

## Testing Strategy

### Manual Testing Steps:
1. Load page - verify preloader shows and fades
2. Move mouse - verify custom cursor follows
3. Check nav - verify "Say hello" with email link
4. Scroll to hero - verify GIF in photo hole
5. Scroll to projects - verify 3D card stacking effect
6. Hover project cards - verify effects still work
7. Click KKBOX card - verify demo modal opens
8. Scroll to about - verify GIFs in about section
9. Scroll to footer - verify wave SVG icon
10. Resize to tablet/mobile - verify responsive fallbacks
11. Test on touch device - verify cursor is hidden

### Component Checklist:
| Component | 3D Effects | GIFs | New Structure | Responsive |
|-----------|------------|------|---------------|------------|
| Preloader | N/A | N/A | ✓ New component | ☐ |
| CustomCursor | N/A | N/A | ✓ New component | ☐ |
| Header | N/A | N/A | ✓ nav_hello | ☐ |
| Hero | N/A | ✓ hero, dashes | ✓ gif-holder | ☐ |
| Projects | ✓ 3D stack | N/A | ✓ wrapper | ☐ |
| ProjectCard | ✓ _N classes | N/A | ✓ QR code | ☐ |
| About | N/A | ✓ about, awards | ✓ container | ☐ |
| Footer | N/A | ✓ wave.svg | N/A | ☐ |

---

## References

- `chrls-download/css/chrlsfolio.css:43-73` - 3D card stacking CSS
- `chrls-download/css/chrlsfolio.css:119-122` - Preloader CSS
- `chrls-download/css/chrlsfolio.css:127-128` - Cursor CSS
- `chrls-download/index.html:74-118` - Project section structure
- `chrls-download/index.html:121-169` - About section structure
- `thoughts/shared/research/2026-01-07-chrls-comparison.md` - Full comparison analysis

---

**Plan Created**: 2026-01-07
**Status**: Ready for Implementation
**Estimated Phases**: 9
**Next Action**: Begin Phase 1 - Download All CHRLS Assets
