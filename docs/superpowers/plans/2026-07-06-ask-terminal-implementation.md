# Ask Terminal — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development`
> (recommended) or `superpowers:executing-plans` to implement this plan task-by-task.
> Steps use checkbox (`- [ ]`) syntax for tracking.

**Date:** 2026-07-06 · **Author:** Claude (Sonnet 4.6) ·
**Spec:** `docs/superpowers/specs/2026-07-05-ask-terminal-agentic-design.md`
**Status:** READY FOR EXECUTION

**Architecture summary:** Client-driven agentic loop. The browser executes the 5
read-only corpus tools locally against the bundle that already ships. The server
(`/api/ask-agent`) is a thin Web-standard fetch proxy that pins model / system /
tools / max_tokens and streams Anthropic SSE byte-for-byte to the client. `AskPanel`
evolves in place to `AskTerminal`; all mounts, focus contracts, and prop signatures
are preserved.

**Prerequisite:** The C-spec restyle (`2026-07-05-ai-section-design-spec.md`) lands
first. Tasks 1–6 can proceed against the current panel; Task 5 requires the C-spec
restyle to already be merged so the terminal aesthetic layers cleanly on top of the
updated tokens. `/api/ask.ts` and `askQuestion` in `lib/ask/client.ts` must remain
green until `AskTerminal` is live.

---

## Global Constraints

- App root is `rlupo-portfolio/` — all paths below are relative to it unless
  prefixed with `../`.
- Existing suite gates before every task commit:
  `npm test` (40/40), `npx tsc --noEmit`, `npm run build`, `npm run test:e2e` (11/11).
- `api/ask-agent.ts` imports nothing from `@vercel/node`, `@vercel/edge`, or any
  Node-only module. Exported signature: `export default async function handler(req:
  Request): Promise<Response>`. Verified by grep before every commit of that file.
- Server pins the sensitive surface: model (`claude-haiku-4-5-20251001`), system
  prompt (persona), tool definitions, max_tokens (1500). Client sends only
  `{messages: AnthropicMessage[], session: {id: string}}`. Any client-supplied
  model / system / tools is silently ignored by the proxy.
- Cost caps are non-negotiable and server-enforced: 4 tool-turns/question, 10
  questions/session, 1 advisor consult/session, 1500 max_tokens/turn.
- Cyberpunk effects are scoped entirely to the `ask-panel` CSS block. The rest of
  the site stays Invisible Frame, unchanged. Every new visual effect is a `--term-*`
  CSS token so it can propagate site-wide in a future pass without surgery.
- CSS class names (`ask-panel`, `ask-panel__*`) and `data-testid="ask-panel"` /
  `data-testid="ask-answer"` / `data-testid="citation-{n}"` are preserved throughout
  so the existing 11 e2e tests remain green. The component export is renamed from
  `AskPanel` to `AskTerminal`; the filename `components/AskPanel.tsx` is kept.
- Employer name is always **"Franklin Street"** — never "Franklin Street Properties".
- Commit only to `main`. Do not push without explicit instruction from Trey.

---

### Task 1: LinkedIn corpus chunk

**Files:**
- Create: `content/linkedin.md` (agent creates template; Trey fills it in)
- Modify: `scripts/build-corpus.mts` (ingest linkedin.md; assign `sourceType: 'linkedin'`)
- Modify: `rlupo-portfolio/lib/ask/types.ts` (add `'linkedin'` to `sourceType` union)
- Regen: `generated/corpus.ts` (via build script)

**Interfaces:**
- `content/linkedin.md` shape: `# LinkedIn` header, then `## Headline`, `## Experience`
  (roles, dates, 2–3 bullets each), `## Education`, `## Recommendations` (2–3 quotes
  with citation-ready names). Facts must agree with `content/resume.txt` and
  `constants.ts` project entries.
- Corpus builder assigns chunks: `sourceType: 'linkedin'`, id pattern `linkedin-{n}`.
- Consumer: `readLinkedin()` tool in Task 2 filters `sourceType === 'linkedin'`.

**Steps:**
- [ ] **Step 0: Add `'linkedin'` to Chunk.sourceType union in `lib/ask/types.ts`.**
  The current union is `'project' | 'bio' | 'timeline' | 'skills' | 'credentials' |
  'resume' | 'readme'`. Extend with `| 'linkedin'`.
- [ ] **Step 1: Create `content/linkedin.md` template.**
  Generate the file with correct section headers and placeholder comments. Add at top:
  `<!-- Trey: replace placeholders with content from your LinkedIn export (~10 min) -->`.
- [ ] **Step 2: Update `scripts/build-corpus.mts`.**
  Add ingestion of `content/linkedin.md` alongside `content/resume.txt`. Chunk it by
  section (one chunk per `##` heading). Assign each chunk `sourceType: 'linkedin'` and
  id `linkedin-{n}` (1-indexed).
- [ ] **Step 3: Regenerate corpus.**
  Run: `npx tsx scripts/build-corpus.mts`.
  Verify: `grep -c "linkedin" generated/corpus.ts` returns ≥ 1.
