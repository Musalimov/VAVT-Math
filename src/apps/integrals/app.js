import { analyzeX, calcRSX } from './solvers/analysis.js';
import { limF, limFx, limN } from '../../math/expr/limits.js';
import { FNAME, PRINT, TRIG, TXN, fArg, frac, hp, hp0, juxOK, numH, numT, prec, precT, tp, tp0 } from '../../math/expr/print.js';
import { asFactors, dropConst, frank, fromFactors, linAst, linOf, linTerms, padd, pdeg, pder, pdiv, pgcd, pmul, polyAst, polyOf, ppow, pscale, ptrim, pval, sumTerms, tidy, tidyS } from '../../math/expr/poly.js';
import { ALIAS, WORDS, hasInf, parse, parseFx, parseLim, tokenize } from '../../math/expr/parse.js';
import { quadF, singular, tsFinite } from '../../math/expr/numeric.js';
import { EQ, HH, IH, Q, RULES, R_cmul, R_dist, R_divsplit, R_linu, R_neg, R_parts, R_poly, R_powlin, R_prodsum, R_rational, R_sum, R_table, R_trigpow, R_trigsub, R_usub, R_weier, SMP, SX, TAB, VN, cH, cands, checkF, cyclic, dd, dxh, integ, isET, isLogLike, linFac, linFacScale, mark, meth, nonElem, onlyTrigX, pcancel, polyAsc, polyGcd, powForm, propConst, quadInt, quiet, ratAst, ratFun, ratOf, ratRoots, reset, scFactors, sincos, solve, step, subI, withVar } from '../../math/expr/integrate.js';
import { CV, D, FD, FN, Nn, OPS, X, add, compile, div, fn, has, isN, isNum, isPerfSq, key, mul, neg, pow, powParts, replKey, simp, snap, sqrtAst, sub, subst, toFrac } from '../../math/expr/core.js';
import { lang, langFrom } from '../../shared/i18n.js';
(()=>{
'use strict';
/* ---------- математическое ядро: выражения ---------- */
// AST: ['n',v] ['v',name] ['c','pi'|'e'] ['+',a,b] ['-',a,b] ['*',a,b] ['/',a,b] ['^',a,b] ['neg',a] ['f',name,a]

























/* ---------- вычисление ---------- */



/* ---------- производная ---------- */



/* ---------- многочлены ---------- */














/* ---------- множители и приведение ---------- */










/* ---------- разбор ввода ---------- */






/* предел: «1 000» — разряды через пробел (группы по 3 цифры); «1 00», «2 3» — ошибка, а не 1·00 = 0 */


/* ---------- печать ---------- */











/* текст, LaTeX и SymPy */






/* ---------- численное интегрирование (tanh-sinh) ---------- */


/* поиск особых точек на конечном отрезке */

/* ---------- символьное интегрирование с шагами ---------- */





















/* --- правила --- */






































/* --- запуск и проверка --- */



const TX={
ru:{title:'Интегралы',brand:'Интегралы <span class="sub">наглядно</span>',gloss:'Справочник',glossT:'Справочник понятий и методов',settings:'Настройки',canvas:'График функции и площадь под ним',
 zIn:'Приблизить',zOut:'Отдалить',zHome:'Показать весь график',capX:'Скрыть подсказки',capOpen:'Подсказки',grip:'перетащите панель',close:'Закрыть',drag:'Перетащить',up:'Выше',down:'Ниже',collapse:'Свернуть',
 mI:'Неопределённый',mIT:'Неопределённый интеграл: все первообразные F(x) + C',cLabel:'Постоянная C',
 iNote:'Пределы здесь не нужны: ищем все функции, производная которых равна f(x). Они отличаются только сдвигом на постоянную C.',
 iC:'C — любая постоянная: у функции бесконечно много первообразных, их графики получаются сдвигом вверх-вниз. Подвигайте ползунок C в блоке «Интеграл».',
 v_Fi:'F(x) + C',v_FiS:'значение выбранной первообразной в точке x',v_fx:'F′(x) = f(x)',v_fxS:'наклон касательной к F в точке x',v_C:'Постоянная C',v_CS:'сдвигает график F вверх или вниз',
 noF:'элементарной первообразной нет, F построена численно',
 mA:'Площадь',mF:'Первообразная',mAT:'Определённый интеграл как площадь',mFT:'Первообразная F(x) как накопленная площадь',
 p_integral:'Интеграл',p_presets:'Примеры',p_solve:'Как решить',p_anim:'Анимация',p_values:'Значения',p_riemann:'Суммы Римана',p_methods:'Как выбрать метод',p_show:'Что показывать',p_export:'Экспорт',
 swap:'a ⇄ b',fit:'Вид по графику',more:'Подробности',
 intNote:'Пределы <b style="color:var(--s-lim)">a</b> и <b style="color:var(--s-lim)">b</b> можно тянуть прямо на сцене. Зелёная площадь над осью входит в интеграл со знаком «+», красная под осью — со знаком «−».',
 howType:'Как вводить формулы',
 typeHelp:'<p>Умножение можно не писать: <code>2x</code>, <code>x sin x</code>, <code>(x+1)(x−1)</code>. Степень: <code>x^3</code> или <code>x³</code>, корень: <code>sqrt(x)</code> или <code>√x</code>, модуль: <code>|x|</code>.</p><p>Функции: <code>sin cos tg ctg arcsin arccos arctg ln exp sh ch</code>, константы <code>pi</code> и <code>e</code>, например <code>e^(2x)</code>.</p><p>Пределы — числа или выражения: <code>pi/2</code>, <code>sqrt(3)</code>; бесконечность: <code>inf</code> или <code>-inf</code>.</p>',
 errParse:'Не получилось разобрать формулу. Проверьте скобки и знаки; переменная — только x.',errLim:'Предел должен быть числом: например 0, pi/2 или inf.',errX:'В пределе не должно быть x.',errInfF:'Бесконечность можно писать только в пределах.',
 now:'Сейчас:',search:'Найти: замена, по частям, Симпсон…',noFound:'Ничего не нашлось. Попробуйте другое слово, например «дроби» или «parts».',showDemo:'▶ Показать на сцене',
 play:'▶ Проиграть',zero:'В начало',one:'В конец',progress:'Прогресс t',speed:'Скорость',
 animNote:'При проигрывании площадь набирается слева направо от a до b, а в режиме «Первообразная» вместе с ней растёт график F(x). В режиме «Неопределённый» точка x проходит по графику, показывая наклон F.',
 s_steps:'Решение по шагам',s_answer:'Ответ',s_def:'Определённый интеграл',s_nl:'По формуле Ньютона–Лейбница:',s_check:'Проверка: производная найденной функции совпадает с f(x) во всех контрольных точках.',
 s_idea:'Идея:',s_methods:'Методы:',s_numeric:'Численно',
 s_fail:'Элементарную первообразную этот помощник не нашёл. Значение посчитано численно, а ниже — что ещё можно попробовать.',
 s_failTry:'<li>Посмотрите, нет ли внутри функции, производная которой стоит множителем: тогда помогает замена.</li><li>Произведение многочлена на eˣ, sin, cos или ln обычно берётся по частям.</li><li>Дробь из многочленов раскладывается на простейшие.</li><li>Если ничего не подходит, интеграл может не выражаться в элементарных функциях: тогда значение считают численно.</li>',
 ne:{erf:'Этот интеграл не выражается в элементарных функциях: первообразная от e<sup>−x²</sup> — это функция ошибок erf. Значение посчитано численно.',
  si:'Этот интеграл не выражается в элементарных функциях (интегральный синус, косинус или экспонента). Значение посчитано численно.',
  li:'Этот интеграл не выражается в элементарных функциях (интегральный логарифм li). Значение посчитано численно.',
  fresnel:'Этот интеграл не выражается в элементарных функциях (интегралы Френеля). Значение посчитано численно.'},
 s_imp:'Несобственный интеграл: подынтегральная функция или отрезок неограничены, поэтому значение — это предел.',
 s_impConv:'Предел существует, интеграл сходится:',s_div:'Интеграл расходится: накопленная площадь неограниченно растёт.',
 s_jump:'Первообразная терпит разрыв внутри отрезка, поэтому формулу Ньютона–Лейбница напрямую применять нельзя; значение посчитано численно.',
 s_odd:'Функция нечётная, а отрезок симметричен относительно нуля: площади слева и справа взаимно уничтожаются, интеграл равен 0.',
 s_even:'Функция чётная, а отрезок симметричен: можно посчитать интеграл от 0 до b и удвоить.',
 s_lim:x=>`предел при x → ${x}`,
 v_int:'∫ₐᵇ f(x) dx',v_intS:'значение определённого интеграла',v_num:'Численно',v_numS:'квадратура tanh-sinh',v_rs:'Сумма Римана',v_rsS:(r,n)=>`${r}, n = ${n}`,v_err:'Погрешность суммы',v_errS:'сумма минус точное значение',
 v_abs:'Площадь фигуры',v_absS:'∫|f| dx: всё считаем со знаком «+»',v_pos:'Над осью / под осью',v_posS:'положительная и отрицательная части',v_mean:'Среднее значение f',v_meanS:'высота прямоугольника той же площади',
 v_F:'F(x) в точке x',v_FS:'накопленная площадь от a до x',v_none:'—',v_div:'расходится',s_divOsc:'Интеграл расходится: накопленная площадь колеблется и не стремится ни к какому пределу.',v_undec:'сходимость не определена',s_undec:'Функция колеблется, и колебания затухают, но слишком медленно, чтобы численно надёжно установить сходимость. Проверьте по признаку Дирихле: если ∫sin или ∫cos ограничен, а множитель монотонно стремится к нулю, интеграл сходится.',s_osc:'Интеграл сходится условно: функция колеблется, площади между её нулями образуют знакочередующийся ряд с членами, убывающими к нулю (признак Лейбница). Значение — сумма этого ряда.',v_undef:'не существует',s_undef:'Подынтегральная функция не определена на части отрезка [a, b] (например, корень из отрицательного числа или логарифм неположительного), поэтому определённый интеграл на этом отрезке не существует. Первообразная выше от этого не зависит.',v_noRS:'не определена для несобственного интеграла',
 r_left:'Левые',r_mid:'Средние',r_right:'Правые',r_trap:'Трапеции',r_simp:'Симпсон',rN:'Число отрезков n',rPlay:'▶ n → ∞',rShow:'Показывать на сцене',
 rNote:{left:'Высота каждого прямоугольника — значение f на левом конце отрезка. Погрешность убывает примерно как 1/n.',
  right:'Высота — значение f на правом конце отрезка. Погрешность тоже порядка 1/n, но обычно с другим знаком, чем у левых.',
  mid:'Высота — значение в середине отрезка. Ошибки по краям почти гасят друг друга, поэтому погрешность порядка 1/n²: вдвое больше отрезков — вчетверо точнее.',
  trap:'Вместо прямоугольников трапеции: концы соединяются отрезком. Погрешность порядка 1/n², обычно вдвое больше, чем у средних, и противоположного знака.',
  simp:'На каждой паре отрезков график заменяется параболой через три точки. Погрешность порядка 1/n⁴, поэтому хватает очень небольших n. Нужно чётное n.'},
 rImp:'Для несобственного интеграла суммы Римана не строятся: функция или отрезок неограничены.',
 g_intro:'Задайте себе вопросы по порядку. Первый подходящий ответ подсказывает метод; методы текущего интеграла подсвечены.',
 guide:[['table','Интеграл есть в таблице, возможно, после линейной замены kx + b?','∫cos 3x dx, ∫(2x + 1)³ dx','p_lin'],
  ['linearity','Это сумма или есть постоянный множитель? Разбейте на части.','∫(3x² − 2x + 1) dx','p_poly'],
  ['usub','Внутри стоит функция g(x), а её производная g′(x) — множителем снаружи? Замена u = g(x).','∫x·e<sup>x²</sup> dx, ∫ln x/x dx','p_usub'],
  ['parts','Произведение многочлена на eˣ, sin или cos, или есть ln, arctg, arcsin? По частям.','∫x·eˣ dx, ∫ln x dx','p_parts'],
  ['partial','Дробь из многочленов? Целая часть, затем простейшие дроби или полный квадрат.','∫dx/(x(x + 1))','p_pf'],
  ['trigid','Степени sin и cos? Нечётную степень — заменой, чётные — понижением степени.','∫sin²x dx, ∫sin³x dx','p_sin2'],
  ['trigsub','Корень из квадратного трёхчлена? Тригонометрическая подстановка.','∫√(1 − x²) dx','p_circ'],
  ['nonelem','Ничего не подходит? Возможно, первообразная не элементарна: считайте численно.','∫e<sup>−x²</sup> dx','p_gauss']],
 g_ex:'Пример',
 mn:{table:'Табличный',power:'Степенная формула',linearity:'Линейность',linsub:'Линейная замена',usub:'Замена переменной',parts:'По частям',cyclic:'Циклическое по частям',
  partial:'Простейшие дроби',polydiv:'Целая часть',square:'Полный квадрат',trigid:'Понижение степени',prodsum:'Произведение в сумму',oddpow:'Нечётная степень',trigsub:'Тригонометрическая подстановка',weier:'Универсальная подстановка',numeric:'Численно',nonelem:'Неберущийся',improper:'Несобственный',symmetry:'Симметрия'},
 why:{table:'Подынтегральная функция есть в таблице интегралов — ответ сразу.',power:'Это степени x: каждую интегрируем по формуле xⁿ → xⁿ⁺¹/(n + 1).',linearity:'Сумму интегрируем по слагаемым, константы выносим.',
  linsub:'Внутри табличной функции стоит линейное выражение kx + b: считаем по таблице и делим на k.',usub:'Множитель снаружи — производная внутренней функции. Замена u превращает интеграл в табличный.',
  parts:'Произведение, где один множитель упрощается при дифференцировании, а другой легко интегрируется: формула по частям.',cyclic:'После двух интегрирований по частям возвращается исходный интеграл — получается уравнение.',
  partial:'Рациональная дробь: раскладываем на простейшие, каждая интегрируется по таблице.',polydiv:'Сначала выделяем целую часть дроби.',square:'Квадратный трёхчлен без корней: выделяем полный квадрат и получаем арктангенс.',
  trigid:'Чётные степени sin и cos понижаются формулами двойного угла.',prodsum:'Произведение синусов и косинусов разных аргументов раскладывается в сумму, и каждое слагаемое табличное.',oddpow:'Нечётная степень sin или cos: один множитель уходит в дифференциал, остальное через замену.',
  trigsub:'Корень из a² − x² или x² ± a² убирается тригонометрической подстановкой.',weier:'Рациональное выражение от sin x и cos x: подстановка t = tg(x/2) делает дробь рациональной.'},
 ideas:{p_pow:'Степенная функция — табличный интеграл.',p_poly:'Многочлен интегрируем почленно.',p_sin:'Табличный интеграл; вся площадь над осью.',p_ln:'Табличный: ∫dx/x = ln|x|, а ln e = 1.',
  p_lin:'Не раскрывайте куб: внутри линейная функция, достаточно поделить на 2.',p_usub:'Производная x² — это 2x, и x уже стоит множителем.',p_lnx:'Производная ln x — это 1/x, она уже в интеграле.',
  p_parts:'u = x упрощается при дифференцировании, eˣ не меняется при интегрировании.',p_xsin:'u = x, dv = sin x dx.',p_lnparts:'Хитрость: dv = dx, а u = ln x.',p_cyc:'Дважды по частям, затем решаем уравнение относительно I.',
  p_atan:'Табличный интеграл с арктангенсом.',p_pf:'1/(x(x + 1)) = 1/x − 1/(x + 1).',p_sq:'Выделяем производную знаменателя и полный квадрат.',p_sin2:'sin²x = (1 − cos 2x)/2.',p_sin3:'Один sin уходит в d(cos x), остальное — многочлен от cos.',
  p_circ:'Подстановка x = sin t; площадь получается как у полукруга.',p_weier:'Универсальная подстановка t = tg(x/2).',p_imp1:'Функция неограничена у нуля, но площадь конечна.',p_imp2:'Бесконечный отрезок, но площадь конечна.',
  p_gauss:'Первообразная не элементарна, но интеграл по всей прямой равен √π.',p_odd:'Нечётная функция на симметричном отрезке: площади взаимно гасятся.',p_div:'Площадь у нуля бесконечна.',p_sinc:'Интегральный синус: только численно.'},
 tog:{bgGrid:'Сетка',coords:'Числа на осях',area:'Площадь',riemann:'Суммы Римана',dots:'Точки выборки',Fcurve:'График F',tangent:'Касательная к F',family:'Семейство F + C',labels:'Подписи',snap:'Привязка к сетке',hints:'Подсказки на сцене'},
 cap:{err:'Формула не разобрана: исправьте её в блоке «Интеграл».',
  pos:v=>`Площадь под графиком на [a, b] равна ${v}. Потяните a и b, чтобы изменить отрезок.`,
  neg:v=>`График ниже оси, поэтому интеграл отрицателен: ${v}. Площадь фигуры при этом положительна.`,
  mix:(p,n,v)=>`Над осью ${p}, под осью ${n}: интеграл — их разность, ${v}.`,
  rev:'a > b: при перестановке пределов интеграл меняет знак.',
  riem:(r,n,s,e)=>`${r}, n = ${n}: сумма ${s}, погрешность ${e}. Увеличьте n — сумма приблизится к интегралу.`,
  imp:'Несобственный интеграл: площадь уходит в бесконечность по ширине или по высоте, а значение — это предел.',
  div:'Интеграл расходится: площадь у особой точки бесконечна.',
  F:(x,F,f)=>`F(${x}) = ${F} — площадь от a до x. Наклон касательной к F равен f(${x}) = ${f}: это основная теорема анализа.`,
  F0:'Тяните точку x на оси: F(x) накапливает площадь под f от a до x.',
  Ih:'Показан только график f. Включите «График F» в блоке «Что показывать» или клавишей V, чтобы увидеть первообразную.',
  undef:'f(x) не определена на части отрезка [a, b], поэтому интеграл на нём не существует. Выберите другие пределы.',
  I:(x,f)=>`Синий график — f, жёлтый — первообразная F(x) + C. В точке x = ${x} наклон касательной к F равен f(x) = ${f}. Меняйте C: график сдвигается, а наклоны остаются теми же.`,
  In:'Элементарной первообразной нет, поэтому F построена численно как накопленная площадь от фиксированной точки. Её наклон всё равно равен f(x).'},
 xPng:'Снимок PNG',xVid:'Видео анимации',xStamp:'Добавлять интеграл на изображение',xCopy:'Копировать',fmtText:'Текст',
 xNoDl:'Сохранение файлов недоступно в этом окне. Откройте страницу в claude.ai.',xNoVid:'Этот браузер не умеет записывать видео с холста.',xRec:'Записываю анимацию…',xSaved:'Файл передан на сохранение.',xBusy:'Окно сохранения уже открыто, попробуйте чуть позже.',xFail:'Не удалось сохранить файл.',xCopied:'Скопировано.',xSelect:'Текст выделен: нажмите Ctrl+C или ⌘C.',
 keys:'Горячие клавиши',keysNote:'Работают в любой раскладке и не срабатывают, пока курсор стоит в поле ввода.',showKeys:'Показать список',s_reset:'Сброс',seeAlso:'См. также:',on:'вкл',off:'выкл',
 k_play:'проиграть анимацию',k_t:'шаг по t на 0,05',k_t2:'шаг по t на 0,25',k_t01:'t = 0 / t = 1',k_pre:'примеры по порядку',k_mode:'площадь → F(x) → неопределённый',k_riem:'суммы Римана вкл/выкл',k_n:'n меньше / больше',k_rule:'следующее правило сумм',k_rplay:'n → ∞',
 k_swap:'поменять a и b',k_Fc:'график F вкл/выкл',k_tan:'касательная к F',k_fam:'семейство F + C',k_grid:'сетка',k_lab:'подписи',k_hint:'подсказки на сцене',k_zoom:'масштаб',k_home:'показать весь график',k_png:'снимок PNG',k_vid:'видео анимации',k_gloss:'открыть справочник',k_keys:'этот список',k_esc:'закрыть окно',
 tabI:'Интуиция',tabF:'Строго',readOf:(a,b)=>`Прочитано ${a} из ${b}`,readReset:'Сбросить отметки',readMark:'Отметить прочитанным',readDone:'✓ Прочитано',
 s_lang:'Язык',s_ui:'Тема интерфейса',ui_auto:'Как в системе',ui_light:'Светлая',ui_dark:'Тёмная',s_dock:'Где стоит панель',d_auto:'Авто',d_right:'Справа',d_left:'Слева',d_bottom:'Снизу',d_float:'Плавает',
 s_w:'Ширина боковой панели',s_h:'Высота нижней панели',s_f:'Размер текста интерфейса',s_l:'Толщина линий на сцене',s_pal:'Палитра сцены',palNote:'Любой цвет можно поменять вручную, тогда палитра станет «Своя».',
 s_blocks:'Блоки',blocksNote:'Порядок блоков меняется перетаскиванием за ⠿ или стрелками ↑ ↓ в заголовке. Нажатие на заголовок сворачивает блок. Всё запоминается в этом браузере.',resetOrder:'Вернуть порядок блоков',resetAll:'Сбросить все настройки',
 pal:{classic:'Классика',paper:'Бумага',neon:'Неон',nord:'Норд',custom:'Своя'},
 colors:{bg:'Фон сцены',bgGrid:'Сетка',axis:'Оси и текст',f:'График f',F:'График F',pos:'Площадь «+»',neg:'Площадь «−»',rect:'Прямоугольники',lim:'Пределы a, b',tan:'Касательная'},
 limA:'Нижний предел a',limB:'Верхний предел b',fxA:'Подынтегральная функция f(x)'},
en:{title:'Integrals',brand:'Integrals <span class="sub">visually</span>',gloss:'Glossary',glossT:'Glossary of concepts and methods',settings:'Settings',canvas:'Function graph and the area under it',
 zIn:'Zoom in',zOut:'Zoom out',zHome:'Fit the graph',capX:'Hide hints',capOpen:'Hints',grip:'drag the panel',close:'Close',drag:'Drag',up:'Up',down:'Down',collapse:'Collapse',
 mI:'Indefinite',mIT:'Indefinite integral: all antiderivatives F(x) + C',cLabel:'Constant C',
 iNote:'No limits needed here: we look for every function whose derivative is f(x). They differ only by a shift C.',
 iC:'C is any constant: a function has infinitely many antiderivatives, and their graphs are vertical shifts of each other. Move the C slider in the Integral block.',
 v_Fi:'F(x) + C',v_FiS:'value of the chosen antiderivative at x',v_fx:'F′(x) = f(x)',v_fxS:'slope of the tangent to F at x',v_C:'Constant C',v_CS:'shifts the graph of F up or down',
 noF:'no elementary antiderivative, F is computed numerically',
 mA:'Area',mF:'Antiderivative',mAT:'Definite integral as area',mFT:'Antiderivative F(x) as accumulated area',
 p_integral:'Integral',p_presets:'Examples',p_solve:'How to solve',p_anim:'Animation',p_values:'Values',p_riemann:'Riemann sums',p_methods:'Choosing a method',p_show:'Show',p_export:'Export',
 swap:'a ⇄ b',fit:'Fit to graph',more:'Details',
 intNote:'Drag the limits <b style="color:var(--s-lim)">a</b> and <b style="color:var(--s-lim)">b</b> on the scene. Green area above the axis counts with “+”, red area below it with “−”.',
 howType:'How to type formulas',
 typeHelp:'<p>Multiplication can be implicit: <code>2x</code>, <code>x sin x</code>, <code>(x+1)(x−1)</code>. Powers: <code>x^3</code> or <code>x³</code>, roots: <code>sqrt(x)</code> or <code>√x</code>, absolute value: <code>|x|</code>.</p><p>Functions: <code>sin cos tan cot arcsin arccos arctan ln exp sinh cosh</code>, constants <code>pi</code> and <code>e</code>, e.g. <code>e^(2x)</code>.</p><p>Limits are numbers or expressions: <code>pi/2</code>, <code>sqrt(3)</code>; infinity: <code>inf</code> or <code>-inf</code>.</p>',
 errParse:'Couldn’t read the formula. Check the brackets and signs; the only variable is x.',errLim:'A limit must be a number: for example 0, pi/2 or inf.',errX:'A limit can’t contain x.',errInfF:'Infinity is allowed only in the limits.',
 now:'Now:',search:'Find: substitution, by parts, Simpson…',noFound:'Nothing found. Try another word, such as “fractions” or “parts”.',showDemo:'▶ Show on the scene',
 play:'▶ Play',zero:'Start',one:'End',progress:'Progress t',speed:'Speed',
 animNote:'Playing fills the area from a to b; in Antiderivative mode the graph of F(x) grows along with it. In Indefinite mode the point x moves along the graph, showing the slope of F.',
 s_steps:'Step-by-step solution',s_answer:'Answer',s_def:'Definite integral',s_nl:'By the Newton–Leibniz formula:',s_check:'Check: the derivative of the result matches f(x) at every test point.',
 s_idea:'Idea:',s_methods:'Methods:',s_numeric:'Numerically',
 s_fail:'This helper didn’t find an elementary antiderivative. The value is computed numerically; below is what else you can try.',
 s_failTry:'<li>Look for an inner function whose derivative is a factor: then substitution works.</li><li>A polynomial times eˣ, sin, cos or ln usually goes by parts.</li><li>A ratio of polynomials splits into partial fractions.</li><li>If nothing fits, the antiderivative may not be elementary; then the value is computed numerically.</li>',
 ne:{erf:'This integral has no elementary antiderivative: the antiderivative of e<sup>−x²</sup> is the error function erf. The value is computed numerically.',
  si:'This integral has no elementary antiderivative (sine, cosine or exponential integral). The value is computed numerically.',
  li:'This integral has no elementary antiderivative (logarithmic integral li). The value is computed numerically.',
  fresnel:'This integral has no elementary antiderivative (Fresnel integrals). The value is computed numerically.'},
 s_imp:'Improper integral: the integrand or the interval is unbounded, so the value is a limit.',
 s_impConv:'The limit exists, so the integral converges:',s_div:'The integral diverges: the accumulated area grows without bound.',
 s_jump:'The antiderivative jumps inside the interval, so Newton–Leibniz can’t be applied directly; the value is computed numerically.',
 s_odd:'The function is odd and the interval is symmetric about zero: the areas on the left and right cancel, so the integral is 0.',
 s_even:'The function is even and the interval is symmetric: integrate from 0 to b and double it.',
 s_lim:x=>`limit as x → ${x}`,
 v_int:'∫ₐᵇ f(x) dx',v_intS:'value of the definite integral',v_num:'Numerically',v_numS:'tanh-sinh quadrature',v_rs:'Riemann sum',v_rsS:(r,n)=>`${r}, n = ${n}`,v_err:'Error of the sum',v_errS:'sum minus the exact value',
 v_abs:'Area of the region',v_absS:'∫|f| dx: everything counts as “+”',v_pos:'Above / below the axis',v_posS:'positive and negative parts',v_mean:'Mean value of f',v_meanS:'height of a rectangle with the same area',
 v_F:'F(x) at x',v_FS:'area accumulated from a to x',v_none:'—',v_div:'diverges',s_divOsc:'The integral diverges: the accumulated area oscillates and tends to no limit.',v_undec:'convergence undetermined',s_undec:'The function oscillates and the oscillations decay, but too slowly to establish convergence numerically. Check with Dirichlet’s test: if ∫sin or ∫cos is bounded and the factor tends monotonically to zero, the integral converges.',s_osc:'The integral converges conditionally: the function oscillates, and the areas between its zeros form an alternating series with terms decreasing to zero (Leibniz test). The value is the sum of that series.',v_undef:'doesn’t exist',s_undef:'The integrand is undefined on part of [a, b] (for example, the root of a negative number or the log of a non-positive one), so the definite integral doesn’t exist on this interval. The antiderivative above is unaffected.',v_noRS:'undefined for an improper integral',
 r_left:'Left',r_mid:'Midpoint',r_right:'Right',r_trap:'Trapezoid',r_simp:'Simpson',rN:'Number of pieces n',rPlay:'▶ n → ∞',rShow:'Show on the scene',
 rNote:{left:'Each rectangle’s height is the value of f at the left end of its piece. The error shrinks roughly like 1/n.',
  right:'The height is the value of f at the right end. The error is also about 1/n, usually with the opposite sign to the left sum.',
  mid:'The height is the value at the middle of the piece. Errors on both sides nearly cancel, so the error is about 1/n²: twice the pieces, four times the accuracy.',
  trap:'Trapezoids instead of rectangles: the ends are joined by a segment. The error is about 1/n², usually twice the midpoint error and of opposite sign.',
  simp:'On each pair of pieces the graph is replaced by a parabola through three points. The error is about 1/n⁴, so small n is enough. n must be even.'},
 rImp:'Riemann sums aren’t built for an improper integral: the function or the interval is unbounded.',
 g_intro:'Ask yourself these questions in order. The first “yes” suggests the method; the methods of the current integral are highlighted.',
 guide:[['table','Is it in the table, maybe after a linear substitution kx + b?','∫cos 3x dx, ∫(2x + 1)³ dx','p_lin'],
  ['linearity','Is it a sum, or is there a constant factor? Split it up.','∫(3x² − 2x + 1) dx','p_poly'],
  ['usub','Is there an inner function g(x) with its derivative g′(x) as a factor outside? Substitute u = g(x).','∫x·e<sup>x²</sup> dx, ∫ln x/x dx','p_usub'],
  ['parts','A polynomial times eˣ, sin or cos, or is there ln, arctan, arcsin? Integrate by parts.','∫x·eˣ dx, ∫ln x dx','p_parts'],
  ['partial','A ratio of polynomials? Divide, then partial fractions or complete the square.','∫dx/(x(x + 1))','p_pf'],
  ['trigid','Powers of sin and cos? Odd power by substitution, even powers by reducing them.','∫sin²x dx, ∫sin³x dx','p_sin2'],
  ['trigsub','A square root of a quadratic? Trigonometric substitution.','∫√(1 − x²) dx','p_circ'],
  ['nonelem','Nothing fits? The antiderivative may not be elementary: compute numerically.','∫e<sup>−x²</sup> dx','p_gauss']],
 g_ex:'Example',
 mn:{table:'Table integral',power:'Power rule',linearity:'Linearity',linsub:'Linear substitution',usub:'Substitution',parts:'By parts',cyclic:'Cyclic by parts',
  partial:'Partial fractions',polydiv:'Polynomial division',square:'Completing the square',trigid:'Power reduction',prodsum:'Product to sum',oddpow:'Odd power',trigsub:'Trig substitution',weier:'Universal substitution',numeric:'Numerical',nonelem:'Non-elementary',improper:'Improper',symmetry:'Symmetry'},
 why:{table:'The integrand is in the table of integrals, so the answer is immediate.',power:'These are powers of x: integrate each with xⁿ → xⁿ⁺¹/(n + 1).',linearity:'Integrate a sum term by term and move constants outside.',
  linsub:'A table function of a linear expression kx + b: use the table and divide by k.',usub:'The outside factor is the derivative of the inner function. Substituting u makes it a table integral.',
  parts:'A product where one factor simplifies when differentiated and the other is easy to integrate: use integration by parts.',cyclic:'After integrating by parts twice the original integral comes back, giving an equation.',
  partial:'A rational function: split it into partial fractions, each a table integral.',polydiv:'First divide out the polynomial part.',square:'A quadratic without real roots: complete the square to get an arctangent.',
  trigid:'Even powers of sin and cos are reduced with double-angle formulas.',prodsum:'A product of sines and cosines of different arguments splits into a sum of table integrals.',oddpow:'An odd power of sin or cos: one factor goes into the differential, the rest by substitution.',
  trigsub:'A root of a² − x² or x² ± a² is removed by a trigonometric substitution.',weier:'A rational expression in sin x and cos x: t = tan(x/2) makes it a rational function.'},
 ideas:{p_pow:'A power function is a table integral.',p_poly:'Integrate the polynomial term by term.',p_sin:'A table integral; all the area is above the axis.',p_ln:'Table integral: ∫dx/x = ln|x|, and ln e = 1.',
  p_lin:'Don’t expand the cube: the inside is linear, just divide by 2.',p_usub:'The derivative of x² is 2x, and x is already a factor.',p_lnx:'The derivative of ln x is 1/x, already in the integral.',
  p_parts:'u = x simplifies when differentiated, eˣ stays the same when integrated.',p_xsin:'u = x, dv = sin x dx.',p_lnparts:'The trick: dv = dx and u = ln x.',p_cyc:'By parts twice, then solve the equation for I.',
  p_atan:'A table integral with arctangent.',p_pf:'1/(x(x + 1)) = 1/x − 1/(x + 1).',p_sq:'Split off the derivative of the denominator and complete the square.',p_sin2:'sin²x = (1 − cos 2x)/2.',p_sin3:'One sin goes into d(cos x), the rest is a polynomial in cos.',
  p_circ:'Substitute x = sin t; the area is that of a half-disc.',p_weier:'The universal substitution t = tan(x/2).',p_imp1:'The function is unbounded near zero, yet the area is finite.',p_imp2:'An infinite interval, yet the area is finite.',
  p_gauss:'No elementary antiderivative, but the integral over the whole line equals √π.',p_odd:'An odd function on a symmetric interval: the areas cancel.',p_div:'The area near zero is infinite.',p_sinc:'The sine integral: numerical only.'},
 tog:{bgGrid:'Grid',coords:'Axis numbers',area:'Area',riemann:'Riemann sums',dots:'Sample points',Fcurve:'Graph of F',tangent:'Tangent to F',family:'Family F + C',labels:'Labels',snap:'Snap to grid',hints:'Hints on the scene'},
 cap:{err:'The formula couldn’t be read: fix it in the Integral block.',
  pos:v=>`The area under the graph on [a, b] is ${v}. Drag a and b to change the interval.`,
  neg:v=>`The graph is below the axis, so the integral is negative: ${v}. The area of the region is still positive.`,
  mix:(p,n,v)=>`Above the axis ${p}, below it ${n}: the integral is their difference, ${v}.`,
  rev:'a > b: swapping the limits flips the sign of the integral.',
  riem:(r,n,s,e)=>`${r}, n = ${n}: sum ${s}, error ${e}. Increase n and the sum approaches the integral.`,
  imp:'Improper integral: the region is unbounded in width or height, and the value is a limit.',
  div:'The integral diverges: the area near the singular point is infinite.',
  F:(x,F,f)=>`F(${x}) = ${F} is the area from a to x. The slope of the tangent to F equals f(${x}) = ${f}: the fundamental theorem of calculus.`,
  F0:'Drag the point x on the axis: F(x) accumulates the area under f from a to x.',
  Ih:'Only the graph of f is shown. Turn on “Graph of F” in the Show block or press V to see the antiderivative.',
  undef:'f(x) is undefined on part of [a, b], so the integral doesn’t exist there. Choose other limits.',
  I:(x,f)=>`Blue is f, yellow is the antiderivative F(x) + C. At x = ${x} the slope of the tangent to F equals f(x) = ${f}. Change C: the graph shifts, the slopes stay the same.`,
  In:'There is no elementary antiderivative, so F is computed numerically as the area accumulated from a fixed point. Its slope still equals f(x).'},
 xPng:'PNG snapshot',xVid:'Animation video',xStamp:'Add the integral to the image',xCopy:'Copy',fmtText:'Text',
 xNoDl:'Saving files isn’t available in this window. Open the page in claude.ai.',xNoVid:'This browser can’t record video from a canvas.',xRec:'Recording the animation…',xSaved:'File handed off for saving.',xBusy:'A save dialog is already open, try again shortly.',xFail:'Couldn’t save the file.',xCopied:'Copied.',xSelect:'Text selected: press Ctrl+C or ⌘C.',
 keys:'Keyboard shortcuts',keysNote:'They work in any keyboard layout and are off while the cursor is in an input field.',showKeys:'Show list',s_reset:'Reset',seeAlso:'See also:',on:'on',off:'off',
 k_play:'play the animation',k_t:'step t by 0.05',k_t2:'step t by 0.25',k_t01:'t = 0 / t = 1',k_pre:'examples in order',k_mode:'area → F(x) → indefinite',k_riem:'Riemann sums on/off',k_n:'fewer / more pieces n',k_rule:'next Riemann rule',k_rplay:'n → ∞',
 k_swap:'swap a and b',k_Fc:'graph of F on/off',k_tan:'tangent to F',k_fam:'family F + C',k_grid:'grid',k_lab:'labels',k_hint:'hints on the scene',k_zoom:'zoom',k_home:'fit the graph',k_png:'PNG snapshot',k_vid:'animation video',k_gloss:'open the glossary',k_keys:'this list',k_esc:'close the window',
 tabI:'Intuition',tabF:'Formal',readOf:(a,b)=>`Read ${a} of ${b}`,readReset:'Clear marks',readMark:'Mark as read',readDone:'✓ Read',
 s_lang:'Language',s_ui:'Interface theme',ui_auto:'System',ui_light:'Light',ui_dark:'Dark',s_dock:'Panel position',d_auto:'Auto',d_right:'Right',d_left:'Left',d_bottom:'Bottom',d_float:'Floating',
 s_w:'Side panel width',s_h:'Bottom panel height',s_f:'Interface text size',s_l:'Line width on the scene',s_pal:'Scene palette',palNote:'You can change any color by hand; the palette then becomes “Custom”.',
 s_blocks:'Blocks',blocksNote:'Reorder blocks by dragging ⠿ or with the ↑ ↓ arrows in their header. Click a header to collapse the block. Everything is remembered in this browser.',resetOrder:'Restore block order',resetAll:'Reset all settings',
 pal:{classic:'Classic',paper:'Paper',neon:'Neon',nord:'Nord',custom:'Custom'},
 colors:{bg:'Scene background',bgGrid:'Grid',axis:'Axes and text',f:'Graph of f',F:'Graph of F',pos:'Area “+”',neg:'Area “−”',rect:'Rectangles',lim:'Limits a, b',tan:'Tangent'},
 limA:'Lower limit a',limB:'Upper limit b',fxA:'Integrand f(x)'}
};
/* ---------- справочник ---------- */
const TERMS=[
 {id:'riemann',ru:['Суммы Римана','Riemann sum','<p>Площадь под кривой трудно посчитать сразу, а площадь прямоугольника — легко. Поэтому отрезок [a, b] режут на n кусочков, над каждым ставят прямоугольник высотой f в какой-нибудь точке и складывают их площади.</p><p>Чем больше n, тем тоньше прямоугольники и тем точнее сумма. Предел этих сумм при n → ∞ и называется определённым интегралом. Нажмите «n → ∞» в блоке «Суммы Римана», чтобы увидеть, как сумма подходит к ответу.</p>'],
  en:['Riemann sums','сумма Римана','<p>The area under a curve is hard to find directly, but the area of a rectangle is easy. So the interval [a, b] is cut into n pieces, a rectangle with height f at some point is placed over each piece, and their areas are added up.</p><p>The larger n, the thinner the rectangles and the more accurate the sum. The limit of these sums as n → ∞ is the definite integral. Press “n → ∞” in the Riemann sums block to watch the sum approach the answer.</p>']},
 {id:'definite',ru:['Определённый интеграл','definite integral','<p>Число <span class="m">∫ₐᵇ f(x) dx</span> — ориентированная площадь между графиком f и осью x на отрезке от a до b. Знак ∫ — вытянутая буква S от слова «сумма», а dx напоминает о ширине бесконечно тонких полосок.</p><p>Ответ — это число, а не функция: он зависит от f, a и b, но не от того, какой буквой обозначена переменная. <span class="m">∫₀² x² dx</span> и <span class="m">∫₀² t² dt</span> — одно и то же.</p>'],
  en:['Definite integral','определённый интеграл','<p>The number <span class="m">∫ₐᵇ f(x) dx</span> is the signed area between the graph of f and the x-axis from a to b. The sign ∫ is a stretched S for “sum”, and dx reminds us of the width of infinitely thin strips.</p><p>The result is a number, not a function: it depends on f, a and b but not on the name of the variable. <span class="m">∫₀² x² dx</span> and <span class="m">∫₀² t² dt</span> are the same.</p>']},
 {id:'signed',ru:['Ориентированная площадь','signed area','<p>Интеграл считает площадь <b>со знаком</b>: части над осью x идут с «+», части под осью — с «−». Поэтому <span class="m">∫₀²ᵖ sin x dx = 0</span>: горб над осью и яма под ней одинаковы.</p><p>Если нужна обычная площадь фигуры, интегрируют модуль: <span class="m">∫|f(x)| dx</span>. В блоке «Значения» видны обе величины, а на сцене плюс и минус окрашены разными цветами.</p>'],
  en:['Signed area','ориентированная площадь','<p>The integral counts area <b>with a sign</b>: parts above the x-axis count as “+”, parts below as “−”. That is why <span class="m">∫₀²ᵖ sin x dx = 0</span>: the hump above the axis and the dip below are equal.</p><p>For the ordinary area of a region, integrate the absolute value: <span class="m">∫|f(x)| dx</span>. The Values block shows both, and the scene colors plus and minus differently.</p>']},
 {id:'properties',ru:['Свойства определённого интеграла','properties','<p><b>Линейность:</b> <span class="m">∫(αf + βg) = α∫f + β∫g</span>.</p><p><b>Аддитивность:</b> <span class="m">∫ₐᶜ f = ∫ₐᵇ f + ∫ᵇᶜ f</span> — площади соседних кусков складываются.</p><p><b>Перестановка пределов:</b> <span class="m">∫ᵇₐ f = −∫ₐᵇ f</span>, а <span class="m">∫ₐₐ f = 0</span>. Попробуйте кнопку «a ⇄ b».</p><p><b>Оценка:</b> если m ≤ f ≤ M на [a, b], то <span class="m">m(b − a) ≤ ∫ₐᵇ f ≤ M(b − a)</span>.</p>'],
  en:['Properties of the definite integral','свойства интеграла','<p><b>Linearity:</b> <span class="m">∫(αf + βg) = α∫f + β∫g</span>.</p><p><b>Additivity:</b> <span class="m">∫ₐᶜ f = ∫ₐᵇ f + ∫ᵇᶜ f</span>: areas of neighbouring pieces add up.</p><p><b>Swapping limits:</b> <span class="m">∫ᵇₐ f = −∫ₐᵇ f</span>, and <span class="m">∫ₐₐ f = 0</span>. Try the “a ⇄ b” button.</p><p><b>Bounds:</b> if m ≤ f ≤ M on [a, b], then <span class="m">m(b − a) ≤ ∫ₐᵇ f ≤ M(b − a)</span>.</p>']},
 {id:'antideriv',ru:['Первообразная','antiderivative','<p>Функция F — первообразная для f, если <span class="m">F′(x) = f(x)</span>. Это действие, обратное дифференцированию: для <span class="m">f = 2x</span> подходит <span class="m">F = x²</span>.</p><p>Первообразных бесконечно много: <span class="m">x² + 5</span> тоже годится, ведь производная константы — ноль. Все они отличаются на постоянную и получаются сдвигом одного графика вверх-вниз. Включите режим «Первообразная» и «Семейство F + C», чтобы это увидеть.</p>'],
  en:['Antiderivative','первообразная','<p>F is an antiderivative of f if <span class="m">F′(x) = f(x)</span>. It reverses differentiation: for <span class="m">f = 2x</span>, <span class="m">F = x²</span> works.</p><p>There are infinitely many antiderivatives: <span class="m">x² + 5</span> works too, since the derivative of a constant is zero. They all differ by a constant and are vertical shifts of one graph. Switch to Antiderivative mode and turn on “Family F + C” to see this.</p>']},
 {id:'indefinite',ru:['Неопределённый интеграл','indefinite integral, +C','<p>Запись <span class="m">∫f(x) dx = F(x) + C</span> обозначает сразу всё семейство первообразных. Буква C — произвольная постоянная; её нельзя забывать, иначе ответ неполон.</p><p>В отличие от определённого интеграла, это функция, а не число. Связь между ними даёт формула Ньютона–Лейбница: при подстановке пределов C сокращается.</p>'],
  en:['Indefinite integral','неопределённый интеграл','<p>The notation <span class="m">∫f(x) dx = F(x) + C</span> stands for the whole family of antiderivatives. C is an arbitrary constant; leaving it out makes the answer incomplete.</p><p>Unlike the definite integral, this is a function, not a number. The Newton–Leibniz formula connects the two: when you plug in the limits, C cancels.</p>']},
 {id:'ftc',ru:['Основная теорема анализа','fundamental theorem, Newton–Leibniz','<p>Две на вид разные задачи — найти площадь и найти первообразную — оказываются одной. Если накапливать площадь под f от a до x, получится функция <span class="m">F(x) = ∫ₐˣ f(t) dt</span>, и её скорость роста в каждой точке равна высоте графика: <span class="m">F′(x) = f(x)</span>.</p><p>Отсюда формула Ньютона–Лейбница: <span class="m">∫ₐᵇ f(x) dx = F(b) − F(a)</span> для любой первообразной F. Вместо предела сумм достаточно найти F и вычесть два числа.</p><p>В режиме «Первообразная» тяните точку x: наклон касательной к F совпадает со значением f.</p>'],
  en:['Fundamental theorem of calculus','основная теорема анализа','<p>Two seemingly different problems, finding an area and finding an antiderivative, turn out to be one. Accumulate the area under f from a to x and you get the function <span class="m">F(x) = ∫ₐˣ f(t) dt</span>; its rate of growth at each point equals the height of the graph: <span class="m">F′(x) = f(x)</span>.</p><p>This gives the Newton–Leibniz formula: <span class="m">∫ₐᵇ f(x) dx = F(b) − F(a)</span> for any antiderivative F. Instead of a limit of sums, find F and subtract two numbers.</p><p>In Antiderivative mode, drag the point x: the slope of the tangent to F matches the value of f.</p>']},
 {id:'table',ru:['Таблица интегралов','table of integrals','<p>Основные интегралы получаются чтением таблицы производных справа налево:</p><p><span class="m">∫xⁿ dx = xⁿ⁺¹/(n + 1)</span> при n ≠ −1, <span class="m">∫dx/x = ln|x|</span>, <span class="m">∫eˣ dx = eˣ</span>, <span class="m">∫aˣ dx = aˣ/ln a</span>, <span class="m">∫sin x dx = −cos x</span>, <span class="m">∫cos x dx = sin x</span>, <span class="m">∫dx/cos²x = tg x</span>, <span class="m">∫dx/(1 + x²) = arctg x</span>, <span class="m">∫dx/√(1 − x²) = arcsin x</span>, <span class="m">∫dx/√(x² ± a²) = ln|x + √(x² ± a²)|</span>.</p><p>Все методы интегрирования — это способы свести интеграл к одной из этих строк.</p>'],
  en:['Table of integrals','таблица интегралов','<p>The basic integrals come from reading the table of derivatives backwards:</p><p><span class="m">∫xⁿ dx = xⁿ⁺¹/(n + 1)</span> for n ≠ −1, <span class="m">∫dx/x = ln|x|</span>, <span class="m">∫eˣ dx = eˣ</span>, <span class="m">∫aˣ dx = aˣ/ln a</span>, <span class="m">∫sin x dx = −cos x</span>, <span class="m">∫cos x dx = sin x</span>, <span class="m">∫dx/cos²x = tan x</span>, <span class="m">∫dx/(1 + x²) = arctan x</span>, <span class="m">∫dx/√(1 − x²) = arcsin x</span>, <span class="m">∫dx/√(x² ± a²) = ln|x + √(x² ± a²)|</span>.</p><p>Every integration method is a way of reducing an integral to one of these lines.</p>']},
 {id:'linearity',ru:['Линейность и почленное интегрирование','linearity','<p>Интеграл суммы равен сумме интегралов, а постоянный множитель выносится: <span class="m">∫(3x² − 2x + 1) dx = 3∫x² dx − 2∫x dx + ∫dx = x³ − x² + x + C</span>.</p><p>Это первый шаг почти любого решения: раскрыть скобки, поделить почленно, вынести числа — и посмотреть, не стали ли кусочки табличными. Важно: интеграл произведения <b>не равен</b> произведению интегралов.</p>'],
  en:['Linearity and term-by-term integration','линейность','<p>The integral of a sum is the sum of the integrals, and a constant factor moves outside: <span class="m">∫(3x² − 2x + 1) dx = 3∫x² dx − 2∫x dx + ∫dx = x³ − x² + x + C</span>.</p><p>It is the first step of almost any solution: expand, divide term by term, move the numbers out, and check whether the pieces are now in the table. Note that the integral of a product is <b>not</b> the product of the integrals.</p>']},
 {id:'linsub',ru:['Линейная замена','f(kx + b)','<p>Если внутри табличной функции стоит линейное выражение <span class="m">kx + b</span>, интеграл берётся по таблице, а результат делится на k: <span class="m">∫f(kx + b) dx = F(kx + b)/k</span>.</p><p>Например, <span class="m">∫cos 3x dx = sin 3x / 3</span>, <span class="m">∫(2x + 1)³ dx = (2x + 1)⁴/8</span>. Деление на k компенсирует то, что при дифференцировании F(kx + b) появляется множитель k.</p>'],
  en:['Linear substitution','f(kx + b)','<p>If a table function has a linear expression <span class="m">kx + b</span> inside, use the table and divide by k: <span class="m">∫f(kx + b) dx = F(kx + b)/k</span>.</p><p>For example, <span class="m">∫cos 3x dx = sin 3x / 3</span>, <span class="m">∫(2x + 1)³ dx = (2x + 1)⁴/8</span>. Dividing by k cancels the factor k that appears when F(kx + b) is differentiated.</p>']},
 {id:'usub',ru:['Замена переменной','u-substitution, подведение под дифференциал','<p>Главный приём. Ищем внутри интеграла функцию <span class="m">g(x)</span>, производная которой стоит снаружи множителем. Обозначаем <span class="m">u = g(x)</span>, тогда <span class="m">du = g′(x) dx</span>, и интеграл переписывается через u.</p><p>Пример: в <span class="m">∫x·e^(x²) dx</span> внутри экспоненты стоит x², а x снаружи — почти её производная. <span class="m">u = x², du = 2x dx</span>: интеграл равен <span class="m">½∫eᵘ du = ½e^(x²) + C</span>.</p><p>Это правило дифференцирования сложной функции, прочитанное наоборот. Признак: «функция от чего-то, умноженная на производную этого чего-то».</p>'],
  en:['Substitution','замена переменной','<p>The key technique. Look inside the integral for a function <span class="m">g(x)</span> whose derivative is a factor outside. Set <span class="m">u = g(x)</span>, then <span class="m">du = g′(x) dx</span>, and rewrite the integral in u.</p><p>Example: in <span class="m">∫x·e^(x²) dx</span>, x² sits inside the exponential and x outside is almost its derivative. <span class="m">u = x², du = 2x dx</span>: the integral is <span class="m">½∫eᵘ du = ½e^(x²) + C</span>.</p><p>It is the chain rule read backwards. The tell: “a function of something, times the derivative of that something”.</p>']},
 {id:'defsub',ru:['Замена в определённом интеграле','substitution with limits','<p>При замене <span class="m">u = g(x)</span> в определённом интеграле можно сразу пересчитать пределы: <span class="m">∫ₐᵇ f(g(x))g′(x) dx = ∫ f(u) du</span> от <span class="m">g(a)</span> до <span class="m">g(b)</span>. Тогда возвращаться к x не нужно.</p><p>Пример: <span class="m">∫₀¹ x·e^(x²) dx</span>, u = x²: при x = 0 u = 0, при x = 1 u = 1, итого <span class="m">½∫₀¹ eᵘ du = (e − 1)/2</span>.</p><p>Замена должна быть монотонной и гладкой на отрезке, иначе пределы пересчитываются неверно.</p>'],
  en:['Substitution in a definite integral','замена с пределами','<p>When substituting <span class="m">u = g(x)</span> in a definite integral, you can convert the limits right away: <span class="m">∫ₐᵇ f(g(x))g′(x) dx = ∫ f(u) du</span> from <span class="m">g(a)</span> to <span class="m">g(b)</span>. Then there is no need to go back to x.</p><p>Example: <span class="m">∫₀¹ x·e^(x²) dx</span>, u = x²: x = 0 gives u = 0, x = 1 gives u = 1, so <span class="m">½∫₀¹ eᵘ du = (e − 1)/2</span>.</p><p>The substitution must be smooth and monotonic on the interval, otherwise the new limits are wrong.</p>']},
 {id:'symmetry',ru:['Чётность и симметричный отрезок','odd and even functions','<p>Если f нечётная, <span class="m">f(−x) = −f(x)</span>, то на отрезке [−a, a] площадь слева равна площади справа с обратным знаком, и <span class="m">∫₋ₐᵃ f dx = 0</span> — без вычислений.</p><p>Если f чётная, <span class="m">f(−x) = f(x)</span>, то <span class="m">∫₋ₐᵃ f dx = 2∫₀ᵃ f dx</span>. Это экономит время и защищает от ошибок в знаках.</p>'],
  en:['Odd and even functions on a symmetric interval','чётность','<p>If f is odd, <span class="m">f(−x) = −f(x)</span>, then on [−a, a] the area on the left equals the area on the right with the opposite sign, so <span class="m">∫₋ₐᵃ f dx = 0</span> with no computation.</p><p>If f is even, <span class="m">f(−x) = f(x)</span>, then <span class="m">∫₋ₐᵃ f dx = 2∫₀ᵃ f dx</span>. It saves time and protects against sign mistakes.</p>']},
 {id:'check',ru:['Проверка дифференцированием','checking the answer','<p>Любой неопределённый интеграл легко проверить: продифференцируйте ответ. Если получилась исходная функция, ответ верен.</p><p>Например, <span class="m">(x·eˣ − eˣ)′ = eˣ + x·eˣ − eˣ = x·eˣ</span>. Этот помощник проверяет так каждую найденную первообразную в двух десятках точек и показывает решение, только если проверка прошла.</p>'],
  en:['Checking by differentiation','проверка','<p>Any indefinite integral is easy to check: differentiate the answer. If you get the original function back, the answer is right.</p><p>For example, <span class="m">(x·eˣ − eˣ)′ = eˣ + x·eˣ − eˣ = x·eˣ</span>. This helper checks every antiderivative it finds this way at a couple dozen points and shows the solution only if the check passes.</p>']},
 {id:'parts',ru:['Интегрирование по частям','integration by parts','<p>Формула <span class="m">∫u dv = u·v − ∫v du</span> — правило производной произведения, прочитанное наоборот. Она меняет один интеграл на другой, и выгодно, когда новый проще.</p><p>Подходит для произведений, где один множитель упрощается при дифференцировании, а другой не усложняется при интегрировании: <span class="m">x·eˣ</span>, <span class="m">x·sin x</span>, <span class="m">x²·ln x</span>. Пример: <span class="m">u = x, dv = eˣ dx ⇒ ∫x·eˣ dx = x·eˣ − ∫eˣ dx = (x − 1)eˣ + C</span>.</p><p>Иногда приходится применять формулу несколько раз: для <span class="m">x²·eˣ</span> — дважды.</p>'],
  en:['Integration by parts','интегрирование по частям','<p>The formula <span class="m">∫u dv = u·v − ∫v du</span> is the product rule read backwards. It trades one integral for another and pays off when the new one is simpler.</p><p>It fits products where one factor simplifies when differentiated and the other doesn’t get worse when integrated: <span class="m">x·eˣ</span>, <span class="m">x·sin x</span>, <span class="m">x²·ln x</span>. Example: <span class="m">u = x, dv = eˣ dx ⇒ ∫x·eˣ dx = x·eˣ − ∫eˣ dx = (x − 1)eˣ + C</span>.</p><p>Sometimes the formula is applied several times: twice for <span class="m">x²·eˣ</span>.</p>']},
 {id:'liate',ru:['Как выбрать u: правило ЛОАСТ','LIATE','<p>За u берут множитель, который стоит раньше в списке: <b>Л</b>огарифмы, <b>О</b>братные тригонометрические (arctg, arcsin), <b>А</b>лгебраические (многочлены, степени x), <b>Т</b>ригонометрические, <b>Э</b>кспоненты. Остальное — dv.</p><p>Логика простая: ln x и arctg x при дифференцировании превращаются в дроби, многочлены понижают степень, а sin и eˣ почти не меняются при интегрировании. Поэтому в <span class="m">∫ln x dx</span> берут <span class="m">u = ln x</span>, <span class="m">dv = dx</span>.</p>'],
  en:['Choosing u: LIATE','ЛОАСТ','<p>Pick as u the factor that comes first in the list: <b>L</b>ogarithms, <b>I</b>nverse trig (arctan, arcsin), <b>A</b>lgebraic (polynomials, powers of x), <b>T</b>rigonometric, <b>E</b>xponentials. The rest is dv.</p><p>The logic: ln x and arctan x become fractions when differentiated, polynomials lose degree, while sin and eˣ barely change when integrated. So for <span class="m">∫ln x dx</span> take <span class="m">u = ln x</span>, <span class="m">dv = dx</span>.</p>']},
 {id:'cyclic',ru:['Циклическое интегрирование по частям','returning integral','<p>Для <span class="m">∫eᵃˣ sin bx dx</span> ни один множитель не упрощается. Но после двух интегрирований по частям снова появляется исходный интеграл I с другим коэффициентом: <span class="m">I = (выражение) − k·I</span>.</p><p>Это уравнение относительно I: переносим и делим на <span class="m">1 + k</span>. Получается <span class="m">∫eᵃˣ sin bx dx = eᵃˣ(a sin bx − b cos bx)/(a² + b²) + C</span>.</p>'],
  en:['Cyclic integration by parts','возвращающийся интеграл','<p>For <span class="m">∫eᵃˣ sin bx dx</span> neither factor simplifies. But after integrating by parts twice the original integral I reappears with a different coefficient: <span class="m">I = (expression) − k·I</span>.</p><p>That is an equation for I: move it over and divide by <span class="m">1 + k</span>. The result is <span class="m">∫eᵃˣ sin bx dx = eᵃˣ(a sin bx − b cos bx)/(a² + b²) + C</span>.</p>']},
 {id:'polydiv',ru:['Выделение целой части','polynomial division','<p>Если степень числителя не меньше степени знаменателя, дробь «неправильная». Сначала делим многочлены уголком: <span class="m">P/Q = S + R/Q</span>, где S — многочлен, а у остатка R степень уже меньше, чем у Q.</p><p>Пример: <span class="m">x/(x + 1) = 1 − 1/(x + 1)</span>, поэтому <span class="m">∫x/(x + 1) dx = x − ln|x + 1| + C</span>.</p>'],
  en:['Polynomial division','выделение целой части','<p>If the numerator’s degree is at least the denominator’s, the fraction is “improper”. First divide the polynomials: <span class="m">P/Q = S + R/Q</span>, where S is a polynomial and the remainder R has lower degree than Q.</p><p>Example: <span class="m">x/(x + 1) = 1 − 1/(x + 1)</span>, so <span class="m">∫x/(x + 1) dx = x − ln|x + 1| + C</span>.</p>']},
 {id:'partial',ru:['Разложение на простейшие дроби','partial fractions','<p>Правильную рациональную дробь раскладывают на сумму простых: каждому множителю знаменателя <span class="m">(x − r)</span> соответствует дробь <span class="m">A/(x − r)</span>, кратному <span class="m">(x − r)ᵏ</span> — дроби с <span class="m">(x − r)</span>, …, <span class="m">(x − r)ᵏ</span>, а квадратному без корней — <span class="m">(Bx + C)/(x² + px + q)</span>.</p><p>Пример: <span class="m">1/(x(x + 1)) = 1/x − 1/(x + 1)</span>. Каждая простая дробь интегрируется по таблице: логарифм, степень или арктангенс.</p><p>Коэффициенты находят, приводя к общему знаменателю, или подстановкой корня: <span class="m">A = P(r)/Q₁(r)</span>, где Q₁ — знаменатель без множителя (x − r).</p>'],
  en:['Partial fractions','простейшие дроби','<p>A proper rational function is split into simple fractions: each factor <span class="m">(x − r)</span> of the denominator gives <span class="m">A/(x − r)</span>, a repeated <span class="m">(x − r)ᵏ</span> gives fractions with <span class="m">(x − r)</span>, …, <span class="m">(x − r)ᵏ</span>, and a quadratic without real roots gives <span class="m">(Bx + C)/(x² + px + q)</span>.</p><p>Example: <span class="m">1/(x(x + 1)) = 1/x − 1/(x + 1)</span>. Each simple fraction is a table integral: a logarithm, a power or an arctangent.</p><p>Find the coefficients by clearing denominators or by plugging in a root: <span class="m">A = P(r)/Q₁(r)</span>, where Q₁ is the denominator without the factor (x − r).</p>']},
 {id:'square',ru:['Выделение полного квадрата','completing the square','<p>Квадратный трёхчлен без вещественных корней записывают как <span class="m">a((x + h)² + k²)</span>. После линейной замены <span class="m">u = x + h</span> получается табличный <span class="m">∫du/(u² + k²) = (1/k)·arctg(u/k)</span>.</p><p>Если в числителе есть x, сначала выделяют в нём производную знаменателя: эта часть даёт логарифм, остаток — арктангенс. Пример: <span class="m">∫(x + 3)/(x² + 2x + 5) dx = ½ln(x² + 2x + 5) + arctg((x + 1)/2) + C</span>.</p><p>Тот же приём нужен под корнем перед тригонометрической подстановкой.</p>'],
  en:['Completing the square','полный квадрат','<p>A quadratic without real roots is written as <span class="m">a((x + h)² + k²)</span>. After the linear substitution <span class="m">u = x + h</span> it becomes the table integral <span class="m">∫du/(u² + k²) = (1/k)·arctan(u/k)</span>.</p><p>If the numerator contains x, first split off the derivative of the denominator: that part gives a logarithm, the rest an arctangent. Example: <span class="m">∫(x + 3)/(x² + 2x + 5) dx = ½ln(x² + 2x + 5) + arctan((x + 1)/2) + C</span>.</p><p>The same trick is needed under a square root before a trig substitution.</p>']},
 {id:'trigid',ru:['Понижение степени','power reduction','<p>Чётные степени синуса и косинуса не берутся напрямую, но формулы двойного угла понижают степень: <span class="m">sin²x = (1 − cos 2x)/2</span>, <span class="m">cos²x = (1 + cos 2x)/2</span>, <span class="m">sin x cos x = ½ sin 2x</span>.</p><p>Пример: <span class="m">∫sin²x dx = x/2 − sin 2x / 4 + C</span>. Для четвёртой степени формулу применяют дважды. Похожий приём: <span class="m">tg²x = 1/cos²x − 1</span>.</p><p>Произведения с разными аргументами раскладывают в сумму: <span class="m">sin A cos B = ½(sin(A + B) + sin(A − B))</span>. Так <span class="m">∫sin x cos 3x dx = −cos 4x / 8 + cos 2x / 4 + C</span>.</p>'],
  en:['Power reduction','понижение степени','<p>Even powers of sine and cosine can’t be integrated directly, but double-angle formulas lower the power: <span class="m">sin²x = (1 − cos 2x)/2</span>, <span class="m">cos²x = (1 + cos 2x)/2</span>, <span class="m">sin x cos x = ½ sin 2x</span>.</p><p>Example: <span class="m">∫sin²x dx = x/2 − sin 2x / 4 + C</span>. For the fourth power the formula is applied twice. A similar trick: <span class="m">tan²x = 1/cos²x − 1</span>.</p><p>Products with different arguments become sums: <span class="m">sin A cos B = ½(sin(A + B) + sin(A − B))</span>. So <span class="m">∫sin x cos 3x dx = −cos 4x / 8 + cos 2x / 4 + C</span>.</p>']},
 {id:'oddpow',ru:['Нечётная степень синуса или косинуса','odd powers','<p>В <span class="m">∫sinᵐx cosⁿx dx</span> с нечётным m отделяют один множитель sin x: он вместе с dx образует <span class="m">−d(cos x)</span>. Остальные синусы чётной степени выражают через <span class="m">sin²x = 1 − cos²x</span>, и после замены <span class="m">u = cos x</span> остаётся многочлен.</p><p>Пример: <span class="m">∫sin³x dx = ∫(1 − cos²x) sin x dx = −cos x + cos³x/3 + C</span>. Если нечётна степень косинуса, роли меняются: <span class="m">u = sin x</span>.</p>'],
  en:['Odd power of sine or cosine','нечётная степень','<p>In <span class="m">∫sinᵐx cosⁿx dx</span> with odd m, split off one factor sin x: together with dx it forms <span class="m">−d(cos x)</span>. The remaining even power of sine is written via <span class="m">sin²x = 1 − cos²x</span>, and after <span class="m">u = cos x</span> only a polynomial is left.</p><p>Example: <span class="m">∫sin³x dx = ∫(1 − cos²x) sin x dx = −cos x + cos³x/3 + C</span>. If the power of cosine is odd, swap the roles: <span class="m">u = sin x</span>.</p>']},
 {id:'trigsub',ru:['Тригонометрическая подстановка','trig substitution','<p>Корни из квадратных выражений убираются заменами, при которых работает тождество:</p><p><span class="m">√(a² − x²)</span>: <span class="m">x = a sin t</span>, корень = <span class="m">a cos t</span>.<br><span class="m">√(a² + x²)</span>: <span class="m">x = a tg t</span>, корень = <span class="m">a / cos t</span>.<br><span class="m">√(x² − a²)</span>: <span class="m">x = a / cos t</span>, корень = <span class="m">a tg t</span>.</p><p>Пример: <span class="m">∫₋₁¹ √(1 − x²) dx</span> — площадь половины единичного круга, <span class="m">π/2</span>. Если под корнем есть слагаемое с x, сначала выделяют полный квадрат.</p>'],
  en:['Trigonometric substitution','тригонометрическая подстановка','<p>Roots of quadratic expressions disappear under substitutions that make an identity work:</p><p><span class="m">√(a² − x²)</span>: <span class="m">x = a sin t</span>, the root = <span class="m">a cos t</span>.<br><span class="m">√(a² + x²)</span>: <span class="m">x = a tan t</span>, the root = <span class="m">a / cos t</span>.<br><span class="m">√(x² − a²)</span>: <span class="m">x = a / cos t</span>, the root = <span class="m">a tan t</span>.</p><p>Example: <span class="m">∫₋₁¹ √(1 − x²) dx</span> is the area of half the unit disc, <span class="m">π/2</span>. If there is a linear term under the root, complete the square first.</p>']},
 {id:'weier',ru:['Универсальная тригонометрическая подстановка','t = tg(x/2)','<p>Любое рациональное выражение от sin x и cos x подстановка <span class="m">t = tg(x/2)</span> превращает в рациональную дробь от t:</p><p><span class="m">sin x = 2t/(1 + t²)</span>, <span class="m">cos x = (1 − t²)/(1 + t²)</span>, <span class="m">dx = 2 dt/(1 + t²)</span>.</p><p>Метод работает всегда, но часто даёт громоздкие дроби, поэтому его берут, когда ничего проще не подходит. Пример: <span class="m">∫dx/(1 + cos x) = tg(x/2) + C</span>.</p>'],
  en:['Universal trigonometric substitution','t = tan(x/2)','<p>The substitution <span class="m">t = tan(x/2)</span> turns any rational expression in sin x and cos x into a rational function of t:</p><p><span class="m">sin x = 2t/(1 + t²)</span>, <span class="m">cos x = (1 − t²)/(1 + t²)</span>, <span class="m">dx = 2 dt/(1 + t²)</span>.</p><p>It always works but often yields bulky fractions, so it is used when nothing simpler fits. Example: <span class="m">∫dx/(1 + cos x) = tan(x/2) + C</span>.</p>']},
 {id:'rect',ru:['Метод прямоугольников','left, right, midpoint','<p>Самый простой численный способ: отрезок делят на n равных частей ширины <span class="m">h = (b − a)/n</span> и берут высоту f на левом конце, правом конце или в середине каждого кусочка.</p><p>Левые и правые суммы ошибаются примерно на величину, пропорциональную 1/n. Средние точнее: ошибки по краям прямоугольника почти гасят друг друга, и погрешность падает как 1/n².</p>'],
  en:['Rectangle rule','метод прямоугольников','<p>The simplest numerical method: split the interval into n equal pieces of width <span class="m">h = (b − a)/n</span> and take the height of f at the left end, right end or middle of each piece.</p><p>Left and right sums are off by roughly an amount proportional to 1/n. Midpoint sums are better: errors on the two sides of each rectangle nearly cancel, and the error falls like 1/n².</p>']},
 {id:'trap',ru:['Метод трапеций','trapezoidal rule','<p>Соседние точки графика соединяют отрезком, и под каждым кусочком получается трапеция площадью <span class="m">h·(f(xᵢ) + f(xᵢ₊₁))/2</span>. Это среднее арифметическое левой и правой сумм.</p><p>Погрешность порядка 1/n². Для выпуклой вниз функции трапеции всегда дают завышенный результат, для выпуклой вверх — заниженный.</p>'],
  en:['Trapezoidal rule','метод трапеций','<p>Neighbouring points of the graph are joined by a segment, giving a trapezoid of area <span class="m">h·(f(xᵢ) + f(xᵢ₊₁))/2</span> over each piece. It is the average of the left and right sums.</p><p>The error is of order 1/n². For a function that curves upward the trapezoids always overestimate, for one curving downward they underestimate.</p>']},
 {id:'simpson',ru:['Метод Симпсона','Simpson’s rule','<p>На каждой паре соседних кусочков график заменяют параболой через три точки. Площадь под параболой считается точно: <span class="m">(h/3)·(f₀ + 4f₁ + f₂)</span>.</p><p>Погрешность порядка 1/n⁴: удвоение n уменьшает ошибку в 16 раз. Многочлены до третьей степени метод интегрирует вообще без ошибки. Число отрезков должно быть чётным.</p>'],
  en:['Simpson’s rule','метод Симпсона','<p>On each pair of neighbouring pieces the graph is replaced by a parabola through three points. The area under the parabola is exact: <span class="m">(h/3)·(f₀ + 4f₁ + f₂)</span>.</p><p>The error is of order 1/n⁴: doubling n cuts it by a factor of 16. Polynomials up to degree three are integrated with no error at all. The number of pieces must be even.</p>']},
 {id:'error',ru:['Погрешность численного метода','order of accuracy','<p>Погрешность — разница между численной суммой и точным интегралом. Говорят, что метод имеет порядок p, если ошибка ведёт себя как <span class="m">C/nᵖ</span>: для левых и правых прямоугольников p = 1, для средних и трапеций p = 2, для Симпсона p = 4.</p><p>Константа C зависит от того, насколько сильно изогнут график: для гладких пологих функций хватает малых n, для резко меняющихся нужно больше. Сравните в блоке «Значения» погрешность при разных правилах и n.</p>'],
  en:['Error of a numerical method','порядок точности','<p>The error is the difference between the numerical sum and the exact integral. A method has order p if its error behaves like <span class="m">C/nᵖ</span>: p = 1 for left and right rectangles, p = 2 for midpoint and trapezoid, p = 4 for Simpson.</p><p>The constant C depends on how strongly the graph bends: smooth gentle functions need small n, rapidly changing ones need more. Compare the error for different rules and n in the Values block.</p>']},
 {id:'improper',ru:['Несобственный интеграл','improper integral','<p>Так называют интеграл по бесконечному отрезку или от функции, которая уходит в бесконечность. Его определяют как предел: <span class="m">∫₁^∞ dx/x² = lim ∫₁ᴿ dx/x² = lim (1 − 1/R) = 1</span>.</p><p>Если предел конечен, интеграл <b>сходится</b>: бесконечно длинная или высокая фигура имеет конечную площадь. Если нет — <b>расходится</b>, как <span class="m">∫₁^∞ dx/x</span> или <span class="m">∫₀¹ dx/x</span>.</p><p>Ориентир: <span class="m">∫₁^∞ dx/xᵖ</span> сходится при p &gt; 1, а <span class="m">∫₀¹ dx/xᵖ</span> — при p &lt; 1.</p>'],
  en:['Improper integral','несобственный интеграл','<p>An integral over an infinite interval or of a function that blows up. It is defined as a limit: <span class="m">∫₁^∞ dx/x² = lim ∫₁ᴿ dx/x² = lim (1 − 1/R) = 1</span>.</p><p>If the limit is finite, the integral <b>converges</b>: an infinitely long or tall region has finite area. Otherwise it <b>diverges</b>, like <span class="m">∫₁^∞ dx/x</span> or <span class="m">∫₀¹ dx/x</span>.</p><p>Rule of thumb: <span class="m">∫₁^∞ dx/xᵖ</span> converges for p &gt; 1, and <span class="m">∫₀¹ dx/xᵖ</span> for p &lt; 1.</p>']},
 {id:'nonelem',ru:['Неберущиеся интегралы','non-elementary','<p>У каждой непрерывной функции есть первообразная, но она не всегда записывается через многочлены, корни, экспоненты, логарифмы и тригонометрию. Классические примеры: <span class="m">∫e^(−x²) dx</span>, <span class="m">∫sin x / x dx</span>, <span class="m">∫dx/ln x</span>, <span class="m">∫sin(x²) dx</span>.</p><p>Такие первообразные получили собственные имена (erf, Si, li, интегралы Френеля), а определённые интегралы от них считают численно. Некоторые всё же известны точно: <span class="m">∫₋∞^∞ e^(−x²) dx = √π</span>.</p>'],
  en:['Non-elementary integrals','неберущиеся интегралы','<p>Every continuous function has an antiderivative, but it can’t always be written with polynomials, roots, exponentials, logarithms and trig functions. Classic examples: <span class="m">∫e^(−x²) dx</span>, <span class="m">∫sin x / x dx</span>, <span class="m">∫dx/ln x</span>, <span class="m">∫sin(x²) dx</span>.</p><p>Such antiderivatives got their own names (erf, Si, li, Fresnel integrals), and definite integrals of them are computed numerically. Some are known exactly anyway: <span class="m">∫₋∞^∞ e^(−x²) dx = √π</span>.</p>']},
 {id:'mean',ru:['Среднее значение функции','mean value','<p>Среднее значение f на [a, b] — это <span class="m">f̄ = (1/(b − a))·∫ₐᵇ f dx</span>. Геометрически: высота прямоугольника на том же основании и с той же площадью, что и фигура под графиком.</p><p>Теорема о среднем говорит, что непрерывная функция хотя бы в одной точке отрезка принимает это значение. Например, среднее sin x на [0, π] равно <span class="m">2/π ≈ 0,64</span>.</p>'],
  en:['Mean value of a function','среднее значение','<p>The mean value of f on [a, b] is <span class="m">f̄ = (1/(b − a))·∫ₐᵇ f dx</span>. Geometrically: the height of a rectangle with the same base and the same area as the region under the graph.</p><p>The mean value theorem says a continuous function takes this value at least once on the interval. For example, the mean of sin x on [0, π] is <span class="m">2/π ≈ 0.64</span>.</p>']},
 {id:'between',ru:['Площадь между кривыми','area between curves','<p>Площадь фигуры между графиками f и g на [a, b], где f ≥ g, равна <span class="m">∫ₐᵇ (f(x) − g(x)) dx</span>: из площади под верхней кривой вычитаем площадь под нижней.</p><p>Пределы обычно — абсциссы точек пересечения, корни уравнения <span class="m">f(x) = g(x)</span>. Если кривые меняются местами, отрезок делят. Чтобы увидеть это на сцене, введите разность, например <span class="m">x − x²</span> на [0, 1]: ответ 1/6.</p>'],
  en:['Area between curves','площадь между кривыми','<p>The area between the graphs of f and g on [a, b], with f ≥ g, is <span class="m">∫ₐᵇ (f(x) − g(x)) dx</span>: the area under the upper curve minus the area under the lower one.</p><p>The limits are usually where the curves cross, the roots of <span class="m">f(x) = g(x)</span>. If the curves swap places, split the interval. To see it on the scene, enter the difference, for example <span class="m">x − x²</span> on [0, 1]: the answer is 1/6.</p>']},
 {id:'volume',ru:['Объём тела вращения','volume of revolution','<p>Если график f на [a, b] вращать вокруг оси x, получится тело, каждое сечение которого — круг радиуса f(x). Складывая тонкие диски, получаем <span class="m">V = π∫ₐᵇ f(x)² dx</span>.</p><p>Пример: вращая <span class="m">√(1 − x²)</span> на [−1, 1], получаем шар: <span class="m">π∫₋₁¹(1 − x²) dx = 4π/3</span>. На сцене можно посчитать сам интеграл, введя <span class="m">1 − x^2</span>.</p>'],
  en:['Volume of revolution','объём тела вращения','<p>Rotating the graph of f on [a, b] around the x-axis gives a solid whose every cross-section is a disc of radius f(x). Adding up thin discs gives <span class="m">V = π∫ₐᵇ f(x)² dx</span>.</p><p>Example: rotating <span class="m">√(1 − x²)</span> on [−1, 1] gives a ball: <span class="m">π∫₋₁¹(1 − x²) dx = 4π/3</span>. On the scene you can compute the integral itself by entering <span class="m">1 − x^2</span>.</p>']}
];
const FORMAL={
 riemann:{ru:'<p><b>Определение.</b> Разбиение отрезка [a, b] — точки <span class="m">a = x₀ &lt; x₁ &lt; … &lt; xₙ = b</span>, Δxᵢ = xᵢ − xᵢ₋₁. Выберем в каждом отрезке точку ξᵢ. Сумма Римана: <span class="m">σ = Σ f(ξᵢ)·Δxᵢ</span>. Если при <span class="m">max Δxᵢ → 0</span> суммы стремятся к одному числу I независимо от выбора разбиений и точек, f интегрируема по Риману и <span class="m">∫ₐᵇ f dx = I</span>.</p><p>Любая непрерывная на [a, b] функция интегрируема; ограниченная функция с конечным числом разрывов тоже.</p><p><b>Пример.</b> f = x на [0, 1], правые точки: <span class="m">σₙ = Σ (i/n)·(1/n) = (n + 1)/(2n) → 1/2</span>.</p>',
  en:'<p><b>Definition.</b> A partition of [a, b] is <span class="m">a = x₀ &lt; x₁ &lt; … &lt; xₙ = b</span>, Δxᵢ = xᵢ − xᵢ₋₁. Choose a point ξᵢ in each piece. The Riemann sum is <span class="m">σ = Σ f(ξᵢ)·Δxᵢ</span>. If as <span class="m">max Δxᵢ → 0</span> the sums tend to one number I regardless of partitions and points, f is Riemann integrable and <span class="m">∫ₐᵇ f dx = I</span>.</p><p>Every function continuous on [a, b] is integrable; so is a bounded function with finitely many discontinuities.</p><p><b>Example.</b> f = x on [0, 1], right endpoints: <span class="m">σₙ = Σ (i/n)·(1/n) = (n + 1)/(2n) → 1/2</span>.</p>'},
 definite:{ru:'<p><b>Определение.</b> <span class="m">∫ₐᵇ f(x) dx = lim σ</span> — предел сумм Римана при измельчении разбиения. Для a &gt; b по определению <span class="m">∫ₐᵇ f = −∫ᵇₐ f</span>.</p><p><b>Пример.</b> <span class="m">∫₀² x² dx = lim Σ (2i/n)²·(2/n) = lim 8(n + 1)(2n + 1)/(6n²) = 8/3</span>.</p>',
  en:'<p><b>Definition.</b> <span class="m">∫ₐᵇ f(x) dx = lim σ</span>, the limit of Riemann sums as the partition is refined. For a &gt; b, by definition <span class="m">∫ₐᵇ f = −∫ᵇₐ f</span>.</p><p><b>Example.</b> <span class="m">∫₀² x² dx = lim Σ (2i/n)²·(2/n) = lim 8(n + 1)(2n + 1)/(6n²) = 8/3</span>.</p>'},
 signed:{ru:'<p><b>Определение.</b> Положим <span class="m">f⁺ = max(f, 0)</span>, <span class="m">f⁻ = max(−f, 0)</span>. Тогда <span class="m">f = f⁺ − f⁻</span>, <span class="m">|f| = f⁺ + f⁻</span>, и <span class="m">∫f = ∫f⁺ − ∫f⁻</span>, а площадь фигуры равна <span class="m">∫|f| = ∫f⁺ + ∫f⁻</span>.</p><p><b>Пример.</b> На [0, 2π]: <span class="m">∫sin x = 2 − 2 = 0</span>, <span class="m">∫|sin x| = 4</span>.</p>',
  en:'<p><b>Definition.</b> Let <span class="m">f⁺ = max(f, 0)</span>, <span class="m">f⁻ = max(−f, 0)</span>. Then <span class="m">f = f⁺ − f⁻</span>, <span class="m">|f| = f⁺ + f⁻</span>, so <span class="m">∫f = ∫f⁺ − ∫f⁻</span>, while the area of the region is <span class="m">∫|f| = ∫f⁺ + ∫f⁻</span>.</p><p><b>Example.</b> On [0, 2π]: <span class="m">∫sin x = 2 − 2 = 0</span>, <span class="m">∫|sin x| = 4</span>.</p>'},
 antideriv:{ru:'<p><b>Определение.</b> F — первообразная f на промежутке I, если F дифференцируема на I и <span class="m">F′(x) = f(x)</span> для всех x ∈ I.</p><p><b>Теорема.</b> Если F₁ и F₂ — первообразные f на промежутке, то <span class="m">F₁ − F₂ = const</span>. (Следует из теоремы Лагранжа: производная разности равна нулю.)</p><p>Важно, что I — промежуток: у <span class="m">1/x</span> на ℝ∖{0} константы слева и справа от нуля могут быть разными.</p>',
  en:'<p><b>Definition.</b> F is an antiderivative of f on an interval I if F is differentiable on I and <span class="m">F′(x) = f(x)</span> for all x ∈ I.</p><p><b>Theorem.</b> If F₁ and F₂ are antiderivatives of f on an interval, then <span class="m">F₁ − F₂ = const</span>. (By the mean value theorem: the derivative of the difference is zero.)</p><p>It matters that I is an interval: for <span class="m">1/x</span> on ℝ∖{0} the constants left and right of zero may differ.</p>'},
 ftc:{ru:'<p><b>Теорема (первая часть).</b> Если f непрерывна на [a, b], то <span class="m">F(x) = ∫ₐˣ f(t) dt</span> дифференцируема и <span class="m">F′(x) = f(x)</span>.</p><p><b>Теорема (Ньютон–Лейбниц).</b> Если f непрерывна на [a, b] и G — любая её первообразная, то <span class="m">∫ₐᵇ f dx = G(b) − G(a)</span>.</p><p><b>Пример.</b> <span class="m">∫₀^π sin x dx = (−cos π) − (−cos 0) = 1 + 1 = 2</span>.</p><p>Условие непрерывности существенно: <span class="m">∫₋₁¹ dx/x²</span> «по формуле» дал бы −2, но интеграл расходится.</p>',
  en:'<p><b>Theorem (part one).</b> If f is continuous on [a, b], then <span class="m">F(x) = ∫ₐˣ f(t) dt</span> is differentiable and <span class="m">F′(x) = f(x)</span>.</p><p><b>Theorem (Newton–Leibniz).</b> If f is continuous on [a, b] and G is any antiderivative, then <span class="m">∫ₐᵇ f dx = G(b) − G(a)</span>.</p><p><b>Example.</b> <span class="m">∫₀^π sin x dx = (−cos π) − (−cos 0) = 1 + 1 = 2</span>.</p><p>Continuity matters: <span class="m">∫₋₁¹ dx/x²</span> “by the formula” would give −2, but the integral diverges.</p>'},
 usub:{ru:'<p><b>Теорема.</b> Если g непрерывно дифференцируема, а f непрерывна на множестве значений g, то <span class="m">∫f(g(x))·g′(x) dx = F(g(x)) + C</span>, где F′ = f.</p><p><b>Доказательство.</b> По правилу цепочки <span class="m">(F(g(x)))′ = f(g(x))·g′(x)</span>.</p><p><b>Пример.</b> <span class="m">∫cos(x²)·2x dx</span>: g = x², f = cos, ответ <span class="m">sin(x²) + C</span>.</p>',
  en:'<p><b>Theorem.</b> If g is continuously differentiable and f is continuous on the range of g, then <span class="m">∫f(g(x))·g′(x) dx = F(g(x)) + C</span>, where F′ = f.</p><p><b>Proof.</b> By the chain rule, <span class="m">(F(g(x)))′ = f(g(x))·g′(x)</span>.</p><p><b>Example.</b> <span class="m">∫cos(x²)·2x dx</span>: g = x², f = cos, answer <span class="m">sin(x²) + C</span>.</p>'},
 defsub:{ru:'<p><b>Теорема.</b> Если g непрерывно дифференцируема на [a, b], f непрерывна на g([a, b]), то <span class="m">∫ₐᵇ f(g(x))g′(x) dx = ∫_g(a)^g(b) f(u) du</span>.</p><p><b>Пример.</b> <span class="m">∫₀^(π/2) sin²x·cos x dx</span>, u = sin x: пределы 0 и 1, <span class="m">∫₀¹ u² du = 1/3</span>.</p>',
  en:'<p><b>Theorem.</b> If g is continuously differentiable on [a, b] and f is continuous on g([a, b]), then <span class="m">∫ₐᵇ f(g(x))g′(x) dx = ∫_g(a)^g(b) f(u) du</span>.</p><p><b>Example.</b> <span class="m">∫₀^(π/2) sin²x·cos x dx</span>, u = sin x: limits 0 and 1, <span class="m">∫₀¹ u² du = 1/3</span>.</p>'},
 parts:{ru:'<p><b>Теорема.</b> Если u и v непрерывно дифференцируемы, то <span class="m">∫u dv = uv − ∫v du</span>, а для определённого интеграла <span class="m">∫ₐᵇ u v′ dx = [uv]ₐᵇ − ∫ₐᵇ v u′ dx</span>.</p><p><b>Доказательство.</b> <span class="m">(uv)′ = u′v + uv′</span>; интегрируем обе части.</p><p><b>Пример.</b> <span class="m">∫₀^π x sin x dx = [−x cos x]₀^π + ∫₀^π cos x dx = π + 0 = π</span>.</p>',
  en:'<p><b>Theorem.</b> If u and v are continuously differentiable, then <span class="m">∫u dv = uv − ∫v du</span>, and for a definite integral <span class="m">∫ₐᵇ u v′ dx = [uv]ₐᵇ − ∫ₐᵇ v u′ dx</span>.</p><p><b>Proof.</b> <span class="m">(uv)′ = u′v + uv′</span>; integrate both sides.</p><p><b>Example.</b> <span class="m">∫₀^π x sin x dx = [−x cos x]₀^π + ∫₀^π cos x dx = π + 0 = π</span>.</p>'},
 partial:{ru:'<p><b>Теорема.</b> Любая правильная рациональная дробь <span class="m">P/Q</span> с вещественными коэффициентами единственным образом раскладывается в сумму дробей вида <span class="m">A/(x − r)ᵏ</span> и <span class="m">(Bx + C)/(x² + px + q)ᵏ</span>, где p² − 4q &lt; 0, а k не превосходит кратности соответствующего множителя Q.</p><p><b>Пример.</b> <span class="m">(x + 1)/(x² − 5x + 6) = 4/(x − 3) − 3/(x − 2)</span>: при x = 3 числитель 4, при x = 2 он равен 3, а знак даёт множитель (x − 3) = −1.</p>',
  en:'<p><b>Theorem.</b> Every proper rational function <span class="m">P/Q</span> with real coefficients splits uniquely into a sum of fractions <span class="m">A/(x − r)ᵏ</span> and <span class="m">(Bx + C)/(x² + px + q)ᵏ</span> with p² − 4q &lt; 0, where k doesn’t exceed the multiplicity of the corresponding factor of Q.</p><p><b>Example.</b> <span class="m">(x + 1)/(x² − 5x + 6) = 4/(x − 3) − 3/(x − 2)</span>: at x = 3 the numerator is 4, at x = 2 it is 3, and the factor (x − 3) = −1 gives the sign.</p>'},
 improper:{ru:'<p><b>Определение.</b> <span class="m">∫ₐ^∞ f dx = lim(R→∞) ∫ₐᴿ f dx</span>. Если f неограничена у точки b, то <span class="m">∫ₐᵇ f dx = lim(ε→0⁺) ∫ₐ^(b−ε) f dx</span>. Интеграл сходится, если предел существует и конечен.</p><p><b>Признак сравнения.</b> Если <span class="m">0 ≤ f ≤ g</span> и <span class="m">∫g</span> сходится, то сходится и <span class="m">∫f</span>.</p><p><b>Пример.</b> <span class="m">∫₀¹ dx/√x = lim (2 − 2√ε) = 2</span>.</p>',
  en:'<p><b>Definition.</b> <span class="m">∫ₐ^∞ f dx = lim(R→∞) ∫ₐᴿ f dx</span>. If f is unbounded near b, then <span class="m">∫ₐᵇ f dx = lim(ε→0⁺) ∫ₐ^(b−ε) f dx</span>. The integral converges if the limit exists and is finite.</p><p><b>Comparison test.</b> If <span class="m">0 ≤ f ≤ g</span> and <span class="m">∫g</span> converges, so does <span class="m">∫f</span>.</p><p><b>Example.</b> <span class="m">∫₀¹ dx/√x = lim (2 − 2√ε) = 2</span>.</p>'},
 simpson:{ru:'<p><b>Формула.</b> При чётном n и h = (b − a)/n: <span class="m">S = (h/3)·(f₀ + 4f₁ + 2f₂ + 4f₃ + … + 4fₙ₋₁ + fₙ)</span>.</p><p><b>Оценка.</b> <span class="m">|S − I| ≤ (b − a)·h⁴·max|f⁽⁴⁾|/180</span>.</p><p>Для трапеций: <span class="m">|T − I| ≤ (b − a)·h²·max|f″|/12</span>, для средних прямоугольников — то же с 24 вместо 12.</p>',
  en:'<p><b>Formula.</b> For even n and h = (b − a)/n: <span class="m">S = (h/3)·(f₀ + 4f₁ + 2f₂ + 4f₃ + … + 4fₙ₋₁ + fₙ)</span>.</p><p><b>Bound.</b> <span class="m">|S − I| ≤ (b − a)·h⁴·max|f⁽⁴⁾|/180</span>.</p><p>For trapezoids: <span class="m">|T − I| ≤ (b − a)·h²·max|f″|/12</span>; for midpoints, the same with 24 instead of 12.</p>'},
 mean:{ru:'<p><b>Теорема о среднем.</b> Если f непрерывна на [a, b], то найдётся <span class="m">c ∈ [a, b]</span>, для которой <span class="m">∫ₐᵇ f dx = f(c)·(b − a)</span>.</p><p><b>Пример.</b> <span class="m">∫₀² x² dx = 8/3</span>, среднее <span class="m">4/3</span>, оно достигается при <span class="m">c = 2/√3 ≈ 1,155</span>.</p>',
  en:'<p><b>Mean value theorem for integrals.</b> If f is continuous on [a, b], there is <span class="m">c ∈ [a, b]</span> with <span class="m">∫ₐᵇ f dx = f(c)·(b − a)</span>.</p><p><b>Example.</b> <span class="m">∫₀² x² dx = 8/3</span>, mean <span class="m">4/3</span>, attained at <span class="m">c = 2/√3 ≈ 1.155</span>.</p>'},
 trigsub:{ru:'<p><b>Пример полностью.</b> <span class="m">∫√(a² − x²) dx</span>, <span class="m">x = a sin t</span>, <span class="m">t ∈ [−π/2, π/2]</span>, <span class="m">dx = a cos t dt</span>, <span class="m">√(a² − x²) = a cos t</span>. Интеграл <span class="m">a²∫cos²t dt = (a²/2)(t + sin t cos t)</span>. Возвращаясь: <span class="m">t = arcsin(x/a)</span>, <span class="m">sin t cos t = x√(a² − x²)/a²</span>, итого <span class="m">(x/2)√(a² − x²) + (a²/2)arcsin(x/a) + C</span>.</p>',
  en:'<p><b>Full example.</b> <span class="m">∫√(a² − x²) dx</span>, <span class="m">x = a sin t</span>, <span class="m">t ∈ [−π/2, π/2]</span>, <span class="m">dx = a cos t dt</span>, <span class="m">√(a² − x²) = a cos t</span>. The integral is <span class="m">a²∫cos²t dt = (a²/2)(t + sin t cos t)</span>. Back to x: <span class="m">t = arcsin(x/a)</span>, <span class="m">sin t cos t = x√(a² − x²)/a²</span>, so <span class="m">(x/2)√(a² − x²) + (a²/2)arcsin(x/a) + C</span>.</p>'}
};
const REL={riemann:['definite','rect','error'],definite:['riemann','signed','ftc'],signed:['definite','between'],properties:['linearity','symmetry'],antideriv:['indefinite','ftc'],indefinite:['antideriv','table','check'],
 ftc:['antideriv','definite','improper'],table:['linsub','usub'],linearity:['properties','table'],linsub:['table','usub'],usub:['defsub','linsub','parts'],defsub:['usub'],symmetry:['properties','signed'],check:['antideriv'],
 parts:['liate','cyclic','usub'],liate:['parts'],cyclic:['parts'],polydiv:['partial'],partial:['polydiv','square'],square:['partial','trigsub'],trigid:['oddpow','weier'],oddpow:['trigid','usub'],trigsub:['square','usub'],weier:['trigid','partial'],
 rect:['trap','simpson','error'],trap:['rect','simpson'],simpson:['trap','error'],error:['rect','simpson'],improper:['ftc','nonelem'],nonelem:['improper','simpson'],mean:['definite'],between:['signed','definite'],volume:['definite']};
const CHAP=[{ru:'Идея интеграла',en:'The idea of the integral',ids:['riemann','definite','signed','properties']},
 {ru:'Первообразная',en:'The antiderivative',ids:['antideriv','indefinite','ftc','table']},
 {ru:'Основные приёмы',en:'Basic techniques',ids:['linearity','linsub','usub','defsub','symmetry','check']},
 {ru:'Интегрирование по частям',en:'Integration by parts',ids:['parts','liate','cyclic']},
 {ru:'Рациональные дроби',en:'Rational functions',ids:['polydiv','partial','square']},
 {ru:'Тригонометрия и корни',en:'Trigonometry and roots',ids:['trigid','oddpow','trigsub','weier']},
 {ru:'Численные методы',en:'Numerical methods',ids:['rect','trap','simpson','error']},
 {ru:'Ещё',en:'More',extra:true,ids:['improper','nonelem','mean','between','volume']}];
const DEMOS={riemann:{p:'p_pow',riem:true,rule:'right',n:6},definite:{p:'p_pow'},signed:{p:'p_odd'},properties:{p:'p_poly'},antideriv:{p:'p_pow',mode:'I',fam:true},indefinite:{p:'p_sin',mode:'I',fam:true},
 ftc:{p:'p_pow',mode:'F',tan:true},table:{p:'p_atan'},linearity:{p:'p_poly'},linsub:{p:'p_lin'},usub:{p:'p_usub'},defsub:{p:'p_usub'},symmetry:{p:'p_odd'},check:{p:'p_parts',mode:'I',tan:true},
 parts:{p:'p_parts'},liate:{p:'p_lnparts'},cyclic:{p:'p_cyc'},polydiv:{f:'x/(x+1)',a:'0',b:'2'},partial:{p:'p_pf'},square:{p:'p_sq'},trigid:{p:'p_sin2'},oddpow:{p:'p_sin3'},trigsub:{p:'p_circ'},weier:{p:'p_weier'},
 rect:{p:'p_pow',riem:true,rule:'mid',n:4},trap:{p:'p_sin',riem:true,rule:'trap',n:4},simpson:{p:'p_sin',riem:true,rule:'simp',n:4},error:{p:'p_pow',riem:true,rule:'left',n:4,rplay:true},
 improper:{p:'p_imp2'},nonelem:{p:'p_gauss'},mean:{p:'p_sin'},between:{f:'x-x^2',a:'0',b:'1'},volume:{f:'1-x^2',a:'-1',b:'1'}};
/* иллюстрации */
const ILL={
 riemann:{o:[18,118],sx:56,sy:30,it:[['grid'],['rects',x=>.3+x*x*.28,0,3,6,'mid'],['fn',x=>.3+x*x*.28,-.2,3.2,'f'],['T',150,18,'Σ f(ξᵢ)Δx','rect',12]]},
 definite:{o:[22,118],sx:56,sy:30,it:[['grid'],['area',x=>.3+x*x*.28,.5,2.6],['fn',x=>.3+x*x*.28,-.2,3.2,'f'],['vl',.5,'lim'],['vl',2.6,'lim'],['t',.5,-.45,'a','lim'],['t',2.6,-.45,'b','lim'],['T',150,18,'∫ₐᵇ f dx','axis',13]]},
 signed:{o:[14,70],sx:27,sy:36,it:[['grid'],['area',Math.sin,0,2*Math.PI],['fn',Math.sin,-.3,6.8,'f'],['t',1.57,.45,'+','axis',16],['t',4.71,-.45,'−','axis',16]]},
 antideriv:{o:[20,110],sx:42,sy:22,it:[['grid'],['fn',x=>x*x/2-1.2,-.4,4.2,'F',.35],['fn',x=>x*x/2,-.4,4.2,'F'],['fn',x=>x*x/2+1.2,-.4,4.2,'F',.35],['T',160,20,'F + C','F',13]]},
 ftc:{o:[22,118],sx:42,sy:26,it:[['grid'],['area',x=>.3+.5*x,0,2.4],['fn',x=>.3+.5*x,-.3,4.2,'f'],['fn',x=>.3*x+.25*x*x,-.3,3.6,'F'],['tan',x=>.3*x+.25*x*x,2.4,'tan'],['vl',2.4,'lim'],['t',2.4,-.5,'x','lim'],['T',40,16,'F′ = f','F',12]]},
 usub:{o:[20,120],sx:56,sy:38,it:[['grid'],['area',x=>x*Math.exp(x*x)/3,0,1.4],['fn',x=>x*Math.exp(x*x)/3,-.2,1.5,'f'],['T',130,22,'u = x²','axis',12]]},
 parts:{o:[0,0],sx:1,sy:1,it:[['raw','<rect x="40" y="30" width="120" height="80" fill="var(--s-pos)" fill-opacity=".2" stroke="var(--s-pos)"/><path d="M40 110 Q90 108 110 70 T160 30" fill="none" stroke="var(--s-f)" stroke-width="2"/><path d="M40 110 Q90 108 110 70 T160 30 L40 30 Z" fill="var(--s-F)" fill-opacity=".3"/>'],['T',120,96,'∫v du','pos',11],['T',80,48,'∫u dv','F',11],['T',100,128,'uv = ∫u dv + ∫v du','axis',11]]},
 partial:{o:[100,70],sx:24,sy:14,it:[['grid'],['fn',x=>1/(x*(x+1)),.12,3.9,'f'],['fn',x=>1/(x*(x+1)),-3.9,-1.12,'f'],['fn',x=>1/(x*(x+1)),-.88,-.12,'f'],['vl',0,'neg'],['vl',-1,'neg']]},
 trigid:{o:[14,100],sx:27,sy:50,it:[['grid'],['area',x=>Math.sin(x)**2,0,Math.PI],['fn',x=>Math.sin(x)**2,-.3,6.8,'f'],['fn',()=>.5,-.3,6.8,'lim'],['T',160,24,'½','lim',13]]},
 trigsub:{o:[100,118],sx:70,sy:70,it:[['grid'],['area',x=>Math.sqrt(Math.max(0,1-x*x)),-1,1],['fn',x=>Math.sqrt(Math.max(0,1-x*x)),-1,1,'f'],['T',100,70,'π/2','axis',14]]},
 rect:{o:[18,118],sx:56,sy:30,it:[['grid'],['rects',x=>.3+x*x*.28,0,3,4,'left'],['fn',x=>.3+x*x*.28,-.2,3.2,'f']]},
 trap:{o:[18,118],sx:56,sy:30,it:[['grid'],['rects',x=>.3+x*x*.28,0,3,4,'trap'],['fn',x=>.3+x*x*.28,-.2,3.2,'f']]},
 simpson:{o:[14,100],sx:27,sy:50,it:[['grid'],['rects',x=>Math.sin(x)*.9+.6,0,6,4,'simp'],['fn',x=>Math.sin(x)*.9+.6,-.3,6.8,'f']]},
 improper:{o:[20,118],sx:30,sy:40,it:[['grid'],['area',x=>1/(x*x),1,7],['fn',x=>1/(x*x),.4,7,'f'],['vl',1,'lim'],['T',150,40,'∫₁^∞ = 1','axis',12]]},
 nonelem:{o:[100,118],sx:30,sy:80,it:[['grid'],['area',x=>Math.exp(-x*x),-3.4,3.4],['fn',x=>Math.exp(-x*x),-3.4,3.4,'f'],['T',160,24,'√π','axis',14]]},
 mean:{o:[22,118],sx:42,sy:70,it:[['grid'],['raw',''],['area',Math.sin,0,Math.PI],['fn',Math.sin,-.3,4,'f'],['fn',()=>2/Math.PI,0,Math.PI,'lim'],['T',170,60,'f̄','lim',13]]},
 between:{o:[30,118],sx:140,sy:280,it:[['grid'],['fn',x=>x,-.1,1.1,'F'],['fn',x=>x*x,-.1,1.1,'f'],['T',150,24,'x − x²','axis',12]]},
 symmetry:{o:[100,70],sx:40,sy:16,it:[['grid'],['area',x=>x*x*x-4*x,-2,2],['fn',x=>x*x*x-4*x,-2.3,2.3,'f']]}
};
const $=s=>document.querySelector(s);
const KEY='integral-viz-v1';
function fmt(x,d=2){if(!isFinite(x))return x>0?'∞':x<0?'−∞':'—';if(Math.abs(x)<5e-10)x=0;let s=String(+x.toFixed(d));if(s==='-0')s='0';return s.replace('-','−')}
const PAL={
  classic:{bg:'#0b0c10',bgGrid:'#262b33',axis:'#f2f2f2',f:'#58c4dd',F:'#f4d345',pos:'#83c167',neg:'#fc6255',rect:'#ff9f43',lim:'#c77dff',tan:'#ff7aa8'},
  paper:{bg:'#fbfaf7',bgGrid:'#e3e1da',axis:'#23262b',f:'#2b6cb0',F:'#b07900',pos:'#3f9a3a',neg:'#d1453b',rect:'#e67e22',lim:'#8e44ad',tan:'#c0398b'},
  neon:{bg:'#07020f',bgGrid:'#1f1533',axis:'#ffffff',f:'#4dd2ff',F:'#fff35c',pos:'#39ff88',neg:'#ff4d6d',rect:'#ffa53d',lim:'#a98bff',tan:'#ff9ecf'},
  nord:{bg:'#2e3440',bgGrid:'#3b4252',axis:'#eceff4',f:'#88c0d0',F:'#ebcb8b',pos:'#a3be8c',neg:'#bf616a',rect:'#d08770',lim:'#b48ead',tan:'#e5a0c0'}
};
const T=()=>TX[lang()]||TX.ru;
const PANELS=['integral','presets','solve','anim','values','riemann','methods','show','export'];
const DEF={palette:'classic',colors:{...PAL.classic},dock:'auto',width:360,bottomH:46,ui:'auto',font:100,speed:1,lw:1,order:PANELS.slice(),collapsed:{methods:true,export:true},read:{},float:{x:12,y:12},
  show:{bgGrid:true,coords:true,area:true,riemann:false,dots:true,Fcurve:true,tangent:true,family:false,labels:true,snap:true,hints:true},last:null,rule:'mid',n:8};
const clone=o=>JSON.parse(JSON.stringify(o));
function load(){let r=null;try{r=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}
  const p=clone(DEF);if(!r||typeof r!=='object')return p;
  Object.assign(p,r);p.colors={...DEF.colors,...(r.colors||{})};p.show={...DEF.show,...(r.show||{})};
  const ord=Array.isArray(r.order)?r.order.filter(x=>PANELS.includes(x)):[];PANELS.forEach(x=>{if(!ord.includes(x))ord.push(x)});p.order=ord;
  p.collapsed=r.collapsed||{};p.float=r.float||{x:12,y:12};
  /* защита от повреждённых/старых настроек: числа — в пределах ползунков, иначе по умолчанию */const RNG={width:[240,560],bottomH:[25,75],font:[80,130],speed:[.25,3],lw:[.5,2.5]};for(const k in RNG){const v=p[k],[a,b]=RNG[k];p[k]=typeof v==='number'&&isFinite(v)?Math.min(b,Math.max(a,v)):DEF[k]}if(!p.float||typeof p.float!=='object'||!isFinite(p.float.x)||!isFinite(p.float.y))p.float={x:12,y:12};if(!p.collapsed||typeof p.collapsed!=='object'||Array.isArray(p.collapsed))p.collapsed={};return p}
let P=load();langFrom(()=>P.lang);if(!P.lang)P.lang=(navigator.language||'').toLowerCase().startsWith('ru')?'ru':'en';let saveT=0;
function save(){clearTimeout(saveT);saveT=setTimeout(()=>{try{localStorage.setItem(KEY,JSON.stringify(P))}catch(e){}},250)}

/* ---------- примеры ---------- */
const PRE=[['p_pow','x^2','0','2','power'],['p_sin','sin x','0','pi','table'],['p_lin','(2x+1)^3','0','1','linsub'],['p_usub','x e^(x^2)','0','1','usub'],
 ['p_parts','x e^x','0','1','parts'],['p_cyc','e^x sin x','0','pi','cyclic'],['p_pf','1/(x(x+1))','1','2','partial'],['p_sin2','sin^2 x','0','pi','trigid'],['p_circ','sqrt(1-x^2)','-1','1','trigsub'],
 ['p_poly','3x^2-2x+1','-1','2','linearity'],['p_ln','1/x','1','e','table'],['p_lnx','ln(x)/x','1','e','usub'],['p_xsin','x sin x','0','pi','parts'],['p_lnparts','ln x','1','e','parts'],
 ['p_atan','1/(1+x^2)','0','1','table'],['p_sq','(x+3)/(x^2+2x+5)','-1','2','square'],['p_sin3','sin^3 x','0','pi/2','oddpow'],['p_weier','1/(2+cos x)','0','pi/2','weier'],
 ['p_odd','x^3-4x','-2','2','symmetry'],['p_imp1','1/sqrt(x)','0','1','improper'],['p_imp2','1/x^2','1','inf','improper'],['p_gauss','e^(-x^2)','-inf','inf','nonelem'],['p_sinc','sin(x)/x','0','10','nonelem'],
 ['p_div','1/x^2','-1','1','improper',true]];
const M2T={power:'table',numeric:'simpson',polydiv:'polydiv',prodsum:'trigid'};

/* ---------- состояние ---------- */
const S={mode:'A',fs:'x^2',as:'0',bs:'2',fe:null,ff:null,aE:Nn(0),bE:Nn(2),a:0,b:2,t:1,xs:1.2,anim:null,C:0,rule:P.rule||'mid',n:P.n||8,V:{cx:1,cy:1,sx:80,sy:80},R:null,err:null,preset:null,drag:false};






/* символьный предел первообразной: только детерминированные формы (константа · ∞, ∞ + конст., x^p, ln, exp, arctan…);
   неопределённости (∞ − ∞, 0 · ∞, ∞/∞, колебания) → null, и тогда работает численный limN.
   Неточный ноль (|v| < 1e-9, например cos(π/2) в float) считается нулём с неизвестной стороной.
   Значение: {t:'f',v,s} — конечный предел (s: +1 сверху, −1 снизу, 0 точная константа, NaN неизвестно), {t:'i',s} — ±∞. */

/* предел первообразной: сначала символьно (точно), иначе численно. ex — предел найден точно */





/* условно сходящиеся несобственные интегралы с колебаниями: признак Лейбница + ускорение Эйлера */



/* анализ интеграла: X — задача (ff, fe, a, b, err, n, rule); результат — в X.R */
function analyze(full=true){return analyzeX(S,full)}



/* ---------- ввод интеграла ---------- */function calcRS(){calcRSX(S)}

function fmtLim(v){if(v===Infinity)return'inf';if(v===-Infinity)return'-inf';return String(+v.toFixed(4))}
function limH(e,v){if(v===Infinity)return'∞';if(v===-Infinity)return'−∞';const s=e===S.aE?S.as:e===S.bE?S.bs:'';if(!e||/^\s*[-−]?[\d.,]+(e[-+]?\d+)?\s*$/i.test(s))return Math.abs(v)<1e-3&&v!==0?String(v).replace('-','−'):fmt(v,4);return hp(e,0,true)}
function setIntegral(fs,as,bs,o={}){const prevF=S.fs;S.fs=fs;S.as=as;S.bs=bs;S.err=null;
  try{S.fe=parseFx(fs);S.ff=compile(S.fe)}catch(e){S.err=e&&e.msg==='inf'?'inf':'f'}
  if(!S.err){try{const A=parseLim(as);S.a=A.v;S.aE=A.e||null}catch(e){if(S.mode==='I'){S.a=0;S.aE=Nn(0)}else S.err=e&&e.msg==='x'?'x':'lim'}}
  if(!S.err){try{const B=parseLim(bs);S.b=B.v;S.bE=B.e||null}catch(e){if(S.mode==='I'){S.b=S.a+1;S.bE=null}else S.err=e&&e.msg==='x'?'x':'lim'}}
  if(o.preset!==undefined)S.preset=o.preset;else if(!o.keepPreset||fs!==prevF)S.preset=null;
  if(!o.noInputs)syncInputs();
  if(!S.err&&S.mode!=='I'){if(isFinite(S.a)&&isFinite(S.b)){if(!(S.xs>=Math.min(S.a,S.b)&&S.xs<=Math.max(S.a,S.b))||o.fit)S.xs=S.a+(S.b-S.a)*.6}else S.xs=isFinite(S.a)?S.a+2:isFinite(S.b)?S.b-2:1;
    }if(!S.err){P.last={f:fs,a:as,b:bs,p:S.preset};save()}
  S.anim=null;S.t=1;analyze(!S.drag);if(o.fit)fitView();renderAll()}
function syncInputs(){const fi=$('#fIn'),ai=$('#aIn'),bi=$('#bIn');if(document.activeElement!==fi)fi.value=S.fs;if(document.activeElement!==ai)ai.value=S.as;if(document.activeElement!==bi)bi.value=S.bs}
function loadPreset(id,o={}){const p=PRE.find(z=>z[0]===id);if(!p)return;setIntegral(p[1],p[2],p[3],{preset:id,fit:true});}

/* ---------- сцена ---------- */
const cv=$('#cv'),ctx=cv.getContext('2d'),stage=$('#stage'),main=$('#main'),side=$('#side');
let W=0,H=0,DPR=1,raf=0,sized=false;
new ResizeObserver(()=>{const r=stage.getBoundingClientRect();const fw=W;W=r.width;H=r.height;DPR=Math.min(2,window.devicePixelRatio||1);cv.width=Math.max(1,Math.round(W*DPR));cv.height=Math.max(1,Math.round(H*DPR));
  if(!sized&&W>0&&H>0){sized=true;fitView()}req()}).observe(stage);
function req(){if(!raf)raf=requestAnimationFrame(frame)}
const ease=p=>p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;
function frame(now){raf=0;const A=S.anim;
  if(A){const p=Math.min(1,(now-A.start)/A.dur),e=A.kind==='riem'?p:ease(p);
    if(A.kind==='sweepI'){S.t=e;S.xs=A.x0+e*(A.x1-A.x0)}else if(A.kind==='sweep'){S.t=e;if(S.mode==='F')S.xs=S.a+e*(S.b-S.a)}else{S.n=Math.max(1,Math.round(Math.pow(2,e*7)));calcRS();syncRiem(false)}
    if(p>=1){S.anim=null;if(A.kind==='riem'){P.n=S.n;save()}renderAll();if(A.then)A.then()}}
  renderNow();renderOverlay();syncT();if(S.anim)req()}
const w2s=(x,y)=>[W/2+(x-S.V.cx)*S.V.sx,H/2-(y-S.V.cy)*S.V.sy];
const s2w=(X,Y)=>[S.V.cx+(X-W/2)/S.V.sx,S.V.cy-(Y-H/2)/S.V.sy];
const sX=x=>W/2+(x-S.V.cx)*S.V.sx,sY=y=>H/2-(y-S.V.cy)*S.V.sy;
function niceStep(raw){const p=Math.pow(10,Math.floor(Math.log10(raw))),m=raw/p;return(m<1.5?1:m<3.5?2:m<7.5?5:10)*p}
function fitView(){if(!W||!H)return;let x0,x1;const a=S.a,b=S.b;
  if(S.err||!S.ff){S.V={cx:0,cy:0,sx:Math.min(W,H)/8,sy:Math.min(W,H)/8};req();return}
  if(S.mode==='I')return fitI();
  if(isFinite(a)&&isFinite(b)){const lo=Math.min(a,b),hi=Math.max(a,b),pd=Math.max(.6,(hi-lo)*.25);x0=lo-pd;x1=hi+pd}
  else if(isFinite(a)){x0=a-1.5;x1=a+9}else if(isFinite(b)){x0=b-9;x1=b+1.5}else{x0=-5;x1=5}
  const ys=[0];{let u0=x0,u1=x1;if(isFinite(a)&&isFinite(b)){const lo=Math.min(a,b),hi=Math.max(a,b),e=(hi-lo)*.08;u0=lo-e;u1=hi+e}for(let i=0;i<=400;i++){const x=u0+(u1-u0)*i/400,y=S.ff(x);if(isFinite(y))ys.push(y)}}
  if(S.mode==='F'&&isFinite(a)){const acc=accumAt(x0,x1,120);acc.forEach(v=>{if(isFinite(v))ys.push(v)})}
  ys.sort((p,q)=>p-q);const pick=q=>ys[Math.max(0,Math.min(ys.length-1,Math.round(q*(ys.length-1))))];
  let y0=Math.min(0,pick(.04)),y1=Math.max(0,pick(.96));if(y1-y0<1e-6){y0-=1;y1+=1}const py=(y1-y0)*.06;y0-=py;y1+=py;
  const pT=Math.min(110,H*.2),pB=Math.min(80,H*.13),hh=Math.max(40,H-pT-pB),sy=hh/(y1-y0);
  S.V={cx:(x0+x1)/2,sx:W/(x1-x0),sy,cy:(y0+y1)/2+(pT-pB)/2/sy};ACC=null;req()}
function iBase(){const f=S.ff;for(const x of[0,1,.5,2,-1,3,5])if(isFinite(f(x))&&Math.abs(f(x))<1e7)return x;return 1}
function Fi(x){const R=S.R;if(R&&R.FF)return R.FF(x)+S.C;const b=iBase();return quadF(S.ff,b,x).v+S.C}
function fitI(){const f=S.ff;let neg=0;for(let i=1;i<=40;i++){if(!isFinite(f(-i/10)))neg++}let x0=-3.5,x1=3.5,u0=-2,u1=2;if(neg>30){x0=-.6;x1=5;u0=.1;u1=3}
  const ys=[0];for(let i=0;i<=200;i++){const x=u0+(u1-u0)*i/200;const y=f(x);if(isFinite(y))ys.push(y);const F=Fi(x);if(isFinite(F))ys.push(F)}
  ys.sort((p,q)=>p-q);const pick=q=>ys[Math.max(0,Math.min(ys.length-1,Math.round(q*(ys.length-1))))];
  let y0=Math.min(0,pick(.06)),y1=Math.max(0,pick(.94));if(y1-y0<1e-6){y0-=1;y1+=1}const py=(y1-y0)*.08;y0-=py;y1+=py;
  const pT=Math.min(110,H*.2),pB=Math.min(80,H*.13),hh=Math.max(40,H-pT-pB),sy=hh/(y1-y0);
  S.V={cx:(x0+x1)/2,sx:W/(x1-x0),sy,cy:(y0+y1)/2+(pT-pB)/2/sy};if(!(S.xs>x0&&S.xs<x1))S.xs=x0+(x1-x0)*.62;ACC=null;req()}
function accumAt(x0,x1,N){const out=[];if(!isFinite(S.a))return out;for(let i=0;i<=N;i++){const x=x0+(x1-x0)*i/N;out.push(quadF(S.ff,S.a,x).v)}return out}
let ACC=null;
function accum(base){const a=base===undefined?S.a:base,k=[key(S.fe),a,S.V.cx,S.V.sx,W].join('|');if(ACC&&ACC.k===k)return ACC;const f=S.ff,st=2,xs=[],vs=[];
  for(let X=-4;X<=W+4;X+=st)xs.push(s2w(X,0)[0]);const n=xs.length;for(let i=0;i<n;i++)vs.push(NaN);
  if(!isFinite(a)){if(S.R&&S.R.FF){const L=limF(S.R.FF,a,1,S.R.F,S.ff);if(L!==null)for(let i=0;i<n;i++)vs[i]=S.R.FF(xs[i])-L}ACC={k,xs,vs};return ACC}
  const g2=(p,q)=>{const m=(p+q)/2,h=(q-p)/2,d=h/Math.sqrt(3),u=f(m-d),v=f(m+d);return h*(u+v)};
  let k0=xs.findIndex(x=>x>=a);if(k0<0)k0=n;
  if(k0<n){let A=quadF(f,a,xs[k0]).v;vs[k0]=A;for(let i=k0+1;i<n;i++){A+=g2(xs[i-1],xs[i]);if(!isFinite(A)||Math.abs(A)>1e9)break;vs[i]=A}}
  if(k0>0){let A=-quadF(f,xs[k0-1],a).v;vs[k0-1]=A;for(let i=k0-2;i>=0;i--){A-=g2(xs[i],xs[i+1]);if(!isFinite(A)||Math.abs(A)>1e9)break;vs[i]=A}}
  ACC={k,xs,vs};return ACC}
function renderNow(){ctx.setTransform(DPR,0,0,DPR,0,0);const c=P.colors,lw=P.lw;ctx.fillStyle=c.bg;ctx.fillRect(0,0,W,H);
  drawGrid();if(S.err||!S.ff){if(S.stamp)drawStamp();return}
  if(S.mode==='I'){drawI();plot(S.ff,P.colors.f,2.6*P.lw,1);drawXs();if(P.show.labels)drawLabels();if(S.stamp)drawStamp();return}
  const f=S.ff,a=S.a,b=S.b,R=S.R||{},Y0=sY(0);
  const [vx0]=s2w(0,0),[vx1]=s2w(W,0);
  const aE=isFinite(a)?a:vx0-1,bE=isFinite(b)?b:vx1+1;
  if(P.show.area){let x0=aE,x1;if(S.mode==='F')x1=S.xs;else x1=isFinite(a)&&isFinite(b)?a+S.t*(b-a):bE;
    if(S.mode==='F'&&!isFinite(a))x0=vx0-1;fillArea(x0,x1,a>b)}
  if(S.mode==='A'&&P.show.riemann&&!R.improper&&isFinite(a)&&isFinite(b))drawRects();
  if(S.mode==='F')drawF();
  plot(f,c.f,2.6*lw,1);
  drawLims();
  if(S.mode==='F')drawXs();
  if(P.show.labels)drawLabels();
  if(S.stamp)drawStamp()}
function drawGrid(){const c=P.colors,stx=niceStep(90/S.V.sx),sty=niceStep(64/S.V.sy),[x0,y1]=s2w(0,0),[x1,y0]=s2w(W,H);
  if(P.show.bgGrid){ctx.strokeStyle=c.bgGrid;ctx.lineWidth=1;ctx.beginPath();
    for(let x=Math.ceil(x0/stx)*stx;x<=x1;x+=stx){const X=Math.round(sX(x))+.5;ctx.moveTo(X,0);ctx.lineTo(X,H)}
    for(let y=Math.ceil(y0/sty)*sty;y<=y1;y+=sty){const Y=Math.round(sY(y))+.5;ctx.moveTo(0,Y);ctx.lineTo(W,Y)}ctx.stroke()}
  ctx.strokeStyle=c.axis;ctx.globalAlpha=.55;ctx.lineWidth=1.3;ctx.beginPath();const AX=sX(0),AY=sY(0);ctx.moveTo(0,AY);ctx.lineTo(W,AY);ctx.moveTo(AX,0);ctx.lineTo(AX,H);ctx.stroke();ctx.globalAlpha=1;
  if(P.show.coords){ctx.fillStyle=c.axis;ctx.globalAlpha=.7;ctx.font='500 12px Manrope, system-ui, sans-serif';const dx=Math.max(0,-Math.floor(Math.log10(stx))),dy=Math.max(0,-Math.floor(Math.log10(sty)));
    const ly=Math.max(14,Math.min(H-6,AY+15));ctx.textAlign='center';ctx.textBaseline='alphabetic';
    for(let x=Math.ceil(x0/stx)*stx;x<=x1;x+=stx){if(Math.abs(x)<stx/2)continue;ctx.fillText(fmt(x,dx),sX(x),ly)}
    const lx=Math.max(6,Math.min(W-40,AX-6));ctx.textAlign=AX-6<30?'left':'right';ctx.textBaseline='middle';
    for(let y=Math.ceil(y0/sty)*sty;y<=y1;y+=sty){if(Math.abs(y)<sty/2)continue;ctx.fillText(fmt(y,dy),AX-6<30?lx+10:lx,sY(y))}ctx.globalAlpha=1}}
const clampY=Y=>Math.max(-3*H,Math.min(4*H,Y));
function plot(fun,col,w,al,dash){ctx.strokeStyle=col;ctx.lineWidth=w;ctx.globalAlpha=al;ctx.setLineDash(dash||[]);ctx.lineJoin='round';ctx.beginPath();let pen=false,py=0;
  for(let X=-2;X<=W+2;X+=1.25){const x=s2w(X,0)[0],y=fun(x);if(!isFinite(y)){pen=false;continue}let Y=sY(y);
    if(pen&&Math.abs(Y-py)>H*1.2){pen=false}Y=clampY(Y);if(!pen){ctx.moveTo(X,Y);pen=true}else ctx.lineTo(X,Y);py=Y}
  ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1}
function fillArea(x0,x1,rev){if(x0===x1)return;const c=P.colors,f=S.ff;let X0=sX(Math.min(x0,x1)),X1=sX(Math.max(x0,x1));X0=Math.max(-6,X0);X1=Math.min(W+6,X1);if(X1<=X0)return;
  const Y0=sY(0),N=Math.max(2,Math.ceil((X1-X0)/1.25));ctx.beginPath();ctx.moveTo(X0,Y0);
  for(let i=0;i<=N;i++){const X=X0+(X1-X0)*i/N,y=f(s2w(X,0)[0]);ctx.lineTo(X,isFinite(y)?clampY(sY(y)):(isNaN(y)?Y0:(y>0?-3*H:4*H)))}
  ctx.lineTo(X1,Y0);ctx.closePath();const neg=(x0>x1)!==!!rev;
  ctx.save();ctx.clip();ctx.globalAlpha=.34;ctx.fillStyle=neg?c.neg:c.pos;ctx.fillRect(0,0,W,Math.max(0,Y0));ctx.fillStyle=neg?c.pos:c.neg;ctx.fillRect(0,Y0,W,H);ctx.restore();ctx.globalAlpha=1}
function drawRects(){const c=P.colors,f=S.ff,a=S.a,b=S.b;let n=S.n;const rule=S.rule;if(rule==='simp'&&n%2)n++;const h=(b-a)/n,Y0=sY(0),pxw=Math.abs(h*S.V.sx),thin=pxw<3;
  const y=x=>{const v=f(x);return isFinite(v)?v:0};ctx.lineWidth=1.2*P.lw;
  const shape=(pts)=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.globalAlpha=.2;ctx.fillStyle=c.rect;ctx.fill();if(!thin){ctx.globalAlpha=.9;ctx.strokeStyle=c.rect;ctx.stroke()}ctx.globalAlpha=1};
  const dots=[];
  if(rule==='simp'){for(let i=0;i<n;i+=2){const x0=a+i*h,x1=x0+h,x2=x1+h,f0=y(x0),f1=y(x1),f2=y(x2),pts=[[sX(x0),Y0]];
      for(let k=0;k<=16;k++){const t=k/16,x=x0+2*h*t,L0=(t-.5)*(t-1)*2,L1=-4*t*(t-1),L2=t*(t-.5)*2;pts.push([sX(x),clampY(sY(f0*L0+f1*L1+f2*L2))])}pts.push([sX(x2),Y0]);shape(pts);dots.push([x0,f0],[x1,f1],[x2,f2])}}
  else for(let i=0;i<n;i++){const xl=a+i*h,xr=xl+h;if(rule==='trap'){const yl=y(xl),yr=y(xr);shape([[sX(xl),Y0],[sX(xl),clampY(sY(yl))],[sX(xr),clampY(sY(yr))],[sX(xr),Y0]]);dots.push([xl,yl]);if(i===n-1)dots.push([xr,yr])}
    else{const xp=rule==='left'?xl:rule==='right'?xr:xl+h/2,yy=y(xp);shape([[sX(xl),Y0],[sX(xl),clampY(sY(yy))],[sX(xr),clampY(sY(yy))],[sX(xr),Y0]]);dots.push([xp,yy])}}
  if(P.show.dots&&pxw>5){ctx.fillStyle=c.rect;for(const[x,v]of dots){ctx.beginPath();ctx.arc(sX(x),clampY(sY(v)),3.2,0,7);ctx.fill()}}}
function drawF(){if(!P.show.Fcurve)return;const c=P.colors,A=accum(),lw=P.lw,fam=P.show.family;
  const path=(off,al,w)=>{ctx.strokeStyle=c.F;ctx.globalAlpha=al;ctx.lineWidth=w;ctx.beginPath();let pen=false;A.xs.forEach((x,i)=>{const v=A.vs[i];if(!isFinite(v)){pen=false;return}const X=sX(x),Y=clampY(sY(v+off));if(!pen){ctx.moveTo(X,Y);pen=true}else ctx.lineTo(X,Y)});ctx.stroke();ctx.globalAlpha=1};
  if(fam){const st=niceStep(70/S.V.sy);for(const k of[-3,-2,-1,1,2,3])path(k*st,.28,1.5*lw)}
  path(0,1,2.6*lw)}
function drawI(){if(!P.show.Fcurve)return;const c=P.colors,lw=P.lw,R=S.R||{},st=niceStep(70/S.V.sy),ks=P.show.family?[-3,-2,-1,1,2,3]:[];
  if(R.FF){for(const k of ks)plot(x=>R.FF(x)+S.C+k*st,c.F,1.5*lw,.28);plot(x=>R.FF(x)+S.C,c.F,2.6*lw,1);return}
  const A=accum(iBase());const path=(off,al,w)=>{ctx.strokeStyle=c.F;ctx.globalAlpha=al;ctx.lineWidth=w;ctx.beginPath();let pen=false;A.xs.forEach((x,i)=>{const v=A.vs[i];if(!isFinite(v)){pen=false;return}const X=sX(x),Y=clampY(sY(v+off));if(!pen){ctx.moveTo(X,Y);pen=true}else ctx.lineTo(X,Y)});ctx.stroke();ctx.globalAlpha=1};
  for(const k of ks)path(S.C+k*st,.28,1.5*lw);path(S.C,1,2.6*lw)}
function Aval(x){return S.mode==='I'?Fi(x):Aat(x)}
function Aat(x){return isFinite(S.a)?quadF(S.ff,S.a,x).v:(S.R&&S.R.FF?(()=>{const L=limF(S.R.FF,S.a,1,undefined,S.ff);return L===null?NaN:S.R.FF(x)-L})():NaN)}
function drawXs(){const c=P.colors,x=S.xs,X=sX(x),Y0=sY(0),fx=S.ff(x),Ax=Aval(x);ctx.setLineDash([3,4]);ctx.strokeStyle=c.axis;ctx.globalAlpha=.5;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(X,0);ctx.lineTo(X,H);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;
  if(isFinite(fx)){ctx.fillStyle=c.f;ctx.beginPath();ctx.arc(X,clampY(sY(fx)),4.5,0,7);ctx.fill()}
  if(isFinite(Ax)&&P.show.Fcurve){const AY=sY(Ax);if(P.show.tangent&&isFinite(fx)){const vx=S.V.sx,vy=-fx*S.V.sy,L=Math.hypot(vx,vy)||1,k=80/L;ctx.strokeStyle=c.tan;ctx.lineWidth=2*P.lw;ctx.beginPath();ctx.moveTo(X-vx*k,AY-vy*k);ctx.lineTo(X+vx*k,AY+vy*k);ctx.stroke()}
    ctx.fillStyle=c.F;ctx.beginPath();ctx.arc(X,AY,5,0,7);ctx.fill()}
  const hy=Math.max(14,Math.min(H-14,Y0));ctx.fillStyle=c.axis;ctx.strokeStyle=c.bg;ctx.lineWidth=2;ctx.beginPath();ctx.arc(X,hy,7,0,7);ctx.fill();ctx.stroke();
  label('x',X,hy+20,c.axis,17)}
function drawLims(){const c=P.colors,Y0=sY(0),hy=Math.max(14,Math.min(H-14,Y0));
  [['a',S.a],['b',S.b]].forEach(([n,v])=>{if(!isFinite(v)){const X=v>0?W-16:16;label(v>0?'b → ∞':'−∞ ← a',v>0?W-44:44,Math.min(H-30,hy-16),c.lim,15);return}
    const X=sX(v);if(X<-20||X>W+20)return;ctx.strokeStyle=c.lim;ctx.globalAlpha=.75;ctx.lineWidth=1.5*P.lw;ctx.setLineDash([6,5]);ctx.beginPath();ctx.moveTo(X,0);ctx.lineTo(X,H);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;
    ctx.fillStyle=c.lim;ctx.beginPath();ctx.arc(X,hy,7.5,0,7);ctx.fill();label(n,X,hy+21,c.lim,18)})}
function label(s,x,y,col,sz=17){ctx.font=`italic 600 ${sz}px "Source Serif 4", Georgia, serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineWidth=4;ctx.strokeStyle=P.colors.bg;ctx.lineJoin='round';ctx.strokeText(s,x,y);ctx.fillStyle=col;ctx.fillText(s,x,y)}
function drawLabels(){const c=P.colors,f=S.ff;for(const X of[W-70,W-140,W*.6,W*.4]){const x=s2w(X,0)[0],y=f(x),Y=sY(y);if(isFinite(y)&&Y>24&&Y<H-24){label('f',X,Y-16,c.f,19);break}}
  if(S.mode==='I'&&P.show.Fcurve){for(const X of[W*.25,W*.15,W*.35]){const v=Fi(s2w(X,0)[0]),Y=sY(v);if(isFinite(v)&&Y>24&&Y<H-24){label('F + C',X,Y-18,c.F,18);break}}}
  if(S.mode==='F'&&P.show.Fcurve){const A=accum();for(let i=A.xs.length-40;i>20;i-=15){const v=A.vs[i];if(!isFinite(v))continue;const Y=sY(v);if(Y>24&&Y<H-24){label('F',sX(A.xs[i]),Y+18,c.F,19);break}}}}
function drawStamp(){const txt=textOf(),c=P.colors;ctx.font='600 15px "Source Serif 4", Georgia, serif';const w=ctx.measureText(txt).width+20;ctx.globalAlpha=.85;ctx.fillStyle=c.bg;ctx.fillRect(W-w-12,H-38,w,28);ctx.globalAlpha=1;ctx.fillStyle=c.axis;ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(txt,W-w-2,H-24)}
function textOf(){if(S.err)return'';const R=S.R||{};if(S.mode==='I')return R.F?`∫ ${tp(S.fe,0,'txt')} dx = ${tp(R.F,0,'txt')} + C`:`∫ ${tp(S.fe,0,'txt')} dx`;const v=R.div?T().v_div:R.exact?tp(R.exact,0,'txt'):fmt(R.val,5);return`∫[${S.as}; ${S.bs}] ${tp(S.fe,0,'txt')} dx = ${v}`}

/* ---------- указатель ---------- */
const ptrs=new Map();let drag=null;
const pos=e=>{const r=cv.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}};
function hit(X,Y){if(S.err)return null;const c=[];if(S.mode!=='A')c.push(['xs',S.xs,14]);if(S.mode==='I')return Math.abs(sX(S.xs)-X)<16?'xs':null;if(isFinite(S.b))c.push(['b',S.b,11]);if(isFinite(S.a))c.push(['a',S.a,11]);
  let best=null,bd=1e9;for(const[n,v,r]of c){const d=Math.abs(sX(v)-X);if(d<r&&d<bd){bd=d;best=n}}return best}
cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);const p=pos(e);ptrs.set(e.pointerId,p);
  if(ptrs.size===2){const[p1,p2]=[...ptrs.values()];drag={type:'pinch',d:Math.hypot(p1.x-p2.x,p1.y-p2.y)||1,V:{...S.V},c:s2w((p1.x+p2.x)/2,(p1.y+p2.y)/2),m:[(p1.x+p2.x)/2,(p1.y+p2.y)/2]};S.drag=false;return}
  const h=hit(p.x,p.y);if(h){drag={type:h};S.drag=true;S.anim=null;cv.style.cursor='ew-resize'}else{drag={type:'pan',x:p.x,y:p.y,cx:S.V.cx,cy:S.V.cy};cv.style.cursor='grabbing'}});
cv.addEventListener('pointermove',e=>{const p=pos(e);if(ptrs.has(e.pointerId))ptrs.set(e.pointerId,p);
  if(!drag){cv.style.cursor=hit(p.x,p.y)?'ew-resize':'grab';return}
  if(drag.type==='pinch'&&ptrs.size===2){const[p1,p2]=[...ptrs.values()],d=Math.hypot(p1.x-p2.x,p1.y-p2.y),k=d/drag.d,m=[(p1.x+p2.x)/2,(p1.y+p2.y)/2];
    S.V.sx=Math.max(1e-3,drag.V.sx*k);S.V.sy=Math.max(1e-3,drag.V.sy*k);S.V.cx=drag.c[0]-(m[0]-W/2)/S.V.sx;S.V.cy=drag.c[1]+(m[1]-H/2)/S.V.sy;req();return}
  if(drag.type==='pan'){S.V.cx=drag.cx-(p.x-drag.x)/S.V.sx;S.V.cy=drag.cy+(p.y-drag.y)/S.V.sy;req();return}
  let x=s2w(p.x,p.y)[0];if(P.show.snap){const st=niceStep(90/S.V.sx)/4;const sx=Math.round(x/st)*st;if(Math.abs(sX(sx)-p.x)<10)x=snap(+sx.toFixed(10))}
  if(drag.type==='xs'){S.xs=x;renderOverlay();if(S.mode!=='I'&&isFinite(S.a)&&isFinite(S.b)&&S.b!==S.a)S.t=Math.max(0,Math.min(1,(x-S.a)/(S.b-S.a)));renderValues();renderCaption();req();return}
  const v=fmtLim(x);if(drag.type==='a')setIntegral(S.fs,v,S.bs,{keepPreset:true});else setIntegral(S.fs,S.as,v,{keepPreset:true})});
function endPtr(e){ptrs.delete(e.pointerId);if(ptrs.size<2&&drag&&drag.type==='pinch'){const q=[...ptrs.values()][0];drag=q?{type:'pan',x:q.x,y:q.y,cx:S.V.cx,cy:S.V.cy}:null}if(!ptrs.size){const was=drag&&(drag.type==='a'||drag.type==='b');drag=null;cv.style.cursor='grab';if(S.drag){S.drag=false;if(was){analyze(true);renderAll()}}}}
cv.addEventListener('pointerup',endPtr);cv.addEventListener('pointercancel',endPtr);
function zoomAt(X,Y,kx,ky){const[wx,wy]=s2w(X,Y);S.V.sx*=kx;S.V.sy*=ky;S.V.cx=wx-(X-W/2)/S.V.sx;S.V.cy=wy+(Y-H/2)/S.V.sy;ACC=null;req()}
cv.addEventListener('wheel',e=>{e.preventDefault();const k=Math.exp(-e.deltaY*.0015),p=pos(e);zoomAt(p.x,p.y,e.shiftKey?1:k,e.altKey?1:k)},{passive:false});
$('#zIn').onclick=()=>zoomAt(W/2,H/2,1.25,1.25);$('#zOut').onclick=()=>zoomAt(W/2,H/2,.8,.8);$('#zHome').onclick=()=>fitView();

/* ---------- панели ---------- */
function buildPanels(){
  document.querySelectorAll('.panel').forEach(p=>{
    const h=document.createElement('div');h.className='ph';
    h.innerHTML=`<span class="handle" data-it="drag">⠿</span><h3 data-i="p_${p.dataset.id}"></h3><button class="icon" data-mv="-1" data-it="up">↑</button><button class="icon" data-mv="1" data-it="down">↓</button><button class="icon chev" data-col data-it="collapse">▾</button>`;
    p.prepend(h);
    const id=p.dataset.id,toggle=()=>{P.collapsed[id]=!P.collapsed[id];p.classList.toggle('collapsed',!!P.collapsed[id]);save()};
    h.querySelector('h3').onclick=toggle;h.querySelector('[data-col]').onclick=toggle;
    h.querySelectorAll('[data-mv]').forEach(b=>b.onclick=()=>{const i=P.order.indexOf(id),j=i+(+b.dataset.mv);if(j<0||j>=P.order.length)return;[P.order[i],P.order[j]]=[P.order[j],P.order[i]];applyOrder();save()});
    const hd=h.querySelector('.handle');
    hd.addEventListener('pointerdown',()=>{p.draggable=true;window.addEventListener('pointerup',()=>{if(!p.classList.contains('dragging'))p.draggable=false},{once:true})});
    p.addEventListener('dragstart',e=>{p.classList.add('dragging');e.dataTransfer.effectAllowed='move';try{e.dataTransfer.setData('text/plain',id)}catch(_){}});
    p.addEventListener('dragend',()=>{p.classList.remove('dragging');p.draggable=false;P.order=[...side.querySelectorAll('.panel')].map(x=>x.dataset.id);save()});
  });
  side.addEventListener('dragover',e=>{const dr=side.querySelector('.panel.dragging');if(!dr)return;e.preventDefault();
    const after=[...side.querySelectorAll('.panel:not(.dragging)')].find(el=>{const r=el.getBoundingClientRect();return e.clientY<r.top+r.height/2});
    if(after)side.insertBefore(dr,after);else side.appendChild(dr)});
}
function applyOrder(){P.order.forEach(id=>{const el=side.querySelector(`.panel[data-id="${id}"]`);if(el)side.appendChild(el)});
  side.querySelectorAll('.panel').forEach(p=>p.classList.toggle('collapsed',!!P.collapsed[p.dataset.id]))}
function showPanel(id){P.collapsed[id]=false;applyOrder();save();const el=side.querySelector(`.panel[data-id="${id}"]`);if(el)setTimeout(()=>el.scrollIntoView({block:'nearest',behavior:'smooth'}),50)}
const IGL=(a,b)=>`<span class="igl"><span class="ig">∫</span><span class="lm"><span>${b}</span><span>${a}</span></span></span>`;
const intH=()=>`${IGL(limH(S.aE,S.a),limH(S.bE,S.b))}${hp(S.fe,2)} d<i>x</i>`;
const noV=R=>R.undef?T().v_undef:R.undec?T().v_undec:T().v_div;
function valH(R,approx=true){if(R.div)return noV(R);if(R.exact){const ex=hp(R.exact,0),n=fmt(R.val,5);return ex===n||ex===n.replace('−','−')?ex:`${ex} ≈ ${n}`}return`${approx?'≈ ':''}${fmt(R.val,6)}`}
const intI=()=>`<span class="ig">∫</span>${hp(S.fe,2)} d<i>x</i>`;
function renderFx(){PRINT.v='x';const L=T(),er=$('#fErr');
  if(S.err){er.hidden=false;er.textContent=S.err==='f'?L.errParse:S.err==='inf'?L.errInfF:S.err==='x'?L.errX:L.errLim;$('#fPrev').innerHTML='';return}
  er.hidden=true;$('#fPrev').innerHTML=S.mode==='I'?intI():intH()}
function methsOf(R){const s=R.sol;let m=s.F?s.meth.slice():[s.ne?'nonelem':'numeric'];if(S.mode==='I')return m;if(R.improper)m.push('improper');if(R.odd)m.push('symmetry');return m}
function renderSolve(){const box=$('#solve'),L=T();PRINT.v='x';if(S.err){box.innerHTML=`<p class="note">${L.cap.err}</p>`;return}
  const R=S.R,s=R.sol,ms=methsOf(R);let h=`<div class="mchips">${ms.map(m=>`<button class="chip" data-term="${M2T[m]||m}">${L.mn[m]||m}</button>`).join('')}</div>`;
  const pre=S.mode!=='I'&&S.preset&&L.ideas[S.preset],idea=pre||L.why[ms[0]];if(idea)h+=`<p class="idea"><b>${L.s_idea}</b> ${idea}</p>`;
  if(s.F){h+=`<details class="steps"${P.stepsClosed?'':' open'} id="stpD"><summary>${L.s_steps}</summary><ol class="stp">${s.steps.map(z=>`<li class="${z.d?'sub':''}" style="--d:${z.d}">${z.h}</li>`).join('')}</ol></details>`;
    h+=`<div class="ans"><div class="k">${L.s_answer}</div><div class="mx"><span class="ig">∫</span>${hp(S.fe,2)} d<i>x</i> = ${hp(s.F,0)} + <i>C</i></div><p class="note ok">✓ ${L.s_check}<button class="q" data-term="check">?</button></p></div>`}
  else h+=`<p class="note">${s.ne?L.ne[s.ne]:L.s_fail}</p>${s.ne?'':`<ul class="try">${L.s_failTry}</ul>`}`;
  if(S.mode==='I'){if(s.F)h+=`<p class="note">${L.iC}<button class="q" data-term="indefinite">?</button></p>`;box.innerHTML=h;const d0=$('#stpD');if(d0)d0.ontoggle=()=>{P.stepsClosed=!d0.open;save()};return}
  h+=`<div class="ans"><div class="k">${L.s_def}</div>`;
  if(R.how==='nl')h+=`<p class="note" style="margin:.3rem 0 .2rem">${L.s_nl}</p><div class="mx">${intH()} = <i>F</i>(${limH(S.bE,S.b)}) − <i>F</i>(${limH(S.aE,S.a)}) = ${fmt(R.Fb,4)} − ${R.Fa<0?'('+fmt(R.Fa,4)+')':fmt(R.Fa,4)} = ${valH(R)}</div>`;
  else if(R.how==='lim')h+=`<p class="note" style="margin:.3rem 0 .2rem">${L.s_imp} ${L.s_impConv}</p><div class="mx">${intH()} = ${valH(R)}</div>`;
  else if(R.how==='div')h+=R.undef?`<p class="note" style="margin:.3rem 0 .2rem">${L.s_undef}</p>`:`<p class="note" style="margin:.3rem 0 .2rem">${L.s_imp}</p><div class="mx">${intH()}: ${R.undec?L.s_undec:R.divOsc?L.s_divOsc:L.s_div}</div>`;
  else if(R.how==='jump')h+=`<p class="note" style="margin:.3rem 0 .2rem">${L.s_jump}</p><div class="mx">${intH()} ${R.exact?'= ':''}${valH(R)}</div>`;
  else h+=`${R.improper?`<p class="note" style="margin:.3rem 0 .2rem">${L.s_imp}${R.osc?' '+L.s_osc:''}</p>`:''}<div class="mx">${intH()} ${R.exact?'= ':''}${valH(R)}</div>`;
  if(R.odd)h+=`<p class="note">${L.s_odd}<button class="q" data-term="symmetry">?</button></p>`;else if(R.even)h+=`<p class="note">${L.s_even}<button class="q" data-term="symmetry">?</button></p>`;
  h+='</div>';box.innerHTML=h;const d=$('#stpD');if(d)d.ontoggle=()=>{P.stepsClosed=!d.open;save()}}
function prop(k,v,s,sw){return`<div class="prop"><span class="k">${sw?`<span class="sw" style="background:${sw}"></span>`:''}${k}</span><span class="v">${v}</span>${s?`<span class="s">${s}</span>`:''}</div>`}
function renderValues(){const L=T(),box=$('#props');if(S.err){box.innerHTML='';return}const R=S.R;let h='';
  if(S.mode==='I'){const x=S.xs;h+=prop(L.v_Fi,`<i>F</i>(${fmt(x,3)}) + <i>C</i> = ${fmt(Fi(x),5)}`,L.v_FiS,'var(--s-F)');h+=prop(L.v_fx,fmt(S.ff(x),5),L.v_fxS,'var(--s-f)');h+=prop(L.v_C,fmt(S.C,2),L.v_CS);if(!R.F)h+=prop(L.v_num,L.v_none,L.noF);box.innerHTML=h;return}
  h+=prop(L.v_int,R.div?noV(R):R.exact?hp(R.exact,0):fmt(R.val,6),L.v_intS);
  h+=prop(L.v_num,R.numOk?fmt(R.num,8):L.v_none,L.v_numS);
  if(!R.improper&&!R.undef&&R.rs!=null){h+=prop(L.v_rs,fmt(R.rs,6),L.v_rsS(L['r_'+S.rule],R.rsN),'var(--s-rect)');h+=prop(L.v_err,(R.rs-R.val>=0?'+':'')+fmt(R.rs-R.val,Math.abs(R.rs-R.val)<1e-3?8:5),L.v_errS)}
  else h+=prop(L.v_rs,L.v_none,L.v_noRS);
  if(!R.div&&R.abs!=null){h+=prop(L.v_abs,fmt(R.abs,5),L.v_absS);h+=prop(L.v_pos,`<span style="color:var(--s-pos)">${fmt(R.pos,4)}</span> / <span style="color:var(--s-neg)">${fmt(R.neg,4)}</span>`,L.v_posS);
    if(R.mean!=null&&isFinite(R.mean))h+=prop(L.v_mean,fmt(R.mean,5),L.v_meanS)}
  if(S.mode==='F'){const A=Aat(S.xs);h+=prop(L.v_F,`<i>F</i>(${fmt(S.xs,3)}) = ${fmt(A,5)}`,L.v_FS,'var(--s-F)')}
  box.innerHTML=h}
function renderPresets(){PRINT.v='x';const box=$('#pre'),L=T();box.innerHTML='';
  PRE.forEach(([id,f,a,b,m,hid])=>{if(hid)return;const btn=document.createElement('button');btn.className='chip mxc'+(S.preset===id?' on':'');btn.dataset.pre=id;let e;try{e=parseFx(f)}catch(_){return}
    btn.innerHTML=`<span class="ig">∫</span>${hp(e,2)}`;btn.title=L.mn[m]||'';box.appendChild(btn)});
  renderHist()}
function renderHist(){const L=T();if(S.err){$('#hist').innerHTML='';return}const ms=methsOf(S.R);$('#hist').innerHTML=`${L.now} <b>${ms.map(m=>L.mn[m]||m).join(', ')}</b>`}
function renderGuide(){const L=T(),ms=S.err?[]:methsOf(S.R);const act={table:['table','power','linsub'],linearity:['linearity'],usub:['usub'],parts:['parts','cyclic'],partial:['partial','polydiv','square'],trigid:['trigid','oddpow','weier','prodsum'],trigsub:['trigsub'],nonelem:['nonelem','numeric']};
  $('#guide').innerHTML=`<p class="note" style="margin-top:.2rem">${L.g_intro}</p><ol class="guide">${L.guide.map(([id,q,ex,p])=>`<li class="${act[id].some(m=>ms.includes(m))?'on':''}"><div><button class="linkbtn" data-term="${id}">${L.mn[id]||T().mn.numeric}</button> ${q}</div><button class="chip" data-pre="${p}">${L.g_ex}: ${ex}</button></li>`).join('')}</ol>`}
function renderOverlay(){const ov=$('#ov');if(S.err){ov.innerHTML=`<span class="tt">${T().cap.err}</span>`;return}PRINT.v='x';const R=S.R;
  if(S.mode==='I'){const fx=S.ff(S.xs),F=Fi(S.xs);ov.innerHTML=`<span>${intI()} = ${R.F?hp(R.F,0)+' + <i>C</i>':'?'}</span><span class="tt">${R.F?'':T().noF+'. '}C = ${fmt(S.C,2)},  x = ${fmt(S.xs,3)},  F(x) + C = ${fmt(F,4)},  F′(x) = f(x) = ${fmt(fx,4)}</span>`;return}
  if(S.mode==='F'){const A=Aat(S.xs),fx=S.ff(S.xs);ov.innerHTML=`<span><i>F</i>(<i>x</i>) = ${IGL(limH(S.aE,S.a),'<i>x</i>')}${hp(S.fe,2).replace(/<i>x<\/i>/g,'<i>t</i>')} d<i>t</i></span><span class="tt">x = ${fmt(S.xs,3)},  F(x) = ${fmt(A,4)},  F′(x) = f(x) = ${fmt(fx,4)}</span>`;return}
  if(S.t<1&&isFinite(S.a)&&isFinite(S.b)){const x=S.a+S.t*(S.b-S.a),v=quadF(S.ff,S.a,x).v;ov.innerHTML=`<span>${IGL(limH(S.aE,S.a),fmt(x,2))}${hp(S.fe,2)} d<i>x</i> ≈ ${fmt(v,4)}</span><span class="tt">t = ${fmt(S.t)}</span>`;return}
  let extra='';if(P.show.riemann&&R.rs!=null&&!R.improper)extra=`<span class="tt">${T()['r_'+S.rule]}, n = ${R.rsN}: ${fmt(R.rs,5)}</span>`;
  ov.innerHTML=`<span>${intH()} ${R.div?'— '+noV(R):(R.exact?'= ':'')+valH(R)}</span>${extra}`}
function renderCaption(){const cap=$('#cap'),C=T().cap;$('#capOpen').hidden=!!P.show.hints;if(!P.show.hints){cap.hidden=true;return}cap.hidden=false;let t;
  if(S.err)t=C.err;else{const R=S.R,v=R.div?'':valH(R,true);
    if(S.mode==='I'){const fx=S.ff(S.xs);t=!P.show.Fcurve?C.Ih:R.F?C.I(fmt(S.xs,2),fmt(fx,3)):C.In}
    else if(S.mode==='F'){const fx=S.ff(S.xs),A=Aat(S.xs);t=isFinite(A)?C.F(fmt(S.xs,2),fmt(A,3),fmt(fx,3)):C.F0}
    else if(R.undef)t=C.undef;else if(R.div)t=C.div;else if(R.improper)t=C.imp;
    else if(P.show.riemann&&R.rs!=null)t=C.riem(T()['r_'+S.rule],R.rsN,fmt(R.rs,5),(R.rs-R.val>=0?'+':'')+fmt(R.rs-R.val,6));
    else if(S.a>S.b)t=C.rev;
    else if(R.pos>1e-9&&R.neg<-1e-9)t=C.mix(fmt(R.pos,3),fmt(-R.neg,3),fmt(R.val,4));
    else if(R.val<0)t=C.neg(fmt(R.val,4));else t=C.pos(fmt(R.val,4))}
  $('#capT').textContent=t.replace(/<[^>]+>/g,'')}
function syncT(){$('#tR').value=Math.round(S.t*1000);$('#tOut').textContent=fmt(S.t)}
function syncRiem(full=true){document.querySelectorAll('#rSeg button').forEach(b=>b.classList.toggle('on',b.dataset.r===S.rule));$('#nR').value=Math.min(200,S.n);$('#nOut').textContent=S.rule==='simp'&&S.n%2?`${S.n} → ${S.n+1}`:S.n;
  $('#rOn').checked=!!P.show.riemann;const L=T();$('#rNote').textContent=L.rNote[S.rule];$('#rImp').hidden=!(S.R&&S.R.improper);if(full){renderValues();renderCaption()}req()}
function renderAll(){renderFx();renderSolve();renderValues();renderPresets();renderGuide();renderCaption();renderTex();syncRiem(false);syncT();req()}

/* ---------- кнопки ---------- */
let fT=0;
$('#fIn').addEventListener('input',e=>{clearTimeout(fT);fT=setTimeout(()=>setIntegral(e.target.value,$('#aIn').value,$('#bIn').value,{noInputs:true}),250)});
['#aIn','#bIn'].forEach(id=>$(id).addEventListener('input',()=>{clearTimeout(fT);fT=setTimeout(()=>setIntegral($('#fIn').value,$('#aIn').value,$('#bIn').value,{noInputs:true,keepPreset:true}),300)}));
['#fIn','#aIn','#bIn'].forEach(id=>$(id).addEventListener('keydown',e=>{if(e.key==='Enter'){clearTimeout(fT);setIntegral($('#fIn').value,$('#aIn').value,$('#bIn').value,{noInputs:true,fit:true})}}));
$('#bSwap').onclick=()=>setIntegral(S.fs,S.bs,S.as,{keepPreset:true});
$('#bFit').onclick=()=>fitView();
document.addEventListener('click',e=>{const q=e.target.closest('[data-term]');if(q){e.preventDefault();e.stopPropagation();openTerm(q.dataset.term);return}
  const p=e.target.closest('[data-pre]');if(p){loadPreset(p.dataset.pre)}});
document.querySelectorAll('#modeSeg button').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
function setMode(m){const wasI=S.mode==='I';S.mode=m;P.mode=m;S.anim=null;document.body.classList.toggle('mF',m==='F');document.body.classList.toggle('mI',m==='I');
  if(m==='I'&&!P.seenI){P.seenI=true;P.show.family=true;P.show.tangent=true;syncToggles()}save();
  if(m==='I'||wasI){document.querySelectorAll('#modeSeg button').forEach(b=>b.classList.toggle('on',b.dataset.mode===m));setIntegral(S.fs,S.as,S.bs,{keepPreset:true,fit:true});return}document.querySelectorAll('#modeSeg button').forEach(b=>b.classList.toggle('on',b.dataset.mode===m));
  if(m==='F'&&isFinite(S.a)&&isFinite(S.b)&&!(S.xs>=Math.min(S.a,S.b)&&S.xs<=Math.max(S.a,S.b)))S.xs=S.a+.6*(S.b-S.a);S.t=1;ACC=null;fitView();renderAll()}
function play(){if(S.err)return;if(S.mode==='I'){const x0=s2w(30,0)[0],x1=s2w(W-60,0)[0];S.t=0;S.anim={kind:'sweepI',x0,x1,start:performance.now(),dur:3200/P.speed};req();return}if(!isFinite(S.a)||!isFinite(S.b)){toast(T().s_imp);return}S.t=0;S.anim={kind:'sweep',start:performance.now(),dur:2200/P.speed};req()}
function playRiem(){if(S.err||(S.R&&S.R.improper)){toast(T().rImp);return}if(S.mode!=='A')setMode('A');P.show.riemann=true;syncToggles();save();S.t=1;S.anim={kind:'riem',start:performance.now(),dur:4200/P.speed};req()}
$('#cR').oninput=e=>{S.C=+e.target.value;$('#cOut').textContent=fmt(S.C,1);renderValues();renderCaption();req()};
$('#bPlay').onclick=play;$('#bZero').onclick=()=>{S.anim=null;S.t=0;if(S.mode==='F'&&isFinite(S.a))S.xs=S.a;renderValues();req()};$('#bOne').onclick=()=>{S.anim=null;S.t=1;if(S.mode==='F'&&isFinite(S.b))S.xs=S.b;renderValues();renderCaption();req()};
$('#tR').oninput=e=>{S.anim=null;S.t=e.target.value/1000;if(S.mode==='I')S.xs=s2w(30+S.t*(W-90),0)[0];if(S.mode==='F'&&isFinite(S.a)&&isFinite(S.b))S.xs=S.a+S.t*(S.b-S.a);renderValues();renderCaption();req()};
$('#spR').oninput=e=>{P.speed=+e.target.value;$('#spOut').textContent='×'+fmt(P.speed);save()};
document.querySelectorAll('#rSeg button').forEach(b=>b.onclick=()=>{S.rule=P.rule=b.dataset.r;if(!P.show.riemann){P.show.riemann=true;syncToggles()}save();calcRS();syncRiem();renderOverlay()});
$('#nR').oninput=e=>{S.n=P.n=+e.target.value;if(!P.show.riemann){P.show.riemann=true;syncToggles()}save();calcRS();syncRiem();renderOverlay()};
$('#rOn').onchange=e=>{P.show.riemann=e.target.checked;syncToggles();save();syncRiem();renderOverlay()};
$('#rPlay').onclick=playRiem;
$('#capOpen').onclick=()=>{P.show.hints=true;syncToggles();renderCaption();save()};
$('#capX').onclick=()=>{P.show.hints=false;syncToggles();renderCaption();save()};
const TOG=[['bgGrid'],['coords'],['area'],['riemann','A'],['dots','A'],['Fcurve','FI'],['tangent','FI'],['family','FI'],['labels'],['snap'],['hints']];
function buildToggles(){const box=$('#tog');box.innerHTML='';TOG.forEach(([k,m])=>{const l=document.createElement('label');l.className='chk'+(m==='A'?' Aonly':m==='F'?' Fonly':m==='FI'?' FIonly':'');
  l.innerHTML=`<input type="checkbox" data-k="${k}"> <span>${T().tog[k]}</span>`;l.querySelector('input').onchange=e=>{P.show[k]=e.target.checked;save();if(k==='riemann')syncRiem();renderCaption();renderOverlay();req()};box.appendChild(l)})}
function syncToggles(){document.querySelectorAll('#tog input').forEach(i=>{i.checked=!!P.show[i.dataset.k]});const r=$('#rOn');if(r)r.checked=!!P.show.riemann}

/* ---------- справочник ---------- */
const termTitle=id=>{const t=TERMS.find(x=>x.id===id);return t?(t[lang()]||t.ru)[0]:id};
function mathify(h){return h}
function gTabs(id,html){const f=FORMAL[id];if(!f)return html;const L=T(),ft=P.gTab==='f';
  return`<div class="seg gtabs"><button data-tab="i" class="${ft?'':'on'}">${L.tabI}</button><button data-tab="f" class="${ft?'on':''}">${L.tabF}</button></div><div class="pane" data-pane="i"${ft?' hidden':''}>${html}</div><div class="pane" data-pane="f"${ft?'':' hidden'}>${f[lang()]||f.ru}</div>`}
function illSvg(id){const sp=ILL[id];if(!sp)return'';const W=200,H=140,o=sp.o,sx=sp.sx,sy=sp.sy;
  const X=x=>o[0]+x*sx,Y=y=>o[1]-y*sy,c=k=>`var(--s-${k})`,F=v=>(+v).toFixed(1);let out='';
  const line=(x1,y1,x2,y2,col,w=1.5,op=1,dash)=>`<line x1="${F(x1)}" y1="${F(y1)}" x2="${F(x2)}" y2="${F(y2)}" stroke="${c(col)}" stroke-width="${w}" stroke-opacity="${op}"${dash?' stroke-dasharray="4 3"':''}/>`;
  const tx=(x,y,t,col,sz=12)=>`<text x="${F(x)}" y="${F(y)}" fill="${c(col)}" font-size="${sz}" font-style="italic" font-family="'Source Serif 4',Georgia,serif" text-anchor="middle" dominant-baseline="middle" paint-order="stroke" stroke="var(--s-bg)" stroke-width="3" stroke-linejoin="round">${t}</text>`;
  const pts=a=>a.map(p=>F(p[0])+','+F(Math.max(-20,Math.min(H+20,p[1])))).join(' ');
  const samp=(f,x0,x1,n=80)=>{const r=[];for(let i=0;i<=n;i++){const x=x0+(x1-x0)*i/n,y=f(x);if(isFinite(y))r.push([X(x),Y(y)])}return r};
  for(const it of sp.it){const k=it[0],a=it.slice(1);
    if(k==='grid'){const st=sx>=50?1:sx>=25?1:2;for(let i=-20;i<=20;i++){out+=line(X(i*st),0,X(i*st),H,'bgGrid',1)}const sty=sy>=50?.5:1;for(let i=-20;i<=20;i++)out+=line(0,Y(i*sty),W,Y(i*sty),'bgGrid',1);out+=line(0,Y(0),W,Y(0),'axis',1,.45)+line(X(0),0,X(0),H,'axis',1,.45)}
    else if(k==='fn'){const[f,x0,x1,col,op=1]=a;out+=`<polyline points="${pts(samp(f,x0,x1))}" fill="none" stroke="${c(col)}" stroke-width="2.2" stroke-opacity="${op}" stroke-linejoin="round"/>`}
    else if(k==='area'){const[f,x0,x1]=a,p=samp(f,x0,x1,120);const poly=`${F(X(x0))},${F(Y(0))} ${pts(p)} ${F(X(x1))},${F(Y(0))}`;const cid='c'+id+Math.random().toString(36).slice(2,7);
      out+=`<clipPath id="${cid}a"><rect x="0" y="0" width="${W}" height="${F(Y(0))}"/></clipPath><clipPath id="${cid}b"><rect x="0" y="${F(Y(0))}" width="${W}" height="${H}"/></clipPath><polygon points="${poly}" fill="${c('pos')}" fill-opacity=".35" clip-path="url(#${cid}a)"/><polygon points="${poly}" fill="${c('neg')}" fill-opacity=".35" clip-path="url(#${cid}b)"/>`}
    else if(k==='rects'){const[f,x0,x1,n,rule]=a,h=(x1-x0)/n;
      if(rule==='simp'){for(let i=0;i<n;i+=2){const q0=x0+i*h,f0=f(q0),f1=f(q0+h),f2=f(q0+2*h),pp=[[X(q0),Y(0)]];for(let j=0;j<=16;j++){const t=j/16;pp.push([X(q0+2*h*t),Y(f0*(t-.5)*(t-1)*2+f1*(-4*t*(t-1))+f2*t*(t-.5)*2)])}pp.push([X(q0+2*h),Y(0)]);out+=`<polygon points="${pts(pp)}" fill="${c('rect')}" fill-opacity=".22" stroke="${c('rect')}" stroke-width="1.2"/>`}}
      else for(let i=0;i<n;i++){const l=x0+i*h,r=l+h;if(rule==='trap')out+=`<polygon points="${pts([[X(l),Y(0)],[X(l),Y(f(l))],[X(r),Y(f(r))],[X(r),Y(0)]])}" fill="${c('rect')}" fill-opacity=".22" stroke="${c('rect')}" stroke-width="1.2"/>`;
        else{const xp=rule==='left'?l:rule==='right'?r:l+h/2,yy=f(xp);out+=`<polygon points="${pts([[X(l),Y(0)],[X(l),Y(yy)],[X(r),Y(yy)],[X(r),Y(0)]])}" fill="${c('rect')}" fill-opacity=".22" stroke="${c('rect')}" stroke-width="1.2"/><circle cx="${F(X(xp))}" cy="${F(Y(yy))}" r="2.6" fill="${c('rect')}"/>`}}}
    else if(k==='vl'){const[x,col]=a;out+=line(X(x),0,X(x),H,col,1.4,.85,true)}
    else if(k==='tan'){const[f,x0,col]=a,d=1e-4,m=(f(x0+d)-f(x0-d))/(2*d),y0=f(x0);out+=line(X(x0-1),Y(y0-m),X(x0+1),Y(y0+m),col,2)+`<circle cx="${F(X(x0))}" cy="${F(Y(y0))}" r="3.2" fill="${c('F')}"/>`}
    else if(k==='t'){const[x,y,t,col,sz]=a;out+=tx(X(x),Y(y),t,col,sz)}
    else if(k==='T'){const[x,y,t,col,sz]=a;out+=tx(x,y,t,col,sz)}
    else if(k==='raw')out+=a[0]}
  return`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><rect width="${W}" height="${H}" fill="var(--s-bg)"/>${out}</svg>`}
function termHtml(t,L){const x=t[lang()]||t.ru,rd=!!P.read[t.id];
  return`<details class="term${rd?' read':''}" id="g-${t.id}"><summary><span>${rd?'<b class="rd">✓</b>':''}${x[0]}</span><small>${x[1]}</small></summary><div class="tb">${ILL[t.id]?`<figure class="ill">${illSvg(t.id)}</figure>`:''}${gTabs(t.id,x[2])}${DEMOS[t.id]?`<button class="btn sm primary" data-demo="${t.id}">${L.showDemo}</button>`:''}${REL[t.id]?`<div class="rel">${L.seeAlso} ${REL[t.id].map(r=>`<button class="chip" data-term="${r}">${termTitle(r)}</button>`).join('')}</div>`:''}<div class="row" style="margin-top:.8rem"><button class="btn sm readbtn${rd?' on':''}" data-read="${t.id}">${rd?L.readDone:L.readMark}</button></div></div></details>`}
function renderGloss(q=''){q=q.trim().toLowerCase();const L=T();if(!P.read||typeof P.read!=='object')P.read={};
  const total=TERMS.length,done=TERMS.filter(t=>P.read[t.id]).length;
  const match=t=>{if(!q)return true;const x=t[lang()]||t.ru,o=t[lang()==='ru'?'en':'ru'],f=FORMAL[t.id];return(x[0]+' '+x[1]+' '+x[2]+' '+o[0]+' '+(f?(f[lang()]||f.ru):'')).replace(/<[^>]+>/g,'').toLowerCase().includes(q)};
  let html=`<div class="prog"><span>${L.readOf(done,total)}</span><span class="bar"><i style="width:${Math.round(done/total*100)}%"></i></span>${done?`<button class="linkbtn" id="readReset">${L.readReset}</button>`:''}</div>`;
  let any=false,num=0;
  CHAP.forEach(ch=>{if(!ch.extra)num++;const ts=ch.ids.map(id=>TERMS.find(t=>t.id===id)).filter(Boolean).filter(match);if(!ts.length)return;any=true;
    const r=ch.ids.filter(id=>P.read[id]).length;
    html+=`<section class="chap"><h3>${ch.extra?'':num+'. '}${ch[lang()]||ch.ru}<span class="cnt">${r} / ${ch.ids.length}</span></h3>${ts.map(t=>termHtml(t,L)).join('')}</section>`});
  $('#gl').innerHTML=any?html:html+`<p class="note">${L.noFound}</p>`}
function rerenderGloss(){const sh=$('#dGloss .sheet'),st=sh.scrollTop,open=[...document.querySelectorAll('#gl details[open]')].map(d=>d.id);renderGloss($('#gq').value);open.forEach(id=>{const e=document.getElementById(id);if(e)e.open=true});sh.scrollTop=st}
$('#gq').oninput=e=>renderGloss(e.target.value);
$('#gl').addEventListener('click',e=>{const rb=e.target.closest('[data-read]');if(rb){P.read[rb.dataset.read]=!P.read[rb.dataset.read];if(!P.read[rb.dataset.read])delete P.read[rb.dataset.read];save();rerenderGloss();return}
  if(e.target.closest('#readReset')){P.read={};save();rerenderGloss()}});
$('#gl').addEventListener('click',e=>{const tb=e.target.closest('[data-tab]');if(!tb)return;const box=tb.closest('.tb');P.gTab=tb.dataset.tab;
  box.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('on',x.dataset.tab===P.gTab));box.querySelectorAll('.pane').forEach(p=>{p.hidden=p.dataset.pane!==P.gTab});save()});
$('#gl').addEventListener('click',e=>{const b=e.target.closest('[data-demo]');if(!b)return;closeDrawers();runDemo(b.dataset.demo)});
function runDemo(id){const d=DEMOS[id];if(!d)return;if(d.mode&&d.mode!==S.mode)setMode(d.mode);else if(!d.mode&&S.mode!=='A')setMode('A');
  if(d.fam!==undefined)P.show.family=d.fam;if(d.tan)P.show.tangent=true;
  if(d.riem){P.show.riemann=true;S.rule=P.rule=d.rule;S.n=P.n=d.n}else if(d.riem===undefined&&!d.mode)P.show.riemann=false;
  syncToggles();save();if(d.p)loadPreset(d.p);else setIntegral(d.f,d.a,d.b,{fit:true});
  if(d.riem)showPanel('riemann');else showPanel('solve');if(d.rplay)setTimeout(playRiem,400);else if(d.mode==='F')setTimeout(play,300)}
function openDrawer(id){document.getElementById(id).classList.add('open')}
function closeDrawers(){document.querySelectorAll('.drawer').forEach(d=>d.classList.remove('open'))}
document.querySelectorAll('[data-close]').forEach(el=>el.onclick=closeDrawers);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawers()});
$('#openGloss').onclick=()=>{$('#gq').value='';renderGloss();openDrawer('dGloss')};
function openTerm(id){if(!TERMS.find(t=>t.id===id))return;$('#gq').value='';renderGloss();openDrawer('dGloss');const el=document.getElementById('g-'+id);if(el){el.open=true;setTimeout(()=>el.scrollIntoView({block:'start'}),30)}}

/* ---------- экспорт ---------- */
let DL=null,fmtMode='tex';
const LOCAL=!window.claude;
const canSave=()=>!!(DL||LOCAL);
(async()=>{try{if(window.claude&&typeof window.claude.use==='function')DL=await window.claude.use('downloads')}catch(e){DL=null}S.dlTried=true;updExport()})();
function vidMime(){if(!window.MediaRecorder||!cv.captureStream)return null;for(const m of['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm','video/mp4'])if(MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported(m))return m;return null}
function updExport(){const L=T();$('#xPng').disabled=!canSave()||S.rec;$('#xVid').disabled=!canSave()||!vidMime()||S.rec;$('#xNote').textContent=S.rec?L.xRec:!canSave()?(S.dlTried?L.xNoDl:''):(!vidMime()?L.xNoVid:'')}
function flash(msg,ms=3500){$('#xNote').textContent=msg;clearTimeout(flash.t);if(ms)flash.t=setTimeout(updExport,ms)}
async function saveFile(name,data){const L=T();if(!DL){if(LOCAL){const u=URL.createObjectURL(data),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),5000);flash(L.xSaved)}return}
  try{await DL.save({filename:name,data});flash(L.xSaved)}catch(e){const c=e&&e.code;if(c==='declined'){updExport();return}if(c==='unavailable'||c==='not_granted'||c==='capability_disabled'||c==='capability_removed'){DL=null;S.dlTried=true;updExport();return}flash(c==='rate_limited'?L.xBusy:L.xFail)}}
function exportPng(){if(!canSave()||S.rec)return;S.stamp=$('#xStamp').checked;renderNow();cv.toBlob(b=>{S.stamp=false;req();if(b)saveFile('integral.png',b)},'image/png')}
async function exportVideo(){const m=vidMime();if(!canSave()||!m||S.rec||S.err||(S.mode!=='I'&&(!isFinite(S.a)||!isFinite(S.b))))return;S.rec=true;S.stamp=$('#xStamp').checked;updExport();
  const keep=ms=>new Promise(r=>{const t0=performance.now();const f=()=>{renderNow();if(performance.now()-t0<ms)requestAnimationFrame(f);else r()};f()});
  const chunks=[];let rec;
  try{const stream=cv.captureStream(60);rec=new MediaRecorder(stream,{mimeType:m,videoBitsPerSecond:8e6});rec.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data)};
    const stopped=new Promise(r=>{rec.onstop=r});S.t=0;S.anim=null;rec.start(100);await keep(500);
    play();await new Promise(r=>{const f=()=>S.anim?requestAnimationFrame(f):r();f()});await keep(900);rec.stop();await stopped}
  catch(err){S.rec=false;S.stamp=false;req();flash(T().xFail);return}
  S.rec=false;S.stamp=false;req();updExport();const blob=new Blob(chunks,{type:m});if(blob.size)saveFile(`integral.${m.startsWith('video/mp4')?'mp4':'webm'}`,blob);else flash(T().xFail)}
function renderTex(){const ta=$('#xTex');if(S.err){ta.value='';return}const R=S.R,F=R.sol.F;
  const lim=(v,e,m)=>v===Infinity?(m==='tex'?'\\infty':m==='py'?'oo':'inf'):v===-Infinity?(m==='tex'?'-\\infty':m==='py'?'-oo':'-inf'):(e?tp(e,0,m):String(v));
  const val=m=>R.div?(m==='tex'?'\\infty':'diverges'):R.exact?tp(R.exact,0,m):String(+R.val.toFixed(10));
  if(S.mode==='I'){if(fmtMode==='tex')ta.value=F?`\\int ${tp(S.fe,2,'tex')}\\,dx = ${tp(F,0,'tex')} + C`:`\\int ${tp(S.fe,2,'tex')}\\,dx`;else if(fmtMode==='np')ta.value=`from sympy import *\nx = symbols('x')\nf = ${tp(S.fe,0,'py')}\nprint(integrate(f, x))`;else ta.value=F?`∫ ${tp(S.fe,2,'txt')} dx = ${tp(F,0,'txt')} + C`:`∫ ${tp(S.fe,2,'txt')} dx`;return}
  if(fmtMode==='tex'){let s='';if(F)s+=`\\int ${tp(S.fe,2,'tex')}\\,dx = ${tp(F,0,'tex')} + C\n`;s+=`\\int_{${lim(S.a,S.aE,'tex')}}^{${lim(S.b,S.bE,'tex')}} ${tp(S.fe,2,'tex')}\\,dx ${R.div?'\\text{ diverges}':(R.exact?'= ':'\\approx ')+val('tex')}`;ta.value=s}
  else if(fmtMode==='np')ta.value=`from sympy import *\nx = symbols('x')\nf = ${tp(S.fe,0,'py')}\nprint(integrate(f, x))\nprint(integrate(f, (x, ${lim(S.a,S.aE,'py')}, ${lim(S.b,S.bE,'py')})))`;
  else{let s='';if(F)s+=`∫ ${tp(S.fe,2,'txt')} dx = ${tp(F,0,'txt')} + C\n`;s+=`∫[${S.as}; ${S.bs}] ${tp(S.fe,2,'txt')} dx ${R.div?T().v_div:(R.exact?'= ':'≈ ')+val('txt')}${R.exact?' ≈ '+fmt(R.val,6).replace('−','-'):''}`;ta.value=s}}
async function copyTex(){const ta=$('#xTex'),L=T();let ok=false;try{await navigator.clipboard.writeText(ta.value);ok=true}catch(e){}if(!ok){ta.focus();ta.select();try{ok=document.execCommand('copy')}catch(e){}}flash(ok?L.xCopied:L.xSelect)}
$('#xPng').onclick=exportPng;$('#xVid').onclick=exportVideo;$('#xCopy').onclick=copyTex;
document.querySelectorAll('#xFmt button').forEach(b=>b.onclick=()=>{fmtMode=b.dataset.f;document.querySelectorAll('#xFmt button').forEach(x=>x.classList.toggle('on',x===b));renderTex()});

/* ---------- горячие клавиши ---------- */
const KEYS=[['Space','k_play'],['← →','k_t'],['Shift + ← →','k_t2'],['Home / End','k_t01'],['1 – 9','k_pre'],['D','k_mode'],['R','k_riem'],['[ / ]','k_n'],['N','k_rule'],['M','k_rplay'],['X','k_swap'],['V','k_Fc'],['T','k_tan'],['F','k_fam'],['G','k_grid'],['L','k_lab'],['H','k_hint'],['+ / −','k_zoom'],['0','k_home'],['S','k_png'],['A','k_vid'],['/','k_gloss'],['?','k_keys'],['Esc','k_esc']];
function renderKeys(){const L=T();$('#keysList').innerHTML=KEYS.map(([k,d])=>`<span>${k.split(' ').map((p,i)=>i>0&&/^[+\/–]$/.test(p)?p:`<kbd>${p}</kbd>`).join(' ')}</span><span>${L[d]}</span>`).join('')}
function openKeys(){renderKeys();closeDrawers();openDrawer('dKeys')}
$('#openKeys').onclick=openKeys;$('#openKeys2').onclick=openKeys;
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),1600)}
function flip(k){P.show[k]=!P.show[k];syncToggles();save();if(k==='riemann')syncRiem();renderCaption();renderOverlay();req();const L=T();toast(`${L.tog[k]}: ${P.show[k]?L.on:L.off}`)}
const RULES_R=['left','mid','right','trap','simp'];
document.addEventListener('keydown',e=>{
  if(e.ctrlKey||e.metaKey||e.altKey)return;
  const tg=e.target,tag=tg&&tg.tagName;
  if((tag==='INPUT'&&!['checkbox','range','radio','color'].includes(tg.type))||tag==='TEXTAREA'||tag==='SELECT'||(tg&&tg.isContentEditable))return;
  const isQ=e.key==='?'||(e.code==='Slash'&&e.shiftKey);
  if(document.querySelector('.drawer.open')&&!isQ)return;
  const c=e.code,L=T();let h=true;
  const setT=v=>{S.anim=null;S.t=Math.max(0,Math.min(1,v));if(S.mode==='I')S.xs=s2w(30+S.t*(W-90),0)[0];if(S.mode==='F'&&isFinite(S.a)&&isFinite(S.b))S.xs=S.a+S.t*(S.b-S.a);renderValues();renderCaption();req()};
  if(isQ)openKeys();
  else if(c==='Space')play();
  else if(c==='ArrowLeft'||c==='ArrowRight'){const st=e.shiftKey?.25:.05;setT(Math.round((S.t+(c==='ArrowLeft'?-st:st))*100)/100)}
  else if(c==='Home')setT(0);else if(c==='End')setT(1);
  else if(/^(Digit|Numpad)[1-9]$/.test(c)){const p=PRE[+c.slice(-1)-1];if(p){loadPreset(p[0]);toast(L.mn[p[4]]||'')}}
  else if(c==='Digit0'||c==='Numpad0')fitView();
  else if(c==='KeyD'){setMode(S.mode==='A'?'F':S.mode==='F'?'I':'A');toast(S.mode==='A'?L.mA:S.mode==='F'?L.mF:L.mI)}
  else if(c==='KeyR')flip('riemann');
  else if(c==='BracketLeft'||c==='BracketRight'){S.n=P.n=Math.max(1,Math.min(200,S.n+(c==='BracketLeft'?-1:1)));P.show.riemann=true;syncToggles();save();calcRS();syncRiem();renderOverlay()}
  else if(c==='KeyN'){S.rule=P.rule=RULES_R[(RULES_R.indexOf(S.rule)+1)%5];P.show.riemann=true;syncToggles();save();calcRS();syncRiem();renderOverlay();toast(L['r_'+S.rule])}
  else if(c==='KeyM')playRiem();
  else if(c==='KeyX')$('#bSwap').click();
  else if(c==='KeyV')flip('Fcurve');else if(c==='KeyT')flip('tangent');else if(c==='KeyF')flip('family');else if(c==='KeyG')flip('bgGrid');else if(c==='KeyL')flip('labels');else if(c==='KeyH')flip('hints');
  else if(c==='Equal'||c==='NumpadAdd')$('#zIn').click();else if(c==='Minus'||c==='NumpadSubtract')$('#zOut').click();
  else if(c==='KeyS'){if(canSave())exportPng();else toast(L.xNoDl)}
  else if(c==='KeyA'){if(canSave()&&vidMime())exportVideo();else toast(canSave()?L.xNoVid:L.xNoDl)}
  else if(c==='Slash'){$('#openGloss').click();setTimeout(()=>$('#gq').focus(),30)}
  else h=false;
  if(h)e.preventDefault();
});

/* ---------- настройки ---------- */
$('#openSet').onclick=()=>{syncSettings();openDrawer('dSet')};
function buildSettings(){
  document.querySelectorAll('#langSeg button,#langSeg2 button').forEach(b=>b.onclick=()=>{P.lang=b.dataset.l;applyLang();save()});
  document.querySelectorAll('#uiSeg button').forEach(b=>b.onclick=()=>{P.ui=b.dataset.v;applyPrefs()});
  document.querySelectorAll('#dockSeg button').forEach(b=>b.onclick=()=>{P.dock=b.dataset.v;applyPrefs()});
  $('#wR').oninput=e=>{P.width=+e.target.value;applyPrefs()};
  $('#hR').oninput=e=>{P.bottomH=+e.target.value;applyPrefs()};
  $('#fR').oninput=e=>{P.font=+e.target.value;applyPrefs()};
  $('#lR').oninput=e=>{P.lw=+e.target.value;applyPrefs()};
  $('#resetOrder').onclick=()=>{P.order=PANELS.slice();P.collapsed={};applyPrefs()};
  $('#resetAll').onclick=()=>{const lg=lang(),rd=P.read,last=P.last;P=clone(DEF);P.lang=lg;P.read=rd||{};P.last=last;S.rule=P.rule;S.n=P.n;syncToggles();$('#spR').value=P.speed;$('#spOut').textContent='×1';applyPrefs();calcRS();renderAll()};
}
function buildPal(){const L=T();
  const pc=$('#palChips');pc.innerHTML='';Object.entries(PAL).forEach(([k,p])=>{const b=document.createElement('button');b.className='chip';b.dataset.p=k;b.innerHTML=`<span class="sw" style="background:${p.bg};box-shadow:inset 0 0 0 3px ${p.f||Object.values(p)[3]}"></span>${L.pal[k]}`;
    b.onclick=()=>{P.palette=k;P.colors={...PAL[k]};applyPrefs()};pc.appendChild(b)});
  const cs=$('#colors');cs.innerHTML='';Object.keys(L.colors).forEach(k=>{const l=document.createElement('label');l.innerHTML=`<input type="color" data-k="${k}"> ${L.colors[k]}`;
    l.querySelector('input').oninput=e=>{P.colors[k]=e.target.value;P.palette='custom';applyPrefs()};cs.appendChild(l)});
}
function applyLang(){const L=T();document.documentElement.lang=lang();document.title=L.title;
  document.querySelectorAll('[data-i]').forEach(e=>{e.textContent=L[e.dataset.i]});
  document.querySelectorAll('[data-ih]').forEach(e=>{e.innerHTML=L[e.dataset.ih]});
  document.querySelectorAll('[data-it]').forEach(e=>{e.title=L[e.dataset.it];e.setAttribute('aria-label',L[e.dataset.it])});
  document.querySelectorAll('[data-ia]').forEach(e=>{e.setAttribute('aria-label',L[e.dataset.ia])});
  $('#gq').placeholder=L.search;cv.setAttribute('aria-label',L.canvas);
  document.querySelectorAll('#langSeg button,#langSeg2 button').forEach(b=>b.classList.toggle('on',b.dataset.l===lang()));
  buildPal();buildToggles();syncToggles();syncSettings();updExport();renderKeys();
  if($('#dGloss').classList.contains('open'))rerenderGloss();
  if(S.fe||S.err){analyze(true);renderAll()}}
function syncSettings(){
  document.querySelectorAll('#uiSeg button').forEach(b=>b.classList.toggle('on',b.dataset.v===P.ui));
  document.querySelectorAll('#dockSeg button').forEach(b=>b.classList.toggle('on',b.dataset.v===P.dock));
  document.querySelectorAll('#palChips .chip').forEach(b=>b.classList.toggle('on',b.dataset.p===P.palette));
  document.querySelectorAll('#colors input').forEach(i=>{i.value=P.colors[i.dataset.k]});
  $('#wR').value=P.width;$('#wOut').textContent=P.width+' px';$('#hR').value=P.bottomH;$('#hOut').textContent=P.bottomH+' %';
  $('#fR').value=P.font;$('#fOut').textContent=P.font+' %';$('#lR').value=P.lw;$('#lOut').textContent='×'+fmt(P.lw,1)}
function effDock(){return P.dock==='auto'?(innerWidth<760?'bottom':'right'):P.dock}
function applyDock(){const d=effDock();main.dataset.dock=d;
  if(d==='float'){const mr=main.getBoundingClientRect(),sw=side.offsetWidth||P.width;P.float.x=Math.max(8,Math.min(P.float.x,mr.width-Math.min(sw,mr.width)-8));P.float.y=Math.max(8,Math.min(P.float.y,mr.height-80));side.style.left=P.float.x+'px';side.style.top=P.float.y+'px'}
  else{side.style.left='';side.style.top=''}}
function applyPrefs(){
  const r=document.documentElement;if(P.ui==='auto')r.removeAttribute('data-theme');else r.setAttribute('data-theme',P.ui);
  r.style.fontSize=(16*P.font/100)+'px';r.style.setProperty('--side-w',P.width+'px');r.style.setProperty('--side-h',P.bottomH+'%');
  Object.entries(P.colors).forEach(([k,v])=>r.style.setProperty('--s-'+k,v));
  applyDock();applyOrder();syncSettings();save();req()}
(()=>{const g=$('#grip');let st=null;
  g.addEventListener('pointerdown',e=>{g.setPointerCapture(e.pointerId);st={x:e.clientX,y:e.clientY,fx:P.float.x,fy:P.float.y}});
  g.addEventListener('pointermove',e=>{if(!st)return;P.float.x=st.fx+e.clientX-st.x;P.float.y=st.fy+e.clientY-st.y;applyDock()});
  const end=()=>{if(st){st=null;save()}};g.addEventListener('pointerup',end);g.addEventListener('pointercancel',end)})();
window.addEventListener('resize',()=>applyDock());

/* ---------- старт ---------- */
buildPanels();buildSettings();
$('#spR').value=P.speed;$('#spOut').textContent='×'+fmt(P.speed);
applyPrefs();
{const l=P.last;if(l&&typeof l.f==='string')setIntegral(l.f,l.a,l.b,{preset:l.p||null});else loadPreset('p_pow')}
applyLang();setMode(['A','F','I'].includes(P.mode)?P.mode:'A');
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{fitView();req()});
})();
