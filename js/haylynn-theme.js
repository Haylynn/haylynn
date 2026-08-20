/**
 * Haylynn profile theme — CSS variable injection from theme_config JSON
 * Layout stays fixed; skin adapts (MySpace-style personalization).
 */

const FONT_STACKS = {
  mono: "'Space Mono', ui-monospace, monospace",
  serif: "'Cormorant Garamond', Georgia, serif",
  sans: "system-ui, -apple-system, 'Segoe UI', sans-serif",
  display: "'Cormorant Garamond', Georgia, serif",
};

const RADIUS_MAP = {
  sharp: '0px',
  subtle: '6px',
  round: '14px',
  pill: '999px',
};

/** Default tokens when no theme_config (site void aesthetic) */
export const DEFAULT_THEME = {
  themeName: 'Void',
  colors: {
    primary: '#8a5cf0',
    secondary: '#35c98f',
    background: '#06050c',
    surface: '#12101a',
    text: '#efe9e0',
    accent: '#ec5aa0',
  },
  typography: { fontStyle: 'serif' },
  geometry: { borderRadius: 'subtle' },
  customEffects: { glow: false, scanlines: false, glassmorphism: true },
};

/**
 * Apply theme_config to a container via CSS custom properties + data attributes.
 * @param {HTMLElement} el
 * @param {object|null} themeConfig
 */
export function applyThemeConfig(el, themeConfig) {
  if (!el) return;
  const t = normalizeTheme(themeConfig);

  const c = t.colors;
  el.style.setProperty('--color-primary', c.primary);
  el.style.setProperty('--color-secondary', c.secondary);
  el.style.setProperty('--color-background', c.background);
  el.style.setProperty('--color-surface', c.surface);
  el.style.setProperty('--color-text', c.text);
  el.style.setProperty('--color-accent', c.accent);

  const radius =
    t.css?.borderRadius ||
    RADIUS_MAP[t.geometry?.borderRadius] ||
    RADIUS_MAP.subtle;
  el.style.setProperty('--border-radius', radius);
  el.style.setProperty(
    '--font-profile',
    FONT_STACKS[t.typography?.fontStyle] || FONT_STACKS.serif
  );

  el.dataset.themeName = t.themeName || '';
  el.dataset.fontStyle = t.typography?.fontStyle || 'serif';
  el.dataset.radius = t.geometry?.borderRadius || 'subtle';
  el.dataset.glow = t.customEffects?.glow ? '1' : '0';
  el.dataset.scanlines = t.customEffects?.scanlines ? '1' : '0';
  el.dataset.glass = t.customEffects?.glassmorphism ? '1' : '0';

  el.classList.add('hy-themed');
}

function normalizeTheme(raw) {
  if (!raw || typeof raw !== 'object') return DEFAULT_THEME;
  return {
    themeName: raw.themeName || DEFAULT_THEME.themeName,
    colors: { ...DEFAULT_THEME.colors, ...(raw.colors || {}) },
    typography: { ...DEFAULT_THEME.typography, ...(raw.typography || {}) },
    geometry: { ...DEFAULT_THEME.geometry, ...(raw.geometry || {}) },
    customEffects: { ...DEFAULT_THEME.customEffects, ...(raw.customEffects || {}) },
    css: raw.css || {},
  };
}

/**
 * Inject shared structural CSS once (components use variables only).
 */
