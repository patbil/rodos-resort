// RODOS — UI behaviors: loader, particles, reveal, nav, scroll-spy

export function initLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;
  const video = document.getElementById("heroVideo");
  let hidden = false;

  const hide = () => {
    if (hidden) return;
    hidden = true;
    loader.classList.add("hidden");
    setTimeout(() => loader.remove(), 700);
  };

  if (video) {
    if (video.readyState >= 3) hide();
    else video.addEventListener("canplay", hide, { once: true });
  }
  window.addEventListener("load", hide);
  setTimeout(hide, 3500);
}

export function initParticles(count = 20) {
  const container = document.getElementById("hpart");
  if (!container) return;
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const left = Math.random() * 100;
    const dur = 9 + Math.random() * 13;
    const dx = `${(Math.random() - 0.5) * 160}px`;
    p.style.cssText = `left:${left}%;--dx:${dx};animation-duration:${dur}s;animation-delay:${Math.random() * dur}s;`;
    frag.appendChild(p);
  }
  container.appendChild(frag);
}

export function initReveal() {
  const obs = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("in");
      }),
    { threshold: 0.1 },
  );
  document.querySelectorAll(".rv, .rvl").forEach((el) => obs.observe(el));
}

export function initNav() {
  const ham = document.getElementById("hamburger");
  const navL = document.getElementById("navLinks");
  if (!ham || !navL) return;

  const closeMenu = () => {
    navL.classList.remove("open");
    ham.classList.remove("open");
    ham.setAttribute("aria-expanded", "false");
  };

  ham.addEventListener("click", () => {
    const open = navL.classList.toggle("open");
    ham.classList.toggle("open", open);
    ham.setAttribute("aria-expanded", String(open));
  });

  navL.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", closeMenu),
  );
}

export function initScrollSpy() {
  const sections = [
    "start",
    "galeria",
    "noclegi",
    "atrakcje",
    "cennik",
    "informacje",
    "kontakt",
  ];
  const nav = document.getElementById("nav");
  const links = document.querySelectorAll(".nav-links a");
  let ticking = false;

  const onScroll = () => {
    let current = "";
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 100) current = id;
    }
    links.forEach((a) =>
      a.classList.toggle("active", a.getAttribute("href") === `#${current}`),
    );
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 60);
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(onScroll);
  });
  onScroll();
}

export function initYear() {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
}
