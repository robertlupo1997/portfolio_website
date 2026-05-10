export type ProjectCategory = 'all' | 'ml' | 'engineering' | 'fpna';

export interface Project {
  id: string;
  title: string;
  category: string;
  projectCategory: ProjectCategory;
  description: string;
  githubUrl?: string;
  liveUrl?: string;
  epoch: string;
  metric: string;
  metricLabel: string;
  metricNumeric?: number;
  stack: string[];
  primaryStack: string[];
  featured: boolean;
  problem?: string;
}
