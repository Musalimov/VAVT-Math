// @ts-check
import { Q, Z0, Q1 } from './fractions.js';

/**
 * Симплекс-метод для задачи P (как в § 5.2): точные дроби, правило Бленда
 * после 40 итераций (гарантирует остановку), предел 2000 итераций — только
 * защита от зависания. Возвращает статус, оптимум, вершины и журнал таблиц.
 */
export function simplex(P, opt = {}) {
  if (!P.vars.length) {
    const P2 = {
      ...P,
      vars: ['_0'],
      c: [Q.of(0)],
      sign: ['ge'],
      int: [false],
      bin: [false],
      cons: P.cons.map((c) => ({ ...c, a: [Q.of(0)] })),
    };
    const r = simplex(P2, opt);
    const cut = (v) => (v ? v.slice(0, 0) : v);
    return { ...r, x: r.x ? [] : r.x, verts: (r.verts || []).map(() => []), rays: [] };
  }
  if (!P.cons.length)
    P = { ...P, cons: [{ a: P.vars.map(() => Q.of(0)), op: '<=', b: Q.of(1), auto: true, dummy: true }] };
  const log = [];
  const n = P.vars.length,
    max = P.sense === 'max';
  // 1) переменные: x<=0 -> -x', free -> x'-x''
  const cols = [];
  const map = []; // map[j] = [[colIdx,sign],...]
  P.vars.forEach((v, j) => {
    if (P.sign[j] === 'ge') {
      map.push([[cols.length, 1]]);
      cols.push(v);
    } else if (P.sign[j] === 'le') {
      map.push([[cols.length, -1]]);
      cols.push(v + "'");
    } else {
      map.push([
        [cols.length, 1],
        [cols.length + 1, -1],
      ]);
      cols.push(v + "'", v + "''");
    }
  });
  const nOrig = cols.length;
  const sub = (a) => {
    const r = new Array(nOrig).fill(Z0);
    P.vars.forEach((_, j) =>
      map[j].forEach(([k, s]) => {
        r[k] = r[k].add(s > 0 ? a[j] : a[j].neg());
      })
    );
    return r;
  };
  const c = sub(P.c).map((x) => (max ? x : x.neg())),
    c0 = max ? P.c0 : P.c0.neg();
  const transforms = {
    min: !max,
    le: P.vars.filter((_, j) => P.sign[j] === 'le'),
    free: P.vars.filter((_, j) => P.sign[j] === 'free'),
  };
  // 2) допуски
  const isX = P.vars.every((v) => /^x\d+$/.test(v)) && P.sign.every((s) => s === 'ge');
  const mat = isX && P.vars.length > 2 && P.vars.every((v) => /^x\d\d+$/.test(v));
  let nextIdx = mat ? 1 : isX ? Math.max(...P.vars.map((v) => +v.slice(1))) + 1 : 1;
  const rows = [];
  const slackOf = [];
  P.cons.forEach((cn, i) => {
    const a = sub(cn.a);
    let sl = null;
    if (cn.op !== '=') {
      sl = cols.length;
      let nm;
      do {
        nm = (isX ? 'x' : 's') + nextIdx++;
      } while (cols.includes(nm) || P.vars.includes(nm));
      cols.push(nm);
    }
    rows.push({ a, op: cn.op, b: cn.b, sl });
    slackOf.push(sl);
  });
  const N = cols.length;
  let T = rows.map((r) => {
    const row = new Array(N + 1).fill(Z0);
    r.a.forEach((v, k) => {
      row[k] = v;
    });
    if (r.sl !== null) row[r.sl] = r.op === '<=' ? Q1 : Q1.neg();
    row[N] = r.b;
    return row;
  });
  const flipped = [];
  T.forEach((row, i) => {
    if (row[N].s < 0) {
      T[i] = row.map((x) => x.neg());
      flipped.push(i);
    }
  });
  let Z = new Array(N + 1).fill(Z0);
  c.forEach((v, k) => {
    Z[k] = v.neg();
  });
  Z[N] = c0;
  const snap = (note, piv, kind) =>
    log.push({ T: T.map((r) => r.slice()), Z: Z.slice(), B: basis.slice(), note, piv, kind });
  let basis = new Array(T.length).fill(-1);
  const isUnitCol = (k, i) => T.every((r, ii) => (ii === i ? r[k].eq(Q1) : r[k].z));
  const ord = [...Array(N).keys()].filter((k) => k >= nOrig).concat([...Array(nOrig).keys()]);
  for (let i = 0; i < T.length; i++)
    for (const k of ord) {
      if (basis.includes(k)) continue;
      if (isUnitCol(k, i)) {
        basis[i] = k;
        break;
      }
    }
  const pivot = (s, r) => {
    const p = T[s][r];
    T[s] = T[s].map((x) => x.div(p));
    for (let i = 0; i < T.length; i++)
      if (i !== s && !T[i][r].z) {
        const f = T[i][r];
        T[i] = T[i].map((x, k) => x.sub(f.mul(T[s][k])));
      }
    if (!Z[r].z) {
      const f = Z[r];
      Z = Z.map((x, k) => x.sub(f.mul(T[s][k])));
    }
    basis[s] = r;
  };
  const res = { cols, nOrig, map, slackOf, flipped, transforms, log, N, max };
  snap({ t: 'init' }, null, 'init');
  // обнулить нижнюю строку под исходно базисными
  basis.forEach((k, i) => {
    if (k >= 0 && !Z[k].z) {
      const f = Z[k];
      Z = Z.map((x, kk) => x.sub(f.mul(T[i][kk])));
      snap({ t: 'zrow', col: k }, null, 'p1');
    }
  });
  // фаза 1: единичная матрица
  let guard = 0;
  while (basis.includes(-1) && guard++ < 60) {
    const i = basis.indexOf(-1);
    const row = T[i];
    if (row.slice(0, N).every((x) => x.s <= 0)) {
      if (row[N].s > 0) {
        res.status = 'infeasible';
        res.infRow = i;
        snap({ t: 'infeas', row: i }, null, 'end');
        return res;
      }
      if (row.slice(0, N).every((x) => x.z)) {
        T.splice(i, 1);
        basis.splice(i, 1);
        slackOf.forEach((s, ii) => {});
        snap({ t: 'redundant', row: i }, null, 'p1');
        continue;
      }
      T[i] = row.map((x) => x.neg());
      snap({ t: 'neg', row: i }, null, 'p1');
      continue;
    }
    const cand = [];
    for (let k = 0; k < N; k++) {
      if (row[k].s <= 0 || basis.includes(k)) continue;
      let best = null,
        bi = -1,
        ties = [];
      for (let ii = 0; ii < T.length; ii++) {
        if (T[ii][k].s <= 0) continue;
        const q = T[ii][N].div(T[ii][k]);
        if (best === null || q.cmp(best) < 0) {
          best = q;
          bi = ii;
          ties = [ii];
        } else if (q.eq(best)) ties.push(ii);
      }
      cand.push({ k, s: ties.includes(i) ? i : bi, good: ties.includes(i), one: row[k].eq(Q1) });
    }
    let ch = cand.find((c) => c.good && c.one) || cand.find((c) => c.good) || cand[0];
    if (!ch) {
      for (let k = 0; k < N; k++)
        if (row[k].s > 0) {
          let best = null,
            bi = -1;
          for (let ii = 0; ii < T.length; ii++) {
            if (T[ii][k].s <= 0) continue;
            const q = T[ii][N].div(T[ii][k]);
            if (best === null || q.cmp(best) < 0) {
              best = q;
              bi = ii;
            }
          }
          ch = { k, s: bi };
          break;
        }
    }
    const ratios = [];
    for (let ii = 0; ii < T.length; ii++) if (T[ii][ch.k].s > 0) ratios.push([ii, T[ii][N].div(T[ii][ch.k])]);
    const pv = T[ch.s][ch.k];
    pivot(ch.s, ch.k);
    snap({ t: 'p1', col: ch.k, row: ch.s, pv, ratios }, [ch.s, ch.k], 'p1');
  }
  if (basis.includes(-1)) {
    res.status = 'fail';
    return res;
  }
  // фаза 2
  guard = 0;
  let bland = false;
  for (;;) {
    if (guard++ > 2000) {
      res.status = 'fail';
      return res;
    }
    if (guard > 40) bland = true;
    let r = -1;
    for (let k = 0; k < N; k++) {
      if (Z[k].s < 0 && (r < 0 || (bland ? false : Z[k].cmp(Z[r]) < 0))) r = k;
    }
    if (r < 0) break;
    let s = -1,
      best = null;
    const ratios = [];
    for (let i = 0; i < T.length; i++) {
      if (T[i][r].s <= 0) continue;
      const q = T[i][N].div(T[i][r]);
      ratios.push([i, q]);
      if (best === null || q.cmp(best) < 0) {
        best = q;
        s = i;
      }
    }
    if (s < 0) {
      res.status = 'unbounded';
      res.ubCol = r;
      snap({ t: 'unb', col: r }, null, 'end');
      return res;
    }
    const pv = T[s][r],
      zr = Z[r];
    pivot(s, r);
    snap({ t: 'p2', col: r, row: s, pv, ratios, zr }, [s, r], 'p2');
  }
  res.status = 'optimal';
  res.T = T;
  res.Z = Z;
  res.B = basis.slice();
  res.M = Z[N];
  const xs = new Array(N).fill(Z0);
  basis.forEach((k, i) => {
    xs[k] = T[i][N];
  });
  res.xs = xs;
  res.value = max ? Z[N] : Z[N].neg();
  const zeroNB = [];
  for (let k = 0; k < N; k++) if (!basis.includes(k) && Z[k].z) zeroNB.push(k);
  res.zeroNB = zeroNB;
  res.unique = !zeroNB.length;
  snap({ t: 'opt', zeroNB }, null, 'end');
  // все решения
  const verts = [],
    rays = [],
    seen = new Set();
  const back = (xs) =>
    P.vars.map((_, j) => map[j].reduce((s, [k, sg]) => s.add(sg > 0 ? xs[k] : xs[k].neg()), Z0));
  const addV = (x) => {
    const k = x.map((q) => q.key).join(',');
    if (!verts.some((v) => v.map((q) => q.key).join(',') === k)) verts.push(x);
  };
  const explore = (T0, Z0_, B0, depth) => {
    const key = B0.slice()
      .sort((a, b) => a - b)
      .join(',');
    if (seen.has(key) || seen.size > 40) return;
    seen.add(key);
    const x = new Array(N).fill(Z0);
    B0.forEach((k, i) => {
      x[k] = T0[i][N];
    });
    addV(back(x));
    for (let k = 0; k < N; k++) {
      if (B0.includes(k) || !Z0_[k].z) continue;
      const pos = [];
      let best = null;
      for (let i = 0; i < T0.length; i++) {
        if (T0[i][k].s <= 0) continue;
        const q = T0[i][N].div(T0[i][k]);
        if (best === null || q.cmp(best) < 0) {
          best = q;
        }
      }
      if (best === null) {
        const d = new Array(N).fill(Z0);
        d[k] = Q1;
        B0.forEach((kk, i) => {
          d[kk] = T0[i][k].neg();
        });
        const db = back(d);
        if (db.some((q) => !q.z)) {
          const nz = db.find((q) => !q.z);
          const nm = db.map((q) => q.div(nz.abs()));
          const key2 = nm.map((q) => q.key).join(',');
          if (!rays.some((r) => r.key === key2)) rays.push({ d: db, key: key2 });
        }
        continue;
      }
      for (let i = 0; i < T0.length; i++) {
        if (T0[i][k].s <= 0) continue;
        if (!T0[i][N].div(T0[i][k]).eq(best)) continue;
        let T1 = T0.map((r) => r.slice()),
          Z1 = Z0_.slice();
        const B1 = B0.slice();
        const p = T1[i][k];
        T1[i] = T1[i].map((v) => v.div(p));
        for (let ii = 0; ii < T1.length; ii++)
          if (ii !== i && !T1[ii][k].z) {
            const f = T1[ii][k];
            T1[ii] = T1[ii].map((v, kk) => v.sub(f.mul(T1[i][kk])));
          }
        if (!Z1[k].z) {
          const f = Z1[k];
          Z1 = Z1.map((v, kk) => v.sub(f.mul(T1[i][kk])));
        }
        B1[i] = k;
        explore(T1, Z1, B1, depth + 1);
      }
    }
  };
  explore(
    T.map((r) => r.slice()),
    Z.slice(),
    basis.slice(),
    0
  );
  res.verts = verts;
  res.rays = rays.map((r) => r.d);
  res.x = back(xs);
  return res;
}
