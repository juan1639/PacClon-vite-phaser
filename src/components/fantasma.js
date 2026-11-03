import { Settings } from '../scenes/settings.js';
import { Laberinto } from "./laberinto.js";

export class Fantasma
{
    static VEL = 4;

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

    // Dirección contraria (en modo scary los fantasmas huyen)
    static OPUESTA = {
        left: 'right',
        right: 'left',
        up: 'down',
        down: 'up'
    };

    // Color de los fantasmas en modo scary (número fijo: no crear objetos en cada frame)
    static COLOR_SCARY = 0x09e1ff;

    // Paso extra de 4 px cada N frames para subir la velocidad sin tocar VEL
    // (VEL debe dividir a 64). 0 = nunca. Ajustar aquí la dificultad.
    static PASO_EXTRA_NIVEL_3 = 4;   // niveles 3-4: ~5 px/frame
    static PASO_EXTRA_NIVEL_5 = 3;   // nivel 5 en adelante: ~5,3 px/frame

    // Algunos ptos del Laberinto donde los fantasmas pueden cambiar de direccion
    static ptosClave = [
        [4, 1], [14, 1],
        [4, 4], [6, 4], [12, 4], [14, 4],
        [4, 8], [6, 8], [12, 8], [14, 8],
        [1, 11], [4, 11], [6, 11], [12, 11], [14, 11], [17, 11],
        [4, 13], [6, 13], [12, 13], [14, 13]
    ];

    constructor(scene)
    {
        this.relatedScene = scene;
    }

    create()
    {
        this.fantasmas = this.relatedScene.physics.add.group(
        {
            key: ['fantanim0', 'fantanim1', 'fantanim2', 'fantanim3'],
            frameQuantity: 1,
            setXY: {
                x: Settings.fantasmasIniXY.azul[0] * Settings.tileXY.x,
                y: Settings.fantasmasIniXY.azul[1] * Settings.tileXY.y,
                stepX: Settings.tileXY.x * 3
            }
        });

        this.fantasmas.children.iterate((fant, index) =>
        {
            fant.setData('intentoGiro', 'right');
            fant.setData('direccion', 'right');
            fant.setData('id', index);
            // comido: el fantasma está invisible y quieto; sus ojos vuelven a casa
            // esperando: los ojos ya llegaron a casa y esperan a que acabe el modo scary
            fant.setData('comido', false);
            fant.setData('esperando', false);
            fant.setCircle(
                Math.floor(Settings.tileXY.y / 3),
                Math.floor(Settings.tileXY.x / 12),
                Math.floor(Settings.tileXY.y / 12)
            );

            fant.setAngle(0).setScale(1.15, 1.15).setFrame(0).setFlipX(false);
        });

        this.fantasmas.children.iterate((fant, index) =>
        {
            for (let i = 0; i < 4; i ++) {

                this.relatedScene.anims.remove(`anim${index}${i}`);

                this.relatedScene.anims.create({
                    key: `anim${index}${i}`, 
                    frames: this.relatedScene.anims.generateFrameNumbers(`fantanim${index}${i}`, {start: 0, end: 1}),
                    frameRate: 8,
                    yoyo: true,
                    repeat: -1
                });
            }

            fant.anims.play(`anim${index}0`, true);
        });

        // Cuenta los frames en movimiento (para el paso extra)
        this.contador_frames = 0;
    }

    update()
    {
        if (!this.relatedScene.jugador.get().body.enable || Settings.pausa.comeFantasma || Settings.pausa.nivelSuperado) return;

        this.contador_frames ++;

        // En modo scary no hay paso extra (van a la velocidad normal)
        const cada = Fantasma.frames_paso_extra();
        const pasoExtra = cada > 0 && !Settings.isFantasmasScary() && this.contador_frames % cada === 0;

        this.fantasmas.children.iterate((fant, index) =>
        {

            // Mientras sus ojos vuelven a casa, el fantasma no se mueve
            if (fant.getData('comido')) return;

            if (Fantasma.es_comestible(fant))
            {
                fant.setTintFill(Fantasma.COLOR_SCARY);

                if (Settings.isFantasmasIntermitente())
                {
                    fant.setTint(Phaser.Display.Color.GetColor(20, Phaser.Math.Between(60, 200), Phaser.Math.Between(125, 255)));
                }
            }

            // En modo scary van a la mitad de velocidad: un paso de VEL px solo
            // en los frames pares (cambiar VEL rompería la alineación con las casillas)
            if (Fantasma.es_comestible(fant) && this.contador_frames % 2 === 1) return;

            this.mover(fant, index);

            // El paso extra repite la lógica completa, así siempre se pasa
            // por las casillas exactas y se puede girar en los cruces
            if (pasoExtra) this.mover(fant, index);
        });
    }

