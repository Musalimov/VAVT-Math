import { Q, Z0 } from '../../../math/fractions.js';
import { simplex } from '../../../math/simplex.js';
import { numG } from '../../../shared/econ/expr-xy.js';

export function lpSolve(c,sense,cons,signs){const n=c.length;const P={vars:c.map((_,i)=>'v'+(i+1)),sense,c:c.map(Q.of),c0:Z0,cons:cons.map(k=>({a:k.a.map(Q.of),op:k.op,b:Q.of(k.b)})),sign:signs||c.map(()=>'free'),int:c.map(()=>false),bin:c.map(()=>false),anySign:true};
  const r=simplex(P);return{status:r.status,value:r.value?r.value.v:null,x:r.x?r.x.map(q=>q.v):null}}
export function parseMat(txt){const rows=txt.trim().split('\n').map(l=>l.trim()).filter(Boolean).map(l=>l.replace(/[−–]/g,'-').split(/[\s;|\t]+/).filter(Boolean).map(s=>{const v=numG(s);return v}));
  if(!rows.length||rows.some(r=>r.length!==rows[0].length))throw{msg:'len'};return rows}
export function bimatrix(A,B){const m=A.length,n=A[0].length,br1=[],br2=[];for(let j=0;j<n;j++){const mx=Math.max(...A.map(r=>r[j]));br1.push(A.map(r=>Math.abs(r[j]-mx)<1e-12))}
  for(let i=0;i<m;i++){const mx=Math.max(...B[i]);br2.push(B[i].map(v=>Math.abs(v-mx)<1e-12))}const pure=[];for(let i=0;i<m;i++)for(let j=0;j<n;j++)if(br1[j][i]&&br2[i][j])pure.push([i,j]);
  let mixed=null;if(m===2&&n===2){const dA=A[0][0]-A[0][1]-A[1][0]+A[1][1],dB=B[0][0]-B[0][1]-B[1][0]+B[1][1];
    if(Math.abs(dA)>1e-12&&Math.abs(dB)>1e-12){const q=(A[1][1]-A[0][1])/dA,p=(B[1][1]-B[1][0])/dB;if(p>1e-12&&p<1-1e-12&&q>1e-12&&q<1-1e-12){const u1=q*A[0][0]+(1-q)*A[0][1],u2=p*B[0][0]+(1-p)*B[1][0];mixed={p,q,u1,u2,dA,dB}}}}
  return{m,n,br1,br2,pure,mixed,mixN:m===2&&n===2?[]:mixedNE(A,B)}}
export function linSolve(M,b){const n=b.length,a=M.map((r,i)=>[...r,b[i]]);for(let c=0;c<n;c++){let p=c;for(let r=c+1;r<n;r++)if(Math.abs(a[r][c])>Math.abs(a[p][c]))p=r;
    if(Math.abs(a[p][c])<1e-12)return null;[a[c],a[p]]=[a[p],a[c]];for(let r=0;r<n;r++){if(r===c)continue;const f=a[r][c]/a[c][c];for(let k=c;k<=n;k++)a[r][k]-=f*a[c][k]}}
  return a.map((r,i)=>r[n]/r[i])}
export function subsets(n,k){const out=[],cur=[];const go=s=>{if(cur.length===k){out.push(cur.slice());return}for(let i=s;i<n;i++){cur.push(i);go(i+1);cur.pop()}};go(0);return out}
export function mixedNE(A,B){const m=A.length,n=A[0].length,eps=1e-9,out=[];
  for(let k=2;k<=Math.min(m,n);k++)for(const I of subsets(m,k))for(const J of subsets(n,k)){
    // y: Σ_j A[i][j]·y_j − u = 0 (i ∈ I), Σ y_j = 1
    const My=I.map(i=>[...J.map(j=>A[i][j]),-1]);My.push([...J.map(()=>1),0]);const sy=linSolve(My,[...I.map(()=>0),1]);if(!sy)continue;
    const Mx=J.map(j=>[...I.map(i=>B[i][j]),-1]);Mx.push([...I.map(()=>1),0]);const sx=linSolve(Mx,[...J.map(()=>0),1]);if(!sx)continue;
    const yv=sy.slice(0,k),u1=sy[k],xv=sx.slice(0,k),u2=sx[k];if(yv.some(v=>v<=eps)||xv.some(v=>v<=eps))continue;
    const x=Array(m).fill(0),y=Array(n).fill(0);I.forEach((i,t)=>x[i]=xv[t]);J.forEach((j,t)=>y[j]=yv[t]);
    let ok=true;for(let i=0;i<m&&ok;i++){const r=A[i].reduce((s,a,j)=>s+a*y[j],0);if(r>u1+1e-7)ok=false}
    for(let j=0;j<n&&ok;j++){let c=0;for(let i=0;i<m;i++)c+=B[i][j]*x[i];if(c>u2+1e-7)ok=false}
    if(ok&&!out.some(e=>e.x.every((v,i)=>Math.abs(v-x[i])<1e-7)&&e.y.every((v,j)=>Math.abs(v-y[j])<1e-7)))out.push({x,y,u1,u2})}
  return out}
