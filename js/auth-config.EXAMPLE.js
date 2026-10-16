/**
 * Copy to auth-config.js and fill values. Never commit real keys to a public repo
 * if you prefer — anon key is designed to be public WITH RLS; service_role is not.
 */
export const AUTH_CONFIG = {
  supabaseUrl: 'https://YOUR_PROJECT.supabase.co',
  supabaseAnonKey: 'YOUR_ANON_PUBLIC_KEY',

  prices: {
    supporter: 'price_XXX', // Stripe Price id
    patron: 'price_YYY',
  },

  tiers: {
    free: { label: 'Visitor', blurb: 'The full surface of the site.' },
    supporter: { label: 'Supporter', blurb: 'Profile, path, and doors that open first.' },
    patron: { label: 'Patron', blurb: 'Deepest access — early thresholds and perks.' },
  },
};
