import { SOLVE, fracB, nP, sb, zLin } from './solvers/steps.js';
import { COMP, nI } from './solvers/compute.js';
import { fQ, fT } from './solvers/format.js';
import { FORMS, PRE, TOPICS } from './content/topics.js';
import { CHAP, DEMOS, FORMAL, ILL, REL, TERMS } from './content/glossary.js';
import { T } from './content/tx.js';
import { Cnk, PhiInv, PhiN, bA, bC, bPow, bStr, bf, binom, diceDist, distOf, gcdB, genBinom, genGeom, genHyper, jointStats, numIn, parseJoint, parseSeries, phiG, poiss, polyEvents, r2, rowNums, seriesStats } from './solvers/theory.js';
import { CL, notationFrom } from './solvers/notation.js';
import { mark, meth, solve, step } from '../../math/expr/integrate.js';
import { dropConst } from '../../math/expr/poly.js';
import { quadF } from '../../math/expr/numeric.js';
import { PRINT, hp, numH } from '../../math/expr/print.js';
import { hasInf, parse, parseFx } from '../../math/expr/parse.js';
import {fNsci as fN} from '../../shared/format.js';
import { toFrac } from '../../math/expr/core.js';
import { asFactors, fromFactors, linAst, linOf, padd, pdeg, pder, pdiv, pmul, polyAst, polyOf, ppow, pscale, ptrim, pval, sumTerms, tidy } from '../../math/expr/poly.js';
import { D, Nn, OPS, X, add, compile, div, fn, has, isN, isNum, key, mul, neg, pow, powParts, replKey, simp, snap, sqrtAst, sub, subst } from '../../math/expr/core.js';
import { closeDrawers } from '../../shared/drawers.js';
import { openDrawer } from '../../shared/drawers.js';
import { toast } from '../../shared/toast.js';
import { clone } from '../../shared/dom.js';
import { $ } from '../../shared/dom.js';
import {dc} from '../../shared/format.js';
import {fmt} from '../../shared/format.js';
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








/* ---------- печать ---------- */











/* текст, LaTeX и SymPy */






/* ---------- численное интегрирование (tanh-sinh) ---------- */


/* поиск особых точек на конечном отрезке */

/* ---------- символьное интегрирование с шагами ---------- */





















/* --- правила --- */





































/* --- запуск и проверка --- */



/* ---------- математика теории вероятностей ---------- */





/* точнее: ряд и цепная дробь */




/* ---------- разбор чисел ---------- */
/* число из поля: «1 000» и «1 000,5» — разряды через пробел (ровно по 3 цифры); две десятичные точки («0,1,2», «1.5.2»)
   и числа через пробел («2 3») — ошибка, а не молчаливое «0,1» или «6» */


/* ---------- ряд распределения ---------- */





/* ---------- двумерная таблица ---------- */



/* ---------- комбинаторика (точно, BigInt) ---------- */







/* ---------- кубики ---------- */
/* индекс = сумма */
/* ---------- независимые события ---------- */


/* ---------- справочник ---------- */












const KEY='prob-viz-v1';

const PAL={
  classic:{bg:'#0b0c10',bgGrid:'#262b33',axis:'#f2f2f2',bar:'#58c4dd',sel:'#f4d345',curve:'#ff7aa8',area:'#83c167',aux:'#ff9f43',mark:'#c77dff',F:'#fc6255'},
  paper:{bg:'#fbfaf7',bgGrid:'#e3e1da',axis:'#23262b',bar:'#2b6cb0',sel:'#c98a00',curve:'#c0398b',area:'#3f9a3a',aux:'#e67e22',mark:'#8e44ad',F:'#d1453b'},
  neon:{bg:'#07020f',bgGrid:'#1f1533',axis:'#ffffff',bar:'#4dd2ff',sel:'#fff35c',curve:'#ff9ecf',area:'#39ff88',aux:'#ffa53d',mark:'#a98bff',F:'#ff4d6d'},
  nord:{bg:'#2e3440',bgGrid:'#3b4252',axis:'#eceff4',bar:'#88c0d0',sel:'#ebcb8b',curve:'#e5a0c0',area:'#a3be8c',aux:'#d08770',mark:'#b48ead',F:'#bf616a'}};

const PANELS=['topic','presets','solve','values','show','export'];
const DEF={palette:'classic',colors:{...PAL.classic},dock:'auto',width:380,bottomH:46,ui:'auto',font:100,speed:1,lw:1,order:PANELS.slice(),collapsed:{export:true},read:{},float:{x:12,y:12},
  show:{bgGrid:true,coords:true,labels:true,approx:true,sigma:true,Fplot:true,hints:true},topic:'bern',inp:null,preset:null};

function load(){let r=null;try{r=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}const p=clone(DEF);if(!r||typeof r!=='object')return p;
  Object.assign(p,r);p.colors={...DEF.colors,...(r.colors||{})};p.show={...DEF.show,...(r.show||{})};const ord=Array.isArray(r.order)?r.order.filter(x=>PANELS.includes(x)):[];PANELS.forEach(x=>{if(!ord.includes(x))ord.push(x)});p.order=ord;p.collapsed=r.collapsed||{};p.float=r.float||{x:12,y:12};
  /* защита от повреждённых/старых настроек: числа — в пределах ползунков, иначе по умолчанию */const RNG={width:[240,560],bottomH:[25,75],font:[80,130],speed:[.25,3],lw:[.5,2.5]};for(const k in RNG){const v=p[k],[a,b]=RNG[k];p[k]=typeof v==='number'&&isFinite(v)?Math.min(b,Math.max(a,v)):DEF[k]}if(!p.float||typeof p.float!=='object'||!isFinite(p.float.x)||!isFinite(p.float.y))p.float={x:12,y:12};if(!p.collapsed||typeof p.collapsed!=='object'||Array.isArray(p.collapsed))p.collapsed={};return p}
let P=load();langFrom(()=>P.lang);notationFrom(()=>P.nota);if(!P.lang)P.lang=(navigator.language||'').toLowerCase().startsWith('ru')?'ru':'en';let saveT=0;
function save(){clearTimeout(saveT);saveT=setTimeout(()=>{try{localStorage.setItem(KEY,JSON.stringify(P))}catch(e){}},250)}
/* ---------- числа ---------- */




/* ---------- примеры ---------- */



/* ---------- формы ---------- */


const OPTL=(k,o)=>{const L=T();const m={...L.opt,ev:L.ev,meth:L.mt,mode:S.topic==='dsv'?L.dm:L.nm,cond:L.cd,q:{...L.nq,fmg:L.nq.fm.replace('X <','X >'),fsg:L.nq.fs.replace('X <','X >')}}[k];return m?m[o]:o};
const S={topic:P.topic||'comb',inp:{},res:null,err:null,preset:P.preset||null,stamp:false,anyAnim:false};
TOPICS.forEach(t=>{S.inp[t]=clone(PRE[t][0][1])});if(P.inp)for(const t of TOPICS)if(P.inp[t])S.inp[t]={...S.inp[t],...P.inp[t]};
function renderForm(){const box=$('#form'),L=T(),t=S.topic,I=S.inp[t];box.innerHTML='';
  for(const[k,type,a,b]of FORMS[t]){const show=typeof a==='function'?a:typeof b==='function'?b:null;if(show&&!show(I))continue;const lbl=L.f[k==='n'&&t==='dsv'?'n':k]||k;
    if(type==='txt'){const l=document.createElement('label');l.className='full';l.textContent=T().f['txt_'+k]||(t==='dvu'?'X\\Y':t==='bayes'?T().f.hyp:'X, p');box.appendChild(l);const ta=document.createElement('textarea');ta.value=I[k]||'';ta.dataset.k=k;ta.spellcheck=false;box.appendChild(ta);continue}
    const l=document.createElement('label');l.textContent=t==='nsv'&&k==='fx'&&!I.C?'f(x)':(k==='fx'&&I.C?'g(x)':lbl);box.appendChild(l);let el;
    if(type==='sel'){el=document.createElement('select');for(const o of a){const op=document.createElement('option');op.value=o;op.textContent=OPTL(k,o);el.appendChild(op)}el.value=I[k]}
    else if(type==='chk'){el=document.createElement('input');el.type='checkbox';el.checked=!!I[k];el.style.width='auto';l.textContent=L.f.C}
    else{el=document.createElement('input');el.type='text';el.value=I[k]==null?'':I[k];el.spellcheck=false;el.autocomplete='off'}
    el.dataset.k=k;box.appendChild(el)}
  document.querySelectorAll('#topicSeg button').forEach(b=>{b.classList.toggle('on',b.dataset.t===t);b.title=L.tt[b.dataset.t]});
  $('#notaRow').style.display=['bern','norm'].includes(t)?'':'none';document.querySelectorAll('#notaSeg button').forEach(b=>b.classList.toggle('on',b.dataset.v===(P.nota||'vavt')))}
