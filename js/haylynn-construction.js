/**
 * Unfinished *detail* panels only — content stays in the DOM.
 * Overlay hides it; click dismisses the veil so you can enter the room.
 * Face (scroll) content is never touched.
 */

import { CONSTRUCTION } from './construction-config.js';

const STYLE = `
.hy-forming-veil {
  position: absolute;
  inset: 0;
  z-index: 6;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5.5rem 1.35rem 2.5rem;
  background: rgba(6, 5, 12, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  cursor: pointer;
  text-align: center;
  border: none;
  width: 100%;
  box-sizing: border-box;
  color: inherit;
  font: inherit;
  transition: opacity 0.35s ease, visibility 0.35s ease;
}
.hy-forming-veil.is-dismissed {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}
.hy-forming-inner {
  max-width: 22rem;
}
.hy-forming-kicker {
  font-family: 'Space Mono', monospace;
  font-size: 0.48rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--purple, #8a5cf0);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
}
.hy-forming-kicker .pip {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--purple, #8a5cf0);
  flex: 0 0 auto;
}
.hy-forming-title {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 1.4rem;
  color: var(--ink, #efe9e0);
  margin-bottom: 0.45rem;
}
.hy-forming-line {
  font-size: 0.92rem;
  line-height: 1.5;
  color: var(--ink-dim, #9a92a4);
  margin-bottom: 0.75rem;
}
.hy-forming-cta {
  font-family: 'Space Mono', monospace;
  font-size: 0.5rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--green, #35c98f);
}
.hy-forming-progress {
  display: none;
  font-size: 0.88rem;
  line-height: 1.45;
  color: var(--ink, #efe9e0);
  margin-top: 0.65rem;
}
.hy-forming-veil.is-preview .hy-forming-progress { display: block; }
.hy-forming-veil.is-preview .hy-forming-cta { display: none; }

/* Close always above the veil */
.section .detail > .detail-close {
  z-index: 8 !important;
}

@media (prefers-reduced-motion: reduce) {
  .hy-forming-veil { transition: none; }
}
`;

function injectStyle() {
  if (document.getElementById('hy-forming-style')) return;
  const s = document.createElement('style');
  s.id = 'hy-forming-style';
  s.textContent = STYLE;
  document.head.appendChild(s);
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function storageKey(id) {
  return `hy-forming-entered:${id}`;
}

function attachOverlay(detail, id, cfg) {
  if (detail.querySelector('[data-role="hy-forming"]')) return;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'hy-forming-veil';
  btn.setAttribute('data-role', 'hy-forming');
  btn.setAttribute('data-section', id);
  btn.setAttribute('aria-label', 'Enter this room');
  btn.innerHTML = `
    <div class="hy-forming-inner">
      <div class="hy-forming-kicker"><span class="pip"></span> Aperture incomplete</div>
      <div class="hy-forming-title">${escapeHtml(cfg.label || 'Still forming')}</div>
      <p class="hy-forming-line">${escapeHtml(cfg.line || '')}</p>
      <div class="hy-forming-cta">Touch to enter</div>
      <p class="hy-forming-progress">${escapeHtml(cfg.progress || '')}</p>
    </div>
  `;

  // Remember per session if they already entered (optional)
  const remember = cfg.remember !== false;
  if (remember && sessionStorage.getItem(storageKey(id)) === '1') {
    btn.classList.add('is-dismissed');
  }

  let previewed = false;
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    // First tap: show progress line; second tap (or if no progress): dismiss and enter
    if (!previewed && cfg.progress) {
      previewed = true;
      btn.classList.add('is-preview');
      const cta = btn.querySelector('.hy-forming-cta');
      if (cta) {
        cta.style.display = 'block';
        cta.textContent = 'Touch again to enter';
      }
      return;
    }
    btn.classList.add('is-dismissed');
    if (remember) sessionStorage.setItem(storageKey(id), '1');
  });

  detail.appendChild(btn);
}

export function initConstructionOverlays() {
  injectStyle();
  const map = CONSTRUCTION.sections || {};
  document.querySelectorAll('.section[data-id]').forEach((section) => {
    const id = section.getAttribute('data-id');
    const cfg = map[id];
    if (!cfg) return;
    const detail = section.querySelector('.detail');
    if (!detail) return;
    attachOverlay(detail, id, cfg);
  });
}
