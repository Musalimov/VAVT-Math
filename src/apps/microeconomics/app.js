import { SOLVE, fp, solveCap, solveExt, solveLabor, solveMC, solveOlig, solvePG, solvePPF, solveProd } from './solvers/steps.js';
import { COMP, E, compCap, compExt, compLabor, compMC, compOlig, compPG, compPPF, compProd, nI } from './solvers/compute.js';
import { DELTAS, FORMS, GROUPS, PRE, TOPICS, spanP, spanW } from './content/topics.js';
import { PSof, Pof, arcE, argminPos, competitive, consumer, costs, cross, discrim3, elastAt, extern, fvAnn, fxy, hhi, irr, linPQ, market, minCost, monopoly, monopsony, nper, npv, oligo2, pmt, ppf, prodLong, pvAnn, qof, roots1, rts, shiftUp, slutsky } from './solvers/model.js';
import { CHAP, DEMOS, FORMAL, ILL, REL, TERMS, T_ } from './content/glossary.js';
import { T, TX, TXM2 } from './content/tx.js';
import { $, clone } from '../../shared/dom.js';
import { dc } from '../../shared/format.js';
import { lang, langFrom } from '../../shared/i18n.js';
import { fN, fV, fmt } from '../../shared/format.js';
import { TXB } from '../../shared/econ/txb.js';
import { exprXY, numG } from '../../shared/econ/expr-xy.js';
(()=>{
'use strict';
/* ---------- выражения от двух переменных x, y ---------- */


/* ---------- микроэкономика: математика ---------- */
// линейная связь P и q из строки вида "P = 20 - 2q", "q = 6000 - 50P", "Qd = 100 - 2P", "2P + q = 40"





// излишки: точные интегралы кусочно-линейных функций




/* эластичность линейного спроса */


/* потребитель */




/* издержки: VC(q) как функция */







/* ---------- часть 2 ---------- */

/* КПВ по таблице альтернатив */

/* производство */




/* олигополия: P = a - bQ, TCi = ci q + di q^2 */


/* рынок труда */


/* капитал */



/* внешние эффекты и общественные блага */
















let LNG='ru';
const KEY='micro-viz-v1';

const PAL={
  classic:{bg:'#0b0c10',bgGrid:'#262b33',axis:'#f2f2f2',p1:'#58c4dd',p2:'#ff9f43',eq:'#f4d345',area:'#83c167',curve:'#ff7aa8',mark:'#c77dff',bad:'#fc6255'},
  paper:{bg:'#fbfaf7',bgGrid:'#e3e1da',axis:'#23262b',p1:'#2b6cb0',p2:'#e67e22',eq:'#c98a00',area:'#3f9a3a',curve:'#c0398b',mark:'#8e44ad',bad:'#d1453b'},
  neon:{bg:'#07020f',bgGrid:'#1f1533',axis:'#ffffff',p1:'#4dd2ff',p2:'#ffa53d',eq:'#fff35c',area:'#39ff88',curve:'#ff9ecf',mark:'#a98bff',bad:'#ff4d6d'},
  nord:{bg:'#2e3440',bgGrid:'#3b4252',axis:'#eceff4',p1:'#88c0d0',p2:'#d08770',eq:'#ebcb8b',area:'#a3be8c',curve:'#e5a0c0',mark:'#b48ead',bad:'#bf616a'}};

const PANELS=['topic','presets','solve','factors','values','show','export'];
const DEF={palette:'classic',colors:{...PAL.classic},dock:'auto',width:380,bottomH:46,ui:'auto',font:100,speed:1,lw:1,order:PANELS.slice(),collapsed:{export:true},read:{},float:{x:12,y:12},
  show:{bgGrid:true,coords:true,labels:true,areas:true,hints:true},topic:'sd',inp:null,preset:null};

function load(){let r=null;try{r=JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){}const p=clone(DEF);if(!r||typeof r!=='object')return p;
  Object.assign(p,r);p.colors={...DEF.colors,...(r.colors||{})};p.show={...DEF.show,...(r.show||{})};const ord=Array.isArray(r.order)?r.order.filter(x=>PANELS.includes(x)):[];PANELS.forEach(x=>{if(!ord.includes(x))ord.push(x)});p.order=ord;p.collapsed=r.collapsed||{};p.float=r.float||{x:12,y:12};
  /* защита от повреждённых/старых настроек: числа — в пределах ползунков, иначе по умолчанию */const RNG={width:[240,560],bottomH:[25,75],font:[80,130],speed:[.25,3],lw:[.5,2.5]};for(const k in RNG){const v=p[k],[a,b]=RNG[k];p[k]=typeof v==='number'&&isFinite(v)?Math.min(b,Math.max(a,v)):DEF[k]}if(!p.float||typeof p.float!=='object'||!isFinite(p.float.x)||!isFinite(p.float.y))p.float={x:12,y:12};if(!p.collapsed||typeof p.collapsed!=='object'||Array.isArray(p.collapsed))p.collapsed={};return p}
let P=load();langFrom(()=>P.lang);if(!P.lang)P.lang=(navigator.language||'').toLowerCase().startsWith('ru')?'ru':'en';let saveT=0;
function save(){clearTimeout(saveT);saveT=setTimeout(()=>{try{localStorage.setItem(KEY,JSON.stringify(P))}catch(e){}},250)}



/* ---------- примеры (задачи Серякова, ВАВТ) ---------- */






const q4=v=>dc(String(+(+v).toFixed(4)));

const SHOCKS={
 sd:[{id:'inc',ru:'Рост доходов (нормальное благо)',en:'Higher incomes (normal good)',c:'D вправо',cen:'D right',set:I=>({shD:q4(spanP(I))})},{id:'incI',ru:'Рост доходов (низшее благо)',en:'Higher incomes (inferior good)',c:'D влево',cen:'D left',set:I=>({shD:q4(-spanP(I))})},
  {id:'sub',ru:'Подорожание товара-заменителя',en:'A substitute gets pricier',c:'D вправо',cen:'D right',set:I=>({shD:q4(spanP(I))})},{id:'comp',ru:'Подорожание товара-дополнителя',en:'A complement gets pricier',c:'D влево',cen:'D left',set:I=>({shD:q4(-spanP(I))})},
  {id:'exp',ru:'Ожидание роста цен',en:'Expected future price rise',c:'D вправо',cen:'D right',set:I=>({shD:q4(spanP(I))})},{id:'buy',ru:'Рост числа покупателей',en:'More buyers',c:'D вправо',cen:'D right',set:I=>({shD:q4(spanP(I))})},
  {id:'cost',ru:'Подорожание ресурсов',en:'Inputs get pricier',c:'S влево (вверх)',cen:'S left (up)',set:I=>({shS:q4(spanP(I))})},{id:'tech',ru:'Новая технология',en:'New technology',c:'S вправо (вниз)',cen:'S right (down)',set:I=>({shS:q4(-spanP(I))})},
  {id:'sel',ru:'Рост числа продавцов',en:'More sellers',c:'S вправо',cen:'S right',set:I=>({shS:q4(-spanP(I))})},{id:'both',ru:'Рост доходов и новая технология',en:'Higher incomes and new technology',c:'D и S вправо: q растёт, направление P зависит от силы сдвигов',cen:'D and S right: q rises, the direction of P depends on the size of the shifts',set:I=>({shD:q4(spanP(I)),shS:q4(-spanP(I))})}],
 cons:[{id:'inc',ru:'Рост дохода I',en:'Higher income I',c:'бюджетная линия параллельно вправо',cen:'budget line shifts out',set:I=>({dI:q4(nI(I.I)*.3)})},{id:'incd',ru:'Снижение дохода I',en:'Lower income I',c:'бюджетная линия параллельно влево',cen:'budget line shifts in',set:I=>({dI:q4(-nI(I.I)*.3)})},
  {id:'pxd',ru:'Удешевление X',en:'X gets cheaper',c:'бюджетная линия поворачивается наружу',cen:'budget line rotates out',set:I=>({px2:q4(nI(I.px)*.7)})},{id:'pxu',ru:'Подорожание X',en:'X gets pricier',c:'бюджетная линия поворачивается внутрь',cen:'budget line rotates in',set:I=>({px2:q4(nI(I.px)*1.5)})}],
 labor:[{id:'p',ru:'Рост цены продукции',en:'Higher output price',c:'спрос на труд (MRP) вправо',cen:'labor demand (MRP) right',set:I=>({dDl:q4(spanW(I))})},{id:'tech',ru:'Рост производительности',en:'Higher productivity',c:'спрос на труд вправо',cen:'labor demand right',set:I=>({dDl:q4(spanW(I))})},
  {id:'imm',ru:'Иммиграция',en:'Immigration',c:'предложение труда вправо',cen:'labor supply right',set:I=>({dSl:q4(-spanW(I))})},{id:'alt',ru:'Рост заработков в других отраслях',en:'Higher pay in other industries',c:'предложение труда влево',cen:'labor supply left',set:I=>({dSl:q4(spanW(I))})}]};

const EFFV={sd:(R,b)=>({P:R.E.P,q:R.E.q,CS:R.CS,PS:R.PS}),cons:(R,b)=>{const x=b?R.A:(R.B||R.A);return{x:x.x,y:x.y,U:x.U}},labor:(R,b)=>R.lm==='mkt'?{w:R.E.P,L:R.E.q,[P.lang==='ru'?'рента':'rent']:R.rent}:{}};





const S={topic:TOPICS.includes(P.topic)?P.topic:'sd',inp:{},res:null,err:null,preset:P.preset||null,stamp:false,anyAnim:false};
TOPICS.forEach(t=>{S.inp[t]=clone(PRE[t][0][1])});if(P.inp)for(const t of TOPICS)if(P.inp[t])S.inp[t]={...S.inp[t],...P.inp[t]};
function renderForm(){const box=$('#form'),L=T(),t=S.topic,I=S.inp[t];box.innerHTML='';
  for(const[k,type,a,b]of FORMS[t]){const show=typeof a==='function'?a:typeof b==='function'?b:null;if(show&&!show(I))continue;
    const l=document.createElement('label');l.textContent=L.f[k]||k;if(type==='txt')l.className='full';box.appendChild(l);let el;
    if(type==='txt'){el=document.createElement('textarea');el.spellcheck=false}else if(type==='sel'){el=document.createElement('select');for(const o of a){const op=document.createElement('option');op.value=o;op.textContent=(L.opt[k]||{})[o]||o;el.appendChild(op)}}
    else{el=document.createElement('input');el.type='text';el.spellcheck=false;el.autocomplete='off'}el.value=I[k]==null?'':I[k];el.dataset.k=k;box.appendChild(el)}
  buildTopics()}
function buildTopics(){const L=T(),box=$('#topicBox');box.innerHTML=GROUPS.map(([g,ts])=>`<div class="tg"><div class="tgl">${L.grp[g]}</div><div class="seg">${ts.map(t=>`<button data-t="${t}" class="${t===S.topic?'on':''}" title="${L.tt[t]||''}">${L['t_'+t]}</button>`).join('')}</div></div>`).join('')}
document.addEventListener('click',e=>{const b=e.target.closest('#topicBox button[data-t]');if(b)setTopic(b.dataset.t)});
let fT0=0;$('#form').addEventListener('input',e=>{const k=e.target.dataset.k;if(!k)return;S.inp[S.topic][k]=e.target.value;S.preset=null;S.shock=null;if(e.target.tagName==='SELECT'){renderForm();recompute();return}clearTimeout(fT0);fT0=setTimeout(recompute,250)});
function setTopic(t){if(!TOPICS.includes(t))return;S.topic=t;P.topic=t;S.preset=null;save();renderForm();recompute()}
function loadPreset(id){for(const t of TOPICS){const p=PRE[t].find(z=>z[0]===id);if(p){S.topic=t;P.topic=t;S.inp[t]={...S.inp[t],...clone(p[1])};S.preset=id;S.shock=null;renderForm();recompute();return}}}
/* ---------- вычисления ---------- */























function recompute(){const t=S.topic,I=S.inp[t];S.err=null;S.res=null;try{S.res=COMP[t](I)}catch(e){if(e instanceof Error)console.error(e);S.err=e instanceof Error?{msg:'bug'}:e&&e.msg?e:{msg:'num'}}P.inp=S.inp;P.preset=S.preset;save();renderAll()}
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
const ol=a=>`<ol class="stp">${a.filter(Boolean).map(s=>`<li>${s}</li>`).join('')}</ol>`;
function renderSolve(){const box=$('#solve'),L=T();if(S.err){box.innerHTML=`<p class="note err">${L.err[S.err.msg]||L.err.num}</p>`;S.ans='';return}const r=SOLVE[S.topic](S.res);S.ans=r.ans;
  box.innerHTML=`<p class="idea">${L.tt[S.topic]}</p>${typeof shockNote==='function'?shockNote():''}${ol(r.st)}<div class="ans"><div class="k">${L.ans}</div><div class="big">${r.ans}</div></div>`}
function prop(k,v){return`<div class="prop"><span class="k">${k}</span><span class="v">${v}</span></div>`}
/* ---------- решения ---------- */








function shockNote(){const t=S.topic;if(!S.shock||!SHOCKS[t])return'';const sh=SHOCKS[t].find(s=>s.id===S.shock);return sh?`<p class="idea"><b>${sh[P.lang]||sh.ru}:</b> ${(P.lang==='en'?sh.cen:sh.c)}</p>`:''}
function renderValues(){const box=$('#props'),V=T().v;if(S.err||!S.res){box.innerHTML='';return}const R=S.res,t=S.topic;let h='';
  if(VALS2[t])h=VALS2[t](R,V);
  else if(t==='sd'){h=prop('q*',fp(R.E.q))+prop('P*',fp(R.E.P))+prop(V.CS,fp(R.CS))+prop(V.PS,fp(R.PS));if(R.DWL!=null)h+=prop(V.DWL,fp(R.DWL))}
  else if(t==='el'){h=R.em==='pts'?prop('E',fN(R.E,4)):prop('P (|E| = 1)',fp(R.Pmid))+prop('TR max',fp(R.TRmax))+(R.E!=null?prop('E',fN(R.E,4)):'')+(R.Earc!=null?prop(V.arc,fN(R.Earc,4)):'')}
  else if(t==='cons'){h=prop('x*',fp(R.A.x))+prop('y*',fp(R.A.y))+prop('U',fp(R.A.U));if(R.px2)h+=prop(V.sub,fp(R.subH))+prop(V.inc,fp(R.incH))}
  else if(t==='cost')h=prop('min AVC',`${fp(R.mAVC.v)} (q = ${fp(R.mAVC.q)})`)+prop('min AC',`${fp(R.mAC.v)} (q = ${fp(R.mAC.q)})`)+prop('min MC',`${fp(R.mMC.v)} (q = ${fp(R.mMC.q)})`);
  else if(t==='comp')h=prop('q*',fp(R.q))+prop(V.profit,fp(R.profit))+prop(V.shutP,fp(R.minAVC.v))+prop(V.beP,fp(R.minAC.v));
  else h=R.dm==='disc'?prop('P₁',fp(R.r1.P))+prop('P₂',fp(R.r2.P))+prop(V.profit,fp(R.pr1+R.pr2)):prop('q',fp(R.q))+prop('P',fp(R.P))+prop(V.profit,fp(R.profit))+prop(V.lerner,fN(R.lerner,4))+prop(V.DWL,fp(R.DWL));
  box.innerHTML=h}
function capKey(){return S.topic}
function relTogs(){const t=S.topic,G=['bgGrid','coords'];const m={sd:[...G,'labels','areas'],el:[...G,'labels','areas'],cons:[...G,'labels'],cost:[...G,'labels'],comp:[...G,'labels','areas'],mono:[...G,'labels','areas'],ppf:[...G,'labels','areas'],prod:[...G,'labels'],mc:[...G,'labels'],olig:[...G,'labels'],labor:[...G,'labels','areas'],cap:[...G,'labels'],ext:[...G,'labels','areas'],pg:[...G,'labels']};return[...(m[t]||[]),'hints']}

/* ---------- часть 2: решения ---------- */









const VALS2={ppf:(R,V)=>prop(V.inc2,R.incr?V.yes:V.no)+(R.where?prop(V.pt,T().f_ans[R.where]):''),prod:(R,V)=>R.pm==='short'?(R.apMax<R.Lmax*.01?'':prop('max AP',`L = ${fp(R.apMax)}`))+(R.mpZero!=null?prop('MP = 0',`L = ${fp(R.mpZero)}`):''):prop('L',fp(R.L))+prop('K',fp(R.K))+(R.q!=null?prop('q',fp(R.q)):prop('TC',fp(R.C))),
 mc:(R,V)=>prop('q',fp(R.q))+prop('P',fp(R.P))+prop(V.profit,fp(R.profit))+prop(V.excess,fp(R.excess)),olig:(R,V)=>R.om==='hhi'?prop('HHI',fp(R.H)):prop('q₁',fp(R.sel.q[0]))+prop('q₂',fp(R.sel.q[1]))+prop('P',fp(R.sel.P)),
 labor:(R,V)=>R.lm==='firm'?prop('L',fp(R.L))+prop('q',fp(R.q)):R.lm==='mkt'?prop('L',fp(R.E.q))+prop('w',fp(R.E.P))+prop(V.rent2,fp(R.rent)):prop('L',fp(R.L))+prop('w',fp(R.w))+prop('MRP',fp(R.mrp)),
 cap:(R,V)=>prop(V.res,fp(R.v))+(R.irr!=null?prop('IRR',fN(R.irr*100,3)+'%'):''),ext:(R,V)=>prop(V.qm,fp(R.m.q))+prop(V.qs,fp(R.s.q))+prop(V.DWL,fp(R.DWL)),pg:(R,V)=>prop('q*',fp(R.qPub))};

function renderPresets(){const box=$('#pre');box.innerHTML='';PRE[S.topic].forEach(([id,,ru,en])=>{const b=document.createElement('button');b.className='chip'+(S.preset===id?' on':'');b.dataset.pre=id;b.textContent=P.lang==='ru'?ru:en;box.appendChild(b)})}
function renderOverlay(){const ov=$('#ov'),L=T();if(S.err||!S.res){ov.innerHTML=`<span class="tt">${L.cap.err}</span>`;return}ov.innerHTML=`<span>${S.ans||''}</span><span class="tt">${L['t_'+S.topic]}</span>`}
function renderCaption(){const cap=$('#cap');$('#capOpen').hidden=!!P.show.hints;if(!P.show.hints){cap.hidden=true;return}cap.hidden=false;$('#capT').textContent=S.err?T().cap.err:T().cap[capKey()]}
function syncTogVis(){const r=relTogs();document.querySelectorAll('#tog label').forEach(l=>{l.style.display=r.includes(l.querySelector('input').dataset.k)?'':'none'})}
function renderAll(){syncTogVis();if(typeof renderFactors==='function')renderFactors();renderSolve();renderValues();renderPresets();renderOverlay();renderCaption();renderTex();const fe=$('#fErr');fe.hidden=!S.err;if(S.err)fe.textContent=T().err[S.err.msg]||T().err.num;req()}
/* ---------- сцена ---------- */
const cv=$('#cv'),ctx=cv.getContext('2d'),stage=$('#stage'),main=$('#main'),side=$('#side');let W=0,H=0,DPR=1,raf=0;
new ResizeObserver(()=>{const r=stage.getBoundingClientRect();W=r.width;H=r.height;DPR=Math.min(2,window.devicePixelRatio||1);cv.width=Math.max(1,Math.round(W*DPR));cv.height=Math.max(1,Math.round(H*DPR));req()}).observe(stage);
function req(){if(!raf)raf=requestAnimationFrame(()=>{raf=0;renderNow()})}
function niceStep(raw){const p=Math.pow(10,Math.floor(Math.log10(raw))),m=raw/p;return(m<1.5?1:m<3.5?2:m<7.5?5:10)*p}
function txt(s,x,y,col,sz=12,al='center',bl='middle',it=false){ctx.font=`${it?'italic ':''}600 ${sz}px "Source Serif 4", Georgia, serif`;ctx.textAlign=al;ctx.textBaseline=bl;ctx.lineWidth=3;ctx.strokeStyle=P.colors.bg;ctx.lineJoin='round';ctx.strokeText(s,x,y);ctx.fillStyle=col;ctx.fillText(s,x,y)}
function frame(r,x0,x1,y0,y1,eq,ttl,noX){const c=P.colors;let sx=r.w/(x1-x0),sy=r.h/(y1-y0);if(eq){const s=Math.min(sx,sy);sx=sy=s}const X=x=>r.x+(x-x0)*sx,Y=y=>r.y+r.h-(y-y0)*sy;
  const st=niceStep((x1-x0)/Math.max(2,r.w/80)),sty=eq?st:niceStep((y1-y0)/Math.max(2,r.h/55));const xe=x0+r.w/sx,ye=y0+r.h/sy;
  if(P.show.bgGrid){ctx.strokeStyle=c.bgGrid;ctx.lineWidth=1;ctx.beginPath();for(let x=Math.ceil(x0/st)*st;x<=xe+1e-9;x+=st){ctx.moveTo(X(x)+.5,r.y);ctx.lineTo(X(x)+.5,Y(y0))}for(let y=Math.ceil(y0/sty)*sty;y<=ye+1e-9;y+=sty){ctx.moveTo(r.x,Y(y)+.5);ctx.lineTo(X(xe),Y(y)+.5)}ctx.stroke()}
  ctx.strokeStyle=c.axis;ctx.globalAlpha=.6;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(X(x0),Y(Math.max(0,y0)));ctx.lineTo(X(xe),Y(Math.max(0,y0)));ctx.moveTo(X(Math.max(0,x0)),Y(y0));ctx.lineTo(X(Math.max(0,x0)),Y(ye));ctx.stroke();ctx.globalAlpha=1;
  if(P.show.coords){ctx.fillStyle=c.axis;ctx.globalAlpha=.7;ctx.font='500 11px Manrope, system-ui, sans-serif';ctx.textAlign='center';ctx.textBaseline='top';const dx=Math.max(0,-Math.floor(Math.log10(st)));if(!noX)for(let x=Math.ceil(x0/st)*st;x<=xe+1e-9;x+=st)ctx.fillText(dc(fmt(x,dx)),X(x),Y(Math.max(0,y0))+4);
    ctx.textAlign='right';ctx.textBaseline='middle';const dy=Math.max(0,-Math.floor(Math.log10(sty)));for(let y=Math.ceil(y0/sty)*sty;y<=ye+1e-9;y+=sty){if(Math.abs(y)<sty/2)continue;ctx.fillText(dc(fmt(y,dy)),X(Math.max(0,x0))-4,Y(y))}ctx.globalAlpha=1}
  if(ttl)txt(ttl,r.x+6,r.y+8,c.axis,13,'left','middle',true);return{X,Y,r}}
function seg(fr,a,b,col,w=2,dash){ctx.strokeStyle=col;ctx.lineWidth=w*P.lw;ctx.setLineDash(dash||[]);ctx.beginPath();ctx.moveTo(fr.X(a[0]),fr.Y(a[1]));ctx.lineTo(fr.X(b[0]),fr.Y(b[1]));ctx.stroke();ctx.setLineDash([])}
function dotP(fr,p,col,r=6,lab){const X=fr.X(p[0]),Y=fr.Y(p[1]);ctx.fillStyle=col;ctx.strokeStyle=P.colors.bg;ctx.lineWidth=2;ctx.beginPath();ctx.arc(X,Y,r,0,7);ctx.fill();ctx.stroke();if(lab)txt(lab,X+10,Y-12,col,14,'left')}
const pT=()=>Math.min(100,H*.17),pB=()=>Math.min(70,H*.12);
function renderNow(){DRAGS.length=0;ctx.setTransform(DPR,0,0,DPR,0,0);ctx.fillStyle=P.colors.bg;ctx.fillRect(0,0,W,H);if(!S.res||S.err||!W)return;({sd:drawSD,el:drawEl,cons:drawCons,cost:drawCost,comp:drawComp,mono:drawMono,...DRAW2})[S.topic](S.res);
  if(S.stamp){const t=(S.ans||'').replace(/<[^>]+>/g,'');ctx.font='600 15px "Source Serif 4", Georgia, serif';const w=ctx.measureText(t).width+20;ctx.fillStyle=P.colors.bg;ctx.globalAlpha=.85;ctx.fillRect(W-w-12,H-38,w,28);ctx.globalAlpha=1;ctx.fillStyle=P.colors.axis;ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(t,W-w-2,H-24)}}
const RR=()=>({x:64,y:pT(),w:W-110,h:H-pT()-pB()});
function polyF(fr,pts,col,al){if(!P.show.areas||pts.length<3)return;ctx.save();ctx.beginPath();ctx.rect(fr.r.x,fr.r.y,fr.r.w,fr.r.h);ctx.clip();ctx.beginPath();pts.forEach((p,i)=>{const X=fr.X(p[0]),Y=fr.Y(p[1]);i?ctx.lineTo(X,Y):ctx.moveTo(X,Y)});ctx.closePath();ctx.fillStyle=col;ctx.globalAlpha=al;ctx.fill();ctx.globalAlpha=1;ctx.restore()}
function curve(fr,f,x0,x1,col,w=2.4,dash){ctx.save();ctx.beginPath();ctx.rect(fr.r.x-2,fr.r.y-2,fr.r.w+4,fr.r.h+4);ctx.clip();ctx.strokeStyle=col;ctx.lineWidth=w*P.lw;ctx.setLineDash(dash||[]);ctx.beginPath();let pen=false;for(let i=0;i<=600;i++){const x=x0+(x1-x0)*i/600,y=f(x);if(!isFinite(y)||Math.abs(y)>1e9){pen=false;continue}const X=fr.X(x),Y=Math.max(-1e5,Math.min(1e5,fr.Y(y)));pen?ctx.lineTo(X,Y):ctx.moveTo(X,Y);pen=true}ctx.stroke();ctx.setLineDash([]);ctx.restore()}
function lab(fr,x,y,s,col,al='left'){if(P.show.labels)txt(s,fr.X(x)+(al==='left'?8:-8),fr.Y(y)-10,col,13,al)}
function hline(fr,y,x0,x1,col,dash=[5,4]){ctx.strokeStyle=col;ctx.lineWidth=1.4;ctx.setLineDash(dash);ctx.beginPath();ctx.moveTo(fr.X(x0),fr.Y(y));ctx.lineTo(fr.X(x1),fr.Y(y));ctx.stroke();ctx.setLineDash([])}
function vline2(fr,x,y0,y1,col,dash=[5,4]){ctx.strokeStyle=col;ctx.lineWidth=1.4;ctx.setLineDash(dash);ctx.beginPath();ctx.moveTo(fr.X(x),fr.Y(y0));ctx.lineTo(fr.X(x),fr.Y(y1));ctx.stroke();ctx.setLineDash([])}
function drawSD(R){const c=P.colors,D=R.D,Sp=R.S;const qD=D.kind==='lin'?-D.a/D.b:R.E.q*2;const qx=Math.max(qD,R.E.q*1.6,R.qd||0,R.qs||0)*1.08;const Pm=Math.max(D.kind==='lin'?D.a:R.E.P*2,R.Pb||0,R.E.P*1.5)*1.08;
  const fr=frame(RR(),0,qx,0,Pm,false,'P ↑   q →');const Dq=q=>Pof(D,q),Sq=q=>Math.max(0,Pof(Sp,q));const E=R.E;
  if(R.iv==='tax'||R.iv==='sub'){const q=R.q2,Pb=R.Pb,Ps=R.Ps;polyF(fr,[[0,D.a],[0,Pb],[q,Pb]],c.p1,.28);polyF(fr,[[0,Ps],[q,Ps],...psPts(Sp,q,Ps)],c.p2,.28);polyF(fr,[[0,Pb],[q,Pb],[q,Ps],[0,Ps]],c.mark,.25);polyF(fr,[[q,Pb],[q,Ps],[E.q,E.P]],c.bad,.45)}
  else if((R.iv==='ceil'||R.iv==='floor'||R.iv==='quota')&&R.bind){const q=R.q2,Pp=R.iv==='quota'?R.Pb:R.P2;polyF(fr,[[0,D.a],[0,Pp],[q,Pp]],c.p1,.28);polyF(fr,[[0,Pp],[q,Pp],...psPts(Sp,q,Pp)],c.p2,.28);polyF(fr,[[q,Dq(q)],[q,Sq(q)],[E.q,E.P]],c.bad,.45)}
  else if(D.kind==='lin'){polyF(fr,[[0,D.a],[0,E.P],[E.q,E.P]],c.p1,.28);polyF(fr,[[0,E.P],[E.q,E.P],...psPts(Sp,E.q,E.P)],c.p2,.28)}
  const line=(L,col,dash)=>{if(L.kind==='vert'){vline2(fr,L.q0,0,Pm,col,dash||[]);return}curve(fr,q=>Pof(L,q),0,qx,col,2.6,dash)};if(R.D0&&P.show.areas){if(R.shD)curve(fr,q=>Pof(R.D0,q),0,qx,c.p1,1.4,[4,5]);if(R.shS)curve(fr,q=>Pof(R.S0,q),0,qx,c.p2,1.4,[4,5]);dotP(fr,[R.E0.q,R.E0.P],c.axis,4,P.show.labels?'E₀':'')}line(D,c.p1);line(Sp,c.p2);
  if(D.kind==='lin')addDrag(fr,'fy',q=>Pof(D,q),'shD',1);if(Sp.kind==='lin'||Sp.kind==='horiz')addDrag(fr,'fy',q=>Pof(Sp,q),'shS',1);if(R.S2)line(R.S2,c.p2,[7,5]);
  lab(fr,qx*.02,Pof(D,qx*.02),'D',c.p1);lab(fr,qx*.9,Pof(Sp,qx*.9),'S',c.p2);if(R.S2)lab(fr,qx*.8,Pof(R.S2,qx*.8),R.iv==='tax'?'S + t':'S − s',c.p2);
  hline(fr,E.P,0,E.q,c.axis);vline2(fr,E.q,0,E.P,c.axis);dotP(fr,[E.q,E.P],c.eq,6,P.show.labels?`E (${dc(fmt(E.q,2))}; ${dc(fmt(E.P,2))})`:'E');
  if(R.iv==='ceil'||R.iv==='floor'){hline(fr,R.v,0,qx,c.mark,[]);lab(fr,qx*.98,R.v,R.iv==='ceil'?'Pmax':'Pmin',c.mark,'right');if(R.bind){dotP(fr,[R.qs,R.v],c.p2,4);dotP(fr,[R.qd,R.v],c.p1,4);if(P.show.labels)txt(`${R.iv==='ceil'?(P.lang==='ru'?'дефицит':'shortage'):(P.lang==='ru'?'избыток':'surplus')} ${dc(fmt(R.gap,2))}`,fr.X((R.qs+R.qd)/2),fr.Y(R.v)+(R.iv==='ceil'?18:-18),c.mark,13)}}
  if(R.q2!=null&&(R.iv==='tax'||R.iv==='sub'||R.iv==='quota')){dotP(fr,[R.q2,R.Pb],c.p1,5,P.show.labels?(P.lang==='ru'?'P пок':'P buy'):'');dotP(fr,[R.q2,R.Ps],c.p2,5,P.show.labels?(P.lang==='ru'?'P прод':'P sell'):'')}}
function psPts(S,q,Ps){if(S.kind==='horiz')return[[q,S.P0],[0,S.P0]];const z=S.kind==='lin'?-S.a/S.b:0;if(S.kind==='lin'&&S.a<0&&z>0&&z<q)return[[q,Pof(S,q)],[z,0],[0,0]];if(S.kind==='lin')return[[q,Pof(S,q)],[0,Math.max(0,S.a)]];return[[q,0],[0,0]]}
function drawEl(R){const c=P.colors;if(R.em==='pts'){const fr=frame(RR(),0,Math.max(R.q1,R.q2)*1.3,0,Math.max(R.x1,R.x2)*1.3,false,(R.ek==='price'?'P':R.ek==='inc'?'I':'P_y')+' ↑   q →');seg(fr,[R.q1,R.x1],[R.q2,R.x2],c.curve,2.6);dotP(fr,[R.q1,R.x1],c.p1,6,'1');dotP(fr,[R.q2,R.x2],c.p1,6,'2');if(P.show.labels)txt(`E = ${dc(fmt(R.E,3))}`,fr.X((R.q1+R.q2)/2)+14,fr.Y((R.x1+R.x2)/2),c.eq,16,'left');return}
  const r=RR(),h1=r.h*.58,r1={x:r.x,y:r.y,w:r.w,h:h1},r2={x:r.x,y:r.y+h1+28,w:r.w,h:r.h-h1-28};const fr=frame(r1,0,R.qmax*1.05,0,R.a*1.08,false,'P ↑   q →');
  ctx.strokeStyle=c.p1;ctx.lineWidth=3*P.lw;ctx.beginPath();ctx.moveTo(fr.X(0),fr.Y(R.a));ctx.lineTo(fr.X(R.qmid),fr.Y(R.Pmid));ctx.stroke();ctx.strokeStyle=c.p2;ctx.beginPath();ctx.moveTo(fr.X(R.qmid),fr.Y(R.Pmid));ctx.lineTo(fr.X(R.qmax),fr.Y(0));ctx.stroke();
  if(P.show.labels){txt('|E| > 1',fr.X(R.qmid*.45)+18,fr.Y(R.a-(R.a-R.Pmid)*.45),c.p1,13,'left');txt('|E| < 1',fr.X(R.qmid*1.5)+18,fr.Y(R.Pmid*.5),c.p2,13,'left')}dotP(fr,[R.qmid,R.Pmid],c.eq,5,P.show.labels?'|E| = 1':'');
  const pts=R.em==='arc'?[[R.q1,R.p1],[R.q2,R.p2]]:[[R.q,R.P]];pts.forEach(([q,p])=>{hline(fr,p,0,q,c.axis);vline2(fr,q,0,p,c.axis);dotP(fr,[q,p],c.mark,6);if(P.show.areas&&R.em!=='find'){ctx.fillStyle=c.mark;ctx.globalAlpha=.12;ctx.fillRect(fr.X(0),fr.Y(p),fr.X(q)-fr.X(0),fr.Y(0)-fr.Y(p));ctx.globalAlpha=1}});
  const f2=frame(r2,0,R.qmax*1.05,0,R.TRmax*1.2,false,'TR(q)');curve(f2,q=>q*Pof(R.D,q),0,R.qmax,c.area,2.6);dotP(f2,[R.qmid,R.TRmax],c.eq,5,P.show.labels?'TR max':'');pts.forEach(([q,p])=>dotP(f2,[q,q*p],c.mark,5))}
function drawCons(R){const c=P.colors,A=R.A;const xm=Math.max(R.I/R.px,R.px2?R.I/R.px2:0,R.Is&&R.px2?R.Is/R.px2:0,R.H?R.H.x:0)*1.12,ym=Math.max(R.I/R.py,R.Is?R.Is/R.py:0,R.H?R.H.y:0)*1.12;
  const fr=frame(RR(),0,xm,0,ym,false,'y ↑   x →');const bud=(Iv,px,col,dash)=>seg(fr,[0,Iv/R.py],[Iv/px,0],col,2.4,dash);
  const ic=(U,col,dash)=>{if(R.t==='cd'){curve(fr,x=>Math.pow(U/Math.pow(x,R.al),1/R.be),xm*.01,xm,col,2,dash)}else if(R.t==='sub'){seg(fr,[0,U/R.be],[U/R.al,0],col,2,dash)}else{const x0=U/R.al,y0=U/R.be;seg(fr,[x0,ym],[x0,y0],col,2,dash);seg(fr,[x0,y0],[xm,y0],col,2,dash)}};
  if(R.A0&&P.show.labels){seg(fr,[0,R.I0/R.py],[R.I0/R.px,0],c.p2,1.4,[4,5]);dotP(fr,[R.A0.x,R.A0.y],c.axis,4,'A₀')}bud(R.I,R.px,c.p2);ic(A.U,c.p1);addDrag(fr,'fy',x=>(R.I-R.px*x)/R.py,'dI',R.py);dotP(fr,[A.x,A.y],c.eq,6,P.show.labels?`A (${dc(fmt(A.x,2))}; ${dc(fmt(A.y,2))})`:'A');
  if(R.px2){bud(R.I,R.px2,c.p2,[7,5]);ic(R.B.U,c.p1,[6,4]);dotP(fr,[R.B.x,R.B.y],c.eq,6,P.show.labels?`B (${dc(fmt(R.B.x,2))}; ${dc(fmt(R.B.y,2))})`:'B');bud(R.H.I,R.px2,c.mark,[3,4]);dotP(fr,[R.H.x,R.H.y],c.mark,6,P.show.labels?'C':'C');
    if(P.show.labels){const y0=fr.Y(0)+26;const arrow=(a,b,col,l)=>{ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(fr.X(a),y0);ctx.lineTo(fr.X(b),y0);ctx.stroke();txt(l,(fr.X(a)+fr.X(b))/2,y0+12,col,11)};}}
  if(P.show.labels)txt(`MRS = ${R.t==='cd'?dc(fmt(R.MRS,3)):'—'}, px/py = ${dc(fmt(R.px/R.py,3))}`,fr.r.x+fr.r.w-6,fr.r.y+10,c.axis,12,'right')}
function drawCost(R){const c=P.colors,C=R.C,qm=R.qmax;const r=RR(),h1=r.h*.56,r1={x:r.x,y:r.y,w:r.w,h:h1},r2={x:r.x,y:r.y+h1+28,w:r.w,h:r.h-h1-28};
  const ymax=Math.max(R.mAC.v,R.mAVC.v,C.MC(R.mAC.q))*2.6||1;const fr=frame(r1,0,qm,0,ymax,false,P.lang==='ru'?'средние и предельные':'average and marginal');
  curve(fr,C.MC,qm*.005,qm,c.bad,2.6);curve(fr,C.AC,qm*.01,qm,c.p1,2.6);curve(fr,C.AVC,qm*.005,qm,c.p2,2.4);if(R.FC>0)curve(fr,C.AFC,qm*.02,qm,c.mark,1.6,[5,4]);
  dotP(fr,[R.mAVC.q,R.mAVC.v],c.p2,5,P.show.labels?'min AVC':'');dotP(fr,[R.mAC.q,R.mAC.v],c.p1,5,P.show.labels?'min AC':'');
  if(P.show.labels){const lq=qm*.92;txt('MC',fr.X(lq),fr.Y(C.MC(lq))-10,c.bad,13);txt('AC',fr.X(lq),fr.Y(C.AC(lq))+12,c.p1,13);txt('AVC',fr.X(lq)-30,fr.Y(C.AVC(lq))+12,c.p2,13)}
  const tm=C.TC(qm)*1.1||1;const f2=frame(r2,0,qm,0,tm,false,P.lang==='ru'?'совокупные':'totals');curve(f2,C.TC,0,qm,c.p1,2.4);curve(f2,C.VC,0,qm,c.p2,2.2);hline(f2,R.FC,0,qm,c.mark,[5,4]);if(P.show.labels){txt('TC',f2.X(qm*.96),f2.Y(C.TC(qm*.96))-10,c.p1,12);txt('VC',f2.X(qm*.96),f2.Y(C.VC(qm*.96))+12,c.p2,12);txt('FC',f2.X(qm*.04),f2.Y(R.FC)-10,c.mark,12)}}
function drawComp(R){const c=P.colors,C=R.C,qm=R.qmax;const ymax=Math.max(R.P,R.minAC.v,R.minAVC.v)*2;const fr=frame(RR(),0,qm,0,ymax,false,'P, MC, AC ↑   q →');
  if(R.q>0){const ac=C.AC(R.q);polyF(fr,[[0,R.P],[R.q,R.P],[R.q,ac],[0,ac]],R.P>=ac?c.area:c.bad,.35)}
  curve(fr,C.MC,qm*.005,qm,c.bad,2.6);curve(fr,C.AC,qm*.01,qm,c.p1,2.4);curve(fr,C.AVC,qm*.005,qm,c.p2,2.2);hline(fr,R.P,0,qm,c.eq,[]);addDrag(fr,'hl',R.P,'P',1,{base:()=>R.P,clamp:v=>Math.max(.01,v)});
  if(P.show.labels){txt(`P = MR = ${dc(fmt(R.P,2))}`,fr.X(qm*.98),fr.Y(R.P)-10,c.eq,13,'right');const lq=qm*.9;txt('MC',fr.X(lq),fr.Y(C.MC(lq))-10,c.bad,13);txt('AC',fr.X(lq)+18,fr.Y(C.AC(lq))+10,c.p1,13);txt('AVC',fr.X(lq)+22,fr.Y(C.AVC(lq))+10,c.p2,13)}
  dotP(fr,[R.minAVC.q,R.minAVC.v],c.p2,5,P.show.labels?(P.lang==='ru'?'закрытие':'shutdown'):'');dotP(fr,[R.minAC.q,R.minAC.v],c.p1,5,P.show.labels?(P.lang==='ru'?'безубыточность':'break-even'):'');
  if(R.q>0){vline2(fr,R.q,0,R.P,c.axis);dotP(fr,[R.q,R.P],c.eq,6,P.show.labels?`q* = ${dc(fmt(R.q,2))}`:'')}}
function drawMono(R){const c=P.colors;if(R.dm==='disc'){const r=RR(),w=(r.w-40)/2;[[R.D,R.r1,'1'],[R.D2,R.r2,'2']].forEach(([D,m,k],i)=>{const qx=-D.a/D.b;const fr=frame({x:r.x+i*(w+40),y:r.y,w,h:r.h},0,qx*1.05,0,D.a*1.08,false,`${P.lang==='ru'?'рынок':'market'} ${k}`);
      polyF(fr,[[0,m.P],[m.q,m.P],[m.q,R.c],[0,R.c]],c.area,.35);curve(fr,q=>Pof(D,q),0,qx,c.p1,2.6);curve(fr,q=>D.a+2*D.b*q,0,qx/2,c.curve,2,[6,4]);hline(fr,R.c,0,qx,c.bad,[]);dotP(fr,[m.q,m.P],c.eq,6,P.show.labels?`P${k} = ${dc(fmt(m.P,2))}`:'');vline2(fr,m.q,0,m.P,c.axis)});return}
  const D=R.D,C=R.C,qx=Math.min(-D.a/D.b,R.qmax)*1.05,Pm=D.a*1.08;const fr=frame(RR(),0,qx,0,Pm,false,'P ↑   q →');
  polyF(fr,[[0,R.P],[R.q,R.P],[R.q,R.AC],[0,R.AC]],R.profit>=0?c.area:c.bad,.3);polyF(fr,[[0,D.a],[0,R.P],[R.q,R.P]],c.p1,.2);
  if(isFinite(R.qc)&&P.show.areas){ctx.beginPath();ctx.moveTo(fr.X(R.q),fr.Y(R.P));for(let i=0;i<=60;i++){const q=R.q+(R.qc-R.q)*i/60;ctx.lineTo(fr.X(q),fr.Y(Pof(D,q)))}for(let i=60;i>=0;i--){const q=R.q+(R.qc-R.q)*i/60;ctx.lineTo(fr.X(q),fr.Y(C.MC(q)))}ctx.closePath();ctx.fillStyle=c.bad;ctx.globalAlpha=.45;ctx.fill();ctx.globalAlpha=1}
  curve(fr,q=>Pof(D,q),0,-D.a/D.b,c.p1,2.6);curve(fr,q=>D.a+2*D.b*q,0,-D.a/(2*D.b),c.curve,2.2,[7,5]);curve(fr,C.MC,qx*.003,qx,c.p2,2.4);curve(fr,C.AC,qx*.01,qx,c.mark,1.8);
  if(P.show.labels){txt('D',fr.X(qx*.05),fr.Y(Pof(D,qx*.05))-12,c.p1,13);txt('MR',fr.X(-D.a/(2*D.b)*.9)+16,fr.Y(D.a+2*D.b*(-D.a/(2*D.b)*.9)),c.curve,13,'left');txt('MC',fr.X(qx*.95),fr.Y(C.MC(qx*.95))-10,c.p2,13);txt('AC',fr.X(qx*.95),fr.Y(C.AC(qx*.95))+12,c.mark,12)}
  hline(fr,R.P,0,R.q,c.axis);vline2(fr,R.q,0,R.P,c.axis);dotP(fr,[R.q,R.P],c.eq,6,P.show.labels?`M (${dc(fmt(R.q,2))}; ${dc(fmt(R.P,2))})`:'M');dotP(fr,[R.q,R.MCq],c.curve,4);if(isFinite(R.qc))dotP(fr,[R.qc,R.Pc],c.p2,5,P.show.labels?(P.lang==='ru'?'конкуренция':'competition'):'')}

function drawPPF(R){const c=P.colors,s=R.s,xm=Math.max(...s.map(p=>p[0]))*1.15,ym=Math.max(...s.map(p=>p[1]))*1.15;const fr=frame(RR(),0,xm,0,ym,false,'y ↑   x →');
  polyF(fr,[[0,0],...s,[s[s.length-1][0],0]],c.area,.18);ctx.strokeStyle=c.p1;ctx.lineWidth=2.8*P.lw;ctx.beginPath();s.forEach((p,i)=>i?ctx.lineTo(fr.X(p[0]),fr.Y(p[1])):ctx.moveTo(fr.X(p[0]),fr.Y(p[1])));ctx.stroke();
  s.forEach((p,i)=>dotP(fr,p,c.p1,4,P.show.labels?String.fromCharCode(65+i):''));if(R.where){const col=R.where==='out'?c.bad:R.where==='on'?c.eq:c.mark;dotP(fr,[nI(S.inp.ppf.ptx),nI(S.inp.ppf.pty)],col,7,P.show.labels?T().f_ans[R.where]:'')}}
function drawProd(R){const c=P.colors;if(R.pm==='short'){const r=RR(),h1=r.h*.5,r1={x:r.x,y:r.y,w:r.w,h:h1},r2={x:r.x,y:r.y+h1+28,w:r.w,h:r.h-h1-28};const Lm=R.Lmax;let tm=0;for(let i=1;i<=200;i++)tm=Math.max(tm,R.TP(Lm*i/200));
    const f1=frame(r1,0,Lm,0,tm*1.15||1,false,'TP(L)');curve(f1,R.TP,0,Lm,c.p1,2.6);if(R.mpZero!=null)dotP(f1,[R.mpZero,R.TP(R.mpZero)],c.eq,5,P.show.labels?'max TP':'');
    let am=Math.max(R.apMaxV,R.MP(Lm*.01))*1.2;const f2=frame(r2,0,Lm,Math.min(0,R.MP(Lm)),am,false,'AP, MP');curve(f2,R.AP,Lm*.005,Lm,c.p2,2.4);curve(f2,R.MP,Lm*.005,Lm,c.bad,2.4);dotP(f2,[R.apMax,R.apMaxV],c.eq,5,P.show.labels?'max AP':'');if(P.show.labels){txt('AP',f2.X(Lm*.95),f2.Y(R.AP(Lm*.95))-10,c.p2,12);txt('MP',f2.X(Lm*.95),f2.Y(R.MP(Lm*.95))+12,c.bad,12)}return}
  const Lx=Math.max(R.L*2.2,R.pm==='long'?R.C/R.w:R.C/R.w)*1.05,Kx=Math.max(R.K*2.2,R.C/R.r)*1.05;const fr=frame(RR(),0,Lx,0,Kx,false,'K ↑   L →');const C=R.C;seg(fr,[0,C/R.r],[C/R.w,0],c.p2,2.6);
  const q=R.pm==='long'?R.q:R.q0,f=R.f;const Kof=L=>{let lo=0,hi=1;for(let t=0;t<60&&f(L,hi)<q;t++)hi*=2;if(f(L,hi)<q)return NaN;for(let k=0;k<60;k++){const m=(lo+hi)/2;if(f(L,m)<q)lo=m;else hi=m}return hi};curve(fr,Kof,Lx*.02,Lx,c.p1,2.4);
  dotP(fr,[R.L,R.K],c.eq,6,P.show.labels?`(${dc(fmt(R.L,2))}; ${dc(fmt(R.K,2))})`:'');if(P.show.labels){txt(P.lang==='ru'?'изокоста':'isocost',fr.X(C/R.w*.75),fr.Y(C/R.r*.25)-12,c.p2,12);txt(P.lang==='ru'?'изокванта':'isoquant',fr.X(Lx*.85),fr.Y(Kof(Lx*.85))-12,c.p1,12)}}
function drawMC(R){const c=P.colors,D=R.D,C=R.C,qx=Math.min(-D.a/D.b,R.qmax)*1.05;const fr=frame(RR(),0,qx,0,D.a*1.1,false,'P ↑   q →');
  curve(fr,q=>Pof(D,q),0,-D.a/D.b,c.p1,2.6);curve(fr,q=>D.a+2*D.b*q,0,-D.a/(2*D.b),c.curve,2,[7,5]);curve(fr,C.MC,qx*.003,qx,c.p2,2.4);curve(fr,C.AC,qx*.01,qx,c.mark,2.2);
  dotP(fr,[R.q,R.P],c.eq,6,P.show.labels?`(${dc(fmt(R.q,2))}; ${dc(fmt(R.P,2))})`:'');dotP(fr,[R.mAC.q,R.mAC.v],c.mark,5,P.show.labels?'min LAC':'');vline2(fr,R.q,0,R.P,c.axis);vline2(fr,R.mAC.q,0,R.mAC.v,c.mark);
  if(P.show.labels){txt(P.lang==='ru'?'избыточная мощность':'excess capacity',(fr.X(R.q)+fr.X(R.mAC.q))/2,fr.Y(0)-14,c.bad,12)}}
function drawOlig(R){const c=P.colors;if(R.om==='hhi'){const fr=frame(RR(),-.6,R.s.length-.4,0,Math.max(...R.s)*1.25,false,P.lang==='ru'?'доли рынка, %':'market shares, %',true);const bw=(fr.X(1)-fr.X(0))*.6;R.s.forEach((v,i)=>{ctx.fillStyle=c.p1;ctx.globalAlpha=.75;ctx.fillRect(fr.X(i)-bw/2,fr.Y(v),bw,fr.Y(0)-fr.Y(v));ctx.globalAlpha=1;if(P.show.labels)txt(dc(fmt(v,2)),fr.X(i),fr.Y(v)-10,c.axis,12)});return}
  const qm=Math.max(R.br1(0),R.br2(0),R.cour.q[0],R.cour.q[1])*1.15;const fr=frame(RR(),0,qm,0,qm,true,'q₂ ↑   q₁ →');curve(fr,q1=>R.br2(q1),0,qm,c.p2,2.6);
  ctx.save();ctx.strokeStyle=c.p1;ctx.lineWidth=2.6*P.lw;ctx.beginPath();for(let i=0;i<=200;i++){const q2=qm*i/200,q1=R.br1(q2),X=fr.X(q1),Y=fr.Y(q2);i?ctx.lineTo(X,Y):ctx.moveTo(X,Y)}ctx.stroke();ctx.restore();
  [['cour',c.eq],['stack',c.mark],['cart',c.area]].forEach(([k,col])=>dotP(fr,R[k].q,col,R.om===k?7:5,P.show.labels?T().om[k]:''))}
function drawLabor(R){const c=P.colors;if(R.lm==='firm'){const Lm=R.Lmax;let mx=0;for(let i=1;i<=200;i++)mx=Math.max(mx,R.MRP(Lm*i/200));const fr=frame(RR(),0,Lm,0,Math.max(mx,R.w)*1.2,false,'w, MRP ↑   L →');curve(fr,R.MRP,Lm*.005,Lm,c.p1,2.6);hline(fr,R.w,0,Lm,c.p2,[]);dotP(fr,[R.L,R.w],c.eq,6,P.show.labels?`L = ${dc(fmt(R.L,2))}`:'');return}
  const Dl=R.Dl,Sl=R.Sl,Lx=-Dl.a/Dl.b*1.05;const fr=frame(RR(),0,Lx,0,Dl.a*1.1,false,'w ↑   L →');curve(fr,q=>Pof(Dl,q),0,Lx,c.p1,2.6);curve(fr,q=>Pof(Sl,q),0,Lx,c.p2,2.6);
  if(R.lm==='mkt'){polyF(fr,[[0,R.E.P],[R.E.q,R.E.P],[0,Math.max(0,Sl.a)]],c.area,.35);if(R.D0&&P.show.areas){if(R.sD)curve(fr,q=>Pof(R.D0,q),0,Lx,c.p1,1.4,[4,5]);if(R.sS)curve(fr,q=>Pof(R.S0,q),0,Lx,c.p2,1.4,[4,5]);dotP(fr,[R.Eb.q,R.Eb.P],c.axis,4,'E₀')}dotP(fr,[R.E.q,R.E.P],c.eq,6,P.show.labels?'E':'');addDrag(fr,'fy',q=>Pof(Dl,q),'dDl',1);addDrag(fr,'fy',q=>Pof(Sl,q),'dSl',1);return}
  curve(fr,q=>Sl.a+2*Sl.b*q,0,Lx,c.curve,2,[7,5]);dotP(fr,[R.comp.q,R.comp.P],c.mark,5,P.show.labels?(P.lang==='ru'?'конкуренция':'competition'):'');dotP(fr,[R.L,R.w],c.eq,6,P.show.labels?(P.lang==='ru'?'монопсония':'monopsony'):'');vline2(fr,R.L,R.w,R.mrp,c.bad);if(R.mw)hline(fr,R.mw.w,0,Lx,c.mark,[]);if(P.show.labels)txt('MRC',fr.X(Lx*.55),fr.Y(Sl.a+2*Sl.b*Lx*.55)-12,c.curve,12)}
function drawCap(R){const c=P.colors;let pts=[];if(R.km==='fv'){for(let t=0;t<=R.n;t++)pts.push([t,fvAnn(R.pm,R.i,t)])}else if(R.km==='pv'||R.km==='pmt'){const pm=R.km==='pv'?R.pm:R.v,n=R.n;for(let t=1;t<=n;t++)pts.push([t,pm/Math.pow(1+R.i,t)])}
  else if(R.km==='npv'){R.fl.forEach((f,t)=>pts.push([t,f/Math.pow(1+R.i,t)]))}else if(R.km==='nper'&&isFinite(R.v)){let d=R.pv;for(let t=0;t<=Math.ceil(R.v);t++){pts.push([t,Math.max(0,d)]);d=d*(1+R.i)-R.pm}}
  else if(R.km==='land'){const D=R.D,Tx=-D.a/D.b;const fr=frame(RR(),0,Tx*1.05,0,D.a*1.1,false,'R ↑   T →');curve(fr,q=>Pof(D,q),0,Tx,c.p1,2.6);vline2(fr,R.Ts,0,D.a*1.1,c.p2,[]);dotP(fr,[R.Ts,R.R],c.eq,6,P.show.labels?`R = ${dc(fmt(R.R,2))}`:'');return}
  if(!pts.length)return;const ys=pts.map(p=>p[1]);const fr=frame(RR(),-.6,pts.length-.4,Math.min(0,...ys)*1.15,Math.max(0,...ys)*1.15||1,false,R.km==='fv'?(P.lang==='ru'?'сумма на счёте':'balance'):R.km==='nper'?(P.lang==='ru'?'остаток долга':'debt left'):(P.lang==='ru'?'приведённые потоки':'discounted flows'),true);
  const bw=Math.max(2,(fr.X(1)-fr.X(0))*.6);pts.forEach(([t,v],k)=>{const X=fr.X(k),Y=fr.Y(Math.max(v,0)),Y0=fr.Y(Math.min(v,0));ctx.fillStyle=v>=0?c.p1:c.bad;ctx.globalAlpha=.75;ctx.fillRect(X-bw/2,Y,bw,Y0-Y);ctx.globalAlpha=1;if(P.show.labels&&pts.length<=12)txt(dc(fmt(v,1)),X,(v>=0?Y-10:Y0+10),c.axis,11)})}
function drawExt(R){const c=P.colors,D=R.D;const qx=Math.max(D.kind==='lin'?-D.a/D.b:R.m.q*2,R.m.q*1.6)*1.05,Pm=Math.max(D.kind==='lin'?D.a:R.m.P*2,R.s.P,Pof(R.Ss,R.m.q*1.8))*1.08;const fr=frame(RR(),0,qx,0,Pm,false,'P ↑   q →');
  polyF(fr,[[R.s.q,R.s.P],[R.m.q,Pof(R.Ss,R.m.q)],[R.m.q,R.m.P]],c.bad,.45);curve(fr,q=>Pof(D,q),0,qx,c.p1,2.6);curve(fr,q=>Pof(R.S,q),0,qx,c.p2,2.6);curve(fr,q=>Pof(R.Ss,q),0,qx,c.bad,2.2,[7,5]);
  dotP(fr,[R.m.q,R.m.P],c.p2,6,P.show.labels?(P.lang==='ru'?'рынок':'market'):'');dotP(fr,[R.s.q,R.s.P],c.eq,6,P.show.labels?(P.lang==='ru'?'оптимум':'optimum'):'');if(P.show.labels){const ql=Math.min(qx*.9,R.m.q*1.8);txt('PMC',fr.X(ql),fr.Y(Pof(R.S,ql))+14,c.p2,12);txt('SMC',fr.X(ql),fr.Y(Pof(R.Ss,ql))-14,c.bad,12)}}
function drawPG(R){const c=P.colors,qx=R.qmax*1.05;let mx=R.sumP(0);const fr=frame(RR(),0,qx,0,Math.max(mx,Pof(R.MC,0))*1.1,false,'P ↑   q →');R.list.forEach(o=>curve(fr,q=>Math.max(0,o.n*Pof(o.L,q)),0,-o.L.a/o.L.b,c.p1,1.6,[5,4]));
  curve(fr,R.sumP,0,qx,c.p1,3);curve(fr,q=>Pof(R.MC,q),0,qx,c.p2,2.6);dotP(fr,[R.qPub,R.sumP(R.qPub)],c.eq,6,P.show.labels?`q* = ${dc(fmt(R.qPub,2))}`:'');if(P.show.labels)txt('ΣMB',fr.X(qx*.05)+14,fr.Y(R.sumP(qx*.05))-10,c.p1,13,'left')}
const DRAW2={ppf:drawPPF,prod:drawProd,mc:drawMC,olig:drawOlig,labor:drawLabor,cap:drawCap,ext:drawExt,pg:drawPG};

/* переключатели */
const TOG=['bgGrid','coords','labels','areas','hints'];
function buildToggles(){const box=$('#tog');box.innerHTML='';TOG.forEach(k=>{const l=document.createElement('label');l.className='chk';l.innerHTML=`<input type="checkbox" data-k="${k}"> <span>${T().tog[k]}</span>`;l.querySelector('input').onchange=e=>{P.show[k]=e.target.checked;save();renderCaption();req()};box.appendChild(l)});syncTogVis()}
function syncToggles(){document.querySelectorAll('#tog input').forEach(i=>{i.checked=!!P.show[i.dataset.k]});syncTogVis()}
$('#capOpen').onclick=()=>{P.show.hints=true;syncToggles();renderCaption();save()};$('#capX').onclick=()=>{P.show.hints=false;syncToggles();renderCaption();save()};
document.addEventListener('click',e=>{const q=e.target.closest('[data-term]');if(q){e.preventDefault();e.stopPropagation();openTerm(q.dataset.term);return}const p=e.target.closest('[data-pre]');if(p)loadPreset(p.dataset.pre)});
function fitView(){req()}function play(){}
/* ---------- перетаскивание кривых ---------- */
const DRAGS=[];let dragNow=null,dragRaf=0;
function addDrag(fr,kind,fn,field,scale,o={}){DRAGS.push({fr,kind,fn,field,scale,...o})}// kind: 'fy' y=f(x) верт.; 'fx' x=f(y) гориз.; 'hl' y=const; 'vl' x=const
const invX=(fr,px)=>(px-fr.X(0))/(fr.X(1)-fr.X(0)),invY=(fr,py)=>(py-fr.Y(0))/(fr.Y(1)-fr.Y(0));
function dragDist(d,px,py){const fr=d.fr,r=fr.r;if(px<r.x-6||px>r.x+r.w+6||py<r.y-6||py>r.y+r.h+6)return Infinity;let best=Infinity;
  if(d.kind==='hl')return Math.abs(fr.Y(d.fn)-py);if(d.kind==='vl')return Math.abs(fr.X(d.fn)-px);
  for(let i=0;i<=160;i++){if(d.kind==='fy'){const x=invX(fr,r.x+r.w*i/160),y=d.fn(x);if(!isFinite(y))continue;best=Math.min(best,Math.hypot(fr.X(x)-px,fr.Y(y)-py))}else{const y=invY(fr,r.y+r.h*i/160),x=d.fn(y);if(!isFinite(x))continue;best=Math.min(best,Math.hypot(fr.X(x)-px,fr.Y(y)-py))}}return best}
function pickDrag(px,py){let b=null,bd=12;for(const d of DRAGS){const v=dragDist(d,px,py);if(v<bd){bd=v;b=d}}return b}
const cvPos=e=>{const r=cv.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}};
const niceRound=v=>{if(!isFinite(v))return 0;const a=Math.abs(v);const d=a>=1000?0:a>=100?1:a>=10?2:a>=1?3:4;return+v.toFixed(d)};
cv.addEventListener('pointerdown',e=>{const p=cvPos(e),d=pickDrag(p.x,p.y);if(!d)return;const I=S.inp[S.topic];const raw=I[d.field];const pv=x=>{const t=String(x).trim();return t.endsWith('%')?nI(t.slice(0,-1))/100:nI(t)};let v0;try{v0=raw===''||raw==null?(d.base?d.base():0):pv(raw)}catch(err){v0=d.base?d.base():0}dragNow={d,px:p.x,py:p.y,v0};cv.setPointerCapture(e.pointerId);cv.style.cursor='grabbing';e.preventDefault()});
cv.addEventListener('pointermove',e=>{const p=cvPos(e);if(!dragNow){cv.style.cursor=pickDrag(p.x,p.y)?'grab':'default';return}const{d,px,py,v0}=dragNow,fr=d.fr;
  const delta=(d.kind==='fy'||d.kind==='hl')?invY(fr,p.y)-invY(fr,py):invX(fr,p.x)-invX(fr,px);let v=niceRound(v0+delta*d.scale);if(d.clamp)v=d.clamp(v);
  S.inp[S.topic][d.field]=v===0&&!d.base?'':dc(String(v));S.shock=null;S.preset=null;const el=document.querySelector(`#form [data-k="${d.field}"]`);if(el)el.value=S.inp[S.topic][d.field];
  if(!dragRaf)dragRaf=requestAnimationFrame(()=>{dragRaf=0;recompute()})});
const endDrag=()=>{if(dragNow){dragNow=null;cv.style.cursor='default'}};cv.addEventListener('pointerup',endDrag);cv.addEventListener('pointercancel',endDrag);
/* ---------- факторы и сдвиги ---------- */
const arrowOf=(a,b)=>{const t=1e-7*Math.max(1,Math.abs(a),Math.abs(b));return b>a+t?'<b class="up">↑</b>':b<a-t?'<b class="dn">↓</b>':'<span class="z">—</span>'};
function cleared(t){const I={...S.inp[t]};(DELTAS[t]||[]).forEach(k=>{I[k]=''});return I}
function renderFactors(){const box=$('#fac');if(!box)return;const t=S.topic,L=T(),list=SHOCKS[t];if(!list){box.innerHTML=`<p class="note">${L.fac_none}</p>`;return}
  let base;try{base=COMP[t](cleared(t))}catch(e){box.innerHTML=`<p class="note">${L.cap.err}</p>`;return}const ev=EFFV[t],b0=ev(base,true),vars=Object.keys(b0);if(!vars.length){box.innerHTML=`<p class="note">${L.fac_mode||L.fac_none}</p>`;return}
  const rows=list.map(sh=>{let r;try{r=COMP[t]({...cleared(t),...sh.set(cleared(t))})}catch(e){return null}const b1=ev(r,false);return{sh,b1}}).filter(Boolean);
  box.innerHTML=`<p class="note" style="margin:.1rem 0 .5rem">${L.fac_note}</p><div class="tw"><table class="tab fac"><tr><th style="text-align:left">${L.fac_f}</th><th style="text-align:left">${L.fac_c}</th>${vars.map(v=>`<th>${v}</th>`).join('')}</tr>${rows.map(({sh,b1})=>`<tr data-shock="${sh.id}" class="${S.shock===sh.id?'on':''}"><td style="text-align:left">${sh[P.lang]||sh.ru}</td><td style="text-align:left">${(P.lang==='en'?sh.cen:sh.c)||''}</td>${vars.map(v=>`<td>${arrowOf(b0[v],b1[v])}</td>`).join('')}</tr>`).join('')}</table></div>`+(S.shock?`<div class="row"><button class="btn sm" id="facReset">${L.fac_reset}</button></div>`:'')}
document.addEventListener('click',e=>{const tr=e.target.closest('tr[data-shock]');if(tr){const sh=SHOCKS[S.topic].find(s=>s.id===tr.dataset.shock);if(!sh)return;S.inp[S.topic]={...cleared(S.topic),...sh.set(cleared(S.topic))};S.shock=sh.id;S.preset=null;renderForm();recompute();return}
  if(e.target.id==='facReset'){S.inp[S.topic]=cleared(S.topic);S.shock=null;renderForm();recompute()}});
/* ---------- справочник ---------- */
const termTitle=id=>{const t=TERMS.find(x=>x.id===id);return t?(t[P.lang]||t.ru)[0]:id};
function mathify(h){return h}
function gTabs(id,html){const f=FORMAL[id];if(!f)return html;const L=T(),ft=P.gTab==='f';
  return`<div class="seg gtabs"><button data-tab="i" class="${ft?'':'on'}">${L.tabI}</button><button data-tab="f" class="${ft?'on':''}">${L.tabF}</button></div><div class="pane" data-pane="i"${ft?' hidden':''}>${html}</div><div class="pane" data-pane="f"${ft?'':' hidden'}>${f[P.lang]||f.ru}</div>`}
function termHtml(t,L){const x=t[P.lang]||t.ru,rd=!!P.read[t.id];
  return`<details class="term${rd?' read':''}" id="g-${t.id}"><summary><span>${rd?'<b class="rd">✓</b>':''}${x[0]}</span><small>${x[1]}</small></summary><div class="tb">${ILL[t.id]?`<figure class="ill">${illSvg(t.id)}</figure>`:''}${gTabs(t.id,x[2])}${DEMOS[t.id]?`<button class="btn sm primary" data-demo="${t.id}">${L.showDemo}</button>`:''}${REL[t.id]?`<div class="rel">${L.seeAlso} ${REL[t.id].map(r=>`<button class="chip" data-term="${r}">${termTitle(r)}</button>`).join('')}</div>`:''}<div class="row" style="margin-top:.8rem"><button class="btn sm readbtn${rd?' on':''}" data-read="${t.id}">${rd?L.readDone:L.readMark}</button></div></div></details>`}
function renderGloss(q=''){q=q.trim().toLowerCase();const L=T();if(!P.read||typeof P.read!=='object')P.read={};
  const total=TERMS.length,done=TERMS.filter(t=>P.read[t.id]).length;
  const match=t=>{if(!q)return true;const x=t[P.lang]||t.ru,o=t[P.lang==='ru'?'en':'ru'],f=FORMAL[t.id];return(x[0]+' '+x[1]+' '+x[2]+' '+o[0]+' '+(f?(f[P.lang]||f.ru):'')).replace(/<[^>]+>/g,'').toLowerCase().includes(q)};
  let html=`<div class="prog"><span>${L.readOf(done,total)}</span><span class="bar"><i style="width:${Math.round(done/total*100)}%"></i></span>${done?`<button class="linkbtn" id="readReset">${L.readReset}</button>`:''}</div>`;
  let any=false,num=0;
  CHAP.forEach(ch=>{if(!ch.extra)num++;const ts=ch.ids.map(id=>TERMS.find(t=>t.id===id)).filter(Boolean).filter(match);if(!ts.length)return;any=true;
    const r=ch.ids.filter(id=>P.read[id]).length;
    html+=`<section class="chap"><h3>${ch.extra?'':num+'. '}${ch[P.lang]||ch.ru}<span class="cnt">${r} / ${ch.ids.length}</span></h3>${ts.map(t=>termHtml(t,L)).join('')}</section>`});
  $('#gl').innerHTML=any?html:html+`<p class="note">${L.noFound}</p>`}
function rerenderGloss(){const sh=$('#dGloss .sheet'),st=sh.scrollTop,open=[...document.querySelectorAll('#gl details[open]')].map(d=>d.id);renderGloss($('#gq').value);open.forEach(id=>{const e=document.getElementById(id);if(e)e.open=true});sh.scrollTop=st}
$('#gq').oninput=e=>renderGloss(e.target.value);
$('#gl').addEventListener('click',e=>{const rb=e.target.closest('[data-read]');if(rb){P.read[rb.dataset.read]=!P.read[rb.dataset.read];if(!P.read[rb.dataset.read])delete P.read[rb.dataset.read];save();rerenderGloss();return}
  if(e.target.closest('#readReset')){P.read={};save();rerenderGloss()}});
$('#gl').addEventListener('click',e=>{const tb=e.target.closest('[data-tab]');if(!tb)return;const box=tb.closest('.tb');P.gTab=tb.dataset.tab;
  box.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('on',x.dataset.tab===P.gTab));box.querySelectorAll('.pane').forEach(p=>{p.hidden=p.dataset.pane!==P.gTab});save()});
