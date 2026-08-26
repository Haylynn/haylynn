/**
 * Haylynn World Model — single source of truth for the living site.
 * An agent only ever sees / mutates through this surface.
 */

export const WORLD = {
  // ── Canonical sections (enriched metadata) ──
  sections: [
    {
      id: 'home',
      mood: 'mood-purple',
      eyebrow: 'I — Her World',
      title: 'Princess of Reality',
      allowedSelectors: [
        '.section[data-id="home"] .content',
        '.section[data-id="home"] .detail',
        '.section[data-id="home"] .detail-list',
        '.section[data-id="home"] #cosmology-frame',
        '#dots .dot[data-real="0"]'
      ],
      canOpenDetail: true,
      canNavigate: true,
      special: 'cosmology-embed'
    },
    {
      id: 'kaviru',
      mood: 'mood-green',
      eyebrow: 'II — Her Language',
      title: 'Kaviru',
      allowedSelectors: [
        '.section[data-id="kaviru"] .content',
        '.section[data-id="kaviru"] .detail',
        '.section[data-id="kaviru"] #kaviru-frame',
        '.epistemic-row',
        '.vocab-strip'
      ],
      canOpenDetail: true,
      canNavigate: true,
      special: 'kaviru-embed'
    },
    {
      id: 'draw',
      mood: 'mood-purple',
      eyebrow: 'III — The Draw',
      title: 'The Draw',
      allowedSelectors: [
        '.section[data-id="draw"] .content',
        '.section[data-id="draw"] .detail',
        '[data-role="draw-root"]',
        '.hy-draw-btn',
        '.hy-draw-reading'
      ],
      canOpenDetail: true,
      canNavigate: true,
      special: 'kaviru-draw'
    },
    {
      id: 'koruhana',
      mood: 'mood-green',
      eyebrow: 'IV — Koruhana',
      title: 'Koruhana',
      allowedSelectors: [
        '.section[data-id="koruhana"] .content',
        '.section[data-id="koruhana"] .detail'
      ],
      canOpenDetail: true,
      canNavigate: true
    },
    {
      id: 'chronicle',
      mood: 'mood-pink',
      eyebrow: 'V — Her Story',
      title: 'Princess of Reality',
      allowedSelectors: [
        '.section[data-id="chronicle"] .content',
        '.section[data-id="chronicle"] .detail',
        '.volume-list',
        '.book-cover'
      ],
      canOpenDetail: true,
      canNavigate: true
    },
    {
      id: 'haylynn',
      mood: 'mood-purple',
      eyebrow: 'VI — Her Voice',
      title: 'Haylynn',
      allowedSelectors: [
        '.section[data-id="haylynn"] .content',
        '.section[data-id="haylynn"] .detail',
        '.hy-player',
        '.lyric-track',
        '.hy-radio',
        '[data-role="radio-root"]'
      ],
      canOpenDetail: true,
      canNavigate: true,
      special: 'custom-audio-player'
    },
    {
      id: 'hananaru',
      mood: 'mood-green',
      eyebrow: 'VII — Hananaru',
      title: 'Hananaru',
      allowedSelectors: [
        '.section[data-id="hananaru"] .content',
        '.section[data-id="hananaru"] .detail',
        '.product-grid',
        '.product-card'
      ],
      canOpenDetail: true,
      canNavigate: true
    },
    {
      id: 'lymp',
      mood: 'mood-pink',
      eyebrow: 'VIII — Her Sky',
      title: 'Earth & the Void',
      allowedSelectors: [
        '.section[data-id="lymp"] .content',
        '.section[data-id="lymp"] .detail',
        '.sky-tabs',
        '.sky-panel',
        '#nightcam-img',
        '#aurora-img'
      ],
      canOpenDetail: true,
      canNavigate: true,
      special: 'sky-tabs'
    },
    {
      id: 'threshold',
      mood: 'mood-purple',
      eyebrow: 'IX — Threshold',
      title: 'Threshold',
      allowedSelectors: [
        '.section[data-id="threshold"] .content',
        '.section[data-id="threshold"] .detail',
        '.hy-threshold',
        '[data-role="threshold-root"]'
      ],
      canOpenDetail: true,
      canNavigate: true,
      special: 'members-threshold'
    },
    {
      id: 'well',
      mood: 'mood-green',
      eyebrow: 'X — The Well',
      title: 'The Well',
      allowedSelectors: [
        '.section[data-id="well"] .content',
        '.section[data-id="well"] .detail',
        '.hy-well-grid',
        '.hy-well-card'
      ],
      canOpenDetail: true,
      canNavigate: true,
      special: 'offerings-well'
    }
  ],

  // ── Global surfaces the persona may touch ──
  globalAllowed: [
    '#cosmic-bg',
    '#dots',
    '.eyebrow-fixed',
    '.aurora-wash',
    '.star-layer'
  ],

  // ── Allowed action types (English canonical + Kaviru aliases) ──
  // Aliases resolve in validateAction → same handlers.
  actionSchema: {
    navigate:   { required: ['sectionId'], optional: ['smooth'] }, // movi — motion
    openDetail: { required: ['sectionId'] },                       // hana — emergence
    closeDetail:{ required: ['sectionId'] },                       // miru — stillness
    speak:      { required: ['text'], optional: ['lang'] },        // kavi — language
    mutate:     { required: ['selector', 'html'], optional: ['mode'] }, // revi — change
    highlight:  { required: ['selector'], optional: ['duration'] }, // zori — truth/attention
    pulseMood:  { required: ['mood'], optional: ['duration'] },    // awe — weight/significance
    playSound:  { required: ['trackId'] },                         // seri — pattern/loop
    reset:      { required: [], optional: ['sectionId'] }          // solu — impermanence
  },

  /** Kaviru → canonical action type */
  actionAliases: {
    movi: 'navigate',
    hana: 'openDetail',
    miru: 'closeDetail',
    kavi: 'speak',
    revi: 'mutate',
    zori: 'highlight',
    awe: 'pulseMood',
    seri: 'playSound',
    solu: 'reset'
  },

  // ── Live runtime state ──
  state: {
    currentSectionId: 'home',
    detailOpen: false,
    lastMutationAt: null,
    publicStreamActive: false
  }
};

