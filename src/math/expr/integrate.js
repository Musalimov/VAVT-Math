import { lang } from '../../shared/i18n.js';
import { PRINT, hp, numH } from './print.js';
import { D, Nn, OPS, X, add, compile, div, fn, has, isN, isNum, key, mul, neg, pow, powParts, replKey, snap, sqrtAst, sub, subst, toFrac } from './core.js';
import { asFactors, dropConst, fromFactors, linAst, linOf, padd, pdeg, pder, pdiv, pmul, polyAst, polyOf, ppow, pscale, ptrim, pval, sumTerms, tidy } from './poly.js';
export const SX={
ru:{sum:'Интеграл суммы равен сумме интегралов, считаем каждое слагаемое отдельно:',
  neg:'Минус выносим за знак интеграла:',cmul:'Постоянный множитель выносим за знак интеграла:',
  expand:'Раскрываем скобки:',polyT:'Почленно по формуле ∫<i>x</i><sup><i>n</i></sup> d<i>x</i> = <i>x</i><sup><i>n</i>+1</sup>/(<i>n</i> + 1):',
  powRule:n=>`Степенная формула при <i>n</i> = ${n}:`,lnRule:'Табличный интеграл ∫ d<i>x</i>/<i>x</i> = ln|<i>x</i>|:',
  lin:(u,k)=>`Внутри стоит линейная функция <i>u</i> = ${u}. Считаем по таблице, как будто аргумент просто <i>x</i>, и делим на коэффициент ${k} при <i>x</i>:`,
  tab:'Табличный интеграл:',tan2:'Тождество tg²<i>x</i> = 1/cos²<i>x</i> − 1 сводит к табличным:',
  const:'Интеграл константы:',
  polydiv:'Степень числителя не меньше степени знаменателя, поэтому сначала делим многочлены и выделяем целую часть:',
  pf:'Знаменатель раскладывается на множители, поэтому раскладываем дробь на простейшие:',
  pfInt:'Каждая простейшая дробь интегрируется по таблице:',
  qDer:(a,b)=>`В числителе выделяем производную знаменателя ${a}: числитель = ${b}.`,
  qLn:'Часть с производной знаменателя даёт логарифм:',
  qSq:q=>`Выделяем полный квадрат: ${q}. Получается табличный интеграл с арктангенсом:`,
  qSqLn:q=>`Выделяем полный квадрат: ${q}. Получается табличный «высокий логарифм»:`,
  oddS:(u,k)=>`Нечётная степень синуса: отделяем один множитель sin, остальные выражаем через cos по формуле sin² = 1 − cos². Замена <i>u</i> = ${u}, d<i>u</i> = ${k}d<i>x</i>:`,
  oddC:(u,k)=>`Нечётная степень косинуса: отделяем один множитель cos, остальные выражаем через sin по формуле cos² = 1 − sin². Замена <i>u</i> = ${u}, d<i>u</i> = ${k}d<i>x</i>:`,
  even:'Обе степени чётные: понижаем степень формулами sin²<i>u</i> = (1 − cos 2<i>u</i>)/2 и cos²<i>u</i> = (1 + cos 2<i>u</i>)/2:',
  evenRes:'Интегрируем каждое слагаемое:',
  sqShift:q=>`Выделяем полный квадрат под корнем: ${q}.`,
  tsCirc:(w,a)=>`Тригонометрическая подстановка ${w} = ${a}sin <i>t</i>: тогда корень превращается в ${a}cos <i>t</i>, и интеграл сводится к ∫cos²<i>t</i> d<i>t</i>. Возвращаясь к <i>x</i>, получаем:`,
  tsHyp:(w,a)=>`Подстановка ${w} = ${a}tg <i>t</i> (или ${w} = ${a}sh <i>t</i>) убирает корень. После обратной замены получается:`,
  tsHyp2:(w,a)=>`Подстановка ${w} = ${a?a.slice(0,-1):'1'}/cos <i>t</i> (или ${w} = ${a}ch <i>t</i>) убирает корень. После обратной замены получается:`,
  asin:'Табличный интеграл ∫ d<i>u</i>/√(<i>a</i>² − <i>u</i>²) = arcsin(<i>u</i>/<i>a</i>):',
  longLn:'Табличный «длинный логарифм» ∫ d<i>u</i>/√(<i>u</i>² ± <i>a</i>²) = ln|<i>u</i> + √(<i>u</i>² ± <i>a</i>²)|:',
  split:'Делим почленно каждое слагаемое числителя на знаменатель:',
  usub:(u,du)=>`Замена <i>u</i> = ${u}. Тогда d<i>u</i> = ${du}d<i>x</i>, и эта производная уже стоит в интеграле множителем:`,
  usubBack:'Возвращаемся к <i>x</i>:',
  parts:(u,dv)=>`Интегрируем по частям: <i>u</i> = ${u}, d<i>v</i> = ${dv} d<i>x</i>.`,
  parts2:(du,v)=>`Тогда d<i>u</i> = ${du}d<i>x</i>, <i>v</i> = ${v}. По формуле ∫<i>u</i> d<i>v</i> = <i>uv</i> − ∫<i>v</i> d<i>u</i>:`,
  cyc1:'Интегрируем по частям два раза. После второго раза снова появляется исходный интеграл <i>I</i>:',
  cyc2:'Переносим <i>I</i> в левую часть и решаем уравнение:',
  usubL:(u,x)=>`Замена <i>u</i> = ${u}: тогда <i>x</i> = ${x}, d<i>x</i> выражается через d<i>u</i>, и всё подынтегральное выражение становится функцией от <i>u</i>:`,
  weier:'Подынтегральная функция рационально выражается через sin <i>x</i> и cos <i>x</i>. Универсальная подстановка <i>t</i> = tg(<i>x</i>/2): sin <i>x</i> = 2<i>t</i>/(1 + <i>t</i>²), cos <i>x</i> = (1 − <i>t</i>²)/(1 + <i>t</i>²), d<i>x</i> = 2 d<i>t</i>/(1 + <i>t</i>²). Получается рациональная дробь:',
  dist:'Раскрываем скобки и интегрируем каждое слагаемое:',
  result:'Получаем:'},
en:{sum:'The integral of a sum is the sum of the integrals, so take each term separately:',
  neg:'Move the minus sign outside the integral:',cmul:'Move the constant factor outside the integral:',
  expand:'Expand the brackets:',polyT:'Term by term with ∫<i>x</i><sup><i>n</i></sup> d<i>x</i> = <i>x</i><sup><i>n</i>+1</sup>/(<i>n</i> + 1):',
  powRule:n=>`Power rule with <i>n</i> = ${n}:`,lnRule:'Table integral ∫ d<i>x</i>/<i>x</i> = ln|<i>x</i>|:',
  lin:(u,k)=>`The inside is a linear function <i>u</i> = ${u}. Use the table as if the argument were just <i>x</i>, then divide by the coefficient ${k} of <i>x</i>:`,
  tab:'Table integral:',tan2:'The identity tan²<i>x</i> = 1/cos²<i>x</i> − 1 reduces it to table integrals:',
  const:'Integral of a constant:',
  polydiv:'The numerator’s degree is at least the denominator’s, so first divide the polynomials:',
  pf:'The denominator factors, so split the fraction into partial fractions:',
  pfInt:'Each partial fraction is a table integral:',
  qDer:(a,b)=>`Write the numerator using the derivative of the denominator ${a}: numerator = ${b}.`,
  qLn:'The part with the derivative of the denominator gives a logarithm:',
  qSq:q=>`Complete the square: ${q}. That gives a table integral with arctangent:`,
  qSqLn:q=>`Complete the square: ${q}. That gives a table logarithm:`,
  oddS:(u,k)=>`Odd power of sine: split off one sin and write the rest through cos with sin² = 1 − cos². Substitute <i>u</i> = ${u}, d<i>u</i> = ${k}d<i>x</i>:`,
  oddC:(u,k)=>`Odd power of cosine: split off one cos and write the rest through sin with cos² = 1 − sin². Substitute <i>u</i> = ${u}, d<i>u</i> = ${k}d<i>x</i>:`,
  even:'Both powers are even: reduce them with sin²<i>u</i> = (1 − cos 2<i>u</i>)/2 and cos²<i>u</i> = (1 + cos 2<i>u</i>)/2:',
  evenRes:'Integrate each term:',
  sqShift:q=>`Complete the square under the root: ${q}.`,
  tsCirc:(w,a)=>`Trig substitution ${w} = ${a}sin <i>t</i>: the root becomes ${a}cos <i>t</i> and the integral reduces to ∫cos²<i>t</i> d<i>t</i>. Going back to <i>x</i>:`,
  tsHyp:(w,a)=>`The substitution ${w} = ${a}tan <i>t</i> (or ${w} = ${a}sinh <i>t</i>) removes the root. After substituting back:`,
  tsHyp2:(w,a)=>`The substitution ${w} = ${a?a.slice(0,-1):'1'}/cos <i>t</i> (or ${w} = ${a}cosh <i>t</i>) removes the root. After substituting back:`,
  asin:'Table integral ∫ d<i>u</i>/√(<i>a</i>² − <i>u</i>²) = arcsin(<i>u</i>/<i>a</i>):',
  longLn:'Table integral ∫ d<i>u</i>/√(<i>u</i>² ± <i>a</i>²) = ln|<i>u</i> + √(<i>u</i>² ± <i>a</i>²)|:',
  split:'Divide each term of the numerator by the denominator:',
  usub:(u,du)=>`Substitute <i>u</i> = ${u}. Then d<i>u</i> = ${du}d<i>x</i>, and this derivative is already a factor of the integrand:`,
  usubBack:'Back to <i>x</i>:',
  parts:(u,dv)=>`Integrate by parts: <i>u</i> = ${u}, d<i>v</i> = ${dv} d<i>x</i>.`,
  parts2:(du,v)=>`Then d<i>u</i> = ${du}d<i>x</i>, <i>v</i> = ${v}. By ∫<i>u</i> d<i>v</i> = <i>uv</i> − ∫<i>v</i> d<i>u</i>:`,
  cyc1:'Integrate by parts twice. After the second time the original integral <i>I</i> appears again:',
  cyc2:'Move <i>I</i> to the left side and solve the equation:',
  usubL:(u,x)=>`Substitute <i>u</i> = ${u}: then <i>x</i> = ${x}, d<i>x</i> is a multiple of d<i>u</i>, and the whole integrand becomes a function of <i>u</i>:`,
  weier:'The integrand is a rational expression in sin <i>x</i> and cos <i>x</i>. The universal substitution <i>t</i> = tan(<i>x</i>/2): sin <i>x</i> = 2<i>t</i>/(1 + <i>t</i>²), cos <i>x</i> = (1 − <i>t</i>²)/(1 + <i>t</i>²), d<i>x</i> = 2 d<i>t</i>/(1 + <i>t</i>²). That gives a rational fraction:',
  dist:'Expand the brackets and integrate each term:',
  result:'Result:'}};
