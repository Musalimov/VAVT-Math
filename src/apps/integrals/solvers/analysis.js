import { Nn, add, compile, key, mul, toFrac } from '../../../math/expr/core.js';
import { lang } from '../../../shared/i18n.js';
import { solve } from '../../../math/expr/integrate.js';
import { quadF, singular } from '../../../math/expr/numeric.js';
import { limFx } from '../../../math/expr/limits.js';
export const memo=new Map();
export function getSol(fe,a,b){const k=key(fe)+'|'+lang();if(!memo.has(k)){memo.set(k,solve(fe,a,b));if(memo.size>60)memo.delete(memo.keys().next().value)}return memo.get(k)}
export const BASIS=[[1,Nn(1)],[Math.PI,['c','pi']],[Math.E,['c','e']],[Math.SQRT2,['f','sqrt',Nn(2)]],[Math.sqrt(3),['f','sqrt',Nn(3)]],[Math.LN2,['f','ln',Nn(2)]],[Math.log(3),['f','ln',Nn(3)]],[Math.log(5),['f','ln',Nn(5)]],
 [Math.sqrt(Math.PI),['f','sqrt',['c','pi']]],[Math.exp(Math.PI),['f','exp',['c','pi']]],[Math.PI*Math.PI,['^',['c','pi'],Nn(2)]],[Math.PI*Math.sqrt(3),['*',['c','pi'],['f','sqrt',Nn(3)]]],[Math.PI*Math.SQRT2,['*',['c','pi'],['f','sqrt',Nn(2)]]],[1/Math.E,['/',Nn(1),['c','e']]],[Math.E*Math.E,['f','exp',Nn(2)]]];
export const gcd=(a,b)=>b?gcd(b,a%b):a;
export const recMemo=new Map();
export function recognize(v,tol){if(!isFinite(v))return null;if(Math.abs(v)<1e-11)return Nn(0);const rk=v.toPrecision(13)+tol;if(recMemo.has(rk))return recMemo.get(rk);
  let best=null,bc=1e9;const cx=f=>Math.abs(f[0])+f[1];
  for(const[K,A]of BASIS){const f=toFrac(v/K,60,tol);if(f){const c=cx(f)+(K===1?0:3);if(c<bc){bc=c;best=mul(Nn(f[0]/f[1]),A)}}}
  if(!best||bc>14){let b2=null,c2=1e9;for(let i=0;i<BASIS.length;i++)for(let j=1;j<BASIS.length;j++){if(i===j)continue;const[K1,A1]=BASIS[i],[K2,A2]=BASIS[j];
      for(let q=1;q<=12;q++)for(let p=-24;p<=24;p++){if(!p||gcd(Math.abs(p),q)!==1)continue;const r2=p/q,rem=v-r2*K2;if(Math.abs(rem)<1e-9)continue;const f=toFrac(rem/K1,12,tol);if(!f)continue;
        const c=cx(f)+Math.abs(p)+q+6;if(c<c2){c2=c;b2=add(mul(Nn(r2),A2),mul(Nn(f[0]/f[1]),A1))}}}
    if(b2&&c2<=26&&c2<bc){best=b2;bc=c2}}
  if(best&&bc>40)best=null;
  recMemo.set(rk,best);return best}
export function oscTail(g,A){const h=.004,Xmax=A+3000;let prev=g(A),xp=A;const zs=[];for(let x=A+h;x<=Xmax&&zs.length<400;x+=h){const v=g(x);if(!isFinite(v))return null;if(v===0||(prev!==0&&Math.sign(v)!==Math.sign(prev))){let l=xp,r=x;for(let i=0;i<60;i++){const m=(l+r)/2;if(Math.sign(g(m))===Math.sign(g(l)))l=m;else r=m}zs.push((l+r)/2)}prev=v;xp=x}
  if(zs.length<80)return null;const q0=quadF(g,A,zs[0]);if(!q0.ok)return null;const a=[];for(let k=0;k+1<zs.length;k++){const q=quadF(g,zs[k],zs[k+1]);if(!q.ok)return null;a.push(q.v)}
  const n=a.length;for(let k=1;k<n;k++)if(Math.sign(a[k])===Math.sign(a[k-1]))return null;const allAlt=true;const st=Math.floor(n*.2);for(let k=st+1;k<n;k++)if(Math.abs(a[k])>Math.abs(a[k-1])*(1+1e-9))return null;
  {const A1=Math.abs(a[Math.floor(n/4)]),A2=Math.abs(a[Math.floor(n/2)]),A3=Math.abs(a[n-1]),d1=A1-A2,d2=A2-A3;if(!(d1>0&&d2>0))return A3>.95*A1?OSCDIV:UNDEC;const r=d2/d1;if(!(r<1))return UNDEC;const Lim=A3-d2*r/(1-r);if(!(Lim<.02*A1))return(r<.72&&Lim>.3*A1)?OSCDIV:UNDEC}
  const est=m=>{let s=[],t=0;for(let k=0;k<m;k++){t+=a[k];s.push(t)}let w=s.slice(-40);for(let r=0;r<30&&w.length>1;r++){const u=[];for(let i=0;i+1<w.length;i++)u.push((w[i]+w[i+1])/2);w=u}return w[w.length-1]};
  const e1=est(n),e2=est(n-40);if(!(Math.abs(e1-e2)<=1e-8*Math.max(1,Math.abs(e1))))return UNDEC;return q0.v+e1}
