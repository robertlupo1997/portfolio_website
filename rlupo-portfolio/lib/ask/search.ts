// lib/ask/search.ts
import type { Chunk, ScoredChunk } from './types';

export function tokenize(s: string): string[] {
  return s.toLowerCase().match(/[a-z0-9+#.]+(?:\+\+)?|[a-z0-9]+/g)?.map((t) => t.replace(/\.+$/, '')).filter(Boolean) ?? [];
}

export function searchPortfolio(query: string, corpus: Chunk[], k = 5): ScoredChunk[] {
  const qTerms = [...new Set(tokenize(query))];
  if (qTerms.length === 0) return [];
  const docs = corpus.map((c) => ({
    chunk: c,
    titleTerms: new Set(tokenize(c.title)),
    terms: tokenize(`${c.title} ${c.text}`),
  }));
  const df = new Map<string, number>();
  for (const d of docs) for (const t of new Set(d.terms))
    df.set(t, (df.get(t) ?? 0) + 1);
  const N = docs.length;
  return docs
    .map((d) => {
      let score = 0;
      for (const q of qTerms) {
        const tf = d.terms.filter((t) => t === q).length;
        if (tf === 0) continue;
        const idf = Math.log(1 + N / (df.get(q) ?? 1));
        score += (1 + Math.log(tf)) * idf * (d.titleTerms.has(q) ? 2 : 1);
      }
      return { ...d.chunk, score };
    })
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
