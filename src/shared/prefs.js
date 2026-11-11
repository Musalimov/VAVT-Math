// @ts-check
/**
 * Настройки тренажёра в localStorage: версия схемы, миграция, защита от
 * повреждённых данных и переполнения хранилища.
 *
 * Схема 1 — всё, что сохраняли тренажёры до фазы 2 (поля v нет).
 * Схема 2 — те же поля плюс v: 2; при переходе значения проверяются
 * (числа — в пределах ползунков, объекты — объекты, порядок блоков — только
 * известные блоки). Ключи хранилища прежние, поэтому порядок блоков,
 * «прочитано», язык и тема переносятся без потерь.
 *
 * Перед первой записью в новой схеме исходная строка копируется в
 * `<ключ>-bak` (один раз). Повреждённый JSON тоже копируется туда, а
 * тренажёр стартует с настройками по умолчанию и сообщает об этом.
 */

export const SCHEMA = 2;

/** Пределы ползунков настроек: [мин, макс]. */
export const RANGES = /** @type {const} */ ({
  width: [240, 560],
  bottomH: [25, 75],
  font: [80, 130],
  speed: [0.25, 3],
  lw: [0.5, 2.5],
});

/** @param {any} o */
const isObj = (o) => !!o && typeof o === 'object' && !Array.isArray(o);
/** @template T @param {T} o @returns {T} */
const clone = (o) => JSON.parse(JSON.stringify(o));

/**
 * Приводит сохранённые данные (любой версии) к схеме 2. Чистая функция.
 * @param {any} r сохранённый объект (уже из JSON)
 * @param {Record<string, any>} defaults настройки по умолчанию
 * @param {string[]} panels известные блоки боковой панели
 * @returns {Record<string, any>}
 */
export function migrate(r, defaults, panels) {
  const p = clone(defaults);
  if (!isObj(r)) return { ...p, v: SCHEMA };
  Object.assign(p, r);
  p.colors = { ...defaults.colors, ...(isObj(r.colors) ? r.colors : {}) };
  p.show = { ...defaults.show, ...(isObj(r.show) ? r.show : {}) };
  const ord = Array.isArray(r.order)
    ? r.order.filter(
        (/** @type {string} */ x, /** @type {number} */ i, /** @type {string[]} */ a) =>
          panels.includes(x) && a.indexOf(x) === i
      )
    : [];
  for (const x of panels) if (!ord.includes(x)) ord.push(x);
  p.order = ord;
  // collapsed заменяет значение по умолчанию целиком — так было и в схеме 1
  p.collapsed = isObj(r.collapsed) ? r.collapsed : {};
  p.read = isObj(r.read) ? r.read : {};
  p.float = isObj(r.float) && isFinite(r.float.x) && isFinite(r.float.y) ? r.float : { x: 12, y: 12 };
  for (const [k, [a, b]] of Object.entries(RANGES)) {
    const v = p[k];
    p[k] = typeof v === 'number' && isFinite(v) ? Math.min(b, Math.max(a, v)) : defaults[k];
  }
  p.v = SCHEMA;
  return p;
}

/**
 * @typedef {{ getItem(k: string): string | null, setItem(k: string, v: string): void }} Storage
 * @typedef {'new' | 'ok' | 'migrated' | 'corrupt'} LoadStatus
 */

/**
 * Читает настройки.
 * @param {{ key: string, defaults: Record<string, any>, panels: string[], storage?: Storage }} o
 * @returns {{ prefs: Record<string, any>, status: LoadStatus }}
 */
export function loadPrefs({ key, defaults, panels, storage = globalThis.localStorage }) {
  /** @type {string | null} */
  let raw = null;
  try {
    raw = storage.getItem(key);
  } catch {}
  if (raw == null) return { prefs: migrate(null, defaults, panels), status: 'new' };
  let r;
  try {
    r = JSON.parse(raw);
  } catch {
    backup(storage, key, raw);
    return { prefs: migrate(null, defaults, panels), status: 'corrupt' };
  }
  const old = !isObj(r) || r.v !== SCHEMA;
  if (old) backup(storage, key, raw);
  return { prefs: migrate(r, defaults, panels), status: old ? 'migrated' : 'ok' };
}

/** Копия исходной строки — только если копии ещё нет. @param {Storage} storage @param {string} key @param {string} raw */
function backup(storage, key, raw) {
  try {
    if (storage.getItem(key + '-bak') == null) storage.setItem(key + '-bak', raw);
  } catch {}
}

/**
 * Отложенная запись (несколько изменений подряд — одна запись).
 * onFail вызывается один раз за сеанс, если записать не удалось (квота,
 * приватный режим) — чтобы тренажёр мог сказать, что настройки не сохранятся.
 * @param {{ key: string, get: () => any, storage?: Storage, onFail?: () => void, delay?: number }} o
 */
export function makeSaver({ key, get, storage = globalThis.localStorage, onFail = () => {}, delay = 250 }) {
  /** @type {ReturnType<typeof setTimeout> | undefined} */
  let t;
  let warned = false;
  const write = () => {
    try {
      storage.setItem(key, JSON.stringify({ ...get(), v: SCHEMA }));
    } catch {
      if (!warned) {
        warned = true;
        onFail();
      }
    }
  };
  const save = () => {
    clearTimeout(t);
    t = setTimeout(write, delay);
  };
  /** немедленная запись (для тестов и закрытия страницы) */
  save.now = () => {
    clearTimeout(t);
    write();
  };
  return save;
}
