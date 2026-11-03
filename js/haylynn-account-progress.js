/**
 * Account progression — marks + thin Path on the Princess of Reality account.
 * Same user_id as Threshold / Cosmic Decay. No Stripe.
 *
 * - Online: Supabase account_marks + account_path + account_ledger
 * - Offline / preview: localStorage
 */
import { authReady, supabase, getCurrentUser } from './haylynn-auth.js';
import { PATH_NODES, STARTING_MARKS } from './account-progress-config.js';

const LOCAL_KEY = 'haylynn-account-progress-v1';

function emptyState() {
  return {
    marks: STARTING_MARKS,
    path_points: 0,
    unlocked: [],
    ledger: [],
  };
}

export function loadLocalProgress() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return emptyState();
    const p = JSON.parse(raw);
    return {
      marks: Number(p.marks) || 0,
      path_points: Number(p.path_points) || 0,
      unlocked: Array.isArray(p.unlocked) ? p.unlocked : [],
      ledger: Array.isArray(p.ledger) ? p.ledger.slice(0, 40) : [],
    };
  } catch {
    return emptyState();
  }
}

export function saveLocalProgress(state) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

/**
 * Load progress for the current user (or local preview).
 */
export async function getAccountProgress({ allowLocal = true } = {}) {
  if (authReady && supabase) {
    const user = await getCurrentUser();
    if (user) {
      try {
        const { data: marksRow } = await supabase
          .from('account_marks')
          .select('balance')
          .eq('user_id', user.id)
          .maybeSingle();
        const { data: pathRow } = await supabase
          .from('account_path')
          .select('path_points, unlocked')
          .eq('user_id', user.id)
          .maybeSingle();
        const { data: ledger } = await supabase
          .from('account_ledger')
          .select('delta, reason, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);
        return {
          marks: marksRow?.balance ?? STARTING_MARKS,
          path_points: pathRow?.path_points ?? 0,
          unlocked: Array.isArray(pathRow?.unlocked) ? pathRow.unlocked : [],
          ledger: ledger || [],
          source: 'supabase',
        };
      } catch {
        /* fall through */
      }
    }
  }
  if (!allowLocal) return emptyState();
  return { ...loadLocalProgress(), source: 'local' };
}

/**
 * Award marks (e.g. after a Decay session or manual grant).
 * reason: short string for the ledger.
 */
export async function awardMarks(amount, reason = 'grant') {
  const n = Math.floor(Number(amount) || 0);
  if (!n) return getAccountProgress();

  if (authReady && supabase) {
    const user = await getCurrentUser();
    if (user) {
      const cur = await getAccountProgress({ allowLocal: false });
      const next = (cur.marks || 0) + n;
      await supabase.from('account_marks').upsert(
        { user_id: user.id, balance: next, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' },
      );
      await supabase.from('account_ledger').insert({
        user_id: user.id,
        delta: n,
        reason: String(reason).slice(0, 120),
      });
      return getAccountProgress();
    }
  }

  const local = loadLocalProgress();
  local.marks = (local.marks || 0) + n;
  local.ledger = [
    { delta: n, reason, created_at: new Date().toISOString() },
    ...(local.ledger || []),
  ].slice(0, 40);
  saveLocalProgress(local);
  return { ...local, source: 'local' };
}

/**
 * Spend path_points (or marks) to unlock a Path node.
 */
export async function unlockPathNode(nodeId) {
  const node = PATH_NODES.find((n) => n.id === nodeId);
  if (!node) return { ok: false, error: 'Unknown node' };

  const prog = await getAccountProgress();
  if (prog.unlocked?.includes(nodeId)) return { ok: true, progress: prog, already: true };

  const cost = node.cost ?? 1;
  const points = prog.path_points || 0;
  if (points < cost) {
    // allow spending marks as path points at 10:1 if short
    const need = cost - points;
    const markCost = need * 10;
    if ((prog.marks || 0) < markCost) {
      return { ok: false, error: 'Not enough path points or marks' };
    }
  }

  let nextPoints = prog.path_points || 0;
  let nextMarks = prog.marks || 0;
  if (nextPoints >= cost) {
    nextPoints -= cost;
  } else {
    const need = cost - nextPoints;
    nextPoints = 0;
    nextMarks -= need * 10;
  }
  const unlocked = [...(prog.unlocked || []), nodeId];

  if (authReady && supabase) {
    const user = await getCurrentUser();
    if (user) {
      await supabase.from('account_path').upsert(
        {
          user_id: user.id,
          path_points: nextPoints,
          unlocked,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' },
      );
      await supabase.from('account_marks').upsert(
        { user_id: user.id, balance: nextMarks, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' },
      );
      await supabase.from('account_ledger').insert({
        user_id: user.id,
        delta: nextMarks - (prog.marks || 0),
        reason: `path:${nodeId}`,
      });
      return { ok: true, progress: await getAccountProgress() };
    }
  }

  const local = {
    marks: nextMarks,
    path_points: nextPoints,
    unlocked,
    ledger: [
      { delta: nextMarks - (prog.marks || 0), reason: `path:${nodeId}`, created_at: new Date().toISOString() },
      ...(prog.ledger || []),
    ].slice(0, 40),
  };
  saveLocalProgress(local);
  return { ok: true, progress: { ...local, source: 'local' } };
}

/** Grant path points (from play milestones). */
export async function awardPathPoints(amount, reason = 'play') {
  const n = Math.floor(Number(amount) || 0);
  if (!n) return getAccountProgress();

  if (authReady && supabase) {
    const user = await getCurrentUser();
    if (user) {
      const cur = await getAccountProgress({ allowLocal: false });
      const next = (cur.path_points || 0) + n;
      await supabase.from('account_path').upsert(
        {
          user_id: user.id,
          path_points: next,
          unlocked: cur.unlocked || [],
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' },
      );
      return getAccountProgress();
    }
  }

  const local = loadLocalProgress();
  local.path_points = (local.path_points || 0) + n;
  local.ledger = [
    { delta: 0, reason: `path_points:+${n}:${reason}`, created_at: new Date().toISOString() },
    ...(local.ledger || []),
  ].slice(0, 40);
  saveLocalProgress(local);
  return { ...local, source: 'local' };
}

export function listPathNodes() {
  return PATH_NODES.slice();
}

export { PATH_NODES, STARTING_MARKS };
