import { gdpCalc, mundellFixed, natInc, qtheory } from './model.js';
import {
  adas,
  islm,
  kcross,
  loanable,
  moneyMult,
  mundell,
  natU,
  okun,
  phillips,
  smallOpen,
  solow,
} from './model.js';
import { T } from '../content/tx.js';
import { dc } from '../../../shared/format.js';
import { numG } from '../../../shared/econ/expr-xy.js';

export const gv = (I, k) => Math.abs(nI(I[k] || 0)) || 1;
export const fin = (R) => R.R1 || R.R0;
export const E = (msg) => {
  throw { msg };
};
export const nI = (s) => numG(String(s == null ? '' : s).replace(',', '.'));
export const opt = (s, d = 0) => (s === '' || s == null ? d : nI(s));
export const pct = (s) => {
  const t = String(s == null ? '' : s).trim();
  if (!t) return 0;
  return t.endsWith('%')
    ? nI(t.slice(0, -1)) / 100
    : (() => {
        const v = nI(t);
        return Math.abs(v) >= 1 ? v / 100 : v;
      })();
};
export function compGdp(I) {
  const rows = String(I.tab || '')
    .trim()
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const p = l.split(/\s+/);
      if (p.length < 4) E('tab');
      const nums = p.slice(-4).map(nI);
      return [p.slice(0, -4).join(' ') || '—', ...nums];
    });
  if (!rows.length) E('tab');
  if (rows.some((r) => r.slice(1).some((v) => !(v >= 0)))) E('pos');
  return { rows, ...gdpCalc(rows) };
}
export function compUnemp(I) {
  if (I.um === 'nat') {
    const s = pct(I.us),
      f = pct(I.uf);
    if (!(s > 0 && f > 0)) E('pos');
    return { um: 'nat', s, f, u: natU(s, f) };
  }
  const du = nI(I.du) / 100,
    gN = pct(I.gN);
  return { um: 'okun', du, gN, g: okun(du, gN) };
}
export function compNat(I) {
  if (I.nm === 'prod') {
    const A = nI(I.A),
      K = nI(I.K),
      L = nI(I.L),
      al = nI(I.al);
    if (!(A > 0 && K > 0 && L > 0 && al > 0 && al < 1)) E('pos');
    return { nm: 'prod', A, K, L, al, ...natInc(A, K, L, al) };
  }
  const p = ['Y', 'a', 'b', 'G', 'T', 'c', 'd'].map((k) => nI(I[k]));
  if (!(p[2] > 0 && p[2] < 1)) E('mpc');
  if (!(p[6] > 0)) E('dPos');
  const [Y, a, b, G, T, c, d] = p;
  const R0 = loanable(Y, a, b, G, T, c, d);
  const dG = opt(I.dG),
    dT = opt(I.dT),
    dc = opt(I.dc);
  const R1 = dG || dT || dc ? loanable(Y, a, b, G + dG, T + dT, c + dc, d) : null;
  return { nm: 'lf', Y, a, b, G, T, c, d, dG, dT, dc, R0, R1 };
}
export function compMoney(I) {
  if (I.mm === 'qt') {
    const gM = pct(I.gM),
      gV = pct(I.gV),
      gY = pct(I.gY),
      r = pct(I.r);
    return { mm: 'qt', gM, gV, gY, r, ...qtheory(gM, gV, gY, r) };
  }
  const cr = nI(I.cr),
    rr = nI(I.rr),
    B = opt(I.B, NaN);
  if (!(cr >= 0 && rr > 0 && rr <= 1)) E('pos');
  const m = moneyMult(cr, rr);
  return { mm: 'mult', cr, rr, B, m, M: m * B };
}
export function compOpen(I) {
  const v = ['Y', 'a', 'b', 'G', 'T', 'c', 'd', 'rs', 'n0', 'n1'].map((k) => nI(I[k]));
  if (!(v[2] > 0 && v[2] < 1)) E('mpc');
  if (!(v[6] > 0)) E('dPos');
  if (!(v[9] > 0)) E('nxPos');
  const R0 = smallOpen(...v);
  const dG = opt(I.dG),
    dT = opt(I.dT),
    dc = opt(I.dc),
    drs = opt(I.drs),
    dn0 = opt(I.dn0);
  const v1 = [v[0], v[1], v[2], v[3] + dG, v[4] + dT, v[5] + dc, v[6], v[7] + drs, v[8] + dn0, v[9]];
  const R1 = dG || dT || dc || drs || dn0 ? smallOpen(...v1) : null;
  return { v, v1, R0, R1, dG, dT, dc, drs, dn0 };
}
export function compSolow(I) {
  const al = nI(I.al),
    s = nI(I.s),
    dl = nI(I.dl),
    n = opt(I.n),
    g = opt(I.g),
    k0 = nI(I.k0);
  if (!(al > 0 && al < 1 && s > 0 && s < 1 && dl + n + g > 0 && k0 > 0)) E('pos');
  const R = solow(al, s, dl, n, g, k0, 80);
  const s2 = opt(I.s2, NaN);
  const dn = opt(I.dn),
    ddl = opt(I.ddl);
  if (isFinite(s2) || dn || ddl) {
    const s1 = isFinite(s2) ? s2 : s;
    if (!(s1 > 0 && s1 < 1) || dl + ddl + n + dn + g <= 0) E('pos');
    R.alt = solow(al, s1, dl + ddl, n + dn, g, R.ks, 80);
    R.alt.s = s1;
  }
  R.al = al;
  R.s = s;
  R.dl = dl;
  R.n = n;
  R.g = g;
  R.k0 = k0;
  R.s2 = isFinite(s2) ? s2 : R.alt ? s : NaN;
  R.dn = dn;
  R.ddl = ddl;
  return R;
}
export function compCross(I) {
  const a = nI(I.a),
    b = nI(I.b),
    Iv = nI(I.I),
    G = nI(I.G),
    T = nI(I.T),
    t = opt(I.t);
  if (!(b > 0 && b < 1)) E('mpc');
  if (!(t >= 0 && t < 1)) E('tax');
  const R0 = kcross(a, b, Iv, G, T, t),
    dG = opt(I.dG),
    dT = opt(I.dT),
    dA = opt(I.dA);
  const R1 = dG || dT || dA ? kcross(a, b, Iv + dA, G + dG, T + dT, t) : null;
  return { a, b, I: Iv, G, T, t, dG, dT, dA, R0, R1 };
}
export const islmP = (I) => {
  const p = {};
  for (const k of ['a', 'b', 'c', 'd', 'G', 'T', 'M', 'P', 'e', 'f']) p[k] = nI(I[k]);
  if (!(p.b > 0 && p.b < 1)) E('mpc');
  if (p.d === 0) E('islmD');
  if (p.e === 0) E('islmE');
  if (p.f === 0) E('islmF');
  if (!(p.d > 0 && p.e > 0 && p.f > 0)) E('pos');
  if (!(p.P > 0)) E('price');
  return p;
};
export function compIslm(I) {
  const p = islmP(I),
    dG = opt(I.dG),
    dT = opt(I.dT),
    dM = opt(I.dM),
    dA = opt(I.dA),
    dMd = opt(I.dMd),
    dP = opt(I.dP),
    dI = opt(I.dI);
  if (p.P + dP <= 0) E('pos');
  const R0 = islm(p);
  const P1 = p.P + dP;
  const R1 =
    dG || dT || dM || dA || dMd || dP || dI
      ? islm({ ...p, G: p.G + dG + dA, T: p.T + dT, c: p.c + dI, P: P1, M: p.M + dM - dMd * P1 })
      : null;
  return { p, dG, dT, dM, dA, dMd, dP, dI, R0, R1 };
}
export function compMF(I) {
  const p = islmP(I);
  for (const k of ['rs', 'n0', 'n1']) p[k] = nI(I[k]);
  if (!(p.n1 > 0)) E('pos');
  const dG = opt(I.dG),
    dM = opt(I.dM),
    dT = opt(I.dT),
    dn0 = opt(I.dn0),
    drs = opt(I.drs);
  const R0 = mundell(p);
  let R1 = null;
  const p1 = { ...p, G: p.G + dG, T: p.T + dT, n0: p.n0 + dn0, rs: p.rs + drs };
  if (I.reg === 'fixed') {
    if (dG || dT || dn0 || drs || dM) R1 = { ...mundellFixed(p1, R0.e), e: R0.e };
  } else if (dG || dM || dT || dn0 || drs) R1 = mundell({ ...p1, M: p.M + dM });
  return { reg: I.reg, p, p1, dG, dM, dT, dn0, drs, R0, R1 };
}
export function compAdas(I) {
  const M = nI(I.M),
    V = nI(I.V),
    Yb = nI(I.Yb),
    al = nI(I.as),
    Pe = nI(I.Pe);
  if (!(M > 0 && V > 0 && Yb > 0 && al >= 0 && Pe > 0)) E('pos');
  const R0 = adas(M, V, Yb, al, Pe),
    dM = opt(I.dM),
    dPe = opt(I.dPe),
    dV = opt(I.dV),
    dYb = opt(I.dYb);
  let R1 = null,
    LR = null;
  if (M + dM <= 0 || V + dV <= 0 || Yb + dYb <= 0) E('pos');
  if (dM || dPe || dV || dYb) {
    R1 = adas(M + dM, V + dV, Yb + dYb, al, Pe + dPe);
    LR = { P: ((M + dM) * (V + dV)) / (Yb + dYb), Y: Yb + dYb };
  }
  return { M, V, Yb, al, Pe, dM, dPe, dV, dYb, R0, R1, LR };
}
export function compPhil(I) {
  const pe = pct(I.pe),
    be = nI(I.be),
    un = pct(I.un),
    u = pct(I.u),
    v = pct(I.v),
    sr = opt(I.sr, NaN);
  if (!(be > 0)) E('pos');
  const dpe = pct(I.dpe),
    du = nI(I.du2 || 0) / 100;
  return {
    pe,
    be,
    un,
    u,
    v,
    sr,
    pi: phillips(pe, be, un, u, v),
    dpe,
    du,
    pi2: dpe || du ? phillips(pe + dpe, be, un, u + du, v) : null,
  };
}
export const COMP = {
  gdp: compGdp,
  unemp: compUnemp,
  natinc: compNat,
  money: compMoney,
  open: compOpen,
  solow: compSolow,
  cross: compCross,
  islm: compIslm,
  mf: compMF,
  adas: compAdas,
  phil: compPhil,
};
