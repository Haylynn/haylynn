/**
 * Account progression — marks + Path (Supabase or local).
 * No Stripe.
 */
import { authReady, supabase, getCurrentUser } from './haylynn-auth.js';
import {
  PATH_NODES,
  PATH_EDGES,
  STARTING_MARKS,
  MARKS_PER_PATH_POINT,
} from './account-progress-config.js';

const LOCAL_KEY = 'haylynn-account-progress-v1';

function emptyState() {
  return { marks: STARTING_MARKS, path_points: 0, unlocked: [], ledger: [] };
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
      } catch { /* fall through */ }
    }
  }
  if (!allowLocal) return emptyState();
  return { ...loadLocalProgress(), source: 'local' };
}

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
  local.ledger = [{ delta: n, reason, created_at: new Date().toISOString() }, ...(local.ledger || [])].slice(0, 40);
  saveLocalProgress(local);
  return { ...local, source: 'local' };
}

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
  saveLocalProgress(local);
  return { ...local, source: 'local' };
}

function canReach(nodeId, unlocked) {
  const u = new Set(unlocked || []);
  if (nodeId === 'start-known' || PATH_NODES.find((n) => n.id === nodeId)?.kind === 'start') return true;
  const incoming = PATH_EDGES.filter(([, t]) => t === nodeId).map(([f]) => f);
  if (!incoming.length) return true; // isolated allowed
  return incoming.some((f) => u.has(f));
}

export async function unlockPathNode(nodeId) {
  const node = PATH_NODES.find((n) => n.id === nodeId);
  if (!node) return { ok: false, error: 'Unknown fragment' };

  const prog = await getAccountProgress();
  if (prog.unlocked?.includes(nodeId)) return { ok: true, progress: prog, already: true };

  if (!canReach(nodeId, prog.unlocked)) {
    return { ok: false, error: 'Open a connected fragment first — walk the Path.' };
  }

  const cost = Math.max(0, node.cost ?? 0);
  let nextPoints = prog.path_points || 0;
  let nextMarks = prog.marks || 0;
  const rate = MARKS_PER_PATH_POINT || 5;

  if (cost > 0) {
    if (nextPoints >= cost) {
      nextPoints -= cost;
    } else {
      const needPts = cost - nextPoints;
      const markCost = needPts * rate;
      if (nextMarks < markCost) {
        return {
          ok: false,
          error: `Need ${cost} core(s) (you hold ${nextPoints}) or ${markCost} shards for the gap (you hold ${nextMarks}).`,
        };
      }
      nextMarks -= markCost;
      nextPoints = 0;
    }
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

export function listPathNodes() {
  return PATH_NODES.slice();
}

export function listPathEdges() {
  return PATH_EDGES.slice();
}

export { PATH_NODES, PATH_EDGES, STARTING_MARKS, MARKS_PER_PATH_POINT };
