# CZ/SK Dubbing Filter — Stremio Addon

Stremio addon that filters [Torrentio](https://torrentio.strem.fun/) streams to **only show Czech and Slovak dubbed content**.

Runs locally on your computer. Supports both free (direct torrent) and [RealDebrid](https://real-debrid.com/) streaming.

---

## Requirements

- [Node.js](https://nodejs.org) (version 14 or newer)
- [Stremio](https://www.stremio.com/) desktop app
- [Torrentio](https://torrentio.strem.fun/) addon installed in Stremio

---

## Installation

### Step 1 — Download and install

```bash
git clone https://github.com/TommyBandana/cz-sk-filter.git
cd cz-sk-filter
npm install
```

### Step 2 — Start the addon

```bash
npm start
```

You should see:

```
🇨🇿🇸🇰  CZ/SK Dubbing Filter running

  Configure page : http://127.0.0.1:7000/
  Manifest (free): http://127.0.0.1:7000/manifest.json
```

### Step 3 — Install in Stremio

1. Open `http://127.0.0.1:7000` in your browser
2. Optionally enter your RealDebrid API key (from [real-debrid.com/apitoken](https://real-debrid.com/apitoken))
3. Click **Install in Stremio** — Stremio opens and asks you to confirm

> **Note:** The addon must be running (`npm start`) whenever you use Stremio. If you close the terminal, the addon stops.

---

## How to use in Stremio

1. Open Stremio and search for any movie or series
2. Click on it to open the detail page
3. Click the **play button** or **Streams** tab
4. You'll see a **dropdown at the top** that says **"All"** — click it
5. Select **"CZ/SK Dubbing Filter"** to see only CZ/SK dubbed streams

> **If it doesn't appear in the dropdown:** That title has no Czech or Slovak dubbed streams on Torrentio. Try a popular Hollywood blockbuster — those usually have CZ/SK dubs.

### Verify the addon is installed

Go to **Stremio → Addons** (puzzle icon). You should see **CZ/SK Dubbing Filter** in the list.

---

## How it works

```
Stremio → CZ/SK Filter (local) → Torrentio API
                 ↓
     Filters streams by CZ/SK keywords,
     flags, and Czech/Slovak diacritics
                 ↓
     Returns only matching streams to Stremio
```

Streams are matched by:
- Keywords: `CZ`, `SK`, `CZSK`, `[CZ]`, `(CZ)`, `czech`, `slovak`, `dabing`, `dabovano`, ...
- Flags: 🇨🇿 🇸🇰
- Czech/Slovak diacritics: `ř`, `ů`, `ě`, `ň`, `ť`, `ď`, `ä`, `ô`, `ŕ`, `ĺ`

---

## RealDebrid (optional)

[RealDebrid](https://real-debrid.com/) (~€3/month) gives you instant cached streams instead of slow direct torrents.

To use it:
1. Get your API key from [real-debrid.com/apitoken](https://real-debrid.com/apitoken)
2. Paste it in the configure page (`http://127.0.0.1:7000`) before installing

---

## Troubleshooting

**Addon not showing in the stream dropdown?**
The title has no CZ/SK dubbed streams on Torrentio. Try a different title.

**"CZ/SK Dubbing Filter" not in my addons list?**
Re-install from `http://127.0.0.1:7000`. Make sure you clicked "Install in Stremio" and confirmed.

**Addon stopped working?**
Make sure the server is still running (`npm start` in the terminal). The addon only works while the server is running.

**RealDebrid not working?**
Double-check your API key at [real-debrid.com/apitoken](https://real-debrid.com/apitoken) and re-install with the correct key.

---

## License

MIT
