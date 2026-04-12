/**
 * ADAMAS PROTOCOL - MISSION & GENESIS COMMAND (V10.0)
 * Logic: Genesis Phase (21k Cap) & Tier Matrix (10k/25k/50k)
 */

const firebaseConfig = {
  apiKey: "AIzaSyBs2XAli-CtSh4qqHJTwcoLBaGsGC4RUHI",
  authDomain: "adamas-protocol-v2.firebaseapp.com",
  databaseURL: "https://adamas-protocol-v2-default-rtdb.firebaseio.com",
  projectId: "adamas-protocol-v2",
  storageBucket: "adamas-protocol-v2.firebasestorage.app",
  messagingSenderId: "197711342782",
  appId: "1:197711342782:web:84cc5ffcd29b3f9bfe82ef",
  measurementId: "G-FKP19J67TT"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

const ADMIN_WALLET = "0xC9267828a11dB4cb32f0A5Ea5FC29b38FF0fF25e";
let userWallet = localStorage.getItem('adamas_user') || "0xADAMAS_GUEST_USER";
let userBalance = 0;
let userStreak = 0;
let userRefs = 0;
let missionProgress = {};

// --- GENESIS & RANK SETTINGS ---
const GENESIS_TARGET = 21000;
const RANK_MATRIX = {
    SILVER: { points: 10000, refs: 3, streak: 10 },
    GOLD: { points: 25000, refs: 10, streak: 20 },
    DIAMOND: { points: 50000, refs: 25, streak: 30 }
};

// --- GAME STATES ---
let mineActive = false;
let mineMultiplier = 1.0;
let bombs = [];

const priorityMissions = [
    { id: 'OFFICIAL_TG_COMM', title: 'Join ADS Community', reward: 15, link: 'https://t.me/adsprotocolcommunity' },
    { id: 'OFFICIAL_TG_CHAN', title: 'Join ADS Official', reward: 10, link: 'https://t.me/ADSProtocol' },
    { id: 'OFFICIAL_X_DIAMO', title: 'Follow Diamo Protocol', reward: 20, link: 'https://x.com/DiamoProtocol' },
    { id: 'OFFICIAL_X_ADAMAS', title: 'Follow Adamas ADS', reward: 20, link: 'https://x.com/AdamasADS' }
];

window.onload = () => {
    if(userWallet === "0xADAMAS_GUEST_USER") return window.location.href = "index.html";

    // 1. Real-time User Data Sync
    database.ref('users/' + userWallet).on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            userBalance = data.balance || 0;
            userStreak = data.streak || 0;
            missionProgress = data.missionProgress || {};
            
            document.getElementById('header-balance').innerText = formatBalance(userBalance) + " ABP";
            updateRankAndChecklist(data);
            updateGenesisVault();
        }
    });

    // 2. Referral Count Sync
    database.ref('users/' + userWallet + '/myReferrals').on('value', (snap) => {
        userRefs = snap.exists() ? Object.keys(snap.val()).length : 0;
        // Re-run checklist update when refs change
        database.ref('users/' + userWallet).once('value', (s) => updateRankAndChecklist(s.val()));
    });

    initMinesGrid();
};

