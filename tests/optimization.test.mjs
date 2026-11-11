// МОР: прямая, двойственная и целочисленная задачи в Node против эталона
// (tests/golden/optimization.json) и регрессии фазы 1.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { simplex } from '../src/math/simplex.js';
import { parseProblem, dualOf, intSearch, region2, symNorm } from '../src/apps/optimization/solvers/lp.js';

const golden = JSON.parse(fs.readFileSync(new URL('./golden/optimization.json', import.meta.url), 'utf8'));
const q = (v) => (v && v.key !== undefined ? v.key : Array.isArray(v) ? v.map(q) : v);
const sum = (r) =>
  r ? { status: r.status, value: q(r.value), x: q(r.x), unique: r.unique, it: (r.log || []).length } : null;
const strip = (o) => JSON.parse(JSON.stringify(o));

for (const c of golden.cases) {
  test(`эталон: ${c.id}`, () => {
    const P0 = parseProblem(c.txt);
    const D = dualOf(symNorm(P0)); // по умолчанию — «как на семинаре»: двойственная к симметричной форме
    assert.deepEqual(strip(sum(simplex(P0))), c.res.P, 'прямая');
    assert.deepEqual(strip(sum(simplex(D))), c.res.D, 'двойственная');
    if (c.res.I) {
      const I = intSearch(P0, P0.vars.length === 2 ? region2(P0) : null);
      assert.deepEqual(strip({ status: I.status, value: q(I.value), x: q(I.x) }), c.res.I, 'целочисленная');
    }
  });
}

test('регрессия фазы 1: точные дроби без потери точности (BigInt)', () => {
  const r = simplex(
    parseProblem(
      'z = 44x1 + 66x2 + 79x3 -> max\n47x1 + 19x2 + 44x3 <= 5290\n36x1 + 90x2 + 70x3 <= 5116\n12x1 + 40x2 + 88x3 <= 3007\nx1, x2, x3 >= 0'
    )
  );
  assert.equal(r.value.key, '627795339/106124');
});

test('регрессия фазы 1: «1e3» — понятная ошибка, а не «неограничена»', () => {
  assert.throws(
    () => parseProblem('z = 3x1 + 2x2 -> max\nx1 + x2 <= 1e3\nx1, x2 >= 0'),
    (e) => e.msg === 'exp'
  );
});

test('регрессия фазы 1: Кли–Минти n = 8 решается (предел итераций 2000)', () => {
  const n = 8;
  const obj = Array.from({ length: n }, (_, j) => `${2 ** (n - j - 1)}x${j + 1}`).join(' + ');
  const cons = Array.from(
    { length: n },
    (_, i) =>
      [...Array.from({ length: i }, (_, j) => `${2 ** (i - j + 1)}x${j + 1}`), `x${i + 1}`].join(' + ') +
      ` <= ${5 ** (i + 1)}`
  );
  const r = simplex(
    parseProblem(
      `z = ${obj} -> max\n${cons.join('\n')}\n${Array.from({ length: n }, (_, j) => `x${j + 1}`).join(', ')} >= 0`
    )
  );
  assert.equal(r.status, 'optimal');
  assert.equal(r.value.key, String(5 ** n) + '/1');
});
