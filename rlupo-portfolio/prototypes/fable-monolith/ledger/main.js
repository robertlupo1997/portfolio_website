/* LEDGER — main.js
   Carousel controller · Scramble · Deep links · INDEX overlay
   All state-changes are driven by gotoSlide(); the URL query is
   consumed once at DOMContentLoaded. No scroll-snap, no scrollIntoView.
   ────────────────────────────────────────────────────────────── */

'use strict';

/* ── Reduced-motion guard ── */
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Carousel state ── */
const TOTAL_SLIDES = 3;
let currentSlide = 0;

/* ── DOM refs (populated in init) ── */
let track, prevBtn, nextBtn, counterEl, indexBtn, indexOverlay, indexCloseBtn;

/* ──────────────────────────────────────────────
   CAROUSEL — navigate to slide N
   instant = true suppresses the CSS transition
   ────────────────────────────────────────────── */
function gotoSlide(n, instant) {
  n = Math.max(0, Math.min(TOTAL_SLIDES - 1, n));
  currentSlide = n;

  if (instant || reducedMotion) {
    /* Disable transition for one frame, then restore */
    track.style.transitionDuration = '0ms';
  }

  /* Each slide is exactly 100vw; track is calc(3 * 100vw) */
  track.style.transform = `translateX(calc(${-n} * 100vw))`;

  if (instant || reducedMotion) {
    /* Force reflow so the no-transition applies before we re-enable */
    void track.offsetWidth;
    track.style.transitionDuration = '';
  }

  /* Counter: 01 / 03 … */
  counterEl.textContent = `${String(n + 1).padStart(2, '0')} / 03`;

  /* Prev / next disabled states */
  prevBtn.disabled = n === 0;
  nextBtn.disabled = n === TOTAL_SLIDES - 1;

  /* aria-hidden on off-screen slides */
  document.querySelectorAll('.slide').forEach((slide, i) => {
    slide.setAttribute('aria-hidden', i !== n ? 'true' : 'false');
  });

  /* Slide-aware control colors: ink-family on concrete slides (0, 1);
     concrete-family on the ink-ground slide (2).
     This keeps carousel controls ≥4.5:1 on every slide ground they appear over. */
  const controls = document.querySelector('.carousel-controls');
  if (controls) {
    controls.classList.toggle('carousel-controls--on-ink', n === 2);
  }
}


/* ──────────────────────────────────────────────
   INDEX OVERLAY — open / close / focus trap
   ────────────────────────────────────────────── */
let previousFocus = null;

function openOverlay() {
  indexOverlay.removeAttribute('hidden');
  indexBtn.setAttribute('aria-expanded', 'true');
  previousFocus = document.activeElement;

  /* Move focus to close button (first interactive element) */
  const firstFocusable = indexOverlay.querySelector('button, a[href], [tabindex="0"]');
  if (firstFocusable) {
    /* Small delay ensures the element is rendered before focus */
    requestAnimationFrame(() => firstFocusable.focus());
  }
}

function closeOverlay() {
  indexOverlay.setAttribute('hidden', '');
  indexBtn.setAttribute('aria-expanded', 'false');
  if (previousFocus) {
    previousFocus.focus();
    previousFocus = null;
  }
}

/* Focus trap inside overlay */
function trapFocus(e) {
  if (e.key !== 'Tab') return;
  const focusable = Array.from(
    indexOverlay.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]')
  );
  if (!focusable.length) return;
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}


/* ──────────────────────────────────────────────
   SCRAMBLE — letter-by-letter resolve
   Adopted from monolith/main.js verbatim spirit.
   Skipped entirely for prefers-reduced-motion.
   ────────────────────────────────────────────── */
