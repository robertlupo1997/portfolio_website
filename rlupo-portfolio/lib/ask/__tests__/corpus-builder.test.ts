import { describe, it, expect } from 'vitest';
import { projectToChunk, recordToChunk, readmeToChunks } from '../corpus-builder';
import type { Project } from '../../../types';

const project: Project = {
  id: 'ferroml', title: 'FerroML', category: 'ML Library', projectCategory: 'ml',
  description: 'Rust ML library.', githubUrl: 'https://github.com/robertlupo1997/ferroml',
  epoch: '2025', metric: '10x', metricLabel: 'speedup', stack: ['Rust', 'Python'],
  primaryStack: ['Rust'], featured: true, problem: 'Slow training loops.',
};

describe('projectToChunk', () => {
  it('folds the fields a recruiter would ask about into text', () => {
    const c = projectToChunk(project, 2);
    expect(c.id).toBe('project-ferroml');
    expect(c.sourceType).toBe('project');
    expect(c.slideIndex).toBe(2);
    expect(c.url).toBe(project.githubUrl);
    for (const needle of ['FerroML', 'Rust ML library.', 'Slow training loops.', 'Rust, Python', '10x'])
      expect(c.text).toContain(needle);
  });
});

describe('recordToChunk', () => {
  it('flattens arbitrary records into readable text', () => {
    const c = recordToChunk('bio', 'bio', 'About Trey', { name: 'Trey Lupo', role: 'FP&A Analyst' });
    expect(c.text).toContain('name: Trey Lupo');
    expect(c.text).toContain('role: FP&A Analyst');
  });
});

describe('readmeToChunks', () => {
  it('strips code fences and images, chunks long content, keeps ids stable', () => {
    const fence = '`'.repeat(3); // avoid literal triple backticks (they break this doc's markdown fences)
    const md = `# FerroML\n\n![badge](x.png)\n\nA Rust ML library.\n\n${fence}rust\nfn main() {}\n${fence}\n\n` + 'Detail. '.repeat(400);
    const chunks = readmeToChunks('ferroml', 'FerroML', 'https://github.com/robertlupo1997/ferroml', md);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks[0].id).toBe('readme-ferroml-0');
    expect(chunks[0].sourceType).toBe('readme');
    expect(chunks[0].text).toContain('A Rust ML library.');
    expect(chunks[0].text).not.toContain('fn main');
    expect(chunks.every((c) => c.text.length <= 1200)).toBe(true);
  });
});
