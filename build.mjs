#!/usr/bin/env node
// @ts-check
/**
 * Сборка тренажёров в dist/ — без зависимостей, только Node ≥ 20.
 *
 *   node build.mjs           собрать dist/
 *   node build.mjs --watch   собирать заново при каждом изменении src/ и legacy/
 *
 * Что делает:
 * 1. legacy/*.html — тренажёры, ещё не перенесённые в src/, копируются как есть.
 * 2. src/apps/<имя>/index.html — каркас тренажёра. В нём:
 *      <link rel="stylesheet" href="./app.css">        → <style>…</style>
 *      <script type="module" src="./app.js"></script>  → <script>…</script>
 *    CSS: @import "../../shared/x.css"; раскрывается рекурсивно.
 *    JS: ES-модули склеиваются в один скрипт (см. bundle()).
 * 3. Статика из STATIC копируется в dist/ (скриншоты для лендинга, .nojekyll).
 *
 * Итог — dist/<имя>.html: один самодостаточный файл, который открывается
 * двойным щелчком (file://). type="module" с file:// браузеры не загружают,
 * поэтому сборка обязательна, а в исходниках — обычные ES-модули, которые
 * напрямую понимают Node (тесты) и редактор.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, 'src');
const LEGACY = path.join(ROOT, 'legacy');
const DIST = path.join(ROOT, 'dist');
const STATIC = ['screenshots', '.nojekyll'];

/** Ошибка сборки с понятным сообщением (без стека). */
export class BuildError extends Error {}

/* ---------- JS: склейка ES-модулей ---------- */

// Поддерживаемый (намеренно узкий) синтаксис — в начале строки:
//   import { a, b as c } from './x.js';
//   import * as ns from './x.js';
//   export function f() {}   export async function f() {}   export class C {}
//   export const x = …;
//   export { a, b as c };
// Одно объявление на export const (не «export const a = 1, b = 2»).
// Запрещено: export let/var (живые привязки не переносятся), export default,
// динамический import(), импорт не по относительному пути.
const RE_IMPORT = /^import\s*(?:\{([^}]*)\}|\*\s+as\s+([A-Za-z_$][\w$]*))\s*from\s*['"]([^'"]+)['"];?[ \t]*$/gm;
const RE_EXPORT_DECL = /^export\s+(async\s+function\*?|function\*?|class|const)\s+([A-Za-z_$][\w$]*)/gm;
const RE_EXPORT_LIST = /^export\s*\{([^}]*)\};?[ \t]*$/gm;
const RE_BAD_EXPORT = /^export\s+(let|var|default)\b/m;

/**
 * @typedef {{ id: string, file: string, code: string,
 *   imports: { names: [string, string][] | null, ns: string | null, from: string }[],
 *   exports: [string, string][] }} Mod
 */

/** @param {string} list  «a, b as c» → [['a','a'],['b','c']] (локальное имя, внешнее имя) */
function parseList(list) {
  return list
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const m = /^([A-Za-z_$][\w$]*)(?:\s+as\s+([A-Za-z_$][\w$]*))?$/.exec(s);
      if (!m) throw new BuildError(`не понял «${s}» в списке импорта/экспорта`);
      return /** @type {[string, string]} */ ([m[1], m[2] || m[1]]);
    });
}

