import { T } from '../content/tx.js';
import { exprXY } from '../../../shared/econ/expr-xy.js';

export function linPQ(src){let s=String(src).replace(/[−–]/g,'-').replace(/(\d),(\d)/g,'$1.$2').replace(/\s+/g,'');const eq=s.split('=');if(eq.length!==2||!eq[0]||!eq[1])throw{msg:'lin'};
  const conv=t=>t.replace(/(\d)e(\d)/gi,'$1E$2').replace(/(?<![a-zA-Z])(Q[ds]?|q[ds]?|L|T)(?![a-zA-Z])/g,'y').replace(/(?<![a-zA-Z])[Ppw](?![a-zA-Z])/g,'x').replace(/(\d+(?:\.\d+)?)E(\d+)/g,(m,a,b)=>String(+a*Math.pow(10,+b)));
  let fl,fr;try{fl=exprXY(conv(eq[0]));fr=exprXY(conv(eq[1]))}catch(e){throw{msg:'lin'}}const g=(P,q)=>fl(P,q)-fr(P,q);
  const c=g(0,0),aP=g(1,0)-c,aq=g(0,1)-c;if(![c,aP,aq].every(isFinite))throw{msg:'lin'};
  for(const[P,q]of[[2,3],[-5,7],[11,-4]]){const v=g(P,q),w=c+aP*P+aq*q;if(Math.abs(v-w)>1e-9*Math.max(1,Math.abs(v),Math.abs(w)))throw{msg:'nonlin'}}
  if(Math.abs(aP)<1e-15&&Math.abs(aq)<1e-15)throw{msg:'lin'};if(Math.abs(aP)<1e-15)return{kind:'vert',q0:-c/aq};if(Math.abs(aq)<1e-15)return{kind:'horiz',P0:-c/aP};return{kind:'lin',a:-c/aP,b:-aq/aP}}
export const Pof=(L,q)=>L.kind==='lin'?L.a+L.b*q:L.kind==='horiz'?L.P0:NaN;
export const qof=(L,P)=>L.kind==='lin'?(P-L.a)/L.b:L.kind==='vert'?L.q0:NaN;
export function cross(D,S){// решаем D(q)=S(q)
  if(D.kind==='lin'&&S.kind==='lin'){if(Math.abs(D.b-S.b)<1e-15)return null;const q=(S.a-D.a)/(D.b-S.b);return{q,P:Pof(D,q)}}
  if(D.kind==='vert'&&S.kind==='lin')return{q:D.q0,P:Pof(S,D.q0)};if(S.kind==='vert'&&D.kind==='lin')return{q:S.q0,P:Pof(D,S.q0)};
  if(D.kind==='horiz'&&S.kind==='lin')return{q:qof(S,D.P0),P:D.P0};if(S.kind==='horiz'&&D.kind==='lin')return{q:qof(D,S.P0),P:S.P0};
  if(D.kind==='vert'&&S.kind==='horiz')return{q:D.q0,P:S.P0};if(S.kind==='vert'&&D.kind==='horiz')return{q:S.q0,P:D.P0};return null}
export const shiftUp=(L,t)=>L.kind==='lin'?{kind:'lin',a:L.a+t,b:L.b}:L.kind==='horiz'?{kind:'horiz',P0:L.P0+t}:L;
export function intLin(a,b,q0,q1){return a*(q1-q0)+b*(q1*q1-q0*q0)/2}
export function CSof(D,q,Pb){if(q<=0)return 0;if(D.kind!=='lin')return D.kind==='horiz'?0:NaN;// ∫0^q (D(s) - Pb) ds, только где D>Pb
  return intLin(D.a-Pb,D.b,0,q)}
export function PSof(S,q,Ps){if(q<=0)return 0;if(S.kind==='horiz')return Math.max(0,(Ps-S.P0)*q);if(S.kind==='vert')return Ps*Math.min(q,S.q0);
  // ∫0^q (Ps - max(0,S(s))) ds
  const z=S.b!==0?-S.a/S.b:-1;if(S.a>=0||z<=0)return intLin(Ps-S.a,-S.b,0,q);const qz=Math.min(z,q);return Ps*qz+intLin(Ps-S.a,-S.b,qz,q)}
