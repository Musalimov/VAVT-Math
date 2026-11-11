import { createEconApp } from '../../shared/econ/app.js';
import { createGlossary } from '../../shared/glossary.js';
import { initDrawers } from '../../shared/drawers.js';
import { createKeys, onShortcut } from '../../shared/keys.js';
import { KEYS } from './content/keys.js';
import { applyTexts, createSettings } from '../../shared/settings.js';
import { createExport } from '../../shared/export.js';
import { createPanels } from '../../shared/panels.js';
import { loadPrefs, makeSaver } from '../../shared/prefs.js';
import { SOLVE, fracB, nP, sb, zLin } from './solvers/steps.js';
import { COMP, nI } from './solvers/compute.js';
import { fQ, fT } from './solvers/format.js';
import { FORMS, PRE, TOPICS } from './content/topics.js';
import { CHAP, DEMOS, FORMAL, ILL, REL, TERMS } from './content/glossary.js';
import { T } from './content/tx.js';
import {
  Cnk,
  PhiInv,
  PhiN,
  bA,
  bC,
  bPow,
  bStr,
  bf,
  binom,
  diceDist,
  distOf,
  gcdB,
  genBinom,
  genGeom,
  genHyper,
  jointStats,
  numIn,
  parseJoint,
  parseSeries,
  phiG,
  poiss,
  polyEvents,
  r2,
  rowNums,
  seriesStats,
} from './solvers/theory.js';
import { CL, notationFrom } from './solvers/notation.js';
import { mark, meth, solve, step } from '../../math/expr/integrate.js';
import { dropConst } from '../../math/expr/poly.js';
import { quadF } from '../../math/expr/numeric.js';
import { PRINT, hp, numH } from '../../math/expr/print.js';
import { hasInf, parse, parseFx } from '../../math/expr/parse.js';
import { fNsci as fN } from '../../shared/format.js';
import { toFrac } from '../../math/expr/core.js';
import {
  asFactors,
  fromFactors,
  linAst,
  linOf,
  padd,
  pdeg,
  pder,
  pdiv,
  pmul,
  polyAst,
  polyOf,
  ppow,
  pscale,
  ptrim,
  pval,
  sumTerms,
  tidy,
} from '../../math/expr/poly.js';
import {
  D,
  Nn,
  OPS,
  X,
  add,
  compile,
  div,
  fn,
  has,
  isN,
  isNum,
  key,
  mul,
  neg,
  pow,
  powParts,
  replKey,
  simp,
  snap,
  sqrtAst,
  sub,
  subst,
} from '../../math/expr/core.js';
import { closeDrawers } from '../../shared/drawers.js';
import { openDrawer } from '../../shared/drawers.js';
import { toast } from '../../shared/toast.js';
import { clone } from '../../shared/dom.js';
import { $ } from '../../shared/dom.js';
import { dc } from '../../shared/format.js';
import { fmt } from '../../shared/format.js';
import { lang, langFrom } from '../../shared/i18n.js';
(() => {
  'use strict';
  /* ---------- математическое ядро: выражения ---------- */
  // AST: ['n',v] ['v',name] ['c','pi'|'e'] ['+',a,b] ['-',a,b] ['*',a,b] ['/',a,b] ['^',a,b] ['neg',a] ['f',name,a]

  /* ---------- вычисление ---------- */

  /* ---------- производная ---------- */

  /* ---------- многочлены ---------- */

  /* ---------- множители и приведение ---------- */

  /* ---------- разбор ввода ---------- */

  /* ---------- печать ---------- */

  /* текст, LaTeX и SymPy */

  /* ---------- численное интегрирование (tanh-sinh) ---------- */

  /* поиск особых точек на конечном отрезке */

  /* ---------- символьное интегрирование с шагами ---------- */

  /* --- правила --- */

  /* --- запуск и проверка --- */

  /* ---------- математика теории вероятностей ---------- */

  /* точнее: ряд и цепная дробь */

  /* ---------- разбор чисел ---------- */
  /* число из поля: «1 000» и «1 000,5» — разряды через пробел (ровно по 3 цифры); две десятичные точки («0,1,2», «1.5.2»)
   и числа через пробел («2 3») — ошибка, а не молчаливое «0,1» или «6» */

  /* ---------- ряд распределения ---------- */

  /* ---------- двумерная таблица ---------- */

  /* ---------- комбинаторика (точно, BigInt) ---------- */

  /* ---------- кубики ---------- */
  /* индекс = сумма */
  /* ---------- независимые события ---------- */

  /* ---------- справочник ---------- */

  const KEY = 'prob-viz-v1';

  const PAL = {
    classic: {
      bg: '#0b0c10',
      bgGrid: '#262b33',
      axis: '#f2f2f2',
      bar: '#58c4dd',
      sel: '#f4d345',
      curve: '#ff7aa8',
      area: '#83c167',
      aux: '#ff9f43',
      mark: '#c77dff',
      F: '#fc6255',
    },
    paper: {
      bg: '#fbfaf7',
      bgGrid: '#e3e1da',
      axis: '#23262b',
      bar: '#2b6cb0',
      sel: '#c98a00',
      curve: '#c0398b',
      area: '#3f9a3a',
      aux: '#e67e22',
      mark: '#8e44ad',
      F: '#d1453b',
    },
    neon: {
      bg: '#07020f',
      bgGrid: '#1f1533',
      axis: '#ffffff',
      bar: '#4dd2ff',
      sel: '#fff35c',
      curve: '#ff9ecf',
      area: '#39ff88',
      aux: '#ffa53d',
      mark: '#a98bff',
      F: '#ff4d6d',
    },
    nord: {
      bg: '#2e3440',
      bgGrid: '#3b4252',
      axis: '#eceff4',
      bar: '#88c0d0',
      sel: '#ebcb8b',
      curve: '#e5a0c0',
      area: '#a3be8c',
      aux: '#d08770',
      mark: '#b48ead',
      F: '#bf616a',
    },
  };

  const PANELS = ['topic', 'presets', 'solve', 'values', 'show', 'export'];
  const DEF = {
    palette: 'classic',
    colors: { ...PAL.classic },
    dock: 'auto',
    width: 380,
    bottomH: 46,
    ui: 'auto',
    font: 100,
    speed: 1,
    lw: 1,
    order: PANELS.slice(),
    collapsed: { export: true },
    read: {},
    float: { x: 12, y: 12 },
    show: { bgGrid: true, coords: true, labels: true, approx: true, sigma: true, Fplot: true, hints: true },
    topic: 'bern',
    inp: null,
    preset: null,
  };

  notationFrom(() => ECON.P.nota);

  // настройки: схема 2, миграция со схемы 1, -bak, предупреждение при переполнении (src/shared/prefs.js)

  /* ---------- числа ---------- */

  /* ---------- примеры ---------- */

  /* ---------- формы ---------- */

  const OPTL = (k, o) => {
    const L = T();
    const m = {
      ...L.opt,
      ev: L.ev,
      meth: L.mt,
      mode: S.topic === 'dsv' ? L.dm : L.nm,
      cond: L.cd,
      q: { ...L.nq, fmg: L.nq.fm.replace('X <', 'X >'), fsg: L.nq.fs.replace('X <', 'X >') },
    }[k];
    return m ? m[o] : o;
  };
  const ECON = createEconApp({
    appName: 'probability',
    get CHAP() {
      return CHAP;
    },
    get COMP() {
      return COMP;
    },
    get DEF() {
      return DEF;
    },
    get DEMOS() {
      return DEMOS;
    },
    get FORMAL() {
      return FORMAL;
    },
    get FORMS() {
      return FORMS;
    },
    get ILL() {
      return ILL;
    },
    get KEY() {
      return KEY;
    },
    get KEYS() {
      return KEYS;
    },
    get PAL() {
      return PAL;
    },
    get PANELS() {
      return PANELS;
    },
    get PRE() {
      return PRE;
    },
    get REL() {
      return REL;
    },
    get S() {
      return S;
    },
    get T() {
      return T;
    },
    get TERMS() {
      return TERMS;
    },
    get TOG() {
      return TOG;
    },
    get TOPICS() {
      return TOPICS;
    },
    get applyLang() {
      return applyLang;
    },
    get buildToggles() {
      return buildToggles;
    },
    get frame() {
      return frame;
    },
    get illSvg() {
      return illSvg;
    },
    get loadPreset() {
      return loadPreset;
    },
    get prop() {
      return prop;
    },
    get recompute() {
      return recompute;
    },
    get relTogs() {
      return relTogs;
    },
    get renderAll() {
      return renderAll;
    },
    get renderCaption() {
      return renderCaption;
    },
    get renderForm() {
      return renderForm;
    },
    get renderNow() {
      return renderNow;
    },
    get renderPresets() {
      return renderPresets;
    },
    get renderTex() {
      return renderTex;
    },
    get syncTogVis() {
      return syncTogVis;
    },
  });
  const S = {
    topic: ECON.P.topic || 'comb',
    inp: {},
    res: null,
    err: null,
    preset: ECON.P.preset || null,
    stamp: false,
  };

  function renderForm() {
    const box = $('#form'),
      L = T(),
      t = S.topic,
      I = S.inp[t];
    box.innerHTML = '';
    for (const [k, type, a, b] of FORMS[t]) {
      const show = typeof a === 'function' ? a : typeof b === 'function' ? b : null;
      if (show && !show(I)) continue;
      const lbl = L.f[k === 'n' && t === 'dsv' ? 'n' : k] || k;
      if (type === 'txt') {
        const l = document.createElement('label');
        l.className = 'full';
        l.textContent = T().f['txt_' + k] || (t === 'dvu' ? 'X\\Y' : t === 'bayes' ? T().f.hyp : 'X, p');
        box.appendChild(l);
        const ta = document.createElement('textarea');
        ta.value = I[k] || '';
        ta.dataset.k = k;
        ta.spellcheck = false;
        box.appendChild(ta);
        continue;
      }
      const l = document.createElement('label');
      l.textContent = t === 'nsv' && k === 'fx' && !I.C ? 'f(x)' : k === 'fx' && I.C ? 'g(x)' : lbl;
      box.appendChild(l);
      let el;
      if (type === 'sel') {
        el = document.createElement('select');
        for (const o of a) {
          const op = document.createElement('option');
          op.value = o;
          op.textContent = OPTL(k, o);
          el.appendChild(op);
        }
        el.value = I[k];
      } else if (type === 'chk') {
        el = document.createElement('input');
        el.type = 'checkbox';
        el.checked = !!I[k];
        el.style.width = 'auto';
        l.textContent = L.f.C;
      } else {
        el = document.createElement('input');
        el.type = 'text';
        el.value = I[k] == null ? '' : I[k];
        el.spellcheck = false;
        el.autocomplete = 'off';
      }
      el.dataset.k = k;
      box.appendChild(el);
    }
    document.querySelectorAll('#topicSeg button').forEach((b) => {
      b.classList.toggle('on', b.dataset.t === t);
      b.title = L.tt[b.dataset.t];
    });
    $('#notaRow').style.display = ['bern', 'norm'].includes(t) ? '' : 'none';
    document
      .querySelectorAll('#notaSeg button')
      .forEach((b) => b.classList.toggle('on', b.dataset.v === (ECON.P.nota || 'vavt')));
  }
  document.querySelectorAll('#notaSeg button').forEach(
    (b) =>
      (b.onclick = () => {
        ECON.P.nota = b.dataset.v;
        ECON.save();
        renderForm();
        recompute();
      })
  );
  let fT0 = 0;
  $('#form').addEventListener('input', (e) => {
    const k = e.target.dataset.k;
    if (!k) return;
    S.inp[S.topic][k] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    S.preset = null;
    if (e.target.tagName === 'SELECT' || e.target.type === 'checkbox') {
      renderForm();
      recompute();
      return;
    }
    clearTimeout(fT0);
    fT0 = setTimeout(recompute, 250);
  });
  document
    .querySelectorAll('#topicSeg button')
    .forEach((b) => (b.onclick = () => ECON.setTopic(b.dataset.t)));

  function loadPreset(id) {
    for (const t of TOPICS) {
      const p = PRE[t].find((z) => z[0] === id);
      if (p) {
        S.topic = t;
        ECON.P.topic = t;
        S.inp[t] = { ...S.inp[t], ...clone(p[1]) };
        S.preset = id;
        renderForm();
        recompute();
        return;
      }
    }
  }
  /* ---------- вычисления ---------- */

  function recompute() {
    const t = S.topic,
      I = S.inp[t];
    S.err = null;
    S.res = null;
    try {
      S.res = COMP[t](I);
    } catch (e) {
      S.err = e;
      if (e instanceof Error) {
        console.error(e);
        S.err = { msg: 'bug' };
      } else if (!e || !e.msg) S.err = { msg: 'num' };
    }
    ECON.P.inp = S.inp;
    ECON.P.preset = S.preset;
    ECON.save();
    renderAll();
  }
  /* ---------- панели ---------- */

  /* ---------- решение ---------- */

  function renderSolve() {
    const box = $('#solve'),
      L = T();
    if (S.err) {
      const f = L.err[S.err.msg];
      box.innerHTML = `<p class="note err">${typeof f === 'function' ? f(S.err.x) : f || L.err.num}</p>`;
      return;
    }
    const r = SOLVE[S.topic](S.res, S.inp[S.topic]);
    S.ans = r.ans;
    box.innerHTML = `<p class="idea">${L.tt[S.topic]}</p>${ECON.ol(r.st)}<div class="ans"><div class="k">${L.ans}</div><div class="big">${r.ans}</div>${r.sub ? `<p class="note" style="margin:.2rem 0 0">${r.sub}</p>` : ''}</div>`;
  }
  function prop(k, v, s) {
    return `<div class="prop"><span class="k">${k}</span><span class="v">${v}</span>${s ? `<span class="s">${s}</span>` : ''}</div>`;
  }
  function renderValues() {
    const box = $('#props'),
      V = T().v;
    if (S.err || !S.res) {
      box.innerHTML = '';
      return;
    }
    const R = S.res;
    let h = '';
    if (['comb', 'clas', 'ops', 'bayes'].includes(S.topic)) h = valsNew(R, S.topic);
    else if (S.topic === 'bern') {
      h +=
        prop(V.np, fN(R.np)) +
        prop(V.npq, fN(R.npq)) +
        prop('√(npq)', fN(R.sq, 4)) +
        prop(V.k, R.kstar.join(', '));
      if (R.ev !== 'mode') {
        h += prop(V.P, fN(R.meth === 'bern' ? R.exact : R.approx, 5), T().mt[R.meth]);
        if (R.meth !== 'bern') h += prop(T().ex, fN(R.exact, 5));
      }
    } else if (S.topic === 'dsv' && R.mode === 'prop')
      h +=
        prop('M(Z)', fQ(R.MZ)) +
        prop('D(Z)', fQ(R.DZ)) +
        prop('σ(Z)', fN(R.sZ, 4)) +
        prop('cov(X, Y)', fQ(R.cov));
    else if (S.topic === 'dsv') {
      const s = R.st;
      h +=
        prop(V.M, fQ(s.M)) +
        prop(V.D, fQ(s.D)) +
        prop(V.s, fN(s.s, 4)) +
        prop(V.mod, s.modes.map((v) => fN(v)).join(', ')) +
        prop(V.sum, fN(R.sum, 6));
    } else if (S.topic === 'dvu') {
      const s = R.st;
      h +=
        prop(V.Mx, fQ(s.sx.M)) +
        prop(V.My, fQ(s.sy.M)) +
        prop(V.Dx, fQ(s.sx.D)) +
        prop(V.Dy, fQ(s.sy.D)) +
        prop(V.cov, fQ(s.cov)) +
        prop(V.r, fN(s.r, 4)) +
        prop(V.ind, s.indep ? V.yes : V.no);
    } else if (S.topic === 'nsv') {
      h +=
        (R.kind === 'f' ? prop(V.C, fQ(R.C)) : '') +
        prop(V.M, fQ(R.M)) +
        prop(V.D, fQ(R.D)) +
        prop(V.s, fN(R.s, 4)) +
        prop(V.mod, fN(R.mode, 3)) +
        prop(V.med, fN(R.med, 4)) +
        (R.Pab !== null ? prop(V.P, fQ(R.Pab)) : '');
    } else {
      h += prop('m', fN(R.m, 4)) + prop('σ', fN(R.s, 4)) + prop('σ²', fN(R.s * R.s, 4));
      if (R.P != null) h += prop(V.P, fN(R.P, 4), T().appr) + prop(T().ex, fN(R.Pe, 5));
      if (R.xq != null) h += prop('x_p', fN(R.xq, 4));
    }
    box.innerHTML = h;
  }
  function renderPresets() {
    const box = $('#pre');
    box.innerHTML = '';
    PRE[S.topic].forEach(([id, , ru, en]) => {
      const b = document.createElement('button');
      b.className = 'chip' + (S.preset === id ? ' on' : '');
      b.dataset.pre = id;
      b.textContent = lang() === 'ru' ? ru : en;
      box.appendChild(b);
    });
  }

  function renderCaption() {
    const cap = $('#cap');
    $('#capOpen').hidden = !!ECON.P.show.hints;
    if (!ECON.P.show.hints) {
      cap.hidden = true;
      return;
    }
    cap.hidden = false;
    $('#capT').textContent = S.err
      ? T().cap.err
      : S.topic === 'dsv' && S.res && S.res.mode === 'prop'
        ? T().cap.prop
        : T().cap[S.topic];
  }
  function renderAll() {
    syncTogVis();
    renderSolve();
    renderValues();
    renderPresets();
    ECON.renderOverlay();
    renderCaption();
    renderTex();
    const fe = $('#fErr');
    fe.hidden = !S.err;
    if (S.err) {
      const f = T().err[S.err.msg];
      fe.textContent = typeof f === 'function' ? f(S.err.x) : f || T().err.num;
    }
    ECON.req();
  }

  /* ---------- сцена ---------- */

  function frame(r, x0, x1, y0, y1, opt = {}) {
    const c = ECON.P.colors,
      X = (x) => r.x + ((x - x0) / (x1 - x0)) * r.w,
      Y = (y) => r.y + r.h - ((y - y0) / (y1 - y0)) * r.h;
    const sx = opt.xs || ECON.niceStep((x1 - x0) / Math.max(2, r.w / 80)),
      sy = ECON.niceStep((y1 - y0) / Math.max(2, r.h / 50));
    if (ECON.P.show.bgGrid) {
      ECON.ctx.strokeStyle = c.bgGrid;
      ECON.ctx.lineWidth = 1;
      ECON.ctx.beginPath();
      for (let x = Math.ceil(x0 / sx) * sx; x <= x1 + 1e-9; x += sx) {
        const px = Math.round(X(x)) + 0.5;
        ECON.ctx.moveTo(px, r.y);
        ECON.ctx.lineTo(px, r.y + r.h);
      }
      for (let y = Math.ceil(y0 / sy) * sy; y <= y1 + 1e-9; y += sy) {
        const py = Math.round(Y(y)) + 0.5;
        ECON.ctx.moveTo(r.x, py);
        ECON.ctx.lineTo(r.x + r.w, py);
      }
      ECON.ctx.stroke();
    }
    ECON.ctx.strokeStyle = c.axis;
    ECON.ctx.globalAlpha = 0.6;
    ECON.ctx.lineWidth = 1.2;
    ECON.ctx.beginPath();
    ECON.ctx.moveTo(r.x, Y(Math.max(y0, 0)));
    ECON.ctx.lineTo(r.x + r.w, Y(Math.max(y0, 0)));
    if (x0 <= 0 && x1 >= 0 && !opt.noYA) {
      ECON.ctx.moveTo(X(0), r.y);
      ECON.ctx.lineTo(X(0), r.y + r.h);
    }
    ECON.ctx.stroke();
    ECON.ctx.globalAlpha = 1;
    if (ECON.P.show.coords) {
      ECON.ctx.fillStyle = c.axis;
      ECON.ctx.globalAlpha = 0.7;
      ECON.ctx.font = '500 11px Manrope, system-ui, sans-serif';
      ECON.ctx.textAlign = 'center';
      ECON.ctx.textBaseline = 'top';
      const dx = Math.max(0, -Math.floor(Math.log10(sx)));
      if (!opt.noX)
        for (let x = Math.ceil(x0 / sx) * sx; x <= x1 + 1e-9; x += sx)
          ECON.ctx.fillText(dc(fmt(x, dx)), X(x), Y(Math.max(y0, 0)) + 4);
      ECON.ctx.textAlign = 'right';
      ECON.ctx.textBaseline = 'middle';
      const dy = Math.max(0, -Math.floor(Math.log10(sy)));
      for (let y = Math.ceil(y0 / sy) * sy; y <= y1 + 1e-9; y += sy) {
        if (Math.abs(y) < sy / 2) continue;
        ECON.ctx.fillText(dc(fmt(y, dy)), r.x - 4, Y(y));
      }
      ECON.ctx.globalAlpha = 1;
    }
    if (opt.title) ECON.txt(opt.title, r.x + 6, r.y + 8, c.axis, 13, 'left', 'middle', true);
    return { X, Y, r, x0, x1 };
  }
  function plotFn(fr, f, col, w, dash, a, b) {
    const lo = a === undefined ? fr.x0 : a,
      hi = b === undefined ? fr.x1 : b;
    ECON.ctx.strokeStyle = col;
    ECON.ctx.lineWidth = w;
    ECON.ctx.setLineDash(dash || []);
    ECON.ctx.beginPath();
    let pen = false;
    const N = Math.max(60, Math.round((fr.r.w * (hi - lo)) / (fr.x1 - fr.x0) / 1.5));
    for (let i = 0; i <= N; i++) {
      const x = lo + ((hi - lo) * i) / N,
        y = f(x);
      if (!isFinite(y)) {
        pen = false;
        continue;
      }
      const X = fr.X(x),
        Y = Math.max(fr.r.y - 20, Math.min(fr.r.y + fr.r.h + 20, fr.Y(y)));
      if (!pen) {
        ECON.ctx.moveTo(X, Y);
        pen = true;
      } else ECON.ctx.lineTo(X, Y);
    }
    ECON.ctx.stroke();
    ECON.ctx.setLineDash([]);
  }
  function fillFn(fr, f, a, b, col, al = 0.38) {
    a = Math.max(a, fr.x0);
    b = Math.min(b, fr.x1);
    if (!(b > a)) return;
    const N = Math.max(30, Math.round((fr.r.w * (b - a)) / (fr.x1 - fr.x0)));
    ECON.ctx.beginPath();
    ECON.ctx.moveTo(fr.X(a), fr.Y(0));
    for (let i = 0; i <= N; i++) {
      const x = a + ((b - a) * i) / N,
        y = f(x);
      ECON.ctx.lineTo(fr.X(x), fr.Y(isFinite(y) ? y : 0));
    }
    ECON.ctx.lineTo(fr.X(b), fr.Y(0));
    ECON.ctx.closePath();
    ECON.ctx.globalAlpha = al;
    ECON.ctx.fillStyle = col;
    ECON.ctx.fill();
    ECON.ctx.globalAlpha = 1;
  }
  function vline(fr, x, col, lab, dash = [5, 4]) {
    if (x < fr.x0 || x > fr.x1) return;
    const X = fr.X(x);
    ECON.ctx.strokeStyle = col;
    ECON.ctx.lineWidth = 1.5;
    ECON.ctx.setLineDash(dash);
    ECON.ctx.beginPath();
    ECON.ctx.moveTo(X, fr.r.y);
    ECON.ctx.lineTo(X, fr.r.y + fr.r.h);
    ECON.ctx.stroke();
    ECON.ctx.setLineDash([]);
    if (lab) ECON.txt(lab, X, fr.r.y + 10, col, 13);
  }
  function layout(two) {
    const pT = Math.min(96, ECON.H * 0.17),
      pB = Math.min(70, ECON.H * 0.12),
      pl = 46,
      pr = 24,
      h = ECON.H - pT - pB;
    if (!two) return [{ x: pl, y: pT, w: ECON.W - pl - pr, h }];
    const g = 26,
      h1 = h * 0.62,
      h2 = h - h1 - g;
    return [
      { x: pl, y: pT, w: ECON.W - pl - pr, h: h1 },
      { x: pl, y: pT + h1 + g, w: ECON.W - pl - pr, h: h2 },
    ];
  }
  function renderNow() {
    ECON.ctx.setTransform(ECON.DPR, 0, 0, ECON.DPR, 0, 0);
    const c = ECON.P.colors;
    ECON.ctx.fillStyle = c.bg;
    ECON.ctx.fillRect(0, 0, ECON.W, ECON.H);
    S.lay = null;
    if (!S.res || S.err || !ECON.W) return;
    ({
      comb: drawComb,
      clas: drawClas,
      ops: drawOps,
      bayes: drawBayes,
      bern: drawBern,
      dsv: drawDsv,
      dvu: drawDvu,
      nsv: drawNsv,
      norm: drawNorm,
    })[S.topic](S.res);
    if (S.stamp) {
      const t = (S.ans || '').replace(/<[^>]+>/g, '');
      ECON.ctx.font = '600 15px "Source Serif 4", Georgia, serif';
      const w = ECON.ctx.measureText(t).width + 20;
      ECON.ctx.fillStyle = c.bg;
      ECON.ctx.globalAlpha = 0.85;
      ECON.ctx.fillRect(ECON.W - w - 12, ECON.H - 38, w, 28);
      ECON.ctx.globalAlpha = 1;
      ECON.ctx.fillStyle = c.axis;
      ECON.ctx.textAlign = 'left';
      ECON.ctx.textBaseline = 'middle';
      ECON.ctx.fillText(t, ECON.W - w - 2, ECON.H - 24);
    }
  }
  function drawBern(R) {
    const c = ECON.P.colors;
    let k0 = 0,
      k1 = R.n;
    if (R.n > 40) {
      k0 = Math.max(0, Math.floor(R.np - 5 * Math.max(R.sq, 1)));
      k1 = Math.min(R.n, Math.ceil(R.np + 5 * Math.max(R.sq, 1)));
    }
    if (['eq', 'rng', 'ge', 'le'].includes(R.ev)) {
      k0 = Math.min(k0, Math.max(0, R.k1 - 2));
      k1 = Math.max(k1, Math.min(R.n, R.k2 + 2));
      if (k1 - k0 > 400) {
        k0 = Math.max(0, Math.floor(R.np - 5 * R.sq));
        k1 = Math.min(R.n, Math.ceil(R.np + 5 * R.sq));
      }
    }
    S.barsN = k1 - k0 + 1;
    syncTogVis();
    let ym = 0;
    for (let k = k0; k <= k1; k++) ym = Math.max(ym, binom(R.n, R.p, k));
    const [r] = layout(false);
    const fr = frame(r, k0 - 0.6, k1 + 0.6, 0, ym * 1.18, {
      noYA: true,
      title: `P${sb(R.n)}(k)`,
      xs: Math.max(1, ECON.niceStep((k1 - k0) / Math.max(2, r.w / 60))),
    });
    const bw = Math.max(1, fr.X(1) - fr.X(0)) * 0.72,
      inEv = (k) => (R.ev === 'mode' ? R.kstar.includes(k) : k >= (R.ev === 'one' ? 1 : R.k1) && k <= R.k2);
    for (let k = k0; k <= k1; k++) {
      const v = binom(R.n, R.p, k),
        x = fr.X(k),
        y = fr.Y(v),
        sel = inEv(k);
      ECON.ctx.fillStyle = sel ? c.sel : c.bar;
      ECON.ctx.globalAlpha = sel ? 0.9 : 0.55;
      ECON.ctx.fillRect(x - bw / 2, y, bw, fr.Y(0) - y);
      ECON.ctx.globalAlpha = 1;
      if (ECON.P.show.labels && k1 - k0 <= 16 && v > ym * 0.02)
        ECON.txt(dc(fmt(v, 3)), x, y - 9, sel ? c.sel : c.axis, 11);
    }
    if (ECON.P.show.approx && R.n >= 8) {
      if (R.np <= 10 && R.p < 0.3) {
        ECON.ctx.fillStyle = c.curve;
        for (let k = k0; k <= k1; k++) {
          const v = poiss(R.np, k);
          ECON.ctx.beginPath();
          ECON.ctx.arc(fr.X(k), fr.Y(v), 3.2, 0, 7);
          ECON.ctx.fill();
        }
        ECON.txt(
          'Пуассон'.replace('Пуассон', lang() === 'ru' ? 'Пуассон' : 'Poisson'),
          r.x + r.w - 6,
          r.y + 10,
          c.curve,
          13,
          'right'
        );
      } else if (R.sq > 0) {
        plotFn(fr, (x) => phiG((x - R.np) / R.sq) / R.sq, c.curve, 2.2 * ECON.P.lw, [7, 5]);
        ECON.txt(
          lang() === 'ru' ? 'Муавр–Лаплас' : 'de Moivre–Laplace',
          r.x + r.w - 6,
          r.y + 10,
          c.curve,
          13,
          'right'
        );
      }
    }
    if (ECON.P.show.sigma) vline(fr, R.np, c.mark, 'np');
  }
  function stepsF(fr, x, p, col) {
    let acc = 0;
    ECON.ctx.strokeStyle = col;
    ECON.ctx.lineWidth = 2.2 * ECON.P.lw;
    const xs = [fr.x0, ...x, fr.x1];
    for (let i = 0; i < xs.length - 1; i++) {
      const y = fr.Y(acc);
      ECON.ctx.beginPath();
      ECON.ctx.moveTo(fr.X(xs[i]), y);
      ECON.ctx.lineTo(fr.X(xs[i + 1]), y);
      ECON.ctx.stroke();
      if (i > 0) {
        ECON.ctx.fillStyle = col;
        ECON.ctx.beginPath();
        ECON.ctx.arc(fr.X(xs[i]), y, 3.5, 0, 7);
        ECON.ctx.fill();
      }
      if (i < x.length) {
        ECON.ctx.strokeStyle = col;
        ECON.ctx.fillStyle = ECON.P.colors.bg;
        ECON.ctx.beginPath();
        ECON.ctx.arc(fr.X(xs[i + 1]), y, 3.5, 0, 7);
        ECON.ctx.fill();
        ECON.ctx.stroke();
        acc += p[i];
      }
    }
  }
  function drawDsv(R) {
    if (R.mode === 'prop') return drawProp(R);
    const c = ECON.P.colors,
      two = ECON.P.show.Fplot,
      [r1, r2] = layout(two);
    const x0 = R.x[0],
      x1 = R.x[R.x.length - 1],
      pad = Math.max(1, (x1 - x0) * 0.12),
      ym = Math.max(...R.p);
    const fr = frame(r1, x0 - pad, x1 + pad, 0, ym * 1.2, { title: 'P(X = xᵢ)' });
    const bw = Math.min(18, Math.max(3, ((fr.X(x1) - fr.X(x0)) / Math.max(1, R.x.length)) * 0.3));
    if (ECON.P.show.sigma) {
      const s = R.st;
      const a = fr.X(s.M - s.s),
        b = fr.X(s.M + s.s);
      ECON.ctx.fillStyle = c.mark;
      ECON.ctx.globalAlpha = 0.12;
      ECON.ctx.fillRect(a, r1.y, b - a, r1.h);
      ECON.ctx.globalAlpha = 1;
      vline(fr, s.M, c.mark, 'M(X)');
    }
    ECON.ctx.strokeStyle = c.bar;
    ECON.ctx.lineWidth = 2 * ECON.P.lw;
    ECON.ctx.beginPath();
    R.x.forEach((x, i) => {
      const X = fr.X(x),
        Y = fr.Y(R.p[i]);
      i ? ECON.ctx.lineTo(X, Y) : ECON.ctx.moveTo(X, Y);
    });
    ECON.ctx.stroke();
    R.x.forEach((x, i) => {
      const X = fr.X(x),
        Y = fr.Y(R.p[i]),
        md = R.st.modes.includes(x);
      ECON.ctx.fillStyle = md ? c.sel : c.bar;
      ECON.ctx.globalAlpha = 0.45;
      ECON.ctx.fillRect(X - bw / 2, Y, bw, fr.Y(0) - Y);
      ECON.ctx.globalAlpha = 1;
      ECON.ctx.beginPath();
      ECON.ctx.arc(X, Y, 4, 0, 7);
      ECON.ctx.fill();
      if (ECON.P.show.labels && R.x.length <= 14)
        ECON.txt(dc(fmt(R.p[i], 3)), X, Y - 11, md ? c.sel : c.axis, 11);
    });
    if (two) {
      const f2 = frame(r2, x0 - pad, x1 + pad, 0, 1.08, { title: 'F(x)' });
      stepsF(f2, R.x, R.p, c.F);
    }
  }
  function drawProp(R) {
    const c = ECON.P.colors,
      cx = ECON.W / 2,
      y = Math.min(150, ECON.H * 0.25);
    ECON.txt(`Z = ${zLin(R.a, R.b, R.c)}`, cx, y, c.axis, 24, 'center', 'middle', true);
    const lines = [
      [`M(Z) = a·M(X) + b·M(Y) + c = ${fT(R.MZ)}`, c.mark],
      [`D(Z) = a²D(X) + b²D(Y) + 2ab·cov = ${fT(R.DZ)}`, c.F],
      [`σ(Z) = ${fT(R.sZ)}`, c.bar],
    ];
    lines.forEach(([s, col], i) => ECON.txt(s, cx, y + 56 + i * 40, col, 18));
    if (ECON.P.show.sigma && R.sZ > 0) {
      const r = { x: 70, y: y + 200, w: ECON.W - 140, h: 60 };
      const fr = frame(r, R.MZ - 3.2 * R.sZ, R.MZ + 3.2 * R.sZ, 0, 1, { noYA: true });
      [
        [2, 0.1],
        [1, 0.22],
      ].forEach(([k, al]) => {
        ECON.ctx.fillStyle = c.mark;
        ECON.ctx.globalAlpha = al;
        ECON.ctx.fillRect(fr.X(R.MZ - k * R.sZ), r.y, fr.X(R.MZ + k * R.sZ) - fr.X(R.MZ - k * R.sZ), r.h);
        ECON.ctx.globalAlpha = 1;
      });
      vline(fr, R.MZ, c.mark, 'M(Z)');
      ECON.txt('M ± σ', fr.X(R.MZ + R.sZ * 0.5), r.y + r.h - 12, c.mark, 12);
      ECON.txt('M ± 2σ', fr.X(R.MZ + R.sZ * 1.5), r.y + r.h - 12, c.mark, 12);
    }
  }
  function drawDvu(R) {
    const c = ECON.P.colors,
      J = R.J,
      s = R.st,
      nr = J.x.length,
      nc = J.y.length;
    const pT = Math.min(100, ECON.H * 0.17),
      pB = Math.min(70, ECON.H * 0.12),
      cw = Math.min(90, (ECON.W - 120) / (nc + 1.6)),
      ch = Math.min(64, (ECON.H - pT - pB - 40) / (nr + 1.6)),
      x0 = (ECON.W - cw * (nc + 1.3)) / 2 + 30,
      y0 = pT + 26;
    const pm = Math.max(...J.P.flat(), 1e-9);
    ECON.ctx.font = '600 14px "Source Serif 4", Georgia, serif';
    ECON.txt('X \\ Y', x0 - 34, y0 - 16, c.axis, 13);
    J.y.forEach((y, j) => ECON.txt(dc(fmt(y, 3)), x0 + cw * j + cw / 2, y0 - 16, c.aux, 14));
    J.x.forEach((x, i) => ECON.txt(dc(fmt(x, 3)), x0 - 26, y0 + ch * i + ch / 2, c.bar, 14));
    for (let i = 0; i < nr; i++)
      for (let j = 0; j < nc; j++) {
        const v = J.P[i][j],
          X = x0 + cw * j,
          Y = y0 + ch * i;
        ECON.ctx.fillStyle = c.area;
        ECON.ctx.globalAlpha = 0.12 + (0.6 * v) / pm;
        ECON.ctx.fillRect(X + 2, Y + 2, cw - 4, ch - 4);
        ECON.ctx.globalAlpha = 1;
        if (ECON.P.show.labels) ECON.txt(dc(fmt(v, 4)), X + cw / 2, Y + ch / 2, c.axis, 14);
      }
    if (R.cond) {
      ECON.ctx.strokeStyle = c.sel;
      ECON.ctx.lineWidth = 3;
      if (R.cond.given === 'X') {
        const Y = y0 + ch * R.cond.idx;
        ECON.ctx.strokeRect(x0, Y, cw * nc, ch);
      } else {
        const X = x0 + cw * R.cond.idx;
        ECON.ctx.strokeRect(X, y0, cw, ch * nr);
      }
    }
    const mx = x0 + cw * nc + 14,
      bwMax = cw * 0.9;
    s.px.forEach((v, i) => {
      const Y = y0 + ch * i;
      ECON.ctx.fillStyle = c.bar;
      ECON.ctx.globalAlpha = 0.6;
      ECON.ctx.fillRect(mx, Y + ch * 0.25, bwMax * v, ch * 0.5);
      ECON.ctx.globalAlpha = 1;
      if (ECON.P.show.labels) ECON.txt(dc(fmt(v, 4)), mx + bwMax * v + 4, Y + ch / 2, c.bar, 12, 'left');
    });
    ECON.txt('pₓ', mx + 10, y0 - 16, c.bar, 13);
    const my = y0 + ch * nr + 12,
      bh = ch * 0.9;
    s.py.forEach((v, j) => {
      const X = x0 + cw * j;
      ECON.ctx.fillStyle = c.aux;
      ECON.ctx.globalAlpha = 0.6;
      ECON.ctx.fillRect(X + cw * 0.25, my, cw * 0.5, bh * v);
      ECON.ctx.globalAlpha = 1;
      if (ECON.P.show.labels) ECON.txt(dc(fmt(v, 4)), X + cw / 2, my + bh * v + 10, c.aux, 12);
    });
    ECON.txt('pᵧ', x0 - 26, my + 12, c.aux, 13);
  }
  function drawNsv(R) {
    const c = ECON.P.colors,
      two = ECON.P.show.Fplot,
      [r1, r2] = layout(two);
    let lo = R.lo,
      hi = R.hi;
    const L = hi - lo,
      pad = L * 0.18;
    let ym = 0;
    for (let i = 0; i <= 300; i++) {
      const v = R.f(lo + (L * i) / 300);
      if (isFinite(v)) ym = Math.max(ym, v);
    }
    const fr = frame(r1, lo - pad, hi + pad, 0, ym * 1.2 || 1, { title: 'f(x)' });
    S.lay = { fr, kind: 'nsv' };
    if (R.Pab !== null) fillFn(fr, R.f, Math.min(R.al, R.be), Math.max(R.al, R.be), c.area);
    plotFn(fr, R.f, c.bar, 2.6 * ECON.P.lw);
    if (ECON.P.show.sigma) {
      vline(fr, R.M, c.mark, 'M');
      ECON.ctx.fillStyle = c.mark;
      ECON.ctx.globalAlpha = 0.1;
      ECON.ctx.fillRect(fr.X(R.M - R.s), r1.y, fr.X(R.M + R.s) - fr.X(R.M - R.s), r1.h);
      ECON.ctx.globalAlpha = 1;
    }
    if (R.Pab !== null) {
      vline(fr, R.al, c.sel, 'α', []);
      vline(fr, R.be, c.sel, 'β', []);
    }
    if (two) {
      const f2 = frame(r2, lo - pad, hi + pad, 0, 1.08, { title: 'F(x)' });
      plotFn(f2, R.F, c.F, 2.4 * ECON.P.lw);
      vline(f2, R.med, c.mark, 'x_med');
    }
  }
  function drawNorm(R) {
    const c = ECON.P.colors,
      [r] = layout(false),
      m = R.m,
      s = R.s;
    const fr = frame(r, m - 4 * s, m + 4 * s, 0, (phiG(0) / s) * 1.2, {
      title: `N(${dc(fmt(m, 3))}; ${dc(fmt(s, 3))}²)`,
    });
    S.lay = { fr, kind: 'norm' };
    const f = (x) => phiG((x - m) / s) / s;
    if (ECON.P.show.sigma)
      for (const k of [1, 2, 3]) {
        for (const sg of [-1, 1]) {
          const x = m + sg * k * s,
            X = fr.X(x);
          ECON.ctx.strokeStyle = c.mark;
          ECON.ctx.globalAlpha = 0.5;
          ECON.ctx.setLineDash([3, 4]);
          ECON.ctx.beginPath();
          ECON.ctx.moveTo(X, fr.Y(f(x)));
          ECON.ctx.lineTo(X, fr.Y(0));
          ECON.ctx.stroke();
          ECON.ctx.setLineDash([]);
          ECON.ctx.globalAlpha = 1;
          ECON.txt(`${sg < 0 ? '−' : '+'}${k}σ`, X, fr.Y(0) - 10, c.mark, 11);
        }
      }
    fillFn(fr, f, R.lo === -Infinity ? m - 4 * s : R.lo, R.hi === Infinity ? m + 4 * s : R.hi, c.area);
    plotFn(fr, f, c.bar, 2.6 * ECON.P.lw);
    vline(fr, m, c.mark, 'm');
    for (const x of [R.lo, R.hi])
      if (isFinite(x)) vline(fr, x, c.sel, ECON.P.show.labels ? dc(fmt(x, 3)) : '', []);
    if (ECON.P.show.labels && R.P != null) {
      const mid = Math.max(
        m - 4 * s,
        Math.min(
          m + 4 * s,
          isFinite(R.lo) && isFinite(R.hi) ? (R.lo + R.hi) / 2 : isFinite(R.lo) ? R.lo + s : R.hi - s
        )
      );
      ECON.txt(`P ≈ ${dc(fmt(R.P, 4))}`, fr.X(mid), fr.Y(f(mid) * 0.45), c.axis, 15);
    }
  }
  /* перетаскивание границ */
  let drag = null;
  const pos = (e) => {
    const r = ECON.cv.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  function handles() {
    const L = S.lay,
      R = S.res;
    if (!L || !R) return [];
    if (L.kind === 'nsv' && R.Pab !== null)
      return [
        ['al', R.al],
        ['be', R.be],
      ];
    if (L.kind === 'norm') {
      if (R.q === 'rng')
        return [
          ['x1', R.x1],
          ['x2', R.x2],
        ];
      if (R.q === 'lt' || R.q === 'gt') return [['x1', R.x1]];
    }
    return [];
  }
  ECON.cv.addEventListener('pointerdown', (e) => {
    const p = pos(e),
      L = S.lay;
    if (!L) return;
    for (const [k, v] of handles()) {
      if (Math.abs(L.fr.X(v) - p.x) < 12) {
        drag = k;
        ECON.cv.setPointerCapture(e.pointerId);
        ECON.cv.style.cursor = 'ew-resize';
        return;
      }
    }
  });
  ECON.cv.addEventListener('pointermove', (e) => {
    const p = pos(e),
      L = S.lay;
    if (!drag) {
      ECON.cv.style.cursor =
        L && handles().some(([, v]) => Math.abs(L.fr.X(v) - p.x) < 12) ? 'ew-resize' : 'default';
      return;
    }
    const fr = L.fr;
    let x = fr.x0 + ((p.x - fr.r.x) / fr.r.w) * (fr.x1 - fr.x0);
    const st = ECON.niceStep((fr.x1 - fr.x0) / 40);
    x = Math.round(x / st) * st;
    x = +x.toFixed(6);
    S.inp[S.topic][drag] = dc(String(x));
    S.preset = null;
    const el = document.querySelector(`#form [data-k="${drag}"]`);
    if (el) el.value = S.inp[S.topic][drag];
    recompute();
  });
  const endD = () => {
    drag = null;
    ECON.cv.style.cursor = 'default';
  };
  ECON.cv.addEventListener('pointerup', endD);
  ECON.cv.addEventListener('pointercancel', endD);
  /* ---------- переключатели ---------- */
  const TOG = ['bgGrid', 'coords', 'labels', 'approx', 'sigma', 'Fplot', 'hints'];
  function buildToggles() {
    const box = $('#tog');
    box.innerHTML = '';
    TOG.forEach((k) => {
      const l = document.createElement('label');
      l.className = 'chk';
      l.innerHTML = `<input type="checkbox" data-k="${k}"> <span>${T().tog[k]}</span>`;
      l.querySelector('input').onchange = (e) => {
        ECON.P.show[k] = e.target.checked;
        ECON.save();
        renderCaption();
        ECON.req();
      };
      box.appendChild(l);
    });
  }

  function relTogs() {
    const t = S.topic,
      I = S.inp[t] || {};
    const G = ['bgGrid', 'coords'];
    const m = {
      comb: ['labels'],
      clas: I.cmode === 'dice' ? [...G, 'labels'] : ['labels'],
      ops: I.omode === 'indep' ? [...G, 'labels'] : ['labels'],
      bayes: ['labels'],
      bern: [...G, ...(S.barsN > 17 ? [] : ['labels']), 'approx', 'sigma'],
      dsv: I.mode === 'prop' ? ['coords', 'sigma'] : [...G, 'labels', 'sigma', 'Fplot'],
      dvu: ['labels'],
      nsv: [...G, 'sigma', 'Fplot'],
      norm: [...G, 'labels', 'sigma'],
    };
    return [...(m[t] || []), 'hints'];
  }
  function syncTogVis() {
    const r = relTogs();
    document.querySelectorAll('#tog label').forEach((l) => {
      const k = l.querySelector('input').dataset.k;
      l.style.display = r.includes(k) ? '' : 'none';
    });
  }

  /* ---------- обозначения Φ / Φ₀ ---------- */

  /* ---------- дроби BigInt ---------- */

  /* ---------- 1. комбинаторика ---------- */

  /* ---------- 2. классическая ---------- */

  /* ---------- 3. сложение и умножение ---------- */

  /* ---------- 4. полная вероятность и Байес ---------- */

  function valsNew(R, t) {
    const V = T().v;
    if (t === 'comb') return prop('N', bStr(R.val)) + prop(T().v.dig, String(R.val.toString().length));
    if (t === 'clas') return prop('m', bStr(R.num)) + prop('n', bStr(R.den)) + prop('P', fN(R.P, 5));
    if (t === 'ops')
      return R.mode === 'two'
        ? prop('P(A + B)', fQ(R.sum)) +
            prop('P(AB)', fQ(R.pab)) +
            prop('P(A | B)', fQ(R.agb)) +
            prop('P(B | A)', fQ(R.bga)) +
            prop(V.ind, R.indep ? V.yes : V.no)
        : R.c.map((v, k) => prop(`P(${T().v.ex} ${k})`, fN(v, 5))).join('');
    return (
      prop('P(A)', fQ(R.PA, 5)) +
      R.post
        .map((v, i) =>
          prop(
            `P(H${sb(i + 1)} | ${R.bev === 'notA' ? 'Ā' : 'A'})`,
            fQ(v, 4),
            `${T().v.prior}: ${fN(R.pr[i], 4)}`
          )
        )
        .join('')
    );
  }
  /* ---------- сцены ---------- */
  const COLS = () => [
    ECON.P.colors.bar,
    ECON.P.colors.aux,
    ECON.P.colors.area,
    ECON.P.colors.curve,
    ECON.P.colors.mark,
    ECON.P.colors.sel,
    ECON.P.colors.F,
  ];
  function box(x, y, w, h, col, al = 0.25) {
    ECON.ctx.fillStyle = col;
    ECON.ctx.globalAlpha = al;
    ECON.ctx.fillRect(x, y, w, h);
    ECON.ctx.globalAlpha = 1;
    ECON.ctx.strokeStyle = col;
    ECON.ctx.lineWidth = 1.6;
    ECON.ctx.strokeRect(x + 0.5, y + 0.5, w, h);
  }
  function drawComb(R) {
    const c = ECON.P.colors,
      pT = Math.min(110, ECON.H * 0.2);
    let slots = [],
      tail = '';
    const k = R.kind,
      n = R.n,
      kk = R.k;
    if (k === 'perm') slots = Array.from({ length: n }, (_, i) => n - i);
    else if (k === 'arr' || k === 'comb') slots = Array.from({ length: kk }, (_, i) => n - i);
    else if (k === 'arrRep') slots = Array.from({ length: kk }, () => n);
    else if (k === 'prod') slots = R.list.slice();
    if (k === 'comb') tail = `÷ ${kk}!`;
    if (k === 'combRep') {
      slots = Array.from({ length: kk }, (_, i) => n + kk - 1 - i);
      tail = `÷ ${kk}!`;
    }
    if (k === 'permRep') {
      slots = Array.from({ length: R.n }, (_, i) => R.n - i);
      tail = `÷ ${R.list.map((v) => v + '!').join('·')}`;
    }
    const show = slots.length > 10 ? [...slots.slice(0, 4), '…', ...slots.slice(-3)] : slots,
      bw = Math.min(78, (ECON.W - 120) / Math.max(4, show.length * 1.35)),
      gap = bw * 0.35,
      tw = show.length * bw + (show.length - 1) * gap,
      x0 = (ECON.W - tw) / 2,
      y0 = pT + 20;
    show.forEach((v, i) => {
      const x = x0 + i * (bw + gap);
      if (v === '…') {
        ECON.txt('…', x + bw / 2, y0 + bw / 2, c.axis, 22);
        return;
      }
      box(x, y0, bw, bw, COLS()[i % 7]);
      ECON.txt(String(v), x + bw / 2, y0 + bw / 2, c.axis, Math.min(22, bw * 0.4));
      if (i < show.length - 1) ECON.txt('×', x + bw + gap / 2, y0 + bw / 2, c.axis, 16);
      if (ECON.P.show.labels) ECON.txt(`${i + 1}`, x + bw / 2, y0 + bw + 12, c.axis, 11);
    });
    if (tail) ECON.txt(tail, ECON.W / 2, y0 + bw + 40, c.sel, 18);
    ECON.txt(`= ${bStr(R.val)}`, ECON.W / 2, y0 + bw + (tail ? 72 : 44), c.sel, 22);
    if (
      ECON.P.show.labels &&
      (k === 'perm' || k === 'arr' || k === 'comb' || k === 'arrRep') &&
      R.val <= 60n &&
      n <= 8
    ) {
      const items = [],
        let_ = 'ABCDEFGH';
      const rec = (cur, used) => {
        if (cur.length === (k === 'perm' ? n : kk)) {
          items.push(cur.join(''));
          return;
        }
        for (let i = 0; i < n; i++) {
          if (k !== 'arrRep' && used[i]) continue;
          if (k === 'comb' && cur.length && let_.indexOf(cur[cur.length - 1]) > i) continue;
          used[i] = 1;
          rec([...cur, let_[i]], used);
          used[i] = 0;
        }
      };
      rec([], []);
      const cols = Math.min(10, Math.ceil(Math.sqrt(items.length * 2))),
        cw = Math.min(90, (ECON.W - 80) / cols),
        yy = y0 + bw + 110;
      items
        .slice(0, 60)
        .forEach((s, i) =>
          ECON.txt(s, 40 + cw * (i % cols) + cw / 2, yy + Math.floor(i / cols) * 24, c.bar, 15)
        );
    }
  }
  function drawGauge(p, y, lab) {
    const c = ECON.P.colors,
      w = Math.min(520, ECON.W - 120),
      x = (ECON.W - w) / 2;
    box(x, y, w, 26, c.axis, 0.06);
    ECON.ctx.fillStyle = c.sel;
    ECON.ctx.globalAlpha = 0.8;
    ECON.ctx.fillRect(x, y, w * p, 26);
    ECON.ctx.globalAlpha = 1;
    ECON.txt(lab, ECON.W / 2, y + 46, c.sel, 18);
  }
  function drawClas(R) {
    const c = ECON.P.colors,
      pT = Math.min(110, ECON.H * 0.2);
    if (R.m === 'dice') {
      const [r] = layout(false),
        d = R.d,
        lo = R.s,
        hi = 6 * R.s,
        ym = Math.max(...d) / R.tot;
      const fr = frame(r, lo - 0.6, hi + 0.6, 0, ym * 1.2, {
        noYA: true,
        title: `P(${lang() === 'ru' ? 'сумма' : 'sum'} = s)`,
        xs: R.s > 3 ? 2 : 1,
      });
      const bw = (fr.X(1) - fr.X(0)) * 0.72;
      for (let s = lo; s <= hi; s++) {
        const v = d[s] / R.tot,
          sel = R.dev === 'eq' ? s === R.v : R.dev === 'ge' ? s >= R.v : s <= R.v,
          X = fr.X(s),
          Y = fr.Y(v);
        ECON.ctx.fillStyle = sel ? c.sel : c.bar;
        ECON.ctx.globalAlpha = sel ? 0.9 : 0.5;
        ECON.ctx.fillRect(X - bw / 2, Y, bw, fr.Y(0) - Y);
        ECON.ctx.globalAlpha = 1;
        if (ECON.P.show.labels && hi - lo <= 16) ECON.txt(String(d[s]), X, Y - 9, sel ? c.sel : c.axis, 11);
      }
      return;
    }
    if (R.m === 'mn') {
      const n = R.tot,
        cols = Math.ceil(Math.sqrt(n * 1.8)),
        cs = Math.min(36, (ECON.W - 120) / cols, (ECON.H * 0.45) / Math.ceil(n / cols)),
        x0 = (ECON.W - cols * cs) / 2;
      if (n <= 600)
        for (let i = 0; i < n; i++) {
          const x = x0 + (i % cols) * cs,
            y = pT + 20 + Math.floor(i / cols) * cs;
          ECON.ctx.fillStyle = i < R.fav ? c.sel : c.bar;
          ECON.ctx.globalAlpha = i < R.fav ? 0.85 : 0.35;
          ECON.ctx.fillRect(x + 1, y + 1, cs - 2, cs - 2);
          ECON.ctx.globalAlpha = 1;
        }
      drawGauge(R.P, ECON.H - Math.min(140, ECON.H * 0.24), `P = ${R.fav}/${R.tot}`);
      return;
    }
    const tot = R.N,
      rad = Math.max(5, Math.min(16, Math.sqrt((ECON.W * ECON.H * 0.18) / Math.max(tot, 1)) / 2.4)),
      per = Math.max(1, Math.floor((ECON.W - 120) / (rad * 2.6)));
    let i = 0,
      x0 = 60,
      y0 = pT + 20;
    R.a.forEach((cnt, ci) => {
      for (let j = 0; j < Math.min(cnt, 400); j++, i++) {
        const x = x0 + (i % per) * rad * 2.6 + rad,
          y = y0 + Math.floor(i / per) * rad * 2.6 + rad;
        ECON.ctx.fillStyle = COLS()[ci % 7];
        ECON.ctx.beginPath();
        ECON.ctx.arc(x, y, rad, 0, 7);
        ECON.ctx.fill();
      }
    });
    const rows = Math.ceil(Math.min(i, 400 * R.a.length) / per),
      yy = y0 + rows * rad * 2.6 + 24;
    const pat = R.cev === 'exact' ? R.terms[0] : null;
    ECON.txt(
      (lang() === 'ru' ? 'Берём ' : 'Draw ') +
        R.n +
        (pat ? (lang() === 'ru' ? ': нужно ' : ': need ') + pat.join(' + ') : ''),
      ECON.W / 2,
      yy,
      c.axis,
      16
    );
    drawGauge(Math.min(1, R.P), yy + 28, `P = ${fracB(R.num, R.den).replace(/ ≈ .*/, '')} ≈ ${fT(R.P, 4)}`);
  }
  function drawOps(R) {
    const c = ECON.P.colors;
    if (R.mode === 'two') {
      const cx = ECON.W / 2,
        cy = Math.min(ECON.H * 0.52, ECON.H - 180),
        r = Math.min(ECON.W * 0.18, ECON.H * 0.26),
        d = r * 0.95;
      ECON.ctx.globalAlpha = 0.25;
      ECON.ctx.fillStyle = c.bar;
      ECON.ctx.beginPath();
      ECON.ctx.arc(cx - d / 2, cy, r, 0, 7);
      ECON.ctx.fill();
      ECON.ctx.fillStyle = c.aux;
      ECON.ctx.beginPath();
      ECON.ctx.arc(cx + d / 2, cy, r, 0, 7);
      ECON.ctx.fill();
      ECON.ctx.globalAlpha = 1;
      ECON.ctx.lineWidth = 2.4;
      ECON.ctx.strokeStyle = c.bar;
      ECON.ctx.beginPath();
      ECON.ctx.arc(cx - d / 2, cy, r, 0, 7);
      ECON.ctx.stroke();
      ECON.ctx.strokeStyle = c.aux;
      ECON.ctx.beginPath();
      ECON.ctx.arc(cx + d / 2, cy, r, 0, 7);
      ECON.ctx.stroke();
      ECON.ctx.strokeStyle = c.axis;
      ECON.ctx.globalAlpha = 0.4;
      ECON.ctx.strokeRect(cx - d / 2 - r - 40, cy - r - 30, d + 2 * r + 80, 2 * r + 60);
      ECON.ctx.globalAlpha = 1;
      ECON.txt('A', cx - d / 2 - r * 0.7, cy - r * 0.8, c.bar, 20, 'center', 'middle', true);
      ECON.txt('B', cx + d / 2 + r * 0.7, cy - r * 0.8, c.aux, 20, 'center', 'middle', true);
      if (ECON.P.show.labels) {
        ECON.txt(dc(fmt(R.onlyA, 4)), cx - d / 2 - r * 0.45, cy, c.axis, 15);
        ECON.txt(dc(fmt(R.pab, 4)), cx, cy, c.sel, 16);
        ECON.txt(dc(fmt(R.onlyB, 4)), cx + d / 2 + r * 0.45, cy, c.axis, 15);
        ECON.txt(dc(fmt(R.none, 4)), cx - d / 2 - r - 20, cy + r + 14, c.axis, 13, 'left');
      }
      return;
    }
    const [r] = layout(false),
      n = R.n,
      fr = frame(r, -0.6, n + 0.6, 0, Math.max(...R.c) * 1.2, {
        noYA: true,
        title: lang() === 'ru' ? 'P(произошло ровно k)' : 'P(exactly k happened)',
        xs: 1,
      });
    const bw = (fr.X(1) - fr.X(0)) * 0.6;
    const inE = (k) =>
      R.ev === 'all'
        ? k === n
        : R.ev === 'none'
          ? k === 0
          : R.ev === 'one1'
            ? k >= 1
            : R.ev === 'exact'
              ? k === R.k
              : R.ev === 'ge'
                ? k >= R.k
                : R.ev === 'le'
                  ? k <= R.k
                  : false;
    R.c.forEach((v, k) => {
      const X = fr.X(k),
        Y = fr.Y(v),
        s = inE(k);
      ECON.ctx.fillStyle = s ? c.sel : c.bar;
      ECON.ctx.globalAlpha = s ? 0.9 : 0.5;
      ECON.ctx.fillRect(X - bw / 2, Y, bw, fr.Y(0) - Y);
      ECON.ctx.globalAlpha = 1;
      if (ECON.P.show.labels) ECON.txt(dc(fmt(v, 4)), X, Y - 10, s ? c.sel : c.axis, 12);
    });
  }
  function drawBayes(R) {
    const c = ECON.P.colors,
      pT = Math.min(110, ECON.H * 0.2),
      pB = Math.min(80, ECON.H * 0.14),
      hh = ECON.H - pT - pB - 30,
      w = Math.min(ECON.W * 0.55, ECON.W - 260),
      x0 = 50,
      y0 = pT + 18;
    let x = x0;
    R.pr.forEach((p, i) => {
      const cw = w * p,
        col = COLS()[i % 7];
      box(x, y0, cw, hh, col, 0.12);
      const fh = hh * R.L[i];
      ECON.ctx.fillStyle = col;
      ECON.ctx.globalAlpha = 0.75;
      ECON.ctx.fillRect(x, y0 + hh - fh, cw, fh);
      ECON.ctx.globalAlpha = 1;
      if (cw > 26) {
        ECON.txt(`H${sb(i + 1)}`, x + cw / 2, y0 - 10, col, 14, 'center', 'middle', true);
        if (ECON.P.show.labels) ECON.txt(dc(fmt(R.L[i], 3)), x + cw / 2, y0 + hh - fh - 10, c.axis, 12);
      }
      x += cw;
    });
    ECON.txt(
      lang() === 'ru'
        ? `ширина — P(Hᵢ), закрашено — P(${R.bev === 'notA' ? 'Ā' : 'A'} | Hᵢ)`
        : `width — P(Hᵢ), filled — P(${R.bev === 'notA' ? 'Ā' : 'A'} | Hᵢ)`,
      x0 + w / 2,
      y0 + hh + 18,
      c.axis,
      12
    );
    const bx = x0 + w + 70,
      bw = Math.min(90, ECON.W - bx - 90);
    let y = y0;
    ECON.txt(lang() === 'ru' ? 'после опыта' : 'posterior', bx + bw / 2, y0 - 10, c.axis, 13);
    R.post.forEach((p, i) => {
      const h = hh * p,
        col = COLS()[i % 7];
      ECON.ctx.fillStyle = col;
      ECON.ctx.globalAlpha = 0.75;
      ECON.ctx.fillRect(bx, y, bw, h);
      ECON.ctx.globalAlpha = 1;
      if (h > 16)
        ECON.txt(
          ECON.P.show.labels ? `H${sb(i + 1)}: ${dc(fmt(p, 3))}` : `H${sb(i + 1)}`,
          bx + bw + 8,
          y + h / 2,
          col,
          13,
          'left'
        );
      y += h;
    });
  }
  /* ---------- справочник ---------- */

  /* ---------- экспорт ---------- */

  function illSvg(id) {
    const sp = ILL[id];
    if (!sp) return '';
    const W = 200,
      H = 140,
      c = (k) => `var(--s-${k})`,
      F = (v) => (+v).toFixed(1);
    let o = '';
    const ax = `<line x1="14" y1="122" x2="190" y2="122" stroke="${c('axis')}" stroke-opacity=".5"/>`;
    const path = (f, a, b, X, Y, n = 80) => {
      let d = '';
      for (let i = 0; i <= n; i++) {
        const x = a + ((b - a) * i) / n;
        d += (i ? 'L' : 'M') + F(X(x)) + ' ' + F(Y(f(x)));
      }
      return d;
    };
    if (sp.k === 'bars') {
      const n = sp.v.length,
        m = Math.max(...sp.v),
        bw = 150 / n;
      sp.v.forEach((v, i) => {
        const h = (v / m) * 95;
        o += `<rect x="${F(25 + i * bw + bw * 0.15)}" y="${F(122 - h)}" width="${F(bw * 0.7)}" height="${F(h)}" fill="${c((sp.sel || []).includes(i) ? 'sel' : 'bar')}" fill-opacity=".75"/>`;
      });
      if (sp.poly)
        o += `<polyline points="${sp.v.map((v, i) => F(25 + i * bw + bw / 2) + ',' + F(122 - (v / m) * 95)).join(' ')}" fill="none" stroke="${c('bar')}" stroke-width="2"/>`;
      if (sp.curve) {
        const mu = 2,
          s = Math.sqrt(2);
        o += `<path d="${path(
          (x) => Math.exp((-(x - mu) * (x - mu)) / (2 * s * s)),
          -0.5,
          n - 0.5,
          (x) => 25 + (x + 0.5) * bw,
          (y) => 122 - ((y * 0.27) / m) * 95
        )}" fill="none" stroke="${c('curve')}" stroke-width="2" stroke-dasharray="5 4"/>`;
      }
    } else if (sp.k === 'bell' || sp.k === 'dens') {
      const f = sp.k === 'bell' ? (x) => Math.exp((-x * x) / 2) : sp.f,
        x0 = sp.k === 'bell' ? -3.5 : sp.ext ? sp.ext[0] : sp.x0 - (sp.x1 - sp.x0) * 0.15,
        x1 = sp.k === 'bell' ? 3.5 : sp.ext ? sp.ext[1] : sp.x1 + (sp.x1 - sp.x0) * 0.15;
      const ff = sp.k === 'dens' ? (x) => (x < sp.x0 || x > sp.x1 ? 0 : f(x)) : f;
      let m = 0;
      for (let i = 0; i <= 100; i++) m = Math.max(m, ff(x0 + ((x1 - x0) * i) / 100));
      const X = (x) => 16 + ((x - x0) / (x1 - x0)) * 172,
        Y = (y) => 122 - (y / m) * 92;
      if (sp.a !== undefined) {
        const a = Math.max(sp.a, x0),
          b = Math.min(sp.b, x1);
        o += `<path d="M${F(X(a))} 122 ${path(ff, a, b, X, Y).replace('M', 'L')} L${F(X(b))} 122 Z" fill="${c('area')}" fill-opacity=".4"/>`;
      }
      o += `<path d="${path(ff, x0, x1, X, Y, 160)}" fill="none" stroke="${c('bar')}" stroke-width="2.4"/>`;
      if (sp.sig)
        for (const k of [-3, -2, -1, 1, 2, 3])
          o += `<line x1="${F(X(k))}" y1="122" x2="${F(X(k))}" y2="${F(Y(f(k)))}" stroke="${c('mark')}" stroke-dasharray="3 3"/>`;
      if (sp.F) {
        let d = '';
        for (let i = 0; i <= 80; i++) {
          const x = x0 + ((x1 - x0) * i) / 80;
          let s = 0;
          for (let j = 0; j <= 40; j++) {
            const t = -6 + ((x + 6) * j) / 40;
            s += Math.exp((-t * t) / 2) * (j === 0 || j === 40 ? 0.5 : 1);
          }
          s *= (x + 6) / 40 / Math.sqrt(2 * Math.PI);
          d += (i ? 'L' : 'M') + F(X(x)) + ' ' + F(122 - s * 92);
        }
        o += `<path d="${d}" fill="none" stroke="${c('F')}" stroke-width="2"/>`;
      }
    } else if (sp.k === 'steps') {
      let acc = 0;
      const n = sp.v.length,
        X = (i) => 30 + i * 50;
      o += `<line x1="14" y1="122" x2="${X(0)}" y2="122" stroke="${c('F')}" stroke-width="2.4"/>`;
      sp.v.forEach((v, i) => {
        acc += v;
        const y = 122 - acc * 95;
        o += `<line x1="${X(i)}" y1="${F(y)}" x2="${X(i + 1)}" y2="${F(y)}" stroke="${c('F')}" stroke-width="2.4"/><circle cx="${X(i)}" cy="${F(y)}" r="3" fill="${c('F')}"/>`;
      });
    } else if (sp.k === 'grid') {
      sp.P.forEach((r, i) =>
        r.forEach((v, j) => {
          o += `<rect x="${40 + j * 45}" y="${20 + i * 45}" width="42" height="42" fill="${c('area')}" fill-opacity="${0.15 + v * 2.5}"/><text x="${61 + j * 45}" y="${43 + i * 45}" fill="${c('axis')}" font-size="12" text-anchor="middle" dominant-baseline="middle">${String(v).replace('.', lang() === 'ru' ? ',' : '.')}</text>`;
        })
      );
    } else if (sp.k === 'scatter') {
      let s = 7;
      const rnd = () => {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
      };
      for (let i = 0; i < 40; i++) {
        const x = rnd(),
          y = 0.8 * x + 0.2 * rnd();
        o += `<circle cx="${F(20 + x * 165)}" cy="${F(122 - y * 100)}" r="2.6" fill="${c('bar')}"/>`;
      }
      o += `<line x1="20" y1="118" x2="185" y2="30" stroke="${c('curve')}" stroke-width="2"/>`;
    }
    return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><rect width="${W}" height="${H}" fill="var(--s-bg)"/>${ax}${o}</svg>`;
  }

  function renderTex() {
    const ta = $('#xTex');
    if (!ta) return;
    if (S.err || !S.res) {
      ta.value = '';
      return;
    }
    const R = S.res,
      a = (S.ans || '')
        .replace(/<sub>(.*?)<\/sub>/g, '_$1')
        .replace(/<sup>(.*?)<\/sup>/g, '^$1')
        .replace(/<[^>]+>/g, '');
    if (ECON.fmtMode === 'txt') {
      ta.value = `${T()['t_' + S.topic]}\n${a}`;
      return;
    }
    if (ECON.fmtMode === 'tex') {
      ta.value = a
        .replace(/≈/g, '\\approx ')
        .replace(/⩽/g, '\\le ')
        .replace(/σ/g, '\\sigma ')
        .replace(/√/g, '\\sqrt');
      return;
    }
    const t = S.topic;
    let py = 'from scipy import stats\n';
    if (t === 'bern')
      py +=
        `n, p = ${R.n}, ${R.p}\nX = stats.binom(n, p)\n` +
        (R.ev === 'mode'
          ? 'print(max(range(n+1), key=X.pmf))'
          : `print(X.cdf(${R.k2}) - X.cdf(${(R.ev === 'one' ? 1 : R.k1) - 1}))  # точно`);
    else if (t === 'dsv')
      py += `import numpy as np\nx = np.array(${JSON.stringify(R.x)})\np = np.array(${JSON.stringify(R.p.map((v) => +v.toFixed(10)))})\nM = (x*p).sum(); D = (x**2*p).sum() - M**2\nprint(M, D, D**0.5)`;
    else if (t === 'dvu')
      py += `import numpy as np\nx = np.array(${JSON.stringify(R.J.x)}); y = np.array(${JSON.stringify(R.J.y)})\nP = np.array(${JSON.stringify(R.J.P)})\npx, py = P.sum(1), P.sum(0)\nMx, My = x@px, y@py\ncov = x@P@y - Mx*My\nprint(Mx, My, cov, cov/np.sqrt((x**2@px-Mx**2)*(y**2@py-My**2)))`;
    else if (t === 'nsv')
      py += `from scipy import integrate\n# M = ∫x f(x)dx, D = ∫x² f(x)dx − M²\nprint(${fT(R.M, 6).replace(',', '.')}, ${fT(R.D, 6).replace(',', '.')})`;
    else if (t === 'comb') {
      const k = R.kind;
      py = `import math\nprint(${k === 'perm' ? `math.factorial(${R.n})` : k === 'arr' ? `math.perm(${R.n}, ${R.k})` : k === 'comb' ? `math.comb(${R.n}, ${R.k})` : k === 'arrRep' ? `${R.n}**${R.k}` : k === 'combRep' ? `math.comb(${R.n + R.k - 1}, ${R.k})` : k === 'permRep' ? `math.factorial(${R.n}) // (${R.list.map((v) => `math.factorial(${v})`).join(' * ')})` : R.list.join(' * ')})`;
    } else if (t === 'clas') {
      py =
        R.m === 'mn'
          ? `from fractions import Fraction\nprint(Fraction(${R.fav}, ${R.tot}))`
          : R.m === 'dice'
            ? `from itertools import product\nfrom fractions import Fraction\nall_ = list(product(range(1, 7), repeat=${R.s}))\nfav = [r for r in all_ if sum(r) ${R.dev === 'eq' ? '==' : R.dev === 'ge' ? '>=' : '<='} ${R.v}]\nprint(Fraction(len(fav), len(all_)))`
            : `from math import comb\nfrom fractions import Fraction\na = ${JSON.stringify(R.a)}; N, n = ${R.N}, ${R.n}\n` +
              (R.cev === 'exact'
                ? `k = ${JSON.stringify(R.terms[0])}\nm = 1\nfor ai, ki in zip(a, k): m *= comb(ai, ki)\n`
                : `m = sum(comb(a[0], k) * comb(N - a[0], n - k) for k in range(n + 1) if k ${R.cev === 'ge' ? '>=' : '<='} ${R.kk})\n`) +
              `print(Fraction(m, comb(N, n)))`;
    } else if (t === 'ops') {
      py =
        R.mode === 'two'
          ? `pA, pB, pAB = ${R.pa}, ${R.pb}, ${+R.pab.toFixed(12)}\nprint('P(A+B) =', pA + pB - pAB, 'P(A|B) =', pAB / pB)`
          : `import numpy as np\np = ${JSON.stringify(R.ps)}\nc = np.array([1.0])\nfor pi in p: c = np.convolve(c, [1 - pi, pi])\nprint(c)  # c[k] = P(ровно k)`;
    } else if (t === 'bayes') {
      py = `prior = ${JSON.stringify(R.pr.map((v) => +v.toFixed(12)))}\nlik = ${JSON.stringify(R.L.map((v) => +v.toFixed(12)))}\nPA = sum(p * l for p, l in zip(prior, lik))\nprint(PA, [p * l / PA for p, l in zip(prior, lik)])`;
    } else
      py +=
        `X = stats.norm(loc=${R.m}, scale=${R.s})\n` +
        (R.q === 'rng'
          ? `print(X.cdf(${R.x2}) - X.cdf(${R.x1}))`
          : R.q === 'lt'
            ? `print(X.cdf(${R.x1}))`
            : R.q === 'gt'
              ? `print(X.sf(${R.x1}))`
              : R.q === 'dev'
                ? `print(X.cdf(${R.m + R.del}) - X.cdf(${R.m - R.del}))`
                : R.q === 'qu'
                  ? `print(X.ppf(${R.pv}))`
                  : `print(${R.find === 'm' ? R.m : R.s})`);
    ta.value = py;
  }
  /* ---------- горячие клавиши ---------- */

  onShortcut((c, e, isQ) => {
    const L = T();
    let h = true;
    if (isQ) ECON.openKeys();
    else if (/^(Digit|Numpad)[1-9]$/.test(c)) {
      ECON.setTopic(TOPICS[+c.slice(-1) - 1]);
      toast(L['t_' + S.topic]);
    } else if (c === 'BracketLeft' || c === 'BracketRight') {
      const list = PRE[S.topic];
      let i = list.findIndex((p) => p[0] === S.preset);
      i = (i + (c === 'BracketLeft' ? -1 : 1) + list.length) % list.length;
      loadPreset(list[i][0]);
      toast(lang() === 'ru' ? list[i][2] : list[i][3]);
    } else if (c === 'KeyG') ECON.flip('bgGrid');
    else if (c === 'KeyF') ECON.flip('Fplot');
    else if (c === 'KeyP') ECON.flip('approx');
    else if (c === 'KeyM') ECON.flip('sigma');
    else if (c === 'KeyH') ECON.flip('hints');
    else if (c === 'KeyS') {
      if (ECON.canSave()) ECON.exportPng();
      else toast(L.xNoDl);
    } else if (c === 'Slash') {
      $('#openGloss').click();
      setTimeout(() => $('#gq').focus(), 30);
    } else h = false;
    return h;
  });
  /* ---------- настройки ---------- */

  function applyLang() {
    const L = T();
    document.documentElement.lang = lang();
    document.title = L.title;
    applyTexts(L);
    $('#gq').placeholder = L.search;
    ECON.cv.setAttribute('aria-label', L.canvas);
    document
      .querySelectorAll('#langSeg button,#langSeg2 button')
      .forEach((b) => b.classList.toggle('on', b.dataset.l === lang()));
    ECON.buildPal();
    buildToggles();
    ECON.syncToggles();
    ECON.syncSettings();
    ECON.updExport();
    ECON.renderKeys();
    if ($('#dGloss').classList.contains('open')) ECON.rerenderGloss();
    renderForm();
    recompute();
  }

  /* ---------- старт ---------- */

  ECON.start();
})();
