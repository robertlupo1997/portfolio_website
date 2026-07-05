import { describe, it, expect } from 'vitest';
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
  it('emits fallback when stream ends cleanly with no done event', async () => {
    const reads = [
      Promise.resolve({ done: false, value: new TextEncoder().encode('data: {"type":"text","text":"hello"}\n\n') }),
      Promise.resolve({ done: true, value: undefined }),
    ];
    let i = 0;
    const fakeFetch = (async () => ({
      ok: true,
      status: 200,
      body: { getReader: () => ({ read: () => reads[i++] }) },
    })) as unknown as typeof fetch;
    const events: any[] = [];
    await askQuestion('python', (e) => events.push(e), fakeFetch);
    expect(events.some((e) => e.type === 'citations')).toBe(true);
    expect(events.at(-1)).toEqual({ type: 'done' });
  });

  it('emits local fallback on 404 (dev server has no /api/ask)', async () => {
    const fakeFetch = (async () => ({ ok: false, status: 404 })) as unknown as typeof fetch;
    const events: any[] = [];
    await askQuestion('python machine learning', (e) => events.push(e), fakeFetch);
    expect(events.some((e) => e.type === 'citations')).toBe(true);
    expect(events.at(-1)).toEqual({ type: 'done' });
    expect(events.some((e) => e.type === 'error')).toBe(false);
  });

  it('surfaces 429 as an error, not a fallback', async () => {
    const fakeFetch = (async () => ({
      ok: false, status: 429,
      json: async () => ({ error: 'Rate limit reached — try again in a minute.' }),
    })) as unknown as typeof fetch;
    const events: any[] = [];
    await askQuestion('python', (e) => events.push(e), fakeFetch);
    expect(events).toEqual([{ type: 'error', message: 'Rate limit reached — try again in a minute.' }]);
  });

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
