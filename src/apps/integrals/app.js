import { PRE } from './content/examples.js';
import { CHAP, DEMOS, FORMAL, ILL, REL, TERMS } from './content/glossary.js';
import { T } from './content/tx.js';
import { applyTexts, createSettings } from '../../shared/settings.js';
import { createKeys, onShortcut } from '../../shared/keys.js';
import { KEYS } from './content/keys.js';
import { createExport } from '../../shared/export.js';
import { toast } from '../../shared/toast.js';
import { $, clone } from '../../shared/dom.js';
import { closeDrawers, openDrawer } from '../../shared/drawers.js';
import { createGlossary } from '../../shared/glossary.js';
import { initDrawers } from '../../shared/drawers.js';
import { createPanels } from '../../shared/panels.js';
import { loadPrefs, makeSaver } from '../../shared/prefs.js';
import { analyzeX, calcRSX } from './solvers/analysis.js';
import { limF, limFx, limN } from '../../math/expr/limits.js';
import {
  FNAME,
  PRINT,
  TRIG,
  TXN,
  fArg,
  frac,
  hp,
  hp0,
  juxOK,
  numH,
  numT,
  prec,
  precT,
  tp,
  tp0,
} from '../../math/expr/print.js';
import {
  asFactors,
  dropConst,
  frank,
  fromFactors,
  linAst,
  linOf,
  linTerms,
  padd,
  pdeg,
  pder,
  pdiv,
  pgcd,
  pmul,
  polyAst,
  polyOf,
  ppow,
  pscale,
  ptrim,
  pval,
  sumTerms,
  tidy,
  tidyS,
} from '../../math/expr/poly.js';
import { ALIAS, WORDS, hasInf, parse, parseFx, parseLim, tokenize } from '../../math/expr/parse.js';
import { quadF, singular, tsFinite } from '../../math/expr/numeric.js';
import {
  EQ,
  HH,
  IH,
  Q,
  RULES,
  R_cmul,
  R_dist,
  R_divsplit,
  R_linu,
  R_neg,
  R_parts,
  R_poly,
  R_powlin,
  R_prodsum,
  R_rational,
  R_sum,
  R_table,
  R_trigpow,
  R_trigsub,
  R_usub,
  R_weier,
  SMP,
  SX,
  TAB,
  VN,
  cH,
  cands,
  checkF,
  cyclic,
  dd,
  dxh,
  integ,
  isET,
  isLogLike,
  linFac,
  linFacScale,
  mark,
  meth,
  nonElem,
  onlyTrigX,
  pcancel,
  polyAsc,
  polyGcd,
  powForm,
  propConst,
  quadInt,
  quiet,
  ratAst,
  ratFun,
  ratOf,
  ratRoots,
  reset,
  scFactors,
  sincos,
  solve,
  step,
  subI,
  withVar,
} from '../../math/expr/integrate.js';
import {
  CV,
  D,
  FD,
  FN,
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
  isPerfSq,
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
  toFrac,
} from '../../math/expr/core.js';
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

  /* предел: «1 000» — разряды через пробел (группы по 3 цифры); «1 00», «2 3» — ошибка, а не 1·00 = 0 */

  /* ---------- печать ---------- */

  /* текст, LaTeX и SymPy */

  /* ---------- численное интегрирование (tanh-sinh) ---------- */

  /* поиск особых точек на конечном отрезке */

  /* ---------- символьное интегрирование с шагами ---------- */

  /* --- правила --- */

  /* --- запуск и проверка --- */

  /* ---------- справочник ---------- */

  /* иллюстрации */

  const KEY = 'integral-viz-v1';
  function fmt(x, d = 2) {
    if (!isFinite(x)) return x > 0 ? '∞' : x < 0 ? '−∞' : '—';
    if (Math.abs(x) < 5e-10) x = 0;
    let s = String(+x.toFixed(d));
    if (s === '-0') s = '0';
    return s.replace('-', '−');
  }
  const PAL = {
    classic: {
      bg: '#0b0c10',
      bgGrid: '#262b33',
      axis: '#f2f2f2',
      f: '#58c4dd',
      F: '#f4d345',
      pos: '#83c167',
      neg: '#fc6255',
      rect: '#ff9f43',
      lim: '#c77dff',
      tan: '#ff7aa8',
    },
    paper: {
      bg: '#fbfaf7',
      bgGrid: '#e3e1da',
      axis: '#23262b',
      f: '#2b6cb0',
      F: '#b07900',
      pos: '#3f9a3a',
      neg: '#d1453b',
      rect: '#e67e22',
      lim: '#8e44ad',
      tan: '#c0398b',
    },
    neon: {
      bg: '#07020f',
      bgGrid: '#1f1533',
      axis: '#ffffff',
      f: '#4dd2ff',
      F: '#fff35c',
      pos: '#39ff88',
      neg: '#ff4d6d',
      rect: '#ffa53d',
      lim: '#a98bff',
      tan: '#ff9ecf',
    },
    nord: {
      bg: '#2e3440',
      bgGrid: '#3b4252',
      axis: '#eceff4',
      f: '#88c0d0',
      F: '#ebcb8b',
      pos: '#a3be8c',
      neg: '#bf616a',
      rect: '#d08770',
      lim: '#b48ead',
      tan: '#e5a0c0',
    },
  };

  const PANELS = ['integral', 'presets', 'solve', 'anim', 'values', 'riemann', 'methods', 'show', 'export'];
  const DEF = {
    palette: 'classic',
    colors: { ...PAL.classic },
    dock: 'auto',
    width: 360,
    bottomH: 46,
    ui: 'auto',
    font: 100,
    speed: 1,
    lw: 1,
    order: PANELS.slice(),
    collapsed: { methods: true, export: true },
    read: {},
    float: { x: 12, y: 12 },
    show: {
      bgGrid: true,
      coords: true,
      area: true,
      riemann: false,
      dots: true,
      Fcurve: true,
      tangent: true,
      family: false,
      labels: true,
      snap: true,
      hints: true,
    },
    last: null,
    rule: 'mid',
    n: 8,
  };

  const LOADED = loadPrefs({ key: KEY, defaults: DEF, panels: PANELS });
  let P = LOADED.prefs;
  if (LOADED.status === 'corrupt') setTimeout(() => toast(T().prefsReset, 5000));
  langFrom(() => P.lang);
  if (!P.lang) P.lang = (navigator.language || '').toLowerCase().startsWith('ru') ? 'ru' : 'en';
  // настройки: схема 2, миграция со схемы 1, -bak, предупреждение при переполнении (src/shared/prefs.js)
  function save() {
    (save.f ||= makeSaver({ key: KEY, get: () => P, onFail: () => toast(T().prefsNoSave, 4000) }))();
  }

  /* ---------- примеры ---------- */

  const M2T = { power: 'table', numeric: 'simpson', polydiv: 'polydiv', prodsum: 'trigid' };

  /* ---------- состояние ---------- */
  const S = {
    mode: 'A',
    fs: 'x^2',
    as: '0',
    bs: '2',
    fe: null,
    ff: null,
    aE: Nn(0),
    bE: Nn(2),
    a: 0,
    b: 2,
    t: 1,
    xs: 1.2,
    anim: null,
    C: 0,
    rule: P.rule || 'mid',
    n: P.n || 8,
    V: { cx: 1, cy: 1, sx: 80, sy: 80 },
    R: null,
    err: null,
    preset: null,
    drag: false,
  };

  /* символьный предел первообразной: только детерминированные формы (константа · ∞, ∞ + конст., x^p, ln, exp, arctan…);
   неопределённости (∞ − ∞, 0 · ∞, ∞/∞, колебания) → null, и тогда работает численный limN.
   Неточный ноль (|v| < 1e-9, например cos(π/2) в float) считается нулём с неизвестной стороной.
   Значение: {t:'f',v,s} — конечный предел (s: +1 сверху, −1 снизу, 0 точная константа, NaN неизвестно), {t:'i',s} — ±∞. */

  /* предел первообразной: сначала символьно (точно), иначе численно. ex — предел найден точно */

  /* условно сходящиеся несобственные интегралы с колебаниями: признак Лейбница + ускорение Эйлера */

  /* анализ интеграла: X — задача (ff, fe, a, b, err, n, rule); результат — в X.R */
  function analyze(full = true) {
    return analyzeX(S, full);
  }

  /* ---------- ввод интеграла ---------- */ function calcRS() {
    calcRSX(S);
  }

  function fmtLim(v) {
    if (v === Infinity) return 'inf';
    if (v === -Infinity) return '-inf';
    return String(+v.toFixed(4));
  }
  function limH(e, v) {
    if (v === Infinity) return '∞';
    if (v === -Infinity) return '−∞';
    const s = e === S.aE ? S.as : e === S.bE ? S.bs : '';
    if (!e || /^\s*[-−]?[\d.,]+(e[-+]?\d+)?\s*$/i.test(s))
      return Math.abs(v) < 1e-3 && v !== 0 ? String(v).replace('-', '−') : fmt(v, 4);
    return hp(e, 0, true);
  }
  function setIntegral(fs, as, bs, o = {}) {
    const prevF = S.fs;
    S.fs = fs;
    S.as = as;
    S.bs = bs;
    S.err = null;
    try {
      S.fe = parseFx(fs);
      S.ff = compile(S.fe);
    } catch (e) {
      S.err = e && e.msg === 'inf' ? 'inf' : 'f';
    }
    if (!S.err) {
      try {
        const A = parseLim(as);
        S.a = A.v;
        S.aE = A.e || null;
      } catch (e) {
        if (S.mode === 'I') {
          S.a = 0;
          S.aE = Nn(0);
        } else S.err = e && e.msg === 'x' ? 'x' : 'lim';
      }
    }
    if (!S.err) {
      try {
        const B = parseLim(bs);
        S.b = B.v;
        S.bE = B.e || null;
      } catch (e) {
        if (S.mode === 'I') {
          S.b = S.a + 1;
          S.bE = null;
        } else S.err = e && e.msg === 'x' ? 'x' : 'lim';
      }
    }
    if (o.preset !== undefined) S.preset = o.preset;
    else if (!o.keepPreset || fs !== prevF) S.preset = null;
    if (!o.noInputs) syncInputs();
    if (!S.err && S.mode !== 'I') {
      if (isFinite(S.a) && isFinite(S.b)) {
        if (!(S.xs >= Math.min(S.a, S.b) && S.xs <= Math.max(S.a, S.b)) || o.fit)
          S.xs = S.a + (S.b - S.a) * 0.6;
      } else S.xs = isFinite(S.a) ? S.a + 2 : isFinite(S.b) ? S.b - 2 : 1;
    }
    if (!S.err) {
      P.last = { f: fs, a: as, b: bs, p: S.preset };
      save();
    }
    S.anim = null;
    S.t = 1;
    analyze(!S.drag);
    if (o.fit) fitView();
    renderAll();
  }
  function syncInputs() {
    const fi = $('#fIn'),
      ai = $('#aIn'),
      bi = $('#bIn');
    if (document.activeElement !== fi) fi.value = S.fs;
    if (document.activeElement !== ai) ai.value = S.as;
    if (document.activeElement !== bi) bi.value = S.bs;
  }
  function loadPreset(id, o = {}) {
    const p = PRE.find((z) => z[0] === id);
    if (!p) return;
    setIntegral(p[1], p[2], p[3], { preset: id, fit: true });
  }

  /* ---------- сцена ---------- */
  const cv = $('#cv'),
    ctx = cv.getContext('2d'),
    stage = $('#stage'),
    main = $('#main'),
    side = $('#side');
  const { buildPanels, applyOrder, showPanel } = createPanels({ side, prefs: () => P, save });
  let W = 0,
    H = 0,
    DPR = 1,
    raf = 0,
    sized = false;
  new ResizeObserver(() => {
    const r = stage.getBoundingClientRect();
    const fw = W;
    W = r.width;
    H = r.height;
    DPR = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.max(1, Math.round(W * DPR));
    cv.height = Math.max(1, Math.round(H * DPR));
    if (!sized && W > 0 && H > 0) {
      sized = true;
      fitView();
    }
    req();
  }).observe(stage);
  function req() {
    if (!raf) raf = requestAnimationFrame(frame);
  }
  const ease = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  function frame(now) {
    raf = 0;
    const A = S.anim;
    if (A) {
      const p = Math.min(1, (now - A.start) / A.dur),
        e = A.kind === 'riem' ? p : ease(p);
      if (A.kind === 'sweepI') {
        S.t = e;
        S.xs = A.x0 + e * (A.x1 - A.x0);
      } else if (A.kind === 'sweep') {
        S.t = e;
        if (S.mode === 'F') S.xs = S.a + e * (S.b - S.a);
      } else {
        S.n = Math.max(1, Math.round(Math.pow(2, e * 7)));
        calcRS();
        syncRiem(false);
      }
      if (p >= 1) {
        S.anim = null;
        if (A.kind === 'riem') {
          P.n = S.n;
          save();
        }
        renderAll();
        if (A.then) A.then();
      }
    }
    renderNow();
    renderOverlay();
    syncT();
    if (S.anim) req();
  }
  const w2s = (x, y) => [W / 2 + (x - S.V.cx) * S.V.sx, H / 2 - (y - S.V.cy) * S.V.sy];
  const s2w = (X, Y) => [S.V.cx + (X - W / 2) / S.V.sx, S.V.cy - (Y - H / 2) / S.V.sy];
  const sX = (x) => W / 2 + (x - S.V.cx) * S.V.sx,
    sY = (y) => H / 2 - (y - S.V.cy) * S.V.sy;
  function niceStep(raw) {
    const p = Math.pow(10, Math.floor(Math.log10(raw))),
      m = raw / p;
    return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p;
  }
  function fitView() {
    if (!W || !H) return;
    let x0, x1;
    const a = S.a,
      b = S.b;
    if (S.err || !S.ff) {
      S.V = { cx: 0, cy: 0, sx: Math.min(W, H) / 8, sy: Math.min(W, H) / 8 };
      req();
      return;
    }
    if (S.mode === 'I') return fitI();
    if (isFinite(a) && isFinite(b)) {
      const lo = Math.min(a, b),
        hi = Math.max(a, b),
        pd = Math.max(0.6, (hi - lo) * 0.25);
      x0 = lo - pd;
      x1 = hi + pd;
    } else if (isFinite(a)) {
      x0 = a - 1.5;
      x1 = a + 9;
    } else if (isFinite(b)) {
      x0 = b - 9;
      x1 = b + 1.5;
    } else {
      x0 = -5;
      x1 = 5;
    }
    const ys = [0];
    {
      let u0 = x0,
        u1 = x1;
      if (isFinite(a) && isFinite(b)) {
        const lo = Math.min(a, b),
          hi = Math.max(a, b),
          e = (hi - lo) * 0.08;
        u0 = lo - e;
        u1 = hi + e;
      }
      for (let i = 0; i <= 400; i++) {
        const x = u0 + ((u1 - u0) * i) / 400,
          y = S.ff(x);
        if (isFinite(y)) ys.push(y);
      }
    }
    if (S.mode === 'F' && isFinite(a)) {
      const acc = accumAt(x0, x1, 120);
      acc.forEach((v) => {
        if (isFinite(v)) ys.push(v);
      });
    }
    ys.sort((p, q) => p - q);
    const pick = (q) => ys[Math.max(0, Math.min(ys.length - 1, Math.round(q * (ys.length - 1))))];
    let y0 = Math.min(0, pick(0.04)),
      y1 = Math.max(0, pick(0.96));
    if (y1 - y0 < 1e-6) {
      y0 -= 1;
      y1 += 1;
    }
    const py = (y1 - y0) * 0.06;
    y0 -= py;
    y1 += py;
    const pT = Math.min(110, H * 0.2),
      pB = Math.min(80, H * 0.13),
      hh = Math.max(40, H - pT - pB),
      sy = hh / (y1 - y0);
    S.V = { cx: (x0 + x1) / 2, sx: W / (x1 - x0), sy, cy: (y0 + y1) / 2 + (pT - pB) / 2 / sy };
    ACC = null;
    req();
  }
  function iBase() {
    const f = S.ff;
    for (const x of [0, 1, 0.5, 2, -1, 3, 5]) if (isFinite(f(x)) && Math.abs(f(x)) < 1e7) return x;
    return 1;
  }
  function Fi(x) {
    const R = S.R;
    if (R && R.FF) return R.FF(x) + S.C;
    const b = iBase();
    return quadF(S.ff, b, x).v + S.C;
  }
  function fitI() {
    const f = S.ff;
    let neg = 0;
    for (let i = 1; i <= 40; i++) {
      if (!isFinite(f(-i / 10))) neg++;
    }
    let x0 = -3.5,
      x1 = 3.5,
      u0 = -2,
      u1 = 2;
    if (neg > 30) {
      x0 = -0.6;
      x1 = 5;
      u0 = 0.1;
      u1 = 3;
    }
    const ys = [0];
    for (let i = 0; i <= 200; i++) {
      const x = u0 + ((u1 - u0) * i) / 200;
      const y = f(x);
      if (isFinite(y)) ys.push(y);
      const F = Fi(x);
      if (isFinite(F)) ys.push(F);
    }
    ys.sort((p, q) => p - q);
    const pick = (q) => ys[Math.max(0, Math.min(ys.length - 1, Math.round(q * (ys.length - 1))))];
    let y0 = Math.min(0, pick(0.06)),
      y1 = Math.max(0, pick(0.94));
    if (y1 - y0 < 1e-6) {
      y0 -= 1;
      y1 += 1;
    }
    const py = (y1 - y0) * 0.08;
    y0 -= py;
    y1 += py;
    const pT = Math.min(110, H * 0.2),
      pB = Math.min(80, H * 0.13),
      hh = Math.max(40, H - pT - pB),
      sy = hh / (y1 - y0);
    S.V = { cx: (x0 + x1) / 2, sx: W / (x1 - x0), sy, cy: (y0 + y1) / 2 + (pT - pB) / 2 / sy };
    if (!(S.xs > x0 && S.xs < x1)) S.xs = x0 + (x1 - x0) * 0.62;
    ACC = null;
    req();
  }
  function accumAt(x0, x1, N) {
    const out = [];
    if (!isFinite(S.a)) return out;
    for (let i = 0; i <= N; i++) {
      const x = x0 + ((x1 - x0) * i) / N;
      out.push(quadF(S.ff, S.a, x).v);
    }
    return out;
  }
  let ACC = null;
  function accum(base) {
    const a = base === undefined ? S.a : base,
      k = [key(S.fe), a, S.V.cx, S.V.sx, W].join('|');
    if (ACC && ACC.k === k) return ACC;
    const f = S.ff,
      st = 2,
      xs = [],
      vs = [];
    for (let X = -4; X <= W + 4; X += st) xs.push(s2w(X, 0)[0]);
    const n = xs.length;
    for (let i = 0; i < n; i++) vs.push(NaN);
    if (!isFinite(a)) {
      if (S.R && S.R.FF) {
        const L = limF(S.R.FF, a, 1, S.R.F, S.ff);
        if (L !== null) for (let i = 0; i < n; i++) vs[i] = S.R.FF(xs[i]) - L;
      }
      ACC = { k, xs, vs };
      return ACC;
    }
    const g2 = (p, q) => {
      const m = (p + q) / 2,
        h = (q - p) / 2,
        d = h / Math.sqrt(3),
        u = f(m - d),
        v = f(m + d);
      return h * (u + v);
    };
    let k0 = xs.findIndex((x) => x >= a);
    if (k0 < 0) k0 = n;
    if (k0 < n) {
      let A = quadF(f, a, xs[k0]).v;
      vs[k0] = A;
      for (let i = k0 + 1; i < n; i++) {
        A += g2(xs[i - 1], xs[i]);
        if (!isFinite(A) || Math.abs(A) > 1e9) break;
        vs[i] = A;
      }
    }
    if (k0 > 0) {
      let A = -quadF(f, xs[k0 - 1], a).v;
      vs[k0 - 1] = A;
      for (let i = k0 - 2; i >= 0; i--) {
        A -= g2(xs[i], xs[i + 1]);
        if (!isFinite(A) || Math.abs(A) > 1e9) break;
        vs[i] = A;
      }
    }
    ACC = { k, xs, vs };
    return ACC;
  }
  function renderNow() {
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const c = P.colors,
      lw = P.lw;
    ctx.fillStyle = c.bg;
    ctx.fillRect(0, 0, W, H);
    drawGrid();
    if (S.err || !S.ff) {
      if (S.stamp) drawStamp();
      return;
    }
    if (S.mode === 'I') {
      drawI();
      plot(S.ff, P.colors.f, 2.6 * P.lw, 1);
      drawXs();
      if (P.show.labels) drawLabels();
      if (S.stamp) drawStamp();
      return;
    }
    const f = S.ff,
      a = S.a,
      b = S.b,
      R = S.R || {},
      Y0 = sY(0);
    const [vx0] = s2w(0, 0),
      [vx1] = s2w(W, 0);
    const aE = isFinite(a) ? a : vx0 - 1,
      bE = isFinite(b) ? b : vx1 + 1;
    if (P.show.area) {
      let x0 = aE,
        x1;
      if (S.mode === 'F') x1 = S.xs;
      else x1 = isFinite(a) && isFinite(b) ? a + S.t * (b - a) : bE;
      if (S.mode === 'F' && !isFinite(a)) x0 = vx0 - 1;
      fillArea(x0, x1, a > b);
    }
    if (S.mode === 'A' && P.show.riemann && !R.improper && isFinite(a) && isFinite(b)) drawRects();
    if (S.mode === 'F') drawF();
    plot(f, c.f, 2.6 * lw, 1);
    drawLims();
    if (S.mode === 'F') drawXs();
    if (P.show.labels) drawLabels();
    if (S.stamp) drawStamp();
  }
  function drawGrid() {
    const c = P.colors,
      stx = niceStep(90 / S.V.sx),
      sty = niceStep(64 / S.V.sy),
      [x0, y1] = s2w(0, 0),
      [x1, y0] = s2w(W, H);
    if (P.show.bgGrid) {
      ctx.strokeStyle = c.bgGrid;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = Math.ceil(x0 / stx) * stx; x <= x1; x += stx) {
        const X = Math.round(sX(x)) + 0.5;
        ctx.moveTo(X, 0);
        ctx.lineTo(X, H);
      }
      for (let y = Math.ceil(y0 / sty) * sty; y <= y1; y += sty) {
        const Y = Math.round(sY(y)) + 0.5;
        ctx.moveTo(0, Y);
        ctx.lineTo(W, Y);
      }
      ctx.stroke();
    }
    ctx.strokeStyle = c.axis;
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    const AX = sX(0),
      AY = sY(0);
    ctx.moveTo(0, AY);
    ctx.lineTo(W, AY);
    ctx.moveTo(AX, 0);
    ctx.lineTo(AX, H);
    ctx.stroke();
    ctx.globalAlpha = 1;
    if (P.show.coords) {
      ctx.fillStyle = c.axis;
      ctx.globalAlpha = 0.7;
      ctx.font = '500 12px Manrope, system-ui, sans-serif';
      const dx = Math.max(0, -Math.floor(Math.log10(stx))),
        dy = Math.max(0, -Math.floor(Math.log10(sty)));
      const ly = Math.max(14, Math.min(H - 6, AY + 15));
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      for (let x = Math.ceil(x0 / stx) * stx; x <= x1; x += stx) {
        if (Math.abs(x) < stx / 2) continue;
        ctx.fillText(fmt(x, dx), sX(x), ly);
      }
      const lx = Math.max(6, Math.min(W - 40, AX - 6));
      ctx.textAlign = AX - 6 < 30 ? 'left' : 'right';
      ctx.textBaseline = 'middle';
      for (let y = Math.ceil(y0 / sty) * sty; y <= y1; y += sty) {
        if (Math.abs(y) < sty / 2) continue;
        ctx.fillText(fmt(y, dy), AX - 6 < 30 ? lx + 10 : lx, sY(y));
      }
      ctx.globalAlpha = 1;
    }
  }
  const clampY = (Y) => Math.max(-3 * H, Math.min(4 * H, Y));
  function plot(fun, col, w, al, dash) {
    ctx.strokeStyle = col;
    ctx.lineWidth = w;
    ctx.globalAlpha = al;
    ctx.setLineDash(dash || []);
    ctx.lineJoin = 'round';
    ctx.beginPath();
    let pen = false,
      py = 0;
    for (let X = -2; X <= W + 2; X += 1.25) {
      const x = s2w(X, 0)[0],
        y = fun(x);
      if (!isFinite(y)) {
        pen = false;
        continue;
      }
      let Y = sY(y);
      if (pen && Math.abs(Y - py) > H * 1.2) {
        pen = false;
      }
      Y = clampY(Y);
      if (!pen) {
        ctx.moveTo(X, Y);
        pen = true;
      } else ctx.lineTo(X, Y);
      py = Y;
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  }
  function fillArea(x0, x1, rev) {
    if (x0 === x1) return;
    const c = P.colors,
      f = S.ff;
    let X0 = sX(Math.min(x0, x1)),
      X1 = sX(Math.max(x0, x1));
    X0 = Math.max(-6, X0);
    X1 = Math.min(W + 6, X1);
    if (X1 <= X0) return;
    const Y0 = sY(0),
      N = Math.max(2, Math.ceil((X1 - X0) / 1.25));
    ctx.beginPath();
    ctx.moveTo(X0, Y0);
    for (let i = 0; i <= N; i++) {
      const X = X0 + ((X1 - X0) * i) / N,
        y = f(s2w(X, 0)[0]);
      ctx.lineTo(X, isFinite(y) ? clampY(sY(y)) : isNaN(y) ? Y0 : y > 0 ? -3 * H : 4 * H);
    }
    ctx.lineTo(X1, Y0);
    ctx.closePath();
    const neg = x0 > x1 !== !!rev;
    ctx.save();
    ctx.clip();
    ctx.globalAlpha = 0.34;
    ctx.fillStyle = neg ? c.neg : c.pos;
    ctx.fillRect(0, 0, W, Math.max(0, Y0));
    ctx.fillStyle = neg ? c.pos : c.neg;
    ctx.fillRect(0, Y0, W, H);
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  function drawRects() {
    const c = P.colors,
      f = S.ff,
      a = S.a,
      b = S.b;
    let n = S.n;
    const rule = S.rule;
    if (rule === 'simp' && n % 2) n++;
    const h = (b - a) / n,
      Y0 = sY(0),
      pxw = Math.abs(h * S.V.sx),
      thin = pxw < 3;
    const y = (x) => {
      const v = f(x);
      return isFinite(v) ? v : 0;
    };
    ctx.lineWidth = 1.2 * P.lw;
    const shape = (pts) => {
      ctx.beginPath();
      pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
      ctx.closePath();
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = c.rect;
      ctx.fill();
      if (!thin) {
        ctx.globalAlpha = 0.9;
        ctx.strokeStyle = c.rect;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };
    const dots = [];
    if (rule === 'simp') {
      for (let i = 0; i < n; i += 2) {
        const x0 = a + i * h,
          x1 = x0 + h,
          x2 = x1 + h,
          f0 = y(x0),
          f1 = y(x1),
          f2 = y(x2),
          pts = [[sX(x0), Y0]];
        for (let k = 0; k <= 16; k++) {
          const t = k / 16,
            x = x0 + 2 * h * t,
            L0 = (t - 0.5) * (t - 1) * 2,
            L1 = -4 * t * (t - 1),
            L2 = t * (t - 0.5) * 2;
          pts.push([sX(x), clampY(sY(f0 * L0 + f1 * L1 + f2 * L2))]);
        }
        pts.push([sX(x2), Y0]);
        shape(pts);
        dots.push([x0, f0], [x1, f1], [x2, f2]);
      }
    } else
      for (let i = 0; i < n; i++) {
        const xl = a + i * h,
          xr = xl + h;
        if (rule === 'trap') {
          const yl = y(xl),
            yr = y(xr);
          shape([
            [sX(xl), Y0],
            [sX(xl), clampY(sY(yl))],
            [sX(xr), clampY(sY(yr))],
            [sX(xr), Y0],
          ]);
          dots.push([xl, yl]);
          if (i === n - 1) dots.push([xr, yr]);
        } else {
          const xp = rule === 'left' ? xl : rule === 'right' ? xr : xl + h / 2,
            yy = y(xp);
          shape([
            [sX(xl), Y0],
            [sX(xl), clampY(sY(yy))],
            [sX(xr), clampY(sY(yy))],
            [sX(xr), Y0],
          ]);
          dots.push([xp, yy]);
        }
      }
    if (P.show.dots && pxw > 5) {
      ctx.fillStyle = c.rect;
      for (const [x, v] of dots) {
        ctx.beginPath();
        ctx.arc(sX(x), clampY(sY(v)), 3.2, 0, 7);
        ctx.fill();
      }
    }
  }
  function drawF() {
    if (!P.show.Fcurve) return;
    const c = P.colors,
      A = accum(),
      lw = P.lw,
      fam = P.show.family;
    const path = (off, al, w) => {
      ctx.strokeStyle = c.F;
      ctx.globalAlpha = al;
      ctx.lineWidth = w;
      ctx.beginPath();
      let pen = false;
      A.xs.forEach((x, i) => {
        const v = A.vs[i];
        if (!isFinite(v)) {
          pen = false;
          return;
        }
        const X = sX(x),
          Y = clampY(sY(v + off));
        if (!pen) {
          ctx.moveTo(X, Y);
          pen = true;
        } else ctx.lineTo(X, Y);
      });
      ctx.stroke();
      ctx.globalAlpha = 1;
    };
    if (fam) {
      const st = niceStep(70 / S.V.sy);
      for (const k of [-3, -2, -1, 1, 2, 3]) path(k * st, 0.28, 1.5 * lw);
    }
    path(0, 1, 2.6 * lw);
  }
  function drawI() {
    if (!P.show.Fcurve) return;
    const c = P.colors,
      lw = P.lw,
      R = S.R || {},
      st = niceStep(70 / S.V.sy),
      ks = P.show.family ? [-3, -2, -1, 1, 2, 3] : [];
    if (R.FF) {
      for (const k of ks) plot((x) => R.FF(x) + S.C + k * st, c.F, 1.5 * lw, 0.28);
      plot((x) => R.FF(x) + S.C, c.F, 2.6 * lw, 1);
      return;
    }
    const A = accum(iBase());
    const path = (off, al, w) => {
      ctx.strokeStyle = c.F;
      ctx.globalAlpha = al;
      ctx.lineWidth = w;
      ctx.beginPath();
      let pen = false;
      A.xs.forEach((x, i) => {
        const v = A.vs[i];
        if (!isFinite(v)) {
          pen = false;
          return;
        }
        const X = sX(x),
          Y = clampY(sY(v + off));
        if (!pen) {
          ctx.moveTo(X, Y);
          pen = true;
        } else ctx.lineTo(X, Y);
      });
      ctx.stroke();
      ctx.globalAlpha = 1;
    };
    for (const k of ks) path(S.C + k * st, 0.28, 1.5 * lw);
    path(S.C, 1, 2.6 * lw);
  }
  function Aval(x) {
    return S.mode === 'I' ? Fi(x) : Aat(x);
  }
  function Aat(x) {
    return isFinite(S.a)
      ? quadF(S.ff, S.a, x).v
      : S.R && S.R.FF
        ? (() => {
            const L = limF(S.R.FF, S.a, 1, undefined, S.ff);
            return L === null ? NaN : S.R.FF(x) - L;
          })()
        : NaN;
  }
  function drawXs() {
    const c = P.colors,
      x = S.xs,
      X = sX(x),
      Y0 = sY(0),
      fx = S.ff(x),
      Ax = Aval(x);
    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = c.axis;
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(X, 0);
    ctx.lineTo(X, H);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
    if (isFinite(fx)) {
      ctx.fillStyle = c.f;
      ctx.beginPath();
      ctx.arc(X, clampY(sY(fx)), 4.5, 0, 7);
      ctx.fill();
    }
    if (isFinite(Ax) && P.show.Fcurve) {
      const AY = sY(Ax);
      if (P.show.tangent && isFinite(fx)) {
        const vx = S.V.sx,
          vy = -fx * S.V.sy,
          L = Math.hypot(vx, vy) || 1,
          k = 80 / L;
        ctx.strokeStyle = c.tan;
        ctx.lineWidth = 2 * P.lw;
        ctx.beginPath();
        ctx.moveTo(X - vx * k, AY - vy * k);
        ctx.lineTo(X + vx * k, AY + vy * k);
        ctx.stroke();
      }
      ctx.fillStyle = c.F;
      ctx.beginPath();
      ctx.arc(X, AY, 5, 0, 7);
      ctx.fill();
    }
    const hy = Math.max(14, Math.min(H - 14, Y0));
    ctx.fillStyle = c.axis;
    ctx.strokeStyle = c.bg;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(X, hy, 7, 0, 7);
    ctx.fill();
    ctx.stroke();
    label('x', X, hy + 20, c.axis, 17);
  }
  function drawLims() {
    const c = P.colors,
      Y0 = sY(0),
      hy = Math.max(14, Math.min(H - 14, Y0));
    [
      ['a', S.a],
      ['b', S.b],
    ].forEach(([n, v]) => {
      if (!isFinite(v)) {
        const X = v > 0 ? W - 16 : 16;
        label(v > 0 ? 'b → ∞' : '−∞ ← a', v > 0 ? W - 44 : 44, Math.min(H - 30, hy - 16), c.lim, 15);
        return;
      }
      const X = sX(v);
      if (X < -20 || X > W + 20) return;
      ctx.strokeStyle = c.lim;
      ctx.globalAlpha = 0.75;
      ctx.lineWidth = 1.5 * P.lw;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.moveTo(X, 0);
      ctx.lineTo(X, H);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
      ctx.fillStyle = c.lim;
      ctx.beginPath();
      ctx.arc(X, hy, 7.5, 0, 7);
      ctx.fill();
      label(n, X, hy + 21, c.lim, 18);
    });
  }
  function label(s, x, y, col, sz = 17) {
    ctx.font = `italic 600 ${sz}px "Source Serif 4", Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 4;
    ctx.strokeStyle = P.colors.bg;
    ctx.lineJoin = 'round';
    ctx.strokeText(s, x, y);
    ctx.fillStyle = col;
    ctx.fillText(s, x, y);
  }
  function drawLabels() {
    const c = P.colors,
      f = S.ff;
    for (const X of [W - 70, W - 140, W * 0.6, W * 0.4]) {
      const x = s2w(X, 0)[0],
        y = f(x),
        Y = sY(y);
      if (isFinite(y) && Y > 24 && Y < H - 24) {
        label('f', X, Y - 16, c.f, 19);
        break;
      }
    }
    if (S.mode === 'I' && P.show.Fcurve) {
      for (const X of [W * 0.25, W * 0.15, W * 0.35]) {
        const v = Fi(s2w(X, 0)[0]),
          Y = sY(v);
        if (isFinite(v) && Y > 24 && Y < H - 24) {
          label('F + C', X, Y - 18, c.F, 18);
          break;
        }
      }
    }
    if (S.mode === 'F' && P.show.Fcurve) {
      const A = accum();
      for (let i = A.xs.length - 40; i > 20; i -= 15) {
        const v = A.vs[i];
        if (!isFinite(v)) continue;
        const Y = sY(v);
        if (Y > 24 && Y < H - 24) {
          label('F', sX(A.xs[i]), Y + 18, c.F, 19);
          break;
        }
      }
    }
  }
  function drawStamp() {
    const txt = textOf(),
      c = P.colors;
    ctx.font = '600 15px "Source Serif 4", Georgia, serif';
    const w = ctx.measureText(txt).width + 20;
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = c.bg;
    ctx.fillRect(W - w - 12, H - 38, w, 28);
    ctx.globalAlpha = 1;
    ctx.fillStyle = c.axis;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(txt, W - w - 2, H - 24);
  }
  function textOf() {
    if (S.err) return '';
    const R = S.R || {};
    if (S.mode === 'I')
      return R.F ? `∫ ${tp(S.fe, 0, 'txt')} dx = ${tp(R.F, 0, 'txt')} + C` : `∫ ${tp(S.fe, 0, 'txt')} dx`;
    const v = R.div ? T().v_div : R.exact ? tp(R.exact, 0, 'txt') : fmt(R.val, 5);
    return `∫[${S.as}; ${S.bs}] ${tp(S.fe, 0, 'txt')} dx = ${v}`;
  }

  /* ---------- указатель ---------- */
  const ptrs = new Map();
  let drag = null;
  const pos = (e) => {
    const r = cv.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  function hit(X, Y) {
    if (S.err) return null;
    const c = [];
    if (S.mode !== 'A') c.push(['xs', S.xs, 14]);
    if (S.mode === 'I') return Math.abs(sX(S.xs) - X) < 16 ? 'xs' : null;
    if (isFinite(S.b)) c.push(['b', S.b, 11]);
    if (isFinite(S.a)) c.push(['a', S.a, 11]);
    let best = null,
      bd = 1e9;
    for (const [n, v, r] of c) {
      const d = Math.abs(sX(v) - X);
      if (d < r && d < bd) {
        bd = d;
        best = n;
      }
    }
    return best;
  }
  cv.addEventListener('pointerdown', (e) => {
    cv.setPointerCapture(e.pointerId);
    const p = pos(e);
    ptrs.set(e.pointerId, p);
    if (ptrs.size === 2) {
      const [p1, p2] = [...ptrs.values()];
      drag = {
        type: 'pinch',
        d: Math.hypot(p1.x - p2.x, p1.y - p2.y) || 1,
        V: { ...S.V },
        c: s2w((p1.x + p2.x) / 2, (p1.y + p2.y) / 2),
        m: [(p1.x + p2.x) / 2, (p1.y + p2.y) / 2],
      };
      S.drag = false;
      return;
    }
    const h = hit(p.x, p.y);
    if (h) {
      drag = { type: h };
      S.drag = true;
      S.anim = null;
      cv.style.cursor = 'ew-resize';
    } else {
      drag = { type: 'pan', x: p.x, y: p.y, cx: S.V.cx, cy: S.V.cy };
      cv.style.cursor = 'grabbing';
    }
  });
  cv.addEventListener('pointermove', (e) => {
    const p = pos(e);
    if (ptrs.has(e.pointerId)) ptrs.set(e.pointerId, p);
    if (!drag) {
      cv.style.cursor = hit(p.x, p.y) ? 'ew-resize' : 'grab';
      return;
    }
    if (drag.type === 'pinch' && ptrs.size === 2) {
      const [p1, p2] = [...ptrs.values()],
        d = Math.hypot(p1.x - p2.x, p1.y - p2.y),
        k = d / drag.d,
        m = [(p1.x + p2.x) / 2, (p1.y + p2.y) / 2];
      S.V.sx = Math.max(1e-3, drag.V.sx * k);
      S.V.sy = Math.max(1e-3, drag.V.sy * k);
      S.V.cx = drag.c[0] - (m[0] - W / 2) / S.V.sx;
      S.V.cy = drag.c[1] + (m[1] - H / 2) / S.V.sy;
      req();
      return;
    }
    if (drag.type === 'pan') {
      S.V.cx = drag.cx - (p.x - drag.x) / S.V.sx;
      S.V.cy = drag.cy + (p.y - drag.y) / S.V.sy;
      req();
      return;
    }
    let x = s2w(p.x, p.y)[0];
    if (P.show.snap) {
      const st = niceStep(90 / S.V.sx) / 4;
      const sx = Math.round(x / st) * st;
      if (Math.abs(sX(sx) - p.x) < 10) x = snap(+sx.toFixed(10));
    }
    if (drag.type === 'xs') {
      S.xs = x;
      renderOverlay();
      if (S.mode !== 'I' && isFinite(S.a) && isFinite(S.b) && S.b !== S.a)
        S.t = Math.max(0, Math.min(1, (x - S.a) / (S.b - S.a)));
      renderValues();
      renderCaption();
      req();
      return;
    }
    const v = fmtLim(x);
    if (drag.type === 'a') setIntegral(S.fs, v, S.bs, { keepPreset: true });
    else setIntegral(S.fs, S.as, v, { keepPreset: true });
  });
  function endPtr(e) {
    ptrs.delete(e.pointerId);
    if (ptrs.size < 2 && drag && drag.type === 'pinch') {
      const q = [...ptrs.values()][0];
      drag = q ? { type: 'pan', x: q.x, y: q.y, cx: S.V.cx, cy: S.V.cy } : null;
    }
    if (!ptrs.size) {
      const was = drag && (drag.type === 'a' || drag.type === 'b');
      drag = null;
      cv.style.cursor = 'grab';
      if (S.drag) {
        S.drag = false;
        if (was) {
          analyze(true);
          renderAll();
        }
      }
    }
  }
  cv.addEventListener('pointerup', endPtr);
  cv.addEventListener('pointercancel', endPtr);
  function zoomAt(X, Y, kx, ky) {
    const [wx, wy] = s2w(X, Y);
    S.V.sx *= kx;
    S.V.sy *= ky;
    S.V.cx = wx - (X - W / 2) / S.V.sx;
    S.V.cy = wy + (Y - H / 2) / S.V.sy;
    ACC = null;
    req();
  }
  cv.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      const k = Math.exp(-e.deltaY * 0.0015),
        p = pos(e);
      zoomAt(p.x, p.y, e.shiftKey ? 1 : k, e.altKey ? 1 : k);
    },
    { passive: false }
  );
  $('#zIn').onclick = () => zoomAt(W / 2, H / 2, 1.25, 1.25);
  $('#zOut').onclick = () => zoomAt(W / 2, H / 2, 0.8, 0.8);
  $('#zHome').onclick = () => fitView();

  /* ---------- панели ---------- */

  const IGL = (a, b) =>
    `<span class="igl"><span class="ig">∫</span><span class="lm"><span>${b}</span><span>${a}</span></span></span>`;
  const intH = () => `${IGL(limH(S.aE, S.a), limH(S.bE, S.b))}${hp(S.fe, 2)} d<i>x</i>`;
  const noV = (R) => (R.undef ? T().v_undef : R.undec ? T().v_undec : T().v_div);
  function valH(R, approx = true) {
    if (R.div) return noV(R);
    if (R.exact) {
      const ex = hp(R.exact, 0),
        n = fmt(R.val, 5);
      return ex === n || ex === n.replace('−', '−') ? ex : `${ex} ≈ ${n}`;
    }
    return `${approx ? '≈ ' : ''}${fmt(R.val, 6)}`;
  }
  const intI = () => `<span class="ig">∫</span>${hp(S.fe, 2)} d<i>x</i>`;
  function renderFx() {
    PRINT.v = 'x';
    const L = T(),
      er = $('#fErr');
    if (S.err) {
      er.hidden = false;
      er.textContent =
        S.err === 'f' ? L.errParse : S.err === 'inf' ? L.errInfF : S.err === 'x' ? L.errX : L.errLim;
      $('#fPrev').innerHTML = '';
      return;
    }
    er.hidden = true;
    $('#fPrev').innerHTML = S.mode === 'I' ? intI() : intH();
  }
  function methsOf(R) {
    const s = R.sol;
    let m = s.F ? s.meth.slice() : [s.ne ? 'nonelem' : 'numeric'];
    if (S.mode === 'I') return m;
    if (R.improper) m.push('improper');
    if (R.odd) m.push('symmetry');
    return m;
  }
  function renderSolve() {
    const box = $('#solve'),
      L = T();
    PRINT.v = 'x';
    if (S.err) {
      box.innerHTML = `<p class="note">${L.cap.err}</p>`;
      return;
    }
    const R = S.R,
      s = R.sol,
      ms = methsOf(R);
    let h = `<div class="mchips">${ms.map((m) => `<button class="chip" data-term="${M2T[m] || m}">${L.mn[m] || m}</button>`).join('')}</div>`;
    const pre = S.mode !== 'I' && S.preset && L.ideas[S.preset],
      idea = pre || L.why[ms[0]];
    if (idea) h += `<p class="idea"><b>${L.s_idea}</b> ${idea}</p>`;
    if (s.F) {
      h += `<details class="steps"${P.stepsClosed ? '' : ' open'} id="stpD"><summary>${L.s_steps}</summary><ol class="stp">${s.steps.map((z) => `<li class="${z.d ? 'sub' : ''}" style="--d:${z.d}">${z.h}</li>`).join('')}</ol></details>`;
      h += `<div class="ans"><div class="k">${L.s_answer}</div><div class="mx"><span class="ig">∫</span>${hp(S.fe, 2)} d<i>x</i> = ${hp(s.F, 0)} + <i>C</i></div><p class="note ok">✓ ${L.s_check}<button class="q" data-term="check">?</button></p></div>`;
    } else
      h += `<p class="note">${s.ne ? L.ne[s.ne] : L.s_fail}</p>${s.ne ? '' : `<ul class="try">${L.s_failTry}</ul>`}`;
    if (S.mode === 'I') {
      if (s.F) h += `<p class="note">${L.iC}<button class="q" data-term="indefinite">?</button></p>`;
      box.innerHTML = h;
      const d0 = $('#stpD');
      if (d0)
        d0.ontoggle = () => {
          P.stepsClosed = !d0.open;
          save();
        };
      return;
    }
    h += `<div class="ans"><div class="k">${L.s_def}</div>`;
    if (R.how === 'nl')
      h += `<p class="note" style="margin:.3rem 0 .2rem">${L.s_nl}</p><div class="mx">${intH()} = <i>F</i>(${limH(S.bE, S.b)}) − <i>F</i>(${limH(S.aE, S.a)}) = ${fmt(R.Fb, 4)} − ${R.Fa < 0 ? '(' + fmt(R.Fa, 4) + ')' : fmt(R.Fa, 4)} = ${valH(R)}</div>`;
    else if (R.how === 'lim')
      h += `<p class="note" style="margin:.3rem 0 .2rem">${L.s_imp} ${L.s_impConv}</p><div class="mx">${intH()} = ${valH(R)}</div>`;
    else if (R.how === 'div')
      h += R.undef
        ? `<p class="note" style="margin:.3rem 0 .2rem">${L.s_undef}</p>`
        : `<p class="note" style="margin:.3rem 0 .2rem">${L.s_imp}</p><div class="mx">${intH()}: ${R.undec ? L.s_undec : R.divOsc ? L.s_divOsc : L.s_div}</div>`;
    else if (R.how === 'jump')
      h += `<p class="note" style="margin:.3rem 0 .2rem">${L.s_jump}</p><div class="mx">${intH()} ${R.exact ? '= ' : ''}${valH(R)}</div>`;
    else
      h += `${R.improper ? `<p class="note" style="margin:.3rem 0 .2rem">${L.s_imp}${R.osc ? ' ' + L.s_osc : ''}</p>` : ''}<div class="mx">${intH()} ${R.exact ? '= ' : ''}${valH(R)}</div>`;
    if (R.odd) h += `<p class="note">${L.s_odd}<button class="q" data-term="symmetry">?</button></p>`;
    else if (R.even) h += `<p class="note">${L.s_even}<button class="q" data-term="symmetry">?</button></p>`;
    h += '</div>';
    box.innerHTML = h;
    const d = $('#stpD');
    if (d)
      d.ontoggle = () => {
        P.stepsClosed = !d.open;
        save();
      };
  }
  function prop(k, v, s, sw) {
    return `<div class="prop"><span class="k">${sw ? `<span class="sw" style="background:${sw}"></span>` : ''}${k}</span><span class="v">${v}</span>${s ? `<span class="s">${s}</span>` : ''}</div>`;
  }
  function renderValues() {
    const L = T(),
      box = $('#props');
    if (S.err) {
      box.innerHTML = '';
      return;
    }
    const R = S.R;
    let h = '';
    if (S.mode === 'I') {
      const x = S.xs;
      h += prop(L.v_Fi, `<i>F</i>(${fmt(x, 3)}) + <i>C</i> = ${fmt(Fi(x), 5)}`, L.v_FiS, 'var(--s-F)');
      h += prop(L.v_fx, fmt(S.ff(x), 5), L.v_fxS, 'var(--s-f)');
      h += prop(L.v_C, fmt(S.C, 2), L.v_CS);
      if (!R.F) h += prop(L.v_num, L.v_none, L.noF);
      box.innerHTML = h;
      return;
    }
    h += prop(L.v_int, R.div ? noV(R) : R.exact ? hp(R.exact, 0) : fmt(R.val, 6), L.v_intS);
    h += prop(L.v_num, R.numOk ? fmt(R.num, 8) : L.v_none, L.v_numS);
    if (!R.improper && !R.undef && R.rs != null) {
      h += prop(L.v_rs, fmt(R.rs, 6), L.v_rsS(L['r_' + S.rule], R.rsN), 'var(--s-rect)');
      h += prop(
        L.v_err,
        (R.rs - R.val >= 0 ? '+' : '') + fmt(R.rs - R.val, Math.abs(R.rs - R.val) < 1e-3 ? 8 : 5),
        L.v_errS
      );
    } else h += prop(L.v_rs, L.v_none, L.v_noRS);
    if (!R.div && R.abs != null) {
      h += prop(L.v_abs, fmt(R.abs, 5), L.v_absS);
      h += prop(
        L.v_pos,
        `<span style="color:var(--s-pos)">${fmt(R.pos, 4)}</span> / <span style="color:var(--s-neg)">${fmt(R.neg, 4)}</span>`,
        L.v_posS
      );
      if (R.mean != null && isFinite(R.mean)) h += prop(L.v_mean, fmt(R.mean, 5), L.v_meanS);
    }
    if (S.mode === 'F') {
      const A = Aat(S.xs);
      h += prop(L.v_F, `<i>F</i>(${fmt(S.xs, 3)}) = ${fmt(A, 5)}`, L.v_FS, 'var(--s-F)');
    }
    box.innerHTML = h;
  }
  function renderPresets() {
    PRINT.v = 'x';
    const box = $('#pre'),
      L = T();
    box.innerHTML = '';
    PRE.forEach(([id, f, a, b, m, hid]) => {
      if (hid) return;
      const btn = document.createElement('button');
      btn.className = 'chip mxc' + (S.preset === id ? ' on' : '');
      btn.dataset.pre = id;
      let e;
      try {
        e = parseFx(f);
      } catch (_) {
        return;
      }
      btn.innerHTML = `<span class="ig">∫</span>${hp(e, 2)}`;
      btn.title = L.mn[m] || '';
      box.appendChild(btn);
    });
    renderHist();
  }
  function renderHist() {
    const L = T();
    if (S.err) {
      $('#hist').innerHTML = '';
      return;
    }
    const ms = methsOf(S.R);
    $('#hist').innerHTML = `${L.now} <b>${ms.map((m) => L.mn[m] || m).join(', ')}</b>`;
  }
  function renderGuide() {
    const L = T(),
      ms = S.err ? [] : methsOf(S.R);
    const act = {
      table: ['table', 'power', 'linsub'],
      linearity: ['linearity'],
      usub: ['usub'],
      parts: ['parts', 'cyclic'],
      partial: ['partial', 'polydiv', 'square'],
      trigid: ['trigid', 'oddpow', 'weier', 'prodsum'],
      trigsub: ['trigsub'],
      nonelem: ['nonelem', 'numeric'],
    };
    $('#guide').innerHTML =
      `<p class="note" style="margin-top:.2rem">${L.g_intro}</p><ol class="guide">${L.guide.map(([id, q, ex, p]) => `<li class="${act[id].some((m) => ms.includes(m)) ? 'on' : ''}"><div><button class="linkbtn" data-term="${id}">${L.mn[id] || T().mn.numeric}</button> ${q}</div><button class="chip" data-pre="${p}">${L.g_ex}: ${ex}</button></li>`).join('')}</ol>`;
  }
  function renderOverlay() {
    const ov = $('#ov');
    if (S.err) {
      ov.innerHTML = `<span class="tt">${T().cap.err}</span>`;
      return;
    }
    PRINT.v = 'x';
    const R = S.R;
    if (S.mode === 'I') {
      const fx = S.ff(S.xs),
        F = Fi(S.xs);
      ov.innerHTML = `<span>${intI()} = ${R.F ? hp(R.F, 0) + ' + <i>C</i>' : '?'}</span><span class="tt">${R.F ? '' : T().noF + '. '}C = ${fmt(S.C, 2)},  x = ${fmt(S.xs, 3)},  F(x) + C = ${fmt(F, 4)},  F′(x) = f(x) = ${fmt(fx, 4)}</span>`;
      return;
    }
    if (S.mode === 'F') {
      const A = Aat(S.xs),
        fx = S.ff(S.xs);
      ov.innerHTML = `<span><i>F</i>(<i>x</i>) = ${IGL(limH(S.aE, S.a), '<i>x</i>')}${hp(S.fe, 2).replace(/<i>x<\/i>/g, '<i>t</i>')} d<i>t</i></span><span class="tt">x = ${fmt(S.xs, 3)},  F(x) = ${fmt(A, 4)},  F′(x) = f(x) = ${fmt(fx, 4)}</span>`;
      return;
    }
    if (S.t < 1 && isFinite(S.a) && isFinite(S.b)) {
      const x = S.a + S.t * (S.b - S.a),
        v = quadF(S.ff, S.a, x).v;
      ov.innerHTML = `<span>${IGL(limH(S.aE, S.a), fmt(x, 2))}${hp(S.fe, 2)} d<i>x</i> ≈ ${fmt(v, 4)}</span><span class="tt">t = ${fmt(S.t)}</span>`;
      return;
    }
    let extra = '';
    if (P.show.riemann && R.rs != null && !R.improper)
      extra = `<span class="tt">${T()['r_' + S.rule]}, n = ${R.rsN}: ${fmt(R.rs, 5)}</span>`;
    ov.innerHTML = `<span>${intH()} ${R.div ? '— ' + noV(R) : (R.exact ? '= ' : '') + valH(R)}</span>${extra}`;
  }
  function renderCaption() {
    const cap = $('#cap'),
      C = T().cap;
    $('#capOpen').hidden = !!P.show.hints;
    if (!P.show.hints) {
      cap.hidden = true;
      return;
    }
    cap.hidden = false;
    let t;
    if (S.err) t = C.err;
    else {
      const R = S.R,
        v = R.div ? '' : valH(R, true);
      if (S.mode === 'I') {
        const fx = S.ff(S.xs);
        t = !P.show.Fcurve ? C.Ih : R.F ? C.I(fmt(S.xs, 2), fmt(fx, 3)) : C.In;
      } else if (S.mode === 'F') {
        const fx = S.ff(S.xs),
          A = Aat(S.xs);
        t = isFinite(A) ? C.F(fmt(S.xs, 2), fmt(A, 3), fmt(fx, 3)) : C.F0;
      } else if (R.undef) t = C.undef;
      else if (R.div) t = C.div;
      else if (R.improper) t = C.imp;
      else if (P.show.riemann && R.rs != null)
        t = C.riem(
          T()['r_' + S.rule],
          R.rsN,
          fmt(R.rs, 5),
          (R.rs - R.val >= 0 ? '+' : '') + fmt(R.rs - R.val, 6)
        );
      else if (S.a > S.b) t = C.rev;
      else if (R.pos > 1e-9 && R.neg < -1e-9) t = C.mix(fmt(R.pos, 3), fmt(-R.neg, 3), fmt(R.val, 4));
      else if (R.val < 0) t = C.neg(fmt(R.val, 4));
      else t = C.pos(fmt(R.val, 4));
    }
    $('#capT').textContent = t.replace(/<[^>]+>/g, '');
  }
  function syncT() {
    $('#tR').value = Math.round(S.t * 1000);
    $('#tOut').textContent = fmt(S.t);
  }
  function syncRiem(full = true) {
    document
      .querySelectorAll('#rSeg button')
      .forEach((b) => b.classList.toggle('on', b.dataset.r === S.rule));
    $('#nR').value = Math.min(200, S.n);
    $('#nOut').textContent = S.rule === 'simp' && S.n % 2 ? `${S.n} → ${S.n + 1}` : S.n;
    $('#rOn').checked = !!P.show.riemann;
    const L = T();
    $('#rNote').textContent = L.rNote[S.rule];
    $('#rImp').hidden = !(S.R && S.R.improper);
    if (full) {
      renderValues();
      renderCaption();
    }
    req();
  }
  function renderAll() {
    renderFx();
    renderSolve();
    renderValues();
    renderPresets();
    renderGuide();
    renderCaption();
    renderTex();
    syncRiem(false);
    syncT();
    req();
  }

  /* ---------- кнопки ---------- */
  let fT = 0;
  $('#fIn').addEventListener('input', (e) => {
    clearTimeout(fT);
    fT = setTimeout(
      () => setIntegral(e.target.value, $('#aIn').value, $('#bIn').value, { noInputs: true }),
      250
    );
  });
  ['#aIn', '#bIn'].forEach((id) =>
    $(id).addEventListener('input', () => {
      clearTimeout(fT);
      fT = setTimeout(
        () =>
          setIntegral($('#fIn').value, $('#aIn').value, $('#bIn').value, {
            noInputs: true,
            keepPreset: true,
          }),
        300
      );
    })
  );
  ['#fIn', '#aIn', '#bIn'].forEach((id) =>
    $(id).addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        clearTimeout(fT);
        setIntegral($('#fIn').value, $('#aIn').value, $('#bIn').value, { noInputs: true, fit: true });
      }
    })
  );
  $('#bSwap').onclick = () => setIntegral(S.fs, S.bs, S.as, { keepPreset: true });
  $('#bFit').onclick = () => fitView();
  document.addEventListener('click', (e) => {
    const q = e.target.closest('[data-term]');
    if (q) {
      e.preventDefault();
      e.stopPropagation();
      openTerm(q.dataset.term);
      return;
    }
    const p = e.target.closest('[data-pre]');
    if (p) {
      loadPreset(p.dataset.pre);
    }
  });
  document.querySelectorAll('#modeSeg button').forEach((b) => (b.onclick = () => setMode(b.dataset.mode)));
  function setMode(m) {
    const wasI = S.mode === 'I';
    S.mode = m;
    P.mode = m;
    S.anim = null;
    document.body.classList.toggle('mF', m === 'F');
    document.body.classList.toggle('mI', m === 'I');
    if (m === 'I' && !P.seenI) {
      P.seenI = true;
      P.show.family = true;
      P.show.tangent = true;
      syncToggles();
    }
    save();
    if (m === 'I' || wasI) {
      document
        .querySelectorAll('#modeSeg button')
        .forEach((b) => b.classList.toggle('on', b.dataset.mode === m));
      setIntegral(S.fs, S.as, S.bs, { keepPreset: true, fit: true });
      return;
    }
    document
      .querySelectorAll('#modeSeg button')
      .forEach((b) => b.classList.toggle('on', b.dataset.mode === m));
    if (
      m === 'F' &&
      isFinite(S.a) &&
      isFinite(S.b) &&
      !(S.xs >= Math.min(S.a, S.b) && S.xs <= Math.max(S.a, S.b))
    )
      S.xs = S.a + 0.6 * (S.b - S.a);
    S.t = 1;
    ACC = null;
    fitView();
    renderAll();
  }
  function play() {
    if (S.err) return;
    if (S.mode === 'I') {
      const x0 = s2w(30, 0)[0],
        x1 = s2w(W - 60, 0)[0];
      S.t = 0;
      S.anim = { kind: 'sweepI', x0, x1, start: performance.now(), dur: 3200 / P.speed };
      req();
      return;
    }
    if (!isFinite(S.a) || !isFinite(S.b)) {
      toast(T().s_imp);
      return;
    }
    S.t = 0;
    S.anim = { kind: 'sweep', start: performance.now(), dur: 2200 / P.speed };
    req();
  }
  function playRiem() {
    if (S.err || (S.R && S.R.improper)) {
      toast(T().rImp);
      return;
    }
    if (S.mode !== 'A') setMode('A');
    P.show.riemann = true;
    syncToggles();
    save();
    S.t = 1;
    S.anim = { kind: 'riem', start: performance.now(), dur: 4200 / P.speed };
    req();
  }
  $('#cR').oninput = (e) => {
    S.C = +e.target.value;
    $('#cOut').textContent = fmt(S.C, 1);
    renderValues();
    renderCaption();
    req();
  };
  $('#bPlay').onclick = play;
  $('#bZero').onclick = () => {
    S.anim = null;
    S.t = 0;
    if (S.mode === 'F' && isFinite(S.a)) S.xs = S.a;
    renderValues();
    req();
  };
  $('#bOne').onclick = () => {
    S.anim = null;
    S.t = 1;
    if (S.mode === 'F' && isFinite(S.b)) S.xs = S.b;
    renderValues();
    renderCaption();
    req();
  };
  $('#tR').oninput = (e) => {
    S.anim = null;
    S.t = e.target.value / 1000;
    if (S.mode === 'I') S.xs = s2w(30 + S.t * (W - 90), 0)[0];
    if (S.mode === 'F' && isFinite(S.a) && isFinite(S.b)) S.xs = S.a + S.t * (S.b - S.a);
    renderValues();
    renderCaption();
    req();
  };
  $('#spR').oninput = (e) => {
    P.speed = +e.target.value;
    $('#spOut').textContent = '×' + fmt(P.speed);
    save();
  };
  document.querySelectorAll('#rSeg button').forEach(
    (b) =>
      (b.onclick = () => {
        S.rule = P.rule = b.dataset.r;
        if (!P.show.riemann) {
          P.show.riemann = true;
          syncToggles();
        }
        save();
        calcRS();
        syncRiem();
        renderOverlay();
      })
  );
  $('#nR').oninput = (e) => {
    S.n = P.n = +e.target.value;
    if (!P.show.riemann) {
      P.show.riemann = true;
      syncToggles();
    }
    save();
    calcRS();
    syncRiem();
    renderOverlay();
  };
  $('#rOn').onchange = (e) => {
    P.show.riemann = e.target.checked;
    syncToggles();
    save();
    syncRiem();
    renderOverlay();
  };
  $('#rPlay').onclick = playRiem;
  $('#capOpen').onclick = () => {
    P.show.hints = true;
    syncToggles();
    renderCaption();
    save();
  };
  $('#capX').onclick = () => {
    P.show.hints = false;
    syncToggles();
    renderCaption();
    save();
  };
  const TOG = [
    ['bgGrid'],
    ['coords'],
    ['area'],
    ['riemann', 'A'],
    ['dots', 'A'],
    ['Fcurve', 'FI'],
    ['tangent', 'FI'],
    ['family', 'FI'],
    ['labels'],
    ['snap'],
    ['hints'],
  ];
  function buildToggles() {
    const box = $('#tog');
    box.innerHTML = '';
    TOG.forEach(([k, m]) => {
      const l = document.createElement('label');
      l.className = 'chk' + (m === 'A' ? ' Aonly' : m === 'F' ? ' Fonly' : m === 'FI' ? ' FIonly' : '');
      l.innerHTML = `<input type="checkbox" data-k="${k}"> <span>${T().tog[k]}</span>`;
      l.querySelector('input').onchange = (e) => {
        P.show[k] = e.target.checked;
        save();
        if (k === 'riemann') syncRiem();
        renderCaption();
        renderOverlay();
        req();
      };
      box.appendChild(l);
    });
  }
  function syncToggles() {
    document.querySelectorAll('#tog input').forEach((i) => {
      i.checked = !!P.show[i.dataset.k];
    });
    const r = $('#rOn');
    if (r) r.checked = !!P.show.riemann;
  }

  /* ---------- справочник ---------- */
  const gloss = createGlossary({
    prefs: () => P,
    save,
    T,
    content: { TERMS, FORMAL, ILL, CHAP, REL, DEMOS },
    onDemo: (id) => runDemo(id),
    illSvg,
  });
  const { termTitle, renderGloss, rerenderGloss, openTerm } = gloss;
  gloss.init();
  initDrawers();

  function illSvg(id) {
    const sp = ILL[id];
    if (!sp) return '';
    const W = 200,
      H = 140,
      o = sp.o,
      sx = sp.sx,
      sy = sp.sy;
    const X = (x) => o[0] + x * sx,
      Y = (y) => o[1] - y * sy,
      c = (k) => `var(--s-${k})`,
      F = (v) => (+v).toFixed(1);
    let out = '';
    const line = (x1, y1, x2, y2, col, w = 1.5, op = 1, dash) =>
      `<line x1="${F(x1)}" y1="${F(y1)}" x2="${F(x2)}" y2="${F(y2)}" stroke="${c(col)}" stroke-width="${w}" stroke-opacity="${op}"${dash ? ' stroke-dasharray="4 3"' : ''}/>`;
    const tx = (x, y, t, col, sz = 12) =>
      `<text x="${F(x)}" y="${F(y)}" fill="${c(col)}" font-size="${sz}" font-style="italic" font-family="'Source Serif 4',Georgia,serif" text-anchor="middle" dominant-baseline="middle" paint-order="stroke" stroke="var(--s-bg)" stroke-width="3" stroke-linejoin="round">${t}</text>`;
    const pts = (a) => a.map((p) => F(p[0]) + ',' + F(Math.max(-20, Math.min(H + 20, p[1])))).join(' ');
    const samp = (f, x0, x1, n = 80) => {
      const r = [];
      for (let i = 0; i <= n; i++) {
        const x = x0 + ((x1 - x0) * i) / n,
          y = f(x);
        if (isFinite(y)) r.push([X(x), Y(y)]);
      }
      return r;
    };
    for (const it of sp.it) {
      const k = it[0],
        a = it.slice(1);
      if (k === 'grid') {
        const st = sx >= 50 ? 1 : sx >= 25 ? 1 : 2;
        for (let i = -20; i <= 20; i++) {
          out += line(X(i * st), 0, X(i * st), H, 'bgGrid', 1);
        }
        const sty = sy >= 50 ? 0.5 : 1;
        for (let i = -20; i <= 20; i++) out += line(0, Y(i * sty), W, Y(i * sty), 'bgGrid', 1);
        out += line(0, Y(0), W, Y(0), 'axis', 1, 0.45) + line(X(0), 0, X(0), H, 'axis', 1, 0.45);
      } else if (k === 'fn') {
        const [f, x0, x1, col, op = 1] = a;
        out += `<polyline points="${pts(samp(f, x0, x1))}" fill="none" stroke="${c(col)}" stroke-width="2.2" stroke-opacity="${op}" stroke-linejoin="round"/>`;
      } else if (k === 'area') {
        const [f, x0, x1] = a,
          p = samp(f, x0, x1, 120);
        const poly = `${F(X(x0))},${F(Y(0))} ${pts(p)} ${F(X(x1))},${F(Y(0))}`;
        const cid = 'c' + id + Math.random().toString(36).slice(2, 7);
        out += `<clipPath id="${cid}a"><rect x="0" y="0" width="${W}" height="${F(Y(0))}"/></clipPath><clipPath id="${cid}b"><rect x="0" y="${F(Y(0))}" width="${W}" height="${H}"/></clipPath><polygon points="${poly}" fill="${c('pos')}" fill-opacity=".35" clip-path="url(#${cid}a)"/><polygon points="${poly}" fill="${c('neg')}" fill-opacity=".35" clip-path="url(#${cid}b)"/>`;
      } else if (k === 'rects') {
        const [f, x0, x1, n, rule] = a,
          h = (x1 - x0) / n;
        if (rule === 'simp') {
          for (let i = 0; i < n; i += 2) {
            const q0 = x0 + i * h,
              f0 = f(q0),
              f1 = f(q0 + h),
              f2 = f(q0 + 2 * h),
              pp = [[X(q0), Y(0)]];
            for (let j = 0; j <= 16; j++) {
              const t = j / 16;
              pp.push([
                X(q0 + 2 * h * t),
                Y(f0 * (t - 0.5) * (t - 1) * 2 + f1 * (-4 * t * (t - 1)) + f2 * t * (t - 0.5) * 2),
              ]);
            }
            pp.push([X(q0 + 2 * h), Y(0)]);
            out += `<polygon points="${pts(pp)}" fill="${c('rect')}" fill-opacity=".22" stroke="${c('rect')}" stroke-width="1.2"/>`;
          }
        } else
          for (let i = 0; i < n; i++) {
            const l = x0 + i * h,
              r = l + h;
            if (rule === 'trap')
              out += `<polygon points="${pts([
                [X(l), Y(0)],
                [X(l), Y(f(l))],
                [X(r), Y(f(r))],
                [X(r), Y(0)],
              ])}" fill="${c('rect')}" fill-opacity=".22" stroke="${c('rect')}" stroke-width="1.2"/>`;
            else {
              const xp = rule === 'left' ? l : rule === 'right' ? r : l + h / 2,
                yy = f(xp);
              out += `<polygon points="${pts([
                [X(l), Y(0)],
                [X(l), Y(yy)],
                [X(r), Y(yy)],
                [X(r), Y(0)],
              ])}" fill="${c('rect')}" fill-opacity=".22" stroke="${c('rect')}" stroke-width="1.2"/><circle cx="${F(X(xp))}" cy="${F(Y(yy))}" r="2.6" fill="${c('rect')}"/>`;
            }
          }
      } else if (k === 'vl') {
        const [x, col] = a;
        out += line(X(x), 0, X(x), H, col, 1.4, 0.85, true);
      } else if (k === 'tan') {
        const [f, x0, col] = a,
          d = 1e-4,
          m = (f(x0 + d) - f(x0 - d)) / (2 * d),
          y0 = f(x0);
        out +=
          line(X(x0 - 1), Y(y0 - m), X(x0 + 1), Y(y0 + m), col, 2) +
          `<circle cx="${F(X(x0))}" cy="${F(Y(y0))}" r="3.2" fill="${c('F')}"/>`;
      } else if (k === 't') {
        const [x, y, t, col, sz] = a;
        out += tx(X(x), Y(y), t, col, sz);
      } else if (k === 'T') {
        const [x, y, t, col, sz] = a;
        out += tx(x, y, t, col, sz);
      } else if (k === 'raw') out += a[0];
    }
    return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><rect width="${W}" height="${H}" fill="var(--s-bg)"/>${out}</svg>`;
  }

  function runDemo(id) {
    const d = DEMOS[id];
    if (!d) return;
    if (d.mode && d.mode !== S.mode) setMode(d.mode);
    else if (!d.mode && S.mode !== 'A') setMode('A');
    if (d.fam !== undefined) P.show.family = d.fam;
    if (d.tan) P.show.tangent = true;
    if (d.riem) {
      P.show.riemann = true;
      S.rule = P.rule = d.rule;
      S.n = P.n = d.n;
    } else if (d.riem === undefined && !d.mode) P.show.riemann = false;
    syncToggles();
    save();
    if (d.p) loadPreset(d.p);
    else setIntegral(d.f, d.a, d.b, { fit: true });
    if (d.riem) showPanel('riemann');
    else showPanel('solve');
    if (d.rplay) setTimeout(playRiem, 400);
    else if (d.mode === 'F') setTimeout(play, 300);
  }

  /* ---------- экспорт ---------- */
  const keysUi = createKeys({ T, keys: KEYS });
  const { renderKeys, openKeys } = keysUi;
  keysUi.init();
  const ex = createExport({
    name: 'integral',
    T,
    state: S,
    cv,
    renderNow,
    req,
    // видео: анимация интеграла; для определённого — только с конечными пределами
    video: { ready: () => S.mode === 'I' || (isFinite(S.a) && isFinite(S.b)), play: () => play() },
  });
  const { canSave, updExport, flash, exportPng, exportVideo, vidMime } = ex;
  ex.init();
  let fmtMode = 'tex';

  function renderTex() {
    const ta = $('#xTex');
    if (S.err) {
      ta.value = '';
      return;
    }
    const R = S.R,
      F = R.sol.F;
    const lim = (v, e, m) =>
      v === Infinity
        ? m === 'tex'
          ? '\\infty'
          : m === 'py'
            ? 'oo'
            : 'inf'
        : v === -Infinity
          ? m === 'tex'
            ? '-\\infty'
            : m === 'py'
              ? '-oo'
              : '-inf'
          : e
            ? tp(e, 0, m)
            : String(v);
    const val = (m) =>
      R.div
        ? m === 'tex'
          ? '\\infty'
          : 'diverges'
        : R.exact
          ? tp(R.exact, 0, m)
          : String(+R.val.toFixed(10));
    if (S.mode === 'I') {
      if (fmtMode === 'tex')
        ta.value = F
          ? `\\int ${tp(S.fe, 2, 'tex')}\\,dx = ${tp(F, 0, 'tex')} + C`
          : `\\int ${tp(S.fe, 2, 'tex')}\\,dx`;
      else if (fmtMode === 'np')
        ta.value = `from sympy import *\nx = symbols('x')\nf = ${tp(S.fe, 0, 'py')}\nprint(integrate(f, x))`;
      else
        ta.value = F ? `∫ ${tp(S.fe, 2, 'txt')} dx = ${tp(F, 0, 'txt')} + C` : `∫ ${tp(S.fe, 2, 'txt')} dx`;
      return;
    }
    if (fmtMode === 'tex') {
      let s = '';
      if (F) s += `\\int ${tp(S.fe, 2, 'tex')}\\,dx = ${tp(F, 0, 'tex')} + C\n`;
      s += `\\int_{${lim(S.a, S.aE, 'tex')}}^{${lim(S.b, S.bE, 'tex')}} ${tp(S.fe, 2, 'tex')}\\,dx ${R.div ? '\\text{ diverges}' : (R.exact ? '= ' : '\\approx ') + val('tex')}`;
      ta.value = s;
    } else if (fmtMode === 'np')
      ta.value = `from sympy import *\nx = symbols('x')\nf = ${tp(S.fe, 0, 'py')}\nprint(integrate(f, x))\nprint(integrate(f, (x, ${lim(S.a, S.aE, 'py')}, ${lim(S.b, S.bE, 'py')})))`;
    else {
      let s = '';
      if (F) s += `∫ ${tp(S.fe, 2, 'txt')} dx = ${tp(F, 0, 'txt')} + C\n`;
      s += `∫[${S.as}; ${S.bs}] ${tp(S.fe, 2, 'txt')} dx ${R.div ? T().v_div : (R.exact ? '= ' : '≈ ') + val('txt')}${R.exact ? ' ≈ ' + fmt(R.val, 6).replace('−', '-') : ''}`;
      ta.value = s;
    }
  }

  document.querySelectorAll('#xFmt button').forEach(
    (b) =>
      (b.onclick = () => {
        fmtMode = b.dataset.f;
        document.querySelectorAll('#xFmt button').forEach((x) => x.classList.toggle('on', x === b));
        renderTex();
      })
  );

  /* ---------- горячие клавиши ---------- */

  function flip(k) {
    P.show[k] = !P.show[k];
    syncToggles();
    save();
    if (k === 'riemann') syncRiem();
    renderCaption();
    renderOverlay();
    req();
    const L = T();
    toast(`${L.tog[k]}: ${P.show[k] ? L.on : L.off}`);
  }
  const RULES_R = ['left', 'mid', 'right', 'trap', 'simp'];
  onShortcut((c, e, isQ) => {
    const L = T();
    let h = true;
    const setT = (v) => {
      S.anim = null;
      S.t = Math.max(0, Math.min(1, v));
      if (S.mode === 'I') S.xs = s2w(30 + S.t * (W - 90), 0)[0];
      if (S.mode === 'F' && isFinite(S.a) && isFinite(S.b)) S.xs = S.a + S.t * (S.b - S.a);
      renderValues();
      renderCaption();
      req();
    };
    if (isQ) openKeys();
    else if (c === 'Space') play();
    else if (c === 'ArrowLeft' || c === 'ArrowRight') {
      const st = e.shiftKey ? 0.25 : 0.05;
      setT(Math.round((S.t + (c === 'ArrowLeft' ? -st : st)) * 100) / 100);
    } else if (c === 'Home') setT(0);
    else if (c === 'End') setT(1);
    else if (/^(Digit|Numpad)[1-9]$/.test(c)) {
      const p = PRE[+c.slice(-1) - 1];
      if (p) {
        loadPreset(p[0]);
        toast(L.mn[p[4]] || '');
      }
    } else if (c === 'Digit0' || c === 'Numpad0') fitView();
    else if (c === 'KeyD') {
      setMode(S.mode === 'A' ? 'F' : S.mode === 'F' ? 'I' : 'A');
      toast(S.mode === 'A' ? L.mA : S.mode === 'F' ? L.mF : L.mI);
    } else if (c === 'KeyR') flip('riemann');
    else if (c === 'BracketLeft' || c === 'BracketRight') {
      S.n = P.n = Math.max(1, Math.min(200, S.n + (c === 'BracketLeft' ? -1 : 1)));
      P.show.riemann = true;
      syncToggles();
      save();
      calcRS();
      syncRiem();
      renderOverlay();
    } else if (c === 'KeyN') {
      S.rule = P.rule = RULES_R[(RULES_R.indexOf(S.rule) + 1) % 5];
      P.show.riemann = true;
      syncToggles();
      save();
      calcRS();
      syncRiem();
      renderOverlay();
      toast(L['r_' + S.rule]);
    } else if (c === 'KeyM') playRiem();
    else if (c === 'KeyX') $('#bSwap').click();
    else if (c === 'KeyV') flip('Fcurve');
    else if (c === 'KeyT') flip('tangent');
    else if (c === 'KeyF') flip('family');
    else if (c === 'KeyG') flip('bgGrid');
    else if (c === 'KeyL') flip('labels');
    else if (c === 'KeyH') flip('hints');
    else if (c === 'Equal' || c === 'NumpadAdd') $('#zIn').click();
    else if (c === 'Minus' || c === 'NumpadSubtract') $('#zOut').click();
    else if (c === 'KeyS') {
      if (canSave()) exportPng();
      else toast(L.xNoDl);
    } else if (c === 'KeyA') {
      if (canSave() && vidMime()) exportVideo();
      else toast(canSave() ? L.xNoVid : L.xNoDl);
    } else if (c === 'Slash') {
      $('#openGloss').click();
      setTimeout(() => $('#gq').focus(), 30);
    } else h = false;
    return h;
  });

  /* ---------- настройки ---------- */
  const settings = createSettings({
    prefs: () => P,
    setPrefs: (np) => {
      P = np;
    },
    save,
    T,
    defaults: DEF,
    panels: PANELS,
    palettes: PAL,
    main,
    side,
    hooks: {
      applyLang,
      applyOrder,
      syncToggles,
      renderAll,
      req,
      // «Сбросить всё» в «Интегралах» сбрасывает и суммы Римана, и ползунок скорости
      onReset: (np) => {
        S.rule = np.rule;
        S.n = np.n;
        $('#spR').value = np.speed;
        $('#spOut').textContent = '×1';
        calcRS();
      },
    },
  });
  const { buildSettings, buildPal, syncSettings, applyDock, applyPrefs } = settings;
  settings.init();

  function applyLang() {
    const L = T();
    document.documentElement.lang = lang();
    document.title = L.title;
    applyTexts(L);
    $('#gq').placeholder = L.search;
    cv.setAttribute('aria-label', L.canvas);
    document
      .querySelectorAll('#langSeg button,#langSeg2 button')
      .forEach((b) => b.classList.toggle('on', b.dataset.l === lang()));
    buildPal();
    buildToggles();
    syncToggles();
    syncSettings();
    updExport();
    renderKeys();
    if ($('#dGloss').classList.contains('open')) rerenderGloss();
    if (S.fe || S.err) {
      analyze(true);
      renderAll();
    }
  }

  /* ---------- старт ---------- */
  buildPanels();
  buildSettings();
  $('#spR').value = P.speed;
  $('#spOut').textContent = '×' + fmt(P.speed);
  applyPrefs();
  {
    const l = P.last;
    if (l && typeof l.f === 'string') setIntegral(l.f, l.a, l.b, { preset: l.p || null });
    else loadPreset('p_pow');
  }
  applyLang();
  setMode(['A', 'F', 'I'].includes(P.mode) ? P.mode : 'A');
  if (document.fonts && document.fonts.ready)
    document.fonts.ready.then(() => {
      fitView();
      req();
    });
})();
