import { Project } from './types';

export const GITHUB_USERNAME = "robertlupo1997";

export const PERSONAL_INFO = {
  name: "Robert 'Trey' Lupo",
  brand: "TREY.ML",
  email: "treylupo1197@gmail.com",
  github: "https://github.com/robertlupo1997",
  linkedin: "https://www.linkedin.com/in/robertlupo1997/",
  huggingface: "https://huggingface.co/spaces/robertlupo1997",
  currentRole: "Corporate FP&A Analyst",
  currentCompany: "Franklin Street Properties",
  previousRole: "AI Engineering Intern",
  previousCompany: "Origin Construction",
};

export const PROJECTS: Project[] = [
  {
    id: "kkbox",
    title: "KKBOX CHURN PREDICTION",
    category: "ML/PRODUCTION",
    description: "Production ML pipeline achieving 0.97 AUC with strict temporal validation. Features isotonic calibration, 135 engineered features, SHAP explanations, and a React dashboard for real-time risk analysis.",
    tags: ["XGBoost", "LightGBM", "FastAPI", "React", "SHAP"],
    githubUrl: "https://github.com/robertlupo1997/kkbox-churn-prediction",
    liveUrl: "https://huggingface.co/spaces/robertlupo1997/kkbox-churn-prediction",
    epoch: "AUG 2024",
    metric: "0.97 AUC",
    language: "Python",
    cardColor: "coral"
  },
  {
    id: "obj-detect",
    title: "OPEN-VOCAB OBJECT DETECTION",
    category: "COMPUTER VISION",
    description: "Text-prompted object detection + segmentation with Grounding DINO + SAM 2. Real-time performance benchmarked at 265-490ms per image on RTX 3070.",
    tags: ["Grounding DINO", "SAM 2", "COCO Eval", "PyTorch"],
    githubUrl: "https://github.com/robertlupo1997/open-vocabulary-object-detection",
    epoch: "AUG 2024",
    metric: "265-490ms/img",
    language: "Python",
    cardColor: "cyan"
  },
  {
    id: "amazon-rec",
    title: "AMAZON RECOMMENDATIONS",
    category: "RECOMMENDER SYSTEMS",
    description: "Product recommendation system for e-commerce utilizing collaborative filtering techniques. Completed as part of MIT Professional Education.",
    tags: ["Collaborative Filtering", "Matrix Factorization", "Retail"],
    githubUrl: "https://github.com/robertlupo1997/Amazon-Product-Recommendation-System",
    epoch: "DEC 2024",
    metric: "MIT 100%",
    language: "Python",
    cardColor: "green"
  },
  {
    id: "foodhub",
    title: "FOODHUB ANALYSIS",
    category: "DATA ANALYTICS",
    description: "Comprehensive data analysis exploring customer behavior and restaurant performance for a fictional delivery company. Statistical insights driving business decisions.",
    tags: ["EDA", "Visualization", "Statistical Testing"],
    githubUrl: "https://github.com/robertlupo1997/FoodHub-Data-Analysis",
    epoch: "OCT 2024",
    metric: "MIT IDSS",
    language: "Python",
    cardColor: "yellow"
  },
  {
    id: "shinkansen",
    title: "SHINKANSEN TRAVEL EXP",
    category: "PREDICTIVE MODELING",
    description: "Hackathon project predicting passenger satisfaction and travel experience on Japan's bullet train system. Classification with feature importance analysis.",
    tags: ["Classification", "Hackathon", "Feature Engineering"],
    githubUrl: "https://github.com/robertlupo1997/Shinkansen-Travel-Experience-Prediction-Hackathon",
    epoch: "JAN 2025",
    metric: "MIT IDSS",
    language: "Python",
    cardColor: "light-cyan"
  },
  {
    id: "life-expectancy",
    title: "LIFE EXPECTANCY PREDICTION",
    category: "HEALTHCARE AI",
    description: "Predicting life expectancy based on demographic and health indicators using various statistical and machine learning regression models.",
    tags: ["Regression", "Data Cleaning", "Model Evaluation"],
    githubUrl: "https://github.com/robertlupo1997/LifeExpectancyPrediction",
    epoch: "JUL 2024",
    metric: "Regression",
    language: "Python",
    cardColor: "coral"
  }
];
