// @ts-check
import { $, clone } from './dom.js';
import { openDrawer } from './drawers.js';
import { fmt } from './format.js';

/**
 * Шторка настроек и всё, что из неё следует: тема, док панели (справа,
 * слева, снизу, плавающая — с перетаскиванием за ручку), ширина и высота
 * панели, размер шрифта, толщина линий, палитра и свои цвета, сброс порядка
 * блоков и «Сбросить всё».
 *
 *   const settings = createSettings({ prefs: () => P, setPrefs: (np) => { P = np; }, save, T,
 *     defaults: DEF, panels: PANELS, palettes: PAL, main, side,
 *     hooks: { applyLang, applyOrder, syncToggles, renderAll, req } });
 *   settings.init();            // кнопка ⚙, ручка плавающей панели, ресайз окна
 *   settings.buildSettings();   // обработчики элементов шторки
 *   settings.applyPrefs();      // применить настройки к странице
 *
 * hooks.onReset(np) — по желанию: что тренажёр сбрасывает у себя после «Сбросить всё».
 * hooks — то, что у каждого тренажёра своё (перевод интерфейса, порядок блоков,
 * переключатели слоёв, перерисовка).
 * @param {{ prefs: () => any, setPrefs: (p: any) => void, save: () => void, T: () => any,
 *   defaults: any, panels: string[], palettes: Record<string, Record<string, string>>,
 *   main: HTMLElement, side: HTMLElement,
 *   hooks: { applyLang: () => void, applyOrder: () => void, syncToggles: () => void, renderAll: () => void, req: () => void } }} o
 */
