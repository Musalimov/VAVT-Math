import { snap } from './core.js';
export function tsFinite(f,a,b){const c=(a+b)/2,r=(b-a)/2;if(r===0)return{v:0,ok:true};
  const ev=x=>{const y=f(x);return isFinite(y)?y:0};
  let h=1,S=Math.PI/2*ev(c),prev=null,I=0,ok=false,bad=false;
  const addT=t=>{const s=Math.PI/2*Math.sinh(t),q=Math.exp(-2*s),dist=2*q/(1+q),w=Math.PI/2*Math.cosh(t)*4*q/((1+q)*(1+q));
    if(w<1e-300||r*dist===0)return 0;const xa=a+r*dist,xb=b-r*dist;let s2=0;
    if(xa!==a){const fa=f(xa);if(isFinite(fa))s2+=fa;else bad=true}if(xb!==b){const fb=f(xb);if(isFinite(fb))s2+=fb;else bad=true}return w*s2};
  const TM=4.4;for(let k=1;k<=40;k++){const t=k*h,v=addT(t);S+=v;if(t>TM)break}
  I=r*h*S;let good=0;
  for(let lev=1;lev<=8;lev++){h/=2;let add=0;for(let k=1;;k+=2){const t=k*h;if(t>TM)break;add+=addT(t)}S+=add;const nI=r*h*S;
    if(Math.abs(nI-I)<=1e-12*Math.max(1,Math.abs(nI))){good++;if(good>=2&&lev>=4){I=nI;ok=true;break}}else good=0;prev=I;I=nI}
  if(!ok&&prev!==null&&Math.abs(I-prev)<=1e-7*Math.max(1,Math.abs(I)))ok=true;
  return{v:I,ok:ok&&!bad}}
export function quadF(f,a,b){if(a===b)return{v:0,ok:true};if(a>b){const r=quadF(f,b,a);return{v:-r.v,ok:r.ok}}
  if(a===-Infinity&&b===Infinity){const l=quadF(f,-Infinity,0),r=quadF(f,0,Infinity);return{v:l.v+r.v,ok:l.ok&&r.ok}}
  if(b===Infinity){const g=t=>{const u=1-t;return f(a+t/u)/(u*u)};return tsFinite(g,0,1)}
  if(a===-Infinity){const g=t=>{const u=1-t;return f(b-t/u)/(u*u)};return tsFinite(g,0,1)}
  const n=Math.max(1,Math.min(48,Math.ceil((b-a)/1.5)));let v=0,ok=true;
  for(let i=0;i<n;i++){const r=tsFinite(f,a+(b-a)*i/n,a+(b-a)*(i+1)/n);v+=r.v;ok=ok&&r.ok}
  return{v,ok}}
export function singular(f,a,b){const out=[];if(!(isFinite(a)&&isFinite(b)))return out;const N=1200,h=(b-a)/N,ys=[];
  for(let i=0;i<=N;i++)ys.push(f(a+h*i));
  const big=v=>!isFinite(v)||Math.abs(v)>1e7;
  const removable=x=>{const d=1e-7*Math.max(1,Math.abs(x)),y1=f(x+d),y2=f(x-d);return isNaN(f(x))&&isFinite(y1)&&isFinite(y2)&&Math.abs(y1)<1e7&&Math.abs(y1-y2)<1e-3*(1+Math.abs(y1))};
  for(let i=0;i<=N;i++){if(!big(ys[i]))continue;let x=a+h*i;if(removable(x))continue;
    const nb=[ys[i-1],ys[i+1]].filter(v=>v!==undefined);if(isFinite(ys[i])&&nb.every(v=>isFinite(v)&&Math.abs(v)<Math.abs(ys[i])*1e-3))continue;
    if(!out.some(s=>Math.abs(s-x)<h*3))out.push(x)}
  for(let i=1;i<N;i++){const y0=Math.abs(ys[i-1]),y1=Math.abs(ys[i]),y2=Math.abs(ys[i+1]);
    if(isFinite(y1)&&y1>y0&&y1>y2&&y1>50*(1+Math.min(y0,y2))){let lo=a+h*(i-1),hi=a+h*(i+1);for(let k=0;k<60;k++){const m1=lo+(hi-lo)/3,m2=hi-(hi-lo)/3;if(Math.abs(f(m1))>Math.abs(f(m2)))hi=m2;else lo=m1}
      const x=(lo+hi)/2,v=Math.abs(f(x));if((!isFinite(v)||v>1e6)&&!out.some(s=>Math.abs(s-x)<h*3))out.push(snap(x))}}
  return out.map(x=>{const r=snap(Math.round(x*1e6)/1e6);return Math.abs(r-x)<1e-5?r:x}).sort((p,q)=>p-q)}
