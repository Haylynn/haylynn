/**
 * Haylynn Auth UI — fixed badge + modal (site-matched).
 * Call initAuthUI() once from bootstrap.
 */

import {
  signUp,
  signIn,
  signOut,
  signInWithOAuth,
  getCurrentUser,
  getCurrentTier,
  startCheckout,
  openBillingPortal,
  authReady,
} from './haylynn-auth.js';
import { AUTH_CONFIG } from './auth-config.js';

const TIER_LABELS = {
  free: AUTH_CONFIG.tiers.free.label,
  supporter: AUTH_CONFIG.tiers.supporter.label,
  patron: AUTH_CONFIG.tiers.patron.label,
};

const OAUTH_PROVIDERS = [
  { id: 'google', label: 'Continue with Google' },
  { id: 'discord', label: 'Continue with Discord' },
];

function injectStyles() {
  if (document.getElementById('hy-auth-style')) return;
  const style = document.createElement('style');
  style.id = 'hy-auth-style';
  style.textContent = `
    #auth-badge {
      position: fixed; top: 1rem; right: 1rem; z-index: 50;
      font-family: 'Space Mono', monospace; font-size: 0.58rem;
      letter-spacing: 0.1em; text-transform: uppercase;
      color: var(--ink-dim, #9a92a4);
      border: 1px solid rgba(255,255,255,0.15); border-radius: 20px;
      padding: 0.45rem 0.9rem; cursor: pointer;
      background: rgba(6,5,12,0.72); backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }
    #auth-badge:hover { color: var(--ink, #efe9e0); border-color: rgba(138,92,240,0.45); }
    #auth-modal {
      position: fixed; inset: 0; z-index: 100;
      background: rgba(6,5,12,0.92); backdrop-filter: blur(10px);
      display: none; align-items: center; justify-content: center;
      padding: 1rem;
    }
    #auth-modal.open { display: flex; }
    .auth-card {
      width: 100%; max-width: 340px; padding: 2rem 1.6rem;
      background: #0a0812; border: 1px solid rgba(138,92,240,0.3);
      border-radius: 14px; text-align: center;
      font-family: 'Cormorant Garamond', serif; color: var(--ink, #efe9e0);
    }
    .auth-card h2 {
      font-style: italic; font-weight: 300; font-size: 1.55rem;
      margin-bottom: 1.1rem; color: var(--purple, #8a5cf0);
    }
    .auth-card input {
      width: 100%; margin-bottom: 0.75rem; padding: 0.65rem 0.8rem;
      background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.15);
      border-radius: 8px; color: var(--ink, #efe9e0);
      font-family: 'Space Mono', monospace; font-size: 0.8rem;
    }
    .auth-card .auth-primary {
      width: 100%; padding: 0.7rem; margin-top: 0.25rem;
      background: rgba(138,92,240,0.15); border: 1px solid var(--purple, #8a5cf0);
      border-radius: 20px; color: var(--ink, #efe9e0);
      font-family: 'Space Mono', monospace; font-size: 0.62rem;
      letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer;
    }
    .auth-card .auth-primary:hover { background: rgba(138,92,240,0.28); }
    .auth-switch, .auth-close {
      margin-top: 0.85rem; font-family: 'Space Mono', monospace; font-size: 0.58rem;
      color: var(--ink-dim, #9a92a4); cursor: pointer;
    }
    .auth-error {
      margin-top: 0.75rem; font-family: 'Space Mono', monospace; font-size: 0.58rem;
      color: var(--pink, #ec5aa0); min-height: 1em;
    }
    .oauth-row { display: flex; flex-direction: column; gap: 0.45rem; margin-bottom: 0.25rem; }
    .oauth-btn {
      width: 100%; padding: 0.6rem;
      background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.15);
      border-radius: 8px; color: var(--ink, #efe9e0);
      font-family: 'Space Mono', monospace; font-size: 0.62rem; letter-spacing: 0.04em;
      cursor: pointer;
    }
    .oauth-btn:hover { background: rgba(255,255,255,0.08); }
    .oauth-divider {
      display: flex; align-items: center; gap: 0.7rem; margin: 0.9rem 0;
      font-family: 'Space Mono', monospace; font-size: 0.52rem;
      color: var(--ink-dim, #9a92a4); text-transform: uppercase; letter-spacing: 0.1em;
    }
    .oauth-divider::before, .oauth-divider::after {
      content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.1);
    }
    .auth-note {
      font-family: 'Space Mono', monospace; font-size: 0.52rem;
      color: var(--ink-dim, #9a92a4); margin-bottom: 1rem; line-height: 1.4;
    }
  `;
  document.head.appendChild(style);
}

