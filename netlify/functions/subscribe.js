const L=require('./_lib');
exports.handler=async e=>{
 if(e.httpMethod!=='POST'||!await L.parentOk(e))return L.json(401,{ok:false,msg:'غير مصرح'});
 let b={};try{b=JSON.parse(e.body)}catch{}
 const email=String(b.email||'').trim().toLowerCase();
 if(!/^\S+@\S+\.\S+$/.test(email)||email.length>200)return L.json(400,{ok:false,msg:'بريد غير صحيح'});
 const s=L.sb();
 const{error}=b.on?await s.from('subscribers').upsert({email}):await s.from('subscribers').delete().eq('email',email);
 return error?L.json(500,{ok:false,msg:'تعذر الحفظ'}):L.json(200,{ok:true,msg:b.on?'تم الاشتراك بنجاح ✅':'تم إلغاء الاشتراك'});
};
