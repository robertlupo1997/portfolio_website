# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild treylupo.com from a generic card portfolio into a typography-driven narrative site with amber/blue accents, two-tier projects, timeline about, and award-site animations.

**Architecture:** Modify existing React 19 + Vite + TypeScript app in-place. Delete FluidGlass/WebGL, ScrollProgress, SectionPagination. Add new components for featured projects, manifesto footer, timeline, magnetic buttons, page loader. Update data model to support featured/non-featured projects with descriptions and tech stacks.

**Tech Stack:** React 19, Vite, TypeScript, GSAP + ScrollTrigger, Lenis, CSS custom properties

---

## File Map

**Delete:**
- `components/FluidGlass.tsx`
- `components/ScrollProgress.tsx`
- `components/SectionPagination.tsx`
- `components/ProjectCard.tsx` (replaced by FeaturedProject + WorkCard)
- `shaders/fluidglass/*` (entire directory)

**Create:**
- `components/PageLoader.tsx`
- `components/FeaturedProject.tsx`
- `components/WorkCard.tsx`
- `components/Timeline.tsx`
- `components/ManifestoFooter.tsx`
- `components/MagneticButton.tsx`
- `hooks/useNumberCounter.ts`
- `hooks/useMagneticEffect.ts`

**Modify:**
- `types.ts` — new Project fields
- `constants.ts` — new project data, categories, timeline data
- `App.tsx` — remove deleted components, add PageLoader
- `Header.tsx` — TREY LUPO wordmark, remove auto-collapse, add scrollspy
- `Hero.tsx` — hook copy, status line, CTAs, line reveal
- `ProjectsSection.tsx` — two-tier layout with FeaturedProject + WorkCard
- `ProjectFilter.tsx` — update categories
- `About.tsx` — timeline, grouped skills, remove services
- `Footer.tsx` — manifesto block, remove FluidGlass
- `styles/index.css` — amber accent, new component styles, remove old styles
- `vite.config.ts` — remove webgl chunk
- `package.json` — remove ogl dependency

---

### Task 1: Delete old files and dependencies

**Files:**
- Delete: `components/FluidGlass.tsx`, `components/ScrollProgress.tsx`, `components/SectionPagination.tsx`, `shaders/fluidglass/` (entire dir)
- Modify: `package.json`, `vite.config.ts`

- [ ] **Step 1: Delete FluidGlass, ScrollProgress, SectionPagination, and shaders**

```bash
rm rlupo-portfolio/components/FluidGlass.tsx
rm rlupo-portfolio/components/ScrollProgress.tsx
rm rlupo-portfolio/components/SectionPagination.tsx
rm -rf rlupo-portfolio/shaders
```

- [ ] **Step 2: Remove ogl dependency**

```bash
cd rlupo-portfolio && npm uninstall ogl
```

- [ ] **Step 3: Remove webgl chunk from vite.config.ts**

In `rlupo-portfolio/vite.config.ts`, replace the `manualChunks` block:

```typescript
manualChunks: {
  'vendor': ['react', 'react-dom'],
  'animation': ['gsap', 'lenis'],
}
```

(Remove the `'webgl': ['ogl']` line.)

- [ ] **Step 4: Verify build passes**

```bash
cd rlupo-portfolio && npm run build
```

Expected: Build will fail because App.tsx and Footer.tsx still import deleted components. That's expected — we fix imports in Task 2.

- [ ] **Step 5: Commit deletions**

```bash
git add -A
git commit -m "chore: delete FluidGlass, ScrollProgress, SectionPagination, ogl dependency"
```

---

### Task 2: Update CSS variables — teal to amber

**Files:**
- Modify: `styles/index.css:7-90` (variable block)

- [ ] **Step 1: Replace teal accent with amber in dark theme variables**

In `rlupo-portfolio/styles/index.css`, find and replace in the `:root` block:

Replace:
```css
--accent-teal: #00D4AA;
--accent-teal-hover: #00E8BB;
```
With:
```css
--accent-amber: #F0A500;
--accent-amber-hover: #FFB520;
--accent-amber-dim: rgba(240, 165, 0, 0.12);
```

Replace:
```css
--glow-teal: 0 0 30px rgba(0, 212, 170, 0.3);
```
With:
```css
--glow-amber: 0 0 30px rgba(240, 165, 0, 0.3);
```

Update `--bg-secondary` and `--bg-tertiary` to match spec:
```css
--bg-secondary: #111113;
--bg-tertiary: #18181B;
```

Update `--text-primary`:
```css
--text-primary: #E8E8EE;
```

- [ ] **Step 2: Replace teal with amber in light theme block**

In the `[data-theme="light"]` block, replace any `--accent-teal` references with:
```css
--accent-amber: #B87800;
--accent-amber-hover: #9A6500;
--accent-amber-dim: rgba(184, 120, 0, 0.12);
--glow-amber: 0 0 30px rgba(184, 120, 0, 0.3);
```

