/**
 * ADAMAS PROTOCOL - MISSION COMMAND (V6 - SYNCED)
 * Features: Social Rewards, Chicken Game Boost, Energy Sync
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

// 1. DATA SYNC & SECURITY
window.onload = () => {
    if(userWallet === "0xADAMAS_GUEST_USER") return window.location.href = "index.html";

    database.ref('users/' + userWallet).on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            userBalance = data.balance || 0;
            userEnergy = data.energy !== undefined ? data.energy : 100;
            
            // Check Multiplier Expiry
            const now = Date.now();
            if (data.multiplierExpiry && now > data.multiplierExpiry) {
                resetMultiplier();
            } else {
                document.getElementById('active-multiplier').innerText = (data.currentMultiplier || 1.0).toFixed(1) + "x";
            }

            updateEnergyUI();
        }
    });

    // Energy Refill Logic (Every 2 minutes +1 Energy when screen is open)
    setInterval(refillEnergy, 120000);
};

function updateEnergyUI() {
    const fill = document.getElementById('energy-fill');
    const val = document.getElementById('energy-val');
    if(fill) {
        fill.style.width = userEnergy + "%";
        fill.style.background = userEnergy < 30 ? "#ff4444" : "linear-gradient(90deg, #ff8800, #ffcc00)";
    }
    if(val) val.innerText = userEnergy + "/100";
}

function refillEnergy() {
    if (userEnergy < 100) {
        userEnergy += 1;
        database.ref('users/' + userWallet).update({ energy: userEnergy });
    }
}

// 2. SOCIAL TASKS
window.startTask = function(taskId) {
    const statusEl = document.getElementById('status-' + taskId);
    if (statusEl.innerText === "COMPLETED") return;

    let reward = (taskId === 'twitter') ? 5 : 3;
    let link = (taskId === 'twitter') ? "https://x.com" : "https://t.me";

    window.open(link, '_blank');
    statusEl.innerText = "VERIFYING...";

    setTimeout(() => {
        userBalance += reward;
        database.ref('users/' + userWallet).update({ balance: userBalance });
        statusEl.innerText = "COMPLETED";
        statusEl.style.color = "#00ff88";
        alert(`Protocol Synced! +${reward} ABP Added.`);
    }, 4000);
};

// 3. NODE CROSSER (CHICKEN GAME)
window.openGame = function(gameType) {
    if (userEnergy < 20) return alert("Insufficient Energy! Wait for recharge.");

    if (gameType === 'chicken') {
        const win = Math.random() > 0.4; // 60% Win Chance
        userEnergy -= 20;
        
        let updateData = { energy: userEnergy };

        if (win) {
            const boost = (1.5 + Math.random() * 0.5).toFixed(1); // 1.5x to 2.0x boost
            const expiry = Date.now() + (3600 * 1000); // 1 Hour Validity
            
            updateData.currentMultiplier = parseFloat(boost);
            updateData.multiplierExpiry = expiry;
            
            alert(`SUCCESS! Node Crosser Active. Multiplier: ${boost}x for 1 hour!`);
        } else {
            updateData.currentMultiplier = 1.0;
            updateData.multiplierExpiry = 0;
            alert("CRASHED! Signal Lost. Multiplier Reset to 1.0x");
        }

        database.ref('users/' + userWallet).update(updateData);
    }
};

function resetMultiplier() {
    database.ref('users/' + userWallet).update({
        currentMultiplier: 1.0,
        multiplierExpiry: 0
    });
    document.getElementById('active-multiplier').innerText = "1.0x";
}
