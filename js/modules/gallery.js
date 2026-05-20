const byId = (id) => document.getElementById(id);

const markActive = (selector, isActive) =>
  document
    .querySelectorAll(selector)
    .forEach((el) => el.classList.toggle("active", isActive(el)));

function initGalleryTabs() {
  byId("gallery-tabs")?.addEventListener("click", (e) => {
    const tab = e.target.closest(".gallery-tab");
    if (!tab) return;
    const category = tab.dataset.cat;
    markActive(".gallery-tab", (el) => el === tab);
    markActive(".gallery-grid", (el) => el.dataset.cat === category);
  });
}

function initLightbox() {
  const lightbox = byId("lightbox");
  if (!lightbox) return;
  const image = byId("lightbox-image");
  const caption = byId("lightbox-caption");
  let images = [];
  let current = 0;

  const show = () => {
    image.src = images[current].src;
    caption.textContent = images[current].alt;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  };
  const go = (step) => {
    current = (current + step + images.length) % images.length;
    show();
  };

  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("click", () => {
      const siblings = [...item.closest(".gallery-grid").querySelectorAll(".gallery-item")];
      images = siblings.map((el) => {
        const img = el.querySelector("img");
        return { src: img.src, alt: img.alt };
      });
      current = siblings.indexOf(item);
      show();
    });
  });

  byId("lightbox-close").addEventListener("click", close);
  byId("lightbox-prev").addEventListener("click", () => go(-1));
  byId("lightbox-next").addEventListener("click", () => go(1));
  lightbox.addEventListener("click", (e) => e.target === lightbox && close());
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  });
}

function initSeasonTabs() {
  byId("season-tabs")?.addEventListener("click", (e) => {
    const tab = e.target.closest(".season-tab");
    if (!tab) return;
    const season = tab.dataset.season;
    markActive(".season-tab", (el) => el === tab);
    markActive(".pricing-pane", (el) => el.dataset.season === season);
    replayReveals(`.pricing-pane[data-season="${season}"]`);
  });
}

function replayReveals(paneSelector) {
  document
    .querySelector(paneSelector)
    ?.querySelectorAll(".reveal")
    .forEach((el) => {
      el.classList.remove("in");
      requestAnimationFrame(() => el.classList.add("in"));
    });
}

function init() {
  initGalleryTabs();
  initLightbox();
  initSeasonTabs();
}

export default { init };
