export const $ = (s) => document.querySelector(s);
export const clone = (o) => JSON.parse(JSON.stringify(o));

/**
 * Переключатель «включён / выключен»: класс .on и aria-pressed вместе,
 * чтобы состояние видели и стили, и скринридеры.
 * @param {Element} el @param {unknown} on
 */
export const setOn = (el, on) => {
  el.classList.toggle('on', !!on);
  el.setAttribute('aria-pressed', on ? 'true' : 'false');
};
