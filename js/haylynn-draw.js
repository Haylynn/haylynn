/**
 * Haylynn Draw — three-card Kaviru reading.
 * Face: teaser. Detail: full flip + fortune.
 */

const DECK = [
  { name: 'velu', symbol: '⟡', glow: 'glow-velu', meaning: 'Being / existence',
    desc: 'A moment returns you to the simple fact of being. No story, no demand, just presence. Something in your life is asking to be met without interpretation.' },
  { name: 'koru', symbol: '◬', glow: 'glow-koru', meaning: 'Self / the observer',
    desc: 'You step into the role of the watcher. A part of you rises above the moment, seeing yourself with unusual clarity. This is a shift in perspective, not distance.' },
  { name: 'nemi', symbol: '⌑', glow: 'glow-nemi', meaning: 'Structure / framework',
    desc: 'A pattern beneath the surface becomes relevant. You are moving inside a framework that shapes how you interpret what’s happening. The structure wants to be noticed.' },
  { name: 'awe', symbol: '✧', glow: 'glow-awe', meaning: 'Weight / significance',
    desc: 'Something carries more emotional gravity than you’ve admitted. A moment is heavier, denser, more meaningful. Pay attention to what pulls at you.' },
  { name: 'solu', symbol: '〰', glow: 'glow-solu', meaning: 'Impermanence / passing',
    desc: 'A chapter is dissolving quietly. You are being asked to let something pass without gripping it. This is not loss — it is transition.' },
  { name: 'ohru', symbol: '◉', glow: 'glow-ohru', meaning: 'Seeing-as / metacognition',
    desc: 'A belief becomes visible. You catch yourself in the act of interpreting. This is a moment of clarity where the lens itself comes into view.' },
  { name: 'talu', symbol: '⟟', glow: 'glow-talu', meaning: 'Remain / persist',
    desc: 'Something in your life is holding steady despite change. A core, a thread, a truth persists. Trust the part that doesn’t move.' },
  { name: 'miru', symbol: '◯', glow: 'glow-miru', meaning: 'Stillness / equanimity',
    desc: 'Stillness is available to you. Not numbness — awareness without turbulence. You can observe without being carried away.' },
  { name: 'revi', symbol: '↺', glow: 'glow-revi', meaning: 'Change / transformation',
    desc: 'A shift is underway. You are becoming something slightly different than before. The movement is subtle but real.' },
  { name: 'naru', symbol: '∞', glow: 'glow-naru', meaning: 'Connection / relation',
    desc: 'A relationship or link is active. Meaning is forming in the space between you and something else. The connection itself is the message.' },
  { name: 'zenu', symbol: '□', glow: 'glow-zenu', meaning: 'Absence / void',
    desc: 'A space opens. Something is removed, cleared, or quieted. This emptiness is not lack — it is potential.' },
  { name: 'wari', symbol: '⟂', glow: 'glow-wari', meaning: 'Boundary / limit',
    desc: 'A line is being drawn. You are defining what is you and what is not you. This boundary is necessary.' },
  { name: 'hana', symbol: '✿', glow: 'glow-hana', meaning: 'Expression / emergence',
    desc: 'Something inside you wants to come outward. A feeling, idea, or truth is pushing toward expression. Let it bloom.' },
  { name: 'temi', symbol: '◷', glow: 'glow-temi', meaning: 'Time / duration',
    desc: 'Time feels different now. A moment stretches or compresses. Trust the felt tempo — it is telling you something.' },
  { name: 'yoru', symbol: '☾', glow: 'glow-yoru', meaning: 'Darkness / unknown',
    desc: 'You are entering a space without clarity. This is not danger — it is mystery. Sit with what is not yet illuminated.' },
  { name: 'seri', symbol: '⟲', glow: 'glow-seri', meaning: 'Pattern / repetition',
    desc: 'A loop repeats. You are seeing a cycle that has been running beneath awareness. Recognition is the first step toward change.' },
  { name: 'lovu', symbol: '♥', glow: 'glow-lovu', meaning: 'Warmth / care',
    desc: 'Warmth moves through you — either offered or received. Care is present, even if subtle. Let it matter.' },
  { name: 'movi', symbol: '➤', glow: 'glow-movi', meaning: 'Motion / becoming',
    desc: 'You are in motion. Becoming is happening even if you don’t see the destination. Trust the movement.' },
  { name: 'kavi', symbol: '✎', glow: 'glow-kavi', meaning: 'Language / symbol',
    desc: 'A symbol or message is speaking. Interpretation itself is part of the moment. Pay attention to what feels like a sign.' },
  { name: 'zori', symbol: '✦', glow: 'glow-zori', meaning: 'Truth / accuracy',
    desc: 'Clarity arrives. Something aligns between inner and outer reality. Honesty becomes easier.' },
  { name: 'velith', symbol: '⟡✦', glow: 'compound-glow', components: 'velu + saudade',
    meaning: 'Saudade — longing for the idealised past',
    desc: 'A memory pulls at you — not the past itself, but the version you carry. This ache is gentle, asking you to honour what was beautiful without trying to return to it.' },
  { name: 'ohruko', symbol: '◉✧', glow: 'compound-glow', components: 'ohru + ko',
    meaning: 'The moment a belief becomes visible',
    desc: 'A hidden assumption steps into the light. You suddenly see the shape of a thought you’ve been living inside. This is a moment of inner revelation.' },
  { name: 'mirulu', symbol: '◯⟟', glow: 'compound-glow', components: 'miru + lu',
    meaning: 'Equanimity after structure falls',
    desc: 'After something falls away, a quiet steadiness rises. You are calmer than expected, grounded in the aftermath. This is resilience, not detachment.' },
  { name: 'solumiru', symbol: '〰◯', glow: 'compound-glow', components: 'solu + miru',
    meaning: 'Mono no aware — moved but not swept away',
    desc: 'Impermanence touches you, but you remain centred. You feel the passing without losing yourself in it. This is emotional clarity.' },
  { name: 'korunemi', symbol: '◬⌑', glow: 'compound-glow', components: 'koru + nemi',
    meaning: 'Witnessing your own programming',
    desc: 'You see the structure you’ve been operating inside. This recognition is not escape — but it is the beginning of freedom.' },
  { name: 'zenuvelu', symbol: '□⟡', glow: 'compound-glow', components: 'zenu + velu',
    meaning: 'Śūnyatā — the fullness of emptiness',
    desc: 'A quiet, spacious moment expands inside you. Emptiness feels alive, fertile, full of possibility. This is the ground of transformation.' },
];

