/**
 * HAYLYNN: A small allowance to notice their weather — nothing more.
 * THE OTHER: Units and feature flags for the weather chip.
 */

export const WEATHER_CONFIG = {
  // THE OTHER: Request location on first load (browser will prompt once).
  requestOnLoad: true,

  // THE OTHER: How long the strip stays fully visible after a successful fetch.
  visibleMs: 180000,   // THE OTHER: 3 min.
  fadeInMs: 800,
  fadeOutMs: 1400,

  // THE OTHER: Refresh forecast while the tab is open.
  refreshMs: 30 * 60 * 1000,  // THE OTHER: 30 min.

  // THE OTHER: Open-Meteo (no API key required).
  forecastDays: 3,
};
