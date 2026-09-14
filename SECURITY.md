# Security model — Princess of Reality site

This document is the operational security baseline for the public site and Threshold membership.

## Trust boundaries

| Zone | Trust |
|------|--------|
| Public static files (HTML/JS/CSS) | Untrusted client. Anyone can read and modify their copy. |
| Supabase **anon** key | Public by design. Safe only with **RLS** on every table. |
| Supabase **service_role** | Secret. Edge Functions / server only. Never in `js/` or git. |
| Stripe secret / webhook secret | Server only. |
| Director / DOM mutation | Workshop tool. Not on the public host. Mutations require unlock + whitelist. |

## Non-negotiables

1. **No service_role, no Stripe secret, no private API keys in the repo or frontend.**
2. **RLS enabled** on `profiles` and any user data tables before Auth goes live.
3. **`director.html` is not published** (see `.gitignore` / REMOVE-DIRECTOR.txt).
4. **OAuth redirectTo** is fixed to same-origin path — never taken from `?redirect=` query params.
5. **LLM/site mutations** only through `applyAction` + selector whitelist + HTML sanitizer.
6. **HTTPS only** in production (GitHub Pages / DO terminate TLS).

## Client hardenings in code

- HTML sanitizer strips scripts, iframes, event handlers, `javascript:` / `data:` URLs, inline styles on mutate.
- Profile saves are **field-allowlisted**; avatar URLs must be http(s).
- Avatar render uses `createElement('img')` + validated URL, not string-built HTML.
- Supabase client pinned version + PKCE flow.
- Auth UI shows closed state when config is empty (no half-connected mode with broken keys).

## Headers (set on DigitalOcean / CDN when you leave GitHub Pages)

```
Content-Security-Policy: default-src 'self'; script-src 'self' https://esm.sh; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co https://esm.sh; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: microphone=(), camera=(), geolocation=(self)
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

Tune `connect-src` for Open-Meteo, Stripe.js, or music CDNs you actually use.  
GitHub Pages cannot set full CSP; use a meta CSP only as a weak partial measure, or move to DO/nginx.

## Auth / membership

- Email confirmation on in production.
- Minimum password length ≥ 8 (enforce in Supabase Auth settings).
- Profiles: users read/update **own row** only unless you explicitly publish public profile policy.
- Stripe: checkout + portal + webhooks via Edge Functions; client only receives session URLs.
- Tier is stored server-side; never trust the badge text alone for paid gates.

## Living-site agent

- Analytics beacons: prefer first-party, aggregated, no full IP in client storage.
- Agent may only emit actions in the documented schema; server should validate before broadcast.
- Presence audio: no microphone permission; only playback of server-provided speech/music URLs (https).

## Incident basics

- Rotate anon key only if leaked **with** a bad RLS policy; rotate service_role immediately if exposed.
- Revoke Stripe keys in dashboard if committed by mistake.
- If `director.html` was public, treat any period online as untrusted DOM for that origin; remove and purge cache.

## Review cadence

Before each public launch: empty secret grep, RLS policies, redirect allow-list, director absent, dependency pin for supabase-js.
