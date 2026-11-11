export const I = (n) => (n === 2 ? [1, 0, 0, 1] : [1, 0, 0, 0, 1, 0, 0, 0, 1]);
export const lerp = (A, B, t) => A.map((x, i) => x + (B[i] - x) * t);
export function mul(A, B, n) {
  const R = new Array(n * n).fill(0);
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) R[i * n + j] += A[i * n + k] * B[k * n + j];
  return R;
}
export function ap(M, v, n) {
  if (n === 2) return [M[0] * v[0] + M[1] * v[1], M[2] * v[0] + M[3] * v[1]];
  return [
    M[0] * v[0] + M[1] * v[1] + M[2] * v[2],
    M[3] * v[0] + M[4] * v[1] + M[5] * v[2],
    M[6] * v[0] + M[7] * v[1] + M[8] * v[2],
  ];
}
export function det(M, n) {
  if (n === 2) return M[0] * M[3] - M[1] * M[2];
  const [a, b, c, e, f, g, h, i, j] = M;
  return a * (f * j - g * i) - b * (e * j - g * h) + c * (e * i - f * h);
}
/**
 * Вырождена ли матрица: |det| ≤ 1e-9 · (max |aᵢⱼ|)ⁿ — допуск относительный, поэтому
 * 10⁻⁵·E не объявляется вырожденной, а почти вырожденная матрица с большими
 * элементами — объявляется.
 * @param {number[]} M @param {number} n
 */
export function isSingular(M, n) {
  const s = Math.max(...M.slice(0, n * n).map(Math.abs));
  return s === 0 || Math.abs(det(M, n)) <= 1e-9 * Math.pow(s, n);
}
export function inv(M, n) {
  const d = det(M, n);
  if (isSingular(M, n)) return null;
  if (n === 2) return [M[3] / d, -M[1] / d, -M[2] / d, M[0] / d];
  const [a, b, c, e, f, g, h, i, j] = M;
  return [
    (f * j - g * i) / d,
    (c * i - b * j) / d,
    (b * g - c * f) / d,
    (g * h - e * j) / d,
    (a * j - c * h) / d,
    (c * e - a * g) / d,
    (e * i - f * h) / d,
    (b * h - a * i) / d,
    (a * f - b * e) / d,
  ];
}
export const tr = (M, n) => (n === 2 ? M[0] + M[3] : M[0] + M[4] + M[8]);
export function transpose(M, n) {
  const R = [];
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) R[i * n + j] = M[j * n + i];
  return R;
}
export const col = (M, j, n) => (n === 2 ? [M[j], M[2 + j]] : [M[j], M[3 + j], M[6 + j]]);
export const norm = (v) => Math.hypot(...v);
export const nz = (v) => {
  const L = norm(v) || 1;
  return v.map((x) => x / L);
};
export const isI = (M, n) => M.every((x, i) => Math.abs(x - I(n)[i]) < 1e-9);
export const add = (a, b) => a.map((x, i) => x + b[i]);
export const sc = (a, s) => a.map((x) => x * s);
/**
 * Ядро и ранг. Допуск — tol · scale, где scale по умолчанию — max |aᵢⱼ| самой матрицы;
 * для M − λE (собственные векторы) передаётся масштаб исходной M.
 */
