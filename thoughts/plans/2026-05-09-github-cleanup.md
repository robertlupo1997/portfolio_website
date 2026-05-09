# GitHub Repo Cleanup — Implementation Plan

## Overview
Clean up robertlupo1997's GitHub from 34 scattered repos to a focused, professional profile that highlights real engineering work. Archive dead experiments, make best work public, and update descriptions/topics for discoverability.

## Current State
- 34 repos total (14 public, 20 private)
- Best work (nspb-api, ironclad, ledge) is private
- Academic exercises are public and on the portfolio
- No consistent descriptions, topics, or README quality
- Profile README exists but likely outdated

## Desired End State
- 7-8 high-quality public repos with polished READMEs and topics
- Dead/experimental repos archived (hidden from profile)
- Work repos stay private
- Profile README updated to reflect current focus
- Portfolio website shows only the best public repos

## What We're NOT Doing
- Deleting any repos (archive only — reversible)
- Rewriting READMEs from scratch (just descriptions + topics for now)
- Moving code between repos

---

## Phase 1: Archive Dead Repos

### Overview
Archive repos that are experiments, abandoned, or not portfolio-worthy. Archiving hides them from the profile but preserves the code.

### Changes Required:

Archive these 15 repos via GitHub CLI:
```bash
# Academic exercises (currently on portfolio but shouldn't be)
gh repo archive robertlupo1997/FoodHub-Data-Analysis --yes
gh repo archive robertlupo1997/Amazon-Product-Recommendation-System --yes
gh repo archive robertlupo1997/ExtraaLearn-ML-Project --yes
gh repo archive robertlupo1997/Shinkansen-Travel-Experience-Prediction-Hackathon --yes
gh repo archive robertlupo1997/LifeExpectancyPrediction --yes

# Dead/abandoned projects
gh repo archive robertlupo1997/origin-recreated-projects --yes
gh repo archive robertlupo1997/Assistant_PM_Agent --yes
gh repo archive robertlupo1997/apm-agent --yes
gh repo archive robertlupo1997/construction-ai-agent --yes
gh repo archive robertlupo1997/procore-data-intelligence --yes
gh repo archive robertlupo1997/procore-mcp-authorization-code-grant-flow --yes
gh repo archive robertlupo1997/procore-excel-automation --yes
gh repo archive robertlupo1997/AI-studio-franklin-street-dashboard --yes
gh repo archive robertlupo1997/Tremor-franklin-street-dashboard --yes
gh repo archive robertlupo1997/BuildSync --yes
```

### Success Criteria:

#### Automated Verification:
- [ ] All 15 repos show as archived: `gh repo list robertlupo1997 --limit 50 --json name,isArchived --jq '.[] | select(.isArchived) | .name'`
- [ ] Archived repos no longer appear on profile page

#### Manual Verification:
- [ ] Visit github.com/robertlupo1997 — archived repos should not show prominently

**Pause for confirmation before Phase 2.**

---

## Phase 2: Make Best Work Public

### Overview
Make the user's strongest projects publicly visible. These are the repos that demonstrate real engineering skill.

### Changes Required:

```bash
# Make flagship projects public
gh repo edit robertlupo1997/nspb-api --visibility public
gh repo edit robertlupo1997/ironclad --visibility public
gh repo edit robertlupo1997/portfolio_website --visibility public
```

**Note:** Before making repos public, verify they contain no secrets:
```bash
# For each repo, check for sensitive files
gh api repos/robertlupo1997/nspb-api/git/trees/main?recursive=1 --jq '.tree[].path' | grep -iE '\.env|secret|credential|config\.env|\.pem|\.key'
```

### Decision needed from user:
- `ledge` (CFO agent) — make public? It's strong work but may contain proprietary Franklin Street logic
- `nspb-api` — confirm no Oracle API credentials are committed

### Success Criteria:

#### Automated Verification:
- [ ] nspb-api is public: `gh repo view robertlupo1997/nspb-api --json visibility`
- [ ] ironclad is public: `gh repo view robertlupo1997/ironclad --json visibility`
- [ ] portfolio_website is public: `gh repo view robertlupo1997/portfolio_website --json visibility`
- [ ] No .env or credential files in public repos

#### Manual Verification:
- [ ] Visit each repo logged out to confirm content looks good
- [ ] No sensitive data visible in commit history

