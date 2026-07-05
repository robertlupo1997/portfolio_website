// scripts/run-evals.mts
import { readFileSync } from 'node:fs';
import Anthropic from '@anthropic-ai/sdk';
import { askEngine } from '../lib/ask/engine';
import { CORPUS } from '../generated/corpus';

if (!process.env.ANTHROPIC_API_KEY) { console.error('Set ANTHROPIC_API_KEY'); process.exit(2); }
const questions: Array<{ q: string; expectSourceIds: string[] }> =
  JSON.parse(readFileSync(new URL('../evals/questions.json', import.meta.url), 'utf8'));
const client = new Anthropic() as unknown as import('../lib/ask/engine').AnthropicLike;

let passed = 0;
for (const { q, expectSourceIds } of questions) {
  let cited: string[] = [];
  let text = '';
  for await (const e of askEngine(q, { client, corpus: CORPUS })) {
    if (e.type === 'citations') cited = e.citations.map((c) => c.id);
    if (e.type === 'text') text += e.text;
  }
  const hasExpected = expectSourceIds.some((id) => cited.includes(id));
  const hasInlineRef = /\[\d+\]/.test(text);
  const ok = hasExpected && hasInlineRef;
  if (ok) passed++;
  console.log(`${ok ? 'PASS' : 'FAIL'} — ${q}${ok ? '' : ` (cited: ${cited.join(', ') || 'none'})`}`);
}
const rate = passed / questions.length;
console.log(`\n${passed}/${questions.length} (${Math.round(rate * 100)}%)`);
process.exit(rate >= 0.9 ? 0 : 1);
