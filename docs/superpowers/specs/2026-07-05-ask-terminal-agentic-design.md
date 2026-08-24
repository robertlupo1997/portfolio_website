# Ask Terminal — agentic AI section, designed for a $5 budget

**Date:** 2026-07-05 · **Author:** Claude (Fable 5) with Trey (brainstormed live, all
decisions his) · **Status:** APPROVED (design); implementation plan post-Fable (Opus)
**Relation to other specs:** builds ON the approved C spec
(`2026-07-05-ai-section-design-spec.md` — the launch restyle) and B spec
(`2026-07-05-project-improvement-spec.md` — the Ask-My-Work featured card whose CTA opens
this). Supersedes neither.

## Decisions (locked 2026-07-05 evening)

1. **Sequencing:** launch (Jul 11) ships the CURRENT panel restyled per the C spec — the
   terminal is never a launch blocker. The terminal is the post-launch flagship; if Opus
   finishes early it may ship at launch. One component evolves; nothing is thrown away.
2. **Access model:** fully live for every visitor (no replay mode), protected by caps
   (§Cost controls). Capacity ≈ 250–300 agentic questions on the ~$5 workspace cap.
3. **Aesthetic:** cyberpunk scoped to the terminal, built from the existing palette
   (coral glow, no neon-green). FUTURE-MAYBE (Trey): promote the treatment site-wide —
   therefore every effect is tokenized so it can propagate later.
4. **Loop architecture:** client-driven; server is a thin, portable proxy.
5. **Portability:** no Vercel lock-in — Web-standard `fetch` handler, no platform APIs;
   Cloudflare Workers/Pages migration must be an adapter, not a rewrite.

## What it is

A Claude-Code-style terminal in the browser, scoped to Trey's work: it reasons, runs RAG
over the project corpus, reads the resume and LinkedIn data, advocates for Trey with
citations, and escalates to a smarter model when a question is hard. It is deliberately
NOT a general coding agent — the tool surface is read-only corpus access.

## 1. Component & mounting

- `AskTerminal` evolves from `AskPanel` in place: same mounts (Cmd/Ctrl-K, header ASK
  button, `/ask` route via history.replaceState), same focus trap/Esc/arrow-suppression
  contracts (verified 2026-07-03 — do not re-architect), same mobile full-screen sheet
  (z-index regression bac35cf must be re-tested).
- The C-spec restyle lands FIRST and is terminal-compatible by construction (same tokens,
  same CSS block).

## 2. Interaction grammar

- Natural language primary. Client-side commands that never touch the API ($0):
  `help`, `projects`, `resume`, `contact`, `clear`.
- Boot sequence on open (~1s, static, $0):
  `ask-my-work v2 · corpus mounted · 9 projects indexed · type help or just ask`.
- Tool calls render as log lines as they execute:
  `▸ rag.search "automl rust" → 3 hits · 12ms`
  `▸ read ferroml/README → 4 chunks`
  `▸ consulting advisor (opus)…`

## 3. Agent architecture

