// RODOS — entry point (ES module). Loaded with <script type="module">.
import { renderSections } from "./modules/render.js";
import { initI18n } from "./modules/i18n.js";
import {
  initLoader,
  initParticles,
  initReveal,
  initNav,
  initScrollSpy,
  initYear,
} from "./modules/ui.js";
import {
  initGalleryTabs,
  initLightbox,
  initSeasonTabs,
} from "./modules/gallery.js";
import { initDatepicker, initForm } from "./modules/form.js";

async function start() {
  renderSections();
  await initI18n();
  initLoader();
  initParticles();
  initYear();
  initNav();
  initScrollSpy();
  initGalleryTabs();
  initLightbox();
  initSeasonTabs();
  initReveal();
  initDatepicker();
  initForm();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}
