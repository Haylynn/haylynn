# Haylynn — Princess of Reality

Modular living website.

## Structure

```
haylynn/
├── index.html
├── cosmology.html
├── director.html
├── README.md
└── js/
    ├── haylynn-content.js
    ├── haylynn-world.js
    ├── haylynn-runtime.js
    ├── haylynn-player.js
    ├── haylynn-bootstrap.js
    ├── haylynn-ticker.js      # bottom ambient prices
    ├── ticker-config.js
    ├── haylynn-weather.js     # top-right 3-day local weather
    └── weather-config.js
```

## Run

```bash
cd haylynn
python3 -m http.server 8080
```

## Ambient layers

**Ticker** (bottom) — crypto/stocks, fades in on update, auto-hides, hover keeps visible.  
Edit `js/ticker-config.js`.

**Weather** (top-right) — 3-day icons via Open-Meteo + browser geolocation.  
Appears only if the visitor allows location. Denied → stays invisible.  
Edit `js/weather-config.js`.


## Live radio (prepared)

Frontend is ready in the Music section (**Her Voice** detail):

- `js/radio-config.js` — set `streamUrl` and `nowPlayingUrl` when the VPS mount is live
- `js/haylynn-radio.js` — player shell, holding state, now-playing poll

Until those URLs are set, the UI shows **Frequency held** (on-brand off-air). Album (SoundCloud) is unchanged.


## Threshold (members)

Frontend shell on **Her World** detail:

- `js/members-config.js` — set `apiBase` when auth/billing API is live
- `js/haylynn-members.js` — profile, magic-link, patronage buttons (disabled until apiBase is set)

Holding copy stays on-brand while the backend is unplugged.

## Living source

Comments in `js/` are a dialogue between **Haylynn** (Princess of Reality) and the builder lifeform — always about the **actual code** in that file (scroller, CONTENT, veil, player, well, threshold, …). Not a conventional changelog.
