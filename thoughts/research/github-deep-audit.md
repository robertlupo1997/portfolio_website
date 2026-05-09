# GitHub Profile Deep Audit — robertlupo1997
**Date:** 2026-05-09

---

## Executive Summary

The profile has real signal — ferroml, kkbox-churn-prediction, and hierarchical-revenue-forecast are legitimately impressive. But a hiring manager landing on the profile today would see three archived bootcamp projects pinned at the top, no website URL, a stale bio, and no README on the portfolio site. The cleanup went deep enough to archive the junk — it did not go deep enough to make the good work *visible*. Below is everything that needs to change, in priority order.

---

## 1. Critical Issues — Fix These First

### 1a. Pinned Repos Are Actively Harmful

**This is the single biggest problem on the profile.**

The four currently pinned repos:
- `kkbox-churn-prediction` — appropriate
- `Amazon-Product-Recommendation-System` — **archived, no description**
- `ExtraaLearn-ML-Project` — **archived, no description**
- `FoodHub-Data-Analysis` — **archived**, description says "fictional company"

Pinned repos are the *first thing* a recruiter sees. Three of the four are bootcamp work with no descriptions. Two of the six pin slots are unused. This needs to be fixed before anything else.

**Fix:** Unpin all four. Set these 6 pins (see Section 5 for rationale):
1. `ferroml`
2. `kkbox-churn-prediction`
3. `hierarchical-revenue-forecast`
4. `portfolio_website` (after adding README)
5. `mlforge`
6. `open-vocabulary-object-detection`

### 1b. Six Public Archived Repos Still Show in the Repositories Tab

Archiving does NOT hide repos from visitors. They still appear in the repo list under the "Repositories" tab, just with an "Archived" badge. A recruiter scrolling through sees them.

Repos to make **private** (not just archived):
- `FoodHub-Data-Analysis` — bootcamp EDA on fictional data
- `ExtraaLearn-ML-Project` — no description, no value signal
- `Amazon-Product-Recommendation-System` — no description
- `origin-recreated-projects` — unclear name, no description
- `Shinkansen-Travel-Experience-Prediction-Hackathon` — hackathon, no description
- `LifeExpectancyPrediction` — early portfolio, stale

**Action:** Go to Settings > Danger Zone > Change visibility > Private for each.

### 1c. Blog URL Is Missing

`websiteUrl` in the GitHub API returns `null`. The profile shows no website link.

**Fix:** Go to github.com/robertlupo1997 > Edit profile > Website → set to `https://treylupo.com`

While there, also check: the Connect section of the profile README links only to LinkedIn. Add a website link.

---

## 2. Profile Metadata Issues

### 2a. Bio Undersells Current Work

Current bio: `"FP&A Analyst @ Franklin Street | Python, SQL, React | Building dashboards and automating financial reports"`

Problems:
- "Building dashboards and automating financial reports" describes a junior analyst, not someone who built a Rust AutoML framework and autonomous ML research tooling
- No mention of Rust, machine learning, or AutoML
- No mention of the Claude Code plugin ecosystem work

Suggested bio (140 chars max for display):
```
FP&A @ Franklin Street | Building FerroML — statistically rigorous AutoML in Rust | USF Statistics '24
```

Or shorter:
```
FP&A analyst + ML engineer. Rust AutoML (FerroML), churn prediction, autonomous ML research. USF Statistics '24.
```

### 2b. Name Inconsistency — Decision Required

GitHub profile name: `Robert Lupo`
Portfolio site and user context: `Trey Lupo`

This is a personal decision, but inconsistency creates friction. Recruiters who find "Trey Lupo" on LinkedIn or treylupo.com then land on GitHub and see "Robert Lupo" may not immediately connect the two profiles. Pick one and make it consistent across all platforms.

### 2c. No Twitter / Social Links Set

`twitter_username` is null. `socialAccounts` array is empty. GitHub supports LinkedIn social links as of 2023.

**Fix:** In Edit Profile > Social accounts, add LinkedIn URL.

### 2d. Account Created April 2024

The account is relatively new (14 months old), which means the contribution graph looks sparse compared to multi-year accounts. The fix is continuous commits to public repos. Nothing to do here except keep shipping.

---

## 3. Repository-Level Issues

### 3a. `portfolio_website` — No README (404)

The portfolio website repo — the one a recruiter is most likely to click — has no README. The API returns a 404. The repo root contains: `.gitignore`, `CLAUDE.md`, `rlupo-portfolio/`, `thoughts/`.

