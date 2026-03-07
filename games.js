import { db, ref, set, get } from './firebase.js';

// Game Constants
const TEEN_PATTI_FEE = 50; // Jaisa aapne notebook mein likha tha
const MIME_GAME_REWARD_MIN = 500;
const MIME_GAME_REWARD_MAX = 2000;

/**
 * 1. TEEN PATTI (ROLL LOGIC)
 * Notebook: Entry 50 ABP -> Reward 10+ Points with Fee
 */
export async function playTeenPatti(userAddress) {
    const userRef = ref(db, `users/${userAddress}`);
    const snapshot = await get(userRef);
    
    if (!snapshot.exists() || snapshot.val().points < TEEN_PATTI_FEE) {
        alert("❌ Insufficient ABP Points! Please check-in or claim rewards.");
        return;
    }

    // Deduct Entry Fee
    let currentPoints = snapshot.val().points - TEEN_PATTI_FEE;
    
    // Premium Roll Animation Effect (Simulation)
    console.log("🎲 Rolling the Diamond Cards...");
    
    // Logic: Win or Loss (60/40 Probability for high engagement)
    const isWin = Math.random() > 0.4;
    let reward = 0;
    
    if (isWin) {
        reward = TEEN_PATTI_FEE + (Math.random() * 50) + 10; // Fee back + Profit
        currentPoints += reward;
        showGamePopup(`🎉 BIG WIN! You won ${reward.toFixed(2)} ABP!`, "success");
    } else {
        showGamePopup("💔 Better luck next time! The House wins.", "loss");
    }

    // Update Firebase
    await set(userRef, { ...snapshot.val(), points: currentPoints });
    updateUIBalance(currentPoints);
}

/**
 * 2. MIME GAME (4x4 GRID LOGIC)
 * Notebook: 2 Minute Lock Room Feature
 */
let mimeTimer;
export function startMimeGame() {
    const gridContainer = document.getElementById('mimeGrid');
    gridContainer.innerHTML = ''; // Clear old grid
    
    // Create 4x4 Grid (16 Blocks)
    for (let i = 0; i < 16; i++) {
        const block = document.createElement('div');
        block.className = 'mime-block glass-effect';
        block.onclick = () => handleMimeClick(i);
        gridContainer.appendChild(block);
    }

    // 2-Minute Lock Timer (Notebook feature)
    let timeLeft = 120; // 120 seconds
    mimeTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('timerDisplay').innerText = `Room Lock: ${Math.floor(timeLeft / 60)}:${timeLeft % 60}`;
        if (timeLeft <= 0) {
            clearInterval(mimeTimer);
            endMimeGame();
        }
    }, 1000);
}

/**
 * UI & Helpers
 */
function showGamePopup(message, type) {
    const popup = document.createElement('div');
    popup.className = `game-popup ${type}`;
    popup.innerHTML = `<h3>${message}</h3>`;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 3000);
}

function updateUIBalance(newBalance) {
    const balanceEl = document.getElementById('abpBalance');
    if (balanceEl) balanceEl.innerText = newBalance.toFixed(2);
}

// Global Exports
window.playTeenPatti = playTeenPatti;
window.startMimeGame = startMimeGame;
