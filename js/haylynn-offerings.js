/**
 * Renders cause cards into The Well from offerings-config.js
 */

import { OFFERINGS_CONFIG } from './offerings-config.js';

const STYLE = `
.hy-well-grid {
  display: grid;
  gap: 0.85rem;
  margin-top: 1rem;
  text-align: left;
}
.hy-well-card {
  padding: 1rem 1.05rem;
  border-radius: 12px;
  border: 1px solid rgba(53,201,143,0.28);
  background: rgba(53,201,143,0.06);
}
.hy-well-card.is-featured {
  border-color: rgba(138,92,240,0.4);
  background: rgba(138,92,240,0.08);
  padding: 1.15rem 1.15rem 1.2rem;
}
.hy-well-card .tag {
  font-family: 'Space Mono', monospace;
  font-size: 0.48rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--green, #35c98f);
  margin-bottom: 0.4rem;
}
.hy-well-card.is-featured .tag { color: var(--purple, #8a5cf0); }
.hy-well-card .title {
  font-style: italic;
  font-size: 1.2rem;
  color: var(--ink, #efe9e0);
  margin-bottom: 0.4rem;
  line-height: 1.25;
}
.hy-well-card .blurb {
  font-size: 0.92rem;
  line-height: 1.5;
  color: var(--ink-dim, #9a92a4);
  margin-bottom: 0.65rem;
}
.hy-well-card .body-list {
  margin: 0 0 0.75rem;
  padding: 0;
  list-style: none;
}
.hy-well-card .body-list li {
  position: relative;
  padding: 0.35rem 0 0.35rem 0.85rem;
  font-size: 0.88rem;
  line-height: 1.45;
  color: var(--ink-dim, #9a92a4);
  border-top: 1px solid rgba(255,255,255,0.06);
}
.hy-well-card .body-list li:first-child { border-top: none; }
.hy-well-card .body-list li::before {
  content: '';
  position: absolute;
  left: 0; top: 0.7rem;
  width: 5px; height: 5px;
  border-radius: 50%;
  background: var(--green, #35c98f);
  opacity: 0.7;
}
.hy-well-card .goal {
  font-family: 'Space Mono', monospace;
  font-size: 0.5rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ink-dim, #9a92a4);
  margin-bottom: 0.75rem;
}
.hy-well-card .actions {
  display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;
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
  padding: 0.5rem 0.9rem;
}
.hy-well-card a.well-btn:hover {
  background: rgba(53,201,143,0.1);
}
.hy-well-card a.well-btn.primary {
  color: var(--ink, #efe9e0);
  border-color: rgba(138,92,240,0.55);
  background: rgba(138,92,240,0.18);
}
.hy-well-card a.well-btn.primary:hover {
  background: rgba(138,92,240,0.28);
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
.hy-well-face-list a {
  color: var(--green, #35c98f);
  text-decoration: none;
  border-bottom: 1px solid rgba(53,201,143,0.35);
}
`;

function injectStyle() {
  if (document.getElementById('hy-well-style')) return;
  const s = document.createElement('style');
  s.id = 'hy-well-style';
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

function paymentButtons(c) {
  const pays = c.payments || {};
  const labels = { stripe: 'Stripe', gofundme: 'GoFundMe', paypal: 'PayPal' };
  const bits = [];
  for (const key of ['stripe', 'gofundme', 'paypal']) {
    const href = (pays[key] || '').trim();
    if (href) {
      bits.push(`<a class="well-btn" href="${escapeHtml(href)}" target="_blank" rel="noopener">${labels[key]}</a>`);
    }
  }
  if (bits.length) return bits.join('');
  if (c.url && String(c.url).trim()) {
    return `<a class="well-btn" href="${escapeHtml(c.url)}" target="_blank" rel="noopener">${escapeHtml(c.label || 'Support')}</a>`;
  }
  return `<span class="waiting">Payment links not open yet</span>`;
}

function cardHtml(c) {
  const body = Array.isArray(c.body) && c.body.length
    ? `<ul class="body-list">${c.body.map((line) => `<li>${escapeHtml(line)}</li>`).join('')}</ul>`
    : '';
  const goal = c.goal ? `<div class="goal">${escapeHtml(c.goal)}</div>` : '';
  const more = c.moreHref
    ? `<a class="well-btn primary" href="${escapeHtml(c.moreHref)}">${escapeHtml(c.moreLabel || 'Read more')}</a>`
    : '';
  return `
    <article class="hy-well-card${c.featured ? ' is-featured' : ''}" data-cause="${escapeHtml(c.id || '')}">
      ${c.tag ? `<div class="tag">${escapeHtml(c.tag)}</div>` : ''}
      <div class="title">${escapeHtml(c.title || '')}</div>
      <p class="blurb">${escapeHtml(c.blurb || '')}</p>
      ${body}
      ${goal}
      <div class="actions">${more}${paymentButtons(c)}</div>
    </article>`;
}

export function initHaylynnOfferings() {
  injectStyle();
  const causes = (OFFERINGS_CONFIG.causes || []).filter((c) => c.active !== false);
  // Featured first
  causes.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  document.querySelectorAll('[data-role="well-detail"]').forEach((el) => {
    el.innerHTML = `<div class="hy-well-grid">${causes.map(cardHtml).join('')}</div>`;
  });

  document.querySelectorAll('[data-role="well-face"]').forEach((el) => {
    const parts = causes.map((c) => {
      if (c.moreHref) {
        return `<a href="${escapeHtml(c.moreHref)}">${escapeHtml(c.title || c.id)}</a>`;
      }
      return escapeHtml(c.title || c.id);
    });
    el.innerHTML = parts.length
      ? `<div class="hy-well-face-list">${parts.join(' · ')}</div>`
      : '';
  });
}
