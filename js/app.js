// ADAMAS PROTOCOL - GLOBAL CORE SCRIPT
const firebaseConfig = {
    apiKey: "AIzaSyCJ2i6r8F66CxKpnbwMEhPS4pwC36V0Kgg",
    authDomain: "adamas-protocol.firebaseapp.com",
    databaseURL: "https://adamas-protocol-default-rtdb.firebaseio.com",
    projectId: "adamas-protocol",
    storageBucket: "adamas-protocol.firebasestorage.app",
    messagingSenderId: "207788425238",
    appId: "1:207788425238:web:025b8544f085dde60af537"
};

if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
const db = firebase.database();

window.userStats = {
    wallet: localStorage.getItem('adamas_wallet') || "0xGuest",
    balance: parseFloat(localStorage.getItem('adamas_balance')) || 0,
    referralCount: 0
};

// Global Save & Sync
function saveToFirebase() {
    if (window.userStats.wallet !== "0xGuest") {
        localStorage.setItem('adamas_balance', window.userStats.balance);
        db.ref('users/' + window.userStats.wallet).update({
            balance: window.userStats.balance,
            wallet: window.userStats.wallet,
            lastSeen: Date.now()
        });
    }
}

// Har page par data update karne ke liye
function syncData() {
    if (window.userStats.wallet !== "0xGuest") {
        db.ref('users/' + window.userStats.wallet).on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                window.userStats.balance = data.balance || 0;
                localStorage.setItem('adamas_balance', window.userStats.balance);
                updateUI();
            }
        });
    }
}

function updateUI() {
    const balTags = document.querySelectorAll('#balance, #walletBalance, #navBalance');
    balTags.forEach(el => el.innerText = Math.floor(window.userStats.balance));
    
    const walletTags = document.querySelectorAll('#walletBadge, #userWalletAddr');
    walletTags.forEach(el => {
        el.innerText = window.userStats.wallet.substring(0, 6) + "..." + window.userStats.wallet.slice(-4);
    });
}

function showNotification(msg) {
    const n = document.createElement('div');
    n.style = "position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#F3BA2F;color:#000;padding:12px 25px;border-radius:12px;z-index:999999;font-weight:bold;box-shadow:0 10px 30px rgba(0,0,0,0.5);";
    n.innerText = msg;
    document.body.appendChild(n);
    if(navigator.vibrate) navigator.vibrate(50);
    setTimeout(() => n.remove(), 3000);
}

syncData();
updateUI();
setInterval(updateUI, 1000);
