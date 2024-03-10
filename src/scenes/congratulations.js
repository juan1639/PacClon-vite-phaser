import { Settings } from './settings.js';
import { BotonNuevaPartida } from "../components/boton-nuevapartida.js";
import {particulas, play_sonidos } from '../utils/functions.js';

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

    this.txt_titulo = textos([
      Math.floor(this.sys.game.config.width / 2), Math.floor(this.sys.game.config.height / 3.5),
      ' Nivel Superado! ', 80, 'bold', 1, 1, '#fa1', 15, true, '#ffa', 'verdana, arial, sans-serif',
      this.sys.game.config.width, Settings.getScreen().escBoundsX
    ], this);

    this.txt_titulo.setOrigin(0.5, 0.5);
    this.txt_titulo.setDepth(Settings.getDepth().textos).setAlpha(1);
    this.txt_titulo.setStroke('#f91', 16);
    this.txt_titulo.setShadow(2, 2, '#111111', 2, false, true);
    // this.txt_titulo.setX(centrar_txt(this.txt_titulo, this.sys.game.config.width));

    particulas(
      this.sys.game.config.width / 2, this.sys.game.config.height / 2,
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
            this.botoninicio.create('game');
          }
        }
    ]);
    
    this.timeline.play();

    play_sonidos(this.sonido_intermision, false, 0.8);

    console.log(this.txt_titulo);
  }
}
