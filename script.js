const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 480;
const BIRD_WIDTH = 34;
const BIRD_HEIGHT = 24;
const GRAVITY = 0.25;
const FLAP_STRENGTH = 4.5;
const PIPE_WIDTH = 50;
const PIPE_GAP = 120;
const PIPE_INTERVAL = 1500; // milliseconds

// Bird variables
let birdX = CANVAS_WIDTH / 4;
let birdY = CANVAS_HEIGHT / 2;
let birdVelocity = 0;

// Pipe variables
let pipes = [];
let pipeTimer = 0;

// Scoring
let score = 0;

// Game state
let gameRunning = true;

// Canvas setup
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

// Game loop
function gameLoop() {
    if (gameRunning) {
        update();
    }
    draw();
    requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
    birdVelocity += GRAVITY;
    birdY += birdVelocity;

    // Check collision with canvas boundaries
    if (birdY + BIRD_HEIGHT > CANVAS_HEIGHT || birdY < 0) {
        gameOver();
    }

    // Pipe generation
    pipeTimer += 16.67; // Approximation for 60 FPS
    if (pipeTimer > PIPE_INTERVAL) {
        generatePipe();
        pipeTimer = 0;
    }

    // Update pipes
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= 2;
        if (pipes[i].x + PIPE_WIDTH < 0) {
            pipes.splice(i, 1);
            i--;
            score++;
        }
    }

    // Check collision with pipes
    for (let pipe of pipes) {
        if (
            birdX < pipe.x + PIPE_WIDTH &&
            birdX + BIRD_WIDTH > pipe.x &&
            (birdY < pipe.topHeight || birdY + BIRD_HEIGHT > pipe.bottomY)
        ) {
            gameOver();
        }
    }
}

// Draw game elements
function draw() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw bird
    ctx.fillStyle = 'yellow';
    ctx.fillRect(birdX, birdY, BIRD_WIDTH, BIRD_HEIGHT);

    // Draw pipes
    ctx.fillStyle = 'green';
    for (let pipe of pipes) {
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
        ctx.fillRect(pipe.x, pipe.bottomY, PIPE_WIDTH, CANVAS_HEIGHT - pipe.bottomY);
    }

    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 25);

    // Draw game over message
    if (!gameRunning) {
        ctx.fillStyle = 'red';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over', CANVAS_WIDTH / 2 - 80, CANVAS_HEIGHT / 2);
        ctx.font = '20px Arial';
        ctx.fillText('Click to Restart', CANVAS_WIDTH / 2 - 85, CANVAS_HEIGHT / 2 + 30);
    }
}

// Handle flap input
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && gameRunning) {
        birdVelocity = -FLAP_STRENGTH;
    }
});

// Handle game restart
canvas.addEventListener('click', function() {
    if (!gameRunning) {
        resetGame();
    }
});

// Generate a new pipe
function generatePipe() {
    const topHeight = Math.random() * (CANVAS_HEIGHT - PIPE_GAP - 50) + 50;
    const bottomY = topHeight + PIPE_GAP;
    pipes.push({
        x: CANVAS_WIDTH,
        topHeight: topHeight,
        bottomY: bottomY
    });
}

// Game over
function gameOver() {
    gameRunning = false;
}

// Reset game
function resetGame() {
    birdY = CANVAS_HEIGHT / 2;
    birdVelocity = 0;
    pipes = [];
    score = 0;
    pipeTimer = 0;
    gameRunning = true;
}

// Start game
gameLoop();
