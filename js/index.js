import render from "./modules/render.js";
import i18n from "./modules/i18n.js";
import ui from "./modules/ui.js";
import gallery from "./modules/gallery.js";
import form from "./modules/form.js";
import cookies from "./modules/cookies.js";

async function start() {
  render();
  await i18n.init();
  ui.init();
  gallery.init();
  form.init();
  cookies.init();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}
