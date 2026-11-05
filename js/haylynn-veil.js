/**
 * HAYLYNN: The first surface is not a hallway — it is the shop window.
 * Name, promise, one door. They choose to enter.
 *
 * THE OTHER: startVeil() covers the scroller until that choice. Art is atmosphere;
 * the copy sells the product. Then the aperture opens onto the rooms.
 */
const STORAGE_KEY = 'haylynn-veil-open';

/**
 * Pool of aperture graphics — one chosen at random per show.
 * Missing files fall through to the next candidate, then SVG.
 */
const VEIL_POOL = [
  'assets/veil-enter.svg',
  'assets/veil-cosmic.jpg',
  'assets/veil-soft.jpg',
  'assets/veil-anime.jpg',
  'assets/veil-mech.jpg',
  'assets/veil-princess.jpg'
];

function pickVeilSrc() {
  const pool = VEIL_POOL.slice();
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}

const STYLE = `
#haylynn-veil {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #05040a;
  cursor: pointer;
  outline: none;
  border: none;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  text-align: center;
}
#haylynn-veil[hidden] {
  display: none !important;
}
#haylynn-veil .veil-art {
  position: absolute;
  inset: 0;
  background: #05040a center / cover no-repeat;
  background-image: var(--veil-src);
  transform: scale(1.04);
  transition: opacity 0.9s ease, transform 1.2s ease;
}
#haylynn-veil .veil-scrim {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse 80% 60% at 50% 42%, transparent 0%, rgba(5,4,10,0.35) 45%, rgba(5,4,10,0.82) 78%, #05040a 100%),
    linear-gradient(180deg, rgba(5,4,10,0.55) 0%, transparent 28%, transparent 55%, rgba(5,4,10,0.88) 100%);
  z-index: 1;
}
#haylynn-veil .veil-hole {
  position: absolute;
  left: 50%;
  top: 48%;
  width: 140vmax;
  height: 140vmax;
  margin: 0;
  transform: translate(-50%, -50%) scale(0);
  border-radius: 50%;
  pointer-events: none;
  z-index: 3;
  box-shadow: 0 0 0 200vmax #05040a;
  background: radial-gradient(circle,
    transparent 0%,
    transparent 42%,
    rgba(0,0,0,0.35) 52%,
    rgba(0,0,0,0.85) 62%,
    #05040a 72%);
  opacity: 0;
}
#haylynn-veil.is-opening .veil-art {
  opacity: 0;
  transform: scale(1.12);
  transition: opacity 1s ease 0.15s, transform 1.2s ease;
}
#haylynn-veil.is-opening .veil-scrim {
  opacity: 0;
  transition: opacity 0.8s ease;
}
#haylynn-veil.is-opening .veil-hole {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
  transition: transform 1.2s cubic-bezier(0.22, 0.61, 0.36, 1), opacity 0.2s ease;
}
#haylynn-veil .veil-copy {
  position: relative;
  z-index: 2;
  pointer-events: none;
  max-width: min(22rem, calc(100vw - 2.5rem));
  padding: 1.25rem 1rem 1.5rem;
  transition: opacity 0.45s ease, transform 0.45s ease;
}
#haylynn-veil.is-opening .veil-copy {
  opacity: 0;
  transform: scale(0.94);
}
#haylynn-veil .veil-kicker {
  font-family: 'Space Mono', monospace;
  font-size: 0.58rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #c4b5fd;
  margin-bottom: 0.85rem;
  text-shadow: 0 1px 12px rgba(0,0,0,0.8);
}
#haylynn-veil .veil-name {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 300;
  font-style: italic;
  font-size: clamp(2.4rem, 9vw, 3.4rem);
  line-height: 1.05;
  color: #f4efe8;
  margin: 0 0 0.35rem;
  text-shadow: 0 2px 28px rgba(0,0,0,0.75);
}
#haylynn-veil .veil-title {
  font-family: 'Space Mono', monospace;
  font-size: 0.62rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #35c98f;
  margin: 0 0 1.15rem;
  text-shadow: 0 1px 10px rgba(0,0,0,0.7);
}
#haylynn-veil .veil-pitch {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 300;
  font-size: clamp(1.05rem, 3.4vw, 1.25rem);
  line-height: 1.45;
  color: #e8e2d8;
  margin: 0 0 1.35rem;
  text-shadow: 0 1px 14px rgba(0,0,0,0.85);
}
#haylynn-veil .veil-pillars {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.4rem 0.5rem;
  margin: 0 0 1.5rem;
}
#haylynn-veil .veil-pillars span {
  font-family: 'Space Mono', monospace;
  font-size: 0.5rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #d4cce0;
  border: 1px solid rgba(255,255,255,0.18);
  background: rgba(0,0,0,0.35);
  border-radius: 999px;
  padding: 0.35rem 0.65rem;
}
#haylynn-veil .veil-cta {
  display: inline-block;
  font-family: 'Space Mono', monospace;
  font-size: 0.62rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #06050c;
  background: linear-gradient(135deg, #35c98f 0%, #7dffe0 100%);
  border-radius: 999px;
  padding: 0.75rem 1.35rem;
  box-shadow:
    0 0 0 1px rgba(53,201,143,0.4),
    0 8px 32px rgba(53,201,143,0.25);
}
#haylynn-veil .veil-hint {
  display: block;
  margin-top: 0.85rem;
  font-family: 'Space Mono', monospace;
  font-size: 0.52rem;
  letter-spacing: 0.1em;
  color: #9a92a4;
  line-height: 1.5;
}
#haylynn-veil:focus-visible {
  box-shadow: inset 0 0 0 2px #35c98f;
}
#haylynn-veil:hover .veil-cta,
#haylynn-veil:focus-visible .veil-cta {
  filter: brightness(1.06);
}
body.veil-locked {
  overflow: hidden !important;
}
body.veil-locked #scroller {
  overflow: hidden !important;
}
@media (prefers-reduced-motion: reduce) {
  #haylynn-veil .veil-art,
  #haylynn-veil .veil-scrim,
  #haylynn-veil .veil-copy,
  #haylynn-veil .veil-hole {
    transition: none !important;
  }
  #haylynn-veil.is-opening .veil-hole {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }
}
@media (max-width: 480px) {
  #haylynn-veil .veil-copy {
    max-width: min(20rem, calc(100vw - 1.75rem));
  }
  #haylynn-veil .veil-pillars span {
    font-size: 0.48rem;
  }
}
`;

