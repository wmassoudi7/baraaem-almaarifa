-- ملخصات وتمارين: شغّليه مرة واحدة في Supabase > SQL Editor
create table if not exists resources(id bigserial primary key, title text not null, subject text not null, file_url text, file_name text, created_at timestamptz default now());
create index if not exists i_res on resources(subject, created_at desc);
alter table resources enable row level security;
drop policy if exists admin_all on resources;
create policy admin_all on resources for all to authenticated using(is_admin()) with check(is_admin());
