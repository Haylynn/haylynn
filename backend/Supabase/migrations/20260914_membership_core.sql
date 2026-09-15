-- Princess of Reality — membership core
-- Run in Supabase SQL editor (or CLI) once per project.
-- Requires: Auth enabled. Never expose service_role to the browser.

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  handle text unique,
  bio text,
  links jsonb default '[]'::jsonb,
  avatar_url text,
  tier text not null default 'free'
    check (tier in ('free', 'supporter', 'patron')),
  subscription_status text
    check (subscription_status is null or subscription_status in (
      'active', 'trialing', 'past_due', 'canceled', 'incomplete', 'unpaid'
    )),
  stripe_customer_id text unique,
  stripe_subscription_id text,
  theme_config jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_tier_idx on public.profiles (tier);
create index if not exists profiles_handle_idx on public.profiles (handle);

alter table public.profiles enable row level security;

-- Drop old policies if re-running
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_select_public_handles" on public.profiles;

create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    -- Client must not self-promote tier or stripe fields
    and tier = (select p.tier from public.profiles p where p.id = auth.uid())
    and coalesce(subscription_status, '') = coalesce(
      (select p.subscription_status from public.profiles p where p.id = auth.uid()), ''
    )
    and stripe_customer_id is not distinct from (
      select p.stripe_customer_id from public.profiles p where p.id = auth.uid()
    )
    and stripe_subscription_id is not distinct from (
      select p.stripe_subscription_id from public.profiles p where p.id = auth.uid()
    )
  );

-- Optional: public can read limited cards by handle (no email / stripe)
-- Uncomment when you want public profile pages:
-- create policy "profiles_select_public_handles"
--   on public.profiles for select
--   to anon, authenticated
--   using (handle is not null);

-- ---------------------------------------------------------------------------
-- Auto-create profile on signup
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(coalesce(new.email, ''), '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Adventure progress (text adventure / path through the house)
-- Tied to account; only the owner can read/write their run.
-- ---------------------------------------------------------------------------
create table if not exists public.adventure_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  -- Current node in the adventure graph (string id from your content)
  node_id text not null default 'start',
  -- Arbitrary flags: doors opened, items found, affiliate milestones, etc.
  flags jsonb not null default '{}'::jsonb,
  -- Features unlocked via path or subscription (e.g. "servers", "theme_reroll")
  unlocked text[] not null default '{}',
  -- Soft currency from path (optional; not real money)
  path_score integer not null default 0 check (path_score >= 0),
  updated_at timestamptz not null default now()
);

alter table public.adventure_progress enable row level security;

drop policy if exists "adventure_select_own" on public.adventure_progress;
drop policy if exists "adventure_insert_own" on public.adventure_progress;
drop policy if exists "adventure_update_own" on public.adventure_progress;

create policy "adventure_select_own"
  on public.adventure_progress for select
  to authenticated
  using (auth.uid() = user_id);

create policy "adventure_insert_own"
  on public.adventure_progress for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "adventure_update_own"
  on public.adventure_progress for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Seed adventure row when profile is created
create or replace function public.handle_new_adventure()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.adventure_progress (user_id, node_id)
  values (new.id, 'start')
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_profile_created_adventure on public.profiles;
create trigger on_profile_created_adventure
  after insert on public.profiles
  for each row execute function public.handle_new_adventure();

-- ---------------------------------------------------------------------------
-- Helper: does this user have an active paid tier?
-- ---------------------------------------------------------------------------
create or replace function public.has_active_membership(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = uid
      and tier in ('supporter', 'patron')
      and subscription_status in ('active', 'trialing')
  );
$$;

revoke all on function public.has_active_membership(uuid) from public;
grant execute on function public.has_active_membership(uuid) to authenticated;

-- Grants for API roles
grant select, update on public.profiles to authenticated;
grant select, insert, update on public.adventure_progress to authenticated;