document.querySelectorAll('#notaSeg button').forEach(b=>b.onclick=()=>{P.nota=b.dataset.v;save();renderForm();recompute()});
let fT0=0;$('#form').addEventListener('input',e=>{const k=e.target.dataset.k;if(!k)return;S.inp[S.topic][k]=e.target.type==='checkbox'?e.target.checked:e.target.value;S.preset=null;
  if(e.target.tagName==='SELECT'||e.target.type==='checkbox'){renderForm();recompute();return}clearTimeout(fT0);fT0=setTimeout(recompute,250)});
document.querySelectorAll('#topicSeg button').forEach(b=>b.onclick=()=>setTopic(b.dataset.t));
function setTopic(t){if(!TOPICS.includes(t))return;S.topic=t;P.topic=t;S.preset=null;save();renderForm();recompute()}
function loadPreset(id){for(const t of TOPICS){const p=PRE[t].find(z=>z[0]===id);if(p){S.topic=t;P.topic=t;S.inp[t]={...S.inp[t],...clone(p[1])};S.preset=id;renderForm();recompute();return}}}
/* ---------- вычисления ---------- */














function recompute(){const t=S.topic,I=S.inp[t];S.err=null;S.res=null;try{S.res=COMP[t](I)}catch(e){S.err=e;if(e instanceof Error){console.error(e);S.err={msg:'bug'}}else if(!e||!e.msg)S.err={msg:'num'};}
  P.inp=S.inp;P.preset=S.preset;save();renderAll()}
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
/* ---------- решение ---------- */

const ol=a=>`<ol class="stp">${a.filter(Boolean).map(s=>`<li>${s}</li>`).join('')}</ol>`;












function renderSolve(){const box=$('#solve'),L=T();if(S.err){const f=L.err[S.err.msg];box.innerHTML=`<p class="note err">${typeof f==='function'?f(S.err.x):(f||L.err.num)}</p>`;return}
  const r=SOLVE[S.topic](S.res,S.inp[S.topic]);S.ans=r.ans;
  box.innerHTML=`<p class="idea">${L.tt[S.topic]}</p>${ol(r.st)}<div class="ans"><div class="k">${L.ans}</div><div class="big">${r.ans}</div>${r.sub?`<p class="note" style="margin:.2rem 0 0">${r.sub}</p>`:''}</div>`}
function prop(k,v,s){return`<div class="prop"><span class="k">${k}</span><span class="v">${v}</span>${s?`<span class="s">${s}</span>`:''}</div>`}
function renderValues(){const box=$('#props'),V=T().v;if(S.err||!S.res){box.innerHTML='';return}const R=S.res;let h='';
  if(['comb','clas','ops','bayes'].includes(S.topic))h=valsNew(R,S.topic);
  else if(S.topic==='bern'){h+=prop(V.np,fN(R.np))+prop(V.npq,fN(R.npq))+prop('√(npq)',fN(R.sq,4))+prop(V.k,R.kstar.join(', '));if(R.ev!=='mode'){h+=prop(V.P,fN(R.meth==='bern'?R.exact:R.approx,5),T().mt[R.meth]);if(R.meth!=='bern')h+=prop(T().ex,fN(R.exact,5))}}
  else if(S.topic==='dsv'&&R.mode==='prop')h+=prop('M(Z)',fQ(R.MZ))+prop('D(Z)',fQ(R.DZ))+prop('σ(Z)',fN(R.sZ,4))+prop('cov(X, Y)',fQ(R.cov));
  else if(S.topic==='dsv'){const s=R.st;h+=prop(V.M,fQ(s.M))+prop(V.D,fQ(s.D))+prop(V.s,fN(s.s,4))+prop(V.mod,s.modes.map(v=>fN(v)).join(', '))+prop(V.sum,fN(R.sum,6))}
  else if(S.topic==='dvu'){const s=R.st;h+=prop(V.Mx,fQ(s.sx.M))+prop(V.My,fQ(s.sy.M))+prop(V.Dx,fQ(s.sx.D))+prop(V.Dy,fQ(s.sy.D))+prop(V.cov,fQ(s.cov))+prop(V.r,fN(s.r,4))+prop(V.ind,s.indep?V.yes:V.no)}
  else if(S.topic==='nsv'){h+=(R.kind==='f'?prop(V.C,fQ(R.C)):'')+prop(V.M,fQ(R.M))+prop(V.D,fQ(R.D))+prop(V.s,fN(R.s,4))+prop(V.mod,fN(R.mode,3))+prop(V.med,fN(R.med,4))+(R.Pab!==null?prop(V.P,fQ(R.Pab)):'')}
  else{h+=prop('m',fN(R.m,4))+prop('σ',fN(R.s,4))+prop('σ²',fN(R.s*R.s,4));if(R.P!=null)h+=prop(V.P,fN(R.P,4),T().appr)+prop(T().ex,fN(R.Pe,5));if(R.xq!=null)h+=prop('x_p',fN(R.xq,4))}
  box.innerHTML=h}
function renderPresets(){const box=$('#pre');box.innerHTML='';PRE[S.topic].forEach(([id,,ru,en])=>{const b=document.createElement('button');b.className='chip'+(S.preset===id?' on':'');b.dataset.pre=id;b.textContent=lang()==='ru'?ru:en;box.appendChild(b)})}
function renderOverlay(){const ov=$('#ov'),L=T();if(S.err||!S.res){ov.innerHTML=`<span class="tt">${L.cap.err}</span>`;return}ov.innerHTML=`<span>${S.ans||''}</span><span class="tt">${L['t_'+S.topic]}</span>`}
function renderCaption(){const cap=$('#cap');$('#capOpen').hidden=!!P.show.hints;if(!P.show.hints){cap.hidden=true;return}cap.hidden=false;$('#capT').textContent=S.err?T().cap.err:(S.topic==='dsv'&&S.res&&S.res.mode==='prop'?T().cap.prop:T().cap[S.topic])}
function renderAll(){syncTogVis();renderSolve();renderValues();renderPresets();renderOverlay();renderCaption();renderTex();const fe=$('#fErr');fe.hidden=!S.err;if(S.err){const f=T().err[S.err.msg];fe.textContent=typeof f==='function'?f(S.err.x):(f||T().err.num)}req()}

