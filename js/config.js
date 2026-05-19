// EmailJS configuration.
//
// These IDs are PUBLIC by design — the browser SDK exposes them in every
// request. Real protection comes from "Allowed Origins" in your EmailJS
// dashboard (Account → Security). Make sure your production domain is
// whitelisted there.
//
// Setup:
//   1. Create an EmailJS account at https://www.emailjs.com/
//   2. Add an email service + template that accepts the form fields
//      (name, email, tel, type, dateIn, dateOut, adults, children,
//      pets, source, message).
//   3. Paste the three IDs below.
//
// While unset, the form falls back to demo mode (simulated send).

export const EMAILJS_PUBLIC_KEY = "";
export const EMAILJS_SERVICE_ID = "";
export const EMAILJS_TEMPLATE_ID = "";
