# treylupo.com — portfolio + Ask My Work

Personal portfolio with an embedded LLM answer engine ("Ask My Work") that answers
questions about my work with citations, grounded in a build-time corpus of my
projects and resume.

## Stack
- React 19 + Vite, GSAP, react-three-fiber (generative project visuals with a
  reduced-motion/context-loss fallback path)
- Vercel serverless: `api/ask.ts` → Claude (Haiku 4.5), 10 req/hr/IP rate limit,
  500-char questions, 1024-token answers, 4 tool rounds max
- Retrieval: build-time corpus (`npm run build:corpus`) from site content, resume,
  and GitHub READMEs — no vector DB, no runtime scraping

## Develop
    npm install
    npm run dev            # :3000
    npm test               # vitest unit suite
    npm run test:e2e       # playwright
    npm run build:corpus   # regenerate generated/corpus.ts
    npm run evals          # answer-quality gate (needs ANTHROPIC_API_KEY), >=90% to pass

## Deploy
Vercel Git integration off `main`; root directory `rlupo-portfolio/`.
Env: `ANTHROPIC_API_KEY` (capped key — without it the ask panel serves a local fallback).
