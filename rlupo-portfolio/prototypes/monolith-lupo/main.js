/* MONOLITH-LUPO — main.js
   Letter scramble · nav + entrance observers · metric counters ·
   forecast chart · visibility guard
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
  for (let i = 0; i < BARS; i++) {
    const trend    = 18 + (i / (BARS - 1)) * 42;          // 18% → 60%
    const season   = 16 * Math.sin(i * 0.48 + 0.8);       // seasonal cycle
    const promo    = (i % 11 === 7) ? 18 : 0;             // periodic spike
    const h        = Math.max(8, Math.min(96, Math.round(trend + season + promo)));

    const bar = document.createElement('div');
    bar.className = 'hrf__bar';
    bar.style.setProperty('--h', h + '%');
    bar.style.setProperty('--i', i);
    el.appendChild(bar);
  }
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

        if (poster.id === 'poster-3') runFerroCountup();
        if (poster.id === 'poster-4') runHrfCountdown();

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

/* ── Init ── */

document.addEventListener('DOMContentLoaded', () => {
  initScramble();
  initForecastChart();
  initNavObserver();
  initEntranceObserver();
  initKeyNav();
});
