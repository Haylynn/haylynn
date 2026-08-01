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
