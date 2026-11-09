#!/usr/bin/env node
// @ts-check
/**
 * Сверка собранных тренажёров с эталоном — «поведение и вид не изменились».
 *
 *   npm run e2e                         все тренажёры
 *   npm run e2e -- macroeconomics       только указанные
 *   REF=ref/phase1 npm run e2e          другой эталон (тег или коммит)
 *
 * Эталон — HTML из git-тега REF (по умолчанию ref/phase1), кандидат — dist/.
 * Для каждого тренажёра в обоих файлах по очереди открываются все разделы
 * ([data-t]) и все примеры (#pre button); после каждого сравнивается текст
 * боковой панели и подсказки. Для первого примера каждого раздела — снимки
 * экрана: десктоп и телефон, светлая и тёмная тема, попиксельно (допуск —
 * до 50 пикселей с разницей цвета > 16: шум сглаживания на холсте).
 * Math.random подменён детерминированным генератором на обеих сторонах.
 * Шрифты Google не загружаются (сеть закрыта) — обе стороны рисуются
 * системными шрифтами, снимки детерминированы.
 *
 * Нужен Playwright: npm ci && npx playwright install chromium
 * (в песочнице без загрузки браузера: PW_CHROMIUM=/путь/к/chrome).
 */
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const REF = process.env.REF || 'ref/phase1';
const ALL = ['linear-algebra', 'integrals', 'optimization', 'probability', 'game-theory', 'microeconomics', 'macroeconomics'];
const apps = process.argv.slice(2).filter((a) => !a.startsWith('-'));
const list = apps.length ? apps : ALL;
const OUT = path.join(ROOT, 'test-results');

/** HTML эталона: в теге файл может лежать в корне (до фазы 2) или в legacy/. @param {string} app */
function refHtml(app) {
  for (const p of [`legacy/${app}.html`, `${app}.html`])
    try {
      return execFileSync('git', ['show', `${REF}:${p}`], { cwd: ROOT, maxBuffer: 64 << 20, stdio: ['ignore', 'pipe', 'ignore'] });
    } catch {}
  throw new Error(`в ${REF} нет ${app}.html`);
}

const VIEWS = [
  { name: 'desktop-light', viewport: { width: 1280, height: 800 }, scheme: 'light', mobile: false },
  { name: 'desktop-dark', viewport: { width: 1280, height: 800 }, scheme: 'dark', mobile: false },
  { name: 'phone-light', viewport: { width: 390, height: 844 }, scheme: 'light', mobile: true },
  { name: 'phone-dark', viewport: { width: 390, height: 844 }, scheme: 'dark', mobile: true },
];

/** @param {import('playwright').Page} pg */
async function settle(pg) {
  let prev = '', same = 0;
  for (let i = 0; i < 40 && same < 3; i++) {
    await pg.waitForTimeout(100);
    const cur = await pg.evaluate(() => (document.querySelector('#side')?.textContent || '') + document.body.dataset.anim);
    same = cur === prev ? same + 1 : 0;
    prev = cur;
  }
}

/**
 * Проходит все разделы и примеры, возвращает тексты и (для views) снимки.
 * @param {import('playwright').Browser} browser @param {string} file
 * @param {typeof VIEWS[number]} view @param {boolean} all  все примеры (иначе только первый в разделе)
 */
async function walk(browser, file, view, all) {
  const ctx = await browser.newContext({ viewport: view.viewport, isMobile: view.mobile, hasTouch: view.mobile, colorScheme: /** @type {any} */ (view.scheme), locale: 'ru-RU' });
  await ctx.route(/^https?:/, (r) => r.abort());
  // «Случайная матрица» и т. п. — одинаковые на обеих сторонах
  await ctx.addInitScript(() => {
    let a = 1;
    Math.random = () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  });
  const pg = await ctx.newPage();
  /** @type {string[]} */
  const errors = [];
  pg.on('pageerror', (e) => errors.push(String(e)));
  await pg.goto('file://' + file);
  await settle(pg);
  /** @type {Record<string,string>} */
  const texts = {};
  /** @type {Record<string,Buffer>} */
  const pngs = {};
  const topics = await pg.$$eval('[data-t]', (els) => els.map((e) => /** @type {HTMLElement} */ (e).dataset.t));
  for (const t of topics.length ? topics : [null]) {
    if (t) {
      await pg.click(`[data-t="${t}"]`);
      await settle(pg);
    }
    const n = await pg.$$eval('#pre button', (els) => els.length);
    for (let i = 0; i < (all ? n : Math.min(n, 1)); i++) {
      const b = pg.locator('#pre button').nth(i);
      if (!(await b.isVisible())) continue;
      await b.click();
      await settle(pg);
      const key = `${t ?? '-'}#${i}`;
      texts[key] = await pg.evaluate(() => [document.querySelector('#side')?.textContent, document.querySelector('#cap')?.textContent].join('\n§\n'));
      if (i === 0) {
        // ждём, пока картинка перестанет меняться (анимации переходов), но не дольше 3 с
        let shot = await pg.screenshot();
        for (let k = 0; k < 12; k++) {
          await pg.waitForTimeout(250);
          const next = await pg.screenshot();
          if (next.equals(shot)) break;
          shot = next;
        }
        pngs[key] = shot;
      }
    }
  }
  await ctx.close();
  return { texts, pngs, errors };
}

