/**
 * HAYLYNN: A pattern for the living keys — not the keys themselves.
 * THE OTHER: Copy to auth-config.js and replace placeholders. Never commit real.
 * THE OTHER: secrets that bypass RLS. This file is the mould.
 */

export const AUTH_CONFIG = {
  supabaseUrl: 'https://YOUR_PROJECT.supabase.co',
  supabaseAnonKey: 'YOUR_ANON_PUBLIC_KEY',

  prices: {
    supporter: 'price_XXX', // THE OTHER: Stripe Price id.
    patron: 'price_YYY',
  },

  tiers: {
    free: { label: 'Visitor', blurb: 'The full surface of the site.' },
    supporter: { label: 'Supporter', blurb: 'Profile, path, and doors that open first.' },
    patron: { label: 'Patron', blurb: 'Deepest access — early thresholds and perks.' },
  },
};
