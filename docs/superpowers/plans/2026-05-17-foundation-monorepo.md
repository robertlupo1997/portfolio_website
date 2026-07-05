# Foundation: Monorepo + Design Tokens + UI Package + Portfolio Shell

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the Turborepo monorepo with pnpm workspaces, create the design-tokens and UI packages, and stand up a bare Next.js 15 portfolio app shell that renders a styled page with the void palette and correct fonts.

**Architecture:** Turborepo monorepo with `apps/` and `packages/` directories. The `design-tokens` package exports typed color/typography/spacing constants and a Tailwind preset. The `ui` package holds shared shadcn/ui components. The `portfolio` app is a Next.js 15 App Router app that consumes both packages. At the end of this plan, the portfolio app renders a styled placeholder page proving the full token pipeline works.

**Tech Stack:** pnpm, Turborepo, Next.js 15 (App Router), Tailwind CSS v4, TypeScript, shadcn/ui

---

## Plan Sequence

This is Plan 1 of 5:
1. **Foundation** (this plan) — monorepo + tokens + UI + portfolio shell
2. **Portfolio Homepage** — all homepage sections + animations + header/nav
3. **Case Studies** — MDX setup + project pages + data layer
4. **Blog App** — separate Next.js app with MDX
5. **Docs + Demos + Deployment** — remaining apps + Vercel setup

---

## File Map

```
treylupo/                              ← NEW repo root (fresh directory)
├── package.json                       ← workspace root, scripts
├── pnpm-workspace.yaml                ← workspace globs
├── turbo.json                         ← pipeline: build, dev, lint, typecheck
├── .gitignore
├── .npmrc                             ← strict pnpm settings
├── CLAUDE.md                          ← copied + updated from current project
├── PRODUCT.md                         ← copied from current project
├── DESIGN.md                          ← copied from current project
│
├── packages/
│   ├── design-tokens/
│   │   ├── package.json               ← @treylupo/design-tokens
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── index.ts               ← barrel export
│   │   │   ├── colors.ts              ← color constants from DESIGN.md
│   │   │   ├── typography.ts          ← font family/size/weight/line-height
│   │   │   ├── spacing.ts             ← spacing scale
│   │   │   ├── animation.ts           ← easing curves, durations
│   │   │   └── tailwind-preset.ts     ← Tailwind preset consuming all tokens
│   │   └── tests/
│   │       └── tokens.test.ts         ← type + value assertions
│   │
│   ├── ui/
│   │   ├── package.json               ← @treylupo/ui
│   │   ├── tsconfig.json
│   │   ├── tailwind.config.ts
│   │   ├── src/
│   │   │   ├── index.ts               ← barrel export
│   │   │   ├── button.tsx
│   │   │   ├── badge.tsx
│   │   │   └── card.tsx
│   │   └── postcss.config.mjs
│   │
│   └── config/
│       ├── package.json               ← @treylupo/config
│       ├── typescript/
│       │   └── base.json              ← shared tsconfig
│       └── eslint/
│           └── base.js                ← shared ESLint config
│
└── apps/
    └── portfolio/
        ├── package.json               ← next, react, tailwindcss, @treylupo/*
        ├── tsconfig.json
        ├── next.config.ts
        ├── tailwind.config.ts         ← extends @treylupo/design-tokens preset
        ├── postcss.config.mjs
        ├── app/
        │   ├── layout.tsx             ← root layout: fonts, metadata, body classes
        │   ├── page.tsx               ← placeholder homepage
        │   └── globals.css            ← Tailwind directives, font-face, grain overlay
        └── public/
            └── fonts/                 ← Satoshi + JetBrains Mono woff2 files
```

---

### Task 1: Initialize Monorepo Root

**Files:**
- Create: `treylupo/package.json`
- Create: `treylupo/pnpm-workspace.yaml`
- Create: `treylupo/turbo.json`
- Create: `treylupo/.gitignore`
- Create: `treylupo/.npmrc`

- [ ] **Step 1: Create project directory and initialize git**

```bash
mkdir -p ~/projects/treylupo && cd ~/projects/treylupo
git init
```

- [ ] **Step 2: Create root package.json**

