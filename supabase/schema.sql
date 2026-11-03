-- براعم المعرفة: شغّله في Supabase > SQL Editor
create table if not exists settings(key text primary key, value text not null, updated_at timestamptz default now());
create table if not exists admin_users(id uuid primary key references auth.users(id) on delete cascade, name text);
create table if not exists lessons(id bigserial primary key, title text not null, subject text not null, axis text, body text, image_url text, pdf_url text, video_url text, created_at timestamptz default now());
create table if not exists homework(id bigserial primary key, title text not null, subject text not null, description text, file_url text, lesson_id bigint references lessons(id) on delete set null, status text default 'جديد', created_at timestamptz default now());
create table if not exists exercises(id bigserial primary key, lesson_id bigint references lessons(id) on delete cascade, type text not null check(type in('mcq','tf','fill','order','match')), question text not null, data jsonb not null, created_at timestamptz default now());
create table if not exists games(id bigserial primary key, title text not null, kind text not null, config jsonb, url text, created_at timestamptz default now());
create table if not exists announcements(id bigserial primary key, title text not null, body text not null, category text, image_url text, important boolean default false, created_at timestamptz default now());
create table if not exists notifications(id bigserial primary key, title text not null, ref_type text, ref_id bigint, email_status text default 'لم يرسل', created_at timestamptz default now());
create index if not exists i_hw on homework(created_at desc, subject);
create index if not exists i_ls on lessons(subject, axis);
create index if not exists i_ex on exercises(lesson_id);
create index if not exists i_an on announcements(created_at desc);

create or replace function is_admin() returns boolean language sql security definer stable as $$ select exists(select 1 from admin_users where id=auth.uid()) $$;

do $$ declare t text; begin
 foreach t in array array['settings','admin_users','lessons','homework','exercises','games','announcements','notifications'] loop
  execute format('alter table %I enable row level security',t);
  execute format('drop policy if exists admin_all on %I',t);
  execute format('create policy admin_all on %I for all to authenticated using(is_admin()) with check(is_admin())',t);
 end loop; end $$;
-- لا توجد سياسات للزوار: القراءة للأولياء تتم عبر دوال Netlify بعد التحقق من الرمز.

insert into storage.buckets(id,name,public) values('files','files',false) on conflict do nothing;
drop policy if exists files_admin on storage.objects;
create policy files_admin on storage.objects for all to authenticated using(bucket_id='files' and is_admin()) with check(bucket_id='files' and is_admin());

-- فيديوهات ومشتركو البريد
create table if not exists videos(id bigserial primary key, title text not null, subject text, description text, url text not null, created_at timestamptz default now());
create table if not exists subscribers(id bigserial primary key, email text unique not null, created_at timestamptz default now());
do $$ declare t text; begin
 foreach t in array array['videos','subscribers'] loop
  execute format('alter table %I enable row level security',t);
  execute format('drop policy if exists admin_all on %I',t);
  execute format('create policy admin_all on %I for all to authenticated using(is_admin()) with check(is_admin())',t);
 end loop; end $$;
