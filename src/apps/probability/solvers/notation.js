// @ts-check
/**
 * Обозначение функции Лапласа в решениях: Φ(x) — от −∞, как в задачнике
 * (по умолчанию), или Φ₀(x) — от 0 («классическое»). Выбор — в настройках
 * тренажёра; решатели узнают его через notationFrom, а не из настроек напрямую.
 *
 *   notationFrom(() => P.nota);   // в тренажёре
 *   notationFrom(() => 'classic'); // в тесте
 */

/** @type {() => string} */
let source = () => 'modern';

/** @param {() => string} fn */
export function notationFrom(fn) {
  source = fn;
}

/** true — обозначение Φ₀(x) (интеграл от 0). */
export const CL = () => source() === 'classic';