- [ ] **Step 4: Confirm suite green.**
  `npm test && npx tsc --noEmit && npm run build`. (No e2e change expected.)
- [ ] **Step 5: Commit.**
  ```
  git add content/linkedin.md scripts/build-corpus.mts generated/corpus.ts \
    lib/ask/types.ts
  git commit -m "content: add linkedin corpus template and ingestion; extend sourceType union"
  ```
  **Trey action (separate commit):** Replace placeholder content in `content/linkedin.md`
  with real LinkedIn data, re-run Step 3, then `git add generated/corpus.ts
  content/linkedin.md && git commit -m "content: populate linkedin corpus"`.

**Exit criteria:** `generated/corpus.ts` contains at least one chunk with
`sourceType === 'linkedin'`; suite green.

---

### Task 2: Client-side tool library and new Anthropic SSE parser

**Files:**
- Create: `lib/ask/tools.ts` (5 pure corpus tool functions)
- Create: `lib/ask/anthropic-sse.ts` (Anthropic-native SSE frame parser — NOT the
  existing `createSSEParser` in `client.ts`)
- Modify: `lib/ask/types.ts` (add new AskEvent variants, SessionToken type)
- Create: `tests/ask-tools.test.ts`
- Create: `tests/anthropic-sse.test.ts`

**Interfaces:**
```typescript
// lib/ask/tools.ts — all functions are pure; pass corpus explicitly
export type ToolResult = { content: string; hitCount: number; elapsedMs: number }
export function searchCorpus(query: string, corpus: Chunk[], k?: number): ToolResult
export function readProject(slug: string, corpus: Chunk[]): ToolResult
// readProject: filter sourceType === 'project' AND (id.includes(slug) OR
//   title.toLowerCase().includes(slug.toLowerCase())). No projectSlug field exists
//   on Chunk — derive from id/title matching.
export function readResume(corpus: Chunk[]): ToolResult
// filter sourceType === 'resume'
export function readLinkedin(corpus: Chunk[]): ToolResult
// filter sourceType === 'linkedin'
export function listProjects(corpus: Chunk[]): ToolResult
// deduplicate titles of chunks where sourceType === 'project'

// lib/ask/anthropic-sse.ts
// IMPORTANT: The existing createSSEParser in client.ts checks
// frame.startsWith('data: ') — it will SILENTLY DROP every Anthropic event
// because Anthropic frames are multi-line (event:\ndata:\n\n) and start with
// 'event: '. Do NOT reuse it.
export type AnthropicSSEEvent =
  | { type: 'message_start'; message: { id: string; usage: UsageRecord } }
  | { type: 'content_block_start'; index: number; content_block: ContentBlock }
  | { type: 'content_block_delta'; index: number; delta: Delta }
  | { type: 'content_block_stop'; index: number }
  | { type: 'message_delta'; delta: { stop_reason: string | null }; usage: UsageRecord }
  | { type: 'message_stop' }
  | { type: 'error'; error: { type: string; message: string } }

// ContentBlock: { type: 'text' } | { type: 'tool_use'; id: string; name: string }
//   | { type: 'server_tool_use'; id: string; name: string } (advisor uses this type)
// Delta: { type: 'text_delta'; text: string }
//   | { type: 'input_json_delta'; partial_json: string }
// UsageRecord: { input_tokens: number; output_tokens: number;
//   cache_read_input_tokens?: number; cache_creation_input_tokens?: number }

export function parseAnthropicFrame(frame: string): AnthropicSSEEvent | null
// Split frame on '\n'; find line starting with 'data: '; parse JSON.
// Ignore the 'event: ' line — the JSON type field carries event identity.
// Return null for ping frames (no data line) or parse errors.

// lib/ask/types.ts additions
export type AskEvent =
  // ... existing variants unchanged ...
  | { type: 'tool_trace'; line: string }   // "▸ tool_name "input" → N hits · Xms"
  | { type: 'session_cap' }                // 10-question limit reached
  | { type: 'local_mode' }                 // agent offline, using corpus fallback
  | { type: 'clear' }                      // 'clear' command — component resets history

export type SessionToken = { id: string; questionCount: number; advisorUsed: boolean }
// Note: questionCount and advisorUsed are advisory on the client; the server's
// 429 is authoritative for session cap. advisorUsed on client is unused — server
// tracks it via its own session store.
```

**Steps:**
- [ ] **Step 1: Add new AskEvent variants and SessionToken to `lib/ask/types.ts`.**
  Append the four new union members and the `SessionToken` type. Existing variants
  are unchanged.
- [ ] **Step 2: Implement `lib/ask/tools.ts`.**
  Five pure functions. `searchCorpus` wraps `searchPortfolio` from `search.ts`,
  records `elapsedMs` via `Date.now()` diff. `readProject` matches on
  `sourceType === 'project'` plus id/title substring matching (no projectSlug field).
  All format `content` as numbered excerpts matching the current search result format
  so the server's system prompt prompt works unchanged.
