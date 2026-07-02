import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';
import { askEngine } from '../lib/ask/engine';
import type { AnthropicLike } from '../lib/ask/engine';
import { createRateLimiter } from '../lib/ask/rate-limit';
import { formatSSE } from '../lib/ask/sse';
import { CORPUS } from '../generated/corpus';

export const config = { supportsResponseStreaming: true };

const limiter = createRateLimiter({});
const MAX_QUESTION_CHARS = 500;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const question = typeof req.body?.question === 'string' ? req.body.question.trim() : '';
  if (!question || question.length > MAX_QUESTION_CHARS)
    return res.status(400).json({ error: `question must be 1-${MAX_QUESTION_CHARS} chars` });
  const ip = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ?? 'unknown';
  if (!limiter.allow(ip)) return res.status(429).json({ error: 'Rate limit: 10 questions/hour. Come back soon!' });
  if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ fallback: true });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const client = new Anthropic() as unknown as AnthropicLike; // reads ANTHROPIC_API_KEY
  for await (const e of askEngine(question, { client, corpus: CORPUS })) res.write(formatSSE(e));
  res.end();
}
