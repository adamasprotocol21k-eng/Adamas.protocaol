// Quiz Logic - ADAMAS Protocol
let quizData = JSON.parse(localStorage.getItem('adamas_quiz')) || {
    q1_locked_until: 0,
    q2_locked_until: 0,
    current_step: 1
};

function initQuiz() {
    const now = new Date().getTime();
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');

    // Check Question 1 Lock
    if (now < quizData.q1_locked_until) {
        lockStep(1, quizData.q1_locked_until);
        step2.classList.remove('step-locked'); // Unlock Step 2 if Step 1 is done
    }

    // Check Question 2 Lock
    if (now < quizData.q2_locked_until) {
        lockStep(2, quizData.q2_locked_until);
    }
}

function lockStep(stepId, until) {
    const stepBox = document.getElementById('step' + stepId);
    const timerBox = document.getElementById('timer' + stepId);
    const optionsBox = document.getElementById('q' + stepId + '-options');

    stepBox.style.opacity = "0.7";
    optionsBox.style.display = "none";
    timerBox.style.display = "block";

    // Countdown logic
    setInterval(() => {
        const now = new Date().getTime();
        const diff = until - now;
        if (diff > 0) {
            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);
            timerBox.innerText = `Unlock in: ${h}h ${m}m ${s}s`;
        } else {
            location.reload(); // Time's up, unlock!
        }
    }, 1000);
}

function checkAnswer(stepId, answer) {
    // Basic correct answers check
    const isCorrect = (stepId === 1 && answer === '21000') || (stepId === 2 && answer === 'Activity Bonus Points');

    if (isCorrect) {
        alert("Correct! +250 ABP Earned.");
        userStats.balance += 250;
        saveStats();
        
        // Lock for 24 Hours
        const lockTime = new Date().getTime() + (24 * 60 * 60 * 1000);
        if (stepId === 1) quizData.q1_locked_until = lockTime;
        else quizData.q2_locked_until = lockTime;

        localStorage.setItem('adamas_quiz', JSON.stringify(quizData));
        location.reload();
    } else {
        alert("Wrong Answer! Try again later.");
    }
}