export function market(D,S,o){const E=cross(D,S);if(!E)throw{msg:'nocross'};const R={D,S,E,CS:CSof(D,E.q,E.P),PS:PSof(S,E.q,E.P)};R.W=R.CS+R.PS;
  if(o.kind==='tax'||o.kind==='sub'){const t=o.kind==='tax'?o.v:-o.v;const S2=shiftUp(S,t),E2=cross(D,S2);let q=E2.q,Pb=E2.P,Ps=Pb-t;const gone=!(q>0);if(gone){q=0;Pb=Pof(D,0);Ps=Pb-t}
    Object.assign(R,{gone,q2:q,Pb,Ps,S2,rev:t*q,CS2:CSof(D,q,Pb),PS2:PSof(S,q,Ps)});R.W2=R.CS2+R.PS2+R.rev;R.DWL=R.W-R.W2;R.shareB=(Pb-E.P)/t;R.shareS=(E.P-Ps)/t}
  else if(o.kind==='ceil'||o.kind==='floor'){const P=o.v,qd=Math.max(0,qof(D,P)),qs=Math.max(0,qof(S,P));const bind=o.kind==='ceil'?P<E.P:P>E.P;
    if(!bind)Object.assign(R,{bind:false});else{const q=Math.min(Math.max(0,qd),qs);Object.assign(R,{bind:true,P2:P,qd,qs,q2:q,gap:o.kind==='ceil'?qd-qs:qs-qd,CS2:CSof(D,q,P),PS2:PSof(S,q,P)});R.W2=R.CS2+R.PS2;R.DWL=R.W-R.W2}}
  else if(o.kind==='quota'){const qq=o.v;if(qq>=E.q)Object.assign(R,{bind:false});else{const Pb=Pof(D,qq),Ps=Pof(S,qq);Object.assign(R,{bind:true,q2:qq,Pb,Ps,rent:(Pb-Ps)*qq,CS2:CSof(D,qq,Pb),PS2:PSof(S,qq,Pb)});R.W2=R.CS2+R.PS2;R.DWL=R.W-R.W2}}
  return R}
export function elastAt(L,P){const q=qof(L,P);return{q,E:(1/L.b)*P/q}}
export function arcE(q1,q2,p1,p2){return((q2-q1)/((q1+q2)/2))/((p2-p1)/((p1+p2)/2))}
export function consumer(t,al,be,I,px,py){// t: cd (x^al y^be), sub (al x + be y), comp min(al x, be y)
  if(t==='cd'){const x=al/(al+be)*I/px,y=be/(al+be)*I/py;return{x,y,U:Math.pow(x,al)*Math.pow(y,be)}}
  if(t==='sub'){const rx=al/px,ry=be/py;if(Math.abs(rx-ry)<1e-12)return{x:I/(2*px),y:I/(2*py),U:al*I/(2*px)+be*I/(2*py),tie:true};return rx>ry?{x:I/px,y:0,U:al*I/px}:{x:0,y:I/py,U:be*I/py}}
  const x=I/(px+py*al/be),y=al*x/be;return{x,y,U:al*x}}
export const Uof=(t,al,be,x,y)=>t==='cd'?Math.pow(x,al)*Math.pow(y,be):t==='sub'?al*x+be*y:Math.min(al*x,be*y);
export function hicks(t,al,be,U0,px,py){// минимизация расходов при U = U0
  if(t==='cd'){const x=Math.pow(U0*Math.pow(al*py/(be*px),be),1/(al+be)),y=x*be*px/(al*py);return{x,y,I:px*x+py*y}}
  if(t==='sub'){return al/px>=be/py?{x:U0/al,y:0,I:px*U0/al}:{x:0,y:U0/be,I:py*U0/be}}
  const x=U0/al,y=U0/be;return{x,y,I:px*x+py*y}}
export function slutsky(t,al,be,I,px,py,px2){const A=consumer(t,al,be,I,px,py),B=consumer(t,al,be,I,px2,py);const H=hicks(t,al,be,A.U,px2,py);const Is=I+(px2-px)*A.x,Sl=consumer(t,al,be,Is,px2,py);
  return{A,B,H,Sl,Is,subH:H.x-A.x,incH:B.x-H.x,subS:Sl.x-A.x,incS:B.x-Sl.x,CV:H.I-I}}
