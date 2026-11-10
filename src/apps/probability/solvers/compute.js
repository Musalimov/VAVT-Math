import { PhiInv, PhiN, bA, bC, bPow, bf, binom, diceDist, distOf, genBinom, genGeom, genHyper, jointStats, numIn, parseJoint, parseSeries, phiG, poiss, polyEvents, r2, rowNums, seriesStats } from './theory.js';
import { fT } from './format.js';
import { quadF } from '../../../math/expr/numeric.js';
import { parseFx } from '../../../math/expr/parse.js';
import { D, compile } from '../../../math/expr/core.js';
import { solve } from '../../../math/expr/integrate.js';
import { tidy } from '../../../math/expr/poly.js';
export const E=(msg,x)=>{throw{msg,x}};
export const nI=s=>numIn(s);
export function compBern(I){const n=nI(I.n),p=nI(I.p);if(!Number.isInteger(n)||n<1||n>100000)E('n');if(!(p>=0&&p<=1))E('p01');const q=1-p,np=n*p,npq=n*p*q,sq=Math.sqrt(npq);
  let k1=0,k2=n;const ev=I.ev;if(['eq','rng','ge','le'].includes(ev)){k1=nI(I.k1);if(!Number.isInteger(k1)||k1<0||k1>n)E('k')}
  if(ev==='eq')k2=k1;else if(ev==='rng'){k2=nI(I.k2);if(!Number.isInteger(k2)||k2<0||k2>n)E('k');if(k2<k1)[k1,k2]=[k2,k1]}else if(ev==='ge')k2=n;else if(ev==='le'){k2=k1;k1=0}else if(ev==='one'){k1=1;k2=n}
  const exact=(()=>{if(ev==='one')return 1-Math.pow(q,n);let s=0;if(k2-k1>5000){/*широкий диапазон*/}for(let k=k1;k<=k2;k++)s+=binom(n,p,k);return s})();
  let meth=I.meth||'auto';const auto=meth==='auto';if(auto)meth=npq>10?'lap':(n>30&&np<=10?'pois':'bern');if(ev==='one'&&meth!=='bern'&&auto)meth=npq>10?'lap':n>30?'pois':'bern';
  let approx=null,detail={};if(ev!=='mode'){
    if(meth==='bern')approx=exact;
    else if(meth==='pois'){const l=np;if(ev==='one')approx=1-Math.exp(-l);else{let s=0;for(let k=k1;k<=Math.min(k2,k1+5000);k++)s+=poiss(l,k);approx=s}detail={l}}
    else{if(ev==='eq'){const x=(k1-np)/sq;detail={x,xr:r2(x),ph:phiG(r2(x))};approx=phiG(r2(x))/sq;detail.exactL=phiG(x)/sq}
      else{const a=ev==='one'?1:k1,b=k2;const x1=(a-np)/sq,x2=(b-np)/sq;detail={x1,x2,x1r:r2(x1),x2r:r2(x2),F1:PhiN(r2(x1)),F2:PhiN(r2(x2))};approx=detail.F2-detail.F1;detail.exactL=PhiN(x2)-PhiN(x1)}}}
  const lo=np-q,hi=np+p,ks=[];for(let k=Math.ceil(lo-1e-12);k<=Math.floor(hi+1e-12);k++)if(k>=0&&k<=n)ks.push(k);
  return{n,p,q,np,npq,sq,k1,k2,ev,exact,approx,meth,auto,detail,kstar:ks,lo,hi}}
