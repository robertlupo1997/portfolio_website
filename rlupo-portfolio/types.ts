export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  githubUrl: string;
  liveUrl?: string;
  updatedAt: string;
  language: string;
}

export interface NavItem {
  label: string;
  href: string;
}
