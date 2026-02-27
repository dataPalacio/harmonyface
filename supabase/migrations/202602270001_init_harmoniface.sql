create extension if not exists pgcrypto;
create extension if not exists vector;

create table if not exists patients (
  id uuid primary key default gen_random_uuid(),
  full_name varchar(255) not null,
  cpf varchar(14) unique,
  birth_date date,
  gender varchar(20),
  phone varchar(20),
  email varchar(255),
  address jsonb,
  profile_photo_url text,
  medical_history jsonb,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists anamnesis (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id) on delete cascade,
  allergies jsonb,
  current_medications jsonb,
  previous_procedures jsonb,
  medical_conditions jsonb,
  expectations text,
  expectations_structured jsonb,
  fitzpatrick_skin_type varchar(10),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists procedure_catalog (
  id uuid primary key default gen_random_uuid(),
  name varchar(255) not null,
  category varchar(100),
  description text,
  default_duration_min int,
  default_price decimal(10, 2),
  facial_regions jsonb,
  is_active boolean default true
);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id),
  procedure_id uuid references procedure_catalog(id),
  scheduled_at timestamptz not null,
  duration_min int,
  status varchar(30) default 'scheduled',
  reminder_sent boolean default false,
  notes text,
  created_at timestamptz default now()
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id),
  appointment_id uuid references appointments(id),
  date timestamptz not null,
  clinical_notes_raw text,
  clinical_notes_structured jsonb,
  clinical_summary text,
  compliance_score int,
  compliance_flags jsonb,
  consent_signed boolean default false,
  consent_document_url text,
  created_at timestamptz default now()
);

create table if not exists session_procedures (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  procedure_id uuid references procedure_catalog(id),
  facial_region varchar(100),
  product_used varchar(255),
  product_lot varchar(100),
  product_expiry date,
  quantity varchar(50),
  technique varchar(255),
  complications text,
  before_photo_url text,
  after_photo_url text,
  notes text
);

create table if not exists inventory (
  id uuid primary key default gen_random_uuid(),
  product_name varchar(255) not null,
  manufacturer varchar(255),
  lot_number varchar(100),
  expiry_date date,
  quantity_available decimal(10, 2),
  unit varchar(50),
  min_stock_alert decimal(10, 2),
  cost_per_unit decimal(10, 2),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists inventory_movements (
  id uuid primary key default gen_random_uuid(),
  inventory_id uuid references inventory(id),
  session_procedure_id uuid references session_procedures(id),
  movement_type varchar(10),
  quantity decimal(10, 2),
  reason text,
  moved_at timestamptz default now()
);

create table if not exists financial_records (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid references patients(id),
  session_id uuid references sessions(id),
  type varchar(20),
  amount decimal(10, 2),
  payment_method varchar(50),
  installments int default 1,
  status varchar(20) default 'pending',
  due_date date,
  paid_at timestamptz,
  document_url text,
  notes text,
  created_at timestamptz default now()
);

create table if not exists document_templates (
  id uuid primary key default gen_random_uuid(),
  name varchar(255),
  type varchar(50),
  content_html text,
  is_active boolean default true
);

create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  action varchar(100),
  entity_type varchar(50),
  entity_id uuid,
  details jsonb,
  performed_at timestamptz default now()
);

create table if not exists knowledge_base (
  id uuid primary key default gen_random_uuid(),
  title varchar(500),
  source varchar(255),
  content text,
  embedding vector(384),
  metadata jsonb,
  created_at timestamptz default now()
);

create index if not exists knowledge_base_embedding_idx on knowledge_base using ivfflat (embedding vector_cosine_ops) with (lists = 100);

create index if not exists sessions_patient_id_idx on sessions(patient_id);
create index if not exists appointments_scheduled_at_idx on appointments(scheduled_at);
create index if not exists financial_records_due_date_idx on financial_records(due_date);
