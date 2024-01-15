const startButton = document.getElementById('start-quiz');
const timerElement = document.getElementById('time');
const quizIntro = document.getElementById('quiz-intro');
const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
let score = 0; 

function startGame() {
    toggleHighscoresLink(false);
    toggleTimer(true);
    startButton.classList.add('hide');
    quizIntro.classList.add('hide');
    questionContainer.classList.remove('hide');
    score = 0;

    shuffledQuestions = questions.sort(() => Math.random() - .5);
    currentQuestionIndex = 0;
    timeLeft = 60; // initialize the time left for the quiz
    timerElement.textContent = timeLeft; // display the time left in the timer element

    // start the timer countdown
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame(); 
        }
    }, 1000);

    questionContainer.classList.remove('hide');
    setNextQuestion(); 
}

const questions = [
    {
        question:
            'Commonly used data types DO NOT include:',
        answers: [
            { text: '1. strings', correct: false },
            { text: '2. booleans', correct: false },
            { text: '3. alerts', correct: true },
            { text: '4. numbers', correct: false },
        ],
    },
    {
        question:
            'The condition in an if / else statement is enclosed within ____.',
        answers: [
            { text: '1. quotes', correct: false },
            { text: '2. curly brackets', correct: false },
            { text: '3. parentheses', correct: true },
            { text: '4. square brackets', correct: false },
        ],
    },
    {
        question:
            'Arrays in JavaScript can be used to store ____.',
        answers: [
            { text: '1. numbers and strings', correct: false },
            { text: '2. other arrays', correct: false },
            { text: '3. booleans', correct: false },
            { text: '4. all of the above', correct: true },
        ],
    },
    {
        question:
            'String values must be enclosed within ____ when being assigned to variables.',
        answers: [
            { text: '1. commas', correct: false },
            { text: '2. curly brackets', correct: false },
            { text: '3. quotes', correct: true },
            { text: '4. parentheses', correct: false },
        ],
    },
    {
        question:
            'A very useful tool used during development and debugging for printing content to the debugger is:',
        answers: [
            { text: '1. JavaScript', correct: false },
            { text: '2. terminal / bash', correct: false },
            { text: '3. for loops', correct: false },
            { text: '4. console.log', correct: true },
        ],
    },
];

function resetState() {
    let children = Array.from(answerButtonsElement.children);
    for (let i = 0; i < children.length; i++) {
        answerButtonsElement.removeChild(children[i]);
    }
}

function setNextQuestion() {
    console.log("Setting next question"); 
    showQuestion(shuffledQuestions[currentQuestionIndex]);
}

function showQuestion(question) {
    resetState(); 
    questionElement.innerHTML = ''; 
    const questionTitle = document.createElement('h2');
    questionTitle.textContent = question.question;
    questionElement.appendChild(questionTitle); 
    question.answers.forEach(answer => {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('button');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        li.appendChild(button); 
        answerButtonsElement.appendChild(li); 
    });
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === 'true';
    const feedbackElement = document.getElementById('feedback');

    if (correct) {
        feedbackElement.textContent = 'Correct!';
        score += 20;
    } else {
        feedbackElement.textContent = 'Wrong!';
        timeLeft -= 10;
        if (timeLeft < 0) {
            timeLeft = 0;
        }
        timerElement.textContent = timeLeft;
        score = Math.max(0, score - 10);
    }
    setTimeout(() => {
        if (shuffledQuestions.length > currentQuestionIndex + 1) {
            currentQuestionIndex++;
            setNextQuestion();
        } else {
            endGame();
        }
        feedbackElement.textContent = '';
    }, 1000);
}

startButton.addEventListener('click', startGame);

function endGame() {
    toggleTimer(false);
    clearInterval(timerInterval);
    document.getElementById('final-score').textContent = score; 
    questionContainer.classList.add('hide');
    document.getElementById('end-screen').classList.remove('hide');
}

document.getElementById('highscore-form').addEventListener('submit', saveHighScore);

function saveHighScore(event) {
    event.preventDefault();
    const initials = document.getElementById('initials').value;
    const finalScore = document.getElementById('final-score').textContent;
    const highscore = {
        score: finalScore,
        initials: initials
    };

    let highscores = JSON.parse(localStorage.getItem('highscores')) || [];
    highscores.push(highscore);
    localStorage.setItem('highscores', JSON.stringify(highscores));

    displayHighScores();
}

function displayHighScores() {
    toggleHighscoresLink(false);
    toggleTimer(false);
    let highscores = JSON.parse(localStorage.getItem('highscores')) || [];
    highscores.sort((a, b) => b.score - a.score); 
    const highScoresList = document.getElementById('high-scores-list');
    highScoresList.innerHTML = ''; 
    highscores.forEach(highscore => {
        const li = document.createElement('li');
        li.textContent = `${highscore.initials} - ${highscore.score}`;
        highScoresList.appendChild(li);
    });
    document.getElementById('quiz-intro').classList.add('hide');
    document.getElementById('end-screen').classList.add('hide');
    document.getElementById('high-scores').classList.remove('hide');
}

document.getElementById('clear-highscores').addEventListener('click', clearHighScores);

function clearHighScores() {
    localStorage.removeItem('highscores');
    const highScoresList = document.getElementById('high-scores-list');
    highScoresList.innerHTML = '';
}

document.getElementById('go-back').addEventListener('click', goBack);

function goBack() {
    document.getElementById('high-scores').classList.add('hide');
    document.getElementById('quiz-intro').classList.remove('hide');
    toggleHighscoresLink(true);
    toggleTimer(false);
}

document.getElementById('view-highscores').addEventListener('click', function(event) {
    event.preventDefault(); 
    displayHighScores(); 
});

function toggleHighscoresLink(display) {
    const highscoresLink = document.getElementById('view-highscores');
    if (display) {
        highscoresLink.style.display = 'block';
    } else {
        highscoresLink.style.display = 'none';
    }
}

function toggleTimer(display) {
    const timerDisplay = document.getElementById('timer');
    if (display) {
        timerDisplay.style.display = 'block'; 
    } else {
        timerDisplay.style.display = 'none';
    }
}

// todo: fix button conflict in view highscores (styles are not appearing)
// todo: hide quiz-intro when i click "view high scores"
// todo: remove header when i click "view high scores"
// todo: view-highscores should not appear during quiz
// todo: timer should only appear during quiz