document.addEventListener('DOMContentLoaded', function () {
  const koum = document.querySelector('.koumpinai');
  const timer = document.getElementById('timerapairnoumepoulo');
  const koumpimpes = document.querySelector('.koumpimpes');
  if (!koum) return;

  // Hover sound elements (if present)
  const gif = document.getElementById('gif');
  const sound = document.getElementById('hoverSound');
  if (sound) {
    try { sound.loop = true; } catch (e) {}
    // attempt to unlock audio on first user click (some browsers block play until a gesture)
    const unlock = () => {
      sound.play().then(() => { sound.pause(); sound.currentTime = 0; }).catch(() => {});
    };
    document.addEventListener('click', unlock, { once: true });
    if (gif) {
      gif.addEventListener('mouseenter', () => { sound.currentTime = 0; sound.play().catch(()=>{}); });
      gif.addEventListener('mouseleave', () => { sound.pause(); sound.currentTime = 0; });
      // pointer events for touch/click
      gif.addEventListener('pointerdown', () => { sound.currentTime = 0; sound.play().catch(()=>{}); });
      gif.addEventListener('pointerup', () => { sound.pause(); sound.currentTime = 0; });
    }
  }


  // Day window: 05:59 - 21:59 (inclusive)
  function isDayWindow(date) {
    const d = date || new Date();
    const minutes = d.getHours() * 60 + d.getMinutes();
    // After the requested change, the "day" (closed) window runs from
    // 07:01 up to 18:29 (so the site 'open' window is 18:30–07:00).
    const start = 7 * 60 + 1; // 07:01 -> 421
    const end = 18 * 60 + 29; // 18:29 -> 1109
    return minutes >= start && minutes <= end;
  }

  // Night / "open" window: 18:30 - 07:00 (wraps midnight)
  function isNightWindow(date) {
    const d = date || new Date();
    const minutes = d.getHours() * 60 + d.getMinutes();
    const start = 18 * 60 + 30; // 18:30 -> 1110
    const end = 7 * 60; // 07:00 -> 420
    // wraps midnight: true when minutes >= start OR minutes <= end
    return minutes >= start || minutes <= end;
  }

  // Ensure both targets exist and are hidden initially
  if (timer) {
    timer.classList.add('hidden');
    timer.setAttribute('aria-hidden', 'true');
  }
  if (koumpimpes) {
    koumpimpes.classList.add('hidden');
    koumpimpes.setAttribute('aria-hidden', 'true');
  }

  // Navigate to mainselidoula.html when the night button is clicked
  if (koumpimpes) {
    koumpimpes.addEventListener('click', function () {
      // Only navigate when the button is visible (it may be hidden by the time checks)
      if (!koumpimpes.classList.contains('hidden')) {
        window.location.href = 'mainselidoula.html';
      }
    });
  }

  // Auto-hide logic: if an element is visible but its window ends, hide it
  setInterval(function () {
    if (timer && !isDayWindow() && !timer.classList.contains('hidden')) {
      timer.classList.add('hidden');
      timer.setAttribute('aria-hidden', 'true');
    }
    if (koumpimpes && !isNightWindow() && !koumpimpes.classList.contains('hidden')) {
      koumpimpes.classList.add('hidden');
      koumpimpes.setAttribute('aria-hidden', 'true');
    }
    // If both targets are hidden, show the main 'ναι' button again
    if (koum && ( (!timer || timer.classList.contains('hidden')) && (!koumpimpes || koumpimpes.classList.contains('hidden')) )) {
      koum.classList.remove('hidden');
      koum.setAttribute('aria-hidden', 'false');
    }
  }, 30 * 1000);

  // Extract the shared behavior into a function so it can be triggered
  // by clicks and by touch/pointer events on small screens.
  function revealTargetsFromKoum() {
    if (isNightWindow()) {
      // show night button, hide timer
      if (koumpimpes) {
        koumpimpes.classList.remove('hidden');
        koumpimpes.setAttribute('aria-hidden', 'false');
        koumpimpes.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (timer) {
        timer.classList.add('hidden');
        timer.setAttribute('aria-hidden', 'true');
      }
      // hide the 'ναι' button while the night button is shown
      koum.classList.add('hidden');
      koum.setAttribute('aria-hidden', 'true');
      return;
    }

    if (isDayWindow()) {
      // show timer, hide night button
      if (timer) {
        timer.classList.remove('hidden');
        timer.setAttribute('aria-hidden', 'false');
        timer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (koumpimpes) {
        koumpimpes.classList.add('hidden');
        koumpimpes.setAttribute('aria-hidden', 'true');
      }
      // hide the 'ναι' button while the timer is shown
      koum.classList.add('hidden');
      koum.setAttribute('aria-hidden', 'true');
      return;
    }
  }

  // Wire up the regular click handler to the shared function
  koum.addEventListener('click', function () {
    revealTargetsFromKoum();
  });

  // On touch devices / small viewports, tapping anywhere (or tapping the GIF)
  // should reveal the correct button. We'll listen for the first touch on the
  // document (excluding taps directly on existing buttons) and for pointerdown
  // on the GIF. Both call the same reveal function. Use once:true so we don't
  // interfere with normal interactions after the first reveal.
  const isSmallScreen = () => window.matchMedia('(max-width: 700px)').matches || navigator.maxTouchPoints > 0;

  function onFirstTouch(e) {
    // If the user tapped an existing button, let that interaction proceed.
    if (e && e.target && e.target.closest && e.target.closest('button')) return;
    if (!isSmallScreen()) return;
    // Reveal the correct targets as if the user pressed the 'ναι' button.
    revealTargetsFromKoum();
  }

  // Document-level first touch (passive, once)
  document.addEventListener('touchstart', onFirstTouch, { once: true, passive: true });

  // Also treat pointerdown on the GIF explicitly (covers some browsers/devices)
  if (gif) {
    gif.addEventListener('pointerdown', function (e) {
      // don't block dragging; only reveal on pointerdown for small screens
      if (!isSmallScreen()) return;
      onFirstTouch(e);
    }, { once: true });
  }
});
