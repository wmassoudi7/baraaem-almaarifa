const L=require('./_lib');
exports.handler=async()=>L.json(200,{url:process.env.SUPABASE_URL,key:process.env.SUPABASE_ANON_KEY});
