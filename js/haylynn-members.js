/**
 * Threshold — membership space shaped by section tags.
 * Free: up to 3 rooms. Paid: more / all. Cosmic Decay only if tagged (or patron-all).
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
import {
  MEMBERS_CONFIG,
  tagSlotsForTier,
} from './members-config.js';
import {
  loadMockMember,
  saveMockMember,
  loadLocalTags,
  saveLocalTags,
  normalizeMember,
  memberHasSection,
  memberHasFeature,
  clampTags,
} from './haylynn-member-session.js';
import { loadAdventureProgress, ADVENTURE_NODES } from './haylynn-adventure.js';
import {
  getActiveCharacter,
  subscribeCharacterLive,
  enterCosmicDecay,
} from './haylynn-character.js';

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const STYLE = `
.hy-threshold {
  margin-top: 0.4rem; padding: 1.1rem 1.15rem 1.25rem;
  border-radius: 14px; border: 1px solid rgba(138,92,240,0.28);
  background: rgba(12,10,22,0.55);
}
.hy-threshold h3 {
  font-family: 'Cormorant Garamond', serif; font-weight: 400;
  font-size: 1.35rem; margin: 0 0 0.35rem; color: var(--ink, #efe9e0);
}
.hy-threshold .th-lead {
  font-size: 0.82rem; line-height: 1.55; color: var(--ink-dim, #9a92a4);
  margin: 0 0 0.9rem;
}
.hy-threshold .th-tabs {
  display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 0.85rem;
}
.hy-threshold .th-tab {
  font-family: 'Space Mono', monospace; font-size: 0.52rem;
  letter-spacing: 0.08em; text-transform: uppercase;
  border-radius: 999px; padding: 0.35rem 0.65rem; cursor: pointer;
  border: 1px solid rgba(255,255,255,0.12); background: transparent;
  color: var(--ink-dim, #9a92a4);
}
.hy-threshold .th-tab.on {
  border-color: rgba(138,92,240,0.45); color: var(--ink, #efe9e0);
  background: rgba(138,92,240,0.1);
}
.hy-threshold .th-panel { min-height: 6rem; }
.hy-threshold .th-stat-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(6.5rem, 1fr));
  gap: 0.45rem; margin: 0.5rem 0 0.75rem;
}
.hy-threshold .th-stat {
  border: 1px solid rgba(255,255,255,0.08); border-radius: 8px;
  padding: 0.45rem 0.5rem; background: rgba(0,0,0,0.2);
}
.hy-threshold .th-stat .v {
  display: block; font-family: 'Cormorant Garamond', serif;
  font-size: 1.05rem; color: var(--ink, #efe9e0);
}
.hy-threshold .th-stat .k {
  font-family: 'Space Mono', monospace; font-size: 0.48rem;
  letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-dim);
}
.hy-threshold .th-empty {
  font-size: 0.78rem; color: var(--ink-dim); line-height: 1.5; margin: 0.4rem 0;
}
.hy-threshold .th-btn {
  font-family: 'Space Mono', monospace; font-size: 0.55rem;
  letter-spacing: 0.08em; text-transform: uppercase;
  border-radius: 999px; padding: 0.45rem 0.75rem; cursor: pointer;
  border: 1px solid rgba(255,255,255,0.16); background: transparent;
  color: var(--ink, #efe9e0); margin: 0.2rem 0.25rem 0.2rem 0;
}
.hy-threshold .th-btn.primary {
  border-color: rgba(53,201,143,0.45); color: #35c98f;
  background: rgba(53,201,143,0.08);
}
.hy-threshold .th-tag {
  display: inline-block; margin: 0.15rem 0.25rem 0.15rem 0;
  padding: 0.25rem 0.5rem; border-radius: 999px;
  border: 1px solid rgba(53,201,143,0.35); font-size: 0.55rem;
  font-family: 'Space Mono', monospace; letter-spacing: 0.06em;
  color: #35c98f;
}
.hy-threshold .th-section-label {
  font-family: 'Space Mono', monospace; font-size: 0.52rem;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--ink-dim); margin: 0.75rem 0 0.35rem;
}
.hy-threshold .th-list { margin: 0; padding-left: 1.1rem; color: var(--ink-dim); font-size: 0.78rem; }
.hy-threshold .th-list li { margin: 0.25rem 0; }
.hy-threshold .th-door {
  border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
  padding: 0.65rem 0.75rem; margin: 0.4rem 0;
  background: rgba(255,255,255,0.02);
}
.hy-threshold .th-door h4 {
  margin: 0 0 0.25rem; font-family: 'Space Mono', monospace;
  font-size: 0.58rem; letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--ink, #efe9e0);
}
`;

function injectStyle() {
  if (document.getElementById('hy-threshold-style')) return;
  const s = document.createElement('style');
  s.id = 'hy-threshold-style';
  s.textContent = STYLE;
  document.head.appendChild(s);
}

function shellHtml() {
  return `
    <div class="hy-threshold" data-role="threshold-root">
      <h3>Threshold</h3>
      <p class="th-lead" data-role="th-lead">Your place in the house — shaped by the rooms you tagged.</p>
      <div class="th-tabs" data-role="th-tabs"></div>
      <div class="th-panel" data-role="th-panel"></div>
    </div>
  `;
}

async function resolveMember() {
  const mock = loadMockMember();
  if (mock?.active) {
    return normalizeMember({ mock });
  }
  if (!authReady) {
    return normalizeMember({});
  }
  const user = await getCurrentUser();
  if (!user) return normalizeMember({});
  const profile = await getProfile();
  const tier = (await getCurrentTier()) || profile?.tier || 'free';
  return normalizeMember({ user, profile, tier });
}

function taggedSections(member) {
  if (!member.isSignedIn) return [];
  if (member.tier === 'patron' || tagSlotsForTier(member.tier) >= 99) {
    return MEMBERS_CONFIG.sections.slice();
  }
  return MEMBERS_CONFIG.sections.filter((s) => memberHasSection(member, s.id));
}

function renderClosed(panel) {
  panel.innerHTML = `
    <p class="th-empty">Sign up and tag up to three rooms. Each tag opens membership perks for that part of the house — music, story, markets, play, and the rest. Cosmic Decay character save only appears if you tag it.</p>
    <button type="button" class="th-btn primary" data-role="th-open-auth">Choose rooms</button>
    <p class="th-empty" style="margin-top:0.75rem">Live accounts connect when the house is ready. Until then, use <em style="color:var(--ink)">Preview member</em> from the account control to walk the full path with your tags.</p>
  `;
  panel.querySelector('[data-role="th-open-auth"]')?.addEventListener('click', () => {
    document.getElementById('auth-badge')?.click();
  });
}

function renderIdentity(panel, member) {
  const tags = taggedSections(member);
  const slots = tagSlotsForTier(member.tier);
  panel.innerHTML = `
    <div class="th-stat-grid">
      <div class="th-stat"><span class="v">${escapeHtml(member.display_name || '—')}</span><span class="k">Name</span></div>
      <div class="th-stat"><span class="v">${escapeHtml(MEMBERS_CONFIG.tiers[member.tier]?.label || member.tier)}</span><span class="k">Tier</span></div>
      <div class="th-stat"><span class="v">${member.isMock ? 'Preview' : 'Live'}</span><span class="k">Session</span></div>
      <div class="th-stat"><span class="v">${tags.length}${slots < 99 ? ' / ' + slots : ''}</span><span class="k">Rooms</span></div>
    </div>
    <div class="th-section-label">Tagged rooms</div>
    <div>${tags.map((s) => `<span class="th-tag">${escapeHtml(s.label)}</span>`).join('') || '<p class="th-empty">No rooms tagged yet.</p>'}</div>
    <p class="th-empty">${escapeHtml(MEMBERS_CONFIG.tiers[member.tier]?.blurb || '')}</p>
    <div class="th-section-label">Membership</div>
    <button type="button" class="th-btn" data-action="edit-tags">Edit tags</button>
    ${
      member.tier === 'free'
        ? `<button type="button" class="th-btn primary" data-action="upgrade">Expand rooms (Supporter / Patron)</button>`
        : `<button type="button" class="th-btn" data-action="portal">Billing</button>`
    }
    ${
      member.isMock
        ? `<button type="button" class="th-btn" data-action="end-preview">End preview</button>`
        : ''
    }
  `;
}

function renderDoors(panel, member) {
  const tags = taggedSections(member);
  if (!tags.length) {
    panel.innerHTML = `<p class="th-empty">Tag rooms from Identity to open doors here.</p>`;
    return;
  }
  panel.innerHTML = tags
    .map((s) => {
      let body = `<p class="th-empty">${escapeHtml(s.perkLine)}</p>`;
      if (s.features.includes('radio_submit')) {
        body += `<button type="button" class="th-btn primary" data-action="music-submit">Submit a track (waitlist)</button>`;
      }
      if (s.features.includes('guest_book_promo')) {
        body += `<button type="button" class="th-btn primary" data-action="book-list">List a title (waitlist)</button>`;
      }
      if (s.features.includes('watchlist')) {
        body += `<button type="button" class="th-btn primary" data-action="watchlist">Open watchlist</button>`;
      }
      if (s.features.includes('cosmic_decay_passport')) {
        body += `<button type="button" class="th-btn primary" data-action="enter-decay">Enter Cosmic Decay</button>`;
      }
      if (s.features.includes('draw_cloud')) {
        body += `<p class="th-empty">Draw history syncs here when cloud is live.</p>`;
      }
      return `<div class="th-door" data-door="${s.id}"><h4>${escapeHtml(s.label)}</h4>${body}</div>`;
    })
    .join('');
}

async function renderPlay(panel, member) {
  if (!memberHasFeature(member, 'cosmic_decay_passport') && !memberHasSection(member, 'threshold')) {
    panel.innerHTML = `
      <p class="th-empty">Cosmic Decay is optional. Tag <strong style="color:var(--ink)">Cosmic Decay</strong> under Identity (or upgrade to Patron for all rooms) to bind a persistent character and passport.</p>
      <button type="button" class="th-btn" data-action="edit-tags">Edit tags</button>
    `;
    return;
  }
  let progress = { node_id: 'hub', path_score: 0, flags: {}, unlocked: [], guest: true };
  let character = null;
  try {
    progress = await loadAdventureProgress();
    character = await getActiveCharacter();
  } catch { /* offline */ }
  const name =
    character?.name ||
    progress.character_name ||
    progress.flags?.character_name ||
    null;
  panel.innerHTML = `
    <p class="th-empty">You tagged play — this passport is yours. Character data fills when Cosmic Decay writes to your account.</p>
    <div class="th-stat-grid">
      <div class="th-stat"><span class="v">${escapeHtml(name || '—')}</span><span class="k">Character</span></div>
      <div class="th-stat"><span class="v">${escapeHtml(character?.active_domain_id || progress.domain_id || '—')}</span><span class="k">Domain</span></div>
      <div class="th-stat"><span class="v">${progress.path_score ?? 0}</span><span class="k">Path</span></div>
    </div>
    <button type="button" class="th-btn primary" data-action="enter-decay">Enter Cosmic Decay</button>
  `;
}

