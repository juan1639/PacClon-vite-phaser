// ============================================================
//      P a c  C l o n  -  Phaser  |  By Juan Eguia
//   
//      https://juan1639.github.io/PacClon-phaser
// 
// ------------------------------------------------------------
import { Laberinto } from '../components/laberinto.js';
import { Puntitos, PuntitosGordos } from '../components/puntitos.js';
import { Jugador, JugadorDies, JugadorShowVidas } from '../components/jugador.js';
import { Fantasma, OjosFantasma } from '../components/fantasma.js';
import { Cerezas } from '../components/cerezas.js';
import { Textos } from '../components/Textos.js';
import { Marcador } from './../components/marcador.js';
import { Settings } from './settings.js';
import { BotonFullScreen, BotonNuevaPartida } from '../components/boton-nuevapartida.js';
import { CrucetaDireccion, IconoGamePad } from '../components/botonycruceta.js';
import { GameOver } from '../components/game-over.js';

import {
  play_sonidos,
  restar_vida,
  suma_puntos
} from '../utils/functions.js';

export class Game extends Phaser.Scene
{
  constructor()
  {
    super('game');
  }

  init()
  {
    Settings.setGameOver(false);
    Settings.setFantasmasScary(false);
    Settings.setFantasmasBonusInc(0);

    this.set_pausaInicial(4300);

    this.laberinto = new Laberinto(this);
    this.puntito = new Puntitos(this);
    this.puntitogordo = new PuntitosGordos(this);
    this.jugador = new Jugador(this);
    this.jugadordies = new JugadorDies(this);
    this.fantasmas = new Fantasma(this);
    this.ojos = new OjosFantasma(this);
    this.cerezas = new Cerezas(this);

    this.instanciar_marcadores();
    this.instanciar_mobileControls();

    this.gameover = new GameOver(this);
    this.botonrejugar = new BotonNuevaPartida(this);
  }

  preload() {}

  create()
  {
    this.add.image(0, 0, 'fondo').setOrigin(0, 0);
    
    this.set_sonidos();
    this.set_cameras();
    this.set_cameras_controles();
    this.set_cameras_marcadores();

    this.laberinto.create();
    this.puntito.create();
    this.puntitogordo.create();
    this.jugador.create(Settings.pacman.iniX * Settings.tileXY.x, Settings.pacman.iniY * Settings.tileXY.y);
    this.fantasmas.create();
    this.ojos.create();
    this.cerezas.create();

    this.jugadorshowvidas.create();
    
    this.marcadorPtos.create();
    this.marcadorNivel.create();
    this.marcadorHi.create();
    this.botonfullscreen.create();

    this.crucetaleft.create();
    this.crucetaright.create();
    this.crucetaup.create();
    this.crucetadown.create();
    this.iconogamepad.create();

    this.cameras.main.startFollow(this.jugador.get());
    // this.cameras.main.followOffset.set(0, 0);

    this.crear_colliders();
  }

  update() {

    if (!this.pausa_inicial.activa && !Settings.isGameOver())
    {
      this.jugador.update();
      this.fantasmas.update();
      this.ojos.update();
      this.cerezas.update();
    }

    if (this.puntito.get().countActive() <= 0 && !Settings.pausa.nivelSuperado)
    {
      Settings.pausa.nivelSuperado = true;
      Settings.setFantasmasScary(false);
      this.texto_enhorabuena();

      setTimeout(() => {
        Settings.pausa.nivelSuperado = false;
        this.scene.start('congratulations');
      }, Settings.pausa.nivelSuperadoDuracion);
    }
    
    this.mobile_controls();
  }

