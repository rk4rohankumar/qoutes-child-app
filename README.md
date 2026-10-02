# Quotes · Micro Frontend remote

A small React app that shows a quote of the day with category filters, a
10-item history, copy/share actions and favorites persisted to `localStorage`.
It runs standalone and is also exposed as a webpack Module Federation remote
consumed by the [micro-frontend-host](https://github.com/rk4rohankumar/micro-frontend-host) shell.

Stack: CRA 5 + CRACO 7, React 19, Tailwind 3, axios, framer-motion.

## Data sources

No API keys required.

- `https://dummyjson.com/quotes/random` – general quotes; categories are matched client-side by keyword.
- `https://stoic-quotes.com/api/quote` – primary source for the Wisdom category, fallback for the rest.

If one provider fails the other is tried; if both fail an error state with a retry button is shown.

## Run / build

```bash
npm install
npm start          # dev server, http://localhost:3000
npm run build      # production build to build/ (publicPath 'auto')
```

Deployed at https://qoutes-child-app.vercel.app (the repo name typo is intentional).

## How the host consumes it

`craco.config.js` registers `ModuleFederationPlugin` with:

- scope name `QuotesApp`
- `filename: 'remoteEntry.js'` → https://qoutes-child-app.vercel.app/remoteEntry.js
- `exposes: { './QuotesApp': './src/App' }` – the default export is the root component

The host injects `remoteEntry.js`, calls `container.init(__webpack_share_scopes__.default)`
and then `container.get('./QuotesApp')`.

`react`, `react-dom`, `framer-motion` and `axios` are declared as `singleton`
shared modules with `requiredVersion` taken from `package.json`, so the remote
reuses the host's copies instead of bundling duplicates. `src/index.js` is an
async boundary (`import('./bootstrap')`) so the share scope can be negotiated
before any React code runs, which is what makes the same build work both
standalone and inside the shell.
