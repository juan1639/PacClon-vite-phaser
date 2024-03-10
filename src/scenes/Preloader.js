import { Scene } from 'phaser';
import { Textos } from '../components/Textos';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        const widthScreen = this.sys.game.config.width;
        const heightScreen = this.sys.game.config.height;

        this.add.image(0, 0, 'fondo').setOrigin(0, 0);

        this.txt = new Textos(this, {
            x: Math.floor(widthScreen / 2),
            y: Math.floor(heightScreen / 4),
            txt: ' Cargando... ',
            size: 50, color: '#ffa', style: 'bold',
            stroke: '', sizeStroke: 0,
            shadowOsx: 0, shadowOsy: 0, shadowColor: '#111111',
            bool1: false, bool2: false, origin: [0.5, 0.5],
            elastic: false, dura: 0
        });

        this.txt.create();

        this.add.rectangle(
            Math.floor(widthScreen / 2), Math.floor(heightScreen / 2),
            Math.floor(widthScreen / 1.5), Math.floor(heightScreen / 12)
        ).setStrokeStyle(1, 0xffee88);

        const bar = this.add.rectangle(
            Math.floor(widthScreen / 2) - Math.floor(widthScreen / 3) + 4,
            Math.floor(heightScreen / 2),
            4,
            Math.floor(heightScreen / 14),
            0xff9911
        );

        this.load.on('progress', (progress) => {
            bar.width = (Math.floor(widthScreen / 1.52) * progress);
        });
    }

    preload ()
    {
        this.load.setPath('assets');

        this.load.image('fondo', 'fondo_pacmanPh.png');
        this.load.image('tile2', 'tile_pacmanMarron.png');
        this.load.image('tile1', 'tile_pacmanMarron-2.png');
        this.load.image('tile3', 'tile_pacmanBlue.png');
        this.load.image('tile-suelo1', 'sueloTile-pacmanMarron-2.png');
        // scene.load.image('puntito', './src/img/puntito.png');
        this.load.image('puntito', 'silverbubble.png');
        this.load.image('sparkle', 'sparkle1.png');

        this.load.spritesheet('pacman', 'pac-animasPh.png', {frameWidth: 64, frameHeight: 64});

        for (let i = 0; i < 4; i ++)
        {
            this.load.spritesheet(`fantanim0${i}`, `fantanim0${i}.png`, {frameWidth: 50, frameHeight: 50});
            this.load.spritesheet(`fantanim1${i}`, `fantanim1${i}.png`, {frameWidth: 50, frameHeight: 50});
            this.load.spritesheet(`fantanim2${i}`, `fantanim2${i}.png`, {frameWidth: 50, frameHeight: 50});
            this.load.spritesheet(`fantanim3${i}`, `fantanim3${i}.png`, {frameWidth: 50, frameHeight: 50});
            this.load.spritesheet(`fantanim5${i}`, `fantanim5${i}.png`, {frameWidth: 50, frameHeight: 50});
        }

        this.load.image('cerezas', 'cerezas.png');

        this.load.image('boton-continuar', 'boton-continuar.png');
        this.load.image('boton-nueva-partida', 'boton-start.png');
        this.load.image('boton-settings', 'boton-config.png');
        // scene.load.image('gameover', './src/img/gameover.png');

        this.load.image('cruceta-left', 'left.png');
        this.load.image('cruceta-right', 'right.png');
        this.load.image('icono-gamepad', 'icono-gamePad.png');
        this.load.spritesheet('boton-fullscreen', 'boton-fullscreen.png', {frameWidth: 64, frameHeight: 64});

        // ---------------------------------------------------------------------------
        //  AUDIO
        // ---------------------------------------------------------------------------
        this.load.audio('sonidoGameOverRetro', 'audio/gameoveretro.ogg');
        this.load.audio('sonidoPacmanAzules', 'audio/pacmanazules.ogg');
        this.load.audio('sonidoPacmanDies', 'audio/pacmandies.ogg');
        this.load.audio('sonidoPacmanEatingCherry', 'audio/pacmaneatingcherry.mp3');
        this.load.audio('sonidoPacmanEatingGhost', 'audio/pacmaneatinghost.ogg');
        this.load.audio('sonidoPacmanInicioNivel', 'audio/pacmaninicionivel.ogg');
        this.load.audio('sonidoPacmanIntermision', 'audio/pacmanintermision.ogg');
        this.load.audio('sonidoPacmanSirena', 'audio/pacmansirena.ogg');
        this.load.audio('sonidoWakaWaka', 'audio/pacmanwakawaka.mp3');
    }

    create ()
    {
        this.scene.start('MenuPrincipal');
    }
}
