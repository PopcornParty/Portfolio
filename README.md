# Popcorn Party — Portfolio

Personal site for **Popcorn Party**: developer, creator and community builder.

This is a static site. No build step, no API keys, no backend.

Live repo: [PopcornParty/Portfolio](https://github.com/PopcornParty/Portfolio)

---

## Run locally

You can open `index.html` directly, but some browsers treat local files strictly. A tiny local server is better.

```bash
# from this folder
python3 -m http.server 4173
```

Then open [http://localhost:4173](http://localhost:4173).

Node alternative:

```bash
npx serve .
```

There is nothing to install and nothing to build.

---

## Build

There is no production build. The files in this repo are the website.

If you later add a bundler, keep `js/config.js` as the single place for links and Discord details.

---

## Deploy to GitHub Pages

1. Push this project to `https://github.com/PopcornParty/Portfolio`.
2. In the repo: **Settings → Pages**.
3. Source: **Deploy from a branch**.
4. Branch: `main` / folder: `/ (root)`.
5. Save.

The site will be available at:

`https://popcornparty.github.io/Portfolio/`

Asset paths are relative, so the project-page URL works without extra config.

`.nojekyll` is included so GitHub Pages does not process the site through Jekyll.

---

## Deploy to Vercel

1. Import the `Portfolio` GitHub repository in Vercel.
2. Framework preset: **Other**.
3. Leave build command empty.
4. Output directory: `.` (root).
5. Deploy.

Vercel will serve `index.html` as the homepage.

---

## Where to change things

All of the values you are most likely to edit live in [`js/config.js`](js/config.js).

### YouTube URL

```js
youtubeUrl: "PASTE_YOUTUBE_URL_HERE",
```

Replace with the full channel URL, for example `https://www.youtube.com/@yourchannel`.

Until that is a real URL, the YouTube card stays inactive instead of linking somewhere fake.

### Instagram URL

```js
instagramUrl: "PASTE_INSTAGRAM_URL_HERE",
```

Same rule as YouTube.

### Discord username

```js
discordUsername: "popcorn_party1",
```

Copy buttons throughout the site use this value.

### Discord invite links

Edit the `communities` array in `js/config.js`:

- Server Owners Community
- My Discord
- Donut Nation

Each item has `title`, `description`, `button` and `url`.

---

## Visitor counter

The **Website Visits** stat tries a public, keyless counter:

`https://countapi.mileshilliard.com/api/v1/hit/popcornparty-portfolio-visits-v1`

- No account.
- No API key in the frontend.
- One increment per browser tab session.
- Reloads in the same tab do not keep adding extra hits.

If that service is unreachable, the site falls back to a count stored in `localStorage` and labels it clearly as **visits on this device only**. It will not pretend that fallback number is a global total.

To reset the global key later, change `visitCounterKey` in `js/config.js`.

The non-numeric stats (many ideas, lots of projects, constantly learning, always experimenting) are intentionally not given fake numbers.

---

## Project structure

```
index.html
css/styles.css
js/config.js
js/main.js
assets/favicon.svg
README.md
```

- `index.html` — page structure and content
- `css/styles.css` — layout, theme, responsive rules, motion
- `js/config.js` — editable links and names
- `js/main.js` — navigation, copy-to-clipboard, counter, motion, easter eggs

---

## Notes

- Designed for phones, tablets and large desktops.
- Respects `prefers-reduced-motion`.
- Custom cursor glow is desktop-only and never replaces the real pointer.
- Hidden extras exist. They do not block normal use.
