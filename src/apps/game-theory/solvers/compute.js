import { exprXY, numG } from '../../../shared/econ/expr-xy.js';
import {
  auction,
  backward,
  bargain,
  bayesGame,
  bimatrix,
  braess,
  coalitions,
  contGame,
  convexG,
  coreLP,
  cournot,
  dominance,
  evoAnalysis,
  galeShapley,
  hotelPrice,
  oligo,
  parseMat,
  parsePrefs,
  parseTree,
  power,
  prenucleolus,
  replicator,
  shapley,
  tournament,
  zeroSum,
} from './games.js';

export const E = (msg) => {
  throw { msg };
};
export const nI = (s) => numG(s);
export function compMat(I) {
  const A = parseMat(I.A || '');
  if (A.length > 6 || A[0].length > 6) E('big');
  if (I.kind === 'zs') {
    const B = A.map((r) => r.map((v) => -v));
    const z = zeroSum(A);
    return { kind: 'zs', A, B, z, bm: bimatrix(A, B) };
  }
  const B = parseMat(I.B || '');
  if (B.length !== A.length || B[0].length !== A[0].length) E('len');
  return { kind: 'bi', A, B, bm: bimatrix(A, B), dom: dominance(A, B) };
}
export function compCour(I) {
  const M = nI(I.M);
  const cs = (I.cs || '')
    .trim()
    .split(/[\s;]+/)
    .filter(Boolean)
    .map(numG);
  if (!cs.length || cs.length > 12) E('num');
  const om = I.om || 'cour';
  if (om === 'cour') {
    const r = cournot(M, cs);
    return { om, M, cs, ...r };
  }
  if (cs.some((c) => c >= M)) E('cM');
  const c1 = cs[0],
    c2 = cs.length > 1 ? cs[1] : cs[0];
  const o = oligo(om === 'cmp' ? 'cour' : om, M, c1, c2);
  return { om, M, cs, ...o, N: 2 };
}
export const nums = (s) =>
  (s || '')
    .trim()
    .split(/[\s;]+/)
    .filter(Boolean)
    .map(numG);
