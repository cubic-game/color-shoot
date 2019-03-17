export default class BootScene extends Phaser.Scene {
  constructor() {
    super({key: 'BootScene', active: true});
  }

  init() {
  }

  preload() {
  }

  create() {
    this.scene.start('PreloadScene');
  }
}
