import { Project } from './types';

export const PERSONAL_INFO = {
  email: "treylupo1197@gmail.com",
  github: "https://github.com/robertlupo1997",
  linkedin: "https://www.linkedin.com/in/robertlupo1997/",
  huggingface: "https://huggingface.co/spaces/robertlupo1997",
};

export const PROJECTS: Project[] = [
  {
    id: "kkbox",
    title: "KKBOX CHURN PREDICTION",
    category: "ML/PRODUCTION",
    githubUrl: "https://github.com/robertlupo1997/kkbox-churn-prediction",
    liveUrl: "https://huggingface.co/spaces/robertlupo1997/kkbox-churn-prediction",
    epoch: "AUG 2024",
    metric: "0.97 AUC",
    cardColor: "coral",
    imageUrl: "./assets/project-1.jpg"
  },
  {
    id: "obj-detect",
    title: "OPEN-VOCAB OBJECT DETECTION",
    category: "COMPUTER VISION",
    githubUrl: "https://github.com/robertlupo1997/open-vocabulary-object-detection",
    epoch: "AUG 2024",
    metric: "265-490ms/img",
    cardColor: "cyan",
    imageUrl: "./assets/project-2.webp"
  },
  {
    id: "amazon-rec",
    title: "AMAZON RECOMMENDATIONS",
    category: "RECOMMENDER SYSTEMS",
    githubUrl: "https://github.com/robertlupo1997/Amazon-Product-Recommendation-System",
    epoch: "DEC 2024",
    metric: "MIT 100%",
    cardColor: "green",
    imageUrl: "./assets/project-3.webp"
  },
  {
    id: "foodhub",
    title: "FOODHUB ANALYSIS",
    category: "DATA ANALYTICS",
    githubUrl: "https://github.com/robertlupo1997/FoodHub-Data-Analysis",
    epoch: "OCT 2024",
    metric: "MIT IDSS",
    cardColor: "yellow",
    imageUrl: "./assets/project-4.webp"
  },
  {
    id: "shinkansen",
    title: "SHINKANSEN TRAVEL EXP",
    category: "PREDICTIVE MODELING",
    githubUrl: "https://github.com/robertlupo1997/Shinkansen-Travel-Experience-Prediction-Hackathon",
    epoch: "JAN 2025",
    metric: "MIT IDSS",
    cardColor: "light-cyan",
    imageUrl: "./assets/project-5.webp"
  },
  {
    id: "life-expectancy",
    title: "LIFE EXPECTANCY PREDICTION",
    category: "HEALTHCARE AI",
    githubUrl: "https://github.com/robertlupo1997/LifeExpectancyPrediction",
    epoch: "JUL 2024",
    metric: "Regression",
    cardColor: "coral",
    imageUrl: "./assets/project-6.webp"
  }
];
