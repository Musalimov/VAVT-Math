import { applyTexts, createSettings } from '../settings.js';
import { createKeys } from '../keys.js';
import { createExport } from '../export.js';
import { createPanels } from '../panels.js';
import { initDrawers } from '../drawers.js';
import { initHome } from '../home.js';
import { createGlossary } from '../glossary.js';
import { toast } from '../toast.js';
import { $, clone } from '../dom.js';
import { loadPrefs, makeSaver } from '../prefs.js';
import { dc, fmt } from '../format.js';
import { langFrom } from '../i18n.js';

/**
 * Общий каркас экономических тренажёров (макро, микро, игры, ТВ).
 * AP — то, что у тренажёра своё (ключ хранилища, настройки по умолчанию,
 * разделы, решатели, рисование). Доступ ленивый (геттеры), поэтому H можно
 * описать до того, как определены функции тренажёра. (Имя AP, а не H: H — высота холста.)
 * Возвращает ECON — живой доступ к состоянию и функциям каркаса; ECON.start()
 * запускает тренажёр (один раз, после того как тренажёр всё определил).
 * Переопределяемые (своя версия у тренажёра — через AP): renderForm, recompute, prop, renderPresets, renderCaption, syncTogVis, frame, buildToggles, illSvg, applyLang.
 * Хуки: CHAP, COMP, DEF, DEMOS, FORMAL, FORMS, GROUPS, ILL, KEY, KEYS, PANELS, PRE, REL, S, T, TERMS, TOG, TOPICS, capKey, loadPreset, relTogs, renderAll, renderNow, renderTex.
 * @param {any} AP
 */
