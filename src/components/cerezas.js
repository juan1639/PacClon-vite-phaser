import { Settings } from '../scenes/settings.js';
import { Laberinto } from "./laberinto.js";

export class Cerezas
{
    static VEL = 2;

    // [velX, velY, addWidth, addHeight, angle]
    static INFO_DIRECCION = {
        left: [-1, 0, 0, 0, 180, 'left'],
        right: [1, 0, 1, 0, 0, 'right'],
        up: [0, -1, 0, 0, 270, 'up'],
        down: [0, 1, 0, 1, 90, 'down']
    };

    static OTRA_DIRECCION_RND = {
        left: ['right', 'up', 'down'],
        right: ['left', 'up', 'down'],
        up: ['right', 'left', 'down'],
        down: ['right', 'left', 'up']
    };

    constructor(scene)
    {
        this.relatedScene = scene;
    }

    create()
    {
        this.cerezas = this.relatedScene.physics.add.sprite(
            Settings.getCerezasIniXY()[0] * Settings.tileXY.x,
            Settings.getCerezasIniXY()[1] * Settings.tileXY.y,
            'cerezas'
        );

        this.cerezas.setData('intentoGiro', 'right');
        this.cerezas.setData('direccion', 'right');
        this.cerezas.setCircle(Math.floor(Settings.tileXY.y / 3));
        this.cerezas.setAngle(-20).setScale(0.8).setFrame(0).setFlipX(false);

        if (Settings.getNivel() < 14)
        {
            this.cerezas.setData('puntos', Settings.getBonusCerezas()[Settings.getNivel()]);
        } else
        {
            this.cerezas.setData('puntos', 7000);
        }

        this.relatedScene.tweens.add(
        {
            targets: this.cerezas,
            angle: 20,
            ease: 'linear',
            yoyo: true,
            duration: 2000,
            repeat: -1
        });

        console.log(this.cerezas);
    }

    update()
    {
        if (!this.relatedScene.jugador.get().body.enable) return;

        const direcc = Cerezas.INFO_DIRECCION;

        const x = Math.floor(
            (this.cerezas.x + direcc[this.cerezas.getData('direccion')][0] +
                Settings.tileXY.x * direcc[this.cerezas.getData('direccion')][2]) / Settings.tileXY.x);
        
        const y = Math.floor(
            (this.cerezas.y + direcc[this.cerezas.getData('direccion')][1] +
                Settings.tileXY.y * direcc[this.cerezas.getData('direccion')][3]) / Settings.tileXY.y);
        
        if (!Laberinto.check_colision(x, y))
        {
            this.cerezas.x += direcc[this.cerezas.getData('direccion')][0] * Cerezas.VEL;
            this.cerezas.y += direcc[this.cerezas.getData('direccion')][1] * Cerezas.VEL;

            // Escapatorias
            if (this.cerezas.x > Laberinto.array_laberinto[0].length * Settings.tileXY.x && this.cerezas.getData('direccion') === 'right') this.cerezas.x = -Settings.tileXY.x;
            if (this.cerezas.x < -Settings.tileXY.x && this.cerezas.getData('direccion') === 'left') this.cerezas.x = (Laberinto.array_laberinto[0].length - 1) * Settings.tileXY.x;

        } else
        {
            this.cerezas.setData('direccion', this.elegir_otra_direccion(direcc, this.cerezas));
        }
    }

    elegir_otra_direccion(direcc, cerezas)
    {
        let actualDirecc = direcc[cerezas.getData('direccion')][5];
        return Cerezas.OTRA_DIRECCION_RND[actualDirecc][Math.floor(Math.random()* 3)];
    }

    get()
    {
        return this.cerezas;
    }
}
