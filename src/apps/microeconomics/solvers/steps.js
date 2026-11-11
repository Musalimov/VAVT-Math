import { E } from './compute.js';
import { hhi, nper, npv, pmt } from './model.js';
import { T } from '../content/tx.js';
import { $ } from '../../../shared/dom.js';
import { lang } from '../../../shared/i18n.js';
import { fN } from '../../../shared/format.js';

export const fp = (v) => fN(v, 4);
export const lineT = (L) =>
  L.kind === 'lin'
    ? `P = ${fp(L.a)} ${L.b < 0 ? '−' : '+'} ${fp(Math.abs(L.b))}q`
    : L.kind === 'vert'
      ? `q = ${fp(L.q0)}`
      : `P = ${fp(L.P0)}`;
export function solveSD(R) {
  const L = T(),
    st = [];
  if (R.E0) st.push(L.m_shift(fp(R.shD || 0), fp(R.shS || 0), fp(R.E0.q), fp(R.E0.P)));
  st.push(L.m_lines(lineT(R.D), lineT(R.S)));
  st.push(L.m_eq(fp(R.E.q), fp(R.E.P)));
  st.push(L.m_cs(fp(R.CS)));
  st.push(L.m_ps(fp(R.PS)));
  if (R.iv === 'tax' || R.iv === 'sub') {
    const t = R.v,
      tax = R.iv === 'tax';
    st.push(tax ? L.m_tax(fp(t), lineT(R.S2)) : L.m_sub(fp(t), lineT(R.S2)));
    if (R.gone) {
      st.push(L.m_gone);
      st.push(L.m_dwl(fp(R.DWL)));
      return { st, ans: `q = 0, DWL = ${fp(R.DWL)}` };
    }
    st.push(L.m_taxEq(fp(R.q2), fp(R.Pb), fp(R.Ps)));
    st.push(tax ? L.m_rev(fp(R.rev)) : L.m_cost(fp(-R.rev)));
    st.push(
      L.m_inc(
        fp(Math.abs(R.Pb - R.E.P)),
        fp(Math.abs(R.E.P - R.Ps)),
        fN(R.shareB * 100, 1),
        fN(R.shareS * 100, 1)
      )
    );
    st.push(L.m_dwl(fp(R.DWL)));
    return {
      st,
      ans: `q = ${fp(R.q2)}, P_${lang() === 'ru' ? 'пок' : 'b'} = ${fp(R.Pb)}, P_${lang() === 'ru' ? 'прод' : 's'} = ${fp(R.Ps)}`,
    };
  }
  if (R.iv === 'ceil' || R.iv === 'floor') {
    if (!R.bind) {
      st.push(R.iv === 'ceil' ? L.m_noBindC(fp(R.v), fp(R.E.P)) : L.m_noBindF(fp(R.v), fp(R.E.P)));
      return { st, ans: `q* = ${fp(R.E.q)}, P* = ${fp(R.E.P)}` };
    }
    st.push(L.m_qdqs(fp(R.P2), fp(R.qd), fp(R.qs)));
    st.push(R.iv === 'ceil' ? L.m_short(fp(R.gap)) : L.m_surp(fp(R.gap)));
    st.push(L.m_after(fp(R.q2), fp(R.CS2), fp(R.PS2)));
    st.push(L.m_dwl(fp(R.DWL)));
    return {
      st,
      ans:
        R.iv === 'ceil'
          ? `${lang() === 'ru' ? 'дефицит' : 'shortage'} ${fp(R.gap)}`
          : `${lang() === 'ru' ? 'избыток' : 'surplus'} ${fp(R.gap)}`,
    };
  }
  if (R.iv === 'quota') {
    if (!R.bind) {
      st.push(L.m_noBindQ(fp(R.v), fp(R.E.q)));
      return { st, ans: `q* = ${fp(R.E.q)}` };
    }
    st.push(L.m_quota(fp(R.q2), fp(R.Pb), fp(R.Ps), fp(R.rent)));
    st.push(L.m_dwl(fp(R.DWL)));
    return { st, ans: `P = ${fp(R.Pb)}, ${L.v.rent} ${fp(R.rent)}` };
  }
  return { st, ans: `q* = ${fp(R.E.q)}, P* = ${fp(R.E.P)}` };
}
export function solveEl(R) {
  const L = T(),
    st = [];
  if (R.em === 'pts') {
    st.push(L.e_arcF(L.ek[R.ek]));
    st.push(
      `E = ((${fp(R.q2)} − ${fp(R.q1)})/${fp((R.q1 + R.q2) / 2)}) / ((${fp(R.x2)} − ${fp(R.x1)})/${fp((R.x1 + R.x2) / 2)}) = ${fN(R.E, 4)}`
    );
    st.push(L.e_int[R.ek](R.E));
    return { st, ans: `E = ${fN(R.E, 4)}` };
  }
  st.push(L.e_line(lineT(R.D), fp(-1 / R.b)));
  if (R.em === 'pt') {
    st.push(L.e_pt(fp(R.P), fp(R.q), fN(R.E, 4)));
    st.push(L.e_cls(R.E));
  } else if (R.em === 'arc') {
    st.push(L.e_two(fp(R.p1), fp(R.q1), fp(R.p2), fp(R.q2)));
    st.push(
      `E = ((${fp(R.q2)} − ${fp(R.q1)})/${fp((R.q1 + R.q2) / 2)}) / ((${fp(R.p2)} − ${fp(R.p1)})/${fp((R.p1 + R.p2) / 2)}) = ${fN(R.Earc, 4)}`
    );
    st.push(L.e_cls(R.Earc));
    st.push(L.e_tr(fp(R.TR1), fp(R.TR2)));
  } else {
    st.push(L.e_find(fN(R.Ev, 4), fp(R.P), fp(R.q)));
  }
  st.push(L.e_mid(fp(R.Pmid), fp(R.qmid), fp(R.TRmax)));
  return {
    st,
    ans: R.em === 'find' ? `P = ${fp(R.P)}, q = ${fp(R.q)}` : `E = ${fN(R.em === 'arc' ? R.Earc : R.E, 4)}`,
  };
}
export function solveCons(R) {
  const L = T(),
    st = [],
    A = R.A;
  st.push(L.c_U[R.t](fp(R.al), fp(R.be)));
  st.push(L.c_bud(fp(R.px), fp(R.py), fp(R.I)));
  st.push(L.c_opt[R.t](fp(R.al), fp(R.be), fp(R.px), fp(R.py)));
  st.push(L.c_res(fp(A.x), fp(A.y), fp(A.U)) + (A.tie ? ' ' + L.c_tie : ''));
  if (isFinite(R.MRS) && R.t === 'cd') st.push(L.c_mrs(fp(R.MRS), fp(R.px / R.py)));
  if (R.px2) {
    st.push(L.c_new(fp(R.px2), fp(R.B.x), fp(R.B.y)));
    st.push(L.c_hicks(fp(R.H.x), fp(R.H.y), fp(R.H.I)));
    st.push(L.c_effH(fp(R.subH), fp(R.incH), fp(R.B.x - R.A.x)));
    st.push(L.c_sl(fp(R.Is), fp(R.Sl.x), fp(R.subS), fp(R.incS)));
    return {
      st,
      ans: `Δx = ${fp(R.B.x - R.A.x)} = ${fp(R.subH)} ${R.incH < 0 ? '−' : '+'} ${fp(Math.abs(R.incH))}`,
    };
  }
  return { st, ans: `(x; y) = (${fp(A.x)}; ${fp(A.y)})` };
}
export function solveCost(R) {
  const L = T(),
    st = [],
    C = R.C;
  st.push(L.k_def(fp(R.FC)));
  st.push(L.k_avc(fp(R.mAVC.q), fp(R.mAVC.v)) + (R.edgeAVC ? ' ' + L.k_edge : ''));
  st.push(L.k_ac(fp(R.mAC.q), fp(R.mAC.v)) + (R.edgeAC ? ' ' + L.k_edge : ''));
  st.push(L.k_cross);
  const pts = [1, 2, 5].map((k) => (R.qmax * k) / 10);
  st.push(
    `<div class="tw"><table class="tab"><tr><th>q</th><th>TC</th><th>VC</th><th>AC</th><th>AVC</th><th>MC</th></tr>${[
      ...pts,
      R.mAVC.q,
      R.mAC.q,
    ]
      .sort((a, b) => a - b)
      .map(
        (q) =>
          `<tr><td>${fN(q, 3)}</td><td>${fN(C.TC(q), 3)}</td><td>${fN(C.VC(q), 3)}</td><td>${fN(C.AC(q), 3)}</td><td>${fN(C.AVC(q), 3)}</td><td>${fN(C.MC(q), 3)}</td></tr>`
      )
      .join('')}</table></div>`
  );
  return { st, ans: `min AVC = ${fp(R.mAVC.v)}, min AC = ${fp(R.mAC.v)}` };
}
export function solveComp(R) {
  const L = T(),
    st = [L.p_rule];
  if (R.shut) {
    st.push(L.p_shut(fp(R.P), fp(R.minAVC.v)));
    st.push(L.p_loss(fp(R.FC)));
  } else {
    st.push(R.cap ? L.p_cap(fp(R.P), fp(R.q)) : L.p_q(fp(R.P), fp(R.q)));
    st.push(L.p_pr(fp(R.TR), fp(R.TC), fp(R.profit)));
    st.push(R.profit >= 0 ? L.p_pos : L.p_neg(fp(R.FC)));
  }
  st.push(L.p_pts(fp(R.minAVC.v), fp(R.minAC.v)));
  if (R.beQ.length) st.push(L.p_be(R.beQ.map((q) => fp(q)).join(', ')));
  return {
    st,
    ans: R.shut ? `q = 0, ${L.v.profit} −${fp(R.FC)}` : `q* = ${fp(R.q)}, ${L.v.profit} ${fp(R.profit)}`,
  };
}
export function solveMono(R) {
  const L = T(),
    st = [];
  if (R.dm === 'disc') {
    st.push(L.d_rule(fp(R.c)));
    st.push(L.d_m(1, lineT(R.D), fp(R.r1.q), fp(R.r1.P), fp(R.pr1)));
    st.push(L.d_m(2, lineT(R.D2), fp(R.r2.q), fp(R.r2.P), fp(R.pr2)));
    st.push(L.d_tot(fp(R.pr1 + R.pr2)));
    if (R.naive) st.push(L.d_naive(fp(R.naive.P), fp(R.naive.Q), fp(R.naive.pr)));
    st.push(L.d_uni(fp(R.Pu), fp(R.Qu), fp(R.pru)));
    if (R.naive && R.pru > R.naive.pr + 1e-6) st.push(L.d_excl);
    return { st, ans: `P₁ = ${fp(R.r1.P)}, P₂ = ${fp(R.r2.P)}` };
  }
  if (R.none) {
    st.push(L.n_none(fp(R.MCq), fp(R.D.a)));
    return { st, ans: 'q = 0' };
  }
  st.push(L.n_mr(lineT(R.D), fp(R.D.a), fp(2 * R.D.b)));
  st.push(L.n_q(fp(R.q), fp(R.MCq)));
  st.push(L.n_P(fp(R.P), fp(R.profit), fp(R.AC)));
  st.push(L.n_lern(fN(R.lerner, 4), fN(R.E, 4), fN(-1 / R.E, 4)));
  if (isFinite(R.qc)) st.push(L.n_dwl(fp(R.qc), fp(R.Pc), fp(R.DWL)));
  if (R.profit < 0) st.push(R.shutdown ? L.n_shut : L.n_stay(fp(R.FC)));
  return { st, ans: `q = ${fp(R.q)}, P = ${fp(R.P)}, ${L.v.profit} ${fp(R.profit)}` };
}
export const SOLVE = {
  sd: solveSD,
  el: solveEl,
  cons: solveCons,
  cost: solveCost,
  comp: solveComp,
  mono: solveMono,
};
export function solvePPF(R) {
  const L = T(),
    st = [L.f_tab];
  st.push(
    `<div class="tw"><table class="tab"><tr><th></th><th>Δx</th><th>Δy</th><th>${L.f_oc}</th></tr>${R.oc.map((o, i) => `<tr><td>${String.fromCharCode(65 + o.from)}→${String.fromCharCode(65 + o.to)}</td><td>${fp(o.dx)}</td><td>${fp(o.dy)}</td><td>${fp(o.oc)}</td></tr>`).join('')}</table></div>`
  );
  st.push(R.incr ? L.f_inc : L.f_noinc);
  if (R.where) st.push(L.f_pt[R.where](fp(R.yb == null ? NaN : R.yb)));
  return { st, ans: R.where ? L.f_ans[R.where] : R.incr ? L.f_incA : L.f_noincA };
}
export function solveProd(R) {
  const L = T(),
    st = [];
  if (R.pm === 'short') {
    st.push(L.r_sr(fp(R.K)));
    st.push(R.apMax < R.Lmax * 0.01 ? L.r_apDec : L.r_ap(fp(R.apMax), fp(R.apMaxV)));
    if (R.mpZero != null) st.push(L.r_mp0(fp(R.mpZero), fp(R.TP(R.mpZero))));
    st.push(L.r_dim);
    const Ls = [1, 2, 4, 8].map((k) => (R.Lmax * k) / 16);
    st.push(
      `<div class="tw"><table class="tab"><tr><th>L</th><th>TP</th><th>AP</th><th>MP</th></tr>${Ls.map((x) => `<tr><td>${fN(x, 3)}</td><td>${fN(R.TP(x), 3)}</td><td>${fN(R.AP(x), 3)}</td><td>${fN(R.MP(x), 3)}</td></tr>`).join('')}</table></div>`
    );
    return {
      st,
      ans:
        R.mpZero != null
          ? `MP = 0: L = ${fp(R.mpZero)}`
          : R.apMax < R.Lmax * 0.01
            ? `AP, MP ${lang() === 'ru' ? 'убывают' : 'decrease'}`
            : `max AP: L = ${fp(R.apMax)}`,
    };
  }
  if (R.pm === 'long') {
    st.push(L.r_iso(fp(R.w), fp(R.r), fp(R.C)));
    st.push(L.r_rule);
    st.push(L.r_opt(fp(R.L), fp(R.K), fp(R.q), fp(R.MRTS), fp(R.w / R.r)));
    st.push(L.r_rts(fN(R.rts, 4)));
    return { st, ans: `L = ${fp(R.L)}, K = ${fp(R.K)}, q = ${fp(R.q)}` };
  }
  st.push(L.r_min(fp(R.q0), fp(R.w), fp(R.r)));
  st.push(L.r_minR(fp(R.L), fp(R.K), fp(R.C)));
  return { st, ans: `TC = ${fp(R.C)}` };
}
export function solveMC(R) {
  const L = T(),
    st = [L.mc_rule];
  st.push(L.n_q(fp(R.q), fp(R.C.MC(R.q))));
  st.push(L.mc_p(fp(R.P), fp(R.AC), fp(R.profit)));
  st.push(R.lr ? L.mc_lr : R.profit > 0 ? L.mc_in : L.mc_out);
  st.push(
    R.excess >= 0 ? L.mc_ex(fp(R.mAC.q), fp(R.mAC.v), fp(R.excess)) : L.mc_over(fp(R.mAC.q), fp(R.mAC.v))
  );
  return { st, ans: `q = ${fp(R.q)}, P = ${fp(R.P)}, ${L.v.excess} ${fp(R.excess)}` };
}
export function solveOlig(R) {
  const L = T(),
    st = [];
  if (R.om === 'hhi') {
    st.push(L.o_hhi(R.s.map((v) => fp(v)).join('² + ') + '²', fp(R.H)));
    st.push(R.H < 1000 ? L.o_h1 : R.H < 1800 ? L.o_h2 : L.o_h3);
    return { st, ans: `HHI = ${fp(R.H)}` };
  }
  st.push(L.o_set(fp(R.a), fp(R.b), fp(R.c1), fp(R.d1), fp(R.c2), fp(R.d2)));
  const z = R.sel,
    show = (k, o) =>
      `${L.om[k]}: q₁ = ${fp(o.q[0])}, q₂ = ${fp(o.q[1])}, P = ${fp(o.P)}, π₁ = ${fp(o.pi[0])}, π₂ = ${fp(o.pi[1])}`;
  st.push(L.o_br);
  if (R.om === 'stack') st.push(L.o_st + (R.stack.deter ? ' ' + L.o_det : ''));
  if (R.om === 'cart') st.push(L.o_ca + (R.d1 === 0 && R.d2 === 0 && R.c1 === R.c2 ? ' ' + L.o_tie : ''));
  st.push(show(R.om, z));
  st.push(
    L.o_cmp +
      `<div class="tw"><table class="tab"><tr><th></th><th>q₁</th><th>q₂</th><th>P</th><th>π₁ + π₂</th></tr>${['cour', 'stack', 'cart'].map((k) => `<tr><td style="text-align:left">${L.om[k]}</td><td>${fN(R[k].q[0], 3)}</td><td>${fN(R[k].q[1], 3)}</td><td>${fN(R[k].P, 3)}</td><td>${fN(R[k].pi[0] + R[k].pi[1], 3)}</td></tr>`).join('')}</table></div>`
  );
  if (R.om === 'cart') st.push(L.o_cheat(fp(R.br1(R.cart.q[1])), fp(R.cart.q[0])));
  return { st, ans: `q₁ = ${fp(z.q[0])}, q₂ = ${fp(z.q[1])}, P = ${fp(z.P)}` };
}
export function solveLabor(R) {
  const L = T(),
    st = [];
  if (R.lm === 'firm') {
    st.push(L.w_rule);
    if (R.cap) st.push(L.w_cap(fp(R.w)));
    st.push(L.w_res(fp(R.p), fp(R.w), fp(R.L), fp(R.q)));
    return { st, ans: `L = ${fp(R.L)}` };
  }
  if (R.lm === 'mkt') {
    st.push(L.w_eq(fp(R.E.q), fp(R.E.P)));
    st.push(L.w_rent(fp(R.rent), fp(R.wb)));
    return { st, ans: `L = ${fp(R.E.q)}, w = ${fp(R.E.P)}, ${L.v.rent2} ${fp(R.rent)}` };
  }
  st.push(L.w_mon(lineT(R.Sl)));
  st.push(L.w_monR(fp(R.L), fp(R.w), fp(R.mrp), fp(R.exp)));
  st.push(L.w_comp(fp(R.comp.q), fp(R.comp.P)));
  if (R.mw)
    st.push(
      R.mw.nobind
        ? L.w_minNo(fp(R.mw.w), fp(R.w))
        : R.mw.unemp > 1e-9
          ? L.w_minU(fp(R.mw.w), fp(R.mw.L), fp(R.mw.unemp))
          : L.w_min(fp(R.mw.w), fp(R.mw.L))
    );
  return {
    st,
    ans: R.mw ? `L = ${fp(R.mw.L)} (${L.v.minw} ${fp(R.mw.w)})` : `L = ${fp(R.L)}, w = ${fp(R.w)}`,
  };
}
export function solveCap(R) {
  const L = T(),
    st = [];
  const i = fN(R.i * 100, 3) + '%';
  const k = R.km;
  if (k === 'fv') {
    st.push(L.k_fv(fp(R.pm), i, fp(R.n), fp(R.v)));
  } else if (k === 'pv') {
    st.push(L.k_pv(fp(R.pm), i, fp(R.n), fp(R.v)));
  } else if (k === 'pmt') {
    st.push(L.k_pmt(fp(R.pv), i, fp(R.n), fp(R.v)));
  } else if (k === 'nper') {
    st.push(isFinite(R.v) ? L.k_np(fp(R.pv), i, fp(R.pm), fp(R.v)) : L.k_npInf(fp(R.pm), fp(R.pv * R.i)));
  } else if (k === 'npv') {
    st.push(L.k_npv(R.fl.map(fp).join('; '), i, fp(R.v)));
    st.push(R.irr != null ? L.k_irr(fN(R.irr * 100, 3)) : L.k_noirr);
    st.push(R.v >= 0 ? L.k_yes : L.k_no);
  } else {
    st.push(L.k_land(fp(R.Ts), fp(R.R), i, fp(R.v)));
  }
  return {
    st,
    ans:
      k === 'npv'
        ? `NPV = ${fp(R.v)}`
        : k === 'land'
          ? `R = ${fp(R.R)}, ${L.v.price} ${fp(R.v)}`
          : `${fp(R.v)}`,
  };
}
export function solveExt(R) {
  const L = T(),
    st = [];
  st.push(L.x_m(fp(R.m.q), fp(R.m.P)));
  st.push(L.x_s(fp(R.e), lineT(R.Ss), fp(R.s.q), fp(R.s.P)));
  st.push(L.x_d(fp(R.damage), fp(R.DWL)));
  st.push(L.x_pig(fp(R.e)));
  return { st, ans: `q: ${fp(R.m.q)} → ${fp(R.s.q)}, DWL = ${fp(R.DWL)}` };
}
export function solvePG(R) {
  const L = T(),
    st = [L.g_rule];
  st.push(L.g_sum(R.list.map((o) => `${o.n}·(${lineT(o.L)})`).join(' + ')));
  st.push(L.g_opt(lineT(R.MC), fp(R.qPub)));
  if (R.PPriv != null) st.push(L.g_priv(fp(R.PPriv), fp(R.sumQ(R.PPriv))));
  st.push(L.g_free);
  return { st, ans: `q* = ${fp(R.qPub)}` };
}
// часть 2 тренажёра дополняет общие таблицы
Object.assign(SOLVE, {
  ppf: solvePPF,
  prod: solveProd,
  mc: solveMC,
  olig: solveOlig,
  labor: solveLabor,
  cap: solveCap,
  ext: solveExt,
  pg: solvePG,
});
