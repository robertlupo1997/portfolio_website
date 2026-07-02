// lib/ask/__tests__/search.test.ts
import { describe, it, expect } from 'vitest';
import { searchPortfolio, tokenize } from '../search';
import type { Chunk } from '../types';

const corpus: Chunk[] = [
  { id: 'p1', sourceType: 'project', title: 'FerroML', text: 'Rust machine learning library with Python bindings.' },
  { id: 'p2', sourceType: 'project', title: 'KKBOX Churn', text: 'Churn prediction with gradient boosting in Python.' },
  { id: 'bio', sourceType: 'bio', title: 'About', text: 'FP&A analyst in Tampa building Python SDKs.' },
];

describe('tokenize', () => {
  it('lowercases and keeps tech tokens like c++ and .net-ish terms', () => {
    expect(tokenize('Rust, C++ and Python3!')).toEqual(['rust', 'c++', 'and', 'python3']);
  });
});

describe('searchPortfolio', () => {
  it('ranks the Rust project first for a rust query', () => {
    const r = searchPortfolio('rust library', corpus);
    expect(r[0].id).toBe('p1');
    expect(r[0].score).toBeGreaterThan(0);
  });
  it('boosts title matches', () => {
    const r = searchPortfolio('kkbox', corpus);
    expect(r[0].id).toBe('p2');
  });
  it('excludes zero-score chunks and respects k', () => {
    expect(searchPortfolio('rust', corpus).every((c) => c.score > 0)).toBe(true);
    expect(searchPortfolio('python', corpus, 1)).toHaveLength(1);
  });
});
