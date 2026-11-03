import Phaser from 'phaser';
import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { Congratulations } from './scenes/Congratulations';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';
import { Pausa } from './scenes/Pausa';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 550,
    parent: 'game-container',
    backgroundColor: '#807011',
    physics: {
        default: 'arcade',
        arcade: {
          debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        Game,
        Congratulations,
        Pausa   // la última para que se dibuje encima de Game
    ]
};

export default new Phaser.Game(config);
