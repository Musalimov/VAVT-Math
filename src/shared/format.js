import { lang } from './i18n.js';

export function fmt(x,d=2){if(!isFinite(x))return x>0?'∞':x<0?'−∞':'—';if(Math.abs(x)<5e-12)x=0;let s=String(+x.toFixed(d));if(s==='-0')s='0';return s.replace('-','−')}
export const dc=s=>lang()==='ru'?s.replace(/(\d)\.(\d)/g,'$1,$2'):s;
export function fN(v,d=4){if(!isFinite(v))return v>0?'∞':v<0?'−∞':'—';return dc(fmt(v,d))}
export const fV=a=>`(${a.map(v=>fN(v,4)).join('; ')})`;
