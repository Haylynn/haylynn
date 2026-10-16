import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import Stripe from 'https://esm.sh/stripe@14.25.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' });
const cors = {
  'Access-Control-Allow-Origin': Deno.env.get('SITE_URL') || '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: cors });

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: cors });

    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data: profile } = await admin.from('profiles').select('stripe_customer_id').eq('id', user.id).single();
    if (!profile?.stripe_customer_id) {
      return new Response(JSON.stringify({ error: 'No billing account' }), { status: 400, headers: cors });
    }

    const site = Deno.env.get('SITE_URL') || 'https://haylynn.github.io/haylynn';
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: site,
    });
    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500, headers: cors });
  }
});
