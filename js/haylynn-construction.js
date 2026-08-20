/**
 * Overlay unfinished *detail* panels only (swipe / deeper view).
 * Face of each section stays fully readable.
 */

import { CONSTRUCTION } from './construction-config.js';

const STYLE = `
.hy-forming {
  position: absolute;
  inset: 0;
  z-index: 6;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 1.25rem;
  background: rgba(6, 5, 12, 0.82);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  cursor: pointer;
  text-align: center;
  border: none;
  width: 100%;
  color: inherit;
  font: inherit;
}
.hy-forming:focus-visible {
  outline: 1px solid var(--purple, #8a5cf0);
  outline-offset: -4px;
}
.hy-forming-inner {
  max-width: 22rem;
  pointer-events: none;
}
.hy-forming-kicker {
  font-family: 'Space Mono', monospace;
  font-size: 0.5rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--purple, #8a5cf0);
  margin-bottom: 0.65rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
}
.hy-forming-kicker .pip {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--purple, #8a5cf0);
  opacity: 0.85;
  animation: hy-forming-pulse 2s ease-in-out infinite;
}
@keyframes hy-forming-pulse {
  0%, 100% { opacity: 0.85; }
  50% { opacity: 0.35; }
}
.hy-forming-title {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: 1.35rem;
  color: var(--ink, #efe9e0);
  margin-bottom: 0.55rem;
}
.hy-forming-line {
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--ink-dim, #9a92a4);
  margin-bottom: 0.85rem;
}
.hy-forming-cta {
  font-family: 'Space Mono', monospace;
  font-size: 0.5rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--green, #35c98f);
  opacity: 0.9;
}
.hy-forming.is-open .hy-forming-cta { display: none; }
.hy-forming-progress {
  display: none;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--ink, #efe9e0);
  margin-top: 0.35rem;
  opacity: 0.9;
}
.hy-forming.is-open .hy-forming-progress { display: block; }
.hy-forming.is-open .hy-forming-line { opacity: 0.55; }

/* Detail must position so overlay can cover content */
.section .detail.has-forming {
  position: relative;
}
.section .detail.has-forming > *:not(.hy-forming):not(.detail-close) {
  /* keep content in DOM for when forming lifts; dim slightly under overlay is enough */
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

function attachOverlay(detail, id, cfg) {
  if (detail.querySelector('.hy-forming')) return;
  detail.classList.add('has-forming');

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'hy-forming';
  btn.setAttribute('data-section', id);
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = `
    <div class="hy-forming-inner">
      <div class="hy-forming-kicker"><span class="pip"></span> Aperture incomplete</div>
      <div class="hy-forming-title">${escapeHtml(cfg.label || 'Still forming')}</div>
      <p class="hy-forming-line">${escapeHtml(cfg.line || '')}</p>
      <div class="hy-forming-cta">Touch for progress</div>
      <p class="hy-forming-progress">${escapeHtml(cfg.progress || '')}</p>
    </div>
  `;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = btn.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open && CONSTRUCTION.progressUrl && e.detail === 2) {
      // double-intent optional: long path via config only on explicit second mode — skip auto-nav
    }
  });

  // Optional: long-press or second control for external progress URL
  if (CONSTRUCTION.progressUrl) {
    const link = document.createElement('a');
    link.href = CONSTRUCTION.progressUrl;
    link.target = '_blank';
    link.rel = 'noopener';
    link.className = 'hy-forming-cta';
    link.style.cssText = 'display:none;pointer-events:auto;margin-top:0.75rem;color:var(--purple,#8a5cf0)';
    link.textContent = 'Open progress log';
    btn.querySelector('.hy-forming-inner').appendChild(link);
    btn.addEventListener('click', () => {
      link.style.display = btn.classList.contains('is-open') ? 'inline-block' : 'none';
    });
  }

  // Insert after close button so × stays usable
  const close = detail.querySelector('.detail-close');
  if (close && close.nextSibling) {
    detail.insertBefore(btn, close.nextSibling);
  } else {
    detail.appendChild(btn);
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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
