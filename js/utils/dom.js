const byId = (id) => document.getElementById(id);

const qs = (selector, root = document) => root.querySelector(selector);

const qsa = (selector, root = document) =>
  Array.from(root.querySelectorAll(selector));

const show = (el) => el && (el.hidden = false);

const hide = (el) => el && (el.hidden = true);

const toggle = (el, force) => el && (el.hidden = !force);

const addClass = (el, className) => el?.classList.add(className);

const removeClass = (el, className) => el?.classList.remove(className);

const on = (el, event, handler, options = {}) => {
  el?.addEventListener(event, handler, options);
};

const delegate = (parent, selector, event, handler) => {
  on(parent, event, (e) => {
    if (e.target.closest(selector)) handler(e);
  });
};

const SWIPE_THRESHOLD = 40;

const onSwipe = (element, { onLeft, onRight, threshold = SWIPE_THRESHOLD } = {}) => {
  let startX = 0;
  on(element, "touchstart", (e) => (startX = e.changedTouches[0].clientX), {
    passive: true,
  });
  on(
    element,
    "touchend",
    (e) => {
      const deltaX = e.changedTouches[0].clientX - startX;
      if (Math.abs(deltaX) < threshold) return;
      if (deltaX < 0) onLeft?.();
      else onRight?.();
    },
    { passive: true },
  );
};

const toggleActive = (selector, predicate, root = document) => {
  qsa(selector, root).forEach((el) => {
    el.classList.toggle("active", predicate(el));
  });
};

export {
  byId,
  qs,
  qsa,
  show,
  hide,
  toggle,
  addClass,
  removeClass,
  on,
  delegate,
  onSwipe,
  toggleActive,
};
