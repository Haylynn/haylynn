/**
 * Adventure progress — account-bound path through the house.
 * Requires auth. Guest progress stays in memory only (not written).
 */
import { authReady, supabase, getCurrentUser } from './haylynn-auth.js';

const DEFAULT = {
  node_id: 'start',
  flags: {},
  unlocked: [],
  path_score: 0,
};

/** Starter graph — expand nodes without changing the data model. */
export const ADVENTURE_NODES = {
  start: {
    id: 'start',
    title: 'Cosmic Decay · edge',
    body: 'Cosmic Decay begins at the edge of the house. The scroll is open to anyone. Threshold and the longer paths wait for those who leave a name.',
    choices: [
      { id: 'enter_threshold', label: 'Step toward Threshold', next: 'threshold_gate' },
      { id: 'walk_free', label: 'Walk the free rooms only', next: 'free_walk' },
    ],
  },
  free_walk: {
    id: 'free_walk',
    title: 'Open halls',
    body: 'World, language, story, and voice remain open. Return here when you wish to leave a mark.',
    choices: [
      { id: 'back', label: 'Return to the edge', next: 'start' },
    ],
  },
  threshold_gate: {
    id: 'threshold_gate',
    title: 'Threshold',
    body: 'A quieter door. Sign in to keep your place in this path. Patronage, when you choose it, deepens what opens later — it is never required to walk the public rooms.',
    choices: [
      { id: 'continue_signed', label: 'I have crossed (signed in)', next: 'path_open', requireAuth: true },
      { id: 'back', label: 'Not yet', next: 'start' },
    ],
  },
  path_open: {
    id: 'path_open',
    title: 'A place kept',
    body: 'Your account holds this step. From here the path can branch — trials, patronage doors, and later, longer adventures. The house remembers only what you allow it to keep under your name.',
    choices: [
      { id: 'to_patron_note', label: 'Ask about patronage', next: 'patron_note' },
      { id: 'to_start', label: 'Return to the edge', next: 'start' },
    ],
  },
  patron_note: {
    id: 'patron_note',
    title: 'Patronage',
    body: 'Supporter and Patron are subscriptions managed outside this tale. They unlock quieter perks in Threshold — not a higher moral rank. The public house stays open either way.',
    choices: [
      { id: 'back_path', label: 'Back', next: 'path_open' },
    ],
  },
};

export async function loadAdventureProgress() {
  if (!authReady || !supabase) return { ...DEFAULT, guest: true };
  const user = await getCurrentUser();
  if (!user) return { ...DEFAULT, guest: true };

  const { data, error } = await supabase
    .from('adventure_progress')
    .select('node_id, flags, unlocked, path_score, updated_at')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !data) {
    // Ensure row exists
    await supabase.from('adventure_progress').upsert(
      { user_id: user.id, node_id: 'start', flags: {}, unlocked: [], path_score: 0 },
      { onConflict: 'user_id' },
    );
    return { ...DEFAULT, guest: false };
  }
  return {
    node_id: data.node_id || 'start',
    flags: data.flags || {},
    unlocked: data.unlocked || [],
    path_score: data.path_score || 0,
    guest: false,
  };
}

