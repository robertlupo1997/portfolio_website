# P1 Finish-Line: Deploy treylupo.com + Resume v3 + Live Evals — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Take the merged portfolio (`main` @ 771043b) live on Trey's domain with a capped Anthropic key, resume v3, a real README, and evals passing — done bar from the career design spec (Ornith repo `docs/superpowers/specs/2026-07-04-career-direction-design.md`), deadline **Jul 11**.

**Architecture:** No new features. Content updates (resume v3, README), corpus regen + eval gate, then Trey's manual Vercel/key/DNS steps, then live verification. Code tasks land on `main` first so Vercel's Git integration picks them up in the first deploy.

**Tech Stack:** React 19 + Vite, Vercel serverless (`api/ask.ts`), Playwright print-to-PDF (`scripts/resume-to-pdf.mts`), tsx scripts.

## Global Constraints

- App root is `rlupo-portfolio/` — all paths below are relative to it unless prefixed with `../`.
- Employer name on the resume is exactly **"Franklin Street"** — never "Franklin Street Properties" (2026-07-02 research).
- Resume facts must be true and verifiable: no invented metrics. New bullets use only facts Trey stated 2026-07-04.
- The Ask engine model stays `claude-haiku-4-5-20251001` (`lib/ask/engine.ts:5`); rate limit stays 10/hr/IP; do not raise caps.
- Gates before any push to main: `npm test` (40/40), `npx tsc --noEmit`, `npm run build`, `npm run test:e2e` (11/11).
- Commit or push only to `main` in this repo (already the working branch for these content tasks).

---

### Task 1: Resume v3 (source HTML + text corpus copy + PDF)

**Files:**
- Modify: `../thoughts/resume/resume-final.html` (the print source)
- Modify: `content/resume.txt` (corpus ingest copy — keep in sync)
- Regenerate: `public/resume.pdf` (via script; committed binary)

**Interfaces:**
- Consumes: existing v2 resume content (verified facts: FerroML on PyPI, 6,500+ tests, 0.97 AUC, "Franklin Street").
- Produces: v3 PDF at `public/resume.pdf`, served at `/resume.pdf` — Task 3 regenerates the corpus from `content/resume.txt`, Task 5 verifies the live URL.

- [ ] **Step 1: Add the two new Franklin Street bullets to the source HTML**

In `../thoughts/resume/resume-final.html`, locate the Franklin Street experience `<ul>` and add (keeping existing bullets):

```html
<li>Built an AI-integrated month-end reporting app (Python + React) enabling finance staff to query financials in natural language</li>
<li>Integrated NetSuite with Claude via MCP connectors for corporate finance workflows</li>
```

- [ ] **Step 2: Ensure the Projects section carries the trio**