/* ---------- сцена ---------- */
const cv=$('#cv'),ctx=cv.getContext('2d'),stage=$('#stage'),main=$('#main'),side=$('#side');let W=0,H=0,DPR=1,raf=0;
new ResizeObserver(()=>{const r=stage.getBoundingClientRect();W=r.width;H=r.height;DPR=Math.min(2,window.devicePixelRatio||1);cv.width=Math.max(1,Math.round(W*DPR));cv.height=Math.max(1,Math.round(H*DPR));req()}).observe(stage);
function req(){if(!raf)raf=requestAnimationFrame(()=>{raf=0;renderNow()})}
function niceStep(raw){const p=Math.pow(10,Math.floor(Math.log10(raw))),m=raw/p;return(m<1.5?1:m<3.5?2:m<7.5?5:10)*p}
function txt(s,x,y,col,sz=12,al='center',bl='middle',it=false){ctx.font=`${it?'italic ':''}600 ${sz}px "Source Serif 4", Georgia, serif`;ctx.textAlign=al;ctx.textBaseline=bl;ctx.lineWidth=3;ctx.strokeStyle=P.colors.bg;ctx.lineJoin='round';ctx.strokeText(s,x,y);ctx.fillStyle=col;ctx.fillText(s,x,y)}
function frame(r,x0,x1,y0,y1,opt={}){const c=P.colors,X=x=>r.x+(x-x0)/(x1-x0)*r.w,Y=y=>r.y+r.h-(y-y0)/(y1-y0)*r.h;
  const sx=opt.xs||niceStep((x1-x0)/Math.max(2,r.w/80)),sy=niceStep((y1-y0)/Math.max(2,r.h/50));
  if(P.show.bgGrid){ctx.strokeStyle=c.bgGrid;ctx.lineWidth=1;ctx.beginPath();for(let x=Math.ceil(x0/sx)*sx;x<=x1+1e-9;x+=sx){const px=Math.round(X(x))+.5;ctx.moveTo(px,r.y);ctx.lineTo(px,r.y+r.h)}for(let y=Math.ceil(y0/sy)*sy;y<=y1+1e-9;y+=sy){const py=Math.round(Y(y))+.5;ctx.moveTo(r.x,py);ctx.lineTo(r.x+r.w,py)}ctx.stroke()}
  ctx.strokeStyle=c.axis;ctx.globalAlpha=.6;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(r.x,Y(Math.max(y0,0)));ctx.lineTo(r.x+r.w,Y(Math.max(y0,0)));if(x0<=0&&x1>=0&&!opt.noYA){ctx.moveTo(X(0),r.y);ctx.lineTo(X(0),r.y+r.h)}ctx.stroke();ctx.globalAlpha=1;
  if(P.show.coords){ctx.fillStyle=c.axis;ctx.globalAlpha=.7;ctx.font='500 11px Manrope, system-ui, sans-serif';ctx.textAlign='center';ctx.textBaseline='top';const dx=Math.max(0,-Math.floor(Math.log10(sx)));
    if(!opt.noX)for(let x=Math.ceil(x0/sx)*sx;x<=x1+1e-9;x+=sx)ctx.fillText(dc(fmt(x,dx)),X(x),Y(Math.max(y0,0))+4);ctx.textAlign='right';ctx.textBaseline='middle';const dy=Math.max(0,-Math.floor(Math.log10(sy)));
    for(let y=Math.ceil(y0/sy)*sy;y<=y1+1e-9;y+=sy){if(Math.abs(y)<sy/2)continue;ctx.fillText(dc(fmt(y,dy)),r.x-4,Y(y))}ctx.globalAlpha=1}
  if(opt.title)txt(opt.title,r.x+6,r.y+8,c.axis,13,'left','middle',true);return{X,Y,r,x0,x1}}
function plotFn(fr,f,col,w,dash,a,b){const lo=a===undefined?fr.x0:a,hi=b===undefined?fr.x1:b;ctx.strokeStyle=col;ctx.lineWidth=w;ctx.setLineDash(dash||[]);ctx.beginPath();let pen=false;const N=Math.max(60,Math.round(fr.r.w*(hi-lo)/(fr.x1-fr.x0)/1.5));
  for(let i=0;i<=N;i++){const x=lo+(hi-lo)*i/N,y=f(x);if(!isFinite(y)){pen=false;continue}const X=fr.X(x),Y=Math.max(fr.r.y-20,Math.min(fr.r.y+fr.r.h+20,fr.Y(y)));if(!pen){ctx.moveTo(X,Y);pen=true}else ctx.lineTo(X,Y)}ctx.stroke();ctx.setLineDash([])}
function fillFn(fr,f,a,b,col,al=.38){a=Math.max(a,fr.x0);b=Math.min(b,fr.x1);if(!(b>a))return;const N=Math.max(30,Math.round(fr.r.w*(b-a)/(fr.x1-fr.x0)));ctx.beginPath();ctx.moveTo(fr.X(a),fr.Y(0));for(let i=0;i<=N;i++){const x=a+(b-a)*i/N,y=f(x);ctx.lineTo(fr.X(x),fr.Y(isFinite(y)?y:0))}ctx.lineTo(fr.X(b),fr.Y(0));ctx.closePath();ctx.globalAlpha=al;ctx.fillStyle=col;ctx.fill();ctx.globalAlpha=1}
function vline(fr,x,col,lab,dash=[5,4]){if(x<fr.x0||x>fr.x1)return;const X=fr.X(x);ctx.strokeStyle=col;ctx.lineWidth=1.5;ctx.setLineDash(dash);ctx.beginPath();ctx.moveTo(X,fr.r.y);ctx.lineTo(X,fr.r.y+fr.r.h);ctx.stroke();ctx.setLineDash([]);if(lab)txt(lab,X,fr.r.y+10,col,13)}
function layout(two){const pT=Math.min(96,H*.17),pB=Math.min(70,H*.12),pl=46,pr=24,h=H-pT-pB;if(!two)return[{x:pl,y:pT,w:W-pl-pr,h}];const g=26,h1=h*.62,h2=h-h1-g;return[{x:pl,y:pT,w:W-pl-pr,h:h1},{x:pl,y:pT+h1+g,w:W-pl-pr,h:h2}]}
function renderNow(){ctx.setTransform(DPR,0,0,DPR,0,0);const c=P.colors;ctx.fillStyle=c.bg;ctx.fillRect(0,0,W,H);S.lay=null;if(!S.res||S.err||!W)return;
  ({comb:drawComb,clas:drawClas,ops:drawOps,bayes:drawBayes,bern:drawBern,dsv:drawDsv,dvu:drawDvu,nsv:drawNsv,norm:drawNorm})[S.topic](S.res);if(S.stamp){const t=(S.ans||'').replace(/<[^>]+>/g,'');ctx.font='600 15px "Source Serif 4", Georgia, serif';const w=ctx.measureText(t).width+20;ctx.fillStyle=c.bg;ctx.globalAlpha=.85;ctx.fillRect(W-w-12,H-38,w,28);ctx.globalAlpha=1;ctx.fillStyle=c.axis;ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(t,W-w-2,H-24)}}
function drawBern(R){const c=P.colors;let k0=0,k1=R.n;if(R.n>40){k0=Math.max(0,Math.floor(R.np-5*Math.max(R.sq,1)));k1=Math.min(R.n,Math.ceil(R.np+5*Math.max(R.sq,1)))}
  if(['eq','rng','ge','le'].includes(R.ev)){k0=Math.min(k0,Math.max(0,R.k1-2));k1=Math.max(k1,Math.min(R.n,R.k2+2));if(k1-k0>400){k0=Math.max(0,Math.floor(R.np-5*R.sq));k1=Math.min(R.n,Math.ceil(R.np+5*R.sq))}}
  S.barsN=k1-k0+1;syncTogVis();let ym=0;for(let k=k0;k<=k1;k++)ym=Math.max(ym,binom(R.n,R.p,k));const[r]=layout(false);const fr=frame(r,k0-.6,k1+.6,0,ym*1.18,{noYA:true,title:`P${sb(R.n)}(k)`,xs:Math.max(1,niceStep((k1-k0)/Math.max(2,r.w/60)))});
  const bw=Math.max(1,fr.X(1)-fr.X(0))*.72,inEv=k=>R.ev==='mode'?R.kstar.includes(k):k>=(R.ev==='one'?1:R.k1)&&k<=R.k2;
  for(let k=k0;k<=k1;k++){const v=binom(R.n,R.p,k),x=fr.X(k),y=fr.Y(v),sel=inEv(k);ctx.fillStyle=sel?c.sel:c.bar;ctx.globalAlpha=sel?.9:.55;ctx.fillRect(x-bw/2,y,bw,fr.Y(0)-y);ctx.globalAlpha=1;
    if(P.show.labels&&k1-k0<=16&&v>ym*.02)txt(dc(fmt(v,3)),x,y-9,sel?c.sel:c.axis,11)}
  if(P.show.approx&&R.n>=8){if(R.np<=10&&R.p<.3){ctx.fillStyle=c.curve;for(let k=k0;k<=k1;k++){const v=poiss(R.np,k);ctx.beginPath();ctx.arc(fr.X(k),fr.Y(v),3.2,0,7);ctx.fill()}txt('Пуассон'.replace('Пуассон',lang()==='ru'?'Пуассон':'Poisson'),r.x+r.w-6,r.y+10,c.curve,13,'right')}
    else if(R.sq>0){plotFn(fr,x=>phiG((x-R.np)/R.sq)/R.sq,c.curve,2.2*P.lw,[7,5]);txt(lang()==='ru'?'Муавр–Лаплас':'de Moivre–Laplace',r.x+r.w-6,r.y+10,c.curve,13,'right')}}
  if(P.show.sigma)vline(fr,R.np,c.mark,'np')}