export const Q=()=>SX[lang()]||SX.ru;
let STP=[],MS=[],DEP=0,QUIET=0;
export const VN=['x','u','t','w','z','s'];
export const mark=()=>[STP.length,MS.length];
export const reset=m=>{STP.length=m[0];MS.length=m[1]};
export function step(h){if(!QUIET)STP.push({d:DEP,h})}
export function meth(id){if(!QUIET&&!MS.includes(id))MS.push(id)}
export const HH=e=>hp(e,0);
export const dd=h=>h==='1'?'':h==='−1'?'−':h+' ';
export const cH=c=>isNum(Nn(c),1)?'':isNum(Nn(c),-1)?'−':hp(Nn(c),2)+'·';
export function polyAsc(p,v){let r=null;p.forEach((c,k)=>{if(Math.abs(c)<1e-12)return;const t=k===0?Nn(Math.abs(c)):mul(Nn(Math.abs(c)),pow(v,Nn(k)));r=r===null?(c<0?neg(t):t):(c<0?sub(r,t):add(r,t))});return r||Nn(0)}
export const dxh=()=>` d<i>${PRINT.v}</i>`;
export const IH=e=>`<span class="ig">∫</span>${hp(e,2)}${dxh()}`;
export const EQ=(e,F)=>`${IH(e)} = ${HH(F)}`;
export function subI(e){DEP++;const r=integ(e);DEP--;return r}
export function quiet(e){QUIET++;const r=integ(e);QUIET--;return r}
export function withVar(fnc){const o=PRINT.v,i=VN.indexOf(o);PRINT.v=VN[Math.min(VN.length-1,i+1)];try{return fnc()}finally{PRINT.v=o}}
let BUDGET=0;
export function integ(e){if(DEP>9||--BUDGET<0)return null;e=tidy(e);
  if(!has(e)){meth('table');const F=mul(e,X);step(`${Q().const} ${EQ(e,F)}`);return F}
  for(const r of RULES){const m=mark();let F=null;try{F=r(e)}catch(err){F=null}if(F)return tidy(F);reset(m)}
  return null}
