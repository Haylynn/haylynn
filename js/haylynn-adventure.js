/**
 * Cosmic Decay — membership passport for the hybrid text-adventure RPG.
 * Play happens at the campaign shell; this site holds account-bound progress
 * when auth is live (node, domain, flags, score, unlocks).
 *
 * Game: https://haylynn-s-world.vercel.app/
 */
import { authReady, supabase, getCurrentUser } from './haylynn-auth.js';

export const COSMIC_DECAY_URL = 'https://haylynn-s-world.vercel.app/';

const DEFAULT = {
  node_id: 'hub',
  domain_id: null,
  campaign_id: null,
  flags: {},
  unlocked: [],
  path_score: 0,
  character_name: null,
};

/**
 * Lightweight hub on the main site — not a replacement for the full RPG.
 * Real Domains (Plaza, Garden, Wreck, Archive, Spire Node, …) live in the game.
 */
export const ADVENTURE_NODES = {
  hub: {
    id: 'hub',
    title: 'Cosmic Decay',
    body: 'A hybrid text-adventure RPG on a dying Earth. The shell is empty until you choose a Domain. Campaigns slot in as they are written — progress under your name waits here when you are signed in.',
    choices: [
      { id: 'open_game', label: 'Enter Cosmic Decay', href: COSMIC_DECAY_URL },
      { id: 'domain_ruins', label: 'About Domain Ruins (test)', next: 'domain_ruins' },
    ],
  },
  domain_ruins: {
    id: 'domain_ruins',
    title: 'Domain Ruins',
    body: 'Test campaign: explore a collapsed Hardened Domain — Plaza, Garden, Wreck (Prime), Archive, Spire Node. Full play is in the Cosmic Decay shell; this house only keeps your passport.',
    choices: [
      { id: 'play_ruins', label: 'Play Domain Ruins', href: COSMIC_DECAY_URL },
      { id: 'back_hub', label: 'Back', next: 'hub' },
    ],
  },
};

// Back-compat for members UI imports
export { ADVENTURE_NODES as ADVENTURE_NODES_MAP };

export async function loadAdventureProgress() {
  if (!authReady || !supabase) {
    return { ...DEFAULT, guest: true };
  }
  const user = await getCurrentUser();
  if (!user) return { ...DEFAULT, guest: true };

  const { data, error } = await supabase
    .from('adventure_progress')
    .select('node_id, flags, unlocked, path_score, updated_at')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !data) {
    await supabase.from('adventure_progress').upsert(
      { user_id: user.id, node_id: 'hub', flags: {}, unlocked: [], path_score: 0 },
      { onConflict: 'user_id' },
    );
    return { ...DEFAULT, guest: false };
  }

  // Prefer hub if old placeholder nodes linger
  let node_id = data.node_id || 'hub';
  if (!ADVENTURE_NODES[node_id]) node_id = 'hub';

  return {
    node_id,
    domain_id: data.flags?.domain_id || null,
    campaign_id: data.flags?.campaign_id || null,
    flags: data.flags || {},
    unlocked: data.unlocked || [],
    path_score: data.path_score || 0,
    character_name: data.flags?.character_name || null,
    guest: false,
    updated_at: data.updated_at,
  };
}

export async function saveAdventureProgress(patch) {
  if (!authReady || !supabase) return { ok: false, reason: 'auth' };
  const user = await getCurrentUser();
  if (!user) return { ok: false, reason: 'auth' };

  const current = await loadAdventureProgress();
  if (current.guest) return { ok: false, reason: 'auth' };

  const flags = { ...(current.flags || {}), ...(patch.flags || {}) };
  if (patch.domain_id != null) flags.domain_id = patch.domain_id;
  if (patch.campaign_id != null) flags.campaign_id = patch.campaign_id;
  if (patch.character_name != null) flags.character_name = patch.character_name;

  const next = {
    user_id: user.id,
    node_id: patch.node_id ?? current.node_id,
    flags,
    unlocked: patch.unlocked ?? current.unlocked,
    path_score: Math.max(0, patch.path_score ?? current.path_score),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from('adventure_progress')
    .upsert(next, { onConflict: 'user_id' });

  if (error) return { ok: false, reason: error.message };
  return { ok: true, progress: { ...next, guest: false } };
}

export async function chooseAdventure(choiceId) {
  const progress = await loadAdventureProgress();
  const node = ADVENTURE_NODES[progress.node_id] || ADVENTURE_NODES.hub;
  const choice = (node.choices || []).find((c) => c.id === choiceId);
  if (!choice) return { ok: false, reason: 'unknown_choice' };

  if (choice.href) {
    return { ok: true, external: choice.href, progress };
  }

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
  return { ok: true, guest: false, progress: { ...saved.progress, guest: false } };
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
.hy-adventure .adv-choices button,
.hy-adventure .adv-choices a.adv-link {
  font-family: 'Cormorant Garamond', serif; font-size: 0.95rem;
  text-align: left; padding: 0.55rem 0.75rem; border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.12); background: rgba(0,0,0,0.25);
  color: var(--ink); cursor: pointer; text-decoration: none; display: block;
}
.hy-adventure .adv-choices button:hover,
.hy-adventure .adv-choices a.adv-link:hover {
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
    const node = ADVENTURE_NODES[progress.node_id] || ADVENTURE_NODES.hub;
    root.innerHTML = '';
    const box = document.createElement('div');
    box.className = 'hy-adventure';

    const kicker = document.createElement('div');
    kicker.className = 'adv-kicker';
    kicker.textContent = progress.guest
      ? 'Cosmic Decay · passport unlinked'
      : 'Cosmic Decay · passport under your name';

    const title = document.createElement('div');
    title.className = 'adv-title';
    title.textContent = node.title;

    const body = document.createElement('div');
    body.className = 'adv-body';
    body.textContent = node.body;

    const choices = document.createElement('div');
    choices.className = 'adv-choices';
    for (const c of node.choices || []) {
      if (c.href) {
        const a = document.createElement('a');
        a.className = 'adv-link';
        a.href = c.href;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = c.label;
        choices.appendChild(a);
      } else {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = c.label;
        btn.addEventListener('click', async () => {
          const res = await chooseAdventure(c.id);
          if (!res.ok && res.reason === 'auth_required') {
            body.textContent =
              'Sign in at Threshold to keep Cosmic Decay progress under your name. You can still play the game as a guest.';
            return;
          }
          if (res.external) {
            window.open(res.external, '_blank', 'noopener,noreferrer');
            return;
          }
          if (res.ok) await render(res.progress);
        });
        choices.appendChild(btn);
      }
    }

    const meta = document.createElement('div');
    meta.className = 'adv-meta';
    const bits = [];
    if (progress.character_name) bits.push(progress.character_name);
    if (progress.domain_id) bits.push('Domain ' + progress.domain_id);
    bits.push(progress.guest ? 'Guest · not saved here' : 'Score ' + (progress.path_score || 0));
    meta.textContent = bits.join(' · ');

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
