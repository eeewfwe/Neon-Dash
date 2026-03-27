const player = document.getElementById('player');
const stage = document.getElementById('game-stage');
const scoreBoard = document.getElementById('score-board');

let isJumping = false;
let gravity = 0.9;
let position = 0; // Distance from the floor
let score = 0;
let isGameOver = false;

// 1. Jump Logic
function jump() {
    if (isJumping) return;
    let velocity = 15;
    isJumping = true;

    let timerId = setInterval(() => {
        // Fall down logic
        if (velocity < -15) {
            clearInterval(timerId);
            isJumping = false;
        }
        
        // Apply velocity to position
        position += velocity;
        velocity -= gravity; // Gravity pulls velocity down
        
        // Keep player above ground
        if (position < 0) position = 0;
        player.style.bottom = position + 'px';
    }, 20);
}

// 2. Obstacle Logic
function createObstacle() {
    if (isGameOver) return;

    let obstaclePos = 800;
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    stage.appendChild(obstacle);
    obstacle.style.left = obstaclePos + 'px';

    let obstacleTimer = setInterval(() => {
        // Collision Detection
        if (obstaclePos > 50 && obstaclePos < 80 && position < 40) {
            clearInterval(obstacleTimer);
            isGameOver = true;
            alert('Game Over! Score: ' + score);
            location.reload(); // Restart
        }

        obstaclePos -= 10;
        obstacle.style.left = obstaclePos + 'px';

        // Remove off-screen obstacles and count score
        if (obstaclePos < -20) {
            clearInterval(obstacleTimer);
            stage.removeChild(obstacle);
            score++;
            scoreBoard.innerText = "Score: " + score;
        }
    }, 20);

    // Randomize next obstacle timing
    if (!isGameOver) setTimeout(createObstacle, Math.random() * 2000 + 700);
}

// Controls
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') jump();
});

createObstacle();
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}
// Add this alongside your keydown listener
document.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevents zooming on double tap
    jump();
});