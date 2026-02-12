# Reclaim Gmail ZKP — Integration Guide

**Live URL:** https://realadii.github.io/reclaim-gmail-zkp/
**Repo:** https://github.com/RealAdii/reclaim-gmail-zkp

---

## Quick Start

```bash
git clone https://github.com/RealAdii/reclaim-gmail-zkp.git
cd reclaim-gmail-zkp
cp .env.example .env   # Add your credentials
npm install
npm run dev             # http://localhost:5173
```

---

## Credentials

| Field | Format | Where to get |
|-------|--------|-------------|
| `VITE_APP_ID` | `0x` + 40 hex chars | [dev.reclaimprotocol.org](https://dev.reclaimprotocol.org) |
| `VITE_APP_SECRET` | `0x` + 64 hex chars | Same dashboard |
| `VITE_PROVIDER_ID` | UUID v4 | Same dashboard (Gmail provider) |
| `VITE_PROVIDER_NAME` | String | Display name (e.g., "Gmail") |

---

## Iframe Embedding

Embed the verification app in any website using an iframe.

### Basic Embed

```html
<iframe
  src="https://realadii.github.io/reclaim-gmail-zkp/"
  width="100%"
  height="700"
  style="border: none; border-radius: 12px;"
  allow="clipboard-read; clipboard-write"
  title="Gmail ZKP Verification"
></iframe>
```

### Responsive Embed

```html
<div style="position: relative; width: 100%; max-width: 600px; margin: 0 auto;">
  <iframe
    src="https://realadii.github.io/reclaim-gmail-zkp/"
    style="
      width: 100%;
      height: 80vh;
      min-height: 600px;
      max-height: 900px;
      border: none;
      border-radius: 12px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
    "
    allow="clipboard-read; clipboard-write"
    title="Gmail ZKP Verification"
  ></iframe>
</div>
```

### React Component Embed

```jsx
function GmailVerification() {
  return (
    <iframe
      src="https://realadii.github.io/reclaim-gmail-zkp/"
      style={{
        width: '100%',
        height: '80vh',
        minHeight: 600,
        border: 'none',
        borderRadius: 12,
      }}
      allow="clipboard-read; clipboard-write"
      title="Gmail ZKP Verification"
    />
  );
}
```

### Listening for Proof Results (postMessage)

To receive proof results in the parent page, you can extend the app to post messages on verification success. Add this to `App.jsx` after proof verification:

```js
// In the onSuccess callback inside handleVerify():
window.parent.postMessage(
  { type: 'reclaim-proof-verified', data: proofData },
  '*'
);
```

Then listen in the parent page:

```html
<script>
  window.addEventListener('message', (event) => {
    if (event.data?.type === 'reclaim-proof-verified') {
      console.log('Proof verified:', event.data.data);
      // Handle the verified proof data
    }
  });
</script>
```

---

## Project Structure

```
reclaim-gmail-zkp/
├── index.html              # Entry HTML with page title
├── vite.config.js          # Vite config (base path for GH Pages)
├── package.json            # Dependencies & scripts
├── .env                    # Credentials (gitignored)
├── .env.example            # Credential template
└── src/
    ├── main.jsx            # React entry point
    ├── config.js           # Env var exports
    ├── index.css           # Tailwind v4 theme (Revolut brand)
    ├── App.jsx             # Main app — verification flow logic
    └── components/
        ├── Header.jsx          # Fixed nav with Reclaim branding
        ├── VerifyButton.jsx    # Primary CTA button
        ├── VerificationIframe.jsx  # Full-screen verification overlay
        ├── ProofResult.jsx     # Extracted proof data display
        └── RawProofJson.jsx    # Collapsible raw JSON viewer
```

---

## How It Works

1. User clicks **Verify** button
2. App initializes `ReclaimProofRequest` with your APP_ID, APP_SECRET, and PROVIDER_ID
3. SDK generates a verification session URL
4. URL opens in a full-screen iframe overlay
5. User completes the verification flow (e.g., proves Gmail ownership)
6. On success, the SDK callback receives the ZK proof
7. App extracts and displays the verified data (email, etc.)
8. Raw proof JSON is available via the collapsible viewer

---

## Verification Flow (SDK)

```js
import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk';

// 1. Initialize
const proofRequest = await ReclaimProofRequest.init(APP_ID, APP_SECRET, PROVIDER_ID);

// 2. Get verification URL
const url = await proofRequest.getRequestUrl();

// 3. Listen for proof
await proofRequest.startSession({
  onSuccess: (proofData) => {
    // proofData contains the ZK proof with extracted parameters
    console.log('Verified:', proofData);
  },
  onError: (error) => {
    console.error('Verification failed:', error);
  },
});
```

---

## Theming

The app uses a **Revolut-inspired** dark theme via CSS variables in `src/index.css`. All components reference these variables, so you can retheme by editing the `@theme` block:

| Variable | Current Value | Purpose |
|----------|--------------|---------|
| `--color-neon` | `#6E4CE5` | Primary accent (purple) |
| `--color-cyan` | `#81B2F1` | Secondary accent (light blue) |
| `--color-bg-primary` | `#0A0A12` | Page background |
| `--color-bg-card` | `#0E0E18` | Card backgrounds |
| `--color-text-primary` | `#E8E8F0` | Main text |
| `--color-text-secondary` | `#8888A0` | Subdued text |
| `--color-border` | `#2A2A3E` | Borders |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (localhost:5173) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run deploy` | Build + deploy to GitHub Pages |

---

## Tech Stack

- **React 19** — UI framework
- **Vite 6** — Build tool
- **Tailwind CSS v4** — Styling (CSS-first config)
- **@reclaimprotocol/js-sdk** — Zero-knowledge proof verification
- **Fonts** — JetBrains Mono + Space Grotesk

---

## Security Notes

- `.env` is gitignored — credentials are not committed
- However, `APP_ID` and `APP_SECRET` are embedded in the built JS bundle (client-side app) and visible in browser devtools at runtime
- For production use, consider proxying the SDK initialization through a backend to keep `APP_SECRET` server-side
