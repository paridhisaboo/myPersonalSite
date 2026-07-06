# myPersonalSite

My personal portfolio — a starry corner of the internet for my software, my playlists, and my (large) bookshelf.

🔗 **Live:** https://paridhisaboo.github.io/myPersonalSite/

## Built with
- **HTML** — structure (`index.html`)
- **CSS** — styling, layout, the watercolor/starry theming (`styles.css`)
- **JavaScript** — scroll-driven animations, the book staircase, the turntable, and the recommendation forms (`script.js`)

No build step, no dependencies — just open `index.html`.

## Features
- A painterly, starry-night theme with hand-drawn SVG stars and watercolor washes
- **Selected work** — four projects (MacroLens, COAT, SignSpeak, Netflix Ratings) with animated infographics
- **The sound** — an embedded Spotify player + a "leave me a track" box, plus a turntable that follows you down the page
- **The shelf** — a stack of books that winds into a descending spiral staircase as you scroll, over a full 40-book index
- Fully responsive, keyboard-navigable, and respects `prefers-reduced-motion`

## Structure
```
index.html      # markup
styles.css      # all styles
script.js       # all behavior (stars, reveals, staircase, turntable, forms)
README.md
```

## Editing
- **Books:** edit the `SHELF` (full list) and `STAIR` (the 10 designed books) arrays at the bottom of `script.js`.
- **Playlist:** swap the Spotify playlist ID in the `<iframe>` inside `index.html`.

---
© Paridhi Saboo, 2026
