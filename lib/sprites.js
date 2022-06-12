export function sprites(sprite) {
  return {
    type: "SPRITES",
    sprite,
  };
}

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

const bulletImage = new Image();
bulletImage.src = "./assets/bullet.png";