$('#gl').addEventListener('click',e=>{const b=e.target.closest('[data-demo]');if(!b)return;closeDrawers();runDemo(b.dataset.demo)});

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
function exportPng(){if(!canSave()||S.rec)return;S.stamp=$('#xStamp').checked;renderNow();cv.toBlob(b=>{S.stamp=false;req();if(b)saveFile('microeconomics.png',b)},'image/png')}
async function exportVideo(){const m=vidMime();if(!canSave()||!m||S.rec||S.err||!S.anyAnim)return;S.rec=true;S.stamp=$('#xStamp').checked;updExport();
  const keep=ms=>new Promise(r=>{const t0=performance.now();const f=()=>{renderNow();if(performance.now()-t0<ms)requestAnimationFrame(f);else r()};f()});
  const chunks=[];let rec;
  try{const stream=cv.captureStream(60);rec=new MediaRecorder(stream,{mimeType:m,videoBitsPerSecond:8e6});rec.ondataavailable=e=>{if(e.data&&e.data.size)chunks.push(e.data)};
    const stopped=new Promise(r=>{rec.onstop=r});S.t=0;S.anim=null;rec.start(100);await keep(500);
    play();await new Promise(r=>{const f=()=>S.anim?requestAnimationFrame(f):r();f()});await keep(900);rec.stop();await stopped}
  catch(err){S.rec=false;S.stamp=false;req();flash(T().xFail);return}
  S.rec=false;S.stamp=false;req();updExport();const blob=new Blob(chunks,{type:m});if(blob.size)saveFile(`microeconomics.${m.startsWith('video/mp4')?'mp4':'webm'}`,blob);else flash(T().xFail)}
