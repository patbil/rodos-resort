// RODOS — gallery tabs, lightbox, season tabs (pricing)

export function initGalleryTabs() {
  const tabs = document.getElementById("galTabs");
  if (!tabs) return;
  tabs.addEventListener("click", (e) => {
    const btn = e.target.closest(".gal-tab");
    if (!btn) return;
    document
      .querySelectorAll(".gal-tab")
      .forEach((t) => t.classList.remove("active"));
    btn.classList.add("active");
    document
      .querySelectorAll(".gal-grid")
      .forEach((g) => g.classList.remove("active"));
    document.getElementById(`gal-${btn.dataset.cat}`)?.classList.add("active");
  });
}

export function initLightbox() {
  const lb = document.getElementById("lb");
  if (!lb) return;
  const lbImg = document.getElementById("lbImg");
  const lbCap = document.getElementById("lbCap");
  const lbX = document.getElementById("lbX");
  const lbPrev = document.getElementById("lbPrev");
  const lbNext = document.getElementById("lbNext");

  let images = [];
  let idx = 0;

  const show = () => {
    lbImg.src = images[idx].src;
    lbCap.textContent = images[idx].alt;
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    lb.classList.remove("open");
    document.body.style.overflow = "";
  };

  const step = (delta) => {
    idx = (idx + delta + images.length) % images.length;
    show();
  };

  document.querySelectorAll(".gi").forEach((item) => {
    item.addEventListener("click", () => {
      const grid = item.closest(".gal-grid");
      const items = [...grid.querySelectorAll(".gi")];
      images = items.map((i) => {
        const img = i.querySelector("img");
        return { src: img.src, alt: img.alt };
      });
      idx = items.indexOf(item);
      show();
    });
  });

  lbX.addEventListener("click", close);
  lb.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) close();
  });
  lbPrev.addEventListener("click", () => step(-1));
  lbNext.addEventListener("click", () => step(1));

  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });
}

export function initSeasonTabs() {
  const tabs = document.getElementById("stabs");
  if (!tabs) return;
  tabs.addEventListener("click", (e) => {
    const btn = e.target.closest(".s-tab");
    if (!btn) return;
    document
      .querySelectorAll(".s-tab")
      .forEach((t) => t.classList.remove("active"));
    btn.classList.add("active");
    document
      .querySelectorAll(".pt")
      .forEach((t) => t.classList.remove("active"));
    const pt = document.getElementById(`pt-${btn.dataset.s}`);
    if (!pt) return;
    pt.classList.add("active");
    pt.querySelectorAll(".rv").forEach((el) => {
      el.classList.remove("in");
      requestAnimationFrame(() => el.classList.add("in"));
    });
  });
}
