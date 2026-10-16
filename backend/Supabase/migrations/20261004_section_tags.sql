-- Section tags: which scroll rooms grant membership perks (max enforced in app by tier)
alter table public.profiles
  add column if not exists section_tags text[] not null default '{}';

comment on column public.profiles.section_tags is
  'Scroll section ids the member opted into (e.g. haylynn, chronicle, threshold). Empty = identity only.';

-- Optional: keep client from writing absurd arrays (app still clamps)
-- RLS: section_tags already covered by profiles update-own policy if present.
