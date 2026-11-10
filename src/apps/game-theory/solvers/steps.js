import { toFrac } from '../../../math/fractions.js';
import { fN, fV } from '../../../shared/format.js';
import { lang } from '../../../shared/i18n.js';
import { T } from '../content/tx.js';
import { STRATS, coalitions } from './games.js';
import { esc } from '../../../shared/esc.js';
import { nI } from './compute.js';
export function fVq(a) {
  return `(${a
    .map((v) => {
      const f = toFrac(v, 1000, 1e-9);
      return f && f[1] > 1 ? `${f[0] < 0 ? '−' : ''}${Math.abs(f[0])}/${f[1]}` : fN(v, 4);
    })
    .join('; ')})`;
}
export function fQ(v, d = 4) {
  const f = toFrac(v, 1000, 1e-9);
  if (f && f[1] > 1) return `${f[0] < 0 ? '−' : ''}${Math.abs(f[0])}/${f[1]} ≈ ${fN(v, d)}`;
  return fN(v, d);
}
export const kName = (K, n) =>
  '{' +
  [...Array(n)]
    .map((_, i) => ((K >> i) & 1 ? i + 1 : null))
    .filter(Boolean)
    .join(', ') +
  '}';
export const rS = (i) => `${lang() === 'ru' ? 'стр.' : 'row'} ${i + 1}`;
export const cS0 = (j) => `${lang() === 'ru' ? 'столб.' : 'col'} ${j + 1}`;
export function gmTab(R) {
  const { A, B, bm } = R,
    zs = R.kind === 'zs';
  const cS = (j) => (R.cl ? `${lang() === 'ru' ? 'ст.' : 'col'} ${R.cl[j]}` : cS0(j));
  const ne = new Set(bm.pure.map(([i, j]) => i + ',' + j));
  let h =
    '<div class="tw"><table class="gm"><tr><th></th>' +
    A[0].map((_, j) => `<th>${cS(j)}</th>`).join('') +
    (zs ? `<th>min</th>` : '') +
    '</tr>';
  A.forEach((r, i) => {
    h +=
      `<tr><th>${rS(i)}</th>` +
      r
        .map((a, j) => {
          const c1 = bm.br1[j][i] ? 'b1' : '',
            c2 = bm.br2[i][j] ? 'b2' : '';
          return `<td class="${ne.has(i + ',' + j) ? 'ne' : ''}"><span class="${c1}">${fN(a, 3)}</span>${zs ? '' : ` ; <span class="${c2}">${fN(B[i][j], 3)}</span>`}</td>`;
        })
        .join('') +
      (zs ? `<th>${fN(R.z.rmin[i], 3)}</th>` : '') +
      '</tr>';
  });
  if (zs) h += '<tr><th>max</th>' + R.z.cmax.map((v) => `<th>${fN(v, 3)}</th>`).join('') + '<th></th></tr>';
  return h + '</table></div>';
}
export function solveMat(R) {
  const cS = R.cl ? (j) => `${lang() === 'ru' ? 'ст.' : 'col'} ${R.cl[j]}` : cS0;
  const L = T(),
    st = [gmTab(R)];
  const bm = R.bm;
  if (R.kind === 'zs') {
    const z = R.z;
    st.push(`${L.s_zsMin} ${z.rmin.map((v) => fN(v, 3)).join(', ')}.`);
    st.push(`${L.s_zsMax} ${z.cmax.map((v) => fN(v, 3)).join(', ')}.`);
    st.push(L.s_zsLo(fN(z.lo, 3), fN(z.hi, 3)));
    if (z.saddle.length) {
      const [i, j] = z.saddle[0];
      st.push(L.s_saddle(`(${rS(i)}, ${cS(j)})`, fN(z.lo, 3)));
      return { st, ans: `v = ${fQ(z.lo)}` };
    }
    st.push(L.s_noSaddle);
    st.push(L.s_lp);
    if (R.A.length === 2 || R.A[0].length === 2) st.push(L.s_graph);
    st.push(L.s_zsRes(fV(z.p), fV(z.q), fQ(z.v)));
    return { st, ans: `v = ${fQ(z.v)}; p* = ${fV(z.p)}, q* = ${fV(z.q)}` };
  }
  st.push(L.s_br1);
  st.push(L.s_br2);
  st.push(bm.pure.length ? L.s_ne(bm.pure.map(([i, j]) => `(${rS(i)}, ${cS(j)})`).join(', ')) : L.s_noNe);
  const d = R.dom;
  if (d.steps.length) {
    d.steps.forEach((s) =>
      st.push(L.s_dom(s.p, s.p === 1 ? rS(s.out) : cS(s.out), s.p === 1 ? rS(s.by) : cS(s.by)))
    );
    st.push(L.s_domRes(`${d.R.map(rS).join(', ')} × ${d.C.map(cS).join(', ')}`));
  } else st.push(L.s_domNo);
  if (R.A.length === 2 && R.A[0].length === 2) {
    if (bm.mixed) {
      const m = bm.mixed;
      st.push(L.s_mix(fQ(m.q), fQ(m.p)));
      st.push(L.s_mixU(fQ(m.u1), fQ(m.u2)));
    } else st.push(L.s_mixNo);
  } else {
    st.push(L.s_mixSup);
    if (bm.mixN.length) bm.mixN.forEach((e) => st.push(L.s_mixNe(fVq(e.x), fVq(e.y), fQ(e.u1), fQ(e.u2))));
    else st.push(bm.pure.length ? L.s_mixNNo : L.s_mixDeg);
  }
  const mixA = bm.mixN.map((e) => `x* = ${fVq(e.x)}, y* = ${fVq(e.y)}`).join('; ');
  const ans =
    (bm.pure.length ? bm.pure.map(([i, j]) => `(${i + 1}, ${j + 1})`).join(', ') : '') +
    (bm.mixed ? `; p = ${fN(bm.mixed.p, 3)}, q = ${fN(bm.mixed.q, 3)}` : '') +
    (mixA ? (bm.pure.length ? '; ' : '') + mixA : '');
  return { st, ans: `NE: ${ans || '—'}` };
}
export function solveCour(R) {
  const L = T(),
    st = [L.s_c1, L.s_c2];
  const N = R.N;
  if (R.act.length < N)
    R.cs.forEach((c, i) => {
      if (!R.act.includes(i)) st.push(L.s_cOut(i + 1));
    });
  st.push(L.s_c3(R.act.length, fQ(R.Q)));
  st.push(`${L.s_c4} ${R.q.map((q, i) => `q${i + 1} = ${fQ(q)}`).join(', ')}`);
  if (R.cs.every((c) => c === R.cs[0])) st.push(L.s_cSym(fQ((R.M - R.cs[0]) / (N + 1))));
  st.push(L.s_cP(fQ(R.P)));
  st.push(`${T().v.pi}: ${R.pi.map((p, i) => `H${i + 1} = ${fQ(p)}`).join(', ')}`);
  return { st, ans: `q* = ${fV(R.q)}, P = ${fN(R.P, 4)}` };
}
export function solveBarg(R) {
  const L = T(),
    st = [L.s_b1];
  st.push(L.s_bPar(R.F.map(fV).join(' — ')));
  if (R.nash) st.push(L.s_bN(fV(R.nash.x), fQ(R.nash.v)));
  st.push(L.s_bI(fV(R.ideal)));
  if (R.ks) st.push(L.s_bK(fV(R.ks.x)));
  if (R.nash && R.ks && Math.hypot(R.nash.x[0] - R.ks.x[0], R.nash.x[1] - R.ks.x[1]) < 1e-9)
    st.push(L.s_bSame);
  return {
    st,
    ans: `${T().v.nash}: ${R.nash ? fV(R.nash.x) : '—'}; ${T().v.ks}: ${R.ks ? fV(R.ks.x) : '—'}`,
  };
}
export function solveCoop(R) {
  const L = T(),
    n = R.n,
    st = [];
  const Ks = coalitions(n);
  st.push(`${L.s_v} ${Ks.map((K) => `v(${kName(K, n)}) = ${fN(R.v[K], 3)}`).join('; ')}.`);
  const tab = R.sh.tab;
  st.push(
    `${L.s_sh}${n <= 3 ? `<div class="tw"><table class="tab"><tr><th>${lang() === 'ru' ? 'Порядок' : 'Order'}</th>${[...Array(n)].map((_, i) => `<th>${i + 1}</th>`).join('')}</tr>${tab.map((r) => `<tr><td>${r.p.map((i) => i + 1).join('→')}</td>${[...Array(n)].map((_, i) => `<td>${fN(r.row.find((x) => x[0] === i)[1], 3)}</td>`).join('')}</tr>`).join('')}</table></div>` : ''}${L.s_shRes(fV(R.sh.phi))}`
  );
  st.push(L.s_core);
  st.push(R.core.nonempty ? L.s_coreY : L.s_coreN);
  if (R.core.nonempty) {
    st.push(L.s_inCore(lang() === 'ru' ? 'Вектор Шепли' : 'The Shapley value', R.shIn));
  }
  st.push(L.s_conv + ' ' + (R.cv.length ? L.s_convN(kName(R.cv[0][0], n), kName(R.cv[0][1], n)) : L.s_convY));
  st.push(L.s_pn);
  R.pn.steps.forEach((s, k) =>
    st.push(L.s_pnStep(k + 1, fQ(s.t), s.tight.map((K) => kName(K, n)).join(', ')))
  );
  if (R.pn.x) {
    st.push(L.s_pnRes(fV(R.pn.x)));
    if (R.pn.x.every((x, i) => x >= R.v[1 << i] - 1e-9)) st.push(L.s_pnIR);
  }
  return {
    st,
    ans: `φ = ${fV(R.sh.phi)}; ${lang() === 'ru' ? 'преднуклеолус' : 'prenucleolus'} ${R.pn.x ? fV(R.pn.x) : '—'}`,
  };
}
export function solveAuct(R) {
  const L = T(),
    a = R.a,
    st = [L.s_a1(R.n, fN(R.w))];
  st.push(L.s_aFP(`β = ${fN(a.fp(R.v), 4)}`));
  st.push(L.s_aSP(`β = ${fN(a.sp(R.v), 4)}`));
  st.push(L.s_aAP(`β = ${fN(a.ap(R.v), 4)}`));
  st.push(L.s_aRev(fQ(a.rev)));
  return { st, ans: `${T().v.rev}: ${fQ(a.rev)}` };
}
export const SOLVE = {
  mat: solveMat,
  cour: solveCourX,
  barg: solveBarg,
  coop: solveCoop,
  auct: solveAuct,
  cont: solveCont,
  bayes: solveBayesG,
  hotel: solveHotel,
  tree: solveTree,
  rep: solveRep,
  evo: solveEvo,
  vote: solveVote,
  match: solveMatch,
  braess: solveBraess,
};
export function solveCourX(R) {
  if (R.om === 'cour') return solveCour(R);
  const L = T(),
    st = [];
  if (R.om === 'stack') {
    st.push(L.s_c1);
    st.push(L.s_ol1);
    st.push(L.s_ol2);
    if (R.deter) st.push(L.s_olD(fQ(R.M - R.c2)));
    st.push(L.s_ol3(fQ(R.q[0]), fQ(R.q[1]), fQ(R.P)));
    st.push(`${L.v.pi}: H₁ = ${fQ(R.pi[0])}, H₂ = ${fQ(R.pi[1])}`);
    return { st, ans: `q* = ${fV(R.q)}, P = ${fN(R.P, 4)}` };
  }
  if (R.om === 'bert') {
    st.push(L.s_ob1);
    st.push(L.s_ob2);
    if (Math.abs(R.c1 - R.c2) > 1e-12) st.push(L.s_ob3(fN(Math.max(R.c1, R.c2), 4)));
    st.push(`p = ${fV(R.p)}, q = ${fV(R.q)}, ${L.v.pi}: ${fV(R.pi)}`);
    return { st, ans: `p* = ${fV(R.p)}` };
  }
  st.push(L.s_oc);
  const m = R.cmp;
  st.push(
    `<div class="tw"><table class="tab"><tr><th></th><th>Q</th><th>P</th><th>PS</th><th>CS</th><th>DWL</th></tr>${Object.keys(
      m
    )
      .map(
        (k) =>
          `<tr><td style="text-align:left">${L.mods[k]}</td>${['Q', 'P', 'PS', 'CS', 'DWL'].map((f) => `<td>${fN(m[k][f], 3)}</td>`).join('')}</tr>`
      )
      .join('')}</table></div>`
  );
  return { st, ans: `Q: ${fN(m.mono.Q, 2)} < ${fN(m.cour.Q, 2)} < ${fN(m.stack.Q, 2)} < ${fN(m.comp.Q, 2)}` };
}
export function solveCont(R) {
  const L = T(),
    st = [L.s_ct1, L.s_ct2];
  if (R.many) {
    const ln = R.line;
    const offTxt = ln && ln.off.length ? ln.off.map(fV).join(', ') : '';
    st.push(L.s_ctM(R.grid.length, ln && ln.n >= 3 ? fV(ln.a) : '', ln && ln.n >= 3 ? fV(ln.b) : '', offTxt));
    return {
      st,
      ans: `NE: ${ln && ln.n >= 3 ? `[${fV(ln.a)} — ${fV(ln.b)}]${offTxt ? ', ' + offTxt : ''}` : R.grid.length}`,
    };
  }
  if (!R.eq.length) {
    st.push(L.s_ctN);
    return { st, ans: '—' };
  }
  st.push(L.s_ctE(R.eq.map(fV).join(', ')));
  st.push(R.eq.map((p) => `H₁ = ${fN(R.H1(p[0], p[1]), 4)}, H₂ = ${fN(R.H2(p[0], p[1]), 4)}`).join('; '));
  return { st, ans: `NE: ${R.eq.map(fV).join(', ')}` };
}
export function solveBayesG(R) {
  const L = T();
  const cS = (j) => `${lang() === 'ru' ? 'ст.' : 'col'} ${R.cl[j]}`;
  const st = [L.s_by1(fN(R.mu, 3)), L.s_by2, gmTab(R), L.s_by3];
  st.push(
    R.bm.pure.length ? L.s_byE(R.bm.pure.map(([i, j]) => `(${rS(i)}, ${R.cl[j]})`).join(', ')) : L.s_byN
  );
  return { st, ans: R.bm.pure.length ? R.bm.pure.map(([i, j]) => `(${i + 1}; ${R.cl[j]})`).join(', ') : '—' };
}
export function solveHotel(R) {
  const L = T();
  if (R.hm === 'loc') return { st: [L.s_hl1, L.s_hl2, L.s_hl3], ans: `(${fN(0.5)}; ${fN(0.5)})` };
  const st = [
    L.s_hp1(fN(R.a, 3), fN(1 - R.b, 3)),
    L.s_hp2,
    L.s_hp3(fN(R.p[0], 4), fN(R.p[1], 4)),
    L.s_hp4(fN(R.formula[0], 4), fN(R.formula[1], 4)),
    L.s_hp5(fN(R.x, 4), fN(R.pi[0], 4), fN(R.pi[1], 4)),
  ];
  return { st, ans: `p* = (${fN(R.p[0], 3)}; ${fN(R.p[1], 3)})` };
}
export function solveTree(R) {
  const L = T(),
    st = [L.s_tr1];
  R.log.forEach((l) => {
    const n = R.T.nodes[l.id];
    st.push(
      L.s_trN(esc(l.id), l.pl, esc(n.acts[l.best].a), fV(l.opts[l.best])) +
        (R.ties[l.id] ? ' ' + L.s_trTie : '')
    );
  });
  const path = R.path.map(([id, k]) => `${esc(id)}: ${esc(R.T.nodes[id].acts[k].a)}`).join(' → ');
  st.push(L.s_trR(path, fV(R.v)));
  st.push(L.s_trS);
  return { st, ans: `${fV(R.v)}; ${path}` };
}
export function solveRep(R) {
  const L = T(),
    st = [L.s_rp1(fN(R.pay.R), fN(R.pay.T), fN(R.pay.S), fN(R.pay.P)), L.s_rp2(R.n)];
  const ord = STRATS.map((s, i) => [s, R.tot[i]]).sort((a, b) => b[1] - a[1]);
  st.push(
    `${L.s_rp3}<div class="tw"><table class="tab"><tr><th></th><th>${lang() === 'ru' ? 'Стратегия' : 'Strategy'}</th><th>${lang() === 'ru' ? 'Очки' : 'Points'}</th></tr>${ord.map(([s, v], i) => `<tr><td>${i + 1}</td><td style="text-align:left">${L.stn[s]}</td><td>${fN(v, 0)}</td></tr>`).join('')}</table></div>`
  );
  st.push(L.s_rp4(fQ(R.grim), fN(R.dl, 3), R.dl >= R.grim - 1e-12));
  st.push(L.s_rp5);
  return { st, ans: `${L.v2.win}: ${L.stn[ord[0][0]]}; δ ⩾ ${fQ(R.grim)}` };
}
export function solveEvo(R, I) {
  const L = T(),
    A = R.A,
    st = [];
  if (I.em === 'hd') st.push(L.s_evHD(nI(I.V), nI(I.C)));
  st.push(
    `${L.s_ev1} a₁₁ = ${fN(A[0][0], 3)}, a₁₂ = ${fN(A[0][1], 3)}, a₂₁ = ${fN(A[1][0], 3)}, a₂₂ = ${fN(A[1][1], 3)}.`
  );
  st.push(L.s_ev2);
  st.push(
    R.ess.length
      ? L.s_evP(R.ess.map((s) => (lang() === 'ru' ? `стратегия ${s}` : `strategy ${s}`)).join(', '))
      : L.s_evN
  );
  if (R.xs !== null) st.push(L.s_evM(fQ(R.xs), R.mixedESS));
  st.push(L.s_evR);
  const fin = R.traj.map((t, i) => `${fN(R.x0[i], 2)} → ${fN(t[t.length - 1][1], 3)}`).join('; ');
  if (fin) st.push((lang() === 'ru' ? 'Траектории за t = 30: ' : 'Trajectories by t = 30: ') + fin);
  return {
    st,
    ans: `ESS: ${[...R.ess.map((s) => (s === '1' ? 'x = 1' : 'x = 0')), R.mixedESS ? `x* = ${fN(R.xs, 3)}` : ''].filter(Boolean).join(', ') || '—'}`,
  };
}
export function solveVote(R) {
  const L = T(),
    n = R.w.length,
    st = [
      L.s_vt1(fN(R.q), R.w.map((v) => fN(v)).join(', ')),
      L.s_vt2(R.win, R.minimal.length),
      L.s_vt3,
      L.s_vt4,
    ];
  st.push(
    `<div class="tw"><table class="tab"><tr><th>#</th><th>${lang() === 'ru' ? 'Вес' : 'Weight'}</th><th>${lang() === 'ru' ? 'Доля веса' : 'Weight share'}</th><th>SS</th><th>Bz</th></tr>${R.w.map((w, i) => `<tr><td>${i + 1}</td><td>${fN(w)}</td><td>${fN(w / R.tot, 4)}</td><td>${fQ(R.ss[i])}</td><td>${fQ(R.bzN[i])}</td></tr>`).join('')}</table></div>`
  );
  const v = R.veto.map((x, i) => (x ? i + 1 : null)).filter(Boolean),
    d = R.dummy.map((x, i) => (x ? i + 1 : null)).filter(Boolean);
  st.push(L.s_vtV(v.length ? v.join(', ') : '—'));
  st.push(L.s_vtD(d.length ? d.join(', ') : '—'));
  st.push(L.s_vtW);
  return { st, ans: `SS = ${fV(R.ss)}` };
}
export function solveMatch(R) {
  const L = T(),
    st = [
      L.s_gs1(
        R.rev
          ? lang() === 'ru'
            ? 'вторая сторона'
            : 'side 2'
          : lang() === 'ru'
            ? 'первая сторона'
            : 'side 1'
      ),
    ];
  R.log.forEach((l) =>
    st.push(
      L.s_gsR(
        l.round,
        l.ev
          .map(
            ([p, r, k, out]) =>
              `${esc(p)} → ${esc(r)}: ${k === 'acc' ? L.acc + (out ? ` (${esc(out)} ${lang() === 'ru' ? 'освобождается' : 'is freed'})` : '') : L.rej}`
          )
          .join('; ')
      )
    )
  );
  const m = Object.entries(R.match)
    .map(([p, r]) => `${esc(p)} — ${esc(r)}`)
    .join(', ');
  st.push(L.s_gsRes(m));
  st.push(R.block.length ? L.s_gsBl(R.block.map(([p, r]) => `${esc(p)}–${esc(r)}`).join(', ')) : L.s_gsSt);
  st.push(L.s_gsOpt);
  return { st, ans: m };
}
export function solveBraess(R) {
  const L = T(),
    e = R.eq,
    st = [
      L.s_brs1(R.N, fN(R.a), fN(R.b)),
      L.s_brs2,
      L.s_br3(
        e.x.map((v) => fN(v, 1)),
        fN(e.T, 3)
      ),
    ];
  if (R.yes && R.base)
    st.push(
      R.base.T < e.T - 1e-9
        ? L.s_br4(fN(R.base.T, 3), fN(e.T, 3))
        : lang() === 'ru'
          ? `Без перемычки было ${fN(R.base.T, 3)}: парадокса здесь нет.`
          : `Without the link it was ${fN(R.base.T, 3)}: no paradox here.`
    );
  st.push(L.s_br5(fN(R.opt.avg, 2)));
  return { st, ans: `T = ${fN(e.T, 3)}` };
}
