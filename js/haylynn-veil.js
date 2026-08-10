/**
 * Haylynn veil — fixed aperture overlay.
 * Enter = step through the event horizon; radial clear centre reveals the scroll.
 * Accessible: button focus, Enter/Space, Escape.
 */

const STORAGE_KEY = 'haylynn-veil-open';
const VEIL_SRC = 'assets/veil-mech.jpg';

const STYLE = `
#haylynn-veil {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  cursor: pointer;
  outline: none;
  border: none;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
}
#haylynn-veil[hidden] {
  display: none !important;
}
#haylynn-veil .veil-art {
  position: absolute;
  inset: 0;
  background: #000 center / cover no-repeat;
  background-image: url('${VEIL_SRC}');
  transition: opacity 0.9s ease;
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
  box-shadow: 0 0 0 200vmax #000;
  background: radial-gradient(circle,
    transparent 0%,
    transparent 42%,
    rgba(0,0,0,0.35) 52%,
    rgba(0,0,0,0.85) 62%,
    #000 72%);
  opacity: 0;
}
#haylynn-veil.is-opening .veil-art {
  opacity: 0;
  transition: opacity 1s ease 0.15s;
}
#haylynn-veil.is-opening .veil-hole {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
  transition: transform 1.2s cubic-bezier(0.22, 0.61, 0.36, 1), opacity 0.2s ease;
}
#haylynn-veil .veil-copy {
  position: relative;
  z-index: 2;
  text-align: center;
  pointer-events: none;
  max-width: 18rem;
  padding: 1rem;
  transition: opacity 0.45s ease, transform 0.45s ease;
}
#haylynn-veil.is-opening .veil-copy {
  opacity: 0;
  transform: scale(0.92);
}
#haylynn-veil .veil-kicker {
  font-family: 'Space Mono', monospace;
  font-size: 0.55rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #8a5cf0;
  margin-bottom: 0.6rem;
}
#haylynn-veil .veil-title {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 300;
  font-style: italic;
  font-size: clamp(1.6rem, 5vw, 2.1rem);
  color: #efe9e0;
  margin-bottom: 0.5rem;
}
#haylynn-veil .veil-hint {
  font-family: 'Space Mono', monospace;
  font-size: 0.58rem;
  letter-spacing: 0.08em;
  color: #9a92a4;
  line-height: 1.5;
}
#haylynn-veil:focus-visible {
  box-shadow: inset 0 0 0 2px #35c98f;
}
body.veil-locked {
  overflow: hidden !important;
}
body.veil-locked #scroller {
  overflow: hidden !important;
}
@media (prefers-reduced-motion: reduce) {
  #haylynn-veil .veil-art,
  #haylynn-veil .veil-copy,
  #haylynn-veil .veil-hole {
    transition: none !important;
  }
  #haylynn-veil.is-opening .veil-mask {
    opacity: 0;
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
  btn.setAttribute('aria-label', 'Enter the world of Princess of Reality');
  btn.innerHTML = `
    <span class="veil-art" aria-hidden="true"></span>
    <span class="veil-hole" aria-hidden="true"></span>
    <span class="veil-copy">
      <span class="veil-kicker">Princess of Reality</span>
      <span class="veil-title">Step through</span>
      <span class="veil-hint">Click, tap, or press Enter<br>to cross the horizon</span>
    </span>
  `;
  document.body.appendChild(btn);
  document.body.classList.add('veil-locked');

  // Focus for keyboard users
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
      // Return focus to main content
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