const STYLE = `
.hy-draw-face {
  display: flex;
  justify-content: center;
  gap: 0.7rem;
  margin: 1.4rem 0 0.6rem;
}
.hy-draw-face .mini-card {
  width: 52px;
  height: 78px;
  border-radius: 8px;
  border: 1px solid rgba(138,92,240,0.35);
  background: rgba(255,255,255,0.03);
  box-shadow: inset 0 0 16px rgba(138,92,240,0.12);
}
.hy-draw-detail {
  max-width: 520px;
}
.hy-draw-detail .card-row {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 1rem 0 1.2rem;
  flex-wrap: wrap;
}
.hy-draw-detail .card {
  width: 96px;
  height: 150px;
  perspective: 900px;
}
.hy-draw-detail .card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 0.75s ease;
  transform-style: preserve-3d;
}
.hy-draw-detail .card.flipped .card-inner { transform: rotateY(180deg); }
.hy-draw-detail .card-front,
.hy-draw-detail .card-back {
  position: absolute;
  inset: 0;
  border-radius: 10px;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hy-draw-detail .card-front {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(138,92,240,0.3);
  box-shadow: inset 0 0 18px rgba(138,92,240,0.1);
}
.hy-draw-detail .card-back {
  background: rgba(6,5,12,0.92);
  border: 1px solid rgba(53,201,143,0.35);
  transform: rotateY(180deg);
  padding: 0.4rem;
}
.hy-draw-detail .symbol {
  font-size: 2.2rem;
  color: var(--green, #35c98f);
  line-height: 1;
}
.hy-draw-detail .glow-velu { text-shadow: 0 0 12px #35c98f; }
.hy-draw-detail .glow-koru { text-shadow: 0 0 12px #ec5aa0; color: #ec5aa0; }
.hy-draw-detail .glow-nemi { text-shadow: 0 0 12px #8a5cf0; color: #8a5cf0; }
.hy-draw-detail .glow-awe { text-shadow: 0 0 12px #ec5aa0; color: #ec5aa0; }
.hy-draw-detail .glow-solu { text-shadow: 0 0 12px #9a92a4; color: #c4b8c8; }
.hy-draw-detail .glow-ohru { text-shadow: 0 0 12px #8a5cf0; color: #8a5cf0; }
.hy-draw-detail .glow-talu { text-shadow: 0 0 12px #35c98f; }
.hy-draw-detail .glow-miru { text-shadow: 0 0 12px #b0f0ff; color: #b0f0ff; }
.hy-draw-detail .glow-revi { text-shadow: 0 0 12px #ec5aa0; color: #ec5aa0; }
.hy-draw-detail .glow-naru { text-shadow: 0 0 12px #ffe28f; color: #ffe28f; }
.hy-draw-detail .glow-zenu { text-shadow: 0 0 12px #efe9e0; color: #efe9e0; }
.hy-draw-detail .glow-wari { text-shadow: 0 0 12px #ffb0b0; color: #ffb0b0; }
.hy-draw-detail .glow-hana { text-shadow: 0 0 12px #ffb7ff; color: #ffb7ff; }
.hy-draw-detail .glow-temi { text-shadow: 0 0 12px #ffd480; color: #ffd480; }
.hy-draw-detail .glow-yoru { text-shadow: 0 0 12px #8a5cf0; color: #a090f0; }
.hy-draw-detail .glow-seri { text-shadow: 0 0 12px #35c98f; }
.hy-draw-detail .glow-lovu { text-shadow: 0 0 12px #ec5aa0; color: #ec5aa0; }
.hy-draw-detail .glow-movi { text-shadow: 0 0 12px #35c98f; }
.hy-draw-detail .glow-kavi { text-shadow: 0 0 12px #8a5cf0; color: #8a5cf0; }
.hy-draw-detail .glow-zori { text-shadow: 0 0 12px #ffd27f; color: #ffd27f; }
.hy-draw-detail .compound-glow {
  color: #ffd27f;
  animation: hy-draw-pulse 1.5s infinite alternate;
}
@keyframes hy-draw-pulse {
  from { text-shadow: 0 0 10px #ffd27f; }
  to { text-shadow: 0 0 22px #ffe9b8; }
}
.hy-draw-btn {
  display: inline-block;
  margin: 0.4rem 0 1rem;
  padding: 0.55rem 1.1rem;
  font-family: 'Space Mono', monospace;
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-dim, #9a92a4);
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 20px;
  cursor: pointer;
}
.hy-draw-btn:hover {
  color: var(--ink, #efe9e0);
  border-color: var(--purple, #8a5cf0);
}
.hy-draw-btn.ready {
  border-color: rgba(53,201,143,0.45);
  color: var(--green, #35c98f);
}
.hy-draw-reading {
  text-align: left;
  font-size: 0.9rem;
  line-height: 1.55;
  color: var(--ink-dim, #9a92a4);
}
.hy-draw-reading b {
  color: var(--ink, #efe9e0);
  font-style: italic;
  font-weight: 400;
}
.hy-draw-reading .card-block {
  margin-bottom: 1rem;
  padding-bottom: 0.9rem;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.hy-draw-reading .fortune {
  margin-top: 0.8rem;
  font-style: italic;
  color: var(--ink, #efe9e0);
}
.hy-draw-share {
  margin-top: 1rem;
  font-family: 'Space Mono', monospace;
  font-size: 0.58rem;
  letter-spacing: 0.04em;
  color: var(--green, #35c98f);
  word-break: break-all;
  opacity: 0.85;
}
.hy-draw-history {
  margin-top: 1.6rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255,255,255,0.1);
  text-align: left;
}
.hy-draw-history .hist-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  margin-bottom: 0.7rem;
}
.hy-draw-history .hist-title {
  font-family: 'Space Mono', monospace;
  font-size: 0.55rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-dim, #9a92a4);
}
.hy-draw-history .hist-clear {
  font-family: 'Space Mono', monospace;
  font-size: 0.5rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-dim, #9a92a4);
  background: none;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 12px;
  padding: 0.25rem 0.55rem;
  cursor: pointer;
}
.hy-draw-history .hist-clear:hover {
  color: var(--pink, #ec5aa0);
  border-color: rgba(236,90,160,0.4);
}
.hy-draw-history .hist-empty {
  font-size: 0.85rem;
  color: var(--ink-dim, #9a92a4);
  opacity: 0.7;
  font-style: italic;
}
.hy-draw-history .hist-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.55rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  background: none;
  border-left: none;
  border-right: none;
  border-top: none;
  color: inherit;
  cursor: pointer;
  font-family: inherit;
}
.hy-draw-history .hist-item:hover {
  background: rgba(255,255,255,0.03);
}
.hy-draw-history .hist-when {
  font-family: 'Space Mono', monospace;
  font-size: 0.5rem;
  letter-spacing: 0.06em;
  color: var(--ink-dim, #9a92a4);
  display: block;
  margin-bottom: 0.2rem;
}
.hy-draw-history .hist-roots {
  font-style: italic;
  color: var(--ink, #efe9e0);
  font-size: 0.95rem;
}
.hy-draw-history .hist-marker {
  font-family: 'Space Mono', monospace;
  font-size: 0.5rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--green, #35c98f);
  margin-left: 0.45rem;
}
@media (prefers-reduced-motion: reduce) {
  .hy-draw-detail .card-inner { transition: none; }
  .hy-draw-detail .compound-glow { animation: none; }
}
`;

