/**
 * Haylynn ambient weather
 * Top-right · transparent · 3-day icons from Open-Meteo
 * Geolocation optional — if denied, strip stays hidden
 */

import { WEATHER_CONFIG } from './weather-config.js';

/* WMO weather interpretation codes → simple glyph + short label */
const WMO = {
  0:  { icon: '☀',  label: 'Clear' },
  1:  { icon: '☀',  label: 'Mainly clear' },
  2:  { icon: '⛅',  label: 'Partly cloudy' },
  3:  { icon: '☁',  label: 'Overcast' },
  45: { icon: '〰',  label: 'Fog' },
  48: { icon: '〰',  label: 'Rime fog' },
  51: { icon: '🌦',  label: 'Drizzle' },
  53: { icon: '🌦',  label: 'Drizzle' },
  55: { icon: '🌦',  label: 'Drizzle' },
  61: { icon: '🌧',  label: 'Rain' },
  63: { icon: '🌧',  label: 'Rain' },
  65: { icon: '🌧',  label: 'Heavy rain' },
  71: { icon: '❄',  label: 'Snow' },
  73: { icon: '❄',  label: 'Snow' },
  75: { icon: '❄',  label: 'Heavy snow' },
  77: { icon: '❄',  label: 'Snow grains' },
  80: { icon: '🌧',  label: 'Showers' },
  81: { icon: '🌧',  label: 'Showers' },
  82: { icon: '🌧',  label: 'Heavy showers' },
  85: { icon: '❄',  label: 'Snow showers' },
  86: { icon: '❄',  label: 'Snow showers' },
  95: { icon: '⛈',  label: 'Thunder' },
  96: { icon: '⛈',  label: 'Thunder' },
  99: { icon: '⛈',  label: 'Thunder' },
};

function codeInfo(code) {
  return WMO[code] || { icon: '·', label: '' };
}

function dayLabel(isoDate, index) {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  const d = new Date(isoDate + 'T12:00:00');
  return d.toLocaleDateString(undefined, { weekday: 'short' });
}

const STYLE = `
#haylynn-weather {
  position: fixed;
  top: 1.1rem;
  right: 1.1rem;
  z-index: 35;
  display: flex;
  align-items: stretch;
  gap: 0.7rem;
  padding: 0.45rem 0.7rem;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(6,5,12,0.55);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  font-family: 'Space Mono', monospace;
  font-size: 0.55rem;
  letter-spacing: 0.06em;
  color: var(--ink-dim, #9a92a4);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--weather-fade, 0.8s) ease;
  max-width: min(92vw, 280px);
}
#haylynn-weather.visible {
  opacity: 1;
  pointer-events: auto;
}
#haylynn-weather .day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  min-width: 2.6rem;
}
#haylynn-weather .day-name {
  text-transform: uppercase;
  opacity: 0.7;
  font-size: 0.5rem;
}
#haylynn-weather .day-icon {
  font-size: 0.95rem;
  line-height: 1.2;
  color: var(--ink, #efe9e0);
}
#haylynn-weather .day-temp {
  font-variant-numeric: tabular-nums;
  color: var(--ink, #efe9e0);
  opacity: 0.9;
}
#haylynn-weather .sep {
  width: 1px;
  align-self: stretch;
  background: rgba(255,255,255,0.1);
  margin: 0.1rem 0;
}
@media (max-width: 420px) {
  #haylynn-weather {
    top: 0.7rem;
    right: 0.6rem;
    padding: 0.35rem 0.5rem;
    gap: 0.45rem;
  }
  #haylynn-weather .day { min-width: 2.2rem; }
}
@media (prefers-reduced-motion: reduce) {
  #haylynn-weather { transition: none; }
}
`;

function getPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation unavailable'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      err => reject(err),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 30 * 60 * 1000 }
    );
  });
}

async function fetchForecast(lat, lon) {
  const days = WEATHER_CONFIG.forecastDays || 3;
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${lat}&longitude=${lon}` +
    `&daily=weathercode,temperature_2m_max,temperature_2m_min` +
    `&timezone=auto&forecast_days=${days}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
  return res.json();
}

function renderDays(daily) {
  const codes = daily.weathercode || [];
  const maxs  = daily.temperature_2m_max || [];
  const mins  = daily.temperature_2m_min || [];
  const dates = daily.time || [];

  const parts = [];
  for (let i = 0; i < codes.length; i++) {
    const info = codeInfo(codes[i]);
    const hi = maxs[i] != null ? Math.round(maxs[i]) : '—';
    const lo = mins[i] != null ? Math.round(mins[i]) : '—';
    if (i > 0) parts.push('<div class="sep"></div>');
    parts.push(`
      <div class="day" title="${info.label}">
        <span class="day-name">${dayLabel(dates[i], i)}</span>
        <span class="day-icon">${info.icon}</span>
        <span class="day-temp">${hi}°</span>
      </div>
    `);
  }
  return parts.join('');
}

export function startWeather() {
  if (!document.getElementById('haylynn-weather-style')) {
    const style = document.createElement('style');
    style.id = 'haylynn-weather-style';
    style.textContent = STYLE;
    document.head.appendChild(style);
  }

  let bar = document.getElementById('haylynn-weather');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'haylynn-weather';
    bar.setAttribute('aria-label', 'Local weather');
    document.body.appendChild(bar);
  }

  let hideTimer = null;
  let hovering = false;

  function show() {
    bar.style.setProperty('--weather-fade', `${WEATHER_CONFIG.fadeInMs}ms`);
    bar.classList.add('visible');
    clearTimeout(hideTimer);
    if (!hovering) {
      hideTimer = setTimeout(hide, WEATHER_CONFIG.visibleMs);
    }
  }

  function hide() {
    if (hovering) return;
    bar.style.setProperty('--weather-fade', `${WEATHER_CONFIG.fadeOutMs}ms`);
    bar.classList.remove('visible');
  }

  bar.addEventListener('pointerenter', () => {
    hovering = true;
    clearTimeout(hideTimer);
    bar.classList.add('visible');
  });
  bar.addEventListener('pointerleave', () => {
    hovering = false;
    hideTimer = setTimeout(hide, WEATHER_CONFIG.visibleMs);
  });

  async function update() {
    try {
      const { lat, lon } = await getPosition();
      const data = await fetchForecast(lat, lon);
      if (!data?.daily) return;

      bar.innerHTML = renderDays(data.daily);
      show();
    } catch (err) {
      // Permission denied or network — stay invisible. No error UI.
      console.warn('[haylynn-weather]', err.message || err);
      bar.classList.remove('visible');
      bar.innerHTML = '';
    }
  }

  if (WEATHER_CONFIG.requestOnLoad) {
    // Slight delay so it doesn't compete with first paint / scroll setup
    setTimeout(update, 1200);
  }

  setInterval(update, WEATHER_CONFIG.refreshMs);
}
