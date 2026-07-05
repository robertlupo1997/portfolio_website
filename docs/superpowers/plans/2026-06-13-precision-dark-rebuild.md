# Precision Dark Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild treylupo.com from the current "Invisible Frame" direction to "Precision Dark" — a Michelini-inspired structural system with copper accent, Space Grotesk + Inter + JetBrains Mono typography, vertical project list with P/01 slash grammar, centered hero, credential strip, and proper footer conclusion.

**Architecture:** Single-page React 19 + Vite app. No framework change. Rewrite CSS variables, restructure all 6 components (Hero, Header, FeaturedProjects+AllWork→ProjectList, About, Footer), add CredentialStrip. Keep GSAP + Lenis + SplitText. Keep existing data plates and cursor-follow preview.

**Tech Stack:** React 19, Vite, TypeScript, GSAP (ScrollTrigger, SplitText), Lenis, Space Grotesk + Inter + JetBrains Mono via Google Fonts

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Rewrite | `styles/index.css` | All CSS variables, reset, component styles |
| Rewrite | `index.html` | Font links (Satoshi→Inter+Space Grotesk), meta updates |
| Rewrite | `components/Hero.tsx` | Centered hero, single CTA, Space Grotesk name |
| Rewrite | `components/Header.tsx` | Horizontal nav, GSAP scroll show/hide |
| Create | `components/ProjectList.tsx` | Unified P/01 vertical list replacing FeaturedProjects+AllWork |
| Create | `components/CredentialStrip.tsx` | Horizontal marquee of proof tokens |
| Rewrite | `components/About.tsx` | Remove arcs, fold timeline in, tighten skills |
| Rewrite | `components/Footer.tsx` | Kill giant scramble, add closing statement, expand links |
| Modify | `components/LineReveal.tsx` | Update to Inter font (no code change needed — inherits CSS) |
| Modify | `components/TextScramble.tsx` | No code change needed — inherits CSS |
| Modify | `components/Cursor.tsx` | No code change needed |
| Modify | `App.tsx` | Update imports (remove FeaturedProjects+AllWork, add ProjectList+CredentialStrip) |
| Modify | `constants.ts` | Add `CREDENTIALS` array, apply slash grammar to categories |
| Modify | `types.ts` | Add `Credential` type |
| Delete | `components/FeaturedProjects.tsx` | Replaced by ProjectList |
| Delete | `components/AllWork.tsx` | Replaced by ProjectList |
| Modify | `hooks/useScrollAnimations.ts` | Simplify — remove about parallax/blur animations |

---

### Task 1: CSS Variables + Font Links

**Files:**
- Modify: `rlupo-portfolio/styles/index.css:1-83` (`:root` block)
- Modify: `rlupo-portfolio/index.html:60-65` (font links)

- [ ] **Step 1: Replace the `:root` CSS variables**

Replace the entire `:root` block in `styles/index.css` (lines 7-83) with the Precision Dark tokens:

```css
:root {
  /* Colors — Precision Dark */
  --bg-void: #050506;
  --bg-primary: #0A0A0B;
  --bg-elevated: #111113;
  --bg-surface: #18181B;

  --text-primary: #E8E5DF;
  --text-secondary: #8A8780;
  --text-tertiary: #5A5855;

  --accent: #C87533;
  --accent-dim: #A35E28;
  --accent-subtle: #2A1D12;

  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-default: rgba(255, 255, 255, 0.10);
  --border-emphasis: rgba(255, 255, 255, 0.16);

  /* Typography */
  --font-display: 'Space Grotesk', -apple-system, sans-serif;
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;

  --text-hero: clamp(2.5rem, 8vw, 4.5rem);
  --text-h1: 2.25rem;
  --text-h2: 1.5rem;
  --text-h3: 1.125rem;
  --text-body: 1rem;
  --text-body-sm: 0.875rem;
  --text-mono-label: 0.75rem;
  --text-mono-nav: 0.875rem;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  --space-3xl: 4rem;
  --space-4xl: 6rem;
  --space-section: 8rem;

  /* Layout */
  --page-margin: max(1.5rem, calc((100vw - 1200px) / 2));
  --max-width: 1200px;

  /* Border Radius */
  --radius-none: 0;
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;

  /* Easing */
  --ease-out: cubic-bezier(0.215, 0.61, 0.355, 1);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);

  /* Z-Index */
  --z-cursor: 9999;
  --z-nav: 100;
  --z-modal: 200;
}
```

- [ ] **Step 2: Update all `--accent-blue` references to `--accent`**