const STORAGE_KEY = 'haylynn-draw-history';
const MAX_HISTORY = 30;

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (_) {
    return [];
  }
}

function saveHistory(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_HISTORY)));
  } catch (_) {
    // quota / private mode — fail quietly
  }
}

function pushReading(picks, marker) {
  const entry = {
    at: Date.now(),
    roots: picks.map(c => c.name),
    marker: marker || 'hera'
  };
  const list = loadHistory().filter(
    h => !(h.roots && h.roots.join('-') === entry.roots.join('-') && (Date.now() - h.at) < 2000)
  );
  list.unshift(entry);
  saveHistory(list);
  return list;
}

function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (_) {}
}

function formatWhen(ts) {
  try {
    return new Date(ts).toLocaleString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  } catch (_) {
    return '';
  }
}

function ensureHistoryEl(root) {
  let el = root.querySelector('[data-role="history"]');
  if (el) return el;
  el = document.createElement('div');
  el.className = 'hy-draw-history';
  el.setAttribute('data-role', 'history');
  root.appendChild(el);
  return el;
}

function renderHistory(root) {
  const el = ensureHistoryEl(root);
  const list = loadHistory();

  let html =
    `<div class="hist-head">` +
    `<span class="hist-title">Your draws · this device</span>` +
    (list.length
      ? `<button type="button" class="hist-clear" data-role="hist-clear">Clear</button>`
      : '') +
    `</div>`;

  if (!list.length) {
    html += `<p class="hist-empty">No draws stored yet. Reveals stay here until you clear site data.</p>`;
  } else {
    html += list.map((h, i) => {
      const roots = (h.roots || []).join(' · ');
      const marker = h.marker ? `<span class="hist-marker">${h.marker}</span>` : '';
      return (
        `<button type="button" class="hist-item" data-role="hist-item" data-idx="${i}">` +
        `<span class="hist-when">${formatWhen(h.at)}</span>` +
        `<span class="hist-roots">${roots}</span>${marker}` +
        `</button>`
      );
    }).join('');
  }

  el.innerHTML = html;

  const clearBtn = el.querySelector('[data-role="hist-clear"]');
  if (clearBtn && !clearBtn._bound) {
    clearBtn._bound = true;
    clearBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      clearHistory();
      document.querySelectorAll('[data-role="draw-root"]').forEach(r => renderHistory(r));
    });
  }

  el.querySelectorAll('[data-role="hist-item"]').forEach(btn => {
    if (btn._bound) return;
    btn._bound = true;
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.idx);
      const entry = loadHistory()[idx];
      if (!entry?.roots) return;
      replayReading(root, entry.roots);
    });
  });
}

