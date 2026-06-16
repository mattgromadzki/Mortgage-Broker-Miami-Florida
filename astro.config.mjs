import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://mortgagebrokermiamiflorida.com',
  // Output flat .html files (about.astro -> /about.html) so existing
  // relative links like href="about.html" keep working unchanged.
  build: { format: 'file' },
});
