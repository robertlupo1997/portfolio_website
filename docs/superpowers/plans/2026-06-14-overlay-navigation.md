# Overlay Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate vertical scrolling by absorbing the footer into the Info overlay and adding a Projects overlay for vertical project listing, making the carousel the entire page.

**Architecture:** Two full-screen overlays (INFO and PROJECTS) replace the footer and provide navigation. The carousel exposes a `goTo` callback via a registration prop so the Projects overlay can jump to specific slides. Header buttons trigger overlays instead of scrolling.

**Tech Stack:** React 19, TypeScript, CSS (existing design system tokens)

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `components/Carousel.tsx` | Modify | Accept `onRegisterGoTo` prop, expose `goTo` |
| `components/ProjectsOverlay.tsx` | Create | Full-screen overlay with archive-style project rows |
| `components/InfoOverlay.tsx` | Modify | Add contact section (email, links, colophon) |
| `components/Header.tsx` | Modify | PROJECTS becomes button triggering overlay |
| `App.tsx` | Modify | Wire both overlays, remove Footer, register goTo |
| `components/Footer.tsx` | Delete | Content absorbed into InfoOverlay |
| `styles/index.css` | Modify | Add overlay + contact styles, remove dead footer/archive CSS |

---

### Task 1: Expose goTo from Carousel

Add a registration prop so App.tsx can get a handle on the carousel's `goTo` function.

**Files:**
- Modify: `components/Carousel.tsx`

- [ ] **Step 1: Add onRegisterGoTo prop and re-add goTo to destructured hook return**

Replace the entire `Carousel.tsx` with:

```tsx
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { CAROUSEL_PROJECTS } from '../constants';
import { useCarousel } from '../hooks/useCarousel';
import CarouselSlide from './CarouselSlide';

interface CarouselProps {
  onRegisterGoTo?: (goTo: (index: number) => void) => void;
}

const Carousel: React.FC<CarouselProps> = ({ onRegisterGoTo }) => {
  const {
    activeIndex,
    isFirst,
    isLast,
    next,
    prev,
    goTo,
    swipeHandlers,
  } = useCarousel({ totalSlides: CAROUSEL_PROJECTS.length });

  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const prevIndex = useRef(0);

  useEffect(() => {
    if (onRegisterGoTo) onRegisterGoTo(goTo);
  }, [onRegisterGoTo, goTo]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    gsap.to(track, {
      x: `-${activeIndex * 100}vw`,
      duration: 0.35,
      ease: 'power3.out',
    });

    if (prevIndex.current !== activeIndex && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    prevIndex.current = activeIndex;
  }, [activeIndex]);

  return (
    <section className="carousel" id="projects" ref={sectionRef} {...swipeHandlers}>
      <div className="carousel-track" ref={trackRef}>
        {CAROUSEL_PROJECTS.map((project, i) => (
          <CarouselSlide
            key={project.id}
            project={project}
            index={i}
            isActive={i === activeIndex}
            onPrev={prev}
            onNext={next}
            isFirst={isFirst}
            isLast={isLast}
            activeIndex={activeIndex}
            totalSlides={CAROUSEL_PROJECTS.length}
          />
        ))}
      </div>
    </section>
  );
};

export default Carousel;
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit && npm run build`
Expected: Clean build (prop is optional, App doesn't pass it yet).

- [ ] **Step 3: Commit**

```bash
git add components/Carousel.tsx
git commit -m "feat: expose goTo from Carousel via onRegisterGoTo prop"
```

---

### Task 2: Create ProjectsOverlay component and CSS

New full-screen overlay with archive-style rows. Clicking a row jumps the carousel; the arrow opens the external link.

**Files:**
- Create: `components/ProjectsOverlay.tsx`
- Modify: `styles/index.css`

- [ ] **Step 1: Create ProjectsOverlay.tsx**

Create `components/ProjectsOverlay.tsx` with:

```tsx
import React, { useEffect, useRef, useCallback } from 'react';
import { CAROUSEL_PROJECTS } from '../constants';

interface ProjectsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToSlide: (index: number) => void;
}

const ProjectsOverlay: React.FC<ProjectsOverlayProps> = ({ isOpen, onClose, onGoToSlide }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();

    if (e.key === 'Tab' && overlayRef.current) {
      const focusable = overlayRef.current.querySelectorAll<HTMLElement>(
        'button, a[href], [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      returnRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => closeRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
      returnRef.current?.focus();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  const handleRowClick = (index: number) => {
    onGoToSlide(index);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="projects-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="All projects"
    >
      <button
        ref={closeRef}
        className="projects-close"
        onClick={onClose}
        aria-label="Close projects"
      >
        [ CLOSE ]
      </button>

      <div className="projects-content">
        <h2 className="projects-header">PROJECTS /2024–26</h2>

        <div className="projects-list">
          {CAROUSEL_PROJECTS.map((project, i) => {
            const url = project.githubUrl || project.liveUrl;
            return (
              <div
                key={project.id}
                className="projects-row"
                role="button"
                tabIndex={0}
                onClick={() => handleRowClick(i)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleRowClick(i); }}
              >
                <span className="projects-index">P/{String(i + 1).padStart(2, '0')}</span>
                <span className="projects-title">{project.title}</span>
                <span className="projects-category">{project.category}</span>
                <span className="projects-metric">{project.metric}</span>
                {url && (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="projects-arrow"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Open ${project.title} in new tab`}
                  >
                    -&gt;
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectsOverlay;
```

- [ ] **Step 2: Add ProjectsOverlay CSS**

In `styles/index.css`, add after the INFO OVERLAY section (after line ~730, before the FOOTER section):

```css
/* ============================================
   PROJECTS OVERLAY
   ============================================ */