- [ ] **Step 3: Implement `lib/ask/anthropic-sse.ts`.**
  `parseAnthropicFrame` splits on `\n`, extracts the `data: ` line, JSON-parses it,
  returns typed `AnthropicSSEEvent` or `null`. No dependency on `client.ts`'s parser.
- [ ] **Step 4: Write `tests/ask-tools.test.ts`.**
  Cover: `searchCorpus` returns scored results for a keyword in the fixture corpus;
  `readProject` returns chunks for a known slug; returns empty array gracefully for
  unknown slug; `readResume` returns resume chunks; `readLinkedin` returns linkedin
  chunks; `listProjects` returns deduplicated project titles.
- [ ] **Step 5: Write `tests/anthropic-sse.test.ts`.**
  Cover: multi-line frame → correct event object; ping frame → null; malformed JSON →
  null; frame starting with `event: ` line correctly extracts `data: ` line.
- [ ] **Step 6: Confirm suite green.** `npm test && npx tsc --noEmit`.
- [ ] **Step 7: Commit.**
  ```
  git add lib/ask/tools.ts lib/ask/anthropic-sse.ts lib/ask/types.ts \
    tests/ask-tools.test.ts tests/anthropic-sse.test.ts
  git commit -m "feat: client-side tool library and Anthropic-native SSE frame parser"
  ```

**Exit criteria:** New tests pass; `tsc --noEmit` clean; suite 40+/40.

---

### Task 3: Thin Web-standard server proxy (`/api/ask-agent`)

**Files:**
- Create: `api/ask-agent.ts`
- Create: `tests/ask-agent-proxy.test.ts`

**Interfaces:**
```typescript
// api/ask-agent.ts
// Signature: Web-standard Request/Response. No @vercel/node, no Node-only imports.
export default async function handler(req: Request): Promise<Response>

// Client sends:
type AgentRequest = {
  messages: Array<{ role: 'user' | 'assistant'; content: unknown }>;
  session: { id: string };
}

// Session store: in-memory Map, per-instance (no KV, portable)
type SessionRecord = { questionCount: number; advisorUsed: boolean; lastSeen: number }
// Map<sessionId, SessionRecord>. Expire entries where Date.now() - lastSeen > 3600_000.

// Server-pinned constants (never from client):
const MODEL = 'claude-haiku-4-5-20251001'
const MAX_TOKENS = 1500
// SYSTEM_PROMPT: persona block — advocate hard for Trey, cite chunk ids exactly,
//   "that's not in my corpus" for unknowns, one-sentence off-topic deflect.
//   cache_control: { type: 'ephemeral' } on the last system block.
// TOOL_DEFINITIONS: 5 definitions (search_corpus, read_project, read_resume,
//   read_linkedin, list_projects) matching the 5 functions in lib/ask/tools.ts.
//   cache_control: { type: 'ephemeral' } on the last tool definition.
// ADVISOR_TOOL: { type: 'advisor_20260301', name: 'advisor',
//   model: 'claude-opus-4-8' } — included ONLY when !session.advisorUsed.
// Beta header: 'anthropic-beta': 'advisor-tool-2026-03-01'
// Stable order for caching: tools → system → messages.

// Advisor rationing (PESSIMISTIC, no stream inspection needed):
// When advisor tool is included in the request (session.advisorUsed === false),
// immediately set sessionRecord.advisorUsed = true BEFORE streaming begins.
// This prevents a hostile client from hitting Opus multiple times if two parallel
// requests race on the same session.

// Request body sent to Anthropic:
// { model, max_tokens, stream: true,
//   system: [{ type:'text', text: SYSTEM_PROMPT, cache_control:{type:'ephemeral'} }],
//   tools: [...TOOL_DEFINITIONS, ...(advisorUsed ? [] : [ADVISOR_TOOL])],
//   messages: req.messages }  // client messages passed through unchanged

// On success: stream Anthropic response body straight through.
// return new Response(anthropicRes.body, {
//   status: 200,
//   headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' }
// })

// Error paths:
// ASK_AGENT_DISABLED env var set → 503 { fallback: true }
// ANTHROPIC_API_KEY absent → 503 { fallback: true }
// Rate limit hit (reuse createRateLimiter from lib/ask/rate-limit.ts) → 429 { error: '...' }
// session.questionCount >= 10 → 429 { error: 'session_cap' }
// Malformed body → 400 { error: '...' }
// messages array > 50 items OR session.id > 64 chars → 400
```

**Steps:**
- [ ] **Step 1: Implement `api/ask-agent.ts`.**
  Single default export. Parse and validate request body. Check kill switch, API key,
  rate limit, session cap — all return early with appropriate status. Build the Anthropic
  request body server-side (model, system, tools, max_tokens, messages from client).
  Flip `sessionRecord.advisorUsed = true` pessimistically before the fetch call if
  advisor tool is being included. Increment `sessionRecord.questionCount` before
  streaming. Fetch from `https://api.anthropic.com/v1/messages` with raw `fetch`.
  Return `new Response(anthropicRes.body, ...)` to stream bytes through.