function formatBalance(num) {
    return num >= 1000000 ? (num/1000000).toFixed(2) + "M" : num.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

// 🛡️ --- RANK & CHECKLIST LOGIC --- 🛡️
function updateRankAndChecklist(data) {
    let currentRank = "BRONZE NODE";
    let target = RANK_MATRIX.SILVER;
    let targetName = "TO SILVER";

    // Determine Current Rank & Next Target
    if (userBalance >= RANK_MATRIX.DIAMOND.points && userRefs >= RANK_MATRIX.DIAMOND.refs && userStreak >= RANK_MATRIX.DIAMOND.streak) {
        currentRank = "DIAMOND NODE";
        targetName = "MAX RANK REACHED";
        target = RANK_MATRIX.DIAMOND;
    } else if (userBalance >= RANK_MATRIX.GOLD.points && userRefs >= RANK_MATRIX.GOLD.refs && userStreak >= RANK_MATRIX.GOLD.streak) {
        currentRank = "GOLD NODE";
        target = RANK_MATRIX.DIAMOND;
        targetName = "TO DIAMOND";
    } else if (userBalance >= RANK_MATRIX.SILVER.points && userRefs >= RANK_MATRIX.SILVER.refs && userStreak >= RANK_MATRIX.SILVER.streak) {
        currentRank = "SILVER NODE";
        target = RANK_MATRIX.GOLD;
        targetName = "TO GOLD";
    }

    // Override for Admin
    if (userWallet.toLowerCase() === ADMIN_WALLET.toLowerCase() || data.role === "FOUNDER") {
        currentRank = "💎 DIAMOND FOUNDER";
        targetName = "ELITE ACCESS";
    }

    document.getElementById('active-rank').innerText = currentRank;
    document.getElementById('target-rank-name').innerText = targetName;

    // Update Checklist UI
    updateCheckItem('check-points', userBalance, target.points, "ABP");
    updateCheckItem('check-refs', userRefs, target.refs, "Nodes");
    updateCheckItem('check-streak', userStreak, target.streak, "Days");
}

function updateCheckItem(id, current, required, unit) {
    const el = document.getElementById(id);
    if (!el) return;
    const isDone = current >= required;
    el.innerText = `${current}/${required} ${unit}`;
    el.className = `status-tag ${isDone ? 'status-done' : 'status-pending'}`;
}

// 🔒 --- GENESIS VAULT LOGIC --- 🔒
function updateGenesisVault() {
    // We simulate the global forging progress based on 21k target
    // In a real app, this would be a global counter in Firebase
    let progress = (userBalance / 10000) * 100; // Just for visual feel
    if(progress > 100) progress = 99.9; // Never 100% until Mainnet
    
    document.getElementById('genesis-fill').style.width = progress + "%";
    document.getElementById('genesis-percent').innerText = progress.toFixed(1) + "%";
}

// 💎 --- DIAMOND HUNT (MINES) --- 💎
function initMinesGrid() {
    const grid = document.getElementById('mines-grid');
    if(!grid) return;
    grid.innerHTML = '';
    bombs = [];
    while(bombs.length < 3) {
        let r = Math.floor(Math.random() * 25);
        if(!bombs.includes(r)) bombs.push(r);
    }
    for(let i=0; i<25; i++) {
        const tile = document.createElement('div');
        tile.className = 'mine-tile';
        tile.innerHTML = '?';
        tile.onclick = () => revealMine(i, tile);
        grid.appendChild(tile);
    }
}

window.startMines = function() {
    if(userBalance < 100) return alert("Min. 100 ABP required!");
    if(mineActive) return;
    userBalance -= 100;
    database.ref(`users/${userWallet}`).update({ balance: userBalance });
    mineActive = true;
    mineMultiplier = 1.0;
    document.getElementById('mine-start-btn').style.display = 'none';
    document.getElementById('mine-cashout-btn').style.display = 'block';
    initMinesGrid();
};

function revealMine(id, el) {
    if(!mineActive || el.classList.contains('revealed')) return;
    el.classList.add('revealed');
    if(bombs.includes(id)) {
        el.innerHTML = '💣'; el.classList.add('bomb');
        alert("BOMB! -100 ABP");
        endMinesGame();
    } else {
        el.innerHTML = '💎'; el.classList.add('win');
        mineMultiplier += 0.25;
        document.getElementById('mine-multiplier').innerText = `NEXT: ${mineMultiplier.toFixed(2)}x`;
    }
}

window.cashoutMines = function() {
    if(!mineActive) return;
    userBalance += (100 * mineMultiplier);
    database.ref(`users/${userWallet}`).update({ balance: userBalance });
    endMinesGame();
};

function endMinesGame() {
    mineActive = false;
    document.getElementById('mine-start-btn').style.display = 'block';
    document.getElementById('mine-cashout-btn').style.display = 'none';
    document.getElementById('mine-multiplier').innerText = "BET: 100 ABP";
}

// 🐔 --- CHICKEN ROAD --- 🐔
window.startChickenRun = function() {
    if(userBalance < 50) return alert("Min. 50 ABP!");
    let win = Math.random() > 0.5;
    let diff = win ? 25 : -50;
    userBalance += diff;
    database.ref(`users/${userWallet}`).update({ balance: userBalance });
    alert(win ? "SUCCESS! +25 ABP" : "CRASH! -50 ABP");
};

// --- MISSIONS ---
window.toggleMissionList = () => {
    const term = document.getElementById('mission-terminal');
    term.style.display = term.style.display === 'flex' ? 'none' : 'flex';
    if(term.style.display === 'flex') renderMissions();
};

function renderMissions() {
    const container = document.getElementById('mission-list-container');
    let html = "";
    priorityMissions.forEach(m => {
        const isDone = missionProgress[m.id];
        html += `<div class="task-card">
            <div><b>${m.title}</b><br><small>+${m.reward} ABP</small></div>
            <button onclick="executeMission('${m.id}', '${m.link}', ${m.reward})" class="btn-primary" style="width:auto; padding:5px 10px; font-size:10px;">
                ${isDone ? 'DONE' : 'EXECUTE'}
            </button>
        </div>`;
    });
    container.innerHTML = html;
}

window.executeMission = function(mid, link, reward) {
    if(missionProgress[mid]) return;
    window.open(link, '_blank');
    setTimeout(() => {
        missionProgress[mid] = true;
        database.ref(`users/${userWallet}`).update({ balance: userBalance + reward, missionProgress: missionProgress });
        renderMissions();
    }, 3000);
};
