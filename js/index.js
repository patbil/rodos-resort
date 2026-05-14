  /* LOADER */
      (function () {
        const loader = document.getElementById("loader");
        const video = document.getElementById("heroVideo");
        if (!loader) return;
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
      })();

      /* DYNAMIC YEAR */
      (function () {
        const y = document.getElementById("year");
        if (y) y.textContent = new Date().getFullYear();
      })();

      /* PARTICLES */
      (function () {
        const c = document.getElementById("hpart");
        for (let i = 0; i < 20; i++) {
          const p = document.createElement("div");
          p.className = "particle";
          const left = Math.random() * 100,
            dur = 9 + Math.random() * 13,
            dx = (Math.random() - 0.5) * 160 + "px";
          p.style.cssText = `left:${left}%;--dx:${dx};animation-duration:${dur}s;animation-delay:${Math.random() * dur}s;`;
          c.appendChild(p);
        }
      })();

      /* HAMBURGER */
      const ham = document.getElementById("hamburger"),
        navL = document.getElementById("navLinks");
      ham.addEventListener("click", () => {
        navL.classList.toggle("open");
        const s = ham.querySelectorAll("span");
        if (navL.classList.contains("open")) {
          s[0].style.transform = "rotate(45deg) translate(4px,4px)";
          s[1].style.opacity = "0";
          s[2].style.transform = "rotate(-45deg) translate(4px,-4px)";
        } else {
          s.forEach((x) => {
            x.style.transform = "";
            x.style.opacity = "";
          });
        }
      });
      navL.querySelectorAll("a").forEach((a) =>
        a.addEventListener("click", () => {
          navL.classList.remove("open");
          ham.querySelectorAll("span").forEach((x) => {
            x.style.transform = "";
            x.style.opacity = "";
          });
        }),
      );

      /* ACTIVE NAV */
      window.addEventListener("scroll", () => {
        let cur = "";
        [
          "start",
          "galeria",
          "noclegi",
          "atrakcje",
          "cennik",
          "informacje",
          "kontakt",
        ].forEach((id) => {
          const el = document.getElementById(id);
          if (el && window.scrollY >= el.offsetTop - 100) cur = id;
        });
        document
          .querySelectorAll(".nav-links a")
          .forEach((a) =>
            a.classList.toggle("active", a.getAttribute("href") === "#" + cur),
          );
        document.getElementById("nav").style.background =
          window.scrollY > 60 ? "rgba(8,24,36,.98)" : "rgba(8,24,36,.93)";
      });

      /* GALLERY TABS */
      document.getElementById("galTabs").addEventListener("click", (e) => {
        const btn = e.target.closest(".gal-tab");
        if (!btn) return;
        document
          .querySelectorAll(".gal-tab")
          .forEach((t) => t.classList.remove("active"));
        btn.classList.add("active");
        const cat = btn.dataset.cat;
        document
          .querySelectorAll(".gal-grid")
          .forEach((g) => g.classList.remove("active"));
        document.getElementById("gal-" + cat).classList.add("active");
      });

      /* LIGHTBOX */
      let lbImgs = [],
        lbIdx = 0;
      document.querySelectorAll(".gi").forEach((item) => {
        item.addEventListener("click", () => {
          const grid = item.closest(".gal-grid");
          lbImgs = [...grid.querySelectorAll(".gi img")].map((i) => ({
            src: i.src,
            alt: i.alt,
          }));
          lbIdx = [...grid.querySelectorAll(".gi")].indexOf(item);
          openLb();
        });
      });
      function openLb() {
        document.getElementById("lbImg").src = lbImgs[lbIdx].src;
        document.getElementById("lbCap").textContent = lbImgs[lbIdx].alt;
        document.getElementById("lb").classList.add("open");
        document.body.style.overflow = "hidden";
      }
      function closeLb() {
        document.getElementById("lb").classList.remove("open");
        document.body.style.overflow = "";
      }
      document.getElementById("lbX").addEventListener("click", closeLb);
      document.getElementById("lb").addEventListener("click", (e) => {
        if (e.target === e.currentTarget) closeLb();
      });
      document.getElementById("lbPrev").addEventListener("click", () => {
        lbIdx = (lbIdx - 1 + lbImgs.length) % lbImgs.length;
        openLb();
      });
      document.getElementById("lbNext").addEventListener("click", () => {
        lbIdx = (lbIdx + 1) % lbImgs.length;
        openLb();
      });
      document.addEventListener("keydown", (e) => {
        if (!document.getElementById("lb").classList.contains("open")) return;
        if (e.key === "Escape") closeLb();
        if (e.key === "ArrowLeft") {
          lbIdx = (lbIdx - 1 + lbImgs.length) % lbImgs.length;
          openLb();
        }
        if (e.key === "ArrowRight") {
          lbIdx = (lbIdx + 1) % lbImgs.length;
          openLb();
        }
      });

      /* SEASON TABS */
      document.getElementById("stabs").addEventListener("click", (e) => {
        const btn = e.target.closest(".s-tab");
        if (!btn) return;
        document
          .querySelectorAll(".s-tab")
          .forEach((t) => t.classList.remove("active"));
        btn.classList.add("active");
        document
          .querySelectorAll(".pt")
          .forEach((t) => t.classList.remove("active"));
        const pt = document.getElementById("pt-" + btn.dataset.s);
        pt.classList.add("active");
        pt.querySelectorAll(".rv").forEach((el) => {
          el.classList.remove("in");
          setTimeout(() => el.classList.add("in"), 60);
        });
      });

      /* REVEAL */
      const obs = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) e.target.classList.add("in");
          }),
        { threshold: 0.1 },
      );
      document.querySelectorAll(".rv,.rvl").forEach((el) => obs.observe(el));

      /* DATEPICKER */
      (function () {
        if (typeof flatpickr === "undefined") return;
        const lang = (window.i18n && window.i18n.getLang()) || "pl";
        const fpLocale =
          lang === "pl" && flatpickr.l10ns.pl
            ? flatpickr.l10ns.pl
            : lang === "de" && flatpickr.l10ns.de
              ? flatpickr.l10ns.de
              : flatpickr.l10ns.default;
        const inEl = document.getElementById("dateIn");
        const outEl = document.getElementById("dateOut");
        if (!inEl || !outEl) return;
        const fpIn = flatpickr(inEl, {
          dateFormat: "d.m.Y",
          minDate: "today",
          disableMobile: true,
          locale: fpLocale,
          onChange: (dates) => {
            if (dates[0]) {
              const next = new Date(dates[0]);
              next.setDate(next.getDate() + 1);
              fpOut.set("minDate", next);
            }
          },
        });
        const fpOut = flatpickr(outEl, {
          dateFormat: "d.m.Y",
          minDate: "today",
          disableMobile: true,
          locale: fpLocale,
        });
        window._fpInstances = [fpIn, fpOut];
      })();

      /* FORM */
      function sendForm(e) {
        e.preventDefault();
        const btn = document.getElementById("submitBtn");
        const lang = (window.i18n && window.i18n.getLang()) || "pl";
        const tr = (k) => (window.i18n ? window.i18n.t(k, lang) : k);
        btn.textContent = tr("form.submit.sending");
        btn.disabled = true;
        btn.style.opacity = ".7";
        setTimeout(() => {
          btn.textContent = tr("form.submit.sent");
          btn.style.background = "#0b7a6e";
          btn.style.borderColor = "#0b7a6e";
          btn.style.opacity = "1";
        }, 1400);
      }