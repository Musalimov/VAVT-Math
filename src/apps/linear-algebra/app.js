import { applyTexts, createSettings } from '../../shared/settings.js';
import { createKeys, onShortcut } from '../../shared/keys.js';
import { createExport } from '../../shared/export.js';
import { createGlossary } from '../../shared/glossary.js';
import { initDrawers } from '../../shared/drawers.js';
import { initHome } from '../../shared/home.js';
import { createPanels } from '../../shared/panels.js';
import { loadPrefs, makeSaver } from '../../shared/prefs.js';
import { $, clone } from '../../shared/dom.js';
import { pub } from '../../shared/state.js';
import { setOn } from '../../shared/dom.js';
import { openDrawer, closeDrawers } from '../../shared/drawers.js';
import { toast } from '../../shared/toast.js';
import { KEYS } from './content/keys.js';
import { CHAP, FORMAL, ILL, REL, TERMS } from './content/glossary.js';
import { PRE } from './content/examples.js';
import { T } from './content/tx.js';
import { isSingular, rot2, rx, rz } from '../../math/linalg.js';
import {
  I,
  add,
  ap,
  col,
  det,
  eigen,
  inv,
  isI,
  lerp,
  mul,
  norm,
  nullspace,
  nz,
  sc,
  sigmaMin2,
  tr,
  transpose,
} from '../../math/linalg.js';
import { lang, langFrom } from '../../shared/i18n.js';
(() => {
  'use strict';
  /* ---------- автоматы состояний ----------
   Всё, что «режимно» в приложении, сведено к пяти автоматам. Каждый публикует
   текущее состояние в <body data-*> — для CSS, тестов, скринридеров и агентов.
   anim     idle → playing → (queued → playing)* → idle;  idle ⇄ scrub
            playing: S.anim идёт;  queued: шаг цепочки ждёт 350 мс (nextT);
            scrub: d.t<1 без анимации. Любая команда пользователя → stopAnim().
   gesture  none → i|j|v|b1|b2|pan|orbit → pinch → pan|orbit → none   (drag, ptrs)
   drawer   none ⇄ gloss|keys|settings — открыт не больше одного   (openDrawer/closeDrawers)
   rec      idle ⇄ recording   (S.rec, exportVideo)
   mode/shape  2d|3d × 2x2|2x1|1x2|3x3|3x2|2x3 — у 2D и 3D своё состояние (S.d2/S.d3)
*/

  const KEY = 'linal-viz-v1';
  const PAL = {
    classic: {
      name: 'Классика',
      bg: '#0b0c10',
      bgGrid: '#262b33',
      grid: '#3a9ec4',
      axis: '#f2f2f2',
      i: '#83c167',
      j: '#fc6255',
      k: '#58c4dd',
      det: '#f4d345',
      eigen: '#c77dff',
      vec: '#ff9f43',
      span: '#b9f3fc',
      kernel: '#ff7aa8',
    },
    paper: {
      name: 'Бумага',
      bg: '#fbfaf7',
      bgGrid: '#e3e1da',
      grid: '#4a89b8',
      axis: '#23262b',
      i: '#3f9a3a',
      j: '#d1453b',
      k: '#2b6cb0',
      det: '#e0a800',
      eigen: '#8e44ad',
      vec: '#e67e22',
      span: '#16a085',
      kernel: '#c0398b',
    },
    neon: {
      name: 'Неон',
      bg: '#07020f',
      bgGrid: '#1f1533',
      grid: '#ff2fd0',
      axis: '#ffffff',
      i: '#39ff88',
      j: '#ff4d6d',
      k: '#4dd2ff',
      det: '#fff35c',
      eigen: '#ffa53d',
      vec: '#8f7bff',
      span: '#7af7ff',
      kernel: '#ff9ecf',
    },
    nord: {
      name: 'Норд',
      bg: '#2e3440',
      bgGrid: '#3b4252',
      grid: '#88c0d0',
      axis: '#eceff4',
      i: '#a3be8c',
      j: '#bf616a',
      k: '#81a1c1',
      det: '#ebcb8b',
      eigen: '#b48ead',
      vec: '#d08770',
      span: '#8fbcbb',
      kernel: '#e5a0c0',
    },
  };

  const nm = (id) => (id.endsWith('ᵀ') ? nm(id.slice(0, -1)) + 'ᵀ' : T().names[id] || id);
  const PANELS = ['matrix', 'presets', 'anim', 'props', 'vector', 'mul', 'cob', 'show', 'export'];
  const DEF = {
    palette: 'classic',
    colors: { ...PAL.classic },
    dock: 'auto',
    width: 340,
    bottomH: 44,
    ui: 'auto',
    font: 100,
    speed: 1,
    lw: 1,
    order: PANELS.slice(),
    collapsed: { mul: true, cob: true, export: true },
    read: {},
    float: { x: 12, y: 12 },
    show: {
      bgGrid: true,
      grid: true,
      basis: true,
      det: true,
      eigen: true,
      span: true,
      kernel: true,
      vec: false,
      decomp: false,
      labels: true,
      coords: true,
      snap: true,
      lattice: false,
      hints: true,
      ghost: true,
      trails: false,
    },
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

  /* ---------- математика ---------- */

  function fmt(x, d = 2) {
    if (!isFinite(x)) return x > 0 ? '∞' : x < 0 ? '−∞' : '—';
    if (Math.abs(x) < 5e-10) x = 0;
    let s = String(+x.toFixed(d));
    if (s === '-0') s = '0';
    return s.replace('-', '−');
  }

  /* ---------- состояние ---------- */
  const S = {
    mode: '2d',
    compose: false,
    anim: null,
    d2: { from: I(2), to: I(2), t: 1, hist: [], v: [2, 1], shape: [2, 2] },
    d3: { from: I(3), to: I(3), t: 1, hist: [], v: [1, 1, 1], shape: [3, 3] },
    V: { scale: 60, ox: 0, oy: 0 },
    cam: { yaw: -2.3, pitch: 0.5, zoom: 1 },
    K: null,
  };
  const D = () => (S.mode === '2d' ? S.d2 : S.d3);
  S.cr = 0;
  S.cob = { on: false, b1: [2, 1], b2: [-1, 1] };
  const SH = () => D().shape;
  const isSq = () => SH()[0] === SH()[1];
  const shapeKey = () => (isSq() ? S.mode : SH().join('x'));
  function baseM() {
    const n = N(),
      k = SH()[1],
      B = new Array(n * n).fill(0);
    for (let i = 0; i < k; i++) B[i * n + i] = 1;
    return B;
  }
  function maskM(M) {
    const n = N(),
      [r, c] = SH();
    return M.map((x, k) => (Math.floor(k / n) < r && k % n < c ? x : 0));
  }
  const eqM = (A, B) => A.every((x, i) => Math.abs(x - B[i]) < 1e-9);
  const padR = (rows, n) => {
    const M = new Array(n * n).fill(0);
    rows.forEach((r, i) =>
      r.forEach((x, j) => {
        M[i * n + j] = x;
      })
    );
    return M;
  };
  const N = () => (S.mode === '2d' ? 2 : 3);
  const cur = () => {
    const d = D();
    return lerp(d.from, d.to, d.t);
  };

  PRE['2x1'] = [
    ['lineDiag', padR([[2], [1]], 2)],
    ['lineY', padR([[0], [1.5]], 2)],
    ['lineStretch', padR([[2], [0]], 2)],
    ['lineFlip', padR([[-1], [1]], 2)],
    ['random', null],
  ];
  PRE['1x2'] = [
    ['projX', padR([[1, 0]], 2)],
    ['sumXY', padR([[1, 1]], 2)],
    ['dot21', padR([[2, 1]], 2)],
    ['diffXY', padR([[1, -1]], 2)],
    ['random', null],
  ];
  PRE['3x2'] = [
    [
      'planeXY1',
      padR(
        [
          [1, 0],
          [0, 1],
          [1, 1],
        ],
        3
      ),
    ],
    [
      'planeTilt',
      padR(
        [
          [1, 0],
          [0, 1],
          [0, 0.8],
        ],
        3
      ),
    ],
    [
      'planeXZ',
      padR(
        [
          [1, 0],
          [0, 0],
          [0, 1],
        ],
        3
      ),
    ],
    [
      'toLine3',
      padR(
        [
          [1, 0.5],
          [1, 0.5],
          [1, 0.5],
        ],
        3
      ),
    ],
    ['random', null],
  ];
  PRE['2x3'] = [
    [
      'projXY',
      padR(
        [
          [1, 0, 0],
          [0, 1, 0],
        ],
        3
      ),
    ],
    [
      'oblique',
      padR(
        [
          [1, 0, 0.6],
          [0, 1, 0.6],
        ],
        3
      ),
    ],
    [
      'sideView',
      padR(
        [
          [0, 1, 0],
          [0, 0, 1],
        ],
        3
      ),
    ],
    [
      'toLine2',
      padR(
        [
          [1, 1, 1],
          [0.5, 0.5, 0.5],
        ],
        3
      ),
    ],
    ['random', null],
  ];
  function randShape() {
    if (isSq()) return randM(N());
    let M;
    do {
      M = maskM(Array.from({ length: N() * N() }, () => Math.round(Math.random() * 4 - 2)));
    } while (M.every((x) => x === 0));
    return M;
  }
  function randM(n) {
    let M;
    do {
      M = Array.from({ length: n * n }, () => Math.round(Math.random() * 4 - 2));
    } while ((Math.abs(det(M, n)) < 0.5 && Math.random() < 0.8) || M.every((x) => x === 0));
    return M;
  }

  function setMatrix(M, name = 'custom') {
    const d = D(),
      n = N();
    stopAnim();
    d.from = baseM();
    d.to = maskM(M);
    d.t = 1;
    d.hist = [name];
    changed();
  }
  function animateTo(M, name, opt = {}) {
    const d = D(),
      n = N(),
      comp = isSq() && (opt.compose !== undefined ? opt.compose : S.compose);
    if (comp) {
      d.from = d.to.slice();
      d.to = mul(M, d.to, n);
      if (!d.hist.length || isI(d.from, n)) d.hist = [];
      d.hist.push(name);
    } else {
      d.from = baseM();
      d.to = maskM(M);
      d.hist = [name];
    }
    play(opt.then);
  }
  let nextT = 0;
  const animState = () => (S.anim ? 'playing' : nextT ? 'queued' : D().t < 1 ? 'scrub' : 'idle');
  function stopAnim() {
    S.anim = null;
    clearTimeout(nextT);
    nextT = 0;
    pub('anim', animState());
  }
  function play(then) {
    stopAnim();
    const d = D();
    d.t = 0;
    S.anim = { start: performance.now(), dur: 1500 / P.speed, then };
    changed();
  }
  const ease = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

  /* ---------- холст ---------- */
  const cv = $('#cv'),
    ctx = cv.getContext('2d'),
    stage = $('#stage'),
    main = $('#main'),
    side = $('#side');
  const { buildPanels, applyOrder, showPanel } = createPanels({
    side,
    prefs: () => P,
    save,
    openDetails: true,
  });
  let W = 0,
    H = 0,
    DPR = 1,
    raf = 0,
    sized = false;
  new ResizeObserver(() => {
    const r = stage.getBoundingClientRect();
    W = r.width;
    H = r.height;
    if (!sized && W > 0 && H > 0) {
      sized = true;
      S.V.scale = Math.max(30, Math.min(80, Math.min(W, H) / 8));
    }
    DPR = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.max(1, Math.round(W * DPR));
    cv.height = Math.max(1, Math.round(H * DPR));
    req();
  }).observe(stage);
  function req() {
    if (!raf) raf = requestAnimationFrame(frame);
  }
  function frame(now) {
    raf = 0;
    if (S.anim) {
      const d = D(),
        p = Math.min(1, (now - S.anim.start) / S.anim.dur);
      d.t = ease(p);
      if (p >= 1) {
        const th = S.anim.then;
        S.anim = null;
        d.t = 1;
        renderCaption();
        if (S.cob.on) renderCob();
        if (th)
          nextT = setTimeout(() => {
            nextT = 0;
            th();
          }, 350);
      } else req();
      $('#tR').value = Math.round(d.t * 1000);
      $('#tOut').textContent = fmt(d.t);
    }
    renderNow();
    renderOverlay();
    pub('anim', animState());
  }
  function renderNow() {
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    LQ = [];
    if (S.mode === '2d') draw2();
    else draw3();
    flushLabels();
    if (S.stamp) drawStamp();
  }
  function drawStamp() {
    const n = N(),
      [rr, cc] = SH(),
      M = cur(),
      c = P.colors,
      cl = [c.i, c.j, c.k],
      cells = M.map((x) => fmt(x));
    ctx.font = '600 18px "Source Serif 4", Georgia, serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'right';
    const cw = [];
    for (let j = 0; j < cc; j++) {
      let m = 0;
      for (let i = 0; i < rr; i++) m = Math.max(m, ctx.measureText(cells[i * n + j]).width);
      cw.push(m);
    }
    const gap = 18,
      rh = 26,
      px = 22,
      x0 = 12,
      y0 = 12,
      w = cw.reduce((a, b) => a + b, 0) + gap * (cc - 1) + 2 * px,
      h = rh * rr + 18;
    ctx.globalAlpha = 0.86;
    ctx.fillStyle = c.bg;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x0, y0, w, h, 10);
    else ctx.rect(x0, y0, w, h);
    ctx.fill();
    ctx.globalAlpha = 1;
    const b1 = x0 + 11,
      b2 = x0 + w - 11,
      t1 = y0 + 7,
      t2 = y0 + h - 7;
    ctx.strokeStyle = c.axis;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(b1 + 6, t1);
    ctx.lineTo(b1, t1);
    ctx.lineTo(b1, t2);
    ctx.lineTo(b1 + 6, t2);
    ctx.moveTo(b2 - 6, t1);
    ctx.lineTo(b2, t1);
    ctx.lineTo(b2, t2);
    ctx.lineTo(b2 - 6, t2);
    ctx.stroke();
    let x = x0 + px;
    for (let j = 0; j < cc; j++) {
      ctx.fillStyle = cl[j];
      for (let i = 0; i < rr; i++) ctx.fillText(cells[i * n + j], x + cw[j], y0 + 9 + rh * i + rh / 2);
      x += cw[j] + gap;
    }
  }
  function seg(a, b, c, w, al = 1, dash) {
    ctx.globalAlpha = al;
    ctx.strokeStyle = c;
    ctx.lineWidth = w;
    ctx.setLineDash(dash || []);
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  }
  function dotAt(p, c, al = 1, r = 3) {
    ctx.globalAlpha = al;
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(p[0], p[1], r, 0, 7);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  function arrow(a, b, c, w = 3, al = 1) {
    const dx = b[0] - a[0],
      dy = b[1] - a[1],
      L = Math.hypot(dx, dy);
    ctx.globalAlpha = al;
    if (L < 2) {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(b[0], b[1], w + 1.5, 0, 7);
      ctx.fill();
      ctx.globalAlpha = 1;
      return;
    }
    const h = Math.min(10 + w * 2, L * 0.5),
      ux = dx / L,
      uy = dy / L,
      hw = h * 0.5;
    ctx.strokeStyle = c;
    ctx.lineWidth = w;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(b[0] - ux * h * 0.8, b[1] - uy * h * 0.8);
    ctx.stroke();
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.moveTo(b[0], b[1]);
    ctx.lineTo(b[0] - ux * h - uy * hw, b[1] - uy * h + ux * hw);
    ctx.lineTo(b[0] - ux * h + uy * hw, b[1] - uy * h - ux * hw);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.lineCap = 'butt';
  }
  let LQ = [];
  const lfont = (sz, it) => `${it ? 'italic ' : ''}600 ${sz}px "Source Serif 4", Georgia, serif`;
  function txt(s, x, y, c, size = 19, italic = true, al = 1, pri = 1) {
    LQ.push({ s, x, y, ax: x, ay: y, c, size, italic, al, pri });
  }
  function stageObstacles() {
    const sr = stage.getBoundingClientRect(),
      out = [];
    ['#ov', '.zoom', '#cap', '#capOpen', '#toast.on'].forEach((q) => {
      const e = document.querySelector(q);
      if (!e || e.hidden) return;
      const r = e.getBoundingClientRect();
      if (!r.width || !r.height) return;
      out.push({
        x: r.left - sr.left + r.width / 2,
        y: r.top - sr.top + r.height / 2,
        w: r.width + 8,
        h: r.height + 8,
      });
    });
    return out;
  }
  function declutter(Q) {
    const obs = stageObstacles(),
      n = Q.length;
    for (let it = 0; it < 80; it++) {
      let moved = false;
      for (let i = 0; i < n; i++) {
        const a = Q[i];
        for (let j = i + 1; j < n; j++) {
          const b = Q[j],
            ox = (a.w + b.w) / 2 - Math.abs(a.x - b.x),
            oy = (a.h + b.h) / 2 - Math.abs(a.y - b.y);
          if (ox > 0 && oy > 0) {
            moved = true;
            const wa = b.pri / (a.pri + b.pri),
              wb = 1 - wa;
            if (ox * 0.8 < oy) {
              const sg = Math.sign(a.x - b.x) || -1;
              a.x += sg * (ox + 0.5) * wa;
              b.x -= sg * (ox + 0.5) * wb;
            } else {
              const sg = Math.sign(a.y - b.y) || -1;
              a.y += sg * (oy + 0.5) * wa;
              b.y -= sg * (oy + 0.5) * wb;
            }
          }
        }
        for (const o of obs) {
          const ox = (a.w + o.w) / 2 - Math.abs(a.x - o.x),
            oy = (a.h + o.h) / 2 - Math.abs(a.y - o.y);
          if (ox > 0 && oy > 0) {
            moved = true;
            const hw = (a.w + o.w) / 2 + 0.5,
              hh = (a.h + o.h) / 2 + 0.5;
            const c = [
              [o.x - hw, a.y],
              [o.x + hw, a.y],
              [a.x, o.y - hh],
              [a.x, o.y + hh],
            ].filter(
              ([x, y]) => x - a.w / 2 >= 2 && x + a.w / 2 <= W - 2 && y - a.h / 2 >= 2 && y + a.h / 2 <= H - 2
            );
            const best = (c.length ? c : [[a.x, o.y + hh]]).sort(
              (p, q) => Math.hypot(p[0] - a.x, p[1] - a.y) - Math.hypot(q[0] - a.x, q[1] - a.y)
            )[0];
            a.x = best[0];
            a.y = best[1];
          }
        }
      }
      for (const a of Q) {
        a.x = Math.max(a.w / 2 + 2, Math.min(W - a.w / 2 - 2, a.x));
        a.y = Math.max(a.h / 2 + 2, Math.min(H - a.h / 2 - 2, a.y));
      }
      if (!moved) break;
    }
  }
  function flushLabels() {
    const Q = LQ;
    LQ = [];
    if (!Q.length) return;
    for (const l of Q) {
      ctx.font = lfont(l.size, l.italic);
      l.w = ctx.measureText(l.s.split('\u0302').join('')).width + 6;
      l.h = l.size + 2 + (l.s.includes('\u0302') ? l.size * 0.3 : 0);
    }
    declutter(Q);
    for (const l of Q) {
      const dx = l.x - l.ax,
        dy = l.y - l.ay;
      if (Math.hypot(dx, dy) > 12) {
        const k = Math.min(l.w / 2 / Math.max(Math.abs(dx), 1e-6), l.h / 2 / Math.max(Math.abs(dy), 1e-6), 1),
          ex = l.x - dx * k,
          ey = l.y - dy * k;
        ctx.globalAlpha = 0.6 * l.al;
        ctx.strokeStyle = l.c;
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 3]);
        ctx.beginPath();
        ctx.moveTo(l.ax, l.ay);
        ctx.lineTo(ex, ey);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = l.c;
        ctx.beginPath();
        ctx.arc(l.ax, l.ay, 2, 0, 7);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      ctx.globalAlpha = l.al;
      ctx.font = lfont(l.size, l.italic);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 4;
      ctx.strokeStyle = P.colors.bg;
      drawHatText(l);
      ctx.globalAlpha = 1;
    }
  }
  function drawHatText(l) {
    const HT = '\u0302',
      plain = l.s.split(HT).join('');
    ctx.strokeText(plain, l.x, l.y);
    ctx.fillStyle = l.c;
    ctx.fillText(plain, l.x, l.y);
    if (!l.s.includes(HT)) return;
    const left = l.x - ctx.measureText(plain).width / 2;
    let pi = 0;
    for (let i = 0; i < l.s.length; i++) {
      const ch = l.s[i];
      if (ch === HT) continue;
      if (l.s[i + 1] === HT) {
        const pre = ctx.measureText(plain.slice(0, pi)).width,
          m = ctx.measureText(ch),
          cx = left + pre + m.width / 2 + (l.italic ? l.size * 0.08 : 0),
          top = l.y - (m.actualBoundingBoxAscent || l.size * 0.5) - l.size * 0.1,
          hw = l.size * 0.17,
          hh = l.size * 0.15;
        ctx.save();
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx - hw, top);
        ctx.lineTo(cx, top - hh);
        ctx.lineTo(cx + hw, top);
        ctx.strokeStyle = P.colors.bg;
        ctx.lineWidth = l.size * 0.08 + 3;
        ctx.stroke();
        ctx.strokeStyle = l.c;
        ctx.lineWidth = Math.max(1.3, l.size * 0.08);
        ctx.stroke();
        ctx.restore();
      }
      pi++;
    }
  }
  function tipLabel(s, o, t, c, far) {
    const dx = t[0] - o[0],
      dy = t[1] - o[1],
      L = Math.hypot(dx, dy);
    if (L < 12) return;
    const k = far ? 34 : 18,
      p = far ? 14 : 0;
    txt(
      s,
      t[0] + (dx / L) * k - (dy / L) * p,
      t[1] + (dy / L) * k + (dx / L) * p,
      c,
      far ? 16 : 19,
      true,
      1,
      far ? 1 : 3
    );
  }
  function poly(pts, fill, fa, stroke, sa, w = 2) {
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.closePath();
    ctx.globalAlpha = fa;
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.globalAlpha = sa;
      ctx.strokeStyle = stroke;
      ctx.lineWidth = w;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  const w2s = (x, y) => [W / 2 + S.V.ox + x * S.V.scale, H / 2 + S.V.oy - y * S.V.scale];
  const s2w = (X, Y) => [(X - W / 2 - S.V.ox) / S.V.scale, -(Y - H / 2 - S.V.oy) / S.V.scale];

  function draw2() {
    const c = P.colors,
      sh = P.show,
      M = cur(),
      d = S.d2,
      lw = P.lw,
      K = S.K,
      sc = S.V.scale;
    ctx.fillStyle = c.bg;
    ctx.fillRect(0, 0, W, H);
    const [x0, y1] = s2w(0, 0),
      [x1, y0] = s2w(W, H);
    const step = sc < 7 ? 10 : sc < 16 ? 5 : sc < 28 ? 2 : 1;
    const R = Math.hypot(Math.max(Math.abs(x0), Math.abs(x1)), Math.max(Math.abs(y0), Math.abs(y1)));
    if (sh.bgGrid) {
      ctx.strokeStyle = c.bgGrid;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = Math.ceil(x0 / step) * step; x <= x1; x += step) {
        const a = w2s(x, 0)[0];
        ctx.moveTo(a, 0);
        ctx.lineTo(a, H);
      }
      for (let y = Math.ceil(y0 / step) * step; y <= y1; y += step) {
        const b = w2s(0, y)[1];
        ctx.moveTo(0, b);
        ctx.lineTo(W, b);
      }
      ctx.stroke();
      const o = w2s(0, 0);
      seg([0, o[1]], [W, o[1]], c.axis, 1.2, 0.3);
      seg([o[0], 0], [o[0], H], c.axis, 1.2, 0.3);
    }
    if (sh.grid) {
      let n = Math.ceil(R / Math.max(sigmaMin2(M), R / 150)) + step;
      n = Math.ceil(n / step) * step;
      ctx.globalAlpha = 0.9;
      ctx.strokeStyle = c.grid;
      ctx.lineWidth = 1.5 * lw;
      ctx.beginPath();
      for (let k = -n; k <= n; k += step) {
        if (k === 0) continue;
        let a = w2s(...ap(M, [k, -n], 2)),
          b = w2s(...ap(M, [k, n], 2));
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        a = w2s(...ap(M, [-n, k], 2));
        b = w2s(...ap(M, [n, k], 2));
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
      seg(w2s(...ap(M, [-n, 0], 2)), w2s(...ap(M, [n, 0], 2)), c.axis, 2.2 * lw, 0.95);
      seg(w2s(...ap(M, [0, -n], 2)), w2s(...ap(M, [0, n], 2)), c.axis, 2.2 * lw, 0.95);
    }
    if (sh.coords && sc >= 26) {
      ctx.font = '500 11px "Manrope", system-ui, sans-serif';
      ctx.fillStyle = c.axis;
      ctx.globalAlpha = 0.5;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      for (let x = Math.ceil(x0 / step) * step; x <= x1; x += step)
        if (x) {
          const p = w2s(x, 0);
          ctx.fillText(String(x).replace('-', '−'), p[0], p[1] + 5);
        }
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      for (let y = Math.ceil(y0 / step) * step; y <= y1; y += step)
        if (y) {
          const p = w2s(0, y);
          ctx.fillText(String(y).replace('-', '−'), p[0] - 6, p[1]);
        }
      ctx.globalAlpha = 1;
    }
    if (sh.span) {
      const ns = nullspace(M, 2, 1e-7);
      if (ns.rank === 1) {
        const u = nz(col(M, ns.piv[0], 2));
        seg(w2s(...sc2(u, -2 * R)), w2s(...sc2(u, 2 * R)), c.span, 5 * lw, 0.55);
        if (sh.labels) {
          const p = w2s(...sc2(u, Math.min(R * 0.55, 4.5)));
          txt(T().image, p[0] + 14, p[1] - 14, c.span, 15);
        }
      }
    }
    if (sh.kernel && K.ns.basis.length === 1) {
      const u = K.ns.basis[0];
      seg(w2s(...sc2(u, -2 * R)), w2s(...sc2(u, 2 * R)), c.kernel, 2.2 * lw, 0.85, [8, 7]);
      if (sh.labels) {
        const p = w2s(...sc2(u, Math.min(R * 0.45, 3.5)));
        txt(T().kernel, p[0] + 16, p[1] + 14, c.kernel, 15);
      }
    }
    const F = d.from,
      o0 = w2s(0, 0),
      moved = !M.every((x, i) => Math.abs(x - F[i]) < 1e-9),
      fi = col(F, 0, 2),
      fj = col(F, 1, 2);
    if (sh.ghost && moved) {
      if (sh.grid) {
        let n = Math.ceil(R / Math.max(sigmaMin2(F), R / 150)) + step;
        n = Math.ceil(n / step) * step;
        ctx.globalAlpha = 0.32;
        ctx.strokeStyle = c.grid;
        ctx.lineWidth = lw;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        for (let k = -n; k <= n; k += step) {
          let a = w2s(...ap(F, [k, -n], 2)),
            b = w2s(...ap(F, [k, n], 2));
          ctx.moveTo(a[0], a[1]);
          ctx.lineTo(b[0], b[1]);
          a = w2s(...ap(F, [-n, k], 2));
          b = w2s(...ap(F, [n, k], 2));
          ctx.moveTo(a[0], a[1]);
          ctx.lineTo(b[0], b[1]);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
      }
      if (sh.det) {
        ctx.setLineDash([6, 5]);
        poly([o0, w2s(...fi), w2s(...add(fi, fj)), w2s(...fj)], c.det, 0.07, c.det, 0.6, 1.5 * lw);
        ctx.setLineDash([]);
      }
      if (sh.basis) {
        arrow(o0, w2s(...fi), c.i, 2.4 * lw, 0.38);
        if (SH()[1] > 1) arrow(o0, w2s(...fj), c.j, 2.4 * lw, 0.38);
      }
      if (sh.vec) arrow(o0, w2s(...ap(F, d.v, 2)), c.vec, 2.2 * lw, 0.38);
    }
    if (sh.trails && moved) {
      const trl = (a, b, cl, al = 0.8) => {
        const p = w2s(...a);
        seg(p, w2s(...b), cl, 1.6 * lw, al, [2, 5]);
        dotAt(p, cl, al);
      };
      if (sh.grid)
        for (let x = -3; x <= 3; x++)
          for (let y = -3; y <= 3; y++) trl(ap(F, [x, y], 2), ap(M, [x, y], 2), c.grid, 0.45);
      if (sh.det) trl(add(fi, fj), add(col(M, 0, 2), col(M, 1, 2)), c.det);
      if (sh.basis) {
        trl(fi, col(M, 0, 2), c.i);
        trl(fj, col(M, 1, 2), c.j);
      }
      if (sh.vec) trl(ap(F, d.v, 2), ap(M, d.v, 2), c.vec);
    }
    const mi = col(M, 0, 2),
      mj = col(M, 1, 2),
      o = w2s(0, 0);
    if (!isSq() && SH()[1] === 1)
      for (let k = -15; k <= 15; k++) dotAt(w2s(...ap(M, [k, 0], 2)), c.i, 0.9, 2.6);
    if (sh.det && isSq()) {
      const dt = det(M, 2);
      poly(
        [o, w2s(...mi), w2s(...add(mi, mj)), w2s(...mj)],
        c.det,
        Math.abs(dt) < 1e-9 ? 0 : 0.3,
        c.det,
        0.9,
        2 * lw
      );
      if (sh.labels && Math.abs(dt) > 1e-9) {
        const cc = w2s(...sc2(add(mi, mj), 0.5));
        txt('det = ' + fmt(dt), cc[0], cc[1], c.det, 16, false);
      }
    }
    if (sh.eigen) {
      K.E.vecs.forEach((e) => {
        if (e.dim >= 2) return;
        seg(w2s(...sc2(e.v, -2 * R)), w2s(...sc2(e.v, 2 * R)), c.eigen, 1.8 * lw, 0.7, [4, 6]);
        const t = w2s(...ap(M, e.v, 2));
        arrow(o, t, c.eigen, 2.6 * lw);
        if (sh.labels) tipLabel('λ = ' + fmt(e.l), o, t, c.eigen, true);
      });
    }
    if (sh.vec) drawVec2(M, o);
    drawTools2(M, o, R);
    if (sh.basis) {
      const two = SH()[1] > 1,
        ti = w2s(...mi),
        tj = w2s(...mj);
      arrow(o, ti, c.i, 3.6 * lw);
      if (two) arrow(o, tj, c.j, 3.6 * lw);
      if (sh.labels) {
        tipLabel('î', o, ti, c.i);
        if (two) tipLabel('ĵ', o, tj, c.j);
      }
    }
  }
  function sc2(v, s) {
    return [v[0] * s, v[1] * s];
  }
  function drawTools2(M, o, R) {
    if (!isSq()) return;
    const c = P.colors,
      lw = P.lw,
      d = S.d2,
      A = d.to;
    if (S.cob.on) {
      const b1 = S.cob.b1,
        b2 = S.cob.b2,
        Pm = [b1[0], b2[0], b1[1], b2[1]];
      if (!isSingular(Pm, 2)) {
        const n = Math.min(60, Math.ceil(R / Math.max(sigmaMin2(Pm), R / 60)) + 1);
        ctx.save();
        ctx.globalAlpha = 0.45;
        ctx.strokeStyle = c.eigen;
        ctx.lineWidth = lw;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        for (let k = -n; k <= n; k++) {
          let a = w2s(...ap(Pm, [k, -n], 2)),
            b = w2s(...ap(Pm, [k, n], 2));
          ctx.moveTo(a[0], a[1]);
          ctx.lineTo(b[0], b[1]);
          a = w2s(...ap(Pm, [-n, k], 2));
          b = w2s(...ap(Pm, [n, k], 2));
          ctx.moveTo(a[0], a[1]);
          ctx.lineTo(b[0], b[1]);
        }
        ctx.stroke();
        ctx.restore();
      }
      const t1 = w2s(...b1),
        t2 = w2s(...b2);
      arrow(o, t1, c.eigen, 3.2 * lw);
      arrow(o, t2, c.eigen, 3.2 * lw);
      if (P.show.labels) {
        tipLabel('b₁', o, t1, c.eigen);
        tipLabel('b₂', o, t2, c.eigen);
      }
    }
    if (P.show.vec) {
      const v = d.v,
        dA = det(A, 2);
      if (!isSingular(A, 2) && S.cr) {
        const X = ap(M, v, 2),
          Mi = col(M, 0, 2),
          Mj = col(M, 1, 2),
          pts = S.cr === 1 ? [[0, 0], X, add(X, Mj), Mj] : [[0, 0], Mi, add(Mi, X), X];
        poly(
          pts.map((p) => w2s(...p)),
          c.span,
          0.22,
          c.span,
          0.9,
          1.8 * lw
        );
        if (P.show.labels) {
          const pc = w2s(
            ...sc2(
              pts.reduce((a, p) => add(a, p), [0, 0]),
              0.25
            )
          );
          txt('S = ' + fmt(det(M, 2) * v[S.cr - 1]), pc[0], pc[1], c.span, 15, false);
        }
      }
      if (isSingular(A, 2) && S.K.ns.rank === 1) {
        const k = S.K.ns.basis[0];
        seg(w2s(...add(v, sc2(k, -2 * R))), w2s(...add(v, sc2(k, 2 * R))), c.vec, 1.6 * lw, 0.35, [3, 6]);
        const p0 = ap(M, v, 2),
          dk = ap(M, k, 2);
        if (norm(dk) > 1e-6)
          seg(
            w2s(...add(p0, sc2(dk, (-2 * R) / Math.max(norm(dk), 1e-3)))),
            w2s(...add(p0, sc2(dk, (2 * R) / Math.max(norm(dk), 1e-3)))),
            c.vec,
            2 * lw,
            0.8,
            [7, 5]
          );
      }
    }
  }
  function drawVec2(M, o) {
    const c = P.colors,
      d = S.d2,
      v = d.v,
      Av = ap(M, v, 2),
      t = w2s(...Av),
      lw = P.lw;

    if (P.show.decomp) {
      const a = sc2(col(M, 0, 2), v[0]);
      const pa = w2s(...a);
      arrow(o, pa, c.i, 2 * lw, 0.85);
      arrow(pa, t, c.j, 2 * lw, 0.85);
      if (P.show.labels) {
        const m1 = w2s(...sc2(a, 0.5));
        txt(fmt(v[0]) + '·î', m1[0], m1[1] + 14, c.i, 14);
        const m2 = [(pa[0] + t[0]) / 2, (pa[1] + t[1]) / 2];
        txt(fmt(v[1]) + '·ĵ', m2[0] + 18, m2[1], c.j, 14);
      }
    }
    arrow(o, t, c.vec, 3.2 * lw);
    if (P.show.labels) tipLabel('v', o, t, c.vec);
  }

  /* 3D */
  function mk3() {
    const cm = S.cam,
      cy = Math.cos(cm.yaw),
      sy = Math.sin(cm.yaw),
      cp = Math.cos(cm.pitch),
      sp = Math.sin(cm.pitch),
      s = (Math.min(W, H) / 11) * cm.zoom,
      dist = 22,
      ox = W / 2,
      oy = H / 2;
    return (p) => {
      const x1 = p[0] * cy - p[1] * sy,
        y1 = p[0] * sy + p[1] * cy,
        z = p[2],
        depth = y1 * cp - z * sp,
        up = y1 * sp + z * cp,
        f = dist / Math.max(dist + depth, dist * 0.15);
      return [ox + x1 * s * f, oy - up * s * f, depth];
    };
  }
  function draw3() {
    const c = P.colors,
      sh = P.show,
      M = cur(),
      K = S.K,
      lw = P.lw,
      pr = mk3();
    ctx.fillStyle = c.bg;
    ctx.fillRect(0, 0, W, H);
    const L = (a, b, col, w, al, dash) => seg(pr(a), pr(b), col, w * lw, al, dash);
    if (sh.bgGrid) {
      for (let k = -5; k <= 5; k++) {
        L([k, -5, 0], [k, 5, 0], c.bgGrid, 1, 1);
        L([-5, k, 0], [5, k, 0], c.bgGrid, 1, 1);
      }
      [
        [1, 0, 0, 'x'],
        [0, 1, 0, 'y'],
        [0, 0, 1, 'z'],
      ].forEach((a) => {
        const e = a.slice(0, 3);
        L(sc(e, -6), sc(e, 6), c.axis, 1.2, 0.35);
        if (sh.labels) {
          const p = pr(sc(e, 6.6));
          txt(a[3], p[0], p[1], c.axis, 15, true, 0.6);
        }
      });
    }
    if (sh.lattice) {
      ctx.fillStyle = c.grid;
      ctx.globalAlpha = 0.85;
      for (let x = -2; x <= 2; x++)
        for (let y = -2; y <= 2; y++)
          for (let z = -2; z <= 2; z++) {
            const p = pr(ap(M, [x, y, z], 3));
            ctx.beginPath();
            ctx.arc(p[0], p[1], 2.3, 0, 7);
            ctx.fill();
          }
      ctx.globalAlpha = 1;
    }
    if (sh.grid) {
      for (let k = -4; k <= 4; k++) {
        if (!k) continue;
        L(ap(M, [k, -4, 0], 3), ap(M, [k, 4, 0], 3), c.grid, 1.3, 0.8);
        L(ap(M, [-4, k, 0], 3), ap(M, [4, k, 0], 3), c.grid, 1.3, 0.8);
      }
      [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ].forEach((e) => L(ap(M, sc(e, -5), 3), ap(M, sc(e, 5), 3), c.axis, 2, 0.85));
    }
    if (sh.span) {
      const ns = nullspace(M, 3, 1e-7);
      if (ns.rank === 2) {
        const a = nz(col(M, ns.piv[0], 3));
        let b = col(M, ns.piv[1], 3);
        b = nz(add(b, sc(a, -dot(a, b))));
        poly(
          [
            [1, 1],
            [1, -1],
            [-1, -1],
            [-1, 1],
          ].map(([s1, s2]) => pr(add(sc(a, 5 * s1), sc(b, 5 * s2)))),
          c.span,
          0.13,
          c.span,
          0.5,
          1.5
        );
      } else if (ns.rank === 1) {
        const u = nz(col(M, ns.piv[0], 3));
        L(sc(u, -8), sc(u, 8), c.span, 5, 0.55);
      }
    }
    if (sh.kernel) {
      if (K.ns.basis.length === 1) {
        const u = K.ns.basis[0];
        L(sc(u, -6), sc(u, 6), c.kernel, 2.2, 0.85, [8, 7]);
      } else if (K.ns.basis.length === 2) {
        const a = K.ns.basis[0];
        let b = K.ns.basis[1];
        b = nz(add(b, sc(a, -dot(a, b))));
        const pts = [
          [1, 1],
          [1, -1],
          [-1, -1],
          [-1, 1],
        ].map(([s1, s2]) => pr(add(sc(a, 4 * s1), sc(b, 4 * s2))));
        poly(pts, c.kernel, 0.08, null);
        ctx.setLineDash([8, 7]);
        poly(pts, c.kernel, 0, c.kernel, 0.8, 1.6);
        ctx.setLineDash([]);
      }
    }
    const F = S.d3.from,
      moved3 = !M.every((x, i) => Math.abs(x - F[i]) < 1e-9),
      O = pr([0, 0, 0]);
    if (sh.ghost && moved3) {
      if (sh.grid)
        for (let k = -4; k <= 4; k++) {
          L(ap(F, [k, -4, 0], 3), ap(F, [k, 4, 0], 3), c.grid, 1, 0.32, [5, 5]);
          L(ap(F, [-4, k, 0], 3), ap(F, [4, k, 0], 3), c.grid, 1, 0.32, [5, 5]);
        }
      if (sh.det) {
        const Vg = [];
        for (let b = 0; b < 8; b++) Vg.push(ap(F, [b & 1, (b >> 1) & 1, (b >> 2) & 1], 3));
        [
          [0, 1],
          [1, 3],
          [3, 2],
          [2, 0],
          [4, 5],
          [5, 7],
          [7, 6],
          [6, 4],
          [0, 4],
          [1, 5],
          [2, 6],
          [3, 7],
        ].forEach(([a, b]) => L(Vg[a], Vg[b], c.det, 1.4, 0.55, [6, 5]));
      }
      if (sh.basis)
        [c.i, c.j, c.k].forEach((cl, i) => {
          if (i < SH()[1]) arrow(O, pr(col(F, i, 3)), cl, 2.4 * lw, 0.38);
        });
      if (sh.vec) arrow(O, pr(ap(F, S.d3.v, 3)), c.vec, 2.2 * lw, 0.38);
    }
    if (sh.trails && moved3) {
      const trl = (a, b, cl, al = 0.8) => {
        L(a, b, cl, 1.6, al, [2, 5]);
        dotAt(pr(a), cl, al);
      };
      if (sh.grid)
        for (let x = -2; x <= 2; x++)
          for (let y = -2; y <= 2; y++) trl(ap(F, [x, y, 0], 3), ap(M, [x, y, 0], 3), c.grid, 0.45);
      if (sh.det) trl(ap(F, [1, 1, 1], 3), ap(M, [1, 1, 1], 3), c.det);
      if (sh.basis)
        [c.i, c.j, c.k].forEach((cl, i) => {
          if (i < SH()[1]) trl(col(F, i, 3), col(M, i, 3), cl);
        });
      if (sh.vec) trl(ap(F, S.d3.v, 3), ap(M, S.d3.v, 3), c.vec);
    }
    if (sh.det && SH()[1] === 2)
      poly(
        [
          [0, 0, 0],
          [1, 0, 0],
          [1, 1, 0],
          [0, 1, 0],
        ].map((p) => pr(ap(M, p, 3))),
        c.det,
        0.2,
        c.det,
        0.8,
        1.5 * lw
      );
    if (sh.det && SH()[1] === 3) {
      const V = [];
      for (let b = 0; b < 8; b++) V.push(pr(ap(M, [b & 1, (b >> 1) & 1, (b >> 2) & 1], 3)));
      const F = [
        [0, 1, 3, 2],
        [4, 5, 7, 6],
        [0, 1, 5, 4],
        [2, 3, 7, 6],
        [0, 2, 6, 4],
        [1, 3, 7, 5],
      ];
      F.map((f) => ({ f, z: f.reduce((s, i) => s + V[i][2], 0) / 4 }))
        .sort((a, b) => b.z - a.z)
        .forEach(({ f }) =>
          poly(
            f.map((i) => V[i]),
            c.det,
            0.17,
            c.det,
            0.75,
            1.5 * lw
          )
        );
      if (sh.labels && isSq() && !isSingular(M, 3)) {
        const p = pr(ap(M, [0.5, 0.5, 0.5], 3));
        txt('det = ' + fmt(det(M, 3)), p[0], p[1], c.det, 16, false);
      }
    }
    const o = pr([0, 0, 0]);
    if (sh.eigen)
      K.E.vecs.forEach((e) => {
        if (e.dim >= 3) return;
        L(sc(e.v, -6), sc(e.v, 6), c.eigen, 1.8, 0.7, [4, 6]);
        const t = pr(ap(M, e.v, 3));
        arrow(o, t, c.eigen, 2.6 * lw);
        if (sh.labels) tipLabel('λ = ' + fmt(e.l), o, t, c.eigen, true);
      });
    if (sh.vec) {
      const v = S.d3.v,
        Av = ap(M, v, 3),
        t = pr(Av);
      if (sh.decomp) {
        let acc = [0, 0, 0];
        [c.i, c.j, c.k].forEach((cl, i) => {
          const nx = add(acc, sc(col(M, i, 3), v[i]));
          arrow(pr(acc), pr(nx), cl, 2 * lw, 0.85);
          acc = nx;
        });
      }
      arrow(o, t, c.vec, 3.2 * lw);
      if (sh.labels) tipLabel('v', o, t, c.vec);
    }
    if (sh.basis) {
      [
        [0, c.i, 'î'],
        [1, c.j, 'ĵ'],
        [2, c.k, 'k̂'],
      ]
        .filter(([i]) => i < SH()[1])
        .forEach(([i, cl, nm]) => {
          const t = pr(col(M, i, 3));
          arrow(o, t, cl, 3.6 * lw);
          if (sh.labels) tipLabel(nm, o, t, cl);
        });
    }
  }
  const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);

  /* ---------- ввод на холсте ---------- */
  const ptrs = new Map();
  let drag = null;
  const pos = (e) => {
    const r = cv.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  function hit2(x, y, r) {
    const M = cur(),
      o = [];
    if (P.show.vec) o.push(['v', w2s(...ap(M, S.d2.v, 2))]);
    if (S.cob.on && isSq()) {
      o.push(['b1', w2s(...S.cob.b1)]);
      o.push(['b2', w2s(...S.cob.b2)]);
    }
    if (P.show.basis) {
      o.push(['i', w2s(...col(M, 0, 2))]);
      if (SH()[1] > 1) o.push(['j', w2s(...col(M, 1, 2))]);
    }
    let best = null,
      bd = r;
    o.forEach(([k, p]) => {
      const dd = Math.hypot(p[0] - x, p[1] - y);
      if (dd < bd) {
        bd = dd;
        best = k;
      }
    });
    return best;
  }
  function setScaleAt(mx, my, ns) {
    const V = S.V;
    ns = Math.max(4, Math.min(400, ns));
    const [wx, wy] = s2w(mx, my);
    V.scale = ns;
    V.ox = mx - W / 2 - wx * ns;
    V.oy = my - H / 2 + wy * ns;
    req();
  }
  cv.addEventListener('pointerdown', (e) => {
    cv.setPointerCapture(e.pointerId);
    const p = pos(e);
    ptrs.set(e.pointerId, p);
    if (ptrs.size === 2) {
      const [a, b] = [...ptrs.values()];
      setDrag({
        type: 'pinch',
        d0: Math.hypot(a.x - b.x, a.y - b.y) || 1,
        z0: S.mode === '2d' ? S.V.scale : S.cam.zoom,
      });
      return;
    }
    if (ptrs.size > 2) return;
    const h = S.mode === '2d' ? hit2(p.x, p.y, e.pointerType === 'touch' ? 28 : 16) : null;
    setDrag(h ? { type: h } : { type: S.mode === '2d' ? 'pan' : 'orbit', lx: p.x, ly: p.y });
    cv.style.cursor = 'grabbing';
  });
  cv.addEventListener('pointermove', (e) => {
    const p = pos(e);
    if (!ptrs.has(e.pointerId)) {
      if (S.mode === '2d') cv.style.cursor = hit2(p.x, p.y, 16) ? 'pointer' : 'grab';
      return;
    }
    ptrs.set(e.pointerId, p);
    if (!drag) return;
    if (drag.type === 'pinch') {
      if (ptrs.size < 2) return;
      const [a, b] = [...ptrs.values()],
        k = Math.hypot(a.x - b.x, a.y - b.y) / drag.d0;
      if (S.mode === '2d') setScaleAt((a.x + b.x) / 2, (a.y + b.y) / 2, drag.z0 * k);
      else {
        S.cam.zoom = Math.max(0.3, Math.min(5, drag.z0 * k));
        req();
      }
      return;
    }
    if (drag.type === 'pan') {
      S.V.ox += p.x - drag.lx;
      S.V.oy += p.y - drag.ly;
      drag.lx = p.x;
      drag.ly = p.y;
      req();
      return;
    }
    if (drag.type === 'orbit') {
      S.cam.yaw += (p.x - drag.lx) * 0.008;
      S.cam.pitch = Math.max(-1.5, Math.min(1.5, S.cam.pitch + (p.y - drag.ly) * 0.008));
      drag.lx = p.x;
      drag.ly = p.y;
      req();
      return;
    }
    dragTo(drag.type, p.x, p.y);
  });
  function setDrag(v) {
    drag = v;
    pub('gesture', v ? v.type : 'none');
  }
  function endGesture() {
    setDrag(null);
  }
  function endPtr(e) {
    ptrs.delete(e.pointerId);
    if (drag && drag.type === 'pinch' && ptrs.size === 1) {
      const [q] = [...ptrs.values()];
      setDrag({ type: S.mode === '2d' ? 'pan' : 'orbit', lx: q.x, ly: q.y });
    }
    if (!ptrs.size) {
      setDrag(null);
      cv.style.cursor = 'grab';
    }
  }
  cv.addEventListener('pointerup', endPtr);
  cv.addEventListener('pointercancel', endPtr);
  cv.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      const k = Math.exp(-e.deltaY * 0.0015),
        p = pos(e);
      if (S.mode === '2d') setScaleAt(p.x, p.y, S.V.scale * k);
      else {
        S.cam.zoom = Math.max(0.3, Math.min(5, S.cam.zoom * k));
        req();
      }
    },
    { passive: false }
  );
  function dragTo(type, X, Y) {
    const d = S.d2;
    let p = s2w(X, Y);
    if (P.show.snap) p = p.map((z) => Math.round(z * 2) / 2);
    if (type === 'b1' || type === 'b2') {
      S.cob[type] = p;
      renderCob();
      req();
      return;
    }
    if (type === 'i' || type === 'j') {
      if (S.anim || nextT || d.t < 1 || !eqM(d.from, baseM())) {
        d.to = cur();
        d.from = baseM();
        d.t = 1;
        stopAnim();
      }
      if (type === 'i') {
        d.to[0] = p[0];
        d.to[2] = p[1];
      } else {
        d.to[1] = p[0];
        d.to[3] = p[1];
      }
      d.to = maskM(d.to);
      d.hist = ['custom'];
      changed();
    } else if (type === 'v') {
      const M = cur(),
        iv = inv(M, 2);
      if (!iv) return;
      d.v = ap(iv, p, 2).map((x) => Math.round(x * 1000) / 1000);
      changed();
    }
  }
  $('#zIn').onclick = () => {
    if (S.mode === '2d') setScaleAt(W / 2, H / 2, S.V.scale * 1.25);
    else {
      S.cam.zoom = Math.min(5, S.cam.zoom * 1.25);
      req();
    }
  };
  $('#zOut').onclick = () => {
    if (S.mode === '2d') setScaleAt(W / 2, H / 2, S.V.scale / 1.25);
    else {
      S.cam.zoom = Math.max(0.3, S.cam.zoom / 1.25);
      req();
    }
  };
  $('#zHome').onclick = () => {
    S.V = { scale: Math.max(30, Math.min(80, Math.min(W, H) / 8)), ox: 0, oy: 0 };
    S.cam = { yaw: -2.3, pitch: 0.5, zoom: 1 };
    req();
  };

  /* ---------- панели ---------- */

  function buildMatrixInputs() {
    const n = N(),
      [rr, cc] = SH(),
      box = $('#matIn');
    box.style.gridTemplateColumns = `repeat(${cc},auto)`;
    box.innerHTML = '';
    for (let i = 0; i < n * n; i++) {
      if (Math.floor(i / n) >= rr || i % n >= cc) continue;
      const inp = document.createElement('input');
      inp.type = 'text';
      inp.inputMode = 'decimal';
      inp.dataset.i = i;
      inp.dataset.c = i % n;
      inp.setAttribute('aria-label', T().cell(Math.floor(i / n) + 1, (i % n) + 1));
      inp.addEventListener('input', () => {
        const v = parseFloat(inp.value.replace(',', '.').replace('−', '-'));
        if (!isFinite(v)) return;
        const d = D();
        const M = d.to.slice();
        M[i] = v;
        setMatrix(M);
      });
      inp.addEventListener('blur', syncInputs);
      box.appendChild(inp);
    }
  }
  /* поле ввода: «редактируется», только пока его текст и есть текущее значение; иначе — перезаписать (иначе фокус = вечно устаревшее число) */
  const editing = (inp, x) =>
    document.activeElement === inp && parseFloat(inp.value.replace(',', '.').replace('−', '-')) === x;
  const putNum = (inp, x) => {
    if (!editing(inp, x)) inp.value = fmt(x, 3).replace('−', '-');
  };
  function syncInputs() {
    const d = D();
    document.querySelectorAll('#matIn input').forEach((inp) => putNum(inp, d.to[+inp.dataset.i]));
    document.querySelectorAll('#vIn input').forEach((inp) => putNum(inp, d.v[+inp.dataset.v]));
  }
  function buildPresets() {
    const box = $('#pre');
    box.innerHTML = '';
    PRE[shapeKey()].forEach(([name, M]) => {
      const b = document.createElement('button');
      b.className = 'chip';
      b.textContent = nm(name);
      b.onclick = () => animateTo(M || randShape(), name);
      box.appendChild(b);
    });
  }
  function buildVecInputs() {
    const n = SH()[1],
      box = $('#vIn');
    box.innerHTML = '';
    ['x', 'y', 'z'].slice(0, n).forEach((nm, i) => {
      const l = document.createElement('label');
      l.innerHTML = `${nm}<input type="text" inputmode="decimal" data-v="${i}" aria-label="${T().coord(nm)}">`;
      const inp = l.querySelector('input');
      inp.addEventListener('input', () => {
        const v = parseFloat(inp.value.replace(',', '.').replace('−', '-'));
        if (!isFinite(v)) return;
        D().v[i] = v;
        if (!P.show.vec) {
          P.show.vec = true;
          syncToggles();
          save();
        }
        changed();
      });
      inp.addEventListener('blur', syncInputs);
      box.appendChild(l);
    });
  }
  const TOG = [
    ['bgGrid'],
    ['grid'],
    ['basis'],
    ['det'],
    ['eigen'],
    ['span'],
    ['kernel'],
    ['vec'],
    ['decomp'],
    ['labels'],
    ['coords', '2d'],
    ['snap', '2d'],
    ['lattice', '3d'],
    ['ghost'],
    ['trails'],
    ['hints'],
  ];
  function buildToggles() {
    const box = $('#tog');
    box.innerHTML = '';
    TOG.forEach(([k, m]) => {
      const lab = T().tog[k];
      const l = document.createElement('label');
      l.className = 'chk' + (m === '2d' ? ' d2only' : m === '3d' ? ' d3only' : '');
      l.innerHTML = `<input type="checkbox" data-k="${k}"> ${lab}`;
      l.querySelector('input').onchange = (e) => {
        P.show[k] = e.target.checked;
        if (k === 'decomp' && P.show.decomp) P.show.vec = true;
        syncToggles();
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

  function miniMat(M, n) {
    return `<span class="mini" style="grid-template-columns:repeat(${n},auto)">${M.map((x) => `<span>${fmt(x)}</span>`).join('')}</span>`;
  }
  function polyStr(co) {
    const n = co.length - 1;
    let s = '';
    co.forEach((a, i) => {
      const p = n - i;
      if (i > 0 && Math.abs(a) < 1e-9) return;
      const abs = Math.abs(a),
        coef = p > 0 && Math.abs(abs - 1) < 1e-9 ? '' : fmt(abs),
        pw = p === 0 ? '' : p === 1 ? 'λ' : 'λ' + (p === 2 ? '²' : '³');
      s += i === 0 ? (a < 0 ? '−' : '') + coef + pw : (a < 0 ? ' − ' : ' + ') + coef + pw;
    });
    return s + ' = 0';
  }
  function rootsStr(roots) {
    const out = [];
    roots.forEach((r) => {
      if (r.im === 0) out.push(fmt(r.re));
      else if (r.im > 0) out.push(`${fmt(r.re)} ± ${fmt(r.im)}i`);
    });
    return out.join(',  ');
  }
  function renderPropsNS() {
    const L = T(),
      [m, n] = SH(),
      K = S.K,
      rk = K.ns.rank,
      kd = K.ns.basis.length,
      Rn = (k) => (k === 1 ? 'ℝ' : 'ℝ' + (k === 2 ? '²' : '³'));
    const img = m === 1 ? L.img1[rk] : L.img(m)[rk],
      ker = kd === 0 ? L.ker[0] : kd === n ? (n === 1 ? L.img1[1] : L.img(n)[n]) : L.ker[kd];
    const row = (k, term, v, s = '') =>
      `<div class="prop"><span class="k">${k}<button class="q" data-term="${term}">?</button></span><span class="v">${v}</span>${s ? `<span class="s">${s}</span>` : ''}</div>`;
    $('#props').innerHTML =
      row(L.r_size, 'nonsquare', `${m}×${n}`, `${Rn(n)} → ${Rn(m)}`) +
      row(L.r_rank, 'rank', rk, L.rankNote(img, ker)) +
      row(L.r_rn, 'kernel', `${kd} + ${rk} = ${n}`, L.rnNote) +
      `<p class="note">${L.nsqNote}</p>`;
  }
  function renderProps() {
    if (!isSq()) {
      renderPropsNS();
      return;
    }
    const d = D(),
      n = N(),
      A = d.to,
      K = S.K,
      dt = K.det,
      z = isSingular(A, n),
      L = T();
    const detNote = z ? L.detCol(n) : dt < 0 ? L.detNeg(n, fmt(-dt)) : L.detPos(n, fmt(dt));
    const rk = K.ns.rank,
      img = L.img(n)[rk],
      kdim = n - rk,
      ker = kdim === n ? L.img(n)[n] : L.ker[kdim];
    const vecs = K.E.vecs.length
      ? K.E.vecs.some((e) => e.dim === n)
        ? L.anyVec
        : K.E.vecs
            .map(
              (e) =>
                `<div><span class="sw" style="background:var(--s-eigen)"></span>λ = ${fmt(e.l)}: (${e.v.map((x) => fmt(x)).join(', ')})</div>`
            )
            .join('')
      : L.noReal;
    const co = n === 2 ? [1, -K.tr, dt] : [1, -K.tr, K.c2, -dt];
    const iv = inv(A, n);
    const row = (k, term, v, s = '') =>
      `<div class="prop"><span class="k">${k}<button class="q" data-term="${term}">?</button></span><span class="v">${v}</span>${s ? `<span class="s">${s}</span>` : ''}</div>`;
    $('#props').innerHTML =
      row(L.r_det, 'det', `<span class="sw" style="background:var(--s-det)"></span>${fmt(dt, 3)}`, detNote) +
      row(L.r_tr, 'trace', fmt(K.tr, 3), L.traceNote) +
      row(L.r_rank, 'rank', rk, L.rankNote(img, ker)) +
      row(L.r_ev, 'eigen', rootsStr(K.E.roots), K.E.roots.some((r) => r.im) ? L.complexNote : '') +
      row(L.r_evec, 'eigen', '', vecs) +
      row(L.r_cp, 'charpoly', '', polyStr(co)) +
      row(L.r_inv, 'inverse', iv ? miniMat(iv, n) : L.none, '');
  }
  function renderCr() {
    if (S.mode !== '2d' || !S.K) return;
    if (!isSq()) {
      $('#crOut').innerHTML = '';
      $('#crCtl').hidden = true;
      return;
    }
    const L = T(),
      A = S.d2.to,
      v = S.d2.v,
      b = ap(A, v, 2),
      dA = det(A, 2);
    let h = '';
    if (isSingular(A, 2)) h = `<p class="note">${L.vSing}</p>`;
    else if (S.cr) {
      const A1 = [b[0], A[1], b[1], A[3]],
        A2 = [A[0], b[0], A[2], b[1]],
        Ai = S.cr === 1 ? A1 : A2;
      h = `<div class="crm"><i>x</i>${S.cr === 1 ? '₁' : '₂'} = det ${miniMat(Ai, 2)} / det <i>A</i> = ${fmt(det(Ai, 2))} / ${fmt(dA)} = <b>${fmt(v[S.cr - 1])}</b></div><p class="note">${L.crEx(S.cr)}</p>`;
    }
    $('#crOut').innerHTML = h;
    $('#crCtl').hidden = isSingular(A, 2);
  }
  function renderVec() {
    renderCr();
    const d = D(),
      n = N(),
      [rr, cc] = SH(),
      Av = ap(d.to, d.v, n).slice(0, rr),
      vv = d.v.slice(0, cc),
      nm = ['î', 'ĵ', '<span class="kh">k</span>'];
    $('#vOut').innerHTML = `<i>A</i>·<i>v</i> = (${Av.map((x) => fmt(x)).join(', ')})`;
    $('#vEq').innerHTML = `= ${vv.map((x, i) => `${fmt(x)}·(<i>A</i>${nm[i]})`).join(' + ')}: ${T().vecEq}`;
  }
  function renderHist() {
    const d = D(),
      h = d.hist,
      L = T();
    $('#hist').innerHTML = !h.length
      ? ''
      : h.length === 1
        ? `${L.now} <b>${nm(h[0])}</b>`
        : `${L.now} <b>${h.slice().reverse().map(nm).join(' · ')}</b><br>${L.rtl(nm(h[0]))}`;
  }
  function renderCaption() {
    const cap = $('#cap');
    $('#capOpen').hidden = !!P.show.hints;
    if (!P.show.hints) {
      cap.hidden = true;
      return;
    }
    cap.hidden = false;
    const d = D(),
      n = N(),
      A = d.to,
      K = S.K,
      dt = K.det,
      C = T().cap;
    let t;
    if (!isSq()) t = C.nsq(SH(), K.ns.rank, K.ns.basis.length);
    else if (isI(A, n)) t = C.id(n);
    else if (K.ns.rank === 0) t = C.zero;
    else if (isSingular(A, n)) t = C.sing(n, K.ns.rank);
    else if (n === 2 && K.E.roots.some((r) => r.im)) t = C.complex(fmt(dt));
    else if (dt < 0) t = C.neg(n, fmt(dt), fmt(-dt));
    else t = C.pos(n, fmt(dt)) + (K.E.vecs.length && !K.E.vecs.some((e) => e.dim === n) ? C.eig : '');
    $('#capT').textContent = t;
  }
  function renderOverlay() {
    const n = N(),
      [rr, cc] = SH(),
      M = cur(),
      cl = ['var(--s-i)', 'var(--s-j)', 'var(--s-k)'];
    $('#ov').innerHTML =
      `<span class="bm" style="grid-template-columns:repeat(${cc},auto)">${M.map((x, i) => (Math.floor(i / n) < rr && i % n < cc ? `<span style="color:${cl[i % n]}">${fmt(x)}</span>` : '')).join('')}</span>${D().t < 1 ? `<span class="tt">t = ${fmt(D().t)}</span>` : ''}`;
  }
  function changed() {
    const d = D(),
      n = N(),
      A = d.to;
    pub('mode', S.mode);
    pub('shape', SH().join('x'));
    const sq = isSq(),
      inD = SH()[1];
    let ns = nullspace(A, n, 1e-9);
    if (!sq)
      ns = {
        rank: ns.rank,
        piv: ns.piv,
        basis: ns.basis.filter((v) => v.every((x, j) => j < inD || Math.abs(x) < 1e-9)),
      };
    S.K = {
      det: sq ? det(A, n) : NaN,
      tr: sq ? tr(A, n) : NaN,
      c2:
        sq && n === 3
          ? A[0] * A[4] - A[1] * A[3] + (A[0] * A[8] - A[2] * A[6]) + (A[4] * A[8] - A[5] * A[7])
          : 0,
      ns,
      E: sq ? eigen(A, n) : { roots: [], vecs: [] },
    };
    $('#bT').disabled = !sq;
    $('#bInv').disabled = !sq;
    $('#compose').disabled = !sq;
    renderProps();
    syncInputs();
    renderVec();
    renderHist();
    renderTex();
    renderCob();
    if (!S.anim) renderCaption();
    $('#tR').value = Math.round(d.t * 1000);
    $('#tOut').textContent = fmt(d.t);
    req();
  }
  const MUL = {
    '2d': { A: [1, 1, 0, 1], B: [0, -1, 1, 0] },
    '3d': { A: [1, 0, 1, 0, 1, 0, 0, 0, 1], B: [0, -1, 0, 1, 0, 0, 0, 0, 1] },
  };
  const SUB = '₀₁₂₃₄₅₆₇₈₉';
  function buildMul() {
    const n = N(),
      m = MUL[S.mode];
    ['A', 'B'].forEach((k) => {
      const box = $('#mul' + k);
      box.style.gridTemplateColumns = `repeat(${n},auto)`;
      box.innerHTML = '';
      for (let i = 0; i < n * n; i++) {
        const inp = document.createElement('input');
        inp.type = 'text';
        inp.inputMode = 'decimal';
        inp.dataset.c = i % n;
        inp.value = fmt(m[k][i], 3).replace('−', '-');
        inp.setAttribute('aria-label', k + ' ' + T().cell(Math.floor(i / n) + 1, (i % n) + 1));
        inp.addEventListener('input', () => {
          const v = parseFloat(inp.value.replace(',', '.').replace('−', '-'));
          if (!isFinite(v)) return;
          m[k][i] = v;
          renderMul();
        });
        inp.addEventListener('blur', () => {
          inp.value = fmt(m[k][i], 3).replace('−', '-');
        });
        box.appendChild(inp);
      }
    });
    renderMul();
  }
  function renderMul() {
    const n = N(),
      m = MUL[S.mode],
      A = m.A,
      B = m.B,
      C = mul(A, B, n),
      BA = mul(B, A, n),
      L = T(),
      same = C.every((x, i) => Math.abs(x - BA[i]) < 1e-9);
    $('#mulC').innerHTML = miniMat(C, n);
    const p = (x) => (x < 0 ? `(${fmt(x)})` : fmt(x));
    $('#mulInfo').innerHTML =
      (same ? L.mulComm : `${L.mulNon} ${miniMat(BA, n)}`) +
      `<br>${L.mulDet}: ${fmt(det(A, n))} · ${fmt(det(B, n))} = ${fmt(det(C, n))}`;
    const rows = [];
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++) {
        const terms = [];
        for (let k = 0; k < n; k++) terms.push(`${p(A[i * n + k])}·${p(B[k * n + j])}`);
        rows.push(`<i>c</i>${SUB[i + 1]}${SUB[j + 1]} = ${terms.join(' + ')} = <b>${fmt(C[i * n + j])}</b>`);
      }
    $('#mulSteps').innerHTML = rows.join('<br>');
  }
  const pnum = (v) => parseFloat(String(v).replace(',', '.').replace('−', '-'));
  function renderCob() {
    if (S.mode !== '2d' || !S.K) return;
    if (!isSq()) {
      $('#cbOut').innerHTML = `<p class="note">${T().cbSq}</p>`;
      return;
    }
    const L = T(),
      b1 = S.cob.b1,
      b2 = S.cob.b2,
      Pm = [b1[0], b2[0], b1[1], b2[1]],
      dP = det(Pm, 2),
      d = S.d2;
    let h = `<i>P</i> = [b₁ b₂] = ${miniMat(Pm, 2)}, det <i>P</i> = ${fmt(dP)}`;
    if (isSingular(Pm, 2)) h += `<p class="note">${L.cbBad}</p>`;
    else {
      const A2 = mul(mul(inv(Pm, 2), d.to, 2), Pm, 2),
        dg = Math.abs(A2[1]) < 1e-9 && Math.abs(A2[2]) < 1e-9;
      h +=
        `<div class="crm">${L.cbA} <i>P</i>⁻¹<i>AP</i> = ${miniMat(A2, 2)}</div>` +
        (dg ? `<p class="note">${L.cbDiag}</p>` : '');
    }
    $('#cbOut').innerHTML = h;
    document.querySelectorAll('[data-cb]').forEach((inp) => {
      const [k, i] = inp.dataset.cb.split(':');
      putNum(inp, S.cob[k][+i]);
    });
  }
  function syncTools() {
    $('#cbOn').checked = S.cob.on;
    document.querySelectorAll('#slCr button').forEach((b) => setOn(b, +b.dataset.cr === S.cr));
    renderVec();
    renderCob();
    req();
  }

  $('#cbOn').onchange = (e) => {
    S.cob.on = e.target.checked;
    renderCob();
    req();
  };
  document.querySelectorAll('#slCr button').forEach(
    (b) =>
      (b.onclick = () => {
        S.cr = +b.dataset.cr;
        if (S.cr && !P.show.vec) {
          P.show.vec = true;
          syncToggles();
          save();
        }
        syncTools();
      })
  );
  document.querySelectorAll('[data-cb]').forEach((inp) => {
    inp.oninput = () => {
      const v = pnum(inp.value);
      if (!isFinite(v)) return;
      const [k, i] = inp.dataset.cb.split(':');
      S.cob[k][+i] = v;
      renderCob();
      req();
    };
    inp.onblur = renderCob;
  });
  document.querySelectorAll('[data-go2d]').forEach((b) => (b.onclick = () => setMode('2d')));
  $('#cbStd').onclick = () => {
    S.cob.b1 = [1, 0];
    S.cob.b2 = [0, 1];
    S.cob.on = true;
    syncTools();
  };
  $('#cbEig').onclick = () => {
    const E = eigen(S.d2.to, 2),
      vs = E.vecs.filter((e) => e.dim < 2);
    const nice = (u) => {
      const m = Math.max(Math.abs(u[0]), Math.abs(u[1]));
      let w = u.map((x) => x / m);
      if (w[0] < -1e-9 || (Math.abs(w[0]) < 1e-9 && w[1] < 0)) w = w.map((x) => -x);
      return w.map((x) => Math.round(x * 1000) / 1000);
    };
    if (E.vecs.some((e) => e.dim === 2)) {
      S.cob.b1 = [1, 0];
      S.cob.b2 = [0, 1];
    } else if (vs.length >= 2) {
      S.cob.b1 = nice(vs[0].v);
      S.cob.b2 = nice(vs[1].v);
    } else {
      toast(T().cbNoEig);
      return;
    }
    S.cob.on = true;
    syncTools();
  };
  $('#cbTo').onclick = () => {
    const b1 = S.cob.b1,
      b2 = S.cob.b2,
      Pm = [b1[0], b2[0], b1[1], b2[1]],
      Pi = inv(Pm, 2);
    if (!Pi) {
      toast(T().cbBad);
      return;
    }
    setMatrix(mul(mul(Pi, S.d2.to, 2), Pm, 2), 'A′');
  };
  $('#mulSwap').onclick = () => {
    const m = MUL[S.mode];
    [m.A, m.B] = [m.B, m.A];
    buildMul();
  };
  $('#mulTake').onclick = () => {
    MUL[S.mode].A = D().to.slice();
    buildMul();
  };
  $('#mulTo').onclick = () => {
    const m = MUL[S.mode];
    setMatrix(mul(m.A, m.B, N()), 'A·B');
  };
  $('#mulPlay').onclick = () => {
    const m = MUL[S.mode],
      A = m.A.slice(),
      B = m.B.slice();
    animateTo(B, 'B', { compose: false, then: () => animateTo(A, 'A', { compose: true }) });
  };
  function buildShapeSeg() {
    const opts =
        S.mode === '2d'
          ? [
              [2, 2],
              [2, 1],
              [1, 2],
            ]
          : [
              [3, 3],
              [3, 2],
              [2, 3],
            ],
      box = $('#shapeSeg');
    box.innerHTML = '';
    opts.forEach(([r, c]) => {
      const b = document.createElement('button');
      b.textContent = `${r}×${c}`;
      setOn(b, SH()[0] === r && SH()[1] === c);
      b.onclick = () => setShape(r, c);
      box.appendChild(b);
    });
  }
  function setShape(r, c, force) {
    const d = D();
    if (!force && d.shape[0] === r && d.shape[1] === c) return;
    d.shape = [r, c];
    stopAnim();
    S.cr = 0;
    d.v = d.v.map((x, i) => (i < c ? x : 0));
    d.from = baseM();
    d.to = baseM();
    d.t = 1;
    d.hist = [];
    buildShapeSeg();
    buildMatrixInputs();
    buildPresets();
    buildVecInputs();
    const p = PRE[shapeKey()][0];
    animateTo(p[1], p[0], { compose: false });
    renderCaption();
  }
  function setMode(m) {
    stopAnim();
    endGesture();
    S.mode = m;
    document.body.classList.toggle('m3', m === '3d');
    document.querySelectorAll('#modeSeg button').forEach((b) => setOn(b, b.dataset.mode === m));
    buildShapeSeg();
    buildMatrixInputs();
    buildPresets();
    buildVecInputs();
    buildMul();
    changed();
  }

  /* ---------- кнопки ---------- */
  document.querySelectorAll('#modeSeg button').forEach((b) => (b.onclick = () => setMode(b.dataset.mode)));
  $('#bT').onclick = () => {
    const d = D(),
      n = N();
    d.from = cur();
    d.to = transpose(d.to, n);
    d.hist = [(d.hist.length === 1 ? d.hist[0] : 'A') + 'ᵀ'];
    play();
  };
  $('#bInv').onclick = () => {
    const d = D(),
      n = N(),
      iv = inv(d.to, n);
    if (!iv) {
      toast(T().invErr, 2600);
      return;
    }
    d.from = cur();
    d.to = I(n);
    d.hist.push('A⁻¹');
    play();
  };
  $('#bI').onclick = () => {
    const d = D();
    d.from = cur();
    d.to = baseM();
    d.hist = [];
    play();
  };
  $('#compose').onchange = (e) => {
    S.compose = e.target.checked;
  };
  $('#bPlay').onclick = () => play();
  $('#bZero').onclick = () => {
    stopAnim();
    D().t = 0;
    changed();
  };
  $('#bOne').onclick = () => {
    stopAnim();
    D().t = 1;
    changed();
  };
  $('#tR').oninput = (e) => {
    stopAnim();
    D().t = e.target.value / 1000;
    $('#tOut').textContent = fmt(D().t);
    if (S.cob.on) renderCob();
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
  document.addEventListener('click', (e) => {
    const q = e.target.closest('[data-term]');
    if (q) {
      e.preventDefault();
      e.stopPropagation();
      openTerm(q.dataset.term);
    }
  });

  /* ---------- справочник ---------- */

  const sh = (k, v = true) => {
    P.show[k] = v;
  };
  const go2 = () => {
    if (S.mode !== '2d') setMode('2d');
  };

  const SUBM = { ᵢ: 'i', ⱼ: 'j', ₖ: 'k', ₙ: 'n', ₘ: 'm' };
  const mathify = (h) =>
    h
      .replace(
        /[ᵢⱼₖₙₘ₀₁₂₃₄₅₆₇₈₉]*[ᵢⱼₖₙₘ][ᵢⱼₖₙₘ₀₁₂₃₄₅₆₇₈₉]*/g,
        (m) => `<sub>${[...m].map((c) => SUBM[c] || String('₀₁₂₃₄₅₆₇₈₉'.indexOf(c))).join('')}</sub>`
      )
      .replace(/\{\{([^}]+)\}\}/g, (m, b) => {
        const rows = b.split(';').map((r) => r.split(',').map((x) => x.trim()));
        return `<span class="mini mm" style="grid-template-columns:repeat(${rows[0].length},auto)">${rows
          .flat()
          .map((x) => `<span>${x}</span>`)
          .join('')}</span>`;
      });

  const DEMOS = {
    vector: () => {
      go2();
      sh('vec');
      sh('decomp', false);
      S.d2.v = [3, 2];
      setMatrix(I(2), 'I');
    },
    lincomb: () => {
      go2();
      sh('vec');
      sh('decomp');
      S.d2.v = [3, 2];
      setMatrix(I(2), 'I');
    },
    basis: () => {
      go2();
      sh('vec');
      sh('decomp');
      S.d2.v = [1, 1];
      animateTo([2, -1, 1, 1], 'newbasis', { compose: false });
    },
    span: () => {
      go2();
      sh('span');
      sh('kernel', false);
      animateTo([1, 2, 0.5, 1], 'dep', { compose: false });
    },
    dependence: () => {
      go2();
      sh('span');
      animateTo([1, 2, 0.5, 1], 'dep', { compose: false });
    },
    transform: () => {
      go2();
      animateTo([1, 1, 0, 1], 'shear', { compose: false });
    },
    matrix: () => {
      go2();
      sh('vec');
      sh('decomp');
      S.d2.v = [2, 1];
      animateTo([1, -1, 1, 2], 'A', { compose: false });
    },
    composition: () => {
      go2();
      animateTo(rot2(Math.PI / 2), 'rot90', {
        compose: false,
        then: () => animateTo([1, 1, 0, 1], 'shear', { compose: true }),
      });
    },
    det: () => {
      go2();
      sh('det');
      animateTo([3, 0, 0, 2], 'stretch', { compose: false });
    },
    volume: () => {
      if (S.mode !== '3d') setMode('3d');
      sh('det');
      animateTo([2, 0, 0, 0, 1, 0, 0, 0, 1.5], 'stretch', { compose: false });
    },
    inverse: () => {
      go2();
      const A = [2, 1, 1, 1];
      animateTo(A, 'A', {
        compose: false,
        then: () => {
          const d = S.d2;
          d.from = d.to.slice();
          d.to = I(2);
          d.hist.push('A⁻¹');
          play();
        },
      });
    },
    rank: () => {
      go2();
      sh('span');
      animateTo([1, 0, 0, 0], 'proj', { compose: false });
    },
    colspace: () => {
      go2();
      sh('span');
      animateTo([1, 2, 0.5, 1], 'singular', { compose: false });
    },
    kernel: () => {
      go2();
      sh('kernel');
      sh('vec');
      sh('decomp', false);
      S.d2.v = [-2, 1];
      animateTo([1, 2, 0.5, 1], 'singular', { compose: false });
    },
    eigen: () => {
      go2();
      sh('eigen');
      animateTo([3, 1, 0, 2], 'eig', { compose: false });
    },
    charpoly: () => {
      go2();
      sh('eigen');
      animateTo([3, 1, 0, 2], 'eig', { compose: false });
    },
    trace: () => {
      go2();
      sh('eigen');
      animateTo([3, 1, 0, 2], 'eig', { compose: false });
    },
    cramer: () => {
      go2();
      sh('vec');
      sh('decomp', false);
      syncToggles();
      S.d2.v = [2, 1];
      S.cr = 1;
      syncTools();
      showPanel('vector');
      animateTo([2, 1, 1, 3], 'A', { compose: false });
    },
    changebasis: () => {
      go2();
      S.cob.on = true;
      setMatrix([3, 1, 0, 2], 'eig');
      S.cob.b1 = [1, 0];
      S.cob.b2 = [-1, 1];
      syncTools();
      showPanel('cob');
    },
    nonsquare: () => {
      if (S.mode !== '3d') setMode('3d');
      setShape(3, 2, true);
    },
    orthogonal: () => {
      go2();
      animateTo(rot2(Math.PI / 6), 'rot30', { compose: false });
    },
    complexeig: () => {
      go2();
      sh('eigen');
      animateTo([1, -1, 1, 1], 'spiral', { compose: false });
    },
    symmetric: () => {
      go2();
      sh('eigen');
      animateTo([2, 1, 1, 2], 'A', { compose: false });
    },
    systems: () => {
      go2();
      sh('vec');
      sh('decomp', false);
      syncToggles();
      S.d2.v = [2, 1];
      S.cr = 0;
      syncTools();
      showPanel('vector');
      animateTo([1, 1, 1, -1], 'A', { compose: false });
    },
    transpose: () => {
      go2();
      sh('eigen');
      animateTo([1, 2, 0, 1], 'A', { compose: false, then: () => $('#bT').click() });
    },
    identity: () => {
      go2();
      const d = S.d2;
      d.from = cur();
      d.to = I(2);
      d.hist = [];
      play();
    },
  };
  const gloss = createGlossary({
    prefs: () => P,
    save,
    T,
    content: { TERMS, FORMAL, ILL, CHAP, REL, DEMOS },
    // демо ЛА: сначала синхронизировать слои и сохранить, потом сыграть сцену
    onDemo: (id) => {
      syncToggles();
      save();
      DEMOS[id]();
    },
    illSvg,
    mathify,
  });
  const { termTitle, renderGloss, rerenderGloss, openTerm } = gloss;
  gloss.init();
  initDrawers();
  initHome();

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
    let out = '';
    const line = (x1, y1, x2, y2, col, w = 1.5, op = 1, dash) =>
      `<line x1="${F(x1)}" y1="${F(y1)}" x2="${F(x2)}" y2="${F(y2)}" stroke="${c(col)}" stroke-width="${w}" stroke-opacity="${op}"${dash ? ' stroke-dasharray="4 3"' : ''}/>`;
    const arr = (x1, y1, x2, y2, col, w = 2.2, op = 1, dash) => {
      const dx = x2 - x1,
        dy = y2 - y1,
        L = Math.hypot(dx, dy);
      if (L < 1) return '';
      const ux = dx / L,
        uy = dy / L,
        h = Math.min(8, L * 0.45),
        hw = h * 0.55;
      return (
        line(x1, y1, x2 - ux * h * 0.8, y2 - uy * h * 0.8, col, w, op, dash) +
        `<polygon points="${F(x2)},${F(y2)} ${F(x2 - ux * h - uy * hw)},${F(y2 - uy * h + ux * hw)} ${F(x2 - ux * h + uy * hw)},${F(y2 - uy * h - ux * hw)}" fill="${c(col)}" fill-opacity="${op}"/>`
      );
    };
    const tx = (x, y, t, col, sz = 12) => {
      const hat = t.includes('\u0302'),
        tt = t.split('\u0302').join('');
      return (
        `<text x="${F(x)}" y="${F(y)}" fill="${c(col)}" font-size="${sz}" font-style="italic" font-family="'Source Serif 4',Georgia,serif" text-anchor="middle" dominant-baseline="middle" paint-order="stroke" stroke="var(--s-bg)" stroke-width="3" stroke-linejoin="round">${tt}</text>` +
        (hat
          ? `<path d="M${F(x + sz * 0.08 - sz * 0.17)} ${F(y - sz * 0.5)} L${F(x + sz * 0.08)} ${F(y - sz * 0.66)} L${F(x + sz * 0.08 + sz * 0.17)} ${F(y - sz * 0.5)}" fill="none" stroke="${c(col)}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>`
          : '')
      );
    };
    const lab = (x0, y0, x1, y1, t, col) => {
      const dx = x1 - x0,
        dy = y1 - y0,
        L = Math.hypot(dx, dy) || 1;
      return tx(x1 + (dx / L) * 12, y1 + (dy / L) * 12, t, col);
    };
    const P3 = (x, y, z) => [X(x + y * 0.55), Y(z + y * 0.4)];
    const pts = (a) => a.map((p) => F(X(p[0])) + ',' + F(Y(p[1]))).join(' ');
    for (const it of sp.it) {
      const k = it[0],
        a = it.slice(1);
      if (k === 'grid') {
        for (let i = -12; i <= 12; i++) {
          out += line(X(i), 0, X(i), H, 'bgGrid', 1) + line(0, Y(i), W, Y(i), 'bgGrid', 1);
        }
        out += line(0, Y(0), W, Y(0), 'axis', 1, 0.35) + line(X(0), 0, X(0), H, 'axis', 1, 0.35);
      } else if (k === 'tg') {
        const [M, col = 'grid', op = 0.75] = a;
        for (let i = -10; i <= 10; i++) {
          const p = ap(M, [i, -10], 2),
            q = ap(M, [i, 10], 2),
            r = ap(M, [-10, i], 2),
            t = ap(M, [10, i], 2);
          const cc = i ? col : 'axis',
            w = i ? 1 : 1.4,
            oo = i ? op : 0.85;
          out +=
            line(X(p[0]), Y(p[1]), X(q[0]), Y(q[1]), cc, w, oo) +
            line(X(r[0]), Y(r[1]), X(t[0]), Y(t[1]), cc, w, oo);
        }
      } else if (k === 'l') {
        const [dx, dy, col, dash, w = 2, op = 0.8] = a;
        out += line(X(-30 * dx), Y(-30 * dy), X(30 * dx), Y(30 * dy), col, w, op, dash);
      } else if (k === 'L') {
        const [px, py, dx, dy, col, dash, w = 2, op = 0.85] = a;
        out += line(X(px - 30 * dx), Y(py - 30 * dy), X(px + 30 * dx), Y(py + 30 * dy), col, w, op, dash);
      } else if (k === 'seg') {
        const [p, q, col, dash, w = 1.5, op = 0.8] = a;
        out += line(X(p[0]), Y(p[1]), X(q[0]), Y(q[1]), col, w, op, dash);
      } else if (k === 'v') {
        const [x, y, col, t, x0 = 0, y0 = 0, dash, op = 1] = a;
        out += arr(X(x0), Y(y0), X(x), Y(y), col, 2.2, op, dash);
        if (t) out += lab(X(x0), Y(y0), X(x), Y(y), t, col);
      } else if (k === 'p') {
        const [ps, col, op = 0.3] = a;
        out += `<polygon points="${pts(ps)}" fill="${c(col)}" fill-opacity="${op}" stroke="${c(col)}" stroke-width="1.5"/>`;
      } else if (k === 'pl') {
        const [ps, col, w = 1.8, op = 1] = a;
        out += `<polyline points="${pts(ps)}" fill="none" stroke="${c(col)}" stroke-width="${w}" stroke-opacity="${op}" stroke-linejoin="round"/>`;
      } else if (k === 'pt') {
        const [x, y, col, t, dx = 0, dy = -11] = a;
        out +=
          `<circle cx="${F(X(x))}" cy="${F(Y(y))}" r="3.2" fill="${c(col)}"/>` +
          (t ? tx(X(x) + dx, Y(y) + dy, t, col, 11) : '');
      } else if (k === 't') {
        const [x, y, t, col, sz] = a;
        out += tx(X(x), Y(y), t, col, sz);
      } else if (k === 'T') {
        const [x, y, t, col, sz] = a;
        out += tx(x, y, t, col, sz);
      } else if (k === 'fn') {
        const [f, x0, x1, col] = a;
        const ps = [];
        for (let i = 0; i <= 80; i++) {
          const x = x0 + ((x1 - x0) * i) / 80;
          ps.push([x, f(x)]);
        }
        out += `<polyline points="${pts(ps)}" fill="none" stroke="${c(col)}" stroke-width="2"/>`;
      } else if (k === 'e') {
        const [M, col] = a;
        const ps = [];
        for (let i = 0; i < 64; i++) {
          const t = (i / 64) * 2 * Math.PI;
          ps.push(ap(M, [Math.cos(t), Math.sin(t)], 2));
        }
        out += `<polygon points="${pts(ps)}" fill="${c(col)}" fill-opacity=".15" stroke="${c(col)}" stroke-width="1.8"/>`;
      } else if (k === 'v3') {
        const [x, y, z, col, t] = a;
        const p = P3(0, 0, 0),
          q = P3(x, y, z);
        out += arr(p[0], p[1], q[0], q[1], col);
        if (t) out += lab(p[0], p[1], q[0], q[1], t, col);
      } else if (k === 'p3') {
        const [ps, col, op = 0.25] = a;
        out += `<polygon points="${ps
          .map((p) =>
            P3(...p)
              .map(F)
              .join(',')
          )
          .join(
            ' '
          )}" fill="${c(col)}" fill-opacity="${op}" stroke="${c(col)}" stroke-width="1.3" stroke-opacity=".8"/>`;
      } else if (k === 'l3') {
        const [p, q, col, dash, op = 0.5] = a;
        const A = P3(...p),
          B = P3(...q);
        out += line(A[0], A[1], B[0], B[1], col, 1.2, op, dash);
      } else if (k === 'mini') {
        const [px, py, sc, M, col = 'det'] = a;
        const T2 = (x, y) => {
          const p = ap(M, [x, y], 2);
          return [px + p[0] * sc, py - p[1] * sc];
        };
        const q = [
            [0, 0],
            [1, 0],
            [1, 1],
            [0, 1],
          ].map((v) => T2(...v)),
          o0 = q[0],
          i1 = T2(1, 0),
          j1 = T2(0, 1);
        out +=
          `<polygon points="${q.map((p) => F(p[0]) + ',' + F(p[1])).join(' ')}" fill="${c(col)}" fill-opacity=".28" stroke="${c(col)}" stroke-width="1.4"/>` +
          arr(o0[0], o0[1], i1[0], i1[1], 'i', 2) +
          arr(o0[0], o0[1], j1[0], j1[1], 'j', 2);
      } else if (k === 'A') {
        const [x1, y1, x2, y2, col, t] = a;
        out += arr(x1, y1, x2, y2, col, 1.6, 0.8);
        if (t) out += tx((x1 + x2) / 2, y1 - 11, t, col, 12);
      } else if (k === 'raw') out += a[0];
    }
    return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><rect width="${W}" height="${H}" fill="var(--s-bg)"/>${out}</svg>`;
  }

  /* ---------- экспорт ---------- */
  const keysUi = createKeys({ T, keys: KEYS });
  const { renderKeys, openKeys } = keysUi;
  keysUi.init();
  const ex = createExport({
    name: () => `linear-${S.mode}`,
    T,
    state: S,
    cv,
    renderNow,
    req,
    // видео: анимация преобразования; в начало — через автомат анимации, кадр — с подписями
    video: {
      play: () => play(),
      reset: () => {
        stopAnim();
        D().t = 0;
      },
      frame: () => renderOverlay(),
    },
  });
  const { canSave, updExport, flash, exportPng, exportVideo, vidMime } = ex;
  ex.init();
  let fmtMode = 'tex';

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  function renderTex() {
    const d = D(),
      n = N(),
      A = d.to,
      a = (x) => fmt(x, 4).replace('−', '-'),
      rows = [],
      [rr, cc] = SH();
    for (let i = 0; i < rr; i++) rows.push(A.slice(i * n, i * n + cc).map(a));
    $('#xTex').value =
      fmtMode === 'tex'
        ? '\\begin{pmatrix}\n' + rows.map((r) => '  ' + r.join(' & ')).join(' \\\\\n') + '\n\\end{pmatrix}'
        : fmtMode === 'np'
          ? 'np.array([\n' + rows.map((r) => '    [' + r.join(', ') + ']').join(',\n') + '\n])'
          : rows.map((r) => r.join('\t')).join('\n');
  }

  document.querySelectorAll('#xFmt button').forEach(
    (b) =>
      (b.onclick = () => {
        fmtMode = b.dataset.f;
        document.querySelectorAll('#xFmt button').forEach((x) => setOn(x, x === b));
        renderTex();
      })
  );

  /* ---------- горячие клавиши ---------- */

  function flip(k) {
    P.show[k] = !P.show[k];
    if (k === 'decomp' && P.show.decomp) P.show.vec = true;
    syncToggles();
    save();
    renderCaption();
    req();
    const L = T();
    toast(`${L.tog[k]}: ${P.show[k] ? L.on : L.off}`);
  }
  onShortcut((c, e, isQ) => {
    const d = D(),
      L = T();
    let h = true;
    const setT = (v) => {
      stopAnim();
      d.t = Math.max(0, Math.min(1, v));
      changed();
    };
    if (isQ) openKeys();
    else if (c === 'Space') play();
    else if (c === 'ArrowLeft' || c === 'ArrowRight') {
      const st = e.shiftKey ? 0.25 : 0.05;
      setT(Math.round((d.t + (c === 'ArrowLeft' ? -st : st)) * 100) / 100);
    } else if (c === 'Home') setT(0);
    else if (c === 'End') setT(1);
    else if (/^(Digit|Numpad)[1-9]$/.test(c)) {
      const p = PRE[shapeKey()][+c.slice(-1) - 1];
      if (p) {
        animateTo(p[1] || randShape(), p[0]);
        toast(nm(p[0]));
      }
    } else if (c === 'Digit0' || c === 'Numpad0') $('#zHome').click();
    else if (c === 'KeyR') $('#bI').click();
    else if (c === 'KeyT') $('#bT').click();
    else if (c === 'KeyI') $('#bInv').click();
    else if (c === 'KeyC') {
      const b = $('#compose');
      if (b.disabled) return;
      b.checked = !b.checked;
      S.compose = b.checked;
      toast(`${L.compose}: ${S.compose ? L.on : L.off}`);
    } else if (c === 'KeyD') {
      setMode(S.mode === '2d' ? '3d' : '2d');
      toast(S.mode.toUpperCase());
    } else if (c === 'KeyG') flip('ghost');
    else if (c === 'KeyP') flip('trails');
    else if (c === 'KeyE') flip('eigen');
    else if (c === 'KeyK') flip('kernel');
    else if (c === 'KeyV') flip('vec');
    else if (c === 'KeyB') flip('decomp');
    else if (c === 'KeyL') flip('labels');
    else if (c === 'KeyH') flip('hints');
    else if (c === 'Equal' || c === 'NumpadAdd') $('#zIn').click();
    else if (c === 'Minus' || c === 'NumpadSubtract') $('#zOut').click();
    else if (c === 'KeyS') {
      if (canSave()) exportPng();
      else toast(L.xNoDl);
    } else if (c === 'KeyM') $('#mulPlay').click();
    else if (c === 'KeyA') {
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
    // образец палитры в ЛА обводится цветом сетки
    swatch: (p) => p.grid,
    hooks: {
      applyLang,
      applyOrder,
      syncToggles,
      // после «Сбросить всё» ЛА обновляет только подпись (сцена перерисуется через req)
      renderAll: () => renderCaption(),
      req,
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
    document.documentElement.lang = lang();
    document.title = L.title;
    applyTexts(L);
    $('#gq').placeholder = L.search;
    cv.setAttribute('aria-label', L.canvas);
    document
      .querySelectorAll('#langSeg button,#langSeg2 button')
      .forEach((b) => setOn(b, b.dataset.l === lang()));
    buildPal();
    buildToggles();
    syncToggles();
    buildPresets();
    buildMatrixInputs();
    buildVecInputs();
    syncSettings();
    if ($('#dGloss').classList.contains('open')) renderGloss($('#gq').value);
    if (typeof updExport === 'function') {
      updExport();
      renderKeys();
      buildMul();
    }
    if (S.K) changed();
  }

  /* ---------- старт ---------- */
  buildPanels();
  buildSettings();
  buildPal();
  $('#spR').value = P.speed;
  $('#spOut').textContent = '×' + fmt(P.speed);
  applyPrefs();
  setMode('2d');
  applyLang();
  document
    .querySelectorAll('.seg button:not([aria-pressed])')
    .forEach((b) => setOn(b, b.classList.contains('on')));
  pub('drawer', 'none');
  pub('rec', 'idle');
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(req);
})();
