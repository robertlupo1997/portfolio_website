import { describe, it, expect } from 'vitest';
import { createSSEParser, localFallback } from '../client';

describe('createSSEParser', () => {
  it('parses complete frames and buffers partials across feeds', () => {
    const p = createSSEParser();
    expect(p.feed('data: {"type":"text","text":"He')).toEqual([]);
    expect(p.feed('llo"}\n\ndata: {"type":"done"}\n\n')).toEqual([
      { type: 'text', text: 'Hello' },
      { type: 'done' },
    ]);
  });
  it('skips malformed frames without throwing', () => {
    const p = createSSEParser();
    expect(p.feed('data: not-json\n\ndata: {"type":"done"}\n\n')).toEqual([{ type: 'done' }]);
  });
});

describe('localFallback', () => {
  it('returns search-grounded text and citations from the real corpus', () => {
    const r = localFallback('python machine learning');
    expect(r.citations.length).toBeGreaterThan(0);
    expect(r.text).toContain(r.citations[0].title);
  });
});
