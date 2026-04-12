/**
 * ADAMAS PROTOCOL - DASHBOARD CORE (V11.9 - VAULT & RANK OPTIMIZED)
 * Status: Production Ready | Fixed: Rank, Refs, Streak & Vault Sync
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

    const addressEl = document.getElementById('user-address');
    if (addressEl) {
        addressEl.innerText = userWallet.slice(0, 6) + "..." + userWallet.slice(-4);
    }

    const baseUrl = window.location.origin + window.location.pathname.replace('dashboard.html', 'index.html').replace('vault.html', 'index.html');
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
            loadNetworkStats(); 
            updateScarcityMeter(balance);
        }
    });
};

// 💎 FORMATTING ENGINE
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

    // 🔥 Sync Vault Data if on Vault Page
    syncVaultData(balance, currentStreak, l1Count);
}

// 🔥 VAULT & RANK SYNC ENGINE
function syncVaultData(bal, streak, refs) {
    const cp = document.getElementById('check-points');
    const cr = document.getElementById('check-refs');
    const cs = document.getElementById('check-streak');
    const tr = document.getElementById('target-rank-name');
    const tierName = document.getElementById('elite-tier-name');
    const tierFill = document.getElementById('tier-progress-fill');

    // Vault Page Update
    if (cp) cp.innerText = `${Math.floor(bal)}/10,000`;
    if (cr) cr.innerText = `${refs}/3`;
    if (cs) cs.innerText = `${streak}/10 Days`;
    if (tr) tr.innerText = refs >= 2 ? "GOLD NODE" : "SILVER NODE";

    // Dashboard Rank Update (Silver Rank Fix)
    if (tierName) {
        if (userWallet.toLowerCase() === ADMIN_WALLET.toLowerCase()) {
            tierName.innerText = "DIAMOND FOUNDER";
        } else if (refs >= 2 || bal >= 1000) {
            tierName.innerText = "SILVER NODE";
            tierName.style.color = "var(--cyan)";
            if(tierFill) tierFill.style.width = "70%";
        } else {
            tierName.innerText = "BRONZE NODE";
            if(tierFill) tierFill.style.width = "30%";
        }
    }
}

function loadNetworkStats() {
    database.ref('users/' + userWallet + '/myReferrals').on('value', (snapshot) => {
        const l1Data = snapshot.val();
        l1Count = l1Data ? Object.keys(l1Data).length : 0;
        
        const refEl = document.getElementById('ref-count');
        if(refEl) refEl.innerText = l1Count;
        
        // Refresh Vault with new Ref count
        syncVaultData(balance, currentStreak, l1Count);
    });
}

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
    // Point 2: Status Text Fix
    if(status) status.innerText = "PROTOCOL SECURED ✅";
}

function updateScarcityMeter(bal) {
    let percent = (bal / GENESIS_SUPPLY) * 100;
    const fill = document.getElementById('scarcity-fill');
    const genFill = document.getElementById('genesis-fill');
    const txt = document.getElementById('scarcity-percent');
    const genTxt = document.getElementById('genesis-percent');

    if (fill) fill.style.width = Math.min(percent, 100) + "%";
    if (genFill) genFill.style.width = Math.min(percent, 100) + "%";
    if (txt) txt.innerText = Math.min(percent, 100).toFixed(2) + "%";
    if (genTxt) genTxt.innerText = Math.min(percent, 100).toFixed(2) + "%";
}

window.toggleMining = function() {
    miningActive = !miningActive;
    const btn = document.getElementById('mining-btn');
    if(btn) {
        btn.innerText = miningActive ? "MINING ACTIVE" : "INITIALIZE MINING";
    }
    if (miningActive) mineLoop();
};

function mineLoop() {
    if (!miningActive) return;
    let mineStep = (userWallet.toLowerCase() === ADMIN_WALLET.toLowerCase()) ? 0.005 : (0.000025 * currentMultiplier); 
    balance += mineStep;
    updateDisplay();
    if (Math.random() > 0.98) database.ref('users/' + userWallet).update({ balance: balance });
    setTimeout(mineLoop, 3000);
}

window.claimDailyBonus = function() {
    const today = new Date().toDateString();
    database.ref('users/' + userWallet).once('value').then((snapshot) => {
        const data = snapshot.val() || {};
        if (data.lastClaim === today) return alert("Already Synced Today!");
        let newStreak = (data.streak || 0) + 1;
        database.ref('users/' + userWallet).update({ balance: (data.balance || 0) + 5, streak: newStreak, lastClaim: today });
        alert(`System Synced! Streak: ${newStreak} Days`);
    });
};
