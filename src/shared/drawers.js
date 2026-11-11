import { pub } from './state.js';
/** Возврат фокуса: элемент, с которого открыли первую шторку. @type {any} */
let drawerRet = null;
/** @type {Record<string, string>} */
const DRW = { dGloss: 'gloss', dKeys: 'keys', dSet: 'settings' };

/**
 * Открывает шторку: только одна за раз, фокус переходит в неё (и вернётся
 * на кнопку при закрытии), состояние — в <body data-drawer>.
 * @param {string} id
 */
export function openDrawer(id) {
  const el = /** @type {HTMLElement} */ (document.getElementById(id));
  if (!document.querySelector('.drawer.open')) drawerRet = document.activeElement;
  document.querySelectorAll('.drawer.open').forEach((d) => {
    if (d !== el) d.classList.remove('open');
  });
  el.classList.add('open');
  pub('drawer', DRW[id] || id);
  const sh = /** @type {HTMLElement | null} */ (el.querySelector('.sheet'));
  if (sh && !sh.contains(document.activeElement)) {
    sh.tabIndex = -1;
    sh.focus({ preventScroll: true });
  }
}

/** Закрывает все шторки и возвращает фокус туда, откуда их открыли. */
export function closeDrawers() {
  const was = document.querySelector('.drawer.open');
  document.querySelectorAll('.drawer').forEach((d) => d.classList.remove('open'));
  pub('drawer', 'none');
  if (
    was &&
    drawerRet &&
    drawerRet.isConnected &&
    (!document.activeElement ||
      document.activeElement === document.body ||
      was.contains(document.activeElement))
  )
    drawerRet.focus({ preventScroll: true });
  drawerRet = null;
}

/** Закрытие шторок: кнопки [data-close] и Esc. Вызывается один раз. */
export function initDrawers() {
  document.querySelectorAll('[data-close]').forEach((el) => (el.onclick = closeDrawers));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawers();
  });
}
