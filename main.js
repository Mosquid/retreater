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
const keysPressed = new Map();
const trail = [];

can.height = HEIGHT;
can.width = WIDTH;

const ctx = can.getContext("2d");
let x = WIDTH / 2 - RADIUS / 2;
let y = HEIGHT / 2 - RADIUS / 2;
const baseX = x;
const baseY = y;
let replaying = false;
let base;

const drawEllipse = (color, _x, _y) => {
  const ellipse = new Path2D();

  ellipse.ellipse(_x, _y, RADIUS, RADIUS, Math.PI * 0.25, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill(ellipse);

  return ellipse;
};

function draw() {
  ctx.clearRect(0, 0, can.width, can.height);
  ctx.fillStyle = "rgba(135,206,235,0.4)";
  ctx.fillRect(0, 0, can.width, can.height);
  requestAnimationFrame(draw);

  base = drawEllipse("yellow", baseX, baseY);
  const bot = drawEllipse("red", x, y);
}

draw();

const handleWasdPress = () => {
  const keys = Array.from(keysPressed.keys());

  keys.forEach((key) => {
    if (!DIRECTION_MAP[key]) return;

    if (!trail.length) {
      trail.push([x, y]);
    }

    const action = DIRECTION_MAP[key];

    if (typeof action === "function") {
      const changed = action();
      if (changed) {
        trail.push([x, y]);
      }
    }
  });
};

const handleMoveX = (dir = DIRECTIONS_X.right) => {
  let newX;
  const oldX = x;
  if (dir === DIRECTIONS_X.right) {
    newX = Math.min(X_MAX, x + STEP_X);
  } else {
    newX = Math.max(0, x - STEP_X);
  }
  x = newX;
  return x !== oldX;
};
const handleMoveY = (dir = DIRECTIONS_Y.up) => {
  let newY;
  const oldY = y;
  if (dir === DIRECTIONS_Y.up) {
    newY = Math.max(0, y - STEP_Y);
  } else {
    newY = Math.min(Y_MAX, y + STEP_Y);
  }
  y = newY;
  return oldY !== y;
};

const replay = () => {
  if (!trail.length) return;
  const [moveX, moveY] = trail.pop();

  x = moveX;
  y = moveY;

  setTimeout(replay, 15);
};

const handleReplayClick = (e) => {
  if (replaying || !base) return;

  if (ctx.isPointInPath(base, e.offsetX, e.offsetY)) {
    replay();
  }
};

const handleButtonUp = (e) => {
  const { key } = e;

  if (keysPressed.has(key)) {
    keysPressed.delete(key);
  }
  handleWasdPress();
};
const handleButtonDown = (e) => {
  const { key } = e;

  if (!keysPressed.has(key)) {
    keysPressed.set(key, true);
  }

  handleWasdPress();
};

can.addEventListener("click", handleReplayClick);
document.body.addEventListener("keyup", handleButtonUp);
document.body.addEventListener("keydown", handleButtonDown);
