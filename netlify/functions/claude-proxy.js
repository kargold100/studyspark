// netlify/functions/claude-proxy.js
//
// Secure server-side proxy for StudySpark's AI Tutor / AI feedback features.
// The Anthropic API key lives ONLY here, as a Netlify environment variable
// (ANTHROPIC_API_KEY) — it is never sent to or stored in any visitor's browser.
//
// Called by the SAME static front-end whether it's hosted on GitHub Pages or
// on Netlify itself — both just fetch() this one function's URL.
//
// Safety nets against runaway cost on a public, keyless endpoint:
//   1. Origin allow-list (soft control — stops casual cross-site embedding)
//   2. Per-IP daily request cap via Netlify Blobs (soft control — stops one
//      person/script from hammering it)
//   3. Server-side max_tokens cap (hard control on a single request's size)
//   4. Anthropic Console spend cap on the key itself — the REAL backstop.
//      Set this at console.anthropic.com → Settings → Limits. Do this even
//      if you trust steps 1-3; they can all be bypassed by someone calling
//      this URL directly instead of through the website.

let getStore = null;
try {
  getStore = require('@netlify/blobs').getStore;
} catch (e) {
  console.error('@netlify/blobs unavailable — rate limiting disabled, AI proxy continues normally:', e.message);
}

// ── Configuration ───────────────────────────────────────────────────────────
// Comma-separated list of allowed origins, e.g.
//   "https://yourname.github.io,https://studyspark.netlify.app"
// Set this in Netlify → Site configuration → Environment variables.
// If unset, falls back to allowing any *.github.io or *.netlify.app origin,
// plus localhost (handy for local testing) — fine to start with, tighten
// later once you know your exact URLs.
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',').map(s => s.trim()).filter(Boolean);

const DEFAULT_ORIGIN_PATTERNS = [
  /^https:\/\/[a-z0-9-]+\.github\.io$/i,
  /^https:\/\/[a-z0-9-]+\.netlify\.app$/i,
  /^http:\/\/localhost(:\d+)?$/i,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/i,
];

function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (ALLOWED_ORIGINS.length === 0) {
    return DEFAULT_ORIGIN_PATTERNS.some(re => re.test(origin));
  }
  return false;
}

const MAX_TOKENS_CAP = 500;          // hard ceiling per request, regardless of what's asked
const MAX_INPUT_CHARS = 4000;        // reject absurdly long prompts
const DAILY_LIMIT_PER_IP = 60;       // generous for normal study use, capped against abuse

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || 'null',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

exports.handler = async (event) => {
  const origin = event.headers.origin || event.headers.Origin || '';
  const allowed = isAllowedOrigin(origin);

  // Health check — visit the function URL directly in a browser (GET request)
  // to confirm it's deployed and configured correctly. Reveals no secrets.
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ok: true,
        message: 'StudySpark AI proxy is deployed and reachable.',
        anthropicKeyConfigured: !!process.env.ANTHROPIC_API_KEY,
        allowedOriginsEnvVarSet: ALLOWED_ORIGINS.length > 0,
        allowedOriginsConfigured: ALLOWED_ORIGINS.length > 0 ? ALLOWED_ORIGINS : '(using default *.github.io / *.netlify.app / localhost pattern)',
      }, null, 2),
    };
  }

  // Preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders(allowed ? origin : ''), body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders(origin), body: 'Method not allowed' };
  }

  if (!allowed) {
    console.error(`Rejected request from disallowed origin: "${origin}". Add it to ALLOWED_ORIGINS if this should be permitted.`);
    return { statusCode: 403, headers: corsHeaders(''), body: JSON.stringify({ error: 'origin_not_allowed', yourOrigin: origin }) };
  }

  const headers = corsHeaders(origin);

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY is not set in Netlify environment variables.');
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'server_not_configured' }) };
  }

  // ── Parse & validate input ────────────────────────────────────────────────
  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'invalid_json' }) };
  }

  const { system = '', user = '', maxTok = 300, model = 'fast' } = payload;

  if (typeof user !== 'string' || !user.trim()) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'missing_user_message' }) };
  }
  if (String(system).length > MAX_INPUT_CHARS || String(user).length > MAX_INPUT_CHARS) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'input_too_long' }) };
  }

  // ── Per-IP daily rate limit (Netlify Blobs — persistent KV, no extra setup) ─
  // Skipped entirely if @netlify/blobs failed to load — never let this optional
  // safety net block the core feature from working.
  if (getStore) {
    const ip = event.headers['x-nf-client-connection-ip']
      || (event.headers['x-forwarded-for'] || '').split(',')[0].trim()
      || 'unknown';
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const blobKey = `${ip}_${today}`;

    try {
      const store = getStore('claude-proxy-ratelimits');
      const current = parseInt((await store.get(blobKey)) || '0', 10);
      if (current >= DAILY_LIMIT_PER_IP) {
        return {
          statusCode: 429,
          headers,
          body: JSON.stringify({ error: 'rate_limited', message: 'Daily AI request limit reached. Please try again tomorrow.' }),
        };
      }
      await store.set(blobKey, String(current + 1));
    } catch (e) {
      // If Blobs is unavailable for any reason, fail OPEN rather than breaking the feature —
      // the Anthropic spend cap remains the real backstop.
      console.error('Rate limit store error (continuing without it):', e.message);
    }
  }

  // ── Forward to Anthropic ────────────────────────────────────────────────────
  const modelId = model === 'smart'
    ? 'claude-sonnet-4-6'
    : 'claude-haiku-4-5-20251001';
  const safeMaxTok = Math.min(parseInt(maxTok, 10) || 300, MAX_TOKENS_CAP);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: modelId,
        max_tokens: safeMaxTok,
        system,
        messages: [{ role: 'user', content: user }],
      }),
    });
    clearTimeout(timeout);
    const data = await r.json();

    if (data.error) {
      console.error('Anthropic API error:', data.error.type, data.error.message);
      return { statusCode: 502, headers, body: JSON.stringify({ error: 'upstream_error', type: data.error.type }) };
    }

    const text = (data.content || []).map(c => c.text || '').join('');
    return { statusCode: 200, headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) };
  } catch (e) {
    clearTimeout(timeout);
    const reason = e.name === 'AbortError' ? 'timeout' : 'fetch_failed';
    console.error('Proxy fetch error:', reason, e.message);
    return { statusCode: 502, headers, body: JSON.stringify({ error: reason }) };
  }
};
