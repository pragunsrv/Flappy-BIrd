const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 480;
const BIRD_WIDTH = 34;
const BIRD_HEIGHT = 24;
const GRAVITY = 0.25;
const FLAP_STRENGTH = 4.5;

// Bird variables
let birdX = CANVAS_WIDTH / 4;
let birdY = CANVAS_HEIGHT / 2;
let birdVelocity = 0;

// Canvas setup
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
    birdVelocity += GRAVITY;
    birdY += birdVelocity;

    if (birdY + BIRD_HEIGHT > CANVAS_HEIGHT || birdY < 0) {
        resetGame();
    }
}

// Draw game elements
function draw() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw bird
    ctx.fillStyle = 'yellow';
    ctx.fillRect(birdX, birdY, BIRD_WIDTH, BIRD_HEIGHT);
}

// Handle flap input
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        birdVelocity = -FLAP_STRENGTH;
    }
});

// Reset game
function resetGame() {
    birdY = CANVAS_HEIGHT / 2;
    birdVelocity = 0;
}

// Start game
gameLoop();
