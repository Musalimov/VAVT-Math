export function openDrawer(id) {
  document.getElementById(id).classList.add('open');
}
export function closeDrawers() {
  document.querySelectorAll('.drawer').forEach((d) => d.classList.remove('open'));
}

/** Закрытие шторок: кнопки [data-close] и Esc. Вызывается один раз. */
export function initDrawers() {
  document.querySelectorAll('[data-close]').forEach((el) => (el.onclick = closeDrawers));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawers();
  });
}
