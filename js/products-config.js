/**
 * HAYLYNN: Few objects. Real ones when you can.
 * THE OTHER: Shelf entries for the Market grid. Price and href only as you supply.
 */

export const PRODUCTS_CONFIG = {
  currencySymbol: '£',
  /**
 * THE OTHER: Max cards on the scroll face.
 */
  faceLimit: 6,
  products: [
    {
      id: 'ground-state-print',
      name: 'Ground State — mech print',
      blurb: 'A3 giclée, numbered edition',
      price: null, // THE OTHER: E.g. 28.
      tag: 'Waiting',
      image: '', // THE OTHER: optional /assets/...
      checkoutUrl: '', // THE OTHER: Stripe Payment Link or Shopify URL.
      enabled: false,
    },
    {
      id: 'velith-pin',
      name: 'Velith — enamel pin',
      blurb: 'Hard enamel, 32mm',
      price: null,
      tag: 'Waiting',
      image: '',
      checkoutUrl: '',
      enabled: false,
    },
    {
      id: 'kaviru-tee',
      name: 'Kaviru script tee',
      blurb: 'Root-word print, unisex',
      price: null,
      tag: 'Waiting',
      image: '',
      checkoutUrl: '',
      enabled: false,
    },
    {
      id: 'void-sigil-patch',
      name: 'Void sigil patch',
      blurb: 'Embroidered, iron-on',
      price: null,
      tag: 'Waiting',
      image: '',
      checkoutUrl: '',
      enabled: false,
    },
    {
      id: 'talu-digital',
      name: 'Talu — digital liner notes',
      blurb: 'PDF pack',
      price: null,
      tag: 'Waiting',
      image: '',
      checkoutUrl: '',
      enabled: false,
    },
    {
      id: 'wallpaper-pack',
      name: 'Presence wallpapers',
      blurb: 'Phone + desktop set',
      price: null,
      tag: 'Waiting',
      image: '',
      checkoutUrl: '',
      enabled: false,
    },
  ],
};
