import { initUi } from "./modules/ui.js";
import { initNav } from "./modules/nav.js";
import { render } from "./modules/render.js";
import { initGallery } from "./modules/gallery.js";
import { initPricing } from "./modules/pricing.js";
import { initCookies } from "./modules/cookies.js";
import { initI18n, onLanguageChange } from "./modules/i18n.js";
import { initForm, refreshDatepickerLocale } from "./modules/form.js";

async function start() {
  render();
  await initI18n();
  initUi();
  initNav();
  initGallery();
  initPricing();
  initForm();
  initCookies();
  onLanguageChange(refreshDatepickerLocale);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}
