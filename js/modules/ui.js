const byId = (id) => document.getElementById(id);

function initLoader() {
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

function initParticles(count = 20) {
  const container = byId("hero-particles-container");
  if (!container) return;

  const fragment = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    const duration = 9 + Math.random() * 13;
    const driftX = `${(Math.random() - 0.5) * 160}px`;
    particle.style.cssText = `left:${Math.random() * 100}%;--dx:${driftX};animation-duration:${duration}s;animation-delay:${Math.random() * duration}s;`;
    fragment.appendChild(particle);
  }
  container.appendChild(fragment);
}

function initReveal() {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("in");
      }),
    { threshold: 0.1 },
  );
  document
    .querySelectorAll(".reveal, .reveal-left")
    .forEach((el) => observer.observe(el));
}

function initNav() {
  const burger = byId("hamburger");
  const menu = byId("nav-links");
  if (!burger || !menu) return;

  const setOpen = (open) => {
    menu.classList.toggle("open", open);
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  };

  burger.addEventListener("click", () => setOpen(!menu.classList.contains("open")));
  menu.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => setOpen(false)),
  );
}

function initScrollSpy() {
  const sectionIds = ["start", "gallery", "rooms", "attractions", "pricing", "info", "contact"];
  const navbar = byId("nav");
  const links = document.querySelectorAll(".nav-links a");
  let scheduled = false;

  const highlight = () => {
    let activeId = "";
    for (const id of sectionIds) {
      const section = byId(id);
      if (section && window.scrollY >= section.offsetTop - 100) activeId = id;
    }
    links.forEach((link) =>
      link.classList.toggle("active", link.getAttribute("href") === `#${activeId}`),
    );
    navbar?.classList.toggle("scrolled", window.scrollY > 60);
    scheduled = false;
  };

  window.addEventListener("scroll", () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(highlight);
  });
  highlight();
}

function initYear() {
  const target = byId("year");
  if (target) target.textContent = new Date().getFullYear();
}

function init() {
  initLoader();
  initParticles();
  initReveal();
  initNav();
  initScrollSpy();
  initYear();
}

export default { init };
