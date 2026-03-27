// 1. Setup Variables
const player = document.getElementById('player');
const stage = document.getElementById('game-stage');
const scoreBoard = document.getElementById('score-board');

let isJumping = false;
let gravity = 0.9;
let position = 0; 
let score = 0;
let isGameOver = false;

// Load High Score from phone memory
let highScore = localStorage.getItem('neonDashHighScore') || 0;

// 2. The Jump Logic (Physics)
function jump() {
    if (isJumping || isGameOver) return;
    
    isJumping = true;
    let velocity = 15; // Initial upward thrust

    let timerId = setInterval(() => {
        // Apply Gravity
        position += velocity;
        velocity -= gravity;
        
        // Ground Collision
        if (position <= 0) {
            position = 0;
            velocity = 0;
            isJumping = false;
            clearInterval(timerId);
        }
        
        player.style.bottom = position + 'px';
    }, 20);
}

// 3. The Obstacle & Collision Logic
function createObstacle() {
    if (isGameOver) return;

    let obstaclePos = 600; // Starting at the right edge
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    stage.appendChild(obstacle);
    obstacle.style.left = obstaclePos + 'px';

    let obstacleTimer = setInterval(() => {
        // COLLISION DETECTION MATH
        // Player is at left: 50px, width: 35px. 
        // We check if obstacle is between 50-85px AND player is on the ground.
        if (obstaclePos > 50 && obstaclePos < 85 && position < 45) {
            handleGameOver();
            clearInterval(obstacleTimer);
        }

        obstaclePos -= (7 + score / 10); // Gets faster as score increases!
        obstacle.style.left = obstaclePos + 'px';

        // Scored a point?
        if (obstaclePos < -25) {
            clearInterval(obstacleTimer);
            stage.removeChild(obstacle);
            if (!isGameOver) {
                score++;
                scoreBoard.innerText = "Score: " + score;
            }
        }
    }, 20);

    // Random spawn time for next obstacle
    let nextSpawn = Math.random() * 2000 + 800;
    if (!isGameOver) setTimeout(createObstacle, nextSpawn);
}

// 4. Game Over Handling
function handleGameOver() {
    isGameOver = true;
    player.classList.add('dead');

    // Save High Score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('neonDashHighScore', highScore);
    }

    setTimeout(() => {
        alert(`GAME OVER\nScore: ${score}\nBest: ${highScore}`);
        location.reload(); 
    }, 400);
}

// 5. Controls (Keyboard + Mobile Touch)
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') jump();
});

document.addEventListener('touchstart', (e) => {
    // Prevents zooming/scrolling while tapping
    if (e.target.id !== 'start-btn') e.preventDefault();
    jump();
}, {passive: false});

// 6. Start the Game
createObstacle();