async function copyTex(){const ta=$('#xTex'),L=T();let ok=false;try{await navigator.clipboard.writeText(ta.value);ok=true}catch(e){}if(!ok){ta.focus();ta.select();try{ok=document.execCommand('copy')}catch(e){}}flash(ok?L.xCopied:L.xSelect)}
$('#xPng').onclick=exportPng;$('#xVid').onclick=exportVideo;$('#xCopy').onclick=copyTex;
document.querySelectorAll('#xFmt button').forEach(b=>b.onclick=()=>{fmtMode=b.dataset.f;document.querySelectorAll('#xFmt button').forEach(x=>x.classList.toggle('on',x===b));renderTex()});

function illSvg(){return''}
function runDemo(id){const d=DEMOS[id];if(!d)return;loadPreset(d.p);showPanel('solve')}
function renderTex(){const ta=$('#xTex');if(!ta)return;if(S.err||!S.res){ta.value='';return}const a=(S.ans||'').replace(/<[^>]+>/g,'');
  if(fmtMode==='txt'){ta.value=`${T()['t_'+S.topic]}\n${a}`;return}if(fmtMode==='tex'){ta.value=a.replace(/≈/g,'\\approx ').replace(/·/g,'\\cdot ');return}
  const R=S.res,t=S.topic;let py='';const ln=L=>L.kind==='lin'?`${L.a} + (${L.b})*q`:'?';
  if(t==='sd')py=`from sympy import symbols, solve\nq = symbols('q')\nD = ${ln(R.D)}\nS = ${ln(R.S)}\nqs = solve(D - S, q)[0]\nprint(qs, D.subs(q, qs))`;
  else if(t==='mono'&&R.dm==='one')py=`from sympy import symbols, diff, solve\nq = symbols('q')\nP = ${ln(R.D)}\nTC = ${R.FC} + (${S.inp.mono.VC.replace(/\^/g,'**').replace(/(\d)q/g,'$1*q')})\nqm = [r for r in solve(diff(P*q - TC, q), q) if r > 0]\nprint(qm, [P.subs(q, r) for r in qm])`;
  else py=`# ${T()['t_'+t]}\nprint(${JSON.stringify(a)})`;ta.value=py}
