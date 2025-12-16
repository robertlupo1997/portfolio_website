export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  githubUrl: string;
  demoUrl?: string;
  trainedDate: string;
  version: string;
  language: string;
  metric?: string;
  metricValue?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  technologies: string[];
}
