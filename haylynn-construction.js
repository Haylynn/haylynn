/**
 * Mark unfinished *detail* panels only (not the scroll face).
 * mode: 'veil' = full cover (tap for progress) | 'banner' = top strip, content still usable
 */

import { CONSTRUCTION } from './construction-config.js';

const STYLE = `
.section .detail.has-forming {
  position: absolute; /* already absolute; ensure containing block */
}
.hy-forming-veil {
  position: absolute;
  inset: 0;
  z-index: 6;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5.5rem 1.25rem 2rem;
  background: rgba(6, 5, 12, 0.88);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  cursor: pointer;
  text-align: center;
  border: none;
  width: 100%;
  box-sizing: border-box;
  color: inherit;
  font: inherit;
}
.hy-forming-banner {
  position: sticky;
  top: 0;
  z-index: 5;
  width: 100%;
  box-sizing: border-box;
  margin: -0.5rem 0 1.1rem;
  padding: 0.85rem 1rem;
  text-align: left;
  border: 1px solid rgba(138, 92, 240, 0.28);
  border-radius: 12px;
  background: rgba(138, 92, 240, 0.1);
  cursor: pointer;
  color: inherit;
  font: inherit;
}
.hy-forming-kicker {
  font-family: 'Space Mono', monospace;
  font-size: 0.48rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--purple, #8a5cf0);
  margin-bottom: 0.4rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.hy-forming-veil .hy-forming-kicker { justify-content: center; }
.hy-forming-kicker .pip {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--purple, #8a5cf0);
  flex: 0 0 auto;
}
.hy-forming-title {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 1.25rem;
  color: var(--ink, #efe9e0);
  margin-bottom: 0.35rem;
}
.hy-forming-veil .hy-forming-title { font-size: 1.35rem; }
.hy-forming-line {
  font-size: 0.9rem;
  line-height: 1.45;
  color: var(--ink-dim, #9a92a4);
  margin: 0;
}
.hy-forming-cta {
  font-family: 'Space Mono', monospace;
  font-size: 0.48rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--green, #35c98f);
  margin-top: 0.65rem;
}
.hy-forming-progress {
  display: none;
  font-size: 0.88rem;
  line-height: 1.45;
  color: var(--ink, #efe9e0);
  margin-top: 0.55rem;
}
.hy-forming.is-open .hy-forming-progress { display: block; }
.hy-forming.is-open .hy-forming-cta { display: none; }

/* Close control always above veil */
.section .detail > .detail-close {
  z-index: 8 !important;
}

@media (prefers-reduced-motion: reduce) {
  .hy-forming-kicker .pip { animation: none; }
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

function attachOverlay(detail, id, cfg) {
  if (detail.querySelector('[data-role="hy-forming"]')) return;
  detail.classList.add('has-forming');

  const mode = cfg.mode === 'veil' ? 'veil' : 'banner';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = mode === 'veil' ? 'hy-forming hy-forming-veil' : 'hy-forming hy-forming-banner';
  btn.setAttribute('data-role', 'hy-forming');
  btn.setAttribute('data-section', id);
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = `
    <div class="hy-forming-kicker"><span class="pip"></span> Aperture incomplete</div>
    <div class="hy-forming-title">${escapeHtml(cfg.label || 'Still forming')}</div>
    <p class="hy-forming-line">${escapeHtml(cfg.line || '')}</p>
    <div class="hy-forming-cta">Touch for progress</div>
    <p class="hy-forming-progress">${escapeHtml(cfg.progress || '')}</p>
  `;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = btn.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  if (mode === 'veil') {
    detail.appendChild(btn);
  } else {
    // Banner after eyebrow / before main detail content
    const close = detail.querySelector('.detail-close');
    const eyebrow = detail.querySelector(':scope > .eyebrow');
    if (eyebrow && eyebrow.nextSibling) {
      detail.insertBefore(btn, eyebrow.nextSibling);
    } else if (close && close.nextSibling) {
      detail.insertBefore(btn, close.nextSibling);
    } else {
      detail.prepend(btn);
    }
  }
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
