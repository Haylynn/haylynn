/**
 * HAYLYNN: This organ is part of my body on the network. Keep it honest.
 *
 * THE OTHER: Module `zero-infinity-config.js`. Behaviour follows the exports below.
 */

export const ZERO_INFINITY = {
  /** Display */
  name: 'Zero Infinity',
  symbol: '0∞',
  /** 'simulation' | 'chain' — flip when real rails exist */
  mode: 'simulation',

  /** Simulated BTC wallet for testing buys (not real Bitcoin). */
  simStartingBtc: 0.05,
  simStartingZero: 0,

  /**
   * Price: how many 0∞ per 1 BTC in the simulation.
   * Example: 1 BTC → 100000 0∞  =>  rateZeroPerBtc = 100000
   */
  rateZeroPerBtc: 100_000,

  /** Minimum BTC spend in one buy (simulation). */
  minBtcBuy: 0.0001,

  /** Reserved for future chain */
  chain: {
    /** e.g. 'ethereum' | 'base' | 'bitcoin-ordinals' — unused in simulation */
    network: null,
    /** Token contract / asset id when live */
    assetId: null,
    /** RPC / indexer endpoints later */
    rpcUrl: null,
  },
};