/** @param {string} file @returns {Mod} */
function readModule(file) {
  let code = fs.readFileSync(file, 'utf8');
  const rel = path.relative(ROOT, file);
  if (RE_BAD_EXPORT.test(code)) throw new BuildError(`${rel}: export let/var/default не поддерживаются — используйте export const/function/class`);
  if (/\bimport\s*\(/.test(code)) throw new BuildError(`${rel}: динамический import() не поддерживается`);
  /** @type {Mod['imports']} */
  const imports = [];
  code = code.replace(RE_IMPORT, (_, list, ns, from) => {
    if (!from.startsWith('.')) throw new BuildError(`${rel}: импорт «${from}» — разрешены только относительные пути`);
    const target = path.resolve(path.dirname(file), from);
    imports.push({ names: list ? parseList(list).map(([a, b]) => [a, b]) : null, ns: ns || null, from: target });
    return '';
  });
  /** @type {[string, string][]} */
  const exports = [];
  code = code.replace(RE_EXPORT_DECL, (_, kind, name) => {
    exports.push([name, name]);
    return `${kind} ${name}`;
  });
  code = code.replace(RE_EXPORT_LIST, (_, list) => {
    for (const [local, ext] of parseList(list)) exports.push([local, ext]);
    return '';
  });
  if (/^\s*(import|export)\b/m.test(code)) throw new BuildError(`${rel}: остался import/export в неподдерживаемой форме`);
  return { id: '', file, code, imports, exports };
}

/**
 * Склеивает граф модулей в один скрипт. Каждый модуль — в своей области
 * видимости, поэтому одинаковые внутренние имена в разных модулях не
 * конфликтуют:
 *   const __m1 = (() => { const { a } = __m0; …код…; return { x, y }; })();
 * Порядок — топологический (зависимости раньше), циклы — ошибка.
 * @param {string} entry абсолютный путь к входному модулю
 */
export function bundle(entry) {
  /** @type {Map<string, Mod>} */
  const mods = new Map();
  /** @type {Mod[]} */
  const order = [];
  /** @type {string[]} */
  const stack = [];
  const visit = (/** @type {string} */ file) => {
    if (mods.has(file)) {
      if (stack.includes(file)) throw new BuildError(`циклический импорт: ${[...stack, file].map((f) => path.relative(ROOT, f)).join(' → ')}`);
      return;
    }
    if (!fs.existsSync(file)) throw new BuildError(`нет файла ${path.relative(ROOT, file)}${stack.length ? ` (импорт из ${path.relative(ROOT, stack[stack.length - 1])})` : ''}`);
    const m = readModule(file);
    mods.set(file, m);
    stack.push(file);
    for (const imp of m.imports) visit(imp.from);
    stack.pop();
    m.id = `__m${order.length}`;
    order.push(m);
  };
  visit(path.resolve(entry));

  const parts = order.map((m) => {
    const head = m.imports
      .map((imp) => {
        const dep = /** @type {Mod} */ (mods.get(imp.from));
        if (imp.ns) return `const ${imp.ns} = ${dep.id};`;
        const names = /** @type {[string, string][]} */ (imp.names);
        for (const [ext] of names)
          if (!dep.exports.some(([, e]) => e === ext))
            throw new BuildError(`${path.relative(ROOT, m.file)}: «${ext}» не экспортируется из ${path.relative(ROOT, dep.file)}`);
        return `const { ${names.map(([ext, local]) => (ext === local ? ext : `${ext}: ${local}`)).join(', ')} } = ${dep.id};`;
      })
      .join('\n');
    const ret = `return { ${m.exports.map(([local, ext]) => (local === ext ? local : `${ext}: ${local}`)).join(', ')} };`;
    return `/* ${path.relative(ROOT, m.file)} */\nconst ${m.id} = (() => {\n${head}\n${m.code}\n${ret}\n})();`;
  });
  const js = `(() => {\n'use strict';\n${parts.join('\n')}\n})();\n`;
  try {
    new Function(js); // только синтаксическая проверка, код не выполняется
  } catch (e) {
    throw new BuildError(`синтаксическая ошибка в собранном скрипте (${path.relative(ROOT, entry)}): ${/** @type {Error} */ (e).message}`);
  }
  return js;
}

/* ---------- CSS ---------- */

/** @param {string} file @param {Set<string>} [seen] */
export function inlineCss(file, seen = new Set()) {
  const abs = path.resolve(file);
  if (seen.has(abs)) return '';
  seen.add(abs);
  if (!fs.existsSync(abs)) throw new BuildError(`нет файла ${path.relative(ROOT, abs)}`);
  return fs
    .readFileSync(abs, 'utf8')
    .replace(/^@import\s+(?:url\()?['"]([^'"]+)['"]\)?\s*;[ \t]*$/gm, (_, p) =>
      p.startsWith('.') ? inlineCss(path.resolve(path.dirname(abs), p), seen) : _
    );
}

/* ---------- HTML ---------- */

/** @param {string} htmlFile каркас src/apps/<имя>/index.html */
export function buildApp(htmlFile) {
  const dir = path.dirname(htmlFile);
  let html = fs.readFileSync(htmlFile, 'utf8');
  let nCss = 0, nJs = 0;
  // Замены — функцией, чтобы «$» в коде не трактовался как шаблон замены.
  html = html.replace(/<link\s+rel="stylesheet"\s+href="(\.[^"]+)"\s*\/?>/g, (_, href) => {
    nCss++;
    return `<style>\n${inlineCss(path.resolve(dir, href))}</style>`;
  });
  html = html.replace(/<script\s+type="module"\s+src="(\.[^"]+)"\s*><\/script>/g, (_, src) => {
    nJs++;
    return `<script>\n${bundle(path.resolve(dir, src))}</script>`;
  });
  if (!nJs) throw new BuildError(`${path.relative(ROOT, htmlFile)}: нет <script type="module" src="./…">`);
  if (/<script\s+type="module"/.test(html)) throw new BuildError(`${path.relative(ROOT, htmlFile)}: остался type="module" — он не работает с file://`);
  return html;
}

