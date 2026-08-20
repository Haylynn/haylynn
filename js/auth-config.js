/**
 * Auth / membership config — safe client-side values only.
 * Anon key is public by design; RLS protects data.
 * Set these when Supabase is ready; leave empty for offline shell.
 */

export const AUTH_CONFIG = {
  supabaseUrl: '',   // e.g. 'https://xxxx.supabase.co'
  supabaseAnonKey: '',

  // Stripe Price IDs from Dashboard → Products
  prices: {
    supporter: '', // price_...
    patron: '',
  },

  tiers: {
    free: { label: 'Visitor', blurb: 'The full surface of the site.' },
    supporter: { label: 'Supporter', blurb: 'Profile, skin, and doors that open first.' },
    patron: { label: 'Patron', blurb: 'Deepest access — worlds, offerings, early thresholds.' },
  },
};
