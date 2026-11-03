# AGENTS.md — PacClon-vite-phaser

## Quick commands (from `package.json`)
- `npm install` — install deps
- `npm run dev` — dev server via Vite (`vite --config vite/config.dev.mjs`), runs on `http://localhost:8080` (see `vite/config.dev.mjs`)
- `npm run build` — production build via Vite (`vite build --config vite/config.prod.mjs`), outputs to `dist/`
- `npm run predeploy` / `npm run deploy` — legacy: build then push `dist/` to the `gh-pages` branch with `gh-pages` (the live site uses GitHub Actions now)

## Entrypoints & structure
- `index.html` carga `src/main.js` (módulo) y define una CSP en un `<meta>`; Phaser se empaqueta desde la dependencia npm (`phaser ^3.90.0`).
- `src/main.js` — creates `Phaser.Game` with config (800x550, `Phaser.AUTO`, arcade physics `debug: false`, FIT scale centered). Scene order: `Boot`, `Preloader`, `MainMenu`, `Game`, `Congratulations`.
- Scenes: `src/scenes/{Boot,Preloader,MainMenu,Game,Congratulations,settings}.js` (ojo: `settings.js` es una clase de estado estático, no una escena).
- Components/utils: `src/components/`, `src/utils/`.
- Static assets live in `public/assets/`; Vite copies them on build. You can also `import` assets in modules.

## Build/Vite notes
- Dev config: `vite/config.dev.mjs` sets `base: './'`, manual chunk `phaser` -> `['phaser']`, server port 8080.
- Prod config: `vite/config.prod.mjs` sets `base: './'`, `logLevel: 'warning'`, `minify: 'terser'` with passes/mangling/comments stripped, manual chunk for phaser, adds custom `phasermsg` plugin. 
- Both configs split Phaser into its own chunk via `manualChunks`.

## Gotchas
- Phaser se carga desde npm y Vite lo separa en su propio chunk (`phaser-*.js`); no hay `phaser.min.js` local que cargar aparte.
- `src/scenes/Congratulations.js` se importa como `Congratulations` en `main.js` — respeta el camel/PascalCase de los ficheros.
- `index.html` incluye una CSP (`Content-Security-Policy`) porque GitHub Pages no permite cabeceras propias: si añades scripts, estilos, fuentes o peticiones externas, hay que ampliar la directiva correspondiente.
- El deploy oficial es `.github/workflows/deploy.yml` (`actions/deploy-pages`) al hacer push a `main`; requiere que Pages tenga **Source: GitHub Actions**. `npm run deploy` (gh-pages) queda como fallback manual.
- `public/.nojekyll` se copia a `dist/` en el build (por si se vuelve a publicar desde una rama).

## Preferencias del usuario
- Responde siempre en español.
- Antes de cambios grandes, explica el plan y espera confirmación.
- Cambios pequeños y comentados; no reescribas ficheros enteros si no hace falta.
- No hay tests: para comprobar cambios, indica qué probar con `npm run dev` en el navegador.

## Publicación
- GitHub Pages se publica automáticamente con `.github/workflows/deploy.yml` al hacer push a `main` (Source: GitHub Actions).
- El juego se publica también en itch.io (build de `dist/` subido a mano como HTML5), además de GitHub Pages.
- Mantener `base: './'` en Vite para que funcione en ambos sitios.

## Controles
- El juego debe funcionar con teclado y con controles táctiles.