Search and replace throughout `index.css`:
- `var(--accent-blue)` → `var(--accent)`
- `var(--accent-blue-hover)` → `var(--accent-dim)`
- `var(--text-muted)` → `var(--text-tertiary)`
- `var(--bg-secondary)` → `var(--bg-elevated)`
- `var(--bg-tertiary)` → `var(--bg-surface)`
- `var(--bg-card)` → `var(--bg-elevated)`
- `var(--bg-card-hover)` → `var(--bg-surface)`
- `var(--border-medium)` → `var(--border-emphasis)`

- [ ] **Step 3: Update base typography rules**

Replace the `body` font-family and heading rules (lines 118-196):

```css
body {
  font-family: var(--font-sans);
  font-size: var(--text-body);
  font-weight: 400;
  line-height: 1.6;
  color: var(--text-primary);
  background-color: var(--bg-primary);
  overflow-x: hidden;
}

h1, h2, h3 {
  font-family: var(--font-sans);
  font-weight: 500;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

::selection {
  background-color: var(--accent);
  color: var(--bg-primary);
}
```

- [ ] **Step 4: Update font links in `index.html`**

Replace lines 60-65 in `index.html`:

```html
<!-- Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@600&display=swap" rel="stylesheet" />
```

Remove the Fontshare/Satoshi preconnect and stylesheet links.

- [ ] **Step 5: Run build to verify CSS compiles**

Run: `cd rlupo-portfolio && npm run build`
Expected: Build succeeds (components will look wrong because they still reference old class names — that's fine, we're just verifying no CSS syntax errors)

- [ ] **Step 6: Commit**

```bash
git add styles/index.css index.html
git commit -m "refactor: swap design tokens to Precision Dark (copper + Inter + Space Grotesk)"
```

---

### Task 2: Hero — Center + Single CTA

**Files:**
- Rewrite: `rlupo-portfolio/components/Hero.tsx`
- Modify: `rlupo-portfolio/styles/index.css` (hero section)

- [ ] **Step 1: Rewrite Hero.tsx**

```tsx
import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import TextScramble from './TextScramble';
import { PERSONAL_INFO } from '../constants';

const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const btn = ctaRef.current;
    if (!btn) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const xTo = gsap.quickTo(btn, 'x', { duration: 0.3, ease: 'power2.out' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.3, ease: 'power2.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const factor = 1 - dist / 100;
        xTo(dx * factor * 0.4);
        yTo(dy * factor * 0.4);
      }
    };

    const handleMouseLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: 'expo.out' });
    };

    btn.parentElement?.addEventListener('mousemove', handleMouseMove);
    btn.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      btn.parentElement?.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section className="hero" id="hero">
      <div className="hero-content">
        <h1 className="hero-name">
          <TextScramble text="Trey Lupo" triggerOnView={false} triggerOnHover={true} duration={1500} delay={200} />
        </h1>
        <p className={`hero-descriptor ${isLoaded ? 'visible' : ''}`}>
          AI/ML systems engineer.
        </p>
        <div className={`hero-cta-wrap ${isLoaded ? 'visible' : ''}`}>
          <a ref={ctaRef} href={`mailto:${PERSONAL_INFO.email}`} className="btn-primary">
            Get in touch
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
```

- [ ] **Step 2: Replace hero CSS**

Replace the hero section in `styles/index.css` (`.hero` through `.hero-divider`) with:

```css
.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--page-margin);
  position: relative;
}

.hero-content {
  max-width: 800px;
}

.hero-name {
  font-family: var(--font-display);
  font-size: var(--text-hero);
  font-weight: 600;
  line-height: 1.0;
  letter-spacing: -0.03em;
  color: var(--text-primary);
  margin-bottom: var(--space-lg);
}

.hero-descriptor {
  font-size: var(--text-body);
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: var(--space-2xl);
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.8s var(--ease-out-expo) 0.4s, transform 0.8s var(--ease-out-expo) 0.4s;
}

.hero-descriptor.visible {
  opacity: 1;
  transform: translateY(0);
}

.hero-cta-wrap {
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.8s var(--ease-out-expo) 0.6s, transform 0.8s var(--ease-out-expo) 0.6s;
}

.hero-cta-wrap.visible {
  opacity: 1;
  transform: translateY(0);
}

.btn-primary {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: var(--text-mono-label);
  font-weight: 400;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--bg-primary);
  background-color: var(--accent);
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  transition: background-color 200ms var(--ease-out), transform 160ms var(--ease-out);
  will-change: transform;
}

.btn-primary:hover {
  background-color: var(--accent-dim);
}

.btn-primary:active {
  transform: scale(0.97);
}
```

- [ ] **Step 3: Delete old hero classes**

