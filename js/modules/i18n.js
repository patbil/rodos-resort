// RODOS — i18n via i18next (ESM CDN, JSON resources via import attributes)
import i18next from "https://esm.sh/i18next@23";
import pl from "../locales/pl.json" with { type: "json" };
import en from "../locales/en.json" with { type: "json" };
import de from "../locales/de.json" with { type: "json" };

const RESOURCES = { pl, en, de };
const SUPPORTED = Object.keys(RESOURCES);
const DEFAULT_LANG = "pl";
const STORAGE_KEY = "rodos-lang";

function detectLang() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && SUPPORTED.includes(saved)) return saved;
  const browser = (navigator.language || DEFAULT_LANG).slice(0, 2).toLowerCase();
  return SUPPORTED.includes(browser) ? browser : DEFAULT_LANG;
}

export function t(key) {
  return i18next.t(key);
}

export function getLang() {
  return i18next.language;
}

function applyDom() {
  const lang = i18next.language;
  document.documentElement.setAttribute("lang", lang);

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = i18next.t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    el.innerHTML = i18next.t(el.dataset.i18nHtml);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.setAttribute("placeholder", i18next.t(el.dataset.i18nPlaceholder));
  });
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    el.setAttribute("title", i18next.t(el.dataset.i18nTitle));
  });

  const metaTitle = i18next.t("meta.title");
  if (metaTitle) document.title = metaTitle;
  const metaDesc = document.querySelector('meta[name="description"]');
  const descTr = i18next.t("meta.description");
  if (metaDesc && descTr) metaDesc.setAttribute("content", descTr);

  const sel = document.getElementById("lang-select");
  if (sel && sel.value !== lang) sel.value = lang;

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  updateFlatpickrLocale(lang);
}

function updateFlatpickrLocale(lang) {
  if (!window.flatpickr || !window._fpInstances) return;
  const fp = window.flatpickr;
  const locale =
    (lang === "pl" && fp.l10ns.pl) ||
    (lang === "de" && fp.l10ns.de) ||
    fp.l10ns.default;
  window._fpInstances.forEach((inst) => {
    try {
      inst.set("locale", locale);
    } catch {}
  });
}

export async function setLang(lang) {
  if (!SUPPORTED.includes(lang)) return;
  localStorage.setItem(STORAGE_KEY, lang);
  await i18next.changeLanguage(lang);
  applyDom();
}

export async function initI18n() {
  await i18next.init({
    lng: detectLang(),
    fallbackLng: DEFAULT_LANG,
    supportedLngs: SUPPORTED,
    keySeparator: false,
    nsSeparator: false,
    interpolation: { escapeValue: false },
    resources: Object.fromEntries(
      SUPPORTED.map((lng) => [lng, { translation: RESOURCES[lng] }]),
    ),
  });
  applyDom();
  const sel = document.getElementById("lang-select");
  if (sel) sel.addEventListener("change", (e) => setLang(e.target.value));
}
