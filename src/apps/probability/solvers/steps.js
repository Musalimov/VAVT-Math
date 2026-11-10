import { T } from '../content/tx.js';
import { fQ } from './format.js';
import { dc, fNsci as fN } from '../../../shared/format.js';
import { lang } from '../../../shared/i18n.js';
import { Cnk, PhiN, bStr, binom, gcdB, r2 } from './theory.js';
import { CL } from './notation.js';
import { nI } from './compute.js';
import { PRINT, hp } from '../../../math/expr/print.js';
export const SUB = '₀₁₂₃₄₅₆₇₈₉';
export const sb = (s) => String(s).replace(/\d/g, (d) => SUB[d]);
export const mtab = (rows) =>
  `<div class="tw"><table class="tab">${rows.map((r, i) => `<tr>${r.map((c, j) => (j === 0 ? `<th>${c}</th>` : `<td>${c}</td>`)).join('')}</tr>`).join('')}</table></div>`;
export function evT(R) {
  const n = sb(R.n);
  if (R.ev === 'eq') return `P${n}(${R.k1})`;
  if (R.ev === 'one') return `P${n}(k ⩾ 1)`;
  if (R.ev === 'mode') return 'k*';
  return `P${n}(${R.k1} ⩽ k ⩽ ${R.k2})`;
}
export function solveBern(R) {
  const L = T(),
    st = [];
  st.push(L.s_bern(fQ(R.p), fQ(R.q)));
  st.push(L.s_par(R.n, fN(R.np), fN(R.npq)));
  if (R.ev === 'mode') {
    st.push(L.s_mode(fN(R.lo), fN(R.hi)));
    st.push(L.s_mode2(R.kstar.join(lang() === 'ru' ? ' и ' : ' and ')));
    return { st, ans: `k* = ${R.kstar.join(lang() === 'ru' ? ' или ' : ' or ')}` };
  }
  st.push(
    R.auto ? (R.meth === 'bern' ? L.s_mB : R.meth === 'pois' ? L.s_mP(fN(R.np)) : L.s_mL(fN(R.npq))) : L.s_mU
  );
  const ap = R.meth !== 'bern';
  let main = '';
  if (R.meth === 'bern') {
    st.push(L.s_fB);
    if (R.ev === 'one') {
      st.push(
        `${L.s_compl} P${sb(R.n)}(k ⩾ 1) = 1 − P${sb(R.n)}(0) = 1 − q<sup>${R.n}</sup> = 1 − ${fN(R.q)}<sup>${R.n}</sup> = ${fQ(R.exact, 5)}`
      );
    } else if (R.k1 === R.k2) {
      const k = R.k1;
      st.push(
        `P${sb(R.n)}(${k}) = C${sb(R.n)}<sup>${k}</sup>·${fN(R.p)}<sup>${k}</sup>·${fN(R.q)}<sup>${R.n - k}</sup> = ${R.n <= 60 ? Cnk(R.n, k) + '·' + fN(Math.pow(R.p, k), 6) + '·' + fN(Math.pow(R.q, R.n - k), 6) + ' = ' : ''}${fQ(R.exact, 5)}`
      );
    } else {
      const terms = R.k2 - R.k1 + 1;
      st.push(
        `${L.s_sum} ${evT(R)} = ${terms <= 7 ? Array.from({ length: terms }, (_, i) => fN(binom(R.n, R.p, R.k1 + i), 5)).join(' + ') + ' = ' : `Σ (k = ${R.k1}…${R.k2}) = `}${fQ(R.exact, 5)}`
      );
    }
    main = `${evT(R)} = ${fQ(R.exact, 5)}`;
  } else if (R.meth === 'pois') {
    const l = R.np;
    st.push(`${L.s_fP} λ = np = ${fN(l)}.`);
    if (R.ev === 'one')
      st.push(`${L.s_compl} P ≈ 1 − e<sup>−λ</sup> = 1 − e<sup>−${fN(l)}</sup> = ${fN(R.approx, 5)}`);
    else {
      const terms = R.k2 - R.k1 + 1;
      st.push(
        `${evT(R)} ≈ ${terms <= 6 ? Array.from({ length: terms }, (_, i) => `${fN(l)}<sup>${R.k1 + i}</sup>e<sup>−${fN(l)}</sup>/${R.k1 + i}!`).join(' + ') + ' = ' : ''}${fN(R.approx, 5)}`
      );
    }
    main = `${evT(R)} ≈ ${fN(R.approx, 4)}`;
  } else {
    const d = R.detail;
    if (R.ev === 'eq') {
      st.push(L.s_fL);
      st.push(
        `√(npq) = ${fN(R.sq, 3)}; x = (${R.k1} − ${fN(R.np)})/${fN(R.sq, 3)} = ${fN(d.x, 3)} ≈ ${fN(d.xr, 2)}; φ(${fN(d.xr, 2)}) = ${fN(d.ph, 4)}; ${evT(R)} ≈ ${fN(d.ph, 4)}/${fN(R.sq, 3)} = ${fN(R.approx, 4)}`
      );
    } else {
      st.push(CL() ? L.c_fI : L.s_fI);
      const a = R.ev === 'one' ? 1 : R.k1;
      st.push(
        `√(npq) = ${fN(R.sq, 3)}; x₁ = (${a} − ${fN(R.np)})/${fN(R.sq, 3)} ≈ ${fN(d.x1r, 2)}; x₂ = (${R.k2} − ${fN(R.np)})/${fN(R.sq, 3)} ≈ ${fN(d.x2r, 2)}`
      );
      st.push(
        `${evT(R)} ≈ ${PhiS(d.x2r)} − ${PhiS(d.x1r)} = ${fN(PhiV(d.x2r), 4)} − ${nP(PhiV(d.x1r))} = ${fN(R.approx, 4)}`
      );
    }
    st.push(L.s_tab);
    main = `${evT(R)} ≈ ${fN(R.approx, 4)}`;
  }
  if (ap) st.push(L.s_exact(fQ(R.exact, 5)));
  return { st, ans: main, sub: ap ? `${L.ex}: ${fQ(R.exact, 5)}` : '' };
}
export function serTab(x, p, nm = 'X') {
  return mtab([
    [nm, ...x.map((v) => fN(v, 4))],
    ['p', ...p.map((v) => fQ(v, 4).replace(/ ≈ .*/, ''))],
  ]);
}
export function sumRow(x, p, f) {
  return x.length <= 8 ? x.map((v, i) => `${fN(f(v), 3)}·${fN(p[i], 4)}`).join(' + ') + ' = ' : '';
}
export function zLin(a, b, c) {
  const t = (v, n, first) =>
    v === 0
      ? ''
      : `${first ? (v < 0 ? '−' : '') : v < 0 ? ' − ' : ' + '}${Math.abs(v) === 1 && n ? '' : fN(Math.abs(v))}${n}`;
  let s = t(a, 'X', true);
  s += t(b, 'Y', !s);
  if (c) s += t(c, '', !s);
  return s || '0';
}
export function solveDsv(R) {
  const L = T();
  if (R.mode === 'prop') {
    const st = [],
      z = zLin(R.a, R.b, R.c);
    st.push(
      L.p_M(z) +
        ` = ${fN(R.a)}·${fN(R.mx)} ${R.b < 0 ? '−' : '+'} ${fN(Math.abs(R.b))}·${R.my < 0 ? '(' + fN(R.my) + ')' : fN(R.my)} ${R.c < 0 ? '−' : '+'} ${fN(Math.abs(R.c))} = ${fQ(R.MZ)}`
    );
    if (R.rl === 'r')
      st.push(`${L.p_cov} cov = r·σₓσᵧ = ${fN(nI(R.rv))}·√${fN(R.dx)}·√${fN(R.dy)} = ${fQ(R.cov)}`);
    else if (R.rl === 'ind') st.push(L.p_ind);
    st.push(
      L.p_D(z) +
        ` = ${fN(R.a * R.a)}·${fN(R.dx)} + ${fN(R.b * R.b)}·${fN(R.dy)}${R.cov ? ` ${2 * R.a * R.b * R.cov < 0 ? '−' : '+'} ${fN(Math.abs(2 * R.a * R.b))}·${fN(Math.abs(R.cov), 4)}` : ''} = ${fQ(R.DZ)}`
    );
    st.push(`σ(Z) = √D(Z) = ${fN(R.sZ, 4)}`);
    return { st, ans: `M(Z) = ${fQ(R.MZ)}, D(Z) = ${fQ(R.DZ)}` };
  }
  const st = [],
    s = R.st;
  if (R.gen) st.push(L.s_gen[R.mode]);
  if (R.unk) st.push(L.s_unk(fN(R.unk.x), fN(R.unk.p, 4)));
  st.push(serTab(R.x, R.p));
  st.push(L.s_sumP(fN(R.sum, 6)));
  st.push(`${L.s_M} ${sumRow(R.x, R.p, (v) => v)}${fQ(s.M)}`);
  st.push(`${L.s_M2} ${sumRow(R.x, R.p, (v) => v * v)}${fQ(s.M2)}`);
  st.push(`${L.s_D} ${fN(s.M2, 4)} − ${s.M < 0 ? '(' + fN(s.M, 4) + ')' : fN(s.M, 4)}² = ${fQ(s.D)}`);
  st.push(`${L.s_s} √${fN(s.D, 4)} = ${fN(s.s, 4)}`);
  st.push(L.s_mod(s.modes.map((v) => fN(v)).join(', ')));
  if (R.x.length <= 10) {
    let acc = 0;
    const lines = [`0, x ⩽ ${fN(R.x[0])}`];
    R.x.forEach((v, i) => {
      acc += R.p[i];
      lines.push(i < R.x.length - 1 ? `${fN(acc, 4)}, ${fN(v)} < x ⩽ ${fN(R.x[i + 1])}` : `1, x > ${fN(v)}`);
    });
    st.push(`${L.s_F}<div class="mx2">F(x) = { ${lines.join('<br>')} }</div>`);
  }
  if (!(R.a === 1 && R.b === 0))
    st.push(
      `${L.s_Z(fN(R.a), (R.b < 0 ? '− ' : '+ ') + fN(Math.abs(R.b)))} M(Z) = ${fN(R.a)}·${fN(s.M, 4)} ${R.b < 0 ? '−' : '+'} ${fN(Math.abs(R.b))} = ${fQ(R.MZ)}; D(Z) = ${fN(R.a * R.a)}·${fN(s.D, 4)} = ${fQ(R.DZ)}`
    );
  return { st, ans: `M(X) = ${fQ(s.M)}, D(X) = ${fQ(s.D)}, σ(X) = ${fN(s.s, 4)}` };
}
export function solveDvu(R) {
  const L = T(),
    st = [],
    J = R.J,
    s = R.st;
  const rows = [
    ['X\\Y', ...J.y.map((v) => fN(v)), 'pₓ'],
    ...J.x.map((v, i) => [fN(v), ...J.P[i].map((q) => fN(q, 4)), `<b>${fN(s.px[i], 4)}</b>`]),
    ['pᵧ', ...s.py.map((q) => `<b>${fN(q, 4)}</b>`), '1'],
  ];
  if (J.ind) st.push(L.j_ind);
  st.push(`${J.ind ? '' : L.s_marg}${mtab(rows)}`);
  st.push(`M(X) = ${fQ(s.sx.M)}, D(X) = ${fQ(s.sx.D)}; M(Y) = ${fQ(s.sy.M)}, D(Y) = ${fQ(s.sy.D)}`);
  st.push(`${L.s_Mxy} ${fQ(s.Mxy)}`);
  st.push(`${L.s_cov} ${fN(s.Mxy, 4)} − ${fN(s.sx.M, 4)}·${fN(s.sy.M, 4)} = ${fQ(s.cov)}`);
  if (isFinite(s.r)) st.push(`${L.s_r} ${fN(s.cov, 4)}/(${fN(s.sx.s, 4)}·${fN(s.sy.s, 4)}) = ${fN(s.r, 4)}`);
  st.push(
    s.indep
      ? L.s_ind
      : L.s_dep(
          fN(J.x[R.dep.i]),
          fN(J.y[R.dep.j]),
          fN(J.P[R.dep.i][R.dep.j], 4),
          fN(s.px[R.dep.i] * s.py[R.dep.j], 4)
        )
  );
  if (R.cond) {
    const c = R.cond,
      w = c.given === 'X' ? 'Y' : 'X';
    st.push(
      `${L.s_cond(w, `${c.given} = ${fN(c.val)}`, fN(c.pr, 4))}${serTab(c.vals, c.ps, w)}${L.s_condM} M(${w} | ${c.given} = ${fN(c.val)}) = ${fQ(c.M)}`
    );
  }
  const zs_ =
    R.zt === 'prod'
      ? `XY${R.zc ? (R.zc < 0 ? ' − ' : ' + ') + fN(Math.abs(R.zc)) : ''}`
      : zLin(R.a, R.b, R.zc);
  st.push(`${L.s_Zj} Z = ${zs_}:${serTab(R.Z.x, R.Z.p, 'Z')}M(Z) = ${fQ(R.zs.M)}, D(Z) = ${fQ(R.zs.D)}`);
  if (R.zt !== 'prod')
    st.push(
      `${L.s_ZjD} ${fN(R.a * R.a)}·${fN(s.sx.D, 4)} + ${fN(R.b * R.b)}·${fN(s.sy.D, 4)} ${2 * R.a * R.b * s.cov < 0 ? '−' : '+'} ${fN(Math.abs(2 * R.a * R.b), 4)}·${fN(Math.abs(s.cov), 4)} = ${fN(R.DZchk, 4)}`
    );
  return {
    st,
    ans: J.ind
      ? `M(Z) = ${fQ(R.zs.M)}, D(Z) = ${fQ(R.zs.D)}`
      : `cov = ${fQ(s.cov)}, r = ${fN(s.r, 4)}${R.cond ? `; M(${R.cond.given === 'X' ? 'Y' : 'X'} | ${R.cond.given} = ${fN(R.cond.val)}) = ${fQ(R.cond.M)}` : ''}`,
  };
}
export function exH(e) {
  PRINT.v = 'x';
  return hp(e, 0);
}
export function solveNsv(R, I) {
  const L = T(),
    st = [];
  if (R.kind === 'uni')
    st.push(
      L.s_uni(fN(R.a), fN(R.b)) + ` F(x) = (x − ${fN(R.a)})/${fN(R.b - R.a)} на [${fN(R.a)}; ${fN(R.b)}].`
    );
  else if (R.kind === 'exp') st.push(L.s_exp(fN(R.lam)));
  else if (R.kind === 'f') {
    if (R.C !== 1 || I.C) st.push(L.s_C(fQ(R.I0), fQ(R.C)));
    else st.push(L.s_norm);
    st.push(
      `f(x) = ${R.C !== 1 ? fQ(R.C).replace(/ ≈ .*/, '') + '·' : ''}(${exH(R.fexpr)}) на [${fN(R.a)}; ${fN(R.b)}], 0 вне отрезка.`
        .replace('на [', lang() === 'ru' ? 'на [' : 'on [')
        .replace(', 0 вне отрезка', lang() === 'ru' ? ', 0 вне отрезка' : ', 0 outside')
    );
    if (R.Fexpr)
      st.push(
        `${L.s_Ff} F(x) = ${R.C !== 1 ? fQ(R.C).replace(/ ≈ .*/, '') + '·' : ''}(${exH(R.Fexpr)}${R.Fa && Math.abs(R.Fa) > 1e-12 ? (R.Fa > 0 ? ' − ' + fN(R.Fa, 4) : ' + ' + fN(-R.Fa, 4)) : ''}) ${lang() === 'ru' ? 'при' : 'for'} ${fN(R.a)} ⩽ x ⩽ ${fN(R.b)}.`
      );
  } else {
    st.push(
      `F(x) = ${exH(R.Fexpr)} ${lang() === 'ru' ? 'при' : 'for'} ${fN(R.a)} ⩽ x ⩽ ${fN(R.b)}; 0 ${lang() === 'ru' ? 'левее, 1 правее' : 'to the left, 1 to the right'}.`
    );
    if (R.fexpr) st.push(`${L.s_fF} f(x) = ${exH(R.fexpr)}`);
  }
  st.push(`${L.s_Mi} ${fQ(R.M)}`);
  st.push(`${L.s_Di} ${fQ(R.M2)} − ${fN(R.M, 4)}² = ${fQ(R.D)}; σ = ${fN(R.s, 4)}`);
  if (R.Pab !== null) {
    const a = Math.min(R.al, R.be),
      b = Math.max(R.al, R.be);
    st.push(`${L.s_P} F(${fN(b)}) − F(${fN(a)}) = ${fN(R.F(b), 4)} − ${fN(R.F(a), 4)} = ${fQ(R.Pab)}`);
  }
  st.push(`${L.s_modN} x_mod ≈ ${fN(R.mode, 3)}`);
  st.push(`${L.s_med} x_med ≈ ${fN(R.med, 4)}`);
  if (R.qv !== null) st.push(`${L.s_qu(fN(R.ql))} x<sub>${fN(R.ql)}</sub> ≈ ${fN(R.qv, 4)}`);
  return { st, ans: `M(X) = ${fQ(R.M)}, D(X) = ${fQ(R.D)}${R.Pab !== null ? `; P = ${fQ(R.Pab)}` : ''}` };
}
export function solveNorm(R) {
  const L = T(),
    st = [],
    C = CL();
  const m = R.m,
    s = R.s,
    zt = (x) => `(${fN(x)} − ${fN(m)})/${fN(s)} = ${fN((x - m) / s, 3)}`,
    z2 = (v) => r2(v);
  if (R.find === 'm' || R.find === 's') {
    const pl = R.pl;
    st.push(
      R.q.endsWith('g')
        ? `P(X > ${fN(R.x1)}) = ${fN(R.pv)} ⇒ P(X < ${fN(R.x1)}) = 1 − ${fN(R.pv)} = ${fN(pl, 4)}.`
        : `P(X < ${fN(R.x1)}) = ${fN(pl, 4)}.`
    );
    if (C) st.push(L.c_inv(fN(pl, 4), fN(pl - 0.5, 4)));
    st.push(
      `${R.find === 'm' ? (C ? L.c_Nfm : L.s_Nfm) : C ? L.c_Nfs : L.s_Nfs} z = ${fN(R.z, 4)};` +
        (R.find === 'm'
          ? ` m = ${fN(R.x1)} − ${fN(s)}·(${fN(R.z, 4)}) = ${fN(m, 4)}`
          : ` σ = (${fN(R.x1)} − ${fN(m)})/(${fN(R.z, 4)}) = ${fN(s, 4)}`)
    );
    return { st, ans: R.find === 'm' ? `m ≈ ${fN(m, 3)}` : `σ ≈ ${fN(s, 3)}` };
  }
  st.push(C ? L.c_Nst(fN(m), fN(s)) : L.s_Nst(fN(m), fN(s)));
  if (R.q === 'rng') {
    st.push(
      `${C ? L.c_Nrng : L.s_Nrng} ${PhiS(z2(R.z2))} − ${PhiS(z2(R.z1))} = ${fN(PhiV(z2(R.z2)), 4)} − ${nP(PhiV(z2(R.z1)))} = ${fN(R.P, 4)}`
    );
    st.push(`x₂: ${zt(R.x2)}; x₁: ${zt(R.x1)}`);
  } else if (R.q === 'lt')
    st.push(
      C
        ? `${L.c_Nlt} 0,5 + ${PhiS(z2(R.z1))} = 0,5 + ${fN(PhiV(z2(R.z1)), 4)} = ${fN(R.P, 4)}`.replace(
            /0,5/g,
            dc('0.5')
          )
        : `${L.s_Nlt} Φ(${zt(R.x1)}) ≈ Φ(${fN(z2(R.z1), 2)}) = ${fN(R.P, 4)}`
    );
  else if (R.q === 'gt')
    st.push(
      C
        ? `${L.c_Ngt} 0.5 − ${PhiS(z2(R.z1))} = 0.5 − ${fN(PhiV(z2(R.z1)), 4)} = ${fN(R.P, 4)}`.replace(
            /0\.5/g,
            dc('0.5')
          )
        : `${L.s_Ngt} 1 − Φ(${fN(z2(R.z1), 2)}) = 1 − ${fN(PhiN(z2(R.z1)), 4)} = ${fN(R.P, 4)}`
    );
  else if (R.q === 'dev') {
    st.push(
      C
        ? `${L.c_Ndev} 2${PhiS(z2(R.z1))} = 2·${fN(PhiV(z2(R.z1)), 4)} = ${fN(R.P, 4)}`
        : `${L.s_Ndev} 2Φ(${fN(R.del)}/${fN(s)}) − 1 = 2Φ(${fN(z2(R.z1), 2)}) − 1 = ${fN(R.P, 4)}`
    );
    st.push(L.s_3s);
  } else if (R.q === 'qu') {
    st.push(
      C
        ? `${L.c_Nqu(fN(R.pv), fN(R.pv - 0.5, 4))} z = ${fN(R.z, 4)}; x<sub>${fN(R.pv)}</sub> = ${fN(m)} + ${fN(s)}·(${fN(R.z, 4)}) = ${fN(R.xq, 4)}`
        : `${L.s_Nqu} z<sub>${fN(R.pv)}</sub> = ${fN(R.z, 4)}; x<sub>${fN(R.pv)}</sub> = ${fN(m)} + ${fN(s)}·(${fN(R.z, 4)}) = ${fN(R.xq, 4)}`
    );
    return { st, ans: `x<sub>${fN(R.pv)}</sub> ≈ ${fN(R.xq, 3)}` };
  }
  if (Math.abs(R.P - R.Pe) > 5e-5) st.push(`${L.s_tab} ${L.ex}: ${fN(R.Pe, 5)}.`);
  return { st, ans: `P ≈ ${fN(R.P, 4)}` };
}
export const SOLVE = {
  comb: solveComb,
  clas: solveClas,
  ops: solveOps,
  bayes: solveBayes,
  bern: solveBern,
  dsv: solveDsv,
  dvu: solveDvu,
  nsv: solveNsv,
  norm: solveNorm,
};
export const nP = (v) => (v < 0 ? '(' + fN(v, 4) + ')' : fN(v, 4));
export const PhiS = (z) => (CL() ? `Φ₀(${fN(z, 2)})` : `Φ(${fN(z, 2)})`);
export const PhiV = (z) => (CL() ? PhiN(z) - 0.5 : PhiN(z));
export function fracB(num, den) {
  const g = gcdB(num, den) || 1n,
    a = num / g,
    b = den / g;
  const v = Number(num) / Number(den);
  return b === 1n ? bStr(a) : `${bStr(a)}/${bStr(b)} ≈ ${fN(v, 4)}`;
}
export function solveComb(R) {
  const L = T(),
    st = [],
    k = R.kind,
    n = R.n,
    kk = R.k;
  let f = '';
  if (k === 'perm') {
    st.push(L.c_perm);
    f = `P${sb(n)} = ${n}! = ${n <= 12 ? Array.from({ length: n }, (_, i) => i + 1).join('·') + ' = ' : ''}${bStr(R.val)}`;
  } else if (k === 'arr') {
    st.push(L.c_arr);
    f = `A${sb(n)}<sup>${kk}</sup> = ${n}!/(${n}−${kk})! = ${kk <= 10 ? Array.from({ length: kk }, (_, i) => n - i).join('·') + ' = ' : ''}${bStr(R.val)}`;
  } else if (k === 'comb') {
    st.push(L.c_comb);
    f = `C${sb(n)}<sup>${kk}</sup> = ${n}!/(${kk}!·${n - kk}!) = ${Math.min(kk, n - kk) <= 8 ? `(${Array.from({ length: Math.min(kk, n - kk) }, (_, i) => n - i).join('·')})/${Math.min(kk, n - kk)}! = ` : ''}${bStr(R.val)}`;
  } else if (k === 'arrRep') {
    st.push(L.c_arrR);
    f = `Ā${sb(n)}<sup>${kk}</sup> = n<sup>k</sup> = ${n}<sup>${kk}</sup> = ${bStr(R.val)}`;
  } else if (k === 'combRep') {
    st.push(L.c_combR);
    f = `C̄${sb(n)}<sup>${kk}</sup> = C${sb(n + kk - 1)}<sup>${kk}</sup> = ${bStr(R.val)}`;
  } else if (k === 'permRep') {
    st.push(L.c_permR);
    f = `P(${R.list.join(', ')}) = ${R.n}!/(${R.list.map((c) => c + '!').join('·')}) = ${bStr(R.val)}`;
  } else {
    st.push(L.c_prod);
    f = `N = ${R.list.join('·')} = ${bStr(R.val)}`;
  }
  st.push(f);
  return { st, ans: f.split(' = ').slice(-1)[0].replace(/^/, 'N = ') };
}
export function solveClas(R) {
  const L = T(),
    st = [];
  st.push(L.k_def);
  if (R.m === 'mn') {
    st.push(`P(A) = m/n = ${R.fav}/${R.tot} = ${fracB(R.num, R.den)}`);
    return { st, ans: `P(A) = ${fracB(R.num, R.den)}` };
  }
  if (R.m === 'dice') {
    st.push(L.k_dice(R.s, bStr(BigInt(R.tot))));
    st.push(`m = ${R.cnt}; P = ${R.cnt}/${R.tot} = ${fracB(R.num, R.den)}`);
    return { st, ans: `P = ${fracB(R.num, R.den)}` };
  }
  st.push(L.k_urn(R.N, R.n, `C${sb(R.N)}<sup>${R.n}</sup> = ${bStr(R.den)}`));
  const term = (t) =>
    t
      .map((k, i) => `C${sb(i === 0 ? R.a[0] : R.cev === 'exact' ? R.a[i] : R.N - R.a[0])}<sup>${k}</sup>`)
      .join('·');
  if (R.cev === 'exact') st.push(`${L.k_fav} m = ${term(R.terms[0])} = ${bStr(R.num)}`);
  else st.push(`${L.k_sum} m = ${R.terms.map(term).join(' + ')} = ${bStr(R.num)}`);
  st.push(`P = m/n = ${bStr(R.num)}/${bStr(R.den)} = ${fracB(R.num, R.den)}`);
  return { st, ans: `P = ${fracB(R.num, R.den)}` };
}
export function solveOps(R) {
  const L = T(),
    st = [];
  if (R.mode === 'two') {
    const q = (v) => fQ(v, 4);
    if (R.rel === 'ind') st.push(`${L.o_ind} P(AB) = P(A)·P(B) = ${q(R.pa)}·${q(R.pb)} = ${q(R.pab)}`);
    else if (R.rel === 'agb')
      st.push(`${L.o_mul} P(AB) = P(B)·P(A | B) = ${q(R.pb)}·${q(R.given)} = ${q(R.pab)}`);
    else if (R.rel === 'bga')
      st.push(`${L.o_mul} P(AB) = P(A)·P(B | A) = ${q(R.pa)}·${q(R.given)} = ${q(R.pab)}`);
    st.push(
      `${L.o_add} P(A + B) = P(A) + P(B) − P(AB) = ${q(R.pa)} + ${q(R.pb)} − ${q(R.pab)} = ${q(R.sum)}`
    );
    st.push(`${L.o_cond} P(A | B) = P(AB)/P(B) = ${q(R.agb)}; P(B | A) = ${q(R.bga)}`);
    st.push(
      `${L.o_rest} P(AB̄) = ${q(R.onlyA)}, P(ĀB) = ${q(R.onlyB)}, P(ĀB̄) = 1 − P(A + B) = ${q(R.none)}; ${L.o_one} ${q(R.one)}`
    );
    st.push(R.indep ? L.o_isInd : L.o_notInd);
    return { st, ans: `P(A + B) = ${q(R.sum)}, P(AB) = ${q(R.pab)}` };
  }
  const n = R.n,
    ps = R.ps,
    qs = ps.map((p) => 1 - p);
  st.push(
    L.o_list(
      ps.map((p, i) => `p${sb(i + 1)} = ${fN(p, 4)}`).join(', '),
      qs.map((q, i) => `q${sb(i + 1)} = ${fN(q, 4)}`).join(', ')
    )
  );
  const pr = (a) => a.map((v) => fN(v, 4)).join('·');
  if (R.ev === 'all')
    st.push(`${L.o_all} P = ${ps.map((_, i) => 'p' + sb(i + 1)).join('·')} = ${pr(ps)} = ${fN(R.P, 5)}`);
  else if (R.ev === 'none')
    st.push(`${L.o_none} P = ${qs.map((_, i) => 'q' + sb(i + 1)).join('·')} = ${pr(qs)} = ${fN(R.P, 5)}`);
  else if (R.ev === 'one1')
    st.push(
      `${L.o_one1} P = 1 − ${qs.map((_, i) => 'q' + sb(i + 1)).join('·')} = 1 − ${pr(qs)} = ${fN(R.P, 5)}`
    );
  else if (R.ev === 'only')
    st.push(
      `${L.o_only(R.k)} P = ${ps.map((p, i) => (i === R.k - 1 ? 'p' + sb(i + 1) : 'q' + sb(i + 1))).join('·')} = ${pr(ps.map((p, i) => (i === R.k - 1 ? p : 1 - p)))} = ${fN(R.P, 5)}`
    );
  else {
    if (R.ev === 'exact' && n <= 4) {
      const combos = [];
      const rec = (i, ch) => {
        if (i === n) {
          if (ch.filter(Boolean).length === R.k) combos.push(ch.slice());
          return;
        }
        ch.push(1);
        rec(i + 1, ch);
        ch.pop();
        ch.push(0);
        rec(i + 1, ch);
        ch.pop();
      };
      rec(0, []);
      st.push(
        `${L.o_exact(R.k)} P = ${combos.map((c) => c.map((b, i) => (b ? 'p' : 'q') + sb(i + 1)).join('')).join(' + ')} = ${fN(R.P, 5)}`
      );
    }
    st.push(
      `${L.o_gen} φ(z) = ${ps.map((p, i) => `(q${sb(i + 1)} + p${sb(i + 1)}z)`).join('')} = ${R.c.map((v, i) => `${fN(v, 4)}${i ? 'z' + (i > 1 ? '<sup>' + i + '</sup>' : '') : ''}`).join(' + ')}`
    );
    if (R.ev !== 'exact' || n > 4)
      st.push(
        `${R.ev === 'exact' ? L.o_coef(R.k) : R.ev === 'ge' ? L.o_ge(R.k) : L.o_le(R.k)} P = ${fN(R.P, 5)}`
      );
  }
  return { st, ans: `P = ${fN(R.P, 5)}` };
}
export function solveBayes(R) {
  const L = T(),
    st = [],
    n = R.pr.length,
    A = R.bev === 'notA' ? 'Ā' : 'A';
  if (R.unk >= 0) st.push(L.h_unk(R.unk + 1, fN(R.pr[R.unk], 4)));
  st.push(`${L.h_hyp} ${R.pr.map((p, i) => `P(H${sb(i + 1)}) = ${fQ(p, 4)}`).join('; ')}; Σ = 1.`);
  if (R.bev === 'notA')
    st.push(
      `${L.h_not} ${R.L.map((v, i) => `P(Ā | H${sb(i + 1)}) = 1 − ${fN(R.lk[i], 4)} = ${fN(v, 4)}`).join('; ')}`
    );
  st.push(
    `${L.h_total} P(${A}) = ${R.pr.map((p, i) => `${fN(p, 4)}·${fN(R.L[i], 4)}`).join(' + ')} = ${fQ(R.PA, 5)}`
  );
  st.push(
    `${L.h_bayes(A)}${R.post.map((v, i) => `<span class="sub">P(H${sb(i + 1)} | ${A}) = ${fN(R.joint[i], 5)}/${fN(R.PA, 5)} = ${fQ(v, 4)}</span>`).join('')}`
  );
  return { st, ans: `P(${A}) = ${fQ(R.PA, 5)}; P(H₁ | ${A}) = ${fQ(R.post[0], 4)}` };
}
