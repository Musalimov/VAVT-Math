export const PRE = {
  mat: [
    [
      'pd',
      { kind: 'bi', A: '-1 -10\n0 -5', B: '-1 0\n-10 -5' },
      'Дилемма заключённого',
      'Prisoner’s dilemma',
    ],
    ['bos', { kind: 'bi', A: '2 0\n0 1', B: '1 0\n0 2' }, 'Семейный спор', 'Battle of the sexes'],
    ['hawk', { kind: 'bi', A: '-2 4\n0 2', B: '-2 0\n4 2' }, 'Ястреб и голубь', 'Hawk–dove'],
    [
      'dom3',
      { kind: 'bi', A: '3 1 0\n2 4 1\n1 2 5', B: '2 1 0\n3 1 2\n0 4 1' },
      'Доминирование 3×3',
      'Dominance 3×3',
    ],
    ['pen', { kind: 'zs', A: '1 -1\n-1 1', B: '' }, 'Орлянка (нет седла)', 'Matching pennies'],
    ['zs23', { kind: 'zs', A: '3 1 4\n2 5 1', B: '' }, '2×3: графический метод', '2×3: graphical method'],
    ['sad', { kind: 'zs', A: '4 2 3\n5 3 4\n1 0 2', B: '' }, 'Седловая точка', 'Saddle point'],
  ],
  cour: [
    ['c13', { M: '10', cs: '1 1' }, 'Пример 13: две фирмы, c = 1', 'Example 13: two firms, c = 1'],
    ['c5', { M: '10', cs: '1 1 1 1 1' }, 'Пять фирм', 'Five firms'],
    ['casym', { M: '10', cs: '1 4' }, 'Разные издержки', 'Different costs'],
    ['cout', { M: '10', cs: '1 4 9' }, 'Фирма уходит с рынка', 'A firm exits'],
  ],
  barg: [
    [
      'b14',
      { pts: '0 0\n1 0\n0 1', d1: '0', d2: '0' },
      'Пример 14: дележ единицы',
      'Example 14: splitting a unit',
    ],
    ['b15', { pts: '0 0\n240 0\n0 240', d1: '60', d2: '120' }, 'Пример 15: носки', 'Example 15: socks'],
    [
      'basym',
      { pts: '0 0\n4 0\n3 2\n0 3', d1: '0', d2: '0' },
      'Нэш ≠ Калаи–Смородинский',
      'Nash ≠ Kalai–Smorodinsky',
    ],
  ],
  coop: [
    [
      'orch',
      { coal: '1 6\n2 18\n3 30\n12 36\n13 48\n23 54\n123 72' },
      'Оркестр (примеры 16, 17)',
      'Orchestra (examples 16, 17)',
    ],
    ['e23', { coal: '1 1\n2 1\n3 3\n12 1\n13 4\n23 5\n123 8' }, 'Пример 23', 'Example 23'],
    ['e24', { coal: '12 3\n23 1\n123 4' }, 'Пример 24', 'Example 24'],
    [
      'boots',
      { coal: '13 600\n23 600\n14 0\n123 600\n134 600\n234 600\n124 0\n1234 600' },
      'Ботинки (n = 4)',
      'Shoes (n = 4)',
    ],
    ['convex', { coal: '12 2\n13 2\n23 2\n123 6' }, 'Выпуклая игра', 'Convex game'],
    ['empty', { coal: '12 1\n13 1\n23 1\n123 1' }, 'Пустое ядро', 'Empty core'],
  ],
  auct: [
    ['a27', { n: '10', w: '1', v: '0,8' }, 'Пример 27: 10 участников', 'Example 27: 10 bidders'],
    ['a2', { n: '2', w: '100', v: '60' }, 'Два участника, ω = 100', 'Two bidders, ω = 100'],
    ['a5', { n: '5', w: '1', v: '0,5' }, 'Пять участников', 'Five bidders'],
  ],
};
export const GROUPS = [
  ['stat', ['mat', 'cont', 'bayes']],
  ['mkt', ['cour', 'hotel']],
  ['dyn', ['tree', 'rep', 'evo']],
  ['coopg', ['barg', 'coop', 'vote', 'match']],
  ['mech', ['auct', 'braess']],
];
export const TOPICS = GROUPS.flatMap((g) => g[1]);
export const FORMS = {
  mat: [
    ['kind', 'sel', ['bi', 'zs']],
    ['A', 'txt'],
    ['B', 'txt', (i) => i.kind === 'bi'],
  ],
  cour: [
    ['om', 'sel', ['cour', 'stack', 'bert', 'cmp']],
    ['M', 'num'],
    ['cs', 'str'],
  ],
  cont: [
    ['H1', 'str'],
    ['H2', 'str'],
    ['a1', 'num'],
    ['b1', 'num'],
    ['a2', 'num'],
    ['b2', 'num'],
  ],
  bayes: [
    ['mu', 'num'],
    ['A1', 'txt'],
    ['B1', 'txt'],
    ['A2', 'txt'],
    ['B2', 'txt'],
  ],
  hotel: [
    ['hm', 'sel', ['loc', 'price']],
    ['ha', 'num', (i) => i.hm === 'price'],
    ['hb', 'num', (i) => i.hm === 'price'],
    ['ht', 'num', (i) => i.hm === 'price'],
    ['hc', 'num', (i) => i.hm === 'price'],
  ],
  tree: [['tr', 'txt']],
  rep: [
    ['R', 'num'],
    ['Tt', 'num'],
    ['Ss', 'num'],
    ['Pp', 'num'],
    ['rn', 'num'],
    ['dl', 'num'],
  ],
  evo: [
    ['em', 'sel', ['hd', 'mat']],
    ['V', 'num', (i) => i.em === 'hd'],
    ['C', 'num', (i) => i.em === 'hd'],
    ['EA', 'txt', (i) => i.em === 'mat'],
    ['x0', 'str'],
  ],
  vote: [
    ['q', 'num'],
    ['wts', 'str'],
  ],
  match: [
    ['side', 'sel', ['p', 'r']],
    ['mp', 'txt'],
    ['mr', 'txt'],
  ],
  braess: [
    ['brg', 'sel', ['no', 'yes']],
    ['bN', 'num'],
    ['ba', 'num'],
    ['bb', 'num'],
    ['be', 'num', (i) => i.brg === 'yes'],
  ],
  barg: [
    ['pts', 'txt'],
    ['d1', 'num'],
    ['d2', 'num'],
  ],
  coop: [['coal', 'txt']],
  auct: [
    ['n', 'num'],
    ['w', 'num'],
    ['v', 'num'],
  ],
};
// дополнения второй части тренажёра
Object.assign(PRE, {
  cont: [
    [
      'ccour',
      { H1: 'x(10-x-y)-x', H2: 'y(10-x-y)-y', a1: '0', b1: '10', a2: '0', b2: '10' },
      'Курно в непрерывной форме',
      'Cournot, continuous form',
    ],
    [
      'cbudget',
      { H1: 'x*(x+y<=1)', H2: 'y*(x+y<=1)', a1: '0', b1: '1', a2: '0', b2: '1' },
      'Пример 12: распиливание бюджета',
      'Example 12: splitting a budget',
    ],
    [
      'clin',
      { H1: '-(x-y)^2', H2: '-(y-x/2-1)^2', a1: '0', b1: '4', a2: '0', b2: '4' },
      'Линейные наилучшие ответы',
      'Linear best responses',
    ],
    [
      'ccoord',
      { H1: 'x*y-x^2/2', H2: 'x*y-y^2/2', a1: '0', b1: '1', a2: '0', b2: '1' },
      'Континуум равновесий',
      'A continuum of equilibria',
    ],
  ],
  bayes: [
    [
      'bmeet',
      { mu: '0,5', A1: '2 0\n0 1', B1: '1 0\n0 2', A2: '2 0\n0 1', B2: '0 2\n1 0' },
      'Встреча: второй хочет или избегает',
      'Meeting: the other wants or avoids',
    ],
    [
      'bentry',
      { mu: '0,3', A1: '2 -1\n0 0', B1: '1 3\n0 0', A2: '2 -1\n0 0', B2: '3 1\n0 0' },
      'Вход на рынок: тип конкурента',
      'Entry: rival’s type',
    ],
    [
      'bmeet8',
      { mu: '0,8', A1: '2 0\n0 1', B1: '1 0\n0 2', A2: '2 0\n0 1', B2: '0 2\n1 0' },
      'Встреча, μ = 0,8',
      'Meeting, μ = 0.8',
    ],
  ],
  hotel: [
    [
      'hloc',
      { hm: 'loc', ha: '', hb: '', ht: '', hc: '' },
      'Выбор места (цены равны)',
      'Location choice (equal prices)',
    ],
    [
      'hends',
      { hm: 'price', ha: '0', hb: '0', ht: '1', hc: '0' },
      'Цены на концах отрезка',
      'Prices at the ends',
    ],
    [
      'hin',
      { hm: 'price', ha: '0,1', hb: '0,3', ht: '2', hc: '1' },
      'Цены, фирмы внутри отрезка',
      'Prices, firms inside',
    ],
  ],
  tree: [
    [
      'entry',
      { tr: 'A: 1 | Войти -> B | Не входить -> (0; 4)\nB: 2 | Бороться -> (-1; -1) | Уступить -> (2; 2)' },
      'Вход на рынок',
      'Market entry',
    ],
    [
      'cent',
      {
        tr: 'A: 1 | Взять -> (1; 0) | Дальше -> B\nB: 2 | Взять -> (0; 2) | Дальше -> C\nC: 1 | Взять -> (3; 1) | Дальше -> D\nD: 2 | Взять -> (2; 4) | Дальше -> (3; 3)',
      },
      'Сороконожка',
      'Centipede',
    ],
    [
      'ult',
      {
        tr: 'A: 1 | Дать 1 -> B1 | Дать 2 -> B2 | Дать 3 -> B3\nB1: 2 | Принять -> (3; 1) | Отказ -> (0; 0)\nB2: 2 | Принять -> (2; 2) | Отказ -> (0; 0)\nB3: 2 | Принять -> (1; 3) | Отказ -> (0; 0)',
      },
      'Ультиматум: 4 монеты',
      'Ultimatum: 4 coins',
    ],
    [
      'tr3',
      {
        tr: 'A: 1 | Л -> B | П -> C\nB: 2 | л -> D | п -> (1; 2; 0)\nC: 3 | а -> (2; 0; 1) | б -> (0; 1; 3)\nD: 3 | а -> (3; 1; 1) | б -> (0; 3; 2)',
      },
      'Три игрока',
      'Three players',
    ],
  ],
  rep: [
    [
      'pd10',
      { R: '3', Tt: '5', Ss: '0', Pp: '1', rn: '10', dl: '0,9' },
      'Дилемма, 10 раундов',
      'Dilemma, 10 rounds',
    ],
    [
      'pd100',
      { R: '3', Tt: '5', Ss: '0', Pp: '1', rn: '100', dl: '0,9' },
      'Дилемма, 100 раундов',
      'Dilemma, 100 rounds',
    ],
    [
      'pdh',
      { R: '3', Tt: '10', Ss: '0', Pp: '1', rn: '50', dl: '0,5' },
      'Сильный соблазн T = 10',
      'Strong temptation T = 10',
    ],
  ],
  evo: [
    [
      'hd',
      { em: 'hd', V: '2', C: '4', EA: '', x0: '0,05 0,3 0,7 0,95' },
      'Ястреб и голубь (V = 2, C = 4)',
      'Hawk–dove (V = 2, C = 4)',
    ],
    [
      'pdevo',
      { em: 'mat', V: '', C: '', EA: '3 0\n5 1', x0: '0,1 0,5 0,9 0,99' },
      'Дилемма заключённого',
      'Prisoner’s dilemma',
    ],
    [
      'coordevo',
      { em: 'mat', V: '', C: '', EA: '2 0\n0 1', x0: '0,1 0,3 0,4 0,8' },
      'Координация: две ESS',
      'Coordination: two ESS',
    ],
  ],
  vote: [
    ['v3', { q: '50', wts: '49 49 2' }, '[50; 49, 49, 2]: равная сила', '[50; 49, 49, 2]: equal power'],
    ['v51', { q: '51', wts: '50 49 1' }, '[51; 50, 49, 1]', '[51; 50, 49, 1]'],
    ['board', { q: '4', wts: '3 2 1 1' }, 'Совет директоров [4; 3, 2, 1, 1]', 'Board [4; 3, 2, 1, 1]'],
    [
      'unsc',
      { q: '39', wts: '7 7 7 7 7 1 1 1 1 1 1 1 1 1 1' },
      'Совбез ООН: 5 постоянных + 10',
      'UN Security Council: 5 + 10',
    ],
  ],
  match: [
    [
      'gs3',
      { mp: 'A: X Y Z\nB: Y X Z\nC: X Y Z', mr: 'X: B A C\nY: A B C\nZ: A B C', side: 'p' },
      'Три пары',
      'Three pairs',
    ],
    [
      'gs3r',
      { mp: 'A: X Y Z\nB: Y X Z\nC: X Y Z', mr: 'X: B A C\nY: A B C\nZ: A B C', side: 'r' },
      'Те же, предлагает другая сторона',
      'Same, other side proposes',
    ],
    [
      'gs4',
      {
        mp: 'Аня: МГУ ВАВТ ВШЭ МГИМО\nБорис: ВАВТ МГУ МГИМО ВШЭ\nВика: ВАВТ ВШЭ МГУ МГИМО\nГлеб: МГУ ВАВТ ВШЭ МГИМО',
        mr: 'МГУ: Борис Аня Глеб Вика\nВАВТ: Аня Вика Борис Глеб\nВШЭ: Вика Глеб Аня Борис\nМГИМО: Глеб Борис Вика Аня',
        side: 'p',
      },
      'Абитуриенты и вузы',
      'Applicants and universities',
    ],
  ],
  braess: [
    ['brno', { bN: '4000', ba: '100', bb: '45', be: '0', brg: 'no' }, 'Без перемычки', 'Without the link'],
    [
      'bryes',
      { bN: '4000', ba: '100', bb: '45', be: '0', brg: 'yes' },
      'С перемычкой: парадокс',
      'With the link: the paradox',
    ],
    [
      'bre',
      { bN: '4000', ba: '100', bb: '45', be: '10', brg: 'yes' },
      'Перемычка с временем 10',
      'Link with time 10',
    ],
  ],
});
// дополнения второй части тренажёра
PRE.cour.forEach((p) => {
  p[1].om = 'cour';
});
// дополнения второй части тренажёра
PRE.cour.push(
  [
    'stack',
    { om: 'stack', M: '10', cs: '1 1' },
    'Штакельберг: лидер ходит первым',
    'Stackelberg: the leader moves first',
  ],
  ['bert', { om: 'bert', M: '10', cs: '1 1' }, 'Бертран: парадокс P = c', 'Bertrand: the paradox P = c'],
  ['bertA', { om: 'bert', M: '10', cs: '1 3' }, 'Бертран: разные издержки', 'Bertrand: different costs'],
  ['cmpall', { om: 'cmp', M: '10', cs: '1' }, 'Сравнение моделей', 'Comparing models']
);
