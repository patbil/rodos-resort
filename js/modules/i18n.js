
import config from "../config.js";
import { storage } from "../utils/storage.js";
import i18next from "https://esm.sh/i18next@23";
import { byId, qs, qsa, on } from "../utils/dom.js";
import pl from "../locales/pl.json" with { type: "json" };
import en from "../locales/en.json" with { type: "json" };
import de from "../locales/de.json" with { type: "json" };

const translations = { pl, en, de };

const translationBindings = [
  {
    attribute: "data-i18n",
    apply: (element, value) => (element.textContent = value),
  },
  {
    attribute: "data-i18n-html",
    apply: (element, value) => (element.innerHTML = value),
  },
  {
    attribute: "data-i18n-placeholder",
    apply: (element, value) => element.setAttribute("placeholder", value),
  },
  {
    attribute: "data-i18n-title",
    apply: (element, value) => element.setAttribute("title", value),
  },
  {
    attribute: "data-i18n-alt",
    apply: (element, value) => element.setAttribute("alt", value),
  },
  {
    attribute: "data-i18n-aria-label",
    apply: (element, value) => element.setAttribute("aria-label", value),
  },
];

const languageChangeListeners = new Set();

function translate(key) {
  return i18next.t(key);
}

function getLanguage() {
  return i18next.language;
}

function onLanguageChange(listener) {
  languageChangeListeners.add(listener);
}

function detectLanguage() {
  const savedLanguage = storage.get(config.LANG_STORAGE_KEY);
  if (savedLanguage && config.SUPPORTED_LANGS.includes(savedLanguage)) {
    return savedLanguage;
  }
  const browserLanguage = (navigator.language || config.DEFAULT_LANG)
    .slice(0, 2)
    .toLowerCase();
  return config.SUPPORTED_LANGS.includes(browserLanguage)
    ? browserLanguage
    : config.DEFAULT_LANG;
}

function applyTranslations() {
  for (const { attribute, apply } of translationBindings) {
    qsa(`[${attribute}]`).forEach((element) =>
      apply(element, translate(element.getAttribute(attribute))),
    );
  }
}

function applyMeta() {
  document.title = translate("meta.title");
  qs('meta[name="description"]')?.setAttribute(
    "content",
    translate("meta.description"),
  );
}

function syncLanguageSelect() {
  const select = byId("lang-select");
  if (select) select.value = getLanguage();
}

function refreshYear() {
  const yearElement = byId("year");
  if (yearElement) yearElement.textContent = new Date().getFullYear();
}

function applyLanguage() {
  document.documentElement.lang = getLanguage();
  applyTranslations();
  applyMeta();
  syncLanguageSelect();
  refreshYear();
}

async function setLanguage(language) {
  if (!config.SUPPORTED_LANGS.includes(language)) return;
  storage.set(config.LANG_STORAGE_KEY, language);
  await i18next.changeLanguage(language);
  applyLanguage();
  languageChangeListeners.forEach((listener) => listener(getLanguage()));
}

function buildResources() {
  return Object.fromEntries(
    config.SUPPORTED_LANGS.map((language) => [
      language,
      { translation: translations[language] },
    ]),
  );
}

async function initI18n() {
  await i18next.init({
    lng: detectLanguage(),
    fallbackLng: config.DEFAULT_LANG,
    supportedLngs: config.SUPPORTED_LANGS,
    keySeparator: false,
    nsSeparator: false,
    interpolation: { escapeValue: false },
    resources: buildResources(),
  });
  applyLanguage();
  on(byId("lang-select"), "change", (event) => setLanguage(event.target.value));
}

export { initI18n, translate, getLanguage, onLanguageChange };