const KEYS=[['1 – 9','k_topic'],['[ / ]','k_prev'],['G','k_grid'],['H','k_hint'],['S','k_png'],['/','k_gloss'],['?','k_keys'],['Esc','k_esc']];
function renderKeys(){const L=T();$('#keysList').innerHTML=KEYS.map(([k,d])=>`<span>${k.split(' ').map((p,i)=>i>0&&/^[+\/–]$/.test(p)?p:`<kbd>${p}</kbd>`).join(' ')}</span><span>${L[d]}</span>`).join('')}
function openKeys(){renderKeys();closeDrawers();openDrawer('dKeys')}
$('#openKeys').onclick=openKeys;$('#openKeys2').onclick=openKeys;
function toast(msg,ms=1600){const t=$('#toast');t.textContent=msg;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),ms)}
function flip(k){P.show[k]=!P.show[k];syncToggles();save();renderCaption();req();const L=T();toast(`${L.tog[k]}: ${P.show[k]?L.on:L.off}`)}
document.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;const tg=e.target,tag=tg&&tg.tagName;if((tag==='INPUT'&&!['checkbox','range','radio','color'].includes(tg.type))||tag==='TEXTAREA'||tag==='SELECT'||(tg&&tg.isContentEditable))return;
  const isQ=e.key==='?'||(e.code==='Slash'&&e.shiftKey);if(document.querySelector('.drawer.open')&&!isQ)return;const c=e.code,L=T();let h=true;
  if(isQ)openKeys();else if(/^(Digit|Numpad)[1-9]$/.test(c)){setTopic(TOPICS[+c.slice(-1)-1]);toast(L['t_'+S.topic])}
  else if(c==='BracketLeft'||c==='BracketRight'){const list=PRE[S.topic];let i=list.findIndex(p=>p[0]===S.preset);i=(i+(c==='BracketLeft'?-1:1)+list.length)%list.length;loadPreset(list[i][0]);toast(P.lang==='ru'?list[i][2]:list[i][3])}
  else if(c==='KeyG')flip('bgGrid');else if(c==='KeyH')flip('hints');else if(c==='KeyS'){if(canSave())exportPng();else toast(L.xNoDl)}else if(c==='Slash'){$('#openGloss').click();setTimeout(()=>$('#gq').focus(),30)}else h=false;if(h)e.preventDefault()});
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
  $('#resetAll').onclick=()=>{const lg=P.lang,rd=P.read,last=P.last;P=clone(DEF);P.lang=lg;P.read=rd||{};P.last=last;syncToggles();applyPrefs();renderAll()};
}
function buildPal(){const L=T();
  const pc=$('#palChips');pc.innerHTML='';Object.entries(PAL).forEach(([k,p])=>{const b=document.createElement('button');b.className='chip';b.dataset.p=k;b.innerHTML=`<span class="sw" style="background:${p.bg};box-shadow:inset 0 0 0 3px ${p.f||Object.values(p)[3]}"></span>${L.pal[k]}`;
    b.onclick=()=>{P.palette=k;P.colors={...PAL[k]};applyPrefs()};pc.appendChild(b)});
  const cs=$('#colors');cs.innerHTML='';Object.keys(L.colors).forEach(k=>{const l=document.createElement('label');l.innerHTML=`<input type="color" data-k="${k}"> ${L.colors[k]}`;
    l.querySelector('input').oninput=e=>{P.colors[k]=e.target.value;P.palette='custom';applyPrefs()};cs.appendChild(l)});
}
function applyLang(){const L=T();LNG=P.lang;document.documentElement.lang=P.lang;document.title=L.title;
  document.querySelectorAll('[data-i]').forEach(e=>{e.textContent=L[e.dataset.i]});
  document.querySelectorAll('[data-ih]').forEach(e=>{e.innerHTML=L[e.dataset.ih]});
  document.querySelectorAll('[data-it]').forEach(e=>{e.title=L[e.dataset.it];e.setAttribute('aria-label',L[e.dataset.it])});
  document.querySelectorAll('[data-ia]').forEach(e=>{e.setAttribute('aria-label',L[e.dataset.ia])});
  $('#gq').placeholder=L.search;cv.setAttribute('aria-label',L.canvas);
  document.querySelectorAll('#langSeg button,#langSeg2 button').forEach(b=>b.classList.toggle('on',b.dataset.l===P.lang));
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

buildPanels();buildSettings();applyPrefs();renderForm();applyLang();
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>req());
})();