export function dominance(A,B){let R=A.map((_,i)=>i),C=A[0].map((_,j)=>j);const steps=[];let ch=true;
  while(ch){ch=false;for(const i of R){for(const k of R){if(k===i)continue;if(C.every(j=>A[k][j]>A[i][j])){steps.push({p:1,out:i,by:k});R=R.filter(x=>x!==i);ch=true;break}}if(ch)break}if(ch)continue;
    for(const j of C){for(const k of C){if(k===j)continue;if(R.every(i=>B[i][k]>B[i][j])){steps.push({p:2,out:j,by:k});C=C.filter(x=>x!==j);ch=true;break}}if(ch)break}}
  return{steps,R,C}}
export function zeroSum(A){const m=A.length,n=A[0].length;const rmin=A.map(r=>Math.min(...r)),cmax=A[0].map((_,j)=>Math.max(...A.map(r=>r[j])));const lo=Math.max(...rmin),hi=Math.min(...cmax);
  const saddle=[];for(let i=0;i<m;i++)for(let j=0;j<n;j++)if(A[i][j]===rmin[i]&&A[i][j]===cmax[j])saddle.push([i,j]);
  // смешанные: max v, Σp a_ij >= v, Σp = 1, p >= 0
  const c1=[...new Array(m).fill(0),1];const cons1=A[0].map((_,j)=>({a:[...A.map(r=>r[j]),-1],op:'>=',b:0}));cons1.push({a:[...new Array(m).fill(1),0],op:'=',b:1});
  const r1=lpSolve(c1,'max',cons1,[...new Array(m).fill('ge'),'free']);
  const c2=[...new Array(n).fill(0),1];const cons2=A.map(r=>({a:[...r,-1],op:'<=',b:0}));cons2.push({a:[...new Array(n).fill(1),0],op:'=',b:1});
  const r2=lpSolve(c2,'min',cons2,[...new Array(n).fill('ge'),'free']);
  return{rmin,cmax,lo,hi,saddle,p:r1.x?r1.x.slice(0,m):null,q:r2.x?r2.x.slice(0,n):null,v:r1.value}}
export function cournot(M,cs){const N=cs.length;let act=cs.map((_,i)=>i),q;for(let it=0;it<N+1;it++){const k=act.length,S=act.reduce((s,i)=>s+cs[i],0),Q=(k*M-S)/(k+1);q=cs.map((c,i)=>act.includes(i)?M-c-Q:0);const neg=act.filter(i=>q[i]<=1e-12);if(!neg.length)break;act=act.filter(i=>!neg.includes(i))}
  const Q=q.reduce((a,b)=>a+b,0),P=Math.max(0,M-Q);return{N,q,Q,P,pi:q.map((x,i)=>x*(P-cs[i])),act}}
export function hull(pts){pts=pts.slice().sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);const lo=[],up=[];
  for(const p of pts){while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],p)<=1e-12)lo.pop();lo.push(p)}for(const p of pts.slice().reverse()){while(up.length>=2&&cr(up[up.length-2],up[up.length-1],p)<=1e-12)up.pop();up.push(p)}
  up.pop();lo.pop();return lo.concat(up)}
export function pareto(H){// вершины на северо-восточной границе
  return H.filter(p=>!H.some(q=>q[0]>=p[0]-1e-12&&q[1]>=p[1]-1e-12&&(q[0]>p[0]+1e-12||q[1]>p[1]+1e-12))).sort((a,b)=>a[0]-b[0])}