export function nullspace(A, n, tol, scale = Math.max(...A.map(Math.abs))) {
  const m = [];
  for (let i = 0; i < n; i++) m.push(A.slice(i * n, i * n + n));
  // допуск относительно величины элементов (раньше — не меньше tol: 10⁻¹⁰·E давала ранг 0)
  const T = tol * scale;
  let r = 0;
  const piv = [];
  for (let c = 0; c < n && r < n; c++) {
    let b = r;
    for (let i = r + 1; i < n; i++) if (Math.abs(m[i][c]) > Math.abs(m[b][c])) b = i;
    if (Math.abs(m[b][c]) < T) continue;
    [m[r], m[b]] = [m[b], m[r]];
    const pv = m[r][c];
    for (let j = 0; j < n; j++) m[r][j] /= pv;
    for (let i = 0; i < n; i++)
      if (i !== r) {
        const f = m[i][c];
        if (f) for (let j = 0; j < n; j++) m[i][j] -= f * m[r][j];
      }
    piv.push(c);
    r++;
  }
  const free = [];
  for (let c = 0; c < n; c++) if (!piv.includes(c)) free.push(c);
  const basis = free.map((fc) => {
    const v = new Array(n).fill(0);
    v[fc] = 1;
    piv.forEach((pc, ri) => {
      v[pc] = -m[ri][fc];
    });
    return nz(v);
  });
  return { rank: r, piv, basis };
}
export function cubicRoots(A) {
  const T = tr(A, 3),
    c2 = A[0] * A[4] - A[1] * A[3] + (A[0] * A[8] - A[2] * A[6]) + (A[4] * A[8] - A[5] * A[7]),
    D = det(A, 3);
  const a = -T,
    b = c2,
    c = -D,
    p = b - (a * a) / 3,
    q = (2 * a * a * a) / 27 - (a * b) / 3 + c,
    sh = -a / 3,
    disc = (q / 2) ** 2 + (p / 3) ** 3;
  const scale = Math.max(1, Math.abs(a), Math.abs(b), Math.abs(c));
  if (Math.abs(p) < 1e-12 * scale && Math.abs(q) < 1e-12 * scale)
    return [
      { re: sh, im: 0 },
      { re: sh, im: 0 },
      { re: sh, im: 0 },
    ];
  if (disc > 1e-12 * scale ** 3) {
    const s = Math.sqrt(disc),
      u = Math.cbrt(-q / 2 + s),
      v = Math.cbrt(-q / 2 - s);
    const re = -(u + v) / 2 + sh,
      im = ((u - v) * Math.sqrt(3)) / 2;
    return [
      { re: u + v + sh, im: 0 },
      { re, im },
      { re, im: -im },
    ];
  }
  if (disc >= -1e-12 * scale ** 3) {
    const u = Math.cbrt(-q / 2);
    return [
      { re: 2 * u + sh, im: 0 },
      { re: -u + sh, im: 0 },
      { re: -u + sh, im: 0 },
    ];
  }
  const r = Math.sqrt(-p / 3),
    phi = Math.acos(Math.max(-1, Math.min(1, -q / (2 * r * r * r))));
  return [0, 1, 2].map((k) => ({ re: 2 * r * Math.cos((phi - 2 * Math.PI * k) / 3) + sh, im: 0 }));
}
export function eigen(A, n) {
  let roots;
  if (n === 2) {
    const T = tr(A, 2),
      D = det(A, 2),
      disc = T * T - 4 * D;
    if (disc >= -1e-12) {
      const s = Math.sqrt(Math.max(0, disc));
      roots = [
        { re: (T + s) / 2, im: 0 },
        { re: (T - s) / 2, im: 0 },
      ];
    } else {
      const s = Math.sqrt(-disc);
      roots = [
        { re: T / 2, im: s / 2 },
        { re: T / 2, im: -s / 2 },
      ];
    }
  } else roots = cubicRoots(A);
  roots.forEach((r) => {
    if (Math.abs(r.im) < 1e-7 * (1 + Math.abs(r.re))) r.im = 0;
  });
  const real = [];
  roots
    .filter((r) => r.im === 0)
    .forEach((r) => {
      if (!real.some((x) => Math.abs(x - r.re) < 1e-6)) real.push(r.re);
    });
  const vecs = [];
  real.forEach((l) => {
    const B = A.slice();
    for (let i = 0; i < n; i++) B[i * n + i] -= l;
    const ns = nullspace(B, n, 1e-6, Math.max(...A.map(Math.abs)));
    ns.basis.forEach((v) => vecs.push({ l, v, dim: ns.basis.length }));
  });
  return { roots, vecs };
}
export function sigmaMin2(M) {
  const [a, b, c, d] = M,
    s = a * a + b * b + c * c + d * d,
    dt = a * d - b * c,
    q = Math.sqrt(Math.max(0, s * s - 4 * dt * dt));
  return Math.sqrt(Math.max(0, (s - q) / 2));
}

export const rot2 = (a) => [Math.cos(a), -Math.sin(a), Math.sin(a), Math.cos(a)];
export const rz = (a) => [Math.cos(a), -Math.sin(a), 0, Math.sin(a), Math.cos(a), 0, 0, 0, 1];
export const rx = (a) => [1, 0, 0, 0, Math.cos(a), -Math.sin(a), 0, Math.sin(a), Math.cos(a)];
