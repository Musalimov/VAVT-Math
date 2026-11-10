
export const snap=v=>{if(!isFinite(v))return v;if(Math.abs(v)<1e-13)return 0;const f=toFrac(v,2000,1e-11);return f?f[0]/f[1]:v};
export const X=['v','x'];
export const Nn=v=>['n',snap(v)];
export const isN=e=>e[0]==='n';
export const isNum=(e,v)=>e[0]==='n'&&Math.abs(e[1]-v)<1e-12;
export const key=e=>JSON.stringify(e);
export function has(e,nm='x'){if(e[0]==='v')return e[1]===nm;if(e[0]==='n'||e[0]==='c')return false;if(e[0]==='f')return has(e[2],nm);if(e[0]==='neg')return has(e[1],nm);return has(e[1],nm)||has(e[2],nm)}
export const CV={pi:Math.PI,e:Math.E};
export function isPerfSq(v){if(v<0)return null;const f=toFrac(v,10000);if(!f)return null;const p=Math.round(Math.sqrt(f[0])),q=Math.round(Math.sqrt(f[1]));return p*p===f[0]&&q*q===f[1]?p/q:null}
export function sqrtAst(v){const r=isPerfSq(v);if(r!==null)return Nn(r);
  if(Number.isInteger(v)&&v>0&&v<1e7){let o=1,i=v;for(let d=2;d*d<=i;d++)while(i%(d*d)===0){i/=d*d;o*=d}if(o>1)return mul(Nn(o),['f','sqrt',Nn(i)])}
  const f=toFrac(v,1000);
  if(f&&f[1]>1){const q=Math.round(Math.sqrt(f[1]));if(q*q===f[1])return div(['f','sqrt',Nn(f[0])],Nn(q))}
  return['f','sqrt',Nn(v)]}
export function add(a,b){if(isN(a)&&isN(b))return Nn(a[1]+b[1]);if(isNum(a,0))return b;if(isNum(b,0))return a;
  if(isN(b)&&b[1]<0)return['-',a,Nn(-b[1])];if(b[0]==='neg')return sub(a,b[1]);
  if(b[0]==='*'&&isN(b[1])&&b[1][1]<0)return sub(a,mul(Nn(-b[1][1]),b[2]));
  if(a[0]==='neg'&&b[0]!=='neg')return sub(b,a[1]);
  if(a[0]==='*'&&isN(a[1])&&a[1][1]<0&&!(b[0]==='*'&&isN(b[1])&&b[1][1]<0)&&!isN(b))return sub(b,mul(Nn(-a[1][1]),a[2]));
  return['+',a,b]}
export function sub(a,b){if(isN(a)&&isN(b))return Nn(a[1]-b[1]);if(isNum(b,0))return a;if(isNum(a,0))return neg(b);
  if(isN(b)&&b[1]<0)return add(a,Nn(-b[1]));if(b[0]==='neg')return add(a,b[1]);
  if(b[0]==='*'&&isN(b[1])&&b[1][1]<0)return add(a,mul(Nn(-b[1][1]),b[2]));
  if(key(a)===key(b))return Nn(0);return['-',a,b]}
export function neg(a){if(isN(a))return Nn(-a[1]);if(a[0]==='neg')return a[1];if(a[0]==='*'&&isN(a[1]))return mul(Nn(-a[1][1]),a[2]);
  if(a[0]==='-')return sub(a[2],a[1]);return['neg',a]}
export function powParts(e){if(e[0]==='^'&&isN(e[2]))return[e[1],e[2][1]];if(e[0]==='f'&&e[1]==='sqrt')return[e[2],.5];if(isN(e))return null;return[e,1]}
export function mul(a,b){if(isN(a)&&isN(b))return Nn(a[1]*b[1]);if(isNum(a,0)||isNum(b,0))return Nn(0);
  if(isNum(a,1))return b;if(isNum(b,1))return a;if(isNum(a,-1))return neg(b);if(isNum(b,-1))return neg(a);
  if(isN(b))return mul(b,a);
  if(a[0]==='neg')return neg(mul(a[1],b));if(b[0]==='neg')return neg(mul(a,b[1]));
  if(isN(a)){if(b[0]==='*'&&isN(b[1]))return mul(Nn(a[1]*b[1][1]),b[2]);
    if(b[0]==='/'&&isN(b[1]))return div(Nn(a[1]*b[1][1]),b[2]);}
  if(b[0]==='*'&&isN(b[1]))return mul(b[1],mul(a,b[2]));
  if(a[0]==='*'&&isN(a[1]))return mul(a[1],mul(a[2],b));
  const pa=powParts(a),pb=powParts(b);
  if(pa&&pb&&key(pa[0])===key(pb[0]))return pow(pa[0],Nn(pa[1]+pb[1]));
  return['*',a,b]}
