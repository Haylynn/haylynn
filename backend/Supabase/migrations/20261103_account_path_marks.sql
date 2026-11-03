-- Account marks + thin Path (Princess of Reality spine)
-- Run in Supabase SQL editor after characters migrations.
-- No Stripe.

create table if not exists public.account_marks (
  user_id uuid primary key references auth.users (id) on delete cascade,
  balance integer not null default 0 check (balance >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.account_path (
  user_id uuid primary key references auth.users (id) on delete cascade,
  path_points integer not null default 0 check (path_points >= 0),
  unlocked jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.account_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  delta integer not null,
  reason text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists account_ledger_user_idx
  on public.account_ledger (user_id, created_at desc);

alter table public.account_marks enable row level security;
alter table public.account_path enable row level security;
alter table public.account_ledger enable row level security;

drop policy if exists "account_marks_own" on public.account_marks;
create policy "account_marks_own" on public.account_marks
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "account_path_own" on public.account_path;
create policy "account_path_own" on public.account_path
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "account_ledger_select_own" on public.account_ledger;
create policy "account_ledger_select_own" on public.account_ledger
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "account_ledger_insert_own" on public.account_ledger;
create policy "account_ledger_insert_own" on public.account_ledger
  for insert to authenticated with check (auth.uid() = user_id);

grant select, insert, update, delete on public.account_marks to authenticated;
grant select, insert, update, delete on public.account_path to authenticated;
grant select, insert on public.account_ledger to authenticated;
