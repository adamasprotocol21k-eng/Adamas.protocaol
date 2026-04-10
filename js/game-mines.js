// ADAMAS PROTOCOL - Mines Game (Final)
import { getDatabase, ref, update } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

const db = getDatabase();
const userWallet = localStorage.getItem('adamas_user');

let grid = [];
let bombPosition = -1;
let gameActive = false;
let currentStake = 0;
let multiplier = 1.2;

const gameContainer = document.getElementById('minesGrid');

// 1. Game Start Logic
window.startMines = async (amount) => {
    if(amount > window.AdamasUI.currentABP) {
        alert("Not enough ABP!");
        return;
    }

    gameActive = true;
    currentStake = amount;
    bombPosition = Math.floor(Math.random() * 25);
    grid = Array(25).fill('diamond');
    grid[bombPosition] = 'bomb';

    // Deduct Stake immediately (The Burn)
    window.AdamasUI.currentABP -= amount;
    window.AdamasUI.syncWithDB();

    renderGrid();
};

// 2. Grid Rendering
function renderGrid() {
    gameContainer.innerHTML = '';
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.className = 'mine-cell glass';
        cell.onclick = () => revealCell(i, cell);
        gameContainer.appendChild(cell);
    }
}

// 3. Reveal Logic
async function revealCell(index, element) {
    if (!gameActive) return;

    if (grid[index] === 'bomb') {
        element.innerHTML = '💣';
        element.style.background = 'red';
        gameActive = false;
        alert("BOMB! Points Burned.");
    } else {
        element.innerHTML = '💎';
        element.style.background = 'var(--cyan)';
        element.onclick = null; // Prevent re-click
        
        // Multiplier Increase
        currentStake *= multiplier;
        document.getElementById('currentWin').innerText = currentStake.toFixed(2);
    }
}

// 4. Cashout Logic
window.cashout = async () => {
    if (!gameActive) return;
    
    window.AdamasUI.currentABP += currentStake;
    gameActive = false;
    alert(`Success! You earned ${currentStake.toFixed(2)} ABP`);
    
    // Sync final balance
    window.AdamasUI.syncWithDB();
    renderGrid(); // Reset Visuals
};
