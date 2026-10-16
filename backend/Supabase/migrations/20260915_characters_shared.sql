-- Shared identity for Princess of Reality site + Cosmic Decay (Vercel)
-- One Auth user → character(s) → live progress both apps read/write

-- ---------------------------------------------------------------------------
-- characters: the RPG persona tied to the membership account
-- ---------------------------------------------------------------------------
create table if not exists public.characters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  -- Display
  name text not null,
  portrait_url text,
  -- RPG sheet (flexible; game owns the shape)
  sheet jsonb not null default '{}'::jsonb,
  -- Which campaign / domain they last touched
  active_campaign_id text,
  active_domain_id text,
  active_room_id text,
  -- Lifecycle
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists characters_user_idx on public.characters (user_id);
create index if not exists characters_user_active_idx on public.characters (user_id) where is_active;

alter table public.characters enable row level security;

drop policy if exists "characters_select_own" on public.characters;
drop policy if exists "characters_insert_own" on public.characters;
drop policy if exists "characters_update_own" on public.characters;
drop policy if exists "characters_delete_own" on public.characters;

create policy "characters_select_own" on public.characters
  for select to authenticated using (auth.uid() = user_id);

create policy "characters_insert_own" on public.characters
  for insert to authenticated with check (auth.uid() = user_id);

create policy "characters_update_own" on public.characters
  for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "characters_delete_own" on public.characters
  for delete to authenticated using (auth.uid() = user_id);

grant select, insert, update, delete on public.characters to authenticated;

-- ---------------------------------------------------------------------------
-- Link adventure_progress to a character (optional but recommended)
-- ---------------------------------------------------------------------------
alter table public.adventure_progress
  add column if not exists character_id uuid references public.characters (id) on delete set null;

create index if not exists adventure_progress_character_idx
  on public.adventure_progress (character_id);

-- ---------------------------------------------------------------------------
-- inventory already user-scoped; optional character_id for multi-character later
-- ---------------------------------------------------------------------------
alter table public.inventory_items
  add column if not exists character_id uuid references public.characters (id) on delete cascade;

-- ---------------------------------------------------------------------------
-- Touch updated_at on character change
-- ---------------------------------------------------------------------------
create or replace function public.touch_character_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists characters_touch_updated on public.characters;
create trigger characters_touch_updated
  before update on public.characters
  for each row execute function public.touch_character_updated_at();

-- ---------------------------------------------------------------------------
-- Realtime: enable replication for live Threshold passport
-- (In Dashboard: Database → Replication, or:)
-- ---------------------------------------------------------------------------
-- alter publication supabase_realtime add table public.characters;
-- alter publication supabase_realtime add table public.adventure_progress;
-- alter publication supabase_realtime add table public.inventory_items;
