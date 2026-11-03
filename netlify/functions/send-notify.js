const L=require('./_lib');
exports.handler=async e=>{
 if(e.httpMethod!=='POST')return L.json(405,{ok:false});
 if(!await L.isAdmin(e))return L.json(403,{ok:false,msg:'غير مصرح'});
 if(!process.env.RESEND_API_KEY||!process.env.FROM_EMAIL)return L.json(500,{ok:false,msg:'خدمة البريد غير مفعّلة بعد (RESEND_API_KEY و FROM_EMAIL)'});
 const s=L.sb();let id;try{id=JSON.parse(e.body).id}catch{}
 const{data:n}=await s.from('notifications').select('*').eq('id',id).single();
 if(!n)return L.json(404,{ok:false,msg:'الإشعار غير موجود'});
 const{data:subs}=await s.from('subscribers').select('email');
 if(!subs||!subs.length)return L.json(400,{ok:false,msg:'لا يوجد أولياء مشتركون بعد'});
 const t=n.title.replace(/[<>&"]/g,'');let fail=0;
 for(const b of subs){
  try{const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json'},
   body:JSON.stringify({from:process.env.FROM_EMAIL,to:[b.email],subject:'براعم المعرفة: '+t,html:`<div dir="rtl" style="font-family:sans-serif"><h2>${t}</h2><p><a href="${process.env.URL||''}">افتحوا الموقع للاطلاع</a></p></div>`})});
   if(!r.ok)fail++}catch{fail++}}
 const st=fail===0?'أُرسل':fail===subs.length?'فشل الإرسال':`أُرسل جزئيًا (فشل ${fail})`;
 await s.from('notifications').update({email_status:st}).eq('id',id);
 return L.json(fail===subs.length?500:200,{ok:fail<subs.length,msg:fail===0?`تم إرسال البريد إلى ${subs.length} ولي ✅`:st});
};
