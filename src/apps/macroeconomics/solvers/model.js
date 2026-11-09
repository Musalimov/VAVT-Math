import { T } from '../content/tx.js';

export function gdpCalc(rows){// rows: [name, P0, Q0, P1, Q1]
  const s=(f)=>rows.reduce((a,r)=>a+f(r),0);const nom0=s(r=>r[1]*r[2]),nom1=s(r=>r[3]*r[4]),real1=s(r=>r[1]*r[4]),cpi1=s(r=>r[3]*r[2]);
  const defl=100*nom1/real1,cpi=100*cpi1/nom0;return{nom0,nom1,real0:nom0,real1,defl,cpi,gReal:real1/nom0-1,gNom:nom1/nom0-1,piDefl:defl/100-1,piCPI:cpi/100-1}}
export const natU=(s,f)=>s/(s+f);
export const okun=(du,gN=.03)=>gN-2*du;
export function natInc(A,K,L,al){const Y=A*Math.pow(K,al)*Math.pow(L,1-al),MPK=al*Y/K,MPL=(1-al)*Y/L;return{Y,MPK,MPL,capShare:MPK*K/Y,labShare:MPL*L/Y}}
export function loanable(Y,a,b,G,T,c,d){// C = a + b(Y−T), I = c − d r
  const C=a+b*(Y-T),S=Y-C-G,Spriv=Y-T-C,Spub=T-G,r=(c-S)/d;return{C,S,Spriv,Spub,r,I:S}}
export function qtheory(gM,gV,gY,r){const pi=gM+gV-gY;return{pi,i:r+pi}}
export const moneyMult=(cr,rr)=>(cr+1)/(cr+rr);
export function smallOpen(Y,a,b,G,T,c,d,rs,n0,n1){const C=a+b*(Y-T),S=Y-C-G,I=c-d*rs,NX=S-I,eps=n1?(n0-NX)/n1:NaN;return{C,S,I,NX,eps}}
export function solow(al,s,dl,n,g,k0,Tn){const br=dl+n+g,ks=Math.pow(s/br,1/(1-al)),ys=Math.pow(ks,al),cs=(1-s)*ys,kg=Math.pow(al/br,1/(1-al)),sg=al;// золотое правило: MPK = δ+n+g → s = α
  const tr=[];let k=k0;for(let t=0;t<=Tn;t++){const y=Math.pow(k,al);tr.push({t,k,y,c:(1-s)*y,inv:s*y,dep:br*k});k=k+s*y-br*k}return{br,ks,ys,cs,kg,yg:Math.pow(kg,al),cg:Math.pow(kg,al)-br*kg,sg,tr,gY:n+g,gy:g}}
export function kcross(a,b,I,G,T,t){const m=1/(1-b*(1-t));const Y=m*(a-b*T+I+G);return{Y,mG:m,mT:-b*m,mBB:(1-b)*m,C:a+b*(Y-T-t*Y)}}
export function islm(p){const{a,b,c,d,G,T,M,P,e,f}=p;// IS: Y(1−b) = a − bT + c + G − d r ; LM: eY − f r = M/P
  const A=a-b*T+c+G,mp=M/P;const r=(e*A-(1-b)*mp)/(e*d+(1-b)*f),Y=(A-d*r)/(1-b);const C=a+b*(Y-T),I=c-d*r;
  const den=(1-b)+d*e/f;return{A,mp,r,Y,C,I,ISY:rr=>(A-d*rr)/(1-b),LMY:rr=>(mp+f*rr)/e,mG:1/den,mT:-b/den,mM:(d/f)/den/P,crowd:1/(1-b)-1/den}}
export function mundell(p){const{a,b,c,d,G,T,M,P,e,f,rs,n0,n1,reg}=p;const Y=(M/P+f*rs)/e;// LM* вертикальна
  const I=c-d*rs,C=a+b*(Y-T),NX=Y-C-I-G,ex=(n0-NX)/n1;return{Y,I,C,NX,e:ex,IS:ee=>(a-b*T+I+G+n0-n1*ee)/(1-b),LMY:Y}}
export function mundellFixed(p,eFix){const{a,b,c,d,G,T,P,e,f,rs,n0,n1}=p;const I=c-d*rs,Y=(a-b*T+I+G+n0-n1*eFix)/(1-b),M=P*(e*Y-f*rs);return{Y,M,I,C:a+b*(Y-T),NX:n0-n1*eFix}}
export function adas(M,V,Yb,al,Pe){// P·(Ȳ + α(P − Pe)) = MV → αP² + (Ȳ − αPe)P − MV = 0
  const A=al,B=Yb-al*Pe,C=-M*V;const P=al>0?(-B+Math.sqrt(B*B-4*A*C))/(2*A):Pe;const Y=M*V/P;return{P,Y,PL:M*V/Yb,AD:Pp=>M*V/Pp,AS:Pp=>Yb+al*(Pp-Pe)}}
export const phillips=(pe,be,un,u,v)=>pe-be*(u-un)+v;