export function R_poly(e){const p=polyOf(e);if(!p)return null;{const pf=powForm(e);if(pf&&!(pf.L[0]===1&&pf.L[1]===0))return null}const pa=polyAst(p);
  const expanded=key(tidy(pa))!==key(e);
  const F=polyAst([0,...p.map((c,k)=>c/(k+1))]);
  if(expanded){meth('linearity');step(`${Q().expand} ${HH(e)} = ${HH(pa)}`)}
  meth('power');step(`${Q().polyT} ${EQ(pa,F)}`);return F}
export function R_neg(e){if(e[0]!=='neg')return null;meth('linearity');step(`${Q().neg} ${IH(e)} = −${IH(e[1])}`);const F=subI(e[1]);return F&&neg(F)}
export function R_sum(e){if(e[0]!=='+'&&e[0]!=='-')return null;const ts=sumTerms(e);meth('linearity');
  step(`${Q().sum} ${IH(e)} = ${ts.map(([s,t],i)=>(i?(s<0?' − ':' + '):(s<0?'−':''))+IH(t)).join('')}`);
  let F=null;for(const[s,t]of ts){const G=subI(t);if(!G)return null;F=F===null?(s<0?neg(G):G):(s<0?sub(F,G):add(F,G))}return F}
export function R_cmul(e){if(e[0]!=='*'&&e[0]!=='/')return null;const F=asFactors(e);const cs=F.fs.filter(f=>!has(f[0])),vs=F.fs.filter(f=>has(f[0]));
  const c=fromFactors(F.c,cs);if(isNum(c,1))return null;const rest=fromFactors(1,vs);
  meth('linearity');step(`${Q().cmul} ${IH(e)} = ${hp(c,2)}·${IH(rest)}`);const G=subI(rest);return G&&mul(c,G)}
export function powForm(e){
  if(e[0]==='^'&&isN(e[2])){const l=linOf(e[1]);if(l&&l[0])return{L:l,n:e[2][1]}}
  if(e[0]==='f'&&e[1]==='sqrt'){const l=linOf(e[2]);if(l&&l[0])return{L:l,n:.5}}
  if(e[0]==='/'&&isNum(e[1],1)){const l=linOf(e[2]);if(l&&l[0])return{L:l,n:-1};const p=powForm(e[2]);if(p)return{L:p.L,n:-p.n}}
  return null}
export function R_powlin(e){const pf=powForm(e);if(!pf)return null;const[k,m]=pf.L,n=snap(pf.n),Lx=linAst(k,m),plain=k===1&&m===0;
  if(plain&&Number.isInteger(n)&&n>=0)return null;
  const F=n===-1?mul(Nn(1/k),fn('ln',fn('abs',Lx))):mul(Nn(1/(k*(n+1))),pow(Lx,Nn(n+1)));
  if(plain){meth(n===-1?'table':'power');step(`${n===-1?Q().lnRule:Q().powRule(numH(n,true).replace('−','-').replace('-','−'))} ${EQ(e,F)}`)}
  else{meth('linsub');meth(n===-1?'table':'power');step(`${Q().lin(HH(Lx),numH(k,true))} ${EQ(e,F)}`)}
  return F}
export const TAB={sin:{1:u=>neg(fn('cos',u)),'-1':u=>fn('ln',fn('abs',fn('tan',div(u,Nn(2))))),'-2':u=>neg(fn('cot',u))},
  cos:{1:u=>fn('sin',u),'-1':u=>fn('ln',fn('abs',fn('tan',add(div(u,Nn(2)),div(['c','pi'],Nn(4)))))),'-2':u=>fn('tan',u)},
  tan:{1:u=>neg(fn('ln',fn('abs',fn('cos',u)))),2:u=>sub(fn('tan',u),u)},
  cot:{1:u=>fn('ln',fn('abs',fn('sin',u))),2:u=>sub(neg(fn('cot',u)),u)},
  sinh:{1:u=>fn('cosh',u)},cosh:{1:u=>fn('sinh',u)},tanh:{1:u=>fn('ln',fn('cosh',u))}};
export function R_table(e){const F=asFactors(e);if(F.fs.length!==1||!isNum(Nn(F.c),1))return null;const[b,p]=F.fs[0];
  let G=null,L=null,isTan2=false;
  if(b[0]==='f'&&b[1]==='exp'){L=linOf(b[2]);if(!L||!L[0])return null;const u=linAst(L[0]*p,L[1]*p);G=fn('exp',u);L=[L[0]*p,L[1]*p]}
  else if(b[0]==='f'&&TAB[b[1]]&&TAB[b[1]][String(p)]){L=linOf(b[2]);if(!L||!L[0])return null;G=TAB[b[1]][String(p)](linAst(L[0],L[1]));isTan2=(b[1]==='tan'||b[1]==='cot')&&p===2}
  else if(b[0]==='^'&&!has(b[1])&&isN(b[1])&&b[1][1]>0&&p===1){L=linOf(b[2]);if(!L||!L[0])return null;G=div(b,fn('ln',b[1]))}
  else return null;
  const k=L[0],Fx=mul(Nn(1/k),G),lin=!(k===1&&(L[1]===0||isTan2));
  meth(isTan2?'trigid':'table');if(lin)meth('linsub');
  step(`${isTan2?Q().tan2:lin&&!(k===1&&L[1]===0)?Q().lin(HH(linAst(L[0],L[1])),numH(k,true)):Q().tab} ${EQ(e,Fx)}`);return Fx}