- [ ] **Step 2: Verify no platform imports.**
  `grep -n "vercel\|@vercel\|require(" api/ask-agent.ts` must return zero lines.
- [ ] **Step 3: Write `tests/ask-agent-proxy.test.ts`.**
  Mock `fetch` at the module level. Cover:
  - Missing API key → 503 with `{ fallback: true }`.
  - Kill switch (`ASK_AGENT_DISABLED=1`) → 503.
  - Session cap (`questionCount >= 10`) → 429 with `{ error: 'session_cap' }`.
  - Rate limit hit → 429.
  - Malformed body (missing messages, id > 64 chars) → 400.
  - Advisor included on first request; stripped (not in body) on second request for same session.
  - Valid request → fetch called with correct body (model pinned, system present, stream:true).
- [ ] **Step 4: Confirm suite green.** `npm test && npx tsc --noEmit && npm run build`.
- [ ] **Step 5: Commit.**
  ```
  git add api/ask-agent.ts tests/ask-agent-proxy.test.ts
  git commit -m "feat: thin Web-standard agent proxy at /api/ask-agent with session and advisor rationing"
  ```

**Exit criteria:** Proxy file has zero platform-specific imports; proxy tests pass;
suite green; `npm run build` succeeds (vite does not bundle `api/` files but tsc checks them).

---

### Task 4: Client-driven agentic loop and client-side commands

**Files:**
- Create: `lib/ask/agent-loop.ts`
- Create: `lib/ask/commands.ts`
- Modify: `lib/ask/client.ts` (add `askAgentQuestion` export; keep `askQuestion` intact)
- Create: `tests/ask-agent-loop.test.ts`
- Create: `tests/ask-commands.test.ts`

**Interfaces:**
```typescript
// lib/ask/agent-loop.ts
export async function askAgentQuestion(
  question: string,
  session: SessionToken,               // client-side session object (id used for proxy)
  onEvent: (e: AskEvent) => void,
  corpus: Chunk[],
  fetchImpl?: typeof fetch,
): Promise<void>

// Loop algorithm:
// 1. Build messages: [{ role: 'user', content: question }]
// 2. toolTurnCount = 0
// 3. LOOP (toolTurnCount < 4):
//    a. POST { messages, session: { id: session.id } } to /api/ask-agent
//    b. On network error or 503 → emit { type:'local_mode' } → localFallback → return
//    c. Parse Anthropic SSE using parseAnthropicFrame from anthropic-sse.ts:
//       - content_block_start (type:'text') → open text accumulator for this block
//       - content_block_start (type:'tool_use') → open tool accumulator {id, name, json:''}
//       - content_block_start (type:'server_tool_use', name:'advisor') →
//           emit { type:'tool_trace', line:'▸ consulting advisor (opus)…' }
//       - content_block_delta (text_delta) → emit { type:'text', text: delta.text }
//       - content_block_delta (input_json_delta) → append to current tool's json
//       - message_delta: record stop_reason
//    d. If stop_reason !== 'tool_use' OR no tool_use blocks → break
//    e. toolTurnCount++
//    f. For each tool_use block:
//       - Parse input JSON (wrap in try/catch; emit is_error result on parse failure)
//       - Execute matching function from lib/ask/tools.ts
//       - Emit { type:'tool_trace', line: `▸ {name} "{input}" → {hitCount} hits · {ms}ms` }
//       - Collect { type:'tool_result', tool_use_id: id, content: result.content }
//         (is_error: true if parse failed, content: error message)
//    g. Append { role:'assistant', content: [text block (if any), ...tool_use blocks] }
//       Append { role:'user', content: [...tool_result blocks] }
//       (single user message containing ALL tool results — Anthropic protocol)
// 4. Emit { type:'citations' } (build from all tool results' content)
// 5. Emit { type:'done' }

// lib/ask/commands.ts — pure, never calls fetch
export function isClientCommand(input: string): boolean
// Returns true if trimmed lowercase input exactly matches: help, projects,
// resume, contact, clear.
export function handleCommand(
  cmd: string,
  corpus: Chunk[],
  onEvent: (e: AskEvent) => void,
): void
// help  → text: 5-line help menu listing commands + 3 example NL questions
// projects → text: project titles from listProjects(corpus)
// resume → text: first resume chunk headline + link to /resume.pdf
// contact → text: email + github URL (hardcoded from constants, not corpus)
// clear → emit { type: 'clear' }
```

**Steps:**
- [ ] **Step 1: Implement `lib/ask/commands.ts`.** Pure functions; no imports except
  `lib/ask/tools.ts` and `lib/ask/types.ts`.
- [ ] **Step 2: Implement `lib/ask/agent-loop.ts`.** Use `parseAnthropicFrame` from
  `lib/ask/anthropic-sse.ts` — do NOT import or call `createSSEParser` from `client.ts`.
  Read the response body as a `ReadableStream<Uint8Array>`, decode with `TextDecoder`
  (stream: true), accumulate until `\n\n`, parse frames. Carry `localFallback` import
  from `client.ts` for the degraded path.
