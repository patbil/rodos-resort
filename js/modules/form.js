import config from "../config.js";
import { byId, on } from "../utils/dom.js";
import { translate, getLanguage } from "./i18n.js";

const formConfig = {
  successColor: "#0b7a6e",
  errorColor: "#a14b3b",
  resetDelayMs: 4000,
  demoSendDelayMs: 1200,
};

const buttonPresets = {
  sending: { textKey: "form.submit.sending", opacity: "0.7", disabled: true },
  sent: {
    textKey: "form.submit.sent",
    color: formConfig.successColor,
    disabled: true,
  },
  error: { textKey: "form.submit.error", color: formConfig.errorColor },
  idle: { textKey: "form.submit" },
};

let flatpickrInstances = [];

function isEmailJsReady() {
  return (
    Boolean(window.emailjs) &&
    Boolean(config.EMAILJS_PUBLIC_KEY) &&
    Boolean(config.EMAILJS_SERVICE_ID) &&
    Boolean(config.EMAILJS_TEMPLATE_ID)
  );
}

function initEmailJs() {
  if (isEmailJsReady()) {
    window.emailjs.init({ publicKey: config.EMAILJS_PUBLIC_KEY });
  }
}

function sendEnquiry(form) {
  if (!isEmailJsReady()) {
    return new Promise((resolve) =>
      setTimeout(resolve, formConfig.demoSendDelayMs),
    );
  }
  return window.emailjs.sendForm(
    config.EMAILJS_SERVICE_ID,
    config.EMAILJS_TEMPLATE_ID,
    form,
  );
}

function resolveDatepickerLocale() {
  const { l10ns } = window.flatpickr;
  return l10ns[getLanguage()] ?? l10ns.default;
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
    locale: resolveDatepickerLocale(),
  };

  const departure = window.flatpickr(departureInput, baseOptions);
  const arrival = window.flatpickr(arrivalInput, {
    ...baseOptions,
    onChange([selectedDate]) {
      if (!selectedDate) return;
      const dayAfterArrival = new Date(selectedDate);
      dayAfterArrival.setDate(dayAfterArrival.getDate() + 1);
      departure.set("minDate", dayAfterArrival);
    },
  });

  flatpickrInstances = [arrival, departure];
}

function refreshDatepickerLocale() {
  if (!flatpickrInstances.length) return;
  const locale = resolveDatepickerLocale();
  flatpickrInstances.forEach((instance) => instance.set("locale", locale));
}

function applyButtonState(
  button,
  { textKey, color = "", opacity = "1", disabled = false },
) {
  button.textContent = translate(textKey);
  if (color) {
    button.style.background = color;
    button.style.borderColor = color;
  }
  button.style.opacity = opacity;
  button.disabled = disabled;
}

async function handleSubmit(form, button, event) {
  event.preventDefault();
  applyButtonState(button, buttonPresets.sending);

  try {
    await sendEnquiry(form);
    applyButtonState(button, buttonPresets.sent);
    form.reset();
  } catch (error) {
    console.error("EmailJS send failed:", error);
    applyButtonState(button, buttonPresets.error);
  } finally {
    setTimeout(
      () => applyButtonState(button, buttonPresets.idle),
      formConfig.resetDelayMs,
    );
  }
}

function setupForm() {
  const form = byId("booking-form");
  const button = byId("submit-btn");
  if (!form || !button) return;
  on(form, "submit", (event) => handleSubmit(form, button, event));
}

function initForm() {
  initEmailJs();
  setupDatepicker();
  setupForm();
}

export { initForm, refreshDatepickerLocale };
