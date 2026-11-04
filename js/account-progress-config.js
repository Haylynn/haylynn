/**
 * Account Path — scaled starter web (minors + majors).
 * PoE-style: small nodes cheap, notables cost more, keystones are defining.
 * Costs are cores (shards fill the gap at MARKS_PER_PATH_POINT).
 */
export const STARTING_MARKS = 0;
export const MARKS_PER_PATH_POINT = 5;

/**
 * kind: 'minor' | 'major' | 'keystone' | 'start'
 * x, y: percent positions in the tree viewport
 */
export const PATH_NODES = [
  // —— Centre / start ——
  { id: 'start-known', name: 'Known', blurb: 'You are known. The passport stays with the house.', cost: 0, kind: 'start', cluster: 'house', x: 50, y: 48 },

  // —— House cluster (left-centre) ——
  { id: 'h-nameplate', name: 'True name', blurb: 'Your name is spoken clearly on the passport.', cost: 1, kind: 'minor', cluster: 'house', x: 38, y: 42 },
  { id: 'h-bio', name: 'Told in full', blurb: 'Room for a longer telling of who you are.', cost: 1, kind: 'minor', cluster: 'house', x: 34, y: 50 },
  { id: 'h-avatar', name: 'Likeness', blurb: 'A face the house can hold beside your name.', cost: 1, kind: 'minor', cluster: 'house', x: 36, y: 58 },
  { id: 'h-links', name: 'Threshold links', blurb: 'More doors from your passport to the wider net.', cost: 1, kind: 'minor', cluster: 'house', x: 42, y: 36 },
  { id: 'h-pins-1', name: 'First pin', blurb: 'One pin on the desk when presence opens.', cost: 1, kind: 'minor', cluster: 'house', x: 30, y: 44 },
  { id: 'h-pins-2', name: 'Second pin', blurb: 'Another pin when the desk grows.', cost: 1, kind: 'minor', cluster: 'house', x: 28, y: 52 },
  { id: 'h-presence', name: 'Felt in glass', blurb: 'A quiet mark on Enter when the house is awake.', cost: 2, kind: 'minor', cluster: 'house', x: 32, y: 62 },
  { id: 'h-passport-major', name: 'Full passport', blurb: 'The passport shows more of who you are in the house.', cost: 4, kind: 'major', cluster: 'house', x: 24, y: 48 },

  // —— Play cluster (top) ——
  { id: 'p-first-steps', name: 'First steps', blurb: 'What you walk in Domains can be seen on the passport.', cost: 1, kind: 'minor', cluster: 'play', x: 50, y: 34 },
  { id: 'p-path-sense', name: 'Path sense', blurb: 'Domains may leave cores when a session ends.', cost: 1, kind: 'minor', cluster: 'play', x: 44, y: 28 },
  { id: 'p-mark-drip', name: 'Shard fall', blurb: 'Shards may gather from milestones in play.', cost: 1, kind: 'minor', cluster: 'play', x: 56, y: 28 },
  { id: 'p-domain-map', name: 'Domain map', blurb: 'The house remembers the last Domain you touched.', cost: 1, kind: 'minor', cluster: 'play', x: 48, y: 22 },
  { id: 'p-inventory-eye', name: 'Inventory eye', blurb: 'What you carry can be glimpsed from the passport.', cost: 1, kind: 'minor', cluster: 'play', x: 58, y: 34 },
  { id: 'p-veteran', name: 'Domain veteran', blurb: 'Later Domains may greet you as one who has returned.', cost: 3, kind: 'major', cluster: 'play', x: 50, y: 16 },
  { id: 'p-second-slot', name: 'Second thread', blurb: 'A second life may walk Cosmic Decay under your name.', cost: 5, kind: 'major', cluster: 'play', x: 62, y: 20 },
  { id: 'p-third-slot', name: 'Third thread', blurb: 'A third thread in the Domains, if the house allows.', cost: 8, kind: 'major', cluster: 'play', x: 68, y: 14 },
  { id: 'p-hard-path', name: 'Hard path', blurb: 'Harsher rules in Domains, when those paths are offered.', cost: 2, kind: 'minor', cluster: 'play', x: 40, y: 18 },
  { id: 'p-story-path', name: 'Story path', blurb: 'Domains lean toward story when they can.', cost: 2, kind: 'minor', cluster: 'play', x: 36, y: 24 },
  { id: 'p-key-walker', name: 'Domain walker', blurb: 'Keystone: you lean into Domains; Market favours grow quieter.', cost: 6, kind: 'keystone', cluster: 'play', x: 50, y: 8 },

  // —— Market cluster (right) ——
  { id: 'm-browse', name: 'Browse', blurb: 'The Market remembers what last caught your eye.', cost: 1, kind: 'minor', cluster: 'market', x: 64, y: 42 },
  { id: 'm-watch', name: 'Watch mark', blurb: 'Keep a quiet list of what you watch for.', cost: 1, kind: 'minor', cluster: 'market', x: 70, y: 46 },
  { id: 'm-notify', name: 'Drop whisper', blurb: 'Whispers when something new is laid on the shelf.', cost: 1, kind: 'minor', cluster: 'market', x: 72, y: 54 },
  { id: 'm-favour-1', name: 'Favour I', blurb: 'A small favour when the Market takes coin.', cost: 2, kind: 'minor', cluster: 'market', x: 66, y: 58 },
  { id: 'm-favour-2', name: 'Favour II', blurb: 'A second favour stacked on the first.', cost: 2, kind: 'minor', cluster: 'market', x: 74, y: 62 },
  { id: 'm-favour-3', name: 'Favour III', blurb: 'A second favour stacked on the first.', cost: 2, kind: 'minor', cluster: 'market', x: 78, y: 50 },
  { id: 'm-early', name: 'Early shelf', blurb: 'See limited offerings before the wider house.', cost: 5, kind: 'major', cluster: 'market', x: 82, y: 44 },
  { id: 'm-handmade', name: 'Handmade door', blurb: 'A door toward handmade editions when they appear.', cost: 6, kind: 'major', cluster: 'market', x: 84, y: 56 },
  { id: 'm-key-merchant', name: 'Merchant path', blurb: 'Keystone: you lean into the Market; Domain threads grow fewer.', cost: 6, kind: 'keystone', cluster: 'market', x: 90, y: 50 },

  // —— Voice / Chronicle (bottom-left) ——
  { id: 'v-listen', name: 'Deep listen', blurb: 'Voice opens a deeper strip when the current runs.', cost: 1, kind: 'minor', cluster: 'voice', x: 38, y: 68 },
  { id: 'v-liner', name: 'Liner notes', blurb: 'Notes beside the music when they are given.', cost: 2, kind: 'minor', cluster: 'voice', x: 32, y: 72 },
  { id: 'v-radio', name: 'Radio queue', blurb: 'A place in line when the radio takes offerings.', cost: 4, kind: 'major', cluster: 'voice', x: 28, y: 78 },
  { id: 'c-read', name: 'Chronicle bookmark', blurb: 'The Chronicle remembers where you last read.', cost: 1, kind: 'minor', cluster: 'chronicle', x: 44, y: 72 },
  { id: 'c-early', name: 'Early page', blurb: 'Pages before they are common, when the story allows.', cost: 4, kind: 'major', cluster: 'chronicle', x: 40, y: 80 },
  { id: 'c-guest', name: 'Guest spine', blurb: 'Leave a title of your own near the spine, when invited.', cost: 3, kind: 'major', cluster: 'chronicle', x: 48, y: 84 },

  // —— Sky / LYMP (bottom-right) ——
  { id: 's-gallery', name: 'Gallery eye', blurb: 'The Sky looks with you a little longer.', cost: 1, kind: 'minor', cluster: 'sky', x: 62, y: 68 },
  { id: 's-print-1', name: 'Print window', blurb: 'A window for prints when the Sky and LYMP agree.', cost: 4, kind: 'major', cluster: 'sky', x: 70, y: 74 },
  { id: 's-print-2', name: 'Second window', blurb: 'Another opening for prints in the Sky.', cost: 3, kind: 'minor', cluster: 'sky', x: 76, y: 70 },
  { id: 's-cross', name: 'Cross-house', blurb: 'What you earn here may be felt at LYMP when the link is live.', cost: 5, kind: 'major', cluster: 'sky', x: 80, y: 78 },

  // —— Draw / Well ——
  { id: 'd-history', name: 'Draw memory', blurb: 'The Draw remembers what you pulled, when the house keeps it.', cost: 1, kind: 'minor', cluster: 'draw', x: 56, y: 62 },
  { id: 'd-depth', name: 'Deeper draw', blurb: 'More depth when the cards are read.', cost: 2, kind: 'minor', cluster: 'draw', x: 60, y: 56 },
  { id: 'w-follow', name: 'Well mark', blurb: 'Stand marked beside causes at the Well.', cost: 1, kind: 'minor', cluster: 'well', x: 46, y: 60 },
  { id: 'w-moli', name: 'MOLI eye', blurb: 'MOLI stays in sight when that work is active.', cost: 1, kind: 'minor', cluster: 'well', x: 52, y: 66 },
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
