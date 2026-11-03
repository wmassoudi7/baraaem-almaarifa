const L=require('./_lib');
exports.handler=async e=>{
 const a=(e.queryStringParameters||{}).a;
 if(a==='me') return L.json(200,{ok:await L.parentOk(e)});
 if(a==='logout') return L.json(200,{ok:true},{'Set-Cookie':'bm_session=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict'});
 if(a==='login'&&e.httpMethod==='POST'){
  let code=''; try{code=String(JSON.parse(e.body).code||'').trim()}catch{}
  if(!code) return L.json(400,{ok:false,msg:'من فضلك اكتب الرمز'});
  const{data}=await L.sb().from('settings').select('value').eq('key','parent_code').single();
  if(!data) return L.json(500,{ok:false,msg:'لم يُضبط الرمز بعد'});
  if(!L.verify(code,data.value)){await new Promise(r=>setTimeout(r,800));return L.json(401,{ok:false,msg:'الرمز غير صحيح، حاول مرة أخرى'})}
  const t=L.sign({v:data.value.split(':')[0],exp:Date.now()+7*864e5});
  return L.json(200,{ok:true},{'Set-Cookie':`bm_session=${t}; Path=/; Max-Age=604800; HttpOnly; Secure; SameSite=Strict`});
 }
 if(a==='form'&&e.httpMethod==='POST'){
  const raw=e.isBase64Encoded?Buffer.from(e.body||'','base64').toString():(e.body||'');
  const code=(new URLSearchParams(raw).get('code')||'').trim();
  const page=m=>({statusCode:401,headers:{'Content-Type':'text/html; charset=utf-8'},body:`<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><body dir="rtl" style="font-family:sans-serif;text-align:center;padding:40px;background:#fffaf0"><h2>${m}</h2><p><a href="/index.html" style="font-size:1.3rem">⬅ رجوع</a></p></body>`});
  if(!code)return page('من فضلك اكتب الرمز');
  const{data}=await L.sb().from('settings').select('value').eq('key','parent_code').single();
  if(!data)return page('لم يُضبط الرمز بعد');
  if(!L.verify(code,data.value)){await new Promise(r=>setTimeout(r,800));return page('الرمز غير صحيح، حاول مرة أخرى')}
  const t=L.sign({v:data.value.split(':')[0],exp:Date.now()+7*864e5});
  return{statusCode:302,headers:{Location:'/home.html','Set-Cookie':`bm_session=${t}; Path=/; Max-Age=604800; HttpOnly; Secure; SameSite=Strict`},body:''};
 }
 return L.json(404,{ok:false});
};
