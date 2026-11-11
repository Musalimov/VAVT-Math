import { hasInf, parse } from '../../../math/expr/parse.js';
import { compile, has, simp } from '../../../math/expr/core.js';
export function lgam(x) {
  const g = 7,
    c = [
      0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059,
      12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
    ];
  if (x < 0.5) return Math.log(Math.PI / Math.abs(Math.sin(Math.PI * x))) - lgam(1 - x);
  x -= 1;
  let a = c[0];
  const t = x + g + 0.5;
  for (let i = 1; i < 9; i++) a += c[i] / (x + i);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}
export function Cnk(n, k) {
  if (k < 0 || k > n) return 0;
  if (n <= 60) {
    let r = 1;
    for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
    return Math.round(r);
  }
  return Math.exp(lgam(n + 1) - lgam(k + 1) - lgam(n - k + 1));
}
export function binom(n, p, k) {
  if (k < 0 || k > n) return 0;
  if (p === 0) return k === 0 ? 1 : 0;
  if (p === 1) return k === n ? 1 : 0;
  return Math.exp(lgam(n + 1) - lgam(k + 1) - lgam(n - k + 1) + k * Math.log(p) + (n - k) * Math.log(1 - p));
}
export function poiss(l, k) {
  if (k < 0) return 0;
  return Math.exp(-l + k * Math.log(l) - lgam(k + 1));
}
export function erfc(x) {
  const z = Math.abs(x),
    t = 1 / (1 + 0.5 * z);
  const r =
    t *
    Math.exp(
      -z * z -
        1.26551223 +
        t *
          (1.00002368 +
            t *
              (0.37409196 +
                t *
                  (0.09678418 +
                    t *
                      (-0.18628806 +
                        t *
                          (0.27886807 +
                            t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277))))))))
    );
  return x >= 0 ? r : 2 - r;
}
export function PhiN(x) {
  if (!isFinite(x)) return x > 0 ? 1 : 0;
  const a = Math.abs(x);
  let r;
  if (a < 5) {
    let s = 0,
      t = a,
      n = 1;
    s = a;
    for (let i = 1; i < 200; i++) {
      t *= (a * a) / (2 * i + 1);
      s += t;
      if (t < 1e-17 * s) break;
    }
    r = 0.5 + (s * Math.exp((-a * a) / 2)) / Math.sqrt(2 * Math.PI);
  } else {
    let f = 0;
    for (let k = 60; k >= 1; k--) f = k / (a + f);
    r = 1 - Math.exp((-a * a) / 2) / Math.sqrt(2 * Math.PI) / (a + f);
  }
  return x >= 0 ? r : 1 - r;
}
export const phiG = (x) => Math.exp((-x * x) / 2) / Math.sqrt(2 * Math.PI);
export function PhiInv(p) {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  const a = [
      -39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716,
      2.506628277459239,
    ],
    b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572],
    c = [
      -0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968,
      2.938163982698783,
    ],
    d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  const pl = 0.02425;
  let q, r, x;
  if (p < pl) {
    q = Math.sqrt(-2 * Math.log(p));
    x =
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  } else if (p <= 1 - pl) {
    q = p - 0.5;
    r = q * q;
    x =
      ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    x =
      -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  for (let i = 0; i < 2; i++) {
    const e = PhiN(x) - p;
    x -= e / phiG(x);
  }
  return x;
}
export const r2 = (x) => Math.round(x * 100) / 100;
export const r4 = (x) => Math.round(x * 1e4) / 1e4;
export function numIn(s) {
  if (s === undefined || s === null) throw { msg: 'num' };
  s = String(s)
    .trim()
    .replace(/[−–]/g, '-')
    .replace(/[\u00a0\u202f]/g, ' ');
  if (/^[-+]?\d{1,3}( \d{3})+([.,]\d+)?%?$/.test(s)) s = s.replace(/ /g, '');
  s = s.replace(/,/g, '.');
  if (!s) throw { msg: 'num' };
  if (/\d*\.\d*\./.test(s) || /[\d.]\s+[\d.]/.test(s)) throw { msg: 'num' };
  let pct = false;
  if (s.endsWith('%')) {
    pct = true;
    s = s.slice(0, -1);
  }
  let v;
  if (/^[-+]?\d*\.?\d+(e[-+]?\d+)?$/i.test(s)) v = parseFloat(s);
  else {
    const e = parse(s);
    if (hasInf(e)) v = e[0] === 'neg' ? -Infinity : Infinity;
    else {
      if (has(simp(e))) throw { msg: 'num' };
      v = compile(simp(e))(0);
    }
  }
  if (!isFinite(v) && !/inf|∞/.test(s)) throw { msg: 'num' };
  return pct ? v / 100 : v;
}
export function rowNums(s) {
  return s
    .trim()
    .replace(/[−–]/g, '-')
    .split(/[\s;|\t]+/)
    .filter(Boolean);
}
export function parseSeries(txt) {
  const lines = txt
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) throw { msg: 'rows' };
  const strip = (l) => l.replace(/^\s*[a-zA-Zа-яА-Я()]+\s*[:=]?\s*/, '');
  const xs = rowNums(strip(lines[0])).map(numIn);
  const ps0 = rowNums(strip(lines[1]));
  if (xs.length !== ps0.length) throw { msg: 'len' };
  {
    const sx = [...xs].sort((a, b) => a - b);
    for (let i = 1; i < sx.length; i++)
      if (Math.abs(sx[i] - sx[i - 1]) < 1e-12) throw { msg: 'dupx', x: sx[i] };
  }
  let unk = -1;
  const ps = ps0.map((s, i) => {
    if (s === '?') {
      if (unk >= 0) throw { msg: 'unk2' };
      unk = i;
      return NaN;
    }
    return numIn(s);
  });
  if (unk >= 0) {
    const rest = ps.reduce((a, v, i) => (i === unk ? a : a + v), 0);
    ps[unk] = 1 - rest;
  }
  if (ps.some((p) => p < -1e-12 || p > 1 + 1e-12)) throw { msg: 'prob' };
  const sum = ps.reduce((a, b) => a + b, 0);
  const idx = xs.map((_, i) => i).sort((a, b) => xs[a] - xs[b]);
  return {
    x: idx.map((i) => xs[i]),
    p: idx.map((i) => ps[i]),
    sum,
    unk: unk >= 0 ? { x: xs[unk], p: ps[unk] } : null,
  };
}
export function seriesStats(x, p) {
  const M = x.reduce((s, v, i) => s + v * p[i], 0),
    M2 = x.reduce((s, v, i) => s + v * v * p[i], 0),
    D = M2 - M * M;
  let mi = 0;
  p.forEach((v, i) => {
    if (v > p[mi] + 1e-12) mi = i;
  });
  const modes = x.filter((_, i) => Math.abs(p[i] - p[mi]) < 1e-12);
  return { M, M2, D: Math.max(0, D), s: Math.sqrt(Math.max(0, D)), modes };
}
export function genBinom(n, p) {
  const x = [],
    q = [];
  for (let k = 0; k <= n; k++) {
    x.push(k);
    q.push(binom(n, p, k));
  }
  return { x, p: q };
}
export function genHyper(N, M, n) {
  const x = [],
    q = [],
    den = Cnk(N, n);
  for (let k = Math.max(0, n - (N - M)); k <= Math.min(n, M); k++) {
    x.push(k);
    q.push((Cnk(M, k) * Cnk(N - M, n - k)) / den);
  }
  return { x, p: q };
}
export function genGeom(p, nmax) {
  const x = [],
    q = [];
  for (let k = 1; k <= nmax; k++) {
    x.push(k);
    q.push(k < nmax ? Math.pow(1 - p, k - 1) * p : Math.pow(1 - p, nmax - 1));
  }
  return { x, p: q };
}
export function parseJoint(txt) {
  const lines = txt
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) throw { msg: 'rows' };
  const head = rowNums(lines[0]);
  let ys = head;
  if (head.length && !/^[-+]?[\d.,/]+$/.test(head[0].replace(/,/g, '.'))) ys = head.slice(1);
  ys = ys.map(numIn);
  const xs = [],
    P = [];
  for (const l of lines.slice(1)) {
    const c = rowNums(l.replace(/:/, ' '));
    if (c.length !== ys.length + 1) throw { msg: 'len' };
    xs.push(numIn(c[0]));
    P.push(c.slice(1).map(numIn));
  }
  const sum = P.flat().reduce((a, b) => a + b, 0);
  if (P.flat().some((v) => v < -1e-12)) throw { msg: 'prob' };
  return { x: xs, y: ys, P, sum };
}
export function jointStats(J) {
  const px = J.P.map((r) => r.reduce((a, b) => a + b, 0)),
    py = J.y.map((_, j) => J.P.reduce((a, r) => a + r[j], 0));
  const sx = seriesStats(J.x, px),
    sy = seriesStats(J.y, py);
  let Mxy = 0;
  J.P.forEach((r, i) =>
    r.forEach((v, j) => {
      Mxy += J.x[i] * J.y[j] * v;
    })
  );
  const cov = Mxy - sx.M * sy.M,
    r = sx.s > 0 && sy.s > 0 ? cov / (sx.s * sy.s) : NaN;
  let indep = true;
  J.P.forEach((row, i) =>
    row.forEach((v, j) => {
      if (Math.abs(v - px[i] * py[j]) > 1e-9) indep = false;
    })
  );
  return { px, py, sx, sy, Mxy, cov, r, indep };
}
export function distOf(J, f) {
  const m = new Map();
  J.P.forEach((r, i) =>
    r.forEach((v, j) => {
      const z = +f(J.x[i], J.y[j]).toFixed(10);
      m.set(z, (m.get(z) || 0) + v);
    })
  );
  const zs = [...m.keys()].sort((a, b) => a - b);
  return { x: zs, p: zs.map((z) => m.get(z)) };
}
export function bf(n) {
  let r = 1n;
  for (let i = 2n; i <= BigInt(n); i++) r *= i;
  return r;
}
export function bA(n, k) {
  let r = 1n;
  for (let i = 0; i < k; i++) r *= BigInt(n - i);
  return r;
}
export function bC(n, k) {
  if (k < 0 || k > n) return 0n;
  k = Math.min(k, n - k);
  let r = 1n;
  for (let i = 1; i <= k; i++) {
    r = (r * BigInt(n - k + i)) / BigInt(i);
  }
  return r;
}
export function bPow(n, k) {
  return BigInt(n) ** BigInt(k);
}
export const bStr = (b) => {
  const s = b.toString();
  return s.length > 15
    ? s.slice(0, 1) + ',' + s.slice(1, 5) + '·10^' + (s.length - 1)
    : s.replace(/\B(?=(\d{3})+(?!\d))/g, '\u2009');
};
export const bNum = (b) => Number(b);
export function gcdB(a, b) {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}
export function diceDist(s) {
  let d = [1];
  for (let i = 0; i < s; i++) {
    const n = new Array(d.length + 6).fill(0);
    d.forEach((v, j) => {
      for (let f = 1; f <= 6; f++) n[j + f] += v;
    });
    d = n;
  }
  return d;
}
export function polyEvents(ps) {
  let c = [1];
  for (const p of ps) {
    const n = new Array(c.length + 1).fill(0);
    c.forEach((v, k) => {
      n[k] += v * (1 - p);
      n[k + 1] += v * p;
    });
    c = n;
  }
  return c;
}
