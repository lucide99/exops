-- Run in Supabase SQL Editor

create table meetings (
  id            uuid primary key default uuid_generate_v4(),
  exhibition_id uuid not null references exhibitions(id) on delete cascade,
  company       text,
  contact_name  text not null,
  contact_title text,
  meeting_at    timestamptz not null,
  notes         text,
  is_exec       boolean not null default false,
  created_by    uuid references users(id) on delete set null,
  created_at    timestamptz not null default now()
);

create index on meetings (exhibition_id);

alter table meetings disable row level security;
