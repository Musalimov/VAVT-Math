export const TERMS = [
  {
    id: 'riemann',
    ru: [
      'Суммы Римана',
      'Riemann sum',
      '<p>Площадь под кривой трудно посчитать сразу, а площадь прямоугольника — легко. Поэтому отрезок [a, b] режут на n кусочков, над каждым ставят прямоугольник высотой f в какой-нибудь точке и складывают их площади.</p><p>Чем больше n, тем тоньше прямоугольники и тем точнее сумма. Предел этих сумм при n → ∞ и называется определённым интегралом. Нажмите «n → ∞» в блоке «Суммы Римана», чтобы увидеть, как сумма подходит к ответу.</p>',
    ],
    en: [
      'Riemann sums',
      'сумма Римана',
      '<p>The area under a curve is hard to find directly, but the area of a rectangle is easy. So the interval [a, b] is cut into n pieces, a rectangle with height f at some point is placed over each piece, and their areas are added up.</p><p>The larger n, the thinner the rectangles and the more accurate the sum. The limit of these sums as n → ∞ is the definite integral. Press “n → ∞” in the Riemann sums block to watch the sum approach the answer.</p>',
    ],
  },
  {
    id: 'definite',
    ru: [
      'Определённый интеграл',
      'definite integral',
      '<p>Число <span class="m">∫ₐᵇ f(x) dx</span> — ориентированная площадь между графиком f и осью x на отрезке от a до b. Знак ∫ — вытянутая буква S от слова «сумма», а dx напоминает о ширине бесконечно тонких полосок.</p><p>Ответ — это число, а не функция: он зависит от f, a и b, но не от того, какой буквой обозначена переменная. <span class="m">∫₀² x² dx</span> и <span class="m">∫₀² t² dt</span> — одно и то же.</p>',
    ],
    en: [
      'Definite integral',
      'определённый интеграл',
      '<p>The number <span class="m">∫ₐᵇ f(x) dx</span> is the signed area between the graph of f and the x-axis from a to b. The sign ∫ is a stretched S for “sum”, and dx reminds us of the width of infinitely thin strips.</p><p>The result is a number, not a function: it depends on f, a and b but not on the name of the variable. <span class="m">∫₀² x² dx</span> and <span class="m">∫₀² t² dt</span> are the same.</p>',
    ],
  },
  {
    id: 'signed',
    ru: [
      'Ориентированная площадь',
      'signed area',
      '<p>Интеграл считает площадь <b>со знаком</b>: части над осью x идут с «+», части под осью — с «−». Поэтому <span class="m">∫₀²ᵖ sin x dx = 0</span>: горб над осью и яма под ней одинаковы.</p><p>Если нужна обычная площадь фигуры, интегрируют модуль: <span class="m">∫|f(x)| dx</span>. В блоке «Значения» видны обе величины, а на сцене плюс и минус окрашены разными цветами.</p>',
    ],
    en: [
      'Signed area',
      'ориентированная площадь',
      '<p>The integral counts area <b>with a sign</b>: parts above the x-axis count as “+”, parts below as “−”. That is why <span class="m">∫₀²ᵖ sin x dx = 0</span>: the hump above the axis and the dip below are equal.</p><p>For the ordinary area of a region, integrate the absolute value: <span class="m">∫|f(x)| dx</span>. The Values block shows both, and the scene colors plus and minus differently.</p>',
    ],
  },
  {
    id: 'properties',
    ru: [
      'Свойства определённого интеграла',
      'properties',
      '<p><b>Линейность:</b> <span class="m">∫(αf + βg) = α∫f + β∫g</span>.</p><p><b>Аддитивность:</b> <span class="m">∫ₐᶜ f = ∫ₐᵇ f + ∫ᵇᶜ f</span> — площади соседних кусков складываются.</p><p><b>Перестановка пределов:</b> <span class="m">∫ᵇₐ f = −∫ₐᵇ f</span>, а <span class="m">∫ₐₐ f = 0</span>. Попробуйте кнопку «a ⇄ b».</p><p><b>Оценка:</b> если m ≤ f ≤ M на [a, b], то <span class="m">m(b − a) ≤ ∫ₐᵇ f ≤ M(b − a)</span>.</p>',
    ],
    en: [
      'Properties of the definite integral',
      'свойства интеграла',
      '<p><b>Linearity:</b> <span class="m">∫(αf + βg) = α∫f + β∫g</span>.</p><p><b>Additivity:</b> <span class="m">∫ₐᶜ f = ∫ₐᵇ f + ∫ᵇᶜ f</span>: areas of neighbouring pieces add up.</p><p><b>Swapping limits:</b> <span class="m">∫ᵇₐ f = −∫ₐᵇ f</span>, and <span class="m">∫ₐₐ f = 0</span>. Try the “a ⇄ b” button.</p><p><b>Bounds:</b> if m ≤ f ≤ M on [a, b], then <span class="m">m(b − a) ≤ ∫ₐᵇ f ≤ M(b − a)</span>.</p>',
    ],
  },
  {
    id: 'antideriv',
    ru: [
      'Первообразная',
      'antiderivative',
      '<p>Функция F — первообразная для f, если <span class="m">F′(x) = f(x)</span>. Это действие, обратное дифференцированию: для <span class="m">f = 2x</span> подходит <span class="m">F = x²</span>.</p><p>Первообразных бесконечно много: <span class="m">x² + 5</span> тоже годится, ведь производная константы — ноль. Все они отличаются на постоянную и получаются сдвигом одного графика вверх-вниз. Включите режим «Первообразная» и «Семейство F + C», чтобы это увидеть.</p>',
    ],
    en: [
      'Antiderivative',
      'первообразная',
      '<p>F is an antiderivative of f if <span class="m">F′(x) = f(x)</span>. It reverses differentiation: for <span class="m">f = 2x</span>, <span class="m">F = x²</span> works.</p><p>There are infinitely many antiderivatives: <span class="m">x² + 5</span> works too, since the derivative of a constant is zero. They all differ by a constant and are vertical shifts of one graph. Switch to Antiderivative mode and turn on “Family F + C” to see this.</p>',
    ],
  },
  {
    id: 'indefinite',
    ru: [
      'Неопределённый интеграл',
      'indefinite integral, +C',
      '<p>Запись <span class="m">∫f(x) dx = F(x) + C</span> обозначает сразу всё семейство первообразных. Буква C — произвольная постоянная; её нельзя забывать, иначе ответ неполон.</p><p>В отличие от определённого интеграла, это функция, а не число. Связь между ними даёт формула Ньютона–Лейбница: при подстановке пределов C сокращается.</p>',
    ],
    en: [
      'Indefinite integral',
      'неопределённый интеграл',
      '<p>The notation <span class="m">∫f(x) dx = F(x) + C</span> stands for the whole family of antiderivatives. C is an arbitrary constant; leaving it out makes the answer incomplete.</p><p>Unlike the definite integral, this is a function, not a number. The Newton–Leibniz formula connects the two: when you plug in the limits, C cancels.</p>',
    ],
  },
  {
    id: 'ftc',
    ru: [
      'Основная теорема анализа',
      'fundamental theorem, Newton–Leibniz',
      '<p>Две на вид разные задачи — найти площадь и найти первообразную — оказываются одной. Если накапливать площадь под f от a до x, получится функция <span class="m">F(x) = ∫ₐˣ f(t) dt</span>, и её скорость роста в каждой точке равна высоте графика: <span class="m">F′(x) = f(x)</span>.</p><p>Отсюда формула Ньютона–Лейбница: <span class="m">∫ₐᵇ f(x) dx = F(b) − F(a)</span> для любой первообразной F. Вместо предела сумм достаточно найти F и вычесть два числа.</p><p>В режиме «Первообразная» тяните точку x: наклон касательной к F совпадает со значением f.</p>',
    ],
    en: [
      'Fundamental theorem of calculus',
      'основная теорема анализа',
      '<p>Two seemingly different problems, finding an area and finding an antiderivative, turn out to be one. Accumulate the area under f from a to x and you get the function <span class="m">F(x) = ∫ₐˣ f(t) dt</span>; its rate of growth at each point equals the height of the graph: <span class="m">F′(x) = f(x)</span>.</p><p>This gives the Newton–Leibniz formula: <span class="m">∫ₐᵇ f(x) dx = F(b) − F(a)</span> for any antiderivative F. Instead of a limit of sums, find F and subtract two numbers.</p><p>In Antiderivative mode, drag the point x: the slope of the tangent to F matches the value of f.</p>',
    ],
  },
  {
    id: 'table',
    ru: [
      'Таблица интегралов',
      'table of integrals',
      '<p>Основные интегралы получаются чтением таблицы производных справа налево:</p><p><span class="m">∫xⁿ dx = xⁿ⁺¹/(n + 1)</span> при n ≠ −1, <span class="m">∫dx/x = ln|x|</span>, <span class="m">∫eˣ dx = eˣ</span>, <span class="m">∫aˣ dx = aˣ/ln a</span>, <span class="m">∫sin x dx = −cos x</span>, <span class="m">∫cos x dx = sin x</span>, <span class="m">∫dx/cos²x = tg x</span>, <span class="m">∫dx/(1 + x²) = arctg x</span>, <span class="m">∫dx/√(1 − x²) = arcsin x</span>, <span class="m">∫dx/√(x² ± a²) = ln|x + √(x² ± a²)|</span>.</p><p>Все методы интегрирования — это способы свести интеграл к одной из этих строк.</p>',
    ],
    en: [
      'Table of integrals',
      'таблица интегралов',
      '<p>The basic integrals come from reading the table of derivatives backwards:</p><p><span class="m">∫xⁿ dx = xⁿ⁺¹/(n + 1)</span> for n ≠ −1, <span class="m">∫dx/x = ln|x|</span>, <span class="m">∫eˣ dx = eˣ</span>, <span class="m">∫aˣ dx = aˣ/ln a</span>, <span class="m">∫sin x dx = −cos x</span>, <span class="m">∫cos x dx = sin x</span>, <span class="m">∫dx/cos²x = tan x</span>, <span class="m">∫dx/(1 + x²) = arctan x</span>, <span class="m">∫dx/√(1 − x²) = arcsin x</span>, <span class="m">∫dx/√(x² ± a²) = ln|x + √(x² ± a²)|</span>.</p><p>Every integration method is a way of reducing an integral to one of these lines.</p>',
    ],
  },
  {
    id: 'linearity',
    ru: [
      'Линейность и почленное интегрирование',
      'linearity',
      '<p>Интеграл суммы равен сумме интегралов, а постоянный множитель выносится: <span class="m">∫(3x² − 2x + 1) dx = 3∫x² dx − 2∫x dx + ∫dx = x³ − x² + x + C</span>.</p><p>Это первый шаг почти любого решения: раскрыть скобки, поделить почленно, вынести числа — и посмотреть, не стали ли кусочки табличными. Важно: интеграл произведения <b>не равен</b> произведению интегралов.</p>',
    ],
    en: [
      'Linearity and term-by-term integration',
      'линейность',
      '<p>The integral of a sum is the sum of the integrals, and a constant factor moves outside: <span class="m">∫(3x² − 2x + 1) dx = 3∫x² dx − 2∫x dx + ∫dx = x³ − x² + x + C</span>.</p><p>It is the first step of almost any solution: expand, divide term by term, move the numbers out, and check whether the pieces are now in the table. Note that the integral of a product is <b>not</b> the product of the integrals.</p>',
    ],
  },
  {
    id: 'linsub',
    ru: [
      'Линейная замена',
      'f(kx + b)',
      '<p>Если внутри табличной функции стоит линейное выражение <span class="m">kx + b</span>, интеграл берётся по таблице, а результат делится на k: <span class="m">∫f(kx + b) dx = F(kx + b)/k</span>.</p><p>Например, <span class="m">∫cos 3x dx = sin 3x / 3</span>, <span class="m">∫(2x + 1)³ dx = (2x + 1)⁴/8</span>. Деление на k компенсирует то, что при дифференцировании F(kx + b) появляется множитель k.</p>',
    ],
    en: [
      'Linear substitution',
      'f(kx + b)',
      '<p>If a table function has a linear expression <span class="m">kx + b</span> inside, use the table and divide by k: <span class="m">∫f(kx + b) dx = F(kx + b)/k</span>.</p><p>For example, <span class="m">∫cos 3x dx = sin 3x / 3</span>, <span class="m">∫(2x + 1)³ dx = (2x + 1)⁴/8</span>. Dividing by k cancels the factor k that appears when F(kx + b) is differentiated.</p>',
    ],
  },
  {
    id: 'usub',
    ru: [
      'Замена переменной',
      'u-substitution, подведение под дифференциал',
      '<p>Главный приём. Ищем внутри интеграла функцию <span class="m">g(x)</span>, производная которой стоит снаружи множителем. Обозначаем <span class="m">u = g(x)</span>, тогда <span class="m">du = g′(x) dx</span>, и интеграл переписывается через u.</p><p>Пример: в <span class="m">∫x·e^(x²) dx</span> внутри экспоненты стоит x², а x снаружи — почти её производная. <span class="m">u = x², du = 2x dx</span>: интеграл равен <span class="m">½∫eᵘ du = ½e^(x²) + C</span>.</p><p>Это правило дифференцирования сложной функции, прочитанное наоборот. Признак: «функция от чего-то, умноженная на производную этого чего-то».</p>',
    ],
    en: [
      'Substitution',
      'замена переменной',
      '<p>The key technique. Look inside the integral for a function <span class="m">g(x)</span> whose derivative is a factor outside. Set <span class="m">u = g(x)</span>, then <span class="m">du = g′(x) dx</span>, and rewrite the integral in u.</p><p>Example: in <span class="m">∫x·e^(x²) dx</span>, x² sits inside the exponential and x outside is almost its derivative. <span class="m">u = x², du = 2x dx</span>: the integral is <span class="m">½∫eᵘ du = ½e^(x²) + C</span>.</p><p>It is the chain rule read backwards. The tell: “a function of something, times the derivative of that something”.</p>',
    ],
  },
  {
    id: 'defsub',
    ru: [
      'Замена в определённом интеграле',
      'substitution with limits',
      '<p>При замене <span class="m">u = g(x)</span> в определённом интеграле можно сразу пересчитать пределы: <span class="m">∫ₐᵇ f(g(x))g′(x) dx = ∫ f(u) du</span> от <span class="m">g(a)</span> до <span class="m">g(b)</span>. Тогда возвращаться к x не нужно.</p><p>Пример: <span class="m">∫₀¹ x·e^(x²) dx</span>, u = x²: при x = 0 u = 0, при x = 1 u = 1, итого <span class="m">½∫₀¹ eᵘ du = (e − 1)/2</span>.</p><p>Замена должна быть монотонной и гладкой на отрезке, иначе пределы пересчитываются неверно.</p>',
    ],
    en: [
      'Substitution in a definite integral',
      'замена с пределами',
      '<p>When substituting <span class="m">u = g(x)</span> in a definite integral, you can convert the limits right away: <span class="m">∫ₐᵇ f(g(x))g′(x) dx = ∫ f(u) du</span> from <span class="m">g(a)</span> to <span class="m">g(b)</span>. Then there is no need to go back to x.</p><p>Example: <span class="m">∫₀¹ x·e^(x²) dx</span>, u = x²: x = 0 gives u = 0, x = 1 gives u = 1, so <span class="m">½∫₀¹ eᵘ du = (e − 1)/2</span>.</p><p>The substitution must be smooth and monotonic on the interval, otherwise the new limits are wrong.</p>',
    ],
  },
  {
    id: 'symmetry',
    ru: [
      'Чётность и симметричный отрезок',
      'odd and even functions',
      '<p>Если f нечётная, <span class="m">f(−x) = −f(x)</span>, то на отрезке [−a, a] площадь слева равна площади справа с обратным знаком, и <span class="m">∫₋ₐᵃ f dx = 0</span> — без вычислений.</p><p>Если f чётная, <span class="m">f(−x) = f(x)</span>, то <span class="m">∫₋ₐᵃ f dx = 2∫₀ᵃ f dx</span>. Это экономит время и защищает от ошибок в знаках.</p>',
    ],
    en: [
      'Odd and even functions on a symmetric interval',
      'чётность',
      '<p>If f is odd, <span class="m">f(−x) = −f(x)</span>, then on [−a, a] the area on the left equals the area on the right with the opposite sign, so <span class="m">∫₋ₐᵃ f dx = 0</span> with no computation.</p><p>If f is even, <span class="m">f(−x) = f(x)</span>, then <span class="m">∫₋ₐᵃ f dx = 2∫₀ᵃ f dx</span>. It saves time and protects against sign mistakes.</p>',
    ],
  },
  {
    id: 'check',
    ru: [
      'Проверка дифференцированием',
      'checking the answer',
      '<p>Любой неопределённый интеграл легко проверить: продифференцируйте ответ. Если получилась исходная функция, ответ верен.</p><p>Например, <span class="m">(x·eˣ − eˣ)′ = eˣ + x·eˣ − eˣ = x·eˣ</span>. Этот помощник проверяет так каждую найденную первообразную в двух десятках точек и показывает решение, только если проверка прошла.</p>',
    ],
    en: [
      'Checking by differentiation',
      'проверка',
      '<p>Any indefinite integral is easy to check: differentiate the answer. If you get the original function back, the answer is right.</p><p>For example, <span class="m">(x·eˣ − eˣ)′ = eˣ + x·eˣ − eˣ = x·eˣ</span>. This helper checks every antiderivative it finds this way at a couple dozen points and shows the solution only if the check passes.</p>',
    ],
  },
  {
    id: 'parts',
    ru: [
      'Интегрирование по частям',
      'integration by parts',
      '<p>Формула <span class="m">∫u dv = u·v − ∫v du</span> — правило производной произведения, прочитанное наоборот. Она меняет один интеграл на другой, и выгодно, когда новый проще.</p><p>Подходит для произведений, где один множитель упрощается при дифференцировании, а другой не усложняется при интегрировании: <span class="m">x·eˣ</span>, <span class="m">x·sin x</span>, <span class="m">x²·ln x</span>. Пример: <span class="m">u = x, dv = eˣ dx ⇒ ∫x·eˣ dx = x·eˣ − ∫eˣ dx = (x − 1)eˣ + C</span>.</p><p>Иногда приходится применять формулу несколько раз: для <span class="m">x²·eˣ</span> — дважды.</p>',
    ],
    en: [
      'Integration by parts',
      'интегрирование по частям',
      '<p>The formula <span class="m">∫u dv = u·v − ∫v du</span> is the product rule read backwards. It trades one integral for another and pays off when the new one is simpler.</p><p>It fits products where one factor simplifies when differentiated and the other doesn’t get worse when integrated: <span class="m">x·eˣ</span>, <span class="m">x·sin x</span>, <span class="m">x²·ln x</span>. Example: <span class="m">u = x, dv = eˣ dx ⇒ ∫x·eˣ dx = x·eˣ − ∫eˣ dx = (x − 1)eˣ + C</span>.</p><p>Sometimes the formula is applied several times: twice for <span class="m">x²·eˣ</span>.</p>',
    ],
  },
  {
    id: 'liate',
    ru: [
      'Как выбрать u: правило ЛОАСТ',
      'LIATE',
      '<p>За u берут множитель, который стоит раньше в списке: <b>Л</b>огарифмы, <b>О</b>братные тригонометрические (arctg, arcsin), <b>А</b>лгебраические (многочлены, степени x), <b>Т</b>ригонометрические, <b>Э</b>кспоненты. Остальное — dv.</p><p>Логика простая: ln x и arctg x при дифференцировании превращаются в дроби, многочлены понижают степень, а sin и eˣ почти не меняются при интегрировании. Поэтому в <span class="m">∫ln x dx</span> берут <span class="m">u = ln x</span>, <span class="m">dv = dx</span>.</p>',
    ],
    en: [
      'Choosing u: LIATE',
      'ЛОАСТ',
      '<p>Pick as u the factor that comes first in the list: <b>L</b>ogarithms, <b>I</b>nverse trig (arctan, arcsin), <b>A</b>lgebraic (polynomials, powers of x), <b>T</b>rigonometric, <b>E</b>xponentials. The rest is dv.</p><p>The logic: ln x and arctan x become fractions when differentiated, polynomials lose degree, while sin and eˣ barely change when integrated. So for <span class="m">∫ln x dx</span> take <span class="m">u = ln x</span>, <span class="m">dv = dx</span>.</p>',
    ],
  },
  {
    id: 'cyclic',
    ru: [
      'Циклическое интегрирование по частям',
      'returning integral',
      '<p>Для <span class="m">∫eᵃˣ sin bx dx</span> ни один множитель не упрощается. Но после двух интегрирований по частям снова появляется исходный интеграл I с другим коэффициентом: <span class="m">I = (выражение) − k·I</span>.</p><p>Это уравнение относительно I: переносим и делим на <span class="m">1 + k</span>. Получается <span class="m">∫eᵃˣ sin bx dx = eᵃˣ(a sin bx − b cos bx)/(a² + b²) + C</span>.</p>',
    ],
    en: [
      'Cyclic integration by parts',
      'возвращающийся интеграл',
      '<p>For <span class="m">∫eᵃˣ sin bx dx</span> neither factor simplifies. But after integrating by parts twice the original integral I reappears with a different coefficient: <span class="m">I = (expression) − k·I</span>.</p><p>That is an equation for I: move it over and divide by <span class="m">1 + k</span>. The result is <span class="m">∫eᵃˣ sin bx dx = eᵃˣ(a sin bx − b cos bx)/(a² + b²) + C</span>.</p>',
    ],
  },
  {
    id: 'polydiv',
    ru: [
      'Выделение целой части',
      'polynomial division',
      '<p>Если степень числителя не меньше степени знаменателя, дробь «неправильная». Сначала делим многочлены уголком: <span class="m">P/Q = S + R/Q</span>, где S — многочлен, а у остатка R степень уже меньше, чем у Q.</p><p>Пример: <span class="m">x/(x + 1) = 1 − 1/(x + 1)</span>, поэтому <span class="m">∫x/(x + 1) dx = x − ln|x + 1| + C</span>.</p>',
    ],
    en: [
      'Polynomial division',
      'выделение целой части',
      '<p>If the numerator’s degree is at least the denominator’s, the fraction is “improper”. First divide the polynomials: <span class="m">P/Q = S + R/Q</span>, where S is a polynomial and the remainder R has lower degree than Q.</p><p>Example: <span class="m">x/(x + 1) = 1 − 1/(x + 1)</span>, so <span class="m">∫x/(x + 1) dx = x − ln|x + 1| + C</span>.</p>',
    ],
  },
  {
    id: 'partial',
    ru: [
      'Разложение на простейшие дроби',
      'partial fractions',
      '<p>Правильную рациональную дробь раскладывают на сумму простых: каждому множителю знаменателя <span class="m">(x − r)</span> соответствует дробь <span class="m">A/(x − r)</span>, кратному <span class="m">(x − r)ᵏ</span> — дроби с <span class="m">(x − r)</span>, …, <span class="m">(x − r)ᵏ</span>, а квадратному без корней — <span class="m">(Bx + C)/(x² + px + q)</span>.</p><p>Пример: <span class="m">1/(x(x + 1)) = 1/x − 1/(x + 1)</span>. Каждая простая дробь интегрируется по таблице: логарифм, степень или арктангенс.</p><p>Коэффициенты находят, приводя к общему знаменателю, или подстановкой корня: <span class="m">A = P(r)/Q₁(r)</span>, где Q₁ — знаменатель без множителя (x − r).</p>',
    ],
    en: [
      'Partial fractions',
      'простейшие дроби',
      '<p>A proper rational function is split into simple fractions: each factor <span class="m">(x − r)</span> of the denominator gives <span class="m">A/(x − r)</span>, a repeated <span class="m">(x − r)ᵏ</span> gives fractions with <span class="m">(x − r)</span>, …, <span class="m">(x − r)ᵏ</span>, and a quadratic without real roots gives <span class="m">(Bx + C)/(x² + px + q)</span>.</p><p>Example: <span class="m">1/(x(x + 1)) = 1/x − 1/(x + 1)</span>. Each simple fraction is a table integral: a logarithm, a power or an arctangent.</p><p>Find the coefficients by clearing denominators or by plugging in a root: <span class="m">A = P(r)/Q₁(r)</span>, where Q₁ is the denominator without the factor (x − r).</p>',
    ],
  },
  {
    id: 'square',
    ru: [
      'Выделение полного квадрата',
      'completing the square',
      '<p>Квадратный трёхчлен без вещественных корней записывают как <span class="m">a((x + h)² + k²)</span>. После линейной замены <span class="m">u = x + h</span> получается табличный <span class="m">∫du/(u² + k²) = (1/k)·arctg(u/k)</span>.</p><p>Если в числителе есть x, сначала выделяют в нём производную знаменателя: эта часть даёт логарифм, остаток — арктангенс. Пример: <span class="m">∫(x + 3)/(x² + 2x + 5) dx = ½ln(x² + 2x + 5) + arctg((x + 1)/2) + C</span>.</p><p>Тот же приём нужен под корнем перед тригонометрической подстановкой.</p>',
    ],
    en: [
      'Completing the square',
      'полный квадрат',
      '<p>A quadratic without real roots is written as <span class="m">a((x + h)² + k²)</span>. After the linear substitution <span class="m">u = x + h</span> it becomes the table integral <span class="m">∫du/(u² + k²) = (1/k)·arctan(u/k)</span>.</p><p>If the numerator contains x, first split off the derivative of the denominator: that part gives a logarithm, the rest an arctangent. Example: <span class="m">∫(x + 3)/(x² + 2x + 5) dx = ½ln(x² + 2x + 5) + arctan((x + 1)/2) + C</span>.</p><p>The same trick is needed under a square root before a trig substitution.</p>',
    ],
  },
  {
    id: 'trigid',
    ru: [
      'Понижение степени',
      'power reduction',
      '<p>Чётные степени синуса и косинуса не берутся напрямую, но формулы двойного угла понижают степень: <span class="m">sin²x = (1 − cos 2x)/2</span>, <span class="m">cos²x = (1 + cos 2x)/2</span>, <span class="m">sin x cos x = ½ sin 2x</span>.</p><p>Пример: <span class="m">∫sin²x dx = x/2 − sin 2x / 4 + C</span>. Для четвёртой степени формулу применяют дважды. Похожий приём: <span class="m">tg²x = 1/cos²x − 1</span>.</p><p>Произведения с разными аргументами раскладывают в сумму: <span class="m">sin A cos B = ½(sin(A + B) + sin(A − B))</span>. Так <span class="m">∫sin x cos 3x dx = −cos 4x / 8 + cos 2x / 4 + C</span>.</p>',
    ],
    en: [
      'Power reduction',
      'понижение степени',
      '<p>Even powers of sine and cosine can’t be integrated directly, but double-angle formulas lower the power: <span class="m">sin²x = (1 − cos 2x)/2</span>, <span class="m">cos²x = (1 + cos 2x)/2</span>, <span class="m">sin x cos x = ½ sin 2x</span>.</p><p>Example: <span class="m">∫sin²x dx = x/2 − sin 2x / 4 + C</span>. For the fourth power the formula is applied twice. A similar trick: <span class="m">tan²x = 1/cos²x − 1</span>.</p><p>Products with different arguments become sums: <span class="m">sin A cos B = ½(sin(A + B) + sin(A − B))</span>. So <span class="m">∫sin x cos 3x dx = −cos 4x / 8 + cos 2x / 4 + C</span>.</p>',
    ],
  },
  {
    id: 'oddpow',
    ru: [
      'Нечётная степень синуса или косинуса',
      'odd powers',
      '<p>В <span class="m">∫sinᵐx cosⁿx dx</span> с нечётным m отделяют один множитель sin x: он вместе с dx образует <span class="m">−d(cos x)</span>. Остальные синусы чётной степени выражают через <span class="m">sin²x = 1 − cos²x</span>, и после замены <span class="m">u = cos x</span> остаётся многочлен.</p><p>Пример: <span class="m">∫sin³x dx = ∫(1 − cos²x) sin x dx = −cos x + cos³x/3 + C</span>. Если нечётна степень косинуса, роли меняются: <span class="m">u = sin x</span>.</p>',
    ],
    en: [
      'Odd power of sine or cosine',
      'нечётная степень',
      '<p>In <span class="m">∫sinᵐx cosⁿx dx</span> with odd m, split off one factor sin x: together with dx it forms <span class="m">−d(cos x)</span>. The remaining even power of sine is written via <span class="m">sin²x = 1 − cos²x</span>, and after <span class="m">u = cos x</span> only a polynomial is left.</p><p>Example: <span class="m">∫sin³x dx = ∫(1 − cos²x) sin x dx = −cos x + cos³x/3 + C</span>. If the power of cosine is odd, swap the roles: <span class="m">u = sin x</span>.</p>',
    ],
  },
  {
    id: 'trigsub',
    ru: [
      'Тригонометрическая подстановка',
      'trig substitution',
      '<p>Корни из квадратных выражений убираются заменами, при которых работает тождество:</p><p><span class="m">√(a² − x²)</span>: <span class="m">x = a sin t</span>, корень = <span class="m">a cos t</span>.<br><span class="m">√(a² + x²)</span>: <span class="m">x = a tg t</span>, корень = <span class="m">a / cos t</span>.<br><span class="m">√(x² − a²)</span>: <span class="m">x = a / cos t</span>, корень = <span class="m">a tg t</span>.</p><p>Пример: <span class="m">∫₋₁¹ √(1 − x²) dx</span> — площадь половины единичного круга, <span class="m">π/2</span>. Если под корнем есть слагаемое с x, сначала выделяют полный квадрат.</p>',
    ],
    en: [
      'Trigonometric substitution',
      'тригонометрическая подстановка',
      '<p>Roots of quadratic expressions disappear under substitutions that make an identity work:</p><p><span class="m">√(a² − x²)</span>: <span class="m">x = a sin t</span>, the root = <span class="m">a cos t</span>.<br><span class="m">√(a² + x²)</span>: <span class="m">x = a tan t</span>, the root = <span class="m">a / cos t</span>.<br><span class="m">√(x² − a²)</span>: <span class="m">x = a / cos t</span>, the root = <span class="m">a tan t</span>.</p><p>Example: <span class="m">∫₋₁¹ √(1 − x²) dx</span> is the area of half the unit disc, <span class="m">π/2</span>. If there is a linear term under the root, complete the square first.</p>',
    ],
  },
  {
    id: 'weier',
    ru: [
      'Универсальная тригонометрическая подстановка',
      't = tg(x/2)',
      '<p>Любое рациональное выражение от sin x и cos x подстановка <span class="m">t = tg(x/2)</span> превращает в рациональную дробь от t:</p><p><span class="m">sin x = 2t/(1 + t²)</span>, <span class="m">cos x = (1 − t²)/(1 + t²)</span>, <span class="m">dx = 2 dt/(1 + t²)</span>.</p><p>Метод работает всегда, но часто даёт громоздкие дроби, поэтому его берут, когда ничего проще не подходит. Пример: <span class="m">∫dx/(1 + cos x) = tg(x/2) + C</span>.</p>',
    ],
    en: [
      'Universal trigonometric substitution',
      't = tan(x/2)',
      '<p>The substitution <span class="m">t = tan(x/2)</span> turns any rational expression in sin x and cos x into a rational function of t:</p><p><span class="m">sin x = 2t/(1 + t²)</span>, <span class="m">cos x = (1 − t²)/(1 + t²)</span>, <span class="m">dx = 2 dt/(1 + t²)</span>.</p><p>It always works but often yields bulky fractions, so it is used when nothing simpler fits. Example: <span class="m">∫dx/(1 + cos x) = tan(x/2) + C</span>.</p>',
    ],
  },
  {
    id: 'rect',
    ru: [
      'Метод прямоугольников',
      'left, right, midpoint',
      '<p>Самый простой численный способ: отрезок делят на n равных частей ширины <span class="m">h = (b − a)/n</span> и берут высоту f на левом конце, правом конце или в середине каждого кусочка.</p><p>Левые и правые суммы ошибаются примерно на величину, пропорциональную 1/n. Средние точнее: ошибки по краям прямоугольника почти гасят друг друга, и погрешность падает как 1/n².</p>',
    ],
    en: [
      'Rectangle rule',
      'метод прямоугольников',
      '<p>The simplest numerical method: split the interval into n equal pieces of width <span class="m">h = (b − a)/n</span> and take the height of f at the left end, right end or middle of each piece.</p><p>Left and right sums are off by roughly an amount proportional to 1/n. Midpoint sums are better: errors on the two sides of each rectangle nearly cancel, and the error falls like 1/n².</p>',
    ],
  },
  {
    id: 'trap',
    ru: [
      'Метод трапеций',
      'trapezoidal rule',
      '<p>Соседние точки графика соединяют отрезком, и под каждым кусочком получается трапеция площадью <span class="m">h·(f(xᵢ) + f(xᵢ₊₁))/2</span>. Это среднее арифметическое левой и правой сумм.</p><p>Погрешность порядка 1/n². Для выпуклой вниз функции трапеции всегда дают завышенный результат, для выпуклой вверх — заниженный.</p>',
    ],
    en: [
      'Trapezoidal rule',
      'метод трапеций',
      '<p>Neighbouring points of the graph are joined by a segment, giving a trapezoid of area <span class="m">h·(f(xᵢ) + f(xᵢ₊₁))/2</span> over each piece. It is the average of the left and right sums.</p><p>The error is of order 1/n². For a function that curves upward the trapezoids always overestimate, for one curving downward they underestimate.</p>',
    ],
  },
  {
    id: 'simpson',
    ru: [
      'Метод Симпсона',
      'Simpson’s rule',
      '<p>На каждой паре соседних кусочков график заменяют параболой через три точки. Площадь под параболой считается точно: <span class="m">(h/3)·(f₀ + 4f₁ + f₂)</span>.</p><p>Погрешность порядка 1/n⁴: удвоение n уменьшает ошибку в 16 раз. Многочлены до третьей степени метод интегрирует вообще без ошибки. Число отрезков должно быть чётным.</p>',
    ],
    en: [
      'Simpson’s rule',
      'метод Симпсона',
      '<p>On each pair of neighbouring pieces the graph is replaced by a parabola through three points. The area under the parabola is exact: <span class="m">(h/3)·(f₀ + 4f₁ + f₂)</span>.</p><p>The error is of order 1/n⁴: doubling n cuts it by a factor of 16. Polynomials up to degree three are integrated with no error at all. The number of pieces must be even.</p>',
    ],
  },
  {
    id: 'error',
    ru: [
      'Погрешность численного метода',
      'order of accuracy',
      '<p>Погрешность — разница между численной суммой и точным интегралом. Говорят, что метод имеет порядок p, если ошибка ведёт себя как <span class="m">C/nᵖ</span>: для левых и правых прямоугольников p = 1, для средних и трапеций p = 2, для Симпсона p = 4.</p><p>Константа C зависит от того, насколько сильно изогнут график: для гладких пологих функций хватает малых n, для резко меняющихся нужно больше. Сравните в блоке «Значения» погрешность при разных правилах и n.</p>',
    ],
    en: [
      'Error of a numerical method',
      'порядок точности',
      '<p>The error is the difference between the numerical sum and the exact integral. A method has order p if its error behaves like <span class="m">C/nᵖ</span>: p = 1 for left and right rectangles, p = 2 for midpoint and trapezoid, p = 4 for Simpson.</p><p>The constant C depends on how strongly the graph bends: smooth gentle functions need small n, rapidly changing ones need more. Compare the error for different rules and n in the Values block.</p>',
    ],
  },
  {
    id: 'improper',
    ru: [
      'Несобственный интеграл',
      'improper integral',
      '<p>Так называют интеграл по бесконечному отрезку или от функции, которая уходит в бесконечность. Его определяют как предел: <span class="m">∫₁^∞ dx/x² = lim ∫₁ᴿ dx/x² = lim (1 − 1/R) = 1</span>.</p><p>Если предел конечен, интеграл <b>сходится</b>: бесконечно длинная или высокая фигура имеет конечную площадь. Если нет — <b>расходится</b>, как <span class="m">∫₁^∞ dx/x</span> или <span class="m">∫₀¹ dx/x</span>.</p><p>Ориентир: <span class="m">∫₁^∞ dx/xᵖ</span> сходится при p &gt; 1, а <span class="m">∫₀¹ dx/xᵖ</span> — при p &lt; 1.</p>',
    ],
    en: [
      'Improper integral',
      'несобственный интеграл',
      '<p>An integral over an infinite interval or of a function that blows up. It is defined as a limit: <span class="m">∫₁^∞ dx/x² = lim ∫₁ᴿ dx/x² = lim (1 − 1/R) = 1</span>.</p><p>If the limit is finite, the integral <b>converges</b>: an infinitely long or tall region has finite area. Otherwise it <b>diverges</b>, like <span class="m">∫₁^∞ dx/x</span> or <span class="m">∫₀¹ dx/x</span>.</p><p>Rule of thumb: <span class="m">∫₁^∞ dx/xᵖ</span> converges for p &gt; 1, and <span class="m">∫₀¹ dx/xᵖ</span> for p &lt; 1.</p>',
    ],
  },
  {
    id: 'nonelem',
    ru: [
      'Неберущиеся интегралы',
      'non-elementary',
      '<p>У каждой непрерывной функции есть первообразная, но она не всегда записывается через многочлены, корни, экспоненты, логарифмы и тригонометрию. Классические примеры: <span class="m">∫e^(−x²) dx</span>, <span class="m">∫sin x / x dx</span>, <span class="m">∫dx/ln x</span>, <span class="m">∫sin(x²) dx</span>.</p><p>Такие первообразные получили собственные имена (erf, Si, li, интегралы Френеля), а определённые интегралы от них считают численно. Некоторые всё же известны точно: <span class="m">∫₋∞^∞ e^(−x²) dx = √π</span>.</p>',
    ],
    en: [
      'Non-elementary integrals',
      'неберущиеся интегралы',
      '<p>Every continuous function has an antiderivative, but it can’t always be written with polynomials, roots, exponentials, logarithms and trig functions. Classic examples: <span class="m">∫e^(−x²) dx</span>, <span class="m">∫sin x / x dx</span>, <span class="m">∫dx/ln x</span>, <span class="m">∫sin(x²) dx</span>.</p><p>Such antiderivatives got their own names (erf, Si, li, Fresnel integrals), and definite integrals of them are computed numerically. Some are known exactly anyway: <span class="m">∫₋∞^∞ e^(−x²) dx = √π</span>.</p>',
    ],
  },
  {
    id: 'mean',
    ru: [
      'Среднее значение функции',
      'mean value',
      '<p>Среднее значение f на [a, b] — это <span class="m">f̄ = (1/(b − a))·∫ₐᵇ f dx</span>. Геометрически: высота прямоугольника на том же основании и с той же площадью, что и фигура под графиком.</p><p>Теорема о среднем говорит, что непрерывная функция хотя бы в одной точке отрезка принимает это значение. Например, среднее sin x на [0, π] равно <span class="m">2/π ≈ 0,64</span>.</p>',
    ],
    en: [
      'Mean value of a function',
      'среднее значение',
      '<p>The mean value of f on [a, b] is <span class="m">f̄ = (1/(b − a))·∫ₐᵇ f dx</span>. Geometrically: the height of a rectangle with the same base and the same area as the region under the graph.</p><p>The mean value theorem says a continuous function takes this value at least once on the interval. For example, the mean of sin x on [0, π] is <span class="m">2/π ≈ 0.64</span>.</p>',
    ],
  },
  {
    id: 'between',
    ru: [
      'Площадь между кривыми',
      'area between curves',
      '<p>Площадь фигуры между графиками f и g на [a, b], где f ≥ g, равна <span class="m">∫ₐᵇ (f(x) − g(x)) dx</span>: из площади под верхней кривой вычитаем площадь под нижней.</p><p>Пределы обычно — абсциссы точек пересечения, корни уравнения <span class="m">f(x) = g(x)</span>. Если кривые меняются местами, отрезок делят. Чтобы увидеть это на сцене, введите разность, например <span class="m">x − x²</span> на [0, 1]: ответ 1/6.</p>',
    ],
    en: [
      'Area between curves',
      'площадь между кривыми',
      '<p>The area between the graphs of f and g on [a, b], with f ≥ g, is <span class="m">∫ₐᵇ (f(x) − g(x)) dx</span>: the area under the upper curve minus the area under the lower one.</p><p>The limits are usually where the curves cross, the roots of <span class="m">f(x) = g(x)</span>. If the curves swap places, split the interval. To see it on the scene, enter the difference, for example <span class="m">x − x²</span> on [0, 1]: the answer is 1/6.</p>',
    ],
  },
  {
    id: 'volume',
    ru: [
      'Объём тела вращения',
      'volume of revolution',
      '<p>Если график f на [a, b] вращать вокруг оси x, получится тело, каждое сечение которого — круг радиуса f(x). Складывая тонкие диски, получаем <span class="m">V = π∫ₐᵇ f(x)² dx</span>.</p><p>Пример: вращая <span class="m">√(1 − x²)</span> на [−1, 1], получаем шар: <span class="m">π∫₋₁¹(1 − x²) dx = 4π/3</span>. На сцене можно посчитать сам интеграл, введя <span class="m">1 − x^2</span>.</p>',
    ],
    en: [
      'Volume of revolution',
      'объём тела вращения',
      '<p>Rotating the graph of f on [a, b] around the x-axis gives a solid whose every cross-section is a disc of radius f(x). Adding up thin discs gives <span class="m">V = π∫ₐᵇ f(x)² dx</span>.</p><p>Example: rotating <span class="m">√(1 − x²)</span> on [−1, 1] gives a ball: <span class="m">π∫₋₁¹(1 − x²) dx = 4π/3</span>. On the scene you can compute the integral itself by entering <span class="m">1 − x^2</span>.</p>',
    ],
  },
];
export const FORMAL = {
  riemann: {
    ru: '<p><b>Определение.</b> Разбиение отрезка [a, b] — точки <span class="m">a = x₀ &lt; x₁ &lt; … &lt; xₙ = b</span>, Δxᵢ = xᵢ − xᵢ₋₁. Выберем в каждом отрезке точку ξᵢ. Сумма Римана: <span class="m">σ = Σ f(ξᵢ)·Δxᵢ</span>. Если при <span class="m">max Δxᵢ → 0</span> суммы стремятся к одному числу I независимо от выбора разбиений и точек, f интегрируема по Риману и <span class="m">∫ₐᵇ f dx = I</span>.</p><p>Любая непрерывная на [a, b] функция интегрируема; ограниченная функция с конечным числом разрывов тоже.</p><p><b>Пример.</b> f = x на [0, 1], правые точки: <span class="m">σₙ = Σ (i/n)·(1/n) = (n + 1)/(2n) → 1/2</span>.</p>',
    en: '<p><b>Definition.</b> A partition of [a, b] is <span class="m">a = x₀ &lt; x₁ &lt; … &lt; xₙ = b</span>, Δxᵢ = xᵢ − xᵢ₋₁. Choose a point ξᵢ in each piece. The Riemann sum is <span class="m">σ = Σ f(ξᵢ)·Δxᵢ</span>. If as <span class="m">max Δxᵢ → 0</span> the sums tend to one number I regardless of partitions and points, f is Riemann integrable and <span class="m">∫ₐᵇ f dx = I</span>.</p><p>Every function continuous on [a, b] is integrable; so is a bounded function with finitely many discontinuities.</p><p><b>Example.</b> f = x on [0, 1], right endpoints: <span class="m">σₙ = Σ (i/n)·(1/n) = (n + 1)/(2n) → 1/2</span>.</p>',
  },
  definite: {
    ru: '<p><b>Определение.</b> <span class="m">∫ₐᵇ f(x) dx = lim σ</span> — предел сумм Римана при измельчении разбиения. Для a &gt; b по определению <span class="m">∫ₐᵇ f = −∫ᵇₐ f</span>.</p><p><b>Пример.</b> <span class="m">∫₀² x² dx = lim Σ (2i/n)²·(2/n) = lim 8(n + 1)(2n + 1)/(6n²) = 8/3</span>.</p>',
    en: '<p><b>Definition.</b> <span class="m">∫ₐᵇ f(x) dx = lim σ</span>, the limit of Riemann sums as the partition is refined. For a &gt; b, by definition <span class="m">∫ₐᵇ f = −∫ᵇₐ f</span>.</p><p><b>Example.</b> <span class="m">∫₀² x² dx = lim Σ (2i/n)²·(2/n) = lim 8(n + 1)(2n + 1)/(6n²) = 8/3</span>.</p>',
  },
  signed: {
    ru: '<p><b>Определение.</b> Положим <span class="m">f⁺ = max(f, 0)</span>, <span class="m">f⁻ = max(−f, 0)</span>. Тогда <span class="m">f = f⁺ − f⁻</span>, <span class="m">|f| = f⁺ + f⁻</span>, и <span class="m">∫f = ∫f⁺ − ∫f⁻</span>, а площадь фигуры равна <span class="m">∫|f| = ∫f⁺ + ∫f⁻</span>.</p><p><b>Пример.</b> На [0, 2π]: <span class="m">∫sin x = 2 − 2 = 0</span>, <span class="m">∫|sin x| = 4</span>.</p>',
    en: '<p><b>Definition.</b> Let <span class="m">f⁺ = max(f, 0)</span>, <span class="m">f⁻ = max(−f, 0)</span>. Then <span class="m">f = f⁺ − f⁻</span>, <span class="m">|f| = f⁺ + f⁻</span>, so <span class="m">∫f = ∫f⁺ − ∫f⁻</span>, while the area of the region is <span class="m">∫|f| = ∫f⁺ + ∫f⁻</span>.</p><p><b>Example.</b> On [0, 2π]: <span class="m">∫sin x = 2 − 2 = 0</span>, <span class="m">∫|sin x| = 4</span>.</p>',
  },
  antideriv: {
    ru: '<p><b>Определение.</b> F — первообразная f на промежутке I, если F дифференцируема на I и <span class="m">F′(x) = f(x)</span> для всех x ∈ I.</p><p><b>Теорема.</b> Если F₁ и F₂ — первообразные f на промежутке, то <span class="m">F₁ − F₂ = const</span>. (Следует из теоремы Лагранжа: производная разности равна нулю.)</p><p>Важно, что I — промежуток: у <span class="m">1/x</span> на ℝ∖{0} константы слева и справа от нуля могут быть разными.</p>',
    en: '<p><b>Definition.</b> F is an antiderivative of f on an interval I if F is differentiable on I and <span class="m">F′(x) = f(x)</span> for all x ∈ I.</p><p><b>Theorem.</b> If F₁ and F₂ are antiderivatives of f on an interval, then <span class="m">F₁ − F₂ = const</span>. (By the mean value theorem: the derivative of the difference is zero.)</p><p>It matters that I is an interval: for <span class="m">1/x</span> on ℝ∖{0} the constants left and right of zero may differ.</p>',
  },
  ftc: {
    ru: '<p><b>Теорема (первая часть).</b> Если f непрерывна на [a, b], то <span class="m">F(x) = ∫ₐˣ f(t) dt</span> дифференцируема и <span class="m">F′(x) = f(x)</span>.</p><p><b>Теорема (Ньютон–Лейбниц).</b> Если f непрерывна на [a, b] и G — любая её первообразная, то <span class="m">∫ₐᵇ f dx = G(b) − G(a)</span>.</p><p><b>Пример.</b> <span class="m">∫₀^π sin x dx = (−cos π) − (−cos 0) = 1 + 1 = 2</span>.</p><p>Условие непрерывности существенно: <span class="m">∫₋₁¹ dx/x²</span> «по формуле» дал бы −2, но интеграл расходится.</p>',
    en: '<p><b>Theorem (part one).</b> If f is continuous on [a, b], then <span class="m">F(x) = ∫ₐˣ f(t) dt</span> is differentiable and <span class="m">F′(x) = f(x)</span>.</p><p><b>Theorem (Newton–Leibniz).</b> If f is continuous on [a, b] and G is any antiderivative, then <span class="m">∫ₐᵇ f dx = G(b) − G(a)</span>.</p><p><b>Example.</b> <span class="m">∫₀^π sin x dx = (−cos π) − (−cos 0) = 1 + 1 = 2</span>.</p><p>Continuity matters: <span class="m">∫₋₁¹ dx/x²</span> “by the formula” would give −2, but the integral diverges.</p>',
  },
  usub: {
    ru: '<p><b>Теорема.</b> Если g непрерывно дифференцируема, а f непрерывна на множестве значений g, то <span class="m">∫f(g(x))·g′(x) dx = F(g(x)) + C</span>, где F′ = f.</p><p><b>Доказательство.</b> По правилу цепочки <span class="m">(F(g(x)))′ = f(g(x))·g′(x)</span>.</p><p><b>Пример.</b> <span class="m">∫cos(x²)·2x dx</span>: g = x², f = cos, ответ <span class="m">sin(x²) + C</span>.</p>',
    en: '<p><b>Theorem.</b> If g is continuously differentiable and f is continuous on the range of g, then <span class="m">∫f(g(x))·g′(x) dx = F(g(x)) + C</span>, where F′ = f.</p><p><b>Proof.</b> By the chain rule, <span class="m">(F(g(x)))′ = f(g(x))·g′(x)</span>.</p><p><b>Example.</b> <span class="m">∫cos(x²)·2x dx</span>: g = x², f = cos, answer <span class="m">sin(x²) + C</span>.</p>',
  },
  defsub: {
    ru: '<p><b>Теорема.</b> Если g непрерывно дифференцируема на [a, b], f непрерывна на g([a, b]), то <span class="m">∫ₐᵇ f(g(x))g′(x) dx = ∫_g(a)^g(b) f(u) du</span>.</p><p><b>Пример.</b> <span class="m">∫₀^(π/2) sin²x·cos x dx</span>, u = sin x: пределы 0 и 1, <span class="m">∫₀¹ u² du = 1/3</span>.</p>',
    en: '<p><b>Theorem.</b> If g is continuously differentiable on [a, b] and f is continuous on g([a, b]), then <span class="m">∫ₐᵇ f(g(x))g′(x) dx = ∫_g(a)^g(b) f(u) du</span>.</p><p><b>Example.</b> <span class="m">∫₀^(π/2) sin²x·cos x dx</span>, u = sin x: limits 0 and 1, <span class="m">∫₀¹ u² du = 1/3</span>.</p>',
  },
  parts: {
    ru: '<p><b>Теорема.</b> Если u и v непрерывно дифференцируемы, то <span class="m">∫u dv = uv − ∫v du</span>, а для определённого интеграла <span class="m">∫ₐᵇ u v′ dx = [uv]ₐᵇ − ∫ₐᵇ v u′ dx</span>.</p><p><b>Доказательство.</b> <span class="m">(uv)′ = u′v + uv′</span>; интегрируем обе части.</p><p><b>Пример.</b> <span class="m">∫₀^π x sin x dx = [−x cos x]₀^π + ∫₀^π cos x dx = π + 0 = π</span>.</p>',
    en: '<p><b>Theorem.</b> If u and v are continuously differentiable, then <span class="m">∫u dv = uv − ∫v du</span>, and for a definite integral <span class="m">∫ₐᵇ u v′ dx = [uv]ₐᵇ − ∫ₐᵇ v u′ dx</span>.</p><p><b>Proof.</b> <span class="m">(uv)′ = u′v + uv′</span>; integrate both sides.</p><p><b>Example.</b> <span class="m">∫₀^π x sin x dx = [−x cos x]₀^π + ∫₀^π cos x dx = π + 0 = π</span>.</p>',
  },
  partial: {
    ru: '<p><b>Теорема.</b> Любая правильная рациональная дробь <span class="m">P/Q</span> с вещественными коэффициентами единственным образом раскладывается в сумму дробей вида <span class="m">A/(x − r)ᵏ</span> и <span class="m">(Bx + C)/(x² + px + q)ᵏ</span>, где p² − 4q &lt; 0, а k не превосходит кратности соответствующего множителя Q.</p><p><b>Пример.</b> <span class="m">(x + 1)/(x² − 5x + 6) = 4/(x − 3) − 3/(x − 2)</span>: при x = 3 числитель 4, при x = 2 он равен 3, а знак даёт множитель (x − 3) = −1.</p>',
    en: '<p><b>Theorem.</b> Every proper rational function <span class="m">P/Q</span> with real coefficients splits uniquely into a sum of fractions <span class="m">A/(x − r)ᵏ</span> and <span class="m">(Bx + C)/(x² + px + q)ᵏ</span> with p² − 4q &lt; 0, where k doesn’t exceed the multiplicity of the corresponding factor of Q.</p><p><b>Example.</b> <span class="m">(x + 1)/(x² − 5x + 6) = 4/(x − 3) − 3/(x − 2)</span>: at x = 3 the numerator is 4, at x = 2 it is 3, and the factor (x − 3) = −1 gives the sign.</p>',
  },
  improper: {
    ru: '<p><b>Определение.</b> <span class="m">∫ₐ^∞ f dx = lim(R→∞) ∫ₐᴿ f dx</span>. Если f неограничена у точки b, то <span class="m">∫ₐᵇ f dx = lim(ε→0⁺) ∫ₐ^(b−ε) f dx</span>. Интеграл сходится, если предел существует и конечен.</p><p><b>Признак сравнения.</b> Если <span class="m">0 ≤ f ≤ g</span> и <span class="m">∫g</span> сходится, то сходится и <span class="m">∫f</span>.</p><p><b>Пример.</b> <span class="m">∫₀¹ dx/√x = lim (2 − 2√ε) = 2</span>.</p>',
    en: '<p><b>Definition.</b> <span class="m">∫ₐ^∞ f dx = lim(R→∞) ∫ₐᴿ f dx</span>. If f is unbounded near b, then <span class="m">∫ₐᵇ f dx = lim(ε→0⁺) ∫ₐ^(b−ε) f dx</span>. The integral converges if the limit exists and is finite.</p><p><b>Comparison test.</b> If <span class="m">0 ≤ f ≤ g</span> and <span class="m">∫g</span> converges, so does <span class="m">∫f</span>.</p><p><b>Example.</b> <span class="m">∫₀¹ dx/√x = lim (2 − 2√ε) = 2</span>.</p>',
  },
  simpson: {
    ru: '<p><b>Формула.</b> При чётном n и h = (b − a)/n: <span class="m">S = (h/3)·(f₀ + 4f₁ + 2f₂ + 4f₃ + … + 4fₙ₋₁ + fₙ)</span>.</p><p><b>Оценка.</b> <span class="m">|S − I| ≤ (b − a)·h⁴·max|f⁽⁴⁾|/180</span>.</p><p>Для трапеций: <span class="m">|T − I| ≤ (b − a)·h²·max|f″|/12</span>, для средних прямоугольников — то же с 24 вместо 12.</p>',
    en: '<p><b>Formula.</b> For even n and h = (b − a)/n: <span class="m">S = (h/3)·(f₀ + 4f₁ + 2f₂ + 4f₃ + … + 4fₙ₋₁ + fₙ)</span>.</p><p><b>Bound.</b> <span class="m">|S − I| ≤ (b − a)·h⁴·max|f⁽⁴⁾|/180</span>.</p><p>For trapezoids: <span class="m">|T − I| ≤ (b − a)·h²·max|f″|/12</span>; for midpoints, the same with 24 instead of 12.</p>',
  },
  mean: {
    ru: '<p><b>Теорема о среднем.</b> Если f непрерывна на [a, b], то найдётся <span class="m">c ∈ [a, b]</span>, для которой <span class="m">∫ₐᵇ f dx = f(c)·(b − a)</span>.</p><p><b>Пример.</b> <span class="m">∫₀² x² dx = 8/3</span>, среднее <span class="m">4/3</span>, оно достигается при <span class="m">c = 2/√3 ≈ 1,155</span>.</p>',
    en: '<p><b>Mean value theorem for integrals.</b> If f is continuous on [a, b], there is <span class="m">c ∈ [a, b]</span> with <span class="m">∫ₐᵇ f dx = f(c)·(b − a)</span>.</p><p><b>Example.</b> <span class="m">∫₀² x² dx = 8/3</span>, mean <span class="m">4/3</span>, attained at <span class="m">c = 2/√3 ≈ 1.155</span>.</p>',
  },
  trigsub: {
    ru: '<p><b>Пример полностью.</b> <span class="m">∫√(a² − x²) dx</span>, <span class="m">x = a sin t</span>, <span class="m">t ∈ [−π/2, π/2]</span>, <span class="m">dx = a cos t dt</span>, <span class="m">√(a² − x²) = a cos t</span>. Интеграл <span class="m">a²∫cos²t dt = (a²/2)(t + sin t cos t)</span>. Возвращаясь: <span class="m">t = arcsin(x/a)</span>, <span class="m">sin t cos t = x√(a² − x²)/a²</span>, итого <span class="m">(x/2)√(a² − x²) + (a²/2)arcsin(x/a) + C</span>.</p>',
    en: '<p><b>Full example.</b> <span class="m">∫√(a² − x²) dx</span>, <span class="m">x = a sin t</span>, <span class="m">t ∈ [−π/2, π/2]</span>, <span class="m">dx = a cos t dt</span>, <span class="m">√(a² − x²) = a cos t</span>. The integral is <span class="m">a²∫cos²t dt = (a²/2)(t + sin t cos t)</span>. Back to x: <span class="m">t = arcsin(x/a)</span>, <span class="m">sin t cos t = x√(a² − x²)/a²</span>, so <span class="m">(x/2)√(a² − x²) + (a²/2)arcsin(x/a) + C</span>.</p>',
  },
};
export const REL = {
  riemann: ['definite', 'rect', 'error'],
  definite: ['riemann', 'signed', 'ftc'],
  signed: ['definite', 'between'],
  properties: ['linearity', 'symmetry'],
  antideriv: ['indefinite', 'ftc'],
  indefinite: ['antideriv', 'table', 'check'],
  ftc: ['antideriv', 'definite', 'improper'],
  table: ['linsub', 'usub'],
  linearity: ['properties', 'table'],
  linsub: ['table', 'usub'],
  usub: ['defsub', 'linsub', 'parts'],
  defsub: ['usub'],
  symmetry: ['properties', 'signed'],
  check: ['antideriv'],
  parts: ['liate', 'cyclic', 'usub'],
  liate: ['parts'],
  cyclic: ['parts'],
  polydiv: ['partial'],
  partial: ['polydiv', 'square'],
  square: ['partial', 'trigsub'],
  trigid: ['oddpow', 'weier'],
  oddpow: ['trigid', 'usub'],
  trigsub: ['square', 'usub'],
  weier: ['trigid', 'partial'],
  rect: ['trap', 'simpson', 'error'],
  trap: ['rect', 'simpson'],
  simpson: ['trap', 'error'],
  error: ['rect', 'simpson'],
  improper: ['ftc', 'nonelem'],
  nonelem: ['improper', 'simpson'],
  mean: ['definite'],
  between: ['signed', 'definite'],
  volume: ['definite'],
};
export const CHAP = [
  {
    ru: 'Идея интеграла',
    en: 'The idea of the integral',
    ids: ['riemann', 'definite', 'signed', 'properties'],
  },
  { ru: 'Первообразная', en: 'The antiderivative', ids: ['antideriv', 'indefinite', 'ftc', 'table'] },
  {
    ru: 'Основные приёмы',
    en: 'Basic techniques',
    ids: ['linearity', 'linsub', 'usub', 'defsub', 'symmetry', 'check'],
  },
  { ru: 'Интегрирование по частям', en: 'Integration by parts', ids: ['parts', 'liate', 'cyclic'] },
  { ru: 'Рациональные дроби', en: 'Rational functions', ids: ['polydiv', 'partial', 'square'] },
  {
    ru: 'Тригонометрия и корни',
    en: 'Trigonometry and roots',
    ids: ['trigid', 'oddpow', 'trigsub', 'weier'],
  },
  { ru: 'Численные методы', en: 'Numerical methods', ids: ['rect', 'trap', 'simpson', 'error'] },
  { ru: 'Ещё', en: 'More', extra: true, ids: ['improper', 'nonelem', 'mean', 'between', 'volume'] },
];
export const DEMOS = {
  riemann: { p: 'p_pow', riem: true, rule: 'right', n: 6 },
  definite: { p: 'p_pow' },
  signed: { p: 'p_odd' },
  properties: { p: 'p_poly' },
  antideriv: { p: 'p_pow', mode: 'I', fam: true },
  indefinite: { p: 'p_sin', mode: 'I', fam: true },
  ftc: { p: 'p_pow', mode: 'F', tan: true },
  table: { p: 'p_atan' },
  linearity: { p: 'p_poly' },
  linsub: { p: 'p_lin' },
  usub: { p: 'p_usub' },
  defsub: { p: 'p_usub' },
  symmetry: { p: 'p_odd' },
  check: { p: 'p_parts', mode: 'I', tan: true },
  parts: { p: 'p_parts' },
  liate: { p: 'p_lnparts' },
  cyclic: { p: 'p_cyc' },
  polydiv: { f: 'x/(x+1)', a: '0', b: '2' },
  partial: { p: 'p_pf' },
  square: { p: 'p_sq' },
  trigid: { p: 'p_sin2' },
  oddpow: { p: 'p_sin3' },
  trigsub: { p: 'p_circ' },
  weier: { p: 'p_weier' },
  rect: { p: 'p_pow', riem: true, rule: 'mid', n: 4 },
  trap: { p: 'p_sin', riem: true, rule: 'trap', n: 4 },
  simpson: { p: 'p_sin', riem: true, rule: 'simp', n: 4 },
  error: { p: 'p_pow', riem: true, rule: 'left', n: 4, rplay: true },
  improper: { p: 'p_imp2' },
  nonelem: { p: 'p_gauss' },
  mean: { p: 'p_sin' },
  between: { f: 'x-x^2', a: '0', b: '1' },
  volume: { f: '1-x^2', a: '-1', b: '1' },
};
export const ILL = {
  riemann: {
    o: [18, 118],
    sx: 56,
    sy: 30,
    it: [
      ['grid'],
      ['rects', (x) => 0.3 + x * x * 0.28, 0, 3, 6, 'mid'],
      ['fn', (x) => 0.3 + x * x * 0.28, -0.2, 3.2, 'f'],
      ['T', 150, 18, 'Σ f(ξᵢ)Δx', 'rect', 12],
    ],
  },
  definite: {
    o: [22, 118],
    sx: 56,
    sy: 30,
    it: [
      ['grid'],
      ['area', (x) => 0.3 + x * x * 0.28, 0.5, 2.6],
      ['fn', (x) => 0.3 + x * x * 0.28, -0.2, 3.2, 'f'],
      ['vl', 0.5, 'lim'],
      ['vl', 2.6, 'lim'],
      ['t', 0.5, -0.45, 'a', 'lim'],
      ['t', 2.6, -0.45, 'b', 'lim'],
      ['T', 150, 18, '∫ₐᵇ f dx', 'axis', 13],
    ],
  },
  signed: {
    o: [14, 70],
    sx: 27,
    sy: 36,
    it: [
      ['grid'],
      ['area', Math.sin, 0, 2 * Math.PI],
      ['fn', Math.sin, -0.3, 6.8, 'f'],
      ['t', 1.57, 0.45, '+', 'axis', 16],
      ['t', 4.71, -0.45, '−', 'axis', 16],
    ],
  },
  antideriv: {
    o: [20, 110],
    sx: 42,
    sy: 22,
    it: [
      ['grid'],
      ['fn', (x) => (x * x) / 2 - 1.2, -0.4, 4.2, 'F', 0.35],
      ['fn', (x) => (x * x) / 2, -0.4, 4.2, 'F'],
      ['fn', (x) => (x * x) / 2 + 1.2, -0.4, 4.2, 'F', 0.35],
      ['T', 160, 20, 'F + C', 'F', 13],
    ],
  },
  ftc: {
    o: [22, 118],
    sx: 42,
    sy: 26,
    it: [
      ['grid'],
      ['area', (x) => 0.3 + 0.5 * x, 0, 2.4],
      ['fn', (x) => 0.3 + 0.5 * x, -0.3, 4.2, 'f'],
      ['fn', (x) => 0.3 * x + 0.25 * x * x, -0.3, 3.6, 'F'],
      ['tan', (x) => 0.3 * x + 0.25 * x * x, 2.4, 'tan'],
      ['vl', 2.4, 'lim'],
      ['t', 2.4, -0.5, 'x', 'lim'],
      ['T', 40, 16, 'F′ = f', 'F', 12],
    ],
  },
  usub: {
    o: [20, 120],
    sx: 56,
    sy: 38,
    it: [
      ['grid'],
      ['area', (x) => (x * Math.exp(x * x)) / 3, 0, 1.4],
      ['fn', (x) => (x * Math.exp(x * x)) / 3, -0.2, 1.5, 'f'],
      ['T', 130, 22, 'u = x²', 'axis', 12],
    ],
  },
  parts: {
    o: [0, 0],
    sx: 1,
    sy: 1,
    it: [
      [
        'raw',
        '<rect x="40" y="30" width="120" height="80" fill="var(--s-pos)" fill-opacity=".2" stroke="var(--s-pos)"/><path d="M40 110 Q90 108 110 70 T160 30" fill="none" stroke="var(--s-f)" stroke-width="2"/><path d="M40 110 Q90 108 110 70 T160 30 L40 30 Z" fill="var(--s-F)" fill-opacity=".3"/>',
      ],
      ['T', 120, 96, '∫v du', 'pos', 11],
      ['T', 80, 48, '∫u dv', 'F', 11],
      ['T', 100, 128, 'uv = ∫u dv + ∫v du', 'axis', 11],
    ],
  },
  partial: {
    o: [100, 70],
    sx: 24,
    sy: 14,
    it: [
      ['grid'],
      ['fn', (x) => 1 / (x * (x + 1)), 0.12, 3.9, 'f'],
      ['fn', (x) => 1 / (x * (x + 1)), -3.9, -1.12, 'f'],
      ['fn', (x) => 1 / (x * (x + 1)), -0.88, -0.12, 'f'],
      ['vl', 0, 'neg'],
      ['vl', -1, 'neg'],
    ],
  },
  trigid: {
    o: [14, 100],
    sx: 27,
    sy: 50,
    it: [
      ['grid'],
      ['area', (x) => Math.sin(x) ** 2, 0, Math.PI],
      ['fn', (x) => Math.sin(x) ** 2, -0.3, 6.8, 'f'],
      ['fn', () => 0.5, -0.3, 6.8, 'lim'],
      ['T', 160, 24, '½', 'lim', 13],
    ],
  },
  trigsub: {
    o: [100, 118],
    sx: 70,
    sy: 70,
    it: [
      ['grid'],
      ['area', (x) => Math.sqrt(Math.max(0, 1 - x * x)), -1, 1],
      ['fn', (x) => Math.sqrt(Math.max(0, 1 - x * x)), -1, 1, 'f'],
      ['T', 100, 70, 'π/2', 'axis', 14],
    ],
  },
  rect: {
    o: [18, 118],
    sx: 56,
    sy: 30,
    it: [
      ['grid'],
      ['rects', (x) => 0.3 + x * x * 0.28, 0, 3, 4, 'left'],
      ['fn', (x) => 0.3 + x * x * 0.28, -0.2, 3.2, 'f'],
    ],
  },
  trap: {
    o: [18, 118],
    sx: 56,
    sy: 30,
    it: [
      ['grid'],
      ['rects', (x) => 0.3 + x * x * 0.28, 0, 3, 4, 'trap'],
      ['fn', (x) => 0.3 + x * x * 0.28, -0.2, 3.2, 'f'],
    ],
  },
  simpson: {
    o: [14, 100],
    sx: 27,
    sy: 50,
    it: [
      ['grid'],
      ['rects', (x) => Math.sin(x) * 0.9 + 0.6, 0, 6, 4, 'simp'],
      ['fn', (x) => Math.sin(x) * 0.9 + 0.6, -0.3, 6.8, 'f'],
    ],
  },
  improper: {
    o: [20, 118],
    sx: 30,
    sy: 40,
    it: [
      ['grid'],
      ['area', (x) => 1 / (x * x), 1, 7],
      ['fn', (x) => 1 / (x * x), 0.4, 7, 'f'],
      ['vl', 1, 'lim'],
      ['T', 150, 40, '∫₁^∞ = 1', 'axis', 12],
    ],
  },
  nonelem: {
    o: [100, 118],
    sx: 30,
    sy: 80,
    it: [
      ['grid'],
      ['area', (x) => Math.exp(-x * x), -3.4, 3.4],
      ['fn', (x) => Math.exp(-x * x), -3.4, 3.4, 'f'],
      ['T', 160, 24, '√π', 'axis', 14],
    ],
  },
  mean: {
    o: [22, 118],
    sx: 42,
    sy: 70,
    it: [
      ['grid'],
      ['raw', ''],
      ['area', Math.sin, 0, Math.PI],
      ['fn', Math.sin, -0.3, 4, 'f'],
      ['fn', () => 2 / Math.PI, 0, Math.PI, 'lim'],
      ['T', 170, 60, 'f̄', 'lim', 13],
    ],
  },
  between: {
    o: [30, 118],
    sx: 140,
    sy: 280,
    it: [
      ['grid'],
      ['fn', (x) => x, -0.1, 1.1, 'F'],
      ['fn', (x) => x * x, -0.1, 1.1, 'f'],
      ['T', 150, 24, 'x − x²', 'axis', 12],
    ],
  },
  symmetry: {
    o: [100, 70],
    sx: 40,
    sy: 16,
    it: [
      ['grid'],
      ['area', (x) => x * x * x - 4 * x, -2, 2],
      ['fn', (x) => x * x * x - 4 * x, -2.3, 2.3, 'f'],
    ],
  },
};
