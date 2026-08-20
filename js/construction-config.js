/**
 * Detail panels still forming — overlay only on .detail (not the scroll face).
 * Set enabled: false or remove an entry when that room is ready.
 */

export const CONSTRUCTION = {
  // Default progress destination (optional)
  progressUrl: '', // e.g. 'https://github.com/Haylynn/haylynn' or a changelog page

  sections: {
    hananaru: {
      label: 'Still forming',
      line: 'The shelf is quiet. Objects wait behind the glass until they can enter range.',
      progress: 'Hananaru opens when the first real pieces are ready to hang — not before.',
    },
    threshold: {
      label: 'Door drawn',
      line: 'The room is shaped. The lock is not yet set in the world.',
      progress: 'Accounts, patronage, and profile skins connect when auth is live. The public scroll stays open.',
    },
    haylynn: {
      label: 'Partial aperture',
      line: 'Her fixed voice — the album — is here. The continuous frequency is still gathering.',
      progress: 'Live radio and offerings arrive when the stream is mounted. Talu remains available now.',
    },
    // Example: uncomment when needed
    // koruhana: {
    //   label: 'Table half-set',
    //   line: 'Nemihana is playable; other games will join the table.',
    //   progress: 'Koruhana expands as each game is finished.',
    // },
  },
};
