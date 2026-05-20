import { byId, qsa, toggleActive } from "../utils/dom.js";

function setupTabs() {
  byId("gallery-tabs")?.addEventListener("click", (event) => {
    const tab = event.target.closest(".gallery-tab");
    if (!tab) return;
    const { cat } = tab.dataset;
    toggleActive(".gallery-tab", (el) => el === tab);
    toggleActive(".gallery-grid", (el) => el.dataset.cat === cat);
  });
}

function setupLightbox() {
  const lightbox = byId("lightbox");
  if (!lightbox) return;
  const image = byId("lightbox-image");
  const caption = byId("lightbox-caption");
  let images = [];
  let current = 0;

  const show = () => {
    image.src = images[current].src;
    caption.textContent = images[current].alt;
  };
  const open = () => {
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  };
  const move = (step) => {
    current = (current + step + images.length) % images.length;
    show();
  };

  qsa(".gallery-item").forEach((item) => {
    item.addEventListener("click", () => {
      const siblings = qsa(".gallery-item", item.closest(".gallery-grid"));
      images = siblings.map((el) => {
        const img = el.querySelector("img");
        return { src: img.src, alt: img.alt };
      });
      current = siblings.indexOf(item);
      show();
      open();
    });
  });

  byId("lightbox-close").addEventListener("click", close);
  byId("lightbox-prev").addEventListener("click", () => move(-1));
  byId("lightbox-next").addEventListener("click", () => move(1));
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) close();
  });
  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("open")) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowLeft") move(-1);
    if (event.key === "ArrowRight") move(1);
  });
}

function init() {
  setupTabs();
  setupLightbox();
}

export default { init };
