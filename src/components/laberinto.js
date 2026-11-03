import { Settings } from "../scenes/settings.js";

export class Laberinto
{
    static array_laberinto = [
        [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
        [9,5,1,1,1,1,1,1,1,9,1,1,1,1,1,1,1,5,9],
        [9,1,9,9,1,9,9,9,1,9,1,9,9,9,1,9,9,1,9],
    
        [9,1,9,9,1,9,9,9,1,9,1,9,9,9,1,9,9,1,9],
        [9,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,9],
        [9,1,9,9,1,9,1,9,9,9,9,9,1,9,1,9,9,1,9],
    
        [9,1,1,1,1,9,1,1,1,9,1,1,1,9,1,1,1,1,9],
        [9,9,9,9,1,9,9,9,1,9,1,9,9,9,1,9,9,9,9],
        [9,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,9],
    
        [9,1,9,9,1,9,1,9,1,9,1,9,1,9,1,9,9,1,9],
        [9,1,9,9,1,9,1,9,1,9,1,9,1,9,1,9,9,1,9],
        [0,1,1,1,1,9,1,1,1,1,1,1,1,9,1,1,1,1,0],
    
        [9,1,9,9,1,9,1,9,9,9,9,9,1,9,1,9,9,1,9],
        [9,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,9],
        [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
    ];

    constructor(scene)
    {
        this.relatedScene = scene;
    }

    create()
    {
        const nivel = Settings.getNivel();

        this.tile = this.relatedScene.physics.add.staticGroup();

        for (let i = 0; i < Laberinto.array_laberinto.length; i ++)
        {
            for (let ii = 0; ii < Laberinto.array_laberinto[i].length; ii ++)
            {
                const valor = Laberinto.array_laberinto[i][ii];

                this.elegir_tilesNiveles(valor, nivel, i, ii);
            }
        }
    }

    static check_colision(x, y)
    {
        if (Laberinto.array_laberinto[y][x] === 9) return true;
        return false;
    }

    // Como check_colision, pero a prueba de casillas fuera de la matriz.
    // Fuera por los lados (túnel) solo se puede pasar si el borde de esa fila
    // está abierto: así no se puede girar arriba/abajo dentro del túnel.
    static es_transitable(x, y)
    {
        const fila = Laberinto.array_laberinto[y];

        if (!fila) return false;

        if (x < 0) return fila[0] !== 9;
        if (x >= fila.length) return fila[fila.length - 1] !== 9;

        return fila[x] !== 9;
    }

    // Camino más corto entre dos casillas (búsqueda en anchura, sin pasar por el túnel).
    // Devuelve [[x, y], ...] desde el origen hasta el destino, o null si no hay camino.
    static camino(desdeX, desdeY, hastaX, hastaY)
    {
        const mapa = Laberinto.array_laberinto;
        const filas = mapa.length;
        const columnas = mapa[0].length;
        const clave = (x, y) => y * columnas + x;

        if (!Laberinto.es_transitable(desdeX, desdeY)) return null;

        // Para cada casilla visitada, la casilla desde la que se llegó
        const previo = new Map([[clave(desdeX, desdeY), null]]);
        const cola = [[desdeX, desdeY]];

        while (cola.length > 0)
        {
            const [x, y] = cola.shift();

            if (x === hastaX && y === hastaY)
            {
                const ruta = [];

                for (let k = clave(x, y); k !== null; k = previo.get(k))
                {
                    ruta.unshift([k % columnas, Math.floor(k / columnas)]);
                }

                return ruta;
            }

            [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) =>
            {
                const nx = x + dx;
                const ny = y + dy;

                if (nx < 0 || ny < 0 || nx >= columnas || ny >= filas) return;
                if (mapa[ny][nx] === 9 || previo.has(clave(nx, ny))) return;

                previo.set(clave(nx, ny), clave(x, y));
                cola.push([nx, ny]);
            });
        }

        return null;
    }

    elegir_tilesNiveles(valor, nivel, i, ii)
    {
        if (valor === 9 && nivel === 1)
        {
            this.tile.create(
                ii * Settings.tileXY.x,
                i * Settings.tileXY.y,
                `tile${nivel}`
            ).refreshBody();
        }

        if (valor !== 9 && nivel === 1)
        {
            this.tile.create(
                ii * Settings.tileXY.x,
                i * Settings.tileXY.y,
                `tile-suelo${nivel}`
            ).refreshBody();
        }

        if (valor === 9 && nivel > 1 && nivel < 12)
        {
            this.tile.create(
                ii * Settings.tileXY.x, i * Settings.tileXY.y, `tile-ssheet`
            ).refreshBody().setFrame(5 + (nivel - 2) * 14).setScale(2);
        }

        if (valor !== 9 && nivel > 1 && nivel < 12)
        {
            this.tile.create(
                ii * Settings.tileXY.x, i * Settings.tileXY.y, `tile-ssheet`
            ).refreshBody().setFrame(1 + (nivel - 2) * 14).setScale(2);
        }

        if (valor === 9 && nivel > 11)
        {
            this.tile.create(
                ii * Settings.tileXY.x, i * Settings.tileXY.y, `tile-ssheet`
            ).refreshBody().setFrame(25).setScale(2);
        }
    }

    get()
    {
        return this.tile;
    }
}
