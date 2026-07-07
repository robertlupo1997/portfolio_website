import { Project, ProjectCategory, Credential, ActivityEntry } from './types';
import { VIZ_PARAMS } from './lib/viz/params';

export const PERSONAL_INFO = {
  email: "treylupo1197@gmail.com",
  github: "https://github.com/robertlupo1997",
  linkedin: "https://www.linkedin.com/in/robertlupo1997/",
  huggingface: "https://huggingface.co/spaces/robertlupo1997",
};

export const PROJECT_CATEGORIES: { key: ProjectCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'ml', label: 'Machine Learning' },
  { key: 'engineering', label: 'Engineering' },
  { key: 'fpna', label: 'FP&A' },
];

export const FEATURED_PROJECTS: Project[] = [
  {
    id: "nspb-api",
    title: "nspb-api",
    category: "//api engineering",
    projectCategory: "fpna",
    description: "60-endpoint Python SDK for Oracle EPM Cloud — powers the AI dashboard that replaced a 132-page monthly report. 114+ tests; v1.0 through v2.1; informs $500M+ portfolio decisions.",
    problem: "Oracle EPM Cloud exposes no public API. I built one.",
    epoch: "'26",
    metric: "8h→<1h",
    metricLabel: "VARIANCE ANALYSIS",
    stack: ["Python", "REST", "Oracle EPM", "SDK Design"],
    primaryStack: ["Python", "Oracle EPM"],
    featured: true,
    vizParams: VIZ_PARAMS['nspb-api'],
    ctaAsk: "Tell me about nspb-api",
  },
  {
    id: "ferroml",
    title: "FerroML",
    category: "//systems · automl",
    projectCategory: "engineering",
    description: "55-algorithm AutoML framework in Rust — benchmark theater replaced with 489+ cross-library correctness tests and 5-layer verification. GPU acceleration via wgpu, SIMD, ONNX export. Ships on PyPI.",
    problem: "AutoML tools skip statistical rigor. FerroML doesn't.",
    githubUrl: "https://github.com/robertlupo1997/ferroml",
    liveUrl: "https://pypi.org/project/ferroml/",
    epoch: "'26",
    metric: "3.9×",
    metricLabel: "FASTER THAN SKLEARN (KMEANS)",
    stack: ["Rust", "wgpu", "ONNX", "PyPI"],
    primaryStack: ["Rust", "Python"],
    featured: true,
    vizParams: VIZ_PARAMS['ferroml'],
  },
  {
    id: "ask-my-work",
    title: "Ask My Work",
    category: "//ai · rag engine",
    projectCategory: "engineering",
    description: "Semantic retrieval over my full project portfolio and resume — streaming SSE, citation-grounded answers, Anthropic API, serverless edge, rate-limited and eval-suite-verified.",
    problem: "Recruiters skim. Let them interrogate.",
    epoch: "'26",
    metric: "Streaming",
    metricLabel: "RAG · SSE · EVAL-SUITE",
    stack: ["RAG", "SSE", "Anthropic API", "Serverless"],
    primaryStack: ["TypeScript", "Anthropic"],
    featured: true,
    vizParams: VIZ_PARAMS['ask-my-work'],
    ctaAsk: "",
  },
];

