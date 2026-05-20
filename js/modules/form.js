// src/components/BookingForm.js
import i18n from "../modules/i18n.js";
import config from "../config.js";
import { byId } from "../utils/dom.js";

const SUCCESS_COLOR = "#0b7a6e";
const ERROR_COLOR = "#a14b3b";
const RESET_DELAY = 4000;
const DEMO_DELAY = 1200;

let fpInstances = [];

function isEmailJsReady() {
  return (
    Boolean(window.emailjs) &&
    Boolean(config.EMAILJS_PUBLIC_KEY) &&
    Boolean(config.EMAILJS_SERVICE_ID) &&
    Boolean(config.EMAILJS_TEMPLATE_ID)
  );
}

function initEmailJs() {
  if (!isEmailJsReady()) return;
  window.emailjs.init({ publicKey: config.EMAILJS_PUBLIC_KEY });
}

function sendEnquiry(form) {
  if (!isEmailJsReady()) {
    return new Promise((resolve) => setTimeout(resolve, DEMO_DELAY));
  }
  return window.emailjs.sendForm(
    config.EMAILJS_SERVICE_ID,
    config.EMAILJS_TEMPLATE_ID,
    form,
  );
}

function flatpickrLocale() {
  const { l10ns } = window.flatpickr;
  return l10ns[i18n.getLang()] ?? l10ns.default;
}

function setupDatepicker() {
  if (typeof window.flatpickr === "undefined") return;

  const arrivalInput = byId("date-in");
  const departureInput = byId("date-out");
  if (!arrivalInput || !departureInput) return;

  const baseOptions = {
    dateFormat: "d.m.Y",
    minDate: "today",
    disableMobile: true,
    locale: flatpickrLocale(),
  };

  const departure = window.flatpickr(departureInput, baseOptions);
  const arrival = window.flatpickr(arrivalInput, {
    ...baseOptions,
    onChange([date]) {
      if (!date) return;
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      departure.set("minDate", nextDay);
    },
  });

  fpInstances = [arrival, departure];
}

function setButtonState(
  button,
  { text, color = "", opacity = "1", disabled = false },
) {
  button.textContent = text;
  if (color) {
    button.style.background = color;
    button.style.borderColor = color;
  }
  button.style.opacity = opacity;
  button.disabled = disabled;
}

function buttonStates() {
  const btn = byId("submit-btn");
  if (!btn) return;

  return {
    sending: () =>
      setButtonState(btn, {
        text: i18n.t("form.submit.sending"),
        opacity: "0.7",
        disabled: true,
      }),
    sent: () =>
      setButtonState(btn, {
        text: i18n.t("form.submit.sent"),
        color: SUCCESS_COLOR,
        disabled: true,
      }),
    error: () =>
      setButtonState(btn, {
        text: i18n.t("form.submit.error"),
        color: ERROR_COLOR,
      }),
    idle: () =>
      setButtonState(btn, {
        text: i18n.t("form.submit"),
      }),
  };
}

async function handleSubmit(form, event) {
  event.preventDefault();
  const states = buttonStates();
  if (!states) return;

  states.sending();

  try {
    await sendEnquiry(form);
    states.sent();
    form.reset();
  } catch (error) {
    console.error("EmailJS send failed:", error);
    states.error();
  } finally {
    setTimeout(() => states.idle(), RESET_DELAY);
  }
}

function setupForm() {
  const form = byId("booking-form");
  if (!form) return;

  form.addEventListener("submit", (event) => handleSubmit(form, event));
}

function init() {
  initEmailJs();
  setupDatepicker();
  setupForm();
}

function refreshDatepickerLocale() {
  if (fpInstances.length === 0) return;
  const locale =
    window.flatpickr?.l10ns[i18n.getLang()] || window.flatpickr?.l10ns.default;
  fpInstances.forEach((instance) => instance.set("locale", locale));
}

export default {
  init,
  refreshDatepickerLocale,
};