function renderWatchlist(panel, member) {
  if (!memberHasFeature(member, 'watchlist') && !memberHasSection(member, 'markets')) {
    panel.innerHTML = `<p class="th-empty">Tag <strong style="color:var(--ink)">Markets</strong> to keep a member watchlist.</p>`;
    return;
  }
  let items = [];
  try {
    items = JSON.parse(localStorage.getItem('haylynn-watchlist-v1') || '[]');
  } catch { items = []; }
  if (!Array.isArray(items)) items = [];
  panel.innerHTML = `
    <p class="th-empty">Local watchlist (cloud when accounts are live).</p>
    <ul class="th-list">${
      items.length
        ? items.map((i) => `<li>${escapeHtml(i)}</li>`).join('')
        : '<li>Empty — add symbols from the ticker when wired.</li>'
    }</ul>
    <button type="button" class="th-btn" data-action="watchlist-add">Add sample BTC</button>
  `;
}

async function renderPanel(root, tab, member) {
  const panel = root.querySelector('[data-role="th-panel"]');
  if (!panel) return;
  if (!member.isSignedIn) {
    renderClosed(panel);
    return;
  }
  if (tab === 'identity') renderIdentity(panel, member);
  else if (tab === 'doors') renderDoors(panel, member);
  else if (tab === 'play') await renderPlay(panel, member);
  else if (tab === 'markets') renderWatchlist(panel, member);
  else renderDoors(panel, member);
}