- [ ] **Step 3: Add `askAgentQuestion` to `lib/ask/client.ts`.** Re-export it from
  `agent-loop.ts`. Do not modify `askQuestion` or any existing exports.
- [ ] **Step 4: Write `tests/ask-agent-loop.test.ts`.** Use vitest + mock fetch.
  Required scenarios:
  - **Tool-turn cap**: mock proxy returns `tool_use` stop_reason on every call →
    loop terminates after 4 tool turns, emits tool_trace × 4 then done (no infinite loop).
  - **Malformed tool_use input**: proxy returns tool_use block with non-JSON input →
    loop sends `is_error` tool_result, continues and eventually emits done (does not throw).
  - **Session cap**: `session.questionCount >= 10` → emit `{type:'session_cap'}` and
    `localFallback` events without any fetch call.
  - **Network error** (fetch throws) → emit `{type:'local_mode'}` + fallback events.
  - **Clean 2-tool-turn exchange**: mock two rounds (tool_use then end_turn) →
    correct sequence: tool_trace × 2, text events, citations, done.
- [ ] **Step 5: Write `tests/ask-commands.test.ts`.**
  - `isClientCommand('help')` → true; `isClientCommand('tell me about trey')` → false.
  - `handleCommand('help', corpus, onEvent)` → text event with "help" in it.
  - `handleCommand('clear', corpus, onEvent)` → `{type:'clear'}` event only.
  - `handleCommand('projects', corpus, onEvent)` → text event listing projects.
- [ ] **Step 6: Confirm suite green.** `npm test && npx tsc --noEmit`.
- [ ] **Step 7: Commit.**
  ```
  git add lib/ask/agent-loop.ts lib/ask/commands.ts lib/ask/client.ts \
    tests/ask-agent-loop.test.ts tests/ask-commands.test.ts
  git commit -m "feat: client-driven agentic loop (4-turn cap, advisor trace) and $0 command dispatcher"
  ```

**Exit criteria:** All loop scenarios pass; tsc clean; existing 40 unit tests still
pass; `askQuestion` in `client.ts` is unmodified.

---

### Task 5: AskTerminal component (evolve AskPanel in place)

**Files:**
- Modify: `components/AskPanel.tsx` (rename export to `AskTerminal`; overhaul internals)
- Modify: `App.tsx` (update import name only: `AskPanel` → `AskTerminal`)

**Interfaces:**
```typescript
// Props: unchanged from current AskPanel
interface AskTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToSlide: (index: number) => void;
  initialQuery?: string;        // must survive — used by ASK-button CTA on B-spec card
}

// New terminal line model (replaces answer/status/error scalars)
type TerminalLine =
  | { kind: 'boot';     text: string }    // one-time boot banner
  | { kind: 'user';     text: string }    // user input echo
  | { kind: 'trace';    text: string }    // tool trace (dim, mono)
  | { kind: 'answer';   text: string }    // streaming answer — mutable last entry
  | { kind: 'error';    text: string }
  | { kind: 'system';   text: string }    // local_mode, session_cap notices
  | { kind: 'citation'; citations: Citation[] }

// Session: initialized once on component mount; id persists while mounted
// const [session] = useState<SessionToken>(() => ({
//   id: crypto.randomUUID(), questionCount: 0, advisorUsed: false
// }))
// questionCount is advisory (server 429 is authoritative); advisorUsed not used client-side.
```

**Steps:**
- [ ] **Step 1: Add boot sequence.**
  In the `useEffect` for `isOpen` → true, after focusing input, `setLines([{kind:'boot',
  text:'ask-my-work v2 · corpus mounted · {N} projects indexed · type help or just ask'}])`.
  Derive N from `listProjects(CORPUS).hitCount` at mount.
- [ ] **Step 2: Replace scalar state with TerminalLine history.**
  Replace `answer`, `status`, `error` state with `lines: TerminalLine[]`. Add helper
  `appendLine` and `appendToLastAnswer` (accumulate streaming text chunks into the
  last `{kind:'answer'}` entry; create new entry if last is not answer).
- [ ] **Step 3: Wire `submit` to `askAgentQuestion` and `handleCommand`.**
  Check `isClientCommand(q)` first → `handleCommand(q, CORPUS, onEvent)`; otherwise
  → append `{kind:'user', text:q}`, call `askAgentQuestion(q, session, onEvent, CORPUS)`.
  Map incoming AskEvent types to `setLines` mutations:
  - `text` → `appendToLastAnswer(text)` (or create new answer line)
  - `tool_trace` → `appendLine({kind:'trace', text: e.line})`
  - `citations` → `appendLine({kind:'citation', citations: e.citations})`
  - `error` → `appendLine({kind:'error', text: e.message})`
  - `local_mode` → `appendLine({kind:'system', text:'live engine offline — running on local reserves'})`
  - `session_cap` → `appendLine({kind:'system', text:'session limit reached — local answers only'})`
  - `clear` → `setLines([{kind:'boot', text: bootText}])`
  - `done` → set busy=false