export function bargain(pts,d){const H=hull(pts),F=pareto(H);if(!F.length)throw{msg:'hull'};
  const inside=p=>{for(let i=0;i<H.length;i++){const a=H[i],b=H[(i+1)%H.length];if((b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0])<-1e-9)return false}return true};
  if(!inside(d))throw{msg:'dout'};
  let best=null;const segs=F.length===1?[[F[0],F[0]]]:F.slice(0,-1).map((p,i)=>[p,F[i+1]]);
  for(const[a,b]of segs){// x = a + t(b-a), maximize (x1-d1)(x2-d2), t in [0,1]
    const u=[a[0]-d[0],a[1]-d[1]],w=[b[0]-a[0],b[1]-a[1]];const A2=w[0]*w[1],B1=u[0]*w[1]+u[1]*w[0];const cand=[0,1];if(Math.abs(A2)>1e-14)cand.push(-B1/(2*A2));
    for(const t of cand){if(t<-1e-12||t>1+1e-12)continue;const x=[a[0]+t*w[0],a[1]+t*w[1]];if(x[0]<d[0]-1e-12||x[1]<d[1]-1e-12)continue;const v=(x[0]-d[0])*(x[1]-d[1]);if(!best||v>best.v+1e-12)best={x,v}}}
  // идеальная точка: max x_i при x_j >= d_j
  const maxAlong=(i)=>{let mx=-Infinity;for(let k=0;k<H.length;k++){const a=H[k],b=H[(k+1)%H.length];for(const t of[0,1]){const p=t?b:a;if(p[1-i]>=d[1-i]-1e-12)mx=Math.max(mx,p[i])}const dd=b[1-i]-a[1-i];if(Math.abs(dd)>1e-14){const t=(d[1-i]-a[1-i])/dd;if(t>=0&&t<=1)mx=Math.max(mx,a[i]+t*(b[i]-a[i]))}}return mx};
  const ideal=[maxAlong(0),maxAlong(1)];const dir=[ideal[0]-d[0],ideal[1]-d[1]];let ks=null;
  for(const[a,b]of segs){const w=[b[0]-a[0],b[1]-a[1]];const det=dir[0]*(-w[1])-dir[1]*(-w[0]);if(Math.abs(det)<1e-14){continue}const rx=a[0]-d[0],ry=a[1]-d[1];const s=(rx*(-w[1])-ry*(-w[0]))/det,t=(dir[0]*ry-dir[1]*rx)/det;if(t>=-1e-9&&t<=1+1e-9&&s>=0){ks={x:[d[0]+s*dir[0],d[1]+s*dir[1]],s};break}}
  if(!ks&&F.length===1)ks={x:F[0]};return{H,F,nash:best,ideal,ks}}
export function coalitions(n){const L=[];for(let m=1;m<(1<<n);m++)L.push(m);return L.sort((a,b)=>pc(a)-pc(b)||a-b)}
export const pc=m=>m.toString(2).split('').filter(c=>c==='1').length;
export function perms(n){const r=[];const rec=(a,u)=>{if(a.length===n){r.push(a.slice());return}for(let i=0;i<n;i++)if(!u[i]){u[i]=1;a.push(i);rec(a,u);a.pop();u[i]=0}};rec([],[]);return r}
export function shapley(n,v){const ps=perms(n),phi=new Array(n).fill(0),tab=[];for(const p of ps){let m=0;const row=[];for(const i of p){const nm=m|(1<<i);row.push([i,v[nm]-v[m]]);phi[i]+=v[nm]-v[m];m=nm}tab.push({p,row})}return{phi:phi.map(x=>x/ps.length),tab}}
export function coreLP(n,v){const N=(1<<n)-1,cons=[];for(const K of coalitions(n)){if(K===N)continue;cons.push({a:[...Array(n)].map((_,i)=>(K>>i)&1),op:'>=',b:v[K]})}cons.push({a:new Array(n).fill(1),op:'=',b:v[N]});
  const r=lpSolve(new Array(n).fill(0),'max',cons,new Array(n).fill('free'));return{nonempty:r.status==='optimal',x:r.x}}
