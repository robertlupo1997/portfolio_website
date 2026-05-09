import { Project, ProjectCategory } from './types';

export const PERSONAL_INFO = {
  email: "treylupo1197@gmail.com",
  github: "https://github.com/robertlupo1997",
  linkedin: "https://www.linkedin.com/in/robertlupo1997/",
  huggingface: "https://huggingface.co/spaces/robertlupo1997",
};

export const PROJECT_CATEGORIES: { key: ProjectCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'ml', label: 'Machine Learning' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'fpna', label: 'FP&A' },
];

export const PROJECTS: Project[] = [
  {
    id: "kkbox",
    title: "KKBOX CHURN PREDICTION",
    category: "ML/PRODUCTION",
    projectCategory: "ml",
    githubUrl: "https://github.com/robertlupo1997/kkbox-churn-prediction",
    liveUrl: "https://huggingface.co/spaces/robertlupo1997/kkbox-churn-prediction",
    epoch: "AUG 2024",
    metric: "0.97 AUC",
    imageUrl: "/assets/kkbox-churn.jpg"
  },
  {
    id: "obj-detect",
    title: "OPEN-VOCAB OBJECT DETECTION",
    category: "COMPUTER VISION",
    projectCategory: "ml",
    githubUrl: "https://github.com/robertlupo1997/open-vocabulary-object-detection",
    epoch: "AUG 2024",
    metric: "265-490ms/img",
    imageUrl: "/assets/objdetect-matrix.jpg"
  },
  {
    id: "amazon-rec",
    title: "AMAZON RECOMMENDATIONS",
    category: "RECOMMENDER SYSTEMS",
    projectCategory: "ml",
    githubUrl: "https://github.com/robertlupo1997/Amazon-Product-Recommendation-System",
    epoch: "DEC 2024",
    metric: "MIT 100%",
    imageUrl: "/assets/amazon-network.jpg"
  },
  {
    id: "foodhub",
    title: "FOODHUB ANALYSIS",
    category: "DATA ANALYTICS",
    projectCategory: "analytics",
    githubUrl: "https://github.com/robertlupo1997/FoodHub-Data-Analysis",
    epoch: "OCT 2024",
    metric: "MIT IDSS",
    imageUrl: "/assets/foodhub-heatmap.png"
  },
  {
    id: "shinkansen",
    title: "SHINKANSEN TRAVEL EXP",
    category: "PREDICTIVE MODELING",
    projectCategory: "ml",
    githubUrl: "https://github.com/robertlupo1997/Shinkansen-Travel-Experience-Prediction-Hackathon",
    epoch: "JAN 2025",
    metric: "MIT IDSS",
    imageUrl: "/assets/shinkansen-shibuya.jpg"
  },
  {
    id: "life-expectancy",
    title: "LIFE EXPECTANCY PREDICTION",
    category: "HEALTHCARE AI",
    projectCategory: "ml",
    githubUrl: "https://github.com/robertlupo1997/LifeExpectancyPrediction",
    epoch: "JUL 2024",
    metric: "Regression",
    imageUrl: "/assets/life-heartbeat.jpg"
  }
];
