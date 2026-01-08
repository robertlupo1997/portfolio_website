# CHRLS.DSGN - Frontend Design Specification

## Overview
Analysis of chrls.design for replication as a Machine Learning portfolio. The site features a unique "ticket/admission pass" aesthetic with bold typography, vibrant accent colors, and smooth animations.

---

## Color Palette

### Primary Colors
| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| Background Light | `#EBEBEB` | `rgb(235, 235, 235)` | Main page background |
| Dark/Black | `#0F0F0F` | `rgb(15, 15, 15)` | Text, dark sections, about section |
| Orange Accent | `#FF6D1B` | `rgb(255, 109, 27)` | Ticket stubs, CTAs, footer, highlights |

### Card Accent Colors (Ticket Stubs)
| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| Lime/Neon Green | `#DBFF00` | `rgb(219, 255, 0)` | Card accent |
| Cyan | `#00F0FF` | `rgb(0, 240, 255)` | Card accent (RAGS project) |
| Mint/Seafoam | `#00FFA3` | `rgb(0, 255, 163)` | Card accent |
| Light Teal | `#D1ECEE` | `rgb(209, 236, 238)` | Card accent |
| Pink/Magenta | `#FF2D6A` | (estimated) | Floating action button |

---

## Typography

### Font Family
```css
font-family: "Neue Montreal", sans-serif;
```
**Note:** Neue Montreal is a premium font. Alternatives: Inter, Space Grotesk, or Satoshi.

### Type Scale

| Element | Size | Weight | Line Height | Text Transform |
|---------|------|--------|-------------|----------------|
| Hero Title (CHRLS.DSGN) | `169px` | `400` | `126px` | `none` |
| Loading Counter | `32px` | `400` | `28.8px` | `none` |
| Section Heading | `24px` | `400` | normal | `uppercase` |
| Subheading | `16px` | `400` | normal | `uppercase` |
| Body/Links | `16px` | `400` | `16px` | `none` |
| Marquee Text | ~`80-100px` | `400` | normal | `uppercase` |
| Footer Heading | ~`120px` | `400` | normal | `uppercase` |

### Text Styles
```css
/* Hero Title */
.hero-title {
  font-family: "Neue Montreal", sans-serif;
  font-size: clamp(80px, 15vw, 169px);
  font-weight: 400;
  line-height: 0.75;
  color: #0F0F0F;
  letter-spacing: normal;
}

/* Links */
a {
  font-family: "Neue Montreal", sans-serif;
  font-size: 16px;
  text-decoration: underline;
  color: #0F0F0F;
}
```

---

## Layout & Spacing

### Page Structure
- Full viewport height sections
- Estimated total scroll height: ~8000px+
- Viewport-based responsive sizing

### Spacing System (estimated)
```css
--space-xs: 8px;
--space-sm: 16px;
--space-md: 24px;
--space-lg: 48px;
--space-xl: 80px;
--space-2xl: 120px;
```

### Container
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
```

---

## Components

### 1. Navigation Header

**Structure:**
```
[Logo] -------- [Say hello / email] -------- [ARCHIVE]
```

**Styles:**
```css
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  z-index: 100;
  background: transparent;
}

.logo {
  width: 48px;
  height: 48px;
  /* Geometric flower/star SVG icon */
}

.contact-link {
  text-align: center;
}

.archive-link {
  text-decoration: underline;
  text-transform: uppercase;
}
```

### 2. Hero Section (Ticket Design)

**Structure:**
```
+--------------------------------------------------+
|  CHRLS.DSGN  (large title)                       |
+--------------------------------------------------+
| +----------------------------------------------+ |
| | [Barcode area]  |  Description text  | ©2023 | |
| |                 |                    |       | |
| | INDEPENDENT DEVELOPER    |||  ||| |  |||    | |
| +----------------------------------------------+ |
+--------------------------------------------------+
| [barcode] AVLB:2025 O COMING SOON O TIME [barcode]|
+--------------------------------------------------+
```

**Ticket Card Styles:**
```css
.ticket-card {
  background: #FF6D1B;
  border-radius: 0;
  padding: 24px;
  position: relative;
}

.ticket-barcode-area {
  background: #EBEBEB;
  padding: 16px;
  font-family: monospace;
  /* Binary/matrix pattern generated via code */
}

.ticket-perforation {
  border-top: 2px dashed #0F0F0F;
  margin: 16px 0;
}

