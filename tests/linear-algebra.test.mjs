// Матричная математика (src/math/linalg.js) против эталона ЛА.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { det, inv, tr, eigen, nullspace, transpose, mul } from '../src/math/linalg.js';

const golden = JSON.parse(fs.readFileSync(new URL('./golden/linear-algebra.json', import.meta.url), 'utf8'));
const norm = (v) =>
  JSON.parse(
    JSON.stringify(v, (k, x) =>
      typeof x === 'number' && !isFinite(x) ? String(x) : Object.is(x, -0) ? 0 : x
    )
  );
function close(a, b, w = '') {
  if (typeof a === 'number' && typeof b === 'number')
    assert.ok(Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(b)), `${w}: ${a} ≠ ${b}`);
  else if (a && b && typeof a === 'object') {
    assert.deepEqual(Object.keys(a).sort(), Object.keys(b).sort(), w);
    for (const k of Object.keys(a)) close(a[k], b[k], `${w}.${k}`);
  } else assert.equal(a, b, w);
}

for (const c of golden.cases) {
  test(c.id, () => {
    const { M, n } = c;
    const res = norm({
      det: det(M, n),
      inv: inv(M, n),
      tr: tr(M, n),
      eig: eigen(M, n),
      ns: nullspace(M, n, 1e-9),
      T: transpose(M, n),
      sq: mul(M, M, n),
    });
    close(res, c.res, c.id);
  });
}

test('регрессия фазы 1 (№8): допуски относительные — 10⁻⁵·E невырождена, 10⁻¹⁰·E имеет ранг 2', async () => {
  const { isSingular } = await import('../src/math/linalg.js');
  const E5 = [1e-5, 0, 0, 1e-5];
  assert.equal(isSingular(E5, 2), false);
  inv(E5, 2).forEach((x, i) => assert.ok(Math.abs(x - [1e5, 0, 0, 1e5][i]) < 1e-6));
  assert.equal(nullspace([1e-10, 0, 0, 1e-10], 2, 1e-9).rank, 2);
  assert.equal(
    isSingular([1e8, 1e8 + 1, 1e8, 1e8], 2),
    false,
    'det = −10⁸ — обратима, хотя элементы большие'
  );
  assert.equal(isSingular([1, 1, 1, 1 + 1e-12], 2), true, 'почти вырожденная');
  assert.equal(isSingular([1, 2, 2, 4], 2), true);
  assert.equal(nullspace([1, 2, 2, 4], 2, 1e-9).rank, 1);
});
