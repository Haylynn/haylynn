/**
 * HAYLYNN: This organ is part of my body on the network. Keep it honest.
 *
 * THE OTHER: Module `members-config.js`. Behaviour follows the exports below.
 */

export const MEMBERS_CONFIG = {
  /** Max rooms free accounts may tag at signup (and until upgrade). */
  defaultTagSlots: 3,

  tiers: {
    free: {
      label: 'Member',
      tagSlots: 3,
      futureRooms: false,
      blurb: 'A free passport — Path & marks for the whole house, plus three rooms that open deeper doors.',
    },
    supporter: {
      label: 'Supporter',
      tagSlots: 6,
      futureRooms: false,
      blurb: 'More room tags and priority doors — same Path, wider house.',
    },
    patron: {
      label: 'Patron',
      tagSlots: 99,
      futureRooms: true,
      blurb: 'Every open room and every room still to open.',
    },
  },

  /**
   * Taggable scroll sections. id should match CONTENT section ids where possible.
   * perkLine = one line shown on the signup picker.
   */
  sections: [
    {
      id: 'presence',
      label: 'Enter',
      eyebrow: '0 — Enter',
      perkLine: 'Marks when the house speaks; member listening log later.',
      features: ['presence_log'],
    },
    {
      id: 'home',
      label: 'World',
      eyebrow: 'I — World',
      perkLine: 'World notes and cosmology bookmarks.',
      features: ['world_notes'],
    },
    {
      id: 'kaviru',
      label: 'Kaviru',
      eyebrow: 'II — Her Language',
      perkLine: 'Study lists and saved language progress.',
      features: ['kaviru_study'],
    },
    {
      id: 'draw',
      label: 'The Draw',
      eyebrow: 'III — The Draw',
      perkLine: 'Cloud draw history across devices.',
      features: ['draw_cloud'],
    },
    {
      id: 'koruhana',
      label: 'Play',
      eyebrow: 'IV — Play',
      perkLine: 'Game shelf saves and Play marks.',
      features: ['koruhana_save'],
    },
    {
      id: 'chronicle',
      label: 'Chronicle',
      eyebrow: 'V — Her Story',
      perkLine: 'Reading shelf; guest title listing when open.',
      features: ['reading_shelf', 'guest_book_promo'],
    },
    {
      id: 'haylynn',
      label: 'Voice',
      eyebrow: 'VI — Her Voice',
      perkLine: 'Radio submit queue and listening perks.',
      features: ['radio_submit', 'radio_queue'],
    },
    {
      id: 'hananaru',
      label: 'Market',
      eyebrow: 'VII — Market',
      perkLine: 'Member drops and acquire windows.',
      features: ['hananaru_drops', 'watchlist'],
    },
    {
      id: 'lymp',
      label: 'LYMP',
      eyebrow: 'VIII — LYMP',
      perkLine: 'Member gallery submit when open.',
      features: ['lymp_submit'],
    },
    {
      id: 'threshold',
      label: 'Play · Cosmic Decay',
      eyebrow: 'IX — Threshold / Play',
      perkLine: 'Persistent character, passport, inventory.',
      features: ['cosmic_decay_passport', 'character_save', 'inventory'],
    },
    {
      id: 'well',
      label: 'The Well',
      eyebrow: 'X — The Well',
      perkLine: 'Follow causes and donor marks.',
      features: ['well_follow'],
    }
  ],

  demoTheme: {
    themeName: 'Void Bloom',
    colors: {
      primary: '#8a5cf0',
      secondary: '#35c98f',
      background: '#0a0814',
      surface: '#16122a',
      text: '#efe9e0',
      accent: '#ec5aa0',
    },
    typography: { fontStyle: 'serif' },
    geometry: { borderRadius: 'round' },
    customEffects: { glow: true, scanlines: false, glassmorphism: true },
  },
};

export function sectionById(id) {
  return MEMBERS_CONFIG.sections.find((s) => s.id === id) || null;
}

export function tagSlotsForTier(tier) {
  const t = MEMBERS_CONFIG.tiers[tier] || MEMBERS_CONFIG.tiers.free;
  return t.tagSlots ?? MEMBERS_CONFIG.defaultTagSlots;
}

export function hasSectionTag(tags, sectionId) {
  if (!Array.isArray(tags)) return false;
  if (tags.includes('*')) return true;
  return tags.includes(sectionId);
}

export function hasFeature(tags, feature, tier = 'free') {
  const t = MEMBERS_CONFIG.tiers[tier] || MEMBERS_CONFIG.tiers.free;
  if (t.futureRooms && tags?.includes('*')) return true;
  if (tier === 'patron' && (tags?.includes('*') || tagSlotsForTier(tier) >= 99)) {
    /* patron with all-rooms still needs section for feature unless * */
  }
  const owned = new Set();
  for (const id of tags || []) {
    if (id === '*') {
      MEMBERS_CONFIG.sections.forEach((s) => s.features.forEach((f) => owned.add(f)));
      break;
    }
    const sec = sectionById(id);
    sec?.features?.forEach((f) => owned.add(f));
  }
  return owned.has(feature);
}


/** Drop retired tag ids (e.g. virtual markets) so old accounts clean up. */
export function normalizeSectionTags(tags) {
  if (!Array.isArray(tags)) return [];
  const retired = new Set(['markets']);
  const map = { markets: 'hananaru' };
  const out = [];
  for (const t of tags) {
    if (t === '*') {
      out.push('*');
      continue;
    }
    const id = map[t] || t;
    if (retired.has(t) && id === t) continue;
    if (!out.includes(id)) out.push(id);
  }
  return out;
}