function buildTabs(member) {
  if (!member.isSignedIn) return [{ id: 'join', label: 'Join' }];
  const tabs = [
    { id: 'identity', label: 'Identity' },
    { id: 'doors', label: 'Your rooms' },
  ];
  if (memberHasSection(member, 'threshold') || member.tier === 'patron') {
    tabs.push({ id: 'play', label: 'Cosmic Decay' });
  }
  if (memberHasSection(member, 'markets') || memberHasFeature(member, 'watchlist') || member.tier === 'patron') {
    tabs.push({ id: 'markets', label: 'Markets' });
  }
  return tabs;
}

async function refreshRoot(root) {
  const member = await resolveMember();
  root._member = member;
  const lead = root.querySelector('[data-role="th-lead"]');
  if (lead) {
    lead.textContent = member.isSignedIn
      ? member.isMock
        ? 'Preview session — tags shape which doors open. Not a live account yet.'
        : 'Your tagged rooms open membership perks. Other rooms stay visitor-side.'
      : 'Tag up to three rooms on sign-up. Paid tiers hold more — and future rooms.';
  }
  const tabsEl = root.querySelector('[data-role="th-tabs"]');
  const tabs = buildTabs(member);
  let active = root._tab || tabs[0].id;
  if (!tabs.some((t) => t.id === active)) active = tabs[0].id;
  root._tab = active;
  tabsEl.innerHTML = tabs
    .map((t) => `<button type="button" class="th-tab ${t.id === active ? 'on' : ''}" data-tab="${t.id}">${escapeHtml(t.label)}</button>`)
    .join('');
  tabsEl.querySelectorAll('[data-tab]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      root._tab = btn.getAttribute('data-tab');
      await refreshRoot(root);
    });
  });
  await renderPanel(root, active, member);
}