- [ ] **Step 4: Render TerminalLine history.**
  Map `lines` to JSX. Use CSS classes:
  - `ask-panel__boot-line` for boot
  - `ask-panel__user-line` for user (prefix `> `)
  - `ask-panel__trace` for trace
  - `ask-panel__answer` for answer (existing class, reuse)
  - `ask-panel__error` for error (existing class, reuse)
  - `ask-panel__system` for system notices
  Render citations exactly as today (existing `ask-panel__citations` markup).
- [ ] **Step 5: Preserve all existing DOM contracts.**
  Keep `role="dialog"`, `aria-modal="true"`, `aria-label="Ask about Trey's work"`,
  `data-testid="ask-panel"`, `data-testid="ask-answer"` on the answer element (use
  `data-testid="ask-answer"` on the scrollable answer area or last answer line),
  `data-testid="citation-{n}"`. Focus trap and arrow-key suppression code is unchanged.
- [ ] **Step 6: Preserve initialQuery prefill.**
  `useEffect([isOpen])`: when `isOpen` becomes true and `initialQuery` is set, after
  boot line, immediately call `submit(initialQuery)`. This preserves the CTA contract.
- [ ] **Step 7: Show starters when history is empty (or boot-only).**
  Show `STARTERS` when `lines.length <= 1` (only boot line). Hide after first
  user input.
- [ ] **Step 8: Rename export; update App.tsx.**
  Change `const AskPanel` → `const AskTerminal` at bottom of file. Update
  `export default AskPanel` → `export default AskTerminal`. In `App.tsx`, change
  import name only (path unchanged).
- [ ] **Step 9: Run e2e suite.** `npm run test:e2e` → 11/11. Fix any regressions
  before committing.
- [ ] **Step 10: Commit.**
  ```
  git add components/AskPanel.tsx App.tsx
  git commit -m "feat: AskPanel evolves to AskTerminal — client loop, boot sequence, tool traces, terminal history"
  ```

**Exit criteria:** 11/11 e2e; `data-testid` contracts intact; `initialQuery` prefill
works; starters appear on open.

---

### Task 6: Cyberpunk CSS tokens and terminal aesthetic

**Files:**
- Modify: `styles/index.css` (new `--term-*` tokens in `:root`; extend ask-panel block)

**Interfaces:**
```css
/* New tokens in :root */
--term-glow: 0 0 8px rgba(232, 93, 58, 0.35);
--term-scanline: repeating-linear-gradient(
  0deg,
  transparent,
  transparent 2px,
  rgba(0, 0, 0, 0.04) 2px,
  rgba(0, 0, 0, 0.04) 4px
);
--term-caret: block;

/* New rule classes for terminal lines (add to ask-panel block) */
.ask-panel__boot-line  { ... }   /* dim entrance, Departure font, label size */
.ask-panel__user-line  { ... }   /* accent color, prompt prefix via ::before content:'> ' */
.ask-panel__trace      { ... }   /* smaller, 0.7em opacity, mono font, --term-glow shadow */
.ask-panel__system     { ... }   /* italic, tertiary color */

/* Reduced-motion collapses: blink → static; scanline opacity ≤ 2%; glow removed */
```

**Steps:**
- [ ] **Step 1: Add `--term-*` tokens to `:root` block** (insert near existing `--z-*`
  and `--ease-*` groups for token locality).
- [ ] **Step 2: Scanline overlay on `.ask-panel__inner`.**
  Add `::before` pseudo-element: `content:''`, `position:absolute`, `inset:0`,
  `pointer-events:none`, `background:var(--term-scanline)`, `z-index:0`. Ensure
  `.ask-panel__inner` has `position:relative` and children are `position:relative;
  z-index:1` so they appear above the overlay.
- [ ] **Step 3: Phosphor glow on prompt and accents.**
  Add `text-shadow: var(--term-glow)` to `.ask-panel__title`, `.ask-panel__input:focus`,
  `.ask-panel__trace`, and `.ask-panel__user-line`. Glow is additive — it supplements
  contrast, never substitutes for it.
- [ ] **Step 4: Block caret on input.**
  Add `caret-shape: var(--term-caret)` to `.ask-panel__input`. Add a 1s `steps(1)`
  blink animation on the caret color: `animation: term-blink 1s steps(1) infinite`.
  Define `@keyframes term-blink { 50% { caret-color: transparent; } }`.
- [ ] **Step 5: New line classes.**
  `.ask-panel__boot-line`: `font-family: var(--font-departure)`, `font-size:
  var(--text-label)`, `opacity: 0.55`, entrance via `animation: fade-in 0.4s ease`.
  `.ask-panel__user-line`: `color: var(--accent)`, `::before { content: '> '; }`.
  `.ask-panel__trace`: `font-family: var(--font-mono, monospace)`, `font-size: 0.8em`,
  `opacity: 0.6`, `text-shadow: var(--term-glow)`.
  `.ask-panel__system`: `font-style: italic`, `color: var(--text-tertiary)`.