export function div(a,b){if(isNum(b,1))return a;if(isN(a)&&isN(b))return Nn(a[1]/b[1]);if(isNum(a,0))return Nn(0);
  if(isN(b))return mul(Nn(1/b[1]),a);
  if(a[0]==='neg')return neg(div(a[1],b));if(b[0]==='neg')return neg(div(a,b[1]));
  if(a[0]==='*'&&isN(a[1]))return mul(a[1],div(a[2],b));
  if(b[0]==='*'&&isN(b[1]))return mul(Nn(1/b[1][1]),div(a,b[2]));
  if(key(a)===key(b))return Nn(1);
  const pa=powParts(a),pb=powParts(b);
  if(pa&&pb&&key(pa[0])===key(pb[0]))return pow(pa[0],Nn(pa[1]-pb[1]));
  return['/',a,b]}
export function pow(a,b){if(isNum(b,0))return Nn(1);if(isNum(b,1))return a;
  if(isN(a)&&isN(b)){const v=Math.pow(a[1],b[1]);if(isFinite(v)&&(Number.isInteger(b[1])||toFrac(v,100)))return Nn(v)}
  if(isNum(a,1))return Nn(1);
  if(a[0]==='c'&&a[1]==='e')return fn('exp',b);
  if(isN(b)){const n=b[1];
    if(a[0]==='^'&&isN(a[2])){const m=a[2][1];if((Number.isInteger(m)&&Number.isInteger(n))||!Number.isInteger(m))return pow(a[1],Nn(m*n))}
    if(a[0]==='f'&&a[1]==='sqrt')return pow(a[2],Nn(n/2));
    if(a[0]==='f'&&a[1]==='exp')return fn('exp',mul(Nn(n),a[2]));
    if(n===.5)return isN(a)?sqrtAst(a[1]):['f','sqrt',a];}
  return['^',a,b]}
export function fn(nm,a){
  if(nm==='exp'){if(isNum(a,0))return Nn(1);if(a[0]==='f'&&a[1]==='ln')return a[2];if(isNum(a,1))return['c','e']}
  if(nm==='ln'){if(isNum(a,1))return Nn(0);if(a[0]==='c'&&a[1]==='e')return Nn(1);if(a[0]==='f'&&a[1]==='exp')return a[2]}
  if(nm==='sqrt'&&isN(a)&&a[1]>=0)return sqrtAst(a[1]);
  if(nm==='abs'&&isN(a))return Nn(Math.abs(a[1]));
  if(nm==='abs'&&a[0]==='f'&&(a[1]==='exp'||a[1]==='abs'||a[1]==='sqrt'))return a;
  if((nm==='sin'||nm==='tan'||nm==='asin'||nm==='atan'||nm==='sinh')&&isNum(a,0))return Nn(0);
  if((nm==='cos'||nm==='cosh')&&isNum(a,0))return Nn(1);
  return['f',nm,a]}
export function subst(e,nm,r){if(e[0]==='v')return e[1]===nm?r:e;if(e[0]==='n'||e[0]==='c')return e;
  if(e[0]==='f')return fn(e[1],subst(e[2],nm,r));if(e[0]==='neg')return neg(subst(e[1],nm,r));
  const a=subst(e[1],nm,r),b=subst(e[2],nm,r);return OPS[e[0]](a,b)}
export const OPS={'+':add,'-':sub,'*':mul,'/':div,'^':pow};
export function simp(e){if(e[0]==='n')return Nn(e[1]);if(e[0]==='v'||e[0]==='c')return e;if(e[0]==='f')return fn(e[1],simp(e[2]));
  if(e[0]==='neg')return neg(simp(e[1]));return OPS[e[0]](simp(e[1]),simp(e[2]))}
export function replKey(e,k,r){if(key(e)===k)return r;if(e[0]==='n'||e[0]==='c'||e[0]==='v')return e;if(e[0]==='f')return fn(e[1],replKey(e[2],k,r));
  if(e[0]==='neg')return neg(replKey(e[1],k,r));return OPS[e[0]](replKey(e[1],k,r),replKey(e[2],k,r))}