export function ratOf(e){const F=asFactors(e);let P=[F.c],Qp=[1];
  for(const[b,p]of F.fs){const q=polyOf(b);if(!q||!Number.isInteger(p))return null;if(p>0)P=pmul(P,ppow(q,p));else Qp=pmul(Qp,ppow(q,-p))}
  if(pdeg(Qp)<1)return null;return[P,Qp]}
export function ratFun(e){switch(e[0]){
  case 'n':return[[e[1]],[1]];case 'v':return e[1]==='x'?[[0,1],[1]]:null;case 'c':return null;
  case 'neg':{const a=ratFun(e[1]);return a&&[pscale(a[0],-1),a[1]]}
  case '+':case '-':{const a=ratFun(e[1]),b=ratFun(e[2]);if(!a||!b)return null;const s=e[0]==='+'?1:-1;
    if(key(a[1])===key(b[1]))return[padd(a[0],pscale(b[0],s)),a[1]];return[padd(pmul(a[0],b[1]),pscale(pmul(b[0],a[1]),s)),pmul(a[1],b[1])]}
  case '*':{const a=ratFun(e[1]),b=ratFun(e[2]);return a&&b?[pmul(a[0],b[0]),pmul(a[1],b[1])]:null}
  case '/':{const a=ratFun(e[1]),b=ratFun(e[2]);return a&&b?[pmul(a[0],b[1]),pmul(a[1],b[0])]:null}
  case '^':{if(!isN(e[2])||!Number.isInteger(e[2][1])||Math.abs(e[2][1])>12)return null;const a=ratFun(e[1]);if(!a)return null;const n=e[2][1];return n>=0?[ppow(a[0],n),ppow(a[1],n)]:[ppow(a[1],-n),ppow(a[0],-n)]}
  default:return null}}
export function polyGcd(a,b){a=ptrim(a);b=ptrim(b);const nrm=p=>{const m=Math.max(...p.map(Math.abs))||1;return ptrim(p.map(c=>Math.abs(c/m)<1e-10?0:c/m))};a=nrm(a);b=nrm(b);
  for(let i=0;i<20&&pdeg(b)>=0&&!(pdeg(b)===0&&Math.abs(b[0])<1e-10);i++){if(pdeg(b)===0)return[1];const r=pdiv(a,b)[1];a=b;b=nrm(r);if(pdeg(b)===0&&Math.abs(b[0])<1e-9)break}
  const lc=a[pdeg(a)];return pscale(a,1/lc)}
export function pcancel(P,Qp){{const g=polyGcd(P,Qp);if(pdeg(g)>=1){const[p1,r1]=pdiv(P,g),[q1,r2]=pdiv(Qp,g);if(Math.max(...r1.map(Math.abs),...r2.map(Math.abs))<1e-8){P=p1;Qp=q1}}}for(let it=0;it<8;it++){const rr=pdeg(Qp)>=1?ratRoots(Qp):null;if(!rr)break;let done=true;
    for(const[r]of rr.roots){if(Math.abs(pval(P,r))<1e-9*Math.max(1,...P.map(Math.abs))&&pdeg(P)>=1){P=pdiv(P,[-r,1])[0];Qp=pdiv(Qp,[-r,1])[0];done=false;break}}if(done)break}
  if(pdeg(Qp)===2&&pdeg(P)>=2){const[S,R]=pdiv(P,Qp);if(pdeg(R)<0||(R.length===1&&Math.abs(R[0])<1e-12)){return[S,[1]]}}
  const lc=Qp[pdeg(Qp)];return[pscale(P,1/lc),pscale(Qp,1/lc)]}
export const ratAst=(P,Qp)=>{const lc=P[pdeg(P)];if(pdeg(P)>=0&&lc<0)return neg(div(polyAst(pscale(P,-1)),polyAst(Qp)));return div(polyAst(P),polyAst(Qp))};
export function ratRoots(Qp){const n=pdeg(Qp);if(n<1||n>8)return null;const lc=Qp[n],a=Qp.map(c=>c/lc);
  let z=Array.from({length:n},(_,i)=>({re:Math.cos(2*Math.PI*i/n+.4)*.9,im:Math.sin(2*Math.PI*i/n+.4)*.9}));
  const cm=(p,q)=>({re:p.re*q.re-p.im*q.im,im:p.re*q.im+p.im*q.re}),cd=(p,q)=>{const d=q.re*q.re+q.im*q.im;return{re:(p.re*q.re+p.im*q.im)/d,im:(p.im*q.re-p.re*q.im)/d}};
  const ev=x=>{let r={re:1,im:0};for(let k=n-1;k>=0;k--){r=cm(r,x);r.re+=a[k]}return r};
  for(let it=0;it<500;it++){let mv=0;z=z.map((zi,i)=>{let d={re:1,im:0};z.forEach((zj,j)=>{if(j!==i)d=cm(d,{re:zi.re-zj.re,im:zi.im-zj.im})});const s=cd(ev(zi),d);mv=Math.max(mv,Math.hypot(s.re,s.im));return{re:zi.re-s.re,im:zi.im-s.im}});if(mv<1e-14)break}
  const cand=[];for(const r of z){if(Math.abs(r.im)>1e-3)continue;const f=toFrac(r.re,64,1e-4);if(!f)continue;const v=f[0]/f[1];if(!cand.some(c=>Math.abs(c-v)<1e-12))cand.push(v)}
  const roots=[];let cur=Qp.slice();
  for(const r of cand){let m=0;for(;;){const[qq,rem]=pdiv(cur,[-r,1]);if(Math.abs(rem[0])>1e-9*Math.max(1,...cur.map(Math.abs)))break;cur=qq;m++}if(m)roots.push([r,m])}
  return{roots,rest:cur}}