export function costs(FC,VC){const h=q=>Math.max(1e-6,q*1e-6);const MC=q=>(VC(q+h(q))-VC(Math.max(0,q-h(q))))/(q+h(q)-Math.max(0,q-h(q)));const AVC=q=>VC(q)/q,AC=q=>(FC+VC(q))/q,TC=q=>FC+VC(q);return{FC,VC,TC,MC,AVC,AC,AFC:q=>FC/q}}
export function argminPos(f,hi){// минимум на (0, hi]: сетка + золотое сечение
  let best=Infinity,bx=hi;const N=4000;for(let i=1;i<=N;i++){const q=hi*i/N,v=f(q);if(v<best){best=v;bx=q}}let l=Math.max(1e-9,bx-hi/N),r=Math.min(hi,bx+hi/N);for(let k=0;k<80;k++){const m1=l+(r-l)/3,m2=r-(r-l)/3;if(f(m1)<f(m2))r=m2;else l=m1}const q=(l+r)/2;return{q,v:f(q)}}
export function roots1(f,lo,hi){const N=4000,out=[];let pq=lo,pv=f(lo);for(let i=1;i<=N;i++){const q=lo+(hi-lo)*i/N,v=f(q);if(!isFinite(v)){pv=v;pq=q;continue}if(pv===0)out.push(pq);else if(isFinite(pv)&&pv*v<0){let l=pq,r=q;for(let k=0;k<80;k++){const m=(l+r)/2;if(f(l)*f(m)<=0)r=m;else l=m}out.push((l+r)/2)}pv=v;pq=q}return out}
export function competitive(P,C,qmax){const mAVC=argminPos(C.AVC,qmax),mAC=argminPos(C.AC,qmax);// P = MC на растущей ветви MC, выше min AVC
  const cand=roots1(q=>C.MC(q)-P,1e-9,qmax).filter(q=>C.MC(q+1e-4*Math.max(1,q))>=C.MC(Math.max(1e-9,q-1e-4*Math.max(1,q)))-1e-9);
  let q=0,pr=-C.FC,cap=false;for(const c of cand){const v=P*c-C.TC(c);if(v>pr+1e-12){pr=v;q=c}}
  {const v=P*qmax-C.TC(qmax);if(P>C.MC(qmax)+1e-9&&v>pr+1e-12){q=qmax;pr=v;cap=true}}const shut=P<mAVC.v-1e-12||q===0;if(shut){q=0;pr=-C.FC;cap=false}
  return{q,profit:pr,shut,cap,minAVC:mAVC,minAC:mAC,breakEven:Math.abs(P-mAC.v)<1e-9}}
export function monopoly(D,C,qmax){// D линейная P = a + b q
  const TR=q=>q*Pof(D,q),MR=q=>D.a+2*D.b*q;const qD=Math.max(0,-D.a/D.b);const hi=Math.min(qmax,qD);
  const cand=[...roots1(q=>MR(q)-C.MC(q),1e-9,hi)];let q=0,pr=-C.FC;for(const c of cand){const v=TR(c)-C.TC(c);if(v>pr+1e-12){pr=v;q=c}}
  if(q===0)return{q:0,P:Pof(D,0),profit:-C.FC,none:true,MRq:D.a,MCq:C.MC(0),qc:0,Pc:Pof(D,0),DWL:0,E:-Infinity,lerner:NaN,CS:0,shutdown:false};
  const P=Pof(D,q);const comp=roots1(q2=>Pof(D,q2)-C.MC(q2),1e-9,hi);const qc=comp.length?comp[comp.length-1]:NaN,Pc=Pof(D,qc);
  const DWL=isFinite(qc)?integ(q2=>Pof(D,q2)-C.MC(q2),q,qc):NaN;const E=(1/D.b)*P/q;return{q,P,profit:pr,MRq:MR(q),MCq:C.MC(q),qc,Pc,DWL,E,lerner:(P-C.MC(q))/P,CS:CSof(D,q,P),shutdown:pr<-C.FC-1e-9}}
