# CHRLS.design Faithful Recreation for TREY.ML

## Overview

This plan details the faithful recreation of the CHRLS.design portfolio layout for the TREY.ML brand. The CHRLS CSS classes are already defined in `rlupo-portfolio/index.html` (lines 20-708) but are currently unused. The React components use Tailwind utility classes instead. This plan restructures all components to use the exact CHRLS class names and HTML hierarchy while adapting content for ML/Data Science.

## Current State Analysis

### What Exists
- **CSS Classes**: All CHRLS classes defined in `index.html:20-708` (nav, hero, projects, about, footer)
- **Assets**: `grain.gif`, `barcode.svg`, `braille.svg` copied to `rlupo-portfolio/assets/`
- **Fonts**: Using free alternatives (Satoshi + Space Mono) instead of Neue Montreal + NeueBit
- **React Components**: 7 components in `rlupo-portfolio/components/` using Tailwind classes

### What's Wrong
1. Components use Tailwind utilities instead of pre-defined CHRLS classes
2. HTML structure doesn't match CHRLS hierarchy (missing nested divs, specific class combinations)
3. Missing key visual elements (rotating background track, 3D card stacking, sticky about section)
4. No framer-motion animations
5. Footer uses orange bg when it should match CHRLS styling

### Key CHRLS CSS Class References
| Section | Key Classes | File Location |
|---------|-------------|---------------|
| Nav | `.nav`, `.nav_logo`, `.nav_group`, `.barcode_holder` | `index.html:65-126` |
| Hero | `.section.hero`, `.hero_title-holder`, `.hero_title`, `.hero_splitter`, `.hero_label-wrapper`, `.hero_label-col` | `index.html:131-228` |
| Projects | `.section.project`, `.home_project-track`, `.home_project-bg`, `.home_project-content`, `.home_project-card`, `.home_project-contentholder`, `.home_project-descholder` | `index.html:230-404` |
| About | `.section.about`, `.home_about-wrapper`, `.home_about-bg`, `.home_about-col`, `.home_about-bigtextholder` | `index.html:406-516` |
| Footer | `.section.footer`, `.footer_group`, `.footer_title-holder`, `.footer_title`, `.footer_splitter` | `index.html:518-648` |

## Desired End State

A portfolio that:
1. Uses exact CHRLS class names from `index.html` CSS
2. Matches CHRLS HTML structure hierarchy
3. Has rotating background marquee in projects section
4. Has proper ticket-style cards with dotted borders and color-coded bottoms
5. Has sticky about section with black background overlay
6. Has giant brand text with splitter dots in footer
7. Includes framer-motion entrance animations
8. Displays grain texture overlay

### Verification Criteria
- [ ] All components use CHRLS class names (no Tailwind utilities for layout)
- [ ] Hero has 3-column `.hero_label-wrapper` structure
- [ ] Projects have `.home_project-bg` rotating background with marquee text
- [ ] Project cards use `.home_project-contentholder` with dotted borders
- [ ] About section uses `.home_about-wrapper` with sticky positioning
- [ ] Footer has `.footer_splitter.dot` between title text
- [ ] Grain overlay visible at correct opacity
- [ ] Responsive breakpoints match CHRLS (991px, 767px, 479px)

## What We're NOT Doing

- Using original Neue Montreal / NeueBit fonts (licensing concerns - using Satoshi + Space Mono)
- 3D perspective card stacking with scroll animation (simplified to grid)
- Preloader animation
- Archive/gallery page
- Custom cursor effects
- 404 page styling

---

## Phase 1: Hero Section Restructure

### Overview
Completely rewrite Hero.tsx to match exact CHRLS HTML structure with `.section.hero`, `.hero_title-holder`, `.hero_label-wrapper` with 3 columns.

### Changes Required

#### 1. Hero Component
**File**: `rlupo-portfolio/components/Hero.tsx`
**Changes**: Complete rewrite to match CHRLS structure

