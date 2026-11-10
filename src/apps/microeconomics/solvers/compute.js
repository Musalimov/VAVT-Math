import { extern, laborFirm, monopsony, prodShort, pubGood, slutsky } from './model.js';
import { PSof, Pof, arcE, argminPos, competitive, consumer, costs, cross, discrim3, elastAt, fvAnn, fxy, hhi, irr, linPQ, market, minCost, monopoly, nper, npv, oligo2, pmt, ppf, prodLong, pvAnn, qof, roots1, rts, shiftUp } from './model.js';
import { T } from '../content/tx.js';
import { $ } from '../../../shared/dom.js';
import { exprXY, numG } from '../../../shared/econ/expr-xy.js';

export const E=(msg)=>{throw{msg}};
export const nI=s=>{const v=numG(String(s==null?'':s).replace(',','.'));return v};
export const vcOf=s=>{const t=String(s||'').replace(/(?<![a-zA-Z])q(?![a-zA-Z])/g,'x');let f;try{f=exprXY(t)}catch(e){E('vc')}return q=>f(q,0)};
export function compSD(I){let D,Sp;try{D=linPQ(I.D);Sp=linPQ(I.S)}catch(e){E('lin')}if(D.kind==='lin'&&D.b>=0)E('dslope');if(Sp.kind==='lin'&&Sp.b<=0)E('sslope');
  const shD=I.shD===''||I.shD==null?0:nI(I.shD),shS=I.shS===''||I.shS==null?0:nI(I.shS);const D0=D,S0=Sp;D=shiftUp(D,shD);Sp=shiftUp(Sp,shS);
  const o=I.iv==='none'?{}:{kind:I.iv,v:nI(I.v)};if(o.kind&&!(o.v>0))E('pos');const R=market(D,Sp,o);if(!(R.E.q>0))E('nocross');R.iv=I.iv;R.v=o.v;if(shD||shS){R.D0=D0;R.S0=S0;R.E0=cross(D0,S0);R.shD=shD;R.shS=shS}return R}
export function compEl(I){if(I.em==='pts'){const q1=nI(I.q1),q2=nI(I.q2),x1=nI(I.x1),x2=nI(I.x2);if(q1+q2===0||x1+x2===0||x1===x2)E('pos');return{em:'pts',ek:I.ek,q1,q2,x1,x2,E:arcE(q1,q2,x1,x2)}}
  let D;try{D=linPQ(I.D)}catch(e){E('lin')}if(D.kind!=='lin'||D.b>=0)E('dslope');const a=D.a,b=D.b,qmax=-a/b;const R={em:I.em,D,a,b,qmax,Pmid:a/2,qmid:qmax/2,TRmax:a*qmax/4};
  if(I.em==='pt'){const P=nI(I.P1);if(!(P>0&&P<a))E('prange');Object.assign(R,{P,...elastAt(D,P)})}
  else if(I.em==='arc'){const p1=nI(I.P1),p2=nI(I.P2);if(!(p1>0&&p1<a&&p2>0&&p2<a&&p1!==p2))E('prange');const q1=qof(D,p1),q2=qof(D,p2);Object.assign(R,{p1,p2,q1,q2,Earc:arcE(q1,q2,p1,p2),E1:elastAt(D,p1).E,E2:elastAt(D,p2).E,TR1:p1*q1,TR2:p2*q2})}
  else{const Ev=Math.abs(nI(I.Ev));if(!(Ev>0))E('pos');const P=a*Ev/(1+Ev);Object.assign(R,{Ev,P,q:qof(D,P),E:-Ev})}return R}
export function compCons(I){const t=I.ut,al=nI(I.al),be=nI(I.be),I0=nI(I.I),dI=I.dI===''||I.dI==null?0:nI(I.dI),Iv=I0+dI,px=nI(I.px),py=nI(I.py);if(![al,be,Iv,px,py].every(v=>v>0))E('pos');const R={t,al,be,I:Iv,px,py,A:consumer(t,al,be,Iv,px,py)};
  const p2=I.px2===''||I.px2==null?null:nI(I.px2);if(p2!==null){if(!(p2>0))E('pos');if(Math.abs(p2-px)>1e-12)Object.assign(R,{px2:p2,...slutsky(t,al,be,Iv,px,py,p2)})}
  R.MRS=t==='cd'?al*R.A.y/(be*R.A.x):t==='sub'?al/be:NaN;if(dI){R.I0=I0;R.A0=consumer(t,al,be,I0,px,py)}return R}
