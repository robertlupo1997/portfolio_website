# Portfolio Content Update — Implementation Plan

## Overview
Replace the 6 academic projects currently on treylupo.com with Trey's real, production-quality work. Update project data, categories, imagery, and about section to accurately represent an FP&A analyst / AI engineer building enterprise automation tools.

## Current State
The portfolio (in `rlupo-portfolio/constants.ts`) showcases:
1. KKBOX Churn Prediction — decent, keep
2. Open-Vocab Object Detection — keep
3. Amazon Recommendations — academic exercise, remove
4. FoodHub Analysis — academic exercise, remove
5. Shinkansen Travel — academic exercise, remove
6. Life Expectancy Prediction — academic exercise, remove

## Desired End State
Portfolio showcases 6-8 projects that demonstrate:
- Enterprise SDK development (nspb-api)
- Systems programming (ferroml — Rust + Python)
- Domain-specific ML (ironclad, hierarchical-revenue-forecast)
- Production ML with proper methodology (kkbox)
- Computer vision (object detection)
- AI tooling (Claude Code plugins)

## What We're NOT Doing
- Redesigning the visual layout (separate plan after impeccable audit)
- Adding new sections or pages
- Changing the tech stack
- Setting up subdomains

---

## Phase 1: Update Project Data

### Overview
Replace project entries in `constants.ts` with real work.

### Changes Required:

**File**: `rlupo-portfolio/constants.ts`

Replace the PROJECTS array with:

```typescript
export const PROJECT_CATEGORIES: { key: ProjectCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'ml', label: 'Machine Learning' },
  { key: 'engineering', label: 'Engineering' },
  { key: 'fpna', label: 'FP&A / Finance' },
];

export const PROJECTS: Project[] = [
  {
    id: "nspb-api",
    title: "ORACLE EPM SDK",
    category: "API ENGINEERING",
    projectCategory: "fpna",
    githubUrl: "https://github.com/robertlupo1997/nspb-api",
    epoch: "MAR 2026",
    metric: "60+ Endpoints",
    cardColor: "coral",
    imageUrl: "/assets/nspb-api.jpg"
  },
  {
    id: "ferroml",
    title: "FERROML",
    category: "SYSTEMS / AUTOML",
    projectCategory: "engineering",
    githubUrl: "https://github.com/robertlupo1997/ferroml",
    epoch: "APR 2026",
    metric: "Rust + Python",
    cardColor: "cyan",
    imageUrl: "/assets/ferroml.jpg"
  },
  {
    id: "ironclad",
    title: "IRONCLAD",
    category: "CONSTRUCTION ML",
    projectCategory: "ml",
    githubUrl: "https://github.com/robertlupo1997/ironclad",
    epoch: "MAR 2026",
    metric: "95% CI Bounds",
    cardColor: "green",
    imageUrl: "/assets/ironclad.jpg"
  },
  {
    id: "revenue-forecast",
    title: "HIERARCHICAL REVENUE FORECAST",
    category: "TIME SERIES",
    projectCategory: "fpna",
    githubUrl: "https://github.com/robertlupo1997/hierarchical-revenue-forecast",
    epoch: "FEB 2026",
    metric: "Multi-LOB",
    cardColor: "yellow",
    imageUrl: "/assets/revenue-forecast.jpg"
  },
  {
    id: "kkbox",
    title: "KKBOX CHURN PREDICTION",
    category: "ML / PRODUCTION",
    projectCategory: "ml",
    githubUrl: "https://github.com/robertlupo1997/kkbox-churn-prediction",
    liveUrl: "https://huggingface.co/spaces/robertlupo1997/kkbox-churn-prediction",
    epoch: "AUG 2024",
    metric: "0.97 AUC",
    cardColor: "light-cyan",
    imageUrl: "/assets/kkbox-churn.jpg"
  },
  {
    id: "obj-detect",
    title: "OPEN-VOCAB OBJECT DETECTION",
    category: "COMPUTER VISION",
    projectCategory: "ml",
    githubUrl: "https://github.com/robertlupo1997/open-vocabulary-object-detection",
    epoch: "AUG 2024",
    metric: "265-490ms/img",
    cardColor: "coral",
    imageUrl: "/assets/objdetect-matrix.jpg"
  },
];
```

