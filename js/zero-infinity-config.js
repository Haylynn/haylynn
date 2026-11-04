/**
 * Zero Infinity (0∞) — house token.
 *
 * WEB3 RAIL (primary for this module):
 *   Fixed BTC peg — fiat price of BTC can move; 0∞ per BTC does not.
 *   Example: 0.01 BTC always yields the same 0∞.
 *
 * FIAT RAIL (later, Stripe):
 *   Separate entry for non–Web3 users. Does not change the BTC peg.
 *   Implement as its own SKUs / checkout; may credit the same 0∞ balance.
 *
 * mode: 'simulation' | 'chain'
 */
export const ZERO_INFINITY = {
  name: 'Zero Infinity',
  symbol: '0∞',
  mode: 'simulation',

  /**
   * Fixed peg: how many 0∞ one full BTC is worth.
   * 0.01 BTC → rateZeroPerBtc * 0.01  (always, independent of USD/GBP).
   */
  rateZeroPerBtc: 100_000,

  /** Convenience: 0∞ received for exactly 0.01 BTC */
  get zeroPerOneHundredthBtc() {
    return this.rateZeroPerBtc * 0.01; // 1000 at default rate
  },

  simStartingBtc: 0.05,
  simStartingZero: 0,
  minBtcBuy: 0.0001,

  /**
   * Spend 0∞ → Path soft currencies (fair micro rates).
   * Cores are the Path spend unit; shards convert 5→1 core on the Path.
   */
  shop: {
    /** 0∞ cost → grant */
    coreCostZero: 8, // 1 core = 8 0∞
    shardCostZero: 2, // 1 shard = 2 0∞
    skus: [
      { id: 'cores-5', label: '5 cores', zeroCost: 40, cores: 5, shards: 0 },
      { id: 'cores-15', label: '15 cores', zeroCost: 100, cores: 15, shards: 0 },
      { id: 'shards-100', label: '100 shards', zeroCost: 150, cores: 0, shards: 100 },
      { id: 'bundle-path', label: '10 cores + 50 shards', zeroCost: 120, cores: 10, shards: 50 },
    ],
  },

  /** Future on-chain — unused while mode === 'simulation' */
  chain: {
    network: null,
    assetId: null,
    rpcUrl: null,
    /** When live: still settle quote as BTC→0∞ at rateZeroPerBtc */
    pegAsset: 'BTC',
  },

  /** Future Stripe — fiat users only; does not redefine the BTC peg */
  fiat: {
    enabled: false,
    provider: 'stripe',
    /** Map Stripe price IDs → 0∞ credit when you go live */
    prices: {
      // small: '',  // price_... → 500 0∞
      // medium: '',
    },
  },
};
