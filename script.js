/* ==========================================================================
   DIGITAL LETTER CONTROLLER
   - Flawless mobile viewport centering
   - Dreamy blur-dissolve transition from video into sharp final letter
   - Seamless reverse folding animation
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
  let dissolveTriggered = false;

  // Initialize initial video frames
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

  // START OPENING ANIMATION (Forward Video)
  function playOpenAnimation() {
    if (state !== 'closed') return;
    state = 'opening';
    dissolveTriggered = false;

    // Reset visual classes
    prompt.classList.add('hidden');
    videoForward.classList.remove('soft-blur-out');
    finalImage.classList.remove('revealed', 'soft-blur-out');
    videoReverse.classList.remove('active-reverse');
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

  // CINEMATIC BLUR DISSOLVE INTO FINAL LETTER
  function triggerBlurDissolve() {
    if (dissolveTriggered) return;
    dissolveTriggered = true;

    // Softly blur-out the video motion
    videoForward.classList.add('soft-blur-out');

    // Dreamy blur-in of high-resolution final letter
    finalImage.classList.add('revealed');

    // Reveal subtle fold control after image settles
    setTimeout(() => {
      state = 'opened';
      controls.classList.add('visible');

      // Pre-arm reverse video at 0
      videoReverse.currentTime = 0.001;
      videoReverse.pause();
    }, 450);
  }

  // Monitor forward video playback to initiate blur-dissolve at the perfect moment
  videoForward.addEventListener('timeupdate', () => {
    if (state === 'opening' && videoForward.duration) {
      // Trigger dissolve ~0.35s before video ends as letter reaches top position
      if (videoForward.currentTime >= videoForward.duration - 0.35) {
        triggerBlurDissolve();
      }
    }
  });

  videoForward.addEventListener('ended', () => {
    if (state === 'opening') {
      triggerBlurDissolve();
    }
  });

  // START CLOSING ANIMATION (Reverse Video)
  function playCloseAnimation() {
    if (state !== 'opened') return;
    state = 'closing';

    // Hide controls
    controls.classList.remove('visible');

    // Softly blur out the still letter image
    finalImage.classList.add('soft-blur-out');

    // Activate reverse video layer
    videoReverse.classList.add('active-reverse');
    videoReverse.currentTime = 0;
    videoReverse.muted = false;

    const playPromise = videoReverse.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        videoReverse.muted = true;
        videoReverse.play();
      });
    }

    // Clean up forward video in background
    setTimeout(() => {
      videoForward.classList.remove('soft-blur-out');
      videoForward.pause();
      videoForward.currentTime = 0.001;
      finalImage.classList.remove('revealed', 'soft-blur-out');
    }, 300);
  }

  // When Reverse Animation ends -> Back to clean closed envelope
  function onReverseVideoEnd() {
    if (state !== 'closing') return;

    // Reset reverse video
    videoReverse.pause();
    videoReverse.classList.remove('active-reverse');
    videoReverse.currentTime = 0.001;

    // Reset forward video
    videoForward.pause();
    videoForward.currentTime = 0.001;

    // Show initial touch prompt
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
      // Tapping anywhere on opened letter folds it back
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
