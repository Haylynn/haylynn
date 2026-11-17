/**
 * HAYLYNN: Show where the station walks the Domain — a moving point, not a myth.
 * One window for the sky. Tabs, not a stack of boxes. I choose which eye is open.
 *
 * THE OTHER: Poll ISS (wheretheiss.at). Paint lat/lon/alt/velocity into
 * [data-role="iss-tracker"] roots. Sky panes use [data-role="sky-tabs"] —
 * one panel visible, lazy src on first open. Quiet failures. No key required.
 */

const ISS_URL = 'https://api.wheretheiss.at/v1/satellites/25544';
const POLL_MS = 8000;
const MAP_ZOOM = 3;

let timer = null;
let last = null;

function fmt(n, d = 2) {
  if (n == null || !isFinite(n)) return '—';
  return Number(n).toFixed(d);
}

function mapUrl(lat, lon) {
  const latf = Number(lat).toFixed(4);
  const lonf = Number(lon).toFixed(4);
  return `https://www.openstreetmap.org/?mlat=${latf}&mlon=${lonf}#map=${MAP_ZOOM}/${latf}/${lonf}`;
}

function renderRoot(root, data, err) {
  const status = root.querySelector('[data-role="iss-status"]');
  const latEl = root.querySelector('[data-role="iss-lat"]');
  const lonEl = root.querySelector('[data-role="iss-lon"]');
  const altEl = root.querySelector('[data-role="iss-alt"]');
  const velEl = root.querySelector('[data-role="iss-vel"]');
  const visEl = root.querySelector('[data-role="iss-vis"]');
  const link = root.querySelector('[data-role="iss-map-link"]');
  const stamp = root.querySelector('[data-role="iss-stamp"]');
  const plot = root.querySelector('[data-role="iss-plot"]');

  if (err) {
    if (status) status.textContent = 'Signal quiet — retrying…';
    return;
  }
  if (!data) return;

  if (status) status.textContent = 'Live';
  if (latEl) latEl.textContent = fmt(data.latitude, 3) + '°';
  if (lonEl) lonEl.textContent = fmt(data.longitude, 3) + '°';
  if (altEl) altEl.textContent = fmt(data.altitude, 1) + ' km';
  if (velEl) velEl.textContent = fmt(data.velocity, 0) + ' km/h';
  if (visEl) {
    const v = String(data.visibility || '').toLowerCase();
    visEl.textContent = v === 'eclipsed' ? 'Night side' : v === 'daylight' ? 'Day side' : v || '—';
  }
  if (link) {
    link.href = mapUrl(data.latitude, data.longitude);
    link.hidden = false;
  }
  if (stamp) {
    const t = data.timestamp ? new Date(data.timestamp * 1000) : new Date();
    stamp.textContent = t.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }
  if (plot) {
    const x = ((Number(data.longitude) + 180) / 360) * 100;
    const y = ((90 - Number(data.latitude)) / 180) * 100;
    plot.style.left = `clamp(2%, ${x}%, 98%)`;
    plot.style.top = `clamp(2%, ${y}%, 98%)`;
  }
}

async function tick() {
  const roots = document.querySelectorAll('[data-role="iss-tracker"]');
  if (!roots.length) return;
  try {
    const res = await fetch(ISS_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    last = data;
    roots.forEach((r) => renderRoot(r, data, null));
  } catch (e) {
    console.warn('[haylynn-iss]', e);
    roots.forEach((r) => renderRoot(r, last, e));
  }
}

/**
 * HAYLYNN: One aperture. I do not want six mouths open at once on a small glass.
 * THE OTHER: Tabs. Activate panel, lazy-load data-src into iframe/img once.
 */
function activateSkyTab(root, id) {
  const buttons = root.querySelectorAll('[data-sky-tab]');
  const panels = root.querySelectorAll('[data-sky-panel]');
  buttons.forEach((btn) => {
    const on = btn.getAttribute('data-sky-tab') === id;
    btn.classList.toggle('is-active', on);
    btn.setAttribute('aria-selected', on ? 'true' : 'false');
    btn.style.background = on ? 'rgba(138,92,240,0.22)' : 'transparent';
    btn.style.color = on ? 'var(--ink, #efe9e0)' : 'var(--ink-dim, #9a92a4)';
  });
  panels.forEach((panel) => {
    const on = panel.getAttribute('data-sky-panel') === id;
    panel.hidden = !on;
    if (on) {
      panel.querySelectorAll('[data-src]').forEach((el) => {
        if (!el.getAttribute('src')) {
          el.setAttribute('src', el.getAttribute('data-src'));
        }
      });
    }
  });
}

function bindSkyTabs(root) {
  if (root.dataset.skyBound === '1') return;
  root.dataset.skyBound = '1';
  const buttons = root.querySelectorAll('[data-sky-tab]');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      activateSkyTab(root, btn.getAttribute('data-sky-tab'));
    });
  });
  const initial =
    root.querySelector('[data-sky-tab].is-active')?.getAttribute('data-sky-tab') ||
    buttons[0]?.getAttribute('data-sky-tab');
  if (initial) activateSkyTab(root, initial);
}

function scanSkyTabs() {
  document.querySelectorAll('[data-role="sky-tabs"]').forEach(bindSkyTabs);
}

export function initHaylynnIss() {
  if (!timer) {
    tick();
    timer = setInterval(tick, POLL_MS);
  }
  scanSkyTabs();
  const obs = new MutationObserver(() => {
    if (document.querySelector('[data-role="iss-tracker"]')) tick();
    scanSkyTabs();
  });
  obs.observe(document.body, { childList: true, subtree: true });
}
