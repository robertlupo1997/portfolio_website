---
date: 2026-07-08T09:36:54-04:00
researcher: Claude (Sonnet 5)
git_commit: b242e121cac85a15d86730628a10ddb23819ea04
branch: main
repository: portfolio_website — two divergent local clones exist, see Learnings; this
  session's work is committed only in the Windows-mounted one
  (/mnt/c/Users/Trey/Downloads/portfolio_website, = C:\Users\Trey\Downloads\portfolio_website)
topic: "Verified Fable's autonomous design pass, fixed a real mobile bug it couldn't have
  caught, discovered the repo exists as two diverged clones, drafted the next Fable prompt"
tags: [fable, design-review, mobile-css-bug, wsl-drvfs, repo-consolidation, visual-qa]
status: complete
last_updated: 2026-07-08
type: handoff
---

# Handoff: Fable design pass verified + shipped, mobile bug found and fixed, repo split discovered

## Task(s)

1. ✅ **Verify a prior autonomous Claude Fable 5 design pass was legitimate, not a prompt
   injection.** Confirmed via independent evidence (see Verification table): FABLE_CHANGES.md
   existed on disk, its WCAG contrast math was independently recomputed and matched exactly,
   every claimed code change matched the actual diff line-for-line.
2. ✅ **Fix the broken local toolchain** (`node_modules/.bin/*` shims were 0 bytes from a
   WSL/DrvFs cross-filesystem sync failure) so build/test/browser QA could run at all.
3. ✅ **Do the real visual QA the Fable sandbox couldn't do** — no browser in that sandbox.
   Screenshotted desktop/mobile/short-viewport with headless Chromium via Playwright.
4. ✅ **Found and fixed a real bug during that QA**: on mobile, the fallback project image and
   the title/problem-line text shared CSS `grid-row: 1`, so the image painted over the
   redesign's signature title. Root-caused, fixed, reverified, no regressions.
5. ✅ **Removed dead code** FABLE_CHANGES.md flagged, independently reconfirmed via grep
   (not just trusted): `About.tsx`, `Logo.tsx`, `useScrollAnimations.ts`,
   `lucide-react`/`powerglitch` deps.
6. ✅ **Committed** the verified design pass + the mobile fix + the dead-code removal as a
   single commit, `b242e12`, on `main`. **Not pushed to origin.**
7. ✅ **Discovered the repo exists as two diverged local clones** (WSL-native vs
   Windows-mounted) — this explains essentially every environment failure in the whole saga.
   See Learnings.
8. ✅ **Drafted the next "let Fable rip" prompt** for the user's next autonomous design
   session, adapted from the `fable-25.netlify.app/guide` methodology but scoped for one real
   professional portfolio instead of 25 disposable fictional sites.
