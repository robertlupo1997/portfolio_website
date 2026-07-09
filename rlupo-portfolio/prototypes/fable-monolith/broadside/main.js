/* BROADSIDE — main.js
   Carousel SPA · Overlay · Scramble · Fit-title · Form-feed flash
   ─────────────────────────────────────────────────────────────── */

'use strict';

/* ── Constants ── */
const SLIDE_COUNT  = 3;
const COUNTER_PAD  = 2;  /* zero-pad display: 01, 02 … */

/* ── Reduced-motion guard ── */
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/* ══════════════════════════════════════════════════════════════
   CAROUSEL
   ══════════════════════════════════════════════════════════════ */

let currentSlide = 0;

const track    = document.getElementById('carousel-track');
const prevBtn  = document.getElementById('prev-btn');
const nextBtn  = document.getElementById('next-btn');
const counter  = document.getElementById('slide-counter');
const flashEl  = document.getElementById('carousel-flash');

function pad(n) {
  return String(n).padStart(COUNTER_PAD, '0');
}

function updateCounter(n) {
  counter.textContent = `${pad(n + 1)} / ${pad(SLIDE_COUNT)}`;
}

function triggerFormFeed() {
  if (reducedMotion || !flashEl) return;
  flashEl.classList.remove('active');
  /* Force reflow so re-adding .active restarts the animation */
  void flashEl.offsetWidth;
  flashEl.classList.add('active');
  flashEl.addEventListener('animationend', () => {
    flashEl.classList.remove('active');
  }, { once: true });
}

function goTo(n, skipFlash) {
  const target = Math.max(0, Math.min(n, SLIDE_COUNT - 1));
  if (target === currentSlide && n !== currentSlide) return;

  if (!skipFlash) triggerFormFeed();

  currentSlide = target;

  /* Each slide occupies (100 / SLIDE_COUNT)% of the track width */
  const pct = (100 / SLIDE_COUNT) * currentSlide;
  if (reducedMotion) {
    track.style.transition = 'none';
  } else {
    track.style.transition = '';
  }
  track.style.transform = `translateX(-${pct}%)`;

  updateCounter(currentSlide);
  prevBtn.disabled = currentSlide === 0;
  nextBtn.disabled = currentSlide === SLIDE_COUNT - 1;

  /* Announce slide change to AT */
  const slideEl = document.getElementById(`slide-${currentSlide}`);
  if (slideEl) {
    slideEl.setAttribute('aria-current', 'true');
    document.querySelectorAll('.slide').forEach((s) => {
      if (s !== slideEl) s.removeAttribute('aria-current');
    });
  }
}

function initCarousel() {
  if (!track) return;

  prevBtn.addEventListener('click', () => goTo(currentSlide - 1));
  nextBtn.addEventListener('click', () => goTo(currentSlide + 1));

  /* Arrow-key navigation */
  document.addEventListener('keydown', (e) => {
    /* Skip if focus is inside overlay */
    const overlay = document.getElementById('index-overlay');
    if (overlay && !overlay.hidden && overlay.contains(document.activeElement)) return;

    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { e.preventDefault(); goTo(currentSlide - 1); }
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown')  { e.preventDefault(); goTo(currentSlide + 1); }
  });

  /* Parse deep-link: ?slide=N (0-indexed) */
  const params   = new URLSearchParams(window.location.search);
  const rawSlide = parseInt(params.get('slide'), 10);
  const initSlide = Number.isNaN(rawSlide)
    ? 0
    : Math.max(0, Math.min(rawSlide, SLIDE_COUNT - 1));

  /* Apply initial state without flash / transition */
  goTo(initSlide, true /* skipFlash */);
}


/* ══════════════════════════════════════════════════════════════
   INDEX OVERLAY
   ══════════════════════════════════════════════════════════════ */

let overlayTrigger = null; /* element that opened the overlay */

function openOverlay() {
  const overlay   = document.getElementById('index-overlay');
  const indexBtn  = document.getElementById('index-btn');
  const closeBtn  = document.getElementById('overlay-close');
  if (!overlay) return;

  overlayTrigger = document.activeElement;
  overlay.hidden = false;
  indexBtn.setAttribute('aria-expanded', 'true');
  closeBtn.focus();
}

function closeOverlay() {
  const overlay  = document.getElementById('index-overlay');
  const indexBtn = document.getElementById('index-btn');
  if (!overlay) return;

  overlay.hidden = true;
  indexBtn.setAttribute('aria-expanded', 'false');

  if (overlayTrigger && typeof overlayTrigger.focus === 'function') {
    overlayTrigger.focus();
  }
  overlayTrigger = null;
}

