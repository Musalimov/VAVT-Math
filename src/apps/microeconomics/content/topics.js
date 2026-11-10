import { costs, cross, linPQ, market } from '../solvers/model.js';

export const PRE={
 sd:[['s16',{D:'P = 20 - 2q',S:'P = 5 + q',iv:'none',v:''},'4.16: равновесие и выигрыши','4.16: equilibrium and surpluses'],['s17',{D:'P = 60 - 0,25q',S:'P = 20 + 0,15q',iv:'none',v:''},'4.17: валютный рынок','4.17: currency market'],
  ['s19',{D:'P = 80 - 5q',S:'P = 32 + q',iv:'ceil',v:'35'},'4.19: потолок цены 35','4.19: price ceiling 35'],['s20',{D:'P = 12 - 2q',S:'P = 4 + 2q',iv:'tax',v:'2'},'4.20: налог 2 с единицы','4.20: tax 2 per unit'],
  ['ssub',{D:'P = 12 - 2q',S:'P = 4 + 2q',iv:'sub',v:'2'},'Субсидия 2 с единицы','Subsidy 2 per unit'],['sfl',{D:'P = 20 - 2q',S:'P = 5 + q',iv:'floor',v:'14'},'Минимальная цена 14','Price floor 14'],
  ['squo',{D:'P = 20 - 2q',S:'P = 5 + q',iv:'quota',v:'3'},'Квота 3 единицы','Quota of 3 units'],['sbenz',{D:'q = 19000000 - 100000P',S:'q = 100000P - 1000000',iv:'tax',v:'4'},'16.3: бензин, налог 4','16.3: gasoline, tax 4']],
 el:[['e10',{D:'P = 50 - q/2',em:'find',P1:'',P2:'',Ev:'1',q1:'',q2:'',x1:'',x2:'',ek:'price'},'5.10: где |E| = 1','5.10: where |E| = 1'],['ept',{D:'P = 50 - q/2',em:'pt',P1:'40',P2:'',Ev:'',q1:'',q2:'',x1:'',x2:'',ek:'price'},'Точечная эластичность при P = 40','Point elasticity at P = 40'],
  ['earc',{D:'P = 50 - q/2',em:'arc',P1:'20',P2:'30',Ev:'',q1:'',q2:'',x1:'',x2:'',ek:'price'},'Дуговая: от P = 20 до 30','Arc: from P = 20 to 30'],['etv',{D:'P = 50 - q/2',em:'pts',P1:'',P2:'',Ev:'',q1:'10',q2:'15',x1:'10000',x2:'8000',ek:'price'},'5.4: распродажа телевизоров','5.4: TV sale'],
  ['einc',{D:'P = 50 - q/2',em:'pts',P1:'',P2:'',Ev:'',q1:'20',q2:'22',x1:'1000',x2:'1200',ek:'inc'},'По доходу: 20 → 22 при доходе 1000 → 1200','Income: 20 → 22 as income 1000 → 1200'],['ecr',{D:'P = 50 - q/2',em:'pts',P1:'',P2:'',Ev:'',q1:'100',q2:'120',x1:'50',x2:'60',ek:'cross'},'Перекрёстная: заменители','Cross: substitutes']],
 cons:[['ccd',{ut:'cd',al:'1',be:'1',I:'100',px:'2',py:'5',px2:'4'},'U = xy, X подорожал вдвое','U = xy, X doubles in price'],['ccd2',{ut:'cd',al:'0,3',be:'0,7',I:'200',px:'4',py:'2',px2:'2'},'U = x^0,3·y^0,7, X подешевел','U = x^0.3·y^0.7, X cheaper'],
  ['csub',{ut:'sub',al:'2',be:'1',I:'60',px:'3',py:'2',px2:'5'},'Совершенные заменители','Perfect substitutes'],['ccomp',{ut:'comp',al:'1',be:'2',I:'120',px:'2',py:'4',px2:'4'},'Совершенные дополнители','Perfect complements']],
 cost:[['c9',{FC:'0',VC:'2q^3 - 20q^2 + 60q',qmax:'10'},'10.9: VC = 2q³ − 20q² + 60q','10.9: VC = 2q³ − 20q² + 60q'],['c10',{FC:'4',VC:'q^3 - 3q^2 + 8q',qmax:'5'},'10.10: из статей затрат','10.10: from cost items'],
  ['c8',{FC:'1000',VC:'2q^2',qmax:'60'},'10.8: AVC = 2q, FC = 1000','10.8: AVC = 2q, FC = 1000'],['cfix',{FC:'100',VC:'10q + q^2/4',qmax:'60'},'Квадратичные затраты','Quadratic costs']],
 comp:[['k1',{P:'4',FC:'24',VC:'2q',qmax:'30'},'10.1: точка безубыточности','10.1: break-even point'],['k7',{P:'8',FC:'12',VC:'q^2',qmax:'10'},'10.7: P = 8, VC = q²','10.7: P = 8, VC = q²'],['k8',{P:'100',FC:'1000',VC:'2q^2',qmax:'40'},'10.8: P = 100','10.8: P = 100'],
  ['k8b',{P:'80',FC:'1000',VC:'2q^2',qmax:'40'},'10.8: цена упала до 80','10.8: price falls to 80'],['k9',{P:'9',FC:'20',VC:'2q^3 - 20q^2 + 60q',qmax:'10'},'10.9: ниже точки закрытия','10.9: below the shutdown point'],['k9b',{P:'40',FC:'20',VC:'2q^3 - 20q^2 + 60q',qmax:'10'},'10.9: P = 40','10.9: P = 40']],
 mono:[['m8',{dm:'one',D:'P = 240 - 4q',FC:'2000',VC:'2q^2',qmax:'60',D2:'',c:''},'11.8: P = 240 − 4q','11.8: P = 240 − 4q'],['m8b',{dm:'one',D:'P = 216 - 4q',FC:'2000',VC:'2q^2',qmax:'60',D2:'',c:''},'11.8: спрос упал','11.8: demand falls'],
  ['m11',{dm:'one',D:'P = 10 - q',FC:'0',VC:'2q',qmax:'10',D2:'',c:''},'11.11: издательство','11.11: publisher'],['m15',{dm:'one',D:'q = 6000 - 50P',FC:'0',VC:'q^2/200',qmax:'6000',D2:'',c:''},'11.15: монополизация отрасли','11.15: monopolizing an industry'],
  ['m14',{dm:'disc',D:'q = 1000 - P',FC:'',VC:'',qmax:'',D2:'q = 1200 - 5P',c:'100'},'11.14: ценовая дискриминация','11.14: price discrimination']]};
