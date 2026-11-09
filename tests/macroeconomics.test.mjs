// Решатели «Макроэкономики» в Node против ответов эталона (tests/golden/macroeconomics.json).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { langFrom } from '../src/shared/i18n.js';
import { COMP } from '../src/apps/macroeconomics/solvers/compute.js';
import { SOLVE } from '../src/apps/macroeconomics/solvers/steps.js';

const golden = JSON.parse(fs.readFileSync(new URL('./golden/macroeconomics.json', import.meta.url), 'utf8'));
// та же нормализация, что при снятии эталона: без функций, ±∞/NaN строками, −0 → 0
const norm = (v) =>
  JSON.parse(JSON.stringify(v, (k, x) => (typeof x === 'function' ? undefined : typeof x === 'number' && !isFinite(x) ? String(x) : Object.is(x, -0) ? 0 : x)));

// Числа — с относительной точностью 1e-12: Math.pow и т. п. в Node и в браузере
// могут расходиться в последнем бите (разные версии V8), это не изменение кода.
function close(a, b, where = '') {
  if (typeof a === 'number' && typeof b === 'number') {
    assert.ok(Math.abs(a - b) <= 1e-12 * Math.max(1, Math.abs(a), Math.abs(b)), `${where}: ${a} ≠ ${b}`);
  } else if (a && b && typeof a === 'object' && typeof b === 'object') {
    assert.deepEqual(Object.keys(a).sort(), Object.keys(b).sort(), `${where}: набор полей`);
    for (const k of Object.keys(a)) close(a[k], b[k], `${where}.${k}`);
  } else assert.equal(a, b, where);
}

for (const c of golden.cases) {
  test(`${c.topic} / ${c.id}`, () => {
    let lang = 'ru';
    langFrom(() => lang);
    if (c.err) {
      assert.throws(() => COMP[c.topic](c.inp), (e) => e.msg === c.err);
      return;
    }
    const res = COMP[c.topic](c.inp);
    close(norm(res), c.res, 'результат');
    for (const l of ['ru', 'en']) {
      lang = l;
      const s = SOLVE[c.topic](res);
      assert.deepEqual(norm({ ans: s.ans, st: s.st, rows: s.rows }), c[l], `решение (${l})`);
    }
  });
}

test('регрессия фазы 1: IS–LM при d = 0 — понятная ошибка, а не «MPC…»', () => {
  langFrom(() => 'ru');
  const islm = golden.cases.find((c) => c.topic === 'islm');
  assert.throws(() => COMP.islm({ ...islm.inp, d: '0' }), (e) => e.msg === 'islmD');
  assert.throws(() => COMP.islm({ ...islm.inp, f: '0' }), (e) => e.msg === 'islmF');
  assert.throws(() => COMP.islm({ ...islm.inp, b: '1' }), (e) => e.msg === 'mpc');
});