  set_pausaInicial(tiempo)
  {
    this.pausa_inicial = {
      duracion: tiempo,
      activa: true
    };

    this.txtpreparado = new Textos(this, {
      x: Settings.pacman.iniX * Settings.tileXY.x,
      y: 0,
      txt: ' Ready! ',
      size: 78, color: '#ffa', style: 'bold',
      stroke: '#ea1', sizeStroke: 16,
      shadowOsx: 2, shadowOsy: 2, shadowColor: '#111111',
      bool1: false, bool2: true, origin: [0.5, 0],
      elastic: (Settings.pacman.iniY + 1) * Settings.tileXY.y, dura: 3000
    });
    
    this.txtpreparado.create();
    this.txtpreparado.get().setDepth(Settings.getDepth().textos);

    this.timeline = this.add.timeline([
      {
        at: this.pausa_inicial.duracion,
        run: () => {
          this.pausa_inicial.activa = false,
          this.txtpreparado.get().setVisible(false);
        }
      }
    ]);

    this.timeline.play();
    console.log(this.txtpreparado);
  }

  texto_enhorabuena()
  {
    this.txtcongrats = new Textos(this, {
      x: this.jugador.get().x, y: 0,
      txt: ' Congratulations! ',
      size: 70, color: '#ffa', style: 'bold',
      stroke: '#5f1', sizeStroke: 16,
      shadowOsx: 2, shadowOsy: 2, shadowColor: '#111111',
      bool1: false, bool2: true, origin: [0.5, 0.5],
      elastic: this.jugador.get().y - Settings.tileXY.y, dura: 3000
    });
    
    this.txtcongrats.create();
    this.txtcongrats.get().setDepth(Settings.getDepth().textos);
  }

