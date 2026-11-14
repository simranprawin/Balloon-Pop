
const gameArea = document.getElementById("gameArea");

const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const bestDisplay = document.getElementById("bestScore");

const overlay = document.getElementById("overlay");
const overlayIcon = document.getElementById("overlayIcon");
const overlayTitle = document.getElementById("overlayTitle");
const overlayText = document.getElementById("overlayText");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

let score = 0;
let timeLeft = 60;
let bestScore = Number(localStorage.getItem("balloonBest")) || 0;

let gameRunning = false;
let countdown;
let balloonSpawner;

bestDisplay.textContent = bestScore;

const colors = [
    "#ff4d6d",
    "#ffbe0b",
    "#3a86ff",
    "#8338ec",
    "#06d6a0",
    "#ff7b00",
    "#f72585"
];

function updateScore(points) {
    score = Math.max(0, score + points);

    scoreDisplay.textContent = score;

    if (score > bestScore) {
        bestScore = score;
        bestDisplay.textContent = bestScore;

        localStorage.setItem("balloonBest", bestScore);
    }
}

function createBalloon() {
    if (!gameRunning) return;

    const balloon = document.createElement("div");

    const isBomb = Math.random() < 0.13;

    balloon.classList.add("balloon");

    const areaWidth = gameArea.clientWidth;
    const balloonWidth = isBomb ? 45 : 48;

    const randomX = Math.random() *
        Math.max(0, areaWidth - balloonWidth - 10);

    const duration = 4.5 + Math.random() * 2.5;

    balloon.style.left = randomX + "px";
    balloon.style.animationDuration = duration + "s";

    if (isBomb) {
        balloon.classList.add("bomb");
        balloon.textContent = "💣";
    } else {
        const color = colors[
            Math.floor(Math.random() * colors.length)
        ];

        balloon.style.backgroundColor = color;
    }

    balloon.addEventListener("click", () => {
        if (!gameRunning || balloon.classList.contains("popped")) {
            return;
        }

        balloon.classList.add("popped");

        if (isBomb) {
            updateScore(-15);
        } else {
            updateScore(10);
        }

        setTimeout(() => {
            balloon.remove();
        }, 200);
    });

    gameArea.appendChild(balloon);

    balloon.addEventListener("animationend", () => {
        balloon.remove();
    });
}

function startGame() {
    clearInterval(countdown);
    clearInterval(balloonSpawner);

    gameArea.querySelectorAll(".balloon").forEach(balloon => {
        balloon.remove();
    });

    score = 0;
    timeLeft = 60;
    gameRunning = true;

    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;

    overlay.style.display = "none";

    createBalloon();

    balloonSpawner = setInterval(createBalloon, 650);

    countdown = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    gameRunning = false;

    clearInterval(countdown);
    clearInterval(balloonSpawner);

    gameArea.querySelectorAll(".balloon").forEach(balloon => {
        balloon.remove();
    });

    overlay.style.display = "flex";

    overlayIcon.textContent = "🏆";
    overlayTitle.textContent = "Time's Up!";

    overlayText.textContent =
        `Amazing! Your final score is ${score} points.`;

    startBtn.textContent = "PLAY AGAIN";
}

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);

// Initial screen
timeDisplay.textContent = timeLeft;
scoreDisplay.textContent = score;
