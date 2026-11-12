(() => {
  const APPS = [
    {
      f: 'linear-algebra.html',
      g: 'math',
      img: 'screenshots/linear-algebra.png',
      ru: [
        'Линейная алгебра',
        'Матрицы как преобразования плоскости и пространства: базисные векторы, определитель, собственные векторы, ранг.',
        ['Матрицы 2×2 и 3×3', 'det', 'Собственные векторы', '2D и 3D'],
      ],
      en: [
        'Linear algebra',
        'Matrices as transformations of the plane and space: basis vectors, determinant, eigenvectors, rank.',
        ['2×2 and 3×3 matrices', 'det', 'Eigenvectors', '2D and 3D'],
      ],
    },
    {
      f: 'integrals.html',
      g: 'math',
      img: 'screenshots/integrals.png',
      ru: [
        'Интегралы',
        'Любой интеграл с решением по шагам: замена, по частям, дроби, тригонометрия. Площадь, первообразная, суммы Римана.',
        ['Решение по шагам', 'Определённый', 'Неопределённый', 'Несобственный', 'Суммы Римана'],
      ],
      en: [
        'Integrals',
        'Step-by-step solutions: substitution, by parts, partial fractions, trigonometry. Area, antiderivative, Riemann sums.',
        ['Step by step', 'Definite', 'Indefinite', 'Improper', 'Riemann sums'],
      ],
    },
    {
      f: 'optimization.html',
      g: 'math',
      img: 'screenshots/optimization.png',
      ru: [
        'Методы оптимальных решений',
        'Задачи ЛП: графический метод, двойственная задача, дополняющая нежёсткость, симплекс-таблицы, теневые цены.',
        ['Графический метод', 'Двойственная', 'Симплекс-метод', 'Как на семинаре'],
      ],
      en: [
        'Optimization methods',
        'Linear programming: graphical method, the dual, complementary slackness, simplex tableaux, shadow prices.',
        ['Graphical method', 'Duality', 'Simplex', 'Seminar style'],
      ],
    },
    {
      f: 'probability.html',
      g: 'math',
      img: 'screenshots/probability.png',
      ru: [
        'Теория вероятностей',
        'Все 9 разделов задачника ВАВТ: от комбинаторики и Байеса до нормального распределения. Задачи из сборника с ответами.',
        ['Комбинаторика', 'Бернулли и Лаплас', 'Случайные величины', 'Φ(x) как в ВАВТ'],
      ],
      en: [
        'Probability theory',
        'All 9 sections of the VAVT problem book, from combinatorics and Bayes to the normal distribution, with problems from the book.',
        ['Combinatorics', 'Bernoulli and Laplace', 'Random variables', 'Φ(x) as at VAVT'],
      ],
    },
    {
      f: 'microeconomics.html',
      g: 'econ',
      img: 'screenshots/microeconomics.png',
      ru: [
        'Микроэкономика',
        '16 разделов по учебнику Серякова: спрос и предложение, эластичность, потребитель, издержки, рыночные структуры, ресурсы, внешние эффекты.',
        ['Налоги и излишки', 'Эластичность', 'MR = MC', 'Налог Пигу'],
      ],
      en: [
        'Microeconomics',
        '16 sections after Seryakov’s textbook: supply and demand, elasticity, consumer, costs, market structures, factor markets, externalities.',
        ['Taxes and surplus', 'Elasticity', 'MR = MC', 'Pigouvian tax'],
      ],
    },
    {
      f: 'macroeconomics.html',
      g: 'econ',
      img: 'screenshots/macroeconomics.png',
      ru: [
        'Макроэкономика',
        'По Мэнкью: ВВП и цены, безработица, рынок заёмных средств, деньги, открытая экономика, модель Солоу, кейнсианский крест, IS–LM, Манделл–Флеминг, AD–AS, кривая Филлипса.',
        ['IS–LM', 'Модель Солоу', 'AD–AS', 'Мультипликаторы'],
      ],
      en: [
        'Macroeconomics',
        'After Mankiw: GDP and prices, unemployment, loanable funds, money, open economy, Solow model, Keynesian cross, IS–LM, Mundell–Fleming, AD–AS, Phillips curve.',
        ['IS–LM', 'Solow model', 'AD–AS', 'Multipliers'],
      ],
    },
    {
      f: 'game-theory.html',
      g: 'econ',
      img: 'screenshots/game-theory.png',
      ru: [
        'Теория игр',
        '14 типов игр в пяти разделах: равновесие Нэша, Курно и Штакельберг, деревья и обратная индукция, торг, ядро и Шепли, голосование, аукционы.',
        ['Равновесие Нэша', 'Обратная индукция', 'Вектор Шепли', 'Гейл–Шепли'],
      ],
      en: [
        'Game theory',
        '14 game types in five sections: Nash equilibrium, Cournot and Stackelberg, trees and backward induction, bargaining, core and Shapley, voting, auctions.',
        ['Nash equilibrium', 'Backward induction', 'Shapley value', 'Gale–Shapley'],
      ],
    },
  ];
  const TX = {
    ru: {
      lt: 'Светлая тема',
      dk: 'Тёмная тема',
      brand: 'Математика <i>наглядно</i>',
      h1: 'Интерактивные тренажёры для студентов ВАВТ',
      lead: 'Графики можно тянуть руками, каждая задача решается по шагам, а справочник объясняет понятия интуитивно и строго. Работает в браузере, без регистрации.',
      gMath: 'Математика',
      gEcon: 'Экономика',
      open: 'Открыть',
      dl: 'Скачать',
      dlT: 'Скачать файл, чтобы пользоваться без интернета',
      i1h: 'Работает офлайн',
      i1: 'Каждое приложение — один HTML-файл. Скачайте его и откройте двойным щелчком: интернет не нужен.',
      i2h: 'По материалам курса',
      i2: 'Задачи, обозначения и алгоритмы взяты из учебников и задачников ВАВТ, ответы сверены со сборниками.',
      i3h: 'Ничего не собирается',
      i3: 'Настройки и отметки «прочитано» хранятся только в вашем браузере. Никаких аккаунтов и аналитики.',
      foot: 'Нашли ошибку или есть идея? Напишите в <a href="https://github.com/Musalimov/VAVT-Math/issues">Issues на GitHub</a>. Исходники: <a href="https://github.com/Musalimov/VAVT-Math">github.com/Musalimov/VAVT-Math</a>.',
    },
    en: {
      lt: 'Light theme',
      dk: 'Dark theme',
      brand: 'Math <i>visually</i>',
      h1: 'Interactive trainers for VAVT students',
      lead: 'Drag the graphs by hand, see every problem solved step by step, and read a glossary that explains concepts both intuitively and formally. Runs in the browser, no sign-up.',
      gMath: 'Mathematics',
      gEcon: 'Economics',
      open: 'Open',
      dl: 'Download',
      dlT: 'Download the file to use it offline',
      i1h: 'Works offline',
      i1: 'Each app is a single HTML file. Download it and double-click: no internet needed.',
      i2h: 'Based on the course',
      i2: 'Problems, notation and algorithms follow VAVT textbooks and problem books; answers are checked against them.',
      i3h: 'Nothing is collected',
      i3: 'Settings and “read” marks stay in your browser only. No accounts, no analytics.',
      foot: 'Found a mistake or have an idea? Open an <a href="https://github.com/Musalimov/VAVT-Math/issues">issue on GitHub</a>. Source: <a href="https://github.com/Musalimov/VAVT-Math">github.com/Musalimov/VAVT-Math</a>.',
    },
  };
  let theme = 'dark';
  try {
    theme = localStorage.getItem('vavt-home-theme') || 'dark';
  } catch (e) {}
  const applyTheme = () => {
    document.documentElement.dataset.theme = theme;
    document.querySelectorAll('#theme button').forEach((b) => {
      b.classList.toggle('on', b.dataset.t === theme);
      b.title = TX[lang][b.dataset.t === 'dark' ? 'dk' : 'lt'];
    });
  };
  document.querySelectorAll('#theme button').forEach(
    (b) =>
      (b.onclick = () => {
        theme = b.dataset.t;
        try {
          localStorage.setItem('vavt-home-theme', theme);
        } catch (e) {}
        applyTheme();
      })
  );
  let lang = 'ru';
  try {
    lang =
      localStorage.getItem('vavt-home-lang') ||
      ((navigator.language || '').toLowerCase().startsWith('ru') ? 'ru' : 'en');
  } catch (e) {}
  function render() {
    const L = TX[lang];
    document.documentElement.lang = lang;
    document.title =
      lang === 'ru'
        ? 'Математика наглядно — тренажёры для студентов ВАВТ'
        : 'Math visually — trainers for VAVT students';
    document.querySelectorAll('[data-i]').forEach((e) => {
      if (L[e.dataset.i] !== undefined) e.innerHTML = L[e.dataset.i];
    });
    applyTheme();
    document.querySelectorAll('#lang button').forEach((b) => b.classList.toggle('on', b.dataset.l === lang));
    const card = (a) => {
      const [t, d, tags] = a[lang];
      return `<article class="card"><a href="${a.f}" tabindex="-1" aria-hidden="true"><img src="${a.img}" alt="" loading="lazy"></a><div class="cb"><h3>${t}</h3><p>${d}</p><div class="tags">${tags.map((x) => `<span>${x}</span>`).join('')}</div><div class="acts"><a class="btn primary" href="${a.f}">${L.open}</a><a class="btn" href="${a.f}" download title="${L.dlT}">⤓ ${L.dl}</a></div></div></article>`;
    };
    document.getElementById('grid').innerHTML = [
      ['math', L.gMath],
      ['econ', L.gEcon],
    ]
      .map(([g, title]) => {
        const items = APPS.filter((a) => a.g === g);
        return `<div class="group" data-g="${g}"><h2>${title}</h2><div class="cards">${items.map(card).join('')}</div></div>`;
      })
      .join('');
  }
  document.querySelectorAll('#lang button').forEach(
    (b) =>
      (b.onclick = () => {
        lang = b.dataset.l;
        try {
          localStorage.setItem('vavt-home-lang', lang);
        } catch (e) {}
        render();
      })
  );
  render();
})();