export function compCost(I){const FC=nI(I.FC),qmax=nI(I.qmax);if(!(FC>=0&&qmax>0))E('pos');const C=costs(FC,vcOf(I.VC));if(!isFinite(C.VC(qmax/2)))E('vc');
  const mAVC=argminPos(C.AVC,qmax),mAC=FC>0||true?argminPos(C.AC,qmax):null,mMC=argminPos(C.MC,qmax);return{C,FC,qmax,mAVC,mAC,mMC,edgeAC:mAC.q>qmax*.995,edgeAVC:mAVC.q>qmax*.995}}
export function compComp(I){const P=nI(I.P),FC=nI(I.FC),qmax=nI(I.qmax);if(!(P>0&&FC>=0&&qmax>0))E('pos');const C=costs(FC,vcOf(I.VC));const r=competitive(P,C,qmax);
  const be=roots1(q=>P*q-C.TC(q),1e-9,qmax);return{P,FC,qmax,C,...r,beQ:be,AC:r.q>0?C.AC(r.q):NaN,TR:P*r.q,TC:C.TC(r.q)}}
export function compMono(I){let D;try{D=linPQ(I.D)}catch(e){E('lin')}if(D.kind!=='lin'||D.b>=0)E('dslope');
  if(I.dm==='disc'){let D2;try{D2=linPQ(I.D2)}catch(e){E('lin')}if(D2.kind!=='lin'||D2.b>=0)E('dslope');const c=nI(I.c);if(!(c>=0))E('pos');const r=discrim3(D,D2,c);
    // «наивное» решение по суммарному спросу на участке, где покупают обе группы
    const lo=Math.min(D.a,D2.a);const A=-1/D.b-1/D2.b,B=D.a/(-D.b)+D2.a/(-D2.b);// Q = B - A P при P < lo
    const Pn=(B/A+c)/2,Qn=B-A*Pn;const naive=Pn<lo?{P:Pn,Q:Qn,pr:(Pn-c)*Qn}:null;return{dm:'disc',D,D2,c,...r,naive}}
  const FC=nI(I.FC),qmax=nI(I.qmax);if(!(FC>=0&&qmax>0))E('pos');const C=costs(FC,vcOf(I.VC));const r=monopoly(D,C,qmax);return{dm:'one',D,FC,qmax,C,...r,AC:C.AC(r.q)}}
export const COMP={sd:compSD,el:compEl,cons:compCons,cost:compCost,comp:compComp,mono:compMono};
export const pct=s=>{const t=String(s||'').trim();return t.endsWith('%')?nI(t.slice(0,-1))/100:nI(t)};
export const rowsN=t=>String(t||'').trim().split('\n').map(l=>l.trim()).filter(Boolean).map(l=>l.split(/[\s;]+/).map(v=>nI(v)));
export function compPPF(I){const s=rowsN(I.tab);if(s.length<2||s.some(r=>r.length!==2))E('tab');const pt=I.ptx===''||I.ptx==null?null:[nI(I.ptx),nI(I.pty)];return ppf(s,pt)}
export function compProd(I){let f;try{f=fxy(I.f)}catch(e){E('pf')}if(I.prm==='short'){const K=nI(I.K),Lm=nI(I.Lmax);if(!(Lm>0))E('pos');if(!isFinite(f(Lm/2,K)))E('pf');return{pm:'short',f,K,Lmax:Lm,...prodShort(f,K,Lm)}}
  const w=nI(I.w),r=nI(I.r);if(!(w>0&&r>0))E('pos');if(I.prm==='long'){const C=nI(I.C);if(!(C>0))E('pos');const o=prodLong(f,w,r,C);return{pm:'long',f,w,r,C,...o,rts:rts(f,o.L,o.K)}}
  const q0=nI(I.q0);if(!(q0>0))E('pos');const L0=Math.max(1,q0)*10;const m=minCost(f,w,r,q0,L0*4);return{pm:'mincost',f,w,r,q0,...m,K:m.K,L:m.L}}
export function compMC(I){let D;try{D=linPQ(I.D)}catch(e){E('lin')}if(D.kind!=='lin'||D.b>=0)E('dslope');const qmax=nI(I.qmax);const C=costs(0,vcOf(I.LTC));const qD=Math.min(qmax,-D.a/D.b);
  const MR=q=>D.a+2*D.b*q;const rr=roots1(q=>MR(q)-C.MC(q),1e-9,qD);if(!rr.length)E('nocross');let q=rr[0],best=-Infinity;for(const x of rr){const v=x*Pof(D,x)-C.TC(x);if(v>best){best=v;q=x}}const P=Pof(D,q),AC=C.AC(q),mAC=argminPos(C.AC,qmax);
  return{D,C,qmax,q,P,AC,profit:best,mAC,excess:mAC.q-q,lr:Math.abs(P-AC)<.01*Math.max(1,P)}}
