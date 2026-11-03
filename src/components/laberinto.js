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
