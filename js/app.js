// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJ2i6r8F66CxKpnbwMEhPS4pwC36V0Kgg",
  authDomain: "adamas-protocol.firebaseapp.com",
  databaseURL: "https://adamas-protocol-default-rtdb.firebaseio.com",
  projectId: "adamas-protocol",
  storageBucket: "adamas-protocol.firebasestorage.app",
  messagingSenderId: "207788425238",
  appId: "1:207788425238:web:025b8544f085dde60af537"
};

// Initialize
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let userStats = {
    balance: 0,
    staked: 0,
    wallet: "",
    tasksDone: { tg: false, x: false }
};

// 1. Link Wallet & Fetch Data
function linkWallet() {
    const wallet = document.getElementById('walletInput').value.trim();
    if(wallet.length < 10) { alert("Invalid Wallet Address!"); return; }

    localStorage.setItem('adamas_wallet', wallet);
    
    // Check Firebase for Existing User
    db.ref('users/' + wallet).once('value').then((snapshot) => {
        if (snapshot.exists()) {
            userStats = snapshot.val();
            alert("Welcome Back! Data Synced.");
        } else {
            userStats.wallet = wallet;
            db.ref('users/' + wallet).set(userStats);
            alert("New Node Registered!");
        }
        document.getElementById('step1').style.display = 'none';
        document.getElementById('step2').style.display = 'block';
    });
}

// 2. Mark Social Tasks
function markDone(type) {
    userStats.tasksDone[type] = true;
    if(userStats.tasksDone.tg && userStats.tasksDone.x) {
        const btn = document.getElementById('finalEnter');
        btn.disabled = false;
        btn.style.opacity = "1";
        btn.classList.add('unlocked-btn');
        
        // Give Bonus for first time
        if(userStats.balance === 0) userStats.balance = 1000;
        saveToFirebase();
    }
}

// 3. Save Everything to Firebase
function saveToFirebase() {
    const wallet = localStorage.getItem('adamas_wallet');
    if(wallet) {
        db.ref('users/' + wallet).set(userStats);
    }
}

function enterDashboard() {
    window.location.href = "dashboard.html";
}

// Global Update UI (Call this in every page's onload)
function updateUI() {
    const wallet = localStorage.getItem('adamas_wallet');
    if(!wallet && window.location.pathname !== "/connect.html") {
        window.location.href = "connect.html";
        return;
    }
    
    db.ref('users/' + wallet).on('value', (snapshot) => {
        userStats = snapshot.val();
        if(document.getElementById('balance')) document.getElementById('balance').innerText = Math.floor(userStats.balance).toLocaleString();
        if(document.getElementById('walletAddress')) document.getElementById('walletAddress').innerText = wallet.substring(0,6) + "..." + wallet.substring(wallet.length-4);
    });
}
