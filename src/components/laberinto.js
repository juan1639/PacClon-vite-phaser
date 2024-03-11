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

                if (valor === 9 && nivel > 1)
                {
                    this.tile.create(
                        ii * Settings.tileXY.x, i * Settings.tileXY.y, `tile-ssheet`
                    ).refreshBody().setFrame(5 + nivel * 14).setScale(2);
                }

                if (valor !== 9 && nivel > 1)
                {
                    this.tile.create(
                        ii * Settings.tileXY.x, i * Settings.tileXY.y, `tile-ssheet`
                    ).refreshBody().setFrame(1 + nivel * 14).setScale(2);
                }
            }
        }

        console.log(this.tile);
    }

    static check_colision(x, y)
    {
        if (Laberinto.array_laberinto[y][x] === 9) return true;
        return false;
    }

    get()
    {
        return this.tile;
    }
}
