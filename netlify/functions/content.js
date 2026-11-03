const L=require('./_lib');
const OK=['videos','homework','lessons','exercises','games','announcements','notifications'];
exports.handler=async e=>{
 if(!await L.parentOk(e))return L.json(401,{ok:false});
 const t=(e.queryStringParameters||{}).t;if(!OK.includes(t))return L.json(400,{ok:false});
 const s=L.sb();const{data,error}=await s.from(t).select('*').order('created_at',{ascending:false}).limit(300);
 if(error)return L.json(500,{ok:false});
 for(const r of data)for(const k of['image_url','pdf_url','file_url'])if(r[k]&&!/^http/.test(r[k])){const{data:u}=await s.storage.from('files').createSignedUrl(r[k],3600);r[k]=u?u.signedUrl:null}
 return L.json(200,{ok:true,data});
};
