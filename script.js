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
    const start = 5 * 60 + 59; // 05:59 -> 359
    const end = 21 * 60 + 59;  // 21:59 -> 1319
    return minutes >= start && minutes <= end;
  }

  // Night window: 22:00 - 05:58 (inclusive)
  function isNightWindow(date) {
    const d = date || new Date();
    const minutes = d.getHours() * 60 + d.getMinutes();
    const start = 22 * 60; // 22:00 -> 1320
    const end = 5 * 60 + 58; // 05:58 -> 358
    return minutes >= start || minutes <= end; // wraps midnight
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

  // On click: show the correct element depending on local time
  koum.addEventListener('click', function () {
    
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
  });
});
