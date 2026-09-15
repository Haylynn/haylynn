/**
 * Threshold — full membership space shell.
 * When auth is offline: closed, visitor-safe.
 * When signed in: identity, tier, Cosmic Decay, draws, inventory, stats, wallet.
 * Backend tables fill these panels; UI is structured to receive them.
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
  supabase,
} from './haylynn-auth.js';
import { injectThemeStyles, renderProfileCard } from './haylynn-theme.js';
import { MEMBERS_CONFIG } from './members-config.js';
import { loadAdventureProgress, ADVENTURE_NODES } from './haylynn-adventure.js';

function safeHttpUrl(url) {
  if (!url || typeof url !== 'string') return null;
  try {
    const u = new URL(url, window.location.origin);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
    if (/[<>"']/.test(url)) return null;
    return u.href;
  } catch {
    return null;
  }
}

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Short public-looking id from uuid (not sequential until backend issues account_no). */
function formatAccountRef(user, profile) {
  if (profile?.account_no != null) return String(profile.account_no).padStart(6, '0');
  if (!user?.id) return '—';
  return user.id.replace(/-/g, '').slice(0, 8).toUpperCase();
}

const TIER_BENEFITS = {
  free: [
    'Full public scroll',
    'Draw (local history on this device)',
    'Cosmic Decay — first steps',
    'Threshold identity when signed in',
  ],
  supporter: [
    'Everything in Visitor',
    'Cloud-synced draw history',
    'Cosmic Decay progress saved',
    'Inventory & path flags',
    'Profile theme skin',
  ],
  patron: [
    'Everything in Supporter',
    'Deepest path doors',
    'Early rooms and experiments',
    'Priority patronage mark',
  ],
};

