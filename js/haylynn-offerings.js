/**
 * Renders cause cards into The Well section from offerings-config.js
 */

import { OFFERINGS_CONFIG } from './offerings-config.js';

const STYLE = `
.hy-well-grid {
  display: grid;
  gap: 0.75rem;
  margin-top: 1rem;
  text-align: left;
}
.hy-well-card {
  padding: 0.95rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(138,92,240,0.25);
  background: rgba(138,92,240,0.06);
}
.hy-well-card .tag {
  font-family: 'Space Mono', monospace;
  font-size: 0.48rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--purple, #8a5cf0);
  margin-bottom: 0.35rem;
}
.hy-well-card .title {
  font-style: italic;
  font-size: 1.15rem;
  color: var(--ink, #efe9e0);
  margin-bottom: 0.35rem;
}
.hy-well-card .blurb {
  font-size: 0.9rem;
  line-height: 1.45;
  color: var(--ink-dim, #9a92a4);
  margin-bottom: 0.7rem;
}
.hy-well-card a.well-btn {
  display: inline-block;
  font-family: 'Space Mono', monospace;
  font-size: 0.5rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--green, #35c98f);
  border: 1px solid rgba(53,201,143,0.4);
  border-radius: 16px;
  padding: 0.45rem 0.85rem;
}
.hy-well-card a.well-btn:hover {
  background: rgba(53,201,143,0.1);
}
.hy-well-card .waiting {
  font-family: 'Space Mono', monospace;
  font-size: 0.48rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-dim, #9a92a4);
  opacity: 0.75;
}
.hy-well-face-list {
  margin-top: 0.85rem;
  font-family: 'Space Mono', monospace;
  font-size: 0.52rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-dim, #9a92a4);
  line-height: 1.7;
}
`;

function injectStyle() {
  if (document.getElementById('hy-well-style')) return;
  const s = document.createElement('style');
  s.id = 'hy-well-style';
  s.textContent = STYLE;
  document.head.appendChild(s);
}

function cardHtml(c) {
  const hasLink = Boolean(c.url && String(c.url).trim());
  const action = hasLink
    ? `<a class="well-btn" href="${c.url}" target="_blank" rel="noopener">${c.label || 'Support'}</a>`
    : `<span class="waiting">Link not open yet</span>`;
  return `
    <article class="hy-well-card" data-cause="${c.id || ''}">
      ${c.tag ? `<div class="tag">${c.tag}</div>` : ''}
      <div class="title">${c.title || ''}</div>
      <p class="blurb">${c.blurb || ''}</p>
      ${action}
    </article>`;
}

export function initHaylynnOfferings() {
  injectStyle();
  const causes = (OFFERINGS_CONFIG.causes || []).filter((c) => c.active !== false);

  document.querySelectorAll('[data-role="well-detail"]').forEach((el) => {
    el.innerHTML = `<div class="hy-well-grid">${causes.map(cardHtml).join('')}</div>`;
  });

  document.querySelectorAll('[data-role="well-face"]').forEach((el) => {
    const names = causes.map((c) => c.title).filter(Boolean);
    el.innerHTML = names.length
      ? `<div class="hy-well-face-list">${names.join(' · ')}</div>`
      : '';
  });
}
