import { byId, qsa } from "../utils/dom.js";

const SECTION_IDS = [
  "start",
  "gallery",
  "rooms",
  "attractions",
  "pricing",
  "info",
  "contact",
];

function setupLoader() {
  const loader = byId("loader");
  if (!loader) return;
  const video = byId("hero-video");
  let hidden = false;

  const hide = () => {
    if (hidden) return;
    hidden = true;
    loader.classList.add("hidden");
    setTimeout(() => loader.remove(), 700);
  };

  if (video?.readyState >= 3) hide();
  else video?.addEventListener("canplay", hide, { once: true });
  window.addEventListener("load", hide);
  setTimeout(hide, 3500);
}

function createParticle() {
  const particle = document.createElement("div");
  particle.className = "particle";
  const duration = 9 + Math.random() * 13;
  const driftX = `${(Math.random() - 0.5) * 160}px`;
  particle.style.cssText = [
    `left:${Math.random() * 100}%`,
    `--dx:${driftX}`,
    `animation-duration:${duration}s`,
    `animation-delay:${Math.random() * duration}s`,
  ].join(";");
  return particle;
}

function setupParticles(count = 20) {
  const container = byId("hero-particles-container");
  if (!container) return;
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < count; i++) fragment.appendChild(createParticle());
  container.appendChild(fragment);
}

function setupReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) entry.target.classList.add("in");
      }
    },
    { threshold: 0.1 },
  );
  qsa(".reveal, .reveal-left").forEach((el) => observer.observe(el));
}

function setupHamburger() {
  const burger = byId("hamburger");
  const menu = byId("nav-links");
  if (!burger || !menu) return;

  const setOpen = (open) => {
    menu.classList.toggle("open", open);
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  };

  burger.addEventListener("click", () =>
    setOpen(!menu.classList.contains("open")),
  );
  menu
    .querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", () => setOpen(false)));
}

function activeSectionId() {
  let id = "";
  for (const sectionId of SECTION_IDS) {
    const section = byId(sectionId);
    if (section && window.scrollY >= section.offsetTop - 100) id = sectionId;
  }
  return id;
}

function setupScrollSpy() {
  const navbar = byId("nav");
  const links = qsa(".nav-links a");

  const update = () => {
    const activeId = activeSectionId();
    links.forEach((link) =>
      link.classList.toggle("active", link.hash === `#${activeId}`),
    );
    navbar?.classList.toggle("scrolled", window.scrollY > 60);
  };

  let scheduled = false;
  window.addEventListener("scroll", () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      update();
      scheduled = false;
    });
  });
  update();
}

function init() {
  setupLoader();
  setupParticles();
  setupReveal();
  setupHamburger();
  setupScrollSpy();
}

export default { init };
