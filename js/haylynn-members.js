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
  margin-top: 0.4rem; padding: 0; overflow: hidden;
  border-radius: 16px; border: 1px solid rgba(138,92,240,0.32);
  background: linear-gradient(165deg, rgba(18,14,32,0.92) 0%, rgba(8,6,16,0.88) 100%);
  box-shadow: 0 12px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04);
}
.hy-threshold .th-hero {
  padding: 1.15rem 1.2rem 1rem;
  border-bottom: 1px solid rgba(138,92,240,0.18);
  background: radial-gradient(ellipse at 20% 0%, rgba(138,92,240,0.14), transparent 55%);
}
.hy-threshold .th-hero-top {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 0.75rem;
}
.hy-threshold .th-eyebrow {
  font-family: 'Space Mono', monospace; font-size: 0.5rem;
  letter-spacing: 0.16em; text-transform: uppercase; color: #a78bfa;
  margin: 0 0 0.25rem;
}
.hy-threshold h3 {
  font-family: 'Cormorant Garamond', serif; font-weight: 400;
  font-size: 1.55rem; margin: 0; color: var(--ink, #efe9e0); line-height: 1.15;
}
.hy-threshold .th-lead {
  font-size: 0.8rem; line-height: 1.55; color: var(--ink-dim, #9a92a4);
  margin: 0.45rem 0 0; max-width: 36rem;
}
.hy-threshold .th-badge {
  flex-shrink: 0; text-align: center;
  border: 1px solid rgba(53,201,143,0.35); border-radius: 12px;
  padding: 0.4rem 0.55rem; min-width: 4.2rem;
  background: rgba(53,201,143,0.06);
}
.hy-threshold .th-badge .tb-v {
  display: block; font-family: 'Cormorant Garamond', serif;
  font-size: 1.1rem; color: #35c98f; line-height: 1.1;
}
.hy-threshold .th-badge .tb-k {
  font-family: 'Space Mono', monospace; font-size: 0.45rem;
  letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-dim);
}
.hy-threshold .th-body { padding: 0.85rem 1.15rem 1.2rem; }
.hy-threshold .th-tabs {
  display: flex; flex-wrap: wrap; gap: 0.3rem; margin-bottom: 0.95rem;
  padding-bottom: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.06);
}
.hy-threshold .th-tab {
  font-family: 'Space Mono', monospace; font-size: 0.5rem;
  letter-spacing: 0.08em; text-transform: uppercase;
  border-radius: 999px; padding: 0.38rem 0.7rem; cursor: pointer;
  border: 1px solid rgba(255,255,255,0.1); background: transparent;
  color: var(--ink-dim, #9a92a4); transition: border-color 0.15s, background 0.15s, color 0.15s;
}
.hy-threshold .th-tab:hover { border-color: rgba(138,92,240,0.35); color: var(--ink); }
.hy-threshold .th-tab.on {
  border-color: rgba(138,92,240,0.5); color: var(--ink, #efe9e0);
  background: rgba(138,92,240,0.14);
}
.hy-threshold .th-panel { min-height: 7rem; }
.hy-threshold .th-passport {
  display: grid; grid-template-columns: 1fr; gap: 0.85rem;
}
@media (min-width: 520px) {
  .hy-threshold .th-passport { grid-template-columns: 1.1fr 0.9fr; }
}
.hy-threshold .th-card {
  border: 1px solid rgba(255,255,255,0.08); border-radius: 12px;
  padding: 0.85rem 0.9rem; background: rgba(0,0,0,0.22);
}
.hy-threshold .th-card h4 {
  margin: 0 0 0.55rem; font-family: 'Space Mono', monospace;
  font-size: 0.52rem; letter-spacing: 0.12em; text-transform: uppercase;
  color: #a78bfa;
}
.hy-threshold .th-stat-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem;
}
.hy-threshold .th-stat {
  border: 1px solid rgba(255,255,255,0.06); border-radius: 8px;
  padding: 0.5rem 0.55rem; background: rgba(255,255,255,0.02);
}
.hy-threshold .th-stat .v {
  display: block; font-family: 'Cormorant Garamond', serif;
  font-size: 1.12rem; color: var(--ink, #efe9e0); word-break: break-word;
}
.hy-threshold .th-stat .k {
  font-family: 'Space Mono', monospace; font-size: 0.45rem;
  letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-dim);
}
.hy-threshold .th-empty {
  font-size: 0.78rem; color: var(--ink-dim); line-height: 1.55; margin: 0.35rem 0;
}
.hy-threshold .th-btn {
  font-family: 'Space Mono', monospace; font-size: 0.52rem;
  letter-spacing: 0.08em; text-transform: uppercase;
  border-radius: 999px; padding: 0.48rem 0.8rem; cursor: pointer;
  border: 1px solid rgba(255,255,255,0.14); background: transparent;
  color: var(--ink, #efe9e0); margin: 0.2rem 0.3rem 0.2rem 0;
  transition: background 0.15s, border-color 0.15s;
}
.hy-threshold .th-btn:hover { border-color: rgba(255,255,255,0.28); }
.hy-threshold .th-btn.primary {
  border-color: rgba(53,201,143,0.5); color: #35c98f;
  background: rgba(53,201,143,0.1);
}
.hy-threshold .th-btn.primary:hover { background: rgba(53,201,143,0.18); }
.hy-threshold .th-btn.ghost {
  border-color: rgba(138,92,240,0.35); color: #c4b5fd;
}
.hy-threshold .th-tag {
  display: inline-block; margin: 0.15rem 0.25rem 0.15rem 0;
  padding: 0.28rem 0.55rem; border-radius: 999px;
  border: 1px solid rgba(53,201,143,0.35); font-size: 0.52rem;
  font-family: 'Space Mono', monospace; letter-spacing: 0.06em;
  color: #35c98f; background: rgba(53,201,143,0.06);
}
.hy-threshold .th-section-label {
  font-family: 'Space Mono', monospace; font-size: 0.5rem;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--ink-dim); margin: 0.85rem 0 0.4rem;
}
.hy-threshold .th-benefits {
  list-style: none; margin: 0; padding: 0;
}
.hy-threshold .th-benefits li {
  position: relative; padding: 0.35rem 0 0.35rem 1rem;
  font-size: 0.78rem; color: var(--ink-dim); line-height: 1.4;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.hy-threshold .th-benefits li:last-child { border-bottom: none; }
.hy-threshold .th-benefits li::before {
  content: ''; position: absolute; left: 0; top: 0.65rem;
  width: 5px; height: 5px; border-radius: 50%;
  background: #35c98f; opacity: 0.8;
}
.hy-threshold .th-door {
  border: 1px solid rgba(255,255,255,0.08); border-radius: 12px;
  padding: 0.8rem 0.9rem; margin: 0.45rem 0;
  background: rgba(255,255,255,0.02);
  transition: border-color 0.15s;
}
.hy-threshold .th-door:hover { border-color: rgba(138,92,240,0.35); }
.hy-threshold .th-door-head {
  display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;
  margin-bottom: 0.35rem;
}
.hy-threshold .th-door h4 {
  margin: 0; font-family: 'Space Mono', monospace;
  font-size: 0.58rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--ink, #efe9e0);
}
.hy-threshold .th-door-status {
  font-family: 'Space Mono', monospace; font-size: 0.45rem;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: #35c98f; border: 1px solid rgba(53,201,143,0.3);
  border-radius: 999px; padding: 0.15rem 0.4rem;
}
.hy-threshold .th-account-id {
  font-family: 'Space Mono', monospace; font-size: 0.55rem;
  color: var(--ink-dim); letter-spacing: 0.04em; word-break: break-all;
}
.hy-threshold .th-actions { margin-top: 0.75rem; display: flex; flex-wrap: wrap; gap: 0.25rem; }
.hy-threshold .th-progress {
  height: 4px; border-radius: 2px; background: rgba(255,255,255,0.08);
  margin: 0.5rem 0 0.25rem; overflow: hidden;
}
.hy-threshold .th-progress > span {
  display: block; height: 100%; border-radius: 2px;
  background: linear-gradient(90deg, #8a5cf0, #35c98f);
}

.hy-threshold .th-profile-head {
  display: flex; gap: 0.85rem; align-items: flex-start; margin-bottom: 0.75rem;
}
.hy-threshold .th-avatar {
  width: 4.25rem; height: 4.25rem; border-radius: 12px; flex-shrink: 0;
  object-fit: cover; border: 1px solid rgba(138,92,240,0.35);
  background: rgba(138,92,240,0.12);
}
.hy-threshold .th-avatar-ph {
  width: 4.25rem; height: 4.25rem; border-radius: 12px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid rgba(138,92,240,0.35);
  background: rgba(138,92,240,0.12);
  font-family: 'Cormorant Garamond', serif; font-size: 1.6rem; color: #c4b5fd;
}
.hy-threshold .th-profile-meta { min-width: 0; flex: 1; }
.hy-threshold .th-profile-meta .name {
  font-family: 'Cormorant Garamond', serif; font-size: 1.25rem;
  color: var(--ink, #efe9e0); margin: 0 0 0.15rem; word-break: break-word;
}
.hy-threshold .th-profile-meta .handle {
  font-family: 'Space Mono', monospace; font-size: 0.58rem;
  color: #a78bfa; letter-spacing: 0.04em;
}
.hy-threshold .th-bio {
  font-size: 0.82rem; line-height: 1.55; color: var(--ink-dim);
  margin: 0.5rem 0 0; white-space: pre-wrap;
}
.hy-threshold .th-links { margin: 0.5rem 0 0; padding: 0; list-style: none; }
.hy-threshold .th-links a {
  font-size: 0.72rem; color: #35c98f; text-decoration: none;
  border-bottom: 1px solid rgba(53,201,143,0.25);
}
.hy-threshold .th-links a:hover { color: var(--ink); }
.hy-threshold .th-form label {
  display: block; font-family: 'Space Mono', monospace;
  font-size: 0.48rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--ink-dim); margin: 0.55rem 0 0.25rem;
}
.hy-threshold .th-form input,
.hy-threshold .th-form textarea {
  width: 100%; box-sizing: border-box;
  font: inherit; font-size: 0.85rem; color: var(--ink, #efe9e0);
  background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px; padding: 0.45rem 0.55rem;
}
.hy-threshold .th-form textarea { min-height: 4.5rem; resize: vertical; }
.hy-threshold .th-form .hint {
  font-size: 0.68rem; color: var(--ink-dim); margin: 0.2rem 0 0;
}
.hy-threshold .th-form-status {
  font-size: 0.75rem; margin: 0.5rem 0 0; min-height: 1.2em;
}
.hy-threshold .th-form-status.ok { color: #35c98f; }
.hy-threshold .th-form-status.err { color: #f0a0b0; }
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
      <div class="th-hero">
        <div class="th-hero-top">
          <div>
            <p class="th-eyebrow">IX · Membership</p>
            <h3>Threshold</h3>
            <p class="th-lead" data-role="th-lead">Your passport in the house — rooms you tagged open doors; the rest stay visitor-side.</p>
          </div>
          <div class="th-badge" data-role="th-tier-badge" hidden>
            <span class="tb-v" data-role="th-tier-label">—</span>
            <span class="tb-k">Tier</span>
          </div>
        </div>
      </div>
      <div class="th-body">
        <div class="th-tabs" data-role="th-tabs"></div>
        <div class="th-panel" data-role="th-panel"></div>
      </div>
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
    <div class="th-card">
      <h4>Enter the threshold</h4>
      <p class="th-empty">Create an account and tag up to <strong style="color:var(--ink)">three rooms</strong>. Each tag opens membership perks for that part of the house — music, story, markets, play, and more.</p>
      <p class="th-empty">Cosmic Decay character save only appears if you tag it. Other rooms stay open as a visitor.</p>
      <div class="th-actions">
        <button type="button" class="th-btn primary" data-role="th-open-auth">Sign up · choose rooms</button>
      </div>
    </div>
  `;
  panel.querySelector('[data-role="th-open-auth"]')?.addEventListener('click', () => {
    document.getElementById('auth-badge')?.click();
  });
}

function renderIdentity(panel, member, mode) {
  const tags = taggedSections(member);
  const slots = tagSlotsForTier(member.tier);
  const tierLabel = MEMBERS_CONFIG.tiers[member.tier]?.label || member.tier;
  const tierBlurb = MEMBERS_CONFIG.tiers[member.tier]?.blurb || '';
  const accountId = member.id ? String(member.id).slice(0, 8) : (member.isMock ? 'preview' : '—');
  const roomPct = slots >= 99 ? 100 : Math.min(100, Math.round((tags.length / Math.max(slots, 1)) * 100));
  const benefits = {
    free: ['Up to 3 room tags', 'Profile (name, bio, image, links)', 'Tagged-room perks only'],
    supporter: ['More room tags', 'Priority doors', 'Billing portal'],
    patron: ['All rooms', 'Full passport', 'Deepest access'],
  };
  const blist = benefits[member.tier] || benefits.free;
  const initial = (member.display_name || '?').trim().charAt(0).toUpperCase();
  const links = Array.isArray(member.links) ? member.links : [];
  const linksText = links.map((l) => (typeof l === 'string' ? l : (l && l.url) || '')).filter(Boolean).join('\n');

  if (mode === 'edit') {
    panel.innerHTML = `
      <div class="th-card th-form" data-role="profile-form">
        <h4>Edit profile</h4>
        <p class="th-empty" style="margin-top:0">What members areas usually hold: who you are, how to find you, a short bio, and a picture.</p>
        <label for="th-name">Display name</label>
        <input id="th-name" name="display_name" maxlength="80" value="${escapeHtml(member.display_name || '')}" autocomplete="nickname">
        <label for="th-handle">Handle</label>
        <input id="th-handle" name="handle" maxlength="40" value="${escapeHtml(member.handle || '')}" placeholder="unique name" autocomplete="username">
        <p class="hint">Letters, numbers, underscore — public identity when profiles open.</p>
        <label for="th-bio">Bio</label>
        <textarea id="th-bio" name="bio" maxlength="2000" placeholder="A few lines about you in the house…">${escapeHtml(member.bio || '')}</textarea>
        <label for="th-avatar">Profile image URL</label>
        <input id="th-avatar" name="avatar_url" maxlength="500" value="${escapeHtml(member.avatar_url || '')}" placeholder="https://…">
        <p class="hint">Paste a link to an image (https). File upload arrives with storage later.</p>
        <label for="th-links">Links (one URL per line)</label>
        <textarea id="th-links" name="links" maxlength="2000" placeholder="https://…">${escapeHtml(linksText)}</textarea>
        <label for="th-wallet">Wallet (optional)</label>
        <input id="th-wallet" name="wallet_address" maxlength="128" value="${escapeHtml(member.wallet_address || '')}" placeholder="0x… or similar">
        <div class="th-actions">
          <button type="button" class="th-btn primary" data-action="save-profile">Save profile</button>
          <button type="button" class="th-btn" data-action="cancel-edit-profile">Cancel</button>
        </div>
        <p class="th-form-status" data-role="profile-status" role="status"></p>
      </div>
    `;
    return;
  }

  const avatarBlock = member.avatar_url
    ? `<img class="th-avatar" src="${escapeHtml(member.avatar_url)}" alt="" width="68" height="68" loading="lazy" referrerpolicy="no-referrer">`
    : `<div class="th-avatar-ph" aria-hidden="true">${escapeHtml(initial)}</div>`;

  const linksHtml = links.length
    ? `<ul class="th-links">${links.map((l) => {
        const url = typeof l === 'string' ? l : (l && l.url) || '';
        if (!url) return '';
        let label = url;
        try { label = new URL(url).hostname.replace(/^www\\./, ''); } catch (_) {}
        return `<li><a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a></li>`;
      }).join('')}</ul>`
    : '';

  panel.innerHTML = `
    <div class="th-passport">
      <div class="th-card">
        <h4>Profile</h4>
        <div class="th-profile-head">
          ${avatarBlock}
          <div class="th-profile-meta">
            <p class="name">${escapeHtml(member.display_name || '—')}</p>
            ${member.handle ? `<p class="handle">@${escapeHtml(member.handle)}</p>` : ''}
            <p class="th-account-id">#${escapeHtml(accountId)} · ${escapeHtml(member.email || '')}</p>
          </div>
        </div>
        ${member.bio ? `<p class="th-bio">${escapeHtml(member.bio)}</p>` : `<p class="th-empty">No bio yet — add one so the house knows you.</p>`}
        ${linksHtml}
        <div class="th-stat-grid" style="margin-top:0.75rem">
          <div class="th-stat"><span class="v">${escapeHtml(tierLabel)}</span><span class="k">Tier</span></div>
          <div class="th-stat"><span class="v">${member.isMock ? 'Preview' : 'Live'}</span><span class="k">Session</span></div>
          <div class="th-stat"><span class="v">${tags.length}${slots < 99 ? ' / ' + slots : ' / ∞'}</span><span class="k">Rooms</span></div>
          <div class="th-stat"><span class="v">${links.length}</span><span class="k">Links</span></div>
        </div>
        <div class="th-progress" title="Room tags used"><span style="width:${roomPct}%"></span></div>
        <div class="th-actions">
          <button type="button" class="th-btn primary" data-action="edit-profile">Edit profile</button>
          <button type="button" class="th-btn ghost" data-action="edit-tags">Edit room tags</button>
        </div>
      </div>
      <div class="th-card">
        <h4>Membership</h4>
        <p class="th-empty" style="margin-top:0">${escapeHtml(tierBlurb)}</p>
        <ul class="th-benefits">
          ${blist.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}
        </ul>
        <p class="th-section-label">Tagged rooms</p>
        <div>${tags.map((s) => `<span class="th-tag">${escapeHtml(s.label)}</span>`).join('') || '<p class="th-empty">No rooms tagged yet.</p>'}</div>
        <div class="th-actions">
          ${
            member.tier === 'free'
              ? `<button type="button" class="th-btn primary" data-action="upgrade">Expand rooms</button>`
              : `<button type="button" class="th-btn" data-action="portal">Billing</button>`
          }
          ${member.isMock ? `<button type="button" class="th-btn" data-action="end-preview">End preview</button>` : ''}
        </div>
      </div>
    </div>
  `;
}

function renderDoors(panel, member) {
  const tags = taggedSections(member);
  if (!tags.length) {
    panel.innerHTML = `<p class="th-empty">Tag rooms from Identity to open doors here.</p>`;
    return;
  }
  panel.innerHTML = `
    <p class="th-empty" style="margin-top:0">Doors open for rooms you tagged. Actions appear as each system comes online.</p>
  ` + tags
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
        body += `<p class="th-empty">Draw history syncs across devices when cloud is live.</p>`;
      }
      return `<div class="th-door" data-door="${escapeHtml(s.id)}">
        <div class="th-door-head">
          <h4>${escapeHtml(s.label)}</h4>
          <span class="th-door-status">Open</span>
        </div>
        ${body}
      </div>`;
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
  if (tab === 'identity') renderIdentity(panel, member, root._identityMode || 'view');
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
  if (!member.isSignedIn) root._identityMode = 'view';
  const lead = root.querySelector('[data-role="th-lead"]');
  if (lead) {
    lead.textContent = member.isSignedIn
      ? member.isMock
        ? 'Preview session — tags shape which doors open. Not a live account yet.'
        : 'Your tagged rooms open membership perks. Other rooms stay visitor-side.'
      : 'Tag up to three rooms on sign-up. Paid tiers hold more — and future rooms.';
  }
  const badge = root.querySelector('[data-role="th-tier-badge"]');
  const badgeLabel = root.querySelector('[data-role="th-tier-label"]');
  if (badge && member.isSignedIn) {
    badge.hidden = false;
    if (badgeLabel) badgeLabel.textContent = MEMBERS_CONFIG.tiers[member.tier]?.label || member.tier;
  } else if (badge) {
    badge.hidden = true;
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
    if (action === 'edit-profile') {
      root._identityMode = 'edit';
      root._activeTab = 'identity';
      refreshRoot(root);
      return;
    }
    if (action === 'cancel-edit-profile') {
      root._identityMode = 'view';
      refreshRoot(root);
      return;
    }
    if (action === 'save-profile') {
      const form = root.querySelector('[data-role="profile-form"]');
      const status = root.querySelector('[data-role="profile-status"]');
      if (!form) return;
      const display_name = form.querySelector('#th-name')?.value?.trim() || '';
      const handle = form.querySelector('#th-handle')?.value?.trim() || '';
      const bio = form.querySelector('#th-bio')?.value?.trim() || '';
      const avatar_url = form.querySelector('#th-avatar')?.value?.trim() || '';
      const wallet_address = form.querySelector('#th-wallet')?.value?.trim() || '';
      const linksRaw = form.querySelector('#th-links')?.value || '';
      const links = linksRaw.split(/\n/).map((s) => s.trim()).filter(Boolean).slice(0, 12);
      if (status) { status.className = 'th-form-status'; status.textContent = 'Saving…'; }
      (async () => {
        try {
          const member = root._member;
          if (member?.isMock) {
            const mock = loadMockMember() || { active: true };
            Object.assign(mock, { display_name, handle, bio, avatar_url, wallet_address, links, active: true });
            saveMockMember(mock);
          } else if (authReady) {
            await saveProfile({ display_name, handle, bio, avatar_url, wallet_address, links });
          } else {
            throw new Error('Sign-in is closed for now.');
          }
          root._identityMode = 'view';
          await refreshRoot(root);
        } catch (err) {
          if (status) {
            status.className = 'th-form-status err';
            status.textContent = err?.message || 'Could not save.';
          }
        }
      })();
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
