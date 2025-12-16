# RLUPO.DEV Portfolio - CHRLS.DSGN Recreation

A pixel-perfect recreation of the award-winning [CHRLS.DSGN](https://chrls.design) portfolio, adapted for an ML/Data Science focus.

## 🎯 Key Changes from Original Code

| Element | Your Original | CHRLS Recreation |
|---------|---------------|------------------|
| **Background** | `#F0F0F0` | `#F5F5F0` (warm cream) |
| **Orange Accent** | `#FF4D00` | `#FF6B00` |
| **Display Font** | Space Grotesk | Satoshi (PP Neue Montreal alternative) |
| **Mono Font** | JetBrains Mono | Space Mono (PP NeueBit alternative) |
| **Hero Layout** | Full-width centered | Giant text + orange info box with QR |
| **Project Cards** | Square + filled orange | Ticket style with blur, QR, barcode |
| **Marquee** | Filled text | **Outline text** (stroke only) |
| **Project Labels** | "Last Update" | "DEPLOYED" / "TRAINED" |
| **Footer** | Orange background | Dark background (#1A1A1A) |

## 📂 File Structure

```
chrls-portfolio/
├── components/
│   ├── Header.tsx      # Fixed header with asterisk logo
│   ├── Hero.tsx        # Giant title + orange info box + status bar
│   ├── Marquee.tsx     # Outline text infinite scroll
│   ├── ProjectCard.tsx # Ticket-style card with blur, QR, barcode
│   ├── About.tsx       # Dark section with marquee + awards
│   ├── Footer.tsx      # Dark footer with giant text
│   ├── Barcode.tsx     # Deterministic barcode SVG
│   └── QRCode.tsx      # Placeholder QR code SVG
├── App.tsx             # Main layout assembly
├── constants.ts        # Site config + project data
├── types.ts            # TypeScript interfaces
├── index.html          # Entry with Tailwind CDN + fonts
├── index.tsx           # React entry point
├── index.css           # Additional styles
├── package.json        # Dependencies
└── tsconfig.json       # TypeScript config
```

## 🎨 Design System

### Colors
```css
--chrls-orange: #FF6B00;     /* Primary accent */
--chrls-black: #000000;      /* Primary text */
--chrls-dark: #1A1A1A;       /* Footer/about bg */
--chrls-cream: #F5F5F0;      /* Main background */
--chrls-gray: #666666;       /* Secondary text */
```

### Typography
```css
/* Display - Satoshi (free alternative to PP Neue Montreal) */
font-family: 'Satoshi', sans-serif;
font-weight: 900; /* Black for hero */
font-weight: 700; /* Bold for titles */

/* Mono - Space Mono (free alternative to PP NeueBit) */
font-family: 'Space Mono', monospace;
font-size: 10px; /* Metadata */
letter-spacing: 0.05em; /* Tracking */
```

### Key Visual Patterns

1. **Outline Text Marquee**
   ```css
   .text-outline {
     -webkit-text-stroke: 2px #000000;
     -webkit-text-fill-color: transparent;
   }
   ```

2. **Blurred Project Images**
   ```css
   .img-blur {
     filter: blur(4px) brightness(0.9);
   }
   .group:hover .img-blur {
     filter: blur(0) brightness(1);
   }
   ```

3. **Card Hover Effect**
   ```css
   .card-hover:hover {
     transform: translateY(-8px);
     box-shadow: 0 24px 48px rgba(0, 0, 0, 0.12);
   }
   ```

## 🚀 Usage in Google AI Studio

1. Upload all files maintaining the folder structure
2. The `index.html` includes:
   - Tailwind CSS via CDN
   - Satoshi font from Fontshare
   - Space Mono from Google Fonts
   - Import maps for React 19 and Lucide icons

3. Key components are:
   - Self-contained with no external dependencies
   - Use Tailwind utility classes
   - Include inline styles for complex animations

## 📋 Project Data Structure

Update `constants.ts` with your projects:

```typescript
{
  id: "unique-id",
  title: "PROJECT NAME",
  category: "MACHINE LEARNING",
  description: "Brief description...",
  tags: ["Tag1", "Tag2"],
  githubUrl: "https://github.com/...",
  trainedDate: "AUG 2024",
  version: "v1.0.0",
  language: "Python",
  metric: "AUC",        // Optional
  metricValue: "0.942"  // Optional
}
```

## 🎭 Animations

| Animation | Duration | Easing |
|-----------|----------|--------|
| Marquee scroll | 30s | linear |
| Card hover | 300ms | cubic-bezier(0.16, 1, 0.3, 1) |
| Link underline | 300ms | cubic-bezier(0.16, 1, 0.3, 1) |
| Logo spin | 20s | linear |
| Image unblur | 400ms | ease-out |

## 🔧 Customization

### Change Branding
Edit `constants.ts`:
```typescript
export const SITE_CONFIG = {
  name: "YOUR",
  domain: "SITE",
  fullName: "Your Name",
  email: "you@email.com",
  // ...
};
```

### Change Colors
Edit the Tailwind config in `index.html`:
```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'chrls-orange': '#YOUR_COLOR',
        // ...
      }
    }
  }
}
```

## ✅ CHRLS.DSGN Features Recreated

- [x] Giant hero typography
- [x] Orange info box with QR code
- [x] Status bar with barcodes
- [x] Ticket-style project cards
- [x] Blurred preview images
- [x] QR codes per project
- [x] Barcode decorations
- [x] Outline text marquee
- [x] Dark about section with awards
- [x] Emergency banner
- [x] Dark footer with giant text repeat
- [x] Asterisk logo animation
- [x] Link underline animations
- [x] Card hover effects

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

**Original Design Credit**: [CHRLS.DSGN](https://chrls.design) by Charles (Indonesia)
**Recreation For**: Robert Lupo - ML/Data Science Portfolio