const STYLE = `
.hy-threshold {
  margin-top: 0.4rem; padding: 1.1rem 1.15rem 1.25rem;
  border-radius: 14px; border: 1px solid rgba(138,92,240,0.28);
  background: rgba(138,92,240,0.05); text-align: left;
  max-width: 36rem;
}
.hy-threshold.is-live { border-color: rgba(53,201,143,0.35); }
.hy-threshold .th-kicker {
  font-family: 'Space Mono', monospace; font-size: 0.5rem;
  letter-spacing: 0.14em; text-transform: uppercase; color: var(--purple, #8a5cf0);
  margin-bottom: 0.45rem; display: flex; align-items: center; gap: 0.45rem;
}
.hy-threshold .th-kicker .pip {
  width: 7px; height: 7px; border-radius: 50%; background: var(--purple, #8a5cf0); opacity: 0.75;
}
.hy-threshold.is-live .th-kicker .pip {
  background: var(--green, #35c98f); opacity: 1;
  box-shadow: 0 0 10px rgba(53,201,143,0.45);
}
.hy-threshold .th-title {
  font-style: italic; font-size: 1.25rem; color: var(--ink, #efe9e0); margin-bottom: 0.25rem;
}
.hy-threshold .th-status {
  font-family: 'Space Mono', monospace; font-size: 0.5rem;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--ink-dim, #b0a8bc); margin-bottom: 1rem;
}
.hy-threshold .th-tabs {
  display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 1rem;
}
.hy-threshold .th-tab {
  font-family: 'Space Mono', monospace; font-size: 0.45rem;
  letter-spacing: 0.08em; text-transform: uppercase;
  padding: 0.4rem 0.55rem; border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.12); background: transparent;
  color: var(--ink-dim); cursor: pointer;
}
.hy-threshold .th-tab.is-on {
  border-color: rgba(138,92,240,0.5); color: var(--ink);
  background: rgba(138,92,240,0.15);
}
.hy-threshold .th-panel { display: none; }
.hy-threshold .th-panel.is-on { display: block; }
.hy-threshold .th-section-label {
  font-family: 'Space Mono', monospace; font-size: 0.48rem;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--purple, #8a5cf0); margin: 0.85rem 0 0.45rem;
}
.hy-threshold .th-section-label:first-child { margin-top: 0; }
.hy-threshold .th-profile {
  display: grid; grid-template-columns: 72px 1fr; gap: 0.9rem;
  align-items: start; margin-bottom: 0.75rem; padding: 0.85rem;
  border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);
  background: rgba(0,0,0,0.2);
}
.hy-threshold .th-avatar {
  width: 72px; height: 72px; border-radius: 12px;
  background: rgba(138,92,240,0.15); overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.7rem; color: var(--ink-dim);
}
.hy-threshold .th-avatar img { width: 100%; height: 100%; object-fit: cover; }
.hy-threshold .th-fields label {
  display: block; font-family: 'Space Mono', monospace;
  font-size: 0.45rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--ink-dim); margin: 0.55rem 0 0.25rem;
}
.hy-threshold .th-fields input,
.hy-threshold .th-fields textarea {
  width: 100%; box-sizing: border-box;
  background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px; color: var(--ink); padding: 0.45rem 0.55rem;
  font-family: 'Cormorant Garamond', serif; font-size: 0.95rem;
}
.hy-threshold .th-fields textarea { min-height: 64px; resize: vertical; }
.hy-threshold .th-fields input:disabled,
.hy-threshold .th-fields textarea:disabled { opacity: 0.5; }
.hy-threshold .th-actions { display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.75rem; }
.hy-threshold .th-btn {
  font-family: 'Space Mono', monospace; font-size: 0.48rem;
  letter-spacing: 0.08em; text-transform: uppercase;
  padding: 0.45rem 0.7rem; border-radius: 999px; cursor: pointer;
  border: 1px solid rgba(255,255,255,0.18); background: transparent; color: var(--ink);
}
.hy-threshold .th-btn:disabled { opacity: 0.35; cursor: default; }
.hy-threshold .th-btn.primary {
  border-color: rgba(53,201,143,0.45); color: var(--green, #35c98f);
}
.hy-threshold .th-stat-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;
}
.hy-threshold .th-stat {
  padding: 0.65rem 0.7rem; border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.08); background: rgba(0,0,0,0.22);
}
.hy-threshold .th-stat .v {
  font-style: italic; font-size: 1.15rem; color: var(--ink); display: block;
}
.hy-threshold .th-stat .k {
  font-family: 'Space Mono', monospace; font-size: 0.42rem;
  letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-dim);
}
.hy-threshold .th-list {
  list-style: none; margin: 0; padding: 0;
}
.hy-threshold .th-list li {
  padding: 0.45rem 0; border-bottom: 1px solid rgba(255,255,255,0.06);
  font-size: 0.9rem; color: var(--ink-dim); line-height: 1.4;
}
.hy-threshold .th-list li strong { color: var(--ink); font-weight: 400; font-style: italic; }
.hy-threshold .th-empty {
  font-size: 0.9rem; color: var(--ink-dim); font-style: italic; margin: 0.4rem 0;
}
.hy-threshold .th-tier-card {
  padding: 0.7rem 0.8rem; border-radius: 10px; margin-bottom: 0.45rem;
  border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.2);
}
.hy-threshold .th-tier-card.is-current {
  border-color: rgba(53,201,143,0.4); background: rgba(53,201,143,0.08);
}
.hy-threshold .th-tier-card strong {
  font-style: italic; color: var(--ink); display: block; margin-bottom: 0.25rem;
}
.hy-threshold .th-wallet {
  padding: 0.75rem; border-radius: 10px;
  border: 1px dashed rgba(138,92,240,0.35); background: rgba(0,0,0,0.2);
}
.hy-threshold .th-wallet code {
  font-family: 'Space Mono', monospace; font-size: 0.65rem; color: var(--green, #35c98f);
  word-break: break-all;
}
.hy-threshold-face {
  display: inline-flex; align-items: center; gap: 0.4rem;
  font-family: 'Space Mono', monospace; font-size: 0.5rem;
  letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-dim);
}
.hy-threshold-face .pip {
  width: 6px; height: 6px; border-radius: 50%; background: var(--purple, #8a5cf0);
}
`;

function injectStyle() {
  if (document.getElementById('hy-threshold-style')) return;
  const s = document.createElement('style');
  s.id = 'hy-threshold-style';
  s.textContent = STYLE;
  document.head.appendChild(s);
}