export const ALL_PROJECTS: Project[] = [
  {
    id: "revenue-forecast",
    title: "Hierarchical Revenue Forecast",
    category: "//time series",
    projectCategory: "fpna",
    description: "Production-grade hierarchical forecasting across 1,782 time series (54 stores × 33 product families) on a $1B+ revenue proxy — 0.48 RMSLE, sub-10ms inference via Go + ONNX Runtime, Polars 80× preprocessing speedup.",
    problem: "Revenue forecasting across business lines that actually reconcile.",
    githubUrl: "https://github.com/robertlupo1997/hierarchical-revenue-forecast",
    epoch: "'26",
    metric: "0.48",
    metricLabel: "RMSLE (KAGGLE TOP-20%)",
    stack: ["Python", "Go", "ONNX", "SHAP"],
    primaryStack: ["Python", "Go"],
    featured: false,
    vizParams: VIZ_PARAMS['revenue-forecast'],
  },
  {
    id: "kkbox",
    title: "KKBOX Churn Prediction",
    category: "//ml · production",
    projectCategory: "ml",
    description: "0.97 AUC churn model on 30GB+ of data from 970K KKBOX subscribers — log loss 0.41 → 0.11 via isotonic calibration, leak-safe temporal validation. Live demo: React 19 dashboard with SHAP waterfalls and ROI calculator.",
    githubUrl: "https://github.com/robertlupo1997/kkbox-churn-prediction",
    liveUrl: "https://huggingface.co/spaces/robertlupo1997/kkbox-churn-prediction",
    epoch: "'24",
    metric: "0.97",
    metricLabel: "AUC",
    stack: ["React 19", "FastAPI", "Docker", "XGBoost"],
    primaryStack: ["Python"],
    featured: false,
    vizParams: VIZ_PARAMS['kkbox'],
  },
  {
    id: "ironclad",
    title: "Ironclad",
    category: "//construction ml",
    projectCategory: "ml",
    description: "Statistical estimation engine designed for construction bid analysis — spec + FerroML core in place. Targets ±5-10% accuracy vs. human ±20-30%, with full Monte Carlo P10/P50/P90 uncertainty output per line item.",
    problem: "$273B/yr in U.S. estimating errors. Ironclad names its confidence.",
    githubUrl: "https://github.com/robertlupo1997/ironclad",
    epoch: "'26",
    metric: "$273B",
    metricLabel: "ANNUAL ESTIMATING COST",
    stack: ["Florence-2", "YOLOE", "PaddleOCR", "FerroML"],
    primaryStack: ["Python"],
    featured: false,
    vizParams: VIZ_PARAMS['ironclad'],
  },
  {
    id: "ferroml-plugin",
    title: "FerroML Plugin",
    category: "//ai tooling",
    projectCategory: "engineering",
    description: "End-to-end ML from natural conversation inside Claude Code — direct Python API, no MCP server, no subprocess overhead. Invokes FerroML's full pipeline through a first-party plugin without leaving the editor.",
    githubUrl: "https://github.com/robertlupo1997/ferroml-plugin",
    epoch: "'26",
    metric: "55-file",
    metricLabel: "SKILL · 6 WORKFLOWS · 3 HOOKS",
    stack: ["Python", "Claude Code plugin API"],
    primaryStack: ["Python"],
    featured: false,
    vizParams: VIZ_PARAMS['ferroml-plugin'],
  },
  {
    id: "gsd-ml",
    title: "GSD-ML",
    category: "//ai tooling",
    projectCategory: "engineering",
    description: "Point Claude Code at a dataset and a metric; get a validated, tuned ML pipeline — git-based keep/revert experiment loop, LoRA/QLoRA fine-tuning support. Evolution of MLForge: replaces subprocess CLI with native Claude Code execution.",
    githubUrl: "https://github.com/robertlupo1997/gsd-ml",
    epoch: "'26",
    metric: "4",
    metricLabel: "ML DOMAINS",
    stack: ["Python", "Claude Code"],
    primaryStack: ["Python"],
    featured: false,
    vizParams: VIZ_PARAMS['gsd-ml'],
  },
];

export const TIMELINE = [
  {
    year: "2024",
    title: "B.A. Statistics, University of South Florida",
    sub: "MIT IDSS Data Science Certificate",
    current: false,
  },
  {
    year: "2025",
    title: "AI Engineering Intern, Origin Construction",
    sub: "APM automation · Procore integrations · AI agent pilots",
    current: false,
  },
  {
    year: "2025–NOW",
    title: "FP&A Analyst, Franklin Street",
    sub: "Built nspb-api SDK · FerroML in Rust · ML deal prediction · Oracle ETL pipeline",
    current: true,
  },
];

export const SKILL_GROUPS = [
  { label: "LANGUAGES", items: ["Python", "TypeScript", "SQL", "Rust"] },
  { label: "FINANCE", items: ["Oracle EPM Cloud", "FP&A", "Financial Modeling"] },
  { label: "ML / DATA", items: ["Scikit-learn", "LightGBM", "Pandas", "FastAPI"] },
  { label: "AI TOOLS", items: ["Claude Code", "Anthropic SDK"] },
  { label: "WEB", items: ["React", "GSAP", "Vite"] },
];

export const CAROUSEL_PROJECTS: Project[] = [...FEATURED_PROJECTS, ...ALL_PROJECTS];

export const CREDENTIALS: Credential[] = [
  { label: 'MIT Data Science Certificate' },
  { label: 'B.A. Statistics · USF' },
  { label: '6,500+ Tests · FerroML' },
  { label: '60+ API Endpoints · nspb-api' },
  { label: '0.97 AUC · KKBOX Churn' },
  { label: 'Franklin Street FP&A' },
  { label: 'Python · Rust · TypeScript · SQL' },
  { label: 'Origin Construction · AI Intern' },
];

export const ACTIVITY_LOG: ActivityEntry[] = [
  { date: '2026-06', project: 'portfolio', label: 'redesigned', note: 'GSAP terminal carousel' },
  { date: '2026-06', project: 'FerroML', label: 'v0.3.0', note: '6,500 tests · PyPI' },
  { date: '2026-06', project: 'nspb-api', label: 'v2.1', note: '60+ endpoints shipped' },
  { date: '2026-05', project: 'gsd-ml', label: 'released', note: 'autonomous ML research' },
  { date: '2026-05', project: 'FerroML Plugin', label: 'released', note: 'Claude Code integration' },
  { date: '2026-04', project: 'ironclad', label: 'v1.0', note: '95% CI cost estimation' },
  { date: '2026-03', project: 'MLForge', label: 'released', note: 'CSV in · pipeline out' },
  { date: '2025-12', project: 'nspb-api', label: 'v1.0', note: 'Oracle EPM SDK launched' },
  { date: '2025-09', project: 'revenue-forecast', label: 'deployed', note: 'multi-LOB reconciliation' },
  { date: '2024-11', project: 'KKBOX', label: 'published', note: '0.97 AUC · HuggingFace' },
];

export const ACTIVITY_SUMMARY = {
  duration: '2 years shipping',
  projects: `${CAROUSEL_PROJECTS.length} projects`,
  languages: '4 languages',
};
