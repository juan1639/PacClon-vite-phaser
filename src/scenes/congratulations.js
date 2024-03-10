import { Settings } from './settings.js';
import { Textos } from '../components/Textos.js';
import { BotonNuevaPartida } from "../components/boton-nuevapartida.js";
import { particulas, play_sonidos } from '../utils/functions.js';

export class Congratulations extends Phaser.Scene
{
  constructor()
  {
    super({ key: 'congratulations' });
  }

  init()
  {
    this.botoninicio = new BotonNuevaPartida(this);
  }

  create()
  {
    this.add.image(0, 0, 'fondo').setOrigin(0, 0);

    const aparecerBoton = 3200;
    this.incremento_nivel = Settings.getNivel() + 1;
    
    this.sonido_intermision = this.sound.add('sonidoPacmanIntermision');

    this.txt = new Textos(this, {
      x: Math.floor(this.sys.game.config.width / 2),
      y: Math.floor(this.sys.game.config.height / 3.5),
      txt: ' Level Up! ',
      size: 86, color: '#ffa', style: 'bold',
      stroke: '#f91', sizeStroke: 16,
      shadowOsx: 2, shadowOsy: 2, shadowColor: '#111111',
      bool1: false, bool2: true, origin: [0.5, 0.5],
      elastic: false, dura: 0
    });

    this.txt.create();
    this.txt.get().setDepth(Settings.getDepth().textos).setAlpha(1);

    particulas(
      this.sys.game.config.width / 2,
      this.sys.game.config.height / 2,
      'sparkle',
      {min: 90, max: 320},
      {min: 5500, max: 6000},
      {start: 0, end: 0.4},
      0xffcc11,
      null, false, this
    );

    this.timeline = this.add.timeline([
        {
          at: aparecerBoton,
          run: () => {
            Settings.setNivel(this.incremento_nivel);
            this.botoninicio.create(
              'game', [Math.floor(this.sys.game.config.width / 2), Math.floor(this.sys.game.config.height / 1.7)]
            );
          }
        }
    ]);
    
    this.timeline.play();

    play_sonidos(this.sonido_intermision, false, 0.8);

    console.log(this.txt);
  }
}
