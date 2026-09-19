/* ==========================================================================
   BIDIRECTIONAL DIGITAL LETTER CONTROLLER
   - Shows initial closed envelope
   - Plays forward opening video upon touch
   - Reveals crystal-clear final letter (letterns.png)
   - Plays smooth reverse video animation upon closing
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('letterContainer');
  const videoForward = document.getElementById('videoForward');
  const videoReverse = document.getElementById('videoReverse');
  const finalImage = document.getElementById('finalLetterImage');
  const prompt = document.getElementById('touchPrompt');
  const controls = document.getElementById('letterControls');
  const btnReplay = document.getElementById('btnReplay');

  let state = 'closed'; // 'closed' | 'opening' | 'opened' | 'closing'

  // Pre-set video initial frames
  function initVideos() {
    videoForward.currentTime = 0.001;
    videoForward.pause();

    videoReverse.currentTime = 0.001;
    videoReverse.pause();
  }

  videoForward.addEventListener('loadeddata', () => {
    if (state === 'closed') {
      videoForward.currentTime = 0.001;
    }
  });

  videoReverse.addEventListener('loadeddata', () => {
    videoReverse.currentTime = 0.001;
  });

  // Start Opening (Forward Animation)
  function playOpenAnimation() {
    if (state !== 'closed') return;
    state = 'opening';

    prompt.classList.add('hidden');
    videoReverse.classList.remove('active-reverse');
    finalImage.classList.remove('revealed');
    controls.classList.remove('visible');

    videoForward.currentTime = 0;
    videoForward.muted = false;

    const playPromise = videoForward.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        videoForward.muted = true;
        videoForward.play();
      });
    }
  }

  // When Forward Animation completes -> Reveal Letter
  function onForwardVideoEnd() {
    if (state !== 'opening') return;
    state = 'opened';

    // Seamlessly fade in high-res letter
    finalImage.classList.add('revealed');

    // Pre-arm reverse video at frame 0
    videoReverse.currentTime = 0.001;
    videoReverse.pause();

    // Show fold control
    setTimeout(() => {
      if (state === 'opened') {
        controls.classList.add('visible');
      }
    }, 200);
  }

  videoForward.addEventListener('ended', onForwardVideoEnd);
  videoForward.addEventListener('timeupdate', () => {
    if (state === 'opening' && videoForward.duration && videoForward.currentTime >= videoForward.duration - 0.08) {
      onForwardVideoEnd();
    }
  });

  // Start Closing (Reverse Animation)
  function playCloseAnimation() {
    if (state !== 'opened') return;
    state = 'closing';

    // Hide controls
    controls.classList.remove('visible');

    // Activate reverse video layer
    videoReverse.classList.add('active-reverse');
    videoReverse.currentTime = 0;
    videoReverse.muted = false;

    // Crossfade: hide letter as reverse animation begins
    finalImage.classList.remove('revealed');

    const playPromise = videoReverse.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        videoReverse.muted = true;
        videoReverse.play();
      });
    }
  }

  // When Reverse Animation completes -> Back to Initial Closed Position
  function onReverseVideoEnd() {
    if (state !== 'closing') return;

    // Reset forward video to frame 0
    videoForward.pause();
    videoForward.currentTime = 0.001;

    // Deactivate reverse video layer
    videoReverse.pause();
    videoReverse.classList.remove('active-reverse');

    // Restore prompt
    prompt.classList.remove('hidden');
    state = 'closed';
  }

  videoReverse.addEventListener('ended', onReverseVideoEnd);
  videoReverse.addEventListener('timeupdate', () => {
    if (state === 'closing' && videoReverse.duration && videoReverse.currentTime >= videoReverse.duration - 0.08) {
      onReverseVideoEnd();
    }
  });

  // Tap Interactions
  container.addEventListener('click', (e) => {
    if (state === 'closed') {
      playOpenAnimation();
    } else if (state === 'opened') {
      playCloseAnimation();
    }
  });

  btnReplay.addEventListener('click', (e) => {
    e.stopPropagation();
    if (state === 'opened') {
      playCloseAnimation();
    }
  });

  // Keyboard accessibility
  window.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (state === 'closed') playOpenAnimation();
      else if (state === 'opened') playCloseAnimation();
    } else if (e.key === 'Escape' && state === 'opened') {
      e.preventDefault();
      playCloseAnimation();
    }
  });

  initVideos();
});