export const GROUPS=[['mkt',['sd','el']],['cons',['cons']],['firm',['cost','comp','mono']]];
export const TOPICS=GROUPS.flatMap(g=>g[1]);
export const FORMS={sd:[['D','str'],['S','str'],['iv','sel',['none','tax','sub','ceil','floor','quota']],['v','num',i=>i.iv!=='none'],['shD','num'],['shS','num']],
 el:[['em','sel',['pt','arc','find','pts']],['D','str',i=>i.em!=='pts'],['P1','num',i=>i.em==='pt'||i.em==='arc'],['P2','num',i=>i.em==='arc'],['Ev','num',i=>i.em==='find'],['ek','sel',['price','inc','cross'],i=>i.em==='pts'],['q1','num',i=>i.em==='pts'],['q2','num',i=>i.em==='pts'],['x1','num',i=>i.em==='pts'],['x2','num',i=>i.em==='pts']],
 cons:[['ut','sel',['cd','sub','comp']],['al','num'],['be','num'],['I','num'],['px','num'],['py','num'],['px2','num'],['dI','num']],
 cost:[['FC','num'],['VC','str'],['qmax','num']],comp:[['P','num'],['FC','num'],['VC','str'],['qmax','num']],
 mono:[['dm','sel',['one','disc']],['D','str'],['FC','num',i=>i.dm!=='disc'],['VC','str',i=>i.dm!=='disc'],['qmax','num',i=>i.dm!=='disc'],['D2','str',i=>i.dm==='disc'],['c','num',i=>i.dm==='disc']]};