export const UNDEC={undec:true};
export const OSCDIV={oscdiv:true};
export function oscInf(f,lo,hi,sing){const side=(g,A)=>oscTail(g,A);
  if(isFinite(lo)&&hi===Infinity){const A=Math.max(lo,...sing.filter(x=>isFinite(x)),0)+1;let base=0;const pts=[lo,...sing.filter(x=>x>lo&&x<A),A];for(let i=0;i<pts.length-1;i++){const q=quadF(f,pts[i],pts[i+1]);if(!q.ok)return null;base+=q.v}const t=side(f,A);return t===null||t===UNDEC||t===OSCDIV?t:base+t}
  if(lo===-Infinity&&isFinite(hi)){const r=oscInf(x=>f(-x),-hi,Infinity,sing.map(x=>-x));return r}
  if(lo===-Infinity&&hi===Infinity){const r=oscInf(f,0,Infinity,sing.filter(x=>x>0)),l=oscInf(x=>f(-x),0,Infinity,sing.filter(x=>x<0).map(x=>-x));if(r===null||l===null)return null;if(r===OSCDIV||l===OSCDIV)return OSCDIV;if(r===UNDEC||l===UNDEC)return UNDEC;return r+l}return null}
export function analyzeX(X,full=true){const R={};X.R=R;if(X.err)return;const f=X.ff,a=X.a,b=X.b;
  R.sol=getSol(X.fe,X.a,X.b);R.F=R.sol.F;R.FF=R.F?compile(R.F):null;
  const lo=Math.min(a,b),hi=Math.max(a,b),sg=a<=b?1:-1;R.inf=!isFinite(lo)||!isFinite(hi);
  const big=(x,s)=>{if(!isFinite(x))return false;const y=f(x),sc=Math.max(1,Math.abs(x));
    if(isFinite(y)){const g1=Math.abs(f(x+s*1e-4*sc)),g2=Math.abs(f(x+s*1e-9*sc));return isFinite(g1)&&isFinite(g2)&&g2>1e3*Math.max(1,g1)}
    if(isNaN(y)){const d=1e-7*sc,y1=f(x+d),y2=f(x-d),o1=isFinite(y1)&&Math.abs(y1)<1e7,o2=isFinite(y2)&&Math.abs(y2)<1e7;
      if((o1||o2)&&(!(o1&&o2)||Math.abs(y1-y2)<1e-3*(1+Math.abs(y1))))return false}return true};
  let sing=singular(f,Math.max(lo,-60),Math.min(hi,60)).filter(x=>x>lo&&x<hi);
  const endS=[big(lo,1),big(hi,-1)];R.sing=sing;R.improper=R.inf||sing.length>0||endS[0]||endS[1];
  {const u0=Math.max(lo,-60),u1=Math.min(hi,60);let bad=0;if(u1>u0)for(let i=0;i<=400;i++){const x=u0+(u1-u0)*(i+.5)/401;if(isNaN(f(x))){const d=1e-7*Math.max(1,Math.abs(x));if(!(isFinite(f(x+d))&&isFinite(f(x-d))))bad++}}
    if(bad>4){R.undef=true;R.div=true;R.how='div';R.improper=false;R.pieces=[];R.val=NaN;R.num=NaN;R.numOk=false;return}}
  const pts=[lo,...sing,hi];let num=0,ok=true;const pieces=[];
  for(let i=0;i<pts.length-1;i++){pieces.push([pts[i],pts[i+1]]);const q=quadF(f,pts[i],pts[i+1]);num+=q.v;ok=ok&&q.ok}
  if(Math.abs(num)>1e10||!isFinite(num))ok=false;R.pieces=pieces;R.num=sg*num;R.numOk=ok;
  if(R.FF){
    if(!R.improper){const Fa=R.FF(a),Fb=R.FF(b),v=Fb-Fa;if(isFinite(v)&&(!ok||Math.abs(v-R.num)<=1e-6*Math.max(1,Math.abs(v)))){R.val=v;R.how='nl';R.Fa=Fa;R.Fb=Fb}else{R.val=R.num;R.how='jump'}}
    else{let tot=0,div=false,ex=true;for(const[p0,p1]of pieces){const L=limFx(R.FF,R.F,p0,1,f),U=limFx(R.FF,R.F,p1,-1,f);if(L.v===null||U.v===null){div=true;break}tot+=U.v-L.v;ex=ex&&L.ex&&U.ex}
      if(div){R.div=true;R.how='div';if(R.inf){const side=isFinite(hi)?-1:1;let okF=true,rev=0,pd=0,pv=null;for(let i=0;i<=4000;i++){const X=side*(50+i*.37),v=R.FF(X);if(!isFinite(v)){okF=false;break}if(pv!==null){const d=v-pv;if(Math.abs(d)>1e-12){if(pd&&Math.sign(d)!==pd)rev++;pd=Math.sign(d)}}pv=v}if(okF&&rev>=6)R.divOsc=true}}else{tot*=sg;if(ok&&Math.abs(tot-R.num)>1e-5*Math.max(1,Math.abs(tot))){R.val=R.num;R.how='jump'}else{R.val=ex||!ok?tot:R.num;R.how='lim'}}}}
  else{if(R.improper&&!ok){const o=R.inf?oscInf(f,lo,hi,sing):null;if(o===UNDEC){R.div=true;R.undec=true;R.how='div'}else if(o===OSCDIV){R.div=true;R.divOsc=true;R.how='div'}else if(o!==null){R.val=R.num=sg*o;R.numOk=true;R.how='num';R.osc=true}else{R.div=true;R.how='div'}}else{R.val=R.num;R.how='num'}}
  if(!R.div&&full){R.exact=(R.how==='nl'||R.numOk||R.how==='lim')?recognize(R.val,R.how==='nl'?1e-10:1e-9):null;
    const q=g=>{let s=0;for(const[p0,p1]of pieces)s+=quadF(g,p0,p1).v;return s};
    R.pos=q(x=>{const y=f(x);return y>0?y:0});R.neg=q(x=>{const y=f(x);return y<0?y:0});R.abs=R.pos-R.neg;
    if(sg<0){[R.pos,R.neg]=[-R.neg,-R.pos]}
    if(!R.inf)R.mean=R.val/(b-a)}
  if(isFinite(a)&&isFinite(b)&&Math.abs(a+b)<1e-12&&a!==b){let odd=true,even=true;for(let i=1;i<=9;i++){const x=Math.abs(a)*i/9.3,p=f(x),m=f(-x);if(!isFinite(p)||!isFinite(m))continue;
      if(Math.abs(p+m)>1e-9*(1+Math.abs(p)))odd=false;if(Math.abs(p-m)>1e-9*(1+Math.abs(p)))even=false}R.odd=odd&&!even;R.even=even&&!odd}
  calcRSX(X)}
export function calcRSX(X){const R=X.R;if(!R||X.err)return;R.rs=null;if(R.improper||R.undef)return;const f=X.ff,a=X.a,b=X.b;let n=X.n;if(X.rule==='simp'&&n%2)n++;const h=(b-a)/n;let s=0;
  const y=x=>{const v=f(x);return isFinite(v)?v:0};
  if(X.rule==='simp'){for(let i=0;i<=n;i++)s+=y(a+i*h)*(i===0||i===n?1:i%2?4:2);s*=h/3}
  else for(let i=0;i<n;i++){const xl=a+i*h,xr=xl+h;s+=X.rule==='left'?y(xl):X.rule==='right'?y(xr):X.rule==='mid'?y(xl+h/2):(y(xl)+y(xr))/2}
  if(X.rule!=='simp')s*=h;R.rs=s;R.rsN=n}
