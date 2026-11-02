(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const byId = id => document.getElementById(id);
  const DB_KEY = 'my-ledger-v1-data';
  const MODE_KEY = 'my-ledger-v1-mode';
  const URL_KEY = 'my-ledger-v1-api';
  const PASS_KEY = 'my-ledger-v1-password';
  const moneyFmt = new Intl.NumberFormat('zh-CN', {minimumFractionDigits:2,maximumFractionDigits:2});
  const palette=['#448a76','#e5a26f','#7a9fb0','#ac9abb','#d8c279','#85aaa0','#d1848c','#a4b68e','#a4a2c7'];
  const iconPaths = {
    house:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
    list:'<path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',settings:'<circle cx="12" cy="12" r="3"/><path d="M20 12a8 8 0 0 0-.1-1.3l1.6-1.2-1.8-3.2-1.9.8a8 8 0 0 0-2.2-1.3l-.3-2.1h-3.6l-.3 2.1a8 8 0 0 0-2.2 1.3l-1.9-.8-1.8 3.2 1.6 1.2a8 8 0 0 0 0 2.6l-1.6 1.2 1.8 3.2 1.9-.8a8 8 0 0 0 2.2 1.3l.3 2.1h3.6l.3-2.1a8 8 0 0 0 2.2-1.3l1.9.8 1.8-3.2-1.6-1.2A8 8 0 0 0 20 12z"/>',
    chart:'<path d="M3 3v18h18"/><path d="m6 16 5-5 4 3 5-8"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',
    chevron:'<path d="m6 9 6 6 6-6"/>',right:'<path d="m9 18 6-6-6-6"/>',arrowup:'<path d="m7 14 5-5 5 5M12 9v11"/>',arrowdown:'<path d="m7 10 5 5 5-5M12 4v11"/>',
    wallet:'<rect x="3" y="6" width="18" height="15" rx="3"/><path d="M3 10h18M6 6V4a1 1 0 0 1 1-1h11"/>',
    utensils:'<path d="M4 3v7a3 3 0 0 0 6 0V3M7 3v18M20 21V3c-5 3-6 8-6 12h6"/>',
    cart:'<circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M2 3h2l3 13h12l3-9H5"/>',
    car:'<path d="m5 17-1 3h3l1-2h8l1 2h3l-1-3M3 11l3-6h12l3 6v7H3zM3 12h18M7 15h.01M17 15h.01"/>',
    phone:'<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
    gift:'<rect x="3" y="8" width="18" height="13" rx="1"/><path d="M12 8v13M3 12h18M12 8C6 8 5 2 8 2c2 0 4 3 4 6zm0 0c6 0 7-6 4-6-2 0-4 3-4 6z"/>',
    home2:'<path d="m3 10 9-7 9 7v10H3zM9 21v-7h6v7"/>',
    heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8l8.8 8.8 8.8-8.8a5.5 5.5 0 0 0 0-7.8z"/>',
    coffee:'<path d="M4 8h14v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zm14 1h2a3 3 0 0 1 0 6h-2M7 2v3M12 2v3"/>',
    more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    search:'<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
    download:'<path d="M12 3v12m-4-4 4 4 4-4M4 17v4h16v-4"/>',upload:'<path d="M12 17V4m-4 4 4-4 4 4M4 18v3h16v-3"/>',
    cloud:'<path d="M8 19h12a4 4 0 0 0 .5-8A7 7 0 0 0 7 8a5.5 5.5 0 0 0 1 11z"/>',refresh:'<path d="M20 11a8 8 0 0 0-14-5L3 9m0-6v6h6M4 13a8 8 0 0 0 14 5l3-3m0 6v-6h-6"/>',
    close:'<path d="M18 6 6 18M6 6l12 12"/>',check:'<path d="m5 12 5 5L20 7"/>',filter:'<path d="M4 6h16M7 12h10M10 18h4"/>',
    shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    trash:'<path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15M10 10v7M14 10v7"/>',
    copy:'<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
    circle:'<circle cx="12" cy="12" r="9"/>',
    spark:'<path d="M12 2 9 9l-7 3 7 3 3 7 3-7 7-3-7-3z"/>'
  };
  const icon = (name, cls='') => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name]||iconPaths.circle}</svg>`;
  const escapeHTML = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const localToday = () => {const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
  const localTime = () => {const d=new Date();return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`};
  const dateAt = (year, month, day) => `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  const shiftDate = (date,delta) => {const [y,m,d]=date.split('-').map(Number);const v=new Date(y,m-1,d+delta);return dateAt(v.getFullYear(),v.getMonth()+1,v.getDate())};
  const monthKey = date => date?.slice(0,7)||'';
  const monthStart = month => `${month}-01`;
  const monthEnd = month => {const [y,m]=month.split('-').map(Number);return dateAt(y,m,new Date(y,m,0).getDate())};
  const monthLabel = m => {const [y,mm]=m.split('-').map(Number);return `${y}年${mm}月`};
  const money = n => moneyFmt.format(Number(n)||0);
  const categories = {
    '支出':[
      ['日常生活','餐饮美食','早餐','utensils'],['日常生活','餐饮美食','午餐','utensils'],['日常生活','餐饮美食','晚餐','utensils'],['日常生活','餐饮美食','零食饮品','coffee'],
      ['日常生活','食材','蔬菜调味','cart'],['日常生活','食材','肉蛋粮油','cart'],['日常生活','通讯费用','手机话费','phone'],
      ['日常生活','交通出行','打车','car'],['日常生活','交通出行','油费停车','car'],['日常生活','居家生活','日用品','home2'],
      ['日常生活','居家生活','水电燃气','home2'],['日常生活','购物消费','服饰数码','cart'],['日常生活','个人护理','理发美容','heart'],
      ['家庭支出','亲子育儿','母婴用品','heart'],['家庭支出','亲子育儿','儿童教育','heart'],['家庭支出','健康医疗','药品就医','heart'],
      ['休闲娱乐','旅行出游','交通住宿','car'],['休闲娱乐','娱乐活动','聚会娱乐','gift'],['其他支出','其他','其他支出','more']
    ],
    '收入':[['工作收入','工资薪酬','工资','wallet'],['工作收入','工资薪酬','奖金','gift'],['投资收入','理财收益','利息','chart'],['其他收入','转入款项','转账收入','wallet'],['其他收入','其他','其他收入','more']]
  };
  const categoryIcon = e => {const found=[...categories['支出'],...categories['收入']].find(c=>c[1]===e.cat2||c[2]===e.cat3);return found?.[3] || (e.type==='收入'?'wallet':'more')};
  const categoryColor = name => {let h=0;for(let i=0;i<name.length;i++)h=(h*31+name.charCodeAt(i))>>>0;return palette[h%palette.length]};
  const getStore = () => {try {const x=JSON.parse(localStorage.getItem(DB_KEY));if(x&&Array.isArray(x.entries))return x} catch {}return null};
  const demoData = () => {
    const today=localToday(); const examples=[
      ['午餐·牛肉面',28,'支出','日常生活','餐饮美食','午餐'],['买菜·蔬菜水果',67.5,'支出','日常生活','食材','蔬菜调味'],
      ['手机话费',100,'支出','日常生活','通讯费用','手机话费'],['周末咖啡',32,'支出','日常生活','餐饮美食','零食饮品'],
      ['打车',24.8,'支出','日常生活','交通出行','打车'],['超市采购',166.8,'支出','日常生活','食材','肉蛋粮油'],
      ['早餐',18,'支出','日常生活','餐饮美食','早餐'],['理发',35,'支出','日常生活','个人护理','理发美容'],
      ['晚餐',68,'支出','日常生活','餐饮美食','晚餐'],['家庭日用品',96,'支出','日常生活','居家生活','日用品'],
      ['儿童用品',128,'支出','家庭支出','亲子育儿','母婴用品'],['停车费',12,'支出','日常生活','交通出行','油费停车'],
      ['午餐',36,'支出','日常生活','餐饮美食','午餐'],['水果',44,'支出','日常生活','食材','蔬菜调味'],
      ['兼职收入',680,'收入','其他收入','其他','其他收入'],['网购',159,'支出','日常生活','购物消费','服饰数码'],
      ['饮料',15,'支出','日常生活','餐饮美食','零食饮品'],['晚餐',52,'支出','日常生活','餐饮美食','晚餐'],
      ['药品',63,'支出','家庭支出','健康医疗','药品就医'],['交通',28,'支出','日常生活','交通出行','打车'],
      ['储蓄利息',138.28,'收入','投资收入','理财收益','利息'],['超市购物',87,'支出','日常生活','食材','肉蛋粮油'],
      ['晚餐',74,'支出','日常生活','餐饮美食','晚餐'],['工资收入',20500,'收入','工作收入','工资薪酬','工资']
    ];
    return examples.map((x,i)=>({id:'demo-'+i,name:x[0],amount:x[1],type:x[2],cat1:x[3],cat2:x[4],cat3:x[5],date:shiftDate(today,-[0,1,2,3,4,5,6,8,9,11,12,13,15,17,19,20,22,24,26,28,30,31,33,34][i]),time:'',merchant:'',note:'演示数据',demo:true}));
  };
  const persisted = getStore();
  const state = {
    tab:'home',mode:localStorage.getItem(MODE_KEY)==='cloud'?'cloud':'local',
    entries:persisted?.entries||demoData(),demo:persisted?.demo??true,
    month:monthKey(localToday()),statType:'支出',trendType:'支出',trendRange:'7d',
    filters:{type:'全部',category:'全部',search:'',from:monthStart(monthKey(localToday())),to:monthEnd(monthKey(localToday()))},
    syncedAt:'',busy:false,apiUrl:localStorage.getItem(URL_KEY)||'https://my-ledger-notion-api.songyan171010.workers.dev'
  };
  function localSave(){if(state.mode==='local')localStorage.setItem(DB_KEY,JSON.stringify({entries:state.entries,demo:state.demo}))}
  const sorted = rows => [...rows].sort((a,b)=> (b.date||'').localeCompare(a.date||'') || (b.time||'').localeCompare(a.time||''));
  const total = (rows,type) => rows.reduce((v,r)=>v+(r.type===type?Number(r.amount)||0:0),0);
  const ofMonth = month => state.entries.filter(e=>monthKey(e.date)===month);
  const groupCategories = (rows,type) => {
    const totals=new Map();for(const r of rows.filter(r=>r.type===type)){const cat=r.cat2||r.cat1||'未分类';totals.set(cat,(totals.get(cat)||0)+Number(r.amount||0))}
    return [...totals].map(([name,value])=>({name,value,color:categoryColor(name)})).sort((a,b)=>b.value-a.value);
  };
  const period = () => `<label class="period-control">${icon('calendar')}<span>${monthLabel(state.month)}</span>${icon('chevron')}<input type="month" id="monthPicker" min="2010-01" max="2100-12" value="${state.month}" aria-label="选择月份" /></label>`;
  const banner = () => state.demo&&state.mode==='local' ? `<div class="demo-banner">当前为演示数据，不代表真实收支。连接 Notion 后展示真实账单。<button data-action="clearDemo">清空演示</button></div>` : state.mode==='cloud'?`<div class="sync-strip"><span>${state.syncedAt?'最近同步 '+escapeHTML(state.syncedAt):'Notion 云端账本'}</span><button class="text-link" data-action="refreshCloud">刷新同步</button></div>`:'';
  function render(){
    const root=byId('content');if(!root)return;
    byId('topAction').innerHTML=state.tab==='settings'?icon('shield'):icon('settings');
    document.querySelectorAll('.nav-item').forEach(x=>x.classList.toggle('active',x.dataset.tab===state.tab));
    root.innerHTML=(state.tab==='home'?renderHome():state.tab==='records'?renderRecords():state.tab==='stats'?renderStats():renderSettings());
  }
  function renderHome(){
    const rows=ofMonth(state.month), inc=total(rows,'收入'),out=total(rows,'支出'),latest=sorted(state.entries).slice(0,5);
    return `${banner()}<div class="heading-line"><div><p class="eyebrow">把生活记得清清楚楚</p><h1 class="page-title">收支概览</h1></div>${period()}</div>
    <section class="hero-card"><div class="hero-label">本月结余（元）</div><div class="hero-amount">¥ ${money(inc-out)}</div><div class="hero-stats"><div><div class="mini-label"><i class="dot green"></i>本月收入</div><strong>¥ ${money(inc)}</strong></div><div><div class="mini-label"><i class="dot"></i>本月支出</div><strong>¥ ${money(out)}</strong></div></div></section>
    <div class="feature-grid"><button class="feature" data-action="gotoStats"><span class="feature-icon">${icon('chart')}</span><span><strong>深度统计</strong><span>三级分类 · 周月季对比</span></span></button><button class="feature" data-action="gotoRecords"><span class="feature-icon">${icon('search')}</span><span><strong>筛选账单</strong><span>每一笔来源都清晰</span></span></button></div>
    <section class="section"><div class="section-head"><h2 class="section-title">收支趋势</h2><div class="chart-tabs"><button data-trend="支出" class="${state.trendType==='支出'?'active':''}">支出</button><button data-trend="收入" class="${state.trendType==='收入'?'active':''}">收入</button></div></div><div class="panel">${renderLineChart('7d',state.trendType,state.month)}<div class="small-caption" style="text-align:center;margin-top:5px">近 7 天${state.trendType}趋势（元）</div></div></section>
    <section class="section"><div class="section-head"><h2 class="section-title">支出构成</h2><button class="text-link" data-action="gotoStats">查看统计 ${icon('right')}</button></div><div class="panel">${renderDonut(groupCategories(rows,'支出'))}</div></section>
    <section class="section"><div class="section-head"><h2 class="section-title">最近记录</h2><button class="text-link" data-action="gotoRecords">查看全部 ${icon('right')}</button></div>${latest.length?`<div class="transaction-list">${latest.map(renderEntry).join('')}</div>`:empty('暂无记账记录','告诉 GPT 记账，在 Notion 保存后刷新同步')}</section>`;
  }
  const empty=(title,subtitle)=>`<div class="empty">${icon('wallet')}<strong>${escapeHTML(title)}</strong>${escapeHTML(subtitle)}</div>`;
  function renderEntry(e){
    const cat=e.cat2||e.cat1||'未分类';const bg=e.type==='收入'?'#e9f6ef':'#f6f2ea';const fg=e.type==='收入'?'#4a9674':'#c48b59';
    return `<button class="transaction-item" data-detail="${escapeHTML(e.id)}"><span class="transaction-icon" style="background:${bg};color:${fg}">${icon(categoryIcon(e))}</span><span class="transaction-main"><span class="transaction-title">${escapeHTML(e.name)}</span><span class="transaction-meta">${escapeHTML(e.date||'')} ${escapeHTML(e.time||'')} · ${escapeHTML(cat)}</span></span><strong class="transaction-amount ${e.type==='收入'?'income':'expense'}">${e.type==='收入'?'+':'-'}${money(e.amount)}</strong></button>`;
  }
  function renderDonut(items){const sum=items.reduce((x,y)=>x+y.value,0);if(!sum)return `<div class="chart-no-data">本期暂无分类数据</div>`;
    let pos=0;const stops=items.map(c=>{const a=pos;pos+=c.value/sum*360;return `${c.color} ${a.toFixed(3)}deg ${pos.toFixed(3)}deg`});
    return `<div class="donut-box"><div class="donut" role="img" aria-label="分类金额饼图" style="background:conic-gradient(${stops.join(',')})"><div class="donut-center"><span>总计</span><strong>¥${money(sum)}</strong></div></div><div class="legend">${items.slice(0,5).map(c=>`<div class="legend-row"><i class="legend-dot" style="background:${c.color}"></i><span class="legend-label">${escapeHTML(c.name)}</span><span class="legend-value">${(c.value/sum*100).toFixed(1)}%</span></div>`).join('')}${items.length>5?`<div class="small-caption">还有 ${items.length-5} 类，详见下方</div>`:''}</div></div>`;
  }
  function lineData(range,type,month){const end=(month===monthKey(localToday()))?localToday():monthEnd(month);let labels=[];
    if(range==='6m') {const [y,m]=month.split('-').map(Number);for(let i=5;i>=0;i--){const d=new Date(y,m-1-i,1);labels.push({key:dateAt(d.getFullYear(),d.getMonth()+1,1).slice(0,7),label:`${d.getMonth()+1}月`})}}
    else {const days=range==='7d'?7:30;for(let i=days-1;i>=0;i--){const d=shiftDate(end,-i);labels.push({key:d,label:d.slice(5).replace('-','/')})}}
    const data=labels.map(l=>({label:l.label,value:state.entries.reduce((s,r)=>s+(r.type===type&&(range==='6m'?monthKey(r.date)===l.key:r.date===l.key)?Number(r.amount)||0:0),0)}));return data;}
  function renderLineChart(range,type,month){const data=lineData(range,type,month);const W=400,H=165,left=48,right=18,top=16,bottom=32,cw=W-left-right,ch=H-top-bottom;
    const max=Math.max(20,...data.map(d=>d.value));const ceil=Math.ceil(max/(max>1000?500:max>100?50:10))*(max>1000?500:max>100?50:10);const sx=i=>left+(data.length===1?cw/2:(i/(data.length-1))*cw),sy=v=>top+ch*(1-v/ceil);
    const pts=data.map((d,i)=>[sx(i),sy(d.value)]);const line=pts.map((p,i)=>`${i===0?'M':'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');const area=`${line} L${sx(data.length-1)},${top+ch} L${sx(0)},${top+ch} Z`;
    const show=range==='30d'?new Set([0,7,14,21,29]):new Set(data.map((_,i)=>i)); const color=type==='收入'?'#3d9e82':'#e3a178';
    return `<div class="line-chart-wrap"><svg class="line-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${escapeHTML(type)}${escapeHTML(range)}趋势图">${[0,1,2,3].map(i=>`<line class="chart-grid-line" x1="${left}" x2="${W-right}" y1="${top+i*ch/3}" y2="${top+i*ch/3}"/><text x="${left-6}" y="${top+i*ch/3+3}" text-anchor="end" class="chart-label">${Math.round(ceil*(1-i/3))}</text>`).join('')}<path d="${area}" fill="${color}" opacity=".09"/><path d="${line}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${pts.map((p,i)=>data[i].value?`<circle cx="${p[0]}" cy="${p[1]}" r="2.6" fill="#fff" stroke="${color}" stroke-width="1.6"><title>${escapeHTML(data[i].label)}：¥${money(data[i].value)}</title></circle>`:'').join('')}${data.map((d,i)=>show.has(i)?`<text x="${sx(i)}" y="${H-7}" text-anchor="middle" class="chart-label">${escapeHTML(d.label)}</text>`:'').join('')}</svg></div>`;
  }
  const A=window.LedgerAnalytics;
  const freshAnalysis=()=>({period:'month',anchor:localToday(),from:monthStart(monthKey(localToday())),to:localToday(),type:'支出',cat1:'',cat2:'',cat3:'',merchant:'',search:'',min:'',max:'',weekday:'',compare:'previous',view:'daily',sort:'date',limit:50});
  state.analysis=freshAnalysis();
  if(state.mode==='cloud'){state.entries=[];state.demo=false;}
  const esc=escapeHTML;
  const signed=n=>(n>0?'+':'')+money(n);
  const periodNames={week:'周',month:'月',quarter:'季度',year:'年',custom:'自定义'};
  const selectField=(key,label,values)=>`<label>${label}<select data-analysis="${key}">${values.map(([v,t])=>`<option value="${esc(v)}" ${String(state.analysis[key])===String(v)?'selected':''}>${esc(t)}</option>`).join('')}</select></label>`;
  function analysisFilters(){const f=state.analysis;
    const opts=k=>{let rows=state.entries.filter(r=>f.type==='全部'||r.type===f.type);if(k==='cat2'||k==='cat3')rows=rows.filter(r=>!f.cat1||A.cat(r,'cat1')===f.cat1);if(k==='cat3')rows=rows.filter(r=>!f.cat2||A.cat(r,'cat2')===f.cat2);return [['','全部'],...[...new Set(rows.map(r=>A.cat(r,k)))].sort().map(v=>[v,v])];};
    return `<section class="panel analysis-filters"><div class="section-head"><h2 class="section-title">深度筛选</h2><button class="text-link" data-analysis-reset>重置全部</button></div><div class="filter-grid">
    ${selectField('period','时间维度',Object.entries(periodNames))}<label>${f.period==='custom'?'开始日期':'周期内任意一天'}<input data-analysis="${f.period==='custom'?'from':'anchor'}" type="date" value="${esc(f.period==='custom'?f.from:f.anchor)}" required></label>
    ${f.period==='custom'?`<label>结束日期<input data-analysis="to" type="date" value="${esc(f.to)}" required></label>`:''}
    ${selectField('type','收支类型',[['支出','支出'],['收入','收入'],['全部','全部流水']])}
    ${['cat1','cat2','cat3'].map((k,i)=>selectField(k,['一级分类','二级分类','三级分类'][i],opts(k))).join('')}
    ${selectField('merchant','商家 / 对象',opts('merchant'))}${selectField('weekday','星期',[['','全部星期'],...['一','二','三','四','五','六','日'].map((v,i)=>[String(i),'周'+v])])}
    <label>最低金额（元）<input data-analysis="min" type="number" min="0" step="0.01" value="${esc(f.min)}" placeholder="不限"></label><label>最高金额（元）<input data-analysis="max" type="number" min="0" step="0.01" value="${esc(f.max)}" placeholder="不限"></label>
    </div><form id="analysisSearch" class="analysis-search"><label>项目 / 备注 / 分类关键词<input name="query" value="${esc(f.search)}" placeholder="例如：话费、午餐" type="search"></label><button class="outline-button">筛选</button></form>
    <p class="small-caption">所有条件同时生效。分类选项来自账本原始记录，空白字段归入“未分类”。</p></section>`;
  }
  function analysisContext(){const f=state.analysis,r=A.ranges(f,localToday());if(r.error)return {error:r.error};if((f.min!==''&&Number(f.min)<0)||(f.max!==''&&Number(f.max)<0)||(f.min!==''&&f.max!==''&&Number(f.min)>Number(f.max)))return {error:'金额范围无效，请检查最低和最高金额。'};return {r,rows:A.select(state.entries,f,r.current),prev:A.select(state.entries,f,r.previous),year:A.select(state.entries,f,r.year)}}
  function analysisHeader(detail){return `${banner()}<div class="page-intro"><p class="eyebrow">GPT 记账 · Notion 保存 · 这里看清每一笔</p><h1 class="page-title">${detail?'账单深度查询':'收支深度分析'}</h1><p class="page-subtitle">同一套筛选条件，贯通总览、分类、趋势与明细</p></div>${analysisFilters()}`}
  const rangeText=r=>r[0]+' 至 '+r[1];
  function periodNotice(c){return `<div class="analysis-scope"><strong>${rangeText(c.r.current)}</strong><span>${c.r.length} 个自然日 · ${c.rows.length} 笔匹配 · ${state.demo?'演示数据':state.mode==='cloud'?'Notion 云端':'本机备份'}</span></div><p class="small-caption">${c.r.partial?'本期未结束，比较周期按相同已过天数截取，短月封顶月末。':'完整周期比较；不同月份、季度天数可能不同，可参考日均金额。'}${c.r.week?'周一至周日；周同比为往前 52 周，保持星期对齐。':''} 未匹配到账单不代表该期间已完整记账。</p>`}
  function metricCards(c){const cur=A.metrics(c.rows,c.r.current),prev=A.metrics(c.prev,c.r.previous),year=A.metrics(c.year,c.r.year);return `<div class="analysis-kpis">${[['expense','支出','元'],['income','收入','元'],['balance','结余','元'],['count','交易笔数','笔'],['average','平均每笔','元'],['daily','日均流水','元']].map(([k,n,u])=>`<article class="stat-tile"><span>${n}</span><strong>${k==='count'?cur[k]:money(cur[k])}<small> ${u}</small></strong><p>环比 ${A.delta(cur[k],prev[k])}</p><p>同比 ${A.delta(cur[k],year[k])}</p></article>`).join('')}</div><p class="small-caption">“平均每笔”和“日均流水”按当前筛选下的收支金额合计计算；结余 = 收入 − 支出。</p>`}
  function comparisonTable(c){const a=A.metrics(c.rows,c.r.current),b=A.metrics(c.prev,c.r.previous),y=A.metrics(c.year,c.r.year);return `<section class="section panel"><h2 class="section-title">同期对比</h2><p class="small-caption">环比：${rangeText(c.r.previous)}<br>同比：${rangeText(c.r.year)}</p><div class="table-scroll"><table class="analysis-table"><thead><tr><th>指标</th><th>本期</th><th>环比基期</th><th>差额</th><th>同比基期</th><th>差额</th></tr></thead><tbody>${[['expense','支出'],['income','收入'],['balance','结余'],['count','笔数'],['daily','日均流水']].map(([k,n])=>`<tr><th>${n}</th><td>${money(a[k])}</td><td>${money(b[k])}</td><td>${signed(a[k]-b[k])}</td><td>${money(y[k])}</td><td>${signed(a[k]-y[k])}</td></tr>`).join('')}</tbody></table></div><p class="small-caption">基期为 0 时不计算增长率；“持平”表示两期均为 0。结余增长率以基期绝对值为分母，改善或恶化请结合差额判断。</p></section>`}
  function trendChart(c){const f=state.analysis,cr=c.r.current,br=c.r[f.compare],base=f.compare==='year'?c.year:c.prev;
    const n=Math.max(c.r.length,A.days(...br));const cur=Array(c.r.length).fill(0),old=Array(A.days(...br)).fill(0);for(const x of c.rows)cur[A.days(cr[0],x.date)-1]+=Math.round(x.amount*100);for(const x of base)old[A.days(br[0],x.date)-1]+=Math.round(x.amount*100);
    if(f.view==='cumulative'){for(let i=1;i<cur.length;i++)cur[i]+=cur[i-1];for(let i=1;i<old.length;i++)old[i]+=old[i-1]}
    const max=Math.max(100,...cur,...old)/100,W=640,H=260,L=68,R=20,T=25,B=42,cw=W-L-R,ch=H-T-B,x=i=>L+i/Math.max(1,n-1)*cw,y=v=>T+ch-v/100/max*ch;
    const line=(vals,color,dash)=>`<path d="${vals.map((v,i)=>(i?'L':'M')+x(i).toFixed(1)+','+y(v).toFixed(1)).join(' ')}" fill="none" stroke="${color}" stroke-width="2.5" ${dash?'stroke-dasharray="6 4"':''}/>${vals.map((v,i)=>`<circle cx="${x(i)}" cy="${y(v)}" r="${n>100?1.5:3}" fill="${color}"><title>${addFor(i,dash)}：¥${money(v/100)}</title></circle>`).join('')}`;
    function addFor(i,old){return A.add((old?br:cr)[0],i)}
    return `<section class="section panel"><div class="section-head"><h2 class="section-title">${f.type==='全部'?'流水金额':f.type}趋势</h2></div><div class="filter-grid">${selectField('compare','对比曲线',[['previous','环比基期'],['year','同比基期']])}${selectField('view','图表口径',[['daily','每日金额'],['cumulative','累计金额']])}</div><div class="chart-legend"><span>● 本期</span><span>┄ ${f.compare==='year'?'同比':'环比'}基期</span><span>单位：元</span></div><svg viewBox="0 0 ${W} ${H}" class="line-svg analysis-chart" role="img" aria-label="本期与对比周期按第几天对齐的金额趋势">${[0,1,2,3,4].map(i=>`<line x1="${L}" x2="${W-R}" y1="${T+i*ch/4}" y2="${T+i*ch/4}" stroke="#e6ece7"/><text x="${L-8}" y="${T+i*ch/4+4}" text-anchor="end" class="chart-label">${Math.round(max*(1-i/4)).toLocaleString('zh-CN')}</text>`).join('')}${line(old,'#bd8b63',true)}${line(cur,'#285849',false)}${[...new Set([0,Math.floor((n-1)/2),n-1])].map(i=>`<text x="${x(i)}" y="${H-13}" text-anchor="middle" class="chart-label">第 ${i+1} 天</text>`).join('')}</svg><details><summary>查看每日精确金额</summary><div class="table-scroll"><table class="analysis-table"><thead><tr><th>序号</th><th>本期日期</th><th>金额</th><th>基期日期</th><th>金额</th></tr></thead><tbody>${Array.from({length:n},(_,i)=>`<tr><td>${i+1}</td><td>${i<cur.length?A.add(cr[0],i):'—'}</td><td>${i<cur.length?money(cur[i]/100):'—'}</td><td>${i<old.length?A.add(br[0],i):'—'}</td><td>${i<old.length?money(old[i]/100):'—'}</td></tr>`).join('')}</tbody></table></div></details></section>`;
  }
  function ranking(items,total,attr,base=[]){const max=Math.max(1,...items.map(x=>x.value));return items.length?`<div class="analysis-ranking">${items.map((v,i)=>{const before=base.find(x=>x.name===v.name)?.value||0;return `<button ${attr?attr(v):'disabled'} class="rank-row"><span>${i+1}. ${esc(v.name)}</span><strong>¥${money(v.value)}</strong><span class="rank-track"><i style="width:${v.value/max*100}%"></i></span><small>${v.count} 笔 · 占 ${total?(v.value/total*100).toFixed(1):'0.0'}% · 环比 ${A.delta(v.value,before)} · 差额 ${signed(v.value-before)}</small></button>`}).join('')}</div>`:'<div class="section-empty">没有符合筛选条件的记录</div>'}
  function categoryAnalysis(c){const f=state.analysis,key=!f.cat1?'cat1':!f.cat2?'cat2':'cat3',level={cat1:'一级',cat2:'二级',cat3:'三级'}[key],cats=A.group(c.rows,key),base=A.group(c.prev,key),full=A.sum(c.rows);
    const tree=(rows,depth=1)=>A.group(rows,'cat'+depth).map(g=>{const subset=rows.filter(r=>A.cat(r,'cat'+depth)===g.name);return `<details class="category-node"><summary>${esc(g.name)} <strong>¥${money(g.value)}</strong><small>${g.count} 笔 · ${full?(g.value/full*100).toFixed(1):0}%</small></summary>${depth<3?tree(subset,depth+1):`<button class="text-link" data-path="${esc(JSON.stringify(['cat1','cat2','cat3'].map(k=>A.cat(subset[0],k))))}">筛选此分类的账单 →</button>`}</details>`}).join('');
    return `<section class="section panel"><div class="section-head"><h2 class="section-title">分类钻取 · ${level}分类</h2><button class="text-link" data-category-up>返回上一级</button></div><p class="small-caption">${[f.cat1,f.cat2,f.cat3].filter(Boolean).map(esc).join(' / ')||'全部分类'} · 点击排行继续筛选</p>${renderDonut(cats.map(v=>({...v,color:categoryColor(v.name)})))}${ranking(cats,full,v=>`data-drill="${esc(v.name)}" data-level="${key}"`,base)}<details class="tree-root"><summary>展开完整三级分类树</summary>${tree(c.rows)||'<p>暂无分类</p>'}</details></section>`;
  }
  function extraCharts(c){const full=A.sum(c.rows),merchants=A.group(c.rows,'merchant'),week=Array.from({length:7},(_,i)=>{const rows=c.rows.filter(r=>(new Date(r.date+'T00:00:00Z').getUTCDay()+6)%7===i);const occurrences=Array.from({length:c.r.length},(_,j)=>A.add(c.r.current[0],j)).filter(d=>(new Date(d+'T00:00:00Z').getUTCDay()+6)%7===i).length;return {name:'周'+'一二三四五六日'[i],value:A.sum(rows),count:rows.length,occurrences}}),max=Math.max(1,...week.map(x=>x.value));
    const bands=[[0,20,'0–20 元'],[20,50,'20–50 元'],[50,100,'50–100 元'],[100,500,'100–500 元'],[500,Infinity,'500 元以上']];
    const daily=new Map();for(const r of c.rows)daily.set(r.date,(daily.get(r.date)||0)+Math.round(r.amount*100));const peak=Math.max(1,...daily.values());
    return `<div class="analysis-two"><section class="section panel"><h2 class="section-title">商家 / 对象排行</h2><p class="small-caption">点击商家筛选 · 缺失商家归入未分类</p>${ranking(merchants,full,v=>`data-merchant="${esc(v.name)}"`,A.group(c.prev,'merchant'))}</section><section class="section panel"><h2 class="section-title">星期分布</h2><p class="small-caption">总金额与该星期日均值，点击星期筛选</p><div class="weekday-chart">${week.map((v,i)=>`<button data-weekday="${i}" aria-label="${v.name}，${v.count}笔，${money(v.value)}元"><strong>${money(v.value)}</strong><i style="height:${v.value/max*95+2}px"></i><span>${v.name}</span><small>${v.occurrences} 天<br>日均 ${money(v.occurrences?v.value/v.occurrences:0)}</small></button>`).join('')}</div></section></div>
    <section class="section panel"><h2 class="section-title">金额分布</h2><p class="small-caption">区间左闭右开；点击查看对应金额账单</p>${bands.map(([lo,hi,n])=>{const rows=c.rows.filter(r=>r.amount>=lo&&r.amount<hi);return `<button class="distribution-row" data-band="${lo},${hi===Infinity?'':hi-0.01}"><span>${n}</span><strong>${rows.length} 笔</strong><span>¥ ${money(A.sum(rows))}</span></button>`}).join('')}</section>
    <section class="section panel"><h2 class="section-title">每日金额日历</h2><p class="small-caption">浅 → 深表示金额低 → 高；点击一天查看当日账单，横向滚动查看较长周期。</p><div class="calendar-scroll"><div class="calendar-grid">${Array.from({length:c.r.length},(_,i)=>{const d=A.add(c.r.current[0],i),v=daily.get(d)||0;return `<button data-day="${d}" style="background:rgba(40,88,73,${v?0.18+v/peak*0.7:0.04});color:${v/peak>.5?'white':'#285849'}" aria-label="${d}，${money(v/100)}元"><span>${d.slice(5)}</span><small>${money(v/100)}</small></button>`}).join('')}</div></div></section>`;
  }
  function analysisRecords(c,detail){const f=state.analysis;let rows=[...c.rows];rows.sort(f.sort==='amountDesc'?(a,b)=>b.amount-a.amount:f.sort==='amountAsc'?(a,b)=>a.amount-b.amount:(a,b)=>(b.date+b.time).localeCompare(a.date+a.time));return `<section class="section"><div class="section-head"><h2 class="section-title">${detail?'匹配账单':'筛选结果明细'}</h2><button class="text-link" data-export-filtered>导出筛选 CSV</button></div><div class="filter-grid">${selectField('sort','排列方式',[['date','日期从近到远'],['amountDesc','金额从高到低'],['amountAsc','金额从低到高']])}<span class="small-caption">${rows.length} 笔 · 合计 ¥ ${money(A.sum(rows))}</span></div><div class="transaction-list">${rows.slice(0,f.limit).map(renderEntry).join('')||'<p class="section-empty">没有匹配记录，请调整筛选条件。</p>'}</div>${rows.length>f.limit?`<button class="outline-button" data-load-more>再显示 50 笔（剩余 ${rows.length-f.limit} 笔）</button>`:''}</section>`}
  function renderAnalysis(detail=false){const c=analysisContext();if(c.error)return analysisHeader(detail)+`<p class="demo-banner" role="alert">${esc(c.error)}</p>`;return analysisHeader(detail)+periodNotice(c)+metricCards(c)+(detail?'':comparisonTable(c)+trendChart(c)+categoryAnalysis(c)+extraCharts(c))+analysisRecords(c,detail)}
  function renderStats(){return renderAnalysis()}
  function renderRecords(){return renderAnalysis(true)}
  function openDetails(e){if(!e)return;byId('sheetTitle').textContent='账单详情';byId('entryDetails').innerHTML=`<div class="stat-total">${e.type==='收入'?'+':'−'} ¥${money(e.amount)}</div><dl class="entry-details">${[['项目',e.name],['类型',e.type],['日期',e.date+' '+e.time],['一级分类',e.cat1],['二级分类',e.cat2],['三级分类',e.cat3],['商家 / 对象',e.merchant],['备注',e.note]].map(([k,v])=>`<dt>${k}</dt><dd>${esc(v||'未填写')}</dd>`).join('')}</dl><p class="small-caption">需要调整账单？告诉 GPT，在 Notion 更新后刷新同步即可。</p>`;byId('modalBackdrop').classList.remove('hidden');document.body.style.overflow='hidden';byId('closeSheet').focus()}
  document.addEventListener('change',e=>{const k=e.target.dataset.analysis;if(!k)return;const f=state.analysis;f[k]=e.target.value;f.limit=50;if(k==='type'||k==='cat1'){f.cat2='';f.cat3='';if(k==='type')f.cat1=''}if(k==='cat2')f.cat3='';render()});
  document.addEventListener('submit',e=>{if(e.target.id!=='analysisSearch')return;e.preventDefault();state.analysis.search=new FormData(e.target).get('query').trim();state.analysis.limit=50;render()});
  document.addEventListener('click',e=>{const f=state.analysis,b=e.target.closest('button');if(!b)return;const d=b.dataset;let update=true;
    if('analysisReset'in d)state.analysis=freshAnalysis();
    else if('drill'in d){f[d.level]=d.drill;if(d.level==='cat1'){f.cat2='';f.cat3=''}if(d.level==='cat2')f.cat3='';}
    else if('categoryUp'in d){if(f.cat3)f.cat3='';else if(f.cat2)f.cat2='';else f.cat1=''}
    else if('path'in d)[f.cat1,f.cat2,f.cat3]=JSON.parse(d.path);
    else if('merchant'in d)f.merchant=d.merchant;
    else if('weekday'in d)f.weekday=d.weekday;
    else if('band'in d)[f.min,f.max]=d.band.split(',');
    else if('day'in d){f.period='custom';f.from=d.day;f.to=d.day;state.tab='records'}
    else if('loadMore'in d)f.limit+=50;
    else if('exportFiltered'in d){exportFiltered();return}
    else update=false;if(update){if(!('loadMore'in d))f.limit=50;render()}
  });
  function exportFiltered(){const c=analysisContext();if(c.error)return notify(c.error);const cell=v=>{let s=String(v??'');if(/^[=+@\-\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'};const cols=['项目','类型','金额(元)','日期','时间','一级分类','二级分类','三级分类','商家','备注'];download('\uFEFF'+[cols,...c.rows.map(r=>[r.name,r.type,r.amount,r.date,r.time,r.cat1,r.cat2,r.cat3,r.merchant,r.note])].map(r=>r.map(cell).join(',')).join('\r\n'),'账本筛选-'+c.r.current.join('_')+'.csv','text/csv;charset=utf-8')}

  function renderSettings(){const cloud=state.mode==='cloud',auth=!!sessionStorage.getItem(PASS_KEY);
    return `<div class="page-intro"><p class="eyebrow">数据与偏好设置</p><h1 class="page-title">我的账本</h1><p class="page-subtitle">记录生活，安心管理自己的每一笔收支</p></div>
      <div class="settings-card"><h2 class="settings-title">${icon('cloud')} 云端同步 · Notion</h2><p class="settings-desc">GitHub Pages 只负责展示网站。使用独立的安全接口连接 Notion 后，手机和电脑可以查看同一份账本；ChatGPT 写入 Notion 的账单也能同步到这里。</p><div class="status-line"><i class="status-dot ${cloud&&auth?'on':''}"></i>${cloud?(auth?'已连接云端账本':'云端模式 · 需重新解锁'):'当前使用本机存储'}</div>
      ${state.syncedAt?`<p class="small-caption">最近同步：${escapeHTML(state.syncedAt)}</p>`:''}<form id="cloudForm" class="connect-form"><label>安全同步接口地址<input id="cloudUrl" type="url" placeholder="https://xxxx.workers.dev" value="${escapeHTML(state.apiUrl)}" autocomplete="url" required /></label><label>访问密码（仅保存至当前标签页会话）<input id="cloudPass" type="password" placeholder="填写你在 Worker 设置的访问密码" autocomplete="off" required /></label><button class="primary-button" type="submit">${cloud?'重新连接 / 解锁':'连接 Notion 云端账本'}</button></form>
      <div class="cloud-warning">请勿在此填写 Notion API Token。Token 只能保存在云端 Worker 的 Secret 中。</div>
      ${cloud?`<div style="display:flex;gap:9px;margin-top:14px"><button class="outline-button" data-action="refreshCloud">${icon('refresh')} 刷新同步</button><button class="outline-button danger" data-action="disconnectCloud">切回本机</button></div>`:''}</div>
      <div class="settings-card"><h2 class="settings-title">${icon('download')} 数据管理</h2><p class="settings-desc">支持 CSV 和 JSON 备份。切换设备时，未连接云端的本机数据不会自动同步。</p><div class="settings-row"><span>当前记录</span><strong>${state.entries.length} 笔 ${state.demo?'<span class="pill">演示</span>':''}</strong></div><div class="settings-row"><span>导出 CSV</span><button class="outline-button" data-action="exportCsv">导出</button></div><div class="settings-row"><span>导出 JSON 备份</span><button class="outline-button" data-action="exportJson">导出</button></div>${!cloud?`<div class="settings-row"><span>导入 JSON / CSV</span><button class="outline-button" data-action="importFile">导入</button></div><div class="settings-row"><span>${state.demo?'清空演示数据':'清空本机账本'}</span><button class="outline-button danger" data-action="clearLocal">清空</button></div>`:''}</div>
      <div class="settings-card"><h2 class="settings-title">${icon('shield')} 隐私说明</h2><p class="settings-desc" style="margin:0">本机模式仅保存在当前浏览器的 localStorage 中；清除浏览器数据会导致丢失。云端模式由 Notion 保存原始记录，网站不持久保存云端密码。请定期导出备份。</p></div>
      <div style="text-align:center;color:#a5b2aa;font-size:11px;padding:13px">我的记账本儿 · v2.0 分析版</div>`;
  }
  function setTab(tab){state.tab=tab;render();window.scrollTo({top:0,behavior:'instant'})}
  function notify(str){const el=byId('toast');el.textContent=str;el.classList.remove('hidden');clearTimeout(notify.timeout);notify.timeout=setTimeout(()=>el.classList.add('hidden'),2600)}
  function closeSheet(){byId('modalBackdrop').classList.add('hidden');document.body.style.overflow='';document.querySelector('.nav-item.active')?.focus()}
  async function requestCloud(path,options={}){
    const pass=sessionStorage.getItem(PASS_KEY);if(!pass)throw Error('请先在「我的」页面填写云端密码并连接');
    const url=state.apiUrl.replace(/\/+$/,'')+path;
    const response=await fetch(url,{...options,headers:{'Content-Type':'application/json','X-Book-Password':pass,...(options.headers||{})},cache:'no-store'});
    let json={};try{json=await response.json()}catch{}if(!response.ok)throw Error(json.error||`请求失败 (${response.status})`);return json;
  }
  async function fetchCloud(){const result=await requestCloud('/entries');if(!Array.isArray(result.entries))throw Error('云端返回数据格式不正确');state.entries=result.entries.map(normalize).filter(Boolean);state.demo=false;state.syncedAt=new Date().toLocaleString('zh-CN');render();notify('Notion 同步成功，共 '+state.entries.length+' 笔')}
  async function runBusy(fn){if(state.busy)return;state.busy=true;document.body.classList.add('loading');try{await fn()}catch(err){console.error(err);notify(err.message||'操作失败，请重试')}finally{state.busy=false;document.body.classList.remove('loading')}}
  function normalize(raw){if(!raw||typeof raw!=='object')return null;const amount=Number(raw.amount);return {id:String(raw.id||''),name:String(raw.name||''),amount:Number.isFinite(amount)?amount:0,type:raw.type==='收入'?'收入':'支出',date:String(raw.date||localToday()),time:String(raw.time||''),cat1:String(raw.cat1||''),cat2:String(raw.cat2||''),cat3:String(raw.cat3||''),merchant:String(raw.merchant||''),note:String(raw.note||''),demo:!!raw.demo}}
  const download=(content,filename,type)=>{const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=filename;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)};
  function exportCsv(){const heads=['消费项目','收支类型','金额(元)','日期','时间','一级分类','二级分类','三级分类','商家','备注'];const f=e=>[e.name,e.type,e.amount,e.date,e.time,e.cat1,e.cat2,e.cat3,e.merchant,e.note];const esc=x=>`"${String(x??'').replace(/"/g,'""')}"`;download('\uFEFF'+[heads,...sorted(state.entries).map(f)].map(row=>row.map(esc).join(',')).join('\r\n'),'我的记账本儿-'+localToday()+'.csv','text/csv;charset=utf-8')}
  function exportJson(){download(JSON.stringify({version:1,exportedAt:new Date().toISOString(),entries:state.entries},null,2),'我的记账本儿-'+localToday()+'.json','application/json;charset=utf-8')}
  function parseCsv(text){text=text.replace(/^\uFEFF/,'');let rows=[],row=[],cell='',quoted=false;for(let i=0;i<text.length;i++){const ch=text[i];if(ch==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++}else quoted=!quoted}else if(ch===','&&!quoted){row.push(cell);cell=''}else if((ch==='\n'||ch==='\r')&&!quoted){if(ch==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(x=>x.trim()))rows.push(row);row=[];cell=''}else cell+=ch}row.push(cell);if(row.some(x=>x.trim()))rows.push(row);const [heads,...body]=rows;const idx=k=>heads?.indexOf(k)??-1;return body.map((r,i)=>normalize({id:'import-'+Date.now()+'-'+i,name:r[idx('消费项目')],type:r[idx('收支类型')],amount:r[idx('金额(元)')],date:r[idx('日期')],time:r[idx('时间')],cat1:r[idx('一级分类')],cat2:r[idx('二级分类')],cat3:r[idx('三级分类')],merchant:r[idx('商家')],note:r[idx('备注')]}));}
  async function importFile(e){const file=e.target.files?.[0];e.target.value='';if(!file)return;if(state.mode==='cloud'){notify('请先切回本机模式，再导入备份');return}if(file.size>5*1024*1024){notify('文件不能超过 5MB');return}
    try {const text=await file.text();const rows=file.name.toLowerCase().endsWith('.csv')?parseCsv(text):JSON.parse(text);const values=(Array.isArray(rows)?rows:rows.entries);if(!Array.isArray(values))throw Error('文件不包含账单数组');const parsed=values.map(normalize).filter(x=>x&&x.name&&x.date&&x.amount>0);
      if(!parsed.length)throw Error('没有可导入的账单');if(!confirm(`识别到 ${parsed.length} 笔记录。是否导入并去重？`))return;
      if(state.demo){state.entries=[];state.demo=false}const ids=new Set(state.entries.map(r=>r.id));for(const r of parsed){if(ids.has(r.id))continue;state.entries.push({...r,demo:false});ids.add(r.id)}localSave();render();notify('导入完成，共 '+parsed.length+' 笔')
    }catch(err){notify('导入失败：'+err.message)}
  }
  function clearLocal(){if(!confirm(state.demo?'清空演示数据并开始真实记账？':'确定清空本机所有账单吗？建议先导出备份。'))return;state.entries=[];state.demo=false;localSave();render();notify('本机账本已清空')}
  async function cloudConnect(e){e.preventDefault();const u=byId('cloudUrl').value.trim().replace(/\/+$/,''),pw=byId('cloudPass').value;
    let parsed;try{parsed=new URL(u);if(parsed.protocol!=='https:')throw Error('HTTPS required')}catch{notify('请填写有效的 HTTPS 接口地址');return}
    if(!pw){notify('请输入访问密码');return}const oldUrl=state.apiUrl;const oldPass=sessionStorage.getItem(PASS_KEY);state.apiUrl=u;sessionStorage.setItem(PASS_KEY,pw);
    await runBusy(async()=>{try {const response=await requestCloud('/entries');if(!Array.isArray(response.entries))throw Error('云端返回数据错误');state.mode='cloud';state.entries=response.entries.map(normalize).filter(Boolean);state.demo=false;state.syncedAt=new Date().toLocaleString('zh-CN');localStorage.setItem(MODE_KEY,'cloud');localStorage.setItem(URL_KEY,u);render();notify('连接成功，已同步 '+state.entries.length+' 笔')}catch(err){state.apiUrl=oldUrl;oldPass?sessionStorage.setItem(PASS_KEY,oldPass):sessionStorage.removeItem(PASS_KEY);throw err}});
  }
  function disconnectCloud(){if(!confirm('切回本机模式？Notion 云端账单不会被删除。'))return;state.mode='local';sessionStorage.removeItem(PASS_KEY);localStorage.setItem(MODE_KEY,'local');const local=getStore();state.entries=local?.entries||[];state.demo=local?.demo??false;render();notify('已切回本机模式')}
  document.addEventListener('click',event=>{
    const a=event.target.closest('[data-action]');if(a){const action=a.dataset.action;
      if(action==='gotoRecords')return setTab('records');if(action==='gotoStats')return setTab('stats');if(action==='clearDemo')return clearLocal();
      if(action==='exportCsv')return exportCsv();if(action==='exportJson')return exportJson();if(action==='importFile')return byId('importFile').click();if(action==='clearLocal')return clearLocal();if(action==='disconnectCloud')return disconnectCloud();if(action==='refreshCloud')return runBusy(fetchCloud);
    }
    const detail=event.target.closest('[data-detail]');if(detail)return openDetails(state.entries.find(x=>x.id===detail.dataset.detail));
    const nav=event.target.closest('[data-tab]');if(nav)return setTab(nav.dataset.tab);
    const trend=event.target.closest('[data-trend]');if(trend){state.trendType=trend.dataset.trend;return render()}
    const stats=event.target.closest('[data-stats-type]');if(stats){state.statType=stats.dataset.statsType;return render()}
    const range=event.target.closest('[data-range]');if(range){state.trendRange=range.dataset.range;return render()}
    const filter=event.target.closest('[data-filter-type]');if(filter){state.filters.type=filter.dataset.filterType;return render()}

  });
  byId('topAction').addEventListener('click',()=>setTab('settings'));
  byId('closeSheet').innerHTML=icon('close');byId('closeSheet').addEventListener('click',closeSheet);
  byId('modalBackdrop').addEventListener('click',e=>{if(e.target===byId('modalBackdrop'))closeSheet()});
  window.addEventListener('keydown',e=>{if(e.key==='Escape')closeSheet();if(e.key==='Tab'&&!byId('modalBackdrop').classList.contains('hidden')){e.preventDefault();byId('closeSheet').focus()}});
  byId('importFile').addEventListener('change',importFile);
  byId('content').addEventListener('submit',e=>{if(e.target.id==='cloudForm')cloudConnect(e)});
  byId('content').addEventListener('input',e=>{if(e.target.id==='entrySearch'){state.filters.search=e.target.value;const results=byId('recordResults');if(results)results.innerHTML=recordsSummary()}});
  byId('content').addEventListener('change',e=>{const el=e.target;if(el.id==='monthPicker'&&/^\d{4}-\d{2}$/.test(el.value)){state.month=el.value;state.filters.from=monthStart(el.value);state.filters.to=monthEnd(el.value);render()}
    if(el.id==='filterCategory'){state.filters.category=el.value;render()}if(el.id==='filterStart'){state.filters.from=el.value;render()}if(el.id==='filterEnd'){state.filters.to=el.value;render()}
  });
  document.querySelectorAll('[data-icon]').forEach(el=>{el.innerHTML=icon(el.dataset.icon)});
  render();if(state.mode==='cloud'&&sessionStorage.getItem(PASS_KEY)){runBusy(fetchCloud)}else if(state.mode==='cloud'){state.entries=[];state.tab='settings';render()}
  if('serviceWorker' in navigator && location.protocol==='https:'){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}))}
})();
