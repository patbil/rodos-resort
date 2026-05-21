import {
  byId,
  qs,
  qsa,
  on,
  delegate,
  onSwipe,
  addClass,
  removeClass,
  toggleActive,
} from "../utils/dom.js";

const KEYBOARD = {
  escape: "Escape",
  arrowLeft: "ArrowLeft",
  arrowRight: "ArrowRight",
  enter: "Enter",
  space: " ",
};

function setupTabs() {
  delegate(byId("gallery-tabs"), ".gallery-tab", "click", function (event) {
    const tab = event.target.closest(".gallery-tab");
    const { cat: category } = tab.dataset;
    toggleActive(".gallery-tab", (element) => element === tab);
    toggleActive(
      ".gallery-grid",
      (element) => element.dataset.cat === category,
    );
  });
}

function readGalleryImages(galleryItem) {
  const items = qsa(".gallery-item", galleryItem.closest(".gallery-grid"));
  const images = items.map(function (item) {
    const image = qs("img", item);
    return { src: image.src, alt: image.alt };
  });
  return { images, startIndex: items.indexOf(galleryItem) };
}

function setupLightbox() {
  const lightbox = byId("lightbox");
  if (!lightbox) return;

  const imageElement = byId("lightbox-image");
  const captionElement = byId("lightbox-caption");
  let images = [];
  let currentIndex = 0;
  let lastFocusedElement = null;

  function renderCurrent() {
    imageElement.src = images[currentIndex].src;
    captionElement.textContent = images[currentIndex].alt;
  }

  function openLightbox(galleryItem) {
    const { images: collectedImages, startIndex } =
      readGalleryImages(galleryItem);
    images = collectedImages;
    currentIndex = startIndex;
    renderCurrent();
    lastFocusedElement = galleryItem;
    addClass(lightbox, "open");
    document.body.style.overflow = "hidden";
    byId("lightbox-close")?.focus();
  }

  function closeLightbox() {
    removeClass(lightbox, "open");
    document.body.style.overflow = "";
    lastFocusedElement?.focus();
  }

  function step(offset) {
    currentIndex = (currentIndex + offset + images.length) % images.length;
    renderCurrent();
  }

  function handleKeydown(event) {
    if (!lightbox.classList.contains("open")) return;
    if (event.key === KEYBOARD.escape) closeLightbox();
    if (event.key === KEYBOARD.arrowLeft) step(-1);
    if (event.key === KEYBOARD.arrowRight) step(1);
  }

  delegate(document, ".gallery-item", "click", (event) =>
    openLightbox(event.target.closest(".gallery-item")),
  );
  delegate(document, ".gallery-item", "keydown", (event) => {
    if (event.key !== KEYBOARD.enter && event.key !== KEYBOARD.space) return;
    event.preventDefault();
    openLightbox(event.target.closest(".gallery-item"));
  });
  on(byId("lightbox-close"), "click", closeLightbox);
  on(byId("lightbox-prev"), "click", () => step(-1));
  on(byId("lightbox-next"), "click", () => step(1));
  on(lightbox, "click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  on(document, "keydown", handleKeydown);
  onSwipe(lightbox, { onLeft: () => step(1), onRight: () => step(-1) });
}

export function initGallery() {
  setupTabs();
  setupLightbox();
}
