/**
 * The Well — patronage & project fundraising
 *
 * For multi-channel causes (e.g. MOLI), set:
 *   url: primary CTA (optional)
 *   payments: { stripe, gofundme, paypal }  // any subset
 *   moreHref: full static page
 */

export const OFFERINGS_CONFIG = {
  faceLine:
    'Support this house, or another work that should stay in the world. Nothing here is required to walk the scroll.',

  causes: [
    {
      id: 'haylynn-well',
      title: 'This house',
      blurb: 'Keeps the Princess of Reality site, server, and rooms alive while they are still being built.',
      url: '',
      label: 'Support this house',
      tag: 'Core',
      active: true,
    },
    {
      id: 'talu',
      title: 'Talu — the voice',
      blurb: 'The album and whatever comes next in sound — if you want to fund the next recording rather than the server.',
      url: '',
      label: 'Support the voice',
      tag: 'Music',
      active: true,
    },
    {
      id: 'moli',
      title: 'MOLI',
      blurb: 'Mercy On Lost Individuals — proposed charity in formation (not yet registered). Appeal only for incorporation costs. UK roads: respond, record, prevent.',
      url: '', // optional primary
      payments: {
        stripe: '',    // e.g. https://buy.stripe.com/...
        gofundme: '',  // e.g. https://www.gofundme.com/...
        paypal: '',    // e.g. https://www.paypal.com/donate/?hosted_button_id=...
      },
      label: 'Help MOLI incorporate',
      tag: 'Welfare',
      moreHref: './moli.html',
      moreLabel: 'Read the full case',
      active: true,
    },
  ],
};
