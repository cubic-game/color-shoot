import BootScene from './scenes/BootScene';
import PreloadScene from './scenes/PreloadScene';
import MenScene from './scenes/MenScene';
import GameScene from './scenes/GameScene';
import GameOverScene from './scenes/GameOverScene';

const App = function () {
  this.VERSION = '0.0.1';
  this.IS_DEV = true;
}

App.prototype.start = function () {
  // scenes
  const scenes = [];
  scenes.push(BootScene);
  scenes.push(PreloadScene);
  scenes.push(MenScene);
  scenes.push(GameScene);
  scenes.push(GameOverScene);
  // game config
  const config = {
    type: Phaser.AUTO,
    parent: 'phaser-app',
    title: 'Color Shoot',
    url: '',
    width: 750,
    height: 1334,
    scene: scenes,
    backgroundColor: 0xFBFFB9,
    physics: {
      default: 'arcade',
      arcade: {
        // debug: true,
      }
    }
  }
  // create game app
  let game = new Phaser.Game(config);
  // globals
  game.IS_DEV = this.IS_DEV;
  game.VERSION = this.VERSION;
  game.URL = '';
  // sound
}

export default App;