- [ ] **Step 3: Find and replace all `accent-teal` references in the entire CSS file**

Search the CSS for every `var(--accent-teal)` and replace with `var(--accent-amber)`. Search for `var(--glow-teal)` and replace with `var(--glow-amber)`.

Use `replace_all` to do this in one pass.

- [ ] **Step 4: Find and replace teal references in TSX components**

Search all `.tsx` files for `accent-teal` and replace with `accent-amber`. The main files are `About.tsx` (decorative SVG uses `var(--accent-teal)`).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "style: replace teal accent with amber throughout"
```

---

### Task 3: Update data model and project content

**Files:**
- Modify: `types.ts`, `constants.ts`

- [ ] **Step 1: Update Project type in types.ts**

Replace the entire contents of `rlupo-portfolio/types.ts` with:

```typescript
export type ProjectCategory = 'all' | 'ml' | 'engineering' | 'fpna';

export interface Project {
  id: string;
  title: string;
  category: string;
  projectCategory: ProjectCategory;
  description: string;
  githubUrl?: string;
  liveUrl?: string;
  epoch: string;
  metric: string;
  metricLabel: string;
  metricNumeric?: number;
  stack: string[];
  primaryStack: string[];
  featured: boolean;
  problem?: string;
}
```

- [ ] **Step 2: Replace constants.ts with new project data**

Replace the entire contents of `rlupo-portfolio/constants.ts` with:

```typescript
import { Project, ProjectCategory } from './types';

export const PERSONAL_INFO = {
  email: "treylupo1197@gmail.com",
  github: "https://github.com/robertlupo1997",
  linkedin: "https://www.linkedin.com/in/robertlupo1997/",
  huggingface: "https://huggingface.co/spaces/robertlupo1997",
};

export const PROJECT_CATEGORIES: { key: ProjectCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'ml', label: 'Machine Learning' },
  { key: 'engineering', label: 'Engineering' },
  { key: 'fpna', label: 'FP&A' },
];

export const FEATURED_PROJECTS: Project[] = [
  {
    id: "nspb-api",
    title: "nspb-api",
    category: "API ENGINEERING",
    projectCategory: "fpna",
    description: "A complete Python SDK for Oracle's Enterprise Performance Management Cloud, covering Planning, Migration, and Data Management APIs. Built solo at Franklin Street to automate FP&A workflows that previously required manual Oracle Smart View exports and vendor consultants.",
    problem: "Oracle EPM Cloud exposes no public API. I built one.",
    epoch: "MAR 2026",
    metric: "60+",
    metricLabel: "API ENDPOINTS",
    metricNumeric: 60,
    stack: ["Python", "REST", "Oracle EPM", "SDK Design"],
    primaryStack: ["Python", "Oracle EPM"],
    featured: true,
  },
  {
    id: "ferroml",
    title: "FerroML",
    category: "SYSTEMS / AUTOML",
    projectCategory: "engineering",
    description: "A statistically rigorous AutoML framework in Rust with Python bindings. Hypothesis-driven model selection with proper statistical testing, confidence intervals on every prediction, and 6,500+ tests. Published on PyPI.",
    problem: "AutoML tools skip statistical rigor. FerroML doesn't.",
    githubUrl: "https://github.com/robertlupo1997/ferroml",
    epoch: "APR 2026",
    metric: "55",
    metricLabel: "ML ALGORITHMS",
    metricNumeric: 55,
    stack: ["Rust", "Python", "PyPI", "Statistics"],
    primaryStack: ["Rust", "Python"],
    featured: true,
  },
  {
    id: "revenue-forecast",
    title: "Hierarchical Revenue Forecast",
    category: "TIME SERIES",
    projectCategory: "fpna",
    description: "Production-grade multi-LOB revenue forecasting with hierarchical time series models, SHAP explainability for every prediction, and a polyglot architecture spanning Python, Go, and TypeScript. Built for finance teams who need forecasts that add up.",
    problem: "Revenue forecasting across business lines that actually reconcile.",
    githubUrl: "https://github.com/robertlupo1997/hierarchical-revenue-forecast",
    epoch: "FEB 2026",
    metric: "Multi-LOB",
    metricLabel: "HIERARCHICAL RECONCILIATION",
    stack: ["Python", "Go", "TypeScript", "SHAP"],
    primaryStack: ["Python"],
    featured: true,
  },
];