export function compDsv(I){if(I.mode==='prop'){const mx=nI(I.mx),dx=nI(I.dx),my=nI(I.my),dy=nI(I.dy),a=nI(I.a1===''?'0':I.a1),b=nI(I.b1===''?'0':I.b1),c=nI(I.c1===''?'0':I.c1);if(dx<0||dy<0)E('sig');
    let cov=0;if(I.rl==='r'){const r=nI(I.rv);if(Math.abs(r)>1)E('p01');cov=r*Math.sqrt(dx*dy)}else if(I.rl==='cov')cov=nI(I.rv);
    const MZ=a*mx+b*my+c,DZ=a*a*dx+b*b*dy+2*a*b*cov;return{mode:'prop',mx,dx,my,dy,a,b,c,cov,rl:I.rl,rv:I.rv,MZ,DZ,sZ:Math.sqrt(Math.max(0,DZ))}}
  let x,p,gen=null,unk=null,sum;
  if(I.mode==='tab'){const r=parseSeries(I.tab||'');x=r.x;p=r.p;unk=r.unk;sum=r.sum;if(unk)sum=1}
  else if(I.mode==='bin'){const n=nI(I.n),pp=nI(I.p);if(!Number.isInteger(n)||n<1||n>200)E('n');if(!(pp>=0&&pp<=1))E('p01');({x,p}=genBinom(n,pp));gen={n,p:pp}}
  else if(I.mode==='hyp'){const N=nI(I.N),M=nI(I.M),n=nI(I.nn);if(![N,M,n].every(Number.isInteger)||N<1)E('int');if(M>N||n>N)E('kn');({x,p}=genHyper(N,M,n));gen={N,M,n}}
  else{const pp=nI(I.p),nm=nI(I.nmax);if(!(pp>0&&pp<=1))E('p01');if(!Number.isInteger(nm)||nm<1||nm>200)E('n');({x,p}=genGeom(pp,nm));gen={p:pp,nmax:nm}}
  sum=p.reduce((a,b)=>a+b,0);if(Math.abs(sum-1)>1e-9)E('sum',fT(sum,6));const st=seriesStats(x,p);const a=nI(I.za===''?'1':I.za),b=nI(I.zb===''?'0':I.zb);
  return{x,p,unk,sum,st,a,b,MZ:a*st.M+b,DZ:a*a*st.D,gen,mode:I.mode}}
export function compDvu(I){let J;if(I.jm==='ind'){const X=parseSeries(I.tx||''),Y=parseSeries(I.ty||'');if(Math.abs(X.sum-1)>1e-9)E('sum',fT(X.sum,6));if(Math.abs(Y.sum-1)>1e-9)E('sum',fT(Y.sum,6));J={x:X.x,y:Y.x,P:X.p.map(p=>Y.p.map(q=>p*q)),sum:1,ind:true}}else J=parseJoint(I.tab||'');
  if(Math.abs(J.sum-1)>1e-9)E('sum',fT(J.sum,6));const st=jointStats(J);const a=nI(I.zaj===''||I.zaj==null?'1':I.zaj),b=nI(I.zbj===''||I.zbj==null?'1':I.zbj),zc=nI(I.zc===''||I.zc==null?'0':I.zc),zt=I.zt||'lin';
  const Z=distOf(J,zt==='prod'?(x,y)=>x*y+zc:(x,y)=>a*x+b*y+zc),zs=seriesStats(Z.x,Z.p);const cv=I.cv===''?null:nI(I.cv);let cond=null;
  if(cv!==null){if(I.cond==='yx'){const i=J.x.findIndex(v=>Math.abs(v-cv)<1e-9);if(i>=0){const pr=st.px[i];cond={given:'X',val:cv,idx:i,pr,vals:J.y,ps:J.P[i].map(v=>v/pr)}}}
    else{const j=J.y.findIndex(v=>Math.abs(v-cv)<1e-9);if(j>=0){const pr=st.py[j];cond={given:'Y',val:cv,idx:j,pr,vals:J.x,ps:J.P.map(r=>r[j]/pr)}}}
    if(cond)cond.M=cond.vals.reduce((s,v,k)=>s+v*cond.ps[k],0)}
  let dep=null;if(!st.indep){outer:for(let i=0;i<J.x.length;i++)for(let j=0;j<J.y.length;j++)if(Math.abs(J.P[i][j]-st.px[i]*st.py[j])>1e-9){dep={i,j};break outer}}
  return{J,st,a,b,zc,zt,Z,zs,cond,dep,DZchk:a*a*st.sx.D+b*b*st.sy.D+2*a*b*st.cov}}