function oncePerSession() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch (_) {
    return false;
  }
}

function markOpened() {
  try {
    sessionStorage.setItem(STORAGE_KEY, '1');
  } catch (_) {}
}

export function startVeil() {
  if (oncePerSession()) return;
  if (document.getElementById('haylynn-veil')) return;

  if (!document.getElementById('haylynn-veil-style')) {
    const style = document.createElement('style');
    style.id = 'haylynn-veil-style';
    style.textContent = STYLE;
    document.head.appendChild(style);
  }

  const btn = document.createElement('button');
  btn.id = 'haylynn-veil';
  btn.type = 'button';
  btn.setAttribute(
    'aria-label',
    'Enter Haylynn — Princess of Reality. Story, language, and music in one house.'
  );
  btn.innerHTML = `
    <span class="veil-art" aria-hidden="true"></span>
    <span class="veil-scrim" aria-hidden="true"></span>
    <span class="veil-hole" aria-hidden="true"></span>
    <span class="veil-copy">
      <span class="veil-kicker">Princess of Reality</span>
      <span class="veil-name">Haylynn</span>
      <span class="veil-title">One living story universe</span>
      <span class="veil-pitch">
        Sci‑fi books, a language you can learn, and music from the same world —
        under one roof she still walks.
      </span>
      <span class="veil-pillars" aria-hidden="true">
        <span>Story</span>
        <span>Language</span>
        <span>Music</span>
        <span>Play</span>
      </span>
      <span class="veil-cta">Enter her world</span>
      <span class="veil-hint">Tap, click, or press Enter</span>
    </span>
  `;

  const queue = pickVeilSrc();
  let idx = 0;
  const art = btn.querySelector('.veil-art');

  function applySrc(src) {
    art.style.setProperty('--veil-src', `url("${src}")`);
  }

  applySrc(queue[0]);

  const probe = new Image();
  probe.onload = () => applySrc(queue[idx]);
  probe.onerror = () => {
    idx += 1;
    if (idx < queue.length) {
      probe.src = queue[idx];
    } else {
      applySrc('assets/veil-enter.svg');
    }
  };
  probe.src = queue[0];

  document.body.appendChild(btn);
  document.body.classList.add('veil-locked');
  requestAnimationFrame(() => btn.focus());

  let opening = false;

  function openVeil() {
    if (opening) return;
    opening = true;
    btn.classList.add('is-opening');
    btn.setAttribute('aria-busy', 'true');
    markOpened();

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ms = reduce ? 120 : 1200;

    setTimeout(() => {
      document.body.classList.remove('veil-locked');
      btn.hidden = true;
      btn.setAttribute('aria-hidden', 'true');
      const main = document.getElementById('scroller') || document.body;
      if (main.tabIndex < 0) main.tabIndex = -1;
      main.focus({ preventScroll: true });
      btn.remove();
    }, ms);
  }

  btn.addEventListener('click', openVeil);
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
      e.preventDefault();
      openVeil();
    }
  });
}
