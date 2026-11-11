import { adas, islm, solow } from './model.js';
import { T } from '../content/tx.js';
import { fN } from '../../../shared/format.js';

export const fp = (v) => fN(v, 4);
export const pc = (v) => fN(v * 100, 3) + '%';
export const dlt = (a, b) => `${fp(a)} → ${fp(b)} (${b - a >= 0 ? '+' : '−'}${fp(Math.abs(b - a))})`;
export function sGdp(R) {
  const L = T(),
    st = [
      L.g_nom(fp(R.nom0), fp(R.nom1)),
      L.g_real(fp(R.real1)),
      L.g_defl(fp(R.defl)),
      L.g_cpi(fp(R.cpi)),
      L.g_gr(pc(R.gReal), pc(R.gNom)),
      L.g_diff,
    ];
  return { st, ans: `${L.v.defl} ${fp(R.defl)}, ${L.v.cpi} ${fp(R.cpi)}` };
}
export function sUnemp(R) {
  const L = T();
  if (R.um === 'nat') return { st: [L.u_rule, L.u_res(pc(R.s), pc(R.f), pc(R.u))], ans: `u* = ${pc(R.u)}` };
  return { st: [L.u_ok, L.u_okR(fN(R.du * 100, 3), pc(R.g))], ans: `ΔY/Y = ${pc(R.g)}` };
}
export function sNat(R) {
  const L = T();
  if (R.nm === 'prod')
    return {
      st: [
        L.n_cd(fp(R.A), fp(R.al)),
        L.n_Y(fp(R.Y)),
        L.n_mp(fp(R.MPK), fp(R.MPL)),
        L.n_sh(fN(R.capShare, 4), fN(R.labShare, 4)),
      ],
      ans: `Y = ${fp(R.Y)}`,
    };
  const a = R.R0,
    st = [
      L.n_lf,
      L.n_S(fp(R.Y), fp(a.C), fp(R.G), fp(a.S), fp(a.Spriv), fp(a.Spub)),
      L.n_r(fp(a.r), fp(a.I)),
    ];
  if (R.R1) {
    const b = R.R1;
    st.push(L.n_ch(dlt(a.S, b.S), dlt(a.r, b.r), dlt(a.I, b.I)));
    if (R.dG) st.push(L.n_crowd(fp(R.dG), fp(a.I - b.I)));
  }
  return { st, ans: `r = ${fp((R.R1 || a).r)}%, I = ${fp((R.R1 || a).I)}` };
}
export function sMoney(R) {
  const L = T();
  if (R.mm === 'qt')
    return {
      st: [L.q_eq, L.q_pi(pc(R.gM), pc(R.gV), pc(R.gY), pc(R.pi)), L.q_f(pc(R.r), pc(R.pi), pc(R.i))],
      ans: `π = ${pc(R.pi)}, i = ${pc(R.i)}`,
    };
  return {
    st: [L.q_m, L.q_mr(fp(R.cr), fp(R.rr), fp(R.m)) + (isFinite(R.M) ? ' ' + L.q_M(fp(R.B), fp(R.M)) : '')],
    ans: `m = ${fp(R.m)}`,
  };
}
export function sOpen(R) {
  const L = T(),
    a = R.R0,
    st = [L.o_rule, L.o_S(fp(a.S), fp(a.I), fp(a.NX)), L.o_e(fp(a.eps))];
  if (R.R1) {
    const b = R.R1;
    st.push(L.o_ch(fp(R.dG), dlt(a.NX, b.NX), dlt(a.eps, b.eps)));
  }
  return { st, ans: `NX = ${fp((R.R1 || a).NX)}, ε = ${fp((R.R1 || a).eps)}` };
}
export function sSolow(R) {
  const L = T(),
    st = [L.s_eq(fp(R.al), fp(R.s), fp(R.br))];
  st.push(L.s_ss(fp(R.ks), fp(R.ys), fp(R.cs)));
  st.push(L.s_tr(fp(R.k0), fp(R.tr[1].k), fp(R.tr[2].k)));
  st.push(L.s_gold(fp(R.kg), fp(R.sg), fp(R.cg), R.s < R.sg - 1e-9 ? '<' : R.s > R.sg + 1e-9 ? '>' : '='));
  if (R.n || R.g) st.push(L.s_gr(pc(R.n + R.g), pc(R.g)));
  if (R.alt) st.push(L.s_alt(fp(R.s2), fp(R.alt.ks), fp(R.alt.ys), fp(R.alt.cs)));
  const F = R.alt || R;
  return { st, ans: `k* = ${fp(F.ks)}, y* = ${fp(F.ys)}` };
}
export function sCross(R) {
  const L = T(),
    a = R.R0,
    st = [
      L.c_eq(fp(R.a), fp(R.b), fp(R.I), fp(R.G), fp(R.T)) + (R.t ? ' ' + L.c_t(fp(R.t)) : ''),
      L.c_Y(fp(a.Y)),
      L.c_m(fp(a.mG), fp(a.mT), fp(a.mBB)),
    ];
  if (R.R1) {
    const b = R.R1;
    st.push(L.c_ch(fp(R.dG), fp(R.dT), dlt(a.Y, b.Y)));
  }
  return { st, ans: `Y = ${fp((R.R1 || a).Y)}` };
}
export function sIslm(R) {
  const L = T(),
    a = R.R0,
    p = R.p,
    st = [
      L.i_is(fp(p.a), fp(p.b), fp(p.T), fp(p.c), fp(p.d), fp(p.G), fp(a.A / (1 - p.b)), fp(p.d / (1 - p.b))),
      L.i_lm(fp(p.M), fp(p.P), fp(p.e), fp(p.f), fp(a.mp / p.e), fp(p.f / p.e)),
      L.i_eq(fp(a.r), fp(a.Y), fp(a.C), fp(a.I)),
    ];
  if (R.R1) {
    const b = R.R1;
    st.push(L.i_ch(dlt(a.Y, b.Y), dlt(a.r, b.r), dlt(a.I, b.I)));
    if (R.dG) st.push(L.i_crowd(fp(R.dG / (1 - p.b)), fp(b.Y - a.Y)));
  }
  st.push(L.i_mult(fp(a.mG), fp(a.mT), fp(a.mM)));
  return { st, ans: `r = ${fp((R.R1 || a).r)}, Y = ${fp((R.R1 || a).Y)}` };
}
export function sMF(R) {
  const L = T(),
    a = R.R0,
    st = [L.f_rule(fp(R.p.rs)), L.f_lm(fp(a.Y)), L.f_is(fp(a.e), fp(a.NX))];
  if (R.R1) {
    const b = R.R1;
    if (R.reg === 'float') {
      st.push(L.f_fl(dlt(a.Y, b.Y), dlt(a.e, b.e), dlt(a.NX, b.NX)));
      if (R.dG) st.push(L.f_flG);
    } else {
      st.push(L.f_fx(dlt(a.Y, b.Y), dlt(R.p.M, b.M)));
    }
  }
  return { st, ans: `Y = ${fp((R.R1 || a).Y)}, e = ${fp((R.R1 || a).e)}` };
}
export function sAdas(R) {
  const L = T(),
    a = R.R0,
    st = [L.a_ad(fp(R.M), fp(R.V)), L.a_as(fp(R.Yb), fp(R.al), fp(R.Pe)), L.a_eq(fp(a.P), fp(a.Y))];
  if (R.R1) {
    st.push(L.a_sr(dlt(a.P, R.R1.P), dlt(a.Y, R.R1.Y)));
    st.push(L.a_lr(fp(R.LR.P), fp(R.Yb)));
  }
  return { st, ans: `P = ${fp((R.R1 || a).P)}, Y = ${fp((R.R1 || a).Y)}` };
}
export function sPhil(R) {
  const L = T(),
    st = [L.p_eq, L.p_res(pc(R.pe), fp(R.be), pc(R.u), pc(R.un), pc(R.v), pc(R.pi))];
  if (isFinite(R.sr)) st.push(L.p_sr(fp(R.sr)));
  return { st, ans: `π = ${pc(R.pi)}` };
}
export const SOLVE = {
  gdp: sGdp,
  unemp: sUnemp,
  natinc: sNat,
  money: sMoney,
  open: sOpen,
  solow: sSolow,
  cross: sCross,
  islm: sIslm,
  mf: sMF,
  adas: sAdas,
  phil: sPhil,
};
