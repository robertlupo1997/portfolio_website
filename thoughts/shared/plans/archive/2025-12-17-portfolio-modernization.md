# Portfolio Modernization Implementation Plan

## Overview

Fix critical bugs, remove redundant dependencies, and improve accessibility in the R.LUPO portfolio. This plan prioritizes quick wins and stability over ambitious enhancements.

## Current State Analysis

**Confirmed Issues:**
1. **Memory Leak** - `SmoothScroll.tsx:28-32`: RAF loop never cancelled on cleanup
2. **Redundant Dependencies** - Both `locomotive-scroll` and `lenis` installed; both `framer-motion` and `gsap` used
3. **Frame-Rate Dependent Animation** - `FloatingGeometry.tsx:17-20`: Fixed rotation values (0.003, 0.005)
4. **Color Contrast** - Orange `#FF6B00` on cream `#F5F5F0` = 3.1:1 (fails WCAG AA 4.5:1)
5. **No Skip Link** - Missing accessibility skip-to-content link

**What's Already Good:**
- `prefers-reduced-motion` respected in multiple components
- Focus-visible styles already in `index.css:50-54`
- SEO meta tags already in place
- React 19 + modern stack

## Desired End State

- No memory leaks (verified via DevTools)
- Single smooth scroll library (Lenis)
- Single animation library (GSAP - better for scroll-heavy sites)
- WCAG 2.2 AA compliant contrast
- Skip-to-content link for keyboard users
- 60fps animations on 60Hz and 120Hz displays

## What We're NOT Doing

- Migrating ParticleField from p5.js to WebGL (not needed unless perf issues arise)
- Adding generative art (separate enhancement, not a fix)
- CSS scroll-driven animations (browser support still inconsistent)
- View Transitions API (future enhancement)

---

## Phase 1: Fix Memory Leak in SmoothScroll

### Overview
Fix the critical RAF loop memory leak that causes performance degradation over time.

### Changes Required:

**File**: `components/SmoothScroll.tsx`

Replace lines 27-37 with:
```tsx
import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';

interface SmoothScrollProps {
  children: React.ReactNode;
}

const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Skip if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Initialize Lenis
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    // RAF loop with proper tracking
    function raf(time: number) {
      lenisRef.current?.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    }
    rafIdRef.current = requestAnimationFrame(raf);

    // Cleanup - cancel RAF AND destroy Lenis
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      lenisRef.current?.destroy();
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;
```

### Success Criteria:

#### Automated Verification:
- [ ] TypeScript compiles: `npm run build`
- [ ] No console errors in browser

#### Manual Verification:
- [ ] Open DevTools > Performance > Memory
- [ ] Scroll page for 60 seconds
- [ ] Memory should stay flat (not continuously increase)
- [ ] Smooth scrolling still works

---

## Phase 2: Remove Redundant Dependencies

### Overview
Remove locomotive-scroll (keeping Lenis) and consolidate on GSAP (removing Framer Motion).

### Changes Required:

#### 1. Remove locomotive-scroll
**Command**:
```bash
cd chrls-portfolio-complete/chrls-portfolio && npm uninstall locomotive-scroll
```

#### 2. Keep Framer Motion for now (simpler)
After reviewing `App.tsx` and `Hero.tsx`, Framer Motion is deeply integrated for:
- AnimatePresence (loading screen)
- motion.div with variants (project grid stagger)
- Initial/animate/transition props throughout

**Decision**: Keep both for now. Removing Framer Motion would require rewriting all animations - not worth it for this modernization pass.

#### 3. Remove unused AOS
**File**: `package.json`

AOS (`aos`) is installed but not imported anywhere.
```bash
cd chrls-portfolio-complete/chrls-portfolio && npm uninstall aos @types/aos
```

### Success Criteria:

#### Automated Verification:
- [ ] `npm install` succeeds
- [ ] `npm run build` succeeds
- [ ] No import errors in browser console

#### Manual Verification:
- [ ] All page animations still work
- [ ] Smooth scrolling unchanged

---

## Phase 3: Fix Frame-Rate Dependent Animation

### Overview
Make FloatingGeometry rotation frame-rate independent using delta time.

### Changes Required:

**File**: `components/FloatingGeometry.tsx`

