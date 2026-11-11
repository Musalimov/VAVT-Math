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
import { GROUPS, PRE } from './content/examples.js';
import { CHAP, DEMOS, FORMAL, ILL, REL, TERMS } from './content/glossary.js';
import { TX, TXS } from './content/tx.js';
import {
  csRecover,
  dot,
  dualOf,
  feasible,
  intSearch,
  opt2,
  parseProblem,
  ranging,
  region2,
  symNorm,
} from './solvers/lp.js';
import { lang, langFrom } from '../../shared/i18n.js';
import { Q1, Z0 } from '../../math/fractions.js';
import { Q } from '../../math/fractions.js';
import { bigNum } from '../../math/fractions.js';
import { bgcd } from '../../math/fractions.js';
import { simplex } from '../../math/simplex.js';
import { bigOf } from '../../math/fractions.js';
import { toFrac } from '../../math/fractions.js';
(() => {
  'use strict';
  /* ---------- точные дроби ---------- */

  /* Q — рациональное число на BigInt: точность не теряется ни при каком числе итераций симплекса.
   N, D — точные BigInt (D > 0, НОД = 1). n, d, v — Number-приближения для логики отображения;
   цифры печатаем только из ns / ds / as (строки), чтобы большие дроби не искажались. */

  /* ---------- разбор задачи ---------- */

  /* ---------- двойственная задача (правила из § 4.1) ---------- */

  /* ---------- вычисление значения ---------- */

  /* ---------- симплекс-метод (как в § 5.2) ---------- */

  /* ---------- линейные системы ---------- */

  /* ---------- геометрия двух переменных ---------- */

  /* ---------- дополняющая нежёсткость: решение прямой по двойственной ---------- */

  /* ---------- целочисленный перебор ---------- */

  /* ---------- устойчивость и чувствительность (производственная задача) ---------- */

  /* ---------- приведение к симметричной форме (как на семинаре) ---------- */

  /* ---------- справочник ---------- */

  let LNG = 'ru';
  const KEY = 'optim-viz-v1';
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
      reg: '#83c167',
      line: '#58c4dd',
      grad: '#f4d345',
      level: '#ff7aa8',
      opt: '#fc6255',
      vert: '#c77dff',
      int: '#ff9f43',
    },
    paper: {
      bg: '#fbfaf7',
      bgGrid: '#e3e1da',
      axis: '#23262b',
      reg: '#3f9a3a',
      line: '#2b6cb0',
      grad: '#b07900',
      level: '#c0398b',
      opt: '#d1453b',
      vert: '#8e44ad',
      int: '#e67e22',
    },
    neon: {
      bg: '#07020f',
      bgGrid: '#1f1533',
      axis: '#ffffff',
      reg: '#39ff88',
      line: '#4dd2ff',
      grad: '#fff35c',
      level: '#ff9ecf',
      opt: '#ff4d6d',
      vert: '#a98bff',
      int: '#ffa53d',
    },
    nord: {
      bg: '#2e3440',
      bgGrid: '#3b4252',
      axis: '#eceff4',
      reg: '#a3be8c',
      line: '#88c0d0',
      grad: '#ebcb8b',
      level: '#e5a0c0',
      opt: '#bf616a',
      vert: '#b48ead',
      int: '#d08770',
    },
  };
  const T = () => {
    const b = TX[lang()] || TX.ru;
    if (P.style !== 'sem') return b;
    const o = TXS[lang()] || TXS.ru;
    return {
      ...b,
      ...o,
      cap: { ...b.cap, ...(o.cap || {}) },
      tog: { ...b.tog, ...(o.tog || {}) },
      colors: { ...b.colors, ...(o.colors || {}) },
      sv: { ...b.sv, ...(o.sv || {}) },
      grp: { ...b.grp, ...(o.grp || {}) },
    };
  };
  const SEM = () => P.style === 'sem';
  const PANELS = ['problem', 'presets', 'solve', 'dual', 'simplex', 'excel', 'anim', 'show', 'export'];
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
    collapsed: { excel: true, export: true },
    read: {},
    float: { x: 12, y: 12 },
    style: 'sem',
    show: {
      bgGrid: true,
      coords: true,
      region: true,
      lines: true,
      sides: true,
      gradient: true,
      level: true,
      vertices: true,
      ints: true,
      labels: true,
      snap: true,
      hints: true,
    },
    last: null,
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

  /* ---------- форматирование ---------- */
  const frac = (n, d) => `<span class="fr"><span class="fn">${n}</span><span class="fd">${d}</span></span>`;
  const SUBD = '₀₁₂₃₄₅₆₇₈₉';
  const subD = (s) => String(s).replace(/\d/g, (d) => SUBD[d]);
  function varH(n) {
    const m = /^([a-zA-Z]+)_?(\d*)('*)$/.exec(n);
    if (!m) return `<i>${n}</i>`;
    return `<i>${m[1]}</i>${m[2] ? `<sub>${m[2]}</sub>` : ''}${m[3].replace("''", '″').replace("'", '′')}`;
  }
  function varT(n) {
    const m = /^([a-zA-Z]+)_?(\d*)('*)$/.exec(n);
    if (!m) return n;
    return m[1] + subD(m[2]) + m[3].replace("''", '″').replace("'", '′');
  }
  const isDec = (q) => q.d > 1 && q.d <= 1000 && q.d % 10 === 0;
  const decS = (q) => String(+Math.abs(q.v).toFixed(3));
  function qH(q, sign = true) {
    const s = q.s < 0 ? '−' : '',
      a = q.as;
    return (sign ? s : '') + (q.int ? a : isDec(q) ? decS(q) : frac(a, q.ds));
  }
  function qT(q) {
    const s = q.s < 0 ? '−' : '';
    const a = q.as;
    return s + (q.int ? a : isDec(q) ? decS(q) : q.d <= 64 ? `${a}/${q.ds}` : fmt(Math.abs(q.v), 4));
  }
  function qD(q) {
    return q.int ? '' : ` ≈ ${fmt(q.v, 4)}`;
  }
  const ptH = (p) => `(${p.map((q) => qH(q)).join('; ')})`;
  const ptT = (p) => `(${p.map(qT).join('; ')})`;
  function linH(a, names, c0) {
    let s = '';
    a.forEach((q, j) => {
      if (q.z) return;
      const neg = q.s < 0,
        abs = q.abs();
      const co = abs.eq(Q1) ? '' : qH(abs);
      s += (s ? (neg ? ' − ' : ' + ') : neg ? '−' : '') + co + varH(names[j]);
    });
    if (c0 && !c0.z) s += (s ? (c0.s < 0 ? ' − ' : ' + ') : c0.s < 0 ? '−' : '') + qH(c0.abs());
    return s || '0';
  }
  function linT(a, names, c0, ascii) {
    let s = '';
    a.forEach((q, j) => {
      if (q.z) return;
      const neg = q.s < 0,
        abs = q.abs();
      const co = abs.eq(Q1) ? '' : ascii ? (abs.int ? abs.ns : abs.ns + '/' + abs.ds) : qT(abs);
      s +=
        (s ? (neg ? (ascii ? ' - ' : ' − ') : ' + ') : neg ? (ascii ? '-' : '−') : '') +
        co +
        (ascii ? names[j] : varT(names[j]));
    });
    if (c0 && !c0.z) {
      const a = c0.abs();
      s +=
        (s ? (c0.s < 0 ? (ascii ? ' - ' : ' − ') : ' + ') : c0.s < 0 ? '-' : '') +
        (ascii ? (a.int ? a.ns : a.ns + '/' + a.ds) : qT(a));
    }
    return s || '0';
  }
  const opH = (o) => (o === '<=' ? '⩽' : o === '>=' ? '⩾' : '=');
  const zName = (G) => (G && G.isDual ? (SEM() ? 'f' : 'w') : SEM() ? 'Z' : 'z');
  const zP = () => (SEM() ? 'Z' : 'z'),
    zD = () => (SEM() ? 'f' : 'w');
  const gradT = () => (SEM() ? 'grad ' : '∇');
  function probH(G, opts = {}) {
    const L = T();
    const nm = zName(G);
    let h = `<span class="obj">${varH(nm)} = ${linH(G.c, G.vars, G.c0)} → ${G.sense}</span><span class="sys">`;
    G.cons.forEach((c, i) => {
      h += `<span>${linH(c.a, G.vars)}</span><span>${opH(c.op)}</span><span>${qH(c.b)}<span class="no">(${i + 1})</span></span>`;
    });
    h += '</span>';
    const ge = G.vars.filter((_, j) => G.sign[j] === 'ge' && !G.bin[j]),
      le = G.vars.filter((_, j) => G.sign[j] === 'le'),
      fr = G.vars.filter((_, j) => G.sign[j] === 'free'),
      it = G.vars.filter((_, j) => G.int[j] && !G.bin[j]),
      bn = G.vars.filter((_, j) => G.bin[j]);
    const sg = [];
    if (ge.length) sg.push(`${ge.map(varH).join(', ')} ⩾ 0`);
    if (le.length) sg.push(`${le.map(varH).join(', ')} ⩽ 0`);
    if (fr.length) sg.push(`${fr.map(varH).join(', ')} — ${L.anySign}`);
    if (it.length) sg.push(`${it.map(varH).join(', ')} ∈ ℤ`);
    if (bn.length) sg.push(`${bn.map(varH).join(', ')} ∈ {0, 1}`);
    if (sg.length) h += `<span class="sg">${sg.join('; ')}</span>`;
    return h;
  }
  function probText(G) {
    const lines = [`z = ${linT(G.c, G.vars, G.c0, true)} -> ${G.sense}`];
    G.cons.forEach((c) =>
      lines.push(`${linT(c.a, G.vars, null, true)} ${c.op} ${c.b.int ? c.b.ns : c.b.ns + '/' + c.b.ds}`)
    );
    const ge = G.vars.filter((_, j) => G.sign[j] === 'ge' && !G.bin[j]),
      le = G.vars.filter((_, j) => G.sign[j] === 'le'),
      it = G.vars.filter((_, j) => G.int[j] && !G.bin[j]),
      bn = G.vars.filter((_, j) => G.bin[j]);
    if (ge.length) lines.push(ge.join(', ') + ' >= 0');
    if (le.length) lines.push(le.join(', ') + ' <= 0');
    if (it.length) lines.push(it.join(', ') + ' ∈ Z');
    if (bn.length) lines.push(bn.join(', ') + ' ∈ {0,1}');
    return lines.join('\n');
  }

  /* ---------- состояние и решение ---------- */
  const S = {
    txt: '',
    P: null,
    D: null,
    err: null,
    rP: null,
    rD: null,
    view: 'P',
    G: null,
    R: null,
    O: null,
    I: null,
    V: { cx: 2, cy: 2, s: 60 },
    zl: 0,
    t: 1,
    anim: null,
    preset: null,
    drag: null,
    gf: 1,
  };
  function solveAll(o = {}) {
    S.err = null;
    S.P = S.D = S.rP = S.rD = S.G = S.R = S.O = S.I = null;
    try {
      S.P = parseProblem(S.txt);
    } catch (e) {
      S.err = e;
      renderAll();
      return;
    }
    const P0 = S.P;
    S.Pn = SEM() ? symNorm(P0) : P0;
    S.D = dualOf(S.Pn);
    try {
      S.rP = simplex(P0);
    } catch (e) {
      S.rP = { status: 'fail', log: [] };
    }
    try {
      S.rD = simplex(S.D);
    } catch (e) {
      S.rD = { status: 'fail', log: [] };
    }
    const canP = P0.vars.length === 2,
      canD = S.D.vars.length === 2;
    if (o.autoView) S.view = canP ? 'P' : canD ? 'D' : 'P';
    if (S.view === 'P' && !canP && canD) S.view = 'D';
    if (S.view === 'D' && !canD && canP) S.view = 'P';
    S.G = S.view === 'P' ? (canP ? P0 : null) : canD ? S.D : null;
    if (S.G) {
      S.R = region2(S.G);
      S.O = opt2(S.G, S.R);
      computeZRange();
    }
    if (P0.int.some(Boolean)) {
      S.I = intSearch(P0, P0.vars.length === 2 ? (S.view === 'P' && S.R ? S.R : region2(P0)) : null);
    }
    if (o.fit) fitView();
    if (!o.keepT) S.t = 1;
    setZfromT();
    document.querySelectorAll('#modeSeg button').forEach((b) => {
      const ok = b.dataset.mode === 'P' ? canP : canD;
      b.classList.toggle('dis', !ok);
      b.setAttribute('aria-disabled', String(!ok));
      b.classList.toggle('on', b.dataset.mode === S.view && !!S.G);
    });
    P.last = { txt: S.txt, p: S.preset };
    save();
    renderAll();
  }
  function computeZRange() {
    const G = S.G,
      R = S.R;
    S.zr = null;
    if (!R || R.empty) return;
    const c = [G.c[0].v, G.c[1].v];
    if (!c[0] && !c[1]) return;
    const real = R.verts.filter((v) => !v.box).map((v) => c[0] * v.f[0] + c[1] * v.f[1]);
    if (!real.length) return;
    let lo = Math.min(...real),
      hi = Math.max(...real);
    const span = Math.max(hi - lo, Math.abs(hi) * 0.3, 1);
    const max = G.sense === 'max';
    let start = lo - span * 0.45,
      end = max ? hi : lo;
    if (!max && SEM()) {
      start = hi + span * 0.45;
    }
    if (S.O && S.O.status === 'unbounded') end = max ? hi + span * 1.6 : lo - span * 1.6;
    if (!max && S.O && S.O.status === 'unbounded') {
      start = hi + span * 0.45;
    }
    S.zr = { start, end, lo, hi, sweepGe: !max && SEM() };
  }
  function setZfromT() {
    if (!S.zr) return;
    S.zl = S.zr.start + S.t * (S.zr.end - S.zr.start);
  }
  function loadPreset(id) {
    const p = PRE.find((z) => z[0] === id);
    if (!p) return;
    S.preset = id;
    S.txt = p[1];
    $('#pIn').value = p[1];
    S.anim = null;
    solveAll({ autoView: true, fit: true });
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
      const p = Math.min(1, (now - A.start) / A.dur);
      S.t = ease(p);
      setZfromT();
      if (p >= 1) {
        S.anim = null;
        renderCaption();
        if (A.then) A.then();
      }
    }
    renderNow();
    renderOverlay();
    syncT();
    if (S.anim) req();
  }
  const sX = (x) => W / 2 + (x - S.V.cx) * S.V.s,
    sY = (y) => H / 2 - (y - S.V.cy) * S.V.s;
  const s2w = (X, Y) => [S.V.cx + (X - W / 2) / S.V.s, S.V.cy - (Y - H / 2) / S.V.s];
  function niceStep(raw) {
    const p = Math.pow(10, Math.floor(Math.log10(raw))),
      m = raw / p;
    return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p;
  }
  function fitView() {
    if (!W || !H) return;
    let xs = [0],
      ys = [0];
    if (S.R && !S.R.empty) {
      S.R.verts
        .filter((v) => !v.box)
        .forEach((v) => {
          xs.push(v.f[0]);
          ys.push(v.f[1]);
        });
      if (S.R.unbounded || xs.length < 3) {
        S.R.lines.forEach((l) => {
          if (l.kind !== 'c') return;
          if (!l.a.z) {
            xs.push(l.c.v / l.a.v);
          }
          if (!l.b.z) {
            ys.push(l.c.v / l.b.v);
          }
        });
      }
    } else if (S.R) {
      S.R.lines.forEach((l) => {
        if (l.kind !== 'c') return;
        if (!l.a.z) xs.push(l.c.v / l.a.v);
        if (!l.b.z) ys.push(l.c.v / l.b.v);
      });
    }
    let x0 = Math.min(...xs),
      x1 = Math.max(...xs),
      y0 = Math.min(...ys),
      y1 = Math.max(...ys);
    if (S.R && S.R.unbounded) {
      const dx = Math.max(x1 - x0, 1),
        dy = Math.max(y1 - y0, 1);
      x1 += dx * 0.6;
      y1 += dy * 0.6;
    }
    if (x1 - x0 < 1e-9) {
      x0 -= 1;
      x1 += 1;
    }
    if (y1 - y0 < 1e-9) {
      y0 -= 1;
      y1 += 1;
    }
    const pT = Math.min(110, H * 0.2),
      pB = Math.min(80, H * 0.13),
      pL = 40,
      pR = 60,
      s = Math.min((W - pL - pR) / (x1 - x0), (H - pT - pB) / (y1 - y0)) * 0.9;
    S.V = { s, cx: (x0 + x1) / 2 + (pR - pL) / 2 / s, cy: (y0 + y1) / 2 + (pT - pB) / 2 / s };
    req();
  }
  function clipPoly(poly, a, b, c, op) {
    const f = (p) => {
      const v = a * p[0] + b * p[1] - c;
      return op === '<=' ? -v : v;
    };
    const out = [];
    for (let i = 0; i < poly.length; i++) {
      const p = poly[i],
        q = poly[(i + 1) % poly.length],
        fp = f(p),
        fq = f(q);
      if (fp >= 0) out.push(p);
      if (fp >= 0 !== fq >= 0) {
        const t = fp / (fp - fq);
        out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]);
      }
    }
    return out;
  }
  function viewPoly(poly) {
    const [x0, y1] = s2w(-50, -50),
      [x1, y0] = s2w(W + 50, H + 50);
    let p = poly;
    p = clipPoly(p, 1, 0, x0, '>=');
    p = clipPoly(p, 1, 0, x1, '<=');
    p = clipPoly(p, 0, 1, y0, '>=');
    p = clipPoly(p, 0, 1, y1, '<=');
    return p;
  }
  function lineSeg(a, b, c) {
    // endpoints of a x + b y = c within view
    const [x0, y1] = s2w(0, 0),
      [x1, y0] = s2w(W, H);
    const pts = [];
    if (Math.abs(b) > 1e-12) {
      for (const x of [x0, x1]) {
        pts.push([x, (c - a * x) / b]);
      }
    }
    if (Math.abs(a) > 1e-12) {
      for (const y of [y0, y1]) {
        pts.push([(c - b * y) / a, y]);
      }
    }
    const inV = (p) => p[0] >= x0 - 1e-9 && p[0] <= x1 + 1e-9 && p[1] >= y0 - 1e-9 && p[1] <= y1 + 1e-9;
    const q = pts.filter(inV);
    if (q.length < 2) return null;
    q.sort((p, r) => p[0] - r[0] || p[1] - r[1]);
    return [q[0], q[q.length - 1]];
  }
  function renderNow() {
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const c = P.colors;
    ctx.fillStyle = c.bg;
    ctx.fillRect(0, 0, W, H);
    drawGrid();
    if (!S.G || !S.R) {
      if (S.stamp) drawStamp();
      return;
    }
    const G = S.G,
      R = S.R,
      lw = P.lw;
    if (P.show.region && !R.empty) {
      const vp = viewPoly(R.poly);
      if (vp.length) {
        ctx.beginPath();
        vp.forEach((p, i) => (i ? ctx.lineTo(sX(p[0]), sY(p[1])) : ctx.moveTo(sX(p[0]), sY(p[1]))));
        ctx.closePath();
        ctx.globalAlpha = 0.26;
        ctx.fillStyle = c.reg;
        ctx.fill();
        ctx.globalAlpha = 0.85;
        ctx.strokeStyle = c.reg;
        ctx.lineWidth = (isFlat(vp) ? 5 : 1.6) * lw;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      if (P.show.level && S.zr) {
        const cc = [G.c[0].v, G.c[1].v];
        const sw = viewPoly(clipPoly(R.poly, cc[0], cc[1], S.zl, S.zr.sweepGe ? '>=' : '<='));
        if (sw.length > 2) {
          ctx.beginPath();
          sw.forEach((p, i) => (i ? ctx.lineTo(sX(p[0]), sY(p[1])) : ctx.moveTo(sX(p[0]), sY(p[1]))));
          ctx.closePath();
          ctx.globalAlpha = 0.22;
          ctx.fillStyle = c.reg;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
    }
    if (P.show.lines)
      R.lines.forEach((l) => {
        if (l.kind !== 'c') return;
        const sg = lineSeg(l.a.v, l.b.v, l.c.v);
        if (!sg) return;
        ctx.strokeStyle = c.line;
        ctx.lineWidth = 1.7 * lw;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.moveTo(sX(sg[0][0]), sY(sg[0][1]));
        ctx.lineTo(sX(sg[1][0]), sY(sg[1][1]));
        ctx.stroke();
        ctx.globalAlpha = 1;
        const m = [(sg[0][0] + sg[1][0]) / 2, (sg[0][1] + sg[1][1]) / 2];
        if (P.show.sides && l.op !== '=') {
          const n = [l.a.v, l.b.v],
            nl = Math.hypot(n[0], n[1]),
            dir = l.op === '<=' ? -1 : 1,
            dx = (dir * n[0]) / nl,
            dy = (dir * n[1]) / nl;
          const t = [-dy, dx];
          const along = [sg[1][0] - sg[0][0], sg[1][1] - sg[0][1]];
          for (const k of [0.25, 0.75]) {
            const P0 = [sg[0][0] + along[0] * k, sg[0][1] + along[1] * k],
              X = sX(P0[0]),
              Y = sY(P0[1]);
            arrow(X, Y, X + dx * 20, Y - dy * 20, c.line, 1.5, 6);
          }
        }
        if (P.show.labels) {
          const k = 0.82,
            X = sX(sg[0][0] + (sg[1][0] - sg[0][0]) * k),
            Y = sY(sg[0][1] + (sg[1][1] - sg[0][1]) * k);
          label(`(${l.i + 1})`, X, Y - 12, c.line, 14, false);
        }
      });
    if (P.show.ints && S.I && S.I.pts && S.view === 'P' && S.P.vars.length === 2) {
      ctx.fillStyle = c.int;
      for (const p of S.I.pts) {
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.arc(sX(p[0]), sY(p[1]), 2.6, 0, 7);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      for (const b of S.I.best || []) {
        ctx.strokeStyle = c.int;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.arc(sX(b[0].v), sY(b[1].v), 7, 0, 7);
        ctx.stroke();
      }
    }
    if (P.show.level && S.zr) {
      const sg = lineSeg(G.c[0].v, G.c[1].v, S.zl);
      if (sg) {
        ctx.strokeStyle = c.level;
        ctx.lineWidth = 2.4 * lw;
        ctx.setLineDash([9, 6]);
        ctx.beginPath();
        ctx.moveTo(sX(sg[0][0]), sY(sg[0][1]));
        ctx.lineTo(sX(sg[1][0]), sY(sg[1][1]));
        ctx.stroke();
        ctx.setLineDash([]);
        const e = sY(sg[0][1]) < sY(sg[1][1]) ? sg[0] : sg[1];
        label(
          `${zName(G)} = ${fmt(S.zl + G.c0.v, 2)}`,
          Math.min(W - 50, Math.max(50, sX(e[0]))),
          Math.max(18, Math.min(H - 18, sY(e[1]) + 16)),
          c.level,
          14,
          false
        );
      }
    }
    if (P.show.gradient) drawGrad();
    if (P.show.vertices && !R.empty) drawVerts();
    if (S.stamp) drawStamp();
  }
  function isFlat(vp) {
    if (vp.length < 3) return true;
    let a = 0;
    for (let i = 0; i < vp.length; i++) {
      const p = vp[i],
        q = vp[(i + 1) % vp.length];
      a += sX(p[0]) * sY(q[1]) - sX(q[0]) * sY(p[1]);
    }
    return Math.abs(a) < 4;
  }
  function arrow(x0, y0, x1, y1, col, w = 2, hd = 10) {
    ctx.strokeStyle = col;
    ctx.fillStyle = col;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    const a = Math.atan2(y1 - y0, x1 - x0);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - hd * Math.cos(a - 0.4), y1 - hd * Math.sin(a - 0.4));
    ctx.lineTo(x1 - hd * Math.cos(a + 0.4), y1 - hd * Math.sin(a + 0.4));
    ctx.closePath();
    ctx.fill();
  }
  function gradVec() {
    const G = S.G,
      c = [G.c[0].v, G.c[1].v],
      L = Math.hypot(c[0], c[1]) * S.V.s;
    if (L < 1e-9) return null;
    let k = 1;
    if (L < 45 || L > Math.min(W, H) * 0.42) k = (L < 45 ? 70 : Math.min(W, H) * 0.32) / L;
    return { c, k };
  }
  function drawGrad() {
    const g = gradVec();
    if (!g) return;
    const c = P.colors,
      X0 = sX(0),
      Y0 = sY(0),
      X1 = sX(g.c[0] * g.k),
      Y1 = sY(g.c[1] * g.k);
    arrow(X0, Y0, X1, Y1, c.grad, 3 * P.lw, 13);
    if (S.view === 'P') {
      ctx.strokeStyle = c.bg;
      ctx.fillStyle = c.grad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(X1, Y1, 6, 0, 7);
      ctx.fill();
      ctx.stroke();
    }
    label(
      `${gradT()}${zName(S.G)} = (${qT(S.G.c[0])}; ${qT(S.G.c[1])})`,
      X1 + (X1 >= X0 ? 44 : -44),
      Y1 - 14,
      c.grad,
      15,
      false
    );
  }
  const LET = 'ABCDEFGHIJKLNOPQRSTUVW';
  function vertNames() {
    const R = S.R;
    if (!R || R.empty) return [];
    const real = R.verts.filter((v) => !v.box);
    const optK = new Set(((S.O && S.O.opt) || []).map((v) => ptT(v.p)));
    let li = 0,
      oi = 0;
    return real.map((v) => {
      const isO = optK.has(ptT(v.p)) && S.O.status === 'optimal';
      const name = isO ? (oi++ === 0 ? 'M' : 'N' + (oi > 2 ? oi - 1 : '')) : LET[li++] || '?';
      return { v, name, isO };
    });
  }
  function drawVerts() {
    const c = P.colors,
      vs = vertNames();
    if (S.O && S.O.status === 'optimal' && S.O.opt.length > 1) {
      const o = S.O.opt;
      ctx.strokeStyle = c.opt;
      ctx.lineWidth = 5 * P.lw;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.moveTo(sX(o[0].f[0]), sY(o[0].f[1]));
      ctx.lineTo(sX(o[1].f[0]), sY(o[1].f[1]));
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    for (const { v, name, isO } of vs) {
      const X = sX(v.f[0]),
        Y = sY(v.f[1]);
      ctx.fillStyle = isO ? c.opt : c.vert;
      ctx.strokeStyle = c.bg;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(X, Y, isO ? 7 : 4.5, 0, 7);
      ctx.fill();
      ctx.stroke();
      label(
        isO ? `${name}${ptT(v.p)}` : name,
        X + (isO ? 14 : 10),
        Y - 14,
        isO ? c.opt : c.vert,
        isO ? 15 : 14,
        false,
        'left'
      );
    }
  }
  function drawGrid() {
    const c = P.colors,
      st = niceStep(80 / S.V.s),
      [x0, y1] = s2w(0, 0),
      [x1, y0] = s2w(W, H);
    if (P.show.bgGrid) {
      ctx.strokeStyle = c.bgGrid;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = Math.ceil(x0 / st) * st; x <= x1; x += st) {
        const X = Math.round(sX(x)) + 0.5;
        ctx.moveTo(X, 0);
        ctx.lineTo(X, H);
      }
      for (let y = Math.ceil(y0 / st) * st; y <= y1; y += st) {
        const Y = Math.round(sY(y)) + 0.5;
        ctx.moveTo(0, Y);
        ctx.lineTo(W, Y);
      }
      ctx.stroke();
    }
    ctx.strokeStyle = c.axis;
    ctx.globalAlpha = 0.6;
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
    if (S.G) {
      const n = S.G.vars;
      label(varT(n[0]), W - 18, Math.max(14, Math.min(H - 30, AY - 14)), c.axis, 16, false);
      label(varT(n[1]), Math.max(16, Math.min(W - 40, AX + 18)), 16, c.axis, 16, false);
    }
    if (P.show.coords) {
      ctx.fillStyle = c.axis;
      ctx.globalAlpha = 0.7;
      ctx.font = '500 12px Manrope, system-ui, sans-serif';
      const d = Math.max(0, -Math.floor(Math.log10(st)));
      const ly = Math.max(14, Math.min(H - 6, AY + 15));
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      for (let x = Math.ceil(x0 / st) * st; x <= x1; x += st) {
        if (Math.abs(x) < st / 2) continue;
        ctx.fillText(fmt(x, d), sX(x), ly);
      }
      const lx = Math.max(6, Math.min(W - 40, AX - 6));
      ctx.textAlign = AX - 6 < 30 ? 'left' : 'right';
      ctx.textBaseline = 'middle';
      for (let y = Math.ceil(y0 / st) * st; y <= y1; y += st) {
        if (Math.abs(y) < st / 2) continue;
        ctx.fillText(fmt(y, d), AX - 6 < 30 ? lx + 10 : lx, sY(y));
      }
      ctx.globalAlpha = 1;
    }
  }
  function label(s, x, y, col, sz = 16, it = true, al = 'center') {
    ctx.font = `${it ? 'italic ' : ''}600 ${sz}px "Source Serif 4", Georgia, serif`;
    ctx.textAlign = al;
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 4;
    ctx.strokeStyle = P.colors.bg;
    ctx.lineJoin = 'round';
    ctx.strokeText(s, x, y);
    ctx.fillStyle = col;
    ctx.fillText(s, x, y);
  }
  function drawStamp() {
    const txt = textOf(),
      c = P.colors;
    if (!txt) return;
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
    const r = S.rP;
    if (!r || !S.P) return '';
    const L = T(),
      s = S.P.sense;
    if (r.status === 'optimal') return `${s} ${zP()} = ${qT(r.value)}, x = ${ptT(r.x)}`;
    if (r.status === 'unbounded') return L.ans_unb(s);
    if (r.status === 'infeasible') return L.ans_inf;
    return '';
  }

  /* ---------- указатель ---------- */
  const ptrs = new Map();
  let drag = null;
  const pos = (e) => {
    const r = cv.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  function hit(X, Y) {
    if (!S.G || !S.R) return null;
    if (P.show.gradient && S.view === 'P') {
      const g = gradVec();
      if (g && Math.hypot(sX(g.c[0] * g.k) - X, sY(g.c[1] * g.k) - Y) < 14) return 'grad';
    }
    if (P.show.level && S.zr) {
      const c = [S.G.c[0].v, S.G.c[1].v],
        [wx, wy] = s2w(X, Y),
        d = (Math.abs(c[0] * wx + c[1] * wy - S.zl) / Math.hypot(c[0], c[1])) * S.V.s;
      if (d < 11) return 'level';
    }
    return null;
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
      };
      return;
    }
    const h = hit(p.x, p.y);
    if (h) {
      drag = { type: h, k: h === 'grad' ? gradVec().k : 1 };
      S.anim = null;
      cv.style.cursor = 'grabbing';
    } else {
      drag = { type: 'pan', x: p.x, y: p.y, cx: S.V.cx, cy: S.V.cy };
      cv.style.cursor = 'grabbing';
    }
  });
  cv.addEventListener('pointermove', (e) => {
    const p = pos(e);
    if (ptrs.has(e.pointerId)) ptrs.set(e.pointerId, p);
    if (!drag) {
      const h = hit(p.x, p.y);
      cv.style.cursor = h === 'grad' ? 'move' : h === 'level' ? 'grab' : 'default';
      return;
    }
    if (drag.type === 'pinch' && ptrs.size === 2) {
      const [p1, p2] = [...ptrs.values()],
        d = Math.hypot(p1.x - p2.x, p1.y - p2.y),
        m = [(p1.x + p2.x) / 2, (p1.y + p2.y) / 2];
      S.V.s = Math.max(1e-6, (drag.V.s * d) / drag.d);
      S.V.cx = drag.c[0] - (m[0] - W / 2) / S.V.s;
      S.V.cy = drag.c[1] + (m[1] - H / 2) / S.V.s;
      req();
      return;
    }
    if (drag.type === 'pan') {
      S.V.cx = drag.cx - (p.x - drag.x) / S.V.s;
      S.V.cy = drag.cy + (p.y - drag.y) / S.V.s;
      req();
      return;
    }
    const [wx, wy] = s2w(p.x, p.y);
    if (drag.type === 'level') {
      S.zl = S.G.c[0].v * wx + S.G.c[1].v * wy;
      if (S.zr) {
        S.t = Math.max(0, Math.min(1, (S.zl - S.zr.start) / (S.zr.end - S.zr.start || 1)));
      }
      renderOverlay();
      renderCaption(true);
      req();
      return;
    }
    if (drag.type === 'grad') {
      let c1 = wx / drag.k,
        c2 = wy / drag.k;
      const st = P.show.snap ? 0.5 : 0.01;
      c1 = Math.round(c1 / st) * st;
      c2 = Math.round(c2 / st) * st;
      if (!c1 && !c2) return;
      const P0 = S.P;
      const nc = [Q.of(c1), Q.of(c2)];
      if (nc[0].eq(P0.c[0]) && nc[1].eq(P0.c[1])) return;
      P0.c = nc;
      S.txt = probText(P0);
      $('#pIn').value = S.txt;
      S.preset = null;
      solveAll({ keepT: true });
      return;
    }
  });
  function endPtr(e) {
    ptrs.delete(e.pointerId);
    if (ptrs.size < 2 && drag && drag.type === 'pinch') {
      const q = [...ptrs.values()][0];
      drag = q ? { type: 'pan', x: q.x, y: q.y, cx: S.V.cx, cy: S.V.cy } : null;
    }
    if (!ptrs.size) {
      if (drag && drag.type === 'level') renderCaption();
      drag = null;
      cv.style.cursor = 'default';
    }
  }
  cv.addEventListener('pointerup', endPtr);
  cv.addEventListener('pointercancel', endPtr);
  function zoomAt(X, Y, k) {
    const [wx, wy] = s2w(X, Y);
    S.V.s *= k;
    S.V.cx = wx - (X - W / 2) / S.V.s;
    S.V.cy = wy + (Y - H / 2) / S.V.s;
    req();
  }
  cv.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      const p = pos(e);
      zoomAt(p.x, p.y, Math.exp(-e.deltaY * 0.0015));
    },
    { passive: false }
  );
  $('#zIn').onclick = () => zoomAt(W / 2, H / 2, 1.25);
  $('#zOut').onclick = () => zoomAt(W / 2, H / 2, 0.8);
  $('#zHome').onclick = () => fitView();
  /* ---------- панели ---------- */

  /* ---------- блоки ---------- */
  const sysH = (rows) =>
    `<span class="sys">${rows.map(([l, o, r]) => `<span>${l}</span><span>${o}</span><span>${r}</span>`).join('')}</span>`;
  const lineName = (i) => `(${i + 1})`;
  function renderProblem() {
    const L = T(),
      er = $('#pErr'),
      pw = $('#pWarn');
    if (S.err) {
      er.hidden = false;
      const e = S.err,
        f = L.err[e.msg];
      er.textContent = typeof f === 'function' ? f(e.line || '') : f || L.err.tok;
      $('#pPrev').innerHTML = '';
      pw.hidden = true;
      return;
    }
    er.hidden = true;
    $('#pPrev').innerHTML = probH(S.P);
    pw.hidden = !!S.P.anySign;
    pw.textContent = L.noSign;
  }
  function methodOf() {
    const P0 = S.P;
    if (!P0) return null;
    if (S.G && S.view === 'P') return 'graph';
    if (S.G && S.view === 'D') return 'dual';
    return 'simplex';
  }
  function graphSteps(G, R, O) {
    const L = T(),
      out = [];
    const nm = G.vars;
    const two = (p, q) => [ptH(p), ptH(q)];
    if (!G.cons.length) return out;
    out.push(
      L.g_lines +
        G.cons
          .map((c, i) => {
            const a = c.a[0],
              b = c.a[1],
              cc = c.b;
            let p, q;
            if (!a.z && !b.z && !cc.z) {
              p = [cc.div(a), Z0];
              q = [Z0, cc.div(b)];
            } else if (!a.z && !b.z) {
              p = [Z0, Z0];
              q = [b, a.neg()];
            } else if (a.z) {
              p = [Z0, cc.div(b)];
              q = [Q1, cc.div(b)];
            } else {
              p = [cc.div(a), Z0];
              q = [cc.div(a), Q1];
            }
            return `<span class="sub">${L.g_through(`${lineName(i)} ${linH(c.a, nm)} = ${qH(cc)}`, ptH(p), ptH(q))}</span>`;
          })
          .join('')
    );
    out.push(
      L.g_sides +
        G.cons
          .map((c, i) => {
            if (c.op === '=') return `<span class="sub">${L.g_eq(lineName(i))}</span>`;
            let tp = [Z0, Z0];
            if (c.b.z) tp = !c.a[0].z ? [Q1, Z0] : [Z0, Q1];
            const lhs = dot(c.a, tp),
              ok = c.op === '<=' ? lhs.cmp(c.b) <= 0 : lhs.cmp(c.b) >= 0;
            return `<span class="sub">${L.g_side(lineName(i), ptH(tp), `${qH(lhs)} ${opH(c.op)} ${qH(c.b)}`, ok)}</span>`;
          })
          .join('')
    );
    const sg = G.vars.map((v, j) =>
      G.sign[j] === 'ge'
        ? `${varH(v)} ⩾ 0`
        : G.sign[j] === 'le'
          ? `${varH(v)} ⩽ 0`
          : `${varH(v)} — ${L.anySign}`
    );
    out.push(L.g_signs(sg.join(', ')));
    if (R.empty) {
      out.push(L.g_empty);
      return out;
    }
    const vn = vertNames(),
      vl = vn.map(({ v, name }) => `${name}${ptH(v.p)}`).join(', ');
    out.push(isFlatR(R) ? L.g_regionSeg(vl) : R.unbounded ? L.g_regionU(vl || '—') : L.g_region(vl));
    const zn = zName(G);
    out.push(L.g_grad(`${gradT()}${varH(zn)} = (${qH(G.c[0])}; ${qH(G.c[1])})`, `${linH(G.c, nm)} = const`));
    out.push(G.sense === 'max' ? L.g_moveMax : L.g_moveMin);
    if (O.status === 'unbounded') {
      out.push(L.g_unb(G.sense));
      return out;
    }
    const o = vn.filter((x) => x.isO);
    if (!o.length) return out;
    const M = o[0];
    if (M.v.pair) {
      const [l1, l2] = M.v.pair;
      const ln = (l) => (l.kind === 'c' ? lineName(l.i) : `${varH(nm[l.i])} = 0`);
      const eqs = [l1, l2].map((l) => [linH([l.a, l.b], nm), '=', qH(l.c)]);
      out.push(
        `${L.g_at(M.name, ln(l1), ln(l2))} ${sysH(eqs)} ⇒ ${varH(nm[0])} = ${qH(M.v.p[0])}, ${varH(nm[1])} = ${qH(M.v.p[1])}.`
      );
    } else out.push(L.g_vertexOnly(`${M.name}${ptH(M.v.p)}`));
    if (o.length > 1) out.push(L.g_seg(o[0].name, o[1].name));
    else if (O.ray) out.push(L.g_ray(M.name));
    const zv = dot(G.c, M.v.p).add(G.c0);
    out.push(
      `${L.g_val(M.name, `${varH(zn)}(${M.name}) = ${qH(zv)}${qD(zv)}`)} ⇒ <b>${G.sense} ${varH(zn)} = ${qH(zv)}</b>.`
    );
    if (vn.length > 1)
      out.push(
        `${L.g_table}<div class="tw"><table class="vt"><tr><th>${L.vtx}</th><th>(${varH(nm[0])}; ${varH(nm[1])})</th><th>${varH(zn)}</th></tr>${vn.map(({ v, name, isO }) => `<tr class="${isO ? 'best' : ''}"><td>${name}</td><td>${ptH(v.p)}</td><td>${qH(dot(G.c, v.p).add(G.c0))}</td></tr>`).join('')}</table></div>`
      );
    return out;
  }
  function isFlatR(R) {
    const p = R.poly;
    if (p.length < 3) return true;
    let a = 0;
    for (let i = 0; i < p.length; i++) {
      const u = p[i],
        v = p[(i + 1) % p.length];
      a += u[0] * v[1] - v[0] * u[1];
    }
    return Math.abs(a) < 1e-9 * Math.max(1, ...p.map((q) => Math.abs(q[0]) + Math.abs(q[1])));
  }
  function csSteps() {
    const L = T(),
      P0 = S.P,
      D = S.D,
      O = S.O,
      out = [];
    const yn = D.vars,
      xn = P0.vars;
    if (O.status === 'unbounded') {
      out.push(L.cs_dualUnb);
      return out;
    }
    if (O.status !== 'optimal') {
      out.push(L.cs_dualInf);
      return out;
    }
    const M = O.opt[0],
      y = M.p,
      w = dot(D.c, y).add(D.c0);
    out.push(L.cs_dual(`M${ptH(y)}`, `${varH(zD())} = ${qH(w)}`));
    const info = csRecover(S.Pn, D, y);
    D.cons.forEach((c, j) => {
      const r = info.dualSl[j];
      if (P0.sign[j] === 'free') out.push(L.cs_free(lineName(j), varH(xn[j])));
      else if (r.z) out.push(L.cs_on('M', lineName(j)));
      else out.push(L.cs_off('M', lineName(j), qH(r), varH(xn[j])));
    });
    P0.cons.forEach((c, i) => {
      if (c.op === '=') out.push(L.cs_eqrow(lineName(i)));
      else if (!y[i].z) out.push(L.cs_y(varH(yn[i]), qH(y[i]), lineName(i)));
      else out.push(L.cs_y0(varH(yn[i]), lineName(i)));
    });
    const rows = info.sys.A.map((a, k) => [linH(a, xn), '=', qH(info.sys.b[k])]);
    out.push(L.cs_sys + ' ' + sysH(rows));
    if (info.x && info.feasible) {
      const z = dot(P0.c, info.x).add(P0.c0);
      out.push(L.cs_sol(`${xn.map(varH).join(', ')} = ${ptH(info.x)}`));
      out.push(L.cs_check(`${varH(zP())} = ${qH(z)}`, `${varH(zD())} = ${qH(w)}`));
    } else if (info.x) out.push(L.cs_bad);
    else out.push(L.cs_many);
    return out;
  }
  function balH() {
    const L = T(),
      r = S.rP,
      P0 = S.P;
    if (!r || r.status !== 'optimal' || !r.slackOf) return '';
    const items = [];
    P0.cons.forEach((c, i) => {
      const k = r.slackOf[i];
      if (k === null || k === undefined || c.auto) return;
      const ax = dot(c.a, r.x),
        v = c.op === '<=' ? c.b.sub(ax) : ax.sub(c.b);
      const f =
        c.op === '<=' ? `${qH(c.b)} − (${linH(c.a, P0.vars)})` : `(${linH(c.a, P0.vars)}) − ${qH(c.b)}`;
      items.push(
        `${varH(r.cols[k])} = ${f} = <b>${qH(v)}</b> — ${v.z ? L.bal_zero(lineName(i), c.op) : c.op === '<=' ? L.bal_le(lineName(i)) : L.bal_ge(lineName(i))}`
      );
    });
    return items.length
      ? `<div class="h4">${L.bal_head}</div><div class="cs">${items.join('<br>')}</div>`
      : '';
  }
  function answerH() {
    const L = T(),
      r = S.rP,
      P0 = S.P;
    if (!r) return '';
    const s = P0.sense,
      xn = P0.vars;
    let h = `<div class="ans"><div class="k">${L.ans}</div>`;
    if (S.I && !S.I.unsupported && !S.I.tooMany) {
      const I = S.I;
      if (I.none) h += `<p class="note">${L.i_none}</p>`;
      else
        h += `<div class="mx"><b>${s} ${varH(zP())} = ${qH(I.val)}</b></div><div class="mx">${I.best.map((x) => `${xn.map(varH).join(', ')} = ${ptH(x)}`).join('<br>')}</div>`;
      if (r.status === 'optimal' && !I.none) {
        h += `<p class="note">${r.value.eq(I.val) ? L.i_same : L.i_lp(qH(r.value), qH(I.val))}</p>`;
      }
      return h + '</div>';
    }
    if (r.status === 'infeasible') return h + `<p class="note">${L.ans_inf}</p></div>`;
    if (r.status === 'unbounded') return h + `<p class="note">${L.ans_unb(s)}</p></div>`;
    if (r.status !== 'optimal') return h + `<p class="note">${L.ans_fail}</p></div>`;
    h += `<div class="mx"><b>${s} ${varH(zP())} = ${qH(r.value)}</b>${qD(r.value)}</div>`;
    const vs = r.verts || [r.x],
      rays = r.rays || [];
    if (vs.length === 1 && !rays.length)
      h += `<div class="mx">${xn.map(varH).join(', ')} = ${ptH(vs[0])}</div><p class="note">${L.ans_unique}</p>`;
    else {
      h += `<p class="note" style="margin:.3rem 0 0">${L.ans_all}</p><div class="mx">${vs.map((v, i) => `${varH('X')}<sub>${i + 1}</sub> = ${ptH(v)}`).join('<br>')}${rays.map((d, i) => `<br>${varH('d')}${rays.length > 1 ? `<sub>${i + 1}</sub>` : ''} = ${ptH(d)}`).join('')}</div>`;
      const parts =
        vs.map((_, i) => `α<sub>${i + 1}</sub>${varH('X')}<sub>${i + 1}</sub>`).join(' + ') +
        rays
          .map(
            (_, i) =>
              ` + ${varH('t')}${rays.length > 1 ? `<sub>${i + 1}</sub>` : ''}${varH('d')}${rays.length > 1 ? `<sub>${i + 1}</sub>` : ''}`
          )
          .join('');
      if (vs.length === 1) {
        h += `<div class="mx">${varH('X')} = ${varH('X')}<sub>1</sub>${rays.map((_, i) => ` + ${varH('t')}${rays.length > 1 ? `<sub>${i + 1}</sub>` : ''}${varH('d')}${rays.length > 1 ? `<sub>${i + 1}</sub>` : ''}`).join('')}, ${varH('t')} ⩾ 0.</div>`;
        return h + '</div>';
      }
      h += `<div class="mx">${varH('X')} = ${parts},</div><p class="note" style="margin-top:0">${vs.length > 1 ? 'α<sub>i</sub> ⩾ 0, Σα<sub>i</sub> = 1' : 'α<sub>1</sub> = 1'}${rays.length ? ', ' + varH('t') + ' ⩾ 0' : ''}.</p>`;
    }
    return h + '</div>';
  }
  function renderSolve() {
    const box = $('#solve'),
      L = T();
    if (S.err || !S.P) {
      box.innerHTML = `<p class="note">${L.cap.err}</p>`;
      return;
    }
    const m = methodOf();
    const chips = [];
    let h = '';
    if (m === 'graph') {
      chips.push(['graphical', L.m_graph]);
      h += `<p class="idea"><b>${L.m_graph}.</b> ${L.idea_graph}</p><ol class="stp">${graphSteps(
        S.G,
        S.R,
        S.O
      )
        .map((s) => `<li>${s}</li>`)
        .join('')}</ol>`;
    } else if (m === 'dual') {
      chips.push(['csmethod', L.m_dualgraph]);
      h += `<p class="idea"><b>${L.m_dualgraph}.</b> ${S.P.vars.length > 2 ? L.idea_dual : L.idea_dualAlt}</p><div class="h4">${L.d_head}</div><div class="prob">${probH(S.D)}</div><ol class="stp">${graphSteps(
        S.G,
        S.R,
        S.O
      )
        .map((s) => `<li>${s}</li>`)
        .join('')}</ol><div class="h4">${L.d_cs.replace(':', '')}</div><ol class="stp">${csSteps()
        .map((s) => `<li>${s}</li>`)
        .join('')}</ol>`;
    } else {
      chips.push(['tableau', L.m_simplex]);
      h += `<p class="idea"><b>${L.m_simplex}.</b> ${L.idea_simplex}</p>`;
    }
    if (S.I) {
      chips.push(['integer', L.m_int]);
      h += `<div class="h4">${L.i_head}</div>`;
      const I = S.I;
      if (I.unsupported) h += `<p class="note">${L.i_unsup}</p>`;
      else if (I.tooMany) h += `<p class="note">${L.i_many}</p>`;
      else
        h += `<p class="note">${L.i_scan(I.cnt)}${I.unbHint ? ' ' + L.i_unb : ''} ${I.none ? L.i_none : L.i_best(qH(I.val), I.best.map(ptH).join(', '))}</p>`;
    }
    h =
      `<div class="mchips">${chips.map(([t, n]) => `<button class="chip" data-term="${t}">${n}</button>`).join('')}</div>` +
      h +
      answerH() +
      (S.I ? '' : balH());
    box.innerHTML = h;
  }
  function matH(rows, last, lastLbl) {
    return `<div class="tw"><table class="tab">${rows
      .map(
        (r) =>
          `<tr>${r
            .slice(0, -1)
            .map((q) => `<td>${qH(q)}</td>`)
            .join('')}<td class="b">${qH(r[r.length - 1])}</td></tr>`
      )
      .join(
        ''
      )}<tr class="zr">${last.map((q) => `<td>${qH(q)}</td>`).join('')}<td class="b">${lastLbl}</td></tr></table></div>`;
  }
  function renderDual() {
    const box = $('#dual'),
      L = T();
    if (S.err || !S.P) {
      box.innerHTML = '';
      return;
    }
    const P0 = S.P,
      D = S.D,
      max = P0.sense === 'max';
    let h = '';
    if (SEM()) {
      const Pn = S.Pn;
      h += `<ol class="stp"><li>${L.sem_norm(P0.sense, max ? '⩽' : '⩾')}${Pn.flips.length ? Pn.flips.map((i) => `<span class="sub">${lineName(i)} ${linH(P0.cons[i].a, P0.vars)} ${opH(P0.cons[i].op)} ${qH(P0.cons[i].b)} ${L.sem_mul} ${linH(Pn.cons[i].a, P0.vars)} ${opH(Pn.cons[i].op)} ${qH(Pn.cons[i].b)}</span>`).join('') : ` ${L.sem_ok}`}${Pn.cons.some((c) => c.op === '=') ? `<span class="sub">${L.sem_eq}</span>` : ''}</li>`;
      h += `<li>${L.sem_tab}${matH(
        Pn.cons.map((c) => [...c.a, c.b]),
        Pn.c,
        P0.sense
      )}${L.sem_tr}${matH(
        Pn.vars.map((_, j) => [...Pn.cons.map((c) => c.a[j]), Pn.c[j]]),
        Pn.cons.map((c) => c.b),
        D.sense
      )}</li>`;
      h += `<li>${L.sem_dual(D.sense, max ? '⩾' : '⩽')}</li></ol><div class="prob">${probH(D)}</div>`;
    } else {
      h += `<div class="prob">${probH(D)}</div><div class="h4">${L.d_rules}</div><ol class="stp"><li>${L.d_r1(P0.sense, D.sense)}</li><li>${L.d_r2}</li>`;
      P0.cons.forEach((c, i) => {
        const s = D.sign[i];
        h += `<li>${L.d_rY(lineName(i), opH(c.op), varH(D.vars[i]), s === 'ge' ? L.d_ge0 : s === 'le' ? L.d_le0 : L.d_free)}</li>`;
      });
      P0.vars.forEach((v, j) => {
        const s = P0.sign[j];
        h += `<li>${L.d_rX(varH(v), s === 'ge' ? '⩾ 0' : s === 'le' ? '⩽ 0' : '— ' + L.anySign, lineName(j), opH(D.cons[j].op))}</li>`;
      });
      h += '</ol>';
    }
    const cs = [];
    P0.vars.forEach((v, j) => {
      if (P0.sign[j] === 'free') return;
      const c = D.cons[j];
      cs.push(
        `${varH(v)}·(${linH(c.a, D.vars)} − ${qH(c.b).replace(/^−/, '(−')}${c.b.s < 0 ? ')' : ''}) = 0`
      );
    });
    S.Pn.cons.forEach((c, i) => {
      if (c.op === '=') return;
      cs.push(
        `${varH(D.vars[i])}·(${linH(c.a, P0.vars)} − ${qH(c.b).replace(/^−/, '(−')}${c.b.s < 0 ? ')' : ''}) = 0`
      );
    });
    const ybase = D.vars[0] ? D.vars[0].replace(/\d+$/, '') : 'y',
      m = D.vars.length,
      yb = [];
    if (SEM()) {
      D.cons.forEach((c, j) => {
        if (c.op === '=') return;
        const nm = ybase + (m + yb.length + 1);
        yb.push([j, nm]);
      });
      if (yb.length) {
        h += `<div class="h4">${L.bal_dual}</div><div class="cs">${yb
          .map(([j, nm]) => {
            const c = D.cons[j];
            return `${D.cons[j].op === '>=' ? '−' : '+'}${varH(nm)}: ${varH(nm)} = ${c.op === '>=' ? `(${linH(c.a, D.vars)}) − ${qH(c.b)}` : `${qH(c.b)} − (${linH(c.a, D.vars)})`}`;
          })
          .join('<br>')}</div><p class="note">${L.bal_dualNote}</p>`;
      }
    }
    h +=
      `<div class="h4">${L.d_cs}</div>` +
      (cs.length ? `<div class="cs">${cs.join('<br>')}</div>` : `<p class="note">${L.d_csNone}</p>`);
    if (SEM() && S.rP && S.rP.slackOf) {
      const pairs = [];
      yb.forEach(([j, nm]) => {
        if (P0.sign[j] !== 'free') pairs.push(`${varH(P0.vars[j])}·${varH(nm)} = 0`);
      });
      S.Pn.cons.forEach((c, i) => {
        const k = S.rP.slackOf[i];
        if (c.op === '=' || k === null || k === undefined) return;
        pairs.push(`${varH(D.vars[i])}·${varH(S.rP.cols[k])} = 0`);
      });
      if (pairs.length) h += `<p class="note">${L.bal_cs} ${pairs.join(', ')}</p>`;
    }
    if (S.rP && S.rD && S.rP.status === 'optimal' && S.rD.status === 'optimal')
      h += `<p class="note">${L.d_val(`${P0.sense} ${varH(zP())} = ${qH(S.rP.value)}`, `${D.sense} ${varH(zD())} = ${qH(S.rD.value)}`)}<button class="q" data-term="kant1">?</button></p>`;
    box.innerHTML = h;
  }
  function tabH(r, e, cols) {
    const piv = e.piv,
      N = cols.length;
    let h = `<div class="tw"><table class="tab"><tr><th>${T().basis}</th>${cols.map((c) => `<th>${varH(c)}</th>`).join('')}<th class="b">b</th></tr>`;
    e.T.forEach((row, i) => {
      h += `<tr><td class="bs">${e.B[i] >= 0 ? varH(cols[e.B[i]]) : '—'}</td>${row
        .slice(0, N)
        .map(
          (q, k) =>
            `<td class="${piv && piv[0] === i && piv[1] === k ? 'piv' : piv && piv[1] === k ? 'pc' : ''}">${qH(q)}</td>`
        )
        .join('')}<td class="b">${qH(row[N])}</td></tr>`;
    });
    h += `<tr class="zr"><td class="bs">${varH(zP())}</td>${e.Z.slice(0, N)
      .map((q, k) => `<td class="${piv && piv[1] === k ? 'pc' : ''}">${qH(q)}</td>`)
      .join('')}<td class="b">${qH(e.Z[N])}</td></tr></table></div>`;
    return h;
  }
  function renderSimplex() {
    const box = $('#simp'),
      L = T();
    const r = S.rP;
    if (S.err || !r || !r.log) {
      box.innerHTML = `<p class="note">${L.s_none}</p>`;
      return;
    }
    const P0 = S.P,
      cols = r.cols;
    let h = '';
    const conv = [];
    if (r.transforms.min) conv.push(L.s_min);
    if (r.transforms.le.length) conv.push(L.s_le(r.transforms.le.map(varH).join(', ')));
    if (r.transforms.free.length) conv.push(L.s_free(r.transforms.free.map(varH).join(', ')));
    if (P0.cons.some((c) => c.op !== '=')) {
      let t = L.s_slack;
      P0.cons.forEach((c, i) => {
        const k = r.slackOf[i];
        if (k === null || k === undefined) return;
        t += `<span class="sub">${lineName(i)}: ${c.op === '<=' ? '+' : '−'}${varH(cols[k])}, ${varH(cols[k])} = ${c.op === '<=' ? `${qH(c.b)} − (${linH(c.a, P0.vars)})` : `(${linH(c.a, P0.vars)}) − ${qH(c.b)}`} — ${c.op === '<=' ? L.bal_leS : L.bal_geS}</span>`;
      });
      conv.push(t);
    }
    r.flipped.forEach((i) => conv.push(L.s_flip(lineName(i))));
    const e0 = r.log[0];
    const N = cols.length;
    const eqs = e0.T.map((row) => [linH(row.slice(0, N), cols), '=', qH(row[N])]);
    h += `<p class="steplog">${L.s_conv}</p><ol class="stp">${conv.map((s) => `<li>${s}</li>`).join('')}</ol><div class="prob"><span class="obj">${varH(zP())} = ${linH(
      e0.Z.slice(0, N).map((q) => q.neg()),
      cols,
      e0.Z[N]
    )} → max</span>${sysH(eqs)}<span class="sg">${cols.map(varH).join(', ')} ⩾ 0</span></div>`;
    h += `<p class="steplog">${L.s_init}</p>` + tabH(r, e0, cols);
    const rat = (e) => e.ratios.map(([i, q]) => `${qH(q)} ${lineName(i)}`).join(', ');
    for (const e of r.log.slice(1)) {
      const n = e.note;
      let t = '';
      if (n.t === 'zrow') t = L.s_zrow(varH(cols[n.col]));
      else if (n.t === 'p1') t = L.s_p1(lineName(n.row), varH(cols[n.col]), rat(n), qH(n.pv));
      else if (n.t === 'neg') t = L.s_neg(lineName(n.row));
      else if (n.t === 'redundant') t = L.s_red(lineName(n.row));
      else if (n.t === 'infeas') t = L.s_inf(lineName(n.row));
      else if (n.t === 'p2') t = L.s_p2(qH(n.zr), varH(cols[n.col]), rat(n), qH(n.pv));
      else if (n.t === 'unb') t = L.s_unb(varH(cols[n.col]));
      else if (n.t === 'opt') {
        const xs = e.B.map((k, i) => `${varH(cols[k])} = ${qH(e.T[i][N])}`).join(', ');
        t = `${L.s_opt} ${L.s_read(xs, qH(e.Z[N]))} ${n.zeroNB.length ? L.s_nonuniq(n.zeroNB.map((k) => varH(cols[k])).join(', ')) : L.s_uniq}`;
      }
      h += `<p class="steplog">${t}</p>`;
      if (n.t !== 'opt' && n.t !== 'unb' && n.t !== 'infeas') h += tabH(r, e, cols);
      else if (n.t === 'opt' && !e.piv) h += '';
    }
    if (r.status === 'optimal') {
      if (r.transforms.min) h += `<p class="steplog">${L.s_minBack(qH(r.M))}</p>`;
      if (
        r.transforms.min ||
        r.transforms.le.length ||
        r.transforms.free.length ||
        cols.length > P0.vars.length
      )
        h += `<p class="steplog">${L.s_back}</p>`;
      h += answerH() + balH();
    }
    box.innerHTML = h;
  }
  function rngH(lo, hi) {
    return `(${lo ? qH(lo) : '−∞'}; ${hi ? qH(hi) : '+∞'})`;
  }
  function renderExcel() {
    const box = $('#excel'),
      L = T();
    const r = S.rP,
      rd = S.rD;
    if (S.err || !r || r.status !== 'optimal' || !rd || rd.status !== 'optimal') {
      box.innerHTML = `<p class="note">${L.x_noOpt}</p>`;
      return;
    }
    const P0 = S.P,
      D = S.D,
      x = r.x,
      y = rd.x;
    let h = `<div class="h4">${L.x_head}<button class="q" data-term="excel">?</button></div><div class="tw"><table class="rep"><tr><th>${L.x_var}</th><th>${L.x_fin}</th><th>${L.x_red}</th></tr>`;
    P0.vars.forEach((v, j) => {
      const red = dot(D.cons[j].a, y).sub(D.cons[j].b).abs();
      h += `<tr><td>${varH(v)}</td><td>${qH(x[j])}</td><td>${qH(red)}</td></tr>`;
    });
    h += `</table><table class="rep"><tr><th>${L.x_con}</th><th>${L.x_slack}</th><th>${L.x_shadow}</th></tr>`;
    P0.cons.forEach((c, i) => {
      const sl = c.b.sub(dot(c.a, x)).abs();
      h += `<tr><td>${lineName(i)}</td><td>${qH(sl)}</td><td>${qH(y[i])}</td></tr>`;
    });
    h += '</table></div>';
    if (!r.unique || !rd.unique) h += `<p class="note">${L.x_nu}</p>`;
    const g = ranging(P0, r);
    if (!g) h += `<p class="note">${L.x_noProd}</p>`;
    else {
      h += `<div class="h4">${L.x_st}<button class="q" data-term="stability">?</button></div><div class="tw"><table class="rep"><tr><th>${L.x_coef}</th><th>${L.x_int}</th></tr>${P0.vars.map((v, j) => `<tr><td><i>c</i><sub>${j + 1}</sub> = ${qH(P0.c[j])}</td><td>${rngH(g.cR[j].lo, g.cR[j].hi)}</td></tr>`).join('')}</table></div>`;
      h += `<div class="h4">${L.x_se}<button class="q" data-term="sensitivity">?</button></div><div class="tw"><table class="rep"><tr><th>${L.x_coef}</th><th>${L.x_int}</th></tr>${P0.cons.map((c, i) => `<tr><td><i>b</i><sub>${i + 1}</sub> = ${qH(c.b)}</td><td>${rngH(g.bR[i].lo, g.bR[i].hi)}</td></tr>`).join('')}</table></div><p class="note">${L.x_note}${g.degenerate ? ' ' + L.x_deg : ''}</p>`;
    }
    box.innerHTML = h;
  }
  function renderPresets() {
    const box = $('#pre'),
      L = T();
    box.innerHTML = '';
    let n = 0;
    GROUPS.forEach(([g, ids]) => {
      const h = document.createElement('div');
      h.className = 'h4 pg';
      h.textContent = L.grp[g];
      box.appendChild(h);
      const w = document.createElement('div');
      w.className = 'chips';
      ids.forEach((id) => {
        n++;
        const b = document.createElement('button');
        b.className = 'chip' + (S.preset === id ? ' on' : '');
        b.dataset.pre = id;
        b.textContent = L.pre[id];
        if (n <= 9) b.title = L.keyHint(n);
        w.appendChild(b);
      });
      box.appendChild(w);
    });
    const m = methodOf();
    $('#hist').innerHTML = S.P
      ? `${L.now} <b>${m === 'graph' ? L.m_graph : m === 'dual' ? L.m_dualgraph : L.m_simplex}${S.I ? ', ' + L.m_int : ''}</b>`
      : '';
  }
  function renderOverlay() {
    const ov = $('#ov'),
      L = T();
    if (S.err || !S.P) {
      ov.innerHTML = `<span class="tt">${L.cap.err}</span>`;
      return;
    }
    if (!S.G) {
      ov.innerHTML = `<span>${varH(zP())} = ${linH(S.P.c, S.P.vars, S.P.c0)} → ${S.P.sense}</span><span class="tt">${L.nog}</span>`;
      return;
    }
    const G = S.G,
      zn = zName(G),
      O = S.O;
    let res = '';
    if (O.status === 'optimal') {
      const vn = vertNames().filter((v) => v.isO);
      res = `${G.sense} ${varT(zn)} = ${qT(O.value)}${vn.length ? ` · ${vn.map((v) => v.name + ptT(v.v.p)).join(', ')}` : ''}`;
    } else if (O.status === 'unbounded') res = L.cap.unb(G.sense);
    else res = L.cap.inf;
    ov.innerHTML = `<span>${varH(zn)} = ${linH(G.c, G.vars, G.c0)} → ${G.sense}</span><span class="tt">${S.view === 'D' ? `(${L.sv.D}) ` : ''}${res}</span>`;
  }
  function renderCaption(dragging) {
    const cap = $('#cap'),
      C = T().cap;
    $('#capOpen').hidden = !!P.show.hints;
    if (!P.show.hints) {
      cap.hidden = true;
      return;
    }
    cap.hidden = false;
    let t;
    if (S.err || !S.P) t = C.err;
    else if (!S.G) t = C.nog;
    else if (dragging) t = C.level(fmt(S.zl + S.G.c0.v, 3));
    else {
      const O = S.O,
        G = S.G;
      if (O.status === 'infeasible') t = C.inf;
      else if (O.status === 'unbounded') t = C.unb(G.sense);
      else if (S.t < 0.999) t = G.sense === 'max' ? C.max : C.min;
      else {
        const vn = vertNames().filter((v) => v.isO);
        t =
          vn.length > 1 || O.ray
            ? C.seg(`${G.sense} ${varT(zName(G))}`, qT(O.value))
            : C.opt(
                `${G.sense} ${varT(zName(G))}`,
                qT(O.value),
                vn.length ? vn[0].name + ptT(vn[0].v.p) : ''
              );
        if (S.view === 'P') t += ' ' + C.grad;
      }
    }
    $('#capT').textContent = t;
  }
  function syncT() {
    $('#tR').value = Math.round(S.t * 1000);
    $('#tOut').textContent = fmt(S.t);
  }
  function renderAll() {
    renderProblem();
    renderSolve();
    renderDual();
    renderSimplex();
    renderExcel();
    renderPresets();
    renderOverlay();
    renderCaption();
    renderTex();
    syncT();
    req();
  }

  /* ---------- кнопки ---------- */
  let pT0 = 0;
  $('#pIn').addEventListener('input', (e) => {
    clearTimeout(pT0);
    pT0 = setTimeout(() => {
      S.txt = e.target.value;
      S.preset = null;
      solveAll({ fit: true });
    }, 350);
  });
  $('#bFit').onclick = () => fitView();
  document.querySelectorAll('#styleSeg button').forEach(
    (b) =>
      (b.onclick = () => {
        if (P.style === b.dataset.v) return;
        P.style = b.dataset.v;
        save();
        syncStyle();
        applyLang();
      })
  );
  function syncStyle() {
    document
      .querySelectorAll('#styleSeg button')
      .forEach((b) => b.classList.toggle('on', b.dataset.v === P.style));
  }
  document.addEventListener('click', (e) => {
    const q = e.target.closest('[data-term]');
    if (q) {
      e.preventDefault();
      e.stopPropagation();
      openTerm(q.dataset.term);
      return;
    }
    const p = e.target.closest('[data-pre]');
    if (p) loadPreset(p.dataset.pre);
  });
  document.querySelectorAll('#modeSeg button').forEach((b) => (b.onclick = () => setView(b.dataset.mode)));
  function setView(v) {
    if (!S.P) return;
    const L = T(),
      can = v === 'P' ? S.P.vars.length === 2 : S.D.vars.length === 2;
    if (!can) {
      toast(v === 'P' ? L.noP(S.P.vars.length) : L.noD(S.D.vars.length), 4200);
      return;
    }
    if (S.view === v) return;
    S.view = v;
    S.anim = null;
    solveAll({ fit: true });
    toast(L.sv[v]);
  }
  function play() {
    if (!S.G || !S.zr) return;
    S.t = 0;
    setZfromT();
    S.anim = { start: performance.now(), dur: 2600 / P.speed };
    req();
  }
  $('#bPlay').onclick = play;
  $('#bZero').onclick = () => {
    S.anim = null;
    S.t = 0;
    setZfromT();
    renderCaption();
    req();
  };
  $('#bOne').onclick = () => {
    S.anim = null;
    S.t = 1;
    setZfromT();
    renderCaption();
    req();
  };
  $('#tR').oninput = (e) => {
    S.anim = null;
    S.t = e.target.value / 1000;
    setZfromT();
    renderCaption();
    req();
  };
  $('#spR').oninput = (e) => {
    P.speed = +e.target.value;
    $('#spOut').textContent = '×' + fmt(P.speed);
    save();
  };
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
    'bgGrid',
    'coords',
    'region',
    'lines',
    'sides',
    'gradient',
    'level',
    'vertices',
    'ints',
    'labels',
    'snap',
    'hints',
  ];
  function buildToggles() {
    const box = $('#tog');
    box.innerHTML = '';
    TOG.forEach((k) => {
      const l = document.createElement('label');
      l.className = 'chk';
      l.innerHTML = `<input type="checkbox" data-k="${k}"> <span>${T().tog[k]}</span>`;
      l.querySelector('input').onchange = (e) => {
        P.show[k] = e.target.checked;
        save();
        renderCaption();
        req();
      };
      box.appendChild(l);
    });
  }
  function syncToggles() {
    document.querySelectorAll('#tog input').forEach((i) => {
      i.checked = !!P.show[i.dataset.k];
    });
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

  /* ---------- экспорт ---------- */
  const keysUi = createKeys({ T, keys: KEYS });
  const { renderKeys, openKeys } = keysUi;
  keysUi.init();
  const ex = createExport({
    name: 'optimization',
    T,
    state: S,
    cv,
    renderNow,
    req,
    // видео: анимация движения линии уровня по области — когда есть график
    video: { ready: () => !!S.G, play: () => play() },
  });
  const { canSave, updExport, flash, exportPng, exportVideo, vidMime } = ex;
  ex.init();
  let fmtMode = 'tex';

  document.querySelectorAll('#xFmt button').forEach(
    (b) =>
      (b.onclick = () => {
        fmtMode = b.dataset.f;
        document.querySelectorAll('#xFmt button').forEach((x) => x.classList.toggle('on', x === b));
        renderTex();
      })
  );

  /* ---------- иллюстрации справочника ---------- */
  function illSvg(id) {
    const sp = ILL[id];
    if (!sp) return '';
    const W = 200,
      H = 140,
      o = sp.o,
      s = sp.s;
    const X = (x) => o[0] + x * s,
      Y = (y) => o[1] - y * s,
      c = (k) => `var(--s-${k})`,
      F = (v) => (+v).toFixed(1);
    let out = '',
      lastPoly = null;
    const tx = (x, y, t, col, sz = 12) =>
      `<text x="${F(x)}" y="${F(y)}" fill="${c(col)}" font-size="${sz}" font-style="italic" font-family="'Source Serif 4',Georgia,serif" text-anchor="middle" dominant-baseline="middle" paint-order="stroke" stroke="var(--s-bg)" stroke-width="3" stroke-linejoin="round">${t}</text>`;
    const seg = (a, b, cc) => {
      const xs = [],
        L = -20,
        R = 20;
      for (const x of [L, R]) if (Math.abs(b) > 1e-9) xs.push([x, (cc - a * x) / b]);
      for (const y of [L, R]) if (Math.abs(a) > 1e-9) xs.push([(cc - b * y) / a, y]);
      const inb = (p) => X(p[0]) >= -1 && X(p[0]) <= W + 1 && Y(p[1]) >= -1 && Y(p[1]) <= H + 1;
      const vis = [];
      for (let i = 0; i <= 400; i++) {
        const t = i / 400;
        if (Math.abs(b) > 1e-9) {
          const x = -o[0] / s + t * (W / s);
          const p = [x, (cc - a * x) / b];
          if (inb(p)) vis.push(p);
        } else {
          const y = (o[1] - H) / s + t * (H / s);
          const p = [cc / a, y];
          if (inb(p)) vis.push(p);
        }
      }
      return vis.length > 1 ? [vis[0], vis[vis.length - 1]] : null;
    };
    for (const it of sp.it) {
      const k = it[0],
        a = it.slice(1);
      if (k === 'grid') {
        for (let i = -10; i <= 12; i++) {
          out += `<line x1="${F(X(i))}" y1="0" x2="${F(X(i))}" y2="${H}" stroke="${c('bgGrid')}"/><line x1="0" y1="${F(Y(i))}" x2="${W}" y2="${F(Y(i))}" stroke="${c('bgGrid')}"/>`;
        }
        out += `<line x1="0" y1="${F(Y(0))}" x2="${W}" y2="${F(Y(0))}" stroke="${c('axis')}" stroke-opacity=".5"/><line x1="${F(X(0))}" y1="0" x2="${F(X(0))}" y2="${H}" stroke="${c('axis')}" stroke-opacity=".5"/>`;
      } else if (k === 'poly') {
        const [pts, col, op] = a;
        lastPoly = pts;
        out += `<polygon points="${pts.map((p) => F(X(p[0])) + ',' + F(Y(p[1]))).join(' ')}" fill="${c(col)}" fill-opacity="${op}" stroke="${c(col)}" stroke-width="1.4"/>`;
      } else if (k === 'ln') {
        const [A, B, C, col, dash] = a,
          sg = seg(A, B, C);
        if (sg)
          out += `<line x1="${F(X(sg[0][0]))}" y1="${F(Y(sg[0][1]))}" x2="${F(X(sg[1][0]))}" y2="${F(Y(sg[1][1]))}" stroke="${c(col)}" stroke-width="1.8"${dash ? ' stroke-dasharray="6 4"' : ''}/>`;
      } else if (k === 'seg') {
        const [x1, y1, x2, y2, col, w] = a;
        out += `<line x1="${F(X(x1))}" y1="${F(Y(y1))}" x2="${F(X(x2))}" y2="${F(Y(y2))}" stroke="${c(col)}" stroke-width="${w || 2}" stroke-linecap="round"/>`;
      } else if (k === 'arrow') {
        const [x1, y1, x2, y2, col, op = 1] = a,
          ang = Math.atan2(-(y2 - y1), x2 - x1),
          hx = X(x2),
          hy = Y(y2);
        out += `<g opacity="${op}"><line x1="${F(X(x1))}" y1="${F(Y(y1))}" x2="${F(hx)}" y2="${F(hy)}" stroke="${c(col)}" stroke-width="2.6"/><polygon points="${F(hx)},${F(hy)} ${F(hx - 9 * Math.cos(ang - 0.4))},${F(hy - 9 * Math.sin(ang - 0.4))} ${F(hx - 9 * Math.cos(ang + 0.4))},${F(hy - 9 * Math.sin(ang + 0.4))}" fill="${c(col)}"/></g>`;
      } else if (k === 'pt') {
        const [x, y, col, r = 3.5] = a;
        out += `<circle cx="${F(X(x))}" cy="${F(Y(y))}" r="${r}" fill="${c(col)}" stroke="var(--s-bg)" stroke-width="1.5"/>`;
      } else if (k === 'ints') {
        const [x0, x1, y0, y1] = a;
        const inP = (px, py) => {
          let ins = false;
          const p = lastPoly;
          for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
            if (
              p[i][1] > py !== p[j][1] > py &&
              px < ((p[j][0] - p[i][0]) * (py - p[i][1])) / (p[j][1] - p[i][1]) + p[i][0]
            )
              ins = !ins;
          }
          return ins;
        };
        for (let x = x0; x <= x1; x++)
          for (let y = y0; y <= y1; y++)
            if (lastPoly && inP(x + 1e-6, y + 1e-6))
              out += `<circle cx="${F(X(x))}" cy="${F(Y(y))}" r="2" fill="${c('int')}"/>`;
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
    if (d.show) {
      Object.assign(P.show, DEF.show, d.show);
      syncToggles();
      save();
    } else {
      let ch = false;
      for (const k of ['gradient', 'level', 'region', 'lines'])
        if (!P.show[k]) {
          P.show[k] = true;
          ch = true;
        }
      if (ch) {
        syncToggles();
        save();
      }
    }
    loadPreset(d.p);
    if (d.view && d.view !== S.view) setView(d.view);
    showPanel(d.panel || 'solve');
    if (d.play) setTimeout(play, 350);
  }

  /* ---------- экспорт текста ---------- */
  function texLin(a, names, c0) {
    let s = '';
    a.forEach((q, j) => {
      if (q.z) return;
      const neg = q.s < 0,
        abs = q.abs();
      const co = abs.eq(Q1) ? '' : abs.int ? abs.ns : `\\frac{${abs.ns}}{${abs.ds}}`;
      const nm = names[j].replace(/^([a-zA-Z]+)_?(\d+)('*)$/, '$1_{$2}$3');
      s += (s ? (neg ? ' - ' : ' + ') : neg ? '-' : '') + co + nm;
    });
    if (c0 && !c0.z) {
      const ab = c0.abs();
      s +=
        (s ? (c0.s < 0 ? ' - ' : ' + ') : c0.s < 0 ? '-' : '') +
        (ab.int ? ab.ns : `\\frac{${ab.ns}}{${ab.ds}}`);
    }
    return s || '0';
  }
  const texQ = (q) => (q.s < 0 ? '-' : '') + (q.int ? q.as : `\\frac{${q.as}}{${q.ds}}`);
  const texOp = (o) => (o === '<=' ? '\\le' : o === '>=' ? '\\ge' : '=');
  function texProb(G, zn) {
    const L = [`${zn} = ${texLin(G.c, G.vars, G.c0)} \\to \\${G.sense}`];
    G.cons.forEach((c) => L.push(`${texLin(c.a, G.vars)} ${texOp(c.op)} ${texQ(c.b)}`));
    const ge = G.vars.filter((_, j) => G.sign[j] === 'ge'),
      le = G.vars.filter((_, j) => G.sign[j] === 'le');
    const t = (v) => v.map((n) => n.replace(/^([a-zA-Z]+)_?(\d+)$/, '$1_{$2}')).join(', ');
    return `\\begin{cases} ${L.join(' \\\\ ')}${ge.length ? ` \\\\ ${t(ge)} \\ge 0` : ''}${le.length ? ` \\\\ ${t(le)} \\le 0` : ''} \\end{cases}`;
  }
  function renderTex() {
    const ta = $('#xTex');
    if (S.err || !S.P) {
      ta.value = '';
      return;
    }
    const P0 = S.P,
      r = S.rP;
    if (fmtMode === 'tex') {
      let s = `% ${T().p_problem}\n${texProb(P0, 'z')}\n% ${T().d_head}\n${texProb(S.D, 'w')}\n`;
      if (r && r.status === 'optimal')
        s += `\\${P0.sense} z = ${texQ(r.value)},\\quad x = \\left(${r.x.map(texQ).join('; ')}\\right)`;
      ta.value = s;
    } else if (fmtMode === 'np') {
      const n = P0.vars.length,
        A = [],
        b = [],
        Ae = [],
        be = [];
      P0.cons.forEach((c) => {
        const row = c.a.map((q) => q.v);
        if (c.op === '<=') {
          A.push(row);
          b.push(c.b.v);
        } else if (c.op === '>=') {
          A.push(row.map((v) => -v));
          b.push(-c.b.v);
        } else {
          Ae.push(row);
          be.push(c.b.v);
        }
      });
      const bd = P0.sign.map((s, j) =>
        P0.bin[j] ? '(0, 1)' : s === 'ge' ? '(0, None)' : s === 'le' ? '(None, 0)' : '(None, None)'
      );
      const cc = P0.c.map((q) => (P0.sense === 'max' ? -1 : 1) * q.v);
      const J = (x) => JSON.stringify(x);
      ta.value = `from scipy.optimize import linprog\n# ${P0.sense}: ${T().pyMin}${P0.sense === 'max' ? T().pyNeg : ''}\nc = ${J(cc)}\nA_ub = ${A.length ? J(A) : 'None'}\nb_ub = ${b.length ? J(b) : 'None'}\nA_eq = ${Ae.length ? J(Ae) : 'None'}\nb_eq = ${be.length ? J(be) : 'None'}\nbounds = [${bd.join(', ')}]\n${P0.int.some(Boolean) ? `integrality = ${J(P0.int.map((v) => (v ? 1 : 0)))}\n` : ''}res = linprog(c, A_ub=A_ub, b_ub=b_ub, A_eq=A_eq, b_eq=b_eq, bounds=bounds${P0.int.some(Boolean) ? ', integrality=integrality' : ''})\nprint(res.x, ${P0.sense === 'max' ? '-' : ''}res.fun${P0.c0.z ? '' : ` + ${P0.c0.v}`})`;
    } else {
      let s = probText(P0) + '\n\n';
      if (r && r.status === 'optimal') s += `${P0.sense} z = ${qT(r.value)}\nx = ${ptT(r.x)}`;
      else if (r) s += textOf();
      ta.value = s;
    }
  }

  /* ---------- горячие клавиши ---------- */

  function flip(k) {
    P.show[k] = !P.show[k];
    syncToggles();
    save();
    renderCaption();
    req();
    const L = T();
    toast(`${L.tog[k]}: ${P.show[k] ? L.on : L.off}`);
  }
  onShortcut((c, e, isQ) => {
    const L = T();
    let h = true;
    const setT = (v) => {
      S.anim = null;
      S.t = Math.max(0, Math.min(1, v));
      setZfromT();
      renderCaption();
      req();
    };
    if (isQ) openKeys();
    else if (c === 'Space') play();
    else if (c === 'ArrowLeft' || c === 'ArrowRight') {
      const st = e.shiftKey ? 0.25 : 0.05;
      setT(S.t + (c === 'ArrowLeft' ? -st : st));
    } else if (c === 'Home') setT(0);
    else if (c === 'End') setT(1);
    else if (/^(Digit|Numpad)[1-9]$/.test(c)) {
      const p = PRE[+c.slice(-1) - 1];
      if (p) {
        loadPreset(p[0]);
        toast(L.pre[p[0]]);
      }
    } else if (c === 'Digit0' || c === 'Numpad0') fitView();
    else if (c === 'KeyD') {
      setView(S.view === 'P' ? 'D' : 'P');
    } else if (c === 'KeyV') flip('gradient');
    else if (c === 'KeyL') flip('level');
    else if (c === 'KeyB') flip('vertices');
    else if (c === 'KeyR') flip('sides');
    else if (c === 'KeyG') flip('bgGrid');
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
      // «Сбросить всё» в МОР сбрасывает и ползунок скорости анимации
      onReset: (np) => {
        $('#spR').value = np.speed;
        $('#spOut').textContent = '×1';
      },
    },
  });
  const { buildSettings, buildPal, syncSettings, applyDock, applyPrefs } = settings;
  settings.init();

  function applyLang() {
    const L = T();
    LNG = lang();
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
    if (S.txt) {
      solveAll({ keepT: true });
    }
    syncStyle();
  }

  /* ---------- старт ---------- */
  buildPanels();
  buildSettings();
  $('#spR').value = P.speed;
  $('#spOut').textContent = '×' + fmt(P.speed);
  applyPrefs();
  {
    const l = P.last;
    if (l && typeof l.txt === 'string' && l.txt.trim()) {
      S.txt = l.txt;
      S.preset = l.p || null;
      $('#pIn').value = l.txt;
      try {
        solveAll({ autoView: true, fit: true });
      } catch (e) {
        console.error(e);
        S.err = { msg: 'bug' };
        try {
          renderAll();
        } catch (_) {}
      }
    } else loadPreset('prod');
  }
  applyLang();
  if (document.fonts && document.fonts.ready)
    document.fonts.ready.then(() => {
      fitView();
      req();
    });
})();
