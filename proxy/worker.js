// Cloudflare Worker: secure proxy to the Anthropic Messages API.
// The API key lives only here, as a Worker secret (env.ANTHROPIC_API_KEY) —
// never in the client. The static site calls this Worker instead of Anthropic.

// Only these origins may call the proxy from a browser (prevents other sites
// from abusing your worker via CORS). Add your local dev origin if needed.
const ALLOWED_ORIGINS = [
  "https://shubhodippal.github.io",
  "http://127.0.0.1:5500",
  "http://localhost:5500",
];

// Limit which models the proxy will request, to cap abuse/cost.
const ALLOWED_MODELS = ["claude-opus-4-8"];

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const headers = corsHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers });
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: { message: "Invalid JSON body" } }, 400, headers);
    }

    if (!ALLOWED_MODELS.includes(payload.model)) {
      return json({ error: { message: "Model not allowed" } }, 400, headers);
    }

    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(payload),
    });

    const body = await upstream.text();
    return new Response(body, {
      status: upstream.status,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  },
};

function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}