.projects-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-overlay);
  background-color: rgba(71, 71, 65, 0.98);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  animation: overlayIn var(--duration-md) var(--ease-out);
}

.projects-close {
  position: fixed;
  top: var(--space-lg);
  right: var(--page-margin);
  font-family: var(--font-departure);
  font-size: var(--text-label);
  color: var(--accent);
  border: 1px solid var(--accent);
  background: transparent;
  padding: 0.5rem 1rem;
  letter-spacing: 0.06em;
  cursor: pointer;
  z-index: 1;
  transition: background-color var(--duration-md) var(--ease-out),
              color var(--duration-md) var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .projects-close:hover { background-color: var(--accent); color: var(--bg-primary); }
}

.projects-content {
  padding: calc(64px + var(--space-3xl)) var(--page-margin) var(--space-3xl);
  max-width: var(--max-width);
  margin: 0 auto;
  width: 100%;
}

.projects-header {
  font-family: var(--font-departure);
  font-size: var(--text-label);
  font-weight: 400;
  color: var(--accent-dim);
  letter-spacing: 0.1em;
  margin-bottom: var(--space-2xl);
}

.projects-list { display: flex; flex-direction: column; }

.projects-row {
  display: grid;
  grid-template-columns: 4rem 1fr auto auto 2rem;
  align-items: center;
  gap: var(--space-lg);
  padding: var(--space-lg) 0;
  border-bottom: 1px solid var(--border-subtle);
  cursor: pointer;
  transition: opacity var(--duration-md) var(--ease-out),
              background-color var(--duration-md) var(--ease-out);
}

.projects-row:first-child { border-top: 1px solid var(--border-subtle); }

.projects-list:hover .projects-row { opacity: 0.4; }
.projects-list:hover .projects-row:hover { opacity: 1; background-color: var(--bg-elevated); }
.projects-row:active { transform: scale(0.99); }

.projects-row:focus-visible {
  opacity: 1;
  background-color: var(--bg-elevated);
  outline: 2px solid var(--accent);
  outline-offset: -2px;
}

.projects-index { font-family: var(--font-departure); font-size: var(--text-label); color: var(--accent); letter-spacing: 0.06em; }
.projects-title { font-family: var(--font-departure); font-size: var(--text-nav); color: var(--text-primary); }
.projects-category { font-family: var(--font-departure); font-size: var(--text-label); color: var(--accent-dim); letter-spacing: 0.04em; text-align: right; }
.projects-metric { font-family: var(--font-departure); font-size: var(--text-label); color: var(--text-primary); font-variant-numeric: tabular-nums; text-align: right; }
.projects-arrow { font-family: var(--font-departure); font-size: var(--text-label); color: var(--accent-dim); transition: transform var(--duration-md) var(--ease-out); text-decoration: none; }

@media (hover: hover) and (pointer: fine) {
  .projects-row:hover .projects-arrow { transform: translateX(4px); }
}