export function convexG(n,v){const viol=[];for(let S=1;S<(1<<n);S++)for(let T=S+1;T<(1<<n);T++){if(v[S|T]+v[S&T]<v[S]+v[T]-1e-9)viol.push([S,T])}return viol}
export function prenucleolus(n,v){const N=(1<<n)-1,Ks=coalitions(n).filter(K=>K!==N);let free=Ks.slice();const fixed=[];const steps=[];const vec=K=>[...Array(n)].map((_,i)=>(K>>i)&1);
  for(let it=0;it<20&&free.length;it++){// min t: v(K) - x(K) <= t (free), = e (fixed), x(N)=v(N)
    const cons=[];free.forEach(K=>cons.push({a:[...vec(K).map(a=>-a),-1],op:'<=',b:-v[K]}));fixed.forEach(([K,e])=>cons.push({a:[...vec(K),0],op:'=',b:v[K]-e}));cons.push({a:[...new Array(n).fill(1),0],op:'=',b:v[N]});
    const r=lpSolve([...new Array(n).fill(0),1],'min',cons,new Array(n+1).fill('free'));if(r.status!=='optimal')return{fail:true,steps};const t=r.value;const tight=[];
    for(const K of free){const c2=cons.map(c=>({...c}));c2.push({a:[...new Array(n).fill(0),1],op:'=',b:t});const r2=lpSolve([...vec(K),0],'min',c2,new Array(n+1).fill('free'));// min x(K) => max excess
      const r3=lpSolve([...vec(K),0],'max',c2,new Array(n+1).fill('free'));if(r3.status==='optimal'&&Math.abs((v[K]-r3.value)-t)<1e-9)tight.push(K)}
    if(!tight.length)break;tight.forEach(K=>fixed.push([K,t]));free=free.filter(K=>!tight.includes(K));steps.push({t,tight,x:r.x.slice(0,n)});
    // ранг
    const rows=[new Array(n).fill(1),...fixed.map(([K])=>vec(K))];if(rank(rows)>=n){const b=[v[N],...fixed.map(([K,e])=>v[K]-e)];return{x:solveLS(rows,b),steps}}}
  return{x:steps.length?steps[steps.length-1].x:null,steps}}
