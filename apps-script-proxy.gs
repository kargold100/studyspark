/**
 * StudySpark AI Proxy — Google Apps Script version
 * =================================================
 * Holds the Anthropic API key server-side (in Script Properties), so no
 * visitor to StudySpark (on GitHub Pages or Netlify) ever needs their own key.
 *
 * SETUP (one-time):
 * 1. Go to script.google.com → New project
 * 2. Delete any starter code in Code.gs, paste this whole file in instead
 * 3. Click the gear icon (Project Settings) on the left → scroll to
 *    "Script Properties" → Add property:
 *      Property: ANTHROPIC_API_KEY
 *      Value:    (paste your actual key here)
 * 4. Click Deploy → New deployment
 *      Type: Web app
 *      Execute as: Me
 *      Who has access: Anyone   <-- IMPORTANT: must be "Anyone", not
 *                                   "Anyone with Google account", so it
 *                                   works for visitors who aren't logged in
 * 5. Click Deploy, authorise the permissions it asks for (this is your own
 *    script asking to call an external URL — that's expected and safe)
 * 6. Copy the "Web app URL" it gives you — looks like:
 *      https://script.google.com/macros/s/AKfycb.../exec
 *    That's the URL to put into PROXY_URL in js/app.js.
 *
 * DEBUGGING: open this same script project → "Executions" in the left
 * sidebar. Every single request shows up there, with the exact error if
 * one occurred — no separate dashboard, no guessing.
 *
 * NOTE: every time you change this code, you must create a NEW deployment
 * (Deploy → Manage deployments → pencil icon → New version) for the change
 * to actually take effect on the live URL. This trips a lot of people up.
 */

var MAX_TOKENS_CAP = 500;       // hard ceiling per request
var MAX_INPUT_CHARS = 4000;     // reject absurdly long prompts
var GLOBAL_DAILY_LIMIT = 300;   // total requests/day across ALL visitors combined

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var system = data.system || '';
    var user = data.user || '';
    var maxTok = Math.min(parseInt(data.maxTok, 10) || 300, MAX_TOKENS_CAP);
    var model = data.model === 'smart' ? 'claude-sonnet-4-6' : 'claude-haiku-4-5-20251001';

    if (!user || !user.toString().trim()) {
      return jsonResponse({ error: 'missing_user_message' });
    }
    if (String(system).length > MAX_INPUT_CHARS || String(user).length > MAX_INPUT_CHARS) {
      return jsonResponse({ error: 'input_too_long' });
    }

    if (!checkAndIncrementDailyLimit()) {
      return jsonResponse({ error: 'rate_limited', message: 'Daily AI request limit reached site-wide. Try again tomorrow.' });
    }

    var apiKey = PropertiesService.getScriptProperties().getProperty('ANTHROPIC_API_KEY');
    if (!apiKey) {
      return jsonResponse({ error: 'server_not_configured' });
    }

    var response = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
      method: 'post',
      contentType: 'application/json',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      payload: JSON.stringify({
        model: model,
        max_tokens: maxTok,
        system: system,
        messages: [{ role: 'user', content: user }]
      }),
      muteHttpExceptions: true
    });

    var result = JSON.parse(response.getContentText());

    if (result.error) {
      Logger.log('Anthropic API error: ' + result.error.type + ' — ' + result.error.message);
      return jsonResponse({ error: 'upstream_error', type: result.error.type, message: result.error.message });
    }

    var text = '';
    if (result.content) {
      for (var i = 0; i < result.content.length; i++) {
        text += result.content[i].text || '';
      }
    }
    return jsonResponse({ text: text });

  } catch (err) {
    Logger.log('Proxy error: ' + err.message);
    return jsonResponse({ error: 'server_error', message: err.message });
  }
}

// Visit the deployed URL directly in a browser to use this — confirms the
// key is configured without needing to test a real AI request.
function doGet(e) {
  var apiKey = PropertiesService.getScriptProperties().getProperty('ANTHROPIC_API_KEY');
  return jsonResponse({
    ok: true,
    message: 'StudySpark AI proxy (Apps Script) is deployed and reachable.',
    anthropicKeyConfigured: !!apiKey
  });
}

function checkAndIncrementDailyLimit() {
  var props = PropertiesService.getScriptProperties();
  var today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  var countKey = 'count_' + today;
  var count = parseInt(props.getProperty(countKey) || '0', 10);
  if (count >= GLOBAL_DAILY_LIMIT) return false;
  props.setProperty(countKey, String(count + 1));
  return true;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
