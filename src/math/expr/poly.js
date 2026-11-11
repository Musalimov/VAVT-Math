import { Nn, OPS, X, add, div, fn, has, isN, key, mul, neg, pow, snap, sub, toFrac } from './core.js';
export const ptrim = (p) => {
  p = p.map(snap);
  while (p.length > 1 && Math.abs(p[p.length - 1]) < 1e-12) p.pop();
  return p;
};
export const padd = (a, b) =>
  ptrim(Array.from({ length: Math.max(a.length, b.length) }, (_, i) => (a[i] || 0) + (b[i] || 0)));
export const pscale = (a, c) => ptrim(a.map((x) => x * c));
export function pmul(a, b) {
  const r = new Array(a.length + b.length - 1).fill(0);
  a.forEach((x, i) =>
    b.forEach((y, j) => {
      r[i + j] += x * y;
    })
  );
  return ptrim(r);
}
export function ppow(a, n) {
  let r = [1];
  for (let i = 0; i < n; i++) r = pmul(r, a);
  return r;
}
export const pdeg = (p) => (p.length === 1 && Math.abs(p[0]) < 1e-12 ? -1 : p.length - 1);
export const pval = (p, x) => p.reduceRight((s, c) => s * x + c, 0);
export const pder = (p) => (p.length < 2 ? [0] : ptrim(p.slice(1).map((c, i) => c * (i + 1))));
export function pdiv(a, b) {
  a = a.slice();
  const db = pdeg(b),
    q = new Array(Math.max(1, a.length - db)).fill(0);
  for (let i = a.length - 1; i >= db; i--) {
    const c = a[i] / b[db];
    q[i - db] = c;
    for (let j = 0; j <= db; j++) a[i - db + j] -= c * b[j];
  }
  return [ptrim(q), ptrim(a.slice(0, Math.max(1, db)))];
}
export function polyOf(e) {
  switch (e[0]) {
    case 'n':
      return [e[1]];
    case 'c':
      return null;
    case 'v':
      return e[1] === 'x' ? [0, 1] : null;
    case 'neg': {
      const a = polyOf(e[1]);
      return a && pscale(a, -1);
    }
    case '+':
    case '-': {
      const a = polyOf(e[1]),
        b = polyOf(e[2]);
      return a && b ? padd(a, e[0] === '+' ? b : pscale(b, -1)) : null;
    }
    case '*': {
      const a = polyOf(e[1]),
        b = polyOf(e[2]);
      return a && b ? pmul(a, b) : null;
    }
    case '/': {
      if (!isN(e[2])) return null;
      const a = polyOf(e[1]);
      return a && pscale(a, 1 / e[2][1]);
    }
    case '^': {
      if (!isN(e[2])) return null;
      const n = e[2][1];
      if (!Number.isInteger(n) || n < 0 || n > 16) return null;
      const a = polyOf(e[1]);
      return a && ppow(a, n);
    }
    default:
      return null;
  }
}
export function polyAst(p, v = X) {
  p = ptrim(p);
  let r = null;
  for (let k = p.length - 1; k >= 0; k--) {
    const c = p[k];
    if (Math.abs(c) < 1e-12) continue;
    const t = k === 0 ? Nn(Math.abs(c)) : mul(Nn(Math.abs(c)), pow(v, Nn(k)));
    r = r === null ? (c < 0 ? neg(t) : t) : c < 0 ? sub(r, t) : add(r, t);
  }
  return r || Nn(0);
}
export const linOf = (e) => {
  const p = polyOf(e);
  return p && p.length <= 2 ? [p[1] || 0, p[0]] : null;
};
export const linAst = (k, m) => polyAst([m, k]);
export function pgcd(cs) {
  const fr = cs.map((c) => toFrac(Math.abs(c), 1000));
  if (!fr.length || fr.some((f) => !f)) return 1;
  const g = (a, b) => (b ? g(b, a % b) : a);
  let d = 1;
  fr.forEach(([, q]) => {
    d = (d * q) / g(d, q);
  });
  let N = 0;
  fr.forEach(([p, q]) => {
    N = g(N, p * (d / q));
  });
  return N ? N / d : 1;
}
export function asFactors(e) {
  const o = { c: 1, fs: [] };
  const put = (b, p) => {
    if (b[0] === '+' || b[0] === '-') {
      const q = polyOf(b);
      if (q && pdeg(q) >= 1) {
        const nz = q.filter((c) => Math.abs(c) > 1e-12);
        let g = pgcd(nz);
        if (g > 0 && Math.abs(g - 1) > 1e-12 && (Number.isInteger(p) || true)) {
          o.c *= Math.pow(g, p);
          b = polyAst(pscale(q, 1 / g));
        }
      }
    }
    const k = key(b),
      f = o.fs.find((z) => z[2] === k);
    if (f) f[1] = snap(f[1] + p);
    else o.fs.push([b, p, k]);
  };
  const walk = (e, p) => {
    switch (e[0]) {
      case 'n': {
        const v = Math.pow(e[1], p);
        if (Number.isInteger(p) || toFrac(v, 1000)) {
          o.c *= v;
          return;
        }
        if (e[1] < 0) break;
        let w = e[1];
        if (Number.isInteger(w) && Math.abs(p - 0.5) < 1e-12) {
          let q = 1,
            i = w;
          for (let d = 2; d * d <= i; d++)
            while (i % (d * d) === 0) {
              i /= d * d;
              q *= d;
            }
          o.c *= q;
          w = i;
        }
        if (w !== 1) put(Nn(w), p);
        return;
      }
      case 'neg':
        if (Number.isInteger(p)) {
          o.c *= Math.pow(-1, p);
          walk(e[1], p);
          return;
        }
        break;
      case '*':
        if (Number.isInteger(p) || true) {
          walk(e[1], p);
          walk(e[2], p);
          return;
        }
        break;
      case '/':
        walk(e[1], p);
        walk(e[2], -p);
        return;
      case '^':
        if (isN(e[2])) {
          const q = p * e[2][1],
            in0 = e[1][0];
          if (
            in0 === '^' &&
            isN(e[1][2]) &&
            Number.isInteger(e[1][2][1]) &&
            e[1][2][1] % 2 === 0 &&
            !Number.isInteger(((q * e[1][2][1]) / e[1][2][1]) * 1)
          ) {
            put(e[1], q);
            return;
          }
          walk(e[1], q);
          return;
        }
        break;
      case 'f':
        if (e[2] && e[1] === 'sqrt') {
          walk(e[2], p * 0.5);
          return;
        }
        break;
    }
    put(e, p);
  };
  walk(e, 1);
  o.c = snap(o.c);
  o.fs = o.fs.filter((f) => Math.abs(f[1]) > 1e-12);
  return o;
}
export function frank(b) {
  if (!has(b)) return 0;
  if (b[0] === 'v') return 1;
  if (polyOf(b)) return 2;
  if (b[0] === 'f' && b[1] === 'sqrt') return 3;
  if (b[0] === 'f' && b[1] === 'exp') return 4;
  if (b[0] === 'f') return 5;
  return 3;
}
export function fromFactors(c, fs) {
  fs = fs.slice().sort((a, b) => frank(a[0]) - frank(b[0]));
  let num = null,
    den = null;
  for (const [b, p] of fs) {
    if (p > 0) {
      const t = pow(b, Nn(p));
      num = num ? mul(num, t) : t;
    } else {
      const t = pow(b, Nn(-p));
      den = den ? mul(den, t) : t;
    }
  }
  let r = num || Nn(1);
  if (den) r = div(r, den);
  return mul(Nn(c), r);
}
export function sumTerms(e, s = 1, out = []) {
  if (e[0] === '+') {
    sumTerms(e[1], s, out);
    sumTerms(e[2], s, out);
  } else if (e[0] === '-') {
    sumTerms(e[1], s, out);
    sumTerms(e[2], -s, out);
  } else if (e[0] === 'neg') sumTerms(e[1], -s, out);
  else out.push([s, e]);
  return out;
}
export function linTerms(e, s = 1, out = []) {
  if (e[0] === '+') {
    linTerms(e[1], s, out);
    linTerms(e[2], s, out);
  } else if (e[0] === '-') {
    linTerms(e[1], s, out);
    linTerms(e[2], -s, out);
  } else if (e[0] === 'neg') linTerms(e[1], -s, out);
  else if (e[0] === '*' && isN(e[1]) && (e[2][0] === '+' || e[2][0] === '-'))
    linTerms(e[2], s * e[1][1], out);
  else out.push([s, e]);
  return out;
}
export function tidy(e) {
  switch (e[0]) {
    case 'n':
    case 'v':
    case 'c':
      return e;
    case 'f':
      return fn(e[1], tidy(e[2]));
    case '+':
    case '-': {
      const ts = linTerms(e),
        m = [];
      for (const [s, t0] of ts) {
        const t = tidy(t0),
          F = asFactors(t),
          r = fromFactors(1, F.fs),
          k = key(r),
          c = s * F.c,
          f = m.find((z) => z[1] === k);
        if (f) f[2] += c;
        else m.push([r, k, c]);
      }
      let out = null;
      for (const [r, , c] of m) {
        if (Math.abs(c) < 1e-12) continue;
        const t = mul(Nn(Math.abs(c)), r);
        out = out === null ? (c < 0 ? neg(t) : t) : c < 0 ? sub(out, t) : add(out, t);
      }
      return out || Nn(0);
    }
    default: {
      const t = e[0] === 'neg' ? neg(tidy(e[1])) : OPS[e[0]](tidy(e[1]), tidy(e[2]));
      if (t[0] === '+' || t[0] === '-') return tidy(t);
      if (t[0] === 'n' || t[0] === 'v' || t[0] === 'c' || t[0] === 'f') return t;
      const F = asFactors(t);
      const fs = F.fs.map(([b, p, k]) => [b[0] === '+' || b[0] === '-' ? tidyS(b) : b, p, k]);
      return fromFactors(F.c, fs);
    }
  }
}
export const tidyS = (b) => {
  const t = tidy(b);
  return t;
};

export function dropConst(e) {
  const ts = sumTerms(e).filter(([, t]) => has(t));
  if (!ts.length) return Nn(0);
  let out = null;
  for (const [s, t] of ts) out = out === null ? (s < 0 ? neg(t) : t) : s < 0 ? sub(out, t) : add(out, t);
  return out;
}
