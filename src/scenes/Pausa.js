import { Textos } from '../components/Textos.js';

// Escena que se pone encima de Game al pulsar P. Game queda pausada
// (update, timers, tweens y física parados) hasta volver a pulsar P.
export class Pausa extends Phaser.Scene
{
    constructor()
    {
        super('Pausa');
    }

    create()
    {
        const ancho = this.sys.game.config.width;
        const alto = this.sys.game.config.height;

        // Oscurece el juego que queda detrás
        this.add.rectangle(0, 0, ancho, alto, 0x000000, 0.5).setOrigin(0, 0);

        this.txt = new Textos(this, {
            x: Math.floor(ancho / 2),
            y: Math.floor(alto / 2),
            txt: ' Pausa \n\n Pulsa P para seguir ',
            size: 50, color: '#ffa', style: 'bold',
            stroke: '#ea1', sizeStroke: 16,
            shadowOsx: 2, shadowOsy: 2, shadowColor: '#111111',
            bool1: false, bool2: true, origin: [0.5, 0.5],
            elastic: false, dura: 0
        });

        this.txt.create();
        this.txt.get().setAlign('center');

        this.input.keyboard.once('keydown-P', () =>
        {
            this.sound.resumeAll();
            this.scene.resume('game');
            this.scene.stop();
        });
    }
}
