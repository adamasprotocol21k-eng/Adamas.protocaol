// Firebase Config - APNI DETAILS YAHA BHAREIN
const firebaseConfig = {
    apiKey: "PASTE_YOUR_API_KEY",
    databaseURL: "PASTE_YOUR_DB_URL",
    projectId: "PASTE_YOUR_PROJECT_ID",
    appId: "PASTE_YOUR_APP_ID"
};
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
