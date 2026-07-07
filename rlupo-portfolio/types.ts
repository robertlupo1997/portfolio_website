export type ProjectCategory = 'all' | 'ml' | 'engineering' | 'fpna';

export interface VizParams {
  archetype: 'lattice' | 'wavefield' | 'particleflow' | 'wireframe';
  seed: number;
  density: number;
  speed: number;
  tint: string;
}

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
  imageUrl?: string;
  vizParams?: VizParams;
  ctaAsk?: string;
}

export interface Credential {
  label: string;
}

export interface ActivityEntry {
  date: string;
  project: string;
  label: string;
  note: string;
}
