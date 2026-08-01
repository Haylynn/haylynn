/**
 * Haylynn ambient bar — NEWS primary, prices secondary
 *
 * Core focus: world / economy headlines scrolling quietly at the bottom.
 * Breaking items override into a stronger state.
 * Prices (crypto + whatever stocks resolve) trail as soft context.
 */

export const TICKER_CONFIG = {
  // ── Behaviour ──────────────────────────────────────────
  mode: 'news',              // 'news' | 'prices' | 'both'
  refreshMs: 5 * 60 * 1000,  // news refresh every 5 min
  priceRefreshMs: 60 * 1000, // prices less often is fine
  visibleMs: 3 * 60 * 1000,  // stay up ~3 min after update
  fadeInMs: 800,
  fadeOutMs: 1400,
  showChange: true,
  currency: 'usd',

  // ── Breaking override ──────────────────────────────────
  // If a headline matches these (case-insensitive), bar enters breaking state
  breakingKeywords: [
    'federal reserve', 'interest rate', 'rate hike', 'rate cut',
    'recession', 'crash', 'collapse', 'bailout', 'default',
    'emergency', 'black monday', 'circuit breaker',
    'oil shock', 'bank failure', 'bank run',
    'tariff', 'sanctions', 'war', 'invasion',
    'imf ', 'world bank', 'debt ceiling',
    'all-time high', 'record low', 'halted trading'
  ],
  breakingVisibleMs: 4 * 60 * 1000, // stay longer when breaking
  maxHeadlines: 12,

  // ── News feeds (RSS). Fetched via public CORS relay when needed. ──
  feeds: [
    { id: 'bbc-business', url: 'https://feeds.bbci.co.uk/news/business/rss.xml', label: 'BBC' },
    { id: 'bbc-world',    url: 'https://feeds.bbci.co.uk/news/world/rss.xml',    label: 'BBC' },
    { id: 'cnbc',         url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664', label: 'CNBC' },
  ],

  // Fallback headlines so the bar always has something to show offline / CORS-blocked
  fallbackHeadlines: [
    { title: 'Markets wait on policy signals as global growth stays uneven', source: 'Wire', breaking: false },
    { title: 'Energy and shipping routes remain in focus for trade desks', source: 'Wire', breaking: false },
    { title: 'Major indexes mixed as investors weigh rates and earnings', source: 'Wire', breaking: false },
    { title: 'Crypto liquidity tracks wider risk appetite across sessions', source: 'Wire', breaking: false },
  ],

  // ── Price symbols (secondary) ──────────────────────────
  items: [
    { id: 'bitcoin',  label: 'BTC',    type: 'crypto', enabled: true  },
    { id: 'ethereum', label: 'ETH',    type: 'crypto', enabled: true  },
    { id: 'solana',   label: 'SOL',    type: 'crypto', enabled: false },
    { id: 'SPY',      label: 'S&P500', type: 'stock',  enabled: true  },
    { id: '^FTSE',    label: 'FTSE100',type: 'stock',  enabled: true  },
    { id: 'TSLA',     label: 'TSLA',   type: 'stock',  enabled: true  },
    { id: 'AAPL',     label: 'AAPL',   type: 'stock',  enabled: false },
    { id: 'MSFT',     label: 'MSFT',   type: 'stock',  enabled: false },
    { id: 'NVDA',     label: 'NVDA',   type: 'stock',  enabled: false },
    { id: 'QQQ',      label: 'NASDAQ', type: 'stock',  enabled: false },
  ]
};
