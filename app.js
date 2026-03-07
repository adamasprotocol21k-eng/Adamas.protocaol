// AGAR MAINTENANCE ON KARNA HAI TO 'true' KAREIN, OFF KE LIYE 'false'
const MAINTENANCE_MODE = true; 

window.onload = () => {
    if (MAINTENANCE_MODE) {
        // Sab kuch chhupa do aur sirf Maintenance Screen dikhao
        document.body.innerHTML = `
            <div style="height:100vh; display:flex; flex-direction:column; justify-content:center; align-items:center; background:#020617; color:#00f2ff; font-family:'Orbitron',sans-serif; text-align:center; padding:20px;">
                <h1 style="font-size:50px; text-shadow:0 0 20px #00f2ff;">💎 ADAMAS UPGRADE</h1>
                <p style="color:white; font-size:20px;">Back-end work in progress. We are making Adamas stronger!</p>
                <div style="margin-top:20px; border:2px solid #00f2ff; padding:10px 20px; border-radius:50px;">COMING BACK SOON</div>
            </div>
        `;
    } else {
        console.log("Adamas Portal Live 🚀");
    }
};

// --- CONFIGURATION & STATE ---
let userAccount = null;
let userData = {
    balance: 0,
    staked: 0,
    referrals: 0,
    lastCheckIn: null,
    isStakingActive: false
};

const WITHDRAW_THRESHOLD = 5000;
const AMOY_CHAIN_ID = '0x13882';

// --- 1. WALLET & NETWORK CONNECTION ---
async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Request Accounts
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0];

            // Auto-Switch to Polygon Amoy (Point 4 & 7 of Whitepaper)
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: AMOY_CHAIN_ID }],
                });
            } catch (switchError) {
                // If network not added, add it
                if (switchError.code === 4902) {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: AMOY_CHAIN_ID,
                            chainName: 'Polygon Amoy Testnet',
                            nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                            rpcUrls: ['https://rpc-amoy.polygon.technology/'],
                            blockExplorerUrls: ['https://amoy.polygonscan.com/']
                        }]
                    });
                }
            }

            setupDashboard();
        } catch (err) {
            console.error("Auth Error:", err);
        }
    } else {
        alert("Please install MetaMask or Trust Wallet!");
    }
}

// --- 2. DASHBOARD SETUP ---
function setupDashboard() {
    document.getElementById('landing').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('walletBtn').innerText = userAccount.slice(0,6) + "..." + userAccount.slice(-4);
    document.getElementById('userAddress').innerText = userAccount;
    
    // Simulate Loading from Firebase (Point 9)
    loadFirebaseData();
}

// --- 3. REWARD SYSTEMS (Point 10 & 11) ---
function dailyCheckIn() {
    const now = new Date().getTime();
    // 24 Hour Check logic here
    const reward = Math.floor(Math.random() * 1000);
    userData.balance += reward;
    showNotification(`Protocol Fueled: +${reward} ABP`);
    updateUI();
}

function toggleStaking() {
    userData.isStakingActive = !userData.isStakingActive;
    document.getElementById('staking-status').innerText = userData.isStakingActive ? "ACTIVE (1%)" : "PAUSED";
    document.getElementById('staking-status').style.color = userData.isStakingActive ? "#00ff88" : "#ff4444";
}

// --- 4. GAMING ENGINE (Point 13 - Teen Patti) ---
function playSlots() {
    if (userData.balance < 50) return alert("Low ABP! Claim Daily Fuel first.");
    
    userData.balance -= 50;
    const cards = ["A", "K", "Q", "J", "10", "9"];
    const slot1 = cards[Math.floor(Math.random() * 6)];
    const slot2 = cards[Math.floor(Math.random() * 6)];
    const slot3 = cards[Math.floor(Math.random() * 6)];

    // Result Logic
    let winAmount = 0;
    if (slot1 === slot2 && slot2 === slot3) {
        if (slot1 === "A") winAmount = 2000;
        else if (slot1 === "K") winAmount = 1800;
        else if (slot1 === "Q") winAmount = 1600;
        else if (slot1 === "J") winAmount = 1500;
    } else {
        winAmount = Math.floor(Math.random() * 15) + 5; // Non-matching small reward
    }

    userData.balance += winAmount;
    updateUI();
    alert(`Matrix Spin: ${slot1} | ${slot2} | ${slot3} \nReward: ${winAmount} ABP`);
}

// --- 5. WITHDRAWAL SYSTEM (Point 6 & 13) ---
function updateUI() {
    const balanceEl = document.getElementById('ads-balance');
    balanceEl.innerText = userData.balance.toLocaleString();

    // Progress bar for 5000 ABP Threshold
    const progress = (userData.balance / WITHDRAW_THRESHOLD) * 100;
    const bar = document.getElementById('w-progress');
    bar.style.width = Math.min(progress, 100) + "%";
    
    document.getElementById('w-text').innerText = `Threshold: ${Math.floor(userData.balance)} / 5000 ABP`;

    const wBtn = document.getElementById('withdrawBtn');
    if (userData.balance >= WITHDRAW_THRESHOLD) {
        wBtn.disabled = false;
        wBtn.classList.add('active-withdraw');
        wBtn.innerText = "Withdraw to Mainnet";
    }
}

function showNotification(msg) {
    // Simple toast notification logic
    console.log(msg);
}

// Sync with Database (Placeholder)
function syncToCloud() {
    // db.collection('users').doc(userAccount).set(userData);
}