Remove `.hero-hook`, `.hero-status`, `.hero-ctas`, `.hero-cta-outline`, `.hero-cta-primary`, `.hero-cta-magnetic`, and `.hero-divider` CSS blocks.

- [ ] **Step 4: Build and verify**

Run: `cd rlupo-portfolio && npm run build`
Expected: Success

- [ ] **Step 5: Commit**

```bash
git add components/Hero.tsx styles/index.css
git commit -m "feat: centered hero with Space Grotesk, single CTA, remove ghost button"
```

---

### Task 3: Header — Horizontal Nav + Scroll Show/Hide

**Files:**
- Rewrite: `rlupo-portfolio/components/Header.tsx`
- Modify: `rlupo-portfolio/styles/index.css` (header section)

- [ ] **Step 1: Rewrite Header.tsx**

```tsx
import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PERSONAL_INFO } from '../constants';
import TextScramble from './TextScramble';

gsap.registerPlugin(ScrollTrigger);

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const showAnim = gsap.from(header, {
      yPercent: -100,
      paused: true,
      duration: 0.3,
      ease: 'power2.out',
    }).progress(1);

    ScrollTrigger.create({
      start: 'top top',
      end: 'max',
      onUpdate: (self) => {
        self.direction === -1 ? showAnim.play() : showAnim.reverse();
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const handleNavClick = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="header" ref={headerRef}>
        <a href="#hero" className="header-name">
          <TextScramble text="Trey Lupo" triggerOnView={false} triggerOnHover={true} duration={600} />
        </a>

        <nav className="header-nav">
          <a href="#projects" className="nav-link">Projects</a>
          <a href="#about" className="nav-link">Info</a>
          <a href={`mailto:${PERSONAL_INFO.email}`} className="nav-link nav-link--accent">Contact</a>
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
          <a href="#projects" onClick={handleNavClick}>Projects</a>
          <a href="#about" onClick={handleNavClick}>Info</a>
          <a href={`mailto:${PERSONAL_INFO.email}`} onClick={handleNavClick}>Contact</a>
        </nav>
      </div>
    </>
  );
};

export default Header;
```

- [ ] **Step 2: Replace header CSS**

Replace all `.header-valiente`, `.header-left`, `.header-logo-center`, `.header-right`, `.header-location`, `.header-contact-btn`, `.valiente-nav`, `.valiente-nav-link`, `.valiente-hamburger`, `.hamburger-mobile` blocks with:

```css
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-nav);
  height: 64px;
  padding: 0 var(--page-margin);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-subtle);
}

.header-name {
  font-family: var(--font-mono);
  font-size: var(--text-mono-nav);
  font-weight: 400;
  letter-spacing: 0.02em;
  color: var(--text-primary);
}

.header-nav {
  display: flex;
  gap: var(--space-xl);
}

.nav-link {
  font-family: var(--font-mono);
  font-size: var(--text-mono-nav);
  font-weight: 400;
  letter-spacing: 0.02em;
  color: var(--text-secondary);
  transition: color 200ms var(--ease-out);
}

.nav-link:hover {
  color: var(--text-primary);
}

.nav-link--accent {
  color: var(--accent);
}

.nav-link--accent:hover {
  color: var(--accent-dim);
}

.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  cursor: pointer;
}

.hamburger-line {
  width: 24px;
  height: 1.5px;
  background-color: var(--text-primary);
  transition: transform 200ms var(--ease-out), opacity 200ms var(--ease-out);
}

.hamburger.open .hamburger-line:nth-child(1) {
  transform: translateY(3.75px) rotate(45deg);
}

.hamburger.open .hamburger-line:nth-child(2) {
  transform: translateY(-3.75px) rotate(-45deg);
}

@media (max-width: 768px) {
  .header-nav { display: none; }
  .hamburger { display: flex; }
}
```

- [ ] **Step 3: Delete old header CSS**

Remove all `.header-valiente`, `.header-left`, `.header-logo-center`, `.header-right`, `.header-location`, `.header-contact-btn`, `.contact-btn-arrow`, `.valiente-nav*`, `.hamburger-mobile` CSS blocks, and the `.header-nav a` rules (lines ~1174-1337 in current CSS). Also delete the old unused `.header` block (lines ~222-284).

- [ ] **Step 4: Build and verify**

Run: `cd rlupo-portfolio && npx tsc --noEmit && npm run build`
Expected: Success

- [ ] **Step 5: Commit**

```bash
git add components/Header.tsx styles/index.css
git commit -m "feat: horizontal nav with GSAP scroll show/hide, remove vertical stack"
```

---

### Task 4: Unified Project List with P/01 Slash Grammar

