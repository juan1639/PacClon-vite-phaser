# AGENTS.md — PacClon-vite-phaser

Clon de Pac-Man hecho con Phaser 3.90 y Vite 5, en JavaScript (módulos ES, sin TypeScript).

## Comandos (de `package.json`)
- `npm install`: instala las dependencias.
- `npm run dev`: servidor de desarrollo con Vite (`vite/config.dev.mjs`) en `http://localhost:8080`.
- `npm run build`: build de producción (`vite/config.prod.mjs`) en `dist/`.
- `npm run preview`: sirve `dist/` en local (normalmente `http://localhost:4173`) para probar el build.

## Estructura
- `index.html` carga `src/main.js` como módulo y define una CSP en un `<meta>`. Phaser se empaqueta desde npm (`phaser ^3.90.0`).
- `src/main.js` crea el `Phaser.Game`: 800x550, `Phaser.AUTO`, física arcade (`debug: false`), escala FIT centrada.
  Orden de escenas: `Boot` → `Preloader` → `MainMenu` → `Game` → `Congratulations`.
- `src/scenes/`: las escenas. `settings.js` **no es una escena**: es la clase `Settings` con el estado y la configuración en propiedades estáticas.
- `src/components/`: una clase por elemento del juego (`jugador.js`, `fantasma.js`, `laberinto.js`, `puntitos.js`, `cerezas.js`, `marcador.js`, botones, cruceta táctil, `Textos.js`...).
- `src/utils/functions.js`: callbacks de colisiones (`overlap*`), puntos, vidas, partículas y `play_sonidos`.
- `public/assets/`: imágenes y `audio/`. Vite los copia tal cual a `dist/` en el build.

## Cómo funciona el juego (importante antes de tocar nada)
- **Movimiento por casillas:** jugador y fantasmas se mueven en una rejilla de 64 px (`Settings.tileXY`) a `VEL = 4` px por frame.
  Los giros dependen de `x % 64 === 0` (jugador) y de comparar posiciones exactas con `Fantasma.ptosClave` (fantasmas).
  Por eso **`VEL` debe dividir a 64** (1, 2, 4, 8, 16...): con otro valor nunca llegan a una casilla exacta y dejan de girar.
  Para subir la velocidad de los fantasmas en niveles altos no se toca `VEL`: `Fantasma.update()` da un "paso extra"
  (llama dos veces a `mover()`) cada N frames (`PASO_EXTRA_NIVEL_3`, `PASO_EXTRA_NIVEL_5`). No hay paso extra en modo scary.
- **Laberinto:** matriz `Laberinto.array_laberinto` (19 columnas). Valores: `9` pared, `1` puntito, `5` puntito gordo, `0` vacío.
  Las salidas laterales (escapatorias) se gestionan en el `update()` de `Jugador` y `Fantasma`.
- **Estado global en `Settings`:** puntos, vidas, nivel, récord, modo scary, pausas, etc. son estáticos y compartidos entre escenas.
  Se reinician en `MainMenu.init()` (partida nueva) y `Game.init()` (cada nivel). **Cualquier estado nuevo debe reiniciarse también ahí.**
  Excepción: `Settings.vidaExtra` (una vida extra a los 10 000 puntos, una vez por partida) solo se reinicia en `MainMenu.init()`.
  Los puntos se suman y luego se llama a `actualizar_puntos(scene)` (`functions.js`), que actualiza el marcador y da la vida extra.
- **Modo scary** (al comer un puntito gordo): lo controla `Game` con timers de escena (`iniciar_modo_scary`, `fin_modo_scary`, `parar_timers_scary`).
  Usar siempre `this.time.delayedCall` / timelines de escena, nunca `setTimeout`, para que se cancelen al cambiar de escena.
- **Sonidos:** son globales entre escenas; los que tengan bucle hay que pararlos en `shutdown()` de la escena (ver `Game.shutdown`).
- **Cámaras:** `Game` usa la cámara principal (sigue al jugador) y dos cámaras extra: una para los marcadores (`cameraScores`) y otra para los controles táctiles (`cameraControles`). Por eso marcadores y cruceta están en coordenadas fuera del laberinto (y negativas o muy grandes).
- **Récord:** `Settings.hi` se lee de `localStorage` (clave `pacclon-vite-phaser.record`, mínimo 12000) y `Settings.setRecord()` lo guarda al batirlo en el game over (`game-over.js`). Si `localStorage` falla, funciona igual pero se pierde al recargar.

## Gotchas
- **Las claves de escena no siempre coinciden con el nombre de la clase:** `Game` usa la clave `'game'` y `Congratulations` usa `'congratulations'`
  (`Boot`, `Preloader` y `MainMenu` sí coinciden). `scene.start()` usa la clave.
- Respeta el nombre y las mayúsculas de los ficheros (`Congratulations.js`, `Textos.js`, `settings.js`...): en GitHub Actions (Linux) los imports distinguen mayúsculas y minúsculas, aunque en Windows funcione.
- Phaser se carga solo desde npm y Vite lo separa en su propio chunk (`manualChunks`). No hay `phaser.min.js` local.
- `index.html` tiene una CSP (`Content-Security-Policy`) porque GitHub Pages no permite cabeceras propias. Si añades scripts, estilos, fuentes o peticiones externas, amplía la directiva correspondiente. `localStorage` no necesita cambios en la CSP.
- Las animaciones se crean con claves globales (`anim${index}${i}`, `le-ri-up-do`...) y se comparten entre escenas: si recreas una, haz antes `anims.remove(clave)` como en `Fantasma.create()`.
- `vite/config.prod.mjs` usa `minify: 'terser'` (por eso `terser` está en devDependencies) e incluye el plugin `phasermsg` heredado de la plantilla.

## Controles
- Teclado: flechas para moverse.
- Táctil: el icono del gamepad muestra la cruceta en pantalla. El juego debe seguir funcionando con teclado **y** con controles táctiles.
- La escena `Boot` pide tocar o hacer clic para empezar (desbloquea el audio en el navegador).
- Cheat de invulnerabilidad: en `MainMenu`, la secuencia J-O-N llama a `Settings.setInvulnerable(true)`.
  `overlapJugadorFantasmas` la respeta salvo en modo scary (para poder comer fantasmas). Dura hasta recargar la página.

## Publicación
- **GitHub Pages:** automático con `.github/workflows/deploy.yml` (Node 22, `npm ci`, `npm run build`, `actions/deploy-pages`) al hacer push a `main`.
  Requiere Pages con **Source: GitHub Actions**. No hay rama `gh-pages` ni script `npm run deploy`.
- **itch.io:** se sube a mano el contenido de `dist/` comprimido en zip, como proyecto HTML5.
- Mantener `base: './'` en las dos configuraciones de Vite para que funcione en ambos sitios.
- `public/.nojekyll` se copia a `dist/` en el build.

## Preferencias del usuario
- Responde siempre en español.
- Antes de cambios grandes, explica el plan y espera confirmación.
- Cambios pequeños y comentados (comentarios en español, como el resto del código); no reescribas ficheros enteros si no hace falta.
- Mantén el estilo del código existente: clases por componente, nombres en español, llaves en línea nueva.
- No hay tests: para comprobar cambios, indica qué probar con `npm run dev` en el navegador y, si afecta al build, con `npm run build` + `npm run preview`.
