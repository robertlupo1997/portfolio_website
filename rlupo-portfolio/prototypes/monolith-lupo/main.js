/* MONOLITH-LUPO — main.js
   Letter scramble + live letters · nav + entrance observers ·
   metric counters · benchmark race · forecast chart + split ·
   docket typewriter · stamp title · crosshair cursor ·
   proof sheet (P) · visibility guard
   ——————————————————————————————————————————————— */

'use strict';

/* ── Reduced-motion guard ── */
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Gate all CSS entrance states on .js-anim so no-JS and reduced-motion
   users get the full static composition. */
if (!reducedMotion) {
  document.documentElement.classList.add('js-anim');
}

/* ── Letter scramble for the cover title ──
   Characters resolve left-to-right, each scrambling for SETTLE ms
   before locking to the correct glyph. Ends with a settle-thud. */

function initScramble() {
  const el = document.querySelector('[data-scramble]');
  if (!el || reducedMotion) return;

  const CHARS   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#!&@%';
  const STAGGER = 85;   // ms between letter starts
  const SETTLE  = 420;  // ms each letter scrambles before resolving

  /* Preserve aria-label for screen readers; visible spans are decorative */
  const text = (el.getAttribute('aria-label') || el.textContent).trim().toUpperCase();
  el.setAttribute('aria-label', text);

  el.replaceChildren();
  const letters = [...text].map((ch) => {
    const s = document.createElement('span');
    s.setAttribute('aria-hidden', 'true');
    s.dataset.ch = ch;
    s.textContent = ch === ' ' ? ' ' : ch;
    s.style.opacity = '0';
    el.appendChild(s);
    return s;
  });

  const startTime = performance.now();
  let rafId;

  function settleAll() {
    letters.forEach((span) => {
      span.style.opacity = '1';
      span.textContent   = span.dataset.ch === ' ' ? ' ' : span.dataset.ch;
    });
  }

  function frame(now) {
    let anyPending = false;

    letters.forEach((span, i) => {
      const ch      = span.dataset.ch;
      const tStart  = startTime + i * STAGGER;
      const tSettle = tStart + SETTLE;

      if (now < tStart) {
        anyPending = true;
        return; /* not started yet — keep invisible */
      }

      if (now < tSettle) {
        span.style.opacity = '1';
        if (ch !== ' ') {
          span.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
        }
        anyPending = true;
        return;
      }

      /* Settled */
      span.style.opacity = '1';
      span.textContent   = ch === ' ' ? ' ' : ch;
    });

    if (anyPending && !document.hidden) {
      rafId = requestAnimationFrame(frame);
    } else if (anyPending && document.hidden) {
      /* Tab hidden mid-scramble — resolve all immediately */
      settleAll();
      el.classList.add('is-settled');
    } else if (!anyPending) {
      /* All letters resolved — settle-thud */
      el.classList.add('is-settled');
    }
  }

  rafId = requestAnimationFrame(frame);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  });

  /* Live letters — hovering a settled glyph re-scrambles just that
     glyph for ~350ms, then it locks again (pointer:fine only). */
  if (window.matchMedia('(pointer: fine)').matches) {
    el.addEventListener('pointerover', (e) => {
      const span = e.target.closest('span[data-ch]');
      if (!span || !el.classList.contains('is-settled')) return;
      const ch = span.dataset.ch;
      if (span.dataset.live || ch === ' ') return;
      span.dataset.live = '1';
      const t0 = performance.now();
      (function jitter(now) {
        if (now - t0 >= 350) {
          span.textContent = ch;
          delete span.dataset.live;
          return;
        }
        span.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
        requestAnimationFrame(jitter);
      })(t0);
    });
  }
}

/* ── Metric counters (rAF, custom ease, visibility-guarded) ──
   The HTML ships with the final value, so no-JS / reduced-motion
   users always see the true metric. */

const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

function animateNumber(el, from, to, duration, format) {
  if (!el) return;
  if (reducedMotion) { el.textContent = format(to); return; }

  const start = performance.now();
  let rafId;

  function tick(now) {
    if (document.hidden) { el.textContent = format(to); return; }
    const t = Math.min((now - start) / duration, 1);
    el.textContent = format(from + (to - from) * easeOutQuart(t));
    if (t < 1) rafId = requestAnimationFrame(tick);
  }

  rafId = requestAnimationFrame(tick);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
      el.textContent = format(to);
    }
  });
}

/* Poster 3 — FerroML: 3.9× counts up from 1.0× as the poster enters */
function runFerroCountup() {
  const el = document.querySelector('[data-countup]');
  animateNumber(el, 1.0, 3.9, 1400, (v) => v.toFixed(1) + '×');
}