function stepsF(fr,x,p,col){let acc=0;ctx.strokeStyle=col;ctx.lineWidth=2.2*P.lw;const xs=[fr.x0,...x,fr.x1];for(let i=0;i<xs.length-1;i++){const y=fr.Y(acc);ctx.beginPath();ctx.moveTo(fr.X(xs[i]),y);ctx.lineTo(fr.X(xs[i+1]),y);ctx.stroke();
    if(i>0){ctx.fillStyle=col;ctx.beginPath();ctx.arc(fr.X(xs[i]),y,3.5,0,7);ctx.fill()}if(i<x.length){ctx.strokeStyle=col;ctx.fillStyle=P.colors.bg;ctx.beginPath();ctx.arc(fr.X(xs[i+1]),y,3.5,0,7);ctx.fill();ctx.stroke();acc+=p[i]}}}
function drawDsv(R){if(R.mode==='prop')return drawProp(R);const c=P.colors,two=P.show.Fplot,[r1,r2]=layout(two);const x0=R.x[0],x1=R.x[R.x.length-1],pad=Math.max(1,(x1-x0)*.12),ym=Math.max(...R.p);
  const fr=frame(r1,x0-pad,x1+pad,0,ym*1.2,{title:'P(X = xᵢ)'});const bw=Math.min(18,Math.max(3,(fr.X(x1)-fr.X(x0))/Math.max(1,R.x.length)*.3));
  if(P.show.sigma){const s=R.st;const a=fr.X(s.M-s.s),b=fr.X(s.M+s.s);ctx.fillStyle=c.mark;ctx.globalAlpha=.12;ctx.fillRect(a,r1.y,b-a,r1.h);ctx.globalAlpha=1;vline(fr,s.M,c.mark,'M(X)')}
  ctx.strokeStyle=c.bar;ctx.lineWidth=2*P.lw;ctx.beginPath();R.x.forEach((x,i)=>{const X=fr.X(x),Y=fr.Y(R.p[i]);i?ctx.lineTo(X,Y):ctx.moveTo(X,Y)});ctx.stroke();
  R.x.forEach((x,i)=>{const X=fr.X(x),Y=fr.Y(R.p[i]),md=R.st.modes.includes(x);ctx.fillStyle=md?c.sel:c.bar;ctx.globalAlpha=.45;ctx.fillRect(X-bw/2,Y,bw,fr.Y(0)-Y);ctx.globalAlpha=1;ctx.beginPath();ctx.arc(X,Y,4,0,7);ctx.fill();if(P.show.labels&&R.x.length<=14)txt(dc(fmt(R.p[i],3)),X,Y-11,md?c.sel:c.axis,11)});
  if(two){const f2=frame(r2,x0-pad,x1+pad,0,1.08,{title:'F(x)'});stepsF(f2,R.x,R.p,c.F)}}
function drawProp(R){const c=P.colors,cx=W/2,y=Math.min(150,H*.25);txt(`Z = ${zLin(R.a,R.b,R.c)}`,cx,y,c.axis,24,'center','middle',true);
  const lines=[[`M(Z) = a·M(X) + b·M(Y) + c = ${fT(R.MZ)}`,c.mark],[`D(Z) = a²D(X) + b²D(Y) + 2ab·cov = ${fT(R.DZ)}`,c.F],[`σ(Z) = ${fT(R.sZ)}`,c.bar]];lines.forEach(([s,col],i)=>txt(s,cx,y+56+i*40,col,18));
  if(P.show.sigma&&R.sZ>0){const r={x:70,y:y+200,w:W-140,h:60};const fr=frame(r,R.MZ-3.2*R.sZ,R.MZ+3.2*R.sZ,0,1,{noYA:true});[[2,.1],[1,.22]].forEach(([k,al])=>{ctx.fillStyle=c.mark;ctx.globalAlpha=al;ctx.fillRect(fr.X(R.MZ-k*R.sZ),r.y,fr.X(R.MZ+k*R.sZ)-fr.X(R.MZ-k*R.sZ),r.h);ctx.globalAlpha=1});
    vline(fr,R.MZ,c.mark,'M(Z)');txt('M ± σ',fr.X(R.MZ+R.sZ*.5),r.y+r.h-12,c.mark,12);txt('M ± 2σ',fr.X(R.MZ+R.sZ*1.5),r.y+r.h-12,c.mark,12)}}
function drawDvu(R){const c=P.colors,J=R.J,s=R.st,nr=J.x.length,nc=J.y.length;const pT=Math.min(100,H*.17),pB=Math.min(70,H*.12),cw=Math.min(90,(W-120)/(nc+1.6)),ch=Math.min(64,(H-pT-pB-40)/(nr+1.6)),x0=(W-cw*(nc+1.3))/2+30,y0=pT+26;
  const pm=Math.max(...J.P.flat(),1e-9);ctx.font='600 14px "Source Serif 4", Georgia, serif';
  txt('X \\ Y',x0-34,y0-16,c.axis,13);J.y.forEach((y,j)=>txt(dc(fmt(y,3)),x0+cw*j+cw/2,y0-16,c.aux,14));J.x.forEach((x,i)=>txt(dc(fmt(x,3)),x0-26,y0+ch*i+ch/2,c.bar,14));
  for(let i=0;i<nr;i++)for(let j=0;j<nc;j++){const v=J.P[i][j],X=x0+cw*j,Y=y0+ch*i;ctx.fillStyle=c.area;ctx.globalAlpha=.12+.6*v/pm;ctx.fillRect(X+2,Y+2,cw-4,ch-4);ctx.globalAlpha=1;if(P.show.labels)txt(dc(fmt(v,4)),X+cw/2,Y+ch/2,c.axis,14)}
  if(R.cond){ctx.strokeStyle=c.sel;ctx.lineWidth=3;if(R.cond.given==='X'){const Y=y0+ch*R.cond.idx;ctx.strokeRect(x0,Y,cw*nc,ch)}else{const X=x0+cw*R.cond.idx;ctx.strokeRect(X,y0,cw,ch*nr)}}
  const mx=x0+cw*nc+14,bwMax=cw*.9;s.px.forEach((v,i)=>{const Y=y0+ch*i;ctx.fillStyle=c.bar;ctx.globalAlpha=.6;ctx.fillRect(mx,Y+ch*.25,bwMax*v,ch*.5);ctx.globalAlpha=1;if(P.show.labels)txt(dc(fmt(v,4)),mx+bwMax*v+4,Y+ch/2,c.bar,12,'left')});txt('pₓ',mx+10,y0-16,c.bar,13);
  const my=y0+ch*nr+12,bh=ch*.9;s.py.forEach((v,j)=>{const X=x0+cw*j;ctx.fillStyle=c.aux;ctx.globalAlpha=.6;ctx.fillRect(X+cw*.25,my,cw*.5,bh*v);ctx.globalAlpha=1;if(P.show.labels)txt(dc(fmt(v,4)),X+cw/2,my+bh*v+10,c.aux,12)});txt('pᵧ',x0-26,my+12,c.aux,13)}
function drawNsv(R){const c=P.colors,two=P.show.Fplot,[r1,r2]=layout(two);let lo=R.lo,hi=R.hi;const L=hi-lo,pad=L*.18;let ym=0;for(let i=0;i<=300;i++){const v=R.f(lo+L*i/300);if(isFinite(v))ym=Math.max(ym,v)}
  const fr=frame(r1,lo-pad,hi+pad,0,ym*1.2||1,{title:'f(x)'});S.lay={fr,kind:'nsv'};
  if(R.Pab!==null)fillFn(fr,R.f,Math.min(R.al,R.be),Math.max(R.al,R.be),c.area);plotFn(fr,R.f,c.bar,2.6*P.lw);
  if(P.show.sigma){vline(fr,R.M,c.mark,'M');ctx.fillStyle=c.mark;ctx.globalAlpha=.1;ctx.fillRect(fr.X(R.M-R.s),r1.y,fr.X(R.M+R.s)-fr.X(R.M-R.s),r1.h);ctx.globalAlpha=1}
  if(R.Pab!==null){vline(fr,R.al,c.sel,'α',[]);vline(fr,R.be,c.sel,'β',[])}
  if(two){const f2=frame(r2,lo-pad,hi+pad,0,1.08,{title:'F(x)'});plotFn(f2,R.F,c.F,2.4*P.lw);vline(f2,R.med,c.mark,'x_med')}}
