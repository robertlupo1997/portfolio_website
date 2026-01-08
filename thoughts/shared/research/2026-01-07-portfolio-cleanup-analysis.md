# Research: Portfolio Codebase Cleanup Analysis

**Date**: 2026-01-07
**Branch**: master

## Research Question
Analyze rlupo-portfolio directory for cleanup opportunities - unused files, dead code, unnecessary dependencies, files that can be removed, and general housekeeping improvements.

## Summary

The rlupo-portfolio codebase has several cleanup opportunities including **2 orphaned components**, **4 unused exports**, **9+ unused object properties**, **1 missing file reference**, and **duplicate logic** that could be consolidated. All npm dependencies are actively used.

## Detailed Findings

### Orphaned Components (Safe to Delete)

| File | Lines | Status | Notes |
|------|-------|--------|-------|
| `components/TickerTape.tsx` | 33 | UNUSED | Never imported anywhere. App uses CHRLS marquee CSS instead |
| `components/Barcode.tsx` | 25 | UNUSED | Never imported. App uses `assets/barcode.svg` static asset |

### Unused Type/Constant Exports

| File | Export | Line | Status |
|------|--------|------|--------|
| `types.ts` | `NavItem` interface | 15-18 | Never imported |
| `types.ts` | `CARD_COLORS` constant | 20-26 | Never imported |
| `constants.ts` | `GITHUB_USERNAME` | 3 | Never imported |

### Unused Object Properties

**PERSONAL_INFO** (`constants.ts:5-16`) - 6 unused properties:
- `name` (line 6)
- `brand` (line 7)
- `currentRole` (line 12)
- `currentCompany` (line 13)
- `previousRole` (line 14)
- `previousCompany` (line 15)

**Project interface** (`types.ts:1-13`) - 3 unused properties:
- `description` (line 5) - defined in all projects but never rendered
- `tags` (line 6) - defined in all projects but never rendered
- `language` (line 11) - defined in all projects but never rendered

**ProjectCard** (`components/ProjectCard.tsx:5-8`) - 1 unused prop:
- `index` parameter received but not used in rendering

### Missing File Reference

| Location | Reference | Issue |
|----------|-----------|-------|
| `index.html:793` | `/index.css` | File does not exist |

### Unused Environment Configuration

| File | Variable | Issue |
|------|----------|-------|
| `.env.local` | `GEMINI_API_KEY` | Defined in vite.config.ts but never consumed in application code |
| `vite.config.ts:14-15` | `process.env.GEMINI_API_KEY` | Exposed but no Gemini integration exists |

### Duplicate Logic

**Time formatting** duplicated in two files with different implementations:

**Header.tsx:9-17** (24-hour EST format):
```tsx
const updateTime = () => {
  const now = new Date();
  setCurrentTime(now.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit',
    hour12: false, timeZone: 'America/New_York'
  }));
};
```

**Hero.tsx:7-14** (12-hour am/pm format):
```tsx
const updateTime = () => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12;
  setTime(`${hours}:${minutes} ${ampm}`);
};
```

### Files That ARE Used (No Action Needed)

All npm dependencies are actively used:
- `react` - 10 component files
- `react-dom` - entry point (index.tsx)
- `lucide-react` - DemoModal.tsx, Header.tsx
- `@types/node` - vite.config.ts, tsconfig.json
- `@vitejs/plugin-react` - vite.config.ts
- `typescript` - all .tsx files
- `vite` - build system

## Code References

### Files Safe to Delete
- `rlupo-portfolio/components/TickerTape.tsx` - 33 lines, orphaned component
- `rlupo-portfolio/components/Barcode.tsx` - 25 lines, orphaned component

### Code to Remove from types.ts
- Lines 15-18: `NavItem` interface
- Lines 20-26: `CARD_COLORS` constant

### Code to Remove from constants.ts
- Line 3: `GITHUB_USERNAME` export

### Properties to Consider Removing

**From PERSONAL_INFO** (constants.ts:5-16):
```tsx
// These 6 properties are never used:
name: "Robert 'Trey' Lupo",
brand: "TREY.ML",
currentRole: "Corporate FP&A Analyst",
currentCompany: "Franklin Street Properties",
previousRole: "AI Engineering Intern",
previousCompany: "Origin Construction",
```

**From Project interface** (types.ts:1-13):
```tsx
// These 3 properties are defined in all projects but never rendered:
description: string;
tags: string[];
language: string;
```

### Line to Remove from index.html
- Line 793: `<link rel="stylesheet" href="/index.css">` - file doesn't exist

## Cleanup Summary

| Category | Items | Impact |
|----------|-------|--------|
| Files to delete | 2 | -58 lines |
| Exports to remove | 3 | -15 lines |
| Properties to remove | 9+ | -20 lines |
| Missing file reference | 1 | Fix broken link |
| Duplicate logic | 1 | Could consolidate to utility |

**Total potential reduction**: ~93 lines of dead code

## Open Questions

1. Should the unused Project properties (description, tags, language) be removed from both the interface AND the PROJECTS data, or kept for potential future use?
2. Should time formatting be consolidated into a shared utility function?
3. Should .env.local and Gemini API references be removed entirely if no AI features are planned?
