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

let platforms,
  platformPositions = [
    { x: 400, y: 568 },
    { x: 600, y: 400 },
    { x: 50, y: 250 },
    { x: 750, y: 220 }
  ],
  player,
  cursors,
  stars,
  score = 0,
  scoreText,
  bombs,
  gameOver = false;

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

  stars = this.physics.add.group({
    key: "star",
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  });
  stars.children.iterate(child => {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  scoreText = this.add.text(16, 16, "score:0", {
    fontSize: "32px",
    fill: "#000"
  });

  bombs = this.physics.add.group();

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

  this.physics.add.collider(bombs, platforms);
  this.physics.add.collider(bombs, player, hitBomb, null, this);
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(stars, platforms);
  this.physics.add.overlap(player, stars, collectStar, null, this);
  cursors = this.input.keyboard.createCursorKeys();
}

function collectStar(player, star) {
  star.disableBody(true, true);
  scoreText.setText(`Score: ${(score += 10)}`);
  if (stars.countActive(true) === 0) {
    stars.children.iterate(child =>
      child.enableBody(true, child.x, 0, true, true)
    );
  }
  let x =
    player.x < 400
      ? Phaser.Math.Between(400, 800)
      : Phaser.Math.Between(0, 400);
  let Bomb = bombs.create(x, 16, "bomb");
  Bomb.setBounce(1);
  Bomb.setCollideWorldBounds(true);
  Bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
}

function hitBomb(player) {
  this.physics.pause();
  player.setTint(0xff0000);
  player.anims.play("turn");
  gameOver = true;
}
function update() {
  if (gameOver) return;
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
