import "./style.css";
import { controls } from "./lib/controls.js";

document.querySelector("#app").innerHTML = /* html */ `
  <canvas></canvas>
  <div id="controls">
    <ul>
      <li><button id="up_left"></button></li>
      <li><button id="up"></button></li>
      <li><button id="up_right"></button></li>
      <li><button id="left"></button></li>
      <li><button id="empty"></button></li>
      <li><button id="right"></button></li>
      <li><button id="down_left"></button></li>
      <li><button id="down"></button></li>
      <li><button id="down_right"></button></li>
    </ul>

    <button id="shoot">Shoot</button>
  </div>
`;

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = "1440";
canvas.height = "960";

const ratio = canvas.width / canvas.height;

const scale = window.innerHeight / canvas.height;
canvas.style.cssText = `
  transform: scale(${scale});
`;

c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);

const terrainImage = new Image();
terrainImage.src = "./assets/base.png";

const playerImage_right = new Image();
playerImage_right.src = "./assets/player/player_right.png";
const playerImage_left = new Image();
playerImage_left.src = "./assets/player/player_left.png";
const playerImage_up = new Image();
playerImage_up.src = "./assets/player/player_up.png";
const playerImage_down = new Image();
playerImage_down.src = "./assets/player/player_down.png";
const playerImage_up_right = new Image();
playerImage_up_right.src = "./assets/player/player_up_right.png";
const playerImage_up_left = new Image();
playerImage_up_left.src = "./assets/player/player_up_left.png";
const playerImage_down_right = new Image();
playerImage_down_right.src = "./assets/player/player_down_right.png";
const playerImage_down_left = new Image();
playerImage_down_left.src = "./assets/player/player_down_left.png";

const bulletImage_right = new Image();
bulletImage_right.src = "./assets/bullet/bullet_right.png";
const bulletImage_left = new Image();
bulletImage_left.src = "./assets/bullet/bullet_left.png";
const bulletImage_up = new Image();
bulletImage_up.src = "./assets/bullet/bullet_up.png";
const bulletImage_down = new Image();
bulletImage_down.src = "./assets/bullet/bullet_down.png";
const bulletImage_up_right = new Image();
bulletImage_up_right.src = "./assets/bullet/bullet_up_right.png";
const bulletImage_up_left = new Image();
bulletImage_up_left.src = "./assets/bullet/bullet_up_left.png";
const bulletImage_down_right = new Image();
bulletImage_down_right.src = "./assets/bullet/bullet_down_right.png";
const bulletImage_down_left = new Image();
bulletImage_down_left.src = "./assets/bullet/bullet_down_left.png";

const sprites = [
  playerImage_up,
  playerImage_down,
  playerImage_left,
  playerImage_right,
  playerImage_up_right,
  playerImage_up_left,
  playerImage_down_right,
  playerImage_down_left,
];

class Terrain {
  constructor({ pos, image }) {
    this.pos = pos;
    this.image = image;
  }

  draw() {
    c.drawImage(this.image, this.pos.x, this.pos.y);
  }
}

let playerDirection = "right";
class Player {
  constructor({
    pos,
    vel,
    image,
    frames = {
      max: 1,
    },
    sprites,
  }) {
    this.pos = pos;
    this.vel = vel;
    this.image = image;
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
    this.moving = false;
    this.sprites = sprites;
    this.weight = 5;
  }

  draw() {
    c.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.pos.x,
      this.pos.y,
      this.image.width / this.frames.max,
      this.image.height
    );

    if (!this.moving) {
      this.frames.val = 0;
      return;
    }

    if (this.frames.max > 1) this.frames.elapsed++;

