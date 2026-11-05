/**
 * HAYLYNN: Show where the station walks the Domain — a moving point, not a myth.
 *
 * THE OTHER: Poll where the ISS is (wheretheiss.at), paint lat/lon/alt/velocity into
 * [data-role="iss-tracker"] roots. Quiet failures. No key required.
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
  // OpenStreetMap view centered on ISS
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
    stamp.textContent = t.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  // optional mini “dot” on a simple equirect projection box
  const plot = root.querySelector('[data-role="iss-plot"]');
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

export function initHaylynnIss() {
  if (timer) return;
  tick();
  timer = setInterval(tick, POLL_MS);
  // re-scan when detail panels open
  const obs = new MutationObserver(() => {
    if (document.querySelector('[data-role="iss-tracker"]')) tick();
  });
  obs.observe(document.body, { childList: true, subtree: true });
}
