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
  toggleActive,
};
