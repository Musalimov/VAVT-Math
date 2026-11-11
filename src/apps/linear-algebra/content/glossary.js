export const TERMS = [
  {
    id: 'vector',
    ru: [
      'Вектор',
      'vector',
      '<p>Стрелка из начала координат. Записывается столбиком координат: <span class="m">(3, 2)</span> значит «3 шага вправо и 2 вверх».</p><p>Векторы складывают, приставляя хвост второго к концу первого, и умножают на число, растягивая или сжимая.</p>',
    ],
    en: [
      'Vector',
      'вектор',
      '<p>An arrow from the origin, written as a column of coordinates: <span class="m">(3, 2)</span> means “3 steps right and 2 steps up”.</p><p>Vectors are added by placing the tail of the second at the tip of the first, and multiplied by a number to stretch or shrink them.</p>',
    ],
  },
  {
    id: 'lincomb',
    ru: [
      'Линейная комбинация',
      'linear combination',
      '<p>Сумма векторов, умноженных на числа: <span class="m">a·v + b·w</span>.</p><p>Любой вектор плоскости — линейная комбинация базисных: <span class="m">(3, 2) = 3·î + 2·ĵ</span>. Включите «Разложение v по базису», чтобы увидеть это на сцене.</p>',
    ],
    en: [
      'Linear combination',
      'линейная комбинация',
      '<p>A sum of scaled vectors: <span class="m">a·v + b·w</span>.</p><p>Every vector in the plane is a linear combination of the basis vectors: <span class="m">(3, 2) = 3·î + 2·ĵ</span>. Turn on “Decompose v in basis” to see it on the scene.</p>',
    ],
  },
  {
    id: 'basis',
    ru: [
      'Базис',
      'basis',
      '<p>Набор линейно независимых векторов, через которые однозначно выражается любой вектор пространства. Стандартный базис плоскости — <span class="m">î = (1, 0)</span> и <span class="m">ĵ = (0, 1)</span>.</p><p>Координаты вектора — это просто коэффициенты при базисных векторах. Поэтому в другом базисе у той же самой стрелки будут другие координаты. Демонстрация показывает новый базис и то, как <span class="m">v</span> собирается из него.</p>',
    ],
    en: [
      'Basis',
      'базис',
      '<p>A set of linearly independent vectors that expresses every vector in the space in exactly one way. The standard basis of the plane is <span class="m">î = (1, 0)</span> and <span class="m">ĵ = (0, 1)</span>.</p><p>A vector’s coordinates are just the coefficients on the basis vectors, so the same arrow has different coordinates in a different basis. The demo shows a new basis and how <span class="m">v</span> is built from it.</p>',
    ],
  },
  {
    id: 'span',
    ru: [
      'Линейная оболочка',
      'span',
      '<p>Все точки, до которых можно дойти линейными комбинациями данных векторов.</p><p>Два непараллельных вектора на плоскости дают всю плоскость, два параллельных — только прямую, нулевой вектор — точку. В 3D три вектора, лежащие в одной плоскости, дают лишь эту плоскость.</p><p>Оболочка столбцов матрицы — это её образ: на сцене он подсвечивается, когда пространство схлопывается.</p>',
    ],
    en: [
      'Span',
      'линейная оболочка',
      '<p>All the points you can reach with linear combinations of the given vectors.</p><p>Two non-parallel vectors in the plane span the whole plane, two parallel ones only a line, the zero vector just a point. In 3D, three vectors lying in one plane span only that plane.</p><p>The span of a matrix’s columns is its image; the scene highlights it when space gets squished.</p>',
    ],
  },
  {
    id: 'dependence',
    ru: [
      'Линейная зависимость и независимость',
      'linear dependence, independence',
      '<p>Векторы <b>линейно независимы</b>, если каждый из них добавляет новое направление: ни один нельзя получить из остальных. Два непараллельных вектора на плоскости независимы, и их оболочка — вся плоскость. В 3D независимы три вектора, не лежащие в одной плоскости.</p><p>Векторы <b>линейно зависимы</b>, если хотя бы один выражается через остальные: он лишний и не расширяет оболочку. Зависимы два параллельных вектора, любой набор с нулевым вектором и любые три вектора на плоскости.</p><p>Именно независимость делает набор базисом: базис — это независимые векторы, которых хватает на всё пространство. Столбцы квадратной матрицы независимы тогда и только тогда, когда <span class="m">det ≠ 0</span>.</p>',
    ],
    en: [
      'Linear dependence and independence',
      'линейная зависимость и независимость',
      '<p>Vectors are <b>linearly independent</b> if each one adds a new direction: none can be built from the others. Two non-parallel vectors in the plane are independent, and they span the whole plane. In 3D, three vectors not lying in one plane are independent.</p><p>Vectors are <b>linearly dependent</b> if at least one can be written in terms of the others: it is redundant and doesn’t enlarge the span. Two parallel vectors, any set containing the zero vector and any three vectors in the plane are dependent.</p><p>Independence is what makes a set a basis: a basis is a set of independent vectors that is big enough to reach the whole space. The columns of a square matrix are independent exactly when <span class="m">det ≠ 0</span>.</p>',
    ],
  },
  {
    id: 'transform',
    ru: [
      'Линейное преобразование',
      'linear transformation',
      '<p>Правило, которое переводит каждый вектор в новый вектор так, что линии сетки остаются прямыми, параллельными и равномерно расставленными, а начало координат стоит на месте.</p><p>Алгебраически: <span class="m">L(v + w) = L(v) + L(w)</span> и <span class="m">L(c·v) = c·L(v)</span>.</p>',
    ],
    en: [
      'Linear transformation',
      'линейное преобразование',
      '<p>A rule that moves every vector to a new one so that grid lines stay straight, parallel and evenly spaced, and the origin stays put.</p><p>Algebraically: <span class="m">L(v + w) = L(v) + L(w)</span> and <span class="m">L(c·v) = c·L(v)</span>.</p>',
    ],
  },
  {
    id: 'matrix',
    ru: [
      'Матрица',
      'matrix',
      '<p>Числовая запись линейного преобразования. Главная идея: <b>столбцы матрицы — это координаты, куда попали базисные векторы</b>.</p><p>Зная, куда ушли <span class="m">î</span> и <span class="m">ĵ</span>, знаем всё: <span class="m">A·(x, y) = x·(1-й столбец) + y·(2-й столбец)</span>. Потяните кончики <span class="m">î</span> и <span class="m">ĵ</span> на сцене, и числа в матрице поменяются вместе с ними.</p>',
    ],
    en: [
      'Matrix',
      'матрица',
      '<p>A numeric record of a linear transformation. The key idea: <b>the columns of the matrix are where the basis vectors land</b>.</p><p>Know where <span class="m">î</span> and <span class="m">ĵ</span> go and you know everything: <span class="m">A·(x, y) = x·(column 1) + y·(column 2)</span>. Drag the tips of <span class="m">î</span> and <span class="m">ĵ</span> on the scene and the numbers change with them.</p>',
    ],
  },
  {
    id: 'identity',
    ru: [
      'Единичная матрица',
      'identity',
      '<p><span class="m">I</span> — единицы на диагонали, нули в остальных местах. Это преобразование «ничего не делать»: <span class="m">î</span> остаётся <span class="m">î</span>, <span class="m">ĵ</span> остаётся <span class="m">ĵ</span>.</p><p>При умножении она играет роль единицы: <span class="m">A·I = I·A = A</span>. Через неё определяется обратная матрица: <span class="m">A⁻¹·A = I</span>.</p>',
    ],
    en: [
      'Identity matrix',
      'единичная матрица',
      '<p><span class="m">I</span> has ones on the diagonal and zeros elsewhere. It’s the “do nothing” transformation: <span class="m">î</span> stays <span class="m">î</span>, <span class="m">ĵ</span> stays <span class="m">ĵ</span>.</p><p>It acts as the number 1 for multiplication: <span class="m">A·I = I·A = A</span>, and the inverse is defined through it: <span class="m">A⁻¹·A = I</span>.</p>',
    ],
  },
  {
    id: 'transpose',
    ru: [
      'Транспонирование',
      'transpose',
      '<p><span class="m">Aᵀ</span> получается, если строки матрицы записать столбцами. Определитель при этом не меняется (<span class="m">det Aᵀ = det A</span>), собственные значения тоже.</p><p>Геометрически <span class="m">Aᵀ</span> — не «обратное» и не «зеркальное» преобразование. Его смысл виден через скалярное произведение: <span class="m">(A·v)·w = v·(Aᵀ·w)</span>. Для поворотов <span class="m">Aᵀ = A⁻¹</span>, а у симметричных матриц (<span class="m">Aᵀ = A</span>) собственные векторы перпендикулярны.</p>',
    ],
    en: [
      'Transpose',
      'транспонирование',
      '<p><span class="m">Aᵀ</span> is what you get by writing the rows of a matrix as columns. The determinant doesn’t change (<span class="m">det Aᵀ = det A</span>), and neither do the eigenvalues.</p><p>Geometrically, <span class="m">Aᵀ</span> is neither the “inverse” nor a “mirror” transformation. Its meaning shows up through the dot product: <span class="m">(A·v)·w = v·(Aᵀ·w)</span>. For rotations <span class="m">Aᵀ = A⁻¹</span>, and symmetric matrices (<span class="m">Aᵀ = A</span>) have perpendicular eigenvectors.</p>',
    ],
  },
  {
    id: 'composition',
    ru: [
      'Композиция и умножение матриц',
      'composition',
      '<p>Сделать сначала <span class="m">A</span>, потом <span class="m">B</span> — то же самое, что одно преобразование <span class="m">B·A</span>. Читается справа налево, как функции: <span class="m">B(A(v))</span>.</p><p>Порядок важен: обычно <span class="m">AB ≠ BA</span>. Включите «Применять поверх текущего», и готовые преобразования будут накладываться друг на друга.</p>',
    ],
    en: [
      'Composition and matrix multiplication',
      'композиция',
      '<p>Doing <span class="m">A</span> first and then <span class="m">B</span> is the same as the single transformation <span class="m">B·A</span>. Read right to left, like functions: <span class="m">B(A(v))</span>.</p><p>Order matters: usually <span class="m">AB ≠ BA</span>. Turn on “Apply on top of current” and presets will stack on each other.</p>',
    ],
  },
  {
    id: 'det',
    ru: [
      'Определитель',
      'determinant',
      '<p>Во сколько раз преобразование меняет площади (в 3D — объёмы). Единичный квадрат превращается в параллелограмм площадью <span class="m">|det|</span>, и любая другая фигура масштабируется так же.</p><p>Знак показывает ориентацию: при <span class="m">det &lt; 0</span> пространство «вывернуто», как в зеркале. При <span class="m">det = 0</span> всё схлопнулось в прямую или точку.</p>',
    ],
    en: [
      'Determinant',
      'определитель',
      '<p>How much the transformation scales areas (volumes in 3D). The unit square becomes a parallelogram of area <span class="m">|det|</span>, and every other shape scales the same way.</p><p>The sign gives the orientation: with <span class="m">det &lt; 0</span> space is flipped, like a mirror image. With <span class="m">det = 0</span> everything collapses onto a line or a point.</p>',
    ],
  },
  {
    id: 'volume',
    ru: [
      'Определитель в 3D',
      '3D determinant, volume',
      '<p>В пространстве определитель — это объём параллелепипеда, в который превратился единичный куб. Отрицательный знак означает, что тройка <span class="m">î, ĵ, <span class="kh">k</span></span> сменила «правую руку» на «левую».</p>',
    ],
    en: [
      'Determinant in 3D',
      'определитель в 3D, объём',
      '<p>In space, the determinant is the volume of the parallelepiped the unit cube turns into. A negative sign means the triple <span class="m">î, ĵ, <span class="kh">k</span></span> switched from right-handed to left-handed.</p>',
    ],
  },
  {
    id: 'inverse',
    ru: [
      'Обратная матрица',
      'inverse',
      '<p><span class="m">A⁻¹</span> отменяет действие <span class="m">A</span>: <span class="m">A⁻¹·A = I</span>.</p><p>Она существует, только если <span class="m">det ≠ 0</span>. Если плоскость сплющилась в прямую, разные векторы попали в одну точку, и однозначно вернуть их обратно нельзя.</p>',
    ],
    en: [
      'Inverse matrix',
      'обратная матрица',
      '<p><span class="m">A⁻¹</span> undoes <span class="m">A</span>: <span class="m">A⁻¹·A = I</span>.</p><p>It exists only when <span class="m">det ≠ 0</span>. If the plane is squished onto a line, different vectors land on the same point, and there’s no unique way to send them back.</p>',
    ],
  },
  {
    id: 'rank',
    ru: [
      'Ранг',
      'rank',
      '<p>Размерность результата преобразования: сколько измерений «выжило». На плоскости ранг 2 — полный, ранг 1 — всё легло на прямую, ранг 0 — в точку.</p><p>Ранг равен числу линейно независимых столбцов.</p>',
    ],
    en: [
      'Rank',
      'ранг',
      '<p>The dimension of the output: how many dimensions “survive”. In the plane, rank 2 is full, rank 1 means everything lands on a line, rank 0 on a point.</p><p>Rank equals the number of linearly independent columns.</p>',
    ],
  },
  {
    id: 'colspace',
    ru: [
      'Образ',
      'column space, image',
      '<p>Множество всех возможных результатов <span class="m">A·v</span>. Это линейная оболочка столбцов матрицы.</p><p>Система <span class="m">A·x = b</span> имеет решение, только если <span class="m">b</span> лежит в образе.</p>',
    ],
    en: [
      'Image',
      'образ, пространство столбцов',
      '<p>The set of all possible outputs <span class="m">A·v</span>. It’s the span of the matrix’s columns.</p><p>The system <span class="m">A·x = b</span> has a solution only if <span class="m">b</span> lies in the image.</p>',
    ],
  },
  {
    id: 'kernel',
    ru: [
      'Ядро',
      'null space, kernel',
      '<p>Все векторы, которые преобразование отправляет в ноль: <span class="m">A·v = 0</span>.</p><p>При <span class="m">det ≠ 0</span> это только нулевой вектор. При <span class="m">det = 0</span> — целая прямая или плоскость. Размерность ядра плюс ранг равна размерности пространства.</p><p>В демонстрации вектор <span class="m">v</span> лежит на ядре и сжимается в точку.</p>',
    ],
    en: [
      'Kernel',
      'ядро, нуль-пространство',
      '<p>All vectors the transformation sends to zero: <span class="m">A·v = 0</span>.</p><p>When <span class="m">det ≠ 0</span> it’s only the zero vector. When <span class="m">det = 0</span> it’s a whole line or plane. The dimension of the kernel plus the rank equals the dimension of the space.</p><p>In the demo, <span class="m">v</span> lies on the kernel and shrinks to a point.</p>',
    ],
  },
  {
    id: 'eigen',
    ru: [
      'Собственные векторы и значения',
      'eigenvectors, eigenvalues',
      '<p>Векторы, которые после преобразования остаются на своей прямой и лишь растягиваются в <span class="m">λ</span> раз: <span class="m">A·v = λ·v</span>. Число <span class="m">λ</span> — собственное значение.</p><p><span class="m">λ &lt; 0</span> означает разворот в противоположную сторону. У поворота плоскости (кроме поворотов на 0° и 180°) вещественных собственных векторов нет: каждый вектор сходит со своей прямой. А у сдвига собственная прямая всего одна, и собственных векторов не хватает на базис.</p>',
    ],
    en: [
      'Eigenvectors and eigenvalues',
      'собственные векторы',
      '<p>Vectors that stay on their own line after the transformation and only get stretched by a factor <span class="m">λ</span>: <span class="m">A·v = λ·v</span>. The number <span class="m">λ</span> is the eigenvalue.</p><p><span class="m">λ &lt; 0</span> means a flip to the opposite direction. A rotation of the plane (other than by 0° or 180°) has no real eigenvectors: every vector is knocked off its line. A shear has just one eigenline, so its eigenvectors can’t form a basis.</p>',
    ],
  },
  {
    id: 'charpoly',
    ru: [
      'Как найти λ',
      'characteristic polynomial',
      '<p><span class="m">A·v = λ·v</span> равносильно <span class="m">(A − λI)·v = 0</span>. Ненулевое решение есть, только если <span class="m">A − λI</span> схлопывает пространство, то есть <span class="m">det(A − λI) = 0</span>.</p><p>Для матрицы 2×2 это уравнение <span class="m">λ² − tr·λ + det = 0</span>.</p>',
    ],
    en: [
      'Finding λ',
      'характеристический многочлен',
      '<p><span class="m">A·v = λ·v</span> is the same as <span class="m">(A − λI)·v = 0</span>. A nonzero solution exists only if <span class="m">A − λI</span> squishes space, that is, <span class="m">det(A − λI) = 0</span>.</p><p>For a 2×2 matrix this is <span class="m">λ² − tr·λ + det = 0</span>.</p>',
    ],
  },
  {
    id: 'trace',
    ru: [
      'След',
      'trace',
      '<p>Сумма элементов главной диагонали. Равен сумме собственных значений, а определитель равен их произведению (с учётом кратности, включая комплексные).</p>',
    ],
    en: [
      'Trace',
      'след',
      '<p>The sum of the main diagonal entries. It equals the sum of the eigenvalues, while the determinant equals their product (counting multiplicity, complex ones included).</p>',
    ],
  },
  {
    id: 'changebasis',
    ru: [
      'Смена базиса',
      'change of basis',
      '<p>Если столбцы <span class="m">P</span> — векторы нового базиса, то <span class="m">P⁻¹·A·P</span> описывает то же самое преобразование, но в координатах нового базиса.</p><p>Если собственных векторов хватает на базис, в этом базисе матрица становится диагональной, и преобразование выглядит как растяжение вдоль осей. У сдвига так не получится: собственная прямая у него одна.</p>',
    ],
    en: [
      'Change of basis',
      'смена базиса',
      '<p>If the columns of <span class="m">P</span> are the new basis vectors, <span class="m">P⁻¹·A·P</span> describes the same transformation in the coordinates of the new basis.</p><p>If there are enough eigenvectors to form a basis, the matrix becomes diagonal in that basis, and the transformation is just stretching along the axes. A shear can’t do this: it has only one eigenline.</p>',
    ],
  },
  {
    id: 'dot',
    ru: [
      'Скалярное произведение',
      'dot product',
      '<p>Число, которое показывает, насколько два вектора смотрят в одну сторону: <span class="m">v·w = |v|·|w|·cos θ</span>. Оно положительно, если угол острый, равно нулю для перпендикулярных векторов и отрицательно, если угол тупой.</p><p>Геометрически это длина проекции <span class="m">w</span> на направление <span class="m">v</span>, умноженная на длину <span class="m">v</span>. А ещё это линейное преобразование из плоскости на числовую прямую, записанное матрицей-строкой <span class="m">vᵀ</span>: в этом и состоит «двойственность» векторов и таких преобразований.</p>',
    ],
    en: [
      'Dot product',
      'скалярное произведение',
      '<p>A number that tells how much two vectors point the same way: <span class="m">v·w = |v|·|w|·cos θ</span>. It is positive for an acute angle, zero for perpendicular vectors and negative for an obtuse angle.</p><p>Geometrically it is the length of the projection of <span class="m">w</span> onto the direction of <span class="m">v</span>, times the length of <span class="m">v</span>. It is also a linear transformation from the plane to the number line, written as the row matrix <span class="m">vᵀ</span>: that is the “duality” between vectors and such transformations.</p>',
    ],
  },
  {
    id: 'cross',
    ru: [
      'Векторное произведение',
      'cross product',
      '<p>Операция только для 3D: из двух векторов <span class="m">v</span> и <span class="m">w</span> получается третий, перпендикулярный обоим. Его длина равна площади параллелограмма на <span class="m">v</span> и <span class="m">w</span>, а направление задаёт правило правой руки.</p><p>Порядок важен: <span class="m">w × v = −(v × w)</span>. Для параллельных векторов произведение — нулевой вектор.</p>',
    ],
    en: [
      'Cross product',
      'векторное произведение',
      '<p>A 3D-only operation: two vectors <span class="m">v</span> and <span class="m">w</span> give a third one perpendicular to both. Its length is the area of the parallelogram on <span class="m">v</span> and <span class="m">w</span>, and the right-hand rule sets its direction.</p><p>Order matters: <span class="m">w × v = −(v × w)</span>. For parallel vectors the product is the zero vector.</p>',
    ],
  },
  {
    id: 'orthogonal',
    ru: [
      'Ортогональные матрицы',
      'orthogonal matrix',
      '<p>Преобразования, которые ничего не растягивают и не искажают: длины и углы сохраняются. Это повороты и отражения. Сетка остаётся квадратной, только поворачивается или переворачивается.</p><p>Обратную к такой матрице найти очень легко: это просто транспонированная, <span class="m">Q⁻¹ = Qᵀ</span>. Определитель равен 1 у поворота и −1 у отражения.</p>',
    ],
    en: [
      'Orthogonal matrices',
      'ортогональные матрицы',
      '<p>Transformations that stretch and distort nothing: lengths and angles are preserved. These are rotations and reflections. The grid stays square; it only turns or flips.</p><p>Their inverse is trivial to find: it is just the transpose, <span class="m">Q⁻¹ = Qᵀ</span>. The determinant is 1 for a rotation and −1 for a reflection.</p>',
    ],
  },
  {
    id: 'systems',
    ru: [
      'Системы линейных уравнений',
      'linear systems',
      '<p>Система <span class="m">A·x = b</span> — это вопрос: какой вектор <span class="m">x</span> преобразование <span class="m">A</span> отправит точно в <span class="m">b</span>?</p><p>Если <span class="m">det A ≠ 0</span>, ответ всегда один: <span class="m">x = A⁻¹·b</span>, то есть преобразование «отматывают» назад. Если <span class="m">det A = 0</span>, пространство схлопнулось: когда <span class="m">b</span> не лежит в образе, решений нет, а когда лежит — их бесконечно много (к одному решению можно прибавить любой вектор ядра). На картинке каждое уравнение — прямая, а решение — их пересечение.</p>',
    ],
    en: [
      'Systems of linear equations',
      'системы линейных уравнений',
      '<p>The system <span class="m">A·x = b</span> asks: which vector <span class="m">x</span> does the transformation <span class="m">A</span> send exactly to <span class="m">b</span>?</p><p>If <span class="m">det A ≠ 0</span>, there is always exactly one answer: <span class="m">x = A⁻¹·b</span>, that is, play the transformation backwards. If <span class="m">det A = 0</span>, space has collapsed: when <span class="m">b</span> is outside the image there are no solutions, and when it is inside there are infinitely many (add any kernel vector to one solution). In the picture each equation is a line, and the solution is where they cross.</p>',
    ],
  },
  {
    id: 'gauss',
    ru: [
      'Метод Гаусса',
      'Gaussian elimination',
      '<p>Главный рабочий инструмент вычислений. Матрицу приводят к «лесенке» тремя безопасными операциями со строками: поменять две строки местами, умножить строку на ненулевое число, прибавить к строке другую строку, умноженную на число. Эти операции не меняют множество решений системы.</p><p>По лесенке сразу видно ранг (число ненулевых строк) и есть ли решения, а само решение находится обратным ходом снизу вверх. Тем же способом считают обратную матрицу и определитель.</p>',
    ],
    en: [
      'Gaussian elimination',
      'метод Гаусса',
      '<p>The main computational workhorse. A matrix is reduced to a “staircase” with three safe row operations: swap two rows, multiply a row by a nonzero number, add a multiple of one row to another. These operations don’t change the solution set of a system.</p><p>The staircase shows the rank (the number of nonzero rows) and whether solutions exist, and back substitution from the bottom up gives the solution. The same method computes inverses and determinants.</p>',
    ],
  },
  {
    id: 'nonsquare',
    ru: [
      'Неквадратные матрицы',
      'non-square matrices',
      '<p>Матрица m×n переводит n-мерное пространство в m-мерное. Матрица 3×2 берёт плоскость и укладывает её в пространство: два её столбца — места, куда попали <span class="m">î</span> и <span class="m">ĵ</span>, но теперь это 3D-векторы. Образ — плоскость или прямая внутри 3D.</p><p>Матрица 2×3, наоборот, сплющивает пространство на плоскость: три столбца показывают, куда попадают <span class="m">î</span>, <span class="m">ĵ</span> и <span class="m"><span class="kh">k</span></span>, но у каждого лишь две координаты. Ядро такой матрицы всегда как минимум прямая. Определитель для неквадратных матриц не определён.</p>',
    ],
    en: [
      'Non-square matrices',
      'неквадратные матрицы',
      '<p>An m×n matrix maps n-dimensional space to m-dimensional space. A 3×2 matrix takes the plane and places it into space: its two columns are where <span class="m">î</span> and <span class="m">ĵ</span> land, but now they are 3D vectors. The image is a plane or a line inside 3D.</p><p>A 2×3 matrix does the opposite and squashes space onto a plane: its three columns show where <span class="m">î</span>, <span class="m">ĵ</span> and <span class="m"><span class="kh">k</span></span> land, each with only two coordinates. Its kernel is always at least a line. Non-square matrices have no determinant.</p>',
    ],
  },
  {
    id: 'complexeig',
    ru: [
      'Комплексные собственные значения',
      'complex eigenvalues',
      '<p>Если у матрицы 2×2 дискриминант характеристического уравнения отрицателен, вещественных собственных векторов нет: каждый вектор сходит со своей прямой. Зато есть комплексные корни <span class="m">λ = a ± bi</span>, и они многое рассказывают.</p><p>Модуль <span class="m">|λ| = √(a² + b²)</span> показывает, во сколько раз преобразование растягивает, а аргумент — угол поворота. У поворота на θ, например, <span class="m">λ = cos θ ± i·sin θ</span>. Если повторять такое преобразование, точка идёт по спирали: наружу при <span class="m">|λ| &gt; 1</span> и внутрь при <span class="m">|λ| &lt; 1</span>.</p>',
    ],
    en: [
      'Complex eigenvalues',
      'комплексные собственные значения',
      '<p>If the characteristic equation of a 2×2 matrix has a negative discriminant, there are no real eigenvectors: every vector is knocked off its line. There are complex roots <span class="m">λ = a ± bi</span> instead, and they say a lot.</p><p>The modulus <span class="m">|λ| = √(a² + b²)</span> is the stretch factor, and the argument is the rotation angle. A rotation by θ, for example, has <span class="m">λ = cos θ ± i·sin θ</span>. Repeat such a transformation and a point moves along a spiral: outward when <span class="m">|λ| &gt; 1</span>, inward when <span class="m">|λ| &lt; 1</span>.</p>',
    ],
  },
  {
    id: 'symmetric',
    ru: [
      'Симметричные матрицы',
      'symmetric matrix',
      '<p>Матрица симметрична, если не меняется при транспонировании: элемент над диагональю равен элементу под ней. У таких матриц всё устроено «красиво»: собственные значения вещественные, а собственные векторы можно выбрать перпендикулярными.</p><p>Геометрически симметричная матрица — это растяжения вдоль перпендикулярных направлений без скрытого поворота. Круг она превращает в эллипс, оси которого и есть собственные векторы.</p>',
    ],
    en: [
      'Symmetric matrices',
      'симметричные матрицы',
      '<p>A matrix is symmetric if transposing it changes nothing: each entry above the diagonal equals the one below. Such matrices are “nice”: their eigenvalues are real and their eigenvectors can be chosen perpendicular.</p><p>Geometrically, a symmetric matrix stretches along perpendicular directions with no hidden rotation. It turns a circle into an ellipse whose axes are exactly the eigenvectors.</p>',
    ],
  },
  {
    id: 'abstract',
    ru: [
      'Абстрактные векторные пространства',
      'vector spaces',
      '<p>Всё, что мы делали со стрелками, работает для любых объектов, которые можно складывать и умножать на число по обычным правилам. Многочлены, функции, последовательности — тоже векторы.</p><p>Например, производная — линейное преобразование: производная суммы равна сумме производных, а множитель выносится. В базисе 1, x, x² её можно записать обычной матрицей. Поэтому идеи линейной алгебры (базис, ядро, собственные векторы) встречаются повсюду. Собственные «векторы» производной — экспоненты: <span class="m">(e<sup>kx</sup>)′ = k·e<sup>kx</sup></span>.</p>',
    ],
    en: [
      'Abstract vector spaces',
      'абстрактные векторные пространства',
      '<p>Everything we did with arrows works for any objects you can add and scale by the usual rules. Polynomials, functions and sequences are vectors too.</p><p>The derivative, for example, is a linear transformation: the derivative of a sum is the sum of derivatives, and constants factor out. In the basis 1, x, x² it is an ordinary matrix. That is why linear algebra ideas (basis, kernel, eigenvectors) show up everywhere. The eigen-“vectors” of the derivative are exponentials: <span class="m">(e<sup>kx</sup>)′ = k·e<sup>kx</sup></span>.</p>',
    ],
  },
  {
    id: 'subspace',
    ru: [
      'Подпространство',
      'subspace',
      '<p>«Плоское» множество внутри пространства, которое проходит через начало координат и замкнуто: складывая его векторы и умножая их на числа, из него никогда не выйти.</p><p>На плоскости подпространства бывают трёх видов: точка 0, прямая через начало координат и вся плоскость. В 3D добавляются плоскости через начало координат. Прямая, не проходящая через 0, подпространством не является. Линейная оболочка любых векторов, а также образ и ядро любой матрицы — подпространства.</p>',
    ],
    en: [
      'Subspace',
      'подпространство',
      '<p>A “flat” set inside a space that passes through the origin and is closed: adding its vectors and scaling them never takes you outside it.</p><p>In the plane there are three kinds of subspaces: the point 0, a line through the origin and the whole plane. In 3D, planes through the origin join the list. A line that misses 0 is not a subspace. The span of any vectors, and the image and kernel of any matrix, are subspaces.</p>',
    ],
  },
  {
    id: 'cramer',
    ru: [
      'Правило Крамера',
      'Cramer’s rule',
      '<p>Способ решить систему <span class="m">A·x = b</span> через определители, и у него красивый геометрический смысл. Возьмите параллелограмм на неизвестном векторе <span class="m">x</span> и векторе <span class="m">ĵ</span>: его площадь со знаком равна просто первой координате <span class="m">x₁</span>. Преобразование <span class="m">A</span> превращает его в параллелограмм на <span class="m">b</span> и <span class="m">A·ĵ</span>, а любая площадь умножается на <span class="m">det A</span>.</p><p>Значит, <span class="m">x₁ = (площадь после) / det A</span>, а «площадь после» — это определитель матрицы <span class="m">A</span>, у которой первый столбец заменён на <span class="m">b</span>. Так же находится и <span class="m">x₂</span>. На больших матрицах метод Гаусса быстрее, но правило Крамера хорошо объясняет, почему при <span class="m">det A = 0</span> всё ломается: делить не на что.</p>',
    ],
    en: [
      'Cramer’s rule',
      'правило Крамера',
      '<p>A way to solve <span class="m">A·x = b</span> with determinants, and it has a lovely geometric meaning. Take the parallelogram on the unknown vector <span class="m">x</span> and the vector <span class="m">ĵ</span>: its signed area is simply the first coordinate <span class="m">x₁</span>. The transformation <span class="m">A</span> turns it into the parallelogram on <span class="m">b</span> and <span class="m">A·ĵ</span>, and every area is scaled by <span class="m">det A</span>.</p><p>So <span class="m">x₁ = (area after) / det A</span>, and the “area after” is the determinant of <span class="m">A</span> with its first column replaced by <span class="m">b</span>. <span class="m">x₂</span> works the same way. Gaussian elimination is faster for large matrices, but Cramer’s rule shows clearly why everything breaks when <span class="m">det A = 0</span>: there is nothing to divide by.</p>',
    ],
  },
];
export const FORMAL = {
  vector: {
    ru: '<p><b>Определение.</b> Вектор пространства ℝⁿ — упорядоченный набор из n чисел <span class="m">v = (v₁, …, vₙ)</span>. Сложение и умножение на число выполняются покоординатно: <span class="m">u + v = (u₁ + v₁, …, uₙ + vₙ)</span>, <span class="m">c·v = (c·v₁, …, c·vₙ)</span>.</p><p><b>Пример.</b> (1, 2) + (3, −1) = (4, 1); 2·(1, 2) = (2, 4).</p>',
    en: '<p><b>Definition.</b> A vector in ℝⁿ is an ordered list of n numbers <span class="m">v = (v₁, …, vₙ)</span>. Addition and scalar multiplication work entry by entry: <span class="m">u + v = (u₁ + v₁, …, uₙ + vₙ)</span>, <span class="m">c·v = (c·v₁, …, c·vₙ)</span>.</p><p><b>Example.</b> (1, 2) + (3, −1) = (4, 1); 2·(1, 2) = (2, 4).</p>',
  },
  lincomb: {
    ru: '<p><b>Определение.</b> Линейная комбинация векторов v₁, …, vₖ с коэффициентами c₁, …, cₖ ∈ ℝ — это вектор <span class="m">c₁v₁ + c₂v₂ + … + cₖvₖ</span>.</p><p><b>Пример.</b> 2·(1, 0) + 3·(0, 1) − 1·(1, 1) = (1, 2).</p>',
    en: '<p><b>Definition.</b> A linear combination of vectors v₁, …, vₖ with coefficients c₁, …, cₖ ∈ ℝ is the vector <span class="m">c₁v₁ + c₂v₂ + … + cₖvₖ</span>.</p><p><b>Example.</b> 2·(1, 0) + 3·(0, 1) − 1·(1, 1) = (1, 2).</p>',
  },
  basis: {
    ru: '<p><b>Определение.</b> Набор векторов b₁, …, bₙ — базис пространства V, если он линейно независим и его линейная оболочка равна V. Тогда каждый v ∈ V единственным образом записывается как <span class="m">v = c₁b₁ + … + cₙbₙ</span>; числа cᵢ — координаты v в этом базисе. Число векторов в любом базисе одно и то же: это размерность V.</p><p><b>Пример.</b> (1, 1) и (1, −1) — базис ℝ². Вектор (3, 1) = 2·(1, 1) + 1·(1, −1), поэтому его координаты в этом базисе — (2, 1).</p>',
    en: '<p><b>Definition.</b> Vectors b₁, …, bₙ form a basis of a space V if they are linearly independent and their span is V. Then every v ∈ V can be written in exactly one way as <span class="m">v = c₁b₁ + … + cₙbₙ</span>; the numbers cᵢ are the coordinates of v in this basis. Every basis has the same number of vectors: the dimension of V.</p><p><b>Example.</b> (1, 1) and (1, −1) form a basis of ℝ². Since (3, 1) = 2·(1, 1) + 1·(1, −1), its coordinates in this basis are (2, 1).</p>',
  },
  span: {
    ru: '<p><b>Определение.</b> <span class="m">span(v₁, …, vₖ) = { c₁v₁ + … + cₖvₖ : cᵢ ∈ ℝ }</span>. Линейная оболочка всегда подпространство: содержит 0 и замкнута относительно сложения и умножения на число.</p><p><b>Пример.</b> span((1, 2)) — прямая y = 2x. span((1, 0), (0, 1)) = ℝ². span((1, 2), (2, 4)) — та же прямая y = 2x.</p>',
    en: '<p><b>Definition.</b> <span class="m">span(v₁, …, vₖ) = { c₁v₁ + … + cₖvₖ : cᵢ ∈ ℝ }</span>. A span is always a subspace: it contains 0 and is closed under addition and scalar multiplication.</p><p><b>Example.</b> span((1, 2)) is the line y = 2x. span((1, 0), (0, 1)) = ℝ². span((1, 2), (2, 4)) is the same line y = 2x.</p>',
  },
  dependence: {
    ru: '<p><b>Определение.</b> Векторы v₁, …, vₖ <b>линейно независимы</b>, если равенство <span class="m">c₁v₁ + … + cₖvₖ = 0</span> выполняется только при c₁ = … = cₖ = 0. Если же оно выполняется при каком-то наборе коэффициентов, не все из которых нули, векторы <b>линейно зависимы</b>.</p><p>Полезные факты: в ℝⁿ больше n векторов всегда зависимы; набор с нулевым вектором зависим; n векторов в ℝⁿ независимы ⇔ определитель матрицы из них не равен нулю.</p><p><b>Пример.</b> (1, 2) и (2, 4) зависимы: 2·(1, 2) − 1·(2, 4) = 0. (1, 0) и (1, 1) независимы: из a·(1, 0) + b·(1, 1) = (a + b, b) = 0 следует b = 0, а затем a = 0. Проверка через определитель: det {{1,1;0,1}} = 1 ≠ 0.</p>',
    en: '<p><b>Definition.</b> Vectors v₁, …, vₖ are <b>linearly independent</b> if <span class="m">c₁v₁ + … + cₖvₖ = 0</span> holds only when c₁ = … = cₖ = 0. If it holds for some coefficients that are not all zero, the vectors are <b>linearly dependent</b>.</p><p>Useful facts: more than n vectors in ℝⁿ are always dependent; a set containing the zero vector is dependent; n vectors in ℝⁿ are independent ⇔ the determinant of the matrix they form is nonzero.</p><p><b>Example.</b> (1, 2) and (2, 4) are dependent: 2·(1, 2) − 1·(2, 4) = 0. (1, 0) and (1, 1) are independent: a·(1, 0) + b·(1, 1) = (a + b, b) = 0 forces b = 0 and then a = 0. Determinant check: det {{1,1;0,1}} = 1 ≠ 0.</p>',
  },
  transform: {
    ru: '<p><b>Определение.</b> Отображение L: ℝⁿ → ℝᵐ линейно, если для любых векторов u, v и любого числа c выполнено <span class="m">L(u + v) = L(u) + L(v)</span> и <span class="m">L(c·v) = c·L(v)</span>. Отсюда, в частности, L(0) = 0.</p><p><b>Пример.</b> L(x, y) = (2x, x + y) линейно. M(x, y) = (x + 1, y) не линейно: M(0, 0) = (1, 0) ≠ 0. N(x, y) = (x², y) тоже нет: N(2·(1, 0)) = (4, 0), а 2·N(1, 0) = (2, 0).</p>',
    en: '<p><b>Definition.</b> A map L: ℝⁿ → ℝᵐ is linear if for all vectors u, v and every number c we have <span class="m">L(u + v) = L(u) + L(v)</span> and <span class="m">L(c·v) = c·L(v)</span>. In particular, L(0) = 0.</p><p><b>Example.</b> L(x, y) = (2x, x + y) is linear. M(x, y) = (x + 1, y) is not: M(0, 0) = (1, 0) ≠ 0. Neither is N(x, y) = (x², y): N(2·(1, 0)) = (4, 0) but 2·N(1, 0) = (2, 0).</p>',
  },
  matrix: {
    ru: '<p><b>Определение.</b> Матрица размера m×n — прямоугольная таблица чисел aᵢⱼ, где i — номер строки, j — номер столбца. Каждому линейному отображению L: ℝⁿ → ℝᵐ соответствует единственная матрица A, для которой L(v) = A·v; её j-й столбец равен L(eⱼ). Произведение матрицы на вектор: <span class="m">(A·v)ᵢ = aᵢ₁v₁ + … + aᵢₙvₙ</span>.</p><p><b>Пример.</b> L(x, y) = (2x, x + y) задаётся матрицей {{2,0;1,1}}. Тогда {{2,0;1,1}}·(1, 3) = (2·1 + 0·3, 1·1 + 1·3) = (2, 4).</p>',
    en: '<p><b>Definition.</b> An m×n matrix is a rectangular table of numbers aᵢⱼ, where i is the row and j the column. Every linear map L: ℝⁿ → ℝᵐ has exactly one matrix A with L(v) = A·v; its j-th column is L(eⱼ). Matrix times vector: <span class="m">(A·v)ᵢ = aᵢ₁v₁ + … + aᵢₙvₙ</span>.</p><p><b>Example.</b> L(x, y) = (2x, x + y) has the matrix {{2,0;1,1}}. Then {{2,0;1,1}}·(1, 3) = (2·1 + 0·3, 1·1 + 1·3) = (2, 4).</p>',
  },
  identity: {
    ru: '<p><b>Определение.</b> Единичная матрица Iₙ — матрица n×n с элементами (Iₙ)ᵢⱼ = 1 при i = j и 0 при i ≠ j. Для любой матрицы A размера n×n: <span class="m">A·I = I·A = A</span>, для любого вектора v: <span class="m">I·v = v</span>.</p><p><b>Пример.</b> I₂ = {{1,0;0,1}}, I₃ = {{1,0,0;0,1,0;0,0,1}}.</p>',
    en: '<p><b>Definition.</b> The identity matrix Iₙ is the n×n matrix with (Iₙ)ᵢⱼ = 1 when i = j and 0 when i ≠ j. For every n×n matrix A: <span class="m">A·I = I·A = A</span>, and for every vector v: <span class="m">I·v = v</span>.</p><p><b>Example.</b> I₂ = {{1,0;0,1}}, I₃ = {{1,0,0;0,1,0;0,0,1}}.</p>',
  },
  transpose: {
    ru: '<p><b>Определение.</b> Транспонированная матрица: <span class="m">(Aᵀ)ᵢⱼ = aⱼᵢ</span>. Свойства: (Aᵀ)ᵀ = A, (A + B)ᵀ = Aᵀ + Bᵀ, <span class="m">(A·B)ᵀ = Bᵀ·Aᵀ</span>, det Aᵀ = det A.</p><p><b>Пример.</b> {{1,2;3,4}}ᵀ = {{1,3;2,4}}.</p>',
    en: '<p><b>Definition.</b> The transpose: <span class="m">(Aᵀ)ᵢⱼ = aⱼᵢ</span>. Properties: (Aᵀ)ᵀ = A, (A + B)ᵀ = Aᵀ + Bᵀ, <span class="m">(A·B)ᵀ = Bᵀ·Aᵀ</span>, det Aᵀ = det A.</p><p><b>Example.</b> {{1,2;3,4}}ᵀ = {{1,3;2,4}}.</p>',
  },
  composition: {
    ru: '<p><b>Определение.</b> Произведение матрицы A размера m×n на матрицу B размера n×p — матрица C = A·B размера m×p с элементами <span class="m">cᵢⱼ = aᵢ₁b₁ⱼ + aᵢ₂b₂ⱼ + … + aᵢₙbₙⱼ</span>: строка i матрицы A, умноженная на столбец j матрицы B. Число столбцов A должно совпадать с числом строк B.</p><p>Свойства: (AB)C = A(BC), A(B + C) = AB + AC, det(AB) = det A·det B. В общем случае <span class="m">AB ≠ BA</span>.</p><p><b>Пример.</b> {{1,1;0,1}}·{{0,−1;1,0}} = {{1·0 + 1·1, 1·(−1) + 1·0; 0·0 + 1·1, 0·(−1) + 1·0}} = {{1,−1;1,0}}, а в обратном порядке {{0,−1;1,0}}·{{1,1;0,1}} = {{0,−1;1,1}}. Посчитать свои примеры можно в блоке «Умножение матриц».</p>',
    en: '<p><b>Definition.</b> The product of an m×n matrix A and an n×p matrix B is the m×p matrix C = A·B with entries <span class="m">cᵢⱼ = aᵢ₁b₁ⱼ + aᵢ₂b₂ⱼ + … + aᵢₙbₙⱼ</span>: row i of A times column j of B. The number of columns of A must equal the number of rows of B.</p><p>Properties: (AB)C = A(BC), A(B + C) = AB + AC, det(AB) = det A·det B. In general <span class="m">AB ≠ BA</span>.</p><p><b>Example.</b> {{1,1;0,1}}·{{0,−1;1,0}} = {{1·0 + 1·1, 1·(−1) + 1·0; 0·0 + 1·1, 0·(−1) + 1·0}} = {{1,−1;1,0}}, while in the other order {{0,−1;1,0}}·{{1,1;0,1}} = {{0,−1;1,1}}. Try your own in the “Matrix multiplication” block.</p>',
  },
  det: {
    ru: '<p><b>Определение.</b> Для матрицы 2×2: <span class="m">det {{a,b;c,d}} = ad − bc</span>. Для n×n — разложение по первой строке: <span class="m">det A = a₁₁M₁₁ − a₁₂M₁₂ + a₁₃M₁₃ − …</span>, где M₁ⱼ — определитель матрицы без первой строки и j-го столбца (минор).</p><p>Свойства: det(AB) = det A·det B, det Aᵀ = det A, перестановка двух строк меняет знак, det A ≠ 0 ⇔ A обратима.</p><p><b>Пример.</b> det {{3,1;2,4}} = 3·4 − 1·2 = 10.</p>',
    en: '<p><b>Definition.</b> For a 2×2 matrix: <span class="m">det {{a,b;c,d}} = ad − bc</span>. For n×n, expand along the first row: <span class="m">det A = a₁₁M₁₁ − a₁₂M₁₂ + a₁₃M₁₃ − …</span>, where M₁ⱼ is the determinant of the matrix without the first row and the j-th column (a minor).</p><p>Properties: det(AB) = det A·det B, det Aᵀ = det A, swapping two rows flips the sign, det A ≠ 0 ⇔ A is invertible.</p><p><b>Example.</b> det {{3,1;2,4}} = 3·4 − 1·2 = 10.</p>',
  },
  volume: {
    ru: '<p><b>Определение.</b> Для матрицы 3×3 (правило Саррюса): <span class="m">det A = a₁₁a₂₂a₃₃ + a₁₂a₂₃a₃₁ + a₁₃a₂₁a₃₂ − a₁₃a₂₂a₃₁ − a₁₁a₂₃a₃₂ − a₁₂a₂₁a₃₃</span>. Объём параллелепипеда, построенного на столбцах A, равен |det A|.</p><p><b>Пример.</b> det {{2,0,0;0,1,0;0,0,3}} = 2·1·3 = 6: единичный куб превращается в коробку 2×1×3.</p>',
    en: '<p><b>Definition.</b> For a 3×3 matrix (rule of Sarrus): <span class="m">det A = a₁₁a₂₂a₃₃ + a₁₂a₂₃a₃₁ + a₁₃a₂₁a₃₂ − a₁₃a₂₂a₃₁ − a₁₁a₂₃a₃₂ − a₁₂a₂₁a₃₃</span>. The volume of the parallelepiped spanned by the columns of A is |det A|.</p><p><b>Example.</b> det {{2,0,0;0,1,0;0,0,3}} = 2·1·3 = 6: the unit cube becomes a 2×1×3 box.</p>',
  },
  inverse: {
    ru: '<p><b>Определение.</b> Матрица B — обратная к квадратной матрице A, если <span class="m">A·B = B·A = I</span>; обозначается A⁻¹. Она существует тогда и только тогда, когда det A ≠ 0. Для 2×2: <span class="m">{{a,b;c,d}}⁻¹ = 1/(ad − bc) · {{d,−b;−c,a}}</span>. Свойство: (AB)⁻¹ = B⁻¹A⁻¹.</p><p><b>Пример.</b> {{2,1;1,1}}⁻¹ = {{1,−1;−1,2}}, так как det = 1. Проверка: {{2,1;1,1}}·{{1,−1;−1,2}} = {{1,0;0,1}}.</p>',
    en: '<p><b>Definition.</b> A matrix B is the inverse of a square matrix A if <span class="m">A·B = B·A = I</span>; it is written A⁻¹. It exists exactly when det A ≠ 0. For 2×2: <span class="m">{{a,b;c,d}}⁻¹ = 1/(ad − bc) · {{d,−b;−c,a}}</span>. Property: (AB)⁻¹ = B⁻¹A⁻¹.</p><p><b>Example.</b> {{2,1;1,1}}⁻¹ = {{1,−1;−1,2}}, since det = 1. Check: {{2,1;1,1}}·{{1,−1;−1,2}} = {{1,0;0,1}}.</p>',
  },
  rank: {
    ru: '<p><b>Определение.</b> Ранг матрицы A — размерность её образа. Он равен максимальному числу линейно независимых столбцов и, что то же самое, строк. На практике матрицу приводят к ступенчатому виду методом Гаусса: ранг равен числу ненулевых строк.</p><p><b>Пример.</b> rank {{1,2;2,4}} = 1: вторая строка — удвоенная первая. rank I₂ = 2. Ранг нулевой матрицы равен 0.</p>',
    en: '<p><b>Definition.</b> The rank of a matrix A is the dimension of its image. It equals the maximum number of linearly independent columns, and equally of rows. In practice you row-reduce the matrix (Gaussian elimination): the rank is the number of nonzero rows.</p><p><b>Example.</b> rank {{1,2;2,4}} = 1: the second row is twice the first. rank I₂ = 2. The zero matrix has rank 0.</p>',
  },
  colspace: {
    ru: '<p><b>Определение.</b> <span class="m">Im A = { A·x : x ∈ ℝⁿ }</span> — это линейная оболочка столбцов A. Система A·x = b имеет решение тогда и только тогда, когда b ∈ Im A.</p><p><b>Пример.</b> Для A = {{1,2;2,4}} образ — прямая span((1, 2)). Вектор b = (3, 6) в ней лежит (например, x = (3, 0)), а b = (1, 0) — нет, и система A·x = (1, 0) решений не имеет.</p>',
    en: '<p><b>Definition.</b> <span class="m">Im A = { A·x : x ∈ ℝⁿ }</span>, the span of the columns of A. The system A·x = b has a solution exactly when b ∈ Im A.</p><p><b>Example.</b> For A = {{1,2;2,4}} the image is the line span((1, 2)). The vector b = (3, 6) lies on it (take x = (3, 0)), while b = (1, 0) does not, so A·x = (1, 0) has no solution.</p>',
  },
  kernel: {
    ru: '<p><b>Определение.</b> <span class="m">Ker A = { x ∈ ℝⁿ : A·x = 0 }</span>. Это подпространство. Теорема о ранге: <span class="m">dim Ker A + rank A = n</span>, где n — число столбцов.</p><p><b>Пример.</b> Для A = {{1,2;2,4}} ядро — span((−2, 1)): 1·(−2) + 2·1 = 0 и 2·(−2) + 4·1 = 0. Здесь dim Ker A = 1, rank A = 1, в сумме 2.</p>',
    en: '<p><b>Definition.</b> <span class="m">Ker A = { x ∈ ℝⁿ : A·x = 0 }</span>. It is a subspace. Rank–nullity theorem: <span class="m">dim Ker A + rank A = n</span>, the number of columns.</p><p><b>Example.</b> For A = {{1,2;2,4}} the kernel is span((−2, 1)): 1·(−2) + 2·1 = 0 and 2·(−2) + 4·1 = 0. Here dim Ker A = 1, rank A = 1, adding up to 2.</p>',
  },
  eigen: {
    ru: '<p><b>Определение.</b> Число λ — собственное значение квадратной матрицы A, а ненулевой вектор v — соответствующий собственный вектор, если <span class="m">A·v = λ·v</span>. Все такие v вместе с нулём образуют собственное подпространство <span class="m">Ker(A − λI)</span>.</p><p><b>Пример.</b> A = {{3,1;0,2}}. A·(1, 0) = (3, 0) = 3·(1, 0), значит, λ₁ = 3. A·(−1, 1) = (−2, 2) = 2·(−1, 1), значит, λ₂ = 2.</p>',
    en: '<p><b>Definition.</b> A number λ is an eigenvalue of a square matrix A, and a nonzero vector v is a corresponding eigenvector, if <span class="m">A·v = λ·v</span>. All such v together with zero form the eigenspace <span class="m">Ker(A − λI)</span>.</p><p><b>Example.</b> A = {{3,1;0,2}}. A·(1, 0) = (3, 0) = 3·(1, 0), so λ₁ = 3. A·(−1, 1) = (−2, 2) = 2·(−1, 1), so λ₂ = 2.</p>',
  },
  charpoly: {
    ru: '<p><b>Определение.</b> Характеристический многочлен <span class="m">p(λ) = det(A − λI)</span>; его корни — собственные значения A. Иногда пишут det(λI − A): это отличается разве что знаком. Для 2×2: <span class="m">p(λ) = λ² − (tr A)·λ + det A</span>.</p><p><b>Пример.</b> A = {{3,1;0,2}}: p(λ) = (3 − λ)(2 − λ) − 1·0 = λ² − 5λ + 6, корни 3 и 2.</p>',
    en: '<p><b>Definition.</b> The characteristic polynomial is <span class="m">p(λ) = det(A − λI)</span>; its roots are the eigenvalues of A. Some texts use det(λI − A), which differs at most by sign. For 2×2: <span class="m">p(λ) = λ² − (tr A)·λ + det A</span>.</p><p><b>Example.</b> A = {{3,1;0,2}}: p(λ) = (3 − λ)(2 − λ) − 1·0 = λ² − 5λ + 6, with roots 3 and 2.</p>',
  },
  trace: {
    ru: '<p><b>Определение.</b> <span class="m">tr A = a₁₁ + a₂₂ + … + aₙₙ</span>. Свойства: tr(A + B) = tr A + tr B, tr(c·A) = c·tr A, <span class="m">tr(AB) = tr(BA)</span>, tr A = λ₁ + … + λₙ.</p><p><b>Пример.</b> tr {{3,1;0,2}} = 3 + 2 = 5, и это сумма собственных значений 3 и 2.</p>',
    en: '<p><b>Definition.</b> <span class="m">tr A = a₁₁ + a₂₂ + … + aₙₙ</span>. Properties: tr(A + B) = tr A + tr B, tr(c·A) = c·tr A, <span class="m">tr(AB) = tr(BA)</span>, tr A = λ₁ + … + λₙ.</p><p><b>Example.</b> tr {{3,1;0,2}} = 3 + 2 = 5, the sum of the eigenvalues 3 and 2.</p>',
  },
  changebasis: {
    ru: '<p><b>Определение.</b> Пусть столбцы обратимой матрицы P — векторы нового базиса. Если x — координаты вектора в новом базисе, то в стандартном он равен P·x. Матрица того же преобразования в новом базисе: <span class="m">A′ = P⁻¹·A·P</span> (такие матрицы называют подобными). Если у A есть n линейно независимых собственных векторов и P составлена из них, то A′ = diag(λ₁, …, λₙ).</p><p><b>Пример.</b> A = {{3,1;0,2}}, P = {{1,−1;0,1}} (столбцы — собственные векторы). Тогда P⁻¹ = {{1,1;0,1}} и P⁻¹·A·P = {{3,0;0,2}}.</p>',
    en: '<p><b>Definition.</b> Let the columns of an invertible matrix P be the new basis vectors. If x holds a vector’s coordinates in the new basis, the vector in standard coordinates is P·x. The same transformation in the new basis has matrix <span class="m">A′ = P⁻¹·A·P</span> (such matrices are called similar). If A has n linearly independent eigenvectors and P is built from them, then A′ = diag(λ₁, …, λₙ).</p><p><b>Example.</b> A = {{3,1;0,2}}, P = {{1,−1;0,1}} (the columns are eigenvectors). Then P⁻¹ = {{1,1;0,1}} and P⁻¹·A·P = {{3,0;0,2}}.</p>',
  },
  dot: {
    ru: '<p><b>Определение.</b> <span class="m">v·w = v₁w₁ + v₂w₂ + … + vₙwₙ = vᵀw</span>. Длина <span class="m">|v| = √(v·v)</span>, угол: <span class="m">cos θ = v·w / (|v|·|w|)</span>. Векторы ортогональны ⇔ v·w = 0. Свойства: v·w = w·v, линейность по каждому аргументу, v·v ≥ 0 и v·v = 0 только при v = 0.</p><p><b>Пример.</b> (3, 1)·(1, 2) = 3 + 2 = 5. Проекция w = (1, 2) на v = (3, 1): (v·w / v·v)·v = (5/10)·(3, 1) = (1,5; 0,5).</p>',
    en: '<p><b>Definition.</b> <span class="m">v·w = v₁w₁ + v₂w₂ + … + vₙwₙ = vᵀw</span>. Length <span class="m">|v| = √(v·v)</span>, angle: <span class="m">cos θ = v·w / (|v|·|w|)</span>. Vectors are orthogonal ⇔ v·w = 0. Properties: v·w = w·v, linear in each argument, v·v ≥ 0 with v·v = 0 only for v = 0.</p><p><b>Example.</b> (3, 1)·(1, 2) = 3 + 2 = 5. The projection of w = (1, 2) onto v = (3, 1) is (v·w / v·v)·v = (5/10)·(3, 1) = (1.5, 0.5).</p>',
  },
  cross: {
    ru: '<p><b>Определение.</b> Для v, w ∈ ℝ³: <span class="m">v × w = (v₂w₃ − v₃w₂, v₃w₁ − v₁w₃, v₁w₂ − v₂w₁)</span>. Удобно запоминать как «определитель» с базисными векторами в первой строке: det {{î,ĵ,<span class="kh">k</span>;v₁,v₂,v₃;w₁,w₂,w₃}}. Свойства: <span class="m">|v × w| = |v|·|w|·sin θ</span>; (v × w)·u — объём параллелепипеда на v, w, u со знаком.</p><p><b>Пример.</b> î × ĵ = <span class="kh">k</span>. (1, 2, 0) × (0, 1, 3) = (2·3 − 0·1, 0·0 − 1·3, 1·1 − 2·0) = (6, −3, 1).</p>',
    en: '<p><b>Definition.</b> For v, w ∈ ℝ³: <span class="m">v × w = (v₂w₃ − v₃w₂, v₃w₁ − v₁w₃, v₁w₂ − v₂w₁)</span>. A handy mnemonic is a “determinant” with the basis vectors in the first row: det {{î,ĵ,<span class="kh">k</span>;v₁,v₂,v₃;w₁,w₂,w₃}}. Properties: <span class="m">|v × w| = |v|·|w|·sin θ</span>; (v × w)·u is the signed volume of the parallelepiped on v, w, u.</p><p><b>Example.</b> î × ĵ = <span class="kh">k</span>. (1, 2, 0) × (0, 1, 3) = (2·3 − 0·1, 0·0 − 1·3, 1·1 − 2·0) = (6, −3, 1).</p>',
  },
  orthogonal: {
    ru: '<p><b>Определение.</b> Квадратная матрица Q ортогональна, если <span class="m">QᵀQ = I</span>, то есть её столбцы — единичные попарно перпендикулярные векторы (ортонормированный базис). Тогда |Qv| = |v|, Qv·Qw = v·w, <span class="m">Q⁻¹ = Qᵀ</span>, det Q = ±1.</p><p><b>Пример.</b> Поворот на угол θ: {{cos θ,−sin θ;sin θ,cos θ}}. Для θ = 90°: Q = {{0,−1;1,0}}, и QᵀQ = {{0,1;−1,0}}·{{0,−1;1,0}} = {{1,0;0,1}}.</p>',
    en: '<p><b>Definition.</b> A square matrix Q is orthogonal if <span class="m">QᵀQ = I</span>, that is, its columns are unit vectors perpendicular to each other (an orthonormal basis). Then |Qv| = |v|, Qv·Qw = v·w, <span class="m">Q⁻¹ = Qᵀ</span>, det Q = ±1.</p><p><b>Example.</b> Rotation by θ: {{cos θ,−sin θ;sin θ,cos θ}}. For θ = 90°: Q = {{0,−1;1,0}}, and QᵀQ = {{0,1;−1,0}}·{{0,−1;1,0}} = {{1,0;0,1}}.</p>',
  },
  systems: {
    ru: '<p><b>Определение.</b> Система m уравнений с n неизвестными записывается как A·x = b, где A — матрица коэффициентов m×n. Теорема Кронекера — Капелли: система совместна ⇔ rank A = rank [A | b]. Если x₀ — решение, то все решения имеют вид x₀ + z, где z ∈ Ker A. Для квадратной A с det A ≠ 0 решение единственно; правило Крамера: <span class="m">xᵢ = det Aᵢ / det A</span>, где в Aᵢ i-й столбец заменён на b.</p><p><b>Пример.</b> x + y = 3, x − y = 1, то есть {{1,1;1,−1}}·(x, y) = (3, 1). det = −2. По Крамеру x = det {{3,1;1,−1}} / (−2) = (−4)/(−2) = 2, y = det {{1,3;1,1}} / (−2) = (−2)/(−2) = 1.</p>',
    en: '<p><b>Definition.</b> A system of m equations in n unknowns is written A·x = b, where A is the m×n coefficient matrix. Rouché–Capelli theorem: the system is consistent ⇔ rank A = rank [A | b]. If x₀ is a solution, all solutions are x₀ + z with z ∈ Ker A. For a square A with det A ≠ 0 the solution is unique; Cramer’s rule: <span class="m">xᵢ = det Aᵢ / det A</span>, where Aᵢ has its i-th column replaced by b.</p><p><b>Example.</b> x + y = 3, x − y = 1, that is {{1,1;1,−1}}·(x, y) = (3, 1). det = −2. By Cramer, x = det {{3,1;1,−1}} / (−2) = (−4)/(−2) = 2 and y = det {{1,3;1,1}} / (−2) = (−2)/(−2) = 1.</p>',
  },
  gauss: {
    ru: '<p><b>Определение.</b> Матрица имеет ступенчатый вид, если первый ненулевой (ведущий) элемент каждой строки стоит правее ведущего элемента предыдущей, а нулевые строки — внизу. Элементарные преобразования строк равносильны умножению слева на обратимые элементарные матрицы, поэтому не меняют ранг и решения A·x = b. Чтобы найти A⁻¹, расширенную матрицу [A | I] приводят к виду [I | A⁻¹].</p><p><b>Пример.</b> Система x + 2y = 3, 2x + 5y = 8: {{1,2,3;2,5,8}} → (из второй строки вычесть первую, умноженную на 2) → {{1,2,3;0,1,2}}. Отсюда y = 2, затем x = 3 − 2·2 = −1.</p>',
    en: '<p><b>Definition.</b> A matrix is in row echelon form if the first nonzero (leading) entry of each row lies to the right of the leading entry of the row above, and zero rows are at the bottom. Elementary row operations amount to multiplying on the left by invertible elementary matrices, so they preserve the rank and the solutions of A·x = b. To find A⁻¹, row-reduce the augmented matrix [A | I] to [I | A⁻¹].</p><p><b>Example.</b> The system x + 2y = 3, 2x + 5y = 8: {{1,2,3;2,5,8}} → (subtract twice the first row from the second) → {{1,2,3;0,1,2}}. So y = 2, then x = 3 − 2·2 = −1.</p>',
  },
  nonsquare: {
    ru: '<p><b>Определение.</b> Матрица A размера m×n задаёт линейное отображение ℝⁿ → ℝᵐ. Всегда rank A ≤ min(m, n). При m &lt; n ядро нетривиально: dim Ker A ≥ n − m. При m &gt; n образ не может быть всем ℝᵐ. Произведение A·B определено, если число столбцов A равно числу строк B.</p><p><b>Пример.</b> {{1,0;0,1;1,1}}·(x, y) = (x, y, x + y): плоскость ℝ² ложится в 3D как плоскость z = x + y. А {{1,0,0;0,1,0}} — проекция (x, y, z) ↦ (x, y), её ядро — ось z.</p>',
    en: '<p><b>Definition.</b> An m×n matrix A defines a linear map ℝⁿ → ℝᵐ. Always rank A ≤ min(m, n). When m &lt; n the kernel is nontrivial: dim Ker A ≥ n − m. When m &gt; n the image can’t be all of ℝᵐ. The product A·B is defined when the number of columns of A equals the number of rows of B.</p><p><b>Example.</b> {{1,0;0,1;1,1}}·(x, y) = (x, y, x + y): the plane ℝ² sits in 3D as the plane z = x + y. And {{1,0,0;0,1,0}} is the projection (x, y, z) ↦ (x, y), whose kernel is the z-axis.</p>',
  },
  complexeig: {
    ru: '<p><b>Определение.</b> Если у вещественной матрицы 2×2 tr² − 4·det &lt; 0, то её собственные значения λ = a ± bi, где a = tr/2, b = √(4·det − tr²)/2, и |λ|² = det A. Такая матрица подобна {{a,−b;b,a}} = r·{{cos φ,−sin φ;sin φ,cos φ}}, где r = |λ|, φ = arg λ: в подходящем базисе это поворот на φ с растяжением в r раз.</p><p><b>Пример.</b> A = {{1,−1;1,1}}: tr = 2, det = 2, λ = 1 ± i. |λ| = √2, arg λ = 45°: поворот на 45° и растяжение в √2 раз.</p>',
    en: '<p><b>Definition.</b> If a real 2×2 matrix has tr² − 4·det &lt; 0, its eigenvalues are λ = a ± bi with a = tr/2, b = √(4·det − tr²)/2, and |λ|² = det A. Such a matrix is similar to {{a,−b;b,a}} = r·{{cos φ,−sin φ;sin φ,cos φ}}, where r = |λ| and φ = arg λ: in a suitable basis it is a rotation by φ combined with scaling by r.</p><p><b>Example.</b> A = {{1,−1;1,1}}: tr = 2, det = 2, λ = 1 ± i. |λ| = √2, arg λ = 45°: a 45° rotation with scaling by √2.</p>',
  },
  symmetric: {
    ru: '<p><b>Определение.</b> Матрица A симметрична, если Aᵀ = A, то есть aᵢⱼ = aⱼᵢ. Спектральная теорема: у вещественной симметричной матрицы все собственные значения вещественны и есть ортонормированный базис из собственных векторов, то есть <span class="m">A = Q·D·Qᵀ</span>, где Q ортогональна, а D диагональна.</p><p><b>Пример.</b> A = {{2,1;1,2}}: λ₁ = 3 с вектором (1, 1), λ₂ = 1 с вектором (−1, 1). Векторы перпендикулярны: (1, 1)·(−1, 1) = 0.</p>',
    en: '<p><b>Definition.</b> A is symmetric if Aᵀ = A, that is, aᵢⱼ = aⱼᵢ. Spectral theorem: a real symmetric matrix has only real eigenvalues and an orthonormal basis of eigenvectors, so <span class="m">A = Q·D·Qᵀ</span> with Q orthogonal and D diagonal.</p><p><b>Example.</b> A = {{2,1;1,2}}: λ₁ = 3 with vector (1, 1), λ₂ = 1 with vector (−1, 1). The vectors are perpendicular: (1, 1)·(−1, 1) = 0.</p>',
  },
  abstract: {
    ru: '<p><b>Определение.</b> Векторное пространство над ℝ — множество V с операциями сложения и умножения на число, для которых выполнены аксиомы: сложение коммутативно и ассоциативно, есть нулевой элемент и противоположные элементы, 1·v = v, (ab)v = a(bv), a(u + v) = au + av, (a + b)v = av + bv.</p><p><b>Пример.</b> Многочлены степени ≤ 2 с базисом 1, x, x²: многочлен 3 + 2x − x² имеет координаты (3, 2, −1). Производная переводит (c₀, c₁, c₂) в (c₁, 2c₂, 0), то есть задаётся матрицей {{0,1,0;0,0,2;0,0,0}}. Её ядро — константы, ранг равен 2.</p>',
    en: '<p><b>Definition.</b> A vector space over ℝ is a set V with addition and scalar multiplication satisfying the axioms: addition is commutative and associative, there is a zero element and additive inverses, 1·v = v, (ab)v = a(bv), a(u + v) = au + av, (a + b)v = av + bv.</p><p><b>Example.</b> Polynomials of degree ≤ 2 with basis 1, x, x²: the polynomial 3 + 2x − x² has coordinates (3, 2, −1). The derivative sends (c₀, c₁, c₂) to (c₁, 2c₂, 0), so its matrix is {{0,1,0;0,0,2;0,0,0}}. Its kernel is the constants, and its rank is 2.</p>',
  },
  subspace: {
    ru: '<p><b>Определение.</b> Непустое подмножество U векторного пространства V — подпространство, если оно замкнуто относительно сложения и умножения на число: из u, w ∈ U следует u + w ∈ U и c·u ∈ U для любого c. Отсюда 0 ∈ U. Подпространство само является векторным пространством, у него есть базис и размерность.</p><p><b>Пример.</b> U = {(x, y) : y = 2x} — подпространство ℝ²: (a, 2a) + (b, 2b) = (a + b, 2(a + b)) ∈ U и c·(a, 2a) = (ca, 2ca) ∈ U. А {(x, y) : y = 2x + 1} — нет: в нём нет нулевого вектора.</p>',
    en: '<p><b>Definition.</b> A nonempty subset U of a vector space V is a subspace if it is closed under addition and scalar multiplication: u, w ∈ U implies u + w ∈ U and c·u ∈ U for every c. Hence 0 ∈ U. A subspace is itself a vector space, with a basis and a dimension.</p><p><b>Example.</b> U = {(x, y) : y = 2x} is a subspace of ℝ²: (a, 2a) + (b, 2b) = (a + b, 2(a + b)) ∈ U and c·(a, 2a) = (ca, 2ca) ∈ U. But {(x, y) : y = 2x + 1} is not: it lacks the zero vector.</p>',
  },
  cramer: {
    ru: '<p><b>Теорема.</b> Если A — квадратная матрица n×n и det A ≠ 0, то система A·x = b имеет единственное решение <span class="m">xᵢ = det Aᵢ / det A</span>, где Aᵢ — матрица A, в которой i-й столбец заменён на b.</p><p><b>Пример.</b> 2x + y = 5, x + 3y = 5. det {{2,1;1,3}} = 5. Тогда x = det {{5,1;5,3}} / 5 = (15 − 5)/5 = 2, y = det {{2,5;1,5}} / 5 = (10 − 5)/5 = 1. Проверка: 2·2 + 1 = 5, 2 + 3·1 = 5.</p>',
    en: '<p><b>Theorem.</b> If A is a square n×n matrix with det A ≠ 0, the system A·x = b has the unique solution <span class="m">xᵢ = det Aᵢ / det A</span>, where Aᵢ is A with its i-th column replaced by b.</p><p><b>Example.</b> 2x + y = 5, x + 3y = 5. det {{2,1;1,3}} = 5. Then x = det {{5,1;5,3}} / 5 = (15 − 5)/5 = 2 and y = det {{2,5;1,5}} / 5 = (10 − 5)/5 = 1. Check: 2·2 + 1 = 5, 2 + 3·1 = 5.</p>',
  },
};
export const REL = {
  subspace: ['span', 'colspace', 'kernel', 'abstract'],
  cramer: ['systems', 'det', 'inverse'],
  dot: ['transpose', 'orthogonal', 'cross'],
  cross: ['dot', 'volume'],
  orthogonal: ['transpose', 'dot', 'det'],
  systems: ['cramer', 'gauss', 'colspace', 'kernel'],
  gauss: ['rank', 'systems', 'inverse'],
  nonsquare: ['matrix', 'rank', 'kernel'],
  complexeig: ['eigen', 'charpoly'],
  symmetric: ['transpose', 'eigen', 'orthogonal'],
  abstract: ['basis', 'transform', 'eigen'],
  vector: ['lincomb', 'basis'],
  lincomb: ['span', 'basis'],
  basis: ['lincomb', 'changebasis'],
  span: ['dependence', 'colspace'],
  dependence: ['span', 'det'],
  transform: ['matrix', 'composition'],
  matrix: ['transform', 'identity', 'transpose'],
  identity: ['matrix', 'inverse'],
  transpose: ['matrix', 'det'],
  composition: ['matrix', 'inverse'],
  det: ['volume', 'inverse', 'rank'],
  volume: ['det'],
  inverse: ['identity', 'det'],
  rank: ['colspace', 'kernel'],
  colspace: ['span', 'rank'],
  kernel: ['rank', 'eigen'],
  eigen: ['charpoly', 'trace', 'changebasis'],
  charpoly: ['eigen', 'det'],
  trace: ['eigen', 'det'],
  changebasis: ['basis', 'eigen'],
};
export const R30 = (() => {
  const c = Math.cos(Math.PI / 6),
    s = Math.sin(Math.PI / 6);
  return { c, s };
})();
export const SPIRAL = (() => {
  const pts = [];
  let p = [2.3, 0];
  const c = Math.cos(Math.PI / 7) * 0.93,
    s = Math.sin(Math.PI / 7) * 0.93;
  for (let k = 0; k < 26; k++) {
    pts.push(p);
    p = [c * p[0] - s * p[1], s * p[0] + c * p[1]];
  }
  return pts;
})();
export const ILL = {
  vector: {
    o: [45, 108],
    s: 26,
    it: [
      ['grid'],
      ['seg', [0, 0], [3, 0], 'i', 1],
      ['seg', [3, 0], [3, 2], 'j', 1],
      ['v', 3, 2, 'vec', 'v'],
      ['t', 1.5, -0.45, '3', 'i'],
      ['t', 3.4, 1, '2', 'j'],
    ],
  },
  lincomb: {
    o: [55, 112],
    s: 26,
    it: [
      ['grid'],
      ['v', 2, 0, 'i'],
      ['v', 2, 3, 'j', null, 2, 0],
      ['v', 2, 3, 'vec'],
      ['t', 1, -0.45, '2î', 'i'],
      ['t', 2.5, 1.5, '3ĵ', 'j'],
      ['t', 0.45, 2, 'v', 'vec'],
    ],
  },
  basis: {
    o: [45, 92],
    s: 22,
    it: [
      ['tg', [1, 1, 1, -1], 'grid', 0.6],
      ['v', 2, 2, 'i', null, 0, 0, 1, 0.45],
      ['v', 3, 1, 'j', null, 2, 2, 1, 0.55],
      ['v', 1, 1, 'i', 'b₁'],
      ['v', 1, -1, 'j', 'b₂'],
      ['v', 3, 1, 'vec', 'v'],
      ['T', 150, 14, 'v = 2·b₁ + 1·b₂', 'vec', 11],
    ],
  },
  span: {
    o: [100, 72],
    s: 22,
    it: [
      ['grid'],
      ['l', 1, 2, 'span', 0, 4, 0.45],
      ['v', -0.8, -1.6, 'vec', null, 0, 0, 0, 0.55],
      ['v', 1, 2, 'vec', 'v'],
      ['T', 160, 22, 'span(v)', 'span', 12],
    ],
  },
  dependence: {
    o: [0, 0],
    s: 1,
    it: [
      ['mini', 30, 92, 26, [1, 2, 0.5, 1]],
      ['mini', 122, 92, 30, [1.3, 0.4, 0.3, 1.1]],
      ['T', 55, 120, 'det = 0', 'kernel', 12],
      ['T', 150, 120, 'det ≠ 0', 'span', 12],
    ],
  },
  transform: {
    o: [90, 85],
    s: 24,
    it: [
      ['tg', [1, 1, 0, 1]],
      [
        'p',
        [
          [0, 0],
          [1, 0],
          [2, 1],
          [1, 1],
        ],
        'det',
        0.25,
      ],
      ['v', 1, 0, 'i', 'î'],
      ['v', 1, 1, 'j', 'ĵ'],
    ],
  },
  matrix: {
    o: [100, 90],
    s: 26,
    it: [
      ['tg', [1, -1, 1, 1]],
      ['v', 1, 1, 'i', '(1, 1)'],
      ['v', -1, 1, 'j', '(−1, 1)'],
    ],
  },
  identity: {
    o: [70, 100],
    s: 32,
    it: [
      ['grid'],
      [
        'p',
        [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
        ],
        'det',
        0.25,
      ],
      ['v', 1, 0, 'i', 'î'],
      ['v', 0, 1, 'j', 'ĵ'],
      ['T', 150, 32, 'I·v = v', 'axis', 13],
    ],
  },
  transpose: {
    o: [0, 0],
    s: 1,
    it: [
      [
        'raw',
        '<path d="M18 34 h-5 v62 h5 M76 34 h5 v62 h-5 M124 34 h-5 v62 h5 M182 34 h5 v62 h-5" fill="none" stroke="var(--s-axis)" stroke-width="2"/><line x1="18" y1="38" x2="76" y2="92" stroke="var(--s-axis)" stroke-opacity=".35" stroke-dasharray="3 3"/><line x1="124" y1="38" x2="182" y2="92" stroke="var(--s-axis)" stroke-opacity=".35" stroke-dasharray="3 3"/><path d="M62 42 Q66 66 34 84" fill="none" stroke="var(--s-vec)" stroke-width="1.2" stroke-dasharray="2 3"/>',
      ],
      ['T', 32, 50, '1', 'axis', 18],
      ['T', 62, 50, '2', 'i', 18],
      ['T', 32, 80, '3', 'j', 18],
      ['T', 62, 80, '4', 'axis', 18],
      ['T', 100, 64, '→', 'axis', 18],
      ['T', 138, 50, '1', 'axis', 18],
      ['T', 168, 50, '3', 'j', 18],
      ['T', 138, 80, '2', 'i', 18],
      ['T', 168, 80, '4', 'axis', 18],
      ['T', 47, 118, 'A', 'axis', 14],
      ['T', 153, 118, 'Aᵀ', 'axis', 14],
    ],
  },
  composition: {
    o: [0, 0],
    s: 1,
    it: [
      ['mini', 16, 86, 26, [1, 0, 0, 1]],
      ['A', 50, 70, 72, 70, 'axis', 'B'],
      ['mini', 108, 86, 26, [0, -1, 1, 0]],
      ['A', 116, 70, 138, 70, 'axis', 'A'],
      ['mini', 168, 86, 26, [1, -1, 1, 0]],
      ['T', 29, 112, 'I', 'axis', 13],
      ['T', 95, 112, 'B', 'axis', 13],
      ['T', 168, 112, 'A·B', 'axis', 13],
    ],
  },
  det: {
    o: [50, 108],
    s: 24,
    it: [
      ['tg', [2, 1, 0, 1.5]],
      [
        'p',
        [
          [0, 0],
          [2, 0],
          [3, 1.5],
          [1, 1.5],
        ],
        'det',
        0.3,
      ],
      ['v', 2, 0, 'i'],
      ['v', 1, 1.5, 'j'],
      ['t', 1.5, 0.75, 'det = 3', 'det'],
    ],
  },
  volume: {
    o: [55, 118],
    s: 24,
    it: [
      ['l3', [0, 0, 0], [3.5, 0, 0], 'axis', 0, 0.3],
      ['l3', [0, 0, 0], [0, 3, 0], 'axis', 0, 0.3],
      ['l3', [0, 0, 0], [0, 0, 3.6], 'axis', 0, 0.3],
      [
        'p3',
        [
          [0, 0, 0],
          [2, 0, 0],
          [2, 0, 1.5],
          [0, 0, 1.5],
        ],
        'det',
        0.18,
      ],
      [
        'p3',
        [
          [2, 0, 0],
          [2, 1.4, 0],
          [2, 1.4, 1.5],
          [2, 0, 1.5],
        ],
        'det',
        0.18,
      ],
      [
        'p3',
        [
          [0, 0, 1.5],
          [2, 0, 1.5],
          [2, 1.4, 1.5],
          [0, 1.4, 1.5],
        ],
        'det',
        0.18,
      ],
      ['v3', 2, 0, 0, 'i', 'î'],
      ['v3', 0, 1.4, 0, 'j', 'ĵ'],
      ['v3', 0, 0, 1.5, 'k', 'k̂'],
      ['T', 160, 24, 'V = |det|', 'det', 12],
    ],
  },
  inverse: {
    o: [0, 0],
    s: 1,
    it: [
      ['mini', 14, 92, 22, [1, 0, 0, 1]],
      ['A', 42, 66, 62, 66, 'axis', 'A'],
      ['mini', 70, 100, 20, [2, 1, 1, 1]],
      ['A', 136, 66, 156, 66, 'axis', 'A⁻¹'],
      ['mini', 166, 92, 22, [1, 0, 0, 1]],
      ['T', 25, 118, 'I', 'axis', 13],
      ['T', 100, 118, 'A', 'axis', 13],
      ['T', 177, 118, 'I', 'axis', 13],
      ['T', 100, 20, 'A⁻¹·A = I', 'axis', 13],
    ],
  },
  rank: {
    o: [95, 78],
    s: 22,
    it: [
      ['grid'],
      ['tg', [1, 2, 0.5, 1]],
      ['l', 2, 1, 'span', 0, 4, 0.5],
      ['v', 1, 0.5, 'i', 'î'],
      ['v', 2, 1, 'j', 'ĵ'],
      ['T', 160, 124, 'rank = 1', 'span', 12],
    ],
  },
  colspace: {
    o: [95, 78],
    s: 22,
    it: [
      ['grid'],
      ['l', 2, 1, 'span', 0, 4, 0.45],
      ['pt', 2, 1, 'vec', 'b ✓', 0, -12],
      ['pt', -1.5, 1.5, 'kernel', 'b ✗', 0, -12],
      ['T', 160, 124, 'Im A', 'span', 12],
    ],
  },
  kernel: {
    o: [100, 72],
    s: 22,
    it: [
      ['grid'],
      ['l', -2, 1, 'kernel', 1, 2, 0.85],
      ['v', -2, 1, 'vec', 'v'],
      ['pt', 0, 0, 'vec'],
      ['T', 155, 124, 'A·v = 0', 'kernel', 12],
    ],
  },
  eigen: {
    o: [95, 85],
    s: 22,
    it: [
      ['grid'],
      ['l', 1, 0, 'eigen', 1, 1.5, 0.7],
      ['l', -1, 1, 'eigen', 1, 1.5, 0.7],
      ['v', -2, 2, 'eigen', 'A·v', 0, 0, 0, 0.75],
      ['v', -1, 1, 'vec', 'v'],
      ['v', 3, 0, 'eigen', 'A·u', 0, 0, 0, 0.75],
      ['v', 1, 0, 'vec', 'u'],
    ],
  },
  charpoly: {
    o: [25, 96],
    s: 30,
    it: [
      ['seg', [-1, 0], [6, 0], 'axis', 0, 1, 0.45],
      ['seg', [0, -1], [0, 4], 'axis', 0, 1, 0.45],
      ['fn', (x) => x * x - 5 * x + 6, 0.75, 4.3, 'eigen'],
      ['pt', 2, 0, 'vec', '2', 0, 13],
      ['pt', 3, 0, 'vec', '3', 0, 13],
      ['T', 150, 22, 'λ² − 5λ + 6', 'eigen', 12],
    ],
  },
  trace: {
    o: [0, 0],
    s: 1,
    it: [
      [
        'raw',
        '<path d="M62 34 h-7 v62 h7 M138 34 h7 v62 h-7" fill="none" stroke="var(--s-axis)" stroke-width="2"/><circle cx="80" cy="50" r="14" fill="none" stroke="var(--s-det)" stroke-width="1.6"/><circle cx="120" cy="80" r="14" fill="none" stroke="var(--s-det)" stroke-width="1.6"/>',
      ],
      ['T', 80, 50, '3', 'det', 20],
      ['T', 120, 50, '1', 'axis', 20],
      ['T', 80, 80, '0', 'axis', 20],
      ['T', 120, 80, '2', 'det', 20],
      ['T', 100, 120, 'tr = 3 + 2 = 5', 'det', 13],
    ],
  },
  changebasis: {
    o: [100, 80],
    s: 24,
    it: [
      ['grid'],
      ['tg', [1, -1, 0, 1], 'eigen', 0.55],
      ['v', 1, 0, 'i', 'b₁'],
      ['v', -1, 1, 'j', 'b₂'],
      ['T', 160, 124, 'P⁻¹AP', 'eigen', 12],
    ],
  },
  dot: {
    o: [30, 108],
    s: 26,
    it: [
      ['grid'],
      ['l', 3, 1, 'axis', 1, 1, 0.3],
      ['seg', [1, 2], [1.5, 0.5], 'axis', 1, 1.2, 0.75],
      ['v', 1.5, 0.5, 'vec', null],
      ['v', 3, 1, 'i', 'v'],
      ['v', 1, 2, 'j', 'w'],
      ['T', 150, 22, 'v·w = 5', 'vec', 12],
    ],
  },
  cross: {
    o: [60, 112],
    s: 24,
    it: [
      [
        'p3',
        [
          [0, 0, 0],
          [2.4, 0, 0],
          [2.4, 1.8, 0],
          [0, 1.8, 0],
        ],
        'det',
        0.22,
      ],
      ['v3', 2.4, 0, 0, 'i', 'v'],
      ['v3', 0, 1.8, 0, 'j', 'w'],
      ['v3', 0, 0, 3, 'vec', 'v × w'],
    ],
  },
  orthogonal: {
    o: [90, 88],
    s: 32,
    it: [
      ['tg', [R30.c, -R30.s, R30.s, R30.c]],
      [
        'p',
        [
          [0, 0],
          [R30.c, R30.s],
          [R30.c - R30.s, R30.s + R30.c],
          [-R30.s, R30.c],
        ],
        'det',
        0.22,
      ],
      ['v', R30.c, R30.s, 'i', 'î'],
      ['v', -R30.s, R30.c, 'j', 'ĵ'],
      ['T', 160, 126, 'QᵀQ = I', 'det', 12],
    ],
  },
  systems: {
    o: [40, 105],
    s: 24,
    it: [
      ['grid'],
      ['L', 0, 3, 1, -1, 'i', 0, 2, 0.9],
      ['L', 1, 0, 1, 1, 'j', 0, 2, 0.9],
      ['pt', 2, 1, 'vec', '(2, 1)', 16, -10],
      ['T', 95, 116, 'x + y = 3', 'i', 11],
      ['T', 95, 130, 'x − y = 1', 'j', 11],
    ],
  },
  gauss: {
    o: [0, 0],
    s: 1,
    it: [
      [
        'raw',
        '<path d="M24 32 h-5 v50 h5 M88 32 h5 v50 h-5 M124 32 h-5 v50 h5 M188 32 h5 v50 h-5" fill="none" stroke="var(--s-axis)" stroke-width="1.6"/><line x1="66" y1="34" x2="66" y2="80" stroke="var(--s-axis)" stroke-opacity=".5"/><line x1="166" y1="34" x2="166" y2="80" stroke="var(--s-axis)" stroke-opacity=".5"/><circle cx="133" cy="45" r="10" fill="none" stroke="var(--s-vec)" stroke-width="1.5"/><circle cx="153" cy="70" r="10" fill="none" stroke="var(--s-vec)" stroke-width="1.5"/><path d="M122 58 h22 v24 h46" fill="none" stroke="var(--s-vec)" stroke-dasharray="3 3" stroke-opacity=".7"/>',
      ],
      ['T', 33, 45, '1', 'axis', 15],
      ['T', 53, 45, '2', 'axis', 15],
      ['T', 78, 45, '3', 'axis', 15],
      ['T', 33, 70, '2', 'axis', 15],
      ['T', 53, 70, '5', 'axis', 15],
      ['T', 78, 70, '8', 'axis', 15],
      ['T', 104, 57, '→', 'vec', 15],
      ['T', 133, 45, '1', 'axis', 15],
      ['T', 153, 45, '2', 'axis', 15],
      ['T', 178, 45, '3', 'axis', 15],
      ['T', 133, 70, '0', 'axis', 15],
      ['T', 153, 70, '1', 'axis', 15],
      ['T', 178, 70, '2', 'axis', 15],
      ['T', 100, 116, 'y = 2,  x = −1', 'vec', 13],
    ],
  },
  nonsquare: {
    o: [45, 112],
    s: 24,
    it: [
      ['l3', [0, 0, 0], [3.5, 0, 0], 'axis', 0, 0.3],
      ['l3', [0, 0, 0], [0, 3, 0], 'axis', 0, 0.3],
      ['l3', [0, 0, 0], [0, 0, 3], 'axis', 0, 0.3],
      [
        'p3',
        [
          [0, 0, 0],
          [2, 0, 0.9],
          [2, 2, 1.8],
          [0, 2, 0.9],
        ],
        'span',
        0.2,
      ],
      ['v3', 2, 0, 0.9, 'i', 'A·î'],
      ['v3', 0, 2, 0.9, 'j', 'A·ĵ'],
      ['T', 165, 126, 'ℝ² → ℝ³', 'axis', 12],
    ],
  },
  complexeig: {
    o: [95, 72],
    s: 24,
    it: [
      ['grid'],
      ['pl', SPIRAL, 'vec', 1.8, 0.85],
      ['pt', SPIRAL[0][0], SPIRAL[0][1], 'vec'],
      ['v', SPIRAL[1][0], SPIRAL[1][1], 'eigen', null],
      ['v', SPIRAL[0][0], SPIRAL[0][1], 'i', null],
      ['T', 160, 126, '|λ| < 1', 'vec', 12],
    ],
  },
  symmetric: {
    o: [100, 72],
    s: 19,
    it: [
      ['grid'],
      ['e', [2, 1, 1, 2], 'det'],
      ['l', 1, 1, 'eigen', 1, 1.4, 0.7],
      ['l', -1, 1, 'eigen', 1, 1.4, 0.7],
      ['v', 2.12, 2.12, 'eigen', 'λ = 3'],
      ['v', -0.71, 0.71, 'eigen', 'λ = 1'],
    ],
  },
  subspace: {
    o: [100, 72],
    s: 22,
    it: [
      ['grid'],
      ['l', 1, 2, 'span', 0, 3, 0.6],
      ['L', 0, 1, 1, 2, 'kernel', 1, 1.6, 0.75],
      ['pt', 0, 0, 'span'],
      ['pt', 0, 1, 'kernel'],
      ['T', 150, 16, 'y = 2x  ✓', 'span', 11],
      ['T', 150, 130, 'y = 2x + 1  ✗', 'kernel', 11],
    ],
  },
  cramer: {
    o: [50, 108],
    s: 24,
    it: [
      ['grid'],
      [
        'p',
        [
          [0, 0],
          [2, 1],
          [2, 2],
          [0, 1],
        ],
        'det',
        0.3,
      ],
      ['v', 0, 1, 'j', 'ĵ'],
      ['v', 2, 1, 'vec', 'x'],
      ['t', 1, 1, 'x₁', 'det', 13],
      ['T', 148, 18, 'x₁ = det A₁ / det A', 'det', 11],
    ],
  },
  abstract: {
    o: [12, 64],
    s: 20,
    it: [
      ['seg', [-1, 0], [10, 0], 'axis', 0, 1, 0.4],
      ['fn', (x) => 1.2 * Math.sin(x), 0, 8.8, 'i'],
      ['fn', (x) => 0.28 * x - 1, 0, 8.8, 'j'],
      ['fn', (x) => 1.2 * Math.sin(x) + 0.28 * x - 1, 0, 8.8, 'vec'],
      ['T', 40, 128, 'f', 'i', 13],
      ['T', 80, 128, 'g', 'j', 13],
      ['T', 130, 128, 'f + g', 'vec', 13],
    ],
  },
};
export const CHAP = [
  { ru: 'Векторы', en: 'Vectors', ids: ['vector', 'lincomb', 'basis', 'span', 'dependence'] },
  {
    ru: 'Преобразования и матрицы',
    en: 'Transformations and matrices',
    ids: ['transform', 'matrix', 'identity', 'transpose', 'composition'],
  },
  { ru: 'Определитель', en: 'The determinant', ids: ['det', 'volume'] },
  {
    ru: 'Обратная матрица, ранг и ядро',
    en: 'Inverse, rank and kernel',
    ids: ['inverse', 'rank', 'subspace', 'colspace', 'kernel'],
  },
  { ru: 'Смена базиса', en: 'Change of basis', ids: ['changebasis'] },
  { ru: 'Собственные векторы', en: 'Eigenvectors', ids: ['eigen', 'charpoly', 'trace'] },
  {
    ru: 'Ещё',
    en: 'More',
    extra: true,
    ids: [
      'dot',
      'cross',
      'orthogonal',
      'systems',
      'cramer',
      'gauss',
      'nonsquare',
      'complexeig',
      'symmetric',
      'abstract',
    ],
  },
];