function drawNorm(R){const c=P.colors,[r]=layout(false),m=R.m,s=R.s;const fr=frame(r,m-4*s,m+4*s,0,phiG(0)/s*1.2,{title:`N(${dc(fmt(m,3))}; ${dc(fmt(s,3))}²)`});S.lay={fr,kind:'norm'};const f=x=>phiG((x-m)/s)/s;
  if(P.show.sigma)for(const k of[1,2,3]){for(const sg of[-1,1]){const x=m+sg*k*s,X=fr.X(x);ctx.strokeStyle=c.mark;ctx.globalAlpha=.5;ctx.setLineDash([3,4]);ctx.beginPath();ctx.moveTo(X,fr.Y(f(x)));ctx.lineTo(X,fr.Y(0));ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;txt(`${sg<0?'−':'+'}${k}σ`,X,fr.Y(0)-10,c.mark,11)}}
  fillFn(fr,f,R.lo===-Infinity?m-4*s:R.lo,R.hi===Infinity?m+4*s:R.hi,c.area);plotFn(fr,f,c.bar,2.6*P.lw);vline(fr,m,c.mark,'m');
  for(const x of[R.lo,R.hi])if(isFinite(x))vline(fr,x,c.sel,P.show.labels?dc(fmt(x,3)):'',[]);
  if(P.show.labels&&R.P!=null){const mid=Math.max(m-4*s,Math.min(m+4*s,(isFinite(R.lo)&&isFinite(R.hi))?(R.lo+R.hi)/2:isFinite(R.lo)?R.lo+s:R.hi-s));txt(`P ≈ ${dc(fmt(R.P,4))}`,fr.X(mid),fr.Y(f(mid)*.45),c.axis,15)}}
/* перетаскивание границ */
let drag=null;const pos=e=>{const r=cv.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}};
function handles(){const L=S.lay,R=S.res;if(!L||!R)return[];if(L.kind==='nsv'&&R.Pab!==null)return[['al',R.al],['be',R.be]];if(L.kind==='norm'){if(R.q==='rng')return[['x1',R.x1],['x2',R.x2]];if(R.q==='lt'||R.q==='gt')return[['x1',R.x1]]}return[]}
cv.addEventListener('pointerdown',e=>{const p=pos(e),L=S.lay;if(!L)return;for(const[k,v]of handles()){if(Math.abs(L.fr.X(v)-p.x)<12){drag=k;cv.setPointerCapture(e.pointerId);cv.style.cursor='ew-resize';return}}});
cv.addEventListener('pointermove',e=>{const p=pos(e),L=S.lay;if(!drag){cv.style.cursor=L&&handles().some(([,v])=>Math.abs(L.fr.X(v)-p.x)<12)?'ew-resize':'default';return}
  const fr=L.fr;let x=fr.x0+(p.x-fr.r.x)/fr.r.w*(fr.x1-fr.x0);const st=niceStep((fr.x1-fr.x0)/40);x=Math.round(x/st)*st;x=+x.toFixed(6);S.inp[S.topic][drag]=dc(String(x));S.preset=null;const el=document.querySelector(`#form [data-k="${drag}"]`);if(el)el.value=S.inp[S.topic][drag];recompute()});
const endD=()=>{drag=null;cv.style.cursor='default'};cv.addEventListener('pointerup',endD);cv.addEventListener('pointercancel',endD);
/* ---------- переключатели ---------- */
const TOG=['bgGrid','coords','labels','approx','sigma','Fplot','hints'];
function buildToggles(){const box=$('#tog');box.innerHTML='';TOG.forEach(k=>{const l=document.createElement('label');l.className='chk';l.innerHTML=`<input type="checkbox" data-k="${k}"> <span>${T().tog[k]}</span>`;l.querySelector('input').onchange=e=>{P.show[k]=e.target.checked;save();renderCaption();req()};box.appendChild(l)})}
function syncToggles(){document.querySelectorAll('#tog input').forEach(i=>{i.checked=!!P.show[i.dataset.k]});syncTogVis()}
function relTogs(){const t=S.topic,I=S.inp[t]||{};const G=['bgGrid','coords'];
  const m={comb:['labels'],clas:I.cmode==='dice'?[...G,'labels']:['labels'],ops:I.omode==='indep'?[...G,'labels']:['labels'],bayes:['labels'],bern:[...G,...(S.barsN>17?[]:['labels']),'approx','sigma'],
    dsv:I.mode==='prop'?['coords','sigma']:[...G,'labels','sigma','Fplot'],dvu:['labels'],nsv:[...G,'sigma','Fplot'],norm:[...G,'labels','sigma']};return[...(m[t]||[]),'hints']}
function syncTogVis(){const r=relTogs();document.querySelectorAll('#tog label').forEach(l=>{const k=l.querySelector('input').dataset.k;l.style.display=r.includes(k)?'':'none'})}
$('#capOpen').onclick=()=>{P.show.hints=true;syncToggles();renderCaption();save()};$('#capX').onclick=()=>{P.show.hints=false;syncToggles();renderCaption();save()};
document.addEventListener('click',e=>{const q=e.target.closest('[data-term]');if(q){e.preventDefault();e.stopPropagation();openTerm(q.dataset.term);return}const p=e.target.closest('[data-pre]');if(p)loadPreset(p.dataset.pre)});
function fitView(){req()}function play(){}
/* ---------- обозначения Φ / Φ₀ ---------- */


/* ---------- дроби BigInt ---------- */

/* ---------- 1. комбинаторика ---------- */

/* ---------- 2. классическая ---------- */

/* ---------- 3. сложение и умножение ---------- */

/* ---------- 4. полная вероятность и Байес ---------- */

function valsNew(R,t){const V=T().v;if(t==='comb')return prop('N',bStr(R.val))+prop(T().v.dig,String(R.val.toString().length));if(t==='clas')return prop('m',bStr(R.num))+prop('n',bStr(R.den))+prop('P',fN(R.P,5));
  if(t==='ops')return R.mode==='two'?prop('P(A + B)',fQ(R.sum))+prop('P(AB)',fQ(R.pab))+prop('P(A | B)',fQ(R.agb))+prop('P(B | A)',fQ(R.bga))+prop(V.ind,R.indep?V.yes:V.no):R.c.map((v,k)=>prop(`P(${T().v.ex} ${k})`,fN(v,5))).join('');
  return prop('P(A)',fQ(R.PA,5))+R.post.map((v,i)=>prop(`P(H${sb(i+1)} | ${R.bev==='notA'?'Ā':'A'})`,fQ(v,4),`${T().v.prior}: ${fN(R.pr[i],4)}`)).join('')}
/* ---------- сцены ---------- */
const COLS=()=>[P.colors.bar,P.colors.aux,P.colors.area,P.colors.curve,P.colors.mark,P.colors.sel,P.colors.F];
function box(x,y,w,h,col,al=.25){ctx.fillStyle=col;ctx.globalAlpha=al;ctx.fillRect(x,y,w,h);ctx.globalAlpha=1;ctx.strokeStyle=col;ctx.lineWidth=1.6;ctx.strokeRect(x+.5,y+.5,w,h)}
function drawComb(R){const c=P.colors,pT=Math.min(110,H*.2);let slots=[],tail='';const k=R.kind,n=R.n,kk=R.k;
  if(k==='perm')slots=Array.from({length:n},(_,i)=>n-i);else if(k==='arr'||k==='comb')slots=Array.from({length:kk},(_,i)=>n-i);else if(k==='arrRep')slots=Array.from({length:kk},()=>n);else if(k==='prod')slots=R.list.slice();
  if(k==='comb')tail=`÷ ${kk}!`;if(k==='combRep'){slots=Array.from({length:kk},(_,i)=>n+kk-1-i);tail=`÷ ${kk}!`}if(k==='permRep'){slots=Array.from({length:R.n},(_,i)=>R.n-i);tail=`÷ ${R.list.map(v=>v+'!').join('·')}`}
  const show=slots.length>10?[...slots.slice(0,4),'…',...slots.slice(-3)]:slots,bw=Math.min(78,(W-120)/Math.max(4,show.length*1.35)),gap=bw*.35,tw=show.length*bw+(show.length-1)*gap,x0=(W-tw)/2,y0=pT+20;
  show.forEach((v,i)=>{const x=x0+i*(bw+gap);if(v==='…'){txt('…',x+bw/2,y0+bw/2,c.axis,22);return}box(x,y0,bw,bw,COLS()[i%7]);txt(String(v),x+bw/2,y0+bw/2,c.axis,Math.min(22,bw*.4));if(i<show.length-1)txt('×',x+bw+gap/2,y0+bw/2,c.axis,16);if(P.show.labels)txt(`${i+1}`,x+bw/2,y0+bw+12,c.axis,11)});
  if(tail)txt(tail,W/2,y0+bw+40,c.sel,18);txt(`= ${bStr(R.val)}`,W/2,y0+bw+(tail?72:44),c.sel,22);
  if(P.show.labels&&(k==='perm'||k==='arr'||k==='comb'||k==='arrRep')&&R.val<=60n&&n<=8){const items=[],let_='ABCDEFGH';const rec=(cur,used)=>{if(cur.length===(k==='perm'?n:kk)){items.push(cur.join(''));return}for(let i=0;i<n;i++){if(k!=='arrRep'&&used[i])continue;if(k==='comb'&&cur.length&&let_.indexOf(cur[cur.length-1])>i)continue;used[i]=1;rec([...cur,let_[i]],used);used[i]=0}};rec([],[]);
    const cols=Math.min(10,Math.ceil(Math.sqrt(items.length*2))),cw=Math.min(90,(W-80)/cols),yy=y0+bw+110;items.slice(0,60).forEach((s,i)=>txt(s,40+cw*(i%cols)+cw/2,yy+Math.floor(i/cols)*24,c.bar,15))}}