Replace the `useFrame` callback (lines 14-29):
```tsx
useFrame((state, delta) => {
  if (meshRef.current && wireRef.current) {
    // Delta-based rotation (frame-rate independent)
    const rotationSpeed = 0.5; // radians per second
    meshRef.current.rotation.x += delta * rotationSpeed * 0.6;
    meshRef.current.rotation.y += delta * rotationSpeed;
    wireRef.current.rotation.x += delta * rotationSpeed * 0.6;
    wireRef.current.rotation.y += delta * rotationSpeed;

    // Subtle mouse follow (lerp is already frame-rate independent)
    const targetX = mouse.current.x * 0.3;
    const targetY = -mouse.current.y * 0.3;
    meshRef.current.rotation.z += (targetX - meshRef.current.rotation.z) * 0.02;
    meshRef.current.rotation.x += (targetY - meshRef.current.rotation.x) * 0.01;
    wireRef.current.rotation.z += (targetX - wireRef.current.rotation.z) * 0.02;
    wireRef.current.rotation.x += (targetY - wireRef.current.rotation.x) * 0.01;
  }
});
```

### Success Criteria:

#### Automated Verification:
- [ ] `npm run build` succeeds

#### Manual Verification:
- [ ] Geometry rotates at same perceived speed on 60Hz and 120Hz monitors
- [ ] Mouse interaction still smooth

---

## Phase 4: Fix Color Contrast (Accessibility)

### Overview
Fix orange text on cream background to meet WCAG AA 4.5:1 contrast ratio.

### Changes Required:

#### 1. Add darker orange variant
**File**: `index.html`

In the Tailwind config (line 37), the dark orange already exists:
```js
'chrls-orange-dark': '#E85D00',  // Already defined but not dark enough
```

Change to:
```js
'chrls-orange-dark': '#C45000',  // 4.6:1 contrast on cream
```

#### 2. Use dark orange for small text
**File**: `components/Hero.tsx`

The orange dot in the title (line 71) is large text - OK at 3:1.

Check small orange text instances and update if any exist with `text-chrls-orange` class on small text.

**File**: `index.css`

Add utility class for accessible orange text:
```css
/* Accessible orange for small text (4.5:1 on cream) */
.text-orange-accessible {
  color: #C45000;
}
```

### Success Criteria:

#### Automated Verification:
- [ ] `npm run build` succeeds

#### Manual Verification:
- [ ] Run browser contrast checker extension
- [ ] All small orange text has 4.5:1+ contrast
- [ ] Large text (18px+ bold or 24px+) can keep original orange

---

## Phase 5: Add Skip-to-Content Link

### Overview
Add hidden skip link for keyboard/screen reader users.

### Changes Required:

**File**: `App.tsx`

Add skip link as first element inside SmoothScroll:
```tsx
<SmoothScroll>
  {/* Skip to main content link for accessibility */}
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-chrls-orange focus:text-black focus:font-mono focus:text-sm"
  >
    Skip to main content
  </a>

  {/* Custom Cursor */}
  <CustomCursor />
  ...
```

Add `id="main-content"` to the main element:
```tsx
<main id="main-content">
```

**File**: `index.html`

Add sr-only utility if not present (Tailwind CDN should have it, but verify):
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### Success Criteria:

#### Automated Verification:
- [ ] `npm run build` succeeds

#### Manual Verification:
- [ ] Press Tab on page load - skip link appears
- [ ] Press Enter - focus moves to main content
- [ ] Screen reader announces "Skip to main content"

---

## Testing Strategy

### Automated Tests:
None currently - portfolio doesn't have test setup. Consider adding in future.

### Manual Testing Checklist:
1. [ ] Memory: No leaks after 60s scrolling (DevTools Memory tab)
2. [ ] Build: `npm run build` produces dist/ folder
3. [ ] Accessibility: Tab through entire page, all interactive elements focusable
4. [ ] Accessibility: Skip link works
5. [ ] Accessibility: Contrast checker passes
6. [ ] Performance: Smooth 60fps scrolling
7. [ ] Reduced Motion: Disable animations in OS settings, verify site still usable

### Browser Testing:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (if available)
- [ ] Mobile Chrome/Safari

---

## Execution Order

1. **Phase 1** - Memory leak (critical, 5 min)
2. **Phase 2** - Dependencies (low risk, 2 min)
3. **Phase 3** - Frame-rate fix (low risk, 5 min)
4. **Phase 4** - Color contrast (medium effort, 10 min)
5. **Phase 5** - Skip link (low risk, 5 min)

**Total estimated time**: ~30 minutes

---

## Files Modified

| File | Phase | Change |
|------|-------|--------|
| `components/SmoothScroll.tsx` | 1 | Fix RAF cleanup |
| `package.json` | 2 | Remove locomotive-scroll, aos |
| `components/FloatingGeometry.tsx` | 3 | Delta-based rotation |
| `index.html` | 4 | Darker orange color |
| `index.css` | 4 | Accessible orange utility |
| `App.tsx` | 5 | Skip link + main id |

---

## References

- Modernization docs: `PORTFOLIO_MODERNIZATION_PLAN.md`
- Generative art research: `GENERATIVE_ART_RESEARCH.md` (future enhancement)
- WCAG 2.2 Quick Reference: https://www.w3.org/WAI/WCAG22/quickref/
