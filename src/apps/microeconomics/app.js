import { createEconApp } from '../../shared/econ/app.js';
import { applyTexts, createSettings } from '../../shared/settings.js';
import { createKeys, onShortcut } from '../../shared/keys.js';
import { KEYS } from './content/keys.js';
import { createExport } from '../../shared/export.js';
import { createPanels } from '../../shared/panels.js';
import { loadPrefs, makeSaver } from '../../shared/prefs.js';
import { closeDrawers, initDrawers, openDrawer } from '../../shared/drawers.js';
import { createGlossary } from '../../shared/glossary.js';
import { toast } from '../../shared/toast.js';
import {
  SOLVE,
  fp,
  solveCap,
  solveExt,
  solveLabor,
  solveMC,
  solveOlig,
  solvePG,
  solvePPF,
  solveProd,
} from './solvers/steps.js';
import {
  COMP,
  E,
  compCap,
  compExt,
  compLabor,
  compMC,
  compOlig,
  compPG,
  compPPF,
  compProd,
  nI,
} from './solvers/compute.js';
import { DELTAS, FORMS, GROUPS, PRE, TOPICS, spanP, spanW } from './content/topics.js';
import {
  PSof,
  Pof,
  arcE,
  argminPos,
  competitive,
  consumer,
  costs,
  cross,
  discrim3,
  elastAt,
  extern,
  fvAnn,
  fxy,
  hhi,
  irr,
  linPQ,
  market,
  minCost,
  monopoly,
  monopsony,
  nper,
  npv,
  oligo2,
  pmt,
  ppf,
  prodLong,
  pvAnn,
  qof,
  roots1,
  rts,
  shiftUp,
  slutsky,
} from './solvers/model.js';
import { CHAP, DEMOS, FORMAL, ILL, REL, TERMS, T_ } from './content/glossary.js';
import { T, TX, TXM2 } from './content/tx.js';
import { $, clone } from '../../shared/dom.js';
import { dc } from '../../shared/format.js';
import { lang, langFrom } from '../../shared/i18n.js';
import { fN, fV, fmt } from '../../shared/format.js';
import { TXB } from '../../shared/econ/txb.js';
import { exprXY, numG } from '../../shared/econ/expr-xy.js';
(() => {
  'use strict';
  /* ---------- выражения от двух переменных x, y ---------- */

  /* ---------- микроэкономика: математика ---------- */
  // линейная связь P и q из строки вида "P = 20 - 2q", "q = 6000 - 50P", "Qd = 100 - 2P", "2P + q = 40"

  // излишки: точные интегралы кусочно-линейных функций

  /* эластичность линейного спроса */

  /* потребитель */

  /* издержки: VC(q) как функция */

  /* ---------- часть 2 ---------- */

  /* КПВ по таблице альтернатив */

  /* производство */

  /* олигополия: P = a - bQ, TCi = ci q + di q^2 */

  /* рынок труда */

  /* капитал */

  /* внешние эффекты и общественные блага */

  const KEY = 'micro-viz-v1';

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

  const PANELS = ['topic', 'presets', 'solve', 'factors', 'values', 'show', 'export'];
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
    show: { bgGrid: true, coords: true, labels: true, areas: true, hints: true },
    topic: 'sd',
    inp: null,
    preset: null,
  };

  // настройки: схема 2, миграция со схемы 1, -bak, предупреждение при переполнении (src/shared/prefs.js)

  /* ---------- примеры (задачи Серякова, ВАВТ) ---------- */

  const q4 = (v) => dc(String(+(+v).toFixed(4)));

  const SHOCKS = {
    sd: [
      {
        id: 'inc',
        ru: 'Рост доходов (нормальное благо)',
        en: 'Higher incomes (normal good)',
        c: 'D вправо',
        cen: 'D right',
        set: (I) => ({ shD: q4(spanP(I)) }),
      },
      {
        id: 'incI',
        ru: 'Рост доходов (низшее благо)',
        en: 'Higher incomes (inferior good)',
        c: 'D влево',
        cen: 'D left',
        set: (I) => ({ shD: q4(-spanP(I)) }),
      },
      {
        id: 'sub',
        ru: 'Подорожание товара-заменителя',
        en: 'A substitute gets pricier',
        c: 'D вправо',
        cen: 'D right',
        set: (I) => ({ shD: q4(spanP(I)) }),
      },
      {
        id: 'comp',
        ru: 'Подорожание товара-дополнителя',
        en: 'A complement gets pricier',
        c: 'D влево',
        cen: 'D left',
        set: (I) => ({ shD: q4(-spanP(I)) }),
      },
      {
        id: 'exp',
        ru: 'Ожидание роста цен',
        en: 'Expected future price rise',
        c: 'D вправо',
        cen: 'D right',
        set: (I) => ({ shD: q4(spanP(I)) }),
      },
      {
        id: 'buy',
        ru: 'Рост числа покупателей',
        en: 'More buyers',
        c: 'D вправо',
        cen: 'D right',
        set: (I) => ({ shD: q4(spanP(I)) }),
      },
      {
        id: 'cost',
        ru: 'Подорожание ресурсов',
        en: 'Inputs get pricier',
        c: 'S влево (вверх)',
        cen: 'S left (up)',
        set: (I) => ({ shS: q4(spanP(I)) }),
      },
      {
        id: 'tech',
        ru: 'Новая технология',
        en: 'New technology',
        c: 'S вправо (вниз)',
        cen: 'S right (down)',
        set: (I) => ({ shS: q4(-spanP(I)) }),
      },
      {
        id: 'sel',
        ru: 'Рост числа продавцов',
        en: 'More sellers',
        c: 'S вправо',
        cen: 'S right',
        set: (I) => ({ shS: q4(-spanP(I)) }),
      },
      {
        id: 'both',
        ru: 'Рост доходов и новая технология',
        en: 'Higher incomes and new technology',
        c: 'D и S вправо: q растёт, направление P зависит от силы сдвигов',
        cen: 'D and S right: q rises, the direction of P depends on the size of the shifts',
        set: (I) => ({ shD: q4(spanP(I)), shS: q4(-spanP(I)) }),
      },
    ],
    cons: [
      {
        id: 'inc',
        ru: 'Рост дохода I',
        en: 'Higher income I',
        c: 'бюджетная линия параллельно вправо',
        cen: 'budget line shifts out',
        set: (I) => ({ dI: q4(nI(I.I) * 0.3) }),
      },
      {
        id: 'incd',
        ru: 'Снижение дохода I',
        en: 'Lower income I',
        c: 'бюджетная линия параллельно влево',
        cen: 'budget line shifts in',
        set: (I) => ({ dI: q4(-nI(I.I) * 0.3) }),
      },
      {
        id: 'pxd',
        ru: 'Удешевление X',
        en: 'X gets cheaper',
        c: 'бюджетная линия поворачивается наружу',
        cen: 'budget line rotates out',
        set: (I) => ({ px2: q4(nI(I.px) * 0.7) }),
      },
      {
        id: 'pxu',
        ru: 'Подорожание X',
        en: 'X gets pricier',
        c: 'бюджетная линия поворачивается внутрь',
        cen: 'budget line rotates in',
        set: (I) => ({ px2: q4(nI(I.px) * 1.5) }),
      },
    ],
    labor: [
      {
        id: 'p',
        ru: 'Рост цены продукции',
        en: 'Higher output price',
        c: 'спрос на труд (MRP) вправо',
        cen: 'labor demand (MRP) right',
        set: (I) => ({ dDl: q4(spanW(I)) }),
      },
      {
        id: 'tech',
        ru: 'Рост производительности',
        en: 'Higher productivity',
        c: 'спрос на труд вправо',
        cen: 'labor demand right',
        set: (I) => ({ dDl: q4(spanW(I)) }),
      },
      {
        id: 'imm',
        ru: 'Иммиграция',
        en: 'Immigration',
        c: 'предложение труда вправо',
        cen: 'labor supply right',
        set: (I) => ({ dSl: q4(-spanW(I)) }),
      },
      {
        id: 'alt',
        ru: 'Рост заработков в других отраслях',
        en: 'Higher pay in other industries',
        c: 'предложение труда влево',
        cen: 'labor supply left',
        set: (I) => ({ dSl: q4(spanW(I)) }),
      },
    ],
  };

  const EFFV = {
    sd: (R, b) => ({ P: R.E.P, q: R.E.q, CS: R.CS, PS: R.PS }),
    cons: (R, b) => {
      const x = b ? R.A : R.B || R.A;
      return { x: x.x, y: x.y, U: x.U };
    },
    labor: (R, b) =>
      R.lm === 'mkt' ? { w: R.E.P, L: R.E.q, [ECON.P.lang === 'ru' ? 'рента' : 'rent']: R.rent } : {},
  };

  const ECON = createEconApp({
    appName: 'microeconomics',
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
    topic: TOPICS.includes(ECON.P.topic) ? ECON.P.topic : 'sd',
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
    S.shock = null;
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
        S.shock = null;
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
    const r = SOLVE[S.topic](S.res);
    S.ans = r.ans;
    box.innerHTML = `<p class="idea">${L.tt[S.topic]}</p>${typeof shockNote === 'function' ? shockNote() : ''}${ECON.ol(r.st)}<div class="ans"><div class="k">${L.ans}</div><div class="big">${r.ans}</div></div>`;
  }

  /* ---------- решения ---------- */

  function shockNote() {
    const t = S.topic;
    if (!S.shock || !SHOCKS[t]) return '';
    const sh = SHOCKS[t].find((s) => s.id === S.shock);
    return sh
      ? `<p class="idea"><b>${sh[ECON.P.lang] || sh.ru}:</b> ${ECON.P.lang === 'en' ? sh.cen : sh.c}</p>`
      : '';
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
    if (VALS2[t]) h = VALS2[t](R, V);
    else if (t === 'sd') {
      h =
        ECON.prop('q*', fp(R.E.q)) +
        ECON.prop('P*', fp(R.E.P)) +
        ECON.prop(V.CS, fp(R.CS)) +
        ECON.prop(V.PS, fp(R.PS));
      if (R.DWL != null) h += ECON.prop(V.DWL, fp(R.DWL));
    } else if (t === 'el') {
      h =
        R.em === 'pts'
          ? ECON.prop('E', fN(R.E, 4))
          : ECON.prop('P (|E| = 1)', fp(R.Pmid)) +
            ECON.prop('TR max', fp(R.TRmax)) +
            (R.E != null ? ECON.prop('E', fN(R.E, 4)) : '') +
            (R.Earc != null ? ECON.prop(V.arc, fN(R.Earc, 4)) : '');
    } else if (t === 'cons') {
      h = ECON.prop('x*', fp(R.A.x)) + ECON.prop('y*', fp(R.A.y)) + ECON.prop('U', fp(R.A.U));
      if (R.px2) h += ECON.prop(V.sub, fp(R.subH)) + ECON.prop(V.inc, fp(R.incH));
    } else if (t === 'cost')
      h =
        ECON.prop('min AVC', `${fp(R.mAVC.v)} (q = ${fp(R.mAVC.q)})`) +
        ECON.prop('min AC', `${fp(R.mAC.v)} (q = ${fp(R.mAC.q)})`) +
        ECON.prop('min MC', `${fp(R.mMC.v)} (q = ${fp(R.mMC.q)})`);
    else if (t === 'comp')
      h =
        ECON.prop('q*', fp(R.q)) +
        ECON.prop(V.profit, fp(R.profit)) +
        ECON.prop(V.shutP, fp(R.minAVC.v)) +
        ECON.prop(V.beP, fp(R.minAC.v));
    else
      h =
        R.dm === 'disc'
          ? ECON.prop('P₁', fp(R.r1.P)) + ECON.prop('P₂', fp(R.r2.P)) + ECON.prop(V.profit, fp(R.pr1 + R.pr2))
          : ECON.prop('q', fp(R.q)) +
            ECON.prop('P', fp(R.P)) +
            ECON.prop(V.profit, fp(R.profit)) +
            ECON.prop(V.lerner, fN(R.lerner, 4)) +
            ECON.prop(V.DWL, fp(R.DWL));
    box.innerHTML = h;
  }
  function capKey() {
    return S.topic;
  }
  function relTogs() {
    const t = S.topic,
      G = ['bgGrid', 'coords'];
    const m = {
      sd: [...G, 'labels', 'areas'],
      el: [...G, 'labels', 'areas'],
      cons: [...G, 'labels'],
      cost: [...G, 'labels'],
      comp: [...G, 'labels', 'areas'],
      mono: [...G, 'labels', 'areas'],
      ppf: [...G, 'labels', 'areas'],
      prod: [...G, 'labels'],
      mc: [...G, 'labels'],
      olig: [...G, 'labels'],
      labor: [...G, 'labels', 'areas'],
      cap: [...G, 'labels'],
      ext: [...G, 'labels', 'areas'],
      pg: [...G, 'labels'],
    };
    return [...(m[t] || []), 'hints'];
  }

  /* ---------- часть 2: решения ---------- */

  const VALS2 = {
    ppf: (R, V) =>
      ECON.prop(V.inc2, R.incr ? V.yes : V.no) + (R.where ? ECON.prop(V.pt, T().f_ans[R.where]) : ''),
    prod: (R, V) =>
      R.pm === 'short'
        ? (R.apMax < R.Lmax * 0.01 ? '' : ECON.prop('max AP', `L = ${fp(R.apMax)}`)) +
          (R.mpZero != null ? ECON.prop('MP = 0', `L = ${fp(R.mpZero)}`) : '')
        : ECON.prop('L', fp(R.L)) +
          ECON.prop('K', fp(R.K)) +
          (R.q != null ? ECON.prop('q', fp(R.q)) : ECON.prop('TC', fp(R.C))),
    mc: (R, V) =>
      ECON.prop('q', fp(R.q)) +
      ECON.prop('P', fp(R.P)) +
      ECON.prop(V.profit, fp(R.profit)) +
      ECON.prop(V.excess, fp(R.excess)),
    olig: (R, V) =>
      R.om === 'hhi'
        ? ECON.prop('HHI', fp(R.H))
        : ECON.prop('q₁', fp(R.sel.q[0])) + ECON.prop('q₂', fp(R.sel.q[1])) + ECON.prop('P', fp(R.sel.P)),
    labor: (R, V) =>
      R.lm === 'firm'
        ? ECON.prop('L', fp(R.L)) + ECON.prop('q', fp(R.q))
        : R.lm === 'mkt'
          ? ECON.prop('L', fp(R.E.q)) + ECON.prop('w', fp(R.E.P)) + ECON.prop(V.rent2, fp(R.rent))
          : ECON.prop('L', fp(R.L)) + ECON.prop('w', fp(R.w)) + ECON.prop('MRP', fp(R.mrp)),
    cap: (R, V) =>
      ECON.prop(V.res, fp(R.v)) + (R.irr != null ? ECON.prop('IRR', fN(R.irr * 100, 3) + '%') : ''),
    ext: (R, V) => ECON.prop(V.qm, fp(R.m.q)) + ECON.prop(V.qs, fp(R.s.q)) + ECON.prop(V.DWL, fp(R.DWL)),
    pg: (R, V) => ECON.prop('q*', fp(R.qPub)),
  };

  function renderAll() {
    ECON.syncTogVis();
    if (typeof renderFactors === 'function') renderFactors();
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
    DRAGS.length = 0;
    ECON.ctx.setTransform(ECON.DPR, 0, 0, ECON.DPR, 0, 0);
    ECON.ctx.fillStyle = ECON.P.colors.bg;
    ECON.ctx.fillRect(0, 0, ECON.W, ECON.H);
    if (!S.res || S.err || !ECON.W) return;
    ({ sd: drawSD, el: drawEl, cons: drawCons, cost: drawCost, comp: drawComp, mono: drawMono, ...DRAW2 })[
      S.topic
    ](S.res);
    if (S.stamp) {
      const t = (S.ans || '').replace(/<[^>]+>/g, '');
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
  const RR = () => ({ x: 64, y: ECON.pT(), w: ECON.W - 110, h: ECON.H - ECON.pT() - ECON.pB() });
  function polyF(fr, pts, col, al) {
    if (!ECON.P.show.areas || pts.length < 3) return;
    ECON.ctx.save();
    ECON.ctx.beginPath();
    ECON.ctx.rect(fr.r.x, fr.r.y, fr.r.w, fr.r.h);
    ECON.ctx.clip();
    ECON.ctx.beginPath();
    pts.forEach((p, i) => {
      const X = fr.X(p[0]),
        Y = fr.Y(p[1]);
      i ? ECON.ctx.lineTo(X, Y) : ECON.ctx.moveTo(X, Y);
    });
    ECON.ctx.closePath();
    ECON.ctx.fillStyle = col;
    ECON.ctx.globalAlpha = al;
    ECON.ctx.fill();
    ECON.ctx.globalAlpha = 1;
    ECON.ctx.restore();
  }
  function curve(fr, f, x0, x1, col, w = 2.4, dash) {
    ECON.ctx.save();
    ECON.ctx.beginPath();
    ECON.ctx.rect(fr.r.x - 2, fr.r.y - 2, fr.r.w + 4, fr.r.h + 4);
    ECON.ctx.clip();
    ECON.ctx.strokeStyle = col;
    ECON.ctx.lineWidth = w * ECON.P.lw;
    ECON.ctx.setLineDash(dash || []);
    ECON.ctx.beginPath();
    let pen = false;
    for (let i = 0; i <= 600; i++) {
      const x = x0 + ((x1 - x0) * i) / 600,
        y = f(x);
      if (!isFinite(y) || Math.abs(y) > 1e9) {
        pen = false;
        continue;
      }
      const X = fr.X(x),
        Y = Math.max(-1e5, Math.min(1e5, fr.Y(y)));
      pen ? ECON.ctx.lineTo(X, Y) : ECON.ctx.moveTo(X, Y);
      pen = true;
    }
    ECON.ctx.stroke();
    ECON.ctx.setLineDash([]);
    ECON.ctx.restore();
  }
  function lab(fr, x, y, s, col, al = 'left') {
    if (ECON.P.show.labels) ECON.txt(s, fr.X(x) + (al === 'left' ? 8 : -8), fr.Y(y) - 10, col, 13, al);
  }
  function hline(fr, y, x0, x1, col, dash = [5, 4]) {
    ECON.ctx.strokeStyle = col;
    ECON.ctx.lineWidth = 1.4;
    ECON.ctx.setLineDash(dash);
    ECON.ctx.beginPath();
    ECON.ctx.moveTo(fr.X(x0), fr.Y(y));
    ECON.ctx.lineTo(fr.X(x1), fr.Y(y));
    ECON.ctx.stroke();
    ECON.ctx.setLineDash([]);
  }
  function vline2(fr, x, y0, y1, col, dash = [5, 4]) {
    ECON.ctx.strokeStyle = col;
    ECON.ctx.lineWidth = 1.4;
    ECON.ctx.setLineDash(dash);
    ECON.ctx.beginPath();
    ECON.ctx.moveTo(fr.X(x), fr.Y(y0));
    ECON.ctx.lineTo(fr.X(x), fr.Y(y1));
    ECON.ctx.stroke();
    ECON.ctx.setLineDash([]);
  }
  function drawSD(R) {
    const c = ECON.P.colors,
      D = R.D,
      Sp = R.S;
    const qD = D.kind === 'lin' ? -D.a / D.b : R.E.q * 2;
    const qx = Math.max(qD, R.E.q * 1.6, R.qd || 0, R.qs || 0) * 1.08;
    const Pm = Math.max(D.kind === 'lin' ? D.a : R.E.P * 2, R.Pb || 0, R.E.P * 1.5) * 1.08;
    const fr = ECON.frame(RR(), 0, qx, 0, Pm, false, 'P ↑   q →');
    const Dq = (q) => Pof(D, q),
      Sq = (q) => Math.max(0, Pof(Sp, q));
    const E = R.E;
    if (R.iv === 'tax' || R.iv === 'sub') {
      const q = R.q2,
        Pb = R.Pb,
        Ps = R.Ps;
      polyF(
        fr,
        [
          [0, D.a],
          [0, Pb],
          [q, Pb],
        ],
        c.p1,
        0.28
      );
      polyF(fr, [[0, Ps], [q, Ps], ...psPts(Sp, q, Ps)], c.p2, 0.28);
      polyF(
        fr,
        [
          [0, Pb],
          [q, Pb],
          [q, Ps],
          [0, Ps],
        ],
        c.mark,
        0.25
      );
      polyF(
        fr,
        [
          [q, Pb],
          [q, Ps],
          [E.q, E.P],
        ],
        c.bad,
        0.45
      );
    } else if ((R.iv === 'ceil' || R.iv === 'floor' || R.iv === 'quota') && R.bind) {
      const q = R.q2,
        Pp = R.iv === 'quota' ? R.Pb : R.P2;
      polyF(
        fr,
        [
          [0, D.a],
          [0, Pp],
          [q, Pp],
        ],
        c.p1,
        0.28
      );
      polyF(fr, [[0, Pp], [q, Pp], ...psPts(Sp, q, Pp)], c.p2, 0.28);
      polyF(
        fr,
        [
          [q, Dq(q)],
          [q, Sq(q)],
          [E.q, E.P],
        ],
        c.bad,
        0.45
      );
    } else if (D.kind === 'lin') {
      polyF(
        fr,
        [
          [0, D.a],
          [0, E.P],
          [E.q, E.P],
        ],
        c.p1,
        0.28
      );
      polyF(fr, [[0, E.P], [E.q, E.P], ...psPts(Sp, E.q, E.P)], c.p2, 0.28);
    }
    const line = (L, col, dash) => {
      if (L.kind === 'vert') {
        vline2(fr, L.q0, 0, Pm, col, dash || []);
        return;
      }
      curve(fr, (q) => Pof(L, q), 0, qx, col, 2.6, dash);
    };
    if (R.D0 && ECON.P.show.areas) {
      if (R.shD) curve(fr, (q) => Pof(R.D0, q), 0, qx, c.p1, 1.4, [4, 5]);
      if (R.shS) curve(fr, (q) => Pof(R.S0, q), 0, qx, c.p2, 1.4, [4, 5]);
      ECON.dotP(fr, [R.E0.q, R.E0.P], c.axis, 4, ECON.P.show.labels ? 'E₀' : '');
    }
    line(D, c.p1);
    line(Sp, c.p2);
    if (D.kind === 'lin') addDrag(fr, 'fy', (q) => Pof(D, q), 'shD', 1);
    if (Sp.kind === 'lin' || Sp.kind === 'horiz') addDrag(fr, 'fy', (q) => Pof(Sp, q), 'shS', 1);
    if (R.S2) line(R.S2, c.p2, [7, 5]);
    lab(fr, qx * 0.02, Pof(D, qx * 0.02), 'D', c.p1);
    lab(fr, qx * 0.9, Pof(Sp, qx * 0.9), 'S', c.p2);
    if (R.S2) lab(fr, qx * 0.8, Pof(R.S2, qx * 0.8), R.iv === 'tax' ? 'S + t' : 'S − s', c.p2);
    hline(fr, E.P, 0, E.q, c.axis);
    vline2(fr, E.q, 0, E.P, c.axis);
    ECON.dotP(
      fr,
      [E.q, E.P],
      c.eq,
      6,
      ECON.P.show.labels ? `E (${dc(fmt(E.q, 2))}; ${dc(fmt(E.P, 2))})` : 'E'
    );
    if (R.iv === 'ceil' || R.iv === 'floor') {
      hline(fr, R.v, 0, qx, c.mark, []);
      lab(fr, qx * 0.98, R.v, R.iv === 'ceil' ? 'Pmax' : 'Pmin', c.mark, 'right');
      if (R.bind) {
        ECON.dotP(fr, [R.qs, R.v], c.p2, 4);
        ECON.dotP(fr, [R.qd, R.v], c.p1, 4);
        if (ECON.P.show.labels)
          ECON.txt(
            `${R.iv === 'ceil' ? (ECON.P.lang === 'ru' ? 'дефицит' : 'shortage') : ECON.P.lang === 'ru' ? 'избыток' : 'surplus'} ${dc(fmt(R.gap, 2))}`,
            fr.X((R.qs + R.qd) / 2),
            fr.Y(R.v) + (R.iv === 'ceil' ? 18 : -18),
            c.mark,
            13
          );
      }
    }
    if (R.q2 != null && (R.iv === 'tax' || R.iv === 'sub' || R.iv === 'quota')) {
      ECON.dotP(
        fr,
        [R.q2, R.Pb],
        c.p1,
        5,
        ECON.P.show.labels ? (ECON.P.lang === 'ru' ? 'P пок' : 'P buy') : ''
      );
      ECON.dotP(
        fr,
        [R.q2, R.Ps],
        c.p2,
        5,
        ECON.P.show.labels ? (ECON.P.lang === 'ru' ? 'P прод' : 'P sell') : ''
      );
    }
  }
  function psPts(S, q, Ps) {
    if (S.kind === 'horiz')
      return [
        [q, S.P0],
        [0, S.P0],
      ];
    const z = S.kind === 'lin' ? -S.a / S.b : 0;
    if (S.kind === 'lin' && S.a < 0 && z > 0 && z < q)
      return [
        [q, Pof(S, q)],
        [z, 0],
        [0, 0],
      ];
    if (S.kind === 'lin')
      return [
        [q, Pof(S, q)],
        [0, Math.max(0, S.a)],
      ];
    return [
      [q, 0],
      [0, 0],
    ];
  }
  function drawEl(R) {
    const c = ECON.P.colors;
    if (R.em === 'pts') {
      const fr = ECON.frame(
        RR(),
        0,
        Math.max(R.q1, R.q2) * 1.3,
        0,
        Math.max(R.x1, R.x2) * 1.3,
        false,
        (R.ek === 'price' ? 'P' : R.ek === 'inc' ? 'I' : 'P_y') + ' ↑   q →'
      );
      ECON.seg(fr, [R.q1, R.x1], [R.q2, R.x2], c.curve, 2.6);
      ECON.dotP(fr, [R.q1, R.x1], c.p1, 6, '1');
      ECON.dotP(fr, [R.q2, R.x2], c.p1, 6, '2');
      if (ECON.P.show.labels)
        ECON.txt(
          `E = ${dc(fmt(R.E, 3))}`,
          fr.X((R.q1 + R.q2) / 2) + 14,
          fr.Y((R.x1 + R.x2) / 2),
          c.eq,
          16,
          'left'
        );
      return;
    }
    const r = RR(),
      h1 = r.h * 0.58,
      r1 = { x: r.x, y: r.y, w: r.w, h: h1 },
      r2 = { x: r.x, y: r.y + h1 + 28, w: r.w, h: r.h - h1 - 28 };
    const fr = ECON.frame(r1, 0, R.qmax * 1.05, 0, R.a * 1.08, false, 'P ↑   q →');
    ECON.ctx.strokeStyle = c.p1;
    ECON.ctx.lineWidth = 3 * ECON.P.lw;
    ECON.ctx.beginPath();
    ECON.ctx.moveTo(fr.X(0), fr.Y(R.a));
    ECON.ctx.lineTo(fr.X(R.qmid), fr.Y(R.Pmid));
    ECON.ctx.stroke();
    ECON.ctx.strokeStyle = c.p2;
    ECON.ctx.beginPath();
    ECON.ctx.moveTo(fr.X(R.qmid), fr.Y(R.Pmid));
    ECON.ctx.lineTo(fr.X(R.qmax), fr.Y(0));
    ECON.ctx.stroke();
    if (ECON.P.show.labels) {
      ECON.txt('|E| > 1', fr.X(R.qmid * 0.45) + 18, fr.Y(R.a - (R.a - R.Pmid) * 0.45), c.p1, 13, 'left');
      ECON.txt('|E| < 1', fr.X(R.qmid * 1.5) + 18, fr.Y(R.Pmid * 0.5), c.p2, 13, 'left');
    }
    ECON.dotP(fr, [R.qmid, R.Pmid], c.eq, 5, ECON.P.show.labels ? '|E| = 1' : '');
    const pts =
      R.em === 'arc'
        ? [
            [R.q1, R.p1],
            [R.q2, R.p2],
          ]
        : [[R.q, R.P]];
    pts.forEach(([q, p]) => {
      hline(fr, p, 0, q, c.axis);
      vline2(fr, q, 0, p, c.axis);
      ECON.dotP(fr, [q, p], c.mark, 6);
      if (ECON.P.show.areas && R.em !== 'find') {
        ECON.ctx.fillStyle = c.mark;
        ECON.ctx.globalAlpha = 0.12;
        ECON.ctx.fillRect(fr.X(0), fr.Y(p), fr.X(q) - fr.X(0), fr.Y(0) - fr.Y(p));
        ECON.ctx.globalAlpha = 1;
      }
    });
    const f2 = ECON.frame(r2, 0, R.qmax * 1.05, 0, R.TRmax * 1.2, false, 'TR(q)');
    curve(f2, (q) => q * Pof(R.D, q), 0, R.qmax, c.area, 2.6);
    ECON.dotP(f2, [R.qmid, R.TRmax], c.eq, 5, ECON.P.show.labels ? 'TR max' : '');
    pts.forEach(([q, p]) => ECON.dotP(f2, [q, q * p], c.mark, 5));
  }
  function drawCons(R) {
    const c = ECON.P.colors,
      A = R.A;
    const xm =
        Math.max(R.I / R.px, R.px2 ? R.I / R.px2 : 0, R.Is && R.px2 ? R.Is / R.px2 : 0, R.H ? R.H.x : 0) *
        1.12,
      ym = Math.max(R.I / R.py, R.Is ? R.Is / R.py : 0, R.H ? R.H.y : 0) * 1.12;
    const fr = ECON.frame(RR(), 0, xm, 0, ym, false, 'y ↑   x →');
    const bud = (Iv, px, col, dash) => ECON.seg(fr, [0, Iv / R.py], [Iv / px, 0], col, 2.4, dash);
    const ic = (U, col, dash) => {
      if (R.t === 'cd') {
        curve(fr, (x) => Math.pow(U / Math.pow(x, R.al), 1 / R.be), xm * 0.01, xm, col, 2, dash);
      } else if (R.t === 'sub') {
        ECON.seg(fr, [0, U / R.be], [U / R.al, 0], col, 2, dash);
      } else {
        const x0 = U / R.al,
          y0 = U / R.be;
        ECON.seg(fr, [x0, ym], [x0, y0], col, 2, dash);
        ECON.seg(fr, [x0, y0], [xm, y0], col, 2, dash);
      }
    };
    if (R.A0 && ECON.P.show.labels) {
      ECON.seg(fr, [0, R.I0 / R.py], [R.I0 / R.px, 0], c.p2, 1.4, [4, 5]);
      ECON.dotP(fr, [R.A0.x, R.A0.y], c.axis, 4, 'A₀');
    }
    bud(R.I, R.px, c.p2);
    ic(A.U, c.p1);
    addDrag(fr, 'fy', (x) => (R.I - R.px * x) / R.py, 'dI', R.py);
    ECON.dotP(
      fr,
      [A.x, A.y],
      c.eq,
      6,
      ECON.P.show.labels ? `A (${dc(fmt(A.x, 2))}; ${dc(fmt(A.y, 2))})` : 'A'
    );
    if (R.px2) {
      bud(R.I, R.px2, c.p2, [7, 5]);
      ic(R.B.U, c.p1, [6, 4]);
      ECON.dotP(
        fr,
        [R.B.x, R.B.y],
        c.eq,
        6,
        ECON.P.show.labels ? `B (${dc(fmt(R.B.x, 2))}; ${dc(fmt(R.B.y, 2))})` : 'B'
      );
      bud(R.H.I, R.px2, c.mark, [3, 4]);
      ECON.dotP(fr, [R.H.x, R.H.y], c.mark, 6, ECON.P.show.labels ? 'C' : 'C');
      if (ECON.P.show.labels) {
        const y0 = fr.Y(0) + 26;
        const arrow = (a, b, col, l) => {
          ECON.ctx.strokeStyle = col;
          ECON.ctx.lineWidth = 2;
          ECON.ctx.beginPath();
          ECON.ctx.moveTo(fr.X(a), y0);
          ECON.ctx.lineTo(fr.X(b), y0);
          ECON.ctx.stroke();
          ECON.txt(l, (fr.X(a) + fr.X(b)) / 2, y0 + 12, col, 11);
        };
      }
    }
    if (ECON.P.show.labels)
      ECON.txt(
        `MRS = ${R.t === 'cd' ? dc(fmt(R.MRS, 3)) : '—'}, px/py = ${dc(fmt(R.px / R.py, 3))}`,
        fr.r.x + fr.r.w - 6,
        fr.r.y + 10,
        c.axis,
        12,
        'right'
      );
  }
  function drawCost(R) {
    const c = ECON.P.colors,
      C = R.C,
      qm = R.qmax;
    const r = RR(),
      h1 = r.h * 0.56,
      r1 = { x: r.x, y: r.y, w: r.w, h: h1 },
      r2 = { x: r.x, y: r.y + h1 + 28, w: r.w, h: r.h - h1 - 28 };
    const ymax = Math.max(R.mAC.v, R.mAVC.v, C.MC(R.mAC.q)) * 2.6 || 1;
    const fr = ECON.frame(
      r1,
      0,
      qm,
      0,
      ymax,
      false,
      ECON.P.lang === 'ru' ? 'средние и предельные' : 'average and marginal'
    );
    curve(fr, C.MC, qm * 0.005, qm, c.bad, 2.6);
    curve(fr, C.AC, qm * 0.01, qm, c.p1, 2.6);
    curve(fr, C.AVC, qm * 0.005, qm, c.p2, 2.4);
    if (R.FC > 0) curve(fr, C.AFC, qm * 0.02, qm, c.mark, 1.6, [5, 4]);
    ECON.dotP(fr, [R.mAVC.q, R.mAVC.v], c.p2, 5, ECON.P.show.labels ? 'min AVC' : '');
    ECON.dotP(fr, [R.mAC.q, R.mAC.v], c.p1, 5, ECON.P.show.labels ? 'min AC' : '');
    if (ECON.P.show.labels) {
      const lq = qm * 0.92;
      ECON.txt('MC', fr.X(lq), fr.Y(C.MC(lq)) - 10, c.bad, 13);
      ECON.txt('AC', fr.X(lq), fr.Y(C.AC(lq)) + 12, c.p1, 13);
      ECON.txt('AVC', fr.X(lq) - 30, fr.Y(C.AVC(lq)) + 12, c.p2, 13);
    }
    const tm = C.TC(qm) * 1.1 || 1;
    const f2 = ECON.frame(r2, 0, qm, 0, tm, false, ECON.P.lang === 'ru' ? 'совокупные' : 'totals');
    curve(f2, C.TC, 0, qm, c.p1, 2.4);
    curve(f2, C.VC, 0, qm, c.p2, 2.2);
    hline(f2, R.FC, 0, qm, c.mark, [5, 4]);
    if (ECON.P.show.labels) {
      ECON.txt('TC', f2.X(qm * 0.96), f2.Y(C.TC(qm * 0.96)) - 10, c.p1, 12);
      ECON.txt('VC', f2.X(qm * 0.96), f2.Y(C.VC(qm * 0.96)) + 12, c.p2, 12);
      ECON.txt('FC', f2.X(qm * 0.04), f2.Y(R.FC) - 10, c.mark, 12);
    }
  }
  function drawComp(R) {
    const c = ECON.P.colors,
      C = R.C,
      qm = R.qmax;
    const ymax = Math.max(R.P, R.minAC.v, R.minAVC.v) * 2;
    const fr = ECON.frame(RR(), 0, qm, 0, ymax, false, 'P, MC, AC ↑   q →');
    if (R.q > 0) {
      const ac = C.AC(R.q);
      polyF(
        fr,
        [
          [0, R.P],
          [R.q, R.P],
          [R.q, ac],
          [0, ac],
        ],
        R.P >= ac ? c.area : c.bad,
        0.35
      );
    }
    curve(fr, C.MC, qm * 0.005, qm, c.bad, 2.6);
    curve(fr, C.AC, qm * 0.01, qm, c.p1, 2.4);
    curve(fr, C.AVC, qm * 0.005, qm, c.p2, 2.2);
    hline(fr, R.P, 0, qm, c.eq, []);
    addDrag(fr, 'hl', R.P, 'P', 1, { base: () => R.P, clamp: (v) => Math.max(0.01, v) });
    if (ECON.P.show.labels) {
      ECON.txt(`P = MR = ${dc(fmt(R.P, 2))}`, fr.X(qm * 0.98), fr.Y(R.P) - 10, c.eq, 13, 'right');
      const lq = qm * 0.9;
      ECON.txt('MC', fr.X(lq), fr.Y(C.MC(lq)) - 10, c.bad, 13);
      ECON.txt('AC', fr.X(lq) + 18, fr.Y(C.AC(lq)) + 10, c.p1, 13);
      ECON.txt('AVC', fr.X(lq) + 22, fr.Y(C.AVC(lq)) + 10, c.p2, 13);
    }
    ECON.dotP(
      fr,
      [R.minAVC.q, R.minAVC.v],
      c.p2,
      5,
      ECON.P.show.labels ? (ECON.P.lang === 'ru' ? 'закрытие' : 'shutdown') : ''
    );
    ECON.dotP(
      fr,
      [R.minAC.q, R.minAC.v],
      c.p1,
      5,
      ECON.P.show.labels ? (ECON.P.lang === 'ru' ? 'безубыточность' : 'break-even') : ''
    );
    if (R.q > 0) {
      vline2(fr, R.q, 0, R.P, c.axis);
      ECON.dotP(fr, [R.q, R.P], c.eq, 6, ECON.P.show.labels ? `q* = ${dc(fmt(R.q, 2))}` : '');
    }
  }
  function drawMono(R) {
    const c = ECON.P.colors;
    if (R.dm === 'disc') {
      const r = RR(),
        w = (r.w - 40) / 2;
      [
        [R.D, R.r1, '1'],
        [R.D2, R.r2, '2'],
      ].forEach(([D, m, k], i) => {
        const qx = -D.a / D.b;
        const fr = ECON.frame(
          { x: r.x + i * (w + 40), y: r.y, w, h: r.h },
          0,
          qx * 1.05,
          0,
          D.a * 1.08,
          false,
          `${ECON.P.lang === 'ru' ? 'рынок' : 'market'} ${k}`
        );
        polyF(
          fr,
          [
            [0, m.P],
            [m.q, m.P],
            [m.q, R.c],
            [0, R.c],
          ],
          c.area,
          0.35
        );
        curve(fr, (q) => Pof(D, q), 0, qx, c.p1, 2.6);
        curve(fr, (q) => D.a + 2 * D.b * q, 0, qx / 2, c.curve, 2, [6, 4]);
        hline(fr, R.c, 0, qx, c.bad, []);
        ECON.dotP(fr, [m.q, m.P], c.eq, 6, ECON.P.show.labels ? `P${k} = ${dc(fmt(m.P, 2))}` : '');
        vline2(fr, m.q, 0, m.P, c.axis);
      });
      return;
    }
    const D = R.D,
      C = R.C,
      qx = Math.min(-D.a / D.b, R.qmax) * 1.05,
      Pm = D.a * 1.08;
    const fr = ECON.frame(RR(), 0, qx, 0, Pm, false, 'P ↑   q →');
    polyF(
      fr,
      [
        [0, R.P],
        [R.q, R.P],
        [R.q, R.AC],
        [0, R.AC],
      ],
      R.profit >= 0 ? c.area : c.bad,
      0.3
    );
    polyF(
      fr,
      [
        [0, D.a],
        [0, R.P],
        [R.q, R.P],
      ],
      c.p1,
      0.2
    );
    if (isFinite(R.qc) && ECON.P.show.areas) {
      ECON.ctx.beginPath();
      ECON.ctx.moveTo(fr.X(R.q), fr.Y(R.P));
      for (let i = 0; i <= 60; i++) {
        const q = R.q + ((R.qc - R.q) * i) / 60;
        ECON.ctx.lineTo(fr.X(q), fr.Y(Pof(D, q)));
      }
      for (let i = 60; i >= 0; i--) {
        const q = R.q + ((R.qc - R.q) * i) / 60;
        ECON.ctx.lineTo(fr.X(q), fr.Y(C.MC(q)));
      }
      ECON.ctx.closePath();
      ECON.ctx.fillStyle = c.bad;
      ECON.ctx.globalAlpha = 0.45;
      ECON.ctx.fill();
      ECON.ctx.globalAlpha = 1;
    }
    curve(fr, (q) => Pof(D, q), 0, -D.a / D.b, c.p1, 2.6);
    curve(fr, (q) => D.a + 2 * D.b * q, 0, -D.a / (2 * D.b), c.curve, 2.2, [7, 5]);
    curve(fr, C.MC, qx * 0.003, qx, c.p2, 2.4);
    curve(fr, C.AC, qx * 0.01, qx, c.mark, 1.8);
    if (ECON.P.show.labels) {
      ECON.txt('D', fr.X(qx * 0.05), fr.Y(Pof(D, qx * 0.05)) - 12, c.p1, 13);
      ECON.txt(
        'MR',
        fr.X((-D.a / (2 * D.b)) * 0.9) + 16,
        fr.Y(D.a + 2 * D.b * ((-D.a / (2 * D.b)) * 0.9)),
        c.curve,
        13,
        'left'
      );
      ECON.txt('MC', fr.X(qx * 0.95), fr.Y(C.MC(qx * 0.95)) - 10, c.p2, 13);
      ECON.txt('AC', fr.X(qx * 0.95), fr.Y(C.AC(qx * 0.95)) + 12, c.mark, 12);
    }
    hline(fr, R.P, 0, R.q, c.axis);
    vline2(fr, R.q, 0, R.P, c.axis);
    ECON.dotP(
      fr,
      [R.q, R.P],
      c.eq,
      6,
      ECON.P.show.labels ? `M (${dc(fmt(R.q, 2))}; ${dc(fmt(R.P, 2))})` : 'M'
    );
    ECON.dotP(fr, [R.q, R.MCq], c.curve, 4);
    if (isFinite(R.qc))
      ECON.dotP(
        fr,
        [R.qc, R.Pc],
        c.p2,
        5,
        ECON.P.show.labels ? (ECON.P.lang === 'ru' ? 'конкуренция' : 'competition') : ''
      );
  }

  function drawPPF(R) {
    const c = ECON.P.colors,
      s = R.s,
      xm = Math.max(...s.map((p) => p[0])) * 1.15,
      ym = Math.max(...s.map((p) => p[1])) * 1.15;
    const fr = ECON.frame(RR(), 0, xm, 0, ym, false, 'y ↑   x →');
    polyF(fr, [[0, 0], ...s, [s[s.length - 1][0], 0]], c.area, 0.18);
    ECON.ctx.strokeStyle = c.p1;
    ECON.ctx.lineWidth = 2.8 * ECON.P.lw;
    ECON.ctx.beginPath();
    s.forEach((p, i) =>
      i ? ECON.ctx.lineTo(fr.X(p[0]), fr.Y(p[1])) : ECON.ctx.moveTo(fr.X(p[0]), fr.Y(p[1]))
    );
    ECON.ctx.stroke();
    s.forEach((p, i) => ECON.dotP(fr, p, c.p1, 4, ECON.P.show.labels ? String.fromCharCode(65 + i) : ''));
    if (R.where) {
      const col = R.where === 'out' ? c.bad : R.where === 'on' ? c.eq : c.mark;
      ECON.dotP(
        fr,
        [nI(S.inp.ppf.ptx), nI(S.inp.ppf.pty)],
        col,
        7,
        ECON.P.show.labels ? T().f_ans[R.where] : ''
      );
    }
  }
  function drawProd(R) {
    const c = ECON.P.colors;
    if (R.pm === 'short') {
      const r = RR(),
        h1 = r.h * 0.5,
        r1 = { x: r.x, y: r.y, w: r.w, h: h1 },
        r2 = { x: r.x, y: r.y + h1 + 28, w: r.w, h: r.h - h1 - 28 };
      const Lm = R.Lmax;
      let tm = 0;
      for (let i = 1; i <= 200; i++) tm = Math.max(tm, R.TP((Lm * i) / 200));
      const f1 = ECON.frame(r1, 0, Lm, 0, tm * 1.15 || 1, false, 'TP(L)');
      curve(f1, R.TP, 0, Lm, c.p1, 2.6);
      if (R.mpZero != null)
        ECON.dotP(f1, [R.mpZero, R.TP(R.mpZero)], c.eq, 5, ECON.P.show.labels ? 'max TP' : '');
      let am = Math.max(R.apMaxV, R.MP(Lm * 0.01)) * 1.2;
      const f2 = ECON.frame(r2, 0, Lm, Math.min(0, R.MP(Lm)), am, false, 'AP, MP');
      curve(f2, R.AP, Lm * 0.005, Lm, c.p2, 2.4);
      curve(f2, R.MP, Lm * 0.005, Lm, c.bad, 2.4);
      ECON.dotP(f2, [R.apMax, R.apMaxV], c.eq, 5, ECON.P.show.labels ? 'max AP' : '');
      if (ECON.P.show.labels) {
        ECON.txt('AP', f2.X(Lm * 0.95), f2.Y(R.AP(Lm * 0.95)) - 10, c.p2, 12);
        ECON.txt('MP', f2.X(Lm * 0.95), f2.Y(R.MP(Lm * 0.95)) + 12, c.bad, 12);
      }
      return;
    }
    const Lx = Math.max(R.L * 2.2, R.pm === 'long' ? R.C / R.w : R.C / R.w) * 1.05,
      Kx = Math.max(R.K * 2.2, R.C / R.r) * 1.05;
    const fr = ECON.frame(RR(), 0, Lx, 0, Kx, false, 'K ↑   L →');
    const C = R.C;
    ECON.seg(fr, [0, C / R.r], [C / R.w, 0], c.p2, 2.6);
    const q = R.pm === 'long' ? R.q : R.q0,
      f = R.f;
    const Kof = (L) => {
      let lo = 0,
        hi = 1;
      for (let t = 0; t < 60 && f(L, hi) < q; t++) hi *= 2;
      if (f(L, hi) < q) return NaN;
      for (let k = 0; k < 60; k++) {
        const m = (lo + hi) / 2;
        if (f(L, m) < q) lo = m;
        else hi = m;
      }
      return hi;
    };
    curve(fr, Kof, Lx * 0.02, Lx, c.p1, 2.4);
    ECON.dotP(fr, [R.L, R.K], c.eq, 6, ECON.P.show.labels ? `(${dc(fmt(R.L, 2))}; ${dc(fmt(R.K, 2))})` : '');
    if (ECON.P.show.labels) {
      ECON.txt(
        ECON.P.lang === 'ru' ? 'изокоста' : 'isocost',
        fr.X((C / R.w) * 0.75),
        fr.Y((C / R.r) * 0.25) - 12,
        c.p2,
        12
      );
      ECON.txt(
        ECON.P.lang === 'ru' ? 'изокванта' : 'isoquant',
        fr.X(Lx * 0.85),
        fr.Y(Kof(Lx * 0.85)) - 12,
        c.p1,
        12
      );
    }
  }
  function drawMC(R) {
    const c = ECON.P.colors,
      D = R.D,
      C = R.C,
      qx = Math.min(-D.a / D.b, R.qmax) * 1.05;
    const fr = ECON.frame(RR(), 0, qx, 0, D.a * 1.1, false, 'P ↑   q →');
    curve(fr, (q) => Pof(D, q), 0, -D.a / D.b, c.p1, 2.6);
    curve(fr, (q) => D.a + 2 * D.b * q, 0, -D.a / (2 * D.b), c.curve, 2, [7, 5]);
    curve(fr, C.MC, qx * 0.003, qx, c.p2, 2.4);
    curve(fr, C.AC, qx * 0.01, qx, c.mark, 2.2);
    ECON.dotP(fr, [R.q, R.P], c.eq, 6, ECON.P.show.labels ? `(${dc(fmt(R.q, 2))}; ${dc(fmt(R.P, 2))})` : '');
    ECON.dotP(fr, [R.mAC.q, R.mAC.v], c.mark, 5, ECON.P.show.labels ? 'min LAC' : '');
    vline2(fr, R.q, 0, R.P, c.axis);
    vline2(fr, R.mAC.q, 0, R.mAC.v, c.mark);
    if (ECON.P.show.labels) {
      ECON.txt(
        ECON.P.lang === 'ru' ? 'избыточная мощность' : 'excess capacity',
        (fr.X(R.q) + fr.X(R.mAC.q)) / 2,
        fr.Y(0) - 14,
        c.bad,
        12
      );
    }
  }
  function drawOlig(R) {
    const c = ECON.P.colors;
    if (R.om === 'hhi') {
      const fr = ECON.frame(
        RR(),
        -0.6,
        R.s.length - 0.4,
        0,
        Math.max(...R.s) * 1.25,
        false,
        ECON.P.lang === 'ru' ? 'доли рынка, %' : 'market shares, %',
        true
      );
      const bw = (fr.X(1) - fr.X(0)) * 0.6;
      R.s.forEach((v, i) => {
        ECON.ctx.fillStyle = c.p1;
        ECON.ctx.globalAlpha = 0.75;
        ECON.ctx.fillRect(fr.X(i) - bw / 2, fr.Y(v), bw, fr.Y(0) - fr.Y(v));
        ECON.ctx.globalAlpha = 1;
        if (ECON.P.show.labels) ECON.txt(dc(fmt(v, 2)), fr.X(i), fr.Y(v) - 10, c.axis, 12);
      });
      return;
    }
    const qm = Math.max(R.br1(0), R.br2(0), R.cour.q[0], R.cour.q[1]) * 1.15;
    const fr = ECON.frame(RR(), 0, qm, 0, qm, true, 'q₂ ↑   q₁ →');
    curve(fr, (q1) => R.br2(q1), 0, qm, c.p2, 2.6);
    ECON.ctx.save();
    ECON.ctx.strokeStyle = c.p1;
    ECON.ctx.lineWidth = 2.6 * ECON.P.lw;
    ECON.ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const q2 = (qm * i) / 200,
        q1 = R.br1(q2),
        X = fr.X(q1),
        Y = fr.Y(q2);
      i ? ECON.ctx.lineTo(X, Y) : ECON.ctx.moveTo(X, Y);
    }
    ECON.ctx.stroke();
    ECON.ctx.restore();
    [
      ['cour', c.eq],
      ['stack', c.mark],
      ['cart', c.area],
    ].forEach(([k, col]) =>
      ECON.dotP(fr, R[k].q, col, R.om === k ? 7 : 5, ECON.P.show.labels ? T().om[k] : '')
    );
  }
  function drawLabor(R) {
    const c = ECON.P.colors;
    if (R.lm === 'firm') {
      const Lm = R.Lmax;
      let mx = 0;
      for (let i = 1; i <= 200; i++) mx = Math.max(mx, R.MRP((Lm * i) / 200));
      const fr = ECON.frame(RR(), 0, Lm, 0, Math.max(mx, R.w) * 1.2, false, 'w, MRP ↑   L →');
      curve(fr, R.MRP, Lm * 0.005, Lm, c.p1, 2.6);
      hline(fr, R.w, 0, Lm, c.p2, []);
      ECON.dotP(fr, [R.L, R.w], c.eq, 6, ECON.P.show.labels ? `L = ${dc(fmt(R.L, 2))}` : '');
      return;
    }
    const Dl = R.Dl,
      Sl = R.Sl,
      Lx = (-Dl.a / Dl.b) * 1.05;
    const fr = ECON.frame(RR(), 0, Lx, 0, Dl.a * 1.1, false, 'w ↑   L →');
    curve(fr, (q) => Pof(Dl, q), 0, Lx, c.p1, 2.6);
    curve(fr, (q) => Pof(Sl, q), 0, Lx, c.p2, 2.6);
    if (R.lm === 'mkt') {
      polyF(
        fr,
        [
          [0, R.E.P],
          [R.E.q, R.E.P],
          [0, Math.max(0, Sl.a)],
        ],
        c.area,
        0.35
      );
      if (R.D0 && ECON.P.show.areas) {
        if (R.sD) curve(fr, (q) => Pof(R.D0, q), 0, Lx, c.p1, 1.4, [4, 5]);
        if (R.sS) curve(fr, (q) => Pof(R.S0, q), 0, Lx, c.p2, 1.4, [4, 5]);
        ECON.dotP(fr, [R.Eb.q, R.Eb.P], c.axis, 4, 'E₀');
      }
      ECON.dotP(fr, [R.E.q, R.E.P], c.eq, 6, ECON.P.show.labels ? 'E' : '');
      addDrag(fr, 'fy', (q) => Pof(Dl, q), 'dDl', 1);
      addDrag(fr, 'fy', (q) => Pof(Sl, q), 'dSl', 1);
      return;
    }
    curve(fr, (q) => Sl.a + 2 * Sl.b * q, 0, Lx, c.curve, 2, [7, 5]);
    ECON.dotP(
      fr,
      [R.comp.q, R.comp.P],
      c.mark,
      5,
      ECON.P.show.labels ? (ECON.P.lang === 'ru' ? 'конкуренция' : 'competition') : ''
    );
    ECON.dotP(
      fr,
      [R.L, R.w],
      c.eq,
      6,
      ECON.P.show.labels ? (ECON.P.lang === 'ru' ? 'монопсония' : 'monopsony') : ''
    );
    vline2(fr, R.L, R.w, R.mrp, c.bad);
    if (R.mw) hline(fr, R.mw.w, 0, Lx, c.mark, []);
    if (ECON.P.show.labels)
      ECON.txt('MRC', fr.X(Lx * 0.55), fr.Y(Sl.a + 2 * Sl.b * Lx * 0.55) - 12, c.curve, 12);
  }
  function drawCap(R) {
    const c = ECON.P.colors;
    let pts = [];
    if (R.km === 'fv') {
      for (let t = 0; t <= R.n; t++) pts.push([t, fvAnn(R.pm, R.i, t)]);
    } else if (R.km === 'pv' || R.km === 'pmt') {
      const pm = R.km === 'pv' ? R.pm : R.v,
        n = R.n;
      for (let t = 1; t <= n; t++) pts.push([t, pm / Math.pow(1 + R.i, t)]);
    } else if (R.km === 'npv') {
      R.fl.forEach((f, t) => pts.push([t, f / Math.pow(1 + R.i, t)]));
    } else if (R.km === 'nper' && isFinite(R.v)) {
      let d = R.pv;
      for (let t = 0; t <= Math.ceil(R.v); t++) {
        pts.push([t, Math.max(0, d)]);
        d = d * (1 + R.i) - R.pm;
      }
    } else if (R.km === 'land') {
      const D = R.D,
        Tx = -D.a / D.b;
      const fr = ECON.frame(RR(), 0, Tx * 1.05, 0, D.a * 1.1, false, 'R ↑   T →');
      curve(fr, (q) => Pof(D, q), 0, Tx, c.p1, 2.6);
      vline2(fr, R.Ts, 0, D.a * 1.1, c.p2, []);
      ECON.dotP(fr, [R.Ts, R.R], c.eq, 6, ECON.P.show.labels ? `R = ${dc(fmt(R.R, 2))}` : '');
      return;
    }
    if (!pts.length) return;
    const ys = pts.map((p) => p[1]);
    const fr = ECON.frame(
      RR(),
      -0.6,
      pts.length - 0.4,
      Math.min(0, ...ys) * 1.15,
      Math.max(0, ...ys) * 1.15 || 1,
      false,
      R.km === 'fv'
        ? ECON.P.lang === 'ru'
          ? 'сумма на счёте'
          : 'balance'
        : R.km === 'nper'
          ? ECON.P.lang === 'ru'
            ? 'остаток долга'
            : 'debt left'
          : ECON.P.lang === 'ru'
            ? 'приведённые потоки'
            : 'discounted flows',
      true
    );
    const bw = Math.max(2, (fr.X(1) - fr.X(0)) * 0.6);
    pts.forEach(([t, v], k) => {
      const X = fr.X(k),
        Y = fr.Y(Math.max(v, 0)),
        Y0 = fr.Y(Math.min(v, 0));
      ECON.ctx.fillStyle = v >= 0 ? c.p1 : c.bad;
      ECON.ctx.globalAlpha = 0.75;
      ECON.ctx.fillRect(X - bw / 2, Y, bw, Y0 - Y);
      ECON.ctx.globalAlpha = 1;
      if (ECON.P.show.labels && pts.length <= 12)
        ECON.txt(dc(fmt(v, 1)), X, v >= 0 ? Y - 10 : Y0 + 10, c.axis, 11);
    });
  }
  function drawExt(R) {
    const c = ECON.P.colors,
      D = R.D;
    const qx = Math.max(D.kind === 'lin' ? -D.a / D.b : R.m.q * 2, R.m.q * 1.6) * 1.05,
      Pm = Math.max(D.kind === 'lin' ? D.a : R.m.P * 2, R.s.P, Pof(R.Ss, R.m.q * 1.8)) * 1.08;
    const fr = ECON.frame(RR(), 0, qx, 0, Pm, false, 'P ↑   q →');
    polyF(
      fr,
      [
        [R.s.q, R.s.P],
        [R.m.q, Pof(R.Ss, R.m.q)],
        [R.m.q, R.m.P],
      ],
      c.bad,
      0.45
    );
    curve(fr, (q) => Pof(D, q), 0, qx, c.p1, 2.6);
    curve(fr, (q) => Pof(R.S, q), 0, qx, c.p2, 2.6);
    curve(fr, (q) => Pof(R.Ss, q), 0, qx, c.bad, 2.2, [7, 5]);
    ECON.dotP(
      fr,
      [R.m.q, R.m.P],
      c.p2,
      6,
      ECON.P.show.labels ? (ECON.P.lang === 'ru' ? 'рынок' : 'market') : ''
    );
    ECON.dotP(
      fr,
      [R.s.q, R.s.P],
      c.eq,
      6,
      ECON.P.show.labels ? (ECON.P.lang === 'ru' ? 'оптимум' : 'optimum') : ''
    );
    if (ECON.P.show.labels) {
      const ql = Math.min(qx * 0.9, R.m.q * 1.8);
      ECON.txt('PMC', fr.X(ql), fr.Y(Pof(R.S, ql)) + 14, c.p2, 12);
      ECON.txt('SMC', fr.X(ql), fr.Y(Pof(R.Ss, ql)) - 14, c.bad, 12);
    }
  }
  function drawPG(R) {
    const c = ECON.P.colors,
      qx = R.qmax * 1.05;
    let mx = R.sumP(0);
    const fr = ECON.frame(RR(), 0, qx, 0, Math.max(mx, Pof(R.MC, 0)) * 1.1, false, 'P ↑   q →');
    R.list.forEach((o) =>
      curve(fr, (q) => Math.max(0, o.n * Pof(o.L, q)), 0, -o.L.a / o.L.b, c.p1, 1.6, [5, 4])
    );
    curve(fr, R.sumP, 0, qx, c.p1, 3);
    curve(fr, (q) => Pof(R.MC, q), 0, qx, c.p2, 2.6);
    ECON.dotP(fr, [R.qPub, R.sumP(R.qPub)], c.eq, 6, ECON.P.show.labels ? `q* = ${dc(fmt(R.qPub, 2))}` : '');
    if (ECON.P.show.labels)
      ECON.txt('ΣMB', fr.X(qx * 0.05) + 14, fr.Y(R.sumP(qx * 0.05)) - 10, c.p1, 13, 'left');
  }
  const DRAW2 = {
    ppf: drawPPF,
    prod: drawProd,
    mc: drawMC,
    olig: drawOlig,
    labor: drawLabor,
    cap: drawCap,
    ext: drawExt,
    pg: drawPG,
  };

  /* переключатели */
  const TOG = ['bgGrid', 'coords', 'labels', 'areas', 'hints'];

  /* ---------- перетаскивание кривых ---------- */
  const DRAGS = [];
  let dragNow = null,
    dragRaf = 0;
  function addDrag(fr, kind, fn, field, scale, o = {}) {
    DRAGS.push({ fr, kind, fn, field, scale, ...o });
  } // kind: 'fy' y=f(x) верт.; 'fx' x=f(y) гориз.; 'hl' y=const; 'vl' x=const
  const invX = (fr, px) => (px - fr.X(0)) / (fr.X(1) - fr.X(0)),
    invY = (fr, py) => (py - fr.Y(0)) / (fr.Y(1) - fr.Y(0));
  function dragDist(d, px, py) {
    const fr = d.fr,
      r = fr.r;
    if (px < r.x - 6 || px > r.x + r.w + 6 || py < r.y - 6 || py > r.y + r.h + 6) return Infinity;
    let best = Infinity;
    if (d.kind === 'hl') return Math.abs(fr.Y(d.fn) - py);
    if (d.kind === 'vl') return Math.abs(fr.X(d.fn) - px);
    for (let i = 0; i <= 160; i++) {
      if (d.kind === 'fy') {
        const x = invX(fr, r.x + (r.w * i) / 160),
          y = d.fn(x);
        if (!isFinite(y)) continue;
        best = Math.min(best, Math.hypot(fr.X(x) - px, fr.Y(y) - py));
      } else {
        const y = invY(fr, r.y + (r.h * i) / 160),
          x = d.fn(y);
        if (!isFinite(x)) continue;
        best = Math.min(best, Math.hypot(fr.X(x) - px, fr.Y(y) - py));
      }
    }
    return best;
  }
  function pickDrag(px, py) {
    let b = null,
      bd = 12;
    for (const d of DRAGS) {
      const v = dragDist(d, px, py);
      if (v < bd) {
        bd = v;
        b = d;
      }
    }
    return b;
  }
  const cvPos = (e) => {
    const r = ECON.cv.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const niceRound = (v) => {
    if (!isFinite(v)) return 0;
    const a = Math.abs(v);
    const d = a >= 1000 ? 0 : a >= 100 ? 1 : a >= 10 ? 2 : a >= 1 ? 3 : 4;
    return +v.toFixed(d);
  };
  ECON.cv.addEventListener('pointerdown', (e) => {
    const p = cvPos(e),
      d = pickDrag(p.x, p.y);
    if (!d) return;
    const I = S.inp[S.topic];
    const raw = I[d.field];
    const pv = (x) => {
      const t = String(x).trim();
      return t.endsWith('%') ? nI(t.slice(0, -1)) / 100 : nI(t);
    };
    let v0;
    try {
      v0 = raw === '' || raw == null ? (d.base ? d.base() : 0) : pv(raw);
    } catch (err) {
      v0 = d.base ? d.base() : 0;
    }
    dragNow = { d, px: p.x, py: p.y, v0 };
    ECON.cv.setPointerCapture(e.pointerId);
    ECON.cv.style.cursor = 'grabbing';
    e.preventDefault();
  });
  ECON.cv.addEventListener('pointermove', (e) => {
    const p = cvPos(e);
    if (!dragNow) {
      ECON.cv.style.cursor = pickDrag(p.x, p.y) ? 'grab' : 'default';
      return;
    }
    const { d, px, py, v0 } = dragNow,
      fr = d.fr;
    const delta =
      d.kind === 'fy' || d.kind === 'hl' ? invY(fr, p.y) - invY(fr, py) : invX(fr, p.x) - invX(fr, px);
    let v = niceRound(v0 + delta * d.scale);
    if (d.clamp) v = d.clamp(v);
    S.inp[S.topic][d.field] = v === 0 && !d.base ? '' : dc(String(v));
    S.shock = null;
    S.preset = null;
    const el = document.querySelector(`#form [data-k="${d.field}"]`);
    if (el) el.value = S.inp[S.topic][d.field];
    if (!dragRaf)
      dragRaf = requestAnimationFrame(() => {
        dragRaf = 0;
        ECON.recompute();
      });
  });
  const endDrag = () => {
    if (dragNow) {
      dragNow = null;
      ECON.cv.style.cursor = 'default';
    }
  };
  ECON.cv.addEventListener('pointerup', endDrag);
  ECON.cv.addEventListener('pointercancel', endDrag);
  /* ---------- факторы и сдвиги ---------- */
  const arrowOf = (a, b) => {
    const t = 1e-7 * Math.max(1, Math.abs(a), Math.abs(b));
    return b > a + t ? '<b class="up">↑</b>' : b < a - t ? '<b class="dn">↓</b>' : '<span class="z">—</span>';
  };
  function cleared(t) {
    const I = { ...S.inp[t] };
    (DELTAS[t] || []).forEach((k) => {
      I[k] = '';
    });
    return I;
  }
  function renderFactors() {
    const box = $('#fac');
    if (!box) return;
    const t = S.topic,
      L = T(),
      list = SHOCKS[t];
    if (!list) {
      box.innerHTML = `<p class="note">${L.fac_none}</p>`;
      return;
    }
    let base;
    try {
      base = COMP[t](cleared(t));
    } catch (e) {
      box.innerHTML = `<p class="note">${L.cap.err}</p>`;
      return;
    }
    const ev = EFFV[t],
      b0 = ev(base, true),
      vars = Object.keys(b0);
    if (!vars.length) {
      box.innerHTML = `<p class="note">${L.fac_mode || L.fac_none}</p>`;
      return;
    }
    const rows = list
      .map((sh) => {
        let r;
        try {
          r = COMP[t]({ ...cleared(t), ...sh.set(cleared(t)) });
        } catch (e) {
          return null;
        }
        const b1 = ev(r, false);
        return { sh, b1 };
      })
      .filter(Boolean);
    box.innerHTML =
      `<p class="note" style="margin:.1rem 0 .5rem">${L.fac_note}</p><div class="tw"><table class="tab fac"><tr><th style="text-align:left">${L.fac_f}</th><th style="text-align:left">${L.fac_c}</th>${vars.map((v) => `<th>${v}</th>`).join('')}</tr>${rows.map(({ sh, b1 }) => `<tr data-shock="${sh.id}" class="${S.shock === sh.id ? 'on' : ''}"><td style="text-align:left">${sh[ECON.P.lang] || sh.ru}</td><td style="text-align:left">${(ECON.P.lang === 'en' ? sh.cen : sh.c) || ''}</td>${vars.map((v) => `<td>${arrowOf(b0[v], b1[v])}</td>`).join('')}</tr>`).join('')}</table></div>` +
      (S.shock ? `<div class="row"><button class="btn sm" id="facReset">${L.fac_reset}</button></div>` : '');
  }
  document.addEventListener('click', (e) => {
    const tr = e.target.closest('tr[data-shock]');
    if (tr) {
      const sh = SHOCKS[S.topic].find((s) => s.id === tr.dataset.shock);
      if (!sh) return;
      S.inp[S.topic] = { ...cleared(S.topic), ...sh.set(cleared(S.topic)) };
      S.shock = sh.id;
      S.preset = null;
      ECON.renderForm();
      ECON.recompute();
      return;
    }
    if (e.target.id === 'facReset') {
      S.inp[S.topic] = cleared(S.topic);
      S.shock = null;
      ECON.renderForm();
      ECON.recompute();
    }
  });
  /* ---------- справочник ---------- */

  /* ---------- экспорт ---------- */

  function renderTex() {
    const ta = $('#xTex');
    if (!ta) return;
    if (S.err || !S.res) {
      ta.value = '';
      return;
    }
    const a = (S.ans || '').replace(/<[^>]+>/g, '');
    if (ECON.fmtMode === 'txt') {
      ta.value = `${T()['t_' + S.topic]}\n${a}`;
      return;
    }
    if (ECON.fmtMode === 'tex') {
      ta.value = a.replace(/≈/g, '\\approx ').replace(/·/g, '\\cdot ');
      return;
    }
    const R = S.res,
      t = S.topic;
    let py = '';
    const ln = (L) => (L.kind === 'lin' ? `${L.a} + (${L.b})*q` : '?');
    if (t === 'sd')
      py = `from sympy import symbols, solve\nq = symbols('q')\nD = ${ln(R.D)}\nS = ${ln(R.S)}\nqs = solve(D - S, q)[0]\nprint(qs, D.subs(q, qs))`;
    else if (t === 'mono' && R.dm === 'one')
      py = `from sympy import symbols, diff, solve\nq = symbols('q')\nP = ${ln(R.D)}\nTC = ${R.FC} + (${S.inp.mono.VC.replace(/\^/g, '**').replace(/(\d)q/g, '$1*q')})\nqm = [r for r in solve(diff(P*q - TC, q), q) if r > 0]\nprint(qm, [P.subs(q, r) for r in qm])`;
    else py = `# ${T()['t_' + t]}\nprint(${JSON.stringify(a)})`;
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
