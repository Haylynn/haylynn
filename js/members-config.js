/**
 * Haylynn Threshold (members) — frontend config
 * Leave apiBase empty until the backend is live; UI stays in quiet holding mode.
 */

export const MEMBERS_CONFIG = {
  // e.g. 'https://api.haylynn.example.com'
  apiBase: '',

  // Paths relative to apiBase (adjust when backend exists)
  endpoints: {
    session: '/auth/session',
    magicLink: '/auth/magic-link',
    profile: '/me',
    avatar: '/me/avatar',
    checkout: '/billing/checkout',
    portal: '/billing/portal'
  },

  // Public copy (brand voice — not system status)
  holding: {
    title: 'Threshold',
    line: 'A quieter room behind the scroll — name, likeness, a few links, and the key of patronage.',
    status: 'The door is drawn. The lock is not yet set in the world.'
  },

  tiers: [
    { id: 'public', label: 'Visitor', blurb: 'The full surface of the site — story, language, draw, play.' },
    { id: 'member', label: 'Member', blurb: 'A profile inside the house, and doors that open later — worlds, offerings, deeper tools.' }
  ]
};