export function createSettings({ prefs, setPrefs, save, T, defaults, panels, palettes, main, side, hooks }) {
  function buildSettings() {
    document.querySelectorAll('#langSeg button,#langSeg2 button').forEach(
      (b) =>
        (b.onclick = () => {
          prefs().lang = b.dataset.l;
          hooks.applyLang();
          save();
        })
    );
    document.querySelectorAll('#uiSeg button').forEach(
      (b) =>
        (b.onclick = () => {
          prefs().ui = b.dataset.v;
          applyPrefs();
        })
    );
    document.querySelectorAll('#dockSeg button').forEach(
      (b) =>
        (b.onclick = () => {
          prefs().dock = b.dataset.v;
          applyPrefs();
        })
    );
    $('#wR').oninput = (e) => {
      prefs().width = +e.target.value;
      applyPrefs();
    };
    $('#hR').oninput = (e) => {
      prefs().bottomH = +e.target.value;
      applyPrefs();
    };
    $('#fR').oninput = (e) => {
      prefs().font = +e.target.value;
      applyPrefs();
    };
    $('#lR').oninput = (e) => {
      prefs().lw = +e.target.value;
      applyPrefs();
    };
    $('#resetOrder').onclick = () => {
      prefs().order = panels.slice();
      prefs().collapsed = {};
      applyPrefs();
    };
    $('#resetAll').onclick = () => {
      // «Сбросить всё» сохраняет язык, отметки «прочитано» и последнюю задачу
      const old = prefs(),
        np = clone(defaults);
      np.lang = old.lang;
      np.read = old.read || {};
      np.last = old.last;
      setPrefs(np);
      if (hooks.onReset) hooks.onReset(np);
      hooks.syncToggles();
      applyPrefs();
      hooks.renderAll();
    };
  }

  function buildPal() {
    const L = T();
    const pc = $('#palChips');
    pc.innerHTML = '';
    Object.entries(palettes).forEach(([k, p]) => {
      const b = document.createElement('button');
      b.className = 'chip';
      b.dataset.p = k;
      b.innerHTML = `<span class="sw" style="background:${p.bg};box-shadow:inset 0 0 0 3px ${p.f || Object.values(p)[3]}"></span>${L.pal[k]}`;
      b.onclick = () => {
        prefs().palette = k;
        prefs().colors = { ...palettes[k] };
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
        prefs().colors[k] = e.target.value;
        prefs().palette = 'custom';
        applyPrefs();
      };
      cs.appendChild(l);
    });
  }

  function syncSettings() {
    document
      .querySelectorAll('#uiSeg button')
      .forEach((b) => b.classList.toggle('on', b.dataset.v === prefs().ui));
    document
      .querySelectorAll('#dockSeg button')
      .forEach((b) => b.classList.toggle('on', b.dataset.v === prefs().dock));
    document
      .querySelectorAll('#palChips .chip')
      .forEach((b) => b.classList.toggle('on', b.dataset.p === prefs().palette));
    document.querySelectorAll('#colors input').forEach((i) => {
      i.value = prefs().colors[i.dataset.k];
    });
    $('#wR').value = prefs().width;
    $('#wOut').textContent = prefs().width + ' px';
    $('#hR').value = prefs().bottomH;
    $('#hOut').textContent = prefs().bottomH + ' %';
    $('#fR').value = prefs().font;
    $('#fOut').textContent = prefs().font + ' %';
    $('#lR').value = prefs().lw;
    $('#lOut').textContent = '×' + fmt(prefs().lw, 1);
  }

  function effDock() {
    return prefs().dock === 'auto' ? (innerWidth < 760 ? 'bottom' : 'right') : prefs().dock;
  }

  function applyDock() {
    const d = effDock();
    main.dataset.dock = d;
    if (d === 'float') {
      const mr = main.getBoundingClientRect(),
        sw = side.offsetWidth || prefs().width;
      prefs().float.x = Math.max(8, Math.min(prefs().float.x, mr.width - Math.min(sw, mr.width) - 8));
      prefs().float.y = Math.max(8, Math.min(prefs().float.y, mr.height - 80));
      side.style.left = prefs().float.x + 'px';
      side.style.top = prefs().float.y + 'px';
    } else {
      side.style.left = '';
      side.style.top = '';
    }
  }

  function applyPrefs() {
    const r = document.documentElement;
    if (prefs().ui === 'auto') r.removeAttribute('data-theme');
    else r.setAttribute('data-theme', prefs().ui);
    r.style.fontSize = (16 * prefs().font) / 100 + 'px';
    r.style.setProperty('--side-w', prefs().width + 'px');
    r.style.setProperty('--side-h', prefs().bottomH + '%');
    Object.entries(prefs().colors).forEach(([k, v]) => r.style.setProperty('--s-' + k, v));
    applyDock();
    hooks.applyOrder();
    syncSettings();
    save();
    hooks.req();
  }

  function init() {
    $('#openSet').onclick = () => {
      syncSettings();
      openDrawer('dSet');
    };
    (() => {
      const g = $('#grip');
      let st = null;
      g.addEventListener('pointerdown', (e) => {
        g.setPointerCapture(e.pointerId);
        st = { x: e.clientX, y: e.clientY, fx: prefs().float.x, fy: prefs().float.y };
      });
      g.addEventListener('pointermove', (e) => {
        if (!st) return;
        prefs().float.x = st.fx + e.clientX - st.x;
        prefs().float.y = st.fy + e.clientY - st.y;
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
  }

  return { buildSettings, buildPal, syncSettings, effDock, applyDock, applyPrefs, init };
}

/**
 * Тексты интерфейса из словаря L: [data-i] — текст, [data-ih] — HTML,
 * [data-it] — подсказка и aria-label, [data-ia] — только aria-label.
 * @param {Record<string, any>} L
 */
export function applyTexts(L) {
  document.querySelectorAll('[data-i]').forEach((e) => {
    e.textContent = L[/** @type {HTMLElement} */ (e).dataset.i];
  });
  document.querySelectorAll('[data-ih]').forEach((e) => {
    e.innerHTML = L[/** @type {HTMLElement} */ (e).dataset.ih];
  });
  document.querySelectorAll('[data-it]').forEach((e) => {
    const t = L[/** @type {HTMLElement} */ (e).dataset.it];
    /** @type {HTMLElement} */ (e).title = t;
    e.setAttribute('aria-label', t);
  });
  document.querySelectorAll('[data-ia]').forEach((e) => {
    e.setAttribute('aria-label', L[/** @type {HTMLElement} */ (e).dataset.ia]);
  });
}
