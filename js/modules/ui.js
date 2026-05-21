import config from "../config.js";
import { byId, on, addClass } from "../utils/dom.js";
import { setupParticles, setupReveal } from "../utils/animation.js";

const loaderConfig = {
  fadeOutMs: config.ANIMATION_DURATION,
  fallbackTimeoutMs: 3500,
  videoReadyState: 3,
};

function setupLoader() {
  const loader = byId("loader");
  if (!loader) return;
  const heroVideo = byId("hero-video");
  let isHidden = false;

  function hideLoader() {
    if (isHidden) return;
    isHidden = true;
    addClass(loader, "hidden");
    setTimeout(() => loader.remove(), loaderConfig.fadeOutMs);
  }

  if (heroVideo?.readyState >= loaderConfig.videoReadyState) hideLoader();
  else on(heroVideo, "canplay", hideLoader, { once: true });

  on(window, "load", hideLoader);
  setTimeout(hideLoader, loaderConfig.fallbackTimeoutMs);
}

export function initUi() {
  setupLoader();
  setupParticles();
  setupReveal();
}