export const ALL_PROJECTS: Project[] = [
  {
    id: "kkbox",
    title: "KKBOX Churn Prediction",
    category: "ML / PRODUCTION",
    projectCategory: "ml",
    description: "Leak-safe feature engineering, isotonic calibration, temporal backtests, and PSI drift monitoring.",
    githubUrl: "https://github.com/robertlupo1997/kkbox-churn-prediction",
    liveUrl: "https://huggingface.co/spaces/robertlupo1997/kkbox-churn-prediction",
    epoch: "AUG 2024",
    metric: "0.97 AUC",
    metricLabel: "AUC",
    stack: ["Python", "Streamlit", "XGBoost"],
    primaryStack: ["Python"],
    featured: false,
  },
  {
    id: "obj-detect",
    title: "Open-Vocab Object Detection",
    category: "COMPUTER VISION",
    projectCategory: "ml",
    description: "Text-prompted detection + segmentation with Grounding DINO + SAM 2 on RTX 3070.",
    githubUrl: "https://github.com/robertlupo1997/open-vocabulary-object-detection",
    epoch: "AUG 2024",
    metric: "265-490ms",
    metricLabel: "PER IMAGE",
    stack: ["Python", "PyTorch", "COCO"],
    primaryStack: ["Python"],
    featured: false,
  },
  {
    id: "ironclad",
    title: "Ironclad",
    category: "CONSTRUCTION ML",
    projectCategory: "ml",
    description: "Construction cost estimation with statistical confidence intervals for bid analysis.",
    githubUrl: "https://github.com/robertlupo1997/ironclad",
    epoch: "MAR 2026",
    metric: "95% CI",
    metricLabel: "CONFIDENCE",
    stack: ["Python", "ML", "Statistics"],
    primaryStack: ["Python"],
    featured: false,
  },
  {
    id: "ferroml-plugin",
    title: "FerroML Plugin",
    category: "AI TOOLING",
    projectCategory: "engineering",
    description: "End-to-end machine learning from natural conversation inside Claude Code.",
    githubUrl: "https://github.com/robertlupo1997/ferroml-plugin",
    epoch: "MAR 2026",
    metric: "Claude Code",
    metricLabel: "PLUGIN",
    stack: ["Python", "Plugin"],
    primaryStack: ["Python"],
    featured: false,
  },
  {
    id: "gsd-ml",
    title: "GSD-ML",
    category: "AI TOOLING",
    projectCategory: "engineering",
    description: "Claude Code native autonomous ML research — point at a dataset and get a tuned pipeline.",
    githubUrl: "https://github.com/robertlupo1997/gsd-ml",
    epoch: "MAR 2026",
    metric: "Autonomous",
    metricLabel: "ML RESEARCH",
    stack: ["Python", "GSD"],
    primaryStack: ["Python"],
    featured: false,
  },
  {
    id: "mlforge",
    title: "MLForge",
    category: "AUTOML",
    projectCategory: "engineering",
    description: "Autonomous ML research framework for tabular data. CSV + metric in, best pipeline out.",
    githubUrl: "https://github.com/robertlupo1997/mlforge",
    epoch: "MAR 2026",
    metric: "AutoML",
    metricLabel: "FRAMEWORK",
    stack: ["Python", "AutoML"],
    primaryStack: ["Python"],
    featured: false,
  },
];

export const TIMELINE = [
  {
    year: "2024",
    title: "B.A. Statistics, University of South Florida",
    sub: "MIT IDSS Data Science Certificate",
    current: false,
  },
  {
    year: "2025",
    title: "AI Engineering Intern, Origin Construction",
    sub: "APM automation · Procore integrations · AI agent pilots",
    current: false,
  },
  {
    year: "2025–NOW",
    title: "FP&A Analyst, Franklin Street",
    sub: "Built nspb-api SDK · FerroML in Rust · ML deal prediction · Oracle ETL pipeline",
    current: true,
  },
];

export const SKILL_GROUPS = [
  { label: "LANGUAGES", items: ["Python", "TypeScript", "SQL", "Rust"] },
  { label: "FINANCE", items: ["Oracle EPM Cloud", "FP&A", "Financial Modeling"] },
  { label: "ML / DATA", items: ["Scikit-learn", "LightGBM", "Pandas", "FastAPI"] },
  { label: "AI TOOLS", items: ["Claude Code", "Anthropic SDK"] },
  { label: "WEB", items: ["React", "GSAP", "Vite"] },
];

