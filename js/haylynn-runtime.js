/**
 * Haylynn Runtime — applies validated actions & keeps WORLD.state truthful.
 *
 * Security: applyAction is locked by default. A local director must call
 * unlockDirector() once per tab session (sessionStorage). Public visitors
 * cannot mutate the page via the console without that unlock.
 * Later: replace unlock with server-signed actions.
 */

import { WORLD, validateAction } from './haylynn-world.js';
import { CONTENT } from './haylynn-content.js';

// Session key deliberately non-descriptive (Kaviru root, not "director").
const DIRECTOR_SESSION_KEY = 'kaviru-nemi';

export function isDirectorUnlocked() {
  try {
    return sessionStorage.getItem(DIRECTOR_SESSION_KEY) === 'veeka';
  } catch (_) {
    return false;
  }
}

/**
 * Open a control session for this tab.
 * Call as Haylynn.koru('veeka') — token must be the epistemic marker veeka.
 * Obscurity only; not real authentication.
 */
export function unlockDirector(token) {
  if (token !== 'veeka') {
    return { success: false, error: 'nema' };
  }
  try {
    sessionStorage.setItem(DIRECTOR_SESSION_KEY, 'veeka');
    return { success: true, marker: 'veeka' };
  } catch (_) {
    return { success: false, error: 'sessionStorage unavailable' };
  }
}

export function lockDirector() {
  try {
    sessionStorage.removeItem(DIRECTOR_SESSION_KEY);
  } catch (_) {}
  return { success: true };
}

function getScroller() {
  return document.getElementById('scroller');
}

function getSectionEl(sectionId) {
  const all = [...document.querySelectorAll(`.section[data-id="${sectionId}"]`)];
  return all.find(el => {
    const key = Number(el.dataset.key);
    return key > 0 && key <= WORLD.sections.length;
  }) || all[0];
}

function vh() {
  return getScroller().clientHeight;
}

function realIndexOf(sectionId) {
  return WORLD.sections.findIndex(s => s.id === sectionId);
}

/**
 * Apply a single validated action.
 * Rejected while director session is locked (default for public visitors).
 */