```tsx
import React, { useState, useEffect } from 'react';

const Hero: React.FC = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12 || 12;
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="section hero">
      {/* Giant Title */}
      <div className="hero_title-holder">
        <h1 className="hero_title">TREY</h1>
        <div className="hero_splitter"></div>
        <h1 className="hero_title">ML</h1>
      </div>

      {/* Orange Info Box - 3 columns */}
      <div className="hero_label-wrapper">
        {/* Column 1: Photo hole */}
        <div className="hero_label-col hole">
          {/* Photo placeholder or actual image */}
          <span style={{ padding: '1em', fontSize: '12px', opacity: 0.5 }}>[PHOTO]</span>
        </div>

        {/* Column 2: Main info */}
        <div className="hero_label-col">
          <div className="hero_label-holder top">
            <p className="hero_label-paragraph">
              HYBRID MODEL: FP&A × MACHINE LEARNING. PRODUCTION ML WITH CALIBRATED OUTPUTS.
              DEPLOYED ON HUGGINGFACE SPACES, DOCKER, VERCEL. FRAMEWORKS: XGBOOST, LIGHTGBM, PYTORCH, SHAP.
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
        </div>

        {/* Column 3: Barcode and time */}
        <div className="hero_label-col last">
          <div className="barcode_group">
            <h3 className="barcode_avail">AVLB : 2025</h3>
            <img src="./assets/barcode.svg" alt="" className="barcode center" />
            <h3 className="barcode_time">OPEN TO WORK</h3>
          </div>
          <h3 className="barcode_time" id="clock">{time}</h3>
        </div>
      </div>
    </section>
  );
};

export default Hero;
```

### Success Criteria

#### Automated Verification:
- [x] No TypeScript errors
- [x] Component renders without console errors

#### Manual Verification:
- [x] Giant "TREY ■ ML" text displays with splitter square (shows as dot, acceptable)
- [x] Orange info box has 3 distinct columns
- [x] Left column has rounded photo hole with light background
- [x] Middle column has paragraph text and "MACHINE LEARNING ENGINEER" title
- [x] Right column has barcode image and live clock
- [x] Responsive: columns stack on mobile (verified at 536px width)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation before proceeding to Phase 2.

---

## Phase 2: Projects Section with Background Track

### Overview
Add the rotating background marquee track and restructure project cards to use CHRLS ticket styling with `.home_project-contentholder` and dotted borders.

### Changes Required

#### 1. App.tsx Projects Section
**File**: `rlupo-portfolio/App.tsx`
**Changes**: Add background track wrapper, use CHRLS classes

```tsx
{/* Projects Section */}
<section className="section project">
  <div className="home_project-track">
    {/* Background marquee - top */}
    <div className="home_project-bg first">
      <div className="home_project-bgtxtholder outline">
        <h2 className="home_project-bgtext outline">PRODUCTION MODELS</h2>
        <h2 className="home_project-bgtext outline">PRODUCTION MODELS</h2>
        <h2 className="home_project-bgtext outline">PRODUCTION MODELS</h2>
      </div>
    </div>

    {/* Project grid */}
    <div className="home_project-content view-all">
      {PROJECTS.map((project, index) => (
        <ProjectCard key={project.id} project={project} index={index} />
      ))}
    </div>

    {/* Background marquee - bottom */}
    <div className="home_project-bg last">
      <div className="home_project-bgtxtholder outline">
        <h2 className="home_project-bgtext outline">PRODUCTION MODELS</h2>
        <h2 className="home_project-bgtext outline">PRODUCTION MODELS</h2>
        <h2 className="home_project-bgtext outline">PRODUCTION MODELS</h2>
      </div>
    </div>
  </div>

  {/* Reminder section */}
  <div className="home_project-reminder">
    <img src="./assets/barcode.svg" alt="" className="home_project-remindericon" />
    <span className="home_project-remindertext">MORE PROJECTS IN TRAINING. CHECK GITHUB FOR LATEST.</span>
    <img src="./assets/barcode.svg" alt="" className="home_project-remindericon" />
  </div>
</section>
```