**File**: `rlupo-portfolio/types.ts`

Update ProjectCategory to include 'engineering':
```typescript
export type ProjectCategory = 'all' | 'ml' | 'engineering' | 'fpna';
```

### Success Criteria:

#### Automated Verification:
- [ ] TypeScript compiles: `cd rlupo-portfolio && npx tsc --noEmit`
- [ ] Build succeeds: `npm run build`
- [ ] No type errors in constants.ts

#### Manual Verification:
- [ ] Dev server shows updated project cards
- [ ] Filter buttons work with new categories
- [ ] Project links point to correct GitHub repos

**Pause for confirmation before Phase 2.**

---

## Phase 2: Update About Section

### Overview
Update the About component to reflect current role and focus.

### Changes Required:

**File**: `rlupo-portfolio/components/About.tsx`

Update bio content to reflect:
- FP&A analyst at Franklin Street
- Building AI-native EPM automation (first of its kind)
- Statistics degree → ML/AI engineering
- Built production SDK for Oracle EPM Cloud solo
- Focus: enterprise automation, not academic exercises

### Success Criteria:

#### Automated Verification:
- [ ] Build succeeds after changes

#### Manual Verification:
- [ ] About section reads naturally
- [ ] Accurately represents skills and focus
- [ ] No broken layout

**Pause for confirmation before Phase 3.**

---

## Phase 3: Create Project Assets

### Overview
Generate or source hero images/thumbnails for the new projects.

### Changes Required:

**Directory**: `rlupo-portfolio/public/assets/`

Need images for:
- `nspb-api.jpg` — Oracle EPM / API architecture visual
- `ferroml.jpg` — Rust/systems programming visual
- `ironclad.jpg` — Construction / estimation visual
- `revenue-forecast.jpg` — Time series / financial chart visual

Options:
1. Generate with AI image tools
2. Use screenshots of the actual projects (CLI output, dashboards, architecture diagrams)
3. Use abstract/geometric placeholders that match the card color scheme

### Success Criteria:

#### Automated Verification:
- [ ] All referenced images exist in public/assets/
- [ ] Build succeeds with new images
- [ ] Images are reasonable size (<500KB each)

#### Manual Verification:
- [ ] Images look professional and match project theme
- [ ] No pixelation or quality issues
- [ ] Cards look cohesive as a set

**Pause for confirmation before Phase 4.**

---

## Phase 4: Update Hero Section

### Overview
Update the hero tagline to reflect current focus beyond "FP&A Analyst & Data Scientist."

### Changes Required:

**File**: `rlupo-portfolio/components/Hero.tsx`

Consider updating to something like:
- "FP&A Analyst & AI Engineer"
- "Building AI-native enterprise automation"
- Keep it concise — the hero shouldn't oversell

### Success Criteria:

#### Automated Verification:
- [ ] Build succeeds

#### Manual Verification:
- [ ] Hero text is accurate and compelling
- [ ] Text scramble animation still works
- [ ] Layout not broken on mobile

---

## Testing Strategy

### Before deploying:
1. `npm run build` — verify production build
2. `npm run preview` — test production build locally
3. Test all filter buttons
4. Test all project card links
5. Test on mobile viewport
6. Test dark/light theme toggle
7. Verify GSAP animations still fire correctly

## References
- Current constants: `rlupo-portfolio/constants.ts`
- Current types: `rlupo-portfolio/types.ts`
- Project components: `rlupo-portfolio/components/ProjectCard.tsx`, `ProjectsSection.tsx`
- About: `rlupo-portfolio/components/About.tsx`
- Hero: `rlupo-portfolio/components/Hero.tsx`
