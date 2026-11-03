# Cosmic Decay ↔ Princess of Reality account

No Stripe in this pack. Goal: game and hub share one Supabase user.

## Already on the hub

- `js/haylynn-character.js` — list/get characters, realtime subscribe, `enterCosmicDecay()`
- Threshold **Cosmic Decay** tab when Play is tagged
- SQL: `characters`, `adventure_progress`, `inventory_items` (see `backend/Supabase/migrations/`)

## Game must do

1. Same Supabase project (URL + anon key) as the hub.
2. On login: `auth.getUser()` then upsert `characters` for this `user_id`.
3. During play: update `characters.sheet`, `active_domain_id`, `updated_at`.
4. Optional: write `adventure_progress` rows keyed by `user_id` / `character_id`.
5. On milestone (first clear, session end): call hub-compatible grants:
   - insert ledger via your API **or** update `account_marks` / `account_path` (after running `20261103_account_path_marks.sql`).

## Handoff

- Hub opens `https://haylynn-s-world.vercel.app/` (see `COSMIC_DECAY_URL`).
- Auth is per-origin: user signs in once on the game with the same email/OAuth.
- Optional later: shared cookie domain or magic-link handoff.

## Entitlements the game should read

From `account_path.unlocked` JSON array, e.g.:

- `play-second-slot` → allow 2nd character
- `play-veteran-flag` → returner intro path

From `characters` + tags on hub as today.
