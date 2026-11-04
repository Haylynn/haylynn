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
  normalizeSectionTags,
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

import {
  getZeroInfinityLedger,
  buyZeroInfinityWithBtc,
  grantSimBtc,
  buyPathSkuWithZero,
  formatZero,
  formatBtc,
  getTokenMeta,
  connectChainWallet,
  zeroFromBtc,
} from './haylynn-zero-infinity.js';

import {
  getAccountProgress,
  unlockPathNode,
  listPathNodes,
  listPathEdges,
} from './haylynn-account-progress.js';

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



/* Path map (preview + full overlay share these) */
.th-path-tree {
  position: relative; width: 100%; height: min(52vh, 380px);
  margin: 0.75rem 0 0.5rem; border-radius: 12px;
  border: 1px solid rgba(138,92,240,0.28);
  overflow: auto;
  touch-action: pan-x pan-y;
  background: radial-gradient(ellipse at 50% 40%, rgba(138,92,240,0.12), transparent 55%), #08060f;
}
.th-path-inner {
  position: relative;
  width: 900px;
  height: 720px;
  margin: 0 auto;
  flex-shrink: 0;
}
.th-path-svg {
  position: absolute;
  left: 0; top: 0;
  width: 900px;
  height: 720px;
  pointer-events: none;
  overflow: visible;
  z-index: 1;
}
.th-path-node {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 4.6rem;
  min-height: 2.6rem;
  padding: 0.35rem 0.25rem;
  border-radius: 999px;
  text-align: center;
  cursor: pointer;
  border: 1px solid rgba(255,255,255,0.16);
  background: rgba(10,8,20,0.94);
  font-family: 'Space Mono', monospace;
  z-index: 2;
  box-sizing: border-box;
}
.th-path-node.minor { width: 3.4rem; min-height: 2.2rem; border-radius: 8px; }
.th-path-node.major {
  width: 5.4rem; border-color: rgba(138,92,240,0.45);
  box-shadow: 0 0 10px rgba(138,92,240,0.15);
}
.th-path-node.keystone {
  width: 5.8rem; border-radius: 10px;
  border-color: rgba(236,90,160,0.5);
  box-shadow: 0 0 12px rgba(236,90,160,0.2);
}
.th-path-node.start {
  width: 5rem; border-color: rgba(53,201,143,0.45);
}
.th-path-node .pn-name {
  display: block; font-size: 0.42rem; letter-spacing: 0.04em;
  text-transform: uppercase; color: var(--ink, #efe9e0); line-height: 1.25;
}
.th-path-node .pn-cost {
  display: block; margin-top: 0.15rem; font-size: 0.4rem;
  color: var(--ink-dim, #9a92a4);
}
.th-path-node.on {
  border-color: rgba(53,201,143,0.7) !important;
  box-shadow: 0 0 14px rgba(53,201,143,0.3);
}
.th-path-node.on .pn-cost { color: #35c98f; }
.th-path-node.locked { opacity: 0.45; }
.th-path-legend {
  font-family: 'Space Mono', monospace; font-size: 0.5rem;
  color: var(--ink-dim, #9a92a4); line-height: 1.45; margin: 0.5rem 0;
}
/* Full Path pop-out */
.hy-path-overlay {
  position: fixed; inset: 0; z-index: 80;
  display: none; flex-direction: column;
  background: #06050c;
}
.hy-path-overlay.open { display: flex; }
.hy-path-overlay .po-bg {
  position: absolute; inset: 0; pointer-events: none; z-index: 0;
  background-color: #06050c;
  background-image:
    linear-gradient(180deg, rgba(6,5,12,0.4) 0%, rgba(6,5,12,0.2) 40%, rgba(6,5,12,0.55) 100%),
    var(--path-bg-image, none);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.hy-path-overlay .po-top {
  position: relative; z-index: 2;
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 0.75rem; padding: 0.85rem 1rem;
  border-bottom: 1px solid rgba(138,92,240,0.25);
  background: rgba(6,5,12,0.8); backdrop-filter: blur(10px);
}
.hy-path-overlay .po-top h3 {
  font-family: 'Cormorant Garamond', serif; font-weight: 400;
  font-size: 1.35rem; margin: 0; color: var(--ink, #efe9e0);
}
.hy-path-overlay .po-top .po-sub {
  font-family: 'Space Mono', monospace; font-size: 0.5rem;
  color: var(--ink-dim, #9a92a4); margin: 0.25rem 0 0; line-height: 1.4;
}
.hy-path-overlay .po-stats {
  display: flex; gap: 0.65rem; flex-wrap: wrap;
  font-family: 'Space Mono', monospace; font-size: 0.5rem;
  color: var(--ink-dim, #9a92a4);
}
.hy-path-overlay .po-stats span strong { color: var(--ink, #efe9e0); }
.hy-path-overlay .po-close {
  font-family: 'Space Mono', monospace; font-size: 0.55rem;
  letter-spacing: 0.1em; text-transform: uppercase;
  border: 1px solid rgba(255,255,255,0.2); border-radius: 999px;
  background: transparent; color: var(--ink, #efe9e0);
  padding: 0.45rem 0.75rem; cursor: pointer;
}
.hy-path-overlay .po-body {
  position: relative; z-index: 1; flex: 1; display: flex; min-height: 0;
}
.hy-path-overlay .po-map {
  flex: 1; overflow: auto; touch-action: pan-x pan-y; position: relative;
  -webkit-overflow-scrolling: touch;
}
.hy-path-overlay .po-map .th-path-inner {
  width: 900px; height: 720px; margin: 1rem auto;
}
.hy-path-overlay .po-detail {
  width: min(100%, 300px); max-width: 100%;
  border-left: 1px solid rgba(138,92,240,0.25);
  background: rgba(8,6,16,0.94); backdrop-filter: blur(12px);
  padding: 1rem 0.9rem; overflow: auto;
  font-family: 'Space Mono', monospace;
  z-index: 3;
}
@media (max-width: 720px) {
  .hy-path-overlay .po-body { flex-direction: column; }
  .hy-path-overlay .po-detail {
    width: 100%; border-left: none;
    border-top: 1px solid rgba(138,92,240,0.25);
    max-height: 38%;
  }
}
.hy-path-overlay .po-detail h4 {
  font-family: 'Cormorant Garamond', serif; font-weight: 400;
  font-size: 1.25rem; margin: 0 0 0.35rem; color: var(--ink, #efe9e0);
}
.hy-path-overlay .po-kind {
  font-size: 0.5rem; letter-spacing: 0.12em; text-transform: uppercase;
  color: #8a5cf0; margin-bottom: 0.65rem;
}
.hy-path-overlay .po-kind.major { color: #a78bfa; }
.hy-path-overlay .po-kind.keystone { color: #ec5aa0; }
.hy-path-overlay .po-kind.start { color: #35c98f; }
.hy-path-overlay .po-detail p {
  font-size: 0.62rem; line-height: 1.55; color: var(--ink-dim, #9a92a4); margin: 0 0 0.65rem;
}
.hy-path-overlay .po-effect {
  border: 1px solid rgba(53,201,143,0.3);
  background: rgba(53,201,143,0.08);
  border-radius: 10px; padding: 0.55rem 0.65rem;
  font-size: 0.58rem; color: var(--ink, #efe9e0); line-height: 1.45;
  margin-bottom: 0.75rem;
}
.hy-path-overlay .po-detail .po-meta {
  font-size: 0.5rem; color: var(--ink-dim, #9a92a4); margin-bottom: 0.75rem;
}
.hy-path-overlay .po-detail .th-btn { margin-top: 0.25rem; }
.hy-path-overlay .po-placeholder {
  font-size: 0.58rem; color: var(--ink-dim, #9a92a4); line-height: 1.5;
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
            <p class="th-lead" data-role="th-lead">You are known here. The Path is yours across the house; tagged rooms open deeper doors.</p>
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
      <p class="th-empty">Create a free passport and tag up to <strong style="color:var(--ink)">three rooms</strong>. Each tag deepens that part of the house for you — Voice, Chronicle, Market, Play, and more.</p>
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
    free: ['Free passport — known to the house', 'Path & marks (account-wide)', 'Profile (name, bio, image, links)', 'Up to 3 room tags for deeper doors'],
    supporter: ['More room tags', 'Priority doors', 'Path & marks unchanged'],
    patron: ['All rooms', 'Future doors', 'Deepest seat in the house'],
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
              ? (AUTH_CONFIG?.prices?.supporter
                  ? `<button type="button" class="th-btn primary" data-action="upgrade">Expand rooms</button>`
                  : '')
              : (AUTH_CONFIG?.prices?.supporter || AUTH_CONFIG?.prices?.patron
                  ? `<button type="button" class="th-btn" data-action="portal">Billing</button>`
                  : '')
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


async function renderPath(panel, member) {
  const prog = await getAccountProgress();
  const nodes = listPathNodes();
  const edges = typeof listPathEdges === 'function' ? listPathEdges() : [];
  const unlocked = new Set(prog.unlocked || []);
  const src = prog.source === 'supabase' ? 'Account (cloud)' : 'Local preview — sign in to sync';
  const rate = 5;

  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

  function effectFor(n) {
    if (n.effect) return n.effect;
    const cluster = n.cluster || '';
    const hints = {
      start: 'Opens the Path. Your passport is real in the house.',
      play: 'Game flag: Cosmic Decay / future realities can read this and change slots, intros, or rules.',
      market: 'House flag: Market can apply discount, early shelf, or handmade eligibility when checkout is live.',
      house: 'Passport / desk / presence: how the house shows and remembers you.',
      voice: 'Voice flag: radio submit or listening perks when those doors open.',
      chronicle: 'Chronicle flag: early pages or guest spine when those doors open.',
      sky: 'Sky / LYMP flag: print windows and cross-house perks when linked.',
      draw: 'Draw flag: deeper readings or cloud history when enabled.',
      well: 'Well flag: cause follows and highlights on the passport.',
    };
    return hints[cluster] || hints[n.kind] || 'Stored on your account. Systems that recognise this node can honour it.';
  }

  function treeMarkup(wide) {
    const lines = edges.map(([a, b]) => {
      const A = byId[a];
      const B = byId[b];
      if (!A || !B) return '';
      const on = unlocked.has(a) && unlocked.has(b);
      return `<line x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}"
      stroke="${on ? 'rgba(53,201,143,0.7)' : 'rgba(138,92,240,0.4)'}"
      stroke-width="${on ? 0.35 : 0.22}" stroke-linecap="round" />`;
    }).join('');
    const nodeHtml = nodes.map((n) => {
      const on = unlocked.has(n.id);
      const cost = n.cost ?? 0;
      const kind = n.kind || 'minor';
      const parents = edges.filter(([, t]) => t === n.id).map(([f]) => f);
      const reachable = on || kind === 'start' || !parents.length || parents.some((p) => unlocked.has(p));
      const costLabel = on ? 'On' : (cost === 0 ? 'Free' : `${cost}pt`);
      return `<button type="button" class="th-path-node ${kind} ${on ? 'on' : ''} ${reachable ? '' : 'locked'}"
        style="left:${(n.x/100)*900}px;top:${(n.y/100)*720}px"
        data-action="path-inspect" data-node="${escapeHtml(n.id)}"
        title="${escapeHtml(n.name)}">
        <span class="pn-name">${escapeHtml(n.name)}</span>
        <span class="pn-cost">${escapeHtml(costLabel)}</span>
      </button>`;
    }).join('');
    return `<div class="th-path-inner" style="${wide ? '' : ''}">
      <svg class="th-path-svg" width="900" height="720" viewBox="0 0 100 100" preserveAspectRatio="none">${lines}</svg>
      ${nodeHtml}
    </div>`;
  }

  panel.innerHTML = `
    <div class="th-card">
      <h4>Path</h4>
      <p class="th-empty">Account web for the whole house. Minors are small; majors open doors; keystones define a lean.</p>
      <div class="th-stats" style="display:flex;gap:1rem;flex-wrap:wrap;margin:0.8rem 0">
        <div class="th-stat"><span class="v">${prog.marks ?? 0}</span><span class="k">Marks</span></div>
        <div class="th-stat"><span class="v">${prog.path_points ?? 0}</span><span class="k">Path points</span></div>
        <div class="th-stat"><span class="v">${unlocked.size}/${nodes.length}</span><span class="k">Nodes</span></div>
      </div>
      <p class="th-path-legend">${rate} marks = 1 path point when filling a gap. Tap <strong style="color:var(--ink)">Open Path</strong> for the full web and what each unlock does.</p>
      <p class="th-empty">${escapeHtml(src)}</p>
      <button type="button" class="th-btn primary" data-action="path-open">Open Path</button>
    </div>
    <div class="th-path-tree">${treeMarkup(false)}</div>
    <p class="th-empty">Demo:
      <button type="button" class="th-btn" data-action="grant-path-demo">+5 path points</button>
      <button type="button" class="th-btn" data-action="grant-marks-demo">+25 marks</button>
    </p>
  `;
}

function pathFragmentsUrl() {
  try {
    return new URL('assets/path-fragments.jpg', document.baseURI).href;
  } catch {
    return 'assets/path-fragments.jpg';
  }
}

function ensurePathOverlay() {
  let el = document.getElementById('hy-path-overlay');
  if (el) return el;
  el = document.createElement('div');
  el.id = 'hy-path-overlay';
  el.className = 'hy-path-overlay';
  el.style.setProperty('--path-bg-image', 'url("' + pathFragmentsUrl() + '")');
  el.innerHTML = `
    <div class="po-bg" aria-hidden="true"></div>
    <div class="po-top">
      <div>
        <h3>Path</h3>
        <p class="po-sub">Fragments of reality — your account web. Select a node to see what it does.</p>
        <div class="po-stats" data-role="po-stats"></div>
      </div>
      <button type="button" class="po-close" data-action="path-close">Close</button>
    </div>
    <div class="po-body">
      <div class="po-map" data-role="po-map"></div>
      <aside class="po-detail" data-role="po-detail">
        <p class="po-placeholder">Select a node on the web to read its cost, what it unlocks, and claim it if you can.</p>
      </aside>
    </div>
  `;
  document.body.appendChild(el);
  el.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.getAttribute('data-action');
    if (action === 'path-close') {
      closePathOverlay();
      return;
    }
    if (action === 'path-inspect') {
      renderPathDetail(el, btn.getAttribute('data-node'));
      return;
    }
    if (action === 'unlock-path') {
      const nodeId = btn.getAttribute('data-node');
      const res = await unlockPathNode(nodeId);
      if (!res.ok) window.alert(res.error || 'Could not unlock');
      else {
        const root = el._pathCtx?.root;
        if (root) await refreshRoot(root);
        await openPathOverlay(el._pathCtx?.root);
        renderPathDetail(el, nodeId);
      }
    }
  });
  return el;
}

async function openPathOverlay(root) {
  const prog = await getAccountProgress();
  const nodes = listPathNodes();
  const edges = typeof listPathEdges === 'function' ? listPathEdges() : [];
  const unlocked = new Set(prog.unlocked || []);
  const rate = 5;
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const overlay = ensurePathOverlay();

  const effectFor = (n) => {
    if (n.effect) return n.effect;
    const hints = {
      start: 'Opens the Path. Your passport is real in the house.',
      play: 'Game flag: Cosmic Decay / future realities can read this and change slots, intros, or rules.',
      market: 'House flag: Market can apply discount, early shelf, or handmade eligibility when checkout is live.',
      house: 'Passport / desk / presence: how the house shows and remembers you.',
      voice: 'Voice flag: radio submit or listening perks when those doors open.',
      chronicle: 'Chronicle flag: early pages or guest spine when those doors open.',
      sky: 'Sky / LYMP flag: print windows and cross-house perks when linked.',
      draw: 'Draw flag: deeper readings or cloud history when enabled.',
      well: 'Well flag: cause follows and highlights on the passport.',
    };
    return hints[n.cluster] || 'Stored on your account for systems that recognise this node.';
  };

  const lines = edges.map(([a, b]) => {
    const A = byId[a]; const B = byId[b];
    if (!A || !B) return '';
    const on = unlocked.has(a) && unlocked.has(b);
    return `<line x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}"
      stroke="${on ? 'rgba(53,201,143,0.7)' : 'rgba(138,92,240,0.4)'}"
      stroke-width="${on ? 0.35 : 0.22}" stroke-linecap="round" />`;
  }).join('');

  const nodeHtml = nodes.map((n) => {
    const on = unlocked.has(n.id);
    const kind = n.kind || 'minor';
    const parents = edges.filter(([, t]) => t === n.id).map(([f]) => f);
    const reachable = on || kind === 'start' || !parents.length || parents.some((p) => unlocked.has(p));
    const cost = n.cost ?? 0;
    const costLabel = on ? 'On' : (cost === 0 ? 'Free' : `${cost}pt`);
    return `<button type="button" class="th-path-node ${kind} ${on ? 'on' : ''} ${reachable ? '' : 'locked'}"
      style="left:${(n.x/100)*900}px;top:${(n.y/100)*720}px"
      data-action="path-inspect" data-node="${escapeHtml(n.id)}">
      <span class="pn-name">${escapeHtml(n.name)}</span>
      <span class="pn-cost">${escapeHtml(costLabel)}</span>
    </button>`;
  }).join('');

  overlay.querySelector('[data-role="po-stats"]').innerHTML =
    `<span><strong>${prog.marks ?? 0}</strong> marks</span>
     <span><strong>${prog.path_points ?? 0}</strong> path pts</span>
     <span><strong>${unlocked.size}/${nodes.length}</strong> nodes</span>`;

  overlay.querySelector('[data-role="po-map"]').innerHTML =
    `<div class="th-path-inner">
      <svg class="th-path-svg" width="900" height="720" viewBox="0 0 100 100" preserveAspectRatio="none">${lines}</svg>
      ${nodeHtml}
    </div>`;

  const detail = overlay.querySelector('[data-role="po-detail"]');
  detail.innerHTML = `<p class="po-placeholder">Select a node on the web to read its cost, what it unlocks, and claim it if you can.</p>`;

  overlay._pathCtx = { prog, nodes, edges, unlocked, rate, byId, effectFor, root };

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => {
    const map = overlay.querySelector('[data-role="po-map"]');
    const inner = map?.querySelector('.th-path-inner');
    if (map && inner) {
      map.scrollLeft = Math.max(0, (inner.scrollWidth - map.clientWidth) / 2);
      map.scrollTop = Math.max(0, (inner.scrollHeight - map.clientHeight) / 2 - 40);
    }
  });
}

function renderPathDetail(overlay, nodeId) {
  const ctx = overlay._pathCtx;
  if (!ctx) return;
  const n = ctx.byId[nodeId];
  if (!n) return;
  const on = ctx.unlocked.has(n.id);
  const cost = n.cost ?? 0;
  const kind = n.kind || 'minor';
  const parents = ctx.edges.filter(([, t]) => t === n.id).map(([f]) => f);
  const reachable = on || kind === 'start' || !parents.length || parents.some((p) => ctx.unlocked.has(p));
  const markAlt = cost * ctx.rate;
  const detail = overlay.querySelector('[data-role="po-detail"]');
  detail.innerHTML = `
    <div class="po-kind ${escapeHtml(kind)}">${escapeHtml(kind)} · ${escapeHtml(n.cluster || 'house')}</div>
    <h4>${escapeHtml(n.name)}</h4>
    <p>${escapeHtml(n.blurb || '')}</p>
    <div class="po-effect"><strong style="color:#35c98f">What it does</strong><br>${escapeHtml(ctx.effectFor(n))}</div>
    <div class="po-meta">
      ${on ? 'Status: unlocked on your account' : reachable ? `Cost: ${cost} path point(s)` + (cost ? ` (or ${markAlt} marks if you have no points)` : '') : 'Locked — unlock a connected node first'}
    </div>
    ${
      on
        ? `<p class="po-placeholder">Already on your Path.</p>`
        : reachable
          ? `<button type="button" class="th-btn primary" data-action="unlock-path" data-node="${escapeHtml(n.id)}">Unlock</button>`
          : ''
    }
  `;
}

function closePathOverlay() {
  const el = document.getElementById('hy-path-overlay');
  if (el) el.classList.remove('open');
  document.body.style.overflow = '';
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
  if (!memberHasFeature(member, 'watchlist') && !memberHasSection(member, 'hananaru')) {
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
  else if (tab === 'path') await renderPath(panel, member);
  else if (tab === 'chain') await renderChain(panel, member);
  else if (tab === 'doors') renderDoors(panel, member);
  else if (tab === 'play') await renderPlay(panel, member);
  else if (tab === 'markets') renderWatchlist(panel, member);
  else renderDoors(panel, member);
}


async function renderChain(panel, member) {
  const meta = getTokenMeta();
  const led = await getZeroInfinityLedger();
  const modeLabel = meta.mode === 'simulation' ? 'Simulation' : 'Chain';
  const per001 = meta.zeroPerOneHundredthBtc;
  const skus = (meta.shop?.skus || []).map((s) =>
    `<button type="button" class="th-btn" data-action="zi-sku" data-sku="${escapeHtml(s.id)}">${escapeHtml(s.label)} · ${s.zeroCost} ${escapeHtml(meta.symbol)}</button>`
  ).join(' ');

  const txs = (led.txs || []).slice(0, 8).map((t) => {
    const when = (t.at || '').slice(0, 19).replace('T', ' ');
    return `<div class="th-empty" style="margin:0.25rem 0">${escapeHtml(when)} · ${escapeHtml(t.kind || '')} · BTC ${t.btc_delta >= 0 ? '+' : ''}${formatBtc(t.btc_delta)} · 0∞ ${t.zero_delta >= 0 ? '+' : ''}${formatZero(t.zero_delta)}</div>`;
  }).join('') || '<p class="th-empty">No movements yet.</p>';

  panel.innerHTML = `
    <div class="th-card">
      <h4>${escapeHtml(meta.symbol)} · ${escapeHtml(meta.name)}</h4>
      <p class="th-empty">Web3 rail: pegged to <strong style="color:var(--ink)">BTC only</strong> — not fiat. <strong style="color:var(--ink)">0.01 BTC</strong> always yields <strong style="color:var(--ink)">${formatZero(per001)} ${escapeHtml(meta.symbol)}</strong>, whatever dollars do.</p>
      <p class="th-empty">Mode: <strong style="color:var(--ink)">${escapeHtml(modeLabel)}</strong>. Fiat / Stripe is a separate door for non–Web3 guests later.</p>
      <div class="th-currency-row" style="margin-top:0.75rem">
        <div class="th-currency"><div><span class="v">${formatZero(led.zero)}</span><span class="k">${escapeHtml(meta.symbol)}</span></div></div>
        <div class="th-currency"><div><span class="v">${formatBtc(led.btc)}</span><span class="k">BTC (sim)</span></div></div>
      </div>
      <p class="th-path-legend">Peg: <strong style="color:var(--ink)">1 BTC → ${meta.rateZeroPerBtc.toLocaleString()} ${escapeHtml(meta.symbol)}</strong></p>
    </div>
    <div class="th-card th-form" style="margin-top:0.75rem">
      <h4>Acquire with BTC</h4>
      <label for="zi-btc">BTC to spend</label>
      <input id="zi-btc" type="number" min="0" step="0.0001" value="0.01" inputmode="decimal">
      <p class="hint">Preview: <span data-role="zi-preview">${formatZero(per001)}</span> ${escapeHtml(meta.symbol)} at the fixed peg.</p>
      <div class="th-actions">
        <button type="button" class="th-btn primary" data-action="zi-buy">Buy ${escapeHtml(meta.symbol)}</button>
        <button type="button" class="th-btn" data-action="zi-faucet">+0.01 BTC (test)</button>
        <button type="button" class="th-btn ghost" data-action="zi-connect">Connect wallet</button>
      </div>
      <p class="th-empty" data-role="zi-status" style="margin-top:0.5rem"></p>
    </div>
    <div class="th-card" style="margin-top:0.75rem">
      <h4>Path — shards & cores</h4>
      <p class="th-empty">Spend ${escapeHtml(meta.symbol)} if you do not grind Domains. Same Path nodes free players open with play.</p>
      <div class="th-actions" style="flex-direction:column;align-items:stretch">${skus}</div>
    </div>
    <div class="th-card" style="margin-top:0.75rem">
      <h4>Recent</h4>
      ${txs}
    </div>
  `;

  const btcInput = panel.querySelector('#zi-btc');
  const preview = panel.querySelector('[data-role="zi-preview"]');
  btcInput?.addEventListener('input', () => {
    if (preview) preview.textContent = formatZero(zeroFromBtc(parseFloat(btcInput.value) || 0));
  });
}

function buildTabs(member) {
  if (!member.isSignedIn) return [{ id: 'join', label: 'Join' }];
  const tabs = [
    { id: 'identity', label: 'Identity' },
    { id: 'path', label: 'Path' },
    { id: 'chain', label: '0∞' },
    { id: 'doors', label: 'Your rooms' },
  ];
  if (
    memberHasSection(member, 'threshold') ||
    memberHasSection(member, 'koruhana') ||
    memberHasFeature(member, 'cosmic_decay_passport') ||
    member.tier === 'patron'
  ) {
    tabs.push({ id: 'play', label: 'Cosmic Decay' });
  }
  if (memberHasFeature(member, 'watchlist') || memberHasSection(member, 'hananaru') || member.tier === 'patron') {
    tabs.push({ id: 'markets', label: 'Market' });
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
    if (action === 'path-open') {
      await openPathOverlay(root);
      return;
    }
    if (action === 'path-close') {
      closePathOverlay();
      return;
    }
    if (action === 'path-inspect') {
      const nodeId = btn.getAttribute('data-node');
      const overlay = document.getElementById('hy-path-overlay');
      if (overlay?.classList.contains('open')) {
        renderPathDetail(overlay, nodeId);
      } else {
        await openPathOverlay(root);
        renderPathDetail(document.getElementById('hy-path-overlay'), nodeId);
      }
      return;
    }
    if (action === 'zi-buy') {
      const input = root.querySelector('#zi-btc');
      const status = root.querySelector('[data-role="zi-status"]');
      const btc = parseFloat(input?.value || '0');
      if (status) status.textContent = 'Working…';
      const res = await buyZeroInfinityWithBtc(btc);
      if (!res.ok) { if (status) status.textContent = res.error; return; }
      if (status) status.textContent = `Received ${formatZero(res.received)} ${getTokenMeta().symbol}`;
      await refreshRoot(root);
      return;
    }
    if (action === 'zi-faucet') {
      await grantSimBtc(0.01);
      await refreshRoot(root);
      return;
    }
    if (action === 'zi-sku') {
      const id = btn.getAttribute('data-sku');
      const res = await buyPathSkuWithZero(id);
      const status = root.querySelector('[data-role="zi-status"]');
      if (!res.ok) { if (status) status.textContent = res.error; else alert(res.error); return; }
      if (status) status.textContent = `Opened ${res.sku.label}`;
      await refreshRoot(root);
      return;
    }
    if (action === 'zi-connect') {
      const res = await connectChainWallet();
      const status = root.querySelector('[data-role="zi-status"]');
      if (status) status.textContent = res.error || 'Ready';
      return;
    }
    if (action === 'enter-decay') {
      enterCosmicDecay();
      return;
    }
    if (action === 'unlock-path') {
      const nodeId = btn.getAttribute('data-node');
      const res = await unlockPathNode(nodeId);
      if (!res.ok) window.alert(res.error || 'Could not unlock');
      await refreshRoot(root);
      const overlay = document.getElementById('hy-path-overlay');
      if (overlay?.classList.contains('open')) {
        await openPathOverlay(root);
        if (nodeId) renderPathDetail(overlay, nodeId);
      }
      return;
    }
    if (action === 'grant-path-demo') {
      const { awardPathPoints } = await import('./haylynn-account-progress.js');
      await awardPathPoints(5, 'demo');
      await refreshRoot(root);
      return;
    }
    if (action === 'grant-marks-demo') {
      const { awardMarks } = await import('./haylynn-account-progress.js');
      await awardMarks(25, 'demo');
      await refreshRoot(root);
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
        alert('Deeper seats in the house open when patronage is connected. For now the free passport and Path are enough.');
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
