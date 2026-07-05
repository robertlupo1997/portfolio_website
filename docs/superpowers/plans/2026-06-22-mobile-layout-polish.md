# Mobile Layout Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hide project images on mobile and center the hero content vertically for a cleaner phone experience.

**Architecture:** CSS-only changes in the existing 768px responsive breakpoint. No component logic changes needed — images are hidden via `display: none`, grid rows simplified, and hero flex alignment updated.

**Tech Stack:** CSS custom properties, media queries

## Global Constraints

- All responsive changes go in existing `@media (max-width: 768px)` blocks in `styles/index.css`
- No component JSX changes — pure CSS
- Must not affect desktop or tablet (>768px) layouts

---

### Task 1: Hide project images and simplify grid on mobile

**Files:**
- Modify: `rlupo-portfolio/styles/index.css:998-1016` (768px breakpoint, carousel slide rules)

**Interfaces:**
- Consumes: existing `.carousel-slide-image`, `.carousel-slide`, `.carousel-slide--no-image` classes
- Produces: mobile layout where all project slides behave like `--no-image` variant (terminal panel + footer, no image row)

- [ ] **Step 1: Hide `.carousel-slide-image` and simplify grid rows at 768px**

In the `@media (max-width: 768px)` block starting at line 989 of `styles/index.css`, replace the carousel slide rules:

```css
/* Replace lines 998-1016 with: */

  .carousel-slide {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
    padding-top: 64px;
  }

  .carousel-slide-image {
    display: none;
  }

  .carousel-slide-terminal {
    align-items: flex-start;
  }
```

Key changes:
- `grid-template-rows` changes from `auto 1fr auto` (three rows: terminal, image, footer) to `1fr auto` (two rows: terminal, footer) — same as the desktop `--no-image` variant
- The separate `.carousel-slide--no-image` override is removed — it's now redundant since all slides use the two-row layout
- `.carousel-slide-image` gets `display: none` to hide the image entirely
- The image's `grid-column`, `grid-row`, and `padding` rules are removed since the element is hidden

- [ ] **Step 2: Verify dev server shows changes**

Run: open `http://localhost:3001` in Chrome DevTools responsive mode at 375x812.

Expected: Project slides show only the terminal panel (project name, description, tech stack, metrics) and the footer nav. No image visible. Terminal panel has room to breathe vertically.

- [ ] **Step 3: Verify desktop is unaffected**

Run: resize browser to 1440x900.

Expected: Two-column layout with terminal left, image right — unchanged from before.

- [ ] **Step 4: Commit**

```bash
git add rlupo-portfolio/styles/index.css
git commit -m "fix(mobile): hide project images, simplify grid to terminal+footer"
```

---

### Task 2: Center hero content vertically on mobile

**Files:**
- Modify: `rlupo-portfolio/styles/index.css:451-453` (hero-specific 768px breakpoint)

**Interfaces:**
- Consumes: existing `.hero-content` class with `justify-content: flex-end` at desktop
- Produces: vertically centered hero content on mobile

- [ ] **Step 1: Add `justify-content: center` to the hero mobile breakpoint**

In the `@media (max-width: 768px)` block starting at line 451, add the centering rule to `.hero-content`:

```css
@media (max-width: 768px) {
  .hero-content {
    justify-content: center;
    padding: 0 var(--page-indent) var(--space-lg) var(--page-indent);
  }
```

This overrides the desktop `justify-content: flex-end` (line 374) so the name, tagline, bio, and credentials sit in the vertical center of the viewport instead of clustering at the bottom above empty space.

- [ ] **Step 2: Verify dev server shows changes**

Run: open `http://localhost:3001` in Chrome DevTools responsive mode at 375x812.

Expected: Hero slide shows "TREY LUPO", tagline, bio, and credentials centered vertically in the viewport. The `[ PROJECTS → ]` button sits below the credentials. No large empty gap above or below the content block.

- [ ] **Step 3: Verify desktop is unaffected**

Run: resize browser to 1440x900.

Expected: Hero content still anchored to bottom-left of viewport with ASCII grid background — unchanged.

- [ ] **Step 4: Commit**

```bash
git add rlupo-portfolio/styles/index.css
git commit -m "fix(mobile): center hero content vertically"
```