export function integ(f,a,b){const n=2000,h=(b-a)/n;let s=f(a)+f(b);for(let i=1;i<n;i++)s+=f(a+i*h)*(i%2?4:2);return s*h/3}
export function discrim3(D1,D2,c){// два рынка, постоянные MC = c
  const m=D=>{const q=Math.max(0,(c-D.a)/(2*D.b));return{q,P:Pof(D,q)}};const r1=m(D1),r2=m(D2);
  // единая цена: суммарный спрос (кусочно-линейный) — численно
  const Qd=P=>Math.max(0,qof(D1,P))+Math.max(0,qof(D2,P));let best=-Infinity,bp=c;const Pmax=Math.max(D1.a,D2.a);for(let i=0;i<=20000;i++){const P=c+(Pmax-c)*i/20000,v=(P-c)*Qd(P);if(v>best){best=v;bp=P}}
  let l=Math.max(c,bp-(Pmax-c)/20000),r=Math.min(Pmax,bp+(Pmax-c)/20000);for(let k=0;k<80;k++){const m1=l+(r-l)/3,m2=r-(r-l)/3;if((m1-c)*Qd(m1)<(m2-c)*Qd(m2))l=m1;else r=m2}const Pu=(l+r)/2;
  return{r1,r2,pr1:(r1.P-c)*r1.q,pr2:(r2.P-c)*r2.q,Pu,Qu:Qd(Pu),pru:(Pu-c)*Qd(Pu)}}
export const fxy=s=>{const t=String(s||'').replace(/[−–]/g,'-').replace(/(?<![a-zA-Z])L(?![a-zA-Z])/g,'x').replace(/(?<![a-zA-Z])K(?![a-zA-Z])/g,'y');return exprXY(t)};
export function ppf(pts,pt){const s=pts.slice().sort((a,b)=>a[0]-b[0]);const oc=[];for(let i=1;i<s.length;i++){const dx=s[i][0]-s[i-1][0],dy=s[i-1][1]-s[i][1];oc.push({from:i-1,to:i,dx,dy,oc:dy/dx})}
  const incr=oc.every((o,i)=>i===0||o.oc>=oc[i-1].oc-1e-12);let where=null;if(pt){// граница — ломаная; сравниваем y точки с границей при том же x
    const x=pt[0];let yb=null;if(x>=0&&x<s[0][0])yb=s[0][1];for(let i=1;i<s.length;i++)if(x>=s[i-1][0]-1e-12&&x<=s[i][0]+1e-12){const t=(x-s[i-1][0])/(s[i][0]-s[i-1][0]||1);yb=s[i-1][1]+t*(s[i][1]-s[i-1][1]);break}
    if(pt[0]<0||pt[1]<0)yb=null;where=yb===null?'out':Math.abs(pt[1]-yb)<1e-9?'on':pt[1]<yb?'in':'out';return{s,oc,incr,where,yb}}return{s,oc,incr,where}}
export function prodShort(f,K,Lmax){const TP=L=>f(L,K),h=L=>Math.max(1e-6,L*1e-6),MP=L=>(TP(L+h(L))-TP(Math.max(0,L-h(L))))/(L+h(L)-Math.max(0,L-h(L))),AP=L=>TP(L)/L;
  let apMax=null,b=-Infinity;for(let i=1;i<=4000;i++){const L=Lmax*i/4000,v=AP(L);if(v>b){b=v;apMax=L}}const mp0=roots1(L=>MP(L),Lmax*1e-4,Lmax);return{TP,MP,AP,apMax,apMaxV:AP(apMax),mpZero:mp0.length?mp0[0]:null}}
export function prodLong(f,w,r,C){// max f(L,K) при wL + rK = C
  const Lm=C/w;let best=-Infinity,bL=0;for(let i=1;i<4000;i++){const L=Lm*i/4000,K=(C-w*L)/r,v=f(L,K);if(v>best){best=v;bL=L}}let l=Math.max(1e-9,bL-Lm/4000),u=Math.min(Lm*(1-1e-9),bL+Lm/4000);const g=L=>f(L,(C-w*L)/r);for(let k=0;k<100;k++){const m1=l+(u-l)/3,m2=u-(u-l)/3;if(g(m1)<g(m2))l=m1;else u=m2}
  const L=(l+u)/2,K=(C-w*L)/r,q=f(L,K),e=1e-6*Math.max(1,L),eK=1e-6*Math.max(1,K);const MPL=(f(L+e,K)-f(L-e,K))/(2*e),MPK=(f(L,K+eK)-f(L,K-eK))/(2*eK);return{L,K,q,MPL,MPK,MRTS:MPL/MPK}}
