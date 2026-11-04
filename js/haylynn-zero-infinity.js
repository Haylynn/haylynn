/**
 * Zero Infinity (0∞) ledger — simulation now, chain-shaped for later.
 * Balances: simulated BTC (buy currency) + 0∞ (house token).
 */
import { ZERO_INFINITY } from './zero-infinity-config.js';
import { authReady, supabase, getCurrentUser } from './haylynn-auth.js';

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

/**
 * Public read — simulation uses local or Supabase zero_infinity_balances when present.
 */
export async function getZeroInfinityLedger() {
  if (ZERO_INFINITY.mode === 'chain') {
    // Future: read on-chain balances via chain adapter
    return getChainLedgerPlaceholder();
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
          const local = loadLocal();
          return {
            btc: Number(data.btc_sim) || 0,
            zero: Number(data.zero_balance) || 0,
            txs: local.txs || [],
            mode: 'simulation',
            source: 'supabase',
          };
        }
      } catch {
        /* table may not exist yet */
      }
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
      } catch {
        /* optional tables */
      }
    }
  }
  return getZeroInfinityLedger();
}

/**
 * Buy 0∞ with simulated BTC.
 * @param {number} btcAmount — BTC to spend (simulation)
 */
export async function buyZeroInfinityWithBtc(btcAmount) {
  const btcIn = Number(btcAmount);
  if (!Number.isFinite(btcIn) || btcIn <= 0) {
    return { ok: false, error: 'Enter a BTC amount greater than zero.' };
  }
  if (btcIn < ZERO_INFINITY.minBtcBuy) {
    return {
      ok: false,
      error: `Minimum buy is ${ZERO_INFINITY.minBtcBuy} BTC (simulation).`,
    };
  }

  if (ZERO_INFINITY.mode === 'chain') {
    return {
      ok: false,
      error: 'On-chain buys are not connected yet. Mode is still simulation.',
    };
  }

  const led = await getZeroInfinityLedger();
  if (btcIn > led.btc) {
    return {
      ok: false,
      error: `Not enough simulated BTC (you hold ${led.btc}).`,
    };
  }

  const zeroOut = btcIn * ZERO_INFINITY.rateZeroPerBtc;
  const nextBtc = led.btc - btcIn;
  const nextZero = led.zero + zeroOut;
  const tx = {
    kind: 'buy_zero_with_btc',
    btc_delta: -btcIn,
    zero_delta: zeroOut,
    note: `simulation buy @ ${ZERO_INFINITY.rateZeroPerBtc} 0∞ per BTC`,
    at: new Date().toISOString(),
  };

  const next = await persistBalances(nextBtc, nextZero, tx);
  return { ok: true, ledger: next, received: zeroOut };
}

/** Test faucet — top up simulated BTC (not real). */
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

/** Format helpers */
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
  };
}

/** Future adapter stub — real wallet connect plugs here */
export async function connectChainWallet() {
  return {
    ok: false,
    error: 'Chain mode is not live. Zero Infinity is running in simulation.',
  };
}

function getChainLedgerPlaceholder() {
  return {
    btc: 0,
    zero: 0,
    txs: [],
    mode: 'chain',
    source: 'chain',
  };
}

export { ZERO_INFINITY };