#### 2. ProjectCard Component
**File**: `rlupo-portfolio/components/ProjectCard.tsx`
**Changes**: Use CHRLS ticket structure with `.home_project-card`, `.home_project-contentholder`

```tsx
import React, { useState } from 'react';
import { Project, CARD_COLORS } from '../types';
import DemoModal from './DemoModal';

interface ProjectCardProps {
  project: Project;
  index: number;
}

// Map cardColor to CHRLS class
const colorClassMap: Record<string, string> = {
  coral: 'orange',
  cyan: 'sea-blue',
  green: 'green',
  yellow: 'yelgreen',
  'light-cyan': 'blue',
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const colorClass = colorClassMap[project.cardColor] || 'orange';

  return (
    <>
      <a
        href={project.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="home_project-card"
        onClick={(e) => {
          if (project.liveUrl) {
            e.preventDefault();
            setIsModalOpen(true);
          }
        }}
      >
        {/* Top: Image/Preview area */}
        <div className="home_project-contentholder">
          <span style={{ fontSize: '14px', opacity: 0.3, textTransform: 'uppercase' }}>
            {project.category}
          </span>
        </div>

        {/* Bottom: Ticket info with color */}
        <div className={`home_project-contentholder btm ${colorClass}`}>
          {/* Left description holder */}
          <div className="home_project-descholder">
            <h4 className="home_project-title">{project.title}</h4>
            <div className="home_project-group flex">
              <div>
                <h6>EPOCH:</h6>
                <h5>{project.epoch}</h5>
              </div>
              {project.metric && (
                <div>
                  <h6>METRIC:</h6>
                  <h5>{project.metric}</h5>
                </div>
              )}
            </div>
          </div>

          {/* Right wing with braille */}
          <div className="home_project-descholder right-wing">
            <img src="./assets/braille.svg" alt="" className="home_project-braille" />
          </div>
        </div>
      </a>

      {project.liveUrl && (
        <DemoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          url={project.liveUrl}
          title={project.title}
        />
      )}
    </>
  );
};

export default ProjectCard;
```

#### 3. Update CSS for background track animation
**File**: `rlupo-portfolio/index.html`
**Changes**: Ensure marquee animation is defined (add if missing)

```css
/* Add to existing CSS if not present */
@keyframes marquee-bg {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.home_project-bgtxtholder {
  animation: marquee-bg 20s linear infinite;
}
```

### Success Criteria

#### Automated Verification:
- [x] No TypeScript errors
- [x] Build completes successfully

#### Manual Verification:
- [x] Orange diagonal stripe visible at top and bottom of projects section
- [x] "PRODUCTION MODELS" text scrolls horizontally in stripes
- [x] Project cards have rounded top corners with dotted bottom border
- [x] Card bottoms have solid border and colored background
- [x] Each card color matches its category (coral, cyan, green, yellow, light-cyan)
- [x] Braille decoration visible in right section of each card
- [x] Cards link to GitHub or open demo modal
- [x] Reminder section at bottom has barcode icons

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation before proceeding to Phase 3.

---

## Phase 3: About Section with Sticky Layout

### Overview
Restructure About section to use `.home_about-wrapper` with sticky positioning and black background overlay, matching CHRLS 2-column layout.

### Changes Required

#### 1. About Component
**File**: `rlupo-portfolio/components/About.tsx`
**Changes**: Complete rewrite to CHRLS structure

