/**
 * Mortgage Broker Miami — site worker.
 * Serves the static site in /public AND a /api/rates endpoint that pulls the
 * latest 30/15-year average mortgage rates from FRED (key stays server-side).
 *
 * SETUP
 *  1. Free FRED key: https://fredaccount.stlouisfed.org/apikeys
 *  2. Add it to Cloudflare as a SECRET named FRED_API_KEY
 *     (npx wrangler secret put FRED_API_KEY  — or dashboard → Settings → Variables and Secrets)
 *  3. Deploy:  npx wrangler deploy
 */
const SERIES = { thirty: "MORTGAGE30US", fifteen: "MORTGAGE15US" };

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/api/rates") return handleRates(env, ctx);
    if (url.pathname === "/api/rate-history") return handleHistory(url, env, ctx);
    return env.ASSETS.fetch(request);
  },
};

async function handleRates(env, ctx) {
  const cache = caches.default;
  const key = new Request("https://internal/api/rates");
  const cached = await cache.match(key);
  if (cached) return cached;
  if (!env.FRED_API_KEY) return json({ error: "missing_api_key" }, 500);
  try {
    const out = {};
    for (const [k, id] of Object.entries(SERIES)) {
      const u = `https://api.stlouisfed.org/fred/series/observations?series_id=${id}&api_key=${env.FRED_API_KEY}&file_type=json&sort_order=desc&limit=1`;
      const r = await fetch(u, { cf: { cacheTtl: 21600 } });
      if (!r.ok) throw new Error("FRED " + r.status);
      const d = await r.json();
      const o = d.observations && d.observations[0];
      out[k] = o ? { value: o.value, date: o.date } : null;
    }
    const resp = json(out, 200, { "cache-control": "public, max-age=21600" });
    ctx.waitUntil(cache.put(key, resp.clone()));
    return resp;
  } catch (e) {
    return json({ error: "rates_unavailable" }, 502);
  }
}
function startForRange(r) {
  const days = { "60d": 60, "6m": 183, "1y": 365, "5y": 1825 }[r];
  if (!days) return null;
  const d = new Date(); d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}
async function handleHistory(url, env, ctx) {
  const range = url.searchParams.get("range") || "60d";
  const cache = caches.default;
  const key = new Request("https://internal/api/rate-history?range=" + range);
  const cached = await cache.match(key);
  if (cached) return cached;
  if (!env.FRED_API_KEY) return json({ error: "missing_api_key" }, 500);
  const start = startForRange(range);
  try {
    const out = {};
    for (const [k, id] of Object.entries(SERIES)) {
      let u = `https://api.stlouisfed.org/fred/series/observations?series_id=${id}&api_key=${env.FRED_API_KEY}&file_type=json&sort_order=asc`;
      if (start) u += "&observation_start=" + start;
      const r = await fetch(u, { cf: { cacheTtl: 21600 } });
      if (!r.ok) throw new Error("FRED " + r.status);
      const d = await r.json();
      out[k] = (d.observations || [])
        .filter((o) => o.value !== ".")
        .map((o) => ({ d: o.date, v: +o.value }));
    }
    const resp = json(out, 200, { "cache-control": "public, max-age=21600" });
    ctx.waitUntil(cache.put(key, resp.clone()));
    return resp;
  } catch (e) {
    return json({ error: "history_unavailable" }, 502);
  }
}

function json(b, s = 200, extra = {}) {
  return new Response(JSON.stringify(b), {
    status: s,
    headers: { "content-type": "application/json; charset=utf-8", "access-control-allow-origin": "*", ...extra },
  });
}
