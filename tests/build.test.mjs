// Тесты сборщика: node --test
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { buildApp, bundle, BuildError } from '../build.mjs';

const FIX = path.join(import.meta.dirname, 'fixtures');

test('склейка: области видимости, as, * as, «$» в коде, CSS @import', () => {
  const html = buildApp(path.join(FIX, 'mini', 'index.html'));
  assert.ok(!html.includes('type="module"'));
  assert.match(html, /--c: #123/);
  assert.match(html, /body \{ color/);
  const js = /<script>\n([\s\S]*)<\/script>/.exec(html)?.[1] ?? '';
  const ctx = { globalThis: {} };
  ctx.globalThis = ctx;
  vm.runInNewContext(js, ctx);
  assert.deepEqual({ ...ctx.__result }, { A: 2, nameA: 'a', B: 200, money: '$& $1 $$' });
});

/** @param {Record<string,string>} files */
function tmpMods(files) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'vb-'));
  for (const [n, c] of Object.entries(files)) fs.writeFileSync(path.join(d, n), c);
  return d;
}

test('ошибки сборки понятны', () => {
  let d = tmpMods({
    'a.js': "import { b } from './b.js';\nexport const a = 1;",
    'b.js': "import { a } from './a.js';\nexport const b = 1;",
  });
  assert.throws(
    () => bundle(path.join(d, 'a.js')),
    (e) => e instanceof BuildError && /циклический импорт/.test(e.message)
  );
  d = tmpMods({ 'a.js': "import { nope } from './b.js';", 'b.js': 'export const b = 1;' });
  assert.throws(() => bundle(path.join(d, 'a.js')), /«nope» не экспортируется/);
  d = tmpMods({ 'a.js': 'export let x = 1;' });
  assert.throws(() => bundle(path.join(d, 'a.js')), /export let\/var\/default/);
  d = tmpMods({ 'a.js': 'const x = ;' });
  assert.throws(() => bundle(path.join(d, 'a.js')), /синтаксическая ошибка/);
  d = tmpMods({ 'a.js': "import { x } from 'lodash';" });
  assert.throws(() => bundle(path.join(d, 'a.js')), /только относительные пути/);
});