This is bad for two reasons:
1. A visitor sees a blank README pane on the repo page
2. The `CLAUDE.md` file is visible to anyone who opens the file browser — it's an internal AI instruction file that doesn't belong in a public repo

**Fix:**
- Add `README.md` explaining what the site is, the tech stack (React 19, GSAP, WebGL), and link to treylupo.com
- Add `CLAUDE.md` to `.gitignore` or move it outside the repo root if it contains prompts

Also: the `homepageUrl` is set to `https://portfolio-website-tau-seven-76.vercel.app` (a Vercel preview URL, not the final domain). Update this to `https://treylupo.com` via: repo Settings > General > Website field.

### 3b. `ironclad` — README Is a Product Spec, Not Code Documentation

The ironclad README is 250+ lines of business case: market opportunity, competitive landscape, MVP phases, tech stack decisions, training data sources. The `src/` directory does have code (`plan_reader/`, `cost_engine/`, `confidence/`), but the README reads like a pitch deck for a product that hasn't shipped, not documentation of implemented software.

Problems for a recruiter:
- No "what works today" vs "planned" distinction
- No installation instructions that actually work
- No demo output or screenshots
- "$273B/year opportunity" and "Phase 1-4 roadmap" language signals unfinished work

**Options:**
- Make it private until it has running code (recommended)
- Add a clear "Current Status" banner at the top: "Phase 1 in progress — plan reader pipeline implemented, cost engine in development"
- Rewrite the README to lead with what's working

### 3c. `hierarchical-revenue-forecast` — Primary Language Shows as HTML

GitHub detects the primary language as **HTML** despite being a Python/Go/TypeScript project. This happens when generated HTML files (likely from notebooks or build artifacts) dominate the byte count.

This looks bad — a recruiter sees "HTML" and may underestimate the project.

**Fix:** Add a `.gitattributes` file to the repo root:
```
*.html linguist-generated=true
*.html linguist-vendored=true
docs/** linguist-documentation=true
```

### 3d. `ferroml` — No Demo Screenshots or GIF

The README is 427 lines and technically thorough (CI badge, PyPI badge, benchmarks vs scikit-learn, API docs). However, it has no visual demo — no screenshot, no output example, no GIF. The kkbox and hierarchical-revenue-forecast repos both have dashboard GIFs. FerroML is the flagship project and gets no visual.

**Fix:** Add a terminal GIF or code output screenshot showing FerroML running a fit + predict with confidence intervals in the README. This is the highest-value README improvement.

### 3e. `open-vocabulary-object-detection` — README Has No Actual Demo Output

The README mentions a Streamlit demo and a notebook (`OVOD_Explainer_TLDR.ipynb`) but shows no actual detection output images. The repo has a strong CI badge setup (smoke test) and COCO evaluation, but a recruiter can't see what the system actually does without running it.

**Fix:** Add 1-2 example images showing text prompt → detection boxes → segmentation mask. Even static images are better than none.

### 3f. `mlforge` vs `gsd-ml` — Redundancy Creates Confusion

The gsd-ml README says: "gsd-ml replaces mlforge's subprocess-spawning CLI with native Claude Code execution." So one supersedes the other. But both are public, unpinned, and neither README cross-links clearly.

A recruiter seeing both may not understand the relationship. mlforge's README doesn't mention it's been superseded.

**Fix:** Add a notice to the mlforge README: "Superseded by gsd-ml for Claude Code native usage. mlforge is kept for reference — see gsd-ml for the current version."

### 3g. `ferroml-plugin` — Claude Code Niche May Not Resonate With Traditional Recruiters

The ferroml-plugin README is clean and professional. The issue is audience: "Claude Code plugin" means nothing to most FP&A or data science hiring managers. It's a meaningful signal to technical hiring managers at AI-forward companies.

For the profile, this is less important to pin than ferroml or the data projects — unless explicitly targeting AI tooling roles.

---

## 4. Profile README Assessment

The profile README (`robertlupo1997/robertlupo1997`) is genuinely good. Key strengths:
- Clean, scannable table format for featured projects
- Includes concrete numbers (0.97 AUC, 0.48 RMSLE, sub-10ms inference)
- No gimmicks (no snake animation, no typing effects, no "I love coffee" jokes)
- Tech stack badges are accurate and comprehensive

Issues to fix:

**A. "MIT Data Science" is ambiguous.** The README says "USF Statistics '24 | MIT Data Science" — this likely refers to a certificate program (MicroMasters or similar), not a degree. Recruiters may read it as an MIT degree if they skim. Be explicit: "MIT MicroMasters in Data Science" or similar, to avoid the appearance of misrepresentation.