function renderModal() {
  const oauthButtons = OAUTH_PROVIDERS.map(
    (p) => `<button type="button" class="oauth-btn" data-provider="${p.id}">${p.label}</button>`
  ).join('');

  const modal = document.createElement('div');
  modal.id = 'auth-modal';
  modal.innerHTML = `
    <div class="auth-card" role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <h2 id="auth-title">Sign In</h2>
      <p class="auth-note" id="auth-note"></p>
      <div class="oauth-row">${oauthButtons}</div>
      <div class="oauth-divider">or</div>
      <input type="email" id="auth-email" placeholder="Email" autocomplete="email">
      <input type="password" id="auth-password" placeholder="Password" autocomplete="current-password">
      <button type="button" class="auth-primary" id="auth-submit">Sign In</button>
      <div class="auth-error" id="auth-error"></div>
      <div class="auth-switch" id="auth-switch">Need an account? Sign up</div>
      <div class="auth-close" id="auth-close">Close</div>
    </div>`;
  document.body.appendChild(modal);

  modal.querySelectorAll('.oauth-btn').forEach((btn) => {
    btn.onclick = async () => {
      const errEl = document.getElementById('auth-error');
      try {
        await signInWithOAuth(btn.dataset.provider);
      } catch (e) {
        errEl.textContent = e.message || 'OAuth failed';
      }
    };
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });

  return modal;
}

export async function initAuthUI() {
  injectStyles();

  const badge = document.createElement('button');
  badge.type = 'button';
  badge.id = 'auth-badge';
  badge.textContent = authReady ? 'Sign In' : 'Threshold · quiet';
  document.body.appendChild(badge);

  const modal = renderModal();
  let mode = 'signin';

  const note = document.getElementById('auth-note');
  if (!authReady) {
    note.textContent = 'The lock is not yet set — auth connects when Supabase keys are in place.';
  }

  async function refreshBadge() {
    if (!authReady) {
      badge.textContent = 'Threshold · quiet';
      badge.onclick = () => modal.classList.add('open');
      return;
    }
    const user = await getCurrentUser();
    if (!user) {
      badge.textContent = 'Sign In';
      badge.onclick = () => {
        mode = 'signin';
        syncMode();
        modal.classList.add('open');
      };
      return;
    }
    const tier = await getCurrentTier();
    const short = (user.email || '').split('@')[0] || 'member';
    badge.textContent = `${TIER_LABELS[tier] || 'Visitor'} · ${short}`;
    badge.onclick = async () => {
      if (confirm('Leave the house for now?')) {
        await signOut();
        refreshBadge();
        window.dispatchEvent(new CustomEvent('haylynn:auth'));
      }
    };
  }

  function syncMode() {
    document.getElementById('auth-title').textContent =
      mode === 'signin' ? 'Sign In' : 'Create Account';
    document.getElementById('auth-submit').textContent =
      mode === 'signin' ? 'Sign In' : 'Sign Up';
    document.getElementById('auth-switch').textContent =
      mode === 'signin' ? 'Need an account? Sign up' : 'Already have one? Sign in';
    document.getElementById('auth-error').textContent = '';
  }

  document.getElementById('auth-close').onclick = () => modal.classList.remove('open');
  document.getElementById('auth-switch').onclick = () => {
    mode = mode === 'signin' ? 'signup' : 'signin';
    syncMode();
  };

  document.getElementById('auth-submit').onclick = async () => {
    if (!authReady) {
      document.getElementById('auth-error').textContent = 'Auth is not connected yet.';
      return;
    }
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const errorEl = document.getElementById('auth-error');
    errorEl.textContent = '';
    const { error } =
      mode === 'signin' ? await signIn(email, password) : await signUp(email, password);
    if (error) {
      errorEl.textContent = error.message;
      return;
    }
    modal.classList.remove('open');
    await refreshBadge();
    window.dispatchEvent(new CustomEvent('haylynn:auth'));
  };

  await refreshBadge();

  // Expose for Threshold section buttons
  window.HaylynnAuth = {
    openModal: () => {
      mode = 'signin';
      syncMode();
      modal.classList.add('open');
    },
    refreshBadge,
    startCheckout,
    openBillingPortal,
    getCurrentTier,
  };
}

export { startCheckout, openBillingPortal, getCurrentTier };
