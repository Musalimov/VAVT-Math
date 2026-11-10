// Матядро выражений (src/math/expr): разбор, численное и символьное интегрирование.
// Регрессии фазы 1 и переноса.
import test from 'node:test';
import assert from 'node:assert/strict';
import { langFrom } from '../src/shared/i18n.js';
import { compile } from '../src/math/expr/core.js';
import { parseFx, parseLim, tokenize } from '../src/math/expr/parse.js';
import { quadF, singular } from '../src/math/expr/numeric.js';
import { solve } from '../src/math/expr/integrate.js';
import { tp } from '../src/math/expr/print.js';

langFrom(() => 'ru');
const near = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) <= eps * Math.max(1, Math.abs(b)), `${a} ≠ ${b}`);

test('пределы: «1 000» — тысяча, «1 00» и «2 3» — ошибка (фаза 1)', () => {
  assert.equal(parseLim('1 000').v, 1000);
  assert.equal(parseLim('−1 000').v, -1000);
  assert.equal(parseLim('1 000,5').v, 1000.5);
  assert.throws(() => parseLim('1 00'));
  assert.throws(() => parseLim('2 3'));
  near(parseLim('pi/2').v, Math.PI / 2);
});

test('экспоненциальная запись: 1e-3 — число, 2e-x — 2·e − x (фаза 1)', () => {
  near(compile(parseFx('1e-3*x'))(1), 0.001);
  near(compile(parseFx('2e-x'))(1), 2 * Math.E - 1);
  assert.ok(tokenize('1e3').length >= 1);
});

test('численное интегрирование: ∫₀^π sin x = 2, ∫₀¹ x² = 1/3', () => {
  near(quadF(compile(parseFx('sin(x)')), 0, Math.PI).v, 2, 1e-10);
  near(quadF(compile(parseFx('x^2')), 0, 1).v, 1 / 3, 1e-12);
});

test('особая точка 1/x на [−1; 1] находится', () => {
  const s = singular(compile(parseFx('1/x')), -1, 1);
  assert.ok(s.some((p) => Math.abs(typeof p === 'number' ? p : p.x) < 1e-9));
});

test('символьно интегрируются суммы (две sumTerms в ТВ ломали это)', () => {
  for (const [f, a, b, v] of [
    ['x^2+x', 0, 1, 5 / 6],
    ['3x^2+2x+1', 0, 1, 3],
    ['abs(2x+1)', 0, 1, 2],
  ]) {
    const r = solve(parseFx(f), a, b);
    assert.ok(r && r.F, `нет первообразной для ${f}`);
    const F = compile(r.F);
    near(F(b) - F(a), v, 1e-9);
    assert.equal(typeof tp(r.F, 0, 'txt'), 'string');
  }
});