export function rank(M){M=M.map(r=>r.slice());let rk=0;const n=M[0].length;for(let c=0;c<n&&rk<M.length;c++){let p=-1;for(let i=rk;i<M.length;i++)if(Math.abs(M[i][c])>1e-9){p=i;break}if(p<0)continue;[M[rk],M[p]]=[M[p],M[rk]];for(let i=0;i<M.length;i++)if(i!==rk){const f=M[i][c]/M[rk][c];for(let j=c;j<n;j++)M[i][j]-=f*M[rk][j]}rk++}return rk}
export function solveLS(A,b){const n=A[0].length;const M=A.map((r,i)=>[...r,b[i]]);let row=0;const piv=[];for(let c=0;c<n;c++){let p=-1;for(let i=row;i<M.length;i++)if(Math.abs(M[i][c])>1e-9){p=i;break}if(p<0)continue;[M[row],M[p]]=[M[p],M[row]];const pv=M[row][c];M[row]=M[row].map(x=>x/pv);for(let i=0;i<M.length;i++)if(i!==row){const f=M[i][c];M[i]=M[i].map((x,j)=>x-f*M[row][j])}piv.push(c);row++}const x=new Array(n).fill(0);piv.forEach((c,i)=>{x[c]=M[i][n]});return x}
export function auction(n,w){return{fp:v=>(n-1)/n*v,sp:v=>v,ap:v=>(n-1)/n*Math.pow(v,n)/Math.pow(w,n-1),rev:w*(n-1)/(n+1)}}
export function contGame(H1,H2,a1,b1,a2,b2){const N=240,fine=1200;const xs=[...Array(N+1)].map((_,k)=>a1+(b1-a1)*k/N),ys=[...Array(N+1)].map((_,k)=>a2+(b2-a2)*k/N);
  const argmax=(f,a,b)=>{let bv=-Infinity,bx=[];for(let k=0;k<=fine;k++){const t=a+(b-a)*k/fine,v=f(t);if(!isFinite(v))continue;if(!bx.length||v>bv+1e-9*Math.max(1,Math.abs(bv))){bv=v;bx=[t]}else if(Math.abs(v-bv)<=1e-9*Math.max(1,Math.abs(bv)))bx.push(t)}
    const stp=(b-a)/fine;if(bx.length>=1&&bx.length<=3&&bx[bx.length-1]-bx[0]<=2.5*stp){let l=Math.max(a,bx[0]-stp),r=Math.min(b,bx[bx.length-1]+stp);for(let it=0;it<60;it++){const m1=l+(r-l)/3,m2=r-(r-l)/3;if(f(m1)<f(m2))l=m1;else r=m2}const xr=(l+r)/2,vr=f(xr);if(vr>=bv){bx=[xr];bv=vr}}return{x:bx,v:bv}};
  const br1=ys.map(y=>argmax(x=>H1(x,y),a1,b1)),br2=xs.map(x=>argmax(y=>H2(x,y),a2,b2));
  // равновесия: итерации наилучших ответов из разных стартов + сеточная проверка
  let eq=[];const add=p=>{if(!eq.some(q=>Math.hypot(q[0]-p[0],q[1]-p[1])<1e-4*(1+Math.abs(b1-a1))))eq.push(p)};
  const isNE=(x,y)=>{const r1=argmax(t=>H1(t,y),a1,b1),r2=argmax(t=>H2(x,t),a2,b2);const t1=1e-7*Math.max(1,Math.abs(r1.v)),t2=1e-7*Math.max(1,Math.abs(r2.v));return H1(x,y)>=r1.v-t1&&H2(x,y)>=r2.v-t2};
  for(const sx of[a1,b1,(a1+b1)/2,a1+(b1-a1)*.25])for(const sy of[a2,b2,(a2+b2)/2,a2+(b2-a2)*.75]){let x=sx,y=sy;for(let it=0;it<200;it++){const nx=argmax(t=>H1(t,y),a1,b1).x[0],ny=argmax(t=>H2(nx,t),a2,b2).x[0];const d=Math.hypot(nx-x,ny-y);x=nx;y=ny;if(d<1e-10)break}if(isNE(x,y))add([x,y])}
  const grid=[];const G=60;for(let i=0;i<=G;i++)for(let j=0;j<=G;j++){const x=a1+(b1-a1)*i/G,y=a2+(b2-a2)*j/G;if(isNE(x,y))grid.push([x,y])}
  grid.forEach(add);const gain=([x,y])=>Math.max(argmax(t=>H1(t,y),a1,b1).v-H1(x,y),argmax(t=>H2(x,t),a2,b2).v-H2(x,y));const many=grid.length>6;
  const polish=([x,y])=>{for(let it=0;it<400;it++){const nx=argmax(t=>H1(t,y),a1,b1).x[0],ny=argmax(t=>H2(nx,t),a2,b2).x[0];if(Math.abs(nx-x)+Math.abs(ny-y)<1e-13){x=nx;y=ny;break}x=nx;y=ny}return isNE(x,y)?[x,y]:null};
  let out=eq;if(!many){out=[];eq=eq.map(p=>polish(p)||p);const tol=.01*Math.max(b1-a1,b2-a2);eq.map(p=>[p,gain(p)]).sort((u,v)=>u[1]-v[1]).forEach(([p])=>{if(!out.some(q=>Math.hypot(q[0]-p[0],q[1]-p[1])<tol))out.push(p)});out=out.map(p=>p.map(v=>{const r=Math.round(v*1e4)/1e4;return Math.abs(r-v)<2e-4?r:v}))}
  let line=null;if(many&&grid.length>=3){const pts=grid.filter(p=>!grid.every(q=>q===p));const[p0]=grid;const far=grid.reduce((b,q)=>Math.hypot(q[0]-p0[0],q[1]-p0[1])>Math.hypot(b[0]-p0[0],b[1]-p0[1])?q:b,p0);const dx=far[0]-p0[0],dy=far[1]-p0[1],L=Math.hypot(dx,dy)||1;
    const on=grid.filter(q=>Math.abs((q[0]-p0[0])*dy-(q[1]-p0[1])*dx)/L<1e-6*(1+L));const off=grid.filter(q=>!on.includes(q));line={a:p0,b:far,n:on.length,off}}
  return{xs,ys,br1,br2,eq:out,grid,many,line}}