function drawGauge(p,y,lab){const c=P.colors,w=Math.min(520,W-120),x=(W-w)/2;box(x,y,w,26,c.axis,.06);ctx.fillStyle=c.sel;ctx.globalAlpha=.8;ctx.fillRect(x,y,w*p,26);ctx.globalAlpha=1;txt(lab,W/2,y+46,c.sel,18)}
function drawClas(R){const c=P.colors,pT=Math.min(110,H*.2);
  if(R.m==='dice'){const[r]=layout(false),d=R.d,lo=R.s,hi=6*R.s,ym=Math.max(...d)/R.tot;const fr=frame(r,lo-.6,hi+.6,0,ym*1.2,{noYA:true,title:`P(${lang()==='ru'?'сумма':'sum'} = s)`,xs:R.s>3?2:1});const bw=(fr.X(1)-fr.X(0))*.72;
    for(let s=lo;s<=hi;s++){const v=d[s]/R.tot,sel=R.dev==='eq'?s===R.v:R.dev==='ge'?s>=R.v:s<=R.v,X=fr.X(s),Y=fr.Y(v);ctx.fillStyle=sel?c.sel:c.bar;ctx.globalAlpha=sel?.9:.5;ctx.fillRect(X-bw/2,Y,bw,fr.Y(0)-Y);ctx.globalAlpha=1;if(P.show.labels&&hi-lo<=16)txt(String(d[s]),X,Y-9,sel?c.sel:c.axis,11)}return}
  if(R.m==='mn'){const n=R.tot,cols=Math.ceil(Math.sqrt(n*1.8)),cs=Math.min(36,(W-120)/cols,(H*.45)/Math.ceil(n/cols)),x0=(W-cols*cs)/2;if(n<=600)for(let i=0;i<n;i++){const x=x0+(i%cols)*cs,y=pT+20+Math.floor(i/cols)*cs;ctx.fillStyle=i<R.fav?c.sel:c.bar;ctx.globalAlpha=i<R.fav?.85:.35;ctx.fillRect(x+1,y+1,cs-2,cs-2);ctx.globalAlpha=1}
    drawGauge(R.P,H-Math.min(140,H*.24),`P = ${R.fav}/${R.tot}`);return}
  const tot=R.N,rad=Math.max(5,Math.min(16,Math.sqrt((W*H*.18)/Math.max(tot,1))/2.4)),per=Math.max(1,Math.floor((W-120)/(rad*2.6)));let i=0,x0=60,y0=pT+20;
  R.a.forEach((cnt,ci)=>{for(let j=0;j<Math.min(cnt,400);j++,i++){const x=x0+(i%per)*rad*2.6+rad,y=y0+Math.floor(i/per)*rad*2.6+rad;ctx.fillStyle=COLS()[ci%7];ctx.beginPath();ctx.arc(x,y,rad,0,7);ctx.fill()}});
  const rows=Math.ceil(Math.min(i,400*R.a.length)/per),yy=y0+rows*rad*2.6+24;const pat=R.cev==='exact'?R.terms[0]:null;
  txt((lang()==='ru'?'Берём ':'Draw ')+R.n+(pat?(lang()==='ru'?': нужно ':': need ')+pat.join(' + '):''),W/2,yy,c.axis,16);drawGauge(Math.min(1,R.P),yy+28,`P = ${fracB(R.num,R.den).replace(/ ≈ .*/,'')} ≈ ${fT(R.P,4)}`)}
function drawOps(R){const c=P.colors;if(R.mode==='two'){const cx=W/2,cy=Math.min(H*.52,H-180),r=Math.min(W*.18,H*.26),d=r*.95;
    ctx.globalAlpha=.25;ctx.fillStyle=c.bar;ctx.beginPath();ctx.arc(cx-d/2,cy,r,0,7);ctx.fill();ctx.fillStyle=c.aux;ctx.beginPath();ctx.arc(cx+d/2,cy,r,0,7);ctx.fill();ctx.globalAlpha=1;
    ctx.lineWidth=2.4;ctx.strokeStyle=c.bar;ctx.beginPath();ctx.arc(cx-d/2,cy,r,0,7);ctx.stroke();ctx.strokeStyle=c.aux;ctx.beginPath();ctx.arc(cx+d/2,cy,r,0,7);ctx.stroke();ctx.strokeStyle=c.axis;ctx.globalAlpha=.4;ctx.strokeRect(cx-d/2-r-40,cy-r-30,d+2*r+80,2*r+60);ctx.globalAlpha=1;
    txt('A',cx-d/2-r*.7,cy-r*.8,c.bar,20,'center','middle',true);txt('B',cx+d/2+r*.7,cy-r*.8,c.aux,20,'center','middle',true);
    if(P.show.labels){txt(dc(fmt(R.onlyA,4)),cx-d/2-r*.45,cy,c.axis,15);txt(dc(fmt(R.pab,4)),cx,cy,c.sel,16);txt(dc(fmt(R.onlyB,4)),cx+d/2+r*.45,cy,c.axis,15);txt(dc(fmt(R.none,4)),cx-d/2-r-20,cy+r+14,c.axis,13,'left')}return}
  const[r]=layout(false),n=R.n,fr=frame(r,-.6,n+.6,0,Math.max(...R.c)*1.2,{noYA:true,title:lang()==='ru'?'P(произошло ровно k)':'P(exactly k happened)',xs:1});const bw=(fr.X(1)-fr.X(0))*.6;
  const inE=k=>R.ev==='all'?k===n:R.ev==='none'?k===0:R.ev==='one1'?k>=1:R.ev==='exact'?k===R.k:R.ev==='ge'?k>=R.k:R.ev==='le'?k<=R.k:false;
  R.c.forEach((v,k)=>{const X=fr.X(k),Y=fr.Y(v),s=inE(k);ctx.fillStyle=s?c.sel:c.bar;ctx.globalAlpha=s?.9:.5;ctx.fillRect(X-bw/2,Y,bw,fr.Y(0)-Y);ctx.globalAlpha=1;if(P.show.labels)txt(dc(fmt(v,4)),X,Y-10,s?c.sel:c.axis,12)})}
function drawBayes(R){const c=P.colors,pT=Math.min(110,H*.2),pB=Math.min(80,H*.14),hh=H-pT-pB-30,w=Math.min(W*.55,W-260),x0=50,y0=pT+18;let x=x0;
  R.pr.forEach((p,i)=>{const cw=w*p,col=COLS()[i%7];box(x,y0,cw,hh,col,.12);const fh=hh*R.L[i];ctx.fillStyle=col;ctx.globalAlpha=.75;ctx.fillRect(x,y0+hh-fh,cw,fh);ctx.globalAlpha=1;
    if(cw>26){txt(`H${sb(i+1)}`,x+cw/2,y0-10,col,14,'center','middle',true);if(P.show.labels)txt(dc(fmt(R.L[i],3)),x+cw/2,y0+hh-fh-10,c.axis,12)}x+=cw});
  txt(lang()==='ru'?`ширина — P(Hᵢ), закрашено — P(${R.bev==='notA'?'Ā':'A'} | Hᵢ)`:`width — P(Hᵢ), filled — P(${R.bev==='notA'?'Ā':'A'} | Hᵢ)`,x0+w/2,y0+hh+18,c.axis,12);
  const bx=x0+w+70,bw=Math.min(90,W-bx-90);let y=y0;txt(lang()==='ru'?'после опыта':'posterior',bx+bw/2,y0-10,c.axis,13);
  R.post.forEach((p,i)=>{const h=hh*p,col=COLS()[i%7];ctx.fillStyle=col;ctx.globalAlpha=.75;ctx.fillRect(bx,y,bw,h);ctx.globalAlpha=1;if(h>16)txt(P.show.labels?`H${sb(i+1)}: ${dc(fmt(p,3))}`:`H${sb(i+1)}`,bx+bw+8,y+h/2,col,13,'left');y+=h})}
