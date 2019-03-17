export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({key: 'PreloadScene', active: false});
  }

  init() {
  }

  preload() {
    this.load.image('ball-red', 'assets/images/ball-red.png');
    this.load.image('ball-blue', 'assets/images/ball-blue.png');
    this.load.image('ball-yellow', 'assets/images/ball-yellow.png');

    this.load.image('small-red', 'assets/images/small-red.png');
    this.load.image('small-blue', 'assets/images/small-blue.png');
    this.load.image('small-yellow', 'assets/images/small-yellow.png');

    this.load.image('medium-red', 'assets/images/medium-red.png');
    this.load.image('medium-blue', 'assets/images/medium-blue.png');
    this.load.image('medium-yellow', 'assets/images/medium-yellow.png');

    this.load.image('large-red', 'assets/images/large-red.png');
    this.load.image('large-blue', 'assets/images/large-blue.png');
    this.load.image('large-yellow', 'assets/images/large-yellow.png');

    this.load.image('blue', 'assets/images/blue.png');
    this.load.image('yellow', 'assets/images/yellow.png');

    this.load.image('background', 'assets/images/background.png');
    this.load.image('gameOver', 'assets/images/gameOver.png');

    this.load.image('play-button', 'assets/images/play-button.png');
    this.load.image('retry-button', 'assets/images/retry-button.png');
    this.load.image('menu-button', 'assets/images/menu-button.png');
    this.load.image('watch-icon', 'assets/images/watch-icon.png');

    this.load.image('border', 'assets/images/border.png');
    this.load.image('border-384', 'assets/images/border-384.png');
    this.load.image('new', 'assets/images/new.png');
    this.load.image('sad-emotion', 'assets/images/sad-emotion.png');

    this.load.spritesheet('sound-control', 'assets/images/sound-control.png', {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet('firework', 'assets/images/firework.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('balls', 'assets/images/balls.png', {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.audio('audio-background', 'assets/audio/music/audio-background.mp3');
    this.load.audio('audio-splash', 'assets/audio/sounds/audio-splash.mp3');
    this.load.audio('audio-splashWrong', 'assets/audio/sounds/audio-splashWrong.mp3');
    this.load.audio('audio-highScore', 'assets/audio/sounds/audio-highScore.mp3');
    this.load.audio('audio-tick', 'assets/audio/sounds/audio-tick.mp3');

    this.load.image('logo', 'assets/images/logo-2.png');
  }

  create() {
    this.bgMusic = this.sound.add('audio-background');
    this.bgMusic.volume = 0.25;
    this.bgMusic.loop = true;
    this.bgMusic.play();

    this.scene.start('MenuScene');
  }
}
