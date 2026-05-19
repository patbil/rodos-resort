// RODOS — booking form: flatpickr + submit handler
import { getLang, t } from "./i18n.js";

export function initDatepicker() {
  if (typeof window.flatpickr === "undefined") return;
  const fp = window.flatpickr;
  const lang = getLang();
  const locale =
    (lang === "pl" && fp.l10ns.pl) ||
    (lang === "de" && fp.l10ns.de) ||
    fp.l10ns.default;

  const inEl = document.getElementById("dateIn");
  const outEl = document.getElementById("dateOut");
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

export function initForm() {
  const form = document.getElementById("bookingForm");
  if (!form) return;
  const btn = document.getElementById("submitBtn");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    btn.textContent = t("form.submit.sending");
    btn.disabled = true;
    btn.style.opacity = "0.7";
    setTimeout(() => {
      btn.textContent = t("form.submit.sent");
      btn.style.background = "#0b7a6e";
      btn.style.borderColor = "#0b7a6e";
      btn.style.opacity = "1";
    }, 1400);
  });
}
