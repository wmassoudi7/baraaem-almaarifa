// تغيير الرمز من لوحة المعلمة (يتطلب جلسة Supabase للمعلمة)
const L=require('./_lib');
exports.handler=async e=>{
 if(e.httpMethod!=='POST') return L.json(405,{ok:false});
 const tk=(e.headers.authorization||'').replace('Bearer ','');
 const s=L.sb(); const{data:u}=await s.auth.getUser(tk);
 if(!u||!u.user) return L.json(401,{ok:false,msg:'غير مصرح'});
 const{data:ad}=await s.from('admin_users').select('id').eq('id',u.user.id).maybeSingle();
 if(!ad) return L.json(403,{ok:false,msg:'هذا الحساب ليس حساب المعلمة'});
 const code=String(JSON.parse(e.body).code||'').trim();
 if(code.length<6) return L.json(400,{ok:false,msg:'الرمز قصير (6 أحرف على الأقل)'});
 const{error}=await s.from('settings').upsert({key:'parent_code',value:L.hash(code),updated_at:new Date()});
 return error?L.json(500,{ok:false,msg:'تعذر الحفظ'}):L.json(200,{ok:true,msg:'تم تغيير الرمز بنجاح'});
};
