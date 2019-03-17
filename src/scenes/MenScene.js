export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene', active: false });
  }

  init() {
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.centerX = this.sys.game.config.width / 2;
    this.centerY = this.sys.game.config.height / 2;
  }

  create() {
    this.background = this.add.tileSprite(0, 0, this.width, this.height, 'background');
    this.background.setOrigin(0);

    this.playButton = this.add.sprite(this.centerX, this.centerY + 64, 'play-button')
      .setInteractive({ cursor: 'pointer' })
      .on('pointerdown', this.startGame, this);
    this.playButton.setScale(0.8);

    this.smallArc = this.add.sprite(this.centerX, this.centerY + 64, 'small-blue');
    this.border = this.add.sprite(this.centerX, this.centerY + 64, 'border-384');
    this.border.alpha = 0.5;

    this.soundButton = this.add.sprite(this.width - 72, 64, 'sound-control')
      .setInteractive({ cursor: 'pointer' })
      .on('pointerdown', this.toggleSound, this);
    this.soundButton.alpha = 0.3;

    this.logo = this.add.sprite(this.centerX, this.centerY - 280, 'logo');

    let particles = this.add.particles('balls');
    particles.createEmitter({
      frame: { frames: [ 0, 1, 2 ] },
      x: {min: 0, max: this.sys.game.config.width},
      y: this.sys.game.config.height,
      gravityY: -20,
      lifespan: 3200,
      explode: false,
      frequency: 10,
      width: this.GW,
      scale: {start: 0.5, end: 2.0},
      alpha: {start: 0.3, end: 0},
      speed: 240,
    })
  }

  update() {
    this.background.tilePositionX -= 0.25;
    this.smallArc.rotation += 0.025;
    this.border.rotation += 0.002;
  }

  toggleSound() {
    this.sound.mute = !this.sound.mute;
    this.soundButton.setFrame(1 - this.soundButton.frame.name);
  }

  startGame() {
    this.scene.start('GameScene');
  }
}
