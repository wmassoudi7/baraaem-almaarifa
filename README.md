# براعم المعرفة — دليل التشغيل والنشر
1. **Supabase** (مجاني): أنشئ مشروعًا ← SQL Editor ← الصق supabase/schema.sql ← Run.
2. **حساب المعلمة**: Authentication ← Users ← Add user (بريدك + كلمة مرور قوية، Auto confirm). ثم في SQL Editor:
   insert into admin_users(id,name) select id,'وئام مسعودي' from auth.users where email='بريدك';
3. **المفاتيح**: Project Settings ← API ← انسخ Project URL و anon key و service_role key.
4. **GitHub**: ارفع محتوى المجلد (فك الضغط أولًا). **Netlify**: Add new site ← Import from Git.
5. في Netlify ← Site configuration ← Environment variables أضف:
   SUPABASE_URL ، SUPABASE_ANON_KEY ، SUPABASE_SERVICE_KEY (سري) ، SESSION_SECRET (نص عشوائي طويل)
   وللبريد (اختياري): RESEND_API_KEY ، FROM_EMAIL (من حساب Resend بعد توثيق نطاق). ثم Deploys ← Trigger deploy.
6. **رمز الأولياء والتلاميذ**: من حاسوبك داخل المجلد:
   npm i
   SUPABASE_URL=... SUPABASE_SERVICE_KEY=... node scripts/set-code.js "cp2627"
   (يُفضّل رمز أطول؛ ويُغيَّر لاحقًا من لوحة المعلمة ← 🔑 رمز الدخول.)
7. **لوحة المعلمة**: /admin.html ← أول درس (📚) ← أول واجب (📝: العنوان، المادة، الوصف، صورة/PDF).
8. **ألعابك**: ضعي ملفات HTML في مجلد games/ ثم أضيفيها من 🎮 الألعاب برابط games/اسم.html (أو رابط https). **فيديوهاتك**: 🎬 الفيديوهات برابط يوتيوب (غير مدرج).
9. **الإشعارات**: تظهر في قسم 🔔 تلقائيًا عند نشر واجب أو إعلان مهم. البريد: الأولياء يشتركون بموافقتهم من «فضاء الأولياء»، وأنتِ ترسلين من 🔔 الإشعارات ← «إرسال بريد» (تُسجَّل «أُرسل» فقط بعد نجاح الإرسال).
## ملاحظة
sw.js هو أساس إشعارات المتصفح فقط؛ تفعيلها الكامل يحتاج مفاتيح VAPID وخادم Push لاحقًا.