/* ---------- сборка целиком ---------- */

/** @param {string} from @param {string} to */
function copyRecursive(from, to) {
  const st = fs.statSync(from);
  if (st.isDirectory()) {
    fs.mkdirSync(to, { recursive: true });
    for (const f of fs.readdirSync(from)) copyRecursive(path.join(from, f), path.join(to, f));
  } else fs.copyFileSync(from, to);
}

export function buildAll({ quiet = false } = {}) {
  const t0 = performance.now();
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });
  /** @type {string[]} */
  const built = [];
  const appsDir = path.join(SRC, 'apps');
  const apps = fs.existsSync(appsDir) ? fs.readdirSync(appsDir).filter((a) => fs.existsSync(path.join(appsDir, a, 'index.html'))) : [];
  for (const a of apps) {
    fs.writeFileSync(path.join(DIST, `${a}.html`), buildApp(path.join(appsDir, a, 'index.html')));
    built.push(`${a}.html (src)`);
  }
  if (fs.existsSync(LEGACY))
    for (const f of fs.readdirSync(LEGACY).filter((f) => f.endsWith('.html'))) {
      if (apps.includes(f.replace(/\.html$/, ''))) throw new BuildError(`${f} есть и в src/apps, и в legacy/ — удалите старую версию из legacy/`);
      fs.copyFileSync(path.join(LEGACY, f), path.join(DIST, f));
      built.push(`${f} (legacy)`);
    }
  for (const s of STATIC) if (fs.existsSync(path.join(ROOT, s))) copyRecursive(path.join(ROOT, s), path.join(DIST, s));
  if (!quiet) console.log(`dist/: ${built.join(', ')} — ${Math.round(performance.now() - t0)} мс`);
  return built;
}

/* ---------- запуск ---------- */

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const run = () => {
    try {
      buildAll();
      return true;
    } catch (e) {
      if (e instanceof BuildError) console.error(`Ошибка сборки: ${e.message}`);
      else console.error(e);
      return false;
    }
  };
  const ok = run();
  if (process.argv.includes('--watch')) {
    console.log('Слежу за src/ и legacy/ (Ctrl+C — выход)…');
    /** @type {NodeJS.Timeout | undefined} */
    let t;
    for (const d of [SRC, LEGACY])
      if (fs.existsSync(d))
        fs.watch(d, { recursive: true }, () => {
          clearTimeout(t);
          t = setTimeout(run, 80);
        });
  } else if (!ok) process.exit(1);
}
