// @ts-check
import { $ } from './dom.js';
import { closeDrawers, openDrawer } from './drawers.js';

/**
 * Справочник: термины по главам, поиск (на обоих языках), отметки
 * «прочитано», вкладки «интуитивно / формально», «см. также», демо.
 *
 *   const gloss = createGlossary({ prefs: () => P, save, T, content, onDemo: runDemo });
 *   gloss.init();            // один раз: обработчики поиска, кнопок, «открыть справочник»
 *   gloss.openTerm('gdp');   // открыть справочник на термине
 *
 * Хуки тренажёра: illSvg(id) — картинка к термину (по умолчанию нет),
 * mathify(html) — разметка формул во вкладке «формально» (по умолчанию как есть).
 * @param {{
 *   prefs: () => any, save: () => void, T: () => any,
 *   content: { TERMS: any[], FORMAL: Record<string, any>, ILL: Record<string, any>, CHAP: any[], REL: Record<string, string[]>, DEMOS: Record<string, any> },
 *   onDemo: (id: string) => void, illSvg?: (id: string) => string, mathify?: (html: string) => string,
 * }} o
 */
export function createGlossary({ prefs, save, T, content, onDemo, illSvg = () => '', mathify = (h) => h }) {
  const { TERMS, FORMAL, ILL, CHAP, REL, DEMOS } = content;
  const runDemo = onDemo;

  const termTitle = (id) => {
    const t = TERMS.find((x) => x.id === id);
    return t ? (t[prefs().lang] || t.ru)[0] : id;
  };

  function gTabs(id, html) {
    const f = FORMAL[id];
    if (!f) return html;
    const L = T(),
      ft = prefs().gTab === 'f';
    return `<div class="seg gtabs"><button data-tab="i" class="${ft ? '' : 'on'}">${L.tabI}</button><button data-tab="f" class="${ft ? 'on' : ''}">${L.tabF}</button></div><div class="pane" data-pane="i"${ft ? ' hidden' : ''}>${html}</div><div class="pane" data-pane="f"${ft ? '' : ' hidden'}>${f[prefs().lang] || f.ru}</div>`;
  }

  function termHtml(t, L) {
    const x = t[prefs().lang] || t.ru,
      rd = !!prefs().read[t.id];
    return `<details class="term${rd ? ' read' : ''}" id="g-${t.id}"><summary><span>${rd ? '<b class="rd">✓</b>' : ''}${x[0]}</span><small>${x[1]}</small></summary><div class="tb">${ILL[t.id] ? `<figure class="ill">${illSvg(t.id)}</figure>` : ''}${gTabs(t.id, x[2])}${DEMOS[t.id] ? `<button class="btn sm primary" data-demo="${t.id}">${L.showDemo}</button>` : ''}${REL[t.id] ? `<div class="rel">${L.seeAlso} ${REL[t.id].map((r) => `<button class="chip" data-term="${r}">${termTitle(r)}</button>`).join('')}</div>` : ''}<div class="row" style="margin-top:.8rem"><button class="btn sm readbtn${rd ? ' on' : ''}" data-read="${t.id}">${rd ? L.readDone : L.readMark}</button></div></div></details>`;
  }

  function renderGloss(q = '') {
    q = q.trim().toLowerCase();
    const L = T();
    if (!prefs().read || typeof prefs().read !== 'object') prefs().read = {};
    const total = TERMS.length,
      done = TERMS.filter((t) => prefs().read[t.id]).length;
    const match = (t) => {
      if (!q) return true;
      const x = t[prefs().lang] || t.ru,
        o = t[prefs().lang === 'ru' ? 'en' : 'ru'],
        f = FORMAL[t.id];
      return (x[0] + ' ' + x[1] + ' ' + x[2] + ' ' + o[0] + ' ' + (f ? f[prefs().lang] || f.ru : ''))
        .replace(/<[^>]+>/g, '')
        .toLowerCase()
        .includes(q);
    };
    let html = `<div class="prog"><span>${L.readOf(done, total)}</span><span class="bar"><i style="width:${Math.round((done / total) * 100)}%"></i></span>${done ? `<button class="linkbtn" id="readReset">${L.readReset}</button>` : ''}</div>`;
    let any = false,
      num = 0;
    CHAP.forEach((ch) => {
      if (!ch.extra) num++;
      const ts = ch.ids
        .map((id) => TERMS.find((t) => t.id === id))
        .filter(Boolean)
        .filter(match);
      if (!ts.length) return;
      any = true;
      const r = ch.ids.filter((id) => prefs().read[id]).length;
      html += `<section class="chap"><h3>${ch.extra ? '' : num + '. '}${ch[prefs().lang] || ch.ru}<span class="cnt">${r} / ${ch.ids.length}</span></h3>${ts.map((t) => termHtml(t, L)).join('')}</section>`;
    });
    $('#gl').innerHTML = any ? html : html + `<p class="note">${L.noFound}</p>`;
  }

  function rerenderGloss() {
    const sh = $('#dGloss .sheet'),
      st = sh.scrollTop,
      open = [...document.querySelectorAll('#gl details[open]')].map((d) => d.id);
    renderGloss($('#gq').value);
    open.forEach((id) => {
      const e = document.getElementById(id);
      if (e) e.open = true;
    });
    sh.scrollTop = st;
  }

  function openTerm(id) {
    if (!TERMS.find((t) => t.id === id)) return;
    $('#gq').value = '';
    renderGloss();
    openDrawer('dGloss');
    const el = document.getElementById('g-' + id);
    if (el) {
      el.open = true;
      setTimeout(() => el.scrollIntoView({ block: 'start' }), 30);
    }
  }

  function init() {
    $('#gq').oninput = (e) => renderGloss(e.target.value);

    $('#gl').addEventListener('click', (e) => {
      const rb = e.target.closest('[data-read]');
      if (rb) {
        prefs().read[rb.dataset.read] = !prefs().read[rb.dataset.read];
        if (!prefs().read[rb.dataset.read]) delete prefs().read[rb.dataset.read];
        save();
        rerenderGloss();
        return;
      }
      if (e.target.closest('#readReset')) {
        prefs().read = {};
        save();
        rerenderGloss();
      }
    });

    $('#gl').addEventListener('click', (e) => {
      const tb = e.target.closest('[data-tab]');
      if (!tb) return;
      const box = tb.closest('.tb');
      prefs().gTab = tb.dataset.tab;
      box
        .querySelectorAll('[data-tab]')
        .forEach((x) => x.classList.toggle('on', x.dataset.tab === prefs().gTab));
      box.querySelectorAll('.pane').forEach((p) => {
        p.hidden = p.dataset.pane !== prefs().gTab;
      });
      save();
    });

    $('#gl').addEventListener('click', (e) => {
      const b = e.target.closest('[data-demo]');
      if (!b) return;
      closeDrawers();
      runDemo(b.dataset.demo);
    });

    $('#openGloss').onclick = () => {
      $('#gq').value = '';
      renderGloss();
      openDrawer('dGloss');
    };
  }

  return { termTitle, renderGloss, rerenderGloss, openTerm, init };
}
