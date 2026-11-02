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
    busy:false,apiUrl:localStorage.getItem(URL_KEY)||''
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
  const banner = () => state.demo&&state.mode==='local' ? `<div class="demo-banner">当前为演示数据，不代表真实收支。新增第一笔真实记录时会自动移除。<button data-action="clearDemo">清空演示</button></div>` : '';
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
    <div class="feature-grid"><button class="feature" data-action="addExpense"><span class="feature-icon orange">${icon('arrowup')}</span><span><strong>记一笔支出</strong><span>日常消费随手记</span></span></button><button class="feature" data-action="addIncome"><span class="feature-icon">${icon('arrowdown')}</span><span><strong>记一笔收入</strong><span>收入来源好管理</span></span></button></div>
    <section class="section"><div class="section-head"><h2 class="section-title">收支趋势</h2><div class="chart-tabs"><button data-trend="支出" class="${state.trendType==='支出'?'active':''}">支出</button><button data-trend="收入" class="${state.trendType==='收入'?'active':''}">收入</button></div></div><div class="panel">${renderLineChart('7d',state.trendType,state.month)}<div class="small-caption" style="text-align:center;margin-top:5px">近 7 天${state.trendType}趋势（元）</div></div></section>
    <section class="section"><div class="section-head"><h2 class="section-title">支出构成</h2><button class="text-link" data-action="gotoStats">查看统计 ${icon('right')}</button></div><div class="panel">${renderDonut(groupCategories(rows,'支出'))}</div></section>
    <section class="section"><div class="section-head"><h2 class="section-title">最近记录</h2><button class="text-link" data-action="gotoRecords">查看全部 ${icon('right')}</button></div>${latest.length?`<div class="transaction-list">${latest.map(renderEntry).join('')}</div>`:empty('暂无记账记录','点击下方 + 开始记录第一笔')}</section>`;
  }
  const empty=(title,subtitle)=>`<div class="empty">${icon('wallet')}<strong>${escapeHTML(title)}</strong>${escapeHTML(subtitle)}<br><button class="small-button" data-action="addExpense">记一笔</button></div>`;
  function renderEntry(e){
    const cat=e.cat2||e.cat1||'未分类';const bg=e.type==='收入'?'#e9f6ef':'#f6f2ea';const fg=e.type==='收入'?'#4a9674':'#c48b59';
    return `<button class="transaction-item" data-edit="${escapeHTML(e.id)}"><span class="transaction-icon" style="background:${bg};color:${fg}">${icon(categoryIcon(e))}</span><span class="transaction-main"><span class="transaction-title">${escapeHTML(e.name)}</span><span class="transaction-meta">${escapeHTML(e.date||'')} ${escapeHTML(e.time||'')} · ${escapeHTML(cat)}</span></span><strong class="transaction-amount ${e.type==='收入'?'income':'expense'}">${e.type==='收入'?'+':'-'}${money(e.amount)}</strong></button>`;
  }
  function filterEntries(){const f=state.filters;return sorted(state.entries).filter(r=> (f.type==='全部'||r.type===f.type) && (!f.category||f.category==='全部'||(r.cat2||r.cat1||'未分类')===f.category) && (!f.from||r.date>=f.from) && (!f.to||r.date<=f.to) && (!f.search||[r.name,r.note,r.merchant,r.cat1,r.cat2,r.cat3].some(x=>String(x||'').toLowerCase().includes(f.search.toLowerCase()))));}
  function recordsSummary(){const entries=filterEntries(),out=total(entries,'支出'),inc=total(entries,'收入');const groups=new Map();for(const x of entries){if(!groups.has(x.date))groups.set(x.date,[]);groups.get(x.date).push(x)}return `<div class="summary-hint">共 ${entries.length} 笔 · 收入 ¥${money(inc)} · 支出 ¥${money(out)}</div>${entries.length?[...groups].map(([date,items])=>`<div class="group-day"><strong>${escapeHTML(date)} ${weekday(date)}</strong><span>支出 ¥${money(total(items,'支出'))}</span></div><div class="transaction-list">${items.map(renderEntry).join('')}</div>`).join(''):empty('没有符合条件的记录','调整筛选条件或新增一笔账单')}`;}
  function weekday(s){const [y,m,d]=s.split('-').map(Number);const t=new Date(y,m-1,d).getDay();return '周'+'日一二三四五六'[t]}
  function renderRecords(){
    const categoriesAll=[...new Set(state.entries.map(r=>r.cat2||r.cat1||'未分类'))].sort();const f=state.filters;
    return `${banner()}<div class="heading-line"><div><p class="eyebrow">每一笔，都有迹可循</p><h1 class="page-title">收支明细</h1></div>${period()}</div>
      <div class="search-bar">${icon('search')}<input id="entrySearch" placeholder="搜索项目、分类或备注" value="${escapeHTML(f.search)}" autocomplete="off" /></div>
      <div class="filter-scroll">${['全部','支出','收入'].map(t=>`<button class="chip ${f.type===t?'active':''}" data-filter-type="${t}">${t==='全部'?'全部流水':t}</button>`).join('')}</div>
      <div class="filter-row"><select class="filter-select" id="filterCategory"><option value="全部">全部分类</option>${categoriesAll.map(c=>`<option value="${escapeHTML(c)}" ${f.category===c?'selected':''}>${escapeHTML(c)}</option>`).join('')}</select><input class="filter-date" id="filterStart" type="date" aria-label="开始日期" value="${f.from}" /><span style="color:#b4bfb6;font-size:11px">至</span><input class="filter-date" id="filterEnd" type="date" aria-label="结束日期" value="${f.to}" /></div><div id="recordResults">${recordsSummary()}</div>`;
  }
  function renderDonut(items){const sum=items.reduce((x,y)=>x+y.value,0);if(!sum)return `<div class="chart-no-data">本期暂无分类数据</div>`;
    let pos=0;const stops=items.map(c=>{const a=pos;pos+=c.value/sum*360;return `${c.color} ${a.toFixed(3)}deg ${pos.toFixed(3)}deg`});
    return `<div class="donut-box"><div class="donut" role="img" aria-label="分类金额饼图" style="background:conic-gradient(${stops.join(',')})"><div class="donut-center"><span>总计</span><strong>¥${money(sum)}</strong></div></div><div class="legend">${items.slice(0,5).map(c=>`<div class="legend-row"><i class="legend-dot" style="background:${c.color}"></i><span class="legend-label">${escapeHTML(c.name)}</span><span class="legend-value">${(c.value/sum*100).toFixed(1)}%</span></div>`).join('')}${items.length>5?`<div class="small-caption">还有 ${items.length-5} 类，详见下方</div>`:''}</div></div>`;
  }
  function lineData(range,type,month){const end=(month===monthKey(localToday()))?localToday():monthEnd(month);let labels=[];
    if(range==='6m') {const [y,m]=month.split('-').map(Number);for(let i=5;i>=0;i--){const d=new Date(y,m-1-i,1);labels.push({key:dateAt(d.getFullYear(),d.getMonth()+1,1).slice(0,7),label:`${d.getMonth()+1}月`})}}
    else {const days=range==='7d'?7:30;for(let i=days-1;i>=0;i--){const d=shiftDate(end,-i);labels.push({key:d,label:d.slice(5).replace('-','/')})}}
    const data=labels.map(l=>({label:l.label,value:state.entries.reduce((s,r)=>s+(r.type===type&&(range==='6m'?monthKey(r.date)===l.key:r.date===l.key)?Number(r.amount)||0:0),0)}));return data;}
  function renderLineChart(range,type,month){const data=lineData(range,type,month);const W=400,H=165,left=16,right=18,top=16,bottom=32,cw=W-left-right,ch=H-top-bottom;
    const max=Math.max(20,...data.map(d=>d.value));const ceil=Math.ceil(max/(max>1000?500:max>100?50:10))*(max>1000?500:max>100?50:10);const sx=i=>left+(data.length===1?cw/2:(i/(data.length-1))*cw),sy=v=>top+ch*(1-v/ceil);
    const pts=data.map((d,i)=>[sx(i),sy(d.value)]);const line=pts.map((p,i)=>`${i===0?'M':'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');const area=`${line} L${sx(data.length-1)},${top+ch} L${sx(0)},${top+ch} Z`;
    const show=range==='30d'?new Set([0,7,14,21,29]):new Set(data.map((_,i)=>i)); const color=type==='收入'?'#3d9e82':'#e3a178';
    return `<div class="line-chart-wrap"><svg class="line-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${escapeHTML(type)}${escapeHTML(range)}趋势图">${[0,1,2,3].map(i=>`<line class="chart-grid-line" x1="${left}" x2="${W-right}" y1="${top+i*ch/3}" y2="${top+i*ch/3}"/>`).join('')}<path d="${area}" fill="${color}" opacity=".09"/><path d="${line}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${pts.map((p,i)=>data[i].value?`<circle cx="${p[0]}" cy="${p[1]}" r="2.6" fill="#fff" stroke="${color}" stroke-width="1.6"/>`:'').join('')}${data.map((d,i)=>show.has(i)?`<text x="${sx(i)}" y="${H-7}" text-anchor="middle" class="chart-label">${escapeHTML(d.label)}</text>`:'').join('')}</svg></div>`;
  }
  function renderStats(){const rows=ofMonth(state.month);const type=state.statType;const cats=groupCategories(rows,type),sum=total(rows,type);
    return `${banner()}<div class="heading-line"><div><p class="eyebrow">让数字讲述生活</p><h1 class="page-title">数据统计</h1></div>${period()}</div>
      <div class="stats-switch"><button data-stats-type="支出" class="${type==='支出'?'active':''}">支出分析</button><button data-stats-type="收入" class="${type==='收入'?'active':''}">收入分析</button></div>
      <section class="section"><div class="section-head"><h2 class="section-title">${type}分类占比</h2><span class="small-caption">${rows.filter(r=>r.type===type).length} 笔记录</span></div><div class="panel"><div class="small-caption">本月${type}总额</div><div class="stat-total">¥ ${money(sum)}</div>${renderDonut(cats)}</div></section>
      <section class="section"><div class="section-head"><h2 class="section-title">${type}变化趋势</h2><div class="mini-tabs">${[['7d','7天'],['30d','30天'],['6m','6个月']].map(([value,label])=>`<button class="${state.trendRange===value?'active':''}" data-range="${value}">${label}</button>`).join('')}</div></div><div class="panel">${renderLineChart(state.trendRange,type,state.month)}<div class="small-caption" style="text-align:center;margin-top:7px">${state.trendRange==='6m'?'近 6 个月':'近 '+(state.trendRange==='7d'?'7':'30')+' 天'}${type}趋势（元）</div></div></section>
      <section class="section"><div class="section-head"><h2 class="section-title">分类明细</h2><span class="small-caption">按金额从高到低</span></div><div class="panel"><div class="category-bars">${cats.length?cats.map(c=>`<div><div class="bar-head"><span>${escapeHTML(c.name)}</span><strong>¥ ${money(c.value)} <span class="small-caption">· ${(c.value/sum*100).toFixed(1)}%</span></strong></div><div class="bar-track"><div class="bar-fill" style="width:${(c.value/sum*100).toFixed(2)}%;background:${c.color}"></div></div></div>`).join(''):'<div class="section-empty">本期暂无可统计的记录</div>'}</div></div></section>`;
  }
  function renderSettings(){const cloud=state.mode==='cloud',auth=!!sessionStorage.getItem(PASS_KEY);
    return `<div class="page-intro"><p class="eyebrow">数据与偏好设置</p><h1 class="page-title">我的账本</h1><p class="page-subtitle">记录生活，安心管理自己的每一笔收支</p></div>
      <div class="settings-card"><h2 class="settings-title">${icon('cloud')} 云端同步 · Notion</h2><p class="settings-desc">GitHub Pages 只负责展示网站。使用独立的安全接口连接 Notion 后，手机和电脑可以查看同一份账本；ChatGPT 写入 Notion 的账单也能同步到这里。</p><div class="status-line"><i class="status-dot ${cloud&&auth?'on':''}"></i>${cloud?(auth?'已连接云端账本':'云端模式 · 需重新解锁'):'当前使用本机存储'}</div>
      <form id="cloudForm" class="connect-form"><label>安全同步接口地址<input id="cloudUrl" type="url" placeholder="https://xxxx.workers.dev" value="${escapeHTML(state.apiUrl)}" autocomplete="url" required /></label><label>访问密码（仅保存至当前标签页会话）<input id="cloudPass" type="password" placeholder="填写你在 Worker 设置的访问密码" autocomplete="off" required /></label><button class="primary-button" type="submit">${cloud?'重新连接 / 解锁':'连接 Notion 云端账本'}</button></form>
      <div class="cloud-warning">请勿在此填写 Notion API Token。Token 只能保存在云端 Worker 的 Secret 中。</div>
      ${cloud?`<div style="display:flex;gap:9px;margin-top:14px"><button class="outline-button" data-action="refreshCloud">${icon('refresh')} 刷新同步</button><button class="outline-button danger" data-action="disconnectCloud">切回本机</button></div>`:''}</div>
      <div class="settings-card"><h2 class="settings-title">${icon('download')} 数据管理</h2><p class="settings-desc">支持 CSV 和 JSON 备份。切换设备时，未连接云端的本机数据不会自动同步。</p><div class="settings-row"><span>当前记录</span><strong>${state.entries.length} 笔 ${state.demo?'<span class="pill">演示</span>':''}</strong></div><div class="settings-row"><span>导出 CSV</span><button class="outline-button" data-action="exportCsv">导出</button></div><div class="settings-row"><span>导出 JSON 备份</span><button class="outline-button" data-action="exportJson">导出</button></div>${!cloud?`<div class="settings-row"><span>导入 JSON / CSV</span><button class="outline-button" data-action="importFile">导入</button></div><div class="settings-row"><span>${state.demo?'清空演示数据':'清空本机账本'}</span><button class="outline-button danger" data-action="clearLocal">清空</button></div>`:''}</div>
      <div class="settings-card"><h2 class="settings-title">${icon('shield')} 隐私说明</h2><p class="settings-desc" style="margin:0">本机模式仅保存在当前浏览器的 localStorage 中；清除浏览器数据会导致丢失。云端模式由 Notion 保存原始记录，网站不持久保存云端密码。请定期导出备份。</p></div>
      <div style="text-align:center;color:#a5b2aa;font-size:11px;padding:13px">我的记账本儿 · v1.0</div>`;
  }
  function setTab(tab){state.tab=tab;render();window.scrollTo({top:0,behavior:'instant'})}
  function notify(str){const el=byId('toast');el.textContent=str;el.classList.remove('hidden');clearTimeout(notify.timeout);notify.timeout=setTimeout(()=>el.classList.add('hidden'),2600)}
  function presetOptions(type,selected){const all=categories[type]||categories['支出'];return all.map((c,i)=>`<option value="${i}" ${selected===c.slice(0,3).join('|')?'selected':''}>${escapeHTML(c[1])} · ${escapeHTML(c[2])}</option>`).join('')+`<option value="custom" ${selected==='custom'?'selected':''}>自定义三级分类…</option>`}
  let formType='支出';
  function openSheet(entry=null,preType='支出'){
    formType=entry?.type||preType;byId('entryForm').reset();byId('entryId').value=entry?.id||'';byId('sheetTitle').textContent=entry?'编辑记录':'记一笔';byId('saveEntry').textContent=entry?'保存修改':'保存这笔账';
    byId('deleteEntry').classList.toggle('hidden',!entry);
    byId('entryAmount').value=entry?.amount??'';byId('entryName').value=entry?.name||'';byId('entryDate').value=entry?.date||localToday();byId('entryTime').value=entry?.time||localTime();
    byId('entryMerchant').value=entry?.merchant||'';byId('entryNote').value=entry?.note||'';
    byId('entryTypeGroup').querySelectorAll('button').forEach(b=>b.classList.toggle('selected',b.dataset.type===formType));
    const found=entry?categories[formType].find(x=>x.slice(0,3).join('|')===[entry.cat1,entry.cat2,entry.cat3].join('|')):categories[formType][0];
    byId('entryPreset').innerHTML=presetOptions(formType,entry&&!found?'custom':found?.slice(0,3).join('|'));
    if(found){byId('entryPreset').value=String(categories[formType].indexOf(found))}else if(entry){byId('entryPreset').value='custom'}
    byId('entryCat1').value=entry?.cat1||'';byId('entryCat2').value=entry?.cat2||'';byId('entryCat3').value=entry?.cat3||'';
    byId('customClassification').classList.toggle('hidden',byId('entryPreset').value!=='custom');
    byId('modalBackdrop').classList.remove('hidden');document.body.style.overflow='hidden';setTimeout(()=>byId('entryAmount').focus({preventScroll:true}),80);
  }
  function closeSheet(){byId('modalBackdrop').classList.add('hidden');document.body.style.overflow=''}
  async function requestCloud(path,options={}){
    const pass=sessionStorage.getItem(PASS_KEY);if(!pass)throw Error('请先在「我的」页面填写云端密码并连接');
    const url=state.apiUrl.replace(/\/+$/,'')+path;
    const response=await fetch(url,{...options,headers:{'Content-Type':'application/json','X-Book-Password':pass,...(options.headers||{})},cache:'no-store'});
    let json={};try{json=await response.json()}catch{}if(!response.ok)throw Error(json.error||`请求失败 (${response.status})`);return json;
  }
  async function fetchCloud(){const result=await requestCloud('/entries');if(!Array.isArray(result.entries))throw Error('云端返回数据格式不正确');state.entries=result.entries.map(normalize).filter(Boolean);state.demo=false;render();notify('Notion 同步成功，共 '+state.entries.length+' 笔')}
  async function runBusy(fn){if(state.busy)return;state.busy=true;document.body.classList.add('loading');try{await fn()}catch(err){console.error(err);notify(err.message||'操作失败，请重试')}finally{state.busy=false;document.body.classList.remove('loading')}}
  async function saveRecord(ev){ev.preventDefault();const amount=Number(byId('entryAmount').value),name=byId('entryName').value.trim(),date=byId('entryDate').value;
    if(!Number.isFinite(amount)||amount<=0||amount>100000000){notify('请输入有效金额（0 至 1 亿元）');return}if(!name||!date){notify('请填写项目名称和日期');return}
    const preset=byId('entryPreset').value;const cat=preset==='custom'?[byId('entryCat1').value.trim(),byId('entryCat2').value.trim(),byId('entryCat3').value.trim()]:(categories[formType][Number(preset)]||['未分类','其他','其他']);
    const existing=byId('entryId').value;const item={id:existing||('local-'+(crypto.randomUUID?crypto.randomUUID():Date.now().toString(36))),name,amount:Math.round(amount*100)/100,type:formType,date,time:byId('entryTime').value,cat1:cat[0],cat2:cat[1],cat3:cat[2],merchant:byId('entryMerchant').value.trim(),note:byId('entryNote').value.trim(),demo:false};
    await runBusy(async()=>{if(state.mode==='cloud'){
      if(existing){const saved=await requestCloud('/entries/'+encodeURIComponent(existing),{method:'PATCH',body:JSON.stringify(item)});state.entries=state.entries.map(r=>r.id===existing?normalize(saved.entry):r)}
      else {const saved=await requestCloud('/entries',{method:'POST',body:JSON.stringify(item)});state.entries.unshift(normalize(saved.entry))}
    }else {if(state.demo){state.entries=[];state.demo=false;if(existing)state.entries.push(item)}if(existing){if(!state.entries.some(r=>r.id===existing))state.entries.push(item);else state.entries=state.entries.map(r=>r.id===existing?item:r)}else{state.entries.unshift(item)}localSave()}
    closeSheet();render();notify(existing?'修改已保存':'记账成功')});
  }
  function normalize(raw){if(!raw||typeof raw!=='object')return null;const amount=Number(raw.amount);return {id:String(raw.id||''),name:String(raw.name||''),amount:Number.isFinite(amount)?amount:0,type:raw.type==='收入'?'收入':'支出',date:String(raw.date||localToday()),time:String(raw.time||''),cat1:String(raw.cat1||''),cat2:String(raw.cat2||''),cat3:String(raw.cat3||''),merchant:String(raw.merchant||''),note:String(raw.note||''),demo:!!raw.demo}}
  async function deleteRecord(){const id=byId('entryId').value;if(!id||!confirm('确定删除这笔账单吗？此操作无法撤销。'))return;
    await runBusy(async()=>{if(state.mode==='cloud'){await requestCloud('/entries/'+encodeURIComponent(id),{method:'DELETE'})}state.entries=state.entries.filter(e=>e.id!==id);if(state.mode==='local')localSave();closeSheet();render();notify('账单已删除')});
  }
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
    await runBusy(async()=>{try {const response=await requestCloud('/entries');if(!Array.isArray(response.entries))throw Error('云端返回数据错误');state.mode='cloud';state.entries=response.entries.map(normalize).filter(Boolean);state.demo=false;localStorage.setItem(MODE_KEY,'cloud');localStorage.setItem(URL_KEY,u);render();notify('连接成功，已同步 '+state.entries.length+' 笔')}catch(err){state.apiUrl=oldUrl;oldPass?sessionStorage.setItem(PASS_KEY,oldPass):sessionStorage.removeItem(PASS_KEY);throw err}});
  }
  function disconnectCloud(){if(!confirm('切回本机模式？Notion 云端账单不会被删除。'))return;state.mode='local';sessionStorage.removeItem(PASS_KEY);localStorage.setItem(MODE_KEY,'local');const local=getStore();state.entries=local?.entries||[];state.demo=local?.demo??false;render();notify('已切回本机模式')}
  document.addEventListener('click',event=>{
    const a=event.target.closest('[data-action]');if(a){const action=a.dataset.action;
      if(action==='addExpense')return openSheet(null,'支出');if(action==='addIncome')return openSheet(null,'收入');if(action==='gotoRecords')return setTab('records');if(action==='gotoStats')return setTab('stats');if(action==='clearDemo')return clearLocal();
      if(action==='exportCsv')return exportCsv();if(action==='exportJson')return exportJson();if(action==='importFile')return byId('importFile').click();if(action==='clearLocal')return clearLocal();if(action==='disconnectCloud')return disconnectCloud();if(action==='refreshCloud')return runBusy(fetchCloud);
    }
    const edit=event.target.closest('[data-edit]');if(edit)return openSheet(state.entries.find(x=>x.id===edit.dataset.edit));
    const nav=event.target.closest('[data-tab]');if(nav)return setTab(nav.dataset.tab);
    const trend=event.target.closest('[data-trend]');if(trend){state.trendType=trend.dataset.trend;return render()}
    const stats=event.target.closest('[data-stats-type]');if(stats){state.statType=stats.dataset.statsType;return render()}
    const range=event.target.closest('[data-range]');if(range){state.trendRange=range.dataset.range;return render()}
    const filter=event.target.closest('[data-filter-type]');if(filter){state.filters.type=filter.dataset.filterType;return render()}
    const typ=event.target.closest('#entryTypeGroup button');if(typ){formType=typ.dataset.type;byId('entryTypeGroup').querySelectorAll('button').forEach(x=>x.classList.toggle('selected',x===typ));byId('entryPreset').innerHTML=presetOptions(formType);byId('entryPreset').value='0';byId('customClassification').classList.add('hidden')}
  });
  byId('topAction').addEventListener('click',()=>setTab('settings'));
  byId('addFab').addEventListener('click',()=>openSheet());byId('closeSheet').innerHTML=icon('close');byId('closeSheet').addEventListener('click',closeSheet);
  byId('modalBackdrop').addEventListener('click',e=>{if(e.target===byId('modalBackdrop'))closeSheet()});
  window.addEventListener('keydown',e=>{if(e.key==='Escape')closeSheet()});
  byId('entryPreset').addEventListener('change',()=>byId('customClassification').classList.toggle('hidden',byId('entryPreset').value!=='custom'));
  byId('entryForm').addEventListener('submit',saveRecord);byId('deleteEntry').addEventListener('click',deleteRecord);
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