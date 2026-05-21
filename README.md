# RODOS RESORT

Business-card / landing site for **RODOS** — a holiday resort in Rowy on the
Polish Baltic coast. A single static page that presents the resort and lets
guests send a booking enquiry, available in Polish, English and German.

It covers:

- Hero intro with a short "about the resort" section
- Photo gallery grouped by category (resort, cottages, apartments, playground),
  with a lightbox that supports keyboard arrows and swipe on mobile
- Accommodation cards and a season-based price list
- Nearby attractions
- Practical info (check-in, deposit, parking, house rules)
- Contact details, map and a validated booking-enquiry form

## Stack

Vanilla ES modules and SCSS — no bundler or framework. External libraries are
loaded from a CDN:

- **i18next** — translations
- **Flatpickr** — date picker in the form
- **EmailJS** — delivers the booking form
- **Font Awesome** — social icons

Styles are written in SCSS and compiled to `css/styles.css` with Dart Sass
(for example the Live Sass Compiler extension).

## Running locally

ES modules require HTTP, so serve the folder rather than opening
`index.html` from disk. Any static server works:

- VS Code — the Live Server extension
- Node — `npx serve`
- Python — `python -m http.server`

## Configuration

The booking form is delivered through EmailJS. Add your account IDs to
[`js/config.js`](js/config.js):

```js
export default {
  EMAILJS_PUBLIC_KEY: "...",
  EMAILJS_SERVICE_ID: "...",
  EMAILJS_TEMPLATE_ID: "...",
};
```

Notes:

- These IDs are public by design; the endpoint is protected by the
  **Allowed Origins** list in the EmailJS dashboard.
- While the IDs are blank, the form runs in demo mode and only simulates a
  send.
- The EmailJS template receives these variables (the form field `name`s):
  `name`, `email`, `phone`, `accommodationType`, `dateFrom`, `dateTo`,
  `adultsCount`, `childrenCount`, `pets`, `recommendation`, `message`. Empty
  optional fields arrive as `Brak danych`.

## Languages

Translations live in [`js/locales/`](js/locales) as `pl.json`, `en.json` and
`de.json`, each holding the same set of keys.

- The language selector in the header switches the active locale.
- The choice is saved to `localStorage` and restored on the next visit;
  otherwise the site follows the browser language and falls back to Polish.
- To edit copy, change the matching key in all three files.
- In markup, elements opt in through data attributes:
  - `data-i18n` — text content
  - `data-i18n-html` — content that contains markup
  - `data-i18n-placeholder` — input placeholder
  - `data-i18n-title` — title attribute

## Project structure

```
index.html        markup and section containers
js/
  index.js        bootstrap (render, then init each module)
  config.js       EmailJS IDs, storage keys, languages, shared constants
  data/           section content (gallery, rooms, pricing, attractions, info, social)
  locales/        pl / en / de translations
  utils/          shared helpers (dom, storage, animation)
  modules/        render, i18n, ui, nav, gallery, pricing, form, cookies
scss/             styles, compiled to css/styles.css
assets/           images (with sm/ mobile variants) and video
```

Repeating sections are generated from `js/data/` by `js/modules/render.js`, so
adding a cottage, an attraction or a price means editing data rather than
markup.

## A note on AI

The project work was supported by AI tools, which were mainly used for handling trivial, repetitive, and low-effort tasks. This helped speed up work on routine tasks that were not interesting or engaging. Key conceptual and design decisions, content creation, as well as overall supervision and verification were carried out by a human.
