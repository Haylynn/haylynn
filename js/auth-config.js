/**
 * HAYLYNN: Empty until the house is ready to remember. No keys painted for thieves.
 * THE OTHER: SupabaseUrl, anon key, price ids, tier blurbs. Fill from the EXAMPLE.
 * THE OTHER: when going live. Public anon key is expected; RLS is the real wall.
 */

export const AUTH_CONFIG = {
  supabaseUrl: 'https://beskzdlkrshkfyzqilia.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlc2t6ZGxrcnNoa2Z5enFpbGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwNjA2NTksImV4cCI6MjEwMTYzNjY1OX0.ZVydnKRVUD_oqT5AHa0xSPEKIn0frDZHySzyFoyWlQs',

  prices: {
    supporter: '',
    patron: '',
  },

  tiers: {
    free: { label: 'Member', blurb: 'A passport in the house — Path, profile, and the rooms you claim.' },
    supporter: { label: 'Supporter', blurb: 'More rooms, deeper doors, Path still yours.' },
    patron: { label: 'Patron', blurb: 'All rooms, future doors, deepest seat in the house.' },
  },
};
