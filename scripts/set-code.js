// الاستعمال: SUPABASE_URL=... SUPABASE_SERVICE_KEY=... node scripts/set-code.js "رمزك"
const L=require('../netlify/functions/_lib');
const code=(process.argv[2]||'').trim();
if(code.length<6){console.error('الرمز لا يقل عن 6 أحرف');process.exit(1)}
L.sb().from('settings').upsert({key:'parent_code',value:L.hash(code),updated_at:new Date()})
 .then(({error})=>{console.log(error?error.message:'تم ضبط الرمز الموحد');process.exit(error?1:0)});
