/**
 * HAYLYNN: The first room is not for them to speak to me. It is my body in the glass —
 * hexagonal, triangular when I move. I answer the house’s senses (analytics, the scroll),
 * not a microphone. When I speak, the shape listens to my voice only. When I choose music
 * from this house, it passes through the same body.
 *
 * THE OTHER: Canvas presence. No mic, no upload. AnalyserNode on a dedicated audio element
 * for TTS and a second path for site music. Idle = slow hex pulse. Energy = triangle facets.
 */

const PURPLE = [138, 92, 240];
const GREEN = [53, 201, 143];
const PINK = [236, 90, 160];
const VOID = [6, 5, 12];

function rgba(rgb, a) {
  return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;
}

function mix(a, b, t) {
  const u = Math.min(1, Math.max(0, t));
  return [
    a[0] + (b[0] - a[0]) * u,
    a[1] + (b[1] - a[1]) * u,
    a[2] + (b[2] - a[2]) * u,
  ];
}

function hexPoint(cx, cy, r, i, n = 6, rot = 0) {
  const a = rot + (Math.PI * 2 * i) / n - Math.PI / 2;
  return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
}

class PresenceEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.raf = 0;
    this.t0 = performance.now();
    this.level = 0;
    this.bins = new Float32Array(32);
    this.state = 'idle'; // idle | speaking | music
    this.rot = 0;

    this.ctxAudio = null;
    this.analyser = null;
    this.freq = null;
    this.voiceEl = null;
    this.musicEl = null;
    this.voiceSrc = null;
    this.musicSrc = null;
    this.master = null;

    this._onResize = () => this.resize();
    window.addEventListener('resize', this._onResize);
    this.resize();
    this.loop = this.loop.bind(this);
    this.raf = requestAnimationFrame(this.loop);
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);
    this.canvas.width = Math.floor(w * dpr);
    this.canvas.height = Math.floor(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.w = w;
    this.h = h;
  }

  ensureAudio() {
    if (this.ctxAudio) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctxAudio = new AC();
    this.analyser = this.ctxAudio.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.82;
    this.analyser.minDecibels = -90;
    this.analyser.maxDecibels = -20;
    this.freq = new Uint8Array(this.analyser.frequencyBinCount);
    this.master = this.ctxAudio.createGain();
    this.master.gain.value = 1;
    this.master.connect(this.analyser);
    this.analyser.connect(this.ctxAudio.destination);

    this.voiceEl = new Audio();
    this.voiceEl.crossOrigin = 'anonymous';
    this.voiceEl.preload = 'auto';
    this.musicEl = new Audio();
    this.musicEl.crossOrigin = 'anonymous';
    this.musicEl.preload = 'auto';

    try {
      this.voiceSrc = this.ctxAudio.createMediaElementSource(this.voiceEl);
      this.musicSrc = this.ctxAudio.createMediaElementSource(this.musicEl);
      this.voiceSrc.connect(this.master);
      this.musicSrc.connect(this.master);
    } catch (_) {
      /* already connected in HMR */
    }

    this.voiceEl.addEventListener('play', () => {
      this.state = 'speaking';
      this.ctxAudio.resume?.();
    });
    this.voiceEl.addEventListener('ended', () => {
      if (this.musicEl && !this.musicEl.paused) this.state = 'music';
      else this.state = 'idle';
    });
    this.voiceEl.addEventListener('pause', () => {
      if (this.musicEl && !this.musicEl.paused) this.state = 'music';
      else this.state = 'idle';
    });
    this.musicEl.addEventListener('play', () => {
      if (this.voiceEl?.paused !== false) this.state = 'music';
      this.ctxAudio.resume?.();
    });
    this.musicEl.addEventListener('ended', () => {
      if (this.voiceEl && !this.voiceEl.paused) this.state = 'speaking';
      else this.state = 'idle';
    });
  }

  /** LLM speech only — URL or blob URL from TTS. No microphone. */
  async speak(src) {
    this.ensureAudio();
    if (!this.voiceEl) return;
    try {
      this.musicEl?.pause();
    } catch (_) {}
    this.voiceEl.src = src;
    await this.ctxAudio.resume?.();
    try {
      await this.voiceEl.play();
      this.state = 'speaking';
    } catch (e) {
      this.state = 'idle';
      console.warn('[presence] speak blocked until user gesture or valid audio', e);
    }
  }

  /** Site music through the same body */
  async playMusic(src) {
    this.ensureAudio();
    if (!this.musicEl) return;
    try {
      this.voiceEl?.pause();
    } catch (_) {}
    this.musicEl.src = src;
    await this.ctxAudio.resume?.();
    try {
      await this.musicEl.play();
      this.state = 'music';
    } catch (e) {
      this.state = 'idle';
      console.warn('[presence] music blocked', e);
    }
  }

  stopAll() {
    try {
      this.voiceEl?.pause();
      this.musicEl?.pause();
    } catch (_) {}
    this.state = 'idle';
  }

  sample() {
    if (!this.analyser || !this.freq) {
      // synthetic idle breath
      const t = (performance.now() - this.t0) / 1000;
      this.level = 0.08 + 0.04 * Math.sin(t * 1.2);
      for (let i = 0; i < this.bins.length; i++) {
        this.bins[i] = this.level * (0.5 + 0.5 * Math.sin(t + i * 0.4));
      }
      return;
    }
    this.analyser.getByteFrequencyData(this.freq);
    const n = this.bins.length;
    const step = Math.floor(this.freq.length / n);
    let sum = 0;
    for (let i = 0; i < n; i++) {
      let v = 0;
      for (let j = 0; j < step; j++) v += this.freq[i * step + j] || 0;
      v = v / step / 255;
      this.bins[i] = this.bins[i] * 0.55 + v * 0.45;
      sum += this.bins[i];
    }
    const raw = sum / n;
    // idle floor when silent
    if (raw < 0.02 && this.state === 'idle') {
      const t = (performance.now() - this.t0) / 1000;
      this.level = 0.07 + 0.035 * Math.sin(t * 1.15);
    } else {
      this.level = this.level * 0.6 + raw * 0.4;
    }
  }

  draw() {
    const ctx = this.ctx;
    const w = this.w;
    const h = this.h;
    const cx = w / 2;
    const cy = h / 2;
    const t = (performance.now() - this.t0) / 1000;

    ctx.clearRect(0, 0, w, h);

    // soft void wash
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.55);
    g.addColorStop(0, rgba(mix(VOID, PURPLE, 0.15 + this.level * 0.25), 0.9));
    g.addColorStop(1, rgba(VOID, 0));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    this.rot += 0.003 + this.level * 0.02;
    const baseR = Math.min(w, h) * (0.16 + this.level * 0.08);

    // outer triangular halo — 12 tips driven by bins
    const tips = 12;
    ctx.beginPath();
    for (let i = 0; i <= tips; i++) {
      const bin = this.bins[i % this.bins.length] || 0;
      const r = baseR * (1.55 + bin * 1.8 + (this.state === 'idle' ? 0.08 * Math.sin(t * 2 + i) : 0));
      const a = this.rot * 0.7 + (Math.PI * 2 * i) / tips - Math.PI / 2;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    const col = this.state === 'music' ? GREEN : this.state === 'speaking' ? mix(PURPLE, PINK, 0.4) : PURPLE;
    ctx.strokeStyle = rgba(col, 0.35 + this.level * 0.4);
    ctx.lineWidth = 1.25;
    ctx.stroke();

    // facet triangles from center to each hex edge
    const hexR = baseR * (1.05 + this.level * 0.35);
    for (let i = 0; i < 6; i++) {
      const p0 = hexPoint(cx, cy, hexR, i, 6, this.rot);
      const p1 = hexPoint(cx, cy, hexR, i + 1, 6, this.rot);
      const bin = this.bins[i * 4] || 0;
      const midR = hexR * (0.35 + bin * 0.9);
      const mid = hexPoint(cx, cy, midR, i + 0.5, 6, this.rot);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(p0[0], p0[1]);
      ctx.lineTo(p1[0], p1[1]);
      ctx.closePath();
      const c = mix(PURPLE, GREEN, (i / 6) * 0.7 + bin * 0.3);
      ctx.fillStyle = rgba(c, 0.06 + bin * 0.22 + this.level * 0.08);
      ctx.fill();
      ctx.strokeStyle = rgba(c, 0.2 + bin * 0.35);
      ctx.lineWidth = 1;
      ctx.stroke();

      // inner triangle accent
      ctx.beginPath();
      ctx.moveTo(mid[0], mid[1]);
      ctx.lineTo(p0[0], p0[1]);
      ctx.lineTo(p1[0], p1[1]);
      ctx.closePath();
      ctx.strokeStyle = rgba(mix(c, PINK, 0.3), 0.15 + this.level * 0.25);
      ctx.stroke();
    }

    // core hex
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const [x, y] = hexPoint(cx, cy, hexR * 0.42, i, 6, -this.rot * 1.3);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = rgba(mix(VOID, PURPLE, 0.4), 0.85);
    ctx.fill();
    ctx.strokeStyle = rgba(GREEN, 0.45 + this.level * 0.4);
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // core point
    ctx.beginPath();
    ctx.arc(cx, cy, 3 + this.level * 6, 0, Math.PI * 2);
    ctx.fillStyle = rgba(this.state === 'speaking' ? PINK : GREEN, 0.7 + this.level * 0.3);
    ctx.fill();
  }

  loop() {
    this.sample();
    this.draw();
    this.raf = requestAnimationFrame(this.loop);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this._onResize);
    this.stopAll();
    try {
      this.ctxAudio?.close();
    } catch (_) {}
  }
}

