# Members (Threshold) — plug-in readiness

## Already in the frontend
- Section **IX — Threshold** in the scroll (`haylynn-content.js`)
- UI shell: profile fields, tiers, sign-in / save / checkout / portal buttons (`haylynn-members.js`)
- Auth client wrapper (`haylynn-auth.js`) + modal/badge (`haylynn-auth-ui.js`)
- Config slots only — no secrets (`auth-config.js`, `members-config.js`)
- Theme tokens helper for profile skins (`haylynn-theme.js`)
- Backend stubs under `backend/supabase/` (theme migration + generate-theme function)

## To go live
1. Create Supabase project; enable Email + any OAuth providers you want.
2. Put **anon** URL + key in `js/auth-config.js` (never service role).
3. Set Stripe price IDs in `auth-config.js` / wire Edge functions for checkout + portal.
4. RLS on profiles: users read/update own row; public profiles optional.
5. Add `theme_config` JSONB (see `backend/supabase/migrations/`).
6. Point `members-config.js` `apiBase` at your functions when ready.

## Offline behaviour (now)
- Badge / Threshold say sign-in is closed or profiles not open yet — visitor-safe, no stack names.
- Fields disabled until `authReady`.

## Related
- **The Well** is patronage/causes (including MOLI), not membership.
- Privacy + Terms pages at repo root.
