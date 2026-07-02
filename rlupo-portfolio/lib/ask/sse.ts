import type { AskEvent } from './types';
export function formatSSE(e: AskEvent): string {
  return `data: ${JSON.stringify(e)}\n\n`;
}
