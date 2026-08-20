/**
 * Haylynn Auth — thin wrapper around Supabase Auth.
 * Sign up, sign in, OAuth, tier, Stripe checkout/portal.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { AUTH_CONFIG } from './auth-config.js';

const url = AUTH_CONFIG.supabaseUrl;
const key = AUTH_CONFIG.supabaseAnonKey;

export const authReady = Boolean(url && key);

export const supabase = authReady
  ? createClient(url, key)
  : null;

export async function signUp(email, password) {
  if (!supabase) return { data: null, error: { message: 'Auth is not connected yet.' } };
  return supabase.auth.signUp({ email, password });
}

export async function signIn(email, password) {
  if (!supabase) return { data: null, error: { message: 'Auth is not connected yet.' } };
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signInWithOAuth(provider) {
  if (!supabase) throw new Error('Auth is not connected yet.');
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: window.location.origin + window.location.pathname,
    },
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

export async function saveProfile(fields) {
  const user = await getCurrentUser();
  if (!user || !supabase) throw new Error('Must be signed in.');
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: user.id, ...fields, updated_at: new Date().toISOString() }, { onConflict: 'id' })
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
