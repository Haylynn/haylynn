/**
 * Plug-in: public keys only. Leave empty until backends are live.
 * Site stays visitor-safe while these are blank.
 */
export const AUTH_CONFIG = {
  supabaseUrl: '', // https://xxxx.supabase.co
  supabaseAnonKey: '',

  prices: {
    supporter: '', // price_...
    patron: '',
  },

  tiers: {
    free: { label: 'Visitor', blurb: 'The full surface of the site.' },
    supporter: { label: 'Supporter', blurb: 'Profile, path, and doors that open first.' },
    patron: { label: 'Patron', blurb: 'Deepest access — early thresholds and perks.' },
  },
};