export function minCost(f,w,r,q0,Lhi){// минимум затрат для выпуска q0: перебор L, K из изокванты
  const Kof=L=>{let lo=0,hi=1;for(let t=0;t<200&&f(L,hi)<q0;t++)hi*=2;if(f(L,hi)<q0)return Infinity;for(let k=0;k<100;k++){const m=(lo+hi)/2;if(f(L,m)<q0)lo=m;else hi=m}return hi};
  let best=Infinity,bL=0;for(let i=1;i<=3000;i++){const L=Lhi*i/3000,K=Kof(L),c=w*L+r*K;if(c<best){best=c;bL=L}}let l=Math.max(1e-9,bL-Lhi/3000),u=bL+Lhi/3000;const g=L=>w*L+r*Kof(L);for(let k=0;k<80;k++){const m1=l+(u-l)/3,m2=u-(u-l)/3;if(g(m1)<g(m2))u=m2;else l=m1}bL=(l+u)/2;return{L:bL,K:Kof(bL),C:g(bL),Kof}}
export function rts(f,L,K){const q=f(L,K),q2=f(2*L,2*K);return q2/q}
export function oligo2(a,b,c1,d1,c2,d2){const br=(ci,di,qj)=>Math.max(0,(a-ci-b*qj)/(2*b+2*di));
  // Курно: q1(2b+2d1) + b q2 = a - c1 ; b q1 + q2(2b+2d2) = a - c2
  const A11=2*b+2*d1,A22=2*b+2*d2,det=A11*A22-b*b;let q1=((a-c1)*A22-b*(a-c2))/det,q2=(A11*(a-c2)-b*(a-c1))/det;if(q1<0){q1=0;q2=br(c2,d2,0)}if(q2<0){q2=0;q1=br(c1,d1,0)}
  const pr=(q,qo,ci,di)=>q*(a-b*(q+qo))-ci*q-di*q*q;const cour={q:[q1,q2],P:a-b*(q1+q2),pi:[pr(q1,q2,c1,d1),pr(q2,q1,c2,d2)]};
  // Штакельберг: лидер 1; последователь отвечает q2 = max(0, (a - c2 - b q1)/(2b+2d2))
  const f2=q=>br(c2,d2,q),pl=q=>pr(q,f2(q),c1,d1);const k=b/A22,m=(a-c2)/A22,qt=Math.max(0,(a-c2)/b);
  const cand=[0,qt,Math.min(qt,Math.max(0,(a-b*m-c1)/(2*(b-b*k+d1)))),Math.max(qt,(a-c1)/(2*b+2*d1))];let s1=0;for(const q of cand)if(pl(q)>pl(s1)+1e-12)s1=q;const s2=f2(s1);
  const stack={q:[s1,s2],P:a-b*(s1+s2),pi:[pr(s1,s2,c1,d1),pr(s2,s1,c2,d2)],deter:s2<=1e-12&&s1>0};
  // картель: MR(Q) = λ, qi = (λ - ci)/(2di) при di > 0; фирмы с di = 0 производят, только если ci = λ
  const F=[{c:c1,d:d1},{c:c2,d:d2}];const qq=lam=>F.map(f=>f.d>0?Math.max(0,(lam-f.c)/(2*f.d)):0);const lin=F.map((f,i)=>f.d===0?i:-1).filter(i=>i>=0);
  const g=lam=>a-2*b*qq(lam).reduce((x,y)=>x+y,0)-lam;const solveL=hi=>{let lo=-a-Math.max(c1,c2)*2-10,h=hi;for(let t=0;t<200;t++){const mm=(lo+h)/2;if(g(mm)>0)lo=mm;else h=mm}return(lo+h)/2};
  let cq;if(lin.length){const cl=Math.min(...lin.map(i=>F[i].c));if(g(cl)<=0){cq=qq(solveL(cl))}else{cq=qq(cl);const need=(a-cl)/(2*b)-cq.reduce((x,y)=>x+y,0);const iL=lin.find(i=>F[i].c===cl);cq[iL]+=Math.max(0,need)}}else cq=qq(solveL(a));
  const cart={q:cq,P:a-b*(cq[0]+cq[1]),pi:[pr(cq[0],cq[1],c1,d1),pr(cq[1],cq[0],c2,d2)]};
  // совершенная конкуренция (P = MC) при одинаковых линейных издержках
  return{cour,stack,cart,br1:q2=>br(c1,d1,q2),br2:q1=>br(c2,d2,q1)}}
