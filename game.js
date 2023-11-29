const scoreElement = document.getElementById("score");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const boxSize = 10;

const gameSpeed = 0.06; // lower value = more speed

let score = 0;

let food;

const initialSnake = [
  { x: Math.floor(canvasWidth / 2), y: Math.floor(canvasHeight / 2) },
  { x: Math.floor(canvasWidth / 2) - 10, y: Math.floor(canvasHeight / 2) },
  { x: Math.floor(canvasWidth / 2) - 20, y: Math.floor(canvasHeight / 2) },
  { x: Math.floor(canvasWidth / 2) - 30, y: Math.floor(canvasHeight / 2) },
];

// Set up the snake and score
let snake = [...initialSnake];
positionFood();

// Direction
let dx = 10;
let dy = 0;

// Is game over
let isGameOver = false;

function update() {
  let head = {
    x: snake[0].x + dx,
    y: snake[0].y + dy,
  };

  // Check for collision with self
  const collapsed =
    snake.length > 1 &&
    !isGameOver &&
    snake.find((p) => {
      return p.x === head.x && p.y === head.y;
    });

  if (collapsed) {
    dx = 0;
    dy = 0;
    snake.unshift(head);
    snake.pop();
    isGameOver = true;
  }
  if (head.x < 0) {
    // Check collision with wall
    // hit left wall
    head.x = 0;
    dx = 0;
    dy = 0;
    isGameOver = true;
  }
  // hit right wall
  if (head.x > canvasWidth - boxSize) {
    dx = 0;
    dy = 0;
    head.x = canvasWidth;
    isGameOver = true;
  }
  // hit top wall
  if (head.y < 0) {
    dx = 0;
    dy = 0;
    head.y = 0;
    isGameOver = true;
  }
  // hit bottom wall
  if (head.y > canvasHeight - boxSize) {
    dx = 0;
    dy = 0;
    head.y = canvasHeight - boxSize;
    isGameOver = true;
  }

  if (isGameOver) {
    return;
  }
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    updateScore((score += 10));
    positionFood();
  } else {
    snake.pop();
  }
}

function positionFood() {
  food = {
    x: Math.floor((Math.random() * canvasWidth) / boxSize) * boxSize,
    y: Math.floor((Math.random() * canvasHeight) / boxSize) * boxSize,
  };
  const collapsed = snake.find(
    (segment) => segment.x === food.x && segment.y == food.y
  );
  if (collapsed) {
    positionFood();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

  ctx.strokeStyle = "#000";

  // Draw snake
  ctx.fillStyle = isGameOver ? "yellow" : "#8feb34";
  ctx.strokeStyle = isGameOver ? "red" : "#436e18d";
  ctx.shadowBlur = 0;

  snake.forEach((segment) => {
    ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
    ctx.strokeRect(segment.x, segment.y, boxSize, boxSize);
  });

  // Draw food
  ctx.fillStyle = "#e0925e";
  ctx.shadowBlur = 15;
  ctx.shadowColor = "yellow";
  ctx.fillRect(food.x, food.y, boxSize, boxSize);
}

let lastUpdateTime = 0;
function gameLoop() {
  window.requestAnimationFrame(gameLoop);

  const currentTime = new Date();
  const secondsSinceLastUpdate = (currentTime - lastUpdateTime) / 1000;
  if (secondsSinceLastUpdate < gameSpeed) {
    return;
  }
  lastUpdateTime = currentTime;
  update();
  draw();
}

window.requestAnimationFrame(gameLoop);

window.addEventListener("keydown", function onKeyDown(event) {
  if (isGameOver) {
    return;
  }
  switch (event.key) {
    case "ArrowDown": {
      dx = 0;
      dy = dy === -10 ? dx : 10;
      break;
    }
    case "ArrowUp": {
      dx = 0;
      dy = dy === 10 ? dy : -10;
      break;
    }
    case "ArrowRight": {
      dx = dx === -10 ? dx : 10;
      dy = 0;
      break;
    }
    case "ArrowLeft": {
      dx = dx === 10 ? dx : -10;
      dy = 0;
      break;
    }
  }
});

function updateScore(newScore) {
  score = newScore;
  scoreElement.innerHTML = score;
}
const restartButton = document.getElementById("restart");

restartButton.onclick = () => {
  isGameOver = false;
  snake = [...initialSnake];
  positionFood();
  dx = 10;
  dy = 0;
  updateScore(0);
};