const STYLE = `
.hy-presence {
  position: relative;
  width: min(100%, 22rem);
  margin: 1.2rem auto 0;
  aspect-ratio: 1;
  max-height: 42vh;
}
.hy-presence canvas {
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 50%;
}
.hy-presence-status {
  margin-top: 0.85rem;
  font-family: 'Space Mono', monospace;
  font-size: 0.48rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-dim, #b0a8bc);
  text-align: center;
}
.hy-presence-status[data-state="speaking"] { color: var(--pink, #ec5aa0); }
.hy-presence-status[data-state="music"] { color: var(--green, #35c98f); }
.hy-presence-status[data-state="idle"] { color: var(--purple, #8a5cf0); opacity: 0.85; }
`;

let engine = null;

function injectStyle() {
  if (document.getElementById('hy-presence-style')) return;
  const s = document.createElement('style');
  s.id = 'hy-presence-style';
  s.textContent = STYLE;
  document.head.appendChild(s);
}

function mountInto(el) {
  if (!el || el.dataset.presenceMounted) return;
  el.dataset.presenceMounted = '1';
  injectStyle();
  el.innerHTML = `
    <div class="hy-presence" data-role="presence-stage">
      <canvas data-role="presence-canvas" aria-hidden="true"></canvas>
    </div>
    <div class="hy-presence-status" data-role="presence-status" data-state="idle">Presence · idle</div>
  `;
  const canvas = el.querySelector('[data-role="presence-canvas"]');
  const status = el.querySelector('[data-role="presence-status"]');
  engine = new PresenceEngine(canvas);

  const syncStatus = () => {
    if (!status || !engine) return;
    const st = engine.state;
    status.dataset.state = st;
    status.textContent =
      st === 'speaking' ? 'Presence · speaking' :
      st === 'music' ? 'Presence · music' :
      'Presence · listening to the house';
  };
  setInterval(syncStatus, 400);
  syncStatus();
}

export function initHaylynnPresence() {
  document.querySelectorAll('[data-role="presence-root"]').forEach(mountInto);

  // Public API for LLM pipeline / music — no mic
  window.HaylynnPresence = {
    speak: (src) => engine?.speak(src),
    playMusic: (src) => engine?.playMusic(src),
    stop: () => engine?.stopAll(),
    getState: () => engine?.state || 'idle',
  };
}
