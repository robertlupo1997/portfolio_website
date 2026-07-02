import { describe, it, expect, vi } from 'vitest';
import { createSSEParser, localFallback, askQuestion } from '../client';

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

describe('askQuestion', () => {
  it('emits local fallback when the stream fails mid-read', async () => {
    const reads = [
      Promise.resolve({ done: false, value: new TextEncoder().encode('data: {"type":"text","text":"partial"}\n\n') }),
      Promise.reject(new Error('connection reset')),
    ];
    let i = 0;
    const fakeFetch = (async () => ({
      ok: true,
      status: 200,
      body: { getReader: () => ({ read: () => reads[i++] }) },
    })) as unknown as typeof fetch;
    const events: any[] = [];
    await askQuestion('python machine learning', (e) => events.push(e), fakeFetch);
    expect(events[0]).toEqual({ type: 'text', text: 'partial' });
    expect(events.at(-1)).toEqual({ type: 'done' });
    expect(events.some((e) => e.type === 'citations')).toBe(true);
  });
});
