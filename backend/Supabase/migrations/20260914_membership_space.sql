-- Extend membership space (run after 20260914_membership_core.sql)

alter table public.profiles
  add column if not exists wallet_address text,
  add column if not exists account_no bigserial;

-- Unique wallet when set
create unique index if not exists profiles_wallet_address_uidx
  on public.profiles (wallet_address)
  where wallet_address is not null;

-- Draw history (cloud)
create table if not exists public.draw_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  cards jsonb,
  reading_summary text,
  created_at timestamptz not null default now()
);
create index if not exists draw_history_user_idx on public.draw_history (user_id, created_at desc);
alter table public.draw_history enable row level security;
drop policy if exists "draw_select_own" on public.draw_history;
drop policy if exists "draw_insert_own" on public.draw_history;
create policy "draw_select_own" on public.draw_history for select to authenticated
  using (auth.uid() = user_id);
create policy "draw_insert_own" on public.draw_history for insert to authenticated
  with check (auth.uid() = user_id);

-- RPG inventory
create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  item_key text not null,
  name text,
  qty integer not null default 1 check (qty > 0),
  meta jsonb default '{}'::jsonb,
  acquired_at timestamptz not null default now(),
  unique (user_id, item_key)
);
create index if not exists inventory_user_idx on public.inventory_items (user_id);
alter table public.inventory_items enable row level security;
drop policy if exists "inv_select_own" on public.inventory_items;
drop policy if exists "inv_insert_own" on public.inventory_items;
drop policy if exists "inv_update_own" on public.inventory_items;
create policy "inv_select_own" on public.inventory_items for select to authenticated
  using (auth.uid() = user_id);
create policy "inv_insert_own" on public.inventory_items for insert to authenticated
  with check (auth.uid() = user_id);
create policy "inv_update_own" on public.inventory_items for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Aggregate activity (written by your analytics job or triggers later)
create table if not exists public.member_stats (
  user_id uuid primary key references auth.users (id) on delete cascade,
  rooms_visited integer not null default 0,
  draws_total integer not null default 0,
  adventure_steps integer not null default 0,
  sessions integer not null default 0,
  last_seen timestamptz,
  updated_at timestamptz not null default now()
);
alter table public.member_stats enable row level security;
drop policy if exists "stats_select_own" on public.member_stats;
create policy "stats_select_own" on public.member_stats for select to authenticated
  using (auth.uid() = user_id);
-- Writes: service role / triggers only (no client insert policy on purpose)

grant select, insert on public.draw_history to authenticated;
grant select, insert, update on public.inventory_items to authenticated;
grant select on public.member_stats to authenticated;
