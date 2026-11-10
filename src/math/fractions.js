// @ts-check
/**
 * Точные рациональные числа (BigInt) и подбор простой дроби для числа.
 * Используются симплекс-методом (МОР, теория игр) и печатью ответов.
 */

/** Простая дробь, близкая к v: [числитель, знаменатель] или null. */
export function toFrac(v,maxD=1000,tol=1e-10){if(!isFinite(v))return null;if(Number.isInteger(v))return[v,1];
  const s=v<0?-1:1;v=Math.abs(v);let h0=0,h1=1,k0=1,k1=0,x=v;
  for(let i=0;i<40;i++){const a=Math.floor(x),h2=a*h1+h0,k2=a*k1+k0;if(k2>maxD)break;h0=h1;h1=h2;k0=k1;k1=k2;
    if(Math.abs(v-h1/k1)<=tol*Math.max(1,v))return[s*h1,k1];const fr=x-a;if(fr<1e-15)break;x=1/fr}
  return null}

export const bgcd=(a,b)=>{if(a<0n)a=-a;if(b<0n)b=-b;while(b){[a,b]=[b,a%b]}return a};
export function bigOf(x){if(typeof x==='bigint')return x;if(Number.isSafeInteger(x))return BigInt(x);throw{msg:'tok'}}
export function bigNum(N,D){const a=Number(N),b=Number(D);if(isFinite(a)&&isFinite(b))return a/b;
  const k=Math.max(String(N<0n?-N:N).length,String(D).length)-300,p=10n**BigInt(k);return Number(N/p)/Number(D/p)}

/* Q — рациональное число на BigInt: точность не теряется ни при каком числе итераций симплекса.
   N, D — точные BigInt (D > 0, НОД = 1). n, d, v — Number-приближения для логики отображения;
   цифры печатаем только из ns / ds / as (строки), чтобы большие дроби не искажались. */
export class Q{constructor(n,d=1){n=bigOf(n);d=bigOf(d);if(d===0n)throw{msg:'tok'};if(d<0n){n=-n;d=-d}const g=bgcd(n,d)||1n;this.N=n/g;this.D=d/g}
  static of(x){if(x instanceof Q)return x;if(typeof x==='bigint'||Number.isSafeInteger(x))return new Q(x,1);const f=toFrac(x,1e6,1e-12);return f?new Q(f[0],f[1]):new Q(Math.round(x*1e6),1e6)}
  add(o){o=Q.of(o);return new Q(this.N*o.D+o.N*this.D,this.D*o.D)}
  sub(o){o=Q.of(o);return new Q(this.N*o.D-o.N*this.D,this.D*o.D)}
  mul(o){o=Q.of(o);return new Q(this.N*o.N,this.D*o.D)}
  div(o){o=Q.of(o);return new Q(this.N*o.D,this.D*o.N)}
  neg(){return new Q(-this.N,this.D)}
  get n(){return Number(this.N)}
  get d(){return Number(this.D)}
  get ns(){return String(this.N)}
  get ds(){return String(this.D)}
  get as(){return String(this.N<0n?-this.N:this.N)}
  get key(){return this.N+'/'+this.D}
  get int(){return this.D===1n}
  get z(){return this.N===0n}
  get s(){return this.N>0n?1:this.N<0n?-1:0}
  get v(){return bigNum(this.N,this.D)}
  cmp(o){return this.sub(o).s}
  eq(o){return this.cmp(o)===0}
  abs(){return this.N<0n?this.neg():this}
}
export const Z0 = new Q(0);
export const Q1 = new Q(1);
