import { $ } from '../dom.js';
import { dc } from '../format.js';

/**
 * Кривые на сцене макро и микро: перетаскивание (DRAGS, addDrag, захват по
 * расстоянию, округление), примитивы графика (RR, curve, hline, vline2),
 * шоки и блок «факторы и сдвиги» (shockNote, cleared, renderFactors, стрелки).
 * Создаётся после createEconApp и состояния S тренажёра.
 * Хуки (AP): COMP, DELTAS, ECON, EFFV, S, SHOCKS, T, nI.
 * @param {any} AP
 */
export function createCurves(AP) {
  const q4 = (v) => dc(String(+(+v).toFixed(4)));
  function shockNote() {
    const t = AP.S.topic;
    if (!AP.S.shock || !AP.SHOCKS[t]) return '';
    const sh = AP.SHOCKS[t].find((s) => s.id === AP.S.shock);
    return sh
      ? `<p class="idea"><b>${sh[AP.ECON.P.lang] || sh.ru}:</b> ${AP.ECON.P.lang === 'en' ? sh.cen : sh.c}</p>`
      : '';
  }
  const RR = () => ({
    x: 64,
    y: AP.ECON.pT(),
    w: AP.ECON.W - 110,
    h: AP.ECON.H - AP.ECON.pT() - AP.ECON.pB(),
  });
  function curve(fr, f, x0, x1, col, w = 2.4, dash) {
    AP.ECON.ctx.save();
    AP.ECON.ctx.beginPath();
    AP.ECON.ctx.rect(fr.r.x - 2, fr.r.y - 2, fr.r.w + 4, fr.r.h + 4);
    AP.ECON.ctx.clip();
    AP.ECON.ctx.strokeStyle = col;
    AP.ECON.ctx.lineWidth = w * AP.ECON.P.lw;
    AP.ECON.ctx.setLineDash(dash || []);
    AP.ECON.ctx.beginPath();
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
      pen ? AP.ECON.ctx.lineTo(X, Y) : AP.ECON.ctx.moveTo(X, Y);
      pen = true;
    }
    AP.ECON.ctx.stroke();
    AP.ECON.ctx.setLineDash([]);
    AP.ECON.ctx.restore();
  }
  function hline(fr, y, x0, x1, col, dash = [5, 4]) {
    AP.ECON.ctx.strokeStyle = col;
    AP.ECON.ctx.lineWidth = 1.4;
    AP.ECON.ctx.setLineDash(dash);
    AP.ECON.ctx.beginPath();
    AP.ECON.ctx.moveTo(fr.X(x0), fr.Y(y));
    AP.ECON.ctx.lineTo(fr.X(x1), fr.Y(y));
    AP.ECON.ctx.stroke();
    AP.ECON.ctx.setLineDash([]);
  }
  function vline2(fr, x, y0, y1, col, dash = [5, 4]) {
    AP.ECON.ctx.strokeStyle = col;
    AP.ECON.ctx.lineWidth = 1.4;
    AP.ECON.ctx.setLineDash(dash);
    AP.ECON.ctx.beginPath();
    AP.ECON.ctx.moveTo(fr.X(x), fr.Y(y0));
    AP.ECON.ctx.lineTo(fr.X(x), fr.Y(y1));
    AP.ECON.ctx.stroke();
    AP.ECON.ctx.setLineDash([]);
  }
  const DRAGS = [];
  let dragNow = null,
    dragRaf = 0;
  function addDrag(fr, kind, fn, field, scale, o = {}) {
    DRAGS.push({ fr, kind, fn, field, scale, ...o });
  }
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
    const r = AP.ECON.cv.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const niceRound = (v) => {
    if (!isFinite(v)) return 0;
    const a = Math.abs(v);
    const d = a >= 1000 ? 0 : a >= 100 ? 1 : a >= 10 ? 2 : a >= 1 ? 3 : 4;
    return +v.toFixed(d);
  };
  AP.ECON.cv.addEventListener('pointerdown', (e) => {
    const p = cvPos(e),
      d = pickDrag(p.x, p.y);
    if (!d) return;
    const I = AP.S.inp[AP.S.topic];
    const raw = I[d.field];
    const pv = (x) => {
      const t = String(x).trim();
      return t.endsWith('%') ? AP.nI(t.slice(0, -1)) / 100 : AP.nI(t);
    };
    let v0;
    try {
      v0 = raw === '' || raw == null ? (d.base ? d.base() : 0) : pv(raw);
    } catch (err) {
      v0 = d.base ? d.base() : 0;
    }
    dragNow = { d, px: p.x, py: p.y, v0 };
    AP.ECON.cv.setPointerCapture(e.pointerId);
    AP.ECON.cv.style.cursor = 'grabbing';
    e.preventDefault();
  });
  AP.ECON.cv.addEventListener('pointermove', (e) => {
    const p = cvPos(e);
    if (!dragNow) {
      AP.ECON.cv.style.cursor = pickDrag(p.x, p.y) ? 'grab' : 'default';
      return;
    }
    const { d, px, py, v0 } = dragNow,
      fr = d.fr;
    const delta =
      d.kind === 'fy' || d.kind === 'hl' ? invY(fr, p.y) - invY(fr, py) : invX(fr, p.x) - invX(fr, px);
    let v = niceRound(v0 + delta * d.scale);
    if (d.clamp) v = d.clamp(v);
    AP.S.inp[AP.S.topic][d.field] = v === 0 && !d.base ? '' : dc(String(v));
    AP.S.shock = null;
    AP.S.preset = null;
    const el = document.querySelector(`#form [data-k="${d.field}"]`);
    if (el) el.value = AP.S.inp[AP.S.topic][d.field];
    if (!dragRaf)
      dragRaf = requestAnimationFrame(() => {
        dragRaf = 0;
        AP.ECON.recompute();
      });
  });
  const endDrag = () => {
    if (dragNow) {
      dragNow = null;
      AP.ECON.cv.style.cursor = 'default';
    }
  };
  AP.ECON.cv.addEventListener('pointerup', endDrag);
  AP.ECON.cv.addEventListener('pointercancel', endDrag);
  const arrowOf = (a, b) => {
    const t = 1e-7 * Math.max(1, Math.abs(a), Math.abs(b));
    return b > a + t ? '<b class="up">↑</b>' : b < a - t ? '<b class="dn">↓</b>' : '<span class="z">—</span>';
  };
  function cleared(t) {
    const I = { ...AP.S.inp[t] };
    (AP.DELTAS[t] || []).forEach((k) => {
      I[k] = '';
    });
    return I;
  }
  function renderFactors() {
    const box = $('#fac');
    if (!box) return;
    const t = AP.S.topic,
      L = AP.T(),
      list = AP.SHOCKS[t];
    if (!list) {
      box.innerHTML = `<p class="note">${L.fac_none}</p>`;
      return;
    }
    let base;
    try {
      base = AP.COMP[t](cleared(t));
    } catch (e) {
      box.innerHTML = `<p class="note">${L.cap.err}</p>`;
      return;
    }
    const ev = AP.EFFV[t],
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
          r = AP.COMP[t]({ ...cleared(t), ...sh.set(cleared(t)) });
        } catch (e) {
          return null;
        }
        const b1 = ev(r, false);
        return { sh, b1 };
      })
      .filter(Boolean);
    box.innerHTML =
      `<p class="note" style="margin:.1rem 0 .5rem">${L.fac_note}</p><div class="tw"><table class="tab fac"><tr><th style="text-align:left">${L.fac_f}</th><th style="text-align:left">${L.fac_c}</th>${vars.map((v) => `<th>${v}</th>`).join('')}</tr>${rows.map(({ sh, b1 }) => `<tr data-shock="${sh.id}" class="${AP.S.shock === sh.id ? 'on' : ''}"><td style="text-align:left">${sh[AP.ECON.P.lang] || sh.ru}</td><td style="text-align:left">${(AP.ECON.P.lang === 'en' ? sh.cen : sh.c) || ''}</td>${vars.map((v) => `<td>${arrowOf(b0[v], b1[v])}</td>`).join('')}</tr>`).join('')}</table></div>` +
      (AP.S.shock
        ? `<div class="row"><button class="btn sm" id="facReset">${L.fac_reset}</button></div>`
        : '');
  }
  document.addEventListener('click', (e) => {
    const tr = e.target.closest('tr[data-shock]');
    if (tr) {
      const sh = AP.SHOCKS[AP.S.topic].find((s) => s.id === tr.dataset.shock);
      if (!sh) return;
      AP.S.inp[AP.S.topic] = { ...cleared(AP.S.topic), ...sh.set(cleared(AP.S.topic)) };
      AP.S.shock = sh.id;
      AP.S.preset = null;
      AP.ECON.renderForm();
      AP.ECON.recompute();
      return;
    }
    if (e.target.id === 'facReset') {
      AP.S.inp[AP.S.topic] = cleared(AP.S.topic);
      AP.S.shock = null;
      AP.ECON.renderForm();
      AP.ECON.recompute();
    }
  });
  return {
    get DRAGS() {
      return DRAGS;
    },
    get RR() {
      return RR;
    },
    get addDrag() {
      return addDrag;
    },
    get curve() {
      return curve;
    },
    get hline() {
      return hline;
    },
    get q4() {
      return q4;
    },
    get renderFactors() {
      return renderFactors;
    },
    get shockNote() {
      return shockNote;
    },
    get vline2() {
      return vline2;
    },
  };
}
