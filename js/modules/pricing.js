import { byId, qs, delegate, toggleActive } from "../utils/dom.js";
import { replayReveals } from "../utils/animation.js";

function selectSeason(tab) {
  const { season } = tab.dataset;
  toggleActive(".season-tab", (element) => element === tab);
  toggleActive(".pricing-pane", (element) => element.dataset.season === season);
  replayReveals(qs(`.pricing-pane[data-season="${season}"]`));
}

export function initPricing() {
  delegate(byId("season-tabs"), ".season-tab", "click", (event) =>
    selectSeason(event.target.closest(".season-tab")),
  );
}
