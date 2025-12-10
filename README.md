# QuoteSnap

Server-rendered quote-to-image generator built with Next.js (App Router), TypeScript, and `@napi-rs/canvas`.

## Quick start

```bash
npm install
npm run dev
```

API: `POST /api/render` with `{ "text": "...", "template": "typewriter" | "cosmic" | "nebula" | "cloudy" }` returns a 1080x1350 PNG.

## Deployment

`npm run build` should succeed without additional config. If deploying to Vercel, ensure the `main` branch is selected and cache is cleared when testing font or asset changes.
