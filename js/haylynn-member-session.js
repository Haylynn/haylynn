/**
 * Member session helper — works offline (local mock) and online (profile tags).
 * Pre-Supabase: preview the full tagged Threshold experience.
 */
import { MEMBERS_CONFIG, tagSlotsForTier, hasSectionTag, hasFeature } from './members-config.js';

const MOCK_KEY = 'haylynn-member-mock-v1';
const TAGS_KEY = 'haylynn-section-tags-v1';

export function loadMockMember() {
  try {
    const raw = localStorage.getItem(MOCK_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveMockMember(member) {
  try {
    if (!member) localStorage.removeItem(MOCK_KEY);
    else localStorage.setItem(MOCK_KEY, JSON.stringify(member));
  } catch { /* ignore */ }
}

export function loadLocalTags() {
  try {
    const raw = localStorage.getItem(TAGS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveLocalTags(tags) {
  try {
    localStorage.setItem(TAGS_KEY, JSON.stringify(tags || []));
  } catch { /* ignore */ }
}

/**
 * Build a display member from mock or live profile fields.
 */
export function normalizeMember({
  user = null,
  profile = null,
  mock = null,
  tier = 'free',
} = {}) {
  if (mock?.active) {
    return {
      id: mock.id || 'mock-local',
      email: mock.email || 'preview@local',
      display_name: mock.display_name || 'Preview member',
      handle: mock.handle || '',
      bio: mock.bio || '',
      avatar_url: mock.avatar_url || '',
      links: Array.isArray(mock.links) ? mock.links : [],
      wallet_address: mock.wallet_address || '',
      tier: mock.tier || 'free',
      section_tags: Array.isArray(mock.section_tags) ? mock.section_tags : loadLocalTags(),
      isMock: true,
      isSignedIn: true,
    };
  }
  if (user) {
    const tags =
      (Array.isArray(profile?.section_tags) && profile.section_tags.length
        ? profile.section_tags
        : loadLocalTags()) || [];
    return {
      id: user.id,
      email: user.email,
      display_name: profile?.display_name || user.email?.split('@')[0] || 'Member',
      handle: profile?.handle || '',
      bio: profile?.bio || '',
      avatar_url: profile?.avatar_url || '',
      links: Array.isArray(profile?.links) ? profile.links : [],
      wallet_address: profile?.wallet_address || '',
      tier: profile?.tier || tier || 'free',
      section_tags: tags,
      isMock: false,
      isSignedIn: true,
      profile,
    };
  }
  return {
    id: null,
    email: null,
    display_name: null,
    handle: '',
    bio: '',
    avatar_url: '',
    links: [],
    wallet_address: '',
    tier: 'free',
    section_tags: [],
    isMock: false,
    isSignedIn: false,
  };
}

export function memberHasSection(member, sectionId) {
  const tier = member?.tier || 'free';
  const slots = tagSlotsForTier(tier);
  if (tier === 'patron' || slots >= 99) return true;
  return hasSectionTag(member?.section_tags, sectionId);
}

export function memberHasFeature(member, feature) {
  const tier = member?.tier || 'free';
  if (tier === 'patron' && tagSlotsForTier(tier) >= 99) {
    return hasFeature(['*'], feature, tier);
  }
  return hasFeature(member?.section_tags || [], feature, tier);
}

export function clampTags(tags, tier = 'free') {
  const slots = tagSlotsForTier(tier);
  const valid = new Set(MEMBERS_CONFIG.sections.map((s) => s.id));
  const out = [];
  for (const id of tags || []) {
    if (id === '*' && slots >= 99) return ['*'];
    if (!valid.has(id)) continue;
    if (!out.includes(id)) out.push(id);
    if (out.length >= slots) break;
  }
  return out;
}

export { MEMBERS_CONFIG, tagSlotsForTier, hasSectionTag, hasFeature };
