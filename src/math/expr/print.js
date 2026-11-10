import { Nn, isN, mul, pow, toFrac } from './core.js';
import { fmt } from '../../shared/format.js';
import { lang } from '../../shared/i18n.js';
export const PRINT = { v: 'x' };
export const FNAME = {
  ru: {
    sin: 'sin',
    cos: 'cos',
    tan: 'tg',
    cot: 'ctg',
    ln: 'ln',
    asin: 'arcsin',
    acos: 'arccos',
    atan: 'arctg',
    sinh: 'sh',
    cosh: 'ch',
    tanh: 'th',
  },
  en: {
    sin: 'sin',
    cos: 'cos',
    tan: 'tan',
    cot: 'cot',
    ln: 'ln',
    asin: 'arcsin',
    acos: 'arccos',
    atan: 'arctan',
    sinh: 'sinh',
    cosh: 'cosh',
    tanh: 'tanh',
  },
};
export const TRIG = new Set(['sin', 'cos', 'tan', 'cot', 'ln', 'sinh', 'cosh', 'tanh']);
export const frac = (n, d) =>
  `<span class="fr"><span class="fn">${n}</span><span class="fd">${d}</span></span>`;
export function numH(v, sup) {
  if (Math.abs(v - Math.round(v)) < 1e-12) return String(Math.round(Math.abs(v)));
  const f = toFrac(Math.abs(v), 1000);
  if (f) return sup ? `${f[0]}/${f[1]}` : frac(f[0], f[1]);
  return fmt(Math.abs(v), 4);
}
export function prec(e) {
  switch (e[0]) {
    case '+':
    case '-':
      return 1;
    case 'neg':
      return 1.5;
    case '*':
      return isN(e[1]) && e[1][1] < 0 ? 1.5 : 2;
    case '/':
      return 2;
    case 'n':
      return e[1] < 0 ? 1.5 : Number.isInteger(e[1]) || !toFrac(Math.abs(e[1]), 1000) ? 6 : 2;
    case '^':
      return isN(e[2]) && e[2][1] < 0 ? 2 : 4;
    case 'f':
      return e[1] === 'exp' ? 4 : 5;
    default:
      return 6;
  }
}
export function hp(e, p = 0, sup = false) {
  const s = hp0(e, sup);
  return prec(e) < p ? `(${s})` : s;
}
export const juxOK = (b) => !isN(b) && !(b[0] === '*' && isN(b[1])) && b[0] !== 'neg';
export function hp0(e, sup) {
  switch (e[0]) {
    case 'n':
      return (e[1] < 0 ? '−' : '') + numH(e[1], sup);
    case 'v':
      return `<i>${e[1] === 'x' ? PRINT.v : e[1]}</i>`;
    case 'c':
      return e[1] === 'pi' ? 'π' : 'e';
    case '+':
      return `${hp(e[1], 1, sup)} + ${hp(e[2], 1.5, sup)}`;
    case '-':
      return `${hp(e[1], 1, sup)} − ${hp(e[2], 2, sup)}`;
    case 'neg':
      return `−${hp(e[1], 2, sup)}`;
    case '*': {
      const a = e[1];
      let b = e[2];
      if (isN(a)) {
        const v = a[1],
          s = v < 0 ? '−' : '',
          av = Math.abs(v),
          fr = toFrac(av, 1000);
        if (fr && fr[1] > 1 && !sup) {
          let n = b,
            d = Nn(fr[1]);
          if (b[0] === '/') {
            n = b[1];
            d = mul(Nn(fr[1]), b[2]);
          }
          const nh = fr[0] === 1 ? hp(n, 0) : `${fr[0]}${juxOK(n) ? '' : '·'}${hp(n, 2)}`;
          return s + frac(nh, hp(d, 0));
        }
        if (b[0] === '/' && Number.isInteger(av) && !sup) {
          const nh = `${av === 1 ? '' : av}${av !== 1 && !juxOK(b[1]) ? '·' : ''}${hp(b[1], av === 1 ? 0 : 2)}`;
          return s + frac(nh, hp(b[2], 0));
        }
        if (fr && fr[1] > 1 && sup) {
          return s + (fr[0] === 1 ? '' : fr[0]) + hp(b, 3, true) + '/' + fr[1];
        }
        const cs = av === 1 ? '' : numH(av, sup);
        return s + cs + (cs && !juxOK(b) ? '·' : '') + hp(b, 2, sup);
      }
      return `${hp(a, 2, sup)}·${hp(b, 2, sup)}`;
    }
    case '/':
      return sup ? `${hp(e[1], 3, true)}/${hp(e[2], 3, true)}` : frac(hp(e[1], 0), hp(e[2], 0));
    case '^': {
      const b = e[1],
        x = e[2];
      if (isN(x)) {
        const v = x[1];
        if (v < 0) {
          const d = hp(pow(b, Nn(-v)), 0, sup);
          return sup ? `1/${d}` : frac('1', d);
        }
        if (v === 0.5) return hp0(['f', 'sqrt', b], sup);
        if (b[0] === 'f' && TRIG.has(b[1]) && Number.isInteger(v))
          return `${FNAME[lang()][b[1]]}<sup>${v}</sup>${fArg(b[2], sup)}`;
      }
      return `${hp(b, 5, sup)}<sup>${hp(x, 0, true)}</sup>`;
    }
    case 'f': {
      const [, nm, a] = e;
      if (nm === 'exp') return `e<sup>${hp(a, 0, true)}</sup>`;
      if (nm === 'sqrt') return `<span class="sq">√<span class="rad">${hp(a, 0, sup)}</span></span>`;
      if (nm === 'abs') return `|${hp(a, 0, sup)}|`;
      return FNAME[lang()][nm] + fArg(a, sup);
    }
    default:
      return '?';
  }
}
export function fArg(a, sup) {
  if (a[0] === 'f' && a[1] === 'abs') return hp0(a, sup);
  if (a[0] === 'v') return ' ' + hp0(a, sup);
  return `(${hp(a, 0, sup)})`;
}
export const TXN = {
  sin: 'sin',
  cos: 'cos',
  tan: 'tan',
  cot: 'cot',
  ln: 'ln',
  asin: 'arcsin',
  acos: 'arccos',
  atan: 'arctan',
  sinh: 'sinh',
  cosh: 'cosh',
  tanh: 'tanh',
};
export function numT(v, m) {
  const f = toFrac(Math.abs(v), 1000);
  if (Number.isInteger(v)) return String(Math.abs(v));
  if (f) {
    return m === 'tex' ? `\\frac{${f[0]}}{${f[1]}}` : `${f[0]}/${f[1]}`;
  }
  return String(+Math.abs(v).toFixed(6));
}
export function precT(e, m) {
  if (e[0] === 'n') return e[1] < 0 ? 1.5 : Number.isInteger(e[1]) || m === 'tex' ? 6 : 2;
  if (e[0] === 'f' && e[1] === 'exp' && m === 'tex') return 4;
  return prec(e);
}
export function tp(e, p, m) {
  const s = tp0(e, m);
  return precT(e, m) < p ? (m === 'tex' ? `\\left(${s}\\right)` : `(${s})`) : s;
}
export function tp0(e, m) {
  const T = m === 'tex',
    S = m === 'py';
  switch (e[0]) {
    case 'n':
      return (
        (e[1] < 0 ? '-' : '') +
        (S && !Number.isInteger(e[1]) && toFrac(Math.abs(e[1]), 1000)
          ? `Rational(${toFrac(Math.abs(e[1]), 1000).join(', ')})`
          : numT(e[1], m))
      );
    case 'v':
      return e[1];
    case 'c':
      return e[1] === 'pi' ? (T ? '\\pi' : 'pi') : S ? 'E' : 'e';
    case '+':
      return `${tp(e[1], 1, m)} + ${tp(e[2], 1.5, m)}`;
    case '-':
      return `${tp(e[1], 1, m)} - ${tp(e[2], 2, m)}`;
    case 'neg':
      return `-${tp(e[1], 2, m)}`;
    case '*': {
      if (T && isN(e[1])) {
        const f = toFrac(Math.abs(e[1][1]), 1000);
        if (f && f[1] > 1)
          return `${e[1][1] < 0 ? '-' : ''}\\frac{${f[0] === 1 ? '' : f[0] + ' '}${tp(e[2], 0, m)}}{${f[1]}}`;
      }
      return T
        ? `${tp(e[1], 2, m)}${isN(e[2]) ? ' \\cdot ' : ' '}${tp(e[2], 2, m)}`
        : `${tp(e[1], 2, m)}*${tp(e[2], 2, m)}`;
    }
    case '/':
      return T ? `\\frac{${tp(e[1], 0, m)}}{${tp(e[2], 0, m)}}` : `${tp(e[1], 2, m)}/${tp(e[2], 3, m)}`;
    case '^': {
      if (T && isN(e[2]) && e[2][1] === 0.5) return `\\sqrt{${tp(e[1], 0, m)}}`;
      return T
        ? `${tp(e[1], 5, m)}^{${tp(e[2], 0, m)}}`
        : `${tp(e[1], 5, m)}${S ? '**' : '^'}${tp(e[2], 5, m)}`;
    }
    case 'f': {
      const [, nm, a] = e;
      if (T) {
        if (nm === 'exp') return `e^{${tp(a, 0, m)}}`;
        if (nm === 'sqrt') return `\\sqrt{${tp(a, 0, m)}}`;
        if (nm === 'abs') return `\\left|${tp(a, 0, m)}\\right|`;
        const n = TXN[nm];
        return (
          (['sin', 'cos', 'tan', 'cot', 'ln', 'arcsin', 'arccos', 'arctan', 'sinh', 'cosh', 'tanh'].includes(
            n
          )
            ? '\\' + n
            : `\\operatorname{${n}}`) + (a[0] === 'v' ? ' ' + tp(a, 0, m) : `\\left(${tp(a, 0, m)}\\right)`)
        );
      }
      if (S) {
        const n =
          { exp: 'exp', sqrt: 'sqrt', abs: 'Abs', ln: 'log', asin: 'asin', acos: 'acos', atan: 'atan' }[nm] ||
          nm;
        return `${n}(${tp(a, 0, m)})`;
      }
      const n = { exp: 'exp', sqrt: 'sqrt', abs: 'abs' }[nm] || TXN[nm];
      return `${n}(${tp(a, 0, m)})`;
    }
    default:
      return '?';
  }
}