export const linFac=r=>{const f=toFrac(r,64);return f&&f[1]>1?linAst(f[1],-f[0]):linAst(1,-r)};
export const linFacScale=r=>{const f=toFrac(r,64);return f&&f[1]>1?f[1]:1};
export function R_rational(e){let rf=ratOf(e);if(!rf){const r=ratFun(e);if(!r||pdeg(r[1])<1)return null;rf=pcancel(r[0],r[1]);if(pdeg(rf[1])<1){const G=subI(polyAst(rf[0]));return G}}let[P,Qp]=rf;let F=null;
  if(pdeg(P)>=pdeg(Qp)){const[S,R]=pdiv(P,Qp);step(`${Q().polydiv} ${HH(ratAst(P,Qp))} = ${HH(add(polyAst(S),ratAst(R,Qp)))}`);meth('polydiv');
    const G=subI(polyAst(S));if(!G)return null;F=G;P=R;if(pdeg(P)<0)return F}
  const dq=pdeg(Qp);
  if(dq===1){const k=Qp[1],c=P[0]/k,G=mul(Nn(c),fn('ln',fn('abs',polyAst(Qp))));step(`${Q().tab} ${EQ(ratAst(P,Qp),G)}`);meth('table');return F?add(F,G):G}
  const rr=ratRoots(Qp);if(!rr)return null;const{roots}=rr;let rest=rr.rest;
  if(pdeg(rest)>2)return null;
  if(!roots.length){if(dq!==2)return null;const G=quadInt(P,Qp,true);return G&&(F?add(F,G):G)}
  let R=P.slice(),cur=Qp.slice();const terms=[];
  for(const[r,m]of roots){for(let j=m;j>=1;j--){let Q2=cur;for(let i=0;i<j;i++)Q2=pdiv(Q2,[-r,1])[0];const A=pval(R,r)/pval(Q2,r);terms.push({r,j,A});
      R=pdiv(padd(R,pscale(Q2,-A)),[-r,1])[0];cur=pdiv(cur,[-r,1])[0]}}
  const pieces=terms.filter(t=>Math.abs(t.A)>1e-12).map(t=>{const s=linFacScale(t.r)**t.j;return div(Nn(snap(t.A*s)),pow(linFac(t.r),Nn(t.j)))});
  const hasQ=pdeg(cur)>=1&&pdeg(R)>=0&&!(pdeg(R)===0&&Math.abs(R[0])<1e-12);
  if(hasQ)pieces.push(ratAst(R,cur));else if(pdeg(cur)===0&&Math.abs(cur[0]-1)>1e-12){}
  const sumA=pieces.reduce((s,p)=>s===null?p:add(s,p),null);
  meth('partial');step(`${Q().pf} ${HH(ratAst(P,Qp))} = ${HH(sumA)}`);
  let G=null;const gl=[];
  for(const t of terms){if(Math.abs(t.A)<1e-12)continue;const s=linFacScale(t.r),Lf=linFac(t.r);let g;
    if(t.j===1)g=mul(Nn(t.A),fn('ln',fn('abs',Lf)));else g=neg(div(Nn(snap(t.A*s**t.j/(s*(t.j-1)))),pow(Lf,Nn(t.j-1))));
    G=G?add(G,g):g}
  if(G)step(`${Q().pfInt} ${HH(G)}`);
  if(hasQ){const g=quadInt(R,cur,false);if(!g)return null;G=G?add(G,g):g}
  return F?add(F,G):G}
export function quadInt(R,Qp,show){if(pdeg(Qp)===1){const c=R[0]/Qp[1];return mul(Nn(c),fn('ln',fn('abs',polyAst(Qp))))}
  const[c,b,a]=Qp,Dd=b*b-4*a*c,p1=R[1]||0,p0=R[0]||0,al=p1/(2*a),be=snap(p0-al*b),Qa=polyAst(Qp);let G=null;
  if(Math.abs(al)>1e-12){if(show||true)step(Q().qDer(HH(polyAst(pder(Qp))),HH(add(mul(Nn(al),polyAst(pder(Qp))),Nn(be)))));
    const g=mul(Nn(al),fn('ln',Dd<0&&a>0?Qa:fn('abs',Qa)));step(`${Q().qLn} ${HH(g)}`);G=g;meth('table')}
  if(Math.abs(be)>1e-12){const h=b/(2*a),k2=c/a-h*h;if(Math.abs(b)>1e-12)meth('square');
    const sqH=`${HH(polyAst(Qp))} = ${hp(Nn(a),2)==='1'?'':hp(Nn(a),2)}${a===1?'':''}(${HH(linAst(1,h))})<sup>2</sup> ${k2*a<0?'−':'+'} ${numH(Math.abs(k2*a),false)}`;
    let g;
    if(Dd<0){const s=sqrtAst(-Dd);g=mul(div(Nn(2*be),s),fn('atan',div(linAst(2*a,b),s)));if(Math.abs(b)<1e-12){meth('table');step(`${Q().tab} ${HH(g)}`)}else step(`${Q().qSq(sqH)} ${HH(g)}`)}
    else{const s=sqrtAst(Dd);g=mul(div(Nn(be),s),fn('ln',fn('abs',div(sub(linAst(2*a,b),s),add(linAst(2*a,b),s)))));step(`${Q().qSqLn(sqH)} ${HH(g)}`)}
    G=G?add(G,g):g}
  return G}
export function scFactors(e){const F=asFactors(e);if(!F.fs.length)return null;let L=null,m=0,n=0;
  for(const[b,p]of F.fs){if(b[0]!=='f'||(b[1]!=='sin'&&b[1]!=='cos')||!Number.isInteger(p)||p<0)return null;const k=key(b[2]);if(L&&L!==k)return null;L=k;if(b[1]==='sin')m+=p;else n+=p}
  const Le=F.fs[0][0][2],lin=linOf(Le);if(!lin||!lin[0])return null;return{c:F.c,m,n,Le,k:lin[0]}}
