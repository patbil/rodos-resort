// RODOS — gallery tabs, lightbox, season tabs (pricing)

export function initGalleryTabs() {
  const tabs = document.getElementById("gallery-tabs");
  if (!tabs) return;
  tabs.addEventListener("click", (e) => {
    const btn = e.target.closest(".gallery-tab");
    if (!btn) return;
    document
      .querySelectorAll(".gallery-tab")
      .forEach((t) => t.classList.remove("active"));
    btn.classList.add("active");
    document
      .querySelectorAll(".gallery-grid")
      .forEach((g) => g.classList.remove("active"));
    document
      .querySelector(`.gallery-grid[data-cat="${btn.dataset.cat}"]`)
      ?.classList.add("active");
  });
}

export function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;
  const lightboxImg = document.getElementById("lightbox-image");
  const lightboxCap = document.getElementById("lightbox-caption");
  const lightboxClose = document.getElementById("lightbox-close");
  const lightboxPrev = document.getElementById("lightbox-prev");
  const lightboxNext = document.getElementById("lightbox-next");

  let images = [];
  let idx = 0;

  const show = () => {
    lightboxImg.src = images[idx].src;
    lightboxCap.textContent = images[idx].alt;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  };

  const step = (delta) => {
    idx = (idx + delta + images.length) % images.length;
    show();
  };

  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("click", () => {
      const grid = item.closest(".gallery-grid");
      const items = [...grid.querySelectorAll(".gallery-item")];
      images = items.map((i) => {
        const img = i.querySelector("img");
        return { src: img.src, alt: img.alt };
      });
      idx = items.indexOf(item);
      show();
    });
  });

  lightboxClose.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) close();
  });
  lightboxPrev.addEventListener("click", () => step(-1));
  lightboxNext.addEventListener("click", () => step(1));

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });
}

export function initSeasonTabs() {
  const tabs = document.getElementById("season-tabs");
  if (!tabs) return;
  tabs.addEventListener("click", (e) => {
    const btn = e.target.closest(".season-tab");
    if (!btn) return;
    document
      .querySelectorAll(".season-tab")
      .forEach((t) => t.classList.remove("active"));
    btn.classList.add("active");
    document
      .querySelectorAll(".pricing-pane")
      .forEach((t) => t.classList.remove("active"));
    const pane = document.querySelector(
      `.pricing-pane[data-season="${btn.dataset.season}"]`,
    );
    if (!pane) return;
    pane.classList.add("active");
    pane.querySelectorAll(".reveal").forEach((el) => {
      el.classList.remove("in");
      requestAnimationFrame(() => el.classList.add("in"));
    });
  });
}
