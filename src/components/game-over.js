import { Textos } from './Textos.js';
import { Settings } from '../scenes/settings.js';

export class GameOver
{
  constructor(scene)
  {
    this.relatedScene = scene;
  }
  
  create(jugadorX, jugadorY)
  {
    this.sonidoGameOver = this.relatedScene.sound.add('sonidoGameOverRetro');

    const duracionThisScene = 7000;

    this.txt = new Textos(this.relatedScene, {
      x: jugadorX,
      y: jugadorY - Settings.tileXY.y,
      txt: ' Game Over ',
      size: 90, color: '#dd9', style: 'bold',
      stroke: '#f41', sizeStroke: 16,
      shadowOsx: 2, shadowOsy: 2, shadowColor: '#111111',
      bool1: false, bool2: true, origin: [0.5, 0.5],
      elastic: false, dura: 0
    });

    this.txt.create();
    this.txt.get().setAlpha(0);

    this.relatedScene.tweens.add({
      targets: this.txt.get(),
      alpha: 1,
      duration: Math.floor(duracionThisScene / 2),
      // repeat: 1
    });

    this.timeline = this.relatedScene.add.timeline([
      {
        at: duracionThisScene,
        run: () => {
          this.relatedScene.botonrejugar.create(
            'MainMenu', [jugadorX, jugadorY + Settings.tileXY.y * 2]
          );
        }
      }
    ]);

    this.timeline.play();
    this.sonidoGameOver.play();
    this.sonidoGameOver.volume = 0.5;

    this.check_newRecord();
  }

  update() {}

  check_newRecord()
  {
    if (Settings.getPuntos() >= Settings.getRecord()) {

      Settings.setRecord(Settings.getPuntos());

      this.txtnewrecord = new Textos(this.relatedScene, {
        x: Math.floor(this.relatedScene.sys.game.config.width / 2),
        y: Math.floor(this.relatedScene.sys.game.config.height / 3),
        txt: ' Enhorabuena! \n Nuevo Record! ',
        size: 50, color: '#ff9', style: 'bold',
        stroke: '#5f1', sizeStroke: 16,
        shadowOsx: 2, shadowOsy: 2, shadowColor: '#111111',
        bool1: false, bool2: true, origin: [0.5, 0.5],
        elastic: false, dura: 0
      });
  
      this.txtnewrecord.create();

      this.relatedScene.tweens.add({
        targets: this.txtnewrecord.get(),
        scale: 2.1,
        ease: 'sine.out',
        duration: 1000,
        yoyo: true,
        delay: 500,
        repeat: -1,
        repeatDelay: 3000
      });
    } 
  }

  get()
  {
    return this.txt;
  }
}
