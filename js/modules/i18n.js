import i18next from "https://esm.sh/i18next@23";
import pl from "../locales/pl.json" with { type: "json" };
import en from "../locales/en.json" with { type: "json" };
import de from "../locales/de.json" with { type: "json" };
import { byId, qs, qsa } from "../utils/dom.js";
import config from "../config.js";

const RESOURCES = { pl, en, de };

const DOM_BINDINGS = [
  ["data-i18n", (el, value) => (el.textContent = value)],
  ["data-i18n-html", (el, value) => (el.innerHTML = value)],
  [
    "data-i18n-placeholder",
    (el, value) => el.setAttribute("placeholder", value),
  ],
  ["data-i18n-title", (el, value) => el.setAttribute("title", value)],
];

const t = (key) => i18next.t(key);
const getLang = () => i18next.language;

function detectLang() {
  const saved = localStorage.getItem(config.LANG_STORAGE_KEY);
  if (saved && config.SUPPORTED_LANGS.includes(saved)) return saved;
  const browser = (navigator.language || config.DEFAULT_LANG)
    .slice(0, 2)
    .toLowerCase();
  return config.SUPPORTED_LANGS.includes(browser)
    ? browser
    : config.DEFAULT_LANG;
}

function applyTranslations() {
  for (const [attr, apply] of DOM_BINDINGS) {
    qsa(`[${attr}]`).forEach((el) => apply(el, t(el.getAttribute(attr))));
  }
}

function applyMeta() {
  document.title = t("meta.title");
  qs('meta[name="description"]')?.setAttribute(
    "content",
    t("meta.description"),
  );
}

function syncLangSelect() {
  const select = byId("lang-select");
  if (select) select.value = getLang();
}

// foot.copy is re-rendered via innerHTML, which wipes the year span — reset it.
function refreshYear() {
  const el = byId("year");
  if (el) el.textContent = new Date().getFullYear();
}

function syncFlatpickr() {
  const fp = window.flatpickr;
  if (!fp || !window._fpInstances) return;
  const locale = fp.l10ns[getLang()] || fp.l10ns.default;
  window._fpInstances.forEach((instance) => instance.set("locale", locale));
}

function apply() {
  document.documentElement.lang = getLang();
  applyTranslations();
  applyMeta();
  syncLangSelect();
  refreshYear();
  syncFlatpickr();
}

async function setLang(lang) {
  if (!config.SUPPORTED_LANGS.includes(lang)) return;
  localStorage.setItem(config.LANG_STORAGE_KEY, lang);
  await i18next.changeLanguage(lang);
  apply();
}

async function init() {
  await i18next.init({
    lng: detectLang(),
    fallbackLng: config.DEFAULT_LANG,
    supportedLngs: config.SUPPORTED_LANGS,
    keySeparator: false,
    nsSeparator: false,
    interpolation: { escapeValue: false },
    resources: Object.fromEntries(
      config.SUPPORTED_LANGS.map((lang) => [
        lang,
        { translation: RESOURCES[lang] },
      ]),
    ),
  });
  apply();
  byId("lang-select")?.addEventListener("change", (e) =>
    setLang(e.target.value),
  );
}

export default { init, t, getLang };