export function createEconApp(AP) {
  // Функции, которые тренажёр может заменить своими (ТВ): AP.<имя> || вариант каркаса.
  const renderForm = AP.renderForm || renderForm0;
  const recompute = AP.recompute || recompute0;
  const prop = AP.prop || prop0;
  const renderPresets = AP.renderPresets || renderPresets0;
  const renderCaption = AP.renderCaption || renderCaption0;
  const syncTogVis = AP.syncTogVis || syncTogVis0;
  const frame = AP.frame || frame0;
  const buildToggles = AP.buildToggles || buildToggles0;
  const illSvg = AP.illSvg || illSvg0;
  const applyLang = AP.applyLang || applyLang0;
  let LNG = 'ru';
  const LOADED = loadPrefs({ key: AP.KEY, defaults: AP.DEF, panels: AP.PANELS });
  let P = LOADED.prefs;
  if (LOADED.status === 'corrupt') setTimeout(() => toast(AP.T().prefsReset, 5000));
  langFrom(() => P.lang);
  if (!P.lang) P.lang = (navigator.language || '').toLowerCase().startsWith('ru') ? 'ru' : 'en';
  function save() {
    (save.f ||= makeSaver({ key: AP.KEY, get: () => P, onFail: () => toast(AP.T().prefsNoSave, 4000) }))();
  }
  function renderForm0() {
    const box = $('#form'),
      L = AP.T(),
      t = AP.S.topic,
      I = AP.S.inp[t];
    box.innerHTML = '';
    for (const [k, type, a, b] of AP.FORMS[t]) {
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
    const L = AP.T(),
      box = $('#topicBox');
    box.innerHTML = AP.GROUPS.map(
      ([g, ts]) =>
        `<div class="tg"><div class="tgl">${L.grp[g]}</div><div class="seg">${ts.map((t) => `<button data-t="${t}" class="${t === AP.S.topic ? 'on' : ''}" title="${L.tt[t] || ''}">${L['t_' + t]}</button>`).join('')}</div></div>`
    ).join('');
  }
  function setTopic(t) {
    if (!AP.TOPICS.includes(t)) return;
    AP.S.topic = t;
    P.topic = t;
    AP.S.preset = null;
    save();
    renderForm();
    recompute();
  }
  function recompute0() {
    const t = AP.S.topic,
      I = AP.S.inp[t];
    AP.S.err = null;
    AP.S.res = null;
    try {
      AP.S.res = AP.COMP[t](I);
    } catch (e) {
      if (e instanceof Error) console.error(e);
      AP.S.err = e instanceof Error ? { msg: 'bug' } : e && e.msg ? e : { msg: 'num' };
    }
    P.inp = AP.S.inp;
    P.preset = AP.S.preset;
    save();
    AP.renderAll();
  }
  const ol = (a) =>
    `<ol class="stp">${a
      .filter(Boolean)
      .map((s) => `<li>${s}</li>`)
      .join('')}</ol>`;
  function prop0(k, v) {
    return `<div class="prop"><span class="k">${k}</span><span class="v">${v}</span></div>`;
  }
  function renderPresets0() {
    const box = $('#pre');
    box.innerHTML = '';
    AP.PRE[AP.S.topic].forEach(([id, , ru, en]) => {
      const b = document.createElement('button');
      b.className = 'chip' + (AP.S.preset === id ? ' on' : '');
      b.dataset.pre = id;
      b.textContent = P.lang === 'ru' ? ru : en;
      box.appendChild(b);
    });
  }
  function renderOverlay() {
    const ov = $('#ov'),
      L = AP.T();
    if (AP.S.err || !AP.S.res) {
      ov.innerHTML = `<span class="tt">${L.cap.err}</span>`;
      return;
    }
    ov.innerHTML = `<span>${AP.S.ans || ''}</span><span class="tt">${L['t_' + AP.S.topic]}</span>`;
  }
  function renderCaption0() {
    const cap = $('#cap');
    $('#capOpen').hidden = !!P.show.hints;
    if (!P.show.hints) {
      cap.hidden = true;
      return;
    }
    cap.hidden = false;
    $('#capT').textContent = AP.S.err ? AP.T().cap.err : AP.T().cap[AP.capKey()];
  }
  function syncTogVis0() {
    const r = AP.relTogs();
    document.querySelectorAll('#tog label').forEach((l) => {
      l.style.display = r.includes(l.querySelector('input').dataset.k) ? '' : 'none';
    });
  }
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
        AP.renderNow();
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
  function frame0(r, x0, x1, y0, y1, eq, ttl, noX) {
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
  function buildToggles0() {
    const box = $('#tog');
    box.innerHTML = '';
    AP.TOG.forEach((k) => {
      const l = document.createElement('label');
      l.className = 'chk';
      l.innerHTML = `<input type="checkbox" data-k="${k}"> <span>${AP.T().tog[k]}</span>`;
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
    if (p) AP.loadPreset(p.dataset.pre);
  });
  function fitView() {
    req();
  }
  function play() {}
  const gloss = createGlossary({
    prefs: () => P,
    save,
    T: AP.T,
    content: { TERMS: AP.TERMS, FORMAL: AP.FORMAL, ILL: AP.ILL, CHAP: AP.CHAP, REL: AP.REL, DEMOS: AP.DEMOS },
    onDemo: (id) => runDemo(id),
    illSvg,
  });
  const { termTitle, renderGloss, rerenderGloss, openTerm } = gloss;
  gloss.init();
  initDrawers();
  initHome();
  const keysUi = createKeys({ T: AP.T, keys: AP.KEYS });
  const { renderKeys, openKeys } = keysUi;
  keysUi.init();
  // экспорт создаётся в start(): ему нужно состояние тренажёра (AP.S), а оно описывается после createEconApp
  let ex, canSave, updExport, flash, exportPng;
  let fmtMode = 'tex';
  document.querySelectorAll('#xFmt button').forEach(
    (b) =>
      (b.onclick = () => {
        fmtMode = b.dataset.f;
        document.querySelectorAll('#xFmt button').forEach((x) => x.classList.toggle('on', x === b));
        AP.renderTex();
      })
  );
  function illSvg0() {
    return '';
  }
  function runDemo(id) {
    const d = AP.DEMOS[id];
    if (!d) return;
    AP.loadPreset(d.p);
    showPanel('solve');
  }
  function flip(k) {
    P.show[k] = !P.show[k];
    syncToggles();
    save();
    renderCaption();
    req();
    const L = AP.T();
    toast(`${L.tog[k]}: ${P.show[k] ? L.on : L.off}`);
  }
  const settings = createSettings({
    prefs: () => P,
    setPrefs: (np) => {
      P = np;
    },
    save,
    T: AP.T,
    defaults: AP.DEF,
    panels: AP.PANELS,
    palettes: AP.PAL,
    main,
    side,
    hooks: { applyLang, applyOrder, syncToggles, renderAll: AP.renderAll, req },
  });
  const { buildSettings, buildPal, syncSettings, applyDock, applyPrefs } = settings;
  settings.init();
  function applyLang0() {
    const L = AP.T();
    LNG = P.lang;
    document.documentElement.lang = P.lang;
    document.title = L.title;
    applyTexts(L);
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
  function start() {
    // начальный ввод разделов: первый пример, поверх — сохранённый
    AP.TOPICS.forEach((t) => {
      AP.S.inp[t] = clone(AP.PRE[t][0][1]);
    });
    if (P.inp) for (const t of AP.TOPICS) if (P.inp[t]) AP.S.inp[t] = { ...AP.S.inp[t], ...P.inp[t] };
    ex = createExport({ name: AP.appName, T: AP.T, state: AP.S, cv, renderNow: AP.renderNow, req });
    ({ canSave, updExport, flash, exportPng } = ex);
    ex.init();
    buildPanels();
    buildSettings();
    applyPrefs();
    renderForm();
    applyLang();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => req());
  }
  return {
    get DPR() {
      return DPR;
    },
    get H() {
      return H;
    },
    get P() {
      return P;
    },
    get W() {
      return W;
    },
    get canSave() {
      return canSave;
    },
    get ctx() {
      return ctx;
    },
    get cv() {
      return cv;
    },
    get dotP() {
      return dotP;
    },
    get exportPng() {
      return exportPng;
    },
    get flip() {
      return flip;
    },
    get fmtMode() {
      return fmtMode;
    },
    get frame() {
      return frame;
    },
    get ol() {
      return ol;
    },
    get openKeys() {
      return openKeys;
    },
    get pB() {
      return pB;
    },
    get pT() {
      return pT;
    },
    get prop() {
      return prop;
    },
    get recompute() {
      return recompute;
    },
    get renderCaption() {
      return renderCaption;
    },
    get renderForm() {
      return renderForm;
    },
    get renderOverlay() {
      return renderOverlay;
    },
    get renderPresets() {
      return renderPresets;
    },
    get req() {
      return req;
    },
    get setTopic() {
      return setTopic;
    },
    get syncTogVis() {
      return syncTogVis;
    },
    get txt() {
      return txt;
    },
    get seg() {
      return seg;
    },
    get buildPal() {
      return buildPal;
    },
    get niceStep() {
      return niceStep;
    },
    get renderKeys() {
      return renderKeys;
    },
    get rerenderGloss() {
      return rerenderGloss;
    },
    get save() {
      return save;
    },
    get syncSettings() {
      return syncSettings;
    },
    get syncToggles() {
      return syncToggles;
    },
    get updExport() {
      return updExport;
    },
    start,
  };
}
