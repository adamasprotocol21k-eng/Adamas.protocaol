let userAccount = null;
let currentBalance = 0;

// 1. WALLET CONNECT & SYNC
async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0];
            document.getElementById('walletBtn').innerText = userAccount.slice(0,6) + "..." + userAccount.slice(-4);
            
            // Landing page chhupao aur Social Gateway dikhao
            document.getElementById('landing-page').style.display = 'none';
            document.getElementById('social-gateway').style.display = 'block';
            
            console.log("Connected: " + userAccount);
        } catch (error) {
            alert("Connection failed!");
        }
    } else {
        alert("Please install MetaMask!");
    }
}

// 2. UNLOCK DASHBOARD
function unlockDashboard() {
    document.getElementById('social-gateway').style.display = 'none';
    document.getElementById('dashboard').style.display = 'grid';
    alert("Dashboard Unlocked! 💎");
}

// 3. DAILY CHECK-IN (0-5000 ABP Reward)
function dailyCheckIn() {
    // 0 se 5000 ke beech random number
    let reward = Math.floor(Math.random() * 5001);
    currentBalance += reward;
    
    // UI update karna
    document.getElementById('ads-balance').innerText = currentBalance.toFixed(2);
    alert("🎉 Congratulations! You won " + reward + " ABP points.");
}

// 4. STAKING LOGIC (Basic)
function stakeTokens() {
    if (currentBalance <= 0) {
        alert("Pehle points kamao!");
        return;
    }
    alert("Tokens Staked! 24h login rule active.");
}

function claimStaking() {
    alert("Reward claimed successfully!");
}

// 5. LOGO PUZZLE CHECK
function checkPuzzle() {
    let puzzleReward = Math.floor(Math.random() * 1001);
    currentBalance += puzzleReward;
    document.getElementById('ads-balance').innerText = currentBalance.toFixed(2);
    alert("Logo Adjusted! Reward: " + puzzleReward + " ABP");
}
