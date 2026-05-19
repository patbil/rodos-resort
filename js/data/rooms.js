// Accommodation cards on the "Noclegi" section. `features` is an array of
// translation-key suffixes resolved as `${i18n}.f${index}`. `badgeMod` is an
// optional modifier class on the badge.

export const rooms = [
  {
    image: "cottages/1.jpg",
    alt: "Domek letniskowy RODOS",
    i18n: "rooms.c0",
    price: 320,
    featureCount: 4,
    badgeMod: "",
  },
  {
    image: "apartaments/1.jpg",
    alt: "Apartament 5-osobowy",
    i18n: "rooms.c1",
    price: 320,
    featureCount: 5,
    badgeMod: "is-ocean",
  },
  {
    image: "apartaments_big/1.jpg",
    alt: "Apartament 8-osobowy",
    i18n: "rooms.c2",
    price: 430,
    featureCount: 5,
    badgeMod: "is-teal",
  },
];
