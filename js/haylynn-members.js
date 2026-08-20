/**
 * Haylynn Threshold — members section surface
 * Uses haylynn-auth when configured; otherwise on-brand holding + demo skin.
 */

import { AUTH_CONFIG } from './auth-config.js';
import {
  authReady,
  getCurrentUser,
  getCurrentTier,
  getProfile,
  saveProfile,
  startCheckout,
  openBillingPortal,
} from './haylynn-auth.js';
import { injectThemeStyles, renderProfileCard } from './haylynn-theme.js';
import { MEMBERS_CONFIG } from './members-config.js';

const STYLE = `
.hy-threshold {
  margin-top: 0.4rem;
  padding: 1.1rem 1.15rem 1.25rem;
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
  display: flex; align-items: center; gap: 0.45rem;
}
.hy-threshold .th-kicker .pip {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--purple, #8a5cf0); opacity: 0.75;
}
.hy-threshold.is-live .th-kicker .pip {
  background: var(--green, #35c98f); opacity: 1;
  box-shadow: 0 0 10px rgba(53,201,143,0.45);
}
.hy-threshold .th-title {
  font-style: italic; font-size: 1.2rem; color: var(--ink, #efe9e0);
  margin-bottom: 0.35rem;
}
.hy-threshold .th-body {
  font-size: 0.92rem; color: var(--ink-dim, #9a92a4);
  line-height: 1.5; margin-bottom: 0.75rem;
}
.hy-threshold .th-status {
  font-family: 'Space Mono', monospace; font-size: 0.52rem;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--ink-dim, #9a92a4); margin-bottom: 1rem;
}
.hy-threshold .th-profile {
  display: grid; grid-template-columns: 72px 1fr; gap: 0.9rem;
  align-items: start; margin-bottom: 1rem; padding: 0.85rem;
  border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);
  background: rgba(0,0,0,0.2);
}
.hy-threshold .th-avatar {
  width: 72px; height: 72px; border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.12);
  background: radial-gradient(circle at 40% 35%, rgba(138,92,240,0.35), transparent 55%), rgba(255,255,255,0.04);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Space Mono', monospace; font-size: 0.5rem;
  color: var(--ink-dim, #9a92a4); overflow: hidden;
}
.hy-threshold .th-avatar img { width: 100%; height: 100%; object-fit: cover; }
.hy-threshold .th-fields label {
  display: block; font-family: 'Space Mono', monospace; font-size: 0.48rem;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--ink-dim, #9a92a4); margin: 0.4rem 0 0.2rem;
}
.hy-threshold .th-fields label:first-child { margin-top: 0; }
.hy-threshold .th-fields input,
.hy-threshold .th-fields textarea {
  width: 100%; background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.12); border-radius: 8px;
  color: var(--ink, #efe9e0); font-family: 'Cormorant Garamond', serif;
  font-size: 0.95rem; padding: 0.4rem 0.55rem;
}
.hy-threshold .th-fields textarea { min-height: 56px; resize: vertical; }
.hy-threshold .th-fields input:disabled,
.hy-threshold .th-fields textarea:disabled { opacity: 0.5; }
.hy-threshold .th-actions { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.hy-threshold .th-btn {
  font-family: 'Space Mono', monospace; font-size: 0.5rem;
  letter-spacing: 0.1em; text-transform: uppercase;
  padding: 0.5rem 0.8rem; border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.16);
  background: rgba(255,255,255,0.03); color: var(--ink-dim, #9a92a4);
  cursor: pointer;
}
.hy-threshold .th-btn:disabled { opacity: 0.35; cursor: default; }
.hy-threshold .th-btn.primary {
  border-color: rgba(53,201,143,0.4); color: var(--green, #35c98f);
}
.hy-threshold .th-tiers { margin-top: 0.9rem; display: grid; gap: 0.4rem; }
.hy-threshold .th-tier {
  padding: 0.55rem 0.65rem; border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.08);
  font-size: 0.88rem; color: var(--ink-dim, #9a92a4); line-height: 1.4;
}
.hy-threshold .th-tier strong {
  font-style: italic; font-weight: 400; color: var(--ink, #efe9e0);
  display: block; margin-bottom: 0.12rem;
}
.hy-threshold .th-tier.is-current {
  border-color: rgba(53,201,143,0.35);
}
.hy-threshold-face {
  display: inline-flex; align-items: center; gap: 0.4rem;
  margin-top: 0.75rem; font-family: 'Space Mono', monospace;
  font-size: 0.52rem; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--ink-dim, #9a92a4);
}
.hy-threshold-face .pip {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--purple, #8a5cf0); opacity: 0.8;
}
`;

function injectStyle() {
  if (document.getElementById('hy-threshold-style')) return;
  const s = document.createElement('style');
  s.id = 'hy-threshold-style';
  s.textContent = STYLE;
  document.head.appendChild(s);
}

function setEnabled(root, on) {
  root.querySelectorAll('input, textarea, button[data-role="th-action"]').forEach((el) => {
    if (el.dataset.alwaysOn === '1') return;
    el.disabled = !on;
  });
}

