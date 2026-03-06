// --- ADAMAS PROTOCOL OFFICIAL SCRIPT ---

const LOGO_URL = 'assets/logo.png'; // 👈 Apne ADS Logo ka path yahan daalein
let timeLeft = 15;
let correctOrder = [0, 1, 2, 3];
let currentOrder = [];

// 1. Tab Management System
function openTab(evt, tabName) {
    let i, content, tablinks;
    content = document.getElementsByClassName("content-section");
    for (i = 0; i < content.length; i++) { content[i].style.display = "none"; }
    tablinks = document.getElementsByClassName("tab-link");
    for (i = 0; i < tablinks.length; i++) { tablinks[i].className = tablinks[i].className.replace(" active", ""); }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// 2. Logo Puzzle Logic
function initPuzzle() {
    const board = document.getElementById('puzzle-board');
    board.innerHTML = '';
    currentOrder = [...correctOrder].sort(() => Math.random() - 0.5);
    
    currentOrder.forEach((pos, index) => {
        const piece = document.createElement('div');
        piece.className = 'piece';
        piece.style.backgroundImage = `url('${LOGO_URL}')`;
        
        // Split image for 2x2 grid
        let x = (pos % 2) * 120;
        let y = Math.floor(pos / 2) * 120;
        piece.style.backgroundPosition = `-${x}px -${y}px`;
        
        piece.onclick = () => swapPiece(index);
        board.appendChild(piece);
    });
}

let selectedIdx = null;
function swapPiece(idx) {
    if (selectedIdx === null) {
        selectedIdx = idx;
        document.querySelectorAll('.piece')[idx].style.borderColor = "#ffcc00";
    } else {
        [currentOrder[selectedIdx], currentOrder[idx]] = [currentOrder[idx], currentOrder[currentOrder[selectedIdx] = currentOrder[idx], currentOrder[idx] = currentOrder[selectedIdx]]]; // Swap
        let temp = currentOrder[selectedIdx];
        currentOrder[selectedIdx] = currentOrder[idx];
        currentOrder[idx] = temp;
        selectedIdx = null;
        renderBoard();
    }
}

function renderBoard() {
    const board = document.getElementById('puzzle-board');
    board.innerHTML = '';
    currentOrder.forEach((pos, index) => {
        const piece = document.createElement('div');
        piece.className = 'piece';
        piece.style.backgroundImage = `url('${LOGO_URL}')`;
        let x = (pos % 2) * 120;
        let y = Math.floor(pos / 2) * 120;
        piece.style.backgroundPosition = `-${x}px -${y}px`;
        piece.onclick = () => swapPiece(index);
        board.appendChild(piece);
    });
}

// 3. Reward Verification (0-3000 ABP)
function verifyPuzzle() {
    const win = currentOrder.every((val, index) => val === index);
    if (win) {
        const reward = Math.floor(Math.random() * 3001);
        alert(`🎉 Mubarak Ho! Aapne Logo restore kar diya aur ${reward} ABP jeete! \n(Value unlocks at Mainnet)`);
        initPuzzle();
        timeLeft = 15;
    } else {
        alert("❌ Logo abhi bhi galat hai. Sahi order mein jodein! 😊");
    }
}

// 4. Global Timer & Initialization
setInterval(() => {
    timeLeft--;
    document.getElementById('timer').innerText = timeLeft;
    if (timeLeft <= 0) {
        initPuzzle();
        timeLeft = 15;
    }
}, 1000);

window.onload = initPuzzle;
