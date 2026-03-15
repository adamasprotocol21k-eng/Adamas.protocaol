// --- FIREBASE CONFIGURATION (Verified) ---
const firebaseConfig = {
    apiKey: "AIzaSyCJ2i6r8F66CxKpnbwMEhPS4pwC36V0Kgg",
    authDomain: "adamas-protocol.firebaseapp.com",
    databaseURL: "https://adamas-protocol-default-rtdb.firebaseio.com",
    projectId: "adamas-protocol",
    storageBucket: "adamas-protocol.firebasestorage.app",
    messagingSenderId: "207788425238",
    appId: "1:207788425238:web:025b8544f085dde60af537"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// --- STATE MANAGEMENT ---
let userStats = {
    wallet: localStorage.getItem('adamas_wallet') || "",
    balance: 0,
    referralCount: 0,
    lastCheckIn: ""
};

// --- SCRATCH CARD LOGIC (AS PER YOUR PERCENTAGE) ---
function calculateScratchReward() {
    const r = Math.random() * 100;
    if (r <= 2) return Math.floor(Math.random() * 1001) + 1000; // 2% Jackpot
    if (r <= 5) return Math.floor(Math.random() * 401) + 600;   // 3% High
    if (r <= 30) return Math.floor(Math.random() * 201) + 400;  // 25% Medium
    return Math.floor(Math.random() * 301) + 100;              // 70% Base
}

// --- TEEN PATTI ENGINE ---
function rollPatti() {
    const cards = ["A", "K", "Q", "J", "10"];
    const p1 = cards[Math.floor(Math.random() * cards.length)];
    const p2 = cards[Math.floor(Math.random() * cards.length)];
    const p3 = cards[Math.floor(Math.random() * cards.length)];
    
    if (p1 === p2 && p2 === p3) return { win: true, amount: 2500, type: 'TRIO' };
    if (p1 === p2 || p2 === p3 || p1 === p3) return { win: true, amount: 15, type: 'PAIR' };
    return { win: false, amount: 0 };
}

// --- MINES COOLDOWN LOGIC ---
function triggerMinesBomb() {
    // 30 Seconds Cooldown implementation
    localStorage.setItem('mines_lock', Date.now() + 30000);
    alert("System Overload! 30s Cooldown Active.");
}
