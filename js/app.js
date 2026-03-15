// 1. DATABASE CONFIGURATION
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
const db = firebase.firestore();
// ==========================================
// ADAMAS PROTOCOL - MASTER LOGIC (FIXED)
// ==========================================

// 1. Initial Load: Check if button is ready and user is already connected
window.onload = function() {
    console.log("Adamas App Initialized");
    
    // Assign direct click event to the button
    const connectBtn = document.getElementById('connectBtn');
    if (connectBtn) {
        connectBtn.onclick = async function() {
            await connectWallet();
        };
    }

    // Auto-redirect if already connected (for smoother flow)
    const savedWallet = localStorage.getItem('userWallet');
    if (savedWallet) {
        console.log("Wallet already found: ", savedWallet);
        // window.location.href = 'dashboard.html'; 
    }
};

// 2.// Wallet connection fix
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('connectBtn');
    if (btn) {
        btn.onclick = async function() {
            console.log("Connecting...");
            if (typeof window.ethereum !== 'undefined') {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    localStorage.setItem('userWallet', accounts[0]);
                    window.location.href = 'dashboard.html'; // Seedha dashboard pe bhej do
                } catch (err) {
                    alert("Connection reject kar di gayi.");
                }
            } else {
                alert("MetaMask nahi mila! Please MetaMask browser use karein.");
                window.open('https://metamask.app.link/dapp/' + window.location.host);
            }
        };
    }
});

    } else {
        // If no provider (MetaMask, etc.) is found
        console.log("No Ethereum provider found.");
        alert("Bhai! MetaMask ya koi aur Web3 wallet nahi mila. Please ensure MetaMask extension is installed, or if you are on mobile, use the MetaMask App's browser.");
        
        // Optional: Open a link to download MetaMask
        window.open('https://metamask.app.link/dapp/' + window.location.host, '_blank');
    }
}
