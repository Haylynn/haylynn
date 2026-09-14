-- Haylynn members: profile theme tokens (MySpace-style skin, layout fixed)
-- Run in Supabase SQL editor or via supabase db push

-- Profiles table (create if you do not already have one)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  handle text unique,
  display_name text,
  bio text,
  avatar_url text,
  links jsonb default '[]'::jsonb,
  tier text default 'public' check (tier in ('public', 'member')),
  theme_config jsonb,
  theme_generated_at timestamptz,
  theme_rerolls_used int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- If profiles already exists, only add theme columns
alter table public.profiles
  add column if not exists theme_config jsonb,
  add column if not exists theme_generated_at timestamptz,
  add column if not exists theme_rerolls_used int default 0;

comment on column public.profiles.theme_config is
  'LLM-generated design tokens: colors, typography, geometry, customEffects';

-- Optional: constrain shape lightly (non-null keys when present)
alter table public.profiles drop constraint if exists theme_config_is_object;
alter table public.profiles
  add constraint theme_config_is_object
  check (theme_config is null or jsonb_typeof(theme_config) = 'object');

-- RLS
alter table public.profiles enable row level security;

drop policy if exists "Profiles are viewable by everyone" on public.profiles;
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Users insert own profile" on public.profiles;
create policy "Users insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- theme_config should only be written by service role / edge function
-- (optional tighter policy: members cannot arbitrary-patch theme_config from client)
