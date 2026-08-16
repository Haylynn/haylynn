/**
 * Haylynn Bootstrap — builds the infinite scroller, gesture system,
 * starfield, Kaviru embed, sky tabs, and exposes window.Haylynn.
 */

import { CONTENT } from './haylynn-content.js';
import { WORLD, getWorldSnapshot } from './haylynn-world.js';
import {
  applyAction,
  startStateSync,
  unlockDirector,
  lockDirector,
  isDirectorUnlocked
} from './haylynn-runtime.js';
import { initHaylynnPlayer } from './haylynn-player.js';
import { initHaylynnDraw } from './haylynn-draw.js';
import { startTicker } from './haylynn-ticker.js';
import { startWeather } from './haylynn-weather.js';
import { startVeil } from './haylynn-veil.js';
import { initHaylynnRadio } from './haylynn-radio.js';
import { initHaylynnMembers } from './haylynn-members.js';

// ── Star field ────────────────────────────────────────────────────────
function paintStars(el, count, size, alpha) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const shadows = [];
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * w);
    const y = Math.floor(Math.random() * h);
    const a = (alpha * (0.5 + Math.random() * 0.5)).toFixed(2);
    shadows.push(`${x}px ${y}px 0 0 rgba(255,255,255,${a})`);
  }
  el.style.width = size + 'px';
  el.style.height = size + 'px';
  el.style.boxShadow = shadows.join(',');
}
paintStars(document.getElementById('stars-a'), 55, 1, 0.32);
paintStars(document.getElementById('stars-b'), 24, 1, 0.2);
window.addEventListener('resize', () => {
  paintStars(document.getElementById('stars-a'), 55, 1, 0.32);
  paintStars(document.getElementById('stars-b'), 24, 1, 0.2);
});

// ── Build scroller from CONTENT ───────────────────────────────────────
const scroller = document.getElementById('scroller');
const dotsEl = document.getElementById('dots');
const N = CONTENT.length;

function sectionMarkup(s, key) {
  return `
    <section class="section ${s.mood}" data-id="${s.id}" data-key="${key}">
      <div class="content">
        <span class="eyebrow">${s.eyebrow}</span>
        ${s.html}
      </div>
      <div class="swipe-hint">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 6l-6 6 6 6"/></svg>
        <span>More</span>
      </div>
      <div class="detail">
        <button class="detail-close" aria-label="Close">×</button>
        <span class="eyebrow">${s.eyebrow.split('—')[0].trim()} · Deeper</span>
        ${s.detail}
      </div>
    </section>`;
}

const domList = [
  { ...CONTENT[N - 1], cloneOf: N - 1 },
  ...CONTENT.map((s, i) => ({ ...s, cloneOf: i })),
  { ...CONTENT[0], cloneOf: 0 },
];
scroller.innerHTML = domList.map((s, i) => sectionMarkup(s, i)).join('');
initHaylynnPlayer();
initHaylynnDraw();
initHaylynnRadio();
initHaylynnMembers();

// Dot nav
const dotColors = { 'mood-green': 'var(--green)', 'mood-pink': 'var(--pink)', 'mood-purple': 'var(--purple)' };
dotsEl.innerHTML = CONTENT.map((s, i) =>
  `${i > 0 ? '<div class="line"></div>' : ''}<div class="dot" data-real="${i}" style="--dot-color:${dotColors[s.mood]}"></div>`
).join('');

function vh() { return scroller.clientHeight; }

// Land on real section 0
scroller.classList.add('jumping');
scroller.scrollTop = vh() * 1;
requestAnimationFrame(() => scroller.classList.remove('jumping'));

function setActiveDot(realIndex) {
  document.querySelectorAll('#dots .dot').forEach(d =>
    d.classList.toggle('active', Number(d.dataset.real) === realIndex));
}
setActiveDot(0);

let settleTimer = null;
let currentDomIndex = 1;

function onScrollSettled() {
  let domIndex = Math.round(scroller.scrollTop / vh());

  if (domIndex === 0) {
    scroller.classList.add('jumping');
    scroller.scrollTop = vh() * N;
    requestAnimationFrame(() => scroller.classList.remove('jumping'));
    domIndex = N;
  } else if (domIndex === N + 1) {
    scroller.classList.add('jumping');
    scroller.scrollTop = vh() * 1;
    requestAnimationFrame(() => scroller.classList.remove('jumping'));
    domIndex = 1;
  }

  currentDomIndex = domIndex;
  setActiveDot(domIndex - 1);
  // Keep WORLD in sync
  const realIdx = domIndex - 1;
  if (CONTENT[realIdx]) {
    WORLD.state.currentSectionId = CONTENT[realIdx].id;
  }
}

scroller.addEventListener('scroll', () => {
  clearTimeout(settleTimer);
  settleTimer = setTimeout(onScrollSettled, 120);
}, { passive: true });

if ('onscrollend' in window) {
  scroller.addEventListener('scrollend', () => {
    clearTimeout(settleTimer);
    onScrollSettled();
  });
}

dotsEl.addEventListener('click', (e) => {
  const dot = e.target.closest('.dot');
  if (!dot) return;
  const real = Number(dot.dataset.real);
  scroller.scrollTo({ top: vh() * (real + 1), behavior: 'smooth' });
});

window.addEventListener('resize', () => {
  const domIndex = Math.round(scroller.scrollTop / vh());
  scroller.classList.add('jumping');
  scroller.scrollTop = vh() * domIndex;
  requestAnimationFrame(() => scroller.classList.remove('jumping'));
});