/* ---------- справочник ---------- */
const termTitle=id=>{const t=TERMS.find(x=>x.id===id);return t?(t[lang()]||t.ru)[0]:id};
function mathify(h){return h}
function gTabs(id,html){const f=FORMAL[id];if(!f)return html;const L=T(),ft=P.gTab==='f';
  return`<div class="seg gtabs"><button data-tab="i" class="${ft?'':'on'}">${L.tabI}</button><button data-tab="f" class="${ft?'on':''}">${L.tabF}</button></div><div class="pane" data-pane="i"${ft?' hidden':''}>${html}</div><div class="pane" data-pane="f"${ft?'':' hidden'}>${f[lang()]||f.ru}</div>`}
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
function exportPng(){if(!canSave()||S.rec)return;S.stamp=$('#xStamp').checked;renderNow();cv.toBlob(b=>{S.stamp=false;req();if(b)saveFile('probability.png',b)},'image/png')}
async function exportVideo(){const m=vidMime();if(!canSave()||!m||S.rec||S.err||!S.anyAnim)return;S.rec=true;S.stamp=$('#xStamp').checked;updExport();
  const keep=ms=>new Promise(r=>{const t0=performance.now();const f=()=>{renderNow();if(performance.now()-t0<ms)requestAnimationFrame(f);else r()};f()});
  const chunks=[];let rec;
  try{const stream=cv.captureStream(60);rec=new MediaRecorder(stream,{mimeType:m,videoBitsPerSecond:8e6});rec.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data)};
    const stopped=new Promise(r=>{rec.onstop=r});S.t=0;S.anim=null;rec.start(100);await keep(500);
    play();await new Promise(r=>{const f=()=>S.anim?requestAnimationFrame(f):r();f()});await keep(900);rec.stop();await stopped}
  catch(err){S.rec=false;S.stamp=false;req();flash(T().xFail);return}
  S.rec=false;S.stamp=false;req();updExport();const blob=new Blob(chunks,{type:m});if(blob.size)saveFile(`probability.${m.startsWith('video/mp4')?'mp4':'webm'}`,blob);else flash(T().xFail)}
async function copyTex(){const ta=$('#xTex'),L=T();let ok=false;try{await navigator.clipboard.writeText(ta.value);ok=true}catch(e){}if(!ok){ta.focus();ta.select();try{ok=document.execCommand('copy')}catch(e){}}flash(ok?L.xCopied:L.xSelect)}
$('#xPng').onclick=exportPng;$('#xVid').onclick=exportVideo;$('#xCopy').onclick=copyTex;
document.querySelectorAll('#xFmt button').forEach(b=>b.onclick=()=>{fmtMode=b.dataset.f;document.querySelectorAll('#xFmt button').forEach(x=>x.classList.toggle('on',x===b));renderTex()});

function illSvg(id){const sp=ILL[id];if(!sp)return'';const W=200,H=140,c=k=>`var(--s-${k})`,F=v=>(+v).toFixed(1);let o='';const ax=`<line x1="14" y1="122" x2="190" y2="122" stroke="${c('axis')}" stroke-opacity=".5"/>`;
  const path=(f,a,b,X,Y,n=80)=>{let d='';for(let i=0;i<=n;i++){const x=a+(b-a)*i/n;d+=(i?'L':'M')+F(X(x))+' '+F(Y(f(x)))}return d};
  if(sp.k==='bars'){const n=sp.v.length,m=Math.max(...sp.v),bw=150/n;sp.v.forEach((v,i)=>{const h=v/m*95;o+=`<rect x="${F(25+i*bw+bw*.15)}" y="${F(122-h)}" width="${F(bw*.7)}" height="${F(h)}" fill="${c((sp.sel||[]).includes(i)?'sel':'bar')}" fill-opacity=".75"/>`});
    if(sp.poly)o+=`<polyline points="${sp.v.map((v,i)=>F(25+i*bw+bw/2)+','+F(122-v/m*95)).join(' ')}" fill="none" stroke="${c('bar')}" stroke-width="2"/>`;
    if(sp.curve){const mu=2,s=Math.sqrt(2);o+=`<path d="${path(x=>Math.exp(-(x-mu)*(x-mu)/(2*s*s)),-.5,n-.5,x=>25+(x+.5)*bw,y=>122-y*.27/m*95)}" fill="none" stroke="${c('curve')}" stroke-width="2" stroke-dasharray="5 4"/>`}}
  else if(sp.k==='bell'||sp.k==='dens'){const f=sp.k==='bell'?(x=>Math.exp(-x*x/2)):sp.f,x0=sp.k==='bell'?-3.5:(sp.ext?sp.ext[0]:sp.x0-(sp.x1-sp.x0)*.15),x1=sp.k==='bell'?3.5:(sp.ext?sp.ext[1]:sp.x1+(sp.x1-sp.x0)*.15);
    const ff=sp.k==='dens'?(x=>x<sp.x0||x>sp.x1?0:f(x)):f;let m=0;for(let i=0;i<=100;i++)m=Math.max(m,ff(x0+(x1-x0)*i/100));const X=x=>16+(x-x0)/(x1-x0)*172,Y=y=>122-y/m*92;
    if(sp.a!==undefined){const a=Math.max(sp.a,x0),b=Math.min(sp.b,x1);o+=`<path d="M${F(X(a))} 122 ${path(ff,a,b,X,Y).replace('M','L')} L${F(X(b))} 122 Z" fill="${c('area')}" fill-opacity=".4"/>`}
    o+=`<path d="${path(ff,x0,x1,X,Y,160)}" fill="none" stroke="${c('bar')}" stroke-width="2.4"/>`;if(sp.sig)for(const k of[-3,-2,-1,1,2,3])o+=`<line x1="${F(X(k))}" y1="122" x2="${F(X(k))}" y2="${F(Y(f(k)))}" stroke="${c('mark')}" stroke-dasharray="3 3"/>`;
    if(sp.F){let d='';for(let i=0;i<=80;i++){const x=x0+(x1-x0)*i/80;let s=0;for(let j=0;j<=40;j++){const t=-6+(x+6)*j/40;s+=Math.exp(-t*t/2)*(j===0||j===40?.5:1)}s*=(x+6)/40/Math.sqrt(2*Math.PI);d+=(i?'L':'M')+F(X(x))+' '+F(122-s*92)}o+=`<path d="${d}" fill="none" stroke="${c('F')}" stroke-width="2"/>`}}
  else if(sp.k==='steps'){let acc=0;const n=sp.v.length,X=i=>30+i*50;o+=`<line x1="14" y1="122" x2="${X(0)}" y2="122" stroke="${c('F')}" stroke-width="2.4"/>`;sp.v.forEach((v,i)=>{acc+=v;const y=122-acc*95;o+=`<line x1="${X(i)}" y1="${F(y)}" x2="${X(i+1)}" y2="${F(y)}" stroke="${c('F')}" stroke-width="2.4"/><circle cx="${X(i)}" cy="${F(y)}" r="3" fill="${c('F')}"/>`})}
  else if(sp.k==='grid'){sp.P.forEach((r,i)=>r.forEach((v,j)=>{o+=`<rect x="${40+j*45}" y="${20+i*45}" width="42" height="42" fill="${c('area')}" fill-opacity="${.15+v*2.5}"/><text x="${61+j*45}" y="${43+i*45}" fill="${c('axis')}" font-size="12" text-anchor="middle" dominant-baseline="middle">${String(v).replace('.',lang()==='ru'?',':'.')}</text>`}))}
  else if(sp.k==='scatter'){let s=7;const rnd=()=>{s=(s*9301+49297)%233280;return s/233280};for(let i=0;i<40;i++){const x=rnd(),y=.8*x+.2*rnd();o+=`<circle cx="${F(20+x*165)}" cy="${F(122-y*100)}" r="2.6" fill="${c('bar')}"/>`}o+=`<line x1="20" y1="118" x2="185" y2="30" stroke="${c('curve')}" stroke-width="2"/>`}
  return`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><rect width="${W}" height="${H}" fill="var(--s-bg)"/>${ax}${o}</svg>`}
