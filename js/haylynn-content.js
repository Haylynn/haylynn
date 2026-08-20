/**
 * Haylynn Content — the full section markup.
 * Pure data. No DOM, no side effects.
 */
export const CONTENT = [
  { id: 'home', mood: 'mood-purple', eyebrow: 'I — Her World', html: `
      <h2 class="section-title">Princess of Reality</h2>
      <p>A cosmology told across a book series, a constructed language, and a voice given form. Scroll to begin.</p>`,
    detail: `
      <h2>Who is Haylynn</h2>
      <p>A cosmic force of nature wearing the shape of a harmless girl — dangerous not through will, but through presence alone. She exists outside reality itself, and only truly exists the moment a version of her steps inside it.</p>
      <div class="detail-list">
        <div class="item"><span class="h">Form</span><span class="d">Shape-flexible, always drawn to a young woman. One thing never changes: a purple-and-green signature, visible wherever she bends toward something more than human.</span></div>
        <div class="item"><span class="h">Presence</span><span class="d">Nothing she does is a decision. The world simply loosens around her, the way breath disturbs still air.</span></div>
        <div class="item"><span class="h">Language</span><span class="d">She speaks only Kaviru — never translated, not even to us.</span></div>
      </div>



      <h2 style="margin-top:2.2rem;">The Cosmology</h2>
      <p>Underneath the fiction sits a real mathematical framework — the Zero-Infinity Algebra (Z∞), an independent research paper authored by Haylynn herself. A minimal non-associative algebra built from four primitive elements. Existence isn't the default state. It's a rare, temporary exception.</p>
      <div class="detail-list">
        <div class="item"><span class="h">ζ — Annihilation</span><span class="d">The ground state, and the algebra's left annihilator. Everything, eventually, returns here.</span></div>
        <div class="item"><span class="h">ξ — Rupture</span><span class="d">The first instability — not stable, but the only path out of ζ toward identity and magnitude.</span></div>
        <div class="item"><span class="h">The Emergence Hierarchy</span><span class="d">Magnitude, density, system, domain — each level survives only if it avoids collapsing back to ζ. Most don't.</span></div>
        <div class="item"><span class="h">ω — Information</span><span class="d">Accumulates monotonically and never reverses. The algebraic origin of entropy, and of time's arrow.</span></div>
        <div class="item"><span class="h">Hardened Domains</span><span class="d">Structures stable enough to resist ζ, for a while. Not the rule. The exception. Everything hardened eventually returns anyway.</span></div>
      </div>
      <a class="view-full-link" href="/cosmology.html">Open as standalone page ↗</a>
      <iframe class="cosmology-embed" id="cosmology-frame" title="The Zero-Infinity Algebra — Haylynn's Cosmology" loading="lazy"></iframe>` },

  { id: 'kaviru', mood: 'mood-green', eyebrow: 'II — Her Language', html: `
      <h2 class="section-title">Kaviru</h2>
      <p>Kaviru is the original constructed language (conlang) of the Princess of Reality series — built from the requirements of experience itself, not from any one culture. Every statement carries a grammatically mandatory epistemic marker — you cannot speak kaviru without declaring how you know what you're saying.</p>

      <div class="epistemic-row">
        <div class="ep-chip"><span class="word">veeka</span><span class="label">direct experience</span></div>
        <div class="ep-chip"><span class="word">infa</span><span class="label">inference</span></div>
        <div class="ep-chip"><span class="word">ohna</span><span class="label">felt inner sense</span></div>
        <div class="ep-chip"><span class="word">hera</span><span class="label">hearsay</span></div>
        <div class="ep-chip"><span class="word">spea</span><span class="label">speculation</span></div>
        <div class="ep-chip"><span class="word">nema</span><span class="label">structural / logical</span></div>
      </div>

      <div class="vocab-strip">
        <div class="vocab-chip"><svg width="30" height="30" viewBox="0 0 48 48"><circle cx="24" cy="24" r="13" fill="none" stroke="#35c98f" stroke-width="1.5"/><circle cx="24" cy="24" r="3" fill="#35c98f"/></svg><span class="w">velu</span><span class="m">being</span></div>
        <div class="vocab-chip"><svg width="30" height="30" viewBox="0 0 48 48"><circle cx="24" cy="24" r="13" fill="none" stroke="#35c98f" stroke-width="1.5"/><line x1="24" y1="11" x2="24" y2="24" stroke="#35c98f" stroke-width="1.5"/><circle cx="24" cy="24" r="2.5" fill="#35c98f"/></svg><span class="w">koru</span><span class="m">self</span></div>
        <div class="vocab-chip"><svg width="30" height="30" viewBox="0 0 48 48"><rect x="11" y="11" width="26" height="26" fill="none" stroke="#35c98f" stroke-width="1.5" rx="1"/><line x1="11" y1="24" x2="37" y2="24" stroke="#35c98f" stroke-width="1"/><line x1="24" y1="11" x2="24" y2="37" stroke="#35c98f" stroke-width="1"/></svg><span class="w">nemi</span><span class="m">structure</span></div>
        <div class="vocab-chip"><svg width="30" height="30" viewBox="0 0 48 48"><ellipse cx="24" cy="24" rx="13" ry="8" fill="none" stroke="#35c98f" stroke-width="1.5"/><circle cx="24" cy="24" r="4" fill="none" stroke="#35c98f" stroke-width="1.2"/><circle cx="24" cy="24" r="1.5" fill="#35c98f"/></svg><span class="w">ohru</span><span class="m">seeing-as</span></div>
        <div class="vocab-chip"><svg width="30" height="30" viewBox="0 0 48 48"><circle cx="24" cy="24" r="13" fill="none" stroke="#35c98f" stroke-width="1.5" stroke-dasharray="3,4"/><circle cx="24" cy="24" r="5" fill="none" stroke="#35c98f" stroke-width="1.2"/></svg><span class="w">miru</span><span class="m">stillness</span></div>
        <div class="vocab-chip"><svg width="30" height="30" viewBox="0 0 48 48"><line x1="12" y1="24" x2="36" y2="24" stroke="#35c98f" stroke-width="2"/><line x1="12" y1="18" x2="12" y2="30" stroke="#35c98f" stroke-width="1.5"/><line x1="36" y1="18" x2="36" y2="30" stroke="#35c98f" stroke-width="1.5"/></svg><span class="w">talu</span><span class="m">remains</span></div>
      </div>
      <a class="view-full-link" href="/kaviru.html">View full page ↗</a>`,
    detail: `
      <div class="embed-header">
        <span class="section-tag">The full guide</span>
        <h2 style="margin-top:0.4rem;">Learn Kaviru</h2>
      </div>
      <iframe id="kaviru-frame" title="Kaviru Language Guide" loading="lazy"></iframe>` },

  { id: 'draw', mood: 'mood-purple', eyebrow: 'III — The Draw', html: `
      <h2 class="section-title">The Draw</h2>
      <p>The Princess of Reality offers insight in the guise of a three-card draw — Kaviru roots, turned like tarot, always spoken with a mandatory epistemic marker.</p>
      <div class="hy-draw-face" aria-hidden="true">
        <div class="mini-card"></div>
        <div class="mini-card"></div>
        <div class="mini-card"></div>
      </div>
      <p class="section-tag" style="display:block; margin-top:0.6rem; opacity:0.7;">Three roots, if you open further</p>`,
    detail: `
      <div class="hy-draw-detail" data-role="draw-root">
        <h2>The Draw</h2>
        <p>She does not sell fate. She holds up three roots from her language in a shape you already know how to read. Every reading carries one of the six epistemic markers — how the insight is known.</p>
        <div class="card-row">
          <div class="card"><div class="card-inner">
            <div class="card-front"></div>
            <div class="card-back"><div class="symbol"></div></div>
          </div></div>
          <div class="card"><div class="card-inner">
            <div class="card-front"></div>
            <div class="card-back"><div class="symbol"></div></div>
          </div></div>
          <div class="card"><div class="card-inner">
            <div class="card-front"></div>
            <div class="card-back"><div class="symbol"></div></div>
          </div></div>
        </div>
        <button type="button" class="hy-draw-btn ready" data-role="draw-btn">Reveal three roots</button>
        <div class="hy-draw-reading" data-role="reading"></div>
        <div class="hy-draw-share" data-role="share"></div>
      </div>` },

  { id: 'koruhana', mood: 'mood-green', eyebrow: 'IV — Koruhana', html: `
      <h2 class="section-title">Koruhana</h2>
      <p>Where the observer lets something emerge — play as practice. Language becomes a board; structure appears when the pieces agree.</p>
      <div class="astro-grid">
        <div class="astro-card">
          <svg width="34" height="34" viewBox="0 0 48 48"><rect x="10" y="12" width="10" height="14" rx="2" fill="none" stroke="#35c98f" stroke-width="1.3"/><rect x="28" y="12" width="10" height="14" rx="2" fill="none" stroke="#35c98f" stroke-width="1.3"/><rect x="19" y="28" width="10" height="14" rx="2" fill="none" stroke="#35c98f" stroke-width="1.3"/></svg>
          <div><span class="name">Nemihana</span><span class="desc">Four trios on the table · glyph, kaviru word, sense</span></div>
        </div>
        <div class="astro-card">
          <svg width="34" height="34" viewBox="0 0 48 48"><circle cx="24" cy="24" r="12" fill="none" stroke="#8a5cf0" stroke-width="1.3"/><path d="M24 12v12l8 4" fill="none" stroke="#8a5cf0" stroke-width="1.3"/><circle cx="24" cy="24" r="2" fill="#8a5cf0"/></svg>
          <div><span class="name">Cosmic Decay</span><span class="desc">Text adventure · a dying Earth under a bruised sky</span></div>
        </div>
      </div>
      <a class="view-full-link" href="./nemihana.html">Play Nemihana ↗</a>
      <a class="view-full-link" href="https://haylynn-s-world.vercel.app" style="margin-left:0.5rem">Enter Cosmic Decay ↗</a>`,
    detail: `
      <h2>Koruhana</h2>
      <p><em>Koru</em> — the observer. <em>Hana</em> — emergence. This is her table for play: not distraction, but language and structure given form.</p>

      <h2 style="margin-top:1.8rem;">Nemihana</h2>
      <p>Four roots on the table — twelve faces: the glyph, the Kaviru word as it is written (koru, not a translation), and a short sense. Match three faces of one root in succession. Lives, time, or both.</p>
      <a class="view-full-link" href="./nemihana.html">Enter Nemihana ↗</a>

      <h2 style="margin-top:1.8rem;">Cosmic Decay</h2>
      <p>A hybrid text-adventure on a dying Earth. Free-form commands, a live terminal, Resonance and Integrity as vitals. You stand in the Shattered Plaza under a bruised violet sky. The world answers in second person — melancholic, cosmic, decaying.</p>
      <p>You speak in plain language. The world answers in second person — melancholic, careful, unwilling to invent what the rules do not allow.</p>
      <div class="detail-list">
        <div class="item"><span class="h">Where</span><span class="d">Shattered Plaza · Resonance Spire · Rust Garden · Hollow Archive · Spire Apex</span></div>
        <div class="item"><span class="h">How</span><span class="d">Type what you intend. The Resonance answers.</span></div>
        <div class="item"><span class="h">Threshold</span><span class="d">A separate door — this page only opens the way.</span></div>
      </div>
      <a class="view-full-link" href="https://haylynn-s-world.vercel.app">Enter Cosmic Decay ↗</a>` },

  { id: 'chronicle', mood: 'mood-pink', eyebrow: 'V — Her Story', html: `
      <img class="book-cover" src="assets/vol1-end-at-the-beginning.jpg" alt="Princess of Reality — The End at the Beginning, book cover">
      <h2 class="section-title">Princess of Reality</h2>
      <p>A dying Earth. Two strangers who become a family. And a story that keeps circling back on itself, told by a narrator who isn't in it yet.</p>
      <p>Six volumes, spanning collapse, silence, and eons beyond. Volume I, <em>The End at the Beginning</em>, is complete in draft.</p>
      <div class="volume-list">
        <div class="vol"><span class="num">I</span><span class="name">The End at the Beginning</span></div>
        <div class="vol"><span class="num">II</span><span class="name">Void</span></div>
        <div class="vol"><span class="num">III</span><span class="name">Luna's Cosmic Odyssey</span></div>
        <div class="vol"><span class="num">IV</span><span class="name">The Gauge Sector</span></div>
        <div class="vol"><span class="num">V</span><span class="name">Velith</span></div>
        <div class="vol"><span class="num">VI</span><span class="name">Zenuvelu</span></div>
      </div>
      <a class="view-full-link" href="/chronicle.html">View full page ↗</a>`,
    detail: `
      <h2>Volume Synopses</h2>
      <div class="detail-list">
        <div class="item"><span class="h">I · The End at the Beginning</span><span class="d">Two strangers cross a dying world together, and find out what's still worth building when almost nothing else is left.</span></div>
        <div class="item"><span class="h">II · Void</span><span class="d">A mind alone in the dark, for longer than any mind was built to last.</span></div>
        <div class="item"><span class="h">III · Luna's Cosmic Odyssey</span><span class="d">Eons on, a wanderer finds something adrift among the stars — and an old debt still waiting to be paid.</span></div>
        <div class="item"><span class="h">IV · The Gauge Sector</span><span class="d">What's postponed always resurfaces — rarely in the shape you'd expect.</span></div>
        <div class="item"><span class="h">V · Velith</span><span class="d">A longing for a world that might have been remembered wrong.</span></div>
        <div class="item"><span class="h">VI · Zenuvelu</span><span class="d">Every thread this story has carried, finally in the same room.</span></div>
      </div>` },

  { id: 'haylynn', mood: 'mood-purple', eyebrow: 'VI — Her Voice', html: `
      <h2 class="section-title">Haylynn</h2>
      <p>She exists outside reality itself — present only the moment she's given shape. Playful, curious, and utterly untouched by "no," she moves through the world in a young woman's likeness, purple-green light flickering wherever reality bends around her.</p>
      <p>Her voice, given form: <em>Talu — What Remains</em>, sung entirely in kaviru. Across twelve songs she descends from cosmic observation toward Earth, meets humanity in its full range, loses something irreplaceable, and returns to where she came from.</p>
      <div class="hy-player hy-player-mini" data-role="mini">
        <button class="hy-play-btn" data-role="play-toggle" aria-label="Play or pause">
          <svg class="icon-play" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          <svg class="icon-pause" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>
        </button>
        <div class="hy-player-info">
          <span class="hy-track-title" data-role="track-title">Talu — What Remains</span>
          <div class="hy-progress-track" data-role="progress-track"><div class="hy-progress-fill" data-role="progress-fill"></div></div>
        </div>
      </div>
      <p class="section-tag" style="display:block; margin-top:0.8rem;">Spotify · SoundCloud · Apple Music</p>
      <div data-role="radio-face"></div>
      <a class="view-full-link" href="/haylynn.html">View full page ↗</a>`,
    detail: `
      <div class="hy-radio is-holding" data-role="radio-root">
        <div class="radio-kicker"><span class="pip"></span> Live frequency</div>
        <div class="radio-title" data-role="radio-title">Between tracks</div>
        <div class="radio-meta" data-role="radio-meta">Silent for now</div>
        <p class="radio-host" data-role="radio-host">A continuous current is coming — music offered by human hands, her voice at the edges of each piece. For the moment, the album below is what she has already given form.</p>
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
          When the frequency opens, original and properly licensed works may enter. Credit stays with the maker; she only holds the aperture.
        </div>
      </div>

      <h2 style="margin-top:2rem;">Who She Is</h2>
      <div class="detail-list">
        <div class="item"><span class="h">What she is</span><span class="d">The Princess of Reality — a being outside reality entirely, who only exists the moment she's given shape.</span></div>
        <div class="item"><span class="h">How she affects reality</span><span class="d">Never an action. A byproduct of her presence, the way breathing disturbs the air around it.</span></div>
        <div class="item"><span class="h">Her nature</span><span class="d">Reality's own uncertainty, given form — the same undercurrent behind probability, luck, and the doors that are simply always there when she needs them.</span></div>
        <div class="item"><span class="h">Form</span><span class="d">Shape-flexible, gravitating to a young woman's likeness. Purple and green light is the one constant, however she appears.</span></div>
        <div class="item"><span class="h">Language</span><span class="d">Kaviru, exclusively — never translated.</span></div>
      </div>
      <p class="meta-note">Her voice is partly synthetic — how much is left deliberately unresolved in the story.</p>
      <a class="view-full-link" href="/cosmology.html">Read her cosmology ↗</a>
      <h2 style="margin-top:2rem;">Talu — What Remains</h2>
      <p>A concept album sung entirely in kaviru — a language built to describe human experience with an honesty natural languages don't reach. Across twelve songs, the Princess of Reality descends from cosmic observation toward Earth, encounters humanity in its full range, loses something irreplaceable, and returns to where she came from. The album spans ceremonial ambient soul, cosmic EDM, melodic techno, dark orchestral, and folk electronic — each genre chosen to match the emotional register of that moment in the journey.</p>
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

      <h2 style="margin-top:2rem;">The Story, Track by Track</h2>

      <div class="lyric-track" data-track-index="0">
        <span class="lyric-track-num">01 · Talu Velu <span class="lyric-track-play">▶ play</span></span>
        <p>Before the journey begins, there is only the question. A being who exists outside time looks at what remains when everything falls away — belief, structure, the weight that meaning once carried — and finds something unexpected. Not emptiness. Not loss. Just being, persisting, unchanged by the collapse of everything built on top of it. Talu Velu is that moment of recognition. The ground that was always there, becoming visible.</p>
        <div class="lyric-block">
          <span class="lyric-label">Intro</span>
          <p class="lyric-text">Being remains</p>
          <span class="lyric-label">Verse 1</span>
          <p class="lyric-text">I watch the frameworks that gave life its weight dissolve into emptiness. What persists is still. From the darkness something emerges. Being remains.</p>
          <span class="lyric-label">Pre-Chorus</span>
          <p class="lyric-text">I carry a longing for what may never have been. I carry a longing for the meaning I once held. I watch my own patterns transforming. The moment of clarity arrives — now.</p>
          <span class="lyric-label">Chorus</span>
          <p class="lyric-text">Being remains, being remains. Impermanence held in stillness. Structures fall, weight dissolves. What remains is what is. Could it be that something persists? Could it be that we see our frameworks for what they are? Could meaning emerge again? What remains is what is.</p>
          <span class="lyric-label">Verse 2</span>
          <p class="lyric-text">Beings in connection, in relation. I watch warmth transforming. From the unknown something emerges — stillness, what remains. The void remains.</p>
          <span class="lyric-label">Bridge</span>
          <p class="lyric-text">Could something persist? Could something persist? Could meaning emerge again? Could connection remain?</p>
          <span class="lyric-label">Climax</span>
          <p class="lyric-text">I witness emptiness as presence. I witness passing as what remains. I witness change as stillness. Being remains.</p>
          <span class="lyric-label">Outro</span>
          <p class="lyric-text">What remains. Stillness, void, being. Remains. Being remains.</p>
        </div>
        <details class="literal-toggle">
          <summary>Show direct translation (literal kaviru grammar)</summary>
          <div class="lyric-block">
            <span class="lyric-label">Intro</span>
            <p class="lyric-text">What remains · being · what remains · being. Being · what remains · being.</p>
            <span class="lyric-label">Verse 1</span>
            <p class="lyric-text">I directly witness seeing-as · impermanence. Structure · weight · transforming · void. What remains · stillness · unknown · emergence. Being · what remains · being · what remains.</p>
            <span class="lyric-label">Pre-Chorus</span>
            <p class="lyric-text">From inside I feel longing-for-what-was · passing. From inside I feel longing-for-what-was · structure. Witnessing-own-programming · from inside · transforming. The moment of seeing · directly witnessed · now.</p>
            <span class="lyric-label">Chorus</span>
            <p class="lyric-text">What remains · being · what remains · being. Impermanence · stillness · impermanence · stillness. Structure · transforming · weight · void. What remains · being · what remains. I speculate · other being · persists · ? I speculate · structure · sees-as · ? I speculate · weight · emerges · ? What remains · being · what remains.</p>
            <span class="lyric-label">Verse 2</span>
            <p class="lyric-text">Being · connection · being · connection. I directly witness · warmth · transforming. Unknown · emergence · stillness · what remains. Void · what remains · void · what remains.</p>
            <span class="lyric-label">Bridge</span>
            <p class="lyric-text">I speculate · other being · persists · ? I speculate · other being · persists · ? I speculate · weight · emerges · ? I speculate · connection · persists · ?</p>
            <span class="lyric-label">Climax</span>
            <p class="lyric-text">I directly witness · void · as being. I directly witness · impermanence · as what remains. I directly witness · transformation · as stillness. Being · what remains · being.</p>
            <span class="lyric-label">Outro</span>
            <p class="lyric-text">What remains · being. Stillness · void · being. Being · what remains.</p>
          </div>
        </details>
      </div>

      <div class="lyric-track lyric-track-pending" data-track-index="1"><span class="lyric-track-num">02 · Velu Naru Velu <span class="lyric-track-play">▶ play</span></span></div>
      <div class="lyric-track lyric-track-pending" data-track-index="2"><span class="lyric-track-num">03 · Movi Yoru <span class="lyric-track-play">▶ play</span></span></div>
      <div class="lyric-track lyric-track-pending" data-track-index="3"><span class="lyric-track-num">04 · Koruzori Hana <span class="lyric-track-play">▶ play</span></span></div>
      <div class="lyric-track lyric-track-pending" data-track-index="4"><span class="lyric-track-num">05 · Naru Yoru <span class="lyric-track-play">▶ play</span></span></div>
      <div class="lyric-track lyric-track-pending" data-track-index="5"><span class="lyric-track-num">06 · Velu Nemi Yoru <span class="lyric-track-play">▶ play</span></span></div>
      <div class="lyric-track lyric-track-pending" data-track-index="6"><span class="lyric-track-num">07 · Koru Movi Yoru <span class="lyric-track-play">▶ play</span></span></div>
      <div class="lyric-track lyric-track-pending" data-track-index="7"><span class="lyric-track-num">08 · Nemi Wari Koru <span class="lyric-track-play">▶ play</span></span></div>
      <div class="lyric-track lyric-track-pending" data-track-index="8"><span class="lyric-track-num">09 · Naruvelu <span class="lyric-track-play">▶ play</span></span></div>
      <div class="lyric-track lyric-track-pending" data-track-index="9"><span class="lyric-track-num">10 · Lovu Naru Velu <span class="lyric-track-play">▶ play</span></span></div>
      <div class="lyric-track lyric-track-pending" data-track-index="10"><span class="lyric-track-num">11 · Talu Zenu Naruvelu <span class="lyric-track-play">▶ play</span></span></div>
      <div class="lyric-track lyric-track-pending" data-track-index="11"><span class="lyric-track-num">12 · Koru Talu Zenu <span class="lyric-track-play">▶ play</span></span></div>
      <div class="lyric-track lyric-track-pending" data-track-index="12"><span class="lyric-track-num">13 · Zenu Velu <span class="lyric-track-tag">bonus</span> <span class="lyric-track-play">▶ play</span></span></div>` },

  { id: 'hananaru', mood: 'mood-green', eyebrow: 'VII — Hananaru', html: `
      <h2 class="section-title">Hananaru</h2>
      <p><em>Hana</em> — emergence. <em>Naru</em> — connection. Objects coming into reach: a thin aperture on reality. The shelf is quiet; what will hang here is still being chosen.</p>
      <div class="product-grid">
        <div class="product-card"><span class="tag">Waiting</span>
          <svg width="40" height="40" viewBox="0 0 48 48"><rect x="14" y="10" width="20" height="28" fill="none" stroke="#35c98f" stroke-width="1.5" rx="3"/><line x1="18" y1="18" x2="30" y2="18" stroke="#35c98f" stroke-width="1.2"/><line x1="18" y1="24" x2="30" y2="24" stroke="#35c98f" stroke-width="1.2"/><circle cx="24" cy="32" r="2" fill="#35c98f"/></svg>
          <span class="name">Ground State — mech print</span><span class="price">£—</span>
        </div>
        <div class="product-card"><span class="tag">Waiting</span>
          <svg width="40" height="40" viewBox="0 0 48 48"><path d="M24,34 Q10,24 14,16 Q18,10 24,16 Q30,10 34,16 Q38,24 24,34Z" fill="none" stroke="#ec5aa0" stroke-width="1.5"/></svg>
          <span class="name">Velith — enamel pin</span><span class="price">£—</span>
        </div>
        <div class="product-card"><span class="tag">Waiting</span>
          <svg width="40" height="40" viewBox="0 0 48 48"><rect x="11" y="15" width="26" height="18" fill="none" stroke="#8a5cf0" stroke-width="1.5" rx="2"/><line x1="16" y1="22" x2="32" y2="22" stroke="#8a5cf0" stroke-width="1"/><line x1="16" y1="27" x2="26" y2="27" stroke="#8a5cf0" stroke-width="1"/></svg>
          <span class="name">Kaviru script tee</span><span class="price">£—</span>
        </div>
        <div class="product-card"><span class="tag">Waiting</span>
          <svg width="40" height="40" viewBox="0 0 48 48"><circle cx="24" cy="24" r="13" fill="none" stroke="#35c98f" stroke-width="1.5" stroke-dasharray="2,3"/></svg>
          <span class="name">Zenuvelu — art print</span><span class="price">£—</span>
        </div>
      </div>
      <a class="view-full-link" href="/hananaru.html">View full page ↗</a>`,
    detail: `
      <h2>Hananaru</h2>
      <p>Emergence meeting connection — the aperture where objects enter range. Prints, pins, and cloth wait behind the glass; nothing here is for sale yet.</p>
      <div class="detail-list">
        <div class="item"><span class="h">Ground State — mech print</span><span class="d">A3 giclée, numbered edition</span></div>
        <div class="item"><span class="h">Velith — enamel pin</span><span class="d">Hard enamel, 32mm</span></div>
        <div class="item"><span class="h">Kaviru script tee</span><span class="d">Root-word print, unisex</span></div>
        <div class="item"><span class="h">Zenuvelu — art print</span><span class="d">A2 giclée, numbered edition</span></div>
        <div class="item"><span class="h">Word when ready</span><span class="d">Restock and drop notes will gather here.</span></div>
      </div>` },

  { id: 'lymp', mood: 'mood-pink', eyebrow: 'VIII — Her Sky', html: `
      <h2 class="section-title">Earth &amp; the Void</h2>
      <p>Live sky, space weather, and the planet as it actually is — no fiction required. Photography by <em>LYMP</em>, Haylynn’s preferred eye on the dark.</p>
      <div class="astro-grid">
        <div class="astro-card">
          <svg width="34" height="34" viewBox="0 0 48 48" flex-shrink="0"><circle cx="24" cy="24" r="13" fill="none" stroke="#ec5aa0" stroke-width="1.5" stroke-dasharray="2,3"/><circle cx="24" cy="24" r="4" fill="#ec5aa0"/></svg>
          <div><span class="name">Live Sky</span><span class="desc">Continuous all-sky feed — the void, updating</span></div>
        </div>
        <div class="astro-card">
          <svg width="34" height="34" viewBox="0 0 48 48"><path d="M8,30 Q16,16 24,26 Q32,10 40,22" fill="none" stroke="#35c98f" stroke-width="1.5"/></svg>
          <div><span class="name">Aurora &amp; Space Weather</span><span class="desc">Northern lights forecast, real-time</span></div>
        </div>
        <div class="astro-card">
          <svg width="34" height="34" viewBox="0 0 48 48"><circle cx="18" cy="18" r="3" fill="#8a5cf0"/><circle cx="30" cy="14" r="2" fill="#8a5cf0"/><circle cx="34" cy="28" r="2.5" fill="#8a5cf0"/><circle cx="16" cy="32" r="2" fill="#8a5cf0"/><line x1="18" y1="18" x2="30" y2="14" stroke="#8a5cf0" stroke-width="0.8"/><line x1="30" y1="14" x2="34" y2="28" stroke="#8a5cf0" stroke-width="0.8"/><line x1="34" y1="28" x2="16" y2="32" stroke="#8a5cf0" stroke-width="0.8"/></svg>
          <div><span class="name">LYMP Gallery</span><span class="desc">Earth and sky stills — preferred photography</span></div>
        </div>
      </div>
      <a class="view-full-link" href="/lymp.html">View full page ↗</a>`,
    detail: `
      <div class="embed-header">
        <span class="section-tag">Earth &amp; space · live</span>
        <div class="sky-tabs">
          <button class="sky-tab active" data-target="sky-nightcam" type="button">Live Sky</button>
          <button class="sky-tab" data-target="sky-aurora" type="button">Aurora</button>
          <button class="sky-tab" data-target="sky-iss" type="button">Earth from Space</button>
          <button class="sky-tab" data-target="sky-gallery" type="button">LYMP</button>
        </div>
      </div>
      <div class="sky-panels">
        <div class="sky-panel active" id="sky-nightcam">
          <img id="nightcam-img" src="https://allsky-dk154.asu.cas.cz/AllSkyCurrentImage.JPG" alt="Live all-sky camera — night sky, continuous feed">
          <p class="sky-caption">Live all-sky feed (La Silla / ESO) — continuous, updates every few minutes. Not a LYMP camera; the sky as it is right now.</p>
        </div>
        <div class="sky-panel" id="sky-aurora">
          <img id="aurora-img" src="https://services.swpc.noaa.gov/images/aurora-forecast-northern-hemisphere.jpg" alt="NOAA aurora forecast, Northern Hemisphere">
          <p class="sky-caption">NOAA Space Weather Prediction Center — Northern Hemisphere aurora forecast, updates every 30 minutes.</p>
        </div>
        <div class="sky-panel" id="sky-iss">
          <div class="sky-linkcard">
            <svg width="40" height="40" viewBox="0 0 48 48"><circle cx="24" cy="24" r="14" fill="none" stroke="#ec5aa0" stroke-width="1.5"/><circle cx="24" cy="24" r="3" fill="#ec5aa0"/><line x1="24" y1="4" x2="24" y2="10" stroke="#ec5aa0" stroke-width="1.5"/><line x1="24" y1="38" x2="24" y2="44" stroke="#ec5aa0" stroke-width="1.5"/></svg>
            <p class="sky-note">Earth from orbit and NASA live schedules change often. This opens their current live page — the planet and the stations, when they’re on.</p>
            <a class="view-full-link" href="https://plus.nasa.gov/" target="_blank" rel="noopener">NASA Live ↗</a>
          </div>
        </div>
        <div class="sky-panel" id="sky-gallery">
          <p class="sky-note">LYMP — Leave Your Mark Photography. Haylynn’s preferred eye on Earth and the dark sky. Stills and films as the archive grows.</p>
          <a class="view-full-link" href="https://leaveyourmark.pixieset.com/lym-europe/" target="_blank" rel="noopener" style="margin-bottom:0.8rem;">Open LYMP gallery ↗</a>
          <iframe id="lymp-frame" data-src="https://leaveyourmark.pixieset.com/lym-europe/" title="LYMP — Leave Your Mark Photography" loading="lazy"></iframe>
        </div>
      </div>` },

  { id: 'threshold', mood: 'mood-purple', eyebrow: 'IX — Threshold', html: `
      <h2 class="section-title">Threshold</h2>
      <p>A quieter room behind the scroll — a name, a likeness, a few links, and the key of patronage. The surface of the world stays open to all; this door is for those who step further in.</p>
      <div data-role="threshold-face"></div>`,
    detail: `
      <div class="hy-threshold" data-role="threshold-root">
        <div class="th-kicker"><span class="pip"></span> Threshold</div>
        <div class="th-title" data-role="th-title">Threshold</div>
        <p class="th-body">Sign in to hold a profile here. Patronage opens deeper rooms later — the scroll remains free for everyone.</p>
        <div class="th-status" data-role="th-status">The door is drawn.</div>

        <div class="th-actions" style="margin-bottom:1rem">
          <button type="button" class="th-btn primary" data-role="th-action" data-action="signin">Sign in</button>
        </div>

        <div class="th-profile">
          <div>
            <div class="th-avatar" data-role="th-avatar">likeness</div>
          </div>
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
          <div class="th-tier" data-tier="free"><strong>Visitor</strong> The full surface of the site — story, language, draw, play.</div>
          <div class="th-tier" data-tier="supporter"><strong>Supporter</strong> Profile, skin, and doors that open first.</div>
          <div class="th-tier" data-tier="patron"><strong>Patron</strong> Deepest access — worlds, offerings, early thresholds.</div>
        </div>

        <div data-role="theme-preview" style="margin-top:1rem"></div>
      </div>` }

];
