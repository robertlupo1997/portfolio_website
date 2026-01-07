import { Project } from './types';

export const GITHUB_USERNAME = "robertlupo1997";

export const PROJECTS: Project[] = [
  {
    id: "kkbox",
    title: "KKBOX CHURN PREDICTION",
    category: "MACHINE LEARNING",
    description: "Production ML pipeline achieving 0.97 AUC with strict temporal validation. Features isotonic calibration, 135 engineered features, SHAP explanations, and a React dashboard for real-time risk analysis.",
    tags: ["XGBoost", "LightGBM", "FastAPI", "React", "SHAP"],
    githubUrl: "https://github.com/robertlupo1997/kkbox-churn-prediction",
    liveUrl: "https://huggingface.co/spaces/robertlupo1997/kkbox-churn-prediction",
    updatedAt: "Today",
    language: "Python"
  },
  {
    id: "obj-detect",
    title: "OPEN VOCAB OBJECT DETECTION",
    category: "COMPUTER VISION",
    description: "Text-prompted object detection + segmentation with Grounding DINO + SAM 2. Real-time performance on RTX 3070.",
    tags: ["Grounding DINO", "SAM 2", "COCO Eval"],
    githubUrl: "https://github.com/robertlupo1997/open-vocabulary-object-detection",
    updatedAt: "Aug 21",
    language: "Python"
  },
  {
    id: "foodhub",
    title: "FOODHUB ANALYSIS",
    category: "DATA ANALYTICS",
    description: "Data analysis project for exploring customer behavior and restaurant performance for a fictional delivery company.",
    tags: ["EDA", "Visualization", "Business Insights"],
    githubUrl: "https://github.com/robertlupo1997/FoodHub-Data-Analysis",
    updatedAt: "Oct 13, 2024",
    language: "HTML/Python"
  },
  {
    id: "life-expectancy",
    title: "LIFE EXPECTANCY PREDICTION",
    category: "HEALTHCARE AI",
    description: "Predicting life expectancy based on age and gender using various statistical and machine learning models.",
    tags: ["Regression", "Data Cleaning", "Model Eval"],
    githubUrl: "https://github.com/robertlupo1997/LifeExpectancyPrediction",
    updatedAt: "Jul 24, 2024",
    language: "Jupyter"
  },
  {
    id: "amazon-rec",
    title: "AMAZON RECOMMENDATIONS",
    category: "RECOMMENDER SYSTEMS",
    description: "Product recommendation system building for e-commerce utilizing collaborative filtering techniques.",
    tags: ["Recommender", "Filtering", "Retail"],
    githubUrl: "https://github.com/robertlupo1997/Amazon-Product-Recommendation-System",
    updatedAt: "Dec 31, 2024",
    language: "HTML"
  },
  {
    id: "shinkansen",
    title: "SHINKANSEN TRAVEL EXP",
    category: "PREDICTIVE MODELING",
    description: "Hackathon project predicting passenger satisfaction and travel experience on the bullet train.",
    tags: ["Hackathon", "Classification"],
    githubUrl: "https://github.com/robertlupo1997/Shinkansen-Travel-Experience-Prediction-Hackathon",
    updatedAt: "Jan 27",
    language: "HTML"
  }
];
