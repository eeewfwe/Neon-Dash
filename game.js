// 1. SERVICE WORKER REGISTRATION (Allows Offline Play)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('App ready for offline use!'))
            .catch(err => console.log('SW failed:', err));
    });
}

// 2. SETUP VARIABLES & AUDIO
const player = document.getElementById('player');
const stage = document.getElementById('game-stage');
const scoreBoard = document.getElementById('score-board');

// Sound Effects
const jumpSfx = new Audio('jump.mp3');
const crashSfx = new Audio('crash.mp3');

// Game State
let isJumping = false;
let gravity = 0.9;
let position = 0; 
let score = 0;
let isGameOver = false;

// Load High Score from Local Storage
let highScore = localStorage.getItem('neonDashHighScore') || 0;

// 3. JUMP LOGIC
function jump() {
    if (isJumping || isGameOver) return;
    
    // Play Jump Sound
    jumpSfx.currentTime = 0;
    jumpSfx.play().catch(e => console.log("Audio needs user interaction first"));

    isJumping = true;
    let velocity = 15;

    let timerId = setInterval(() => {
        position += velocity;
        velocity -= gravity;
        
        if (position <= 0) {
            position = 0;
            velocity = 0;
            isJumping = false;
            clearInterval(timerId);
        }
        
        player.style.bottom = position + 'px';
    }, 20);
}

// 4. OBSTACLE & COLLISION LOOP
function createObstacle() {
    if (isGameOver) return;

    let obstaclePos = 600; 
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    stage.appendChild(obstacle);
    obstacle.style.left = obstaclePos + 'px';

    let obstacleTimer = setInterval(() => {
        // COLLISION CHECK
        if (obstaclePos > 50 && obstaclePos < 85 && position < 45) {
            handleGameOver();
            clearInterval(obstacleTimer);
        }

        // SPEED: Obstacles get faster as score increases
        obstaclePos -= (7 + score / 10); 
        obstacle.style.left = obstaclePos + 'px';

        // SCORING
        if (obstaclePos < -25) {
            clearInterval(obstacleTimer);
            stage.removeChild(obstacle);
            if (!isGameOver) {
                score++;
                scoreBoard.innerText = "Score: " + score;
            }
        }
    }, 20);

    // Random timing for next obstacle
    if (!isGameOver) {
        let nextSpawn = Math.random() * 2000 + 800;
        setTimeout(createObstacle, nextSpawn);
    }
}

// 5. GAME OVER LOGIC
function handleGameOver() {
    isGameOver = true;
    player.classList.add('dead'); // Trigger CSS animation
    
    // Play Crash Sound
    crashSfx.play();

    // Update High Score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('neonDashHighScore', highScore);
    }

    // Short delay so the player can see the "Dead" animation
    setTimeout(() => {
        alert(`GAME OVER\nScore: ${score}\nBest: ${highScore}`);
        location.reload(); 
    }, 400);
}

// 6. CONTROLS (Keyboard + Mobile Touch)
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') jump();
});

document.addEventListener('touchstart', (e) => {
    // Prevent default avoids zooming or scrolling while playing
    if (e.target.id !== 'start-btn') e.preventDefault();
    jump();
}, {passive: false});

// 7. START GAME
createObstacle();