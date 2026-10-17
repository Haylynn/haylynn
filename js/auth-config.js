/**
 * Plug-in: public keys only. Leave empty until backends are live.
 * Site stays visitor-safe while these are blank.
 * Copy values from auth-config.EXAMPLE.js when going live.
 */
export const AUTH_CONFIG = {
  supabaseUrl: '', 'https://beskzdlkrshkfyzqilia.supabase.co',
  supabaseAnonKey: '', sb_publishable_T11LnzPXxtf2wPX6KY6i2A_lvoqJuvD, 

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