export function compCont(I) {
  let H1, H2;
  try {
    H1 = exprXY(I.H1 || '');
    H2 = exprXY(I.H2 || '');
  } catch (e) {
    E('expr');
  }
  const a1 = nI(I.a1),
    b1 = nI(I.b1),
    a2 = nI(I.a2),
    b2 = nI(I.b2);
  if (!(a1 < b1 && a2 < b2)) E('ab');
  return { a1, b1, a2, b2, H1, H2, ...contGame(H1, H2, a1, b1, a2, b2) };
}
export function compBayes(I) {
  const mu = nI(I.mu);
  if (!(mu >= 0 && mu <= 1)) E('mu');
  const m = [I.A1, I.B1, I.A2, I.B2].map((t) => parseMat(t || ''));
  if (m.some((x) => x.length !== 2 || x[0].length !== 2)) E('m22');
  const g = bayesGame(mu, ...m);
  return { kind: 'bi', mu, M4: m, ...g, cl: g.cols.map(([a, b]) => `${a + 1}${b + 1}`) };
}
export function compHotel(I) {
  if (I.hm !== 'price') return { hm: 'loc' };
  const a = nI(I.ha),
    b = nI(I.hb),
    t = nI(I.ht),
    c = nI(I.hc);
  if (!(a >= 0 && b >= 0 && a + b < 1 && t > 0)) E('hot');
  return { hm: 'price', a, b, t, c, ...hotelPrice(a, b, t, c) };
}
export function compTree(I) {
  const T0 = parseTree(I.tr || '');
  const r = backward(T0);
  return { T: T0, ...r };
}
export function compRep(I) {
  const pay = { R: nI(I.R), T: nI(I.Tt), S: nI(I.Ss), P: nI(I.Pp) };
  if (!(pay.T > pay.R && pay.R > pay.P && pay.P > pay.S)) E('pdo');
  const n = nI(I.rn);
  if (!Number.isInteger(n) || n < 1 || n > 1000) E('rn');
  const dl = nI(I.dl);
  const tr = tournament(n, pay);
  return { pay, n, dl, ...tr, grim: (pay.T - pay.R) / (pay.T - pay.P) };
}
export function compEvo(I) {
  let A;
  if (I.em === 'hd') {
    const V = nI(I.V),
      C = nI(I.C);
    if (!(V > 0 && C > 0)) E('vc');
    A = [
      [(V - C) / 2, V],
      [0, V / 2],
    ];
  } else {
    A = parseMat(I.EA || '');
    if (A.length !== 2 || A[0].length !== 2) E('m22');
  }
  const ev = evoAnalysis(A);
  const x0 = nums(I.x0).filter((v) => v >= 0 && v <= 1);
  return { A, ...ev, x0, traj: x0.map((x) => replicator(ev.g, x, 30, 0.02)) };
}
export function compVote(I) {
  const q = nI(I.q),
    w = nums(I.wts);
  if (!w.length || w.length > 16) E('wts');
  if (!(q > 0)) E('q');
  return { q, w, ...power(q, w) };
}
export function compMatch(I) {
  let a = parsePrefs(I.mp || ''),
    b = parsePrefs(I.mr || '');
  const rev = I.side === 'r';
  const r = rev ? galeShapley(b, a) : galeShapley(a, b);
  return { rev, pa: a, pb: b, ...r };
}
export function compBraess(I) {
  const N = nI(I.bN),
    a = nI(I.ba),
    b = nI(I.bb),
    e = I.be === '' || I.be == null ? 0 : nI(I.be);
  if (!(N > 0 && a > 0 && b >= 0)) E('num');
  const yes = I.brg === 'yes';
  const r = braess(N, a, b, e, yes),
    r0 = braess(N, a, b, e, false);
  if (!r.eq) E('lp');
  return { N, a, b, e, yes, ...r, base: r0.eq };
}
export function compBarg(I) {
  const pts = (I.pts || '')
    .trim()
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.split(/[\s;]+/).map(numG));
  if (pts.length < 2 || pts.some((p) => p.length !== 2)) E('hull');
  const d = [nI(I.d1), nI(I.d2)];
  return { pts, d, ...bargain(pts, d) };
}
export function compCoop(I) {
  const lines = (I.coal || '')
    .trim()
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  let n = 2;
  const vals = [];
  for (const l of lines) {
    const m = /^\{?\s*([1-4][\s,]*)+\}?\s+/.exec(l);
    const p = l.split(/\s+/);
    if (p.length < 2) E('coal');
    const val = numG(p[p.length - 1]),
      K = p.slice(0, -1).join('').replace(/[{},]/g, '');
    if (!/^[1-4]+$/.test(K)) E('coal');
    let mask = 0;
    for (const ch of K) {
      mask |= 1 << (+ch - 1);
      n = Math.max(n, +ch);
    }
    vals.push([mask, val]);
  }
  const v = new Array(1 << n).fill(0);
  vals.forEach(([m, x]) => {
    v[m] = x;
  });
  const sh = shapley(n, v),
    core = coreLP(n, v),
    cv = convexG(n, v),
    pn = prenucleolus(n, v);
  const N = (1 << n) - 1;
  const inCore = (x) =>
    x &&
    coalitions(n).every(
      (K) => K === N || [...Array(n)].reduce((s, _, i) => s + ((K >> i) & 1 ? x[i] : 0), 0) >= v[K] - 1e-9
    );
  return { n, v, sh, core, cv, pn, shIn: inCore(sh.phi), pnIn: inCore(pn.x) };
}
export function compAuct(I) {
  const n = nI(I.n),
    w = nI(I.w),
    v = nI(I.v);
  if (!Number.isInteger(n) || n < 2 || n > 30) E('n');
  if (!(w > 0)) E('w');
  const a = auction(n, w);
  return { n, w, v: Math.max(0, Math.min(w, v)), a };
}
export const COMP = {
  mat: compMat,
  cour: compCour,
  barg: compBarg,
  coop: compCoop,
  auct: compAuct,
  cont: compCont,
  bayes: compBayes,
  hotel: compHotel,
  tree: compTree,
  rep: compRep,
  evo: compEvo,
  vote: compVote,
  match: compMatch,
  braess: compBraess,
};
