-- Optional cloud ledger for Zero Infinity simulation
-- Safe to run in Supabase; not required for local-only testing.

create table if not exists public.zero_infinity_balances (
  user_id uuid primary key references auth.users (id) on delete cascade,
  btc_sim numeric not null default 0,
  zero_balance numeric not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.zero_infinity_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null,
  btc_delta numeric not null default 0,
  zero_delta numeric not null default 0,
  note text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists zero_infinity_ledger_user_idx
  on public.zero_infinity_ledger (user_id, created_at desc);

alter table public.zero_infinity_balances enable row level security;
alter table public.zero_infinity_ledger enable row level security;

drop policy if exists "zi_balances_own" on public.zero_infinity_balances;
create policy "zi_balances_own" on public.zero_infinity_balances
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "zi_ledger_select_own" on public.zero_infinity_ledger;
create policy "zi_ledger_select_own" on public.zero_infinity_ledger
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "zi_ledger_insert_own" on public.zero_infinity_ledger;
create policy "zi_ledger_insert_own" on public.zero_infinity_ledger
  for insert to authenticated with check (auth.uid() = user_id);

grant select, insert, update, delete on public.zero_infinity_balances to authenticated;
grant select, insert on public.zero_infinity_ledger to authenticated;
