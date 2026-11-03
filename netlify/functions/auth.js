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
 return L.json(404,{ok:false});
};
