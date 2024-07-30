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
let birdFrame = 0;

// Pipe variables
let pipes = [];
let pipeTimer = 0;

// Scoring
let score = 0;

// Game state
let gameRunning = false;
let gameStarted = false;

// Background variables
let backgroundX = 0;

// Canvas setup
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

// Load images
const birdImages = [
    new Image(),
    new Image(),
    new Image(),
];
birdImages[0].src = 'https://raw.githubusercontent.com/kriscross07/FlappyBird/master/assets/bird-1.png';
birdImages[1].src = 'https://raw.githubusercontent.com/kriscross07/FlappyBird/master/assets/bird-2.png';
birdImages[2].src = 'https://raw.githubusercontent.com/kriscross07/FlappyBird/master/assets/bird-3.png';

const pipeImageTop = new Image();
pipeImageTop.src = 'https://raw.githubusercontent.com/kriscross07/FlappyBird/master/assets/pipe-top.png';

const pipeImageBottom = new Image();
pipeImageBottom.src = 'https://raw.githubusercontent.com/kriscross07/FlappyBird/master/assets/pipe-bottom.png';

const backgroundImage = new Image();
backgroundImage.src = 'https://raw.githubusercontent.com/kriscross07/FlappyBird/master/assets/background-day.png';

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
    birdFrame = (birdFrame + 1) % 3;

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

    // Scroll background
    backgroundX -= 1;
    if (backgroundX <= -CANVAS_WIDTH) {
        backgroundX = 0;
    }
}

// Draw game elements
function draw() {
    // Draw background
    ctx.drawImage(backgroundImage, backgroundX, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(backgroundImage, backgroundX + CANVAS_WIDTH, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw bird
    ctx.drawImage(birdImages[birdFrame], birdX, birdY, BIRD_WIDTH, BIRD_HEIGHT);

    // Draw pipes
    for (let pipe of pipes) {
        ctx.drawImage(pipeImageTop, pipe.x, pipe.topHeight - pipeImageTop.height);
        ctx.drawImage(pipeImageBottom, pipe.x, pipe.bottomY);
    }

    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 25);

    // Draw game over message
    if (!gameRunning && gameStarted) {
        ctx.fillStyle = 'red';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over', CANVAS_WIDTH / 2 - 80, CANVAS_HEIGHT / 2);
        ctx.font = '20px Arial';
        ctx.fillText('Click to Restart', CANVAS_WIDTH / 2 - 85, CANVAS_HEIGHT / 2 + 30);
    }

    // Draw start screen
    if (!gameStarted) {
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.fillText('Flappy Bird', CANVAS_WIDTH / 2 - 85, CANVAS_HEIGHT / 2 - 50);
        ctx.font = '20px Arial';
        ctx.fillText('Click to Start', CANVAS_WIDTH / 2 - 70, CANVAS_HEIGHT / 2);
    }
}

// Handle flap input
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && gameRunning) {
        birdVelocity = -FLAP_STRENGTH;
    }
});

// Handle game start/restart
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
    gameStarted = true;
}

// Start game
gameLoop();