**Client (browser) owns the loop.** Tools execute client-side against the corpus that
already ships in the bundle (it powers today's local fallback):

| Tool | Backing | Notes |
|---|---|---|
| `search_corpus(query)` | existing `lib/ask/search.ts` | top-k chunks with ids |
| `read_project(slug)` | corpus chunks by project | full README chunks |
| `read_resume()` | corpus resume chunk | |
| `read_linkedin()` | NEW corpus chunk (§9) | |
| `list_projects()` | constants/corpus index | |

Loop: user msg → POST proxy (one model turn) → if `stop_reason == "tool_use"`, execute
tools locally, render traces, append `tool_result`s (all in ONE user message), repeat.
Cap 4 tool-turns per question.

**Server = thin proxy** (`/api/ask-agent`), Web-standard `fetch` handler, no SDK, no
platform APIs:
- Accepts ONLY `{messages, session}` from the client. Server pins: `model`
  (`claude-haiku-4-5`), `system` (persona, server-side so it is tamper-resistant and
  cacheable), `tools` (the 5 definitions + advisor), `max_tokens` (~1500),
  advisor ration, beta header. Client-supplied model/system/tools are ignored —
  a hostile client must not be able to upgrade itself to Opus or strip the persona.
- Streams SSE straight through (reuse existing `lib/ask/sse.ts` client parsing).
- Rate limiting: per-IP (existing `rate-limit.ts` approach), in-memory per instance —
  portable, no KV lock-in.
- Kill switch: env var `ASK_AGENT_DISABLED=1` → 503 → client boots in local mode.

**Models:**
- Executor: `claude-haiku-4-5` ($1/$5 per MTok) — fast enough to feel terminal-native.
- Advisor: `claude-opus-4-8` via the API advisor tool
  (`{"type": "advisor_20260301", "name": "advisor", "model": "claude-opus-4-8"}`,
  beta header `advisor-tool-2026-03-01`; Haiku→Opus is a valid executor/advisor pair).
  Ration: ~1 consult/session, enforced server-side (strip the advisor tool from the
  request after first use in a session). Rendered honestly in the terminal.
- Prompt caching: `cache_control` on the last system block; stable order
  tools→system→messages. NOTE: Haiku 4.5 minimum cacheable prefix is 4096 tokens —
  persona + 6 tool defs should clear it; verify with `usage.cache_read_input_tokens`
  during implementation and pad with the corpus index summary if short.

## 4. Cost controls (layered)

| Layer | Value |
|---|---|
| Per-IP rate limit | existing mechanism |
| Questions/session | ~10 |
| Tool-turns/question | 4 |
| max_tokens/turn | ~1500 |
| Advisor consults/session | 1 |
| Hard backstop | Anthropic workspace cap (~$5): API refuses → proxy 503 → local fallback |

Expected cost ≈ $0.015–0.02 per agentic question with caching → 250–300 questions.
Budget exhaustion is a DESIGNED state, not an error: terminal prints
`live engine offline — running on local reserves` and answers from the local engine.

## 5. Portability contract

- Proxy: single file, `(request: Request) => Promise<Response>`, raw `fetch` to
  `api.anthropic.com` — deployable to Vercel (edge/serverless) and Cloudflare Workers
  with ≤5-line adapters each. No `require("vercel/*")`, no Node-only APIs.
- Site: static Vite build → any static host (Cloudflare Pages ready).
- Acceptance test for this section: the proxy file imports nothing platform-specific.

## 6. Cyberpunk treatment (terminal-scoped, tokenized)

All effects derive from existing palette tokens; new tokens so a future site-wide pass
can promote them:

| Token | Value (initial) | Use |
|---|---|---|
| `--term-glow` | 0 0 8px rgba(232,93,58,0.35) | text-shadow on prompt/accents (coral phosphor) |
| `--term-scanline` | repeating-linear-gradient, ≤4% opacity | overlay on terminal bg |
| `--term-caret` | block, blink ~1s steps | input caret |
| stream cadence | natural SSE chunking, no artificial delay | output |

Rules: `prefers-reduced-motion` collapses blink/flicker/scanline animation (static
overlay ok at ≤2%); AA contrast holds everywhere (glow is additive, never replaces
contrast); no neon hues outside the existing palette; the rest of the SITE stays
Invisible Frame.

## 7. Persona & honesty

System prompt contract: advocate hard for Trey, but every factual claim must trace to a
tool result; cite chunk ids exactly like the current panel; answer "that's not in my
corpus — ask me about X instead" rather than fabricate; deflect off-topic/abuse politely
and cheaply (no tool calls). Recruiters WILL try to trip it; the eval suite (existing
`evals/` harness) extends with: grounding checks (no uncited factual claims), tone
checks (confident, not sycophantic), refusal checks (off-topic), and the KKBOX/stack
facts from the B spec as truth fixtures.

## 8. Failure behavior

| Failure | Behavior |
|---|---|
| No key/budget dead at boot | local mode from boot (existing fallback engine) |
| API error mid-loop | terminal error line + local-fallback answer for that question |
| Advisor unavailable/rationed | answer without it, no user-visible error |
| Tool error (bad slug etc.) | `is_error` tool_result, model recovers |

## 9. Data prep (Trey, ~10 min, one-time)

LinkedIn export → `content/linkedin.md` (headline, roles + dates, education, 2–3
recommendation quotes worth citing) → corpus-builder ingests as chunks with ids.
Facts must agree with resume.txt and the B-spec card fixes (single source of truth).

## 10. Testing & verification

- Unit: the 5 client tools (pure functions over corpus).
- e2e (mocked proxy): boot, NL question with 2 tool calls, command handling, budget-dead
  path, advisor trace rendering.
- Evals: §7 suite, run against the live engine pre-launch.
- Real-browser walkthrough (hard-won lesson): mobile sheet close button above header,
  dpr 1 and 1.25, reduced-motion, citation deep-link into carousel, budget-exhausted
  boot. Screenshots inspected, not just gates.
- Budget burn test: script 10 agentic questions, read `usage` fields, extrapolate cost,
  confirm ≤$0.25.

## Out of scope (explicit)

Whole-site cyberpunk (future-maybe, tokens ready), replay/recording mode, write-tools of
any kind, GitHub live fetching, Managed Agents/containers, chat history persistence
across visits.
