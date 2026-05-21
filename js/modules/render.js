import attractions from "../data/attractions.js";
import rooms from "../data/rooms.js";
import galleryCategories from "../data/gallery.js";
import pricing from "../data/pricing.js";
import infoCards from "../data/info.js";
import social from "../data/social.js";
import { byId } from "../utils/dom.js";

const footerNavLinks = [
  { href: "#start", labelKey: "nav.start" },
  { href: "#gallery", labelKey: "nav.gallery" },
  { href: "#rooms", labelKey: "nav.rooms" },
  { href: "#attractions", labelKey: "nav.attractions" },
  { href: "#pricing", labelKey: "nav.pricing" },
  { href: "#info", labelKey: "nav.info" },
  { href: "#contact", labelKey: "nav.contact" },
];

const contactInfo = {
  address: "ul. Wczasowa 2, 76-212 Rowy",
  phone: "+48 505 816 638",
  phoneHref: "tel:+48505816638",
  email: "info@rodos-rowy.pl",
};

const imageConfig = {
  sizes: "(max-width: 768px) 100vw, 33vw",
  galleryWidths: { small: 600, full: 1000 },
  attractionWidths: { small: 420, full: 600 },
};

function padTwoDigits(value) {
  return String(value).padStart(2, "0");
}

function setHtml(id, html) {
  const element = byId(id);
  if (element) element.innerHTML = html;
}

function toSmallImage(source) {
  return source.replace(/([^/]+)$/, "sm/$1");
}

function imageTag({ src, alt, widths, sizes = imageConfig.sizes }) {
  const srcset = `${toSmallImage(src)} ${widths.small}w, ${src} ${widths.full}w`;
  return `<img src="${src}" srcset="${srcset}" sizes="${sizes}" alt="${alt}" loading="lazy" decoding="async" />`;
}

function galleryImage(category, imageNumber) {
  return imageTag({
    src: `./assets/img/gallery/${category.dir}/${imageNumber}.jpg`,
    alt: category.alt,
    widths: imageConfig.galleryWidths,
  });
}

function attractionImage(attraction) {
  return imageTag({
    src: `./assets/img/attractions/${attraction.image}`,
    alt: attraction.alt,
    widths: imageConfig.attractionWidths,
  });
}

function roomImage(room) {
  return imageTag({
    src: `./assets/img/gallery/${room.image}`,
    alt: room.alt,
    widths: imageConfig.galleryWidths,
  });
}

function renderAttractions() {
  const html = attractions
    .map(
      (attraction, index) => `
    <div class="attraction-card reveal">
      <div class="attraction-card-photo">${attractionImage(attraction)}</div>
      <div class="attraction-card-body">
        <div class="attraction-card-num">${padTwoDigits(index + 1)}</div>
        <h3 class="attraction-card-title" data-i18n="${attraction.i18n}.title"></h3>
        <p class="attraction-card-desc" data-i18n="${attraction.i18n}.desc"></p>
      </div>
    </div>`,
    )
    .join("");
  setHtml("attractions-grid", html);
}

function renderRoomFeatures(room) {
  return Array.from(
    { length: room.featureCount },
    (_, index) =>
      `<span class="room-feature" data-i18n="${room.i18n}.f${index}"></span>`,
  ).join("");
}

function renderRooms() {
  const html = rooms
    .map((room) => {
      const badgeClass = room.badgeMod
        ? `room-card-badge ${room.badgeMod}`
        : "room-card-badge";
      return `
    <div class="room-card reveal">
      <div class="room-card-img">
        ${roomImage(room)}
        <div class="${badgeClass}" data-i18n="${room.i18n}.badge"></div>
      </div>
      <div class="room-card-body">
        <div class="room-card-type" data-i18n="rooms.type"></div>
        <div class="room-card-name" data-i18n="${room.i18n}.name"></div>
        <div class="room-card-features">${renderRoomFeatures(room)}</div>
        <p class="room-card-desc" data-i18n="${room.i18n}.desc"></p>
        <div class="room-card-price">
          <span class="room-price-from" data-i18n="rooms.from"></span><span class="room-price-value">${room.price}</span><span class="room-price-unit" data-i18n="rooms.priceUnit"></span>
        </div>
      </div>
    </div>`;
    })
    .join("");
  setHtml("rooms-list", html);
}

