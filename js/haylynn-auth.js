/**
 * HAYLYNN: If they give a name, keep it as trust. When the vault is not connected,
 * say sign-in is closed — not the name of the blacksmith.
 *
 * THE OTHER: thin client over the configured auth provider. authReady is false while
 * url/key are empty. signUp, signIn, OAuth, tier, checkout only run when ready.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import { AUTH_CONFIG } from './auth-config.js';

const url = AUTH_CONFIG.supabaseUrl;
const key = AUTH_CONFIG.supabaseAnonKey;

export const authReady = Boolean(url && key);

export const supabase = authReady
  ? createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    })
  : null;

export async function signUp(email, password) {
  if (!supabase) return { data: null, error: { message: 'Sign-in is closed for now.' } };
  return supabase.auth.signUp({ email, password });
}

export async function signIn(email, password) {
  if (!supabase) return { data: null, error: { message: 'Sign-in is closed for now.' } };
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signInWithOAuth(provider) {
  if (!supabase) throw new Error('Sign-in is closed for now.');
  // Same-origin only — never accept redirect from query string
  const redirectTo = window.location.origin + window.location.pathname;
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo },
  });
  if (error) throw error;
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getSession() {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/** Returns 'free' | 'supporter' | 'patron', or null if not logged in. */
export async function getCurrentTier() {
  const user = await getCurrentUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('tier, subscription_status')
    .eq('id', user.id)
    .single();
  if (error || !data) return 'free';
  if (data.subscription_status && data.subscription_status !== 'active') return 'free';
  return data.tier || 'free';
}

export async function getProfile() {
  const user = await getCurrentUser();
  if (!user || !supabase) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();
  if (error) return null;
  return data;
}

const PROFILE_ALLOW = new Set([
  'display_name', 'handle', 'bio', 'links', 'avatar_url', 'theme_config', 'wallet_address',
]);

export async function saveProfile(fields) {
  const user = await getCurrentUser();
  if (!user || !supabase) throw new Error('Must be signed in.');
  const clean = { id: user.id, updated_at: new Date().toISOString() };
  if (fields && typeof fields === 'object') {
    for (const [k, v] of Object.entries(fields)) {
      if (!PROFILE_ALLOW.has(k)) continue;
      if (k === 'avatar_url' && v) {
        try {
          const u = new URL(String(v), window.location.origin);
          if (u.protocol !== 'https:' && u.protocol !== 'http:') continue;
          clean[k] = u.href;
        } catch { continue; }
      } else if (k === 'links' && Array.isArray(v)) {
        clean[k] = v.slice(0, 20).map((item) => {
          if (typeof item === 'string') return item.slice(0, 500);
          if (item && typeof item.url === 'string') return { url: item.url.slice(0, 500) };
          return null;
        }).filter(Boolean);
      } else if (typeof v === 'string') {
        clean[k] = v.slice(0, k === 'bio' ? 2000 : 200);
      } else if (k === 'theme_config' && v && typeof v === 'object') {
        clean[k] = v; // validated further server-side / theme module
      }
    }
  }
  const { data, error } = await supabase
    .from('profiles')
    .upsert(clean, { onConflict: 'id' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function startCheckout(priceId) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Must be logged in to subscribe.');
  const session = await getSession();
  const res = await fetch(`${url}/functions/v1/create-checkout-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ priceId }),
  });
  const body = await res.json();
  if (body.error) throw new Error(body.error);
  if (body.url) window.location.href = body.url;
}

export async function openBillingPortal() {
  const session = await getSession();
  if (!session) throw new Error('Must be logged in.');
  const res = await fetch(`${url}/functions/v1/create-portal-session`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${session.access_token}` },
  });
  const body = await res.json();
  if (body.url) window.location.href = body.url;
}