**Files:**
- Create: `rlupo-portfolio/components/ProjectList.tsx`
- Modify: `rlupo-portfolio/constants.ts` (update category strings to slash grammar)
- Modify: `rlupo-portfolio/App.tsx` (swap imports)
- Delete: `rlupo-portfolio/components/FeaturedProjects.tsx`
- Delete: `rlupo-portfolio/components/AllWork.tsx`
- Modify: `rlupo-portfolio/styles/index.css`

- [ ] **Step 1: Update constants.ts category strings to slash grammar**

Replace the `epoch` field format and `category` strings across both `FEATURED_PROJECTS` and `ALL_PROJECTS`:

```typescript
// In FEATURED_PROJECTS:
// nspb-api:
category: "//api engineering",
epoch: "/26",

// ferroml:
category: "//systems · automl",
epoch: "/26",

// revenue-forecast:
category: "//time series",
epoch: "/26",

// In ALL_PROJECTS:
// kkbox:
category: "//ml · production",
epoch: "/24",

// obj-detect:
category: "//computer vision",
epoch: "/24",

// ironclad:
category: "//construction ml",
epoch: "/26",

// ferroml-plugin:
category: "//ai tooling",
epoch: "/26",

// gsd-ml:
category: "//ai tooling",
epoch: "/26",

// mlforge:
category: "//automl",
epoch: "/26",
```

- [ ] **Step 2: Create ProjectList.tsx**

```tsx
import React, { useState, useMemo, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { FEATURED_PROJECTS, ALL_PROJECTS, PROJECT_CATEGORIES } from '../constants';
import { Project, ProjectCategory } from '../types';
import LineReveal from './LineReveal';

const ALL = [...FEATURED_PROJECTS, ...ALL_PROJECTS];

const ProjectList: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>('all');
  const sectionRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [preview, setPreview] = useState<Project | null>(null);

  const canPreview = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return ALL;
    return ALL.filter((p) => p.projectCategory === activeFilter);
  }, [activeFilter]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = previewRef.current;
    if (!el || !canPreview) return;
    gsap.set(el, { xPercent: -50, yPercent: -50 });
    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3.out' });
    const handleMouseMove = (e: MouseEvent) => { xTo(e.clientX); yTo(e.clientY); };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [canPreview]);

  return (
    <section className={`folio ${isVisible ? 'folio--visible' : ''}`} id="projects" ref={sectionRef}>
      <div className="folio-header">
        <h2 className="section-label">Folio /2026</h2>
        <div className="folio-filters" role="group" aria-label="Filter projects">
          {PROJECT_CATEGORIES.map(({ key, label }) => (
            <button
              key={key}
              className={`folio-filter ${activeFilter === key ? 'active' : ''}`}
              onClick={() => setActiveFilter(key)}
              aria-pressed={activeFilter === key}
            >
              {label.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="folio-list" onMouseLeave={() => setPreview(null)}>
        {filtered.map((project, index) => (
          <a
            key={project.id}
            href={project.githubUrl || project.liveUrl || '#'}
            target={project.githubUrl || project.liveUrl ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="folio-entry"
            style={{ transitionDelay: `${index * 0.04}s` } as React.CSSProperties}
            onMouseEnter={() => canPreview && setPreview(project)}
          >
            <span className="folio-index">P/{String(index + 1).padStart(2, '0')}</span>
            <span className="folio-year">{project.epoch}</span>
            <LineReveal as="span" className="folio-title">{project.title}</LineReveal>
            <span className="folio-category">{project.category}</span>
            <span className="folio-metric">{project.metric}</span>
          </a>
        ))}
      </div>

      <div
        ref={previewRef}
        className={`folio-preview ${preview ? 'folio-preview--visible' : ''}`}
        aria-hidden="true"
      >
        {preview && (preview.imageUrl ? (
          <img src={preview.imageUrl} alt="" />
        ) : (
          <div className="folio-preview-panel">
            <span className="folio-preview-metric">{preview.metric}</span>
            <span className="folio-preview-category">{preview.category}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectList;
```

- [ ] **Step 3: Add folio CSS to `styles/index.css`**

Remove ALL old `.featured`, `.fp-*`, `.work`, `.work-*` CSS. Add:

