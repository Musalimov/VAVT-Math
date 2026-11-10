import { createPanels } from '../../shared/panels.js';
import { closeDrawers, initDrawers, openDrawer } from '../../shared/drawers.js';
import { createGlossary } from '../../shared/glossary.js';
import { toast } from '../../shared/toast.js';
import { $, clone } from '../../shared/dom.js';
import { loadPrefs, makeSaver } from '../../shared/prefs.js';
import { SOLVE, fp, pc } from './solvers/steps.js';
import { COMP, E, fin, gv, nI } from './solvers/compute.js';
import {
  adas,
  islm,
  kcross,
  loanable,
  moneyMult,
  mundell,
  natU,
  okun,
  phillips,
  smallOpen,
  solow,
} from './solvers/model.js';
import { DELTAS, FORMS, GROUPS, PRE, TOPICS } from './content/topics.js';
import { CHAP, DEMOS, FORMAL, ILL, REL, TERMS } from './content/glossary.js';
import { T } from './content/tx.js';
import { dc, fN, fmt } from '../../shared/format.js';
import { numG } from '../../shared/econ/expr-xy.js';
import { lang, langFrom } from '../../shared/i18n.js';
(() => {
  'use strict';
  /* ---------- выражения от двух переменных x, y ---------- */

  /* ---------- макроэкономика: математика (по Мэнкью) ---------- */

  // %ΔY = 3% − 2·Δu (Мэнкью, гл. 9)

  /* Солоу: y = k^α, выбытие (δ + n + g) */

  /* кейнсианский крест: C = a + b(Y−T), Y = C + I + G (с подоходным налогом t: T = T0 + tY) */

  /* IS–LM: I = c − d r ; (M/P)d = eY − f r */

  /* Манделл–Флеминг: NX = n0 − n1·e, r = r* */

  /* AD–AS: AD — MV = PY; SRAS: Y = Ȳ + α(P − Pᵉ) */

  /* кривая Филлипса: π = πᵉ − β(u − uⁿ) + v */

  let LNG = 'ru';
  const KEY = 'macro-viz-v1';

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
    topic: 'cross',
    inp: null,
    preset: null,
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

  const q4 = (v) => dc(String(+(+v).toFixed(4)));
  const SHOCKS = {
    cross: [
      {
        id: 'g',
        ru: 'Рост госрасходов G',
        en: 'Higher government purchases G',
        c: 'PE вверх',
        cen: 'PE up',
        set: (I) => ({ dG: q4(gv(I, 'G') * 0.25) }),
      },
      {
        id: 't',
        ru: 'Рост налогов T',
        en: 'Higher taxes T',
        c: 'PE вниз',
        cen: 'PE down',
        set: (I) => ({ dT: q4(gv(I, 'G') * 0.25) }),
      },
      {
        id: 'x',
        ru: 'Рост экспорта',
        en: 'Higher exports',
        c: 'PE вверх',
        cen: 'PE up',
        set: (I) => ({ dA: q4(gv(I, 'G') * 0.25) }),
      },
      {
        id: 'm',
        ru: 'Рост импорта (автономного)',
        en: 'Higher (autonomous) imports',
        c: 'PE вниз',
        cen: 'PE down',
        set: (I) => ({ dA: q4(-gv(I, 'G') * 0.25) }),
      },
      {
        id: 'i',
        ru: 'Оптимизм инвесторов',
        en: 'Investor optimism',
        c: 'PE вверх',
        cen: 'PE up',
        set: (I) => ({ dA: q4(gv(I, 'I') * 0.25) }),
      },
      {
        id: 'bb',
        ru: 'Сбалансированный рост G и T',
        en: 'Balanced rise in G and T',
        c: 'PE вверх на ΔG(1 − MPC)',
        cen: 'PE up by ΔG(1 − MPC)',
        set: (I) => ({ dG: q4(gv(I, 'G') * 0.25), dT: q4(gv(I, 'G') * 0.25) }),
      },
    ],
    islm: [
      {
        id: 'g',
        ru: 'Рост госрасходов G',
        en: 'Higher government purchases G',
        c: 'IS вправо',
        cen: 'IS right',
        set: (I) => ({ dG: q4(gv(I, 'G') * 0.5) }),
      },
      {
        id: 't',
        ru: 'Рост налогов T',
        en: 'Higher taxes T',
        c: 'IS влево',
        cen: 'IS left',
        set: (I) => ({ dT: q4(gv(I, 'G') * 0.5) }),
      },
      {
        id: 'x',
        ru: 'Рост экспорта',
        en: 'Higher exports',
        c: 'IS вправо',
        cen: 'IS right',
        set: (I) => ({ dA: q4(gv(I, 'G') * 0.5) }),
      },
      {
        id: 'm',
        ru: 'Рост импорта',
        en: 'Higher imports',
        c: 'IS влево',
        cen: 'IS left',
        set: (I) => ({ dA: q4(-gv(I, 'G') * 0.5) }),
      },
      {
        id: 'i',
        ru: 'Оптимизм инвесторов',
        en: 'Investor optimism',
        c: 'IS вправо',
        cen: 'IS right',
        set: (I) => ({ dI: q4(gv(I, 'c') * 0.25) }),
      },
      {
        id: 'mu',
        ru: 'Рост денежной массы M',
        en: 'Higher money supply M',
        c: 'LM вправо',
        cen: 'LM right',
        set: (I) => ({ dM: q4(gv(I, 'M') * 0.2) }),
      },
      {
        id: 'md',
        ru: 'Сокращение денежной массы M',
        en: 'Lower money supply M',
        c: 'LM влево',
        cen: 'LM left',
        set: (I) => ({ dM: q4(-gv(I, 'M') * 0.2) }),
      },
      {
        id: 'p',
        ru: 'Рост уровня цен P',
        en: 'Higher price level P',
        c: 'LM влево',
        cen: 'LM left',
        set: (I) => ({ dP: q4(gv(I, 'P') * 0.25) }),
      },
      {
        id: 'dm',
        ru: 'Рост спроса на деньги',
        en: 'Higher money demand',
        c: 'LM влево',
        cen: 'LM left',
        set: (I) => ({ dMd: q4((gv(I, 'M') / gv(I, 'P')) * 0.1) }),
      },
    ],
    mf: [
      {
        id: 'g',
        ru: 'Рост госрасходов G',
        en: 'Higher government purchases G',
        c: 'IS* вправо',
        cen: 'IS* right',
        set: (I) => ({ dG: q4(gv(I, 'G') * 0.5) }),
      },
      {
        id: 't',
        ru: 'Рост налогов T',
        en: 'Higher taxes T',
        c: 'IS* влево',
        cen: 'IS* left',
        set: (I) => ({ dT: q4(gv(I, 'G') * 0.5) }),
      },
      {
        id: 'mu',
        ru: 'Рост денежной массы M',
        en: 'Higher money supply M',
        c: 'LM* вправо (плавающий курс)',
        cen: 'LM* right (floating)',
        set: (I) => ({ dM: q4(gv(I, 'M') * 0.1) }),
      },
      {
        id: 'tar',
        ru: 'Импортные пошлины / рост экспорта',
        en: 'Import tariffs / higher exports',
        c: 'IS* вправо',
        cen: 'IS* right',
        set: (I) => ({ dn0: q4(gv(I, 'n0') * 0.3) }),
      },
      {
        id: 'im',
        ru: 'Рост спроса на импорт',
        en: 'Higher import demand',
        c: 'IS* влево',
        cen: 'IS* left',
        set: (I) => ({ dn0: q4(-gv(I, 'n0') * 0.3) }),
      },
      {
        id: 'rs',
        ru: 'Рост мировой ставки r*',
        en: 'Higher world rate r*',
        c: 'LM* вправо, IS* влево',
        cen: 'LM* right, IS* left',
        set: (I) => ({ drs: '1' }),
      },
    ],
    adas: [
      {
        id: 'mu',
        ru: 'Рост денежной массы M',
        en: 'Higher money supply M',
        c: 'AD вправо',
        cen: 'AD right',
        set: (I) => ({ dM: q4(gv(I, 'M') * 0.2) }),
      },
      {
        id: 'md',
        ru: 'Сокращение M',
        en: 'Lower M',
        c: 'AD влево',
        cen: 'AD left',
        set: (I) => ({ dM: q4(-gv(I, 'M') * 0.2) }),
      },
      {
        id: 'v',
        ru: 'Рост скорости обращения V (бум расходов)',
        en: 'Higher velocity V (spending boom)',
        c: 'AD вправо',
        cen: 'AD right',
        set: (I) => ({ dV: q4(gv(I, 'V') * 0.2) }),
      },
      {
        id: 'oil',
        ru: 'Подорожание нефти (шок издержек)',
        en: 'Oil price rise (cost shock)',
        c: 'SRAS вверх (влево)',
        cen: 'SRAS up (left)',
        set: (I) => ({ dPe: q4(gv(I, 'Pe') * 0.25) }),
      },
      {
        id: 'fav',
        ru: 'Благоприятный шок предложения',
        en: 'Favorable supply shock',
        c: 'SRAS вниз (вправо)',
        cen: 'SRAS down (right)',
        set: (I) => ({ dPe: q4(-gv(I, 'Pe') * 0.2) }),
      },
      {
        id: 'tech',
        ru: 'Рост потенциала (технологии, ресурсы)',
        en: 'Higher potential output (technology, resources)',
        c: 'LRAS и SRAS вправо',
        cen: 'LRAS and SRAS right',
        set: (I) => ({ dYb: q4(gv(I, 'Yb') * 0.1) }),
      },
    ],
    natinc: [
      {
        id: 'g',
        ru: 'Рост госрасходов G',
        en: 'Higher government purchases G',
        c: 'S влево',
        cen: 'S left',
        set: (I) => ({ dG: q4(gv(I, 'G') * 0.25) }),
      },
      {
        id: 't',
        ru: 'Снижение налогов T',
        en: 'Tax cut',
        c: 'S влево',
        cen: 'S left',
        set: (I) => ({ dT: q4(-gv(I, 'T') * 0.2) }),
      },
      {
        id: 'i',
        ru: 'Рост инвестиционного спроса',
        en: 'Higher investment demand',
        c: 'I(r) вправо',
        cen: 'I(r) right',
        set: (I) => ({ dc: q4(gv(I, 'c') * 0.2) }),
      },
    ],
    open: [
      {
        id: 'g',
        ru: 'Рост госрасходов G',
        en: 'Higher government purchases G',
        c: 'S − I влево',
        cen: 'S − I left',
        set: (I) => ({ dG: q4(gv(I, 'G') * 0.25) }),
      },
      {
        id: 't',
        ru: 'Снижение налогов T',
        en: 'Tax cut',
        c: 'S − I влево',
        cen: 'S − I left',
        set: (I) => ({ dT: q4(-gv(I, 'T') * 0.2) }),
      },
      {
        id: 'i',
        ru: 'Рост инвестиционного спроса',
        en: 'Higher investment demand',
        c: 'S − I влево',
        cen: 'S − I left',
        set: (I) => ({ dc: q4(gv(I, 'c') * 0.2) }),
      },
      {
        id: 'rs',
        ru: 'Рост мировой ставки r*',
        en: 'Higher world rate r*',
        c: 'S − I вправо',
        cen: 'S − I right',
        set: (I) => ({ drs: '2' }),
      },
      {
        id: 'tar',
        ru: 'Протекционизм (пошлины, квоты)',
        en: 'Protectionism (tariffs, quotas)',
        c: 'NX(ε) вправо',
        cen: 'NX(ε) right',
        set: (I) => ({ dn0: q4(gv(I, 'n0') * 0.4) }),
      },
    ],
    solow: [
      {
        id: 's',
        ru: 'Рост нормы сбережения s',
        en: 'Higher saving rate s',
        c: 's·f(k) вверх',
        cen: 's·f(k) up',
        set: (I) => ({ s2: q4(Math.min(0.95, nI(I.s) * 1.3)) }),
      },
      {
        id: 'n',
        ru: 'Рост населения n',
        en: 'Higher population growth n',
        c: '(δ+n+g)k круче',
        cen: '(δ+n+g)k steeper',
        set: (I) => ({ dn: '0,02' }),
      },
      {
        id: 'dl',
        ru: 'Рост нормы выбытия δ',
        en: 'Higher depreciation δ',
        c: '(δ+n+g)k круче',
        cen: '(δ+n+g)k steeper',
        set: (I) => ({ ddl: '0,03' }),
      },
    ],
    phil: [
      {
        id: 'pe',
        ru: 'Рост инфляционных ожиданий',
        en: 'Higher expected inflation',
        c: 'кривая вверх',
        cen: 'curve up',
        set: (I) => ({ dpe: '2%' }),
      },
      {
        id: 'v',
        ru: 'Шок предложения (нефть)',
        en: 'Supply shock (oil)',
        c: 'кривая вверх',
        cen: 'curve up',
        set: (I) => ({ v: '2%' }),
      },
      {
        id: 'u',
        ru: 'Рост безработицы (спад)',
        en: 'Higher unemployment (recession)',
        c: 'движение вдоль кривой',
        cen: 'movement along the curve',
        set: (I) => ({ du2: '2' }),
      },
    ],
  };

  const EFFV = {
    cross: (R, b) => {
      const x = b ? R.R0 : fin(R);
      return { Y: x.Y, C: x.C };
    },
    islm: (R, b) => {
      const x = b ? R.R0 : fin(R);
      return { Y: x.Y, r: x.r, C: x.C, I: x.I };
    },
    mf: (R, b) => {
      const x = b ? R.R0 : fin(R);
      return { Y: x.Y, e: x.e, NX: x.NX };
    },
    adas: (R, b) => {
      const x = b ? R.R0 : fin(R);
      return {
        [P.lang === 'ru' ? 'P (кор.)' : 'P (SR)']: x.P,
        [P.lang === 'ru' ? 'Y (кор.)' : 'Y (SR)']: x.Y,
        [P.lang === 'ru' ? 'P (долг.)' : 'P (LR)']: b
          ? (R.M * R.V) / R.Yb
          : R.LR
            ? R.LR.P
            : (R.M * R.V) / R.Yb,
      };
    },
    natinc: (R, b) => {
      const x = b ? R.R0 : fin(R);
      return R.nm === 'lf' ? { S: x.S, r: x.r, I: x.I } : {};
    },
    open: (R, b) => {
      const x = b ? R.R0 : fin(R);
      return { S: x.S, I: x.I, NX: x.NX, ε: x.eps };
    },
    solow: (R, b) => {
      const x = b || !R.alt ? R : R.alt;
      return { 'k*': x.ks, 'y*': x.ys, 'c*': x.cs };
    },
    phil: (R, b) => ({ π: b ? R.pi : R.pi2 != null ? R.pi2 : R.pi }),
  };

  const S = {
    topic: TOPICS.includes(P.topic) ? P.topic : 'cross',
    inp: {},
    res: null,
    err: null,
    preset: P.preset || null,
    stamp: false,
  };
  TOPICS.forEach((t) => {
    S.inp[t] = clone(PRE[t][0][1]);
  });
  if (P.inp) for (const t of TOPICS) if (P.inp[t]) S.inp[t] = { ...S.inp[t], ...P.inp[t] };
  function renderForm() {
    const box = $('#form'),
      L = T(),
      t = S.topic,
      I = S.inp[t];
    box.innerHTML = '';
    for (const [k, type, a, b] of FORMS[t]) {
      const show = typeof a === 'function' ? a : typeof b === 'function' ? b : null;
      if (show && !show(I)) continue;
      const l = document.createElement('label');
      l.textContent = L.f[k] || k;
      if (type === 'txt') l.className = 'full';
      box.appendChild(l);
      let el;
      if (type === 'txt') {
        el = document.createElement('textarea');
        el.spellcheck = false;
      } else if (type === 'sel') {
        el = document.createElement('select');
        for (const o of a) {
          const op = document.createElement('option');
          op.value = o;
          op.textContent = (L.opt[k] || {})[o] || o;
          el.appendChild(op);
        }
      } else {
        el = document.createElement('input');
        el.type = 'text';
        el.spellcheck = false;
        el.autocomplete = 'off';
      }
      el.value = I[k] == null ? '' : I[k];
      el.dataset.k = k;
      box.appendChild(el);
    }
    buildTopics();
  }
  function buildTopics() {
    const L = T(),
      box = $('#topicBox');
    box.innerHTML = GROUPS.map(
      ([g, ts]) =>
        `<div class="tg"><div class="tgl">${L.grp[g]}</div><div class="seg">${ts.map((t) => `<button data-t="${t}" class="${t === S.topic ? 'on' : ''}" title="${L.tt[t] || ''}">${L['t_' + t]}</button>`).join('')}</div></div>`
    ).join('');
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('#topicBox button[data-t]');
    if (b) setTopic(b.dataset.t);
  });
  let fT0 = 0;
  $('#form').addEventListener('input', (e) => {
    const k = e.target.dataset.k;
    if (!k) return;
    S.inp[S.topic][k] = e.target.value;
    S.preset = null;
    S.shock = null;
    if (e.target.tagName === 'SELECT') {
      renderForm();
      recompute();
      return;
    }
    clearTimeout(fT0);
    fT0 = setTimeout(recompute, 250);
  });
  function setTopic(t) {
    if (!TOPICS.includes(t)) return;
    S.topic = t;
    P.topic = t;
    S.preset = null;
    save();
    renderForm();
    recompute();
  }
  function loadPreset(id) {
    for (const t of TOPICS) {
      const p = PRE[t].find((z) => z[0] === id);
      if (p) {
        S.topic = t;
        P.topic = t;
        S.inp[t] = { ...S.inp[t], ...clone(p[1]) };
        S.preset = id;
        S.shock = null;
        renderForm();
        recompute();
        return;
      }
    }
  }

  function recompute() {
    const t = S.topic,
      I = S.inp[t];
    S.err = null;
    S.res = null;
    try {
      S.res = COMP[t](I);
    } catch (e) {
      if (e instanceof Error) console.error(e);
      S.err = e instanceof Error ? { msg: 'bug' } : e && e.msg ? e : { msg: 'num' };
    }
    P.inp = S.inp;
    P.preset = S.preset;
    save();
    renderAll();
  }
  /* ---------- панели ---------- */

  const ol = (a) =>
    `<ol class="stp">${a
      .filter(Boolean)
      .map((s) => `<li>${s}</li>`)
      .join('')}</ol>`;
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
    box.innerHTML = `<p class="idea">${L.tt[S.topic]}</p>${typeof shockNote === 'function' ? shockNote() : ''}${ol(r.st)}<div class="ans"><div class="k">${L.ans}</div><div class="big">${r.ans}</div></div>`;
  }
  function prop(k, v) {
    return `<div class="prop"><span class="k">${k}</span><span class="v">${v}</span></div>`;
  }

  function shockNote() {
    const t = S.topic;
    if (!S.shock || !SHOCKS[t]) return '';
    const sh = SHOCKS[t].find((s) => s.id === S.shock);
    return sh ? `<p class="idea"><b>${sh[P.lang] || sh.ru}:</b> ${P.lang === 'en' ? sh.cen : sh.c}</p>` : '';
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
    const fin = R.R1 || R.R0;
    if (t === 'gdp') h = prop(V.defl, fp(R.defl)) + prop(V.cpi, fp(R.cpi)) + prop(V.gReal, pc(R.gReal));
    else if (t === 'unemp') h = R.um === 'nat' ? prop('u*', pc(R.u)) : prop('ΔY/Y', pc(R.g));
    else if (t === 'natinc')
      h =
        R.nm === 'prod'
          ? prop('Y', fp(R.Y)) + prop('MPK', fp(R.MPK)) + prop('MPL', fp(R.MPL))
          : prop('S', fp(fin.S)) + prop('r', fp(fin.r) + '%') + prop('I', fp(fin.I));
    else if (t === 'money')
      h =
        R.mm === 'qt'
          ? prop('π', pc(R.pi)) + prop('i', pc(R.i))
          : prop('m', fp(R.m)) + (isFinite(R.M) ? prop('M', fp(R.M)) : '');
    else if (t === 'open')
      h = prop('S', fp(fin.S)) + prop('I', fp(fin.I)) + prop('NX', fp(fin.NX)) + prop('ε', fp(fin.eps));
    else if (t === 'solow')
      h =
        prop('k*', fp(R.ks)) +
        prop('y*', fp(R.ys)) +
        prop('c*', fp(R.cs)) +
        prop(V.gold, `k = ${fp(R.kg)}, s = ${fp(R.sg)}`);
    else if (t === 'cross') h = prop('Y', fp(fin.Y)) + prop(V.mG, fp(R.R0.mG)) + prop(V.mT, fp(R.R0.mT));
    else if (t === 'islm')
      h = prop('Y', fp(fin.Y)) + prop('r', fp(fin.r)) + prop('C', fp(fin.C)) + prop('I', fp(fin.I));
    else if (t === 'mf') h = prop('Y', fp(fin.Y)) + prop('e', fp(fin.e)) + prop('NX', fp(fin.NX));
    else if (t === 'adas')
      h = prop('P', fp(fin.P)) + prop('Y', fp(fin.Y)) + (R.LR ? prop(V.lr, `P = ${fp(R.LR.P)}`) : '');
    else h = prop('π', pc(R.pi));
    box.innerHTML = h;
  }
  function capKey() {
    return S.topic;
  }
  function relTogs() {
    const G = ['bgGrid', 'coords', 'labels'];
    return [
      ...G,
      ...(['natinc', 'open', 'cross', 'islm', 'mf', 'adas', 'solow'].includes(S.topic) ? ['areas'] : []),
      'hints',
    ];
  }

  function renderPresets() {
    const box = $('#pre');
    box.innerHTML = '';
    PRE[S.topic].forEach(([id, , ru, en]) => {
      const b = document.createElement('button');
      b.className = 'chip' + (S.preset === id ? ' on' : '');
      b.dataset.pre = id;
      b.textContent = P.lang === 'ru' ? ru : en;
      box.appendChild(b);
    });
  }
  function renderOverlay() {
    const ov = $('#ov'),
      L = T();
    if (S.err || !S.res) {
      ov.innerHTML = `<span class="tt">${L.cap.err}</span>`;
      return;
    }
    ov.innerHTML = `<span>${S.ans || ''}</span><span class="tt">${L['t_' + S.topic]}</span>`;
  }
  function renderCaption() {
    const cap = $('#cap');
    $('#capOpen').hidden = !!P.show.hints;
    if (!P.show.hints) {
      cap.hidden = true;
      return;
    }
    cap.hidden = false;
    $('#capT').textContent = S.err ? T().cap.err : T().cap[capKey()];
  }
  function syncTogVis() {
    const r = relTogs();
    document.querySelectorAll('#tog label').forEach((l) => {
      l.style.display = r.includes(l.querySelector('input').dataset.k) ? '' : 'none';
    });
  }
  function renderAll() {
    syncTogVis();
    if (typeof renderFactors === 'function') renderFactors();
    renderSolve();
    renderValues();
    renderPresets();
    renderOverlay();
    renderCaption();
    renderTex();
    const fe = $('#fErr');
    fe.hidden = !S.err;
    if (S.err) fe.textContent = T().err[S.err.msg] || T().err.num;
    req();
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
    raf = 0;
  new ResizeObserver(() => {
    const r = stage.getBoundingClientRect();
    W = r.width;
    H = r.height;
    DPR = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.max(1, Math.round(W * DPR));
    cv.height = Math.max(1, Math.round(H * DPR));
    req();
  }).observe(stage);
  function req() {
    if (!raf)
      raf = requestAnimationFrame(() => {
        raf = 0;
        renderNow();
      });
  }
  function niceStep(raw) {
    const p = Math.pow(10, Math.floor(Math.log10(raw))),
      m = raw / p;
    return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p;
  }
  function txt(s, x, y, col, sz = 12, al = 'center', bl = 'middle', it = false) {
    ctx.font = `${it ? 'italic ' : ''}600 ${sz}px "Source Serif 4", Georgia, serif`;
    ctx.textAlign = al;
    ctx.textBaseline = bl;
    ctx.lineWidth = 3;
    ctx.strokeStyle = P.colors.bg;
    ctx.lineJoin = 'round';
    ctx.strokeText(s, x, y);
    ctx.fillStyle = col;
    ctx.fillText(s, x, y);
  }
  function frame(r, x0, x1, y0, y1, eq, ttl, noX) {
    const c = P.colors;
    let sx = r.w / (x1 - x0),
      sy = r.h / (y1 - y0);
    if (eq) {
      const s = Math.min(sx, sy);
      sx = sy = s;
    }
    const X = (x) => r.x + (x - x0) * sx,
      Y = (y) => r.y + r.h - (y - y0) * sy;
    const st = niceStep((x1 - x0) / Math.max(2, r.w / 80)),
      sty = eq ? st : niceStep((y1 - y0) / Math.max(2, r.h / 55));
    const xe = x0 + r.w / sx,
      ye = y0 + r.h / sy;
    if (P.show.bgGrid) {
      ctx.strokeStyle = c.bgGrid;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = Math.ceil(x0 / st) * st; x <= xe + 1e-9; x += st) {
        ctx.moveTo(X(x) + 0.5, r.y);
        ctx.lineTo(X(x) + 0.5, Y(y0));
      }
      for (let y = Math.ceil(y0 / sty) * sty; y <= ye + 1e-9; y += sty) {
        ctx.moveTo(r.x, Y(y) + 0.5);
        ctx.lineTo(X(xe), Y(y) + 0.5);
      }
      ctx.stroke();
    }
    ctx.strokeStyle = c.axis;
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(X(x0), Y(Math.max(0, y0)));
    ctx.lineTo(X(xe), Y(Math.max(0, y0)));
    ctx.moveTo(X(Math.max(0, x0)), Y(y0));
    ctx.lineTo(X(Math.max(0, x0)), Y(ye));
    ctx.stroke();
    ctx.globalAlpha = 1;
    if (P.show.coords) {
      ctx.fillStyle = c.axis;
      ctx.globalAlpha = 0.7;
      ctx.font = '500 11px Manrope, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      const dx = Math.max(0, -Math.floor(Math.log10(st)));
      if (!noX)
        for (let x = Math.ceil(x0 / st) * st; x <= xe + 1e-9; x += st)
          ctx.fillText(dc(fmt(x, dx)), X(x), Y(Math.max(0, y0)) + 4);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      const dy = Math.max(0, -Math.floor(Math.log10(sty)));
      for (let y = Math.ceil(y0 / sty) * sty; y <= ye + 1e-9; y += sty) {
        if (Math.abs(y) < sty / 2) continue;
        ctx.fillText(dc(fmt(y, dy)), X(Math.max(0, x0)) - 4, Y(y));
      }
      ctx.globalAlpha = 1;
    }
    if (ttl) txt(ttl, r.x + 6, r.y + 8, c.axis, 13, 'left', 'middle', true);
    return { X, Y, r };
  }
  function seg(fr, a, b, col, w = 2, dash) {
    ctx.strokeStyle = col;
    ctx.lineWidth = w * P.lw;
    ctx.setLineDash(dash || []);
    ctx.beginPath();
    ctx.moveTo(fr.X(a[0]), fr.Y(a[1]));
    ctx.lineTo(fr.X(b[0]), fr.Y(b[1]));
    ctx.stroke();
    ctx.setLineDash([]);
  }
  function dotP(fr, p, col, r = 6, lab) {
    const X = fr.X(p[0]),
      Y = fr.Y(p[1]);
    ctx.fillStyle = col;
    ctx.strokeStyle = P.colors.bg;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(X, Y, r, 0, 7);
    ctx.fill();
    ctx.stroke();
    if (lab) txt(lab, X + 10, Y - 12, col, 14, 'left');
  }
  const pT = () => Math.min(100, H * 0.17),
    pB = () => Math.min(70, H * 0.12);
  function renderNow() {
    DRAGS.length = 0;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.fillStyle = P.colors.bg;
    ctx.fillRect(0, 0, W, H);
    if (!S.res || S.err || !W) return;
    DRAW[S.topic](S.res);
    if (S.stamp) {
      const t = (S.ans || '').replace(/<[^>]+>/g, '');
      ctx.font = '600 15px "Source Serif 4", Georgia, serif';
      const w = ctx.measureText(t).width + 20;
      ctx.fillStyle = P.colors.bg;
      ctx.globalAlpha = 0.85;
      ctx.fillRect(W - w - 12, H - 38, w, 28);
      ctx.globalAlpha = 1;
      ctx.fillStyle = P.colors.axis;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(t, W - w - 2, H - 24);
    }
  }
  const RR = () => ({ x: 64, y: pT(), w: W - 110, h: H - pT() - pB() });
  function curve(fr, f, x0, x1, col, w = 2.4, dash) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(fr.r.x - 2, fr.r.y - 2, fr.r.w + 4, fr.r.h + 4);
    ctx.clip();
    ctx.strokeStyle = col;
    ctx.lineWidth = w * P.lw;
    ctx.setLineDash(dash || []);
    ctx.beginPath();
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
      pen ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y);
      pen = true;
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }
  function curveXY(fr, fx, y0, y1, col, w = 2.4, dash) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(fr.r.x - 2, fr.r.y - 2, fr.r.w + 4, fr.r.h + 4);
    ctx.clip();
    ctx.strokeStyle = col;
    ctx.lineWidth = w * P.lw;
    ctx.setLineDash(dash || []);
    ctx.beginPath();
    for (let i = 0; i <= 400; i++) {
      const y = y0 + ((y1 - y0) * i) / 400,
        x = fx(y);
      const X = fr.X(x),
        Y = fr.Y(y);
      i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }
  function hline(fr, y, x0, x1, col, dash = [5, 4]) {
    ctx.strokeStyle = col;
    ctx.lineWidth = 1.4;
    ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.moveTo(fr.X(x0), fr.Y(y));
    ctx.lineTo(fr.X(x1), fr.Y(y));
    ctx.stroke();
    ctx.setLineDash([]);
  }
  function vline2(fr, x, y0, y1, col, dash = [5, 4]) {
    ctx.strokeStyle = col;
    ctx.lineWidth = 1.4;
    ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.moveTo(fr.X(x), fr.Y(y0));
    ctx.lineTo(fr.X(x), fr.Y(y1));
    ctx.stroke();
    ctx.setLineDash([]);
  }
  const lb = (fr, x, y, s, col, al = 'left', dy = -10) => {
    if (P.show.labels) txt(s, fr.X(x) + (al === 'left' ? 8 : -8), fr.Y(y) + dy, col, 13, al);
  };
  const PT = (fr, x, y, col, l) => dotP(fr, [x, y], col, 6, P.show.labels ? l : '');
  const sh = () => P.show.areas;
  function bars(vals, labels, cols, ttl) {
    const mx = Math.max(...vals.map(Math.abs), 1e-9);
    const fr = frame(RR(), -0.6, vals.length - 0.4, Math.min(0, ...vals) * 1.2, mx * 1.2, false, ttl, true);
    const bw = (fr.X(1) - fr.X(0)) * 0.6;
    vals.forEach((v, i) => {
      const X = fr.X(i),
        Y = fr.Y(Math.max(v, 0)),
        Y0 = fr.Y(Math.min(v, 0));
      ctx.fillStyle = cols[i % cols.length];
      ctx.globalAlpha = 0.78;
      ctx.fillRect(X - bw / 2, Y, bw, Y0 - Y);
      ctx.globalAlpha = 1;
      if (P.show.labels) txt(dc(fmt(v, 2)), X, v >= 0 ? Y - 10 : Y0 + 10, P.colors.axis, 12);
      txt(labels[i], X, fr.Y(0) + 16, P.colors.axis, 11);
    });
  }
  const DRAW = {
    gdp: (R) => {
      const c = P.colors,
        r = RR(),
        w = (r.w - 50) / 2;
      const panel = (rx, vals, labs, cols, ttl) => {
        const mx = Math.max(...vals) * 1.2 || 1;
        const fr = frame({ x: rx, y: r.y, w, h: r.h }, -0.6, vals.length - 0.4, 0, mx, false, ttl, true);
        const bw = (fr.X(1) - fr.X(0)) * 0.6;
        vals.forEach((v, k) => {
          const X = fr.X(k),
            Y = fr.Y(v);
          ctx.fillStyle = cols[k];
          ctx.globalAlpha = 0.78;
          ctx.fillRect(X - bw / 2, Y, bw, fr.Y(0) - Y);
          ctx.globalAlpha = 1;
          if (P.show.labels) txt(dc(fmt(v, 2)), X, Y - 10, c.axis, 12);
          txt(labs[k], X, fr.Y(0) + 16, c.axis, 11);
        });
        return fr;
      };
      const ru = P.lang === 'ru';
      panel(
        r.x,
        [R.nom0, R.nom1, R.real1],
        [
          ru ? 'ном. ВВП 0' : 'nom. GDP 0',
          ru ? 'ном. ВВП 1' : 'nom. GDP 1',
          ru ? 'реал. ВВП 1' : 'real GDP 1',
        ],
        [c.p1, c.p1, c.p2],
        ru ? 'ВВП' : 'GDP'
      );
      const f2 = panel(
        r.x + w + 50,
        [100, R.defl, R.cpi],
        [ru ? 'база' : 'base', ru ? 'дефлятор' : 'deflator', ru ? 'ИПЦ' : 'CPI'],
        [c.axis, c.eq, c.mark],
        ru ? 'индексы цен' : 'price indices'
      );
      hline(f2, 100, -0.6, 2.6, c.axis);
    },
    unemp: (R) => {
      const c = P.colors;
      if (R.um === 'nat') {
        const fr = frame(RR(), 0, 0.5, 0, 0.3, false, 'u ↑   f →');
        curve(fr, (f) => natU(R.s, f), 0.01, 0.5, c.p1, 2.6);
        PT(fr, R.f, R.u, c.eq, `u* = ${dc(fmt(R.u * 100, 2))}%`);
        return;
      }
      const fr = frame(
        RR(),
        -3,
        3,
        -6,
        9,
        false,
        P.lang === 'ru' ? 'рост ВВП, % ↑   Δu, п. п. →' : 'GDP growth, % ↑   Δu, pp →'
      );
      curve(fr, (x) => R.gN * 100 - 2 * x, -3, 3, c.p1, 2.6);
      PT(fr, R.du * 100, R.g * 100, c.eq, `${dc(fmt(R.g * 100, 2))}%`);
    },
    natinc: (R) => {
      const c = P.colors;
      if (R.nm === 'prod') {
        bars(
          [R.Y, R.MPK * R.K, R.MPL * R.L],
          ['Y', 'MPK·K', 'MPL·L'],
          [c.p1, c.p2, c.area],
          P.lang === 'ru' ? 'распределение дохода' : 'income distribution'
        );
        return;
      }
      const a = R.R0,
        b = R.R1,
        rmax = Math.max(R.c / R.d, a.r, b ? b.r : 0) * 1.15,
        Smax = Math.max(R.c, a.S, b ? b.S : 0) * 1.1;
      const fr = frame(RR(), 0, Smax, 0, rmax, false, 'r, % ↑   S, I →');
      curve(fr, (I) => (R.c - I) / R.d, 0, R.c, c.p1, 2.6);
      vline2(fr, a.S, 0, rmax, c.p2, []);
      PT(fr, a.S, a.r, c.eq, 'E');
      if (b && sh()) {
        vline2(fr, b.S, 0, rmax, c.p2, [7, 5]);
        PT(fr, b.S, b.r, c.mark, "E'");
      }
      lb(fr, a.S, rmax * 0.92, 'S', c.p2);
      lb(fr, R.c * 0.1, (R.c - R.c * 0.1) / R.d, 'I(r)', c.p1);
      if (b && sh() && R.dc) curve(fr, (I) => (R.c + R.dc - I) / R.d, 0, R.c + R.dc, c.p1, 2.2, [7, 5]);
      addDrag(fr, 'vl', (b || a).S, 'dG', -1);
      addDrag(fr, 'fx', (r) => R.c + (R.dc || 0) - R.d * r, 'dc', 1);
    },
    money: (R) => {
      const c = P.colors;
      if (R.mm === 'qt')
        bars(
          [R.gM * 100, R.gV * 100, R.gY * 100, R.pi * 100, R.i * 100],
          ['ΔM/M', 'ΔV/V', 'ΔY/Y', 'π', 'i'],
          [c.p1, c.p1, c.p2, c.eq, c.mark],
          '%'
        );
      else
        bars(
          [1, R.m, ...(isFinite(R.M) ? [R.B, R.M] : [])],
          ['1', 'm', ...(isFinite(R.M) ? ['B', 'M'] : [])],
          [c.axis, c.eq, c.p2, c.p1],
          P.lang === 'ru' ? 'денежный мультипликатор' : 'money multiplier'
        );
    },
    open: (R) => {
      const c = P.colors,
        a = R.R0,
        b = R.R1,
        [Y, , , , , cc, d, rs] = R.v;
      const r = RR(),
        w = (r.w - 40) / 2;
      const rmax = Math.max(cc / d, rs) * 1.2,
        Smax = Math.max(cc, a.S) * 1.1;
      const f1 = frame({ x: r.x, y: r.y, w, h: r.h }, 0, Smax, 0, rmax, false, 'r* ↑   S, I →');
      curve(f1, (I) => (cc - I) / d, 0, cc, c.p1, 2.6);
      vline2(f1, a.S, 0, rmax, c.p2, []);
      hline(f1, rs, 0, Smax, c.eq, []);
      if (b && sh()) {
        vline2(f1, b.S, 0, rmax, c.p2, [7, 5]);
        if (R.drs) hline(f1, rs + R.drs, 0, Smax, c.eq, [7, 5]);
        if (R.dc) curve(f1, (I) => (cc + R.dc - I) / d, 0, cc + R.dc, c.p1, 2.2, [7, 5]);
      }
      addDrag(f1, 'vl', (b || a).S, 'dG', -1);
      addDrag(f1, 'hl', rs + (R.drs || 0), 'drs', 1);
      const n0 = R.v[8],
        n1 = R.v[9],
        NXs = [a.NX, b ? b.NX : a.NX],
        emax = Math.max(n0 / n1, a.eps, b ? b.eps : 0) * 1.3;
      const nmin = Math.min(...NXs, -n0 * 0.2),
        nmax = Math.max(n0, ...NXs) * 1.1;
      const f2 = frame({ x: r.x + w + 40, y: r.y, w, h: r.h }, nmin, nmax, 0, emax, false, 'ε ↑   NX →');
      curveXY(f2, (e) => n0 - n1 * e, 0, emax, c.p1, 2.6);
      vline2(f2, a.NX, 0, emax, c.p2, []);
      PT(f2, a.NX, a.eps, c.eq, 'ε');
      if (b && sh()) {
        vline2(f2, b.NX, 0, emax, c.p2, [7, 5]);
        PT(f2, b.NX, b.eps, c.mark, "ε'");
      }
    },
    solow: (R) => {
      const c = P.colors,
        km = Math.max(R.ks, R.kg, R.alt ? R.alt.ks : 0) * 1.5;
      const r = RR(),
        h1 = r.h * 0.62,
        r1 = { x: r.x, y: r.y, w: r.w, h: h1 },
        r2 = { x: r.x, y: r.y + h1 + 28, w: r.w, h: r.h - h1 - 28 };
      const ym = Math.pow(km, R.al) * 1.1;
      const fr = frame(r1, 0, km, 0, ym, false, 'y ↑   k →');
      curve(fr, (k) => Math.pow(k, R.al), 0, km, c.p1, 2.4);
      curve(fr, (k) => R.s * Math.pow(k, R.al), 0, km, c.area, 2.4);
      {
        const s1 = R.alt ? R.alt.s : R.s,
          k1 = R.alt ? R.alt.ks : R.ks;
        addDrag(fr, 'fy', (k) => s1 * Math.pow(k, R.al), 's2', 1 / Math.pow(Math.max(k1, 1e-6), R.al), {
          base: () => s1,
          clamp: (v) => Math.min(0.95, Math.max(0.01, v)),
        });
      }
      if (R.alt && sh() && (R.dn || R.ddl)) curve(fr, (k) => R.alt.br * k, 0, km, c.bad, 2, [7, 5]);
      curve(fr, (k) => R.br * k, 0, km, c.bad, 2.4);
      if (R.alt && sh() && isFinite(R.s2) && R.alt.s !== R.s)
        curve(fr, (k) => R.alt.s * Math.pow(k, R.al), 0, km, c.area, 2, [7, 5]);
      PT(fr, R.ks, R.s * R.ys, c.eq, 'k*');
      vline2(fr, R.kg, 0, Math.pow(R.kg, R.al), c.mark);
      lb(fr, R.kg, Math.pow(R.kg, R.al), P.lang === 'ru' ? 'золотое правило' : 'golden rule', c.mark);
      if (R.alt && sh()) PT(fr, R.alt.ks, R.alt.s * R.alt.ys, c.mark, "k*'");
      if (P.show.labels) {
        txt('f(k)', fr.X(km * 0.95), fr.Y(Math.pow(km * 0.95, R.al)) - 10, c.p1, 12);
        txt('s·f(k)', fr.X(km * 0.95), fr.Y(R.s * Math.pow(km * 0.95, R.al)) + 12, c.area, 12);
        txt('(δ+n+g)k', fr.X(km * 0.8), fr.Y(R.br * km * 0.8) - 12, c.bad, 12);
      }
      const tr = R.alt && sh() ? R.alt.tr : R.tr,
        tm = tr.length - 1,
        kk = Math.max(...tr.map((o) => o.k)) * 1.15;
      const f2 = frame(r2, 0, tm, 0, kk, false, 'k(t)');
      curve(f2, (t) => tr[Math.min(tm, Math.round(t))].k, 0, tm, c.p2, 2.2);
      hline(f2, R.alt && sh() ? R.alt.ks : R.ks, 0, tm, c.eq);
    },
    cross: (R) => {
      const c = P.colors,
        a = R.R0,
        b = R.R1;
      const Ym = Math.max(a.Y, b ? b.Y : 0) * 1.35;
      const fr = frame(
        RR(),
        0,
        Ym,
        0,
        Ym,
        true,
        P.lang === 'ru' ? 'расходы E ↑   доход Y →' : 'expenditure E ↑   income Y →'
      );
      curve(fr, (Y) => Y, 0, Ym, c.axis, 1.4, [4, 4]);
      const PE = (G, T) => (Y) => R.a + R.b * (Y - T - R.t * Y) + R.I + G;
      curve(fr, PE(R.G, R.T), 0, Ym, c.p1, 2.6);
      PT(fr, a.Y, a.Y, c.eq, 'E');
      if (b && sh()) {
        curve(fr, PE(R.G + R.dG, R.T + R.dT), 0, Ym, c.p1, 2.4, [7, 5]);
        PT(fr, b.Y, b.Y, c.mark, "E'");
      }
      lb(fr, Ym * 0.85, Ym * 0.85, 'E = Y', c.axis);
      lb(fr, Ym * 0.05, PE(R.G, R.T)(Ym * 0.05), 'PE', c.p1);
      addDrag(fr, 'fy', PE(R.G + R.dG, R.T + R.dT), 'dG', 1);
    },
    islm: (R) => {
      const c = P.colors,
        a = R.R0,
        b = R.R1,
        rm = Math.max(a.r, b ? b.r : 0, 1) * 2,
        Ym = Math.max(a.Y, b ? b.Y : 0) * 1.6;
      const fr = frame(RR(), 0, Ym, 0, rm, false, 'r ↑   Y →');
      curveXY(fr, a.ISY, 0, rm, c.p1, 2.6);
      curveXY(fr, a.LMY, 0, rm, c.p2, 2.6);
      PT(fr, a.Y, a.r, c.eq, 'E');
      if (b && sh()) {
        if (R.dG || R.dT || R.dA || R.dI) curveXY(fr, b.ISY, 0, rm, c.p1, 2.2, [7, 5]);
        if (R.dMd || R.dP) curveXY(fr, b.LMY, 0, rm, c.p2, 2.2, [7, 5]);
        if (R.dM) curveXY(fr, b.LMY, 0, rm, c.p2, 2.2, [7, 5]);
        PT(fr, b.Y, b.r, c.mark, "E'");
      }
      lb(fr, a.ISY(rm * 0.1), rm * 0.1, 'IS', c.p1);
      lb(fr, a.LMY(rm * 0.9), rm * 0.9, 'LM', c.p2, 'right');
      const F = b || a;
      addDrag(fr, 'fx', F.ISY, 'dG', 1 - R.p.b);
      addDrag(fr, 'fx', F.LMY, 'dM', R.p.e * (R.p.P + (R.dP || 0)));
    },
    mf: (R) => {
      const c = P.colors,
        a = R.R0,
        b = R.R1,
        eM = Math.max(a.e, b && b.e ? b.e : 0, 1) * 2,
        Ym = Math.max(a.Y, b ? b.Y : 0) * 1.5;
      const fr = frame(RR(), 0, Ym, 0, eM, false, 'e ↑   Y →');
      curveXY(fr, a.IS, 0, eM, c.p1, 2.6);
      vline2(fr, a.Y, 0, eM, c.p2, []);
      PT(fr, a.Y, a.e, c.eq, 'E');
      if (b && sh()) {
        if (R.dG) {
          const p2 = { ...R.p, G: R.p.G + R.dG };
          const is2 = (ee) =>
            (p2.a - p2.b * p2.T + (p2.c - p2.d * p2.rs) + p2.G + p2.n0 - p2.n1 * ee) / (1 - p2.b);
          curveXY(fr, is2, 0, eM, c.p1, 2.2, [7, 5]);
        }
        if (R.reg === 'float' && R.dM) vline2(fr, b.Y, 0, eM, c.p2, [7, 5]);
        if (R.reg === 'fixed') vline2(fr, b.Y, 0, eM, c.p2, [7, 5]);
        PT(fr, b.Y, b.e, c.mark, "E'");
      }
      lb(fr, a.IS(eM * 0.15), eM * 0.15, 'IS*', c.p1);
      lb(fr, a.Y, eM * 0.9, 'LM*', c.p2);
      {
        const p1 = R.p1;
        const isF = (ee) =>
          (p1.a - p1.b * p1.T + (p1.c - p1.d * p1.rs) + p1.G + p1.n0 - p1.n1 * ee) / (1 - p1.b);
        addDrag(fr, 'fx', isF, 'dG', 1 - R.p.b);
        if (R.reg === 'float') addDrag(fr, 'vl', (b || a).Y, 'dM', R.p.e * R.p.P);
      }
    },
    adas: (R) => {
      const c = P.colors,
        a = R.R0,
        b = R.R1;
      const Pm = Math.max(a.P, b ? b.P : 0, R.LR ? R.LR.P : 0) * 1.8,
        Ym = R.Yb * 1.8;
      const fr = frame(RR(), 0, Ym, 0, Pm, false, 'P ↑   Y →');
      curveXY(fr, a.AD, Pm * 0.05, Pm, c.p1, 2.6);
      if (R.al > 0) curve(fr, (Y) => R.Pe + (Y - R.Yb) / R.al, 0, Ym, c.p2, 2.6);
      else hline(fr, R.Pe, 0, Ym, c.p2, []);
      vline2(fr, R.Yb, 0, Pm, c.axis, []);
      PT(fr, a.Y, a.P, c.eq, 'E');
      if (b && sh()) {
        if (R.dM) curveXY(fr, b.AD, Pm * 0.05, Pm, c.p1, 2.2, [7, 5]);
        if (R.dPe) {
          if (R.al > 0) curve(fr, (Y) => R.Pe + R.dPe + (Y - R.Yb) / R.al, 0, Ym, c.p2, 2.2, [7, 5]);
          else hline(fr, R.Pe + R.dPe, 0, Ym, c.p2, [7, 5]);
        }
        PT(fr, b.Y, b.P, c.mark, "E'");
        PT(fr, R.LR.Y, R.LR.P, c.bad, P.lang === 'ru' ? 'долгий период' : 'long run');
      }
      lb(fr, R.Yb, Pm * 0.95, 'LRAS', c.axis);
      lb(fr, Ym * 0.9, R.al > 0 ? R.Pe + (Ym * 0.9 - R.Yb) / R.al : R.Pe, 'SRAS', c.p2, 'right');
      lb(fr, a.AD(Pm * 0.2), Pm * 0.2, 'AD', c.p1);
      const F = b || a,
        Pe1 = R.Pe + (R.dPe || 0);
      addDrag(fr, 'fx', F.AD, 'dM', F.P / (R.V + (R.dV || 0)));
      if (R.al > 0) addDrag(fr, 'fy', (Y) => Pe1 + (Y - R.Yb - (R.dYb || 0)) / R.al, 'dPe', 1);
      else addDrag(fr, 'hl', Pe1, 'dPe', 1);
    },
    phil: (R) => {
      const c = P.colors;
      const fr = frame(RR(), 0, 0.16, -0.06, 0.14, false, 'π ↑   u →');
      curve(fr, (u) => phillips(R.pe, R.be, R.un, u, R.v), 0, 0.16, c.p1, 2.6);
      if (R.v) curve(fr, (u) => phillips(R.pe, R.be, R.un, u, 0), 0, 0.16, c.p1, 1.6, [6, 4]);
      vline2(fr, R.un, -0.06, 0.14, c.axis, []);
      hline(fr, R.pe, 0, 0.16, c.mark);
      PT(fr, R.u, R.pi, c.eq, `π = ${dc(fmt(R.pi * 100, 2))}%`);
      lb(fr, R.un, 0.13, 'uⁿ', c.axis);
      if (R.pi2 != null && sh()) {
        if (R.dpe) curve(fr, (u) => phillips(R.pe + R.dpe, R.be, R.un, u, R.v), 0, 0.16, c.p1, 2.2, [7, 5]);
        PT(fr, R.u + R.du, R.pi2, c.mark, `π' = ${dc(fmt(R.pi2 * 100, 2))}%`);
      }
      addDrag(fr, 'fy', (u) => phillips(R.pe, R.be, R.un, u, R.v), 'v', 1);
    },
  };

  /* переключатели */
  const TOG = ['bgGrid', 'coords', 'labels', 'areas', 'hints'];
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
    syncTogVis();
  }
  function syncToggles() {
    document.querySelectorAll('#tog input').forEach((i) => {
      i.checked = !!P.show[i.dataset.k];
    });
    syncTogVis();
  }
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
      return;
    }
    const p = e.target.closest('[data-pre]');
    if (p) loadPreset(p.dataset.pre);
  });
  function fitView() {
    req();
  }
  function play() {}
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
    const r = cv.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const niceRound = (v) => {
    if (!isFinite(v)) return 0;
    const a = Math.abs(v);
    const d = a >= 1000 ? 0 : a >= 100 ? 1 : a >= 10 ? 2 : a >= 1 ? 3 : 4;
    return +v.toFixed(d);
  };
  cv.addEventListener('pointerdown', (e) => {
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
    cv.setPointerCapture(e.pointerId);
    cv.style.cursor = 'grabbing';
    e.preventDefault();
  });
  cv.addEventListener('pointermove', (e) => {
    const p = cvPos(e);
    if (!dragNow) {
      cv.style.cursor = pickDrag(p.x, p.y) ? 'grab' : 'default';
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
        recompute();
      });
  });
  const endDrag = () => {
    if (dragNow) {
      dragNow = null;
      cv.style.cursor = 'default';
    }
  };
  cv.addEventListener('pointerup', endDrag);
  cv.addEventListener('pointercancel', endDrag);
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
      `<p class="note" style="margin:.1rem 0 .5rem">${L.fac_note}</p><div class="tw"><table class="tab fac"><tr><th style="text-align:left">${L.fac_f}</th><th style="text-align:left">${L.fac_c}</th>${vars.map((v) => `<th>${v}</th>`).join('')}</tr>${rows.map(({ sh, b1 }) => `<tr data-shock="${sh.id}" class="${S.shock === sh.id ? 'on' : ''}"><td style="text-align:left">${sh[P.lang] || sh.ru}</td><td style="text-align:left">${(P.lang === 'en' ? sh.cen : sh.c) || ''}</td>${vars.map((v) => `<td>${arrowOf(b0[v], b1[v])}</td>`).join('')}</tr>`).join('')}</table></div>` +
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
      renderForm();
      recompute();
      return;
    }
    if (e.target.id === 'facReset') {
      S.inp[S.topic] = cleared(S.topic);
      S.shock = null;
      renderForm();
      recompute();
    }
  });
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
  let DL = null,
    fmtMode = 'tex';
  const LOCAL = !window.claude;
  const canSave = () => !!(DL || LOCAL);
  (async () => {
    try {
      if (window.claude && typeof window.claude.use === 'function') DL = await window.claude.use('downloads');
    } catch (e) {
      DL = null;
    }
    S.dlTried = true;
    updExport();
  })();
  
  function updExport() {
    const L = T();
    $('#xPng').disabled = !canSave();
    $('#xNote').textContent = !canSave() && S.dlTried ? L.xNoDl : '';
  }
  function flash(msg, ms = 3500) {
    $('#xNote').textContent = msg;
    clearTimeout(flash.t);
    if (ms) flash.t = setTimeout(updExport, ms);
  }
  async function saveFile(name, data) {
    const L = T();
    if (!DL) {
      if (LOCAL) {
        const u = URL.createObjectURL(data),
          a = document.createElement('a');
        a.href = u;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(u), 5000);
        flash(L.xSaved);
      }
      return;
    }
    try {
      await DL.save({ filename: name, data });
      flash(L.xSaved);
    } catch (e) {
      const c = e && e.code;
      if (c === 'declined') {
        updExport();
        return;
      }
      if (
        c === 'unavailable' ||
        c === 'not_granted' ||
        c === 'capability_disabled' ||
        c === 'capability_removed'
      ) {
        DL = null;
        S.dlTried = true;
        updExport();
        return;
      }
      flash(c === 'rate_limited' ? L.xBusy : L.xFail);
    }
  }
  function exportPng() {
    if (!canSave()) return;
    S.stamp = $('#xStamp').checked;
    renderNow();
    cv.toBlob((b) => {
      S.stamp = false;
      req();
      if (b) saveFile('macroeconomics.png', b);
    }, 'image/png');
  }
  
  async function copyTex() {
    const ta = $('#xTex'),
      L = T();
    let ok = false;
    try {
      await navigator.clipboard.writeText(ta.value);
      ok = true;
    } catch (e) {}
    if (!ok) {
      ta.focus();
      ta.select();
      try {
        ok = document.execCommand('copy');
      } catch (e) {}
    }
    flash(ok ? L.xCopied : L.xSelect);
  }
  $('#xPng').onclick = exportPng;
  
  $('#xCopy').onclick = copyTex;
  document.querySelectorAll('#xFmt button').forEach(
    (b) =>
      (b.onclick = () => {
        fmtMode = b.dataset.f;
        document.querySelectorAll('#xFmt button').forEach((x) => x.classList.toggle('on', x === b));
        renderTex();
      })
  );

  function illSvg() {
    return '';
  }
  function runDemo(id) {
    const d = DEMOS[id];
    if (!d) return;
    loadPreset(d.p);
    showPanel('solve');
  }
  function renderTex() {
    const ta = $('#xTex');
    if (!ta) return;
    if (S.err || !S.res) {
      ta.value = '';
      return;
    }
    const a = (S.ans || '').replace(/<[^>]+>/g, '');
    if (fmtMode === 'txt') {
      ta.value = `${T()['t_' + S.topic]}\n${a}`;
      return;
    }
    if (fmtMode === 'tex') {
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
  const KEYS = [
    ['1 – 9', 'k_topic'],
    ['[ / ]', 'k_prev'],
    ['G', 'k_grid'],
    ['H', 'k_hint'],
    ['S', 'k_png'],
    ['/', 'k_gloss'],
    ['?', 'k_keys'],
    ['Esc', 'k_esc'],
  ];
  function renderKeys() {
    const L = T();
    $('#keysList').innerHTML = KEYS.map(
      ([k, d]) =>
        `<span>${k
          .split(' ')
          .map((p, i) => (i > 0 && /^[+\/–]$/.test(p) ? p : `<kbd>${p}</kbd>`))
          .join(' ')}</span><span>${L[d]}</span>`
    ).join('');
  }
  function openKeys() {
    renderKeys();
    closeDrawers();
    openDrawer('dKeys');
  }
  $('#openKeys').onclick = openKeys;
  $('#openKeys2').onclick = openKeys;

  function flip(k) {
    P.show[k] = !P.show[k];
    syncToggles();
    save();
    renderCaption();
    req();
    const L = T();
    toast(`${L.tog[k]}: ${P.show[k] ? L.on : L.off}`);
  }
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const tg = e.target,
      tag = tg && tg.tagName;
    if (
      (tag === 'INPUT' && !['checkbox', 'range', 'radio', 'color'].includes(tg.type)) ||
      tag === 'TEXTAREA' ||
      tag === 'SELECT' ||
      (tg && tg.isContentEditable)
    )
      return;
    const isQ = e.key === '?' || (e.code === 'Slash' && e.shiftKey);
    if (document.querySelector('.drawer.open') && !isQ) return;
    const c = e.code,
      L = T();
    let h = true;
    if (isQ) openKeys();
    else if (/^(Digit|Numpad)[1-9]$/.test(c)) {
      setTopic(TOPICS[+c.slice(-1) - 1]);
      toast(L['t_' + S.topic]);
    } else if (c === 'BracketLeft' || c === 'BracketRight') {
      const list = PRE[S.topic];
      let i = list.findIndex((p) => p[0] === S.preset);
      i = (i + (c === 'BracketLeft' ? -1 : 1) + list.length) % list.length;
      loadPreset(list[i][0]);
      toast(P.lang === 'ru' ? list[i][2] : list[i][3]);
    } else if (c === 'KeyG') flip('bgGrid');
    else if (c === 'KeyH') flip('hints');
    else if (c === 'KeyS') {
      if (canSave()) exportPng();
      else toast(L.xNoDl);
    } else if (c === 'Slash') {
      $('#openGloss').click();
      setTimeout(() => $('#gq').focus(), 30);
    } else h = false;
    if (h) e.preventDefault();
  });
  /* ---------- настройки ---------- */
  $('#openSet').onclick = () => {
    syncSettings();
    openDrawer('dSet');
  };
  function buildSettings() {
    document.querySelectorAll('#langSeg button,#langSeg2 button').forEach(
      (b) =>
        (b.onclick = () => {
          P.lang = b.dataset.l;
          applyLang();
          save();
        })
    );
    document.querySelectorAll('#uiSeg button').forEach(
      (b) =>
        (b.onclick = () => {
          P.ui = b.dataset.v;
          applyPrefs();
        })
    );
    document.querySelectorAll('#dockSeg button').forEach(
      (b) =>
        (b.onclick = () => {
          P.dock = b.dataset.v;
          applyPrefs();
        })
    );
    $('#wR').oninput = (e) => {
      P.width = +e.target.value;
      applyPrefs();
    };
    $('#hR').oninput = (e) => {
      P.bottomH = +e.target.value;
      applyPrefs();
    };
    $('#fR').oninput = (e) => {
      P.font = +e.target.value;
      applyPrefs();
    };
    $('#lR').oninput = (e) => {
      P.lw = +e.target.value;
      applyPrefs();
    };
    $('#resetOrder').onclick = () => {
      P.order = PANELS.slice();
      P.collapsed = {};
      applyPrefs();
    };
    $('#resetAll').onclick = () => {
      const lg = P.lang,
        rd = P.read,
        last = P.last;
      P = clone(DEF);
      P.lang = lg;
      P.read = rd || {};
      P.last = last;
      syncToggles();
      applyPrefs();
      renderAll();
    };
  }
  function buildPal() {
    const L = T();
    const pc = $('#palChips');
    pc.innerHTML = '';
    Object.entries(PAL).forEach(([k, p]) => {
      const b = document.createElement('button');
      b.className = 'chip';
      b.dataset.p = k;
      b.innerHTML = `<span class="sw" style="background:${p.bg};box-shadow:inset 0 0 0 3px ${p.f || Object.values(p)[3]}"></span>${L.pal[k]}`;
      b.onclick = () => {
        P.palette = k;
        P.colors = { ...PAL[k] };
        applyPrefs();
      };
      pc.appendChild(b);
    });
    const cs = $('#colors');
    cs.innerHTML = '';
    Object.keys(L.colors).forEach((k) => {
      const l = document.createElement('label');
      l.innerHTML = `<input type="color" data-k="${k}"> ${L.colors[k]}`;
      l.querySelector('input').oninput = (e) => {
        P.colors[k] = e.target.value;
        P.palette = 'custom';
        applyPrefs();
      };
      cs.appendChild(l);
    });
  }
  function applyLang() {
    const L = T();
    LNG = P.lang;
    document.documentElement.lang = P.lang;
    document.title = L.title;
    document.querySelectorAll('[data-i]').forEach((e) => {
      e.textContent = L[e.dataset.i];
    });
    document.querySelectorAll('[data-ih]').forEach((e) => {
      e.innerHTML = L[e.dataset.ih];
    });
    document.querySelectorAll('[data-it]').forEach((e) => {
      e.title = L[e.dataset.it];
      e.setAttribute('aria-label', L[e.dataset.it]);
    });
    document.querySelectorAll('[data-ia]').forEach((e) => {
      e.setAttribute('aria-label', L[e.dataset.ia]);
    });
    $('#gq').placeholder = L.search;
    cv.setAttribute('aria-label', L.canvas);
    document
      .querySelectorAll('#langSeg button,#langSeg2 button')
      .forEach((b) => b.classList.toggle('on', b.dataset.l === P.lang));
    buildPal();
    buildToggles();
    syncToggles();
    syncSettings();
    updExport();
    renderKeys();
    if ($('#dGloss').classList.contains('open')) rerenderGloss();
    renderForm();
    recompute();
  }
  function syncSettings() {
    document.querySelectorAll('#uiSeg button').forEach((b) => b.classList.toggle('on', b.dataset.v === P.ui));
    document
      .querySelectorAll('#dockSeg button')
      .forEach((b) => b.classList.toggle('on', b.dataset.v === P.dock));
    document
      .querySelectorAll('#palChips .chip')
      .forEach((b) => b.classList.toggle('on', b.dataset.p === P.palette));
    document.querySelectorAll('#colors input').forEach((i) => {
      i.value = P.colors[i.dataset.k];
    });
    $('#wR').value = P.width;
    $('#wOut').textContent = P.width + ' px';
    $('#hR').value = P.bottomH;
    $('#hOut').textContent = P.bottomH + ' %';
    $('#fR').value = P.font;
    $('#fOut').textContent = P.font + ' %';
    $('#lR').value = P.lw;
    $('#lOut').textContent = '×' + fmt(P.lw, 1);
  }
  function effDock() {
    return P.dock === 'auto' ? (innerWidth < 760 ? 'bottom' : 'right') : P.dock;
  }
  function applyDock() {
    const d = effDock();
    main.dataset.dock = d;
    if (d === 'float') {
      const mr = main.getBoundingClientRect(),
        sw = side.offsetWidth || P.width;
      P.float.x = Math.max(8, Math.min(P.float.x, mr.width - Math.min(sw, mr.width) - 8));
      P.float.y = Math.max(8, Math.min(P.float.y, mr.height - 80));
      side.style.left = P.float.x + 'px';
      side.style.top = P.float.y + 'px';
    } else {
      side.style.left = '';
      side.style.top = '';
    }
  }
  function applyPrefs() {
    const r = document.documentElement;
    if (P.ui === 'auto') r.removeAttribute('data-theme');
    else r.setAttribute('data-theme', P.ui);
    r.style.fontSize = (16 * P.font) / 100 + 'px';
    r.style.setProperty('--side-w', P.width + 'px');
    r.style.setProperty('--side-h', P.bottomH + '%');
    Object.entries(P.colors).forEach(([k, v]) => r.style.setProperty('--s-' + k, v));
    applyDock();
    applyOrder();
    syncSettings();
    save();
    req();
  }
  (() => {
    const g = $('#grip');
    let st = null;
    g.addEventListener('pointerdown', (e) => {
      g.setPointerCapture(e.pointerId);
      st = { x: e.clientX, y: e.clientY, fx: P.float.x, fy: P.float.y };
    });
    g.addEventListener('pointermove', (e) => {
      if (!st) return;
      P.float.x = st.fx + e.clientX - st.x;
      P.float.y = st.fy + e.clientY - st.y;
      applyDock();
    });
    const end = () => {
      if (st) {
        st = null;
        save();
      }
    };
    g.addEventListener('pointerup', end);
    g.addEventListener('pointercancel', end);
  })();
  window.addEventListener('resize', () => applyDock());

  buildPanels();
  buildSettings();
  applyPrefs();
  renderForm();
  applyLang();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => req());
})();
