// @ts-check
import { $ } from './dom.js';
import { closeDrawers, openDrawer } from './drawers.js';

/**
 * Горячие клавиши: шторка со списком и общий фильтр нажатий.
 *
 *   const keys = createKeys({ T, keys: KEYS });   // KEYS: [['1 – 9', 'k_topic'], …] — клавиша и ключ текста
 *   keys.init();                                   // кнопки «?» открывают список
 *   onShortcut((code, e, L) => { … return true; }); // true — нажатие обработано
 * @param {{ T: () => any, keys: [string, string][] }} o
 */
export function createKeys({ T, keys }) {
  const KEYS = keys;
  function renderKeys() {
    const L = T();
    $('#keysList').innerHTML = KEYS.map(
      ([k, d]) =>
        `<span>${k
          .split(' ')
          .map((p, i) => (i > 0 && /^[+\/–]$/.test(p) ? p : `<kbd>${p}</kbd>`))
          .join(' ')}</span><span>${L[d]}</span>`
    ).join('');
  }

  function openKeys() {
    renderKeys();
    closeDrawers();
    openDrawer('dKeys');
  }

  function init() {
    $('#openKeys').onclick = openKeys;
    $('#openKeys2').onclick = openKeys;
  }

  return { renderKeys, openKeys, init };
}

/**
 * Общий фильтр горячих клавиш: без Ctrl/⌘/Alt, не в полях ввода, при
 * открытой шторке — только «?». Обработчик получает e.code, событие и тексты;
 * если вернул true — действие по умолчанию отменяется.
 * @param {(code: string, e: KeyboardEvent, isQ: boolean) => boolean} handler
 */
export function onShortcut(handler) {
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const tg = /** @type {any} */ (e.target),
      tag = tg && tg.tagName;
    if (
      (tag === 'INPUT' && !['checkbox', 'range', 'radio', 'color'].includes(tg.type)) ||
      tag === 'TEXTAREA' ||
      tag === 'SELECT' ||
      (tg && tg.isContentEditable)
    )
      return;
    const isQ = e.key === '?' || (e.code === 'Slash' && e.shiftKey);
    if (document.querySelector('.drawer.open') && !isQ) return;
    if (handler(e.code, e, isQ)) e.preventDefault();
  });
}