export function oligo(model,M,c1,c2){const mono=(M-c1)/2,out={model,M,c1,c2};
  if(model==='stack'){const f2=q1=>Math.max(0,(M-c2-q1)/2),prof=q1=>{const q2=f2(q1);return q1*(Math.max(0,M-q1-q2)-c1)};const lim=Math.max(0,M-c2);
    const cand=[0,lim,Math.min(lim,Math.max(0,(M-2*c1+c2)/2)),Math.max(lim,(M-c1)/2)];let q1=cand[0];for(const q of cand)if(prof(q)>prof(q1)+1e-12)q1=q;
    const q2=f2(q1),P=Math.max(0,M-q1-q2);Object.assign(out,{q:[q1,q2],P,pi:[q1*(P-c1),q2*(P-c2)],deter:q2<=1e-12&&Math.abs(q1-lim)<1e-12&&(M-c1)/2<lim})}
  else if(model==='bert'){let p,q;if(Math.abs(c1-c2)<1e-12){p=[c1,c2];const Q=Math.max(0,M-c1);q=[Q/2,Q/2]}else if(c1<c2){const pm=(M+c1)/2;const p1=Math.min(c2,pm);p=[p1,c2];q=[Math.max(0,M-p1),0]}else{const pm=(M+c2)/2;const p2=Math.min(c1,pm);p=[c1,p2];q=[0,Math.max(0,M-p2)]}
    Object.assign(out,{p,q,P:Math.min(...p),pi:[q[0]*(p[0]-c1),q[1]*(p[1]-c2)]})}
  else{const r=cournot(M,[c1,c2]);Object.assign(out,{q:r.q,P:r.P,pi:r.pi})}
  // сравнение при одинаковых издержках c1
  const c=c1,cmp={mono:{Q:(M-c)/2,P:(M+c)/2},cour:{Q:2*(M-c)/3,P:(M+2*c)/3},stack:{Q:3*(M-c)/4,P:(M+3*c)/4},comp:{Q:M-c,P:c}};for(const k in cmp){const o=cmp[k];o.PS=o.Q*(o.P-c);o.CS=o.Q*o.Q/2;o.DWL=(M-c-o.Q)*(o.P-c)/2}out.cmp=cmp;return out}
export function hotelPrice(a,b,t,c){// фирмы в точках a и 1-b, линейные транспортные издержки t
  const D1=(p1,p2)=>{const xh=(p2-p1+t*(1-b+a))/(2*t);return Math.max(0,Math.min(1,xh))};const pi1=(p1,p2)=>(p1-c)*D1(p1,p2),pi2=(p1,p2)=>(p2-c)*(1-D1(p1,p2));
  const br=(f,o,first)=>{let l=c,r=c+4*t+1;for(let it=0;it<100;it++){const m1=l+(r-l)/3,m2=r-(r-l)/3;const v1=first?f(m1,o):f(o,m1),v2=first?f(m2,o):f(o,m2);if(v1<v2)l=m1;else r=m2}return(l+r)/2};
  let p1=c+t,p2=c+t;for(let it=0;it<300;it++){const n1=br(pi1,p2,true),n2=br(pi2,n1,false);if(Math.abs(n1-p1)+Math.abs(n2-p2)<1e-12){p1=n1;p2=n2;break}p1=n1;p2=n2}
  const f1=c+t*(1+(a-b)/3),f2=c+t*(1+(b-a)/3);return{p:[p1,p2],formula:[f1,f2],x:D1(p1,p2),pi:[pi1(p1,p2),pi2(p1,p2)]}}
export function hotelLoc(){return{eq:[.5,.5]}}
export function parseTree(txt){const nodes={},order=[];for(const l0 of txt.split('\n')){const l=l0.trim();if(!l)continue;const m=/^([^:]+):\s*(\d+)\s*(.*)$/.exec(l);if(!m)throw{msg:'tree'};const id=m[1].trim(),pl=+m[2];
    const acts=m[3].split('|').map(s=>s.trim()).filter(Boolean).map(s=>{const mm=/^(.*?)\s*->\s*(.+)$/.exec(s);if(!mm)throw{msg:'tree'};const to=mm[2].trim();const pay=/^\((.*)\)$/.exec(to);
      return{a:mm[1].trim(),to:pay?null:to,pay:pay?pay[1].split(/[;,]/).map(v=>numG(v)):null}});if(!acts.length)throw{msg:'tree'};nodes[id]={id,pl,acts};order.push(id)}
  if(!order.length)throw{msg:'tree'};for(const id of order)for(const a of nodes[id].acts)if(a.to&&!nodes[a.to])throw{msg:'treeRef',x:a.to};return{nodes,root:order[0],order}}
export function backward(T){const val={},choice={},ties={},log=[];let np=0;const vis=new Set();
  const rec=id=>{if(vis.has(id))throw{msg:'treeCyc'};vis.add(id);const n=T.nodes[id];const opts=n.acts.map(a=>a.pay?a.pay:rec(a.to));np=Math.max(np,...opts.map(o=>o.length));const k=n.pl-1;let best=0;
    opts.forEach((o,i)=>{if(o[k]>opts[best][k]+1e-12)best=i});ties[id]=opts.filter(o=>Math.abs(o[k]-opts[best][k])<1e-12).length>1;choice[id]=best;val[id]=opts[best];log.push({id,pl:n.pl,opts,best});vis.delete(id);return opts[best]};
  const v=rec(T.root);const path=[];let cur=T.root;while(cur){const n=T.nodes[cur],a=n.acts[choice[cur]];path.push([cur,choice[cur]]);cur=a.to}return{v,choice,val,log,path,ties,np}}
