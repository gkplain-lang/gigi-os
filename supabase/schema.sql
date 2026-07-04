-- =====================================================================
-- Gigi OS — Supabase schema (V0.4.1 Memory Foundation)
-- =====================================================================
-- Run this in the Supabase SQL Editor (see docs/SUPABASE_SETUP.md).
--
-- This only PREPARES the persistent memory layer. The app still runs on
-- localStorage until V0.4.2 / V0.4.3. No auth wiring, no data migration yet.
--
-- Every table is owned by user_id and protected by Row Level Security:
-- a user can only read/write their own rows. Nothing is public by default.
-- =====================================================================

create extension if not exists "pgcrypto";

-- Keeps updated_at fresh on any row update.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  description text,
  status text not null default 'active'
    check (status in ('active', 'paused', 'completed', 'future', 'archived')),
  priority text check (priority in ('critical', 'high', 'medium', 'low')),
  strategic_value int,
  business_impact int,
  completion_proximity int,
  urgency int,
  clarity int,
  effort_efficiency int,
  risk_of_delay int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- missions
-- ---------------------------------------------------------------------
create table if not exists public.missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,
  title text not null,
  reason text,
  status text not null default 'recommended'
    check (status in (
      'recommended', 'available', 'in_progress',
      'completed', 'postponed', 'rejected_for_now', 'archived'
    )),
  score int,
  estimated_time text,
  impact int,
  clarity int,
  effort int,
  tags jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

-- ---------------------------------------------------------------------
-- history_events
-- ---------------------------------------------------------------------
create table if not exists public.history_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,
  mission_id uuid references public.missions (id) on delete set null,
  type text not null,
  title text not null,
  description text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- conversation_messages
-- ---------------------------------------------------------------------
create table if not exists public.conversation_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('user', 'gigi')),
  content text not null,
  detected_intent text,
  recommended_mission_id uuid references public.missions (id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- decision_logs
-- ---------------------------------------------------------------------
create table if not exists public.decision_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  selected_project_id uuid references public.projects (id) on delete set null,
  selected_mission_id uuid references public.missions (id) on delete set null,
  score_breakdown jsonb,
  why_selected text,
  why_not_others jsonb,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- autonomy_logs
-- ---------------------------------------------------------------------
create table if not exists public.autonomy_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  action_type text not null
    check (action_type in ('internal', 'preparation', 'external', 'sensitive')),
  project_id uuid references public.projects (id) on delete set null,
  mission_id uuid references public.missions (id) on delete set null,
  autonomy_level int not null default 0,
  confirmation_required boolean not null default true,
  confirmation_status text not null default 'auto'
    check (confirmation_status in ('auto', 'confirmed', 'rejected')),
  result text not null default 'pending'
    check (result in ('success', 'failure', 'cancelled', 'pending')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- user_settings
-- ---------------------------------------------------------------------
create table if not exists public.user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  preferred_language text default 'fr',
  autonomy_level int not null default 0,
  daily_brief_time time,
  focus_mode boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =====================================================================
-- updated_at triggers
-- =====================================================================
drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

drop trigger if exists set_missions_updated_at on public.missions;
create trigger set_missions_updated_at
  before update on public.missions
  for each row execute function public.set_updated_at();

drop trigger if exists set_user_settings_updated_at on public.user_settings;
create trigger set_user_settings_updated_at
  before update on public.user_settings
  for each row execute function public.set_updated_at();

-- =====================================================================
-- Indexes
-- =====================================================================
create index if not exists idx_projects_user_id on public.projects (user_id);
create index if not exists idx_missions_user_id on public.missions (user_id);
create index if not exists idx_missions_project_id on public.missions (project_id);
create index if not exists idx_missions_status on public.missions (status);
create index if not exists idx_history_user_created on public.history_events (user_id, created_at desc);
create index if not exists idx_conversation_user_created on public.conversation_messages (user_id, created_at desc);
create index if not exists idx_decision_user_created on public.decision_logs (user_id, created_at desc);
create index if not exists idx_autonomy_user_created on public.autonomy_logs (user_id, created_at desc);

-- =====================================================================
-- Row Level Security — every table, owner-only access
-- =====================================================================
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.missions enable row level security;
alter table public.history_events enable row level security;
alter table public.conversation_messages enable row level security;
alter table public.decision_logs enable row level security;
alter table public.autonomy_logs enable row level security;
alter table public.user_settings enable row level security;

-- profiles: owner is the row id (= auth.uid())
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_delete_own" on public.profiles
  for delete using (auth.uid() = id);

-- Helper: apply the standard owner policies (user_id = auth.uid()) to a table.
do $$
declare
  t text;
begin
  foreach t in array array[
    'projects', 'missions', 'history_events', 'conversation_messages',
    'decision_logs', 'autonomy_logs', 'user_settings'
  ]
  loop
    execute format('drop policy if exists %I on public.%I', t || '_select_own', t);
    execute format(
      'create policy %I on public.%I for select using (auth.uid() = user_id)',
      t || '_select_own', t
    );

    execute format('drop policy if exists %I on public.%I', t || '_insert_own', t);
    execute format(
      'create policy %I on public.%I for insert with check (auth.uid() = user_id)',
      t || '_insert_own', t
    );

    execute format('drop policy if exists %I on public.%I', t || '_update_own', t);
    execute format(
      'create policy %I on public.%I for update using (auth.uid() = user_id) with check (auth.uid() = user_id)',
      t || '_update_own', t
    );

    execute format('drop policy if exists %I on public.%I', t || '_delete_own', t);
    execute format(
      'create policy %I on public.%I for delete using (auth.uid() = user_id)',
      t || '_delete_own', t
    );
  end loop;
end;
$$;

-- =====================================================================
-- End of V0.4.1 schema.
-- =====================================================================
