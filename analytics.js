/* Calendar periods and filters shared by statistics and transaction detail. */
(function(root){
'use strict';
const DAY=86400000, iso=d=>d.toISOString().slice(0,10), date=s=>new Date(s+'T00:00:00Z');
const add=(s,n)=>iso(new Date(+date(s)+n*DAY));
const days=(a,b)=>Math.round((date(b)-date(a))/DAY)+1;
const valid=s=>/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(+date(s))&&iso(date(s))===s;
function bounds(kind,anchor){const d=date(anchor),y=d.getUTCFullYear(),m=d.getUTCMonth();
 const make=(y,m,n)=>iso(new Date(Date.UTC(y,m,n)));
 if(kind==='week'){const start=add(anchor,-((d.getUTCDay()+6)%7));return [start,add(start,6)]}
 if(kind==='quarter'){const q=Math.floor(m/3)*3;return [make(y,q,1),make(y,q+3,0)]}
 if(kind==='year')return [make(y,0,1),make(y,11,31)];
 return [make(y,m,1),make(y,m+1,0)];
}
function move(kind,anchor,n){const d=date(anchor);if(kind==='week')return add(anchor,n*7);if(kind==='year')return iso(new Date(Date.UTC(d.getUTCFullYear()+n,0,1)));return iso(new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+n*(kind==='quarter'?3:1),1)))}
function ranges(f,today){
 let start,end,fullEnd;
 if(f.period!=='custom'&&!valid(f.anchor))return {error:'请选择有效的周期日期。'};
 if(f.period==='custom'){start=f.from;end=f.to;fullEnd=end}else{[start,fullEnd]=bounds(f.period,f.anchor);end=start<=today&&today<=fullEnd?today:fullEnd}
 if(!valid(start)||!valid(end)||start>end)return {error:'请选择有效日期，开始日期不能晚于结束日期。'};
 const length=days(start,end);if(length>366)return {error:'单次分析最多 366 天，请缩短日期范围。'};
 let ps,pe,ys,ye;
 if(f.period==='custom'){pe=add(start,-1);ps=add(pe,1-length);const d=date(start);ys=iso(new Date(Date.UTC(d.getUTCFullYear()-1,d.getUTCMonth(),Math.min(d.getUTCDate(),new Date(Date.UTC(d.getUTCFullYear()-1,d.getUTCMonth()+1,0)).getUTCDate()))));ye=add(ys,length-1)}
 else {
 const pb=bounds(f.period,move(f.period,start,-1));ps=pb[0];pe=end===fullEnd?pb[1]:[add(ps,length-1),pb[1]].sort()[0];
 const yAnchor=f.period==='week'?add(start,-364):iso(new Date(Date.UTC(date(start).getUTCFullYear()-1,date(start).getUTCMonth(),1)));
 const yb=bounds(f.period,yAnchor);ys=yb[0];ye=end===fullEnd?yb[1]:[add(ys,length-1),yb[1]].sort()[0];
 }
 return {current:[start,end],previous:[ps,pe],year:[ys,ye],length,partial:end!==fullEnd,week:f.period==='week'};
}
const cat=(r,k)=>r[k]||'未分类',cents=r=>Math.round(Number(r.amount)*100);
function matches(r,f){return (!f.type||f.type==='全部'||r.type===f.type)&&['cat1','cat2','cat3'].every(k=>!f[k]||cat(r,k)===f[k])&&(!f.merchant||cat(r,'merchant')===f.merchant)&&(!f.search||[r.name,r.note,r.merchant,r.cat1,r.cat2,r.cat3].some(v=>String(v||'').toLowerCase().includes(f.search.toLowerCase())))&&(f.min===''||cents(r)>=Math.round(Number(f.min)*100))&&(f.max===''||cents(r)<=Math.round(Number(f.max)*100))&&(!f.weekday||String((date(r.date).getUTCDay()+6)%7)===f.weekday)}
const select=(entries,f,range)=>entries.filter(r=>valid(r.date)&&r.date>=range[0]&&r.date<=range[1]&&matches(r,f));
const sum=rows=>rows.reduce((s,r)=>s+cents(r),0)/100;
function metrics(rows,range){const income=sum(rows.filter(r=>r.type==='收入')),expense=sum(rows.filter(r=>r.type==='支出'));return {income,expense,balance:income-expense,count:rows.length,average:rows.length?sum(rows)/rows.length:0,daily:sum(rows)/days(...range),max:rows.length?Math.max(...rows.map(r=>Number(r.amount))):0}}
function delta(a,b){return b===0?(a===0?'持平':'基期为 0'):((a-b)/Math.abs(b)*100>=0?'+':'')+((a-b)/Math.abs(b)*100).toFixed(1)+'%'}
function group(rows,key){const m=new Map();for(const r of rows){const k=typeof key==='function'?key(r):cat(r,key);if(!m.has(k))m.set(k,[]);m.get(k).push(r)}return [...m].map(([name,items])=>({name,value:sum(items),count:items.length})).sort((a,b)=>b.value-a.value||a.name.localeCompare(b.name))}
const API={add,days,valid,bounds,move,ranges,select,matches,sum,metrics,delta,group,cat};
if(typeof module!=='undefined')module.exports=API;else root.LedgerAnalytics=API;
})(typeof window==='undefined'?globalThis:window);
