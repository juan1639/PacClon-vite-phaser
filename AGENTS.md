# AGENTS.md — PacClon-vite-phaser

## Quick commands (from `package.json`)
- `npm install` — install deps
- `npm run dev` — dev server via Vite (`vite --config vite/config.dev.mjs`), runs on `http://localhost:8080` (see `vite/config.dev.mjs`)
- `npm run build` — production build via Vite (`vite build --config vite/config.prod.mjs`), outputs to `dist/`
- `npm run predeploy` / `npm run deploy` — build then deploy `dist/` to GitHub Pages with `gh-pages`

## Entrypoints & structure
- `index.html` loads `phaser.min.js` via `<script>` and the app via `src/main.js` (module). Phaser is also listed as dependency (`phaser ^3.80.1`).
- `src/main.js` — creates `Phaser.Game` with config (800x550, `Phaser.AUTO`, arcade physics `debug: false`, FIT scale centered). Scene order: `Boot`, `Preloader`, `MainMenu`, `Game`, `Congratulations`.
- Scenes: `src/scenes/{Boot,Preloader,MainMenu,Game,congratulations,settings}.js` (note `congratulations.js` filename casing).
- Components/utils: `src/components/`, `src/utils/`.
- Static assets live in `public/assets/`; Vite copies them on build. You can also `import` assets in modules.

## Build/Vite notes
- Dev config: `vite/config.dev.mjs` sets `base: './'`, manual chunk `phaser` -> `['phaser']`, server port 8080.
- Prod config: `vite/config.prod.mjs` sets `base: './'`, `logLevel: 'warning'`, `minify: 'terser'` with passes/mangling/comments stripped, manual chunk for phaser, adds custom `phasermsg` plugin. 
- Both configs split Phaser into its own chunk via `manualChunks`.

## Gotchas
- Both a local `phaser.min.js` (committed) and npm `phaser` dependency exist; `index.html` includes the script tag explicitly — be careful not to double-load or change loading order.
- Scene file `congratulations.js` is imported as `Congratulations` in `main.js` (lowercase filename) — respect existing casing.
- Deploy uses `gh-pages -d dist` (base `./` in Vite configs so it works on Pages).

## Preferencias del usuario
- Responde siempre en español.
- Antes de cambios grandes, explica el plan y espera confirmación.
- Cambios pequeños y comentados; no reescribas ficheros enteros si no hace falta.
- No hay tests: para comprobar cambios, indica qué probar con `npm run dev` en el navegador.

## Publicación
- El juego se publica también en itch.io (build de `dist/` subido como HTML5), además de GitHub Pages.
- Mantener `base: './'` en Vite para que funcione en ambos sitios.

## Controles
- El juego debe funcionar con teclado y con controles táctiles.