export function compOlig(I){if(I.om==='hhi'){const s=nums(I.sh);if(!s.length)E('pos');const H=hhi(s);return{om:'hhi',s,H}}const a=nI(I.a),b=nI(I.b),c1=nI(I.c1),d1=nI(I.d1),c2=nI(I.c2),d2=nI(I.d2);if(!(a>0&&b>0)||[c1,d1,c2,d2].some(v=>v<0))E('pos');
  const g=oligo2(a,b,c1,d1,c2,d2);return{om:I.om,a,b,c1,d1,c2,d2,...g,sel:g[I.om==='cour'?'cour':I.om==='stack'?'stack':'cart']}}
export const nums=s=>String(s||'').trim().split(/[\s;]+/).filter(Boolean).map(nI);
export function compLabor(I){if(I.lm==='firm'){let f;try{f=fxy(I.f)}catch(e){E('pf')}const p=nI(I.p),w=nI(I.w),Lm=nI(I.Lmax);if(!(p>0&&w>0&&Lm>0))E('pos');return{lm:'firm',p,w,Lmax:Lm,f,...laborFirm(L=>f(L,0),p,w,Lm)}}
  let Dl,Sl;try{Dl=linPQ(String(I.Dl).replace(/\bw\b/g,'P').replace(/(?<![a-zA-Z])L(?![a-zA-Z])/g,'q'));Sl=linPQ(String(I.Sl).replace(/\bw\b/g,'P').replace(/(?<![a-zA-Z])L(?![a-zA-Z])/g,'q'))}catch(e){E('lin')}if(Dl.kind!=='lin'||Sl.kind!=='lin'||Dl.b>=0||Sl.b<=0)E('lin');
  const sD=I.dDl===''||I.dDl==null?0:nI(I.dDl),sS=I.dSl===''||I.dSl==null?0:nI(I.dSl);if(I.lm==='mkt'&&(sD||sS)){const D1=shiftUp(Dl,sD),S1=shiftUp(Sl,sS),E1=cross(D1,S1),Eb=cross(Dl,Sl);return{lm:'mkt',Dl:D1,Sl:S1,E:E1,rent:PSof(S1,E1.q,E1.P),wb:E1.P*E1.q,D0:Dl,S0:Sl,Eb,sD,sS}}
  const E0=cross(Dl,Sl);if(I.lm==='mkt')return{lm:'mkt',Dl,Sl,E:E0,rent:PSof(Sl,E0.q,E0.P),wb:E0.P*E0.q};const wm=I.wm===''||I.wm==null?null:nI(I.wm);return{lm:'mon',Dl,Sl,...monopsony(Dl,Sl,wm)}}
export function compCap(I){const i=pct(I.i);if(!(i>-1))E('pos');const k=I.km;if(k==='fv'){const pm=nI(I.pm),n=nI(I.n);return{km:k,i,pm,n,v:fvAnn(pm,i,n)}}if(k==='pv'){const pm=nI(I.pm),n=nI(I.n);return{km:k,i,pm,n,v:pvAnn(pm,i,n)}}
  if(k==='pmt'){const pv=nI(I.pv),n=nI(I.n);return{km:k,i,pv,n,v:pmt(pv,i,n)}}if(k==='nper'){const pv=nI(I.pv),pm=nI(I.pm);return{km:k,i,pv,pm,v:nper(pv,i,pm)}}
  if(k==='npv'){const fl=nums(I.fl);if(fl.length<2)E('pos');return{km:k,i,fl,v:npv(fl,i),irr:irr(fl)}}
  const parts=String(I.fl).split(';');let D;try{D=linPQ(parts[0].replace(/(?<![a-zA-Z])T(?![a-zA-Z])/g,'q'))}catch(e){E('lin')}const Ts=nI(parts[1]);const R=Pof(D,Ts);return{km:'land',i,D,Ts,R,v:R/i}}
export function compExt(I){let D,Sp;try{D=linPQ(I.D);Sp=linPQ(I.S)}catch(e){E('lin')}const e=nI(I.e);if(!(e>0))E('pos');return{D,S:Sp,e,...extern(D,Sp,e)}}
export function compPG(I){const list=String(I.list||'').trim().split('\n').map(l=>l.trim()).filter(Boolean).map(l=>{const m=/^(\d+)\s*[:×x*]\s*(.+)$/.exec(l);let n=1,s=l;if(m){n=+m[1];s=m[2]}let L;try{L=linPQ(s)}catch(e){E('lin')}if(L.kind!=='lin'||L.b>=0)E('dslope');return{n,L}});
  if(!list.length)E('lin');let MC;try{MC=linPQ(I.MC)}catch(e){E('lin')}return{list,MC,...pubGood(list,MC)}}
// часть 2 тренажёра дополняет общие таблицы
Object.assign(COMP,{ppf:compPPF,prod:compProd,mc:compMC,olig:compOlig,labor:compLabor,cap:compCap,ext:compExt,pg:compPG});