```json
{
  "name": "treylupo",
  "private": true,
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck",
    "clean": "turbo clean"
  },
  "devDependencies": {
    "turbo": "^2"
  },
  "packageManager": "pnpm@9.15.4"
}
```

- [ ] **Step 3: Create pnpm-workspace.yaml**

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

- [ ] **Step 4: Create turbo.json**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

- [ ] **Step 5: Create .gitignore**

```
node_modules/
.next/
dist/
.turbo/
.vercel/
*.tsbuildinfo
.env
.env.local
.superpowers/
```

- [ ] **Step 6: Create .npmrc**

```
auto-install-peers=true
strict-peer-dependencies=false
```

- [ ] **Step 7: Install turbo and verify**

```bash
pnpm install
pnpm turbo --version
```

Expected: Turbo version prints (e.g., `2.x.x`). `node_modules/` created. `pnpm-lock.yaml` generated.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: initialize turborepo monorepo with pnpm workspaces"
```

---

### Task 2: Create Shared Config Package

**Files:**
- Create: `packages/config/package.json`
- Create: `packages/config/typescript/base.json`
- Create: `packages/config/eslint/base.js`

- [ ] **Step 1: Create config package.json**

```json
{
  "name": "@treylupo/config",
  "private": true,
  "version": "0.0.0"
}
```

- [ ] **Step 2: Create shared TypeScript config**

Create `packages/config/typescript/base.json`:

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "exclude": ["node_modules", "dist", ".next", ".turbo"]
}
```

- [ ] **Step 3: Create shared ESLint config**

Create `packages/config/eslint/base.js`:

```js
/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
  },
  ignorePatterns: ["node_modules/", "dist/", ".next/", ".turbo/"],
};
```

- [ ] **Step 4: Commit**

```bash
git add packages/config/
git commit -m "feat: add shared typescript and eslint config package"
```

---

### Task 3: Create Design Tokens Package

**Files:**
- Create: `packages/design-tokens/package.json`
- Create: `packages/design-tokens/tsconfig.json`
- Create: `packages/design-tokens/src/colors.ts`
- Create: `packages/design-tokens/src/typography.ts`
- Create: `packages/design-tokens/src/spacing.ts`
- Create: `packages/design-tokens/src/animation.ts`
- Create: `packages/design-tokens/src/index.ts`
- Create: `packages/design-tokens/src/tailwind-preset.ts`
- Create: `packages/design-tokens/tests/tokens.test.ts`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@treylupo/design-tokens",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    },
    "./tailwind-preset": {
      "types": "./src/tailwind-preset.ts",
      "default": "./src/tailwind-preset.ts"
    }
  },
  "scripts": {
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "devDependencies": {
    "typescript": "~5.8.2",
    "vitest": "^3"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "extends": "@treylupo/config/typescript/base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*.ts", "tests/**/*.ts"]
}
```

- [ ] **Step 3: Write failing test for color tokens**

Create `packages/design-tokens/tests/tokens.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { colors } from "../src/colors";

