/**
 * Detail panels still forming — does not affect the scroll face.
 * mode: 'banner' (default) = notice at top of detail, content visible
 *       'veil' = full detail cover until you tap for progress
 */

export const CONSTRUCTION = {
  progressUrl: '',

  sections: {
    hananaru: {
      mode: 'banner',
      label: 'Still forming',
      line: 'The shelf is quiet. Objects wait behind the glass until they can enter range.',
      progress: 'Hananaru opens when the first real pieces are ready to hang — not before.',
    },
    threshold: {
      mode: 'banner',
      label: 'Door drawn',
      line: 'The room is shaped. The lock is not yet set in the world.',
      progress: 'Accounts and patronage connect when auth is live. The public scroll stays open.',
    },
    haylynn: {
      mode: 'banner',
      label: 'Partial aperture',
      line: 'The album is here. The continuous frequency is still gathering.',
      progress: 'Live radio arrives when the stream is mounted. Talu remains available now.',
    },
  },
};
