// Gallery categories. Full-size images live at `./img/gallery/{dir}/{n}.jpg`.
// Optional mobile thumbnails at `./img/gallery/{dir}/sm/{n}.jpg` (~600px wide).
// Flip `hasSmall: true` once the `sm/` folder exists — render.js will then
// emit srcset and browsers pick the lighter file on narrow viewports.

export const gallery = [
  {
    id: "0",
    dir: "resort",
    count: 8,
    labelKey: "gallery.tab.0",
    alt: "Ośrodek RODOS",
    hasSmall: false,
  },
  {
    id: "1",
    dir: "cottages",
    count: 12,
    labelKey: "gallery.tab.1",
    alt: "Domek RODOS",
    hasSmall: false,
  },
  {
    id: "2",
    dir: "apartaments",
    count: 9,
    labelKey: "gallery.tab.2",
    alt: "Apartament 5-osobowy",
    hasSmall: false,
  },
  {
    id: "3",
    dir: "apartaments_big",
    count: 9,
    labelKey: "gallery.tab.3",
    alt: "Apartament 8-osobowy",
    hasSmall: false,
  },
  {
    id: "4",
    dir: "playground",
    count: 8,
    labelKey: "gallery.tab.4",
    alt: "Plac zabaw",
    hasSmall: false,
  },
];
