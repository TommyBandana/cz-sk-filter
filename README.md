# 🇨🇿🇸🇰 CZ/SK Dubbing Filter — Stremio Addon

Stremio addon that filters [Torrentio](https://torrentio.strem.fun/) streams to **only show Czech and Slovak dubbed content**.

Supports both free (direct torrent) and [RealDebrid](https://real-debrid.com/) streaming.

---

## Install (no coding needed)

> The addon needs to be running somewhere for Stremio to connect to it.
> The easiest way is to deploy your own free instance on Render (takes ~3 minutes).

### Step 1 — Deploy to Render (free)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/TommyBandana/cz-sk-filter)

1. Click the button above (or go to [render.com](https://render.com) and sign up for free)
2. Connect your GitHub account when prompted
3. Click **Deploy** — Render will build and start the addon automatically
4. Wait ~1 minute for the build to finish
5. Render gives you a public URL like `https://cz-sk-filter.onrender.com`

> **Free tier note:** Render's free plan spins down after 15 minutes of inactivity. The first stream request after idle may take ~30 seconds to wake up. Subsequent requests are instant.

---

### Step 2 — Open the configure page

Visit your Render URL in a browser (e.g. `https://cz-sk-filter.onrender.com`).

You'll see this page:

- **Without RealDebrid** — just click **Install in Stremio** directly
- **With RealDebrid** — paste your API key from [real-debrid.com/apitoken](https://real-debrid.com/apitoken), then click **Install in Stremio**

---

### Step 3 — Done

Stremio opens automatically and asks you to confirm the install.
The addon now appears under **Addons** as **CZ/SK Dubbing Filter**.

When you open any movie or series, look for the **CZ/SK Dubbing Filter** section in the streams list — those are your Czech/Slovak dubbed results.

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
- Keywords: `CZ`, `SK`, `czech`, `slovak`, `česky`, `slovensky`, `cz dabing`, `sk dabing`, …
- Flags: 🇨🇿 🇸🇰
- Diacritics: `ř`, `ů`, `ě`, `ň`, `ť`, `ď`, `ä`, `ô`, `ŕ`, `ĺ`

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

### Environment variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `7000` | Server port |
| `TORRENTIO_URL` | `https://torrentio.strem.fun` | Torrentio base URL (with or without debrid config) |

---

## Troubleshooting

**No streams showing?**
Torrentio may not have CZ/SK dubbed content for that title. Check if the regular Torrentio addon shows any CZ/SK streams.

**Addon not loading after idle?**
Render free tier sleeps after 15 min. Wait ~30 seconds and try again.

**RealDebrid not working?**
Double-check your API key at [real-debrid.com/apitoken](https://real-debrid.com/apitoken).

---

## License

MIT
