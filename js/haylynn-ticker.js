/**
 * Haylynn ambient bar — NEWS core, prices secondary
 * Touch freezes scroll · opens upward detail sheet · idle resumes
 */

import { TICKER_CONFIG } from './ticker-config.js';

const IDLE_RESUME_MS = 5000; // untouched → resume scroll + collapse sheet

const STYLE = `
#haylynn-ticker-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 40;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  pointer-events: none;
}
#haylynn-ticker-wrap.active {
  pointer-events: auto;
}
#haylynn-ticker-sheet {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.4s cubic-bezier(.22,.61,.36,1), opacity 0.35s ease;
  background: rgba(6,5,12,0.96);
  border-top: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
#haylynn-ticker-wrap.open #haylynn-ticker-sheet {
  max-height: 42vh;
  opacity: 1;
}
#haylynn-ticker-sheet .sheet-inner {
  padding: 1rem 1.2rem 0.9rem;
  font-family: 'Cormorant Garamond', serif;
  color: var(--ink, #efe9e0);
}
#haylynn-ticker-sheet .sheet-kicker {
  font-family: 'Space Mono', monospace;
  font-size: 0.55rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--purple, #8a5cf0);
  margin-bottom: 0.45rem;
}
#haylynn-ticker-sheet .sheet-kicker.breaking {
  color: var(--pink, #ec5aa0);
}
#haylynn-ticker-sheet .sheet-title {
  font-size: 1.15rem;
  font-style: italic;
  font-weight: 300;
  line-height: 1.35;
  margin-bottom: 0.55rem;
}
#haylynn-ticker-sheet .sheet-meta {
  font-family: 'Space Mono', monospace;
  font-size: 0.58rem;
  letter-spacing: 0.06em;
  color: var(--ink-dim, #9a92a4);
  line-height: 1.5;
}
#haylynn-ticker-sheet .sheet-price {
  font-family: 'Space Mono', monospace;
  font-size: 1.4rem;
  letter-spacing: 0.04em;
  margin: 0.3rem 0 0.4rem;
  font-variant-numeric: tabular-nums;
}
#haylynn-ticker-sheet .sheet-chg.up { color: var(--green, #35c98f); }
#haylynn-ticker-sheet .sheet-chg.down { color: var(--pink, #ec5aa0); }
#haylynn-ticker-sheet .sheet-hint {
  margin-top: 0.7rem;
  font-family: 'Space Mono', monospace;
  font-size: 0.5rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-dim, #9a92a4);
  opacity: 0.65;
}

#haylynn-ticker {
  min-height: 32px;
  display: flex;
  align-items: center;
  opacity: 0;
  transition: opacity var(--ticker-fade, 0.8s) ease, background 0.5s ease, border-color 0.5s ease;
  background: linear-gradient(to top, rgba(6,5,12,0.94) 0%, rgba(6,5,12,0.55) 70%, transparent 100%);
  border-top: 1px solid rgba(255,255,255,0.06);
  font-family: 'Space Mono', monospace;
  font-size: 0.58rem;
  letter-spacing: 0.05em;
  color: var(--ink-dim, #9a92a4);
  overflow: hidden;
}
#haylynn-ticker-wrap.visible #haylynn-ticker {
  opacity: 1;
}
#haylynn-ticker-wrap.breaking #haylynn-ticker {
  border-top-color: rgba(236,90,160,0.45);
  background: linear-gradient(to top, rgba(30,8,18,0.96) 0%, rgba(6,5,12,0.75) 75%, transparent 100%);
}
#haylynn-ticker .track {
  display: flex;
  align-items: center;
  gap: 1.4rem;
  white-space: nowrap;
  padding: 0.45rem 1.2rem;
  animation: ticker-scroll 55s linear infinite;
}
#haylynn-ticker-wrap.breaking .track {
  animation-duration: 40s;
}
#haylynn-ticker-wrap.frozen .track,
#haylynn-ticker-wrap:hover .track {
  animation-play-state: paused;
}
@keyframes ticker-scroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
#haylynn-ticker .news-item,
#haylynn-ticker .price-item {
  display: inline-flex;
  align-items: baseline;
  gap: 0.5rem;
  cursor: pointer;
  border-radius: 4px;
  padding: 0.1rem 0.2rem;
  transition: background 0.2s ease;
}
#haylynn-ticker .news-item:hover,
#haylynn-ticker .price-item:hover,
#haylynn-ticker .news-item:focus-visible,
#haylynn-ticker .price-item:focus-visible {
  background: rgba(255,255,255,0.06);
  outline: none;
}
#haylynn-ticker .news-item {
  max-width: 70vw;
}
#haylynn-ticker .news-item .tag {
  flex: 0 0 auto;
  font-size: 0.5rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--purple, #8a5cf0);
  opacity: 0.9;
}
#haylynn-ticker .news-item.breaking .tag {
  color: var(--pink, #ec5aa0);
}
#haylynn-ticker .news-item .headline {
  color: var(--ink, #efe9e0);
  opacity: 0.92;
  overflow: hidden;
  text-overflow: ellipsis;
}
#haylynn-ticker .news-item.breaking .headline {
  font-weight: 700;
}
#haylynn-ticker .price-item {
  opacity: 0.8;
  gap: 0.4rem;
}
#haylynn-ticker .price-item .label {
  color: var(--ink-dim, #9a92a4);
}
#haylynn-ticker .price-item .price {
  color: var(--ink, #efe9e0);
  font-variant-numeric: tabular-nums;
}
#haylynn-ticker .price-item .chg {
  font-size: 0.52rem;
}
#haylynn-ticker .price-item .chg.up   { color: var(--green, #35c98f); }
#haylynn-ticker .price-item .chg.down { color: var(--pink, #ec5aa0); }
#haylynn-ticker .sep {
  opacity: 0.3;
  margin: 0 0.15rem;
  pointer-events: none;
}
#haylynn-ticker .block-sep {
  opacity: 0.45;
  color: var(--purple, #8a5cf0);
  margin: 0 0.4rem;
  pointer-events: none;
}
@media (prefers-reduced-motion: reduce) {
  #haylynn-ticker .track { animation: none; }
  #haylynn-ticker-sheet { transition: none; }
}
`;