@media (max-width: 768px) {
  .projects-row {
    grid-template-columns: 3rem 1fr;
    gap: var(--space-sm);
  }
  .projects-category, .projects-metric { grid-column: 2; text-align: left; }
  .projects-arrow { display: none; }
}
```

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit && npm run build`
Expected: Clean build (component exists but isn't rendered yet).

- [ ] **Step 4: Commit**

```bash
git add components/ProjectsOverlay.tsx styles/index.css
git commit -m "feat: create ProjectsOverlay component with archive-style rows"
```

---

### Task 3: Merge footer content into InfoOverlay

Move the contact info (email, social links, colophon) from Footer.tsx into InfoOverlay. Add it as a new section below the existing skills/timeline content.

**Files:**
- Modify: `components/InfoOverlay.tsx`
- Modify: `styles/index.css`

- [ ] **Step 1: Update InfoOverlay.tsx**

Replace the entire file with:

```tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SKILL_GROUPS, TIMELINE, PERSONAL_INFO } from '../constants';

interface InfoOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoOverlay: React.FC<InfoOverlayProps> = ({ isOpen, onClose }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnRef = useRef<HTMLElement | null>(null);
  const [copied, setCopied] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();

    if (e.key === 'Tab' && overlayRef.current) {
      const focusable = overlayRef.current.querySelectorAll<HTMLElement>(
        'button, a[href], [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      returnRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => closeRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
      returnRef.current?.focus();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  const handleEmailClick = async () => {
    try {
      await navigator.clipboard.writeText(PERSONAL_INFO.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${PERSONAL_INFO.email}`;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="info-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="About Trey Lupo"
    >
      <button
        ref={closeRef}
        className="info-close"
        onClick={onClose}
        aria-label="Close info"
      >
        [ CLOSE ]
      </button>

      <div className="info-content">
        <div className="info-bio">
          <h2 className="info-name">TREY LUPO</h2>
          <p className="info-title">AI/ML Systems Engineer</p>

          <p className="info-text">
            Corporate FP&A Analyst at Franklin Street in Tampa. I build Python SDKs
            that replace manual Oracle exports, ML frameworks in Rust that ship with
            statistical rigor, and revenue models that actually reconcile across
            business lines.
          </p>

          <p className="info-text">
            Background: B.A. Statistics from USF, MIT Data Science certificate, and
            an AI engineering internship at Origin Construction. I write code that
            ships to production, not notebooks that sit in repos.
          </p>

          <div className="info-credentials">
            <span>B.A. Statistics · USF</span>
            <span>MIT Data Science Certificate</span>
          </div>
        </div>

        <div className="info-terminal">
          <div className="info-section">
            <p className="info-prompt">$ skills --list</p>
            {SKILL_GROUPS.map((group) => (
              <div key={group.label} className="info-skill-row">
                <span className="info-skill-label">{group.label}</span>
                <span className="info-skill-value">{group.items.join(' / ')}</span>
              </div>
            ))}
          </div>

          <div className="info-section">
            <p className="info-prompt">$ history --career</p>
            {TIMELINE.map((entry) => (
              <div key={entry.year} className="info-timeline-row">
                <span className="info-timeline-year">{entry.year}</span>
                <span className="info-timeline-title">
                  {entry.title}
                  {entry.current && <span className="info-current"> &lt;- CURRENT</span>}
                </span>
              </div>
            ))}
          </div>

          <div className="info-section">
            <p className="info-prompt">$ contact --reach-out</p>
            <div className="info-contact">
              <div className="info-contact-statement">Let's build something.</div>
              <button
                className="info-contact-email"
                onClick={handleEmailClick}
                type="button"
                aria-live="polite"
              >
                {copied ? 'copied!' : PERSONAL_INFO.email}
              </button>
              <div className="info-contact-links">
                <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href={PERSONAL_INFO.huggingface} target="_blank" rel="noopener noreferrer">HuggingFace</a>
              </div>
              <div className="info-contact-colophon">
                <span>Design + Development · Trey Lupo</span>
                <span>Fonts · Departure Mono · Inter</span>
                <span>&copy;2026 Tampa, FL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoOverlay;
```

- [ ] **Step 2: Add info-contact CSS**

In `styles/index.css`, add after the `.info-current` rule (after line ~730, before the PROJECTS OVERLAY section):

```css
.info-contact {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.info-contact-statement {
  font-family: var(--font-departure);
  font-size: var(--text-h2);
  color: var(--text-primary);
  margin-bottom: var(--space-md);
}

.info-contact-email {
  font-family: var(--font-departure);
  font-size: var(--text-nav);
  color: var(--accent);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
  transition: color var(--duration-sm) var(--ease-out);
}
.info-contact-email:hover { color: var(--text-primary); }

.info-contact-links {
  display: flex;
  gap: var(--space-lg);
  margin-top: var(--space-sm);
}

.info-contact-links a {
  font-family: var(--font-departure);
  font-size: var(--text-label);
  color: var(--accent-dim);
  letter-spacing: 0.06em;
  transition: color var(--duration-sm) var(--ease-out);
}
.info-contact-links a:hover { color: var(--text-primary); }

.info-contact-colophon {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  margin-top: var(--space-xl);
  font-family: var(--font-departure);
  font-size: var(--text-label);
  color: var(--text-tertiary);
  letter-spacing: 0.04em;
}
```

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit && npm run build`
Expected: Clean build.

- [ ] **Step 4: Commit**

```bash
git add components/InfoOverlay.tsx styles/index.css
git commit -m "feat: merge footer contact section into InfoOverlay"
```

---

### Task 4: Wire App.tsx and Header — connect overlays, remove Footer

Connect both overlays in App.tsx, register `goTo` from Carousel, update Header to trigger PROJECTS overlay, and remove Footer.

**Files:**
- Modify: `App.tsx`
- Modify: `components/Header.tsx`

- [ ] **Step 1: Update App.tsx**

Replace the entire file with:

```tsx
import React, { useState, useCallback, useRef } from 'react';
import Header from './components/Header';
import Carousel from './components/Carousel';
import InfoOverlay from './components/InfoOverlay';
import ProjectsOverlay from './components/ProjectsOverlay';
import Cursor from './components/Cursor';
import Preloader from './components/Preloader';
import { useLenis } from './hooks/useLenis';
import { useScrollAnimations } from './hooks/useScrollAnimations';
import './styles/index.css';

const App: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const goToRef = useRef<((index: number) => void) | null>(null);
  const onPreloaderComplete = useCallback(() => setLoaded(true), []);

  const anyOverlayOpen = infoOpen || projectsOpen;
  useLenis(loaded && !anyOverlayOpen);
  useScrollAnimations();

  const handleGoToSlide = useCallback((index: number) => {
    goToRef.current?.(index);
  }, []);

  const handleRegisterGoTo = useCallback((goTo: (index: number) => void) => {
    goToRef.current = goTo;
  }, []);

  return (
    <>
      <Preloader onComplete={onPreloaderComplete} />
      <Cursor />
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <div className={`site-content ${loaded ? 'site-content--visible' : ''}`}>
        <Header
          onInfoClick={() => setInfoOpen(true)}
          onProjectsClick={() => setProjectsOpen(true)}
        />
        <main id="main-content" className="main">
          <Carousel onRegisterGoTo={handleRegisterGoTo} />
        </main>
      </div>
      <InfoOverlay isOpen={infoOpen} onClose={() => setInfoOpen(false)} />
      <ProjectsOverlay
        isOpen={projectsOpen}
        onClose={() => setProjectsOpen(false)}
        onGoToSlide={handleGoToSlide}
      />
    </>
  );
};

export default App;
```

- [ ] **Step 2: Update Header.tsx**

Replace the entire file with:

```tsx
import React, { useState, useEffect } from 'react';
import TextScramble from './TextScramble';

interface HeaderProps {
  onInfoClick: () => void;
  onProjectsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onInfoClick, onProjectsClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const handleNavClick = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="header">
        <span className="header-name">
          <TextScramble text="TREY LUPO" triggerOnView={false} triggerOnHover={true} duration={600} />
        </span>

        <nav className="header-nav">
          <button className="header-pill" onClick={onProjectsClick}>PROJECTS</button>
          <button className="header-pill" onClick={onInfoClick}>INFO</button>
        </nav>

        <button
          className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </header>

      <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          <button onClick={() => { handleNavClick(); onProjectsClick(); }}>PROJECTS</button>
          <button onClick={() => { handleNavClick(); onInfoClick(); }}>INFO</button>
        </nav>
      </div>
    </>
  );
};

export default Header;
```

Key changes:
- `HeaderProps` gains `onProjectsClick`
- PROJECTS changes from `<a href="#projects">` to `<button onClick={onProjectsClick}>`
- "TREY LUPO" changes from `<a href="#projects">` to `<span>` (no scroll target needed)
- Mobile nav: PROJECTS link becomes a button calling `onProjectsClick`

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit && npm run build`
Expected: Clean build. Footer import is gone but `Footer.tsx` still exists on disk (harmless).

- [ ] **Step 4: Commit**

```bash
git add App.tsx components/Header.tsx
git commit -m "feat: wire overlay navigation — PROJECTS overlay, remove Footer from render"
```

---

### Task 5: CSS cleanup — remove dead footer and archive styles

Remove the now-unused `.footer-*` and `.archive-*` CSS blocks. The footer content is styled inside InfoOverlay now, and the archive rows are replaced by `.projects-*` styles.

**Files:**
- Modify: `styles/index.css`
- Delete: `components/Footer.tsx`
- Delete: `components/ArchiveList.tsx`

- [ ] **Step 1: Remove dead CSS blocks**

In `styles/index.css`, delete these sections entirely:

1. The `ARCHIVE LIST` section (lines 569–609) — all `.archive*` rules
2. The `FOOTER` section (lines 737–797) — all `.footer*` rules
3. In the mobile responsive section, remove the `.footer-grid` and `.footer-colophon` overrides (lines 867–868)

- [ ] **Step 2: Delete dead component files**

```bash
rm components/Footer.tsx components/ArchiveList.tsx
```

Both are unused — Footer was removed from App.tsx in Task 4, ArchiveList was removed in a prior session.

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit && npm run build`
Expected: Clean build, no references to deleted files.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove dead Footer, ArchiveList components and their CSS"
```