function renderGallery() {
  const tabs = galleryCategories
    .map(
      (category, index) => `
    <button class="gallery-tab${index === 0 ? " active" : ""}" data-cat="${category.id}" data-i18n="${category.labelKey}"></button>`,
    )
    .join("");
  setHtml("gallery-tabs", tabs);

  const grids = galleryCategories
    .map((category, index) => {
      const items = Array.from(
        { length: category.count },
        (_, offset) => offset + 1,
      )
        .map(
          (imageNumber) => `
      <div class="gallery-item">${galleryImage(category, imageNumber)}<div class="gallery-overlay"><span data-i18n="${category.labelKey}"></span><span> — ${padTwoDigits(imageNumber)}</span></div></div>`,
        )
        .join("");
      return `
    <div class="gallery-grid${index === 0 ? " active" : ""}" data-cat="${category.id}">${items}
    </div>`;
    })
    .join("");
  setHtml("gallery-wrap", grids);
}

function renderPricingCard(room, season) {
  const ribbon = room.ribbonKey
    ? `<div class="pricing-card-ribbon" data-i18n="${room.ribbonKey}"></div>`
    : "";
  const cardClass = room.featured ? "pricing-card featured" : "pricing-card";
  const buttonClass = room.featured ? "btn-primary" : "btn-outline";
  const features = room.features
    .map((featureKey) => `<li data-i18n="${featureKey}"></li>`)
    .join("");
  return `
      <div class="${cardClass} reveal">
        ${ribbon}
        <div class="pricing-card-eyebrow" data-i18n="${room.eyeKey}"></div>
        <div class="pricing-card-name" data-i18n="${room.nameKey}"></div>
        <div class="pricing-card-amount"><sup data-i18n="cn.from"></sup>${season.prices[room.id]}<sub data-i18n="cn.unit"></sub></div>
        <ul class="pricing-card-list">${features}</ul>
        <a href="#contact" class="${buttonClass}" data-i18n="cn.reserve"></a>
      </div>`;
}

function renderPricing() {
  const panes = pricing.seasons
    .map((season, index) => {
      const cards = pricing.rooms
        .map((room) => renderPricingCard(room, season))
        .join("");
      return `
    <div class="pricing-pane${index === 0 ? " active" : ""}" data-season="${season.id}">
      <p class="pricing-pane-intro" data-i18n-html="cn.intro.${season.id}"></p>
      <div class="pricing-cards">${cards}
      </div>
    </div>`;
    })
    .join("");
  setHtml("pricing-panes", panes);

  const tabs = pricing.seasons
    .map(
      (season, index) => `
    <button class="season-tab${index === 0 ? " active" : ""}" data-season="${season.id}" data-i18n="cn.tab.${season.id}"></button>`,
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
  const navItems = footerNavLinks
    .map(
      ({ href, labelKey }) =>
        `<li><a href="${href}" data-i18n="${labelKey}"></a></li>`,
    )
    .join("");
  setHtml("footer-nav", navItems);

  setHtml(
    "footer-booking",
    `
    <li>${contactInfo.address}</li>
    <li><a href="${contactInfo.phoneHref}">${contactInfo.phone}</a></li>
    <li><a href="mailto:${contactInfo.email}">${contactInfo.email}</a></li>
    <li><a href="${social.bookingUrl}" target="_blank" rel="noopener" data-i18n="foot.booking"></a></li>`,
  );

  const socialLinks = social.socials
    .map(
      (profile) =>
        `<li><a href="${profile.url}" target="_blank" rel="noopener" aria-label="${profile.name}"><i class="${profile.icon}"></i></a></li>`,
    )
    .join("");
  setHtml("footer-socials", socialLinks);
}

export function render() {
  renderAttractions();
  renderRooms();
  renderGallery();
  renderPricing();
  renderInfo();
  renderFooter();
}
