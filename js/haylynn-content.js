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
      <p>Windows on the Domain: all-sky, Sun, ISS track and live view, aurora, sky map — and LYMP, her preferred human photographer. Open More for the feeds.</p>
`,
    detail: `
      <h2>Sky</h2>
      <p>Live instruments and one photographer. LYMP holds the stills; the feeds are public eyes on the same void.</p>

      <div data-role="iss-tracker" class="hy-iss" style="margin:1.2rem 0 1.5rem;padding:1rem 1.05rem;border-radius:14px;border:1px solid rgba(138,92,240,0.35);background:linear-gradient(165deg,rgba(18,14,32,0.95),rgba(8,6,16,0.9));box-shadow:0 8px 28px rgba(0,0,0,0.35)">
        <div style="display:flex;justify-content:space-between;align-items:baseline;gap:0.75rem;flex-wrap:wrap">
          <div>
            <div style="font-family:Space Mono,monospace;font-size:0.5rem;letter-spacing:0.14em;text-transform:uppercase;color:#a78bfa">ISS · real-time</div>
            <div style="font-style:italic;font-size:1.15rem;margin-top:0.15rem">Station over the Domain</div>
          </div>
          <div data-role="iss-status" style="font-family:Space Mono,monospace;font-size:0.55rem;color:var(--ink-dim,#9a92a4)">Connecting…</div>
        </div>
        <div style="position:relative;margin:0.85rem 0 0.75rem;height:110px;border-radius:10px;overflow:hidden;border:1px solid rgba(255,255,255,0.06);background:radial-gradient(ellipse at 50% 60%,rgba(53,201,143,0.12),transparent 55%),linear-gradient(180deg,#0c0a14,#06050c)">
          <div style="position:absolute;inset:0;opacity:0.35;background-image:linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px);background-size:24px 24px"></div>
          <div data-role="iss-plot" style="position:absolute;width:10px;height:10px;margin:-5px 0 0 -5px;border-radius:50%;background:#35c98f;box-shadow:0 0 12px #35c98f,0 0 24px rgba(53,201,143,0.5);left:50%;top:50%;transition:left 1.2s ease,top 1.2s ease"></div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.55rem 1rem;font-family:Space Mono,monospace;font-size:0.62rem">
          <div><span style="color:var(--ink-dim,#9a92a4)">Lat</span> <span data-role="iss-lat" style="color:var(--ink,#efe9e0)">—</span></div>
          <div><span style="color:var(--ink-dim,#9a92a4)">Lon</span> <span data-role="iss-lon" style="color:var(--ink,#efe9e0)">—</span></div>
          <div><span style="color:var(--ink-dim,#9a92a4)">Alt</span> <span data-role="iss-alt" style="color:var(--ink,#efe9e0)">—</span></div>
          <div><span style="color:var(--ink-dim,#9a92a4)">Vel</span> <span data-role="iss-vel" style="color:var(--ink,#efe9e0)">—</span></div>
          <div><span style="color:var(--ink-dim,#9a92a4)">Side</span> <span data-role="iss-vis" style="color:var(--ink,#efe9e0)">—</span></div>
          <div><span style="color:var(--ink-dim,#9a92a4)">Updated</span> <span data-role="iss-stamp" style="color:var(--ink,#efe9e0)">—</span></div>
        </div>
        <p style="margin:0.75rem 0 0">
          <a class="view-full-link" data-role="iss-map-link" href="https://www.openstreetmap.org/" target="_blank" rel="noopener" hidden>Map under the station ↗</a>
          <a class="view-full-link" href="https://spotthestation.nasa.gov/" target="_blank" rel="noopener">Spot the Station ↗</a>
        </p>
      </div>

      <div class="detail-list" style="margin-bottom:1.25rem">
        <div class="item"><span class="h">Ground</span><span class="d">All-sky from dark sites.</span></div>
        <div class="item"><span class="h">Sun</span><span class="d">SDO — the star of this Domain.</span></div>
        <div class="item"><span class="h">Orbit</span><span class="d">ISS position + Earth video when live.</span></div>
        <div class="item"><span class="h">Aurora</span><span class="d">NOAA space weather.</span></div>
        <div class="item"><span class="h">Map</span><span class="d">Stellarium Web.</span></div>
        <div class="item"><span class="h">LYMP</span><span class="d">Her chosen human archive.</span></div>
      </div>

      <h3 style="margin:1.2rem 0 0.45rem;font-weight:400;font-style:italic">1 · Live all-sky</h3>
      <p style="color:var(--ink-dim);font-size:0.95rem;margin-bottom:0.5rem">ESO outreach cams — ground ceiling. Not a LYMP camera.</p>
      <div style="border-radius:12px;overflow:hidden;border:1px solid rgba(53,201,143,0.28);background:#000">
        <iframe title="ESO outreach webcams" src="https://www.eso.org/public/outreach/webcams/" loading="lazy" style="width:100%;height:min(52vw,300px);border:0;background:#000"></iframe>
      </div>

      <h3 style="margin:1.5rem 0 0.45rem;font-weight:400;font-style:italic">2 · The Sun · SDO</h3>
      <p style="color:var(--ink-dim);font-size:0.95rem;margin-bottom:0.5rem">NASA Solar Dynamics Observatory — latest AIA image.</p>
      <div style="border-radius:12px;overflow:hidden;border:1px solid rgba(236,90,160,0.28);background:#000;text-align:center">
        <img alt="SDO solar imagery" src="https://sdo.gsfc.nasa.gov/assets/img/latest/latest_4096_0334.jpg" loading="lazy" style="max-width:100%;height:auto;display:block;margin:0 auto"/>
      </div>
      <p style="margin-top:0.4rem;font-size:0.8rem"><a class="view-full-link" href="https://sdo.gsfc.nasa.gov/data/" rel="noopener" target="_blank">SDO data ↗</a></p>

      <h3 style="margin:1.5rem 0 0.45rem;font-weight:400;font-style:italic">3 · Earth from orbit · ISS video</h3>
      <p style="color:var(--ink-dim);font-size:0.95rem;margin-bottom:0.5rem">NASA external HD when the stream is live. Pair with the tracker above.</p>
      <div style="border-radius:12px;overflow:hidden;border:1px solid rgba(138,92,240,0.3);background:#000">
        <iframe title="NASA ISS live Earth view" src="https://www.youtube.com/embed/ROboUHfPUrU?rel=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy" style="width:100%;height:min(56vw,340px);border:0"></iframe>
      </div>
      <p style="margin-top:0.4rem;font-size:0.8rem">
        <a class="view-full-link" href="https://www.nasa.gov/nasalive/" rel="noopener" target="_blank">NASA Live ↗</a>
        <a class="view-full-link" href="https://www.youtube.com/@Sen/live" rel="noopener" target="_blank">Sen 4K ISS ↗</a>
      </p>

      <h3 style="margin:1.5rem 0 0.45rem;font-weight:400;font-style:italic">4 · Aurora &amp; space weather</h3>
      <p style="color:var(--ink-dim);font-size:0.95rem;margin-bottom:0.5rem">NOAA SWPC northern aurora product.</p>
      <div style="border-radius:12px;overflow:hidden;border:1px solid rgba(53,201,143,0.28);background:#0a0a12;text-align:center">
        <img alt="NOAA aurora forecast" src="https://services.swpc.noaa.gov/images/animations/ovation/north/latest.jpg" loading="lazy" style="max-width:100%;height:auto;display:block;margin:0 auto"/>
      </div>
      <p style="margin-top:0.4rem;font-size:0.8rem"><a class="view-full-link" href="https://www.swpc.noaa.gov/products/aurora-30-minute-forecast" rel="noopener" target="_blank">NOAA aurora ↗</a></p>

      <h3 style="margin:1.5rem 0 0.45rem;font-weight:400;font-style:italic">5 · Sky map · now</h3>
      <p style="color:var(--ink-dim);font-size:0.95rem;margin-bottom:0.5rem">Stellarium Web — chart for this moment.</p>
      <div style="border-radius:12px;overflow:hidden;border:1px solid rgba(138,92,240,0.28);background:#000">
        <iframe title="Stellarium Web" src="https://stellarium-web.org/" loading="lazy" style="width:100%;height:min(70vw,420px);border:0;background:#000"></iframe>
      </div>

      <h3 style="margin:1.5rem 0 0.45rem;font-weight:400;font-style:italic">6 · LYMP — her photographer</h3>
      <p style="color:var(--ink-dim);font-size:0.95rem;margin-bottom:0.5rem">Leave Your Mark Photography. Instruments show the void; LYMP frames it.</p>
      <div style="border-radius:12px;overflow:hidden;border:1px solid rgba(53,201,143,0.35);background:#0a0a12;min-height:260px">
        <iframe title="LYMP" src="https://leaveyourmark.photography/" loading="lazy" style="width:100%;height:min(70vw,400px);border:0;background:#0a0a12"></iframe>
      </div>
      <p style="margin-top:0.55rem">
        <a class="view-full-link" href="https://leaveyourmark.photography/" rel="noopener" target="_blank">Open LYMP ↗</a>
        <a class="view-full-link" href="./lymp.html">Full Sky page ↗</a>
      </p>
` },

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
