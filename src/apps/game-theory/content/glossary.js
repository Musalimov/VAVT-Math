export const TERMS = [
  {
    id: 'game',
    ru: [
      'Игра в нормальной форме',
      'игроки, стратегии, выигрыши',
      '<p>Задаётся множеством игроков, множествами их стратегий Xᵢ и функциями выигрыша Hᵢ(x₁, …, x_N). Каждый выбирает стратегию одновременно и независимо, стремясь максимизировать свой выигрыш. Для двух игроков с конечным числом стратегий выигрыши записывают двумя матрицами — это <b>биматричная</b> игра.</p>',
    ],
    en: [
      'Game in normal form',
      'players, strategies, payoffs',
      '<p>Given by a set of players, strategy sets Xᵢ and payoff functions Hᵢ(x₁, …, x_N). Everyone chooses simultaneously and independently, maximizing their own payoff. For two players with finitely many strategies the payoffs form two matrices — a <b>bimatrix</b> game.</p>',
    ],
  },
  {
    id: 'br',
    ru: [
      'Функция наилучшего ответа',
      'fᵢ(x₋ᵢ)',
      '<p>Стратегия, дающая игроку i наибольший выигрыш при фиксированных стратегиях остальных: <span class="m">fᵢ(x₋ᵢ) = argmax Hᵢ(xᵢ, x₋ᵢ)</span>. В матрице — максимум в столбце для игрока 1 и в строке для игрока 2. В непрерывных играх её находят, приравнивая производную к нулю (Курно).</p>',
    ],
    en: [
      'Best response',
      'fᵢ(x₋ᵢ)',
      '<p>The strategy giving player i the highest payoff with the others fixed: <span class="m">fᵢ(x₋ᵢ) = argmax Hᵢ(xᵢ, x₋ᵢ)</span>. In a matrix: the maximum in a column for player 1 and in a row for player 2. In continuous games it is found by setting the derivative to zero (Cournot).</p>',
    ],
  },
  {
    id: 'nash',
    ru: [
      'Равновесие Нэша',
      'определение 12',
      '<p>Профиль стратегий, в котором каждая стратегия — наилучший ответ на остальные: никому не выгодно отклоняться в одиночку. Равновесий может быть несколько (пример 12 — распиливание бюджета) или ни одного в чистых стратегиях. Равновесие — лишь необходимое условие «разумного» исхода.</p><p>Дилемма заключённого: единственное равновесие (признаться, признаться) хуже для обоих, чем (молчать, молчать).</p>',
    ],
    en: [
      'Nash equilibrium',
      'Definition 12',
      '<p>A strategy profile in which each strategy is a best response to the others: no one gains by deviating alone. There may be several equilibria (example 12, splitting a budget) or none in pure strategies. An equilibrium is only a necessary condition for a “reasonable” outcome.</p><p>Prisoner’s dilemma: the unique equilibrium (confess, confess) is worse for both than (silent, silent).</p>',
    ],
  },
  {
    id: 'dom',
    ru: [
      'Доминирование',
      'вычёркивание стратегий',
      '<p>Стратегия a строго доминирует b, если при любом ответе соперника даёт больше. Рациональный игрок доминируемую стратегию не выберет, её можно вычеркнуть и повторить процедуру. Равновесия Нэша при этом сохраняются.</p>',
    ],
    en: [
      'Dominance',
      'eliminating strategies',
      '<p>Strategy a strictly dominates b if it gives more against every reply. A rational player won’t choose a dominated strategy, so it can be deleted and the procedure repeated. Nash equilibria survive the deletion.</p>',
    ],
  },
  {
    id: 'mixed',
    ru: [
      'Смешанные стратегии',
      'вероятности выбора',
      '<p>Игрок выбирает чистые стратегии случайно с вероятностями p₁, …, p_m. В смешанном равновесии каждый выбирает вероятности так, чтобы соперник был безразличен между своими стратегиями. В игре 2×2: <span class="m">q = (a₂₂ − a₁₂)/(a₁₁ − a₁₂ − a₂₁ + a₂₂)</span>. По теореме Нэша в конечной игре равновесие в смешанных стратегиях существует всегда.</p>',
    ],
    en: [
      'Mixed strategies',
      'choice probabilities',
      '<p>A player picks pure strategies at random with probabilities p₁, …, p_m. In a mixed equilibrium each chooses probabilities that make the opponent indifferent. In a 2×2 game: <span class="m">q = (a₂₂ − a₁₂)/(a₁₁ − a₁₂ − a₂₁ + a₂₂)</span>. By Nash’s theorem, a finite game always has a mixed equilibrium.</p>',
    ],
  },
  {
    id: 'zerosum',
    ru: [
      'Антагонистическая игра',
      'седловая точка, цена игры',
      '<p>Выигрыш одного — проигрыш другого: матрица B = −A. Нижняя цена <span class="m">α = maxᵢ minⱼ aᵢⱼ</span> (гарантия игрока 1), верхняя <span class="m">β = minⱼ maxᵢ aᵢⱼ</span>. Если α = β — седловая точка, оптимальны чистые стратегии. Иначе цена v ∈ (α; β) достигается в смешанных стратегиях; её находят графически (2×n) или как задачу ЛП.</p>',
    ],
    en: [
      'Zero-sum game',
      'saddle point, value',
      '<p>One player’s gain is the other’s loss: B = −A. Lower value <span class="m">α = maxᵢ minⱼ aᵢⱼ</span> (player 1’s guarantee), upper value <span class="m">β = minⱼ maxᵢ aᵢⱼ</span>. If α = β there is a saddle point and pure strategies are optimal. Otherwise the value v ∈ (α; β) is reached in mixed strategies, found graphically (2×n) or as an LP.</p>',
    ],
  },
  {
    id: 'cournot',
    ru: [
      'Модель Курно',
      'пример 13',
      '<p>N фирм выбирают объёмы qᵢ, цена <span class="m">P = M − Q</span>, издержки c на единицу. Прибыль <span class="m">Hᵢ = qᵢ(M − Q) − cqᵢ</span>, наилучший ответ <span class="m">qᵢ = (M − c − Σⱼ≠ᵢqⱼ)/2</span>. Равновесие: <span class="m">qᵢ = (M − c)/(N + 1)</span>. При N = 1 — монополия, при N → ∞ цена стремится к c — совершенная конкуренция.</p>',
    ],
    en: [
      'Cournot model',
      'example 13',
      '<p>N firms choose outputs qᵢ, price <span class="m">P = M − Q</span>, unit cost c. Profit <span class="m">Hᵢ = qᵢ(M − Q) − cqᵢ</span>, best response <span class="m">qᵢ = (M − c − Σⱼ≠ᵢqⱼ)/2</span>. Equilibrium: <span class="m">qᵢ = (M − c)/(N + 1)</span>. N = 1 is monopoly; as N → ∞ the price tends to c, perfect competition.</p>',
    ],
  },
  {
    id: 'bargain',
    ru: [
      'Задача торга',
      'пара (M, d), определение 14',
      '<p>M ⊂ ℝ² — множество возможных выигрышей двух участников (выпуклое, замкнутое, ограниченное сверху), d ∈ M — что каждый получит, если не договорятся. Нужно выбрать справедливую точку M. Аксиоматический подход: перечислить желаемые свойства решения и найти единственное правило, которое им удовлетворяет.</p>',
    ],
    en: [
      'Bargaining problem',
      'pair (M, d), Definition 14',
      '<p>M ⊂ ℝ² is the set of possible payoffs of two parties (convex, closed, bounded above), d ∈ M is what each gets without agreement. A fair point of M must be chosen. The axiomatic approach: list desired properties of a solution and find the unique rule satisfying them.</p>',
    ],
  },
  {
    id: 'nashbarg',
    ru: [
      'Решение Нэша',
      'теорема 7',
      '<p>Единственное решение, удовлетворяющее аксиомам Парето-оптимальности, симметрии, независимости от линейных преобразований и от посторонних альтернатив: <span class="m">argmax (x₁ − d₁)(x₂ − d₂)</span> по x ∈ M, x ⩾ d. Геометрически — точка касания границы M с гиперболой. Пример 14: дележ единицы, решение (0,5; 0,5).</p>',
    ],
    en: [
      'Nash bargaining solution',
      'Theorem 7',
      '<p>The unique solution satisfying Pareto optimality, symmetry, invariance to linear transformations and independence of irrelevant alternatives: <span class="m">argmax (x₁ − d₁)(x₂ − d₂)</span> over x ∈ M, x ⩾ d. Geometrically, where the boundary of M touches a hyperbola. Example 14: splitting a unit, solution (0.5; 0.5).</p>',
    ],
  },
  {
    id: 'ks',
    ru: [
      'Решение Калаи–Смородинского',
      'теорема 8',
      '<p>Идеальная точка a — наибольший выигрыш каждого при условии, что другой получает не меньше d. Решение — Парето-оптимальная точка, для которой <span class="m">(x₁ − d₁) : (x₂ − d₂) = (a₁ − d₁) : (a₂ − d₂)</span>: оба получают одинаковую долю от своего максимально возможного выигрыша. Вместо независимости от посторонних альтернатив — аксиома монотонности. Пример 15 (носки): (90; 150).</p>',
    ],
    en: [
      'Kalai–Smorodinsky solution',
      'Theorem 8',
      '<p>The ideal point a is each party’s best payoff given the other gets at least d. The solution is the Pareto point with <span class="m">(x₁ − d₁) : (x₂ − d₂) = (a₁ − d₁) : (a₂ − d₂)</span>: both get the same share of their best possible gain. Monotonicity replaces independence of irrelevant alternatives. Example 15 (socks): (90; 150).</p>',
    ],
  },
  {
    id: 'coopgame',
    ru: [
      'Кооперативная игра',
      'с побочными платежами',
      '<p>Задана характеристическая функция v(K) — сколько может заработать каждая коалиция K ⊂ N, v(∅) = 0. Выигрыш делится между участниками произвольно. Дележ — вектор x с <span class="m">Σxᵢ = v(N)</span>; импутация — дележ, где ещё и <span class="m">xᵢ ⩾ v({i})</span>.</p>',
    ],
    en: [
      'Cooperative game',
      'with side payments',
      '<p>A characteristic function v(K) gives what each coalition K ⊂ N can earn, v(∅) = 0. Winnings can be split arbitrarily. An allocation is a vector x with <span class="m">Σxᵢ = v(N)</span>; an imputation additionally has <span class="m">xᵢ ⩾ v({i})</span>.</p>',
    ],
  },
  {
    id: 'core',
    ru: [
      'Ядро',
      'определение 16',
      '<p>Дележи, при которых ни одной коалиции невыгодно отделиться: <span class="m">x(K) ⩾ v(K)</span> для всех K. Это система линейных неравенств — допустимое множество, как в линейной оптимизации; оно может быть пустым. Для трёх игроков ядро рисуется внутри треугольника импутаций (пример 16 — оркестр).</p>',
    ],
    en: [
      'Core',
      'Definition 16',
      '<p>Allocations under which no coalition wants to break away: <span class="m">x(K) ⩾ v(K)</span> for all K. It is a system of linear inequalities, a feasible set as in linear optimization, and may be empty. For three players the core is drawn inside the imputation triangle (example 16, the orchestra).</p>',
    ],
  },
  {
    id: 'shapley',
    ru: [
      'Вектор Шепли',
      'определение 17, теорема 9',
      '<p><span class="m">φᵢ</span> — средний вклад игрока i, если участники присоединяются к коалиции в случайном порядке: <span class="m">φᵢ = (1/n!) Σ (v(Kᵢ ∪ {i}) − v(Kᵢ))</span>. Единственный дележ, удовлетворяющий эффективности, симметрии, линейности и аксиоме болвана. Оркестр: φ = (14; 23; 35).</p>',
    ],
    en: [
      'Shapley value',
      'Definition 17, Theorem 9',
      '<p><span class="m">φᵢ</span> is player i’s average contribution when players join the coalition in random order: <span class="m">φᵢ = (1/n!) Σ (v(Kᵢ ∪ {i}) − v(Kᵢ))</span>. The unique allocation satisfying efficiency, symmetry, linearity and the dummy axiom. Orchestra: φ = (14; 23; 35).</p>',
    ],
  },
  {
    id: 'convex',
    ru: [
      'Выпуклая игра',
      'определение 18, теорема 12',
      '<p>Игра выпуклая, если <span class="m">v(S ∪ T) + v(S ∩ T) ⩾ v(S) + v(T)</span> для всех коалиций: чем больше коалиция, тем больше вклад присоединяющегося. В выпуклой игре ядро непусто и содержит вектор Шепли. Оркестр не выпуклый (пример 20).</p>',
    ],
    en: [
      'Convex game',
      'Definition 18, Theorem 12',
      '<p>A game is convex if <span class="m">v(S ∪ T) + v(S ∩ T) ⩾ v(S) + v(T)</span> for all coalitions: the bigger the coalition, the larger a newcomer’s contribution. In a convex game the core is non-empty and contains the Shapley value. The orchestra isn’t convex (example 20).</p>',
    ],
  },
  {
    id: 'prenuc',
    ru: [
      'Нуклеолус и преднуклеолус',
      'определения 21–22, алгоритм МПШ',
      '<p>Эксцесс <span class="m">e(K, x) = v(K) − x(K)</span> — «недовольство» коалиции. Преднуклеолус — дележ, лексикографически минимизирующий упорядоченный по убыванию вектор эксцессов; он единственен и, если ядро непусто, лежит в нём. Алгоритм Машлера–Пелега–Шепли решает последовательность задач ЛП. Пример 23: (2; 2; 4), пример 24: (1,5; 2; 0,5).</p>',
    ],
    en: [
      'Nucleolus and prenucleolus',
      'Definitions 21–22, MPS algorithm',
      '<p>The excess <span class="m">e(K, x) = v(K) − x(K)</span> is a coalition’s “dissatisfaction”. The prenucleolus lexicographically minimizes the vector of excesses sorted decreasingly; it is unique and lies in the core when the core is non-empty. The Maschler–Peleg–Shapley algorithm solves a sequence of LPs. Example 23: (2; 2; 4), example 24: (1.5; 2; 0.5).</p>',
    ],
  },
  {
    id: 'auction',
    ru: [
      'Аукционы',
      'форматы, частные ценности',
      '<p>Повышающий (английский), понижающий (голландский), первой цены, второй цены (Викри), «платят все». В PV-аукционе ценность предмета для участника не зависит от оценок других. Аукцион эффективен, если предмет достаётся участнику с наибольшей оценкой.</p>',
    ],
    en: [
      'Auctions',
      'formats, private values',
      '<p>English (ascending), Dutch (descending), first-price, second-price (Vickrey), all-pay. In a private-value auction the item’s worth to a bidder doesn’t depend on others’ values. An auction is efficient if the item goes to the highest-value bidder.</p>',
    ],
  },
  {
    id: 'revenue',
    ru: [
      'Эквивалентность дохода',
      'теорема Майерсона',
      '<p>В симметричных эффективных PV-аукционах с независимыми оценками и нулевым платежом участника с нулевой оценкой ожидаемый доход аукциониста одинаков. Для U[0; ω] он равен <span class="m">ω(n − 1)/(n + 1)</span>; пример 27 (n = 10, ω = 1): 9/11. Равновесные ставки: первой цены <span class="m">(n − 1)v/n</span>, второй цены <span class="m">v</span>, «платят все» <span class="m">(n − 1)vⁿ/(nωⁿ⁻¹)</span>.</p>',
    ],
    en: [
      'Revenue equivalence',
      'Myerson’s theorem',
      '<p>In symmetric efficient private-value auctions with independent values and zero payment at zero value, the seller’s expected revenue is the same. For U[0; ω] it is <span class="m">ω(n − 1)/(n + 1)</span>; example 27 (n = 10, ω = 1): 9/11. Equilibrium bids: first price <span class="m">(n − 1)v/n</span>, second price <span class="m">v</span>, all-pay <span class="m">(n − 1)vⁿ/(nωⁿ⁻¹)</span>.</p>',
    ],
  },
];
export const FORMAL = {};
export const REL = {
  game: ['br', 'nash'],
  br: ['nash', 'cournot'],
  nash: ['dom', 'mixed'],
  dom: ['nash'],
  mixed: ['nash', 'zerosum'],
  zerosum: ['mixed'],
  cournot: ['br', 'nash'],
  bargain: ['nashbarg', 'ks'],
  nashbarg: ['ks'],
  ks: ['nashbarg'],
  coopgame: ['core', 'shapley'],
  core: ['shapley', 'prenuc'],
  shapley: ['core', 'convex'],
  convex: ['core', 'shapley'],
  prenuc: ['core'],
  auction: ['revenue'],
  revenue: ['auction'],
};
export const CHAP = [
  {
    ru: '6. Некооперативные игры',
    en: '6. Non-cooperative games',
    ids: ['game', 'br', 'nash', 'dom', 'mixed', 'zerosum', 'cournot'],
  },
  { ru: '7. Задача торга', en: '7. Bargaining', ids: ['bargain', 'nashbarg', 'ks'] },
  {
    ru: '8. Кооперативные игры',
    en: '8. Cooperative games',
    ids: ['coopgame', 'core', 'shapley', 'convex', 'prenuc'],
  },
  { ru: '9. Аукционы', en: '9. Auctions', ids: ['auction', 'revenue'] },
];
export const DEMOS = {
  game: { p: 'pd' },
  br: { p: 'bos' },
  nash: { p: 'pd' },
  dom: { p: 'dom3' },
  mixed: { p: 'bos' },
  zerosum: { p: 'zs23' },
  cournot: { p: 'c13' },
  bargain: { p: 'b15' },
  nashbarg: { p: 'b14' },
  ks: { p: 'basym' },
  coopgame: { p: 'orch' },
  core: { p: 'orch' },
  shapley: { p: 'orch' },
  convex: { p: 'convex' },
  prenuc: { p: 'e24' },
  auction: { p: 'a27' },
  revenue: { p: 'a27' },
};
export const ILL = {};
// дополнения второй части тренажёра
TERMS.push(
  {
    id: 'contg',
    ru: [
      'Непрерывные игры',
      'стратегии из отрезка',
      '<p>Стратегии — числа из отрезков, выигрыши — функции H₁(x, y), H₂(x, y). Наилучший ответ ищут, максимизируя выигрыш по своей переменной (часто — приравнивая производную к нулю). Равновесие — пересечение кривых наилучших ответов; их может быть бесконечно много, как в примере 12, где равновесия — весь отрезок x + y = 1 и точка (1; 1).</p>',
    ],
    en: [
      'Continuous games',
      'strategies from an interval',
      '<p>Strategies are numbers from intervals, payoffs are functions H₁(x, y), H₂(x, y). A best response maximizes the payoff over one’s own variable (often by setting the derivative to zero). An equilibrium is an intersection of the best-response curves; there may be infinitely many, as in example 12 where the whole segment x + y = 1 and the point (1; 1) are equilibria.</p>',
    ],
  },
  {
    id: 'stack',
    ru: [
      'Модель Штакельберга',
      'лидер и последователь',
      '<p>Фирма 1 выбирает объём первой, фирма 2 видит его и отвечает по Курно: <span class="m">q₂ = (M − c₂ − q₁)/2</span>. Лидер учитывает этот ответ: <span class="m">q₁ = (M − 2c₁ + c₂)/2</span>. При c₁ = c₂ = c: <span class="m">q₁ = (M − c)/2</span>, <span class="m">q₂ = (M − c)/4</span>. Первый ход выгоден: лидер зарабатывает больше, чем в Курно.</p>',
    ],
    en: [
      'Stackelberg model',
      'leader and follower',
      '<p>Firm 1 chooses output first; firm 2 sees it and responds as in Cournot: <span class="m">q₂ = (M − c₂ − q₁)/2</span>. The leader takes this into account: <span class="m">q₁ = (M − 2c₁ + c₂)/2</span>. With c₁ = c₂ = c: <span class="m">q₁ = (M − c)/2</span>, <span class="m">q₂ = (M − c)/4</span>. Moving first pays: the leader earns more than in Cournot.</p>',
    ],
  },
  {
    id: 'bertrand',
    ru: [
      'Модель Бертрана',
      'ценовая конкуренция',
      '<p>Фирмы с однородным товаром назначают цены; покупатели идут к дешёвой. Если цена соперника выше издержек, выгодно её чуть сбить, поэтому при равных издержках <span class="m">p₁ = p₂ = c</span>, и прибыли нулевые даже при двух фирмах — <b>парадокс Бертрана</b>. При разных издержках дешёвая фирма ставит цену чуть ниже издержек соперника.</p>',
    ],
    en: [
      'Bertrand model',
      'price competition',
      '<p>Firms with a homogeneous good set prices; buyers go to the cheaper one. If the rival’s price is above cost, undercutting pays, so with equal costs <span class="m">p₁ = p₂ = c</span> and profits are zero even with two firms — the <b>Bertrand paradox</b>. With different costs the cheaper firm prices just below the rival’s cost.</p>',
    ],
  },
  {
    id: 'hotelling',
    ru: [
      'Модель Хотеллинга',
      'пространственная конкуренция',
      '<p>Покупатели распределены по отрезку [0; 1] и идут к ближайшей фирме. При фиксированных ценах обе фирмы встают в середину — <b>принцип минимальной дифференциации</b> (поэтому магазины и партии часто «сходятся к центру»). Если фирмы конкурируют ценами при транспортных издержках t, то цены <span class="m">pᵢ = c + t(1 ± (a − b)/3)</span>.</p>',
    ],
    en: [
      'Hotelling model',
      'spatial competition',
      '<p>Buyers are spread over [0; 1] and go to the nearest firm. With fixed prices both firms locate in the middle — the <b>principle of minimum differentiation</b> (why shops and parties often “converge to the centre”). If firms compete in prices with transport cost t, prices are <span class="m">pᵢ = c + t(1 ± (a − b)/3)</span>.</p>',
    ],
  },
  {
    id: 'extensive',
    ru: [
      'Развёрнутая форма и обратная индукция',
      'совершенное по подыграм равновесие',
      '<p>Игра задаётся деревом: в вершинах ходят игроки, в листьях — выигрыши. Обратная индукция решает игру с конца: в каждой последней вершине выбирается лучшее действие, затем этот выбор подставляется выше. Результат — <b>совершенное по подыграм равновесие</b>: оно исключает невыполнимые угрозы. Во «входе на рынок» угроза «бороться» не заслуживает доверия — после входа выгоднее уступить.</p>',
    ],
    en: [
      'Extensive form and backward induction',
      'subgame-perfect equilibrium',
      '<p>The game is a tree: players move at nodes, leaves hold payoffs. Backward induction solves it from the end: at each last node pick the best action, then plug that choice in above. The result is a <b>subgame-perfect equilibrium</b>, which rules out non-credible threats. In “market entry” the threat to fight isn’t credible: once entry happens, accommodating pays more.</p>',
    ],
  },
  {
    id: 'repeated',
    ru: [
      'Повторяющиеся игры',
      'кооперация и турнир Аксельрода',
      '<p>Дилемму заключённого играют много раз. В бесконечной игре кооперация поддерживается угрозой наказания: со стратегией «мрачный триггер» она устойчива при <span class="m">δ ⩾ (T − R)/(T − P)</span> (народная теорема). В турнирах Аксельрода выигрывала простая «око за око»: начинать с кооперации, затем повторять ход соперника.</p>',
    ],
    en: [
      'Repeated games',
      'cooperation and Axelrod’s tournament',
      '<p>The prisoner’s dilemma is played many times. In the infinite game cooperation is sustained by the threat of punishment: with a grim trigger it is stable when <span class="m">δ ⩾ (T − R)/(T − P)</span> (the folk theorem). In Axelrod’s tournaments simple tit for tat won: cooperate first, then copy the opponent’s last move.</p>',
    ],
  },
  {
    id: 'bayesian',
    ru: [
      'Байесовские игры',
      'неполная информация, Харшаньи',
      '<p>Игрок не знает, какого «типа» соперник (сильный или слабый, хочет встречи или нет), но знает вероятности типов. Преобразование Харшаньи превращает это в обычную игру: стратегия соперника — план действий для каждого типа, выигрыши — ожидаемые. Байесовское равновесие — равновесие Нэша этой игры.</p>',
    ],
    en: [
      'Bayesian games',
      'incomplete information, Harsanyi',
      '<p>A player doesn’t know the rival’s “type” (strong or weak, wants to meet or not) but knows the type probabilities. The Harsanyi transformation turns this into an ordinary game: the rival’s strategy is a plan for each type, payoffs are expected values. A Bayesian equilibrium is a Nash equilibrium of this game.</p>',
    ],
  },
  {
    id: 'ess',
    ru: [
      'Эволюционно устойчивая стратегия',
      'ESS, динамика репликатора',
      '<p>Стратегия, которую не может вытеснить малая доля мутантов: <span class="m">a(s, s) > a(m, s)</span> или при равенстве <span class="m">a(s, m) > a(m, m)</span>. Динамика репликатора <span class="m">ẋ = x(1 − x)(f₁ − f₂)</span>: доля стратегии растёт, если она приносит больше среднего. В «ястребе и голубе» при V < C устойчива смесь с долей ястребов V/C.</p>',
    ],
    en: [
      'Evolutionarily stable strategy',
      'ESS, replicator dynamics',
      '<p>A strategy that a small share of mutants can’t displace: <span class="m">a(s, s) > a(m, s)</span>, or with equality <span class="m">a(s, m) > a(m, m)</span>. Replicator dynamics <span class="m">ẋ = x(1 − x)(f₁ − f₂)</span>: a strategy’s share grows if it earns more than average. In hawk–dove with V < C a mix with hawk share V/C is stable.</p>',
    ],
  },
  {
    id: 'powerind',
    ru: [
      'Индексы силы',
      'Шепли–Шубик и Банцаф',
      '<p>Взвешенное голосование [q; w₁, …, wₙ]: коалиция проходит, если сумма весов ⩾ q. Индекс Шепли–Шубика — вектор Шепли этой простой игры: доля порядков, где участник «ключевой». Индекс Банцафа — доля коалиций, где участник решает исход. Сила не пропорциональна весу: в [51; 50, 49, 1] у второго и третьего участников она одинакова.</p>',
    ],
    en: [
      'Power indices',
      'Shapley–Shubik and Banzhaf',
      '<p>Weighted voting [q; w₁, …, wₙ]: a coalition passes if its total weight is ⩾ q. The Shapley–Shubik index is the Shapley value of this simple game: the share of orderings in which a player is pivotal. The Banzhaf index is the share of coalitions where the player decides the outcome. Power isn’t proportional to weight: in [51; 50, 49, 1] the second and third players are equally strong.</p>',
    ],
  },
  {
    id: 'gs',
    ru: [
      'Алгоритм Гейла–Шепли',
      'устойчивые паросочетания',
      '<p>Две стороны с предпочтениями (абитуриенты и вузы). Паросочетание устойчиво, если нет пары, которая предпочла бы друг друга своим партнёрам. Алгоритм отложенного принятия: свободные делают предложения по порядку предпочтений, получатели держат лучшее и отказывают остальным. Он всегда находит устойчивое паросочетание, наилучшее для предлагающей стороны. Нобелевская премия 2012 года (Рот, Шепли).</p>',
    ],
    en: [
      'Gale–Shapley algorithm',
      'stable matchings',
      '<p>Two sides with preferences (applicants and universities). A matching is stable if no pair would rather be with each other than with their partners. Deferred acceptance: free agents propose in order of preference, receivers hold the best offer and reject the rest. It always finds a stable matching, the best one for the proposing side. Nobel Prize 2012 (Roth, Shapley).</p>',
    ],
  },
  {
    id: 'braess',
    ru: [
      'Парадокс Браеса',
      'равновесие Вардропа',
      '<p>В игре перегрузки каждый водитель выбирает самый быстрый маршрут; в равновесии Вардропа время на всех используемых маршрутах одинаково. Новая дорога может ухудшить положение всех: в классическом примере 4000 водителей ехали 65 минут, а после добавления бесплатной перемычки — 80. Равновесие не совпадает с социальным оптимумом.</p>',
    ],
    en: [
      'Braess paradox',
      'Wardrop equilibrium',
      '<p>In a congestion game each driver takes the fastest route; in a Wardrop equilibrium all used routes take equal time. A new road can make everyone worse off: in the classic example 4000 drivers took 65 minutes, and after adding a free link — 80. The equilibrium differs from the social optimum.</p>',
    ],
  }
);
// дополнения второй части тренажёра
CHAP.length = 0;
// дополнения второй части тренажёра
CHAP.push(
  {
    ru: 'Статические игры',
    en: 'Static games',
    ids: ['game', 'br', 'nash', 'dom', 'mixed', 'zerosum', 'contg', 'bayesian'],
  },
  {
    ru: 'Олигополия и рынки',
    en: 'Oligopoly and markets',
    ids: ['cournot', 'stack', 'bertrand', 'hotelling'],
  },
  { ru: 'Динамические игры', en: 'Dynamic games', ids: ['extensive', 'repeated', 'ess'] },
  {
    ru: 'Кооперация и торг',
    en: 'Cooperation and bargaining',
    ids: ['bargain', 'nashbarg', 'ks', 'coopgame', 'core', 'shapley', 'convex', 'prenuc', 'powerind', 'gs'],
  },
  { ru: 'Механизмы и сети', en: 'Mechanisms and networks', ids: ['auction', 'revenue', 'braess'] }
);
// дополнения второй части тренажёра
Object.assign(DEMOS, {
  contg: { p: 'cbudget' },
  stack: { p: 'stack' },
  bertrand: { p: 'bert' },
  hotelling: { p: 'hloc' },
  extensive: { p: 'entry' },
  repeated: { p: 'pd10' },
  bayesian: { p: 'bmeet' },
  ess: { p: 'hd' },
  powerind: { p: 'v51' },
  gs: { p: 'gs4' },
  braess: { p: 'bryes' },
});
// дополнения второй части тренажёра
Object.assign(REL, {
  contg: ['br', 'nash'],
  stack: ['cournot', 'bertrand'],
  bertrand: ['cournot', 'stack'],
  hotelling: ['bertrand'],
  extensive: ['nash'],
  repeated: ['nash', 'ess'],
  bayesian: ['nash', 'auction'],
  ess: ['mixed', 'repeated'],
  powerind: ['shapley'],
  gs: ['core'],
  braess: ['nash'],
});
