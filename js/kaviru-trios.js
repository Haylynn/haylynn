/**
 * Curated Kaviru trios for Nemihana — source of truth.
 * Three faces per root:
 *   glyph  — the mark
 *   word   — Kaviru in Latin script (koru, not "self")
 *   desc   — brief sense in English
 */

export const TRIOS = [
  { id: 'velu', glyph: '⟡', word: 'velu', desc: 'The simple fact of existence — presence without a story attached.' },
  { id: 'koru', glyph: '◬', word: 'koru', desc: 'The observer — the one who sees, not only what is seen.' },
  { id: 'nemi', glyph: '⌑', word: 'nemi', desc: 'The framework underneath — pattern that shapes how meaning forms.' },
  { id: 'ohru', glyph: '◉', word: 'ohru', desc: 'The moment the lens becomes visible — interpretation noticed as such.' },
  { id: 'miru', glyph: '◯', word: 'miru', desc: 'Equanimity — awareness without being carried away by turbulence.' },
  { id: 'talu', glyph: '⟟', word: 'talu', desc: 'What holds steady through change — the thread that does not move.' },
  { id: 'revi', glyph: '↺', word: 'revi', desc: 'Transformation underway — becoming, even when the destination is unclear.' },
  { id: 'naru', glyph: '∞', word: 'naru', desc: 'Relation — meaning formed in the space between, not only inside one thing.' },
  { id: 'zenu', glyph: '□', word: 'zenu', desc: 'Absence as opening — emptiness that is potential, not merely lack.' },
  { id: 'hana', glyph: '✿', word: 'hana', desc: 'Expression rising outward — a truth or feeling pushing into form.' },
  { id: 'kavi', glyph: '✎', word: 'kavi', desc: 'Symbol and speech — the mark or word that carries a stance.' },
  { id: 'zori', glyph: '✦', word: 'zori', desc: 'Accuracy — inner and outer aligning; honesty becomes easier.' },
  { id: 'solu', glyph: '〰', word: 'solu', desc: 'Passing without grip — a chapter dissolving; transition, not only loss.' }
];

export function facesFromTrios(trios) {
  const faces = [];
  for (const t of trios) {
    faces.push({ rootId: t.id, kind: 'glyph', text: t.glyph });
    faces.push({ rootId: t.id, kind: 'word', text: t.word });
    faces.push({ rootId: t.id, kind: 'desc', text: t.desc });
  }
  return faces;
}

export function pickTrios(n) {
  const pool = shuffle(TRIOS.slice());
  return pool.slice(0, Math.min(n, pool.length));
}

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const MODES = {
  lives: {
    id: 'lives',
    label: 'Lives',
    desc: 'Three hearts. A broken streak costs one. Bonus hearts hide on the board.',
    lives: 3,
    timerSec: null,
    bonusChance: 0.25
  },
  timer: {
    id: 'timer',
    label: 'Timer',
    desc: 'Ninety seconds. Clear four trios before the void closes.',
    lives: null,
    timerSec: 90,
    bonusChance: 0.2
  },
  mixed: {
    id: 'mixed',
    label: 'Mixed',
    desc: 'Two hearts and sixty seconds. Stricter — both clocks run.',
    lives: 2,
    timerSec: 60,
    bonusChance: 0.3
  }
};
