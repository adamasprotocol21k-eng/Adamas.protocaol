/**
 * ADAMAS PROTOCOL - MISSION COMMAND (V7.2 - OFFICIAL LINKS & ADMIN MODE)
 * Features: Priority Socials, 5x5 Casino Grid, Infinite Tasks
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

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let userWallet = localStorage.getItem('adamas_user') || "0xADAMAS_GUEST_USER";
let userBalance = 0;
let userEnergy = 100;
let missionProgress = {};

// CASINO STATE
let gameActive = false;
let gameMultiplier = 1.0;
let bones = []; 

// 1. OFFICIAL MISSION LIST (Priority Links)
const priorityMissions = [
    { id: 'OFFICIAL_TG_COMM', title: 'Join ADS Community', reward: 15, link: 'https://t.me/adsprotocolcommunity' },
    { id: 'OFFICIAL_TG_CHAN', title: 'Join ADS Official', reward: 10, link: 'https://t.me/ADSProtocol' },
    { id: 'OFFICIAL_X_DIAMO', title: 'Follow Diamo Protocol', reward: 20, link: 'https://x.com/DiamoProtocol' },
    { id: 'OFFICIAL_X_ADAMAS', title: 'Follow Adamas ADS', reward: 20, link: 'https://x.com/AdamasADS' }
];

// DYNAMIC GENERIC MISSIONS
const missionTemplates = [
    { type: 'X', title: 'Follow Adamas Node', reward: 5, count: 20, link: 'https://x.com' },
    { type: 'TG', title: 'Join Sync Channel', reward: 3, count: 15, link: 'https://t.me' }
];

// 2. INITIALIZE
window.onload = () => {
    if(userWallet === "0xADAMAS_GUEST_USER") return window.location.href = "index.html";

    database.ref('users/' + userWallet).on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            // ADMIN FLEX: Agar aapka wallet hai, toh balance ko 100x karke dikhao Twitter ke liye
            // Apne wallet address yahan check kar sakte hain
            userBalance = data.balance || 0;
            userEnergy = data.energy !== undefined ? data.energy : 100;
            missionProgress = data.missionProgress || {};
            
            const now = Date.now();
            if (data.multiplierExpiry && now > data.multiplierExpiry) {
                resetMultiplier();
            } else {
                document.getElementById('active-multiplier').innerText = (data.currentMultiplier || 1.0).toFixed(1) + "x";
            }
            updateEnergyUI();
        }
    });

    initCasinoGrid();
    setInterval(refillEnergy, 60000); 
};

// 3. MISSION RENDERING
window.toggleMissionList = () => {
    const term = document.getElementById('mission-terminal');
    const isOpening = term.style.display !== 'flex';
    term.style.display = isOpening ? 'flex' : 'none';
    if(isOpening) renderMissions();
};

function renderMissions() {
    const container = document.getElementById('mission-list-container');
    let html = "";
    
    // First, Render Official Priority Links
    priorityMissions.forEach(m => {
        const isDone = missionProgress[m.id];
        html += `
            <div class="task-card ${isDone ? 'task-done' : ''}" onclick="executeMission('${m.id}', '${m.link}', ${m.reward})" style="border-left: 4px solid #00f2ff; background: rgba(0, 242, 255, 0.05);">
                <div>
                    <span class="task-name">💎 ${m.title}</span>
                    <span class="task-reward">+${m.reward}.00 ABP</span>
                </div>
                <div class="task-status">${isDone ? 'VERIFIED' : 'CORE TASK'}</div>
            </div>
        `;
    });

    // Then, Render Infinite Generic Missions
    missionTemplates.forEach(template => {
        for(let i=1; i<=template.count; i++) {
            const mid = `${template.type}_${i}`;
            const isDone = missionProgress[mid];
            html += `
                <div class="task-card ${isDone ? 'task-done' : ''}" onclick="executeMission('${mid}', '${template.link}', ${template.reward})">
                    <div>
                        <span class="task-name">${template.title} #${i}</span>
                        <span class="task-reward">+${template.reward}.00 ABP</span>
                    </div>
                    <div class="task-status">${isDone ? 'VERIFIED' : 'EXECUTE'}</div>
                </div>
            `;
        }
    });
    container.innerHTML = html;
}

window.executeMission = function(mid, link, reward) {
    if(missionProgress[mid]) return;
    
    window.open(link, '_blank');
    
    // Official links ke liye 5 sec delay, generic ke liye 3 sec
    let delay = mid.startsWith('OFFICIAL') ? 5000 : 3000;

    setTimeout(() => {
        missionProgress[mid] = true;
        database.ref(`users/${userWallet}`).update({
            balance: userBalance + reward,
            missionProgress: missionProgress
        });
        alert(`Mission Verified! Reward: ${reward} ABP Added.`);
        renderMissions();
    }, delay);
};

// 4. CASINO GRID LOGIC (5x5)
function initCasinoGrid() {
    const grid = document.getElementById('chicken-grid');
    if(!grid) return;
    grid.innerHTML = '';
    gameActive = false;
    gameMultiplier = 1.0;
    bones = [];
    
    while(bones.length < 5) {
        let r = Math.floor(Math.random() * 25);
        if(!bones.includes(r)) bones.push(r);
    }

    for(let i=0; i<25; i++) {
        const tile = document.createElement('div');
        tile.className = 'casino-tile';
        tile.onclick = () => revealTile(i, tile);
        grid.appendChild(tile);
    }
}

function revealTile(id, el) {
    if(el.classList.contains('tile-win') || el.classList.contains('tile-loss')) return;
    
    if(!gameActive) {
        if(userEnergy < 20) return alert("Low Energy!");
        gameActive = true;
        userEnergy -= 20;
        database.ref(`users/${userWallet}`).update({ energy: userEnergy });
        document.getElementById('cashout-btn').style.display = 'block';
    }

    if(bones.includes(id)) {
        el.innerHTML = '☠️';
        el.classList.add('tile-loss');
        alert("BONE! Better luck next time.");
        resetCasinoUI();
    } else {
        el.innerHTML = '🍗';
        el.classList.add('tile-win');
        gameMultiplier += 0.2;
        document.getElementById('current-multiplier-display').innerText = `POTENTIAL: ${gameMultiplier.toFixed(1)}x`;
    }
}

window.cashout = () => {
    const expiry = Date.now() + (3600 * 1000); 
    database.ref(`users/${userWallet}`).update({
        currentMultiplier: parseFloat(gameMultiplier.toFixed(1)),
        multiplierExpiry: expiry
    });
    alert(`BOOST ACTIVE! Multiplier: ${gameMultiplier.toFixed(1)}x`);
    resetCasinoUI();
};

function resetCasinoUI() {
    document.getElementById('cashout-btn').style.display = 'none';
    document.getElementById('current-multiplier-display').innerText = `POTENTIAL: 1.0x`;
    setTimeout(initCasinoGrid, 1000);
}

// 5. ENERGY & UTILS
function updateEnergyUI() {
    const fill = document.getElementById('energy-fill');
    if(fill) fill.style.width = userEnergy + "%";
    const val = document.getElementById('energy-val');
    if(val) val.innerText = userEnergy + "/100";
}

function refillEnergy() {
    if (userEnergy < 100) {
        userEnergy += 2;
        database.ref('users/' + userWallet).update({ energy: userEnergy });
    }
}

function resetMultiplier() {
    database.ref('users/' + userWallet).update({ currentMultiplier: 1.0, multiplierExpiry: 0 });
}
