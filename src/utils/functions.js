import { Settings } from "../scenes/settings.js";

function overlapComePuntitos(jugador, puntito)
{
    suma_puntos(puntito);
    this.marcadorPtos.update(Settings.getTxtScore(), Settings.getPuntos());
    puntito.disableBody(true, true);
    play_sonidos(this.sonido_waka, false, 0.9);
}

function overlapComePuntitogordo(jugador, puntitogordo)
{
    suma_puntos(puntitogordo);
    this.marcadorPtos.update(Settings.getTxtScore(), Settings.getPuntos());

    puntitogordo.disableBody(true, true);
    Settings.setFantasmasScary(true);

    setTimeout(() =>
    {
        Settings.setFantasmasScary(false);
        Settings.setFantasmasIntermitente(false);
        this.fantasmas.clear_tint();
        this.fantasmas.get().setBlendMode('ERASE');
        this.sonido_fantasmasScary.pause();
        Settings.setFantasmasBonusInc(0);

    }, this.fantasmas.duracion_scary());

    setTimeout(() =>
    {
        Settings.setFantasmasIntermitente(true);
        
    }, Math.floor(this.fantasmas.duracion_scary() / 1.5));

    play_sonidos(this.sonido_eatingGhost, false, 0.9);
    setTimeout(() => play_sonidos(this.sonido_fantasmasScary, true, 0.9), 500);
}

function exceptoScary()
{
    if (Settings.isFantasmasScary()) return false;
    return true;
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
    // console.log(bonus, Settings.getPuntos());
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
    exceptoScary,
    particulas,
    suma_puntos,
    restar_vida,
    play_sonidos
};
