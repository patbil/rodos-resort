import { byId, qs, qsa, toggleActive } from "../utils/dom.js";

function replayReveals(pane) {
  qsa(".reveal", pane).forEach((el) => {
    el.classList.remove("in");
    requestAnimationFrame(() => el.classList.add("in"));
  });
}

function init() {
  byId("season-tabs")?.addEventListener("click", (event) => {
    const tab = event.target.closest(".season-tab");
    if (!tab) return;
    const { season } = tab.dataset;
    toggleActive(".season-tab", (el) => el === tab);
    toggleActive(".pricing-pane", (el) => el.dataset.season === season);
    const pane = qs(`.pricing-pane[data-season="${season}"]`);
    if (pane) replayReveals(pane);
  });
}

export default { init };
