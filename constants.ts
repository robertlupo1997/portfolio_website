import { Project, Experience } from './types';

export const SITE_CONFIG = {
  name: "R",
  domain: "LUPO",
  fullName: "Robert Lupo",
  title: "Data Scientist & ML Engineer",
  email: "treylupo1197@gmail.com",
  phone: "+1(813)495-0406",
  location: "TAMPA, FLORIDA",
  github: "robertlupo1997",
  linkedin: "robertlupo1997",
  available: true,
  year: "2025",
};

export const PROJECTS: Project[] = [
  {
    id: "kkbox",
    title: "KKBOX CHURN PREDICTION",
    category: "MACHINE LEARNING",
    description: "Production ML system with leak-safe features, isotonic calibration, backtesting framework, and PSI monitoring dashboard.",
    tags: ["XGBoost", "DuckDB", "Streamlit", "PyTorch"],
    githubUrl: "https://github.com/robertlupo1997/kkbox-churn-prediction",
    trainedDate: "AUG 2024",
    version: "v1.3.0",
    language: "Python",
    metric: "AUC",
    metricValue: "0.942"
  },
  {
    id: "obj-detect",
    title: "OPEN VOCAB OBJECT DETECTION",
    category: "COMPUTER VISION",
    description: "Text-prompted object detection + segmentation with Grounding DINO + SAM 2. 265-490ms inference on RTX 3070.",
    tags: ["Grounding DINO", "SAM 2", "PyTorch"],
    githubUrl: "https://github.com/robertlupo1997/open-vocabulary-object-detection",
    trainedDate: "AUG 2024",
    version: "v2.0.0",
    language: "Python",
    metric: "MS/IMG",
    metricValue: "490"
  },
  {
    id: "extraalearn",
    title: "LEAD CONVERSION PREDICTION",
    category: "MACHINE LEARNING",
    description: "ExtraaLearn ML project predicting lead conversion probability using classification models for EdTech marketing optimization.",
    tags: ["Classification", "scikit-learn", "Pandas"],
    githubUrl: "https://github.com/robertlupo1997/ExtraaLearn-ML-Project",
    trainedDate: "NOV 2024",
    version: "v1.0.0",
    language: "Python",
    metric: "ACC",
    metricValue: "83%"
  },
  {
    id: "amazon-rec",
    title: "AMAZON RECOMMENDATIONS",
    category: "RECOMMENDER SYSTEMS",
    description: "Product recommendation system for e-commerce utilizing collaborative filtering and matrix factorization techniques.",
    tags: ["Recommender", "Collaborative Filtering", "Matrix Factorization"],
    githubUrl: "https://github.com/robertlupo1997/Amazon-Product-Recommendation-System",
    trainedDate: "DEC 2024",
    version: "v1.0.0",
    language: "Python",
    metric: "RMSE",
    metricValue: "0.88"
  },
  {
    id: "shinkansen",
    title: "SHINKANSEN TRAVEL EXP",
    category: "PREDICTIVE MODELING",
    description: "Hackathon project predicting passenger satisfaction on Japan's bullet train network.",
    tags: ["Hackathon", "Classification", "XGBoost"],
    githubUrl: "https://github.com/robertlupo1997/Shinkansen-Travel-Experience-Prediction-Hackathon",
    trainedDate: "JAN 2025",
    version: "v1.0.0",
    language: "Python",
    metric: "ACC",
    metricValue: "94.2%"
  },
  {
    id: "foodhub",
    title: "FOODHUB ANALYSIS",
    category: "DATA ANALYTICS",
    description: "Data analysis exploring customer behavior and restaurant performance for delivery optimization.",
    tags: ["EDA", "Visualization", "Business Insights"],
    githubUrl: "https://github.com/robertlupo1997/FoodHub-Data-Analysis",
    trainedDate: "OCT 2024",
    version: "v1.2.0",
    language: "Python"
  },
  {
    id: "life-expectancy",
    title: "LIFE EXPECTANCY PREDICTION",
    category: "HEALTHCARE AI",
    description: "Predicting life expectancy using statistical and ML models with comprehensive EDA and model evaluation.",
    tags: ["Regression", "Statistics", "EDA"],
    githubUrl: "https://github.com/robertlupo1997/LifeExpectancyPrediction",
    trainedDate: "JUL 2024",
    version: "v1.0.0",
    language: "Jupyter",
    metric: "R²",
    metricValue: "0.89"
  },
  {
    id: "origin-projects",
    title: "ORIGIN RECREATED PROJECTS",
    category: "SOFTWARE ENGINEERING",
    description: "Full-stack applications built during internship featuring FastAPI backend, OAuth 2.0 authentication, and modern API design.",
    tags: ["FastAPI", "OAuth 2.0", "Docker", "PostgreSQL"],
    githubUrl: "https://github.com/robertlupo1997/origin-recreated-projects",
    trainedDate: "SEP 2025",
    version: "v1.0.0",
    language: "Python"
  }
];

export const EXPERIENCE: Experience[] = [
  {
    id: "origin",
    company: "Origin Construction",
    role: "AI Engineering Intern",
    period: "Jun 2025 - Sep 2025",
    description: "Developed AI-powered solutions for construction project management and resource optimization.",
    technologies: ["FastAPI", "OAuth 2.0", "Docker", "PostgreSQL", "Python"]
  },
  {
    id: "pmc",
    company: "Physical Medicine Center",
    role: "Patient File Coordinator",
    period: "Aug 2021 - Jun 2025",
    description: "Managed patient records and coordinated medical documentation workflows.",
    technologies: ["Data Management", "Healthcare Systems", "Process Optimization"]
  }
];

export const AWARDS = [
  { source: "MIT IDSS", items: ["Advanced DS/ML", "Certification 2024"] },
  { source: "USF", items: ["B.A. Statistics", "May 2024"] },
  { source: "GitHub", items: ["8 Public Repos", "Active Contributor"] },
];

export const SKILLS = [
  "Python",
  "SQL",
  "R",
  "PyTorch",
  "XGBoost",
  "scikit-learn",
  "Pandas",
  "NumPy",
  "Matplotlib",
  "Streamlit",
  "FastAPI",
  "Docker",
  "DuckDB",
  "PostgreSQL",
  "Git",
  "Claude Code"
];
