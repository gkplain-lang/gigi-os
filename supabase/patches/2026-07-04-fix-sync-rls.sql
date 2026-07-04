-- =====================================================================
-- Gigi OS — Patch sync RLS (V0.4.4)
-- Run in Supabase SQL Editor if sync returns permission / RLS errors.
-- Idempotent — safe to re-run.
-- Fixes: projects, missions, history_events (not profiles).
-- =====================================================================

-- Schema usage + table grants for API roles
grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on table public.projects to anon, authenticated;
grant select, insert, update, delete on table public.missions to anon, authenticated;
grant select, insert, update, delete on table public.history_events to anon, authenticated;

-- ---------------------------------------------------------------------
-- projects — owner column: user_id (= auth.uid())
-- ---------------------------------------------------------------------
alter table public.projects enable row level security;

drop policy if exists "projects_select_own" on public.projects;
create policy "projects_select_own" on public.projects
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "projects_insert_own" on public.projects;
create policy "projects_insert_own" on public.projects
  for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "projects_update_own" on public.projects;
create policy "projects_update_own" on public.projects
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "projects_delete_own" on public.projects;
create policy "projects_delete_own" on public.projects
  for delete to authenticated
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- missions — owner column: user_id (= auth.uid())
-- ---------------------------------------------------------------------
alter table public.missions enable row level security;

drop policy if exists "missions_select_own" on public.missions;
create policy "missions_select_own" on public.missions
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "missions_insert_own" on public.missions;
create policy "missions_insert_own" on public.missions
  for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "missions_update_own" on public.missions;
create policy "missions_update_own" on public.missions
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "missions_delete_own" on public.missions;
create policy "missions_delete_own" on public.missions
  for delete to authenticated
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- history_events — owner column: user_id (= auth.uid())
-- ---------------------------------------------------------------------
alter table public.history_events enable row level security;

drop policy if exists "history_events_select_own" on public.history_events;
create policy "history_events_select_own" on public.history_events
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "history_events_insert_own" on public.history_events;
create policy "history_events_insert_own" on public.history_events
  for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "history_events_update_own" on public.history_events;
create policy "history_events_update_own" on public.history_events
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "history_events_delete_own" on public.history_events;
create policy "history_events_delete_own" on public.history_events
  for delete to authenticated
  using (auth.uid() = user_id);
