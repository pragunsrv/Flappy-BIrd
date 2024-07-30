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
const BACKGROUND_SPEED = 1;
const FOREGROUND_SPEED = 2;
const PAUSE_MENU_WIDTH = 200;
const PAUSE_MENU_HEIGHT = 150;

// Bird variables
let birdX = CANVAS_WIDTH / 4;
let birdY = CANVAS_HEIGHT / 2;
let birdVelocity = 0;
let birdFrame = 0;
let birdAnimationCounter = 0;
const birdFrames = ['yellow', 'orange', 'red']; // Different bird colors

// Pipe variables
let pipes = [];
let pipeTimer = 0;
let pipeSpeed = 2;

// Scoring
let score = 0;
let highScore = 0;

// Game state
let gameRunning = false;
let gameStarted = false;
let countdown = 3;
let gamePaused = false;

// Background variables
let backgroundX = 0;
let backgroundSpeed = BACKGROUND_SPEED;
let foregroundX = 0;
let foregroundSpeed = FOREGROUND_SPEED;

// Canvas setup
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

// Create pause menu
const pauseMenu = document.createElement('div');
pauseMenu.id = 'pauseMenu';
pauseMenu.innerHTML = `
    <h2>Paused</h2>
    <button id="resumeButton">Resume</button>
    <button id="restartButton">Restart</button>
`;
document.body.appendChild(pauseMenu);

// Event listeners
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && gameRunning) {
        birdVelocity = -FLAP_STRENGTH;
    }
    if (event.code === 'Escape') {
        togglePause();
    }
});

canvas.addEventListener('click', function() {
    if (!gameRunning) {
        resetGame();
    }
});

document.getElementById('resumeButton').addEventListener('click', function() {
    togglePause();
});

document.getElementById('restartButton').addEventListener('click', function() {
    resetGame();
    togglePause();
});

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
    birdAnimationCounter = (birdAnimationCounter + 1) % 6;
    if (birdAnimationCounter === 0) {
        birdFrame = (birdFrame + 1) % birdFrames.length;
    }

    // Check collision with canvas boundaries
    if (birdY + BIRD_HEIGHT > CANVAS_HEIGHT - 50 || birdY < 0) {
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
        pipes[i].x -= pipeSpeed;
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
    backgroundX -= backgroundSpeed;
    if (backgroundX <= -CANVAS_WIDTH) {
        backgroundX = 0;
    }

    // Scroll foreground
    foregroundX -= foregroundSpeed;
    if (foregroundX <= -CANVAS_WIDTH) {
        foregroundX = 0;
    }
}

// Draw game elements
function draw() {
    // Draw background
    ctx.fillStyle = '#87CEEB'; // Lighter blue for the sky
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = '#4DB6AC'; // Darker green for distant mountains
    ctx.fillRect(backgroundX, CANVAS_HEIGHT - 150, CANVAS_WIDTH, 150); // Background layer

    // Draw bird
    ctx.fillStyle = birdFrames[birdFrame];
    ctx.beginPath();
    ctx.arc(birdX + BIRD_WIDTH / 2, birdY + BIRD_HEIGHT / 2, BIRD_WIDTH / 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw pipes
    ctx.fillStyle = 'green';
    for (let pipe of pipes) {
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
        ctx.fillRect(pipe.x, pipe.bottomY, PIPE_WIDTH, CANVAS_HEIGHT - pipe.bottomY);
    }

    // Draw foreground
    ctx.fillStyle = 'brown';
    ctx.fillRect(0, CANVAS_HEIGHT - 50, CANVAS_WIDTH, 50);

    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 25);
    ctx.fillText(`High Score: ${highScore}`, 10, 50);

    // Draw pause menu
    if (gamePaused) {
        pauseMenu.style.display = 'block';
    } else {
        pauseMenu.style.display = 'none';
    }

    // Draw game over message
    if (!gameRunning && gameStarted) {
        ctx.fillStyle = 'red';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over', CANVAS_WIDTH / 2 - 80, CANVAS_HEIGHT / 2);
        ctx.font = '20px Arial';
        ctx.fillText('Click to Restart', CANVAS_WIDTH / 2 - 85, CANVAS_HEIGHT / 2 + 30);
    }

    // Draw start screen with countdown
    if (!gameStarted) {
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.fillText('Flappy Bird', CANVAS_WIDTH / 2 - 85, CANVAS_HEIGHT / 2 - 50);
        ctx.font = '20px Arial';
        ctx.fillText(`Get Ready: ${countdown}`, CANVAS_WIDTH / 2 - 70, CANVAS_HEIGHT / 2);

        // Countdown logic
        if (countdown > 0) {
            setTimeout(() => {
                countdown--;
                if (countdown === 0) {
                    gameStarted = true;
                    gameRunning = true;
                }
            }, 1000);
        }
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
    if (score > highScore) {
        highScore = score;
    }
}

// Reset game
function resetGame() {
    birdY = CANVAS_HEIGHT / 2;
    birdVelocity = 0;
    pipes = [];
    score = 0;
    pipeTimer = 0;
    pipeSpeed = 2; // Reset pipe speed
    backgroundSpeed = BACKGROUND_SPEED; // Reset background speed
    foregroundSpeed = FOREGROUND_SPEED; // Reset foreground speed
    gameRunning = true;
    gameStarted = true;
    countdown = 3;
}

// Toggle pause menu
function togglePause() {
    gamePaused = !gamePaused;
    if (gamePaused) {
        gameRunning = false;
    } else {
        gameRunning = true;
    }
}

// Start the game loop
gameLoop();
