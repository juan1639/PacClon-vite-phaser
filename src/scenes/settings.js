
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
    static hi = 12000;
    static vidas = 3;
    static gameOver = false;

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
        iniY: 4,
        vel: 4
    };

    static pacmanPregame = {
        iniX: -4,
        iniY: 2,
        vel: 4
    };

    static fantasmasIniXY = {
        azul: [4, 8],
        rojo: [8, 8],
        verde: [12, 8],
        pink: [16, 8],
    };

    static fantasmasScary = {
        activo: false,
        duracion: 8000
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

    static botonesYcruceta = false;

    static coorCruceta = {
        xx: 60,
        yy: 1400,
        sizeX: 2.5,
        sizeY: 2.1
    };

    static cameraControles = {
        x: 0,
        y: 370,
        ancho: 800,
        alto: 280,
        scrollX: 0,
        scrollY: 1265
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

    static array_laberinto = [
        [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
        [9,5,1,1,1,1,1,1,1,9,1,1,1,1,1,1,1,5,9],
        [9,1,9,9,1,9,9,9,1,9,1,9,9,9,1,9,9,1,9],
    
        [9,1,9,9,1,9,9,9,1,9,1,9,9,9,1,9,9,1,9],
        [9,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,9],
        [9,1,9,9,1,9,1,9,9,9,9,9,1,9,1,9,9,1,9],
    
        [9,1,1,1,1,9,1,1,1,9,1,1,1,9,1,1,1,1,9],
        [9,9,9,9,1,9,9,9,1,9,1,9,9,9,1,9,9,9,9],
        [9,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,9],
    
        [9,1,9,9,1,9,1,9,1,9,1,9,1,9,1,9,9,1,9],
        [9,1,9,9,1,9,1,9,1,9,1,9,1,9,1,9,9,1,9],
        [0,1,1,1,1,9,1,1,1,1,1,1,1,9,1,1,1,1,0],
    
        [9,1,9,9,1,9,1,9,9,9,9,9,1,9,1,9,9,1,9],
        [9,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,9],
        [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
    ];

    // ------- Getters ---------
    static getPuntos() {
        return Settings.puntos;
    }

    static getNivel() {
        return Settings.nivel;
    }

    static getRecord() {
        return Settings.hi;
    }

    static getVidas() {
        return Settings.vidas;
    }

    static isFantasmasScary() {
        return Settings.fantasmasScary.activo;
    }

    static getFantasmasScaryDuracion() {
        return Settings.fantasmasScary.duracion;
    }

    static getFantasmasBonusInc() {
        return Settings.fantasmasBonusInc;
    }

    static isGameOver() {
        return Settings.gameOver;
    }

    static isBotonesYcruceta() {
        return Settings.botonesYcruceta;
    }

    static getCerezasIniXY() {
        return Settings.cerezasIniXY;
    }

    static getBonusCerezas() {
        return Settings.bonusCerezas;
    }

    static getCoorCruceta() {
        return Settings.coorCruceta;
    }

    static getScreen() {
        return Settings.screen;
    }

    static getDepth() {
        return Settings.depth;
    }

    static getCameraControles() {
        return Settings.cameraControles;
    }

    static getCameraScores() {
        return Settings.cameraScores;
    }

    // ------- Setters ---------
    static setPuntos(ptos) {
        Settings.puntos = ptos;
    }

    static setNivel(level) {
        Settings.nivel = level;
    }

    static setRecord(hiScore) {
        Settings.hi = hiScore;
    }

    static setVidas(lifes) {
        Settings.vidas = lifes;
    }
    
    static setFantasmasScary(bool) {
        Settings.fantasmasScary.activo = bool;
    }

    static setFantasmasScaryDuracion(tiempo) {
        Settings.fantasmasScary.duracion = tiempo;
    }

    static setFantasmasBonusInc(valor) {
        Settings.fantasmasBonusInc.contador = valor;
    }

    static setGameOver(bool) {
        Settings.gameOver = bool;
    }

    static setBotonesYcruceta(bool) {
        Settings.botonesYcruceta = bool;
    }

    static setScreen(w, h, bx, by) {
        Settings.screen.width = w;
        Settings.screen.height = h;
        Settings.screen.escBoundsX = bx;
        Settings.screen.escBoundsY = by;
    }

    static setDepth(fondo, puntitos, pared, item, jugador, fantasmas, textos) {
        
        Settings.depth.fondo = fondo;
        Settings.depth.puntitos = puntitos;
        Settings.depth.pared = pared;
        Settings.depth.item = item;
        Settings.depth.jugador = jugador;
        Settings.depth.fantasmas = fantasmas;
        Settings.depth.textos = textos;
    }
}
