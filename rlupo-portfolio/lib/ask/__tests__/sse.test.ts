import { describe, it, expect } from 'vitest';
import { formatSSE } from '../sse';

describe('formatSSE', () => {
  it('emits a data line with trailing blank line', () => {
    expect(formatSSE({ type: 'done' })).toBe('data: {"type":"done"}\n\n');
  });
});