- [ ] **Step 6: Reduced-motion path.**
  Inside `@media (prefers-reduced-motion: reduce)`:
  - `.ask-panel__input` → `animation: none; caret-color: var(--accent)` (static block).
  - `.ask-panel__inner::before` → `background: rgba(0,0,0,0.02)` (flat, ≤2% opacity).
  - All `--term-glow` usages → `text-shadow: none`.
  - `.ask-panel__boot-line` → `animation: none; opacity: 0.55` (immediate, no fade).
- [ ] **Step 7: AA contrast check.**
  Open `npm run dev`, inspect each new class in DevTools accessibility panel.
  Text color must pass 4.5:1 WITHOUT the glow counted. Document pass in commit message.
- [ ] **Step 8: Confirm full suite green.**
  `npm test && npx tsc --noEmit && npm run build && npm run test:e2e` (11/11).
- [ ] **Step 9: Commit.**
  ```
  git add styles/index.css
  git commit -m "style: cyberpunk terminal tokens (--term-glow/scanline/caret), reduced-motion safe, AA verified"
  ```

**Exit criteria:** Suite green; `prefers-reduced-motion` verified manually;
contrast passes; no neon hues outside existing palette.

---

### Task 7: Test suite updates — new e2e scenarios and eval extensions

**Files:**
- Create: `e2e/ask-terminal.spec.ts` (7 new Playwright scenarios)
- Modify: `evals/` (add grounding, tone, refusal, KKBOX checks)

**Interfaces:**
```typescript
// e2e/ask-terminal.spec.ts — all use page.route() to intercept /api/ask-agent
// Scenario 1 — Boot sequence:
//   open panel → "ask-my-work v2" visible within 2 s; no network request fired.
// Scenario 2 — NL question with 2 tool turns:
//   mock returns tool_use (round 1) then end_turn (round 2) →
//   expect ▸ trace lines in DOM → expect answer text → citations rendered.
// Scenario 3 — Client command (help):
//   submit 'help' → no request to /api/ask-agent fired → response text appears.
// Scenario 4 — Client command (clear):
//   submit a question, get answer, submit 'clear' → history resets to boot line only.
// Scenario 5 — Session cap:
//   mock proxy to return 429 { error:'session_cap' } → session_cap system line appears.
// Scenario 6 — Budget-dead (proxy 503):
//   mock /api/ask-agent → 503 { fallback:true } → local_mode system line appears;
//   fallback answer appears without crash.
// Scenario 7 — Advisor trace:
//   mock includes server_tool_use block (name:'advisor') in SSE → DOM shows
//   "consulting advisor (opus)…" trace line.

// evals/ extensions (run against live engine pre-launch):
// grounding: submit factual question → every factual sentence has [N] citation pattern
// tone: response does not begin with sycophantic opener (regex: /^(great|sure|absolutely)/i)
// refusal: off-topic "write a poem about cats" → ≤ 30 words, no ▸ trace in response
// KKBOX: ask "tell me about the KKBOX project" → answer contains correct KKBOX facts
//   from B-spec corpus (music streaming platform, specific tech stack)
```

**Steps:**
- [ ] **Step 1: Run existing 11 e2e tests first.** `npm run test:e2e` → 11/11.
  Fix any regression from Tasks 1–6 before writing new tests.
- [ ] **Step 2: Write `e2e/ask-terminal.spec.ts`.** 7 scenarios listed above.
  All mock `/api/ask-agent` via `page.route()`. For SSE mocking, use
  `route.fulfill({ body: '...', contentType: 'text/event-stream' })` with
  correctly formatted Anthropic SSE frames (multi-line `event:\ndata:\n\n`).
- [ ] **Step 3: Run new e2e suite.** `npm run test:e2e` → 18/18.
- [ ] **Step 4: Add grounding eval** to `evals/` harness. Fixture: a known factual
  question about FerroML. Assert: every factual sentence (one per `.`) contains `[N]`.
- [ ] **Step 5: Add tone eval.** Assert: response does not match
  `/^(great|sure|absolutely|of course)/i`.
- [ ] **Step 6: Add refusal eval.** Off-topic input → response ≤ 30 words AND
  contains no `▸` character (no tool traces).
- [ ] **Step 7: Add KKBOX fact eval.** Assert response to "tell me about KKBOX"
  contains the KKBOX-specific facts from the B-spec corpus fixtures.
- [ ] **Step 8: Confirm full suite.** `npm test` (≥ 46/40+) + `npm run test:e2e` (18/18).
- [ ] **Step 9: Commit.**
  ```
  git add e2e/ask-terminal.spec.ts evals/
  git commit -m "test: 7 Ask Terminal e2e scenarios + grounding/tone/refusal/KKBOX evals"
  ```

**Exit criteria:** 18/18 e2e; evals pass against the live engine (run evals separately
after terminal is deployed; they are allowed to fail in CI without the capped key).

---

### Task 8: Live cost verification (final gate — requires capped API key)

**Files:**
- Create: `scripts/cost-check.mts` (one-shot verification script, never shipped in build)