function bindRoot(root) {
  root.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.getAttribute('data-action');
    const member = root._member || (await resolveMember());

    if (action === 'end-preview') {
      saveMockMember(null);
      window.dispatchEvent(new CustomEvent('haylynn:auth'));
      return;
    }
    if (action === 'enter-decay') {
      enterCosmicDecay();
      return;
    }
    if (action === 'edit-tags') {
      const current = member.section_tags || loadLocalTags();
      const pick = prompt(
        `Comma-separated room ids (max ${tagSlotsForTier(member.tier)}):\n` +
          MEMBERS_CONFIG.sections.map((s) => s.id).join(', '),
        current.join(','),
      );
      if (pick == null) return;
      const tags = clampTags(
        pick.split(/[\s,]+/).map((s) => s.trim()).filter(Boolean),
        member.tier,
      );
      saveLocalTags(tags);
      if (member.isMock) {
        saveMockMember({ ...loadMockMember(), section_tags: tags, active: true });
      } else if (authReady) {
        try {
          await saveProfile({ section_tags: tags });
        } catch (err) {
          console.warn(err);
        }
      }
      await refreshRoot(root);
      return;
    }
    if (action === 'upgrade') {
      const price = AUTH_CONFIG.prices?.supporter;
      if (price && authReady && !member.isMock) {
        try {
          await startCheckout(price);
        } catch (err) {
          alert(err.message || 'Checkout unavailable');
        }
      } else {
        alert('Paid tiers connect with Stripe when accounts go live. Patron = all rooms + future.');
      }
      return;
    }
    if (action === 'portal') {
      if (authReady && !member.isMock) {
        try {
          await openBillingPortal();
        } catch (err) {
          alert(err.message || 'Portal unavailable');
        }
      }
      return;
    }
    if (action === 'music-submit' || action === 'book-list') {
      alert('Waitlist recorded locally. Live queue opens with accounts + moderation.');
      return;
    }
    if (action === 'watchlist-add') {
      let items = [];
      try {
        items = JSON.parse(localStorage.getItem('haylynn-watchlist-v1') || '[]');
      } catch { items = []; }
      if (!items.includes('BTC')) items.push('BTC');
      localStorage.setItem('haylynn-watchlist-v1', JSON.stringify(items));
      await refreshRoot(root);
      return;
    }
    if (action === 'watchlist') {
      root._tab = 'markets';
      await refreshRoot(root);
    }
  });
}

export function initHaylynnMembers() {
  injectStyle();
  injectThemeStyles?.();

  const nodes = document.querySelectorAll('[data-role="members-root"], [data-role="threshold-root"], #threshold-members');
  const mountPoints = nodes.length
    ? nodes
    : (() => {
        const host =
          document.querySelector('.section[data-id="threshold"] .content') ||
          document.querySelector('.section[data-id="threshold"]');
        if (!host) return [];
        const el = document.createElement('div');
        el.setAttribute('data-role', 'members-root');
        host.appendChild(el);
        return [el];
      })();

  mountPoints.forEach((el) => {
    if (el.dataset.hyMembersInit) return;
    el.dataset.hyMembersInit = '1';
    el.innerHTML = shellHtml();
    const root = el.querySelector('[data-role="threshold-root"]') || el;
    bindRoot(root);
    refreshRoot(root);
    window.addEventListener('haylynn:auth', () => refreshRoot(root));
    if (authReady) {
      try {
        subscribeCharacterLive({
          onCharacter: () => refreshRoot(root),
          onProgress: () => refreshRoot(root),
          onInventory: () => refreshRoot(root),
        });
      } catch { /* offline */ }
    }
  });
}
