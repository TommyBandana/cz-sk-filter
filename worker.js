// CZ/SK Dubbing Filter — Cloudflare Worker
// Uses native fetch() — no npm dependencies needed

// --- Input validation ---
const VALID_TYPES = new Set(['movie', 'series']);
const VALID_ID = /^tt\d+(:\d+:\d+)?$/;

// --- CZ/SK detection ---
const CZ_SK_KEYWORDS = [
  // Basic language codes
  'CZ', 'SK', 'CZSK', 'CZ-SK', 'CZ+SK',
  // Bracketed / parenthesised tags common in torrent names
  '[CZ]', '(CZ)', '[SK]', '(SK)',
  // Full language names
  'czech', 'slovak',
  'česky', 'slovensky',
  // Dubbing — English variants
  'cz dub', 'sk dub',
  'cz dabing', 'sk dabing',
  'czech dub', 'slovak dub',
  'czech dubbed', 'slovak dubbed',
  // Dubbing — Czech/Slovak words
  'dabing',
  'dabovano',
  'dabovany',
  'dabované',
  // Audio-specific tags
  'cz audio', 'sk audio',
  'czech audio', 'slovak audio',
  // Common torrent release naming: quality.LANG
  'WEBRip.CZ', 'BluRay.CZ',
  'WEBRip.SK', 'BluRay.SK',
  // Flags
  '🇨🇿', '🇸🇰',
];
const CZ_SK_DIACRITICS = /[řůěňťďäôŕĺ]/;

function hasCzSkDubbing(stream) {
  const haystack = [stream.name || '', stream.description || '', stream.title || ''].join(' ');
  return CZ_SK_DIACRITICS.test(haystack) ||
    CZ_SK_KEYWORDS.some(kw => haystack.toLowerCase().includes(kw.toLowerCase()));
}

// --- Manifest ---
function buildManifest(rdKey) {
  return {
    id: 'community.czsk.filter',
    version: '1.0.0',
    name: 'CZ/SK Dubbing Filter',
    description: 'Shows only Czech and Slovak dubbed streams from Torrentio.' +
      (rdKey ? ' (RealDebrid enabled)' : ''),
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_the_Czech_Republic.svg/320px-Flag_of_the_Czech_Republic.svg.png',
    resources: ['stream'],
    types: ['movie', 'series'],
    idPrefixes: ['tt'],
    catalogs: [],
    behaviorHints: { configurable: true },
  };
}

// --- Stream fetcher ---
async function fetchFilteredStreams(rdKey, type, id) {
  const base = rdKey
    ? `https://torrentio.strem.fun/realdebrid=${rdKey}`
    : 'https://torrentio.strem.fun';

  const url = `${base}/stream/${type}/${encodeURIComponent(id)}.json`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'CZSKFilter/1.0 Stremio-Addon' },
      cf: { cacheTtl: 3600 }, // Cloudflare edge cache
    });
    if (!res.ok) throw new Error(`Torrentio responded with ${res.status}`);
    const data = await res.json();
    const streams = data.streams || [];
    return streams.filter(hasCzSkDubbing);
  } catch (err) {
    console.error(`[CZ/SK Filter] Error fetching ${url}:`, err.message);
    return [];
  }
}

// --- CORS + JSON response helper ---
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}

