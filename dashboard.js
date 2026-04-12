/**
 * ADAMAS PROTOCOL - DASHBOARD CORE (V11.5 - SYNC & RANK FIXED)
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

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const ADMIN_WALLET = "0xC9267828a11dB4cb32f0A5Ea5FC29b38FF0fF25e"; 
const GENESIS_SUPPLY = 21000; 
let userWallet = localStorage.getItem('adamas_user');
let balance = 0;
let miningActive = false;
let currentStreak = 0;
let l1Count = 0;
let currentMultiplier = 1.0;

window.onload = () => {
    if(!userWallet) { window.location.href = "index.html"; return; }

    const addressEl = document.getElementById('user-address');
    if (addressEl) addressEl.innerText = userWallet.slice(0, 6) + "..." + userWallet.slice(-4);

    const baseUrl = window.location.origin + window.location.pathname.replace('dashboard.html', 'index.html');
    const refInput = document.getElementById('ref-link-input');
    if (refInput) refInput.value = `${baseUrl}?ref=${userWallet}`;

    // --- REAL-TIME DATA SYNC ---
    database.ref('users/' + userWallet).on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            balance = data.balance || 0;
            currentStreak = data.streak || 0;
            currentMultiplier = data.currentMultiplier || 1.0;
            
            updateDisplay();
            calculateTrustScore(data);
            loadNetworkStats(); 
            // 🔥 Fixed: Pass all data to Rank logic
            calculateEliteTier(balance, currentStreak, data); 
            updateScarcityMeter(balance);
        }
    });
};

function formatBalance(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(3) + " M"; 
    return num.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

function updateDisplay() {
    const balEl = document.getElementById('total-balance');
    const streakDash = document.getElementById('streak-info-dash');
    const streakText = document.getElementById('streak-text');

    if (balEl) balEl.innerText = formatBalance(balance);
    if (streakDash) streakDash.innerText = `${currentStreak} DAYS`;
    if (streakText) streakText.innerText = `Streak active: ${currentMultiplier.toFixed(1)}x Multiplier`;
}

// 🔥 NETWORK SYNC: Dashboard count mismatch fix
function loadNetworkStats() {
    database.ref('users/' + userWallet + '/myReferrals').on('value', (snapshot) => {
        const l1Data = snapshot.val();
        l1Count = l1Data ? Object.keys(l1Data).length : 0;
        
        const refEl = document.getElementById('ref-count');
        if(refEl) refEl.innerText = l1Count;
    });
}

// 🏆 RANK LOGIC: Bronze vs Silver Sync Fix
function calculateEliteTier(bal, streak, data) {
    const tierName = document.getElementById('elite-tier-name');
    const tierFill = document.getElementById('tier-progress-fill');
    
    // Check if user is Admin
    if (userWallet.toLowerCase() === ADMIN_WALLET.toLowerCase()) {
        tierName.innerText = "DIAMOND FOUNDER";
        tierFill.style.width = "100%";
        return;
    }

    // 🔥 SILVER ELIGIBILITY: 2+ Refs OR 1000+ ABP
    if (l1Count >= 2 || bal >= 1000) {
        tierName.innerText = "SILER NODE";
        tierName.style.color = "#C0C0C0"; // Silver color
        tierFill.style.width = "60%";
    } else {
        tierName.innerText = "BRONZE NODE";
        tierFill.style.width = "30%";
    }
}

function calculateTrustScore(data) {
    const isAdmin = userWallet.toLowerCase() === ADMIN_WALLET.toLowerCase();
    let score = isAdmin ? 100 : 20; // Base 20 for active wallet
    
    if (data.streak >= 2) score += 30;
    if (l1Count >= 1) score += 50;

    const fill = document.getElementById('trust-fill');
    if(fill) fill.style.width = Math.min(score, 100) + "%";
}

function updateScarcityMeter(bal) {
    let percent = (bal / GENESIS_SUPPLY) * 100;
    const fill = document.getElementById('scarcity-fill');
    const txt = document.getElementById('scarcity-percent');
    if (fill) fill.style.width = Math.min(percent, 100) + "%";
    if (txt) txt.innerText = Math.min(percent, 100).toFixed(2) + "%";
}

window.toggleMining = function() {
    miningActive = !miningActive;
    const btn = document.getElementById('mining-btn');
    if(btn) {
        btn.innerText = miningActive ? "MINING ACTIVE" : "INITIALIZE MINING";
        btn.style.background = miningActive ? "linear-gradient(90deg, #00f2ff, #00ff88)" : "";
    }
    if (miningActive) mineLoop();
};

function mineLoop() {
    if (!miningActive) return;
    let mineStep = (userWallet.toLowerCase() === ADMIN_WALLET.toLowerCase()) ? 0.005 : (0.000025 * currentMultiplier); 
    balance += mineStep;
    updateDisplay();
    // Save to DB every ~30 seconds to save bandwidth
    if (Math.random() > 0.95) {
        database.ref('users/' + userWallet).update({ balance: balance });
    }
    setTimeout(mineLoop, 3000);
}

window.claimDailyBonus = function() {
    const today = new Date().toDateString();
    database.ref('users/' + userWallet).once('value').then((snapshot) => {
        const data = snapshot.val() || {};
        if (data.lastClaim === today) return alert("System Already Synced Today!");
        
        let newStreak = (data.streak || 0) + 1;
        let reward = 5.0 + (newStreak * 0.5);
        
        database.ref('users/' + userWallet).update({ 
            balance: (data.balance || 0) + reward, 
            streak: newStreak, 
            lastClaim: today 
        });
        alert(`Node Synchronized! +${reward.toFixed(2)} ABP Added.`);
    });
};