export function applyAction(rawAction) {
  if (!isDirectorUnlocked()) {
    console.warn('[Haylynn] action blocked — director locked');
    return {
      success: false,
      error: 'Director locked. Local control surface must unlock this session first.'
    };
  }

  const { ok, action, error } = validateAction(rawAction);
  if (!ok) {
    console.warn('[Haylynn] rejected action:', error, rawAction);
    return { success: false, error };
  }

  const result = { success: true, type: action.type, at: Date.now() };

  switch (action.type) {

    case 'navigate': {
      const idx = realIndexOf(action.sectionId);
      if (idx === -1) {
        return { success: false, error: `Unknown section ${action.sectionId}` };
      }
      const scroller = getScroller();
      const targetTop = vh() * (idx + 1);
      scroller.scrollTo({
        top: targetTop,
        behavior: action.smooth === false ? 'auto' : 'smooth'
      });
      WORLD.state.currentSectionId = action.sectionId;
      WORLD.state.detailOpen = false;
      result.sectionId = action.sectionId;
      break;
    }

    case 'openDetail': {
      const el = getSectionEl(action.sectionId);
      if (!el) return { success: false, error: 'Section not in DOM' };
      el.classList.add('detail-open');
      getScroller().style.overflowY = 'hidden';
      WORLD.state.detailOpen = true;
      WORLD.state.currentSectionId = action.sectionId;
      result.sectionId = action.sectionId;
      break;
    }

    case 'closeDetail': {
      const el = getSectionEl(action.sectionId);
      if (!el) return { success: false, error: 'Section not in DOM' };
      el.classList.remove('detail-open');
      getScroller().style.overflowY = '';
      WORLD.state.detailOpen = false;
      result.sectionId = action.sectionId;
      break;
    }

    case 'speak': {
      let bubble = document.getElementById('haylynn-speech');
      if (!bubble) {
        bubble = document.createElement('div');
        bubble.id = 'haylynn-speech';
        bubble.style.cssText = `
          position: fixed; bottom: 3.8rem; left: 50%; transform: translateX(-50%);
          max-width: min(90vw, 420px); padding: 0.9rem 1.3rem;
          background: rgba(6,5,12,0.92); border: 1px solid rgba(236,90,160,0.4);
          border-radius: 16px; color: var(--ink); font-family: 'Cormorant Garamond', serif;
          font-size: 1.05rem; line-height: 1.45; z-index: 100;
          box-shadow: 0 0 30px rgba(236,90,160,0.25);
          opacity: 0; transition: opacity 0.35s ease;
          pointer-events: none; font-style: italic;
        `;
        document.body.appendChild(bubble);
      }
      bubble.textContent = action.text;
      bubble.style.opacity = '1';
      clearTimeout(bubble._hideTimer);
      bubble._hideTimer = setTimeout(() => {
        bubble.style.opacity = '0';
      }, 6000);
      result.text = action.text;
      break;
    }

    case 'mutate': {
      const target = document.querySelector(action.selector);
      if (!target) return { success: false, error: `Selector not found: ${action.selector}` };
      const clean = sanitizeHtml(action.html);
      const mode = action.mode || 'replace';
      if (mode === 'replace') {
        target.innerHTML = clean;
      } else if (mode === 'append') {
        target.insertAdjacentHTML('beforeend', clean);
      } else if (mode === 'prepend') {
        target.insertAdjacentHTML('afterbegin', clean);
      } else {
        return { success: false, error: `Unknown mode ${mode}` };
      }
      WORLD.state.lastMutationAt = Date.now();
      result.selector = action.selector;
      result.mode = mode;
      break;
    }

    case 'highlight': {
      const el = document.querySelector(action.selector);
      if (!el) return { success: false, error: 'Selector not found' };
      el.classList.add('haylynn-highlight');
      const duration = action.duration || 1800;
      setTimeout(() => el.classList.remove('haylynn-highlight'), duration);
      result.selector = action.selector;
      break;
    }

    case 'pulseMood': {
      const colorMap = {
        'mood-green':  'rgba(53,201,143,0.55)',
        'mood-pink':   'rgba(236,90,160,0.55)',
        'mood-purple': 'rgba(138,92,240,0.55)'
      };
      const col = colorMap[action.mood] || colorMap['mood-pink'];
      const duration = action.duration || 1800;

      // Full-screen flash overlay — impossible to miss on mobile
      let flash = document.getElementById('haylynn-pulse-flash');
      if (!flash) {
        flash = document.createElement('div');
        flash.id = 'haylynn-pulse-flash';
        flash.style.cssText = `
          position: fixed; inset: 0; z-index: 50; pointer-events: none;
          opacity: 0; transition: opacity 0.35s ease;
        `;
        document.body.appendChild(flash);
      }
      flash.style.background = `radial-gradient(ellipse at 50% 45%, ${col} 0%, transparent 70%)`;
      flash.style.opacity = '1';

      // Also boost the aurora wash hard
      const wash = document.querySelector('.aurora-wash');
      if (wash) {
        wash.style.transition = 'opacity 0.35s ease, filter 0.35s ease';
        wash.style.opacity = '0.9';
        wash.style.filter = `blur(50px) drop-shadow(0 0 100px ${col})`;
      }

      setTimeout(() => {
        flash.style.opacity = '0';
        if (wash) {
          wash.style.opacity = '';
          wash.style.filter = '';
        }
      }, duration);

      result.mood = action.mood;
      break;
    }

    case 'reset': {
      // Restore original html + detail for one section or all
      const targets = action.sectionId
        ? CONTENT.filter(s => s.id === action.sectionId)
        : CONTENT;

      if (targets.length === 0) {
        return { success: false, error: `Unknown section ${action.sectionId}` };
      }

      targets.forEach(original => {
        // Update every DOM instance (real + clones)
        document.querySelectorAll(`.section[data-id="${original.id}"]`).forEach(sectionEl => {
          const contentEl = sectionEl.querySelector('.content');
          const detailEl  = sectionEl.querySelector('.detail');
          if (contentEl) {
            // Keep the eyebrow, replace the rest
            const eyebrow = contentEl.querySelector('.eyebrow');
            contentEl.innerHTML = '';
            if (eyebrow) contentEl.appendChild(eyebrow);
            contentEl.insertAdjacentHTML('beforeend', original.html);
          }
          if (detailEl) {
            // Keep close button + eyebrow, replace the rest
            const closeBtn = detailEl.querySelector('.detail-close');
            const detailEyebrow = detailEl.querySelector('.eyebrow');
            detailEl.innerHTML = '';
            if (closeBtn) detailEl.appendChild(closeBtn);
            if (detailEyebrow) detailEl.appendChild(detailEyebrow);
            detailEl.insertAdjacentHTML('beforeend', original.detail);
          }
        });
      });

      WORLD.state.lastMutationAt = null;
      result.sectionId = action.sectionId || 'all';
      break;
    }

    default:
      return { success: false, error: `Unhandled type ${action.type}` };
  }

  window.dispatchEvent(new CustomEvent('haylynn:action', { detail: result }));
  return result;
}

function sanitizeHtml(html) {
  const template = document.createElement('template');
  template.innerHTML = String(html || '');
  template.content.querySelectorAll(
    'script, iframe, object, embed, link, meta, base, form, input, button, textarea, select'
  ).forEach(n => n.remove());
  template.content.querySelectorAll('*').forEach(el => {
    [...el.attributes].forEach(attr => {
      const name = attr.name.toLowerCase();
      const val = (attr.value || '').trim();
      if (name.startsWith('on') || name === 'srcdoc' || name === 'xlink:href') {
        el.removeAttribute(attr.name);
        return;
      }
      if ((name === 'href' || name === 'src') && /^javascript:/i.test(val)) {
        el.removeAttribute(attr.name);
      }
    });
  });
  return template.innerHTML;
}

/**
 * Keep WORLD.state in sync with the live scroller / detail panels.
 */
export function startStateSync() {
  const scroller = getScroller();
  if (!scroller) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.dataset.id;
      if (id && WORLD.sections.some(s => s.id === id)) {
        WORLD.state.currentSectionId = id;
      }
    });
  }, { root: scroller, threshold: 0.6 });

  document.querySelectorAll('.section[data-id]').forEach(el => observer.observe(el));

  const detailObserver = new MutationObserver(() => {
    WORLD.state.detailOpen = !!document.querySelector('.section.detail-open');
  });
  detailObserver.observe(scroller, {
    attributes: true,
    subtree: true,
    attributeFilter: ['class']
  });
}

// Inject highlight style once
(function injectHighlightStyle() {
  if (document.getElementById('haylynn-runtime-style')) return;
  const style = document.createElement('style');
  style.id = 'haylynn-runtime-style';
  style.textContent = `
    .haylynn-highlight {
      outline: 2px solid var(--pink) !important;
      outline-offset: 4px;
      box-shadow: 0 0 24px var(--pink-glow) !important;
      transition: outline 0.3s ease, box-shadow 0.3s ease;
    }
  `;
  document.head.appendChild(style);
})();