export const MANIFESTO_LINES = [
  "BUILT FOR REAL CONSTRAINTS.",
  "SHIPPED WITH CLAUDE.",
  "MEASURED IN DOLLARS SAVED.",
  "USED BY ACTUAL HUMANS.",
];
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd rlupo-portfolio && npx tsc --noEmit 2>&1 | head -20
```

Expected: Errors about components still importing old types. That's fine — we fix those in later tasks.

- [ ] **Step 4: Commit**

```bash
git add types.ts constants.ts
git commit -m "feat: update data model with featured projects, timeline, skills, manifesto"
```

---

### Task 4: Create new hooks

**Files:**
- Create: `hooks/useNumberCounter.ts`, `hooks/useMagneticEffect.ts`

- [ ] **Step 1: Create useNumberCounter hook**

Create `rlupo-portfolio/hooks/useNumberCounter.ts`:

```typescript
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useNumberCounter = (
  targetValue: number | undefined,
  duration: number = 2
) => {
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || targetValue === undefined || hasAnimated.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      el.textContent = String(targetValue);
      return;
    }

    const obj = { value: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        hasAnimated.current = true;
        gsap.to(obj, {
          value: targetValue,
          duration,
          ease: 'power1.out',
          onUpdate: () => {
            el.textContent = String(Math.round(obj.value));
          },
        });
      },
    });

    return () => {
      ScrollTrigger.getAll()
        .filter(t => t.trigger === el)
        .forEach(t => t.kill());
    };
  }, [targetValue, duration]);

  return ref;
};
```

- [ ] **Step 2: Create useMagneticEffect hook**

Create `rlupo-portfolio/hooks/useMagneticEffect.ts`:

```typescript
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const useMagneticEffect = (strength: number = 0.3) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * strength, y: y * strength, duration: 0.3, ease: 'power2.out' });
    };

    const handleMouseLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return ref;
};
```

- [ ] **Step 3: Commit**

```bash
git add hooks/useNumberCounter.ts hooks/useMagneticEffect.ts
git commit -m "feat: add useNumberCounter and useMagneticEffect hooks"
```

---

### Task 5: Create new components — PageLoader, MagneticButton, Timeline, FeaturedProject, WorkCard, ManifestoFooter

**Files:**
- Create: `components/PageLoader.tsx`, `components/MagneticButton.tsx`, `components/Timeline.tsx`, `components/FeaturedProject.tsx`, `components/WorkCard.tsx`, `components/ManifestoFooter.tsx`

- [ ] **Step 1: Create PageLoader**

Create `rlupo-portfolio/components/PageLoader.tsx`:

```tsx
import React, { useEffect, useState } from 'react';

const PageLoader: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsLoading(false);
      return;
    }
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return <div className="page-loader" />;
};

export default PageLoader;
```

- [ ] **Step 2: Create MagneticButton**

Create `rlupo-portfolio/components/MagneticButton.tsx`:

```tsx
import React from 'react';
import { useMagneticEffect } from '../hooks/useMagneticEffect';

interface MagneticButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  onClick?: () => void;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({
  href, children, className = '', external = false, onClick,
}) => {
  const ref = useMagneticEffect(0.3);

  return (
    <a
      ref={ref as React.RefObject<HTMLAnchorElement>}
      href={href}
      className={className}
      onClick={onClick}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  );
};

export default MagneticButton;
```

- [ ] **Step 3: Create Timeline**

Create `rlupo-portfolio/components/Timeline.tsx`:

```tsx
import React from 'react';
import { TIMELINE } from '../constants';

const Timeline: React.FC = () => (
  <div className="timeline">
    {TIMELINE.map((entry) => (
      <div key={entry.year} className={`tl-entry ${entry.current ? 'current' : ''}`}>
        <div className="tl-year">{entry.year}</div>
        <div className="tl-title">{entry.title}</div>
        {entry.sub && <div className="tl-sub">{entry.sub}</div>}
      </div>
    ))}
  </div>
);

export default Timeline;
```

- [ ] **Step 4: Create FeaturedProject**

Create `rlupo-portfolio/components/FeaturedProject.tsx`:

```tsx
import React from 'react';
import { Project } from '../types';
import { useNumberCounter } from '../hooks/useNumberCounter';

interface FeaturedProjectProps {
  project: Project;
  index: number;
}

const FeaturedProject: React.FC<FeaturedProjectProps> = ({ project, index }) => {
  const counterRef = useNumberCounter(project.metricNumeric);
  const number = String(index + 1).padStart(2, '0');

  return (
    <article className="featured-project">
      <div className="fp-left">
        <div className="fp-number">{number}</div>
        <h2 className="fp-title">{project.title}</h2>
        {project.problem && (
          <p className="fp-problem">&ldquo;{project.problem}&rdquo;</p>
        )}
        <p className="fp-description">{project.description}</p>
        <div className="fp-stack">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className={`fp-pill ${project.primaryStack.includes(tech) ? 'amber' : ''}`}
            >
              {tech}
            </span>
          ))}
        </div>
        {project.githubUrl ? (
          <a href={project.githubUrl} className="fp-link" target="_blank" rel="noopener noreferrer">
            View on GitHub &rarr;
          </a>
        ) : (
          <span className="fp-link private">Private repo &mdash; enterprise tooling</span>
        )}
      </div>
      <div className="fp-right">
        <div className="fp-metric">
          {project.metricNumeric !== undefined ? (
            <><span ref={counterRef}>0</span>+</>
          ) : (
            project.metric
          )}
        </div>
        <div className="fp-metric-label">{project.metricLabel}</div>
      </div>
    </article>
  );
};

export default FeaturedProject;
```

- [ ] **Step 5: Create WorkCard**

Create `rlupo-portfolio/components/WorkCard.tsx`:

```tsx
import React from 'react';
import { Project } from '../types';

