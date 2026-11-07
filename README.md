# EVENTRA — Don't just attend. Experience.

An event discovery site for college festivals, hackathons, concerts, workshops and more. Built with plain HTML, CSS and JavaScript. No build step, no framework.

## Features
- Hero with oversized type and an image that breaks the grid; sticky nav that changes on scroll; full-screen mobile menu
- Category index that jumps to the event list pre-filtered
- Featured events (large panel plus offset side panels) and a dated listing
- Explore: live search, category chips, date sort, result count, clear filters and an empty state. All three controls work together
- Event page at `event.html?id=<event-id>` with cover, details, highlights, live countdown and a not-found state
- Registration with validation (name, email, Indian mobile, event), duplicate check by email + event ID, success screen
- Dark (default) and light themes, saved in LocalStorage; respects `prefers-reduced-motion`; keyboard focus styles

## Tech stack
HTML5, CSS3 (custom properties), vanilla JavaScript, Google Fonts (Space Grotesk, Inter). Event photos are loaded from Unsplash.

## Run locally
```bash
git clone <your-repo-url> && cd EVENTRA
python3 -m http.server 8000   # then open http://localhost:8000
```

## Structure
```
index.html  event.html  register.html
css/  themes.css (tokens, light/dark)  style.css (layout, motion, responsive)
js/   storage.js (LocalStorage + theme)  events.js (data + helpers)
      main.js  event-details.js  registration.js
assets/  favicon.svg  images/
```

## How it works
- All events live in `js/events.js`. Pages read from that one array.
- Registrations are saved in the browser's LocalStorage only. There is no server, so they are not shared between devices or users.
- Duplicate check: the same email (case-insensitive) cannot register twice for the same event ID.

## Deploy
Static site, no config. **GitHub Pages:** Settings > Pages > deploy from `main` / root. **Netlify:** drag the folder in, or connect the repo (no build command, publish directory `.`). **Vercel:** import the repo, framework "Other".

## Screenshots
Add `assets/images/home-dark.png`, `home-light.png`, `event.png`, `mobile.png` and link them here.

## Future improvements
GSAP ScrollTrigger for the horizontal gallery and page transitions, a custom cursor, self-hosted optimised images, a real backend for registrations.
