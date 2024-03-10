import { Settings } from '../scenes/settings.js';

export class Textos
{
    constructor(scene, datos)
    {
        this.relatedScene = scene;
        this.datos = datos;
    }

    create()
    {
        const excepciones = Settings.getBonusCerezas().concat(Settings.getFantasmasBonusInc().puntos);
        const excepcionesString = excepciones.map(excepcion => excepcion.toString());
        excepcionesString.push(' Congratulations! ');
        excepcionesString.push(' Level Up! ');
        console.log(excepcionesString);

        const {
            x, y, txt,
            size, color, style,
            stroke, sizeStroke,
            shadowOsx, shadowOsy, shadowColor,
            bool1, bool2, origin,
            elastic, dura
        } = this.datos;

        this.texto = this.relatedScene.add.text(x, y, txt, {
            fontSize: size + 'px',
            fill: color,
            fontFamily: 'verdana, arial, sans-serif',
            fontStyle: style
        });

        this.texto.setOrigin(origin[0], origin[1]);
        this.texto.setStroke(stroke, sizeStroke);
        this.texto.setShadow(shadowOsx, shadowOsy, shadowColor, 2, bool1, bool2);
        //#de77ae

        // if (!excepcionesString.includes(txt)) this.texto.setX(centrar_txt(this.texto, args[12] * args[13]));

        this.decremento_alpha(txt, excepcionesString);
        this.elastic(txt, elastic, dura);

        console.log(this.texto);
    }

    decremento_alpha(txt, excepcionesString)
    {
        if (excepcionesString.includes(txt) && txt !== ' Congratulations! ')
        {
            this.relatedScene.tweens.add({
                targets: this.texto,
                alpha: 0,
                ease: 'Sine.easeInOut',
                duration: Settings.getFantasmasBonusInc().duracion
            });
        }
    }

    elastic(txt, elastic, dura)
    {
        if (dura > 0)
        {
            this.relatedScene.tweens.add({
                targets: this.texto,
                y: elastic,
                ease: 'Elastic',
                duration: dura
            });
        }
    }

    get()
    {
        return this.texto;
    }
}