export function sincos(m,n,Le,k,show){const U=['v','x'];
  if(m%2===1||n%2===1){const odd=m%2===1,h=odd?(m-1)/2:(n-1)/2,other=odd?n:m;
    const P=pmul(ppow([1,0,-1],h),[...new Array(other).fill(0),1]);const G=polyAst([0,...P.map((c,j)=>c/(j+1))]);
    const u=odd?fn('cos',Le):fn('sin',Le),coef=odd?-1/k:1/k,F=mul(Nn(coef),subst(G,'x',u));
    if(show){meth('oddpow');meth('usub');const du=odd?neg(mul(Nn(k),fn('sin',Le))):mul(Nn(k),fn('cos',Le));
      const ui=withVar(()=>`${cH(coef)}<span class="ig">∫</span>${hp(polyAst(P),2)} d<i>u</i> = ${cH(coef)}(${HH(G)})`);
      step(`${odd?Q().oddS(HH(u),dd(HH(du))):Q().oddC(HH(u),dd(HH(du)))}`);step(`= ${ui}`);step(`${Q().usubBack} ${HH(F)}`)}
    return F}
  const P=pmul(ppow(pscale([1,-1],.5),m/2),ppow(pscale([1,1],.5),n/2)),L2=mul(Nn(2),Le);
  if(show){meth('trigid');step(`${Q().even} ${HH(fromFactors(1,[...(m?[[fn('sin',Le),m]]:[]),...(n?[[fn('cos',Le),n]]:[])]))} = ${HH(polyAsc(P,fn('cos',L2)))}`)}
  let F=null;P.forEach((c,j)=>{if(Math.abs(c)<1e-12)return;const g=j===0?mul(Nn(c),X):mul(Nn(c),sincos(0,j,L2,2*k,false));F=F?add(F,g):g});
  if(show)step(`${Q().evenRes} ${HH(tidy(F))}`);return F}
export function R_trigpow(e){const s=scFactors(e);if(!s)return null;if(s.m+s.n<2)return null;return mul(Nn(s.c),sincos(s.m,s.n,s.Le,s.k,true))}
export function R_trigsub(e){const F=asFactors(e);if(F.fs.length!==1)return null;const[b,p]=F.fs[0];if(p!==.5&&p!==-.5)return null;
  const q=polyOf(b);if(!q||pdeg(q)!==2)return null;const[c0,c1,c2]=q,h=c1/(2*c2),qq=snap(c0-c1*c1/(4*c2));if(Math.abs(qq)<1e-12)return null;
  const s=Math.abs(c2),A2=snap(Math.abs(qq)/s),A=sqrtAst(A2),W=linAst(1,h),inner=fn('sqrt',polyAst(pscale(q,1/s))),sq=sqrtAst(s);
  if(Math.abs(h)>1e-12){meth('square');step(Q().sqShift(`${HH(polyAst(q))} = ${c2<0?'−':''}${s===1?'':numH(s)}(${HH(W)})<sup>2</sup> ${qq<0?'−':'+'} ${numH(Math.abs(qq))}`))}
  let G;const Wh=HH(W),Ah=isNum(A,1)?'':hp(A,2)+'·';
  if(c2<0&&qq>0){if(p===.5){G=mul(sq,add(mul(div(W,Nn(2)),inner),mul(Nn(A2/2),fn('asin',div(W,A)))));meth('trigsub');step(`${Q().tsCirc(Wh,Ah)} ${EQ(e,mul(Nn(F.c),G))}`)}
    else{G=div(fn('asin',div(W,A)),sq);meth('table');step(`${Q().asin} ${EQ(e,mul(Nn(F.c),G))}`)}}
  else if(c2>0){const lnA=fn('ln',fn('abs',add(W,inner)));
    if(p===.5){G=mul(sq,qq>0?add(mul(div(W,Nn(2)),inner),mul(Nn(A2/2),lnA)):sub(mul(div(W,Nn(2)),inner),mul(Nn(A2/2),lnA)));meth('trigsub');step(`${qq>0?Q().tsHyp(Wh,Ah):Q().tsHyp2(Wh,Ah)} ${EQ(e,mul(Nn(F.c),G))}`)}
    else{G=div(lnA,sq);meth('table');step(`${Q().longLn} ${EQ(e,mul(Nn(F.c),G))}`)}}
  else return null;
  return mul(Nn(F.c),G)}
export function R_divsplit(e){if(e[0]!=='/')return null;const ts=sumTerms(e[1]);if(ts.length<2)return null;if(sumTerms(e[2]).length>1)return null;
  let s=null;for(const[sg,t]of ts){const q=tidy(div(t,e[2]));s=s===null?(sg<0?neg(q):q):(sg<0?sub(s,q):add(s,q))}
  meth('linearity');step(`${Q().split} ${HH(e)} = ${HH(s)}`);return subI(s)}
export function cands(e,out=[]){const push=g=>{if(has(g)&&g[0]!=='v'&&!out.some(z=>key(z)===key(g)))out.push(g)};
  const walk=e=>{if(e[0]==='n'||e[0]==='c'||e[0]==='v')return;
    if(e[0]==='f'){push(e[2]);if(e[1]!=='sqrt'&&e[1]!=='abs')push(e);walk(e[2]);return}
    if(e[0]==='^'){if(!isN(e[1])&&e[1][0]!=='v')push(e[1]);if(has(e[2]))push(e[2]);if(isN(e[2])&&e[1][0]==='v')push(e);walk(e[1]);walk(e[2]);return}
    if(e[0]==='neg'){walk(e[1]);return}
    if(e[0]==='/'&&has(e[2]))push(e[2]);
    walk(e[1]);walk(e[2])};
  walk(e);return out.filter(g=>{const l=linOf(g);return!l})}
