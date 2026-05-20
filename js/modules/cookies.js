const STORAGE_KEY = "rodos-consent";

const readConsent = () => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const saveConsent = (value) => {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {}
};

function loadMap() {
  const iframe = document.querySelector(".map-wrap iframe[data-src]");
  if (iframe && !iframe.src) iframe.src = iframe.dataset.src;
  const placeholder = document.getElementById("map-placeholder");
  if (placeholder) placeholder.hidden = true;
}

function init() {
  const banner = document.getElementById("cookie-banner");
  const consent = readConsent();

  if (consent === "accepted") loadMap();
  else if (banner && !consent) banner.hidden = false;

  const accept = () => {
    saveConsent("accepted");
    if (banner) banner.hidden = true;
    loadMap();
  };
  const decline = () => {
    saveConsent("declined");
    if (banner) banner.hidden = true;
  };

  document.getElementById("cookie-accept")?.addEventListener("click", accept);
  document.getElementById("map-consent-btn")?.addEventListener("click", accept);
  document.getElementById("cookie-decline")?.addEventListener("click", decline);
}

export default { init };
