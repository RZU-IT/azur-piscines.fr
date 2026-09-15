const heroSection = document.querySelector('.hero-scroll-section');
const heroVideo = document.querySelector('[data-hero-video]');

if (heroSection && heroVideo) {
  const hero = heroSection.querySelector('.hero');
  const playButton = heroSection.querySelector('[data-hero-play]');
  const mobilePlayback = matchMedia('(max-width: 680px)').matches;
  let frame = 0;
  let targetProgress = 0;
  let duration = 0;
  let seekPending = false;
  let renderedProgress = -1;
  let ready = false;

  const setMobileScrollLocked = (locked) => {
    if (!mobilePlayback) return;
    document.documentElement.classList.toggle('hero-mobile-locked', locked);
    document.body.classList.toggle('hero-mobile-locked', locked);
  };

  const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

  const paintProgress = (progress) => {
    targetProgress = clamp(progress, 0, 1);
    if (Math.abs(targetProgress - renderedProgress) <= 0.0005) return;
    renderedProgress = targetProgress;
    heroSection.style.setProperty('--hero-progress', targetProgress.toFixed(4));
  };

  const seekVideo = () => {
    if (!duration || seekPending || mobilePlayback) return;
    const targetTime = clamp(targetProgress * duration, 0, Math.max(0, duration - 0.025));
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
    if (mobilePlayback) return;
    const stickyTop = parseFloat(getComputedStyle(hero).top) || 0;
    const range = Math.max(heroSection.offsetHeight - hero.offsetHeight - stickyTop, 1);
    paintProgress(-heroSection.getBoundingClientRect().top / range);
    seekVideo();
  };

  const requestRender = () => {
    if (!frame) frame = requestAnimationFrame(render);
  };

  const syncMobilePlayback = () => {
    if (!mobilePlayback || !duration) return;
    paintProgress(heroVideo.currentTime / duration);
    if (!heroVideo.paused && !heroVideo.ended) requestAnimationFrame(syncMobilePlayback);
  };

  const markReady = () => {
    duration = Number.isFinite(heroVideo.duration) ? heroVideo.duration : 0;
    heroSection.classList.add('is-video-ready');
    heroVideo.loop = false;
    if (ready) return;
    ready = true;
    heroVideo.pause();
    heroVideo.currentTime = 0;
    paintProgress(0);
  };

  if (mobilePlayback && playButton) {
    setMobileScrollLocked(true);

    playButton.addEventListener('click', async () => {
      if (!duration) markReady();
      heroVideo.currentTime = 0;
      paintProgress(0);
      heroSection.classList.remove('is-complete');
      heroSection.classList.add('is-playing');

      try {
        await heroVideo.play();
        requestAnimationFrame(syncMobilePlayback);
      } catch (error) {
        heroSection.classList.remove('is-playing');
        setMobileScrollLocked(false);
      }
    });

    heroVideo.addEventListener('ended', () => {
      paintProgress(1);
      heroSection.classList.remove('is-playing');
      heroSection.classList.add('is-complete');
      setMobileScrollLocked(false);
    });
  } else {
    addEventListener('scroll', requestRender, { passive: true });
    addEventListener('resize', requestRender);
    addEventListener('orientationchange', requestRender);
    if (window.visualViewport) visualViewport.addEventListener('resize', requestRender);
  }

  heroVideo.addEventListener('loadedmetadata', markReady);
  heroVideo.addEventListener('loadeddata', markReady);
  heroVideo.addEventListener('seeked', () => {
    seekPending = false;
    if (!mobilePlayback) requestRender();
  });

  if (heroVideo.readyState >= 1) markReady();
  if (!mobilePlayback) requestRender();
}

/* Copyright RZU Informatique */
