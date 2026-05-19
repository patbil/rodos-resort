// RODOS — entry point (ES module). Loaded with <script type="module">.
import { initI18n } from "./i18n.js";
import {
  initLoader,
  initParticles,
  initReveal,
  initNav,
  initScrollSpy,
  initYear,
} from "./ui.js";
import { initGalleryTabs, initLightbox, initSeasonTabs } from "./gallery.js";
import { initDatepicker, initForm } from "./form.js";

function start() {
  initI18n();
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
