/**
 * Haylynn Live Radio — Music section surface
 * - On-air player when RADIO_CONFIG.streamUrl is set
 * - Now-playing + host line from API when nowPlayingUrl is set
 * - Brand-aligned holding state otherwise (site is radio-ready)
 */

import { RADIO_CONFIG } from './radio-config.js';

const STYLE = `
.hy-radio {
  margin-top: 1.2rem;
  padding: 1rem 1.1rem;
  border-radius: 14px;
  border: 1px solid rgba(138,92,240,0.28);
  background: rgba(138,92,240,0.06);
  text-align: left;
}
.hy-radio .radio-kicker {
  font-family: 'Space Mono', monospace;
  font-size: 0.5rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--purple, #8a5cf0);
  margin-bottom: 0.45rem;
  display: flex;
  align-items: center;
  gap: 0.45rem;
}
.hy-radio .radio-kicker .pip {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--ink-dim, #9a92a4);
  flex: 0 0 auto;
}
.hy-radio.is-live .radio-kicker .pip {
  background: var(--green, #35c98f);
  box-shadow: 0 0 10px rgba(53,201,143,0.55);
  animation: hy-radio-pulse 1.6s ease-in-out infinite;
}
.hy-radio.is-holding .radio-kicker .pip {
  background: var(--purple, #8a5cf0);
  opacity: 0.7;
}
@keyframes hy-radio-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
}
.hy-radio .radio-title {
  font-style: italic;
  font-size: 1.15rem;
  color: var(--ink, #efe9e0);
  margin-bottom: 0.35rem;
}
.hy-radio .radio-meta {
  font-family: 'Space Mono', monospace;
  font-size: 0.55rem;
  letter-spacing: 0.06em;
  color: var(--ink-dim, #9a92a4);
  line-height: 1.5;
  margin-bottom: 0.7rem;
}
.hy-radio .radio-host {
  font-size: 0.92rem;
  color: var(--ink-dim, #9a92a4);
  line-height: 1.5;
  font-style: italic;
  margin-bottom: 0.85rem;
}
.hy-radio .radio-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.hy-radio .radio-play {
  width: 40px; height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(53,201,143,0.45);
  background: rgba(53,201,143,0.1);
  color: var(--green, #35c98f);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  flex: 0 0 auto;
}
.hy-radio .radio-play:disabled {
  opacity: 0.35;
  cursor: default;
  border-color: rgba(255,255,255,0.12);
  color: var(--ink-dim, #9a92a4);
  background: rgba(255,255,255,0.03);
}
.hy-radio .radio-play .icon-pause { display: none; }
.hy-radio.is-playing .radio-play .icon-play { display: none; }
.hy-radio.is-playing .radio-play .icon-pause { display: block; }
.hy-radio .radio-status {
  font-family: 'Space Mono', monospace;
  font-size: 0.55rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-dim, #9a92a4);
}
.hy-radio .radio-contribute {
  margin-top: 0.9rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255,255,255,0.08);
  font-size: 0.85rem;
  color: var(--ink-dim, #9a92a4);
  line-height: 1.45;
}
.hy-radio-face {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.75rem;
  font-family: 'Space Mono', monospace;
  font-size: 0.52rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-dim, #9a92a4);
}
.hy-radio-face .pip {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--purple, #8a5cf0);
  opacity: 0.8;
}
@media (prefers-reduced-motion: reduce) {
  .hy-radio.is-live .radio-kicker .pip { animation: none; }
}
`;

function injectStyle() {
  if (document.getElementById('hy-radio-style')) return;
  const s = document.createElement('style');
  s.id = 'hy-radio-style';
  s.textContent = STYLE;
  document.head.appendChild(s);
}

function bindRoot(root) {
  const playBtn = root.querySelector('[data-role="radio-play"]');
  const titleEl = root.querySelector('[data-role="radio-title"]');
  const metaEl = root.querySelector('[data-role="radio-meta"]');
  const hostEl = root.querySelector('[data-role="radio-host"]');
  const statusEl = root.querySelector('[data-role="radio-status"]');
  const audio = root.querySelector('audio');

  const hasStream = Boolean(RADIO_CONFIG.streamUrl);
  root.classList.toggle('is-live', hasStream);
  root.classList.toggle('is-holding', !hasStream);

  if (!hasStream) {
    if (titleEl) titleEl.textContent = RADIO_CONFIG.holding.title;
    if (metaEl) metaEl.textContent = 'Silent for now';
    if (hostEl) hostEl.textContent = RADIO_CONFIG.holding.host;
    if (statusEl) statusEl.textContent = 'Quiet';
    if (playBtn) playBtn.disabled = true;
    return;
  }

  if (audio) {
    audio.src = RADIO_CONFIG.streamUrl;
    audio.preload = 'none';
  }
  if (statusEl) statusEl.textContent = 'Live';
  if (playBtn) {
    playBtn.disabled = false;
    playBtn.addEventListener('click', async () => {
      if (!audio) return;
      try {
        if (audio.paused) {
          await audio.play();
          root.classList.add('is-playing');
          if (statusEl) statusEl.textContent = 'On air';
        } else {
          audio.pause();
          root.classList.remove('is-playing');
          if (statusEl) statusEl.textContent = 'Paused';
        }
      } catch (err) {
        console.warn('[haylynn-radio]', err);
        if (statusEl) statusEl.textContent = 'Unavailable';
      }
    });
  }

  async function pollNowPlaying() {
    if (!RADIO_CONFIG.nowPlayingUrl) return;
    try {
      const res = await fetch(RADIO_CONFIG.nowPlayingUrl, { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (titleEl && data.title) titleEl.textContent = data.title;
      if (metaEl) {
        const bits = [];
        if (data.artist) bits.push(data.artist);
        if (data.uploader) bits.push(`via ${data.uploader}`);
        metaEl.textContent = bits.join(' · ') || metaEl.textContent;
      }
      if (hostEl && data.host_line) hostEl.textContent = data.host_line;
    } catch (err) {
      console.warn('[haylynn-radio:now-playing]', err.message || err);
    }
  }

  pollNowPlaying();
  setInterval(pollNowPlaying, RADIO_CONFIG.pollMs || 15000);
}

export function initHaylynnRadio() {
  injectStyle();

  // Face strip (optional markers in content)
  document.querySelectorAll('[data-role="radio-face"]').forEach(el => {
    el.classList.add('hy-radio-face');
    const live = Boolean(RADIO_CONFIG.streamUrl);
    el.innerHTML = `<span class="pip"></span>${live ? 'Live frequency' : 'Live frequency · quiet'}`;
  });

  document.querySelectorAll('[data-role="radio-root"]').forEach(bindRoot);
}