export const hhi=sh=>{const s=sh.reduce((x,y)=>x+y,0);const p=s>1.5?sh:sh.map(v=>v*100);return p.reduce((x,y)=>x+y*y,0)};
export function laborFirm(fq,p,w,Lmax){const MP=L=>(fq(L+1e-6*Math.max(1,L))-fq(Math.max(0,L-1e-6*Math.max(1,L))))/(L+1e-6*Math.max(1,L)-Math.max(0,L-1e-6*Math.max(1,L))),MRP=L=>p*MP(L);
  const rr=roots1(L=>MRP(L)-w,Lmax*1e-5,Lmax).filter(L=>MRP(L*1.0001)<=MRP(L*.9999)+1e-9);let L=rr.length?rr[rr.length-1]:0,cap=false;if(!rr.length&&MRP(Lmax)>w+1e-12){L=Lmax;cap=true}return{L,q:fq(L),MRP,MP,cap}}
export function monopsony(Dl,Sl,wmin){// спрос на труд (MRP): w = a + b L (b<0); предложение w = c + d L (d>0)
  const comp=cross(Dl,Sl);const L=(Dl.a-Sl.a)/(2*Sl.b-Dl.b),w=Pof(Sl,L),mrp=Pof(Dl,L);let mw=null;if(wmin!=null){const Ls=Math.max(0,qof(Sl,wmin)),Ld=Math.max(0,qof(Dl,wmin));if(wmin<=w+1e-12)mw={w:wmin,L,Ls,Ld,nobind:true};else{const Lm=Math.min(Ls,Ld);mw={w:wmin,L:Lm,Ls,Ld,unemp:Math.max(0,Ls-Ld),nobind:false}}}
  return{comp,L,w,mrp,exp:mrp-w,mw}}
export const fvAnn=(pm,i,n)=>pm*(Math.pow(1+i,n)-1)/i;
export const pvAnn=(pm,i,n)=>pm*(1-Math.pow(1+i,-n))/i;
export const pmt=(pv,i,n)=>pv*i/(1-Math.pow(1+i,-n));
export const nper=(pv,i,pm)=>pm<=pv*i?Infinity:-Math.log(1-pv*i/pm)/Math.log(1+i);
export function npv(flows,i){return flows.reduce((s,f,t)=>s+f/Math.pow(1+i,t),0)}
export function irr(flows){let lo=-0.99,hi=10;const f=i=>npv(flows,i);if(f(lo)*f(hi)>0)return null;for(let k=0;k<200;k++){const m=(lo+hi)/2;if(f(lo)*f(m)<=0)hi=m;else lo=m}return(lo+hi)/2}
export function extern(D,Sp,e){const m=cross(D,Sp);const Ss=shiftUp(Sp,e);const s=cross(D,Ss);return{m,s,Ss,damage:e*m.q,DWL:.5*e*(m.q-s.q),tax:e}}
export function pubGood(list,MC){// list: [{n, L}] — n одинаковых потребителей с обратным спросом L
  const sumP=q=>list.reduce((s,o)=>s+o.n*Math.max(0,Pof(o.L,q)),0);const qmax=Math.max(...list.map(o=>-o.L.a/o.L.b));const r=roots1(q=>sumP(q)-Pof(MC,q),1e-9,qmax);
  const sumQ=P=>list.reduce((s,o)=>s+o.n*Math.max(0,qof(o.L,P)),0);const rp=roots1(P=>sumQ(P)-qof(MC,P),Math.max(0,MC.kind==='lin'?MC.a:MC.P0||0)+1e-9,Math.max(...list.map(o=>o.L.a)));
  return{sumP,qPub:r.length?r[0]:0,qmax,sumQ,PPriv:rp.length?rp[0]:null}}