    // Un paso de VEL px: puntos clave, colisión con paredes y escapatorias
    mover(fant, index)
    {
        const direcc = Fantasma.INFO_DIRECCION;

        let x = 0;
        let y = 0;
        let perseguir;

        for (let i = 0; i < Fantasma.ptosClave.length; i ++)
        {
            let pClaveX = Fantasma.ptosClave[i][0] * Settings.tileXY.x;
            let pClaveY = Fantasma.ptosClave[i][1] * Settings.tileXY.y;

            if (fant.x == pClaveX && fant.y == pClaveY)
            {
                perseguir = Phaser.Math.Between(0, 10);

                if (perseguir < Fantasma.umbral_persecucion(7))
                {
                    this.fantasma_persigue(fant);
                    this.set_flips(fant, index);
                }
            }
        }

        x = Math.floor(
            (fant.x + direcc[fant.getData('direccion')][0] +
                Settings.tileXY.x * direcc[fant.getData('direccion')][2]) / Settings.tileXY.x);

        y = Math.floor(
            (fant.y + direcc[fant.getData('direccion')][1] +
                Settings.tileXY.y * direcc[fant.getData('direccion')][3]) / Settings.tileXY.y);

        if (!(Laberinto.check_colision(x, y)))
        {

            fant.x += direcc[fant.getData('direccion')][0] * Fantasma.VEL;
            fant.y += direcc[fant.getData('direccion')][1] * Fantasma.VEL;

            // Escapatorias
            if (fant.x > Laberinto.array_laberinto[0].length * Settings.tileXY.x && fant.getData('direccion') === 'right') fant.x = -Settings.tileXY.x;
            if (fant.x < -Settings.tileXY.x && fant.getData('direccion') === 'left') fant.x = (Laberinto.array_laberinto[0].length - 1) * Settings.tileXY.x;

        } else
        {
            perseguir = Phaser.Math.Between(0, 10);

            if (perseguir < Fantasma.umbral_persecucion(5)) {
                this.fantasma_persigue(fant);

            } else
            {
                fant.setData('direccion', this.elegir_otra_direccion(direcc, fant));
            }

            this.set_flips(fant, index);
        }
    }

    // En modo scary todos los fantasmas visibles se pueden comer (los comidos
    // son invisibles y ya los descarta exceptoNotVisible)
    static es_comestible(fant)
    {
        return Settings.isFantasmasScary();
    }

    // Umbral para Phaser.Math.Between(0, 10): igual que antes en el nivel 1,
    // pero crece la mitad de rápido (antes era base + nivel)
    static umbral_persecucion(base)
    {
        return base + Math.ceil(Settings.getNivel() / 2);
    }

    // Cada cuántos frames dan los fantasmas un paso extra (0 = nunca)
    static frames_paso_extra()
    {
        const nivel = Settings.getNivel();

        if (nivel >= 5) return Fantasma.PASO_EXTRA_NIVEL_5;
        if (nivel >= 3) return Fantasma.PASO_EXTRA_NIVEL_3;
        return 0;
    }

    elegir_otra_direccion(direcc, fant)
    {
        let actualDirecc = direcc[fant.getData('direccion')][5];
        return Fantasma.OTRA_DIRECCION_RND[actualDirecc][Math.floor(Math.random()* 3)];
    }

    fantasma_persigue(fant)
    {
        const hor_ver = Phaser.Math.Between(0, 10);

        if (hor_ver < 5)
        {
            if (fant.y < this.relatedScene.jugador.get().y) {
                fant.setData('direccion', 'down');

            } else
            {
                fant.setData('direccion', 'up');
            }

        } else
        {
            if (fant.x < this.relatedScene.jugador.get().x)
            {
                fant.setData('direccion', 'right');

            } else
            {
                fant.setData('direccion', 'left');
            }
        }

        // En modo scary huyen: dirección contraria a la de perseguir
        if (Fantasma.es_comestible(fant))
        {
            fant.setData('direccion', Fantasma.OPUESTA[fant.getData('direccion')]);
        }
    }

