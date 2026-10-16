/**
 * Auth badge + modal. Signup includes up to N section tags (rooms).
 * Offline: "Preview member" uses local mock so Threshold can be tested pre-Supabase.
 */
import {
  signUp,
  signIn,
  signOut,
  signInWithOAuth,
  getCurrentUser,
  getCurrentTier,
  getProfile,
  saveProfile,
  startCheckout,
  openBillingPortal,
  authReady,
} from './haylynn-auth.js';
import { AUTH_CONFIG } from './auth-config.js';
import { MEMBERS_CONFIG, tagSlotsForTier } from './members-config.js';
import {
  loadMockMember,
  saveMockMember,
  saveLocalTags,
  clampTags,
} from './haylynn-member-session.js';

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
      position: fixed; top: 1rem; left: 1rem; z-index: 50;
      font-family: 'Space Mono', monospace; font-size: 0.55rem;
      letter-spacing: 0.1em; text-transform: uppercase;
      color: var(--ink-dim, #9a92a4);
      border: 1px solid rgba(255,255,255,0.15); border-radius: 20px;
      padding: 0.4rem 0.75rem; cursor: pointer;
      background: rgba(6,5,12,0.72); backdrop-filter: blur(8px);
      max-width: min(46vw, 11rem);
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
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
      width: 100%; max-width: 420px; max-height: min(92vh, 640px);
      overflow: auto; padding: 1.75rem 1.4rem 1.5rem;
      background: #0a0812; border: 1px solid rgba(138,92,240,0.3);
      border-radius: 14px; color: var(--ink, #efe9e0);
    }
    .auth-card h2 {
      font-family: 'Cormorant Garamond', serif; font-weight: 400;
      font-size: 1.55rem; margin: 0 0 0.35rem;
    }
    .auth-card .sub {
      font-family: 'Space Mono', monospace; font-size: 0.58rem;
      letter-spacing: 0.06em; color: var(--ink-dim, #9a92a4);
      margin: 0 0 1.1rem; line-height: 1.5;
    }
    .auth-card label {
      display: block; font-family: 'Space Mono', monospace;
      font-size: 0.55rem; letter-spacing: 0.12em; text-transform: uppercase;
      color: var(--ink-dim, #9a92a4); margin: 0.75rem 0 0.35rem;
    }
    .auth-card input[type="email"],
    .auth-card input[type="password"],
    .auth-card input[type="text"] {
      width: 100%; box-sizing: border-box;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.12); border-radius: 8px;
      color: var(--ink, #efe9e0); padding: 0.55rem 0.65rem;
      font-family: inherit; font-size: 0.85rem;
    }
    .auth-tag-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem;
      margin: 0.35rem 0 0.5rem;
    }
    .auth-tag {
      text-align: left; cursor: pointer;
      border: 1px solid rgba(255,255,255,0.12); border-radius: 8px;
      background: rgba(255,255,255,0.03); padding: 0.45rem 0.5rem;
      color: var(--ink-dim, #9a92a4); font-size: 0.62rem; line-height: 1.35;
    }
    .auth-tag strong {
      display: block; font-family: 'Space Mono', monospace;
      font-size: 0.52rem; letter-spacing: 0.08em; text-transform: uppercase;
      color: var(--ink, #efe9e0); margin-bottom: 0.15rem;
    }
    .auth-tag.on {
      border-color: rgba(53,201,143,0.55);
      background: rgba(53,201,143,0.08);
      color: var(--ink, #efe9e0);
    }
    .auth-tag-count {
      font-family: 'Space Mono', monospace; font-size: 0.52rem;
      color: var(--ink-dim, #9a92a4); margin-bottom: 0.25rem;
    }
    .auth-actions { display: flex; flex-wrap: wrap; gap: 0.45rem; margin-top: 1rem; }
    .auth-btn {
      font-family: 'Space Mono', monospace; font-size: 0.58rem;
      letter-spacing: 0.1em; text-transform: uppercase;
      border-radius: 999px; padding: 0.55rem 0.9rem; cursor: pointer;
      border: 1px solid rgba(255,255,255,0.18); background: transparent;
      color: var(--ink, #efe9e0);
    }
    .auth-btn.primary {
      border-color: rgba(53,201,143,0.5); color: #35c98f;
      background: rgba(53,201,143,0.1);
    }
    .auth-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .auth-error {
      font-family: 'Space Mono', monospace; font-size: 0.58rem;
      color: #ec5aa0; min-height: 1.1em; margin-top: 0.5rem;
    }
    .auth-switch {
      margin-top: 0.85rem; background: none; border: none;
      color: var(--ink-dim, #9a92a4); cursor: pointer;
      font-family: 'Space Mono', monospace; font-size: 0.55rem;
      letter-spacing: 0.06em; text-decoration: underline;
    }
    .auth-close {
      float: right; background: none; border: none; color: var(--ink-dim);
      cursor: pointer; font-size: 1rem; line-height: 1;
    }
  `;
  document.head.appendChild(style);
}

function tagPickerHtml(selected, slots) {
  const sel = new Set(selected || []);
  const cards = MEMBERS_CONFIG.sections
    .map((s) => {
      const on = sel.has(s.id) ? 'on' : '';
      return `<button type="button" class="auth-tag ${on}" data-tag="${s.id}" aria-pressed="${on ? 'true' : 'false'}">
        <strong>${s.label}</strong>${s.perkLine}
      </button>`;
    })
    .join('');
  return `
    <div class="auth-tag-count"><span data-role="tag-count">${sel.size}</span> / ${slots} rooms</div>
    <div class="auth-tag-grid">${cards}</div>
  `;
}

export async function initAuthUI() {
  injectStyles();

  let badge = document.getElementById('auth-badge');
  if (!badge) {
    badge = document.createElement('button');
    badge.id = 'auth-badge';
    badge.type = 'button';
    document.body.appendChild(badge);
  }

  let modal = document.getElementById('auth-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'auth-modal';
    modal.innerHTML = `<div class="auth-card" data-role="auth-card"></div>`;
    document.body.appendChild(modal);
  }
  const card = modal.querySelector('[data-role="auth-card"]');

  let mode = 'signin'; // signin | signup
  let selectedTags = [];

  function slots() {
    return tagSlotsForTier('free');
  }

  function renderCard() {
    const offline = !authReady;
    if (mode === 'signup') {
      card.innerHTML = `
        <button type="button" class="auth-close" data-role="auth-close" aria-label="Close">×</button>
        <h2>Create account</h2>
        <p class="sub">Choose up to ${slots()} rooms. Membership perks follow those rooms — Cosmic Decay only if you tag it.</p>
        ${
          offline
            ? `<p class="sub">Accounts are not connected yet. Use <strong style="color:var(--ink)">Preview member</strong> to walk the full Threshold with your tags.</p>`
            : ''
        }
        <label>Email</label>
        <input type="email" id="auth-email" autocomplete="email" ${offline ? 'disabled' : ''} />
        <label>Password</label>
        <input type="password" id="auth-password" autocomplete="new-password" ${offline ? 'disabled' : ''} />
        <label>Your rooms</label>
        ${tagPickerHtml(selectedTags, slots())}
        <div class="auth-error" id="auth-error"></div>
        <div class="auth-actions">
          ${
            offline
              ? `<button type="button" class="auth-btn primary" data-role="auth-preview">Preview member</button>`
              : `<button type="button" class="auth-btn primary" data-role="auth-submit">Sign up</button>`
          }
          <button type="button" class="auth-btn" data-role="auth-cancel">Close</button>
        </div>
        <button type="button" class="auth-switch" data-role="auth-switch">Already have one? Sign in</button>
      `;
    } else {
      card.innerHTML = `
        <button type="button" class="auth-close" data-role="auth-close" aria-label="Close">×</button>
        <h2>Sign in</h2>
        <p class="sub">${
          offline
            ? 'Live sign-in opens when the house connects accounts. Preview a member path below.'
            : 'Return to your rooms in the house.'
        }</p>
        <label>Email</label>
        <input type="email" id="auth-email" autocomplete="email" ${offline ? 'disabled' : ''} />
        <label>Password</label>
        <input type="password" id="auth-password" autocomplete="current-password" ${offline ? 'disabled' : ''} />
        <div class="auth-error" id="auth-error"></div>
        <div class="auth-actions">
          ${
            offline
              ? `<button type="button" class="auth-btn primary" data-role="auth-preview">Preview member</button>`
              : `<button type="button" class="auth-btn primary" data-role="auth-submit">Sign in</button>`
          }
          <button type="button" class="auth-btn" data-role="auth-cancel">Close</button>
        </div>
        <button type="button" class="auth-switch" data-role="auth-switch">Need an account? Sign up</button>
      `;
    }
    bindCard();
  }

  function bindCard() {
    card.querySelector('[data-role="auth-close"]')?.addEventListener('click', () => modal.classList.remove('open'));
    card.querySelector('[data-role="auth-cancel"]')?.addEventListener('click', () => modal.classList.remove('open'));
    card.querySelector('[data-role="auth-switch"]')?.addEventListener('click', () => {
      mode = mode === 'signin' ? 'signup' : 'signin';
      renderCard();
    });

    card.querySelectorAll('[data-tag]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-tag');
        const max = slots();
        if (selectedTags.includes(id)) {
          selectedTags = selectedTags.filter((t) => t !== id);
        } else if (selectedTags.length < max) {
          selectedTags = [...selectedTags, id];
        }
        selectedTags = clampTags(selectedTags, 'free');
        const countEl = card.querySelector('[data-role="tag-count"]');
        if (countEl) countEl.textContent = String(selectedTags.length);
        card.querySelectorAll('[data-tag]').forEach((b) => {
          const on = selectedTags.includes(b.getAttribute('data-tag'));
          b.classList.toggle('on', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
      });
    });

    card.querySelector('[data-role="auth-preview"]')?.addEventListener('click', () => {
      const tags = clampTags(selectedTags.length ? selectedTags : ['chronicle', 'haylynn', 'home'], 'free');
      saveLocalTags(tags);
      saveMockMember({
        active: true,
        id: 'mock-local',
        email: 'preview@local',
        display_name: 'Preview member',
        tier: 'free',
        section_tags: tags,
      });
      modal.classList.remove('open');
      window.dispatchEvent(new CustomEvent('haylynn:auth'));
      refreshBadge();
    });

    card.querySelector('[data-role="auth-submit"]')?.addEventListener('click', async () => {
      const errorEl = card.querySelector('#auth-error');
      if (errorEl) errorEl.textContent = '';
      const email = card.querySelector('#auth-email')?.value?.trim() || '';
      const password = card.querySelector('#auth-password')?.value || '';
      if (mode === 'signup') {
        if (selectedTags.length < 1) {
          if (errorEl) errorEl.textContent = 'Tag at least one room.';
          return;
        }
        const { error } = await signUp(email, password);
        if (error) {
          if (errorEl) errorEl.textContent = error.message;
          return;
        }
        const tags = clampTags(selectedTags, 'free');
        saveLocalTags(tags);
        try {
          await saveProfile({ section_tags: tags });
        } catch {
          /* profile row may lag trigger; tags kept locally until next save */
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          if (errorEl) errorEl.textContent = error.message;
          return;
        }
      }
      modal.classList.remove('open');
      window.dispatchEvent(new CustomEvent('haylynn:auth'));
      refreshBadge();
    });
  }

  async function refreshBadge() {
    const mock = loadMockMember();
    if (mock?.active) {
      badge.textContent = mock.display_name || 'Member';
      badge.onclick = () => {
        if (confirm('End preview session?')) {
          saveMockMember(null);
          window.dispatchEvent(new CustomEvent('haylynn:auth'));
          refreshBadge();
        }
      };
      return;
    }
    if (!authReady) {
      badge.textContent = 'Account';
      badge.onclick = () => {
        mode = 'signup';
        renderCard();
        modal.classList.add('open');
      };
      return;
    }
    const user = await getCurrentUser();
    if (!user) {
      badge.textContent = 'Sign in';
      badge.onclick = () => {
        mode = 'signin';
        renderCard();
        modal.classList.add('open');
      };
      return;
    }
    const tier = await getCurrentTier();
    const label = AUTH_CONFIG.tiers?.[tier]?.label || 'Member';
    badge.textContent = label;
    badge.onclick = async () => {
      if (confirm('Sign out?')) {
        await signOut();
        window.dispatchEvent(new CustomEvent('haylynn:auth'));
        refreshBadge();
      }
    };
  }

  await refreshBadge();
  window.addEventListener('haylynn:auth', () => refreshBadge());
}

export { startCheckout, openBillingPortal, getCurrentTier };