**B. No website link in the Connect section.** The Connect section has only LinkedIn. Should include a link to treylupo.com. Template:
```md
[![Website](https://img.shields.io/badge/treylupo.com-000000?style=flat&logo=About.me&logoColor=white)](https://treylupo.com)
```

**C. Profile README doesn't link to ferroml.** The "Currently Building" section mentions ferroml but doesn't have a repo link — `**ferroml**` is bold text, not a hyperlink. Add the link.

**D. The Featured Projects table only has 3 rows.** Consider adding ferroml as a 4th row once it has a more concrete "key numbers" metric (benchmark vs sklearn timing, number of algorithms, test coverage, etc.)

---

## 5. Pinned Repos Recommendation

GitHub allows 6 pinned repos. A hiring manager in FP&A / data science / ML sees these first and judges the entire profile by them.

### Recommended 6 (in order):

| Pin | Repo | Why |
|-----|------|-----|
| 1 | `ferroml` | Flagship technical project. Rust + Python, 55 algorithms, 6,500+ tests, PyPI published, statistical rigor angle. Shows depth. |
| 2 | `kkbox-churn-prediction` | Strongest end-to-end portfolio piece. 0.97 AUC, live Hugging Face demo, dashboard GIF, full-stack (React + FastAPI + SHAP). |
| 3 | `hierarchical-revenue-forecast` | Most FP&A-relevant project. Revenue forecasting, polyglot architecture, SHAP explainability. Shows what the day job cares about. |
| 4 | `portfolio_website` | Personal brand anchoring. Gets a README first (see 3a). Links to treylupo.com. Shows TypeScript/React capability. |
| 5 | `mlforge` | Autonomous ML research. Large README, wide scope, shows systems thinking. Good breadth signal. |
| 6 | `open-vocabulary-object-detection` | Computer vision breadth. CI badges, COCO eval, RTX 3070 benchmarks. Shows range beyond FP&A/forecasting. |

### Not pinned (and why):

- `ironclad` — reads like a spec, not shipped software. Pinning it invites skepticism.
- `ferroml-plugin` — too niche (Claude Code ecosystem), secondary to ferroml itself.
- `gsd-ml` — similarly niche, secondary to mlforge which has broader appeal.

---

## 6. Prioritized Action List

### Immediate (5 minutes each):

1. **Unpin Amazon-Product-Recommendation-System, ExtraaLearn-ML-Project, FoodHub-Data-Analysis** and set the 6 pins listed above (portfolio_website can wait until README is added, but pin the others now)
2. **Set blog/website URL to `https://treylupo.com`** in Edit Profile
3. **Update bio** to reflect ML engineering and Rust work, not "building dashboards"
4. **Make 6 public archived repos private** (list in 1b above)

### Short-term (1-2 hours):

5. **Add README to `portfolio_website`** — basic description, tech stack, link to live site
6. **Remove or gitignore `CLAUDE.md`** in portfolio_website (internal AI instruction file shouldn't be public)
7. **Fix `hierarchical-revenue-forecast` `.gitattributes`** to show Python as primary language
8. **Add website badge to profile README** Connect section
9. **Hyperlink ferroml** in profile README "Currently Building" section
10. **Clarify "MIT Data Science"** credential type in profile README

### Medium-term (a few hours):

11. **Add terminal GIF or output screenshot to ferroml README** — the flagship project deserves a visual
12. **Add example detection images to open-vocabulary-object-detection** README
13. **Add "superseded by gsd-ml" notice to mlforge README**
14. **Rewrite ironclad README** to clearly separate "implemented" from "planned" — or make it private
15. **Add LinkedIn social link** in GitHub Edit Profile > Social accounts

---

## 7. What a Recruiter Sees Today vs After Fixes

### Today:
- Lands on profile → sees 3 archived bootcamp repos pinned with no descriptions
- Clicks "Repositories" → sees 6 more archived bootcamp/dead repos
- No website link visible on profile
- Bio says "building dashboards" (undersells everything)
- Profile README is good but has dead link for ferroml, no website badge, ambiguous MIT credential

### After all fixes:
- Lands on profile → sees ferroml (Rust AutoML, PyPI, 6,500 tests), kkbox (0.97 AUC, live demo), hierarchical forecasting, portfolio site
- Bio immediately signals ML engineering and statistics background
- Website link goes to treylupo.com
- Repositories tab shows only the 8 public repos that demonstrate real work
- Profile README connects everything with concrete numbers and links

The underlying work is strong. The presentation is the gap.
