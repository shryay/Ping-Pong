const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const PADDLE_WIDTH = 16;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 16;
const PADDLE_MARGIN = 28;
const PLAYER_X = PADDLE_MARGIN;
const AI_X = canvas.width - PADDLE_WIDTH - PADDLE_MARGIN;
const PADDLE_SPEED = 7; // For AI
const BALL_SPEED = 6;

let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ballX = (canvas.width - BALL_SIZE) / 2;
let ballY = (canvas.height - BALL_SIZE) / 2;
let ballVX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballVY = BALL_SPEED * (Math.random() * 2 - 1);

let playerScore = 0;
let aiScore = 0;

// Draw functions
function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawNet() {
  ctx.strokeStyle = "#555";
  ctx.setLineDash([10, 12]);
  ctx.beginPath();
  ctx.moveTo(canvas.width/2, 0);
  ctx.lineTo(canvas.width/2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawScore() {
  ctx.font = "36px Arial";
  ctx.fillStyle = "#f5f5f5";
  ctx.textAlign = "center";
  ctx.fillText(playerScore, canvas.width * 0.25, 50);
  ctx.fillText(aiScore, canvas.width * 0.75, 50);
}

// Main game loop
function gameLoop() {
  // Move ball
  ballX += ballVX;
  ballY += ballVY;

  // Ball collision with top/bottom
  if (ballY <= 0) {
    ballY = 0;
    ballVY *= -1;
  }
  if (ballY + BALL_SIZE >= canvas.height) {
    ballY = canvas.height - BALL_SIZE;
    ballVY *= -1;
  }

  // Ball collision with player paddle
  if (
    ballX <= PLAYER_X + PADDLE_WIDTH &&
    ballY + BALL_SIZE >= playerY &&
    ballY <= playerY + PADDLE_HEIGHT
  ) {
    ballX = PLAYER_X + PADDLE_WIDTH;
    ballVX *= -1;
    // Add some spin based on where it hit the paddle
    let collidePoint = (ballY + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2);
    collidePoint = collidePoint / (PADDLE_HEIGHT / 2);
    ballVY = BALL_SPEED * collidePoint;
  }

  // Ball collision with AI paddle
  if (
    ballX + BALL_SIZE >= AI_X &&
    ballY + BALL_SIZE >= aiY &&
    ballY <= aiY + PADDLE_HEIGHT
  ) {
    ballX = AI_X - BALL_SIZE;
    ballVX *= -1;
    // Add some spin
    let collidePoint = (ballY + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2);
    collidePoint = collidePoint / (PADDLE_HEIGHT / 2);
    ballVY = BALL_SPEED * collidePoint;
  }

  // Ball out of bounds (score)
  if (ballX < 0) {
    aiScore++;
    resetBall();
  }
  if (ballX + BALL_SIZE > canvas.width) {
    playerScore++;
    resetBall();
  }

  // AI movement
  let aiCenter = aiY + PADDLE_HEIGHT / 2;
  if (aiCenter < ballY + BALL_SIZE / 2 - 10) {
    aiY += PADDLE_SPEED;
  } else if (aiCenter > ballY + BALL_SIZE / 2 + 10) {
    aiY -= PADDLE_SPEED;
  }
  // Clamp AI paddle to canvas
  aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));

  // Draw everything
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawNet();
  drawScore();

  // Draw paddles
  drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, "#46e");
  drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, "#e64");

  // Draw ball
  drawRect(ballX, ballY, BALL_SIZE, BALL_SIZE, "#fff");

  requestAnimationFrame(gameLoop);
}

function resetBall() {
  ballX = (canvas.width - BALL_SIZE) / 2;
  ballY = (canvas.height - BALL_SIZE) / 2;
  ballVX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
  ballVY = BALL_SPEED * (Math.random() * 2 - 1);
}

// Mouse controls for player paddle
canvas.addEventListener('mousemove', function (evt) {
  const rect = canvas.getBoundingClientRect();
  const mouseY = evt.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT / 2;
  // Clamp player paddle to canvas
  playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

// Start game loop
gameLoop();