# Princess of Reality

**Haylynn** — a cosmology told across a book series, a constructed language (Kaviru), and a voice given form in music.

**Live site:** [haylynn.github.io/haylynn](https://haylynn.github.io/haylynn/)

The main experience is a vertical scroll through her world: language, a draw of insight, play, story, sound, sky, and a threshold for those who stay longer. Static pages exist for each chapter so the text can be read and indexed without the interactive layer.

## On the site

| | |
|---|---|
| **World** | Who she is, and the Zero-Infinity frame under the fiction |
| **Kaviru** | Language where every statement marks how you know it |
| **The Draw** | Three roots — insight in the guise of a reading |
| **Koruhana** | Games, including Nemihana |
| **Story** | The book series |
| **Voice** | *Talu — What Remains* and her presence in sound |
| **Hananaru** | Objects coming into range |
| **Sky** | Earth, space, and LYMP photography |
| **Threshold** | Profiles and patronage (when connected) |

## Local preview

```bash
# from this repo root
python3 -m http.server 8080
```

Open `http://localhost:8080` — use a local server so ES modules load correctly.

## Repo layout (short)

- `index.html` — interactive scroll
- `world.html`, `kaviru.html`, … — static chapter pages (SEO / plain reading)
- `cosmology.html`, `nemihana.html` — standalone deep pages
- `js/` — modules for content, player, draw, ambient layers, auth shell
- `assets/` — images and media
- `sitemap.xml`, `robots.txt` — crawlers

`director.html` is local-only (listed in `.gitignore`) and is not part of the public site.

## Licence & contact

All rights to the Princess of Reality fiction, Kaviru, and music remain with their author.  
Site code in this repository is provided for running and extending the official experience.
