/**
 * Thin Path — starter nodes for the account tree.
 * Expand later into the full PoE-style web. No Stripe, no paid gates here.
 */
export const STARTING_MARKS = 0;

export const PATH_NODES = [
  {
    id: 'threshold-known',
    name: 'Known to the house',
    blurb: 'Your passport is real. Profile fields stay with you.',
    cost: 0,
    cluster: 'house',
  },
  {
    id: 'play-second-slot',
    name: 'Second thread',
    blurb: 'Entitlement flag for a second Cosmic Decay character slot (game must honour it).',
    cost: 3,
    cluster: 'play',
  },
  {
    id: 'play-veteran-flag',
    name: 'Domain veteran',
    blurb: 'Marks you as having walked a Domain — future realities can greet you as returner.',
    cost: 2,
    cluster: 'play',
  },
  {
    id: 'desk-pins',
    name: 'Desk pins',
    blurb: 'When public desk ships: extra pin slots on your presence page.',
    cost: 2,
    cluster: 'house',
  },
  {
    id: 'market-favour-1',
    name: 'Market favour I',
    blurb: '+1% Market discount when checkout exists (entitlement only; no Stripe in this pack).',
    cost: 5,
    cluster: 'market',
  },
  {
    id: 'sky-print-window',
    name: 'Sky window',
    blurb: 'Flag for early LYMP / Sky print windows when that link is live.',
    cost: 4,
    cluster: 'sky',
  },
];
