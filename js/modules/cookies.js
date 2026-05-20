import config from "../config.js";
import { storage } from "../utils/storage.js";
import { byId, qs, show, hide } from "../utils/dom.js";

let banner = null;

function loadMap() {
  const iframe = qs(".map-wrap iframe[data-src]");
  if (iframe && !iframe.src) {
    iframe.src = iframe.dataset.src;
    hide(byId("map-placeholder"));
  }
}

function handleAccept() {
  storage.set(config.COOKIES_STORAGE_KEY, config.CONSENT_ACCEPTED);
  hide(banner);
  loadMap();
}

function handleDecline() {
  storage.set(config.COOKIES_STORAGE_KEY, config.CONSENT_DECLINED);
  hide(banner);
}

function bindEvents() {
  byId("cookie-accept")?.addEventListener("click", handleAccept);
  byId("map-consent-btn")?.addEventListener("click", handleAccept);
  byId("cookie-decline")?.addEventListener("click", handleDecline);
}

function init() {
  const consent = storage.get(config.COOKIES_STORAGE_KEY);

  if (consent === config.CONSENT_ACCEPTED) {
    loadMap();
    return;
  }

  banner = byId("cookie-banner");

  if (!consent && banner) {
    show(banner);
    bindEvents();
  }
}

export default { init };
