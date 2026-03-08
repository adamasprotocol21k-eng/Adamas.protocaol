// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJ2i6r8F66CxKpnbwMEhPS4pwC36V0Kgg",
  authDomain: "adamas-protocol.firebaseapp.com",
  databaseURL: "https://adamas-protocol-default-rtdb.firebaseio.com",
  projectId: "adamas-protocol",
  storageBucket: "adamas-protocol.firebasestorage.app",
  messagingSenderId: "207788425238",
  appId: "1:207788425238:web:025b8544f085dde60af537",
  measurementId: "G-NVCWQ1XQZS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let currentUser = null;

// 1. Working Wallet Connection
async function connectWallet() {
    if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        currentUser = accounts[0];
        document.getElementById('userAddr').innerText = "Wallet: " + currentUser.substring(0, 6) + "...";
        document.getElementById('walletConnect').innerText = "Connected";
        loadUserData();
    } else {
        alert("MetaMask Install Karein!");
    }
}

// 2. Load Data from Firebase
function loadUserData() {
    if(!currentUser) return;
    db.ref('users/' + currentUser).on('value', (snapshot) => {
        const data = snapshot.val();
        if(data) {
            document.getElementById('abpBalance').innerText = data.balance.toFixed(2);
            document.getElementById('stakedAmt').innerText = data.staked + " ABP";
        } else {
            // New User Setup
            db.ref('users/' + currentUser).set({ balance: 100, staked: 0 });
        }
    });
}

// 3. Daily Claim Reward
function claimDailyReward() {
    if(!currentUser) return alert("Pehle Wallet Connect Karein!");
    const reward = 10.00;
    db.ref('users/' + currentUser + '/balance').transaction((current) => (current || 0) + reward);
    alert("💎 10 ABP Diamond Reward Claimed!");
}

// 4. Mining Logic
function handleMining() {
    const btn = document.getElementById('mainActionBtn');
    btn.innerText = "Processing Diamond Mining...";
    btn.disabled = true;
    
    setTimeout(() => {
        alert("Mining Started! Rewards will be added in next session.");
        btn.innerText = "Mining Active";
        btn.style.background = "#39ff14";
        btn.style.color = "#000";
    }, 2000);
}

// 5. Game Navigation
function openGame(game) {
    alert(game + " Loading... Please wait.");
    // window.location.href = game.toLowerCase() + ".html";
}
