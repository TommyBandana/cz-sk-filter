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

### Step 3 — Create an HTTPS tunnel

Stremio requires an HTTPS address — it cannot install addons from `http://127.0.0.1`. You need to create a free HTTPS tunnel to your local server.

**Download and run Cloudflare Tunnel:**

```bash
# macOS (Intel)
curl -sL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-darwin-amd64.tgz -o /tmp/cloudflared.tgz && tar -xzf /tmp/cloudflared.tgz -C /tmp/

# macOS (Apple Silicon / M1, M2, M3)
curl -sL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-darwin-arm64.tgz -o /tmp/cloudflared.tgz && tar -xzf /tmp/cloudflared.tgz -C /tmp/

# Windows — download from:
# https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe

# Linux
curl -sL https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o /tmp/cloudflared && chmod +x /tmp/cloudflared
```

**Start the tunnel** (in a new terminal window, keep the first one running):

```bash
/tmp/cloudflared tunnel --url http://127.0.0.1:7000
```

After a few seconds you'll see something like:

```
Your quick Tunnel has been created! Visit it at:
https://some-random-words.trycloudflare.com
```

Copy that HTTPS URL — you'll need it in the next step.

> **Note:** The tunnel URL changes every time you restart `cloudflared`. If you restart it, you'll need to re-install the addon in Stremio with the new URL.

### Step 4 — Install in Stremio

1. Open your tunnel URL in a browser (e.g. `https://some-random-words.trycloudflare.com`) — you should see the configure page
2. Optionally enter your RealDebrid API key (from [real-debrid.com/apitoken](https://real-debrid.com/apitoken))
3. Click **Install in Stremio** — Stremio opens and asks you to confirm

> **If the "Install in Stremio" button doesn't work**, go to **Stremio → Addons** (puzzle icon), paste the manifest URL into the search field and click Install:
> ```
> https://some-random-words.trycloudflare.com/manifest.json
> ```

---

## Running the addon

Every time you want to use the addon, you need **two terminal windows** running:

**Terminal 1 — addon server:**
```bash
cd cz-sk-filter
npm start
```

**Terminal 2 — HTTPS tunnel:**
```bash
/tmp/cloudflared tunnel --url http://127.0.0.1:7000
```

If you close either of these, the addon stops working in Stremio.

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
2. Paste it in the configure page before installing

---

## Troubleshooting

**Addon not showing in the stream dropdown?**
That title has no CZ/SK dubbed streams on Torrentio. Try a different title.

**"CZ/SK Dubbing Filter" not in my addons list?**
Re-install from the configure page (your tunnel URL). Make sure you clicked "Install in Stremio" and confirmed.

**Addon stopped working?**
Make sure both `npm start` and `cloudflared tunnel` are running. If you restarted `cloudflared`, the URL changed — re-install the addon with the new URL.

**"Install in Stremio" button doesn't work in browser?**
Manually go to Stremio → Addons → paste the manifest URL (`https://your-tunnel-url.trycloudflare.com/manifest.json`) and click Install.

**RealDebrid not working?**
Double-check your API key at [real-debrid.com/apitoken](https://real-debrid.com/apitoken) and re-install with the correct key.

---

## License

MIT
