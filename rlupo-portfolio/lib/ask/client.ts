import { searchPortfolio } from './search';
import { CORPUS } from '../../generated/corpus';
import type { AskEvent, Citation } from './types';

export function createSSEParser() {
  let buf = '';
  return {
    feed(chunk: string): AskEvent[] {
      buf += chunk;
      const events: AskEvent[] = [];
      let idx: number;
      while ((idx = buf.indexOf('\n\n')) !== -1) {
        const frame = buf.slice(0, idx);
        buf = buf.slice(idx + 2);
        if (!frame.startsWith('data: ')) continue;
        try { events.push(JSON.parse(frame.slice(6))); } catch { /* skip malformed */ }
      }
      return events;
    },
  };
}

export function localFallback(question: string): { text: string; citations: Citation[] } {
  const found = searchPortfolio(question, CORPUS, 3);
  const citations = found.map((c, i) => ({ n: i + 1, id: c.id, title: c.title, url: c.url, slideIndex: c.slideIndex }));
  const text = citations.length
    ? `Live answers are offline right now, but here's what matches: ${citations.map((c) => `${c.title} [${c.n}]`).join(', ')}. Click a source below.`
    : "Live answers are offline right now and nothing matched that — try asking about Trey's projects, skills, or background.";
  return { text, citations };
}

export async function askQuestion(
  question: string,
  onEvent: (e: AskEvent) => void,
  fetchImpl: typeof fetch = fetch,
): Promise<void> {
  const emitFallback = () => {
    const { text, citations } = localFallback(question);
    onEvent({ type: 'text', text });
    onEvent({ type: 'citations', citations });
    onEvent({ type: 'done' });
  };
  let res: Response;
  try {
    res = await fetchImpl('/api/ask', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
  } catch { return emitFallback(); }
  if (res.status === 503) return emitFallback();
  if (!res.ok) {
    const msg = (await res.json().catch(() => null))?.error ?? 'Something went wrong.';
    onEvent({ type: 'error', message: msg });
    return;
  }
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  const parser = createSSEParser();
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      for (const e of parser.feed(decoder.decode(value, { stream: true }))) onEvent(e);
    }
  } catch {
    emitFallback();
  }
}
