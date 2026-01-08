# Personal Branding Strategy: CHRLS-Inspired ML Portfolio

## Overview

This plan defines a personal branding strategy for Trey Lupo's ML/Data Science portfolio, adapting the CHRLS.DSGN industrial aesthetic while creating a distinctly personal identity. The goal is to leverage the downloaded assets (fonts, textures, decorative SVGs) while establishing unique branding elements that differentiate from the source.

## Current State Analysis

### Downloaded Assets Available
- **Fonts:** Neue Montreal (Regular, Bold), NeueBit (Bold)
- **Textures:** grain.gif (film grain overlay)
- **Decorative SVGs:** barcode_icon.svg, braille.svg
- **CSS Design System:** Complete color palette, typography scale, layout patterns

### CHRLS.DSGN Core Identity
- Charles: Independent developer/designer from Indonesia
- Aesthetic: Industrial, ticket/receipt metaphor, analog textures
- Color: Coral (#ff6d1b) as primary accent
- Vibe: Editorial, experimental, web craftsmanship awards

### User Profile: Trey Lupo
- **Field:** Machine Learning / Data Science
- **GitHub:** robertlupo1997
- **Projects:** Churn prediction, computer vision, recommender systems, predictive modeling
- **Differentiator:** Production ML focus (AUC metrics, SHAP explanations, calibrated models)

---

## Desired End State

A portfolio that:
1. Captures the industrial, data-driven aesthetic of CHRLS.DSGN
2. Communicates "ML Engineer" identity instantly
3. Feels like a "model card" or "technical specification sheet" for a human
4. Uses CHRLS assets legally and ethically with proper attribution
5. Has distinctive personal touches that prevent confusion with the source

### Verification Criteria
- [ ] Brand name is unique and memorable
- [ ] Color palette has at least one distinctive deviation
- [ ] ML-specific terminology replaces generic design terminology
- [ ] Attribution to CHRLS.DSGN is visible on the site
- [ ] Visual identity feels "data/ML" not "design agency"

---

## What We're NOT Doing

- Exact visual clone of chrls.design
- Using Charles's name, logo, or project content
- Copying his exact taglines or bio text
- Pretending this is wholly original design work
- Using fonts without verifying licensing

---

## Brand Identity Decisions

### Option A: TREY.ML (Recommended)

**Rationale:**
- Domain-style naming mirrors tech/dev culture
- ".ML" suffix instantly signals machine learning
- Short, punchy, works as hero text
- Available as actual domain (trey.ml)

**Hero Treatment:**
```
TREY
    ■
ML
```
(Using the dot/splitter element from CHRLS)

### Option B: LUPO.DATA

**Rationale:**
- Last name creates more professional distance
- ".DATA" is broader than .ML
- Italian surname "Lupo" (wolf) has symbolic potential

**Hero Treatment:**
```
LUPO
    ■
DATA
```

### Option C: PREDICTION.ENGINE

**Rationale:**
- Descriptive of what they do
- More conceptual/abstract branding
- Could be seen as less personal

### Recommendation: Go with TREY.ML
- Personal (first name) + Technical (.ML) balance
- Memorable and unique
- Works at all sizes (hero to favicon)

---

## Color System Customization

### Base Palette (from CHRLS)
| Token | CHRLS Value | Keep/Modify |
|-------|-------------|-------------|
| Background | #ebebeb (white-smoke) | ✅ Keep |
| Text | #0f0f0f (black) | ✅ Keep |
| Primary Accent | #ff6d1b (coral) | 🔄 Modify |
| Secondary 1 | #d1ecee (light-cyan) | ✅ Keep for cards |
| Secondary 2 | #00ffa3 (spring-green) | ✅ Keep for cards |
| Secondary 3 | #dbff00 (yellow) | ✅ Keep for cards |
| Secondary 4 | #00f0ff (cyan) | ✅ Keep for cards |

### Recommended Modification: Primary Accent

**Option A: Keep Coral (#ff6d1b)** - Perfectly fine, attribution handles it

**Option B: Shift to ML/Tech Color**
- **Electric Indigo (#6366f1)** - Modern ML/AI feel, Tailwind's indigo-500
- **Tensor Orange (#ff9800)** - TensorFlow-inspired, still warm
- **PyTorch Red (#ee4c2c)** - Framework association
- **Gradient approach:** Keep coral but add a gradient to indigo for tech feel

**Recommendation:** Keep coral (#ff6d1b) with attribution. It works, and changing it loses the aesthetic coherence. The ML terminology does the differentiation.

### Card Color Assignments (for projects)
| Project Type | Card Color | Token |
|--------------|------------|-------|
| ML/Prediction | Coral (#ff6d1b) | Featured/primary |
| Computer Vision | Cyan (#00f0ff) | Visual processing |
| NLP/Text | Light-cyan (#d1ecee) | Language processing |
| Data Analytics | Yellow (#dbff00) | Insights/analysis |
| Recommender | Spring-green (#00ffa3) | User-focused |

---

## Typography Strategy

### Font Decision: FREE ALTERNATIVES ✅

Since personal portfolios are a gray area for font licensing (promotes you professionally = potentially commercial use), we're using 100% free fonts with no licensing concerns.

**Final Font Stack:**

**Primary: Satoshi** (Fontshare - 100% Free)
- Closest visual match to Neue Montreal available for free
- Neo-grotesque Swiss-style sans-serif
- Variable font (300-900 weights)
- Clean geometry with subtle warmth
- Works beautifully at all sizes

**Display/Accent: Space Mono** (Google Fonts - 100% Free)
- Industrial monospace aesthetic
- Strong tech/developer association
- Perfect for labels: `EPOCH:`, `AUC-ROC:`, `STATUS:`
- Signals "ML Engineer who writes production code"

**Implementation:**
```html
<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">

<!-- Fontshare -->
<link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap" rel="stylesheet">
```

```css
:root {
  --font-primary: 'Satoshi', -apple-system, sans-serif;
  --font-display: 'Space Mono', 'Courier New', monospace;
}
```

### Typography Hierarchy (ML-Adapted)
| Element | Font | Weight | Size | Usage |
|---------|------|--------|------|-------|
| Hero | Space Mono | 700 | 15vw | "TREY.ML" |
| Labels | Space Mono | 400 | 12-14px | "EPOCH:", "STATUS:", "AUC:" |
| Section Titles | Satoshi | 700 | 48-64px | "PROJECTS", "ABOUT" |
| Project Names | Satoshi | 700 | 24px | Card titles |
| Body | Satoshi | 400 | 16-18px | Descriptions |
| Metadata | Space Mono | 400 | 12px | Dates, tags, tech specs |

---

## Content Structure & ML Terminology

### Hero Section
Replace generic designer language with ML model card language:

**Original CHRLS:**
```
CHRLS.DSGN
INDEPENDENT DEVELOPER
MADE IN INDONESIA
CAN BE HANDLED BY BOTH MEN AND WOMEN
```

**CHOSEN: Finance×ML Hybrid Version ✅**
```
TREY.ML

HYBRID MODEL: FP&A × Machine Learning
CURRENTLY: Franklin Street Properties
PREVIOUSLY: Origin Construction (AI Engineering)
STACK: Python • React • FastAPI • SHAP

SPECIALIZATION: Production ML with calibrated outputs
DEPLOYED: HuggingFace Spaces, Docker, Vercel
STATUS: ● SERVING | OPEN TO OPPORTUNITIES
```

**Alternative (Pure ML - not selected):**
```
TREY.ML

MODEL: Machine Learning Engineer
VERSION: v2026.1
TRAINED: MIT Data Science | USF Statistics
FRAMEWORK: Python • XGBoost • LightGBM • FastAPI

INPUT: Tabular, Vision, NLP, Time-Series
OUTPUT: Production ML Systems (0.97 AUC typical)
WARNING: May cause unexpectedly accurate forecasts
STATUS: ● ONLINE | SEEKING ML/AI ROLES
```

### Project Cards
Replace "EXPIRED DATE" with ML terminology:

**Original CHRLS:**
```
PROJECT NAME
EXPIREDDATE: 2023
[QR Code] [Braille]
```

**ML Adaptation:**
```
KKBOX CHURN PREDICTION
━━━━━━━━━━━━━━━━━━━━━━━
EPOCH: AUG 2024
AUC-ROC: 0.97
FRAMEWORK: XGBoost + FastAPI
━━━━━━━━━━━━━━━━━━━━━━━
[Barcode] [Braille dots]
```

### Info Box Labels
| CHRLS Term | ML Adaptation |
|------------|---------------|
| "EXPIRED DATE" | "EPOCH:" or "TRAINED:" |
| "COMING SOON" | "IN TRAINING" |
| "ARCHIVE" | "MODEL REGISTRY" |
| "SELECTED CLIENT WORK" | "PRODUCTION MODELS" or "DEPLOYED SYSTEMS" |
| "AVLB: 2025" | "STATUS: SERVING" |

### About Section
Structure as a "Model Card" specification:

```
▌ ABOUT

// SPECIFICATIONS
NAME: Robert "Trey" Lupo
TYPE: ML Engineer | FP&A Analyst
SPECIALIZATION: Tabular, Vision, NLP, Time-Series

// TRAINING DATA
- MIT Professional Certificate in Data Science
- B.A. Statistics, University of South Florida
- Production ML at Origin Construction & Franklin Street

// CURRENT DEPLOYMENT
Corporate Financial Planning Analyst @ Franklin Street Properties
- Authored AI enablement roadmaps for executive leadership
- Building TypeScript dashboards for financial reporting
- Deployed Anthropic's finance skills org-wide

// BENCHMARKS
- 0.97 AUC on KKBOX Churn (strict temporal validation)
- 265-490ms inference on RTX 3070 (computer vision)
- 135 engineered features, SHAP explanations, React dashboards

// CONTACT
Email: treylupo1197@gmail.com
GitHub: robertlupo1997
LinkedIn: linkedin.com/in/robertlupo1997
HuggingFace: robertlupo1997
```

### Featured Projects (from verified repos)

| Project | Category | Key Metric | Card Color |
|---------|----------|------------|------------|
| KKBOX Churn Prediction | ML/Production | 0.97 AUC | Coral (#ff6d1b) |
| Open-Vocab Object Detection | Computer Vision | 265-490ms/img | Cyan (#00f0ff) |
| Amazon Recommendations | Recommender | 100% MIT score | Spring-green (#00ffa3) |
| FoodHub Analysis | Data Analytics | MIT IDSS | Yellow (#dbff00) |
| Shinkansen Travel Exp | Predictive | MIT IDSS | Light-cyan (#d1ecee) |
| Life Expectancy Prediction | Healthcare AI | Regression | Coral (#ff6d1b) |

---

## Decorative Elements Usage

### Barcode SVG
- Use as-is for industrial aesthetic
- Represents "unique identifier" / "model ID"
- Place on project cards and footer

### Braille SVG
- Use as visual texture element
- Represents "encoded information" / "latent features"
- Place on card corners

### Grain Texture
- Apply as fixed overlay (`mix-blend-mode: overlay`, 10-20% opacity)
- Creates analog film aesthetic
- Adds texture to flat surfaces

### Custom Elements to Add
1. **Binary/Hex display:** Show random hex values that cycle
2. **Accuracy meter:** Visual bar showing model performance
3. **Status indicator:** Pulsing dot for "ONLINE" status
4. **Terminal-style cursor:** Blinking underscore in text

---

## Attribution Strategy

### Required Attribution
Per best practices and ethics, include visible credit to CHRLS.DSGN:

**Footer Attribution:**
```
Design inspired by CHRLS.DSGN
chrls.design
```

**Alternative (more prominent):**
```
Portfolio aesthetic adapted from the work of Charles (chrls.design).
Built with respect and attribution.
```

**Implementation:**
- Place in footer, visible but not dominant
- Link to chrls.design opens in new tab
- Optional: Add to About section or a colophon page

### What This Attribution Covers
- Visual design language (layout, typography choices, aesthetic)
- Color palette inspiration
- Industrial/ticket metaphor concept

### What Attribution Doesn't Cover
- Fonts (separate licensing required)
- Specific code implementations
- Your personal content and projects

---

## Differentiation Summary

| Element | CHRLS.DSGN | TREY.ML Portfolio |
|---------|------------|-------------------|
| Brand | CHRLS.DSGN | TREY.ML |
| Tagline | "Independent Developer" | "Machine Learning Engineer" |
| Location | "Made in Indonesia" | "Trained: MIT • Georgia Tech" |
| Project framing | "Expired Date" | "Epoch" / "Trained" |
| Section | "Selected Client Work" | "Production Models" |
| Status | "Coming Soon" | "In Training" |
| Field | Web Design/Dev | ML/Data Science |
| Content | Client work showcase | ML project portfolio |
| Attribution | Original | "Inspired by CHRLS.DSGN" |

---

## Legal Considerations Summary

### Generally Safe (Low Risk)
- Adapting visual layout/structure (not copyrightable as functional elements)
- Using similar color palettes (colors aren't copyrightable)
- Applying similar typography hierarchy
- Taking inspiration from aesthetic direction
- Using proper attribution

### Requires Attention (Medium Risk)
- **Font licensing:** Verify Neue Montreal and NeueBit licenses before production
- **Direct asset usage:** Only use assets you created or have rights to
- **Exact copying:** Don't copy specific creative text, taglines, or unique visual compositions

### Clear Attribution Reduces Risk
- Shows good faith and respect for original creator
- Prevents confusion about authorship
- Standard practice in design community

### Recommendation
Proceed with the design adaptation. The ML terminology, different content, and proper attribution create sufficient differentiation. Consider reaching out to Charles via Twitter/email as a courtesy - designers often appreciate knowing their work inspired others.

---

## Implementation Phases

### Phase 1: Brand Identity Lock
- [ ] Confirm brand name (TREY.ML recommended)
- [ ] Finalize color palette (coral accent kept)
- [ ] Verify font licensing status
- [ ] User provides personal info for hero section

### Phase 2: Content Preparation
- [ ] Write hero section copy (ML model card style)
- [ ] Update project descriptions with ML terminology
- [ ] Prepare about section as "specification sheet"
- [ ] Select/create project images

### Phase 3: Design Implementation
- [ ] Update existing portfolio with new branding
- [ ] Apply ML terminology throughout
- [ ] Add attribution to footer
- [ ] Integrate grain texture and decorative SVGs

### Phase 4: Review & Launch
- [ ] Test on multiple devices
- [ ] Verify all links work
- [ ] Check font rendering
- [ ] Deploy to production

---

## Confirmed Brand Identity

**Brand Name:** TREY.ML ✅

**Full Name:** Robert "Trey" Lupo

**Professional Identity:**
- Current: Corporate Financial Planning Analyst @ Franklin Street Properties
- Previous: AI Engineering Intern @ Origin Construction
- Target: ML Engineering / Data Science / AI Engineering roles

**Tagline Options:**
- "Machine Learning Engineer | Statistics × Finance"
- "ML Engineer & Data Scientist | Building Production ML Systems"
- "FP&A Analyst Building AI-Native Finance | MIT Data Science"

**Education/Credentials:**
- B.A. Statistics, University of South Florida
- MIT Professional Certificate in Data Science
- Georgia Tech (mentioned in materials)

**GitHub:** github.com/robertlupo1997

**Contact:**
- Email: treylupo1197@gmail.com
- GitHub: https://github.com/robertlupo1997
- LinkedIn: https://www.linkedin.com/in/robertlupo1997/
- HuggingFace: huggingface.co/spaces/robertlupo1997

**Photo:** Professional headshot provided (white dress shirt)

---

## Legal Findings & Recommendations

### Summary of Research

**What's Protected (Be Careful):**
1. **Original creative expressions** - Specific taglines, unique copy, distinctive visual compositions
2. **Trademarks** - CHRLS.DSGN brand name, logo, wordmarks
3. **Font licenses** - Neue Montreal and NeueBit require commercial licenses from Pangram Pangram (~$50-150)

**What's NOT Protected (Safe to Use/Adapt):**
1. **Functional code** - HTML structure, CSS layouts, responsive breakpoints
2. **Color values** - Individual colors or palettes are not copyrightable
3. **General aesthetic direction** - Industrial, brutalist, ticket/receipt metaphor concepts
4. **Typography hierarchy patterns** - Size relationships, weight choices, spacing systems
5. **Layout techniques** - Grid systems, component arrangements, animation patterns

### Risk Assessment

| Element | Risk Level | Recommendation |
|---------|------------|----------------|
| Visual layout structure | LOW | Safe to adapt |
| Color palette (coral, etc.) | LOW | Safe to use with attribution |
| Typography hierarchy | LOW | Safe to adapt |
| Grain texture overlay | LOW | Common technique, safe |
| Barcode/braille decorative elements | LOW | Generic industrial elements |
| Specific taglines/copy | MEDIUM | Create original text |
| Fonts (Neue Montreal, NeueBit) | MEDIUM | Purchase license or use alternatives |
| Exact visual clone | HIGH | Avoid - create differentiation |
| Using CHRLS brand name/logo | HIGH | Never do this |

### Font Licensing Decision: FREE ALTERNATIVES ✅

**Decision:** Use 100% free fonts to avoid any licensing ambiguity.

**Final Selection:**
- **Primary:** Satoshi (Fontshare) - Closest match to Neue Montreal, completely free
- **Display:** Space Mono (Google Fonts) - Industrial tech aesthetic, completely free

**Rationale:** Personal portfolios occupy a gray area (promotes you professionally = potentially commercial). Using fonts that are explicitly free for all uses eliminates any risk and provides excellent results.

### Attribution Implementation

Add to footer:
```
Design inspired by CHRLS.DSGN
```

Optional expanded version for About/Colophon:
```
Portfolio aesthetic adapted from the work of Charles (chrls.design).
Built with appreciation and proper attribution.
```

### Best Practice: Courtesy Outreach

Consider sending a brief message to Charles via Twitter (@chrlsdesign) or email:
> "Hey Charles, I'm a ML engineer who was inspired by your portfolio design. I'm building my own portfolio using similar aesthetics with proper attribution. Just wanted to let you know - your work is amazing. Cheers!"

This is optional but demonstrates good faith and often leads to positive connections in the design community.

---

## All Decisions Confirmed ✅

| Item | Decision |
|------|----------|
| **Brand Name** | TREY.ML |
| **Email** | treylupo1197@gmail.com |
| **LinkedIn** | linkedin.com/in/robertlupo1997 |
| **GitHub** | github.com/robertlupo1997 |
| **Photo** | Professional headshot (white dress shirt) |
| **Fonts** | Satoshi (primary) + Space Mono (display) - 100% FREE |
| **Hero Style** | Finance×ML Hybrid Version |
| **Projects** | All public repos (KKBOX, OVOD, Amazon, FoodHub, Shinkansen, Life Expectancy) |
| **Attribution** | Footer: "Design inspired by CHRLS.DSGN" |

---

## References

- Inspiration: [chrls.design](https://chrls.design)
- Downloaded assets: `chrls-download/` folder
- Existing implementation plan: `thoughts/shared/plans/2025-12-19-portfolio-chrls-recreation.md`
- User projects: `rlupo-portfolio/constants.ts`

---

**Plan Created:** January 7, 2026
**Last Updated:** January 7, 2026
**Status:** FINALIZED ✅ - All decisions confirmed
**Next Action:** Ready for implementation