function runDemo(id){const d=DEMOS[id];if(!d)return;loadPreset(d.p);showPanel('solve')}
function renderTex(){const ta=$('#xTex');if(!ta)return;if(S.err||!S.res){ta.value='';return}const R=S.res,a=(S.ans||'').replace(/<sub>(.*?)<\/sub>/g,'_$1').replace(/<sup>(.*?)<\/sup>/g,'^$1').replace(/<[^>]+>/g,'');
  if(fmtMode==='txt'){ta.value=`${T()['t_'+S.topic]}\n${a}`;return}
  if(fmtMode==='tex'){ta.value=a.replace(/≈/g,'\\approx ').replace(/⩽/g,'\\le ').replace(/σ/g,'\\sigma ').replace(/√/g,'\\sqrt');return}
  const t=S.topic;let py='from scipy import stats\n';
  if(t==='bern')py+=`n, p = ${R.n}, ${R.p}\nX = stats.binom(n, p)\n`+(R.ev==='mode'?'print(max(range(n+1), key=X.pmf))':`print(X.cdf(${R.k2}) - X.cdf(${(R.ev==='one'?1:R.k1)-1}))  # точно`);
  else if(t==='dsv')py+=`import numpy as np\nx = np.array(${JSON.stringify(R.x)})\np = np.array(${JSON.stringify(R.p.map(v=>+v.toFixed(10)))})\nM = (x*p).sum(); D = (x**2*p).sum() - M**2\nprint(M, D, D**0.5)`;
  else if(t==='dvu')py+=`import numpy as np\nx = np.array(${JSON.stringify(R.J.x)}); y = np.array(${JSON.stringify(R.J.y)})\nP = np.array(${JSON.stringify(R.J.P)})\npx, py = P.sum(1), P.sum(0)\nMx, My = x@px, y@py\ncov = x@P@y - Mx*My\nprint(Mx, My, cov, cov/np.sqrt((x**2@px-Mx**2)*(y**2@py-My**2)))`;
  else if(t==='nsv')py+=`from scipy import integrate\n# M = ∫x f(x)dx, D = ∫x² f(x)dx − M²\nprint(${fT(R.M,6).replace(',','.')}, ${fT(R.D,6).replace(',','.')})`;
  else if(t==='comb'){const k=R.kind;py=`import math\nprint(${k==='perm'?`math.factorial(${R.n})`:k==='arr'?`math.perm(${R.n}, ${R.k})`:k==='comb'?`math.comb(${R.n}, ${R.k})`:k==='arrRep'?`${R.n}**${R.k}`:k==='combRep'?`math.comb(${R.n+R.k-1}, ${R.k})`:k==='permRep'?`math.factorial(${R.n}) // (${R.list.map(v=>`math.factorial(${v})`).join(' * ')})`:R.list.join(' * ')})`}
  else if(t==='clas'){py=R.m==='mn'?`from fractions import Fraction\nprint(Fraction(${R.fav}, ${R.tot}))`:R.m==='dice'?`from itertools import product\nfrom fractions import Fraction\nall_ = list(product(range(1, 7), repeat=${R.s}))\nfav = [r for r in all_ if sum(r) ${R.dev==='eq'?'==':R.dev==='ge'?'>=':'<='} ${R.v}]\nprint(Fraction(len(fav), len(all_)))`:
    `from math import comb\nfrom fractions import Fraction\na = ${JSON.stringify(R.a)}; N, n = ${R.N}, ${R.n}\n`+(R.cev==='exact'?`k = ${JSON.stringify(R.terms[0])}\nm = 1\nfor ai, ki in zip(a, k): m *= comb(ai, ki)\n`:`m = sum(comb(a[0], k) * comb(N - a[0], n - k) for k in range(n + 1) if k ${R.cev==='ge'?'>=':'<='} ${R.kk})\n`)+`print(Fraction(m, comb(N, n)))`}
  else if(t==='ops'){py=R.mode==='two'?`pA, pB, pAB = ${R.pa}, ${R.pb}, ${+R.pab.toFixed(12)}\nprint('P(A+B) =', pA + pB - pAB, 'P(A|B) =', pAB / pB)`:`import numpy as np\np = ${JSON.stringify(R.ps)}\nc = np.array([1.0])\nfor pi in p: c = np.convolve(c, [1 - pi, pi])\nprint(c)  # c[k] = P(ровно k)`}
  else if(t==='bayes'){py=`prior = ${JSON.stringify(R.pr.map(v=>+v.toFixed(12)))}\nlik = ${JSON.stringify(R.L.map(v=>+v.toFixed(12)))}\nPA = sum(p * l for p, l in zip(prior, lik))\nprint(PA, [p * l / PA for p, l in zip(prior, lik)])`}
  else py+=`X = stats.norm(loc=${R.m}, scale=${R.s})\n`+(R.q==='rng'?`print(X.cdf(${R.x2}) - X.cdf(${R.x1}))`:R.q==='lt'?`print(X.cdf(${R.x1}))`:R.q==='gt'?`print(X.sf(${R.x1}))`:R.q==='dev'?`print(X.cdf(${R.m+R.del}) - X.cdf(${R.m-R.del}))`:R.q==='qu'?`print(X.ppf(${R.pv}))`:`print(${R.find==='m'?R.m:R.s})`);
  ta.value=py}
/* ---------- горячие клавиши ---------- */
const KEYS=[['1 – 9','k_topic'],['[ / ]','k_prev'],['G','k_grid'],['F','k_F'],['P','k_ap'],['M','k_sig'],['H','k_hint'],['S','k_png'],['/','k_gloss'],['?','k_keys'],['Esc','k_esc']];
function renderKeys(){const L=T();$('#keysList').innerHTML=KEYS.map(([k,d])=>`<span>${k.split(' ').map((p,i)=>i>0&&/^[+\/–]$/.test(p)?p:`<kbd>${p}</kbd>`).join(' ')}</span><span>${L[d]}</span>`).join('')}
function openKeys(){renderKeys();closeDrawers();openDrawer('dKeys')}
$('#openKeys').onclick=openKeys;$('#openKeys2').onclick=openKeys;

function flip(k){P.show[k]=!P.show[k];syncToggles();save();renderCaption();req();const L=T();toast(`${L.tog[k]}: ${P.show[k]?L.on:L.off}`)}
document.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;const tg=e.target,tag=tg&&tg.tagName;
  if((tag==='INPUT'&&!['checkbox','range','radio','color'].includes(tg.type))||tag==='TEXTAREA'||tag==='SELECT'||(tg&&tg.isContentEditable))return;
  const isQ=e.key==='?'||(e.code==='Slash'&&e.shiftKey);if(document.querySelector('.drawer.open')&&!isQ)return;const c=e.code,L=T();let h=true;
  if(isQ)openKeys();else if(/^(Digit|Numpad)[1-9]$/.test(c)){setTopic(TOPICS[+c.slice(-1)-1]);toast(L['t_'+S.topic])}
  else if(c==='BracketLeft'||c==='BracketRight'){const list=PRE[S.topic];let i=list.findIndex(p=>p[0]===S.preset);i=(i+(c==='BracketLeft'?-1:1)+list.length)%list.length;loadPreset(list[i][0]);toast(lang()==='ru'?list[i][2]:list[i][3])}
  else if(c==='KeyG')flip('bgGrid');else if(c==='KeyF')flip('Fplot');else if(c==='KeyP')flip('approx');else if(c==='KeyM')flip('sigma');else if(c==='KeyH')flip('hints');
  else if(c==='KeyS'){if(canSave())exportPng();else toast(L.xNoDl)}else if(c==='Slash'){$('#openGloss').click();setTimeout(()=>$('#gq').focus(),30)}else h=false;if(h)e.preventDefault()});
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
  $('#resetAll').onclick=()=>{const lg=lang(),rd=P.read,last=P.last;P=clone(DEF);P.lang=lg;P.read=rd||{};P.last=last;syncToggles();applyPrefs();renderAll()};
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
  renderForm();recompute()}
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
buildPanels();buildSettings();applyPrefs();renderForm();applyLang();
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>req());
})();
