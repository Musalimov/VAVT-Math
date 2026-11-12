// @ts-check
/**
 * Стрелка «← на главную» в шапке тренажёра.
 *
 *   <a class="btn ghost home" id="homeLink" href="./" data-it="home">…</a>   // index.html, первой в <header>
 *   initHome();                                                            // один раз при запуске
 *
 * На сайте ссылка ./ ведёт на лендинг. Скачанный файл открыт с диска
 * (file://), лендинга рядом нет — тогда стрелка ведёт на сайт.
 * Подсказка — ключ home в словаре тренажёра (applyTexts, [data-it]).
 */

/** Адрес лендинга на GitHub Pages. */
export const HOME_URL = 'https://musalimov.github.io/VAVT-Math/';

/** Куда ведёт стрелка при данном протоколе страницы. Чистая функция. @param {string} protocol */
export const homeHref = (protocol) => (protocol === 'file:' ? HOME_URL : './');

/** Ставит адрес стрелки. Вызывается один раз. */
export function initHome() {
  const a = document.getElementById('homeLink');
  if (a) a.setAttribute('href', homeHref(location.protocol));
}
