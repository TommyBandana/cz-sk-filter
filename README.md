# CZ/SK Dubbing Filter for Stremio

Stremio addon that filters [Torrentio](https://torrentio.strem.fun/) streams to **only show content with Czech and Slovak dubbing**.

It works by proxying Torrentio — when you search for a movie or series in Stremio, this addon fetches all available streams from Torrentio and returns only those that match Czech/Slovak language indicators.

## What it filters for

- Keywords: `CZ`, `SK`, `czech`, `slovak`, `česky`, `slovensky`, `cz dabing`, `sk dabing`, and more
- Czech/Slovak diacritics in stream names: `ř`, `ů`, `ě`, `ň`, `ť`, `ď`, `ä`, `ô`, `ŕ`, `ĺ`
- Flags: 🇨🇿, 🇸🇰

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) v14 or higher
- [Stremio](https://www.stremio.com/) installed on your device
- (Optional) [Torrentio](https://torrentio.strem.fun/) addon installed in Stremio
- (Optional) [RealDebrid](https://real-debrid.com/) account for cached torrent streaming

### Step 1: Download and install

```bash
git clone https://github.com/YOUR_USERNAME/cz-sk-filter.git
cd cz-sk-filter
npm install
```

### Step 2: Configure (choose your variant)

#### Variant A: Without debrid (free, direct torrents)

No configuration needed. Just run it:

```bash
npm start
```

#### Variant B: With RealDebrid

1. Get your RealDebrid API key from: https://real-debrid.com/apitoken
2. Create a `.env` file (or copy the example):

```bash
cp .env.example .env
```

3. Edit `.env` and set your RealDebrid API key:

```env
TORRENTIO_URL=https://torrentio.strem.fun/realdebrid=YOUR_API_KEY
```

> **Tip:** You can also get the exact URL by going to https://torrentio.strem.fun, configuring your debrid provider, and copying the base URL from the install link (everything before `/manifest.json`).

4. Install `dotenv` so the `.env` file is loaded automatically:

```bash
npm install dotenv
```

Then add this as the **very first line** of `index.js`:

```js
require('dotenv').config();
```

5. Run it:

```bash
npm start
```

**Alternative:** You can also pass the URL directly without a `.env` file:

```bash
TORRENTIO_URL="https://torrentio.strem.fun/realdebrid=YOUR_API_KEY" npm start
```

### Step 3: Install the addon in Stremio

Once the addon is running, you'll see output like:

```
CZ/SK Dubbing Filter addon running on port 7000
Install in Stremio:
  http://127.0.0.1:7000/manifest.json
```

**To install:**

1. Open **Stremio**
2. Go to the **Addons** page (puzzle icon)
3. Click the **search/URL bar** at the top
4. Paste: `http://127.0.0.1:7000/manifest.json`
5. Click **Install**

The addon will now appear as **CZ/SK Dubbing Filter** in your addons list.

### Step 4: Use it

1. Search for any movie or series in Stremio
2. Open it and go to the **Streams** tab
3. You will see streams from **CZ/SK Dubbing Filter** — these are only the Czech/Slovak dubbed results from Torrentio

> **Note:** The addon only shows results when Czech or Slovak dubbed content is available on Torrentio. If you see no streams, it means no CZ/SK dubbed version was found for that title.

---

## Configuration options

| Environment variable | Default | Description |
|---|---|---|
| `TORRENTIO_URL` | `https://torrentio.strem.fun` | Torrentio base URL (with or without debrid config) |
| `PORT` | `7000` | Port the addon server listens on |

---

## Running on a server (remote access)

If you want to access the addon from multiple devices (phone, TV, etc.), you can deploy it on a server:

1. Deploy to any Node.js hosting (VPS, Railway, Render, etc.)
2. Make sure HTTPS is enabled (required by Stremio for remote addons)
3. Set the `PORT` environment variable if your host requires a specific port
4. Install in Stremio using: `https://your-domain.com/manifest.json`

---

## How it works

```
Stremio → CZ/SK Filter addon → Torrentio API
                ↓
        Filters streams for CZ/SK keywords
                ↓
        Returns only matching streams to Stremio
```

1. Stremio sends a stream request (e.g. "get streams for movie tt1234567")
2. The addon forwards the request to Torrentio's API
3. Torrentio returns all available streams
4. The addon filters them — keeping only streams whose name or description contain Czech/Slovak language indicators
5. The filtered list is returned to Stremio

---

## Troubleshooting

**No streams showing up?**
- Make sure the addon is running (`npm start`)
- Make sure Torrentio itself has streams for that title (check with the regular Torrentio addon)
- Not all content has CZ/SK dubbing available

**Port already in use?**
- Change the port: `PORT=7001 npm start`

**RealDebrid not working?**
- Double-check your API key at https://real-debrid.com/apitoken
- Make sure the full URL is correct in your `.env` file

---

## License

MIT
