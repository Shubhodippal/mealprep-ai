# MealPrep AI 🥑

A smart cooking to-do list that turns your budget, time, and fridge contents into a
structured meal plan, grocery list, and substitutions — powered by Anthropic Claude.

The frontend ([app_cl.html](app_cl.html)) is a static page hosted on GitHub Pages.
It never sees the API key — it calls a **Cloudflare Worker proxy** ([proxy/](proxy/))
that holds the key as an encrypted secret and forwards requests to Anthropic.

## Deploy the proxy (one time)

```bash
cd proxy
npx wrangler login                       # opens browser to your Cloudflare account
npx wrangler secret put ANTHROPIC_API_KEY   # paste your sk-ant-... key when prompted
npx wrangler deploy
```

`wrangler deploy` prints a URL like `https://mealprep-proxy.<you>.workers.dev`.

## Point the frontend at the proxy

In [app_cl.html](app_cl.html), set:

```js
const PROXY_URL = "https://mealprep-proxy.<you>.workers.dev";
```

Commit and push — GitHub Pages redeploys automatically.

## Security notes

- The Anthropic key lives only as a Cloudflare Worker secret, never in the repo or browser.
- The Worker restricts CORS to the allowed origins and to the `claude-opus-4-8` model
  (see [proxy/worker.js](proxy/worker.js)) to limit abuse. Add your own origins there if needed.