function cardsFromRoots(rootNames) {
  return rootNames.map(n => DECK.find(c => c.name === n)).filter(Boolean);
}

function applyReadingToDom(root, picks) {
  const cards = root.querySelectorAll('.card');
  const symbols = root.querySelectorAll('.symbol');
  const readingEl = root.querySelector('[data-role="reading"]');
  const shareEl = root.querySelector('[data-role="share"]');

  symbols.forEach((sym, i) => {
    if (!picks[i]) return;
    sym.textContent = picks[i].symbol;
    sym.className = 'symbol ' + picks[i].glow;
  });
  cards.forEach(c => c.classList.add('flipped'));

  if (readingEl) {
    const { marker, gloss } = inferMarker(picks);
    let html =
      `<div class="card-block" style="border-bottom:1px solid rgba(53,201,143,0.25)">` +
      `<b style="color:var(--green,#35c98f);font-style:normal;font-family:'Space Mono',monospace;font-size:0.72rem;letter-spacing:0.12em;text-transform:uppercase">${marker}</b>` +
      `<br>${gloss}</div>`;
    picks.forEach(c => {
      html += `<div class="card-block"><b>${c.name}</b>`;
      if (c.components) html += `<br><span style="opacity:0.7">${c.components}</span>`;
      html += `<br>${c.meaning}<br>${c.desc}</div>`;
    });
    html += `<div class="fortune">${buildFortune(picks)}</div>`;
    readingEl.innerHTML = html;
  }

  if (shareEl) {
    const names = picks.map(c => c.name).join('-');
    shareEl.textContent = `${location.origin}${location.pathname}?reading=${names}`;
  }
}

