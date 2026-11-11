// @ts-check
/**
 * Блоки боковой панели: заголовок с ⠿ ↑ ↓ ▾, сворачивание, порядок
 * (кнопками и перетаскиванием), сохранение в настройках.
 *
 *   const { buildPanels, applyOrder, showPanel } = createPanels({ side, prefs: () => P, save });
 *
 * prefs — функция, а не объект: настройки могут быть заменены целиком
 * («Сбросить всё»), и обработчики должны видеть текущие.
 * @param {{ side: HTMLElement, prefs: () => { order: string[], collapsed: Record<string, boolean> }, save: () => void, openDetails?: boolean }} o
 */
export function createPanels({ side, prefs, save, openDetails = false }) {
  function buildPanels() {
    document.querySelectorAll('.panel').forEach((p) => {
      const h = document.createElement('div');
      h.className = 'ph';
      h.innerHTML = `<span class="handle" data-it="drag">⠿</span><h3 data-i="p_${p.dataset.id}"></h3><button class="icon" data-mv="-1" data-it="up">↑</button><button class="icon" data-mv="1" data-it="down">↓</button><button class="icon chev" data-col data-it="collapse">▾</button>`;
      p.prepend(h);
      const id = p.dataset.id,
        toggle = () => {
          prefs().collapsed[id] = !prefs().collapsed[id];
          p.classList.toggle('collapsed', !!prefs().collapsed[id]);
          save();
        };
      h.querySelector('h3').onclick = toggle;
      h.querySelector('[data-col]').onclick = toggle;
      h.querySelectorAll('[data-mv]').forEach(
        (b) =>
          (b.onclick = () => {
            const i = prefs().order.indexOf(id),
              j = i + +b.dataset.mv;
            if (j < 0 || j >= prefs().order.length) return;
            [prefs().order[i], prefs().order[j]] = [prefs().order[j], prefs().order[i]];
            applyOrder();
            save();
          })
      );
      const hd = h.querySelector('.handle');
      hd.addEventListener('pointerdown', () => {
        p.draggable = true;
        window.addEventListener(
          'pointerup',
          () => {
            if (!p.classList.contains('dragging')) p.draggable = false;
          },
          { once: true }
        );
      });
      p.addEventListener('dragstart', (e) => {
        p.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        try {
          e.dataTransfer.setData('text/plain', id);
        } catch (_) {}
      });
      p.addEventListener('dragend', () => {
        p.classList.remove('dragging');
        p.draggable = false;
        prefs().order = [...side.querySelectorAll('.panel')].map((x) => x.dataset.id);
        save();
      });
    });
    side.addEventListener('dragover', (e) => {
      const dr = side.querySelector('.panel.dragging');
      if (!dr) return;
      e.preventDefault();
      const after = [...side.querySelectorAll('.panel:not(.dragging)')].find((el) => {
        const r = el.getBoundingClientRect();
        return e.clientY < r.top + r.height / 2;
      });
      if (after) side.insertBefore(dr, after);
      else side.appendChild(dr);
    });
  }

  function applyOrder() {
    prefs().order.forEach((id) => {
      const el = side.querySelector(`.panel[data-id="${id}"]`);
      if (el) side.appendChild(el);
    });
    side
      .querySelectorAll('.panel')
      .forEach((p) => p.classList.toggle('collapsed', !!prefs().collapsed[p.dataset.id]));
  }

  function showPanel(id) {
    prefs().collapsed[id] = false;
    applyOrder();
    save();
    const el = side.querySelector(`.panel[data-id="${id}"]`);
    // openDetails: раскрыть внутри блока «подробнее» и шаги (в ЛА — для демо справочника)
    if (el && openDetails)
      el.querySelectorAll('details.more,details.steps').forEach((d) => {
        /** @type {HTMLDetailsElement} */ (d).open = true;
      });
    if (el) setTimeout(() => el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 50);
  }

  return { buildPanels, applyOrder, showPanel };
}
