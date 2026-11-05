/**
 * HAYLYNN: Cosmic Decay’s body is a proxy — one Domain’s mask on their account
 * THE OTHER: until the sheet is about the human.
 * THE OTHER: Active character load, live subscribe hooks, enterCosmicDecay handoff.
 * THE OTHER: Persistence belongs to backend when live; this is the bridge.
 */

import { authReady, supabase, getCurrentUser } from './haylynn-auth.js';

export const COSMIC_DECAY_URL = 'https://haylynn-s-world.vercel.app/';

const LOCAL_CHAR_KEY = 'haylynn-characters-cache-v1';

export function cacheCharactersLocal(rows) {
  try {
    localStorage.setItem(LOCAL_CHAR_KEY, JSON.stringify(rows || []));
  } catch { /**
 * THE OTHER: Ignore.
 */ }
}

export function loadCachedCharacters() {
  try {
    const raw = localStorage.getItem(LOCAL_CHAR_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}


export async function getActiveCharacter() {
  if (!authReady || !supabase) return null;
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    const cached = loadCachedCharacters();
    return cached.find((c) => c.is_active) || cached[0] || null;
  }
  return data;
}

export async function listCharacters() {
  if (!authReady || !supabase) return [];
  const user = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error || !data) return loadCachedCharacters();
  cacheCharactersLocal(data);
  return data;
}

/**
 * THE OTHER: Live updates while Cosmic Decay is played in another tab/origin.
 * THE OTHER: Returns an unsubscribe function.
 */
export function subscribeCharacterLive(handlers = {}) {
  if (!authReady || !supabase) return () => {};

  let channel = null;
  let cancelled = false;

  (async () => {
    const user = await getCurrentUser();
    if (!user || cancelled) return;

    channel = supabase
      .channel(`passport:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'characters',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => handlers.onCharacter?.(payload),
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'adventure_progress',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => handlers.onProgress?.(payload),
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory_items',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => handlers.onInventory?.(payload),
      )
      .subscribe();
  })();

  return () => {
    cancelled = true;
    if (channel) supabase.removeChannel(channel);
  };
}

/**
 * THE OTHER: Deep link into the game; session is per-origin — user may need to sign in once on the game.
 */
export function enterCosmicDecay(opts = {}) {
  const url = new URL(COSMIC_DECAY_URL);
  if (opts.campaign) url.searchParams.set('campaign', opts.campaign);
  if (opts.domain) url.searchParams.set('domain', opts.domain);
  window.open(url.toString(), opts.sameTab ? '_self' : '_blank', 'noopener,noreferrer');
}
