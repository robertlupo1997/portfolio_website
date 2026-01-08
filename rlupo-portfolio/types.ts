export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  githubUrl: string;
  liveUrl?: string;
  epoch: string; // ML term for "date trained/created"
  metric?: string; // Key performance metric (e.g., "0.97 AUC")
  language: string;
  cardColor: 'coral' | 'cyan' | 'green' | 'yellow' | 'light-cyan';
}

export interface NavItem {
  label: string;
  href: string;
}

export const CARD_COLORS = {
  coral: '#ff6d1b',
  cyan: '#00f0ff',
  green: '#00ffa3',
  yellow: '#dbff00',
  'light-cyan': '#d1ecee',
} as const;
