// lib/ask/__tests__/engine.test.ts
import { describe, it, expect } from 'vitest';
import { askEngine } from '../engine';
import type { Chunk } from '../types';

const corpus: Chunk[] = [
  { id: 'project-ferroml', sourceType: 'project', title: 'FerroML', url: 'https://github.com/robertlupo1997/ferroml', slideIndex: 2, text: 'Rust machine learning library.' },
];

// Minimal Anthropic stream-event fakes.
function textEvents(text: string) {
  return [
    { type: 'content_block_start', index: 0, content_block: { type: 'text' } },
    { type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text } },
    { type: 'message_delta', delta: { stop_reason: 'end_turn' } },
  ];
}
function toolUseEvents(id: string, input: object) {
  return [
    { type: 'content_block_start', index: 0, content_block: { type: 'tool_use', id, name: 'search_portfolio' } },
    { type: 'content_block_delta', index: 0, delta: { type: 'input_json_delta', partial_json: JSON.stringify(input) } },
    { type: 'message_delta', delta: { stop_reason: 'tool_use' } },
  ];
}
function fakeStream(events: object[]): AsyncIterable<object> {
  return (async function* () { for (const e of events) yield e; })();
}

function scriptedClient(script: object[][]) {
  let call = 0;
  const calls: Record<string, unknown>[] = [];
  return {
    calls,
    messages: { create: async (params: Record<string, unknown>) => { calls.push(params); return fakeStream(script[call++]); } },
  };
}

describe('askEngine', () => {
  it('runs the tool loop and emits searching, text, citations, done', async () => {
    const client = scriptedClient([
      toolUseEvents('tu_1', { query: 'rust' }),
      textEvents('Trey built FerroML [1].'),
    ]);
    const events = [];
    for await (const e of askEngine('What has Trey built in Rust?', { client, corpus })) events.push(e);

    expect(events).toEqual([
      { type: 'searching', query: 'rust' },
      { type: 'text', text: 'Trey built FerroML [1].' },
      { type: 'citations', citations: [{ n: 1, id: 'project-ferroml', title: 'FerroML', url: 'https://github.com/robertlupo1997/ferroml', slideIndex: 2 }] },
      { type: 'done' },
    ]);
    // Second call must carry the tool_result back.
    const secondMessages = client.calls[1].messages as Array<{ role: string; content: unknown }>;
    expect(secondMessages.at(-1)?.role).toBe('user');
    expect(JSON.stringify(secondMessages.at(-1)?.content)).toContain('tu_1');
    expect(JSON.stringify(secondMessages.at(-1)?.content)).toContain('[1] FerroML');
  });

  it('emits error (not a crash) when the client throws', async () => {
    const client = { messages: { create: async () => { throw new Error('boom'); } } };
    const events = [];
    for await (const e of askEngine('hi', { client, corpus })) events.push(e);
    expect(events.at(-1)).toEqual({ type: 'error', message: 'The engine hit an error — try again in a moment.' });
  });
});