    set_flips(fant, index)
    {
        if (fant.getData('direccion') === 'left')
        {
            fant.anims.play(`anim${index}1`, true);
            
        } else if (fant.getData('direccion') === 'right')
        {
            fant.anims.play(`anim${index}0`, true);
            
        } else if (fant.getData('direccion') === 'up')
        {
            fant.anims.play(`anim${index}2`, true);

        } else if (fant.getData('direccion') === 'down')
        {
            fant.anims.play(`anim${index}3`, true);
        }
    }

    duracion_scary()
    {
        // Nivel 1: 8100 ms (como antes); baja 450 ms por nivel hasta un mínimo de 2500 ms
        let duracion = Settings.getFantasmasScaryDuracion() - 900 - (Settings.getNivel() - 1) * 450;

        if (duracion < 2500) return 2500;
        return duracion;
    }

    // Fin del modo scary (o nuevo puntito gordo): quita el tinte.
    // Los comidos reaparecen con OjosFantasma.liberar_esperando() al acabar el modo scary.
    quitar_scary()
    {
        this.fantasmas.children.iterate(fant => fant.clearTint());
    }

    get()
    {
        return this.fantasmas;
    }
}

// ===========================================================================
export class FantasmaPreGame
{
    constructor(scene)
    {
        this.relatedScene = scene;
    }

    create()
    {
        this.fantasmaspregame = this.relatedScene.physics.add.group(
        {
            key: ['fantanim0', 'fantanim1', 'fantanim2', 'fantanim3'],
            frameQuantity: 1,
            setXY: {
                x: (Settings.fantasmasIniXY.azul[0] - 12) * Settings.tileXY.x,
                y: (Settings.fantasmasIniXY.azul[1] - 7) * Settings.tileXY.y,
                stepX: Settings.tileXY.x
            }
        });

        this.fantasmaspregame.children.iterate((fant =>
        {
            fant.setAngle(0).setScale(1.15, 1.15).setFrame(0).setFlipX(false);
        }));

        this.fantasmaspregame.children.iterate((fant, index) =>
        {
            for (let i = 0; i < 4; i ++) {

                this.relatedScene.anims.create(
                {
                    key: `anim${index}${i}`, 
                    frames: this.relatedScene.anims.generateFrameNumbers(`fantanim${index}${i}`, {start: 0, end: 1}),
                    frameRate: 8,
                    yoyo: true,
                    repeat: -1
                });
            }

            fant.anims.play(`anim${index}0`, true);

            const duracionTotal = 9000;

            this.relatedScene.tweens.add(
            {
                targets: fant,
                x: this.relatedScene.sys.game.config.width + Settings.tileXY.x * 2,
                yoyo: true,
                duration: duracionTotal,
                repeat: -1
            });

            // Timer de la escena (se limpia solo al cambiar de escena)
            this.relatedScene.time.addEvent({
                delay: duracionTotal,
                loop: true,
                callback: () => fant.setFlipX(!fant.flipX)
            });
        });
    }
}

// ================================================================================
export class OjosFantasma
{
    // Milisegundos que tardan los ojos en recorrer una casilla al volver a casa
    static DURACION_CASILLA = 100;

    constructor(scene)
    {
        this.relatedScene = scene;
    }

    create()
    {
        this.ojosfantasma = this.relatedScene.physics.add.group(
        {
            key: ['fantanim5', 'fantanim5', 'fantanim5', 'fantanim5'],
            frameQuantity: 1,
            setXY: {
                x: (Settings.fantasmasIniXY.azul[0] - 12) * Settings.tileXY.x,
                y: (Settings.fantasmasIniXY.azul[1] - 7) * Settings.tileXY.y,
                stepX: Settings.tileXY.x
            }
        });

        this.ojosfantasma.children.iterate((ojos =>
        {
            ojos.setAngle(0).setScale(1.15, 1.15).setFrame(0).setFlipX(false).setVisible(false);
        }));

        this.ojosfantasma.children.iterate((ojos, index) =>
        {
            for (let i = 0; i < 4; i ++)
            {
                this.relatedScene.anims.create(
                {
                    key: `anim5${i}`, 
                    frames: this.relatedScene.anims.generateFrameNumbers(`fantanim5${i}`, {start: 0, end: 1}),
                    frameRate: 8,
                    yoyo: true,
                    repeat: -1
                });
            }

            ojos.anims.play(`anim50`, true);
        });
    }

