// RODOS — booking form: flatpickr + EmailJS submit
import { getLang, t } from "./i18n.js";
import {
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
} from "../config.js";

const emailJsReady = () =>
  Boolean(window.emailjs) &&
  Boolean(EMAILJS_PUBLIC_KEY) &&
  Boolean(EMAILJS_SERVICE_ID) &&
  Boolean(EMAILJS_TEMPLATE_ID);

export function initDatepicker() {
  if (typeof window.flatpickr === "undefined") return;
  const fp = window.flatpickr;
  const lang = getLang();
  const locale =
    (lang === "pl" && fp.l10ns.pl) ||
    (lang === "de" && fp.l10ns.de) ||
    fp.l10ns.default;

  const inEl = document.getElementById("date-in");
  const outEl = document.getElementById("date-out");
  if (!inEl || !outEl) return;

  const fpOut = fp(outEl, {
    dateFormat: "d.m.Y",
    minDate: "today",
    disableMobile: true,
    locale,
  });

  const fpIn = fp(inEl, {
    dateFormat: "d.m.Y",
    minDate: "today",
    disableMobile: true,
    locale,
    onChange: (dates) => {
      if (!dates[0]) return;
      const next = new Date(dates[0]);
      next.setDate(next.getDate() + 1);
      fpOut.set("minDate", next);
    },
  });

  window._fpInstances = [fpIn, fpOut];
}

function setBtnState(btn, { text, bg, opacity = "1", disabled }) {
  btn.textContent = text;
  if (bg) {
    btn.style.background = bg;
    btn.style.borderColor = bg;
  }
  btn.style.opacity = opacity;
  if (typeof disabled === "boolean") btn.disabled = disabled;
}

async function sendViaEmailJs(form) {
  window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  return window.emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);
}

function simulateSend() {
  return new Promise((resolve) => setTimeout(resolve, 1200));
}

export function initForm() {
  const form = document.getElementById("booking-form");
  if (!form) return;
  const btn = document.getElementById("submit-btn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setBtnState(btn, {
      text: t("form.submit.sending"),
      opacity: "0.7",
      disabled: true,
    });

    try {
      await (emailJsReady() ? sendViaEmailJs(form) : simulateSend());
      setBtnState(btn, { text: t("form.submit.sent"), bg: "#0b7a6e" });
    } catch (err) {
      console.error("EmailJS send failed:", err);
      setBtnState(btn, {
        text: t("form.submit.error"),
        bg: "#a14b3b",
        disabled: false,
      });
    }
  });
}