/* Poster 3 — benchmark race: two plotter pens on the same wall-clock,
   FerroML's trail ending 3.9× further (--f is the true distance
   fraction, shipped in the HTML). Same duration and easing family as
   the count-up, fired with it. */
function runFerroRace() {
  const race = document.querySelector('.ferro__race');
  if (!race || reducedMotion) return;

  const parts = Array.from(race.querySelectorAll('.ferro__track')).map((track) => {
    const f = parseFloat(getComputedStyle(track).getPropertyValue('--f')) || 0;
    return {
      runner: track.querySelector('.ferro__runner'),
      trail:  track.querySelector('.ferro__trail'),
      f,
      dist: Math.max(0, track.clientWidth * f - 4), /* pen parks at trail end */
    };
  });

  const DURATION = 1400;
  const start = performance.now();
  let rafId;

  function settle() {
    parts.forEach((p) => {
      p.trail.style.transform  = `scaleX(${p.f})`;
      p.runner.style.transform = `translateX(${p.dist}px)`;
    });
  }

  function tick(now) {
    if (document.hidden) { settle(); return; }
    const t = Math.min((now - start) / DURATION, 1);
    const e = easeOutQuart(t);
    parts.forEach((p) => {
      p.trail.style.transform  = `scaleX(${p.f * e})`;
      p.runner.style.transform = `translateX(${p.dist * e}px)`;
    });
    if (t < 1) rafId = requestAnimationFrame(tick);
  }

  rafId = requestAnimationFrame(tick);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
      settle();
    }
  });
}

/* Poster 4 — HRF: bars draw first, then the RMSLE resolves 1.00 → 0.48
   (the error coming down is the point) */
function runHrfCountdown() {
  const el = document.querySelector('[data-countdown]');
  if (!el) return;
  if (reducedMotion) { el.textContent = '0.48'; return; }
  window.setTimeout(() => {
    animateNumber(el, 1.0, 0.48, 1100, (v) => v.toFixed(2));
  }, 850);
}

/* ── Forecast bar chart (deterministic trend + seasonality) ──
   Replaces monolith's noise waveform with a series that reads
   as a store-sales forecast: upward trend, seasonal cycle,
   repeating promotional spikes. */

function initForecastChart() {
  const el = document.querySelector('.hrf__chart');
  if (!el) return;

  const BARS = 44;
  const FC_FROM = 34; // bars 34–43 are the forecast window (seam in CSS: 34/44)
  const points = [];

  for (let i = 0; i < BARS; i++) {
    const trend    = 18 + (i / (BARS - 1)) * 42;          // 18% → 60%
    const season   = 16 * Math.sin(i * 0.48 + 0.8);       // seasonal cycle
    const promo    = (i % 11 === 7) ? 18 : 0;             // periodic spike
    const h        = Math.max(8, Math.min(96, Math.round(trend + season + promo)));

    const bar = document.createElement('div');
    bar.className = i >= FC_FROM ? 'hrf__bar hrf__bar--fc' : 'hrf__bar';
    bar.style.setProperty('--h', h + '%');
    bar.style.setProperty('--i', i);
    el.appendChild(bar);

    points.push(`${i * 10 + 5},${100 - h}`);
  }

  /* Dashed fit line over the bar tops (absolute, outside the flex flow) */
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'hrf__line');
  svg.setAttribute('viewBox', `0 0 ${BARS * 10} 100`);
  svg.setAttribute('preserveAspectRatio', 'none');
  const line = document.createElementNS(SVG_NS, 'polyline');
  line.setAttribute('points', points.join(' '));
  svg.appendChild(line);
  el.appendChild(svg);

  /* The seam where history hands off to forecast */
  const seam = document.createElement('div');
  seam.className = 'hrf__seam';
  const left  = document.createElement('span');
  left.textContent = 'Actual →';
  const right = document.createElement('span');
  right.textContent = '→ Forecast';
  seam.append(left, right);
  el.appendChild(seam);
}

/* Poster 4 — after the bars print (0.7s + 43·22ms ≈ 1.65s), the
   forecast plate lifts: dashed line sweeps the bar tops, the last 10
   bars restyle to outline, the seam label appears. */
function runForecastSplit() {
  const chart = document.querySelector('.hrf__chart');
  if (!chart || reducedMotion) return;
  window.setTimeout(() => chart.classList.add('is-split'), 1900);
}

/* Poster 5 — the docket's newest line types in character-by-character
   (the caret keeps blinking after it). Reduced-motion and no-JS ship
   the full line; mobile hides the docket, so skip when it isn't laid out. */
