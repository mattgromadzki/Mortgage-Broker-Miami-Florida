# Mortgage Broker Miami Florida — Astro site

Astro project that builds the full static site. Header, footer, page shell, and
scripts live in one place; every page is generated from them.

## Structure
- `src/layouts/BaseLayout.astro` — the shared `<head>`, header, footer, mobile bar, and scripts. Edit once, every page updates.
- `src/components/Header.astro`, `Footer.astro` — the shared header and footer.
- `src/pages/*.astro` — one file per page (its title, description, and content).
- `public/` — files served as-is: `styles.css`, `app.js`, `robots.txt`, `sitemap.xml`.

## Develop locally
```bash
npm install
npm run dev      # preview at http://localhost:4321
npm run build    # outputs the static site to dist/
```

## Hosting (Cloudflare, auto-publish)
- Build command: `npm run build`
- `wrangler.jsonc` serves the built `dist/` folder.
- Every push to `main` rebuilds and redeploys automatically.

## Notes
- Pages build as flat `*.html` files (e.g. `about.astro` -> `/about.html`), so existing links keep working.
- The lead form / start funnel still needs a real endpoint (Cloudflare Worker, Formspree/Basin, or your CRM webhook) to capture submissions.
- SEO `noindex` was removed so the live site can be indexed. To keep a page private, pass `noindex` to `BaseLayout`.