export async function saveAdventureProgress(patch) {
  if (!authReady || !supabase) return { ok: false, reason: 'auth' };
  const user = await getCurrentUser();
  if (!user) return { ok: false, reason: 'auth' };

  const current = await loadAdventureProgress();
  if (current.guest) return { ok: false, reason: 'auth' };

  const next = {
    user_id: user.id,
    node_id: patch.node_id ?? current.node_id,
    flags: patch.flags ?? current.flags,
    unlocked: patch.unlocked ?? current.unlocked,
    path_score: Math.max(0, patch.path_score ?? current.path_score),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('adventure_progress')
    .upsert(next, { onConflict: 'user_id' });

  if (error) return { ok: false, reason: error.message };
  return { ok: true, progress: next };
}

export async function chooseAdventure(choiceId) {
  const progress = await loadAdventureProgress();
  const node = ADVENTURE_NODES[progress.node_id] || ADVENTURE_NODES.start;
  const choice = (node.choices || []).find((c) => c.id === choiceId);
  if (!choice) return { ok: false, reason: 'unknown_choice' };

  if (choice.requireAuth && progress.guest) {
    return { ok: false, reason: 'auth_required' };
  }

  const nextId = choice.next;
  if (!ADVENTURE_NODES[nextId]) return { ok: false, reason: 'bad_node' };

  const flags = { ...(progress.flags || {}), ['chose_' + choiceId]: true };
  const path_score = (progress.path_score || 0) + 1;

  if (progress.guest) {
    return {
      ok: true,
      guest: true,
      progress: { ...progress, node_id: nextId, flags, path_score },
    };
  }

  const saved = await saveAdventureProgress({ node_id: nextId, flags, path_score });
  if (!saved.ok) return saved;
  return { ok: true, guest: false, progress: saved.progress };
}

const ADV_STYLE = `
.hy-adventure {
  margin-top: 1rem; padding: 1rem 1.1rem 1.15rem;
  border-radius: 14px; border: 1px solid rgba(53,201,143,0.28);
  background: rgba(53,201,143,0.05); text-align: left;
}
.hy-adventure .adv-kicker {
  font-family: 'Space Mono', monospace; font-size: 0.48rem;
  letter-spacing: 0.14em; text-transform: uppercase; color: var(--green, #35c98f);
  margin-bottom: 0.4rem;
}
.hy-adventure .adv-title {
  font-style: italic; font-size: 1.15rem; color: var(--ink); margin-bottom: 0.4rem;
}
.hy-adventure .adv-body {
  font-size: 0.92rem; color: var(--ink-dim); line-height: 1.5; margin-bottom: 0.85rem;
}
.hy-adventure .adv-choices { display: flex; flex-direction: column; gap: 0.45rem; }
.hy-adventure .adv-choices button {
  font-family: 'Cormorant Garamond', serif; font-size: 0.95rem;
  text-align: left; padding: 0.55rem 0.75rem; border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.12); background: rgba(0,0,0,0.25);
  color: var(--ink); cursor: pointer;
}
.hy-adventure .adv-choices button:hover {
  border-color: rgba(53,201,143,0.45);
}
.hy-adventure .adv-meta {
  margin-top: 0.75rem; font-family: 'Space Mono', monospace;
  font-size: 0.45rem; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--ink-dim);
}
`;

function injectAdvStyle() {
  if (document.getElementById('hy-adventure-style')) return;
  const s = document.createElement('style');
  s.id = 'hy-adventure-style';
  s.textContent = ADV_STYLE;
  document.head.appendChild(s);
}

export async function mountAdventure(root) {
  if (!root || root.dataset.advMounted) return;
  root.dataset.advMounted = '1';
  injectAdvStyle();

  const render = async (overrideProgress) => {
    const progress = overrideProgress || (await loadAdventureProgress());
    const node = ADVENTURE_NODES[progress.node_id] || ADVENTURE_NODES.start;
    root.innerHTML = '';
    const box = document.createElement('div');
    box.className = 'hy-adventure';
    const kicker = document.createElement('div');
    kicker.className = 'adv-kicker';
    kicker.textContent = progress.guest ? 'Path · unrecorded' : 'Path · held under your name';
    const title = document.createElement('div');
    title.className = 'adv-title';
    title.textContent = node.title;
    const body = document.createElement('div');
    body.className = 'adv-body';
    body.textContent = node.body;
    const choices = document.createElement('div');
    choices.className = 'adv-choices';
    for (const c of node.choices || []) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = c.label;
      btn.addEventListener('click', async () => {
        const res = await chooseAdventure(c.id);
        if (!res.ok && res.reason === 'auth_required') {
          body.textContent = 'Sign in at Threshold to keep this step under your name. The public rooms stay open either way.';
          return;
        }
        if (res.ok) await render(res.progress);
      });
      choices.appendChild(btn);
    }
    const meta = document.createElement('div');
    meta.className = 'adv-meta';
    meta.textContent = progress.guest
      ? 'Guest steps are not saved'
      : `Score ${progress.path_score || 0}`;
    box.append(kicker, title, body, choices, meta);
    root.appendChild(box);
  };

  await render();
}

export function initHaylynnAdventure() {
  document.querySelectorAll('[data-role="adventure-root"]').forEach((el) => {
    mountAdventure(el);
  });
}
