import i18n from "./i18n.js";
import config from "../config.js";

const emailJsReady = () =>
  Boolean(window.emailjs) &&
  Boolean(config.EMAILJS_PUBLIC_KEY) &&
  Boolean(config.EMAILJS_SERVICE_ID) &&
  Boolean(config.EMAILJS_TEMPLATE_ID);

function flatpickrLocale() {
  const { l10ns } = window.flatpickr;
  const lang = i18n.getLang();
  return l10ns[lang] || l10ns.default;
}

function initDatepicker() {
  if (typeof window.flatpickr === "undefined") return;
  const arrivalInput = document.getElementById("date-in");
  const departureInput = document.getElementById("date-out");
  if (!arrivalInput || !departureInput) return;

  const options = {
    dateFormat: "d.m.Y",
    minDate: "today",
    disableMobile: true,
    locale: flatpickrLocale(),
  };
  const departure = window.flatpickr(departureInput, options);
  const arrival = window.flatpickr(arrivalInput, {
    ...options,
    onChange: ([date]) => {
      if (!date) return;
      const dayAfter = new Date(date);
      dayAfter.setDate(dayAfter.getDate() + 1);
      departure.set("minDate", dayAfter);
    },
  });

  window._fpInstances = [arrival, departure];
}

function setButtonState(button, { text, color = "", opacity = "1", disabled = false }) {
  button.textContent = text;
  button.style.background = color;
  button.style.borderColor = color;
  button.style.opacity = opacity;
  button.disabled = disabled;
}

function sendEnquiry(form) {
  if (!emailJsReady()) {
    return new Promise((resolve) => setTimeout(resolve, 1200)); 
  }
  window.emailjs.init({ publicKey: config.EMAILJS_PUBLIC_KEY });
  return window.emailjs.sendForm(
    config.EMAILJS_SERVICE_ID,
    config.EMAILJS_TEMPLATE_ID,
    form,
  );
}

function initForm() {
  const form = document.getElementById("booking-form");
  if (!form) return;
  const button = document.getElementById("submit-btn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setButtonState(button, {
      text: i18n.t("form.submit.sending"),
      opacity: "0.7",
      disabled: true,
    });

    try {
      await sendEnquiry(form);
      setButtonState(button, {
        text: i18n.t("form.submit.sent"),
        color: "#0b7a6e",
        disabled: true,
      });
      form.reset();
    } catch (error) {
      console.error("EmailJS send failed:", error);
      setButtonState(button, { text: i18n.t("form.submit.error"), color: "#a14b3b" });
    }

    setTimeout(() => setButtonState(button, { text: i18n.t("form.submit") }), 4000);
  });
}

function init() {
  initDatepicker();
  initForm();
}

export default { init };