```tsx
import React from 'react';
import { PERSONAL_INFO } from '../constants';

const About: React.FC = () => {
  return (
    <section className="section about">
      <div className="home_about-wrapper">
        {/* Black background */}
        <div className="home_about-bg"></div>

        <div className="home_about-container">
          {/* Left column - Big text and info box */}
          <div className="home_about-col">
            <div className="home_about-titleholder">
              <div className="home_about-bigtextholder">
                ML ENGINEER & DATA SCIENTIST. PRODUCTION FOCUSED.
              </div>
            </div>
            <div className="home_about-intholder">
              <h2>ABOUT</h2>
              <p className="home_about-para">
                Robert "Trey" Lupo builds production ML systems with calibrated outputs.
                Currently FP&A Analyst at Franklin Street Properties, previously AI Engineering
                at Origin Construction. MIT Professional Certificate in Data Science,
                B.A. Statistics from University of South Florida.
              </p>
            </div>
          </div>

          {/* Right column - Orange box with credentials */}
          <div className="home_about-col about-box">
            <div className="home_about-awardcol">
              <div className="award_group">
                <h5 className="about_awards title">Benchmarks</h5>
                <h6 className="about_awards">0.97 AUC - KKBOX Churn</h6>
                <h6 className="about_awards">265-490ms - OVOD Inference</h6>
                <h6 className="about_awards">135+ Engineered Features</h6>
              </div>
              <div className="award_group">
                <h5 className="about_awards title">Education</h5>
                <h6 className="about_awards">MIT Data Science Certificate</h6>
                <h6 className="about_awards">B.A. Statistics, USF</h6>
              </div>
            </div>
            <div className="home_about-awardcol btm">
              <div className="award_group">
                <h5 className="about_awards title">Stack</h5>
                <h6 className="about_awards">Python</h6>
                <h6 className="about_awards">XGBoost / LightGBM</h6>
                <h6 className="about_awards">FastAPI / React</h6>
                <h6 className="about_awards">SHAP / DuckDB</h6>
              </div>
              <div className="award_group">
                <h5 className="about_awards title">Deploy</h5>
                <h6 className="about_awards">HuggingFace Spaces</h6>
                <h6 className="about_awards">Docker</h6>
                <h6 className="about_awards">Vercel</h6>
              </div>
              <div className="award_group">
                <h5 className="about_awards title">Contact</h5>
                <h6 className="about_awards">
                  <a href={`mailto:${PERSONAL_INFO.email}`}>{PERSONAL_INFO.email}</a>
                </h6>
                <h6 className="about_awards">
                  <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer">GitHub</a>
                </h6>
                <h6 className="about_awards">
                  <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
```

### Success Criteria

#### Automated Verification:
- [x] No TypeScript errors
- [x] Component renders without console errors

#### Manual Verification:
- [x] Black background covers entire about section
- [x] Left column has large white text "ML ENGINEER & DATA SCIENTIST..."
- [x] Left column has orange info box with "ABOUT" heading
- [x] Right column is orange box with credentials grid
- [x] "Benchmarks", "Education", "Stack", "Deploy", "Contact" sections visible
- [x] Links in Contact section are clickable
- [ ] Section has sticky behavior when scrolling (if viewport height allows)
- [ ] Responsive: columns stack on tablet/mobile

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation before proceeding to Phase 4.

---

## Phase 4: Footer & Header with CHRLS Classes

### Overview
Apply proper CHRLS classes to Footer (with `.footer_splitter.dot`) and Header (with `.nav` structure).

### Changes Required

#### 1. Footer Component
**File**: `rlupo-portfolio/components/Footer.tsx`
**Changes**: Use CHRLS footer classes with splitter dots

```tsx
import React from 'react';
import { PERSONAL_INFO } from '../constants';

const Footer: React.FC = () => {
  return (
    <section className="section footer">
      {/* Top section - Contact */}
      <div className="footer_group">
        <div className="footer_email-wrapper">
          <div className="footer_hello-holder">
            <h2 className="footer_hello">Say hello</h2>
            <span style={{ fontSize: '1.5em', marginLeft: '0.5em' }}>👋</span>
          </div>
          <a href={`mailto:${PERSONAL_INFO.email}`} className="footer_email">
            {PERSONAL_INFO.email}
          </a>
        </div>
        <div className="footer_social-handle">
          <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" className="footer_social">
            GitHub
          </a>
          <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="footer_social">
            LinkedIn
          </a>
          <a href={PERSONAL_INFO.huggingface} target="_blank" rel="noopener noreferrer" className="footer_social last">
            HuggingFace
          </a>
        </div>
      </div>

      {/* Giant brand text */}
      <div className="footer_title-holder">
        <h1 className="footer_title">TREY</h1>
        <div className="footer_splitter dot"></div>
        <h1 className="footer_title">ML</h1>
      </div>

      {/* Copyright and attribution */}
      <div className="footer_copyright">©2025 Robert Lupo</div>
      <div className="footer_attribution">
        Design inspired by <a href="https://chrls.design" target="_blank" rel="noopener noreferrer">CHRLS.DSGN</a>
      </div>
    </section>
  );
};

export default Footer;
```

