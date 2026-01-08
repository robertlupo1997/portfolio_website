export interface Project {
  id: string;
  title: string;
  category: string;
  githubUrl: string;
  liveUrl?: string;
  epoch: string; // ML term for "date trained/created"
  metric?: string; // Key performance metric (e.g., "0.97 AUC")
  cardColor: 'coral' | 'cyan' | 'green' | 'yellow' | 'light-cyan';
  imageUrl?: string; // Project preview image
}
