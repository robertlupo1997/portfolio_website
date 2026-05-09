export type ProjectCategory = 'all' | 'ml' | 'analytics' | 'fpna';

export interface Project {
  id: string;
  title: string;
  category: string;
  projectCategory: ProjectCategory; // Filter category
  githubUrl: string;
  liveUrl?: string;
  epoch: string; // ML term for "date trained/created"
  metric?: string; // Key performance metric (e.g., "0.97 AUC")
  imageUrl?: string; // Project preview image
}