function runDocketType() {
  const span = document.querySelector('.register__docket li:last-child > span:last-child');
  if (!span || reducedMotion || !span.offsetParent) return;

  const full = span.textContent;
  const CHAR_MS = 24;
  const t0 = performance.now() + 1450; /* after the row prints in */
  let rafId;

  function tick(now) {
    const n = Math.floor((now - t0) / CHAR_MS);
    if (n >= full.length) { span.textContent = full; return; }
    span.textContent = n > 0 ? full.slice(0, n) : '';
    rafId = requestAnimationFrame(tick);
  }

  span.textContent = '';
  rafId = requestAnimationFrame(tick);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
      span.textContent = full;
    }
  });
}

/* Poster 6 — OPEN TO WORK arrives as individual stamp strikes: JS
   splits the two lines into letter spans (one continuous --i stagger),
   CSS lands each with the thud bezier. The h2 keeps its aria-label;
   the split only happens when motion is allowed. */
function initStampTitle() {
  if (reducedMotion) return;
  const title = document.querySelector('.open__title');
  if (!title) return;

  title.classList.add('open__title--stamped');
  let idx = 0;
  title.querySelectorAll('.open__line').forEach((line) => {
    const text = line.textContent;
    line.replaceChildren();
    for (const ch of text) {
      const s = document.createElement('span');
      s.className = 'open__letter';
      s.textContent = ch;
      s.style.setProperty('--i', idx++);
      line.appendChild(s);
    }
  });
}

/* ── Side-nav active state, filing index & ground-aware chrome ── */

function initNavObserver() {
  const links   = document.querySelectorAll('.side-nav__link');
  const posters = Array.from(document.querySelectorAll('.poster'));
  const filing  = document.querySelector('[data-filing]');
  if (!posters.length) return;

  const linkMap = new Map();
  links.forEach((link) => {
    const id = link.getAttribute('href').replace('#', '');
    linkMap.set(id, link);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        /* Active nav link */
        links.forEach((l) => l.classList.remove('active'));
        const active = linkMap.get(entry.target.id);
        if (active) {
          active.classList.add('active');
          active.setAttribute('aria-current', 'true');
          links.forEach((l) => { if (l !== active) l.removeAttribute('aria-current'); });
        }

        /* Filing index 01–06 */
        if (filing) {
          const idx = posters.indexOf(entry.target) + 1;
          filing.textContent = String(idx).padStart(2, '0');
        }

        /* Ground-aware rail recolor — keyed to the ground the fixed
           rail floats over on the active poster */
        document.body.dataset.rail = entry.target.dataset.rail || 'dark';
      });
    },
    { threshold: 0.55 }
  );

  posters.forEach((poster) => observer.observe(poster));
}

/* ── Entrance observer — one motion set-piece per poster ──
   Adds .is-in once per poster; fires the JS counters. */

function initEntranceObserver() {
  const posters = document.querySelectorAll('.poster');
  if (!posters.length) return;

  if (reducedMotion) {
    posters.forEach((p) => p.classList.add('is-in'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const poster = entry.target;
        poster.classList.add('is-in');

        if (poster.id === 'poster-3') { runFerroCountup(); runFerroRace(); }
        if (poster.id === 'poster-4') { runHrfCountdown(); runForecastSplit(); }
        if (poster.id === 'poster-5') { runDocketType(); }

        obs.unobserve(poster);
      });
    },
    { threshold: 0.3 }
  );

  posters.forEach((poster) => observer.observe(poster));
}

/* ── Keyboard navigation between posters ── */

function initKeyNav() {
  const posters = Array.from(document.querySelectorAll('.poster'));
  if (!posters.length) return;

  document.addEventListener('keydown', (e) => {
    /* Leave browser shortcuts alone; go inert while the proof sheet is up */
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (document.body.classList.contains('proof-open')) return;

    /* Easter egg: "G" pins the blueprint grid overlay on every poster */
    if (e.key === 'g' || e.key === 'G') {
      document.body.classList.toggle('grid-pinned');
    }

    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      const current = posters.findIndex((p) => {
        const rect = p.getBoundingClientRect();
        return rect.top >= -20;
      });
      const next = posters[Math.min(current + 1, posters.length - 1)];
      if (next) next.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }

    if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      const current = posters.findIndex((p) => {
        const rect = p.getBoundingClientRect();
        return rect.top >= -20;
      });
      const prev = posters[Math.max(current - 1, 0)];
      if (prev) prev.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  });
}

/* ── Crosshair cursor — a registration mark rides the pointer ──
   pointer:fine only, spring-lagged ~80ms, rAF sleeps when settled or
   the tab is hidden, scales 1.4× over links and buttons. Purely
   additive: the native cursor is never hidden. */

