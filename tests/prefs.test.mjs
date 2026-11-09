// Настройки: миграция схемы 1 → 2, повреждённые данные, квота.
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadPrefs, makeSaver, migrate, SCHEMA } from '../src/shared/prefs.js';

const DEF = {
  palette: 'classic',
  colors: { bg: '#000', p1: '#111' },
  dock: 'auto',
  width: 380,
  bottomH: 46,
  ui: 'auto',
  font: 100,
  speed: 1,
  lw: 1,
  order: ['a', 'b', 'c'],
  collapsed: { c: true },
  read: {},
  float: { x: 12, y: 12 },
  show: { grid: true, hints: true },
  lang: undefined,
};
const PANELS = ['a', 'b', 'c'];
const mem = (init = {}) => {
  const m = new Map(Object.entries(init));
  return { m, getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => void m.set(k, v) };
};

test('схема 1 (настройки до фазы 2) переносится без потерь, копия — в -bak', () => {
  const v1 = {
    order: ['c', 'a', 'b'],
    read: { gdp: 1, solow: 1 },
    lang: 'en',
    ui: 'dark',
    palette: 'nord',
    colors: { p1: '#abc' },
    collapsed: { a: true },
    width: 420,
    inp: { gdp: { tab: 'x' } },
    topic: 'solow',
  };
  const st = mem({ k: JSON.stringify(v1) });
  const { prefs, status } = loadPrefs({ key: 'k', defaults: DEF, panels: PANELS, storage: st });
  assert.equal(status, 'migrated');
  assert.deepEqual(prefs.order, ['c', 'a', 'b']);
  assert.deepEqual(prefs.read, { gdp: 1, solow: 1 });
  assert.equal(prefs.lang, 'en');
  assert.equal(prefs.ui, 'dark');
  assert.equal(prefs.palette, 'nord');
  assert.deepEqual(prefs.colors, { bg: '#000', p1: '#abc' });
  assert.deepEqual(prefs.collapsed, { a: true });
  assert.equal(prefs.width, 420);
  assert.deepEqual(prefs.inp, { gdp: { tab: 'x' } });
  assert.equal(prefs.topic, 'solow');
  assert.equal(prefs.v, SCHEMA);
  assert.equal(st.m.get('k-bak'), JSON.stringify(v1));
});

test('схема 2 читается как есть, -bak не трогается', () => {
  const st = mem({ k: JSON.stringify({ ...migrate({ width: 300 }, DEF, PANELS) }) });
  const { prefs, status } = loadPrefs({ key: 'k', defaults: DEF, panels: PANELS, storage: st });
  assert.equal(status, 'ok');
  assert.equal(prefs.width, 300);
  assert.equal(st.m.has('k-bak'), false);
});

test('повреждённый JSON: настройки по умолчанию, исходная строка сохранена', () => {
  const st = mem({ k: '{bad json' });
  const { prefs, status } = loadPrefs({ key: 'k', defaults: DEF, panels: PANELS, storage: st });
  assert.equal(status, 'corrupt');
  assert.equal(prefs.width, 380);
  assert.equal(st.m.get('k-bak'), '{bad json');
});

test('нет настроек — status new', () => {
  assert.equal(loadPrefs({ key: 'k', defaults: DEF, panels: PANELS, storage: mem() }).status, 'new');
});

test('регрессия фазы 1: числа и объекты проверяются', () => {
  const p = migrate(
    {
      speed: 'fast',
      width: 'abc',
      font: 999,
      lw: 0,
      float: 5,
      collapsed: 'x',
      read: null,
      order: ['b', 'zzz', 'b'],
      colors: [1, 2],
      show: 'x',
    },
    DEF,
    PANELS
  );
  assert.equal(p.speed, 1);
  assert.equal(p.width, 380);
  assert.equal(p.font, 130);
  assert.equal(p.lw, 0.5);
  assert.deepEqual(p.float, { x: 12, y: 12 });
  assert.deepEqual(p.collapsed, {});
  assert.deepEqual(p.read, {});
  assert.deepEqual(p.order, ['b', 'a', 'c']);
  assert.deepEqual(p.colors, DEF.colors);
  assert.deepEqual(p.show, DEF.show);
});

test('квота: onFail — один раз за сеанс', () => {
  let n = 0;
  const st = {
    getItem: () => null,
    setItem: () => {
      throw new Error('QuotaExceededError');
    },
  };
  const save = makeSaver({ key: 'k', get: () => ({ a: 1 }), storage: st, onFail: () => n++ });
  save.now();
  save.now();
  save.now();
  assert.equal(n, 1);
});

test('запись: v = 2 и отложенная запись схлопывается', async () => {
  const st = mem();
  let calls = 0;
  const orig = st.setItem;
  st.setItem = (k, v) => {
    calls++;
    orig(k, v);
  };
  const save = makeSaver({ key: 'k', get: () => ({ width: 300 }), storage: st, delay: 10 });
  save();
  save();
  save();
  await new Promise((r) => setTimeout(r, 30));
  assert.equal(calls, 1);
  assert.deepEqual(JSON.parse(st.m.get('k')), { width: 300, v: SCHEMA });
});