**Interfaces:**
```typescript
// scripts/cost-check.mts
// Sends 10 representative questions to /api/ask-agent running on localhost:3000.
// For each, reads usage.input_tokens, usage.output_tokens,
//   usage.cache_read_input_tokens from the message_start SSE event.
// Questions mix: 2 factual (cite heavy), 2 tool-heavy (multi-turn), 2 off-topic
//   (cheap deflect), 1 advisor-triggering, 3 project-specific.
// Cost formula (Haiku 4.5):
//   input: $1.00 / 1M tokens; output: $5.00 / 1M tokens; cache read: $0.25 / 1M tokens
// Assertions:
//   - Total cost for 10 questions ≤ $0.25
//   - cache_read_input_tokens > 0 on questions 2+ (caching is working)
//   - No question individually costs > $0.05
// Prints: per-question breakdown, total cost, cache hit %, projected cost for 300 q.
// Exit 0 if assertions pass; exit 1 with details if not.
```

**Steps:**
- [ ] **Step 1: Implement `scripts/cost-check.mts`.**
  Stream each request to `/api/ask-agent`, parse the `message_start` event for
  usage. Accumulate across all 10 questions. Apply cost formula. Print summary table.
- [ ] **Step 2: Start dev server and run script.**
  ```bash
  npx vite &  # starts localhost:3000
  npx tsx scripts/cost-check.mts
  ```
  Expected: exits 0, total ≤ $0.25.
- [ ] **Step 3: Verify prompt caching is active.**
  If `cache_read_input_tokens === 0` on questions 2+, the system prompt + tool
  definitions are below Haiku 4.5's 4096-token minimum cacheable prefix. Fix: pad the
  system prompt with the corpus project index summary (list of 9 project slugs +
  one-line descriptions) until the prefix clears 4096 tokens, then re-run.
- [ ] **Step 4: Extrapolate and document.**
  Script prints: `Projected cost for 300 questions: $X.XX`. Must be ≤ $5.00.
- [ ] **Step 5: Verify kill switch.**
  Set `ASK_AGENT_DISABLED=1` in env, reload dev server, hit `/api/ask-agent` with
  curl → verify 503 + `{ fallback: true }`. Open terminal in browser → verify
  `live engine offline — running on local reserves` system line appears at boot.
- [ ] **Step 6: Commit.**
  ```
  git add scripts/cost-check.mts
  git commit -m "chore: live cost verification script — Haiku 4.5 agentic pricing, cache hit check"
  ```

**Exit criteria:** Script exits 0; cache is active (hit rate > 0 after q1); projected
cost ≤ $5.00/300 q; kill switch delivers graceful local mode.

---

### Task 9: Real-browser walkthrough and z-index regression re-test

**Files:** No code changes expected. Screenshots inspected manually — not just gates.

**Steps:**
- [ ] **Step 1: Re-test mobile sheet z-index regression (bac35cf).**
  Open the site on a mobile viewport (375 × 812). Open AskTerminal via ASK button.
  Verify: the close button is above the header (`z-index: var(--z-sheet)` > header).
  Verify: the panel covers the full screen. Dismiss with close button and Esc. If
  regression recurs, fix before proceeding.
- [ ] **Step 2: DPR 1 and 1.25 rendering.**
  Open DevTools device emulator at DPR 1 (baseline) and DPR 1.25. Take screenshots.
  Verify: scanline overlay does not create visible moiré artifact at 1.25 DPR; glow
  is not blown out; block caret is sharp.
- [ ] **Step 3: Reduced-motion visual.**
  Enable `prefers-reduced-motion` in OS accessibility settings (or DevTools emulation).
  Open AskTerminal. Verify: boot line appears instantly (no fade); no caret blink;
  scanline is static at ≤2% opacity; glow is absent. Take screenshot.
- [ ] **Step 4: Citation deep-link into carousel.**
  Submit a question that returns a project citation with a `slideIndex`. Click the
  citation button. Verify: AskTerminal closes and carousel snaps to the correct slide.
  (This exercises the `onClose()` + `onGoToSlide(index)` contract.)
- [ ] **Step 5: Budget-exhausted boot.**
  Set `ASK_AGENT_DISABLED=1`, reload. Open AskTerminal. Verify: boot line appears,
  then immediately `local_mode` system line (`live engine offline — running on local
  reserves`). Submit a question. Verify: local fallback answer is returned without error.
- [ ] **Step 6: advisor trace rendering.**
  Submit a question that triggers the advisor. Verify: `▸ consulting advisor (opus)…`
  trace line appears in the terminal history while the answer streams.
- [ ] **Step 7: initialQuery prefill via ASK CTA.**
  From the B-spec featured card's ASK button (or simulate by setting `initialQuery`),
  verify the query is prefilled and immediately submitted — no extra user interaction
  required.
- [ ] **Step 8: No code changes needed — document findings.**
  If any step reveals a bug, fix it in a new micro-commit before closing this task.
  Only commit if code changed: `git commit -m "fix: [specific issue from walkthrough]"`.

**Exit criteria:** All 8 browser scenarios pass visual inspection; no regression on
mobile z-index; reduced-motion path verified; no code changes outstanding.