```css
/* ----- FOLIO (unified project list) ----- */
.folio {
  padding: var(--space-section) var(--page-margin);
}

.folio-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: var(--space-xl);
  flex-wrap: wrap;
  gap: var(--space-md);
}

.folio-filters {
  display: flex;
  gap: var(--space-sm);
}

.folio-filter {
  font-family: var(--font-mono);
  font-size: var(--text-mono-label);
  font-weight: 400;
  letter-spacing: 0.06em;
  color: var(--text-tertiary);
  padding: 0.35rem 0.7rem;
  border: 1px solid var(--border-subtle);
  background: transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: color 200ms var(--ease-out), border-color 200ms var(--ease-out), background-color 200ms var(--ease-out);
}

.folio-filter:hover {
  color: var(--text-secondary);
  border-color: var(--border-default);
}

.folio-filter.active {
  color: var(--accent);
  background: var(--accent-subtle);
  border-color: transparent;
}

.folio-list {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--border-subtle);
}

.folio-entry {
  display: grid;
  grid-template-columns: 4rem 3rem 1fr auto auto;
  align-items: center;
  gap: var(--space-lg);
  padding: var(--space-md) 0;
  border-bottom: 1px solid var(--border-subtle);
  text-decoration: none;
  transition: opacity 200ms var(--ease-out);
}

.folio .folio-entry {
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.4s var(--ease-out-expo), transform 0.4s var(--ease-out-expo);
}

.folio--visible .folio-entry {
  opacity: 1;
  transform: translateY(0);
}

.folio--visible .folio-entry:hover {
  opacity: 0.6;
}

.folio-index {
  font-family: var(--font-mono);
  font-size: var(--text-mono-label);
  font-weight: 400;
  letter-spacing: 0.06em;
  color: var(--accent);
  text-transform: uppercase;
}

.folio-year {
  font-family: var(--font-mono);
  font-size: var(--text-mono-label);
  color: var(--text-tertiary);
  letter-spacing: 0.06em;
}

.folio-title {
  font-family: var(--font-sans);
  font-size: var(--text-body);
  font-weight: 500;
  color: var(--text-primary);
}

.folio-category {
  font-family: var(--font-mono);
  font-size: var(--text-mono-label);
  color: var(--text-tertiary);
  letter-spacing: 0.06em;
  text-align: right;
}

.folio-metric {
  font-family: var(--font-mono);
  font-size: var(--text-mono-label);
  color: var(--text-secondary);
  letter-spacing: 0.02em;
  font-variant-numeric: tabular-nums;
  text-align: right;
  min-width: 6rem;
}

/* Cursor-follow preview */
.folio-preview {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  aspect-ratio: 16 / 9;
  background: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
  pointer-events: none;
  z-index: calc(var(--z-nav) - 1);
  opacity: 0;
  transition: opacity 200ms var(--ease-out);
}

.folio-preview--visible { opacity: 1; }
.folio-preview img { width: 100%; height: 100%; object-fit: cover; }

.folio-preview-panel {
  width: 100%; height: 100%;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: var(--space-sm);
}

.folio-preview-metric {
  font-size: 1.5rem; font-weight: 500;
  color: var(--text-primary); letter-spacing: -0.02em;
}

.folio-preview-category {
  font-family: var(--font-mono);
  font-size: var(--text-mono-label);
  color: var(--text-tertiary);
  letter-spacing: 0.06em;
}

@media (hover: none), (prefers-reduced-motion: reduce) {
  .folio-preview { display: none; }
}

@media (max-width: 768px) {
  .folio-entry {
    grid-template-columns: 4rem 1fr;
    gap: var(--space-sm);
  }
  .folio-year, .folio-category, .folio-metric { display: none; }
}
```

- [ ] **Step 4: Update App.tsx imports**

```tsx
import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import CredentialStrip from './components/CredentialStrip';
import ProjectList from './components/ProjectList';
import About from './components/About';
import Footer from './components/Footer';
import Cursor from './components/Cursor';
import { useLenis } from './hooks/useLenis';
import { useScrollAnimations } from './hooks/useScrollAnimations';
import './styles/index.css';

const App: React.FC = () => {
  useLenis();
  useScrollAnimations();

  return (
    <>
      <Cursor />
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Header />

      <main id="main-content" className="main">
        <Hero />
        <CredentialStrip />
        <ProjectList />
        <About />
      </main>

      <Footer />
    </>
  );
};

export default App;
```

- [ ] **Step 5: Delete old components**

```bash
rm components/FeaturedProjects.tsx components/AllWork.tsx
```

- [ ] **Step 6: Build and typecheck**

Run: `cd rlupo-portfolio && npx tsc --noEmit && npm run build`
Expected: May fail until CredentialStrip exists — that's Task 5. Temporarily comment out `<CredentialStrip />` in App.tsx if needed.

- [ ] **Step 7: Commit**

```bash
git add components/ProjectList.tsx components/App.tsx constants.ts styles/index.css
git rm components/FeaturedProjects.tsx components/AllWork.tsx
git commit -m "feat: unified P/01 project list with slash grammar, replace two-column layout"
```

