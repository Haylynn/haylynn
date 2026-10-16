// Stripe webhook — sole authority for tier / subscription_status updates.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import Stripe from 'https://esm.sh/stripe@14.25.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' });
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;
const priceSupporter = Deno.env.get('STRIPE_PRICE_SUPPORTER') || '';
const pricePatron = Deno.env.get('STRIPE_PRICE_PATRON') || '';

function tierFromPrice(priceId: string): 'supporter' | 'patron' | 'free' {
  if (priceId === pricePatron) return 'patron';
  if (priceId === priceSupporter) return 'supporter';
  return 'free';
}

Deno.serve(async (req) => {
  const sig = req.headers.get('stripe-signature');
  if (!sig) return new Response('No signature', { status: 400 });

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature failed', err);
    return new Response('Invalid signature', { status: 400 });
  }

  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id || session.metadata?.supabase_user_id;
        if (!userId || session.mode !== 'subscription') break;
        const subId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;
        let tier: 'supporter' | 'patron' | 'free' = 'supporter';
        if (subId) {
          const sub = await stripe.subscriptions.retrieve(subId);
          const priceId = sub.items.data[0]?.price?.id || '';
          tier = tierFromPrice(priceId);
          await admin.from('profiles').update({
            tier,
            subscription_status: sub.status,
            stripe_customer_id: typeof session.customer === 'string' ? session.customer : session.customer?.id,
            stripe_subscription_id: subId,
            updated_at: new Date().toISOString(),
          }).eq('id', userId);
        }
        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.supabase_user_id;
        const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer?.id;
        const priceId = sub.items.data[0]?.price?.id || '';
        const tier = event.type === 'customer.subscription.deleted' || sub.status === 'canceled'
          ? 'free'
          : tierFromPrice(priceId);
        const status = sub.status;
        let q = admin.from('profiles').update({
          tier,
          subscription_status: status,
          stripe_subscription_id: sub.id,
          updated_at: new Date().toISOString(),
        });
        if (userId) q = q.eq('id', userId);
        else if (customerId) q = q.eq('stripe_customer_id', customerId);
        await q;
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.error(e);
    return new Response('Handler error', { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
