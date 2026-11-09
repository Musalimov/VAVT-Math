export function exprXY(src){const s=src.replace(/[−–]/g,'-').replace(/,/g,'.').replace(/\s+/g,'').replace(/x1/g,'x').replace(/x2/g,'y').replace(/π/g,'pi');let i=0;
  const pk=()=>s[i],eat=c=>{if(s.startsWith(c,i)){i+=c.length;return true}return false};const F={sin:Math.sin,cos:Math.cos,exp:Math.exp,ln:Math.log,log:Math.log,sqrt:Math.sqrt,abs:Math.abs};
  const cmp=()=>{let a=add();for(;;){if(eat('<=')){const b=add(),A=a;a=(x,y)=>A(x,y)<=b(x,y)+1e-12?1:0}else if(eat('>=')){const b=add(),A=a;a=(x,y)=>A(x,y)>=b(x,y)-1e-12?1:0}else if(eat('<')){const b=add(),A=a;a=(x,y)=>A(x,y)<b(x,y)?1:0}else if(eat('>')){const b=add(),A=a;a=(x,y)=>A(x,y)>b(x,y)?1:0}else return a}};
  const add=()=>{let a=mul();for(;;){if(eat('+')){const b=mul(),A=a;a=(x,y)=>A(x,y)+b(x,y)}else if(pk()==='-'){i++;const b=mul(),A=a;a=(x,y)=>A(x,y)-b(x,y)}else return a}};
  const mul=()=>{let a=un();for(;;){if(eat('*')){const b=un(),A=a;a=(x,y)=>A(x,y)*b(x,y)}else if(eat('/')){const b=un(),A=a;a=(x,y)=>A(x,y)/b(x,y)}else if(i<s.length&&/[0-9a-z(.]/i.test(pk())){const b=un(),A=a;a=(x,y)=>A(x,y)*b(x,y)}else return a}};
  const un=()=>{if(eat('-')){const a=un();return(x,y)=>-a(x,y)}if(eat('+'))return un();return pw()};
  const pw=()=>{const b=at();if(eat('^')){const e=un();return(x,y)=>Math.pow(b(x,y),e(x,y))}return b};
  const at=()=>{if(eat('(')){const e=cmp();if(!eat(')'))throw{msg:'expr'};return e}const m=/^(\d+\.?\d*|\.\d+)/.exec(s.slice(i));if(m){i+=m[0].length;const v=+m[0];return()=>v}
    const w=/^[a-z]+/i.exec(s.slice(i));if(!w)throw{msg:'expr'};const n=w[0].toLowerCase();
    if(n==='x'){i++;return x=>x}if(n==='y'){i++;return(x,y)=>y}if(n==='pi'){i+=2;return()=>Math.PI}if(n==='e'&&!/^[a-z]/i.test(s[i+1]||'')){i++;return()=>Math.E}
    for(const k of['min','max']){if(s.startsWith(k+'(',i)){i+=k.length+1;const a=cmp();if(!eat(';')&&!eat('|'))throw{msg:'expr'};const b=cmp();if(!eat(')'))throw{msg:'expr'};const f=Math[k];return(x,y)=>f(a(x,y),b(x,y))}}
    for(const k in F)if(s.startsWith(k,i)){i+=k.length;const a=at();const f=F[k];return(x,y)=>f(a(x,y))}throw{msg:'expr'}};
  const e=cmp();if(i<s.length)throw{msg:'expr'};return e}
export function numG(s){s=String(s).trim().replace(/[−–]/g,'-').replace(',','.');if(/^[-+]?\d*\.?\d+$/.test(s))return parseFloat(s);const m=/^([-+]?\d+)\/(\d+)$/.exec(s);if(m)return(+m[1])/(+m[2]);throw{msg:'num'}}