export function quadN(f,a,b){return quadF(f,a,b).v}
export function compNsv(I){let lamV=null,FaV=null;let a,b,f,F,Fexpr=null,fexpr=null,C=1,I0=null,lo,hi,kind=I.mode;
  if(kind==='uni'){a=nI(I.a);b=nI(I.b);if(!(a<b))E('ab');f=x=>x>=a&&x<=b?1/(b-a):0;F=x=>x<=a?0:x>=b?1:(x-a)/(b-a);lo=a;hi=b}
  else if(kind==='exp'){const l=nI(I.lam);if(!(l>0))E('lam');a=0;b=Infinity;f=x=>x<0?0:l*Math.exp(-l*x);F=x=>x<0?0:1-Math.exp(-l*x);lo=0;hi=-Math.log(1e-4)/l;lamV=l}
  else if(kind==='f'){a=nI(I.a);b=nI(I.b);if(!(a<b))E('ab');let g;try{g=parseFx(I.fx||'')}catch(e){E('f')}const gc=compile(g);
    {const q=quadF(gc,a,b);I0=q.v;if(!q.ok||!isFinite(I0)||Math.abs(I0)>1e9)E('diverg')}if(I.C){if(!(I0>0))E('norm1');C=1/I0}else if(Math.abs(I0-1)>1e-6)E('norm1');fexpr=g;
    for(let i=0;i<=200;i++){const x=a+(b-a)*i/200,v=gc(x);if(isFinite(v)&&v*C<-1e-9)E('neg')}
    f=x=>x<a||x>b?0:C*gc(x);let sol=null;try{sol=solve(g,a,b)}catch(e){}
    if(sol&&sol.F){const Fg=compile(sol.F),Fa=Fg(a);Fexpr=sol.F;F=x=>x<=a?0:x>=b?1:C*(Fg(x)-Fa);FaV=Fa}else{F=x=>x<=a?0:x>=b?1:C*quadN(gc,a,x);FaV=null}lo=a;hi=b}
  else{a=nI(I.a);b=nI(I.b);if(!(a<b))E('ab');let g;try{g=parseFx(I.Fx||'')}catch(e){E('f')}const Fg=compile(g);Fexpr=g;
    if(Math.abs(Fg(a))>1e-6||Math.abs(Fg(b)-1)>1e-6)E('Fbad');for(let i=0;i<200;i++){const x1=a+(b-a)*i/200,x2=a+(b-a)*(i+1)/200;if(Fg(x2)<Fg(x1)-1e-9)E('Fbad')}
    F=x=>x<=a?0:x>=b?1:Fg(x);try{fexpr=tidy(D(g))}catch(e){fexpr=null}const fd=fexpr?compile(fexpr):(x=>(Fg(x+1e-6)-Fg(x-1e-6))/2e-6);f=x=>x<a||x>b?0:fd(x);lo=a;hi=b}
  const M=kind==='exp'?1/lamV:quadN(x=>x*f(x),lo,hi),M2=kind==='exp'?2/(lamV*lamV):quadN(x=>x*x*f(x),lo,hi),Dv=Math.max(0,M2-M*M);
  const inv=pp=>{if(kind==='exp')return-Math.log(1-pp)/lamV;let l0=lo,h0=hi;for(let i=0;i<100;i++){const m=(l0+h0)/2;if(F(m)<pp)l0=m;else h0=m}return(l0+h0)/2};
  const al=I.al===''?null:nI(I.al),be=I.be===''?null:nI(I.be);const Pab=al!==null&&be!==null?F(Math.max(al,be))-F(Math.min(al,be)):null;
  const ql=I.ql===''?null:nI(I.ql);let mode=null;{let best=-1,bx=null;const N=400;for(let i=0;i<=N;i++){const x=lo+(hi-lo)*i/N,v=f(x);if(v>best+1e-12){best=v;bx=x}}mode=bx}
  return{kind,a,b,f,F,C,I0,fexpr,Fexpr,lo,hi,M,M2,D:Dv,s:Math.sqrt(Dv),med:inv(.5),qv:ql!==null&&ql>0&&ql<1?inv(ql):null,ql,al,be,Pab,mode,lam:lamV,Fa:FaV}}
