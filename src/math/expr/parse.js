import { compile, has, simp } from './core.js';
export const ALIAS = {
  sin: 'sin',
  cos: 'cos',
  tan: 'tan',
  tg: 'tan',
  cot: 'cot',
  ctg: 'cot',
  cotan: 'cot',
  exp: 'exp',
  ln: 'ln',
  log: 'ln',
  lg: 'lg',
  sqrt: 'sqrt',
  abs: 'abs',
  asin: 'asin',
  arcsin: 'asin',
  acos: 'acos',
  arccos: 'acos',
  atan: 'atan',
  arctan: 'atan',
  arctg: 'atan',
  sinh: 'sinh',
  sh: 'sinh',
  cosh: 'cosh',
  ch: 'cosh',
  tanh: 'tanh',
  th: 'tanh',
};
export const WORDS = Object.keys(ALIAS)
  .concat(['pi', 'x', 'e', 'inf'])
  .sort((a, b) => b.length - a.length);
export function tokenize(s) {
  s = s
    .replace(/\*\*/g, '^')
    .replace(/[−–—]/g, '-')
    .replace(/[·×∙⋅]/g, '*')
    .replace(/÷/g, '/')
    .replace(/π/g, 'pi')
    .replace(/∞/g, 'inf')
    .replace(/(\d),(\d)/g, '$1.$2')
    .toLowerCase();
  const T = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) {
      i++;
      continue;
    }
    if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < s.length && /[0-9.]/.test(s[j])) j++;
      {
        const m = /^e[+-]?\d+/.exec(s.slice(j));
        if (m && !/^[a-z]/.test(s.slice(j + m[0].length))) j += m[0].length;
      }
      const v = parseFloat(s.slice(i, j));
      if (!isFinite(v)) throw { at: i };
      T.push({ t: 'n', v });
      i = j;
      continue;
    }
    if (/[a-z]/.test(c)) {
      let j = i;
      while (j < s.length && /[a-z]/.test(s[j])) j++;
      let w = s.slice(i, j),
        p = i;
      while (w.length) {
        const m = WORDS.find((k) => w.startsWith(k));
        // неизвестное слово: в ошибке — слово целиком, чтобы назвать его студенту
        if (!m) throw { at: p, w, msg: 'word', word: s.slice(i, j) };
        if (m === 'x') T.push({ t: 'x' });
        else if (m === 'pi') T.push({ t: 'c', v: 'pi' });
        else if (m === 'e') T.push({ t: 'c', v: 'e' });
        else if (m === 'inf') T.push({ t: 'inf' });
        else T.push({ t: 'fn', v: ALIAS[m] });
        w = w.slice(m.length);
        p += m.length;
      }
      i = j;
      continue;
    }
    if ('+-*/^()[]|√²³'.includes(c)) {
      T.push({ t: c === '[' ? '(' : c === ']' ? ')' : c });
      i++;
      continue;
    }
    throw { at: i };
  }
  return T;
}
export function parse(str) {
  const T = tokenize(str);
  let i = 0;
  const pk = () => T[i],
    nx = () => T[i++];
  const startsAtom = (t) =>
    t &&
    (t.t === 'n' ||
      t.t === 'x' ||
      t.t === 'c' ||
      t.t === 'fn' ||
      t.t === '(' ||
      t.t === '√' ||
      t.t === 'inf');
  function expr() {
    let e = term();
    while (pk() && (pk().t === '+' || pk().t === '-')) {
      const o = nx().t;
      e = [o, e, term()];
    }
    return e;
  }
  function term() {
    let e = unary();
    for (;;) {
      const t = pk();
      if (!t) break;
      if (t.t === '*' || t.t === '/') {
        nx();
        e = [t.t, e, unary()];
      } else if (startsAtom(t)) {
        e = ['*', e, power()];
      } else break;
    }
    return e;
  }
  function unary() {
    const t = pk();
    if (t && t.t === '-') {
      nx();
      return ['neg', unary()];
    }
    if (t && t.t === '+') {
      nx();
      return unary();
    }
    return power();
  }
  function power() {
    let b = postfix();
    if (pk() && pk().t === '^') {
      nx();
      return ['^', b, unary()];
    }
    return b;
  }
  function postfix() {
    let e = atom();
    while (pk() && (pk().t === '²' || pk().t === '³')) {
      e = ['^', e, ['n', nx().t === '²' ? 2 : 3]];
    }
    return e;
  }
  function fnArg() {
    const t = pk();
    if (t && t.t === '(') {
      nx();
      const e = expr();
      if (!pk() || pk().t !== ')') throw { at: -1, msg: 'paren' };
      nx();
      return e;
    }
    let e = power();
    while (pk() && startsAtom(pk()) && pk().t !== 'fn') e = ['*', e, power()];
    return e;
  }
  function atom() {
    const t = nx();
    if (!t) throw { at: -1, msg: 'end' };
    switch (t.t) {
      case 'n':
        return ['n', t.v];
      case 'x':
        return ['v', 'x'];
      case 'c':
        return ['c', t.v];
      case 'inf':
        return ['inf'];
      case '(': {
        const e = expr();
        if (!pk() || pk().t !== ')') throw { at: -1, msg: 'paren' };
        nx();
        return e;
      }
      case '|': {
        const e = expr();
        if (!pk() || pk().t !== '|') throw { at: -1, msg: 'abs' };
        nx();
        return ['f', 'abs', e];
      }
      case '√':
        return ['f', 'sqrt', postfix()];
      case 'fn': {
        let p = null;
        if (pk() && (pk().t === '^' || pk().t === '²' || pk().t === '³')) {
          const q = nx();
          p =
            q.t === '^'
              ? (() => {
                  const z = postfix();
                  return z;
                })()
              : ['n', q.t === '²' ? 2 : 3];
        }
        const a = fnArg();
        let e = t.v === 'lg' ? ['/', ['f', 'ln', a], ['f', 'ln', ['n', 10]]] : ['f', t.v, a];
        return p ? ['^', e, p] : e;
      }
    }
    throw { at: -1, msg: 'tok' };
  }
  const e = expr();
  if (i < T.length) throw { at: -1, msg: 'extra' };
  return e;
}
export function hasInf(e) {
  if (e[0] === 'inf') return true;
  if (e[0] === 'n' || e[0] === 'v' || e[0] === 'c') return false;
  if (e[0] === 'f') return hasInf(e[2]);
  if (e[0] === 'neg') return hasInf(e[1]);
  return hasInf(e[1]) || hasInf(e[2]);
}
export function parseFx(str) {
  const e = parse(str);
  if (hasInf(e)) throw { msg: 'inf' };
  return simp(e);
}
export function parseLim(str) {
  let s = str.trim().replace(/[\u00a0\u202f]/g, ' ');
  if (/^[-+−]?\d{1,3}( \d{3})+([.,]\d+)?$/.test(s)) s = s.replace(/ /g, '');
  if (/\d\s+\d/.test(s)) throw { msg: 'lim' };
  if (/^\+?(inf|∞|infinity)$/i.test(s)) return { v: Infinity };
  if (/^[-−](inf|∞|infinity)$/i.test(s)) return { v: -Infinity };
  const e = parse(s);
  if (hasInf(e)) throw { msg: 'inf' };
  if (has(e)) throw { msg: 'x' };
  const v = compile(simp(e))(0);
  if (!isFinite(v)) throw { msg: 'nan' };
  return { v, e: simp(e) };
}
