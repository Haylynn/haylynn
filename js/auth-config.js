/**
 * HAYLYNN: Space for public keys only. Teeth of the lock stay off this glass.
 *
 * THE OTHER: supabaseUrl, supabaseAnonKey, price ids — empty until you fill them
 * in a copy that is safe to publish. Service secrets never land here.
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
