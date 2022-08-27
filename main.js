const can = document.getElementById("canvas");
const HEIGHT = 900;
const WIDTH = 1300;
const RADIUS = 20;
const DIRECTIONS_Y = { up: "up", down: "down" };
const DIRECTIONS_X = { left: "left", right: "right" };
const STEP_X = Math.ceil(WIDTH / 100);
const STEP_Y = Math.ceil(HEIGHT / 100);
const X_MAX = WIDTH - RADIUS / 2;
const Y_MAX = HEIGHT - RADIUS / 2;
const DIRECTION_MAP = {
  s: () => handleMoveY(DIRECTIONS_Y.down),
  w: () => handleMoveY(DIRECTIONS_Y.up),
  a: () => handleMoveX(DIRECTIONS_X.left),
  d: () => handleMoveX(DIRECTIONS_X.right),
};
const trail = [];

can.height = HEIGHT;
can.width = WIDTH;

const ctx = can.getContext("2d");
let x = WIDTH / 2 - RADIUS / 2;
let y = HEIGHT / 2 - RADIUS / 2;

function draw() {
  ctx.beginPath();
  ctx.arc(x, y, RADIUS, 0, 2 * Math.PI);
  ctx.fillStyle = "rgba(250,0,0,0.4)";
  ctx.fill();

  ctx.fillStyle = "rgba(34,45,23,0.4)";
  ctx.fillRect(0, 0, can.width, can.height);
  requestAnimationFrame(draw);
}

draw();

const handleWasdPress = (e) => {
  const { key } = e;
  trail.push([x, y]);
  if (!DIRECTION_MAP[key]) return;

  const action = DIRECTION_MAP[key];

  if (typeof action === "function") action();
};

const handleMoveX = (dir = DIRECTIONS_X.right) => {
  if (dir === DIRECTIONS_X.right) {
    x = Math.min(X_MAX, x + STEP_X);
  } else {
    x = Math.max(0, x - STEP_X);
  }
};
const handleMoveY = (dir = DIRECTIONS_Y.up) => {
  if (dir === DIRECTIONS_Y.up) {
    y = Math.max(0, y - STEP_Y);
  } else {
    y = Math.min(Y_MAX, y + STEP_Y);
  }
};

const replay = () => {
  if (!trail.length) return;
  const [moveX, moveY] = trail.pop();

  x = moveX;
  y = moveY;

  setTimeout(replay, 25);
};

document.querySelector("button")?.addEventListener("click", replay);
document.body.addEventListener("keypress", handleWasdPress);
