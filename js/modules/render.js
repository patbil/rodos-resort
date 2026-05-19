// RODOS — section renderers (data → HTML). Called once on boot, before i18n
// applies, so `data-i18n` attributes on rendered nodes get translated.

import { attractions } from "../data/attractions.js";
import { rooms } from "../data/rooms.js";
import { gallery } from "../data/gallery.js";
import { seasons, pricingRooms } from "../data/pricing.js";
import { infoCards } from "../data/info.js";
import { socials, bookingUrl } from "../data/social.js";

const FOOTER_NAV = [
  { href: "#start", labelKey: "nav.start" },
  { href: "#gallery", labelKey: "nav.gallery" },
  { href: "#rooms", labelKey: "nav.rooms" },
  { href: "#attractions", labelKey: "nav.attractions" },
  { href: "#pricing", labelKey: "nav.pricing" },
  { href: "#info", labelKey: "nav.info" },
  { href: "#contact", labelKey: "nav.contact" },
];

const CONTACT_INFO = {
  address: "ul. Wczasowa 2, 76-212 Rowy",
  phone: "+48 505 816 638",
  phoneHref: "tel:+48505816638",
  email: "info@rodos-rowy.pl",
};

const pad2 = (n) => String(n).padStart(2, "0");

function setHtml(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

// Build an <img> with optional srcset for a smaller variant. When `small` is
// truthy, browsers may pick the lighter file on narrow viewports. Always emits
// `loading="lazy"` + `decoding="async"` so off-screen images don't block load.
function img({ src, small, alt, sizes = "(max-width: 768px) 100vw, 33vw" }) {
  const srcset = small ? ` srcset="${small} 600w, ${src} 1200w" sizes="${sizes}"` : "";
  return `<img src="${src}" alt="${alt}" loading="lazy" decoding="async"${srcset} />`;
}

// `dir`-based assets follow the convention:
//   ./img/<base>/<dir>/<n>.<ext>       (full size)
//   ./img/<base>/<dir>/sm/<n>.<ext>    (small/mobile variant — optional)
function galleryImg(cat, n) {
  const full = `./img/gallery/${cat.dir}/${n}.jpg`;
  const small = cat.hasSmall ? `./img/gallery/${cat.dir}/sm/${n}.jpg` : null;
  return img({ src: full, small, alt: cat.alt });
}

function attractionImg(a) {
  const full = `./img/attractions/${a.image}`;
  const small = a.smallImage ? `./img/attractions/${a.smallImage}` : null;
  return img({
    src: full,
    small,
    alt: a.alt,
    sizes: "(max-width: 768px) 100vw, 33vw",
  });
}

function roomImg(r) {
  const full = `./img/gallery/${r.image}`;
  const small = r.smallImage ? `./img/gallery/${r.smallImage}` : null;
  return img({
    src: full,
    small,
    alt: r.alt,
    sizes: "(max-width: 768px) 100vw, 33vw",
  });
}

function renderAttractions() {
  const html = attractions
    .map(
      (a, i) => `
    <div class="attraction-card reveal">
      <div class="attraction-card-photo">${attractionImg(a)}</div>
      <div class="attraction-card-body">
        <div class="attraction-card-num">${pad2(i + 1)}</div>
        <h3 class="attraction-card-title" data-i18n="${a.i18n}.title"></h3>
        <p class="attraction-card-desc" data-i18n="${a.i18n}.desc"></p>
      </div>
    </div>`,
    )
    .join("");
  setHtml("attractions-grid", html);
}

function renderRooms() {
  const html = rooms
    .map((r) => {
      const features = Array.from({ length: r.featureCount }, (_, i) => i)
        .map(
          (i) =>
            `<span class="room-feature" data-i18n="${r.i18n}.f${i}"></span>`,
        )
        .join("");
      const badgeClass = r.badgeMod
        ? `room-card-badge ${r.badgeMod}`
        : "room-card-badge";
      return `
    <div class="room-card reveal">
      <div class="room-card-img">
        ${roomImg(r)}
        <div class="${badgeClass}" data-i18n="${r.i18n}.badge"></div>
      </div>
      <div class="room-card-body">
        <div class="room-card-type" data-i18n="rooms.type"></div>
        <div class="room-card-name" data-i18n="${r.i18n}.name"></div>
        <div class="room-card-features">${features}</div>
        <p class="room-card-desc" data-i18n="${r.i18n}.desc"></p>
        <div class="room-card-price">
          <span class="room-price-from" data-i18n="rooms.from"></span><span class="room-price-value">${r.price}</span><span class="room-price-unit" data-i18n="rooms.priceUnit"></span>
        </div>
      </div>
    </div>`;
    })
    .join("");
  setHtml("rooms-list", html);
}

function renderGallery() {
  const tabs = gallery
    .map(
      (cat, i) => `
    <button class="gallery-tab${i === 0 ? " active" : ""}" data-cat="${cat.id}" data-i18n="${cat.labelKey}"></button>`,
    )
    .join("");
  setHtml("gallery-tabs", tabs);

  const grids = gallery
    .map((cat, idx) => {
      const items = Array.from({ length: cat.count }, (_, i) => i + 1)
        .map(
          (n) => `
      <div class="gallery-item">${galleryImg(cat, n)}<div class="gallery-overlay"><span data-i18n="${cat.labelKey}"></span><span> — ${pad2(n)}</span></div></div>`,
        )
        .join("");
      return `
    <div class="gallery-grid${idx === 0 ? " active" : ""}" data-cat="${cat.id}">${items}
    </div>`;
    })
    .join("");
  setHtml("gallery-wrap", grids);
}

function renderPricing() {
  const html = seasons
    .map((season, sIdx) => {
      const cards = pricingRooms
        .map((room) => {
          const ribbon = room.ribbonKey
            ? `<div class="pricing-card-ribbon" data-i18n="${room.ribbonKey}"></div>`
            : "";
          const featuredClass = room.featured ? "pricing-card featured" : "pricing-card";
          const btnClass = room.featured ? "btn-primary" : "btn-outline";
          const features = room.features
            .map((key) => `<li data-i18n="${key}"></li>`)
            .join("");
          return `
      <div class="${featuredClass} reveal">
        ${ribbon}
        <div class="pricing-card-eyebrow" data-i18n="${room.eyeKey}"></div>
        <div class="pricing-card-name" data-i18n="${room.nameKey}"></div>
        <div class="pricing-card-amount"><sup data-i18n="cn.from"></sup>${season.prices[room.id]}<sub data-i18n="cn.unit"></sub></div>
        <div class="pricing-card-note" data-i18n="${room.noteKey}"></div>
        <ul class="pricing-card-list">${features}</ul>
        <a href="#contact" class="${btnClass}" data-i18n="cn.reserve"></a>
      </div>`;
        })
        .join("");
      return `
    <div class="pricing-pane${sIdx === 0 ? " active" : ""}" data-season="${season.id}">
      <p class="pricing-pane-intro" data-i18n-html="cn.intro.${season.id}"></p>
      <div class="pricing-cards">${cards}
      </div>
    </div>`;
    })
    .join("");
  setHtml("pricing-panes", html);

  const tabs = seasons
    .map(
      (s, i) => `
    <button class="season-tab${i === 0 ? " active" : ""}" data-season="${s.id}" data-i18n="cn.tab.${s.id}"></button>`,
    )
    .join("");
  setHtml("season-tabs", tabs);
}

function renderInfo() {
  const html = infoCards
    .map(
      (card) => `
    <div class="info-card reveal">
      <div class="info-card-icon">${card.icon}</div>
      <h3 class="info-card-title" data-i18n="${card.i18n}.title"></h3>
      <div class="info-card-body" data-i18n-html="${card.i18n}.body"></div>
    </div>`,
    )
    .join("");
  setHtml("info-grid", html);
}

function renderFooter() {
  setHtml(
    "footer-nav",
    FOOTER_NAV.map(
      ({ href, labelKey }) =>
        `<li><a href="${href}" data-i18n="${labelKey}"></a></li>`,
    ).join(""),
  );

  setHtml(
    "footer-booking",
    `
    <li>${CONTACT_INFO.address}</li>
    <li><a href="${CONTACT_INFO.phoneHref}">${CONTACT_INFO.phone}</a></li>
    <li><a href="mailto:${CONTACT_INFO.email}">${CONTACT_INFO.email}</a></li>
    <li><a href="${bookingUrl}" target="_blank" rel="noopener" data-i18n="foot.booking"></a></li>`,
  );

  setHtml(
    "footer-socials",
    socials
      .map(
        (s) =>
          `<li><a href="${s.url}" target="_blank" rel="noopener" aria-label="${s.name}"><i class="${s.icon}"></i></a></li>`,
      )
      .join(""),
  );
}

export function renderSections() {
  renderAttractions();
  renderRooms();
  renderGallery();
  renderPricing();
  renderInfo();
  renderFooter();
}