function initOverlay() {
  const overlay      = document.getElementById('index-overlay');
  const indexBtn     = document.getElementById('index-btn');
  const closeBtn     = document.getElementById('overlay-close');
  const entry01      = document.getElementById('index-entry-01');
  if (!overlay || !indexBtn || !closeBtn) return;

  indexBtn.addEventListener('click', openOverlay);
  closeBtn.addEventListener('click', closeOverlay);

  /* Esc closes */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.hidden) {
      e.preventDefault();
      closeOverlay();
    }
  });

  /* Entry 01: navigate to slide 1 and close */
  if (entry01) {
    entry01.addEventListener('click', (e) => {
      e.preventDefault();
      closeOverlay();
      goTo(1);
    });
  }

  /* Focus trap: Tab must stay inside overlay when open */
  overlay.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || overlay.hidden) return;
    const focusable = Array.from(
      overlay.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.disabled && el.offsetParent !== null);
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
  });

  /* Deep-link: ?overlay=1 */
  const params = new URLSearchParams(window.location.search);
  if (params.get('overlay') === '1') {
    /* Defer to allow DOM to settle */
    requestAnimationFrame(openOverlay);
  }
}


/* ══════════════════════════════════════════════════════════════
   LETTER SCRAMBLE  (ported from monolith — same DNA)
   ══════════════════════════════════════════════════════════════ */

function initScramble() {
  const el = document.querySelector('[data-scramble]');
  if (!el || reducedMotion) {
    /* Reduced-motion: ensure visible immediately */
    if (el) el.style.opacity = '1';
    return;
  }

  const CHARS   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#!&@%_';
  const STAGGER = 85;  /* ms between letter starts */
  const SETTLE  = 420; /* ms each letter scrambles before resolving */

  const text = (el.getAttribute('aria-label') || el.textContent).trim().toUpperCase();
  el.setAttribute('aria-label', text);

  el.replaceChildren();
  const letters = [...text].map((ch) => {
    const s = document.createElement('span');
    s.setAttribute('aria-hidden', 'true');
    s.dataset.ch = ch;
    s.textContent = ch === ' ' ? ' ' : ch; /* nbsp for space */
    s.style.opacity = '0';
    el.appendChild(s);
    return s;
  });

  const startTime = performance.now();
  let rafId;

  function frame(now) {
    if (document.hidden) {
      /* Resolve all immediately if tab hidden mid-scramble */
      letters.forEach((s) => { s.style.opacity = '1'; s.textContent = s.dataset.ch === ' ' ? ' ' : s.dataset.ch; });
      return;
    }

    let anyPending = false;

    letters.forEach((span, i) => {
      const ch      = span.dataset.ch;
      const tStart  = startTime + i * STAGGER;
      const tSettle = tStart + SETTLE;

      if (now < tStart) { anyPending = true; return; }

      span.style.opacity = '1';

      if (now < tSettle) {
        if (ch !== ' ') {
          span.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
        }
        anyPending = true;
        return;
      }

      span.textContent = ch === ' ' ? ' ' : ch;
    });

    if (anyPending) rafId = requestAnimationFrame(frame);
  }

  rafId = requestAnimationFrame(frame);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  });
}


/* ══════════════════════════════════════════════════════════════
   FIT TITLE — resize h1 to fill its container width
   ══════════════════════════════════════════════════════════════ */

function fitTitle() {
  const el = document.getElementById('hero-title');
  if (!el) return;

  const parent = el.parentElement;
  if (!parent) return;

  /* Account for the content padding on the left */
  const style  = window.getComputedStyle(parent);
  const paddingL = parseFloat(style.paddingLeft)  || 0;
  const paddingR = parseFloat(style.paddingRight) || 0;
  const maxW = parent.clientWidth - paddingL - paddingR;

  /* Binary search for the largest integer px that fits */
  el.style.fontSize = '1px';
  let lo = 1, hi = 600;
  while (lo < hi - 1) {
    const mid = Math.floor((lo + hi) / 2);
    el.style.fontSize = mid + 'px';
    if (el.scrollWidth <= maxW) lo = mid;
    else hi = mid;
  }
  el.style.fontSize = lo + 'px';
}

/* Debounced resize */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(fitTitle, 60);
});


/* ══════════════════════════════════════════════════════════════
   WORDMARK LINK — returns to slide 0
   ══════════════════════════════════════════════════════════════ */

function initWordmark() {
  const link = document.getElementById('wordmark-link');
  if (!link) return;
  link.addEventListener('click', (e) => {
    e.preventDefault();
    goTo(0);
  });
}


/* ══════════════════════════════════════════════════════════════
   INIT
   ══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initCarousel();    /* Must be first — goTo() must exist before overlay deep-link */
  initOverlay();
  fitTitle();        /* Set title size before scramble wraps in spans */
  initScramble();    /* Wrap h1 in spans and animate */
  initWordmark();
});
