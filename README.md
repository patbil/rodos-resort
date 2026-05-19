# RODOS — Holiday Resort in Rowy, Poland

Static landing page for the RODOS holiday resort on the Baltic coast. Plain
HTML / SCSS / ES modules — no bundler. Repeating sections (gallery, pricing,
attractions, rooms, info, footer) are rendered from data modules in
[`js/data/`](./js/data/) by [`js/modules/render.js`](./js/modules/render.js).
PL / EN / DE translations are served by i18next loaded from a CDN.

## Stack

- HTML5 + ES2022 modules (`<script type="module">`)
- SCSS compiled by [Live Sass Compiler](https://marketplace.visualstudio.com/items?itemName=glenn2223.live-sass) (VSCode) → `css/styles.css`
- [i18next](https://www.i18next.com/) — translations from JSON
- [Flatpickr](https://flatpickr.js.org/) — date picker
- [EmailJS](https://www.emailjs.com/) — booking-form submission
- [Font Awesome](https://fontawesome.com/) — social icons

## Running locally

Native ES modules don't work over `file://`, so open `index.html` through a
local server (VSCode Live Server, `npx serve`, `python -m http.server`).

## EmailJS

The booking form sends messages through EmailJS. Drop your IDs into
[`js/config.js`](./js/config.js):

```js
export const EMAILJS_PUBLIC_KEY = "...";
export const EMAILJS_SERVICE_ID = "...";
export const EMAILJS_TEMPLATE_ID = "...";
```

All three identifiers are public by design — the browser SDK exposes them in
every request. The endpoint is protected by the **Allowed Origins** list in
the EmailJS dashboard; add your production domain there. While the values
remain blank, the form falls back to a demo mode (simulated send).

## Translations

Keys live in [`js/locales/{pl,en,de}.json`](./js/locales/). All three locales
share the same set of ~170 keys. Elements opt into translation via:

- `data-i18n="key"` — `textContent`
- `data-i18n-html="key"` — `innerHTML` (for strings containing markup)
- `data-i18n-placeholder="key"` — `placeholder` attribute
- `data-i18n-title="key"` — `title` attribute

i18next imports the JSON via `import attributes` (Chrome 123+, Firefox 145+).

## Images and performance

Full-size images live under `img/gallery/{category}/{n}.jpg` and
`img/attractions/{file}.webp`. All `<img>` tags render with
`loading="lazy"` and `decoding="async"`.

To reduce mobile payload, drop in ~600 px variants:

- Gallery: `img/gallery/{category}/sm/{n}.jpg` → set `hasSmall: true` in [`js/data/gallery.js`](./js/data/gallery.js).
- Attractions / rooms: add a `smallImage: "…"` field to the matching entry in [`js/data/`](./js/data/).

The renderer picks up the small variant and emits `srcset` automatically —
browsers then choose the lighter file on narrow viewports.

## Layout

```
├── index.html              # entry point, section skeletons + static content
├── js/
│   ├── main.js             # bootstrap (render → i18n → behavior)
│   ├── config.js           # EmailJS IDs
│   ├── data/               # pure data for repeating sections
│   │   ├── attractions.js, rooms.js, gallery.js, pricing.js, info.js, social.js
│   ├── locales/            # JSON translations (pl / en / de)
│   └── modules/
│       ├── i18n.js         # i18next + DOM apply
│       ├── ui.js           # loader, particles, nav, scroll-spy, reveals
│       ├── gallery.js      # gallery tabs, lightbox, season tabs
│       ├── form.js         # flatpickr + EmailJS
│       └── render.js       # injects repeating sections into the DOM
├── scss/
│   ├── styles.scss         # entry @use partials
│   ├── abstracts/          # variables, mixins
│   ├── base/               # reset, typography
│   ├── components/         # buttons, loader, lightbox, flatpickr overrides
│   ├── layout/             # nav, footer, responsive
│   ├── sections/           # hero, about, gallery, …
│   └── utilities/          # reveals, helpers
├── css/
│   └── styles.css          # Live Sass Compiler output
└── img/, video/            # assets
```

## Attribution

Code was written in collaboration with an AI assistant — **Claude Opus 4.7**
(Anthropic). Copy, section structure, photography and business data come
from the resort owner.
