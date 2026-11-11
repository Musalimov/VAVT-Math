import { createEconApp } from '../../shared/econ/app.js';
import { createGlossary } from '../../shared/glossary.js';
import { initDrawers } from '../../shared/drawers.js';
import { applyTexts, createSettings } from '../../shared/settings.js';
import { createKeys, onShortcut } from '../../shared/keys.js';
import { KEYS } from './content/keys.js';
import { createExport } from '../../shared/export.js';
import { createPanels } from '../../shared/panels.js';
import { loadPrefs, makeSaver } from '../../shared/prefs.js';
import { SOLVE, cS0, fQ, fVq, rS } from './solvers/steps.js';
import { COMP, nI } from './solvers/compute.js';
import { FORMS, GROUPS, PRE, TOPICS } from './content/topics.js';
import { CHAP, DEMOS, FORMAL, ILL, REL, TERMS } from './content/glossary.js';
import { T, TX, TX2 } from './content/tx.js';
import { esc, unesc } from '../../shared/esc.js';
import {
  STRATS,
  auction,
  backward,
  bargain,
  bayesGame,
  bimatrix,
  braess,
  coalitions,
  convexG,
  coreLP,
  cournot,
  dominance,
  evoAnalysis,
  galeShapley,
  hull,
  oligo,
  parseMat,
  parsePrefs,
  parseTree,
  pc,
  power,
  prenucleolus,
  replicator,
  shapley,
  subsets,
  tournament,
  zeroSum,
} from './solvers/games.js';
import { closeDrawers } from '../../shared/drawers.js';
import { openDrawer } from '../../shared/drawers.js';
import { toast } from '../../shared/toast.js';
import { clone } from '../../shared/dom.js';
import { $ } from '../../shared/dom.js';
import { fV } from '../../shared/format.js';
import { fN } from '../../shared/format.js';
import { dc } from '../../shared/format.js';
import { fmt } from '../../shared/format.js';
import { TXB } from '../../shared/econ/txb.js';
import { numG } from '../../shared/econ/expr-xy.js';
import { exprXY } from '../../shared/econ/expr-xy.js';
import { lang, langFrom } from '../../shared/i18n.js';
import { simplex } from '../../math/simplex.js';
import { Q, Q1, Z0, toFrac } from '../../math/fractions.js';
(() => {
  'use strict';
  /* ---------- точные дроби ---------- */

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

  /* ---------- теория игр: математика ---------- */

  /* биматричная игра */

  /* смешанные равновесия игры m×n перебором носителей одинакового размера k ≥ 2 (для невырожденных игр находит все).
   Носитель I×J: y на J уравнивает строки I для игрока 1, x на I уравнивает столбцы J для игрока 2, вне носителя выгоднее не станет. */

  /* антагонистическая */

  /* Курно */

  /* задача торга */

  /* кооперативные игры */

  /* аукционы: оценки ~ U[0, ω] */

  /* ---------- выражения от двух переменных x, y ---------- */

  /* ---------- непрерывная игра ---------- */

  /* ---------- олигополия ---------- */

  /* ---------- Хотеллинг ---------- */

  /* ---------- дерево ---------- */

  /* ---------- повторяющаяся дилемма ---------- */

  /* ---------- байесовская игра ---------- */

  /* ---------- эволюционная ---------- */

  /* ---------- голосование ---------- */

  /* ---------- Гейл–Шепли ---------- */

  /* ---------- Браес ---------- */

  const KEY = 'game-viz-v1';

  const PAL = {
    classic: {
      bg: '#0b0c10',
      bgGrid: '#262b33',
      axis: '#f2f2f2',
      p1: '#58c4dd',
      p2: '#ff9f43',
      eq: '#f4d345',
      area: '#83c167',
      curve: '#ff7aa8',
      mark: '#c77dff',
      bad: '#fc6255',
    },
    paper: {
      bg: '#fbfaf7',
      bgGrid: '#e3e1da',
      axis: '#23262b',
      p1: '#2b6cb0',
      p2: '#e67e22',
      eq: '#c98a00',
      area: '#3f9a3a',
      curve: '#c0398b',
      mark: '#8e44ad',
      bad: '#d1453b',
    },
    neon: {
      bg: '#07020f',
      bgGrid: '#1f1533',
      axis: '#ffffff',
      p1: '#4dd2ff',
      p2: '#ffa53d',
      eq: '#fff35c',
      area: '#39ff88',
      curve: '#ff9ecf',
      mark: '#a98bff',
      bad: '#ff4d6d',
    },
    nord: {
      bg: '#2e3440',
      bgGrid: '#3b4252',
      axis: '#eceff4',
      p1: '#88c0d0',
      p2: '#d08770',
      eq: '#ebcb8b',
      area: '#a3be8c',
      curve: '#e5a0c0',
      mark: '#b48ead',
      bad: '#bf616a',
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
    show: { bgGrid: true, coords: true, labels: true, br: true, sh: true, pn: true, hints: true },
    topic: 'mat',
    inp: null,
    preset: null,
  };

  // настройки: схема 2, миграция со схемы 1, -bak, предупреждение при переполнении (src/shared/prefs.js)

  /* текст пользователя (имена вершин, ходов, участников) в HTML — только через esc; в текстовый экспорт — через unesc */

  /* вектор вероятностей: простые дроби (1/3; 2/3), иначе десятичные */

  /* ---------- примеры ---------- */

  const ECON = createEconApp({
    appName: 'game-theory',
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
    get GROUPS() {
      return GROUPS;
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
    get capKey() {
      return capKey;
    },
    get loadPreset() {
      return loadPreset;
    },
    get relTogs() {
      return relTogs;
    },
    get renderAll() {
      return renderAll;
    },
    get renderNow() {
      return renderNow;
    },
    get renderTex() {
      return renderTex;
    },
  });
  const S = {
    topic: TOPICS.includes(ECON.P.topic) ? ECON.P.topic : 'mat',
    inp: {},
    res: null,
    err: null,
    preset: ECON.P.preset || null,
    stamp: false,
  };

  document.addEventListener('click', (e) => {
    const b = e.target.closest('#topicBox button[data-t]');
    if (b) ECON.setTopic(b.dataset.t);
  });
  let fT0 = 0;
  $('#form').addEventListener('input', (e) => {
    const k = e.target.dataset.k;
    if (!k) return;
    S.inp[S.topic][k] = e.target.value;
    S.preset = null;
    if (e.target.tagName === 'SELECT') {
      ECON.renderForm();
      ECON.recompute();
      return;
    }
    clearTimeout(fT0);
    fT0 = setTimeout(ECON.recompute, 250);
  });

  function loadPreset(id) {
    for (const t of TOPICS) {
      const p = PRE[t].find((z) => z[0] === id);
      if (p) {
        S.topic = t;
        ECON.P.topic = t;
        S.inp[t] = { ...S.inp[t], ...clone(p[1]) };
        S.preset = id;
        ECON.renderForm();
        ECON.recompute();
        return;
      }
    }
  }
  /* ---------- вычисления ---------- */

  /* ---------- панели ---------- */

  function renderSolve() {
    const box = $('#solve'),
      L = T();
    if (S.err) {
      box.innerHTML = `<p class="note err">${L.err[S.err.msg] || L.err.num}</p>`;
      S.ans = '';
      return;
    }
    const r = SOLVE[S.topic](S.res, S.inp[S.topic]);
    S.ans = r.ans;
    box.innerHTML = `<p class="idea">${L.tt[S.topic]}</p>${ECON.ol(r.st)}<div class="ans"><div class="k">${L.ans}</div><div class="big">${r.ans}</div></div>`;
  }

  function renderValues() {
    const box = $('#props'),
      V = T().v;
    if (S.err || !S.res) {
      box.innerHTML = '';
      return;
    }
    const R = S.res,
      t = S.topic;
    let h = '';
    if (t === 'mat') {
      if (R.kind === 'zs')
        h =
          ECON.prop(V.alpha, fN(R.z.lo, 3)) + ECON.prop(V.beta, fN(R.z.hi, 3)) + ECON.prop(V.val, fQ(R.z.v));
      else
        h =
          ECON.prop(
            V.ne,
            R.bm.pure.length ? R.bm.pure.map(([i, j]) => `(${i + 1}, ${j + 1})`).join(', ') : '—'
          ) +
          (R.bm.mixed ? ECON.prop(V.mix, `p = ${fN(R.bm.mixed.p, 3)}, q = ${fN(R.bm.mixed.q, 3)}`) : '') +
          (R.bm.mixN || []).map((e) => ECON.prop(V.mix, `x* = ${fVq(e.x)}, y* = ${fVq(e.y)}`)).join('');
    } else if (t === 'cour' && R.om !== 'cour') h = VALS2.olig(R, V);
    else if (t === 'cour')
      h =
        ECON.prop(V.Q, fQ(R.Q)) +
        ECON.prop(V.P, fQ(R.P)) +
        R.q.map((q, i) => ECON.prop(`q${i + 1}; H${i + 1}`, `${fN(q, 3)}; ${fN(R.pi[i], 3)}`)).join('');
    else if (t === 'barg')
      h =
        ECON.prop(V.nash, R.nash ? fV(R.nash.x) : '—') +
        ECON.prop(V.ks, R.ks ? fV(R.ks.x) : '—') +
        ECON.prop(V.ideal, fV(R.ideal));
    else if (t === 'coop')
      h =
        ECON.prop(V.sh, fV(R.sh.phi)) +
        ECON.prop(V.pn, R.pn.x ? fV(R.pn.x) : '—') +
        ECON.prop(V.core, R.core.nonempty ? V.nonempty : V.empty) +
        ECON.prop(V.conv, R.cv.length ? V.no : V.yes);
    else if (VALS2[t]) h = VALS2[t](R, V);
    else
      h =
        ECON.prop(V.fp, fN(R.a.fp(R.v), 4)) +
        ECON.prop(V.sp, fN(R.a.sp(R.v), 4)) +
        ECON.prop(V.ap, fN(R.a.ap(R.v), 4)) +
        ECON.prop(V.rev, fQ(R.a.rev));
    box.innerHTML = h;
  }

  function capKey() {
    if (S.topic === 'cour' && S.res && S.res.om && S.res.om !== 'cour') return 'olig_' + S.res.om;
    if (S.topic === 'mat' && S.res && S.res.kind === 'zs') return 'zs';
    if (S.topic === 'coop' && S.res && S.res.n !== 3) return 'coopN';
    return S.topic;
  }

  function relTogs() {
    const t = S.topic,
      R = S.res || {};
    const G = ['bgGrid', 'coords'];
    const m = {
      mat:
        R.kind === 'zs'
          ? [...G, 'labels']
          : ['br', ...(R.A && R.A.length === 2 && R.A[0].length === 2 ? [...G, 'labels'] : [])],
      cour: [...G, 'labels'],
      barg: [...G, 'labels'],
      coop: ['sh', 'pn', 'labels'],
      auct: [...G, 'labels'],
      cont: [...G, 'br'],
      bayes: ['br'],
      hotel: ['labels'],
      tree: ['labels'],
      rep: [...G, 'labels'],
      evo: [...G, 'labels'],
      vote: [...G, 'labels'],
      match: ['labels'],
      braess: ['labels'],
    };
    return [...(m[t] || []), 'hints'];
  }

  function renderAll() {
    ECON.syncTogVis();
    renderSolve();
    renderValues();
    ECON.renderPresets();
    ECON.renderOverlay();
    ECON.renderCaption();
    renderTex();
    const fe = $('#fErr');
    fe.hidden = !S.err;
    if (S.err) fe.textContent = T().err[S.err.msg] || T().err.num;
    ECON.req();
  }
  /* ---------- сцена ---------- */

  function renderNow() {
    ECON.ctx.setTransform(ECON.DPR, 0, 0, ECON.DPR, 0, 0);
    ECON.ctx.fillStyle = ECON.P.colors.bg;
    ECON.ctx.fillRect(0, 0, ECON.W, ECON.H);
    if (!S.res || S.err || !ECON.W) return;
    ({
      mat: drawMat,
      cour: drawCourX,
      barg: drawBarg,
      coop: drawCoop,
      auct: drawAuct,
      cont: drawCont,
      bayes: drawMat,
      hotel: drawHotel,
      tree: drawTree,
      rep: drawRep,
      evo: drawEvo,
      vote: drawVote,
      match: drawMatch,
      braess: drawBraess,
    })[S.topic](S.res);
    if (S.stamp) {
      const t = unesc((S.ans || '').replace(/<[^>]+>/g, ''));
      ECON.ctx.font = '600 15px "Source Serif 4", Georgia, serif';
      const w = ECON.ctx.measureText(t).width + 20;
      ECON.ctx.fillStyle = ECON.P.colors.bg;
      ECON.ctx.globalAlpha = 0.85;
      ECON.ctx.fillRect(ECON.W - w - 12, ECON.H - 38, w, 28);
      ECON.ctx.globalAlpha = 1;
      ECON.ctx.fillStyle = ECON.P.colors.axis;
      ECON.ctx.textAlign = 'left';
      ECON.ctx.textBaseline = 'middle';
      ECON.ctx.fillText(t, ECON.W - w - 2, ECON.H - 24);
    }
  }
  function drawMat(R) {
    const cS = R.cl ? (j) => `${ECON.P.lang === 'ru' ? 'ст.' : 'col'} ${R.cl[j]}` : cS0;
    const c = ECON.P.colors,
      A = R.A,
      B = R.B,
      m = A.length,
      n = A[0].length,
      zs = R.kind === 'zs',
      bm = R.bm;
    const sq = (!zs && m === 2 && n === 2) || (zs && (m === 2 || n === 2));
    const areaW = sq ? ECON.W * 0.5 : ECON.W - 80,
      cw = Math.min(120, (areaW - 60) / (n + (zs ? 1 : 0))),
      ch = Math.min(70, (ECON.H - ECON.pT() - ECON.pB() - 40) / (m + (zs ? 1 : 0))),
      x0 = 40 + (areaW - cw * n) / 2,
      y0 = ECON.pT() + 30;
    const ne = new Set(bm.pure.map(([i, j]) => i + ',' + j)),
      del = R.dom
        ? {
            r: new Set(R.dom.steps.filter((s) => s.p === 1).map((s) => s.out)),
            c: new Set(R.dom.steps.filter((s) => s.p === 2).map((s) => s.out)),
          }
        : { r: new Set(), c: new Set() };
    for (let j = 0; j < n; j++) ECON.txt(cS(j), x0 + cw * j + cw / 2, y0 - 14, c.p2, 12);
    for (let i = 0; i < m; i++) ECON.txt(rS(i), x0 - 24, y0 + ch * i + ch / 2, c.p1, 12);
    for (let i = 0; i < m; i++)
      for (let j = 0; j < n; j++) {
        const X = x0 + cw * j,
          Y = y0 + ch * i,
          dl = del.r.has(i) || del.c.has(j);
        ECON.ctx.fillStyle = c.bgGrid;
        ECON.ctx.globalAlpha = dl ? 0.35 : 0.9;
        ECON.ctx.fillRect(X + 3, Y + 3, cw - 6, ch - 6);
        ECON.ctx.globalAlpha = 1;
        if (ne.has(i + ',' + j)) {
          ECON.ctx.strokeStyle = c.eq;
          ECON.ctx.lineWidth = 3;
          ECON.ctx.strokeRect(X + 3, Y + 3, cw - 6, ch - 6);
        }
        const b1 = ECON.P.show.br && bm.br1[j][i],
          b2 = ECON.P.show.br && bm.br2[i][j];
        {
          if (zs) ECON.txt(dc(fmt(A[i][j], 3)), X + cw / 2, Y + ch / 2, b1 ? c.p1 : c.axis, 16);
          else {
            ECON.txt(dc(fmt(A[i][j], 3)), X + cw / 2 - 14, Y + ch / 2, b1 ? c.p1 : c.axis, 15);
            ECON.txt(';', X + cw / 2, Y + ch / 2, c.axis, 14);
            ECON.txt(dc(fmt(B[i][j], 3)), X + cw / 2 + 14, Y + ch / 2, b2 ? c.p2 : c.axis, 15);
          }
        }
        if (dl) {
          ECON.ctx.strokeStyle = c.bad;
          ECON.ctx.globalAlpha = 0.6;
          ECON.ctx.lineWidth = 2;
          ECON.ctx.beginPath();
          ECON.ctx.moveTo(X + 8, Y + 8);
          ECON.ctx.lineTo(X + cw - 8, Y + ch - 8);
          ECON.ctx.stroke();
          ECON.ctx.globalAlpha = 1;
        }
      }
    if (zs && ECON.P.show.labels) {
      R.z.rmin.forEach((v, i) =>
        ECON.txt(dc(fmt(v, 3)), x0 + cw * n + 20, y0 + ch * i + ch / 2, c.mark, 13, 'left')
      );
      R.z.cmax.forEach((v, j) => ECON.txt(dc(fmt(v, 3)), x0 + cw * j + cw / 2, y0 + ch * m + 16, c.mark, 13));
      ECON.txt('min', x0 + cw * n + 20, y0 - 14, c.mark, 12, 'left');
      ECON.txt('max', x0 - 24, y0 + ch * m + 16, c.mark, 12);
    }
    if (!sq) return;
    const r = {
      x: ECON.W * 0.56,
      y: ECON.pT() + 20,
      w: ECON.W * 0.4,
      h: Math.min(ECON.W * 0.4, ECON.H - ECON.pT() - ECON.pB() - 40),
    };
    if (!zs) {
      const fr = ECON.frame(
        r,
        0,
        1,
        0,
        1,
        true,
        ECON.P.lang === 'ru' ? 'наилучшие ответы' : 'best responses'
      );
      const u1 = (q) => [q * A[0][0] + (1 - q) * A[0][1], q * A[1][0] + (1 - q) * A[1][1]],
        u2 = (p) => [p * B[0][0] + (1 - p) * B[1][0], p * B[0][1] + (1 - p) * B[1][1]];
      // BR1: p(q)
      let prev = null;
      for (let k = 0; k <= 200; k++) {
        const q = k / 200,
          u = u1(q),
          p = u[0] > u[1] + 1e-12 ? 1 : u[0] < u[1] - 1e-12 ? 0 : 0.5;
        if (prev !== null) ECON.seg(fr, [prev[0], prev[1]], [q, p === 0.5 ? prev[1] : p], c.p1, 3);
        if (p === 0.5 && prev) ECON.seg(fr, [q, 0], [q, 1], c.p1, 3);
        prev = [q, p === 0.5 ? (prev ? prev[1] : 0) : p];
      }
      prev = null;
      for (let k = 0; k <= 200; k++) {
        const p = k / 200,
          u = u2(p),
          q = u[0] > u[1] + 1e-12 ? 1 : u[0] < u[1] - 1e-12 ? 0 : 0.5;
        if (prev !== null) ECON.seg(fr, [prev[1], prev[0]], [q === 0.5 ? prev[1] : q, p], c.p2, 3, [6, 4]);
        if (q === 0.5 && prev) ECON.seg(fr, [0, p], [1, p], c.p2, 3, [6, 4]);
        prev = [p, q === 0.5 ? (prev ? prev[1] : 0) : q];
      }
      bm.pure.forEach(([i, j]) => ECON.dotP(fr, [j === 0 ? 1 : 0, i === 0 ? 1 : 0], c.eq, 6));
      if (bm.mixed)
        ECON.dotP(
          fr,
          [bm.mixed.q, bm.mixed.p],
          c.eq,
          6,
          ECON.P.show.labels ? `(${dc(fmt(bm.mixed.q, 2))}; ${dc(fmt(bm.mixed.p, 2))})` : ''
        );
      ECON.txt('q', r.x + r.w - 6, fr.Y(0) + 20, c.p2, 13);
      ECON.txt('p', r.x - 14, r.y + 8, c.p1, 13);
    } else {
      const two = m === 2,
        K = two ? n : m,
        line = (k, x) => (two ? x * A[0][k] + (1 - x) * A[1][k] : x * A[k][0] + (1 - x) * A[k][1]);
      let lo = Infinity,
        hi = -Infinity;
      for (let k = 0; k < K; k++)
        for (const x of [0, 1]) {
          lo = Math.min(lo, line(k, x));
          hi = Math.max(hi, line(k, x));
        }
      const fr = ECON.frame(r, 0, 1, Math.min(0, lo), hi + 0.1 * (hi - lo || 1), false, two ? 'p' : 'q');
      for (let k = 0; k < K; k++) ECON.seg(fr, [0, line(k, 0)], [1, line(k, 1)], c.curve, 1.6);
      const env = (x) => {
        let v = two ? Infinity : -Infinity;
        for (let k = 0; k < K; k++) v = two ? Math.min(v, line(k, x)) : Math.max(v, line(k, x));
        return v;
      };
      ECON.ctx.strokeStyle = c.area;
      ECON.ctx.lineWidth = 3.2 * ECON.P.lw;
      ECON.ctx.beginPath();
      for (let i = 0; i <= 200; i++) {
        const x = i / 200;
        i ? ECON.ctx.lineTo(fr.X(x), fr.Y(env(x))) : ECON.ctx.moveTo(fr.X(x), fr.Y(env(x)));
      }
      ECON.ctx.stroke();
      const pr = two ? R.z.p[0] : R.z.q[0];
      if (pr != null)
        ECON.dotP(fr, [pr, R.z.v], c.eq, 6, ECON.P.show.labels ? `v = ${dc(fmt(R.z.v, 3))}` : '');
    }
  }
  function drawCour(R) {
    const c = ECON.P.colors,
      r = { x: 60, y: ECON.pT(), w: ECON.W - 110, h: ECON.H - ECON.pT() - ECON.pB() };
    if (R.N === 2) {
      const M = R.M,
        [c1, c2] = R.cs,
        mx = Math.max(M - c1, M - c2) * 1.05;
      const fr = ECON.frame(r, 0, mx, 0, mx, true, 'q₂ ↑  q₁ →');
      ECON.seg(fr, [0, (M - c2) / 2], [M - c2, 0], c.p2, 2.6);
      ECON.seg(fr, [(M - c1) / 2, 0], [0, M - c1], c.p1, 2.6);
      if (ECON.P.show.labels) {
        ECON.txt(
          ECON.P.lang === 'ru' ? 'ответ фирмы 1' : 'firm 1 response',
          fr.X(0) + 8,
          fr.Y(M - c1) + 4,
          c.p1,
          13,
          'left'
        );
        ECON.txt(
          ECON.P.lang === 'ru' ? 'ответ фирмы 2' : 'firm 2 response',
          fr.X(M - c2) - 4,
          fr.Y(0) - 14,
          c.p2,
          13,
          'right'
        );
      }
      ECON.dotP(fr, R.q, c.eq, 7, ECON.P.show.labels ? `(${dc(fmt(R.q[0], 2))}; ${dc(fmt(R.q[1], 2))})` : '');
      return;
    }
    const fr = ECON.frame(r, -0.6, R.N - 0.4, 0, Math.max(...R.q, 1e-9) * 1.25, false, 'qᵢ', true);
    const bw = (fr.X(1) - fr.X(0)) * 0.6;
    R.q.forEach((q, i) => {
      const X = fr.X(i),
        Y = fr.Y(q);
      ECON.ctx.fillStyle = c.p1;
      ECON.ctx.globalAlpha = 0.75;
      ECON.ctx.fillRect(X - bw / 2, Y, bw, fr.Y(0) - Y);
      ECON.ctx.globalAlpha = 1;
      if (ECON.P.show.labels) ECON.txt(`q${i + 1} = ${dc(fmt(q, 2))}`, X, Y - 12, c.axis, 12);
    });
  }
  function drawBarg(R) {
    const c = ECON.P.colors,
      xs = R.H.map((p) => p[0]).concat(R.ideal[0]),
      ys = R.H.map((p) => p[1]).concat(R.ideal[1]),
      x0 = Math.min(0, ...xs),
      y0 = Math.min(0, ...ys),
      x1 = Math.max(...xs) * 1.1,
      y1 = Math.max(...ys) * 1.12;
    const fr = ECON.frame(
      { x: 60, y: ECON.pT(), w: ECON.W - 110, h: ECON.H - ECON.pT() - ECON.pB() },
      x0,
      x1,
      y0,
      y1,
      true,
      'x₂ ↑  x₁ →'
    );
    ECON.ctx.beginPath();
    R.H.forEach((p, i) =>
      i ? ECON.ctx.lineTo(fr.X(p[0]), fr.Y(p[1])) : ECON.ctx.moveTo(fr.X(p[0]), fr.Y(p[1]))
    );
    ECON.ctx.closePath();
    ECON.ctx.fillStyle = c.area;
    ECON.ctx.globalAlpha = 0.25;
    ECON.ctx.fill();
    ECON.ctx.globalAlpha = 0.8;
    ECON.ctx.strokeStyle = c.area;
    ECON.ctx.lineWidth = 1.5;
    ECON.ctx.stroke();
    ECON.ctx.globalAlpha = 1;
    for (let i = 0; i < R.F.length - 1; i++) ECON.seg(fr, R.F[i], R.F[i + 1], c.area, 4);
    const d = R.d;
    if (R.nash && R.nash.v > 0) {
      ECON.ctx.strokeStyle = c.curve;
      ECON.ctx.lineWidth = 1.6;
      ECON.ctx.setLineDash([5, 4]);
      ECON.ctx.beginPath();
      let pen = false;
      for (let i = 1; i <= 300; i++) {
        const a = d[0] + ((x1 - d[0]) * i) / 300,
          b = d[1] + R.nash.v / (a - d[0]);
        if (b > y1 * 1.2) {
          pen = false;
          continue;
        }
        const X = fr.X(a),
          Y = fr.Y(b);
        pen ? ECON.ctx.lineTo(X, Y) : ECON.ctx.moveTo(X, Y);
        pen = true;
      }
      ECON.ctx.stroke();
      ECON.ctx.setLineDash([]);
    }
    ECON.seg(fr, d, R.ideal, c.mark, 1.6, [3, 4]);
    ECON.dotP(
      fr,
      R.ideal,
      c.mark,
      5,
      ECON.P.show.labels ? (ECON.P.lang === 'ru' ? 'идеальная' : 'ideal') : ''
    );
    ECON.dotP(fr, d, c.axis, 5, 'd');
    if (R.ks) ECON.dotP(fr, R.ks.x, c.p2, 7, ECON.P.show.labels ? `KS ${fV(R.ks.x)}` : 'KS');
    if (R.nash) ECON.dotP(fr, R.nash.x, c.eq, 6, ECON.P.show.labels ? `N ${fV(R.nash.x)}` : 'N');
  }
  function drawCoop(R) {
    const c = ECON.P.colors,
      n = R.n;
    if (n !== 3) {
      const r = { x: 60, y: ECON.pT(), w: ECON.W - 110, h: ECON.H - ECON.pT() - ECON.pB() },
        mx = Math.max(...R.sh.phi, ...(R.pn.x || [0]), 1e-9);
      const fr = ECON.frame(r, 0.4, n + 0.6, 0, mx * 1.25, false, 'xᵢ', true);
      const bw = (fr.X(1) - fr.X(0)) * 0.32;
      for (let i = 0; i < n; i++) {
        const X = fr.X(i + 1);
        if (ECON.P.show.sh) {
          const Y = fr.Y(R.sh.phi[i]);
          ECON.ctx.fillStyle = c.p1;
          ECON.ctx.globalAlpha = 0.75;
          ECON.ctx.fillRect(X - bw, Y, bw, fr.Y(0) - Y);
          ECON.ctx.globalAlpha = 1;
          if (ECON.P.show.labels) ECON.txt(dc(fmt(R.sh.phi[i], 2)), X - bw / 2, Y - 10, c.p1, 12);
        }
        if (ECON.P.show.pn && R.pn.x) {
          const Y = fr.Y(R.pn.x[i]);
          ECON.ctx.fillStyle = c.p2;
          ECON.ctx.globalAlpha = 0.75;
          ECON.ctx.fillRect(X, Y, bw, fr.Y(0) - Y);
          ECON.ctx.globalAlpha = 1;
          if (ECON.P.show.labels) ECON.txt(dc(fmt(R.pn.x[i], 2)), X + bw / 2, Y - 10, c.p2, 12);
        }
        ECON.txt(String(i + 1), X, fr.Y(0) + 14, c.axis, 13);
      }
      return;
    }
    const v = R.v,
      VN = v[7],
      cx = ECON.W / 2,
      top = ECON.pT() + 20,
      side = Math.min(ECON.W * 0.7, (ECON.H - top - ECON.pB() - 30) / 0.87),
      hgt = side * 0.866,
      A = [cx, top],
      B = [cx - side / 2, top + hgt],
      C = [cx + side / 2, top + hgt];
    const sur = VN - v[1] - v[2] - v[4],
      sc = sur > 1e-9 ? sur : Math.max(1, Math.abs(VN));
    const map = (x) => {
      const b = [
        (x[0] - (sur > 1e-9 ? v[1] : 0)) / sc,
        (x[1] - (sur > 1e-9 ? v[2] : 0)) / sc,
        (x[2] - (sur > 1e-9 ? v[4] : 0)) / sc,
      ];
      const t = b[0] + b[1] + b[2] || 1;
      return [(b[0] * A[0] + b[1] * B[0] + b[2] * C[0]) / t, (b[0] * A[1] + b[1] * B[1] + b[2] * C[1]) / t];
    };
    // работаем в координатах (x1, x2); x3 = VN - x1 - x2
    let poly = [
      [-1e4, -1e4],
      [1e4, -1e4],
      [1e4, 1e4],
      [-1e4, 1e4],
    ];
    const clip = (a, b, cc) => {
      const out = [];
      for (let i = 0; i < poly.length; i++) {
        const p = poly[i],
          q = poly[(i + 1) % poly.length],
          fp = a * p[0] + b * p[1] - cc,
          fq = a * q[0] + b * q[1] - cc;
        if (fp >= -1e-9) out.push(p);
        if (fp >= -1e-9 !== fq >= -1e-9) {
          const t = fp / (fp - fq);
          out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]);
        }
      }
      poly = out;
    };
    clip(1, 0, v[1]);
    clip(0, 1, v[2]);
    clip(-1, -1, v[4] - VN);
    const imp = poly.slice();
    clip(1, 1, v[3]);
    clip(0, -1, v[5] - VN);
    clip(-1, 0, v[6] - VN);
    const core = poly;
    const toS = (p) => map([p[0], p[1], VN - p[0] - p[1]]);
    const drawP = (pp, col, al, fill) => {
      if (pp.length < 2) return;
      ECON.ctx.beginPath();
      pp.forEach((p, i) => {
        const s = toS(p);
        i ? ECON.ctx.lineTo(s[0], s[1]) : ECON.ctx.moveTo(s[0], s[1]);
      });
      ECON.ctx.closePath();
      if (fill) {
        ECON.ctx.fillStyle = col;
        ECON.ctx.globalAlpha = al;
        ECON.ctx.fill();
        ECON.ctx.globalAlpha = 1;
      }
      ECON.ctx.strokeStyle = col;
      ECON.ctx.lineWidth = 1.6;
      ECON.ctx.stroke();
    };
    drawP(imp, c.axis, 0.06, true);
    if (core.length > 2) drawP(core, c.area, 0.4, true);
    else if (core.length) drawP(core, c.area, 1, false);
    if (ECON.P.show.labels) {
      [
        [A, '1', -14],
        [B, '2', 16],
        [C, '3', 16],
      ].forEach(([q, s, dy]) =>
        ECON.txt(
          ECON.P.lang === 'ru' ? `игроку ${s} всё сверх v({i})` : `all surplus to ${s}`,
          q[0],
          q[1] + dy,
          c.axis,
          12
        )
      );
    }
    const pt = (x, col, l) => {
      const s = map(x);
      ECON.ctx.fillStyle = col;
      ECON.ctx.strokeStyle = c.bg;
      ECON.ctx.lineWidth = 2;
      ECON.ctx.beginPath();
      ECON.ctx.arc(s[0], s[1], 6.5, 0, 7);
      ECON.ctx.fill();
      ECON.ctx.stroke();
      if (l) ECON.txt(l, s[0] + 10, s[1] - 12, col, 13, 'left');
    };
    if (ECON.P.show.sh) pt(R.sh.phi, c.p1, ECON.P.show.labels ? `φ ${fV(R.sh.phi)}` : 'φ');
    if (ECON.P.show.pn && R.pn.x)
      pt(
        R.pn.x,
        c.p2,
        ECON.P.show.labels
          ? `${ECON.P.lang === 'ru' ? 'пн' : 'pn'} ${fV(R.pn.x)}`
          : ECON.P.lang === 'ru'
            ? 'пн'
            : 'pn'
      );
  }
  function drawAuct(R) {
    const c = ECON.P.colors,
      a = R.a,
      w = R.w,
      r = { x: 60, y: ECON.pT(), w: ECON.W - 110, h: ECON.H - ECON.pT() - ECON.pB() };
    const fr = ECON.frame(r, 0, w, 0, w * 1.05, false, 'β(v)');
    const plot = (f, col, dash) => {
      ECON.ctx.strokeStyle = col;
      ECON.ctx.lineWidth = 2.6 * ECON.P.lw;
      ECON.ctx.setLineDash(dash || []);
      ECON.ctx.beginPath();
      for (let i = 0; i <= 200; i++) {
        const v = (w * i) / 200;
        i ? ECON.ctx.lineTo(fr.X(v), fr.Y(f(v))) : ECON.ctx.moveTo(fr.X(v), fr.Y(f(v)));
      }
      ECON.ctx.stroke();
      ECON.ctx.setLineDash([]);
    };
    plot(a.sp, c.p2);
    plot(a.fp, c.p1);
    plot(a.ap, c.curve, [7, 5]);
    const X = fr.X(R.v);
    ECON.ctx.strokeStyle = c.mark;
    ECON.ctx.setLineDash([4, 4]);
    ECON.ctx.beginPath();
    ECON.ctx.moveTo(X, r.y);
    ECON.ctx.lineTo(X, fr.Y(0));
    ECON.ctx.stroke();
    ECON.ctx.setLineDash([]);
    [
      [a.sp, c.p2, ECON.P.lang === 'ru' ? '2-я цена' : '2nd price'],
      [a.fp, c.p1, ECON.P.lang === 'ru' ? '1-я цена' : '1st price'],
      [a.ap, c.curve, ECON.P.lang === 'ru' ? 'платят все' : 'all-pay'],
    ].forEach(([f, col, l]) => {
      ECON.dotP(fr, [R.v, f(R.v)], col, 5, ECON.P.show.labels ? `${l}: ${dc(fmt(f(R.v), 3))}` : l);
    });
  }
  /* переключатели */
  const TOG = ['bgGrid', 'coords', 'labels', 'br', 'sh', 'pn', 'hints'];

  /* ---------- олигополия: Курно / Штакельберг / Бертран / сравнение ---------- */

  function drawCourX(R) {
    if (R.om === 'cour') return drawCour(R);
    const c = ECON.P.colors,
      r = { x: 60, y: ECON.pT(), w: ECON.W - 110, h: ECON.H - ECON.pT() - ECON.pB() };
    if (R.om === 'stack') {
      const M = R.M,
        [c1, c2] = [R.c1, R.c2],
        mx = Math.max(M - c1, M - c2) * 1.05;
      const fr = ECON.frame(r, 0, mx, 0, mx, true, 'q₂ ↑  q₁ →');
      ECON.seg(fr, [0, (M - c2) / 2], [M - c2, 0], c.p2, 2.6);
      ECON.seg(fr, [(M - c1) / 2, 0], [0, M - c1], c.p1, 1.4, [5, 4]);
      const cq = cournot(M, [c1, c2]).q;
      ECON.dotP(fr, cq, c.mark, 5, ECON.P.show.labels ? (ECON.P.lang === 'ru' ? 'Курно' : 'Cournot') : '');
      ECON.dotP(fr, R.q, c.eq, 7, ECON.P.show.labels ? `S ${fV(R.q)}` : 'S');
      return;
    }
    if (R.om === 'bert') {
      const mx = Math.max(...R.p, R.c1, R.c2) * 1.4 || 1;
      const fr = ECON.frame(
        r,
        -0.6,
        1.6,
        0,
        mx,
        false,
        ECON.P.lang === 'ru' ? 'цены и издержки' : 'prices and costs',
        true
      );
      const bw = (fr.X(1) - fr.X(0)) * 0.35;
      [
        [R.p[0], R.c1, c.p1],
        [R.p[1], R.c2, c.p2],
      ].forEach(([p, cc, col], i) => {
        const X = fr.X(i);
        ECON.ctx.fillStyle = col;
        ECON.ctx.globalAlpha = 0.7;
        ECON.ctx.fillRect(X - bw / 2, fr.Y(p), bw, fr.Y(0) - fr.Y(p));
        ECON.ctx.globalAlpha = 1;
        ECON.seg(fr, [i - 0.3, cc], [i + 0.3, cc], c.bad, 2.4, [4, 3]);
        if (ECON.P.show.labels) {
          ECON.txt(`p${i + 1} = ${dc(fmt(p, 3))}`, X, fr.Y(p) - 12, col, 13);
          ECON.txt(`c${i + 1}`, X + bw / 2 + 16, fr.Y(cc), c.bad, 12);
        }
      });
      return;
    }
    const m = R.cmp,
      ks = Object.keys(m),
      mx = Math.max(...ks.map((k) => Math.max(m[k].Q, m[k].P, m[k].CS / 3)));
    const fr = ECON.frame(r, -0.6, ks.length - 0.4, 0, mx * 1.25, false, 'Q · P', true);
    const bw = (fr.X(1) - fr.X(0)) * 0.25;
    ks.forEach((k, i) => {
      const X = fr.X(i);
      [
        [m[k].Q, c.p1, -1],
        [m[k].P, c.p2, 1],
      ].forEach(([v, col, s]) => {
        ECON.ctx.fillStyle = col;
        ECON.ctx.globalAlpha = 0.75;
        ECON.ctx.fillRect(X + (s < 0 ? -bw : 0), fr.Y(v), bw, fr.Y(0) - fr.Y(v));
        ECON.ctx.globalAlpha = 1;
        if (ECON.P.show.labels) ECON.txt(dc(fmt(v, 2)), X + (s * bw) / 2, fr.Y(v) - 10, col, 12);
      });
      ECON.txt(T().mods[k], X, fr.Y(0) + 16, c.axis, 11);
    });
  }
  let VALS2_olig = (R, V) =>
    R.om === 'cmp'
      ? Object.keys(R.cmp)
          .map((k) => ECON.prop(T().mods[k], `Q = ${fN(R.cmp[k].Q, 3)}, P = ${fN(R.cmp[k].P, 3)}`))
          .join('')
      : ECON.prop(T().v2.q, fV(R.q)) +
        ECON.prop(V.P, fQ(R.P)) +
        ECON.prop(V.pi, fV(R.pi)) +
        (R.p ? ECON.prop(T().v2.p, fV(R.p)) : '');
  /* ---------- непрерывные ---------- */

  function drawCont(R) {
    const c = ECON.P.colors,
      r = { x: 60, y: ECON.pT(), w: ECON.W - 110, h: ECON.H - ECON.pT() - ECON.pB() };
    const fr = ECON.frame(r, R.a1, R.b1, R.a2, R.b2, true, 'y ↑  x →');
    if (ECON.P.show.br) {
      ECON.ctx.fillStyle = c.p1;
      R.ys.forEach((y, k) =>
        R.br1[k].x.slice(0, 30).forEach((x) => {
          ECON.ctx.globalAlpha = 0.85;
          ECON.ctx.fillRect(fr.X(x) - 1.5, fr.Y(y) - 1.5, 3, 3);
        })
      );
      ECON.ctx.fillStyle = c.p2;
      R.xs.forEach((x, k) =>
        R.br2[k].x.slice(0, 30).forEach((y) => {
          ECON.ctx.fillRect(fr.X(x) - 1.5, fr.Y(y) - 1.5, 3, 3);
        })
      );
      ECON.ctx.globalAlpha = 1;
    }
    if (R.many) R.grid.forEach((p) => ECON.dotP(fr, p, c.eq, 3.5));
    else R.eq.forEach((p) => ECON.dotP(fr, p, c.eq, 7, fV(p)));
  }
  /* ---------- байесовские ---------- */

  /* ---------- Хотеллинг ---------- */

  function drawHotel(R) {
    const c = ECON.P.colors,
      x0 = 70,
      x1 = ECON.W - 70,
      y = Math.min(ECON.H * 0.5, ECON.H - 160),
      X = (t) => x0 + (x1 - x0) * t;
    ECON.ctx.lineWidth = 10;
    const loc = R.hm === 'loc',
      a = loc ? 0.5 : R.a,
      b = loc ? 0.5 : 1 - R.b,
      xh = loc ? 0.5 : R.x;
    ECON.ctx.strokeStyle = c.p1;
    ECON.ctx.globalAlpha = 0.6;
    ECON.ctx.beginPath();
    ECON.ctx.moveTo(X(0), y);
    ECON.ctx.lineTo(X(xh), y);
    ECON.ctx.stroke();
    ECON.ctx.strokeStyle = c.p2;
    ECON.ctx.beginPath();
    ECON.ctx.moveTo(X(xh), y);
    ECON.ctx.lineTo(X(1), y);
    ECON.ctx.stroke();
    ECON.ctx.globalAlpha = 1;
    ECON.txt('0', X(0), y + 24, c.axis, 13);
    ECON.txt('1', X(1), y + 24, c.axis, 13);
    const firm = (t, col, l) => {
      ECON.ctx.fillStyle = col;
      ECON.ctx.beginPath();
      ECON.ctx.moveTo(X(t), y - 14);
      ECON.ctx.lineTo(X(t) - 11, y - 36);
      ECON.ctx.lineTo(X(t) + 11, y - 36);
      ECON.ctx.closePath();
      ECON.ctx.fill();
      ECON.txt(l, X(t), y - 50, col, 15);
    };
    if (loc) {
      firm(0.5, c.eq, ECON.P.lang === 'ru' ? 'обе фирмы' : 'both firms');
      if (ECON.P.show.labels) {
        [0.2, 0.8].forEach((t) => {
          ECON.ctx.strokeStyle = c.mark;
          ECON.ctx.setLineDash([4, 4]);
          ECON.ctx.beginPath();
          ECON.ctx.moveTo(X(t), y - 70);
          ECON.ctx.lineTo(X(0.5), y - 70);
          ECON.ctx.stroke();
          ECON.ctx.setLineDash([]);
        });
        ECON.txt(
          ECON.P.lang === 'ru' ? '→ сдвиг к центру ←' : '→ move to the centre ←',
          X(0.5),
          y - 86,
          c.mark,
          13
        );
      }
      return;
    }
    firm(a, c.p1, `p₁ = ${dc(fmt(R.p[0], 3))}`);
    firm(b, c.p2, `p₂ = ${dc(fmt(R.p[1], 3))}`);
    ECON.ctx.strokeStyle = c.eq;
    ECON.ctx.lineWidth = 2;
    ECON.ctx.beginPath();
    ECON.ctx.moveTo(X(xh), y - 20);
    ECON.ctx.lineTo(X(xh), y + 20);
    ECON.ctx.stroke();
    if (ECON.P.show.labels) ECON.txt(`x̂ = ${dc(fmt(xh, 3))}`, X(xh), y + 44, c.eq, 14);
  }
  /* ---------- дерево ---------- */

  function drawTree(R) {
    const c = ECON.P.colors,
      Tr = R.T,
      lay = {},
      depth = {};
    let leafX = 0;
    const items = [];
    const place = (id, d) => {
      const n = Tr.nodes[id];
      const xs = [];
      n.acts.forEach((a, k) => {
        if (a.to) xs.push(place(a.to, d + 1));
        else {
          const lx = leafX++;
          items.push({ leaf: true, x: lx, d: d + 1, pay: a.pay, par: id, k });
          xs.push(lx);
        }
      });
      const x = (xs[0] + xs[xs.length - 1]) / 2;
      lay[id] = { x, d, kids: xs };
      depth[id] = d;
      return x;
    };
    place(Tr.root, 0);
    const maxD = Math.max(...Object.values(lay).map((o) => o.d), ...items.map((i) => i.d)),
      nL = Math.max(1, leafX - 1),
      top = ECON.pT() + 20,
      bot = ECON.H - ECON.pB() - 40,
      X = (x) => 70 + (ECON.W - 140) * (nL ? x / nL : 0.5),
      Y = (d) => top + (bot - top) * (maxD ? d / maxD : 0);
    const onPath = new Set(R.path.map(([id, k]) => id + ':' + k));
    const edge = (id, k, tx, td, lab) => {
      const o = lay[id],
        best = R.choice[id] === k,
        path = onPath.has(id + ':' + k);
      ECON.ctx.strokeStyle = best ? c.eq : c.axis;
      ECON.ctx.globalAlpha = best ? 1 : 0.4;
      ECON.ctx.lineWidth = path ? 4 : best ? 2.4 : 1.4;
      ECON.ctx.beginPath();
      ECON.ctx.moveTo(X(o.x), Y(o.d));
      ECON.ctx.lineTo(X(tx), Y(td));
      ECON.ctx.stroke();
      ECON.ctx.globalAlpha = 1;
      if (ECON.P.show.labels)
        ECON.txt(
          lab,
          (X(o.x) + X(tx)) / 2 + (tx >= o.x ? 10 : -10),
          (Y(o.d) + Y(td)) / 2,
          best ? c.eq : c.axis,
          12,
          tx >= o.x ? 'left' : 'right'
        );
    };
    for (const id in lay) {
      const n = Tr.nodes[id];
      n.acts.forEach((a, k) => {
        if (a.to) edge(id, k, lay[a.to].x, lay[a.to].d, a.a);
      });
    }
    items.forEach((it) => edge(it.par, it.k, it.x, it.d, Tr.nodes[it.par].acts[it.k].a));
    for (const id in lay) {
      const o = lay[id],
        col = [c.p1, c.p2, c.mark][(Tr.nodes[id].pl - 1) % 3];
      ECON.ctx.fillStyle = col;
      ECON.ctx.beginPath();
      ECON.ctx.arc(X(o.x), Y(o.d), 13, 0, 7);
      ECON.ctx.fill();
      ECON.txt(String(Tr.nodes[id].pl), X(o.x), Y(o.d), c.bg, 13);
      ECON.txt(id, X(o.x) - 18, Y(o.d) - 14, c.axis, 11, 'right');
    }
    items.forEach((it) =>
      ECON.txt(
        `(${it.pay.map((v) => dc(fmt(v, 2))).join('; ')})`,
        X(it.x),
        Y(it.d) + 18,
        R.path.some(([id, k]) => id === it.par && k === it.k) && !Tr.nodes[it.par].acts[it.k].to
          ? c.eq
          : c.axis,
        13
      )
    );
  }
  /* ---------- повторяющиеся ---------- */

  function drawRep(R) {
    const c = ECON.P.colors,
      r = { x: 60, y: ECON.pT(), w: ECON.W - 110, h: ECON.H - ECON.pT() - ECON.pB() - 30 };
    const mx = Math.max(...R.tot);
    const fr = ECON.frame(
      r,
      -0.6,
      STRATS.length - 0.4,
      0,
      mx * 1.15,
      false,
      ECON.P.lang === 'ru' ? 'очки в турнире' : 'tournament points',
      true
    );
    const bw = (fr.X(1) - fr.X(0)) * 0.6,
      best = Math.max(...R.tot);
    STRATS.forEach((s, i) => {
      const X = fr.X(i),
        Y = fr.Y(R.tot[i]);
      ECON.ctx.fillStyle = R.tot[i] === best ? c.eq : c.p1;
      ECON.ctx.globalAlpha = 0.8;
      ECON.ctx.fillRect(X - bw / 2, Y, bw, fr.Y(0) - Y);
      ECON.ctx.globalAlpha = 1;
      if (ECON.P.show.labels) ECON.txt(String(R.tot[i]), X, Y - 10, c.axis, 12);
      ECON.txt(s, X, fr.Y(0) + 16, c.axis, 11);
    });
  }
  /* ---------- эволюционные ---------- */

  function drawEvo(R) {
    const c = ECON.P.colors,
      h = (ECON.H - ECON.pT() - ECON.pB() - 40) / 2,
      r1 = { x: 60, y: ECON.pT(), w: ECON.W - 110, h: h * 0.9 },
      r2 = { x: 60, y: ECON.pT() + h + 30, w: ECON.W - 110, h: h * 0.9 };
    let gm = 0;
    for (let i = 0; i <= 200; i++) gm = Math.max(gm, Math.abs(R.g(i / 200)));
    gm = gm || 1;
    const f1 = ECON.frame(r1, 0, 1, -gm * 1.2, gm * 1.2, false, 'ẋ(x)');
    ECON.ctx.strokeStyle = c.curve;
    ECON.ctx.lineWidth = 2.4 * ECON.P.lw;
    ECON.ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const x = i / 200;
      i ? ECON.ctx.lineTo(f1.X(x), f1.Y(R.g(x))) : ECON.ctx.moveTo(f1.X(x), f1.Y(R.g(x)));
    }
    ECON.ctx.stroke();
    for (let i = 1; i < 10; i++) {
      const x = i / 10,
        v = R.g(x);
      if (Math.abs(v) < 1e-9) continue;
      const X = f1.X(x),
        Y = f1.Y(0),
        d = v > 0 ? 1 : -1;
      ECON.ctx.fillStyle = c.mark;
      ECON.ctx.beginPath();
      ECON.ctx.moveTo(X + d * 8, Y);
      ECON.ctx.lineTo(X - d * 6, Y - 6);
      ECON.ctx.lineTo(X - d * 6, Y + 6);
      ECON.ctx.closePath();
      ECON.ctx.fill();
    }
    const rest = [0, 1];
    if (R.xs !== null) rest.push(R.xs);
    rest.forEach((x) => {
      const st =
        (x === 1 && R.ess.includes('1')) || (x === 0 && R.ess.includes('2')) || (x === R.xs && R.mixedESS);
      ECON.dotP(f1, [x, 0], st ? c.eq : c.bad, 6, ECON.P.show.labels ? (st ? 'ESS' : '') : '');
    });
    const f2 = ECON.frame(r2, 0, 30, 0, 1, false, 'x(t)');
    R.traj.forEach((tr, i) => {
      ECON.ctx.strokeStyle = [c.p1, c.p2, c.area, c.mark][i % 4];
      ECON.ctx.lineWidth = 2;
      ECON.ctx.beginPath();
      tr.forEach(([t, x], k) => (k ? ECON.ctx.lineTo(f2.X(t), f2.Y(x)) : ECON.ctx.moveTo(f2.X(t), f2.Y(x))));
      ECON.ctx.stroke();
    });
  }
  /* ---------- голосование ---------- */

  function drawVote(R) {
    const c = ECON.P.colors,
      n = R.w.length,
      r = { x: 60, y: ECON.pT(), w: ECON.W - 110, h: ECON.H - ECON.pT() - ECON.pB() - 20 },
      mx = Math.max(...R.w.map((w) => w / R.tot), ...R.ss, ...R.bzN);
    const fr = ECON.frame(
      r,
      0.4,
      n + 0.6,
      0,
      mx * 1.2,
      false,
      ECON.P.lang === 'ru' ? 'доля веса · Шепли–Шубик · Банцаф' : 'weight share · Shapley–Shubik · Banzhaf',
      true
    );
    const bw = (fr.X(1) - fr.X(0)) * 0.26;
    R.w.forEach((w, i) => {
      const X = fr.X(i + 1);
      [
        [w / R.tot, c.axis, -1],
        [R.ss[i], c.p1, 0],
        [R.bzN[i], c.p2, 1],
      ].forEach(([v, col, o]) => {
        ECON.ctx.fillStyle = col;
        ECON.ctx.globalAlpha = o === -1 ? 0.3 : 0.8;
        ECON.ctx.fillRect(X + o * bw - bw / 2, fr.Y(v), bw, fr.Y(0) - fr.Y(v));
        ECON.ctx.globalAlpha = 1;
      });
      if (ECON.P.show.labels && n <= 8) ECON.txt(dc(fmt(R.ss[i], 3)), X, fr.Y(R.ss[i]) - 10, c.p1, 11);
      ECON.txt(String(i + 1), X, fr.Y(0) + 14, c.axis, 12);
    });
  }
  /* ---------- паросочетания ---------- */

  function drawMatch(R) {
    const c = ECON.P.colors,
      Ps = R.P,
      Rs = R.R,
      top = ECON.pT() + 20,
      bot = ECON.H - ECON.pB() - 30,
      xl = ECON.W * 0.28,
      xr = ECON.W * 0.72,
      y = (i, n) => top + (bot - top) * (n > 1 ? i / (n - 1) : 0.5);
    Object.entries(R.match).forEach(([p, r]) => {
      const i = Ps.indexOf(p),
        j = Rs.indexOf(r);
      ECON.ctx.strokeStyle = c.eq;
      ECON.ctx.lineWidth = 3;
      ECON.ctx.beginPath();
      ECON.ctx.moveTo(xl, y(i, Ps.length));
      ECON.ctx.lineTo(xr, y(j, Rs.length));
      ECON.ctx.stroke();
    });
    Ps.forEach((p, i) => {
      ECON.ctx.fillStyle = c.p1;
      ECON.ctx.beginPath();
      ECON.ctx.arc(xl, y(i, Ps.length), 10, 0, 7);
      ECON.ctx.fill();
      ECON.txt(p, xl - 18, y(i, Ps.length), c.p1, 14, 'right');
      if (ECON.P.show.labels) {
        const pr = (R.rev ? R.pb : R.pa)[p] || [];
        ECON.txt(pr.join(' > '), xl - 18, y(i, Ps.length) + 16, c.axis, 10, 'right');
      }
    });
    Rs.forEach((r, i) => {
      ECON.ctx.fillStyle = c.p2;
      ECON.ctx.beginPath();
      ECON.ctx.arc(xr, y(i, Rs.length), 10, 0, 7);
      ECON.ctx.fill();
      ECON.txt(r, xr + 18, y(i, Rs.length), c.p2, 14, 'left');
      if (ECON.P.show.labels) {
        const pr = (R.rev ? R.pa : R.pb)[r] || [];
        ECON.txt(pr.join(' > '), xr + 18, y(i, Rs.length) + 16, c.axis, 10, 'left');
      }
    });
  }
  /* ---------- Браес ---------- */

  function drawBraess(R) {
    const c = ECON.P.colors,
      cx = ECON.W / 2,
      cy = (ECON.pT() + ECON.H - ECON.pB()) / 2,
      dx = Math.min(ECON.W * 0.33, 260),
      dy = Math.min((ECON.H - ECON.pT() - ECON.pB()) * 0.36, 170);
    const A = [cx - dx, cy],
      B = [cx + dx, cy],
      C = [cx, cy - dy],
      D = [cx, cy + dy];
    const x = R.eq.x,
      N = R.N;
    const ed = (p, q, f, lab) => {
      ECON.ctx.strokeStyle = f > 1e-9 ? c.p1 : c.axis;
      ECON.ctx.globalAlpha = f > 1e-9 ? 0.9 : 0.3;
      ECON.ctx.lineWidth = 2 + (10 * f) / N;
      ECON.ctx.beginPath();
      ECON.ctx.moveTo(...p);
      ECON.ctx.lineTo(...q);
      ECON.ctx.stroke();
      ECON.ctx.globalAlpha = 1;
      if (ECON.P.show.labels) ECON.txt(lab, (p[0] + q[0]) / 2, (p[1] + q[1]) / 2 - 12, c.axis, 12);
    };
    const fAC = x[0] + x[2],
      fDB = x[1] + x[2];
    ed(A, C, fAC, `${dc(fmt(fAC, 0))}: ${dc(fmt(fAC / R.a, 1))}`);
    ed(C, B, x[0], `${dc(fmt(x[0], 0))}: ${dc(fmt(R.b, 1))}`);
    ed(A, D, x[1], `${dc(fmt(x[1], 0))}: ${dc(fmt(R.b, 1))}`);
    ed(D, B, fDB, `${dc(fmt(fDB, 0))}: ${dc(fmt(fDB / R.a, 1))}`);
    if (R.yes) ed(C, D, x[2], `${dc(fmt(x[2], 0))}: ${dc(fmt(R.e, 1))}`);
    [
      [A, 'A'],
      [B, 'B'],
      [C, 'C'],
      [D, 'D'],
    ].forEach(([p, l]) => {
      ECON.ctx.fillStyle = c.eq;
      ECON.ctx.beginPath();
      ECON.ctx.arc(p[0], p[1], 12, 0, 7);
      ECON.ctx.fill();
      ECON.txt(l, p[0], p[1], c.bg, 13);
    });
  }
  const VALS2 = {
    olig: (R, V) => VALS2_olig(R, V),
    cont: (R, V) => ECON.prop(T().v2.eqs, R.many ? String(R.grid.length) : R.eq.map(fV).join(', ') || '—'),
    bayes: (R, V) =>
      ECON.prop(T().v2.type, R.bm.pure.map(([i, j]) => `(${i + 1}; ${R.cl[j]})`).join(', ') || '—'),
    hotel: (R, V) =>
      R.hm === 'loc'
        ? ECON.prop(T().v2.eqs, '(0.5; 0.5)'.replace(/\./g, ECON.P.lang === 'ru' ? ',' : '.'))
        : ECON.prop(T().v2.p, `${fN(R.p[0], 4)}; ${fN(R.p[1], 4)}`) + ECON.prop(T().v2.x, fN(R.x, 4)),
    tree: (R, V) => ECON.prop(T().v2.pay, fV(R.v)),
    rep: (R, V) =>
      ECON.prop(T().v2.grim, fQ(R.grim)) +
      ECON.prop(T().v2.win, T().stn[STRATS[R.tot.indexOf(Math.max(...R.tot))]]),
    evo: (R, V) =>
      ECON.prop(T().v2.ess, R.ess.join(', ') || '—') + (R.xs !== null ? ECON.prop(T().v2.xs, fQ(R.xs)) : ''),
    vote: (R, V) => ECON.prop(T().v2.ss, fV(R.ss)) + ECON.prop(T().v2.bz, fV(R.bzN)),
    match: (R, V) => ECON.prop(T().v2.stable, R.block.length ? V.no : V.yes),
    braess: (R, V) => ECON.prop(T().v2.T, fN(R.eq.T, 3)) + ECON.prop(T().v2.opt, fN(R.opt.avg, 3)),
  };
  /* ---------- справочник ---------- */

  /* ---------- экспорт ---------- */

  function renderTex() {
    const ta = $('#xTex');
    if (!ta) return;
    if (S.err || !S.res) {
      ta.value = '';
      return;
    }
    const R = S.res,
      t = S.topic,
      a = unesc((S.ans || '').replace(/<[^>]+>/g, ''));
    if (ECON.fmtMode === 'txt') {
      ta.value = `${T()['t_' + t]}\n${a}`;
      return;
    }
    if (ECON.fmtMode === 'tex') {
      ta.value = a.replace(/≈/g, '\\approx ').replace(/φ/g, '\\varphi ');
      return;
    }
    const J = (x) => JSON.stringify(x);
    let py = '';
    if (t === 'mat')
      py =
        R.kind === 'zs'
          ? `import numpy as np\nfrom scipy.optimize import linprog\nA = np.array(${J(R.A)})\nm, n = A.shape\n# max v: A^T p >= v, sum p = 1\nres = linprog(c=[0]*m + [-1], A_ub=np.hstack([-A.T, np.ones((n, 1))]), b_ub=np.zeros(n), A_eq=[[1]*m + [0]], b_eq=[1], bounds=[(0, None)]*m + [(None, None)])\nprint(res.x[:m], res.x[m])`
          : `import nashpy as nash  # pip install nashpy\nA = ${J(R.A)}\nB = ${J(R.B)}\nprint(list(nash.Game(A, B).support_enumeration()))`;
    else if (t === 'cour')
      py = `M, c = ${R.M}, ${J(R.cs)}\nN = len(c)\nQ = (N*M - sum(c)) / (N + 1)\nprint([M - ci - Q for ci in c], M - Q)`;
    else if (t === 'barg')
      py = `# M = conv${J(R.pts)}, d = ${J(R.d)}\n# Nash: max (x1 - d1)(x2 - d2) on the Pareto frontier\nprint(${J(R.nash ? R.nash.x : null)}, ${J(R.ks ? R.ks.x : null)})`;
    else if (t === 'coop')
      py = `from itertools import permutations\nn = ${R.n}\nv = ${J(Object.fromEntries(coalitions(R.n).map((K) => [K, R.v[K]])))}  # v[mask]\nphi = [0]*n\nfor p in permutations(range(n)):\n    m = 0\n    for i in p:\n        phi[i] += v.get(m | 1 << i, 0) - v.get(m, 0); m |= 1 << i\nimport math\nprint([x / math.factorial(n) for x in phi])`;
    else py = `n, w = ${R.n}, ${R.w}\nprint('1st price bid:', (n-1)/n*${R.v}, 'revenue:', w*(n-1)/(n+1))`;
    ta.value = py;
  }

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
      toast(ECON.P.lang === 'ru' ? list[i][2] : list[i][3]);
    } else if (c === 'KeyG') ECON.flip('bgGrid');
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

  ECON.start();
})();
