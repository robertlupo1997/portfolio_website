---
date: 2026-07-09T08:34:53-04:00
researcher: Claude (Fable 5)
git_commit: dac6ea47a63804834502c59d8ecee89b48520fec
branch: main
repository: portfolio_website (Windows-mounted clone at /mnt/c/Users/Trey/Downloads/portfolio_website);
  references ~/projects/fable25 (= github.com/robertlupo1997/fable-25-local, at b5cbc08)
topic: "Adopt the FABLE 25 'monolith' site's design into the portfolio — next session decides the approach"
tags: [design-adoption, monolith, fable25, brutalist, rlupo-portfolio]
status: complete
last_updated: 2026-07-09
type: handoff
---

# Handoff: adopt monolith's design into the portfolio (approach TBD next session)

## Task(s)

1. ✅ **Context built this session (separate project):** the FABLE 25 LOCAL collection — 25
   procedural websites built end-to-end by Fable agents from Nick Saraev's prompt, complete
   and pushed to github.com/robertlupo1997/fable-25-local. Full story in that repo's
   README/PROMPTS/BRIEFS and its `/guide` route.
2. ⏳ **NEXT SESSION'S TASK (Trey's explicit instruction):** *"I want to adopt
   http://localhost:4179/monolith/ into the current design. the next chat will decide how
   to do this."* — i.e., the decision about HOW (full reskin vs. hybrid vs. borrowing
   signature moves) is deliberately left to the next session, with Trey. Do not
   pre-commit to an approach; brainstorm/decide with him first.
3. **No portfolio source was changed this session.** The latest source change on `main`
   remains the verified Fable design pass + mobile fix (`b242e12`); commits after it are
   docs/handoffs only.

## Critical References

- **Monolith source (the thing to adopt):** `/home/tlupo/projects/fable25/sites/monolith/`
  — `index.html` (318 lines), `style.css` (1242), `main.js` (186). Live at
  `http://localhost:4179/monolith/`; self-documentation at
  `http://localhost:4179/monolith/guide/` (the brief it received, technique excerpts, pass
  history). Also on GitHub: `robertlupo1997/fable-25-local` → `sites/monolith/`.
- **Monolith's brief:** `/home/tlupo/projects/fable25/BRIEFS.md`, Wave 1 section, entry
  "6. `monolith`" — concept: "brutalist poster compilation… disciplined excess… chaos
  gridded underneath"; prove: "loud can be rigorous."
- **Portfolio design system:** `rlupo-portfolio/styles/index.css` (tokens at :34-36),
  components in `rlupo-portfolio/components/`, scramble hook
  `rlupo-portfolio/hooks/useTextScramble.ts`.

## Learnings (verified facts the decision will need)

- **What monolith is, concretely:**
  - Palette (its `style.css:9-13`): `--ink: #1c1a17`, `--concrete: #b9b5ad`,
    `--orange: #e8551a`. A LIGHT theme — concrete background, ink text.
  - Type (its `style.css:17-18`, loaded `index.html:10`): `--font-display: 'Archivo
    Black'`, `--font-body: 'Inter Tight'` (wghts 400/500/700/900), via Google Fonts.
  - Signature moves verified in source: letter-by-letter scramble on the cover title
    (`main.js:10-15`, `[data-scramble]`); hover/focus-revealed grid skeleton overlay
    (`style.css:212`, `:232-233` — `.poster:hover .grid-overlay`); CSS-only concrete
    texture (layered repeating-linear-gradients); scroll-snap poster pages.
- **The two designs are cousins, not strangers:** the portfolio already has a scramble
  effect (`hooks/useTextScramble.ts`, reduced-motion-aware at line 37) and an
  orange-family accent (`--accent: #F0704C`, `--accent-text: #FA9E78` at
  `styles/index.css:34-35`) vs monolith's `#e8551a`. Display-scale titles were already
  introduced by the `b242e12` design pass. The biggest adoption decision is **dark vs
  light**: portfolio is a dark terminal aesthetic (Departure Mono + Space Grotesk,
  `styles/index.css:2,10`); monolith is light concrete with hard grids.
