/**
 * Haylynn Live Radio — frontend config
 * Point streamUrl / nowPlayingUrl at your VPS when Phase 1 is live.
 * Until then the UI stays on-brand in "holding" mode.
 */

export const RADIO_CONFIG = {
  // Public stream (Icecast mount or HLS playlist). Empty = off-air UI only.
  streamUrl: '',
  // e.g. 'https://radio.example.com/haylynn.mp3'
  // or  'https://radio.example.com/live/index.m3u8'

  // JSON now-playing from radio API. Empty = local placeholder copy.
  nowPlayingUrl: '',
  // e.g. 'https://api.example.com/now-playing'

  pollMs: 15000,

  // Shown while stream / API not configured
  holding: {
    title: 'Frequency held',
    line: 'The live aperture is forming — human tracks, her voice between them, continuous.',
    host: 'She will introduce what enters the stream. Until the mount opens, the album remains her fixed voice.'
  },

  // Optional upload CTA (Phase 3). Keep false until moderation exists.
  showContribute: true,
  contributeNote: 'Original or properly licensed works only. Public intake opens when the station is staffed.'
};