interface WorkCardProps {
  project: Project;
}

const WorkCard: React.FC<WorkCardProps> = ({ project }) => (
  <div className="work-card">
    <div className="wc-header">
      <span className="wc-title">{project.title}</span>
      <span className="wc-metric">{project.metric}</span>
    </div>
    <p className="wc-desc">{project.description}</p>
    <div className="wc-footer">
      <div className="wc-stack">
        {project.stack.map((tech, i) => (
          <React.Fragment key={tech}>
            {i > 0 && <span className="wc-stack-sep">&middot;</span>}
            <span className="wc-stack-tag">{tech}</span>
          </React.Fragment>
        ))}
      </div>
      {project.githubUrl && (
        <a href={project.githubUrl} className="wc-link" target="_blank" rel="noopener noreferrer">
          GitHub &rarr;
        </a>
      )}
    </div>
  </div>
);

export default WorkCard;
```

- [ ] **Step 6: Create ManifestoFooter**

Create `rlupo-portfolio/components/ManifestoFooter.tsx`:

```tsx
import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PERSONAL_INFO, MANIFESTO_LINES } from '../constants';

gsap.registerPlugin(ScrollTrigger);

const ManifestoFooter: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const manifestoRef = useRef<HTMLDivElement>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const el = manifestoRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lines = el.querySelectorAll('.manifesto-line');
    gsap.fromTo(lines,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.15,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      }
    );

    return () => {
      ScrollTrigger.getAll().filter(t => t.trigger === el).forEach(t => t.kill());
    };
  }, []);

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
      <div className="manifesto" ref={manifestoRef}>
        {MANIFESTO_LINES.map((line) => (
          <div key={line} className="manifesto-line">{line}</div>
        ))}
      </div>

      <div className="footer-top">
        <div className="footer-message">
          Available for AI/ML roles and FP&A automation consulting.
        </div>
        <div className="footer-links">
          <a href={PERSONAL_INFO.github} className="footer-link" target="_blank" rel="noopener noreferrer">GITHUB</a>
          <a href={PERSONAL_INFO.linkedin} className="footer-link" target="_blank" rel="noopener noreferrer">LINKEDIN</a>
          <a href={PERSONAL_INFO.huggingface} className="footer-link" target="_blank" rel="noopener noreferrer">HUGGING FACE</a>
        </div>
      </div>

      <div className="footer-bottom">
        <button className="footer-email" onClick={handleEmailClick} type="button" title={copied ? 'Copied!' : 'Click to copy email'}>
          {copied ? 'Copied!' : PERSONAL_INFO.email}
        </button>
        <span className="footer-copy">&copy; {currentYear} Trey Lupo</span>
      </div>
    </footer>
  );
};

export default ManifestoFooter;
```

- [ ] **Step 7: Commit all new components**

```bash
git add components/PageLoader.tsx components/MagneticButton.tsx components/Timeline.tsx components/FeaturedProject.tsx components/WorkCard.tsx components/ManifestoFooter.tsx
git commit -m "feat: add PageLoader, MagneticButton, Timeline, FeaturedProject, WorkCard, ManifestoFooter"
```

---

### Task 6: Rewrite Hero

**Files:**
- Modify: `components/Hero.tsx`

- [ ] **Step 1: Replace Hero.tsx entirely**

Replace the contents of `rlupo-portfolio/components/Hero.tsx` with:

```tsx
import React, { useEffect, useState } from 'react';
import TextScramble from './TextScramble';
import MagneticButton from './MagneticButton';
import { PERSONAL_INFO } from '../constants';

const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 850);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero" id="hero">
      <div className="hero-name-ghost">TREY LUPO</div>

      <div className={`hero-content ${isLoaded ? 'loaded' : ''}`}>
        <div className="hero-hook">
          <span className="accent-amber">FP&A Analyst.</span>
          <br />
          Builds production tools
          <br />
          with <span className="accent-blue">AI</span>.
        </div>

        <div className="hero-name-inline">
          <TextScramble text="TREY LUPO" triggerOnView={false} triggerOnHover={true} duration={800} delay={300} />
        </div>

        <div className="hero-status">
          <span className="status-dot" />
          Currently: Building nspb-api &middot; Open to AI/ML roles &middot; Tampa / Remote
        </div>

        <div className="hero-ctas">
          <MagneticButton href="#projects" className="btn-primary">
            SEE THE WORK
          </MagneticButton>
          <MagneticButton href={PERSONAL_INFO.github} className="btn-outline" external>
            GITHUB &rarr;
          </MagneticButton>
        </div>
      </div>
    </section>
  );
};

export default Hero;
```

- [ ] **Step 2: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat: rewrite Hero with hook copy, status line, magnetic CTAs"
```

---

