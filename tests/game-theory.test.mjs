// Решатели «Макроэкономики» в Node против ответов эталона (tests/golden/game-theory.json).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { langFrom } from '../src/shared/i18n.js';
import { COMP } from '../src/apps/game-theory/solvers/compute.js';
import { SOLVE } from '../src/apps/game-theory/solvers/steps.js';

const golden = JSON.parse(fs.readFileSync(new URL('./golden/game-theory.json', import.meta.url), 'utf8'));
// та же нормализация, что при снятии эталона: без функций, ±∞/NaN строками, −0 → 0
const norm = (v) =>
  JSON.parse(
    JSON.stringify(v, (k, x) =>
      typeof x === 'function'
        ? undefined
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
      assert.deepEqual(norm({ ans: s.ans, st: s.st, rows: s.rows }), c[l], `решение (${l})`);
    }
  });
}

test('регрессия фазы 1: «камень–ножницы–бумага» 3×3 — смешанное равновесие (1/3; 1/3; 1/3)', () => {
  langFrom(() => 'ru');
  const base = golden.cases.find((c) => c.topic === 'mat').inp;
  const r = COMP.mat({ ...base, kind: 'bi', A: '0 -1 1\n1 0 -1\n-1 1 0', B: '0 1 -1\n-1 0 1\n1 -1 0' });
  assert.equal(r.bm.mixN.length, 1);
  for (const v of [...r.bm.mixN[0].x, ...r.bm.mixN[0].y]) assert.ok(Math.abs(v - 1 / 3) < 1e-9);
});

test('регрессия фазы 1: имена из ввода экранируются в шагах решения', () => {
  langFrom(() => 'ru');
  const base = golden.cases.find((c) => c.topic === 'tree').inp;
  const tr = 'A: 1 | <img src=x onerror=alert(1)> -> B | x<y -> (0; 4)\nB: 2 | L -> (-1; -1) | R -> (2; 2)';
  const res = COMP.tree({ ...base, tr });
  const s = SOLVE.tree(res, { ...base, tr });
  const html = [s.ans, ...s.st].join(' ');
  assert.ok(!html.includes('<img'), 'тег не должен попасть в HTML');
  assert.ok(html.includes('&lt;img'));
});

test('матричная игра: шаги «наилучшие ответы» — текст, а не исходный код функции (конфликт ключей s_br1/s_br2)', () => {
  for (const l of ['ru', 'en']) {
    langFrom(() => l);
    const c = golden.cases.find((x) => x.id === 'pd');
    const s = SOLVE.mat(COMP.mat(c.inp), c.inp);
    for (const line of s.st) assert.equal(typeof line, 'string');
    assert.ok(!s.st.join(' ').includes('=>'));
  }
});
