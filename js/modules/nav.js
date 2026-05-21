import { byId, qsa, on, toggleActive } from "../utils/dom.js";

const navConfig = {
  sectionIds: ["start", "gallery", "rooms", "attractions", "pricing", "info", "contact"],
  activeSectionOffset: 100,
  scrolledThreshold: 60,
};

function setupHamburger() {
  const burger = byId("hamburger");
  const menu = byId("nav-links");
  if (!burger || !menu) return;

  function setMenuOpen(isOpen) {
    menu.classList.toggle("open", isOpen);
    burger.classList.toggle("open", isOpen);
    burger.setAttribute("aria-expanded", String(isOpen));
  }

  on(burger, "click", () => setMenuOpen(!menu.classList.contains("open")));
  qsa("a", menu).forEach((link) => on(link, "click", () => setMenuOpen(false)));
}

function getActiveSectionId() {
  let activeSectionId = "";
  for (const sectionId of navConfig.sectionIds) {
    const section = byId(sectionId);
    const reached =
      section && window.scrollY >= section.offsetTop - navConfig.activeSectionOffset;
    if (reached) activeSectionId = sectionId;
  }
  return activeSectionId;
}

function setupScrollSpy() {
  const navbar = byId("nav");
  const links = qsa(".nav-links a");
  if (!links.length) return;

  function updateActiveLink() {
    const activeSectionId = getActiveSectionId();
    toggleActive(".nav-links a", (link) => link.hash === `#${activeSectionId}`);
    navbar?.classList.toggle("scrolled", window.scrollY > navConfig.scrolledThreshold);
  }

  let isScheduled = false;
  on(window, "scroll", () => {
    if (isScheduled) return;
    isScheduled = true;
    requestAnimationFrame(() => {
      updateActiveLink();
      isScheduled = false;
    });
  });

  updateActiveLink();
}

export function initNav() {
  setupHamburger();
  setupScrollSpy();
}
