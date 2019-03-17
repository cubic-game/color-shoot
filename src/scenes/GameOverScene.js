export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({key: 'GameOver', active: false});
  }

  init() {
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.centerX = this.sys.game.config.width / 2;
    this.centerY = this.sys.game.config.height / 2;
  }

  preload() {
  }

  create() {
    this.highScoreSnd = this.sound.add('audio-highScore');
    this.background = this.add.tileSprite(0, 0, this.width, this.height, 'background');
    this.background.setOrigin(0);

    let particles = this.add.particles('balls');
    particles.createEmitter({
      frame: { frames: [ 0, 1, 2 ] },
      x: {min: 0, max: this.width},
      y: this.height,
      gravityY: -20,
      lifespan: 3200,
      explode: false,
      frequency: 10,
      width: this.GW,
      scale: {start: 0.5, end: 2.0},
      alpha: {start: 0.3, end: 0},
      speed: 240,
    })

    this.border = this.add.sprite(this.centerX, this.centerY, 'border');
    this.border.alpha = 0.25;

    this.initUI();
  }

  initUI() {
    const style = {font: "72px Arial", fill: "#a9a9a9", align: "center", fontWeight: 'bold' };

    this.scoreText = this.add.text(this.centerX, this.centerY - 72, 'Score', style);
    this.scoreText.setOrigin(0.5);
    this.scoreInt = this.add.text(this.centerX, this.centerY - 72, '0', style);
    this.scoreInt.setOrigin(0.5);

    this.highScoreText = this.add.text(this.centerX, this.centerY + 64, 'HighScore', style)
    this.highScoreText.setOrigin(0.5);
    this.highScoreInt = this.add.text(this.centerX, this.centerY + 160, '0', style);
    this.highScoreInt.setOrigin(0.5);

    // add new label
    this.newLabel = this.add.sprite(this.highScoreText.x, this.highScoreText.y - 64, 'new');
    this.newLabel.setOrigin(0.5);

    // retry button
    this.retryButton = this.add.sprite(this.centerX - 128, this.centerY + 384, 'retry-button').setInteractive({ cursor: 'pointer' });
    this.retryButton.alpha = 0.25;
    this.retryButton.on('pointerdown', this.retry, this);

    // menu button
    this.menuButton = this.add.sprite(this.centerX + 128, this.centerY + 384, 'menu-button').setInteractive({ cursor: 'pointer' });
    this.menuButton.alpha = 0.25;
    this.menuButton.on('pointerdown', this.backMenu, this);
  }

  backMenu() {
    this.scene.start('MenuScene');
  }

  retry() {
    this.scene.start('GameScene');
  }

  update() {
    this.background.tilePositionX -= 0.25;
    this.border.rotation += 0.002;
  }
}
