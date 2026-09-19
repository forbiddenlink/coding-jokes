# coding-jokes

Vanilla HTML/CSS/JS web app: 400+ programming jokes with search, category filters,
emoji reactions, achievements, and stats tracking. No framework, no backend.
Live at https://coding-jokes.vercel.app/.

## Stack

- Vanilla JavaScript (ES6+), no framework
- Vite ^8.2.2 (dev server + build)
- Biome 2.5.12 for lint/format (`biome.json`)
- pnpm (see `packageManager: pnpm@10.34.5` in package.json)
- Vercel for hosting
- PostHog for analytics

## Commands

- `pnpm dev` / `pnpm start` - Vite dev server
- `pnpm build` - production build
- `pnpm preview` - preview the production build
- `pnpm lint` - runs `tests/lint.cjs`, a custom script checking specific source
  patterns (not eslint or biome)
- `pnpm test` - runs `node --test tests/*.test.cjs`
- `pnpm check` - lint + test + build
- `pnpm biome:check` / `pnpm biome:fix` / `pnpm biome:format`
- `pnpm audit` / `pnpm security` - `pnpm audit --audit-level high`

## Layout

- `index.html`, `index.css` - app shell and styling
- `js/jokes.js` - joke data, rendering, persistence (the bulk of the app, ~156K)
- `js/search.js`, `js/filters.js`, `js/stats.js`, `js/theme.js`, `js/analytics.js`
- `tests/` - `lint.cjs` (custom source-pattern checks), `app.test.cjs`
- `public/` - favicon, manifest, sitemap, robots.txt

## Conventions

- All state is client-side; persistence is via `localStorage`, no backend.
- `tests/lint.cjs` enforces specific invariants by reading source text directly
  (e.g. no `console.log` in `js/theme.js`, jokesManager-only bootstrap in
  `js/jokes.js`). Read it before changing those files so you don't break a
  check that isn't obvious from the code alone.
- Biome config excludes `public/` and `*.min.js` from formatting/linting.

## Env vars

- `VITE_POSTHOG_KEY`, `VITE_POSTHOG_HOST` - read via `import.meta.env` in
  `js/analytics.js`; PostHog init is skipped if the key is unset.

## Gotchas

- A stale `.eslintrc.json` exists at the root but nothing in package.json
  scripts invokes eslint; Biome is the active linter/formatter.
- Security headers (X-Frame-Options, nosniff, etc.) are set in `vercel.json`.
