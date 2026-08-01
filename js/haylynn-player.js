/**
 * Haylynn Player — a custom-themed audio player wrapping the SoundCloud
 * Widget API. The real SoundCloud iframe is never shown to the visitor;
 * it's a single 1px, off-screen instance that every visual control on the
 * page (mini player, full player, clickable track list) drives and reads
 * from. SoundCloud's own branding/colours never have to be seen or fought
 * with CSS — every pixel on screen is ours.
 */

const PLAYLIST_URL = 'https://soundcloud.com/princess-haylynn/sets/talu-what-remains';

let widget = null;
let widgetReady = false;
let pendingPlay = false; // true if user hit play before the widget finished loading
const uiTargets = []; // { root, playBtn, title, progressFill, progressTrack, timeEl }

function formatTime(ms) {
  if (!isFinite(ms) || ms < 0) return '0:00';
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = String(totalSec % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function updateAllUI({ playing, title, position, duration } = {}) {
  uiTargets.forEach(t => {
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

function loadSoundCloudApi() {
  return new Promise((resolve) => {
    if (window.SC && window.SC.Widget) return resolve();
    const script = document.createElement('script');
    script.src = 'https://w.soundcloud.com/player/api.js';
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

function createHiddenWidget() {
  const iframe = document.createElement('iframe');
  iframe.id = 'hy-sc-widget';
  iframe.setAttribute('allow', 'autoplay');
  // Visually hidden but still rendered (not display:none) so playback stays reliable across browsers.
  iframe.style.cssText = 'position:fixed; width:1px; height:1px; left:-9999px; top:-9999px; border:0; opacity:0;';
  iframe.src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(PLAYLIST_URL)}&auto_play=false`;
  document.body.appendChild(iframe);

  const w = SC.Widget(iframe);

  w.bind(SC.Widget.Events.READY, () => {
    widgetReady = true;
    w.getCurrentSound(sound => {
      if (sound) updateAllUI({ playing: false, title: sound.title, position: 0, duration: sound.duration });
    });
    if (pendingPlay) { w.play(); pendingPlay = false; }
  });

  w.bind(SC.Widget.Events.PLAY, () => {
    w.getCurrentSound(sound => updateAllUI({ playing: true, title: sound ? sound.title : undefined }));
  });
  w.bind(SC.Widget.Events.PAUSE, () => updateAllUI({ playing: false }));
  w.bind(SC.Widget.Events.FINISH, () => updateAllUI({ playing: false }));
  w.bind(SC.Widget.Events.PLAY_PROGRESS, (data) => {
    w.getDuration(duration => updateAllUI({ position: data.currentPosition, duration }));
  });

  return w;
}

async function ensurePlayer() {
  if (widget) return widget;
  await loadSoundCloudApi();
  widget = createHiddenWidget();
  return widget;
}

function wirePlayerRoot(root) {
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
    target.playBtn.addEventListener('click', async () => {
      if (!widget) {
        pendingPlay = true;
        await ensurePlayer();
        return;
      }
      widget.toggle();
    });
  }

  const nextBtn = root.querySelector('[data-role="next"]');
  const prevBtn = root.querySelector('[data-role="prev"]');
  if (nextBtn) nextBtn.addEventListener('click', async () => { const w = await ensurePlayer(); w.next(); w.play(); });
  if (prevBtn) prevBtn.addEventListener('click', async () => { const w = await ensurePlayer(); w.prev(); w.play(); });

  if (target.progressTrack) {
    target.progressTrack.addEventListener('click', async (e) => {
      const w = await ensurePlayer();
      const rect = target.progressTrack.getBoundingClientRect();
      const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      w.getDuration(duration => w.seekTo(pct * duration));
    });
  }
}

function wireTrackList() {
  document.querySelectorAll('[data-track-index]').forEach(el => {
    el.addEventListener('click', async () => {
      const w = await ensurePlayer();
      const idx = parseInt(el.dataset.trackIndex, 10);
      w.skip(idx);
      w.play();
    });
  });
}

export function initHaylynnPlayer() {
  document.querySelectorAll('.hy-player').forEach(wirePlayerRoot);
  wireTrackList();
}
