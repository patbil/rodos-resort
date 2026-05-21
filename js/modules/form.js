import config from "../config.js";
import { byId, on } from "../utils/dom.js";
import { translate, getLanguage } from "./i18n.js";

const formConfig = {
  successColor: "#0b7a6e",
  errorColor: "#a14b3b",
  resetDelayMs: 4000,
  demoSendDelayMs: 1200,
  emptyFieldFallback: "Brak danych",
  shakeClass: "field-shake",
  errorClass: "field-error",
};

const datepickerConfig = {
  dateFormat: "d.m.Y",
  bookableYearsAhead: 3,
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

// Builds template params, substituting a placeholder for empty optional fields.
function collectTemplateParams(form) {
  const params = {};
  new FormData(form).forEach((value, key) => {
    params[key] = String(value).trim() || formConfig.emptyFieldFallback;
  });
  return params;
}

function sendEnquiry(form) {
  if (!isEmailJsReady()) {
    return new Promise((resolve) =>
      setTimeout(resolve, formConfig.demoSendDelayMs),
    );
  }
  return window.emailjs.send(
    config.EMAILJS_SERVICE_ID,
    config.EMAILJS_TEMPLATE_ID,
    collectTemplateParams(form),
  );
}

function resolveDatepickerLocale() {
  const { l10ns } = window.flatpickr;
  return l10ns[getLanguage()] ?? l10ns.default;
}

// Replaces flatpickr's free-typing year input with a constrained <select>.
function replaceYearInputWithSelect(instance) {
  const yearWrapper = instance.currentYearElement.closest(".numInputWrapper");
  if (!yearWrapper) return;

  const firstYear = instance.config.minDate?.getFullYear() ?? instance.currentYear;
  const lastYear = instance.config.maxDate?.getFullYear() ?? firstYear;

  const yearSelect = document.createElement("select");
  yearSelect.className = "flatpickr-year-select";
  for (let year = firstYear; year <= lastYear; year += 1) {
    yearSelect.append(new Option(year, year));
  }
  yearSelect.value = instance.currentYear;

  on(yearSelect, "change", () => instance.changeYear(Number(yearSelect.value)));
  yearWrapper.replaceWith(yearSelect);
}

function syncYearSelect(instance) {
  const yearSelect = instance.calendarContainer.querySelector(".flatpickr-year-select");
  if (yearSelect) yearSelect.value = instance.currentYear;
}

function buildDatepickerOptions() {
  const today = new Date();
  const maxDate = new Date(today.getFullYear() + datepickerConfig.bookableYearsAhead, 11, 31);
  return {
    dateFormat: datepickerConfig.dateFormat,
    minDate: "today",
    maxDate,
    disableMobile: true,
    locale: resolveDatepickerLocale(),
    onReady: (selectedDates, dateString, instance) => replaceYearInputWithSelect(instance),
    onYearChange: (selectedDates, dateString, instance) => syncYearSelect(instance),
  };
}

function setupDatepicker() {
  if (typeof window.flatpickr === "undefined") return;

  const arrivalInput = byId("date-in");
  const departureInput = byId("date-out");
  if (!arrivalInput || !departureInput) return;

  const baseOptions = buildDatepickerOptions();
  const departure = window.flatpickr(departureInput, {
    ...baseOptions,
    onChange: () => markFieldError(departureInput, false),
  });
  const arrival = window.flatpickr(arrivalInput, {
    ...baseOptions,
    onChange([selectedDate]) {
      markFieldError(arrivalInput, false);
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
  button.style.background = color;
  button.style.borderColor = color;
  button.style.opacity = opacity;
  button.disabled = disabled;
}

function markFieldError(input, hasError) {
  input.classList.toggle(formConfig.errorClass, hasError);
}

// Readonly date inputs are barred from native validation, so we check them here.
function findEmptyRequiredDates() {
  const dateInputs = [byId("date-in"), byId("date-out")].filter(Boolean);
  return dateInputs.filter((input) => {
    const isEmpty = !input.value;
    markFieldError(input, isEmpty);
    return isEmpty;
  });
}

// Briefly shakes the given fields to draw the eye to what needs fixing.
function shakeFields(fields) {
  fields.forEach((field) => {
    field.classList.remove(formConfig.shakeClass);
    void field.offsetWidth; // force reflow so the animation restarts
    field.classList.add(formConfig.shakeClass);
  });
}

async function handleSubmit(form, button, event) {
  event.preventDefault();
  const emptyDates = findEmptyRequiredDates();
  const nativeValid = form.checkValidity();
  if (!nativeValid || emptyDates.length) {
    shakeFields([...form.querySelectorAll(":invalid"), ...emptyDates]);
    if (nativeValid) emptyDates[0]?.focus();
    else form.reportValidity();
    return;
  }
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