    update()
    {
        this.ojosfantasma.children.iterate((ojos, index) =>
        {
            // Los ojos que vuelven a casa los mueve su propio tween
            if (ojos.getData('volviendo')) return;

            const fantasma = this.relatedScene.fantasmas.get().getChildren()[index];

            this.set_flips(fantasma, ojos);

            ojos.setX(fantasma.x);
            ojos.setY(fantasma.y);
        });
    }

    set_flips(fantasma, ojos)
    {
        if (fantasma.getData('direccion') === 'left')
        {
            ojos.anims.play(`anim51`, true);
            
        } else if (fantasma.getData('direccion') === 'right')
        {
            ojos.anims.play(`anim50`, true);
            
        } else if (fantasma.getData('direccion') === 'up')
        {
            ojos.anims.play(`anim52`, true);

        } else if (fantasma.getData('direccion') === 'down')
        {
            ojos.anims.play(`anim53`, true);
        }
    }

    // Fantasma comido: los ojos vuelven por el laberinto a la posición inicial
    // del fantasma y allí reaparece. Usa tweens de escena (se pausan y se
    // cancelan con la escena).
    volver_a_casa(index)
    {
        const ojos = this.ojosfantasma.getChildren()[index];
        const fant = this.relatedScene.fantasmas.get().getChildren()[index];
        const tile = Settings.tileXY;
        const casa = Settings.fantasmasIniXY[Object.keys(Settings.fantasmasIniXY)[index]];
        const columnas = Laberinto.array_laberinto[0].length;

        // Casilla más cercana (en el túnel, fuera del laberinto, la del borde)
        const desdeX = Phaser.Math.Clamp(Math.round(fant.x / tile.x), 0, columnas - 1);
        const desdeY = Math.round(fant.y / tile.y);

        // Si no hubiera camino, van directos a casa
        const ruta = Laberinto.camino(desdeX, desdeY, casa[0], casa[1]) || [casa];

        ojos.setPosition(fant.x, fant.y).setVisible(true).setData('volviendo', true);

        let anterior = { x: fant.x, y: fant.y };

        const tramos = ruta.map(([cx, cy]) =>
        {
            const destino = { x: cx * tile.x, y: cy * tile.y };
            const casillas = (Math.abs(destino.x - anterior.x) + Math.abs(destino.y - anterior.y)) / tile.x;
            const anim = OjosFantasma.anim_direccion(anterior, destino);

            anterior = destino;

            return {
                x: destino.x,
                y: destino.y,
                duration: Math.max(16, casillas * OjosFantasma.DURACION_CASILLA),
                onStart: () => ojos.anims.play(anim, true)
            };
        });

        this.relatedScene.tweens.chain({
            targets: ojos,
            tweens: tramos,
            onComplete: () => this.llegar_a_casa(index)
        });
    }

    llegar_a_casa(index)
    {
        const ojos = this.ojosfantasma.getChildren()[index];
        const fant = this.relatedScene.fantasmas.get().getChildren()[index];
        const casa = Settings.fantasmasIniXY[Object.keys(Settings.fantasmasIniXY)[index]];

        fant.setPosition(casa[0] * Settings.tileXY.x, casa[1] * Settings.tileXY.y);

        // Con el modo scary activo, los ojos se quedan en casa hasta que acabe
        if (Settings.isFantasmasScary())
        {
            fant.setData('esperando', true);
            ojos.anims.play('anim50', true);
            return;
        }

        this.reaparecer(index);
    }

    // El fantasma vuelve a aparecer (normal) en su casa y se ocultan los ojos
    reaparecer(index)
    {
        const ojos = this.ojosfantasma.getChildren()[index];
        const fant = this.relatedScene.fantasmas.get().getChildren()[index];

        ojos.setVisible(false).setData('volviendo', false);

        fant.setData('comido', false);
        fant.setData('esperando', false);
        fant.clearTint();

        if (!Settings.isGameOver()) fant.setVisible(true);
    }

    // Fin del modo scary: reaparecen los fantasmas cuyos ojos esperaban en casa.
    // Los que aún van de camino reaparecen al llegar (ya sin modo scary).
    liberar_esperando()
    {
        this.relatedScene.fantasmas.get().children.iterate((fant, index) =>
        {
            if (fant.getData('esperando')) this.reaparecer(index);
        });
    }

    // Animación de los ojos según hacia dónde se mueven
    static anim_direccion(desde, hasta)
    {
        if (hasta.x < desde.x) return 'anim51';
        if (hasta.y < desde.y) return 'anim52';
        if (hasta.y > desde.y) return 'anim53';
        return 'anim50';
    }

    get()
    {
        return this.ojosfantasma;
    }
}