  crear_colliders()
  {
    //Overlap Jugador-Puntitos
    this.physics.add.overlap(this.jugador.get(), this.puntito.get(), (jugador, puntito) => {

      suma_puntos(puntito);
      this.marcadorPtos.update(Settings.getTxtScore(), Settings.getPuntos());
      puntito.disableBody(true, true);
      play_sonidos(this.sonido_waka, false, 0.9);
    });

    //Overlap Jugador-PuntitosGordos
    this.physics.add.overlap(this.jugador.get(), this.puntitogordo.get(), (jugador, puntitogordo) => {

      suma_puntos(puntitogordo);
      this.marcadorPtos.update(Settings.getTxtScore(), Settings.getPuntos());

      puntitogordo.disableBody(true, true);
      Settings.setFantasmasScary(true);

      setTimeout(() => {
        Settings.setFantasmasScary(false);
        this.fantasmas.clear_tint();
        this.sonido_fantasmasScary.pause();
        Settings.setFantasmasBonusInc(0);

      }, this.fantasmas.duracion_scary());

      play_sonidos(this.sonido_eatingGhost, false, 0.9);
      setTimeout(() => play_sonidos(this.sonido_fantasmasScary, true, 0.9), 500);

    }, () => {

      if (Settings.isFantasmasScary()) return false;
      return true;
    });

    //Overlap Jugador-Fantasmas
    this.physics.add.overlap(this.jugador.get(), this.fantasmas.get(), (jugador, fantasma) => {

      if (!Settings.isFantasmasScary())
      {
        play_sonidos(this.sonido_jugadorDies, false, 0.7);

        jugador.disableBody(true, true);
        this.jugadordies.create(jugador.x, jugador.y);

        this.timeline = this.add.timeline([
          {
            at: Settings.pausa.pacmanDies,
            run: () => {
              this.jugadordies.get().disableBody(true, true);
              this.jugador.get().enableBody(
                true, Settings.pacman.iniX * Settings.tileXY.x, Settings.pacman.iniY * Settings.tileXY.x, true, true
              );
              this.jugador.intentoGiro = 'right';
              this.jugador.direccion = 'right';

              restar_vida();

              if (Settings.getVidas() < 0)
              {
                Settings.setGameOver(true);
                this.jugador.get().setVisible(false);
                this.gameover.create(this.jugador.get().x, this.jugador.get().y);
                // this.cameras.main.startFollow(this.gameover.get());
              }

              this.jugadorshowvidas.get().children.iterate((vida, index) => {
                if (index === Settings.getVidas()) vida.setVisible(false);
              });

              this.fantasmas.get().children.iterate((fant, index) => {

                if (Settings.isGameOver())
                {
                  fant.setVisible(false);

                } else
                {
                  fant.setX(Settings.fantasmasIniXY[Object.keys(Settings.fantasmasIniXY)[index]][0] * Settings.tileXY.x);
                  fant.setY(Settings.fantasmasIniXY[Object.keys(Settings.fantasmasIniXY)[index]][1] * Settings.tileXY.y);
                }
              });
            }
          }
        ]);

        this.timeline.play();

      } else {

        play_sonidos(this.sonido_eatingGhost, false, 0.9);

        fantasma.setVisible(false);
        this.ojos.get().getChildren()[fantasma.getData('id')].setVisible(true);
        Settings.pausa.comeFantasma = true;

        setTimeout(() => Settings.pausa.comeFantasma = false, Settings.pausa.comeFantasmaDuracion);

        this.txt_bonusfantasmas = new Textos(this, {
          x: jugador.x, y: jugador.y,
          txt: Settings.getFantasmasBonusInc().puntos[Settings.getFantasmasBonusInc().contador].toString(),
          size: 40, color: '#ff7', style: 'bold',
          stroke: Settings.getFantasmasBonusInc().color[Settings.getFantasmasBonusInc().contador], sizeStroke: 16,
          shadowOsx: 2, shadowOsy: 2, shadowColor: '#111111',
          bool1: false, bool2: true, origin: [0.5, 0.5],
          elastic: jugador.y - Settings.tileXY.y, dura: 2000
        });
        
        this.txt_bonusfantasmas.create();
        this.txt_bonusfantasmas.get().setDepth(Settings.getDepth().textos).setAlpha(1);

        const bonus = Settings.getPuntos() + Settings.getFantasmasBonusInc().puntos[Settings.getFantasmasBonusInc().contador];
        Settings.setPuntos(bonus);
        this.marcadorPtos.update(Settings.getTxtScore(), Settings.getPuntos());

        Settings.setFantasmasBonusInc(Settings.getFantasmasBonusInc().contador + 1);
        if (Settings.getFantasmasBonusInc().contador >= 4) Settings.setFantasmasBonusInc(0);
      }
    }, (jugador, fantasma) => {

      if (!fantasma.visible) return false;
      return true;
    });

    //Overlap Jugador-Cerezas
    this.physics.add.overlap(this.jugador.get(), this.cerezas.get(), (jugador, cerezas) => {

      suma_puntos(cerezas);
      this.marcadorPtos.update(Settings.getTxtScore(), Settings.getPuntos());
      cerezas.disableBody(true, true);
      play_sonidos(this.sonido_eatingCherry, false, 0.9);

      this.txt_bonuscerezas = new Textos(this, {
        x: jugador.x, y: jugador.y,
        txt: cerezas.getData('puntos').toString(),
        size: 40, color: '#ffa', style: 'bold',
        stroke: '#f51', sizeStroke: 16,
        shadowOsx: 2, shadowOsy: 2, shadowColor: '#111111',
        bool1: false, bool2: true, origin: [0.5, 0.5],
        elastic: jugador.y - Settings.tileXY.y, dura: 2000
      });
      
      this.txt_bonuscerezas.create();
      this.txt_bonuscerezas.get().setDepth(Settings.getDepth().textos).setAlpha(1);

      setTimeout(() => {
        this.cerezas.get().enableBody(
          true,
          Settings.getCerezasIniXY()[0] * Settings.tileXY.x,
          Settings.getCerezasIniXY()[1] * Settings.tileXY.y,
          true, true
        );
      }, 15000); // Frecuencia volver a salir Cerezas
    });
  }

  mobile_controls()
  {
    if (!Settings.isBotonesYcruceta() && this.iconogamepad.isDown)
    {
      Settings.setBotonesYcruceta(true);
      this.iconogamepad.get().setVisible(false);

      this.crucetaleft.get().setVisible(true);
      this.crucetaright.get().setVisible(true);
      this.crucetaup.get().setVisible(true);
      this.crucetadown.get().setVisible(true);
    }
  }

  set_cameras()
  {
    this.cameras.main.setBounds(
      0, 0, Math.floor(this.sys.game.config.width * Settings.getScreen().escBoundsX),
      Math.floor(this.sys.game.config.height * Settings.getScreen().escBoundsY)
    );

    this.physics.world.setBounds(
      0, 0, Math.floor(this.sys.game.config.width * Settings.getScreen().escBoundsX),
      Math.floor(this.sys.game.config.height * Settings.getScreen().escBoundsY)
    );
  }

