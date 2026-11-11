export const TERMS = [
  {
    id: 'lp',
    ru: [
      'Задача линейной оптимизации',
      'ЛП, linear programming',
      '<p>Нужно найти максимум или минимум <b>целевой функции</b> <span class="m">z = c₁x₁ + … + cₙxₙ</span> при <b>ограничениях</b> — линейных неравенствах и равенствах. Точки, удовлетворяющие всем ограничениям, называются <b>допустимыми</b>, а их совокупность — допустимым множеством.</p><p>Решение — допустимая точка, в которой целевая функция принимает наилучшее значение. Его может не быть (множество пусто или функция неограниченна), а может быть бесконечно много.</p>',
    ],
    en: [
      'Linear optimization problem',
      'linear programming, LP',
      '<p>Find the maximum or minimum of the <b>objective</b> <span class="m">z = c₁x₁ + … + cₙxₙ</span> subject to <b>constraints</b>, linear inequalities and equalities. Points satisfying all constraints are <b>feasible</b>; together they form the feasible set.</p><p>A solution is a feasible point with the best objective value. There may be none (the set is empty or the objective is unbounded), or infinitely many.</p>',
    ],
  },
  {
    id: 'production',
    ru: [
      'Производственная задача',
      '§ 2.1, § 3.1',
      '<p>Фирма выпускает n товаров из m видов сырья. <span class="m">aᵢⱼ</span> — расход сырья i на единицу товара j, <span class="m">bᵢ</span> — запас сырья, <span class="m">cⱼ</span> — цена товара. Максимизируем выручку: <span class="m">(c, x) → max</span>, <span class="m">Ax ⩽ b</span>, <span class="m">x ⩾ 0</span>.</p><p>Это «эталонная» форма: к ней сводится любая задача линейной оптимизации (теорема 3), для неё проще всего выписать двойственную и исследовать устойчивость.</p>',
    ],
    en: [
      'Production problem',
      '§ 2.1, § 3.1',
      '<p>A firm makes n goods from m raw materials. <span class="m">aᵢⱼ</span> is the use of material i per unit of good j, <span class="m">bᵢ</span> the stock of material, <span class="m">cⱼ</span> the price of the good. Maximize revenue: <span class="m">(c, x) → max</span>, <span class="m">Ax ⩽ b</span>, <span class="m">x ⩾ 0</span>.</p><p>This is the reference form: every linear optimization problem reduces to it (Theorem 3), and for it the dual and the stability analysis are easiest.</p>',
    ],
  },
  {
    id: 'transport',
    ru: [
      'Транспортная задача',
      '§ 2.2',
      '<p>Груз везут с m складов на n заводов. <span class="m">xᵢⱼ</span> — сколько везём со склада i на завод j, <span class="m">cᵢⱼ</span> — тариф. Минимизируем <span class="m">Σ cᵢⱼxᵢⱼ</span> при условиях: со склада вывозим не больше запаса, на завод привозим не меньше спроса, <span class="m">xᵢⱼ ⩾ 0</span>.</p><p>Если суммарный спрос равен предложению, все неравенства становятся равенствами. Одно из них при этом лишнее: в симплекс-методе такая строка обнуляется и вычёркивается.</p>',
    ],
    en: [
      'Transportation problem',
      '§ 2.2',
      '<p>Goods are shipped from m depots to n plants. <span class="m">xᵢⱼ</span> is the amount from depot i to plant j, <span class="m">cᵢⱼ</span> the rate. Minimize <span class="m">Σ cᵢⱼxᵢⱼ</span> subject to: ship no more than each depot’s stock, deliver at least each plant’s demand, <span class="m">xᵢⱼ ⩾ 0</span>.</p><p>If total demand equals total supply, all inequalities become equalities. One of them is then redundant: in the simplex method that row turns to zeros and is dropped.</p>',
    ],
  },
  {
    id: 'cutting',
    ru: [
      'Задача о раскрое',
      '§ 2.3, целочисленность',
      '<p>Прутья режут разными способами на заготовки, из заготовок собирают комплекты. Переменные — сколько прутьев режем каждым способом, цель — максимум комплектов.</p><p>Важная особенность: переменные обязаны быть целыми. Оптимум без этого требования может оказаться дробным, и тогда задача становится заметно труднее.</p>',
    ],
    en: [
      'Cutting stock problem',
      '§ 2.3, integrality',
      '<p>Rods are cut in different ways into pieces, and pieces are assembled into sets. Variables say how many rods are cut each way; the goal is the maximum number of sets.</p><p>The key feature: variables must be integers. Without that requirement the optimum may be fractional, and the problem then becomes much harder.</p>',
    ],
  },
  {
    id: 'binary',
    ru: [
      'Бинарные переменные',
      'задача о рюкзаке, § 2.4',
      '<p>Переменная <span class="m">xᵢ ∈ {0, 1}</span> отвечает на вопрос «да или нет»: брать предмет или нет. Пример — задача о рюкзаке: унести предметы наибольшей ценности при ограничении на вес.</p><p>Быстрого алгоритма для таких задач не известно. Здесь для небольшого числа переменных перебираются все <span class="m">2ⁿ</span> вариантов, поэтому находятся все оптимальные наборы.</p>',
    ],
    en: [
      'Binary variables',
      'knapsack problem, § 2.4',
      '<p>A variable <span class="m">xᵢ ∈ {0, 1}</span> answers yes or no: take the item or not. Example: the knapsack problem, carry the most valuable items under a weight limit.</p><p>No fast algorithm is known for such problems. Here, for a small number of variables, all <span class="m">2ⁿ</span> options are tried, so all optimal sets are found.</p>',
    ],
  },
  {
    id: 'feasible',
    ru: [
      'Допустимое множество',
      'многоугольник',
      '<p>Каждое неравенство <span class="m">a₁x₁ + a₂x₂ ⩽ b</span> задаёт полуплоскость: прямую <span class="m">a₁x₁ + a₂x₂ = b</span> и всё по одну сторону от неё. Сторону находят пробной точкой, обычно (0; 0): если неравенство в ней верно, берём сторону с ней.</p><p>Допустимое множество — пересечение всех полуплоскостей. Оно выпуклое: это многоугольник, неограниченная область, отрезок, точка или пустое множество. Равенство оставляет только саму прямую.</p>',
    ],
    en: [
      'Feasible set',
      'polygon',
      '<p>Each inequality <span class="m">a₁x₁ + a₂x₂ ⩽ b</span> defines a half-plane: the line <span class="m">a₁x₁ + a₂x₂ = b</span> and everything on one side. Find the side with a test point, usually (0; 0): if the inequality holds there, take that side.</p><p>The feasible set is the intersection of all half-planes. It is convex: a polygon, an unbounded region, a segment, a point or empty. An equality leaves only the line itself.</p>',
    ],
  },
  {
    id: 'gradient',
    ru: [
      'Градиент',
      '∇z',
      '<p>Градиент функции <span class="m">z(x₁, …, xₙ)</span> — вектор частных производных <span class="m">∇z = (z′ₓ₁, …, z′ₓₙ)</span>. Он показывает направление наискорейшего роста функции, а противоположное направление — наискорейшего убывания.</p><p>У линейной функции <span class="m">z = c₁x₁ + c₂x₂</span> градиент один и тот же во всех точках: <span class="m">∇z = (c₁; c₂)</span>. Его рисуют стрелкой из начала координат. На сцене кончик стрелки можно тянуть — так меняется целевая функция.</p>',
    ],
    en: [
      'Gradient',
      '∇z',
      '<p>The gradient of <span class="m">z(x₁, …, xₙ)</span> is the vector of partial derivatives <span class="m">∇z = (z′ₓ₁, …, z′ₓₙ)</span>. It points in the direction of fastest growth; the opposite direction is fastest decrease.</p><p>For a linear function <span class="m">z = c₁x₁ + c₂x₂</span> the gradient is the same everywhere: <span class="m">∇z = (c₁; c₂)</span>. It is drawn as an arrow from the origin. On the scene you can drag its tip to change the objective.</p>',
    ],
  },
  {
    id: 'level',
    ru: [
      'Линия уровня',
      'z = const',
      '<p>Линия уровня — множество точек, где целевая функция принимает одно и то же значение: <span class="m">c₁x₁ + c₂x₂ = C</span>. Это прямая, перпендикулярная градиенту.</p><p>При увеличении C линия сдвигается параллельно самой себе по направлению градиента. Пока она пересекает допустимое множество, значение C достижимо.</p>',
    ],
    en: [
      'Level line',
      'z = const',
      '<p>A level line is the set of points where the objective takes one value: <span class="m">c₁x₁ + c₂x₂ = C</span>. It is a line perpendicular to the gradient.</p><p>As C increases, the line shifts parallel to itself in the direction of the gradient. While it meets the feasible set, the value C is attainable.</p>',
    ],
  },
  {
    id: 'graphical',
    ru: [
      'Графический метод',
      'две переменные',
      '<p>Алгоритм для задачи с двумя переменными:</p><p>1. Строим прямые ограничений и выбираем полуплоскости — получаем допустимое множество.<br>2. Рисуем градиент <span class="m">∇z = (c₁; c₂)</span> и перпендикулярную ему линию уровня.<br>3. Для <b>максимума</b> двигаем линию уровня по направлению градиента до <b>последней</b> точки множества, для <b>минимума</b> — до <b>первой</b> (так в учебнике).<br>4. Находим координаты этой вершины, решая систему из уравнений двух прямых, и считаем z.</p><p>Если переменных больше двух, но ограничений два, графически решают двойственную задачу.</p>',
    ],
    en: [
      'Graphical method',
      'two variables',
      '<p>The algorithm for a problem with two variables:</p><p>1. Draw the constraint lines and choose the half-planes to get the feasible set.<br>2. Draw the gradient <span class="m">∇z = (c₁; c₂)</span> and a level line perpendicular to it.<br>3. For a <b>maximum</b> move the level line along the gradient up to the <b>last</b> point of the set; for a <b>minimum</b>, up to the <b>first</b> (as in the textbook).<br>4. Find the vertex coordinates by solving the system of the two lines, and compute z.</p><p>With more than two variables but two constraints, solve the dual graphically.</p>',
    ],
  },
  {
    id: 'vertex',
    ru: [
      'Почему оптимум в вершине',
      'перебор вершин',
      '<p>Линейная функция на многоугольнике достигает максимума и минимума в вершинах: двигая линию уровня, мы покидаем множество именно через вершину (или через целую сторону, если она параллельна линии уровня).</p><p>Поэтому ограниченную задачу можно проверить перебором: посчитать z во всех вершинах и выбрать лучшее. В блоке «Как решить» такая таблица приводится для проверки.</p>',
    ],
    en: [
      'Why the optimum is at a vertex',
      'trying all vertices',
      '<p>A linear function on a polygon attains its maximum and minimum at vertices: moving the level line, we leave the set through a vertex (or a whole side, if it is parallel to the level line).</p><p>So a bounded problem can be checked by brute force: compute z at every vertex and pick the best. The How to solve block gives such a table as a check.</p>',
    ],
  },
  {
    id: 'special',
    ru: [
      'Особые случаи',
      'нет решений, ∞, много решений',
      '<p><b>Нет допустимых точек:</b> полуплоскости не пересекаются, ограничения противоречат друг другу.</p><p><b>Целевая функция неограниченна:</b> множество не ограничено в сторону градиента (для max), линия уровня уходит в бесконечность. Решения нет.</p><p><b>Бесконечно много решений:</b> линия уровня параллельна стороне множества и в последний момент ложится на всю сторону — оптимален весь отрезок или луч.</p>',
    ],
    en: [
      'Special cases',
      'no solution, ∞, many solutions',
      '<p><b>No feasible points:</b> the half-planes don’t intersect; the constraints contradict each other.</p><p><b>Unbounded objective:</b> the set is unbounded in the gradient direction (for max), the level line escapes to infinity. No solution.</p><p><b>Infinitely many solutions:</b> the level line is parallel to a side and at the last moment lies along it, so the whole segment or ray is optimal.</p>',
    ],
  },
  {
    id: 'dual',
    ru: [
      'Двойственная задача',
      '§ 3.1, теневые цены',
      '<p>К производственной задаче <span class="m">(c, x) → max</span>, <span class="m">Ax ⩽ b</span>, <span class="m">x ⩾ 0</span> двойственная: <span class="m">(b, y) → min</span>, <span class="m">Aᵀy ⩾ c</span>, <span class="m">y ⩾ 0</span>.</p><p>Экономический смысл: фирма может не производить товары, а продать сырьё по ценам <span class="m">y</span>. Покупатель хочет заплатить как можно меньше, но так, чтобы сырьё на единицу каждого товара стоило не меньше цены товара. Числа <span class="m">yᵢ</span> называются <b>теневыми ценами</b> ресурсов.</p>',
    ],
    en: [
      'Dual problem',
      '§ 3.1, shadow prices',
      '<p>For the production problem <span class="m">(c, x) → max</span>, <span class="m">Ax ⩽ b</span>, <span class="m">x ⩾ 0</span> the dual is <span class="m">(b, y) → min</span>, <span class="m">Aᵀy ⩾ c</span>, <span class="m">y ⩾ 0</span>.</p><p>Economic meaning: instead of producing, the firm could sell its materials at prices <span class="m">y</span>. The buyer wants to pay as little as possible, but the materials for one unit of each good must cost at least the good’s price. The numbers <span class="m">yᵢ</span> are the <b>shadow prices</b> of resources.</p>',
    ],
  },
  {
    id: 'dualrule',
    ru: [
      'Правило выписывания двойственной',
      'общий вид, § 4.1',
      '<p>max меняется на min и наоборот; матрица ограничений транспонируется; коэффициенты целевой функции и правые части меняются местами.</p><p><b>Знаки двойственных переменных.</b> Для исходной задачи на max: ограничение ⩽ → <span class="m">y ⩾ 0</span>, ⩾ → <span class="m">y ⩽ 0</span>, = → y любого знака. На min — наоборот: ⩽ → <span class="m">y ⩽ 0</span>, ⩾ → <span class="m">y ⩾ 0</span>.</p><p><b>Знаки двойственных ограничений.</b> Если двойственная на min: <span class="m">x ⩾ 0</span> → ⩾, <span class="m">x ⩽ 0</span> → ⩽; на max: <span class="m">x ⩾ 0</span> → ⩽, <span class="m">x ⩽ 0</span> → ⩾. Переменная любого знака даёт равенство. Блок «Двойственная задача» показывает, какое правило сработало для каждой строки.</p>',
    ],
    en: [
      'Writing the dual',
      'general form, § 4.1',
      '<p>max becomes min and vice versa; the constraint matrix is transposed; objective coefficients and right-hand sides swap.</p><p><b>Signs of dual variables.</b> If the original is a max problem: ⩽ → <span class="m">y ⩾ 0</span>, ⩾ → <span class="m">y ⩽ 0</span>, = → y free. For min it is reversed: ⩽ → <span class="m">y ⩽ 0</span>, ⩾ → <span class="m">y ⩾ 0</span>.</p><p><b>Signs of dual constraints.</b> If the dual is a min problem: <span class="m">x ⩾ 0</span> → ⩾, <span class="m">x ⩽ 0</span> → ⩽; if max: <span class="m">x ⩾ 0</span> → ⩽, <span class="m">x ⩽ 0</span> → ⩾. A free variable gives an equality. The Dual block shows which rule fired for each line.</p>',
    ],
  },
  {
    id: 'kant1',
    ru: [
      'Первая теорема Канторовича',
      'теорема 1',
      '<p>Прямая задача имеет решение тогда и только тогда, когда допустимые множества прямой и двойственной задач непусты. Если допустимые x и y дают одинаковые значения <span class="m">(c, x) = (b, y)</span>, то обе точки оптимальны.</p><p>Если решение есть, то оптимальные значения прямой и двойственной задач совпадают. Это удобная проверка ответа: max прямой = min двойственной.</p>',
    ],
    en: [
      'Kantorovich’s first theorem',
      'Theorem 1',
      '<p>The primal has a solution if and only if the feasible sets of both the primal and the dual are non-empty. If feasible x and y give equal values <span class="m">(c, x) = (b, y)</span>, both are optimal.</p><p>If a solution exists, the optimal values of the primal and dual coincide. That is a handy check: primal max = dual min.</p>',
    ],
  },
  {
    id: 'kant2',
    ru: [
      'Дополняющая нежёсткость',
      'вторая теорема Канторовича',
      '<p>Допустимые x и y оптимальны тогда и только тогда, когда для каждой пары «переменная — ограничение» произведение равно нулю:</p><p><span class="m">xⱼ · (a₁ⱼy₁ + … + aₘⱼyₘ − cⱼ) = 0</span>, <span class="m">yᵢ · (aᵢ₁x₁ + … + aᵢₙxₙ − bᵢ) = 0</span>.</p><p>Смысл: если ограничение выполняется не впритык (есть запас), соответствующая переменная другой задачи равна нулю. И наоборот: если <span class="m">yᵢ ≠ 0</span>, ограничение i выполняется как равенство. Условия выписываются только для ограничений-неравенств.</p>',
    ],
    en: [
      'Complementary slackness',
      'Kantorovich’s second theorem',
      '<p>Feasible x and y are optimal if and only if for each pair “variable — constraint” the product is zero:</p><p><span class="m">xⱼ · (a₁ⱼy₁ + … + aₘⱼyₘ − cⱼ) = 0</span>, <span class="m">yᵢ · (aᵢ₁x₁ + … + aᵢₙxₙ − bᵢ) = 0</span>.</p><p>Meaning: if a constraint is not tight (there is slack), the matching variable of the other problem is zero. Conversely, if <span class="m">yᵢ ≠ 0</span>, constraint i holds as an equality. The conditions are written only for inequality constraints.</p>',
    ],
  },
  {
    id: 'csmethod',
    ru: [
      'Решение через двойственную',
      'как в § 3.2',
      '<p>Если в прямой задаче много переменных, но всего два ограничения, у двойственной две переменные. Тогда:</p><p>1. Выписываем двойственную и решаем её графически, находим точку M.<br>2. Смотрим, на каких прямых лежит M. Если M не лежит на прямой (j), то <span class="m">xⱼ = 0</span>.<br>3. Если <span class="m">yᵢ ≠ 0</span>, то ограничение i прямой задачи — равенство.<br>4. Решаем получившуюся систему и находим x. Проверяем: значения прямой и двойственной совпадают.</p><p>Если система имеет бесконечно много решений, условий не хватает — тогда помогает симплекс-метод.</p>',
    ],
    en: [
      'Solving via the dual',
      'as in § 3.2',
      '<p>If the primal has many variables but only two constraints, the dual has two variables. Then:</p><p>1. Write the dual and solve it graphically to find the point M.<br>2. See which lines M lies on. If M is not on line (j), then <span class="m">xⱼ = 0</span>.<br>3. If <span class="m">yᵢ ≠ 0</span>, primal constraint i is an equality.<br>4. Solve the resulting system for x. Check that the primal and dual values coincide.</p><p>If the system has infinitely many solutions, the conditions aren’t enough, and the simplex method helps.</p>',
    ],
  },
  {
    id: 'excel',
    ru: [
      'Термины Excel',
      'окончательные значения, теневые цены, допуски',
      '<p>Так называются числа из отчёта «Поиска решения» (определение 4):</p><p><b>Окончательные значения</b> — оптимальные <span class="m">x₁, …, xₙ</span>.<br><b>Теневые цены</b> — оптимальные двойственные переменные <span class="m">y₁, …, yₘ</span>: на сколько вырастет оптимум, если ресурс i увеличить на единицу.<br><b>Допуски</b> — запасы в ограничениях, <span class="m">bᵢ − (aᵢ, x)</span>.<br><b>Приведённые стоимости</b> — остатки двойственных ограничений: насколько товар j «недоплачивает», чтобы его стало выгодно выпускать.</p>',
    ],
    en: [
      'Excel terms',
      'final values, shadow prices, slacks',
      '<p>These are the numbers in the Solver report (Definition 4):</p><p><b>Final values</b> are the optimal <span class="m">x₁, …, xₙ</span>.<br><b>Shadow prices</b> are the optimal dual variables <span class="m">y₁, …, yₘ</span>: how much the optimum grows if resource i increases by one.<br><b>Slacks</b> are the spare amounts in constraints, <span class="m">bᵢ − (aᵢ, x)</span>.<br><b>Reduced costs</b> are the residuals of the dual constraints: how much good j falls short of being worth producing.</p>',
    ],
  },
  {
    id: 'reduce',
    ru: [
      'Сведение к производственной задаче',
      'теорема 3',
      '<p>Любую задачу можно переписать в форме производственной: неравенство ⩾ умножаем на −1; равенство заменяем двумя неравенствами ⩽ и ⩾; переменную любого знака записываем разностью двух неотрицательных <span class="m">x = y − z</span>; минимум <span class="m">z → min</span> заменяем на <span class="m">−z → max</span>.</p><p>На практике удобнее сразу перейти к симплексной форме: добавить допуски и умножить строки с отрицательной правой частью на −1, как в примерах § 5.3–5.4.</p>',
    ],
    en: [
      'Reducing to a production problem',
      'Theorem 3',
      '<p>Any problem can be rewritten as a production problem: multiply a ⩾ inequality by −1; replace an equality with two inequalities ⩽ and ⩾; write a free variable as a difference of two non-negatives <span class="m">x = y − z</span>; replace <span class="m">z → min</span> with <span class="m">−z → max</span>.</p><p>In practice it is easier to go straight to simplex form: add slacks and multiply rows with a negative right-hand side by −1, as in the examples of § 5.3–5.4.</p>',
    ],
  },
  {
    id: 'simplexform',
    ru: [
      'Симплексная форма и допуски',
      'определение 5',
      '<p>Каждое неравенство превращаем в равенство, добавляя неотрицательную переменную — <b>допуск</b>: к ⩽ прибавляем, из ⩾ вычитаем. Например, <span class="m">x₁ + 2x₂ ⩽ 1</span> становится <span class="m">x₁ + 2x₂ + x₄ = 1</span>, <span class="m">x₄ ⩾ 0</span>.</p><p>Затем добиваемся, чтобы все правые части были неотрицательны (умножая строки на −1). Важно, чтобы ранг матрицы был максимальным, иначе единичной матрицы не построить.</p>',
    ],
    en: [
      'Simplex form and slacks',
      'Definition 5',
      '<p>Each inequality becomes an equality by adding a non-negative variable, a <b>slack</b>: added to ⩽, subtracted from ⩾. For example, <span class="m">x₁ + 2x₂ ⩽ 1</span> becomes <span class="m">x₁ + 2x₂ + x₄ = 1</span>, <span class="m">x₄ ⩾ 0</span>.</p><p>Then make all right-hand sides non-negative (multiplying rows by −1). The matrix rank must be maximal, otherwise the identity matrix can’t be built.</p>',
    ],
  },
  {
    id: 'tableau',
    ru: [
      'Симплекс-таблица',
      'большой блок, нижняя строка',
      '<p>Строки таблицы — ограничения: коэффициенты (это «большой блок») и правая часть b. Нижняя строка — коэффициенты целевой функции с обратным знаком, а в углу — её значение.</p><p>Сначала в большом блоке создают <b>единичную матрицу</b> m × m: переменные над её столбцами — базисные, они равны правым частям, остальные — нулю. Это вершина допустимого множества. Каждый шаг метода Гаусса переводит к соседней вершине.</p>',
    ],
    en: [
      'Simplex tableau',
      'main block, bottom row',
      '<p>Rows are constraints: coefficients (the “main block”) and the right-hand side b. The bottom row holds the objective coefficients with the opposite sign, and the corner holds its value.</p><p>First an <b>identity matrix</b> m × m is built in the main block: variables above its columns are basic and equal the right-hand sides; the others are zero. That is a vertex of the feasible set. Each Gaussian step moves to a neighbouring vertex.</p>',
    ],
  },
  {
    id: 'pivot',
    ru: [
      'Разрешающий элемент',
      'правило минимального отношения',
      '<p>Выбрав столбец r, смотрим на его положительные элементы и для каждого считаем отношение <span class="m">bⱼ / aⱼᵣ</span>. Разрешающий элемент — тот, где отношение минимально. Это гарантирует, что правые части останутся неотрицательными, то есть мы не выйдем из допустимого множества.</p><p>Строку разрешающего элемента делим на него, а остальные элементы столбца обнуляем методом Гаусса — вычитая кратные этой строки.</p>',
    ],
    en: [
      'Pivot element',
      'minimum ratio rule',
      '<p>Having chosen column r, look at its positive entries and compute <span class="m">bⱼ / aⱼᵣ</span> for each. The pivot is where the ratio is smallest. This keeps the right-hand sides non-negative, so we don’t leave the feasible set.</p><p>Divide the pivot row by the pivot and clear the other entries of the column by Gaussian elimination, subtracting multiples of that row.</p>',
    ],
  },
  {
    id: 'optimality',
    ru: [
      'Условие оптимальности',
      'теорема 4',
      '<p>Если после построения единичной матрицы в нижней строке нет отрицательных чисел, решение оптимально: базисные переменные равны правым частям, максимум стоит в углу.</p><p>Иначе выбираем отрицательное число, наибольшее по модулю, — его столбец входит в базис. Если в этом столбце нет положительных элементов, целевая функция неограниченно растёт и максимума нет.</p><p>Если значение не растёт (вырожденный шаг), нужно следить, чтобы не вернуться к прежней таблице — иначе возможно зацикливание.</p>',
    ],
    en: [
      'Optimality condition',
      'Theorem 4',
      '<p>If, once the identity matrix is built, the bottom row has no negative numbers, the solution is optimal: basic variables equal the right-hand sides, and the maximum is in the corner.</p><p>Otherwise pick the negative number largest in absolute value; its column enters the basis. If that column has no positive entries, the objective grows without bound and there is no maximum.</p><p>If the value doesn’t increase (a degenerate step), make sure not to return to an earlier tableau, or cycling may occur.</p>',
    ],
  },
  {
    id: 'uniqueness',
    ru: [
      'Единственность решения',
      'теорема 5',
      '<p>Если в оптимальной таблице нули нижней строки стоят только под базисными переменными, решение единственно.</p><p>В терминах Excel: каждому нулевому окончательному значению соответствует ненулевая приведённая стоимость, а каждому нулевому допуску — ненулевая теневая цена.</p><p>Если условие не выполняется, решений может быть много — их ищут по § 5.5.</p>',
    ],
    en: [
      'Uniqueness of the solution',
      'Theorem 5',
      '<p>If in the optimal tableau the zeros of the bottom row stand only under basic variables, the solution is unique.</p><p>In Excel terms: every zero final value has a non-zero reduced cost, and every zero slack has a non-zero shadow price.</p><p>If the condition fails, there may be many solutions; they are found as in § 5.5.</p>',
    ],
  },
  {
    id: 'allsol',
    ru: [
      'Поиск всех решений',
      '§ 5.5, теорема 6',
      '<p>Смотрим на каждый ноль нижней строки под небазисной переменной. Если в его столбце есть положительный элемент, делаем шаг метода Гаусса: значение не изменится, а вершина может оказаться новой. Пробуем все такие элементы (при равных отношениях — каждый).</p><p>Если в столбце все элементы ⩽ 0, переменная может расти бесконечно — получается <b>луч</b> решений: базисные переменные выражаем через неё.</p><p>Итог: все решения — выпуклые комбинации оптимальных вершин плюс неотрицательные кратные лучей: <span class="m">X = α₁X₁ + … + αᵣXᵣ + t·d</span>.</p>',
    ],
    en: [
      'Finding all solutions',
      '§ 5.5, Theorem 6',
      '<p>Look at each zero of the bottom row under a non-basic variable. If its column has a positive entry, take a Gaussian step: the value won’t change, but the vertex may be new. Try every such entry (each one when ratios tie).</p><p>If all entries in the column are ⩽ 0, the variable can grow without bound, giving a <b>ray</b> of solutions: express the basic variables through it.</p><p>Result: all solutions are convex combinations of optimal vertices plus non-negative multiples of rays: <span class="m">X = α₁X₁ + … + αᵣXᵣ + t·d</span>.</p>',
    ],
  },
  {
    id: 'integer',
    ru: [
      'Целочисленная оптимизация',
      '§ 5.6',
      '<p>Если переменные обязаны быть целыми, сначала решают задачу без этого требования. Если среди её решений есть целое — оно и ответ.</p><p>Иначе требование целочисленности существенно, и задача трудная. В учебнике её решают компьютером (Excel, lpsolve), добавляя ограничения вроде <span class="m">x₁ ⩽ 2</span> или <span class="m">x₁ ⩾ 4</span>, чтобы проверить, нет ли других решений. Здесь для двух переменных перебираются все целые точки множества — видно и оптимум, и все равноценные точки.</p>',
    ],
    en: [
      'Integer optimization',
      '§ 5.6',
      '<p>If variables must be integers, first solve the problem without that requirement. If one of its solutions is an integer point, it is the answer.</p><p>Otherwise integrality matters, and the problem is hard. The textbook uses a computer (Excel, lpsolve), adding constraints like <span class="m">x₁ ⩽ 2</span> or <span class="m">x₁ ⩾ 4</span> to check for other solutions. Here, for two variables, all integer points of the set are tried, so you see the optimum and all equally good points.</p>',
    ],
  },
  {
    id: 'stability',
    ru: [
      'Устойчивость',
      'интервалы для cⱼ, § 5.7.2',
      '<p>Насколько можно менять коэффициент целевой функции <span class="m">cⱼ</span>, чтобы оптимальное решение (его структура) не изменилось? Ответ — интервал <span class="m">(Aⱼ, Bⱼ)</span>.</p><p>Для небазисной переменной (в задаче на max): <span class="m">Aⱼ = −∞</span>, <span class="m">Bⱼ = cⱼ + c̃ⱼ</span>. Для базисной: <span class="m">Aⱼ = cⱼ + max(−c̃ₖ/γ)</span> по положительным γ её строки, <span class="m">Bⱼ = cⱼ + min(−c̃ₖ/γ)</span> по отрицательным. Геометрически: пока градиент поворачивается в этих пределах, оптимальная вершина та же.</p>',
    ],
    en: [
      'Stability',
      'ranges for cⱼ, § 5.7.2',
      '<p>How much can an objective coefficient <span class="m">cⱼ</span> change without changing the optimal solution’s structure? The answer is a range <span class="m">(Aⱼ, Bⱼ)</span>.</p><p>For a non-basic variable (max problem): <span class="m">Aⱼ = −∞</span>, <span class="m">Bⱼ = cⱼ + c̃ⱼ</span>. For a basic one: <span class="m">Aⱼ = cⱼ + max(−c̃ₖ/γ)</span> over positive γ in its row, <span class="m">Bⱼ = cⱼ + min(−c̃ₖ/γ)</span> over negative ones. Geometrically: while the gradient turns within these limits, the optimal vertex stays the same.</p>',
    ],
  },
  {
    id: 'sensitivity',
    ru: [
      'Чувствительность',
      'интервалы для bᵢ, § 5.7.3',
      '<p>Насколько можно менять запас ресурса <span class="m">bᵢ</span>, чтобы структура решения (какие переменные положительны) не изменилась? Ответ — интервал <span class="m">(Cᵢ, Dᵢ)</span>.</p><p>Если ресурс в избытке (допуск базисный, теневая цена 0): <span class="m">Cᵢ = bᵢ − допуск</span>, <span class="m">Dᵢ = +∞</span>. Если ресурс дефицитный: интервал находится по столбцу его допуска в оптимальной таблице. Внутри интервала оптимум меняется на теневую цену за каждую единицу ресурса.</p>',
    ],
    en: [
      'Sensitivity',
      'ranges for bᵢ, § 5.7.3',
      '<p>How much can a resource stock <span class="m">bᵢ</span> change without changing the structure of the solution (which variables are positive)? The answer is a range <span class="m">(Cᵢ, Dᵢ)</span>.</p><p>If the resource is in surplus (the slack is basic, shadow price 0): <span class="m">Cᵢ = bᵢ − slack</span>, <span class="m">Dᵢ = +∞</span>. If it is scarce, the range comes from its slack column in the optimal tableau. Inside the range the optimum changes by the shadow price per unit of resource.</p>',
    ],
  },
  {
    id: 'nash',
    ru: [
      'Равновесие Нэша',
      'глава 6',
      '<p>Набор стратегий, от которого ни одному игроку невыгодно отклоняться в одиночку. Ищут через функции наилучшего ответа: для каждого игрока находят максимум его выигрыша при фиксированных стратегиях других (часто — приравнивая производную к нулю), затем решают систему.</p><p>Пример из учебника: в модели Курно с N фирмами равновесный выпуск каждой <span class="m">(M − c)/(N + 1)</span>.</p>',
    ],
    en: [
      'Nash equilibrium',
      'Chapter 6',
      '<p>A profile of strategies from which no player gains by deviating alone. Found via best-response functions: for each player maximize the payoff with others fixed (often by setting a derivative to zero), then solve the system.</p><p>Textbook example: in the Cournot model with N firms each equilibrium output is <span class="m">(M − c)/(N + 1)</span>.</p>',
    ],
  },
  {
    id: 'bargain',
    ru: [
      'Задача торга',
      'решения Нэша и Калаи–Смородинского, глава 7',
      '<p>Два игрока выбирают точку из множества M возможных выигрышей; d — что они получат, не договорившись.</p><p><b>Решение Нэша</b> — точка максимума <span class="m">(m₁ − d₁)(m₂ − d₂)</span> на M: тоже задача оптимизации, её решают линиями уровня этой функции (гиперболами). <b>Решение Калаи–Смородинского</b> — точка Парето-границы на отрезке от d к «идеальной» точке.</p>',
    ],
    en: [
      'Bargaining problem',
      'Nash and Kalai–Smorodinsky solutions, Chapter 7',
      '<p>Two players choose a point from a set M of possible payoffs; d is what they get without agreement.</p><p>The <b>Nash solution</b> maximizes <span class="m">(m₁ − d₁)(m₂ − d₂)</span> over M, again an optimization problem solved with level curves (hyperbolas). The <b>Kalai–Smorodinsky solution</b> is the Pareto-frontier point on the segment from d to the “ideal” point.</p>',
    ],
  },
  {
    id: 'shapley',
    ru: [
      'Ядро и вектор Шепли',
      'кооперативные игры, глава 8',
      '<p>В кооперативной игре коалиции получают выигрыш <span class="m">v(K)</span>, и его нужно поделить. <b>Ядро</b> — дележи, при которых ни одной коалиции невыгодно отделиться: система линейных неравенств, то есть снова допустимое множество.</p><p><b>Вектор Шепли</b> — средний вклад игрока по всем порядкам присоединения. <b>Преднуклеолус</b> находят последовательностью задач линейной оптимизации (алгоритм Машлера–Пелега–Шепли).</p>',
    ],
    en: [
      'Core and Shapley value',
      'cooperative games, Chapter 8',
      '<p>In a cooperative game coalitions earn <span class="m">v(K)</span>, which must be shared. The <b>core</b> is the set of allocations no coalition wants to leave: a system of linear inequalities, again a feasible set.</p><p>The <b>Shapley value</b> is a player’s average contribution over all joining orders. The <b>prenucleolus</b> is found by a sequence of linear optimization problems (the Maschler–Peleg–Shapley algorithm).</p>',
    ],
  },
];
export const FORMAL = {
  kant1: {
    ru: '<p><b>Теорема 1.</b> Для задач <span class="m">(c, x) → max, Ax ⩽ b, x ⩾ 0</span> и <span class="m">(b, y) → min, Aᵀy ⩾ c, y ⩾ 0</span>:</p><p>1) прямая имеет решение ⇔ допустимые множества обеих задач непусты;<br>2) если допустимые x, y таковы, что <span class="m">(c, x) = (b, y)</span>, то x и y — решения;<br>3) если x — решение прямой, то двойственная имеет решение y и <span class="m">(c, x) = (b, y)</span>.</p><p>Ключевой факт: для любых допустимых x, y верно <span class="m">(c, x) ⩽ (Aᵀy, x) = (y, Ax) ⩽ (b, y)</span> — слабая двойственность.</p>',
    en: '<p><b>Theorem 1.</b> For <span class="m">(c, x) → max, Ax ⩽ b, x ⩾ 0</span> and <span class="m">(b, y) → min, Aᵀy ⩾ c, y ⩾ 0</span>:</p><p>1) the primal has a solution ⇔ both feasible sets are non-empty;<br>2) if feasible x, y satisfy <span class="m">(c, x) = (b, y)</span>, they are solutions;<br>3) if x solves the primal, the dual has a solution y and <span class="m">(c, x) = (b, y)</span>.</p><p>The key fact: for any feasible x, y, <span class="m">(c, x) ⩽ (Aᵀy, x) = (y, Ax) ⩽ (b, y)</span>, weak duality.</p>',
  },
  kant2: {
    ru: '<p><b>Теорема 2.</b> Допустимые x и y — решения прямой и двойственной задач тогда и только тогда, когда для всех j, i:</p><p><span class="m">xⱼ(a₁ⱼy₁ + … + aₘⱼyₘ − cⱼ) = 0</span>, <span class="m">yᵢ(aᵢ₁x₁ + … + aᵢₙxₙ − bᵢ) = 0</span>.</p><p>Обозначив допуски <span class="m">xₙ₊ᵢ</span> и приведённые стоимости <span class="m">yₘ₊ⱼ</span>, получаем <span class="m">xⱼyₘ₊ⱼ = 0</span>, <span class="m">yᵢxₙ₊ᵢ = 0</span>.</p><p><b>Пример § 3.2.</b> Двойственная даёт M = (2,5; 3), M не на прямой (1) ⇒ x₁ = 0; y₁, y₂ &gt; 0 ⇒ оба ограничения прямой — равенства: 2x₂ = 1, −x₂ + x₃ = 2 ⇒ x = (0; 0,5; 2,5), max = 8,5.</p>',
    en: '<p><b>Theorem 2.</b> Feasible x and y solve the primal and dual if and only if for all j, i:</p><p><span class="m">xⱼ(a₁ⱼy₁ + … + aₘⱼyₘ − cⱼ) = 0</span>, <span class="m">yᵢ(aᵢ₁x₁ + … + aᵢₙxₙ − bᵢ) = 0</span>.</p><p>With slacks <span class="m">xₙ₊ᵢ</span> and reduced costs <span class="m">yₘ₊ⱼ</span>: <span class="m">xⱼyₘ₊ⱼ = 0</span>, <span class="m">yᵢxₙ₊ᵢ = 0</span>.</p><p><b>Example § 3.2.</b> The dual gives M = (2.5; 3), M is not on line (1) ⇒ x₁ = 0; y₁, y₂ &gt; 0 ⇒ both primal constraints are equalities: 2x₂ = 1, −x₂ + x₃ = 2 ⇒ x = (0; 0.5; 2.5), max = 8.5.</p>',
  },
  optimality: {
    ru: '<p><b>Теорема 4.</b> Пусть в симплекс-таблице создана единичная матрица m × m, нижняя строка <span class="m">c̃₁, …, c̃ₙ₊ₘ</span>, в углу M. Если все <span class="m">c̃ⱼ ⩾ 0</span>, найдено оптимальное решение: базисные переменные равны правым частям, остальные нули, максимум равен M.</p><p>Иначе выбирают <span class="m">c̃ᵣ &lt; 0</span>, наибольшее по модулю. Если все <span class="m">ãᵢᵣ ⩽ 0</span>, максимума нет. Иначе разрешающий элемент — тот <span class="m">ãₛᵣ &gt; 0</span>, где минимально <span class="m">b̃ₛ/ãₛᵣ</span>.</p>',
    en: '<p><b>Theorem 4.</b> Suppose the tableau has an m × m identity matrix, bottom row <span class="m">c̃₁, …, c̃ₙ₊ₘ</span> and corner M. If all <span class="m">c̃ⱼ ⩾ 0</span>, the solution is optimal: basic variables equal the right-hand sides, others are zero, the maximum is M.</p><p>Otherwise pick <span class="m">c̃ᵣ &lt; 0</span> largest in absolute value. If all <span class="m">ãᵢᵣ ⩽ 0</span>, there is no maximum. Otherwise the pivot is the <span class="m">ãₛᵣ &gt; 0</span> with the smallest <span class="m">b̃ₛ/ãₛᵣ</span>.</p>',
  },
  allsol: {
    ru: '<p><b>Теорема 6.</b> Пусть <span class="m">X₁, …, Xᵣ</span> — все оптимальные вершины и над каждым нулём нижней строки в столбце небазисной переменной есть положительный элемент. Тогда X оптимально ⇔ <span class="m">X = α₁X₁ + … + αᵣXᵣ</span>, <span class="m">αᵢ ∈ [0, 1]</span>, <span class="m">Σαᵢ = 1</span>.</p><p><b>Пример § 5.5.2.</b> Столбец x₂ с нулём внизу содержит только отрицательные элементы ⇒ луч: <span class="m">x = (1/3; 0; 5/3) + α(1/3; 1; 2/3)</span>, α ⩾ 0, max = −2.</p>',
    en: '<p><b>Theorem 6.</b> Let <span class="m">X₁, …, Xᵣ</span> be all optimal vertices, and suppose every zero of the bottom row under a non-basic variable has a positive entry above it. Then X is optimal ⇔ <span class="m">X = α₁X₁ + … + αᵣXᵣ</span>, <span class="m">αᵢ ∈ [0, 1]</span>, <span class="m">Σαᵢ = 1</span>.</p><p><b>Example § 5.5.2.</b> Column x₂ with a zero at the bottom has only negative entries ⇒ a ray: <span class="m">x = (1/3; 0; 5/3) + α(1/3; 1; 2/3)</span>, α ⩾ 0, max = −2.</p>',
  },
  dualrule: {
    ru: '<p><b>Пример 1 (§ 4.1).</b> <span class="m">4x₁ + x₂ → min</span>; <span class="m">3x₁ + x₂ = 3</span>, <span class="m">4x₁ + 3x₂ ⩾ 6</span>, <span class="m">x₁ + 2x₂ ⩽ 4</span>, <span class="m">x ⩾ 0</span>.</p><p>Равенство ⇒ y₁ любого знака; ⩾ при min ⇒ y₂ ⩾ 0; ⩽ при min ⇒ y₃ ⩽ 0. x ⩾ 0, двойственная на max ⇒ ограничения ⩽:</p><p><span class="m">3y₁ + 6y₂ + 4y₃ → max</span>; <span class="m">3y₁ + 4y₂ + y₃ ⩽ 4</span>, <span class="m">y₁ + 3y₂ + 2y₃ ⩽ 1</span>, <span class="m">y₂ ⩾ 0, y₃ ⩽ 0</span>.</p>',
    en: '<p><b>Example 1 (§ 4.1).</b> <span class="m">4x₁ + x₂ → min</span>; <span class="m">3x₁ + x₂ = 3</span>, <span class="m">4x₁ + 3x₂ ⩾ 6</span>, <span class="m">x₁ + 2x₂ ⩽ 4</span>, <span class="m">x ⩾ 0</span>.</p><p>Equality ⇒ y₁ free; ⩾ with min ⇒ y₂ ⩾ 0; ⩽ with min ⇒ y₃ ⩽ 0. x ⩾ 0 and the dual is max ⇒ constraints ⩽:</p><p><span class="m">3y₁ + 6y₂ + 4y₃ → max</span>; <span class="m">3y₁ + 4y₂ + y₃ ⩽ 4</span>, <span class="m">y₁ + 3y₂ + 2y₃ ⩽ 1</span>, <span class="m">y₂ ⩾ 0, y₃ ⩽ 0</span>.</p>',
  },
  sensitivity: {
    ru: '<p><b>Формулы § 5.7.3.</b> Если <span class="m">yᵢ</span> соответствует базисному допуску <span class="m">xₙ₊ᵢ</span>: для ⩽ <span class="m">Cᵢ = bᵢ − xₙ₊ᵢ</span>, <span class="m">Dᵢ = +∞</span>. Если небазисному: <span class="m">Cᵢ = bᵢ + max(−x̃ⱼ/πⱼᵢ)</span> по <span class="m">πⱼᵢ &gt; 0</span>, <span class="m">Dᵢ = bᵢ + min(−x̃ⱼ/πⱼᵢ)</span> по <span class="m">πⱼᵢ &lt; 0</span>, где π — столбец допуска в оптимальной таблице, x̃ — правые части.</p><p>Замечание 15: при вырождении (нулевые правые части) интервалы могут быть уже настоящих.</p>',
    en: '<p><b>Formulas of § 5.7.3.</b> If <span class="m">yᵢ</span> matches a basic slack <span class="m">xₙ₊ᵢ</span>: for ⩽ <span class="m">Cᵢ = bᵢ − xₙ₊ᵢ</span>, <span class="m">Dᵢ = +∞</span>. If non-basic: <span class="m">Cᵢ = bᵢ + max(−x̃ⱼ/πⱼᵢ)</span> over <span class="m">πⱼᵢ &gt; 0</span>, <span class="m">Dᵢ = bᵢ + min(−x̃ⱼ/πⱼᵢ)</span> over <span class="m">πⱼᵢ &lt; 0</span>, where π is the slack column of the optimal tableau and x̃ the right-hand sides.</p><p>Remark 15: under degeneracy (zero right-hand sides) the ranges may be narrower than the true ones.</p>',
  },
};
export const REL = {
  lp: ['feasible', 'production'],
  production: ['dual', 'reduce', 'excel'],
  transport: ['simplexform', 'lp'],
  cutting: ['integer'],
  binary: ['integer'],
  feasible: ['graphical', 'special'],
  gradient: ['level', 'graphical'],
  level: ['gradient', 'graphical'],
  graphical: ['vertex', 'special', 'csmethod'],
  vertex: ['graphical', 'tableau'],
  special: ['optimality', 'allsol'],
  dual: ['dualrule', 'kant1', 'excel'],
  dualrule: ['dual', 'kant2'],
  kant1: ['kant2', 'dual'],
  kant2: ['csmethod', 'excel'],
  csmethod: ['kant2', 'graphical'],
  excel: ['stability', 'sensitivity', 'dual'],
  reduce: ['simplexform', 'production'],
  simplexform: ['tableau', 'reduce'],
  tableau: ['pivot', 'optimality'],
  pivot: ['tableau', 'optimality'],
  optimality: ['uniqueness', 'pivot'],
  uniqueness: ['allsol', 'excel'],
  allsol: ['uniqueness', 'special'],
  integer: ['binary', 'cutting'],
  stability: ['sensitivity', 'gradient'],
  sensitivity: ['stability', 'excel'],
  nash: ['bargain'],
  bargain: ['nash', 'shapley'],
  shapley: ['bargain', 'feasible'],
};
export const CHAP = [
  {
    ru: 'Постановка задач',
    en: 'Setting up problems',
    ids: ['lp', 'production', 'transport', 'cutting', 'binary'],
  },
  {
    ru: 'Графический метод',
    en: 'Graphical method',
    ids: ['feasible', 'gradient', 'level', 'graphical', 'vertex', 'special'],
  },
  { ru: 'Двойственность', en: 'Duality', ids: ['dual', 'dualrule', 'kant1', 'kant2', 'csmethod', 'excel'] },
  {
    ru: 'Симплекс-метод',
    en: 'Simplex method',
    ids: ['reduce', 'simplexform', 'tableau', 'pivot', 'optimality', 'uniqueness', 'allsol', 'integer'],
  },
  { ru: 'Устойчивость', en: 'Stability', ids: ['stability', 'sensitivity'] },
  {
    ru: 'Дальше в учебнике: теория игр',
    en: 'Later in the textbook: game theory',
    extra: true,
    ids: ['nash', 'bargain', 'shapley'],
  },
];
export const DEMOS = {
  lp: { p: 'prod' },
  production: { p: 'car', panel: 'excel' },
  transport: { p: 'tr', panel: 'simplex' },
  cutting: { p: 'e56' },
  binary: { p: 'knap' },
  feasible: { p: 'prod', show: { gradient: false, level: false } },
  gradient: { p: 'prod' },
  level: { p: 'prod', play: true },
  graphical: { p: 'prod', play: true },
  vertex: { p: 'prod' },
  special: { p: 'seg' },
  dual: { p: 'e32', view: 'D', panel: 'dual' },
  dualrule: { p: 'e41', panel: 'dual' },
  kant1: { p: 'e32', view: 'D', panel: 'dual' },
  kant2: { p: 'e32', view: 'D' },
  csmethod: { p: 'e32', view: 'D', play: true },
  excel: { p: 'car', panel: 'excel' },
  reduce: { p: 'e54', panel: 'simplex' },
  simplexform: { p: 'e54', panel: 'simplex' },
  tableau: { p: 'e32', panel: 'simplex' },
  pivot: { p: 'e54', panel: 'simplex' },
  optimality: { p: 'e54', panel: 'simplex' },
  uniqueness: { p: 'e551', panel: 'simplex' },
  allsol: { p: 'e552', panel: 'simplex' },
  integer: { p: 'e56' },
  stability: { p: 'car', panel: 'excel' },
  sensitivity: { p: 'car', panel: 'excel' },
};
export const ILL = {
  feasible: {
    o: [24, 124],
    s: 22,
    it: [
      ['grid'],
      [
        'poly',
        [
          [0, 0],
          [3, 0],
          [3, 1],
          [1.5, 2.5],
          [0, 2],
        ],
        'reg',
        0.35,
      ],
      ['ln', 1, 1, 4, 'line'],
      ['ln', 1, 3, 6, 'line'],
      ['ln', 1, 0, 3, 'line'],
      ['T', 160, 24, 'Ax ⩽ b', 'axis', 12],
    ],
  },
  gradient: {
    o: [24, 124],
    s: 22,
    it: [
      ['grid'],
      [
        'poly',
        [
          [0, 0],
          [3, 0],
          [3, 1],
          [1.5, 2.5],
          [0, 2],
        ],
        'reg',
        0.3,
      ],
      ['arrow', 0, 0, 3, 2, 'grad'],
      ['t', 3.3, 2.4, '∇z', 'grad', 13],
    ],
  },
  level: {
    o: [24, 124],
    s: 22,
    it: [
      ['grid'],
      [
        'poly',
        [
          [0, 0],
          [3, 0],
          [3, 1],
          [1.5, 2.5],
          [0, 2],
        ],
        'reg',
        0.3,
      ],
      ['ln', 3, 2, 3, 'level', 1],
      ['ln', 3, 2, 7, 'level', 1],
      ['ln', 3, 2, 11, 'level', 1],
      ['arrow', 0, 0, 1.5, 1, 'grad'],
      ['T', 160, 24, 'z = C', 'level', 12],
    ],
  },
  graphical: {
    o: [24, 124],
    s: 22,
    it: [
      ['grid'],
      [
        'poly',
        [
          [0, 0],
          [3, 0],
          [3, 1],
          [1.5, 2.5],
          [0, 2],
        ],
        'reg',
        0.35,
      ],
      ['ln', 3, 2, 11, 'level', 1],
      ['arrow', 0, 0, 1.5, 1, 'grad'],
      ['pt', 3, 1, 'opt', 4.5],
      ['t', 3.4, 1.4, 'M', 'opt', 13],
    ],
  },
  special: {
    o: [24, 124],
    s: 22,
    it: [
      ['grid'],
      [
        'poly',
        [
          [0, 0],
          [3, 0],
          [3, 1],
          [1, 3],
          [0, 3],
        ],
        'reg',
        0.35,
      ],
      ['ln', 1, 1, 4, 'level', 1],
      ['raw', ''],
      ['T', 150, 24, '∞ решений', 'opt', 12],
    ],
  },
  dual: {
    o: [30, 118],
    s: 24,
    it: [
      ['grid'],
      [
        'poly',
        [
          [2.5, 3],
          [6, 3],
          [6, 5],
          [2.5, 5],
        ],
        'reg',
        0.3,
      ],
      ['ln', 2, -1, 2, 'line'],
      ['ln', 0, 1, 3, 'line'],
      ['ln', 1, 1, 1, 'line'],
      ['arrow', 0, 0, 1, 2, 'grad'],
      ['pt', 2.5, 3, 'opt', 4.5],
      ['t', 2.9, 3.5, 'M', 'opt', 13],
    ],
  },
  csmethod: {
    o: [30, 118],
    s: 24,
    it: [
      ['grid'],
      [
        'poly',
        [
          [2.5, 3],
          [6, 3],
          [6, 5],
          [2.5, 5],
        ],
        'reg',
        0.3,
      ],
      ['ln', 2, -1, 2, 'line'],
      ['ln', 0, 1, 3, 'line'],
      ['ln', 1, 1, 1, 'line'],
      ['pt', 2.5, 3, 'opt', 4.5],
      ['T', 140, 118, 'x₁ = 0', 'axis', 12],
    ],
  },
  tableau: {
    o: [0, 0],
    s: 1,
    it: [
      [
        'raw',
        '<g font-family="JetBrains Mono,monospace" font-size="11" fill="var(--s-axis)"><text x="22" y="34">x₁  x₂  x₃  x₄  │ b</text><text x="22" y="56">1   2   0   1   │ 1</text><text x="22" y="76">1  −1   1   0   │ 2</text><line x1="18" y1="84" x2="182" y2="84" stroke="var(--s-axis)" stroke-opacity=".5"/><text x="22" y="102">−1 −2  −3   0   │ 0</text></g><rect x="94" y="64" width="18" height="17" rx="3" fill="none" stroke="var(--s-opt)" stroke-width="2"/>',
      ],
    ],
  },
  allsol: {
    o: [24, 124],
    s: 22,
    it: [
      ['grid'],
      [
        'poly',
        [
          [0, 0],
          [4, 0],
          [4, 1],
          [1, 4],
          [0, 4],
        ],
        'reg',
        0.3,
      ],
      ['seg', 4, 1, 1, 4, 'opt', 4],
      ['pt', 4, 1, 'opt', 4],
      ['pt', 1, 4, 'opt', 4],
      ['T', 150, 24, 'αX₁ + (1−α)X₂', 'opt', 11],
    ],
  },
  integer: {
    o: [24, 124],
    s: 18,
    it: [
      ['grid'],
      [
        'poly',
        [
          [0, 5],
          [2, 2],
          [4, 1],
          [7, 0],
          [8, 0],
          [8, 5],
        ],
        'reg',
        0.25,
      ],
      ['ints', 0, 8, 0, 5, [[1, 1.5]]],
      ['pt', 1.5, 2.75, 'grad', 4],
      ['pt', 3, 2, 'opt', 5],
    ],
  },
  stability: {
    o: [24, 124],
    s: 22,
    it: [
      ['grid'],
      [
        'poly',
        [
          [0, 0],
          [3, 0],
          [3, 1],
          [1.5, 2.5],
          [0, 2],
        ],
        'reg',
        0.3,
      ],
      ['arrow', 0, 0, 1, 1, 'grad', 0.5],
      ['arrow', 0, 0, 2, 1, 'grad'],
      ['arrow', 0, 0, 1.6, 0.4, 'grad', 0.5],
      ['pt', 3, 1, 'opt', 4.5],
    ],
  },
};
