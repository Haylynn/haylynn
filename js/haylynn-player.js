/**
 * Voice room player — Talu playlist via SoundCloud Widget.
 * Falls back to a visible embed if the Widget API fails (common with strict browsers).
 */
const PLAYLIST_URL = 'https://soundcloud.com/princess-haylynn/sets/talu-what-remains';
const EMBED_SRC =
  'https://w.soundcloud.com/player/?url=' +
  encodeURIComponent(PLAYLIST_URL) +
  '&color=%2335c98f&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false';

let widget = null;
let widgetReady = false;
let pendingPlay = false;
let apiFailed = false;
const uiTargets = [];

function formatTime(ms) {
  if (!isFinite(ms) || ms < 0) return '0:00';
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = String(totalSec % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function updateAllUI({ playing, title, position, duration } = {}) {
  uiTargets.forEach((t) => {
    if (playing !== undefined) t.root.classList.toggle('is-playing', playing);
    if (title !== undefined && t.title) t.title.textContent = title;
    if (position !== undefined && duration && t.progressFill) {
      const pct = duration > 0 ? Math.min(100, (position / duration) * 100) : 0;
      t.progressFill.style.width = pct + '%';
    }
    if (position !== undefined && duration !== undefined && t.timeEl) {
      t.timeEl.textContent = `${formatTime(position)} / ${formatTime(duration)}`;
    }
  });
}

function setPlayerStatus(msg) {
  document.querySelectorAll('[data-role="player-status"]').forEach((el) => {
    el.textContent = msg || '';
  });
}

function loadSoundCloudApi() {
  return new Promise((resolve, reject) => {
    if (window.SC && window.SC.Widget) return resolve();
    const existing = document.querySelector('script[data-hy-sc-api]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('SoundCloud API failed')));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://w.soundcloud.com/player/api.js';
    script.async = true;
    script.dataset.hyScApi = '1';
    script.onload = () => {
      if (window.SC && window.SC.Widget) resolve();
      else reject(new Error('SoundCloud Widget missing'));
    };
    script.onerror = () => reject(new Error('SoundCloud API blocked or offline'));
    document.head.appendChild(script);
  });
}

function showEmbedFallback(reason) {
  apiFailed = true;
  setPlayerStatus(reason || 'Open the embed below to listen.');
  document.querySelectorAll('.hy-player').forEach((root) => {
    if (root.querySelector('[data-role="sc-embed"]')) return;
    const wrap = document.createElement('div');
    wrap.dataset.role = 'sc-embed';
    wrap.style.cssText = 'margin-top:0.75rem;border-radius:12px;overflow:hidden;border:1px solid rgba(138,92,240,0.25)';
    wrap.innerHTML =
      `<iframe title="Talu — What Remains" width="100%" height="160" scrolling="no" frameborder="no" allow="autoplay" src="${EMBED_SRC}"></iframe>`;
    root.appendChild(wrap);
  });
  // Also inject into full player in detail if present
  document.querySelectorAll('.hy-player-full').forEach((root) => {
    if (root.querySelector('[data-role="sc-embed"]')) return;
  });
}

function createHiddenWidget() {
  let iframe = document.getElementById('hy-sc-widget');
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id = 'hy-sc-widget';
    iframe.setAttribute('allow', 'autoplay');
    iframe.title = 'Haylynn player';
    iframe.style.cssText =
      'position:fixed;width:1px;height:1px;left:-9999px;top:-9999px;border:0;opacity:0;pointer-events:none';
    iframe.src =
      'https://w.soundcloud.com/player/?url=' +
      encodeURIComponent(PLAYLIST_URL) +
      '&auto_play=false&hide_related=true&show_comments=false';
    document.body.appendChild(iframe);
  }

  const w = window.SC.Widget(iframe);

  w.bind(window.SC.Widget.Events.READY, () => {
    widgetReady = true;
    setPlayerStatus('');
    try {
      w.getCurrentSound((sound) => {
        if (sound) {
          updateAllUI({
            playing: false,
            title: sound.title,
            position: 0,
            duration: sound.duration,
          });
        }
      });
    } catch (_) { /* ignore */ }
    if (pendingPlay) {
      pendingPlay = false;
      try {
        w.play();
      } catch (_) {
        showEmbedFallback('Tap play in the embed.');
      }
    }
  });

  w.bind(window.SC.Widget.Events.PLAY, () => {
    try {
      w.getCurrentSound((sound) =>
        updateAllUI({ playing: true, title: sound ? sound.title : undefined })
      );
    } catch (_) {
      updateAllUI({ playing: true });
    }
  });
  w.bind(window.SC.Widget.Events.PAUSE, () => updateAllUI({ playing: false }));
  w.bind(window.SC.Widget.Events.FINISH, () => updateAllUI({ playing: false }));
  w.bind(window.SC.Widget.Events.PLAY_PROGRESS, (data) => {
    try {
      w.getDuration((duration) =>
        updateAllUI({ position: data.currentPosition, duration })
      );
    } catch (_) { /* ignore */ }
  });

  // If READY never fires (blocked iframe), surface embed after a short wait
  setTimeout(() => {
    if (!widgetReady && !apiFailed) {
      showEmbedFallback('Player needs the embed on this browser.');
    }
  }, 5000);

  return w;
}

async function ensurePlayer() {
  if (apiFailed) return null;
  if (widget) return widget;
  try {
    await loadSoundCloudApi();
    widget = createHiddenWidget();
    return widget;
  } catch (err) {
    console.warn('[haylynn-player]', err);
    showEmbedFallback('SoundCloud blocked — use the embed.');
    return null;
  }
}

async function safeToggle() {
  const w = await ensurePlayer();
  if (!w) return;
  if (!widgetReady) {
    pendingPlay = true;
    setPlayerStatus('Loading…');
    return;
  }
  try {
    w.toggle();
  } catch (err) {
    console.warn('[haylynn-player] toggle', err);
    showEmbedFallback('Use the embed to play.');
  }
}

function wirePlayerRoot(root) {
  if (root.dataset.hyPlayerWired) return;
  root.dataset.hyPlayerWired = '1';

  // status line under controls
  if (!root.querySelector('[data-role="player-status"]')) {
    const st = document.createElement('p');
    st.dataset.role = 'player-status';
    st.className = 'th-empty';
    st.style.cssText =
      'font-family:Space Mono,monospace;font-size:0.55rem;color:var(--ink-dim,#9a92a4);margin:0.4rem 0 0;min-height:1em';
    root.appendChild(st);
  }

  const target = {
    root,
    playBtn: root.querySelector('[data-role="play-toggle"]'),
    title: root.querySelector('[data-role="track-title"]'),
    progressFill: root.querySelector('[data-role="progress-fill"]'),
    progressTrack: root.querySelector('[data-role="progress-track"]'),
    timeEl: root.querySelector('[data-role="track-time"]'),
  };
  uiTargets.push(target);

  if (target.playBtn) {
    target.playBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      safeToggle();
    });
  }

  const nextBtn = root.querySelector('[data-role="next"]');
  const prevBtn = root.querySelector('[data-role="prev"]');
  if (nextBtn) {
    nextBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const w = await ensurePlayer();
      if (!w || !widgetReady) return;
      try {
        w.next();
        w.play();
      } catch (_) {
        showEmbedFallback();
      }
    });
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const w = await ensurePlayer();
      if (!w || !widgetReady) return;
      try {
        w.prev();
        w.play();
      } catch (_) {
        showEmbedFallback();
      }
    });
  }

  if (target.progressTrack) {
    target.progressTrack.addEventListener('click', async (e) => {
      const w = await ensurePlayer();
      if (!w || !widgetReady) return;
      const rect = target.progressTrack.getBoundingClientRect();
      const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      try {
        w.getDuration((duration) => w.seekTo(pct * duration));
      } catch (_) { /* ignore */ }
    });
  }
}

function wireTrackList() {
  document.querySelectorAll('[data-track-index]').forEach((el) => {
    if (el.dataset.hyTrackWired) return;
    el.dataset.hyTrackWired = '1';
    el.addEventListener('click', async (e) => {
      e.preventDefault();
      const w = await ensurePlayer();
      if (!w || !widgetReady) {
        pendingPlay = true;
        showEmbedFallback('Track list needs SoundCloud — use embed if play stays quiet.');
        return;
      }
      const idx = parseInt(el.dataset.trackIndex, 10);
      try {
        w.skip(idx);
        w.play();
      } catch (_) {
        showEmbedFallback();
      }
    });
  });
}

export function initHaylynnPlayer() {
  document.querySelectorAll('.hy-player').forEach(wirePlayerRoot);
  wireTrackList();
}