  set_cameras_controles()
  {
    var { x, y, ancho, alto, scrollX, scrollY } = Settings.getCameraControles();
    
    this.mapa_controles = this.cameras.add(x, y, ancho, alto).setZoom(0.9).setName('view-controls').setAlpha(0.7).setOrigin(0, 0);
    this.mapa_controles.scrollX = scrollX;
    this.mapa_controles.scrollY = scrollY;
    // console.log(this.mapa_controles);
  }
  
  set_cameras_marcadores()
  {
    var { x, y, ancho, alto, scrollX, scrollY } = Settings.getCameraScores();
    
    this.mapa_scores = this.cameras.add(x, y, ancho, alto).setZoom(0.6).setName('view-scores').setAlpha(1).setOrigin(0, 0);
    this.mapa_scores.scrollX = scrollX;
    this.mapa_scores.scrollY =scrollY;
    // console.log(this.mapa_scores);
  }

  instanciar_marcadores()
  {
    const ancho = this.sys.game.config.width;
    const alto = this.sys.game.config.height;

    const marcadoresPosY = -99;

    this.jugadorshowvidas = new JugadorShowVidas(this, {left: Math.floor(ancho * 1.4), top: marcadoresPosY + 9});

    this.marcadorPtos = new Marcador(this, {
      x: 10, y: marcadoresPosY, size: 40, txt: Settings.getTxtScore(), color: '#fff', id: 0
    });

    this.marcadorNivel = new Marcador(this, {
      x: Math.floor(ancho / 2), y: marcadoresPosY, size: 40, txt: ' Level: ', color: '#ff5', id: 1
    });

    this.marcadorHi = new Marcador(this, {
      x: Math.floor(ancho / 1.2), y: marcadoresPosY, size: 40, txt: ' Record: ', color: '#fff', id: 2
    });

    this.botonfullscreen = new BotonFullScreen(this, {x: Math.floor(ancho * 1.33), y: marcadoresPosY + 9});
  }

  instanciar_mobileControls()
  {
    var { xx, yy, sizeX, sizeY } = Settings.getCoorCruceta();
    
    this.crucetaleft = new CrucetaDireccion(this, {
      id: 'cruceta-left',
      press: 'left',
      x: xx, y: yy + 55,
      ang: 0,
      scX: sizeX, scY: sizeY
    });
    
    this.crucetaright = new CrucetaDireccion(this, {
      id: 'cruceta-right',
      press: 'right',
      x: xx + 350, y: yy + 55,
      ang: 0,
      scX: sizeX, scY: sizeY
    });
    
    this.crucetaup = new CrucetaDireccion(this, {
      id: 'cruceta-left',
      press: 'up',
      x: xx + 175, y: yy - 80,
      ang: 90,
      scX: sizeX - 0.7, scY: sizeY + 0.1
    });
    
    this.crucetadown = new CrucetaDireccion(this, {
      id: 'cruceta-left',
      press: 'down',
      x: xx + 175, y: yy + 80,
      ang: 270,
      scX: sizeX - 0.5, scY: sizeY + 0.1
    });

    this.iconogamepad = new IconoGamePad(this, {
      id: 'icono-gamepad',
      x: xx + 90, y: yy,
      ang: 0,
      scX: 2, scY: 2
    });
  }

  set_sonidos()
  {
    this.sonido_preparado = this.sound.add('sonidoPacmanInicioNivel');
    play_sonidos(this.sonido_preparado, false, 0.8);

    this.sonido_waka = this.sound.add('sonidoWakaWaka');
    this.sonido_jugadorDies = this.sound.add('sonidoPacmanDies');
    this.sonido_eatingGhost = this.sound.add('sonidoPacmanEatingGhost');
    this.sonido_eatingCherry = this.sound.add('sonidoPacmanEatingCherry');
    this.sonido_fantasmasScary = this.sound.add('sonidoPacmanAzules');
    this.sonido_sirena = this.sound.add('sonidoPacmanSirena');
  }
}
