const heroSection = document.querySelector('.hero-scroll-section');
const heroVideo = document.querySelector('[data-hero-video]');

if (heroSection && heroVideo) {
  const hero = heroSection.querySelector('.hero');
  let frame = 0;
  let targetProgress = 0;
  let progress = 0;
  let lastFrameTime = performance.now();
  let duration = 0;
  let seekPending = false;
  let sourceUrl = '';
  let initialFrameRequested = false;
  const compactViewport = matchMedia('(max-width: 680px)').matches;

  const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

  const seekVideo = () => {
    if (!duration || seekPending) return;
    const targetTime = clamp(progress * duration, 0, Math.max(0, duration - 0.025));
    if (Math.abs(heroVideo.currentTime - targetTime) < 0.025) return;

    seekPending = true;
    try {
      heroVideo.currentTime = targetTime;
    } catch (error) {
      seekPending = false;
    }
  };

  const render = (now) => {
    frame = 0;
    const delta = clamp((now - lastFrameTime) / 1000, 0.001, 0.05);
    lastFrameTime = now;
    progress += (targetProgress - progress) * (1 - Math.exp(-12 * delta));

    if (Math.abs(targetProgress - progress) < 0.0002) progress = targetProgress;
    seekVideo();
    if (Math.abs(targetProgress - progress) >= 0.0002) requestRender();
  };

  const requestRender = () => {
    if (!frame) frame = requestAnimationFrame(render);
  };

  const updateProgress = () => {
    if (compactViewport) {
      heroSection.style.setProperty('--hero-progress', '1');
      return;
    }
    const stickyTop = parseFloat(getComputedStyle(hero).top) || 0;
    const range = Math.max(heroSection.offsetHeight - hero.offsetHeight - stickyTop, 1);
    targetProgress = clamp(-heroSection.getBoundingClientRect().top / range, 0, 1);
    heroSection.style.setProperty('--hero-progress', targetProgress.toFixed(4));
    requestRender();
  };

  const primeVideo = () => {
    heroVideo.muted = true;
    const playback = heroVideo.play();
    if (playback) {
      playback.then(() => {
        heroVideo.pause();
        seekVideo();
      }).catch(() => {});
    }
  };

  const markReady = () => {
    duration = Number.isFinite(heroVideo.duration) ? heroVideo.duration : 0;
    heroSection.classList.add('is-video-ready');
    if (compactViewport) {
      heroVideo.loop = true;
      heroVideo.play().catch(() => {});
      return;
    }
    if (!initialFrameRequested && duration && heroVideo.currentTime === 0) {
      initialFrameRequested = true;
      seekPending = true;
      heroVideo.currentTime = Math.min(0.04, duration / 2);
      return;
    }
    seekVideo();
  };

  heroVideo.addEventListener('loadedmetadata', markReady);
  heroVideo.addEventListener('loadeddata', markReady);
  heroVideo.addEventListener('seeked', () => {
    seekPending = false;
    seekVideo();
    requestRender();
  });

  const applySource = (url) => {
    heroVideo.src = url;
    heroVideo.load();
  };

  const videoSource = heroVideo.dataset.src;
  if (videoSource) applySource(videoSource);

  addEventListener('pointerdown', primeVideo, { once: true, passive: true });
  addEventListener('touchstart', primeVideo, { once: true, passive: true });
  addEventListener('scroll', updateProgress, { passive: true });
  addEventListener('resize', updateProgress);
  addEventListener('orientationchange', updateProgress);
  if (window.visualViewport) visualViewport.addEventListener('resize', updateProgress);
  addEventListener('pagehide', () => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
  });
  updateProgress();
}

/* Copyright RZU Informatique */
