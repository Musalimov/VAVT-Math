import { Q } from '../../../math/fractions.js';
import { Q1, Z0 } from '../../../math/fractions.js';
export function parseNum(s){s=s.replace(',','.');if(s.includes('/')){const[a,b]=s.split('/');return parseNum(a).div(parseNum(b))}
  s=s.trim();if(!/^[-+]?(\d+\.?\d*|\.\d+)$/.test(s))throw{msg:'tok'};const neg=s[0]==='-';s=s.replace(/^[-+]/,'');
  const[i,f='']=s.split('.');const N=BigInt((i||'0')+f)*(neg?-1n:1n);return new Q(N,10n**BigInt(f.length))}
export function normLine(l){return l.replace(/[−–—]/g,'-').replace(/[⩽≤]/g,'<=').replace(/[⩾≥]/g,'>=').replace(/=</g,'<=').replace(/=>/g,'>=').replace(/→/g,'->').replace(/·|×|\*/g,'*').replace(/(\d),(\d)/g,'$1.$2').trim()}
export function natCmp(a,b){const ma=/^([a-zA-Zа-яА-Я_']*)(\d*)(.*)$/.exec(a),mb=/^([a-zA-Zа-яА-Я_']*)(\d*)(.*)$/.exec(b);if(ma[1]!==mb[1])return ma[1]<mb[1]?-1:1;const na=+ma[2]||0,nb=+mb[2]||0;if(na!==nb)return na-nb;return a<b?-1:a>b?1:0}
export function parseLin(s){// -> {coef:{name:Q}, c:Q}
  /* «1e3», «2,5e-2» (без пробелов): экспоненциальная запись или коэффициент при переменной e3? Не угадываем — просим уточнить.
     Проверяем до удаления пробелов: «3e + 2x» — это переменная e, а «2*e1» — явное умножение. */
  {const m=/(?:^|[^\w.,*\/])([\d.,\/]*\d[eE][-+]?\d+)/.exec(s);if(m)throw{msg:'exp',line:m[1]}}
  s=s.replace(/\s+/g,'');if(!s)throw{msg:'empty'};const out={coef:{},c:Z0};let i=0;
  if(s[0]!=='+'&&s[0]!=='-')s='+'+s;
  while(i<s.length){const sg=s[i]==='-'?-1:1;if(s[i]!=='+'&&s[i]!=='-')throw{msg:'tok',at:s.slice(i)};i++;
    let num=null,m=/^(\d+(\.\d+)?|\.\d+)(\/(\d+(\.\d+)?))?/.exec(s.slice(i));if(m){num=parseNum(m[0]);i+=m[0].length;if(s[i]==='*')i++}
    let v=null;m=/^([a-zA-Z][a-zA-Z_]*\d*'*|[a-zA-Z]_?\d+)/.exec(s.slice(i));if(m){v=m[0].replace('_','');i+=m[0].length}
    if(num===null&&v===null)throw{msg:'tok',at:s.slice(i)};
    let q=num||Q1;
    while(s[i]==='/'){m=/^\/(\d+(\.\d+)?)/.exec(s.slice(i));if(!m)throw{msg:'tok'};q=q.div(parseNum(m[1]));i+=m[0].length}
    if(sg<0)q=q.neg();
    if(v){out.coef[v]=(out.coef[v]||Z0).add(q)}else out.c=out.c.add(q)}
  return out}
export function parseProblem(text){const lines=[];for(const l0 of text.split(/\n|;/).map(normLine).filter(l=>l&&!/^\/\//.test(l))){const ops=[...l0.matchAll(/<=|>=/g)];
    if(ops.length===2){const a=ops[0],b=ops[1],L=l0.slice(0,a.index),M=l0.slice(a.index+2,b.index),Rr=l0.slice(b.index+2);lines.push(L+a[0]+M,M+b[0]+Rr)}else lines.push(l0)}
  let obj=null;const cons=[],sign={},ints=new Set(),bins=new Set();let allInt=false,allBin=false,anySign=false;
  const setSign=(v,sv,src)=>{if(sign[v]&&sign[v]!=='free'&&sign[v]!==sv)cons.push({coef:{[v]:Q.of(1)},op:sv==='ge'?'>=':'<=',b:Q.of(0),src});else sign[v]=sv};
  const varsIn=s=>(s.match(/[a-zA-Z][a-zA-Z_]*\d*'*/g)||[]).filter(w=>!/^(max|min|int|Z|N|z|bin)$/.test(w));
  for(const l0 of lines){let l=l0;
    if(/->|\b(max|min)\b/i.test(l)&&!/<=|>=/.test(l)){const sense=/max/i.test(l)?'max':'min';l=l.replace(/->/,' ').replace(/\b(max|min)\b/ig,' ').replace(/^\s*[a-zA-Z]\w*\s*\(?[^=()]*\)?\s*=/,' ').replace(/[:]/g,' ');
      obj={sense,...parseLin(l)};continue}
    if(/∈|\bint\b|целы|бинар|\bbin\b|\{0 ?[.,;] ?1\}/i.test(l)){const isB=/бинар|\bbin\b|\{0 ?[.,;] ?1\}/i.test(l);const vs=varsIn(l.replace(/\{[^}]*\}/,'').replace(/∈.*$/,''));
      if(!vs.length){if(isB)allBin=true;else allInt=true}else vs.forEach(v=>{(isB?bins:ints).add(v)});
      if(/>=\s*0|Z_?\+|Z>=0|⩾0/.test(l)||isB){vs.forEach(v=>{setSign(v,'ge',l0);anySign=true})}continue}
    if(/люб|free|произв|\bR\b|∈ ?R/i.test(l)&&!/<=|>=/.test(l)){varsIn(l).forEach(v=>{sign[v]='free'});continue}
    const m=/(<=|>=|=)/.exec(l);if(!m)throw{msg:'line',line:l0};const op=m[1],L=l.slice(0,m.index),R=l.slice(m.index+op.length);
    if(/,/.test(L)&&/^\s*0\s*$/.test(R)&&op!=='='){const vs=L.split(',').map(x=>x.trim().replace('_',''));if(vs.every(v=>/^[a-zA-Z][a-zA-Z_]*\d*'*$/.test(v))){vs.forEach(v=>{setSign(v,op==='>='?'ge':'le',l0);anySign=true});continue}}
    const lp=parseLin(L),rp=parseLin(R);const coef={...lp.coef};for(const k in rp.coef)coef[k]=(coef[k]||Z0).sub(rp.coef[k]);const b=rp.c.sub(lp.c);
    const ks=Object.keys(coef).filter(k=>!coef[k].z);
    if(ks.length===1&&b.z&&op!=='='){const k=ks[0],pos=coef[k].s>0;setSign(k,(op==='>=')===pos?'ge':'le',l0);anySign=true;continue}
    if(!ks.length){const hold=op==='<='?b.s>=0:op==='>='?b.s<=0:b.z;if(hold)continue;cons.push({coef:{},op,b,src:l0});continue}
    cons.push({coef,op,b,src:l0})}
  if(!obj)throw{msg:'noobj'};if(!cons.length&&!Object.keys(obj.coef).length)throw{msg:'nocons'};
  const names=new Set(Object.keys(obj.coef));cons.forEach(c=>Object.keys(c.coef).forEach(k=>names.add(k)));
  const expand=k=>{if(names.has(k))return[k];const ex=[...names].filter(n=>new RegExp('^'+k+'_?\\d').test(n));return ex.length?ex:[k]};
  for(const k of Object.keys(sign)){const e=expand(k);if(e.length>1||e[0]!==k){e.forEach(n=>{sign[n]=sign[k]});delete sign[k]}}
  for(const S of[ints,bins])for(const k of[...S]){const e=expand(k);if(e.length>1||e[0]!==k){S.delete(k);e.forEach(n=>S.add(n))}}
  Object.keys(sign).forEach(k=>names.add(k));
  const vars=[...names].sort(natCmp);if(!vars.length)throw{msg:'novars'};if(vars.length>14)throw{msg:'many'};if(cons.length>20)throw{msg:'manyc'};
  const P={vars,sense:obj.sense,c:vars.map(v=>obj.coef[v]||Z0),c0:obj.c,cons:cons.map(c=>({a:vars.map(v=>c.coef[v]||Z0),op:c.op,b:c.b})),
    sign:vars.map(v=>sign[v]||'free'),int:vars.map(v=>allInt||allBin||ints.has(v)||bins.has(v)),bin:vars.map(v=>allBin||bins.has(v)),anySign};
  P.cons=P.cons.filter(c=>!(c.a.every(x=>x.z)));
  P.bin.forEach((b,j)=>{if(b){P.sign[j]='ge';const implied=P.cons.some(c=>(c.op==='<='||c.op==='=')&&c.a[j].s>0&&c.a.every((q,k)=>q.s>=0||!P.bin[k])&&c.a.every(q=>q.s>=0)&&c.b.div(c.a[j]).cmp(Q1)<=0);if(!implied)P.cons.push({a:vars.map((_,k)=>k===j?Q1:Z0),op:'<=',b:Q1,auto:true})}});
  return P}
export function dualOf(P){const m=P.cons.length,n=P.vars.length,max=P.sense==='max';const base=P.vars.every(v=>/^y/.test(v))?'u':'y';
  const dv=P.cons.map((_,i)=>base+(i+1));
  const sign=P.cons.map(c=>c.op==='='?'free':max?(c.op==='<='?'ge':'le'):(c.op==='<='?'le':'ge'));
  const cons=P.vars.map((_,j)=>({a:P.cons.map(c=>c.a[j]),op:P.sign[j]==='free'?'=':max?(P.sign[j]==='ge'?'>=':'<='):(P.sign[j]==='ge'?'<=':'>='),b:P.c[j]}));
  return{vars:dv,sense:max?'min':'max',c:P.cons.map(c=>c.b),c0:P.c0,cons,sign,int:dv.map(()=>false),bin:dv.map(()=>false),anySign:true,isDual:true}}
export const dot=(a,x)=>a.reduce((s,ai,j)=>s.add(ai.mul(x[j])),Z0);
export function feasible(P,x){for(let j=0;j<x.length;j++){if(P.sign[j]==='ge'&&x[j].s<0)return false;if(P.sign[j]==='le'&&x[j].s>0)return false}
  return P.cons.every(c=>{const l=dot(c.a,x),d=l.cmp(c.b);return c.op==='<='?d<=0:c.op==='>='?d>=0:d===0})}
export function solveSys(A,b){// A: m x k (Q), returns {x:[Q]} if unique, {none:true} if inconsistent, {many:true} otherwise
  const m=A.length,k=A[0]?A[0].length:0;const M=A.map((r,i)=>[...r,b[i]]);let row=0;const piv=[];
  for(let c=0;c<k&&row<m;c++){let p=-1;for(let i=row;i<m;i++)if(!M[i][c].z){p=i;break}if(p<0)continue;[M[row],M[p]]=[M[p],M[row]];
    const pv=M[row][c];M[row]=M[row].map(x=>x.div(pv));for(let i=0;i<m;i++)if(i!==row&&!M[i][c].z){const f=M[i][c];M[i]=M[i].map((x,j)=>x.sub(f.mul(M[row][j])))}piv.push(c);row++}
  for(let i=row;i<m;i++)if(!M[i][k].z)return{none:true};
  if(piv.length<k)return{many:true};const x=new Array(k).fill(Z0);piv.forEach((c,i)=>{x[c]=M[i][k]});return{x}}
export function region2(P){// returns {poly:[[x,y]...] floats, verts:[{p:[Q,Q],f:[x,y],lines:[i..]}], unbounded, empty, lines:[{a,b,c,op,i,kind}]}
  const L=[];P.cons.forEach((c,i)=>L.push({a:c.a[0],b:c.a[1],c:c.b,op:c.op,i,kind:'c'}));
  P.sign.forEach((s,j)=>{if(s==='free')return;const a=j===0?Q1:Z0,b=j===1?Q1:Z0;L.push({a,b,c:Z0,op:s==='ge'?'>=':'<=',i:j,kind:'s'})});
  const scale=Math.max(1,...L.map(l=>Math.abs(l.c.v)/Math.max(1e-9,Math.hypot(l.a.v,l.b.v))));const B=scale*1e3;
  let poly=[[-B,-B],[B,-B],[B,B],[-B,B]];
  const clip=(poly,a,b,c,op)=>{// keep a x + b y (op) c
    const f=p=>{const v=a*p[0]+b*p[1]-c;return op==='<='?-v:v};const eps=1e-9*B;const out=[];
    for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],fp=f(p),fq=f(q);if(fp>=-eps)out.push(p);if((fp>=-eps)!==(fq>=-eps)){const t=fp/(fp-fq);out.push([p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])])}}
    return out};
  for(const l of L){if(l.op==='=') {poly=clip(poly,l.a.v,l.b.v,l.c.v,'<=');poly=clip(poly,l.a.v,l.b.v,l.c.v,'>=')}else poly=clip(poly,l.a.v,l.b.v,l.c.v,l.op);if(!poly.length)break}
  // убрать дубли
  const P2=[];for(const p of poly){if(!P2.some(q=>Math.hypot(q[0]-p[0],q[1]-p[1])<1e-7*Math.max(1,scale)))P2.push(p)}
  const res={lines:L,poly:P2,B,empty:!P2.length};if(res.empty)return res;
  const verts=[];let unb=false;
  for(const p of P2){if(Math.abs(p[0])>=B*.999||Math.abs(p[1])>=B*.999){unb=true;verts.push({f:p,box:true});continue}
    const on=L.filter(l=>Math.abs(l.a.v*p[0]+l.b.v*p[1]-l.c.v)<=1e-6*Math.max(1,Math.abs(l.c.v),Math.hypot(l.a.v,l.b.v)*Math.hypot(p[0],p[1])));
    let ex=null;for(let i=0;i<on.length&&!ex;i++)for(let j=i+1;j<on.length&&!ex;j++){const l1=on[i],l2=on[j],det=l1.a.mul(l2.b).sub(l1.b.mul(l2.a));if(det.z)continue;
      ex={p:[l1.c.mul(l2.b).sub(l1.b.mul(l2.c)).div(det),l1.a.mul(l2.c).sub(l1.c.mul(l2.a)).div(det)],pair:[l1,l2]}}
    verts.push({f:p,p:ex?ex.p:[Q.of(p[0]),Q.of(p[1])],on,pair:ex?ex.pair:null})}
  res.verts=verts;res.unbounded=unb;return res}
export function opt2(P,R){if(R.empty)return{status:'infeasible'};const max=P.sense==='max';const c=P.c;
  const real=R.verts.filter(v=>!v.box);let best=null;for(const v of real){const z=dot(c,v.p);if(best===null||(max?z.cmp(best)>0:z.cmp(best)<0))best=z}
  // неограниченность: есть точка на «бесконечности» лучше
  const cv=[c[0].v,c[1].v];const boxBetter=R.verts.filter(v=>v.box).some(v=>{const z=cv[0]*v.f[0]+cv[1]*v.f[1];return best===null?true:(max?z>best.v+1e-6*Math.max(1,Math.abs(best.v))*1e3:z<best.v-1e-6*Math.max(1,Math.abs(best.v))*1e3)});
  if(boxBetter||best===null)return{status:'unbounded'};
  const optV=real.filter(v=>dot(c,v.p).eq(best));
  const rayOpt=R.verts.filter(v=>v.box).some(v=>{const z=cv[0]*v.f[0]+cv[1]*v.f[1];return Math.abs(z-best.v)<=1e-6*Math.max(1,Math.abs(best.v))*1e3});
  return{status:'optimal',value:best.add(P.c0),zb:best,opt:optV,ray:rayOpt}}
export function csRecover(P,D,y){const n=P.vars.length,m=P.cons.length;const info={zeroX:[],tightRows:[],dualSl:[],y};
  // остатки двойственных ограничений (соответствуют x_j)
  D.cons.forEach((c,j)=>{const r=dot(c.a,y).sub(c.b);info.dualSl.push(r);if(P.sign[j]!=='free'&&!r.z)info.zeroX.push(j)});
  P.cons.forEach((c,i)=>{if(c.op==='='||!y[i].z)info.tightRows.push(i)});
  const A=[],b=[];info.zeroX.forEach(j=>{const r=new Array(n).fill(Z0);r[j]=Q1;A.push(r);b.push(Z0)});
  info.tightRows.forEach(i=>{A.push(P.cons[i].a.slice());b.push(P.cons[i].b)});
  info.sys={A,b};const s=A.length?solveSys(A,b):{many:true};info.sol=s;
  if(s.x){info.x=s.x;info.feasible=feasible(P,s.x)}return info}
export function intSearch(P,R){const n=P.vars.length,max=P.sense==='max';const fz=x=>P.c.reduce((s,c,j)=>s+c.v*x[j],0);
  const ok=x=>{for(let j=0;j<n;j++){if(P.sign[j]==='ge'&&x[j]<0)return false;if(P.sign[j]==='le'&&x[j]>0)return false;if(P.bin[j]&&x[j]>1)return false}
    return P.cons.every(c=>{const l=c.a.reduce((s,a,j)=>s+a.v*x[j],0),e=1e-9*Math.max(1,Math.abs(c.b.v));return c.op==='<='?l<=c.b.v+e:c.op==='>='?l>=c.b.v-e:Math.abs(l-c.b.v)<=e})};
  let pts=[],cnt=0;
  if(n===2&&R&&!R.empty){let xs=R.poly.map(p=>p[0]),ys=R.poly.map(p=>p[1]);let x0=Math.ceil(Math.min(...xs)-1e-9),x1=Math.floor(Math.max(...xs)+1e-9),y0=Math.ceil(Math.min(...ys)-1e-9),y1=Math.floor(Math.max(...ys)+1e-9);
    const cap=60;if(R.unbounded){const rv=R.verts.filter(v=>!v.box).map(v=>v.f);const cx=rv.length?rv.reduce((s,p)=>s+p[0],0)/rv.length:0,cy=rv.length?rv.reduce((s,p)=>s+p[1],0)/rv.length:0;
      x0=Math.max(x0,Math.floor(cx-cap));x1=Math.min(x1,Math.ceil(cx+cap));y0=Math.max(y0,Math.floor(cy-cap));y1=Math.min(y1,Math.ceil(cy+cap))}
    if((x1-x0+1)*(y1-y0+1)>40000)return{tooMany:true};
    for(let a=x0;a<=x1;a++)for(let b=y0;b<=y1;b++){cnt++;const x=[a,b];if(P.int[0]||P.int[1]){if(!P.int[0]&&!Number.isInteger(a))continue}if(ok(x))pts.push(x)}}
  else{if(!P.bin.every(Boolean)||n>16)return{unsupported:true};for(let mask=0;mask<(1<<n);mask++){const x=P.vars.map((_,j)=>(mask>>j)&1);cnt++;if(ok(x))pts.push(x)}}
  if(!pts.length)return{pts,best:[],none:true,cnt};let bv=null;for(const x of pts){const z=fz(x);if(bv===null||(max?z>bv:z<bv))bv=z}
  const best=pts.filter(x=>Math.abs(fz(x)-bv)<=1e-9*Math.max(1,Math.abs(bv))).map(x=>x.map(v=>new Q(v)));
  const val=dot(P.c,best[0]).add(P.c0);return{pts,best,val,cnt,unbHint:R&&R.unbounded}}
export function isProduction(P){return P.sense==='max'&&P.sign.every(s=>s==='ge')&&P.cons.every(c=>c.op==='<='&&c.b.s>=0)}
export function ranging(P,r){if(!isProduction(P)||r.status!=='optimal')return null;const n=P.vars.length,m=P.cons.length,T=r.T,Z=r.Z,B=r.B,N=r.N;if(T.length!==m)return null;
  const nb=[];for(let k=0;k<N;k++)if(!B.includes(k))nb.push(k);
  const cR=P.vars.map((_,j)=>{const row=B.indexOf(j);if(row<0)return{lo:null,hi:P.c[j].add(Z[j]),basic:false};
    let lo=null,hi=null;for(const k of nb){const t=T[row][k];if(t.z)continue;const q=Z[k].neg().div(t);if(t.s>0){if(lo===null||q.cmp(lo)>0)lo=q}else{if(hi===null||q.cmp(hi)<0)hi=q}}
    return{lo:lo&&P.c[j].add(lo),hi:hi&&P.c[j].add(hi),basic:true}});
  const bR=P.cons.map((c,i)=>{const k=n+i,row=B.indexOf(k);if(row>=0)return{lo:c.b.sub(T[row][N]),hi:null,basic:true};
    let lo=null,hi=null;for(let rr=0;rr<m;rr++){const p=T[rr][k];if(p.z)continue;const q=T[rr][N].neg().div(p);if(p.s>0){if(lo===null||q.cmp(lo)>0)lo=q}else{if(hi===null||q.cmp(hi)<0)hi=q}}
    return{lo:lo&&c.b.add(lo),hi:hi&&c.b.add(hi),basic:false}});
  const degenerate=T.some(row=>row[N].z);return{cR,bR,degenerate}}
export function symNorm(P){const max=P.sense==='max',flips=[];const cons=P.cons.map((c,i)=>{if(c.op!=='='&&c.op!==(max?'<=':'>=')){flips.push(i);return{...c,a:c.a.map(q=>q.neg()),b:c.b.neg(),op:max?'<=':'>=',flipped:true}}return c});
  return{...P,cons,flips}}