**Pause for confirmation before Phase 3.**

---

## Phase 3: Update Descriptions and Topics

### Overview
Add professional descriptions and discoverable topics to all public repos.

### Changes Required:

```bash
# Flagship projects
gh repo edit robertlupo1997/nspb-api --description "Python SDK for Oracle EPM Cloud (NSPB) — 60+ REST API endpoints covering Planning, Migration, and Data Management. Built for FP&A automation."
gh repo edit robertlupo1997/nspb-api --add-topic python --add-topic oracle --add-topic epm --add-topic sdk --add-topic rest-api --add-topic finance --add-topic automation

gh repo edit robertlupo1997/ironclad --description "Construction cost estimation with statistical confidence intervals. ML pipeline for bid analysis and cost prediction."
gh repo edit robertlupo1997/ironclad --add-topic python --add-topic machine-learning --add-topic construction --add-topic cost-estimation --add-topic statistics

gh repo edit robertlupo1997/ferroml --description "Statistically rigorous AutoML framework in Rust with Python bindings. Hypothesis-driven model selection with proper statistical testing."
gh repo edit robertlupo1997/ferroml --add-topic rust --add-topic python --add-topic automl --add-topic machine-learning --add-topic statistics

gh repo edit robertlupo1997/hierarchical-revenue-forecast --description "Production-grade multi-LOB revenue forecasting with hierarchical time series, SHAP explainability, and polyglot architecture (Python/Go/TypeScript)."
gh repo edit robertlupo1997/hierarchical-revenue-forecast --add-topic forecasting --add-topic time-series --add-topic python --add-topic golang --add-topic typescript --add-topic shap

gh repo edit robertlupo1997/kkbox-churn-prediction --description "KKBOX churn prediction with leak-safe feature engineering, isotonic calibration, temporal backtests, and PSI drift monitoring. 0.97 AUC."
gh repo edit robertlupo1997/kkbox-churn-prediction --add-topic machine-learning --add-topic churn-prediction --add-topic python --add-topic streamlit

gh repo edit robertlupo1997/open-vocabulary-object-detection --description "Text-prompted object detection + segmentation with Grounding DINO + SAM 2. 265-490ms/img on RTX 3070."
gh repo edit robertlupo1997/open-vocabulary-object-detection --add-topic computer-vision --add-topic object-detection --add-topic python --add-topic pytorch

gh repo edit robertlupo1997/portfolio_website --description "Personal portfolio at treylupo.com — React 19, GSAP animations, WebGL fluid glass shaders, Lenis smooth scroll."
gh repo edit robertlupo1997/portfolio_website --add-topic portfolio --add-topic react --add-topic typescript --add-topic gsap --add-topic webgl

# Claude Code ecosystem
gh repo edit robertlupo1997/ferroml-plugin --description "FerroML plugin for Claude Code — end-to-end machine learning from natural conversation."
gh repo edit robertlupo1997/gsd-ml --description "Claude Code native autonomous ML research — GSD skill for running ML experiments."
gh repo edit robertlupo1997/mlforge --description "Autonomous ML research framework for tabular data. Point Claude Code at a CSV + metric and it discovers the best pipeline."
```

### Success Criteria:

#### Automated Verification:
- [ ] All public repos have descriptions: `gh repo list robertlupo1997 --json name,description,isPrivate --jq '.[] | select(.isPrivate == false) | "\(.name): \(.description)"'`
- [ ] Key repos have topics: `gh repo view robertlupo1997/nspb-api --json repositoryTopics`

#### Manual Verification:
- [ ] Visit github.com/robertlupo1997 — profile looks professional with clear descriptions

**Pause for confirmation before Phase 4.**

---

## Phase 4: Update Profile README

### Overview
Update the robertlupo1997/robertlupo1997 profile README to reflect current focus.

### Changes Required:
Fetch current README, then update with:
- Current role and focus
- Highlight top 3-4 projects with links
- Tech stack badges
- Link to treylupo.com

### Success Criteria:

#### Automated Verification:
- [ ] README exists and is non-empty

#### Manual Verification:
- [ ] Profile page looks cohesive and professional
- [ ] Links work
- [ ] Projects highlighted match actual best work

---

## References
- Full repo list: `gh repo list robertlupo1997 --limit 50`
- Profile: github.com/robertlupo1997