export const FN={sin:Math.sin,cos:Math.cos,tan:Math.tan,cot:x=>1/Math.tan(x),exp:Math.exp,ln:Math.log,sqrt:Math.sqrt,abs:Math.abs,
  asin:Math.asin,acos:Math.acos,atan:Math.atan,sinh:Math.sinh,cosh:Math.cosh,tanh:Math.tanh};
export function compile(e){switch(e[0]){
  case 'n':{const v=e[1];return()=>v}
  case 'c':{const v=CV[e[1]];return()=>v}
  case 'v':return x=>x;
  case 'neg':{const a=compile(e[1]);return x=>-a(x)}
  case 'f':{const a=compile(e[2]),g=FN[e[1]];return x=>g(a(x))}
  case '^':{const a=compile(e[1]);if(isN(e[2])){const n=e[2][1];if(n===2)return x=>{const v=a(x);return v*v};
      const fr=toFrac(n,50);if(fr&&fr[1]%2===1&&!Number.isInteger(n))return x=>{const v=a(x);const r=Math.pow(Math.abs(v),n);return v<0?(fr[0]%2?-r:r):r};
      return x=>Math.pow(a(x),n)}
    const b=compile(e[2]);return x=>Math.pow(a(x),b(x))}
  default:{const a=compile(e[1]),b=compile(e[2]);
    switch(e[0]){case '+':return x=>a(x)+b(x);case '-':return x=>a(x)-b(x);case '*':return x=>a(x)*b(x);case '/':return x=>a(x)/b(x)}}
}}
export const FD={sin:u=>fn('cos',u),cos:u=>neg(fn('sin',u)),tan:u=>div(Nn(1),pow(fn('cos',u),Nn(2))),cot:u=>neg(div(Nn(1),pow(fn('sin',u),Nn(2)))),
  exp:u=>fn('exp',u),ln:u=>div(Nn(1),u),sqrt:u=>div(Nn(1),mul(Nn(2),fn('sqrt',u))),abs:u=>div(u,fn('abs',u)),
  asin:u=>div(Nn(1),fn('sqrt',sub(Nn(1),pow(u,Nn(2))))),acos:u=>neg(div(Nn(1),fn('sqrt',sub(Nn(1),pow(u,Nn(2)))))),
  atan:u=>div(Nn(1),add(Nn(1),pow(u,Nn(2)))),sinh:u=>fn('cosh',u),cosh:u=>fn('sinh',u),tanh:u=>div(Nn(1),pow(fn('cosh',u),Nn(2)))};
export function D(e){switch(e[0]){
  case 'n':case 'c':return Nn(0);
  case 'v':return Nn(e[1]==='x'?1:0);
  case '+':return add(D(e[1]),D(e[2]));
  case '-':return sub(D(e[1]),D(e[2]));
  case 'neg':return neg(D(e[1]));
  case '*':{const[,a,b]=e;if(!has(a))return mul(a,D(b));if(!has(b))return mul(D(a),b);return add(mul(D(a),b),mul(a,D(b)))}
  case '/':{const[,a,b]=e;if(!has(b))return div(D(a),b);if(!has(a))return neg(div(mul(a,D(b)),pow(b,Nn(2))));
    return div(sub(mul(D(a),b),mul(a,D(b))),pow(b,Nn(2)))}
  case '^':{const[,b,p]=e;if(!has(p))return mul(mul(p,pow(b,sub(p,Nn(1)))),D(b));if(!has(b))return mul(mul(e,fn('ln',b)),D(p));
    return mul(e,add(mul(D(p),fn('ln',b)),div(mul(p,D(b)),b)))}
  case 'f':{const u=e[2];return mul(FD[e[1]](u),D(u))}
}}

export function toFrac(v,maxD=1000,tol=1e-10){if(!isFinite(v))return null;if(Number.isInteger(v))return[v,1];
  const s=v<0?-1:1;v=Math.abs(v);let h0=0,h1=1,k0=1,k1=0,x=v;
  for(let i=0;i<30;i++){const a=Math.floor(x),h2=a*h1+h0,k2=a*k1+k0;if(k2>maxD)break;h0=h1;h1=h2;k0=k1;k1=k2;
    if(Math.abs(v-h1/k1)<=tol*Math.max(1,v))return[s*h1,k1];const fr=x-a;if(fr<1e-15)break;x=1/fr}
  return null}
