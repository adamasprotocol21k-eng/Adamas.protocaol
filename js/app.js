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

// 2. The Core Wallet Connection Logic
async function connectWallet() {
    console.log("Attempting to connect wallet...");

    // Check for Mobile or Desktop EIP-1193 Provider
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Request account access from the user
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const walletAddress = accounts[0];
            
            console.log("Success! Wallet Address:", walletAddress);
            
            // Save to LocalStorage
            localStorage.setItem('userWallet', walletAddress);
            
            // Show confirmation (you can remove this alert later for a smoother flow)
            alert("Bhai! Wallet Connected:\n" + walletAddress);
            
            // Redirect to the dashboard page
            window.location.href = 'dashboard.html';
            
        } catch (error) {
            // User denied access
            if (error.code === 4001) {
                alert("Bhai, aapne connection reject kar di. Continue karne ke liye connect karna zaruri hai.");
            } else {
                console.error("Connection Error:", error);
                alert("Kuch error aaya hai. Console check karein.");
            }
        }
    } else {
        // If no provider (MetaMask, etc.) is found
        console.log("No Ethereum provider found.");
        alert("Bhai! MetaMask ya koi aur Web3 wallet nahi mila. Please ensure MetaMask extension is installed, or if you are on mobile, use the MetaMask App's browser.");
        
        // Optional: Open a link to download MetaMask
        window.open('https://metamask.app.link/dapp/' + window.location.host, '_blank');
    }
}