// --- Configure page HTML ---
const CONFIGURE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CZ/SK Dubbing Filter — Stremio Addon</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #141414;
      color: #e0e0e0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .card {
      background: #1f1f1f;
      border-radius: 12px;
      padding: 2.5rem;
      max-width: 520px;
      width: 100%;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    }
    .flags { font-size: 2.8rem; text-align: center; margin-bottom: 1rem; }
    h1 { font-size: 1.6rem; font-weight: 700; text-align: center; margin-bottom: .4rem; }
    .subtitle { text-align: center; color: #888; font-size: .95rem; margin-bottom: 2rem; }
    .section { margin-bottom: 1.5rem; }
    label { display: block; font-size: .85rem; color: #aaa; margin-bottom: .5rem; font-weight: 500; }
    input[type="text"] {
      width: 100%;
      background: #2a2a2a;
      border: 1px solid #383838;
      border-radius: 8px;
      color: #e0e0e0;
      padding: .75rem 1rem;
      font-size: .95rem;
      outline: none;
      transition: border-color .2s;
    }
    input[type="text"]:focus { border-color: #d4af37; }
    input[type="text"]::placeholder { color: #555; }
    .hint { font-size: .78rem; color: #666; margin-top: .4rem; }
    .hint a { color: #d4af37; text-decoration: none; }
    .hint a:hover { text-decoration: underline; }
    .btn {
      display: block;
      width: 100%;
      padding: .85rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: opacity .15s;
      text-align: center;
    }
    .btn:hover { opacity: .85; }
    .btn-primary { background: #7b2d8b; color: #fff; margin-bottom: .75rem; }
    .btn-secondary { background: #2a2a2a; color: #ccc; border: 1px solid #383838; }
    .divider { text-align: center; color: #444; font-size: .8rem; margin: 1.2rem 0; }
    .how { background: #272727; border-radius: 8px; padding: 1.2rem 1.4rem; }
    .how p { font-size: .85rem; color: #888; line-height: 1.6; }
    .how strong { color: #ccc; }
  </style>
</head>
<body>
  <div class="card">
    <div class="flags">🇨🇿 🇸🇰</div>
    <h1>CZ/SK Dubbing Filter</h1>
    <p class="subtitle">Stremio addon — shows only Czech &amp; Slovak dubbed streams</p>

    <div class="section">
      <label for="rdKey">RealDebrid API Key <span style="color:#555;font-weight:400">(optional)</span></label>
      <input type="text" id="rdKey" placeholder="Leave empty for free / direct torrents" />
      <p class="hint">
        Find your key at <a href="https://real-debrid.com/apitoken" target="_blank">real-debrid.com/apitoken</a>
      </p>
    </div>

    <button class="btn btn-primary" onclick="install()">Install in Stremio</button>
    <button class="btn btn-secondary" onclick="copyLink()">Copy install link</button>

    <div class="divider">— how it works —</div>
    <div class="how">
      <p>
        This addon <strong>proxies Torrentio</strong> and filters streams to only show those with
        Czech or Slovak dubbing — based on keywords, flags 🇨🇿🇸🇰, and Czech/Slovak diacritics.
        <br/><br/>
        Without a RealDebrid key you get <strong>direct torrent streams</strong> (may be slow).
        With RealDebrid you get <strong>instant cached streams</strong>.
      </p>
    </div>
  </div>

  <script>
    function getInstallUrl() {
      const key = document.getElementById('rdKey').value.trim();
      const base = window.location.origin;
      return key
        ? base + '/rd=' + encodeURIComponent(key) + '/manifest.json'
        : base + '/manifest.json';
    }
    function install() {
      const manifestUrl = getInstallUrl();
      window.location.href = 'stremio://' + manifestUrl.replace(/^https?:\\/\\//, '');
    }
    function copyLink() {
      navigator.clipboard.writeText(getInstallUrl()).then(() => {
        const btn = document.querySelectorAll('.btn')[1];
        const orig = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = orig, 2000);
      });
    }
  </script>
</body>
</html>`;

// --- Main Worker handler ---
export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    // Only handle GET
    if (request.method !== 'GET') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    let path = url.pathname;

    // --- Configure / landing page ---
    if (path === '/' || path === '/configure') {
      return new Response(CONFIGURE_HTML, {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' },
      });
    }

    // --- Parse optional RD key from path prefix ---
    // Matches: /rd=APIKEY/manifest.json  or  /rd=APIKEY/stream/...
    let rdKey = null;
    const rdMatch = path.match(/^\/rd=([a-zA-Z0-9]{20,60})(\/.*)?$/);
    if (rdMatch) {
      rdKey = rdMatch[1];
      path = rdMatch[2] || '/';
    }

    // --- Manifest ---
    if (path === '/manifest.json') {
      return jsonResponse(buildManifest(rdKey));
    }

    // --- Stream endpoint: /stream/:type/:id.json ---
    const streamMatch = path.match(/^\/stream\/(movie|series)\/([^/]+)\.json$/);
    if (streamMatch) {
      const [, type, id] = streamMatch;
      if (!VALID_ID.test(id)) return jsonResponse({ streams: [] });
      const streams = await fetchFilteredStreams(rdKey, type, id);
      return jsonResponse({ streams, cacheMaxAge: 3600, staleRevalidate: 14400 });
    }

    return new Response('Not Found', { status: 404 });
  },
};
