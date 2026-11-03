/**
 * Account Path — scaled starter web (minors + majors).
 * PoE-style: small nodes cheap, notables cost more, keystones are defining.
 * Costs are path points (marks fill gap at MARKS_PER_PATH_POINT).
 */
export const STARTING_MARKS = 0;
export const MARKS_PER_PATH_POINT = 5;

/**
 * kind: 'minor' | 'major' | 'keystone' | 'start'
 * x, y: percent positions in the tree viewport
 */
export const PATH_NODES = [
  // —— Centre / start ——
  { id: 'start-known', name: 'Known', blurb: 'Passport is real. Profile stays with the house.', cost: 0, kind: 'start', cluster: 'house', x: 50, y: 48 },

  // —— House cluster (left-centre) ——
  { id: 'h-nameplate', name: 'Nameplate', blurb: 'Display name shows on member surfaces.', cost: 1, kind: 'minor', cluster: 'house', x: 38, y: 42 },
  { id: 'h-bio', name: 'Ledger bio', blurb: 'Longer bio on the passport.', cost: 1, kind: 'minor', cluster: 'house', x: 34, y: 50 },
  { id: 'h-avatar', name: 'Portrait slot', blurb: 'Avatar field unlocked for sync.', cost: 1, kind: 'minor', cluster: 'house', x: 36, y: 58 },
  { id: 'h-links', name: 'Link shelf', blurb: 'Extra profile links.', cost: 1, kind: 'minor', cluster: 'house', x: 42, y: 36 },
  { id: 'h-pins-1', name: 'Pin I', blurb: 'One desk pin when public desk ships.', cost: 1, kind: 'minor', cluster: 'house', x: 30, y: 44 },
  { id: 'h-pins-2', name: 'Pin II', blurb: 'Second desk pin.', cost: 1, kind: 'minor', cluster: 'house', x: 28, y: 52 },
  { id: 'h-presence', name: 'Presence mark', blurb: 'Small presence flair on Enter.', cost: 2, kind: 'minor', cluster: 'house', x: 32, y: 62 },
  { id: 'h-passport-major', name: 'Full passport', blurb: 'Major: richer identity card on Threshold.', cost: 4, kind: 'major', cluster: 'house', x: 24, y: 48 },

  // —— Play cluster (top) ——
  { id: 'p-first-steps', name: 'First steps', blurb: 'Decay progress flags visible on passport.', cost: 1, kind: 'minor', cluster: 'play', x: 50, y: 34 },
  { id: 'p-path-sense', name: 'Path sense', blurb: '+small path points from session end (when game grants).', cost: 1, kind: 'minor', cluster: 'play', x: 44, y: 28 },
  { id: 'p-mark-drip', name: 'Mark drip', blurb: 'Tiny mark earn from play milestones.', cost: 1, kind: 'minor', cluster: 'play', x: 56, y: 28 },
  { id: 'p-domain-map', name: 'Domain map', blurb: 'Remember last domain on the account.', cost: 1, kind: 'minor', cluster: 'play', x: 48, y: 22 },
  { id: 'p-inventory-eye', name: 'Inventory eye', blurb: 'Inventory summary on passport when written.', cost: 1, kind: 'minor', cluster: 'play', x: 58, y: 34 },
  { id: 'p-veteran', name: 'Domain veteran', blurb: 'Major: returner greeting in future realities.', cost: 3, kind: 'major', cluster: 'play', x: 50, y: 16 },
  { id: 'p-second-slot', name: 'Second thread', blurb: 'Major: second Cosmic Decay character slot.', cost: 5, kind: 'major', cluster: 'play', x: 62, y: 20 },
  { id: 'p-third-slot', name: 'Third thread', blurb: 'Major: third character slot.', cost: 8, kind: 'major', cluster: 'play', x: 68, y: 14 },
  { id: 'p-hard-path', name: 'Hard path', blurb: 'Flag for harder Decay rulesets when offered.', cost: 2, kind: 'minor', cluster: 'play', x: 40, y: 18 },
  { id: 'p-story-path', name: 'Story path', blurb: 'Prefer narrative-leaning intros when game supports paths.', cost: 2, kind: 'minor', cluster: 'play', x: 36, y: 24 },
  { id: 'p-key-walker', name: 'Domain walker', blurb: 'Keystone: Play-leaning account — stronger reality flags, weaker Market favour.', cost: 6, kind: 'keystone', cluster: 'play', x: 50, y: 8 },

  // —— Market cluster (right) ——
  { id: 'm-browse', name: 'Browse', blurb: 'Market shelf remembers last seen drop.', cost: 1, kind: 'minor', cluster: 'market', x: 64, y: 42 },
  { id: 'm-watch', name: 'Watch mark', blurb: 'Save a watchlist stub.', cost: 1, kind: 'minor', cluster: 'market', x: 70, y: 46 },
  { id: 'm-notify', name: 'Drop whisper', blurb: 'Flag for drop notices when wired.', cost: 1, kind: 'minor', cluster: 'market', x: 72, y: 54 },
  { id: 'm-favour-1', name: 'Favour I', blurb: 'Minor: +1% Market entitlement (when checkout exists).', cost: 2, kind: 'minor', cluster: 'market', x: 66, y: 58 },
  { id: 'm-favour-2', name: 'Favour II', blurb: 'Minor: +1% more.', cost: 2, kind: 'minor', cluster: 'market', x: 74, y: 62 },
  { id: 'm-favour-3', name: 'Favour III', blurb: 'Minor: +1% more.', cost: 2, kind: 'minor', cluster: 'market', x: 78, y: 50 },
  { id: 'm-early', name: 'Early shelf', blurb: 'Major: early access flag for limited drops.', cost: 5, kind: 'major', cluster: 'market', x: 82, y: 44 },
  { id: 'm-handmade', name: 'Handmade door', blurb: 'Major: eligibility window for handmade editions.', cost: 6, kind: 'major', cluster: 'market', x: 84, y: 56 },
  { id: 'm-key-merchant', name: 'Merchant path', blurb: 'Keystone: Market-leaning — stack shop doors, weaker Play slots.', cost: 6, kind: 'keystone', cluster: 'market', x: 90, y: 50 },

  // —— Voice / Chronicle (bottom-left) ——
  { id: 'v-listen', name: 'Deep listen', blurb: 'Voice room member strip when live.', cost: 1, kind: 'minor', cluster: 'voice', x: 38, y: 68 },
  { id: 'v-liner', name: 'Liner notes', blurb: 'Access flag for digital liner packs.', cost: 2, kind: 'minor', cluster: 'voice', x: 32, y: 72 },
  { id: 'v-radio', name: 'Radio queue', blurb: 'Major: submit-to-radio waitlist flag.', cost: 4, kind: 'major', cluster: 'voice', x: 28, y: 78 },
  { id: 'c-read', name: 'Chronicle bookmark', blurb: 'Remember last chapter surface.', cost: 1, kind: 'minor', cluster: 'chronicle', x: 44, y: 72 },
  { id: 'c-early', name: 'Early page', blurb: 'Major: early chapter access flag.', cost: 4, kind: 'major', cluster: 'chronicle', x: 40, y: 80 },
  { id: 'c-guest', name: 'Guest spine', blurb: 'Flag to list a title on waitlist.', cost: 3, kind: 'major', cluster: 'chronicle', x: 48, y: 84 },

  // —— Sky / LYMP (bottom-right) ——
  { id: 's-gallery', name: 'Gallery eye', blurb: 'Sky room member emphasis.', cost: 1, kind: 'minor', cluster: 'sky', x: 62, y: 68 },
  { id: 's-print-1', name: 'Print window', blurb: 'Major: early LYMP print window flag.', cost: 4, kind: 'major', cluster: 'sky', x: 70, y: 74 },
  { id: 's-print-2', name: 'Second window', blurb: 'Another print-window charge.', cost: 3, kind: 'minor', cluster: 'sky', x: 76, y: 70 },
  { id: 's-cross', name: 'Cross-house', blurb: 'Major: PoR perk may apply on LYMP when linked.', cost: 5, kind: 'major', cluster: 'sky', x: 80, y: 78 },

  // —— Draw / Well ——
  { id: 'd-history', name: 'Draw memory', blurb: 'Cloud draw history when enabled.', cost: 1, kind: 'minor', cluster: 'draw', x: 56, y: 62 },
  { id: 'd-depth', name: 'Deeper draw', blurb: 'Extra draw detail flag.', cost: 2, kind: 'minor', cluster: 'draw', x: 60, y: 56 },
  { id: 'w-follow', name: 'Well mark', blurb: 'Follow causes on the passport.', cost: 1, kind: 'minor', cluster: 'well', x: 46, y: 60 },
  { id: 'w-moli', name: 'MOLI eye', blurb: 'Highlight MOLI when active.', cost: 1, kind: 'minor', cluster: 'well', x: 52, y: 66 },
];

