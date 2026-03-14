// --- FIREBASE CONFIGURATION ---
// (अपनी Firebase Console वाली Keys यहाँ पेस्ट करें)
const firebaseConfig = {
    apiKey: "AIzaSyCJ2i6r8F66CxKpnbwMEhPS4pwC36V0Kgg",
    authDomain: "adamas-protocol.firebaseapp.com",
    databaseURL: "https://adamas-protocol-default-rtdb.firebaseio.com",
    projectId: "adamas-protocol",
    storageBucket: "adamas-protocol.firebasestorage.app",
    messagingSenderId: "207788425238",
    appId: "1:207788425238:web:025b8544f085dde60af537"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// --- GLOBAL USER STATE ---
let userStats = {
    wallet: "",
    realName: "",
    balance: 0,
    stakedAmount: 0,
    referralCount: 0,
    isSocialVerified: false,
    joinedDate: Date.now()
};

// --- CORE FUNCTIONS ---

// 1. Load or Create User Data
async function loadUserData(wallet) {
    userStats.wallet = wallet;
    const snapshot = await db.ref('users/' + wallet).once('value');
    
    if (snapshot.exists()) {
        userStats = snapshot.val();
        console.log("User Loaded:", userStats.realName);
    } else {
        // New User Initialization
        db.ref('users/' + wallet).set(userStats);
        console.log("New User Created in Firebase");
    }
    updateUI();
}

// 2. Save Data to Firebase (Strict Sync)
function saveToFirebase() {
    if (userStats.wallet) {
        db.ref('users/' + userStats.wallet).update(userStats);
    }
}

// 3. Update UI Across All Pages
function updateUI() {
    // Balance Elements
    const balEl = document.getElementById('balance');
    if (balEl) balEl.innerText = Math.floor(userStats.balance).toLocaleString();

    // Wallet Badge
    const wallEl = document.getElementById('walletBadge');
    if (wallEl) wallEl.innerText = userStats.wallet.substring(0, 6) + "..." + userStats.wallet.slice(-4);

    // Staking & Referrals
    if (document.getElementById('stakedBalance')) 
        document.getElementById('stakedBalance').innerText = userStats.stakedAmount + " ABP";
    if (document.getElementById('refCount')) 
        document.getElementById('refCount').innerText = userStats.referralCount + " Users";
}

// 4. Premium Notification System
function showNotification(text) {
    const notifyBox = document.createElement('div');
    notifyBox.style.cssText = `
        position: fixed; top: -60px; left: 50%; transform: translateX(-50%);
        background: #F3BA2F; color: #000; padding: 12px 25px;
        border-radius: 50px; font-weight: bold; transition: 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55);
        z-index: 99999; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    `;
    notifyBox.innerHTML = `💎 ${text}`;
    document.body.appendChild(notifyBox);

    setTimeout(() => {
        notifyBox.style.top = "20px";
        setTimeout(() => {
            notifyBox.style.top = "-100px";
            setTimeout(() => notifyBox.remove(), 600);
        }, 3000);
    }, 100);
}

// 5. Global Settings (Admin Control)
db.ref('settings').on('value', (snapshot) => {
    const settings = snapshot.val();
    if (settings && document.getElementById('globalTicker')) {
        document.getElementById('globalTicker').innerText = settings.ticker;
    }
});

