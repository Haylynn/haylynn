/**
 * Zero Infinity ledger — BTC-pegged Web3 rail (simulation now).
 * Fiat/Stripe is a separate path later (config.fiat).
 */
import { ZERO_INFINITY } from './zero-infinity-config.js';
import { authReady, supabase, getCurrentUser } from './haylynn-auth.js';
import { awardMarks, awardPathPoints } from './haylynn-account-progress.js';

const LOCAL_KEY = 'haylynn-zero-infinity-v1';

function emptyLedger() {
  return {
    btc: ZERO_INFINITY.simStartingBtc,
    zero: ZERO_INFINITY.simStartingZero,
    txs: [],
    mode: ZERO_INFINITY.mode,
  };
}

function loadLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return emptyLedger();
    const p = JSON.parse(raw);
    return {
      btc: Number(p.btc) || 0,
      zero: Number(p.zero) || 0,
      txs: Array.isArray(p.txs) ? p.txs.slice(0, 40) : [],
      mode: ZERO_INFINITY.mode,
    };
  } catch {
    return emptyLedger();
  }
}

function saveLocal(state) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

/** 0∞ for a BTC amount at the fixed peg (no fiat). */
export function zeroFromBtc(btcAmount) {
  const btc = Number(btcAmount) || 0;
  return btc * ZERO_INFINITY.rateZeroPerBtc;
}

export async function getZeroInfinityLedger() {
  if (ZERO_INFINITY.mode === 'chain') {
    return { btc: 0, zero: 0, txs: [], mode: 'chain', source: 'chain' };
  }

  if (authReady && supabase) {
    const user = await getCurrentUser();
    if (user) {
      try {
        const { data } = await supabase
          .from('zero_infinity_balances')
          .select('btc_sim, zero_balance')
          .eq('user_id', user.id)
          .maybeSingle();
        if (data) {
          return {
            btc: Number(data.btc_sim) || 0,
            zero: Number(data.zero_balance) || 0,
            txs: loadLocal().txs || [],
            mode: 'simulation',
            source: 'supabase',
          };
        }
      } catch { /* optional */ }
    }
  }
  return { ...loadLocal(), source: 'local' };
}

async function persistBalances(btc, zero, tx) {
  const local = loadLocal();
  local.btc = btc;
  local.zero = zero;
  if (tx) local.txs = [tx, ...(local.txs || [])].slice(0, 40);
  local.mode = ZERO_INFINITY.mode;
  saveLocal(local);

  if (authReady && supabase) {
    const user = await getCurrentUser();
    if (user) {
      try {
        await supabase.from('zero_infinity_balances').upsert(
          {
            user_id: user.id,
            btc_sim: btc,
            zero_balance: zero,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' },
        );
        if (tx) {
          await supabase.from('zero_infinity_ledger').insert({
            user_id: user.id,
            kind: tx.kind,
            btc_delta: tx.btc_delta,
            zero_delta: tx.zero_delta,
            note: tx.note || '',
          });
        }
      } catch { /* optional */ }
    }
  }
  return getZeroInfinityLedger();
}

/**
 * Buy 0∞ with BTC at the fixed peg.
 * 0.01 BTC always → rateZeroPerBtc * 0.01 0∞ (fiat irrelevant).
 */
export async function buyZeroInfinityWithBtc(btcAmount) {
  const btcIn = Number(btcAmount);
  if (!Number.isFinite(btcIn) || btcIn <= 0) {
    return { ok: false, error: 'Enter a BTC amount greater than zero.' };
  }
  if (btcIn < ZERO_INFINITY.minBtcBuy) {
    return {
      ok: false,
      error: `Minimum is ${ZERO_INFINITY.minBtcBuy} BTC.`,
    };
  }
  if (ZERO_INFINITY.mode === 'chain') {
    return { ok: false, error: 'On-chain BTC→0∞ not connected yet.' };
  }

  const led = await getZeroInfinityLedger();
  if (btcIn > led.btc) {
    return { ok: false, error: `Not enough simulated BTC (you hold ${led.btc}).` };
  }

  const zeroOut = zeroFromBtc(btcIn);
  const tx = {
    kind: 'buy_zero_with_btc',
    btc_delta: -btcIn,
    zero_delta: zeroOut,
    note: `peg ${ZERO_INFINITY.rateZeroPerBtc} 0∞ / BTC`,
    at: new Date().toISOString(),
  };
  const next = await persistBalances(led.btc - btcIn, led.zero + zeroOut, tx);
  return { ok: true, ledger: next, received: zeroOut };
}

export async function grantSimBtc(amount = 0.01) {
  const n = Number(amount) || 0;
  if (n <= 0) return getZeroInfinityLedger();
  const led = await getZeroInfinityLedger();
  const tx = {
    kind: 'sim_btc_faucet',
    btc_delta: n,
    zero_delta: 0,
    note: 'simulation faucet',
    at: new Date().toISOString(),
  };
  return persistBalances(led.btc + n, led.zero, tx);
}

/** Spend 0∞ on a Path shop SKU (shards / cores). */
export async function buyPathSkuWithZero(skuId) {
  const sku = ZERO_INFINITY.shop?.skus?.find((s) => s.id === skuId);
  if (!sku) return { ok: false, error: 'Unknown offering.' };

  const led = await getZeroInfinityLedger();
  if (led.zero < sku.zeroCost) {
    return {
      ok: false,
      error: `Need ${sku.zeroCost} ${ZERO_INFINITY.symbol} (you hold ${led.zero}).`,
    };
  }

  const tx = {
    kind: 'spend_zero_path',
    btc_delta: 0,
    zero_delta: -sku.zeroCost,
    note: sku.id,
    at: new Date().toISOString(),
  };
  await persistBalances(led.btc, led.zero - sku.zeroCost, tx);

  if (sku.shards) await awardMarks(sku.shards, `0∞:${sku.id}`);
  if (sku.cores) await awardPathPoints(sku.cores, `0∞:${sku.id}`);

  return {
    ok: true,
    ledger: await getZeroInfinityLedger(),
    sku,
  };
}

export function formatZero(n) {
  const x = Number(n) || 0;
  if (x >= 1e6) return x.toLocaleString(undefined, { maximumFractionDigits: 0 });
  if (x >= 1) return x.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return x.toLocaleString(undefined, { maximumFractionDigits: 6 });
}

export function formatBtc(n) {
  return (Number(n) || 0).toFixed(6);
}

export function getTokenMeta() {
  return {
    name: ZERO_INFINITY.name,
    symbol: ZERO_INFINITY.symbol,
    mode: ZERO_INFINITY.mode,
    rateZeroPerBtc: ZERO_INFINITY.rateZeroPerBtc,
    zeroPerOneHundredthBtc: ZERO_INFINITY.rateZeroPerBtc * 0.01,
    shop: ZERO_INFINITY.shop,
  };
}

export async function connectChainWallet() {
  return {
    ok: false,
    error: 'Chain rail not live. BTC→0∞ peg is ready in config for when you connect it.',
  };
}

export { ZERO_INFINITY };