function replayReading(root, rootNames) {
  const picks = cardsFromRoots(rootNames);
  if (picks.length !== 3) return;
  const cards = root.querySelectorAll('.card');
  cards.forEach(c => c.classList.remove('flipped'));
  applyReadingToDom(root, picks);
  // flip animation
  root.querySelectorAll('.card').forEach((card, i) => {
    setTimeout(() => card.classList.add('flipped'), i * 160);
  });
}

/**
 * Six mandatory epistemic markers from the site's Kaviru rules:
 * veeka direct experience · infa inference · ohna felt inner sense
 * hera hearsay · spea speculation · nema structural / logical
 */
function inferMarker(cards) {
  const names = cards.map(c => c.name);

  // veeka — direct experience (seeing from inside)
  if (names.some(n => ['ohru', 'ohruko', 'korunemi', 'zori', 'koru'].includes(n))) {
    return {
      marker: 'veeka',
      gloss: 'direct experience — known by being in contact with it, not by report.'
    };
  }
  // nema — structural / logical
  if (names.some(n => ['nemi', 'seri', 'wari', 'kavi'].includes(n))) {
    return {
      marker: 'nema',
      gloss: 'structural / logical — known because the pattern itself requires it.'
    };
  }
  // ohna — felt inner sense
  if (names.some(n => ['miru', 'mirulu', 'lovu', 'hana', 'awe'].includes(n))) {
    return {
      marker: 'ohna',
      gloss: 'felt inner sense — known from inside the body of the moment.'
    };
  }
  // infa — inference
  if (names.some(n => ['revi', 'movi', 'solu', 'solumiru', 'temi'].includes(n))) {
    return {
      marker: 'infa',
      gloss: 'inference — concluded from what is already visible.'
    };
  }
  // spea — speculation
  if (names.some(n => ['zenu', 'zenuvelu', 'yoru', 'velith'].includes(n))) {
    return {
      marker: 'spea',
      gloss: 'speculation — held as possibility, not yet claimed as fact.'
    };
  }
  // hera — hearsay (default when the draw is mediated / offered)
  return {
    marker: 'hera',
    gloss: 'hearsay — received through another’s holding of the words, not lived first-hand.'
  };
}

