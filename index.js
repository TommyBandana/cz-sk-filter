const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const fetch = require('node-fetch');

// --- Configuration via environment variables ---
// TORRENTIO_URL: Full Torrentio base URL (with or without debrid config)
//   Without debrid: https://torrentio.strem.fun
//   With RealDebrid: https://torrentio.strem.fun/realdebrid=YOUR_API_KEY
const TORRENTIO_BASE = (process.env.TORRENTIO_URL || 'https://torrentio.strem.fun').replace(/\/+$/, '');
const PORT = parseInt(process.env.PORT, 10) || 7000;

// --- Input validation ---
const VALID_TYPES = new Set(['movie', 'series']);
const VALID_ID = /^tt\d+(:\d+:\d+)?$/; // tt1234567 or tt1234567:1:2 for series

// Keywords that indicate Czech or Slovak dubbing in stream names/descriptions
const CZ_SK_KEYWORDS = [
  'CZ', 'SK',
  'czech', 'slovak',
  'česky', 'slovensky',
  'cz dub', 'sk dub',
  'cz dabing', 'sk dabing',
  'czech dub', 'slovak dub',
  'czech dubbed', 'slovak dubbed',
  '🇨🇿', '🇸🇰',
];

// Czech and Slovak specific diacritic characters — their presence strongly suggests CZ/SK content
const CZ_SK_DIACRITICS = /[řůěňťďäôŕĺ]/;

function hasCzSkDubbing(stream) {
  const haystack = [stream.name || '', stream.description || '', stream.title || '']
    .join(' ');

  return CZ_SK_DIACRITICS.test(haystack) ||
    CZ_SK_KEYWORDS.some(kw => haystack.toLowerCase().includes(kw.toLowerCase()));
}

const manifest = {
  id: 'community.czsk.filter',
  version: '1.0.0',
  name: 'CZ/SK Dubbing Filter',
  description: 'Filters Torrentio streams to only show Czech and Slovak dubbed content.',
  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Flag_of_the_Czech_Republic.svg/320px-Flag_of_the_Czech_Republic.svg.png',
  resources: ['stream'],
  types: ['movie', 'series'],
  idPrefixes: ['tt'],
  catalogs: [],
  behaviorHints: {
    configurable: false,
  },
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler(async ({ type, id }) => {
  // Validate inputs to prevent SSRF
  if (!VALID_TYPES.has(type)) {
    console.warn(`[CZ/SK Filter] Rejected invalid type: ${type}`);
    return { streams: [] };
  }
  if (!VALID_ID.test(id)) {
    console.warn(`[CZ/SK Filter] Rejected invalid id: ${id}`);
    return { streams: [] };
  }

  const url = `${TORRENTIO_BASE}/stream/${type}/${encodeURIComponent(id)}.json`;
  console.log(`[CZ/SK Filter] Fetching: ${url}`);

  let streams = [];
  try {
    const res = await fetch(url, { timeout: 15000 });
    if (!res.ok) throw new Error(`Torrentio responded with ${res.status}`);
    const data = await res.json();
    streams = data.streams || [];
  } catch (err) {
    console.error('[CZ/SK Filter] Error fetching from Torrentio:', err.message);
    return { streams: [] };
  }

  const filtered = streams.filter(hasCzSkDubbing);
  console.log(`[CZ/SK Filter] ${filtered.length}/${streams.length} streams matched CZ/SK dubbing`);

  return {
    streams: filtered,
    cacheMaxAge: 3600,
    staleRevalidate: 14400,
  };
});

const addonInterface = builder.getInterface();

serveHTTP(addonInterface, { port: PORT });

console.log('');
console.log(`CZ/SK Dubbing Filter addon running on port ${PORT}`);
console.log('');
console.log('Install in Stremio:');
console.log(`  http://127.0.0.1:${PORT}/manifest.json`);
console.log('');
