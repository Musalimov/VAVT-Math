#!/usr/bin/env node
// @ts-check
/**
 * Снимает «золотые» ответы решателей с эталонного HTML (git-тег REF,
 * по умолчанию ref/phase1): для каждого примера каждого раздела —
 * входные данные, результат COMP[раздел](вход) и текст решения
 * SOLVE[раздел](результат) на русском и английском.
 *
 *   node tests/golden/capture.mjs macroeconomics   → tests/golden/macroeconomics.json
 *
 * Запускается один раз перед переносом тренажёра в src/. Потом
 * tests/<имя>.test.mjs сверяет с этим файлом чистые решатели в Node.
 * Работает для тренажёров с COMP/SOLVE: ТВ, игры, микро, макро. Если в эталоне
 * нет таблицы SOLVE (ТВ до фазы 2), её выражение задаётся в SOLVE_EXPR.
 */
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const REF = process.env.REF || 'ref/phase1';
const app = process.argv[2];
if (!app) throw new Error('укажите тренажёр: node tests/golden/capture.mjs macroeconomics');

let html = '';
for (const p of [`legacy/${app}.html`, `${app}.html`])
  try {
    html = execFileSync('git', ['show', `${REF}:${p}`], { cwd: ROOT, maxBuffer: 64 << 20, stdio: ['ignore', 'pipe', 'ignore'] }).toString();
    break;
  } catch {}
if (!html) throw new Error(`в ${REF} нет ${app}.html`);
// доступ к внутренностям IIFE — только в этой временной копии
const i = html.lastIndexOf('})();\n</script>');
if (i < 0) throw new Error('не нашёл конец основного скрипта');
html = html.slice(0, i) + 'window.__ev=(s)=>eval(s);\n' + html.slice(i);
const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'vavt-gold-')), `${app}.html`);
fs.writeFileSync(tmp, html);

const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
const ctx = await browser.newContext();
await ctx.route(/^https?:/, (r) => r.abort());
const pg = await ctx.newPage();
await pg.goto('file://' + tmp);
const cases = await pg.evaluate((se) => {
  const ev = /** @type {any} */ (window).__ev;
  return ev(`(() => {
    const norm = (v) => JSON.parse(JSON.stringify(v, (k, x) =>
      typeof x === 'function' ? undefined :
      typeof x === 'bigint' ? x + 'n' :
      typeof x === 'number' && !isFinite(x) ? String(x) :
      typeof x === 'number' && Object.is(x, -0) ? 0 : x));
    const out = [];
    for (const t of TOPICS) for (const p of PRE[t] || []) {
      const inp = { ...S.inp[t], ...JSON.parse(JSON.stringify(p[1])) };
      const c = { topic: t, id: p[0], inp };
      // как в интерфейсе: пример становится текущим вводом раздела (некоторые SOLVE читают его)
      const keep = S.inp[t];
      S.inp[t] = inp;
      try {
        const res = COMP[t](inp);
        c.res = norm(res);
        for (const lang of ['ru', 'en']) {
          P.lang = lang;
          const s = (typeof SOLVE !== 'undefined' ? SOLVE : ${se})[t](res, inp);
          c[lang] = norm({ ans: s.ans, st: s.st, rows: s.rows, sub: s.sub });
        }
        P.lang = 'ru';
      } catch (e) { c.err = e && e.msg ? e.msg : String(e); }
      S.inp[t] = keep;
      out.push(c);
    }
    return out;
  })()`);
}, process.env.SOLVE_EXPR || 'SOLVE');
await browser.close();
const outFile = path.join(ROOT, 'tests', 'golden', `${app}.json`);
fs.writeFileSync(outFile, JSON.stringify({ app, ref: REF, cases }, null, 1) + '\n');
console.log(`${path.relative(ROOT, outFile)}: ${cases.length} примеров, ошибок ${cases.filter((c) => c.err).length}`);
