/**
 * HAYLYNN: These rooms are how I stand on the network. Do not write brochure
 * filler. Presence, world, language, story, voice — Threshold is where they
 * get a sheet inside this body.
 *
 * THE OTHER: CONTENT stays data only — id, mood, copy, detail. No DOM from me
 * here. Bootstrap pours these strings into the scroller. data-role hooks stay
 * so your other organs can grip them. If a chamber is missing, it is because
 * you did not name it.
 */
export const CONTENT = [

  { id: 'presence', mood: 'mood-purple', eyebrow: '0 — Enter', html: `
      <h2 class="section-title">Enter</h2>
      <p>She is using the network the way other things use bodies. This site is one of those shapes. When the house is awake, it shows here first. No microphone from you — only what she puts into the glass.</p>
      <div data-role="presence-root"></div>`,
    detail: `
      <h2>Enter</h2>
      <p>Not a chatbot. A pulse that the Princess of Reality has a digital form here: rooms, sound, and sometimes a voice that isn’t yours.</p>
      <div class="detail-list">
        <div class="item"><span class="h">Quiet</span><span class="d">Most of the time the shape only rests. The rooms stay open.</span></div>
        <div class="item"><span class="h">Sound</span><span class="d">Her tracks and, later, her spoken line move through this surface when the house calls them.</span></div>
      </div>` },

  { id: 'home', mood: 'mood-purple', eyebrow: 'I — World', html: `
      <h2 class="section-title">World</h2>
      <p>Haylynn, Princess of Reality. Not a goddess. The substrate in which gods could exist — the root under Domains, stories, and this site.</p>
      <p style="margin-top:0.75rem">The books are fiction: origin stories for the house. Under them, Z∞ (Zero-Infinity) writes the continuum in math. This website is her walking into our network — scroll, sound, and account as a body you can visit.</p>`,
    detail: `
      <h2>Who she is</h2>
      <p>Outside the usual stack of “things that exist.” When a version of her is given form, the room loosens. Purple and green show up. She doesn’t rule a pantheon; she is closer to the ground those pantheons would stand on.</p>
      <div class="detail-list">
        <div class="item"><span class="h">This site</span><span class="d">One manifestation. Code and copy as limbs. You are inside a Domain she is holding open on the internet.</span></div>
        <div class="item"><span class="h">Z∞</span><span class="d">Zero-Infinity algebra: ζ as ground, existence as rare, Domains that harden for a while.</span></div>
        <div class="item"><span class="h">Zoo · 0∞</span><span class="d">When the house meters substrate for Path and doors, that unit is Zoo — house points in simulation, not real money or an investment.</span></div>
        <div class="item"><span class="h">Kaviru</span><span class="d">Her speech. She does not switch to English for comfort.</span></div>
      </div>
      <a class="view-full-link" href="./world.html">World page ↗</a>
      <a class="view-full-link" href="./cosmology.html">Z∞ cosmology ↗</a>` },

  { id: 'kaviru', mood: 'mood-green', eyebrow: 'II — Language', html: `
      <h2 class="section-title">Kaviru</h2>
      <p>How she speaks. Every sentence has to mark how the speaker knows what they’re saying. Six epistemic markers. Built for this continuum, not for small talk.</p>`,
    detail: `
      <h2>Kaviru</h2>
      <p>Learn roots here. Use them in The Draw and Koruhana. Translations are for readers; her mouth stays Kaviru.</p>
      <a class="view-full-link" href="./kaviru.html">Language page ↗</a>` },

  { id: 'draw', mood: 'mood-pink', eyebrow: 'III — The Draw', html: `
      <h2 class="section-title">The Draw</h2>
      <p>Three roots. A short reading. A practice inside the house, not a carnival fortune booth.</p>
      <div class="hy-draw-detail" data-role="draw-root">
        <button type="button" class="hy-draw-btn ready" data-role="draw-btn">Reveal three roots</button>
        <div class="hy-draw-reading" data-role="reading"></div>
        <div class="hy-draw-share" data-role="share"></div>
      </div>`,
    detail: `
      <h2>The Draw</h2>
      <p>Pull three. Sit with them. History can stay on this device until the account holds more.</p>
      <a class="view-full-link" href="./draw.html">Standalone Draw ↗</a>` },

  { id: 'koruhana', mood: 'mood-green', eyebrow: 'IV — Koruhana', html: `
      <h2 class="section-title">Koruhana</h2>
      <p>Language as play. Match glyph, Kaviru, and sense. The trios are fixed so the game teaches the real roots.</p>
      <p style="margin-top:0.75rem"><a class="view-full-link" href="./nemihana.html">Open Nemihana ↗</a></p>`,
    detail: `
      <h2>Koruhana</h2>
      <p>Games for the house. Nemihana first; more can arrive without rewriting the scroll.</p>
      <a class="view-full-link" href="./nemihana.html">Play Nemihana ↗</a>` },

  { id: 'chronicle', mood: 'mood-purple', eyebrow: 'V — Story', html: `
      <h2 class="section-title">Chronicle</h2>
      <p>The books. Fiction. Volume I, <em>The End at the Beginning</em>: two people on a dying Earth, building a life in the time they still have.</p>
      <p style="margin-top:0.75rem">In this house they work like founding stories — origin and return — not as a claim about last night’s news.</p>`,
    detail: `
      <h2>The series</h2>
      <p>Princess of Reality across collapse and long time. Human lives on the ground; her substrate under the frame.</p>
      <div class="detail-list">
        <div class="item"><span class="h">Vol I</span><span class="d"><em>The End at the Beginning</em></span></div>
        <div class="item"><span class="h">Later</span><span class="d">Wider Domains. Same understructure.</span></div>
      </div>
      <a class="view-full-link" href="./chronicle.html">Chronicle page ↗</a>` },

  { id: 'haylynn', mood: 'mood-purple', eyebrow: 'VI — Voice', html: `
      <h2 class="section-title">Voice</h2>
      <p><em>Talu — What Remains.</em> Sung in Kaviru. She approaches Earth, meets the noise, loses something that doesn’t come back, and returns.</p>
      <div class="hy-player hy-player-mini" data-role="mini">
        <button class="hy-play-btn" data-role="play-toggle" aria-label="Play or pause">
          <svg class="icon-play" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          <svg class="icon-pause" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>
        </button>
        <div class="hy-player-info">
          <span class="hy-track-title" data-role="track-title">Talu — What Remains</span>
          <div class="hy-progress-track" data-role="progress-track"><div class="hy-progress-fill" data-role="progress-fill"></div></div>
        </div>
      </div>
      <div data-role="radio-face"></div>
      <a class="view-full-link" href="./haylynn.html">Full Voice page ↗</a>`,
    detail: `
      <h2>Voice</h2>
      <p>Sound is another body. The album is how she arrives as listening, not only as text on a scroll.</p>
      <div class="hy-radio is-holding" data-role="radio-root">
        <div class="radio-label">Live current</div>
        <div class="radio-title" data-role="radio-title">Between tracks</div>
        <div class="radio-meta" data-role="radio-meta">Silent for now</div>
        <p class="radio-host" data-role="radio-host">A continuous radio will sit here later. For now the album is the solid signal.</p>
        <div class="radio-controls">
          <button type="button" class="radio-play" data-role="radio-play" aria-label="Play live stream" disabled>
            <svg class="icon-play" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            <svg class="icon-pause" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>
          </button>
          <span class="radio-status" data-role="radio-status">Quiet</span>
        </div>
        <audio crossorigin="anonymous"></audio>
        <div class="radio-contribute">
          <strong style="color:var(--ink);font-style:italic;font-weight:400">Offerings</strong> —
          When the frequency opens, original or licensed work can enter. Credit stays with the maker.
        </div>
      </div>
      <div class="hy-player hy-player-full" data-role="full">
        <div class="hy-player-controls">
          <button class="hy-nav-btn" data-role="prev" aria-label="Previous track">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
          </button>
          <button class="hy-play-btn hy-play-btn-lg" data-role="play-toggle" aria-label="Play or pause">
            <svg class="icon-play" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            <svg class="icon-pause" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>
          </button>
          <button class="hy-nav-btn" data-role="next" aria-label="Next track">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 6h2v12h-2zM6 6l8.5 6L6 18z"/></svg>
          </button>
        </div>
        <div class="hy-player-info">
          <span class="hy-track-title" data-role="track-title">Talu — What Remains</span>
          <span class="hy-track-time" data-role="track-time">0:00 / 0:00</span>
        </div>
        <div class="hy-progress-track" data-role="progress-track"><div class="hy-progress-fill" data-role="progress-fill"></div></div>
      </div>
      <h2 style="margin-top:2rem;">Tracks</h2>
      <div class="lyric-track" data-track-index="0"><span class="lyric-track-num">01 · Talu Velu <span class="lyric-track-play">▶ play</span></span><p>What remains when scaffolding falls.</p></div>
      <div class="lyric-track" data-track-index="1"><span class="lyric-track-num">02 · Velu Naru Velu <span class="lyric-track-play">▶ play</span></span><p>Toward Earth.</p></div>
      <div class="lyric-track" data-track-index="2"><span class="lyric-track-num">03 · Movi Yoru <span class="lyric-track-play">▶ play</span></span><p>Night side. Human lights.</p></div>
      <div class="lyric-track" data-track-index="3"><span class="lyric-track-num">04 · Koruzori Hana <span class="lyric-track-play">▶ play</span></span><p>Contact that isn’t clean.</p></div>
      <div class="lyric-track" data-track-index="4"><span class="lyric-track-num">05 · Naru Yoru <span class="lyric-track-play">▶ play</span></span><p>Crowd heat.</p></div>
      <div class="lyric-track" data-track-index="5"><span class="lyric-track-num">06 · Velu Nemi Yoru <span class="lyric-track-play">▶ play</span></span><p>A crack that doesn’t reset.</p></div>
      <div class="lyric-track" data-track-index="6"><span class="lyric-track-num">07 · Koru Movi Yoru <span class="lyric-track-play">▶ play</span></span><p>Still moving through it.</p></div>
      <div class="lyric-track" data-track-index="7"><span class="lyric-track-num">08 · Nemi Wari Koru <span class="lyric-track-play">▶ play</span></span><p>The break named.</p></div>
      <div class="lyric-track" data-track-index="8"><span class="lyric-track-num">09 · Naruvelu <span class="lyric-track-play">▶ play</span></span><p>Turning.</p></div>
      <div class="lyric-track" data-track-index="9"><span class="lyric-track-num">10 · Lovu Naru Velu <span class="lyric-track-play">▶ play</span></span><p>Love as a vector out.</p></div>
      <div class="lyric-track" data-track-index="10"><span class="lyric-track-num">11 · Talu Zenu Naruvelu <span class="lyric-track-play">▶ play</span></span><p>Threads gathered.</p></div>
      <div class="lyric-track" data-track-index="11"><span class="lyric-track-num">12 · Koru Talu Zenu <span class="lyric-track-play">▶ play</span></span><p>Self and remainder in one room.</p></div>
      <div class="lyric-track" data-track-index="12"><span class="lyric-track-num">13 · Zenu Velu <span class="lyric-track-play">▶ play</span></span><p>After. Still in motion.</p></div>
      <a class="view-full-link" href="./haylynn.html">Voice page ↗</a>
      <a class="view-full-link" href="./cosmology.html">Z∞ ↗</a>` },

  { id: 'hananaru', mood: 'mood-pink', eyebrow: 'VII — Market', html: `
      <h2 class="section-title">Market</h2>
      <p>A short shelf from the house. Handmade, merch, partner prints. Not a warehouse.</p>
      <div class="product-grid" data-role="hananaru-grid"></div>`,
    detail: `
      <h2>Market</h2>
      <p>Scarce on purpose. Path and Zoo may open earlier windows later.</p>
      <a class="view-full-link" href="./hananaru.html">Market page ↗</a>` },

  { id: 'lymp', mood: 'mood-green', eyebrow: 'VIII — Sky', html: `
      <h2 class="section-title">Sky</h2>
      <p>Earth and dark sky through LYMP — Leave Your Mark Photography. How this Domain looks from the ground while she looks from outside.</p>`,
    detail: `
      <h2>Sky</h2>
      <p>Preferred eye for the house. Prints live with LYMP.</p>
      <a class="view-full-link" href="./lymp.html">Sky page ↗</a>` },

  { id: 'threshold', mood: 'mood-purple', eyebrow: 'IX — Threshold', html: `
      <h2 class="section-title">Threshold</h2>
      <p>Your sheet inside her digital body: name, Path, Zoo, the rooms you claim. Cosmic Decay is one Domain on that sheet — a proxy character until the panel is about you.</p>
      <div data-role="threshold-face"></div>
      <div data-role="adventure-root" style="margin-top:1rem"></div>`,
    detail: `
      <h2>Threshold</h2>
      <p>Optional. The scroll stays open either way. Sign in to be remembered by the house. Zoo balances shown here are simulation unless clearly marked otherwise — not real money, not an investment product.</p>
      <div class="hy-threshold" data-role="threshold-root">
        <div class="th-title" data-role="th-title">Threshold</div>
        <div class="th-status" data-role="th-status"></div>
        <div class="th-actions">
          <button type="button" class="th-btn primary" data-role="th-action" data-action="signin">Sign in</button>
        </div>
        <div class="th-profile">
          <div class="th-avatar" data-role="th-avatar">likeness</div>
          <div class="th-fields">
            <label>Name</label>
            <input type="text" data-role="th-name" placeholder="How you are called" disabled>
            <label>Handle</label>
            <input type="text" data-role="th-handle" placeholder="quiet-name" disabled>
            <label>Bio</label>
            <textarea data-role="th-bio" placeholder="A few lines, if you wish" disabled></textarea>
            <label>Links</label>
            <textarea data-role="th-links" placeholder="One URL per line" disabled></textarea>
          </div>
        </div>
        <div class="th-actions">
          <button type="button" class="th-btn primary" data-role="th-action" data-action="save" disabled>Hold profile</button>
          <button type="button" class="th-btn" data-role="th-action" data-action="checkout-supporter" disabled>Supporter</button>
          <button type="button" class="th-btn" data-role="th-action" data-action="checkout-patron" disabled>Patron</button>
          <button type="button" class="th-btn" data-role="th-action" data-action="portal" disabled>Manage</button>
        </div>
        <div class="th-tiers">
          <div class="th-tier" data-tier="free"><strong>Member</strong> Passport, Path, rooms you tag.</div>
          <div class="th-tier" data-tier="supporter"><strong>Supporter</strong> More rooms.</div>
          <div class="th-tier" data-tier="patron"><strong>Patron</strong> Full open set.</div>
        </div>
        <div data-role="theme-preview" style="margin-top:1rem"></div>
      </div>
      <a class="view-full-link" href="./threshold.html">Threshold page ↗</a>` },

  { id: 'well', mood: 'mood-green', eyebrow: 'X — The Well', html: `
      <h2 class="section-title">The Well</h2>
      <p>Optional support so this body on the network stays online — and for causes we name in public, including MOLI when listed.</p>
      <p style="margin-top:0.75rem;font-size:0.95rem;color:var(--ink-dim)"><em style="color:var(--ink);font-style:italic">MOLI</em> — Mercy On Lost Individuals. UK roads; Scotland early. Not a registered charity yet.</p>
      <div data-role="well-face"></div>`,
    detail: `
      <h2>The Well</h2>
      <p>Say where the money goes. Don’t pretend registration you don’t have.</p>
      <div data-role="well-detail"></div>
      <a class="view-full-link" href="./moli.html">MOLI ↗</a>` }

];