export const STRATS=['ALLC','ALLD','TFT','STFT','GRIM','WSLS','RAND'];
export function playRep(s1,s2,n,pay,seed){let h1=[],h2=[];let r=seed;const rnd=()=>{r=(r*1103515245+12345)%2147483648;return r/2147483648};
  const mv=(s,my,op)=>{const t=my.length;switch(s){case'ALLC':return 1;case'ALLD':return 0;case'TFT':return t?op[t-1]:1;case'STFT':return t?op[t-1]:0;case'GRIM':return op.includes(0)?0:1;case'WSLS':return t?(my[t-1]===op[t-1]?1:0):1;default:return rnd()<.5?1:0}};
  let u1=0,u2=0;const P=(a,b)=>a&&b?[pay.R,pay.R]:a&&!b?[pay.S,pay.T]:!a&&b?[pay.T,pay.S]:[pay.P,pay.P];for(let t=0;t<n;t++){const a=mv(s1,h1,h2),b=mv(s2,h2,h1);h1.push(a);h2.push(b);const[x,y]=P(a,b);u1+=x;u2+=y}return{u1,u2,h1,h2}}
export function tournament(n,pay){const M=STRATS.map(()=>STRATS.map(()=>0));STRATS.forEach((a,i)=>STRATS.forEach((b,j)=>{M[i][j]=playRep(a,b,n,pay,7+i*31+j).u1}));const tot=M.map(r=>r.reduce((x,y)=>x+y,0));return{M,tot}}
export function bayesGame(mu,A1,B1,A2,B2){const rows=[0,1],cols=[[0,0],[0,1],[1,0],[1,1]];const A=rows.map(i=>cols.map(([a,b])=>mu*A1[i][a]+(1-mu)*A2[i][b])),B=rows.map(i=>cols.map(([a,b])=>mu*B1[i][a]+(1-mu)*B2[i][b]));
  return{A,B,cols,bm:bimatrix(A,B),dom:dominance(A,B)}}
export function evoAnalysis(a){const[a11,a12]=a[0],[a21,a22]=a[1];const ess=[];if(a11>a21+1e-12||(Math.abs(a11-a21)<1e-12&&a12>a22+1e-12))ess.push('1');if(a22>a12+1e-12||(Math.abs(a22-a12)<1e-12&&a21>a11+1e-12))ess.push('2');
  const den=a12-a22+a21-a11;let xs=null,mixedESS=false;if(Math.abs(den)>1e-12){const x=(a12-a22)/den;if(x>1e-12&&x<1-1e-12){xs=x;mixedESS=a21>a11&&a12>a22}}
  const g=x=>x*(1-x)*((x*a11+(1-x)*a12)-(x*a21+(1-x)*a22));return{ess,xs,mixedESS,g}}
export function replicator(g,x0,Tm,dt=.01){const out=[[0,x0]];let x=x0;for(let t=dt;t<=Tm+1e-9;t+=dt){const k1=g(x),k2=g(x+dt*k1/2),k3=g(x+dt*k2/2),k4=g(x+dt*k3);x+=dt*(k1+2*k2+2*k3+k4)/6;x=Math.max(0,Math.min(1,x));out.push([t,x])}return out}
export function power(q,w){const n=w.length,tot=w.reduce((a,b)=>a+b,0),fact=[1];for(let i=1;i<=n;i++)fact[i]=fact[i-1]*i;const ss=new Array(n).fill(0),bz=new Array(n).fill(0);const win=[];
  for(let m=0;m<(1<<n);m++){let s=0,k=0;for(let i=0;i<n;i++)if((m>>i)&1){s+=w[i];k++}const W=s>=q-1e-12;if(W)win.push(m);if(W)continue;for(let i=0;i<n;i++)if(!((m>>i)&1)&&s+w[i]>=q-1e-12){ss[i]+=fact[k]*fact[n-k-1]/fact[n];bz[i]++}}
  const bt=bz.reduce((a,b)=>a+b,0);const minimal=win.filter(m=>{for(let i=0;i<n;i++)if((m>>i)&1){let s=0;for(let j=0;j<n;j++)if(j!==i&&(m>>j)&1)s+=w[j];if(s>=q-1e-12)return false}return true});
  const veto=w.map((_,i)=>win.every(m=>(m>>i)&1)),dummy=bz.map(b=>b===0);return{ss,bz,bzN:bz.map(b=>bt?b/bt:0),bzRaw:bz.map(b=>b/Math.pow(2,n-1)),win:win.length,minimal,veto,dummy,tot}}
