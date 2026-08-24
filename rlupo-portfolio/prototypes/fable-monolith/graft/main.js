/* ═══════════════════════════════════════════════════════════════
   GRAFT — main.js
   Carousel: translateX track, prev/next, ArrowLeft/Right, deep links
   INDEX overlay: focus trap, Esc, deep link
   Slide counter: 2-frame mono flicker on slide change (pass 3 upgrade)
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Constants ── */
  const TOTAL_SLIDES = 3;

  /* ── State ── */
  let currentSlide = 0;
  let overlayOpen  = false;
  let prevFocusEl  = null; /* element to restore focus to on overlay close */

  /* ── Reduced-motion ── */
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── DOM refs ── */
  const track       = document.getElementById('carouselTrack');
  const prevBtn     = document.getElementById('prevBtn');
  const nextBtn     = document.getElementById('nextBtn');
  const counterEl   = document.getElementById('counterCurrent');
  const indexBtn    = document.getElementById('indexBtn');
  const wordmarkLink= document.getElementById('wordmarkLink');
  const overlay     = document.getElementById('indexOverlay');
  const overlayClose= document.getElementById('overlayClose');
  const entry01Btn  = document.getElementById('indexEntry01');

  /* ── Carousel ── */

  function getSlideOffset () {
    /* track is 300% wide; each slide is 33.333% of the track = one viewport width */
    return (-currentSlide * (100 / TOTAL_SLIDES));
  }

  function applyTransform (instant) {
    if (instant || reducedMotion) {
      track.style.transition = 'none';
      track.style.transform  = `translateX(${getSlideOffset()}%)`;
      /* restore transition after paint so future navigations still animate */
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          track.style.transition = '';
        });
      });
    } else {
      track.style.transform = `translateX(${getSlideOffset()}%)`;
    }
  }

  function updateButtonStates () {
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === TOTAL_SLIDES - 1;
  }

  function updateCounter (instant) {
    const finalText = String(currentSlide + 1).padStart(2, '0');
    if (instant || reducedMotion) {
      counterEl.textContent = finalText;
      setCounterAriaLabel(currentSlide + 1);
      return;
    }
    /* Pass 3: 2-frame mono flicker */
    const glyphs = '0123456789';
    const rand2 = () => glyphs[Math.floor(Math.random() * 10)] + glyphs[Math.floor(Math.random() * 10)];
    counterEl.textContent = rand2();
    requestAnimationFrame(() => {
      counterEl.textContent = rand2();
      requestAnimationFrame(() => {
        counterEl.textContent = finalText;
        setCounterAriaLabel(currentSlide + 1);
      });
    });
  }

  function setCounterAriaLabel (n) {
    counterEl.setAttribute('aria-label', `Slide ${n} of ${TOTAL_SLIDES}`);
  }

  function goToSlide (index, instant) {
    if (index < 0 || index >= TOTAL_SLIDES) return;
    currentSlide = index;
    applyTransform(instant);
    updateButtonStates();
    updateCounter(instant);
  }

  /* ── INDEX overlay ── */

  function getFocusableEls () {
    return Array.from(
      overlay.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => !el.disabled && !el.closest('[hidden]'));
  }

  function openOverlay (instant) {
    if (overlayOpen) return;
    prevFocusEl = document.activeElement;
    overlayOpen = true;
    overlay.hidden = false;

    /* force reflow before adding class so transition fires */
    overlay.getBoundingClientRect();
    overlay.classList.add('is-open');

    indexBtn.setAttribute('aria-expanded', 'true');

    if (instant || reducedMotion) {
      overlay.style.opacity   = '1';
      overlay.style.transform = 'none';
    }

    /* Move focus into overlay */
    const firstFocusable = getFocusableEls()[0];
    if (firstFocusable) {
      if (instant || reducedMotion) {
        firstFocusable.focus();
      } else {
        /* wait for transition before moving focus */
        setTimeout(() => firstFocusable.focus(), 310);
      }
    }
  }

  function closeOverlay () {
    if (!overlayOpen) return;
    overlayOpen = false;

    overlay.classList.remove('is-open');
    indexBtn.setAttribute('aria-expanded', 'false');

    const dur = reducedMotion ? 0 : 300;
    setTimeout(() => {
      overlay.hidden = true;
    }, dur);

    /* Restore focus */
    if (prevFocusEl && typeof prevFocusEl.focus === 'function') {
      prevFocusEl.focus();
    }
  }

  /* Focus trap inside overlay */
  function trapFocus (e) {
    if (!overlayOpen) return;
    const els   = getFocusableEls();
    const first = els[0];
    const last  = els[els.length - 1];

    if (e.key === 'Tab') {
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
  }

  /* ── Event wiring ── */

  prevBtn.addEventListener('click', () => {
    if (currentSlide > 0) goToSlide(currentSlide - 1, false);
  });

  nextBtn.addEventListener('click', () => {
    if (currentSlide < TOTAL_SLIDES - 1) goToSlide(currentSlide + 1, false);
  });

  wordmarkLink.addEventListener('click', (e) => {
    e.preventDefault();
    goToSlide(0, false);
  });

  indexBtn.addEventListener('click', () => {
    if (overlayOpen) closeOverlay();
    else openOverlay(false);
  });

  overlayClose.addEventListener('click', closeOverlay);

  /* Entry 01 — navigate to slide 1 and close overlay */
  entry01Btn.addEventListener('click', () => {
    closeOverlay();
    goToSlide(1, false);
  });

  /* Keyboard: arrows (global, not when overlay open), Escape */
  document.addEventListener('keydown', (e) => {
    if (overlayOpen) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeOverlay();
      }
      trapFocus(e);
      return;
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (currentSlide > 0) goToSlide(currentSlide - 1, false);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (currentSlide < TOTAL_SLIDES - 1) goToSlide(currentSlide + 1, false);
    }
  });

  /* Stop rAF if document is hidden */
  document.addEventListener('visibilitychange', () => {
    /* No rAF loops in this study; placeholder for future use */
  });

  /* ── Deep link init ── */
  function initFromURL () {
    const params    = new URLSearchParams(window.location.search);
    const slideParam = params.get('slide');
    const overlayParam = params.get('overlay');

    let targetSlide = 0;
    if (slideParam !== null) {
      const n = parseInt(slideParam, 10);
      if (!isNaN(n) && n >= 0 && n < TOTAL_SLIDES) {
        targetSlide = n;
      }
    }

    /* Apply slide instantly (no animation on initial load deep link) */
    goToSlide(targetSlide, true);

    /* Open overlay if requested */
    if (overlayParam === '1') {
      openOverlay(true);
    }
  }

  /* ── Boot ── */
  initFromURL();

}());