.ticket-bottom-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 24px;
  font-size: 14px;
  text-transform: uppercase;
}
```

### 3. Project Cards (Ticket Style)

**Dimensions:**
- Width: `480px`
- Height: `800px`
- Aspect ratio: ~3:5

**Structure:**
```
+------------------------+
|                        |
|    [Project Image]     |
|                        |
|                        |
+------------------------+ <- Perforation line
| PROJECT NAME    [QR]   |
| •• •• ••• ••          |
| [Barcode] EXPIRED 2022 |
+------------------------+
```

**Styles:**
```css
.project-card {
  width: 480px;
  height: 800px;
  background: #EBEBEB;
  border: 2px solid #0F0F0F;
  overflow: hidden;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: all 0.5s ease;
}

.project-card:hover {
  transform: translateZ(100px);
}

.project-image {
  width: 100%;
  height: 65%;
  object-fit: cover;
  border-bottom: 2px dashed #0F0F0F;
}

.project-ticket-stub {
  background: #FF6D1B; /* or accent color */
  padding: 16px 24px;
  height: 35%;
}

.project-name {
  font-size: 18px;
  font-weight: 400;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.project-braille {
  font-size: 12px;
  letter-spacing: 2px;
  margin-bottom: 16px;
  /* Simulated braille dots pattern */
}

.project-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.project-barcode {
  width: 60px;
  height: 30px;
  /* Generated barcode SVG */
}

.project-qr {
  width: 80px;
  height: 80px;
  /* Generated QR code */
}

.expired-date {
  font-size: 10px;
  text-transform: uppercase;
}
```

**Stacked Cards Effect:**
```css
.cards-container {
  position: relative;
  perspective: 1000px;
}

.project-card {
  position: absolute;
  transform-origin: center center;
}

.project-card:nth-child(1) { transform: translateZ(0px); }
.project-card:nth-child(2) { transform: translateZ(-20px) translateX(-10px); }
.project-card:nth-child(3) { transform: translateZ(-40px) translateX(-20px); }
/* Continue for more cards */
```

### 4. Marquee/Scrolling Text

**Structure:**
Two diagonal banners crossing the viewport with "SELECTED CLIENT WORK" repeating

**Styles:**
```css
.marquee-container {
  position: fixed;
  width: 200%;
  transform: rotate(-10deg);
  overflow: hidden;
  pointer-events: none;
}

.marquee-track {
  display: flex;
  animation: marquee 20s linear infinite;
  background: #FF6D1B;
  padding: 16px 0;
}

.marquee-text {
  font-size: 80px;
  font-weight: 400;
  text-transform: uppercase;
  white-space: nowrap;
  padding: 0 48px;
  /* Pixel/bitmap font style */
  font-family: "Pixel Font", monospace;
  letter-spacing: 4px;
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* Second marquee going opposite direction */
.marquee-track.reverse {
  animation-direction: reverse;
}
```

### 5. About Section

**Structure:**
```
+--------------------------------------------------+
|  A DESIGNER & DEVELOPER. CREATIVELY DRIVEN.      |
+--------------------------------------------------+
| +------------------+  +------------------------+ |
| | Bio text...      |  |  X::    ABOUT          | |
| |                  |  |                        | |
| | [diagonal        |  | Awwwards  CSSDA  CSS   | |
| |  stripes]        |  | 5x HM     2x UI  1x    | |
| +------------------+  +------------------------+ |
+--------------------------------------------------+
```

**Styles:**
```css
.about-section {
  background: #FF6D1B;
  min-height: 100vh;
  padding: 80px 24px;
}

.about-card {
  background: #0F0F0F;
  color: #FF6D1B;
  padding: 24px;
}

.about-bio {
  font-size: 14px;
  line-height: 1.6;
}

.diagonal-stripes {
  background: repeating-linear-gradient(
    -45deg,
    #0F0F0F,
    #0F0F0F 10px,
    #FF6D1B 10px,
    #FF6D1B 20px
  );
  height: 60px;
}

.awards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.award-item {
  font-size: 14px;
}

.award-source {
  font-weight: 600;
  margin-bottom: 4px;
}
```

### 6. Footer

**Structure:**
```
[dark section continuation]
+--------------------------------------------------+
| ©2023                     Instagram              |
|                           Twitter                |
| Say hello [wave]          LinkedIn               |
| hello@chrls.design        Discord                |
|                           CodeSandbox            |
+--------------------------------------------------+
|           CHRLS.DSGN (large)                     |
+--------------------------------------------------+
```

**Styles:**
```css
.footer {
  background: #FF6D1B;
  padding: 48px 24px;
}

.footer-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 80px;
}

.footer-copyright {
  font-size: 14px;
}

.footer-contact h3 {
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-email {
  font-size: 24px;
  text-decoration: underline;
}

.footer-socials {
  text-align: right;
}

.footer-socials a {
  display: block;
  font-size: 16px;
  margin-bottom: 8px;
  text-decoration: none;
}

.footer-socials a:hover {
  text-decoration: underline;
}

.footer-logo {
  font-size: clamp(60px, 12vw, 140px);
  font-weight: 400;
  text-transform: uppercase;
  line-height: 0.9;
}
```

---

## Animations & Interactions

### 1. Page Load Animation
- Counter from 0-100 displayed in bottom right
- Dark overlay fades out
- Hero elements animate in with stagger

```css
.loading-counter {
  position: fixed;
  bottom: 24px;
  right: 24px;
  font-size: 32px;
  z-index: 1000;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.hero-element {
  animation: fadeIn 0.8s ease forwards;
  animation-delay: var(--stagger-delay);
}
```

### 2. Card Hover Effects
- Cards use 3D transforms (matrix3d)
- Front card expands/comes forward on hover
- Custom circular cursor appears with arrow icon
- Orange/yellow circular indicator follows mouse

```css
.card-cursor {
  position: fixed;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #FF6D1B;
  pointer-events: none;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cards-container:hover .card-cursor {
  opacity: 1;
}

.card-cursor svg {
  width: 24px;
  height: 24px;
  transform: rotate(-45deg);
}
```

### 3. Marquee Animation
- Continuous horizontal scroll
- Two diagonal bands crossing in opposite directions
- Speed: ~20s per full cycle

### 4. Scroll Progress Indicator
- Orange vertical bar on right side indicates scroll position

```css
.scroll-indicator {
  position: fixed;
  right: 0;
  top: 0;
  width: 8px;
  background: #FF6D1B;
  height: var(--scroll-progress);
  transition: height 0.1s ease;
}
```

### 5. Floating Action Button
- Pink/magenta circular button
- Arrow icon pointing up-right
- Appears after scrolling past hero

```css
.fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #FF2D6A;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transform: scale(0);
  transition: transform 0.3s ease;
}

.fab.visible {
  transform: scale(1);
}
```

---

## Special Elements

### Barcode Generation
Use a library like `JsBarcode` or generate SVG patterns:
```javascript
// Simple barcode pattern
const generateBarcode = () => {
  const bars = [];
  for (let i = 0; i < 30; i++) {
    const width = Math.random() > 0.5 ? 2 : 4;
    bars.push(`<rect x="${i * 3}" width="${width}" height="30" fill="#0F0F0F"/>`);
  }
  return `<svg viewBox="0 0 90 30">${bars.join('')}</svg>`;
};
```

### QR Code Generation
Use `qrcode` library to generate project-specific QR codes linking to live sites.

### Braille-like Dots
```css
.braille-dots {
  font-size: 12px;
  letter-spacing: 3px;
}
/* Use unicode braille characters: ⠁⠂⠃⠄⠅⠆⠇⠈⠉⠊ */
```

### Binary Matrix Pattern
```javascript
// Generate random binary pattern for ticket background
const generateBinaryMatrix = (rows, cols) => {
  let matrix = '';
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      matrix += Math.random() > 0.5 ? '1 ' : '0 ';
    }
    matrix += '\n';
  }
  return matrix;
};
```

---

## Responsive Considerations

### Breakpoints (estimated)
```css
/* Mobile */
@media (max-width: 640px) {
  .hero-title { font-size: 60px; }
  .project-card { width: 100%; height: auto; }
  .marquee-text { font-size: 40px; }
}

/* Tablet */
@media (max-width: 1024px) {
  .hero-title { font-size: 100px; }
  .project-card { width: 400px; }
}
```

---

## Tech Stack Recommendations

For replicating this design:

1. **Framework:** Next.js or Astro
2. **Styling:** Tailwind CSS + CSS Modules for complex animations
3. **Animations:** Framer Motion or GSAP
4. **3D Effects:** CSS transforms or Three.js for advanced interactions
5. **Fonts:** Neue Montreal (or Inter/Space Grotesk as alternatives)
6. **Barcode/QR:** JsBarcode, qrcode.js
7. **Smooth Scroll:** Lenis or Locomotive Scroll

---

## Implementation Priority

1. Set up color variables and typography
2. Create header with logo and navigation
3. Build hero section with ticket design
4. Implement project cards with stacking effect
5. Add marquee component
6. Create about section with awards grid
7. Build footer
8. Add animations and interactions
9. Implement custom cursor
10. Add loading animation
11. Make responsive

---

## Files to Create

```
src/
├── components/
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── TicketCard.tsx
│   ├── ProjectCard.tsx
│   ├── Marquee.tsx
│   ├── About.tsx
│   ├── Footer.tsx
│   ├── CustomCursor.tsx
│   └── LoadingScreen.tsx
├── styles/
│   ├── globals.css
│   ├── variables.css
│   └── animations.css
├── utils/
│   ├── generateBarcode.ts
│   └── generateQR.ts
└── data/
    └── projects.ts
```

---

*Analysis completed: December 2024*
*Source: chrls.design*
