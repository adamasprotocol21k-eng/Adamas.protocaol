// --- INITIALIZE FIREBASE ---
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
const auth = firebase.auth();

// --- GLOBAL USER STATE ---
let userStats = {
    wallet: localStorage.getItem('adamas_wallet') || "",
    realName: "",
    balance: 0,
    stakedAmount: 0,
    referralCount: 0,
    isSocialVerified: localStorage.getItem('adamas_social_verified') === 'true'
};

// --- CORE DATA ENGINE (Single Function) ---
async function loadUserData(identifier) {
    if (!identifier) return;

    // Listen for Real-time changes from Firebase
    db.ref('users/' + identifier).on('value', (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            userStats.balance = data.balance || 0;
            userStats.realName = data.realName || "";
            userStats.stakedAmount = data.stakedAmount || 0;
            userStats.referralCount = data.referralCount || 0;
            userStats.isSocialVerified = data.isSocialVerified || false;
            
            // Sync with LocalStorage for safety
            if(data.isSocialVerified) localStorage.setItem('adamas_social_verified', 'true');
            
            updateUI(); 
        } else {
            // New User: Create Initial Profile
            db.ref('users/' + identifier).set({
                wallet: identifier,
                balance: 0,
                realName: "",
                stakedAmount: 0,
                referralCount: 0,
                isSocialVerified: userStats.isSocialVerified
            });
        }
    });
}

// --- SAVE DATA HELPER ---
function saveToFirebase() {
    const id = userStats.wallet;
    if (id) {
        db.ref('users/' + id).update({
            balance: userStats.balance,
            realName: userStats.realName,
            stakedAmount: userStats.stakedAmount,
            isSocialVerified: userStats.isSocialVerified
        }).catch(e => console.error("Sync Error:", e));
    }
}

// --- UI UPDATER ---
function updateUI() {
    // Update all balance displays
    document.querySelectorAll('#balance').forEach(el => {
        el.innerText = Math.floor(userStats.balance).toLocaleString();
    });
    
    // Update Wallet Badge
    const wallBadge = document.getElementById('walletBadge');
    if(wallBadge && userStats.wallet) {
        wallBadge.innerText = userStats.wallet.substring(0, 6) + "..." + userStats.wallet.slice(-4);
    }

    // Update Name Display if exists
    const nameDisp = document.getElementById('userNameDisplay');
    if(nameDisp && userStats.realName) {
        nameDisp.innerText = userStats.realName;
    }
}

// --- NOTIFICATION SYSTEM ---
function showNotification(text) {
    const n = document.createElement('div');
    n.style.cssText = "position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#F3BA2F;color:#000;padding:12px 25px;border-radius:50px;font-weight:bold;z-index:100000;box-shadow:0 10px 25px rgba(0,0,0,0.5);border:2px solid #fff;animation: slideDown 0.3s ease;";
    n.innerText = "💎 " + text;
    document.body.appendChild(n);
    setTimeout(() => {
        n.style.opacity = "0";
        setTimeout(() => n.remove(), 500);
    }, 3000);
}

// --- INITIALIZATION ---
// Check for Wallet login first
if(userStats.wallet) {
    loadUserData(userStats.wallet);
}

// Check for Google Auth changes
auth.onAuthStateChanged((user) => {
    if (user) {
        // If logged in via Google, use UID as the key
        loadUserData(user.uid);
    }
});
