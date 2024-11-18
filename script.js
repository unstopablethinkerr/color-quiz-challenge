// DOM Elements
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const colorBlock = document.getElementById("color-block");
const optionsContainer = document.getElementById("options");
const scoreDisplay = document.getElementById("score");
const timerFill = document.getElementById("timer-fill");
const finalScore = document.getElementById("final-score");
const allTimeScoreDisplay = document.createElement("p"); // New element for all-time score

// Add the all-time score display to the end screen
endScreen.appendChild(allTimeScoreDisplay);

// Game Variables
let score = 0;
let timer = null;
let currentColor = null;

// Utility Function: Generate a random hex color
function getRandomColor() {
    const letters = "0123456789ABCDEF";
    return "#" + Array.from({ length: 6 })
        .map(() => letters[Math.floor(Math.random() * 16)])
        .join("");
}

// Start the Game
function startGame() {
    score = 0; // Reset score
    updateScore();
    currentColor = null; // Reset the current color
    clearTimer(); // Clear any existing timers

    // Transition screens
    startScreen.classList.add("hidden");
    endScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    nextQuestion(); // Load the first question
}

// End the Game
function endGame() {
    clearTimer(); // Stop the timer
    finalScore.textContent = score; // Display final score

    // Update all-time high score if necessary
    updateAllTimeScore(score);

    // Transition screens
    gameScreen.classList.add("hidden");
    endScreen.classList.remove("hidden");
}

// Update the Score Display
function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

// Clear Timer (if any active)
function clearTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

// Start the Timer
function startTimer() {
    let timeLeft = 5; // Timer duration in seconds
    timerFill.style.width = "100%"; // Reset the timer bar to full

    timer = setInterval(() => {
        timeLeft--;
        timerFill.style.width = `${(timeLeft ) * 100}%`; // Update timer bar width
        if (timeLeft <= 0) {
            clearTimer();
            endGame(); // End the game if timer reaches 0
        }
    }, 1000);
}

// Load the Next Question
function nextQuestion() {
    clearTimer(); // Clear any existing timer
    startTimer(); // Start a new timer

    // Generate a new random color for the color block
    currentColor = getRandomColor();
    colorBlock.style.backgroundColor = currentColor;

    // Generate three options, one of which is correct
    const options = [currentColor, getRandomColor(), getRandomColor()].sort(() => Math.random() - 0.5);

    // Clear the options container and populate new options
    optionsContainer.innerHTML = ""; // Clear previous options
    options.forEach((color) => {
        const option = document.createElement("div");
        option.className = "option"; // Apply styling
        option.style.backgroundColor = color; // Fill with color
        option.addEventListener("click", () => handleOptionClick(option, color)); // Add click handler
        optionsContainer.appendChild(option); // Add to DOM
    });
}

// Handle Option Click
function handleOptionClick(option, selectedColor) {
    if (selectedColor === currentColor) {
        // Correct answer: Update score and move to next question
        option.classList.add("correct");
        score += 5;
        updateScore();
        setTimeout(() => {
            option.classList.remove("correct");
            nextQuestion();
        }, 1000); // Short delay before loading the next question
    } else {
        // Wrong answer: End the game
        option.classList.add("wrong");
        setTimeout(endGame, 1000);
    }
}

// Update All-Time High Score
function updateAllTimeScore(currentScore) {
    const highScoreData = localStorage.getItem("highScore");
    let highScore = 0;
    let highScoreDate = "";

    // Parse existing high score data
    if (highScoreData) {
        const parsedData = JSON.parse(highScoreData);
        highScore = parsedData.score;
        highScoreDate = parsedData.date;
    }

    // If current score is higher, update the high score
    if (currentScore > highScore) {
        const newHighScoreData = {
            score: currentScore,
            date: new Date().toLocaleString(),
        };
        localStorage.setItem("highScore", JSON.stringify(newHighScoreData));
        highScore = currentScore;
        highScoreDate = newHighScoreData.date;
    }

    // Display the high score on the end screen
    allTimeScoreDisplay.textContent = `All-Time High Score: ${highScore} (Achieved on: ${highScoreDate})`;
}

// Event Listeners
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);
