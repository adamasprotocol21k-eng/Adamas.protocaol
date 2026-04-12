/**
 * ADAMAS PROTOCOL - DASHBOARD CORE (V11.4 - MILLION & SYNC OPTIMIZED)
 * Status: Production Ready
 */

// 1. FIREBASE INITIALIZATION
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

// --- CONFIGURATION ---
const ADMIN_WALLET = "0xC9267828a11dB4cb32f0A5Ea5FC29b38FF0fF25e"; 
const GENESIS_SUPPLY = 21000; 
let userWallet = localStorage.getItem('adamas_user') || "0xADAMAS_GUEST_USER";
let balance = 0;
let miningActive = false;
let currentStreak = 0;
let l1Count = 0;
let currentMultiplier = 1.0;

// 2. DASHBOARD STARTUP
window.onload = () => {
    if(userWallet === "0xADAMAS_GUEST_USER") {
        window.location.href = "index.html";
        return;
    }

    // Display Wallet (Sync with New CSS Header)
    const addressEl = document.getElementById('user-address');
    if (addressEl) {
        addressEl.innerText = userWallet.slice(0, 6) + "..." + userWallet.slice(-4);
    }

    // Referral Link
    const baseUrl = window.location.origin + window.location.pathname.replace('dashboard.html', 'index.html');
    const refInput = document.getElementById('ref-link-input');
    if (refInput) refInput.value = `${baseUrl}?ref=${userWallet}`;

    // REAL-TIME DATA SYNC
    database.ref('users/' + userWallet).on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            balance = data.balance || 0;
            currentStreak = data.streak || 0;
            currentMultiplier = data.currentMultiplier || 1.0;
            
            updateDisplay();
            calculateTrustScore(data);
            loadNetworkStats(); // Sync L1 & L2
            calculateEliteTier(balance, currentStreak, l1Count, data.role);
            updateScarcityMeter(balance);
        }
    });
};

// 💎 FORMATTING ENGINE (MILLION LOGIC)
function formatBalance(num) {
    if (num >= 1000000) {
        // 10 Lakh = 1 Million
        return (num / 1000000).toFixed(3) + " M"; 
    }
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

// 🔥 NETWORK SYNC (L1 & L2)
function loadNetworkStats() {
    database.ref('users/' + userWallet + '/myReferrals').on('value', (snapshot) => {
        const l1Data = snapshot.val();
        l1Count = l1Data ? Object.keys(l1Data).length : 0;
        
        // Sync Dashboard Node Count
        const nodeEl = document.getElementById('active-nodes-count'); // Check this ID in HTML
        const refEl = document.getElementById('ref-count');
        if(nodeEl) nodeEl.innerText = l1Count;
        if(refEl) refEl.innerText = l1Count;

        // L2 Calculation
        let l2Total = 0;
        if(l1Data) {
            const promises = Object.keys(l1Data).map(refKey => {
                return database.ref('users/' + refKey + '/myReferrals').once('value');
            });
            Promise.all(promises).then(snapshots => {
                snapshots.forEach(s => { if(s.exists()) l2Total += Object.keys(s.val()).length; });
                const l2El = document.getElementById('l2-count');
                if(l2El) l2El.innerText = l2Total;
            });
        }
    });
}

// 🛡️ TRUST SCORE
function calculateTrustScore(data) {
    const isAdmin = userWallet.toLowerCase() === ADMIN_WALLET.toLowerCase();
    let score = isAdmin ? 100 : 0; 
    if (!isAdmin) {
        if (data.balance > 100) score += 20;
        if (data.streak >= 1) score += 20;
        if (data.streak >= 5) score += 20;
        if (data.myReferrals) score += 20;
        if (data.lastClaim === new Date().toDateString()) score += 20;
    }
    const fill = document.getElementById('trust-fill');
    const status = document.getElementById('eligibility-status');
    if(fill) fill.style.width = score + "%";
    if(status) status.innerText = score >= 80 ? "NODE SECURE" : "SCANNING...";
}

// 📉 SCARCITY METER
function updateScarcityMeter(bal) {
    let percent = (bal / GENESIS_SUPPLY) * 100;
    if (percent > 100) percent = 100;
    const fill = document.getElementById('scarcity-fill');
    const txt = document.getElementById('scarcity-percent');
    if (fill) fill.style.width = percent + "%";
    if (txt) txt.innerText = percent.toFixed(2) + "%";
}

// ⛏️ MINING ENGINE
window.toggleMining = function() {
    miningActive = !miningActive;
    const btn = document.getElementById('mining-btn');
    if(btn) {
        btn.innerText = miningActive ? "MINING ACTIVE" : "INITIALIZE MINING";
        btn.style.boxShadow = miningActive ? "0 0 20px var(--cyan)" : "none";
    }
    if (miningActive) mineLoop();
};

function mineLoop() {
    if (!miningActive) return;
    const isAdmin = userWallet.toLowerCase() === ADMIN_WALLET.toLowerCase();
    let mineStep = isAdmin ? 0.0005 : (0.000025 * currentMultiplier); 
    balance += mineStep;
    updateDisplay();
    if (Math.random() > 0.98) {
        database.ref('users/' + userWallet).update({ balance: balance });
    }
    setTimeout(mineLoop, 3000);
}

// 🎁 CLAIM BONUS
window.claimDailyBonus = function() {
    const today = new Date().toDateString();
    database.ref('users/' + userWallet).once('value').then((snapshot) => {
        const data = snapshot.val() || {};
        if (data.lastClaim === today) return alert("Already Synced Today!");
        let newStreak = (data.streak || 0) + 1;
        let reward = 5.0 + (newStreak * 0.5);
        database.ref('users/' + userWallet).update({ balance: (data.balance || 0) + reward, streak: newStreak, lastClaim: today });
        alert(`System Synced! +${reward.toFixed(2)} ABP`);
    });
};
