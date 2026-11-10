// «Интегралы»: анализ интеграла в Node против эталона (tests/golden/integrals.json)
// и регрессии фазы 1 (несобственные интегралы).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { langFrom } from '../src/shared/i18n.js';
import { compile } from '../src/math/expr/core.js';
import { parseFx, parseLim } from '../src/math/expr/parse.js';
import { tp } from '../src/math/expr/print.js';
import { analyzeX } from '../src/apps/integrals/solvers/analysis.js';

const golden = JSON.parse(fs.readFileSync(new URL('./golden/integrals.json', import.meta.url), 'utf8'));
langFrom(() => 'ru');

/** Задача, как её собирает setIntegral (без интерфейса). */
function task(f, as, bs) {
  const fe = parseFx(f);
  const a = parseLim(as).v,
    b = parseLim(bs).v;
  return { fe, ff: compile(fe), a, b, err: null, n: 8, rule: 'mid', R: null };
}
const summary = (R) => ({
  F: R.F ? tp(R.F, 0, 'txt') : null,
  val: R.val,
  exact: R.exact ? tp(R.exact, 0, 'txt') : null,
  how: R.how,
  div: !!R.div,
  num: R.num,
  ok: R.numOk,
});
const close = (a, b, w) => {
  if (typeof a === 'number' && typeof b === 'number')
    assert.ok(Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)), `${w}: ${a} ≠ ${b}`);
  else assert.deepEqual(a, b, w);
};

for (const c of golden.cases) {
  if (c.err || !c.id.endsWith(':D')) continue;
  test(`эталон: ${c.id} — ∫ ${c.f} от ${c.a} до ${c.b}`, () => {
    const X = task(c.f, c.a, c.b);
    analyzeX(X, true);
    const s = JSON.parse(
      JSON.stringify(summary(X.R), (k, x) => (typeof x === 'number' && !isFinite(x) ? String(x) : x))
    );
    for (const k of Object.keys(c.res)) close(s[k], c.res[k], k);
  });
}

for (const [f, a, b, v] of [
  ['1/x^1.01', '1', 'inf', 100],
  ['1/x^0.99', '0', '1', 100],
  ['1/(x*ln(x)^2)', 'e', 'inf', 1],
  ['1/x^1.5', '1', 'inf', 2],
]) {
  test(`регрессия фазы 1: ∫ ${f} от ${a} до ${b} = ${v} (сходится)`, () => {
    const X = task(f, a, b);
    analyzeX(X, true);
    assert.ok(!X.R.div, 'объявлен расходящимся');
    assert.ok(Math.abs(X.R.val - v) < 1e-6 * v, `${X.R.val}`);
    assert.notEqual(X.R.how, 'jump');
  });
}

test('tan x на [0; 2] расходится (особая точка π/2)', () => {
  const X = task('tan(x)', '0', '2');
  analyzeX(X, true);
  assert.ok(X.R.div);
});