- **Contrast trap, pre-flagged by monolith itself** (its `style.css:477` comment): "ink on
  concrete = ~9:1; orange (#e8551a) on concrete fails AA at ~1.85:1" — monolith uses
  orange for large display/decorative only. The portfolio's WCAG discipline
  (`styles/index.css:26-27` documents its audited ratios) must survive any adoption.
- **Standing repo situation (unchanged from 2026-07-08 handoff):** this clone
  (Windows-mounted, DrvFs, `core.fileMode=false` set) is 22 commits ahead of origin,
  push gated on Trey's "Vercel Step 0"; the WSL-native clone
  `/home/tlupo/projects/portfolio_website` is still at pre-design-pass `086607b`. Trey
  ruled WSL-native canonical after the push happens. Committing this handoff makes it 23
  ahead.
- **fable25 is a separate repo on ext4** (`~/projects/fable25`), pushed to GitHub at
  `b5cbc08` — do NOT confuse the two working trees. Its untracked `qa/` dir holds all QA
  screenshots incl. `qa/monolith/` pass history and `qa/_contact-sheet.png` (all 25 heroes
  in one image).

## Recent changes

None to portfolio source this session. This handoff file + `HANDOFF.md` pointer update are
the only portfolio-repo changes (committed together).

## Verification

| Claim | Command run this session | Result |
|---|---|---|
| portfolio HEAD / branch | `git rev-parse HEAD` / `--abbrev-ref HEAD` | `dac6ea4…fec` / `main` |
| 22 ahead of origin (pre-handoff-commit) | `git log origin/main..HEAD --oneline \| wc -l` | `22` |
| monolith source sizes | `wc -l sites/monolith/{index.html,style.css,main.js}` | 318 / 1242 / 186 |
| monolith palette tokens | `grep -n "b9b5ad\|1c1a17\|e8551a" sites/monolith/style.css` | lines 9, 10, 13 (+ comment line 4) |
| monolith fonts | `grep -no "family=Archivo…" index.html`; `grep -n "--font" style.css` | `index.html:10` Archivo Black + Inter Tight; `style.css:17-18` |
| monolith scramble | `grep -n "scramble" sites/monolith/main.js` | lines 2, 10, 15 (`[data-scramble]`) |
| monolith grid-overlay reveal | `grep -n "grid-overlay\|poster:hover" style.css` | lines 212, 232-233 |
| monolith AA comment (orange trap) | grep hit | `style.css:477` |
| monolith guide exists | `ls sites/monolith/guide/` | `index.html` |
| portfolio tokens | `grep -n '^\s*--accent:' styles/index.css` + accent-text/ink grep | `:34 #F0704C`, `:35 #FA9E78`, `:36 #262622` |
| portfolio fonts | `grep -rn "font-family" styles/index.css \| head -3` | `:2` Departure Mono, `:10` Space Grotesk |
| portfolio scramble hook exists | `ls hooks/useTextScramble.ts` | exists |
| portfolio dev server | `curl -w %{http_code} http://localhost:3000` | `200` — restart: `cd rlupo-portfolio && npm run dev` |
| monolith live | `curl -w %{http_code} http://localhost:4179/monolith/` | `200` — restart: `python3 -m http.server 4179 --directory /home/tlupo/projects/fable25/sites &` |
| fable25 repo HEAD | `git -C ~/projects/fable25 rev-parse HEAD` | `b5cbc08…aeb` (pushed to GitHub) |
| portfolio tests/build | — | STALE — not re-run this session; last verified green 2026-07-08 (40/40, build 7.26s); no source changed since |

## Artifacts

- `thoughts/handoffs/2026-07-09_08-34-53_monolith-design-adoption.md` — this document.
- `HANDOFF.md` (repo root) — pointer block updated to this file.
- (Separate repo) `github.com/robertlupo1997/fable-25-local` — the full FABLE 25
  collection incl. monolith, its guide, PROMPTS.md, BRIEFS.md.

## Action Items & Next Steps

1. **Decide the adoption approach WITH Trey** (his instruction: next chat decides).
   Open monolith live + its `/guide`, then frame the choice — candidate axes:
   (a) full reskin: flip the portfolio to concrete-light brutalist (biggest change:
   dark→light, Departure Mono→Archivo Black/Inter Tight);
   (b) hybrid: keep the dark terminal shell, adopt monolith's structural moves (hard grid,
   poster-scale section typography, scroll-snap, grid-overlay reveal);
   (c) signature-moves-only: port the grid-overlay reveal, concrete texture technique, and
   poster typographic scale into the existing system as accents.
   Use `superpowers:brainstorming` before building anything.
2. **Mind the AA trap** if adopting the light scheme: `#e8551a`-class orange fails on
   concrete for text (monolith's own `style.css:477`); the portfolio's audited token
   discipline (`styles/index.css:26-36`) is the pattern to follow.
3. **Standing gates unchanged:** no push until Trey's Vercel Step 0; after push, sync +
   switch to the WSL-native clone as canonical; touch-swipe on mobile scrollable column
   still unverified on a real device (from 2026-07-08 handoff).

## Other Notes

- The fable25 static server on :4179 was started with `(python3 -m http.server 4179
  --directory sites &)` from `/home/tlupo/projects/fable25`; it and the :3000 vite server
  are session-fragile — both have restart commands in the Verification table.
- Monolith QA history (what its three critique passes found/changed): its guide page, plus
  `~/projects/fable25/qa/monolith/` screenshots (untracked, local only).
- The full prompt lineage for how monolith came to exist: `~/projects/fable25/PROMPTS.md`
  (mission prompt + agent templates) and `BRIEFS.md` (its brief).
