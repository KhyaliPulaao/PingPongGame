const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const paddleWidth = 12;
const paddleHeight = 100;
const ballSize = 14;

// Left paddle (player)
let playerY = (canvas.height - paddleHeight) / 2;

// Right paddle (AI)
let aiY = (canvas.height - paddleHeight) / 2;
const aiSpeed = 4;

// Ball
let ballX = canvas.width / 2 - ballSize / 2;
let ballY = canvas.height / 2 - ballSize / 2;
let ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);

// Scores
let playerScore = 0;
let aiScore = 0;

// Mouse movement controls player paddle
canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerY = mouseY - paddleHeight / 2;
    // Clamp paddle within canvas
    if (playerY < 0) playerY = 0;
    if (playerY + paddleHeight > canvas.height)
        playerY = canvas.height - paddleHeight;
});

// Draw everything
function draw() {
    // Clear
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Middle line
    ctx.setLineDash([10, 15]);
    ctx.strokeStyle = "#555";
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Left Paddle
    ctx.fillStyle = '#0f0';
    ctx.fillRect(0, playerY, paddleWidth, paddleHeight);

    // Right Paddle (AI)
    ctx.fillStyle = '#f00';
    ctx.fillRect(canvas.width - paddleWidth, aiY, paddleWidth, paddleHeight);

    // Ball
    ctx.fillStyle = '#fff';
    ctx.fillRect(ballX, ballY, ballSize, ballSize);

    // Scores
    ctx.font = "36px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(playerScore, canvas.width / 2 - 60, 50);
    ctx.fillText(aiScore, canvas.width / 2 + 35, 50);
}

// Ball and paddle logic
function update() {
    // Ball movement
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Top and bottom wall collision
    if (ballY <= 0 || ballY + ballSize >= canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Left paddle collision
    if (
        ballX <= paddleWidth &&
        ballY + ballSize > playerY &&
        ballY < playerY + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;
        // Add some "spin" based on where it hits the paddle
        let deltaY = ballY + ballSize / 2 - (playerY + paddleHeight / 2);
        ballSpeedY = deltaY * 0.20;
    }

    // Right paddle (AI) collision
    if (
        ballX + ballSize >= canvas.width - paddleWidth &&
        ballY + ballSize > aiY &&
        ballY < aiY + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;
        let deltaY = ballY + ballSize / 2 - (aiY + paddleHeight / 2);
        ballSpeedY = deltaY * 0.20;
    }

    // Score for player or AI
    if (ballX < 0) {
        aiScore++;
        resetBall();
    } else if (ballX + ballSize > canvas.width) {
        playerScore++;
        resetBall();
    }

    // AI paddle movement (simple tracking)
    let aiCenter = aiY + paddleHeight / 2;
    if (aiCenter < ballY + ballSize / 2 - 10) {
        aiY += aiSpeed;
    } else if (aiCenter > ballY + ballSize / 2 + 10) {
        aiY -= aiSpeed;
    }
    // Clamp AI paddle within canvas
    if (aiY < 0) aiY = 0;
    if (aiY + paddleHeight > canvas.height)
        aiY = canvas.height - paddleHeight;
}

function resetBall() {
    ballX = canvas.width / 2 - ballSize / 2;
    ballY = canvas.height / 2 - ballSize / 2;
    // Ball starts toward the last scorer
    ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();