export const replayReveals = (container) => {
  if (!container) return;
  const reveals = container.querySelectorAll(".reveal");
  reveals.forEach((el) => {
    el.classList.remove("in");
    void el.offsetWidth;
    el.classList.add("in");
  });
};

export const setupReveal = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
  );

  document.querySelectorAll(".reveal, .reveal-left").forEach((el) => {
    observer.observe(el);
  });

  return observer;
};

export const createParticle = () => {
  const particle = document.createElement("div");
  particle.className = "particle";

  const duration = 9 + Math.random() * 13;
  const driftX = `${(Math.random() - 0.5) * 160}px`;

  particle.style.cssText = `
    left: ${Math.random() * 100}%;
    --dx: ${driftX};
    animation-duration: ${duration}s;
    animation-delay: ${Math.random() * duration}s;
  `;

  return particle;
};

export const setupParticles = (count = 20) => {
  const container = document.getElementById("hero-particles-container");
  if (!container) return;

  const fragment = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    fragment.appendChild(createParticle());
  }
  container.appendChild(fragment);
};
