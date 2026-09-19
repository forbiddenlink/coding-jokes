# 😂 Coding Jokes

A modern, interactive web app with 400+ programming jokes: search, category filters, emoji
reactions, achievements, and personal stats tracking. Built with vanilla HTML, CSS, and
JavaScript, no framework, no backend.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Live Demo](https://coding-jokes.vercel.app/) | [Report Bug](https://github.com/forbiddenlink/coding-jokes/issues) | [Request Feature](https://github.com/forbiddenlink/coding-jokes/issues)

## Features

- 400+ programming jokes across 14 categories (JavaScript, Python, Java, Web Dev, DevOps,
  AI/ML, and more)
- Real-time search with debouncing, category filtering, and smart sorting (newest, most
  popular, by category)
- Emoji reactions (not just likes), a submit-your-own-joke form, copy & share
- Achievement system with 10 unlockable achievements and a personal stats dashboard
- Dark/light mode, fully responsive, accessibility-first (ARIA labels, skip links, keyboard
  navigation)
- 3D card effects, gradient backgrounds, and micro-interactions

## Quick start

```bash
pnpm install
pnpm dev
```

Open http://localhost:5173.

```bash
pnpm build      # production build
pnpm preview    # preview the production build
```

## Scripts

```bash
pnpm dev / pnpm start   # Vite dev server
pnpm build              # production build
pnpm preview            # preview the production build
pnpm lint               # tests/lint.cjs - custom source-pattern checks (not eslint/biome)
pnpm test               # node --test tests/*.test.cjs
pnpm check              # lint + test + build
pnpm biome:check / pnpm biome:fix / pnpm biome:format
pnpm audit / pnpm security   # pnpm audit --audit-level high
```

## Project structure

```
coding-jokes/
├── index.html      # app shell
├── index.css       # styling
├── js/
│   ├── jokes.js       # joke data, rendering, persistence
│   ├── search.js      # debounced search
│   ├── filters.js     # category filtering
│   ├── stats.js        # stats dashboard
│   ├── theme.js         # dark/light mode
│   └── analytics.js     # PostHog
├── tests/          # lint.cjs, app.test.cjs
└── public/         # favicon, manifest, sitemap, robots.txt
```

## Env vars

`VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` enable PostHog analytics (`js/analytics.js`);
PostHog init is skipped if the key is unset. No other env vars needed since there is no backend.

## Adding jokes

Use the submit form on the site, or edit `js/jokes.js` directly and open a PR. Jokes should be
programming or tech-related, appropriate and inclusive, properly categorized, and original or
properly attributed.

## Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes
4. Push to the branch
5. Open a pull request

## Technologies

HTML5, CSS3 (custom properties, Grid, Flexbox), vanilla JavaScript (ES6+), Vite, Biome,
Font Awesome, Google Fonts (Space Grotesk & Inter), Animate.css.

## Acknowledgments

Original concept developed as part of the Scrimba Frontend Developer Career Path, enhanced and
expanded by Elizabeth Stein. Icons by Font Awesome, fonts by Google Fonts.

## License

MIT, see [LICENSE](LICENSE).

---

<div align="center">

**[⬆ back to top](#-coding-jokes)**

If you found this project helpful, consider giving it a star.

</div>