export function galeShapley(propPref,recPref){const P=Object.keys(propPref),Rk=Object.keys(recPref);const next={},hold={},log=[];P.forEach(p=>{next[p]=0});let free=P.slice(),round=0;
  while(free.length&&round<200){round++;const props=[];const nf=[];for(const p of free){const list=propPref[p];if(next[p]>=list.length)continue;const r=list[next[p]++];props.push([p,r])}
    const ev=[];for(const[p,r]of props){const rank=x=>{const i=(recPref[r]||[]).indexOf(x);return i<0?1e9:i};const cur=hold[r];if(rank(p)>=1e9){ev.push([p,r,'rej']);nf.push(p);continue}
      if(cur===undefined){hold[r]=p;ev.push([p,r,'acc'])}else if(rank(p)<rank(cur)){hold[r]=p;ev.push([p,r,'acc',cur]);nf.push(cur)}else{ev.push([p,r,'rej']);nf.push(p)}}
    log.push({round,ev});free=nf.filter(p=>next[p]<propPref[p].length)}
  const match={};for(const r in hold)match[hold[r]]=r;
  const block=[];for(const p of P)for(const r of Rk){if(match[p]===r)continue;const pr=propPref[p].indexOf(r);if(pr<0)continue;const pc=match[p]===undefined?1e9:propPref[p].indexOf(match[p]);const rr=(recPref[r]||[]).indexOf(p);if(rr<0)continue;const holder=hold[r];const rc=holder===undefined?1e9:recPref[r].indexOf(holder);if(pr<pc&&rr<rc)block.push([p,r])}
  return{match,log,block,P,R:Rk}}
export function parsePrefs(txt){const o={};for(const l0 of txt.split('\n')){const l=l0.trim();if(!l)continue;const m=/^([^:]+):\s*(.*)$/.exec(l);if(!m)throw{msg:'pref'};o[m[1].trim()]=m[2].trim().split(/[\s,;>]+/).filter(Boolean)}if(!Object.keys(o).length)throw{msg:'pref'};return o}
export function braess(N,a,b,e,bridge){// маршруты: верх A-C-B, низ A-D-B, зигзаг A-C-D-B
  const times=(x1,x2,x3)=>[(x1+x3)/a+b,b+(x2+x3)/a,(x1+x3)/a+e+(x2+x3)/a];const R=bridge?3:2;let best=null;
  const subs=bridge?[[0],[1],[2],[0,1],[0,2],[1,2],[0,1,2]]:[[0],[1],[0,1]];
  for(const sup of subs){// решаем: используемые маршруты имеют равное время, сумма = N
    let x=null;const solve=()=>{// линейная система: переменные x_s (s в sup) и T
      const k=sup.length,M=[],rhs=[];const coef=(r,j)=>{const[c1,c2,c3]=[[1/a,0,1/a],[0,1/a,1/a],[1/a,1/a,2/a]][r];return[c1,c2,c3][j]};const cst=[b,b,e];
      for(const r of sup){const row=sup.map(j=>coef(r,j));row.push(-1);M.push(row);rhs.push(-cst[r])}M.push([...sup.map(()=>1),0]);rhs.push(N);const sol=solveLS(M,rhs);return sol};
    const s=solve();if(!s)continue;const xv=[0,0,0];sup.forEach((j,i)=>{xv[j]=s[i]});if(xv.some(v=>v<-1e-9))continue;const t=times(...xv);const T=Math.min(...sup.map(j=>t[j]));if(sup.some(j=>Math.abs(t[j]-T)>1e-7))continue;
    let okk=true;for(let j=0;j<R;j++)if(!sup.includes(j)&&t[j]<T-1e-9)okk=false;if(okk){best={x:xv.map(v=>Math.max(0,v)),t,T};break}}
  // социальный оптимум
  let opt=null;const G=200;for(let i=0;i<=G;i++)for(let j=0;j<=(bridge?G-i:0);j++){const x3=bridge?N*j/G:0,x1=N*i/G;const x2=N-x1-x3;if(x2<-1e-9)continue;const t=times(x1,x2,x3);const tot=x1*t[0]+x2*t[1]+x3*t[2];if(!opt||tot<opt.tot)opt={x:[x1,x2,x3],tot,avg:tot/N}}
  return{eq:best,opt}}