### Task 7: Rewrite Header — TREY LUPO wordmark, remove auto-collapse, add scrollspy

**Files:**
- Modify: `components/Header.tsx`

- [ ] **Step 1: Replace Header.tsx entirely**

Replace the contents of `rlupo-portfolio/components/Header.tsx` with:

```tsx
import React, { useEffect, useState, useRef } from 'react';
import { PERSONAL_INFO } from '../constants';
import ThemeToggle from './ThemeToggle';
import MagneticButton from './MagneticButton';

const NAV_ITEMS = [
  { href: '#projects', text: 'PROJECTS' },
  { href: '#about', text: 'ABOUT' },
  { href: '#', text: 'BLOG', external: true },
];

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -60% 0px' }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el && (window as any).lenis) {
        (window as any).lenis.scrollTo(el);
      }
    }
  };

  const scrollToTop = () => {
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className={`nav ${isScrolled ? 'scrolled' : ''}`}>
        <nav className="nav-left">
          {NAV_ITEMS.map(({ href, text, external }) => (
            <a
              key={text}
              href={href}
              className={`nav-link ${activeSection === href.slice(1) ? 'active' : ''}`}
              onClick={(e) => {
                if (!external) { e.preventDefault(); handleNavClick(href); }
              }}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {text}{external && <span className="external-indicator"> &#8599;</span>}
            </a>
          ))}
        </nav>

        <button className="nav-center" onClick={scrollToTop} type="button">
          TREY LUPO
        </button>

        <div className="nav-right">
          <MagneticButton
            href={`mailto:${PERSONAL_INFO.email}`}
            className="nav-cta"
          >
            GET IN TOUCH
          </MagneticButton>
          <ThemeToggle />
        </div>

        <button
          className={`hamburger-mobile ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </header>

      <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          {NAV_ITEMS.map(({ href, text }) => (
            <a key={text} href={href} onClick={() => handleNavClick(href)}>{text}</a>
          ))}
          <a href={`mailto:${PERSONAL_INFO.email}`} onClick={() => setIsMobileMenuOpen(false)}>CONTACT</a>
        </nav>
      </div>
    </>
  );
};

export default Header;
```

- [ ] **Step 2: Commit**

```bash
git add components/Header.tsx
git commit -m "feat: rewrite Header with TREY LUPO wordmark, scrollspy, remove auto-collapse"
```

---

### Task 8: Rewrite ProjectsSection — two-tier layout

**Files:**
- Modify: `components/ProjectsSection.tsx`
- Delete: `components/ProjectCard.tsx`

- [ ] **Step 1: Delete ProjectCard.tsx**

```bash
rm rlupo-portfolio/components/ProjectCard.tsx
```

- [ ] **Step 2: Replace ProjectsSection.tsx**

Replace the contents of `rlupo-portfolio/components/ProjectsSection.tsx` with:

```tsx
import React, { useRef, useEffect, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FeaturedProject from './FeaturedProject';
import WorkCard from './WorkCard';
import ProjectFilter from './ProjectFilter';
import TextScramble from './TextScramble';
import { FEATURED_PROJECTS, ALL_PROJECTS } from '../constants';
import { ProjectCategory } from '../types';

gsap.registerPlugin(ScrollTrigger);

const ProjectsSection: React.FC = () => {
  const allWorkRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>('all');

  const allProjects = useMemo(() => [...FEATURED_PROJECTS, ...ALL_PROJECTS], []);
  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return ALL_PROJECTS;
    return ALL_PROJECTS.filter(p => p.projectCategory === activeFilter);
  }, [activeFilter]);

  const counts = useMemo(() => ({
    all: ALL_PROJECTS.length,
    ml: ALL_PROJECTS.filter(p => p.projectCategory === 'ml').length,
    engineering: ALL_PROJECTS.filter(p => p.projectCategory === 'engineering').length,
    fpna: ALL_PROJECTS.filter(p => p.projectCategory === 'fpna').length,
  }), []);

  useEffect(() => {
    const el = allWorkRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const cards = el.querySelectorAll('.work-card');
    gsap.fromTo(cards,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      }
    );

    return () => {
      ScrollTrigger.getAll().filter(t => t.trigger === el).forEach(t => t.kill());
    };
  }, [activeFilter]);

  return (
    <>
      <section className="section" id="projects">
        <div className="section-label">
          <TextScramble text="FEATURED WORK" triggerOnView={true} triggerOnHover={true} duration={1000} />
        </div>
        {FEATURED_PROJECTS.map((project, index) => (
          <FeaturedProject key={project.id} project={project} index={index} />
        ))}
      </section>

      <section className="section">
        <div className="section-label">
          <TextScramble text="ALL WORK" triggerOnView={true} triggerOnHover={true} duration={1000} />
        </div>
        <ProjectFilter activeFilter={activeFilter} onFilterChange={setActiveFilter} counts={counts} />
        <div className="work-grid" ref={allWorkRef} id="projects-grid" role="tabpanel">
          {filteredProjects.length === 0 ? (
            <p className="projects-empty-state">No projects in this category yet.</p>
          ) : (
            filteredProjects.map((project) => (
              <WorkCard key={project.id} project={project} />
            ))
          )}
        </div>
      </section>
    </>
  );
};

