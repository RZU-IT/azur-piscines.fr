const heroSection = document.querySelector('.hero-scroll-section');
const heroVideo = document.querySelector('[data-hero-video]');

if (heroSection && heroVideo) {
  const hero = heroSection.querySelector('.hero');
  let frame = 0;
  let targetProgress = 0;
  let duration = 0;
  let seekPending = false;
  let queuedTime = 0;
  const compactQuery = matchMedia('(max-width: 680px)');

  const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

  const seekVideo = () => {
    if (!duration || seekPending) return;
    const targetTime = clamp(targetProgress * duration, 0, Math.max(0, duration - 0.025));
    queuedTime = targetTime;
    if (Math.abs(heroVideo.currentTime - targetTime) < 0.025) return;

    seekPending = true;
    try {
      heroVideo.currentTime = targetTime;
    } catch (error) {
      seekPending = false;
    }
  };

  const render = () => {
    frame = 0;
    seekVideo();
  };

  const requestRender = () => {
    if (!frame) frame = requestAnimationFrame(render);
  };

  const updateProgress = () => {
    if (compactQuery.matches) {
      heroSection.style.setProperty('--hero-progress', '1');
      return;
    }
    const stickyTop = parseFloat(getComputedStyle(hero).top) || 0;
    const range = Math.max(heroSection.offsetHeight - hero.offsetHeight - stickyTop, 1);
    targetProgress = clamp(-heroSection.getBoundingClientRect().top / range, 0, 1);
    heroSection.style.setProperty('--hero-progress', targetProgress.toFixed(4));
    requestRender();
  };

  const markReady = () => {
    duration = Number.isFinite(heroVideo.duration) ? heroVideo.duration : 0;
    heroSection.classList.add('is-video-ready');
    if (compactQuery.matches) {
      heroVideo.loop = true;
      heroVideo.play().catch(() => {});
      return;
    }
    heroVideo.pause();
    if (targetProgress === 0 && heroVideo.currentTime !== 0) heroVideo.currentTime = 0;
    seekVideo();
  };

  heroVideo.addEventListener('loadedmetadata', markReady);
  heroVideo.addEventListener('loadeddata', markReady);
  heroVideo.addEventListener('seeked', () => {
    seekPending = false;
    if (Math.abs(heroVideo.currentTime - queuedTime) >= 0.025) requestRender();
  });

  addEventListener('scroll', updateProgress, { passive: true });
  addEventListener('resize', updateProgress);
  addEventListener('orientationchange', updateProgress);
  if (window.visualViewport) visualViewport.addEventListener('resize', updateProgress);
  compactQuery.addEventListener('change', () => location.reload());
  updateProgress();
}

/* Copyright RZU Informatique */
