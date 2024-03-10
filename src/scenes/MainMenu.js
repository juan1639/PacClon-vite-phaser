import { Scene } from 'phaser';
import { Textos } from '../components/Textos.js';
import { JugadorPreGame } from '../components/jugador.js';
import { FantasmaPreGame } from '../components/fantasma.js';
import { Settings } from './settings.js';
import { BotonNuevaPartida, BotonSettings } from "../components/boton-nuevapartida.js";
import { particulas } from '../utils/functions.js';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MenuPrincipal');
    }

    init()
    {
        Settings.setPuntos(0);
        Settings.setNivel(1);
        Settings.setVidas(3);
        Settings.setGameOver(false);
        Settings.setFantasmasScary(false);
        Settings.setBotonesYcruceta(false);
        Settings.setFantasmasBonusInc(0);

        this.botoninicio = new BotonNuevaPartida(this);
        this.botonsettings = new BotonSettings(this);

        this.jugador = new JugadorPreGame(this);
        this.fantasmaspregame = new FantasmaPreGame(this);
    }

    create ()
    {
        const aparecerBoton = 4000;
        this.sonido_intermision = this.sound.add('sonidoPacmanIntermision');

        this.add.image(0, 0, 'fondo').setOrigin(0, 0);
        this.jugador.create(Settings.pacmanPregame.iniX * Settings.tileXY.x, Settings.pacmanPregame.iniY * Settings.tileXY.y);
        this.fantasmaspregame.create();

        const coorXY = [
            Math.floor(this.sys.game.config.width / 2),
            Math.floor(this.sys.game.config.height / 20),
            Math.floor(this.sys.game.config.height / 4)
        ];

        this.txt = new Textos(this, {
            x: coorXY[0],
            y: coorXY[1],
            txt: ' Pac Clon ',
            size: 99, color: '#ffa', style: 'bold',
            stroke: '#ea1', sizeStroke: 16,
            shadowOsx: 2, shadowOsy: 2, shadowColor: '#111111',
            bool1: false, bool2: true, origin: [0.5, 0],
            elastic: coorXY[2], dura: 2500
        });

        this.txt.create();

        this.timeline = this.add.timeline([
            {
              at: aparecerBoton,
              run: () => {
                this.botoninicio.create('game');
                this.botonsettings.create('game');

                particulas(
                    coorXY[0], coorXY[2] + 50,
                    'sparkle',
                    {min: 60, max: 120},
                    {min: 2500, max: 3000},
                    {start: 0.2, end: 0},
                    0xffcc11,
                    null, false, this
                );
              }
            }
        ]);
        
        this.timeline.play();

        this.sonido_intermision.play();
        this.sonido_intermision.volume = 0.5;

        console.log(this.txt);
    }

    update() {}
}
