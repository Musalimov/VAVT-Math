// @ts-check
/**
 * Публикация состояния интерфейса в <body data-*>: для стилей, автотестов,
 * скринридеров и агентов. Пишет в DOM, только если значение изменилось.
 *
 *   pub('drawer', 'settings');   // <body data-drawer="settings">
 *
 * Общие ключи: drawer (none | gloss | keys | settings), rec (idle | recording).
 * Тренажёр может публиковать свои (в ЛА: anim, gesture, mode, shape).
 */

/** @type {Record<string, string>} */
const PUB = {};

/** @param {string} k @param {unknown} v */
export function pub(k, v) {
  const s = String(v);
  if (PUB[k] !== s) {
    PUB[k] = s;
    document.body.dataset[k] = s;
  }
}