/** Edges: [fromId, toId] — travel the web */
export const PATH_EDGES = [
  ['start-known', 'h-nameplate'],
  ['start-known', 'h-links'],
  ['start-known', 'p-first-steps'],
  ['start-known', 'm-browse'],
  ['start-known', 'd-history'],
  ['start-known', 'w-follow'],
  ['h-nameplate', 'h-bio'],
  ['h-nameplate', 'h-pins-1'],
  ['h-bio', 'h-avatar'],
  ['h-pins-1', 'h-pins-2'],
  ['h-pins-2', 'h-presence'],
  ['h-links', 'h-passport-major'],
  ['h-avatar', 'h-passport-major'],
  ['p-first-steps', 'p-path-sense'],
  ['p-first-steps', 'p-mark-drip'],
  ['p-first-steps', 'p-inventory-eye'],
  ['p-path-sense', 'p-domain-map'],
  ['p-domain-map', 'p-veteran'],
  ['p-mark-drip', 'p-veteran'],
  ['p-veteran', 'p-second-slot'],
  ['p-second-slot', 'p-third-slot'],
  ['p-domain-map', 'p-hard-path'],
  ['p-path-sense', 'p-story-path'],
  ['p-veteran', 'p-key-walker'],
  ['p-second-slot', 'p-key-walker'],
  ['m-browse', 'm-watch'],
  ['m-watch', 'm-notify'],
  ['m-notify', 'm-favour-1'],
  ['m-favour-1', 'm-favour-2'],
  ['m-favour-2', 'm-favour-3'],
  ['m-favour-3', 'm-early'],
  ['m-early', 'm-handmade'],
  ['m-handmade', 'm-key-merchant'],
  ['m-early', 'm-key-merchant'],
  ['v-listen', 'v-liner'],
  ['v-liner', 'v-radio'],
  ['h-presence', 'v-listen'],
  ['c-read', 'c-early'],
  ['c-early', 'c-guest'],
  ['w-follow', 'c-read'],
  ['s-gallery', 's-print-1'],
  ['s-print-1', 's-print-2'],
  ['s-print-2', 's-cross'],
  ['m-browse', 's-gallery'],
  ['d-history', 'd-depth'],
  ['w-follow', 'w-moli'],
  ['p-inventory-eye', 'd-depth'],
];