function formatPrice(n) {
  if (n == null || isNaN(n)) return '—';
  if (n >= 1000) return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (n >= 1)    return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
  return n.toLocaleString('en-US', { maximumFractionDigits: 4 });
}

function formatChange(pct) {
  if (pct == null || isNaN(pct)) return '';
  const sign = pct >= 0 ? '+' : '';
  return `${sign}${pct.toFixed(1)}%`;
}

function isBreaking(title) {
  const t = (title || '').toLowerCase();
  return (TICKER_CONFIG.breakingKeywords || []).some(k => t.includes(k.toLowerCase()));
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function fetchCrypto(ids) {
  if (!ids.length) return {};
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=usd&include_24hr_change=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
  return res.json();
}

async function fetchStocks(symbols) {
  if (!symbols.length) return {};
  const out = {};
  try {
    const list = symbols.map(s => encodeURIComponent(s)).join(',');
    const res = await fetch(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${list}`);
    if (!res.ok) return out;
    const data = await res.json();
    for (const q of (data?.quoteResponse?.result || [])) {
      if (!q?.symbol) continue;
      out[q.symbol] = { price: q.regularMarketPrice, change: q.regularMarketChangePercent };
    }
  } catch (_) {}
  return out;
}

function parseRss(xmlText, sourceLabel) {
  const items = [];
  try {
    const doc = new DOMParser().parseFromString(xmlText, 'text/xml');
    for (const node of [...doc.querySelectorAll('item')].slice(0, 8)) {
      const title = node.querySelector('title')?.textContent?.trim();
      if (!title) continue;
      const link = node.querySelector('link')?.textContent?.trim() || '';
      const desc = node.querySelector('description')?.textContent?.replace(/<[^>]+>/g, '').trim() || '';
      items.push({
        title: title.replace(/\s+/g, ' '),
        source: sourceLabel || 'News',
        link,
        desc: desc.slice(0, 280),
        breaking: isBreaking(title)
      });
    }
  } catch (_) {}
  return items;
}

async function fetchFeed(feed) {
  try {
    const res = await fetch(feed.url, { mode: 'cors' });
    if (res.ok) return parseRss(await res.text(), feed.label);
  } catch (_) {}
  try {
    const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(feed.url)}`);
    if (res.ok) return parseRss(await res.text(), feed.label);
  } catch (_) {}
  return [];
}

async function fetchNews() {
  const results = await Promise.all((TICKER_CONFIG.feeds || []).map(f => fetchFeed(f)));
  let all = results.flat();
  const seen = new Set();
  all = all.filter(h => {
    const key = h.title.slice(0, 48).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  all.sort((a, b) => (b.breaking ? 1 : 0) - (a.breaking ? 1 : 0));
  if (all.length === 0) {
    return (TICKER_CONFIG.fallbackHeadlines || []).map(h => ({
      ...h,
      link: '',
      desc: '',
      breaking: h.breaking || isBreaking(h.title)
    }));
  }
  return all.slice(0, TICKER_CONFIG.maxHeadlines || 12);
}

function buildNewsHtml(headlines) {
  return headlines.map((h, i) => `
    <span class="news-item${h.breaking ? ' breaking' : ''}"
          role="button" tabindex="0"
          data-kind="news" data-idx="${i}">
      <span class="tag">${h.breaking ? 'Breaking' : (h.source || 'News')}</span>
      <span class="headline">${escapeHtml(h.title)}</span>
    </span>
  `).join('<span class="sep">·</span>');
}

function buildPriceHtml(cryptoData, stockData, config) {
  const enabled = (config.items || []).filter(i => i.enabled);
  const parts = [];
  let pi = 0;
  for (const item of enabled) {
    let price = null;
    let change = null;
    if (item.type === 'crypto') {
      const d = cryptoData[item.id];
      if (d) { price = d.usd; change = d.usd_24h_change; }
    } else {
      const d = stockData[item.id] || stockData[item.id.replace('^', '')];
      if (d) { price = d.price; change = d.change; }
    }
    if (price == null) continue;
    const chgClass = change == null ? '' : (change >= 0 ? 'up' : 'down');
    const chgText = config.showChange ? formatChange(change) : '';
    parts.push(`
      <span class="price-item" role="button" tabindex="0"
            data-kind="price" data-idx="${pi}"
            data-label="${escapeHtml(item.label)}"
            data-price="${price}"
            data-change="${change != null ? change : ''}"
            data-type="${item.type}">
        <span class="label">${item.label}</span>
        <span class="price">$${formatPrice(price)}</span>
        ${chgText ? `<span class="chg ${chgClass}">${chgText}</span>` : ''}
      </span>
    `);
    pi++;
  }
  return parts.join('<span class="sep">·</span>');
}

export function startTicker() {
  if (!document.getElementById('haylynn-ticker-style')) {
    const style = document.createElement('style');
    style.id = 'haylynn-ticker-style';
    style.textContent = STYLE;
    document.head.appendChild(style);
  }

  let wrap = document.getElementById('haylynn-ticker-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'haylynn-ticker-wrap';
    wrap.innerHTML = `
      <div id="haylynn-ticker-sheet"><div class="sheet-inner"></div></div>
      <div id="haylynn-ticker"><div class="track"></div></div>
    `;
    document.body.appendChild(wrap);
  }

  const bar = document.getElementById('haylynn-ticker');
  const track = bar.querySelector('.track');
  const sheet = document.getElementById('haylynn-ticker-sheet');
  const sheetInner = sheet.querySelector('.sheet-inner');

  let hideTimer = null;
  let idleTimer = null;
  let lastBreaking = false;
  let headlinesCache = [];

  function clearIdle() {
    clearTimeout(idleTimer);
  }

  function scheduleIdleResume() {
    clearIdle();
    idleTimer = setTimeout(() => {
      closeSheet();
      wrap.classList.remove('frozen');
      // allow ambient auto-hide again
      scheduleHide();
    }, IDLE_RESUME_MS);
  }

  function scheduleHide() {
    clearTimeout(hideTimer);
    if (wrap.classList.contains('open') || wrap.classList.contains('frozen')) return;
    const ms = lastBreaking
      ? (TICKER_CONFIG.breakingVisibleMs || TICKER_CONFIG.visibleMs)
      : TICKER_CONFIG.visibleMs;
    hideTimer = setTimeout(() => {
      wrap.classList.remove('visible');
      wrap.classList.remove('active');
    }, ms);
  }

  function show(breaking) {
    lastBreaking = !!breaking;
    wrap.classList.toggle('breaking', lastBreaking);
    wrap.style.setProperty('--ticker-fade', `${TICKER_CONFIG.fadeInMs}ms`);
    wrap.classList.add('visible', 'active');
    if (!wrap.classList.contains('open') && !wrap.classList.contains('frozen')) {
      scheduleHide();
    }
  }

  function openSheet(html) {
    sheetInner.innerHTML = html +
      `<div class="sheet-hint">Tap elsewhere or wait — scroll resumes</div>`;
    wrap.classList.add('open', 'frozen', 'visible', 'active');
    clearTimeout(hideTimer);
    scheduleIdleResume();
  }

  function closeSheet() {
    wrap.classList.remove('open');
    sheetInner.innerHTML = '';
  }

  function openNews(idx) {
    // idx may refer to first copy only; mod by cache length
    const h = headlinesCache[idx % Math.max(headlinesCache.length, 1)];
    if (!h) return;
    const kickerClass = h.breaking ? 'sheet-kicker breaking' : 'sheet-kicker';
    const tag = h.breaking ? 'Breaking' : (h.source || 'News');
    let body = `
      <div class="${kickerClass}">${escapeHtml(tag)}</div>
      <div class="sheet-title">${escapeHtml(h.title)}</div>
      <div class="sheet-meta">${h.desc ? escapeHtml(h.desc) : 'World / economy desk · ambient feed'}</div>
    `;
    if (h.link) {
      body += `<div class="sheet-meta" style="margin-top:0.5rem"><a href="${escapeHtml(h.link)}" target="_blank" rel="noopener" style="color:var(--green,#35c98f)">Open source ↗</a></div>`;
    }
    openSheet(body);
  }

  function openPrice(el) {
    const label = el.dataset.label || '—';
    const price = parseFloat(el.dataset.price);
    const change = el.dataset.change === '' ? null : parseFloat(el.dataset.change);
    const type = el.dataset.type || 'asset';
    const chgClass = change == null ? '' : (change >= 0 ? 'up' : 'down');
    const chgText = change == null ? '' : formatChange(change);
    openSheet(`
      <div class="sheet-kicker">${type === 'crypto' ? 'Crypto' : 'Market'} · live</div>
      <div class="sheet-title">${escapeHtml(label)}</div>
      <div class="sheet-price">$${formatPrice(price)}</div>
      ${chgText ? `<div class="sheet-meta sheet-chg ${chgClass}">24h ${chgText}</div>` : ''}
      <div class="sheet-meta" style="margin-top:0.4rem">Ambient quote · not investment advice</div>
    `);
  }

  // Interaction: freeze + open
  wrap.addEventListener('click', (e) => {
    const news = e.target.closest('.news-item');
    const price = e.target.closest('.price-item');
    if (news) {
      e.preventDefault();
      openNews(Number(news.dataset.idx) || 0);
      return;
    }
    if (price) {
      e.preventDefault();
      openPrice(price);
      return;
    }
    // tap on sheet keeps open; tap on bar chrome freezes without new content
    if (e.target.closest('#haylynn-ticker-sheet')) {
      scheduleIdleResume();
      return;
    }
    if (e.target.closest('#haylynn-ticker')) {
      wrap.classList.add('frozen');
      clearTimeout(hideTimer);
      scheduleIdleResume();
    }
  });

  // Any pointer activity inside wrap resets idle clock
  wrap.addEventListener('pointerdown', () => {
    if (wrap.classList.contains('open') || wrap.classList.contains('frozen')) {
      scheduleIdleResume();
    }
  });

  wrap.addEventListener('pointerenter', () => {
    clearTimeout(hideTimer);
    wrap.classList.add('visible', 'active');
  });
  wrap.addEventListener('pointerleave', () => {
    if (!wrap.classList.contains('open')) {
      scheduleIdleResume();
    }
  });

  async function updateNews() {
    try {
      headlinesCache = await fetchNews();
      const hasBreaking = headlinesCache.some(h => h.breaking);
      const html = buildNewsHtml(headlinesCache);
      wrap._newsHtml = html;
      // don't stomp open sheet mid-read
      if (!wrap.classList.contains('open')) {
        const pricePart = wrap._priceHtml || '';
        const unit = pricePart
          ? html + '<span class="block-sep">│</span>' + pricePart
          : html;
        track.innerHTML = unit + '<span class="block-sep">✦</span>' + unit;
      }
      show(hasBreaking);
    } catch (err) {
      console.warn('[haylynn-ticker:news]', err.message || err);
      headlinesCache = (TICKER_CONFIG.fallbackHeadlines || []).map(h => ({
        ...h, link: '', desc: '', breaking: h.breaking || isBreaking(h.title)
      }));
      const html = buildNewsHtml(headlinesCache);
      wrap._newsHtml = html;
      if (!wrap.classList.contains('open')) {
        track.innerHTML = html + '<span class="block-sep">✦</span>' + html;
      }
      show(false);
    }
  }

  async function updatePrices() {
    const enabled = (TICKER_CONFIG.items || []).filter(i => i.enabled);
    const cryptoIds = enabled.filter(i => i.type === 'crypto').map(i => i.id);
    const stockIds  = enabled.filter(i => i.type === 'stock').map(i => i.id);
    try {
      const [cryptoData, stockData] = await Promise.all([
        fetchCrypto(cryptoIds),
        fetchStocks(stockIds)
      ]);
      const priceHtml = buildPriceHtml(cryptoData, stockData, TICKER_CONFIG);
      wrap._priceHtml = priceHtml;
      if (wrap.classList.contains('open')) return;
      const newsHtml = wrap._newsHtml || '';
      if (!newsHtml && !priceHtml) return;
      const unit = (newsHtml && priceHtml)
        ? newsHtml + '<span class="block-sep">│</span>' + priceHtml
        : (newsHtml || priceHtml);
      track.innerHTML = unit + '<span class="block-sep">✦</span>' + unit;
      if (!wrap.classList.contains('visible')) {
        show(/breaking/.test(newsHtml));
      }
    } catch (err) {
      console.warn('[haylynn-ticker:prices]', err.message || err);
    }
  }

  updateNews().then(() => updatePrices());
  setInterval(updateNews, TICKER_CONFIG.refreshMs);
  setInterval(updatePrices, TICKER_CONFIG.priceRefreshMs || TICKER_CONFIG.refreshMs);
}