export function compNorm(I){const q=I.q;let m=I.m===''||I.m==null?null:nI(I.m),s=I.sg===''||I.sg==null?null:nI(I.sg);const R={q};
  if(['fm','fmg'].includes(q)){if(!(s>0))E('sig');const x1=nI(I.x1),pv=nI(I.pv);if(!(pv>0&&pv<1))E('p01');const pl=q==='fm'?pv:1-pv,z=PhiInv(pl);m=x1-s*z;Object.assign(R,{x1,pv,pl,z,find:'m'})}
  else if(['fs','fsg'].includes(q)){if(m===null)E('num');const x1=nI(I.x1),pv=nI(I.pv);if(!(pv>0&&pv<1))E('p01');const pl=q==='fs'?pv:1-pv,z=PhiInv(pl);s=(x1-m)/z;if(!(s>0))E('sig');Object.assign(R,{x1,pv,pl,z,find:'s'})}
  else{if(!(s>0))E('sig');if(m===null)E('num')}
  R.m=m;R.s=s;const z=x=>(x-m)/s;
  if(q==='rng'){let x1=nI(I.x1),x2=nI(I.x2);if(x2<x1)[x1,x2]=[x2,x1];R.x1=x1;R.x2=x2;R.z1=z(x1);R.z2=z(x2);R.P=PhiN(r2(R.z2))-PhiN(r2(R.z1));R.Pe=PhiN(R.z2)-PhiN(R.z1);R.lo=x1;R.hi=x2}
  else if(q==='lt'){R.x1=nI(I.x1);R.z1=z(R.x1);R.P=PhiN(r2(R.z1));R.Pe=PhiN(R.z1);R.lo=-Infinity;R.hi=R.x1}
  else if(q==='gt'){R.x1=nI(I.x1);R.z1=z(R.x1);R.P=1-PhiN(r2(R.z1));R.Pe=1-PhiN(R.z1);R.lo=R.x1;R.hi=Infinity}
  else if(q==='dev'){R.del=nI(I.del);R.z1=R.del/s;R.P=2*PhiN(r2(R.z1))-1;R.Pe=2*PhiN(R.z1)-1;R.lo=m-R.del;R.hi=m+R.del}
  else if(q==='qu'){R.pv=nI(I.pv);if(!(R.pv>0&&R.pv<1))E('p01');R.z=PhiInv(R.pv);R.xq=m+s*R.z;R.lo=-Infinity;R.hi=R.xq}
  else{R.lo=q.endsWith('g')?R.x1:-Infinity;R.hi=q.endsWith('g')?Infinity:R.x1}
  return R}
export const toInt=s=>{const v=nI(s);if(!Number.isInteger(v)||v<0)E('int');return v};
export const ints=s=>rowNums(s||'').map(toInt);
export function compComb(I){const k=I.kind;let val,n,kk,list;if(['permRep','prod'].includes(k)){list=ints(I.list);if(!list.length)E('int')}else{n=toInt(I.cn);if(n>500)E('big')}
  if(['arr','comb','arrRep','combRep'].includes(k)){kk=toInt(I.ck);if(kk>500)E('big');if((k==='arr'||k==='comb')&&kk>n)E('kn')}
  if(k==='perm')val=bf(n);else if(k==='arr')val=bA(n,kk);else if(k==='comb')val=bC(n,kk);else if(k==='arrRep')val=bPow(n,kk);else if(k==='combRep')val=bC(n+kk-1,kk);
  else if(k==='permRep'){n=list.reduce((a,b)=>a+b,0);if(n>500)E('big');val=bf(n);list.forEach(c=>{val/=bf(c)})}else{val=list.reduce((a,b)=>a*BigInt(b),1n)}
  return{kind:k,n,k:kk,list,val}}
