/**
 * The Well — patronage & project fundraising
 * moreHref → full static page. payments → Stripe / GoFundMe / PayPal when live.
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
      title: 'MOLI — Mercy On Lost Individuals',
      featured: true,
      tag: 'Welfare · not a registered charity',
      blurb:
        'A proposed charity in formation for animals killed and injured on UK roads. This appeal is only for incorporation costs — not a general donation fund, and not Gift Aid eligible.',
      body: [
        'Respond — a line and network so roadside harm gets a humane response, not only a clear-up.',
        'Record — species, place, road, time: evidence that barely exists today.',
        'Prevent — use that evidence for crossings, signage, and design where deaths cluster.',
      ],
      goal: '£2,000 incorporation goal · £0 raised',
      payments: {
        stripe: '',
        gofundme: '',
        paypal: '',
      },
      label: 'Help MOLI incorporate',
      moreHref: './moli.html',
      moreLabel: 'Full case, costs & legal notice',
      active: true,
    },
  ],
};
