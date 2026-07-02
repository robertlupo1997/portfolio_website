import type { Project } from '../../types';
import type { Chunk } from './types';

export function projectToChunk(p: Project, slideIndex: number): Chunk {
  const text = [
    `${p.title} — ${p.category} (${p.epoch})`,
    p.description,
    p.problem ? `Problem: ${p.problem}` : '',
    `Stack: ${p.stack.join(', ')}`,
    `Result: ${p.metric} ${p.metricLabel}`,
    p.liveUrl ? `Live demo: ${p.liveUrl}` : '',
  ].filter(Boolean).join('\n');
  return {
    id: `project-${p.id}`, sourceType: 'project', title: p.title,
    url: p.githubUrl ?? p.liveUrl, slideIndex, text,
  };
}

function flatten(value: unknown, prefix = ''): string[] {
  if (value === null || value === undefined) return [];
  if (Array.isArray(value)) return value.flatMap((v) => flatten(v, prefix));
  if (typeof value === 'object')
    return Object.entries(value as Record<string, unknown>)
      .flatMap(([k, v]) => flatten(v, prefix ? `${prefix}.${k}` : k));
  return [prefix ? `${prefix}: ${String(value)}` : String(value)];
}

export function recordToChunk(
  id: string, sourceType: Chunk['sourceType'], title: string, data: unknown,
): Chunk {
  return { id, sourceType, title, text: flatten(data).join('\n') };
}
