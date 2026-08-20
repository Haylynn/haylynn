# Dev notes (not the public face)

Internal checklist for working on this repo. Visitors should read [README.md](./README.md).

## Modules worth knowing

| File | Role |
|------|------|
| `js/haylynn-content.js` | Section copy (face + detail) |
| `js/haylynn-bootstrap.js` | Scroller, gestures, inits |
| `js/haylynn-world.js` | Section whitelist / state |
| `js/construction-config.js` | Which *detail* panels show “still forming” |
| `js/auth-config.js` | Supabase URL / anon key / Stripe price IDs (empty = offline) |
| `js/radio-config.js` | Live stream URLs when radio exists |
| `js/ticker-config.js` / `weather-config.js` | Ambient data toggles |

## Auth

Fill `auth-config.js` only with the **anon** key. Service role and LLM keys never go in this repo — Vercel / Supabase secrets only.

## Before public push

- [ ] No `director.html` in the tree (gitignored)
- [ ] No service-role keys or OpenAI keys in client JS
- [ ] `construction-config.js` matches what is actually unfinished
- [ ] Static HTML still roughly matches `haylynn-content.js` if copy changed
