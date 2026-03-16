// ==========================================
// 1. FIREBASE CONFIGURATION (Modular V10)
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getDatabase, ref, get, set, update, onValue, increment } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";

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
window.fullWallet = "";

// ==========================================
// 2. MASTER LOGIC & WALLET CONNECTION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Check if we already have a session
    const savedWallet = localStorage.getItem('userWallet');
    if (savedWallet) {
        setupUser(savedWallet);
    }

    const connectBtn = document.getElementById('connectBtn');
    if (connectBtn) {
        connectBtn.onclick = async () => await connectWallet();
    }
});

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setupUser(accounts[0]);
            // Redirect logic only if on landing page
            if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
                window.location.href = 'dashboard.html';
            }
        } catch (error) {
            console.error("Wallet connection failed:", error);
        }
    } else {
        // Deep link for mobile users
        const dappUrl = window.location.href.split('://')[1];
        window.open('https://metamask.app.link/dapp/' + dappUrl, '_blank');
    }
}

async function setupUser(wallet) {
    window.fullWallet = wallet.toLowerCase();
    window.userKey = window.fullWallet.substring(0, 10);
    localStorage.setItem('userWallet', window.fullWallet);
    
    const userRef = ref(db, 'users/' + window.userKey);
    
    // Live Sync with Database
    onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            window.currentBalance = data.currentBalance || 0;
            updateGlobalUI();
        } else {
            // New User: 100 ABP Welcome Bonus
            set(userRef, {
                walletAddress: window.fullWallet,
                currentBalance: 100,
                joinedAt: new Date().toISOString(),
                status: "active"
            });
            console.log("New Node Created in Adamas Protocol");
        }
    });
}

// ==========================================
// 3. SECURE BALANCE UPDATER
// ==========================================
// Amount positive (earn) ya negative (bet/spend) ho sakta hai
window.updateBalance = async (amount, activityName) => {
    if (!window.userKey) return false;

    try {
        const userRef = ref(db, 'users/' + window.userKey);
        await update(userRef, {
            currentBalance: increment(amount),
            lastActivity: activityName,
            lastSeen: new Date().toISOString()
        });
        return true;
    } catch (err) {
        console.error("Transaction Error:", err);
        return false;
    }
};

function updateGlobalUI() {
    // Ye function har page par balance elements ko update karega
    const elements = ['userBal', 'headerBal', 'dashboardBal'];
    elements.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.innerText = parseFloat(window.currentBalance).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
    });
}

export { db };
