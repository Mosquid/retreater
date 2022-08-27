const can = document.getElementById("canvas");
const HEIGHT = 900;
const WIDTH = 1300;
const RADIUS = 20;
const DIRECTIONS_Y = { up: "up", down: "down" };
const DIRECTIONS_X = { left: "left", right: "right" };
const STEP_X = Math.ceil(WIDTH / 100);
const STEP_Y = Math.ceil(HEIGHT / 100);
const KEY_MAP = {
  w: "up",
  s: "down",
  a: "left",
  d: "right",
};
const DIRECTION_MAP = {
  [DIRECTIONS_Y.down]: () => handleMoveY(DIRECTIONS_Y.down),
  [DIRECTIONS_Y.up]: () => handleMoveY(DIRECTIONS_Y.up),
  [DIRECTIONS_X.left]: () => handleMoveX(DIRECTIONS_X.left),
  [DIRECTIONS_X.right]: () => handleMoveX(DIRECTIONS_X.right),
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
  drawEllipse("red", x, y);
}

const handleWasdPress = () => {
  const keys = Array.from(keysPressed.keys());

  keys.forEach((key) => {
    const reverse = handleMove(key);
    reverse && trail.push(reverse);
  });
};

const canMoveX = (dir) => {
  if (dir === DIRECTIONS_X.left) {
    return x - RADIUS > 0;
  } else {
    return x + RADIUS < WIDTH;
  }
};
const canMoveY = (dir) => {
  if (dir === DIRECTIONS_Y.down) {
    return y + RADIUS < HEIGHT;
  } else {
    return y - RADIUS > 0;
  }
};

const handleMoveX = (dir = DIRECTIONS_X.right) => {
  if (!canMoveX(dir)) return;

  let reverse;

  if (dir === DIRECTIONS_X.right) {
    reverse = DIRECTIONS_X.left;
    x = x + STEP_X;
  } else {
    reverse = DIRECTIONS_X.right;
    x = x - STEP_X;
  }
  return reverse;
};

const handleMoveY = (dir = DIRECTIONS_Y.up) => {
  if (!canMoveY(dir)) return;

  let reverse;

  if (dir === DIRECTIONS_Y.up) {
    reverse = DIRECTIONS_Y.down;
    y = y - STEP_Y;
  } else {
    reverse = DIRECTIONS_Y.up;
    y = y + STEP_Y;
  }
  return reverse;
};

const handleMove = (key) => {
  if (!DIRECTION_MAP[key]) return;
  const action = DIRECTION_MAP[key];

  if (typeof action === "function") {
    return action();
  }
};

const replay = () => {
  if (!trail.length) return;
  const dir = trail.pop();

  handleMove(dir);

  setTimeout(replay, 15);
};

const handleReplayClick = (e) => {
  if (replaying || !base) return;

  if (ctx.isPointInPath(base, e.offsetX, e.offsetY)) {
    replay();
  }
};

const getDirectionByKey = (key) => {
  return KEY_MAP[key] ? KEY_MAP[key] : null;
};

const handleKeyUp = (e) => {
  const { key } = e;
  const dir = getDirectionByKey(key);

  if (keysPressed.has(dir)) {
    keysPressed.delete(dir);
  }
  handleWasdPress();
};

const handleKeyDown = (e) => {
  const { key } = e;
  const dir = getDirectionByKey(key);

  if (!keysPressed.has(dir)) {
    keysPressed.set(dir, true);
  }

  handleWasdPress();
};

draw();
can.addEventListener("click", handleReplayClick);
document.body.addEventListener("keyup", handleKeyUp);
document.body.addEventListener("keydown", handleKeyDown);