---

### Task 5: Credential Strip Marquee

**Files:**
- Create: `rlupo-portfolio/components/CredentialStrip.tsx`
- Modify: `rlupo-portfolio/constants.ts` (add CREDENTIALS array)
- Modify: `rlupo-portfolio/types.ts` (add Credential type)
- Modify: `rlupo-portfolio/styles/index.css`

- [ ] **Step 1: Add type and data**

In `types.ts`, add:
```typescript
export interface Credential {
  label: string;
}
```

In `constants.ts`, add:
```typescript
export const CREDENTIALS: Credential[] = [
  { label: 'MIT Data Science Certificate' },
  { label: 'B.A. Statistics · USF' },
  { label: '6,500+ Tests · FerroML' },
  { label: '60+ API Endpoints · nspb-api' },
  { label: '0.97 AUC · KKBOX Churn' },
  { label: 'Franklin Street FP&A' },
  { label: 'Python · Rust · TypeScript · SQL' },
  { label: 'Origin Construction · AI Intern' },
];
```

- [ ] **Step 2: Create CredentialStrip.tsx**

```tsx
import React from 'react';
import { CREDENTIALS } from '../constants';

const CredentialStrip: React.FC = () => {
  const items = [...CREDENTIALS, ...CREDENTIALS];

  return (
    <div className="credential-strip" aria-label="Credentials">
      <div className="credential-track">
        {items.map((cred, i) => (
          <React.Fragment key={i}>
            <span className="credential-item">{cred.label}</span>
            <span className="credential-sep" aria-hidden="true">·</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CredentialStrip;
```

- [ ] **Step 3: Add CSS**

```css
/* ----- CREDENTIAL STRIP ----- */
.credential-strip {
  background: var(--bg-elevated);
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
  overflow: hidden;
  padding: var(--space-md) 0;
}

.credential-track {
  display: flex;
  gap: var(--space-lg);
  white-space: nowrap;
  animation: marquee 40s linear infinite;
}

.credential-strip:hover .credential-track {
  animation-play-state: paused;
}

.credential-item {
  font-family: var(--font-mono);
  font-size: var(--text-mono-label);
  font-weight: 400;
  letter-spacing: 0.06em;
  color: var(--text-tertiary);
  text-transform: uppercase;
  flex-shrink: 0;
}

.credential-sep {
  color: var(--text-tertiary);
  opacity: 0.5;
  flex-shrink: 0;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@media (prefers-reduced-motion: reduce) {
  .credential-track {
    animation: none;
    flex-wrap: wrap;
    white-space: normal;
    justify-content: center;
  }
}
```

- [ ] **Step 4: Uncomment CredentialStrip in App.tsx if it was commented out in Task 4**

- [ ] **Step 5: Build and typecheck**

Run: `cd rlupo-portfolio && npx tsc --noEmit && npm run build`
Expected: Success

- [ ] **Step 6: Commit**

```bash
git add components/CredentialStrip.tsx constants.ts types.ts styles/index.css App.tsx
git commit -m "feat: credential strip marquee with proof tokens"
```

---

### Task 6: About Section — Remove Arcs, Fold Timeline, Tighten Skills

**Files:**
- Rewrite: `rlupo-portfolio/components/About.tsx`
- Modify: `rlupo-portfolio/hooks/useScrollAnimations.ts`
- Modify: `rlupo-portfolio/styles/index.css`

- [ ] **Step 1: Rewrite About.tsx**

```tsx
import React from 'react';
import TextScramble from './TextScramble';
import { SKILL_GROUPS, TIMELINE } from '../constants';

const About: React.FC = () => (
  <section className="about" id="about">
    <div className="about-statement">
      <TextScramble
        text="I make financial data useful with code."
        as="p"
        className="about-statement-text"
        duration={800}
        triggerOnView={true}
        triggerOnHover={false}
        threshold={0.3}
      />
    </div>

    <div className="about-body">
      <p className="about-bio">
        Corporate FP&A Analyst at Franklin Street in Tampa. I build Python SDKs
        that replace manual Oracle exports, ML frameworks in Rust that ship with
        statistical rigor, and revenue models that actually reconcile across
        business lines.
      </p>

      <p className="about-bio">
        Background: B.A. Statistics from USF, MIT Data Science certificate, and
        an AI engineering internship at Origin Construction. I write code that
        ships to production, not notebooks that sit in repos.
      </p>

      <div className="about-skills">
        {SKILL_GROUPS.map((group) => (
          <div key={group.label} className="skill-group">
            <h3 className="skill-group-label">{group.label.toLowerCase()}</h3>
            <div className="skill-tags">
              {group.items.map((skill) => (
                <span key={skill} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="about-timeline">
        <h3 className="skill-group-label">timeline</h3>
        {TIMELINE.map((entry) => (
          <div key={entry.year} className="timeline-row">
            <span className={`timeline-year ${entry.current ? 'current' : ''}`}>{entry.year}</span>
            <div>
              <div className="timeline-title">{entry.title}</div>
              <div className="timeline-sub">{entry.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default About;
```