#### 2. Header Component
**File**: `rlupo-portfolio/components/Header.tsx`
**Changes**: Use CHRLS nav classes

```tsx
import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12 || 12;
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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

      {/* Center barcode with time */}
      <div className="barcode_holder">
        <h2 className="barcode_avail">{time}</h2>
        <img src="./assets/barcode.svg" alt="" className="barcode center" />
        <h2 className="barcode_time">EST</h2>
      </div>

      {/* Right nav group */}
      <div className="nav_group">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '12px', opacity: 0.7 }}>Say hello</span>
          <a href={`mailto:treylupo1197@gmail.com`} style={{ fontSize: '14px' }}>treylupo1197@gmail.com</a>
        </div>
        <a href="#work" style={{ textDecoration: 'none', fontSize: '14px', textTransform: 'uppercase' }}>Work</a>
        <a href="#about" style={{ textDecoration: 'none', fontSize: '14px', textTransform: 'uppercase' }}>About</a>
      </div>
    </nav>
  );
};

export default Header;
```

### Success Criteria

#### Automated Verification:
- [x] No TypeScript errors
- [x] Build completes successfully

#### Manual Verification:
- [x] Header fixed at top with logo, center barcode/time, right nav links
- [x] Live clock updates every second in header
- [x] Footer has orange background
- [x] "Say hello" + email on left, social links on right
- [x] Giant "TREY ■ ML" with black dot splitter centered
- [x] Copyright and attribution text at bottom
- [x] Attribution links to chrls.design
- [ ] Responsive: nav_group hides on mobile, footer stacks

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation before proceeding to Phase 5.

---

## Phase 5: App.tsx Integration & Grain Overlay

### Overview
Update App.tsx to remove Tailwind wrappers and ensure grain overlay is properly applied.

### Changes Required

#### 1. App.tsx
**File**: `rlupo-portfolio/App.tsx`
**Changes**: Simplify to use CHRLS structure

```tsx
import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProjectCard from './components/ProjectCard';
import About from './components/About';
import Footer from './components/Footer';
import { PROJECTS } from './constants';

const App: React.FC = () => {
  return (
    <>
      {/* Noise/grain overlay */}
      <div className="noise"></div>

      <Header />

      <main className="main">
        <Hero />

        {/* Projects Section */}
        <section className="section project">
          <div className="home_project-track view-all">
            {/* Background marquee - top */}
            <div className="home_project-bg first">
              <div className="home_project-bgtxtholder outline">
                <h2 className="home_project-bgtext outline">PRODUCTION MODELS •</h2>
                <h2 className="home_project-bgtext outline">PRODUCTION MODELS •</h2>
                <h2 className="home_project-bgtext outline">PRODUCTION MODELS •</h2>
                <h2 className="home_project-bgtext outline">PRODUCTION MODELS •</h2>
              </div>
            </div>

            {/* Project grid */}
            <div className="home_project-content view-all">
              {PROJECTS.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>

            {/* Background marquee - bottom */}
            <div className="home_project-bg last">
              <div className="home_project-bgtxtholder outline">
                <h2 className="home_project-bgtext outline">PRODUCTION MODELS •</h2>
                <h2 className="home_project-bgtext outline">PRODUCTION MODELS •</h2>
                <h2 className="home_project-bgtext outline">PRODUCTION MODELS •</h2>
                <h2 className="home_project-bgtext outline">PRODUCTION MODELS •</h2>
              </div>
            </div>
          </div>

          {/* Reminder section */}
          <div className="home_project-reminder">
            <img src="./assets/barcode.svg" alt="" className="home_project-remindericon" />
            <span className="home_project-remindertext">MORE PROJECTS IN TRAINING</span>
            <img src="./assets/barcode.svg" alt="" className="home_project-remindericon" />
          </div>
        </section>

        <About />

        <Footer />
      </main>
    </>
  );
};

export default App;
```

