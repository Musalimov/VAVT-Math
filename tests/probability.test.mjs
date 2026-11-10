// Решатели «Макроэкономики» в Node против ответов эталона (tests/golden/probability.json).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { langFrom } from '../src/shared/i18n.js';
import { notationFrom } from '../src/apps/probability/solvers/notation.js';
import { COMP } from '../src/apps/probability/solvers/compute.js';
import { SOLVE } from '../src/apps/probability/solvers/steps.js';

const golden = JSON.parse(fs.readFileSync(new URL('./golden/probability.json', import.meta.url), 'utf8'));
// та же нормализация, что при снятии эталона: без функций, ±∞/NaN строками, −0 → 0
const norm = (v) =>
  JSON.parse(
    JSON.stringify(v, (k, x) =>
      typeof x === 'function'
        ? undefined
        : typeof x === 'bigint'
        ? x + 'n'
        : typeof x === 'number' && !isFinite(x)
          ? String(x)
          : Object.is(x, -0)
            ? 0
            : x
    )
  );

// Числа — с относительной точностью 1e-6: Math.pow, exp и т. п. в Node и в браузере
// могут расходиться в последнем бите (разные версии V8), а численный поиск минимума
// (средние издержки) усиливает это до ~1e-7. Текст решения сравнивается точно.
function close(a, b, where = '') {
  if (typeof a === 'number' && typeof b === 'number') {
    assert.ok(Math.abs(a - b) <= 1e-6 * Math.max(1, Math.abs(a), Math.abs(b)), `${where}: ${a} ≠ ${b}`);
  } else if (a && b && typeof a === 'object' && typeof b === 'object') {
    assert.deepEqual(Object.keys(a).sort(), Object.keys(b).sort(), `${where}: набор полей`);
    for (const k of Object.keys(a)) close(a[k], b[k], `${where}.${k}`);
  } else assert.equal(a, b, where);
}

for (const c of golden.cases) {
  test(`${c.topic} / ${c.id}`, () => {
    let lang = 'ru';
    langFrom(() => lang);
    notationFrom(() => 'modern');
    if (c.err) {
      assert.throws(
        () => COMP[c.topic](c.inp),
        (e) => e.msg === c.err
      );
      return;
    }
    const res = COMP[c.topic](c.inp);
    close(norm(res), c.res, 'результат');
    for (const l of ['ru', 'en']) {
      lang = l;
      const s = SOLVE[c.topic](res, c.inp);
      assert.deepEqual(norm({ ans: s.ans, st: s.st, rows: s.rows, sub: s.sub }), c[l], `решение (${l})`);
    }
  });
}