export const SMP=[0.37,0.61,0.83,1.13,1.41];
export function propConst(a,b){const fa=compile(a),fb=compile(b);let r=null;for(const x of SMP){const va=fa(x),vb=fb(x);if(!isFinite(va)||!isFinite(vb)||Math.abs(vb)<1e-12)return null;const q=va/vb;if(r===null)r=q;else if(Math.abs(q-r)>1e-9*Math.max(1,Math.abs(r)))return null}return r}
export function R_usub(e){const E=asFactors(e);
  for(const g of cands(e)){const dg=tidy(D(g)),Fd=asFactors(dg);let c=E.c/Fd.c;const fs=E.fs.map(f=>[f[0],f[1],f[2]]);let okk=true;
    for(const[b,p,k]of Fd.fs){let f=fs.find(z=>z[2]===k);
      if(!f){f=fs.find(z=>{const r=propConst(z[0],b);return r!==null&&Math.abs(z[1]-p)<1e-12&&Number.isInteger(p)?(c*=Math.pow(r,p),true):false});if(f){f[1]=snap(f[1]-p);continue}
        fs.push([b,-p,k]);continue}
      f[1]=snap(f[1]-p)}
    if(!okk)continue;
    const R0=fromFactors(1,fs.filter(f=>Math.abs(f[1])>1e-12));const gk=key(g);let R=replKey(R0,gk,['v','u']);
    if(has(R)){const pp=powParts(g);if(pp&&pp[0][0]==='v'&&pp[1]>0){R=replKey(R0,gk,['v','u'])}}
    if(has(R)){const t=tidy(R0);R=replKey(t,gk,['v','u']);if(has(R))continue}
    const Ru=subst(R,'u',X);const m=mark();
    meth('usub');step(Q().usub(HH(g),dd(HH(dg))));
    let G=null;withVar(()=>{step(`${IH(e).replace(new RegExp(`<i>${PRINT.v}</i>`,'g'),'§')}`.replace(/§/g,`<i>${VN[VN.indexOf(PRINT.v)-1]||'x'}</i>`)+` = ${cH(c)}${IH(Ru)}`);G=subI(Ru)});
    if(!G){reset(m);continue}
    const F=mul(Nn(c),subst(G,'x',g));step(`${Q().usubBack} ${HH(tidy(F))}`);return F}
  return null}
export const isLogLike=b=>b[0]==='f'&&['ln','asin','acos','atan'].includes(b[1])&&linOf(b[2])&&linOf(b[2])[0];
export const isET=b=>(b[0]==='f'&&['exp','sin','cos','sinh','cosh'].includes(b[1])&&linOf(b[2])&&linOf(b[2])[0])||(b[0]==='^'&&!has(b[1])&&linOf(b[2]));
export function R_parts(e){const E=asFactors(e);const fs=E.fs;
  const li=fs.findIndex(([b,p])=>p===1&&isLogLike(b));let u,dv;
  if(li>=0){u=fs[li][0];dv=fromFactors(E.c,fs.filter((_,i)=>i!==li));if(fs.some(([b],i)=>i!==li&&isLogLike(b)))return null}
  else{const et=fs.filter(([b,p])=>p===1&&isET(b)),pl=fs.filter(([b,p])=>polyOf(b)&&Number.isInteger(p)&&p>0);
    if(et.length===2&&pl.length===0&&fs.length===2)return cyclic(E.c,et);
    if(et.length!==1||pl.length+1!==fs.length||!pl.length)return null;
    u=fromFactors(1,pl);dv=fromFactors(E.c,et)}
  const v=quiet(dv);if(!v)return null;const du=tidy(D(u)),vdu=tidy(mul(v,du));
  meth('parts');step(Q().parts(HH(u),HH(dv)));step(`${Q().parts2(dd(HH(du)),HH(v))} ${IH(e)} = ${hp(mul(u,v),1)} − ${IH(vdu)}`);
  const G=subI(vdu);if(!G)return null;return sub(mul(u,v),G)}
export function cyclic(c,et){const ex=et.find(([b])=>b[0]==='f'&&b[1]==='exp'),tr=et.find(([b])=>b[0]==='f'&&(b[1]==='sin'||b[1]==='cos'));if(!ex||!tr)return null;
  const L1=ex[0][2],L2=tr[0][2],a=linOf(L1)[0],b=linOf(L2)[0],E=fn('exp',L1),S=fn('sin',L2),C=fn('cos',L2),s=tr[0][1]==='sin';
  const inner=s?sub(mul(Nn(a),S),mul(Nn(b),C)):add(mul(Nn(a),C),mul(Nn(b),S));const F=mul(Nn(c/(a*a+b*b)),mul(E,inner));
  const I=['v','I'];const first=s?sub(div(mul(E,S),Nn(a)),mul(Nn(b/(a*a)),mul(E,C))):add(div(mul(E,C),Nn(a)),mul(Nn(b/(a*a)),mul(E,S)));
  meth('parts');meth('cyclic');step(`${Q().cyc1} <i>I</i> = ${IH(mul(E,s?S:C))} = ${HH(first)} − ${cH(b*b/(a*a))}<i>I</i>`);
  step(`${Q().cyc2} <i>I</i> = ${HH(mul(Nn(1/(a*a+b*b)),mul(E,inner)))}`);return F}
export function R_dist(e){if(e[0]!=='*')return null;const E=asFactors(e);const si=E.fs.findIndex(([b,p])=>(b[0]==='+'||b[0]==='-')&&p===1);if(si<0)return null;
  const other=fromFactors(E.c,E.fs.filter((_,i)=>i!==si));const ts=sumTerms(E.fs[si][0]);let s=null;
  for(const[sg,t]of ts){const q=tidy(mul(other,t));s=s===null?(sg<0?neg(q):q):(sg<0?sub(s,q):add(s,q))}
  meth('linearity');step(`${Q().dist} ${HH(e)} = ${HH(s)}`);return subI(s)}