    if (this.frames.elapsed % this.weight === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }
  }

  move() {
    this.moving = false;
    this.vel = 1;
    this.weight = 5;

    if (this.pos.x < 0) this.pos.x = 0;
    if (this.pos.x > canvas.width - this.width)
      this.pos.x = canvas.width - this.width;
    if (this.pos.y < 0) this.pos.y = 0;
    if (this.pos.y > canvas.height - this.height)
      this.pos.y = canvas.height - this.height;

    if (keys.run.pressed) {
      if (keys.shoot.pressed) {
        this.vel = 1;
        this.weight = 5;
      } else {
        this.vel = 1.5;
        this.weight = 4;
      }
    }

    if (
      (keys.up.pressed && keys.left.pressed) ||
      (keys.up.pressed && keys.right.pressed) ||
      (keys.down.pressed && keys.left.pressed) ||
      (keys.down.pressed && keys.right.pressed)
    ) {
      this.vel /= ratio;
    }

    if (keys.up.pressed) {
      playerDirection = "up";
      this.moving = true;
      this.image = this.sprites.up;
      this.pos.y -= this.vel;
    }
    if (keys.down.pressed) {
      playerDirection = "down";
      this.moving = true;
      this.image = this.sprites.down;
      this.pos.y += this.vel;
    }
    if (keys.left.pressed) {
      playerDirection = "left";
      this.moving = true;
      this.image = this.sprites.left;
      this.pos.x -= this.vel;
    }
    if (keys.right.pressed) {
      playerDirection = "right";
      this.moving = true;
      this.image = this.sprites.right;
      this.pos.x += this.vel;
    }

    if (keys.up.pressed && keys.right.pressed) {
      playerDirection = "up_right";
      this.image = this.sprites.up_right;
    }
    if (keys.up.pressed && keys.left.pressed) {
      playerDirection = "up_left";
      this.image = this.sprites.up_left;
    }
    if (keys.down.pressed && keys.right.pressed) {
      playerDirection = "down_right";
      this.image = this.sprites.down_right;
    }
    if (keys.down.pressed && keys.left.pressed) {
      playerDirection = "down_left";
      this.image = this.sprites.down_left;
    }

    if (keys.up.pressed && keys.down.pressed) this.moving = false;
    if (keys.left.pressed && keys.right.pressed) this.moving = false;
  }
}

class Bullet {
  constructor({ pos, vel, direction }) {
    this.pos = pos;
    this.vel = vel;
    this.image = bulletImage_right;
    this.direction = direction;
    this.image.onload = () => {
      this.width = this.image.width;
      this.height = this.image.height;
    };
  }

  draw() {
    c.drawImage(this.image, this.pos.x, this.pos.y);
  }

  move() {
    this.vel = 10;

    if (this.direction === "right") {
      this.image = bulletImage_right;
      this.pos.x += this.vel;
    }
    if (this.direction === "left") {
      this.image = bulletImage_left;
      this.pos.x -= this.vel;
    }
    if (this.direction === "down") {
      this.image = bulletImage_down;
      this.pos.y += this.vel;
    }
    if (this.direction === "up") {
      this.image = bulletImage_up;
      this.pos.y -= this.vel;
    }

    if (
      this.direction === "up_right" ||
      this.direction === "down_right" ||
      this.direction === "up_left" ||
      this.direction === "down_left"
    ) {
      this.vel /= ratio;
    }

    if (this.direction === "down_right") {
      this.image = bulletImage_down_right;
      this.pos.x += this.vel;
      this.pos.y += this.vel;
    }
    if (this.direction === "up_right") {
      this.image = bulletImage_up_right;
      this.pos.x += this.vel;
      this.pos.y -= this.vel;
    }
    if (this.direction === "up_left") {
      this.image = bulletImage_up_left;
      this.pos.x -= this.vel;
      this.pos.y -= this.vel;
    }
    if (this.direction === "down_left") {
      this.image = bulletImage_down_left;
      this.pos.x -= this.vel;
      this.pos.y += this.vel;
    }
  }
}

class Enemy {
  constructor({
    pos,
    vel,
    image,
    frames = {
      max: 8,
    },
  }) {
    this.pos = pos;
    this.vel = vel;
    this.image = image;
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
    this.sprites = sprites;
  }

  draw() {
    c.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.pos.x,
      this.pos.y,
      this.image.width / this.frames.max,
      this.image.height
    );
  }

  randomPosition() {
    this.pos.x = Math.floor(Math.random() * canvas.width);
    this.pos.y = Math.floor(Math.random() * canvas.height);
  }
}

const terrain = new Terrain({
  pos: { x: 0, y: 0 },
  image: terrainImage,
});

const player = new Player({
  pos: { x: 0, y: 0 },
  vel: 1,
  image: playerImage_right,
  frames: {
    max: 8,
  },
  sprites: {
    up: playerImage_up,
    down: playerImage_down,
    left: playerImage_left,
    right: playerImage_right,
    up_right: playerImage_up_right,
    up_left: playerImage_up_left,
    down_right: playerImage_down_right,
    down_left: playerImage_down_left,
  },
});

let bullets = [];
function shootBullet() {
  const bullet = new Bullet({
    pos: { x: player.pos.x, y: player.pos.y },
    vel: 10,
    direction: playerDirection,
  });

  bullets.push(bullet);

  const temp = shootBullet;
  shootBullet = () => {};
  setTimeout(() => (shootBullet = temp), 100);
}

let enemies = [];
function spawnEnemies() {
  const enemy = new Enemy({
    pos: {
      x: Math.floor(Math.random() * canvas.width),
      y: Math.floor(Math.random() * canvas.height),
    },
    vel: 1,
    image: playerImage_down,
    frames: {
      max: 8,
    },
  });

  enemy.randomPosition();
  enemies.push(enemy);
}

