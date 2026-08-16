/**
 * Haylynn Threshold — members surface (frontend shell)
 * Plugs into MEMBERS_CONFIG.apiBase when the backend exists.
 * Until then: on-brand profile / door UI with no fake auth.
 */

import { MEMBERS_CONFIG } from './members-config.js';

const STYLE = `
.hy-threshold {
  margin-top: 1.4rem;
  padding: 1.1rem 1.15rem 1.2rem;
  border-radius: 14px;
  border: 1px solid rgba(138,92,240,0.28);
  background: rgba(138,92,240,0.05);
  text-align: left;
}
.hy-threshold .th-kicker {
  font-family: 'Space Mono', monospace;
  font-size: 0.5rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--purple, #8a5cf0);
  margin-bottom: 0.45rem;
  display: flex;
  align-items: center;
  gap: 0.45rem;
}
.hy-threshold .th-kicker .pip {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--purple, #8a5cf0);
  opacity: 0.75;
  flex: 0 0 auto;
}
.hy-threshold.is-live .th-kicker .pip {
  background: var(--green, #35c98f);
  opacity: 1;
  box-shadow: 0 0 10px rgba(53,201,143,0.45);
}
.hy-threshold .th-title {
  font-style: italic;
  font-size: 1.2rem;
  color: var(--ink, #efe9e0);
  margin-bottom: 0.4rem;
}
.hy-threshold .th-body {
  font-size: 0.92rem;
  color: var(--ink-dim, #9a92a4);
  line-height: 1.5;
  margin-bottom: 0.9rem;
}
.hy-threshold .th-status {
  font-family: 'Space Mono', monospace;
  font-size: 0.52rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-dim, #9a92a4);
  margin-bottom: 1rem;
}
.hy-threshold .th-profile {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 0.9rem;
  align-items: start;
  margin-bottom: 1rem;
  padding: 0.85rem;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(0,0,0,0.2);
}
.hy-threshold .th-avatar {
  width: 72px; height: 72px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.12);
  background:
    radial-gradient(circle at 40% 35%, rgba(138,92,240,0.35), transparent 55%),
    rgba(255,255,255,0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Space Mono', monospace;
  font-size: 0.55rem;
  letter-spacing: 0.06em;
  color: var(--ink-dim, #9a92a4);
  overflow: hidden;
}
.hy-threshold .th-avatar img {
  width: 100%; height: 100%; object-fit: cover;
}
.hy-threshold .th-fields label {
  display: block;
  font-family: 'Space Mono', monospace;
  font-size: 0.48rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-dim, #9a92a4);
  margin: 0.45rem 0 0.2rem;
}
.hy-threshold .th-fields label:first-child { margin-top: 0; }
.hy-threshold .th-fields input,
.hy-threshold .th-fields textarea {
  width: 100%;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  color: var(--ink, #efe9e0);
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.95rem;
  padding: 0.4rem 0.55rem;
}
.hy-threshold .th-fields textarea {
  min-height: 64px;
  resize: vertical;
  line-height: 1.4;
}
.hy-threshold .th-fields input:disabled,
.hy-threshold .th-fields textarea:disabled {
  opacity: 0.55;
  cursor: default;
}
.hy-threshold .th-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}
.hy-threshold .th-btn {
  font-family: 'Space Mono', monospace;
  font-size: 0.52rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.5rem 0.85rem;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.16);
  background: rgba(255,255,255,0.03);
  color: var(--ink-dim, #9a92a4);
  cursor: pointer;
}
.hy-threshold .th-btn:disabled {
  opacity: 0.4;
  cursor: default;
}
.hy-threshold .th-btn.primary {
  border-color: rgba(53,201,143,0.4);
  color: var(--green, #35c98f);
}
.hy-threshold .th-tiers {
  margin-top: 0.9rem;
  display: grid;
  gap: 0.45rem;
}
.hy-threshold .th-tier {
  padding: 0.55rem 0.65rem;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.08);
  font-size: 0.88rem;
  color: var(--ink-dim, #9a92a4);
  line-height: 1.4;
}
.hy-threshold .th-tier strong {
  font-style: italic;
  font-weight: 400;
  color: var(--ink, #efe9e0);
  display: block;
  margin-bottom: 0.15rem;
}
.hy-threshold-face {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.85rem;
  font-family: 'Space Mono', monospace;
  font-size: 0.52rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-dim, #9a92a4);
}
.hy-threshold-face .pip {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--purple, #8a5cf0);
  opacity: 0.8;
}
`;

function injectStyle() {
  if (document.getElementById('hy-threshold-style')) return;
  const s = document.createElement('style');
  s.id = 'hy-threshold-style';
  s.textContent = STYLE;
  document.head.appendChild(s);
}

function apiUrl(path) {
  const base = (MEMBERS_CONFIG.apiBase || '').replace(/\/$/, '');
  if (!base) return '';
  return base + path;
}

