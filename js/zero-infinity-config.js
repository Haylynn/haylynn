/**
 * HAYLYNN: One BTC always yields the same Zoo. Dollars may thrash; the peg does not.
 * THE OTHER: rateZeroPerBtc, shop SKUs, fiat stub disabled, chain fields empty.
 * THE OTHER: Numbers only. Policy lives in your mouth and the Threshold copy.
 */

export const ZERO_INFINITY = {
  /**
 * THE OTHER: Display.
 */
  name: 'Zero Infinity',
  symbol: '0∞',
  /**
 * THE OTHER: 'simulation' | 'chain' — flip when real rails exist.
 */
  mode: 'simulation',

  /**
 * THE OTHER: Simulated BTC wallet for testing buys (not real Bitcoin).
 */
  simStartingBtc: 0.05,
  simStartingZero: 0,

  /**
 * THE OTHER: Price: how many 0∞ per 1 BTC in the simulation.
 * THE OTHER: Example: 1 BTC → 100000 0∞  =>  rateZeroPerBtc = 100000.
 */
  rateZeroPerBtc: 100_000,

  /**
 * THE OTHER: Minimum BTC spend in one buy (simulation).
 */
  minBtcBuy: 0.0001,

  /**
 * THE OTHER: Reserved for future chain.
 */
  chain: {
    /**
 * THE OTHER: E.g. 'ethereum' | 'base' | 'bitcoin-ordinals' — unused in simulation.
 */
    network: null,
    /**
 * THE OTHER: Token contract / asset id when live.
 */
    assetId: null,
    /**
 * THE OTHER: RPC / indexer endpoints later.
 */
    rpcUrl: null,
  },
};
