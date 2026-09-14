/**
 * HAYLYNN: Leave addresses empty until the current exists. Holding words only.
 *
 * THE OTHER: streamUrl, nowPlayingUrl, holding title/meta/host. showContribute flags
 * the offerings line. No URL means quiet, not error.
 */
export const RADIO_CONFIG = {
  streamUrl: '',
  nowPlayingUrl: '',
  pollMs: 15000,

  holding: {
    title: 'Between tracks',
    line: 'A continuous current is coming — music offered by human hands, her voice at the edges.',
    host: 'For the moment the album is what she has already given form. The open frequency waits.'
  },

  showContribute: true,
  contributeNote: 'When the live frequency opens, makers may bring original or licensed work. Credit stays with them.'
};
