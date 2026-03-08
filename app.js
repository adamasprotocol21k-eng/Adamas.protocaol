// Firebase Configuration (Yahan apni detail bharna)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let currentBalance = 1000.00;
const walletAddr = "0x1E12BFE8eB6Ef1334cF8f873F2d9Abad5C56daDB";

// 1. Working Claim Daily Function
async function claimDaily() {
    const reward = 50.00; // Daily reward in ABP
    currentBalance += reward;
    
    // Update UI
    document.getElementById('abpBalance').innerText = currentBalance.toFixed(2);
    
    // Save to Firebase
    database.ref('users/' + walletAddr).update({
        balance: currentBalance,
        lastClaim: new Date().getTime()
    });

    alert("🎉 Diamond Reward! 50 ABP Points added to your wallet.");
}

// 2. Stake/Mine Function
function startMining() {
    const btn = document.querySelector('.btn-stake');
    btn.innerText = "Mining Active...";
    btn.style.background = "#555";
    
    // Backend Logic for ABP Mining
    setTimeout(() => {
        alert("Mining cycle complete! Check your rewards.");
        btn.innerText = "Stake Amount";
        btn.style.background = "linear-gradient(90deg, var(--diamond-blue), var(--neon-green))";
    }, 5000);
}

// 3. Game Redirects
function openGame(gameName) {
    if(gameName === 'Teen Patti') {
        window.location.href = "teenpatti.html"; // Create this file next
    } else if(gameName === 'Lottery') {
        alert("💎 Adamas Jackpot Lottery coming in 24 hours!");
    }
}
