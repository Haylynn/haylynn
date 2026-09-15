/**
 * Hananaru — product grid from products-config.js
 */
import { PRODUCTS_CONFIG } from './products-config.js';

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function activeProducts() {
  const list = (PRODUCTS_CONFIG.products || []).filter((p) => p && (p.enabled || p.checkoutUrl));
  // If none enabled, show placeholders so the shelf still exists
  if (!list.length) {
    return (PRODUCTS_CONFIG.products || []).slice(0, PRODUCTS_CONFIG.faceLimit || 6);
  }
  return list.filter((p) => p.enabled !== false).slice(0, PRODUCTS_CONFIG.faceLimit || 6);
}

function cardHtml(p) {
  const sym = PRODUCTS_CONFIG.currencySymbol || '£';
  const price =
    p.price != null && p.price !== ''
      ? `${sym}${p.price}`
      : p.checkoutUrl
        ? `${sym}—`
        : `${sym}—`;
  const tag = p.checkoutUrl && p.enabled !== false ? p.tag || 'Open' : p.tag || 'Waiting';
  const media = p.image
    ? `<img src="${escapeHtml(p.image)}" alt="" loading="lazy" style="width:40px;height:40px;object-fit:cover;margin:0.4rem auto 0.6rem;display:block;border-radius:6px">`
    : `<svg width="40" height="40" viewBox="0 0 48 48" aria-hidden="true"><rect x="14" y="10" width="20" height="28" fill="none" stroke="#35c98f" stroke-width="1.5" rx="3"/><line x1="18" y1="18" x2="30" y2="18" stroke="#35c98f" stroke-width="1.2"/><line x1="18" y1="24" x2="30" y2="24" stroke="#35c98f" stroke-width="1.2"/><circle cx="24" cy="32" r="2" fill="#35c98f"/></svg>`;
  const open =
    p.checkoutUrl && p.enabled !== false
      ? `<a class="product-buy" href="${escapeHtml(p.checkoutUrl)}" target="_blank" rel="noopener noreferrer">Acquire</a>`
      : '';
  return `<div class="product-card" data-product-id="${escapeHtml(p.id || '')}">
    <span class="tag">${escapeHtml(tag)}</span>
    ${media}
    <span class="name">${escapeHtml(p.name || 'Item')}</span>
    <span class="price">${escapeHtml(price)}</span>
    ${open}
  </div>`;
}

const BUY_CSS = `
.product-card .product-buy {
  display: inline-block; margin-top: 0.45rem;
  font-family: 'Space Mono', monospace; font-size: 0.48rem;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--green, #35c98f); text-decoration: none;
  border-bottom: 1px solid rgba(53,201,143,0.35);
}
`;

export function initHaylynnProducts() {
  if (!document.getElementById('hy-products-style')) {
    const s = document.createElement('style');
    s.id = 'hy-products-style';
    s.textContent = BUY_CSS;
    document.head.appendChild(s);
  }
  const products = activeProducts();
  document.querySelectorAll('[data-role="hananaru-grid"]').forEach((el) => {
    el.classList.add('product-grid');
    el.innerHTML = products.map(cardHtml).join('');
  });
}
