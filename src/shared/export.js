// @ts-check
import { $ } from './dom.js';

/**
 * Экспорт: снимок холста в PNG, копирование текста решения, сохранение
 * файла (в браузере — загрузка, внутри Claude — через window.claude.use('downloads')),
 * строка состояния под кнопками.
 *
 *   const ex = createExport({ name: 'macroeconomics', T, state: S, cv, renderNow, req });
 *   ex.init();   // один раз: проверка возможности сохранять, обработчики #xPng и #xCopy
 *
 * state.stamp — рисовать ли подпись на снимке (холст читает его при перерисовке),
 * state.dlTried — проверка возможности сохранять завершена.
 * @param {{ name: string, T: () => any, state: any, cv: HTMLCanvasElement, renderNow: () => void, req: () => void }} o
 */
export function createExport({ name, T, state, cv, renderNow, req }) {
  /** @type {any} */
  let DL = null;

  const LOCAL = !window.claude;

  const canSave = () => !!(DL || LOCAL);

  function updExport() {
    const L = T();
    $('#xPng').disabled = !canSave();
    $('#xNote').textContent = !canSave() && state.dlTried ? L.xNoDl : '';
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
        state.dlTried = true;
        updExport();
        return;
      }
      flash(c === 'rate_limited' ? L.xBusy : L.xFail);
    }
  }

  function exportPng() {
    if (!canSave()) return;
    state.stamp = $('#xStamp').checked;
    renderNow();
    cv.toBlob((b) => {
      state.stamp = false;
      req();
      if (b) saveFile(`${name}.png`, b);
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

  function init() {
    (async () => {
      try {
        if (window.claude && typeof window.claude.use === 'function')
          DL = await window.claude.use('downloads');
      } catch (e) {
        DL = null;
      }
      state.dlTried = true;
      updExport();
    })();
    $('#xPng').onclick = exportPng;
    $('#xCopy').onclick = copyTex;
  }

  return { canSave, updExport, flash, saveFile, exportPng, copyTex, init };
}