export function compClas(I){const m=I.cmode;if(m==='mn'){const a=toInt(I.fav),b=toInt(I.tot);if(b<1||a>b)E('kn');return{m,fav:a,tot:b,P:a/b,num:BigInt(a),den:BigInt(b)}}
  if(m==='dice'){const s=toInt(I.nd);if(s<1||s>8)E('big');const d=diceDist(s),v=toInt(I.dsum);let cnt=0;d.forEach((c,sum)=>{if(I.dev==='eq'?sum===v:I.dev==='ge'?sum>=v:sum<=v)cnt+=c});const tot=Math.pow(6,s);return{m,s,v,dev:I.dev,d,cnt,tot,P:cnt/tot,num:BigInt(cnt),den:BigInt(tot)}}
  const a=ints(I.counts);if(a.length<1)E('int');const N=a.reduce((x,y)=>x+y,0),n=toInt(I.draw);if(n>N||n<1)E('kn');const den=bC(N,n);let num=0n,terms=[];
  if(I.cev==='exact'){const t=ints(I.targets);if(t.length!==a.length)E('len');if(t.reduce((x,y)=>x+y,0)!==n)E('tsum');num=1n;t.forEach((k,i)=>{num*=bC(a[i],k)});terms=[t]}
  else{const k0=toInt(I.kk),a1=a[0],rest=N-a1;for(let k=0;k<=Math.min(n,a1);k++){if(I.cev==='ge'?k<k0:k>k0)continue;if(n-k>rest)continue;num+=bC(a1,k)*bC(rest,n-k);terms.push([k,n-k])}}
  return{m,a,N,n,cev:I.cev,num,den,terms,P:Number(num)/Number(den),kk:I.kk}}
export function compOps(I){if(I.omode==='two'){const pa=nI(I.pa),pb=nI(I.pb);if(!(pa>=0&&pa<=1&&pb>=0&&pb<=1))E('p01');let pab;const rel=I.rel;
    if(rel==='ind')pab=pa*pb;else{const v=nI(I.pab);if(!(v>=0&&v<=1))E('p01');pab=rel==='ab'?v:rel==='agb'?v*pb:v*pa}
    if(pab>Math.min(pa,pb)+1e-12||pab<pa+pb-1-1e-12)E('pab');const sum=pa+pb-pab;return{mode:'two',pa,pb,pab,rel,given:rel==='ind'?null:nI(I.pab),sum,agb:pb>0?pab/pb:NaN,bga:pa>0?pab/pa:NaN,onlyA:pa-pab,onlyB:pb-pab,none:1-sum,one:sum-pab,indep:Math.abs(pab-pa*pb)<1e-9}}
  const ps=rowNums(I.ps||'').map(nI);if(!ps.length||ps.length>12)E('int');if(ps.some(p=>!(p>=0&&p<=1)))E('p01');const c=polyEvents(ps),n=ps.length,ev=I.oev;let k=null,P;
  if(['exact','ge','le','only'].includes(ev)){k=toInt(I.ok);if(ev==='only'?(k<1||k>n):k>n)E('kn')}
  if(ev==='all')P=c[n];else if(ev==='none')P=c[0];else if(ev==='one1')P=1-c[0];else if(ev==='exact')P=c[k];else if(ev==='ge')P=c.slice(k).reduce((a,b)=>a+b,0);else if(ev==='le')P=c.slice(0,k+1).reduce((a,b)=>a+b,0);
  else P=ps.reduce((a,p,i)=>a*(i===k-1?p:1-p),1);return{mode:'indep',ps,c,n,ev,k,P}}
export function compBayes(I){const lines=(I.hyp||'').split('\n').map(l=>l.trim()).filter(Boolean);if(lines.length<2)E('rows');let unk=-1;const pr=[],lk=[];
  lines.forEach((l,i)=>{const c=rowNums(l);if(c.length<2)E('len');if(c[0]==='?'){if(unk>=0)E('unk2');unk=i;pr.push(NaN)}else pr.push(nI(c[0]));lk.push(nI(c[1]))});
  if(unk>=0)pr[unk]=1-pr.reduce((a,v,i)=>i===unk?a:a+v,0);if(pr.some(v=>!(v>=-1e-12&&v<=1+1e-12))||lk.some(v=>!(v>=0&&v<=1)))E('p01');const s=pr.reduce((a,b)=>a+b,0);if(Math.abs(s-1)>1e-9)E('sum',fT(s,6));
  const L=I.bev==='notA'?lk.map(v=>1-v):lk,joint=pr.map((p,i)=>p*L[i]),PA=joint.reduce((a,b)=>a+b,0);if(!(PA>0))E('pa0');return{pr,lk,L,joint,PA,post:joint.map(v=>v/PA),bev:I.bev,unk}}
export const COMP={comb:compComb,clas:compClas,ops:compOps,bayes:compBayes,bern:compBern,dsv:compDsv,dvu:compDvu,nsv:compNsv,norm:compNorm};
