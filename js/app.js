// ==========================================
// 1. FIREBASE CONFIGURATION (Modular V10)
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, get, set, update, onValue } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyCJ2i6r8F66CxKpnbwMEhPS4pwC36V0Kgg",
    authDomain: "adamas-protocol.firebaseapp.com",
    databaseURL: "https://adamas-protocol-default-rtdb.firebaseio.com",
    projectId: "adamas-protocol",
    appId: "1:207788425238:web:025b8544f085dde60af537"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Global Variables
window.userKey = "";
window.currentBalance = 0;

// ==========================================
// 2. MASTER LOGIC & WALLET CONNECTION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    const connectBtn = document.getElementById('connectBtn');
    if (connectBtn) {
        connectBtn.onclick = async function() {
            await connectWallet();
        };
    }
    // Auto-check on load
    checkExistingConnection();
});

async function checkExistingConnection() {
    if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            setupUser(accounts[0]);
        }
    }
}

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setupUser(accounts[0]);
            alert("Wallet Connected!");
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error("Connection failed:", error);
        }
    } else {
        window.open('https://metamask.app.link/dapp/' + window.location.host, '_blank');
    }
}

async function setupUser(wallet) {
    window.userKey = wallet.substring(0, 10);
    localStorage.setItem('userWallet', wallet);
    
    const userRef = ref(db, 'users/' + window.userKey);
    
    // Live Balance Sync
    onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            window.currentBalance = data.currentBalance || 0;
            updateUI();
        } else {
            // New User Registration
            set(userRef, {
                walletAddress: wallet,
                currentBalance: 100,
                joinedAt: new Date().toISOString()
            });
        }
    });
}

// Points Add Karne Ka Global Function (Earn aur Games isi ko call karenge)
window.addPointsToDB = async (amount, source) => {
    if (!window.userKey) return;
    
    const newTotal = window.currentBalance + amount;
    try {
        await update(ref(db, 'users/' + window.userKey), {
            currentBalance: newTotal,
            lastActivity: source
        });
        console.log(`${amount} Points added from ${source}`);
        return true;
    } catch (e) {
        console.error("Point update error:", e);
        return false;
    }
};

function updateUI() {
    const display = document.getElementById('userBal') || document.getElementById('headerBal');
    if (display) display.innerText = Math.floor(window.currentBalance).toLocaleString();
}
