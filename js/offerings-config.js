/**
 * The Well — patronage & project fundraising
 * Add/remove causes here. Empty stripe/url entries hide the button.
 * This is independent of Threshold membership (accounts / tiers).
 */

export const OFFERINGS_CONFIG = {
  /** Intro on the face — keep short */
  faceLine:
    'Support this house, or another work that should stay in the world. Nothing here is required to walk the scroll.',

  /** Stripe Payment Links or external (Ko-fi, Bandcamp, GoFundMe, etc.) */
  causes: [
    {
      id: 'haylynn-well',
      title: 'This house',
      blurb: 'Keeps the Princess of Reality site, server, and rooms alive while they are still being built.',
      // e.g. 'https://buy.stripe.com/...' or 'https://ko-fi.com/...'
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
      id: 'example-other',
      title: 'Other work',
      blurb: 'A slot for another project — yours or someone else’s — when you have a link and a sentence.',
      url: '',
      label: 'Open fundraiser',
      tag: 'External',
      active: false, // set true and fill url when ready
    },
  ],
};
