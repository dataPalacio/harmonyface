alter table if exists anamnesis
  add constraint anamnesis_patient_unique unique (patient_id);

alter table patients enable row level security;
alter table anamnesis enable row level security;

drop policy if exists "authenticated can read patients" on patients;
create policy "authenticated can read patients"
on patients for select
using (auth.role() = 'authenticated');

drop policy if exists "authenticated can insert patients" on patients;
create policy "authenticated can insert patients"
on patients for insert
with check (auth.role() = 'authenticated');

drop policy if exists "authenticated can update patients" on patients;
create policy "authenticated can update patients"
on patients for update
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "authenticated can delete patients" on patients;
create policy "authenticated can delete patients"
on patients for delete
using (auth.role() = 'authenticated');

drop policy if exists "authenticated can read anamnesis" on anamnesis;
create policy "authenticated can read anamnesis"
on anamnesis for select
using (auth.role() = 'authenticated');

drop policy if exists "authenticated can insert anamnesis" on anamnesis;
create policy "authenticated can insert anamnesis"
on anamnesis for insert
with check (auth.role() = 'authenticated');

drop policy if exists "authenticated can update anamnesis" on anamnesis;
create policy "authenticated can update anamnesis"
on anamnesis for update
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "authenticated can delete anamnesis" on anamnesis;
create policy "authenticated can delete anamnesis"
on anamnesis for delete
using (auth.role() = 'authenticated');