export function R_linu(e){const ls=[];const walk=z=>{if(z[0]==='n'||z[0]==='v'||z[0]==='c')return;
    if(z[0]==='f'){const l=linOf(z[2]);if(l&&l[0]&&l[1])ls.push(z[2]);walk(z[2]);return}
    if(z[0]==='^'&&isN(z[2])&&!Number.isInteger(z[2][1])){const l=linOf(z[1]);if(l&&l[0]&&l[1])ls.push(z[1])}
    if(z[0]==='neg'){walk(z[1]);return}walk(z[1]);walk(z[2])};walk(e);
  for(const L of ls){const[k,m]=linOf(L),R0=replKey(e,key(L),['v','u']);if(!has(R0))continue;
    const R=tidy(mul(Nn(1/k),subst(R0,'x',div(sub(['v','u'],Nn(m)),Nn(k)))));if(has(R))continue;const Ru=tidy(subst(R,'u',X));
    const m0=mark();meth('usub');step(Q().usubL(HH(L),HH(div(sub(['v','u'],Nn(m)),Nn(k)))));let G=null;
    withVar(()=>{step(`= ${IH(Ru)}`);G=subI(Ru)});if(!G){reset(m0);continue}
    const F=subst(G,'x',L);step(`${Q().usubBack} ${HH(tidy(F))}`);return F}
  return null}
export function onlyTrigX(e){if(e[0]==='f'){if((e[1]==='sin'||e[1]==='cos'||e[1]==='tan')&&e[2][0]==='v')return true;return false}
  if(e[0]==='v')return false;if(e[0]==='n'||e[0]==='c')return true;if(e[0]==='neg')return onlyTrigX(e[1]);if(e[0]==='^')return isN(e[2])&&Number.isInteger(e[2][1])&&onlyTrigX(e[1]);return onlyTrigX(e[1])&&onlyTrigX(e[2])}
export function R_weier(e){if(!onlyTrigX(e))return null;const t=X,s=div(mul(Nn(2),t),add(Nn(1),pow(t,Nn(2)))),c=div(sub(Nn(1),pow(t,Nn(2))),add(Nn(1),pow(t,Nn(2))));
  const rep=z=>{if(z[0]==='f'&&z[2][0]==='v'){return z[1]==='sin'?s:z[1]==='cos'?c:div(s,c)}if(z[0]==='n'||z[0]==='c'||z[0]==='v')return z;if(z[0]==='f')return fn(z[1],rep(z[2]));if(z[0]==='neg')return neg(rep(z[1]));return OPS[z[0]](rep(z[1]),rep(z[2]))};
  const R=mul(rep(e),div(Nn(2),add(Nn(1),pow(t,Nn(2)))));const rf=ratFun(R);if(!rf)return null;const[P,Qp]=pcancel(rf[0],rf[1]);const Rt=pdeg(Qp)<1?polyAst(P):ratAst(P,Qp);
  meth('weier');step(Q().weier);let G=null;{const o=PRINT.v;PRINT.v='t';try{step(`= ${IH(Rt)}`);G=subI(Rt)}finally{PRINT.v=o}}if(!G)return null;
  const F=subst(G,'x',fn('tan',div(X,Nn(2))));step(`${Q().usubBack} ${HH(tidy(F))}`);return F}
export const RULES=[R_poly,R_neg,R_sum,R_cmul,R_powlin,R_table,R_rational,R_trigpow,R_trigsub,R_divsplit,R_usub,R_parts,R_linu,R_dist,R_weier];
export function nonElem(e){const k=key(e),t=tidy(e);
  const pats=[/"exp",\["\*",\["n",-?[\d.]+\],\["\^",\["v","x"\],\["n",2\]\]\]/,/"exp",\["neg",\["\^",\["v","x"\],\["n",2\]\]\]/,/"exp",\["\^",\["v","x"\],\["n",2\]\]/];
  if(pats.some(p=>p.test(key(t))))return'erf';
  const F=asFactors(t);const has1=(nm,pw)=>F.fs.some(([b,p])=>b[0]==='f'&&b[1]===nm&&b[2][0]==='v'&&p===pw);const xp=F.fs.find(([b])=>b[0]==='v');
  if(F.fs.length===2&&xp&&xp[1]===-1&&(has1('sin',1)||has1('cos',1)||has1('exp',1)))return'si';
  if(F.fs.length===1&&F.fs[0][1]===-1&&F.fs[0][0][0]==='f'&&F.fs[0][0][1]==='ln')return'li';
  if(/"(sin|cos)",\["\^",\["v","x"\],\["n",2\]\]/.test(key(t))&&F.fs.length===1)return'fresnel';
  return null}
export function checkF(f,F,a,b){const ff=compile(f),FF=compile(F);let lo=isFinite(a)?a:(isFinite(b)?b-6:-3),hi=isFinite(b)?b:lo+6;if(lo>hi)[lo,hi]=[hi,lo];if(hi-lo<1e-6){lo-=1;hi+=1}
  let n=0,good=0;for(let i=0;i<=24;i++){const x=lo+(hi-lo)*(i+.37)/25.2,y=ff(x);if(!isFinite(y)||Math.abs(y)>1e6)continue;const h=1e-5*Math.max(1,Math.abs(x)),d=(FF(x+h)-FF(x-h))/(2*h);n++;
    if(isFinite(d)&&Math.abs(d-y)<=2e-4*Math.max(1,Math.abs(y)))good++}
  if(n===0){for(const x of[0.31,0.77,1.3,-0.6,2.2]){const y=ff(x);if(!isFinite(y))continue;const h=1e-5,d=(FF(x+h)-FF(x-h))/(2*h);n++;if(isFinite(d)&&Math.abs(d-y)<=2e-4*Math.max(1,Math.abs(y)))good++}}
  return n>0&&good===n}
export function solve(f,a,b){STP=[];MS=[];DEP=0;QUIET=0;PRINT.v='x';BUDGET=4000;let F=null;try{F=integ(f)}catch(e){F=null}
  if(F){F=dropConst(tidy(F));if(!checkF(f,F,a,b))F=null}
  return{F,steps:F?STP.slice():[],meth:F?MS.slice():[],ne:F?null:nonElem(f)}}
