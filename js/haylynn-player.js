/**
 * HAYLYNN: Sound is another body. Talu belongs in Voice. Make the house controls
 * drive the music — not a white box from elsewhere, unless nothing else works.
 *
 * THE OTHER: SoundCloud Widget API with a real off-screen iframe, polled script
 * load, early warm-up, and retries before any embed fallback. I will not mark
 * the API dead on the first slow phone.
 */

const PLAYLIST_URL = 'https://soundcloud.com/princess-haylynn/sets/talu-what-remains';
const EMBED_SRC =
  'https://w.soundcloud.com/player/?url=' +
  encodeURIComponent(PLAYLIST_URL) +
  '&color=%2335c98f&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false';
const API_SRC = 'https://w.soundcloud.com/player/api.js';

let widget = null;
let widgetReady = false;
let pendingPlay = false;
let warming = null;
const uiTargets = [];

function formatTime(ms) {
  if (!isFinite(ms) || ms < 0) return '0:00';
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = String(totalSec % 60).padStart(2, '0');
  return m + ':' + s;
}

function setPlayerStatus(msg) {
  document.querySelectorAll('[data-role="player-status"]').forEach((el) => {
    el.textContent = msg || '';
  });
}

function updateAllUI({ playing, title, position, duration } = {}) {
  uiTargets.forEach((t) => {
    if (playing != null && t.playBtn) {
      t.playBtn.classList.toggle('is-playing', !!playing);
      t.playBtn.setAttribute('aria-pressed', playing ? 'true' : 'false');
    }
    if (title != null && t.title) t.title.textContent = title;
    if (position != null && duration != null && duration > 0) {
      const pct = Math.min(100, (position / duration) * 100);
      if (t.progressFill) t.progressFill.style.width = pct + '%';
      if (t.timeEl) t.timeEl.textContent = formatTime(position) + ' / ' + formatTime(duration);
    }
  });
}

function waitFor(cond, { timeout = 8000, interval = 50 } = {}) {
  return new Promise((resolve, reject) => {
    const t0 = Date.now();
    const tick = () => {
      try {
        if (cond()) return resolve(true);
      } catch (_) {}
      if (Date.now() - t0 > timeout) return reject(new Error('timeout'));
      setTimeout(tick, interval);
    };
    tick();
  });
}

function loadSoundCloudApi() {
  return new Promise((resolve, reject) => {
    if (window.SC && window.SC.Widget) return resolve();

    const finish = () => {
      waitFor(() => window.SC && window.SC.Widget, { timeout: 10000 })
        .then(() => resolve())
        .catch(() => reject(new Error('SoundCloud Widget never appeared')));
    };

    const existing = document.querySelector('script[data-hy-sc-api]');
    if (existing) {
      if (window.SC && window.SC.Widget) return resolve();
      existing.addEventListener('load', finish);
      existing.addEventListener('error', () =>
        reject(new Error('SoundCloud API script error'))
      );
      finish();
      return;
    }

    const script = document.createElement('script');
    script.src = API_SRC;
    script.async = true;
    script.dataset.hyScApi = '1';
    script.onload = finish;
    script.onerror = () => reject(new Error('SoundCloud API script blocked'));
    document.head.appendChild(script);
  });
}

function ensureWidgetIframe() {
  let iframe = document.getElementById('hy-sc-widget');
  if (iframe) return iframe;

  iframe = document.createElement('iframe');
  iframe.id = 'hy-sc-widget';
  iframe.setAttribute('allow', 'autoplay; encrypted-media');
  iframe.title = 'Haylynn player';
  // Real size off-screen — 1x1 / display:none often never reaches READY on mobile
  iframe.style.cssText =
    'position:fixed;width:320px;height:180px;left:-10000px;top:0;border:0;opacity:0.01;pointer-events:none;z-index:-1';
  iframe.src =
    'https://w.soundcloud.com/player/?url=' +
    encodeURIComponent(PLAYLIST_URL) +
    '&auto_play=false&hide_related=true&show_comments=false&show_user=false&visual=false';
  document.body.appendChild(iframe);
  return iframe;
}