describe("color tokens", () => {
  it("exports void as near-black with blue tint", () => {
    expect(colors.void).toBe("oklch(6.5% 0.005 280)");
  });

  it("exports all required color tokens", () => {
    const required = [
      "void",
      "surfaceDeep",
      "surfaceRaised",
      "textBright",
      "textMid",
      "textQuiet",
      "signalBlue",
      "signalBlueHover",
      "borderFaint",
      "borderVisible",
    ] as const;

    for (const key of required) {
      expect(colors[key]).toBeDefined();
      expect(typeof colors[key]).toBe("string");
    }
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

```bash
cd packages/design-tokens && pnpm install && pnpm test
```

Expected: FAIL — `Cannot find module '../src/colors'`

- [ ] **Step 5: Implement color tokens**

Create `packages/design-tokens/src/colors.ts`:

```typescript
export const colors = {
  void: "oklch(6.5% 0.005 280)",
  surfaceDeep: "oklch(10% 0.005 280)",
  surfaceRaised: "oklch(13% 0.005 280)",
  textBright: "oklch(93% 0.005 280)",
  textMid: "oklch(62% 0.015 280)",
  textQuiet: "oklch(42% 0.015 280)",
  signalBlue: "oklch(50% 0.24 264)",
  signalBlueHover: "oklch(44% 0.22 264)",
  borderFaint: "oklch(100% 0 0 / 0.06)",
  borderVisible: "oklch(100% 0 0 / 0.15)",
} as const;

export type ColorToken = keyof typeof colors;
```

- [ ] **Step 6: Run test to verify it passes**

```bash
pnpm test
```

Expected: PASS

- [ ] **Step 7: Implement typography tokens**

Create `packages/design-tokens/src/typography.ts`:

```typescript
export const fontFamily = {
  display: ["Satoshi", "system-ui", "sans-serif"],
  mono: ["JetBrains Mono", "Fira Code", "Consolas", "monospace"],
} as const;

export const fontSize = {
  display: "clamp(3.2rem, 8vw, 8rem)",
  headline: "clamp(1.8rem, 4vw, 3rem)",
  title: "1.05rem",
  body: "0.95rem",
  label: "0.7rem",
} as const;

export const fontWeight = {
  normal: "400",
  medium: "500",
} as const;

export const lineHeight = {
  display: "0.85",
  headline: "0.9",
  title: "1.4",
  body: "1.5",
  label: "1.4",
} as const;

export const letterSpacing = {
  display: "-0.04em",
  headline: "-0.03em",
  title: "0.02em",
  body: "normal",
  label: "0.15em",
} as const;
```

- [ ] **Step 8: Implement spacing tokens**

Create `packages/design-tokens/src/spacing.ts`:

```typescript
export const spacing = {
  xs: "0.5rem",
  sm: "0.75rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
  "3xl": "4rem",
  "4xl": "6rem",
  section: "clamp(5rem, 12vh, 8rem)",
} as const;
```

- [ ] **Step 9: Implement animation tokens**

Create `packages/design-tokens/src/animation.ts`:

```typescript
export const easing = {
  out: "cubic-bezier(0.19, 1, 0.22, 1)",
  inOut: "cubic-bezier(0.77, 0, 0.175, 1)",
} as const;

export const duration = {
  revealFast: "0.4s",
  reveal: "0.6s",
  revealSlow: "0.8s",
  hover: "0.15s",
  press: "0.1s",
} as const;

export const exitDuration = {
  reveal: "0.35s",
  modal: "0.2s",
} as const;

export const stagger = {
  default: "0.06s",
} as const;
```

- [ ] **Step 10: Create barrel export**

Create `packages/design-tokens/src/index.ts`:

```typescript
export { colors, type ColorToken } from "./colors";
export { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing } from "./typography";
export { spacing } from "./spacing";
export { easing, duration, exitDuration, stagger } from "./animation";
```

- [ ] **Step 11: Create Tailwind preset**

Create `packages/design-tokens/src/tailwind-preset.ts`:

```typescript
import type { Config } from "tailwindcss";
import { colors } from "./colors";
import { fontFamily, fontSize, fontWeight } from "./typography";
import { spacing } from "./spacing";
import { easing, duration } from "./animation";

const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        void: colors.void,
        surface: {
          deep: colors.surfaceDeep,
          raised: colors.surfaceRaised,
        },
        text: {
          bright: colors.textBright,
          mid: colors.textMid,
          quiet: colors.textQuiet,
        },
        signal: {
          DEFAULT: colors.signalBlue,
          hover: colors.signalBlueHover,
        },
        border: {
          faint: colors.borderFaint,
          visible: colors.borderVisible,
        },
      },
      fontFamily: {
        display: fontFamily.display as unknown as string[],
        mono: fontFamily.mono as unknown as string[],
      },
      fontSize: {
        display: fontSize.display,
        headline: fontSize.headline,
        title: fontSize.title,
        body: fontSize.body,
        label: fontSize.label,
      },
      fontWeight: {
        normal: fontWeight.normal,
        medium: fontWeight.medium,
        semibold: "600",
      },
      spacing,
      borderRadius: {
        none: "0",
        DEFAULT: "0",
      },
      transitionTimingFunction: {
        out: easing.out,
        "in-out": easing.inOut,
      },
      transitionDuration: {
        hover: duration.hover,
        press: duration.press,
        reveal: duration.reveal,
      },
      maxWidth: {
        prose: "65ch",
      },
    },
  },
};

export default preset;
```

- [ ] **Step 12: Install deps and run all tests**

```bash
cd ~/projects/treylupo && pnpm install && cd packages/design-tokens && pnpm test
```

Expected: All tests PASS.

- [ ] **Step 13: Commit**

```bash
cd ~/projects/treylupo
git add packages/design-tokens/
git commit -m "feat: add design-tokens package with void palette, typography, spacing, and tailwind preset"
```

---

### Task 4: Create UI Package with shadcn/ui

**Files:**
- Create: `packages/ui/package.json`
- Create: `packages/ui/tsconfig.json`
- Create: `packages/ui/tailwind.config.ts`
- Create: `packages/ui/postcss.config.mjs`
- Create: `packages/ui/src/button.tsx`
- Create: `packages/ui/src/badge.tsx`
- Create: `packages/ui/src/card.tsx`
- Create: `packages/ui/src/index.ts`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@treylupo/ui",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    }
  },
  "scripts": {
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "class-variance-authority": "^0.7",
    "clsx": "^2",
    "tailwind-merge": "^3",
    "react": "^19",
    "react-dom": "^19",
    "lucide-react": "^0.561"
  },
  "devDependencies": {
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "tailwindcss": "^4",
    "typescript": "~5.8.2"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "extends": "@treylupo/config/typescript/base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"]
}
```

- [ ] **Step 3: Create tailwind.config.ts**

```typescript
import type { Config } from "tailwindcss";
import preset from "@treylupo/design-tokens/tailwind-preset";

const config: Config = {
  presets: [preset],
  content: ["./src/**/*.{ts,tsx}"],
};

export default config;
```

- [ ] **Step 4: Create postcss.config.mjs**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 5: Create utility function for className merging**

Create `packages/ui/src/cn.ts`:

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 6: Create Button component**

Create `packages/ui/src/button.tsx`:

```tsx
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-mono font-semibold tracking-[0.06em] transition-[background-color,border-color,color,transform] duration-hover ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-void active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-signal text-text-bright hover:bg-signal-hover hover:-translate-y-px",
        outline: "border border-border-faint text-text-mid hover:border-border-visible hover:text-text-bright",
        ghost: "text-text-mid hover:text-text-bright",
      },
      size: {
        default: "px-8 py-3 text-[0.8rem]",
        sm: "px-4 py-2 text-label",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

- [ ] **Step 7: Create Badge component**

Create `packages/ui/src/badge.tsx`:

```tsx
import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./cn";

const badgeVariants = cva(
  "inline-flex items-center font-mono text-[0.65rem] tracking-[0.15em] lowercase",
  {
    variants: {
      variant: {
        default: "border border-border-faint text-text-mid px-3 py-1",
        active: "bg-text-bright text-void px-3 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}

export { Badge, badgeVariants };
```

- [ ] **Step 8: Create Card component**

Create `packages/ui/src/card.tsx`:

```tsx
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "./cn";

// Primitive container only. Project layouts in Plan 2 use CSS Grid with
// varied column spans — do NOT use Card as the sole project-entry wrapper.
const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-surface-deep border border-border-faint p-lg transition-[background-color,border-color] duration-hover ease-out hover:bg-surface-raised hover:border-border-visible",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-sm", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-title font-medium text-text-bright", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-body text-text-mid", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardContent };
```

- [ ] **Step 9: Create barrel export**

Create `packages/ui/src/index.ts`:

```typescript
export { Button, type ButtonProps, buttonVariants } from "./button";
export { Badge, type BadgeProps, badgeVariants } from "./badge";
export { Card, CardHeader, CardTitle, CardContent } from "./card";
export { cn } from "./cn";
```

- [ ] **Step 10: Install deps and typecheck**

```bash
cd ~/projects/treylupo && pnpm install && cd packages/ui && pnpm typecheck
```

Expected: No type errors.

- [ ] **Step 11: Commit**

```bash
cd ~/projects/treylupo
git add packages/ui/
git commit -m "feat: add shared UI package with button, badge, and card components"
```

---

### Task 5: Create Portfolio App Shell

**Files:**
- Create: `apps/portfolio/package.json`
- Create: `apps/portfolio/tsconfig.json`
- Create: `apps/portfolio/next.config.ts`
- Create: `apps/portfolio/tailwind.config.ts`
- Create: `apps/portfolio/postcss.config.mjs`
- Create: `apps/portfolio/app/globals.css`
- Create: `apps/portfolio/app/layout.tsx`
- Create: `apps/portfolio/app/page.tsx`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "@treylupo/portfolio",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "next dev --port 3000",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@treylupo/design-tokens": "workspace:*",
    "@treylupo/ui": "workspace:*",
    "next": "^15",
    "react": "^19",
    "react-dom": "^19"
  },
  "devDependencies": {
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "tailwindcss": "^4",
    "@tailwindcss/postcss": "^4",
    "typescript": "~5.8.2"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "extends": "@treylupo/config/typescript/base.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create next.config.ts**

```typescript
import type { NextConfig } from "next";

const config: NextConfig = {
  transpilePackages: ["@treylupo/ui", "@treylupo/design-tokens"],
};

export default config;
```

- [ ] **Step 4: Create tailwind.config.ts**

```typescript
import type { Config } from "tailwindcss";
import preset from "@treylupo/design-tokens/tailwind-preset";

const config: Config = {
  presets: [preset],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
};

export default config;
```

- [ ] **Step 5: Create postcss.config.mjs**

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

- [ ] **Step 6: Download fonts to public/fonts/**

```bash
mkdir -p apps/portfolio/public/fonts
```

Download Satoshi (from fontshare.com) and JetBrains Mono (from Google Fonts) woff2 files into `apps/portfolio/public/fonts/`. The exact files needed:

- `Satoshi-Variable.woff2`
- `Satoshi-VariableItalic.woff2`
- `JetBrainsMono-Variable.woff2`

Note: If downloading from CDN isn't possible in the execution environment, use next/font/google for JetBrains Mono and next/font/local for Satoshi with a placeholder comment to add the font file later.

- [ ] **Step 7: Create globals.css**

Create `apps/portfolio/app/globals.css`:

```css
@import "tailwindcss";

@font-face {
  font-family: "Satoshi";
  src: url("/fonts/Satoshi-Variable.woff2") format("woff2");
  font-weight: 400 900;
  font-display: swap;
  font-style: normal;
}

@font-face {
  font-family: "Satoshi";
  src: url("/fonts/Satoshi-VariableItalic.woff2") format("woff2");
  font-weight: 400 900;
  font-display: swap;
  font-style: italic;
}

@font-face {
  font-family: "JetBrains Mono";
  src: url("/fonts/JetBrainsMono-Variable.woff2") format("woff2");
  font-weight: 400 700;
  font-display: swap;
  font-style: normal;
}

::selection {
  background-color: rgba(0, 102, 255, 0.3);
  color: #e8e8ee;
}

body {
  background-color: #0a0a0b;
  color: #e8e8ee;
  font-family: "Satoshi", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Grain overlay — paper-like texture at 3% opacity */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
}

/* Gate hover effects behind pointer capability */
@media (hover: hover) and (pointer: fine) {
  :root {
    --hover-capable: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 8: Create root layout**

Create `apps/portfolio/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trey Lupo — FP&A Analyst & AI Engineer",
  description:
    "FP&A analyst who builds production tools with AI. Portfolio showcasing nspb-api, ferroml, ironclad, and more.",
  metadataBase: new URL("https://treylupo.com"),
  openGraph: {
    title: "Trey Lupo — FP&A Analyst & AI Engineer",
    description:
      "FP&A analyst who builds production tools with AI.",
    url: "https://treylupo.com",
    siteName: "Trey Lupo",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-void text-text-bright antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-signal focus:text-text-bright focus:px-4 focus:py-2 focus:font-mono focus:text-label"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 9: Create placeholder homepage**

Create `apps/portfolio/app/page.tsx`:

```tsx
import { Button, Badge, Card, CardHeader, CardTitle, CardContent } from "@treylupo/ui";

export default function HomePage() {
  return (
    <main id="main" className="min-h-[100dvh] px-md py-section">
      <div className="mx-auto max-w-prose">
        <p className="font-mono text-label text-text-quiet tracking-[0.15em] uppercase mb-lg">
          portfolio / foundation test
        </p>

        <h1 className="font-display text-display tracking-[-0.04em] leading-[0.85] mb-2xl">
          Trey Lupo
        </h1>

        <p className="text-body text-text-mid mb-2xl max-w-prose">
          FP&A analyst who builds production tools with AI. This placeholder
          page verifies the design token pipeline works end-to-end.
        </p>

        <div className="flex gap-sm mb-3xl">
          <Badge>python</Badge>
          <Badge>typescript</Badge>
          <Badge>oracle epm</Badge>
          <Badge variant="active">featured</Badge>
        </div>

        <Card className="mb-2xl">
          <CardHeader>
            <CardTitle>nspb-api</CardTitle>
          </CardHeader>
          <CardContent>
            A Python SDK for Oracle EPM Cloud with 200+ API endpoints.
          </CardContent>
        </Card>

        <div className="flex gap-md">
          <Button>View Work</Button>
          <Button variant="outline">GitHub</Button>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 10: Install all deps from root and verify build**

```bash
cd ~/projects/treylupo && pnpm install && pnpm build
```

Expected: All packages build successfully. Next.js generates `.next/` in `apps/portfolio/`.

- [ ] **Step 11: Start dev server and verify in browser**

```bash
cd apps/portfolio && pnpm dev
```

Open `http://localhost:3000`. Verify:
- Background is void (#0A0A0B), not pure black
- "Trey Lupo" renders in Satoshi at display size
- Labels render in JetBrains Mono at 0.7rem
- Badges have square corners and border-faint
- Button is signal blue (#0066FF) with square corners
- Card has surface-deep background with border-faint
- Grain overlay is faintly visible over the background
- Selection highlight is blue-tinted

- [ ] **Step 12: Commit**

```bash
cd ~/projects/treylupo
git add apps/portfolio/
git commit -m "feat: add portfolio app shell with Next.js 15, tailwind, and design token pipeline"
```

---

### Task 6: Copy Project Documentation

**Files:**
- Copy: `CLAUDE.md`, `PRODUCT.md`, `DESIGN.md` from current project

- [ ] **Step 1: Copy docs from current portfolio project**

```bash
cp ~/projects/portfolio_website/PRODUCT.md ~/projects/treylupo/PRODUCT.md
cp ~/projects/portfolio_website/DESIGN.md ~/projects/treylupo/DESIGN.md
```

- [ ] **Step 2: Update CLAUDE.md for the new monorepo structure**

Create a new `CLAUDE.md` at the repo root that reflects the Turborepo monorepo structure, updated tech stack (Next.js 15 replacing Vite), and the new folder layout. Reference the existing CLAUDE.md from the old project for content guidelines and skill documentation, but update all paths and commands.

- [ ] **Step 3: Commit**

```bash
cd ~/projects/treylupo
git add CLAUDE.md PRODUCT.md DESIGN.md
git commit -m "docs: add project documentation (CLAUDE.md, PRODUCT.md, DESIGN.md)"
```

---

### Task 7: Verify End-to-End Pipeline

This is a manual verification task — no new files.

- [ ] **Step 1: Run full build from root**

```bash
cd ~/projects/treylupo && pnpm build
```

Expected: All packages and apps build without errors. Turborepo shows the dependency graph being respected (design-tokens → ui → portfolio).

- [ ] **Step 2: Run typecheck across all packages**

```bash
pnpm typecheck
```

Expected: No TypeScript errors in any package.

- [ ] **Step 3: Run design-tokens tests**

```bash
cd packages/design-tokens && pnpm test
```

Expected: All tests pass.

- [ ] **Step 4: Start portfolio dev server and verify visually**

```bash
cd ~/projects/treylupo && pnpm dev --filter=@treylupo/portfolio
```

Open `http://localhost:3000` and verify the checklist from Task 5 Step 11.

- [ ] **Step 5: Final commit with passing verification**

```bash
cd ~/projects/treylupo
git log --oneline
```

Expected: Clean commit history:
1. `feat: initialize turborepo monorepo with pnpm workspaces`
2. `feat: add shared typescript and eslint config package`
3. `feat: add design-tokens package with void palette, typography, spacing, and tailwind preset`
4. `feat: add shared UI package with button, badge, and card components`
5. `feat: add portfolio app shell with Next.js 15, tailwind, and design token pipeline`
6. `docs: add project documentation (CLAUDE.md, PRODUCT.md, DESIGN.md)`
