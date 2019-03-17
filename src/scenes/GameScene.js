const Colors = {
  Red: 'red',
  Blue: 'blue',
  Yellow: 'yellow',
}

// #F63A43 red
//

const Directions = {
  L: 'L',
  R: 'R'
}

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({key: 'GameScene', active: false});
  }

  init() {
    // init coordinates
    this.GW = this.sys.game.config.width;
    this.GH = this.sys.game.config.height;
    this.centerX = this.GW / 2;
    this.centerY = this.GH / 2;

    // init colors & directions
    this.resetColors();
    this.resetColorIndices();
    this.resetDirections();

    // init game data
    this.smallSpeed = 40;
    this.mediumSpeed = 30;
    this.largeSpeed = 20;
    this.projectileSpeed = 700;
    this.hits = 0;
    this.score = 0;
    this.eventHits = 0;
    this.runOnce = true;
    this.tickTime = 10;
    this.timePaused = false;
  }

  resetColors() {
    this.colors = [];
    Object.keys(Colors).forEach(k => this.colors.push(Colors[k]));
  }

  resetColorIndices() {
    this.colorIndices = [0, 1, 2];
  }

  resetDirections() {
    this.directions = [];
    Object.keys(Directions).forEach(k => this.directions.push(Directions[k]));
  }

  create() {
    this.background = this.add.tileSprite(0, 0, this.GW, this.GH, 'background');
    this.background.setOrigin(0, 0);
    this.initBubbles();
    this.initArcs();
    this.projectiles = this.physics.add.group();

    // init ui
    this.initUI();

    this.input.on('pointerdown', this.fire, this);
    // this.physics.add.collider(this.projectiles, this.smallCollision);
    this.physics.add.overlap(this.projectiles, this.smallCollision, this.onCollide, null, this);
    this.physics.add.overlap(this.projectiles, this.mediumCollision, this.onCollide, null, this);
    this.physics.add.overlap(this.projectiles, this.largeCollision, this.onCollide, null, this);

    // sound
    this.splashSound = this.sound.add('audio-splash');
    this.splashWrongSound = this.sound.add('audio-splashWrong');
    this.tickSound = this.sound.add('audio-tick');

    // splash effect
    const splashParticls = this.add.particles('balls');
    this.splashEffect = splashParticls.createEmitter({
      speed: -100,
      scale: {start: 0.8, end: 0},
      lifespan: 1000,
      on: false,
    });

    // tick
    this.time.addEvent({delay: 1000, callback: this.onTick, callbackScope: this, loop: true});
    this.time.addEvent({delay: 1000, callback: this.timeOver, callbackScope: this, loop: true});
  }

  onTick() {
    if (!this.timePaused) {
      this.tickTime -= 1;
    }
  }

  timeOver() {
    if (this.tickTime < 4 && this.tickTime > 0) {
      this.timerText.tint = 0xff5555;
      this.watch.tint = 0xff5555;
      const color = Phaser.Display.Color.IntegerToColor(0xff5555);
      this.cameras.main.flash(100, color.red, color.green, color.blue);
    }
  }

  initUI() {
    // sound button
    this.soundButton = this.add.sprite(this.GW - 72, 64, 'sound-control').setInteractive({cursor: 'pointer'});
    this.soundButton.alpha = 0.3;
    this.soundButton.on('pointerdown', this.toggleSound, this);
    // watch
    this.watch = this.add.sprite(64, 64, 'watch-icon');
    this.watch.setScale(0.5);
    const timerStyle = {font: "60px Arial", fill: "#a9a9a9", align: "center", fontWeight: 'bold'};
    this.timerText = this.add.text(120, 36, '0', timerStyle);
    // score
    const scoreStyle = {font: '160px Arial', fill: '#a9a9a9', align: 'center', fontWeight: 'bold'};
    this.scoreText = this.add.text(this.GW / 2, 180, '0', scoreStyle);
    this.scoreText.setOrigin(0.5);

    // gamover panel
    this.gameOverPanel = this.add.container();
    this.gameOverPanel.x = this.centerX;
    this.gameOverPanel.y = -1000;

    const gameOverBg = this.add.sprite(0, 0, 'background');
    gameOverBg.displayWidth = this.GW;
    gameOverBg.displayHeight = this.GH;
    this.gameOverPanel.add(gameOverBg);

    const sadEmotion = this.add.sprite(0, 0, 'sad-emotion');
    sadEmotion.setScale(2);
    sadEmotion.alpha = 0.6;
    this.gameOverPanel.add(sadEmotion);

    const overStyle = {font: '72px Arial', fill: '#a9a9a9', align: 'center', fontWeight: 'bold'};
    const overText = this.add.text(0, 240, 'Game Over', overStyle);
    overText.setOrigin(0.5);
    this.gameOverPanel.add(overText);

    this.gameOverPanelTween = this.tweens.create({
      targets: this.gameOverPanel,
      duration: 1500,
      ease: 'Linear',
      y: this.centerY,
    })
  }

  toggleSound() {
    this.sound.mute = !this.sound.mute;
    this.soundButton.setFrame(1 - this.soundButton.frame.name);
  }

  onCollide(projectile, arc) {
    this.splashSound.play();
    this.splashEffect.setFrame(projectile.label);
    this.splashEffect.explode(10, projectile.x, projectile.y);

    if (projectile.label === arc.label) {
      this.score++;
      const randomColor = Phaser.Utils.Array.GetRandom (this.colorIndices);
      this.player.label = randomColor;
      this.player.setFrame(randomColor);
    } else {
      this.gameOver();
    }
    projectile.destroy();
  }

  gameOver() {
    // update game data
    this.timePaused = true;
    // camera effect
    const color = Phaser.Display.Color.IntegerToColor(0xff5555);
    this.cameras.main.flash(500, color.red, color.green, color.blue);
    this.cameras.main.shake(500, 0.05);
    // sound
    this.splashWrongSound.play();
    // show ui
    this.gameOverPanelTween.play();
    this.time.delayedCall(2000, () =>  this.scene.start('GameOver'));
  }

  fire(pointer) {
    this.shots += 1;
    const projectile = this.projectiles.create(this.player.x, this.player.y, 'balls', this.player.label);
    projectile.label = this.player.label;
    projectile.setCircle(16);
    this.physics.moveToObject(projectile, pointer, this.projectileSpeed);

    this.player.color = Phaser.Utils.Array.GetRandom(this.colors);
  }

  initArcs() {
    const posX = this.centerX;
    const posY = this.centerY;

    // Arc direction
    this.smallDirection = Phaser.Utils.Array.RemoveRandomElement(this.directions);
    this.mediumDirection = Phaser.Utils.Array.RemoveRandomElement(this.directions);
    this.resetDirections();
    this.largeDirection = Phaser.Utils.Array.GetRandom(this.directions);

    // Small arc
    let randomColor = Phaser.Utils.Array.RemoveRandomElement(this.colorIndices);
    this.smallGraphics = this.add.sprite(posX, posY, 'small-' + this.colors[randomColor]);
    this.smallCollision = this.createCollision(posX, posY, 116, 16, randomColor);

    // Medium arc
    randomColor = Phaser.Utils.Array.RemoveRandomElement(this.colorIndices);
    this.mediumGraphics = this.add.sprite(posX, posY, 'medium-' + this.colors[randomColor]);
    this.mediumCollision = this.createCollision(posX, posY, 180, 10, randomColor);

    // Large arc
    randomColor = Phaser.Utils.Array.RemoveRandomElement(this.colorIndices);
    this.largeGraphics = this.add.sprite(posX, posY, 'large-' + this.colors[randomColor]);
    this.largeCollision = this.createCollision(posX, posY, 240, 6, randomColor);

    this.resetColorIndices();

    // Player
    randomColor = Phaser.Utils.Array.GetRandom(this.colorIndices);
    this.player = this.add.sprite(posX, posY, 'balls', randomColor);
    this.player.label = randomColor;

    this.border = this.add.sprite(posX, posY, 'border');
    this.border.alpha = 0.25;
  }

  createCollision(posX, posY, radius, step, label) {
    let collision = this.physics.add.group();
    let circle = new Phaser.Geom.Circle(posX, posY, radius);

    let points = []
    for(let i = 0; i <= 180; i += step) {
      points.push(circle.getPoint(i / 360));
    }
    for (let i = 0; i < points.length; i++) {
      let circle = this.physics.add.sprite(points[i].x, points[i].y, 'balls');
      circle.setCircle(12);
      circle.visible = false;
      circle.label = label;
      collision.add(circle);
    }
    return collision;
  }

  update() {
    this.background.tilePositionX -= 0.25;
    this.border.rotation += 0.001;

    if (this.smallSpeed == this.mediumSpeed) {
      mediumSpeed += 20;
    }
    this.rotateSmall();
    this.rotateMedium();
    this.rotateLarge();

    // check tick time
    if (this.tickTime <= 0 && this.runOnce === true) {
      this.runOnce = false;
      this.timeOut();
    }
    // change rotation
    if (this.eventHits >= 10) {
      this.eventHits = 0;
      this.changeRoation();
    }

    // update score
    this.scoreText.text = this.score;
    // update tick time
    this.timerText.text = this.tickTime;
  }

  timeOut() {
    this.gameOver();
  }

  changeRoation() {

  }

  rotateSmall() {
    let spd = this.smallSpeed / 1000;
    if (this.smallDirection == 'R') {
      spd = -spd;
    }
    Phaser.Actions.RotateAround(this.smallCollision.getChildren(), new Phaser.Math.Vector2(this.GW/2, this.GH/2), spd);
    this.smallGraphics.rotation += spd;
  }

  rotateMedium() {
    let spd = this.mediumSpeed / 1000;
    if (this.mediumDirection == 'R') {
      spd = -spd;
    }
    Phaser.Actions.RotateAround(this.mediumCollision.getChildren(), new Phaser.Math.Vector2(this.GW/2, this.GH/2), spd);
    this.mediumGraphics.rotation += spd;
  }

  rotateLarge() {
    let spd = this.largeSpeed / 1000;
    if (this.largeDirection == 'R') {
      spd = -spd;
    }
    Phaser.Actions.RotateAround(this.largeCollision.getChildren(), new Phaser.Math.Vector2(this.GW/2, this.GH/2), spd);
    this.largeGraphics.rotation += spd;
  }

  initBubbles() {
    let particles = this.add.particles('balls');
    particles.createEmitter({
      frame: { frames: [ 0, 1, 2 ] },
      x: {min: 0, max: this.GW},
      y: this.GH,
      gravityY: -20,
      lifespan: 3000,
      explode: false,
      frequency: 10,
      width: this.GW,
      scale: {start: 0.5, end: 2.0},
      alpha: {start: 0.3, end: 0},
      speed: 200,
    })
  }
}