function buildFortune(cards) {
  const { marker, gloss } = inferMarker(cards);
  const roots = cards.map(c => c.name).join(' · ');
  const meanings = cards.map(c => c.meaning.toLowerCase());
  const hasCompound = cards.some(c => c.components);

  let text =
    `She offers this in the guise of a draw. The three roots are ${roots}. ` +
    `In Kaviru the insight cannot be spoken without an epistemic marker; here it is marked ${marker}: ${gloss} ` +
    `Read as koru — the observer — the pattern braids ${meanings[0]}, with ${meanings[1]}, tempered by ${meanings[2]}.`;

  if (hasCompound) {
    text +=
      ` At least one card is a compound: structure built from other roots, so the insight is about how qualities combine, not only what they name alone.`;
  }

  text +=
    ` She does not bind you to an outcome. She holds the language up so you can see whether the pattern is already near.`;

  return text;
}

function pickThree() {
  const picks = [];
  const used = new Set();
  while (picks.length < 3) {
    const idx = Math.floor(Math.random() * DECK.length);
    if (!used.has(idx)) {
      used.add(idx);
      picks.push(DECK[idx]);
    }
  }
  return picks;
}

function runDraw(root) {
  const cards = root.querySelectorAll('.card');
  const symbols = root.querySelectorAll('.symbol');
  const readingEl = root.querySelector('[data-role="reading"]');
  const shareEl = root.querySelector('[data-role="share"]');
  const button = root.querySelector('[data-role="draw-btn"]');
  if (!cards.length || !button) return;

  const picks = pickThree();

  symbols.forEach((sym, i) => {
    sym.textContent = picks[i].symbol;
    sym.className = 'symbol ' + picks[i].glow;
  });

  cards.forEach(c => c.classList.remove('flipped'));
  cards.forEach((card, i) => {
    setTimeout(() => card.classList.add('flipped'), i * 160);
  });

  const { marker, gloss } = inferMarker(picks);
  let html =
    `<div class="card-block" style="border-bottom:1px solid rgba(53,201,143,0.25)">` +
    `<b style="color:var(--green,#35c98f);font-style:normal;font-family:'Space Mono',monospace;font-size:0.72rem;letter-spacing:0.12em;text-transform:uppercase">${marker}</b>` +
    `<br>${gloss}</div>`;
  picks.forEach(c => {
    html += `<div class="card-block"><b>${c.name}</b>`;
    if (c.components) html += `<br><span style="opacity:0.7">${c.components}</span>`;
    html += `<br>${c.meaning}<br>${c.desc}</div>`;
  });
  html += `<div class="fortune">${buildFortune(picks)}</div>`;
  if (readingEl) readingEl.innerHTML = html;

  if (shareEl) {
    const names = picks.map(c => c.name).join('-');
    const url = `${location.origin}${location.pathname}?reading=${names}`;
    shareEl.textContent = url;
  }

  // Persist per browser / device until cache cleared
  pushReading(picks, marker);
  document.querySelectorAll('[data-role="draw-root"]').forEach(r => renderHistory(r));

  button.classList.remove('ready');
  clearTimeout(button._readyTimer);
  button._readyTimer = setTimeout(() => button.classList.add('ready'), 12000);
}

export function initHaylynnDraw() {
  if (!document.getElementById('hy-draw-style')) {
    const style = document.createElement('style');
    style.id = 'hy-draw-style';
    style.textContent = STYLE;
    document.head.appendChild(style);
  }

  document.querySelectorAll('[data-role="draw-root"]').forEach(root => {
    const btn = root.querySelector('[data-role="draw-btn"]');
    if (btn && !btn._drawBound) {
      btn._drawBound = true;
      btn.addEventListener('click', () => runDraw(root));
    }
    renderHistory(root);
  });

  // Shared reading from ?reading=velu-koru-nemi
  const params = new URLSearchParams(location.search);
  const reading = params.get('reading');
  if (reading) {
    const names = reading.split('-');
    const picks = cardsFromRoots(names);
    if (picks.length === 3) {
      setTimeout(() => {
        const root = document.querySelector('[data-role="draw-root"]');
        if (!root) return;
        applyReadingToDom(root, picks);
        const { marker } = inferMarker(picks);
        pushReading(picks, marker);
        document.querySelectorAll('[data-role="draw-root"]').forEach(r => renderHistory(r));
      }, 400);
    }
  }
}