export default ProjectsSection;
```

- [ ] **Step 3: Update ProjectFilter counts type**

In `rlupo-portfolio/components/ProjectFilter.tsx`, the `counts` prop type uses `Record<ProjectCategory, number>`. Since we changed `ProjectCategory` to include `'engineering'` instead of `'analytics'`, the component will work as-is because it maps over `PROJECT_CATEGORIES` from constants. No changes needed.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: two-tier projects — FeaturedProject panels + WorkCard grid"
```

---

### Task 9: Rewrite About — timeline, skills groups, remove services

**Files:**
- Modify: `components/About.tsx`

- [ ] **Step 1: Replace About.tsx**

Replace the contents of `rlupo-portfolio/components/About.tsx` with:

```tsx
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextScramble from './TextScramble';
import Timeline from './Timeline';
import { SKILL_GROUPS } from '../constants';

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const elements = section.querySelectorAll('.tl-entry, .skill-group, .about-statement');
    gsap.fromTo(elements,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.1,
        scrollTrigger: { trigger: section, start: 'top 70%', once: true },
      }
    );

    return () => {
      ScrollTrigger.getAll().filter(t => t.trigger === section).forEach(t => t.kill());
    };
  }, []);

  return (
    <section className="section" id="about" ref={sectionRef}>
      <div className="section-label">
        <TextScramble text="ABOUT" triggerOnView={true} triggerOnHover={true} duration={1000} />
      </div>

      <div className="about-statement">
        I make <span className="amber">financial data</span> useful.
      </div>

      <Timeline />

      <div className="skills-section">
        {SKILL_GROUPS.map((group) => (
          <div key={group.label} className="skill-group">
            <div className="sg-label">{group.label}</div>
            <div className="sg-items">
              {group.items.map((item) => (
                <span key={item} className="sg-tag">{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default About;
```

- [ ] **Step 2: Commit**

```bash
git add components/About.tsx
git commit -m "feat: rewrite About with timeline, grouped skills, remove service cards"
```

---

### Task 10: Rewrite Footer and App.tsx

**Files:**
- Modify: `components/Footer.tsx`, `App.tsx`

- [ ] **Step 1: Replace Footer.tsx with ManifestoFooter import**

Replace the contents of `rlupo-portfolio/components/Footer.tsx` with:

```tsx
export { default } from './ManifestoFooter';
```

This re-exports ManifestoFooter as the default Footer so App.tsx doesn't need import changes for the Footer.

- [ ] **Step 2: Update App.tsx**

Replace the contents of `rlupo-portfolio/App.tsx` with:

```tsx
import React from 'react';
import CustomCursor from './components/CustomCursor';
import PageLoader from './components/PageLoader';
import Header from './components/Header';
import Hero from './components/Hero';
import ProjectsSection from './components/ProjectsSection';
import About from './components/About';
import Footer from './components/Footer';
import { useLenis } from './hooks/useLenis';
import { useScrollAnimations } from './hooks/useScrollAnimations';
import './styles/index.css';

const App: React.FC = () => {
  useLenis();
  useScrollAnimations();

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <PageLoader />
      <CustomCursor />
      <Header />

      <main id="main-content" className="main">
        <Hero />
        <ProjectsSection />
        <About />
        <Footer />
      </main>
    </>
  );
};

export default App;
```

- [ ] **Step 3: Commit**

```bash
git add App.tsx components/Footer.tsx
git commit -m "feat: update App with PageLoader, remove ScrollProgress/SectionPagination"
```

---

### Task 11: Update CSS — new component styles

**Files:**
- Modify: `styles/index.css`

This is the largest task. The CSS needs new styles for all new components plus the page loader, and old styles for deleted components should be removed.

- [ ] **Step 1: Add the new component styles to the end of index.css**

Append these styles to the end of `rlupo-portfolio/styles/index.css`. The styles match the mockup at `thoughts/mockup.html` — refer to that file for the complete CSS blocks for:

