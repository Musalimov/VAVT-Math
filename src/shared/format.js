import { lang } from './i18n.js';

export function fmt(x, d = 2) {
  if (!isFinite(x)) return x > 0 ? '∞' : x < 0 ? '−∞' : '—';
  if (Math.abs(x) < 5e-12) x = 0;
  let s = String(+x.toFixed(d));
  if (s === '-0') s = '0';
  return s.replace('-', '−');
}
export const dc = (s) => (lang() === 'ru' ? s.replace(/(\d)\.(\d)/g, '$1,$2') : s);
export function fN(v, d = 4) {
  if (!isFinite(v)) return v > 0 ? '∞' : v < 0 ? '−∞' : '—';
  return dc(fmt(v, d));
}
export const fV = (a) => `(${a.map((v) => fN(v, 4)).join('; ')})`;

/**
 * Как fN, но очень большие (≥ 10⁵) и очень малые (< 10⁻⁴) числа — в виде
 * m·10<sup>k</sup> (HTML). Используется в «Теории вероятностей» и матядре.
 */
export function fNsci(v, d = 4) {
  if (!isFinite(v)) return v > 0 ? '∞' : v < 0 ? '−∞' : '—';
  if (Math.abs(v) >= 1e5 || (Math.abs(v) < 1e-4 && v !== 0)) {
    const [m, e] = v.toExponential(3).split('e');
    return dc(String(+m)).replace('-', '−') + '·10<sup>' + String(+e).replace('-', '−') + '</sup>';
  }
  return dc(fmt(v, d));
}
