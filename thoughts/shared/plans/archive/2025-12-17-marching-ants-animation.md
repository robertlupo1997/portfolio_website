# Marching Ants Animation Implementation Plan

## Overview

Add CSS-only marching ants border animation to ProjectCard components on hover. This enhances the CHRLS-inspired brutalist aesthetic with a subtle, performant animation that guides the eye without adding dependencies.

## Current State Analysis

**Existing Patterns:**
- `ProjectCard.tsx:70` - Uses `border-2 border-black` on main container
- `ProjectCard.tsx:68` - Already has Framer Motion hover: `whileHover={{ y: -8 }}`
- `index.html:102-118` - Existing keyframe animations (marquee, spin-slow)
- `index.css:74-93` - Reduced motion support already in place

**What's Good:**
- Animation infrastructure exists
- Reduced motion compliance established
- Card already has hover state handling

## Desired End State

- ProjectCard borders animate with marching ants effect on hover
- Animation is smooth 60fps
- Zero new dependencies
- Respects `prefers-reduced-motion`
- Works on all modern browsers

## What We're NOT Doing

- Adding Lottie or other animation libraries
- Animating Hero info box borders (keep scope minimal)
- Binary code or blob animations (future enhancement)
- Touch device animations (hover-only)

---

## Phase 1: Add Marching Ants Keyframe Animation

### Overview
Define the CSS keyframe animation in index.html alongside existing animations.

### Changes Required:

**File**: `index.html`

Add after the `.animate-spin-slow` block (around line 160):

```css
/* Marching ants border animation */
@keyframes march {
  to {
    stroke-dashoffset: -16px;
  }
}

.marching-ants-border {
  position: relative;
}

.marching-ants-border::before {
  content: '';
  position: absolute;
  inset: -2px;
  border: 2px dashed transparent;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.marching-ants-border:hover::before {
  border-color: #FF6B00;
  opacity: 1;
  animation: march-dash 0.4s linear infinite;
}

@keyframes march-dash {
  to {
    background-position: 16px 0;
  }
}
```

### Success Criteria:

#### Automated Verification:
- [ ] `npm run build` succeeds
- [ ] No CSS syntax errors in browser console

#### Manual Verification:
- [ ] Animation keyframes visible in DevTools

---

## Phase 2: Create Optimized Border Animation

### Overview
Use a more performant approach with SVG-based dashed border animation via CSS background.

### Changes Required:

**File**: `index.css`

Add before the reduced motion section:

```css
/* Marching ants hover effect */
.marching-ants {
  position: relative;
}

.marching-ants::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  border: 2px dashed #FF6B00;
  opacity: 0;
  transition: opacity 0.2s ease-out;
}

.marching-ants:hover::after {
  opacity: 1;
  animation: march 0.5s linear infinite;
}

@keyframes march {
  to {
    stroke-dashoffset: -8px;
  }
}
```

Wait - CSS `stroke-dashoffset` doesn't work on regular borders. Let me use the correct approach:

**File**: `index.css` (revised)

Add before the reduced motion section:

```css
/* Marching ants hover effect for cards */
.marching-ants {
  position: relative;
}

.marching-ants::after {
  content: '';
  position: absolute;
  inset: -4px;
  background:
    linear-gradient(90deg, #FF6B00 50%, transparent 50%) repeat-x,
    linear-gradient(90deg, #FF6B00 50%, transparent 50%) repeat-x,
    linear-gradient(0deg, #FF6B00 50%, transparent 50%) repeat-y,
    linear-gradient(0deg, #FF6B00 50%, transparent 50%) repeat-y;
  background-size: 8px 2px, 8px 2px, 2px 8px, 2px 8px;
  background-position: 0 0, 0 100%, 0 0, 100% 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease-out;
}

.marching-ants:hover::after {
  opacity: 1;
  animation: march 0.3s linear infinite;
}

@keyframes march {
  to {
    background-position: 8px 0, -8px 100%, 0 -8px, 100% 8px;
  }
}
```

### Success Criteria:

#### Automated Verification:
- [ ] `npm run build` succeeds

#### Manual Verification:
- [ ] Hover over any element with `.marching-ants` class
- [ ] Orange dashed border appears with marching animation
- [ ] Animation is smooth (no jank)

---

## Phase 3: Apply to ProjectCard

### Overview
Add the marching-ants class to the ProjectCard container.

### Changes Required:

**File**: `components/ProjectCard.tsx`

Change line 70 from:
```tsx
<div className="border-2 border-black bg-white overflow-hidden">
```

To:
```tsx
<div className="border-2 border-black bg-white overflow-hidden marching-ants">
```

### Success Criteria:

#### Automated Verification:
- [ ] `npm run build` succeeds
- [ ] TypeScript compiles without errors

#### Manual Verification:
- [ ] Hover over any project card
- [ ] Orange marching ants border appears outside the black border
- [ ] Animation runs smoothly
- [ ] Card lift animation still works alongside marching ants

---

## Phase 4: Reduced Motion Compliance

### Overview
Ensure the marching ants animation respects user preference for reduced motion.

### Changes Required:

**File**: `index.css`

Inside the existing `@media (prefers-reduced-motion: reduce)` block, add:

```css
/* Disable marching ants for reduced motion */
.marching-ants::after {
  animation: none !important;
}
```

### Success Criteria:

#### Automated Verification:
- [ ] `npm run build` succeeds

#### Manual Verification:
- [ ] Enable "Reduce motion" in OS settings
- [ ] Hover over project card
- [ ] Border appears but does NOT animate (static dashed border)

---

## Testing Strategy

### Manual Testing Steps:
1. Run `npm run dev` and open in browser
2. Hover over each project card - verify marching ants appear
3. Move mouse away - verify animation stops and border fades
4. Test on Chrome, Firefox, Safari (if available)
5. Enable reduced motion in OS, verify animation disabled
6. Check DevTools Performance tab - ensure no layout thrashing

### Browser Testing:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Safari (if available)

## Performance Considerations

- Using `background-position` animation (GPU accelerated)
- No layout changes (only composite layer animations)
- `pointer-events: none` prevents interaction issues
- Animation only runs on hover (not constantly)

## Files Modified

| File | Phase | Change |
|------|-------|--------|
| `index.css` | 2, 4 | Add marching-ants class and reduced motion rule |
| `components/ProjectCard.tsx` | 3 | Add marching-ants class to container |

## References

- CHRLS.DSGN inspiration: marching ants / dashed line animations
- CSS Tricks: Animating Border: https://css-tricks.com/animating-border/