- [ ] **Step 2: Replace about CSS**

Remove all `.about-overlap`, `.about-*-overlap`, `.skills-overlap`, `.skill-tag-overlap`, `.services-overlap`, `.timeline-*-overlap`, and `.about-decorative` CSS. Add:

```css
/* ----- ABOUT ----- */
.about {
  padding: var(--space-section) var(--page-margin);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4xl);
  align-items: start;
}

.about-statement-text {
  font-family: var(--font-sans);
  font-size: var(--text-h1);
  font-weight: 500;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  max-width: 20ch;
}

.about-bio {
  font-size: var(--text-body);
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 55ch;
  margin-bottom: var(--space-lg);
}

.about-skills {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-top: var(--space-2xl);
}

.skill-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.skill-group-label {
  font-family: var(--font-mono);
  font-size: var(--text-mono-label);
  font-weight: 400;
  color: var(--text-tertiary);
  letter-spacing: 0.06em;
  text-transform: lowercase;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.skill-tag {
  font-family: var(--font-mono);
  font-size: var(--text-mono-label);
  font-weight: 400;
  color: var(--accent);
  background: var(--accent-subtle);
  border-radius: var(--radius-sm);
  padding: 0.25rem 0.6rem;
  letter-spacing: 0.04em;
}

.about-timeline {
  margin-top: var(--space-2xl);
}

.timeline-row {
  display: flex;
  gap: var(--space-lg);
  align-items: flex-start;
  padding: var(--space-sm) 0;
}

.timeline-year {
  font-family: var(--font-mono);
  font-size: var(--text-mono-label);
  color: var(--text-tertiary);
  letter-spacing: 0.06em;
  flex: 0 0 5rem;
  padding-top: 2px;
}

.timeline-year.current { color: var(--text-primary); }

.timeline-title {
  font-size: var(--text-body-sm);
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.4;
}

.timeline-sub {
  font-size: var(--text-body-sm);
  color: var(--text-secondary);
  line-height: 1.5;
  margin-top: 2px;
}

@media (max-width: 768px) {
  .about { grid-template-columns: 1fr; gap: var(--space-2xl); }
}
```

- [ ] **Step 3: Simplify `useScrollAnimations.ts`**

Replace the entire hook with a minimal version — the old one animated about-overlap classes that no longer exist:

```typescript
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollAnimations = () => {
  useEffect(() => {
    // Placeholder — individual components now own their own scroll triggers
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);
};
```

- [ ] **Step 4: Build and typecheck**

Run: `cd rlupo-portfolio && npx tsc --noEmit && npm run build`
Expected: Success

- [ ] **Step 5: Commit**

```bash
git add components/About.tsx hooks/useScrollAnimations.ts styles/index.css
git commit -m "feat: clean about section — remove arcs, fold timeline in, copper skill tags"
```

---

### Task 7: Footer — Conclusion Block

**Files:**
- Rewrite: `rlupo-portfolio/components/Footer.tsx`
- Modify: `rlupo-portfolio/styles/index.css`

- [ ] **Step 1: Rewrite Footer.tsx**