function loadLocalDrawHistory() {
  try {
    const raw = localStorage.getItem('haylynn-draw-history');
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

async function loadCloudDrawHistory(userId) {
  if (!supabase || !userId) return [];
  try {
    const { data, error } = await supabase
      .from('draw_history')
      .select('id, created_at, cards, reading_summary')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(40);
    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

async function loadInventory(userId) {
  if (!supabase || !userId) return [];
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('id, item_key, name, qty, meta, acquired_at')
      .eq('user_id', userId)
      .order('acquired_at', { ascending: false });
    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

async function loadSiteStats(userId) {
  // Optional table; returns zeros if missing
  const empty = {
    rooms_visited: 0,
    draws_total: 0,
    adventure_steps: 0,
    sessions: 0,
    last_seen: null,
  };
  if (!supabase || !userId) return empty;
  try {
    const { data, error } = await supabase
      .from('member_stats')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error || !data) return empty;
    return { ...empty, ...data };
  } catch {
    return empty;
  }
}

function shellHtml() {
  return `
    <div class="th-kicker"><span class="pip"></span>Threshold</div>
    <div class="th-title" data-role="th-title">Threshold</div>
    <div class="th-status" data-role="th-status">…</div>
    <div class="th-tabs" data-role="th-tabs">
      <button type="button" class="th-tab is-on" data-tab="identity">Identity</button>
      <button type="button" class="th-tab" data-tab="membership">Membership</button>
      <button type="button" class="th-tab" data-tab="decay">Cosmic Decay</button>
      <button type="button" class="th-tab" data-tab="draws">Draws</button>
      <button type="button" class="th-tab" data-tab="inventory">Inventory</button>
      <button type="button" class="th-tab" data-tab="stats">Stats</button>
      <button type="button" class="th-tab" data-tab="wallet">Wallet</button>
    </div>

    <div class="th-panel is-on" data-panel="identity">
      <div class="th-profile">
        <div class="th-avatar" data-role="th-avatar">·</div>
        <div class="th-fields">
          <label>Display name</label>
          <input data-role="th-name" type="text" maxlength="80" autocomplete="nickname" disabled>
          <label>Handle</label>
          <input data-role="th-handle" type="text" maxlength="32" disabled>
        </div>
      </div>
      <div class="th-fields">
        <label>Bio</label>
        <textarea data-role="th-bio" maxlength="2000" disabled></textarea>
        <label>Links (one per line)</label>
        <textarea data-role="th-links" disabled></textarea>
        <label>Account</label>
        <input data-role="th-account-ref" type="text" readonly disabled>
      </div>
      <div class="th-actions">
        <button type="button" class="th-btn" data-role="th-action" data-action="signin">Sign in</button>
        <button type="button" class="th-btn primary" data-role="th-action" data-action="save" disabled>Save</button>
      </div>
      <div data-role="theme-preview" style="margin-top:1rem"></div>
    </div>

    <div class="th-panel" data-panel="membership">
      <div data-role="th-tier-board"></div>
      <div class="th-actions">
        <button type="button" class="th-btn primary" data-role="th-action" data-action="checkout-supporter" disabled>Become Supporter</button>
        <button type="button" class="th-btn primary" data-role="th-action" data-action="checkout-patron" disabled>Become Patron</button>
        <button type="button" class="th-btn" data-role="th-action" data-action="portal" disabled>Billing</button>
      </div>
    </div>

    <div class="th-panel" data-panel="decay">
      <div class="th-section-label">Character · Cosmic Decay</div>
      <div data-role="th-decay"></div>
    </div>

    <div class="th-panel" data-panel="draws">
      <div class="th-section-label">Draw history</div>
      <div data-role="th-draws"></div>
    </div>

    <div class="th-panel" data-panel="inventory">
      <div class="th-section-label">Inventory</div>
      <div data-role="th-inventory"></div>
    </div>

    <div class="th-panel" data-panel="stats">
      <div class="th-section-label">House activity</div>
      <div class="th-stat-grid" data-role="th-stats"></div>
    </div>

    <div class="th-panel" data-panel="wallet">
      <div class="th-section-label">Wallet</div>
      <div class="th-wallet" data-role="th-wallet"></div>
    </div>
  `;
}

function setEnabled(root, on) {
  root.querySelectorAll('input:not([readonly]), textarea, button[data-role="th-action"]').forEach((el) => {
    if (el.dataset.alwaysOn === '1') return;
    if (el.dataset.action === 'signin') return;
    el.disabled = !on;
  });
}

function bindTabs(root) {
  root.querySelectorAll('[data-tab]').forEach((tab) => {
    tab.addEventListener('click', () => {
      const id = tab.dataset.tab;
      root.querySelectorAll('[data-tab]').forEach((t) => t.classList.toggle('is-on', t === tab));
      root.querySelectorAll('[data-panel]').forEach((p) => {
        p.classList.toggle('is-on', p.dataset.panel === id);
      });
    });
  });
}

function renderTierBoard(el, tier) {
  if (!el) return;
  const order = ['free', 'supporter', 'patron'];
  el.innerHTML = order
    .map((key) => {
      const meta = AUTH_CONFIG.tiers?.[key] || { label: key, blurb: '' };
      const benefits = TIER_BENEFITS[key] || [];
      const current = tier === key || (key === 'free' && (!tier || tier === 'free'));
      return `<div class="th-tier-card${current ? ' is-current' : ''}">
        <strong>${escapeHtml(meta.label || key)}${current ? ' · current' : ''}</strong>
        <span style="font-size:0.88rem;color:var(--ink-dim)">${escapeHtml(meta.blurb || '')}</span>
        <ul class="th-list" style="margin-top:0.5rem">${benefits
          .map((b) => `<li>${escapeHtml(b)}</li>`)
          .join('')}</ul>
      </div>`;
    })
    .join('');
}

function renderDecay(el, progress) {
  if (!el) return;
  const node = ADVENTURE_NODES[progress.node_id] || ADVENTURE_NODES.start;
  const flags = Object.keys(progress.flags || {}).filter((k) => progress.flags[k]);
  const unlocked = progress.unlocked || [];
  el.innerHTML = `
    <div class="th-stat-grid">
      <div class="th-stat"><span class="v">${escapeHtml(node.title || progress.node_id)}</span><span class="k">Current node</span></div>
      <div class="th-stat"><span class="v">${progress.path_score ?? 0}</span><span class="k">Path score</span></div>
    </div>
    <p class="th-empty" style="margin-top:0.75rem">${escapeHtml(node.body || '')}</p>
    <div class="th-section-label">Flags</div>
    ${
      flags.length
        ? `<ul class="th-list">${flags.map((f) => `<li><strong>${escapeHtml(f)}</strong></li>`).join('')}</ul>`
        : `<p class="th-empty">No flags yet — walk Cosmic Decay to leave marks.</p>`
    }
    <div class="th-section-label">Unlocked</div>
    ${
      unlocked.length
        ? `<ul class="th-list">${unlocked.map((u) => `<li><strong>${escapeHtml(u)}</strong></li>`).join('')}</ul>`
        : `<p class="th-empty">Nothing unlocked yet.</p>`
    }
    <p class="th-empty" style="margin-top:0.75rem">${
      progress.guest
        ? 'Guest progress is not saved. Sign in to bind Cosmic Decay to this account.'
        : 'Progress is held under this account.'
    }</p>
  `;
}

function renderDraws(el, cloud, local) {
  if (!el) return;
  const rows = [];
  if (cloud?.length) {
    cloud.forEach((d) => {
      rows.push({
        when: d.created_at,
        text: d.reading_summary || (Array.isArray(d.cards) ? d.cards.join(' · ') : 'Draw'),
        source: 'cloud',
      });
    });
  }
  if (local?.length) {
    local.slice(0, 20).forEach((d) => {
      rows.push({
        when: d.at || d.time || d.date,
        text: d.summary || d.label || (d.cards ? JSON.stringify(d.cards).slice(0, 80) : 'Local draw'),
        source: 'device',
      });
    });
  }
  if (!rows.length) {
    el.innerHTML = `<p class="th-empty">No draws recorded yet. Use The Draw on the scroll; signed-in cloud history appears here when the backend is live.</p>`;
    return;
  }
  el.innerHTML = `<ul class="th-list">${rows
    .slice(0, 25)
    .map(
      (r) =>
        `<li><strong>${escapeHtml(r.text)}</strong><br><span style="font-family:Space Mono,monospace;font-size:0.42rem;letter-spacing:0.08em;text-transform:uppercase;opacity:0.7">${escapeHtml(r.source)}${r.when ? ' · ' + escapeHtml(String(r.when).slice(0, 19)) : ''}</span></li>`,
    )
    .join('')}</ul>`;
}

function renderInventory(el, items) {
  if (!el) return;
  if (!items?.length) {
    el.innerHTML = `<p class="th-empty">Inventory is empty. Cosmic Decay and membership doors will place items here.</p>`;
    return;
  }
  el.innerHTML = `<ul class="th-list">${items
    .map(
      (it) =>
        `<li><strong>${escapeHtml(it.name || it.item_key)}</strong> × ${escapeHtml(String(it.qty ?? 1))}</li>`,
    )
    .join('')}</ul>`;
}

function renderStats(el, stats, pathScore, drawCount) {
  if (!el) return;
  const cells = [
    ['Account activity', stats.sessions ?? 0],
    ['Rooms noted', stats.rooms_visited ?? 0],
    ['Draws', Math.max(stats.draws_total ?? 0, drawCount)],
    ['Decay steps', Math.max(stats.adventure_steps ?? 0, pathScore ?? 0)],
  ];
  el.innerHTML = cells
    .map(
      ([k, v]) =>
        `<div class="th-stat"><span class="v">${escapeHtml(String(v))}</span><span class="k">${escapeHtml(k)}</span></div>`,
    )
    .join('');
}

function renderWallet(el, profile) {
  if (!el) return;
  const addr = profile?.wallet_address;
  el.innerHTML = `
    <p class="th-empty" style="margin-top:0">Optional link to a wallet for future on-chain doors. Never required to walk the house.</p>
    <p style="margin:0.6rem 0 0.4rem;font-family:Space Mono,monospace;font-size:0.45rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-dim)">Connected</p>
    <code data-role="th-wallet-addr">${addr ? escapeHtml(addr) : 'None'}</code>
    <div class="th-actions" style="margin-top:0.75rem">
      <button type="button" class="th-btn primary" data-role="th-action" data-action="wallet-connect">Connect wallet</button>
      <button type="button" class="th-btn" data-role="th-action" data-action="wallet-disconnect" ${addr ? '' : 'disabled'}>Disconnect</button>
    </div>
  `;
}

async function connectWallet(root) {
  const statusEl = root.querySelector('[data-role="th-status"]');
  try {
    const eth = window.ethereum;
    if (!eth) {
      if (statusEl) statusEl.textContent = 'No wallet detected in this browser.';
      return;
    }
    const accounts = await eth.request({ method: 'eth_requestAccounts' });
    const address = accounts?.[0];
    if (!address) return;
    // Persist when backend column exists
    try {
      await saveProfile({ wallet_address: address });
    } catch {
      // Column may not exist yet — still show in UI this session
      root._walletSession = address;
    }
    if (statusEl) statusEl.textContent = 'Wallet linked.';
    await refreshRoot(root);
  } catch (e) {
    if (statusEl) statusEl.textContent = e.message || 'Wallet connection cancelled.';
  }
}

async function refreshRoot(root) {
  const statusEl = root.querySelector('[data-role="th-status"]');
  const titleEl = root.querySelector('[data-role="th-title"]');
  const nameInput = root.querySelector('[data-role="th-name"]');
  const handleInput = root.querySelector('[data-role="th-handle"]');
  const bioInput = root.querySelector('[data-role="th-bio"]');
  const linksInput = root.querySelector('[data-role="th-links"]');
  const accountRef = root.querySelector('[data-role="th-account-ref"]');
  const avatarEl = root.querySelector('[data-role="th-avatar"]');
  const preview = root.querySelector('[data-role="theme-preview"]');

  root.classList.toggle('is-live', authReady);

  if (!authReady) {
    if (statusEl) statusEl.textContent = 'Membership is not connected yet.';
    if (titleEl) titleEl.textContent = 'Threshold';
    setEnabled(root, false);
    root.querySelectorAll('[data-action="signin"]').forEach((b) => {
      b.disabled = false;
      b.dataset.alwaysOn = '1';
    });
    renderTierBoard(root.querySelector('[data-role="th-tier-board"]'), 'free');
    renderDecay(root.querySelector('[data-role="th-decay"]'), {
      node_id: 'start',
      flags: {},
      unlocked: [],
      path_score: 0,
      guest: true,
    });
    renderDraws(root.querySelector('[data-role="th-draws"]'), [], loadLocalDrawHistory());
    renderInventory(root.querySelector('[data-role="th-inventory"]'), []);
    renderStats(root.querySelector('[data-role="th-stats"]'), {}, 0, loadLocalDrawHistory().length);
    renderWallet(root.querySelector('[data-role="th-wallet"]'), null);
    if (preview) {
      renderProfileCard(preview, {
        display_name: 'Example presence',
        handle: 'koru',
        bio: 'A place in the house — name, likeness, and a few links.',
        links: [{ label: 'World', url: '/' }],
        theme_config: MEMBERS_CONFIG.demoTheme,
      });
    }
    return;
  }

  const user = await getCurrentUser();
  if (!user) {
    if (statusEl) statusEl.textContent = 'Sign in to open your membership space.';
    if (titleEl) titleEl.textContent = 'Threshold';
    setEnabled(root, false);
    root.querySelectorAll('[data-action="signin"]').forEach((b) => {
      b.disabled = false;
      b.dataset.alwaysOn = '1';
    });
    renderTierBoard(root.querySelector('[data-role="th-tier-board"]'), 'free');
    renderDecay(root.querySelector('[data-role="th-decay"]'), {
      node_id: 'start',
      flags: {},
      unlocked: [],
      path_score: 0,
      guest: true,
    });
    renderDraws(root.querySelector('[data-role="th-draws"]'), [], loadLocalDrawHistory());
    renderInventory(root.querySelector('[data-role="th-inventory"]'), []);
    renderStats(root.querySelector('[data-role="th-stats"]'), {}, 0, loadLocalDrawHistory().length);
    renderWallet(root.querySelector('[data-role="th-wallet"]'), null);
    return;
  }

  setEnabled(root, true);
  const tier = (await getCurrentTier()) || 'free';
  const profile = (await getProfile()) || {};
  if (root._walletSession && !profile.wallet_address) {
    profile.wallet_address = root._walletSession;
  }

  if (statusEl) {
    statusEl.textContent =
      tier === 'patron' ? 'Patron · space open' : tier === 'supporter' ? 'Supporter · space open' : 'Signed in · Visitor';
  }
  if (titleEl) titleEl.textContent = profile.display_name || 'Your place';

  if (nameInput) nameInput.value = profile.display_name || '';
  if (handleInput) handleInput.value = profile.handle || '';
  if (bioInput) bioInput.value = profile.bio || '';
  if (linksInput && Array.isArray(profile.links)) {
    linksInput.value = profile.links
      .map((l) => (typeof l === 'string' ? l : l.url || ''))
      .filter(Boolean)
      .join('\n');
  }
  if (accountRef) accountRef.value = formatAccountRef(user, profile);

  if (avatarEl) {
    avatarEl.textContent = '';
    const safe = safeHttpUrl(profile.avatar_url);
    if (safe) {
      const img = document.createElement('img');
      img.src = safe;
      img.alt = '';
      img.referrerPolicy = 'no-referrer';
      avatarEl.appendChild(img);
    } else {
      avatarEl.textContent = (profile.display_name || user.email || '?').slice(0, 1).toUpperCase();
    }
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

  renderTierBoard(root.querySelector('[data-role="th-tier-board"]'), tier);

  const progress = await loadAdventureProgress();
  renderDecay(root.querySelector('[data-role="th-decay"]'), progress);

  const localDraws = loadLocalDrawHistory();
  const cloudDraws = await loadCloudDrawHistory(user.id);
  renderDraws(root.querySelector('[data-role="th-draws"]'), cloudDraws, localDraws);

  const items = await loadInventory(user.id);
  renderInventory(root.querySelector('[data-role="th-inventory"]'), items);

  const stats = await loadSiteStats(user.id);
  renderStats(
    root.querySelector('[data-role="th-stats"]'),
    stats,
    progress.path_score,
    localDraws.length + cloudDraws.length,
  );

  renderWallet(root.querySelector('[data-role="th-wallet"]'), profile);
}

function bindRoot(root) {
  if (root.dataset.bound) return;
  root.dataset.bound = '1';
  root.classList.add('hy-threshold');
  root.innerHTML = shellHtml();
  bindTabs(root);

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
          if (statusEl) statusEl.textContent = 'Saved.';
          await refreshRoot(root);
        }
        if (action === 'checkout-supporter') {
          const id = AUTH_CONFIG.prices.supporter;
          if (!id) throw new Error('Supporter is not configured yet.');
          await startCheckout(id);
        }
        if (action === 'checkout-patron') {
          const id = AUTH_CONFIG.prices.patron;
          if (!id) throw new Error('Patron is not configured yet.');
          await startCheckout(id);
        }
        if (action === 'portal') {
          await openBillingPortal();
        }
        if (action === 'wallet-connect') {
          await connectWallet(root);
        }
        if (action === 'wallet-disconnect') {
          try {
            await saveProfile({ wallet_address: null });
          } catch {
            /* ignore */
          }
          root._walletSession = null;
          await refreshRoot(root);
        }
      } catch (e) {
        if (statusEl) statusEl.textContent = e.message || 'Something went wrong.';
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
    el.innerHTML = `<span class="pip"></span>Threshold`;
  });

  // Prefer explicit root; fall back to mounting inside threshold detail content
  const roots = document.querySelectorAll('[data-role="threshold-root"]');
  if (roots.length) {
    roots.forEach(bindRoot);
  } else {
    document.querySelectorAll('[data-role="threshold-face"]').forEach((face) => {
      const host = document.createElement('div');
      host.setAttribute('data-role', 'threshold-root');
      face.insertAdjacentElement('afterend', host);
      bindRoot(host);
    });
  }
}