function initCursor() {
  if (reducedMotion) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-reg';
  dot.setAttribute('aria-hidden', 'true');
  document.body.appendChild(dot);

  let tx = -100, ty = -100, x = tx, y = ty;
  let ts = 1, s = 1;
  let rafId = null, lastT = 0;

  function frame(now) {
    const dt = Math.min(now - lastT || 16, 48);
    lastT = now;
    const k = 1 - Math.exp(-dt / 80); /* ~80ms lag constant */
    x += (tx - x) * k;
    y += (ty - y) * k;
    s += (ts - s) * k;
    dot.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${s})`;

    const restless = Math.abs(tx - x) + Math.abs(ty - y) + Math.abs(ts - s) * 30 > 0.3;
    rafId = restless && !document.hidden ? requestAnimationFrame(frame) : null;
  }

  function wake() {
    if (rafId === null && !document.hidden) {
      lastT = performance.now();
      rafId = requestAnimationFrame(frame);
    }
  }

  document.addEventListener('pointermove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
    if (!dot.classList.contains('is-on')) {
      dot.classList.add('is-on');
      x = tx; y = ty; /* appear in place, no fly-in from the corner */
    }
    wake();
  }, { passive: true });

  document.addEventListener('pointerover', (e) => {
    ts = e.target.closest('a, button') ? 1.4 : 1;
    wake();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    } else {
      wake();
    }
  });
}

/* ── Proof sheet — press P for the imposition view ──
   All six posters as a printer's contact sheet: live same-document
   iframes anchored per poster (lazy-loaded on first toggle), scaled to
   the tile. Desktop only; Enter/click jumps to the poster and exits;
   Esc exits; focus is trapped in the dialog while open. */

function initProofSheet() {
  const proof = document.getElementById('proof-sheet');
  if (!proof) return;

  const tiles = Array.from(proof.querySelectorAll('.proof__tile'));
  const closeBtn = proof.querySelector('.proof__close');
  const desktop = window.matchMedia('(min-width: 769px)');
  let loaded = false;
  let lastFocus = null;

  function setScale() {
    const frame = proof.querySelector('.proof__frame');
    if (!frame) return;
    const scale = Math.min(frame.clientWidth / 1440, frame.clientHeight / 900);
    proof.style.setProperty('--proof-scale', scale.toFixed(4));
  }

  function openProof() {
    if (!desktop.matches || !proof.hidden) return;
    lastFocus = document.activeElement;
    if (!loaded) {
      proof.querySelectorAll('iframe').forEach((f) => { f.src = f.dataset.src; });
      loaded = true;
    }
    proof.hidden = false;
    document.body.classList.add('proof-open');
    setScale();
    requestAnimationFrame(() => proof.classList.add('is-open'));
    tiles[0].focus();
  }

  function closeProof(targetId) {
    if (proof.hidden) return;
    proof.classList.remove('is-open');
    proof.hidden = true;
    document.body.classList.remove('proof-open');

    const target = targetId && document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    } else if (lastFocus && lastFocus.focus) {
      lastFocus.focus();
    }
  }

  tiles.forEach((tile) => {
    tile.addEventListener('click', () => closeProof(tile.dataset.target));
  });
  closeBtn.addEventListener('click', () => closeProof(null));

  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return; /* never eat ⌘/Ctrl+P */

    if (e.key === 'p' || e.key === 'P') {
      if (proof.hidden) openProof();
      else closeProof(null);
      return;
    }

    if (proof.hidden) return;

    if (e.key === 'Escape') { closeProof(null); return; }

    if (e.key === 'Tab') {
      /* trap focus in the dialog: header close button, then the tiles */
      const ring = [closeBtn, ...tiles];
      const i = ring.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) {
        e.preventDefault();
        ring[ring.length - 1].focus();
      } else if (!e.shiftKey && i === ring.length - 1) {
        e.preventDefault();
        ring[0].focus();
      }
    }
  });

  window.addEventListener('resize', () => { if (!proof.hidden) setScale(); });
}

/* ── Print — ship the settled composition regardless of scroll history.
   Entrance states are gated on .is-in per poster; a print started before
   a poster ever entered the viewport would file blank pages. ── */

function initPrintSettle() {
  window.addEventListener('beforeprint', () => {
    document.querySelectorAll('.poster').forEach((p) => p.classList.add('is-in'));
    const chart = document.querySelector('.hrf__chart');
    if (chart) chart.classList.add('is-split');
  });
}

/* ── Init ── */

document.addEventListener('DOMContentLoaded', () => {
  initScramble();
  initForecastChart();
  initNavObserver();
  initEntranceObserver();
  initKeyNav();
  initStampTitle();
  initCursor();
  initProofSheet();
  initPrintSettle();
});