```tsx
import React, { useState } from 'react';
import { PERSONAL_INFO } from '../constants';

const Footer: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleEmailClick = async () => {
    try {
      await navigator.clipboard.writeText(PERSONAL_INFO.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${PERSONAL_INFO.email}`;
    }
  };

  return (
    <footer className="footer" id="contact">
      <div className="footer-statement">
        Building at the intersection of finance and machine learning.
      </div>

      <div className="footer-grid">
        <div className="footer-col">
          <span className="footer-label">©2026 Trey Lupo</span>
          <span className="footer-label">Tampa, FL</span>
        </div>

        <div className="footer-col">
          <button
            className="footer-email"
            onClick={handleEmailClick}
            type="button"
            aria-live="polite"
          >
            {copied ? 'copied!' : PERSONAL_INFO.email}
          </button>
        </div>

        <div className="footer-col footer-col--right">
          <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
          <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a>
          <a href={PERSONAL_INFO.huggingface} target="_blank" rel="noopener noreferrer" className="footer-link">HuggingFace</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

- [ ] **Step 2: Replace footer CSS**

Remove all `.footer-giant`, `.footer-giant-name`, `.footer-bottom`, `.footer-bottom-left`, `.footer-bottom-right`, `.footer-location`, `.footer-year`, `.footer-divider`, `.footer-email-btn`, `.footer-social-link` CSS. Add:

```css
/* ----- FOOTER ----- */
.footer {
  border-top: 1px solid var(--border-subtle);
  padding: var(--space-4xl) var(--page-margin) var(--space-2xl);
}

.footer-statement {
  font-size: var(--text-body);
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 45ch;
  margin-bottom: var(--space-3xl);
}

.footer-grid {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: var(--space-xl);
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.footer-col--right {
  align-items: flex-end;
}

.footer-label {
  font-family: var(--font-mono);
  font-size: var(--text-mono-label);
  color: var(--text-tertiary);
  letter-spacing: 0.06em;
}

.footer-email {
  font-family: var(--font-mono);
  font-size: var(--text-mono-nav);
  color: var(--text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 200ms var(--ease-out);
}

.footer-email:hover { color: var(--accent); }

.footer-link {
  font-family: var(--font-mono);
  font-size: var(--text-mono-label);
  color: var(--text-tertiary);
  letter-spacing: 0.06em;
  transition: color 200ms var(--ease-out);
}

.footer-link:hover { color: var(--text-primary); }

@media (max-width: 768px) {
  .footer-grid { flex-direction: column; gap: var(--space-lg); }
  .footer-col--right { align-items: flex-start; }
}
```

- [ ] **Step 3: Build and typecheck**

Run: `cd rlupo-portfolio && npx tsc --noEmit && npm run build`
Expected: Success

- [ ] **Step 4: Commit**

```bash
git add components/Footer.tsx styles/index.css
git commit -m "feat: footer conclusion block with closing statement, kill giant scramble"
```

---

### Task 8: Polish Pass — Sweep Remaining References + Final Build

**Files:**
- Modify: `rlupo-portfolio/styles/index.css` (sweep for stale classes)
- Modify: `rlupo-portfolio/index.html` (update title/meta)

- [ ] **Step 1: Grep for stale variable references**

Run: `grep -rn 'accent-blue\|bg-card\|bg-scrolled\|text-muted\|border-medium\|font-sans.*Satoshi\|text-number\|text-section\|text-hero.*8rem' styles/ components/ --include='*.css' --include='*.tsx'`

Fix any remaining references to old variable names.

- [ ] **Step 2: Update `index.html` meta**

Update the `<title>` and meta descriptions:
```html
<title>Trey Lupo — AI/ML Systems Engineer</title>
<meta name="description" content="Trey Lupo — AI/ML systems engineer. I build Python SDKs, AutoML frameworks in Rust, and production ML pipelines. Tampa, FL." />
```

Update OG tags to match. Update `jobTitle` in structured data to `"AI/ML Systems Engineer"`.

- [ ] **Step 3: Update reduced-motion media query**

Ensure the `@media (prefers-reduced-motion: reduce)` block at the bottom of `index.css` references the new class names (`.folio-entry`, `.hero-descriptor`, `.hero-cta-wrap`, etc.) instead of the old ones (`.fp-entry`, `.hero-hook`, `.hero-status`, etc.).

- [ ] **Step 4: Delete all unused CSS blocks**

Grep for any CSS selectors that reference deleted components: `.fp-`, `.work-item`, `.about-overlap`, `.footer-giant`, `.header-valiente`, etc. Remove them.

- [ ] **Step 5: Full build + typecheck**

Run: `cd rlupo-portfolio && npx tsc --noEmit && npm run build`
Expected: Clean build, no errors.

- [ ] **Step 6: Visual smoke test**

Run: `npm run dev`
Open http://localhost:3000 and verify:
- Hero centered, Space Grotesk name, single CTA in copper
- Nav horizontal, hides on scroll down, shows on scroll up
- Credential strip scrolling
- P/01 project list with slash grammar, cursor-follow preview working
- About section clean, no arcs, timeline folded in, copper skill tags
- Footer with closing statement, three-column links

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: polish pass — sweep stale references, update meta, verify build"
```

- [ ] **Step 8: Update DESIGN.md**

Copy `thoughts/DESIGN-precision-dark-candidate.md` to the root `DESIGN.md`, replacing the old Invisible Frame spec. Commit:

```bash
cp thoughts/DESIGN-precision-dark-candidate.md DESIGN.md
git add DESIGN.md
git commit -m "docs: update DESIGN.md to Precision Dark spec"
```

---

Plan complete and saved to `docs/superpowers/plans/2026-06-13-precision-dark-rebuild.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