export const DELTAS={sd:['shD','shS'],cons:['dI','px2'],labor:['dDl','dSl']};
export const spanP=I=>{try{const D=linPQ(I.D),S0=linPQ(I.S),E0=cross(D,S0);return Math.max(1e-6,Math.abs(E0.P)*.2)}catch(e){return 1}};
export const spanW=I=>{try{const f=s=>linPQ(String(s).replace(/\bw\b/g,'P').replace(/(?<![a-zA-Z])L(?![a-zA-Z])/g,'q'));const E0=cross(f(I.Dl),f(I.Sl));return Math.max(1e-6,Math.abs(E0.P)*.2)}catch(e){return 1}};
// часть 2 тренажёра дополняет общие таблицы
Object.assign(PRE,{
 ppf:[['p1',{tab:'0 15\n1 14\n2 12\n3 9\n4 5\n5 0',ptx:'2',pty:'10'},'КПВ: возрастающие альтернативные затраты','PPF: increasing opportunity costs'],['p2',{tab:'0 20\n10 10\n20 0',ptx:'5',pty:'5'},'Линейная КПВ: постоянные затраты','Linear PPF: constant costs'],['p3',{tab:'0 15\n1 14\n2 12\n3 9\n4 5\n5 0',ptx:'3',pty:'11'},'Недостижимая точка','An unattainable point']],
 prod:[['f81',{prm:'short',f:'L^0.5*K^0.5',K:'16',Lmax:'40',w:'',r:'',C:'',q0:''},'8.1: q = L^½K^½, K = 16','8.1: q = L^½K^½, K = 16'],['f148',{prm:'short',f:'30L - L^2',K:'1',Lmax:'30',w:'',r:'',C:'',q0:''},'14.8: q = 30L − L²','14.8: q = 30L − L²'],
  ['f920',{prm:'long',f:'L^0.5*K^0.5',K:'',Lmax:'',w:'4',r:'6',C:'24',q0:''},'9.20: x = L, y = K; бюджет 24','9.20: x = L, y = K; budget 24'],['f918',{prm:'long',f:'L*K/(L+K)',K:'',Lmax:'',w:'25',r:'9',C:'80',q0:''},'9.18: q = xy/(x + y)','9.18: q = xy/(x + y)'],['fmc',{prm:'mincost',f:'L^0.5*K^0.5',K:'',Lmax:'',w:'4',r:'1,5',C:'',q0:'2,4495'},'9.20: K подешевел в 4 раза','9.20: K four times cheaper']],
 mc:[['mc123',{D:'P = 10 - 0,5q',LTC:'q^2 - 2q + 24,01',qmax:'20'},'12.3: избыточная мощность','12.3: excess capacity'],['mcsr',{D:'P = 20 - q',LTC:'q^2/2 + 2q + 20',qmax:'20'},'Короткий период: прибыль','Short run: profit']],
 olig:[['o136',{om:'cour',a:'9,6',b:'1',c1:'0',d1:'1',c2:'0',d2:'1,5',sh:''},'13.6: Курно, TC₁ = q₁², TC₂ = 1,5q₂²','13.6: Cournot, TC₁ = q₁², TC₂ = 1.5q₂²'],['o136s',{om:'stack',a:'9,6',b:'1',c1:'0',d1:'1',c2:'0',d2:'1,5',sh:''},'13.6: лидер — фирма 1','13.6: firm 1 leads'],
  ['o136c',{om:'cart',a:'9,6',b:'1',c1:'0',d1:'1',c2:'0',d2:'1,5',sh:''},'13.6: картель','13.6: cartel'],['olin',{om:'cour',a:'10',b:'1',c1:'1',d1:'0',c2:'1',d2:'0',sh:''},'Линейные затраты: Курно','Linear costs: Cournot'],['ohhi',{om:'hhi',a:'',b:'',c1:'',d1:'',c2:'',d2:'',sh:'40 30 20 10'},'Индекс Херфиндаля–Хиршмана','Herfindahl–Hirschman index']],
 labor:[['l148',{lm:'firm',f:'30L - L^2',p:'5',w:'50',Lmax:'30',Dl:'',Sl:'',wm:''},'14.8: w = 50','14.8: w = 50'],['l148b',{lm:'firm',f:'30L - L^2',p:'5',w:'100',Lmax:'30',Dl:'',Sl:'',wm:''},'14.8: w = 100','14.8: w = 100'],['l147',{lm:'firm',f:'sqrt(900L)',p:'100',w:'30',Lmax:'5000',Dl:'',Sl:'',wm:''},'14.7: q = √(KL), K = 900','14.7: q = √(KL), K = 900'],
  ['l1410',{lm:'mkt',f:'',p:'',w:'',Lmax:'',Dl:'w = 20 - 0,002L',Sl:'w = 11 + 0,001L',wm:''},'14.10: экономическая рента','14.10: economic rent'],['lmon',{lm:'mon',f:'',p:'',w:'',Lmax:'',Dl:'w = 100 - L',Sl:'w = 10 + L',wm:''},'Монопсония','Monopsony'],['lmw',{lm:'mon',f:'',p:'',w:'',Lmax:'',Dl:'w = 100 - L',Sl:'w = 10 + L',wm:'50'},'Монопсония и минимальная зарплата 50','Monopsony and minimum wage 50']],
 cap:[['k151',{km:'fv',pm:'1000',i:'9%',n:'20',pv:'',fl:''},'15 (Excel 1): БС, 1000 в год, 9%, 20 лет','15 (Excel 1): FV, 1000 a year, 9%, 20 years'],['k152',{km:'pv',pm:'1000',i:'9%',n:'10',pv:'',fl:''},'15 (Excel 2): ПС автомобиля','15 (Excel 2): PV of a car'],['k153',{km:'pmt',pm:'',i:'12%',n:'25',pv:'100000',fl:''},'15 (Excel 3): ПЛТ по ипотеке','15 (Excel 3): mortgage PMT'],
  ['k154',{km:'nper',pm:'20000',i:'12%',n:'',pv:'100000',fl:''},'15 (Excel 4): КПЕР','15 (Excel 4): NPER'],['knpv',{km:'npv',pm:'',i:'10%',n:'',pv:'',fl:'-100 30 40 50'},'NPV и IRR проекта','Project NPV and IRR'],['k1514',{km:'land',pm:'',i:'9%',n:'',pv:'',fl:'T = 1800 - 3P; 1500'},'15.14: рента и цена земли','15.14: land rent and price']],
 ext:[['x162',{D:'P = 40 - 2q',S:'P = 28 + q',e:'3'},'16.2: внешние издержки 3','16.2: external cost 3'],['x163',{D:'q = 19000000 - 100000P',S:'q = 100000P - 1000000',e:'4'},'16.3: бензин, ущерб 4 руб./л','16.3: gasoline, damage 4 per litre']],
 pg:[['g168',{list:'50: P = 1 - 0,1q\n49: P = 2 - 0,2q',MC:'P = 74'},'16.8: дворники для 99 семей','16.8: street cleaners for 99 families'],['g3',{list:'1: P = 10 - q\n1: P = 8 - q\n1: P = 6 - q',MC:'P = 12'},'Три потребителя, MC = 12','Three consumers, MC = 12']]});
