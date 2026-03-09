# 🇨🇿🇸🇰 CZ/SK Dubbing Filter — Stremio Addon

Stremio addon that filters [Torrentio](https://torrentio.strem.fun/) streams to **only show Czech and Slovak dubbed content**.

Supports both free (direct torrent) and [RealDebrid](https://real-debrid.com/) streaming.

---

## Deploy to Cloudflare Workers (free, recommended)

Cloudflare Workers are free (100k requests/day), always-on, and globally fast.

### Step 1 — Create a free Cloudflare account

Go to [cloudflare.com](https://cloudflare.com) and sign up. No credit card needed.

### Step 2 — Install Wrangler (Cloudflare's CLI)

Make sure you have [Node.js](https://nodejs.org) installed, then run:

```bash
npm install -g wrangler
```

### Step 3 — Log in to Cloudflare

```bash
wrangler login
```

This opens a browser window. Click **Allow** to authorize Wrangler.

### Step 4 — Deploy

```bash
cd cz-sk-filter
wrangler deploy
```

After about 10 seconds you'll see:

```
✅ Deployed to: https://cz-sk-filter.YOUR-SUBDOMAIN.workers.dev
```

That URL is your addon. Anyone can use it — share it freely.

### Step 5 — Install in Stremio

1. Open your worker URL in a browser (e.g. `https://cz-sk-filter.YOUR-SUBDOMAIN.workers.dev`)
2. Optionally enter your RealDebrid API key (from [real-debrid.com/apitoken](https://real-debrid.com/apitoken))
3. Click **Install in Stremio** — Stremio opens and asks you to confirm

---

## How to test if it's working in Stremio

### Where to find the addon in Stremio

After installing, the addon shows up as a **separate source** in the stream picker.

**Step-by-step:**

1. Open Stremio and search for any movie or series
2. Click on it to open the detail page
3. Click the **play button** or **Streams** tab
4. You'll see a **dropdown at the top** that says **"All"** — click it
5. You should see **"CZ/SK Dubbing Filter"** listed alongside your other addons (Torrentio, etc.)
6. Select it to see only CZ/SK dubbed streams

> **If it doesn't appear in the dropdown:** That title has no Czech or Slovak dubbed streams available on Torrentio. Try a popular Czech or Slovak movie/show instead.

### Quick test — movies known to have CZ/SK streams

These titles reliably have Czech/Slovak dubbed content on Torrentio:

- Search for **"Hra o trůny"** or any popular Hollywood blockbuster
- Look for streams labeled `🇨🇿`, `[CZ]`, `CZ dabing`, or `CZSK`

### Verify the addon is installed

Go to **Stremio → Addons** (puzzle icon). You should see **CZ/SK Dubbing Filter** in the list with a purple icon.

---

## How it works

```
Stremio → CZ/SK Filter → Torrentio API
               ↓
   Filters streams by CZ/SK keywords,
   flags 🇨🇿🇸🇰, and Czech/Slovak diacritics
               ↓
   Returns only matching streams to Stremio
```

Streams are matched by:
- Keywords: `CZ`, `SK`, `CZSK`, `[CZ]`, `(CZ)`, `czech`, `slovak`, `česky`, `slovensky`, `dabing`, `dabovano`, …
- Flags: 🇨🇿 🇸🇰
- Diacritics in stream names: `ř`, `ů`, `ě`, `ň`, `ť`, `ď`, `ä`, `ô`, `ŕ`, `ĺ`

---

## RealDebrid vs. free

| | Free (no debrid) | With RealDebrid |
|---|---|---|
| Speed | Depends on seeders | Instant (cached) |
| Quality | Variable | HD, stable |
| Cost | Free | ~€3/month |
| Setup | Just install | Paste API key |

---

## Running locally (for developers)

```bash
git clone https://github.com/TommyBandana/cz-sk-filter.git
cd cz-sk-filter
npm install
npm start
```

Then open `http://127.0.0.1:7000` in your browser and follow the configure page.

**With RealDebrid locally:**

```bash
TORRENTIO_URL="https://torrentio.strem.fun/realdebrid=YOUR_API_KEY" npm start
```

---

## Troubleshooting

**Addon not showing in the stream dropdown?**
The title has no CZ/SK dubbed streams on Torrentio. Try a different title.

**"CZ/SK Dubbing Filter" not in my addons list?**
Re-install from the configure page. Make sure you clicked "Install in Stremio" and confirmed in the popup.

**RealDebrid not working?**
Double-check your API key at [real-debrid.com/apitoken](https://real-debrid.com/apitoken) and re-install with the correct key.

---

## License

MIT