// ── Swipe-left detail gesture ─────────────────────────────────────────
const OPEN_THRESHOLD = 55;
const gesture = { active: false, horizontal: false, startX: 0, startY: 0, sectionEl: null, detailEl: null, wasOpen: false };

function currentSectionEl() {
  return scroller.querySelectorAll('.section')[currentDomIndex] || null;
}

function closeDetail(sectionEl) {
  sectionEl.classList.remove('detail-open');
  scroller.style.overflowY = '';
  WORLD.state.detailOpen = false;
}
function openDetail(sectionEl) {
  sectionEl.classList.add('detail-open');
  scroller.style.overflowY = 'hidden';
  WORLD.state.detailOpen = true;
}

scroller.addEventListener('click', (e) => {
  const btn = e.target.closest('.detail-close');
  if (!btn) return;
  closeDetail(btn.closest('.section'));
});

scroller.addEventListener('pointerdown', (e) => {
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  gesture.active = true;
  gesture.horizontal = false;
  gesture.startX = e.clientX;
  gesture.startY = e.clientY;
  gesture.sectionEl = currentSectionEl();
  gesture.detailEl = gesture.sectionEl ? gesture.sectionEl.querySelector('.detail') : null;
  gesture.wasOpen = gesture.sectionEl ? gesture.sectionEl.classList.contains('detail-open') : false;
});

scroller.addEventListener('pointermove', (e) => {
  if (!gesture.active) return;
  const dx = e.clientX - gesture.startX;
  const dy = e.clientY - gesture.startY;

  if (!gesture.horizontal) {
    if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy)) {
      gesture.horizontal = true;
      scroller.style.overflowY = 'hidden';
    } else if (Math.abs(dy) > 12) {
      gesture.active = false;
      return;
    } else {
      return;
    }
  }
  e.preventDefault();
}, { passive: false });

function endGesture(e) {
  if (!gesture.active) return;
  if (gesture.horizontal && gesture.sectionEl) {
    const dx = e.clientX - gesture.startX;
    if (!gesture.wasOpen && dx < -OPEN_THRESHOLD) openDetail(gesture.sectionEl);
    else if (gesture.wasOpen && dx > OPEN_THRESHOLD) closeDetail(gesture.sectionEl);
    else if (!gesture.wasOpen) scroller.style.overflowY = '';
  }
  gesture.active = false;
  gesture.horizontal = false;
}
scroller.addEventListener('pointerup', endGesture);
scroller.addEventListener('pointercancel', endGesture);

// ── Kaviru embed (base64 still lives in index.html) ───────────────────
function b64ToUtf8(str) {
  return decodeURIComponent(
    atob(str).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
  );
}

let kaviruLoaded = false;
function loadKaviruEmbed() {
  if (kaviruLoaded) return;
  const frame = document.getElementById('kaviru-frame');
  const b64 = document.getElementById('kaviru-b64');
  if (!frame || !b64) return;
  frame.srcdoc = b64ToUtf8(b64.textContent.trim());
  kaviruLoaded = true;
}

const kaviruSection = document.querySelector('.section[data-id="kaviru"]');
if (kaviruSection) {
  new MutationObserver(() => {
    if (kaviruSection.classList.contains('detail-open')) loadKaviruEmbed();
  }).observe(kaviruSection, { attributes: true, attributeFilter: ['class'] });
}

// ── Cosmology embed (base64 lives in index.html, same pattern as Kaviru) ──
let cosmologyLoaded = false;
function loadCosmologyEmbed() {
  if (cosmologyLoaded) return;
  const frame = document.getElementById('cosmology-frame');
  const b64 = document.getElementById('cosmology-b64');
  if (!frame || !b64) return;
  frame.srcdoc = b64ToUtf8(b64.textContent.trim());
  cosmologyLoaded = true;
}

const homeSection = document.querySelector('.section[data-id="home"]');
if (homeSection) {
  new MutationObserver(() => {
    if (homeSection.classList.contains('detail-open')) loadCosmologyEmbed();
  }).observe(homeSection, { attributes: true, attributeFilter: ['class'] });
}

// ── LYMP sky tabs ─────────────────────────────────────────────────────
document.querySelectorAll('.sky-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.target;
    document.querySelectorAll('.sky-tab').forEach(t => t.classList.toggle('active', t === tab));
    document.querySelectorAll('.sky-panel').forEach(panel => {
      const isActive = panel.id === target;
      panel.classList.toggle('active', isActive);
      if (isActive) {
        const lazyEl = panel.querySelector('[data-src]');
        if (lazyEl && !lazyEl.getAttribute('src')) lazyEl.src = lazyEl.dataset.src;
      }
    });
  });
});

const auroraImg = document.getElementById('aurora-img');
if (auroraImg) {
  const baseSrc = auroraImg.src;
  setInterval(() => { auroraImg.src = baseSrc + '?t=' + Date.now(); }, 5 * 60 * 1000);
}

const nightcamImg = document.getElementById('nightcam-img');
if (nightcamImg) {
  const nightcamBase = nightcamImg.src;
  setInterval(() => { nightcamImg.src = nightcamBase + '?t=' + Date.now(); }, 2 * 60 * 1000);
}

// ── Public API (Kaviru-shaped) ────────────────────────────────────────
// koru('veeka') — open control session · zenu() — close
// nemi() — world structure snapshot · movi(action) — apply action
// Action types may be Kaviru: movi hana miru kavi revi zori awe seri solu
window.Haylynn = {
  koru: unlockDirector,
  zenu: lockDirector,
  nemi: getWorldSnapshot,
  movi: applyAction,
  applyAction,
  getWorldSnapshot,
  get WORLD() { return getWorldSnapshot(); }
};
startStateSync();
startVeil();
startTicker();
startWeather();