// часть 2 тренажёра дополняет общие таблицы
GROUPS.length=0;
// часть 2 тренажёра дополняет общие таблицы
GROUPS.push(['mkt',['ppf','sd','el']],['cons',['cons']],['firm',['prod','cost','comp','mono','mc','olig']],['res',['labor','cap']],['pub',['ext','pg']]);
// часть 2 тренажёра дополняет общие таблицы
TOPICS.length=0;
// часть 2 тренажёра дополняет общие таблицы
TOPICS.push(...GROUPS.flatMap(g=>g[1]));
// часть 2 тренажёра дополняет общие таблицы
Object.assign(FORMS,{ppf:[['tab','txt'],['ptx','num'],['pty','num']],prod:[['prm','sel',['short','long','mincost']],['f','str'],['K','num',i=>i.prm==='short'],['Lmax','num',i=>i.prm==='short'],['w','num',i=>i.prm!=='short'],['r','num',i=>i.prm!=='short'],['C','num',i=>i.prm==='long'],['q0','num',i=>i.prm==='mincost']],
 mc:[['D','str'],['LTC','str'],['qmax','num']],olig:[['om','sel',['cour','stack','cart','hhi']],['a','num',i=>i.om!=='hhi'],['b','num',i=>i.om!=='hhi'],['c1','num',i=>i.om!=='hhi'],['d1','num',i=>i.om!=='hhi'],['c2','num',i=>i.om!=='hhi'],['d2','num',i=>i.om!=='hhi'],['sh','str',i=>i.om==='hhi']],
 labor:[['lm','sel',['firm','mkt','mon']],['dDl','num',i=>i.lm==='mkt'],['dSl','num',i=>i.lm==='mkt'],['f','str',i=>i.lm==='firm'],['p','num',i=>i.lm==='firm'],['w','num',i=>i.lm==='firm'],['Lmax','num',i=>i.lm==='firm'],['Dl','str',i=>i.lm!=='firm'],['Sl','str',i=>i.lm!=='firm'],['wm','num',i=>i.lm==='mon']],
 cap:[['km','sel',['fv','pv','pmt','nper','npv','land']],['pm','num',i=>['fv','pv','nper'].includes(i.km)],['pv','num',i=>['pmt','nper'].includes(i.km)],['i','num'],['n','num',i=>['fv','pv','pmt'].includes(i.km)],['fl','str',i=>['npv','land'].includes(i.km)]],
 ext:[['D','str'],['S','str'],['e','num']],pg:[['list','txt'],['MC','str']]});