function bulletCollision(bullet, gen_enemies) {
  gen_enemies.forEach((enemy) => {
    if (
      bullet.pos.x + bullet.width > enemy.pos.x &&
      bullet.pos.x < enemy.pos.x + enemy.width &&
      bullet.pos.y + bullet.height > enemy.pos.y &&
      bullet.pos.y < enemy.pos.y + enemy.height
    ) {
      console.log("hit");
      enemy.randomPosition();
      enemies.splice(enemies.indexOf(enemy), 1);
    }
  });
}

const keys = {
  up: { pressed: false },
  down: { pressed: false },
  left: { pressed: false },
  right: { pressed: false },
  shoot: { pressed: false },
  run: { pressed: false },
  talk: { pressed: false },
};

spawnEnemies();
spawnEnemies();

(function animate() {
  window.requestAnimationFrame(animate);

  terrain.draw();
  player.draw();
  player.move();

  enemies.forEach((enemy) => {
    enemy.draw();
  });

  if (bullets.length > 0) {
    bullets.forEach((bullet, i) => {
      bullet.draw();
      bullet.move(playerDirection);
      bulletCollision(bullet, enemies);

      if (
        bullet.pos.x > canvas.width ||
        bullet.pos.x < 0 ||
        bullet.pos.y > canvas.height ||
        bullet.pos.y < 0
      ) {
        bullets.splice(i, 1);
      }
    });
  }
})();

window.addEventListener("keydown", (e) => {
  if (e.key === controls.up) keys.up.pressed = true;
  if (e.key === controls.down) keys.down.pressed = true;
  if (e.key === controls.left) keys.left.pressed = true;
  if (e.key === controls.right) keys.right.pressed = true;
  if (e.key === controls.shoot) keys.shoot.pressed = true;
  if (e.key === controls.run) keys.run.pressed = true;
});

window.addEventListener("keyup", (e) => {
  if (e.key === controls.up) keys.up.pressed = false;
  if (e.key === controls.down) keys.down.pressed = false;
  if (e.key === controls.left) keys.left.pressed = false;
  if (e.key === controls.right) keys.right.pressed = false;
  if (e.key === controls.shoot) keys.shoot.pressed = false;
  if (e.key === controls.shoot) shootBullet();
  if (e.key === controls.run) keys.run.pressed = false;
});

const btn_shoot = document.getElementById("shoot");
btn_shoot.addEventListener("mouseenter", shootBullet);

const btn_up_left = document.getElementById("up_left");
btn_up_left.addEventListener("mouseenter", () => {
  keys.up.pressed = true;
  keys.left.pressed = true;
});
btn_up_left.addEventListener("mouseleave", () => {
  keys.up.pressed = false;
  keys.left.pressed = false;
});

const btn_up = document.getElementById("up");
btn_up.addEventListener("mouseenter", () => {
  keys.up.pressed = true;
});
btn_up.addEventListener("mouseleave", () => {
  keys.up.pressed = false;
});

const btn_up_right = document.getElementById("up_right");
btn_up_right.addEventListener("mouseenter", () => {
  keys.up.pressed = true;
  keys.right.pressed = true;
});
btn_up_right.addEventListener("mouseleave", () => {
  keys.up.pressed = false;
  keys.right.pressed = false;
});

const btn_left = document.getElementById("left");
btn_left.addEventListener("mouseenter", () => {
  keys.left.pressed = true;
});
btn_left.addEventListener("mouseleave", () => {
  keys.left.pressed = false;
});

const btn_right = document.getElementById("right");
btn_right.addEventListener("mouseenter", () => {
  keys.right.pressed = true;
});
btn_right.addEventListener("mouseleave", () => {
  keys.right.pressed = false;
});

const btn_down_left = document.getElementById("down_left");
btn_down_left.addEventListener("mouseenter", () => {
  keys.down.pressed = true;
  keys.left.pressed = true;
});
btn_down_left.addEventListener("mouseleave", () => {
  keys.down.pressed = false;
  keys.left.pressed = false;
});

const btn_down = document.getElementById("down");
btn_down.addEventListener("mouseenter", () => {
  keys.down.pressed = true;
});
btn_down.addEventListener("mouseleave", () => {
  keys.down.pressed = false;
});

const btn_down_right = document.getElementById("down_right");
btn_down_right.addEventListener("mouseenter", () => {
  keys.down.pressed = true;
  keys.right.pressed = true;
});
btn_down_right.addEventListener("mouseleave", () => {
  keys.down.pressed = false;
  keys.right.pressed = false;
});