async function refreshRoot(root) {
  const statusEl = root.querySelector('[data-role="th-status"]');
  const titleEl = root.querySelector('[data-role="th-title"]');
  const nameInput = root.querySelector('[data-role="th-name"]');
  const handleInput = root.querySelector('[data-role="th-handle"]');
  const bioInput = root.querySelector('[data-role="th-bio"]');
  const linksInput = root.querySelector('[data-role="th-links"]');
  const avatarEl = root.querySelector('[data-role="th-avatar"]');
  const preview = root.querySelector('[data-role="theme-preview"]');

  root.classList.toggle('is-live', authReady);

  if (!authReady) {
    if (statusEl) statusEl.textContent = 'The door is drawn. The lock is not yet set in the world.';
    setEnabled(root, false);
    // Sign-in opener still works via badge; enable "open door" button
    root.querySelectorAll('[data-action="signin"]').forEach((b) => {
      b.disabled = false;
      b.dataset.alwaysOn = '1';
    });
    if (preview) {
      renderProfileCard(preview, {
        display_name: 'Example presence',
        handle: 'koru',
        bio: 'A place in the house — likeness and links, skinned once at the door.',
        links: [{ label: 'World', url: '/' }],
        theme_config: MEMBERS_CONFIG.demoTheme,
      });
    }
    return;
  }

  const user = await getCurrentUser();
  if (!user) {
    if (statusEl) statusEl.textContent = 'Sign in to step through';
    if (titleEl) titleEl.textContent = 'Threshold';
    setEnabled(root, false);
    root.querySelectorAll('[data-action="signin"]').forEach((b) => {
      b.disabled = false;
      b.dataset.alwaysOn = '1';
    });
    return;
  }

  setEnabled(root, true);
  const tier = await getCurrentTier();
  const profile = await getProfile();
  if (statusEl) {
    statusEl.textContent =
      tier === 'patron' ? 'Patron' : tier === 'supporter' ? 'Supporter' : 'Signed in · Visitor';
  }

  if (profile) {
    if (nameInput) nameInput.value = profile.display_name || '';
    if (handleInput) handleInput.value = profile.handle || '';
    if (bioInput) bioInput.value = profile.bio || '';
    if (linksInput && Array.isArray(profile.links)) {
      linksInput.value = profile.links
        .map((l) => (typeof l === 'string' ? l : l.url || ''))
        .filter(Boolean)
        .join('\n');
    }
    if (avatarEl && profile.avatar_url) {
      avatarEl.innerHTML = `<img src="${profile.avatar_url}" alt="">`;
    }
    if (preview) {
      renderProfileCard(preview, {
        display_name: profile.display_name || user.email?.split('@')[0],
        handle: profile.handle,
        bio: profile.bio,
        links: profile.links,
        avatar_url: profile.avatar_url,
        theme_config: profile.theme_config || MEMBERS_CONFIG.demoTheme,
      });
    }
  }

  root.querySelectorAll('.th-tier').forEach((el) => {
    el.classList.toggle('is-current', el.dataset.tier === tier);
  });
}

function bindRoot(root) {
  root.querySelectorAll('[data-role="th-action"]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const action = btn.dataset.action;
      const statusEl = root.querySelector('[data-role="th-status"]');
      try {
        if (action === 'signin') {
          window.HaylynnAuth?.openModal?.();
          return;
        }
        if (action === 'save') {
          const links = (root.querySelector('[data-role="th-links"]')?.value || '')
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean)
            .map((url) => ({ url }));
          await saveProfile({
            display_name: root.querySelector('[data-role="th-name"]')?.value || null,
            handle: root.querySelector('[data-role="th-handle"]')?.value || null,
            bio: root.querySelector('[data-role="th-bio"]')?.value || null,
            links,
          });
          if (statusEl) statusEl.textContent = 'Profile held';
          await refreshRoot(root);
        }
        if (action === 'checkout-supporter') {
          const id = AUTH_CONFIG.prices.supporter;
          if (!id) throw new Error('Supporter price not configured');
          await startCheckout(id);
        }
        if (action === 'checkout-patron') {
          const id = AUTH_CONFIG.prices.patron;
          if (!id) throw new Error('Patron price not configured');
          await startCheckout(id);
        }
        if (action === 'portal') {
          await openBillingPortal();
        }
      } catch (e) {
        if (statusEl) statusEl.textContent = e.message || 'The door did not answer';
      }
    });
  });

  refreshRoot(root);
  window.addEventListener('haylynn:auth', () => refreshRoot(root));
}

export function initHaylynnMembers() {
  injectStyle();
  injectThemeStyles();

  document.querySelectorAll('[data-role="threshold-face"]').forEach((el) => {
    el.classList.add('hy-threshold-face');
    el.innerHTML = `<span class="pip"></span>${authReady ? 'Threshold' : 'Threshold · quiet'}`;
  });

  document.querySelectorAll('[data-role="threshold-root"]').forEach(bindRoot);
}
