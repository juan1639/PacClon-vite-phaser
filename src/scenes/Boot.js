import { Scene } from 'phaser';
import { Textos } from '../components/Textos.js';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    init()
    {
        this.txt = new Textos(this, {
            x: Math.floor(this.sys.game.config.width / 2),
            y: Math.floor(this.sys.game.config.height / 2),
            txt: ' Touch Screen or \n click to start... ',
            size: 50, color: '#fff', style: 'bold',
            stroke: '#ee9011', sizeStroke: 16,
            shadowOsx: 2, shadowOsy: 2, shadowColor: '#111111',
            bool1: false, bool2: true, origin: [0.5, 0.5],
            elastic: false, dura: 0
        });
    }

    preload ()
    {
        this.load.image('background', 'assets/bg.png');
        this.load.image('fondo', 'assets/fondo_pacmanPh.png');
    }

    create ()
    {
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.txt.create();
        
        this.input.on('pointerdown', () => this.scene.start('Preloader'));

        console.log(this.txt);
    }
}
