# Analog Clock (Vite + React + TypeScript + Tailwind)

Small analog clock demo built with Vite, React, TypeScript and Tailwind CSS.
Features:
- Smooth analog hands (requestAnimationFrame).
- Time zone selection.
- Responsive and accessible SVG clock.
- Light / dark theme.

Quickstart:
1. Install
   - npm: `npm install`
   - or pnpm: `pnpm install`

2. Dev
   - `npm run dev` (or `pnpm dev`)
   - Open http://localhost:5173

3. Build
   - `npm run build`
   - `npm run preview` to preview the production build.

Notes:
- The clock computes timezone-local hour/minute/second via Intl.DateTimeFormat formatToParts so no external timezone library is needed.
- If you'd like me to push this into your repo `chocolateaiden12/code-visuals`, tell me and I will create a branch and push the files.
