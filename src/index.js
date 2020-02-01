import Phaser from "phaser";
import sky from "./assets/sky.png";
import bomb from "./assets/bomb.png";
import dude from "./assets/dude.png";
import platfrom from "./assets/platform.png";
import star from "./assets/star.png";

const HEIGHT = 600;
const WIDTH = 800;

const config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: "0x0063f3",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

let platforms;
let platformPositions = [
  { x: 400, y: 568 },
  { x: 600, y: 400 },
  { x: 50, y: 250 },
  { x: 750, y: 220 }
];
let player;
let cursors;

let game = new Phaser.Game(config);

function preload() {
  this.load.image("sky", sky);
  this.load.image("bomb", bomb);
  this.load.image("star", star);
  this.load.image("ground", platfrom);
  this.load.spritesheet("dude", dude, { frameWidth: 32, frameHeight: 48 });
}

function create() {
  this.add.image(0, 0, "sky").setOrigin(0, 0);
  platforms = this.physics.add.staticGroup();
  platformPositions.forEach((p, index) => {
    if (index === 0) {
      platforms
        .create(p.x, p.y, "ground")
        .setScale(2)
        .refreshBody();
    }
    platforms.create(p.x, p.y, "ground");
  });

  player = this.physics.add.sprite(100, 450, "dude");
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });
  this.anims.create({
    key: "turn",
    frames: [{ key: "dude", frame: 4 }],
    frameRate: 20
  });
  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  this.physics.add.collider(player, platforms);
  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play("left", true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play("right", true);
  } else {
    player.setVelocityX(0);
    player.anims.play("turn");
  }
  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }
}
