/**
 * 我的记账本儿 - Notion API proxy for Cloudflare Workers.
 * Never publish NOTION_TOKEN or USER_PASSWORD in GitHub Pages or wrangler.toml.
 * Required Workers secrets: NOTION_TOKEN, USER_PASSWORD.
 * Required public vars: NOTION_DATA_SOURCE_ID, ALLOWED_ORIGIN.
 */
const NOTION_BASE = 'https://api.notion.com/v1';
const NOTION_VERSION = '2025-09-03';
const MAX_ROWS = 5000;
const MAX_BODY = 10000;

function cors(origin, env) {
  const allowed = (env.ALLOWED_ORIGIN || '').trim().replace(/\/$/, '');
  return {
    ...(origin && origin === allowed ? {'Access-Control-Allow-Origin':origin} : {}),
    'Access-Control-Allow-Headers':'Content-Type, X-Book-Password',
    'Access-Control-Allow-Methods':'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Max-Age':'600',
    'Vary':'Origin',
    'Cache-Control':'no-store'
  };
}
function json(data,status,headers) {return new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8',...headers}})}
const textProp = name => ({rich_text:[{type:'text',text:{content:String(name||'')}}]});
const titleProp = name => ({title:[{type:'text',text:{content:String(name||'')}}]});
const getRich = prop => (prop?.rich_text || prop?.title || []).map(x=>x.plain_text || x.text?.content || '').join('');
const getSel = prop => prop?.select?.name || '';
function fromNotion(page) {
  const p = page.properties || {};
  return {
    id:page.id,
    name:getRich(p['消费项目']),
    amount:p['金额(元)']?.number || 0,
    type:getSel(p['收支类型'])==='收入'?'收入':'支出',
    date:(p['日期']?.date?.start || '').slice(0,10),
    time:getRich(p['时间']),
    cat1:getRich(p['一级分类']),
    cat2:getRich(p['二级分类']),
    cat3:getRich(p['三级分类']),
    merchant:getRich(p['商家']),
    note:getRich(p['备注'])
  };
}
function normalize(item) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) throw new Error('账单格式错误');
  const name=String(item.name || '').trim();
  const amount=Number(item.amount);
  const type=item.type;
  const date=String(item.date || '');
  if(!name || name.length>100) throw new Error('项目名称不能为空且不超过100字');
  if(!Number.isFinite(amount) || amount <= 0 || amount > 100000000) throw new Error('金额必须大于0且不超过1亿元');
  if(type!=='收入'&&type!=='支出') throw new Error('收支类型错误');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)) || new Date(`${date}T12:00:00Z`).toISOString().slice(0,10)!==date) throw new Error('日期格式错误');
  const safe = field => String(item[field] || '').slice(0,500).trim();
  const time=safe('time');
  if(time&&!/^\d{2}:\d{2}$/.test(time)) throw new Error('时间格式错误');
  return {name,amount:Math.round(amount*100)/100,type,date,time,cat1:safe('cat1'),cat2:safe('cat2'),cat3:safe('cat3'),merchant:safe('merchant'),note:safe('note')};
}
function notionProps(item) {
  return {
    '消费项目':titleProp(item.name),
    '金额(元)':{number:item.amount},
    '收支类型':{select:{name:item.type}},
    '日期':{date:{start:item.date}},
    '时间':textProp(item.time),
    '一级分类':textProp(item.cat1),
    '二级分类':textProp(item.cat2),
    '三级分类':textProp(item.cat3),
    '商家':textProp(item.merchant),
    '备注':textProp(item.note),
    '记录来源':{select:{name:'文字'}},
    '使用场景':{select:{name:'日常'}}
  };
}
async function digest(s) {return new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))}
async function verifyPassword(received,expected) {
  if(!received||!expected)return false;
  const [a,b]=await Promise.all([digest(received),digest(expected)]);
  let mismatch=0;for(let i=0;i<a.length;i++) mismatch |= (a[i]^b[i]);return mismatch===0;
}
async function notion(path,env,method='GET',body=null) {
  const result=await fetch(NOTION_BASE+path,{
    method,
    headers:{Authorization:`Bearer ${env.NOTION_TOKEN}`,'Notion-Version':NOTION_VERSION,'Content-Type':'application/json'},
    ...(body?{body:JSON.stringify(body)}:{})
  });
  const data=await result.json().catch(()=>({}));
  if(!result.ok){console.error('Notion request failed',result.status,data.code);throw new Error(`Notion 接口错误 ${result.status}（请检查数据库授权、字段和 Token）`)}
  return data;
}
async function readAll(env) {
  let cursor, results=[];
  for(let i=0;i<50;i++) {
    const req={page_size:100,sorts:[{property:'日期',direction:'descending'}]};
    if(cursor) req.start_cursor=cursor;
    const page=await notion(`/data_sources/${env.NOTION_DATA_SOURCE_ID}/query`,env,'POST',req);
    results.push(...(page.results||[]).filter(p=>p.object==='page'&&!p.archived&&!p.in_trash).map(fromNotion));
    if(!page.has_more||!page.next_cursor)break;
    cursor=page.next_cursor;
  }
  if(results.length>=MAX_ROWS)throw new Error('账本超过5000笔，当前版本请先分批归档');
  return results;
}
export default {
  async fetch(request,env) {
    const origin=request.headers.get('Origin')||'';
    const headers=cors(origin,env);
    if(origin && origin!==(env.ALLOWED_ORIGIN||'').trim().replace(/\/$/,''))return json({error:'该网站来源未授权'},403,headers);
    if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
    if(!env.NOTION_TOKEN||!env.USER_PASSWORD||!env.NOTION_DATA_SOURCE_ID)return json({error:'云端服务尚未完成配置'},503,headers);
    if(!(await verifyPassword(request.headers.get('X-Book-Password'),env.USER_PASSWORD)))return json({error:'访问密码错误'},401,headers);
    try {
      const url=new URL(request.url);
      const path=url.pathname.replace(/\/+$/,'')||'/';
      if(path==='/health'&&request.method==='GET')return json({ok:true},200,headers);
      if(path==='/entries') {
        if(request.method==='GET')return json({entries:await readAll(env)},200,headers);
        if(request.method==='POST') {
          if(Number(request.headers.get('content-length'))>MAX_BODY)return json({error:'请求体过大'},413,headers);
          const item=normalize(await request.json());
          const page=await notion('/pages',env,'POST',{parent:{type:'data_source_id',data_source_id:env.NOTION_DATA_SOURCE_ID},properties:notionProps(item)});
          return json({entry:fromNotion(page)},201,headers);
        }
      }
      const match=path.match(/^\/entries\/([0-9a-fA-F-]{36})$/);
      if(match&&(request.method==='PATCH'||request.method==='DELETE')) {
        const id=match[1];
        // Never let this Worker mutate a page from any other Notion data source.
        const current=await notion(`/pages/${id}`,env);
        if(current.parent?.data_source_id!==env.NOTION_DATA_SOURCE_ID)return json({error:'记录不属于本账本'},403,headers);
        if(request.method==='DELETE'){await notion(`/pages/${id}`,env,'PATCH',{archived:true});return json({deleted:true},200,headers)}
        if(Number(request.headers.get('content-length'))>MAX_BODY)return json({error:'请求体过大'},413,headers);
        const item=normalize(await request.json());
        const updated=await notion(`/pages/${id}`,env,'PATCH',{properties:notionProps(item)});
        return json({entry:fromNotion(updated)},200,headers);
      }
      return json({error:'接口不存在'},404,headers);
    }catch(err){
      if(err instanceof SyntaxError)return json({error:'请求 JSON 格式错误'},400,headers);
      if(/^(账单|项目|金额|收支|日期|时间)/.test(err.message))return json({error:err.message},400,headers);
      console.error('Worker failure',err.message);
      return json({error:err.message||'云端请求失败'},502,headers);
    }
  }
};