/** Попиксельное сравнение двух PNG в браузере (без зависимостей). @param {import('playwright').Page} pg */
async function pixelDiff(pg, /** @type {Buffer} */ a, /** @type {Buffer} */ b) {
  return pg.evaluate(
    async ([a, b]) => {
      const load = (s) => new Promise((r) => { const im = new Image(); im.onload = () => r(im); im.src = 'data:image/png;base64,' + s; });
      const [ia, ib] = /** @type {HTMLImageElement[]} */ (await Promise.all([load(a), load(b)]));
      if (ia.width !== ib.width || ia.height !== ib.height) return -1;
      const px = (im) => { const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const x = c.getContext('2d'); x.drawImage(im, 0, 0); return x.getImageData(0, 0, c.width, c.height).data; };
      const da = px(ia), db = px(ib);
      let n = 0;
      for (let i = 0; i < da.length; i += 4) if (Math.max(Math.abs(da[i] - db[i]), Math.abs(da[i + 1] - db[i + 1]), Math.abs(da[i + 2] - db[i + 2])) > 16) n++;
      return n;
    },
    [a.toString('base64'), b.toString('base64')]
  );
}

const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
const cmpPage = await browser.newPage();
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'vavt-ref-'));
let failed = 0;
for (const app of list) {
  const cand = path.join(ROOT, 'dist', `${app}.html`);
  if (!fs.existsSync(cand)) throw new Error(`нет ${path.relative(ROOT, cand)} — сначала npm run build`);
  const ref = path.join(tmp, `${app}.html`);
  fs.writeFileSync(ref, refHtml(app));
  /** @type {string[]} */
  const problems = [];
  let cases = 0, shots = 0;
  for (const [vi, view] of VIEWS.entries()) {
    const withText = vi === 0; // тексты сравниваем один раз — на десктопе
    const [r, c] = await Promise.all([walk(browser, ref, view, withText), walk(browser, cand, view, withText)]);
    if (c.errors.length) problems.push(`${view.name}: ошибки JS: ${c.errors.slice(0, 3).join(' | ')}`);
    if (withText) {
      for (const k of new Set([...Object.keys(r.texts), ...Object.keys(c.texts)])) {
        cases++;
        if (r.texts[k] !== c.texts[k]) {
          const ra = (r.texts[k] ?? '').split('\n'), ca = (c.texts[k] ?? '').split('\n');
          const i = ra.findIndex((l, j) => l !== ca[j]);
          problems.push(`текст ${k}, строка ${i + 1}:\n      было:  ${ra[i]?.slice(0, 160)}\n      стало: ${ca[i]?.slice(0, 160)}`);
        }
      }
    }
    for (const k of Object.keys(r.pngs)) {
      shots++;
      const d = c.pngs[k] ? await pixelDiff(cmpPage, r.pngs[k], c.pngs[k]) : -1;
      // ≤ 50 пикс. — шум растеризации холста (сглаживание по краю), не изменение
      if (d < 0 || d > 50) {
        problems.push(`снимок ${view.name} ${k}: ${d < 0 ? 'другой размер / нет снимка' : `${d} пикс. отличаются`}`);
        fs.mkdirSync(OUT, { recursive: true });
        fs.writeFileSync(path.join(OUT, `${app}-${view.name}-${k.replace(/\W/g, '_')}-ref.png`), r.pngs[k]);
        if (c.pngs[k]) fs.writeFileSync(path.join(OUT, `${app}-${view.name}-${k.replace(/\W/g, '_')}-new.png`), c.pngs[k]);
      }
    }
  }
  console.log(`${problems.length ? '✗' : '✓'} ${app}: ${cases} примеров, ${shots} снимков${problems.length ? '' : ' — совпадают'}`);
  for (const p of problems.slice(0, 15)) console.log('    ' + p);
  if (problems.length) failed++;
}
await browser.close();
fs.rmSync(tmp, { recursive: true, force: true });
if (failed) {
  console.log(`\nОтличия в ${failed} тренажёр(ах); снимки — в test-results/.`);
  process.exit(1);
}
