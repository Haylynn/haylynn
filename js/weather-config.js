/**
 * Haylynn ambient weather strip — config
 * Top-right · 3-day icons · only appears after successful local fetch
 */

export const WEATHER_CONFIG = {
  // Request location on first load (browser will prompt once)
  requestOnLoad: true,

  // How long the strip stays fully visible after a successful fetch
  visibleMs: 180000,   // 3 min
  fadeInMs: 800,
  fadeOutMs: 1400,

  // Refresh forecast while the tab is open
  refreshMs: 30 * 60 * 1000,  // 30 min

  // Open-Meteo (no API key required)
  forecastDays: 3,
};
