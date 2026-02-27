alter table if exists appointments
  add column if not exists appointment_type varchar(100),
  add column if not exists room_name varchar(100),
  add column if not exists is_blocked boolean default false;

create table if not exists clinical_photos (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients(id) on delete cascade,
  session_id uuid references sessions(id) on delete set null,
  procedure_name varchar(255),
  captured_at timestamptz not null,
  photo_type varchar(10) not null check (photo_type in ('before', 'after')),
  file_path text not null,
  file_url text not null,
  consented boolean default false,
  created_at timestamptz default now()
);

create table if not exists consents (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients(id) on delete cascade,
  template_name varchar(255) not null,
  terms_text text not null,
  signature_name varchar(255) not null,
  signed_at timestamptz not null,
  document_url text,
  created_at timestamptz default now()
);

create index if not exists clinical_photos_patient_idx on clinical_photos(patient_id, captured_at desc);
create index if not exists consents_patient_idx on consents(patient_id, signed_at desc);

alter table appointments enable row level security;
alter table sessions enable row level security;
alter table session_procedures enable row level security;
alter table clinical_photos enable row level security;
alter table consents enable row level security;

drop policy if exists "authenticated can read appointments" on appointments;
create policy "authenticated can read appointments"
on appointments for select using (auth.role() = 'authenticated');

drop policy if exists "authenticated can insert appointments" on appointments;
create policy "authenticated can insert appointments"
on appointments for insert with check (auth.role() = 'authenticated');

drop policy if exists "authenticated can update appointments" on appointments;
create policy "authenticated can update appointments"
on appointments for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "authenticated can delete appointments" on appointments;
create policy "authenticated can delete appointments"
on appointments for delete using (auth.role() = 'authenticated');

drop policy if exists "authenticated can read sessions" on sessions;
create policy "authenticated can read sessions"
on sessions for select using (auth.role() = 'authenticated');

drop policy if exists "authenticated can insert sessions" on sessions;
create policy "authenticated can insert sessions"
on sessions for insert with check (auth.role() = 'authenticated');

drop policy if exists "authenticated can update sessions" on sessions;
create policy "authenticated can update sessions"
on sessions for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "authenticated can delete sessions" on sessions;
create policy "authenticated can delete sessions"
on sessions for delete using (auth.role() = 'authenticated');

drop policy if exists "authenticated can read session procedures" on session_procedures;
create policy "authenticated can read session procedures"
on session_procedures for select using (auth.role() = 'authenticated');

drop policy if exists "authenticated can insert session procedures" on session_procedures;
create policy "authenticated can insert session procedures"
on session_procedures for insert with check (auth.role() = 'authenticated');

drop policy if exists "authenticated can update session procedures" on session_procedures;
create policy "authenticated can update session procedures"
on session_procedures for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "authenticated can delete session procedures" on session_procedures;
create policy "authenticated can delete session procedures"
on session_procedures for delete using (auth.role() = 'authenticated');

drop policy if exists "authenticated can read clinical photos" on clinical_photos;
create policy "authenticated can read clinical photos"
on clinical_photos for select using (auth.role() = 'authenticated');

drop policy if exists "authenticated can insert clinical photos" on clinical_photos;
create policy "authenticated can insert clinical photos"
on clinical_photos for insert with check (auth.role() = 'authenticated');

drop policy if exists "authenticated can delete clinical photos" on clinical_photos;
create policy "authenticated can delete clinical photos"
on clinical_photos for delete using (auth.role() = 'authenticated');

drop policy if exists "authenticated can read consents" on consents;
create policy "authenticated can read consents"
on consents for select using (auth.role() = 'authenticated');

drop policy if exists "authenticated can insert consents" on consents;
create policy "authenticated can insert consents"
on consents for insert with check (auth.role() = 'authenticated');

insert into storage.buckets (id, name, public)
values ('clinical-photos', 'clinical-photos', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('consents', 'consents', true)
on conflict (id) do nothing;

drop policy if exists "authenticated can view clinical photos bucket" on storage.objects;
create policy "authenticated can view clinical photos bucket"
on storage.objects for select
using (bucket_id = 'clinical-photos' and auth.role() = 'authenticated');

drop policy if exists "authenticated can upload clinical photos bucket" on storage.objects;
create policy "authenticated can upload clinical photos bucket"
on storage.objects for insert
with check (bucket_id = 'clinical-photos' and auth.role() = 'authenticated');

drop policy if exists "authenticated can delete clinical photos bucket" on storage.objects;
create policy "authenticated can delete clinical photos bucket"
on storage.objects for delete
using (bucket_id = 'clinical-photos' and auth.role() = 'authenticated');

drop policy if exists "authenticated can view consents bucket" on storage.objects;
create policy "authenticated can view consents bucket"
on storage.objects for select
using (bucket_id = 'consents' and auth.role() = 'authenticated');

drop policy if exists "authenticated can upload consents bucket" on storage.objects;
create policy "authenticated can upload consents bucket"
on storage.objects for insert
with check (bucket_id = 'consents' and auth.role() = 'authenticated');
