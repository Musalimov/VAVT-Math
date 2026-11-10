import { toFrac } from '../../../math/expr/core.js';
import { fNsci as fN } from '../../../shared/format.js';
export function fQ(v,d=4){const f=toFrac(v,10000,1e-12);if(f&&f[1]>1&&f[1]<=10000&&Math.abs(f[0])<1e6)return`${f[0]<0?'−':''}${Math.abs(f[0])}/${f[1]} ≈ ${fN(v,d)}`;return fN(v,d)}
export const fT=(v,d=4)=>fN(v,d).replace(/<\/?sup>/g,'');
