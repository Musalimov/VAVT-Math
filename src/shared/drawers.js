export function openDrawer(id) {
  document.getElementById(id).classList.add('open');
}
export function closeDrawers() {
  document.querySelectorAll('.drawer').forEach((d) => d.classList.remove('open'));
}