9. ⏳ **Not done, by design**: `b242e12` has not been pushed to `origin/main`; the WSL-native
   clone has not been synced; touch-scroll-vs-horizontal-swipe on the new mobile scrollable
   column (FABLE_CHANGES.md's own flagged concern #5) was never verified — no real touch
   device was available, only keyboard/synthetic input.

## Critical References

- `FABLE_CHANGES.md` (repo root, **untracked**, not committed — left as local session notes
  rather than committed repo documentation; this was a deliberate choice, not an oversight —
  see Action Items if you want it committed instead) — the original design-pass rationale,
  independently verified this session.
- `CLAUDE.md` (repo root) — project conventions, content guidelines ("production-quality
  work... for a technical hiring manager audience"), the `npx designlang <url>` reference-site
  extraction tool already documented there.
- This handoff's own Verification table below — every claim in this document was checked
  against live command output this session, not carried over from memory.

## Recent changes

All in the Windows-mounted clone, committed as `b242e12`:

- `App.tsx:75` — `Carousel` now receives `keyboardEnabled={!anyOverlayOpen}` so arrow keys
  stop driving the carousel while an overlay is open.
- `components/HeroSlide.tsx:50` — hero name `SplitReveal` changed `as="div"` → `as="h1"`; the
  page previously had no `<h1>` at all.
- `components/CarouselSlide.tsx:45,77,93` — GSAP `ease: 'cubic-bezier(0, 0, 0.2, 1)'` (a CSS
  string GSAP silently can't parse, so it fell back to a default ease) replaced with
  `'expo.out'`, the site's real entrance ease; a `y: 6 → 0` reset was added so a revisited
  slide's lines don't stay stuck at their exit offset.
- `styles/index.css:35-36` — new WCAG-audited tokens `--accent-text: #FA9E78` (4.55:1) and
  `--ink: #262622` (5.15–7.40:1 on coral fills), replacing the old `#E85D3A` accent that
  measured 2.70:1 on small text (fails AA).
- `styles/index.css:1173-1224` — **the bug this session found and fixed**: mobile
  `.carousel-slide` grid went from 2 rows (`1fr auto`) to 3 (`auto 1fr auto`);
  `.carousel-slide-image--fallback` pinned to `grid-row: 1`, `.carousel-slide-terminal` to
  `grid-row: 2`, `.carousel-slide-footer` to `grid-row: 3`; `.carousel-slide--hero` explicitly
  restored to its original 2-row layout (`1fr auto`) since it has no image row and would
  otherwise inherit the 3-row split via the shared `.carousel-slide` base class.
- `components/TerminalPanel.tsx:19,26` — new `<h2 className="terminal-title">` (display-scale,
  `clamp(2.1rem, 3.6vw, 3.5rem)`, TextScramble-revealed) and `<p className="terminal-line
  terminal-problem">` (the `problem` field from `constants.ts`, previously defined but never
  rendered anywhere) replacing the old small `TITLE:` mono line.
- `components/Preloader.tsx:4` — `BOOT_DURATION` 2400ms → 1400ms; boot log now shows real
  computed values (`projects: ${CAROUSEL_PROJECTS.length} mounted`, etc.) instead of a static
  `"INITIALIZING..."` string.
- `hooks/useCarousel.ts:7,17,20-21,53` — new `keyboardEnabled` option; arrow-key handler also
  now ignores keydowns targeting `INPUT`/`TEXTAREA`/`contentEditable` elements.
- `components/Header.tsx:12,34` — `IS_MAC` platform sniff shows `ASK ⌘K` on Mac, `ASK ^K`
  elsewhere (previously hardcoded to the Mac glyph).
- `hooks/useTextScramble.ts:37` — `runScramble` now checks
  `prefers-reduced-motion` and skips straight to the final text if set.
- `components/AsciiGrid.tsx:16-17` — canvas color constants updated to mirror the new CSS
  tokens (`BRIGHT`, `ACCENT`).
- `components/AskPanel.tsx:129,131-132` — `role="status"`/`role="alert"` added to
  searching/error states; new `aria-live="polite"` announcer for "Answer ready."
- Deleted: `components/About.tsx`, `components/Logo.tsx`, `hooks/useScrollAnimations.ts`
  (confirmed zero real usages — see Verification).
- `package.json` / `package-lock.json` — removed `lucide-react` and `powerglitch` (confirmed
  zero source imports despite `CLAUDE.md`'s stale "Icons: Lucide React" tech-stack note).

## Learnings

- **The repo exists as two diverged local git clones, and this is the root cause of every
  environment failure this whole saga hit** — the 0-byte `node_modules/.bin/*` shims, repeated
  stale `.git/index.lock` files (mine and apparently Fable's own, per its own message to the
  user), and a `rm -rf node_modules` that took 15+ minutes to delete ~35k files.
  - `/home/tlupo/projects/portfolio_website` — WSL-native ext4 filesystem. Fast, no observed
    corruption. Currently at `086607b` (pre-design-pass), untouched — no `FABLE_CHANGES.md`,
    no design-pass diff, clean tracked tree.
  - `/mnt/c/Users/Trey/Downloads/portfolio_website` = `C:\Users\Trey\Downloads\portfolio_website`
    (same physical files, two path spellings — DrvFs mount of the Windows C: drive). This is
    where Fable's sandbox worked, where this whole session worked, and where `b242e12` lives.
    Same `origin` remote (`https://github.com/robertlupo1997/portfolio_website.git`) as the
    WSL-native clone — they're independent clones of the same GitHub repo, not the same
    working tree.
  - DrvFs is a known-unreliable filesystem for git/npm workloads under WSL (file-locking and
    many-small-file operations are the specific weak points). Recommend treating the
    WSL-native clone as canonical going forward and syncing the two via `git push`/`git pull`
    through `origin`, never by assuming they're interchangeable live filesystem state.
    Windows-side tools can still reach the WSL-native path via
    `\\wsl.localhost\Ubuntu\home\tlupo\projects\portfolio_website\`.
  - This local `core.fileMode` config change (see below) is scoped to the Windows-mounted
    clone's `.git/config` only — it was **not** applied to the WSL-native clone, and doesn't
    need to be, since ext4 doesn't have DrvFs's spurious-mode-bit problem.
- **`core.fileMode` was `true` in the Windows-mounted clone's local git config, but every file
  on that DrvFs mount reads as `755` regardless of its real permissions** — this alone produced
  ~180 false "modified" entries (every file in the repo) with zero real content difference,
  which is what made the initial `git status` look like it needed to sort a huge amount of
  spurious noise before the real 13-file design-pass diff was visible. Fixed with
  `git config core.fileMode false` in that clone (durable, persistent local change — see
  Verification for current value). This matches how a separate background `git status
  --porcelain` process observed during the session was already invoking git with
  `-c core.fileMode=false` — i.e., something else in this environment already knew about this
  mount quirk and was working around it per-invocation; this session made the workaround
  permanent for that clone instead.
- **A code-only review cannot catch this class of bug.** The mobile grid-row collision
  (`styles/index.css:1173-1224` above) was invisible to line-by-line diff review — both the
  image and the text column's CSS were individually correct-looking; the bug was two unrelated
  rules resolving to the same grid cell at a shared breakpoint. Only a real rendered screenshot
  showed it: the redesign's signature title and problem-hook line were completely absent from
  the visible page on a stock 390×844 mobile viewport, painted over by the fallback image.
  Fable's own FABLE_CHANGES.md explicitly flagged that its sandbox had no browser and asked for
  exactly this kind of check ("verify the scroll interaction doesn't fight swipe on a real
  device" — a related, still-unverified item). The lesson generalizes: an agent that
  explicitly bounds its own confidence and names what it couldn't check is more useful than one
  that claims full verification it didn't do — the second pass should look hardest exactly
  where the first pass admitted it couldn't see.
- **Screenshotting a TextScramble mid-animation looks like broken/garbled text and is not a
  bug** — early screenshots in this session showed titles like "n∃pb-aIA" or "KKBOX ChVFH
  PEZRiItiQD"; this is the scramble animation caught mid-flight, not corrupted rendering. Use
  Playwright's `newPage({ reducedMotion: 'reduce' })` to capture settled, legible state — the
  codebase's own `useTextScramble.ts:37` reduced-motion check (part of this design pass) makes
  this work cleanly.
- **Blind `waitForTimeout` between rapid carousel keypresses is unreliable for Playwright
  scripts against this app** — `useCarousel.ts`'s `next()`/`prev()` guard on `isTransitioning`
  (a 650ms timer in `Carousel.tsx`), and under headless-Chromium CPU contention on this
  machine, presses spaced even 750ms apart were sometimes dropped. What worked reliably: press
  → `waitForTimeout(500-600ms)` → **take a screenshot** before the next press — the screenshot
  I/O itself provided enough real wall-clock delay. Don't try to read live app state via a bare
  `querySelector` locator either — e.g. `.terminal-index` matches every project slide's DOM
  node simultaneously (all 8 are mounted at once, moved via a track transform, not
  conditionally rendered), so `.first()` always returns slide 1's node regardless of which
  slide is actually active on screen.

## Verification

| Claim | Command run this session | Result |
|---|---|---|
| `node_modules/.bin/vite` is a real binary, not the 0-byte corruption | `ls -la node_modules/.bin/vite` | `lrwxrwxrwx ... vite -> ../vite/bin/vite.js` |
| production build is clean | `npm run build` (re-run after all edits) | `✓ built in 7.38s`, no errors |
| test suite passes | `npm run test` (re-run after all edits) | `Test Files 9 passed (9)` / `Tests 40 passed (40)` |
| `App.tsx` no longer imports/calls `useScrollAnimations` | `grep -n "useScrollAnimations" App.tsx` | no matches (exit 1) |
| `About.tsx` / `Logo.tsx` / `useScrollAnimations.ts` deleted from disk | `ls components/About.tsx components/Logo.tsx hooks/useScrollAnimations.ts` | all three: `No such file or directory` |
| `lucide-react` / `powerglitch` removed from `package.json` | `grep -n "lucide-react\|powerglitch" package.json` | no matches (exit 1) |
| mobile CSS fix is present as committed | `grep -n "grid-row: 1\|grid-row: 2\|grid-row: 3\|carousel-slide--hero" styles/index.css` | lines 1173, 1184, 1196, 1221 (mobile block) as documented above |
| `core.fileMode` is set false in the Windows-mounted clone | `git config --get core.fileMode` | `false` |
| design-pass commit exists on `main` | `git log -1 --format="%H %h %s"` | `b242e121cac85a15d86730628a10ddb23819ea04 b242e12 feat(design): display-scale titles, motion fixes, WCAG AA contrast pass` |
| commit is **not** pushed to origin | `git rev-parse origin/main` then `git log origin/main..HEAD --oneline \| wc -l` | `origin/main` = `771043b...`; **20 local commits ahead**, including `b242e12` (this is consistent with the repo's pre-existing unpushed stack, not new) |
| WSL-native clone is untouched by this design pass | `git -C /home/tlupo/projects/portfolio_website rev-parse HEAD` | `086607b3...` — the commit immediately before this session's work, confirming the two clones have diverged |
| dev server is up | `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000` | `200` |
| dev server process | `ps aux \| grep vite` | `node .../node_modules/.bin/vite`, pid 67203, running since `Jul07` — restart: `cd rlupo-portfolio && npm run dev` |
| `FABLE_CHANGES.md` exists, untracked (deliberately not committed) | `ls -la FABLE_CHANGES.md` + `git status --short \| grep FABLE` | `8177 bytes, 131 lines`; shows as `?? FABLE_CHANGES.md` |
| touch-scroll-vs-swipe on the new mobile scrollable text column | — | **UNVERIFIED (no real touch device available this session)** — flagged in the commit message and here rather than assumed clean |

## Artifacts

- `thoughts/handoffs/2026-07-08_09-36-54_fable-design-pass-verification-repo-split-and-next-prompt.md` — this document.
- Commit `b242e12` on `main` (Windows-mounted clone) — 18 files changed (13 modified, 3
  deleted), touching `App.tsx`, `components/{AsciiGrid,AskPanel,Carousel,CarouselSlide,Header,
  HeroSlide,Preloader,TerminalPanel}.tsx`, `constants.ts`,
  `hooks/{useCarousel,useTextScramble}.ts`, `styles/index.css`, `package.json`,
  `package-lock.json`; deletions of `components/{About,Logo}.tsx`,
  `hooks/useScrollAnimations.ts`.
- `FABLE_CHANGES.md` (repo root) — left untracked/uncommitted on purpose (session notes, not
  repo documentation — reconsider if you want it archived in history instead).
- Local git config change: `core.fileMode = false` in the Windows-mounted clone only (not
  committed anywhere — it's a per-clone config, not a repo file).
- QA screenshots and debug/QA scripts created during this session were scratch work in the
  session's temp scratchpad and `rlupo-portfolio/scripts/_qa*.mjs`/`_debug.mjs` — all deleted
  before commit; nothing QA-related was left in the working tree.

## Action Items & Next Steps

1. **Decide whether to push `b242e12`.** It's sitting on top of an existing stack of ~19
   unpushed commits, apparently gated on a "Vercel Step 0" mentioned in earlier handoffs
   (`thoughts/handoffs/2026-07-06_20-52-11_launch-gates-complete-ready-to-push.md` if you want
   that context) — this session did not push, deliberately, since that's a shared-state action
   affecting the live GitHub repo and possibly a connected Vercel deploy.
2. **Decide the canonical repo location going forward** and sync the WSL-native clone
   (`git -C /home/tlupo/projects/portfolio_website pull`, once `b242e12` is pushed) — see
   Learnings for the reasoning. Until this happens, any work done in the WSL-native clone will
   NOT include this design pass, and any work in the Windows-mounted clone will keep paying the
   DrvFs tax.
3. **Decide whether `FABLE_CHANGES.md` should be committed** as permanent repo documentation
   or stay as an untracked local note. Left as a deliberate open choice, not a default.
4. **Real-device check**: verify the new mobile scrollable text column
   (`styles/index.css:1196`, `overflow-y: auto` on `.carousel-slide-terminal`) doesn't fight
   horizontal carousel swipe on an actual phone — this needs a real touch device, not headless
   Chromium.
5. **Next Fable session**: a full prompt was drafted (not written to a file this session — it's
   in this conversation's transcript above the handoff request) for the next autonomous design
   pass on this site, adapted from the `fable-25.netlify.app/guide` methodology (mandatory
   real-screenshot self-critique loop, minimum 3 passes, one deliberate complexity upgrade per
   pass) but scoped for a real professional portfolio: content-truth and WCAG/a11y/build/test
   are non-negotiable, everything aesthetic is Fable's call, and it's told to verify it actually
   has real screenshot capability before claiming a critique pass happened — directly encoding
   the lesson from this session's bug. If you want it saved as a file for reuse, ask and it can
   be written to e.g. `thoughts/prompts/fable-next-pass.md`.

## Other Notes

- Dev server (`npm run dev`, port 3000) was left running in the Windows-mounted clone at the
  end of this session — see Verification for the check/restart commands.
- This handoff itself lives in the Windows-mounted clone
  (`/mnt/c/Users/Trey/Downloads/portfolio_website/thoughts/handoffs/...`) — per the repo
  location issue above, it will not appear in the WSL-native clone until pulled.
- Model note: the "Fable" that produced the original design pass is Claude Fable 5, a distinct
  model persona/product referenced in this session's own system context (alongside Sonnet 5,
  Opus 4.8, Haiku 4.5) — not a separate third-party tool.
