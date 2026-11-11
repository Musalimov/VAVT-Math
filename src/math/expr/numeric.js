import { snap } from './core.js';
export function tsFinite(f, a, b) {
  const c = (a + b) / 2,
    r = (b - a) / 2;
  if (r === 0) return { v: 0, ok: true };
  const ev = (x) => {
    const y = f(x);
    return isFinite(y) ? y : 0;
  };
  let h = 1,
    S = (Math.PI / 2) * ev(c),
    prev = null,
    I = 0,
    ok = false,
    bad = false;
  const addT = (t) => {
    const s = (Math.PI / 2) * Math.sinh(t),
      q = Math.exp(-2 * s),
      dist = (2 * q) / (1 + q),
      w = ((Math.PI / 2) * Math.cosh(t) * 4 * q) / ((1 + q) * (1 + q));
    if (w < 1e-300 || r * dist === 0) return 0;
    const xa = a + r * dist,
      xb = b - r * dist;
    let s2 = 0;
    if (xa !== a) {
      const fa = f(xa);
      if (isFinite(fa)) s2 += fa;
      else bad = true;
    }
    if (xb !== b) {
      const fb = f(xb);
      if (isFinite(fb)) s2 += fb;
      else bad = true;
    }
    return w * s2;
  };
  const TM = 4.4;
  for (let k = 1; k <= 40; k++) {
    const t = k * h,
      v = addT(t);
    S += v;
    if (t > TM) break;
  }
  I = r * h * S;
  let good = 0;
  for (let lev = 1; lev <= 8; lev++) {
    h /= 2;
    let add = 0;
    for (let k = 1; ; k += 2) {
      const t = k * h;
      if (t > TM) break;
      add += addT(t);
    }
    S += add;
    const nI = r * h * S;
    if (Math.abs(nI - I) <= 1e-12 * Math.max(1, Math.abs(nI))) {
      good++;
      if (good >= 2 && lev >= 4) {
        I = nI;
        ok = true;
        break;
      }
    } else good = 0;
    prev = I;
    I = nI;
  }
  if (!ok && prev !== null && Math.abs(I - prev) <= 1e-7 * Math.max(1, Math.abs(I))) ok = true;
  return { v: I, ok: ok && !bad };
}
export function quadF(f, a, b) {
  if (a === b) return { v: 0, ok: true };
  if (a > b) {
    const r = quadF(f, b, a);
    return { v: -r.v, ok: r.ok };
  }
  if (a === -Infinity && b === Infinity) {
    const l = quadF(f, -Infinity, 0),
      r = quadF(f, 0, Infinity);
    return { v: l.v + r.v, ok: l.ok && r.ok };
  }
  if (b === Infinity) {
    const g = (t) => {
      const u = 1 - t;
      return f(a + t / u) / (u * u);
    };
    return tsFinite(g, 0, 1);
  }
  if (a === -Infinity) {
    const g = (t) => {
      const u = 1 - t;
      return f(b - t / u) / (u * u);
    };
    return tsFinite(g, 0, 1);
  }
  const n = Math.max(1, Math.min(48, Math.ceil((b - a) / 1.5)));
  let v = 0,
    ok = true;
  const ad = (p, q, whole, d) => {
    const m = (p + q) / 2,
      L = tsFinite(f, p, m),
      Rr = tsFinite(f, m, q),
      s = L.v + Rr.v;
    if (d >= 7 || Math.abs(s - whole.v) <= 1e-12 * Math.max(1, Math.abs(s)))
      return {
        v: s,
        ok: L.ok && Rr.ok && (d < 7 || Math.abs(s - whole.v) < 1e-8 * Math.max(1, Math.abs(s))),
      };
    const x = ad(p, m, L, d + 1),
      y = ad(m, q, Rr, d + 1);
    return { v: x.v + y.v, ok: x.ok && y.ok };
  };
  for (let i = 0; i < n; i++) {
    const p = a + ((b - a) * i) / n,
      q = a + ((b - a) * (i + 1)) / n,
      w = tsFinite(f, p, q),
      r = n > 24 ? w : ad(p, q, w, 0);
    v += r.v;
    ok = ok && r.ok;
  }
  return { v, ok };
}
export function singular(f, a, b) {
  const out = [];
  if (!(isFinite(a) && isFinite(b)) || b <= a) return out;
  const N = 1200,
    h = (b - a) / N,
    xs = [],
    ys = [];
  for (let i = 0; i <= N; i++) {
    const x = a + h * i;
    xs.push(x);
    ys.push(f(x));
  }
  const mags = ys
      .filter(isFinite)
      .map(Math.abs)
      .sort((p, q) => p - q),
    med = mags.length ? mags[mags.length >> 1] : 1,
    thr = 30 * (1 + med);
  const put = (x) => {
    if (!out.some((s) => Math.abs(s - x) < h * 2)) out.push(x);
  };
  const refine = (lo, hi) => {
    for (let k = 0; k < 90; k++) {
      const m1 = lo + (hi - lo) / 3,
        m2 = hi - (hi - lo) / 3;
      if (Math.abs(f(m1)) > Math.abs(f(m2))) hi = m2;
      else lo = m1;
    }
    return (lo + hi) / 2;
  };
  for (let i = 1; i < N; i++) {
    const y = ys[i];
    if (isNaN(y)) continue;
    if (!isFinite(y)) {
      put(xs[i]);
      continue;
    }
    const yl = ys[i - 1],
      yr = ys[i + 1],
      ay = Math.abs(y);
    const peak = isFinite(yl) && isFinite(yr) && ay >= Math.abs(yl) && ay >= Math.abs(yr) && ay > thr;
    const flip = isFinite(yr) && y * yr < 0 && Math.min(ay, Math.abs(yr)) > thr;
    if (peak || flip) {
      const s = flip ? refine(xs[i], xs[i + 1]) : refine(xs[i - 1], xs[i + 1]),
        v = Math.abs(f(s)),
        d = h * 1e-3,
        g1 = Math.max(Math.abs(f(s + d)), Math.abs(f(s - d))),
        g2 = Math.max(Math.abs(f(s + d * 1e-3)), Math.abs(f(s - d * 1e-3)));
      if (!isFinite(v) || v > 1e8 || (isFinite(g2) && g2 > 50 * g1 && g2 > thr)) put(s);
    }
  }
  return out
    .map((x) => {
      const r = snap(x);
      return Math.abs(r - x) < 1e-9 ? r : x;
    })
    .sort((p, q) => p - q);
}
