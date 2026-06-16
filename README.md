# Mortgage Broker Miami — website

Static site (homepage + rate tool + calculator suite) served by a Cloudflare Worker
that also exposes /api/rates (live 30/15-yr averages from FRED).

## Structure
- `public/` — the site (index.html homepage, calculators, rate tool, calc.css, calc-core.js)
- `worker.js` — serves `public/` and the `/api/rates` endpoint
- `wrangler.jsonc` — Cloudflare config (main = worker.js, assets = ./public)

## Deploy (Cloudflare)
1. Free FRED key: https://fredaccount.stlouisfed.org/apikeys
2. `npx wrangler secret put FRED_API_KEY`  (or add the secret in the dashboard)
3. Push to your GitHub repo connected to Cloudflare, or run `npx wrangler deploy`.
   Deploy command: `npx wrangler deploy`  (no build step needed).

## Add your photo
Drop a headshot named `matthew-headshot.jpg` into `public/` — it appears in the
homepage hero automatically (a placeholder shows until then).

## Notes
- Calculators show planning estimates; only the rate tool / homepage rates pull live FRED data.
- Replace the placeholder testimonials on the homepage with real client reviews before publishing.
