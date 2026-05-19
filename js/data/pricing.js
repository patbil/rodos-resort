// Pricing data. `seasons[i].prices[room.id]` gives the price for season `i`.
// `rooms` declares which feature i18n keys belong to each room type.

export const seasons = [
  { id: "0", prices: { cottages: 320, apt5: 320, apt8: 430 } },
  { id: "1", prices: { cottages: 380, apt5: 380, apt8: 480 } },
  { id: "2", prices: { cottages: 450, apt5: 490, apt8: 650 } },
];

export const pricingRooms = [
  {
    id: "cottages",
    eyeKey: "cn.eye.cottages",
    nameKey: "cn.card.cottages.name",
    noteKey: "cn.card.cottages.note",
    features: ["cn.li.kitchen", "cn.li.bath", "cn.li.parking"],
    featured: false,
  },
  {
    id: "apt5",
    eyeKey: "cn.eye.apart",
    nameKey: "cn.card.apart5.name",
    noteKey: "cn.card.apart5.note",
    ribbonKey: "cn.card.apart5.rib",
    features: ["cn.li.area30", "cn.li.kitchen", "cn.li.bath", "cn.li.parking"],
    featured: true,
  },
  {
    id: "apt8",
    eyeKey: "cn.eye.apart",
    nameKey: "cn.card.apart8.name",
    noteKey: "cn.card.apart8.note",
    features: ["cn.li.area60", "cn.li.kitchenFull", "cn.li.bath", "cn.li.parking"],
    featured: false,
  },
];
