// @ts-check
import { $ } from './dom.js';
import { pub } from './state.js';

/**
 * Экспорт: снимок холста в PNG, копирование текста решения, сохранение
 * файла загрузкой браузера, строка состояния под кнопками.
 *
 *   const ex = createExport({ name: 'macroeconomics', T, state: S, cv, renderNow, req });
 *   ex.init();   // один раз: обработчики #xPng, #xCopy (и #xVid, если есть видео)
 *
 * state.stamp — рисовать ли подпись на снимке (холст читает его при перерисовке).
 * Видео (по желанию): video = { ready?, play, reset?, frame? } — запись холста;
 * reset — вернуть анимацию в начало (по умолчанию state.t = 0, state.anim = null),
 * frame — дорисовка каждого кадра (в ЛА — подписи поверх холста);
 * с анимацией тренажёра (state.anim, state.t), кнопка #xVid. Без video кнопки видео нет.
 * @param {{ name: string, T: () => any, state: any, cv: HTMLCanvasElement, renderNow: () => void, req: () => void,
 *   video?: { ready?: () => boolean, play: () => void, reset?: () => void, frame?: () => void } | null,
 *   name: string | (() => string) }} o
 */
export function createExport({ name, T, state, cv, renderNow, req, video = null }) {
  /** имя файла без расширения: строка или функция (в ЛА зависит от режима 2D/3D) */
  const base = () => (typeof name === 'function' ? name() : name);
  /** Сохранение файла — загрузкой браузера; доступно всегда. */
  const canSave = () => true;

  function updExport() {
    const L = T();
    if (!video) {
      $('#xPng').disabled = !canSave();
      $('#xNote').textContent = !canSave() && state.dlTried ? L.xNoDl : '';
      return;
    }
    $('#xPng').disabled = !canSave() || state.rec;
    $('#xVid').disabled = !canSave() || !vidMime() || state.rec;
    $('#xNote').textContent = state.rec
      ? L.xRec
      : !canSave()
        ? state.dlTried
          ? L.xNoDl
          : ''
        : !vidMime()
          ? L.xNoVid
          : '';
  }

  function vidMime() {
    if (!window.MediaRecorder || !cv.captureStream) return null;
    for (const m of ['video/webm; codecs=vp9', 'video/webm; codecs=vp8', 'video/webm', 'video/mp4'])
      if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) return m;
    return null;
  }

  async function exportVideo() {
    const m = vidMime();
    if (!video || !canSave() || !m || state.rec || state.err || (video.ready && !video.ready())) return;
    state.rec = true;
    pub('rec', 'recording');
    state.stamp = /** @type {HTMLInputElement} */ ($('#xStamp')).checked;
    updExport();
    const keep = (/** @type {number} */ ms) =>
      new Promise((r) => {
        const t0 = performance.now();
        const f = () => {
          renderNow();
          if (video.frame) video.frame();
          if (performance.now() - t0 < ms) requestAnimationFrame(f);
          else r(undefined);
        };
        f();
      });
    /** @type {Blob[]} */
    const chunks = [];
    let rec;
    try {
      const stream = /** @type {any} */ (cv).captureStream(60);
      rec = new MediaRecorder(stream, { mimeType: m, videoBitsPerSecond: 8e6 });
      rec.ondataavailable = (e) => {
        if (e.data && e.data.size) chunks.push(e.data);
      };
      const stopped = new Promise((r) => {
        rec.onstop = r;
      });
      if (video.reset) video.reset();
      else {
        state.t = 0;
        state.anim = null;
      }
      rec.start(100);
      await keep(500);
      video.play();
      await new Promise((r) => {
        const f = () => (state.anim ? requestAnimationFrame(f) : r(undefined));
        f();
      });
      await keep(900);
      rec.stop();
      await stopped;
    } catch (err) {
      state.rec = false;
      pub('rec', 'idle');
      state.stamp = false;
      req();
      flash(T().xFail);
      return;
    }
    state.rec = false;
    pub('rec', 'idle');
    state.stamp = false;
    req();
    updExport();
    const blob = new Blob(chunks, { type: m });
    if (blob.size) saveFile(`${base()}.${m.startsWith('video/mp4') ? 'mp4' : 'webm'}`, blob);
    else flash(T().xFail);
  }

  function flash(msg, ms = 3500) {
    $('#xNote').textContent = msg;
    clearTimeout(flash.t);
    if (ms) flash.t = setTimeout(updExport, ms);
  }

  function saveFile(/** @type {string} */ name, /** @type {Blob} */ data) {
    const L = T();
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

  function exportPng() {
    if (!canSave() || (video && state.rec)) return;
    state.stamp = $('#xStamp').checked;
    renderNow();
    cv.toBlob((b) => {
      state.stamp = false;
      req();
      if (b) saveFile(`${base()}.png`, b);
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
    if (video) $('#xVid').onclick = () => exportVideo();
    updExport();
    $('#xPng').onclick = exportPng;
    $('#xCopy').onclick = copyTex;
  }

  return { canSave, updExport, flash, saveFile, exportPng, exportVideo, vidMime, copyTex, init };
}
