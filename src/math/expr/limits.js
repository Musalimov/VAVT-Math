import { CV, FN } from './core.js';
export function limS(E, x0, dir) {
  const F = (v, s) =>
      !isFinite(v)
        ? null
        : v !== 0 && s !== 0 && Math.abs(v) < 1e-9
          ? { t: 'f', v: 0, s: NaN }
          : { t: 'f', v, s },
    I = (s) => ({ t: 'i', s }),
    U = NaN;
  const sideMul = (a, b) =>
    a.v === 0 && b.v !== 0
      ? a.s === 0
        ? 0
        : a.s * Math.sign(b.v)
      : b.v === 0 && a.v !== 0
        ? b.s === 0
          ? 0
          : b.s * Math.sign(a.v)
        : a.v === 0 && b.v === 0
          ? a.s * b.s
          : U;
  const pw = (a, p) => {
    if (!a) return null;
    const ip = Number.isInteger(p);
    if (a.t === 'i') {
      if (p === 0) return F(1, 0);
      if (a.s > 0) return p > 0 ? I(1) : F(0, 1);
      if (!ip) return null;
      return p > 0 ? I(p % 2 ? -1 : 1) : F(0, p % 2 ? -1 : 1);
    }
    if (a.v > 0) return F(Math.pow(a.v, p), U);
    if (a.v < 0) return ip ? F(Math.pow(a.v, p), U) : null;
    if (p > 0) {
      if (a.s === 1 || a.s === 0) return F(0, a.s);
      if (a.s === -1 && ip) return F(0, p % 2 ? -1 : 1);
      return null;
    }
    if (p < 0 && (a.s === 1 || a.s === -1)) {
      if (a.s === 1) return I(1);
      return ip ? I(p % 2 ? -1 : 1) : null;
    }
    return null;
  };
  const ex = (b, g) => {
    if (!g || !(b > 0)) return null;
    if (b === 1) return F(1, 0);
    const up = b > 1;
    if (g.t === 'i') return g.s > 0 === up ? I(1) : F(0, 1);
    return F(Math.pow(b, g.v), U);
  };
  const go = (e) => {
    switch (e[0]) {
      case 'n':
        return F(e[1], 0);
      case 'c':
        return F(CV[e[1]], 0);
      case 'v':
        return isFinite(x0) ? F(x0, dir) : I(x0 > 0 ? 1 : -1);
      case 'neg': {
        const a = go(e[1]);
        return !a ? null : a.t === 'i' ? I(-a.s) : F(-a.v, -a.s);
      }
      case '+':
      case '-': {
        const a = go(e[1]);
        let b = go(e[2]);
        if (!a || !b) return null;
        if (e[0] === '-') b = b.t === 'i' ? I(-b.s) : F(-b.v, -b.s);
        if (a.t === 'i' && b.t === 'i') return a.s === b.s ? a : null;
        if (a.t === 'i') return a;
        if (b.t === 'i') return b;
        const s = a.s === 0 ? b.s : b.s === 0 ? a.s : a.s === b.s ? a.s : U;
        return F(a.v + b.v, s);
      }
      case '*': {
        const a = go(e[1]),
          b = go(e[2]);
        if (!a || !b) return null;
        if (a.t === 'i' && b.t === 'i') return I(a.s * b.s);
        if (a.t === 'i' || b.t === 'i') {
          const f = a.t === 'f' ? a : b,
            i = a.t === 'i' ? a : b;
          return f.v === 0 ? null : I(i.s * Math.sign(f.v));
        }
        return F(a.v * b.v, sideMul(a, b));
      }
      case '/': {
        const a = go(e[1]),
          b = go(e[2]);
        if (!a || !b) return null;
        if (b.t === 'i') {
          if (a.t === 'i') return null;
          return a.v === 0 ? (a.s === 0 ? F(0, 0) : null) : F(0, Math.sign(a.v) * b.s);
        }
        if (b.v !== 0)
          return a.t === 'i'
            ? I(a.s * Math.sign(b.v))
            : F(a.v / b.v, a.v === 0 ? (a.s === 0 ? 0 : a.s * Math.sign(b.v)) : U);
        if (!(b.s === 1 || b.s === -1)) return null;
        if (a.t === 'i') return I(a.s * b.s);
        return a.v === 0 ? null : I(Math.sign(a.v) * b.s);
      }
      case '^': {
        const a = go(e[1]),
          q = go(e[2]);
        if (!q) return null;
        if (q.t === 'f' && q.s === 0) return pw(a, q.v);
        if (a && a.t === 'f' && a.s === 0) return ex(a.v, q);
        return null;
      }
      case 'f': {
        const nm = e[1],
          a = go(e[2]);
        if (!a) return null;
        if (nm === 'exp') return ex(Math.E, a);
        if (nm === 'sqrt') return pw(a, 0.5);
        if (nm === 'ln') {
          if (a.t === 'i') return a.s > 0 ? I(1) : null;
          if (a.v > 0) return F(Math.log(a.v), U);
          return a.v === 0 && a.s === 1 ? I(-1) : null;
        }
        if (nm === 'abs') {
          if (a.t === 'i') return I(1);
          return F(Math.abs(a.v), a.v === 0 ? (a.s === 0 ? 0 : 1) : U);
        }
        if (nm === 'atan') return a.t === 'i' ? F((a.s * Math.PI) / 2, -a.s) : F(Math.atan(a.v), U);
        if (nm === 'tanh') return a.t === 'i' ? F(a.s, -a.s) : F(Math.tanh(a.v), U);
        if (nm === 'sinh') return a.t === 'i' ? I(a.s) : F(Math.sinh(a.v), U);
        if (nm === 'cosh') return a.t === 'i' ? I(1) : F(Math.cosh(a.v), U);
        if (a.t === 'i') return null;
        if (nm === 'sin' || nm === 'cos') return F(FN[nm](a.v), U);
        if (nm === 'tan') return Math.abs(Math.cos(a.v)) > 1e-12 ? F(Math.tan(a.v), U) : null;
        if (nm === 'cot') return Math.abs(Math.sin(a.v)) > 1e-12 ? F(1 / Math.tan(a.v), U) : null;
        if (nm === 'asin' || nm === 'acos') return Math.abs(a.v) < 1 ? F(FN[nm](a.v), U) : null;
        return null;
      }
      default:
        return null;
    }
  };
  try {
    return go(E);
  } catch (_) {
    return null;
  }
}
export function limFx(F, E, x0, dir, ff) {
  const r = E ? limS(E, x0, dir) : null;
  if (r && r.t === 'i') return { v: null, ex: true };
  if (r && r.t === 'f') return { v: r.v, ex: true };
  return { v: limN(F, x0, dir, ff), ex: false };
}
export function limF(F, x0, dir, E, ff) {
  return limFx(F, E, x0, dir, ff).v;
}
export function limN(F, x0, dir, ff) {
  if (!isFinite(x0)) {
    const s = x0 > 0 ? 1 : -1,
      vs = [1e3, 1e5, 1e7, 1e9].map((X) => F(s * X));
    return conv(vs);
  }
  const v0 = F(x0),
    sc = Math.max(1, Math.abs(x0)),
    g1 = Math.abs(ff(x0 + dir * 1e-4 * sc)),
    g2 = Math.abs(ff(x0 + dir * 1e-9 * sc)),
    blow = !isFinite(ff(x0)) || !(isFinite(g2) && g2 <= 1e3 * Math.max(1, g1));
  if (isFinite(v0) && !blow) return v0;
  const vs = [1e-5, 1e-7, 1e-9, 1e-11].map((e) => F(x0 + dir * e * Math.max(1, Math.abs(x0))));
  return conv(vs);
}
export function conv(vs) {
  if (vs.some((v) => !isFinite(v))) return null;
  const d1 = Math.abs(vs[1] - vs[0]),
    d2 = Math.abs(vs[2] - vs[1]),
    d3 = Math.abs(vs[3] - vs[2]),
    sc = Math.max(1, Math.abs(vs[3]));
  if (d3 < 1e-9 * sc) return vs[3];
  if (d2 > 0 && d3 / d2 < 0.5 && d1 > 0 && d2 / d1 < 0.5 && d3 < 1e-3 * sc) return vs[3];
  return null;
}