function initScramble() {
  const el = document.querySelector('[data-scramble]');
  if (!el) return;

  /* Reduced motion: ensure text is immediately visible */
  if (reducedMotion) {
    el.style.opacity = '1';
    return;
  }

  const CHARS   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#!&@%';
  const STAGGER = 85;   /* ms between letter starts */
  const SETTLE  = 420;  /* ms each letter scrambles before locking */

  /* Preserve aria-label for screen readers; visible spans are decorative */
  const text = (el.getAttribute('aria-label') || el.textContent).trim().toUpperCase();
  el.setAttribute('aria-label', text);

  /* Build one <span> per character */
  el.replaceChildren();
  const letters = [...text].map((ch) => {
    const s = document.createElement('span');
    s.setAttribute('aria-hidden', 'true');
    s.dataset.ch   = ch;
    s.textContent  = ch === ' ' ? ' ' : ch;
    s.style.opacity = '0';
    el.appendChild(s);
    return s;
  });

  const t0  = performance.now();
  let rafId = null;

  function frame(now) {
    let anyPending = false;

    letters.forEach((span, i) => {
      const ch      = span.dataset.ch;
      const tStart  = t0 + i * STAGGER;
      const tSettle = tStart + SETTLE;

      if (now < tStart) {
        anyPending = true;
        return; /* not started — keep invisible */
      }

      if (now < tSettle) {
        span.style.opacity = '1';
        if (ch !== ' ') {
          span.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
        }
        anyPending = true;
        return;
      }

      /* Settled — lock to correct glyph */
      span.style.opacity = '1';
      span.textContent   = ch === ' ' ? ' ' : ch;
    });

    if (anyPending && !document.hidden) {
      rafId = requestAnimationFrame(frame);
    } else if (anyPending && document.hidden) {
      /* Tab was hidden mid-scramble — resolve immediately */
      letters.forEach((span) => {
        span.style.opacity = '1';
        span.textContent   = span.dataset.ch === ' ' ? ' ' : span.dataset.ch;
      });
      rafId = null;
    }
  }

  rafId = requestAnimationFrame(frame);

  /* Pause when tab is hidden; rAF won't fire but we guard explicitly */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  });
}


/* ──────────────────────────────────────────────
   DEEP LINKS
   ?slide=N (0-indexed) · ?overlay=1
   Both must parse cleanly with zero console errors
   ────────────────────────────────────────────── */
function initDeepLinks() {
  const params       = new URLSearchParams(window.location.search);
  const slideParam   = params.get('slide');
  const overlayParam = params.get('overlay');

  if (slideParam !== null) {
    const n = parseInt(slideParam, 10);
    if (Number.isFinite(n) && n >= 0 && n < TOTAL_SLIDES) {
      gotoSlide(n, true /* instant */);
    }
  }

  if (overlayParam === '1') {
    openOverlay();
  }
}


/* ──────────────────────────────────────────────
   EVENT LISTENERS
   ────────────────────────────────────────────── */
function initControls() {
  /* Prev / next buttons */
  prevBtn.addEventListener('click', () => gotoSlide(currentSlide - 1));
  nextBtn.addEventListener('click', () => gotoSlide(currentSlide + 1));

  /* Arrow key navigation — disabled when overlay is open */
  document.addEventListener('keydown', (e) => {
    const overlayOpen = !indexOverlay.hasAttribute('hidden');

    if (!overlayOpen) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        gotoSlide(currentSlide - 1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        gotoSlide(currentSlide + 1);
      }
    }

    if (e.key === 'Escape' && overlayOpen) {
      closeOverlay();
    }
  });

  /* Header wordmark → slide 0 */
  document.getElementById('wordmark-link').addEventListener('click', (e) => {
    e.preventDefault();
    gotoSlide(0);
  });

  /* INDEX button → open overlay */
  indexBtn.addEventListener('click', openOverlay);

  /* Close button → close overlay */
  indexCloseBtn.addEventListener('click', closeOverlay);

  /* Focus trap inside overlay */
  indexOverlay.addEventListener('keydown', trapFocus);

  /* INDEX entry 01 → navigate to project slide + close */
  const entry01 = document.getElementById('index-entry-01');
  if (entry01) {
    entry01.addEventListener('click', (e) => {
      e.preventDefault();
      closeOverlay();
      gotoSlide(1);
    });
  }

  /* Stamp hover is pure CSS (transform in style.css);
     no JS needed for that micro-interaction */
}


/* ──────────────────────────────────────────────
   INIT
   ────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  /* Cache DOM refs */
  track          = document.getElementById('carousel-track');
  prevBtn        = document.getElementById('prev-btn');
  nextBtn        = document.getElementById('next-btn');
  counterEl      = document.getElementById('slide-counter');
  indexBtn       = document.getElementById('index-btn');
  indexOverlay   = document.getElementById('index-overlay');
  indexCloseBtn  = document.getElementById('index-close-btn');

  /* Boot the carousel at slide 0 (instant, no animation on load) */
  gotoSlide(0, true);

  /* Scramble fires after carousel is positioned */
  initScramble();

  /* Wire up all controls */
  initControls();

  /* Apply deep links — may override slide 0 above */
  initDeepLinks();
});
