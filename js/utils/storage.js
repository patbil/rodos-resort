import config from "../config.js";

export const storage = {
  get: (key) => localStorage.getItem(config.STORAGE_PREFIX + key),
  set: (key, value) => localStorage.setItem(config.STORAGE_PREFIX + key, value),
  remove: (key) => localStorage.removeItem(config.STORAGE_PREFIX + key),
};