function bindWidget(w) {
  w.bind(window.SC.Widget.Events.READY, () => {
    widgetReady = true;
    setPlayerStatus('');
    try {
      w.getCurrentSound((sound) => {
        if (sound) {
          updateAllUI({
            playing: false,
            title: sound.title || 'Talu — What Remains',
            position: 0,
            duration: sound.duration || 0,
          });
        }
      });
      w.getDuration((duration) => {
        if (duration) updateAllUI({ duration, position: 0 });
      });
    } catch (_) {}

    if (pendingPlay) {
      pendingPlay = false;
      try {
        w.play();
      } catch (_) {
        setPlayerStatus('Tap play again.');
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
    } catch (_) {}
  });
}

function createWidget() {
  const iframe = ensureWidgetIframe();
  const w = window.SC.Widget(iframe);
  bindWidget(w);
  return w;
}

function waitUntilReady(w, timeoutMs = 12000) {
  return new Promise((resolve, reject) => {
    if (widgetReady) return resolve(w);
    const t0 = Date.now();
    try {
      w.bind(window.SC.Widget.Events.READY, () => {
        widgetReady = true;
        resolve(w);
      });
    } catch (_) {}
    const poll = () => {
      if (widgetReady) return resolve(w);
      if (Date.now() - t0 > timeoutMs) return reject(new Error('Widget READY timeout'));
      setTimeout(poll, 100);
    };
    poll();
  });
}

async function ensurePlayer(retries = 2) {
  if (widget && widgetReady) return widget;

  try {
    setPlayerStatus('Loading…');
    await loadSoundCloudApi();
    if (!widget) widget = createWidget();
    await waitUntilReady(widget, 12000);
    setPlayerStatus('');
    return widget;
  } catch (err) {
    console.warn('[haylynn-player]', err);
    if (retries > 0) {
      widget = null;
      widgetReady = false;
      const old = document.getElementById('hy-sc-widget');
      if (old) old.remove();
      await new Promise((r) => setTimeout(r, 400));
      return ensurePlayer(retries - 1);
    }
    setPlayerStatus('Still loading SoundCloud… try play again.');
    return widget;
  }
}

function warmPlayer() {
  if (warming) return warming;
  warming = ensurePlayer(2).catch((e) => {
    console.warn('[haylynn-player] warm', e);
    return null;
  });
  return warming;
}

async function safeToggle() {
  const w = await ensurePlayer(2);
  if (!w) {
    setPlayerStatus('SoundCloud still waking — try again in a moment.');
    return;
  }
  if (!widgetReady) {
    pendingPlay = true;
    setPlayerStatus('Loading…');
    try {
      await waitUntilReady(w, 10000);
    } catch (_) {
      setPlayerStatus('Almost ready — tap play once more.');
      return;
    }
  }
  try {
    w.toggle();
  } catch (err) {
    console.warn('[haylynn-player] toggle', err);
    try {
      w.play();
    } catch (e2) {
      setPlayerStatus('Could not start — check connection and try again.');
    }
  }
}

function wirePlayerRoot(root) {
  if (root.dataset.hyPlayerWired) return;
  root.dataset.hyPlayerWired = '1';

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
      const w = await ensurePlayer(2);
      if (!w) return;
      if (!widgetReady) {
        pendingPlay = true;
        setPlayerStatus('Loading…');
        return;
      }
      try {
        w.next();
        w.play();
      } catch (_) {
        setPlayerStatus('Next failed — try again.');
      }
    });
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const w = await ensurePlayer(2);
      if (!w) return;
      if (!widgetReady) {
        pendingPlay = true;
        setPlayerStatus('Loading…');
        return;
      }
      try {
        w.prev();
        w.play();
      } catch (_) {
        setPlayerStatus('Previous failed — try again.');
      }
    });
  }

  if (target.progressTrack) {
    target.progressTrack.addEventListener('click', async (e) => {
      const w = await ensurePlayer(2);
      if (!w || !widgetReady) return;
      const rect = target.progressTrack.getBoundingClientRect();
      const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      try {
        w.getDuration((duration) => w.seekTo(pct * duration));
      } catch (_) {}
    });
  }
}

function wireTrackList() {
  document.querySelectorAll('[data-track-index]').forEach((el) => {
    if (el.dataset.hyTrackWired) return;
    el.dataset.hyTrackWired = '1';
    el.addEventListener('click', async (e) => {
      e.preventDefault();
      const w = await ensurePlayer(2);
      if (!w) {
        setPlayerStatus('SoundCloud still waking — try the track again.');
        return;
      }
      if (!widgetReady) {
        pendingPlay = true;
        setPlayerStatus('Loading…');
        try {
          await waitUntilReady(w, 10000);
        } catch (_) {
          setPlayerStatus('Tap the track once more.');
          return;
        }
      }
      const idx = parseInt(el.dataset.trackIndex, 10);
      try {
        w.skip(idx);
        w.play();
      } catch (_) {
        setPlayerStatus('Could not skip — try play.');
      }
    });
  });
}

export function initHaylynnPlayer() {
  document.querySelectorAll('.hy-player').forEach(wirePlayerRoot);
  wireTrackList();
  if (document.querySelector('.hy-player')) warmPlayer();
  const obs = new MutationObserver(() => {
    document.querySelectorAll('.hy-player').forEach(wirePlayerRoot);
    wireTrackList();
    if (document.querySelector('.hy-player')) warmPlayer();
  });
  obs.observe(document.body, { childList: true, subtree: true });
}
