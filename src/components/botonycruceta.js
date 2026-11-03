import { Settings } from "../scenes/settings.js";

export class CrucetaDireccion
{
    constructor(scene, direccion)
    {
        this.relatedScene = scene;
        this.direccion = direccion;
    }

    create()
    {
        const { id, press, x, y, ang, scX, scY } = this.direccion;

        this.boton = this.relatedScene.add.image(x, y, id).setInteractive();
        this.boton.setScale(scX, scY).setAngle(ang).setDepth(4);
        this.boton.setX(x).setY(y);
        this.boton.setData('on', true);
        this.boton.setData('press', press);
        
        if (!Settings.isBotonesYcruceta()) this.boton.setVisible(false);

        this.isDown = false;
    
        this.boton.on('pointerover', () => {
          this.boton.setScale(scX + 0.1, scY + 0.1);
        });

        // Al sacar el dedo del botón también se suelta (si no, se quedaba pulsado)
        this.boton.on('pointerout', () => {
          this.boton.setScale(scX, scY);
          this.isDown = false;
        });

        this.boton.on('pointerdown', () => {
            this.isDown = true;
        });

        this.boton.on('pointerup', () => {
            this.isDown = false;
        });

        // Soltar en cualquier parte de la pantalla (o fuera del canvas) también cuenta.
        // Phaser quita estos listeners de la escena al hacer shutdown.
        this.relatedScene.input.on('pointerup', () => this.isDown = false);
        this.relatedScene.input.on('pointerupoutside', () => this.isDown = false);
    }
    
    get()
    {
        return this.boton;
    }
}

// ======================================================================================
export class IconoGamePad
{
    constructor(scene, direccion)
    {
        this.relatedScene = scene;
        this.direccion = direccion;
    }

    create()
    {
        const {x, y, id, ang, scX, scY} = this.direccion;
        
        this.iconogamepad = this.relatedScene.add.image(x, y, id).setInteractive();
        this.iconogamepad.setScale(scX, scY).setAngle(ang);
        this.iconogamepad.setDepth(4).setBlendMode(Phaser.BlendModes.ADD);
        this.iconogamepad.setX(x).setY(y);
        this.iconogamepad.setData('on', true);

        if (Settings.isBotonesYcruceta()) this.iconogamepad.setVisible(false);

        this.isDown = false;
    
        this.iconogamepad.on('pointerover', () => {
          this.iconogamepad.setScale(scX + 0.4, scY + 0.4);
        });

        this.iconogamepad.on('pointerout', () => {
          this.iconogamepad.setScale(scX, scY);
        });

        this.iconogamepad.on('pointerdown', () => {
            this.isDown = true;            
        });

        this.iconogamepad.on('pointerup', () => {
            this.isDown = false;
        });
    }
    
    get()
    {
        return this.iconogamepad;
    }
}
