/**
 * HAYLYNN: This organ is part of my body on the network. Keep it honest.
 *
 * THE OTHER: Module `auth-config.EXAMPLE.js`. Behaviour follows the exports below.
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