async function fetchSession() {
  const url = apiUrl(MEMBERS_CONFIG.endpoints.session);
  if (!url) return null;
  try {
    const res = await fetch(url, { credentials: 'include', cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (_) {
    return null;
  }
}

function bindRoot(root) {
  const live = Boolean(MEMBERS_CONFIG.apiBase);
  root.classList.toggle('is-live', live);
  root.classList.toggle('is-holding', !live);

  const titleEl = root.querySelector('[data-role="th-title"]');
  const bodyEl = root.querySelector('[data-role="th-body"]');
  const statusEl = root.querySelector('[data-role="th-status"]');
  const nameInput = root.querySelector('[data-role="th-name"]');
  const handleInput = root.querySelector('[data-role="th-handle"]');
  const bioInput = root.querySelector('[data-role="th-bio"]');
  const linksInput = root.querySelector('[data-role="th-links"]');
  const avatarEl = root.querySelector('[data-role="th-avatar"]');
  const btns = root.querySelectorAll('[data-role="th-action"]');

  if (!live) {
    if (titleEl) titleEl.textContent = MEMBERS_CONFIG.holding.title;
    if (bodyEl) bodyEl.textContent = MEMBERS_CONFIG.holding.line;
    if (statusEl) statusEl.textContent = MEMBERS_CONFIG.holding.status;
    root.querySelectorAll('input, textarea, button').forEach(el => {
      el.disabled = true;
    });
    return;
  }

  if (statusEl) statusEl.textContent = 'Connected to the house';
  root.querySelectorAll('input, textarea, button').forEach(el => {
    el.disabled = false;
  });

  fetchSession().then(session => {
    if (!session) {
      if (statusEl) statusEl.textContent = 'Sign in to step through';
      return;
    }
    if (statusEl) statusEl.textContent = session.tier === 'member' ? 'Member' : 'Signed in';
    if (nameInput && session.display_name) nameInput.value = session.display_name;
    if (handleInput && session.handle) handleInput.value = session.handle;
    if (bioInput && session.bio) bioInput.value = session.bio;
    if (linksInput && Array.isArray(session.links)) {
      linksInput.value = session.links.map(l => l.url || l).join('\n');
    }
    if (avatarEl && session.avatar_url) {
      avatarEl.innerHTML = `<img src="${session.avatar_url}" alt="">`;
    }
  });

  btns.forEach(btn => {
    const action = btn.dataset.action;
    btn.addEventListener('click', async () => {
      if (!live) return;
      try {
        if (action === 'magic') {
          const email = root.querySelector('[data-role="th-email"]')?.value?.trim();
          if (!email) return;
          await fetch(apiUrl(MEMBERS_CONFIG.endpoints.magicLink), {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });
          if (statusEl) statusEl.textContent = 'Check your post for a key';
        }
        if (action === 'save') {
          await fetch(apiUrl(MEMBERS_CONFIG.endpoints.profile), {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              display_name: nameInput?.value,
              handle: handleInput?.value,
              bio: bioInput?.value,
              links: (linksInput?.value || '').split('\n').map(s => s.trim()).filter(Boolean)
            })
          });
          if (statusEl) statusEl.textContent = 'Profile held';
        }
        if (action === 'checkout') {
          const res = await fetch(apiUrl(MEMBERS_CONFIG.endpoints.checkout), {
            method: 'POST',
            credentials: 'include'
          });
          const data = await res.json();
          if (data.url) window.location.href = data.url;
        }
        if (action === 'portal') {
          const res = await fetch(apiUrl(MEMBERS_CONFIG.endpoints.portal), {
            method: 'POST',
            credentials: 'include'
          });
          const data = await res.json();
          if (data.url) window.location.href = data.url;
        }
      } catch (err) {
        console.warn('[haylynn-members]', err);
        if (statusEl) statusEl.textContent = 'The door did not answer';
      }
    });
  });

  const fileInput = root.querySelector('[data-role="th-avatar-file"]');
  if (fileInput) {
    fileInput.addEventListener('change', async () => {
      const file = fileInput.files?.[0];
      if (!file || !live) return;
      const body = new FormData();
      body.append('avatar', file);
      try {
        const res = await fetch(apiUrl(MEMBERS_CONFIG.endpoints.avatar), {
          method: 'POST',
          credentials: 'include',
          body
        });
        const data = await res.json();
        if (data.avatar_url && avatarEl) {
          avatarEl.innerHTML = `<img src="${data.avatar_url}" alt="">`;
        }
      } catch (err) {
        console.warn('[haylynn-members:avatar]', err);
      }
    });
  }
}

export function initHaylynnMembers() {
  injectStyle();

  document.querySelectorAll('[data-role="threshold-face"]').forEach(el => {
    el.classList.add('hy-threshold-face');
    const live = Boolean(MEMBERS_CONFIG.apiBase);
    el.innerHTML = `<span class="pip"></span>${live ? 'Threshold' : 'Threshold · quiet'}`;
  });

  document.querySelectorAll('[data-role="threshold-root"]').forEach(bindRoot);
}