- `.page-loader` (CSS-only sweep animation)
- `.nav`, `.nav-left`, `.nav-center`, `.nav-right`, `.nav-link`, `.nav-cta` (new nav styles)
- `.hero`, `.hero-hook`, `.hero-name-ghost`, `.hero-name-inline`, `.hero-status`, `.status-dot`, `.hero-ctas`, `.btn-primary`, `.btn-outline`, `.accent-amber`, `.accent-blue` (new hero styles)
- `.section`, `.section-label` (section container styles)
- `.featured-project`, `.fp-left`, `.fp-right`, `.fp-number`, `.fp-title`, `.fp-problem`, `.fp-description`, `.fp-stack`, `.fp-pill`, `.fp-link`, `.fp-metric`, `.fp-metric-label` (featured project panel)
- `.work-grid`, `.work-card`, `.wc-header`, `.wc-title`, `.wc-metric`, `.wc-desc`, `.wc-footer`, `.wc-stack`, `.wc-stack-tag`, `.wc-stack-sep`, `.wc-link` (all work grid)
- `.about-statement`, `.amber` (about heading)
- `.timeline`, `.tl-entry`, `.tl-year`, `.tl-title`, `.tl-sub` (timeline)
- `.skills-section`, `.skill-group`, `.sg-label`, `.sg-items`, `.sg-tag` (skills grid)
- `.manifesto`, `.manifesto-line` (manifesto block)
- `.footer`, `.footer-top`, `.footer-message`, `.footer-links`, `.footer-link`, `.footer-bottom`, `.footer-email`, `.footer-copy` (footer)

Copy all styles from the `<style>` block in `thoughts/mockup.html` starting from `/* ============ NAV ============ */` through the end. The CSS variables are already handled in Task 2.

- [ ] **Step 2: Remove old component CSS blocks**

Search and remove CSS blocks for:
- `.header-valiente` and related (replaced by `.nav`)
- `.projects-scattered`, `.projects-grid-scattered`, `.project-card-wrapper-*` (replaced by `.featured-project` + `.work-grid`)
- `.project-card`, `.project-card-image`, `.project-card-overlay`, `.project-overlay` (deleted)
- `.about-overlap`, `.about-decorative`, `.services-overlap`, `.service-card-overlap` (replaced)
- `.footer-giant`, `.footer-giant-name` (replaced)
- `.scroll-progress` (deleted)
- `.section-pagination` (deleted)

- [ ] **Step 3: Add page loader CSS**

Add at the top of the component styles section:

```css
/* ============ PAGE LOADER ============ */
.page-loader {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: var(--bg-primary);
  animation: loader-sweep 0.8s cubic-bezier(0.65, 0, 0.35, 1) 0.1s forwards;
}

@keyframes loader-sweep {
  to { transform: translateY(-100%); }
}

@media (prefers-reduced-motion: reduce) {
  .page-loader { display: none; }
}
```

- [ ] **Step 4: Verify build passes**

```bash
cd rlupo-portfolio && npm run build
```

Expected: Clean build with no errors.

- [ ] **Step 5: Commit**

```bash
git add styles/index.css
git commit -m "style: add all new component styles, remove old layout CSS"
```

---

### Task 12: Final verification and cleanup

**Files:**
- Possibly modify: various files for TypeScript errors

- [ ] **Step 1: Build**

```bash
cd rlupo-portfolio && npm run build
```

Expected: Clean build.

- [ ] **Step 2: Start dev server and visually verify**

```bash
cd rlupo-portfolio && node node_modules/.bin/vite --host 0.0.0.0 --port 3000 &
```

Open `\\wsl$\Ubuntu\home\tlupo\projects\portfolio_website\rlupo-portfolio\dist\index.html` or `http://localhost:3000` and verify:

- Page loader sweeps off on load
- Hero shows hook copy with amber "FP&A Analyst." and blue "AI"
- Name shows text scramble on hover
- Status dot pulses amber
- Magnetic effect on CTA buttons
- Featured Work section shows 3 project panels with number counters
- All Work section shows 6 cards with filter tabs
- FP&A filter returns 0 cards with empty state message (featured projects are in separate section)
- About shows timeline with amber current dot and grouped skills
- Footer shows manifesto with scroll reveal
- Theme toggle works (amber colors adapt)
- Mobile responsive

- [ ] **Step 3: Fix any issues found**

Address any visual or TypeScript issues discovered during verification.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: portfolio redesign complete — typography-driven with amber/blue accents"
```

---

## Task Summary

| Task | Description | Key Files |
|------|-------------|-----------|
| 1 | Delete old files + ogl dependency | FluidGlass, ScrollProgress, SectionPagination, shaders/ |
| 2 | CSS variables: teal → amber | styles/index.css |
| 3 | Data model + content update | types.ts, constants.ts |
| 4 | New hooks | useNumberCounter.ts, useMagneticEffect.ts |
| 5 | New components (6) | PageLoader, MagneticButton, Timeline, FeaturedProject, WorkCard, ManifestoFooter |
| 6 | Rewrite Hero | Hero.tsx |
| 7 | Rewrite Header | Header.tsx |
| 8 | Rewrite ProjectsSection | ProjectsSection.tsx, delete ProjectCard.tsx |
| 9 | Rewrite About | About.tsx |
| 10 | Rewrite Footer + App.tsx | Footer.tsx, App.tsx |
| 11 | CSS: new styles + remove old | styles/index.css |
| 12 | Final verification | All files |