export function injectThemeStyles() {
  if (document.getElementById('hy-theme-style')) return;
  const s = document.createElement('style');
  s.id = 'hy-theme-style';
  s.textContent = `
.hy-profile-skin {
  --color-primary: #8a5cf0;
  --color-secondary: #35c98f;
  --color-background: #06050c;
  --color-surface: #12101a;
  --color-text: #efe9e0;
  --color-accent: #ec5aa0;
  --border-radius: 6px;
  --font-profile: 'Cormorant Garamond', Georgia, serif;

  background: var(--color-background);
  color: var(--color-text);
  font-family: var(--font-profile);
  border-radius: var(--border-radius);
  border: 1px solid color-mix(in srgb, var(--color-primary) 35%, transparent);
  padding: 1.1rem 1.15rem 1.25rem;
  text-align: left;
  position: relative;
  overflow: hidden;
}

.hy-profile-skin .hy-profile-surface {
  background: var(--color-surface);
  border-radius: var(--border-radius);
  border: 1px solid color-mix(in srgb, var(--color-text) 12%, transparent);
  padding: 0.9rem;
}

.hy-profile-skin .hy-profile-name {
  font-style: italic;
  font-size: 1.35rem;
  color: var(--color-primary);
  margin: 0 0 0.25rem;
}

.hy-profile-skin .hy-profile-handle {
  font-family: 'Space Mono', monospace;
  font-size: 0.55rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-secondary);
  margin-bottom: 0.6rem;
}

.hy-profile-skin .hy-profile-bio {
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--color-text);
  opacity: 0.92;
}

.hy-profile-skin .hy-profile-links a {
  color: var(--color-accent);
  text-decoration: none;
  border-bottom: 1px solid color-mix(in srgb, var(--color-accent) 40%, transparent);
  font-size: 0.88rem;
  margin-right: 0.75rem;
}

.hy-profile-skin .hy-profile-avatar {
  width: 72px;
  height: 72px;
  border-radius: var(--border-radius);
  object-fit: cover;
  border: 2px solid var(--color-primary);
  background: var(--color-surface);
}

.hy-profile-skin .hy-profile-badge {
  display: inline-block;
  font-family: 'Space Mono', monospace;
  font-size: 0.5rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.25rem 0.55rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--color-secondary);
  color: var(--color-secondary);
  margin-top: 0.6rem;
}

/* Effects toggled via data attributes */
.hy-profile-skin[data-glow="1"] {
  box-shadow:
    0 0 24px color-mix(in srgb, var(--color-primary) 35%, transparent),
    0 0 48px color-mix(in srgb, var(--color-accent) 15%, transparent);
}
.hy-profile-skin[data-glass="1"] .hy-profile-surface {
  background: color-mix(in srgb, var(--color-surface) 72%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.hy-profile-skin[data-scanlines="1"]::after {
  content: '';
  pointer-events: none;
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent 2px,
    rgba(0, 0, 0, 0.12) 2px,
    rgba(0, 0, 0, 0.12) 3px
  );
  opacity: 0.45;
  mix-blend-mode: multiply;
}
.hy-profile-skin[data-font-style="mono"] {
  font-family: 'Space Mono', ui-monospace, monospace;
}
.hy-profile-skin[data-font-style="sans"] {
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
}
.hy-profile-skin[data-font-style="display"] .hy-profile-name {
  font-size: 1.6rem;
  letter-spacing: 0.02em;
}

@media (prefers-reduced-motion: reduce) {
  .hy-profile-skin[data-glow="1"] { box-shadow: none; }
}
`;
  document.head.appendChild(s);
}

/**
 * Render a read-only public profile card into `mount` using profile + theme_config.
 */
export function renderProfileCard(mount, profile = {}) {
  injectThemeStyles();
  if (!mount) return;

  const root = document.createElement('div');
  root.className = 'hy-profile-skin';
  root.setAttribute('data-role', 'profile-skin');

  const name = profile.display_name || profile.handle || 'Anonymous';
  const handle = profile.handle ? `@${profile.handle}` : '';
  const bio = profile.bio || '';
  const links = Array.isArray(profile.links) ? profile.links : [];
  const avatar = profile.avatar_url
    ? `<img class="hy-profile-avatar" src="${escapeAttr(profile.avatar_url)}" alt="">`
    : `<div class="hy-profile-avatar" aria-hidden="true"></div>`;

  const linkHtml = links
    .map((l) => {
      const url = typeof l === 'string' ? l : l.url;
      const label = typeof l === 'string' ? url : l.label || l.url;
      if (!url) return '';
      return `<a href="${escapeAttr(url)}" target="_blank" rel="noopener">${escapeHtml(label)}</a>`;
    })
    .join('');

  root.innerHTML = `
    <div class="hy-profile-surface" style="display:grid;grid-template-columns:72px 1fr;gap:0.9rem;align-items:start">
      ${avatar}
      <div>
        <div class="hy-profile-name">${escapeHtml(name)}</div>
        ${handle ? `<div class="hy-profile-handle">${escapeHtml(handle)}</div>` : ''}
        ${bio ? `<p class="hy-profile-bio">${escapeHtml(bio)}</p>` : ''}
        ${linkHtml ? `<div style="margin-top:0.55rem">${linkHtml}</div>` : ''}
        ${profile.theme_config?.themeName ? `<span class="hy-profile-badge">${escapeHtml(profile.theme_config.themeName)}</span>` : ''}
      </div>
    </div>
  `;

  applyThemeConfig(root, profile.theme_config);
  mount.innerHTML = '';
  mount.appendChild(root);
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
function escapeAttr(s) {
  return escapeHtml(s).replace(/'/g, '&#39;');
}
