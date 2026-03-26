-- ============================================================
-- EXOPS Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ─── Extensions ─────────────────────────────────────────────
create extension if not exists "uuid-ossp";


-- ─── Enums ──────────────────────────────────────────────────
create type exhibition_status as enum ('planning', 'active', 'closed', 'cancelled');
create type gate_status       as enum ('passed', 'pending', 'blocked');
create type task_status       as enum ('todo', 'in_progress', 'done', 'blocked');
create type task_category     as enum ('logistics', 'booth', 'marketing', 'onsite', 'post');
create type lead_grade        as enum ('A', 'B', 'C', 'ungraded');
create type lead_source       as enum ('badge_scan', 'business_card', 'manual');
create type cost_category     as enum ('booth', 'flight', 'hotel', 'interpreter', 'promotion', 'other');
create type user_role         as enum ('admin', 'ops', 'sales', 'executive');
create type activity_type     as enum ('note', 'call', 'email', 'meeting', 'status_change');


-- ─── Users ──────────────────────────────────────────────────
create table users (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  email      text not null unique,
  role       user_role not null default 'ops',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- ─── Exhibitions ────────────────────────────────────────────
create table exhibitions (
  id             uuid primary key default uuid_generate_v4(),
  name           text not null,
  city           text not null,
  country        char(2) not null,           -- ISO 3166-1 alpha-2
  venue_name     text not null,
  starts_at      date not null,
  ends_at        date not null,
  status         exhibition_status not null default 'planning',
  budget_usd     numeric(12, 2) not null default 0,
  goal_leads     int not null default 0,
  goal_meetings  int not null default 0,
  created_by     uuid references users(id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);


-- ─── Exhibition Gates ────────────────────────────────────────
create table exhibition_gates (
  id             uuid primary key default uuid_generate_v4(),
  exhibition_id  uuid not null references exhibitions(id) on delete cascade,
  "order"        int not null,
  name           text not null,
  status         gate_status not null default 'pending',
  passed_at      timestamptz,
  passed_by      uuid references users(id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  unique (exhibition_id, "order")
);


-- ─── Exhibition KPIs (snapshot per record) ──────────────────
create table exhibition_kpis (
  id               uuid primary key default uuid_generate_v4(),
  exhibition_id    uuid not null references exhibitions(id) on delete cascade,
  visitors         int not null default 0,
  qualified_leads  int not null default 0,
  a_leads          int not null default 0,
  exec_meetings    int not null default 0,
  distributors     int not null default 0,
  proposals        int not null default 0,
  contracts        int not null default 0,
  rev_6m_usd       numeric(14, 2) not null default 0,
  rev_12m_usd      numeric(14, 2) not null default 0,
  recorded_at      timestamptz not null default now(),
  created_by       uuid references users(id) on delete set null
);


-- ─── Exhibition Members ──────────────────────────────────────
create table exhibition_members (
  id             uuid primary key default uuid_generate_v4(),
  exhibition_id  uuid not null references exhibitions(id) on delete cascade,
  user_id        uuid not null references users(id) on delete cascade,
  role           text not null default 'member',
  created_at     timestamptz not null default now(),
  unique (exhibition_id, user_id)
);


-- ─── Leads ──────────────────────────────────────────────────
create table leads (
  id             uuid primary key default uuid_generate_v4(),
  exhibition_id  uuid not null references exhibitions(id) on delete cascade,
  company        text not null,
  full_name      text not null,
  title          text,
  email          text,
  phone          text,
  country        char(2),
  interest       text,
  lead_type      text,
  grade          lead_grade not null default 'ungraded',
  is_qualified   boolean not null default false,
  source         lead_source not null default 'manual',
  assignee_id    uuid references users(id) on delete set null,
  collected_at   timestamptz not null default now(),
  sla_due_at     timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);


-- ─── Lead Activities ────────────────────────────────────────
create table lead_activities (
  id          uuid primary key default uuid_generate_v4(),
  lead_id     uuid not null references leads(id) on delete cascade,
  user_id     uuid references users(id) on delete set null,
  type        activity_type not null,
  body        text,
  created_at  timestamptz not null default now()
);


-- ─── Lead Next Actions ───────────────────────────────────────
create table lead_next_actions (
  id           uuid primary key default uuid_generate_v4(),
  lead_id      uuid not null references leads(id) on delete cascade,
  description  text not null,
  due_at       timestamptz,
  is_done      boolean not null default false,
  assigned_to  uuid references users(id) on delete set null,
  created_at   timestamptz not null default now()
);


-- ─── Task Templates ─────────────────────────────────────────
create table task_templates (
  id                uuid primary key default uuid_generate_v4(),
  category          task_category not null,
  title             text not null,
  description       text,
  days_before_start int,           -- due = exhibition.starts_at - N days (null = manual)
  is_active         boolean not null default true,
  created_at        timestamptz not null default now()
);


-- ─── Tasks ──────────────────────────────────────────────────
create table tasks (
  id             uuid primary key default uuid_generate_v4(),
  exhibition_id  uuid not null references exhibitions(id) on delete cascade,
  template_id    uuid references task_templates(id) on delete set null,
  category       task_category not null,
  title          text not null,
  description    text,
  due_date       date,
  status         task_status not null default 'todo',
  assignee_id    uuid references users(id) on delete set null,
  completed_at   timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);


-- ─── Costs ──────────────────────────────────────────────────
create table costs (
  id                      uuid primary key default uuid_generate_v4(),
  exhibition_id           uuid not null references exhibitions(id) on delete cascade,
  category                cost_category not null,
  description             text not null,
  budgeted_usd            numeric(12, 2) not null default 0,
  actual_usd              numeric(12, 2),
  currency                char(3),               -- ISO 4217 (KRW, EUR, USD …)
  actual_original_amount  numeric(14, 2),        -- 원본 통화 금액
  paid_at                 timestamptz,
  created_by              uuid references users(id) on delete set null,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);


-- ─── Cost Receipts ──────────────────────────────────────────
create table cost_receipts (
  id           uuid primary key default uuid_generate_v4(),
  cost_id      uuid not null references costs(id) on delete cascade,
  file_url     text not null,
  file_name    text not null,
  uploaded_by  uuid references users(id) on delete set null,
  uploaded_at  timestamptz not null default now()
);


-- ─── updated_at auto-update trigger ─────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_exhibitions_updated_at
  before update on exhibitions
  for each row execute function set_updated_at();

create trigger trg_leads_updated_at
  before update on leads
  for each row execute function set_updated_at();

create trigger trg_tasks_updated_at
  before update on tasks
  for each row execute function set_updated_at();

create trigger trg_costs_updated_at
  before update on costs
  for each row execute function set_updated_at();

create trigger trg_exhibition_gates_updated_at
  before update on exhibition_gates
  for each row execute function set_updated_at();

create trigger trg_users_updated_at
  before update on users
  for each row execute function set_updated_at();


-- ─── Indexes ────────────────────────────────────────────────
create index on exhibition_gates (exhibition_id);
create index on exhibition_kpis (exhibition_id);
create index on exhibition_members (exhibition_id);
create index on leads (exhibition_id);
create index on leads (assignee_id);
create index on leads (sla_due_at) where sla_due_at is not null;
create index on lead_activities (lead_id);
create index on lead_next_actions (lead_id) where is_done = false;
create index on tasks (exhibition_id);
create index on tasks (assignee_id);
create index on costs (exhibition_id);
create index on cost_receipts (cost_id);
