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
        super('MainMenu');
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

        // Teclas pulsadas para detectar el cheat "J-O-N"
        this.cheatBuffer = [];

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
                this.botoninicio.create(
                    'game', [coorXY[0], Math.floor(this.sys.game.config.height / 1.5)]
                );

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

        // Cheat: pulsar J, O y N seguidas en la pantalla de título.
        // El listener se quita al salir de la escena para no duplicarlo.
        this.input.keyboard.on('keydown', this.detectar_cheat, this);
        this.events.once('shutdown', () =>
        {
            this.input.keyboard.off('keydown', this.detectar_cheat, this);
        });

        // Si el cheat ya estaba activo (volvemos al menú), lo recordamos
        if (Settings.isInvulnerable()) this.mostrar_cheat_activado(false);

        this.sonido_intermision.play();
        this.sonido_intermision.volume = 0.5;

        // Se destruye al terminar para no acumular sonidos en cada vuelta al menú
        this.sonido_intermision.once('complete', sonido => sonido.destroy());
    }

    detectar_cheat(event)
    {
        const tecla = String(event.key).toUpperCase();

        // Solo letras: las flechas y demás no cuentan para la secuencia
        if (!/^[A-Z]$/.test(tecla)) return;

        this.cheatBuffer.push(tecla);
        if (this.cheatBuffer.length > 3) this.cheatBuffer.shift();

        if (this.cheatBuffer.join('') !== 'JON') return;
        if (Settings.isInvulnerable()) return;

        Settings.setInvulnerable(true);
        this.mostrar_cheat_activado(true);
    }

    // Texto abajo a la izquierda; parpadea solo al activarlo
    mostrar_cheat_activado(animar)
    {
        this.txtCheat = new Textos(this, {
            x: 10,
            y: this.sys.game.config.height - 12,
            txt: ' Cheat: invulnerable ',
            size: 22, color: '#7ff', style: 'bold',
            stroke: '#046', sizeStroke: 8,
            shadowOsx: 2, shadowOsy: 2, shadowColor: '#111111',
            bool1: false, bool2: true, origin: [0, 1],
            elastic: 0, dura: 0
        });

        this.txtCheat.create();

        const texto = this.txtCheat.get().setDepth(Settings.getDepth().textos);

        if (animar)
        {
            this.tweens.add({
                targets: texto,
                alpha: {from: 1, to: 0.35},
                duration: 350,
                yoyo: true,
                repeat: 3
            });
        }
    }
}
