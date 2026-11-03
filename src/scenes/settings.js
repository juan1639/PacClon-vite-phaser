// Récord guardado en el navegador. La clave lleva el nombre del juego porque
// en itch.io todos los juegos comparten el mismo dominio (y localStorage).
const CLAVE_RECORD = 'pacclon-vite-phaser.record';
const RECORD_INICIAL = 12000;

function leer_record()
{
    try
    {
        const guardado = parseInt(localStorage.getItem(CLAVE_RECORD), 10);
        if (Number.isFinite(guardado)) return Math.max(guardado, RECORD_INICIAL);
    } catch (e)
    {
        // localStorage puede no estar disponible (modo privado, iframe bloqueado...)
    }

    return RECORD_INICIAL;
}

export class Settings
{
    static screen = {
        width: 800,
        height: 550,
        escBoundsX: 1.45,
        escBoundsY: 1.6
    };

    static tileXY = {
        x: 64,
        y: 64
    };

    static puntos = 0;
    static nivel = 1;
    static hi = leer_record();
    static vidas = 3;
    static gameOver = false;

    // Una vida extra por partida (se reinicia en MainMenu.init, no en cada nivel)
    static vidaExtra = {
        puntos: 10000,
        conseguida: false
    };

    static txtScore = ' Score: ';

    static pausa = {
        inicial: 4300,
        pacmanDies: 3100,
        comeFantasma: false,
        comeFantasmaDuracion: 500,
        nivelSuperado: false,
        nivelSuperadoDuracion: 3000
    };

    static pacman = {
        iniX: 9,
        iniY: 4
    };

    static pacmanPregame = {
        iniX: -4,
        iniY: 2
    };

    static fantasmasIniXY = {
        azul: [4, 8],
        rojo: [8, 8],
        verde: [12, 8],
        pink: [16, 8],
    };

    static fantasmasScary = {
        activo: false,
        duracion: 9000,
        intermitente: false
    };

    static fantasmasBonusInc = {
        puntos: [200, 400, 800, 1600],
        color: ['#f91', '#f61', '#f41', '#f21'],
        contador: 0,
        duracion: 3200
    };

    static cerezasIniXY = [9, 8];

    static bonusCerezas = [
        300, 300, 500, 800, 1000, 2000, 3000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000
    ];

    static invisible = false;
    static botonesYcruceta = false;

    // Cheat (J-O-N en la pantalla de título): los fantasmas no matan
    static invulnerable = false;

    static coorCruceta = {
        xx: 60,
        yy: 1400,
        sizeX: 2.5,
        sizeY: 2.1
    };

    static cameraControles = {
        x: 0,
        y: 300,
        ancho: 800,
        alto: 290,
        scrollX: 0,
        scrollY: 1250
    };

    static cameraScores = {
        x: 0,
        y: 0,
        ancho: 800,
        alto: 34,
        scrollX: 0,
        scrollY: -90
    };

    static depth = {
        fondo: 0,
        puntitos: 10,
        pared: 20,
        item: 30,
        jugador: 40,
        fantasmas: 50,
        textos: 60
    };

    // ------- Getters ---------
    static getPuntos()
    {
        return Settings.puntos;
    }

    static getNivel()
    {
        return Settings.nivel;
    }

    static getRecord()
    {
        return Settings.hi;
    }

    static getVidas()
    {
        return Settings.vidas;
    }

    static getTxtScore()
    {
        return Settings.txtScore;
    }

    static getInvisible()
    {
        return Settings.invisible;
    }

    static isInvulnerable()
    {
        return Settings.invulnerable;
    }

    static isFantasmasScary()
    {
        return Settings.fantasmasScary.activo;
    }

    static isFantasmasIntermitente()
    {
        return Settings.fantasmasScary.intermitente;
    }

    static getFantasmasScaryDuracion()
    {
        return Settings.fantasmasScary.duracion;
    }

    static getFantasmasBonusInc()
    {
        return Settings.fantasmasBonusInc;
    }

    static isGameOver()
    {
        return Settings.gameOver;
    }

    static getPuntosVidaExtra()
    {
        return Settings.vidaExtra.puntos;
    }

    static isVidaExtraConseguida()
    {
        return Settings.vidaExtra.conseguida;
    }

    static isBotonesYcruceta()
    {
        return Settings.botonesYcruceta;
    }

    static getCerezasIniXY()
    {
        return Settings.cerezasIniXY;
    }

    static getBonusCerezas()
    {
        return Settings.bonusCerezas;
    }

    static getCoorCruceta()
    {
        return Settings.coorCruceta;
    }

    static getScreen()
    {
        return Settings.screen;
    }

    static getDepth()
    {
        return Settings.depth;
    }

    static getCameraControles()
    {
        return Settings.cameraControles;
    }

    static getCameraScores()
    {
        return Settings.cameraScores;
    }

    // ------- Setters ---------
    static setPuntos(ptos)
    {
        Settings.puntos = ptos;
    }

    static setNivel(level)
    {
        Settings.nivel = level;
    }

    static setRecord(hiScore)
    {
        Settings.hi = hiScore;

        // Si no se puede guardar, el récord sigue valiendo hasta recargar la página
        try
        {
            localStorage.setItem(CLAVE_RECORD, String(hiScore));
        } catch (e) {}
    }

    static setVidas(lifes)
    {
        Settings.vidas = lifes;
    }
    
    static setFantasmasScary(bool)
    {
        Settings.fantasmasScary.activo = bool;
    }

    static setFantasmasIntermitente(bool)
    {
        Settings.fantasmasScary.intermitente = bool;
    }

    static setFantasmasBonusInc(valor)
    {
        Settings.fantasmasBonusInc.contador = valor;
    }

    static setGameOver(bool)
    {
        Settings.gameOver = bool;
    }

    static setVidaExtraConseguida(bool)
    {
        Settings.vidaExtra.conseguida = bool;
    }

    static setBotonesYcruceta(bool)
    {
        Settings.botonesYcruceta = bool;
    }

    static setInvulnerable(bool)
    {
        Settings.invulnerable = bool;
    }
}