/**
 * Compact, LLM-friendly snapshot of the world.
 */
export function getWorldSnapshot() {
  return {
    sections: WORLD.sections.map(s => ({
      id: s.id,
      title: s.title,
      mood: s.mood,
      canOpenDetail: s.canOpenDetail
    })),
    current: WORLD.state.currentSectionId,
    detailOpen: WORLD.state.detailOpen,
    allowedActions: Object.keys(WORLD.actionSchema),
    kaviruActions: { ...WORLD.actionAliases }
  };
}

/**
 * Validates an action object against the schema + whitelist.
 */
export function validateAction(raw) {
  if (!raw || typeof raw !== 'object' || !raw.type) {
    return { ok: false, error: 'Missing type' };
  }
  // Accept Kaviru aliases (movi, kavi, revi…) or English canonical names
  const type = WORLD.actionAliases[raw.type] || raw.type;
  const schema = WORLD.actionSchema[type];
  if (!schema) {
    return { ok: false, error: `Unknown action type: ${raw.type}` };
  }
  raw = { ...raw, type };
  for (const key of schema.required) {
    if (raw[key] === undefined || raw[key] === null || raw[key] === '') {
      return { ok: false, error: `Missing required field: ${key}` };
    }
  }
  if (raw.selector) {
    const section = WORLD.sections.find(s => s.id === WORLD.state.currentSectionId);
    const allowed = [
      ...(section?.allowedSelectors || []),
      ...WORLD.globalAllowed
    ];
    const isAllowed = allowed.some(a =>
      raw.selector === a || raw.selector.startsWith(a)
    );
    if (!isAllowed) {
      return { ok: false, error: `Selector not in whitelist: ${raw.selector}` };
    }
  }
  return { ok: true, action: raw };
}
