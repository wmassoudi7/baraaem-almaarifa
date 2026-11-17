-- براعم المعرفة: تنظيف نهائي للأقسام المحذوفة
-- تنبيه: هذا يحذف البيانات نهائيًا ولا يمكن التراجع عنه.
-- شغّليه مرة واحدة في Supabase > SQL Editor.

-- 1) حذف الألعاب السابقة التي أضفتِها من اللوحة
delete from games;

-- 2) حذف إشعارات الواجبات القديمة
delete from notifications where ref_type = 'homework';

-- 3) حذف جداول العمل المنزلي والتمارين والدروس (الترتيب مهم)
drop table if exists homework cascade;
drop table if exists exercises cascade;
drop table if exists lessons cascade;
