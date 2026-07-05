export interface Chunk {
  id: string;
  sourceType: 'project' | 'bio' | 'timeline' | 'skills' | 'credentials' | 'resume' | 'readme';
  title: string;
  url?: string;
  slideIndex?: number;
  text: string;
}

export interface ScoredChunk extends Chunk {
  score: number;
}

export interface Citation {
  n: number;
  id: string;
  title: string;
  url?: string;
  slideIndex?: number;
}

export type AskEvent =
  | { type: 'text'; text: string }
  | { type: 'searching'; query: string }
  | { type: 'citations'; citations: Citation[] }
  | { type: 'done' }
  | { type: 'error'; message: string };
