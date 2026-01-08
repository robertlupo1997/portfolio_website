# CHRLS.DESIGN Portfolio Recreation - Complete Implementation Plan

## Overview

This plan documents the complete workflow for recreating a portfolio website inspired by chrls.design, adapted for a Machine Learning / Data Science professional (Trey Lupo). The process involves analyzing the inspiration site, evaluating existing sample implementations, identifying reusable components, and building a production-ready portfolio.

---

## Current State Analysis

### Inspiration Site: chrls.design

**Key Characteristics Identified:**
- 8 distinct sections (Header, Hero, Status Bar, Project Grid, Marquee, Illustration, About, Footer)
- "Ticket/Receipt" design metaphor throughout
- Strict color palette: Orange (#FF6B00), Black (#000000), Off-White (#F5F5F0)
- Typography: PP Neue Montreal (display) + PP NeueBit (metadata/pixel)
- Industrial aesthetic with barcodes, QR codes, "EXPIRED DATE" framing
- Subtle animations: marquee scroll, hover lifts, staggered fade-ins

### Sample Sites Available

| URL | Name | Status |
|-----|------|--------|
| localhost:3001 | rlupo-portfolio | Running (Vite) |
| localhost:3002 | rlupo-portfolio-v2 | Running (Vite) |
| localhost:3004 | copy-of-app | Running (Vite) |
| localhost:3005 | chrls-portfolio | Running (Vite) - Direct clone attempt |
| localhost:3006 | rlupo-portfolio-yves-klein | Running (Vite) |

### Research Completed

1. **CHRLS_DSGN_Complete_Analysis.md** - 1,230 lines of detailed specs including:
   - Color system with hex values and usage rules
   - Typography hierarchy with exact sizes/weights
   - Spacing scale (8px base)
   - Animation specifications (CSS + GIFs)
   - Component library (Project Card, Info Box, Status Bar, Marquee)
   - ML/AI adaptation blueprint

2. **Browser Analysis Session 1** - Haiku agent scrolled entire chrls.design:
   - Confirmed 8 sections
   - Documented 13 projects visible
   - Identified ticket color palette (orange, cyan, lime, yellow, pink)
   - Noted marquee animation and illustration section

3. **Browser Prompt System** - KERNEL-style prompt created for systematic analysis

---

## Desired End State

A production-ready portfolio website that:

1. **Matches CHRLS aesthetic** (80%+ visual similarity)
2. **Adapts for ML/Data Science** context
3. **Includes all key components:**
   - Giant hero text (TREY.ML or LUPO.DATA)
   - Orange info box with tech specs (model card style)
   - Status bar with skills/availability
   - Project cards with "TRAINED" dates instead of "EXPIRED DATE"
   - Marquee ("MACHINE LEARNING PROJECTS")
   - Dark about section with credentials
   - Footer with social links

4. **Implements animations:**
   - Marquee infinite scroll
   - Card hover lift effects
   - Page load stagger
   - Link underline reveals

5. **Passes quality checks:**
   - Lighthouse 90+ all categories
   - WCAG 2.2 AA accessibility
   - 60fps scroll performance
   - Mobile responsive (320px-1440px+)

### Verification Criteria

```bash
# Automated
npm run build          # No errors
npm run lint           # No warnings
npm run typecheck      # TypeScript passes
npx lighthouse http://localhost:3000 --output=json  # Score 90+

# Manual
- [ ] Hero text matches CHRLS scale (180px desktop)
- [ ] Orange accent used sparingly (~15% visual weight)
- [ ] Project cards have ticket styling
- [ ] Marquee scrolls smoothly
- [ ] Hover effects work on all interactive elements
- [ ] Footer matches dark theme
```

---

## What We're NOT Doing

- Building a blog section
- Adding a CMS or admin panel
- Implementing authentication
- Creating an archive/project detail pages (v1 is single-page)
- Adding 3D/WebGL elements (keeping it 2D like CHRLS)
- Dark mode toggle (fixed light theme like CHRLS)

---

## Implementation Approach

### Strategy: Component-First Development

1. **Audit existing samples** to identify reusable components
2. **Build missing components** from CHRLS spec
3. **Assemble into single-page layout**
4. **Add animations last** (after static layout works)
5. **Polish and optimize**

### Tech Stack (Already in samples)

- React 18/19 + TypeScript
- Vite (dev server + build)
- Tailwind CSS
- Framer Motion (animations)

---

## Phase 1: Sample Site Evaluation

### Overview
Complete the browser analysis to grade all 5 sample sites against chrls.design and identify reusable components.

### Tasks

#### 1.1 Resume Browser Analysis Session 2
**Tool:** Haiku 4.5 Browser Agent

**Prompt to use:**
```
Continue the CHRLS.DESIGN analysis from Session 1.

COMPLETED:
- Full scroll-through of chrls.design ✓
- 8 sections documented ✓
- Color scheme: Orange #FF6D00, Black, White, Neon accents ✓
- Typography: Bold sans-serif headers, mono metadata ✓
- Ticket/receipt metaphor identified ✓

REMAINING TASKS:
For EACH of these 5 sites, do a quick audit:
1. http://localhost:3001 (rlupo-portfolio)
2. http://localhost:3002 (rlupo-portfolio-v2)
3. http://localhost:3004 (copy-of-app)
4. http://localhost:3005 (chrls-portfolio clone)
5. http://localhost:3006 (rlupo-portfolio-yves-klein)

FOR EACH SITE:
- Take screenshot of top (hero)
- Scroll to middle, screenshot
- Scroll to bottom (footer), screenshot
- Score out of 100 using: Typography(20%) + Colors(15%) + Layout(20%) + Components(20%) + Animation(15%) + Vibe(10%)
- List 2-3 components that MATCH chrls.design well
- List 2-3 components that DON'T match and need fixing

AFTER ALL 5 SITES:
Create summary table and list which site is closest to chrls.design.

BE EFFICIENT. Quick scores, focused comparison. Start now.
NAVIGATE TO: http://localhost:3001
```

#### 1.2 Manual Component Inventory
If browser agent doesn't complete, manually check each site for:

| Component | 3001 | 3002 | 3004 | 3005 | 3006 |
|-----------|------|------|------|------|------|
| Giant hero text | ? | ? | ? | ? | ? |
| Orange accent color | ? | ? | ? | ? | ? |
| Ticket-style cards | ? | ? | ? | ? | ? |
| Barcode/QR elements | ? | ? | ? | ? | ? |
| Marquee section | ? | ? | ? | ? | ? |
| Dark about section | ? | ? | ? | ? | ? |
| Matching footer | ? | ? | ? | ? | ? |

### Success Criteria

#### Automated Verification:
- [ ] All 5 dev servers running (localhost:3001-3006)
- [ ] Can access each site in browser

#### Manual Verification:
- [ ] Scores assigned to all 5 sites
- [ ] Best site identified for component extraction
- [ ] Component reusability matrix completed
- [ ] Gap analysis: what's missing from all samples

---

## Phase 2: Component Extraction & Assembly

### Overview
Take the best components from sample sites and assemble them into a single cohesive portfolio.

### Tasks

#### 2.1 Select Base Project
Choose the highest-scoring sample as the foundation. Likely candidates:
- **localhost:3005** (chrls-portfolio) - Direct clone attempt
- **localhost:3001** (rlupo-portfolio) - May have better ML adaptations

#### 2.2 Component Migration
For each component, determine: use as-is, modify, or rebuild.

**Priority Order:**
1. Hero section (most visible)
2. Project cards (core content)
3. Marquee (distinctive feature)
4. Footer (completes the page)
5. Status bar (nice to have)
6. About section (credentials)

#### 2.3 Create Missing Components
Based on gap analysis, build from CHRLS spec:

**Orange Info Box (if missing):**
```tsx
// components/InfoBox.tsx
export const InfoBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-chrls-orange border-2 border-black p-6 relative">
    <div className="absolute top-2 left-2 right-[-8px] bottom-[-8px] border-2 border-black -z-10" />
    {children}
  </div>
);
```

**Marquee (if missing):**
```tsx
// components/Marquee.tsx
export const Marquee: React.FC<{ text: string }> = ({ text }) => (
  <div className="overflow-hidden py-6">
    <div className="flex w-max animate-marquee">
      {[...Array(6)].map((_, i) => (
        <span key={i} className="font-display font-black text-hero uppercase whitespace-nowrap pr-12 text-stroke-2">
          {text} •
        </span>
      ))}
    </div>
  </div>
);
```

### Success Criteria

#### Automated Verification:
- [ ] `npm run build` passes with no errors
- [ ] `npm run typecheck` passes
- [ ] All components render without console errors

#### Manual Verification:
- [ ] Hero matches CHRLS visual style
- [ ] Project cards have ticket aesthetic
- [ ] Marquee scrolls correctly
- [ ] Colors match spec (#FF6B00 orange, #000 black)
- [ ] Typography hierarchy is correct

---

## Phase 3: Content Integration

### Overview
Replace placeholder content with actual ML/Data Science portfolio content.

### Tasks

#### 3.1 Hero Section Content
```
TREY.ML  (or LUPO.DATA)

Info Box Content:
HANDLES: Tabular, Vision, NLP, Time-Series
ACCURACY: 94%+ AUC-ROC typical
STACK: Python • PyTorch • XGBoost • DuckDB
STATUS: ● ONLINE

FOR BEST RESULTS: Apply to challenging datasets.
WARNING: May cause unexpectedly good predictions.
```

#### 3.2 Project Data
Create `lib/projects.ts`:

```typescript
export const projects = [
  {
    name: "KKBOX CHURN PREDICTION",
    trainedDate: "AUG 2024",
    version: "v1.3.0",
    metric: "AUC: 0.942",
    image: "/projects/kkbox.webp",
    link: "https://github.com/...",
    color: "orange"
  },
  // Add 6-8 projects
];
```

#### 3.3 About Section Content
- Education credentials
- Certifications (MIT, etc.)
- Skills grid
- Contact info

### Success Criteria

#### Automated Verification:
- [ ] No broken image links
- [ ] All project links valid
- [ ] TypeScript types match data

#### Manual Verification:
- [ ] Content reads professionally
- [ ] ML terminology is accurate
- [ ] Projects display in correct order

---

## Phase 4: Animation Implementation

### Overview
Add motion to match CHRLS's subtle animation language.

### Tasks

#### 4.1 Marquee Animation
```css
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-marquee {
  animation: marquee 25s linear infinite;
}
```

#### 4.2 Card Hover Effects
```tsx
<motion.div
  whileHover={{ y: -8, boxShadow: "0 24px 48px rgba(0,0,0,0.12)" }}
  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
>
  <ProjectCard {...project} />
</motion.div>
```

#### 4.3 Page Load Stagger
```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};
```

#### 4.4 Link Underline Animation
```css
.link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: currentColor;
  transition: width 300ms cubic-bezier(0.16, 1, 0.3, 1);
}

.link:hover::after {
  width: 100%;
}
```

### Success Criteria

#### Automated Verification:
- [ ] No animation jank (60fps in Chrome DevTools)
- [ ] `prefers-reduced-motion` respected
- [ ] No layout shift during animations

#### Manual Verification:
- [ ] Marquee scrolls smoothly at consistent speed
- [ ] Cards lift on hover with shadow
- [ ] Page loads with staggered reveal
- [ ] Links animate underline on hover

---

## Phase 5: Responsive & Polish

### Overview
Ensure the site works across all viewports and passes quality audits.

### Tasks

#### 5.1 Responsive Breakpoints
```css
/* Mobile: 320px - 767px */
.hero-title { font-size: 48px; }
.project-grid { grid-template-columns: 1fr; }

/* Tablet: 768px - 1023px */
@media (min-width: 768px) {
  .hero-title { font-size: 96px; }
  .project-grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  .hero-title { font-size: 140px; }
  .project-grid { grid-template-columns: repeat(3, 1fr); }
}

/* Large: 1280px+ */
@media (min-width: 1280px) {
  .hero-title { font-size: 180px; }
}
```

#### 5.2 Accessibility Fixes
- Add skip-to-content link
- Ensure 4.5:1 contrast for all text
- Add focus states with orange outline
- Alt text for all images
- Semantic HTML (header, main, footer, nav)

#### 5.3 Performance Optimization
- Optimize images (WebP, lazy loading)
- Minimize bundle size
- Add font preloading
- Implement resource hints

#### 5.4 SEO Metadata
```tsx
export const metadata = {
  title: "Trey Lupo | Machine Learning Engineer",
  description: "ML/AI portfolio showcasing predictive models, data pipelines, and production ML systems.",
  openGraph: { /* ... */ },
  twitter: { /* ... */ },
};
```

### Success Criteria

#### Automated Verification:
- [ ] Lighthouse Performance: 90+
- [ ] Lighthouse Accessibility: 90+
- [ ] Lighthouse Best Practices: 90+
- [ ] Lighthouse SEO: 90+
- [ ] `axe-core` zero violations

#### Manual Verification:
- [ ] Works on iPhone SE (320px)
- [ ] Works on iPad (768px)
- [ ] Works on MacBook Pro (1440px)
- [ ] Works on 4K display (2560px+)
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly

---

## Phase 6: Deployment

### Overview
Deploy to production with proper CI/CD.

### Tasks

#### 6.1 Build Verification
```bash
npm run build
npm run preview  # Test production build locally
```

#### 6.2 Deploy to Vercel
```bash
vercel --prod
```

#### 6.3 Post-Deploy Checks
- Test all links
- Verify analytics working
- Check Core Web Vitals
- Test contact form (if applicable)

### Success Criteria

#### Automated Verification:
- [ ] Vercel build succeeds
- [ ] No 404 errors
- [ ] SSL certificate valid

#### Manual Verification:
- [ ] Site loads in < 3 seconds
- [ ] All functionality works in production
- [ ] Mobile version works correctly

---

## Testing Strategy

### Unit Tests
- Component rendering tests
- Project data validation
- Animation timing tests

### Integration Tests
- Full page scroll behavior
- Navigation between sections
- Form submissions (if any)

### Manual Testing Steps
1. Load site on desktop, tablet, mobile
2. Scroll entire page - verify no jank
3. Hover all project cards - verify animation
4. Click all links - verify destinations
5. Test keyboard navigation (Tab through page)
6. Test with screen reader (VoiceOver/NVDA)

---

## Performance Considerations

- **Bundle size target:** < 200KB gzipped
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1
- **Total Blocking Time:** < 200ms

### Optimization Techniques
- Code splitting by route
- Image lazy loading
- Font subsetting
- Tree shaking unused CSS
- Preconnect to external domains

---

## References

- **CHRLS Inspiration:** https://chrls.design
- **Complete Analysis:** `CHRLS_DSGN_Complete_Analysis.md`
- **Browser Analysis:** `CHRLS_ANALYSIS_SESSION_1.md`
- **Browser Prompt:** `BROWSER_ANALYSIS_PROMPT.md`
- **Modernization Plan:** `PORTFOLIO_MODERNIZATION_PLAN.md`

---

## Appendix: Quick Reference

### Color Palette
```css
--chrls-orange: #FF6B00;
--chrls-black: #000000;
--chrls-dark: #1A1A1A;
--chrls-cream: #F5F5F0;
--chrls-gray: #666666;
--chrls-light: #E5E5E5;
```

### Typography
```css
--font-display: 'PP Neue Montreal', 'Satoshi', sans-serif;
--font-pixel: 'PP NeueBit', 'Space Mono', monospace;
```

### Key Animations
```css
--ease-expo: cubic-bezier(0.16, 1, 0.3, 1);
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 600ms;
```

---

**Plan Created:** December 19, 2025
**Status:** Ready for Implementation
**Next Action:** Complete Phase 1 (Browser analysis of sample sites)
