Princess of Reality — next updates (no Stripe)

OVERWRITE into your haylynn repo, then push.

NEW
  js/account-progress-config.js   — thin Path nodes
  js/haylynn-account-progress.js  — marks + path load/unlock (Supabase or local)
  backend/20261103_account_path_marks.sql — run in Supabase SQL editor
  DECAY-ACCOUNT-BRIDGE.md         — what Cosmic Decay must implement

PATCHED
  js/haylynn-members.js           — Path tab, marks on passport, Decay tab clarity
  js/haylynn-character.js         — local character cache fallback + continue URL notes
  js/members-config.js            — Play/Market labels if needed

NOT INCLUDED
  Stripe, payment links, live Market SKUs, token/chain, full PoE tree UI

AFTER INSTALL
  1. Run backend/20261103_account_path_marks.sql in Supabase
  2. Push hub
  3. Wire Cosmic Decay to same Supabase + characters table (see DECAY-ACCOUNT-BRIDGE.md)