Verify the Projects section lists: FerroML (PyPI link), Ask My Work / treylupo.com (live link), and Ornith orchestration (GitHub link — use `github.com/robertlupo1997` until the P2 public repo exists, then update in P2's final task). Add any missing entry using the same markup pattern as the existing project entries.

- [ ] **Step 3: Mirror the same changes in `content/resume.txt`**

Add the two bullets (plain text, same wording) under the Franklin Street section, and the trio under Projects. This file feeds `scripts/build-corpus.mts:18` — if it drifts from the PDF, Ask My Work answers contradict the resume.

- [ ] **Step 4: Regenerate the PDF**

Run: `npx tsx scripts/resume-to-pdf.mts`
Expected: exits 0; `public/resume.pdf` mtime is now.

- [ ] **Step 5: Verify the PDF contains the new content**

Run: `pdftotext public/resume.pdf - | grep -c "NetSuite"`
Expected: `1` (or more). If `pdftotext` is unavailable: `python3 -c "import zlib,sys; d=open('public/resume.pdf','rb').read(); print(b'NetSuite' in d or 'check manually')"` and open the PDF.

- [ ] **Step 6: Commit**

```bash
git add ../thoughts/resume/resume-final.html content/resume.txt public/resume.pdf
git commit -m "content: resume v3 — month-end AI reporting app + NetSuite MCP bullets, trio in projects"
```

### Task 2: Replace the stale scaffold README

**Files:**
- Modify: `README.md` (currently the AI-Studio scaffold referencing `GEMINI_API_KEY` — wrong and public)

**Interfaces:**
- Consumes: nothing.
- Produces: a README employers can read; Task 5's reviewer checks it renders on GitHub.

- [ ] **Step 1: Write the new README**

Replace `README.md` entirely with (adjust the live URL once DNS is set):

```markdown
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
```

- [ ] **Step 2: Verify no scaffold remnants**

Run: `grep -ri "gemini\|ai studio" README.md; echo "exit=$?"`
Expected: `exit=1` (no matches).

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: real README — replaces stale AI Studio scaffold"
```

### Task 3: Corpus regen + eval gate

**Files:**
- Regenerate: `generated/corpus.ts`

**Interfaces:**
- Consumes: Task 1's `content/resume.txt`.
- Produces: corpus the deployed engine ships with; eval PASS is the quality gate.

- [ ] **Step 1: Regenerate the corpus**

Run: `npm run build:corpus`
Expected: exits 0; `git diff --stat generated/corpus.ts` shows changes (resume chunks updated).

- [ ] **Step 2: Run the full local gates**

Run: `npm test && npx tsc --noEmit && npm run build`
Expected: 40/40 pass, tsc silent, build succeeds.

- [ ] **Step 3: Run evals (real Claude calls, needs the key)**

Run: `ANTHROPIC_API_KEY=<Trey's key> npm run evals`
Expected: final line `passed/total` ≥ 90%, exit 0. If a question fails on resume-v3 content drift, fix `content/resume.txt` wording (not the eval) and re-run from Step 1.

- [ ] **Step 4: Commit and push**

```bash
git add generated/corpus.ts
git commit -m "content: corpus regen for resume v3"
git push origin main
```

### Task 4: Vercel + key + domain (TREY — manual, browser)

**Files:** none (Vercel dashboard + registrar + Anthropic console).

**Interfaces:**
- Consumes: `main` pushed (Task 3).
- Produces: live site; Task 5 verifies it.

- [ ] **Step 1 (Trey):** vercel.com/new → import `robertlupo1997/portfolio_website` → **Root Directory: `rlupo-portfolio`** → deploy. Site is live on `<project>.vercel.app` immediately (ask panel in fallback mode).
- [ ] **Step 2 (Trey):** console.anthropic.com → new workspace with **monthly spend cap** ($5–10) → create API key in that workspace → Vercel → Settings → Environment Variables → `ANTHROPIC_API_KEY` (Production) → redeploy.
- [ ] **Step 3 (Trey):** Vercel → Domains → add `treylupo.com` → apply the DNS records it shows at the registrar. Wait for cert issuance.

### Task 5: Live verification

**Files:**
- Modify: `.superpowers/sdd/progress.md` (append the go-live ledger entry)

**Interfaces:**
- Consumes: Task 4 complete (Trey confirms).
- Produces: recorded evidence the P1 done bar is met.

- [ ] **Step 1: Site + resume live**

Run: `curl -s -o /dev/null -w "%{http_code}\n" https://treylupo.com/ https://treylupo.com/resume.pdf`
Expected: `200` twice. (Second one closes the old resume-404 complaint.)

- [ ] **Step 2: Ask endpoint answers with citations (not fallback)**

Run: `curl -s -X POST https://treylupo.com/api/ask -H 'Content-Type: application/json' -d '{"question":"What is FerroML?"}' | head -c 400`
Expected: JSON containing an answer mentioning Rust/AutoML and a citations field; NOT `{"fallback":true}`.

- [ ] **Step 3: Rate limit enforces**

Run the Step-2 curl 11 times in a loop; expect HTTP 429 (or the JSON rate-limit error) on the 11th.

- [ ] **Step 4: Ledger + commit**

Append to `.superpowers/sdd/progress.md`: date, deploy URL, eval score, the three verification results. Then:

```bash
git add .superpowers/sdd/progress.md
git commit -m "docs(ledger): P1 live — deploy verified, evals ≥90%, resume v3 served"
git push origin main
```

## Self-Review Notes

- Spec coverage: P1 done bar = live on domain ✔ (T4/T5), capped key ✔ (T4), `/resume.pdf` v3 ✔ (T1/T5), evals run ✔ (T3). Resume-v3 spec deadline (Jul 18) is met early inside P1.
- No placeholders; all commands concrete. Task 4 is intentionally manual (Trey's accounts).
- Type consistency: n/a (content-only changes).
