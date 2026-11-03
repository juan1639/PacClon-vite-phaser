import { Settings } from "../scenes/settings.js";
import { Textos } from "../components/Textos.js";

function overlapComePuntitos(jugador, puntito)
{
    suma_puntos(puntito);
    actualizar_puntos(this);
    puntito.disableBody(true, true);
    play_sonidos(this.sonido_waka, false, 0.9);
}

function overlapComePuntitogordo(jugador, puntitogordo)
{
    suma_puntos(puntitogordo);
    actualizar_puntos(this);

    puntitogordo.disableBody(true, true);

    // El modo scary (y sus timers) lo controla la escena Game, para poder
    // reiniciarlo o cancelarlo sin acumular temporizadores.
    this.iniciar_modo_scary();

    play_sonidos(this.sonido_eatingGhost, false, 0.9);
}

function overlapJugadorFantasmas(jugador, fantasma)
{
    // Cheat "JON": Pac-Man es invulnerable y los fantasmas lo atraviesan,
    // pero en modo scary se les sigue pudiendo comer.
    if (Settings.isInvulnerable() && !Settings.isFantasmasScary()) return;

    if (!Settings.isFantasmasScary())
    {
        play_sonidos(this.sonido_jugadorDies, false, 0.7);

        jugador.disableBody(true, true);
        this.jugadordies.create(jugador.x, jugador.y);

        this.timeline = this.add.timeline([
        {
            at: Settings.pausa.pacmanDies,
            run: () =>
            {
                this.jugadordies.get().disableBody(true, true);
                this.jugador.get().enableBody(
                    true, Settings.pacman.iniX * Settings.tileXY.x, Settings.pacman.iniY * Settings.tileXY.y, true, true
                );
                this.jugador.intentoGiro = 'right';
                this.jugador.direccion = 'right';

                restar_vida();

                // 3 vidas en total: al perder la tercera (vidas = 0) es game over
                if (Settings.getVidas() <= 0)
                {
                    Settings.setGameOver(true);
                    this.jugador.get().setVisible(false);
                    this.gameover.create(this.jugador.get().x, this.jugador.get().y);
                    // this.cameras.main.startFollow(this.gameover.get());
                }

                this.jugadorshowvidas.refrescar();

                this.fantasmas.get().children.iterate((fant, index) =>
                {

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
        }]);

        this.timeline.play();

    } else
    {
        play_sonidos(this.sonido_eatingGhost, false, 0.9);

        fantasma.setVisible(false);
        this.ojos.get().getChildren()[fantasma.getData('id')].setVisible(true);
        Settings.pausa.comeFantasma = true;

        this.time.delayedCall(Settings.pausa.comeFantasmaDuracion, () => Settings.pausa.comeFantasma = false);

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
        actualizar_puntos(this);

        Settings.setFantasmasBonusInc(Settings.getFantasmasBonusInc().contador + 1);
        if (Settings.getFantasmasBonusInc().contador >= 4) Settings.setFantasmasBonusInc(0);
    }
}

function exceptoNotVisible(jugador, fantasma)
{
    if (!fantasma.visible || Settings.getInvisible()) return false;
    return true;
}

function overlapJugadorCerezas(jugador, cerezas)
{
    suma_puntos(cerezas);
    actualizar_puntos(this);
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

    // Timer de la escena: se cancela solo si se reinicia/cambia de escena
    this.time.delayedCall(15000, () =>
    {
        this.cerezas.get().enableBody(
            true,
            Settings.getCerezasIniXY()[0] * Settings.tileXY.x,
            Settings.getCerezasIniXY()[1] * Settings.tileXY.y,
            true, true
        );
    });
}

function particulas(x, y, particula, vel, span, size, color, sprite, bool, scene)
{
    const partis = scene.add.particles(x, y, particula, {
        speed: vel,
        lifespan: span,
        scale: size,
        tint: color,
        // gravityY: 200
        blendMode: 'ADD'
    });

    if (bool) partis.startFollow(sprite);
}

function suma_puntos(puntos)
{
    const bonus = Settings.getPuntos() + puntos.getData('puntos');
    Settings.setPuntos(bonus);
}

// Actualiza el marcador de puntos y da la vida extra al llegar a los puntos
// (una sola vez por partida). Se llama siempre que se suman puntos.
function actualizar_puntos(scene)
{
    scene.marcadorPtos.update(Settings.getTxtScore(), Settings.getPuntos());

    if (Settings.isVidaExtraConseguida() || Settings.getPuntos() < Settings.getPuntosVidaExtra()) return;

    Settings.setVidaExtraConseguida(true);
    Settings.setVidas(Settings.getVidas() + 1);
    scene.jugadorshowvidas.refrescar();

    play_sonidos(scene.sonido_eatingCherry, false, 0.9);

    const jugador = scene.jugador.get();

    scene.txt_vidaextra = new Textos(scene, {
        x: jugador.x, y: jugador.y,
        txt: ' Extra Life! ',
        size: 50, color: '#ffa', style: 'bold',
        stroke: '#5f1', sizeStroke: 16,
        shadowOsx: 2, shadowOsy: 2, shadowColor: '#111111',
        bool1: false, bool2: true, origin: [0.5, 0.5],
        elastic: jugador.y - Settings.tileXY.y * 2, dura: 2000
    });

    scene.txt_vidaextra.create();
    scene.txt_vidaextra.get().setDepth(Settings.getDepth().textos).setAlpha(1);
}

function restar_vida()
{
    const actualizar = Settings.getVidas() - 1;
    Settings.setVidas(actualizar);
}

function play_sonidos(id, boolLoop, volumen)
{
    id.play();
    id.loop = boolLoop;
    id.volume = volumen;
}

export {
    overlapComePuntitos,
    overlapComePuntitogordo,
    overlapJugadorFantasmas,
    exceptoNotVisible,
    overlapJugadorCerezas,
    particulas,
    suma_puntos,
    actualizar_puntos,
    restar_vida,
    play_sonidos
};