#### 2. Verify Grain Overlay CSS
**File**: `rlupo-portfolio/index.html`
**Changes**: Ensure `.noise` class has correct properties

```css
.noise {
  z-index: 99999;
  background-image: url('./assets/grain.gif');
  background-position: 50%;
  background-repeat: repeat;
  background-size: auto;
  background-attachment: scroll;
  width: 100%;
  height: 100vh;
  position: fixed;
  inset: 0%;
  pointer-events: none;
  opacity: 0.08;
  mix-blend-mode: overlay;
}
```

### Success Criteria

#### Automated Verification:
- [ ] `npm run build` passes with no errors
- [ ] No TypeScript errors
- [ ] No console errors in browser

#### Manual Verification:
- [ ] Grain texture visible as subtle overlay across entire page
- [ ] All sections flow correctly (Hero → Projects → About → Footer)
- [ ] No Tailwind utility classes visible in DOM inspector for layout
- [ ] Scroll behavior works smoothly
- [ ] All links functional (GitHub, LinkedIn, HuggingFace, email)
- [ ] Demo modal opens for KKBOX project

**Implementation Note**: After completing this phase, perform full regression testing across all breakpoints.

---

## Testing Strategy

### Breakpoint Testing
Test at these widths (matching CHRLS CSS media queries):
- **1440px+**: Full desktop layout
- **991px**: Tablet - hero columns stack, project grid 2 columns
- **767px**: Small tablet - nav_group hidden, footer stacks
- **479px**: Mobile - everything stacks, smaller fonts

### Manual Testing Steps
1. Load http://localhost:3001
2. Verify hero section layout (3 columns, giant text, orange box)
3. Scroll to projects - verify rotating marquee background visible
4. Hover project cards - verify lift effect
5. Click KKBOX card - verify demo modal opens
6. Scroll to about - verify sticky behavior and black background
7. Scroll to footer - verify giant text with dot splitter
8. Click all social links - verify they open correct URLs
9. Resize browser through all breakpoints
10. Check grain overlay visibility at each section

### Component Checklist
| Component | CHRLS Classes Used | Responsive | Links Working |
|-----------|-------------------|------------|---------------|
| Header | `.nav`, `.nav_logo`, `.nav_group`, `.barcode_holder` | ☐ | ☐ |
| Hero | `.section.hero`, `.hero_title-holder`, `.hero_label-wrapper` | ☐ | N/A |
| Projects | `.section.project`, `.home_project-track`, `.home_project-bg` | ☐ | ☐ |
| ProjectCard | `.home_project-card`, `.home_project-contentholder` | ☐ | ☐ |
| About | `.section.about`, `.home_about-wrapper`, `.home_about-col` | ☐ | ☐ |
| Footer | `.section.footer`, `.footer_group`, `.footer_title-holder` | ☐ | ☐ |

---

## References

- **CHRLS CSS**: `rlupo-portfolio/index.html:20-708`
- **CHRLS HTML Reference**: `chrls-download/index.html`
- **CHRLS Full CSS Reference**: `chrls-download/css/chrlsfolio.css`
- **Assets**: `rlupo-portfolio/assets/` (grain.gif, barcode.svg, braille.svg)
- **Branding Strategy**: `thoughts/shared/plans/2026-01-07-personal-branding-strategy.md`
- **Previous Plan**: `thoughts/shared/plans/2025-12-19-portfolio-chrls-recreation.md`

---

**Plan Created**: 2026-01-07
**Status**: Ready for Implementation
**Estimated Phases**: 5
**Next Action**: Begin Phase 1 - Hero Section Restructure
