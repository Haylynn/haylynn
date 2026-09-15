/**
 * Hananaru product window — plug-and-play.
 * Set enabled: true and checkoutUrl when a SKU is live.
 * Rotate featured by toggling enabled; pool can hold evergreen items.
 */
export const PRODUCTS_CONFIG = {
  currencySymbol: '£',
  /** Max cards on the scroll face */
  faceLimit: 6,
  products: [
    {
      id: 'ground-state-print',
      name: 'Ground State — mech print',
      blurb: 'A3 giclée, numbered edition',
      price: null, // e.g. 28
      tag: 'Waiting',
      image: '', // optional /assets/...
      checkoutUrl: '', // Stripe Payment Link or Shopify URL
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
